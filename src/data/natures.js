// The 25 natures, keyed by their lowercase English identifier, from the
// PokeAPI clone's natures.csv. Each nature raises one stat by 10% and lowers
// another by 10%; stat names match data/stats.js's own key convention
// (attack / defense / spAttack / spDefense / speed — a nature never touches
// HP).
//
// The five NEUTRAL natures (hardy, docile, serious, bashful, quirky) have an
// EMPTY object: both keys are omitted rather than pointed at the same stat,
// so straightforward consumer code multiplies by nothing at all instead of
// 1.1 * 0.9.
//
// Data only (0.2.5): app.js's calcStat() still assumes a neutral nature and
// does not read this table.

var NATURES = {
  hardy: {}, // neutral
  bold: { increasedStat: "defense", decreasedStat: "attack" },
  modest: { increasedStat: "spAttack", decreasedStat: "attack" },
  calm: { increasedStat: "spDefense", decreasedStat: "attack" },
  timid: { increasedStat: "speed", decreasedStat: "attack" },
  lonely: { increasedStat: "attack", decreasedStat: "defense" },
  docile: {}, // neutral
  mild: { increasedStat: "spAttack", decreasedStat: "defense" },
  gentle: { increasedStat: "spDefense", decreasedStat: "defense" },
  hasty: { increasedStat: "speed", decreasedStat: "defense" },
  adamant: { increasedStat: "attack", decreasedStat: "spAttack" },
  impish: { increasedStat: "defense", decreasedStat: "spAttack" },
  bashful: {}, // neutral
  careful: { increasedStat: "spDefense", decreasedStat: "spAttack" },
  rash: { increasedStat: "spAttack", decreasedStat: "spDefense" },
  jolly: { increasedStat: "speed", decreasedStat: "spAttack" },
  naughty: { increasedStat: "attack", decreasedStat: "spDefense" },
  lax: { increasedStat: "defense", decreasedStat: "spDefense" },
  quirky: {}, // neutral
  naive: { increasedStat: "speed", decreasedStat: "spDefense" },
  brave: { increasedStat: "attack", decreasedStat: "speed" },
  relaxed: { increasedStat: "defense", decreasedStat: "speed" },
  quiet: { increasedStat: "spAttack", decreasedStat: "speed" },
  sassy: { increasedStat: "spDefense", decreasedStat: "speed" },
  serious: {}, // neutral
};
