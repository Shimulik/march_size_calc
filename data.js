const LEVELS = [40, 45, 50];
const RARITIES = ['Poor', 'Common', 'Fine', 'Exquisite', 'Epic', 'Legendary'];


const STAT_MATRICES = {
  base_105: [
    [1456, 1560, 1664, 1769, 1873, 2081],
    [1616, 1732, 1847, 1963, 2078, 2309],
    [1776, 1903, 2030, 2157, 2284, 2538]
  ],
  base_10: [
    [2913, 3121, 3329, 3538, 3746, 4162],
    [3233, 3464, 3695, 3926, 4157, 4619],
    [3553, 3807, 4060, 4314, 4568, 5076]
  ],
  base_11: [
    [3496, 3746, 3995, 4245, 4495, 4994],
    [3880, 4157, 4434, 4711, 4988, 5543],
    [4263, 4568, 4873, 5177, 5482, 6091]
  ],
  base_12: [
    [4195, 4495, 4795, 5094, 5394, 5993],
    [4656, 4988, 5321, 5654, 5986, 6651],
    [5116, 5482, 5847, 6213, 6578, 7309]
  ],



  drag_10: [
    [5827, 6243, 6659, 7076, 7492, 8324],
    [6467, 6928, 7390, 7852, 8314, 9238],
    [7106, 7614, 8121, 8629, 9137, 10152]
  ],
  drag_115: [
    [3496, 3746, 3995, 4245, 4495, 4994],
    [3880, 4157, 4434, 4711, 4988, 5543],
    [4263, 4568, 4873, 5177, 5482, 6091]
  ],
  drag_12: [
    [8391, 8990, 9590, 10189, 10789, 11987],
    [9312, 9977, 10642, 11308, 11973, 13303],
    [10233, 10964, 11695, 12426, 13157, 14619]
  ],
  drag_125: [
    [4195, 4495, 4795, 5094, 5394, 5993],
    [4656, 4988, 5321, 5654, 5986, 6651],
    [5116, 5482, 5847, 6213, 6578, 7309]
  ],



  percent_11: [
    [0.0233097854976, 0.024974770176, 0.0266397548544, 0.0283047395328, 0.0299697242112, 0.033299693568],
    [0.0258681765888, 0.027715903488, 0.0295636303872, 0.0314113572864, 0.0332590841856, 0.036954537984],
    [0.02842656768, 0.0304570368, 0.03248750592, 0.03451797504, 0.03654844416, 0.0406093824]
  ],
  percent_115: [
    [0.0116548927488, 0.012487385088, 0.0133198774272, 0.0141523697664, 0.0149848621056, 0.016649846784],
    [0.0129340882944, 0.013857951744, 0.0147818151936, 0.0157056786432, 0.0166295420928, 0.018477268992],
    [0.01421328384, 0.0152285184, 0.01624375296, 0.01725898752, 0.01827422208, 0.0203046912]
  ],
  percent_12: [
    [0.02797174259712, 0.0299697242112, 0.03196770582528, 0.03396568743936, 0.03596366905344, 0.0399596322816],
    [0.03104181190656, 0.0332590841856, 0.03547635646464, 0.03769362874368, 0.03991090102272, 0.0443454455808],
    [0.034111881216, 0.03654844416, 0.038985007104, 0.041421570048, 0.043858132992, 0.04873125888]
  ],
  percent_125: [
    [0.01398587129856, 0.0149848621056, 0.01598385291264, 0.01698284371968, 0.01798183452672, 0.0199798161408],
    [0.01552090595328, 0.0166295420928, 0.01773817823232, 0.01884681437184, 0.01995545051136, 0.0221727227904],
    [0.017055940608, 0.01827422208, 0.019492503552, 0.020710785024, 0.021929066496, 0.02436562944]
  ],



  rein_11: [
    [5244, 5619, 5993, 6368, 6743, 7492],
    [5820, 6236, 6651, 7067, 7483, 8314],
    [6395, 6852, 7309, 7766, 8223, 9137]
  ],
  rein_12: [
    [6293, 6743, 7192, 7642, 8091, 8990],
    [6984, 7483, 7982, 8481, 8979, 9977],
    [7675, 8223, 8771, 9319, 9868, 10964]
  ],



  sop_10: [
    [4370, 4682, 4994, 5307, 5619, 6243],
    [4850, 5196, 5543, 5889, 6236, 6928],
    [5329, 5710, 6091, 6472, 6852, 7614]
  ],
  sop_11: [
    [5244, 5619, 5993, 6368, 6743, 7492],
    [5820, 6236, 6651, 7067, 7483, 8314],
    [6395, 6852, 7309, 7766, 8223, 9137]
  ],
  sop_12: [
    [6293, 6743, 7192, 7642, 8091, 8990],
    [6984, 7483, 7982, 8481, 8979, 9977],
    [7675, 8223, 8771, 9319, 9868, 10964]
  ],



  vp_10: [
    [4370, 4682, 4994, 5307, 5619, 6243],
    [4850, 5196, 5543, 5889, 6236, 6928],
    [5329, 5710, 6091, 6472, 6852, 7614]
  ]
};


const RAW_CATALOG_COMPACT = [
  {name: "12 | Sun Dornish", id: "wnymeria2", slot: "weapon", statsMap: {base: 'base_12'}},
  {name: "12 | Sun Dornish", id: "rnymeria2", slot: "ring", statsMap: {base: 'base_12'}},
  {name: "12 | Sun Dornish", id: "pnymeria2", slot: "pants", statsMap: {base: 'base_12'}},
  {name: "12 | Sun Dornish", id: "hnymeria2", slot: "helmet", statsMap: {defense: 'rein_12'}},
  {name: "12 | Sun Dornish", id: "cnymeria2", slot: "chest", statsMap: {defense: 'rein_12'}},
  {name: "12 | Sun Dornish", id: "bnymeria2", slot: "boots", statsMap: {defense: 'rein_12'}},
  {name: "12 | Golden Rose", id: "wmargaery", slot: "weapon", statsMap: {dragon: 'drag_125'}},
  {name: "12 | Golden Rose", id: "rmargaery", slot: "ring", statsMap: {dragon: 'drag_12', percent: 'percent_12'}},
  {name: "12 | Golden Rose", id: "pmargaery", slot: "pants", statsMap: {dragon: 'drag_125'}},
  {name: "12 | Golden Rose", id: "hmargaery", slot: "helmet", statsMap: {dragon: 'drag_12', percent: 'percent_12'}},
  {name: "12 | Golden Rose", id: "cmargaery", slot: "chest", statsMap: {dragon: 'drag_125'}},
  {name: "12 | Golden Rose", id: "bmargaery", slot: "boots", statsMap: {dragon: 'drag_12', percent: 'percent_12'}},
  {name: "12 | Frost Thenn", id: "woldnan5", slot: "weapon", statsMap: {percent: 'percent_12'}},
  {name: "12 | Frost Thenn", id: "roldnan5", slot: "ring", statsMap: {vsSOP: 'sop_12'}},
  {name: "12 | Frost Thenn", id: "poldnan5", slot: "pants", statsMap: {percent: 'percent_12'}},
  {name: "12 | Frost Thenn", id: "holdnan5", slot: "helmet", statsMap: {vsSOP: 'sop_12'}},
  {name: "12 | Frost Thenn", id: "coldnan5", slot: "chest", statsMap: {percent: 'percent_12'}},
  {name: "12 | Frost Thenn", id: "boldnan5", slot: "boots", statsMap: {vsSOP: 'sop_12'}},
  {name: "12 | Dragonflame", id: "wfreedom3", slot: "weapon", statsMap: {percent: 'percent_12'}},
  {name: "12 | Dragonflame", id: "rfreedom3", slot: "ring", statsMap: {base: 'base_12'}},
  {name: "12 | Dragonflame", id: "pfreedom3", slot: "pants", statsMap: {percent: 'percent_12'}},
  {name: "12 | Dragonflame", id: "hfreedom3", slot: "helmet", statsMap: {percent: 'percent_125'}},
  {name: "12 | Dragonflame", id: "cfreedom3", slot: "chest", statsMap: {base: 'base_12'}},
  {name: "12 | Dragonflame", id: "bfreedom3", slot: "boots", statsMap: {percent: 'percent_12'}},
  {name: "12 | Chilled Corsair", id: "wvelaryon2", slot: "weapon", statsMap: {percent: 'percent_12'}},
  {name: "12 | Chilled Corsair", id: "rvelaryon2", slot: "ring", statsMap: {base: 'base_12'}},
  {name: "12 | Chilled Corsair", id: "pvelaryon2", slot: "pants", statsMap: {percent: 'percent_12'}},
  {name: "12 | Chilled Corsair", id: "hvelaryon2", slot: "helmet", statsMap: {percent: 'percent_125'}},
  {name: "12 | Chilled Corsair", id: "cvelaryon2", slot: "chest", statsMap: {base: 'base_12'}},
  {name: "12 | Chilled Corsair", id: "bvelaryon2", slot: "boots", statsMap: {percent: 'percent_12'}},
  {name: "12 | Bur Usurper", id: "wbaratheon4", slot: "weapon", statsMap: {percent: 'percent_12'}},
  {name: "12 | Bur Usurper", id: "rbaratheon4", slot: "ring", statsMap: {base: 'base_12'}},
  {name: "12 | Bur Usurper", id: "pbaratheon4", slot: "pants", statsMap: {base: 'base_12'}},
  {name: "12 | Bur Usurper", id: "hbaratheon4", slot: "helmet", statsMap: {percent: 'percent_125'}},
  {name: "12 | Bur Usurper", id: "cbaratheon4", slot: "chest", statsMap: {percent: 'percent_12'}},
  {name: "12 | Bur Usurper", id: "bbaratheon4", slot: "boots", statsMap: {percent: 'percent_12'}},
  {name: "11 | Lit Lannister", id: "wharrenhal5", slot: "weapon", statsMap: {base: 'base_11', percent: 'percent_115'}},
  {name: "11 | Lit Lannister", id: "rharrenhal5", slot: "ring", statsMap: {base: 'base_11', percent: 'percent_115'}},
  {name: "11 | Lit Lannister", id: "pharrenhal5", slot: "pants", statsMap: {defense: 'rein_11', percent: 'percent_115'}},
  {name: "11 | Lit Lannister", id: "hharrenhal5", slot: "helmet", statsMap: {defense: 'rein_11', percent: 'percent_115'}},
  {name: "11 | Lit Lannister", id: "charrenhal5", slot: "chest", statsMap: {base: 'base_11', percent: 'percent_115'}},
  {name: "11 | Lit Lannister", id: "bharrenhal5", slot: "boots", statsMap: {defense: 'rein_11', percent: 'percent_115'}},
  {name: "11 | KoF", id: "wharvest4", slot: "weapon", statsMap: {base: 'base_11'}},
  {name: "11 | KoF", id: "rharvest4", slot: "ring", statsMap: {percent: 'percent_11'}},
  {name: "11 | KoF", id: "pharvest4", slot: "pants", statsMap: {percent: 'percent_11'}},
  {name: "11 | KoF", id: "hharvest4", slot: "helmet", statsMap: {percent: 'percent_115'}},
  {name: "11 | KoF", id: "charvest4", slot: "chest", statsMap: {percent: 'percent_11'}},
  {name: "11 | KoF", id: "bharvest4", slot: "boots", statsMap: {base: 'base_11'}},
  {name: "11 | Greenfyre", id: "wconquest6", slot: "weapon", statsMap: {percent: 'percent_11', dragon: 'drag_115'}},
  {name: "11 | Greenfyre", id: "rconquest6", slot: "ring", statsMap: {vsSOP: 'sop_11'}},
  {name: "11 | Greenfyre", id: "pconquest6", slot: "pants", statsMap: {percent: 'percent_11', dragon: 'drag_115'}},
  {name: "11 | Greenfyre", id: "hconquest6", slot: "helmet", statsMap: {vsSOP: 'sop_11'}},
  {name: "11 | Greenfyre", id: "cconquest6", slot: "chest", statsMap: {percent: 'percent_11', dragon: 'drag_115'}},
  {name: "11 | Greenfyre", id: "bconquest6", slot: "boots", statsMap: {vsSOP: 'sop_11'}},
  {name: "11 | Frostbitten", id: "woldnan4", slot: "weapon", statsMap: {percent: 'percent_11'}},
  {name: "11 | Frostbitten", id: "roldnan4", slot: "ring", statsMap: {percent: 'percent_11'}},
  {name: "11 | Frostbitten", id: "poldnan4", slot: "pants", statsMap: {percent: 'percent_115'}},
  {name: "11 | Frostbitten", id: "holdnan4", slot: "helmet", statsMap: {base: 'base_11'}},
  {name: "11 | Frostbitten", id: "coldnan4", slot: "chest", statsMap: {percent: 'percent_11'}},
  {name: "11 | Frostbitten", id: "boldnan4", slot: "boots", statsMap: {base: 'base_11'}},
  {name: "11 | Flame Reaver", id: "wyara2", slot: "weapon", statsMap: {percent: 'percent_11'}},
  {name: "11 | Flame Reaver", id: "ryara2", slot: "ring", statsMap: {percent: 'percent_11'}},
  {name: "11 | Flame Reaver", id: "pyara2", slot: "pants", statsMap: {percent: 'percent_115'}},
  {name: "11 | Flame Reaver", id: "hyara2", slot: "helmet", statsMap: {base: 'base_11'}},
  {name: "11 | Flame Reaver", id: "cyara2", slot: "chest", statsMap: {percent: 'percent_11'}},
  {name: "11 | Flame Reaver", id: "byara2", slot: "boots", statsMap: {base: 'base_11'}},
  {name: "10 | Umber", id: "wumber", slot: "weapon", statsMap: {base: 'base_10'}},
  {name: "10 | Umber", id: "pumber", slot: "pants", statsMap: {base: 'base_10'}},
  {name: "10 | Umber", id: "humber", slot: "helmet", statsMap: {base: 'base_10'}},
  {name: "10 | Umber", id: "cumber", slot: "chest", statsMap: {base: 'base_105'}},
  {name: "10 | Umber", id: "bumber", slot: "boots", statsMap: {base: 'base_10'}},
  {name: "10 | Tourney Herald", id: "wharrenhal4", slot: "weapon", statsMap: {base: 'base_10'}},
  {name: "10 | Tourney Herald", id: "rharrenhal4", slot: "ring", statsMap: {base: 'base_10'}},
  {name: "10 | Tourney Herald", id: "hharrenhal4", slot: "helmet", statsMap: {base: 'base_10'}},
  {name: "10 | Tourney Herald", id: "charrenhal4", slot: "chest", statsMap: {base: 'base_10'}},
  {name: "10 | Tourney Herald", id: "bharrenhal4", slot: "boots", statsMap: {base: 'base_105'}},
  {name: "10 | Stag Lord", id: "wbaratheon3", slot: "weapon", statsMap: {dragon: 'drag_10'}},
  {name: "10 | Stag Lord", id: "rbaratheon3", slot: "ring", statsMap: {dragon: 'drag_10'}},
  {name: "10 | Stag Lord", id: "cbaratheon3", slot: "chest", statsMap: {dragon: 'drag_10'}},
  {name: "10 | Stag Lord", id: "bbaratheon3", slot: "boots", statsMap: {dragon: 'drag_10'}},
  {name: "10 | QM", id: "walicent", slot: "weapon", statsMap: {base: 'base_10', vsPlayer: 'vp_10'}},
  {name: "10 | QM", id: "ralicent", slot: "ring", statsMap: {base: 'base_10', vsPlayer: 'vp_10'}},
  {name: "10 | QM", id: "palicent", slot: "pants", statsMap: {base: 'base_10', vsPlayer: 'vp_10'}},
  {name: "10 | QM", id: "halicent", slot: "helmet", statsMap: {base: 'base_10', vsPlayer: 'vp_10'}},
  {name: "10 | QM", id: "calicent", slot: "chest", statsMap: {base: 'base_10', vsPlayer: 'vp_10'}},
  {name: "10 | QM", id: "balicent", slot: "boots", statsMap: {base: 'base_10', vsPlayer: 'vp_10'}},
  {name: "10 | Fishmonger", id: "wfaceless2", slot: "weapon", statsMap: {base: 'base_10'}},
  {name: "10 | Fishmonger", id: "rfaceless2", slot: "ring", statsMap: {base: 'base_10'}},
  {name: "10 | Fishmonger", id: "pfaceless2", slot: "pants", statsMap: {base: 'base_10'}},
  {name: "10 | Fishmonger", id: "hfaceless2", slot: "helmet", statsMap: {base: 'base_105'}},
  {name: "10 | Fishmonger", id: "bfaceless2", slot: "boots", statsMap: {base: 'base_10'}},
  {name: "10 | Drag Heiress", id: "wrhaenyra", slot: "weapon", statsMap: {vsSOP: 'sop_10'}},
  {name: "10 | Drag Heiress", id: "hrhaenyra", slot: "helmet", statsMap: {vsSOP: 'sop_10'}},
  {name: "10 | Drag Heiress", id: "brhaenyra", slot: "boots", statsMap: {vsSOP: 'sop_10'}}
];


function matrixHasShape(mat) {
  if (!Array.isArray(mat) || mat.length !== LEVELS.length) return false;
  for (const row of mat) if (!Array.isArray(row) || row.length !== RARITIES.length) return false;
  return true;
}



function expandPieceFromMatrices(p) {
  const expanded = Object.assign({}, p);
  const stats = {};
  
  for (const rarity of RARITIES) stats[rarity] = {};

  
  for (let l = 0; l < LEVELS.length; l++) {
    const level = LEVELS[l];

    
    for (let r = 0; r < RARITIES.length; r++) {
      const rarity = RARITIES[r];
      const cell = {};

      for (const statName of Object.keys(p.statsMap || {})) {
        const spec = p.statsMap[statName];
        if (!spec) continue;

        
        let matrixId = null;
        let scale = 1;

        if (typeof spec === 'string') {
          matrixId = spec;
        } else if (typeof spec === 'object') {
          
          if (spec[rarity] !== undefined) {
            const v = spec[rarity];
            if (typeof v === 'string') matrixId = v;
            else if (typeof v === 'object') { matrixId = v.matrix; scale = Number(v.scale) || 1; }
          } else if (spec[String(level)] !== undefined) {
            const v = spec[String(level)];
            if (typeof v === 'string') matrixId = v;
            else if (typeof v === 'object') { matrixId = v.matrix; scale = Number(v.scale) || 1; }
          } else if (spec.matrix) {
            matrixId = spec.matrix;
            scale = Number(spec.scale) || 1;
          }
        }

        if (!matrixId) continue;
        const mat = STAT_MATRICES[matrixId];
        if (!mat) continue;
        if (!matrixHasShape(mat)) throw new Error(`Matrix ${matrixId} has wrong shape`);
        const baseVal = mat[l][r]; 
        if (baseVal !== undefined && baseVal !== null) {
          cell[statName] = (typeof baseVal === 'number') ? baseVal * scale : baseVal;
        }
      }

      if (Object.keys(cell).length) stats[rarity][String(level)] = cell;
    }
  }

  expanded.stats = stats;
  return expanded;
}


const RAW_CATALOG = RAW_CATALOG_COMPACT.map(p => expandPieceFromMatrices(p));


const SCENARIOS = {
  vs_SOP: { flat_keys: ['base', 'vsPlayer', 'vsSOP'], percent_keys: ['percent'], name: 'vs SOP' },
  Drag_vs_SOP: { flat_keys: ['base', 'vsPlayer', 'vsSOP', 'dragon'], percent_keys: ['percent'], name: 'vs SOP w Drag' },
  vs_P: { flat_keys: ['base', 'vsPlayer'], percent_keys: ['percent'], name: 'vs Player' },
  Drag_vs_P: { flat_keys: ['base', 'vsPlayer', 'dragon'], percent_keys: ['percent'], name: 'vs Player w Drag' },
  rein: { flat_keys: ['base', 'defense'], percent_keys: ['percent'], name: 'Rein' },
  Drag_rein: { flat_keys: ['base', 'defense', 'dragon'], percent_keys: ['percent'], name: 'Rein w Dragon' },
};

window.LEVELS = LEVELS;
window.RARITIES = RARITIES;
window.STAT_MATRICES = STAT_MATRICES;
window.RAW_CATALOG = RAW_CATALOG;
window.SCENARIOS = SCENARIOS;
