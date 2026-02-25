// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const LEVELS   = [40, 45, 50];
const RARITIES = ["poor","common","fine","exquisite","epic","legendary"];

const LARGE_SLOTS_ORDER = ["helmet","weapon","chest","ring","pants","boots"];
const SMALL_SLOTS_ORDER = ["helmet","chest","pants","boots","ring","weapon"];
let SLOTS_ORDER = window.matchMedia('(max-width:880px)').matches ? SMALL_SLOTS_ORDER : LARGE_SLOTS_ORDER;

const SLOT_ICONS = { helmet:"", weapon:"", chest:"", ring:"", pants:"", boots:"" };

// ─── IMAGE MAPPING ────────────────────────────────────────────────────────────
// Files live in images/ folder, named: slotname_setname.png
// Set name is derived from piece name: "12 | Golden Rose" → "golden_rose"
// "Empty" pieces have no image.

function setNameToSlug(pieceName) {
  // Strip tier prefix: "12 | Golden Rose" → "Golden Rose"
  const stripped = pieceName.replace(/^\d+\s*\|\s*/, '').trim();
  // Convert to slug: "Golden Rose" → "golden_rose"
  return stripped.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

function getPieceImageUrl(slot, pieceName) {
  if (!pieceName || pieceName === 'Empty') return null;
  const slug = setNameToSlug(pieceName);
  return `images/${slot}/${slug}.png`;
}

// Create an img element that falls back gracefully if file not found
function makeImg(src, cls, alt, placeholderContent) {
  if (!src) return makePlaceholder(cls + '-placeholder', placeholderContent);
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt || '';
  img.className = cls;
  img.onerror = function() {
    const ph = makePlaceholder(cls + '-placeholder', placeholderContent);
    this.replaceWith(ph);
  };
  return img;
}

function makePlaceholder(cls, content) {
  const div = document.createElement('div');
  div.className = cls;
  div.textContent = content || '?';
  return div;
}

// ─── SITUATION CONFIG ─────────────────────────────────────────────────────────

const SITUATION_CONFIG = {
  "vs SOP":              { flat_keys: ["base","vs SOP","vs P"],          percent_keys: ["Percent"] },
  "vs SOP with Drag":    { flat_keys: ["base","Dragon","vs SOP","vs P"], percent_keys: ["Percent"] },
  "vs Player":           { flat_keys: ["base","vs P"],                   percent_keys: ["Percent"] },
  "vs Player with Drag": { flat_keys: ["base","Dragon","vs P"],          percent_keys: ["Percent"] },
  "Rein":                { flat_keys: ["base","Rein"],                   percent_keys: ["Percent"] },
  "Rein with Drag":      { flat_keys: ["base","Rein","Dragon"],          percent_keys: ["Percent"] }
};

// ─── MATRICES ─────────────────────────────────────────────────────────────────

const MATRICES = {
  base_105: [
    [1456,1560,1664,1769,1873,2081],
    [1616,1732,1847,1963,2078,2309],
    [1776,1903,2030,2157,2284,2538]
  ],
  base_10: [
    [2913,3121,3329,3538,3746,4162],
    [3233,3464,3695,3926,4157,4619],
    [3553,3807,4060,4314,4568,5076]
  ],
  base_11: [
    [3496,3746,3995,4245,4495,4994],
    [3880,4157,4434,4711,4988,5543],
    [4263,4568,4873,5177,5482,6091]
  ],
  base_12: [
    [4195,4495,4795,5094,5394,5993],
    [4656,4988,5321,5654,5986,6651],
    [5116,5482,5847,6213,6578,7309]
  ],
  base_13: [
    [5034,5394,5754,6113,6473,7192],
    [5587,5986,6385,6784,7183,7982],
    [6140,6578,7017,7455,7894,8771]
  ],
  drag_10: [
    [5827,6243,6659,7076,7492,8324],
    [6467,6928,7390,7852,8314,9238],
    [7106,7614,8121,8629,9137,10152]
  ],
  drag_115: [
    [3496,3746,3995,4245,4495,4994],
    [3880,4157,4434,4711,4988,5543],
    [4263,4568,4873,5177,5482,6091]
  ],
  drag_12: [
    [8391,8990,9590,10189,10789,11987],
    [9312,9977,10642,11308,11973,13303],
    [10233,10964,11695,12426,13157,14619]
  ],
  drag_125: [
    [4195,4495,4795,5094,5394,5993],
    [4656,4988,5321,5654,5986,6651],
    [5116,5482,5847,6213,6578,7309]
  ],
  drag_13: [
    [10069,10789,11508,12227,12946,14385],
    [11175,11973,12771,13569,14367,15964],
    [12280,13157,14034,14911,15788,17543]
  ],
  percent_11: [
    [0.0233097854976,0.024974770176,0.0266397548544,0.0283047395328,0.0299697242112,0.033299693568],
    [0.0258681765888,0.027715903488,0.0295636303872,0.0314113572864,0.0332590841856,0.036954537984],
    [0.02842656768,0.0304570368,0.03248750592,0.03451797504,0.03654844416,0.0406093824]
  ],
  percent_115: [
    [0.0116548927488,0.012487385088,0.0133198774272,0.0141523697664,0.0149848621056,0.016649846784],
    [0.0129340882944,0.013857951744,0.0147818151936,0.0157056786432,0.0166295420928,0.018477268992],
    [0.01421328384,0.0152285184,0.01624375296,0.01725898752,0.01827422208,0.0203046912]
  ],
  percent_12: [
    [0.02797174259712,0.0299697242112,0.03196770582528,0.03396568743936,0.03596366905344,0.0399596322816],
    [0.03104181190656,0.0332590841856,0.03547635646464,0.03769362874368,0.03991090102272,0.0443454455808],
    [0.034111881216,0.03654844416,0.038985007104,0.041421570048,0.043858132992,0.04873125888]
  ],
  percent_125: [
    [0.01398587129856,0.0149848621056,0.01598385291264,0.01698284371968,0.01798183452672,0.0199798161408],
    [0.01552090595328,0.0166295420928,0.01773817823232,0.01884681437184,0.01995545051136,0.0221727227904],
    [0.017055940608,0.01827422208,0.019492503552,0.020710785024,0.021929066496,0.02436562944]
  ],
  percent_13: [
    [0.033566091116544,0.03596366905344,0.038361246990336,0.040758824927232,0.043156402864128,0.04795155873792],
    [0.037250174287872,0.03991090102272,0.042571627757568,0.045232354492416,0.047893081227264,0.05321453469696],
    [0.0409342574592,0.043858132992,0.0467820085248,0.0497058840576,0.0526297595904,0.058477510656]
  ],
  percent_135: [
      [0.016783045558272,0.01798183452672,0.019180623495168,0.020379412463616,0.021578201432064,0.02397577936896],
      [0.018625087143936,0.01995545051136,0.021285813878784,0.022616177246208,0.023946540613632,0.02660726734848],
      [0.0204671287296,0.021929066496,0.0233910042624,0.0248529420288,0.0263148797952,0.029238755328]
  ],
  rein_11: [
    [5244,5619,5993,6368,6743,7492],
    [5820,6236,6651,7067,7483,8314],
    [6395,6852,7309,7766,8223,9137]
  ],
  rein_12: [
    [6293,6743,7192,7642,8091,8990],
    [6984,7483,7982,8481,8979,9977],
    [7675,8223,8771,9319,9868,10964]
  ],
  sop_10: [
    [4370,4682,4994,5307,5619,6243],
    [4850,5196,5543,5889,6236,6928],
    [5329,5710,6091,6472,6852,7614]
  ],
  sop_11: [
    [5244,5619,5993,6368,6743,7492],
    [5820,6236,6651,7067,7483,8314],
    [6395,6852,7309,7766,8223,9137]
  ],
  sop_12: [
    [6293,6743,7192,7642,8091,8990],
    [6984,7483,7982,8481,8979,9977],
    [7675,8223,8771,9319,9868,10964]
  ],
  vp_10: [
    [4370,4682,4994,5307,5619,6243],
    [4850,5196,5543,5889,6236,6928],
    [5329,5710,6091,6472,6852,7614]
  ]
};

// ─── TEMPLATES ────────────────────────────────────────────────────────────────

const TEMPLATES = {
    helmet: [
        {name: "Empty",                             mapping: {base: null,              "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "13 | Hedge Knight",                 mapping: {base: "base_13",         "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "13 | Laughing Baratheon",           mapping: {base: "base_13",         "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "13 | Valorous Kingsguard",          mapping: {base: "base_13",         "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "12 | Sun Dornish",                  mapping: {base: null,              "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: "rein_12"}},
        {name: "12 | Golden Rose",                  mapping: {base: null,              "vs P": null,             Percent: "percent_12",              Dragon: "drag_12",     "vs SOP": null,              Rein: null}},
        {name: "12 | Frost Thenn",                  mapping: {base: null,              "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": "sop_12",          Rein: null}},
        {name: "12 | Dragonflame",                  mapping: {base: null,              "vs P": null,             Percent: "percent_125",             Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "12 | Chilled Corsair",              mapping: {base: null,              "vs P": null,             Percent: "percent_125",             Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "12 | Bur Usurper",                  mapping: {base: null,              "vs P": null,             Percent: "percent_125",             Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "11 | Lit Lannister",                mapping: {base: null,              "vs P": null,             Percent: "percent_115",             Dragon: null,          "vs SOP": null,              Rein: "rein_11"}},
        {name: "11 | KoF",                          mapping: {base: null,              "vs P": null,             Percent: "percent_115",             Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "11 | Greenfyre",                    mapping: {base: null,              "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": "sop_11",          Rein: null}},
        {name: "11 | Frostbitten",                  mapping: {base: "base_11",         "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "11 | Flame Reaver",                 mapping: {base: "base_11",         "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "10 | Umber",                        mapping: {base: "base_10",         "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "10 | Tourney Herald",               mapping: {base: "base_10",         "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "10 | QM",                           mapping: {base: "base_10",         "vs P": "vp_10",          Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "10 | Fishmonger",                   mapping: {base: "base_105",        "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "10 | Drag Heiress",                 mapping: {base: null,              "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": "sop_10",          Rein: null}},
    ],
    chest: [
        {name: "Empty",                             mapping: {base: null,              "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "13 | Hedge Knight",                 mapping: {base: null,              "vs P": null,             Percent: "percent_135",            Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "13 | Laughing Baratheon",           mapping: {base: null,              "vs P": null,             Percent: "percent_13",              Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "13 | Valorous Kingsguard",          mapping: {base: null,              "vs P": null,             Percent: "percent_13",              Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "12 | Sun Dornish",                  mapping: {base: null,              "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: "rein_12"}},
        {name: "12 | Golden Rose",                  mapping: {base: null,              "vs P": null,             Percent: null,                      Dragon: "drag_125",    "vs SOP": null,              Rein: null}},
        {name: "12 | Frost Thenn",                  mapping: {base: null,              "vs P": null,             Percent: "percent_12",              Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "12 | Dragonflame",                  mapping: {base: "base_12",         "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "12 | Chilled Corsair",              mapping: {base: "base_12",         "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "12 | Bur Usurper",                  mapping: {base: null,              "vs P": null,             Percent: "percent_12",              Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "11 | Lit Lannister",                mapping: {base: "base_11",         "vs P": null,             Percent: "percent_115",             Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "11 | KoF",                          mapping: {base: null,              "vs P": null,             Percent: "percent_11",              Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "11 | Greenfyre",                    mapping: {base: null,              "vs P": null,             Percent: "percent_11",              Dragon: "drag_115",    "vs SOP": null,              Rein: null}},
        {name: "11 | Frostbitten",                  mapping: {base: null,              "vs P": null,             Percent: "percent_11",              Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "11 | Flame Reaver",                 mapping: {base: null,              "vs P": null,             Percent: "percent_11",              Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "10 | Umber",                        mapping: {base: "base_105",        "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "10 | Tourney Herald",               mapping: {base: "base_10",         "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "10 | Stag Lord",                    mapping: {base: null,              "vs P": null,             Percent: null,                      Dragon: "drag_10",     "vs SOP": null,              Rein: null}},
        {name: "10 | QM",                           mapping: {base: "base_10",         "vs P": "vp_10",          Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
    ],
    pants: [
        {name: "Empty",                             mapping: {base: null,              "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "13 | Hedge Knight",                 mapping: {base: "base_13",         "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "13 | Laughing Baratheon",           mapping: {base: "base_13",         "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "13 | Valorous Kingsguard",          mapping: {base: null,              "vs P": null,             Percent: "percent_13",              Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "12 | Sun Dornish",                  mapping: {base: "base_12",         "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "12 | Golden Rose",                  mapping: {base: null,              "vs P": null,             Percent: null,                      Dragon: "drag_125",    "vs SOP": null,              Rein: null}},
        {name: "12 | Frost Thenn",                  mapping: {base: null,              "vs P": null,             Percent: "percent_12",              Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "12 | Dragonflame",                  mapping: {base: null,              "vs P": null,             Percent: "percent_12",              Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "12 | Chilled Corsair",              mapping: {base: null,              "vs P": null,             Percent: "percent_12",              Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "12 | Bur Usurper",                  mapping: {base: "base_12",         "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "11 | Lit Lannister",                mapping: {base: null,              "vs P": null,             Percent: "percent_115",             Dragon: null,          "vs SOP": null,              Rein: "rein_11"}},
        {name: "11 | KoF",                          mapping: {base: null,              "vs P": null,             Percent: "percent_11",              Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "11 | Greenfyre",                    mapping: {base: null,              "vs P": null,             Percent: "percent_11",              Dragon: "drag_115",    "vs SOP": null,              Rein: null}},
        {name: "11 | Frostbitten",                  mapping: {base: null,              "vs P": null,             Percent: "percent_115",             Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "11 | Flame Reaver",                 mapping: {base: null,              "vs P": null,             Percent: "percent_115",             Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "10 | Umber",                        mapping: {base: "base_10",         "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "10 | QM",                           mapping: {base: "base_10",         "vs P": "vp_10",          Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "10 | Fishmonger",                   mapping: {base: "base_10",         "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
    ],
    boots: [
        {name: "Empty",                             mapping: {base: null,              "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "13 | Hedge Knight",                 mapping: {base: null,              "vs P": null,             Percent: "percent_13",              Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "13 | Laughing Baratheon",           mapping: {base: null,              "vs P": null,             Percent: "percent_13",              Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "13 | Valorous Kingsguard",          mapping: {base: "base_13",         "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "12 | Sun Dornish",                  mapping: {base: null,              "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: "rein_12"}},
        {name: "12 | Golden Rose",                  mapping: {base: null,              "vs P": null,             Percent: "percent_12",              Dragon: "drag_12",     "vs SOP": null,              Rein: null}},
        {name: "12 | Frost Thenn",                  mapping: {base: null,              "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": "sop_12",          Rein: null}},
        {name: "12 | Dragonflame",                  mapping: {base: null,              "vs P": null,             Percent: "percent_12",              Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "12 | Chilled Corsair",              mapping: {base: null,              "vs P": null,             Percent: "percent_12",              Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "12 | Bur Usurper",                  mapping: {base: null,              "vs P": null,             Percent: "percent_12",              Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "11 | Lit Lannister",                mapping: {base: null,              "vs P": null,             Percent: "percent_115",             Dragon: null,          "vs SOP": null,              Rein: "rein_11"}},
        {name: "11 | KoF",                          mapping: {base: "base_11",         "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "11 | Greenfyre",                    mapping: {base: null,              "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": "sop_11",          Rein: null}},
        {name: "11 | Frostbitten",                  mapping: {base: "base_11",         "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "11 | Flame Reaver",                 mapping: {base: "base_11",         "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "10 | Umber",                        mapping: {base: "base_10",         "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "10 | Tourney Herald",               mapping: {base: "base_105",        "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "10 | Stag Lord",                    mapping: {base: null,              "vs P": null,             Percent: null,                      Dragon: "drag_10",     "vs SOP": null,              Rein: null}},
        {name: "10 | QM",                           mapping: {base: "base_10",         "vs P": "vp_10",          Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "10 | Fishmonger",                   mapping: {base: "base_10",         "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "10 | Drag Heiress",                 mapping: {base: null,              "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": "sop_10",          Rein: null}}
    ],
    ring: [
        {name: "Empty",                             mapping: {base: null,              "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "13 | Hedge Knight",                 mapping: {base: null,              "vs P": null,             Percent: "percent_13",              Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "13 | Laughing Baratheon",           mapping: {base: null,              "vs P": null,             Percent: "percent_13",              Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "13 | Valorous Kingsguard",          mapping: {base: null,              "vs P": null,             Percent: "percent_13",              Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "12 | Sun Dornish",                  mapping: {base: "base_12",         "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "12 | Golden Rose",                  mapping: {base: null,              "vs P": null,             Percent: "percent_12",              Dragon: "drag_12",     "vs SOP": null,              Rein: null}},
        {name: "12 | Frost Thenn",                  mapping: {base: null,              "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": "sop_12",          Rein: null}},
        {name: "12 | Dragonflame",                  mapping: {base: "base_12",         "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "12 | Chilled Corsair",              mapping: {base: "base_12",         "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "12 | Bur Usurper",                  mapping: {base: "base_12",         "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "11 | Lit Lannister",                mapping: {base: "base_11",         "vs P": null,             Percent: "percent_115",             Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "11 | KoF",                          mapping: {base: null,              "vs P": null,             Percent: "percent_11",              Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "11 | Greenfyre",                    mapping: {base: null,              "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": "sop_11",          Rein: null}},
        {name: "11 | Frostbitten",                  mapping: {base: null,              "vs P": null,             Percent: "percent_11",              Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "11 | Flame Reaver",                 mapping: {base: null,              "vs P": null,             Percent: "percent_11",              Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "10 | Tourney Herald",               mapping: {base: "base_10",         "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "10 | Stag Lord",                    mapping: {base: null,              "vs P": null,             Percent: null,                      Dragon: "drag_10",     "vs SOP": null,              Rein: null}},
        {name: "10 | QM",                           mapping: {base: "base_10",         "vs P": "vp_10",          Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "10 | Fishmonger",                   mapping: {base: "base_10",         "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
    ],
    weapon: [
        {name: "Empty",                             mapping: {base: null,              "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "13 | Hedge Knight",                 mapping: {base: null,              "vs P": null,             Percent: "percent_13",              Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "13 | Laughing Baratheon",           mapping: {base: null,              "vs P": null,             Percent: "percent_135",             Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "13 | Valorous Kingsguard",          mapping: {base: null,              "vs P": null,             Percent: "percent_135",             Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "12 | Sun Dornish",                  mapping: {base: "base_12",         "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "12 | Golden Rose",                  mapping: {base: null,              "vs P": null,             Percent: null,                      Dragon: "drag_125",    "vs SOP": null,              Rein: null}},
        {name: "12 | Frost Thenn",                  mapping: {base: null,              "vs P": null,             Percent: "percent_12",              Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "12 | Dragonflame",                  mapping: {base: null,              "vs P": null,             Percent: "percent_12",              Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "12 | Chilled Corsair",              mapping: {base: null,              "vs P": null,             Percent: "percent_12",              Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "12 | Bur Usurper",                  mapping: {base: null,              "vs P": null,             Percent: "percent_12",              Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "11 | Lit Lannister",                mapping: {base: "base_11",         "vs P": null,             Percent: "percent_115",             Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "11 | KoF",                          mapping: {base: "base_11",         "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "11 | Greenfyre",                    mapping: {base: null,              "vs P": null,             Percent: "percent_11",              Dragon: "drag_115",    "vs SOP": null,              Rein: null}},
        {name: "11 | Frostbitten",                  mapping: {base: null,              "vs P": null,             Percent: "percent_11",              Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "11 | Flame Reaver",                 mapping: {base: null,              "vs P": null,             Percent: "percent_11",              Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "10 | Umber",                        mapping: {base: "base_10",         "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "10 | Tourney Herald",               mapping: {base: "base_10",         "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "10 | Stag Lord",                    mapping: {base: null,              "vs P": null,             Percent: null,                      Dragon: "drag_10",     "vs SOP": null,              Rein: null}},
        {name: "10 | QM",                           mapping: {base: "base_10",         "vs P": "vp_10",          Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "10 | Fishmonger",                   mapping: {base: "base_10",         "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
        {name: "10 | Drag Heiress",                 mapping: {base: null,              "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": "sop_10",          Rein: null}},
    ]
};

// ─── STATE ────────────────────────────────────────────────────────────────────

const state = {
  scenario: Object.keys(SITUATION_CONFIG)[0],
  slots: {},
  NEXT_ID: 1,
  toggle8On: false,
  toggle6p56On: false
};

function genId() { return state.NEXT_ID++; }

function initState() {
  state.slots = {};
  for (const s of SLOTS_ORDER) state.slots[s] = [{ id: genId(), templateIndex: 0, levelIndex: 0, rarityIndex: 0 }];
  state.toggle8On = false;
  state.toggle6p56On = false;
  updateToggleUI();
}

// ─── INHERENT BONUS ───────────────────────────────────────────────────────────

function currentInherentBonus() {
  let t = 0;
  if (state.toggle8On) t += 0.08;
  if (state.toggle6p56On) t += 0.0656;
  return t;
}

function updateToggleUI() {
  const disp = document.getElementById('inherentDisplay');
  const t8 = document.getElementById('toggle8');
  const t6 = document.getElementById('toggle6p56');
  if (t8) t8.classList.toggle('active', state.toggle8On);
  if (t6) t6.classList.toggle('active', state.toggle6p56On);
  if (disp) disp.textContent = (currentInherentBonus() * 100).toFixed(2) + '%';
}

// ─── PIECE BUILDER ────────────────────────────────────────────────────────────

function buildPieceFromTemplate(template, levelIndex, rarityIndex) {
  const stats = {};
  for (const key of ["base","Dragon","vs SOP","Rein","Percent","vs P"]) {
    const matId = template.mapping[key];
    stats[key] = (matId && MATRICES[matId]) ? (MATRICES[matId][levelIndex]?.[rarityIndex] || 0) : 0;
  }
  return { name: template.name, stats };
}

// ─── PRUNING & COMBINATION MATH ──────────────────────────────────────────────

function removeDominatedPieces(pieces, scenario, config) {
  if (!pieces || pieces.length === 0) return [];
  const cfg = config[scenario];
  const statList = pieces.map(piece => ({
    piece,
    flat: cfg.flat_keys.reduce((a, k) => a + (piece.stats[k] || 0), 0),
    percent: cfg.percent_keys.reduce((a, k) => a + (piece.stats[k] || 0), 0)
  }));
  return statList
    .filter(({flat: fi, percent: pei}, i) =>
      !statList.some(({flat: fj, percent: pej}, j) =>
        i !== j && fj >= fi && pej >= pei && (fj > fi || pej > pei)
      )
    )
    .map(x => x.piece);
}

function pruneArmorSlots(runtimeSlots, scenario, config) {
  const pruned = {};
  for (const s of Object.keys(runtimeSlots))
    pruned[s] = removeDominatedPieces(runtimeSlots[s], scenario, config);
  return pruned;
}

function computeCombinationStats(combination, scenario, config) {
  let totalFlat = 0, totalPercent = 0;
  for (const piece of combination) {
    for (const k of config[scenario].flat_keys) totalFlat += piece.stats[k] || 0;
    for (const k of config[scenario].percent_keys) totalPercent += piece.stats[k] || 0;
  }
  totalPercent += currentInherentBonus();
  return {
    slope: 1 + totalPercent,
    intercept: totalFlat * (1 + totalPercent),
    totalFlat,
    totalPercent
  };
}

function cartesianProduct(arrays) {
  if (!arrays || arrays.length === 0) return [[]];
  return arrays.reduce((acc, arr) => {
    const out = [];
    for (const prefix of acc) for (const item of arr) out.push([...prefix, item]);
    return out;
  }, [[]]);
}

function computeAllCombinations(slotsMap, scenario, config, slotOrder) {
  const lists = slotOrder.map(s => slotsMap[s] || []);
  if (lists.some(l => l.length === 0)) return [];
  return cartesianProduct(lists).map(combination => {
    const combo_names = {};
    slotOrder.forEach((slot, i) => combo_names[slot] = combination[i].name);
    const s = computeCombinationStats(combination, scenario, config);
    return { combo: combination, combo_names, slope: s.slope, intercept: s.intercept, total_flat: s.totalFlat, total_percent: s.totalPercent };
  });
}

function computeIntersectionsForCombinations(allCombos, eps = 1e-9) {
  const candidates = new Set([0]);
  for (let i = 0; i < allCombos.length; i++) {
    for (let j = i + 1; j < allCombos.length; j++) {
      const dm = allCombos[i].slope - allCombos[j].slope;
      if (Math.abs(dm) < eps) continue;
      const x = (allCombos[j].intercept - allCombos[i].intercept) / dm;
      if (x >= 0 && isFinite(x)) candidates.add(x);
    }
  }
  return Array.from(candidates).sort((a, b) => a - b);
}

function computeOptimalCombinationIntervals(allCombos, candidates) {
  if (!allCombos || allCombos.length === 0) return [];
  return candidates.map((xLower, idx) => {
    const xUpper = idx < candidates.length - 1 ? candidates[idx + 1] : Infinity;
    const testX = isFinite(xUpper) ? (xLower + xUpper) / 2 : xLower + 100;
    let best = null, bestVal = -Infinity;
    for (const combo of allCombos) {
      const val = combo.slope * testX + combo.intercept;
      if (val > bestVal) { bestVal = val; best = combo; }
    }
    return best ? [xLower, xUpper, best] : null;
  }).filter(Boolean);
}

function mergeIntervals(intervals, eps = 1e-6) {
  if (!intervals || intervals.length === 0) return [];
  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const [prevMin, prevMax, prevCombo] = merged[merged.length - 1];
    const [curMin, curMax, curCombo] = intervals[i];
    if (JSON.stringify(prevCombo.combo_names) === JSON.stringify(curCombo.combo_names) &&
        Math.abs(curMin - prevMax) < eps) {
      merged[merged.length - 1] = [prevMin, curMax, prevCombo];
    } else merged.push(intervals[i]);
  }
  return merged;
}

// ─── SLOT RENDERING ───────────────────────────────────────────────────────────

function renderAllSlots() {
  const slotsContainer = document.getElementById('slotsContainer');
  if (!slotsContainer) return;
  slotsContainer.innerHTML = '';

  for (const slot of SLOTS_ORDER) {
    const rows = state.slots[slot] || [];
    const card = document.createElement('div');
    card.className = 'slot-card';

    const header = document.createElement('div');
    header.className = 'slot-header';
    header.innerHTML = `
      <span class="slot-name">${''} ${slot}</span>
      <span class="slot-count">${rows.filter(r => TEMPLATES[slot][r.templateIndex]?.name !== 'Empty').length} pieces</span>
    `;
    card.appendChild(header);

    const chipsWrap = document.createElement('div');
    chipsWrap.className = 'chips';

    rows.forEach(row => {
      const tpl = (TEMPLATES[slot] && TEMPLATES[slot][row.templateIndex]) || { name: 'Unknown', mapping: {} };
      const rarityClass = ['r-poor','r-common','r-fine','r-exquisite','r-epic','r-legendary'][row.rarityIndex] || 'r-poor';
      const imgUrl = getPieceImageUrl(slot, tpl.name);

      const chip = document.createElement('div');
      chip.className = `chip ${rarityClass}`;

      // Rarity color bar on left
      const bar = document.createElement('div');
      bar.className = 'chip-rarity-bar';
      chip.appendChild(bar);

      // Image
      const imgWrap = document.createElement('div');
      imgWrap.className = 'chip-img-wrap';
      imgWrap.appendChild(makeImg(imgUrl, 'chip-img', tpl.name, '+'));
      chip.appendChild(imgWrap);

      // Text body
      const body = document.createElement('div');
      body.className = 'chip-body';
      const nameEl = document.createElement('div');
      nameEl.className = 'chip-name';
      nameEl.textContent = tpl.name;
      const metaEl = document.createElement('div');
      metaEl.className = 'chip-meta';
      metaEl.textContent = `${RARITIES[row.rarityIndex]} ${LEVELS[row.levelIndex]}`;
      body.appendChild(nameEl);
      body.appendChild(metaEl);
      chip.appendChild(body);

      // Remove button
      const x = document.createElement('button');
      x.className = 'x';
      x.textContent = '✕';
      x.title = 'Remove';
      x.addEventListener('click', e => {
        e.stopPropagation();
        state.slots[slot] = state.slots[slot].filter(r => r.id !== row.id);
        renderAllSlots();
      });
      chip.appendChild(x);

      chip.addEventListener('click', () => showPopover(slot, row));
      chipsWrap.appendChild(chip);
    });

    if (rows.length === 0) {
      const hint = document.createElement('p');
      hint.className = 'slot-hint';
      hint.textContent = 'No pieces added yet.';
      chipsWrap.appendChild(hint);
    }

    card.appendChild(chipsWrap);

    // Add button
    const addBtn = document.createElement('button');
    addBtn.className = 'add-btn';
    addBtn.innerHTML = '<span class="icon">+</span> Add Piece';
    addBtn.addEventListener('click', () => openPiecePicker(slot));
    card.appendChild(addBtn);

    slotsContainer.appendChild(card);
  }
  updateToggleUI();
}

// ─── PIECE PICKER MODAL ───────────────────────────────────────────────────────

let pickerState = { slot: null };

function openPiecePicker(slot) {
  pickerState.slot = slot;
  const modal = document.getElementById('piecePickerModal');
  const title = document.getElementById('modalTitle');
  const search = document.getElementById('modalSearchInput');
  title.textContent = `Select ${slot.charAt(0).toUpperCase() + slot.slice(1)} Piece`;
  search.value = '';
  renderModalPieces('');
  modal.style.display = 'flex';
  setTimeout(() => search.focus(), 50);
}

function closePiecePicker() {
  document.getElementById('piecePickerModal').style.display = 'none';
  pickerState.slot = null;
}

function closePiecePickerOnOverlay(e) {
  if (e.target === document.getElementById('piecePickerModal')) closePiecePicker();
}

function filterModalPieces() {
  renderModalPieces(document.getElementById('modalSearchInput').value);
}

function renderModalPieces(query) {
  const grid = document.getElementById('modalPieceGrid');
  const slot = pickerState.slot;
  if (!slot || !TEMPLATES[slot]) return;
  grid.innerHTML = '';

  const q = query.trim().toLowerCase();
  const templates = TEMPLATES[slot].filter(t => t.name !== 'Empty' && (!q || t.name.toLowerCase().includes(q)));

  if (templates.length === 0) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:24px;color:var(--text-3);font-style:italic">No pieces found.</div>';
    return;
  }

  templates.forEach(tpl => {
    const tplIndex = TEMPLATES[slot].indexOf(tpl);
    const imgUrl = getPieceImageUrl(slot, tpl.name);
    const tier = tpl.name.match(/^(\d+)/)?.[1] || '';

    const card = document.createElement('div');
    card.className = 'modal-piece-card';

    const imgWrap = document.createElement('div');
    imgWrap.className = 'modal-piece-img-wrap';
    imgWrap.appendChild(makeImg(imgUrl, 'modal-piece-img', tpl.name, '+'));
    card.appendChild(imgWrap);

    const body = document.createElement('div');
    body.className = 'modal-piece-body';
    const nameEl = document.createElement('div');
    nameEl.className = 'modal-piece-name';
    nameEl.textContent = tpl.name.replace(/^\d+ \| /, '');
    const tierEl = document.createElement('div');
    tierEl.className = 'modal-piece-tier';
    tierEl.textContent = tier ? `Season ${tier}` : '';
    body.appendChild(nameEl);
    body.appendChild(tierEl);
    card.appendChild(body);

    card.addEventListener('click', () => {
      // Add piece to slot with default level/rarity
      if (!state.slots[slot]) state.slots[slot] = [];
      state.slots[slot].push({ id: genId(), templateIndex: tplIndex, levelIndex: 0, rarityIndex: 5 });
      renderAllSlots();
      closePiecePicker();
    });

    grid.appendChild(card);
  });
}

// ─── POPOVER ─────────────────────────────────────────────────────────────────

let popState = { open: false, slot: null, pieceId: null, original: null };

function showPopover(slot, pieceRow) {
  popState = { open: true, slot, pieceId: pieceRow.id, original: { ...pieceRow } };
  const popTpl = document.getElementById('popoverTemplate');
  const popLvl = document.getElementById('popoverLevel');
  const popRar = document.getElementById('popoverRarity');

  popTpl.innerHTML = '';
  TEMPLATES[slot].forEach((t, i) => popTpl.appendChild(new Option(t.name, i)));
  popLvl.innerHTML = '';
  LEVELS.forEach((lv, i) => popLvl.appendChild(new Option(lv, i)));
  popRar.innerHTML = '';
  RARITIES.forEach((r, i) => popRar.appendChild(new Option(r, i)));

  popTpl.value = pieceRow.templateIndex;
  popLvl.value = pieceRow.levelIndex;
  popRar.value = pieceRow.rarityIndex;

  // Update image & name in header
  const tpl = TEMPLATES[slot][pieceRow.templateIndex];
  document.getElementById('popoverPieceName').textContent = tpl?.name || '—';
  const imgEl = document.getElementById('popoverImg');
  if (tpl) {
    imgEl.src = getPieceImageUrl(slot, tpl.name) || '';
    imgEl.onerror = () => { imgEl.src = ''; };
  }

  // Update header when template changes
  popTpl.onchange = () => {
    const t2 = TEMPLATES[slot][Number(popTpl.value)];
    document.getElementById('popoverPieceName').textContent = t2?.name || '—';
    const newUrl = getPieceImageUrl(slot, t2?.name);
    imgEl.src = newUrl || '';
  };

  document.getElementById('chipPopover').style.display = 'block';
  setTimeout(() => document.addEventListener('mousedown', onDocClick), 0);
}

function closePopover(revert = false) {
  if (!popState.open) return;
  document.removeEventListener('mousedown', onDocClick);
  if (revert && popState.original) {
    const rows = state.slots[popState.slot];
    const idx = rows.findIndex(r => r.id === popState.pieceId);
    if (idx !== -1) Object.assign(rows[idx], popState.original);
  }
  popState = { open: false, slot: null, pieceId: null, original: null };
  document.getElementById('chipPopover').style.display = 'none';
}

function onDocClick(e) {
  const popover = document.getElementById('chipPopover');
  if (!popState.open || popover.contains(e.target)) return;
  applyPopoverToPiece();
  closePopover(false);
  renderAllSlots();
}

function applyPopoverToPiece() {
  if (!popState.open) return;
  const rows = state.slots[popState.slot];
  const idx = rows.findIndex(r => r.id === popState.pieceId);
  if (idx === -1) return;
  rows[idx].templateIndex = Number(document.getElementById('popoverTemplate').value);
  rows[idx].levelIndex    = Number(document.getElementById('popoverLevel').value);
  rows[idx].rarityIndex   = Number(document.getElementById('popoverRarity').value);
}

// ─── RUN ─────────────────────────────────────────────────────────────────────

function buildRuntimeSlots() {
  const runtime = {};
  for (const slot of SLOTS_ORDER) {
    runtime[slot] = (state.slots[slot] || []).map(row =>
      buildPieceFromTemplate(TEMPLATES[slot][row.templateIndex], row.levelIndex, row.rarityIndex)
    );
  }
  return runtime;
}

function run() {
  state.scenario = document.getElementById('scenarioSelect')?.value || state.scenario;
  const outputArea = document.getElementById('outputArea');
  const outputSummary = document.getElementById('outputSummary');

  for (const slot of SLOTS_ORDER) {
    if (!state.slots[slot] || state.slots[slot].length === 0) {
      outputArea.innerHTML = `<div class="output-empty">Error: slot <strong>${slot}</strong> has no pieces.</div>`;
      return;
    }
  }

  const runtime = buildRuntimeSlots();
  const pruned  = pruneArmorSlots(runtime, state.scenario, SITUATION_CONFIG);

  for (const slot of SLOTS_ORDER) {
    if (!pruned[slot] || pruned[slot].length === 0) {
      outputArea.innerHTML = `<div class="output-empty">After pruning, slot <strong>${slot}</strong> is empty.</div>`;
      return;
    }
  }

  const allCombos = computeAllCombinations(pruned, state.scenario, SITUATION_CONFIG, SLOTS_ORDER);
  const candidates = computeIntersectionsForCombinations(allCombos);
  const intervals  = computeOptimalCombinationIntervals(allCombos, candidates);
  const merged     = mergeIntervals(intervals);

  if (outputSummary) outputSummary.textContent = `${merged.length} intervals · ${(currentInherentBonus()*100).toFixed(2)}% inherent`;
  renderOutput(merged);

  // Scroll to results
  document.getElementById('outputSection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ─── OUTPUT RENDERING ─────────────────────────────────────────────────────────

function formatRange(xMin, xMax) {
  if (!isFinite(xMax)) return `${Math.round(xMin).toLocaleString()} — ∞`;
  return `${Math.round(xMin).toLocaleString()} — ${Math.round(xMax).toLocaleString()}`;
}

let _lastMerged = [];

function renderOutput(merged) {
  _lastMerged = merged || [];
  const area = document.getElementById('outputArea');
  if (!merged || merged.length === 0) {
    area.innerHTML = '<div class="output-empty">No results.</div>';
    return;
  }

  const container = document.createElement('div');
  container.className = 'output-chips';

  merged.forEach(([xMin, xMax, combo]) => {
    const inherent = currentInherentBonus();
    const rangeStr = formatRange(xMin * (1 + inherent), xMax * (1 + inherent));
    const displayPercent = ((combo.total_percent || 0) - inherent) * 100;
    const totalFlat = Math.round(combo.total_flat || 0);

    const row = document.createElement('div');
    row.className = 'output-row';

    // Main chip
    const inherentForAttr = currentInherentBonus();
    const attrMin = xMin * (1 + inherentForAttr);
    const attrMax = xMax * (1 + inherentForAttr);
    const chip = document.createElement('div');
    chip.className = 'output-chip';
    chip.dataset.rangeMin = attrMin;
    chip.dataset.rangeMax = attrMax;

    const rangeBlock = document.createElement('div');
    rangeBlock.innerHTML = `<div class="range">Base ${rangeStr}</div>`;
    chip.appendChild(rangeBlock);

    const metaWrap = document.createElement('div');
    metaWrap.className = 'chip-meta';
    metaWrap.innerHTML = `
      <span class="small-badge">${displayPercent.toFixed(2)}% pct</span>
      <span class="small-badge">${totalFlat.toLocaleString()} flat</span>
    `;
    chip.appendChild(metaWrap);

    const toggle = document.createElement('button');
    toggle.className = 'expand-toggle';
    toggle.textContent = '▾';
    chip.appendChild(toggle);

    // Detail (expanded gear pieces)
    const detail = document.createElement('div');
    detail.className = 'output-detail';
    detail.style.display = 'none';

    const piecesRow = document.createElement('div');
    piecesRow.className = 'chips';

    SLOTS_ORDER.forEach(slot => {
      const pieceName = combo.combo_names[slot] || '-';
      const rows = state.slots[slot] || [];
      let matched = rows.find(r => TEMPLATES[slot]?.[r.templateIndex]?.name === pieceName) || rows[0];
      const levelText  = matched ? (LEVELS[matched.levelIndex] || '') : '';
      const rarityText = matched ? (RARITIES[matched.rarityIndex] || '') : '';
      const rarIdx = RARITIES.indexOf(rarityText);
      const rarClass = ['r-poor','r-common','r-fine','r-exquisite','r-epic','r-legendary'][rarIdx] || 'r-poor';
      const imgUrl = getPieceImageUrl(slot, pieceName);

      const piece = document.createElement('div');
      piece.className = `output-piece ${rarClass}`;

      const imgWrap = document.createElement('div');
      imgWrap.className = 'output-piece-img-wrap';
      imgWrap.appendChild(makeImg(imgUrl, 'output-piece-img', pieceName, '+'));
      piece.appendChild(imgWrap);

      const body = document.createElement('div');
      body.className = 'output-piece-body';
      body.innerHTML = `
        <div class="slot-badge">${slot}</div>
        <div class="piece-label">${pieceName.replace(/^\d+ \| /, '')}</div>
        <div class="piece-meta">${levelText ? `L${levelText} · ${rarityText}` : rarityText || '—'}</div>
      `;
      piece.appendChild(body);
      piecesRow.appendChild(piece);
    });

    detail.appendChild(piecesRow);

    let open = false;
    const setOpen = v => {
      open = !!v;
      detail.style.display = open ? 'flex' : 'none';
      toggle.textContent = open ? '▴' : '▾';
    };
    toggle.addEventListener('click', e => { e.stopPropagation(); setOpen(!open); });
    chip.addEventListener('click', () => setOpen(!open));

    row.appendChild(chip);
    row.appendChild(detail);
    container.appendChild(row);
  });

  area.innerHTML = '';
  area.appendChild(container);
}

// ─── SAVE / LOAD BUILDS ───────────────────────────────────────────────────────

const STORAGE_KEY = 'marchOptimizer_builds';

function loadSavedBuilds() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

function saveBuild(name) {
  if (!name.trim()) return;
  const builds = loadSavedBuilds();
  const build = {
    id: Date.now(),
    name: name.trim(),
    date: new Date().toLocaleDateString(),
    scenario: state.scenario,
    slots: JSON.parse(JSON.stringify(state.slots)),
    toggle8: state.toggle8On,
    toggle6p56: state.toggle6p56On
  };
  builds.push(build);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(builds));
  renderSavedBuilds();
  document.getElementById('buildNameInput').value = '';
}

function loadBuild(id) {
  const builds = loadSavedBuilds();
  const build = builds.find(b => b.id === id);
  if (!build) return;
  state.scenario = build.scenario;
  state.slots = build.slots;
  state.toggle8On = build.toggle8;
  state.toggle6p56On = build.toggle6p56;
  document.getElementById('scenarioSelect').value = state.scenario;
  updateToggleUI();
  renderAllSlots();
  switchView('builder');
}

function deleteBuild(id) {
  const builds = loadSavedBuilds().filter(b => b.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(builds));
  renderSavedBuilds();
}

function renderSavedBuilds() {
  const area = document.getElementById('savedBuildsArea');
  if (!area) return;
  const builds = loadSavedBuilds();
  if (builds.length === 0) {
    area.innerHTML = '<div class="output-empty">No saved builds yet. Use the sidebar to save your current build.</div>';
    return;
  }
  area.innerHTML = '';
  builds.slice().reverse().forEach(build => {
    const card = document.createElement('div');
    card.className = 'saved-build-card';
    card.innerHTML = `
      <div>
        <div class="saved-build-name">${escapeHtml(build.name)}</div>
        <div class="saved-build-meta">${build.scenario} · ${build.date}</div>
      </div>
      <div class="saved-build-actions">
        <button class="btn-sm primary" onclick="loadBuild(${build.id})">Load</button>
        <button class="btn-sm danger" onclick="deleteBuild(${build.id})">Delete</button>
      </div>
    `;
    area.appendChild(card);
  });
}

// ─── COMPARE ─────────────────────────────────────────────────────────────────

let compareState = {
  left:  { slot: SLOTS_ORDER[0], templateIndex: 1, levelIndex: 1, rarityIndex: 4 },
  right: { slot: SLOTS_ORDER[0], templateIndex: 2, levelIndex: 1, rarityIndex: 4 }
};

function initCompare() {
  const slotL = document.getElementById('compareSlotLeft');
  const slotR = document.getElementById('compareSlotRight');
  [slotL, slotR].forEach(sel => {
    sel.innerHTML = '';
    SLOTS_ORDER.forEach(s => sel.appendChild(new Option(s.charAt(0).toUpperCase() + s.slice(1), s)));
  });
  slotL.value = compareState.left.slot;
  slotR.value = compareState.right.slot;

  ['left','right'].forEach(side => {
    const lvlSel = document.getElementById(`compareLevel${side.charAt(0).toUpperCase() + side.slice(1)}`);
    const rarSel = document.getElementById(`compareRarity${side.charAt(0).toUpperCase() + side.slice(1)}`);
    lvlSel.innerHTML = '';
    LEVELS.forEach((lv, i) => lvlSel.appendChild(new Option(lv, i)));
    rarSel.innerHTML = '';
    RARITIES.forEach((r, i) => rarSel.appendChild(new Option(r, i)));
    lvlSel.value = compareState[side].levelIndex;
    rarSel.value = compareState[side].rarityIndex;
  });

  updateCompareSelects();
}

function updateCompareSelects() {
  ['left','right'].forEach(side => {
    const cap = side.charAt(0).toUpperCase() + side.slice(1);
    const slotSel = document.getElementById(`compareSlot${cap}`);
    const slot = slotSel?.value || SLOTS_ORDER[0];
    compareState[side].slot = slot;
    filterComparePieces(side);
  });
  renderCompareStats();
}

function filterComparePieces(side) {
  const cap = side.charAt(0).toUpperCase() + side.slice(1);
  const slot = compareState[side].slot;
  const query = (document.getElementById(`compareSearch${cap}`)?.value || '').trim().toLowerCase();
  const listEl = document.getElementById(`comparePieceList${cap}`);
  if (!listEl) return;
  listEl.innerHTML = '';

  const templates = TEMPLATES[slot] || [];
  templates.forEach((tpl, idx) => {
    if (tpl.name === 'Empty') return;
    if (query && !tpl.name.toLowerCase().includes(query)) return;

    const imgUrl = getPieceImageUrl(slot, tpl.name);
    const card = document.createElement('div');
    card.className = 'compare-piece-card' + (compareState[side].templateIndex === idx ? ' selected' : '');

    const imgWrap = document.createElement('div');
    imgWrap.style.cssText = 'width:100%;aspect-ratio:1;overflow:hidden;background:var(--surface-3);display:flex;align-items:center;justify-content:center;';
    imgWrap.appendChild(makeImg(imgUrl, 'modal-piece-img', tpl.name, '+'));
    card.appendChild(imgWrap);

    const lbl = document.createElement('div');
    lbl.className = 'card-lbl';
    lbl.textContent = tpl.name.replace(/^\d+ \| /, '');
    card.appendChild(lbl);

    card.addEventListener('click', () => {
      compareState[side].templateIndex = idx;
      filterComparePieces(side);
      renderCompareStats();
    });
    listEl.appendChild(card);
  });
}

function renderCompareStats() {
  const statsEl = document.getElementById('compareStats');
  if (!statsEl) return;

  const getSelected = side => {
    const cap = side.charAt(0).toUpperCase() + side.slice(1);
    const slot = compareState[side].slot;
    const tplIdx = compareState[side].templateIndex;
    const lvlIdx = Number(document.getElementById(`compareLevel${cap}`)?.value || 1);
    const rarIdx = Number(document.getElementById(`compareRarity${cap}`)?.value || 4);
    compareState[side].levelIndex = lvlIdx;
    compareState[side].rarityIndex = rarIdx;
    const tpl = TEMPLATES[slot]?.[tplIdx];
    if (!tpl) return null;
    return { slot, tpl, piece: buildPieceFromTemplate(tpl, lvlIdx, rarIdx), lvlIdx, rarIdx };
  };

  const L = getSelected('left');
  const R = getSelected('right');

  if (!L || !R) {
    statsEl.innerHTML = '<div class="compare-no-data">Select a piece on each side to compare.</div>';
    return;
  }

  const STAT_LABELS = { base: 'Base MS', 'vs P': 'vs Player', 'vs SOP': 'vs SOP', Rein: 'Reinforce', Dragon: 'Dragon', Percent: '% Boost' };
  const allKeys = Object.keys(STAT_LABELS);

  const rows = allKeys.map(key => {
    const lv = L.piece.stats[key] || 0;
    const rv = R.piece.stats[key] || 0;
    const fmt = key === 'Percent'
      ? v => v ? (v * 100).toFixed(3) + '%' : '—'
      : v => v ? v.toLocaleString() : '—';
    let lCls = 'stat-tie', rCls = 'stat-tie';
    if (lv > rv) { lCls = 'stat-win'; rCls = 'stat-lose'; }
    else if (rv > lv) { rCls = 'stat-win'; lCls = 'stat-lose'; }
    return `<tr>
      <td class="${lCls}">${fmt(lv)}</td>
      <td class="stat-label-cell">${STAT_LABELS[key]}</td>
      <td class="${rCls}">${fmt(rv)}</td>
    </tr>`;
  }).join('');

  // Header images
  const lImg = getPieceImageUrl(L.slot, L.tpl.name);
  const rImg = getPieceImageUrl(R.slot, R.tpl.name);

  statsEl.innerHTML = `
    <table class="compare-stats-table">
      <thead>
        <tr>
          <th>
            <div style="display:flex;align-items:center;gap:8px;justify-content:flex-end">
              <span style="overflow:hidden;text-overflow:ellipsis">${L.tpl.name}</span>
              <img src="${lImg || ''}" onerror="this.style.display='none'" style="width:28px;height:28px;object-fit:contain;border-radius:4px;background:var(--surface-3);flex-shrink:0;padding:2px">
            </div>
          </th>
          <th style="text-align:center">STAT</th>
          <th>
            <div style="display:flex;align-items:center;gap:8px;justify-content:flex-start">
              <img src="${rImg || ''}" onerror="this.style.display='none'" style="width:28px;height:28px;object-fit:contain;border-radius:4px;background:var(--surface-3);flex-shrink:0;padding:2px">
              <span style="overflow:hidden;text-overflow:ellipsis">${R.tpl.name}</span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

// ─── VIEW SWITCHER ────────────────────────────────────────────────────────────

function switchView(view) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  document.getElementById(`view-${view}`)?.classList.add('active');
  document.querySelector(`[data-view="${view}"]`)?.classList.add('active');
  if (view === 'saves') renderSavedBuilds();
  if (view === 'compare') initCompare();
}

// ─── UTILS ───────────────────────────────────────────────────────────────────

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// ─── INIT ─────────────────────────────────────────────────────────────────────

function populateScenarioSelect() {
  const sel = document.getElementById('scenarioSelect');
  if (!sel) return;
  sel.innerHTML = '';
  for (const k of Object.keys(SITUATION_CONFIG)) sel.appendChild(new Option(k, k));
  sel.value = state.scenario;
}


// ─── MARCH SIZE HIGHLIGHTER ──────────────────────────────────────────────────
function highlightMarchSize() {
  const val = parseFloat(document.getElementById('marchSizeInput')?.value);
  const chips = document.querySelectorAll('.output-chip[data-range-min]');
  chips.forEach(chip => chip.classList.remove('march-match', 'march-dim'));
  if (!val || isNaN(val) || chips.length === 0) return;

  let matched = false;
  chips.forEach(chip => {
    const min = parseFloat(chip.dataset.rangeMin);
    const max = parseFloat(chip.dataset.rangeMax);
    const inRange = val >= min && (isNaN(max) || val <= max || max === Infinity);
    if (inRange) { chip.classList.add('march-match'); matched = true; }
    else chip.classList.add('march-dim');
  });

  if (matched) {
    const matchEl = document.querySelector('.output-chip.march-match');
    matchEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // Auto-expand the matched row
    matchEl?.click();
  }
}

function clearMarchHighlight() {
  document.querySelectorAll('.output-chip').forEach(c => c.classList.remove('march-match', 'march-dim'));
  const inp = document.getElementById('marchSizeInput');
  if (inp) inp.value = '';
}

document.getElementById('marchFindBtn')?.addEventListener('click', highlightMarchSize);
document.getElementById('marchClearBtn')?.addEventListener('click', clearMarchHighlight);
document.getElementById('marchSizeInput')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') highlightMarchSize();
});

// Wire up buttons
document.getElementById('popoverSave')?.addEventListener('click', () => {
  applyPopoverToPiece(); closePopover(false); renderAllSlots();
});
document.getElementById('popoverDelete')?.addEventListener('click', () => {
  if (!popState.open) return;
  state.slots[popState.slot] = state.slots[popState.slot].filter(r => r.id !== popState.pieceId);
  closePopover(false); renderAllSlots();
});
document.getElementById('popoverClose')?.addEventListener('click', () => { closePopover(true); renderAllSlots(); });

document.getElementById('toggle8')?.addEventListener('click', () => { state.toggle8On = !state.toggle8On; updateToggleUI(); });
document.getElementById('toggle6p56')?.addEventListener('click', () => { state.toggle6p56On = !state.toggle6p56On; updateToggleUI(); });

document.getElementById('runBtn')?.addEventListener('click', () => {
  document.getElementById('outputArea').innerHTML = '<div class="output-empty" style="color:var(--accent)">Computing…</div>';
  setTimeout(run, 8);
});
document.getElementById('resetBtn')?.addEventListener('click', () => {
  state.NEXT_ID = 1; initState(); populateScenarioSelect(); renderAllSlots();
  document.getElementById('outputArea').innerHTML = '<div class="output-empty">Run a calculation to see results.</div>';
  document.getElementById('outputSummary').textContent = '—';
});
document.getElementById('saveBuildBtn')?.addEventListener('click', () => {
  saveBuild(document.getElementById('buildNameInput').value);
});
document.getElementById('buildNameInput')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') saveBuild(e.target.value);
});

// Boot
initState();
populateScenarioSelect();
renderAllSlots();
