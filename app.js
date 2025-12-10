const LEVELS = [40,45,50];
const RARITIES = ["poor","common","fine","exquisite","epic","legendary"];

const LARGE_SLOTS_ORDER = ["helmet","weapon","chest","ring","pants","boots"];
const SMALL_SLOTS_ORDER = ["helmet","chest","pants","boots","ring","weapon"];

let SLOTS_ORDER = window.matchMedia('(max-width:880px)').matches ? SMALL_SLOTS_ORDER : LARGE_SLOTS_ORDER;

const SITUATION_CONFIG = {
    "vs SOP":                 { flat_keys: ["base","vs SOP","vs P"],             percent_keys: ["Percent"]},
    "vs SOP with Drag":       { flat_keys: ["base","Dragon","vs SOP","vs P"],    percent_keys: ["Percent"]},
    "vs Player":              { flat_keys: ["base","vs P"],                      percent_keys: ["Percent"]},
    "vs Player with Drag":    { flat_keys: ["base","Dragon","vs P"],             percent_keys: ["Percent"]},
    "Rein":                   { flat_keys: ["base","Rein"],                      percent_keys: ["Percent"]},
    "Rein with Drag":         { flat_keys: ["base","Rein","Dragon"],             percent_keys: ["Percent"]}
};

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

const TEMPLATES = {
    helmet: [
        {name: "Empty",                             mapping: {base: null,              "vs P": null,             Percent: null,                      Dragon: null,          "vs SOP": null,              Rein: null}},
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

const state = {
  scenario: Object.keys(SITUATION_CONFIG)[0],
  slots: {},
  NEXT_ID: 1,
  toggle8On: false,
  toggle6p56On: false
};

function genId(){ return state.NEXT_ID++; }
function initState(){
  state.slots = {};
  for (const s of SLOTS_ORDER) state.slots[s] = [{ id: genId(), templateIndex:0, levelIndex:0, rarityIndex:0 }];
  state.toggle8On = false;
  state.toggle6p56On = false;
  updateToggleUI();
}

function currentInherentBonus(){ let total=0; if (state.toggle8On) total += 0.08; if (state.toggle6p56On) total += 0.0656; return total; }
function updateToggleUI(){
  const disp = document.getElementById('inherentDisplay');
  const t8 = document.getElementById('toggle8');
  const t6 = document.getElementById('toggle6p56');
  if (t8) { if (state.toggle8On) t8.classList.add('active'); else t8.classList.remove('active'); }
  if (t6) { if (state.toggle6p56On) t6.classList.add('active'); else t6.classList.remove('active'); }
  if (disp) disp.textContent = (currentInherentBonus()*100).toFixed(2) + '%';
}

function buildPieceFromTemplate(template, levelIndex, rarityIndex){
  const stats = {};
  const keys = ["base","Dragon","vs SOP","Rein","Percent","vs P"];
  for (const key of keys){
    const matId = template.mapping[key];
    if (matId && MATRICES[matId]){
      const row = MATRICES[matId][levelIndex] || [];
      stats[key] = row[rarityIndex] || 0;
    } else stats[key] = 0;
  }
  return { name: template.name, stats };
}

function removeDominatedPieces(pieces, scenario, config){
  if (!pieces || pieces.length === 0) return [];
  const cfg = config[scenario];
  const statList = pieces.map(piece=>{
    const flat = cfg.flat_keys.reduce((acc,k)=>acc + (piece.stats[k] || 0),0);
    const percent = cfg.percent_keys.reduce((acc,k)=>acc + (piece.stats[k] || 0),0);
    return { piece, flat, percent };
  });
  const pruned = [];
  for (let i=0;i<statList.length;i++){
    const {piece:pi, flat:fi, percent:pei} = statList[i];
    let dominated=false;
    for (let j=0;j<statList.length;j++){
      if (i===j) continue;
      const {flat:fj, percent:pej} = statList[j];
      if (fj>=fi && pej>=pei && (fj>fi || pej>pei)){ dominated=true; break; }
    }
    if (!dominated) pruned.push(pi);
  }
  return pruned;
}

function pruneArmorSlots(runtimeSlots, scenario, config){
  const pruned = {};
  for (const s of Object.keys(runtimeSlots)) pruned[s] = removeDominatedPieces(runtimeSlots[s], scenario, config);
  return pruned;
}

function computeCombinationStats(combination, scenario, config){
  let totalFlat=0, totalPercent=0;
  for (const piece of combination){
    for (const k of config[scenario].flat_keys) totalFlat += piece.stats[k] || 0;
    for (const k of config[scenario].percent_keys) totalPercent += piece.stats[k] || 0;
  }
  totalPercent += currentInherentBonus();
  const slope = 1 + totalPercent;
  const intercept = totalFlat * (1 + totalPercent);
  return { slope, intercept, totalFlat, totalPercent };
}

function cartesianProduct(arrays){
  if (!arrays || arrays.length===0) return [[]];
  return arrays.reduce((acc, arr) => {
    const out=[];
    for (const prefix of acc) for (const item of arr) out.push(prefix.concat([item]));
    return out;
  }, [[]]);
}

function computeAllCombinations(slotsMap, scenario, config, slotOrder){
  const lists = slotOrder.map(s => slotsMap[s] || []);
  if (lists.some(l=>l.length===0)) return [];
  const combos = cartesianProduct(lists);
  return combos.map(combination=>{
    const comboNames = {};
    slotOrder.forEach((slot,i)=> comboNames[slot] = combination[i].name);
    const s = computeCombinationStats(combination, scenario, config);
    return { combo: combination, combo_names: comboNames, slope: s.slope, intercept: s.intercept, total_flat: s.totalFlat, total_percent: s.totalPercent };
  });
}

function computeIntersectionsForCombinations(allCombos, eps=1e-9){
  const candidates = new Set([0]);
  const n = allCombos.length;
  for (let i=0;i<n;i++){
    const m1 = allCombos[i].slope, c1 = allCombos[i].intercept;
    for (let j=i+1;j<n;j++){
      const m2 = allCombos[j].slope, c2 = allCombos[j].intercept;
      if (Math.abs(m1-m2) < eps) continue;
      const xInt = (c2 - c1) / (m1 - m2);
      if (xInt >= 0 && Number.isFinite(xInt)) candidates.add(xInt);
    }
  }
  return Array.from(candidates).sort((a,b)=>a-b);
}

function computeOptimalCombinationIntervals(allCombos, candidates){
  if (!allCombos || allCombos.length===0) return [];
  const intervals=[];
  for (let idx=0; idx<candidates.length; idx++){
    const xLower = candidates[idx];
    let xUpper, testX;
    if (idx < candidates.length-1){ xUpper = candidates[idx+1]; testX = (xLower + xUpper)/2; }
    else { xUpper = Infinity; testX = xLower + 100; }
    let best = null, bestVal = -Infinity;
    for (const combo of allCombos){
      const val = combo.slope * testX + combo.intercept;
      if (val > bestVal) { bestVal = val; best = combo; }
    }
    if (best) intervals.push([xLower, xUpper, best]);
  }
  return intervals;
}

function mergeIntervals(intervals, eps=1e-6){
  if (!intervals || intervals.length===0) return [];
  const merged=[intervals[0]];
  for (let i=1;i<intervals.length;i++){
    const [prevMin, prevMax, prevCombo] = merged[merged.length-1];
    const [curMin, curMax, curCombo] = intervals[i];
    const sameCombo = JSON.stringify(prevCombo.combo_names) === JSON.stringify(curCombo.combo_names);
    if (sameCombo && Math.abs(curMin - prevMax) < eps) merged[merged.length-1] = [prevMin, curMax, prevCombo];
    else merged.push(intervals[i]);
  }
  return merged;
}

const slotsContainer = document.getElementById('slotsContainer');
const scenarioSelect = document.getElementById('scenarioSelect');
const runBtn = document.getElementById('runBtn');
const resetBtn = document.getElementById('resetBtn');
const outputArea = document.getElementById('outputArea');
const outputSummary = document.getElementById('outputSummary');
const toggle8 = document.getElementById('toggle8');
const toggle6p56 = document.getElementById('toggle6p56');

const popover = document.getElementById('chipPopover');
const popTpl = document.getElementById('popoverTemplate');
const popLvl = document.getElementById('popoverLevel');
const popRar = document.getElementById('popoverRarity');
const popSave = document.getElementById('popoverSave');
const popDelete = document.getElementById('popoverDelete');
const popClose = document.getElementById('popoverClose');

let popState = { open:false, slot:null, pieceId:null, original:null };

function populateScenarioSelect(){
  if (!scenarioSelect) return;
  scenarioSelect.innerHTML = '';
  for (const k of Object.keys(SITUATION_CONFIG)) scenarioSelect.appendChild(new Option(k,k));
  scenarioSelect.value = state.scenario;
}

function populatePopoverOptions(slot){
  popTpl.innerHTML=''; popLvl.innerHTML=''; popRar.innerHTML='';
  const tlist = TEMPLATES[slot] || [];
  tlist.forEach((t,i)=> popTpl.appendChild(new Option(t.name, i)));
  LEVELS.forEach((lv,i)=> popLvl.appendChild(new Option(lv, i)));
  RARITIES.forEach((r,i)=> popRar.appendChild(new Option(r, i)));
}

function showPopover(slot, pieceRow){
  popState.open = true;
  popState.slot = slot;
  popState.pieceId = pieceRow.id;
  popState.original = { templateIndex: pieceRow.templateIndex, levelIndex: pieceRow.levelIndex, rarityIndex: pieceRow.rarityIndex };

  populatePopoverOptions(slot);
  popTpl.value = pieceRow.templateIndex;
  popLvl.value = pieceRow.levelIndex;
  popRar.value = pieceRow.rarityIndex;

  popover.style.display = 'block';
  setTimeout(()=> { document.addEventListener('mousedown', onDocumentMouseDown); }, 0);
}

function closePopover(revert=false){
  if (!popState.open) return;
  document.removeEventListener('mousedown', onDocumentMouseDown);
  if (revert && popState.original) {
    const rows = state.slots[popState.slot];
    const idx = rows.findIndex(r=>r.id===popState.pieceId);
    if (idx !== -1){
      rows[idx].templateIndex = popState.original.templateIndex;
      rows[idx].levelIndex = popState.original.levelIndex;
      rows[idx].rarityIndex = popState.original.rarityIndex;
    }
  }
  popState = { open:false, slot:null, pieceId:null, original:null };
  popover.style.display = 'none';
}

function onDocumentMouseDown(e){
  if (!popState.open) return;
  if (popover.contains(e.target)) return;
  applyPopoverToPiece();
  closePopover(false);
  renderAllSlots();
}

function applyPopoverToPiece(){
  if (!popState.open) return;
  const slot = popState.slot; const id = popState.pieceId;
  const rows = state.slots[slot];
  const idx = rows.findIndex(r => r.id === id);
  if (idx === -1) return;
  rows[idx].templateIndex = Number(popTpl.value);
  rows[idx].levelIndex = Number(popLvl.value);
  rows[idx].rarityIndex = Number(popRar.value);
}

function renderAllSlots(){
  if (!slotsContainer) return;
  slotsContainer.innerHTML = '';
  for (const slot of SLOTS_ORDER){
    const card = document.createElement('div'); card.className = 'slot-card';
    const header = document.createElement('div'); header.className = 'slot-header';
    const title = document.createElement('div'); title.innerHTML = `<strong>${slot}</strong>`;
    const addBtn = document.createElement('button'); addBtn.className = 'add-btn'; addBtn.textContent = 'Add';
    addBtn.addEventListener('click', ()=> { addPiece(slot); renderAllSlots(); });
    header.appendChild(title); header.appendChild(addBtn); card.appendChild(header);

    const chipsWrap = document.createElement('div'); chipsWrap.className = 'chips';
    const rows = state.slots[slot] || [];

    rows.forEach(row => {
      const tpl = (TEMPLATES[slot] && TEMPLATES[slot][row.templateIndex]) || { name: 'Unknown', mapping:{} };
      const piece = buildPieceFromTemplate(tpl, row.levelIndex, row.rarityIndex);

      const chip = document.createElement('div');
      const rarityClassMap = ['r-poor','r-common','r-fine','r-exquisite','r-epic','r-legendary'];
      const rarityClass = rarityClassMap[row.rarityIndex] || 'r-poor';
      chip.className = `chip ${rarityClass}`;
      chip.style.width = 'auto'; chip.style.minWidth = '0';

      const label = document.createElement('div'); label.className = 'label'; label.textContent = piece.name;
      chip.appendChild(label);

      const meta = document.createElement('div'); meta.className = 'meta';
      const levelText = LEVELS[row.levelIndex] || LEVELS[0];
      const rarityText = RARITIES[row.rarityIndex] || RARITIES[0];
      meta.textContent = `${levelText} • ${rarityText}`;
      chip.appendChild(meta);

      const x = document.createElement('button'); x.className = 'x'; x.innerHTML = '✕'; x.title = 'Remove';
      x.addEventListener('click', (ev)=> { ev.stopPropagation(); state.slots[slot] = state.slots[slot].filter(r=>r.id!==row.id); renderAllSlots(); });
      chip.appendChild(x);

      chip.addEventListener('click', ()=> showPopover(slot, row));
      chipsWrap.appendChild(chip);
    });

    if (rows.length === 0){
      const hint = document.createElement('div'); hint.className = 'small'; hint.textContent = 'No pieces. Click Add to create one.';
      chipsWrap.appendChild(hint);
    }

    card.appendChild(chipsWrap);
    slotsContainer.appendChild(card);
  }
  updateToggleUI();
}

function addPiece(slot){ if (!state.slots[slot]) state.slots[slot] = []; state.slots[slot].push({ id: genId(), templateIndex:0, levelIndex:0, rarityIndex:0 }); }

function buildRuntimeSlots(){
  const runtime = {};
  for (const slot of SLOTS_ORDER){
    runtime[slot] = (state.slots[slot] || []).map(row => {
      const tpl = TEMPLATES[slot][row.templateIndex];
      return buildPieceFromTemplate(tpl, row.levelIndex, row.rarityIndex);
    });
  }
  return runtime;
}

function formatRange(xMin, xMax){
  if (!isFinite(xMax)) return `Base ${Math.round(xMin).toLocaleString()} — ∞`;
  return `Base ${Math.round(xMin).toLocaleString()} — ${Math.round(xMax).toLocaleString()}`;
}
function escapeCsvCell(s){
  if (s == null) return '';
  const str = String(s);
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}
function escapeHtml(s){
  if (s == null) return '';
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function pieceSummary(combo){
  return SLOTS_ORDER.map(slot => `${slot}:${combo.combo_names[slot] || '-'}`).join('; ');
}

function renderOutput(merged){
  const area = document.getElementById('outputArea');
  const summary = document.getElementById('outputSummary');
  if (!area) return;
  area.innerHTML = '';
  if (!merged || merged.length === 0){
    area.innerHTML = '<div class="small">No results</div>';
    if (summary) summary.textContent = 'No results';
    return;
  }

  const container = document.createElement('div');
  container.className = 'output-chips';

  merged.forEach(([xMin, xMax, combo], idx) => {
    const inherent = currentInherentBonus() || 0;
    const totalPercent = (combo.total_percent || 0) * 100;
    const rangeStr = formatRange(xMin*(1+inherent), xMax*(1+inherent));
    const totalFlat = Math.round(combo.total_flat || 0);
    const slope = combo.slope != null ? combo.slope.toFixed(4) : '';

    const row = document.createElement('div');
    row.className = 'output-row wide';

    const chip = document.createElement('div');
    chip.className = 'output-chip';

    const rangeBlock = document.createElement('div');
    rangeBlock.className = 'range-block';
    const rangeEl = document.createElement('div');
    rangeEl.className = 'range';
    rangeEl.textContent = rangeStr;
    const rangeSub = document.createElement('div');
    rangeSub.className = 'range-sub';
    rangeBlock.appendChild(rangeEl);
    rangeBlock.appendChild(rangeSub);
    chip.appendChild(rangeBlock);


     
    displayPercent = totalPercent - inherent * 100;
    const metaWrap = document.createElement('div');
    metaWrap.className = 'chip-meta';
    const pctBadge = document.createElement('div');
    pctBadge.className = 'small-badge';
    pctBadge.textContent = `${displayPercent.toFixed(2)}%`; 
    const flatBadge = document.createElement('div');
    flatBadge.className = 'small-badge';
    flatBadge.textContent = `${totalFlat.toLocaleString()}`;
    metaWrap.appendChild(pctBadge);
    metaWrap.appendChild(flatBadge);
    chip.appendChild(metaWrap);

    const toggle = document.createElement('button');
    toggle.className = 'expand-toggle';
    toggle.innerHTML = '▾';
    chip.appendChild(toggle);

    const detail = document.createElement('div');
    detail.className = 'output-detail';
    detail.style.display = 'none';

    const piecesRow = document.createElement('div');
    piecesRow.className = 'chips';

    SLOTS_ORDER.forEach(slot => {
      const pieceName = combo.combo_names[slot] || '-';

      const rows = state.slots[slot] || [];
      let matched = null;
      for (const r of rows){
        const tpl = (TEMPLATES[slot] && TEMPLATES[slot][r.templateIndex]) || { name: 'Unknown' };
        if (tpl.name === pieceName) { matched = r; break; }
      }
      if (!matched && rows[0]) matched = rows[0];

      const levelText = matched ? (LEVELS[matched.levelIndex] || '') : '';
      const rarityText = matched ? (RARITIES[matched.rarityIndex] || '') : '';

      const outChip = document.createElement('div');
      outChip.className = 'output-piece';

      let rarIdx = RARITIES.indexOf(rarityText);
      if (rarIdx === -1) rarIdx = 0;
      const rarityClassMap = ['r-poor','r-common','r-fine','r-exquisite','r-epic','r-legendary'];
      outChip.classList.add(rarityClassMap[rarIdx]);

      const slotBadge = document.createElement('div');
      slotBadge.className = 'slot-badge';
      slotBadge.textContent = slot;
      outChip.appendChild(slotBadge);

      const pieceLabel = document.createElement('div');
      pieceLabel.className = 'piece-label';
      pieceLabel.textContent = pieceName;
      outChip.appendChild(pieceLabel);

      const pieceMeta = document.createElement('div');
      pieceMeta.className = 'piece-meta';
      pieceMeta.textContent = levelText ? `${levelText} • ${rarityText}` : (rarityText || '—');
      outChip.appendChild(pieceMeta);

      piecesRow.appendChild(outChip);
    });

    detail.appendChild(piecesRow);

    let open = false;
    function setOpen(v){
      open = !!v;
      detail.style.display = open ? 'flex' : 'none';
      toggle.innerHTML = open ? '▴' : '▾';
    }
    toggle.addEventListener('click', (e) => { e.stopPropagation(); setOpen(!open); });
    chip.addEventListener('click', () => setOpen(!open));

    row.appendChild(chip);
    row.appendChild(detail);
    container.appendChild(row);
  });

  area.appendChild(container);
  if (summary) summary.textContent = `${merged.length} intervals • ${(currentInherentBonus()*100).toFixed(2)}% inherent`;

  const csvRows = [];
  csvRows.push(['range','total_percent','total_flat','slope','combo'].map(escapeCsvCell).join(','));
  merged.forEach(([xMin,xMax,combo])=>{
    const rangeStr = formatRange(xMin,xMax);
    const percent = (combo.total_percent || 0) * 100;
    const flat = Math.round(combo.total_flat || 0);
    const slope = combo.slope || '';
    const comboText = pieceSummary(combo);
    csvRows.push([rangeStr, percent.toFixed(4), flat, slope, comboText].map(escapeCsvCell).join(','));
  });
  const csvContent = csvRows.join('\n');

  const copyBtn = document.getElementById('copyCsvBtn');
  if (copyBtn){
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(csvContent).then(()=>{
        const old = copyBtn.textContent;
        copyBtn.textContent = 'Copied';
        setTimeout(()=> copyBtn.textContent = old, 1200);
      }).catch(()=>{
        const old = copyBtn.textContent;
        copyBtn.textContent = 'Copy failed';
        setTimeout(()=> copyBtn.textContent = old, 1200);
      });
    };
  }
}



function run(){
  state.scenario = scenarioSelect ? scenarioSelect.value : state.scenario;

  for (const slot of SLOTS_ORDER){
    if (!state.slots[slot] || state.slots[slot].length === 0){
      if (outputArea) outputArea.innerHTML = `<div class="small">Error: slot ${slot} has no pieces.</div>`;
      if (outputSummary) outputSummary.textContent = 'Error';
      return;
    }
  }

  const runtime = buildRuntimeSlots();
  const pruned = pruneArmorSlots(runtime, state.scenario, SITUATION_CONFIG);

  for (const slot of SLOTS_ORDER){
    if (!pruned[slot] || pruned[slot].length === 0){
      if (outputArea) outputArea.innerHTML = `<div class="small">After pruning slot ${slot} empty</div>`;
      if (outputSummary) outputSummary.textContent = 'Error';
      return;
    }
  }

  const allCombos = computeAllCombinations(pruned, state.scenario, SITUATION_CONFIG, SLOTS_ORDER);
  const candidates = computeIntersectionsForCombinations(allCombos);
  const intervals = computeOptimalCombinationIntervals(allCombos, candidates);
  const merged = mergeIntervals(intervals);

  if (outputSummary) outputSummary.textContent = `${merged.length} intervals • ${(currentInherentBonus()*100).toFixed(2)}% inherent`;
  renderOutput(merged);
}

if (popSave) popSave.addEventListener('click', ()=> { applyPopoverToPiece(); closePopover(false); renderAllSlots(); });
if (popDelete) popDelete.addEventListener('click', ()=> {
  if (!popState.open) return;
  const slot = popState.slot; const id = popState.pieceId;
  state.slots[slot] = state.slots[slot].filter(r => r.id !== id);
  closePopover(false); renderAllSlots();
});
if (popClose) popClose.addEventListener('click', ()=> { closePopover(true); renderAllSlots(); });

if (toggle8) toggle8.addEventListener('click', ()=> { state.toggle8On = !state.toggle8On; updateToggleUI(); });
if (toggle6p56) toggle6p56.addEventListener('click', ()=> { state.toggle6p56On = !state.toggle6p56On; updateToggleUI(); });
if (runBtn) runBtn.addEventListener('click', ()=> { if (outputArea) outputArea.textContent = 'Computing…'; setTimeout(run, 8); });
if (resetBtn) resetBtn.addEventListener('click', ()=> { state.NEXT_ID = 1; initState(); populateScenarioSelect(); renderAllSlots(); if (outputArea) outputArea.textContent = 'Reset to defaults.'; });

initState();
populateScenarioSelect();
renderAllSlots();



