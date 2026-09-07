// TM / TR / HM data, keyed by the machine's item slug ("tm01", "hm05").
// Written by tools/populate_from_csv.js --tables items from csv/machines*.csv.
//
//   "tm01": [ { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", move: "Mega Punch" }, ... ]
//
// One entry per distinct move the machine teaches, over every version group
// that teaches it — a machine number is reused for a different move in most
// generations, which is why the Bag screen's icon (resolved from the move's
// TYPE) is game-dependent. `move` is a data/moves.js key.
//
// VERSION_GROUPS at the bottom is the Bag screen's game-selector option
// list: every version group the item/machine data actually carries an entry
// for, in release order, with the generation app.js groups its <optgroup>s
// by. Derived from the data on every run, never hand-maintained.

var MACHINES = {
  "hm01": [
    { vg: ["red-blue", "yellow", "gold-silver", "crystal", "ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Red/Blue, Yellow, Gold/Silver, Crystal, Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", move: "Cut" },
  ],
  "hm02": [
    { vg: ["red-blue", "yellow", "gold-silver", "crystal", "ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Red/Blue, Yellow, Gold/Silver, Crystal, Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", move: "Fly" },
  ],
  "hm03": [
    { vg: ["red-blue", "yellow", "gold-silver", "crystal", "ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Red/Blue, Yellow, Gold/Silver, Crystal, Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", move: "Surf" },
  ],
  "hm04": [
    { vg: ["red-blue", "yellow", "gold-silver", "crystal", "ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Red/Blue, Yellow, Gold/Silver, Crystal, Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", move: "Strength" },
  ],
  "hm05": [
    { vg: ["red-blue", "yellow", "gold-silver", "crystal", "ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen"], games: "Red/Blue, Yellow, Gold/Silver, Crystal, Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen", move: "Flash" },
    { vg: ["diamond-pearl", "platinum", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, Brilliant Diamond/Shining Pearl", move: "Defog" },
    { vg: ["heartgold-soulsilver"], games: "HeartGold/SoulSilver", move: "Whirlpool" },
    { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire", move: "Waterfall" },
  ],
  "hm06": [
    { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", move: "Whirlpool" },
    { vg: ["ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", move: "Rock Smash" },
    { vg: ["black-white", "black-2-white-2"], games: "Black/White, Black 2/White 2", move: "Dive" },
  ],
  "hm07": [
    { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", move: "Waterfall" },
    { vg: ["omega-ruby-alpha-sapphire"], games: "Omega Ruby/Alpha Sapphire", move: "Dive" },
  ],
  "hm08": [
    { vg: ["ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen"], games: "Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen", move: "Dive" },
    { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", move: "Rock Climb" },
  ],
  "tm00": [
    { vg: ["sword-shield", "scarlet-violet"], games: "Sword/Shield, Scarlet/Violet", move: "Mega Punch" },
  ],
  "tm01": [
    { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", move: "Mega Punch" },
    { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", move: "Dynamic Punch" },
    { vg: ["ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver", move: "Focus Punch" },
    { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire", move: "Hone Claws" },
    { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", move: "Work Up" },
    { vg: ["lets-go-pikachu-lets-go-eevee", "legends-za"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!, Legends: Z-A", move: "Headbutt" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Mega Kick" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Take Down" },
  ],
  "tm02": [
    { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", move: "Razor Wind" },
    { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", move: "Headbutt" },
    { vg: ["ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "legends-za"], games: "Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Legends: Z-A", move: "Dragon Claw" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Taunt" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Pay Day" },
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Charm" },
  ],
  "tm03": [
    { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", move: "Swords Dance" },
    { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", move: "Curse" },
    { vg: ["ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", move: "Water Pulse" },
    { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "legends-za"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Legends: Z-A", move: "Psyshock" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Helping Hand" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Fire Punch" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Fake Tears" },
  ],
  "tm04": [
    { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", move: "Whirlwind" },
    { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", move: "Rollout" },
    { vg: ["ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", move: "Calm Mind" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Teleport" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Ice Punch" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Agility" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Rock Smash" },
  ],
  "tm05": [
    { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", move: "Mega Kick" },
    { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "legends-za"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Legends: Z-A", move: "Roar" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Rest" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Thunder Punch" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Mud-Slap" },
  ],
  "tm06": [
    { vg: ["red-blue", "yellow", "gold-silver", "crystal", "ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Red/Blue, Yellow, Gold/Silver, Crystal, Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", move: "Toxic" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Light Screen" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Fly" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Scary Face" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Calm Mind" },
  ],
  "tm07": [
    { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", move: "Horn Drill" },
    { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", move: "Zap Cannon" },
    { vg: ["ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", move: "Hail" },
    { vg: ["lets-go-pikachu-lets-go-eevee", "scarlet-violet", "the-indigo-disk"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!, Scarlet/Violet, The Indigo Disk", move: "Protect" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Pin Missile" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Toxic" },
  ],
  "tm08": [
    { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", move: "Body Slam" },
    { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", move: "Rock Smash" },
    { vg: ["ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", move: "Bulk Up" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Substitute" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Hyper Beam" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Fire Fang" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Thunder Wave" },
  ],
  "tm09": [
    { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", move: "Take Down" },
    { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", move: "Psych Up" },
    { vg: ["ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver", move: "Bullet Seed" },
    { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", move: "Venoshock" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Reflect" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Giga Impact" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Thunder Fang" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Flip Turn" },
  ],
  "tm10": [
    { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", move: "Double-Edge" },
    { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", move: "Hidden Power" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Dig" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Magical Leaf" },
    { vg: ["brilliant-diamond-shining-pearl"], games: "Brilliant Diamond/Shining Pearl", move: "Work Up" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Ice Fang" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Brick Break" },
  ],
  "tm100": [
    { vg: ["x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", move: "Confide" },
    { vg: ["brilliant-diamond-shining-pearl"], games: "Brilliant Diamond/Shining Pearl", move: "Rock Climb" },
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Dragon Dance" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Gunk Shot" },
  ],
  "tm101": [
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Power Gem" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Electroweb" },
  ],
  "tm102": [
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Gunk Shot" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Focus Blast" },
  ],
  "tm103": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Substitute" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Work Up" },
  ],
  "tm104": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Iron Defense" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Flare Blitz" },
  ],
  "tm105": [
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "X-Scissor" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Blizzard" },
  ],
  "tm106": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Drill Run" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Thunder" },
  ],
  "tm107": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Will-O-Wisp" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Close Combat" },
  ],
  "tm108": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Crunch" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Comet Punch" },
  ],
  "tm109": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Trick" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Facade" },
  ],
  "tm11": [
    { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", move: "Bubble Beam" },
    { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", move: "Sunny Day" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Will-O-Wisp" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Solar Beam" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Water Pulse" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Bulk Up" },
  ],
  "tm110": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Liquidation" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Chilling Water" },
  ],
  "tm111": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Giga Drain" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Sing" },
  ],
  "tm112": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Aura Sphere" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Acid Spray" },
  ],
  "tm113": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Tailwind" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Low Sweep" },
  ],
  "tm114": [
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Shadow Ball" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Flame Charge" },
  ],
  "tm115": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Dragon Pulse" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Trailblaze" },
  ],
  "tm116": [
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Stealth Rock" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Pay Day" },
  ],
  "tm117": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Hyper Voice" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Silver Wind" },
  ],
  "tm118": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Heat Wave" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Shadow Punch" },
  ],
  "tm119": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Energy Ball" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Ominous Wind" },
  ],
  "tm12": [
    { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", move: "Water Gun" },
    { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", move: "Sweet Scent" },
    { vg: ["ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", move: "Taunt" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Facade" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Solar Blade" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Low Kick" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Rock Slide" },
  ],
  "tm120": [
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Psychic" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Ancient Power" },
  ],
  "tm121": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Heavy Slam" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Torment" },
  ],
  "tm122": [
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Encore" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "False Swipe" },
  ],
  "tm123": [
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Surf" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Poison Fang" },
  ],
  "tm124": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Ice Spinner" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Psychic Fangs" },
  ],
  "tm125": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Flamethrower" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Mimic" },
  ],
  "tm126": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Thunderbolt" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Magnet Bomb" },
  ],
  "tm127": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Play Rough" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Dream Eater" },
  ],
  "tm128": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Amnesia" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Seed Bomb" },
  ],
  "tm129": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Calm Mind" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Circle Throw" },
  ],
  "tm13": [
    { vg: ["red-blue", "yellow", "ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl", "legends-za"], games: "Red/Blue, Yellow, Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl, Legends: Z-A", move: "Ice Beam" },
    { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", move: "Snore" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Brick Break" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Fire Spin" },
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Acid Spray" },
  ],
  "tm130": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Helping Hand" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Charge Beam" },
  ],
  "tm131": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Pollen Puff" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Drain Punch" },
  ],
  "tm132": [
    { vg: ["scarlet-violet", "the-teal-mask"], games: "Scarlet/Violet, The Teal Mask", move: "Baton Pass" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Double Hit" },
  ],
  "tm133": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Earth Power" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Blaze Kick" },
  ],
  "tm134": [
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Reversal" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Dual Wingbeat" },
  ],
  "tm135": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Ice Beam" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Dual Chop" },
  ],
  "tm136": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Electric Terrain" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Scorching Sands" },
  ],
  "tm137": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Grassy Terrain" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Storm Throw" },
  ],
  "tm138": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Psychic Terrain" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Frost Breath" },
  ],
  "tm139": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Misty Terrain" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Swagger" },
  ],
  "tm14": [
    { vg: ["red-blue", "yellow", "gold-silver", "crystal", "ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Red/Blue, Yellow, Gold/Silver, Crystal, Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", move: "Blizzard" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Fly" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Thunder Wave" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Acrobatics" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Fire Fang" },
  ],
  "tm140": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Nasty Plot" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Muddy Water" },
  ],
  "tm141": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Fire Blast" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Fake Out" },
  ],
  "tm142": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Hydro Pump" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "First Impression" },
  ],
  "tm143": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Blizzard" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Scale Shot" },
  ],
  "tm144": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Fire Pledge" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Triple Axel" },
  ],
  "tm145": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Water Pledge" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Razor Wind" },
  ],
  "tm146": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Grass Pledge" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Skull Bash" },
  ],
  "tm147": [
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Wild Charge" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Tri Attack" },
  ],
  "tm148": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Sludge Bomb" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Scald" },
  ],
  "tm149": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Earthquake" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Icicle Spear" },
  ],
  "tm15": [
    { vg: ["red-blue", "yellow", "gold-silver", "crystal", "ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Red/Blue, Yellow, Gold/Silver, Crystal, Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", move: "Hyper Beam" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Seismic Toss" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Dig" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Struggle Bug" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Ice Fang" },
  ],
  "tm150": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Stone Edge" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Vacuum Wave" },
  ],
  "tm151": [
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Phantom Force" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Petal Dance" },
  ],
  "tm152": [
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Giga Impact" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Solar Blade" },
  ],
  "tm153": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Blast Burn" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Sky Attack" },
  ],
  "tm154": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Hydro Cannon" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Fissure" },
  ],
  "tm155": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Frenzy Plant" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Sheer Cold" },
  ],
  "tm156": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Outrage" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Meteor Beam" },
  ],
  "tm157": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Overheat" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Steel Beam" },
  ],
  "tm158": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Focus Blast" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Blast Burn" },
  ],
  "tm159": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Leaf Storm" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Hydro Cannon" },
  ],
  "tm16": [
    { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", move: "Pay Day" },
    { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", move: "Icy Wind" },
    { vg: ["ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl", "legends-za"], games: "Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl, Legends: Z-A", move: "Light Screen" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Thunder Wave" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Screech" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Psybeam" },
  ],
  "tm160": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Hurricane" },
    { vg: ["legends-za", "mega-dimension"], games: "Legends: Z-A, Mega Dimension", move: "Frenzy Plant" },
  ],
  "tm161": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Trick Room" },
  ],
  "tm162": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Bug Buzz" },
  ],
  "tm163": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Hyper Beam" },
  ],
  "tm164": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Brave Bird" },
  ],
  "tm165": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Flare Blitz" },
  ],
  "tm166": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Thunder" },
  ],
  "tm167": [
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Close Combat" },
  ],
  "tm168": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Solar Beam" },
  ],
  "tm169": [
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Draco Meteor" },
  ],
  "tm17": [
    { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", move: "Submission" },
    { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl", "legends-za"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl, Legends: Z-A", move: "Protect" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Dragon Tail" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Light Screen" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Confuse Ray" },
  ],
  "tm170": [
    { vg: ["scarlet-violet", "the-teal-mask"], games: "Scarlet/Violet, The Teal Mask", move: "Steel Beam" },
  ],
  "tm171": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Tera Blast" },
  ],
  "tm172": [
    { vg: ["scarlet-violet", "the-teal-mask"], games: "Scarlet/Violet, The Teal Mask", move: "Roar" },
  ],
  "tm173": [
    { vg: ["scarlet-violet", "the-teal-mask"], games: "Scarlet/Violet, The Teal Mask", move: "Charge" },
  ],
  "tm174": [
    { vg: ["scarlet-violet", "the-teal-mask", "the-indigo-disk"], games: "Scarlet/Violet, The Teal Mask, The Indigo Disk", move: "Haze" },
  ],
  "tm175": [
    { vg: ["scarlet-violet", "the-teal-mask"], games: "Scarlet/Violet, The Teal Mask", move: "Toxic" },
  ],
  "tm176": [
    { vg: ["scarlet-violet", "the-teal-mask"], games: "Scarlet/Violet, The Teal Mask", move: "Sand Tomb" },
  ],
  "tm177": [
    { vg: ["scarlet-violet", "the-teal-mask"], games: "Scarlet/Violet, The Teal Mask", move: "Spite" },
  ],
  "tm178": [
    { vg: ["scarlet-violet", "the-teal-mask"], games: "Scarlet/Violet, The Teal Mask", move: "Gravity" },
  ],
  "tm179": [
    { vg: ["scarlet-violet", "the-teal-mask"], games: "Scarlet/Violet, The Teal Mask", move: "Smack Down" },
  ],
  "tm18": [
    { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", move: "Counter" },
    { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", move: "Rain Dance" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "U-turn" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Reflect" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Thief" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Power-Up Punch" },
  ],
  "tm180": [
    { vg: ["scarlet-violet", "the-teal-mask"], games: "Scarlet/Violet, The Teal Mask", move: "Gyro Ball" },
  ],
  "tm181": [
    { vg: ["scarlet-violet", "the-teal-mask", "the-indigo-disk"], games: "Scarlet/Violet, The Teal Mask, The Indigo Disk", move: "Knock Off" },
  ],
  "tm182": [
    { vg: ["scarlet-violet", "the-teal-mask"], games: "Scarlet/Violet, The Teal Mask", move: "Bug Bite" },
  ],
  "tm183": [
    { vg: ["scarlet-violet", "the-teal-mask"], games: "Scarlet/Violet, The Teal Mask", move: "Super Fang" },
  ],
  "tm184": [
    { vg: ["scarlet-violet", "the-teal-mask"], games: "Scarlet/Violet, The Teal Mask", move: "Vacuum Wave" },
  ],
  "tm185": [
    { vg: ["scarlet-violet", "the-teal-mask", "the-indigo-disk"], games: "Scarlet/Violet, The Teal Mask, The Indigo Disk", move: "Lunge" },
  ],
  "tm186": [
    { vg: ["scarlet-violet", "the-teal-mask", "the-indigo-disk"], games: "Scarlet/Violet, The Teal Mask, The Indigo Disk", move: "High Horsepower" },
  ],
  "tm187": [
    { vg: ["scarlet-violet", "the-teal-mask", "the-indigo-disk"], games: "Scarlet/Violet, The Teal Mask, The Indigo Disk", move: "Icicle Spear" },
  ],
  "tm188": [
    { vg: ["scarlet-violet", "the-teal-mask", "the-indigo-disk"], games: "Scarlet/Violet, The Teal Mask, The Indigo Disk", move: "Scald" },
  ],
  "tm189": [
    { vg: ["scarlet-violet", "the-teal-mask"], games: "Scarlet/Violet, The Teal Mask", move: "Heat Crash" },
  ],
  "tm19": [
    { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", move: "Seismic Toss" },
    { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", move: "Giga Drain" },
    { vg: ["black-white", "black-2-white-2"], games: "Black/White, Black 2/White 2", move: "Telekinesis" },
    { vg: ["x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", move: "Roost" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Iron Tail" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Safeguard" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Disarming Voice" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Power Gem" },
  ],
  "tm190": [
    { vg: ["scarlet-violet", "the-teal-mask", "the-indigo-disk"], games: "Scarlet/Violet, The Teal Mask, The Indigo Disk", move: "Solar Blade" },
  ],
  "tm191": [
    { vg: ["scarlet-violet", "the-teal-mask"], games: "Scarlet/Violet, The Teal Mask", move: "Uproar" },
  ],
  "tm192": [
    { vg: ["scarlet-violet", "the-teal-mask"], games: "Scarlet/Violet, The Teal Mask", move: "Focus Punch" },
  ],
  "tm193": [
    { vg: ["scarlet-violet", "the-teal-mask", "the-indigo-disk"], games: "Scarlet/Violet, The Teal Mask, The Indigo Disk", move: "Weather Ball" },
  ],
  "tm194": [
    { vg: ["scarlet-violet", "the-teal-mask", "the-indigo-disk"], games: "Scarlet/Violet, The Teal Mask, The Indigo Disk", move: "Grassy Glide" },
  ],
  "tm195": [
    { vg: ["scarlet-violet", "the-teal-mask"], games: "Scarlet/Violet, The Teal Mask", move: "Burning Jealousy" },
  ],
  "tm196": [
    { vg: ["scarlet-violet", "the-teal-mask", "the-indigo-disk"], games: "Scarlet/Violet, The Teal Mask, The Indigo Disk", move: "Flip Turn" },
  ],
  "tm197": [
    { vg: ["scarlet-violet", "the-teal-mask", "the-indigo-disk"], games: "Scarlet/Violet, The Teal Mask, The Indigo Disk", move: "Dual Wingbeat" },
  ],
  "tm198": [
    { vg: ["scarlet-violet", "the-teal-mask"], games: "Scarlet/Violet, The Teal Mask", move: "Poltergeist" },
  ],
  "tm199": [
    { vg: ["scarlet-violet", "the-teal-mask"], games: "Scarlet/Violet, The Teal Mask", move: "Lash Out" },
  ],
  "tm20": [
    { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", move: "Rage" },
    { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", move: "Endure" },
    { vg: ["ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", move: "Safeguard" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Dark Pulse" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Self-Destruct" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Trailblaze" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Play Rough" },
  ],
  "tm200": [
    { vg: ["scarlet-violet", "the-teal-mask", "the-indigo-disk"], games: "Scarlet/Violet, The Teal Mask, The Indigo Disk", move: "Scale Shot" },
  ],
  "tm201": [
    { vg: ["scarlet-violet", "the-teal-mask", "the-indigo-disk"], games: "Scarlet/Violet, The Teal Mask, The Indigo Disk", move: "Misty Explosion" },
  ],
  "tm202": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Pain Split" },
  ],
  "tm203": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Psych Up" },
  ],
  "tm204": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Double-Edge" },
  ],
  "tm205": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Endeavor" },
  ],
  "tm206": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Petal Blizzard" },
  ],
  "tm207": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Temper Flare" },
  ],
  "tm208": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Whirlpool" },
  ],
  "tm209": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Muddy Water" },
  ],
  "tm21": [
    { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", move: "Mega Drain" },
    { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", move: "Frustration" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Foul Play" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Rest" },
    { vg: ["brilliant-diamond-shining-pearl"], games: "Brilliant Diamond/Shining Pearl", move: "Dazzling Gleam" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Pounce" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Thunder Fang" },
  ],
  "tm210": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Supercell Slam" },
  ],
  "tm211": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Electroweb" },
  ],
  "tm212": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Triple Axel" },
  ],
  "tm213": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Coaching" },
  ],
  "tm214": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Sludge Wave" },
  ],
  "tm215": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Scorching Sands" },
  ],
  "tm216": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Feather Dance" },
  ],
  "tm217": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Future Sight" },
  ],
  "tm218": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Expanding Force" },
  ],
  "tm219": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Skitter Smack" },
  ],
  "tm22": [
    { vg: ["red-blue", "yellow", "gold-silver", "crystal", "ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Red/Blue, Yellow, Gold/Silver, Crystal, Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", move: "Solar Beam" },
    { vg: ["lets-go-pikachu-lets-go-eevee", "sword-shield"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!, Sword/Shield", move: "Rock Slide" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Chilling Water" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Aerial Ace" },
  ],
  "tm220": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Meteor Beam" },
  ],
  "tm221": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Throat Chop" },
  ],
  "tm222": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Breaking Swipe" },
  ],
  "tm223": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Metal Sound" },
  ],
  "tm224": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Curse" },
  ],
  "tm225": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Hard Press" },
  ],
  "tm226": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Dragon Cheer" },
  ],
  "tm227": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Alluring Voice" },
  ],
  "tm228": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Psychic Noise" },
  ],
  "tm229": [
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Upper Hand" },
  ],
  "tm23": [
    { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", move: "Dragon Rage" },
    { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", move: "Iron Tail" },
    { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", move: "Smack Down" },
    { vg: ["lets-go-pikachu-lets-go-eevee", "legends-za"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!, Legends: Z-A", move: "Thunder Punch" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Thief" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Charge Beam" },
  ],
  "tm24": [
    { vg: ["red-blue", "yellow", "ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Red/Blue, Yellow, Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", move: "Thunderbolt" },
    { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", move: "Dragon Breath" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "X-Scissor" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Snore" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Fire Spin" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Ice Punch" },
  ],
  "tm25": [
    { vg: ["red-blue", "yellow", "gold-silver", "crystal", "ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Red/Blue, Yellow, Gold/Silver, Crystal, Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", move: "Thunder" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Waterfall" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Protect" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Facade" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Crunch" },
  ],
  "tm26": [
    { vg: ["red-blue", "yellow", "gold-silver", "crystal", "ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Red/Blue, Yellow, Gold/Silver, Crystal, Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", move: "Earthquake" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Poison Jab" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Scary Face" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Poison Tail" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Energy Ball" },
  ],
  "tm27": [
    { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", move: "Fissure" },
    { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", move: "Return" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Toxic" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Icy Wind" },
    { vg: ["brilliant-diamond-shining-pearl"], games: "Brilliant Diamond/Shining Pearl", move: "Low Sweep" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Aerial Ace" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Swift" },
  ],
  "tm28": [
    { vg: ["red-blue", "yellow", "gold-silver", "crystal", "ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "legends-za"], games: "Red/Blue, Yellow, Gold/Silver, Crystal, Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Legends: Z-A", move: "Dig" },
    { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", move: "Leech Life" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Tri Attack" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Giga Drain" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Bulldoze" },
  ],
  "tm29": [
    { vg: ["red-blue", "yellow", "gold-silver", "crystal", "ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Red/Blue, Yellow, Gold/Silver, Crystal, Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", move: "Psychic" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Scald" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Charm" },
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Hex" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Fire Punch" },
  ],
  "tm30": [
    { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", move: "Teleport" },
    { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", move: "Shadow Ball" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Bulk Up" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Steel Wing" },
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Snarl" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Swords Dance" },
  ],
  "tm31": [
    { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", move: "Mimic" },
    { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", move: "Mud-Slap" },
    { vg: ["ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", move: "Brick Break" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Fire Punch" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Attract" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Metal Claw" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Reflect" },
  ],
  "tm32": [
    { vg: ["red-blue", "yellow", "gold-silver", "crystal", "ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl", "legends-za"], games: "Red/Blue, Yellow, Gold/Silver, Crystal, Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl, Legends: Z-A", move: "Double Team" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Dazzling Gleam" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Sandstorm" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Swift" },
  ],
  "tm33": [
    { vg: ["red-blue", "yellow", "ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Red/Blue, Yellow, Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", move: "Reflect" },
    { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", move: "Ice Punch" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Calm Mind" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Rain Dance" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Magical Leaf" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Body Slam" },
  ],
  "tm34": [
    { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", move: "Bide" },
    { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", move: "Swagger" },
    { vg: ["ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver", move: "Shock Wave" },
    { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", move: "Sludge Wave" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Dragon Pulse" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Sunny Day" },
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Icy Wind" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Night Slash" },
  ],
  "tm35": [
    { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", move: "Metronome" },
    { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", move: "Sleep Talk" },
    { vg: ["ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", move: "Flamethrower" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Ice Punch" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Hail" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Mud Shot" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Endure" },
  ],
  "tm36": [
    { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", move: "Self-Destruct" },
    { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", move: "Sludge Bomb" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Thunderbolt" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Whirlpool" },
    { vg: ["scarlet-violet", "legends-za"], games: "Scarlet/Violet, Legends: Z-A", move: "Rock Tomb" },
  ],
  "tm37": [
    { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", move: "Egg Bomb" },
    { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", move: "Sandstorm" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Flamethrower" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Beat Up" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Draining Kiss" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Stealth Rock" },
  ],
  "tm38": [
    { vg: ["red-blue", "yellow", "gold-silver", "crystal", "ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "legends-za"], games: "Red/Blue, Yellow, Gold/Silver, Crystal, Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Legends: Z-A", move: "Fire Blast" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Thunder" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Will-O-Wisp" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Flame Charge" },
  ],
  "tm39": [
    { vg: ["red-blue", "yellow", "gold-silver", "crystal"], games: "Red/Blue, Yellow, Gold/Silver, Crystal", move: "Swift" },
    { vg: ["ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", move: "Rock Tomb" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Outrage" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Facade" },
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Low Sweep" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Discharge" },
  ],
  "tm40": [
    { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", move: "Skull Bash" },
    { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", move: "Defense Curl" },
    { vg: ["ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", move: "Aerial Ace" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Psychic" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Swift" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Air Cutter" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Bullet Seed" },
  ],
  "tm41": [
    { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", move: "Soft-Boiled" },
    { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", move: "Thunder Punch" },
    { vg: ["ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", move: "Torment" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Earthquake" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Helping Hand" },
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Stored Power" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Water Pulse" },
  ],
  "tm42": [
    { vg: ["red-blue", "yellow", "gold-silver", "crystal"], games: "Red/Blue, Yellow, Gold/Silver, Crystal", move: "Dream Eater" },
    { vg: ["ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", move: "Facade" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Self-Destruct" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Revenge" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Night Shade" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Giga Drain" },
  ],
  "tm43": [
    { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", move: "Sky Attack" },
    { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", move: "Detect" },
    { vg: ["ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver", move: "Secret Power" },
    { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", move: "Flame Charge" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Shadow Ball" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Brick Break" },
    { vg: ["brilliant-diamond-shining-pearl"], games: "Brilliant Diamond/Shining Pearl", move: "Volt Switch" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Fling" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Fly" },
  ],
  "tm44": [
    { vg: ["red-blue", "yellow", "gold-silver", "crystal", "ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Red/Blue, Yellow, Gold/Silver, Crystal, Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", move: "Rest" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Play Rough" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Imprison" },
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Dragon Tail" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Hyper Beam" },
  ],
  "tm45": [
    { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", move: "Thunder Wave" },
    { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", move: "Attract" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Solar Beam" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Dive" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Venoshock" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Knock Off" },
  ],
  "tm46": [
    { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", move: "Psywave" },
    { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", move: "Thief" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Fire Blast" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Weather Ball" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Avalanche" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Mud Shot" },
  ],
  "tm47": [
    { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", move: "Explosion" },
    { vg: ["gold-silver", "crystal", "ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Gold/Silver, Crystal, Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", move: "Steel Wing" },
    { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", move: "Low Sweep" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Surf" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Fake Tears" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Endure" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Agility" },
  ],
  "tm48": [
    { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", move: "Rock Slide" },
    { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", move: "Fire Punch" },
    { vg: ["ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver", move: "Skill Swap" },
    { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", move: "Round" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Hyper Beam" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Rock Tomb" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Volt Switch" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Self-Destruct" },
  ],
  "tm49": [
    { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", move: "Tri Attack" },
    { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", move: "Fury Cutter" },
    { vg: ["ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver", move: "Snatch" },
    { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", move: "Echoed Voice" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Superpower" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Sand Tomb" },
    { vg: ["brilliant-diamond-shining-pearl"], games: "Brilliant Diamond/Shining Pearl", move: "Scald" },
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Sunny Day" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Icy Wind" },
  ],
  "tm50": [
    { vg: ["red-blue", "yellow"], games: "Red/Blue, Yellow", move: "Substitute" },
    { vg: ["gold-silver", "crystal"], games: "Gold/Silver, Crystal", move: "Nightmare" },
    { vg: ["ruby-sapphire", "emerald", "colosseum", "xd", "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl", "legends-za"], games: "Ruby/Sapphire, Emerald, Colosseum, XD, FireRed/LeafGreen, Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl, Legends: Z-A", move: "Overheat" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Roost" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Bullet Seed" },
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Rain Dance" },
  ],
  "tm51": [
    { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", move: "Roost" },
    { vg: ["black-white", "black-2-white-2"], games: "Black/White, Black 2/White 2", move: "Ally Switch" },
    { vg: ["x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", move: "Steel Wing" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Blizzard" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Icicle Spear" },
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Sandstorm" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Safeguard" },
  ],
  "tm52": [
    { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", move: "Focus Blast" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Sludge Bomb" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Bounce" },
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Snowscape" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Earth Power" },
  ],
  "tm53": [
    { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", move: "Energy Ball" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Mega Drain" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Mud Shot" },
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Smart Strike" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Sludge Bomb" },
  ],
  "tm54": [
    { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", move: "False Swipe" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Flash Cannon" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Rock Blast" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Psyshock" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Draco Meteor" },
  ],
  "tm55": [
    { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "sword-shield", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Sword/Shield, Brilliant Diamond/Shining Pearl", move: "Brine" },
    { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", move: "Scald" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Ice Beam" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Dig" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Giga Impact" },
  ],
  "tm56": [
    { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", move: "Fling" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Stealth Rock" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "U-turn" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Bullet Seed" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Double-Edge" },
  ],
  "tm57": [
    { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", move: "Charge Beam" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Pay Day" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Payback" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "False Swipe" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Will-O-Wisp" },
  ],
  "tm58": [
    { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", move: "Endure" },
    { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", move: "Sky Drop" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Drill Run" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Assurance" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Brick Break" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Iron Head" },
  ],
  "tm59": [
    { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", move: "Dragon Pulse" },
    { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire", move: "Incinerate" },
    { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", move: "Brutal Swing" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Dream Eater" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Fling" },
    { vg: ["scarlet-violet", "the-indigo-disk", "legends-za"], games: "Scarlet/Violet, The Indigo Disk, Legends: Z-A", move: "Zen Headbutt" },
  ],
  "tm60": [
    { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", move: "Drain Punch" },
    { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", move: "Quash" },
    { vg: ["lets-go-pikachu-lets-go-eevee"], games: "Let’s Go, Pikachu!/Let’s Go, Eevee!", move: "Megahorn" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Power Swap" },
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "U-turn" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Future Sight" },
  ],
  "tm61": [
    { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", move: "Will-O-Wisp" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Guard Swap" },
    { vg: ["scarlet-violet", "legends-za"], games: "Scarlet/Violet, Legends: Z-A", move: "Shadow Claw" },
  ],
  "tm62": [
    { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", move: "Silver Wind" },
    { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", move: "Acrobatics" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Speed Swap" },
    { vg: ["brilliant-diamond-shining-pearl"], games: "Brilliant Diamond/Shining Pearl", move: "Bug Buzz" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Foul Play" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Flamethrower" },
  ],
  "tm63": [
    { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", move: "Embargo" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Drain Punch" },
    { vg: ["brilliant-diamond-shining-pearl"], games: "Brilliant Diamond/Shining Pearl", move: "Nasty Plot" },
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Psychic Fangs" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Psychic" },
  ],
  "tm64": [
    { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", move: "Explosion" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Avalanche" },
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Bulk Up" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Solar Beam" },
  ],
  "tm65": [
    { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "sword-shield", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Sword/Shield, Brilliant Diamond/Shining Pearl", move: "Shadow Claw" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Air Slash" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Stone Edge" },
  ],
  "tm66": [
    { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", move: "Payback" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Thunder Fang" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Body Slam" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Volt Switch" },
  ],
  "tm67": [
    { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", move: "Recycle" },
    { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire", move: "Retaliate" },
    { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", move: "Smart Strike" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Ice Fang" },
    { vg: ["scarlet-violet", "the-teal-mask", "the-indigo-disk"], games: "Scarlet/Violet, The Teal Mask, The Indigo Disk", move: "Fire Punch" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Thunderbolt" },
  ],
  "tm68": [
    { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", move: "Giga Impact" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Fire Fang" },
    { vg: ["scarlet-violet", "the-teal-mask", "the-indigo-disk"], games: "Scarlet/Violet, The Teal Mask, The Indigo Disk", move: "Thunder Punch" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Heat Wave" },
  ],
  "tm69": [
    { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", move: "Rock Polish" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Psycho Cut" },
    { vg: ["scarlet-violet", "the-teal-mask", "the-indigo-disk"], games: "Scarlet/Violet, The Teal Mask, The Indigo Disk", move: "Ice Punch" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Earthquake" },
  ],
  "tm70": [
    { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Brilliant Diamond/Shining Pearl", move: "Flash" },
    { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", move: "Aurora Veil" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Trick Room" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Sleep Talk" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Whirlpool" },
  ],
  "tm71": [
    { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", move: "Stone Edge" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Wonder Room" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Seed Bomb" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Hyper Voice" },
  ],
  "tm72": [
    { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", move: "Avalanche" },
    { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", move: "Volt Switch" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Magic Room" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Electro Ball" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Fire Spin" },
  ],
  "tm73": [
    { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", move: "Thunder Wave" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Cross Poison" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Drain Punch" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Surf" },
  ],
  "tm74": [
    { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", move: "Gyro Ball" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Venoshock" },
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Reflect" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Shadow Ball" },
  ],
  "tm75": [
    { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", move: "Swords Dance" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Low Sweep" },
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Light Screen" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Dragon Pulse" },
  ],
  "tm76": [
    { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", move: "Stealth Rock" },
    { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire", move: "Struggle Bug" },
    { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", move: "Fly" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Round" },
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Rock Blast" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Liquidation" },
  ],
  "tm77": [
    { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", move: "Psych Up" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Hex" },
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Waterfall" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Poison Jab" },
  ],
  "tm78": [
    { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", move: "Captivate" },
    { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "legends-za"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Legends: Z-A", move: "Bulldoze" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Acrobatics" },
    { vg: ["brilliant-diamond-shining-pearl"], games: "Brilliant Diamond/Shining Pearl", move: "Snarl" },
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Dragon Claw" },
  ],
  "tm79": [
    { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", move: "Dark Pulse" },
    { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", move: "Frost Breath" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Retaliate" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Dazzling Gleam" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Hurricane" },
  ],
  "tm80": [
    { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", move: "Rock Slide" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Volt Switch" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Metronome" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Iron Defense" },
  ],
  "tm81": [
    { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl", "legends-za"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl, Legends: Z-A", move: "X-Scissor" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Bulldoze" },
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Grass Knot" },
  ],
  "tm82": [
    { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Brilliant Diamond/Shining Pearl", move: "Sleep Talk" },
    { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", move: "Dragon Tail" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Electroweb" },
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Thunder Wave" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "U-turn" },
  ],
  "tm83": [
    { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver", move: "Natural Gift" },
    { vg: ["black-white", "black-2-white-2"], games: "Black/White, Black 2/White 2", move: "Work Up" },
    { vg: ["x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", move: "Infestation" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Razor Shell" },
    { vg: ["brilliant-diamond-shining-pearl"], games: "Brilliant Diamond/Shining Pearl", move: "Bulldoze" },
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Poison Jab" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Nasty Plot" },
  ],
  "tm84": [
    { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", move: "Poison Jab" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Tail Slap" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Stomping Tantrum" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Flash Cannon" },
  ],
  "tm85": [
    { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", move: "Dream Eater" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Snarl" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Rest" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Substitute" },
  ],
  "tm86": [
    { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", move: "Grass Knot" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Phantom Force" },
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Rock Slide" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Wild Charge" },
  ],
  "tm87": [
    { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", move: "Swagger" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Draining Kiss" },
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Taunt" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Iron Tail" },
  ],
  "tm88": [
    { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2", move: "Pluck" },
    { vg: ["x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", move: "Sleep Talk" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Grassy Terrain" },
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Swords Dance" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Spikes" },
  ],
  "tm89": [
    { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", move: "U-turn" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Misty Terrain" },
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Body Press" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Toxic Spikes" },
  ],
  "tm90": [
    { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", move: "Substitute" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Electric Terrain" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Spikes" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Dark Pulse" },
  ],
  "tm91": [
    { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", move: "Flash Cannon" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Psychic Terrain" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Toxic Spikes" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Curse" },
  ],
  "tm92": [
    { vg: ["diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", "brilliant-diamond-shining-pearl"], games: "Diamond/Pearl, Platinum, HeartGold/SoulSilver, Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon, Brilliant Diamond/Shining Pearl", move: "Trick Room" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Mystical Fire" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Imprison" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Dazzling Gleam" },
  ],
  "tm93": [
    { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", move: "Wild Charge" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Eerie Impulse" },
    { vg: ["brilliant-diamond-shining-pearl"], games: "Brilliant Diamond/Shining Pearl", move: "Cut" },
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Flash Cannon" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Outrage" },
  ],
  "tm94": [
    { vg: ["black-white", "black-2-white-2", "x-y"], games: "Black/White, Black 2/White 2, X/Y", move: "Rock Smash" },
    { vg: ["omega-ruby-alpha-sapphire"], games: "Omega Ruby/Alpha Sapphire", move: "Secret Power" },
    { vg: ["sun-moon", "ultra-sun-ultra-moon"], games: "Sun/Moon, Ultra Sun/Ultra Moon", move: "Surf" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "False Swipe" },
    { vg: ["brilliant-diamond-shining-pearl"], games: "Brilliant Diamond/Shining Pearl", move: "Fly" },
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Dark Pulse" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Whirlwind" },
  ],
  "tm95": [
    { vg: ["black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "Black/White, Black 2/White 2, X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", move: "Snarl" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Air Slash" },
    { vg: ["brilliant-diamond-shining-pearl"], games: "Brilliant Diamond/Shining Pearl", move: "Surf" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Leech Life" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Taunt" },
  ],
  "tm96": [
    { vg: ["x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", move: "Nature Power" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Smart Strike" },
    { vg: ["brilliant-diamond-shining-pearl"], games: "Brilliant Diamond/Shining Pearl", move: "Strength" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Eerie Impulse" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Hydro Pump" },
  ],
  "tm97": [
    { vg: ["x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", move: "Dark Pulse" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Brutal Swing" },
    { vg: ["brilliant-diamond-shining-pearl"], games: "Brilliant Diamond/Shining Pearl", move: "Defog" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Fly" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Heal Block" },
  ],
  "tm98": [
    { vg: ["x-y", "omega-ruby-alpha-sapphire"], games: "X/Y, Omega Ruby/Alpha Sapphire", move: "Power-Up Punch" },
    { vg: ["sun-moon", "ultra-sun-ultra-moon", "legends-za"], games: "Sun/Moon, Ultra Sun/Ultra Moon, Legends: Z-A", move: "Waterfall" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Stomping Tantrum" },
    { vg: ["brilliant-diamond-shining-pearl"], games: "Brilliant Diamond/Shining Pearl", move: "Rock Smash" },
    { vg: ["scarlet-violet"], games: "Scarlet/Violet", move: "Skill Swap" },
  ],
  "tm99": [
    { vg: ["x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon"], games: "X/Y, Omega Ruby/Alpha Sapphire, Sun/Moon, Ultra Sun/Ultra Moon", move: "Dazzling Gleam" },
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Breaking Swipe" },
    { vg: ["brilliant-diamond-shining-pearl"], games: "Brilliant Diamond/Shining Pearl", move: "Waterfall" },
    { vg: ["scarlet-violet", "the-indigo-disk"], games: "Scarlet/Violet, The Indigo Disk", move: "Iron Head" },
    { vg: ["legends-za"], games: "Legends: Z-A", move: "Metronome" },
  ],
  "tr00": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Swords Dance" },
  ],
  "tr01": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Body Slam" },
  ],
  "tr02": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Flamethrower" },
  ],
  "tr03": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Hydro Pump" },
  ],
  "tr04": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Surf" },
  ],
  "tr05": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Ice Beam" },
  ],
  "tr06": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Blizzard" },
  ],
  "tr07": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Low Kick" },
  ],
  "tr08": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Thunderbolt" },
  ],
  "tr09": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Thunder" },
  ],
  "tr10": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Earthquake" },
  ],
  "tr11": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Psychic" },
  ],
  "tr12": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Agility" },
  ],
  "tr13": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Focus Energy" },
  ],
  "tr14": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Metronome" },
  ],
  "tr15": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Fire Blast" },
  ],
  "tr16": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Waterfall" },
  ],
  "tr17": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Amnesia" },
  ],
  "tr18": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Leech Life" },
  ],
  "tr19": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Tri Attack" },
  ],
  "tr20": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Substitute" },
  ],
  "tr21": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Reversal" },
  ],
  "tr22": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Sludge Bomb" },
  ],
  "tr23": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Spikes" },
  ],
  "tr24": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Outrage" },
  ],
  "tr25": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Psyshock" },
  ],
  "tr26": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Endure" },
  ],
  "tr27": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Sleep Talk" },
  ],
  "tr28": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Megahorn" },
  ],
  "tr29": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Baton Pass" },
  ],
  "tr30": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Encore" },
  ],
  "tr31": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Iron Tail" },
  ],
  "tr32": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Crunch" },
  ],
  "tr33": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Shadow Ball" },
  ],
  "tr34": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Future Sight" },
  ],
  "tr35": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Uproar" },
  ],
  "tr36": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Heat Wave" },
  ],
  "tr37": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Taunt" },
  ],
  "tr38": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Trick" },
  ],
  "tr39": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Superpower" },
  ],
  "tr40": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Skill Swap" },
  ],
  "tr41": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Blaze Kick" },
  ],
  "tr42": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Hyper Voice" },
  ],
  "tr43": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Overheat" },
  ],
  "tr44": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Cosmic Power" },
  ],
  "tr45": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Muddy Water" },
  ],
  "tr46": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Iron Defense" },
  ],
  "tr47": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Dragon Claw" },
  ],
  "tr48": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Bulk Up" },
  ],
  "tr49": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Calm Mind" },
  ],
  "tr50": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Leaf Blade" },
  ],
  "tr51": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Dragon Dance" },
  ],
  "tr52": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Gyro Ball" },
  ],
  "tr53": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Close Combat" },
  ],
  "tr54": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Toxic Spikes" },
  ],
  "tr55": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Flare Blitz" },
  ],
  "tr56": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Aura Sphere" },
  ],
  "tr57": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Poison Jab" },
  ],
  "tr58": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Dark Pulse" },
  ],
  "tr59": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Seed Bomb" },
  ],
  "tr60": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "X-Scissor" },
  ],
  "tr61": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Bug Buzz" },
  ],
  "tr62": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Dragon Pulse" },
  ],
  "tr63": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Power Gem" },
  ],
  "tr64": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Focus Blast" },
  ],
  "tr65": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Energy Ball" },
  ],
  "tr66": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Brave Bird" },
  ],
  "tr67": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Earth Power" },
  ],
  "tr68": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Nasty Plot" },
  ],
  "tr69": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Zen Headbutt" },
  ],
  "tr70": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Flash Cannon" },
  ],
  "tr71": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Leaf Storm" },
  ],
  "tr72": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Power Whip" },
  ],
  "tr73": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Gunk Shot" },
  ],
  "tr74": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Iron Head" },
  ],
  "tr75": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Stone Edge" },
  ],
  "tr76": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Stealth Rock" },
  ],
  "tr77": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Grass Knot" },
  ],
  "tr78": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Sludge Wave" },
  ],
  "tr79": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Heavy Slam" },
  ],
  "tr80": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Electro Ball" },
  ],
  "tr81": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Foul Play" },
  ],
  "tr82": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Stored Power" },
  ],
  "tr83": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Ally Switch" },
  ],
  "tr84": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Scald" },
  ],
  "tr85": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Work Up" },
  ],
  "tr86": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Wild Charge" },
  ],
  "tr87": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Drill Run" },
  ],
  "tr88": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Heat Crash" },
  ],
  "tr89": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Hurricane" },
  ],
  "tr90": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Play Rough" },
  ],
  "tr91": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Venom Drench" },
  ],
  "tr92": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Dazzling Gleam" },
  ],
  "tr93": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Darkest Lariat" },
  ],
  "tr94": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "High Horsepower" },
  ],
  "tr95": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Throat Chop" },
  ],
  "tr96": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Pollen Puff" },
  ],
  "tr97": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Psychic Fangs" },
  ],
  "tr98": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Liquidation" },
  ],
  "tr99": [
    { vg: ["sword-shield"], games: "Sword/Shield", move: "Body Press" },
  ],
};

var VERSION_GROUPS = [
  { id: "red-blue", name: "Red/Blue", gen: 1 },
  { id: "yellow", name: "Yellow", gen: 1 },
  { id: "gold-silver", name: "Gold/Silver", gen: 2 },
  { id: "crystal", name: "Crystal", gen: 2 },
  { id: "ruby-sapphire", name: "Ruby/Sapphire", gen: 3 },
  { id: "emerald", name: "Emerald", gen: 3 },
  { id: "colosseum", name: "Colosseum", gen: 3 },
  { id: "xd", name: "XD", gen: 3 },
  { id: "firered-leafgreen", name: "FireRed/LeafGreen", gen: 3 },
  { id: "diamond-pearl", name: "Diamond/Pearl", gen: 4 },
  { id: "platinum", name: "Platinum", gen: 4 },
  { id: "heartgold-soulsilver", name: "HeartGold/SoulSilver", gen: 4 },
  { id: "black-white", name: "Black/White", gen: 5 },
  { id: "black-2-white-2", name: "Black 2/White 2", gen: 5 },
  { id: "x-y", name: "X/Y", gen: 6 },
  { id: "omega-ruby-alpha-sapphire", name: "Omega Ruby/Alpha Sapphire", gen: 6 },
  { id: "sun-moon", name: "Sun/Moon", gen: 7 },
  { id: "ultra-sun-ultra-moon", name: "Ultra Sun/Ultra Moon", gen: 7 },
  { id: "lets-go-pikachu-lets-go-eevee", name: "Let’s Go, Pikachu!/Let’s Go, Eevee!", gen: 7 },
  { id: "sword-shield", name: "Sword/Shield", gen: 8 },
  { id: "the-isle-of-armor", name: "The Isle of Armor", gen: 8 },
  { id: "the-crown-tundra", name: "The Crown Tundra", gen: 8 },
  { id: "brilliant-diamond-shining-pearl", name: "Brilliant Diamond/Shining Pearl", gen: 8 },
  { id: "legends-arceus", name: "Legends: Arceus", gen: 8 },
  { id: "scarlet-violet", name: "Scarlet/Violet", gen: 9 },
  { id: "the-teal-mask", name: "The Teal Mask", gen: 9 },
  { id: "the-indigo-disk", name: "The Indigo Disk", gen: 9 },
  { id: "legends-za", name: "Legends: Z-A", gen: 9 },
  { id: "mega-dimension", name: "Mega Dimension", gen: 9 },
];
