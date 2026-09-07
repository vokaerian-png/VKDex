// Item catalogue, keyed by PokeAPI item slug (the same slug evolutions.js's
// `item` fields and the sprite filenames under data/sprites/items/{slug}.png
// use). Written by tools/populate_from_csv.js --tables items.
//
// SCOPE: sprite-covered items only — every items.csv row with a flat
// data/sprites/items/{slug}.png, plus every machine (TM/TR/HM) item, whose
// icon app.js resolves from the taught move's type instead (data/machines.js).
// Not the full 2,573-row items.csv. The exception: 13 evolution-only items
// that were already here before the catalogue existed and have no bundled
// art (Black Augurite, Sweet Apple, Metal Alloy, ...). They carry
// `noArt: true` — kept because the Evolution Line's arrow icon and the Held
// Items chip look them up, skipped by the Bag grid.
//
//   "safety-goggles": {
//     name, description,                    // 0.2.7 fields, unchanged
//     category: "Held items",               // item_categories.csv name_en
//     pocket: "misc",                       // item_pockets.csv identifier
//     gens: [6, 7, 8, 9],                   // generations the item exists in
//     fling: { power: 80, effect: "..." },  // omitted when fling_power is 0
//     prices: [ { vg: [...], games, buy, sell, cur } ],   // omitted when none
//     where:  [ { vg, games, lines: [ { type, place, detail, games } ] } ],
//   }
//
// prices: one entry per distinct (buy, sell, currency) tuple across the
// version groups sharing it; `buy` is null when the item can't be bought
// there. buy and sell are read INDEPENDENTLY from item_prices.csv — mainline
// games sell at ~50% of buy but Legends: Arceus / Z-A / Scarlet-Violet use
// ~25%, so neither is ever derived from the other.
// gens: sorted generation numbers from item_game_indices.csv (the item had a
// real in-game index there). The Bag screen's game selector filters the grid
// by it — generation grain, so Red/Blue and Yellow behave identically.
// Machines are filtered by machines.js's exact per-version-group rows
// instead; an entry with no `gens` at all shows only under "Game: All".
// where: one entry per version GROUP; identical rows across that group's
// versions collapse into one `lines` entry, and a line only carries its own
// `games` when it does NOT apply to every version of the group.
//
// Every description is a hand-authored paraphrase, never items.csv's own
// text: the 146 pre-catalogue entries' (0.2.7) are carried over verbatim
// from this file on every rewrite; every other entry's comes from
// tools/item_descriptions.js (machines share one sentence per kind).
//
// Consumers (app.js): the Bag screen's grid + item detail screen, the Facts
// card's "Held Items" chips, and the Evolution Line's arrow item icons.

var ITEMS_DATA = {
  "master-ball": {
    name: "Master Ball",
    description: "Never fails: any wild Pokémon it hits is caught.",
    category: "Standard balls", pocket: "pokeballs",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue", "yellow", "gold-silver", "crystal"], games: "Red/Blue, Yellow, Gold/Silver, Crystal", buy: null, sell: 0, cur: "poke-dollar" },
    ],
  },
  "ultra-ball": {
    name: "Ultra Ball",
    description: "Catches wild Pokémon twice as reliably as a plain Poké Ball.",
    category: "Standard balls", pocket: "pokeballs",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue", "yellow", "gold-silver", "crystal", "ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Red/Blue, Yellow, Gold/Silver, Crystal, Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: 1200, sell: 600, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: 800, sell: 400, cur: "poke-dollar" },
      { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", buy: 500, sell: 250, cur: "poke-dollar" },
      { vg: ["legends-arceus", "legends-za"], games: "Legends: Arceus, Legends: Z-A", buy: 600, sell: 150, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 800, sell: 200, cur: "poke-dollar" },
    ],
  },
  "great-ball": {
    name: "Great Ball",
    description: "A step up from the plain Poké Ball, with a 1.5x catch rate.",
    category: "Standard balls", pocket: "pokeballs",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue", "yellow", "gold-silver", "crystal", "ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "sword-shield", "brilliant-diamond-shining-pearl"], games: "Red/Blue, Yellow, Gold/Silver, Crystal, Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield, Brilliant Diamond/Shining Pearl", buy: 600, sell: 300, cur: "poke-dollar" },
      { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", buy: 300, sell: 150, cur: "poke-dollar" },
      { vg: ["legends-arceus", "legends-za"], games: "Legends: Arceus, Legends: Z-A", buy: 300, sell: 75, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 600, sell: 150, cur: "poke-dollar" },
    ],
  },
  "poke-ball": {
    name: "Poké Ball",
    description: "The everyday ball for catching wild Pokémon.",
    category: "Standard balls", pocket: "pokeballs",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: 200, sell: 100, cur: "poke-dollar" },
      { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", buy: 100, sell: 50, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 200, sell: 50, cur: "poke-dollar" },
    ],
  },
  "safari-ball": {
    name: "Safari Ball",
    description: "The ball handed out for Safari Zone outings; works like a Great Ball there.",
    category: "Standard balls", pocket: "pokeballs",
    gens: [1, 3, 4, 5, 6, 7, 8, 9],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Story", place: "Safari Zone (Kanto)", detail: "Safari Game entry · Participating in a Safari Game · Unused balls are returned after the game.", games: "Red" },
      ] },
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Story", place: "Great Marsh", detail: "Safari Game entry · Participating in a Safari Game", games: "Diamond" },
      ] },
    ],
  },
  "net-ball": {
    name: "Net Ball",
    description: "Far more likely to catch a Water- or Bug-type Pokémon; ordinary otherwise.",
    category: "Special balls", pocket: "pokeballs",
    gens: [3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "sword-shield", "brilliant-diamond-shining-pearl"], games: "Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield, Brilliant Diamond/Shining Pearl", buy: 1000, sell: 500, cur: "poke-dollar" },
      { vg: ["scarlet-violet", "legends-za"], games: "Scarlet/Violet, Legends: Z-A", buy: 1000, sell: 250, cur: "poke-dollar" },
    ],
  },
  "dive-ball": {
    name: "Dive Ball",
    description: "Far more likely to catch Pokémon met underwater, or on the water's surface.",
    category: "Special balls", pocket: "pokeballs",
    gens: [3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["ruby-sapphire", "emerald", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Ruby/Sapphire, Emerald, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: 1000, sell: 500, cur: "poke-dollar" },
      { vg: ["firered-leafgreen", "diamond-pearl", "platinum", "brilliant-diamond-shining-pearl"], games: "FireRed/LeafGreen, Diamond/Pearl, Platinum, Brilliant Diamond/Shining Pearl", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["scarlet-violet", "legends-za"], games: "Scarlet/Violet, Legends: Z-A", buy: 1000, sell: 250, cur: "poke-dollar" },
    ],
  },
  "nest-ball": {
    name: "Nest Ball",
    description: "Works better the lower the wild Pokémon's level; no better than a Poké Ball from level 30 up.",
    category: "Special balls", pocket: "pokeballs",
    gens: [3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "sword-shield", "brilliant-diamond-shining-pearl"], games: "Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield, Brilliant Diamond/Shining Pearl", buy: 1000, sell: 500, cur: "poke-dollar" },
      { vg: ["scarlet-violet", "legends-za"], games: "Scarlet/Violet, Legends: Z-A", buy: 1000, sell: 250, cur: "poke-dollar" },
    ],
  },
  "repeat-ball": {
    name: "Repeat Ball",
    description: "Far more likely to catch a species you've already caught before.",
    category: "Special balls", pocket: "pokeballs",
    gens: [3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "sword-shield", "brilliant-diamond-shining-pearl"], games: "Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield, Brilliant Diamond/Shining Pearl", buy: 1000, sell: 500, cur: "poke-dollar" },
      { vg: ["scarlet-violet", "legends-za"], games: "Scarlet/Violet, Legends: Z-A", buy: 1000, sell: 250, cur: "poke-dollar" },
    ],
  },
  "timer-ball": {
    name: "Timer Ball",
    description: "Gets better the longer the battle drags on, peaking after ten turns.",
    category: "Special balls", pocket: "pokeballs",
    gens: [3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "sword-shield", "brilliant-diamond-shining-pearl"], games: "Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield, Brilliant Diamond/Shining Pearl", buy: 1000, sell: 500, cur: "poke-dollar" },
      { vg: ["scarlet-violet", "legends-za"], games: "Scarlet/Violet, Legends: Z-A", buy: 1000, sell: 250, cur: "poke-dollar" },
    ],
  },
  "luxury-ball": {
    name: "Luxury Ball",
    description: "Catches like a Poké Ball, but the Pokémon inside grows friendly twice as fast.",
    category: "Special balls", pocket: "pokeballs",
    gens: [3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", buy: 1000, sell: 500, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: 1500, cur: "poke-dollar" },
      { vg: ["scarlet-violet", "legends-za"], games: "Scarlet/Violet, Legends: Z-A", buy: 3000, sell: 750, cur: "poke-dollar" },
    ],
  },
  "premier-ball": {
    name: "Premier Ball",
    description: "A commemorative white ball given free with a bulk Poké Ball purchase; catches like a Poké Ball.",
    category: "Special balls", pocket: "pokeballs",
    gens: [3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["black-2-white-2"], games: "Black 2/White 2", buy: 500, sell: null, cur: "poke-dollar" },
      { vg: ["x-y"], games: "X/Y", buy: 200, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", buy: null, sell: 50, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 5, cur: "poke-dollar" },
      { vg: ["legends-za"], games: "Legends: Z-A", buy: 200, sell: 50, cur: "poke-dollar" },
    ],
  },
  "dusk-ball": {
    name: "Dusk Ball",
    description: "Far more likely to catch Pokémon at night or inside caves.",
    category: "Special balls", pocket: "pokeballs",
    gens: [4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "sword-shield", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield, Brilliant Diamond/Shining Pearl", buy: 1000, sell: 500, cur: "poke-dollar" },
      { vg: ["scarlet-violet", "legends-za"], games: "Scarlet/Violet, Legends: Z-A", buy: 1000, sell: 250, cur: "poke-dollar" },
    ],
  },
  "heal-ball": {
    name: "Heal Ball",
    description: "Catches like a Poké Ball, and fully heals the Pokémon the moment it's caught.",
    category: "Special balls", pocket: "pokeballs",
    gens: [4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "sword-shield", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield, Brilliant Diamond/Shining Pearl", buy: 300, sell: 150, cur: "poke-dollar" },
      { vg: ["scarlet-violet", "legends-za"], games: "Scarlet/Violet, Legends: Z-A", buy: 300, sell: 75, cur: "poke-dollar" },
    ],
  },
  "quick-ball": {
    name: "Quick Ball",
    description: "Very likely to catch on the first turn of a battle; a plain Poké Ball afterward.",
    category: "Special balls", pocket: "pokeballs",
    gens: [4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "sword-shield", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield, Brilliant Diamond/Shining Pearl", buy: 1000, sell: 500, cur: "poke-dollar" },
      { vg: ["scarlet-violet", "legends-za"], games: "Scarlet/Violet, Legends: Z-A", buy: 1000, sell: 250, cur: "poke-dollar" },
    ],
  },
  "cherish-ball": {
    name: "Cherish Ball",
    description: "The ball event-distributed Pokémon arrive in; not sold anywhere.",
    category: "Special balls", pocket: "pokeballs",
    gens: [4, 5, 6, 7, 8, 9],
  },
  "potion": {
    name: "Potion",
    description: "A spray-type medicine that restores 20 HP to one Pokémon.",
    category: "Healing", pocket: "medicine",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: 300, sell: 150, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: 200, sell: 100, cur: "poke-dollar" },
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: 200, sell: 50, cur: "poke-dollar" },
      { vg: ["legends-za"], games: "Legends: Z-A", buy: 150, sell: 37, cur: "poke-dollar" },
    ],
  },
  "antidote": {
    name: "Antidote",
    description: "Cures a poisoned Pokémon.",
    category: "Status cures", pocket: "medicine",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: 100, sell: 50, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "lets-go-pikachu-lets-go-eevee", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Let’s Go, Pikachu!/Let’s Go, Eevee!, Sword/Shield", buy: 200, sell: 100, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 200, sell: 50, cur: "poke-dollar" },
      { vg: ["legends-za"], games: "Legends: Z-A", buy: 100, sell: 25, cur: "poke-dollar" },
    ],
  },
  "burn-heal": {
    name: "Burn Heal",
    description: "Cures a burned Pokémon.",
    category: "Status cures", pocket: "medicine",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: 250, sell: 125, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: 300, sell: 150, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 200, sell: 100, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 200, sell: 50, cur: "poke-dollar" },
      { vg: ["legends-za"], games: "Legends: Z-A", buy: 100, sell: 25, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Shop", place: "Viridian, Pewter, Cerulean, Lavender Poké Marts; Celadon Department Store", detail: "₱250", games: "Red" },
      ] },
    ],
  },
  "ice-heal": {
    name: "Ice Heal",
    description: "Thaws out a frozen Pokémon.",
    category: "Status cures", pocket: "medicine",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: 250, sell: 125, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: 100, sell: 50, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 200, sell: 100, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 200, sell: 50, cur: "poke-dollar" },
      { vg: ["legends-za"], games: "Legends: Z-A", buy: 100, sell: 25, cur: "poke-dollar" },
    ],
  },
  "awakening": {
    name: "Awakening",
    description: "Wakes a sleeping Pokémon.",
    category: "Status cures", pocket: "medicine",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: 200, sell: 100, cur: "poke-dollar" },
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: 250, sell: 125, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: 100, sell: 50, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 200, sell: 50, cur: "poke-dollar" },
      { vg: ["legends-za"], games: "Legends: Z-A", buy: 100, sell: 25, cur: "poke-dollar" },
    ],
  },
  "paralyze-heal": {
    name: "Paralyze Heal",
    description: "Cures a paralyzed Pokémon.",
    category: "Status cures", pocket: "medicine",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: 200, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: 300, sell: 150, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 200, sell: 50, cur: "poke-dollar" },
      { vg: ["legends-za"], games: "Legends: Z-A", buy: 100, sell: 25, cur: "poke-dollar" },
    ],
  },
  "full-restore": {
    name: "Full Restore",
    description: "Fully restores one Pokémon's HP and cures any status condition, confusion included.",
    category: "Healing", pocket: "medicine",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: 3000, sell: 1500, cur: "poke-dollar" },
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: 2500, sell: 625, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 3000, sell: 750, cur: "poke-dollar" },
      { vg: ["legends-za"], games: "Legends: Z-A", buy: 1500, sell: 375, cur: "poke-dollar" },
    ],
  },
  "max-potion": {
    name: "Max Potion",
    description: "Fully restores one Pokémon's HP.",
    category: "Healing", pocket: "medicine",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: 2500, sell: 1250, cur: "poke-dollar" },
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: 2000, sell: 500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 2500, sell: 625, cur: "poke-dollar" },
      { vg: ["legends-za"], games: "Legends: Z-A", buy: 1200, sell: 300, cur: "poke-dollar" },
    ],
  },
  "hyper-potion": {
    name: "Hyper Potion",
    description: "Restores 120 HP to one Pokémon (200 in games before Gen VII).",
    category: "Healing", pocket: "medicine",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: 1500, sell: 750, cur: "poke-dollar" },
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: 1200, sell: 600, cur: "poke-dollar" },
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: 800, sell: 200, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 1500, sell: 375, cur: "poke-dollar" },
    ],
  },
  "super-potion": {
    name: "Super Potion",
    description: "Restores 60 HP to one Pokémon (50 in games before Gen VII).",
    category: "Healing", pocket: "medicine",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue"], games: "Red/Blue", buy: 700, sell: 350, cur: "poke-dollar" },
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: 400, sell: 100, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 700, sell: 175, cur: "poke-dollar" },
    ],
  },
  "full-heal": {
    name: "Full Heal",
    description: "Cures any status condition and confusion on one Pokémon.",
    category: "Status cures", pocket: "medicine",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: 600, sell: 300, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: 400, sell: 200, cur: "poke-dollar" },
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: 600, sell: 150, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 400, sell: 100, cur: "poke-dollar" },
      { vg: ["legends-za"], games: "Legends: Z-A", buy: 200, sell: 50, cur: "poke-dollar" },
    ],
  },
  "revive": {
    name: "Revive",
    description: "Revives a fainted Pokémon with half of its HP restored.",
    category: "Revival", pocket: "medicine",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: 1500, sell: 750, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: 2000, sell: 1000, cur: "poke-dollar" },
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: 700, sell: 175, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 2000, sell: 500, cur: "poke-dollar" },
      { vg: ["legends-za"], games: "Legends: Z-A", buy: 800, sell: 200, cur: "poke-dollar" },
    ],
  },
  "max-revive": {
    name: "Max Revive",
    description: "Revives a fainted Pokémon with all of its HP restored.",
    category: "Revival", pocket: "medicine",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["black-2-white-2"], games: "Black 2/White 2", buy: 5000, sell: 2000, cur: "poke-dollar" },
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: 3000, sell: 750, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 1000, cur: "poke-dollar" },
      { vg: ["legends-za"], games: "Legends: Z-A", buy: null, sell: 500, cur: "poke-dollar" },
    ],
  },
  "fresh-water": {
    name: "Fresh Water",
    description: "Mineral water that restores 30 HP (50 before Gen VII); cheaper than a Potion from a vending machine.",
    category: "Healing", pocket: "medicine",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: 200, sell: 100, cur: "poke-dollar" },
      { vg: ["x-y"], games: "X/Y", buy: 300, sell: null, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 200, sell: null, cur: "poke-dollar" },
    ],
  },
  "soda-pop": {
    name: "Soda Pop",
    description: "A fizzy drink that restores 50 HP (60 before Gen VII).",
    category: "Healing", pocket: "medicine",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: 300, sell: 150, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 300, sell: 75, cur: "poke-dollar" },
    ],
  },
  "lemonade": {
    name: "Lemonade",
    description: "A sweet drink that restores 70 HP (80 before Gen VII).",
    category: "Healing", pocket: "medicine",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: 350, sell: 175, cur: "poke-dollar" },
      { vg: ["sun-moon"], games: "Sun/Moon", buy: 350, sell: 200, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 350, sell: 100, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Vending Machine", place: "Celadon City", detail: "Celadon Department Store · ₱350", games: "Red" },
      ] },
    ],
  },
  "moomoo-milk": {
    name: "Moomoo Milk",
    description: "Rich milk that restores 100 HP when drunk.",
    category: "Healing", pocket: "medicine",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: 500, sell: 250, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 600, sell: 300, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 600, sell: 150, cur: "poke-dollar" },
    ],
  },
  "energy-powder": {
    name: "Energy Powder",
    description: "Bitter herbal medicine that restores 60 HP (50 before Gen VII) but lowers the Pokémon's friendship.",
    category: "Healing", pocket: "medicine",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: 500, sell: 250, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 500, sell: 125, cur: "poke-dollar" },
    ],
  },
  "energy-root": {
    name: "Energy Root",
    description: "A bitter root that restores 120 HP (200 before Gen VII) but lowers the Pokémon's friendship.",
    category: "Healing", pocket: "medicine",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: 800, sell: 400, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: 1200, sell: 600, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 1200, sell: 300, cur: "poke-dollar" },
    ],
  },
  "heal-powder": {
    name: "Heal Powder",
    description: "Bitter herbal medicine that cures any status condition and confusion, at the cost of friendship.",
    category: "Status cures", pocket: "medicine",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: 450, sell: 225, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: 300, sell: 150, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 300, sell: 75, cur: "poke-dollar" },
    ],
  },
  "revival-herb": {
    name: "Revival Herb",
    description: "A bitter herb that revives a fainted Pokémon with full HP, at the cost of friendship.",
    category: "Revival", pocket: "medicine",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: 2800, sell: 1400, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 2800, sell: 700, cur: "poke-dollar" },
    ],
  },
  "ether": {
    name: "Ether",
    description: "Restores 10 PP to one of a Pokémon's moves.",
    category: "PP recovery", pocket: "medicine",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: null, sell: 0, cur: "poke-dollar" },
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: null, sell: 600, cur: "poke-dollar" },
      { vg: ["black-2-white-2"], games: "Black 2/White 2", buy: 1500, sell: null, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 300, cur: "poke-dollar" },
    ],
  },
  "max-ether": {
    name: "Max Ether",
    description: "Fully restores the PP of one of a Pokémon's moves.",
    category: "PP recovery", pocket: "medicine",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: null, sell: 0, cur: "poke-dollar" },
      { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "lets-go-pikachu-lets-go-eevee", "sword-shield", "brilliant-diamond-shining-pearl"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Let’s Go, Pikachu!/Let’s Go, Eevee!, Sword/Shield, Brilliant Diamond/Shining Pearl", buy: null, sell: 1000, cur: "poke-dollar" },
      { vg: ["legends-arceus", "scarlet-violet"], games: "Legends: Arceus, Scarlet/Violet", buy: null, sell: 500, cur: "poke-dollar" },
    ],
  },
  "elixir": {
    name: "Elixir",
    description: "Restores 10 PP to every one of a Pokémon's moves.",
    category: "PP recovery", pocket: "medicine",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue"], games: "Red/Blue", buy: null, sell: 0, cur: "poke-dollar" },
      { vg: ["gold-silver", "ruby-sapphire", "diamond-pearl", "black-white", "x-y", "sun-moon", "sword-shield"], games: "Gold/Silver, Ruby/Sapphire, Diamond/Pearl, Black/White, X/Y, Sun/Moon, Sword/Shield", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 750, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Overworld", place: "Route 25, Pokémon Tower, Silph Co., Underground Path (Routes 7–8)", games: "Red" },
      ] },
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "Overworld", place: "Routes 2, 12, 44, 45; Mt. Mortar; Dark Cave; Rock Tunnel; Union Cave; Lake of Rage (event)", games: "Gold" },
      ] },
    ],
  },
  "max-elixir": {
    name: "Max Elixir",
    description: "Fully restores the PP of all of a Pokémon's moves.",
    category: "PP recovery", pocket: "medicine",
    gens: [1, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: null, sell: 0, cur: "poke-dollar" },
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: null, sell: 2250, cur: "poke-dollar" },
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: null, sell: 1250, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 1125, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Overworld", place: "Route 17, Power Plant, Seafoam Islands, Cerulean Cave", games: "Red" },
      ] },
    ],
  },
  "lava-cookie": {
    name: "Lava Cookie",
    description: "Lavaridge Town's specialty; cures any status condition and confusion.",
    category: "Status cures", pocket: "medicine",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["ruby-sapphire", "emerald", "firered-leafgreen", "platinum", "omega-ruby-alpha-sapphire"], games: "Ruby/Sapphire, Emerald, FireRed/LeafGreen, Platinum, Omega Ruby/Alpha Sapphire", buy: 200, sell: 100, cur: "poke-dollar" },
      { vg: ["black-2-white-2"], games: "Black 2/White 2", buy: 1000, sell: 100, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 350, sell: 175, cur: "poke-dollar" },
    ],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Overworld", place: "Mt. Chimney", games: "Ruby" },
      ] },
      { vg: "firered-leafgreen", games: "FireRed/LeafGreen", lines: [
        { type: "Overworld", place: "S.S. Anne", detail: "Harbor", games: "FireRed" },
      ] },
    ],
  },
  "berry-juice": {
    name: "Berry Juice",
    description: "Restores 20 HP when the holder's HP drops low.",
    category: "Healing", pocket: "medicine",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: null, sell: 50, cur: "poke-dollar" },
      { vg: ["black-white"], games: "Black/White", buy: 1500, sell: null, cur: "poke-dollar" },
    ],
  },
  "sacred-ash": {
    name: "Sacred Ash",
    description: "Revives every fainted Pokémon in the party with full HP.",
    category: "Revival", pocket: "medicine",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 25000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "Wild Pokémon", place: "Held by Ho-Oh", games: "Gold" },
      ] },
    ],
  },
  "hp-up": {
    name: "HP Up",
    description: "Adds 10 HP effort points to a Pokémon.",
    category: "Vitamins", pocket: "medicine",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue"], games: "Red/Blue", buy: 9800, sell: 4900, cur: "poke-dollar" },
      { vg: ["sun-moon"], games: "Sun/Moon", buy: 10000, sell: 5000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 10000, sell: 2500, cur: "poke-dollar" },
      { vg: ["legends-za"], games: "Legends: Z-A", buy: 5000, sell: 1250, cur: "poke-dollar" },
    ],
  },
  "protein": {
    name: "Protein",
    description: "Adds 10 Attack effort points to a Pokémon.",
    category: "Vitamins", pocket: "medicine",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: 9800, sell: 4900, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: 10000, sell: 5000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 10000, sell: 2500, cur: "poke-dollar" },
    ],
  },
  "iron": {
    name: "Iron",
    description: "Adds 10 Defense effort points to a Pokémon.",
    category: "Vitamins", pocket: "medicine",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue"], games: "Red/Blue", buy: 9800, sell: 4900, cur: "poke-dollar" },
      { vg: ["sun-moon"], games: "Sun/Moon", buy: 10000, sell: 5000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 10000, sell: 2500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Shop", place: "Celadon City", detail: "Celadon Department Store · ₱9800", games: "Red" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Shop", place: "After earning 3 Gym Badges", detail: "₱10000", games: "Scarlet" },
      ] },
    ],
  },
  "carbos": {
    name: "Carbos",
    description: "Adds 10 Speed effort points to a Pokémon.",
    category: "Vitamins", pocket: "medicine",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: 9800, sell: 4900, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: 10000, sell: 5000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 10000, sell: 2500, cur: "poke-dollar" },
    ],
  },
  "calcium": {
    name: "Calcium",
    description: "Adds 10 Sp. Atk effort points to a Pokémon.",
    category: "Vitamins", pocket: "medicine",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: 9800, sell: 4900, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: 10000, sell: 5000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 10000, sell: 2500, cur: "poke-dollar" },
    ],
  },
  "rare-candy": {
    name: "Rare Candy",
    description: "Raises a Pokémon's level by one, and revives it if it has fainted.",
    category: "Vitamins", pocket: "medicine",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: null, sell: 2400, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 5000, cur: "poke-dollar" },
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: null, sell: 2500, cur: "poke-dollar" },
    ],
  },
  "pp-up": {
    name: "PP Up",
    description: "Raises one move's maximum PP by a fifth of its base; works up to three times per move.",
    category: "Vitamins", pocket: "medicine",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: null, sell: 0, cur: "poke-dollar" },
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: null, sell: 4900, cur: "poke-dollar" },
      { vg: ["black-2-white-2"], games: "Black 2/White 2", buy: 12500, sell: 4900, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 5000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 10000, sell: 2500, cur: "poke-dollar" },
    ],
  },
  "zinc": {
    name: "Zinc",
    description: "Adds 10 Sp. Def effort points to a Pokémon.",
    category: "Vitamins", pocket: "medicine",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: 9800, sell: 4900, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: 10000, sell: 5000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 10000, sell: 2500, cur: "poke-dollar" },
    ],
  },
  "pp-max": {
    name: "PP Max",
    description: "Raises one move's maximum PP all the way to its cap in a single use.",
    category: "Vitamins", pocket: "medicine",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 4900, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 5000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 2500, cur: "poke-dollar" },
    ],
  },
  "old-gateau": {
    name: "Old Gateau",
    description: "The Old Chateau's specialty; cures any status condition and confusion.",
    category: "Status cures", pocket: "medicine",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["diamond-pearl", "heartgold-soulsilver"], games: "Diamond/Pearl, HeartGold/SoulSilver", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["black-white"], games: "Black/White", buy: 1000, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "sword-shield"], games: "Sun/Moon, Sword/Shield", buy: null, sell: 175, cur: "poke-dollar" },
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: null, sell: 125, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Old Chateau", games: "Diamond" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Overworld", place: "Old Chateau" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Overworld", place: "Dragonspiral Tower" },
      ] },
    ],
  },
  "guard-spec": {
    name: "Guard Spec.",
    description: "Shields your side from stat drops for five turns, like the move Mist.",
    category: "Stat boosts", pocket: "battle",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: 700, sell: 350, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: 1500, sell: 750, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 1500, sell: 375, cur: "poke-dollar" },
    ],
  },
  "dire-hit": {
    name: "Dire Hit",
    description: "Raises the user's critical-hit ratio for the rest of the battle.",
    category: "Stat boosts", pocket: "battle",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: 650, sell: 325, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: 1000, sell: 500, cur: "poke-dollar" },
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: null, sell: 400, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 1000, sell: 250, cur: "poke-dollar" },
    ],
  },
  "x-attack": {
    name: "X Attack",
    description: "Raises the user's Attack one stage for the rest of the battle (two stages from Gen VII on).",
    category: "Stat boosts", pocket: "battle",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: 500, sell: 250, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: 1000, sell: 500, cur: "poke-dollar" },
      { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", buy: 550, sell: 275, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 1000, sell: 250, cur: "poke-dollar" },
    ],
  },
  "x-defense": {
    name: "X Defense",
    description: "Raises the user's Defense one stage for the rest of the battle (two stages from Gen VII on).",
    category: "Stat boosts", pocket: "battle",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: 550, sell: 275, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: 2000, sell: 1000, cur: "poke-dollar" },
      { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", buy: 500, sell: 250, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 2000, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Shop", place: "Celadon City", detail: "Celadon Department Store · ₱550", games: "Red" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Shop", place: "Chansey Supply", detail: "₱2000", games: "Scarlet" },
      ] },
    ],
  },
  "x-speed": {
    name: "X Speed",
    description: "Raises the user's Speed one stage for the rest of the battle (two stages from Gen VII on).",
    category: "Stat boosts", pocket: "battle",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: 350, sell: 175, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: 1000, sell: 500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 1000, sell: 250, cur: "poke-dollar" },
    ],
  },
  "x-accuracy": {
    name: "X Accuracy",
    description: "Raises the user's accuracy one stage for the rest of the battle (two stages from Gen VII on).",
    category: "Stat boosts", pocket: "battle",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: 950, sell: 475, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: 1000, sell: 500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 1000, sell: 250, cur: "poke-dollar" },
    ],
  },
  "x-sp-atk": {
    name: "X Sp. Atk",
    description: "Raises the user's Sp. Atk one stage for the rest of the battle (two stages from Gen VII on).",
    category: "Stat boosts", pocket: "battle",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: 350, sell: 175, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: 1000, sell: 500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 1000, sell: 250, cur: "poke-dollar" },
    ],
  },
  "x-sp-def": {
    name: "X Sp. Def",
    description: "Raises the user's Sp. Def one stage for the rest of the battle (two stages from Gen VII on).",
    category: "Stat boosts", pocket: "battle",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["diamond-pearl"], games: "Diamond/Pearl", buy: 350, sell: 175, cur: "poke-dollar" },
      { vg: ["sun-moon"], games: "Sun/Moon", buy: 2000, sell: 1000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 2000, sell: 500, cur: "poke-dollar" },
    ],
  },
  "poke-doll": {
    name: "Poké Doll",
    description: "Throw it and a wild Pokémon is distracted; you flee the battle every time.",
    category: "Spelunking", pocket: "misc",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue", "yellow", "gold-silver", "crystal"], games: "Red/Blue, Yellow, Gold/Silver, Crystal", buy: 1000, sell: 500, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 300, sell: 150, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 300, sell: 75, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Shop", place: "Celadon City", detail: "Celadon Department Store · ₱1000", games: "Red" },
      ] },
    ],
  },
  "fluffy-tail": {
    name: "Fluffy Tail",
    description: "Wave it and a wild Pokémon is distracted; you flee the battle every time.",
    category: "Spelunking", pocket: "misc",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["ruby-sapphire", "emerald", "omega-ruby-alpha-sapphire"], games: "Ruby/Sapphire, Emerald, Omega Ruby/Alpha Sapphire", buy: 1000, sell: 500, cur: "poke-dollar" },
      { vg: ["black-white"], games: "Black/White", buy: 15000, sell: 500, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 50, cur: "poke-dollar" },
    ],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Shop", place: "Verdanturf Town", detail: "Poké Mart · ₱1000", games: "Ruby" },
      ] },
    ],
  },
  "blue-flute": {
    name: "Blue Flute",
    description: "A glass flute whose tone wakes a sleeping Pokémon; never wears out.",
    category: "Flutes", pocket: "battle",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2"], games: "Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2", buy: null, sell: 50, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 10, cur: "poke-dollar" },
    ],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Overworld", place: "Hoenn Route 113", detail: "Glass Workshop (250 steps)", games: "Ruby" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Overworld", place: "Viridian Forest", games: "HeartGold" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Overworld", place: "Unova Route 13", detail: "Treasure Hunter", games: "Black" },
      ] },
    ],
  },
  "yellow-flute": {
    name: "Yellow Flute",
    description: "A glass flute whose tone snaps a Pokémon out of confusion; never wears out.",
    category: "Flutes", pocket: "battle",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["ruby-sapphire", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire"], games: "Ruby/Sapphire, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 150, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 10, cur: "poke-dollar" },
    ],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Crafting", place: "Hoenn Route 113", detail: "Glass Workshop · After accumulating 500 steps", games: "Ruby" },
      ] },
      { vg: "firered-leafgreen", games: "FireRed/LeafGreen", lines: [
        { type: "Exchange", place: "Celadon Game Corner", detail: "1600 C", games: "FireRed" },
      ] },
    ],
  },
  "red-flute": {
    name: "Red Flute",
    description: "A glass flute whose tone cures infatuation; never wears out.",
    category: "Flutes", pocket: "battle",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire"], games: "Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 10, cur: "poke-dollar" },
    ],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Walking Pokémon", place: "Hoenn Route 113", detail: "Glass Workshop · 500 steps" },
      ] },
      { vg: "emerald", games: "Emerald", lines: [
        { type: "Walking Pokémon", place: "Hoenn Route 113", detail: "Glass Workshop · 500 steps" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Overworld", place: "Lake of Rage" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "NPC Gift", place: "Unova Route 13", detail: "Treasure Hunter" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Walking Pokémon", place: "Hoenn Route 113", detail: "Glass Workshop · 500 grams" },
      ] },
    ],
  },
  "black-flute": {
    name: "Black Flute",
    description: "A glass flute whose tone keeps wild Pokémon away, thinning encounters for a while.",
    category: "Spelunking", pocket: "misc",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["ruby-sapphire", "diamond-pearl", "black-white", "x-y"], games: "Ruby/Sapphire, Diamond/Pearl, Black/White, X/Y", buy: null, sell: 200, cur: "poke-dollar" },
      { vg: ["sun-moon"], games: "Sun/Moon", buy: null, sell: 10, cur: "poke-dollar" },
    ],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Walking Pokémon", place: "Hoenn Route 113", detail: "Glass Workshop (1000 steps)", games: "Ruby" },
      ] },
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Mount Coronet", detail: "Platinum only", games: "Diamond" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Overworld", place: "Dark Cave", games: "HeartGold" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "NPC Gift", place: "Unova Route 13", detail: "Treasure hunter", games: "Black" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Exchange", place: "Hoenn Route 113", detail: "Glass Workshop (1000 grams) · ₱1000", games: "Omega Ruby" },
      ] },
    ],
  },
  "white-flute": {
    name: "White Flute",
    description: "A glass flute whose tone draws wild Pokémon in, making encounters more frequent for a while.",
    category: "Spelunking", pocket: "misc",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire"], games: "Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 250, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 10, cur: "poke-dollar" },
    ],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Overworld", place: "Hoenn Route 113", detail: "Glass Workshop (1000 steps)", games: "Ruby" },
      ] },
      { vg: "emerald", games: "Emerald", lines: [
        { type: "Overworld", place: "Hoenn Route 113", detail: "Glass Workshop (1000 steps)" },
      ] },
    ],
  },
  "shoal-salt": {
    name: "Shoal Salt",
    description: "Salt that piles up in Shoal Cave at low tide; four of it plus four Shoal Shells make a Shell Bell.",
    category: "Collectibles", pocket: "misc",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["black-white", "black-2-white-2"], games: "Black/White, Black 2/White 2", buy: null, sell: 7000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Overworld", place: "Shoal Cave", detail: "Low tide", games: "Ruby" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Shoal Cave", detail: "Low tide", games: "Omega Ruby" },
      ] },
    ],
  },
  "shoal-shell": {
    name: "Shoal Shell",
    description: "A shell that washes into Shoal Cave at high tide; four of it plus four Shoal Salts make a Shell Bell.",
    category: "Collectibles", pocket: "misc",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["black-white", "black-2-white-2"], games: "Black/White, Black 2/White 2", buy: null, sell: 7000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Overworld", place: "Shoal Cave", detail: "High tide" },
      ] },
      { vg: "emerald", games: "Emerald", lines: [
        { type: "Overworld", place: "Shoal Cave", detail: "High tide" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "NPC Gift", place: "Unova Route 13", detail: "Treasure hunter" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Overworld", place: "Unova Route 17", detail: "Reappears occasionally" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Shoal Cave", detail: "High tide" },
      ] },
    ],
  },
  "red-shard": {
    name: "Red Shard",
    description: "A small red shard of an ancient tool, tradeable for goods in some places.",
    category: "Collectibles", pocket: "misc",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["black-white"], games: "Black/White", buy: 3000, sell: null, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: null, sell: 150, cur: "poke-dollar" },
    ],
  },
  "blue-shard": {
    name: "Blue Shard",
    description: "A small blue shard of an ancient tool, tradeable for goods in some places.",
    category: "Collectibles", pocket: "misc",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue"], games: "Red/Blue", buy: 3000, sell: null, cur: "poke-dollar" },
      { vg: ["ruby-sapphire", "emerald", "diamond-pearl", "platinum", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Ruby/Sapphire, Emerald, Diamond/Pearl, Platinum, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: null, sell: 150, cur: "poke-dollar" },
    ],
  },
  "yellow-shard": {
    name: "Yellow Shard",
    description: "A small yellow shard of an ancient tool, tradeable for goods in some places.",
    category: "Collectibles", pocket: "misc",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["ruby-sapphire", "emerald", "diamond-pearl", "platinum", "heartgold-soulsilver", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Ruby/Sapphire, Emerald, Diamond/Pearl, Platinum, HeartGold/SoulSilver, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["black-white"], games: "Black/White", buy: 3000, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 500, cur: "poke-dollar" },
    ],
  },
  "green-shard": {
    name: "Green Shard",
    description: "A small green shard of an ancient tool, tradeable for goods in some places.",
    category: "Collectibles", pocket: "misc",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["black-white"], games: "Black/White", buy: 3000, sell: null, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: null, sell: 150, cur: "poke-dollar" },
    ],
  },
  "super-repel": {
    name: "Super Repel",
    description: "Keeps wild Pokémon weaker than your lead away for 200 steps.",
    category: "Spelunking", pocket: "misc",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: 500, sell: 250, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: 700, sell: 350, cur: "poke-dollar" },
    ],
  },
  "max-repel": {
    name: "Max Repel",
    description: "Keeps wild Pokémon weaker than your lead away for 250 steps.",
    category: "Spelunking", pocket: "misc",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: 700, sell: 350, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: 900, sell: 450, cur: "poke-dollar" },
    ],
  },
  "escape-rope": {
    name: "Escape Rope",
    description: "Whisks you straight out of a cave or dungeon to its entrance.",
    category: "Spelunking", pocket: "misc",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue", "gold-silver"], games: "Red/Blue, Gold/Silver", buy: 550, sell: 275, cur: "poke-dollar" },
      { vg: ["sun-moon"], games: "Sun/Moon", buy: 1000, sell: 500, cur: "poke-dollar" },
      { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", buy: 300, sell: 150, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Shop", place: "Various Poké Marts", detail: "₱550", games: "Red" },
      ] },
    ],
  },
  "repel": {
    name: "Repel",
    description: "Keeps wild Pokémon weaker than your lead away for 100 steps.",
    category: "Spelunking", pocket: "misc",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: 350, sell: 175, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: 400, sell: 200, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Shop", place: "Cerulean City", detail: "Cerulean Poké Mart · ₱350", games: "Red" },
      ] },
    ],
  },
  "sun-stone": {
    name: "Sun Stone",
    description: "An evolution stone as red as the sun; evolves Pokémon like Gloom and Sunkern.",
    category: "Evolution", pocket: "misc",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue"], games: "Red/Blue", buy: 10000, sell: null, cur: "poke-dollar" },
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: null, sell: 1050, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: null, sell: 750, cur: "poke-dollar" },
      { vg: ["legends-za"], games: "Legends: Z-A", buy: 3000, sell: null, cur: "poke-dollar" },
    ],
  },
  "moon-stone": {
    name: "Moon Stone",
    description: "An evolution stone as black as the night sky; evolves certain Pokémon like Clefairy and Nidorino.",
    category: "Evolution", pocket: "misc",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue", "gold-silver"], games: "Red/Blue, Gold/Silver", buy: null, sell: 0, cur: "poke-dollar" },
      { vg: ["diamond-pearl"], games: "Diamond/Pearl", buy: null, sell: 1050, cur: "poke-dollar" },
      { vg: ["sun-moon"], games: "Sun/Moon", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 750, cur: "poke-dollar" },
    ],
  },
  "fire-stone": {
    name: "Fire Stone",
    description: "An evolution stone burning with an inner flame; evolves certain Fire-type Pokémon.",
    category: "Evolution", pocket: "misc",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue", "yellow", "x-y"], games: "Red/Blue, Yellow, X/Y", buy: 2100, sell: 1050, cur: "poke-dollar" },
      { vg: ["sun-moon"], games: "Sun/Moon", buy: 3000, sell: 1500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 3000, sell: 750, cur: "poke-dollar" },
    ],
  },
  "thunder-stone": {
    name: "Thunder Stone",
    description: "An evolution stone crackling with electricity; evolves certain Electric-type Pokémon.",
    category: "Evolution", pocket: "misc",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: 2100, sell: 1050, cur: "poke-dollar" },
      { vg: ["black-2-white-2"], games: "Black 2/White 2", buy: 10000, sell: 1050, cur: "poke-dollar" },
      { vg: ["sun-moon"], games: "Sun/Moon", buy: 3000, sell: 1500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 3000, sell: 750, cur: "poke-dollar" },
    ],
  },
  "water-stone": {
    name: "Water Stone",
    description: "An evolution stone the clear blue of deep water; evolves certain Water-type Pokémon.",
    category: "Evolution", pocket: "misc",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: 2100, sell: 1050, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: 3000, sell: 1500, cur: "poke-dollar" },
    ],
  },
  "leaf-stone": {
    name: "Leaf Stone",
    description: "An evolution stone marked with a leaf pattern; evolves certain Grass-type Pokémon.",
    category: "Evolution", pocket: "misc",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: 2100, sell: 1050, cur: "poke-dollar" },
      { vg: ["sun-moon"], games: "Sun/Moon", buy: 3000, sell: 1500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 3000, sell: 750, cur: "poke-dollar" },
    ],
  },
  "tiny-mushroom": {
    name: "Tiny Mushroom",
    description: "A small mushroom worth only a little when sold.",
    category: "Loot", pocket: "misc",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["gold-silver", "heartgold-soulsilver"], games: "Gold/Silver, HeartGold/SoulSilver", buy: 500, sell: 250, cur: "poke-dollar" },
      { vg: ["ruby-sapphire", "diamond-pearl", "black-white"], games: "Ruby/Sapphire, Diamond/Pearl, Black/White", buy: null, sell: 250, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
    ],
  },
  "big-mushroom": {
    name: "Big Mushroom",
    description: "A large mushroom with no use in battle, but worth a decent sum to a buyer.",
    category: "Loot", pocket: "misc",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2", buy: null, sell: 2500, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 10000, cur: "poke-dollar" },
    ],
  },
  "pearl": {
    name: "Pearl",
    description: "A small, pretty pearl that can be sold for a modest sum.",
    category: "Loot", pocket: "misc",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["gold-silver"], games: "Gold/Silver", buy: 650, sell: 700, cur: "poke-dollar" },
      { vg: ["sun-moon", "sword-shield"], games: "Sun/Moon, Sword/Shield", buy: null, sell: 1000, cur: "poke-dollar" },
    ],
  },
  "big-pearl": {
    name: "Big Pearl",
    description: "A large, lustrous pearl that fetches a good price.",
    category: "Loot", pocket: "misc",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: 3500, sell: 3750, cur: "poke-dollar" },
      { vg: ["ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 3750, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "lets-go-pikachu-lets-go-eevee", "scarlet-violet", "legends-za"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Let’s Go, Pikachu!/Let’s Go, Eevee!, Scarlet/Violet, Legends: Z-A", buy: null, sell: 4000, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 8000, sell: 4000, cur: "poke-dollar" },
    ],
  },
  "stardust": {
    name: "Stardust",
    description: "Glittering red sand that can be sold for a modest sum.",
    category: "Loot", pocket: "misc",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: 900, sell: 1000, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 1500, cur: "poke-dollar" },
    ],
  },
  "star-piece": {
    name: "Star Piece",
    description: "A shard of a red gem that sells for a very high price.",
    category: "Loot", pocket: "misc",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["gold-silver"], games: "Gold/Silver", buy: 4600, sell: 4900, cur: "poke-dollar" },
      { vg: ["sun-moon", "sword-shield"], games: "Sun/Moon, Sword/Shield", buy: null, sell: 6000, cur: "poke-dollar" },
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
  },
  "nugget": {
    name: "Nugget",
    description: "A lump of pure gold with no use but selling for a high price.",
    category: "Loot", pocket: "misc",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: null, sell: 5000, cur: "poke-dollar" },
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: 4500, sell: 5000, cur: "poke-dollar" },
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: null, sell: 10000, cur: "poke-dollar" },
    ],
  },
  "heart-scale": {
    name: "Heart Scale",
    description: "A pretty heart-shaped scale that a Move Reminder will take in exchange for teaching a forgotten move.",
    category: "Collectibles", pocket: "misc",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["ruby-sapphire", "emerald", "diamond-pearl", "platinum", "x-y", "lets-go-pikachu-lets-go-eevee"], games: "Ruby/Sapphire, Emerald, Diamond/Pearl, Platinum, X/Y, Let’s Go, Pikachu!/Let’s Go, Eevee!", buy: null, sell: 50, cur: "poke-dollar" },
      { vg: ["black-white"], games: "Black/White", buy: 10000, sell: null, cur: "poke-dollar" },
    ],
  },
  "honey": {
    name: "Honey",
    description: "Sweet honey; slathered on a tree or used in the field, it draws wild Pokémon in.",
    category: "Dex completion", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["diamond-pearl", "platinum"], games: "Diamond/Pearl, Platinum", buy: 100, sell: 50, cur: "poke-dollar" },
      { vg: ["black-2-white-2"], games: "Black 2/White 2", buy: 3600, sell: 50, cur: "poke-dollar" },
      { vg: ["sun-moon"], games: "Sun/Moon", buy: 300, sell: 150, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 450, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 225, cur: "poke-dollar" },
    ],
  },
  "growth-mulch": {
    name: "Growth Mulch",
    description: "Berry plants grow faster in it, but the soil dries out faster too.",
    category: "Mulch", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: 200, sell: 100, cur: "poke-dollar" },
      { vg: ["black-white", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Black/White, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["black-2-white-2"], games: "Black 2/White 2", buy: 400, sell: 100, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Route 208 (Sinnoh)", detail: "Berry Master's house" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Overworld", place: "Route 208 (Sinnoh)", detail: "Berry Master's house" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Shop", place: "Goldenrod City", detail: "Goldenrod Flower Shop · After acquiring the Berry Pots" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Exchange", place: "Trade" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Overworld", place: "Hidden Grottoes, Join Avenue Flower Shop" },
      ] },
    ],
  },
  "damp-mulch": {
    name: "Damp Mulch",
    description: "Soil stays moist longer in it, though Berry plants grow slower.",
    category: "Mulch", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: 200, sell: 100, cur: "poke-dollar" },
      { vg: ["black-white", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Black/White, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["black-2-white-2"], games: "Black 2/White 2", buy: 400, sell: 100, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Route 208 (Sinnoh)", detail: "Berry Master's house" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Overworld", place: "Route 208 (Sinnoh)", detail: "Berry Master's house" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Shop", place: "Goldenrod City", detail: "Goldenrod Flower Shop · After acquiring the Berry Pots" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Exchange", place: "Trade" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Overworld", place: "Hidden Grottoes, Join Avenue (Flower Shop)" },
      ] },
    ],
  },
  "stable-mulch": {
    name: "Stable Mulch",
    description: "Ripe Berries hang on the plant longer before dropping.",
    category: "Mulch", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: 200, sell: 100, cur: "poke-dollar" },
      { vg: ["black-2-white-2"], games: "Black 2/White 2", buy: 400, sell: 100, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Route 208 (Sinnoh)", detail: "Berry Master's house" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Overworld", place: "Route 208 (Sinnoh)", detail: "Berry Master's house" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Shop", place: "Goldenrod City", detail: "Goldenrod Flower Shop · After acquiring the Berry Pots" },
      ] },
    ],
  },
  "gooey-mulch": {
    name: "Gooey Mulch",
    description: "A withered Berry plant regrows more times before giving out.",
    category: "Mulch", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: 200, sell: 100, cur: "poke-dollar" },
      { vg: ["black-2-white-2"], games: "Black 2/White 2", buy: 400, sell: 100, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "NPC Gift", place: "Route 208 (Sinnoh)", detail: "Berry Master's house" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "NPC Gift", place: "Route 208 (Sinnoh)", detail: "Berry Master's house" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Shop", place: "Goldenrod City", detail: "Goldenrod Flower Shop · ₱200 · After acquiring the Berry Pots" },
      ] },
    ],
  },
  "root-fossil": {
    name: "Root Fossil",
    description: "A fossil of a sea-floor Pokémon; revived, it becomes Lileep.",
    category: "Dex completion", pocket: "misc",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 100 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["sun-moon"], games: "Sun/Moon", buy: null, sell: 3500, cur: "poke-dollar" },
      { vg: ["ultra-sun-ultra-moon"], games: "Ultra Sun/Ultra Moon", buy: 7000, sell: 3500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Overworld", place: "Hoenn Route 111", detail: "Choice between Root Fossil and Claw Fossil", games: "Ruby" },
      ] },
      { vg: "emerald", games: "Emerald", lines: [
        { type: "Overworld", place: "Mirage Tower", detail: "Choice between Root Fossil and Claw Fossil" },
      ] },
    ],
  },
  "claw-fossil": {
    name: "Claw Fossil",
    description: "A fossil of a prehistoric sea Pokémon; revived, it becomes Anorith.",
    category: "Dex completion", pocket: "misc",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 100 },
    prices: [
      { vg: ["diamond-pearl", "platinum"], games: "Diamond/Pearl, Platinum", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["sun-moon"], games: "Sun/Moon", buy: null, sell: 3500, cur: "poke-dollar" },
      { vg: ["ultra-sun-ultra-moon"], games: "Ultra Sun/Ultra Moon", buy: 7000, sell: 3500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Choice", place: "Hoenn Route 111", detail: "Choice between Claw Fossil and Root Fossil", games: "Ruby" },
      ] },
      { vg: "emerald", games: "Emerald", lines: [
        { type: "Overworld", place: "Mirage Tower", detail: "Choice between Claw Fossil and Root Fossil" },
      ] },
    ],
  },
  "helix-fossil": {
    name: "Helix Fossil",
    description: "A spiral shell fossil from an ancient sea; revived, it becomes Omanyte.",
    category: "Dex completion", pocket: "misc",
    gens: [1, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 100 },
    prices: [
      { vg: ["diamond-pearl"], games: "Diamond/Pearl", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["sun-moon"], games: "Sun/Moon", buy: null, sell: 3500, cur: "poke-dollar" },
      { vg: ["ultra-sun-ultra-moon"], games: "Ultra Sun/Ultra Moon", buy: 7000, sell: null, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Choice", place: "Mt. Moon", detail: "Choice between Helix Fossil and Dome Fossil", games: "Red" },
      ] },
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Mining", place: "Underground", detail: "After obtaining the National Pokédex", games: "Diamond" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Shop", place: "Konikoni City", detail: "Olivia's jewelry shop", games: "Ultra Sun" },
      ] },
    ],
  },
  "dome-fossil": {
    name: "Dome Fossil",
    description: "A domed shell fossil from an ancient sea; revived, it becomes Kabuto.",
    category: "Dex completion", pocket: "misc",
    gens: [1, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 100 },
    prices: [
      { vg: ["diamond-pearl"], games: "Diamond/Pearl", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["sun-moon"], games: "Sun/Moon", buy: null, sell: 3500, cur: "poke-dollar" },
      { vg: ["ultra-sun-ultra-moon"], games: "Ultra Sun/Ultra Moon", buy: 7000, sell: null, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Choice", place: "Mt. Moon", detail: "Choice between Dome Fossil and Helix Fossil", games: "Red" },
      ] },
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Mining", place: "Underground", detail: "After obtaining the National Pokédex", games: "Diamond" },
      ] },
    ],
  },
  "old-amber": {
    name: "Old Amber",
    description: "Amber holding a prehistoric Pokémon's genes; revived, it becomes Aerodactyl.",
    category: "Dex completion", pocket: "misc",
    gens: [1, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 100 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "lets-go-pikachu-lets-go-eevee", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Let’s Go, Pikachu!/Let’s Go, Eevee!, Brilliant Diamond/Shining Pearl", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["legends-za"], games: "Legends: Z-A", buy: 30000, sell: 15000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "NPC Gift", place: "Pewter City", detail: "Pewter Museum of Science" },
      ] },
    ],
  },
  "armor-fossil": {
    name: "Armor Fossil",
    description: "A fossil of a prehistoric land Pokémon; revived, it becomes Shieldon.",
    category: "Dex completion", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 100 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["sun-moon"], games: "Sun/Moon", buy: 7000, sell: 3500, cur: "poke-dollar" },
      { vg: ["ultra-sun-ultra-moon"], games: "Ultra Sun/Ultra Moon", buy: null, sell: 3500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Mining", place: "Underground", games: "Diamond" },
      ] },
    ],
  },
  "skull-fossil": {
    name: "Skull Fossil",
    description: "A fossil of a prehistoric land Pokémon; revived, it becomes Cranidos.",
    category: "Dex completion", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 100 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: 7000, sell: 3500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Mining", place: "Underground", detail: "Underground", games: "Diamond" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Mining", place: "Underground", detail: "Underground (odd Trainer ID) · If the last digit of the Trainer ID is odd" },
      ] },
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Field Move", place: "Glittering Cave", detail: "After entering the Hall of Fame", games: "X" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Konikoni City", detail: "Olivia's jewelry shop", games: "Ultra Sun" },
      ] },
    ],
  },
  "rare-bone": {
    name: "Rare Bone",
    description: "A bone of great archaeological value that sells for a high price.",
    category: "Loot", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 100 },
    prices: [
      { vg: ["diamond-pearl", "platinum"], games: "Diamond/Pearl, Platinum", buy: null, sell: 5000, cur: "poke-dollar" },
      { vg: ["black-white"], games: "Black/White", buy: 30000, sell: 5000, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 2500, cur: "poke-dollar" },
    ],
  },
  "shiny-stone": {
    name: "Shiny Stone",
    description: "An evolution stone that gleams brightly; evolves Pokémon like Togetic and Roselia.",
    category: "Evolution", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["diamond-pearl", "platinum"], games: "Diamond/Pearl, Platinum", buy: null, sell: 1050, cur: "poke-dollar" },
      { vg: ["black-white"], games: "Black/White", buy: 10000, sell: null, cur: "poke-dollar" },
      { vg: ["black-2-white-2"], games: "Black 2/White 2", buy: 4000, sell: null, cur: "poke-dollar" },
    ],
  },
  "dusk-stone": {
    name: "Dusk Stone",
    description: "An evolution stone as dark as night; evolves certain Ghost- and Dark-leaning Pokémon.",
    category: "Evolution", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: null, sell: 1050, cur: "poke-dollar" },
      { vg: ["black-white"], games: "Black/White", buy: 10000, sell: null, cur: "poke-dollar" },
      { vg: ["black-2-white-2"], games: "Black 2/White 2", buy: 40000, sell: null, cur: "poke-dollar" },
    ],
  },
  "dawn-stone": {
    name: "Dawn Stone",
    description: "An evolution stone that glows like a sunrise; evolves certain Pokémon of a specific gender.",
    category: "Evolution", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["black-white"], games: "Black/White", buy: 10000, sell: 1050, cur: "poke-dollar" },
    ],
  },
  "oval-stone": {
    name: "Oval Stone",
    description: "A smooth round stone; Happiny evolves into Chansey when it levels up holding one during the day.",
    category: "Evolution", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["diamond-pearl", "heartgold-soulsilver"], games: "Diamond/Pearl, HeartGold/SoulSilver", buy: null, sell: 1050, cur: "poke-dollar" },
      { vg: ["black-white"], games: "Black/White", buy: 10000, sell: 1050, cur: "poke-dollar" },
      { vg: ["black-2-white-2"], games: "Black 2/White 2", buy: 6000, sell: 1050, cur: "poke-dollar" },
      { vg: ["sun-moon", "sword-shield"], games: "Sun/Moon, Sword/Shield", buy: null, sell: 1000, cur: "poke-dollar" },
      { vg: ["legends-arceus", "scarlet-violet"], games: "Legends: Arceus, Scarlet/Violet", buy: null, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Lost Tower", games: "Diamond" },
      ] },
    ],
  },
  "odd-keystone": {
    name: "Odd Keystone",
    description: "A stone that houses Spiritomb; set it in the Hallowed Tower and greet 32 people underground to draw it out.",
    category: "Dex completion", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, Brilliant Diamond/Shining Pearl", buy: null, sell: 1050, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 525, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Twinleaf Town", games: "Diamond" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Overworld", place: "Route 208 (Sinnoh)" },
      ] },
      { vg: "legends-arceus", games: "Legends: Arceus", lines: [
        { type: "NPC Gift", place: "Jubilife Village", detail: "Vessa · After completing Mission 7: The Frenzy of the Lord of the Woods" },
      ] },
    ],
  },
  "adamant-orb": {
    name: "Adamant Orb",
    description: "Held by Dialga, strengthens its Dragon- and Steel-type moves.",
    category: "Species-specific", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 60 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sword-shield", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sword/Shield, Brilliant Diamond/Shining Pearl", buy: null, sell: 5000, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: 10000, sell: null, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Spear Pillar", games: "Diamond" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Overworld", place: "Mount Coronet" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Wild Pokémon", place: "Sinjoh Ruins", detail: "Held by Dialga", games: "HeartGold" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "NPC Gift", place: "Marvelous Bridge", detail: "Given by the Shadow Triad", games: "Black" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Overworld", place: "Dragonspiral Tower", games: "Black 2" },
      ] },
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Overworld", place: "Terminus Cave", games: "X" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Hoenn Route 128", detail: "Underwater", games: "Omega Ruby" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Shop", place: "Hau'oli City", detail: "Antiquities of the Ages, Hau'oli City Mall", games: "Sun" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Bargain Shop", place: "Stow-on-Side", detail: "Bargain shop keeper · If the player owns a Dialga", games: "Sword" },
      ] },
      { vg: "brilliant-diamond-shining-pearl", games: "Brilliant Diamond/Shining Pearl", lines: [
        { type: "Overworld", place: "Spear Pillar", games: "Brilliant Diamond" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Auction", place: "Porto Marinada", detail: "Auction · If the player owns a Dialga", games: "Scarlet" },
      ] },
    ],
  },
  "lustrous-orb": {
    name: "Lustrous Orb",
    description: "Held by Palkia, strengthens its Dragon- and Water-type moves.",
    category: "Species-specific", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 60 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sword-shield", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sword/Shield, Brilliant Diamond/Shining Pearl", buy: null, sell: 5000, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: 10000, sell: null, cur: "poke-dollar" },
    ],
    where: [
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Overworld", place: "Mount Coronet" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Wild Pokémon", place: "Sinjoh Ruins", detail: "Held by Palkia", games: "HeartGold" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "NPC Gift", place: "Marvelous Bridge", detail: "Shadow Triad", games: "Black" },
      ] },
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Overworld", place: "Terminus Cave", games: "X" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Hoenn Route 129", detail: "Underwater", games: "Omega Ruby" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Shop", place: "Hau'oli City", detail: "Antiquities of the Ages · ₱10000", games: "Sun" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Bargain Shop", place: "Stow-on-Side", detail: "Bargain Shop Keeper · If the player owns a Palkia", games: "Sword" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Auction", place: "Porto Marinada", detail: "Auction · If the player owns a Palkia", games: "Scarlet" },
      ] },
    ],
  },
  "grass-mail": {
    name: "Grass Mail",
    description: "Stationery printed with a green meadow; a Pokémon carries the message written on it.",
    category: "All mail", pocket: "mail",
    gens: [4],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: 50, sell: 25, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Shop", place: "Veilstone City", detail: "Veilstone Department Store · ₱50" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Shop", place: "Veilstone City", detail: "Veilstone Department Store · ₱50" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Wild Pokémon", place: "Route 35 (Johto)", detail: "Held by Webster's Spearow" },
        { type: "Shop", place: "Goldenrod City", detail: "Goldenrod Department Store · ₱50" },
      ] },
    ],
  },
  "flame-mail": {
    name: "Flame Mail",
    description: "Stationery printed with red flames; a Pokémon carries the message written on it.",
    category: "All mail", pocket: "mail",
    gens: [4],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: 50, sell: 25, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Shop", place: "Veilstone City", detail: "Veilstone Department Store · ₱50" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Shop", place: "Veilstone City", detail: "Veilstone Department Store · ₱50" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Shop", place: "Goldenrod City", detail: "Goldenrod Department Store · ₱50" },
        { type: "Shop", place: "Celadon City", detail: "Celadon Department Store · ₱50" },
      ] },
    ],
  },
  "bubble-mail": {
    name: "Bubble Mail",
    description: "Stationery printed with a blue undersea scene; a Pokémon carries the message written on it.",
    category: "All mail", pocket: "mail",
    gens: [4],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: 50, sell: 25, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Shop", place: "Veilstone City", detail: "Veilstone Department Store · ₱50" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Shop", place: "Veilstone City", detail: "Veilstone Department Store · ₱50" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Shop", place: "Goldenrod City", detail: "Goldenrod Department Store · ₱50" },
        { type: "Shop", place: "Celadon City", detail: "Celadon Department Store · ₱50" },
      ] },
    ],
  },
  "bloom-mail": {
    name: "Bloom Mail",
    description: "Stationery printed with a floral pattern; a Pokémon carries the message written on it.",
    category: "All mail", pocket: "mail",
    gens: [4],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: 50, sell: 25, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Shop", place: "Floaroma Town", detail: "Floaroma Town Poké Mart · ₱50" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Shop", place: "Floaroma Town", detail: "Floaroma Town Poké Mart · ₱50" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Shop", place: "Celadon City", detail: "Celadon Department Store · ₱50" },
        { type: "Shop", place: "Azalea Town", detail: "Azalea Town Poké Mart · ₱50" },
      ] },
    ],
  },
  "tunnel-mail": {
    name: "Tunnel Mail",
    description: "Stationery printed with a dim coal mine; a Pokémon carries the message written on it.",
    category: "All mail", pocket: "mail",
    gens: [4],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: 50, sell: 25, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Shop", place: "Oreburgh City", detail: "Oreburgh City Poké Mart · ₱50" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Shop", place: "Oreburgh City", detail: "Oreburgh City Poké Mart · ₱50" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Shop", place: "Violet City", detail: "Violet City Poké Mart · ₱50" },
        { type: "Shop", place: "Celadon City", detail: "Celadon Department Store · ₱50" },
      ] },
    ],
  },
  "steel-mail": {
    name: "Steel Mail",
    description: "Stationery printed with mechanical designs; a Pokémon carries the message written on it.",
    category: "All mail", pocket: "mail",
    gens: [4],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: 50, sell: 25, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Shop", place: "Sunyshore City", detail: "Poké Mart · ₱50" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Shop", place: "Sunyshore City", detail: "Poké Mart · ₱50" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Shop", place: "Fuchsia City", detail: "Poké Mart · ₱50" },
      ] },
    ],
  },
  "heart-mail": {
    name: "Heart Mail",
    description: "Stationery printed with big hearts; a Pokémon carries the message written on it.",
    category: "All mail", pocket: "mail",
    gens: [4],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: 50, sell: 25, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Shop", place: "Hearthome City", detail: "Poké Mart · ₱50" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Shop", place: "Hearthome City", detail: "Poké Mart · ₱50" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Shop", place: "Olivine City", detail: "Poké Mart · ₱50" },
        { type: "Overworld", place: "Mt. Moon Square" },
      ] },
    ],
  },
  "snow-mail": {
    name: "Snow Mail",
    description: "Stationery printed with a snowy landscape; a Pokémon carries the message written on it.",
    category: "All mail", pocket: "mail",
    gens: [4],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: 50, sell: 25, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Shop", place: "Snowpoint City", detail: "Poké Mart · ₱50" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Shop", place: "Snowpoint City", detail: "Poké Mart · ₱50" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Shop", place: "Lavender Town", detail: "Poké Mart · ₱50" },
      ] },
    ],
  },
  "space-mail": {
    name: "Space Mail",
    description: "Stationery printed with the depths of space; a Pokémon carries the message written on it.",
    category: "All mail", pocket: "mail",
    gens: [4],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: 50, sell: 25, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Shop", place: "Veilstone City", detail: "Veilstone Department Store · ₱50" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Shop", place: "Veilstone City", detail: "Veilstone Department Store · ₱50" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Shop", place: "Celadon City", detail: "Celadon Department Store · ₱50" },
        { type: "Shop", place: "Goldenrod City", detail: "Goldenrod Department Store · ₱50" },
      ] },
    ],
  },
  "air-mail": {
    name: "Air Mail",
    description: "Stationery printed with colorful letter sets; a Pokémon carries the message written on it.",
    category: "All mail", pocket: "mail",
    gens: [4],
    prices: [
      { vg: ["diamond-pearl", "heartgold-soulsilver"], games: "Diamond/Pearl, HeartGold/SoulSilver", buy: 50, sell: 25, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Shop", place: "Jubilife City", detail: "Poké Mart · ₱50" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Shop", place: "Jubilife City", detail: "Poké Mart · ₱50" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Starting Item", place: "Mail from Lyra/Ethan" },
      ] },
    ],
  },
  "mosaic-mail": {
    name: "Mosaic Mail",
    description: "Stationery printed with a rainbow mosaic; a Pokémon carries the message written on it.",
    category: "All mail", pocket: "mail",
    gens: [4],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: null, sell: 25, cur: "poke-dollar" },
    ],
  },
  "brick-mail": {
    name: "Brick Mail",
    description: "Stationery printed with a tough brick pattern; a Pokémon carries the message written on it.",
    category: "All mail", pocket: "mail",
    gens: [4],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: null, sell: 25, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Event", place: "Held by GTS event Heracross" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Exchange", place: "Trade" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Exchange", place: "Trade" },
      ] },
    ],
  },
  "cheri-berry": {
    name: "Cheri Berry",
    description: "The holder eats it to cure paralysis.",
    category: "Medicine", pocket: "berries",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10, effect: "Immediately activates the berry’s effect on the target" },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 80, sell: 40, cur: "poke-dollar" },
      { vg: ["brilliant-diamond-shining-pearl"], games: "Brilliant Diamond/Shining Pearl", buy: 80, sell: 10, cur: "poke-dollar" },
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: 120, sell: 30, cur: "poke-dollar" },
    ],
  },
  "chesto-berry": {
    name: "Chesto Berry",
    description: "The holder eats it to wake itself from sleep.",
    category: "Medicine", pocket: "berries",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10, effect: "Immediately activates the berry’s effect on the target" },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 80, sell: 40, cur: "poke-dollar" },
      { vg: ["brilliant-diamond-shining-pearl"], games: "Brilliant Diamond/Shining Pearl", buy: 80, sell: 10, cur: "poke-dollar" },
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: 120, sell: 30, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
  },
  "pecha-berry": {
    name: "Pecha Berry",
    description: "The holder eats it to cure poisoning.",
    category: "Medicine", pocket: "berries",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10, effect: "Immediately activates the berry’s effect on the target" },
    prices: [
      { vg: ["ruby-sapphire", "emerald"], games: "Ruby/Sapphire, Emerald", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 80, sell: 40, cur: "poke-dollar" },
      { vg: ["brilliant-diamond-shining-pearl"], games: "Brilliant Diamond/Shining Pearl", buy: 80, sell: 10, cur: "poke-dollar" },
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: 120, sell: 30, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
  },
  "rawst-berry": {
    name: "Rawst Berry",
    description: "The holder eats it to heal a burn.",
    category: "Medicine", pocket: "berries",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10, effect: "Immediately activates the berry’s effect on the target" },
    prices: [
      { vg: ["ruby-sapphire", "emerald"], games: "Ruby/Sapphire, Emerald", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["brilliant-diamond-shining-pearl"], games: "Brilliant Diamond/Shining Pearl", buy: 80, sell: null, cur: "poke-dollar" },
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: 120, sell: null, cur: "poke-dollar" },
    ],
  },
  "aspear-berry": {
    name: "Aspear Berry",
    description: "The holder eats it to thaw itself out when frozen.",
    category: "Medicine", pocket: "berries",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10, effect: "Immediately activates the berry’s effect on the target" },
    prices: [
      { vg: ["ruby-sapphire", "emerald"], games: "Ruby/Sapphire, Emerald", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["brilliant-diamond-shining-pearl"], games: "Brilliant Diamond/Shining Pearl", buy: 80, sell: null, cur: "poke-dollar" },
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: 120, sell: null, cur: "poke-dollar" },
    ],
  },
  "leppa-berry": {
    name: "Leppa Berry",
    description: "The holder eats it to restore 10 PP to a move that runs out.",
    category: "Medicine", pocket: "berries",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10, effect: "Immediately activates the berry’s effect on the target" },
    prices: [
      { vg: ["ruby-sapphire", "emerald"], games: "Ruby/Sapphire, Emerald", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: 800, sell: 200, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
  },
  "oran-berry": {
    name: "Oran Berry",
    description: "The holder eats it to restore 10 HP when its HP drops low.",
    category: "Medicine", pocket: "berries",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10, effect: "Immediately activates the berry’s effect on the target" },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 80, sell: 40, cur: "poke-dollar" },
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: 80, sell: 20, cur: "poke-dollar" },
    ],
  },
  "persim-berry": {
    name: "Persim Berry",
    description: "The holder eats it to snap out of confusion.",
    category: "Medicine", pocket: "berries",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10, effect: "Immediately activates the berry’s effect on the target" },
    prices: [
      { vg: ["ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
  },
  "lum-berry": {
    name: "Lum Berry",
    description: "The holder eats it to cure any status condition.",
    category: "Medicine", pocket: "berries",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10, effect: "Immediately activates the berry’s effect on the target" },
    prices: [
      { vg: ["ruby-sapphire", "emerald"], games: "Ruby/Sapphire, Emerald", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: null, sell: 150, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
  },
  "sitrus-berry": {
    name: "Sitrus Berry",
    description: "The holder eats it to restore a quarter of its HP when its HP drops low.",
    category: "Medicine", pocket: "berries",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10, effect: "Immediately activates the berry’s effect on the target" },
    prices: [
      { vg: ["red-blue"], games: "Red/Blue", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: 800, sell: 200, cur: "poke-dollar" },
    ],
  },
  "figy-berry": {
    name: "Figy Berry",
    description: "The holder eats it when its HP drops low to restore a good chunk of HP, but it gets confused if it dislikes spicy food.",
    category: "Picky healing", pocket: "berries",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10, effect: "Immediately activates the berry’s effect on the target" },
    prices: [
      { vg: ["ruby-sapphire", "emerald"], games: "Ruby/Sapphire, Emerald", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: null, sell: 150, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
  },
  "wiki-berry": {
    name: "Wiki Berry",
    description: "The holder eats it when its HP drops low to restore a good chunk of HP, but it gets confused if it dislikes dry food.",
    category: "Picky healing", pocket: "berries",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10, effect: "Immediately activates the berry’s effect on the target" },
    prices: [
      { vg: ["ruby-sapphire", "emerald"], games: "Ruby/Sapphire, Emerald", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: null, sell: 150, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
  },
  "mago-berry": {
    name: "Mago Berry",
    description: "The holder eats it when its HP drops low to restore a good chunk of HP, but it gets confused if it dislikes sweet food.",
    category: "Picky healing", pocket: "berries",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10, effect: "Immediately activates the berry’s effect on the target" },
    prices: [
      { vg: ["ruby-sapphire", "emerald"], games: "Ruby/Sapphire, Emerald", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: null, sell: 150, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
  },
  "aguav-berry": {
    name: "Aguav Berry",
    description: "The holder eats it when its HP drops low to restore a good chunk of HP, but it gets confused if it dislikes bitter food.",
    category: "Picky healing", pocket: "berries",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10, effect: "Immediately activates the berry’s effect on the target" },
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: null, sell: 150, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
  },
  "iapapa-berry": {
    name: "Iapapa Berry",
    description: "The holder eats it when its HP drops low to restore a good chunk of HP, but it gets confused if it dislikes sour food.",
    category: "Picky healing", pocket: "berries",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10, effect: "Immediately activates the berry’s effect on the target" },
    prices: [
      { vg: ["ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: null, sell: 150, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
  },
  "razz-berry": {
    name: "Razz Berry",
    description: "A red Berry grown mostly for Pokéblocks and Poffins.",
    category: "Baking only", pocket: "berries",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: 500, sell: 125, cur: "poke-dollar" },
    ],
  },
  "bluk-berry": {
    name: "Bluk Berry",
    description: "A dark Berry grown mostly for Pokéblocks and Poffins; stains the mouth purple.",
    category: "Baking only", pocket: "berries",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "black-white"], games: "Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, Black/White", buy: null, sell: 10, cur: "poke-dollar" },
    ],
  },
  "nanab-berry": {
    name: "Nanab Berry",
    description: "A pink Berry grown mostly for Pokéblocks and Poffins.",
    category: "Baking only", pocket: "berries",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["ruby-sapphire", "emerald"], games: "Ruby/Sapphire, Emerald", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: 200, sell: null, cur: "poke-dollar" },
    ],
  },
  "wepear-berry": {
    name: "Wepear Berry",
    description: "A bitter-and-sour green Berry grown mostly for Pokéblocks and Poffins.",
    category: "Baking only", pocket: "berries",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["ruby-sapphire", "emerald", "diamond-pearl", "platinum", "black-white", "x-y", "brilliant-diamond-shining-pearl"], games: "Ruby/Sapphire, Emerald, Diamond/Pearl, Platinum, Black/White, X/Y, Brilliant Diamond/Shining Pearl", buy: null, sell: 10, cur: "poke-dollar" },
    ],
  },
  "pinap-berry": {
    name: "Pinap Berry",
    description: "A spiky yellow Berry grown mostly for Pokéblocks and Poffins.",
    category: "Baking only", pocket: "berries",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["ruby-sapphire", "emerald", "diamond-pearl", "platinum"], games: "Ruby/Sapphire, Emerald, Diamond/Pearl, Platinum", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: 400, sell: 100, cur: "poke-dollar" },
    ],
  },
  "pomeg-berry": {
    name: "Pomeg Berry",
    description: "Eaten, it makes a Pokémon friendlier but takes 10 of its HP effort points away.",
    category: "Effort drop", pocket: "berries",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["ruby-sapphire", "emerald", "diamond-pearl", "platinum"], games: "Ruby/Sapphire, Emerald, Diamond/Pearl, Platinum", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
  },
  "kelpsy-berry": {
    name: "Kelpsy Berry",
    description: "Eaten, it makes a Pokémon friendlier but takes 10 of its Attack effort points away.",
    category: "Effort drop", pocket: "berries",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
  },
  "qualot-berry": {
    name: "Qualot Berry",
    description: "Eaten, it makes a Pokémon friendlier but takes 10 of its Defense effort points away.",
    category: "Effort drop", pocket: "berries",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["ruby-sapphire", "emerald"], games: "Ruby/Sapphire, Emerald", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
  },
  "hondew-berry": {
    name: "Hondew Berry",
    description: "Eaten, it makes a Pokémon friendlier but takes 10 of its Sp. Atk effort points away.",
    category: "Effort drop", pocket: "berries",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["ruby-sapphire", "emerald"], games: "Ruby/Sapphire, Emerald", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
  },
  "grepa-berry": {
    name: "Grepa Berry",
    description: "Eaten, it makes a Pokémon friendlier but takes 10 of its Sp. Def effort points away.",
    category: "Effort drop", pocket: "berries",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["ruby-sapphire", "emerald", "firered-leafgreen"], games: "Ruby/Sapphire, Emerald, FireRed/LeafGreen", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
  },
  "tamato-berry": {
    name: "Tamato Berry",
    description: "Eaten, it makes a Pokémon friendlier but takes 10 of its Speed effort points away.",
    category: "Effort drop", pocket: "berries",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["ruby-sapphire", "emerald", "diamond-pearl", "platinum", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Ruby/Sapphire, Emerald, Diamond/Pearl, Platinum, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
  },
  "cornn-berry": {
    name: "Cornn Berry",
    description: "An uncommon Berry grown for Pokéblocks and Poffins.",
    category: "Baking only", pocket: "berries",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["ruby-sapphire", "emerald", "diamond-pearl", "platinum", "black-white"], games: "Ruby/Sapphire, Emerald, Diamond/Pearl, Platinum, Black/White", buy: null, sell: 10, cur: "poke-dollar" },
    ],
  },
  "magost-berry": {
    name: "Magost Berry",
    description: "An uncommon Berry grown for Pokéblocks and Poffins.",
    category: "Baking only", pocket: "berries",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["ruby-sapphire", "emerald"], games: "Ruby/Sapphire, Emerald", buy: null, sell: 10, cur: "poke-dollar" },
    ],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Overworld", place: "Hoenn Route 123", detail: "Berry Master's house", games: "Ruby" },
      ] },
    ],
  },
  "rabuta-berry": {
    name: "Rabuta Berry",
    description: "An uncommon hairy Berry grown for Pokéblocks and Poffins.",
    category: "Baking only", pocket: "berries",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["ruby-sapphire", "emerald", "diamond-pearl", "platinum", "black-white", "black-2-white-2", "x-y", "brilliant-diamond-shining-pearl"], games: "Ruby/Sapphire, Emerald, Diamond/Pearl, Platinum, Black/White, Black 2/White 2, X/Y, Brilliant Diamond/Shining Pearl", buy: null, sell: 10, cur: "poke-dollar" },
    ],
  },
  "nomel-berry": {
    name: "Nomel Berry",
    description: "A very sour Berry grown for Pokéblocks and Poffins.",
    category: "Baking only", pocket: "berries",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["ruby-sapphire", "emerald", "diamond-pearl", "platinum", "black-white"], games: "Ruby/Sapphire, Emerald, Diamond/Pearl, Platinum, Black/White", buy: null, sell: 10, cur: "poke-dollar" },
    ],
    where: [
      { vg: "emerald", games: "Emerald", lines: [
        { type: "Overworld", place: "Hoenn Route 123", detail: "Berry Master" },
      ] },
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Walking Pokémon", place: "Amity Square", games: "Diamond" },
      ] },
    ],
  },
  "spelon-berry": {
    name: "Spelon Berry",
    description: "A fiercely spicy Berry grown for Pokéblocks and Poffins.",
    category: "Baking only", pocket: "berries",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["red-blue"], games: "Red/Blue", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["black-white"], games: "Black/White", buy: null, sell: 500, cur: "poke-dollar" },
    ],
  },
  "pamtre-berry": {
    name: "Pamtre Berry",
    description: "A rare, dry Berry grown for Pokéblocks and Poffins.",
    category: "Baking only", pocket: "berries",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["ruby-sapphire", "emerald", "diamond-pearl", "platinum", "black-white"], games: "Ruby/Sapphire, Emerald, Diamond/Pearl, Platinum, Black/White", buy: null, sell: 10, cur: "poke-dollar" },
    ],
  },
  "watmel-berry": {
    name: "Watmel Berry",
    description: "A huge, very sweet Berry grown for Pokéblocks and Poffins.",
    category: "Baking only", pocket: "berries",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["ruby-sapphire", "emerald", "diamond-pearl", "platinum", "black-white"], games: "Ruby/Sapphire, Emerald, Diamond/Pearl, Platinum, Black/White", buy: null, sell: 10, cur: "poke-dollar" },
    ],
  },
  "durin-berry": {
    name: "Durin Berry",
    description: "A very bitter Berry grown for Pokéblocks and Poffins.",
    category: "Baking only", pocket: "berries",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["ruby-sapphire", "emerald", "diamond-pearl", "platinum", "black-white"], games: "Ruby/Sapphire, Emerald, Diamond/Pearl, Platinum, Black/White", buy: null, sell: 10, cur: "poke-dollar" },
    ],
  },
  "belue-berry": {
    name: "Belue Berry",
    description: "A rare, extremely sour Berry grown for Pokéblocks and Poffins.",
    category: "Baking only", pocket: "berries",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["ruby-sapphire", "emerald", "diamond-pearl", "platinum", "x-y", "brilliant-diamond-shining-pearl"], games: "Ruby/Sapphire, Emerald, Diamond/Pearl, Platinum, X/Y, Brilliant Diamond/Shining Pearl", buy: null, sell: 10, cur: "poke-dollar" },
    ],
  },
  "occa-berry": {
    name: "Occa Berry",
    description: "Halves the damage of one super-effective Fire-type hit, then is eaten.",
    category: "Type protection", pocket: "berries",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["diamond-pearl", "platinum"], games: "Diamond/Pearl, Platinum", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
  },
  "passho-berry": {
    name: "Passho Berry",
    description: "Halves the damage of one super-effective Water-type hit, then is eaten.",
    category: "Type protection", pocket: "berries",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
  },
  "wacan-berry": {
    name: "Wacan Berry",
    description: "Halves the damage of one super-effective Electric-type hit, then is eaten.",
    category: "Type protection", pocket: "berries",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
  },
  "rindo-berry": {
    name: "Rindo Berry",
    description: "Halves the damage of one super-effective Grass-type hit, then is eaten.",
    category: "Type protection", pocket: "berries",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Wild Pokémon", place: "Held by wild Finneon and Lumineon", games: "Diamond" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Wild Pokémon", place: "Held by wild Finneon, Lumineon, and Panpour", games: "Black" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Berry Tree", place: "Bridge Field", detail: "Berry trees", games: "Sword" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Overworld", place: "Socarrat Trail", games: "Scarlet" },
      ] },
    ],
  },
  "yache-berry": {
    name: "Yache Berry",
    description: "Halves the damage of one super-effective Ice-type hit, then is eaten.",
    category: "Type protection", pocket: "berries",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
  },
  "chople-berry": {
    name: "Chople Berry",
    description: "Halves the damage of one super-effective Fighting-type hit, then is eaten.",
    category: "Type protection", pocket: "berries",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
  },
  "kebia-berry": {
    name: "Kebia Berry",
    description: "Halves the damage of one super-effective Poison-type hit, then is eaten.",
    category: "Type protection", pocket: "berries",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["diamond-pearl", "platinum"], games: "Diamond/Pearl, Platinum", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
  },
  "shuca-berry": {
    name: "Shuca Berry",
    description: "Halves the damage of one super-effective Ground-type hit, then is eaten.",
    category: "Type protection", pocket: "berries",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", detail: "Various methods including Battle Frontier, Pastoria City, and held by wild Ponyta (5%)", games: "Diamond" },
      ] },
    ],
  },
  "coba-berry": {
    name: "Coba Berry",
    description: "Halves the damage of one super-effective Flying-type hit, then is eaten.",
    category: "Type protection", pocket: "berries",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-2-white-2"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black 2/White 2", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
  },
  "payapa-berry": {
    name: "Payapa Berry",
    description: "Halves the damage of one super-effective Psychic-type hit, then is eaten.",
    category: "Type protection", pocket: "berries",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
  },
  "tanga-berry": {
    name: "Tanga Berry",
    description: "Halves the damage of one super-effective Bug-type hit, then is eaten.",
    category: "Type protection", pocket: "berries",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
  },
  "charti-berry": {
    name: "Charti Berry",
    description: "Halves the damage of one super-effective Rock-type hit, then is eaten.",
    category: "Type protection", pocket: "berries",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Pastoria City", games: "Diamond" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Berry Tree", place: "Lake of Outrage", games: "Sword" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Overworld", place: "Socarrat Trail", games: "Violet" },
      ] },
    ],
  },
  "kasib-berry": {
    name: "Kasib Berry",
    description: "Halves the damage of one super-effective Ghost-type hit, then is eaten.",
    category: "Type protection", pocket: "berries",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["diamond-pearl"], games: "Diamond/Pearl", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
  },
  "haban-berry": {
    name: "Haban Berry",
    description: "Halves the damage of one super-effective Dragon-type hit, then is eaten.",
    category: "Type protection", pocket: "berries",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
    where: [
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Wild Pokémon", place: "Held by wild Gible and Gabite" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Mom", place: "Bought by player's Mom", games: "HeartGold" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Overworld", place: "Driftveil City", games: "Black 2" },
      ] },
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Berry Tree", place: "Red Berry trees", games: "X" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Hoenn Route 123", games: "Omega Ruby" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Overworld", place: "Poni Wilds", detail: "Berry piles", games: "Sun" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Berry Tree", place: "Lake of Outrage", games: "Sword" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Overworld", place: "Socarrat Trail", games: "Scarlet" },
      ] },
    ],
  },
  "colbur-berry": {
    name: "Colbur Berry",
    description: "Halves the damage of one super-effective Dark-type hit, then is eaten.",
    category: "Type protection", pocket: "berries",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Transfer", place: "Transfer from My Pokémon Ranch (held by Hayley's Wynaut)", games: "Diamond" },
        { type: "Wild Pokémon", place: "Held by wild Chingling or Chimecho", games: "Diamond" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Mom", place: "Bought by player's Mom", games: "HeartGold" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Wild Pokémon", place: "Held by wild Chimecho", games: "Black" },
      ] },
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Berry Tree", place: "Purple Berry trees", games: "X" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Overworld", place: "North Province (Area One)", games: "Scarlet" },
      ] },
    ],
  },
  "babiri-berry": {
    name: "Babiri Berry",
    description: "Halves the damage of one super-effective Steel-type hit, then is eaten.",
    category: "Type protection", pocket: "berries",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
  },
  "chilan-berry": {
    name: "Chilan Berry",
    description: "Halves the damage of one Normal-type hit, then is eaten.",
    category: "Type protection", pocket: "berries",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Wild Pokémon", place: "Held by wild Rattata or Raticate", games: "Diamond" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Berry Tree", place: "Route 5 - Galar", games: "Sword" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Overworld", place: "North Province (Area One)", games: "Scarlet" },
      ] },
    ],
  },
  "liechi-berry": {
    name: "Liechi Berry",
    description: "The holder eats it when its HP drops low to raise its Attack.",
    category: "In a pinch", pocket: "berries",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10, effect: "Immediately activates the berry’s effect on the target" },
    prices: [
      { vg: ["ruby-sapphire", "emerald", "diamond-pearl", "platinum"], games: "Ruby/Sapphire, Emerald, Diamond/Pearl, Platinum", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
    where: [
      { vg: "emerald", games: "Emerald", lines: [
        { type: "Overworld", place: "Mirage Island" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Berry Tree", place: "Route 7 - Galar", games: "Sword" },
      ] },
    ],
  },
  "ganlon-berry": {
    name: "Ganlon Berry",
    description: "The holder eats it when its HP drops low to raise its Defense.",
    category: "In a pinch", pocket: "berries",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10, effect: "Immediately activates the berry’s effect on the target" },
    prices: [
      { vg: ["ruby-sapphire", "emerald", "diamond-pearl", "platinum"], games: "Ruby/Sapphire, Emerald, Diamond/Pearl, Platinum", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Event", games: "Ruby" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Berry Tree", place: "Route 7 - Galar", games: "Sword" },
      ] },
    ],
  },
  "salac-berry": {
    name: "Salac Berry",
    description: "The holder eats it when its HP drops low to raise its Speed.",
    category: "In a pinch", pocket: "berries",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10, effect: "Immediately activates the berry’s effect on the target" },
    prices: [
      { vg: ["ruby-sapphire", "emerald"], games: "Ruby/Sapphire, Emerald", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
  },
  "petaya-berry": {
    name: "Petaya Berry",
    description: "The holder eats it when its HP drops low to raise its Sp. Atk.",
    category: "In a pinch", pocket: "berries",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10, effect: "Immediately activates the berry’s effect on the target" },
    prices: [
      { vg: ["ruby-sapphire", "emerald"], games: "Ruby/Sapphire, Emerald", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
  },
  "apicot-berry": {
    name: "Apicot Berry",
    description: "The holder eats it when its HP drops low to raise its Sp. Def.",
    category: "In a pinch", pocket: "berries",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10, effect: "Immediately activates the berry’s effect on the target" },
    prices: [
      { vg: ["ruby-sapphire", "diamond-pearl", "black-white", "x-y", "sun-moon", "brilliant-diamond-shining-pearl"], games: "Ruby/Sapphire, Diamond/Pearl, Black/White, X/Y, Sun/Moon, Brilliant Diamond/Shining Pearl", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Event", place: "Event distribution", games: "Ruby" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Berry Tree", place: "Route 9 - Galar", detail: "Berry trees · Also found in Dappled Grove, Giant's Cap, Lake of Outrage", games: "Sword" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Overworld", place: "Area Zero", detail: "Sparkling overworld item", games: "Scarlet" },
      ] },
    ],
  },
  "lansat-berry": {
    name: "Lansat Berry",
    description: "The holder eats it when its HP drops low to sharply raise its critical-hit ratio.",
    category: "In a pinch", pocket: "berries",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10, effect: "Immediately activates the berry’s effect on the target" },
    prices: [
      { vg: ["ruby-sapphire", "emerald", "diamond-pearl", "platinum"], games: "Ruby/Sapphire, Emerald, Diamond/Pearl, Platinum", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
    where: [
      { vg: "emerald", games: "Emerald", lines: [
        { type: "NPC Gift", place: "Battle Frontier (Hoenn)", detail: "From Scott after obtaining all seven Silver Frontier Symbols · After obtaining all seven Silver Frontier Symbols" },
      ] },
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Event", place: "Event distribution", games: "Diamond" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Tournament", place: "Battle Tower (Galar)", detail: "After 100 consecutive victories · After 100 consecutive Battle Tower victories", games: "Sword" },
      ] },
    ],
  },
  "starf-berry": {
    name: "Starf Berry",
    description: "The holder eats it when its HP drops low to sharply raise one stat at random.",
    category: "In a pinch", pocket: "berries",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10, effect: "Immediately activates the berry’s effect on the target" },
    prices: [
      { vg: ["ruby-sapphire", "emerald", "diamond-pearl", "platinum", "black-white", "x-y", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Ruby/Sapphire, Emerald, Diamond/Pearl, Platinum, Black/White, X/Y, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
    where: [
      { vg: "emerald", games: "Emerald", lines: [
        { type: "Trainer Reward", place: "Battle Frontier (Hoenn)", detail: "From Scott after obtaining all seven Gold Frontier Symbols · After obtaining all seven Gold Frontier Symbols" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Tournament", place: "Battle Tower (Galar)", detail: "Every 100 victories starting from 200", games: "Sword" },
      ] },
    ],
  },
  "enigma-berry": {
    name: "Enigma Berry",
    description: "The holder eats it after taking a super-effective hit to restore a quarter of its HP.",
    category: "Other", pocket: "berries",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["ruby-sapphire", "emerald"], games: "Ruby/Sapphire, Emerald", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
  },
  "micle-berry": {
    name: "Micle Berry",
    description: "The holder eats it when its HP drops low; its next move is more accurate.",
    category: "In a pinch", pocket: "berries",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 10, effect: "Immediately activates the berry’s effect on the target" },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Event", games: "Diamond" },
      ] },
    ],
  },
  "custap-berry": {
    name: "Custap Berry",
    description: "The holder eats it when its HP drops low to move first on the next turn.",
    category: "In a pinch", pocket: "berries",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Event", games: "Diamond" },
      ] },
    ],
  },
  "jaboca-berry": {
    name: "Jaboca Berry",
    description: "When a physical move hits the holder, the attacker takes damage and the Berry is used up.",
    category: "Other", pocket: "berries",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Event", games: "Diamond" },
      ] },
    ],
  },
  "rowap-berry": {
    name: "Rowap Berry",
    description: "When a special move hits the holder, the attacker takes damage and the Berry is used up.",
    category: "Other", pocket: "berries",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
  },
  "bright-powder": {
    name: "Bright Powder",
    description: "A glittering powder that makes the holder harder to hit.",
    category: "Held items", pocket: "misc",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald", "firered-leafgreen"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald, FireRed/LeafGreen", buy: null, sell: 5, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 30000, sell: 7500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "Wild Pokémon", place: "Held by Articuno, Zapdos, Moltres, and Mewtwo when traded from Generation I", detail: "Trade from Generation I", games: "Gold" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Overworld", place: "Goldenrod Radio Tower", games: "HeartGold" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Shop", place: "Cascarrafa", detail: "Delibird Presents · ₱30000 · After completing the main storyline", games: "Scarlet" },
      ] },
    ],
  },
  "white-herb": {
    name: "White Herb",
    description: "Undoes any stat drops the holder suffers, once, then is used up.",
    category: "Held items", pocket: "misc",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10, effect: "Immediately activates the herb’s effect on the target" },
    prices: [
      { vg: ["sun-moon"], games: "Sun/Moon", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 20000, sell: 5000, cur: "poke-dollar" },
    ],
  },
  "macho-brace": {
    name: "Macho Brace",
    description: "Doubles the effort points the holder earns from battle, but halves its Speed while held.",
    category: "Effort training", pocket: "misc",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 60 },
    prices: [
      { vg: ["red-blue", "gold-silver", "ruby-sapphire", "diamond-pearl", "black-white", "x-y", "sun-moon", "sword-shield"], games: "Red/Blue, Gold/Silver, Ruby/Sapphire, Diamond/Pearl, Black/White, X/Y, Sun/Moon, Sword/Shield", buy: null, sell: 1500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Overworld", place: "Hoenn Route 111", games: "Ruby" },
      ] },
      { vg: "firered-leafgreen", games: "FireRed/LeafGreen", lines: [
        { type: "Overworld", place: "Viridian Gym", games: "FireRed" },
      ] },
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Pastoria City", games: "Diamond" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Exchange", place: "Hammerlocke", detail: "10 BP", games: "Sword" },
      ] },
    ],
  },
  "exp-share": {
    name: "Exp. Share",
    description: "Splits battle experience with a Pokémon that didn't fight; in newer games it's a switch that shares with the whole party.",
    category: "Training", pocket: "misc",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: null, sell: 0, cur: "poke-dollar" },
      { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2", buy: null, sell: 1500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "NPC Gift", place: "Route 15 (Kanto)", detail: "Route 15 gate 2F from Oak's aide after obtaining 50 Pokémon · After obtaining 50 Pokémon", games: "Red" },
      ] },
    ],
  },
  "quick-claw": {
    name: "Quick Claw",
    description: "Occasionally lets the holder move first regardless of Speed.",
    category: "Held items", pocket: "misc",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 50, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 8000, sell: 2000, cur: "poke-dollar" },
      { vg: ["legends-za"], games: "Legends: Z-A", buy: null, sell: 750, cur: "poke-dollar" },
    ],
  },
  "soothe-bell": {
    name: "Soothe Bell",
    description: "The holder grows friendly faster.",
    category: "Training", pocket: "misc",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 50, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 5000, sell: 1250, cur: "poke-dollar" },
      { vg: ["legends-za"], games: "Legends: Z-A", buy: null, sell: 750, cur: "poke-dollar" },
    ],
  },
  "mental-herb": {
    name: "Mental Herb",
    description: "Frees the holder from infatuation, Taunt, Encore and similar effects once, then breaks.",
    category: "Held items", pocket: "misc",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10, effect: "Immediately activates the herb’s effect on the target" },
    prices: [
      { vg: ["ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 50, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 10000, sell: 2500, cur: "poke-dollar" },
    ],
  },
  "choice-band": {
    name: "Choice Band",
    description: "Boosts the holder's Attack by half, but locks it into the first move it uses.",
    category: "Choice", pocket: "misc",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["ruby-sapphire"], games: "Ruby/Sapphire", buy: null, sell: 50, cur: "poke-dollar" },
      { vg: ["sun-moon"], games: "Sun/Moon", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 100000, sell: 25000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Exchange", place: "Battle Tower (Hoenn)", detail: "35+ win streak · 64 BP", games: "Ruby" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Exchange", place: "Battle Tower (Galar)", detail: "25 BP", games: "Sword" },
      ] },
    ],
  },
  "kings-rock": {
    name: "King’s Rock",
    description: "The holder's damaging moves may make the target flinch, and it evolves Poliwhirl and Slowpoke when traded.",
    category: "Held items", pocket: "misc",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30, effect: "Target will flinch if it has not yet gone this turn" },
    prices: [
      { vg: ["black-2-white-2"], games: "Black 2/White 2", buy: 6000, sell: null, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 10000, sell: null, cur: "poke-dollar" },
    ],
  },
  "silver-powder": {
    name: "Silver Powder",
    description: "Strengthens the holder's Bug-type moves.",
    category: "Type enhancement", pocket: "misc",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["sun-moon"], games: "Sun/Moon", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: 500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 3000, sell: 750, cur: "poke-dollar" },
    ],
  },
  "amulet-coin": {
    name: "Amulet Coin",
    description: "Doubles the prize money from a battle if the holder takes part.",
    category: "Training", pocket: "misc",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: null, sell: 50, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 5000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 7500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "Overworld", place: "Goldenrod Department Store (Basement)", games: "Gold" },
      ] },
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "NPC Gift", place: "Littleroot Town", detail: "From Mom after earning the Balance Badge · Balance Badge Badge", games: "Ruby" },
      ] },
    ],
  },
  "cleanse-tag": {
    name: "Cleanse Tag",
    description: "Wild Pokémon are less likely to appear while the lead Pokémon holds it.",
    category: "Training", pocket: "misc",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 2500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 1250, cur: "poke-dollar" },
    ],
    where: [
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "Overworld", place: "Route 05 (Kanto)" },
      ] },
      { vg: "crystal", games: "Crystal", lines: [
        { type: "Overworld", place: "Route 05 (Kanto)" },
      ] },
    ],
  },
  "soul-dew": {
    name: "Soul Dew",
    description: "Held by Latias or Latios, strengthens its Psychic- and Dragon-type moves (raised its Sp. Atk and Sp. Def before Gen VII).",
    category: "Species-specific", pocket: "misc",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["ruby-sapphire", "firered-leafgreen", "diamond-pearl", "platinum", "black-white", "x-y", "omega-ruby-alpha-sapphire"], games: "Ruby/Sapphire, FireRed/LeafGreen, Diamond/Pearl, Platinum, Black/White, X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 100, cur: "poke-dollar" },
    ],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Wild Pokémon", place: "Southern Island", detail: "Held by Latias (requires Eon Ticket) · Requires Eon Ticket", games: "Ruby" },
      ] },
    ],
  },
  "deep-sea-tooth": {
    name: "Deep Sea Tooth",
    description: "Doubles Clamperl's Sp. Atk, and makes it evolve into Huntail when traded.",
    category: "Species-specific", pocket: "misc",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 90 },
    prices: [
      { vg: ["ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["black-2-white-2"], games: "Black 2/White 2", buy: 1000, sell: null, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 1000, cur: "poke-dollar" },
    ],
  },
  "deep-sea-scale": {
    name: "Deep Sea Scale",
    description: "Doubles Clamperl's Sp. Def, and makes it evolve into Gorebyss when traded.",
    category: "Species-specific", pocket: "misc",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["ruby-sapphire"], games: "Ruby/Sapphire", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["black-2-white-2"], games: "Black 2/White 2", buy: 2000, sell: null, cur: "poke-dollar" },
      { vg: ["sun-moon"], games: "Sun/Moon", buy: null, sell: 1000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Choice", place: "Slateport City", detail: "NPC choice between Deep Sea Scale and Deep Sea Tooth", games: "Ruby" },
      ] },
    ],
  },
  "smoke-ball": {
    name: "Smoke Ball",
    description: "Guarantees the holder can flee from a wild Pokémon.",
    category: "Held items", pocket: "misc",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald", "diamond-pearl", "platinum", "black-white", "black-2-white-2"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald, Diamond/Pearl, Platinum, Black/White, Black 2/White 2", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 15000, sell: 3750, cur: "poke-dollar" },
    ],
  },
  "everstone": {
    name: "Everstone",
    description: "Stops the holder from evolving.",
    category: "Training", pocket: "misc",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["gold-silver", "ruby-sapphire", "diamond-pearl", "black-white"], games: "Gold/Silver, Ruby/Sapphire, Diamond/Pearl, Black/White", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon"], games: "Sun/Moon", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 3000, sell: 750, cur: "poke-dollar" },
    ],
  },
  "focus-band": {
    name: "Focus Band",
    description: "Gives the holder a small chance to survive a knockout blow with 1 HP.",
    category: "Held items", pocket: "misc",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "black-white", "black-2-white-2"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, Black/White, Black 2/White 2", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 10000, sell: 2500, cur: "poke-dollar" },
      { vg: ["legends-za"], games: "Legends: Z-A", buy: null, sell: 750, cur: "poke-dollar" },
    ],
  },
  "lucky-egg": {
    name: "Lucky Egg",
    description: "The holder earns extra Exp. Points from battle.",
    category: "Training", pocket: "misc",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 5000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 2500, cur: "poke-dollar" },
      { vg: ["legends-za"], games: "Legends: Z-A", buy: null, sell: 750, cur: "poke-dollar" },
    ],
  },
  "scope-lens": {
    name: "Scope Lens",
    description: "Raises the holder's critical-hit ratio.",
    category: "Held items", pocket: "misc",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 15000, sell: 3750, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Overworld", place: "Route 9 - Galar", games: "Sword" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Shop", place: "Levincia", detail: "Delibird Presents (Levincia Branch) · ₱15000", games: "Scarlet" },
      ] },
    ],
  },
  "metal-coat": {
    name: "Metal Coat",
    description: "Strengthens Steel-type moves, and evolves Onix and Scyther when traded while held.",
    category: "Type enhancement", pocket: "misc",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["black-2-white-2"], games: "Black 2/White 2", buy: 20000, sell: null, cur: "poke-dollar" },
      { vg: ["sword-shield", "scarlet-violet"], games: "Sword/Shield, Scarlet/Violet", buy: 3000, sell: null, cur: "poke-dollar" },
    ],
  },
  "leftovers": {
    name: "Leftovers",
    description: "Restores a little of the holder's HP at the end of every turn.",
    category: "Held items", pocket: "misc",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 20000, sell: 5000, cur: "poke-dollar" },
    ],
  },
  "dragon-scale": {
    name: "Dragon Scale",
    description: "A tough scale; Seadra evolves into Kingdra when traded while holding it.",
    category: "Evolution", pocket: "misc",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["gold-silver", "ruby-sapphire", "diamond-pearl", "black-white"], games: "Gold/Silver, Ruby/Sapphire, Diamond/Pearl, Black/White", buy: null, sell: 1050, cur: "poke-dollar" },
      { vg: ["black-2-white-2"], games: "Black 2/White 2", buy: 4000, sell: 1050, cur: "poke-dollar" },
      { vg: ["sun-moon", "sword-shield", "scarlet-violet"], games: "Sun/Moon, Sword/Shield, Scarlet/Violet", buy: null, sell: 1000, cur: "poke-dollar" },
    ],
  },
  "light-ball": {
    name: "Light Ball",
    description: "Doubles Pikachu's Attack and Sp. Atk.",
    category: "Species-specific", pocket: "misc",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30, effect: "Paralyzes the target" },
    prices: [
      { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 50, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 250, cur: "poke-dollar" },
    ],
  },
  "soft-sand": {
    name: "Soft Sand",
    description: "Strengthens the holder's Ground-type moves.",
    category: "Type enhancement", pocket: "misc",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald", "diamond-pearl", "platinum"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald, Diamond/Pearl, Platinum", buy: null, sell: 50, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 3000, sell: 750, cur: "poke-dollar" },
    ],
  },
  "hard-stone": {
    name: "Hard Stone",
    description: "Strengthens the holder's Rock-type moves.",
    category: "Type enhancement", pocket: "misc",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 100 },
    prices: [
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: null, sell: 50, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 3000, sell: 750, cur: "poke-dollar" },
    ],
  },
  "miracle-seed": {
    name: "Miracle Seed",
    description: "Strengthens the holder's Grass-type moves.",
    category: "Type enhancement", pocket: "misc",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 50, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: 500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 3000, sell: 750, cur: "poke-dollar" },
    ],
    where: [
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "Overworld", place: "Route 32 (Johto)" },
      ] },
      { vg: "crystal", games: "Crystal", lines: [
        { type: "Overworld", place: "Route 32 (Johto)" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Shop", place: "Stow-on-Side", detail: "Bargain Shop · ₱3000", games: "Sword" },
      ] },
    ],
  },
  "black-glasses": {
    name: "Black Glasses",
    description: "Strengthens the holder's Dark-type moves.",
    category: "Type enhancement", pocket: "misc",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: null, sell: 50, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: 500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 3000, sell: 750, cur: "poke-dollar" },
    ],
  },
  "black-belt": {
    name: "Black Belt",
    description: "Strengthens the holder's Fighting-type moves.",
    category: "Type enhancement", pocket: "misc",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["gold-silver", "ruby-sapphire"], games: "Gold/Silver, Ruby/Sapphire", buy: null, sell: 50, cur: "poke-dollar" },
      { vg: ["sun-moon"], games: "Sun/Moon", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: 500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 3000, sell: 750, cur: "poke-dollar" },
    ],
    where: [
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "Overworld", place: "Lake of Rage" },
      ] },
    ],
  },
  "magnet": {
    name: "Magnet",
    description: "Strengthens the holder's Electric-type moves.",
    category: "Type enhancement", pocket: "misc",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 50, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: 500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 3000, sell: 750, cur: "poke-dollar" },
    ],
  },
  "mystic-water": {
    name: "Mystic Water",
    description: "Strengthens the holder's Water-type moves.",
    category: "Type enhancement", pocket: "misc",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: null, sell: 50, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: 500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 3000, sell: 750, cur: "poke-dollar" },
    ],
  },
  "sharp-beak": {
    name: "Sharp Beak",
    description: "Strengthens the holder's Flying-type moves.",
    category: "Type enhancement", pocket: "misc",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 50 },
    prices: [
      { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 50, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: 500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 3000, sell: 750, cur: "poke-dollar" },
    ],
  },
  "poison-barb": {
    name: "Poison Barb",
    description: "Strengthens the holder's Poison-type moves.",
    category: "Type enhancement", pocket: "misc",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 70, effect: "Poisons the target" },
    prices: [
      { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2", buy: null, sell: 50, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: 500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 3000, sell: 750, cur: "poke-dollar" },
    ],
  },
  "never-melt-ice": {
    name: "Never-Melt Ice",
    description: "Strengthens the holder's Ice-type moves.",
    category: "Type enhancement", pocket: "misc",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald", "firered-leafgreen"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald, FireRed/LeafGreen", buy: null, sell: 50, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: 500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 3000, sell: 750, cur: "poke-dollar" },
    ],
  },
  "spell-tag": {
    name: "Spell Tag",
    description: "Strengthens the holder's Ghost-type moves.",
    category: "Type enhancement", pocket: "misc",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["gold-silver", "ruby-sapphire", "diamond-pearl"], games: "Gold/Silver, Ruby/Sapphire, Diamond/Pearl", buy: null, sell: 50, cur: "poke-dollar" },
      { vg: ["sun-moon"], games: "Sun/Moon", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: 500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 3000, sell: 750, cur: "poke-dollar" },
    ],
  },
  "twisted-spoon": {
    name: "Twisted Spoon",
    description: "Strengthens the holder's Psychic-type moves.",
    category: "Type enhancement", pocket: "misc",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: null, sell: 50, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: 500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 3000, sell: 750, cur: "poke-dollar" },
    ],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Wild Pokémon", place: "Held by wild Abra", games: "Ruby" },
      ] },
    ],
  },
  "charcoal": {
    name: "Charcoal",
    description: "Strengthens the holder's Fire-type moves.",
    category: "Type enhancement", pocket: "misc",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: 9800, sell: 4900, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: 500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 3000, sell: 750, cur: "poke-dollar" },
    ],
  },
  "dragon-fang": {
    name: "Dragon Fang",
    description: "Strengthens the holder's Dragon-type moves.",
    category: "Type enhancement", pocket: "misc",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 70 },
    prices: [
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: null, sell: 50, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: 500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 3000, sell: 750, cur: "poke-dollar" },
    ],
  },
  "silk-scarf": {
    name: "Silk Scarf",
    description: "Strengthens the holder's Normal-type moves.",
    category: "Type enhancement", pocket: "misc",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum"], games: "Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum", buy: null, sell: 50, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: 500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 3000, sell: 750, cur: "poke-dollar" },
    ],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Overworld", place: "Dewford Town", games: "Ruby" },
      ] },
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Exchange", place: "Veilstone City", detail: "Veilstone Game Corner · 1000 C", games: "Diamond" },
      ] },
    ],
  },
  "up-grade": {
    name: "Upgrade",
    description: "A transparent device packed with data; Porygon evolves into Porygon2 when traded holding it.",
    category: "Evolution", pocket: "misc",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["gold-silver"], games: "Gold/Silver", buy: null, sell: 1050, cur: "poke-dollar" },
      { vg: ["black-2-white-2"], games: "Black 2/White 2", buy: 40000, sell: null, cur: "poke-dollar" },
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: 8000, sell: null, cur: "poke-dollar" },
    ],
    where: [
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "Overworld", place: "Silph Co.", games: "Gold" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Shop", place: "Black City", detail: "Store 3 · ₱40000", games: "Black 2" },
      ] },
      { vg: "legends-arceus", games: "Legends: Arceus", lines: [
        { type: "Exchange", place: "Trading Post", detail: "1000 LP" },
      ] },
    ],
  },
  "shell-bell": {
    name: "Shell Bell",
    description: "Heals the holder by an eighth of the damage it deals.",
    category: "Held items", pocket: "misc",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire"], games: "Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 20000, sell: 5000, cur: "poke-dollar" },
    ],
  },
  "sea-incense": {
    name: "Sea Incense",
    description: "Strengthens the holder's Water-type moves; Azurill hatches from an Egg if Marill or Azumarill holds it while breeding.",
    category: "Type enhancement", pocket: "misc",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["black-white"], games: "Black/White", buy: 9600, sell: 4800, cur: "poke-dollar" },
      { vg: ["sun-moon"], games: "Sun/Moon", buy: 2000, sell: 1000, cur: "poke-dollar" },
    ],
  },
  "lax-incense": {
    name: "Lax Incense",
    description: "Makes the holder harder to hit; Wynaut hatches from an Egg if Wobbuffet holds it while breeding.",
    category: "Held items", pocket: "misc",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["ruby-sapphire", "diamond-pearl"], games: "Ruby/Sapphire, Diamond/Pearl", buy: null, sell: 4800, cur: "poke-dollar" },
      { vg: ["black-white"], games: "Black/White", buy: 9600, sell: 4800, cur: "poke-dollar" },
      { vg: ["sun-moon"], games: "Sun/Moon", buy: 5000, sell: 2500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Overworld", place: "Mt. Pyre", games: "Ruby" },
      ] },
      { vg: "firered-leafgreen", games: "FireRed/LeafGreen", lines: [
        { type: "Overworld", place: "Lost Cave", games: "FireRed" },
      ] },
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Route 225 (Sinnoh)", games: "Diamond" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Shop", place: "Driftveil City", detail: "Driftveil Market · ₱9600 · Post-National Pokédex", games: "Black" },
      ] },
    ],
  },
  "lucky-punch": {
    name: "Lucky Punch",
    description: "Greatly raises Chansey's critical-hit ratio.",
    category: "Species-specific", pocket: "misc",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 40 },
    prices: [
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: null, sell: 5, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "Wild Pokémon", place: "Held by wild Chansey", detail: "Transferred from Generation I", games: "Gold" },
      ] },
    ],
  },
  "metal-powder": {
    name: "Metal Powder",
    description: "Raises Ditto's Defense while it hasn't transformed.",
    category: "Species-specific", pocket: "misc",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 5, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "Transfer", place: "Held by Ditto traded from Generation I" },
      ] },
      { vg: "crystal", games: "Crystal", lines: [
        { type: "Transfer", place: "Held by Ditto traded from Generation I" },
      ] },
    ],
  },
  "thick-club": {
    name: "Thick Club",
    description: "Doubles the Attack of Cubone and Marowak.",
    category: "Species-specific", pocket: "misc",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 90 },
    prices: [
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: null, sell: 250, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "Wild Pokémon", place: "Held by wild Cubone or Marowak", games: "Gold" },
      ] },
      { vg: "firered-leafgreen", games: "FireRed/LeafGreen", lines: [
        { type: "Wild Pokémon", place: "Held by wild Cubone or Marowak", games: "FireRed" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Wild Pokémon", place: "Held by wild Cubone", games: "Ultra Sun" },
      ] },
    ],
  },
  "stick": {
    name: "Leek",
    description: "Greatly raises the critical-hit ratio of Farfetch'd.",
    category: "Species-specific", pocket: "misc",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    fling: { power: 60 },
    prices: [
      { vg: ["gold-silver"], games: "Gold/Silver", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "sword-shield"], games: "Sun/Moon, Sword/Shield", buy: null, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "Wild Pokémon", place: "Held by wild Farfetch'd", games: "Gold" },
      ] },
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Wild Pokémon", place: "Held by wild Farfetch'd", games: "Diamond" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Wild Pokémon", place: "Held by wild Farfetch'd", games: "Sword" },
      ] },
    ],
  },
  "red-scarf": {
    name: "Red Scarf",
    description: "Raises the holder's Coolness in Pokémon Contests.",
    category: "Scarves", pocket: "misc",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["ruby-sapphire", "diamond-pearl", "black-white", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "brilliant-diamond-shining-pearl"], games: "Ruby/Sapphire, Diamond/Pearl, Black/White, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Brilliant Diamond/Shining Pearl", buy: null, sell: 50, cur: "poke-dollar" },
    ],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "NPC Gift", place: "Slateport City", detail: "Pokémon Fan Club chairman · Show a Pokémon with Cool stat of 200 or more", games: "Ruby" },
      ] },
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "NPC Gift", place: "Pastoria City", detail: "Scarf Guy · Show a Pokémon with Cool stat of 200 or more", games: "Diamond" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Slateport City", detail: "Pokémon Fan Club chairman · Show a Pokémon with Cool stat of 200 or more", games: "Omega Ruby" },
      ] },
      { vg: "brilliant-diamond-shining-pearl", games: "Brilliant Diamond/Shining Pearl", lines: [
        { type: "NPC Gift", place: "Pastoria City", detail: "Scarf Guy · Show a Pokémon with Coolness stat of 200 or more", games: "Brilliant Diamond" },
      ] },
    ],
  },
  "blue-scarf": {
    name: "Blue Scarf",
    description: "Raises the holder's Beauty in Pokémon Contests.",
    category: "Scarves", pocket: "misc",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", buy: null, sell: 50, cur: "poke-dollar" },
    ],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "NPC Gift", place: "Slateport City", detail: "Pokémon Fan Club chairman · Show a Pokémon with Beauty of 200 or more" },
      ] },
      { vg: "emerald", games: "Emerald", lines: [
        { type: "NPC Gift", place: "Slateport City", detail: "Pokémon Fan Club chairman · Show a Pokémon with Beauty of 200 or more" },
      ] },
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "NPC Gift", place: "Pastoria City", detail: "Scarf Guy · Show a Pokémon with Beauty of 200 or more" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "NPC Gift", place: "Pastoria City", detail: "Scarf Guy · Show a Pokémon with Beauty of 200 or more" },
      ] },
    ],
  },
  "pink-scarf": {
    name: "Pink Scarf",
    description: "Raises the holder's Cuteness in Pokémon Contests.",
    category: "Scarves", pocket: "misc",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["ruby-sapphire", "emerald"], games: "Ruby/Sapphire, Emerald", buy: null, sell: 50, cur: "poke-dollar" },
    ],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "NPC Gift", place: "Slateport City", detail: "Pokémon Fan Club chairman · Show a Pokémon with Cute stat of 200 or more", games: "Ruby" },
      ] },
    ],
  },
  "green-scarf": {
    name: "Green Scarf",
    description: "Raises the holder's Cleverness in Pokémon Contests.",
    category: "Scarves", pocket: "misc",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["omega-ruby-alpha-sapphire"], games: "Omega Ruby/Alpha Sapphire", buy: null, sell: 50, cur: "poke-dollar" },
    ],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "NPC Gift", place: "Slateport City", detail: "Pokémon Fan Club chairman · Show a Pokémon with Smart stat of 200 or more", games: "Ruby" },
      ] },
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "NPC Gift", place: "Pastoria City", detail: "Scarf Guy · Show a Pokémon with Smart stat of 200 or more", games: "Diamond" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Slateport City", detail: "Pokémon Fan Club chairman · Show a Pokémon with Clever stat of 200 or more", games: "Omega Ruby" },
      ] },
    ],
  },
  "yellow-scarf": {
    name: "Yellow Scarf",
    description: "Raises the holder's Toughness in Pokémon Contests.",
    category: "Scarves", pocket: "misc",
    gens: [3, 4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["ruby-sapphire", "emerald"], games: "Ruby/Sapphire, Emerald", buy: null, sell: 0, cur: "poke-dollar" },
    ],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "NPC Gift", place: "Slateport City", detail: "Pokémon Fan Club chairman · Show a Pokémon with Tough stat of 200 or more", games: "Ruby" },
      ] },
      { vg: "firered-leafgreen", games: "FireRed/LeafGreen", lines: [
        { type: "Exchange", place: "Trade", games: "FireRed" },
      ] },
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "NPC Gift", place: "Pastoria City", detail: "Scarf Guy · Show a Pokémon with Tough stat of 200 or more", games: "Diamond" },
      ] },
    ],
  },
  "wide-lens": {
    name: "Wide Lens",
    description: "A magnifying lens that slightly raises the accuracy of the holder's moves.",
    category: "Held items", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 20000, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Exchange", place: "Veilstone City", detail: "Veilstone Game Corner · 1000 C", games: "Diamond" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Exchange", place: "Goldenrod City", detail: "Goldenrod Game Corner · 1000 C", games: "HeartGold" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "NPC Gift", place: "Castelia City", detail: "Pokémon Center man in black · Having Pokémon from 5 different original Trainers", games: "Black" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Shop", place: "Levincia", detail: "Delibird Presents (Levincia Branch) · ₱20000", games: "Scarlet" },
      ] },
    ],
  },
  "muscle-band": {
    name: "Muscle Band",
    description: "Slightly strengthens the holder's physical moves.",
    category: "Held items", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 8000, sell: 2000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Exchange", place: "Battle Park (Sinnoh)", detail: "Battle Park · 48 BP", games: "Diamond" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Exchange", place: "Battle Frontier (Sinnoh)", detail: "Battle Frontier · 48 BP" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Mom", place: "Purchased by the player's Mom", games: "HeartGold" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Exchange", place: "Battle Subway", detail: "Battle Subway · 48 BP", games: "Black" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Exchange", place: "Pokémon World Tournament", detail: "Battle Subway / PWT · 8 BP", games: "Black 2" },
      ] },
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Exchange", place: "Battle Maison", detail: "Battle Maison · 48 BP", games: "X" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Overworld", place: "Konikoni City", games: "Sun" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Overworld", place: "Hammerlocke", games: "Sword" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Shop", place: "Cascarrafa", detail: "Delibird Presents (Mesagoza Branch) · ₱8000", games: "Scarlet" },
      ] },
    ],
  },
  "wise-glasses": {
    name: "Wise Glasses",
    description: "Slightly strengthens the holder's special moves.",
    category: "Held items", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 8000, sell: 2000, cur: "poke-dollar" },
    ],
  },
  "expert-belt": {
    name: "Expert Belt",
    description: "Slightly boosts the power of the holder's super-effective moves.",
    category: "Held items", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 30000, sell: 7500, cur: "poke-dollar" },
    ],
  },
  "light-clay": {
    name: "Light Clay",
    description: "Makes the holder's Reflect and Light Screen last longer.",
    category: "Held items", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["diamond-pearl", "platinum"], games: "Diamond/Pearl, Platinum", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 20000, sell: 5000, cur: "poke-dollar" },
    ],
  },
  "life-orb": {
    name: "Life Orb",
    description: "Boosts the power of the holder's moves at the cost of a little HP per hit.",
    category: "Held items", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["diamond-pearl", "platinum"], games: "Diamond/Pearl, Platinum", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 50000, sell: 12500, cur: "poke-dollar" },
    ],
  },
  "power-herb": {
    name: "Power Herb",
    description: "Lets the holder use a two-turn move in one turn, then breaks.",
    category: "Held items", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 50, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 30000, sell: 7500, cur: "poke-dollar" },
    ],
  },
  "toxic-orb": {
    name: "Toxic Orb",
    description: "Badly poisons the holder at the end of the turn it is first held in battle.",
    category: "Bad held items", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 30, effect: "Badly poisons the target" },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 15000, sell: 3750, cur: "poke-dollar" },
    ],
  },
  "flame-orb": {
    name: "Flame Orb",
    description: "Burns the holder at the end of the turn it is first held in battle.",
    category: "Bad held items", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 30, effect: "Burns the target" },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 15000, sell: 3750, cur: "poke-dollar" },
    ],
  },
  "quick-powder": {
    name: "Quick Powder",
    description: "Raises Ditto's Speed while it hasn't transformed.",
    category: "Species-specific", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["diamond-pearl", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire"], games: "Diamond/Pearl, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 5, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Wild Pokémon", place: "Held by wild Ditto", games: "Diamond" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Crafting", place: "Poison: 82–90 points", detail: "The Isle of Armor", games: "Sword" },
      ] },
    ],
  },
  "focus-sash": {
    name: "Focus Sash",
    description: "If the holder is at full HP, it survives a knockout blow with 1 HP; then the sash is gone.",
    category: "Held items", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 50000, sell: 12500, cur: "poke-dollar" },
    ],
  },
  "zoom-lens": {
    name: "Zoom Lens",
    description: "The holder's moves are more accurate whenever it acts after its target.",
    category: "Held items", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["diamond-pearl", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire"], games: "Diamond/Pearl, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 10000, sell: 2500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Exchange", place: "Veilstone City", detail: "Veilstone Game Corner · 1000 C" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Exchange", place: "Veilstone City", detail: "Veilstone Game Corner · 1000 C" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Exchange", place: "Goldenrod City", detail: "Goldenrod Game Corner · 1000 C" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Trainer Reward", place: "Castelia City", detail: "Pokémon Center (man in black) · Having Pokémon from 20 different original Trainers" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Shop", place: "Levincia", detail: "Delibird Presents (Levincia Branch) · ₱10000 · After earning 4 Gym Badges" },
      ] },
    ],
  },
  "metronome": {
    name: "Metronome",
    description: "A move's power grows each time the holder uses it consecutively.",
    category: "Held items", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 15000, sell: 3750, cur: "poke-dollar" },
    ],
  },
  "iron-ball": {
    name: "Iron Ball",
    description: "Weighs the holder down, lowering its Speed and grounding it.",
    category: "Bad held items", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 130 },
    prices: [
      { vg: ["diamond-pearl", "platinum"], games: "Diamond/Pearl, Platinum", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 20000, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Stark Mountain", games: "Diamond" },
        { type: "Overworld", place: "Iron Island", games: "Diamond" },
      ] },
    ],
  },
  "lagging-tail": {
    name: "Lagging Tail",
    description: "Forces the holder to move last within its priority bracket.",
    category: "Bad held items", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["diamond-pearl", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 20000, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Route 226 (Sinnoh)" },
      ] },
    ],
  },
  "destiny-knot": {
    name: "Destiny Knot",
    description: "If the holder becomes infatuated, so does the one that charmed it; while breeding, passes down five IVs instead of three.",
    category: "Held items", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["diamond-pearl", "black-white", "x-y", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Black/White, X/Y, Brilliant Diamond/Shining Pearl", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "sword-shield"], games: "Sun/Moon, Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 20000, sell: 5000, cur: "poke-dollar" },
    ],
  },
  "black-sludge": {
    name: "Black Sludge",
    description: "Slowly restores a Poison-type holder's HP each turn but damages any other type.",
    category: "Held items", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 10000, sell: 2500, cur: "poke-dollar" },
    ],
  },
  "icy-rock": {
    name: "Icy Rock",
    description: "Hail or snow the holder summons lasts eight turns instead of five.",
    category: "Held items", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 40 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 8000, sell: 2000, cur: "poke-dollar" },
    ],
  },
  "smooth-rock": {
    name: "Smooth Rock",
    description: "A sandstorm the holder summons lasts eight turns instead of five.",
    category: "Held items", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["diamond-pearl", "platinum"], games: "Diamond/Pearl, Platinum", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 8000, sell: 2000, cur: "poke-dollar" },
    ],
  },
  "heat-rock": {
    name: "Heat Rock",
    description: "Harsh sunlight the holder summons lasts eight turns instead of five.",
    category: "Held items", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 60 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 8000, sell: 2000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Mining", place: "Underground", detail: "Underground" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Mining", place: "Underground", detail: "Underground" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Overworld", place: "Unova Route 8", detail: "Once per day, daytime · Daytime only · Daily item" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Shop", place: "Cascarrafa", detail: "Delibird Presents · ₱8000 · After earning 4 Gym Badges", games: "Scarlet" },
        { type: "Overworld", place: "East Province (Area Three)", detail: "Sparkling overworld item", games: "Violet" },
      ] },
    ],
  },
  "damp-rock": {
    name: "Damp Rock",
    description: "Rain the holder summons lasts eight turns instead of five.",
    category: "Held items", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 60 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 8000, sell: 2000, cur: "poke-dollar" },
    ],
  },
  "grip-claw": {
    name: "Grip Claw",
    description: "Makes the holder's binding moves last a full seven turns.",
    category: "Held items", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 90 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 10000, sell: 2500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Wayward Cave" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Overworld", place: "Wayward Cave" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Overworld", place: "Seafoam Islands" },
      ] },
    ],
  },
  "choice-scarf": {
    name: "Choice Scarf",
    description: "Boosts the holder's Speed by half, but locks it into the first move it uses.",
    category: "Choice", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 100000, sell: 25000, cur: "poke-dollar" },
    ],
  },
  "sticky-barb": {
    name: "Sticky Barb",
    description: "Damages the holder each turn, and clings to any attacker that makes contact.",
    category: "Bad held items", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 10000, sell: 2500, cur: "poke-dollar" },
    ],
  },
  "power-bracer": {
    name: "Power Bracer",
    description: "The holder earns extra Attack effort points from every battle, but its Speed is halved while held.",
    category: "Effort training", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 70 },
    prices: [
      { vg: ["diamond-pearl", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "sword-shield", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield, Brilliant Diamond/Shining Pearl", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 10000, sell: 2500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Exchange", place: "Battle Park (Sinnoh)", detail: "16 BP", games: "Diamond" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Exchange", place: "Battle Frontier (Sinnoh)", detail: "16 BP" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Exchange", place: "Battle Frontier (Johto)", detail: "16 BP", games: "HeartGold" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Exchange", place: "Battle Subway", detail: "16 BP", games: "Black" },
      ] },
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Exchange", place: "Battle Maison", detail: "16 BP", games: "X" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Exchange", place: "Battle Royal Dome", detail: "16 BP", games: "Sun" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Overworld", place: "Poni Coast", games: "Ultra Sun" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Exchange", place: "Hammerlocke", detail: "10 BP · Also available via Wild Area News", games: "Sword" },
      ] },
      { vg: "brilliant-diamond-shining-pearl", games: "Brilliant Diamond/Shining Pearl", lines: [
        { type: "Exchange", place: "Battle Park (Sinnoh)", detail: "10 BP", games: "Brilliant Diamond" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Shop", place: "Delibird Presents", detail: "₱10000", games: "Scarlet" },
      ] },
    ],
  },
  "power-belt": {
    name: "Power Belt",
    description: "The holder earns extra Defense effort points from every battle, but its Speed is halved while held.",
    category: "Effort training", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 70 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "sword-shield", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield, Brilliant Diamond/Shining Pearl", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 10000, sell: 2500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Exchange", place: "Battle Park (Sinnoh)", detail: "16 BP", games: "Diamond" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Exchange", place: "Battle Frontier (Sinnoh)", detail: "16 BP" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Exchange", place: "Battle Frontier (Johto)", detail: "16 BP", games: "HeartGold" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Exchange", place: "Battle Subway", detail: "16 BP", games: "Black" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Exchange", place: "Battle Subway", detail: "or Pokémon World Tournament · 16 BP", games: "Black 2" },
        { type: "Overworld", place: "Plasma Frigate", games: "White 2" },
      ] },
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Exchange", place: "Battle Maison", detail: "16 BP", games: "X" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Exchange", place: "Battle Royal Dome", detail: "16 BP", games: "Sun" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Overworld", place: "Royal Avenue", games: "Ultra Moon" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Exchange", place: "Hammerlocke", detail: "10 BP", games: "Sword" },
      ] },
      { vg: "brilliant-diamond-shining-pearl", games: "Brilliant Diamond/Shining Pearl", lines: [
        { type: "Exchange", place: "Battle Park (Sinnoh)", detail: "10 BP", games: "Brilliant Diamond" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Shop", place: "Delibird Presents", detail: "₱10000", games: "Scarlet" },
      ] },
    ],
  },
  "power-lens": {
    name: "Power Lens",
    description: "The holder earns extra Sp. Atk effort points from every battle, but its Speed is halved while held.",
    category: "Effort training", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 70 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "sword-shield", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield, Brilliant Diamond/Shining Pearl", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 10000, sell: 2500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Exchange", place: "Battle Park (Sinnoh)", detail: "16 BP", games: "Diamond" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Exchange", place: "Battle Frontier (Sinnoh)", detail: "16 BP" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Overworld", place: "Unova Route 13", games: "Black 2" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Shop", place: "Delibird Presents", detail: "₱10000" },
      ] },
    ],
  },
  "power-band": {
    name: "Power Band",
    description: "The holder earns extra Sp. Def effort points from every battle, but its Speed is halved while held.",
    category: "Effort training", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 70 },
    prices: [
      { vg: ["diamond-pearl"], games: "Diamond/Pearl", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 10000, sell: 2500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Exchange", place: "Battle Park (Sinnoh)", detail: "16 BP", games: "Diamond" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Exchange", place: "Battle Frontier (Sinnoh)", detail: "16 BP" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Exchange", place: "Battle Frontier (Johto)", detail: "16 BP", games: "HeartGold" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Exchange", place: "Battle Subway", detail: "16 BP", games: "Black" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Shop", place: "Delibird Presents", detail: "₱10000", games: "Scarlet" },
      ] },
    ],
  },
  "power-anklet": {
    name: "Power Anklet",
    description: "The holder earns extra Speed effort points from every battle, but its Speed is halved while held.",
    category: "Effort training", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 70 },
    prices: [
      { vg: ["diamond-pearl"], games: "Diamond/Pearl", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 10000, sell: 2500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Exchange", place: "Battle Park (Sinnoh)", detail: "16 BP", games: "Diamond" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Exchange", place: "Battle Frontier (Sinnoh)", detail: "16 BP" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Exchange", place: "Battle Subway", detail: "16 BP", games: "Black" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Shop", place: "Delibird Presents", detail: "₱10000" },
      ] },
    ],
  },
  "power-weight": {
    name: "Power Weight",
    description: "The holder earns extra HP effort points from every battle, but its Speed is halved while held.",
    category: "Effort training", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 70 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "sword-shield", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield, Brilliant Diamond/Shining Pearl", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 10000, sell: 2500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Exchange", place: "Battle Park (Sinnoh)", detail: "16 BP", games: "Diamond" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Exchange", place: "Battle Frontier (Sinnoh)", detail: "16 BP" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Shop", place: "Delibird Presents", detail: "₱10000" },
      ] },
    ],
  },
  "shed-shell": {
    name: "Shed Shell",
    description: "Lets the holder switch out even when trapped.",
    category: "Held items", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 50, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 20000, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Route 228 (Sinnoh)", games: "Diamond" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Overworld", place: "Route 228 (Sinnoh)" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Contest", place: "Bug-Catching Contest consolation prize", games: "HeartGold" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Overworld", place: "Route 5 - Galar", games: "Sword" },
        { type: "Overworld", place: "Dappled Grove", detail: "Hidden recurring item", games: "Sword" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Shop", place: "Cascarrafa", detail: "Delibird Presents (Cascarrafa Branch) · ₱20000 · After earning 4 Gym Badges", games: "Scarlet" },
      ] },
    ],
  },
  "big-root": {
    name: "Big Root",
    description: "Boosts the HP the holder recovers from draining moves.",
    category: "Held items", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["diamond-pearl", "platinum"], games: "Diamond/Pearl, Platinum", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 10000, sell: 2500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Route 214 (Sinnoh)", games: "Diamond" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Overworld", place: "Route 03 (Kanto)", games: "HeartGold" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Overworld", place: "Pinwheel Forest", games: "Black" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Shop", place: "Cascarrafa", detail: "Delibird Presents · ₱10000", games: "Scarlet" },
      ] },
    ],
  },
  "choice-specs": {
    name: "Choice Specs",
    description: "Boosts the holder's Sp. Atk by half, but locks it into the first move it uses.",
    category: "Choice", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 100000, sell: 25000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Celestic Town", detail: "Morning", games: "Diamond" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Overworld", place: "Lake of Rage", games: "HeartGold" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Exchange", place: "Battle Subway", detail: "48 BP", games: "Black" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Shop", place: "Mesagoza", detail: "Delibird Presents (after completing the main storyline) · ₱100000 · After completing the main storyline", games: "Scarlet" },
      ] },
    ],
  },
  "flame-plate": {
    name: "Flame Plate",
    description: "Strengthens the holder's Fire-type moves; Arceus becomes Fire-type while holding it.",
    category: "Plates", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 90 },
    prices: [
      { vg: ["diamond-pearl", "black-white", "x-y", "sun-moon", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Black/White, X/Y, Sun/Moon, Brilliant Diamond/Shining Pearl", buy: null, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Stark Mountain", games: "Diamond" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "NPC Gift", place: "S.S. Aqua", detail: "Captain · After obtaining all 16 Gym Badges", games: "HeartGold" },
      ] },
      { vg: "legends-arceus", games: "Legends: Arceus", lines: [
        { type: "Story", place: "Molten Arena", detail: "Reward for defeating Noble Hisuian Arcanine · Mission 10: The Lordless Island" },
      ] },
    ],
  },
  "splash-plate": {
    name: "Splash Plate",
    description: "Strengthens the holder's Water-type moves; Arceus becomes Water-type while holding it.",
    category: "Plates", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 90 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: 10000, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Route 220 (Sinnoh)" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Overworld", place: "Route 220 (Sinnoh)" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "NPC Gift", place: "S.S. Aqua", detail: "Captain · After obtaining all 16 Gym Badges" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Auction", place: "Porto Marinada", detail: "If the player owns an Arceus" },
      ] },
    ],
  },
  "zap-plate": {
    name: "Zap Plate",
    description: "Strengthens the holder's Electric-type moves; Arceus becomes Electric-type while holding it.",
    category: "Plates", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 90 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: 10000, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Sunyshore City", games: "Diamond" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Overworld", place: "Sunyshore City" },
      ] },
      { vg: "legends-arceus", games: "Legends: Arceus", lines: [
        { type: "Story", place: "Moonview Arena", detail: "Reward for defeating noble Hisuian Electrode · Mission 11: Scaling Perilous Heights" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Auction", place: "Porto Marinada", detail: "If the player owns an Arceus" },
      ] },
    ],
  },
  "meadow-plate": {
    name: "Meadow Plate",
    description: "Strengthens the holder's Grass-type moves; Arceus becomes Grass-type while holding it.",
    category: "Plates", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 90 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", buy: null, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Route 210 (Sinnoh)", games: "Diamond" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Overworld", place: "Route 210 (Sinnoh)" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "NPC Gift", place: "S.S. Aqua", detail: "Captain · After obtaining all 16 Gym Badges", games: "HeartGold" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Overworld", place: "Abyssal Ruins", games: "Black" },
      ] },
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Overworld", place: "Kalos Route 20", games: "X" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Hoenn Route 130", detail: "Underwater", games: "Omega Ruby" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Shop", place: "Hau'oli City", detail: "Shopping District", games: "Sun" },
      ] },
      { vg: "brilliant-diamond-shining-pearl", games: "Brilliant Diamond/Shining Pearl", lines: [
        { type: "Overworld", place: "Route 210 (Sinnoh)", games: "Brilliant Diamond" },
        { type: "Mining", games: "Brilliant Diamond" },
      ] },
      { vg: "legends-arceus", games: "Legends: Arceus", lines: [
        { type: "Story", place: "Brava Arena", detail: "Reward for defeating Hisuian Lilligant · Mission 8: Arezu's Predicament" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Auction", place: "Porto Marinada", detail: "If the player owns an Arceus", games: "Scarlet" },
      ] },
    ],
  },
  "icicle-plate": {
    name: "Icicle Plate",
    description: "Strengthens the holder's Ice-type moves; Arceus becomes Ice-type while holding it.",
    category: "Plates", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 90 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", buy: null, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Route 217 (Sinnoh)", games: "Diamond" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Overworld", place: "Route 217 (Sinnoh)" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "NPC Gift", place: "S.S. Aqua", detail: "From the captain after obtaining all 16 Gym Badges · After obtaining all 16 Gym Badges" },
      ] },
      { vg: "legends-arceus", games: "Legends: Arceus", lines: [
        { type: "Story", place: "Icepeak Arena", detail: "Reward for defeating the noble Hisuian Avalugg during Mission 12 · Mission 12: The Slumbering Lord of the Tundra" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Auction", place: "Porto Marinada", detail: "If the player owns an Arceus" },
      ] },
    ],
  },
  "fist-plate": {
    name: "Fist Plate",
    description: "Strengthens the holder's Fighting-type moves; Arceus becomes Fighting-type while holding it.",
    category: "Plates", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 90 },
    prices: [
      { vg: ["diamond-pearl"], games: "Diamond/Pearl", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["sun-moon"], games: "Sun/Moon", buy: 10000, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Route 215 (Sinnoh)", games: "Diamond" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "NPC Gift", place: "S.S. Aqua", detail: "Captain · After obtaining all 16 Gym Badges", games: "HeartGold" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Overworld", place: "Abyssal Ruins", games: "Black" },
      ] },
      { vg: "legends-arceus", games: "Legends: Arceus", lines: [
        { type: "Story", place: "Prelude Beach", detail: "Mission 25 reward from Kamado · After defeating Kamado" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Auction", place: "Porto Marinada", detail: "If the player owns an Arceus", games: "Scarlet" },
      ] },
    ],
  },
  "toxic-plate": {
    name: "Toxic Plate",
    description: "Strengthens the holder's Poison-type moves; Arceus becomes Poison-type while holding it.",
    category: "Plates", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 90 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", buy: null, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Great Marsh", games: "Diamond" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Overworld", place: "Great Marsh" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "NPC Gift", place: "S.S. Aqua", detail: "Captain · After obtaining all 16 Gym Badges", games: "HeartGold" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Overworld", place: "Abyssal Ruins", games: "Black" },
      ] },
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Overworld", place: "Kalos Route 19", games: "X" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Hoenn Route 129", detail: "Underwater", games: "Omega Ruby" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Shop", place: "Hau'oli City", detail: "Shopping District", games: "Sun" },
      ] },
      { vg: "legends-arceus", games: "Legends: Arceus", lines: [
        { type: "Story", place: "Clamberclaw Cliffs", detail: "Reward from Sneasler during Mission 11 · Mission 11: Scaling Perilous Heights" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Auction", place: "Porto Marinada", detail: "If the player owns an Arceus", games: "Scarlet" },
      ] },
    ],
  },
  "earth-plate": {
    name: "Earth Plate",
    description: "Strengthens the holder's Ground-type moves; Arceus becomes Ground-type while holding it.",
    category: "Plates", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 90 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", buy: null, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Oreburgh Gate", games: "Diamond" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "NPC Gift", place: "S.S. Aqua", detail: "Captain · After obtaining all 16 Gym Badges", games: "HeartGold" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Overworld", place: "Abyssal Ruins", games: "Black" },
      ] },
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Overworld", place: "Reflection Cave", games: "X" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Hoenn Route 130", detail: "Underwater", games: "Omega Ruby" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Overworld", place: "Alola Route 1", games: "Sun" },
      ] },
      { vg: "brilliant-diamond-shining-pearl", games: "Brilliant Diamond/Shining Pearl", lines: [
        { type: "Overworld", place: "Oreburgh Gate", games: "Brilliant Diamond" },
        { type: "Mining", games: "Brilliant Diamond" },
      ] },
      { vg: "legends-arceus", games: "Legends: Arceus", lines: [
        { type: "Story", place: "Sludge Mound", detail: "Mission 8: Arezu's Predicament · After defeating Ursaluna" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Auction", place: "Porto Marinada", detail: "If the player owns an Arceus", games: "Scarlet" },
      ] },
    ],
  },
  "sky-plate": {
    name: "Sky Plate",
    description: "Strengthens the holder's Flying-type moves; Arceus becomes Flying-type while holding it.",
    category: "Plates", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 90 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: 10000, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Story", place: "Pokémon League (Sinnoh)", games: "Diamond" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Mining", place: "Underground" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "NPC Gift", place: "S.S. Aqua", detail: "Captain · After obtaining all 16 Gym Badges", games: "HeartGold" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Overworld", place: "Abyssal Ruins", games: "Black" },
      ] },
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Overworld", place: "Coumarine City", games: "X" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Hoenn Route 124", detail: "Underwater", games: "Omega Ruby" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Shop", place: "Hau'oli City", detail: "Hau'oli City Mall – Antiquities of the Ages · ₱10000", games: "Sun" },
      ] },
      { vg: "brilliant-diamond-shining-pearl", games: "Brilliant Diamond/Shining Pearl", lines: [
        { type: "Overworld", place: "Pokémon League (Sinnoh)", games: "Brilliant Diamond" },
      ] },
      { vg: "legends-arceus", games: "Legends: Arceus", lines: [
        { type: "Story", place: "Snowpoint Temple", detail: "Mission 12 reward · After defeating Hisuian Braviary" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Auction", place: "Porto Marinada", detail: "Auction house · If the player owns an Arceus", games: "Scarlet" },
      ] },
    ],
  },
  "mind-plate": {
    name: "Mind Plate",
    description: "Strengthens the holder's Psychic-type moves; Arceus becomes Psychic-type while holding it.",
    category: "Plates", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 90 },
    prices: [
      { vg: ["diamond-pearl", "black-white", "x-y", "sun-moon", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Black/White, X/Y, Sun/Moon, Brilliant Diamond/Shining Pearl", buy: null, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Solaceon Ruins", games: "Diamond" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "NPC Gift", place: "S.S. Aqua", detail: "Captain · After obtaining all 16 Gym Badges", games: "HeartGold" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Auction", place: "Porto Marinada", detail: "If the player owns an Arceus", games: "Scarlet" },
      ] },
    ],
  },
  "insect-plate": {
    name: "Insect Plate",
    description: "Strengthens the holder's Bug-type moves; Arceus becomes Bug-type while holding it.",
    category: "Plates", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 90 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", buy: null, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Eterna Forest" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Overworld", place: "Eterna Forest" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "NPC Gift", place: "S.S. Aqua", detail: "Captain after obtaining all 16 Gym Badges · After obtaining all 16 Gym Badges" },
      ] },
      { vg: "legends-arceus", games: "Legends: Arceus", lines: [
        { type: "Story", place: "Grandtree Arena", detail: "Reward for defeating Noble Kleavor during Mission 7" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Auction", place: "Porto Marinada", detail: "If the player owns an Arceus" },
      ] },
    ],
  },
  "stone-plate": {
    name: "Stone Plate",
    description: "Strengthens the holder's Rock-type moves; Arceus becomes Rock-type while holding it.",
    category: "Plates", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 90 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: 10000, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Mount Coronet" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Overworld", place: "Mount Coronet" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "NPC Gift", place: "S.S. Aqua", detail: "Captain · After obtaining all 16 Gym Badges" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Overworld", place: "Abyssal Ruins" },
      ] },
    ],
  },
  "spooky-plate": {
    name: "Spooky Plate",
    description: "Strengthens the holder's Ghost-type moves; Arceus becomes Ghost-type while holding it.",
    category: "Plates", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 90 },
    prices: [
      { vg: ["diamond-pearl"], games: "Diamond/Pearl", buy: null, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Amity Square", games: "Diamond" },
      ] },
    ],
  },
  "draco-plate": {
    name: "Draco Plate",
    description: "Strengthens the holder's Dragon-type moves; Arceus becomes Dragon-type while holding it.",
    category: "Plates", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 90 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", buy: null, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Eterna City", detail: "Also obtainable Underground" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Overworld", place: "Eterna City", detail: "Also obtainable Underground" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "NPC Gift", place: "S.S. Aqua", detail: "Captain (after all 16 Badges) · After obtaining all 16 Gym Badges" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Overworld", place: "Unova Route 13" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Overworld", place: "Undella Bay" },
      ] },
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Overworld", place: "Kalos Route 22" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Hoenn Route 128", detail: "Underwater" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Overworld", place: "Hau'oli City", detail: "Shopping District" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Overworld", place: "Hau'oli City", detail: "Shopping District" },
      ] },
      { vg: "brilliant-diamond-shining-pearl", games: "Brilliant Diamond/Shining Pearl", lines: [
        { type: "Overworld", place: "Eterna City", detail: "Also obtainable in Grand Underground" },
      ] },
      { vg: "legends-arceus", games: "Legends: Arceus", lines: [
        { type: "Story", place: "Lake Verity", detail: "Mission 21 reward · Reward for catching Uxie, Mesprit, and Azelf" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Auction", place: "Porto Marinada", detail: "Auction · If the player owns an Arceus" },
      ] },
    ],
  },
  "dread-plate": {
    name: "Dread Plate",
    description: "Strengthens the holder's Dark-type moves; Arceus becomes Dark-type while holding it.",
    category: "Plates", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 90 },
    prices: [
      { vg: ["diamond-pearl", "platinum"], games: "Diamond/Pearl, Platinum", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: 10000, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Old Chateau", games: "Diamond" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "NPC Gift", place: "S.S. Aqua", detail: "Captain · After obtaining all 16 Gym Badges", games: "HeartGold" },
      ] },
      { vg: "legends-arceus", games: "Legends: Arceus", lines: [
        { type: "Story", place: "Moonview Arena", detail: "Mission 23 reward for catching Cresselia" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Auction", place: "Porto Marinada", detail: "If the player owns an Arceus", games: "Scarlet" },
      ] },
    ],
  },
  "iron-plate": {
    name: "Iron Plate",
    description: "Strengthens the holder's Steel-type moves; Arceus becomes Steel-type while holding it.",
    category: "Plates", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 90 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: 10000, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Iron Island" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Overworld", place: "Iron Island" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "NPC Gift", place: "S.S. Aqua", detail: "Captain · After obtaining all 16 Gym Badges" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Overworld", place: "Abyssal Ruins" },
      ] },
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Overworld", place: "Terminus Cave" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Mossdeep City", detail: "Steven's Beldum" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Shop", place: "Hau'oli City", detail: "Antiquities of the Ages · ₱10000" },
      ] },
      { vg: "brilliant-diamond-shining-pearl", games: "Brilliant Diamond/Shining Pearl", lines: [
        { type: "Overworld", place: "Iron Island" },
      ] },
      { vg: "legends-arceus", games: "Legends: Arceus", lines: [
        { type: "Story", place: "Lava Dome Sanctum", detail: "Mission 22 reward · After catching Heatran" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Auction", place: "Porto Marinada", detail: "If the player owns an Arceus" },
      ] },
    ],
  },
  "odd-incense": {
    name: "Odd Incense",
    description: "Strengthens the holder's Psychic-type moves; Mime Jr. hatches from an Egg if Mr. Mime holds it while breeding.",
    category: "Type enhancement", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["diamond-pearl"], games: "Diamond/Pearl", buy: null, sell: 4800, cur: "poke-dollar" },
      { vg: ["black-white"], games: "Black/White", buy: 9600, sell: 4800, cur: "poke-dollar" },
      { vg: ["sun-moon"], games: "Sun/Moon", buy: 2000, sell: 1000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Solaceon Ruins", games: "Diamond" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Overworld", place: "Cerulean Cave", games: "HeartGold" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Shop", place: "Driftveil City", detail: "Driftveil Market · ₱9600 · Post-National Pokédex", games: "Black" },
      ] },
    ],
  },
  "rock-incense": {
    name: "Rock Incense",
    description: "Strengthens the holder's Rock-type moves; Bonsly hatches from an Egg if Sudowoodo holds it while breeding.",
    category: "Type enhancement", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["diamond-pearl"], games: "Diamond/Pearl", buy: null, sell: 4800, cur: "poke-dollar" },
      { vg: ["black-white"], games: "Black/White", buy: 9600, sell: 4800, cur: "poke-dollar" },
      { vg: ["sun-moon"], games: "Sun/Moon", buy: 2000, sell: 1000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Fuego Ironworks", games: "Diamond" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Overworld", place: "Diglett's Cave", games: "HeartGold" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Shop", place: "Driftveil City", detail: "Driftveil Market · ₱9600 · Post-National Pokédex", games: "Black" },
      ] },
    ],
  },
  "full-incense": {
    name: "Full Incense",
    description: "Makes the holder move last; Munchlax hatches from an Egg if Snorlax holds it while breeding.",
    category: "Bad held items", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: null, sell: 4800, cur: "poke-dollar" },
      { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire", buy: 9600, sell: 4800, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: 5000, sell: 2500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Veilstone City" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Overworld", place: "Veilstone City" },
      ] },
    ],
  },
  "wave-incense": {
    name: "Wave Incense",
    description: "Strengthens the holder's Water-type moves; Mantyke hatches from an Egg if Mantine holds it while breeding.",
    category: "Type enhancement", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: null, sell: 4800, cur: "poke-dollar" },
      { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire", buy: 9600, sell: 4800, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: 2000, sell: 1000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Route 210 (Sinnoh)", games: "Diamond" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Overworld", place: "Route 210 (Sinnoh)" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Overworld", place: "Route 47 (Johto)" },
      ] },
    ],
  },
  "rose-incense": {
    name: "Rose Incense",
    description: "Strengthens the holder's Grass-type moves; Budew hatches from an Egg if Roselia or Roserade holds it while breeding.",
    category: "Type enhancement", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: null, sell: 4800, cur: "poke-dollar" },
      { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire", buy: 9600, sell: 4800, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: 2000, sell: 1000, cur: "poke-dollar" },
    ],
  },
  "luck-incense": {
    name: "Luck Incense",
    description: "Doubles the prize money from a battle if the holder takes part.",
    category: "Training", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: null, sell: 4800, cur: "poke-dollar" },
      { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire", buy: 9600, sell: 4800, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: 11000, sell: 5500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Ravaged Path" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Overworld", place: "Ravaged Path" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "NPC Gift", place: "Vermilion City" },
      ] },
    ],
  },
  "pure-incense": {
    name: "Pure Incense",
    description: "Wild Pokémon show up less often while the holder leads the party; Chingling hatches from an Egg if Chimecho holds it while breeding.",
    category: "Training", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: null, sell: 4800, cur: "poke-dollar" },
      { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire", buy: 9600, sell: 4800, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: 6000, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Route 221 (Sinnoh)" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Overworld", place: "Route 221 (Sinnoh)" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Overworld", place: "Mt. Silver" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Shop", place: "Driftveil City", detail: "Driftveil Market · ₱9600 · Post-National Pokédex" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Shop", place: "Driftveil City", detail: "Driftveil Market · ₱9600" },
      ] },
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Shop", place: "Coumarine City", detail: "Incense shop · ₱9600" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Shop", place: "Slateport City", detail: "Market · ₱9600" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Shop", place: "Konikoni City", detail: "Incense stall · ₱6000" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Shop", place: "Konikoni City", detail: "Incense stall · ₱6000" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Shop", place: "Hulbury", detail: "Incense merchant · ₱6000" },
      ] },
      { vg: "brilliant-diamond-shining-pearl", games: "Brilliant Diamond/Shining Pearl", lines: [
        { type: "Overworld", place: "Route 221 (Sinnoh)" },
      ] },
    ],
  },
  "protector": {
    name: "Protector",
    description: "A stiff, heavy piece of protective gear; Rhydon evolves into Rhyperior when traded holding it.",
    category: "Evolution", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["diamond-pearl", "platinum"], games: "Diamond/Pearl, Platinum", buy: null, sell: 1050, cur: "poke-dollar" },
      { vg: ["black-2-white-2", "legends-arceus"], games: "Black 2/White 2, Legends: Arceus", buy: 10000, sell: null, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: null, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Route 228 (Sinnoh)", games: "Diamond" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Overworld", place: "Mt. Mortar", games: "HeartGold" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Overworld", place: "Unova Route 11", games: "Black" },
      ] },
    ],
  },
  "electirizer": {
    name: "Electirizer",
    description: "A box packed with electricity; Electabuzz evolves into Electivire when traded holding it.",
    category: "Evolution", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 1050, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield", "scarlet-violet"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield, Scarlet/Violet", buy: null, sell: 1000, cur: "poke-dollar" },
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: 10000, sell: 500, cur: "poke-dollar" },
    ],
  },
  "magmarizer": {
    name: "Magmarizer",
    description: "A box packed with magma energy; Magmar evolves into Magmortar when traded holding it.",
    category: "Evolution", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 1050, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield", "scarlet-violet"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield, Scarlet/Violet", buy: null, sell: 1000, cur: "poke-dollar" },
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: 10000, sell: 500, cur: "poke-dollar" },
    ],
  },
  "dubious-disc": {
    name: "Dubious Disc",
    description: "A transparent disc full of strange data; Porygon2 evolves into Porygon-Z when traded holding it.",
    category: "Evolution", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 50 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "black-white"], games: "Diamond/Pearl, Platinum, Black/White", buy: null, sell: 1050, cur: "poke-dollar" },
      { vg: ["black-2-white-2"], games: "Black 2/White 2", buy: 60000, sell: null, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 1000, cur: "poke-dollar" },
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: null, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Route 225 (Sinnoh)", games: "Diamond" },
      ] },
    ],
  },
  "reaper-cloth": {
    name: "Reaper Cloth",
    description: "A cloth steeped in spiritual energy; Dusclops evolves into Dusknoir when traded holding it.",
    category: "Evolution", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 1050, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 1000, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: 1000, cur: "poke-dollar" },
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: 10000, sell: 500, cur: "poke-dollar" },
    ],
  },
  "razor-claw": {
    name: "Razor Claw",
    description: "Raises the holder's critical-hit ratio, and evolves Sneasel when it levels up holding it at night.",
    category: "Held items", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: null, sell: 1050, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 2500, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: null, cur: "poke-dollar" },
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: 10000, sell: null, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 15000, sell: null, cur: "poke-dollar" },
    ],
  },
  "razor-fang": {
    name: "Razor Fang",
    description: "The holder's damaging moves may make the target flinch, and evolves Gligar when it levels up holding it at night.",
    category: "Held items", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 30, effect: "Target will flinch if it has not yet gone this turn" },
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", buy: null, sell: 1050, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 2500, cur: "poke-dollar" },
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: 10000, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Exchange", place: "Battle Park (Sinnoh)", detail: "48 BP", games: "Diamond" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Exchange", place: "Battle Frontier (Sinnoh)", detail: "48 BP" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Overworld", place: "Abundant Shrine", games: "Black" },
      ] },
    ],
  },
  "tm01": {
    name: "TM01",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: 3000, sell: 1500, cur: "poke-dollar" },
      { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald", "firered-leafgreen", "brilliant-diamond-shining-pearl"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald, FireRed/LeafGreen, Brilliant Diamond/Shining Pearl", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["omega-ruby-alpha-sapphire"], games: "Omega Ruby/Alpha Sapphire", buy: 5000, sell: null, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 40000, sell: null, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 400, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Shop", place: "Celadon City", detail: "Celadon Department Store · ₱3000", games: "Red" },
        { type: "Overworld", place: "Mt. Moon", games: "Red" },
      ] },
    ],
  },
  "tm02": {
    name: "TM02",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue", "yellow", "gold-silver", "crystal"], games: "Red/Blue, Yellow, Gold/Silver, Crystal", buy: 2000, sell: 1000, cur: "poke-dollar" },
      { vg: ["ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 400, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Shop", place: "Celadon City", detail: "Celadon Department Store · ₱2000", games: "Red" },
      ] },
    ],
  },
  "tm03": {
    name: "TM03",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: null, sell: 1000, cur: "poke-dollar" },
      { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum", buy: null, sell: 1500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Story", place: "Silph Co.", games: "Red" },
      ] },
    ],
  },
  "tm04": {
    name: "TM04",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue"], games: "Red/Blue", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["gold-silver"], games: "Gold/Silver", buy: null, sell: 1000, cur: "poke-dollar" },
      { vg: ["ruby-sapphire"], games: "Ruby/Sapphire", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["diamond-pearl"], games: "Diamond/Pearl", buy: null, sell: 750, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Overworld", place: "Route 04 (Kanto)", games: "Red" },
      ] },
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "Overworld", place: "Route 35 (Johto)", games: "Gold" },
      ] },
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Trainer Reward", place: "Defeat Tate and Liza", games: "Ruby" },
      ] },
    ],
  },
  "tm05": {
    name: "TM05",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: 3000, sell: 1500, cur: "poke-dollar" },
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["firered-leafgreen"], games: "FireRed/LeafGreen", buy: 1000, sell: 500, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 50000, sell: null, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Shop", place: "Celadon City", detail: "Celadon Department Store · ₱3000", games: "Red" },
      ] },
    ],
  },
  "tm06": {
    name: "TM06",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 400, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Trainer Reward", place: "Defeat Koga", detail: "Soul Badge Badge", games: "Red" },
      ] },
    ],
  },
  "tm07": {
    name: "TM07",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: 2000, sell: 1000, cur: "poke-dollar" },
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: null, sell: 1000, cur: "poke-dollar" },
      { vg: ["ruby-sapphire", "emerald", "diamond-pearl", "platinum"], games: "Ruby/Sapphire, Emerald, Diamond/Pearl, Platinum", buy: null, sell: 1500, cur: "poke-dollar" },
    ],
  },
  "tm08": {
    name: "TM08",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: 1000, sell: 500, cur: "poke-dollar" },
      { vg: ["ruby-sapphire", "emerald", "firered-leafgreen"], games: "Ruby/Sapphire, Emerald, FireRed/LeafGreen", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", buy: null, sell: 750, cur: "poke-dollar" },
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: 48, sell: null, cur: "battle-point" },
      { vg: ["black-2-white-2"], games: "Black 2/White 2", buy: 80000, sell: null, cur: "poke-dollar" },
      { vg: ["sun-moon"], games: "Sun/Moon", buy: 10000, sell: null, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 50000, sell: null, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 800, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 800, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Overworld", place: "S.S. Anne" },
      ] },
      { vg: "yellow", games: "Yellow", lines: [
        { type: "Overworld", place: "S.S. Anne" },
      ] },
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "Shop", place: "Goldenrod City", detail: "Goldenrod Department Store · ₱1000" },
      ] },
      { vg: "crystal", games: "Crystal", lines: [
        { type: "Shop", place: "Goldenrod City", detail: "Goldenrod Department Store · ₱1000" },
      ] },
    ],
  },
  "tm09": {
    name: "TM09",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: 3000, sell: 1500, cur: "poke-dollar" },
      { vg: ["omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", buy: 10000, sell: null, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 50000, sell: null, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Shop", place: "Celadon City", detail: "Celadon Department Store · ₱3000" },
      ] },
      { vg: "yellow", games: "Yellow", lines: [
        { type: "Shop", place: "Celadon City", detail: "Celadon Department Store · ₱3000" },
      ] },
    ],
  },
  "tm10": {
    name: "TM10",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald", buy: 3000, sell: 1500, cur: "poke-dollar" },
      { vg: ["brilliant-diamond-shining-pearl"], games: "Brilliant Diamond/Shining Pearl", buy: 1500, sell: 750, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Overworld", place: "Team Rocket Hideout", games: "Red" },
      ] },
    ],
  },
  "tm11": {
    name: "TM11",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: 2000, sell: 1000, cur: "poke-dollar" },
      { vg: ["black-white", "x-y", "sun-moon"], games: "Black/White, X/Y, Sun/Moon", buy: 50000, sell: null, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Trainer Reward", place: "Cerulean City", detail: "Prize for defeating Misty", games: "Red" },
      ] },
    ],
  },
  "tm12": {
    name: "TM12",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue", "yellow", "gold-silver", "crystal"], games: "Red/Blue, Yellow, Gold/Silver, Crystal", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["ruby-sapphire", "emerald", "firered-leafgreen"], games: "Ruby/Sapphire, Emerald, FireRed/LeafGreen", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["diamond-pearl", "platinum"], games: "Diamond/Pearl, Platinum", buy: null, sell: 750, cur: "poke-dollar" },
      { vg: ["heartgold-soulsilver"], games: "HeartGold/SoulSilver", buy: 1500, sell: 750, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 50000, sell: null, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 400, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Overworld", place: "Mt. Moon" },
      ] },
      { vg: "yellow", games: "Yellow", lines: [
        { type: "Overworld", place: "Mt. Moon" },
      ] },
    ],
  },
  "tm13": {
    name: "TM13",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  },
  "tm14": {
    name: "TM14",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue"], games: "Red/Blue", buy: null, sell: 2500, cur: "poke-dollar" },
      { vg: ["gold-silver"], games: "Gold/Silver", buy: 5500, sell: null, cur: "coin" },
      { vg: ["gold-silver"], games: "Gold/Silver", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["ruby-sapphire", "brilliant-diamond-shining-pearl"], games: "Ruby/Sapphire, Brilliant Diamond/Shining Pearl", buy: 5500, sell: 2750, cur: "poke-dollar" },
      { vg: ["black-white", "x-y"], games: "Black/White, X/Y", buy: 70000, sell: null, cur: "poke-dollar" },
      { vg: ["omega-ruby-alpha-sapphire", "sun-moon"], games: "Omega Ruby/Alpha Sapphire, Sun/Moon", buy: 30000, sell: null, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Overworld", place: "Pokémon Mansion (Kanto)", games: "Red" },
      ] },
    ],
  },
  "tm15": {
    name: "TM15",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: null, sell: 2500, cur: "poke-dollar" },
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: 5500, sell: null, cur: "coin" },
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: 7500, sell: null, cur: "coin" },
      { vg: ["ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "brilliant-diamond-shining-pearl"], games: "Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, Brilliant Diamond/Shining Pearl", buy: 7500, sell: 3750, cur: "poke-dollar" },
      { vg: ["black-white", "black-2-white-2", "x-y"], games: "Black/White, Black 2/White 2, X/Y", buy: 90000, sell: null, cur: "poke-dollar" },
      { vg: ["omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", buy: 50000, sell: null, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Shop", place: "Celadon Game Corner", detail: "5500 C", games: "Red" },
      ] },
    ],
  },
  "tm16": {
    name: "TM16",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["ruby-sapphire", "emerald"], games: "Ruby/Sapphire, Emerald", buy: 3000, sell: 1500, cur: "poke-dollar" },
      { vg: ["diamond-pearl", "platinum", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, Brilliant Diamond/Shining Pearl", buy: 2000, sell: 1000, cur: "poke-dollar" },
      { vg: ["black-white", "x-y"], games: "Black/White, X/Y", buy: 30000, sell: null, cur: "poke-dollar" },
      { vg: ["omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", buy: 10000, sell: null, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Overworld", place: "Route 12 (Kanto)", games: "Red" },
      ] },
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "Trainer Reward", place: "Mahogany Town Gym", detail: "Defeat Pryce · Glacier Badge Badge", games: "Gold" },
      ] },
    ],
  },
  "tm17": {
    name: "TM17",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue", "yellow", "gold-silver", "crystal", "ruby-sapphire", "emerald"], games: "Red/Blue, Yellow, Gold/Silver, Crystal, Ruby/Sapphire, Emerald", buy: 3000, sell: 1500, cur: "poke-dollar" },
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", buy: 2000, sell: 1000, cur: "poke-dollar" },
      { vg: ["omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: 10000, sell: null, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 400, cur: "poke-dollar" },
    ],
  },
  "tm18": {
    name: "TM18",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue", "ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "brilliant-diamond-shining-pearl"], games: "Red/Blue, Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, Brilliant Diamond/Shining Pearl", buy: null, sell: 1000, cur: "poke-dollar" },
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: 2000, sell: 1000, cur: "poke-dollar" },
      { vg: ["black-white", "black-2-white-2", "x-y", "sun-moon", "ultra-sun-ultra-moon"], games: "Black/White, Black 2/White 2, X/Y, Sun/Moon, Ultra Sun/Ultra Moon", buy: 50000, sell: null, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 10000, sell: null, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Shop", place: "Celadon City", detail: "Celadon Department Store", games: "Red" },
      ] },
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "Shop", place: "Celadon City", detail: "Celadon Department Store · ₱2000" },
      ] },
      { vg: "crystal", games: "Crystal", lines: [
        { type: "Overworld", place: "Slowpoke Well" },
      ] },
    ],
  },
  "tm19": {
    name: "TM19",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue", "yellow", "gold-silver", "crystal", "ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Red/Blue, Yellow, Gold/Silver, Crystal, Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["sun-moon", "sword-shield"], games: "Sun/Moon, Sword/Shield", buy: 10000, sell: null, cur: "poke-dollar" },
      { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", buy: 50000, sell: null, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 200, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Overworld", place: "Route 25 (Kanto)", games: "Red" },
      ] },
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "Trainer Reward", place: "Erika", games: "Gold" },
      ] },
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Overworld", place: "Hoenn Route 123", games: "Ruby" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Overworld", place: "Unova Route 18", games: "Black" },
      ] },
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Overworld", place: "Kalos Route 08", games: "X" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Shop", place: "Malie City", detail: "₱10000", games: "Sun" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Shop", place: "Motostoke", detail: "Upper Pokémon Center · ₱10000", games: "Shield" },
      ] },
    ],
  },
  "tm20": {
    name: "TM20",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: null, sell: 1000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Overworld", place: "Route 15 (Kanto)" },
      ] },
      { vg: "yellow", games: "Yellow", lines: [
        { type: "Overworld", place: "Route 15 (Kanto)" },
      ] },
    ],
  },
  "tm21": {
    name: "TM21",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue"], games: "Red/Blue", buy: null, sell: 2500, cur: "poke-dollar" },
      { vg: ["gold-silver"], games: "Gold/Silver", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["diamond-pearl"], games: "Diamond/Pearl", buy: 8000, sell: null, cur: "coin" },
      { vg: ["heartgold-soulsilver"], games: "HeartGold/SoulSilver", buy: 1000, sell: null, cur: "poke-dollar" },
      { vg: ["brilliant-diamond-shining-pearl"], games: "Brilliant Diamond/Shining Pearl", buy: 3000, sell: null, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Trainer Reward", place: "Celadon City", detail: "Defeat Erika · Rainbow Badge Badge", games: "Red" },
      ] },
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "Shop", place: "Goldenrod City", detail: "Goldenrod Department Store (Sunday) · Available on Sunday", games: "Gold" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Trainer Reward", place: "Defeat Katy", detail: "Also craftable via TM Machine with materials.", games: "Scarlet" },
      ] },
    ],
  },
  "tm22": {
    name: "TM22",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: null, sell: 2500, cur: "poke-dollar" },
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", buy: 3000, sell: 1500, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: 10000, sell: null, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Overworld", place: "Pokémon Mansion (Kanto)" },
      ] },
      { vg: "yellow", games: "Yellow", lines: [
        { type: "Overworld", place: "Pokémon Mansion (Kanto)" },
      ] },
    ],
  },
  "tm23": {
    name: "TM23",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: 3300, sell: null, cur: "coin" },
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: null, sell: 2500, cur: "poke-dollar" },
      { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["firered-leafgreen"], games: "FireRed/LeafGreen", buy: 3500, sell: null, cur: "coin" },
      { vg: ["black-white"], games: "Black/White", buy: 36, sell: null, cur: "battle-point" },
      { vg: ["black-2-white-2"], games: "Black 2/White 2", buy: 18, sell: null, cur: "battle-point" },
      { vg: ["x-y"], games: "X/Y", buy: 32, sell: null, cur: "battle-point" },
      { vg: ["sun-moon", "sword-shield"], games: "Sun/Moon, Sword/Shield", buy: 10000, sell: null, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 800, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 800, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Exchange", place: "Celadon Game Corner", detail: "3300 C", games: "Red" },
      ] },
    ],
  },
  "tm24": {
    name: "TM24",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: null, sell: 1000, cur: "poke-dollar" },
      { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald", "diamond-pearl", "platinum"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald, Diamond/Pearl, Platinum", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["brilliant-diamond-shining-pearl"], games: "Brilliant Diamond/Shining Pearl", buy: 3000, sell: 1500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 800, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Trainer Reward", place: "Vermilion City", detail: "Prize for defeating Lt. Surge · Thunder Badge Badge", games: "Red" },
      ] },
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "Trainer Reward", place: "Blackthorn City", detail: "Prize for defeating Clair · Rising Badge Badge", games: "Gold" },
      ] },
    ],
  },
  "tm25": {
    name: "TM25",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue"], games: "Red/Blue", buy: null, sell: 2500, cur: "poke-dollar" },
      { vg: ["gold-silver"], games: "Gold/Silver", buy: 5500, sell: null, cur: "coin" },
      { vg: ["ruby-sapphire", "emerald", "diamond-pearl"], games: "Ruby/Sapphire, Emerald, Diamond/Pearl", buy: 5500, sell: null, cur: "poke-dollar" },
      { vg: ["black-white", "x-y"], games: "Black/White, X/Y", buy: 70000, sell: null, cur: "poke-dollar" },
      { vg: ["sun-moon"], games: "Sun/Moon", buy: 30000, sell: null, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 10000, sell: null, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Overworld", place: "Power Plant", games: "Red" },
      ] },
    ],
  },
  "tm26": {
    name: "TM26",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue"], games: "Red/Blue", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["gold-silver", "ruby-sapphire", "diamond-pearl"], games: "Gold/Silver, Ruby/Sapphire, Diamond/Pearl", buy: null, sell: 1500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Overworld", place: "Silph Co.", games: "Red" },
      ] },
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "Overworld", place: "Victory Road (Kanto)", games: "Gold" },
      ] },
    ],
  },
  "tm27": {
    name: "TM27",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Trainer Reward", place: "Defeat Giovanni", games: "Red" },
      ] },
    ],
  },
  "tm28": {
    name: "TM28",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: null, sell: 1000, cur: "poke-dollar" },
      { vg: ["firered-leafgreen"], games: "FireRed/LeafGreen", buy: 2000, sell: 1000, cur: "poke-dollar" },
      { vg: ["x-y"], games: "X/Y", buy: 10000, sell: null, cur: "poke-dollar" },
      { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", buy: 30000, sell: null, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 100000, sell: null, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 1500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Overworld", place: "Cerulean City", games: "Red" },
      ] },
      { vg: "firered-leafgreen", games: "FireRed/LeafGreen", lines: [
        { type: "Shop", place: "Celadon City", detail: "Celadon Department Store · ₱2000", games: "FireRed" },
      ] },
    ],
  },
  "tm29": {
    name: "TM29",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue"], games: "Red/Blue", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["gold-silver"], games: "Gold/Silver", buy: null, sell: 1000, cur: "poke-dollar" },
      { vg: ["diamond-pearl"], games: "Diamond/Pearl", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["brilliant-diamond-shining-pearl"], games: "Brilliant Diamond/Shining Pearl", buy: 3000, sell: 1500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Shop", place: "Saffron City", games: "Red" },
      ] },
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "Exchange", place: "Celadon City", detail: "Game Corner · 3500 C", games: "Gold" },
      ] },
    ],
  },
  "tm30": {
    name: "TM30",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald", "firered-leafgreen"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald, FireRed/LeafGreen", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["firered-leafgreen"], games: "FireRed/LeafGreen", buy: 4500, sell: null, cur: "coin" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Overworld", place: "Route 09 (Kanto)", games: "Red" },
      ] },
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "Trainer Reward", place: "Ecruteak City", detail: "Defeat Morty", games: "Gold" },
      ] },
    ],
  },
  "tm31": {
    name: "TM31",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: null, sell: 1000, cur: "poke-dollar" },
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: null, sell: 1500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Overworld", place: "Saffron City", games: "Red" },
      ] },
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "Trainer Reward", place: "Defeat Falkner", detail: "Zephyr Badge Badge", games: "Gold" },
      ] },
    ],
  },
  "tm32": {
    name: "TM32",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue", "brilliant-diamond-shining-pearl"], games: "Red/Blue, Brilliant Diamond/Shining Pearl", buy: 1000, sell: 500, cur: "poke-dollar" },
      { vg: ["gold-silver", "ruby-sapphire", "emerald"], games: "Gold/Silver, Ruby/Sapphire, Emerald", buy: 1500, sell: null, cur: "coin" },
      { vg: ["gold-silver", "ruby-sapphire", "emerald"], games: "Gold/Silver, Ruby/Sapphire, Emerald", buy: null, sell: 1000, cur: "poke-dollar" },
      { vg: ["diamond-pearl", "platinum"], games: "Diamond/Pearl, Platinum", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["diamond-pearl", "platinum"], games: "Diamond/Pearl, Platinum", buy: 4000, sell: null, cur: "coin" },
      { vg: ["sun-moon", "sword-shield"], games: "Sun/Moon, Sword/Shield", buy: 10000, sell: null, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 200, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 200, sell: null, cur: "league-point" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Shop", place: "Celadon City", detail: "Celadon Department Store · ₱1000", games: "Red" },
      ] },
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "Exchange", place: "Celadon City", detail: "Celadon Game Corner · 1500 C", games: "Gold" },
      ] },
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Exchange", place: "Mauville City", detail: "Mauville Game Corner · 1500 C", games: "Ruby" },
      ] },
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Exchange", place: "Veilstone City", detail: "Veilstone Game Corner · 4000 C", games: "Diamond" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Shop", place: "Konikoni City", detail: "TM Shop · ₱10000", games: "Sun" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Shop", place: "Hammerlocke", detail: "West Pokémon Center · ₱10000", games: "Sword" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "TM Machine", detail: "200 LP · Requires Fletchling Feather x3", games: "Scarlet" },
      ] },
    ],
  },
  "tm33": {
    name: "TM33",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: 1000, sell: 500, cur: "poke-dollar" },
      { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald", buy: 3000, sell: 1500, cur: "poke-dollar" },
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", buy: 2000, sell: 1000, cur: "poke-dollar" },
      { vg: ["black-white", "black-2-white-2", "x-y"], games: "Black/White, Black 2/White 2, X/Y", buy: 30000, sell: null, cur: "poke-dollar" },
      { vg: ["omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: 10000, sell: null, cur: "poke-dollar" },
    ],
  },
  "tm34": {
    name: "TM34",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: null, sell: 1000, cur: "poke-dollar" },
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["ruby-sapphire", "emerald", "diamond-pearl", "platinum"], games: "Ruby/Sapphire, Emerald, Diamond/Pearl, Platinum", buy: null, sell: 1500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Trainer Reward", place: "Pewter City", detail: "Prize for defeating Brock · Boulder Badge Badge", games: "Red" },
      ] },
    ],
  },
  "tm35": {
    name: "TM35",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["ruby-sapphire", "emerald", "firered-leafgreen"], games: "Ruby/Sapphire, Emerald, FireRed/LeafGreen", buy: 4000, sell: null, cur: "coin" },
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: 10000, sell: null, cur: "coin" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 10000, sell: null, cur: "poke-dollar" },
      { vg: ["brilliant-diamond-shining-pearl"], games: "Brilliant Diamond/Shining Pearl", buy: 3000, sell: 1500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 800, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Overworld", place: "Cinnabar Lab", games: "Red" },
      ] },
    ],
  },
  "tm36": {
    name: "TM36",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: null, sell: 1000, cur: "poke-dollar" },
      { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald", "firered-leafgreen"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald, FireRed/LeafGreen", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: null, sell: 1500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Overworld", place: "Silph Co.", games: "Red" },
      ] },
    ],
  },
  "tm37": {
    name: "TM37",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue", "yellow", "gold-silver", "crystal"], games: "Red/Blue, Yellow, Gold/Silver, Crystal", buy: 2000, sell: 1000, cur: "poke-dollar" },
    ],
  },
  "tm38": {
    name: "TM38",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: null, sell: 2500, cur: "poke-dollar" },
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: 5500, sell: null, cur: "coin" },
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: null, sell: 1000, cur: "poke-dollar" },
      { vg: ["ruby-sapphire", "emerald", "diamond-pearl", "platinum"], games: "Ruby/Sapphire, Emerald, Diamond/Pearl, Platinum", buy: 5500, sell: 2750, cur: "poke-dollar" },
      { vg: ["black-white", "x-y"], games: "Black/White, X/Y", buy: 70000, sell: null, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: 30000, sell: null, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Trainer Reward", place: "Defeat Blaine" },
      ] },
      { vg: "yellow", games: "Yellow", lines: [
        { type: "Trainer Reward", place: "Defeat Blaine" },
      ] },
    ],
  },
  "tm39": {
    name: "TM39",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue", "yellow", "gold-silver", "crystal", "diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Red/Blue, Yellow, Gold/Silver, Crystal, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", buy: null, sell: 1000, cur: "poke-dollar" },
      { vg: ["ruby-sapphire", "emerald", "firered-leafgreen"], games: "Ruby/Sapphire, Emerald, FireRed/LeafGreen", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Overworld", place: "Route 12 (Kanto)" },
      ] },
      { vg: "yellow", games: "Yellow", lines: [
        { type: "Overworld", place: "Route 12 (Kanto)" },
      ] },
    ],
  },
  "tm40": {
    name: "TM40",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["ruby-sapphire", "emerald", "diamond-pearl", "platinum"], games: "Ruby/Sapphire, Emerald, Diamond/Pearl, Platinum", buy: null, sell: 1500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Overworld", place: "Safari Zone (Kanto)", games: "Red" },
      ] },
    ],
  },
  "tm41": {
    name: "TM41",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: null, sell: 1000, cur: "poke-dollar" },
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: 3000, sell: 1500, cur: "poke-dollar" },
      { vg: ["ruby-sapphire", "emerald", "firered-leafgreen"], games: "Ruby/Sapphire, Emerald, FireRed/LeafGreen", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["diamond-pearl", "platinum"], games: "Diamond/Pearl, Platinum", buy: null, sell: 750, cur: "poke-dollar" },
      { vg: ["heartgold-soulsilver"], games: "HeartGold/SoulSilver", buy: 1500, sell: 750, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 10000, sell: null, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 800, cur: "poke-dollar" },
    ],
    where: [
      { vg: "yellow", games: "Yellow", lines: [
        { type: "Shop", place: "Celadon City", detail: "Celadon Department Store" },
      ] },
    ],
  },
  "tm42": {
    name: "TM42",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: null, sell: 1000, cur: "poke-dollar" },
      { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "brilliant-diamond-shining-pearl"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, Brilliant Diamond/Shining Pearl", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", buy: 10000, sell: null, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 400, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Shop", place: "Viridian City" },
      ] },
      { vg: "yellow", games: "Yellow", lines: [
        { type: "Shop", place: "Viridian City" },
      ] },
    ],
  },
  "tm43": {
    name: "TM43",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: null, sell: 2500, cur: "poke-dollar" },
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["ruby-sapphire", "emerald", "firered-leafgreen"], games: "Ruby/Sapphire, Emerald, FireRed/LeafGreen", buy: 3000, sell: 1500, cur: "poke-dollar" },
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: null, sell: 1000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Overworld", place: "Victory Road (Kanto)" },
      ] },
      { vg: "yellow", games: "Yellow", lines: [
        { type: "Overworld", place: "Victory Road (Kanto)" },
      ] },
    ],
  },
  "tm44": {
    name: "TM44",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: null, sell: 1000, cur: "poke-dollar" },
      { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "scarlet-violet"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Scarlet/Violet", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: 6000, sell: null, cur: "coin" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: 1000, sell: null, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 100000, sell: null, cur: "poke-dollar" },
      { vg: ["brilliant-diamond-shining-pearl"], games: "Brilliant Diamond/Shining Pearl", buy: 3000, sell: 1500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Story", place: "S.S. Anne" },
      ] },
      { vg: "yellow", games: "Yellow", lines: [
        { type: "Story", place: "S.S. Anne" },
      ] },
    ],
  },
  "tm45": {
    name: "TM45",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Overworld", place: "Route 24 (Kanto)", games: "Red" },
      ] },
    ],
  },
  "tm46": {
    name: "TM46",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald", "firered-leafgreen", "scarlet-violet"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald, FireRed/LeafGreen, Scarlet/Violet", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", buy: null, sell: 1000, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 30000, sell: null, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 1500, sell: null, cur: "league-point" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Trainer Reward", place: "Saffron City", detail: "Defeat Sabrina", games: "Red" },
      ] },
    ],
  },
  "tm47": {
    name: "TM47",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue", "yellow", "gold-silver", "crystal", "ruby-sapphire", "emerald", "diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Red/Blue, Yellow, Gold/Silver, Crystal, Ruby/Sapphire, Emerald, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", buy: 10000, sell: null, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 200, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Overworld", place: "Victory Road (Kanto)", games: "Red" },
      ] },
    ],
  },
  "tm48": {
    name: "TM48",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: 3000, sell: null, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Shop", place: "Celadon City", detail: "Celadon Department Store", games: "Red" },
      ] },
    ],
  },
  "tm49": {
    name: "TM49",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald", "brilliant-diamond-shining-pearl"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald, Brilliant Diamond/Shining Pearl", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: null, sell: 750, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Shop", place: "Celadon City", detail: "Celadon Department Store", games: "Red" },
      ] },
    ],
  },
  "tm50": {
    name: "TM50",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["red-blue", "yellow", "gold-silver", "crystal"], games: "Red/Blue, Yellow, Gold/Silver, Crystal", buy: null, sell: 1000, cur: "poke-dollar" },
      { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", buy: 7700, sell: null, cur: "coin" },
      { vg: ["ruby-sapphire", "emerald"], games: "Ruby/Sapphire, Emerald", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: null, sell: 2750, cur: "poke-dollar" },
      { vg: ["x-y"], games: "X/Y", buy: 80000, sell: null, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 10000, sell: null, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 3000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 3000, sell: null, cur: "league-point" },
    ],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Shop", place: "Celadon Game Corner", detail: "7700 C", games: "Red" },
      ] },
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "Overworld", place: "Route 31 (Johto)", games: "Gold" },
      ] },
    ],
  },
  "tm51": {
    name: "TM51",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", buy: null, sell: 1000, cur: "poke-dollar" },
      { vg: ["black-white"], games: "Black/White", buy: 48, sell: null, cur: "battle-point" },
      { vg: ["black-2-white-2"], games: "Black 2/White 2", buy: 24, sell: null, cur: "battle-point" },
      { vg: ["x-y"], games: "X/Y", buy: 32, sell: null, cur: "battle-point" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: 10000, sell: null, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 3000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 3000, sell: null, cur: "league-point" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Route 210 (Sinnoh)", games: "Diamond" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Trainer Reward", place: "Violet City Gym", detail: "Defeat Falkner", games: "HeartGold" },
      ] },
    ],
  },
  "tm52": {
    name: "TM52",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", buy: 5500, sell: 2750, cur: "poke-dollar" },
      { vg: ["x-y"], games: "X/Y", buy: 70000, sell: null, cur: "poke-dollar" },
      { vg: ["omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", buy: 30000, sell: null, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 100000, sell: null, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Shop", place: "Veilstone City", detail: "Veilstone Department Store · ₱5500", games: "Diamond" },
      ] },
    ],
  },
  "tm53": {
    name: "TM53",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: 64, sell: null, cur: "battle-point" },
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 3000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 3000, sell: null, cur: "league-point" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Exchange", place: "Route 226 (Sinnoh)", detail: "Battle Tower · 64 BP", games: "Diamond" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Exchange", place: "Route 226 (Sinnoh)", detail: "Battle Frontier · 64 BP" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Exchange", place: "Battle Frontier (Johto)", detail: "64 BP", games: "HeartGold" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Overworld", place: "Unova Route 12", games: "Black" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Overworld", place: "Aspertia City", games: "Black 2" },
      ] },
    ],
  },
  "tm54": {
    name: "TM54",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["diamond-pearl", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", buy: 2000, sell: 1000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Shop", place: "Veilstone City", detail: "Veilstone Department Store · ₱2000" },
      ] },
    ],
  },
  "tm55": {
    name: "TM55",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["diamond-pearl", "platinum", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, Brilliant Diamond/Shining Pearl", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["heartgold-soulsilver"], games: "HeartGold/SoulSilver", buy: 3000, sell: 1500, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 10000, sell: null, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Trainer Reward", place: "Prize for defeating Crasher Wake", games: "Diamond" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Shop", place: "Celadon City", detail: "Celadon Department Store · ₱3000", games: "HeartGold" },
      ] },
    ],
  },
  "tm56": {
    name: "TM56",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", buy: null, sell: 1000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Route 222 (Sinnoh)" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Overworld", place: "Route 222 (Sinnoh)" },
      ] },
    ],
  },
  "tm57": {
    name: "TM57",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["omega-ruby-alpha-sapphire"], games: "Omega Ruby/Alpha Sapphire", buy: 10000, sell: null, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 400, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Trainer Reward", place: "Prize for defeating Volkner" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Trainer Reward", place: "Prize for defeating Volkner" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Lottery", place: "Goldenrod City", detail: "Goldenrod Department Store lottery", games: "HeartGold" },
        { type: "Overworld", place: "Power Plant", games: "SoulSilver" },
      ] },
    ],
  },
  "tm58": {
    name: "TM58",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [4, 5, 6, 7, 8, 9],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Exchange", place: "Veilstone City", detail: "Game Corner · 2000 C" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Exchange", place: "Veilstone City", detail: "Game Corner · 2000 C" },
      ] },
    ],
  },
  "tm59": {
    name: "TM59",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: 80, sell: null, cur: "battle-point" },
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 100000, sell: null, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 5000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 5000, sell: null, cur: "league-point" },
    ],
  },
  "tm60": {
    name: "TM60",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 30000, sell: null, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Trainer Reward", place: "Prize for defeating Maylene", games: "Diamond" },
      ] },
    ],
  },
  "tm61": {
    name: "TM61",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", buy: 32, sell: null, cur: "battle-point" },
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", buy: null, sell: 1000, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 30000, sell: null, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 3000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Exchange", place: "Battle Tower (Sinnoh)", detail: "32 BP", games: "Diamond" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Exchange", place: "Battle Frontier (Sinnoh)", detail: "32 BP" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Overworld", place: "Celestial Tower", games: "Black" },
      ] },
    ],
  },
  "tm62": {
    name: "TM62",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 30000, sell: null, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Route 212 (Sinnoh)", games: "Diamond" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Overworld", place: "Route 212 (Sinnoh)" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Lottery", place: "Route 06 (Kanto)", detail: "Goldenrod Department Store lottery", games: "HeartGold" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Trainer Reward", place: "Defeat Skyla", games: "Black" },
      ] },
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Overworld", place: "Coumarine City", games: "X" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Shop", place: "Wyndon", detail: "₱30000", games: "Sword" },
      ] },
    ],
  },
  "tm63": {
    name: "TM63",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: 2000, sell: null, cur: "coin" },
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: null, sell: 1000, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 50000, sell: null, cur: "poke-dollar" },
      { vg: ["brilliant-diamond-shining-pearl"], games: "Brilliant Diamond/Shining Pearl", buy: 2000, sell: 1000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 10000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Veilstone City", games: "Diamond" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Overworld", place: "Route 34 (Johto)", games: "HeartGold" },
      ] },
    ],
  },
  "tm64": {
    name: "TM64",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", buy: null, sell: 3750, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Shop", place: "Veilstone City", detail: "Veilstone Game Corner", games: "Diamond" },
      ] },
    ],
  },
  "tm65": {
    name: "TM65",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: 10000, sell: null, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Trainer Reward", place: "Prize for defeating Fantina" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Trainer Reward", place: "Prize for defeating Fantina" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Lottery", place: "Goldenrod City", detail: "Goldenrod Department Store lottery" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Overworld", place: "Celestial Tower" },
      ] },
    ],
  },
  "tm66": {
    name: "TM66",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["sun-moon"], games: "Sun/Moon", buy: 10000, sell: null, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 30000, sell: null, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Route 215 (Sinnoh)" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Overworld", place: "Route 215 (Sinnoh)" },
      ] },
    ],
  },
  "tm67": {
    name: "TM67",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 30000, sell: null, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Eterna City", detail: "Eterna Condominiums" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Overworld", place: "Eterna City", detail: "Eterna Condominiums" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Trainer Reward", place: "Nacrene City", detail: "Defeat Lenora" },
      ] },
    ],
  },
  "tm68": {
    name: "TM68",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: null, sell: 3750, cur: "poke-dollar" },
      { vg: ["diamond-pearl", "platinum"], games: "Diamond/Pearl, Platinum", buy: 20000, sell: null, cur: "coin" },
      { vg: ["heartgold-soulsilver"], games: "HeartGold/SoulSilver", buy: 15000, sell: null, cur: "coin" },
      { vg: ["black-white", "black-2-white-2", "x-y"], games: "Black/White, Black 2/White 2, X/Y", buy: 90000, sell: null, cur: "poke-dollar" },
      { vg: ["omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", buy: 50000, sell: null, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 30000, sell: null, cur: "poke-dollar" },
      { vg: ["brilliant-diamond-shining-pearl"], games: "Brilliant Diamond/Shining Pearl", buy: 7500, sell: 3750, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Shop", place: "Veilstone City", detail: "Veilstone Game Corner · 20000 C", games: "Diamond" },
      ] },
    ],
  },
  "tm69": {
    name: "TM69",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", buy: null, sell: 750, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: 10000, sell: null, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Mount Coronet" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Overworld", place: "Mount Coronet" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Overworld", place: "Route 10 (Kanto)" },
      ] },
    ],
  },
  "tm70": {
    name: "TM70",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", buy: 1000, sell: 500, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: 30000, sell: null, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 50000, sell: null, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Shop", place: "Veilstone City", detail: "Veilstone Department Store · ₱1000 · Also found in Oreburgh Gate", games: "Diamond" },
      ] },
    ],
  },
  "tm71": {
    name: "TM71",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", buy: 80, sell: null, cur: "battle-point" },
      { vg: ["omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", buy: 30000, sell: null, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 50000, sell: null, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 8000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 8000, sell: null, cur: "league-point" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Exchange", place: "Battle Tower (Sinnoh)", detail: "80 BP", games: "Diamond" },
      ] },
    ],
  },
  "tm72": {
    name: "TM72",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["diamond-pearl", "platinum"], games: "Diamond/Pearl, Platinum", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["heartgold-soulsilver"], games: "HeartGold/SoulSilver", buy: 3000, sell: 1500, cur: "poke-dollar" },
      { vg: ["x-y"], games: "X/Y", buy: 48, sell: null, cur: "battle-point" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 50000, sell: null, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 5000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 5000, sell: null, cur: "league-point" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Trainer Reward", place: "Prize for defeating Candice", detail: "Icicle Badge Badge", games: "Diamond" },
      ] },
    ],
  },
  "tm73": {
    name: "TM73",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: 32, sell: null, cur: "battle-point" },
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: null, sell: 1000, cur: "poke-dollar" },
      { vg: ["black-white", "black-2-white-2"], games: "Black/White, Black 2/White 2", buy: 10000, sell: null, cur: "poke-dollar" },
      { vg: ["omega-ruby-alpha-sapphire"], games: "Omega Ruby/Alpha Sapphire", buy: 5000, sell: null, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 8000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 8000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Exchange", place: "Battle Tower (Sinnoh)", detail: "32 BP", games: "Diamond" },
      ] },
    ],
  },
  "tm74": {
    name: "TM74",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["diamond-pearl", "platinum"], games: "Diamond/Pearl, Platinum", buy: 15000, sell: null, cur: "coin" },
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["heartgold-soulsilver"], games: "HeartGold/SoulSilver", buy: 10000, sell: null, cur: "coin" },
      { vg: ["black-white", "black-2-white-2"], games: "Black/White, Black 2/White 2", buy: 10000, sell: null, cur: "poke-dollar" },
      { vg: ["brilliant-diamond-shining-pearl"], games: "Brilliant Diamond/Shining Pearl", buy: 3000, sell: 1500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Exchange", place: "Veilstone City", detail: "Game Corner · 15000 C" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Exchange", place: "Veilstone City", detail: "Game Corner · 15000 C" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Exchange", place: "Celadon City", detail: "Game Corner · 10000 C" },
      ] },
    ],
  },
  "tm75": {
    name: "TM75",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: 4000, sell: null, cur: "coin" },
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: null, sell: 750, cur: "poke-dollar" },
      { vg: ["x-y"], games: "X/Y", buy: 10000, sell: null, cur: "poke-dollar" },
      { vg: ["brilliant-diamond-shining-pearl"], games: "Brilliant Diamond/Shining Pearl", buy: 1500, sell: 750, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Shop", place: "Veilstone City", detail: "Veilstone Game Corner · 4000 C", games: "Diamond" },
      ] },
    ],
  },
  "tm76": {
    name: "TM76",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["diamond-pearl", "platinum", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, Brilliant Diamond/Shining Pearl", buy: null, sell: 1000, cur: "poke-dollar" },
      { vg: ["heartgold-soulsilver"], games: "HeartGold/SoulSilver", buy: 2000, sell: 1000, cur: "poke-dollar" },
      { vg: ["x-y", "sword-shield"], games: "X/Y, Sword/Shield", buy: 10000, sell: null, cur: "poke-dollar" },
      { vg: ["omega-ruby-alpha-sapphire"], games: "Omega Ruby/Alpha Sapphire", buy: 5000, sell: null, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Trainer Reward", place: "Prize for defeating Roark", detail: "Coal Badge Badge" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Trainer Reward", place: "Prize for defeating Roark", detail: "Coal Badge Badge" },
      ] },
    ],
  },
  "tm77": {
    name: "TM77",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", buy: null, sell: 750, cur: "poke-dollar" },
      { vg: ["black-white"], games: "Black/White", buy: 48, sell: null, cur: "battle-point" },
      { vg: ["black-2-white-2"], games: "Black 2/White 2", buy: 24, sell: null, cur: "battle-point" },
      { vg: ["ultra-sun-ultra-moon"], games: "Ultra Sun/Ultra Moon", buy: 10000, sell: null, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 8000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Route 211 (Sinnoh)", games: "Diamond" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Overworld", place: "Viridian Forest", games: "HeartGold" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Exchange", place: "Battle Subway", detail: "48 BP", games: "Black" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Exchange", place: "Battle Subway", detail: "Pokémon World Tournament · 24 BP", games: "Black 2" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Trainer Reward", place: "Ballonlea", detail: "Defeat Allister", games: "Shield" },
        { type: "Shop", place: "Ballonlea", games: "Sword" },
      ] },
    ],
  },
  "tm78": {
    name: "TM78",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["diamond-pearl", "platinum"], games: "Diamond/Pearl, Platinum", buy: null, sell: 750, cur: "poke-dollar" },
      { vg: ["heartgold-soulsilver"], games: "HeartGold/SoulSilver", buy: 1500, sell: 750, cur: "poke-dollar" },
      { vg: ["x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", buy: 10000, sell: null, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 8000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Route 204 (Sinnoh)", games: "Diamond" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Shop", place: "Celadon City", detail: "Celadon Department Store · ₱1500", games: "HeartGold" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Trainer Reward", place: "Driftveil City", detail: "Defeat Clay", games: "Black" },
      ] },
    ],
  },
  "tm79": {
    name: "TM79",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["diamond-pearl", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Brilliant Diamond/Shining Pearl", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["heartgold-soulsilver"], games: "HeartGold/SoulSilver", buy: 3000, sell: 1500, cur: "poke-dollar" },
      { vg: ["black-2-white-2"], games: "Black 2/White 2", buy: 12, sell: null, cur: "battle-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 8000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 8000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Victory Road (Sinnoh)" },
      ] },
    ],
  },
  "tm80": {
    name: "TM80",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 400, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Mount Coronet", games: "Diamond" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Trainer Reward", place: "Pewter City", detail: "Defeat Brock", games: "HeartGold" },
      ] },
    ],
  },
  "tm81": {
    name: "TM81",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: 64, sell: null, cur: "battle-point" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Route 221 (Sinnoh)", games: "Diamond" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Shop", place: "Battle Frontier (Sinnoh)", detail: "64 BP" },
      ] },
    ],
  },
  "tm82": {
    name: "TM82",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["omega-ruby-alpha-sapphire", "sun-moon"], games: "Omega Ruby/Alpha Sapphire, Sun/Moon", buy: 10000, sell: null, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 400, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Eterna Forest" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Overworld", place: "Eterna Forest" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Overworld", place: "Goldenrod Tunnel", detail: "Warehouse" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Trainer Reward", place: "Opelucid City", detail: "Defeat Drayden", games: "Black" },
        { type: "Trainer Reward", place: "Opelucid City", detail: "Defeat Iris", games: "White" },
      ] },
    ],
  },
  "tm83": {
    name: "TM83",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: 2000, sell: 1000, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 100000, sell: null, cur: "poke-dollar" },
      { vg: ["brilliant-diamond-shining-pearl"], games: "Brilliant Diamond/Shining Pearl", buy: 3000, sell: 1500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Shop", place: "Veilstone City", detail: "Veilstone Department Store · ₱2000" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Shop", place: "Veilstone City", detail: "Veilstone Department Store · ₱2000" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Shop", place: "Goldenrod City", detail: "Goldenrod Department Store / Moomoo Farm · ₱2000" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Trainer Reward", place: "Defeat Cilan, Chili, or Cress" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Trainer Reward", place: "Defeat Cheren" },
      ] },
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Trainer Reward", place: "Defeat Viola" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Sootopolis City" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Overworld", place: "Alola Route 3" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Overworld", place: "Alola Route 3" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Shop", place: "Battle Tower (Galar)", detail: "Battle Tower · ₱100000" },
      ] },
      { vg: "brilliant-diamond-shining-pearl", games: "Brilliant Diamond/Shining Pearl", lines: [
        { type: "Shop", place: "Veilstone City", detail: "Veilstone Department Store · ₱3000" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "TM Machine", detail: "5000 LP · Requires Shroodle Ink x3, Seviper Fang x3, Mareanie Spike x3" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Achievement", place: "Research level reward", detail: "Attain research level 38" },
      ] },
    ],
  },
  "tm84": {
    name: "TM84",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["x-y"], games: "X/Y", buy: 10000, sell: null, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Route 212 (Sinnoh)", games: "Diamond" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Trainer Reward", place: "Defeat Janine", games: "HeartGold" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Overworld", place: "Unova Route 6", games: "Black" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Overworld", place: "Moor of Icirrus", games: "Black 2" },
      ] },
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Shop", place: "Shalour City", detail: "Poké Mart · ₱10000", games: "X" },
      ] },
    ],
  },
  "tm85": {
    name: "TM85",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 400, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Valor Lakefront" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Overworld", place: "Valor Lakefront" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Overworld", place: "Viridian City" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Trainer Reward", place: "Prize for defeating Piers", detail: "After defeating Piers" },
      ] },
    ],
  },
  "tm86": {
    name: "TM86",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Trainer Reward", place: "Defeat Gardenia", detail: "Forest Badge Badge" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Trainer Reward", place: "Defeat Gardenia", detail: "Forest Badge Badge" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Pickup", place: "Route 11 (Kanto)" },
      ] },
    ],
  },
  "tm87": {
    name: "TM87",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["heartgold-soulsilver"], games: "HeartGold/SoulSilver", buy: 1500, sell: 750, cur: "poke-dollar" },
      { vg: ["omega-ruby-alpha-sapphire"], games: "Omega Ruby/Alpha Sapphire", buy: 100, sell: null, cur: "poke-dollar" },
      { vg: ["brilliant-diamond-shining-pearl"], games: "Brilliant Diamond/Shining Pearl", buy: null, sell: 750, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Pokémon Mansion (Sinnoh)", games: "Diamond" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Shop", place: "Celadon City", detail: "Celadon Department Store · ₱1500", games: "HeartGold" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Trainer Reward", place: "Prize for defeating Opal", games: "Sword" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "TM Machine", detail: "3000 LP · Requires Meowth Fur ×3, Sableye Gem ×3, Sneasel Claw ×3", games: "Scarlet" },
      ] },
    ],
  },
  "tm88": {
    name: "TM88",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 20000, sell: null, cur: "poke-dollar" },
      { vg: ["brilliant-diamond-shining-pearl"], games: "Brilliant Diamond/Shining Pearl", buy: null, sell: 750, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
  },
  "tm89": {
    name: "TM89",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["diamond-pearl"], games: "Diamond/Pearl", buy: 6000, sell: null, cur: "coin" },
      { vg: ["diamond-pearl", "heartgold-soulsilver"], games: "Diamond/Pearl, HeartGold/SoulSilver", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["heartgold-soulsilver"], games: "HeartGold/SoulSilver", buy: 40, sell: null, cur: "battle-point" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: 10000, sell: null, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 20000, sell: null, cur: "poke-dollar" },
      { vg: ["brilliant-diamond-shining-pearl"], games: "Brilliant Diamond/Shining Pearl", buy: 3000, sell: 1500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Shop", place: "Veilstone City", detail: "Veilstone Game Corner · 6000 C", games: "Diamond" },
      ] },
    ],
  },
  "tm90": {
    name: "TM90",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: 2000, sell: null, cur: "coin" },
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", buy: null, sell: 1000, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 20000, sell: null, cur: "poke-dollar" },
      { vg: ["brilliant-diamond-shining-pearl"], games: "Brilliant Diamond/Shining Pearl", buy: 2000, sell: 1000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Exchange", place: "Veilstone Game Corner", detail: "2000 C", games: "Diamond" },
      ] },
    ],
  },
  "tm91": {
    name: "TM91",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 20000, sell: null, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Trainer Reward", place: "Prize for defeating Byron", games: "Diamond" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Trainer Reward", place: "Prize for defeating Byron" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Lottery", place: "Goldenrod City", detail: "Goldenrod Department Store lottery · Tuesdays only", games: "HeartGold" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Overworld", place: "Twist Mountain", games: "Black" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Shop", place: "Hammerlocke", detail: "East Pokémon Center · ₱20000", games: "Sword" },
      ] },
    ],
  },
  "tm92": {
    name: "TM92",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", buy: null, sell: 2750, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 100000, sell: null, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Hotel Grand Lake" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Overworld", place: "Hotel Grand Lake" },
      ] },
    ],
  },
  "hm01": {
    name: "HM01",
    description: "A disc that teaches a compatible Pokémon a move it can also use outside battle, and can't forget on its own; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "HM/TM Reward", place: "S.S. Anne", detail: "Captain of the S.S. Anne · Cascade Badge Badge" },
      ] },
      { vg: "yellow", games: "Yellow", lines: [
        { type: "HM/TM Reward", place: "S.S. Anne", detail: "Captain of the S.S. Anne · Cascade Badge Badge" },
      ] },
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "HM/TM Reward", place: "Ilex Forest", detail: "Hive Badge Badge" },
      ] },
      { vg: "crystal", games: "Crystal", lines: [
        { type: "HM/TM Reward", place: "Ilex Forest", detail: "Hive Badge Badge" },
      ] },
    ],
  },
  "hm02": {
    name: "HM02",
    description: "A disc that teaches a compatible Pokémon a move it can also use outside battle, and can't forget on its own; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "NPC Gift", place: "Route 16 (Kanto)", detail: "Thunder Badge Badge" },
      ] },
      { vg: "yellow", games: "Yellow", lines: [
        { type: "NPC Gift", place: "Route 16 (Kanto)", detail: "Thunder Badge Badge" },
      ] },
    ],
  },
  "hm03": {
    name: "HM03",
    description: "A disc that teaches a compatible Pokémon a move it can also use outside battle, and can't forget on its own; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "NPC Gift", place: "Safari Zone (Kanto)", detail: "Soul Badge Badge", games: "Red" },
      ] },
    ],
  },
  "hm04": {
    name: "HM04",
    description: "A disc that teaches a compatible Pokémon a move it can also use outside battle, and can't forget on its own; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "NPC Gift", place: "Fuchsia City", detail: "Rainbow Badge Badge" },
      ] },
      { vg: "yellow", games: "Yellow", lines: [
        { type: "NPC Gift", place: "Fuchsia City", detail: "Rainbow Badge Badge" },
      ] },
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "NPC Gift", place: "Olivine City", detail: "Plain Badge Badge" },
      ] },
      { vg: "crystal", games: "Crystal", lines: [
        { type: "NPC Gift", place: "Olivine City", detail: "Plain Badge Badge" },
      ] },
    ],
  },
  "hm05": {
    name: "HM05",
    description: "A disc that teaches a compatible Pokémon a move it can also use outside battle, and can't forget on its own; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Overworld", place: "Route 02 (Kanto)", detail: "Boulder Badge Badge" },
      ] },
      { vg: "yellow", games: "Yellow", lines: [
        { type: "Overworld", place: "Route 02 (Kanto)", detail: "Boulder Badge Badge" },
      ] },
    ],
  },
  "hm06": {
    name: "HM06",
    description: "A disc that teaches a compatible Pokémon a move it can also use outside battle, and can't forget on its own; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
    where: [
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "NPC Gift", place: "Team Rocket Hideout", detail: "Glacier Badge Badge" },
      ] },
      { vg: "crystal", games: "Crystal", lines: [
        { type: "NPC Gift", place: "Team Rocket Hideout", detail: "Glacier Badge Badge" },
      ] },
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "NPC Gift", place: "Mauville City", detail: "Dynamo Badge Badge" },
      ] },
      { vg: "emerald", games: "Emerald", lines: [
        { type: "NPC Gift", place: "Mauville City", detail: "Dynamo Badge Badge" },
      ] },
      { vg: "firered-leafgreen", games: "FireRed/LeafGreen", lines: [
        { type: "NPC Gift", place: "Ember Spa", detail: "Marsh Badge Badge" },
      ] },
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "NPC Gift", place: "Oreburgh Gate", detail: "Coal Badge Badge" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "NPC Gift", place: "Oreburgh Gate", detail: "Coal Badge Badge" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "NPC Gift", place: "Route 36 (Johto)", detail: "Zephyr Badge Badge" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "NPC Gift", place: "Undella Town" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "NPC Gift", place: "Undella Town" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Mauville City", detail: "Dynamo Badge Badge" },
      ] },
    ],
  },
  "hm07": {
    name: "HM07",
    description: "A disc that teaches a compatible Pokémon a move it can also use outside battle, and can't forget on its own; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [2, 3, 4, 6, 7, 8, 9],
    where: [
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "HM/TM Reward", place: "Ice Path", detail: "Rising Badge Badge" },
      ] },
      { vg: "crystal", games: "Crystal", lines: [
        { type: "HM/TM Reward", place: "Ice Path", detail: "Rising Badge Badge" },
      ] },
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "HM/TM Reward", place: "Cave of Origin", detail: "Rain Badge Badge" },
      ] },
      { vg: "emerald", games: "Emerald", lines: [
        { type: "HM/TM Reward", place: "Sootopolis City", detail: "Rain Badge Badge" },
      ] },
      { vg: "firered-leafgreen", games: "FireRed/LeafGreen", lines: [
        { type: "HM/TM Reward", place: "Icefall Cave", detail: "Volcano Badge Badge" },
      ] },
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "HM/TM Reward", place: "Sunyshore City", detail: "Beacon Badge Badge" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "HM/TM Reward", place: "Sunyshore City", detail: "Beacon Badge Badge" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "HM/TM Reward", place: "Ice Path", detail: "Rising Badge Badge" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "HM/TM Reward", place: "Mossdeep City", detail: "Mind Badge Badge" },
      ] },
    ],
  },
  "hm08": {
    name: "HM08",
    description: "A disc that teaches a compatible Pokémon a move it can also use outside battle, and can't forget on its own; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [2, 3, 4],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "NPC Gift", place: "Mossdeep City", detail: "Mind Badge Badge" },
      ] },
      { vg: "emerald", games: "Emerald", lines: [
        { type: "NPC Gift", place: "Mossdeep City", detail: "Mind Badge Badge" },
      ] },
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "NPC Gift", place: "Route 217 (Sinnoh)", detail: "Icicle Badge Badge" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "NPC Gift", place: "Route 217 (Sinnoh)", detail: "Icicle Badge Badge" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "NPC Gift", place: "Professor Oak's Laboratory", detail: "Earth Badge Badge" },
      ] },
    ],
  },
  "explorer-kit": {
    name: "Explorer Kit",
    description: "A bag of digging tools; opens the way down into Sinnoh's Underground.",
    category: "Gameplay", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "NPC Gift", place: "Eterna City", detail: "Underground Man" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "NPC Gift", place: "Eterna City", detail: "Underground Man" },
      ] },
      { vg: "brilliant-diamond-shining-pearl", games: "Brilliant Diamond/Shining Pearl", lines: [
        { type: "NPC Gift", place: "Eterna City", detail: "Underground Man" },
      ] },
    ],
  },
  "loot-sack": {
    name: "Loot Sack",
    description: "A big sturdy sack for hauling loot out of a coal mine; never actually handed out.",
    category: "Unused", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
  },
  "rule-book": {
    name: "Rule Book",
    description: "A pamphlet listing the rules for the different battle formats; never actually handed out.",
    category: "Unused", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
  },
  "poke-radar": {
    name: "Poké Radar",
    description: "Sets patches of tall grass rustling to reveal hidden Pokémon; recharges as you walk, and chains the same species for Shiny odds.",
    category: "Gameplay", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "NPC Gift", place: "Sandgem Town", detail: "Professor Rowan · After obtaining the National Pokédex from Professor Oak" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "NPC Gift", place: "Sandgem Town", detail: "Professor Rowan · After obtaining the National Pokédex from Professor Oak" },
      ] },
      { vg: "x-y", games: "X/Y", lines: [
        { type: "NPC Gift", place: "Pokémon Research Lab (Kalos)", detail: "Scientist on 2F · After entering the Hall of Fame" },
      ] },
      { vg: "brilliant-diamond-shining-pearl", games: "Brilliant Diamond/Shining Pearl", lines: [
        { type: "NPC Gift", place: "Sandgem Town", detail: "Professor Rowan · After obtaining the National Pokédex from Professor Oak" },
      ] },
    ],
  },
  "point-card": {
    name: "Point Card",
    description: "Shows how many Battle Points you've earned at the Battle Frontier or Battle Tower.",
    category: "Gameplay", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Story", place: "Battle Park (Sinnoh)", detail: "Upon entering Battle Park for the first time" },
      ] },
      { vg: "brilliant-diamond-shining-pearl", games: "Brilliant Diamond/Shining Pearl", lines: [
        { type: "Story", place: "Battle Park (Sinnoh)", detail: "Upon entering Battle Park for the first time" },
      ] },
    ],
  },
  "journal": {
    name: "Journal",
    description: "A diary that logs what you did and where, day by day.",
    category: "Gameplay", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
  },
  "seal-case": {
    name: "Seal Case",
    description: "Stores the Seals you stick on Ball Capsules to decorate a Pokémon's send-out.",
    category: "Gameplay", pocket: "key",
    gens: [4, 5, 6, 7, 8],
  },
  "fashion-case": {
    name: "Fashion Case",
    description: "Stores the Accessories and Backdrops used to dress up Pokémon for Contests and photos.",
    category: "Gameplay", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "NPC Gift", place: "Jubilife City", detail: "Gift after defeating Team Galactic · After defeating Team Galactic in Jubilife City" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "NPC Gift", place: "Jubilife City", detail: "Gift after defeating Team Galactic · After defeating Team Galactic in Jubilife City" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "NPC Gift", place: "Goldenrod Tunnel", detail: "From Ethan/Lyra upon entering for the first time · First visit to Goldenrod Tunnel" },
      ] },
    ],
  },
  "seal-bag": {
    name: "Seal Bag",
    description: "A little bag that holds ten Seals.",
    category: "Unused", pocket: "key",
    gens: [4, 5, 6, 7, 8],
  },
  "pal-pad": {
    name: "Pal Pad",
    description: "Registers friends by Friend Code and keeps a record of your Wi-Fi battles and trades.",
    category: "Gameplay", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "NPC Gift", place: "Pokémon Center Basement, from Teala after entering Oreburgh City for the first time", detail: "After entering Oreburgh City for the first time" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "NPC Gift", place: "Pokémon Center Basement, from Teala after entering Oreburgh City for the first time", detail: "After entering Oreburgh City for the first time" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "NPC Gift", place: "Pokémon Center Basement, from Teala after obtaining the Zephyr Badge", detail: "After obtaining the Zephyr Badge · Zephyr Badge Badge" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "NPC Gift", place: "Striaton City", detail: "From Fennel after protecting Munna at the Dreamyard · After protecting Munna at the Dreamyard" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Starting Item", place: "Aspertia City", detail: "Automatically obtained at the start of the game · At the start of the game" },
      ] },
    ],
  },
  "works-key": {
    name: "Works Key",
    description: "Opens the Valley Windworks, where Team Galactic has locked itself in.",
    category: "Plot advancement", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "NPC Gift", place: "Floaroma Meadow", detail: "Honey Man after defeating Team Galactic Grunts · After defeating the Team Galactic Grunts at Valley Windworks" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "NPC Gift", place: "Floaroma Meadow", detail: "Honey Man after defeating Team Galactic Grunts · After defeating the Team Galactic Grunts at Valley Windworks" },
      ] },
      { vg: "brilliant-diamond-shining-pearl", games: "Brilliant Diamond/Shining Pearl", lines: [
        { type: "NPC Gift", place: "Floaroma Meadow", detail: "Honey Man after defeating Team Galactic Grunts · After defeating the Team Galactic Grunts at Valley Windworks" },
      ] },
    ],
  },
  "old-charm": {
    name: "Old Charm",
    description: "A charm made of Pokémon bone; Cynthia asks you to carry it to her grandmother in Celestic Town.",
    category: "Plot advancement", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "NPC Gift", place: "Route 210 (Sinnoh)", detail: "From Cynthia after curing the Psyduck · After curing the Psyduck blocking Route 210" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "NPC Gift", place: "Route 210 (Sinnoh)", detail: "From Cynthia after curing the Psyduck · After curing the Psyduck blocking Route 210" },
      ] },
      { vg: "brilliant-diamond-shining-pearl", games: "Brilliant Diamond/Shining Pearl", lines: [
        { type: "NPC Gift", place: "Route 210 (Sinnoh)", detail: "From Cynthia after curing the Psyduck · After curing the Psyduck blocking Route 210" },
      ] },
    ],
  },
  "galactic-key": {
    name: "Galactic Key",
    description: "Opens the locked doors inside Team Galactic's Veilstone headquarters.",
    category: "Plot advancement", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Galactic Warehouse" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Overworld", place: "Galactic Warehouse" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Team Rocket’s Castle", detail: "From Cyrus after defeating him · During Episode RR" },
      ] },
      { vg: "brilliant-diamond-shining-pearl", games: "Brilliant Diamond/Shining Pearl", lines: [
        { type: "Overworld", place: "Galactic Warehouse" },
      ] },
    ],
  },
  "red-chain": {
    name: "Red Chain",
    description: "The chain Cyrus forged from the lake guardians to bind Dialga and Palkia; you never actually hold it.",
    category: "Unused", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
    where: [
      { vg: "legends-arceus", games: "Legends: Arceus", lines: [
        { type: "Story", place: "Shrouded Ruins", detail: "Created by the lake guardians after obtaining their respective materials · After obtaining Azelf's Fang, Uxie's Claw, and Mesprit's Plume" },
      ] },
    ],
  },
  "town-map": {
    name: "Town Map",
    description: "A map of the region you can open any time; marks where you are.",
    category: "Gameplay", pocket: "key",
    gens: [1, 3, 4, 5, 6, 7, 8, 9],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "NPC Gift", place: "Pallet Town", detail: "From Daisy after obtaining the Pokédex · After obtaining the Pokédex", games: "Red" },
      ] },
      { vg: "firered-leafgreen", games: "FireRed/LeafGreen", lines: [
        { type: "NPC Gift", place: "Pallet Town", detail: "From Daisy after obtaining the Pokédex · After obtaining the Pokédex", games: "FireRed" },
      ] },
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "NPC Gift", place: "Jubilife City", detail: "Trainers' School, from Barry after delivering the Parcel · After delivering the Parcel", games: "Diamond" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "NPC Gift", place: "Nuvema Town", detail: "From the player's Mom after obtaining the Pokédex · After obtaining the Pokédex", games: "Black" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "NPC Gift", place: "Aspertia City", detail: "From Hugh's sister after receiving Poké Balls from Bianca · After receiving Poké Balls from Bianca", games: "Black 2" },
      ] },
      { vg: "x-y", games: "X/Y", lines: [
        { type: "NPC Gift", place: "Vaniville Town", detail: "From the player's Mom after delivering the Prof's Letter · After delivering the Prof's Letter", games: "X" },
      ] },
      { vg: "lets-go-pikachu-lets-go-eevee", games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", lines: [
        { type: "NPC Gift", place: "Pallet Town", detail: "From the player's Mom after obtaining the Pokédex · After obtaining the Pokédex", games: "Let’s Go, Pikachu!" },
      ] },
      { vg: "brilliant-diamond-shining-pearl", games: "Brilliant Diamond/Shining Pearl", lines: [
        { type: "NPC Gift", place: "Jubilife City", detail: "Trainers' School, from Barry after delivering the Parcel · After delivering the Parcel", games: "Brilliant Diamond" },
      ] },
    ],
  },
  "vs-seeker": {
    name: "Vs. Seeker",
    description: "Finds Trainers nearby who want a rematch; recharges as you walk.",
    category: "Gameplay", pocket: "key",
    gens: [3, 4, 5, 6, 7, 8, 9],
    where: [
      { vg: "firered-leafgreen", games: "FireRed/LeafGreen", lines: [
        { type: "NPC Gift", place: "Vermilion City", detail: "Girl in the Pokémon Center" },
      ] },
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "NPC Gift", place: "Route 207 (Sinnoh)", detail: "Lucas/Dawn at the end of Cycling Road" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "NPC Gift", place: "Route 207 (Sinnoh)", detail: "Lucas/Dawn at the entrance to Mt. Coronet" },
      ] },
      { vg: "brilliant-diamond-shining-pearl", games: "Brilliant Diamond/Shining Pearl", lines: [
        { type: "NPC Gift", place: "Route 207 (Sinnoh)", detail: "Lucas/Dawn at the end of Cycling Road" },
      ] },
    ],
  },
  "coin-case": {
    name: "Coin Case",
    description: "Holds the coins you win and spend at the Game Corner.",
    category: "Gameplay", pocket: "key",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "NPC Gift", place: "Celadon City", detail: "Man in the restaurant" },
      ] },
      { vg: "yellow", games: "Yellow", lines: [
        { type: "NPC Gift", place: "Celadon City", detail: "Man in the restaurant" },
      ] },
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "Overworld", place: "Goldenrod Tunnel", detail: "Southern part" },
      ] },
      { vg: "crystal", games: "Crystal", lines: [
        { type: "Overworld", place: "Goldenrod Tunnel", detail: "Southern part" },
      ] },
    ],
  },
  "old-rod": {
    name: "Old Rod",
    description: "A battered rod; fishes up the most common Water-type Pokémon.",
    category: "Gameplay", pocket: "key",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "NPC Gift", place: "Vermilion City", detail: "Vermilion City Fishing Guru" },
      ] },
      { vg: "yellow", games: "Yellow", lines: [
        { type: "NPC Gift", place: "Vermilion City", detail: "Vermilion City Fishing Guru" },
      ] },
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "NPC Gift", place: "Route 32 (Johto)", detail: "Fisherman in the Pokémon Center" },
      ] },
      { vg: "crystal", games: "Crystal", lines: [
        { type: "NPC Gift", place: "Route 32 (Johto)", detail: "Fisherman in the Pokémon Center" },
      ] },
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "NPC Gift", place: "Dewford Town", detail: "Fisherman east of the Gym" },
      ] },
      { vg: "emerald", games: "Emerald", lines: [
        { type: "NPC Gift", place: "Dewford Town", detail: "Fisherman east of the Gym" },
      ] },
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "NPC Gift", place: "Jubilife City", detail: "Fisherman in the gate to Route 218" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "NPC Gift", place: "Jubilife City", detail: "Fisherman in the gate to Route 218" },
      ] },
      { vg: "x-y", games: "X/Y", lines: [
        { type: "NPC Gift", place: "Ambrette Town", detail: "Fisherman in the Ambrette Aquarium" },
      ] },
      { vg: "brilliant-diamond-shining-pearl", games: "Brilliant Diamond/Shining Pearl", lines: [
        { type: "NPC Gift", place: "Jubilife City", detail: "Fisherman in the gate to Route 218" },
      ] },
    ],
  },
  "good-rod": {
    name: "Good Rod",
    description: "A decent rod; fishes up a wider range of Water-type Pokémon than the Old Rod.",
    category: "Gameplay", pocket: "key",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "NPC Gift", place: "Fuchsia City", detail: "Fuchsia City Fishing Guru", games: "Red" },
      ] },
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "NPC Gift", place: "Olivine City", detail: "Fisherman north of the Pokémon Center", games: "Gold" },
      ] },
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "NPC Gift", place: "Hoenn Route 118", detail: "Fisherman on the eastern shore", games: "Ruby" },
      ] },
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "NPC Gift", place: "Route 209 (Sinnoh)", detail: "Fisherman near the Hearthome City gate", games: "Diamond" },
      ] },
      { vg: "x-y", games: "X/Y", lines: [
        { type: "NPC Gift", place: "Coumarine City", detail: "Fisherman at the marina", games: "X" },
      ] },
      { vg: "brilliant-diamond-shining-pearl", games: "Brilliant Diamond/Shining Pearl", lines: [
        { type: "NPC Gift", place: "Route 209 (Sinnoh)", detail: "Fisher near the Hearthome City gate", games: "Brilliant Diamond" },
      ] },
    ],
  },
  "super-rod": {
    name: "Super Rod",
    description: "A top-grade rod; fishes up the rarest and strongest Water-type Pokémon.",
    category: "Gameplay", pocket: "key",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "NPC Gift", place: "Route 12 (Kanto)", detail: "Silence Bridge Fishing Guru", games: "Red" },
      ] },
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "NPC Gift", place: "Route 12 (Kanto)", detail: "Silence Bridge Fishing Guru", games: "Gold" },
      ] },
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "NPC Gift", place: "Mossdeep City", detail: "Fisherman in the house east of the Gym", games: "Ruby" },
      ] },
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "NPC Gift", place: "Fight Area", detail: "Fisherman near the Route 225 gate", games: "Diamond" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "NPC Gift", place: "Nuvema Town", detail: "Looker after defeating Ghetsis · After defeating Ghetsis", games: "Black" },
      ] },
      { vg: "x-y", games: "X/Y", lines: [
        { type: "NPC Gift", place: "Kalos Route 16", detail: "Fisherman in the Fishing Shack", games: "X" },
      ] },
    ],
  },
  "sprayduck": {
    name: "Sprayduck",
    description: "A Psyduck-shaped watering can for tending Berry plants.",
    category: "Gameplay", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "NPC Gift", place: "Floaroma Town", detail: "Woman in the Pick a Peck of Colors Flower Shop" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "NPC Gift", place: "Floaroma Town", detail: "Woman in the Pick a Peck of Colors Flower Shop" },
      ] },
      { vg: "brilliant-diamond-shining-pearl", games: "Brilliant Diamond/Shining Pearl", lines: [
        { type: "NPC Gift", place: "Floaroma Town", detail: "Woman in the Pick a Peck of Colors Flower Shop" },
      ] },
    ],
  },
  "poffin-case": {
    name: "Poffin Case",
    description: "Holds the Poffins you bake from Berries to feed a Pokémon before a Contest.",
    category: "Gameplay", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "NPC Gift", place: "Hearthome City", detail: "Pokémon Fan Club Chairman" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "NPC Gift", place: "Hearthome City", detail: "Pokémon Fan Club Chairman" },
      ] },
      { vg: "brilliant-diamond-shining-pearl", games: "Brilliant Diamond/Shining Pearl", lines: [
        { type: "NPC Gift", place: "Hearthome City", detail: "Pokémon Fan Club Chairman" },
      ] },
    ],
  },
  "bicycle": {
    name: "Bicycle",
    description: "Gets you around far faster than walking, and over a few obstacles running can't handle.",
    category: "Gameplay", pocket: "key",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Exchange", place: "Cerulean City", detail: "Bike Shop (exchange for Bike Voucher)", games: "Red" },
      ] },
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "NPC Gift", place: "Goldenrod City", detail: "Bike Shop owner", games: "Gold" },
      ] },
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "NPC Gift", place: "Eterna City", detail: "Rad Rickshaw's Cycle Shop · After saving Rad Rickshaw from Team Galactic", games: "Diamond" },
      ] },
    ],
  },
  "suite-key": {
    name: "Suite Key",
    description: "The key to one of the Hotel Grand Lake suites; it has a habit of going missing.",
    category: "Event items", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Overworld", place: "Route 213 (Sinnoh)", detail: "Immediately northwest of the northern reception entrance of Hotel Grand Lake" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Overworld", place: "Route 213 (Sinnoh)", detail: "Immediately northwest of the northern reception entrance of Hotel Grand Lake" },
      ] },
      { vg: "brilliant-diamond-shining-pearl", games: "Brilliant Diamond/Shining Pearl", lines: [
        { type: "Overworld", place: "Route 213 (Sinnoh)", detail: "Immediately northwest of the northern reception entrance of Hotel Grand Lake" },
      ] },
    ],
  },
  "oaks-letter": {
    name: "Oak’s Letter",
    description: "A letter from Professor Oak asking you to meet him on Route 224; leads to Shaymin.",
    category: "Event items", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
  },
  "lunar-wing": {
    name: "Lunar Wing",
    description: "A feather shed by Cresselia; its glow lifts the nightmare gripping a boy in Canalave City.",
    category: "Event items", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
  },
  "member-card": {
    name: "Member Card",
    description: "An old membership card for Canalave City's inn; the door there leads to Darkrai's Newmoon Island.",
    category: "Event items", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
  },
  "azure-flute": {
    name: "Azure Flute",
    description: "A flute of unearthly tone; played at the Spear Pillar, it opens the stairway to Arceus's Hall of Origin.",
    category: "Event items", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
    where: [
      { vg: "brilliant-diamond-shining-pearl", games: "Brilliant Diamond/Shining Pearl", lines: [
        { type: "Event", place: "Twinleaf Town", detail: "Save data bonus from Pokémon Legends: Arceus with all Missions completed · Requires completed Pokémon Legends: Arceus save data · Available in Version 1.3.0+" },
      ] },
      { vg: "legends-arceus", games: "Legends: Arceus", lines: [
        { type: "Story", place: "Temple of Sinnoh", detail: "Reward after defeating Volo and Giratina (Mission 26: Seeking the Remaining Plates)" },
      ] },
    ],
  },
  "ss-ticket": {
    name: "S.S. Ticket",
    description: "A boarding pass for a passenger ship; where it sails depends on the game.",
    category: "Plot advancement", pocket: "key",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "NPC Gift", place: "Sea Cottage", detail: "Bill, after restoring him to normal", games: "Red" },
      ] },
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "NPC Gift", place: "New Bark Town", detail: "Professor Elm, after entering the Hall of Fame · After entering the Hall of Fame", games: "Gold" },
      ] },
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "NPC Gift", place: "Littleroot Town", detail: "Norman, after entering the Hall of Fame · After entering the Hall of Fame", games: "Ruby" },
      ] },
      { vg: "firered-leafgreen", games: "FireRed/LeafGreen", lines: [
        { type: "NPC Gift", place: "Sea Cottage", detail: "Bill, after restoring him to normal", games: "FireRed" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "NPC Gift", place: "New Bark Town", detail: "Professor Elm, after entering the Hall of Fame · After entering the Hall of Fame", games: "HeartGold" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Littleroot Town", detail: "Norman, after completing the Delta Episode · After completing the Delta Episode", games: "Omega Ruby" },
      ] },
      { vg: "lets-go-pikachu-lets-go-eevee", games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", lines: [
        { type: "NPC Gift", place: "Sea Cottage", detail: "Bill, after restoring him to normal", games: "Let’s Go, Pikachu!" },
      ] },
    ],
  },
  "contest-pass": {
    name: "Contest Pass",
    description: "Your entry pass for Pokémon Contests.",
    category: "Gameplay", pocket: "key",
    gens: [3, 4, 5, 6, 7, 8, 9],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "NPC Gift", place: "Verdanturf Town", detail: "Contest Hall" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Slateport City", detail: "After delivering the Devon Parts to Captain Stern" },
      ] },
    ],
  },
  "magma-stone": {
    name: "Magma Stone",
    description: "A stone with molten rock sealed inside; returning it to Stark Mountain draws Heatran out.",
    category: "Plot advancement", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
    where: [
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Overworld", place: "Unova Route 18", detail: "On one of the cliffs in the northern section" },
      ] },
    ],
  },
  "parcel": {
    name: "Parcel",
    description: "A package your rival left behind; their mother in Twinleaf Town asks you to run it to them.",
    category: "Plot advancement", pocket: "key",
    gens: [1, 3, 4, 5, 6, 7, 8, 9],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "NPC Gift", place: "Viridian City", detail: "Poké Mart clerk" },
      ] },
      { vg: "yellow", games: "Yellow", lines: [
        { type: "NPC Gift", place: "Viridian City", detail: "Poké Mart clerk" },
      ] },
      { vg: "firered-leafgreen", games: "FireRed/LeafGreen", lines: [
        { type: "NPC Gift", place: "Viridian City", detail: "Poké Mart clerk" },
      ] },
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "NPC Gift", place: "Twinleaf Town", detail: "Barry's mother · After returning from Sandgem Town" },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "NPC Gift", place: "Twinleaf Town", detail: "Barry's mother · After returning from Sandgem Town" },
      ] },
      { vg: "lets-go-pikachu-lets-go-eevee", games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", lines: [
        { type: "NPC Gift", place: "Viridian City", detail: "Poké Mart clerk" },
      ] },
      { vg: "brilliant-diamond-shining-pearl", games: "Brilliant Diamond/Shining Pearl", lines: [
        { type: "NPC Gift", place: "Twinleaf Town", detail: "Barry's mother · After returning from Sandgem Town" },
      ] },
    ],
  },
  "coupon-1": {
    name: "Coupon 1",
    description: "The first of three coupons from the clowns around Jubilife City; all three trade for a Pokétch.",
    category: "Plot advancement", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "NPC Gift", place: "Jubilife City", detail: "Clown between the Poké Mart and Pokémon Center", games: "Diamond" },
      ] },
    ],
  },
  "coupon-2": {
    name: "Coupon 2",
    description: "The second of three coupons from the clowns around Jubilife City; all three trade for a Pokétch.",
    category: "Plot advancement", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "NPC Gift", place: "Jubilife City", detail: "Clown in front of the Pokétch Company", games: "Diamond" },
      ] },
    ],
  },
  "coupon-3": {
    name: "Coupon 3",
    description: "The last of three coupons from the clowns around Jubilife City; all three trade for a Pokétch.",
    category: "Plot advancement", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "NPC Gift", place: "Jubilife City", detail: "Clown in front of the Jubilife TV Station", games: "Diamond" },
      ] },
    ],
  },
  "storage-key": {
    name: "Storage Key",
    description: "Opens the locked storage room aboard the Abandoned Ship.",
    category: "Plot advancement", pocket: "key",
    gens: [3, 4, 5, 6, 7, 8, 9],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Overworld", place: "Abandoned Ship", detail: "Captain's office" },
      ] },
      { vg: "emerald", games: "Emerald", lines: [
        { type: "Overworld", place: "Abandoned Ship", detail: "Captain's office" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Sea Mauville", detail: "Room 4" },
      ] },
    ],
  },
  "secret-potion": {
    name: "Secret Potion",
    description: "A pharmacy's cure-all for a sick Pokémon in your way: the lighthouse Ampharos in Johto, or the Psyduck blocking Route 210 in Sinnoh.",
    category: "Plot advancement", pocket: "key",
    gens: [2, 4, 5, 6, 7, 8, 9],
  },
  "griseous-orb": {
    name: "Griseous Orb",
    description: "Held by Giratina, strengthens its Dragon- and Ghost-type moves and, in older games, keeps it in Origin Forme.",
    category: "Species-specific", pocket: "misc",
    gens: [4, 5, 6, 7, 8, 9],
    fling: { power: 60 },
    prices: [
      { vg: ["platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sword-shield", "brilliant-diamond-shining-pearl"], games: "Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sword/Shield, Brilliant Diamond/Shining Pearl", buy: null, sell: 5000, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: 10000, sell: null, cur: "poke-dollar" },
    ],
    where: [
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Overworld", place: "Distortion World", detail: "From Turnback Cave" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Wild Pokémon", place: "Sinjoh Ruins", detail: "Held by Giratina" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "NPC Gift", place: "Marvelous Bridge", detail: "Given by the Shadow Triad", games: "Black" },
      ] },
    ],
  },
  "vs-recorder": {
    name: "Vs. Recorder",
    description: "Records a battle so you can watch it back later or share it.",
    category: "Gameplay", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
    where: [
      { vg: "platinum", games: "Platinum", lines: [
        { type: "NPC Gift", place: "Jubilife City", detail: "From Looker upon meeting him for the first time" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "NPC Gift", place: "Route 31 (Johto)", detail: "From Ethan/Lyra in the gate to Violet City" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "NPC Gift", place: "Nimbasa City", detail: "From an Ace Trainer exiting the Gear Station" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "NPC Gift", place: "Nimbasa City", detail: "From Nate/Rosa after defeating the Subway Bosses in front of the Gear Station · After defeating the Subway Bosses" },
      ] },
      { vg: "x-y", games: "X/Y", lines: [
        { type: "NPC Gift", place: "Kiloude City", detail: "From a Monsieur upon entering the city for the first time" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Mauville City", detail: "From a man in black at the Battle Institute upon first entry" },
      ] },
    ],
  },
  "gracidea": {
    name: "Gracidea",
    description: "A flower that lets Shaymin shift into its Sky Forme during the day; it reverts at night or when frozen.",
    category: "Event items", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
    where: [
      { vg: "platinum", games: "Platinum", lines: [
        { type: "NPC Gift", place: "Floaroma Town", detail: "Show a fateful encounter Shaymin" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "NPC Gift", place: "Goldenrod City", detail: "Goldenrod Flower Shop · Show a fateful encounter Shaymin" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Auction", place: "Porto Marinada", detail: "If the player owns a Shaymin" },
      ] },
    ],
  },
  "secret-key": {
    name: "Secret Key",
    description: "In Kanto, opens the locked Cinnabar Gym; in Sinnoh, opens the hidden room in Eterna's Galactic building where Rotom's appliances are.",
    category: "Event items", pocket: "key",
    gens: [1, 3, 4, 5, 6, 7, 8, 9],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Overworld", place: "Pokémon Mansion (Kanto)", detail: "B1F" },
      ] },
      { vg: "yellow", games: "Yellow", lines: [
        { type: "Overworld", place: "Pokémon Mansion (Kanto)", detail: "B1F" },
      ] },
      { vg: "firered-leafgreen", games: "FireRed/LeafGreen", lines: [
        { type: "Overworld", place: "Pokémon Mansion (Kanto)", detail: "B1F" },
      ] },
      { vg: "lets-go-pikachu-lets-go-eevee", games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", lines: [
        { type: "Overworld", place: "Pokémon Mansion (Kanto)", detail: "B1F" },
      ] },
    ],
  },
  "apricorn-box": {
    name: "Apricorn Box",
    description: "Stores the Apricorns you pick, and makes Aprijuice from them as you walk.",
    category: "Gameplay", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
    where: [
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "NPC Gift", place: "Route 30 (Johto)", detail: "Man inside the southernmost house" },
      ] },
    ],
  },
  "berry-pots": {
    name: "Berry Pots",
    description: "Portable planters for growing Berries on the go.",
    category: "Gameplay", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
    where: [
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "NPC Gift", place: "Route 36 (Johto)", detail: "From Floria after catching or defeating Sudowoodo · After encountering Sudowoodo on Route 36" },
      ] },
    ],
  },
  "squirt-bottle": {
    name: "Squirt Bottle",
    description: "A Squirtle-shaped watering can; the odd tree blocking Route 36 turns out to be a Sudowoodo when sprinkled.",
    category: "Plot advancement", pocket: "key",
    gens: [2, 4, 5, 6, 7, 8, 9],
    where: [
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "NPC Gift", place: "Goldenrod City", detail: "Flower Shop · After defeating Whitney" },
      ] },
      { vg: "crystal", games: "Crystal", lines: [
        { type: "NPC Gift", place: "Goldenrod City", detail: "Flower Shop · After defeating Whitney" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "NPC Gift", place: "Goldenrod City", detail: "Flower Shop · After defeating Whitney" },
      ] },
    ],
  },
  "lure-ball": {
    name: "Lure Ball",
    description: "Far more likely to catch a Pokémon hooked while fishing.",
    category: "Apricorn balls", pocket: "pokeballs",
    gens: [2, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["gold-silver", "crystal", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire"], games: "Gold/Silver, Crystal, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 150, cur: "poke-dollar" },
    ],
    where: [
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "NPC Gift", place: "Azalea Town", detail: "Kurt", games: "Gold" },
        { type: "Crafting", place: "Azalea Town", detail: "Blue Apricorn", games: "Gold" },
      ] },
    ],
  },
  "level-ball": {
    name: "Level Ball",
    description: "Works better the higher your Pokémon's level is above the wild one's, up to 8x.",
    category: "Apricorn balls", pocket: "pokeballs",
    gens: [2, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["gold-silver", "crystal", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire"], games: "Gold/Silver, Crystal, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 150, cur: "poke-dollar" },
    ],
  },
  "moon-ball": {
    name: "Moon Ball",
    description: "Four times as likely to catch a species that evolves with a Moon Stone.",
    category: "Apricorn balls", pocket: "pokeballs",
    gens: [2, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["gold-silver", "crystal", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire"], games: "Gold/Silver, Crystal, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 150, cur: "poke-dollar" },
    ],
    where: [
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "Crafting", place: "Azalea Town", detail: "Kurt (Yellow Apricorn)", games: "Gold" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Crafting", place: "Azalea Town", detail: "Kurt (Yellow Apricorn)", games: "HeartGold" },
      ] },
    ],
  },
  "heavy-ball": {
    name: "Heavy Ball",
    description: "Gets a flat catch bonus for heavy Pokémon, and a penalty for light ones.",
    category: "Apricorn balls", pocket: "pokeballs",
    gens: [2, 4, 5, 6, 7, 8],
    prices: [
      { vg: ["gold-silver", "crystal", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire"], games: "Gold/Silver, Crystal, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 150, cur: "poke-dollar" },
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: 120, sell: 30, cur: "poke-dollar" },
    ],
    where: [
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "Crafting", place: "Azalea Town", detail: "Kurt (Black Apricorn)" },
      ] },
      { vg: "crystal", games: "Crystal", lines: [
        { type: "Crafting", place: "Azalea Town", detail: "Kurt (Black Apricorn)" },
      ] },
      { vg: "legends-arceus", games: "Legends: Arceus", lines: [
        { type: "Shop", place: "General store and base camp stores", detail: "₱120 · After completing Request 23: Getting Ahold of New Wares" },
        { type: "Shop", place: "Ginkgo Guild cart (Ginter)", detail: "Randomly sold." },
        { type: "Request", place: "Reward for completing Request 36: Watering with Care" },
        { type: "Crafting", place: "Crafting with 1 Apricorn and 1 Black Tumblestone" },
      ] },
    ],
  },
  "fast-ball": {
    name: "Fast Ball",
    description: "Four times as likely to catch a species with a base Speed of 100 or more.",
    category: "Apricorn balls", pocket: "pokeballs",
    gens: [2, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["gold-silver", "crystal", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire"], games: "Gold/Silver, Crystal, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 150, cur: "poke-dollar" },
    ],
    where: [
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "Crafting", place: "Azalea Town", detail: "White Apricorn to Kurt", games: "Gold" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "NPC Gift", place: "Azalea Town", detail: "Kurt", games: "HeartGold" },
      ] },
    ],
  },
  "friend-ball": {
    name: "Friend Ball",
    description: "Catches like a Poké Ball, but the Pokémon starts out at high friendship.",
    category: "Apricorn balls", pocket: "pokeballs",
    gens: [2, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["gold-silver", "crystal", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire"], games: "Gold/Silver, Crystal, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 150, cur: "poke-dollar" },
    ],
  },
  "love-ball": {
    name: "Love Ball",
    description: "Eight times as likely to catch a Pokémon of the same species and opposite gender as yours.",
    category: "Apricorn balls", pocket: "pokeballs",
    gens: [2, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["gold-silver", "crystal", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire"], games: "Gold/Silver, Crystal, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 150, cur: "poke-dollar" },
    ],
    where: [
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "Crafting", place: "Azalea Town", detail: "Kurt (Pink Apricorn)", games: "Gold" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Crafting", place: "Azalea Town", detail: "Kurt (Pink Apricorn)", games: "HeartGold" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Trainer Reward", place: "Ballonlea Stadium", detail: "Champion Cup post-game · Post-game Champion Cup", games: "Sword" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Auction", place: "Porto Marinada", detail: "Auction", games: "Scarlet" },
      ] },
    ],
  },
  "park-ball": {
    name: "Park Ball",
    description: "Used only in Pal Park, to re-catch Pokémon brought over from the Game Boy Advance games.",
    category: "Standard balls", pocket: "pokeballs",
    gens: [2, 4, 5, 6, 7, 8, 9],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Story", place: "Pal Park", detail: "Catching Show · Participate in Pal Park Catching Show · Balls are returned after leaving the Catching Show." },
      ] },
      { vg: "platinum", games: "Platinum", lines: [
        { type: "Story", place: "Pal Park", detail: "Catching Show · Participate in Pal Park Catching Show · Balls are returned after leaving the Catching Show." },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Story", place: "Pal Park", detail: "Catching Show · Participate in Pal Park Catching Show · Balls are returned after leaving the Catching Show." },
      ] },
    ],
  },
  "sport-ball": {
    name: "Sport Ball",
    description: "The ball used in the National Park's Bug-Catching Contest; works like a Great Ball.",
    category: "Standard balls", pocket: "pokeballs",
    gens: [4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "lets-go-pikachu-lets-go-eevee", "sword-shield"], games: "HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Let’s Go, Pikachu!/Let’s Go, Eevee!, Sword/Shield", buy: null, sell: 150, cur: "poke-dollar" },
    ],
    where: [
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "Contest", place: "National Park", detail: "Bug-Catching Contest (Tuesday, Thursday, Saturday) · Only usable during contest; unused balls are returned." },
      ] },
      { vg: "crystal", games: "Crystal", lines: [
        { type: "Contest", place: "National Park", detail: "Bug-Catching Contest (Tuesday, Thursday, Saturday) · Only usable during contest; unused balls are returned." },
      ] },
    ],
  },
  "red-apricorn": {
    name: "Red Apricorn",
    description: "A red Apricorn; Kurt turns it into a Level Ball, or it goes into Aprijuice.",
    category: "Apricorn box", pocket: "key",
    gens: [2, 4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "lets-go-pikachu-lets-go-eevee"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Let’s Go, Pikachu!/Let’s Go, Eevee!", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 50, cur: "poke-dollar" },
    ],
  },
  "blue-apricorn": {
    name: "Blue Apricorn",
    description: "A blue Apricorn; Kurt turns it into a Lure Ball, or it goes into Aprijuice.",
    category: "Apricorn box", pocket: "key",
    gens: [2, 4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["black-white", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "lets-go-pikachu-lets-go-eevee"], games: "Black/White, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Let’s Go, Pikachu!/Let’s Go, Eevee!", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 50, cur: "poke-dollar" },
    ],
    where: [
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "Berry Tree", place: "Route 37 (Johto)" },
      ] },
      { vg: "crystal", games: "Crystal", lines: [
        { type: "Berry Tree", place: "Route 37 (Johto)" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Berry Tree", place: "Giant's Foot", detail: "Crown Tundra · Requires The Crown Tundra", games: "Shield" },
        { type: "Berry Tree", place: "Fields of Honor", detail: "Isle of Armor · Requires The Isle of Armor", games: "Sword" },
      ] },
    ],
  },
  "yellow-apricorn": {
    name: "Yellow Apricorn",
    description: "A yellow Apricorn; Kurt turns it into a Moon Ball, or it goes into Aprijuice.",
    category: "Apricorn box", pocket: "key",
    gens: [2, 4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "lets-go-pikachu-lets-go-eevee"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Let’s Go, Pikachu!/Let’s Go, Eevee!", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 50, cur: "poke-dollar" },
    ],
    where: [
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "Harvest", place: "Route 42 (Johto)" },
      ] },
      { vg: "crystal", games: "Crystal", lines: [
        { type: "Harvest", place: "Route 42 (Johto)" },
      ] },
    ],
  },
  "green-apricorn": {
    name: "Green Apricorn",
    description: "A green Apricorn; Kurt turns it into a Friend Ball, or it goes into Aprijuice.",
    category: "Apricorn box", pocket: "key",
    gens: [2, 4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "lets-go-pikachu-lets-go-eevee"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Let’s Go, Pikachu!/Let’s Go, Eevee!", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 50, cur: "poke-dollar" },
    ],
    where: [
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "Overworld", place: "Route 42 (Johto)" },
      ] },
      { vg: "crystal", games: "Crystal", lines: [
        { type: "Overworld", place: "Route 42 (Johto)" },
      ] },
    ],
  },
  "pink-apricorn": {
    name: "Pink Apricorn",
    description: "A pink Apricorn; Kurt turns it into a Love Ball, or it goes into Aprijuice.",
    category: "Apricorn box", pocket: "key",
    gens: [2, 4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "lets-go-pikachu-lets-go-eevee"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Let’s Go, Pikachu!/Let’s Go, Eevee!", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 50, cur: "poke-dollar" },
    ],
    where: [
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "Harvest", place: "Route 42 (Johto)" },
      ] },
      { vg: "crystal", games: "Crystal", lines: [
        { type: "Harvest", place: "Route 42 (Johto)" },
      ] },
    ],
  },
  "white-apricorn": {
    name: "White Apricorn",
    description: "A white Apricorn; Kurt turns it into a Fast Ball, or it goes into Aprijuice.",
    category: "Apricorn box", pocket: "key",
    gens: [2, 4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "lets-go-pikachu-lets-go-eevee"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Let’s Go, Pikachu!/Let’s Go, Eevee!", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 50, cur: "poke-dollar" },
    ],
    where: [
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "Overworld", place: "Azalea Town" },
      ] },
      { vg: "crystal", games: "Crystal", lines: [
        { type: "Overworld", place: "Azalea Town" },
      ] },
    ],
  },
  "black-apricorn": {
    name: "Black Apricorn",
    description: "A hard black Apricorn; Kurt turns it into a Heavy Ball, or it goes into Aprijuice.",
    category: "Apricorn box", pocket: "key",
    gens: [2, 4, 5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "lets-go-pikachu-lets-go-eevee"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Let’s Go, Pikachu!/Let’s Go, Eevee!", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 50, cur: "poke-dollar" },
    ],
    where: [
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "Harvest", place: "Route 37 (Johto)" },
      ] },
      { vg: "crystal", games: "Crystal", lines: [
        { type: "Harvest", place: "Route 37 (Johto)" },
      ] },
    ],
  },
  "dowsing-machine": {
    name: "Dowsing Machine",
    description: "Beeps as you get closer to an item hidden in the ground.",
    category: "Gameplay", pocket: "key",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "NPC Gift", place: "Route 11 (Kanto)", detail: "Gate 2F from Oak's aide after obtaining 30 Pokémon · After obtaining 30 Pokémon", games: "Red" },
      ] },
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "NPC Gift", place: "Ecruteak City", detail: "Man in a house next to the Gym", games: "Gold" },
      ] },
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "NPC Defeat", place: "Hoenn Route 110", detail: "From Brendan/May after defeating them", games: "Ruby" },
      ] },
      { vg: "black-white", games: "Black/White", lines: [
        { type: "NPC Gift", place: "Nacrene City", detail: "From Bianca after obtaining the Basic Badge · Basic Badge Badge", games: "Black" },
      ] },
      { vg: "x-y", games: "X/Y", lines: [
        { type: "NPC Gift", place: "Kalos Route 08", detail: "From a Swimmer after clearing Glittering Cave · After clearing Glittering Cave", games: "X" },
      ] },
    ],
  },
  "rage-candy-bar": {
    name: "Rage Candy Bar",
    description: "Mahogany Town's famous candy; cures any status condition and confusion (in Johto it heals 20 HP instead).",
    category: "Gameplay", pocket: "key",
    gens: [2, 4, 5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: 300, sell: 150, cur: "poke-dollar" },
      { vg: ["heartgold-soulsilver"], games: "HeartGold/SoulSilver", buy: 300, sell: null, cur: "poke-dollar" },
      { vg: ["black-white"], games: "Black/White", buy: null, sell: 150, cur: "poke-dollar" },
      { vg: ["black-2-white-2"], games: "Black 2/White 2", buy: 2000, sell: 150, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 175, cur: "poke-dollar" },
    ],
  },
  "red-orb": {
    name: "Red Orb",
    description: "A red orb tied to Groudon; in Hoenn's remakes, Groudon holding it undergoes Primal Reversion.",
    category: "Plot advancement", pocket: "key",
    gens: [3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: 10000, sell: null, cur: "poke-dollar" },
    ],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Story", place: "Mt. Pyre", detail: "Summit (after confronting Team Magma)", games: "Ruby" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "NPC Gift", place: "Route 30 (Johto)", detail: "Mr. Pokémon · After defeating Red and obtaining the National Pokédex and a Kanto starter", games: "SoulSilver" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Story", place: "Mt. Pyre", detail: "Summit (after defeating Matt)", games: "Alpha Sapphire" },
        { type: "Story", place: "Sootopolis City", detail: "From Maxie after battling Groudon", games: "Omega Ruby" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Shop", place: "Hau'oli City", detail: "Hau'oli City Mall – Antiquities of the Ages · ₱10000" },
      ] },
    ],
  },
  "blue-orb": {
    name: "Blue Orb",
    description: "A blue orb tied to Kyogre; in Hoenn's remakes, Kyogre holding it undergoes Primal Reversion.",
    category: "Plot advancement", pocket: "key",
    gens: [3, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: 10000, sell: null, cur: "poke-dollar" },
    ],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Story", place: "Mt. Pyre", detail: "Summit after confronting Team Aqua", games: "Sapphire" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "NPC Gift", place: "Route 30 (Johto)", detail: "Mr. Pokémon · After defeating Red and obtaining the National Pokédex and a Kanto starter", games: "HeartGold" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Sootopolis City", detail: "Archie after battling Kyogre", games: "Alpha Sapphire" },
        { type: "Story", place: "Mt. Pyre", detail: "Summit after defeating Courtney", games: "Omega Ruby" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Shop", place: "Hau'oli City", detail: "Antiquities of the Ages · ₱10000" },
      ] },
    ],
  },
  "jade-orb": {
    name: "Jade Orb",
    description: "A green orb tied to Rayquaza; carrying it into the Embedded Tower in Johto draws it out.",
    category: "Plot advancement", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
    where: [
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "NPC Gift", place: "Pallet Town", detail: "Professor Oak's Laboratory · Show Professor Oak a Kyogre from HeartGold and a Groudon from SoulSilver." },
      ] },
    ],
  },
  "enigma-stone": {
    name: "Enigma Stone",
    description: "A crystal from a Johto event; taken to Pewter Museum, it summons Latias or Latios.",
    category: "Event items", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
    where: [
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Event", place: "Wi-Fi Mystery Gift", detail: "After receiving the National Pokédex" },
      ] },
    ],
  },
  "unown-report": {
    name: "Unown Report",
    description: "A notebook that fills in each Unown letter as you find it in the Ruins of Alph.",
    category: "Gameplay", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
    where: [
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "NPC Gift", place: "Ruins of Alph", detail: "Given by a researcher after solving the first chamber puzzle · After solving the first Ruins of Alph puzzle" },
      ] },
    ],
  },
  "blue-card": {
    name: "Blue Card",
    description: "Tracks the points you rack up on Buena's Password radio quiz, tradable for prizes in Goldenrod.",
    category: "Gameplay", pocket: "key",
    gens: [2, 4, 5, 6, 7, 8, 9],
    where: [
      { vg: "crystal", games: "Crystal", lines: [
        { type: "NPC Gift", place: "Goldenrod Radio Tower", detail: "2F, from Buena" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "NPC Gift", place: "Goldenrod Radio Tower", detail: "2F, from Buena" },
      ] },
    ],
  },
  "slowpoke-tail": {
    name: "Slowpoke Tail",
    description: "A Slowpoke tail sold by Team Rocket; no use except selling, though it fetches a good price.",
    category: "Unused", pocket: "key",
    gens: [2, 4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", buy: 9800, sell: 4900, cur: "poke-dollar" },
    ],
    where: [
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "Shop", place: "Mahogany Town", detail: "Just a Souvenir Shop (before exposing Team Rocket) · ₱9800 · Before exposing Team Rocket" },
      ] },
      { vg: "crystal", games: "Crystal", lines: [
        { type: "Shop", place: "Mahogany Town", detail: "Just a Souvenir Shop (before exposing Team Rocket) · ₱9800 · Before exposing Team Rocket" },
      ] },
    ],
  },
  "clear-bell": {
    name: "Clear Bell",
    description: "An ancient bell whose chime summons Suicune at the Tin Tower.",
    category: "Plot advancement", pocket: "key",
    gens: [2, 4, 5, 6, 7, 8, 9],
    where: [
      { vg: "crystal", games: "Crystal", lines: [
        { type: "NPC Gift", place: "Goldenrod Radio Tower", detail: "From the Director after defeating Team Rocket · After defeating Team Rocket at the Goldenrod Radio Tower" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "NPC Gift", place: "Ecruteak City", detail: "Reward for defeating the Kimono Girls · After defeating the Kimono Girls", games: "HeartGold" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Exchange", place: "Slateport City", detail: "From Captain Stern in exchange for the Scanner · After obtaining the Scanner", games: "Omega Ruby" },
      ] },
    ],
  },
  "card-key": {
    name: "Card Key",
    description: "Opens the locked doors on Silph Co.'s upper floors, where Team Rocket is holed up.",
    category: "Plot advancement", pocket: "key",
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Overworld", place: "Silph Co.", detail: "5F" },
      ] },
      { vg: "yellow", games: "Yellow", lines: [
        { type: "Overworld", place: "Silph Co.", detail: "5F" },
      ] },
      { vg: "firered-leafgreen", games: "FireRed/LeafGreen", lines: [
        { type: "Overworld", place: "Silph Co.", detail: "5F" },
      ] },
      { vg: "lets-go-pikachu-lets-go-eevee", games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", lines: [
        { type: "NPC Gift", place: "Silph Co.", detail: "5F, from Trace after defeating Archer · After defeating Archer" },
      ] },
    ],
  },
  "basement-key": {
    name: "Basement Key",
    description: "Opens the basement under Goldenrod City's Underground while Team Rocket occupies the Radio Tower.",
    category: "Plot advancement", pocket: "key",
    gens: [2, 3, 4, 5, 6, 7, 8, 9],
  },
  "red-scale": {
    name: "Red Scale",
    description: "A scale from the red Gyarados at the Lake of Rage; Mr. Pokémon trades an Exp. Share for it.",
    category: "Plot advancement", pocket: "key",
    gens: [2, 4, 5, 6, 7, 8, 9],
    where: [
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "Story", place: "Lake of Rage", detail: "Automatically obtained after battling the Red Gyarados" },
      ] },
      { vg: "crystal", games: "Crystal", lines: [
        { type: "Story", place: "Lake of Rage", detail: "Automatically obtained after battling the Red Gyarados" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Story", place: "Lake of Rage", detail: "Automatically obtained after battling the Red Gyarados" },
      ] },
    ],
  },
  "lost-item": {
    name: "Lost Item",
    description: "A Poké Doll the Copycat lost at the Pokémon Fan Club in Vermilion; return it for a Pass.",
    category: "Plot advancement", pocket: "key",
    gens: [2, 4, 5, 6, 7, 8, 9],
    where: [
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "NPC Gift", place: "Vermilion City", detail: "Pokémon Fan Club member · After hearing about Copycat's missing doll" },
      ] },
      { vg: "crystal", games: "Crystal", lines: [
        { type: "NPC Gift", place: "Vermilion City", detail: "Pokémon Fan Club member · After hearing about Copycat's missing doll" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "NPC Gift", place: "Vermilion City", detail: "Pokémon Fan Club member · After hearing about Copycat's missing doll" },
      ] },
    ],
  },
  "pass": {
    name: "Pass",
    description: "Your ticket for the Magnet Train between Goldenrod City and Saffron City.",
    category: "Plot advancement", pocket: "key",
    gens: [2, 4, 5, 6, 7, 8, 9],
    where: [
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "NPC Gift", place: "Saffron City", detail: "Received from the Copycat after returning her Lost Item" },
      ] },
      { vg: "crystal", games: "Crystal", lines: [
        { type: "NPC Gift", place: "Saffron City", detail: "Received from the Copycat after returning her Lost Item" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "NPC Gift", place: "Saffron City", detail: "Received from the Copycat after returning her Lost Item" },
      ] },
    ],
  },
  "machine-part": {
    name: "Machine Part",
    description: "The generator part Team Rocket stole; found in Cerulean Gym, returned to the Power Plant.",
    category: "Plot advancement", pocket: "key",
    gens: [2, 4, 5, 6, 7, 8, 9],
    where: [
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "Overworld", place: "Cerulean Gym", detail: "Hidden in water in the middle of the Gym, after visiting the Power Plant · After visiting the Power Plant" },
      ] },
      { vg: "crystal", games: "Crystal", lines: [
        { type: "Overworld", place: "Cerulean Gym", detail: "Hidden in water in the middle of the Gym, after visiting the Power Plant · After visiting the Power Plant" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Overworld", place: "Cerulean Gym", detail: "Hidden behind a pile of lifebuoys, after defeating the Team Rocket Grunt on Route 24 · After defeating the Team Rocket Grunt on Route 24 · Does not appear on the Dowsing Machine despite being hidden" },
      ] },
    ],
  },
  "silver-wing": {
    name: "Silver Wing",
    description: "A silver feather that stirs Lugia; carry it into the Whirl Islands to find it.",
    category: "Plot advancement", pocket: "key",
    gens: [2, 4, 5, 6, 7, 8, 9],
  },
  "rainbow-wing": {
    name: "Rainbow Wing",
    description: "A rainbow feather that stirs Ho-Oh; carry it up the Tin Tower to find it.",
    category: "Plot advancement", pocket: "key",
    gens: [2, 4, 5, 6, 7, 8, 9],
  },
  "mystery-egg": {
    name: "Mystery Egg",
    description: "An Egg the Day-Care couple found; Mr. Pokémon has you carry it to Elm, and it hatches a Togepi.",
    category: "Plot advancement", pocket: "key",
    gens: [2, 4, 5, 6, 7, 8, 9],
    where: [
      { vg: "gold-silver", games: "Gold/Silver", lines: [
        { type: "NPC Gift", place: "Route 30 (Johto)", detail: "Mr. Pokémon" },
      ] },
      { vg: "crystal", games: "Crystal", lines: [
        { type: "NPC Gift", place: "Route 30 (Johto)", detail: "Mr. Pokémon" },
      ] },
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "NPC Gift", place: "Route 30 (Johto)", detail: "Mr. Pokémon" },
      ] },
    ],
  },
  "gb-sounds": {
    name: "GB Sounds",
    description: "A music player that switches the soundtrack to the original Game Boy arrangements.",
    category: "Gameplay", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
    where: [
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "NPC Gift", place: "Celadon City", detail: "Celadon Condominiums 3F, from Game Freak sound designer · After obtaining all 16 Badges" },
      ] },
    ],
  },
  "tidal-bell": {
    name: "Tidal Bell",
    description: "An ancient bell whose chime summons Lugia in the Whirl Islands.",
    category: "Plot advancement", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
    where: [
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Trainer Reward", place: "Ecruteak City", detail: "Reward for defeating the Kimono Girls", games: "SoulSilver" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Exchange", place: "Slateport City", detail: "From Captain Stern in exchange for the Scanner · Exchange the Scanner", games: "Alpha Sapphire" },
      ] },
    ],
  },
  "data-card-01": {
    name: "Data Card 01",
    description: "Pokéathlon record: total wins.",
    category: "Data cards", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
    prices: [
      { vg: ["heartgold-soulsilver"], games: "HeartGold/SoulSilver", buy: 500, sell: null, cur: "athlete-point" },
    ],
    where: [
      { vg: "heartgold-soulsilver", games: "HeartGold/SoulSilver", lines: [
        { type: "Exchange", place: "Pokéathlon Dome", detail: "Central reception desk · 500 P", games: "HeartGold" },
      ] },
    ],
  },
  "data-card-02": {
    name: "Data Card 02",
    description: "Pokéathlon record: total losses.",
    category: "Data cards", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
  },
  "data-card-03": {
    name: "Data Card 03",
    description: "Pokéathlon record: how many times your Pokémon dashed.",
    category: "Data cards", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
  },
  "data-card-04": {
    name: "Data Card 04",
    description: "Pokéathlon record: how many times your Pokémon jumped.",
    category: "Data cards", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
  },
  "data-card-05": {
    name: "Data Card 05",
    description: "Pokéathlon record: Hurdle Dash wins.",
    category: "Data cards", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
  },
  "data-card-06": {
    name: "Data Card 06",
    description: "Pokéathlon record: Relay Run wins.",
    category: "Data cards", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
  },
  "data-card-07": {
    name: "Data Card 07",
    description: "Pokéathlon record: Pennant Capture wins.",
    category: "Data cards", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
  },
  "data-card-08": {
    name: "Data Card 08",
    description: "Pokéathlon record: Block Smash wins.",
    category: "Data cards", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
  },
  "data-card-09": {
    name: "Data Card 09",
    description: "Pokéathlon record: Disc Catch wins.",
    category: "Data cards", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
  },
  "data-card-10": {
    name: "Data Card 10",
    description: "Pokéathlon record: Snow Throw wins.",
    category: "Data cards", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
  },
  "data-card-11": {
    name: "Data Card 11",
    description: "Pokéathlon record: total points your Pokémon scored.",
    category: "Data cards", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
  },
  "data-card-12": {
    name: "Data Card 12",
    description: "Pokéathlon record: how many times your Pokémon slipped up.",
    category: "Data cards", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
  },
  "data-card-13": {
    name: "Data Card 13",
    description: "Pokéathlon record: how many times your Pokémon got in each other's way.",
    category: "Data cards", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
  },
  "data-card-14": {
    name: "Data Card 14",
    description: "Pokéathlon record: how many times your Pokémon tackled.",
    category: "Data cards", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
  },
  "data-card-15": {
    name: "Data Card 15",
    description: "Pokéathlon record: how many times your Pokémon fell over.",
    category: "Data cards", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
  },
  "data-card-16": {
    name: "Data Card 16",
    description: "Pokéathlon record: Ring Drop wins.",
    category: "Data cards", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
  },
  "data-card-17": {
    name: "Data Card 17",
    description: "Pokéathlon record: Lamp Jump wins.",
    category: "Data cards", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
  },
  "data-card-18": {
    name: "Data Card 18",
    description: "Pokéathlon record: Circle Push wins.",
    category: "Data cards", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
  },
  "data-card-19": {
    name: "Data Card 19",
    description: "Pokéathlon record: Link Pokéathlon wins.",
    category: "Data cards", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
  },
  "data-card-20": {
    name: "Data Card 20",
    description: "Pokéathlon record: Link Pokéathlon losses.",
    category: "Data cards", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
  },
  "data-card-21": {
    name: "Data Card 21",
    description: "Pokéathlon record: individual event wins.",
    category: "Data cards", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
  },
  "data-card-22": {
    name: "Data Card 22",
    description: "Pokéathlon record: individual event losses.",
    category: "Data cards", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
  },
  "data-card-23": {
    name: "Data Card 23",
    description: "Pokéathlon record: how many times you switched Pokémon mid-event.",
    category: "Data cards", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
  },
  "data-card-24": {
    name: "Data Card 24",
    description: "Pokéathlon record: Goal Roll wins.",
    category: "Data cards", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
  },
  "data-card-25": {
    name: "Data Card 25",
    description: "Pokéathlon record: prizes your Pokémon won individually.",
    category: "Data cards", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
  },
  "data-card-26": {
    name: "Data Card 26",
    description: "Pokéathlon record: how many times you gave your Pokémon instructions.",
    category: "Data cards", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
  },
  "data-card-27": {
    name: "Data Card 27",
    description: "Pokéathlon record: total time spent competing.",
    category: "Data cards", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
  },
  "lock-capsule": {
    name: "Lock Capsule",
    description: "A locked capsule from an event that never ran; it could only be opened in Unova.",
    category: "Unused", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
  },
  "photo-album": {
    name: "Photo Album",
    description: "Holds the photos you take at the Goldenrod studio and around Johto.",
    category: "Unused", pocket: "key",
    gens: [4, 5, 6, 7, 8, 9],
  },
  "orange-mail": {
    name: "Orange Mail",
    description: "Hoenn stationery in a Zigzagoon print; a Pokémon carries the message written on it.",
    category: "All mail", pocket: "mail",
    gens: [3],
    prices: [
      { vg: ["ruby-sapphire", "emerald"], games: "Ruby/Sapphire, Emerald", buy: 50, sell: 25, cur: "poke-dollar" },
      { vg: ["firered-leafgreen"], games: "FireRed/LeafGreen", buy: null, sell: 25, cur: "poke-dollar" },
    ],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Overworld", place: "Trick House" },
        { type: "Shop", place: "Petalburg City", detail: "Poké Mart · ₱50" },
      ] },
      { vg: "emerald", games: "Emerald", lines: [
        { type: "Shop", place: "Petalburg City", detail: "Poké Mart · ₱50" },
        { type: "Overworld", place: "Trick House" },
      ] },
      { vg: "firered-leafgreen", games: "FireRed/LeafGreen", lines: [
        { type: "Transfer", place: "Trade from Ruby, Sapphire, or Emerald" },
      ] },
    ],
  },
  "harbor-mail": {
    name: "Harbor Mail",
    description: "Hoenn stationery in a Wingull print; a Pokémon carries the message written on it.",
    category: "All mail", pocket: "mail",
    gens: [3],
    prices: [
      { vg: ["ruby-sapphire", "emerald"], games: "Ruby/Sapphire, Emerald", buy: 50, sell: 25, cur: "poke-dollar" },
      { vg: ["firered-leafgreen"], games: "FireRed/LeafGreen", buy: null, sell: 25, cur: "poke-dollar" },
    ],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Shop", place: "Slateport City", detail: "Poké Mart · ₱50" },
        { type: "Overworld", place: "Abandoned Ship", games: "Ruby" },
        { type: "Overworld", place: "Trick House", games: "Ruby" },
      ] },
      { vg: "emerald", games: "Emerald", lines: [
        { type: "Shop", place: "Slateport City", detail: "Poké Mart · ₱50" },
      ] },
      { vg: "firered-leafgreen", games: "FireRed/LeafGreen", lines: [
        { type: "Exchange", place: "Trade" },
      ] },
    ],
  },
  "glitter-mail": {
    name: "Glitter Mail",
    description: "Hoenn stationery in a sparkling Pikachu print; a Pokémon carries the message written on it.",
    category: "All mail", pocket: "mail",
    gens: [3],
    prices: [
      { vg: ["ruby-sapphire", "emerald", "firered-leafgreen"], games: "Ruby/Sapphire, Emerald, FireRed/LeafGreen", buy: null, sell: 25, cur: "poke-dollar" },
    ],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Story", place: "Trick House", detail: "Trick House reward", games: "Ruby" },
        { type: "Wild Pokémon", place: "Fortree City", detail: "Held by in-game trade Skitty", games: "Sapphire" },
      ] },
      { vg: "emerald", games: "Emerald", lines: [
        { type: "NPC Gift", place: "Lilycove City", detail: "Quiz Lady" },
      ] },
      { vg: "firered-leafgreen", games: "FireRed/LeafGreen", lines: [
        { type: "Exchange", place: "Trade" },
      ] },
    ],
  },
  "mech-mail": {
    name: "Mech Mail",
    description: "Hoenn stationery in a Magnemite print; a Pokémon carries the message written on it.",
    category: "All mail", pocket: "mail",
    gens: [3],
    prices: [
      { vg: ["ruby-sapphire", "emerald"], games: "Ruby/Sapphire, Emerald", buy: 50, sell: 25, cur: "poke-dollar" },
      { vg: ["firered-leafgreen"], games: "FireRed/LeafGreen", buy: null, sell: 25, cur: "poke-dollar" },
    ],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Overworld", place: "Trick House" },
        { type: "Shop", place: "Lilycove City", detail: "Lilycove Department Store · ₱50" },
      ] },
      { vg: "emerald", games: "Emerald", lines: [
        { type: "Shop", place: "Lilycove City", detail: "Lilycove Department Store · ₱50" },
        { type: "Overworld", place: "Trick House" },
      ] },
      { vg: "firered-leafgreen", games: "FireRed/LeafGreen", lines: [
        { type: "Trade" },
      ] },
    ],
  },
  "wood-mail": {
    name: "Wood Mail",
    description: "Hoenn stationery in a Slakoth print; a Pokémon carries the message written on it.",
    category: "All mail", pocket: "mail",
    gens: [3],
    prices: [
      { vg: ["ruby-sapphire", "emerald"], games: "Ruby/Sapphire, Emerald", buy: 50, sell: 25, cur: "poke-dollar" },
      { vg: ["firered-leafgreen"], games: "FireRed/LeafGreen", buy: null, sell: 25, cur: "poke-dollar" },
    ],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Shop", place: "Fortree City", detail: "Poké Mart · ₱50" },
        { type: "Overworld", place: "Trick House" },
      ] },
      { vg: "emerald", games: "Emerald", lines: [
        { type: "Overworld", place: "Trick House" },
        { type: "Shop", place: "Fortree City", detail: "Poké Mart · ₱50" },
      ] },
      { vg: "firered-leafgreen", games: "FireRed/LeafGreen", lines: [
        { type: "Trade" },
      ] },
    ],
  },
  "wave-mail": {
    name: "Wave Mail",
    description: "Hoenn stationery in a Wailmer print; a Pokémon carries the message written on it.",
    category: "All mail", pocket: "mail",
    gens: [3],
    prices: [
      { vg: ["ruby-sapphire", "emerald"], games: "Ruby/Sapphire, Emerald", buy: 50, sell: 25, cur: "poke-dollar" },
      { vg: ["firered-leafgreen"], games: "FireRed/LeafGreen", buy: null, sell: 25, cur: "poke-dollar" },
    ],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Overworld", place: "Trick House" },
        { type: "Shop", place: "Lilycove City", detail: "Lilycove Department Store · ₱50" },
      ] },
      { vg: "emerald", games: "Emerald", lines: [
        { type: "Shop", place: "Lilycove City", detail: "Lilycove Department Store · ₱50" },
        { type: "Overworld", place: "Trick House" },
        { type: "NPC Gift", place: "Pacifidlog Town", detail: "Held by in-game trade Horsea" },
      ] },
      { vg: "firered-leafgreen", games: "FireRed/LeafGreen", lines: [
        { type: "Exchange", place: "Trade" },
      ] },
    ],
  },
  "bead-mail": {
    name: "Bead Mail",
    description: "Hoenn stationery that shows a sketch of the Pokémon carrying it alongside your message.",
    category: "All mail", pocket: "mail",
    gens: [3],
    prices: [
      { vg: ["ruby-sapphire", "emerald", "firered-leafgreen"], games: "Ruby/Sapphire, Emerald, FireRed/LeafGreen", buy: null, sell: 25, cur: "poke-dollar" },
    ],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Overworld", place: "Trick House" },
      ] },
      { vg: "emerald", games: "Emerald", lines: [
        { type: "Overworld", place: "Trick House" },
        { type: "NPC Gift", place: "Lilycove City", detail: "Quiz Lady" },
      ] },
      { vg: "firered-leafgreen", games: "FireRed/LeafGreen", lines: [
        { type: "Transfer", place: "Trade from Ruby/Sapphire/Emerald" },
      ] },
    ],
  },
  "shadow-mail": {
    name: "Shadow Mail",
    description: "Hoenn stationery in a Duskull print; a Pokémon carries the message written on it.",
    category: "All mail", pocket: "mail",
    gens: [3],
    prices: [
      { vg: ["ruby-sapphire", "emerald"], games: "Ruby/Sapphire, Emerald", buy: 50, sell: 25, cur: "poke-dollar" },
      { vg: ["firered-leafgreen"], games: "FireRed/LeafGreen", buy: null, sell: 25, cur: "poke-dollar" },
    ],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Shop", place: "Sootopolis City", detail: "Poké Mart · ₱50" },
        { type: "Overworld", place: "Trick House" },
      ] },
      { vg: "emerald", games: "Emerald", lines: [
        { type: "Shop", place: "Sootopolis City", detail: "Poké Mart · ₱50" },
        { type: "Overworld", place: "Trick House" },
      ] },
      { vg: "firered-leafgreen", games: "FireRed/LeafGreen", lines: [
        { type: "Exchange", place: "Trade from Ruby, Sapphire, or Emerald" },
      ] },
    ],
  },
  "tropic-mail": {
    name: "Tropic Mail",
    description: "Hoenn stationery in a Bellossom print; a Pokémon carries the message written on it.",
    category: "All mail", pocket: "mail",
    gens: [3],
    prices: [
      { vg: ["ruby-sapphire", "emerald", "firered-leafgreen"], games: "Ruby/Sapphire, Emerald, FireRed/LeafGreen", buy: null, sell: 25, cur: "poke-dollar" },
    ],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Overworld", place: "Trick House" },
        { type: "NPC Gift", place: "Pacifidlog Town", detail: "Held by in-game trade Corsola" },
      ] },
      { vg: "emerald", games: "Emerald", lines: [
        { type: "Overworld", place: "Trick House" },
        { type: "NPC Gift", place: "Lilycove City", detail: "Quiz Lady" },
      ] },
      { vg: "firered-leafgreen", games: "FireRed/LeafGreen", lines: [
        { type: "Exchange", place: "Trade" },
      ] },
    ],
  },
  "dream-mail": {
    name: "Dream Mail",
    description: "Hoenn stationery with a dreamy print; a Pokémon carries the message written on it.",
    category: "All mail", pocket: "mail",
    gens: [3],
    prices: [
      { vg: ["ruby-sapphire", "emerald"], games: "Ruby/Sapphire, Emerald", buy: null, sell: 25, cur: "poke-dollar" },
      { vg: ["firered-leafgreen"], games: "FireRed/LeafGreen", buy: 50, sell: 25, cur: "poke-dollar" },
    ],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Exchange", place: "Trade" },
      ] },
      { vg: "emerald", games: "Emerald", lines: [
        { type: "Exchange", place: "Trade" },
      ] },
      { vg: "firered-leafgreen", games: "FireRed/LeafGreen", lines: [
        { type: "Shop", place: "Six Island", detail: "Six Island Poké Mart · ₱50" },
      ] },
    ],
  },
  "fab-mail": {
    name: "Fab Mail",
    description: "Hoenn stationery in a glamorous print; a Pokémon carries the message written on it.",
    category: "All mail", pocket: "mail",
    gens: [3],
    prices: [
      { vg: ["ruby-sapphire", "emerald", "firered-leafgreen"], games: "Ruby/Sapphire, Emerald, FireRed/LeafGreen", buy: null, sell: 25, cur: "poke-dollar" },
    ],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Trade", place: "Trade with another player" },
      ] },
      { vg: "emerald", games: "Emerald", lines: [
        { type: "Trade", place: "Trade with another player" },
      ] },
      { vg: "firered-leafgreen", games: "FireRed/LeafGreen", lines: [
        { type: "NPC Gift", place: "Cerulean City", detail: "In-game trade Jynx · Held by the received Jynx." },
      ] },
    ],
  },
  "retro-mail": {
    name: "Retro Mail",
    description: "Hoenn stationery with a retro Pokémon design; a Pokémon carries the message written on it.",
    category: "All mail", pocket: "mail",
    gens: [3],
    prices: [
      { vg: ["ruby-sapphire", "emerald"], games: "Ruby/Sapphire, Emerald", buy: null, sell: 25, cur: "poke-dollar" },
      { vg: ["firered-leafgreen"], games: "FireRed/LeafGreen", buy: 50, sell: 25, cur: "poke-dollar" },
    ],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Exchange", place: "Trade from another game" },
      ] },
      { vg: "emerald", games: "Emerald", lines: [
        { type: "Wild Pokémon", place: "Battle Frontier (Hoenn)", detail: "Held by in-game trade Meowth" },
      ] },
      { vg: "firered-leafgreen", games: "FireRed/LeafGreen", lines: [
        { type: "Shop", place: "Celadon City", detail: "Celadon Department Store · ₱50" },
      ] },
    ],
  },
  "mach-bike": {
    name: "Mach Bike",
    description: "A bike built for speed; fast enough to climb muddy slopes and cross crumbling floors.",
    category: "Gameplay", pocket: "key",
    gens: [3, 6, 7, 8, 9],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Choice", place: "Rydel's Cycles", detail: "Choice between Mach Bike and Acro Bike; can switch by returning the other bike." },
      ] },
      { vg: "emerald", games: "Emerald", lines: [
        { type: "Choice", place: "Rydel's Cycles", detail: "Choice between Mach Bike and Acro Bike; can switch by returning the other bike." },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Choice", place: "Rydel's Cycles", detail: "After speaking to specific NPCs to unlock both bikes" },
      ] },
    ],
  },
  "acro-bike": {
    name: "Acro Bike",
    description: "A bike built for tricks; wheelies and bunny hops carry it across rails and narrow ledges.",
    category: "Gameplay", pocket: "key",
    gens: [3, 6, 7, 8, 9],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Choice", place: "Rydel's Cycles", detail: "Choice between Acro Bike and Mach Bike" },
      ] },
      { vg: "emerald", games: "Emerald", lines: [
        { type: "Choice", place: "Rydel's Cycles", detail: "Choice between Acro Bike and Mach Bike" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Choice", place: "Rydel's Cycles", detail: "Choice between Acro Bike and Mach Bike; both obtainable after specific NPC interactions · After speaking to required NPCs in Hoenn" },
      ] },
    ],
  },
  "wailmer-pail": {
    name: "Wailmer Pail",
    description: "A Wailmer-shaped watering can for tending Berry plants.",
    category: "Gameplay", pocket: "key",
    gens: [3, 6, 7, 8, 9],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "NPC Gift", place: "Hoenn Route 104", detail: "Pretty Petal Flower Shop (middle sister)" },
      ] },
      { vg: "emerald", games: "Emerald", lines: [
        { type: "NPC Gift", place: "Hoenn Route 104", detail: "Pretty Petal Flower Shop (middle sister)" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Hoenn Route 104", detail: "Pretty Petal Flower Shop (owner)" },
      ] },
    ],
  },
  "devon-goods": {
    name: "Devon Goods",
    description: "A package stolen from Devon Corporation; once you get it back from the thieves, it's bound for Captain Stern in Slateport.",
    category: "Plot advancement", pocket: "key",
    gens: [3],
  },
  "soot-sack": {
    name: "Soot Sack",
    description: "Collects volcanic ash from the grass on Route 113; the glassblower trades flutes and ornaments for it.",
    category: "Gameplay", pocket: "key",
    gens: [3, 6, 7, 8, 9],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "NPC Gift", place: "Hoenn Route 113", detail: "Glass Workshop (from the boss)" },
      ] },
      { vg: "emerald", games: "Emerald", lines: [
        { type: "NPC Gift", place: "Hoenn Route 113", detail: "Glass Workshop (from the boss)" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Hoenn Route 113", detail: "Glass Workshop (from the boss)" },
      ] },
    ],
  },
  "pokeblock-case": {
    name: "Pokéblock Case",
    description: "Holds the Pokéblocks you blend from Berries.",
    category: "Gameplay", pocket: "key",
    gens: [3],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "NPC Gift", place: "Slateport City", detail: "Contest Hall (little girl)" },
      ] },
      { vg: "emerald", games: "Emerald", lines: [
        { type: "NPC Gift", place: "Lilycove City", detail: "Contest Hall (left receptionist)" },
      ] },
    ],
  },
  "letter": {
    name: "Letter",
    description: "A letter from Mr. Stone to his son Steven, waiting deep in Granite Cave.",
    category: "Plot advancement", pocket: "key",
    gens: [3, 6, 7, 8, 9],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "NPC Gift", place: "Devon Corporation", detail: "Mr. Stone after retrieving the stolen briefcase · After retrieving the stolen briefcase" },
      ] },
      { vg: "emerald", games: "Emerald", lines: [
        { type: "NPC Gift", place: "Devon Corporation", detail: "Mr. Stone after retrieving the stolen briefcase · After retrieving the stolen briefcase" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Devon Corporation", detail: "Mr. Stone after retrieving the stolen briefcase · After retrieving the stolen briefcase" },
      ] },
    ],
  },
  "eon-ticket": {
    name: "Eon Ticket",
    description: "An event ticket for the ferry to Southern Island, where Latias or Latios waits.",
    category: "Event items", pocket: "key",
    gens: [3, 6, 7, 8, 9],
  },
  "scanner": {
    name: "Scanner",
    description: "A device salvaged from the Abandoned Ship; Captain Stern trades a Deep Sea Scale or Deep Sea Tooth for it.",
    category: "Plot advancement", pocket: "key",
    gens: [3, 6, 7, 8, 9],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Overworld", place: "Abandoned Ship", detail: "Requires Dive" },
      ] },
      { vg: "emerald", games: "Emerald", lines: [
        { type: "Overworld", place: "Abandoned Ship", detail: "Requires Dive" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Sea Mauville", detail: "Submerged control room; requires Dive" },
      ] },
    ],
  },
  "go-goggles": {
    name: "Go-Goggles",
    description: "Sand-proof goggles that let you push through the sandstorm covering Route 111's desert.",
    category: "Gameplay", pocket: "key",
    gens: [3, 6, 7, 8, 9],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "NPC Gift", place: "Lavaridge Town", detail: "From May or Brendan · After obtaining the Heat Badge · Heat Badge Badge" },
      ] },
      { vg: "emerald", games: "Emerald", lines: [
        { type: "NPC Gift", place: "Lavaridge Town", detail: "From May or Brendan · After obtaining the Heat Badge · Heat Badge Badge" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Lavaridge Town", detail: "From May or Brendan · After obtaining the Heat Badge · Heat Badge Badge" },
      ] },
    ],
  },
  "meteorite": {
    name: "Meteorite",
    description: "The meteorite taken back at Mt. Chimney; in Hoenn's remakes it also lets Deoxys change forme and plays its part in the Delta Episode.",
    category: "Plot advancement", pocket: "key",
    gens: [3, 6, 7, 8, 9],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Overworld", place: "Mt. Chimney", detail: "Inside the machine near Maxie", games: "Ruby" },
        { type: "Overworld", place: "Mt. Chimney", detail: "Inside the machine near Archie", games: "Sapphire" },
      ] },
      { vg: "emerald", games: "Emerald", lines: [
        { type: "Overworld", place: "Mt. Chimney", detail: "Inside the machine near Maxie" },
      ] },
      { vg: "firered-leafgreen", games: "FireRed/LeafGreen", lines: [
        { type: "NPC Gift", place: "Two Island", detail: "Pokémon Network Center, from Bill · After arriving for the first time" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Mt. Chimney", detail: "From Archie after defeating him", games: "Alpha Sapphire" },
        { type: "NPC Gift", place: "Mt. Chimney", detail: "From Maxie after defeating him", games: "Omega Ruby" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Auction", place: "Porto Marinada", detail: "Auction house · If the player owns a Deoxys · Version 3.0.0+" },
      ] },
    ],
  },
  "rm-1-key": {
    name: "Rm. 1 Key",
    description: "Opens Room 1 of the Abandoned Ship.",
    category: "Plot advancement", pocket: "key",
    gens: [3],
  },
  "rm-2-key": {
    name: "Rm. 2 Key",
    description: "Opens Room 2 of the Abandoned Ship.",
    category: "Plot advancement", pocket: "key",
    gens: [3],
  },
  "rm-4-key": {
    name: "Rm. 4 Key",
    description: "Opens Room 4 of the Abandoned Ship.",
    category: "Plot advancement", pocket: "key",
    gens: [3],
  },
  "rm-6-key": {
    name: "Rm. 6 Key",
    description: "Opens Room 6 of the Abandoned Ship.",
    category: "Plot advancement", pocket: "key",
    gens: [3],
  },
  "devon-scope": {
    name: "Devon Scope",
    description: "A Devon Corporation device that reveals the invisible Kecleon blocking Route 120.",
    category: "Gameplay", pocket: "key",
    gens: [3, 6, 7, 8, 9],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "NPC Gift", place: "Hoenn Route 120", detail: "From Steven on the northern bridge" },
      ] },
      { vg: "emerald", games: "Emerald", lines: [
        { type: "NPC Gift", place: "Hoenn Route 120", detail: "From Steven on the northern bridge" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Hoenn Route 120", detail: "From Steven on the northern bridge" },
      ] },
    ],
  },
  "oaks-parcel": {
    name: "Oak’s Parcel",
    description: "A package from the Viridian City Mart for Professor Oak; delivering it earns you your Pokédex.",
    category: "Plot advancement", pocket: "key",
    gens: [1, 3],
  },
  "poke-flute": {
    name: "Poké Flute",
    description: "Its tune wakes any sleeping Pokémon, including the Snorlax blocking Kanto's roads.",
    category: "Plot advancement", pocket: "key",
    gens: [1, 3, 6, 7, 8, 9],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "NPC Gift", place: "Lavender Town", detail: "Volunteer Pokémon House from Mr. Fuji · After defeating Team Rocket at Pokémon Tower", games: "Red" },
      ] },
      { vg: "firered-leafgreen", games: "FireRed/LeafGreen", lines: [
        { type: "NPC Gift", place: "Lavender Town", detail: "Volunteer Pokémon House from Mr. Fuji · After defeating Team Rocket at Pokémon Tower", games: "FireRed" },
      ] },
      { vg: "x-y", games: "X/Y", lines: [
        { type: "NPC Gift", place: "Parfum Palace", detail: "Butler on the balcony · After catching Furfrou · Item is not kept after delivery", games: "X" },
      ] },
      { vg: "lets-go-pikachu-lets-go-eevee", games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", lines: [
        { type: "NPC Gift", place: "Lavender Town", detail: "Volunteer Pokémon House from Mr. Fuji · After defeating Team Rocket at Pokémon Tower", games: "Let’s Go, Pikachu!" },
      ] },
    ],
  },
  "bike-voucher": {
    name: "Bike Voucher",
    description: "A voucher from the Pokémon Fan Club chairman; trades for a free Bicycle in Cerulean City.",
    category: "Plot advancement", pocket: "key",
    gens: [1, 3],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "NPC Gift", place: "Vermilion City", detail: "Pokémon Fan Club Chairman" },
      ] },
      { vg: "yellow", games: "Yellow", lines: [
        { type: "NPC Gift", place: "Vermilion City", detail: "Pokémon Fan Club Chairman" },
      ] },
      { vg: "firered-leafgreen", games: "FireRed/LeafGreen", lines: [
        { type: "NPC Gift", place: "Vermilion City", detail: "Pokémon Fan Club Chairman" },
      ] },
    ],
  },
  "gold-teeth": {
    name: "Gold Teeth",
    description: "The Safari Zone Warden's lost dentures; return them and he teaches Strength.",
    category: "Plot advancement", pocket: "key",
    gens: [1, 3, 7, 8, 9],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "Overworld", place: "Safari Zone (Kanto - Area 3)" },
      ] },
      { vg: "yellow", games: "Yellow", lines: [
        { type: "Overworld", place: "Safari Zone (Kanto - Area 3)" },
      ] },
      { vg: "firered-leafgreen", games: "FireRed/LeafGreen", lines: [
        { type: "Overworld", place: "Safari Zone (Kanto - Area 3)" },
      ] },
      { vg: "lets-go-pikachu-lets-go-eevee", games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", lines: [
        { type: "NPC Gift", place: "Route 19 (Kanto)", detail: "Jessie" },
      ] },
    ],
  },
  "lift-key": {
    name: "Lift Key",
    description: "Operates the elevator in Team Rocket's Celadon hideout.",
    category: "Plot advancement", pocket: "key",
    gens: [1, 3, 5, 7, 8, 9],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "NPC Defeat", place: "Team Rocket Hideout", detail: "Dropped by a Team Rocket Grunt on BF4 after being defeated and spoken to again" },
      ] },
      { vg: "yellow", games: "Yellow", lines: [
        { type: "NPC Defeat", place: "Team Rocket Hideout", detail: "Dropped by a Team Rocket Grunt on BF4 immediately after being defeated" },
      ] },
      { vg: "firered-leafgreen", games: "FireRed/LeafGreen", lines: [
        { type: "NPC Defeat", place: "Team Rocket Hideout", detail: "Dropped by a Team Rocket Grunt on BF4 immediately after being defeated" },
      ] },
      { vg: "lets-go-pikachu-lets-go-eevee", games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", lines: [
        { type: "Overworld", place: "Team Rocket Hideout", detail: "Found on a wall on BF4 after defeating a Grunt" },
      ] },
    ],
  },
  "silph-scope": {
    name: "Silph Scope",
    description: "A Silph Co. scope that shows the ghosts in Lavender Town's Pokémon Tower for what they are.",
    category: "Plot advancement", pocket: "key",
    gens: [1, 3, 7, 8, 9],
    where: [
      { vg: "red-blue", games: "Red/Blue", lines: [
        { type: "NPC Defeat", place: "Team Rocket Hideout", detail: "Dropped by Giovanni after defeating him" },
      ] },
      { vg: "yellow", games: "Yellow", lines: [
        { type: "NPC Defeat", place: "Team Rocket Hideout", detail: "Dropped by Giovanni after defeating him" },
      ] },
      { vg: "firered-leafgreen", games: "FireRed/LeafGreen", lines: [
        { type: "NPC Defeat", place: "Team Rocket Hideout", detail: "Dropped by Giovanni after defeating him" },
      ] },
      { vg: "lets-go-pikachu-lets-go-eevee", games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", lines: [
        { type: "NPC Gift", place: "Team Rocket Hideout", detail: "Given by Giovanni after defeating him" },
      ] },
    ],
  },
  "fame-checker": {
    name: "Fame Checker",
    description: "Collects notes and quotes about Kanto's famous people as you meet them.",
    category: "Gameplay", pocket: "key",
    gens: [3],
    where: [
      { vg: "firered-leafgreen", games: "FireRed/LeafGreen", lines: [
        { type: "NPC Gift", place: "Cerulean City", detail: "From Blue after defeating him · After defeating Blue" },
      ] },
    ],
  },
  "tm-case": {
    name: "TM Case",
    description: "Holds all your TMs and HMs.",
    category: "Gameplay", pocket: "key",
    gens: [3, 7, 8, 9],
    where: [
      { vg: "firered-leafgreen", games: "FireRed/LeafGreen", lines: [
        { type: "Story", place: "Automatically obtained when the player obtains their first TM", detail: "After obtaining the first TM · Earliest without trading is Pewter Gym" },
      ] },
    ],
  },
  "berry-pouch": {
    name: "Berry Pouch",
    description: "Holds all your Berries.",
    category: "Gameplay", pocket: "key",
    gens: [3],
    where: [
      { vg: "firered-leafgreen", games: "FireRed/LeafGreen", lines: [
        { type: "Story", place: "Route 03 (Kanto)", detail: "Automatically obtained upon acquiring the first Berry" },
      ] },
    ],
  },
  "teachy-tv": {
    name: "Teachy TV",
    description: "A television that plays tutorials on the basics of catching and battling.",
    category: "Gameplay", pocket: "key",
    gens: [3],
    where: [
      { vg: "firered-leafgreen", games: "FireRed/LeafGreen", lines: [
        { type: "NPC Gift", place: "Viridian City", detail: "Gift from the old man who teaches how to catch Pokémon" },
      ] },
    ],
  },
  "tri-pass": {
    name: "Tri-Pass",
    description: "A ferry pass for the first three Sevii Islands.",
    category: "Plot advancement", pocket: "key",
    gens: [3],
    where: [
      { vg: "firered-leafgreen", games: "FireRed/LeafGreen", lines: [
        { type: "NPC Gift", place: "Pokémon Network Center", detail: "Given by Celio upon arrival" },
      ] },
    ],
  },
  "rainbow-pass": {
    name: "Rainbow Pass",
    description: "A ferry pass for all seven Sevii Islands, and between Vermilion and the islands.",
    category: "Plot advancement", pocket: "key",
    gens: [3],
    where: [
      { vg: "firered-leafgreen", games: "FireRed/LeafGreen", lines: [
        { type: "NPC Gift", place: "Pokémon Network Center", detail: "Given by Celio after obtaining the Ruby · After obtaining the Ruby" },
      ] },
    ],
  },
  "tea": {
    name: "Tea",
    description: "Tea from the old woman in Celadon Mansion; the thirsty guards let you into Saffron City for it.",
    category: "Plot advancement", pocket: "key",
    gens: [3, 7, 8, 9],
    where: [
      { vg: "firered-leafgreen", games: "FireRed/LeafGreen", lines: [
        { type: "NPC Gift", place: "Celadon Condominiums", detail: "Manager's Suite, received from the Manager" },
      ] },
      { vg: "lets-go-pikachu-lets-go-eevee", games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", lines: [
        { type: "NPC Gift", place: "Celadon City", detail: "Received from Brock in front of the Celadon Condominiums" },
      ] },
    ],
  },
  "mysticticket": {
    name: "MysticTicket",
    description: "An event ticket for the ferry to Navel Rock, where Lugia and Ho-Oh roost.",
    category: "Event items", pocket: "key",
    gens: [3],
  },
  "auroraticket": {
    name: "AuroraTicket",
    description: "An event ticket for the ferry to Birth Island, where Deoxys waits.",
    category: "Event items", pocket: "key",
    gens: [3],
  },
  "powder-jar": {
    name: "Powder Jar",
    description: "Stores the Berry Powder ground in the Berry Crush minigame, tradable for medicine.",
    category: "Gameplay", pocket: "key",
    gens: [3],
    where: [
      { vg: "emerald", games: "Emerald", lines: [
        { type: "NPC Gift", place: "Slateport City", detail: "Woman in the upper-right stall of Slateport Market" },
      ] },
      { vg: "firered-leafgreen", games: "FireRed/LeafGreen", lines: [
        { type: "NPC Gift", place: "Cerulean City", detail: "Old man in the house second to the right of Cerulean Cave" },
      ] },
    ],
  },
  "ruby": {
    name: "Ruby",
    description: "A red gem from Mt. Ember; with the Sapphire, it restores the Sevii Islands' trade network.",
    category: "Plot advancement", pocket: "key",
    gens: [3],
    where: [
      { vg: "firered-leafgreen", games: "FireRed/LeafGreen", lines: [
        { type: "Overworld", place: "Mt. Ember", detail: "B5F" },
      ] },
    ],
  },
  "sapphire": {
    name: "Sapphire",
    description: "A blue gem from the Dotted Hole; with the Ruby, it restores the Sevii Islands' trade network.",
    category: "Plot advancement", pocket: "key",
    gens: [3],
    where: [
      { vg: "firered-leafgreen", games: "FireRed/LeafGreen", lines: [
        { type: "NPC Defeat", place: "Rocket Warehouse", detail: "Scientist Gideon · Recovered after defeating Scientist Gideon." },
      ] },
    ],
  },
  "magma-emblem": {
    name: "Magma Emblem",
    description: "Team Magma's insignia; held up at Jagged Pass, it opens their hidden hideout.",
    category: "Plot advancement", pocket: "key",
    gens: [3],
    where: [
      { vg: "emerald", games: "Emerald", lines: [
        { type: "NPC Gift", place: "Mt. Pyre", detail: "Summit; from an old lady after confronting Team Aqua · After confronting Team Aqua" },
      ] },
    ],
  },
  "old-sea-map": {
    name: "Old Sea Map",
    description: "An event-only chart of the way to Faraway Island, where Mew hides.",
    category: "Event items", pocket: "key",
    gens: [3],
    where: [
      { vg: "emerald", games: "Emerald", lines: [
        { type: "Event", place: "Event distribution (Japan and Taiwan)", detail: "Not distributed outside Japan and Taiwan." },
      ] },
    ],
  },
  "douse-drive": {
    name: "Douse Drive",
    description: "Slotted into Genesect, turns its Techno Blast into a Water-type move.",
    category: "Species-specific", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    fling: { power: 70 },
    prices: [
      { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "NPC Gift", place: "P2 Laboratory", detail: "Show Genesect to Scientist Dudley" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "NPC Gift", place: "P2 Laboratory", detail: "Show Genesect to Scientist Dudley" },
      ] },
      { vg: "x-y", games: "X/Y", lines: [
        { type: "NPC Gift", place: "Ambrette Town", detail: "Show Genesect to a Hiker at the Fossil Lab" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Mauville City", detail: "Show Genesect to a Street Thug" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Alola Route 8", detail: "From Colress after becoming Champion · After becoming Champion" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Alola Route 8", detail: "From Colress after becoming Champion · After becoming Champion" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Bargain Shop", place: "Stow-on-Side", detail: "Bargain shop keeper · If the player owns a Genesect" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Exchange", place: "Vert Sector 7", detail: "Mega Shard exchange after Side Mission 191 · ₱540 · After initiating Side Mission 191: Collecting Four Drives" },
      ] },
    ],
  },
  "shock-drive": {
    name: "Shock Drive",
    description: "Slotted into Genesect, turns its Techno Blast into an Electric-type move.",
    category: "Species-specific", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    fling: { power: 70 },
    prices: [
      { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "NPC Gift", place: "P2 Laboratory", detail: "Scientist Dudley (show Genesect)" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "NPC Gift", place: "P2 Laboratory", detail: "Scientist Dudley (show Genesect)" },
      ] },
      { vg: "x-y", games: "X/Y", lines: [
        { type: "NPC Gift", place: "Ambrette Town", detail: "Fossil Lab Hiker (show Genesect)" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Mauville City", detail: "Street Thug (show Genesect)" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Alola Route 8", detail: "Colress · After becoming Champion" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Alola Route 8", detail: "Colress · After becoming Champion" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Shop", place: "Stow-on-Side", detail: "Bargain shop keeper · If the player owns a Genesect" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Exchange", place: "Vert Sector 7", detail: "Side Mission 191 reward · ₱540 · After initiating Side Mission 191: Collecting Four Drives" },
      ] },
    ],
  },
  "burn-drive": {
    name: "Burn Drive",
    description: "Slotted into Genesect, turns its Techno Blast into a Fire-type move.",
    category: "Species-specific", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    fling: { power: 70 },
    prices: [
      { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "NPC Gift", place: "P2 Laboratory", detail: "Show Genesect to Scientist Dudley" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "NPC Gift", place: "P2 Laboratory", detail: "Show Genesect to Scientist Dudley" },
      ] },
      { vg: "x-y", games: "X/Y", lines: [
        { type: "NPC Gift", place: "Ambrette Town", detail: "Fossil Lab (show Genesect to a Hiker)" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Mauville City", detail: "Show Genesect to a Street Thug" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Alola Route 8", detail: "From Colress after becoming Champion · After becoming Champion" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Alola Route 8", detail: "From Colress after becoming Champion · After becoming Champion" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Shop", place: "Stow-on-Side", detail: "Bargain shop keeper · If the player owns a Genesect" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Exchange", place: "Vert Sector 7", detail: "540 Mega Shards · ₱540 · After initiating Side Mission 191: \"Collecting Four Drives\"" },
      ] },
    ],
  },
  "chill-drive": {
    name: "Chill Drive",
    description: "Slotted into Genesect, turns its Techno Blast into an Ice-type move.",
    category: "Species-specific", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    fling: { power: 70 },
    prices: [
      { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "NPC Gift", place: "P2 Laboratory", detail: "Show Genesect to Scientist Dudley" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "NPC Gift", place: "P2 Laboratory", detail: "Show Genesect to Scientist Dudley" },
      ] },
    ],
  },
  "sweet-heart": {
    name: "Sweet Heart",
    description: "A heart-shaped chocolate that restores 20 HP.",
    category: "Healing", pocket: "medicine",
    gens: [5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 50, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 1500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "NPC Gift", place: "Feeling Check", detail: "Amount varies" },
      ] },
      { vg: "x-y", games: "X/Y", lines: [
        { type: "NPC Gift", place: "Camphrier Town", detail: "Daily gift · Once per day; five on February 14 and March 14" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "NPC Gift", place: "Battle Café" },
      ] },
    ],
  },
  "greet-mail": {
    name: "Greet Mail",
    description: "Unova stationery meant for a first hello; a Pokémon carries the message written on it.",
    category: "All mail", pocket: "mail",
    gens: [5, 6, 7, 8, 9],
    prices: [
      { vg: ["black-white", "black-2-white-2"], games: "Black/White, Black 2/White 2", buy: 50, sell: 25, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Shop", place: "Shopping Mall Nine and most Poké Marts", detail: "₱50 · Unavailable in Nimbasa City, Mistralton City, Icirrus City, and the Pokémon League" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Shop", place: "Shopping Mall Nine and most Poké Marts", detail: "₱50 · Unavailable in Nimbasa City, Mistralton City, Lacunosa Town, Victory Road, Pokémon League, and Striaton City" },
      ] },
    ],
  },
  "favored-mail": {
    name: "Favored Mail",
    description: "Unova stationery for writing about your favorite things; a Pokémon carries the message written on it.",
    category: "All mail", pocket: "mail",
    gens: [5, 6, 7, 8, 9],
    prices: [
      { vg: ["black-white", "black-2-white-2"], games: "Black/White, Black 2/White 2", buy: 50, sell: 25, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Shop", place: "Shopping Mall Nine and most Poké Marts", detail: "₱50 · Unavailable in Nimbasa, Mistralton, Icirrus, and Pokémon League Poké Marts" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Overworld", place: "Unova Route 11" },
        { type: "Trainer Reward", place: "Pokéstar Studios", detail: "Gift after completing a movie" },
      ] },
    ],
  },
  "rsvp-mail": {
    name: "RSVP Mail",
    description: "Unova stationery for sending an invitation; a Pokémon carries the message written on it.",
    category: "All mail", pocket: "mail",
    gens: [5, 6, 7, 8, 9],
    prices: [
      { vg: ["black-white", "black-2-white-2"], games: "Black/White, Black 2/White 2", buy: 50, sell: 25, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Shop", place: "Shopping Mall Nine and most Poké Marts", detail: "₱50 · Unavailable in Nimbasa, Mistralton, Icirrus, and Pokémon League Poké Marts" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Shop", place: "Shopping Mall Nine and most Poké Marts", detail: "₱50 · Unavailable in Nimbasa, Mistralton, Lacunosa, Victory Road, Pokémon League, and Striaton Poké Marts" },
      ] },
    ],
  },
  "thanks-mail": {
    name: "Thanks Mail",
    description: "Unova stationery for saying thank you; a Pokémon carries the message written on it.",
    category: "All mail", pocket: "mail",
    gens: [5, 6, 7, 8, 9],
    prices: [
      { vg: ["black-white", "black-2-white-2"], games: "Black/White, Black 2/White 2", buy: 50, sell: 25, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Shop", place: "Shopping Mall Nine and most Poké Marts", detail: "₱50 · Unavailable in Nimbasa, Mistralton, Icirrus, and Pokémon League Poké Marts." },
        { type: "Starting Item", place: "Mail from Bianca" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Shop", place: "Shopping Mall Nine and most Poké Marts", detail: "₱50 · Unavailable in Nimbasa, Mistralton, Lacunosa, Victory Road, Pokémon League, and Striaton Poké Marts." },
      ] },
    ],
  },
  "inquiry-mail": {
    name: "Inquiry Mail",
    description: "Unova stationery for asking a question; a Pokémon carries the message written on it.",
    category: "All mail", pocket: "mail",
    gens: [5, 6, 7, 8, 9],
    prices: [
      { vg: ["black-white", "black-2-white-2"], games: "Black/White, Black 2/White 2", buy: 50, sell: 25, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Shop", place: "Shopping Mall Nine", detail: "Shopping Mall Nine · ₱50 · Also sold in most Poké Marts except Nimbasa, Mistralton, Icirrus, and Pokémon League." },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Shop", place: "Shopping Mall Nine", detail: "Shopping Mall Nine · ₱50 · Also sold in most Poké Marts except Nimbasa, Mistralton, Lacunosa, Victory Road, Pokémon League, and Striaton." },
      ] },
    ],
  },
  "like-mail": {
    name: "Like Mail",
    description: "Unova stationery for recommending something; a Pokémon carries the message written on it.",
    category: "All mail", pocket: "mail",
    gens: [5, 6, 7, 8, 9],
    prices: [
      { vg: ["black-white", "black-2-white-2"], games: "Black/White, Black 2/White 2", buy: 50, sell: 25, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Shop", place: "Shopping Mall Nine and most Poké Marts (exceptions apply)", detail: "₱50" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Shop", place: "Shopping Mall Nine and most Poké Marts (exceptions apply)", detail: "₱50" },
      ] },
    ],
  },
  "reply-mail": {
    name: "Reply Mail",
    description: "Unova stationery for writing back; a Pokémon carries the message written on it.",
    category: "All mail", pocket: "mail",
    gens: [5, 6, 7, 8, 9],
    prices: [
      { vg: ["black-white", "black-2-white-2"], games: "Black/White, Black 2/White 2", buy: 50, sell: 25, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Shop", place: "Shopping Mall Nine and every Poké Mart except those in Nimbasa, Mistralton, Icirrus, and the Pokémon League", detail: "₱50" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Shop", place: "Shopping Mall Nine and every Poké Mart except those in Nimbasa, Mistralton, Lacunosa, Victory Road, the Pokémon League, and Striaton", detail: "₱50" },
      ] },
    ],
  },
  "bridge-mail-s": {
    name: "Bridge Mail S",
    description: "Unova stationery picturing the Skyarrow Bridge; a Pokémon carries the message written on it.",
    category: "All mail", pocket: "mail",
    gens: [5, 6, 7, 8, 9],
  },
  "bridge-mail-d": {
    name: "Bridge Mail D",
    description: "Unova stationery picturing the Driftveil Drawbridge; a Pokémon carries the message written on it.",
    category: "All mail", pocket: "mail",
    gens: [5, 6, 7, 8, 9],
  },
  "bridge-mail-t": {
    name: "Bridge Mail T",
    description: "Unova stationery picturing the Tubeline Bridge; a Pokémon carries the message written on it.",
    category: "All mail", pocket: "mail",
    gens: [5, 6, 7, 8, 9],
  },
  "bridge-mail-v": {
    name: "Bridge Mail V",
    description: "Unova stationery picturing the Village Bridge; a Pokémon carries the message written on it.",
    category: "All mail", pocket: "mail",
    gens: [5, 6, 7, 8, 9],
  },
  "bridge-mail-m": {
    name: "Bridge Mail M",
    description: "Unova stationery picturing the Marvelous Bridge; a Pokémon carries the message written on it.",
    category: "All mail", pocket: "mail",
    gens: [5, 6, 7, 8, 9],
  },
  "prism-scale": {
    name: "Prism Scale",
    description: "A rainbow-hued scale; Feebas evolves into Milotic when traded holding it.",
    category: "Evolution", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 250, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 1000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 750, cur: "poke-dollar" },
    ],
  },
  "eviolite": {
    name: "Eviolite",
    description: "Boosts the Defense and Sp. Def of a holder that can still evolve by half.",
    category: "Held items", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    fling: { power: 40 },
    prices: [
      { vg: ["black-white", "x-y"], games: "Black/White, X/Y", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "sword-shield"], games: "Sun/Moon, Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 50000, sell: 12500, cur: "poke-dollar" },
    ],
  },
  "float-stone": {
    name: "Float Stone",
    description: "Halves the holder's weight.",
    category: "Held items", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["black-white", "black-2-white-2"], games: "Black/White, Black 2/White 2", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 2500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Overworld", place: "Opelucid City" },
      ] },
    ],
  },
  "rocky-helmet": {
    name: "Rocky Helmet",
    description: "Anything that hits the holder with a contact move loses a sixth of its HP.",
    category: "Held items", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    fling: { power: 60 },
    prices: [
      { vg: ["black-white", "x-y", "omega-ruby-alpha-sapphire"], games: "Black/White, X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 50000, sell: 12500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Overworld", place: "Cold Storage" },
      ] },
    ],
  },
  "air-balloon": {
    name: "Air Balloon",
    description: "The holder floats above Ground-type moves until the balloon pops on the first hit it takes.",
    category: "Held items", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["black-white", "x-y", "omega-ruby-alpha-sapphire"], games: "Black/White, X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 15000, sell: 3750, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Exchange", place: "Battle Subway", detail: "48 BP", games: "Black" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Wild Pokémon", place: "Held by wild Drifblim in dark grass", games: "Black 2" },
      ] },
    ],
  },
  "red-card": {
    name: "Red Card",
    description: "When a damaging move hits the holder, the attacker is dragged out and swapped for a teammate; then the card is gone.",
    category: "Held items", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["black-white", "black-2-white-2"], games: "Black/White, Black 2/White 2", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 30000, sell: 7500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Exchange", place: "Battle Subway", detail: "32 BP" },
      ] },
    ],
  },
  "ring-target": {
    name: "Ring Target",
    description: "Moves the holder would normally be immune to by type can hit it.",
    category: "Held items", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 10000, sell: 2500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Overworld", place: "Opelucid City" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Overworld", place: "Opelucid City" },
      ] },
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Exchange", place: "Battle Maison", detail: "32 BP · 32 BP" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "16 BP · 16 BP" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Bargain Shop", place: "Stow-on-Side" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Shop", place: "Levincia", detail: "Delibird Presents (after completing the main storyline) · ₱10000 · After completing the main storyline" },
      ] },
    ],
  },
  "binding-band": {
    name: "Binding Band",
    description: "Trapping moves like Bind and Wrap squeeze the holder's target for more damage each turn.",
    category: "Held items", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["black-white", "x-y"], games: "Black/White, X/Y", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon"], games: "Sun/Moon", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 20000, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Exchange", place: "Battle Subway", detail: "48 BP" },
      ] },
    ],
  },
  "absorb-bulb": {
    name: "Absorb Bulb",
    description: "Raises the holder's Sp. Atk once after it is hit by a Water-type move, then breaks.",
    category: "Held items", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["black-white", "x-y", "omega-ruby-alpha-sapphire"], games: "Black/White, X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 5000, sell: 1250, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Exchange", place: "Battle Subway", detail: "32 BP", games: "Black" },
      ] },
    ],
  },
  "cell-battery": {
    name: "Cell Battery",
    description: "Raises the holder's Attack once after it is hit by an Electric-type move, then breaks.",
    category: "Held items", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["black-white", "x-y", "omega-ruby-alpha-sapphire"], games: "Black/White, X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "sword-shield"], games: "Sun/Moon, Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 5000, sell: 1250, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Exchange", place: "Battle Subway", detail: "32 BP", games: "Black" },
        { type: "Overworld", place: "Opelucid City" },
      ] },
    ],
  },
  "eject-button": {
    name: "Eject Button",
    description: "When a damaging move hits the holder, it swaps out for a teammate; then the button is gone.",
    category: "Held items", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["black-white", "black-2-white-2"], games: "Black/White, Black 2/White 2", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 30000, sell: 7500, cur: "poke-dollar" },
    ],
  },
  "fire-gem": {
    name: "Fire Gem",
    description: "Powers up the holder's next Fire-type move, then shatters.",
    category: "Jewels", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    prices: [
      { vg: ["black-2-white-2", "x-y", "sun-moon"], games: "Black 2/White 2, X/Y, Sun/Moon", buy: null, sell: 100, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Event", games: "Black" },
        { type: "Overworld", place: "Dust cloud", games: "Black" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "NPC Gift", place: "Accumula Town", detail: "If the player chose Tepig", games: "Black 2" },
        { type: "Overworld", place: "Reversal Mountain", games: "White 2" },
        { type: "Overworld", place: "Dust clouds in various caves", detail: "Includes Chargestone Cave, Mistralton Cave, Clay Tunnel, Twist Mountain, Underground Ruins, Victory Road, Wellspring Cave, Seaside Cave, Giant Chasm.", games: "White 2" },
      ] },
    ],
  },
  "water-gem": {
    name: "Water Gem",
    description: "Powers up the holder's next Water-type move, then shatters.",
    category: "Jewels", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    prices: [
      { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "lets-go-pikachu-lets-go-eevee"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Let’s Go, Pikachu!/Let’s Go, Eevee!", buy: null, sell: 100, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Event", games: "Black" },
        { type: "Overworld", place: "Dust cloud", games: "White" },
      ] },
    ],
  },
  "electric-gem": {
    name: "Electric Gem",
    description: "Powers up the holder's next Electric-type move, then shatters.",
    category: "Jewels", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    prices: [
      { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "lets-go-pikachu-lets-go-eevee"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Let’s Go, Pikachu!/Let’s Go, Eevee!", buy: null, sell: 100, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Overworld", place: "Dust cloud" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Overworld", place: "Chargestone Cave" },
        { type: "Overworld", place: "Dust cloud", detail: "Multiple caves" },
      ] },
    ],
  },
  "grass-gem": {
    name: "Grass Gem",
    description: "Powers up the holder's next Grass-type move, then shatters.",
    category: "Jewels", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    prices: [
      { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "lets-go-pikachu-lets-go-eevee"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Let’s Go, Pikachu!/Let’s Go, Eevee!", buy: null, sell: 100, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Overworld", place: "Dust cloud" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Overworld", place: "Dust cloud in various caves", detail: "Chargestone Cave, Mistralton Cave, Clay Tunnel, Twist Mountain, Underground Ruins, Victory Road, Wellspring Cave, Seaside Cave, Giant Chasm" },
        { type: "Overworld", place: "Lostlorn Forest", games: "Black 2" },
        { type: "Overworld", place: "Accumula Town", detail: "If the player chose Snivy", games: "White 2" },
      ] },
    ],
  },
  "ice-gem": {
    name: "Ice Gem",
    description: "Powers up the holder's next Ice-type move, then shatters.",
    category: "Jewels", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    prices: [
      { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "lets-go-pikachu-lets-go-eevee"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Let’s Go, Pikachu!/Let’s Go, Eevee!", buy: null, sell: 100, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Mining", place: "Dust cloud" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Overworld", place: "Giant Chasm" },
      ] },
    ],
  },
  "fighting-gem": {
    name: "Fighting Gem",
    description: "Powers up the holder's next Fighting-type move, then shatters.",
    category: "Jewels", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    prices: [
      { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 100, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Event", games: "Black" },
        { type: "Overworld", place: "Dust cloud", games: "White" },
      ] },
    ],
  },
  "poison-gem": {
    name: "Poison Gem",
    description: "Powers up the holder's next Poison-type move, then shatters.",
    category: "Jewels", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    prices: [
      { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "lets-go-pikachu-lets-go-eevee"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Let’s Go, Pikachu!/Let’s Go, Eevee!", buy: null, sell: 100, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Overworld", place: "Dust cloud" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Overworld", place: "Castelia Sewers", detail: "Spring or Summer" },
      ] },
    ],
  },
  "ground-gem": {
    name: "Ground Gem",
    description: "Powers up the holder's next Ground-type move, then shatters.",
    category: "Jewels", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    prices: [
      { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "lets-go-pikachu-lets-go-eevee"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Let’s Go, Pikachu!/Let’s Go, Eevee!", buy: null, sell: 100, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Overworld", place: "Dust clouds" },
        { type: "Dream", place: "Icy Cave" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Overworld", place: "Dust clouds (Chargestone Cave, Mistralton Cave, Clay Tunnel, Twist Mountain, Underground Ruins, Victory Road, Wellspring Cave, Seaside Cave, Giant Chasm)" },
        { type: "Overworld", place: "Desert Resort" },
      ] },
    ],
  },
  "flying-gem": {
    name: "Flying Gem",
    description: "Powers up the holder's next Flying-type move, then shatters.",
    category: "Jewels", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    prices: [
      { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 100, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Overworld", place: "Dust cloud" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Overworld", place: "Mistralton City" },
      ] },
    ],
  },
  "psychic-gem": {
    name: "Psychic Gem",
    description: "Powers up the holder's next Psychic-type move, then shatters.",
    category: "Jewels", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    prices: [
      { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 100, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Mining", place: "Dust cloud" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Overworld", place: "Dreamyard" },
        { type: "Mining", place: "Dust cloud in Chargestone Cave, Mistralton Cave, Clay Tunnel, Twist Mountain, Underground Ruins, Victory Road, Wellspring Cave, Seaside Cave, Giant Chasm" },
      ] },
    ],
  },
  "bug-gem": {
    name: "Bug Gem",
    description: "Powers up the holder's next Bug-type move, then shatters.",
    category: "Jewels", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    prices: [
      { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "lets-go-pikachu-lets-go-eevee"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Let’s Go, Pikachu!/Let’s Go, Eevee!", buy: null, sell: 100, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Event", games: "Black" },
        { type: "Overworld", place: "Dust cloud", games: "White" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Overworld", place: "Pinwheel Forest", games: "Black 2" },
        { type: "Overworld", place: "Dust cloud", detail: "Chargestone Cave, Mistralton Cave, Clay Tunnel, Twist Mountain, Underground Ruins, Victory Road, Wellspring Cave, Seaside Cave, Giant Chasm", games: "White 2" },
      ] },
    ],
  },
  "rock-gem": {
    name: "Rock Gem",
    description: "Powers up the holder's next Rock-type move, then shatters.",
    category: "Jewels", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    prices: [
      { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 100, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Overworld", place: "Dust cloud" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Overworld", place: "Relic Passage" },
        { type: "Shop", place: "Join Avenue", detail: "Antique Shop" },
      ] },
    ],
  },
  "ghost-gem": {
    name: "Ghost Gem",
    description: "Powers up the holder's next Ghost-type move, then shatters.",
    category: "Jewels", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    prices: [
      { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "lets-go-pikachu-lets-go-eevee"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Let’s Go, Pikachu!/Let’s Go, Eevee!", buy: null, sell: 100, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Event", games: "Black" },
        { type: "Overworld", place: "Dust cloud", games: "White" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Overworld", place: "Celestial Tower", games: "Black 2" },
        { type: "Overworld", place: "Dust cloud in various caves", detail: "Chargestone Cave, Mistralton Cave, Clay Tunnel, Twist Mountain, Underground Ruins, Victory Road, Wellspring Cave, Seaside Cave, Giant Chasm.", games: "White 2" },
      ] },
    ],
  },
  "dark-gem": {
    name: "Dark Gem",
    description: "Powers up the holder's next Dark-type move, then shatters.",
    category: "Jewels", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    prices: [
      { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 100, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Event", games: "Black" },
        { type: "Overworld", place: "Dust cloud", games: "White" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Overworld", place: "Unova Route 9", games: "Black 2" },
        { type: "Overworld", place: "Dust cloud locations", games: "White 2" },
      ] },
    ],
  },
  "steel-gem": {
    name: "Steel Gem",
    description: "Powers up the holder's next Steel-type move, then shatters.",
    category: "Jewels", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    prices: [
      { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "lets-go-pikachu-lets-go-eevee"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Let’s Go, Pikachu!/Let’s Go, Eevee!", buy: null, sell: 100, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Mining", place: "Dust cloud" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Mining", place: "Clay Tunnel", detail: "Clay Tunnel · Finite method" },
      ] },
    ],
  },
  "health-wing": {
    name: "Health Feather",
    description: "Adds a single HP effort point, for fine-tuning.",
    category: "Vitamins", pocket: "medicine",
    gens: [5, 6, 7, 8, 9],
    fling: { power: 20 },
    prices: [
      { vg: ["black-white", "x-y", "omega-ruby-alpha-sapphire"], games: "Black/White, X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 150, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 75, cur: "poke-dollar" },
    ],
  },
  "muscle-wing": {
    name: "Muscle Feather",
    description: "Adds a single Attack effort point, for fine-tuning.",
    category: "Vitamins", pocket: "medicine",
    gens: [5, 6, 7, 8, 9],
    fling: { power: 20 },
    prices: [
      { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 150, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 75, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Overworld", place: "Driftveil Drawbridge", detail: "Flying Pokémon's shadow", games: "Black" },
        { type: "Overworld", place: "Marvelous Bridge", detail: "Flying Pokémon's shadow", games: "Black" },
      ] },
    ],
  },
  "resist-wing": {
    name: "Resist Feather",
    description: "Adds a single Defense effort point, for fine-tuning.",
    category: "Vitamins", pocket: "medicine",
    gens: [5, 6, 7, 8, 9],
    fling: { power: 20 },
    prices: [
      { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 150, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 75, cur: "poke-dollar" },
    ],
  },
  "genius-wing": {
    name: "Genius Feather",
    description: "Adds a single Sp. Atk effort point, for fine-tuning.",
    category: "Vitamins", pocket: "medicine",
    gens: [5, 6, 7, 8, 9],
    fling: { power: 20 },
    prices: [
      { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 150, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 75, cur: "poke-dollar" },
    ],
  },
  "clever-wing": {
    name: "Clever Feather",
    description: "Adds a single Sp. Def effort point, for fine-tuning.",
    category: "Vitamins", pocket: "medicine",
    gens: [5, 6, 7, 8, 9],
    fling: { power: 20 },
    prices: [
      { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 150, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 75, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Overworld", place: "Marvelous Bridge", detail: "Flying Pokémon's shadow", games: "Black" },
        { type: "Overworld", place: "Driftveil Drawbridge", detail: "Flying Pokémon's shadow", games: "Black" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Overworld", place: "Route 5 - Galar", detail: "Hidden recurring item", games: "Sword" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Auction", place: "Porto Marinada", detail: "Auction house", games: "Scarlet" },
      ] },
    ],
  },
  "swift-wing": {
    name: "Swift Feather",
    description: "Adds a single Speed effort point, for fine-tuning.",
    category: "Vitamins", pocket: "medicine",
    gens: [5, 6, 7, 8, 9],
    fling: { power: 20 },
    prices: [
      { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 150, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 75, cur: "poke-dollar" },
    ],
  },
  "pretty-wing": {
    name: "Pretty Feather",
    description: "A beautiful but useless feather that can be sold for a little money.",
    category: "Loot", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    fling: { power: 20 },
    prices: [
      { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "lets-go-pikachu-lets-go-eevee", "sword-shield", "scarlet-violet"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Let’s Go, Pikachu!/Let’s Go, Eevee!, Sword/Shield, Scarlet/Violet", buy: null, sell: 500, cur: "poke-dollar" },
    ],
  },
  "cover-fossil": {
    name: "Cover Fossil",
    description: "A fossil of a prehistoric sea Pokémon; revived, it becomes Tirtouga.",
    category: "Dex completion", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    fling: { power: 100 },
    prices: [
      { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 3500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 7000, sell: null, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Choice", place: "Relic Castle", detail: "Choice between Cover Fossil and Plume Fossil" },
      ] },
    ],
  },
  "plume-fossil": {
    name: "Plume Fossil",
    description: "A fossil of a prehistoric flying Pokémon; revived, it becomes Archen.",
    category: "Dex completion", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    fling: { power: 100 },
    prices: [
      { vg: ["black-white", "x-y", "omega-ruby-alpha-sapphire"], games: "Black/White, X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["sun-moon"], games: "Sun/Moon", buy: null, sell: 3500, cur: "poke-dollar" },
      { vg: ["ultra-sun-ultra-moon"], games: "Ultra Sun/Ultra Moon", buy: 7000, sell: 3500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Choice", place: "Relic Castle", detail: "Choice between this and the Cover Fossil" },
      ] },
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Field Move", place: "Glittering Cave", detail: "After entering the Hall of Fame" },
      ] },
    ],
  },
  "liberty-pass": {
    name: "Liberty Pass",
    description: "An event pass for the boat to Liberty Garden, where Victini is hidden.",
    category: "Event items", pocket: "key",
    gens: [5, 6, 7, 8, 9],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Event", place: "Wireless distribution" },
      ] },
    ],
  },
  "pass-orb": {
    name: "Pass Orb",
    description: "Holds the energy of the Unova region; spent to fire off a Pass Power over the Entralink.",
    category: "Held items", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 100, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Overworld", place: "Entralink", detail: "Entralink missions, other players' worlds" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Overworld", place: "Entralink", detail: "Funfest Missions" },
      ] },
    ],
  },
  "dream-ball": {
    name: "Dream Ball",
    description: "In Unova, the ball for Pokémon met in the Entree Forest; in Galar, four times as likely to catch a sleeping Pokémon.",
    category: "Special balls", pocket: "pokeballs",
    gens: [5, 6, 7, 8, 9],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Overworld", place: "Entree Forest" },
      ] },
    ],
  },
  "poke-toy": {
    name: "Poké Toy",
    description: "Dangle it and a wild Pokémon is distracted; you flee the battle every time.",
    category: "Spelunking", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["black-white", "black-2-white-2", "omega-ruby-alpha-sapphire"], games: "Black/White, Black 2/White 2, Omega Ruby/Alpha Sapphire", buy: 1000, sell: 500, cur: "poke-dollar" },
      { vg: ["x-y"], games: "X/Y", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["sun-moon"], games: "Sun/Moon", buy: null, sell: 50, cur: "poke-dollar" },
      { vg: ["ultra-sun-ultra-moon"], games: "Ultra Sun/Ultra Moon", buy: 100, sell: 50, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Shop", place: "Shopping Mall Nine", detail: "₱1000" },
      ] },
    ],
  },
  "prop-case": {
    name: "Prop Case",
    description: "Stores the Props that dress up Pokémon for Nimbasa's Pokémon Musical.",
    category: "Gameplay", pocket: "key",
    gens: [5, 6, 7, 8, 9],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "NPC Gift", place: "Nimbasa City", detail: "Musical Theater owner · First visit to the Musical Theater" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "NPC Gift", place: "Nimbasa City", detail: "Musical Theater owner · First visit to the Musical Theater" },
      ] },
    ],
  },
  "dragon-skull": {
    name: "Dragon Skull",
    description: "A dragon's skull from the Nacrene Museum, stolen by Team Plasma and recovered in Pinwheel Forest.",
    category: "Plot advancement", pocket: "key",
    gens: [5, 6, 7, 8, 9],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "NPC Defeat", place: "Pinwheel Forest", detail: "Last Team Plasma Grunt · After earning the Basic Badge · Basic Badge Badge" },
      ] },
    ],
  },
  "balm-mushroom": {
    name: "Balm Mushroom",
    description: "A rare, sweetly fragrant mushroom that sells for a high price.",
    category: "Loot", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["x-y", "omega-ruby-alpha-sapphire"], games: "X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 6250, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield", "scarlet-violet"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield, Scarlet/Violet", buy: null, sell: 7500, cur: "poke-dollar" },
    ],
  },
  "big-nugget": {
    name: "Big Nugget",
    description: "A hefty lump of pure gold, valuable only for selling.",
    category: "Loot", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    fling: { power: 130 },
    prices: [
      { vg: ["x-y", "omega-ruby-alpha-sapphire"], games: "X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 10000, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield", "scarlet-violet"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield, Scarlet/Violet", buy: null, sell: 20000, cur: "poke-dollar" },
    ],
  },
  "pearl-string": {
    name: "Pearl String",
    description: "A string of big silvery pearls; sells for a lot.",
    category: "Loot", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["black-white"], games: "Black/White", buy: null, sell: 25000, cur: "poke-dollar" },
      { vg: ["x-y", "omega-ruby-alpha-sapphire"], games: "X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 7500, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 15000, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 10000, cur: "poke-dollar" },
    ],
  },
  "comet-shard": {
    name: "Comet Shard",
    description: "A fragment of a fallen comet, extremely valuable to collectors.",
    category: "Loot", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["black-white", "black-2-white-2"], games: "Black/White, Black 2/White 2", buy: null, sell: 60000, cur: "poke-dollar" },
      { vg: ["x-y", "omega-ruby-alpha-sapphire"], games: "X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 15000, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 30000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 12500, cur: "poke-dollar" },
    ],
  },
  "relic-copper": {
    name: "Relic Copper",
    description: "An ancient copper coin from the Abyssal Ruins; sells for a little.",
    category: "Loot", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["black-white", "black-2-white-2"], games: "Black/White, Black 2/White 2", buy: null, sell: 1000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Overworld", place: "Abyssal Ruins" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Overworld", place: "Abyssal Ruins" },
      ] },
    ],
  },
  "relic-silver": {
    name: "Relic Silver",
    description: "An ancient silver coin from the Abyssal Ruins; sells for a fair amount.",
    category: "Loot", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["black-white", "black-2-white-2"], games: "Black/White, Black 2/White 2", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Overworld", place: "Abyssal Ruins" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Overworld", place: "Abyssal Ruins" },
      ] },
    ],
  },
  "relic-gold": {
    name: "Relic Gold",
    description: "An ancient gold coin from the Abyssal Ruins; sells for a lot.",
    category: "Loot", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["black-white"], games: "Black/White", buy: null, sell: 10000, cur: "poke-dollar" },
      { vg: ["omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 30000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Overworld", place: "Abyssal Ruins" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Overworld", place: "Abyssal Ruins" },
      ] },
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Exchange", place: "Trade" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Event" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Event" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Event" },
      ] },
    ],
  },
  "relic-vase": {
    name: "Relic Vase",
    description: "An ancient vase from the Abyssal Ruins; sells for a lot.",
    category: "Loot", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["black-white"], games: "Black/White", buy: null, sell: 50000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Overworld", place: "Abyssal Ruins" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Overworld", place: "Abyssal Ruins" },
      ] },
    ],
  },
  "relic-band": {
    name: "Relic Band",
    description: "An ancient bracelet from the Abyssal Ruins; sells for a lot.",
    category: "Loot", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["black-white", "black-2-white-2"], games: "Black/White, Black 2/White 2", buy: null, sell: 100000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Overworld", place: "Abyssal Ruins" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Overworld", place: "Abyssal Ruins" },
      ] },
    ],
  },
  "relic-statue": {
    name: "Relic Statue",
    description: "An ancient figurine from the Abyssal Ruins; sells for a great deal.",
    category: "Loot", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["black-white", "black-2-white-2"], games: "Black/White, Black 2/White 2", buy: null, sell: 200000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Overworld", place: "Abyssal Ruins" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Overworld", place: "Abyssal Ruins" },
      ] },
    ],
  },
  "relic-crown": {
    name: "Relic Crown",
    description: "An ancient crown from the Abyssal Ruins; the most valuable relic there is.",
    category: "Loot", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["black-white", "black-2-white-2"], games: "Black/White, Black 2/White 2", buy: null, sell: 300000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Overworld", place: "Abyssal Ruins" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Overworld", place: "Abyssal Ruins" },
      ] },
    ],
  },
  "casteliacone": {
    name: "Casteliacone",
    description: "Castelia City's soft-serve; cures any status condition and confusion.",
    category: "Status cures", pocket: "medicine",
    gens: [5, 6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["black-white", "black-2-white-2"], games: "Black/White, Black 2/White 2", buy: 100, sell: 50, cur: "poke-dollar" },
      { vg: ["x-y", "omega-ruby-alpha-sapphire"], games: "X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 50, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 175, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Shop", place: "Castelia City", detail: "Ice cream stand (Tuesday–Sunday, Spring–Autumn) · ₱100" },
      ] },
    ],
  },
  "dire-hit-2": {
    name: "Dire Hit 2",
    description: "A Wonder Launcher item: raises an ally's critical-hit ratio by two stages.",
    category: "Miracle shooter", pocket: "battle",
    gens: [5, 6, 7, 8, 9],
  },
  "x-speed-2": {
    name: "X Speed 2",
    description: "A Wonder Launcher item: raises an ally's Speed by two stages.",
    category: "Miracle shooter", pocket: "battle",
    gens: [5, 6, 7, 8, 9],
  },
  "x-sp-atk-2": {
    name: "X Sp. Atk 2",
    description: "A Wonder Launcher item: raises an ally's Sp. Atk by two stages.",
    category: "Miracle shooter", pocket: "battle",
    gens: [5, 6, 7, 8, 9],
  },
  "x-sp-def-2": {
    name: "X Sp. Def 2",
    description: "A Wonder Launcher item: raises an ally's Sp. Def by two stages.",
    category: "Miracle shooter", pocket: "battle",
    gens: [5, 6, 7, 8, 9],
  },
  "x-defense-2": {
    name: "X Defense 2",
    description: "A Wonder Launcher item: raises an ally's Defense by two stages.",
    category: "Miracle shooter", pocket: "battle",
    gens: [5, 6, 7, 8, 9],
  },
  "x-attack-2": {
    name: "X Attack 2",
    description: "A Wonder Launcher item: raises an ally's Attack by two stages.",
    category: "Miracle shooter", pocket: "battle",
    gens: [5, 6, 7, 8, 9],
  },
  "x-accuracy-2": {
    name: "X Accuracy 2",
    description: "A Wonder Launcher item: raises an ally's accuracy by two stages.",
    category: "Miracle shooter", pocket: "battle",
    gens: [5, 6, 7, 8, 9],
  },
  "x-speed-3": {
    name: "X Speed 3",
    description: "A Wonder Launcher item: raises an ally's Speed by three stages.",
    category: "Miracle shooter", pocket: "battle",
    gens: [5, 6, 7, 8, 9],
  },
  "x-sp-atk-3": {
    name: "X Sp. Atk 3",
    description: "A Wonder Launcher item: raises an ally's Sp. Atk by three stages.",
    category: "Miracle shooter", pocket: "battle",
    gens: [5, 6, 7, 8, 9],
  },
  "x-sp-def-3": {
    name: "X Sp. Def 3",
    description: "A Wonder Launcher item: raises an ally's Sp. Def by three stages.",
    category: "Miracle shooter", pocket: "battle",
    gens: [5, 6, 7, 8, 9],
  },
  "x-defense-3": {
    name: "X Defense 3",
    description: "A Wonder Launcher item: raises an ally's Defense by three stages.",
    category: "Miracle shooter", pocket: "battle",
    gens: [5, 6, 7, 8, 9],
  },
  "x-attack-3": {
    name: "X Attack 3",
    description: "A Wonder Launcher item: raises an ally's Attack by three stages.",
    category: "Miracle shooter", pocket: "battle",
    gens: [5, 6, 7, 8, 9],
  },
  "x-accuracy-3": {
    name: "X Accuracy 3",
    description: "A Wonder Launcher item: raises an ally's accuracy by three stages.",
    category: "Miracle shooter", pocket: "battle",
    gens: [5, 6, 7, 8, 9],
  },
  "x-speed-6": {
    name: "X Speed 6",
    description: "A Wonder Launcher item: raises an ally's Speed by six stages, the maximum.",
    category: "Miracle shooter", pocket: "battle",
    gens: [5, 6, 7, 8, 9],
  },
  "x-sp-atk-6": {
    name: "X Sp. Atk 6",
    description: "A Wonder Launcher item: raises an ally's Sp. Atk by six stages, the maximum.",
    category: "Miracle shooter", pocket: "battle",
    gens: [5, 6, 7, 8, 9],
  },
  "x-sp-def-6": {
    name: "X Sp. Def 6",
    description: "A Wonder Launcher item: raises an ally's Sp. Def by six stages, the maximum.",
    category: "Miracle shooter", pocket: "battle",
    gens: [5, 6, 7, 8, 9],
  },
  "x-defense-6": {
    name: "X Defense 6",
    description: "A Wonder Launcher item: raises an ally's Defense by six stages, the maximum.",
    category: "Miracle shooter", pocket: "battle",
    gens: [5, 6, 7, 8, 9],
  },
  "x-attack-6": {
    name: "X Attack 6",
    description: "A Wonder Launcher item: raises an ally's Attack by six stages, the maximum.",
    category: "Miracle shooter", pocket: "battle",
    gens: [5, 6, 7, 8, 9],
  },
  "x-accuracy-6": {
    name: "X Accuracy 6",
    description: "A Wonder Launcher item: raises an ally's accuracy by six stages, the maximum.",
    category: "Miracle shooter", pocket: "battle",
    gens: [5, 6, 7, 8, 9],
  },
  "ability-urge": {
    name: "Ability Urge",
    description: "A Wonder Launcher item: re-triggers an ally's Ability, if it's one that fires on entering battle.",
    category: "Miracle shooter", pocket: "battle",
    gens: [5, 6, 7, 8, 9],
  },
  "item-drop": {
    name: "Item Drop",
    description: "A Wonder Launcher item: makes an ally drop its held item for the rest of the battle.",
    category: "Miracle shooter", pocket: "battle",
    gens: [5, 6, 7, 8, 9],
  },
  "item-urge": {
    name: "Item Urge",
    description: "A Wonder Launcher item: makes an ally consume its held item right away.",
    category: "Miracle shooter", pocket: "battle",
    gens: [5, 6, 7, 8, 9],
  },
  "reset-urge": {
    name: "Reset Urge",
    description: "A Wonder Launcher item: wipes all of an ally's stat changes.",
    category: "Miracle shooter", pocket: "battle",
    gens: [5, 6, 7, 8, 9],
  },
  "dire-hit-3": {
    name: "Dire Hit 3",
    description: "A Wonder Launcher item: raises an ally's critical-hit ratio by three stages.",
    category: "Miracle shooter", pocket: "battle",
    gens: [5, 6, 7, 8, 9],
  },
  "light-stone": {
    name: "Light Stone",
    description: "Reshiram, dormant as a stone; it wakes for a hero who seeks truth.",
    category: "Plot advancement", pocket: "key",
    gens: [5, 6, 7, 8, 9],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "NPC Gift", place: "Nacrene City", detail: "Received from Lenora after clearing Relic Castle · After clearing Relic Castle", games: "Black" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "NPC Gift", place: "N's Castle", detail: "Received from N after defeating him and Reshiram · After defeating N and Reshiram", games: "White 2" },
      ] },
    ],
  },
  "dark-stone": {
    name: "Dark Stone",
    description: "Zekrom, dormant as a stone; it wakes for a hero who seeks ideals.",
    category: "Plot advancement", pocket: "key",
    gens: [5, 6, 7, 8, 9],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "NPC Gift", place: "Nacrene City", detail: "Received from Lenora after clearing Relic Castle · After clearing Relic Castle", games: "White" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "NPC Gift", place: "N's Castle", detail: "Received from N after the player defeats him and Zekrom · After defeating N and Zekrom", games: "Black 2" },
      ] },
    ],
  },
  "tm93": {
    name: "TM93",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [5, 6, 7, 8, 9],
    prices: [
      { vg: ["x-y"], games: "X/Y", buy: 50000, sell: null, cur: "poke-dollar" },
      { vg: ["brilliant-diamond-shining-pearl"], games: "Brilliant Diamond/Shining Pearl", buy: null, sell: 1000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 8000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Overworld", place: "Victory Road (Unova BW)", games: "Black" },
      ] },
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Shop", place: "Kiloude City", detail: "Poké Mart · ₱50000", games: "X" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Overworld", place: "Wyndon", games: "Sword" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "TM Machine", detail: "8000 LP · Requires Varoom Fume x3, Klefki Key x3, Tinkatink Hair x3.", games: "Scarlet" },
      ] },
    ],
  },
  "tm94": {
    name: "TM94",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [5, 6, 7, 8, 9],
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 10000, sell: null, cur: "poke-dollar" },
      { vg: ["brilliant-diamond-shining-pearl"], games: "Brilliant Diamond/Shining Pearl", buy: null, sell: 1000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 8000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Overworld", place: "Pinwheel Forest" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Overworld", place: "Virbank Complex" },
      ] },
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Overworld", place: "Ambrette Town" },
      ] },
    ],
  },
  "tm95": {
    name: "TM95",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [5, 6, 7, 8, 9],
    prices: [
      { vg: ["brilliant-diamond-shining-pearl"], games: "Brilliant Diamond/Shining Pearl", buy: null, sell: 1250, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Story", place: "Castelia City", detail: "Unobtainable without Lock Capsule · Requires Lock Capsule transfer · Event-exclusive and unobtainable", games: "Black" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "NPC Defeat", place: "Lostlorn Forest", detail: "Zoroark disguised as Backpacker", games: "Black 2" },
      ] },
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Overworld", place: "Lost Hotel", games: "X" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Mirage Cave", detail: "North of Fallarbor Town", games: "Omega Ruby" },
      ] },
    ],
  },
  "xtransceiver": {
    name: "Xtransceiver",
    description: "A wrist video phone; up to four people can talk at once.",
    category: "Gameplay", pocket: "key",
    gens: [5, 6, 7, 8, 9],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "NPC Gift", place: "Nuvema Town", detail: "Received from Mom at the start of the game" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Starting Item", place: "Aspertia City", detail: "In the player's Bag at the start of the game" },
      ] },
    ],
  },
  "god-stone": {
    name: "god stone",
    description: "A leftover from development that never appears in play.",
    category: "Unused", pocket: "key",
    gens: [5, 6, 7, 8, 9],
  },
  "gram-1": {
    name: "Gram 1",
    description: "The first of three letters a Wingull drops in Castelia City; each must reach the right person.",
    category: "Plot advancement", pocket: "key",
    gens: [5, 6, 7, 8, 9],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "NPC Gift", place: "Unova Route 13", detail: "Old man northeast of Fisherman Jones", games: "Black" },
      ] },
    ],
  },
  "gram-2": {
    name: "Gram 2",
    description: "The second of three letters a Wingull drops in Castelia City; each must reach the right person.",
    category: "Plot advancement", pocket: "key",
    gens: [5, 6, 7, 8, 9],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Overworld", place: "Unova Route 13", detail: "Cliff south of Artist Zach", games: "Black" },
      ] },
    ],
  },
  "gram-3": {
    name: "Gram 3",
    description: "The last of three letters a Wingull drops in Castelia City; each must reach the right person.",
    category: "Plot advancement", pocket: "key",
    gens: [5, 6, 7, 8, 9],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "NPC Gift", place: "Unova Route 13", detail: "Parasol Lady south of Parasol Lady Laura", games: "Black" },
      ] },
    ],
  },
  "dragon-gem": {
    name: "Dragon Gem",
    description: "Powers up the holder's next Dragon-type move, then shatters.",
    category: "Jewels", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    prices: [
      { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 100, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Event" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Overworld", place: "Mistralton Cave" },
      ] },
    ],
  },
  "normal-gem": {
    name: "Normal Gem",
    description: "Powers up the holder's next Normal-type move, then shatters.",
    category: "Jewels", pocket: "misc",
    gens: [5, 6, 7, 8, 9],
    prices: [
      { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "lets-go-pikachu-lets-go-eevee", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Let’s Go, Pikachu!/Let’s Go, Eevee!, Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 15000, sell: 3750, cur: "poke-dollar" },
    ],
    where: [
      { vg: "black-white", games: "Black/White", lines: [
        { type: "Overworld", place: "Dust cloud", games: "Black" },
      ] },
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Overworld", place: "Victory Road (Unova B2W2)", games: "Black 2" },
      ] },
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Event", games: "X" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Shop", place: "Cascarrafa", detail: "Delibird Presents · ₱15000", games: "Scarlet" },
      ] },
    ],
  },
  "medal-box": {
    name: "Medal Box",
    description: "Keeps the Medals you earn for feats around Unova, and tells you what's left to earn.",
    category: "Gameplay", pocket: "key",
    gens: [5, 6, 7, 8, 9],
    where: [
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "NPC Gift", place: "Floccesy Town", detail: "From Mr. Medal outside of Alder's house after defeating the two School Kids · After defeating the two School Kids" },
      ] },
    ],
  },
  "dna-splicers": {
    name: "DNA Splicers",
    description: "Fuses Kyurem with Reshiram or Zekrom into Black or White Kyurem, or splits them apart again.",
    category: "Gameplay", pocket: "key",
    gens: [5, 6, 7, 8, 9],
    where: [
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Dropped", place: "Giant Chasm", detail: "Dropped by Kyurem" },
      ] },
      { vg: "x-y", games: "X/Y", lines: [
        { type: "NPC Gift", place: "Kiloude City", detail: "Punk Girl in a northeastern house · If shown a Kyurem" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Gnaled Den", detail: "Inside the cave" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Aether Paradise", detail: "Aether Foundation Employee in Secret Lab A" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Bargain Shop", place: "Stow-on-Side", detail: "Bargain shop keeper · If the player owns a Kyurem" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Auction", place: "Porto Marinada", detail: "Auction house · If the player owns a Kyurem" },
      ] },
    ],
  },
  "permit": {
    name: "Permit",
    description: "Grants entry to the Nature Preserve, reached by plane from Mistralton City.",
    category: "Gameplay", pocket: "key",
    gens: [5, 6, 7, 8, 9],
    where: [
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "NPC Gift", place: "Juniper Pokémon Lab", detail: "Professor Juniper · After seeing all Pokémon in the Unova Pokédex" },
      ] },
    ],
  },
  "oval-charm": {
    name: "Oval Charm",
    description: "Eggs turn up at the Day Care more often while you carry it.",
    category: "Gameplay", pocket: "key",
    gens: [5, 6, 7, 8, 9],
    where: [
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "NPC Gift", place: "Juniper Pokémon Lab", detail: "Professor Juniper · After obtaining all Pokémon in the Unova Pokédex except Mythical Pokémon" },
      ] },
      { vg: "x-y", games: "X/Y", lines: [
        { type: "NPC Gift", place: "Pokémon Research Lab (Kalos)", detail: "Professor Sycamore · After seeing all Pokémon in each section of the Kalos Pokédex except certain Legendary and Mythical Pokémon" },
      ] },
    ],
  },
  "shiny-charm": {
    name: "Shiny Charm",
    description: "Shiny Pokémon turn up more often while you carry it.",
    category: "Gameplay", pocket: "key",
    gens: [5, 6, 7, 8, 9],
    where: [
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "NPC Gift", place: "Juniper Pokémon Lab", detail: "Professor Juniper · After completing the National Pokédex excluding Mythical Pokémon and having it evaluated by Cedric Juniper" },
      ] },
      { vg: "x-y", games: "X/Y", lines: [
        { type: "NPC Gift", place: "Pokémon Research Lab (Kalos)", detail: "Professor Sycamore · After completing the National Pokédex excluding Mythical Pokémon" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Littleroot Town", detail: "Professor Birch · After completing the National Pokédex excluding Mythical Pokémon" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Heahea City", detail: "Game director · After completing the Alola Pokédex excluding Mythical Pokémon" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "NPC Gift", place: "Circhester", detail: "Game Freak director · After completing the mainland Galar Pokédex" },
      ] },
      { vg: "legends-arceus", games: "Legends: Arceus", lines: [
        { type: "NPC Gift", place: "Galaxy Hall", detail: "Cyllene · After reaching research level 10 for all Pokémon excluding Mythical Pokémon except Arceus" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "NPC Gift", place: "Naranja Academy", detail: "Jacq · After completing the Paldea Pokédex", games: "Scarlet" },
        { type: "NPC Gift", place: "Uva Academy", detail: "Jacq · After completing the Paldea Pokédex", games: "Violet" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Achievement", detail: "Reward for maxing out research level" },
      ] },
    ],
  },
  "plasma-card": {
    name: "Plasma Card",
    description: "A key card that unlocks the password door aboard the Plasma Frigate.",
    category: "Plot advancement", pocket: "key",
    gens: [5, 6, 7, 8, 9],
    where: [
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "NPC Defeat", place: "Plasma Frigate B2F, from the Team Plasma Grunt with a Trubbish and Zangoose after defeating her", games: "Black 2" },
        { type: "NPC Defeat", place: "Plasma Frigate B1F, from the Team Plasma Grunt with three Pawniard after defeating her", games: "White 2" },
      ] },
    ],
  },
  "grubby-hanky": {
    name: "Grubby Hanky",
    description: "A dirty handkerchief dropped by a Café Warehouse regular; it smells faintly of a Pokémon.",
    category: "Plot advancement", pocket: "key",
    gens: [5, 6, 7, 8, 9],
    where: [
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "NPC Gift", place: "Nacrene City", detail: "Café Warehouse, from a customer (Sunday)" },
      ] },
    ],
  },
  "colress-machine": {
    name: "Colress Machine",
    description: "Colress's invention: forcibly wakes the Crustle blocking Seaside Cave.",
    category: "Plot advancement", pocket: "key",
    gens: [5, 6, 7, 8, 9],
    where: [
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "NPC Gift", place: "Unova Route 22", detail: "From Colress upon approaching Terrakion" },
      ] },
    ],
  },
  "dropped-item": {
    name: "Dropped Item",
    description: "An Xtransceiver someone left in Nimbasa's amusement park; return it and you'll get to know Curtis or Yancy.",
    category: "Plot advancement", pocket: "key",
    gens: [5, 6, 7, 8, 9],
    where: [
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Overworld", place: "Nimbasa City", detail: "Near the flower bed in the amusement park" },
      ] },
    ],
  },
  "reveal-glass": {
    name: "Reveal Glass",
    description: "A mirror that switches Tornadus, Thundurus, Landorus, and Enamorus between Incarnate and Therian Formes.",
    category: "Gameplay", pocket: "key",
    gens: [5, 6, 7, 8, 9],
    where: [
      { vg: "black-2-white-2", games: "Black 2/White 2", lines: [
        { type: "Story", place: "Abundant Shrine", detail: "Take Therian Forme Landorus to the hokora" },
      ] },
      { vg: "x-y", games: "X/Y", lines: [
        { type: "NPC Gift", place: "Reflection Cave", detail: "Scientist near the Shalour City exit · Show Tornadus, Thundurus, and Landorus" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Mauville City", detail: "Woman selling mirrors on 1F · Show Tornadus, Thundurus, or Landorus" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Dimensional Research Lab", detail: "Professor Burnet · After clearing Olivia's grand trial" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Dimensional Research Lab", detail: "Professor Burnet · After clearing Olivia's grand trial" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Bargain Shop", place: "Stow-on-Side", detail: "Bargain shop keeper · If the player owns a Tornadus, Thundurus, or Landorus" },
      ] },
      { vg: "legends-arceus", games: "Legends: Arceus", lines: [
        { type: "NPC Gift", place: "Ancient Retreat", detail: "Cogita · After completing the Pokédex entries of all the forces of nature" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Auction", place: "Porto Marinada", detail: "Auction · If the player owns a Tornadus, Thundurus, Landorus, or Enamorus" },
      ] },
    ],
  },
  "weakness-policy": {
    name: "Weakness Policy",
    description: "When a super-effective move hits the holder, its Attack and Sp. Atk rise sharply; then the policy is gone.",
    category: "Held items", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 50000, sell: 12500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Exchange", place: "Battle Maison", detail: "32 BP" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "32 BP" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Exchange", place: "Battle Tower", detail: "20 BP" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Shop", place: "Mesagoza", detail: "Delibird Presents · ₱50000 · After completing the main storyline" },
      ] },
    ],
  },
  "assault-vest": {
    name: "Assault Vest",
    description: "Boosts the holder's Sp. Def by half, but it can't use status moves.",
    category: "Held items", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 50000, sell: 12500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Exchange", place: "Battle Maison", detail: "48 BP", games: "X" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "48 BP", games: "Sun" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Overworld", place: "Lake of Outrage", games: "Sword" },
        { type: "Exchange", place: "Battle Tower", detail: "25 BP", games: "Sword" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Shop", place: "Mesagoza", detail: "Delibird Presents · ₱50000 · After completing the main storyline", games: "Scarlet" },
      ] },
    ],
  },
  "pixie-plate": {
    name: "Pixie Plate",
    description: "Strengthens the holder's Fairy-type moves; Arceus becomes Fairy-type while holding it.",
    category: "Plates", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 90 },
    prices: [
      { vg: ["x-y", "omega-ruby-alpha-sapphire"], games: "X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["sun-moon"], games: "Sun/Moon", buy: 10000, sell: 500, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Overworld", place: "Pokémon Village", games: "X" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Hoenn Route 128", detail: "Underwater", games: "Omega Ruby" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Shop", place: "Hau'oli City", detail: "Antiquities of the Ages · ₱10000", games: "Sun" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Overworld", place: "Route 8 - Galar", games: "Sword" },
        { type: "Bargain Shop", place: "Stow-on-Side", games: "Sword" },
      ] },
      { vg: "legends-arceus", games: "Legends: Arceus", lines: [
        { type: "Story", place: "Ancient Retreat", detail: "From Cogita during Mission 26 · After giving Cogita three pieces of Wood" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Auction", place: "Porto Marinada", detail: "If the player owns an Arceus", games: "Scarlet" },
      ] },
    ],
  },
  "ability-capsule": {
    name: "Ability Capsule",
    description: "Switches a Pokémon between its two regular Abilities; can't reach a Hidden Ability.",
    category: "Vitamins", pocket: "medicine",
    gens: [6, 7, 8, 9],
    prices: [
      { vg: ["x-y", "omega-ruby-alpha-sapphire"], games: "X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield", "brilliant-diamond-shining-pearl"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield, Brilliant Diamond/Shining Pearl", buy: null, sell: 5000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 100000, sell: 25000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Exchange", place: "Battle Maison", detail: "200 BP", games: "X" },
      ] },
    ],
  },
  "whipped-dream": {
    name: "Whipped Dream",
    description: "A mound of sweet, springy cream; Swirlix evolves into Slurpuff when traded holding it.",
    category: "Evolution", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["x-y", "omega-ruby-alpha-sapphire"], games: "X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 1050, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 1000, cur: "poke-dollar" },
      { vg: ["legends-za"], games: "Legends: Z-A", buy: null, sell: 750, cur: "poke-dollar" },
    ],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Overworld", place: "Kalos Route 12", games: "X" },
        { type: "Overworld", place: "Cyllage City", games: "X" },
        { type: "Exchange", place: "Battle Maison", detail: "32 BP" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Exchange", place: "Battle Maison", detail: "32 BP" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "32 BP" },
        { type: "Overworld", place: "Konikoni City", games: "Sun" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "NPC Gift", games: "Sword" },
        { type: "Exchange", place: "Hammerlocke", detail: "10 BP", games: "Sword" },
      ] },
    ],
  },
  "sachet": {
    name: "Sachet",
    description: "A pouch of concentrated perfume; Spritzee evolves into Aromatisse when traded holding it.",
    category: "Evolution", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["x-y", "omega-ruby-alpha-sapphire"], games: "X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 1050, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 1000, cur: "poke-dollar" },
      { vg: ["legends-za"], games: "Legends: Z-A", buy: null, sell: 750, cur: "poke-dollar" },
    ],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Overworld", place: "Kalos Route 12", games: "X" },
        { type: "Exchange", place: "Battle Maison", detail: "32 BP", games: "X" },
        { type: "Overworld", place: "Cyllage City", games: "Y" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Exchange", place: "Battle Maison", detail: "32 BP", games: "Omega Ruby" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Overworld", place: "Konikoni City", games: "Sun" },
        { type: "Exchange", place: "Battle Tree", detail: "32 BP", games: "Sun" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Crafting", place: "Fairy: 52-60 points", detail: "The Isle of Armor", games: "Sword" },
        { type: "Exchange", place: "Hammerlocke", detail: "10 BP", games: "Sword" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Story", place: "Side Mission 010: \"Skiddo's Fragrant Leaves\"" },
      ] },
    ],
  },
  "luminous-moss": {
    name: "Luminous Moss",
    description: "Raises the holder's Sp. Def once after it is hit by a Water-type move, then breaks.",
    category: "Held items", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["x-y", "omega-ruby-alpha-sapphire"], games: "X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 5000, sell: 1250, cur: "poke-dollar" },
    ],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Overworld", place: "Mossy rocks" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Exchange", place: "Battle Maison", detail: "32 BP" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Overworld", place: "Hau'oli City" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Wild Pokémon", games: "Shield" },
        { type: "Exchange", place: "Battle Tower", detail: "10 BP" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Shop", place: "Cascarrafa", detail: "Delibird Presents (Cascarrafa Branch) · ₱5000 · After earning 4 Gym Badges" },
      ] },
    ],
  },
  "snowball": {
    name: "Snowball",
    description: "Raises the holder's Attack once after it is hit by an Ice-type move, then breaks.",
    category: "Held items", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["x-y", "omega-ruby-alpha-sapphire"], games: "X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 5000, sell: 1250, cur: "poke-dollar" },
    ],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Overworld", place: "Snow piles", games: "X" },
      ] },
    ],
  },
  "safety-goggles": {
    name: "Safety Goggles",
    description: "Shields the holder from weather damage and from powder and spore moves.",
    category: "Held items", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["x-y", "omega-ruby-alpha-sapphire"], games: "X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 20000, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Exchange", place: "Battle Maison", detail: "48 BP" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Hoenn Route 111" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Overworld", place: "Haina Desert", detail: "Night" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "48 BP" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Overworld", place: "Tunnel to the Top", detail: "The Crown Tundra" },
        { type: "Overworld", place: "Route 7 - Galar" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Item Printer", detail: "The Indigo Disk" },
        { type: "Shop", place: "Levincia", detail: "Delibird Presents · ₱20000 · After earning 4 Gym Badges" },
      ] },
    ],
  },
  "rich-mulch": {
    name: "Rich Mulch",
    description: "Kalos mulch that makes a Berry plant yield more fruit.",
    category: "Mulch", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 100, cur: "poke-dollar" },
    ],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Crafting", place: "Berry fields composter (using three differently-colored Berries)" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Exchange", place: "Trade" },
      ] },
    ],
  },
  "surprise-mulch": {
    name: "Surprise Mulch",
    description: "Kalos mulch that makes Berry plants more likely to sprout a mutated Berry.",
    category: "Mulch", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 100, cur: "poke-dollar" },
    ],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Crafting", place: "Berry fields composter (using three Berries of the same color)" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Exchange", place: "Trade" },
      ] },
    ],
  },
  "boost-mulch": {
    name: "Boost Mulch",
    description: "Kalos mulch that dries the soil faster, so plants want watering more often.",
    category: "Mulch", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 100, cur: "poke-dollar" },
    ],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Crafting", place: "Berry Fields (Kalos)", detail: "Berry fields composter · Using two Berries of the same color and one differently colored Berry" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Exchange", place: "Trade" },
      ] },
    ],
  },
  "amaze-mulch": {
    name: "Amaze Mulch",
    description: "Kalos mulch that does it all: bigger yields, more mutations, faster-drying soil.",
    category: "Mulch", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 100, cur: "poke-dollar" },
    ],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Crafting", place: "Berry fields composter", detail: "Using one Maranga Berry or Kee Berry and two other Berries" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Exchange", place: "Trade" },
      ] },
    ],
  },
  "gengarite": {
    name: "Gengarite",
    description: "Lets Gengar Mega Evolve in battle when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", buy: 30000, sell: null, cur: "poke-dollar" },
      { vg: ["legends-za"], games: "Legends: Z-A", buy: 50000, sell: null, cur: "poke-dollar" },
    ],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "NPC Gift", place: "Laverre City", detail: "Hex Maniac · Must have seen Gastly, Haunter, or Gengar in the Pokédex", games: "X" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Battle Resort", games: "Omega Ruby" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "64 BP", games: "Sun" },
      ] },
      { vg: "lets-go-pikachu-lets-go-eevee", games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", lines: [
        { type: "Overworld", place: "Indigo Plateau", games: "Let’s Go, Pikachu!" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Shop", place: "Stone Emporium", detail: "₱50000 · After completing Main Mission 09: Chase That Mysterious Pokémon!" },
      ] },
    ],
  },
  "gardevoirite": {
    name: "Gardevoirite",
    description: "Lets Gardevoir Mega Evolve in battle when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "NPC Gift", place: "Lumiose City", detail: "Café Soleil, held by Diantha's traded Ralts" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Story", place: "Verdanturf Town", detail: "After defeating or capturing Kyogre", games: "Alpha Sapphire" },
        { type: "Story", place: "Verdanturf Town", detail: "After defeating or capturing Groudon", games: "Omega Ruby" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "64 BP" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Exchange", place: "Quesartico Inc. (Building)", detail: "₱240 · After completing Main Mission 24: Reaching Rank C · Requires Mega Shards" },
      ] },
    ],
  },
  "ampharosite": {
    name: "Ampharosite",
    description: "Lets Ampharos Mega Evolve in battle when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "NPC Gift", place: "Azure Bay", detail: "Old man" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "New Mauville" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "64 BP" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Story", place: "Defeat Rogue Mega Ampharos (Main Mission 23)" },
      ] },
    ],
  },
  "venusaurite": {
    name: "Venusaurite",
    description: "Lets Venusaur Mega Evolve in battle when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["x-y"], games: "X/Y", buy: 10000, sell: null, cur: "poke-dollar" },
    ],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "NPC Gift", place: "Pokémon Research Lab (Kalos)", detail: "If Bulbasaur is chosen", games: "X" },
        { type: "Shop", place: "Stone Emporium", detail: "If Bulbasaur is not chosen", games: "Y" },
      ] },
    ],
  },
  "charizardite-x": {
    name: "Charizardite X",
    description: "Lets Charizard Mega Evolve into Mega Charizard X, a Fire/Dragon type, when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["x-y"], games: "X/Y", buy: 10000, sell: null, cur: "poke-dollar" },
      { vg: ["legends-za"], games: "Legends: Z-A", buy: 100000, sell: null, cur: "poke-dollar" },
    ],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "NPC Gift", place: "Pokémon Research Lab (Kalos)", detail: "If Charmander is chosen", games: "X" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Fiery Path", detail: "After defeating or capturing Groudon", games: "Omega Ruby" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Shop", place: "Stone Emporium", detail: "₱100000 · After completing Main Mission 09: Chase That Mysterious Pokémon!" },
      ] },
    ],
  },
  "blastoisinite": {
    name: "Blastoisinite",
    description: "Lets Blastoise Mega Evolve in battle when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["legends-za"], games: "Legends: Z-A", buy: 100000, sell: null, cur: "poke-dollar" },
    ],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "NPC Gift", place: "Pokémon Research Lab (Kalos)", detail: "If Squirtle is chosen", games: "X" },
        { type: "Shop", place: "Stone Emporium", detail: "If Squirtle is not chosen", games: "Y" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "S.S. Tidal" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Shop", place: "Stone Emporium", detail: "₱100000 · After completing Main Mission 09: \"Chase That Mysterious Pokémon!\"" },
      ] },
    ],
  },
  "mewtwonite-x": {
    name: "Mewtwonite X",
    description: "Lets Mewtwo Mega Evolve into Mega Mewtwo X, a Psychic/Fighting type, when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Overworld", place: "Unknown Dungeon (Kalos)", detail: "After catching Mewtwo" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Littleroot Town", detail: "After defeating or capturing Kyogre", games: "Alpha Sapphire" },
        { type: "NPC Gift", place: "Littleroot Town", detail: "After defeating or capturing Groudon", games: "Omega Ruby" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "64 BP" },
      ] },
      { vg: "lets-go-pikachu-lets-go-eevee", games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", lines: [
        { type: "NPC Gift", place: "Cerulean Cave", detail: "From Green after defeating her · After defeating Green" },
      ] },
    ],
  },
  "mewtwonite-y": {
    name: "Mewtwonite Y",
    description: "Lets Mewtwo Mega Evolve into Mega Mewtwo Y when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Overworld", place: "Unknown Dungeon (Kalos)", detail: "After catching Mewtwo", games: "X" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Pokémon League (Kalos)", detail: "Outside the front door", games: "Omega Ruby" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Event", games: "Sun" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "64 BP", games: "Ultra Sun" },
      ] },
      { vg: "lets-go-pikachu-lets-go-eevee", games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", lines: [
        { type: "NPC Defeat", place: "Cerulean Cave", detail: "From Green after defeating her", games: "Let’s Go, Pikachu!" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Event" },
      ] },
    ],
  },
  "blazikenite": {
    name: "Blazikenite",
    description: "Lets Blaziken Mega Evolve in battle when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Event" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Hoenn Route 120", detail: "If first partner Pokémon was Torchic" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "Battle Tree · 64 BP" },
      ] },
    ],
  },
  "medichamite": {
    name: "Medichamite",
    description: "Lets Medicham Mega Evolve in battle when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["legends-za"], games: "Legends: Z-A", buy: 50000, sell: null, cur: "poke-dollar" },
    ],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Overworld", place: "Laverre City", detail: "Requires upgraded Mega Ring · After upgrading the Mega Ring" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Mt. Pyre" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Event", place: "First Mega Stone Gift" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "64 BP" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Shop", place: "Stone Emporium", detail: "₱50000 · After completing Main Mission 09" },
      ] },
    ],
  },
  "houndoominite": {
    name: "Houndoominite",
    description: "Lets Houndoom Mega Evolve in battle when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Exchange", place: "Trade", games: "X" },
        { type: "Overworld", place: "Kalos Route 16", detail: "Requires upgraded Mega Ring · After obtaining an upgraded Mega Ring", games: "Y" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Story", place: "Lavaridge Town", detail: "After defeating or capturing Kyogre · After Kyogre encounter", games: "Alpha Sapphire" },
        { type: "Story", place: "Lavaridge Town", detail: "After defeating or capturing Groudon · After Groudon encounter", games: "Omega Ruby" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "64 BP · 64 BP" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Exchange", place: "Quesartico Inc. (Building)", detail: "180 Mega Shards · ₱180" },
      ] },
    ],
  },
  "aggronite": {
    name: "Aggronite",
    description: "Lets Aggron Mega Evolve in battle when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Overworld", place: "Cyllage City", detail: "Cyllage Gym · Requires upgraded Mega Ring", games: "Y" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Rusturf Tunnel" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "Battle Tree · 64 BP" },
      ] },
    ],
  },
  "banettite": {
    name: "Banettite",
    description: "Lets Banette Mega Evolve in battle when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Overworld", place: "Chamber of Emptiness", detail: "Requires an upgraded Mega Ring · After obtaining an upgraded Mega Ring" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Mt. Pyre" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Event", place: "Third Mega Stone Gift" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "64 BP" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "NPC Defeat", place: "Rogue Mega Banette (Main Mission 18)", detail: "After completing Main Mission 18" },
      ] },
    ],
  },
  "tyranitarite": {
    name: "Tyranitarite",
    description: "Lets Tyranitar Mega Evolve in battle when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Story", place: "Cyllage Gym", detail: "Requires upgraded Mega Ring · After obtaining upgraded Mega Ring", games: "X" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Jagged Pass", detail: "After defeating or capturing Kyogre · After Kyogre event", games: "Alpha Sapphire" },
        { type: "Overworld", place: "Jagged Pass", detail: "After defeating or capturing Groudon · After Groudon event", games: "Omega Ruby" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "Battle Tree · 64 BP" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "NPC Defeat", place: "Rogue Mega Tyranitar, Main Mission 33", detail: "Main Mission 33" },
      ] },
    ],
  },
  "scizorite": {
    name: "Scizorite",
    description: "Lets Scizor Mega Evolve in battle when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["legends-za"], games: "Legends: Z-A", buy: 50000, sell: null, cur: "poke-dollar" },
    ],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Overworld", place: "Frost Cavern", detail: "Requires an upgraded Mega Ring · After obtaining an upgraded Mega Ring" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Petalburg Woods", detail: "After defeating or capturing Kyogre", games: "Alpha Sapphire" },
        { type: "Overworld", place: "Petalburg Woods", detail: "After defeating or capturing Groudon", games: "Omega Ruby" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "Battle Tree · 64 BP" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "Battle Tree · 64 BP" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Shop", place: "Stone Emporium", detail: "Stone Emporium · ₱50000 · After completing Main Mission 09: \"Chase That Mysterious Pokémon!\"" },
      ] },
    ],
  },
  "pinsirite": {
    name: "Pinsirite",
    description: "Lets Pinsir Mega Evolve in battle when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", buy: 30000, sell: null, cur: "poke-dollar" },
    ],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Overworld", place: "Santalune Forest", detail: "Requires upgraded Mega Ring · After upgrading the Mega Ring", games: "X" },
        { type: "Event", games: "Y" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Hoenn Route 124", detail: "Requires Dive · After obtaining HM Dive" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "Battle Tree · 64 BP" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "Battle Tree · 64 BP" },
      ] },
      { vg: "lets-go-pikachu-lets-go-eevee", games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", lines: [
        { type: "Overworld", place: "Indigo Plateau" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Exchange", place: "Quesartico Inc. (Building)", detail: "240 Mega Shards · ₱240 · After completing Main Mission 14: Reaching Rank E" },
      ] },
    ],
  },
  "aerodactylite": {
    name: "Aerodactylite",
    description: "Lets Aerodactyl Mega Evolve in battle when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", buy: 30000, sell: null, cur: "poke-dollar" },
    ],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Story", place: "Ambrette Town", detail: "Fossil Lab (after finding the scientist in Glittering Cave)" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Meteor Falls" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "64 BP" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "64 BP" },
      ] },
      { vg: "lets-go-pikachu-lets-go-eevee", games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", lines: [
        { type: "Overworld", place: "Indigo Plateau" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Exchange", place: "Quesartico Inc. (Building)", detail: "₱240 · Costs Mega Shards." },
      ] },
    ],
  },
  "lucarionite": {
    name: "Lucarionite",
    description: "Lets Lucario Mega Evolve in battle when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "NPC Gift", place: "Tower of Mastery", detail: "Held by Korrina's gift Lucario" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Contest Hall", detail: "From Chaz after defeating Lisia in a Pokémon Contest Spectacular · After defeating Lisia in a Pokémon Contest Spectacular" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "Battle Tree exchange · 64 BP" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "Battle Tree exchange · 64 BP" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Exchange", place: "Quesartico Inc. (Building)", detail: "Mega Shard exchange · ₱240 · Requires Mega Shards" },
      ] },
    ],
  },
  "abomasite": {
    name: "Abomasite",
    description: "Lets Abomasnow Mega Evolve in battle when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["legends-za"], games: "Legends: Z-A", buy: 50000, sell: null, cur: "poke-dollar" },
    ],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Story", place: "Frost Cavern", detail: "From Abomasnow after defeating Team Flare" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Story", place: "Hoenn Route 123", detail: "After defeating or capturing Kyogre", games: "Alpha Sapphire" },
        { type: "Story", place: "Hoenn Route 123", detail: "After defeating or capturing Groudon", games: "Omega Ruby" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "Battle Tree · 64 BP" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Shop", place: "Stone Emporium", detail: "Stone Emporium · ₱50000 · After completing Main Mission 09: \"Chase That Mysterious Pokémon!\"" },
      ] },
    ],
  },
  "kangaskhanite": {
    name: "Kangaskhanite",
    description: "Lets Kangaskhan Mega Evolve in battle when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", buy: 30000, sell: null, cur: "poke-dollar" },
      { vg: ["legends-za"], games: "Legends: Z-A", buy: 70000, sell: null, cur: "poke-dollar" },
    ],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Overworld", place: "Glittering Cave", detail: "Requires upgraded Mega Ring · After obtaining an upgraded Mega Ring" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Pacifidlog Town" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "64 BP" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "64 BP" },
      ] },
      { vg: "lets-go-pikachu-lets-go-eevee", games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", lines: [
        { type: "Overworld", place: "Indigo Plateau" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Shop", place: "Stone Emporium", detail: "₱70000 · After completing Main Mission 09: Chase That Mysterious Pokémon!" },
      ] },
    ],
  },
  "gyaradosite": {
    name: "Gyaradosite",
    description: "Lets Gyarados Mega Evolve in battle when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", buy: 30000, sell: null, cur: "poke-dollar" },
    ],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Overworld", place: "Couriway Town", detail: "Requires an upgraded Mega Ring" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Hoenn Route 123", detail: "From Chomper the Poochyena" },
      ] },
    ],
  },
  "absolite": {
    name: "Absolite",
    description: "Lets Absol Mega Evolve in battle when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "NPC Gift", place: "Kiloude City", detail: "From Calem/Serena after defeating them · After defeating Calem/Serena" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Safari Zone (Hoenn)", detail: "Requires Acro Bike" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "Battle Tree · 64 BP" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "Battle Tree · 64 BP" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Story", place: "Defeat the Rogue Mega Absol in Main Mission 09", detail: "Main Mission 09: Chase That Mysterious Pokémon!" },
      ] },
    ],
  },
  "charizardite-y": {
    name: "Charizardite Y",
    description: "Lets Charizard Mega Evolve into Mega Charizard Y when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["x-y"], games: "X/Y", buy: 10000, sell: null, cur: "poke-dollar" },
      { vg: ["legends-za"], games: "Legends: Z-A", buy: 100000, sell: null, cur: "poke-dollar" },
    ],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Event", games: "X" },
        { type: "Story", place: "Pokémon Research Lab (Kalos)", detail: "If Charmander is chosen", games: "Y" },
      ] },
    ],
  },
  "alakazite": {
    name: "Alakazite",
    description: "Lets Alakazam Mega Evolve in battle when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", buy: 30000, sell: null, cur: "poke-dollar" },
    ],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Overworld", place: "Reflection Cave", detail: "B2F, requires an upgraded Mega Ring · After obtaining an upgraded Mega Ring" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Shop", place: "Slateport City", detail: "Slateport Market" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Ancient Poni Path", detail: "From Dexio after becoming Champion · After becoming Champion" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Poni Plains", detail: "From Dexio after becoming Champion · After becoming Champion" },
      ] },
      { vg: "lets-go-pikachu-lets-go-eevee", games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", lines: [
        { type: "Overworld", place: "Indigo Plateau" },
      ] },
    ],
  },
  "heracronite": {
    name: "Heracronite",
    description: "Lets Heracross Mega Evolve in battle when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Event", games: "X" },
        { type: "Overworld", place: "Santalune Forest", detail: "Requires upgraded Mega Ring", games: "Y" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Hoenn Route 127" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "64 BP" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Exchange", place: "Quesartico Inc. (Building)", detail: "₱240 · Requires Mega Shards" },
      ] },
    ],
  },
  "mawilite": {
    name: "Mawilite",
    description: "Lets Mawile Mega Evolve in battle when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Overworld", place: "Shabboneau Castle", detail: "2F (requires an upgraded Mega Ring) · Requires upgraded Mega Ring" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Verdanturf Town" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "64 BP" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Story", place: "Defeat the Rogue Mega Mawile in Main Mission 21", detail: "Main Mission 21: A Rogue Mega Mawile" },
      ] },
    ],
  },
  "manectite": {
    name: "Manectite",
    description: "Lets Manectric Mega Evolve in battle when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Overworld", place: "Kalos Route 16", detail: "Requires an upgraded Mega Ring", games: "X" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Seaside Cycling Road" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "64 BP" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Exchange", place: "Quesartico Inc. (Building)", detail: "₱180 · Requires Mega Shards" },
      ] },
    ],
  },
  "garchompite": {
    name: "Garchompite",
    description: "Lets Garchomp Mega Evolve in battle when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", buy: 0, sell: null, cur: "poke-dollar" },
      { vg: ["legends-za"], games: "Legends: Z-A", buy: 70000, sell: null, cur: "poke-dollar" },
    ],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Overworld", place: "Victory Road (Kalos)", detail: "Requires upgraded Mega Ring" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Fortree City", detail: "From Aarune after reaching Platinum rank Secret Base" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "64 BP" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "64 BP" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Shop", place: "Stone Emporium", detail: "₱70000 · After completing Main Mission 09: Chase That Mysterious Pokémon!" },
      ] },
    ],
  },
  "roseli-berry": {
    name: "Roseli Berry",
    description: "Halves the damage of one super-effective Fairy-type hit, then is eaten.",
    category: "Type protection", pocket: "berries",
    gens: [6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Overworld", place: "Kalos Route 14" },
      ] },
    ],
  },
  "kee-berry": {
    name: "Kee Berry",
    description: "When a physical move hits the holder, its Defense rises and the Berry is used up.",
    category: "Other", pocket: "berries",
    gens: [6, 7, 8, 9],
    fling: { power: 10, effect: "Immediately activates the berry’s effect on the target" },
    prices: [
      { vg: ["x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Crafting", place: "Mutation of Liechi and Ganlon Berries" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Gather Berries skill" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Overworld", place: "Alola Route 10", detail: "Berry piles" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Overworld", place: "Alola Route 10", detail: "Berry piles" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Berry Tree", place: "Axew’s Eye", detail: "Berry trees" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Tournament", place: "Ogre Oustin'", detail: "The Teal Mask" },
      ] },
    ],
  },
  "maranga-berry": {
    name: "Maranga Berry",
    description: "When a special move hits the holder, its Sp. Def rises and the Berry is used up.",
    category: "Other", pocket: "berries",
    gens: [6, 7, 8, 9],
    fling: { power: 10, effect: "Immediately activates the berry’s effect on the target" },
    prices: [
      { vg: ["x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 10, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 40, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 20, cur: "poke-dollar" },
    ],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Harvest", place: "Mutation of Salac and Petaya Berries" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Harvest", place: "Super-Secret Base (Gather Berries skill)" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Overworld", place: "Poni Plains", detail: "Berry piles" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Overworld", place: "Poni Plains", detail: "Berry piles" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Berry Tree", place: "Axew’s Eye", detail: "Berry trees" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Event", place: "Ogre Oustin'" },
      ] },
    ],
  },
  "discount-coupon": {
    name: "Discount Coupon",
    description: "Halves the price of one purchase at a Kalos boutique.",
    category: "Loot", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 10, cur: "poke-dollar" },
    ],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Event", place: "Pokémon Global Link" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Exchange", place: "Trade" },
      ] },
    ],
  },
  "strange-souvenir": {
    name: "Strange Souvenir",
    description: "An ornament of an Alolan guardian deity; only good for selling outside Alola.",
    category: "Loot", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["x-y", "omega-ruby-alpha-sapphire"], games: "X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 5, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: 3000, sell: 1500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "NPC Gift", place: "Any hotel (Backpacker after meeting him four times)", detail: "After meeting the Backpacker four times" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Exchange", place: "Trade" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Shop", place: "Thrifty Megamart", detail: "₱3000" },
        { type: "Overworld", place: "Malie City" },
      ] },
    ],
  },
  "lumiose-galette": {
    name: "Lumiose Galette",
    description: "Lumiose City's specialty pastry; cures any status condition and confusion.",
    category: "Status cures", pocket: "medicine",
    gens: [6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["x-y"], games: "X/Y", buy: 100, sell: 100, cur: "poke-dollar" },
      { vg: ["omega-ruby-alpha-sapphire"], games: "Omega Ruby/Alpha Sapphire", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 175, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 87, cur: "poke-dollar" },
      { vg: ["legends-za"], games: "Legends: Z-A", buy: 350, sell: 87, cur: "poke-dollar" },
    ],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Shop", place: "Lumiose City", detail: "Galette Stand · ₱100 · Only available for four hours at a time starting from 3 AM, 9 AM, 3 PM, and 9 PM." },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Random gift from a fan after completing a Contest", games: "Alpha Sapphire" },
        { type: "Story", place: "Trick House", detail: "Trick House", games: "Omega Ruby" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Pokémon Center Café", games: "Moon" },
        { type: "Overworld", place: "Hau'oli City", games: "Sun" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Raid", place: "Giant's Bed, Old Cemetery, Ballimere Lake", detail: "The Crown Tundra", games: "Shield" },
        { type: "NPC Gift", games: "Sword" },
      ] },
    ],
  },
  "jaw-fossil": {
    name: "Jaw Fossil",
    description: "A fossil of a prehistoric land Pokémon, part of a huge jaw; revived, it becomes Tyrunt.",
    category: "Dex completion", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 100 },
    prices: [
      { vg: ["x-y"], games: "X/Y", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["sun-moon"], games: "Sun/Moon", buy: null, sell: 3500, cur: "poke-dollar" },
      { vg: ["ultra-sun-ultra-moon"], games: "Ultra Sun/Ultra Moon", buy: 7000, sell: 3500, cur: "poke-dollar" },
      { vg: ["legends-za"], games: "Legends: Z-A", buy: 20000, sell: 10000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Choice", place: "Glittering Cave", detail: "Choice between this and the Sail Fossil" },
      ] },
    ],
  },
  "sail-fossil": {
    name: "Sail Fossil",
    description: "A fossil of a prehistoric land Pokémon, bearing a skin sail; revived, it becomes Amaura.",
    category: "Dex completion", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 100 },
    prices: [
      { vg: ["x-y"], games: "X/Y", buy: null, sell: 500, cur: "poke-dollar" },
      { vg: ["sun-moon"], games: "Sun/Moon", buy: null, sell: 3500, cur: "poke-dollar" },
      { vg: ["ultra-sun-ultra-moon"], games: "Ultra Sun/Ultra Moon", buy: 7000, sell: 3500, cur: "poke-dollar" },
      { vg: ["legends-za"], games: "Legends: Z-A", buy: 20000, sell: 10000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Overworld", place: "Glittering Cave", detail: "Choice between Sail Fossil and Jaw Fossil" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Shop", place: "Konikoni City", detail: "Olivia's jewelry shop", games: "Ultra Moon" },
      ] },
    ],
  },
  "fairy-gem": {
    name: "Fairy Gem",
    description: "Powers up the holder's next Fairy-type move, then shatters.",
    category: "Jewels", pocket: "misc",
    gens: [6, 7, 8, 9],
    prices: [
      { vg: ["x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "lets-go-pikachu-lets-go-eevee"], games: "X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Let’s Go, Pikachu!/Let’s Go, Eevee!", buy: null, sell: 100, cur: "poke-dollar" },
    ],
  },
  "adventure-rules": {
    name: "Adventure Guide",
    description: "A pocket guide to the basics you've picked up along the way.",
    category: "Gameplay", pocket: "key",
    gens: [6, 7, 8, 9],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "NPC Gift", place: "Kalos Route 03", detail: "From Calem or Serena upon arrival" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Starting Item", place: "Postwick", detail: "In the player's Bag when obtained" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Starting Item", place: "Cabo Poco", detail: "In the player's Bag when obtained" },
      ] },
    ],
  },
  "elevator-key": {
    name: "Elevator Key",
    description: "A key card that runs the elevator in Lysandre Labs.",
    category: "Plot advancement", pocket: "key",
    gens: [6, 7, 8, 9],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "NPC Defeat", place: "Lysandre Labs", detail: "From Mable after defeating her" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Story", place: "Lysandre Labs" },
      ] },
    ],
  },
  "holo-caster": {
    name: "Holo Caster",
    description: "Lysandre's hologram phone; friends and news reach you through it.",
    category: "Gameplay", pocket: "key",
    gens: [6, 7, 8, 9],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Starting Item", place: "Vaniville Town", detail: "Automatically obtained at the start of the game" },
      ] },
    ],
  },
  "honor-of-kalos": {
    name: "Honor of Kalos",
    description: "A medal presented in Lumiose City for your service to the Kalos region.",
    category: "Plot advancement", pocket: "key",
    gens: [6, 7, 8, 9],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Story", place: "Lumiose City", detail: "From Professor Sycamore during the parade after entering the Hall of Fame · After entering the Hall of Fame" },
      ] },
    ],
  },
  "intriguing-stone": {
    name: "Intriguing Stone",
    description: "A curious stone that might be worth something; someone in Kalos will tell you what it really is.",
    category: "Plot advancement", pocket: "key",
    gens: [6, 7, 8, 9],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "NPC Gift", place: "Shalour City", detail: "From Tierno before entering the Tower of Mastery" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Verdanturf Town", detail: "From the girl with the missing Shroomish found behind the Verdanturf Town sign" },
      ] },
    ],
  },
  "lens-case": {
    name: "Lens Case",
    description: "A case for colored contact lenses; lets you change your eye color at a boutique salon.",
    category: "Gameplay", pocket: "key",
    gens: [6, 7, 8, 9],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "NPC Gift", place: "Lumiose City", detail: "Punk Girl in the PR Video Studio" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Hau'oli City", detail: "Lillie, outside the apparel shop" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Hau'oli City", detail: "Lillie, outside the apparel shop" },
      ] },
    ],
  },
  "looker-ticket": {
    name: "Looker Ticket",
    description: "A hand-painted ticket hidden around Lumiose City; part of Looker's post-game case.",
    category: "Plot advancement", pocket: "key",
    gens: [6, 7, 8, 9],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Overworld", place: "Lumiose City", detail: "Prism Tower 1F (west of the elevator) · Post-game Looker Bureau quest", games: "X" },
        { type: "Overworld", place: "Lumiose City", detail: "Magenta Plaza Pokémon Center (near the dressing room) · Post-game Looker Bureau quest" },
        { type: "Overworld", place: "Lumiose City", detail: "Herboriste (east wall) · Post-game Looker Bureau quest", games: "X" },
        { type: "Overworld", place: "Lumiose City", detail: "Hotel Richissime 1F (east wall) · Post-game Looker Bureau quest", games: "X" },
        { type: "Overworld", place: "Lumiose City", detail: "Lumiose Museum 1F (east wall, near the couch) · Post-game Looker Bureau quest", games: "X" },
      ] },
    ],
  },
  "mega-ring": {
    name: "Mega Ring",
    description: "The Key Stone ring worn in Kalos; lets a Pokémon holding its Mega Stone Mega Evolve.",
    category: "Gameplay", pocket: "key",
    gens: [6, 7, 8, 9],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Story", place: "Tower of Mastery", detail: "From Korrina after earning the Rumble Badge · Rumble Badge Badge" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Story", place: "Jaune Sector 10", detail: "From AZ before facing the Rogue Mega-Evolved Absol" },
      ] },
    ],
  },
  "power-plant-pass": {
    name: "Power Plant Pass",
    description: "An ID pass that gets you into the Kalos Power Plant.",
    category: "Plot advancement", pocket: "key",
    gens: [6, 7, 8, 9],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Overworld", place: "Kalos Route 13", detail: "In the rock next to the Team Flare Grunt" },
      ] },
    ],
  },
  "profs-letter": {
    name: "Prof’s Letter",
    description: "Professor Sycamore's letter to your mother, explaining what he's asked of you.",
    category: "Plot advancement", pocket: "key",
    gens: [6, 7, 8, 9],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "NPC Gift", place: "Aquacorde Town", detail: "Received from Tierno after obtaining a first partner Pokémon and the Pokédex · After receiving a first partner Pokémon and the Pokédex" },
      ] },
    ],
  },
  "roller-skates": {
    name: "Roller Skates",
    description: "Skates that glide faster than running and grind along rails.",
    category: "Gameplay", pocket: "key",
    gens: [6, 7, 8, 9],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "NPC Defeat", place: "Santalune City", detail: "From Roller Skater Rinka after defeating her" },
      ] },
    ],
  },
  "sprinklotad": {
    name: "Sprinklotad",
    description: "A Lotad-shaped watering can for tending Berry plants.",
    category: "Gameplay", pocket: "key",
    gens: [6, 7, 8, 9],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "NPC Gift", place: "Berry Fields (Kalos)", detail: "Berry grower after agreeing to help him grow Berries" },
      ] },
    ],
  },
  "tmv-pass": {
    name: "TMV Pass",
    description: "A commuter pass for the TMV train between Lumiose City and Kiloude City.",
    category: "Gameplay", pocket: "key",
    gens: [6, 7, 8, 9],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "NPC Gift", place: "Lumiose City", detail: "Lumiose Station, from Professor Sycamore · After entering the Hall of Fame" },
      ] },
    ],
  },
  "tm96": {
    name: "TM96",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [6, 7, 8, 9],
    prices: [
      { vg: ["brilliant-diamond-shining-pearl"], games: "Brilliant Diamond/Shining Pearl", buy: null, sell: 1000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 400, cur: "poke-dollar" },
    ],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Overworld", place: "Ambrette Town" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Fiery Path" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Overworld", place: "Alola Route 5" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Overworld", place: "Alola Route 5" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Overworld", place: "Route 8 - Galar" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Achievement", detail: "Reward for attaining research level 40" },
      ] },
    ],
  },
  "tm97": {
    name: "TM97",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [6, 7, 8, 9],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Overworld", place: "Kalos Route 15" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Team Aqua Hideout", games: "Alpha Sapphire" },
        { type: "Overworld", place: "Team Magma Hideout", games: "Omega Ruby" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Overworld", place: "Poni Coast" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Overworld", place: "Poni Coast" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Overworld", place: "Turffield" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Achievement", place: "Reward for attaining research level 31" },
      ] },
    ],
  },
  "tm98": {
    name: "TM98",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [6, 7, 8, 9],
    prices: [
      { vg: ["omega-ruby-alpha-sapphire"], games: "Omega Ruby/Alpha Sapphire", buy: 10000, sell: null, cur: "poke-dollar" },
      { vg: ["brilliant-diamond-shining-pearl"], games: "Brilliant Diamond/Shining Pearl", buy: 40, sell: null, cur: "battle-point" },
      { vg: ["brilliant-diamond-shining-pearl"], games: "Brilliant Diamond/Shining Pearl", buy: null, sell: 1000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 3000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "NPC Defeat", place: "Defeating Korrina" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Shop", place: "Mauville City", detail: "Mauville City Poké Mart · ₱10000" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Overworld", place: "Poni Breaker Coast" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Overworld", place: "Poni Breaker Coast" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Overworld", place: "Route 10 - Galar" },
      ] },
      { vg: "brilliant-diamond-shining-pearl", games: "Brilliant Diamond/Shining Pearl", lines: [
        { type: "Exchange", place: "Battle Tower (Sinnoh)", detail: "40 BP" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "TM Machine", detail: "3000 LP · Requires Girafarig Fur ×3 and Flittle Down ×3." },
      ] },
    ],
  },
  "tm99": {
    name: "TM99",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [6, 7, 8, 9],
    prices: [
      { vg: ["brilliant-diamond-shining-pearl"], games: "Brilliant Diamond/Shining Pearl", buy: null, sell: 1250, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 8000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 8000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Trainer Reward", place: "Defeat Valerie" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Hoenn Route 123" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Overworld", place: "Vast Poni Canyon" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Overworld", place: "Vast Poni Canyon" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Trainer Reward", place: "Defeat Raihan" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Request", place: "Jaune Sector 7", detail: "Side Mission 079 reward · Complete Side Mission 079" },
      ] },
    ],
  },
  "tm100": {
    name: "TM100",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [6, 7, 8, 9],
    prices: [
      { vg: ["omega-ruby-alpha-sapphire"], games: "Omega Ruby/Alpha Sapphire", buy: 5000, sell: null, cur: "poke-dollar" },
      { vg: ["brilliant-diamond-shining-pearl"], games: "Brilliant Diamond/Shining Pearl", buy: null, sell: 1000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Overworld", place: "Coumarine City" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Shop", place: "Slateport City", detail: "₱5000" },
      ] },
    ],
  },
  "latiasite": {
    name: "Latiasite",
    description: "Lets Latias Mega Evolve in battle when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Exchange", place: "Trade" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Wild Pokémon", place: "Southern Island", detail: "Held by Latias", games: "Alpha Sapphire" },
        { type: "NPC Gift", place: "Littleroot Town", detail: "From Mom after completing the Delta Episode · After completing the Delta Episode", games: "Omega Ruby" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Event" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "Battle Tree · 64 BP" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Story", place: "Side Mission 189: Siblings of the Sky", detail: "After defeating Brother and Sister" },
      ] },
    ],
  },
  "latiosite": {
    name: "Latiosite",
    description: "Lets Latios Mega Evolve in battle when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Transfer", place: "Trade", games: "X" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Littleroot Town", detail: "From Mom after completing the Delta Episode · After completing the Delta Episode", games: "Alpha Sapphire" },
        { type: "Wild Pokémon", place: "Southern Island", detail: "Held by Latios", games: "Omega Ruby" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "64 BP", games: "Ultra Sun" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Story", place: "Side Mission 189: Siblings of the Sky", detail: "After defeating Brother and Sister" },
      ] },
    ],
  },
  "common-stone": {
    name: "Common Stone",
    description: "A perfectly ordinary stone that only looks valuable; never actually handed out.",
    category: "Unused", pocket: "key",
    gens: [6, 7, 8, 9],
  },
  "makeup-bag": {
    name: "Makeup Bag",
    description: "A bag of lipsticks; lets you change your lip color at a boutique salon.",
    category: "Gameplay", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Hau'oli City", detail: "From Lillie outside the apparel shop · Player character is female" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Hau'oli City", detail: "From Lillie outside the apparel shop · Player character is female" },
      ] },
    ],
  },
  "travel-trunk": {
    name: "Travel Trunk",
    description: "A trunk for every outfit you own; never actually handed out.",
    category: "Unused", pocket: "key",
    gens: [6, 7, 8, 9],
  },
  "shalour-sable": {
    name: "Shalour Sable",
    description: "Shalour City's specialty shortbread; cures any status condition and confusion.",
    category: "Status cures", pocket: "medicine",
    gens: [6, 7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["x-y", "omega-ruby-alpha-sapphire"], games: "X/Y, Omega Ruby/Alpha Sapphire", buy: null, sell: 100, cur: "poke-dollar" },
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 175, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 87, cur: "poke-dollar" },
    ],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "Exchange", place: "Trade" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Trick House" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Pokémon Center Café" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Festival Plaza", detail: "General Store" },
      ] },
      { vg: "lets-go-pikachu-lets-go-eevee", games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", lines: [
        { type: "Overworld", place: "S.S. Anne" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "NPC Gift" },
      ] },
    ],
  },
  "mega-charm": {
    name: "Mega Charm",
    description: "A Key Stone charm from development that never appears in play.",
    category: "Unused", pocket: "key",
    gens: [6, 7, 8, 9],
  },
  "mega-glove": {
    name: "Mega Glove",
    description: "A Key Stone glove from development that never appears in play.",
    category: "Unused", pocket: "key",
    gens: [6, 7, 8, 9],
  },
  "devon-parts": {
    name: "Devon Parts",
    description: "A case of Devon machine parts; carried to Captain Stern in Slateport.",
    category: "Plot advancement", pocket: "key",
    gens: [6, 7, 8, 9],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "NPC Defeat", place: "Rusturf Tunnel", detail: "Team Magma Grunt · After earning the Stone Badge · Stone Badge Badge", games: "Ruby" },
        { type: "NPC Defeat", place: "Rusturf Tunnel", detail: "Team Aqua Grunt · After earning the Stone Badge · Stone Badge Badge", games: "Sapphire" },
      ] },
      { vg: "emerald", games: "Emerald", lines: [
        { type: "NPC Defeat", place: "Rusturf Tunnel", detail: "Team Aqua Grunt · After earning the Stone Badge · Stone Badge Badge" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Defeat", place: "Rusturf Tunnel", detail: "Team Aqua Grunt · After earning the Stone Badge · Stone Badge Badge", games: "Alpha Sapphire" },
        { type: "NPC Defeat", place: "Rusturf Tunnel", detail: "Team Magma Grunt · After earning the Stone Badge · Stone Badge Badge", games: "Omega Ruby" },
      ] },
    ],
  },
  "pokeblock-kit": {
    name: "Pokéblock Kit",
    description: "A Berry Blender and a Pokéblock Case together, for making and keeping Pokéblocks.",
    category: "Gameplay", pocket: "key",
    gens: [6, 7, 8, 9],
    where: [
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Slateport City", detail: "From Lisia after delivering the Devon Parts and attempting to enter Route 110 · After delivering the Devon Parts" },
      ] },
    ],
  },
  "key-to-room-1": {
    name: "Key to Room 1",
    description: "Opens Room 1 of Sea Mauville.",
    category: "Plot advancement", pocket: "key",
    gens: [6, 7, 8, 9],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Overworld", place: "Abandoned Ship", detail: "Room 3" },
      ] },
      { vg: "emerald", games: "Emerald", lines: [
        { type: "Overworld", place: "Abandoned Ship", detail: "Room 3" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Sea Mauville", detail: "Female Tuber on the right side" },
      ] },
    ],
  },
  "key-to-room-2": {
    name: "Key to Room 2",
    description: "Opens Room 2 of Sea Mauville.",
    category: "Plot advancement", pocket: "key",
    gens: [6, 7, 8, 9],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Overworld", place: "Abandoned Ship", detail: "Room 3" },
      ] },
      { vg: "emerald", games: "Emerald", lines: [
        { type: "Overworld", place: "Abandoned Ship", detail: "Room 3" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Sea Mauville", detail: "Room 1" },
      ] },
    ],
  },
  "key-to-room-4": {
    name: "Key to Room 4",
    description: "Opens Room 4 of Sea Mauville.",
    category: "Plot advancement", pocket: "key",
    gens: [6, 7, 8, 9],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Overworld", place: "Abandoned Ship", detail: "Room 1" },
      ] },
      { vg: "emerald", games: "Emerald", lines: [
        { type: "Overworld", place: "Abandoned Ship", detail: "Room 1" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Sea Mauville", detail: "Northern exterior; Fisherman" },
      ] },
    ],
  },
  "key-to-room-6": {
    name: "Key to Room 6",
    description: "Opens Room 6 of Sea Mauville.",
    category: "Plot advancement", pocket: "key",
    gens: [6, 7, 8, 9],
    where: [
      { vg: "ruby-sapphire", games: "Ruby/Sapphire", lines: [
        { type: "Overworld", place: "Abandoned Ship", detail: "Room 4" },
      ] },
      { vg: "emerald", games: "Emerald", lines: [
        { type: "Overworld", place: "Abandoned Ship", detail: "Room 4" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Sea Mauville", detail: "Room 2; from the Teammates" },
      ] },
    ],
  },
  "devon-scuba-gear": {
    name: "Devon Scuba Gear",
    description: "Devon-made breathing gear; lets you stay underwater while diving.",
    category: "Plot advancement", pocket: "key",
    gens: [6, 7, 8, 9],
    where: [
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Mossdeep City", detail: "From Steven after obtaining the Mind Badge, along with HM07 (Dive) · Mind Badge Badge" },
      ] },
    ],
  },
  "contest-costume--jacket": {
    name: "Contest Costume",
    description: "The jacket-and-trousers outfit you wear on stage in Contest Spectaculars.",
    category: "Gameplay", pocket: "key",
    gens: [6, 7, 8, 9],
    where: [
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Contest Hall", detail: "Received from Lisia upon approaching the registration desk" },
      ] },
    ],
  },
  "magma-suit": {
    name: "Magma Suit",
    description: "A Team Magma suit tough enough to survive the ride into space on Mega Rayquaza's back.",
    category: "Plot advancement", pocket: "key",
    gens: [6, 7, 8, 9],
    where: [
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Sootopolis City", detail: "Received from Maxie after Groudon has been awoken · After Groudon has been awakened", games: "Omega Ruby" },
      ] },
    ],
  },
  "aqua-suit": {
    name: "Aqua Suit",
    description: "A Team Aqua suit tough enough to survive the ride into space on Mega Rayquaza's back.",
    category: "Plot advancement", pocket: "key",
    gens: [6, 7, 8, 9],
    where: [
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Story", place: "Sootopolis City", detail: "Received from Archie after Kyogre has been awoken · After Kyogre has been awoken", games: "Alpha Sapphire" },
      ] },
    ],
  },
  "pair-of-tickets": {
    name: "Pair of Tickets",
    description: "Two tickets to a show at the Mossdeep Space Center, a family outing once the Delta Episode is done.",
    category: "Plot advancement", pocket: "key",
    gens: [6, 7, 8, 9],
    where: [
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Littleroot Town", detail: "From Norman · After entering the Hall of Fame at the start of the Delta Episode" },
      ] },
    ],
  },
  "mega-bracelet": {
    name: "Mega Bracelet",
    description: "The Key Stone bracelet worn in Hoenn's remakes; lets a Pokémon holding its Mega Stone Mega Evolve.",
    category: "Gameplay", pocket: "key",
    gens: [6, 7, 8, 9],
    where: [
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Southern Island", detail: "From Steven after Latias joins the player · After Latias joins the player", games: "Alpha Sapphire" },
        { type: "NPC Gift", place: "Southern Island", detail: "From Steven after Latios joins the player · After Latios joins the player", games: "Omega Ruby" },
      ] },
    ],
  },
  "mega-pendant": {
    name: "Mega Pendant",
    description: "A Key Stone pendant worn by an NPC; not obtainable.",
    category: "Unused", pocket: "key",
    gens: [6, 7, 8, 9],
  },
  "mega-glasses": {
    name: "Mega Glasses",
    description: "Key Stone glasses worn by an NPC; not obtainable.",
    category: "Unused", pocket: "key",
    gens: [6, 7, 8, 9],
  },
  "mega-anchor": {
    name: "Mega Anchor",
    description: "A Key Stone anchor carried by an NPC; not obtainable.",
    category: "Unused", pocket: "key",
    gens: [6, 7, 8, 9],
  },
  "mega-stickpin": {
    name: "Mega Stickpin",
    description: "A Key Stone stickpin worn by an NPC; not obtainable.",
    category: "Unused", pocket: "key",
    gens: [6, 7, 8, 9],
  },
  "mega-tiara": {
    name: "Mega Tiara",
    description: "A Key Stone tiara worn by an NPC; not obtainable.",
    category: "Unused", pocket: "key",
    gens: [6, 7, 8, 9],
  },
  "mega-anklet": {
    name: "Mega Anklet",
    description: "A Key Stone anklet worn by an NPC; not obtainable.",
    category: "Unused", pocket: "key",
    gens: [6, 7, 8, 9],
  },
  "swampertite": {
    name: "Swampertite",
    description: "Lets Swampert Mega Evolve in battle when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    where: [
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Hoenn Route 120", detail: "If the player's first partner Pokémon was Mudkip" },
        { type: "Overworld", place: "Hoenn Route 114", detail: "After defeating or capturing Kyogre · If the player's first partner Pokémon was not Mudkip", games: "Alpha Sapphire" },
        { type: "Overworld", place: "Hoenn Route 114", detail: "After defeating or capturing Groudon · If the player's first partner Pokémon was not Mudkip", games: "Omega Ruby" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Event" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "64 BP" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Tournament", place: "Ranked Battles Season 6", detail: "Reach Rank ?" },
      ] },
    ],
  },
  "sceptilite": {
    name: "Sceptilite",
    description: "Lets Sceptile Mega Evolve in battle when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    where: [
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Hoenn Route 120", detail: "If the player's first partner Pokémon was Treecko" },
        { type: "Overworld", place: "Hoenn Route 114", detail: "After defeating or capturing Kyogre · If the player's first partner Pokémon was not Treecko", games: "Alpha Sapphire" },
        { type: "Overworld", place: "Hoenn Route 114", detail: "After defeating or capturing Groudon · If the player's first partner Pokémon was not Treecko", games: "Omega Ruby" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Event" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "64 BP" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Tournament", place: "Ranked Battles Season 5", detail: "Reach Rank ?" },
      ] },
    ],
  },
  "sablenite": {
    name: "Sablenite",
    description: "Lets Sableye Mega Evolve in battle when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    where: [
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Sootopolis City" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "64 BP" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "64 BP" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Exchange", place: "Quasartico Inc. headquarters", detail: "₱180 · Cost is paid in Mega Shards" },
      ] },
    ],
  },
  "altarianite": {
    name: "Altarianite",
    description: "Lets Altaria Mega Evolve in battle when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    where: [
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Lilycove City", detail: "Requires Altaria in party" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Event" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "64 BP" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Story", place: "Main Mission 28: A Rogue Mega Altaria", detail: "After defeating the Rogue Mega Altaria" },
      ] },
    ],
  },
  "galladite": {
    name: "Galladite",
    description: "Lets Gallade Mega Evolve in battle when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    where: [
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Fallarbor Town", detail: "Given by Professor Cozmo after the Delta Episode · After completing the Delta Episode" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Event" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "64 BP" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Exchange", place: "Quesartico Inc. (Building)", detail: "₱240 · After completing Main Mission 24: Reaching Rank C · Requires Mega Shards" },
      ] },
    ],
  },
  "audinite": {
    name: "Audinite",
    description: "Lets Audino Mega Evolve in battle when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    where: [
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Battle Resort", detail: "Given by Looker" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Event", place: "First Mega Stone Gift" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "64 BP" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Exchange", place: "Quesartico Inc. (Building)", detail: "₱180 · Requires Mega Shards" },
      ] },
    ],
  },
  "metagrossite": {
    name: "Metagrossite",
    description: "Lets Metagross Mega Evolve in battle when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    where: [
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Pokémon League (Kalos)", detail: "Steven, after first rematch · After the first rematch with Steven" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "64 BP" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "64 BP" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Exchange", place: "Quesartico Inc. (Building)", detail: "₱360 · After completing Main Mission 30: Reaching Rank B · Cost listed as Mega Shards" },
      ] },
    ],
  },
  "sharpedonite": {
    name: "Sharpedonite",
    description: "Lets Sharpedo Mega Evolve in battle when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    where: [
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Team Aqua Hideout", detail: "From Archie during the Delta Episode · During the Delta Episode", games: "Alpha Sapphire" },
        { type: "NPC Gift", place: "Battle Resort", detail: "From Team Aqua during the first visit", games: "Omega Ruby" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "Battle Tree · 64 BP" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "Battle Tree · 64 BP" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Exchange", place: "Quesartico Inc. (Building)", detail: "Quasartico Inc. headquarters · ₱180 · Requires Mega Shards" },
      ] },
    ],
  },
  "slowbronite": {
    name: "Slowbronite",
    description: "Lets Slowbro Mega Evolve in battle when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", buy: 30000, sell: null, cur: "poke-dollar" },
    ],
    where: [
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Shoal Cave", detail: "After making a Shell Bell for the first time" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "64 BP" },
      ] },
      { vg: "lets-go-pikachu-lets-go-eevee", games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", lines: [
        { type: "Overworld", place: "Indigo Plateau" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "NPC Defeat", place: "Defeat the Rogue Mega Slowbro in Main Mission 11" },
      ] },
    ],
  },
  "steelixite": {
    name: "Steelixite",
    description: "Lets Steelix Mega Evolve in battle when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["legends-za"], games: "Legends: Z-A", buy: 70000, sell: null, cur: "poke-dollar" },
    ],
    where: [
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Granite Cave" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "64 BP" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Shop", place: "Stone Emporium", detail: "₱70000 · After completing Main Mission 09: \"Chase That Mysterious Pokémon!\"" },
      ] },
    ],
  },
  "pidgeotite": {
    name: "Pidgeotite",
    description: "Lets Pidgeot Mega Evolve in battle when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", buy: 30000, sell: null, cur: "poke-dollar" },
    ],
    where: [
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Devon Corporation", detail: "Mr. Stone · Show the Intriguing Stone", games: "Omega Ruby" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "64 BP" },
      ] },
      { vg: "lets-go-pikachu-lets-go-eevee", games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", lines: [
        { type: "Overworld", place: "Indigo Plateau" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Exchange", place: "Quesartico Inc. (Building)", detail: "₱180 · Requires Mega Shards" },
      ] },
    ],
  },
  "glalitite": {
    name: "Glalitite",
    description: "Lets Glalie Mega Evolve in battle when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    where: [
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Shoal Cave" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "64 BP" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "64 BP" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Exchange", place: "Quesartico Inc. (Building)", detail: "₱240 · After completing Main Mission 14: Reaching Rank E · Requires Mega Shards." },
      ] },
    ],
  },
  "diancite": {
    name: "Diancite",
    description: "Lets Diancie Mega Evolve in battle when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    where: [
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Any Pokémon Center", detail: "Enter with a fateful encounter Diancie in the party" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Event" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Konikoni City", detail: "Olivia's jewelry store · If the player has a Diancie in their party" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Event" },
      ] },
    ],
  },
  "prison-bottle": {
    name: "Prison Bottle",
    description: "The bottle that once sealed Hoopa's power; uncorked, Hoopa becomes Hoopa Unbound.",
    category: "Gameplay", pocket: "key",
    gens: [6, 7, 8, 9],
    where: [
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Any Poké Mart clerk (with Hoopa in the party)", detail: "If Hoopa is in the party" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Aether Paradise", detail: "Secret Lab A, from an Aether Foundation employee" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Aether Paradise", detail: "Secret Lab A, from an Aether Foundation employee" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Auction", place: "Porto Marinada", detail: "Auction house · If the player owns a Hoopa" },
      ] },
    ],
  },
  "mega-cuff": {
    name: "Mega Cuff",
    description: "A Key Stone cuff worn by an NPC; not obtainable.",
    category: "Unused", pocket: "key",
    gens: [6, 7, 8, 9],
  },
  "cameruptite": {
    name: "Cameruptite",
    description: "Lets Camerupt Mega Evolve in battle when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    where: [
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Story", place: "Battle Resort", detail: "From Team Magma during the first visit · First visit to Battle Resort", games: "Alpha Sapphire" },
        { type: "Story", place: "Team Magma Hideout", detail: "From Maxie during the Delta Episode · During the Delta Episode", games: "Omega Ruby" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Event" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "Battle Tree · 64 BP" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Story", place: "Main Mission 12: A Rogue Mega Camerupt", detail: "Defeat the Rogue Mega Camerupt" },
      ] },
    ],
  },
  "lopunnite": {
    name: "Lopunnite",
    description: "Lets Lopunny Mega Evolve in battle when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    where: [
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Mauville City", detail: "Mauville Hills" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "Battle Tree · 64 BP" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Exchange", place: "Quesartico Inc. (Building)", detail: "Quasartico Inc. headquarters · ₱180 · Requires Mega Shards" },
      ] },
    ],
  },
  "salamencite": {
    name: "Salamencite",
    description: "Lets Salamence Mega Evolve in battle when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    where: [
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Meteor Falls", detail: "Zinnia's grandmother · After completing the Delta Episode" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "64 BP" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "64 BP" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Exchange", place: "Quesartico Inc. (Building)", detail: "₱360 · After completing Main Mission 30: Reaching Rank B · Requires Mega Shards" },
      ] },
    ],
  },
  "beedrillite": {
    name: "Beedrillite",
    description: "Lets Beedrill Mega Evolve in battle when its Trainer has a Key Stone.",
    category: "Mega Stones", pocket: "misc",
    gens: [6, 7, 8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", buy: 30000, sell: null, cur: "poke-dollar" },
    ],
    where: [
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "Overworld", place: "Sea Mauville", detail: "Storage Room" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "64 BP" },
      ] },
      { vg: "lets-go-pikachu-lets-go-eevee", games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", lines: [
        { type: "Overworld", place: "Indigo Plateau" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Story", place: "Defeat the Rogue Mega Beedrill in Main Mission 16", detail: "Main Mission 16: A Rogue Mega Beedrill" },
      ] },
    ],
  },
  "key-stone": {
    name: "Key Stone",
    description: "The stone a Trainer carries to resonate with a Mega Stone and trigger Mega Evolution.",
    category: "Gameplay", pocket: "key",
    gens: [6, 7, 8, 9],
    where: [
      { vg: "x-y", games: "X/Y", lines: [
        { type: "NPC Gift", place: "Tower of Mastery", detail: "From Korrina after earning the Rumble Badge (Mega Ring) · Rumble Badge Badge" },
      ] },
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Southern Island", detail: "From Steven after obtaining Latias (Mega Bracelet) · After obtaining Latias", games: "Alpha Sapphire" },
        { type: "NPC Gift", place: "Southern Island", detail: "From Steven after obtaining Latios (Mega Bracelet) · After obtaining Latios", games: "Omega Ruby" },
      ] },
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Ancient Poni Path", detail: "From Dexio after becoming Champion · After becoming Champion" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Poni Plains", detail: "From Dexio after becoming Champion · After becoming Champion" },
      ] },
      { vg: "lets-go-pikachu-lets-go-eevee", games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", lines: [
        { type: "NPC Gift", place: "Professor Oak's Laboratory", detail: "From Blue after earning seven Badges · After earning seven Badges" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "NPC Gift", place: "Jaune Sector 10", detail: "From AZ before facing the Rogue Mega Absol (Mega Ring) · Before facing the Rogue Mega Absol" },
      ] },
    ],
  },
  "meteorite-shard": {
    name: "Meteorite Shard",
    description: "A fragment of meteorite from Granite Cave, faintly warm; Steven wants it studied during the Delta Episode.",
    category: "Plot advancement", pocket: "key",
    gens: [6, 7, 8, 9],
    where: [
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Granite Cave", detail: "From Zinnia after defeating her" },
      ] },
    ],
  },
  "eon-flute": {
    name: "Eon Flute",
    description: "Calls Latias or Latios down from the sky to soar on, anywhere outdoors.",
    category: "Gameplay", pocket: "key",
    gens: [6, 7, 8, 9],
    where: [
      { vg: "omega-ruby-alpha-sapphire", games: "Omega Ruby/Alpha Sapphire", lines: [
        { type: "NPC Gift", place: "Sootopolis City", detail: "Steven · After ending the world disaster caused by Kyogre.", games: "Alpha Sapphire" },
        { type: "NPC Gift", place: "Sootopolis City", detail: "Steven · After ending the world disaster caused by Groudon.", games: "Omega Ruby" },
      ] },
    ],
  },
  "normalium-z--held": {
    name: "Normalium Z",
    description: "Held with a Z-Ring, turns one of the holder's Normal-type moves into a Z-Move, once per battle.",
    category: "Z-Crystals", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Story", place: "Verdant Cavern", detail: "Reward for completing Ilima's trial" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Story", place: "Verdant Cavern", detail: "Reward for completing Ilima's trial" },
      ] },
    ],
  },
  "firium-z--held": {
    name: "Firium Z",
    description: "Held with a Z-Ring, turns one of the holder's Fire-type moves into a Z-Move, once per battle.",
    category: "Z-Crystals", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Trainer Reward", place: "Wela Volcano Park", detail: "Reward for completing Kiawe's trial" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Trainer Reward", place: "Wela Volcano Park", detail: "Reward for completing Kiawe's trial" },
      ] },
    ],
  },
  "waterium-z--held": {
    name: "Waterium Z",
    description: "Held with a Z-Ring, turns one of the holder's Water-type moves into a Z-Move, once per battle.",
    category: "Z-Crystals", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Story", place: "Brooklet Hill", detail: "Reward for completing Lana's trial" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Story", place: "Brooklet Hill", detail: "Reward for completing Lana's trial" },
      ] },
    ],
  },
  "electrium-z--held": {
    name: "Electrium Z",
    description: "Held with a Z-Ring, turns one of the holder's Electric-type moves into a Z-Move, once per battle.",
    category: "Z-Crystals", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Trainer Reward", place: "Ten Carat Hill", detail: "Reward from Professor Kukui after defeating Totem Hakamo-o (Demo) · Pokémon Sun and Moon Demo completion" },
        { type: "Trainer Reward", place: "Hokulani Observatory", detail: "Reward for completing Sophocles's trial" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Trainer Reward", place: "Hokulani Observatory", detail: "Reward for completing Sophocles's trial" },
      ] },
    ],
  },
  "grassium-z--held": {
    name: "Grassium Z",
    description: "Held with a Z-Ring, turns one of the holder's Grass-type moves into a Z-Move, once per battle.",
    category: "Z-Crystals", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Story", place: "Lush Jungle", detail: "Reward for completing Mallow's trial" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Story", place: "Lush Jungle", detail: "Reward for completing Mallow's trial" },
      ] },
    ],
  },
  "icium-z--held": {
    name: "Icium Z",
    description: "Held with a Z-Ring, turns one of the holder's Ice-type moves into a Z-Move, once per battle.",
    category: "Z-Crystals", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Overworld", place: "Mount Lanakila" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Overworld", place: "Mount Lanakila" },
      ] },
    ],
  },
  "fightinium-z--held": {
    name: "Fightinium Z",
    description: "Held with a Z-Ring, turns one of the holder's Fighting-type moves into a Z-Move, once per battle.",
    category: "Z-Crystals", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Trainer Reward", place: "Iki Town", detail: "Hala (Melemele Island grand trial) · After defeating Hala in the Melemele Island grand trial" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Trainer Reward", place: "Iki Town", detail: "Hala (Melemele Island grand trial) · After defeating Hala in the Melemele Island grand trial" },
      ] },
    ],
  },
  "poisonium-z--held": {
    name: "Poisonium Z",
    description: "Held with a Z-Ring, turns one of the holder's Poison-type moves into a Z-Move, once per battle.",
    category: "Z-Crystals", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Ancient Poni Path", detail: "Gift from Plumeria" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Ancient Poni Path", detail: "Gift from Plumeria" },
      ] },
    ],
  },
  "groundium-z--held": {
    name: "Groundium Z",
    description: "Held with a Z-Ring, turns one of the holder's Ground-type moves into a Z-Move, once per battle.",
    category: "Z-Crystals", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Vast Poni Canyon", detail: "Hapu, after defeating her in the Poni Island grand trial · After completing the Poni Island grand trial" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Exeggutor Island", detail: "Hapu, after defeating her in the Poni Island grand trial · After completing the Poni Island grand trial" },
      ] },
    ],
  },
  "flyinium-z--held": {
    name: "Flyinium Z",
    description: "Held with a Z-Ring, turns one of the holder's Flying-type moves into a Z-Move, once per battle.",
    category: "Z-Crystals", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Overworld", place: "Ten Carat Hill", detail: "Requires Machamp Shove" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Overworld", place: "Ten Carat Hill", detail: "Requires Machamp Shove" },
      ] },
    ],
  },
  "psychium-z--held": {
    name: "Psychium Z",
    description: "Held with a Z-Ring, turns one of the holder's Psychic-type moves into a Z-Move, once per battle.",
    category: "Z-Crystals", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Story", place: "Haina Desert", detail: "After completing Acerola's trial" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Story", place: "Haina Desert", detail: "After completing Acerola's trial" },
      ] },
    ],
  },
  "buginium-z--held": {
    name: "Buginium Z",
    description: "Held with a Z-Ring, turns one of the holder's Bug-type moves into a Z-Move, once per battle.",
    category: "Z-Crystals", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Story", place: "Shady House", detail: "Po Town – Shady House (after defeating Guzma) · After defeating Guzma" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Story", place: "Shady House", detail: "Po Town – Shady House (after defeating Guzma) · After defeating Guzma" },
      ] },
    ],
  },
  "rockium-z--held": {
    name: "Rockium Z",
    description: "Held with a Z-Ring, turns one of the holder's Rock-type moves into a Z-Move, once per battle.",
    category: "Z-Crystals", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Trainer Reward", place: "Ruins of Life", detail: "Olivia after defeating her in the Akala Island grand trial · After defeating Olivia in the Akala Island grand trial" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Trainer Reward", place: "Ruins of Life", detail: "Olivia after defeating her in the Akala Island grand trial · After defeating Olivia in the Akala Island grand trial" },
      ] },
    ],
  },
  "ghostium-z--held": {
    name: "Ghostium Z",
    description: "Held with a Z-Ring, turns one of the holder's Ghost-type moves into a Z-Move, once per battle.",
    category: "Z-Crystals", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Story", place: "Alola Route 14", detail: "Reward for completing Acerola's trial" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Story", place: "Alola Route 14", detail: "Reward for completing Acerola's trial" },
      ] },
    ],
  },
  "dragonium-z--held": {
    name: "Dragonium Z",
    description: "Held with a Z-Ring, turns one of the holder's Dragon-type moves into a Z-Move, once per battle.",
    category: "Z-Crystals", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Story", place: "Vast Poni Canyon", detail: "Reward for completing the trial" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Story", place: "Vast Poni Canyon", detail: "Reward for completing the trial" },
      ] },
    ],
  },
  "darkinium-z--held": {
    name: "Darkinium Z",
    description: "Held with a Z-Ring, turns one of the holder's Dark-type moves into a Z-Move, once per battle.",
    category: "Z-Crystals", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Trainer Reward", place: "Malie City", detail: "Nanu (after defeating him in the Ula'ula Island grand trial) · After defeating Nanu in the Ula'ula Island grand trial" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Trainer Reward", place: "Malie City", detail: "Nanu (after defeating him in the Ula'ula Island grand trial) · After defeating Nanu in the Ula'ula Island grand trial" },
      ] },
    ],
  },
  "steelium-z--held": {
    name: "Steelium Z",
    description: "Held with a Z-Ring, turns one of the holder's Steel-type moves into a Z-Move, once per battle.",
    category: "Z-Crystals", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Hokulani Observatory", detail: "Molayne, after completing Sophocles's trial · After completing Sophocles's trial" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Mount Hokulani", detail: "Molayne" },
      ] },
    ],
  },
  "fairium-z--held": {
    name: "Fairium Z",
    description: "Held with a Z-Ring, turns one of the holder's Fairy-type moves into a Z-Move, once per battle.",
    category: "Z-Crystals", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Vast Poni Canyon", detail: "Gift from Mina" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Trainer Reward", place: "Seafolk Village", detail: "Reward for completing Mina's trial" },
      ] },
    ],
  },
  "pikanium-z--held": {
    name: "Pikanium Z",
    description: "Held by a Pikachu that knows Volt Tackle, unleashes the Z-Move Catastropika.",
    category: "Z-Crystals", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Konikoni City", detail: "Woman with three Pikachu" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Hano Grand Resort", detail: "Chuuster after defeating Reporter Rita · After defeating Reporter Rita" },
      ] },
    ],
  },
  "bottle-cap": {
    name: "Bottle Cap",
    description: "Traded to the Hyper Trainer to max out one of a high-level Pokémon's IVs.",
    category: "Loot", pocket: "misc",
    gens: [7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["sun-moon", "sword-shield", "brilliant-diamond-shining-pearl"], games: "Sun/Moon, Sword/Shield, Brilliant Diamond/Shining Pearl", buy: null, sell: 2500, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 20000, sell: 5000, cur: "poke-dollar" },
      { vg: ["legends-za"], games: "Legends: Z-A", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
  },
  "gold-bottle-cap": {
    name: "Gold Bottle Cap",
    description: "Traded to the Hyper Trainer to max out all of a high-level Pokémon's IVs at once.",
    category: "Loot", pocket: "misc",
    gens: [7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["sun-moon", "sword-shield", "brilliant-diamond-shining-pearl"], games: "Sun/Moon, Sword/Shield, Brilliant Diamond/Shining Pearl", buy: null, sell: 5000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 15000, cur: "poke-dollar" },
    ],
  },
  "z-ring": {
    name: "Z-Ring",
    description: "A bracelet that channels Z-Power; with a Z-Crystal in it, a Pokémon can unleash a Z-Move once per battle.",
    category: "Gameplay", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Story", place: "Iki Town", detail: "From Hala after defeating Hau during the festival · After completing the ceremony battle with Hau" },
      ] },
    ],
  },
  "decidium-z--held": {
    name: "Decidium Z",
    description: "Held by a Decidueye that knows Spirit Shackle, unleashes the Z-Move Sinister Arrow Raid.",
    category: "Z-Crystals", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Alola Route 1", detail: "Hau (if the player did not start with Rowlet) · If the player did not start with Rowlet" },
        { type: "NPC Gift", place: "Malie Garden", detail: "Professor Kukui (if the player started with Rowlet) · If the player started with Rowlet" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Malie Garden", detail: "Professor Kukui (if the player started with Rowlet) · If the player started with Rowlet" },
        { type: "NPC Gift", place: "Iki Town", detail: "Hala (after defeating him in a rematch if the player did not choose Rowlet) · After defeating Hala in a rematch and if the player did not choose Rowlet" },
      ] },
    ],
  },
  "incinium-z--held": {
    name: "Incinium Z",
    description: "Held by an Incineroar that knows Darkest Lariat, unleashes the Z-Move Malicious Moonsault.",
    category: "Z-Crystals", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Alola Route 1", detail: "Hau (if the player did not start with Litten)", games: "Moon" },
        { type: "NPC Gift", place: "Malie Garden", detail: "Professor Kukui (if the player started with Litten)", games: "Sun" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Iki Town", detail: "Hala (after defeating him in a rematch if the player did not choose Litten) · After defeating Hala in a rematch", games: "Ultra Moon" },
        { type: "NPC Gift", place: "Malie Garden", detail: "Professor Kukui (if the player started with Litten)", games: "Ultra Sun" },
      ] },
    ],
  },
  "primarium-z--held": {
    name: "Primarium Z",
    description: "Held by a Primarina that knows Sparkling Aria, unleashes the Z-Move Oceanic Operetta.",
    category: "Z-Crystals", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Alola Route 1", detail: "Hau · If the player did not start with Popplio", games: "Moon" },
        { type: "NPC Gift", place: "Malie Garden", detail: "Professor Kukui · If the player started with Popplio", games: "Sun" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Iki Town", detail: "Hala (rematch) · After defeating Hala in a rematch if the player did not choose Popplio", games: "Ultra Moon" },
        { type: "NPC Gift", place: "Malie Garden", detail: "Professor Kukui · If the player started with Popplio", games: "Ultra Sun" },
      ] },
    ],
  },
  "tapunium-z--held": {
    name: "Tapunium Z",
    description: "Held by one of Alola's guardian deities that knows Nature's Madness, unleashes the Z-Move Guardian of Alola.",
    category: "Z-Crystals", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Story", place: "Ruins of Conflict", detail: "After catching or defeating Tapu Koko" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Story", place: "Ruins of Conflict", detail: "After catching or defeating any of the tapu" },
      ] },
    ],
  },
  "marshadium-z--held": {
    name: "Marshadium Z",
    description: "Held by a Marshadow that knows Spectral Thief, unleashes the Z-Move Soul-Stealing 7-Star Strike.",
    category: "Z-Crystals", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Event", place: "Bundled with Mount Tensei Marshadow" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Tide Song Hotel", detail: "From a man · Requires a Marshadow in the party" },
      ] },
    ],
  },
  "aloraichium-z--held": {
    name: "Aloraichium Z",
    description: "Held by an Alolan Raichu that knows Thunderbolt, unleashes the Z-Move Stoked Sparksurfer.",
    category: "Z-Crystals", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Seafolk Village", detail: "Lady in the Steelix Boat for showing her an Alolan Raichu" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Seafolk Village", detail: "Lady in the Steelix Boat for showing her an Alolan Raichu" },
      ] },
    ],
  },
  "snorlium-z--held": {
    name: "Snorlium Z",
    description: "Held by a Snorlax that knows Giga Impact, unleashes the Z-Move Pulverizing Pancake.",
    category: "Z-Crystals", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Event", place: "Bundled with the Snorlium Z Munchlax" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Tide Song Hotel", detail: "Man at Tide Song Hotel · Requires a Snorlax in the party" },
      ] },
    ],
  },
  "eevium-z--held": {
    name: "Eevium Z",
    description: "Held by an Eevee that knows Last Resort, unleashes the Z-Move Extreme Evoboost.",
    category: "Z-Crystals", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Thrifty Megamart", detail: "Given by Kagetora after defeating all Eevee users and Kagetora himself" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Thrifty Megamart", detail: "Given by Kagetora after defeating all Eevee users and Kagetora himself" },
      ] },
    ],
  },
  "mewnium-z--held": {
    name: "Mewnium Z",
    description: "Held by a Mew that knows Psychic, unleashes the Z-Move Genesis Supernova.",
    category: "Z-Crystals", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Event", place: "Pokémon Bank promotion" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Tide Song Hotel", detail: "Man at Tide Song Hotel · Requires a Mew in the party" },
      ] },
    ],
  },
  "pikashunium-z--held": {
    name: "Pikashunium Z",
    description: "Held by a cap-wearing Pikachu that knows Thunderbolt, unleashes the Z-Move 10,000,000 Volt Thunderbolt.",
    category: "Z-Crystals", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Event", place: "Bundled with Pikachu in a cap (I Choose You! event)" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Pikachu Valley", detail: "Female Pikachu after showing a Pikachu in a cap" },
      ] },
    ],
  },
  "forage-bag": {
    name: "Forage Bag",
    description: "Holds the ingredients you gather for Mallow's trial in Lush Jungle.",
    category: "Gameplay", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Lush Jungle", detail: "From Mallow at the beginning of the trial" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Lush Jungle", detail: "From Mallow at the beginning of the trial" },
      ] },
    ],
  },
  "fishing-rod": {
    name: "Fishing Rod",
    description: "Alola's all-purpose rod; cast it into a bubbling fishing spot to hook a Pokémon.",
    category: "Gameplay", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Brooklet Hill", detail: "From Lana for completing the trial · After completing Lana's trial" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Brooklet Hill", detail: "From Lana for completing the trial · After completing Lana's trial" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Starting Item", place: "Postwick", detail: "In the Bag when obtained" },
      ] },
    ],
  },
  "professors-mask": {
    name: "Professor’s Mask",
    description: "The Masked Royal's mask; Professor Kukui's not-so-secret alter ego wears it in the Battle Royal Dome.",
    category: "Plot advancement", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Hokulani Observatory", detail: "From Molayne after completing Sophocles's trial · After completing Sophocles's trial" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Hokulani Observatory", detail: "From Molayne after completing Sophocles's trial · After completing Sophocles's trial" },
      ] },
    ],
  },
  "festival-ticket": {
    name: "Festival Ticket",
    description: "Lets you host a mission in Festival Plaza.",
    category: "Gameplay", pocket: "key",
    gens: [7, 8, 9],
    prices: [
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "lets-go-pikachu-lets-go-eevee"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Let’s Go, Pikachu!/Let’s Go, Eevee!", buy: null, sell: 5, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Festival Plaza", detail: "Festival Plaza activities (gift from Sophocles, haunted houses, daily from the Dancer by the castle's bridge, or declining a one-star offer) · Includes daily and activity-based rewards." },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Festival Plaza", detail: "Festival Plaza activities (gift from Sophocles, haunted houses, daily from the Dancer by the castle's bridge, or declining a one-star offer) · Includes daily and activity-based rewards." },
      ] },
    ],
  },
  "sparkling-stone": {
    name: "Sparkling Stone",
    description: "A stone entrusted by Tapu Koko; Kukui shapes it into your first Z-Ring.",
    category: "Plot advancement", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Story", place: "Mahalo Trail", detail: "Plank Bridge; from Lillie after saving Nebby from wild Spearow" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Story", place: "Mahalo Trail", detail: "Plank Bridge; from Lillie after saving Nebby from wild Spearow" },
      ] },
    ],
  },
  "adrenaline-orb": {
    name: "Adrenaline Orb",
    description: "If the holder is hit by Intimidate, its Speed rises and the orb is used up; also makes wild Pokémon call for help more often.",
    category: "Held items", pocket: "misc",
    gens: [7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["sun-moon"], games: "Sun/Moon", buy: 300, sell: 150, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 5000, sell: 1250, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Shop", place: "All Poké Marts", detail: "₱300 · After completing three trials", games: "Moon" },
        { type: "Overworld", place: "Alola Route 4", games: "Sun" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Exchange", place: "Battle Tower (Galar)", detail: "10 BP", games: "Sword" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Shop", place: "Levincia", detail: "Delibird Presents · ₱5000 · After earning 4 Gym Badges", games: "Scarlet" },
      ] },
    ],
  },
  "zygarde-cube": {
    name: "Zygarde Cube",
    description: "Stores the Zygarde Cells and Cores you gather, and reassembles Zygarde into its 10%, 50%, or Complete Forme.",
    category: "Gameplay", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Defeat", place: "Heahea City", detail: "Defeat Sina", games: "Moon" },
        { type: "NPC Defeat", place: "Heahea City", detail: "Defeat Dexio", games: "Sun" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Defeat", place: "Alola Route 16", detail: "Defeat Sina · After catching Zygarde in Resolution Cave", games: "Ultra Moon" },
        { type: "NPC Defeat", place: "Alola Route 16", detail: "Defeat Dexio · After catching Zygarde in Resolution Cave", games: "Ultra Sun" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Shop", place: "Stow-on-Side", detail: "Bargain shop keeper · If the player owns a Zygarde" },
      ] },
    ],
  },
  "ice-stone": {
    name: "Ice Stone",
    description: "An evolution stone shaped like a snowflake; evolves certain Ice-type Pokémon.",
    category: "Evolution", pocket: "misc",
    gens: [7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["sun-moon"], games: "Sun/Moon", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", buy: 5000, sell: 2500, cur: "poke-dollar" },
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: null, sell: 750, cur: "poke-dollar" },
      { vg: ["legends-za"], games: "Legends: Z-A", buy: 3000, sell: 750, cur: "poke-dollar" },
    ],
  },
  "ride-pager": {
    name: "Ride Pager",
    description: "Summons a Ride Pokémon to carry you, smash rocks, or cross water; a Key Item in Alola.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Story", place: "Iki Town", detail: "From Hala after completing the Melemele Island grand trial · After defeating Hala in the Melemele Island grand trial" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Story", place: "Iki Town", detail: "From Hala after completing the Melemele Island grand trial · After defeating Hala in the Melemele Island grand trial" },
      ] },
    ],
  },
  "beast-ball": {
    name: "Beast Ball",
    description: "Built to catch Ultra Beasts, which it does five times as well; barely works on anything else.",
    category: "Special balls", pocket: "pokeballs",
    gens: [7, 8, 9],
    prices: [
      { vg: ["ultra-sun-ultra-moon"], games: "Ultra Sun/Ultra Moon", buy: 1000, sell: null, cur: "poke-dollar" },
    ],
  },
  "big-malasada": {
    name: "Big Malasada",
    description: "Alola's fried-dough specialty; cures any status condition and confusion.",
    category: "Status cures", pocket: "medicine",
    gens: [7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: 350, sell: 175, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 175, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Overworld", place: "Aether Paradise" },
        { type: "NPC Gift", place: "Hau'oli City", detail: "One per day per location", games: "Sun" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Overworld", place: "Royal Avenue", games: "Ultra Moon" },
        { type: "Overworld", place: "Ancient Poni Path", games: "Ultra Sun" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "NPC Gift", games: "Sword" },
      ] },
    ],
  },
  "red-nectar": {
    name: "Red Nectar",
    description: "Nectar from a red flower; an Oricorio that sips it takes on its Baile Style.",
    category: "Species-specific", pocket: "misc",
    gens: [7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 150, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 300, sell: 75, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Overworld", place: "Ula'ula Meadow", detail: "Daily" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Overworld", place: "Ula'ula Meadow", detail: "Daily" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Shop", place: "Delibird Presents", detail: "₱300 · After earning 3 Gym Badges" },
        { type: "Wild Pokémon", detail: "Held by wild Oricorio (Baile Style)" },
      ] },
    ],
  },
  "yellow-nectar": {
    name: "Yellow Nectar",
    description: "Nectar from a yellow flower; an Oricorio that sips it takes on its Pom-Pom Style.",
    category: "Species-specific", pocket: "misc",
    gens: [7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 150, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 300, sell: 75, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Overworld", place: "Melemele Meadow", detail: "Nighttime flowers · Nighttime; daily" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Overworld", place: "Melemele Meadow", detail: "Nighttime flowers · Nighttime; daily" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Shop", place: "Delibird Presents", detail: "₱300 · After earning 3 Gym Badges" },
      ] },
    ],
  },
  "pink-nectar": {
    name: "Pink Nectar",
    description: "Nectar from a pink flower; an Oricorio that sips it takes on its Pa'u Style.",
    category: "Species-specific", pocket: "misc",
    gens: [7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 150, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 300, sell: 75, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Overworld", place: "Royal Avenue", detail: "Daily" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Overworld", place: "Royal Avenue", detail: "Daily" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Shop", place: "Delibird Presents", detail: "₱300 · After earning 3 Gym Badges" },
      ] },
    ],
  },
  "purple-nectar": {
    name: "Purple Nectar",
    description: "Nectar from a purple flower; an Oricorio that sips it takes on its Sensu Style.",
    category: "Species-specific", pocket: "misc",
    gens: [7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 150, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 300, sell: 75, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Overworld", place: "Poni Meadow", detail: "Daily" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Overworld", place: "Poni Meadow", detail: "Daily" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Shop", place: "Delibird Presents", detail: "₱300 · After earning 3 Gym Badges" },
      ] },
    ],
  },
  "sun-flute": {
    name: "Sun Flute",
    description: "A flute once offered to the Legendary Pokémon of the sun; played at the Altar, it opens the way to Ultra Space.",
    category: "Plot advancement", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Overworld", place: "Exeggutor Island", games: "Sun" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Overworld", place: "Exeggutor Island", games: "Ultra Sun" },
      ] },
    ],
  },
  "moon-flute": {
    name: "Moon Flute",
    description: "A flute once offered to the Legendary Pokémon of the moon; played at the Altar, it opens the way to Ultra Space.",
    category: "Plot advancement", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Overworld", place: "Exeggutor Island", games: "Moon" },
        { type: "Story", place: "Given to Lillie after defeating Lusamine", detail: "After defeating Lusamine", games: "Sun" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Overworld", place: "Exeggutor Island", games: "Ultra Moon" },
        { type: "Story", place: "Given to Lillie after defeating Lusamine", detail: "After defeating Lusamine", games: "Ultra Sun" },
      ] },
    ],
  },
  "enigmatic-card": {
    name: "Enigmatic Card",
    description: "A card that lets you into the International Police's motel room on Route 8.",
    category: "Plot advancement", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Alola Route 1", detail: "Man in front of the player's house · After entering the Hall of Fame" },
      ] },
    ],
  },
  "terrain-extender": {
    name: "Terrain Extender",
    description: "Terrain the holder sets lasts eight turns instead of five.",
    category: "Held items", pocket: "misc",
    gens: [7, 8, 9],
    fling: { power: 60 },
    prices: [
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 15000, sell: 3750, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Overworld", place: "Resolution Cave" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "48 BP", games: "Ultra Sun" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Exchange", place: "Battle Tower (Galar)", detail: "15 BP", games: "Shield" },
        { type: "Overworld", place: "Route 8 - Galar", games: "Sword" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Shop", place: "Cascarrafa", detail: "Delibird Presents · ₱15000 · After completing the main storyline", games: "Scarlet" },
      ] },
    ],
  },
  "protective-pads": {
    name: "Protective Pads",
    description: "The holder's contact moves don't trigger effects like Rough Skin, Static, or a Rocky Helmet.",
    category: "Held items", pocket: "misc",
    gens: [7, 8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 15000, sell: 3750, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "48 BP" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Exchange", place: "Battle Tree", detail: "48 BP" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Bargain Shop", place: "Stow-on-Side", detail: "Bargain Shop" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Shop", place: "Levincia", detail: "Delibird Presents (Levincia Branch) · After earning 4 Gym Badges" },
      ] },
    ],
  },
  "electric-seed": {
    name: "Electric Seed",
    description: "Raises the holder's Defense once while Electric Terrain covers the field, then is used up.",
    category: "Held items", pocket: "misc",
    gens: [7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 20000, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Overworld", place: "Mahalo Trail" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Overworld", place: "Mahalo Trail" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Overworld", place: "Stepping-Stone Sea", detail: "The Isle of Armor" },
        { type: "Overworld", place: "Wyndon" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Overworld", place: "West Province (Area Three)" },
        { type: "Shop", place: "Cascarrafa", detail: "Delibird Presents · ₱20000 · After completing the main storyline" },
      ] },
    ],
  },
  "psychic-seed": {
    name: "Psychic Seed",
    description: "Raises the holder's Sp. Def once on Psychic Terrain, then breaks.",
    category: "Held items", pocket: "misc",
    gens: [7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 20000, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Seafolk Village" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Overworld", place: "Route 2 - Galar" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Shop", place: "Cascarrafa", detail: "Delibird Presents · ₱20000 · After completing the main storyline" },
      ] },
    ],
  },
  "misty-seed": {
    name: "Misty Seed",
    description: "Raises the holder's Sp. Defense once while Misty Terrain covers the field, then is used up.",
    category: "Held items", pocket: "misc",
    gens: [7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 20000, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Overworld", place: "Poni Gauntlet" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Overworld", place: "Slumbering Weald" },
        { type: "Crafting", place: "Fairy: 22–30 points", detail: "The Isle of Armor", games: "Sword" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Shop", place: "Cascarrafa", detail: "Delibird Presents · ₱20000 · After completing the main storyline", games: "Scarlet" },
        { type: "Overworld", place: "West Province (Area Three)", games: "Violet" },
      ] },
    ],
  },
  "grassy-seed": {
    name: "Grassy Seed",
    description: "Raises the holder's Defense once while Grassy Terrain covers the field, then is used up.",
    category: "Held items", pocket: "misc",
    gens: [7, 8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 20000, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "Overworld", place: "Malie Garden" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Overworld", place: "Alola Route 14" },
      ] },
    ],
  },
  "fighting-memory": {
    name: "Fighting Memory",
    description: "A data disc for Silvally; loaded, it and its Multi-Attack become Fighting-type.",
    category: "Memories", pocket: "misc",
    gens: [7, 8, 9],
    fling: { power: 50 },
    prices: [
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Aether Paradise", detail: "From Gladion · After becoming Champion" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Ancient Poni Path", detail: "From Wicke · After becoming Champion" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "NPC Gift", place: "Battle Tower (Galar)", detail: "From a League Staff member" },
      ] },
    ],
  },
  "flying-memory": {
    name: "Flying Memory",
    description: "A data disc for Silvally; loaded, it and its Multi-Attack become Flying-type.",
    category: "Memories", pocket: "misc",
    gens: [7, 8, 9],
    fling: { power: 50 },
    prices: [
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Aether Paradise", detail: "From Gladion after becoming Champion · After becoming Champion" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Ancient Poni Path", detail: "From Wicke after becoming Champion · After becoming Champion" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "NPC Gift", place: "Battle Tower (Galar)", detail: "From a League Staff member" },
      ] },
    ],
  },
  "poison-memory": {
    name: "Poison Memory",
    description: "A data disc for Silvally; loaded, it and its Multi-Attack become Poison-type.",
    category: "Memories", pocket: "misc",
    gens: [7, 8, 9],
    fling: { power: 50 },
    prices: [
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Aether Paradise", detail: "Gladion · After becoming Champion" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Ancient Poni Path", detail: "Wicke · After becoming Champion" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "NPC Gift", place: "Battle Tower (Galar)", detail: "League Staff member" },
      ] },
    ],
  },
  "ground-memory": {
    name: "Ground Memory",
    description: "A data disc for Silvally; loaded, it and its Multi-Attack become Ground-type.",
    category: "Memories", pocket: "misc",
    gens: [7, 8, 9],
    fling: { power: 50 },
    prices: [
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Aether Paradise", detail: "Gladion · After becoming Champion" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Ancient Poni Path", detail: "Wicke · After becoming Champion" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "NPC Gift", place: "Battle Tower (Galar)", detail: "League Staff member" },
      ] },
    ],
  },
  "rock-memory": {
    name: "Rock Memory",
    description: "A data disc for Silvally; loaded, it and its Multi-Attack become Rock-type.",
    category: "Memories", pocket: "misc",
    gens: [7, 8, 9],
    fling: { power: 50 },
    prices: [
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Aether Paradise", detail: "Gladion · After becoming Champion" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Ancient Poni Path", detail: "Wicke · After becoming Champion" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "NPC Gift", place: "Battle Tower (Galar)", detail: "League Staff member" },
      ] },
    ],
  },
  "bug-memory": {
    name: "Bug Memory",
    description: "A data disc for Silvally; loaded, it and its Multi-Attack become Bug-type.",
    category: "Memories", pocket: "misc",
    gens: [7, 8, 9],
    fling: { power: 50 },
    prices: [
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Aether Paradise", detail: "Gladion · After becoming Champion" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Ancient Poni Path", detail: "Wicke · After becoming Champion" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "NPC Gift", place: "Battle Tower (Galar)", detail: "League Staff member" },
      ] },
    ],
  },
  "ghost-memory": {
    name: "Ghost Memory",
    description: "A data disc for Silvally; loaded, it and its Multi-Attack become Ghost-type.",
    category: "Memories", pocket: "misc",
    gens: [7, 8, 9],
    fling: { power: 50 },
    prices: [
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Aether Paradise", detail: "Gladion · After becoming Champion" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Ancient Poni Path", detail: "Wicke · After becoming Champion" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "NPC Gift", place: "Battle Tower (Galar)", detail: "League Staff member" },
      ] },
    ],
  },
  "steel-memory": {
    name: "Steel Memory",
    description: "A data disc for Silvally; loaded, it and its Multi-Attack become Steel-type.",
    category: "Memories", pocket: "misc",
    gens: [7, 8, 9],
    fling: { power: 50 },
    prices: [
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Aether Paradise", detail: "From Gladion · After becoming Champion" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Ancient Poni Path", detail: "From Wicke · After becoming Champion" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "NPC Gift", place: "Battle Tower (Galar)", detail: "From a League Staff member" },
      ] },
    ],
  },
  "fire-memory": {
    name: "Fire Memory",
    description: "A data disc for Silvally; loaded, it and its Multi-Attack become Fire-type.",
    category: "Memories", pocket: "misc",
    gens: [7, 8, 9],
    fling: { power: 50 },
    prices: [
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Aether Paradise", detail: "From Gladion after becoming Champion · After becoming Champion" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Ancient Poni Path", detail: "From Wicke after becoming Champion · After becoming Champion" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "NPC Gift", place: "Battle Tower (Galar)", detail: "From a League Staff member" },
      ] },
    ],
  },
  "water-memory": {
    name: "Water Memory",
    description: "A data disc for Silvally; loaded, it and its Multi-Attack become Water-type.",
    category: "Memories", pocket: "misc",
    gens: [7, 8, 9],
    fling: { power: 50 },
    prices: [
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Aether Paradise", detail: "Gladion · After becoming Champion" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Ancient Poni Path", detail: "Wicke · After becoming Champion" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "NPC Gift", place: "Battle Tower (Galar)", detail: "League Staff member" },
      ] },
    ],
  },
  "grass-memory": {
    name: "Grass Memory",
    description: "A data disc for Silvally; loaded, it and its Multi-Attack become Grass-type.",
    category: "Memories", pocket: "misc",
    gens: [7, 8, 9],
    fling: { power: 50 },
    prices: [
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Aether Paradise", detail: "From Gladion after becoming Champion · After becoming Champion" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Ancient Poni Path", detail: "From Wicke after becoming Champion · After becoming Champion" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "NPC Gift", place: "Battle Tower (Galar)", detail: "From a League Staff member" },
      ] },
    ],
  },
  "electric-memory": {
    name: "Electric Memory",
    description: "A data disc for Silvally; loaded, it and its Multi-Attack become Electric-type.",
    category: "Memories", pocket: "misc",
    gens: [7, 8, 9],
    fling: { power: 50 },
    prices: [
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Aether Paradise", detail: "From Gladion · After becoming Champion" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Ancient Poni Path", detail: "From Wicke · After becoming Champion" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "NPC Gift", place: "Battle Tower (Galar)", detail: "From a League Staff member" },
      ] },
    ],
  },
  "psychic-memory": {
    name: "Psychic Memory",
    description: "A data disc for Silvally; loaded, it and its Multi-Attack become Psychic-type.",
    category: "Memories", pocket: "misc",
    gens: [7, 8, 9],
    fling: { power: 50 },
    prices: [
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Aether Paradise", detail: "From Gladion · After becoming Champion" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Ancient Poni Path", detail: "From Wicke · After becoming Champion" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "NPC Gift", place: "Battle Tower (Galar)", detail: "From a League Staff member" },
      ] },
    ],
  },
  "ice-memory": {
    name: "Ice Memory",
    description: "A data disc for Silvally; loaded, it and its Multi-Attack become Ice-type.",
    category: "Memories", pocket: "misc",
    gens: [7, 8, 9],
    fling: { power: 50 },
    prices: [
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Aether Paradise", detail: "From Gladion · After becoming Champion" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Ancient Poni Path", detail: "From Wicke · After becoming Champion" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "NPC Gift", place: "Battle Tower (Galar)", detail: "From a League Staff member" },
      ] },
    ],
  },
  "dragon-memory": {
    name: "Dragon Memory",
    description: "A data disc for Silvally; loaded, it and its Multi-Attack become Dragon-type.",
    category: "Memories", pocket: "misc",
    gens: [7, 8, 9],
    fling: { power: 50 },
    prices: [
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Aether Paradise", detail: "From Gladion · After becoming Champion" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Ancient Poni Path", detail: "From Wicke · After becoming Champion" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "NPC Gift", place: "Battle Tower (Galar)", detail: "From League Staff member" },
      ] },
    ],
  },
  "dark-memory": {
    name: "Dark Memory",
    description: "A data disc for Silvally; loaded, it and its Multi-Attack become Dark-type.",
    category: "Memories", pocket: "misc",
    gens: [7, 8, 9],
    fling: { power: 50 },
    prices: [
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Aether Paradise", detail: "From Gladion · After becoming Champion" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Ancient Poni Path", detail: "From Wicke · After becoming Champion" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "NPC Gift", place: "Battle Tower (Galar)", detail: "From League Staff member" },
      ] },
    ],
  },
  "fairy-memory": {
    name: "Fairy Memory",
    description: "A data disc for Silvally; loaded, it and its Multi-Attack become Fairy-type.",
    category: "Memories", pocket: "misc",
    gens: [7, 8, 9],
    fling: { power: 50 },
    prices: [
      { vg: ["sun-moon", "ultra-sun-ultra-moon", "sword-shield"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield", buy: null, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sun-moon", games: "Sun/Moon", lines: [
        { type: "NPC Gift", place: "Aether Paradise", detail: "From Gladion · After becoming Champion" },
      ] },
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Ancient Poni Path", detail: "From Wicke · After becoming Champion" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "NPC Gift", place: "Battle Tower (Galar)", detail: "From a League Staff member" },
      ] },
    ],
  },
  "bike--green": {
    name: "Bike",
    description: "The green Bicycle sold in Kalos; a color choice, nothing more.",
    category: "Unused", pocket: "key",
    gens: [6, 7, 8, 9],
  },
  "storage-key--galactic-warehouse": {
    name: "Storage Key",
    description: "Opens the locked door in Team Galactic's Veilstone warehouse.",
    category: "Unused", pocket: "key",
    gens: [6, 7, 8, 9],
    where: [
      { vg: "diamond-pearl", games: "Diamond/Pearl", lines: [
        { type: "Dropped", place: "Veilstone City", detail: "Dropped by a Team Galactic Grunt after encountering Jupiter at Lake Acuity · After encountering Jupiter at Lake Acuity" },
      ] },
      { vg: "brilliant-diamond-shining-pearl", games: "Brilliant Diamond/Shining Pearl", lines: [
        { type: "Dropped", place: "Veilstone City", detail: "Dropped by a Team Galactic Grunt after encountering Jupiter at Lake Acuity · After encountering Jupiter at Lake Acuity" },
      ] },
    ],
  },
  "basement-key--goldenrod": {
    name: "Basement Key",
    description: "Opens the basement under Goldenrod City's Underground while Team Rocket occupies the Radio Tower.",
    category: "Unused", pocket: "key",
    gens: [6, 7, 8, 9],
  },
  "dna-splicers--merge": {
    name: "DNA Splicers",
    description: "The DNA Splicers as they read while Kyurem is unfused: fuses it with Reshiram or Zekrom.",
    category: "Unused", pocket: "key",
    gens: [5, 6, 7, 8, 9],
  },
  "dna-splicers--split": {
    name: "DNA Splicers",
    description: "The DNA Splicers as they read while Kyurem is fused: splits it back apart.",
    category: "Unused", pocket: "key",
    gens: [5, 6, 7, 8, 9],
  },
  "dropped-item--red": {
    name: "Dropped Item",
    description: "The Xtransceiver Curtis left behind in Nimbasa's amusement park.",
    category: "Unused", pocket: "key",
    gens: [5, 6, 7, 8, 9],
  },
  "dropped-item--yellow": {
    name: "Dropped Item",
    description: "The Xtransceiver Yancy left behind in Nimbasa's amusement park.",
    category: "Unused", pocket: "key",
    gens: [5, 6, 7, 8, 9],
  },
  "holo-caster--green": {
    name: "Holo Caster",
    description: "The green Holo Caster, Kalos's hologram phone.",
    category: "Unused", pocket: "key",
    gens: [6, 7, 8, 9],
  },
  "bike--yellow": {
    name: "Bike",
    description: "The yellow Bicycle sold in Kalos; a color choice, nothing more.",
    category: "Unused", pocket: "key",
    gens: [6, 7, 8, 9],
  },
  "holo-caster--red": {
    name: "Holo Caster",
    description: "The red Holo Caster, Kalos's hologram phone.",
    category: "Unused", pocket: "key",
    gens: [6, 7, 8],
  },
  "basement-key--new-mauville": {
    name: "Basement Key",
    description: "Opens the door to New Mauville, the generator complex under Route 110.",
    category: "Unused", pocket: "key",
    gens: [6, 7, 8, 9],
  },
  "storage-key--sea-mauville": {
    name: "Storage Key",
    description: "Opens the locked storage room aboard Sea Mauville.",
    category: "Unused", pocket: "key",
    gens: [6, 7, 8, 9],
  },
  "ss-ticket--hoenn": {
    name: "S.S. Ticket",
    description: "A boarding pass for the S.S. Tidal between Slateport and Lilycove.",
    category: "Unused", pocket: "key",
    gens: [6, 7, 8, 9],
  },
  "contest-costume--dress": {
    name: "Contest Costume",
    description: "The dress you wear on stage in Contest Spectaculars.",
    category: "Unused", pocket: "key",
    gens: [6, 7, 8, 9],
  },
  "meteorite--2": {
    name: "Meteorite",
    description: "The Mt. Chimney meteorite, starting to glow as the Delta Episode unfolds.",
    category: "Unused", pocket: "key",
    gens: [6, 7, 8, 9],
  },
  "meteorite--3": {
    name: "Meteorite",
    description: "The Mt. Chimney meteorite, glowing brighter as the Delta Episode unfolds.",
    category: "Unused", pocket: "key",
    gens: [6, 7, 8, 9],
  },
  "meteorite--4": {
    name: "Meteorite",
    description: "The Mt. Chimney meteorite at its brightest, ready for the Delta Episode's end.",
    category: "Unused", pocket: "key",
    gens: [6, 7, 8, 9],
  },
  "normalium-z--bag": {
    name: "Normalium Z",
    description: "The Bag's copy of Normalium Z; a Pokémon's held copy is drawn from this.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "firium-z--bag": {
    name: "Firium Z",
    description: "The Bag's copy of Firium Z; a Pokémon's held copy is drawn from this.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "waterium-z--bag": {
    name: "Waterium Z",
    description: "The Bag's copy of Waterium Z; a Pokémon's held copy is drawn from this.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "electrium-z--bag": {
    name: "Electrium Z",
    description: "The Bag's copy of Electrium Z; a Pokémon's held copy is drawn from this.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "grassium-z--bag": {
    name: "Grassium Z",
    description: "The Bag's copy of Grassium Z; a Pokémon's held copy is drawn from this.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "icium-z--bag": {
    name: "Icium Z",
    description: "The Bag's copy of Icium Z; a Pokémon's held copy is drawn from this.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "fightinium-z--bag": {
    name: "Fightinium Z",
    description: "The Bag's copy of Fightinium Z; a Pokémon's held copy is drawn from this.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "poisonium-z--bag": {
    name: "Poisonium Z",
    description: "The Bag's copy of Poisonium Z; a Pokémon's held copy is drawn from this.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "groundium-z--bag": {
    name: "Groundium Z",
    description: "The Bag's copy of Groundium Z; a Pokémon's held copy is drawn from this.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "flyinium-z--bag": {
    name: "Flyinium Z",
    description: "The Bag's copy of Flyinium Z; a Pokémon's held copy is drawn from this.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "psychium-z--bag": {
    name: "Psychium Z",
    description: "The Bag's copy of Psychium Z; a Pokémon's held copy is drawn from this.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "buginium-z--bag": {
    name: "Buginium Z",
    description: "The Bag's copy of Buginium Z; a Pokémon's held copy is drawn from this.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "rockium-z--bag": {
    name: "Rockium Z",
    description: "The Bag's copy of Rockium Z; a Pokémon's held copy is drawn from this.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "ghostium-z--bag": {
    name: "Ghostium Z",
    description: "The Bag's copy of Ghostium Z; a Pokémon's held copy is drawn from this.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "dragonium-z--bag": {
    name: "Dragonium Z",
    description: "The Bag's copy of Dragonium Z; a Pokémon's held copy is drawn from this.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "darkinium-z--bag": {
    name: "Darkinium Z",
    description: "The Bag's copy of Darkinium Z; a Pokémon's held copy is drawn from this.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "steelium-z--bag": {
    name: "Steelium Z",
    description: "The Bag's copy of Steelium Z; a Pokémon's held copy is drawn from this.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "fairium-z--bag": {
    name: "Fairium Z",
    description: "The Bag's copy of Fairium Z; a Pokémon's held copy is drawn from this.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "pikanium-z--bag": {
    name: "Pikanium Z",
    description: "The Bag's copy of Pikanium Z; a Pokémon's held copy is drawn from this.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "decidium-z--bag": {
    name: "Decidium Z",
    description: "The Bag's copy of Decidium Z; a Pokémon's held copy is drawn from this.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "incinium-z--bag": {
    name: "Incinium Z",
    description: "The Bag's copy of Incinium Z; a Pokémon's held copy is drawn from this.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "primarium-z--bag": {
    name: "Primarium Z",
    description: "The Bag's copy of Primarium Z; a Pokémon's held copy is drawn from this.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "tapunium-z--bag": {
    name: "Tapunium Z",
    description: "The Bag's copy of Tapunium Z; a Pokémon's held copy is drawn from this.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "marshadium-z--bag": {
    name: "Marshadium Z",
    description: "The Bag's copy of Marshadium Z; a Pokémon's held copy is drawn from this.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "aloraichium-z--bag": {
    name: "Aloraichium Z",
    description: "The Bag's copy of Aloraichium Z; a Pokémon's held copy is drawn from this.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "snorlium-z--bag": {
    name: "Snorlium Z",
    description: "The Bag's copy of Snorlium Z; a Pokémon's held copy is drawn from this.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "eevium-z--bag": {
    name: "Eevium Z",
    description: "The Bag's copy of Eevium Z; a Pokémon's held copy is drawn from this.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "mewnium-z--bag": {
    name: "Mewnium Z",
    description: "The Bag's copy of Mewnium Z; a Pokémon's held copy is drawn from this.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "pikashunium-z--bag": {
    name: "Pikashunium Z",
    description: "The Bag's copy of Pikashunium Z; a Pokémon's held copy is drawn from this.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "solganium-z--held": {
    name: "Solganium Z",
    description: "Held by a Solgaleo (or Dusk Mane Necrozma) that knows Sunsteel Strike, unleashes the Z-Move Searing Sunraze Smash.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Lake of the Moone", detail: "After obtaining Cosmog", games: "Ultra Moon" },
        { type: "NPC Gift", place: "Mahalo Trail", detail: "From Lillie after catching Nebby/Solgaleo · After catching Nebby/Solgaleo", games: "Ultra Sun" },
      ] },
    ],
  },
  "lunalium-z--held": {
    name: "Lunalium Z",
    description: "Held by a Lunala (or Dawn Wings Necrozma) that knows Moongeist Beam, unleashes the Z-Move Menacing Moonraze Maelstrom.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Mahalo Trail", detail: "From Lillie after catching Nebby/Lunala · After catching Nebby/Lunala", games: "Ultra Moon" },
        { type: "Overworld", place: "Lake of the Sunne", detail: "After obtaining Cosmog", games: "Ultra Sun" },
      ] },
    ],
  },
  "ultranecrozium-z--held": {
    name: "Ultranecrozium Z",
    description: "Held by a fused Necrozma, lets it become Ultra Necrozma and turn Photon Geyser into Light That Burns the Sky.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Dropped", place: "Mount Lanakila", detail: "Dropped by Necrozma when caught" },
      ] },
    ],
  },
  "mimikium-z--held": {
    name: "Mimikium Z",
    description: "Held by a Mimikyu that knows Play Rough, unleashes the Z-Move Let's Snuggle Forever.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Overworld", place: "Thrifty Megamart (Abandoned Site)", detail: "Available at night after passing Nanu's grand trial · After passing Nanu's grand trial; at night" },
      ] },
    ],
  },
  "lycanium-z--held": {
    name: "Lycanium Z",
    description: "Held by a Lycanroc that knows Stone Edge, unleashes the Z-Move Splintered Stormshards.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Malie City", detail: "From Hau after battling him" },
      ] },
    ],
  },
  "kommonium-z--held": {
    name: "Kommonium Z",
    description: "Held by a Kommo-o that knows Clanging Scales, unleashes the Z-Move Clangorous Soulblaze.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Overworld", place: "Plains Grotto" },
      ] },
    ],
  },
  "solganium-z--bag": {
    name: "Solganium Z",
    description: "The Bag's copy of Solganium Z; a Pokémon's held copy is drawn from this.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "lunalium-z--bag": {
    name: "Lunalium Z",
    description: "The Bag's copy of Lunalium Z; a Pokémon's held copy is drawn from this.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "ultranecrozium-z--bag": {
    name: "Ultranecrozium Z",
    description: "The Bag's copy of Ultranecrozium Z; a Pokémon's held copy is drawn from this.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "mimikium-z--bag": {
    name: "Mimikium Z",
    description: "The Bag's copy of Mimikium Z; a Pokémon's held copy is drawn from this.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "lycanium-z--bag": {
    name: "Lycanium Z",
    description: "The Bag's copy of Lycanium Z; a Pokémon's held copy is drawn from this.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "kommonium-z--bag": {
    name: "Kommonium Z",
    description: "The Bag's copy of Kommonium Z; a Pokémon's held copy is drawn from this.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "z-power-ring": {
    name: "Z-Power Ring",
    description: "The upgraded Z-Ring of Ultra Sun and Ultra Moon; works the same, but fits the newer Z-Crystals too.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Story", place: "Iki Town", detail: "Received from Hala after defeating Hau during the festival" },
      ] },
    ],
  },
  "pink-petal": {
    name: "Pink Petal",
    description: "A pressed pink petal from Mina's trial; one of seven that make a Rainbow Flower.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Story", place: "Seafolk Village", detail: "During Mina's trial, after defeating her" },
      ] },
    ],
  },
  "orange-petal": {
    name: "Orange Petal",
    description: "A pressed orange petal from Mina's trial; one of seven that make a Rainbow Flower.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Defeat", place: "Hau'oli Cemetery", detail: "After defeating Ilima during Mina's trial · During Mina's trial" },
      ] },
    ],
  },
  "blue-petal": {
    name: "Blue Petal",
    description: "A pressed blue petal from Mina's trial; one of seven that make a Rainbow Flower.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Story", place: "Lush Jungle", detail: "During Mina's trial, after defeating Lana", games: "Ultra Moon" },
        { type: "Story", place: "Lush Jungle", detail: "During Mina's trial, after defeating Mallow", games: "Ultra Sun" },
      ] },
    ],
  },
  "red-petal": {
    name: "Red Petal",
    description: "A pressed red petal from Mina's trial; one of seven that make a Rainbow Flower.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Story", place: "Wela Volcano Park", detail: "During Mina's trial, after defeating Kiawe and Hiker David" },
      ] },
    ],
  },
  "green-petal": {
    name: "Green Petal",
    description: "A pressed green petal from Mina's trial; one of seven that make a Rainbow Flower.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Lush Jungle", detail: "During Mina's trial, after defeating Lana · During Mina's trial", games: "Ultra Moon" },
        { type: "NPC Gift", place: "Lush Jungle", detail: "During Mina's trial, after defeating Mallow · During Mina's trial", games: "Ultra Sun" },
      ] },
    ],
  },
  "yellow-petal": {
    name: "Yellow Petal",
    description: "A pressed yellow petal from Mina's trial; one of seven that make a Rainbow Flower.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Hokulani Observatory", detail: "Sophocles (during Mina's trial, after talking to Sophocles) · During Mina's trial", games: "Ultra Moon" },
        { type: "NPC Gift", place: "Hokulani Observatory", detail: "Sophocles (during Mina's trial, after defeating Sophocles) · During Mina's trial", games: "Ultra Sun" },
      ] },
    ],
  },
  "purple-petal": {
    name: "Purple Petal",
    description: "A pressed purple petal from Mina's trial; one of seven that make a Rainbow Flower.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Story", place: "Aether House", detail: "During Mina's trial, after defeating Nanu", games: "Ultra Moon" },
        { type: "Story", place: "Aether House", detail: "During Mina's trial, after talking to Nanu", games: "Ultra Sun" },
      ] },
    ],
  },
  "rainbow-flower": {
    name: "Rainbow Flower",
    description: "All seven petals from the island captains, bound into one flower; it brings on the last part of Mina's trial.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Story", place: "Seafolk Village", detail: "Received from Mina during her trial after collecting all seven petals · During Mina's trial after collecting all seven petals" },
      ] },
    ],
  },
  "surge-badge": {
    name: "Surge Badge",
    description: "A novelty badge from the Kantonian Gym in Malie City, styled after a real Gym Badge.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Trainer Reward", place: "Malie City", detail: "Kantonian Gym Leader · After defeating the Kantonian Gym Leader" },
      ] },
    ],
  },
  "n-solarizer--merge": {
    name: "N-Solarizer",
    description: "Fuses Necrozma with Solgaleo into Dusk Mane Necrozma.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Mount Lanakila", detail: "Colress · After catching Necrozma" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Bargain Shop", place: "Stow-on-Side", detail: "Bargain shop keeper · If the player owns a Necrozma" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Auction", place: "Porto Marinada", detail: "Auction · If the player owns a Necrozma" },
      ] },
    ],
  },
  "n-lunarizer--merge": {
    name: "N-Lunarizer",
    description: "Fuses Necrozma with Lunala into Dawn Wings Necrozma.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Mount Lanakila", detail: "From Colress after catching Necrozma · After catching Necrozma" },
      ] },
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Bargain Shop", place: "Stow-on-Side", detail: "Bargain shop keeper · If the player owns a Necrozma" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Auction", place: "Porto Marinada", detail: "Auction · If the player owns a Necrozma" },
      ] },
    ],
  },
  "n-solarizer--split": {
    name: "N-Solarizer",
    description: "Splits Dusk Mane Necrozma back into Necrozma and Solgaleo.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "n-lunarizer--split": {
    name: "N-Lunarizer",
    description: "Splits Dawn Wings Necrozma back into Necrozma and Lunala.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "ilimas-normalium-z": {
    name: "Ilima Normalium Z",
    description: "Ilima's own Normalium Z, set on the pedestal in Verdant Cavern for trial-goers who clear his trial.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "NPC Gift", place: "Hau'oli City", detail: "Ilima's room · After becoming Champion" },
      ] },
    ],
  },
  "left-poke-ball": {
    name: "Left Poké Ball",
    description: "A Poké Ball holding a Pokémon whose Trainer is gone; it came from Ula'ula Island.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
    where: [
      { vg: "ultra-sun-ultra-moon", games: "Ultra Sun/Ultra Moon", lines: [
        { type: "Overworld", place: "Heahea City", detail: "Aether Office" },
      ] },
    ],
  },
  "roto-hatch": {
    name: "Roto Hatch",
    description: "A Rotom Power: Eggs hatch faster for a while.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "roto-bargain": {
    name: "Roto Bargain",
    description: "A Rotom Power: shop prices are halved for a while.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "roto-prize-money": {
    name: "Roto Prize Money",
    description: "A Rotom Power: prize money from battles is tripled for a while.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "roto-exp-points": {
    name: "Roto Exp. Points",
    description: "A Rotom Power: a little more Exp. Points from every battle for a while.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "roto-friendship": {
    name: "Roto Friendship",
    description: "A Rotom Power: your party grows friendly faster for a while.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "roto-encounter": {
    name: "Roto Encounter",
    description: "A Rotom Power: high-level wild Pokémon show up far more often for a while.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "roto-stealth": {
    name: "Roto Stealth",
    description: "A Rotom Power: no wild Pokémon appear for a while.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "roto-hp-restore": {
    name: "Roto HP Restore",
    description: "A Rotom Power: fully restores the HP of the Pokémon in battle.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "roto-pp-restore": {
    name: "Roto PP Restore",
    description: "A Rotom Power: fully restores the PP of the Pokémon in battle.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "roto-boost": {
    name: "Roto Boost",
    description: "A Rotom Power: raises every stat of the Pokémon in battle.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "roto-catch": {
    name: "Roto Catch",
    description: "A Rotom Power: wild Pokémon are much easier to catch for a while.",
    category: "Unused", pocket: "key",
    gens: [7, 8, 9],
  },
  "sweet-apple": {
    name: "Sweet Apple",
    description: "An apple so sweet that Applin evolves into Appletun when given it.",
    noArt: true,
    category: "Evolution", pocket: "misc",
    gens: [8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 1100, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 2200, sell: 550, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Overworld", place: "Hammerlocke", games: "Shield" },
        { type: "Overworld", place: "Axew’s Eye", detail: "Hidden recurring item", games: "Shield" },
        { type: "Event", place: "Wild Area News", detail: "March 19 to March 25, 2020", games: "Sword" },
      ] },
      { vg: "the-isle-of-armor", games: "The Isle of Armor", lines: [
        { type: "Overworld", place: "Loop Lagoon", detail: "Hidden recurring item" },
        { type: "Overworld", place: "Soothing Wetlands", detail: "Hidden recurring item" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Overworld", place: "Tagtree Thicket" },
        { type: "Shop", place: "Delibird Presents", detail: "₱2200 · After earning 3 Gym Badges" },
      ] },
      { vg: "the-teal-mask", games: "The Teal Mask", lines: [
        { type: "Overworld", place: "Apple Hills" },
      ] },
    ],
  },
  "tart-apple": {
    name: "Tart Apple",
    description: "An apple so tart that Applin evolves into Flapple when given it.",
    noArt: true,
    category: "Evolution", pocket: "misc",
    gens: [8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 1100, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 2200, sell: 550, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Event", place: "Wild Area News", detail: "March 19 to March 25, 2020", games: "Shield" },
        { type: "Overworld", place: "Axew’s Eye", detail: "Hidden recurring item", games: "Sword" },
        { type: "Overworld", place: "Hammerlocke", games: "Sword" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Shop", place: "Delibird Presents", detail: "₱2200 · After earning 3 Gym Badges", games: "Scarlet" },
        { type: "Overworld", place: "Tagtree Thicket", games: "Violet" },
      ] },
    ],
  },
  "tr00": {
    name: "TR00",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 2000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Crafting", place: "Master Dojo", detail: "Cram-o-matic · Only in The Isle of Armor · Normal type recipes totaling 122–130 points" },
        { type: "Shop", place: "Watt Traders", detail: "2000 W" },
        { type: "Raid", place: "4★–5★ Max Raid Battles in the Wild Area and DLC areas", detail: "Available in base game, The Isle of Armor, and The Crown Tundra" },
      ] },
    ],
  },
  "tr01": {
    name: "TR01",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 85 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Exchange", place: "Watt Traders", detail: "3000 W" },
        { type: "Raid", place: "3★–5★ Max Raid Battles" },
        { type: "Crafting", place: "Master Dojo", detail: "Cram-o-matic (Normal: 72–80 points) · Only in The Isle of Armor" },
      ] },
    ],
  },
  "tr02": {
    name: "TR02",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 90 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 5000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Raid", place: "Max Raid Battles" },
        { type: "Exchange", place: "Watt Traders", detail: "5000 W" },
      ] },
    ],
  },
  "tr03": {
    name: "TR03",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 110 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 8000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 8000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Raid", place: "4★–5★ Max Raid Battles" },
        { type: "Shop", place: "Watt Traders", detail: "8000 W" },
      ] },
    ],
  },
  "tr04": {
    name: "TR04",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 90 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 5000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Crafting", place: "Water recipe (22–30 points)", detail: "Only in The Isle of Armor" },
        { type: "Exchange", place: "Watt Traders", detail: "5000 W" },
        { type: "Raid", place: "4★–5★ Max Raid Battles" },
      ] },
    ],
  },
  "tr05": {
    name: "TR05",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 90 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 5000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Overworld", place: "Snowslide Slope", detail: "Only in The Crown Tundra" },
        { type: "Shop", place: "Watt Traders", detail: "5000 W" },
        { type: "Raid", place: "Max Raid Battles" },
        { type: "Crafting", place: "Cram-o-matic (Ice: 102–110 points)", detail: "Only in The Isle of Armor" },
      ] },
    ],
  },
  "tr06": {
    name: "TR06",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 110 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 8000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 8000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Exchange", place: "Watt Traders", detail: "8000 W" },
        { type: "Raid", place: "4★–5★ Max Raid Battles" },
      ] },
    ],
  },
  "tr07": {
    name: "TR07",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Crafting", place: "Master Dojo", detail: "Cram-o-matic · Only in The Isle of Armor · Fighting-type input, 2–20 points" },
        { type: "Shop", place: "Watt Traders", detail: "3000 W" },
        { type: "Raid", place: "2★, 3★, 5★ Max Raid Battles", detail: "Includes Isle of Armor and The Crown Tundra areas" },
      ] },
    ],
  },
  "tr08": {
    name: "TR08",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 90 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 5000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Shop", place: "Watt Traders", detail: "5000 W" },
      ] },
    ],
  },
  "tr09": {
    name: "TR09",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 110 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 8000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 8000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Exchange", place: "Wild Area Watt Traders", detail: "8000 W" },
        { type: "Raid", place: "4★, 5★ Max Raid Battles" },
        { type: "Crafting", place: "Cram-o-matic (Electric: 122–130 points)", detail: "Only in The Isle of Armor", games: "Sword" },
      ] },
    ],
  },
  "tr10": {
    name: "TR10",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 100 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 8000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 8000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Shop", place: "Watt Traders", detail: "8000 W" },
        { type: "Raid", place: "4★, 5★ Max Raid Battles" },
        { type: "Crafting", place: "Cram-o-matic", detail: "Only in The Isle of Armor · Ground recipe: 122-130 points", games: "Sword" },
      ] },
    ],
  },
  "tr11": {
    name: "TR11",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 90 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 5000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Raid", place: "2★, 3★, 5★ Max Raid Battles" },
        { type: "Shop", place: "Watt Traders", detail: "5000 W" },
        { type: "Crafting", place: "Cram-o-matic (Psychic 132–140 points)", detail: "Only in The Isle of Armor" },
      ] },
    ],
  },
  "tr12": {
    name: "TR12",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 2000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Shop", place: "Watt Traders", detail: "2000 W" },
        { type: "Raid", place: "3★–5★ Max Raid Battles" },
        { type: "Crafting", place: "Master Dojo", detail: "Cram-o-matic · Only in The Isle of Armor · Psychic: 2–20 points" },
      ] },
    ],
  },
  "tr13": {
    name: "TR13",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 1000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 1000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Shop", place: "Motostoke", detail: "Wild Area Watt Traders · 1000 W" },
        { type: "Raid", place: "3★–5★ Max Raid Battles" },
      ] },
    ],
  },
  "tr14": {
    name: "TR14",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 1000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 1000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Raid", place: "4★–5★ Max Raid Battles" },
        { type: "Shop", place: "Watt Traders", detail: "1000 W" },
        { type: "Crafting", place: "Master Dojo", detail: "Cram-o-matic (Normal: 22–30 points) · Only in The Isle of Armor" },
      ] },
    ],
  },
  "tr15": {
    name: "TR15",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 110 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 8000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 8000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Raid", place: "Stony Wilderness", detail: "4★, 5★ Max Raid Battles", games: "Shield" },
        { type: "Exchange", place: "Watt Traders", detail: "8000 W" },
        { type: "Raid", place: "Hammerlocke Hills", detail: "4★, 5★ Max Raid Battles", games: "Sword" },
      ] },
    ],
  },
  "tr16": {
    name: "TR16",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Shop", place: "Watt Traders", detail: "3000 W" },
        { type: "Raid", place: "1★, 2★, 5★ Max Raid Battles in listed Wild Area locations and DLC areas" },
        { type: "Crafting", place: "Master Dojo", detail: "Cram-o-matic (Water: 52–60 points) · Only in The Isle of Armor" },
      ] },
    ],
  },
  "tr17": {
    name: "TR17",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 2000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Shop", place: "Wild Area Watt Traders", detail: "2000 W" },
        { type: "Raid", place: "2★–5★ Max Raid Battles" },
        { type: "Crafting", place: "Master Dojo", detail: "Cram-o-matic (Psychic: 92–100 points) · Only in The Isle of Armor" },
      ] },
    ],
  },
  "tr18": {
    name: "TR18",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Raid", place: "Max Raid Battles", detail: "Available in Bridge Field, Dappled Grove, Rolling Fields, South Lake Miloch" },
        { type: "Shop", place: "Watt Traders", detail: "3000 W" },
        { type: "Crafting", place: "Master Dojo", detail: "Cram-o-matic (Bug: 22–30 points) · Only in The Isle of Armor" },
      ] },
    ],
  },
  "tr19": {
    name: "TR19",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 2000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Raid", place: "Max Raid Battles" },
        { type: "Shop", place: "Watt Traders", detail: "2000 W" },
      ] },
      { vg: "the-isle-of-armor", games: "The Isle of Armor", lines: [
        { type: "Crafting", place: "Cram-o-matic (Normal: 82–90 points)" },
      ] },
    ],
  },
  "tr20": {
    name: "TR20",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Raid", place: "Rolling Fields", detail: "4★, 5★ Max Raid Battles", games: "Shield" },
        { type: "Shop", place: "Watt Traders", detail: "3000 W" },
        { type: "Raid", place: "East Lake Axewell", detail: "4★, 5★ Max Raid Battles", games: "Sword" },
        { type: "Crafting", place: "Cram-o-matic (Normal: 112–120 points)", detail: "Only in The Isle of Armor", games: "Sword" },
      ] },
    ],
  },
  "tr21": {
    name: "TR21",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 2000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Shop", place: "Watt Traders", detail: "2000 W" },
        { type: "Raid", place: "2★, 3★, 5★ Max Raid Battles" },
        { type: "Crafting", place: "Challenge Beach", detail: "Cram-o-matic (Fighting: 62–70 points) · Only in The Isle of Armor" },
      ] },
    ],
  },
  "tr22": {
    name: "TR22",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 90 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 5000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Crafting", place: "Master Dojo", detail: "Cram-o-matic (Poison: 102–110 points) · Only in The Isle of Armor" },
        { type: "Shop", place: "Watt Traders", detail: "5000 W" },
        { type: "Raid", place: "3★, 4★, 5★ Max Raid Battles" },
      ] },
    ],
  },
  "tr23": {
    name: "TR23",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 2000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Exchange", place: "Watt Traders", detail: "2000 W" },
        { type: "Raid", place: "3★, 4★, 5★ Max Raid Battles", detail: "Includes Wild Area, Isle of Armor, and Crown Tundra locations" },
        { type: "Crafting", place: "Cram-o-matic (Ground: 22–30 points)", detail: "Only in The Isle of Armor" },
      ] },
    ],
  },
  "tr24": {
    name: "TR24",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 120 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 8000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 8000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Raid", place: "4★–5★ Max Raid Battles" },
        { type: "Shop", place: "Watt Traders", detail: "8000 W" },
        { type: "Crafting", place: "Cram-o-matic (Dragon-type combination)", detail: "Only in The Isle of Armor" },
      ] },
    ],
  },
  "tr25": {
    name: "TR25",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Raid", place: "Max Raid Battles" },
        { type: "Exchange", place: "Wild Area Watt Traders", detail: "3000 W" },
        { type: "Crafting", place: "Cram-o-matic", detail: "Psychic-type points 72–80 · Only in The Isle of Armor", games: "Sword" },
      ] },
    ],
  },
  "tr26": {
    name: "TR26",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 1000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 1000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Raid", place: "3★–5★ Max Raid Battles" },
        { type: "Exchange", place: "Watt Traders", detail: "1000 W" },
      ] },
    ],
  },
  "tr27": {
    name: "TR27",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 2000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Shop", place: "Watt Traders", detail: "2000 W" },
        { type: "Raid", place: "Max Raid Battles" },
      ] },
    ],
  },
  "tr28": {
    name: "TR28",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 120 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 8000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 8000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Raid", place: "4★–5★ Max Raid Battles" },
        { type: "Exchange", place: "Watt Traders", detail: "8000 W" },
      ] },
    ],
  },
  "tr29": {
    name: "TR29",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 2000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Crafting", place: "Master Dojo", detail: "Cram-o-matic (Normal: 92–100 points) · Only in The Isle of Armor" },
        { type: "Exchange", place: "Watt Traders", detail: "2000 W" },
        { type: "Raid", place: "4★–5★ Max Raid Battles" },
      ] },
    ],
  },
  "tr30": {
    name: "TR30",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 2000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Shop", place: "Watt Traders", detail: "2000 W" },
        { type: "Crafting", place: "Cram-o-matic (Normal: 102–110 points)", detail: "Only in The Isle of Armor" },
        { type: "Raid", place: "3★–5★ Max Raid Battles" },
      ] },
    ],
  },
  "tr31": {
    name: "TR31",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 100 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 5000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Crafting", place: "Brawler's Cave", detail: "Cram-o-matic (Steel: 2–20 points) · Only in The Isle of Armor" },
        { type: "Exchange", place: "Watt Traders", detail: "5000 W" },
        { type: "Raid", place: "4★ and 5★ Max Raid Battles" },
      ] },
    ],
  },
  "tr32": {
    name: "TR32",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Exchange", place: "Watt Traders", detail: "3000 W" },
        { type: "Raid", place: "Max Raid Battles" },
      ] },
    ],
  },
  "tr33": {
    name: "TR33",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Raid", place: "Max Raid Battles in the Wild Area, Isle of Armor, and Crown Tundra", detail: "Available from 1★, 2★, 4★, and 5★ raids" },
        { type: "Overworld", place: "Old Cemetery", detail: "Only in The Crown Tundra" },
        { type: "Shop", place: "Watt Traders", detail: "3000 W" },
        { type: "Crafting", place: "Cram-o-matic (Ghost-type recipes)", detail: "Only in The Isle of Armor · Requires 122–130 Ghost points" },
      ] },
    ],
  },
  "tr34": {
    name: "TR34",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 120 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Exchange", place: "Watt Traders", detail: "3000 W" },
        { type: "Raid", place: "4★–5★ Max Raid Battles" },
        { type: "Crafting", place: "Cram-o-matic (Psychic type, 22–30 points)", detail: "Only in The Isle of Armor" },
      ] },
    ],
  },
  "tr35": {
    name: "TR35",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 90 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Crafting", place: "Master Dojo", detail: "Cram-o-matic (Normal: 62–70 points) · Only in The Isle of Armor" },
        { type: "Shop", place: "Watt Traders", detail: "3000 W" },
        { type: "Raid", place: "2★, 3★, and 5★ Max Raid Battles" },
      ] },
    ],
  },
  "tr36": {
    name: "TR36",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 95 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 5000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Exchange", place: "Watt Traders", detail: "5000 W" },
        { type: "Raid", place: "3★–5★ Max Raid Battles", detail: "Includes Giant's Cap, Lake of Outrage, and Stony Wilderness" },
        { type: "Crafting", place: "Cram-o-matic", detail: "Only in The Isle of Armor · Fire-type ingredients totaling 72–80 points" },
      ] },
    ],
  },
  "tr37": {
    name: "TR37",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 2000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Exchange", place: "Watt Traders", detail: "2000 W" },
        { type: "Raid", place: "4★ and 5★ Max Raid Battles" },
        { type: "Crafting", place: "Cram-o-matic", detail: "Only in The Isle of Armor · Dark-type recipe, 2–20 points" },
      ] },
    ],
  },
  "tr38": {
    name: "TR38",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 2000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Raid", place: "3★, 4★, 5★ Max Raid Battles" },
        { type: "Shop", place: "Watt Traders", detail: "2000 W" },
        { type: "Crafting", place: "Challenge Beach", detail: "Cram-o-matic (Psychic: 102–110 points) · Only in The Isle of Armor", games: "Sword" },
      ] },
    ],
  },
  "tr39": {
    name: "TR39",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 120 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 8000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 8000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Exchange", place: "Wild Area and DLC Watt Traders", detail: "8000 W" },
        { type: "Raid", place: "3★–5★ Max Raid Battles in Wild Area and DLC areas" },
        { type: "Crafting", place: "Cram-o-matic (Fighting-type recipe)", detail: "Only in The Isle of Armor · Requires 112–120 Fighting points" },
      ] },
    ],
  },
  "tr40": {
    name: "TR40",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 1000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 1000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Shop", place: "Watt Traders", detail: "1000 W" },
        { type: "Raid", place: "Stony Wilderness", detail: "4★, 5★ Max Raid Battles", games: "Shield" },
        { type: "Crafting", place: "Psychic: 32–40 points", detail: "Only in The Isle of Armor", games: "Sword" },
        { type: "Raid", place: "Motostoke Riverbank", detail: "4★, 5★ Max Raid Battles", games: "Sword" },
      ] },
    ],
  },
  "tr41": {
    name: "TR41",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 85 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Raid", place: "3★, 4★, 5★ Max Raid Battles" },
        { type: "Exchange", place: "Watt Traders", detail: "3000 W" },
      ] },
    ],
  },
  "tr42": {
    name: "TR42",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 90 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 5000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Shop", place: "Watt Traders", detail: "5000 W" },
        { type: "Raid", place: "1★, 2★, 4★, 5★ Max Raid Battles" },
        { type: "Crafting", place: "Cram-o-matic (Normal: 132–140 points)", detail: "Only in The Isle of Armor" },
      ] },
    ],
  },
  "tr43": {
    name: "TR43",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 130 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 8000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 8000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Shop", place: "Watt Traders", detail: "8000 W" },
        { type: "Raid", place: "4★, 5★ Max Raid Battles" },
      ] },
    ],
  },
  "tr44": {
    name: "TR44",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 2000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Raid", place: "3★–5★ Max Raid Battles" },
        { type: "Shop", place: "Watt Traders", detail: "2000 W" },
      ] },
    ],
  },
  "tr45": {
    name: "TR45",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 90 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 5000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Raid", place: "3★ and 5★ Max Raid Battles" },
        { type: "Shop", place: "Watt Traders", detail: "5000 W" },
      ] },
    ],
  },
  "tr46": {
    name: "TR46",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 2000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Crafting", place: "Master Dojo", detail: "Cram-o-matic (Steel-type points) · Only in The Isle of Armor" },
        { type: "Shop", place: "Watt Traders", detail: "2000 W" },
        { type: "Raid", place: "4★–5★ Max Raid Battles" },
      ] },
    ],
  },
  "tr47": {
    name: "TR47",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Shop", place: "Watt Traders", detail: "3000 W" },
        { type: "Raid", place: "Max Raid Battles" },
      ] },
    ],
  },
  "tr48": {
    name: "TR48",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 2000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Shop", place: "Watt Traders", detail: "2000 W" },
        { type: "Raid", place: "3★, 4★, 5★ Max Raid Battles" },
        { type: "Crafting", place: "Master Dojo", detail: "Cram-o-matic (Fighting-type output, 52–60 points) · Only in The Isle of Armor" },
      ] },
    ],
  },
  "tr49": {
    name: "TR49",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 2000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Shop", place: "Watt Traders", detail: "2000 W" },
        { type: "Raid", place: "3★–5★ Max Raid Battles" },
      ] },
      { vg: "the-isle-of-armor", games: "The Isle of Armor", lines: [
        { type: "Crafting", place: "Training Lowlands", detail: "Cram-o-matic (Psychic: 112–120 points)" },
      ] },
      { vg: "the-crown-tundra", games: "The Crown Tundra", lines: [
        { type: "Shop", place: "Snowslide Slope", detail: "Watt Trader · 2000 W" },
      ] },
    ],
  },
  "tr50": {
    name: "TR50",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 90 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 5000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Crafting", place: "Master Dojo", detail: "Cram-o-matic (Grass: 62–70 points) · Only in The Isle of Armor" },
        { type: "Shop", place: "Watt Traders", detail: "5000 W" },
        { type: "Raid", place: "3★–5★ Max Raid Battles" },
      ] },
    ],
  },
  "tr51": {
    name: "TR51",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 2000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Crafting", place: "Cram-o-matic (Dragon: 112–120 points)", detail: "Only in The Isle of Armor" },
        { type: "Exchange", place: "Wild Area Watt Traders", detail: "2000 W" },
        { type: "Raid", place: "3★, 4★, 5★ Max Raid Battles" },
      ] },
    ],
  },
  "tr52": {
    name: "TR52",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Shop", place: "Watt Traders", detail: "3000 W" },
        { type: "Raid", place: "3★–5★ Max Raid Battles", detail: "Available in various Wild Area locations and DLC areas" },
      ] },
      { vg: "the-isle-of-armor", games: "The Isle of Armor", lines: [
        { type: "Crafting", place: "Cram-o-matic", detail: "Steel-type input totaling 72–80 points" },
      ] },
      { vg: "the-crown-tundra", games: "The Crown Tundra", lines: [
        { type: "Shop", place: "Snowslide Slope", detail: "Watt Trader · 3000 W" },
      ] },
    ],
  },
  "tr53": {
    name: "TR53",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 120 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 8000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 8000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Shop", place: "Wild Area Watt Traders", detail: "8000 W" },
        { type: "Raid", place: "4★ and 5★ Max Raid Battles" },
        { type: "Crafting", place: "Cram-o-matic (Fighting: 122–130 points)", detail: "Only in The Isle of Armor" },
      ] },
    ],
  },
  "tr54": {
    name: "TR54",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 2000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Shop", place: "Wild Area Watt Traders", detail: "2000 W" },
        { type: "Raid", place: "Max Raid Battles in the Wild Area" },
        { type: "Crafting", place: "Cram-o-matic (Poison type, 52–60 points)", detail: "Only in The Isle of Armor", games: "Sword" },
      ] },
    ],
  },
  "tr55": {
    name: "TR55",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 120 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 8000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 8000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Exchange", place: "Watt Traders", detail: "8000 W" },
        { type: "Raid", place: "4★–5★ Max Raid Battles", detail: "Available in specific Wild Area locations and expansion areas" },
        { type: "Crafting", place: "Cram-o-matic", detail: "Only in The Isle of Armor · Fire-type combination totaling 112–120 points", games: "Sword" },
      ] },
    ],
  },
  "tr56": {
    name: "TR56",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Raid", place: "Max Raid Battles" },
        { type: "Shop", place: "Watt Traders", detail: "3000 W" },
        { type: "Crafting", place: "Cram-o-matic (Fighting: 22–30 points)", detail: "Only in The Isle of Armor" },
      ] },
    ],
  },
  "tr57": {
    name: "TR57",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Exchange", place: "Watt Traders", detail: "3000 W" },
        { type: "Raid", place: "Max Raid Battles" },
        { type: "Crafting", place: "Cram-o-matic (Poison: 72–80 points)", detail: "Only in The Isle of Armor" },
      ] },
    ],
  },
  "tr58": {
    name: "TR58",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Shop", place: "Watt Traders", detail: "3000 W" },
        { type: "Raid", place: "3★, 4★, 5★ Max Raid Battles", detail: "Some locations exclusive to Shield", games: "Shield" },
        { type: "Raid", place: "3★, 4★, 5★ Max Raid Battles", games: "Sword" },
      ] },
    ],
  },
  "tr59": {
    name: "TR59",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Raid", place: "Giant's Mirror", detail: "Max Raid Battles", games: "Shield" },
        { type: "Exchange", place: "Watt Traders", detail: "3000 W" },
        { type: "Raid", place: "Dappled Grove", detail: "Max Raid Battles", games: "Sword" },
      ] },
    ],
  },
  "tr60": {
    name: "TR60",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Crafting", place: "Cram-o-matic (Bug: 2–20 points)", detail: "Only in The Isle of Armor" },
        { type: "Raid", place: "Max Raid Battles" },
        { type: "Shop", place: "Watt Traders", detail: "3000 W" },
      ] },
    ],
  },
  "tr61": {
    name: "TR61",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 90 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 5000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Exchange", place: "Watt Trader", detail: "5000 W" },
        { type: "Raid", place: "3★–5★ Max Raid Battles" },
        { type: "Crafting", place: "Cram-o-matic (Bug: 72–80 points)", detail: "Only in The Isle of Armor" },
      ] },
    ],
  },
  "tr62": {
    name: "TR62",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 85 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Raid", place: "Rolling Fields", detail: "Max Raid Battles · Shield only locations apply", games: "Shield" },
        { type: "Exchange", place: "Watt Traders", detail: "3000 W" },
        { type: "Exchange", place: "Snowslide Slope", detail: "Watt Trader · 3000 W · Only in The Crown Tundra", games: "Shield" },
        { type: "Raid", place: "Axew’s Eye", detail: "Max Raid Battles", games: "Sword" },
        { type: "Crafting", place: "Cram-o-matic (Dragon: 92–100)", detail: "Only in The Isle of Armor", games: "Sword" },
      ] },
    ],
  },
  "tr63": {
    name: "TR63",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 3000, cur: "poke-dollar" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: null, cur: "watt" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Crafting", place: "Cram-o-matic (Rock: 82–90 points)", detail: "Only in The Isle of Armor" },
        { type: "Exchange", place: "Watt Traders", detail: "3000 W" },
      ] },
    ],
  },
  "tr64": {
    name: "TR64",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 120 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 8000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 8000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Shop", place: "Watt Traders", detail: "8000 W" },
        { type: "Raid", place: "4★–5★ Max Raid Battles" },
        { type: "Crafting", place: "Master Dojo", detail: "Cram-o-matic (Fighting-type, 102–110 points) · Only in The Isle of Armor" },
      ] },
    ],
  },
  "tr65": {
    name: "TR65",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 90 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 5000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Shop", place: "Watt Traders", detail: "5000 W" },
        { type: "Raid", place: "Bridge Field", detail: "Max Raid Battles" },
        { type: "Crafting", place: "Cram-o-matic (Grass: 72–80)", detail: "Only in The Isle of Armor" },
      ] },
    ],
  },
  "tr66": {
    name: "TR66",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 120 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 8000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 8000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Raid", place: "3★–5★ Max Raid Battles" },
        { type: "Crafting", place: "Cram-o-matic (Flying: 122–130 points)", detail: "Only in The Isle of Armor" },
        { type: "Shop", place: "Watt Traders", detail: "8000 W" },
      ] },
    ],
  },
  "tr67": {
    name: "TR67",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 90 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 5000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Exchange", place: "Watt Traders", detail: "5000 W" },
        { type: "Raid", place: "2★, 3★, 5★ Max Raid Battles (Dusty Bowl, Giant's Seat, Rolling Fields)" },
      ] },
      { vg: "the-isle-of-armor", games: "The Isle of Armor", lines: [
        { type: "Crafting", place: "Ground-type recipe (72–80 points)" },
      ] },
      { vg: "the-crown-tundra", games: "The Crown Tundra", lines: [
        { type: "Exchange", place: "Snowslide Slope", detail: "Watt Trader · 5000 W" },
      ] },
    ],
  },
  "tr68": {
    name: "TR68",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 2000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Exchange", place: "Watt Traders", detail: "2000 W" },
      ] },
    ],
  },
  "tr69": {
    name: "TR69",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Raid", place: "1★, 2★, 4★, 5★ Max Raid Battles", detail: "Bridge Field, Motostoke Riverbank, Stony Wilderness, Watchtower Ruins; DLC areas apply if owned" },
        { type: "Shop", place: "Wild Area Watt Traders", detail: "3000 W" },
        { type: "Crafting", place: "Cram-o-matic", detail: "Only in The Isle of Armor · Psychic-type combination: 82–90 points" },
      ] },
    ],
  },
  "tr70": {
    name: "TR70",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 5000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Raid", place: "Dusty Bowl, Giant's Seat, Hammerlocke Hills, Stony Wilderness" },
        { type: "Crafting", place: "Cram-o-matic (Steel: 112–120 points)", detail: "Only in The Isle of Armor" },
        { type: "Shop", place: "Watt Traders", detail: "5000 W" },
      ] },
    ],
  },
  "tr71": {
    name: "TR71",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 130 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 8000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 8000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Raid", place: "4★, 5★ Max Raid Battles", detail: "Includes Bridge Field, Dappled Grove, Giant's Mirror, Stony Wilderness; Isle of Armor and Crown Tundra locations also apply." },
        { type: "Shop", place: "Watt Traders", detail: "8000 W" },
        { type: "Crafting", place: "Master Dojo", detail: "Cram-o-matic (Grass: 122–130 points) · Only in The Isle of Armor" },
      ] },
    ],
  },
  "tr72": {
    name: "TR72",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 120 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 8000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 8000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Shop", place: "Watt Traders", detail: "8000 W" },
        { type: "Raid", place: "4★–5★ Max Raid Battles" },
      ] },
      { vg: "the-isle-of-armor", games: "The Isle of Armor", lines: [
        { type: "Crafting", place: "Cram-o-matic (Grass: 102–110)", detail: "Only in The Isle of Armor" },
      ] },
    ],
  },
  "tr73": {
    name: "TR73",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 120 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 8000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 8000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Raid", place: "4★–5★ Max Raid Battles" },
        { type: "Shop", place: "Watt Traders", detail: "8000 W" },
        { type: "Crafting", place: "Cram-o-matic (Poison: 122–130 points)", detail: "The Isle of Armor" },
      ] },
    ],
  },
  "tr74": {
    name: "TR74",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 5000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Exchange", place: "Watt Traders", detail: "5000 W" },
        { type: "Raid", place: "3★–5★ Max Raid Battles (various Wild Area, Isle of Armor, and Crown Tundra locations)" },
        { type: "Crafting", place: "Cram-o-matic (Steel type, 122–130 points)", detail: "Only in The Isle of Armor" },
      ] },
    ],
  },
  "tr75": {
    name: "TR75",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 100 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 8000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 8000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Shop", place: "Watt Traders", detail: "8000 W" },
        { type: "Raid", place: "4★, 5★ Max Raid Battles", detail: "Includes Dusty Bowl, Giant's Seat, and Rolling Fields" },
        { type: "Crafting", place: "Master Dojo", detail: "Cram-o-matic (Rock: 122–130 points) · Only in The Isle of Armor" },
      ] },
    ],
  },
  "tr76": {
    name: "TR76",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Raid", place: "3★–5★ Max Raid Battles" },
        { type: "Shop", place: "Wild Area Watt Traders", detail: "3000 W" },
      ] },
    ],
  },
  "tr77": {
    name: "TR77",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Raid", place: "3★–5★ Max Raid Battles" },
        { type: "Shop", place: "Watt Traders", detail: "3000 W" },
        { type: "Crafting", place: "Cram-o-matic (Grass: 52–60 points)", detail: "The Isle of Armor" },
      ] },
    ],
  },
  "tr78": {
    name: "TR78",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 95 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 5000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Crafting", place: "Cram-o-matic (Poison: 112–120 points)", detail: "Only in The Isle of Armor" },
        { type: "Raid", place: "3★, 4★, 5★ Max Raid Battles" },
        { type: "Shop", place: "Watt Traders", detail: "5000 W" },
      ] },
    ],
  },
  "tr79": {
    name: "TR79",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Raid", place: "Max Raid Battles (Dusty Bowl, Giant's Seat, Hammerlocke Hills, Stony Wilderness)" },
        { type: "Shop", place: "Watt Traders", detail: "3000 W" },
        { type: "Crafting", place: "Cram-o-matic", detail: "Only in The Isle of Armor · Steel type input totaling 92–100 points" },
      ] },
    ],
  },
  "tr80": {
    name: "TR80",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Exchange", place: "Watt Traders", detail: "3000 W" },
        { type: "Raid", place: "3★–5★ Max Raid Battles" },
      ] },
    ],
  },
  "tr81": {
    name: "TR81",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 95 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Shop", place: "Watt Traders", detail: "3000 W" },
        { type: "Raid", place: "4★ and 5★ Max Raid Battles" },
      ] },
    ],
  },
  "tr82": {
    name: "TR82",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 20 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 2000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Crafting", place: "Cram-o-matic (Psychic: 42–50 points)", detail: "Only in The Isle of Armor" },
        { type: "Shop", place: "Watt Traders", detail: "2000 W" },
        { type: "Raid", place: "4★ and 5★ Max Raid Battles" },
      ] },
    ],
  },
  "tr83": {
    name: "TR83",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 2000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Raid", place: "2★, 3★, 5★ Max Raid Battles" },
        { type: "Crafting", place: "Master Dojo", detail: "Cram-o-matic · Psychic-type input totaling 62–70 points · The Isle of Armor" },
        { type: "Shop", place: "Watt Traders", detail: "2000 W" },
      ] },
    ],
  },
  "tr84": {
    name: "TR84",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Raid", place: "2★–4★ Max Raid Battles" },
        { type: "Exchange", place: "Watt Traders", detail: "3000 W" },
      ] },
    ],
  },
  "tr85": {
    name: "TR85",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 1000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 1000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Shop", place: "Watt Traders", detail: "1000 W" },
        { type: "Raid", place: "3★, 4★, 5★ Max Raid Battles" },
        { type: "Crafting", place: "Cram-o-matic (Normal: 2–20 points)", detail: "Only in The Isle of Armor" },
      ] },
    ],
  },
  "tr86": {
    name: "TR86",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 90 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 5000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Crafting", place: "Cram-o-matic (Electric: 62–70 points)", detail: "Only in The Isle of Armor" },
        { type: "Shop", place: "Watt Traders", detail: "5000 W" },
        { type: "Raid", place: "Giant's Cap", detail: "Max Raid Battles" },
      ] },
    ],
  },
  "tr87": {
    name: "TR87",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Shop", place: "Watt Traders", detail: "3000 W" },
        { type: "Raid", place: "1★, 2★, 4★, 5★ Max Raid Battles" },
      ] },
    ],
  },
  "tr88": {
    name: "TR88",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Exchange", place: "Watt Traders", detail: "3000 W" },
        { type: "Raid", place: "Max Raid Battles" },
      ] },
    ],
  },
  "tr89": {
    name: "TR89",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 110 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 8000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 8000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Crafting", place: "Cram-o-matic (Flying: 102–110 points)", detail: "The Isle of Armor" },
        { type: "Exchange", place: "Watt Trader", detail: "8000 W" },
        { type: "Raid", place: "4★–5★ Max Raid Battles" },
      ] },
    ],
  },
  "tr90": {
    name: "TR90",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 90 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 5000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Raid", place: "Various Max Raid Battle dens" },
        { type: "Exchange", place: "Watt Traders", detail: "5000 W" },
        { type: "Crafting", place: "Cram-o-matic (Fairy-type recipes)", detail: "Only in The Isle of Armor" },
      ] },
    ],
  },
  "tr91": {
    name: "TR91",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 10 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 2000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 2000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Raid", place: "4★–5★ Max Raid Battles" },
        { type: "Shop", place: "Watt Traders", detail: "2000 W" },
        { type: "Crafting", place: "Cram-o-matic (Poison: 32–40 points)", detail: "Only in The Isle of Armor" },
      ] },
    ],
  },
  "tr92": {
    name: "TR92",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Raid", place: "Max Raid Battles" },
        { type: "Shop", place: "Watt Traders", detail: "3000 W" },
        { type: "Crafting", place: "Cram-o-matic (Fairy: 102–110 points)", detail: "The Isle of Armor", games: "Sword" },
      ] },
    ],
  },
  "tr93": {
    name: "TR93",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 85 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 5000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Exchange", place: "Wild Area Watt Traders; Snowslide Slope Watt Trader (The Crown Tundra)", detail: "5000 W" },
        { type: "Raid", place: "2★, 3★, 5★ Max Raid Battles in various Wild Area locations and expansions" },
        { type: "Crafting", place: "Cram-o-matic (Dark: 122–130 points) in The Isle of Armor", detail: "Only in The Isle of Armor" },
      ] },
    ],
  },
  "tr94": {
    name: "TR94",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 95 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 5000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Shop", place: "Watt Traders", detail: "5000 W" },
        { type: "Raid", place: "2★, 3★, 5★ Max Raid Battles" },
        { type: "Crafting", place: "Master Dojo", detail: "Cram-o-matic (Ground: 102–110 points) · Only in The Isle of Armor" },
      ] },
    ],
  },
  "tr95": {
    name: "TR95",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Exchange", place: "Watt Traders", detail: "3000 W" },
        { type: "Raid", place: "1★, 2★, 4★, 5★ Max Raid Battles" },
      ] },
    ],
  },
  "tr96": {
    name: "TR96",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 90 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 5000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Exchange", place: "Wild Area Watt Traders", detail: "5000 W" },
        { type: "Raid", place: "3★–5★ Max Raid Battles" },
        { type: "Crafting", place: "Cram-o-matic", detail: "Bug-type input totaling 102–110 points · Only in The Isle of Armor", games: "Sword" },
      ] },
    ],
  },
  "tr97": {
    name: "TR97",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 85 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 5000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Shop", place: "Watt Traders", detail: "5000 W" },
        { type: "Raid", place: "Motostoke Riverbank", detail: "2★, 3★, 5★ Max Raid Battles" },
      ] },
    ],
  },
  "tr98": {
    name: "TR98",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 85 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Raid", place: "3★, 4★ Max Raid Battles" },
        { type: "Shop", place: "Watt Traders", detail: "3000 W" },
        { type: "Crafting", place: "Challenge Beach", detail: "Cram-o-matic (Water: 62–70 points) · Only in The Isle of Armor" },
      ] },
    ],
  },
  "tr99": {
    name: "TR99",
    description: "A single-use Galar disc that teaches a compatible Pokémon one move, then breaks.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: null, cur: "watt" },
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Shop", place: "Watt Traders", detail: "3000 W" },
        { type: "Raid", place: "Max Raid Battles", detail: "1★, 2★, 4★, 5★ raids" },
        { type: "Crafting", place: "Cram-o-matic", detail: "The Isle of Armor · Fighting type, 82–90 points", games: "Sword" },
      ] },
    ],
  },
  "tm00": {
    name: "TM00",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [8, 9],
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 10000, sell: null, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 2500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Shop", place: "Hammerlocke", detail: "East Pokémon Center · ₱10000" },
      ] },
    ],
  },
  "cracked-pot": {
    name: "Cracked Pot",
    description: "A chipped teapot with an odd presence; Sinistea evolves into Polteageist when given it.",
    noArt: true,
    category: "Evolution", pocket: "misc",
    gens: [8, 9],
    fling: { power: 80 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: 3000, sell: 800, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 400, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Bargain Shop", place: "Stow-on-Side", detail: "Bargain shop" },
        { type: "Story", place: "Stow-on-Side", detail: "Event", games: "Sword" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Overworld", place: "Socarrat Trail", detail: "South Province (Area Two)", games: "Scarlet" },
        { type: "Auction", place: "Porto Marinada", detail: "Auction house", games: "Violet" },
      ] },
    ],
  },
  "galarica-cuff": {
    name: "Galarica Cuff",
    description: "A bracelet woven from Galarica twigs; Galarian Slowpoke evolves into Galarian Slowbro when given it.",
    noArt: true,
    category: "Collectibles", pocket: "misc",
    gens: [8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["scarlet-violet", "legends-za"], games: "Scarlet/Violet, Legends: Z-A", buy: null, sell: 750, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Exchange", place: "Workout Sea", detail: "Woman on a small island · ₱8 · Exchange eight Galarica Twigs · The Isle of Armor" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Exchange", place: "Coastal Plaza", detail: "Girl near the vending machines · ₱8 · Exchange eight Galarica Twigs · The Indigo Disk" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Story", place: "Vert Sector 9", detail: "Side Mission 75: Some Unusual Pokémon · Complete Side Mission 75" },
        { type: "Dropped", place: "Floating Poké Ball in Hyperspace Zones", detail: "2★ or higher Hyperspace Zones with Item Power: Special" },
      ] },
    ],
  },
  "galarica-wreath": {
    name: "Galarica Wreath",
    description: "A wreath woven from Galarica twigs; Galarian Slowpoke evolves into Galarian Slowking when given it.",
    noArt: true,
    category: "Collectibles", pocket: "misc",
    gens: [8, 9],
    fling: { power: 30 },
    prices: [
      { vg: ["sword-shield"], games: "Sword/Shield", buy: null, sell: 1500, cur: "poke-dollar" },
      { vg: ["legends-za"], games: "Legends: Z-A", buy: null, sell: 750, cur: "poke-dollar" },
    ],
    where: [
      { vg: "sword-shield", games: "Sword/Shield", lines: [
        { type: "Event", place: "Crown Tournament distribution" },
        { type: "Exchange", place: "Roaring Sea Caves", detail: "Woman in the cavern · ₱15 · The Crown Tundra · Exchange for Galarica Twigs" },
      ] },
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Exchange", place: "Coastal Plaza", detail: "Girl near the vending machines · ₱15 · The Indigo Disk · Exchange for Galarica Twigs" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Request", place: "Vert Sector 9", detail: "Side Mission 75: Some Unusual Pokémon · Complete Side Mission 75" },
      ] },
    ],
  },
  "scroll-of-darkness": {
    name: "Scroll of Darkness",
    description: "A scroll of shadowy secrets; Kubfu masters it to become Single Strike Style Urshifu.",
    noArt: true,
    category: "Gameplay", pocket: "key",
    gens: [9],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Auction", place: "Porto Marinada", detail: "Porto Marinada auction · If the player owns a Kubfu" },
      ] },
    ],
  },
  "malicious-armor": {
    name: "Malicious Armor",
    description: "Armour bound with the malice of its maker; Charcadet evolves into Ceruledge when given it.",
    noArt: true,
    category: "Evolution", pocket: "misc",
    gens: [9],
    fling: { power: 30 },
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 1500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Exchange", place: "Trade", games: "Scarlet" },
        { type: "Exchange", place: "Zapapico", detail: "Woman next to the fountain near the eastern Pokémon Center (exchange for ten Sinistea Chips) · ₱10", games: "Violet" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Story", place: "Given by Adver in Side Mission 132: \"Bitter Blue Flames vs. Blazing Crimson\"", detail: "If chosen over Auspicious Armor" },
        { type: "Dropped", place: "Destroy Floating Poké Ball in 5 Star Hyperspace Zones with Item Power: Special" },
      ] },
    ],
  },
  "tm101": {
    name: "TM101",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 8000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 8000, cur: "poke-dollar" },
    ],
  },
  "tm102": {
    name: "TM102",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 5000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Trainer Reward", place: "Prize for defeating Atticus, TM Machine" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Achievement", place: "Reward for attaining research level 44", detail: "After attaining research level 44" },
      ] },
    ],
  },
  "tm103": {
    name: "TM103",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Shop", place: "Blueberry Academy", detail: "Blueberry Academy Store · 25 BP · Only in The Indigo Disk" },
        { type: "Crafting", place: "TM Machine", detail: "5000 LP · Requires Mimikyu Scrap x3, Azurill Fur x3, Falinks Sweat x3" },
      ] },
    ],
  },
  "tm104": {
    name: "TM104",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 10, sell: null, cur: "battle-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 1500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "TM Machine", detail: "1500 LP · Requires Bronzor Fragment ×3 and Pineco Husk ×3" },
        { type: "Exchange", place: "Blueberry Academy", detail: "Blueberry Academy Store · 10 BP · Only in The Indigo Disk" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "NPC Defeat", place: "Grisham", detail: "Prize for defeating Grisham" },
      ] },
    ],
  },
  "tm105": {
    name: "TM105",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Mesagoza, Dalizapa Passage, Socarrat Trail, East Province (Area One), West Province (Area Three); Kitakami Road in The Teal Mask", detail: "5000 LP · Requires crafting materials: Fomantis Leaf ×3, Tarountula Thread ×3, Kricketot Shell ×3" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Achievement", detail: "Reward for attaining research level 42" },
      ] },
    ],
  },
  "tm106": {
    name: "TM106",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 8000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "TM Machine", detail: "8000 LP · Requires Pineco Husk ×5, Dunsparce Scales ×3, and Arrokuda Scales ×3" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Achievement", detail: "Reward for attaining research level 33" },
      ] },
    ],
  },
  "tm107": {
    name: "TM107",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 3000, cur: "poke-dollar" },
      { vg: ["the-indigo-disk"], games: "The Indigo Disk", buy: 15, sell: null, cur: "battle-point" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "TM Machine", detail: "3000 LP · Requires Salandit Gas ×3 and Shuppet Scrap ×3" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Achievement", place: "Reward for attaining research level 37", detail: "After reaching research level 37" },
      ] },
    ],
  },
  "tm108": {
    name: "TM108",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 8000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 8000, sell: null, cur: "league-point" },
      { vg: ["the-indigo-disk"], games: "The Indigo Disk", buy: 40, sell: null, cur: "battle-point" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Shop", place: "TM Machine", detail: "8000 LP · Requires Maschiff Fang ×5, Bruxish Tooth ×3, Yungoos Fur ×3" },
        { type: "Shop", place: "Blueberry Academy Store, Polar Biome", detail: "40 BP · Only in The Indigo Disk" },
      ] },
    ],
  },
  "tm109": {
    name: "TM109",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 5000, cur: "poke-dollar" },
      { vg: ["the-indigo-disk"], games: "The Indigo Disk", buy: 25, sell: null, cur: "battle-point" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Medali", detail: "TM Machine · 5000 LP · Requires Shuppet Scrap ×3, Sableye Gem ×3, Sinistea Chip ×3" },
      ] },
      { vg: "the-teal-mask", games: "The Teal Mask", lines: [
        { type: "Crafting", place: "Kitakami Road", detail: "TM Machine · 5000 LP · Requires Shuppet Scrap ×3, Sableye Gem ×3, Sinistea Chip ×3" },
      ] },
      { vg: "the-indigo-disk", games: "The Indigo Disk", lines: [
        { type: "Shop", place: "Blueberry Academy", detail: "Blueberry Academy Store · 25 BP" },
      ] },
    ],
  },
  "tm110": {
    name: "TM110",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 10000, cur: "poke-dollar" },
      { vg: ["the-indigo-disk"], games: "The Indigo Disk", buy: 50, sell: null, cur: "battle-point" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Exchange", place: "Blueberry Academy", detail: "Blueberry Academy Store · 50 BP · Only in The Indigo Disk" },
        { type: "Crafting", place: "TM Machine", detail: "10000 LP · Requires Arrokuda Scales ×5, Wiglett Sand ×3, Buizel Fur ×3" },
      ] },
    ],
  },
  "tm111": {
    name: "TM111",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 8000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "TM Machine", detail: "8000 LP · Requires Capsakid Seed ×5, Hoppip Leaf ×3, Skiddo Leaf ×3" },
        { type: "Overworld", place: "Area Zero" },
        { type: "Shop", place: "Blueberry Academy", detail: "Blueberry Academy Store · 40 BP · Only in The Indigo Disk" },
      ] },
    ],
  },
  "tm112": {
    name: "TM112",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 8000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 8000, cur: "poke-dollar" },
      { vg: ["the-indigo-disk"], games: "The Indigo Disk", buy: 40, sell: null, cur: "battle-point" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Exchange", place: "Blueberry Academy", detail: "Blueberry Academy Store · 40 BP · Only in The Indigo Disk" },
        { type: "Crafting", place: "TM Machine", detail: "8000 LP · Requires Ralts Dust ×5, Riolu Fur ×3, Charcadet Soot ×3" },
      ] },
    ],
  },
  "tm113": {
    name: "TM113",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Exchange", place: "Blueberry Academy Store", detail: "25 BP · Only in The Indigo Disk" },
        { type: "Crafting", place: "TM Machine", detail: "5000 LP · Requires Rufflet Feather ×3, Rookidee Feather ×3, Bombirdier Feather ×3" },
      ] },
    ],
  },
  "tm114": {
    name: "TM114",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 8000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 8000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Area Zero", detail: "TM Machine; prize for defeating Ryme · 8000 LP · After defeating Ryme · Requires Gastly Gas ×5, Sandygast Sand ×3, Sinistea Chip ×3" },
      ] },
    ],
  },
  "tm115": {
    name: "TM115",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 8000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "TM Machine", detail: "8000 LP · Requires Goomy Goo ×5, Swablu Fluff ×3, Tatsugiri Scales ×3" },
        { type: "Exchange", place: "Blueberry Academy (Store)", detail: "Canyon Biome · 40 BP · Only in The Indigo Disk" },
      ] },
    ],
  },
  "tm116": {
    name: "TM116",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 5000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Story", place: "After School Pokémon Research Club" },
        { type: "Crafting", place: "TM Machine", detail: "5000 LP · Requires Rolycoly Coal ×3 and Rockruff Rock ×3" },
        { type: "Overworld", place: "South Province Area Two" },
      ] },
    ],
  },
  "tm117": {
    name: "TM117",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 8000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 40, sell: null, cur: "battle-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 8000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "South Province Area Six", detail: "TM Machine · 8000 LP · Requires Litleo Tuft ×5, Tandemaus Fur ×3, Skwovet Fur ×3" },
        { type: "Shop", place: "Blueberry Academy", detail: "Blueberry Academy Store, Canyon Biome · 40 BP · Only in The Indigo Disk" },
      ] },
    ],
  },
  "tm118": {
    name: "TM118",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 10000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 10000, cur: "poke-dollar" },
      { vg: ["the-indigo-disk"], games: "The Indigo Disk", buy: 50, sell: null, cur: "battle-point" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Shop", place: "Blueberry Academy", detail: "Blueberry Academy Store, Savanna Plaza · 50 BP · Only in The Indigo Disk" },
        { type: "Crafting", place: "Asado Desert", detail: "TM Machine · 10000 LP · Requires materials: Growlithe Fur ×5, Torkoal Coal ×3, Larvesta Fuzz ×3." },
      ] },
    ],
  },
  "tm119": {
    name: "TM119",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 10000, cur: "poke-dollar" },
      { vg: ["the-indigo-disk"], games: "The Indigo Disk", buy: 50, sell: null, cur: "battle-point" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "TM Machine", detail: "10000 LP · Requires Deerling Hair ×5, Applin Juice ×3, Bramblin Twig ×3" },
        { type: "Shop", place: "Blueberry Academy", detail: "Blueberry Academy Store, Canyon Biome · 50 BP · Only in The Indigo Disk" },
      ] },
    ],
  },
  "tm120": {
    name: "TM120",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 10000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Trainer Reward", place: "Prize for defeating Tulip" },
        { type: "Crafting", place: "TM Machine", detail: "10000 LP · Requires Rellor Mud ×5, Indeedee Fur ×3, Ralts Dust ×3" },
      ] },
    ],
  },
  "tm121": {
    name: "TM121",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 5000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "TM Machine", detail: "5000 LP · Requires Cufant Tarnish ×3, Bronzor Fragment ×3, Dondozo Whisker ×3" },
      ] },
    ],
  },
  "tm122": {
    name: "TM122",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "TM Machine locations including Levincia, Casseroya Lake, Segin Squad's Base, North Province (Area Three), South Province (Area Four); Infernal Pass in The Teal Mask", detail: "3000 LP · Requires materials: Hawlucha Down ×3 and Slakoth Fur ×3" },
      ] },
    ],
  },
  "tm123": {
    name: "TM123",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 10000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 8000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Levincia", detail: "TM Machine · 10000 LP · Also available in Kitakami Wilds during The Teal Mask" },
      ] },
    ],
  },
  "tm124": {
    name: "TM124",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 10000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Trainer Reward", place: "Prize for defeating Grusha" },
        { type: "Crafting", place: "TM Machine", detail: "8000 LP · Requires Cetoddle Grease ×5, Bergmite Ice ×3, Frigibax Scales ×3" },
        { type: "Shop", place: "Blueberry Academy Store", detail: "50 BP · Only in The Indigo Disk" },
      ] },
    ],
  },
  "tm125": {
    name: "TM125",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 10000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "TM Machine", detail: "10000 LP · Requires Litleo Tuft ×5, Houndour Fang ×3, Numel Lava ×3" },
        { type: "Exchange", place: "Blueberry Academy (Store)", detail: "Coastal Biome · 50 BP · Only in The Indigo Disk" },
      ] },
    ],
  },
  "tm126": {
    name: "TM126",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 10000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 10000, cur: "poke-dollar" },
      { vg: ["the-indigo-disk"], games: "The Indigo Disk", buy: 50, sell: null, cur: "battle-point" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "TM Machine", detail: "10000 LP · Requires materials" },
      ] },
    ],
  },
  "tm127": {
    name: "TM127",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 10000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 50, sell: null, cur: "battle-point" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Exchange", place: "Blueberry Academy", detail: "Blueberry Academy Store · 50 BP · Only in The Indigo Disk" },
        { type: "Crafting", place: "TM Machine", detail: "10000 LP · Requires Fidough Fur ×5, Tandemaus Fur ×3, Tinkatink Hair ×3" },
      ] },
    ],
  },
  "tm128": {
    name: "TM128",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 1500, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 1500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Mesagoza", detail: "TM Machine · 1500 LP · Requires 3 Slowpoke Claw and 3 Slakoth Fur" },
      ] },
    ],
  },
  "tm129": {
    name: "TM129",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 3000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 15, sell: null, cur: "battle-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "TM Machine", detail: "3000 LP · Requires Stantler Hair ×3 and Indeedee Fur ×3" },
        { type: "Shop", place: "Blueberry Academy", detail: "Blueberry Academy Store (The Indigo Disk) · 15 BP · Only in The Indigo Disk" },
      ] },
    ],
  },
  "tm130": {
    name: "TM130",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 400, cur: "poke-dollar" },
      { vg: ["the-indigo-disk"], games: "The Indigo Disk", buy: 10, sell: null, cur: "battle-point" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Shop", place: "Blueberry Academy", detail: "Blueberry Academy Store · 10 BP · Only available during The Indigo Disk" },
        { type: "Crafting", place: "TM Machine", detail: "400 LP · Requires Eevee Fur ×1" },
      ] },
    ],
  },
  "tm131": {
    name: "TM131",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 10000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 10000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "TM Machine", detail: "10000 LP · Requires Rellor Mud ×5, Petilil Leaf ×3, Kricketot Shell ×3" },
      ] },
    ],
  },
  "tm132": {
    name: "TM132",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 3000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
  },
  "tm133": {
    name: "TM133",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 10000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 10000, sell: null, cur: "league-point" },
      { vg: ["the-indigo-disk"], games: "The Indigo Disk", buy: 50, sell: null, cur: "battle-point" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "TM Machine", detail: "10000 LP · Requires Silicobra Sand ×5, Shellos Mud ×3, Barboach Slime ×3" },
      ] },
      { vg: "the-indigo-disk", games: "The Indigo Disk", lines: [
        { type: "Exchange", place: "Blueberry Academy", detail: "Blueberry Academy Store, Coastal Biome · 50 BP" },
      ] },
    ],
  },
  "tm134": {
    name: "TM134",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 3000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Casseroya Lake", detail: "East Province (Area One), TM Machine · 3000 LP · Requires Falinks Sweat ×3, Heracross Claw ×3, and Mankey Fur ×3" },
      ] },
    ],
  },
  "tm135": {
    name: "TM135",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 10000, cur: "poke-dollar" },
    ],
  },
  "tm136": {
    name: "TM136",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 3000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Levincia", detail: "TM Machine · 3000 LP" },
      ] },
    ],
  },
  "tm137": {
    name: "TM137",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 3000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "TM Machine", detail: "3000 LP · Requires Flabébé Pollen ×3, Sunkern Leaf ×3, and Fomantis Leaf ×3" },
      ] },
    ],
  },
  "tm138": {
    name: "TM138",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 3000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "TM Machine", detail: "3000 LP · Also requires crafting materials" },
      ] },
    ],
  },
  "tm139": {
    name: "TM139",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 3000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "TM Machine", detail: "3000 LP · Requires Klefki Key ×3, Igglybuff Fluff ×3, Flabébé Pollen ×3" },
      ] },
    ],
  },
  "tm140": {
    name: "TM140",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Shop", place: "Blueberry Academy", detail: "Blueberry Academy Store (Polar Biome) · 25 BP · Only in The Indigo Disk" },
        { type: "Crafting", place: "Area Zero", detail: "TM Machine · 5000 LP · Requires Meowth Fur ×3, Spiritomb Fragment ×3, Tatsugiri Scales ×3" },
      ] },
    ],
  },
  "tm141": {
    name: "TM141",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 12000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 60, sell: null, cur: "battle-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 12000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Shop", place: "Blueberry Academy", detail: "Blueberry Academy Store · 60 BP · Only in The Indigo Disk" },
        { type: "Crafting", place: "TM Machine", detail: "12000 LP · Available at multiple locations including Casseroya Lake and provinces; additional locations in The Teal Mask and The Indigo Disk" },
      ] },
    ],
  },
  "tm142": {
    name: "TM142",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 12000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 12000, cur: "poke-dollar" },
      { vg: ["the-indigo-disk"], games: "The Indigo Disk", buy: 60, sell: null, cur: "battle-point" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "TM Machine", detail: "12000 LP · Requires Finizen Mucus ×5, Finneon Scales ×3, and Luvdisc Scales ×3" },
        { type: "Shop", place: "Blueberry Academy", detail: "Blueberry Academy Store · 60 BP · Only in The Indigo Disk" },
      ] },
    ],
  },
  "tm143": {
    name: "TM143",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 12000, cur: "poke-dollar" },
      { vg: ["the-indigo-disk"], games: "The Indigo Disk", buy: 60, sell: null, cur: "battle-point" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Area Zero", detail: "TM Machine · 12000 LP · Requires additional Pokémon materials" },
        { type: "Shop", place: "Blueberry Academy", detail: "Blueberry Academy Store · 60 BP · Only in The Indigo Disk" },
      ] },
    ],
  },
  "tm144": {
    name: "TM144",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 8000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 8000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "East Paldean Sea", detail: "TM Machine · 8000 LP · Also obtainable in The Indigo Disk at Torchlit Labyrinth" },
      ] },
    ],
  },
  "tm145": {
    name: "TM145",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 8000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 8000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "East Paldean Sea", detail: "TM Machine · 8000 LP · Also available only in The Indigo Disk at Torchlit Labyrinth" },
      ] },
    ],
  },
  "tm146": {
    name: "TM146",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 8000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 8000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "East Paldean Sea", detail: "TM Machine · 8000 LP · Also available in Torchlit Labyrinth in The Indigo Disk" },
      ] },
    ],
  },
  "tm147": {
    name: "TM147",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 10000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 10000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "North Province (Area Two)", detail: "TM Machine · 10000 LP · Only in The Teal Mask: Paradise Barrens · Requires Shinx Fang ×5, Pichu Fur ×3, Tynamo Slime ×3" },
      ] },
    ],
  },
  "tm148": {
    name: "TM148",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 10000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "TM Machine", detail: "10000 LP · Requires Croagunk Poison ×5, Grimer Toxin ×3, Foongus Spores ×3" },
        { type: "Exchange", place: "Blueberry Academy Store", detail: "50 BP · Only in The Indigo Disk" },
      ] },
    ],
  },
  "tm149": {
    name: "TM149",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 12000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Cascarrafa", detail: "TM Machine · 12000 LP · Requires Phanpy Nail ×5, Diglett Dirt ×3, Barboach Slime ×3" },
        { type: "Exchange", place: "Blueberry Academy", detail: "Blueberry Academy Store · 60 BP · Only in The Indigo Disk" },
      ] },
    ],
  },
  "tm150": {
    name: "TM150",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 12000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 60, sell: null, cur: "battle-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 12000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "TM Machine", detail: "12000 LP · Requires Rolycoly Coal ×5, Rockruff Rock ×3, Klawf Claw ×3" },
        { type: "Shop", place: "Blueberry Academy", detail: "Blueberry Academy Store · 60 BP · Only in The Indigo Disk" },
      ] },
    ],
  },
  "tm151": {
    name: "TM151",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 10000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Timeless Woods", detail: "TM Machine · 10000 LP · Only in The Teal Mask · Requires Sinistea Chips ×5, Shuppet Scrap ×3, Greavard Wax ×3" },
        { type: "Crafting", place: "Inlet Grotto", detail: "TM Machine · 10000 LP · Requires Sinistea Chips ×5, Shuppet Scrap ×3, Greavard Wax ×3" },
      ] },
    ],
  },
  "tm152": {
    name: "TM152",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 14000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "TM Machine", detail: "14000 LP · Requires Tauros Hair ×8, Zangoose Claw ×5, and Slakoth Fur ×3." },
      ] },
    ],
  },
  "tm153": {
    name: "TM153",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 14000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "North Province (Area One)", detail: "TM Machine · 14000 LP · Requires Houndour Fang ×8, Charcadet Soot ×5, Growlithe Fur ×3" },
      ] },
    ],
  },
  "tm154": {
    name: "TM154",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 14000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 14000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "North Province (Area One)", detail: "TM Machine · 14000 LP · Only in The Indigo Disk: Coastal Biome" },
      ] },
    ],
  },
  "tm155": {
    name: "TM155",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 14000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 14000, sell: null, cur: "league-point" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "North Province (Area One)", detail: "TM Machine · 14000 LP · Only in The Indigo Disk: Canyon Biome" },
      ] },
    ],
  },
  "tm156": {
    name: "TM156",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 12000, cur: "poke-dollar" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 12000, sell: null, cur: "league-point" },
      { vg: ["the-indigo-disk"], games: "The Indigo Disk", buy: 60, sell: null, cur: "battle-point" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Area Zero", detail: "TM Machine · 12000 LP · Requires Axew Scales x5, Dratini Scales x3, Frigibax Scales x3" },
        { type: "Shop", place: "Blueberry Academy", detail: "Blueberry Academy Store · 60 BP · Only in The Indigo Disk" },
      ] },
    ],
  },
  "tm157": {
    name: "TM157",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 12000, cur: "poke-dollar" },
      { vg: ["the-indigo-disk"], games: "The Indigo Disk", buy: 60, sell: null, cur: "battle-point" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Overworld", place: "Alfornada Cavern", games: "Scarlet" },
        { type: "Crafting", place: "TM Machine", detail: "12000 LP · Requires Litleo Tuft ×5, Numel Lava ×3, Capsakid Seed ×3", games: "Scarlet" },
        { type: "Overworld", place: "Glaseado Mountain", games: "Violet" },
      ] },
      { vg: "the-indigo-disk", games: "The Indigo Disk", lines: [
        { type: "Shop", place: "Blueberry Academy (Store)", detail: "60 BP · Only in The Indigo Disk" },
      ] },
    ],
  },
  "tm158": {
    name: "TM158",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 12000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 12000, cur: "poke-dollar" },
      { vg: ["the-indigo-disk"], games: "The Indigo Disk", buy: 60, sell: null, cur: "battle-point" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "TM Machine", detail: "12000 LP · Requires Flamigo Down ×5, Meditite Sweat ×3, Impidimp Hair ×3" },
        { type: "Shop", place: "Blueberry Academy", detail: "Blueberry Academy Store · 60 BP · Only in The Indigo Disk" },
      ] },
    ],
  },
  "tm159": {
    name: "TM159",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 12000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 60, sell: null, cur: "battle-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 12000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Area Zero", detail: "TM Machine · 12000 LP · Requires Bounsweet Sweat ×5, Tropius Leaf ×3, Toedscool Flaps ×3" },
      ] },
    ],
  },
  "tm160": {
    name: "TM160",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 12000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 60, sell: null, cur: "battle-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 12000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Shop", place: "Blueberry Academy (Store)", detail: "Canyon Biome · 60 BP · Only in The Indigo Disk" },
        { type: "Crafting", place: "TM Machine", detail: "12000 LP · Requires Swablu Fluff ×5, Oricorio Feather ×3, Wingull Feather ×3" },
      ] },
    ],
  },
  "tm161": {
    name: "TM161",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 5000, cur: "poke-dollar" },
      { vg: ["the-indigo-disk"], games: "The Indigo Disk", buy: 25, sell: null, cur: "battle-point" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Levincia", detail: "TM Machine · 5000 LP · Requires Hatenna Dust ×3, Bronzor Fragment ×3, Gothita Eyelash ×3" },
        { type: "Overworld", place: "Fellhorn Gorge", detail: "Only in The Teal Mask · The Teal Mask", games: "Scarlet" },
        { type: "Shop", place: "Blueberry Academy", detail: "Academy Store, Canyon Biome · 25 BP · The Indigo Disk", games: "Violet" },
      ] },
    ],
  },
  "tm162": {
    name: "TM162",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 10000, cur: "poke-dollar" },
      { vg: ["the-indigo-disk"], games: "The Indigo Disk", buy: 50, sell: null, cur: "battle-point" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "TM Machine", detail: "10000 LP · Requires Kricketot Shell ×5, Combee Honey ×3, Venonat Fang ×3" },
        { type: "Exchange", place: "Blueberry Academy", detail: "Blueberry Academy Store · 50 BP · Only in The Indigo Disk" },
      ] },
    ],
  },
  "tm163": {
    name: "TM163",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 14000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "TM Machine", detail: "14000 LP · Requires Dratini Scales ×8, Goomy Goo ×5, Tauros Hair ×3" },
        { type: "Exchange", place: "Blueberry Academy", detail: "Blueberry Academy Store · 70 BP · Only in The Indigo Disk" },
      ] },
    ],
  },
  "tm164": {
    name: "TM164",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 12000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "TM Machine", detail: "12000 LP · Requires Starly Feather ×5, Rufflet Feather ×3, Rookidee Feather ×3" },
        { type: "Shop", place: "Blueberry Academy", detail: "Blueberry Academy Store · 60 BP · Only in The Indigo Disk" },
      ] },
    ],
  },
  "tm165": {
    name: "TM165",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 12000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 60, sell: null, cur: "battle-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 12000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Shop", place: "Blueberry Academy (Store)", detail: "Blueberry Academy Store · 60 BP · Only in The Indigo Disk" },
        { type: "Crafting", place: "Alfornada, Area Zero", detail: "12000 LP · Requires Growlithe Fur ×5, Fletchling Feather ×3, Charcadet Soot ×3" },
      ] },
    ],
  },
  "tm166": {
    name: "TM166",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 12000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Shop", place: "Blueberry Academy", detail: "Blueberry Academy Store · 60 BP · Only in The Indigo Disk" },
        { type: "Crafting", place: "TM Machine", detail: "12000 LP · Requires Dedenne Fur ×5, Pichu Fur ×3, Tynamo Slime ×3" },
      ] },
    ],
  },
  "tm167": {
    name: "TM167",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 12000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Trainer Reward", place: "Prize for defeating Eri, TM Machine" },
      ] },
    ],
  },
  "tm168": {
    name: "TM168",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 12000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 12000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "TM Machine", detail: "12000 LP · Available at TM Machines; recipe availability noted at Casseroya Lake, East Province (Area Three), North Province (Area One). Only in The Indigo Disk: Canyon Biome. · Requires Bounsweet Sweat ×5, Tropius Leaf ×3, Foongus Spores ×3." },
      ] },
    ],
  },
  "tm169": {
    name: "TM169",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 14000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 14000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "NPC Defeat", place: "Mesagoza", detail: "Prize for defeating Penny after completing Operation Starfall and Area Zero · After completing Operation Starfall and Area Zero" },
      ] },
    ],
  },
  "tm170": {
    name: "TM170",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 14000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 14000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Kitakami Wilds", detail: "TM Machine (The Teal Mask) · 14000 LP · Only in The Teal Mask" },
        { type: "Crafting", place: "Area Zero", detail: "North Province (Area Three) TM Machine · 14000 LP" },
      ] },
    ],
  },
  "tm171": {
    name: "TM171",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 8000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "TM Machine", detail: "8000 LP · Requires Glimmet Crystal ×8" },
        { type: "NPC Gift", place: "Area Zero", detail: "From Geeta after defeating Nemona after obtaining 5 Gym Badges · After obtaining 5 Gym Badges and defeating Nemona" },
        { type: "Shop", place: "Blueberry Academy", detail: "Blueberry Academy Store, Central Plaza · 40 BP · Only in The Indigo Disk" },
      ] },
    ],
  },
  "auspicious-armor": {
    name: "Auspicious Armor",
    description: "Armour steeped in the spirit of a warrior; Charcadet evolves into Armarouge when given it.",
    noArt: true,
    category: "Picnic", pocket: "misc",
    gens: [9],
    fling: { power: 30 },
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 1500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Exchange", place: "Zapapico", detail: "Man next to the fountain near the eastern Pokémon Center · ₱10 · Exchange for ten Bronzor Fragments", games: "Scarlet" },
        { type: "Exchange", place: "Trade", games: "Violet" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Story", place: "Side Mission 132: Bitter Blue Flames vs. Blazing Crimson", detail: "Given by Adver if chosen over Malicious Armor" },
      ] },
    ],
  },
  "syrupy-apple": {
    name: "Syrupy Apple",
    description: "An apple heavy with sticky syrup; Applin evolves into Dipplin when given it.",
    noArt: true,
    category: "Evolution", pocket: "misc",
    gens: [9],
    fling: { power: 30 },
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 500, sell: 550, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Shop", place: "Mossfell Confluence", detail: "Food Stand · ₱500" },
      ] },
    ],
  },
  "unremarkable-teacup": {
    name: "Unremarkable Teacup",
    description: "A plain-looking antique teacup; Poltchageist evolves into Sinistcha when given it.",
    noArt: true,
    category: "Evolution", pocket: "misc",
    gens: [9],
    fling: { power: 80 },
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 400, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Overworld", place: "Paradise Barrens" },
        { type: "Overworld", place: "Oni Mountain" },
        { type: "Contest", place: "Ogre Oustin'" },
        { type: "Item Printer", place: "Item Printer", detail: "The Indigo Disk" },
      ] },
    ],
  },
  "tm172": {
    name: "TM172",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 200, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 200, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Kitakami Road", detail: "TM Machine (The Teal Mask only) · 200 LP · Only available during The Teal Mask · Requires Houndour Fang ×2 and Poochyena Fang ×3" },
      ] },
    ],
  },
  "tm173": {
    name: "TM173",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 400, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 400, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Mossui Town", detail: "TM Machine (The Teal Mask only) · 400 LP · Available only in The Teal Mask · Requires Pichu Fur ×3" },
      ] },
    ],
  },
  "tm174": {
    name: "TM174",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 400, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 400, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Fellhorn Gorge", detail: "TM Machine (The Teal Mask) · 400 LP · Only in The Teal Mask · Requires Feebas Scales ×2" },
        { type: "Crafting", place: "Polar Biome", detail: "TM Machine (The Indigo Disk) · 400 LP · Only in The Indigo Disk · Requires Feebas Scales ×2" },
      ] },
    ],
  },
  "tm175": {
    name: "TM175",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 800, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 800, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Loyalty Plaza", detail: "TM Machine (Only in The Teal Mask) · 800 LP · Only available in The Teal Mask · Requires Ekans Fang ×3 and Koffing Gas ×3" },
      ] },
    ],
  },
  "tm176": {
    name: "TM176",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 400, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 400, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Oni Mountain", detail: "TM Machine (The Teal Mask) · 400 LP · Only available in The Teal Mask · Requires Diglett Dirt ×2 and Sandshrew Claw ×3" },
      ] },
    ],
  },
  "tm177": {
    name: "TM177",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["the-teal-mask"], games: "The Teal Mask", buy: 200, sell: null, cur: "league-point" },
      { vg: ["the-teal-mask"], games: "The Teal Mask", buy: null, sell: 200, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Mossui Town", detail: "TM Machine · 200 LP · Only available in The Teal Mask · Requires Duskull Fragment ×2 and Gastly Gas ×2" },
      ] },
    ],
  },
  "tm178": {
    name: "TM178",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 400, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 400, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Fellhorn Gorge", detail: "TM Machine (The Teal Mask only) · 400 LP · Only available in The Teal Mask · Requires Cleffa Fur ×2 and Nosepass Fragment ×4." },
      ] },
    ],
  },
  "tm179": {
    name: "TM179",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 800, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 800, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Wistful Fields", detail: "TM Machine (The Teal Mask) · 800 LP · Only available in The Teal Mask · Requires Geodude Fragment ×3 and Carbink Jewel ×3" },
      ] },
    ],
  },
  "tm180": {
    name: "TM180",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 10000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 10000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Infernal Pass", detail: "TM Machine (The Teal Mask) · 10000 LP · Only in The Teal Mask · Requires Nosepass Fragment ×4 and Bronzor Fragment ×2" },
      ] },
    ],
  },
  "tm181": {
    name: "TM181",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 14000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 14000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Oni Mountain", detail: "TM Machine (The Teal Mask) · 14000 LP · Available in The Teal Mask · Requires Corphish Shell ×4 and Seedot Stem ×4" },
        { type: "Crafting", place: "Savanna Biome", detail: "TM Machine (The Indigo Disk) · 14000 LP · Available in The Indigo Disk · Requires Corphish Shell ×4 and Seedot Stem ×4" },
      ] },
    ],
  },
  "tm182": {
    name: "TM182",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 3000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Apple Hills", detail: "TM Machine (The Teal Mask only) · 3000 LP · Available only during The Teal Mask · Requires Yanma Spike x2, Surskit Syrup x2, Sewaddle Leaf x2" },
      ] },
    ],
  },
  "tm183": {
    name: "TM183",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 5000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Oni's Maw", detail: "TM Machine (The Teal Mask) · 5000 LP · Only available in The Teal Mask · Requires Sandshrew Claw ×3 and Tandemaus Fur ×3" },
      ] },
    ],
  },
  "tm184": {
    name: "TM184",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Infernal Pass", detail: "TM Machine (Only in The Teal Mask) · 3000 LP · Available only during The Teal Mask · Requires Riolu Fur ×3 and Croagunk Poison ×2." },
      ] },
    ],
  },
  "tm185": {
    name: "TM185",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "TM Machine (Only in The Teal Mask: Reveler's Road; Only in The Indigo Disk: Savanna Biome)", detail: "5000 LP · Requires 3 Sewaddle Leaf and 3 Kricketot Shell." },
      ] },
    ],
  },
  "tm186": {
    name: "TM186",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 5000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Paradise Barrens", detail: "TM Machine (The Teal Mask) · 5000 LP · Only in The Teal Mask · Requires Swinub Hair ×2 and Mudbray Mud ×4" },
        { type: "Crafting", place: "Canyon Biome", detail: "TM Machine (The Indigo Disk) · 5000 LP · Only in The Indigo Disk · Requires Swinub Hair ×2 and Mudbray Mud ×4" },
      ] },
    ],
  },
  "tm187": {
    name: "TM187",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 50, sell: null, cur: "battle-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 10000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "TM Machine", detail: "10000 LP · Requires Swinub Hair ×2 and Snorunt Fur ×3" },
        { type: "Shop", place: "Blueberry Academy", detail: "Blueberry Academy Store, Polar Biome · 50 BP · Only in The Indigo Disk" },
      ] },
    ],
  },
  "tm188": {
    name: "TM188",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 8000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "TM Machine", detail: "8000 LP · Only available in The Teal Mask or The Indigo Disk · Requires Poltchageist Powder ×3 and Slowpoke Claw ×3" },
      ] },
    ],
  },
  "tm189": {
    name: "TM189",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 8000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 8000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Kitakami Wilds", detail: "TM Machine · 8000 LP · Only in The Teal Mask · Requires Slugma Lava ×4 and Munchlax Fang ×2" },
      ] },
    ],
  },
  "tm190": {
    name: "TM190",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 12000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 12000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "TM Machine", detail: "12000 LP · Requires Seedot Stem ×4 and Sewaddle Leaf ×2" },
      ] },
    ],
  },
  "tm191": {
    name: "TM191",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 5000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Oni's Maw", detail: "TM Machine (The Teal Mask) · 5000 LP · Only available in The Teal Mask · Requires Lotad Leaf ×4 and Chingling Fragment ×2" },
      ] },
    ],
  },
  "tm192": {
    name: "TM192",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 8000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 8000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Reveler's Road", detail: "TM Machine · 8000 LP · Only in The Teal Mask · Requires Timburr Sweat ×3 and Jangmo-o Scales ×3" },
      ] },
    ],
  },
  "tm193": {
    name: "TM193",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 1500, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 1500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Kitakami Road", detail: "TM Machine (The Teal Mask) · 1500 LP · Available only in The Teal Mask. · Requires Vulpix Fur ×3 and Petilil Leaf ×3." },
        { type: "Crafting", place: "Polar Biome", detail: "TM Machine (The Indigo Disk) · 1500 LP · Available only in The Indigo Disk. · Requires Vulpix Fur ×3 and Petilil Leaf ×3." },
      ] },
    ],
  },
  "tm194": {
    name: "TM194",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 10000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Coastal Biome", detail: "TM Machine (The Indigo Disk) · 10000 LP · Available only in The Indigo Disk · Requires Bellsprout Vine ×3 and Seedot Stem ×3" },
        { type: "Crafting", place: "Apple Hills", detail: "TM Machine (The Teal Mask) · 10000 LP · Available only in The Teal Mask · Requires Bellsprout Vine ×3 and Seedot Stem ×3" },
      ] },
    ],
  },
  "tm195": {
    name: "TM195",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 8000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 8000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Fellhorn Gorge", detail: "TM Machine · 8000 LP · Only in The Teal Mask · Requires crafting materials: Litwick Soot ×2, Vulpix Fur ×2, Mimikyu Scrap ×2" },
      ] },
    ],
  },
  "tm196": {
    name: "TM196",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "TM Machine", detail: "5000 LP · Requires materials: Basculin Fang ×2, Veluza Fillet ×2, Finizen Mucus ×2" },
        { type: "Shop", place: "Blueberry Academy (Store)", detail: "Canyon Biome · 25 BP · Only in The Indigo Disk" },
      ] },
    ],
  },
  "tm197": {
    name: "TM197",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 5000, cur: "poke-dollar" },
      { vg: ["the-indigo-disk"], games: "The Indigo Disk", buy: 25, sell: null, cur: "battle-point" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Fellhorn Gorge", detail: "TM Machine (The Teal Mask) · 5000 LP · Requires Ducklett Feather ×3 and Bombirdier Feather ×3" },
        { type: "Exchange", place: "Blueberry Academy", detail: "Blueberry Academy Store (The Indigo Disk) · 25 BP" },
      ] },
    ],
  },
  "tm198": {
    name: "TM198",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 14000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Reveler's Road", detail: "TM Machine (The Teal Mask only) · 14000 LP · Available only in The Teal Mask · Requires Litwick Soot ×2, Phantump Twig ×2, and Duskull Fragment ×2" },
      ] },
    ],
  },
  "tm199": {
    name: "TM199",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 5000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Timeless Woods", detail: "TM Machine (Only in The Teal Mask) · 5000 LP · Only available in The Teal Mask · Requires Vullaby Feather ×3, Pawniard Blade ×2, Poochyena Fang ×2" },
      ] },
    ],
  },
  "tm200": {
    name: "TM200",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 10000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "TM Machine", detail: "10000 LP · Requires Gible Scales ×2, Arrokuda Scales ×2, Jangmo-o Scales ×2" },
        { type: "Shop", place: "Blueberry Academy", detail: "Blueberry Academy Store · 50 BP · Only in The Indigo Disk" },
      ] },
    ],
  },
  "tm201": {
    name: "TM201",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 14000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 14000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Kitakami Wilds", detail: "TM Machine (The Teal Mask) · 14000 LP · Available only during The Teal Mask expansion. · Requires Carbink Jewel ×2 and Cleffa Fur ×3.", games: "Scarlet" },
        { type: "Crafting", place: "Canyon Biome", detail: "TM Machine (The Indigo Disk) · 14000 LP · Available only during The Indigo Disk expansion. · Requires Carbink Jewel ×2 and Cleffa Fur ×3.", games: "Violet" },
      ] },
    ],
  },
  "tm202": {
    name: "TM202",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 3000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Savanna Biome", detail: "TM Machine · 3000 LP · Only available in The Indigo Disk · Requires Solosis Gel ×3 and Comfey Flower ×2" },
      ] },
    ],
  },
  "tm203": {
    name: "TM203",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 400, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 400, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Coastal Biome", detail: "TM Machine · 400 LP · Only in The Indigo Disk · Requires Porygon Fragment ×1 and Stantler Hair ×2" },
      ] },
    ],
  },
  "tm204": {
    name: "TM204",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 10000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 10000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Savanna Biome", detail: "TM Machine (Only in The Indigo Disk) · 10000 LP · Only in The Indigo Disk · Requires Rhyhorn Fang ×4 and Tauros Hair ×2" },
      ] },
    ],
  },
  "tm205": {
    name: "TM205",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Savanna Biome", detail: "TM Machine (The Indigo Disk) · 5000 LP · Only available in The Indigo Disk · Requires Snubbull Hair ×3 and Tauros Hair ×3" },
      ] },
    ],
  },
  "tm206": {
    name: "TM206",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 5000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Coastal Biome", detail: "TM Machine · 5000 LP · Only in The Indigo Disk · Requires crafting materials: Oddish Leaf ×2, Comfey Flower ×2, Cottonee Fluff ×1" },
      ] },
    ],
  },
  "tm207": {
    name: "TM207",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 3000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "TM Machine", detail: "3000 LP · Requires Magby Hair ×3 and Numel Lava ×2" },
        { type: "NPC Defeat", place: "Crispin", detail: "Only in The Indigo Disk" },
      ] },
    ],
  },
  "tm208": {
    name: "TM208",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 800, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 800, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Polar Biome", detail: "TM Machine · 800 LP · Only available in The Indigo Disk · Requires materials: Horsea Ink ×2, Seel Fur ×2, Lapras Teardrop ×1" },
      ] },
    ],
  },
  "tm209": {
    name: "TM209",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 10000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "TM Machine (The Indigo Disk: Polar Biome, Savanna Biome)", detail: "10000 LP · Only in The Indigo Disk · Requires Horsea Ink ×3 and Wooper Slime ×3." },
      ] },
    ],
  },
  "tm210": {
    name: "TM210",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Canyon Biome", detail: "TM Machine, Chargestone Cavern (The Indigo Disk only) · 5000 LP · Only available in The Indigo Disk · Requires Elekid Fur ×3 and Blitzle Mane Hair ×2." },
      ] },
    ],
  },
  "tm211": {
    name: "TM211",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 800, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 800, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Chargestone Cavern", detail: "TM Machine (Only in The Indigo Disk) · 800 LP · Available only during The Indigo Disk · Requires Joltik Thread ×5" },
      ] },
    ],
  },
  "tm212": {
    name: "TM212",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 8000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 8000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Polar Biome", detail: "TM Machine (The Indigo Disk) · 8000 LP · Only in The Indigo Disk · Requires Tyrogue Sweat ×1, Minccino Fur ×1, Sneasel Claw ×3" },
      ] },
    ],
  },
  "tm213": {
    name: "TM213",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 800, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Savanna Biome", detail: "TM Machine (Only in The Indigo Disk) · 800 LP · Only in The Indigo Disk · Requires Scraggy Sweat ×3, Pawmi Fur ×1, Tyrogue Sweat ×1" },
      ] },
    ],
  },
  "tm214": {
    name: "TM214",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 10000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Coastal Biome", detail: "TM Machine (The Indigo Disk) · 10000 LP · Only available in The Indigo Disk · Requires Tentacool Stinger x2, Qwilfish Spines x2, Gastly Gas x2" },
      ] },
    ],
  },
  "tm215": {
    name: "TM215",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 10000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 10000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "TM Machine (Only in The Indigo Disk: Coastal Biome, Savanna Biome)", detail: "10000 LP · Available only in The Indigo Disk · Requires Trapinch Shell ×2, Sandile Claw ×1, Drilbur Claw ×2" },
      ] },
    ],
  },
  "tm216": {
    name: "TM216",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 400, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 400, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Canyon Biome", detail: "TM Machine (The Indigo Disk only) · 400 LP · Available only in The Indigo Disk · Requires Pikipek Feather ×3 and Murkrow Bauble ×2" },
      ] },
    ],
  },
  "tm217": {
    name: "TM217",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 5000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Canyon Biome", detail: "TM Machine (The Indigo Disk only) · 5000 LP · Available only in The Indigo Disk. · Requires Solosis Gel ×2, Slowpoke Claw ×2, and Drowzee Fur ×2." },
      ] },
    ],
  },
  "tm218": {
    name: "TM218",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 10000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 10000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Savanna Biome", detail: "TM Machine (The Indigo Disk only) · 10000 LP · Available only in The Indigo Disk · Requires Espurr Fur ×3 and Exeggcute Shell ×2" },
      ] },
    ],
  },
  "tm219": {
    name: "TM219",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Canyon Biome", detail: "TM Machine (Only in The Indigo Disk) · 3000 LP · Available in The Indigo Disk · Requires Dewpider Thread ×3 and Rellor Mud ×2" },
      ] },
    ],
  },
  "tm220": {
    name: "TM220",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 15000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "TM Machine (The Indigo Disk: Canyon Biome, Polar Biome)", detail: "15000 LP · Only in The Indigo Disk · Requires Minior Shell ×8" },
      ] },
    ],
  },
  "tm221": {
    name: "TM221",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Savanna Biome", detail: "TM Machine (The Indigo Disk only) · 5000 LP · Available only in The Indigo Disk · Requires Scraggy Sweat ×2 and Zorua Fur ×3" },
      ] },
    ],
  },
  "tm222": {
    name: "TM222",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 3000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Polar Biome", detail: "TM Machine (The Indigo Disk) · 3000 LP · Only in The Indigo Disk · Requires Duraludon Tarnish ×3, Axew Scales ×2, Cyclizar Scales ×1" },
      ] },
    ],
  },
  "tm223": {
    name: "TM223",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 800, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 800, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Torchlit Labyrinth", detail: "TM Machine · 800 LP · Only in The Indigo Disk · Requires Magnemite Screw ×2 and Elekid Fur ×2." },
      ] },
    ],
  },
  "tm224": {
    name: "TM224",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 400, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 400, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Polar Biome", detail: "TM Machine (The Indigo Disk only) · 400 LP · Available only in The Indigo Disk · Requires Golett Shard ×4 and Nacli Salt ×2" },
      ] },
    ],
  },
  "tm225": {
    name: "TM225",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 5000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 5000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Trainer Reward", place: "Amarys", detail: "Only in The Indigo Disk" },
        { type: "Crafting", place: "TM Machine", detail: "5000 LP · Requires Beldum Claw ×3 and Cufant Tarnish ×3" },
      ] },
    ],
  },
  "tm226": {
    name: "TM226",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 1500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "TM Machine", detail: "1500 LP · Requires Tatsugiri Scales ×2, Lapras Teardrop ×2, and Applin Juice ×1." },
        { type: "Trainer Reward", place: "Prize for defeating Drayton", detail: "Only in The Indigo Disk" },
      ] },
    ],
  },
  "tm227": {
    name: "TM227",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 3000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "NPC Defeat", place: "Prize for defeating Lacey (The Indigo Disk)", detail: "Only in The Indigo Disk" },
        { type: "Crafting", place: "TM Machine", detail: "3000 LP · Requires Igglybuff Fluff ×3, Ralts Dust ×2, Cottonee Fluff ×2" },
      ] },
    ],
  },
  "tm228": {
    name: "TM228",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 3000, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 3000, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Central Plaza", detail: "TM Machine · 3000 LP · Only in The Indigo Disk · Requires Psyduck Down ×3 and Chingling Fragment ×3" },
      ] },
    ],
  },
  "tm229": {
    name: "TM229",
    description: "A disc that teaches a compatible Pokémon one move; which move depends on the game.",
    category: "All machines", pocket: "machines",
    gens: [9],
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: 1500, sell: null, cur: "league-point" },
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 1500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Crafting", place: "Savanna Biome", detail: "TM Machine · 1500 LP · Only available in The Indigo Disk · Requires Makuhita Sweat ×3 and Tyrogue Sweat ×3." },
      ] },
    ],
  },
  "lastrange-ball": {
    name: "Strange Ball",
    description: "A ball from another era that Pokémon arrive in when transferred to Hisui.",
    category: "Standard balls", pocket: "pokeballs",
    gens: [8, 9],
  },
  "lapoke-ball": {
    name: "Poké Ball",
    description: "Hisui's wooden, hand-crafted Poké Ball; thrown from a distance at unwary Pokémon.",
    category: "Standard balls", pocket: "pokeballs",
    gens: [8, 9],
  },
  "lagreat-ball": {
    name: "Great Ball",
    description: "Hisui's improved crafted ball, more reliable than the plain one.",
    category: "Standard balls", pocket: "pokeballs",
    gens: [8, 9],
  },
  "laultra-ball": {
    name: "Ultra Ball",
    description: "Hisui's best standard crafted ball.",
    category: "Standard balls", pocket: "pokeballs",
    gens: [8, 9],
  },
  "laheavy-ball": {
    name: "Heavy Ball",
    description: "A weighty Hisuian ball that barely flies but catches well when the target hasn't spotted you.",
    category: "Standard balls", pocket: "pokeballs",
    gens: [8, 9],
  },
  "laleaden-ball": {
    name: "Leaden Ball",
    description: "A heavier Heavy Ball; short range, but very effective on Pokémon that haven't noticed you.",
    category: "Standard balls", pocket: "pokeballs",
    gens: [8, 9],
    prices: [
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: 320, sell: 80, cur: "poke-dollar" },
    ],
    where: [
      { vg: "legends-arceus", games: "Legends: Arceus", lines: [
        { type: "Crafting", place: "Crafting using 1 Apricorn, 1 Black Tumblestone, and 1 Iron Chunk" },
        { type: "Shop", place: "General store and base camp stores", detail: "₱320 · After completing Request 61: Even More New Wares" },
        { type: "Shop", place: "Ginkgo Guild cart (Ginter)", detail: "Randomly sold" },
        { type: "Contest", place: "Practice Field", detail: "Balloon minigame reward · Random reward" },
        { type: "Contest", place: "Cobalt Coastlands", detail: "Balloon Race · Random reward" },
      ] },
    ],
  },
  "lagigaton-ball": {
    name: "Gigaton Ball",
    description: "The heaviest Hisuian ball of all; strongest on unsuspecting Pokémon, hopeless at range.",
    category: "Standard balls", pocket: "pokeballs",
    gens: [8, 9],
    prices: [
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: null, sell: 160, cur: "poke-dollar" },
    ],
    where: [
      { vg: "legends-arceus", games: "Legends: Arceus", lines: [
        { type: "Event", place: "Ultra, Gigaton and Jet Balls event" },
        { type: "Crafting", place: "Crafting using 1 Apricorn, 2 Black Tumblestones, and 2 Iron Chunks" },
        { type: "Shop", place: "Ginkgo Guild cart (Ginter)", detail: "Randomly sold" },
      ] },
    ],
  },
  "lafeather-ball": {
    name: "Feather Ball",
    description: "A light Hisuian ball that flies fast and far, for distant or airborne Pokémon.",
    category: "Standard balls", pocket: "pokeballs",
    gens: [8, 9],
    prices: [
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: 140, sell: 35, cur: "poke-dollar" },
    ],
    where: [
      { vg: "legends-arceus", games: "Legends: Arceus", lines: [
        { type: "Shop", place: "General store and base camp stores", detail: "₱140 · After completing Request 23: \"Getting Ahold of New Wares\"" },
        { type: "Request", place: "Reward for completing Request 15: \"Balloon Race in the Fieldlands\"" },
        { type: "Shop", place: "Ginkgo Guild cart (Ginter)", detail: "Randomly sold" },
        { type: "Crafting", place: "1 Apricorn and 1 Sky Tumblestone" },
      ] },
    ],
  },
  "lawing-ball": {
    name: "Wing Ball",
    description: "A better Feather Ball: longer range and a higher catch rate.",
    category: "Standard balls", pocket: "pokeballs",
    gens: [8, 9],
    prices: [
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: 340, sell: 85, cur: "poke-dollar" },
    ],
    where: [
      { vg: "legends-arceus", games: "Legends: Arceus", lines: [
        { type: "Crafting", place: "Crafted using 1 Apricorn, 1 Sky Tumblestone, and 1 Iron Chunk" },
        { type: "Shop", place: "General store and base camp stores", detail: "₱340 · After completing Request 61: \"Even More New Wares\"" },
        { type: "Shop", place: "Ginkgo Guild cart (Ginter)", detail: "Randomly sold" },
        { type: "Contest", place: "Practice field balloon minigame", detail: "Random reward" },
        { type: "Contest", place: "Cobalt Coastlands", detail: "Balloon Race · Random reward" },
      ] },
    ],
  },
  "lajet-ball": {
    name: "Jet Ball",
    description: "The fastest, farthest-flying Hisuian ball, for catching at long range.",
    category: "Standard balls", pocket: "pokeballs",
    gens: [8, 9],
    prices: [
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: null, sell: 170, cur: "poke-dollar" },
    ],
    where: [
      { vg: "legends-arceus", games: "Legends: Arceus", lines: [
        { type: "Event" },
        { type: "Crafting", place: "Recipe", detail: "Requires 1 Apricorn, 2 Sky Tumblestones, and 2 Iron Chunks" },
        { type: "Shop", place: "Ginkgo Guild cart (Ginter)", detail: "Randomly sold" },
      ] },
    ],
  },
  "laorigin-ball": {
    name: "Origin Ball",
    description: "A one-of-a-kind ball forged from Origin Ore and the Red Chain to catch a frenzied Pokémon at the Temple of Sinnoh.",
    category: "Standard balls", pocket: "pokeballs",
    gens: [8, 9],
    where: [
      { vg: "legends-arceus", games: "Legends: Arceus", lines: [
        { type: "Story", place: "Galaxy Hall", detail: "Received from Professor Laventon after obtaining the Origin Ore during Mission 18: \"The Counterpart\" · After obtaining the Origin Ore in Mission 18: \"The Counterpart\"" },
      ] },
    ],
  },
  "black-augurite": {
    name: "Black Augurite",
    description: "A glassy black stone that makes Scyther evolve into Kleavor.",
    noArt: true,
    category: "Evolution", pocket: "misc",
    gens: [8, 9],
    prices: [
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: 8000, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "legends-arceus", games: "Legends: Arceus", lines: [
        { type: "Request", place: "Jubilife Village", detail: "Reward for completing Request 68: \"A Nosepass to Guide the Way\"" },
        { type: "Shop", place: "Jubilife Village", detail: "Ginkgo Guild cart (Ginter, sold as \"Jet-Black Rock\") · Random daily stock" },
        { type: "Harvest", place: "Found by Ursaluna" },
        { type: "Dropped", place: "Space-time distortions" },
      ] },
      { vg: "legends-za", games: "Legends: Z-A", lines: [
        { type: "Dropped", place: "Hyperspace Zone (4★)", detail: "Destroy Floating Poké Ball in 4★ and 5★ Hyperspace Zones with Item Power: Special" },
        { type: "Dropped", place: "Hyperspace Zone (5★)", detail: "Destroy Floating Poké Ball in 4★ and 5★ Hyperspace Zones with Item Power: Special" },
      ] },
    ],
  },
  "peat-block": {
    name: "Peat Block",
    description: "A dense block of peat; Ursaring evolves into Ursaluna when exposed to it under a full moon.",
    noArt: true,
    category: "Evolution", pocket: "misc",
    gens: [8, 9],
    prices: [
      { vg: ["legends-arceus"], games: "Legends: Arceus", buy: 10000, sell: 500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "legends-arceus", games: "Legends: Arceus", lines: [
        { type: "Shop", place: "Ginkgo Guild cart (sold by Ginter as \"Hunk of Coal\")", detail: "Randomly sold" },
        { type: "Request", place: "Galaxy Hall", detail: "Reward for completing Request 86: \"Gone Astray...in the Icelands\"" },
        { type: "Dropped", place: "Sometimes found by Ursaluna" },
        { type: "Overworld", place: "Space-time distortions" },
      ] },
    ],
  },
  "metal-alloy": {
    name: "Metal Alloy",
    description: "A lump of rare blended metals; Duraludon evolves into Archaludon when given it.",
    noArt: true,
    category: "Evolution", pocket: "misc",
    prices: [
      { vg: ["scarlet-violet"], games: "Scarlet/Violet", buy: null, sell: 1500, cur: "poke-dollar" },
    ],
    where: [
      { vg: "scarlet-violet", games: "Scarlet/Violet", lines: [
        { type: "Achievement", place: "Blueberry Pokédex", detail: "Reward for registering 190 Pokémon in the Blueberry Pokédex" },
        { type: "Overworld", place: "Chargestone Cavern" },
      ] },
      { vg: "the-indigo-disk", games: "The Indigo Disk", lines: [
        { type: "Shop", place: "Blueberry Academy", detail: "School Store · 300 BP" },
        { type: "Crafting", place: "Item Printer" },
      ] },
    ],
  },
};
