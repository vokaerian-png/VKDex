// Gen 9 type-effectiveness chart (unchanged since Gen 6 — Fairy's
// introduction — through today). Keyed by attacking type -> defending
// type -> damage multiplier. Any (attacker, defender) pair not listed is
// neutral (1x) and intentionally omitted rather than spelled out.
//
// This is static game data, not per-Pokemon data: a Pokemon's own
// weaknesses/resistances are computed at render time by looking up each of
// its `types` (see data/pokemon.js) as a *defender* against every
// attacking type here and multiplying across dual types, rather than
// storing a redundant weakness list on every one of the ~1025 entries.

var TYPE_CHART = {
  Normal:   { Rock: 0.5, Ghost: 0, Steel: 0.5 },
  Fire:     { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 2, Bug: 2, Rock: 0.5, Dragon: 0.5, Steel: 2 },
  Water:    { Fire: 2, Water: 0.5, Grass: 0.5, Ground: 2, Rock: 2, Dragon: 0.5 },
  Electric: { Water: 2, Electric: 0.5, Grass: 0.5, Ground: 0, Flying: 2, Dragon: 0.5 },
  Grass:    { Fire: 0.5, Water: 2, Grass: 0.5, Poison: 0.5, Ground: 2, Flying: 0.5, Bug: 0.5, Rock: 2, Dragon: 0.5, Steel: 0.5 },
  Ice:      { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 0.5, Ground: 2, Flying: 2, Dragon: 2, Steel: 0.5 },
  Fighting: { Normal: 2, Ice: 2, Poison: 0.5, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Rock: 2, Ghost: 0, Dark: 2, Steel: 2, Fairy: 0.5 },
  Poison:   { Grass: 2, Poison: 0.5, Ground: 0.5, Rock: 0.5, Ghost: 0.5, Steel: 0, Fairy: 2 },
  Ground:   { Fire: 2, Electric: 2, Grass: 0.5, Poison: 2, Flying: 0, Bug: 0.5, Rock: 2, Steel: 2 },
  Flying:   { Electric: 0.5, Grass: 2, Fighting: 2, Bug: 2, Rock: 0.5, Steel: 0.5 },
  Psychic:  { Fighting: 2, Poison: 2, Psychic: 0.5, Dark: 0, Steel: 0.5 },
  Bug:      { Fire: 0.5, Grass: 2, Fighting: 0.5, Poison: 0.5, Flying: 0.5, Psychic: 2, Ghost: 0.5, Dark: 2, Steel: 0.5, Fairy: 0.5 },
  Rock:     { Fire: 2, Ice: 2, Fighting: 0.5, Ground: 0.5, Flying: 2, Bug: 2, Steel: 0.5 },
  Ghost:    { Normal: 0, Psychic: 2, Ghost: 2, Dark: 0.5 },
  Dragon:   { Dragon: 2, Steel: 0.5, Fairy: 0 },
  Dark:     { Fighting: 0.5, Psychic: 2, Ghost: 2, Dark: 0.5, Fairy: 0.5 },
  Steel:    { Fire: 0.5, Water: 0.5, Electric: 0.5, Ice: 2, Rock: 2, Steel: 0.5, Fairy: 2 },
  Fairy:    { Fire: 0.5, Fighting: 2, Poison: 0.5, Dragon: 2, Dark: 2, Steel: 0.5 }
};

// The same five other-language names data/names.js stores per species, for
// the 18 battle types — keyed by the lowercase English type identifier used
// throughout the data files ("fire", "water", ...), not TYPE_CHART's
// Title Case keys. Data only: nothing renders these yet.

var TYPE_NAMES = {
  normal: { ja: "ノーマル", fr: "Normal", de: "Normal", ko: "노말" },
  fighting: { ja: "かくとう", fr: "Combat", de: "Kampf", ko: "격투" },
  flying: { ja: "ひこう", fr: "Vol", de: "Flug", ko: "비행" },
  poison: { ja: "どく", fr: "Poison", de: "Gift", ko: "독" },
  ground: { ja: "じめん", fr: "Sol", de: "Boden", ko: "땅" },
  rock: { ja: "いわ", fr: "Roche", de: "Gestein", ko: "바위" },
  bug: { ja: "むし", fr: "Insecte", de: "Käfer", ko: "벌레" },
  ghost: { ja: "ゴースト", fr: "Spectre", de: "Geist", ko: "고스트" },
  steel: { ja: "はがね", fr: "Acier", de: "Stahl", ko: "강철" },
  fire: { ja: "ほのお", fr: "Feu", de: "Feuer", ko: "불꽃" },
  water: { ja: "みず", fr: "Eau", de: "Wasser", ko: "물" },
  grass: { ja: "くさ", fr: "Plante", de: "Pflanze", ko: "풀" },
  electric: { ja: "でんき", fr: "Électrik", de: "Elektro", ko: "전기" },
  psychic: { ja: "エスパー", fr: "Psy", de: "Psycho", ko: "에스퍼" },
  ice: { ja: "こおり", fr: "Glace", de: "Eis", ko: "얼음" },
  dragon: { ja: "ドラゴン", fr: "Dragon", de: "Drache", ko: "드래곤" },
  dark: { ja: "あく", fr: "Ténèbres", de: "Unlicht", ko: "악" },
  fairy: { ja: "フェアリー", fr: "Fée", de: "Fee", ko: "페어리" }
};
