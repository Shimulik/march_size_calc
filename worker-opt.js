
let ABORT = false;
self.onmessage = (ev) => {
  const { type, payload } = ev.data;
  if (type === 'start') run(payload).catch(err => postError(err));
  if (type === 'abort') ABORT = true;
};
function postProgress(p){ self.postMessage({ type:'progress', payload: p }); }
function postError(err){ self.postMessage({ type:'error', payload:{ message: err?.message || String(err) } }); }


function sumKeysFromObj(obj, keys){
  let sum = 0;
  if (!obj || !keys) return 0;
  for (const k of keys) if (typeof obj[k] === 'number') sum += obj[k];
  return sum;
}
function getStatsFromPiece(piece, level, rarity){
  if (!piece || !piece.stats) return null;
  const statsTable = piece.stats;
  const lvl = String(level);
  if (statsTable[rarity] && statsTable[rarity][lvl]) {
    const s = statsTable[rarity][lvl];
    return { flatObj: s, flatStats: s, percent: Number(s.percent || 0) };
  }
  if (statsTable[rarity]) {
    const avail = Object.keys(statsTable[rarity]).filter(k => statsTable[rarity][k]);
    if (avail.length) {
      let closest = avail.reduce((a,b) => Math.abs(Number(a)-Number(lvl)) <= Math.abs(Number(b)-Number(lvl)) ? a : b);
      const s = statsTable[rarity][closest];
      return { flatObj: s, flatStats: s, percent: Number(s.percent || 0) };
    }
  }
  for (const rKey of Object.keys(statsTable)) {
    if (statsTable[rKey] && statsTable[rKey][lvl]) {
      const s = statsTable[rKey][lvl];
      return { flatObj: s, flatStats: s, percent: Number(s.percent || 0) };
    }
  }
  return null;
}

async function run(opts){
  ABORT = false;
  const {
    items, scenarios, scenarioKey,
    INHERENT_BONUS = 0,
    topM = null,
    maxCombos = 500000,
    maxPairChecks = 20000000,
    debug = false,
    eps = 1e-12
  } = opts;

  const scenario = scenarios && scenarios[scenarioKey];
  if (!scenario) throw new Error('Scenario not found: ' + scenarioKey);

  const REQUIRED_SLOTS = ['helmet','chest','pants','boots','ring','weapon'];
  for (const s of REQUIRED_SLOTS) {
    if (!Array.isArray(items[s])) throw new Error(`Missing slot ${s}`);
    if (items[s].length === 0) throw new Error(`Slot ${s} is empty`);
  }

  
  const slotPieces = {}; const slotOriginalCounts = {};
  for (const s of REQUIRED_SLOTS){
    if (ABORT) throw new Error('Aborted');
    const arr = [];
    const piecesArr = items[s] || [];
    for (let idx=0; idx<piecesArr.length; idx++){
      const piece = piecesArr[idx];
      const allowedRarities = Array.isArray(piece.allowedRarities) && piece.allowedRarities.length ? piece.allowedRarities : Object.keys(piece.stats || {});
      const allowedLevelsSet = new Set();
      for (const r of allowedRarities){
        const lvObj = piece.stats?.[r];
        if (lvObj) for (const L of Object.keys(lvObj)) allowedLevelsSet.add(Number(L));
      }
      const allowedLevels = Array.from(allowedLevelsSet).filter(v=>Number.isFinite(v)).sort((a,b)=>a-b);
      let bestFlat = -Infinity, bestPercent = -Infinity;
      for (const r of allowedRarities){
        for (const L of allowedLevels){
          const st = getStatsFromPiece(piece, L, r);
          if (!st) continue;
          const flat = sumKeysFromObj(st.flatStats || st.flatObj || {}, scenario.flat_keys || []);
          let percent = 0;
          if (scenario.percent_keys && scenario.percent_keys.length) percent = sumKeysFromObj(st.flatStats || st.flatObj || {}, scenario.percent_keys || []);
          percent += Number(st.percent || 0);
          if (flat > bestFlat) bestFlat = flat;
          if (percent > bestPercent) bestPercent = percent;
        }
      }
      if (bestFlat === -Infinity) bestFlat = 0;
      if (bestPercent === -Infinity) bestPercent = 0;
      arr.push({ originalIndex: idx, piece, name: piece.name || piece.id, image: piece.image || null, bestFlat, bestPercent, allowedRarities, allowedLevels });
    }
    slotPieces[s] = arr;
    slotOriginalCounts[s] = arr.length;
  }

  
  const prunedSlots = {};
  for (const s of REQUIRED_SLOTS){
    const arr = slotPieces[s].slice();
    arr.sort((a,b) => (b.bestFlat - a.bestFlat) || (b.bestPercent - a.bestPercent) || a.name.localeCompare(b.name));
    const kept = [];
    for (const p of arr){
      if (ABORT) throw new Error('Aborted');
      let dominated = false;
      for (const q of kept){
        if (q.bestFlat >= p.bestFlat - eps && q.bestPercent >= p.bestPercent - eps && (q.bestFlat > p.bestFlat + eps || q.bestPercent > p.bestPercent + eps)){
          dominated = true; break;
        }
      }
      if (!dominated) kept.push(p);
    }
    prunedSlots[s] = kept;
    if (kept.length === 0) throw new Error(`All items pruned from slot ${s}`);
  }

  
  const effectiveSlots = {};
  for (const s of REQUIRED_SLOTS){
    let arr = prunedSlots[s];
    if (topM && arr.length > topM){
      const maxBaseEstimate = 100000;
      arr.sort((a,b) => (b.bestFlat + b.bestPercent*maxBaseEstimate) - (a.bestFlat + a.bestPercent*maxBaseEstimate));
      arr = arr.slice(0, topM);
    }
    effectiveSlots[s] = arr;
  }

  
  const slotArrays = REQUIRED_SLOTS.map(s => effectiveSlots[s]);
  const pieceVariantLists = [];
  for (let si=0; si<REQUIRED_SLOTS.length; si++){
    const kept = slotArrays[si];
    const pieceLists = [];
    for (const p of kept){
      const piece = p.piece;
      const allowedRarities = Array.isArray(p.allowedRarities) && p.allowedRarities.length ? p.allowedRarities : (Object.keys(piece.stats || {}));
      let allowedLevelsFinal = Array.isArray(p.allowedLevels) && p.allowedLevels.length ? p.allowedLevels : [];
      if (!allowedLevelsFinal || allowedLevelsFinal.length === 0){
        const setL = new Set();
        for (const r of allowedRarities){ const lvObj = piece.stats?.[r]; if (lvObj) for (const L of Object.keys(lvObj)) setL.add(Number(L)); }
        allowedLevelsFinal = Array.from(setL).filter(v=>Number.isFinite(v)).sort((a,b)=>a-b);
      }
      const varList = [];
      for (const r of allowedRarities){
        for (const L of allowedLevelsFinal){
          const st = getStatsFromPiece(piece, L, r);
          if (!st) continue;
          const flat = sumKeysFromObj(st.flatStats || st.flatObj || {}, scenario.flat_keys || []);
          let percent = 0;
          if (scenario.percent_keys && scenario.percent_keys.length) percent = sumKeysFromObj(st.flatStats || st.flatObj || {}, scenario.percent_keys || []);
          percent += Number(st.percent || 0);
          varList.push({ level: L, rarity: r, flat, percent, raw: st.flatObj || st.flatStats || {} });
        }
      }
      pieceLists.push(varList);
    }
    pieceVariantLists.push(pieceLists);
  }

  
  const slotFlatLists = [];
  for (let si=0; si<REQUIRED_SLOTS.length; si++){
    const flatList = [];
    for (let pi=0; pi<slotArrays[si].length; pi++){
      const vlist = pieceVariantLists[si][pi];
      for (let vi=0; vi<vlist.length; vi++) flatList.push({ pieceIndex: pi, variantIndex: vi });
    }
    if (flatList.length === 0) throw new Error(`Slot ${REQUIRED_SLOTS[si]} has no flattened variants`);
    slotFlatLists.push(flatList);
  }

  
  const lengths = slotFlatLists.map(a=>a.length);
  const exactCombCount = lengths.reduce((a,b)=>a*b, 1);
  if (exactCombCount > maxCombos) throw new Error(`Exact combos ${exactCombCount} exceeds maxCombos ${maxCombos}`);

  
  const combos = [];
  const indices = new Array(6).fill(0);
  const totalToProduce = lengths.reduce((a,b)=>a*b,1);
  let produced = 0;
  while (true){
    if (ABORT) throw new Error('Aborted');
    let total_flat = 0;
    let total_percent = INHERENT_BONUS || 0;
    const combo_names = {};
    for (let i=0;i<6;i++){
      const entry = slotFlatLists[i][ indices[i] ];
      const pieceChoice = slotArrays[i][ entry.pieceIndex ];
      const variantChoice = pieceVariantLists[i][ entry.pieceIndex ][ entry.variantIndex ];
      total_flat += variantChoice.flat;
      total_percent += variantChoice.percent;
      combo_names[REQUIRED_SLOTS[i]] = { pieceId: pieceChoice.piece?.id || null, name: pieceChoice.name, level: variantChoice.level, rarity: variantChoice.rarity };
    }
    const a = 1 + total_percent;
    const b = total_flat * a;
    combos.push({ combo_names, a, b, total_flat, total_percent });

    produced++;
    if (produced % 10000 === 0) postProgress({ step: 'Enumerating', message: `Enumerated ${produced}/${totalToProduce}` });

    
    let pos = 5;
    while (pos >= 0){
      indices[pos]++;
      if (indices[pos] < lengths[pos]) break;
      indices[pos] = 0;
      pos--;
    }
    if (pos < 0) break;
  }

  
  const breakpointsSet = new Set(); breakpointsSet.add(0);
  const n = combos.length;
  let pairChecks = 0;
  const maxPairChecksVal = Number.isFinite(maxPairChecks) && maxPairChecks > 0 ? Math.floor(maxPairChecks) : 20000000;
  const comboAB = combos.map((c, idx) => ({ a: c.a, b: c.b, idx }));
  for (let i=0;i<n;i++){
    if (ABORT) throw new Error('Aborted');
    for (let j=i+1;j<n;j++){
      if (ABORT) throw new Error('Aborted');
      pairChecks++;
      if (pairChecks > maxPairChecksVal) throw new Error(`Exceeded max pair checks ${maxPairChecksVal}`);
      const ai = comboAB[i].a, aj = comboAB[j].a;
      const da = ai - aj;
      if (Math.abs(da) <= eps) continue;
      const bi = comboAB[i].b, bj = comboAB[j].b;
      const B = (bj - bi) / da;
      if (!isFinite(B)) continue;
      if (B >= -eps) breakpointsSet.add(Math.max(0, B).toFixed(12));
    }
  }

  const breakpointsArr = Array.from(breakpointsSet).map(x=>parseFloat(x)).filter(x=>!Number.isNaN(x)).sort((a,b)=>a-b);

  
  const intervalsRaw = [];
  for (let k=0;k<breakpointsArr.length;k++){
    if (ABORT) throw new Error('Aborted');
    const x0 = breakpointsArr[k];
    const x1 = (k+1<breakpointsArr.length)?breakpointsArr[k+1]:null;
    let test_x = (x1===null) ? x0 + 1.0 : (x0 + x1) / 2;
    if (test_x <= x0 + eps) test_x = x0 + (x1===null ? 1e-6 : Math.min(1e-6,(x1-x0)/2));
    let bestVal = -Infinity, bestIdx = -1;
    for (let i=0;i<n;i++){
      const c = combos[i];
      const val = c.a * test_x + c.b;
      if (val > bestVal + eps){ bestVal = val; bestIdx = i; }
    }
    const chosen = combos[bestIdx];
    intervalsRaw.push({ from: x0, to: x1, combo_names: chosen.combo_names, slope: chosen.a, intercept: chosen.b, total_flat: chosen.total_flat, total_percent: chosen.total_percent });
  }

  
  const merged = [];
  for (const it of intervalsRaw){
    if (merged.length === 0){ merged.push(Object.assign({}, it)); continue; }
    const prev = merged[merged.length-1];
    const sameCombo = REQUIRED_SLOTS.every(s => prev.combo_names[s].pieceId === it.combo_names[s].pieceId && prev.combo_names[s].level === it.combo_names[s].level && prev.combo_names[s].rarity === it.combo_names[s].rarity);
    const slopesClose = Math.abs(prev.slope - it.slope) <= eps;
    const interceptClose = Math.abs(prev.intercept - it.intercept) <= eps;
    if (sameCombo && slopesClose && interceptClose && Math.abs((prev.to===null?Infinity:prev.to) - it.from) <= 1e-9) prev.to = it.to;
    else merged.push(Object.assign({}, it));
  }

  self.postMessage({ type:'result', payload: { intervals: merged, candidateCount: combos.length, breakpointsCount: breakpointsArr.length, prunedCounts: Object.fromEntries(REQUIRED_SLOTS.map(s => [s, (prunedSlots[s] || []).length])) } });
}
