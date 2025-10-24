




const SLOTS = ['helmet','chest','pants','boots','ring','weapon'];

let userInstances = {};
function ensureUserInstances(){ for(const s of SLOTS) if(!Array.isArray(userInstances[s])) userInstances[s]=[]; }

const slotsGrid = document.getElementById('slotsGrid');
const scenarioSelect = document.getElementById('scenario');
const computeBtn = document.getElementById('computeBtn');
const resetBtn = document.getElementById('resetBtn');

const keepBtn = document.getElementById('keep8');
const waifBtn = document.getElementById('waif6');
const outputEl = document.getElementById('output');

let worker = null;


let inherentBonus = 0; 
const BONUS_MAP = { keep8: 0.08, waif6: 0.0656 }; 

function recomputeInherentBonus() {
  let sum = 0;
  for (const id of Object.keys(BONUS_MAP)) {
    const btn = document.getElementById(id);
    if (btn && btn.classList.contains('active')) sum += BONUS_MAP[id];
  }
  inherentBonus = sum;
  const lbl = document.getElementById('bonusLabel');
  if (lbl) {
    lbl.textContent = inherentBonus
      ? `${(inherentBonus * 100).toFixed(2)}% total bonus active`
      : 'No bonus';
  }

  // If there's already a result shown, re-render it so the displayed bases update.
  // We store the last payload on the compute step and re-render if present.
  if (window.__lastRenderPayload) {
    renderResult(window.__lastRenderPayload);
  }
}


function toggleBonusButton(id) {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.classList.toggle('active');
  recomputeInherentBonus();
}

function wireBonusButtons() {
  const btn8 = document.getElementById('keep8');
  const btn6 = document.getElementById('waif6');
  if (btn8) btn8.addEventListener('click', () => toggleBonusButton('keep8'));
  if (btn6) btn6.addEventListener('click', () => toggleBonusButton('waif6'));
  
  if (!document.getElementById('bonusLabel')) {
    const container = document.querySelector('.controls') || document.body;
    const lbl = document.createElement('div');
    lbl.id = 'bonusLabel';
    lbl.className = 'muted';
    lbl.style.marginLeft = '8px';
    lbl.textContent = 'No bonus';
    container.appendChild(lbl);
  }
  recomputeInherentBonus();
}


function initScenarioOptions(){
  scenarioSelect.innerHTML = '';
  for (const key of Object.keys(SCENARIOS)) {
    const meta = SCENARIOS[key] || {};
    const label = meta.name || key;
    const o = document.createElement('option');
    o.value = key;
    o.textContent = label;
    scenarioSelect.appendChild(o);
  }
}
function buildItemsBySlot(catalog){
  const by = {};
  for (const p of catalog){
    by[p.slot] = by[p.slot] || [];
    by[p.slot].push(p);
  }
  return by;
}
function buildItemsMap(){
  const by = buildItemsBySlot(RAW_CATALOG);
  const map = {};
  for (const slot of Object.keys(by)) for (const p of by[slot]) map[p.id] = p;
  return map;
}
function findCatalogPiece(slot, id){
  const bySlot = buildItemsBySlot(RAW_CATALOG);
  return (bySlot[slot] || []).find(x=>x.id===id) || null;
}
function rarityClass(rarity){
  
  return 'chip-rarity-' + String(rarity).replace(/\s+/g,'');
}

function buildSlotPanels(){
  slotsGrid.innerHTML = '';
  ensureUserInstances();
  const bySlot = buildItemsBySlot(RAW_CATALOG);
  for (const slot of SLOTS){
    const card = document.createElement('div'); card.className='slot-card';
    card.innerHTML = `
      <div class="slot-header">
        <div style="font-weight:600">${slot.toUpperCase()}</div>
        <div class="small">instances: <span id="${slot}-count">0</span></div>
      </div>
      <div>
        <div style="display:flex;gap:8px;align-items:center">
          <select id="${slot}-catalog"></select>
          <select id="${slot}-rarity"><option>Poor</option><option>Common</option><option>Fine</option><option>Exquisite</option><option>Epic</option><option>Legendary</option></select>
          <select id="${slot}-level"><option>40</option><option>45</option><option>50</option></select>
          <button id="${slot}-add" class="secondary">Add</button>
        </div>
        <div class="chips-row" id="${slot}-chips"></div>
      </div>`;
    slotsGrid.appendChild(card);

    const selectEl = card.querySelector(`#${slot}-catalog`);
    const list = bySlot[slot] || [];
    for (const p of list){ const o=document.createElement('option'); o.value=p.id; o.textContent=p.name || p.id; selectEl.appendChild(o); }

    card.querySelector(`#${slot}-add`).addEventListener('click', ()=>{
      const catalogId = selectEl.value;
      const rarity = card.querySelector(`#${slot}-rarity`).value;
      const level = Number(card.querySelector(`#${slot}-level`).value);
      if (!catalogId) return alert('Select a catalog item');
      ensureUserInstances();
      userInstances[slot].push({ catalogId, level, rarity });
      refreshChips(slot);
    });

    refreshChips(slot);
  }
}

function refreshChips(slot){
  ensureUserInstances();
  const countEl = document.getElementById(`${slot}-count`);
  if (countEl) countEl.textContent = userInstances[slot].length;
  const chipsRow = document.getElementById(`${slot}-chips`); chipsRow.innerHTML='';
  const catalogMap = buildItemsMap();
  userInstances[slot].forEach((inst, idx)=>{
    const piece = catalogMap[inst.catalogId] || findCatalogPiece(slot, inst.catalogId);
    const chip = document.createElement('div'); chip.className='chip';
    const rClass = inst.rarity ? rarityClass(inst.rarity) : '';
    if (rClass) chip.classList.add(rClass);
    const displayName = (piece && piece.name) ? piece.name : inst.catalogId;
    chip.innerHTML = `<div class="mono">${displayName.toUpperCase()}</div><div class="rarity-badge">${inst.rarity} ${inst.level}</div>`;
    chip.addEventListener('click', ()=>{
      userInstances[slot].splice(idx,1); refreshChips(slot);
    });
    chipsRow.appendChild(chip);
  });
}

computeBtn.addEventListener('click', ()=> {
  try {
    ensureUserInstances();
    for (const s of SLOTS) if (!userInstances[s].length) throw new Error('Add at least one instance per slot');

    
    const itemsForWorker = {};
    const catalogBySlot = buildItemsBySlot(RAW_CATALOG);
    for (const s of SLOTS) {
      const bySlot = catalogBySlot[s] || [];
      
      const selectionsByPiece = {};
      for (const inst of userInstances[s]) {
        if (!inst || !inst.catalogId) continue;
        selectionsByPiece[inst.catalogId] = selectionsByPiece[inst.catalogId] || [];
        selectionsByPiece[inst.catalogId].push({ rarity: inst.rarity, level: String(inst.level) });
      }

      const piecesForSlot = [];
      for (const p of bySlot) {
        
        const clone = Object.assign({}, p);
        const sels = selectionsByPiece[p.id];
        if (Array.isArray(sels) && sels.length > 0) {
          const filteredStats = {};
          for (const sel of sels) {
            const r = sel.rarity;
            const L = sel.level;
            if (p.stats && p.stats[r] && p.stats[r][L]) {
              filteredStats[r] = filteredStats[r] || {};
              filteredStats[r][L] = Object.assign({}, p.stats[r][L]);
            } else {
              
              const foundKey = Object.keys(p.stats || {}).find(k => String(k).toLowerCase() === String(r).toLowerCase());
              if (foundKey && p.stats[foundKey] && p.stats[foundKey][L]) {
                filteredStats[foundKey] = filteredStats[foundKey] || {};
                filteredStats[foundKey][L] = Object.assign({}, p.stats[foundKey][L]);
              } else {
                console.warn(`Missing stats for piece ${p.id} rarity ${r} level ${L}`);
              }
            }
          }
          clone.stats = filteredStats;
          clone.allowedRarities = Array.from(new Set(sels.map(x=>x.rarity)));
          clone.allowedLevels = Array.from(new Set(sels.map(x=>Number(x.level))));
          piecesForSlot.push(clone);
        } else {
          
          continue;
        }
      }

      itemsForWorker[s] = piecesForSlot;
    }

    
    const counts = {};
    let exact = 1n;
    for (const s of SLOTS) {
      const arr = itemsForWorker[s] || [];
      let slotVariants = 0;
      for (const p of arr) {
        const rarities = Object.keys(p.stats || {});
        let lvlCount = 0;
        for (const r of rarities) lvlCount += Object.keys(p.stats[r]).length;
        slotVariants += lvlCount;
      }
      counts[s] = slotVariants;
      exact *= BigInt(Math.max(1, slotVariants));
    }
    console.log('worker variants per slot', counts, 'exactCombCount', exact.toString());
    outputEl.innerHTML = `<div class="muted">Worker variants per slot: ${JSON.stringify(counts)} · estimated combos: ${exact.toString()}</div>`;

    
    if (worker) { worker.terminate(); worker = null; }
    worker = new Worker('worker-opt.js');
    worker.onmessage = (ev) => {
      const { type, payload } = ev.data;
      if (type === 'progress') {
        outputEl.innerHTML = `<div class="muted">${payload.step}: ${payload.message || ''}</div>`;
      } else if (type === 'result') {
        renderResult(payload);
        worker.terminate(); worker=null;
      } else if (type === 'error') {
        outputEl.innerHTML = `<pre style="color:#a00">${payload.message}</pre>`;
        worker.terminate(); worker=null;
      }
    };
    worker.postMessage({ type: 'start', payload: {
      items: itemsForWorker,
      scenarios: SCENARIOS,
      scenarioKey: scenarioSelect.value,
      INHERENT_BONUS: inherentBonus, 
      topM: 200,
      maxCombos: 200000,
      maxPairChecks: 10000000,
      eps: 1e-12
    }});
  } catch(err){
    outputEl.innerHTML = `<pre style="color:#a00">${err.message || err}</pre>`;
  }
});

resetBtn.addEventListener('click', ()=> {
  userInstances = {};
  ensureUserInstances();
  buildSlotPanels();
  outputEl.innerHTML='';

  
  const keep = document.getElementById('keep8');
  const waif = document.getElementById('waif6');
  if (keep) keep.classList.remove('active');
  if (waif) waif.classList.remove('active');
  recomputeInherentBonus();
});


function renderResult(payload){
  // cache payload so recomputeInherentBonus can re-render when bonuses change
  window.__lastRenderPayload = payload;

  const { intervals, candidateCount, breakpointsCount } = payload;
  const bonus = Number(inherentBonus) || 0;
  let html = `<div class="muted">Combos enumerated: ${candidateCount} · Breakpoints: ${breakpointsCount}</div>`;

  for (const it of intervals){
    // apply bonus to the interval lower/upper bounds
    const fromAdj = (typeof it.from === 'number') ? it.from * (1 + bonus) : null;
    const toAdj = (typeof it.to === 'number') ? it.to * (1 + bonus) : null;

    html += `<div class="winner-row"><div><strong>Base ${Math.round(fromAdj)} — ${toAdj===null ? '∞' : Math.round(toAdj)}</strong></div>`;
    html += `<div class="muted" style="margin-top:6px">Displayed base includes ${(bonus*100).toFixed(2)}% active bonus</div>`;
    html += '<div style="margin-top:8px">';

    for (const s of SLOTS){
      const info = it.combo_names[s] || {};
      const rc = info.rarity ? rarityClass(info.rarity) : '';
      html += `<div style="display:inline-flex;align-items:center;gap:8px;margin-right:8px">` +
                `<div class="slot-label">${s.toUpperCase()}:</div>` +
                `<div class="chip ${rc}">` +
                  `<div class="mono">${String(info.name || info.pieceId || '').toUpperCase()}</div>` +
                  `<div class="rarity-badge">${info.rarity || ''} ${info.level}</div>` +
                `</div>` +
              `</div>`;
    }

    html += '</div></div>';
  }

  outputEl.innerHTML = html;
}


initScenarioOptions();
ensureUserInstances();
buildSlotPanels();
wireBonusButtons();
