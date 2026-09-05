// ALT_FORMS: alternate formes (Mega Evolution, regional variants, weather/
// cosmetic forms, etc.) for a Pokemon, keyed by its base national dex id.
// See CLAUDE.md §3/§5 and PLAN.md's "Alt Formes wiring for the detail
// screen" for the full governing spec. Each forme:
//   key      - stable identifier, used for the swap-on-tap active state
//              and (absent an isMega/isGmax flag) as its ability-tag label
//   name     - display name under the sprite bubble
//   sprite   - filename (no extension) under data/sprites/pokemon/alt formes/
//              and data/sprites/pokemon/shiny/alt formes/
//   types    - OPTIONAL: present only if this forme's type differs from the
//              base entry's `types` in pokemon.js. Absence means "same as
//              base" (e.g. Deoxys's formes never set this).
//   stats    - OPTIONAL: this forme's own base stats (same shape as
//              STATS[id] in stats.js). Absence means "identical to the
//              base's STATS[id] entry" (e.g. every Castform forme) — the
//              detail screen's stats card renders only the shared base
//              card in that case, one card per distinct-stats forme
//              otherwise.
//   ability  - OPTIONAL: one ability NAME (string, looked up in ABILITIES
//              like every other ability reference) for a single forme-
//              specific ability APPENDED to the base's list (rule 4). Tag
//              shown next to it in the UI is this forme's own `key`-derived
//              short label, or for isMega/isGmax the forme name minus the
//              species name ("Mega", "Mega X", "Gmax"). Set by every Mega
//              forme below (0.1.34). Mutually exclusive with `abilities` —
//              a forme either appends one ability or replaces the whole
//              list, never both.
//   abilities - OPTIONAL: array of ability names (strings), looked up in
//              ABILITIES exactly like pokemon.js's own `abilities` field.
//              Present only on a forme whose FULL ability set differs from
//              the base entry's. Unlike `ability` above this REPLACES the
//              shown list while the forme is active (rule 9's swap-on-tap,
//              alongside the type rows) and reverts with it.
//   hiddenAbility - OPTIONAL: one of the names in that same forme's
//              `abilities` array, marking which slot is hidden. Same
//              convention as pokemon.js's own `hiddenAbility` field.
//              Meaningless without `abilities`.
//   isMega / isGmax - OPTIONAL booleans. isMega is set on all 63 Mega
//              formes at the bottom of this file; isGmax on nothing yet
//              (no Gigantamax data populated). Rendering branches on them
//              only for the ability-tag wording (rule 4).
//   recolorOnly - OPTIONAL boolean, set at the ALT_FORMS[id] level (sibling
//              to `formes`, not per-forme). Marks rule 6: a species whose
//              formes are pure recolors with no stat/type/ability change
//              collapses in the Alt Formes module to one representative
//              sprite + a "+N" badge (N = formes.length - 1, since the
//              representative sprite is itself one of the N+1 formes and
//              isn't double-counted); tapping it opens a popup grid of every
//              forme's sprite + name, no tap-to-swap (that's rule 7/9
//              behavior, which recolor-only formes don't have). Each forme
//              in a recolorOnly group only sets key/name/sprite — no
//              types/stats/ability. Arceus is included here despite its
//              Plate formes changing type in the real games — the user
//              confirmed 2026-09-04 to treat it identically to Unown (no
//              type field, no swap-on-tap) rather than as a rule 7 case.
var ALT_FORMS = {
  386: { // Deoxys — same-typed (all Psychic), each forme has fully distinct stats
    formes: [
      { key: "attack", name: "Attack Forme", sprite: "deoxys_attack",
        stats: { hp: 50, attack: 180, defense: 20, spAttack: 180, spDefense: 20, speed: 150 } },
      { key: "defense", name: "Defense Forme", sprite: "deoxys_defense",
        stats: { hp: 50, attack: 70, defense: 160, spAttack: 70, spDefense: 160, speed: 90 } },
      { key: "speed", name: "Speed Forme", sprite: "deoxys_speed",
        stats: { hp: 50, attack: 95, defense: 90, spAttack: 95, spDefense: 90, speed: 180 } }
    ]
  },
  351: { // Castform — differently-typed (weather-driven), stats identical to base across every forme
    formes: [
      { key: "sunny", name: "Sunny Form", sprite: "castform_sunny", types: ["Fire"] },
      { key: "rainy", name: "Rainy Form", sprite: "castform_rainy", types: ["Water"] },
      { key: "snowy", name: "Snowy Form", sprite: "castform_snowy", types: ["Ice"] }
    ]
  },
  201: { // Unown — rule 6, 28 pure-recolor letter formes (A-Z, !, ?)
    recolorOnly: true,
    formes: [
      { key: "a", name: "A", sprite: "201-a" },
      { key: "b", name: "B", sprite: "201-b" },
      { key: "c", name: "C", sprite: "201-c" },
      { key: "d", name: "D", sprite: "201-d" },
      { key: "e", name: "E", sprite: "201-e" },
      { key: "f", name: "F", sprite: "201-f" },
      { key: "g", name: "G", sprite: "201-g" },
      { key: "h", name: "H", sprite: "201-h" },
      { key: "i", name: "I", sprite: "201-i" },
      { key: "j", name: "J", sprite: "201-j" },
      { key: "k", name: "K", sprite: "201-k" },
      { key: "l", name: "L", sprite: "201-l" },
      { key: "m", name: "M", sprite: "201-m" },
      { key: "n", name: "N", sprite: "201-n" },
      { key: "o", name: "O", sprite: "201-o" },
      { key: "p", name: "P", sprite: "201-p" },
      { key: "q", name: "Q", sprite: "201-q" },
      { key: "r", name: "R", sprite: "201-r" },
      { key: "s", name: "S", sprite: "201-s" },
      { key: "t", name: "T", sprite: "201-t" },
      { key: "u", name: "U", sprite: "201-u" },
      { key: "v", name: "V", sprite: "201-v" },
      { key: "w", name: "W", sprite: "201-w" },
      { key: "x", name: "X", sprite: "201-x" },
      { key: "y", name: "Y", sprite: "201-y" },
      { key: "z", name: "Z", sprite: "201-z" },
      { key: "exclamation", name: "!", sprite: "201-exclamation" },
      { key: "question", name: "?", sprite: "201-question" }
    ]
  },
  412: { // Burmy — rule 6, 3 pure-recolor cloak formes
    recolorOnly: true,
    formes: [
      { key: "plant", name: "Plant Cloak", sprite: "412-plant" },
      { key: "sandy", name: "Sandy Cloak", sprite: "412-sandy" },
      { key: "trash", name: "Trash Cloak", sprite: "412-trash" }
    ]
  },
  421: { // Cherrim — rule 6, 2 pure-recolor formes (Sunshine is battle-only, still no stat/type/ability change)
    recolorOnly: true,
    formes: [
      { key: "overcast", name: "Overcast Form", sprite: "421-overcast" },
      { key: "sunshine", name: "Sunshine Form", sprite: "421-sunshine" }
    ]
  },
  493: { // Arceus — rule 6 per user override 2026-09-04 (Plate formes really do
    // change type in-game, but treated as recolor-only here, same as Unown).
    // formes sorted by pokemon_forms.csv's form_order; default "normal" forme
    // has no hyphenated sprite file on disk, so it reuses the plain "493".
    recolorOnly: true,
    formes: [
      { key: "normal", name: "Normal Type", sprite: "493" },
      { key: "fighting", name: "Fighting Type", sprite: "493-fighting" },
      { key: "flying", name: "Flying Type", sprite: "493-flying" },
      { key: "poison", name: "Poison Type", sprite: "493-poison" },
      { key: "ground", name: "Ground Type", sprite: "493-ground" },
      { key: "rock", name: "Rock Type", sprite: "493-rock" },
      { key: "bug", name: "Bug Type", sprite: "493-bug" },
      { key: "ghost", name: "Ghost Type", sprite: "493-ghost" },
      { key: "steel", name: "Steel Type", sprite: "493-steel" },
      { key: "fire", name: "Fire Type", sprite: "493-fire" },
      { key: "water", name: "Water Type", sprite: "493-water" },
      { key: "grass", name: "Grass Type", sprite: "493-grass" },
      { key: "electric", name: "Electric Type", sprite: "493-electric" },
      { key: "psychic", name: "Psychic Type", sprite: "493-psychic" },
      { key: "ice", name: "Ice Type", sprite: "493-ice" },
      { key: "dragon", name: "Dragon Type", sprite: "493-dragon" },
      { key: "dark", name: "Dark Type", sprite: "493-dark" },
      { key: "fairy", name: "Fairy Type", sprite: "493-fairy" },
      { key: "unknown", name: "??? Type", sprite: "493-unknown" }
    ]
  },
  // --- Hisuian regional forms (Legends: Arceus) ---
  // One "hisui" forme each; every one is differently-typed from its base
  // (so all 16 are tap-to-swap per rule 7), and 12 of the 16 also carry
  // their own base stats. Types/stats are CSV-authoritative (PokeAPI
  // pokemon_types.csv / pokemon_stats.csv, keyed to the FORM's own pokemon
  // id). 10 of the 16 also have a full ability-set delta, recorded in the
  // plural `abilities`/`hiddenAbility` fields (also CSV-authoritative, from
  // pokemon_abilities.csv keyed to the form's own pokemon id, slot order
  // preserved); the other 6 share their base's set exactly and set neither.
  58: { // Growlithe — Hisuian Growlithe, Fire/Rock, own base stats
    formes: [
      { key: "hisui", name: "Hisuian Growlithe", sprite: "hisui/growlithe",
        types: ["Fire", "Rock"],
        stats: { hp: 60, attack: 75, defense: 45, spAttack: 65, spDefense: 50, speed: 55 },
        abilities: ["Intimidate", "Flash Fire", "Rock Head"], hiddenAbility: "Rock Head" }
    ]
  },
  59: { // Arcanine — Hisuian Arcanine, Fire/Rock, own base stats
    formes: [
      { key: "hisui", name: "Hisuian Arcanine", sprite: "hisui/arcanine",
        types: ["Fire", "Rock"],
        stats: { hp: 95, attack: 115, defense: 80, spAttack: 95, spDefense: 80, speed: 90 },
        abilities: ["Intimidate", "Flash Fire", "Rock Head"], hiddenAbility: "Rock Head" }
    ]
  },
  100: { // Voltorb — Hisuian Voltorb, Electric/Grass, stats identical to base
    formes: [
      { key: "hisui", name: "Hisuian Voltorb", sprite: "hisui/voltorb",
        types: ["Electric", "Grass"] }
    ]
  },
  101: { // Electrode — Hisuian Electrode, Electric/Grass, stats identical to base
    formes: [
      { key: "hisui", name: "Hisuian Electrode", sprite: "hisui/electrode",
        types: ["Electric", "Grass"] }
    ]
  },
  157: { // Typhlosion — Hisuian Typhlosion, Fire/Ghost, own base stats
    formes: [
      { key: "hisui", name: "Hisuian Typhlosion", sprite: "hisui/typhlosion",
        types: ["Fire", "Ghost"],
        stats: { hp: 73, attack: 84, defense: 78, spAttack: 119, spDefense: 85, speed: 95 },
        abilities: ["Blaze", "Frisk"], hiddenAbility: "Frisk" }
    ]
  },
  211: { // Qwilfish — Hisuian Qwilfish, Dark/Poison, stats identical to base
    formes: [
      { key: "hisui", name: "Hisuian Qwilfish", sprite: "hisui/qwilfish",
        types: ["Dark", "Poison"] }
    ]
  },
  215: { // Sneasel — Hisuian Sneasel, Fighting/Poison, stats identical to base
    formes: [
      { key: "hisui", name: "Hisuian Sneasel", sprite: "hisui/sneasel",
        types: ["Fighting", "Poison"] }
    ]
  },
  503: { // Samurott — Hisuian Samurott, Water/Dark, own base stats
    formes: [
      { key: "hisui", name: "Hisuian Samurott", sprite: "hisui/samurott",
        types: ["Water", "Dark"],
        stats: { hp: 90, attack: 108, defense: 80, spAttack: 100, spDefense: 65, speed: 85 },
        abilities: ["Torrent", "Sharpness"], hiddenAbility: "Sharpness" }
    ]
  },
  549: { // Lilligant — Hisuian Lilligant, Grass/Fighting, own base stats
    formes: [
      { key: "hisui", name: "Hisuian Lilligant", sprite: "hisui/lilligant",
        types: ["Grass", "Fighting"],
        stats: { hp: 70, attack: 105, defense: 75, spAttack: 50, spDefense: 75, speed: 105 },
        abilities: ["Chlorophyll", "Hustle", "Leaf Guard"], hiddenAbility: "Leaf Guard" }
    ]
  },
  570: { // Zorua — Hisuian Zorua, Normal/Ghost, own base stats
    formes: [
      { key: "hisui", name: "Hisuian Zorua", sprite: "hisui/zorua",
        types: ["Normal", "Ghost"],
        stats: { hp: 35, attack: 60, defense: 40, spAttack: 85, spDefense: 40, speed: 70 } }
    ]
  },
  571: { // Zoroark — Hisuian Zoroark, Normal/Ghost, own base stats
    formes: [
      { key: "hisui", name: "Hisuian Zoroark", sprite: "hisui/zoroark",
        types: ["Normal", "Ghost"],
        stats: { hp: 55, attack: 100, defense: 60, spAttack: 125, spDefense: 60, speed: 110 } }
    ]
  },
  628: { // Braviary — Hisuian Braviary, Psychic/Flying, own base stats
    formes: [
      { key: "hisui", name: "Hisuian Braviary", sprite: "hisui/braviary",
        types: ["Psychic", "Flying"],
        stats: { hp: 110, attack: 83, defense: 70, spAttack: 112, spDefense: 70, speed: 65 },
        abilities: ["Keen Eye", "Sheer Force", "Tinted Lens"], hiddenAbility: "Tinted Lens" }
    ]
  },
  705: { // Sliggoo — Hisuian Sliggoo, Steel/Dragon, own base stats
    formes: [
      { key: "hisui", name: "Hisuian Sliggoo", sprite: "hisui/sliggoo",
        types: ["Steel", "Dragon"],
        stats: { hp: 58, attack: 75, defense: 83, spAttack: 83, spDefense: 113, speed: 40 },
        abilities: ["Sap Sipper", "Shell Armor", "Gooey"], hiddenAbility: "Gooey" }
    ]
  },
  706: { // Goodra — Hisuian Goodra, Steel/Dragon, own base stats
    formes: [
      { key: "hisui", name: "Hisuian Goodra", sprite: "hisui/goodra",
        types: ["Steel", "Dragon"],
        stats: { hp: 80, attack: 100, defense: 100, spAttack: 110, spDefense: 150, speed: 60 },
        abilities: ["Sap Sipper", "Shell Armor", "Gooey"], hiddenAbility: "Gooey" }
    ]
  },
  713: { // Avalugg — Hisuian Avalugg, Ice/Rock, own base stats
    formes: [
      { key: "hisui", name: "Hisuian Avalugg", sprite: "hisui/avalugg",
        types: ["Ice", "Rock"],
        stats: { hp: 95, attack: 127, defense: 184, spAttack: 34, spDefense: 36, speed: 38 },
        abilities: ["Strong Jaw", "Ice Body", "Sturdy"], hiddenAbility: "Sturdy" }
    ]
  },
  724: { // Decidueye — Hisuian Decidueye, Grass/Fighting, own base stats
    formes: [
      { key: "hisui", name: "Hisuian Decidueye", sprite: "hisui/decidueye",
        types: ["Grass", "Fighting"],
        stats: { hp: 88, attack: 112, defense: 80, spAttack: 95, spDefense: 95, speed: 60 },
        abilities: ["Overgrow", "Scrappy"], hiddenAbility: "Scrappy" }
    ]
  },
  // --- Mega Evolutions (0.1.34, TODO.md #5) ---
  // Every Mega forme for a species in POKEMON_DATA, CSV-authoritative
  // (pokemon_forms.csv is_mega=1, joined to pokemon.csv species_id; stats/
  // types/ability keyed to the Mega's own pokemon id). 48 are the X/Y+ORAS
  // Megas; the rest were introduced in Legends: Z-A / its Mega Dimension
  // DLC (version groups 30/31) — official, not fan-made. `types` is set
  // only where the Mega's typing differs from the base. `ability` is the
  // Mega's single ability, appended to the base list tagged "Mega"/"Mega X"
  // etc. (rule 4). Mega Heatran/Darkrai carry no ability row in the CSV.
  3: { // Venusaur — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Venusaur", sprite: "mega/venusaur", isMega: true,
        stats: { hp: 80, attack: 100, defense: 123, spAttack: 122, spDefense: 120, speed: 80 },
        ability: "Thick Fat" }
    ]
  },
  6: { // Charizard — Mega Evolutions (X/Y)
    formes: [
      { key: "mega-x", name: "Mega Charizard X", sprite: "mega/charizard_x", isMega: true,
        types: ["Fire", "Dragon"],
        stats: { hp: 78, attack: 130, defense: 111, spAttack: 130, spDefense: 85, speed: 100 },
        ability: "Tough Claws" },
      { key: "mega-y", name: "Mega Charizard Y", sprite: "mega/charizard_y", isMega: true,
        stats: { hp: 78, attack: 104, defense: 78, spAttack: 159, spDefense: 115, speed: 100 },
        ability: "Drought" }
    ]
  },
  9: { // Blastoise — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Blastoise", sprite: "mega/blastoise", isMega: true,
        stats: { hp: 79, attack: 103, defense: 120, spAttack: 135, spDefense: 115, speed: 78 },
        ability: "Mega Launcher" }
    ]
  },
  15: { // Beedrill — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Beedrill", sprite: "mega/beedrill", isMega: true,
        stats: { hp: 65, attack: 150, defense: 40, spAttack: 15, spDefense: 80, speed: 145 },
        ability: "Adaptability" }
    ]
  },
  18: { // Pidgeot — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Pidgeot", sprite: "mega/pidgeot", isMega: true,
        stats: { hp: 83, attack: 80, defense: 80, spAttack: 135, spDefense: 80, speed: 121 },
        ability: "No Guard" }
    ]
  },
  26: { // Raichu — Mega Evolutions (X/Y)
    formes: [
      { key: "mega-x", name: "Mega Raichu X", sprite: "mega/raichu_x", isMega: true,
        stats: { hp: 60, attack: 135, defense: 95, spAttack: 90, spDefense: 95, speed: 110 },
        ability: "Electric Surge" },
      { key: "mega-y", name: "Mega Raichu Y", sprite: "mega/raichu_y", isMega: true,
        stats: { hp: 60, attack: 100, defense: 55, spAttack: 160, spDefense: 80, speed: 130 },
        ability: "No Guard" }
    ]
  },
  36: { // Clefable — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Clefable", sprite: "mega/clefable", isMega: true,
        types: ["Fairy", "Flying"],
        stats: { hp: 95, attack: 80, defense: 93, spAttack: 135, spDefense: 110, speed: 70 },
        ability: "Magic Bounce" }
    ]
  },
  65: { // Alakazam — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Alakazam", sprite: "mega/alakazam", isMega: true,
        stats: { hp: 55, attack: 50, defense: 65, spAttack: 175, spDefense: 105, speed: 150 },
        ability: "Trace" }
    ]
  },
  71: { // Victreebel — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Victreebel", sprite: "mega/victreebel", isMega: true,
        stats: { hp: 80, attack: 125, defense: 85, spAttack: 135, spDefense: 95, speed: 70 },
        ability: "Innards Out" }
    ]
  },
  80: { // Slowbro — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Slowbro", sprite: "mega/slowbro", isMega: true,
        stats: { hp: 95, attack: 75, defense: 180, spAttack: 130, spDefense: 80, speed: 30 },
        ability: "Shell Armor" }
    ]
  },
  94: { // Gengar — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Gengar", sprite: "mega/gengar", isMega: true,
        stats: { hp: 60, attack: 65, defense: 80, spAttack: 170, spDefense: 95, speed: 130 },
        ability: "Shadow Tag" }
    ]
  },
  115: { // Kangaskhan — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Kangaskhan", sprite: "mega/kangaskhan", isMega: true,
        stats: { hp: 105, attack: 125, defense: 100, spAttack: 60, spDefense: 100, speed: 100 },
        ability: "Parental Bond" }
    ]
  },
  121: { // Starmie — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Starmie", sprite: "mega/starmie", isMega: true,
        stats: { hp: 60, attack: 100, defense: 105, spAttack: 130, spDefense: 105, speed: 120 },
        ability: "Huge Power" }
    ]
  },
  127: { // Pinsir — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Pinsir", sprite: "mega/pinsir", isMega: true,
        types: ["Bug", "Flying"],
        stats: { hp: 65, attack: 155, defense: 120, spAttack: 65, spDefense: 90, speed: 105 },
        ability: "Aerilate" }
    ]
  },
  130: { // Gyarados — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Gyarados", sprite: "mega/gyarados", isMega: true,
        types: ["Water", "Dark"],
        stats: { hp: 95, attack: 155, defense: 109, spAttack: 70, spDefense: 130, speed: 81 },
        ability: "Mold Breaker" }
    ]
  },
  142: { // Aerodactyl — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Aerodactyl", sprite: "mega/aerodactyl", isMega: true,
        stats: { hp: 80, attack: 135, defense: 85, spAttack: 70, spDefense: 95, speed: 150 },
        ability: "Tough Claws" }
    ]
  },
  149: { // Dragonite — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Dragonite", sprite: "mega/dragonite", isMega: true,
        stats: { hp: 91, attack: 124, defense: 115, spAttack: 145, spDefense: 125, speed: 100 },
        ability: "Multiscale" }
    ]
  },
  150: { // Mewtwo — Mega Evolutions (X/Y)
    formes: [
      { key: "mega-x", name: "Mega Mewtwo X", sprite: "mega/mewtwo_x", isMega: true,
        types: ["Psychic", "Fighting"],
        stats: { hp: 106, attack: 190, defense: 100, spAttack: 154, spDefense: 100, speed: 130 },
        ability: "Steadfast" },
      { key: "mega-y", name: "Mega Mewtwo Y", sprite: "mega/mewtwo_y", isMega: true,
        stats: { hp: 106, attack: 150, defense: 70, spAttack: 194, spDefense: 120, speed: 140 },
        ability: "Insomnia" }
    ]
  },
  154: { // Meganium — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Meganium", sprite: "mega/meganium", isMega: true,
        types: ["Grass", "Fairy"],
        stats: { hp: 80, attack: 92, defense: 115, spAttack: 143, spDefense: 115, speed: 80 },
        ability: "Mega Sol" }
    ]
  },
  160: { // Feraligatr — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Feraligatr", sprite: "mega/feraligatr", isMega: true,
        types: ["Water", "Dragon"],
        stats: { hp: 85, attack: 160, defense: 125, spAttack: 89, spDefense: 93, speed: 78 },
        ability: "Dragonize" }
    ]
  },
  181: { // Ampharos — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Ampharos", sprite: "mega/ampharos", isMega: true,
        types: ["Electric", "Dragon"],
        stats: { hp: 90, attack: 95, defense: 105, spAttack: 165, spDefense: 110, speed: 45 },
        ability: "Mold Breaker" }
    ]
  },
  208: { // Steelix — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Steelix", sprite: "mega/steelix", isMega: true,
        stats: { hp: 75, attack: 125, defense: 230, spAttack: 55, spDefense: 95, speed: 30 },
        ability: "Sand Force" }
    ]
  },
  212: { // Scizor — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Scizor", sprite: "mega/scizor", isMega: true,
        stats: { hp: 70, attack: 150, defense: 140, spAttack: 65, spDefense: 100, speed: 75 },
        ability: "Technician" }
    ]
  },
  214: { // Heracross — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Heracross", sprite: "mega/heracross", isMega: true,
        stats: { hp: 80, attack: 185, defense: 115, spAttack: 40, spDefense: 105, speed: 75 },
        ability: "Skill Link" }
    ]
  },
  227: { // Skarmory — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Skarmory", sprite: "mega/skarmory", isMega: true,
        stats: { hp: 65, attack: 140, defense: 110, spAttack: 40, spDefense: 100, speed: 110 },
        ability: "Stalwart" }
    ]
  },
  229: { // Houndoom — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Houndoom", sprite: "mega/houndoom", isMega: true,
        stats: { hp: 75, attack: 90, defense: 90, spAttack: 140, spDefense: 90, speed: 115 },
        ability: "Solar Power" }
    ]
  },
  248: { // Tyranitar — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Tyranitar", sprite: "mega/tyranitar", isMega: true,
        stats: { hp: 100, attack: 164, defense: 150, spAttack: 95, spDefense: 120, speed: 71 },
        ability: "Sand Stream" }
    ]
  },
  254: { // Sceptile — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Sceptile", sprite: "mega/sceptile", isMega: true,
        types: ["Grass", "Dragon"],
        stats: { hp: 70, attack: 110, defense: 75, spAttack: 145, spDefense: 85, speed: 145 },
        ability: "Lightning Rod" }
    ]
  },
  257: { // Blaziken — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Blaziken", sprite: "mega/blaziken", isMega: true,
        stats: { hp: 80, attack: 160, defense: 80, spAttack: 130, spDefense: 80, speed: 100 },
        ability: "Speed Boost" }
    ]
  },
  260: { // Swampert — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Swampert", sprite: "mega/swampert", isMega: true,
        stats: { hp: 100, attack: 150, defense: 110, spAttack: 95, spDefense: 110, speed: 70 },
        ability: "Swift Swim" }
    ]
  },
  282: { // Gardevoir — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Gardevoir", sprite: "mega/gardevoir", isMega: true,
        stats: { hp: 68, attack: 85, defense: 65, spAttack: 165, spDefense: 135, speed: 100 },
        ability: "Pixilate" }
    ]
  },
  302: { // Sableye — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Sableye", sprite: "mega/sableye", isMega: true,
        stats: { hp: 50, attack: 85, defense: 125, spAttack: 85, spDefense: 115, speed: 20 },
        ability: "Magic Bounce" }
    ]
  },
  303: { // Mawile — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Mawile", sprite: "mega/mawile", isMega: true,
        stats: { hp: 50, attack: 105, defense: 125, spAttack: 55, spDefense: 95, speed: 50 },
        ability: "Huge Power" }
    ]
  },
  306: { // Aggron — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Aggron", sprite: "mega/aggron", isMega: true,
        types: ["Steel"],
        stats: { hp: 70, attack: 140, defense: 230, spAttack: 60, spDefense: 80, speed: 50 },
        ability: "Filter" }
    ]
  },
  308: { // Medicham — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Medicham", sprite: "mega/medicham", isMega: true,
        stats: { hp: 60, attack: 100, defense: 85, spAttack: 80, spDefense: 85, speed: 100 },
        ability: "Pure Power" }
    ]
  },
  310: { // Manectric — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Manectric", sprite: "mega/manectric", isMega: true,
        stats: { hp: 70, attack: 75, defense: 80, spAttack: 135, spDefense: 80, speed: 135 },
        ability: "Intimidate" }
    ]
  },
  319: { // Sharpedo — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Sharpedo", sprite: "mega/sharpedo", isMega: true,
        stats: { hp: 70, attack: 140, defense: 70, spAttack: 110, spDefense: 65, speed: 105 },
        ability: "Strong Jaw" }
    ]
  },
  323: { // Camerupt — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Camerupt", sprite: "mega/camerupt", isMega: true,
        stats: { hp: 70, attack: 120, defense: 100, spAttack: 145, spDefense: 105, speed: 20 },
        ability: "Sheer Force" }
    ]
  },
  334: { // Altaria — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Altaria", sprite: "mega/altaria", isMega: true,
        types: ["Dragon", "Fairy"],
        stats: { hp: 75, attack: 110, defense: 110, spAttack: 110, spDefense: 105, speed: 80 },
        ability: "Pixilate" }
    ]
  },
  354: { // Banette — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Banette", sprite: "mega/banette", isMega: true,
        stats: { hp: 64, attack: 165, defense: 75, spAttack: 93, spDefense: 83, speed: 75 },
        ability: "Prankster" }
    ]
  },
  358: { // Chimecho — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Chimecho", sprite: "mega/chimecho", isMega: true,
        types: ["Psychic", "Steel"],
        stats: { hp: 75, attack: 50, defense: 110, spAttack: 135, spDefense: 120, speed: 65 },
        ability: "Levitate" }
    ]
  },
  359: { // Absol — Mega Evolutions (X/Y)
    formes: [
      { key: "mega", name: "Mega Absol", sprite: "mega/absol", isMega: true,
        stats: { hp: 65, attack: 150, defense: 60, spAttack: 115, spDefense: 60, speed: 115 },
        ability: "Magic Bounce" },
      { key: "mega-z", name: "Mega Absol Z", sprite: "mega/absol_z", isMega: true,
        types: ["Dark", "Ghost"],
        stats: { hp: 65, attack: 154, defense: 60, spAttack: 75, spDefense: 60, speed: 151 },
        ability: "Sharpness" }
    ]
  },
  362: { // Glalie — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Glalie", sprite: "mega/glalie", isMega: true,
        stats: { hp: 80, attack: 120, defense: 80, spAttack: 120, spDefense: 80, speed: 100 },
        ability: "Refrigerate" }
    ]
  },
  373: { // Salamence — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Salamence", sprite: "mega/salamence", isMega: true,
        stats: { hp: 95, attack: 145, defense: 130, spAttack: 120, spDefense: 90, speed: 120 },
        ability: "Aerilate" }
    ]
  },
  376: { // Metagross — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Metagross", sprite: "mega/metagross", isMega: true,
        stats: { hp: 80, attack: 145, defense: 150, spAttack: 105, spDefense: 110, speed: 110 },
        ability: "Tough Claws" }
    ]
  },
  380: { // Latias — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Latias", sprite: "mega/latias", isMega: true,
        stats: { hp: 80, attack: 100, defense: 120, spAttack: 140, spDefense: 150, speed: 110 },
        ability: "Levitate" }
    ]
  },
  381: { // Latios — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Latios", sprite: "mega/latios", isMega: true,
        stats: { hp: 80, attack: 130, defense: 100, spAttack: 160, spDefense: 120, speed: 110 },
        ability: "Levitate" }
    ]
  },
  384: { // Rayquaza — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Rayquaza", sprite: "mega/rayquaza", isMega: true,
        stats: { hp: 105, attack: 180, defense: 100, spAttack: 180, spDefense: 100, speed: 115 },
        ability: "Delta Stream" }
    ]
  },
  398: { // Staraptor — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Staraptor", sprite: "mega/staraptor", isMega: true,
        types: ["Fighting", "Flying"],
        stats: { hp: 85, attack: 140, defense: 100, spAttack: 60, spDefense: 90, speed: 110 },
        ability: "Contrary" }
    ]
  },
  428: { // Lopunny — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Lopunny", sprite: "mega/lopunny", isMega: true,
        types: ["Normal", "Fighting"],
        stats: { hp: 65, attack: 136, defense: 94, spAttack: 54, spDefense: 96, speed: 135 },
        ability: "Scrappy" }
    ]
  },
  445: { // Garchomp — Mega Evolutions (X/Y)
    formes: [
      { key: "mega", name: "Mega Garchomp", sprite: "mega/garchomp", isMega: true,
        stats: { hp: 108, attack: 170, defense: 115, spAttack: 120, spDefense: 95, speed: 92 },
        ability: "Sand Force" },
      { key: "mega-z", name: "Mega Garchomp Z", sprite: "mega/garchomp_z", isMega: true,
        types: ["Dragon"],
        stats: { hp: 108, attack: 130, defense: 85, spAttack: 141, spDefense: 85, speed: 151 },
        ability: "Levitate" }
    ]
  },
  448: { // Lucario — Mega Evolutions (X/Y)
    formes: [
      { key: "mega", name: "Mega Lucario", sprite: "mega/lucario", isMega: true,
        stats: { hp: 70, attack: 145, defense: 88, spAttack: 140, spDefense: 70, speed: 112 },
        ability: "Adaptability" },
      { key: "mega-z", name: "Mega Lucario Z", sprite: "mega/lucario_z", isMega: true,
        stats: { hp: 70, attack: 100, defense: 70, spAttack: 164, spDefense: 70, speed: 151 },
        ability: "Aura Guard" }
    ]
  },
  460: { // Abomasnow — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Abomasnow", sprite: "mega/abomasnow", isMega: true,
        stats: { hp: 90, attack: 132, defense: 105, spAttack: 132, spDefense: 105, speed: 30 },
        ability: "Snow Warning" }
    ]
  },
  475: { // Gallade — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Gallade", sprite: "mega/gallade", isMega: true,
        stats: { hp: 68, attack: 165, defense: 95, spAttack: 65, spDefense: 115, speed: 110 },
        ability: "Inner Focus" }
    ]
  },
  478: { // Froslass — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Froslass", sprite: "mega/froslass", isMega: true,
        stats: { hp: 70, attack: 80, defense: 70, spAttack: 140, spDefense: 100, speed: 120 },
        ability: "Snow Warning" }
    ]
  },
  485: { // Heatran — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Heatran", sprite: "mega/heatran", isMega: true,
        stats: { hp: 91, attack: 120, defense: 106, spAttack: 175, spDefense: 141, speed: 67 } } // CSV carries no ability row for this Mega yet
    ]
  },
  491: { // Darkrai — Mega Evolution
    formes: [
      { key: "mega", name: "Mega Darkrai", sprite: "mega/darkrai", isMega: true,
        stats: { hp: 70, attack: 120, defense: 130, spAttack: 165, spDefense: 130, speed: 85 } } // CSV carries no ability row for this Mega yet
    ]
  }
};
