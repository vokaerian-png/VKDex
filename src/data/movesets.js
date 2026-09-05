// Which moves each Pokémon can learn, keyed by national dex id. "move"
// strings reference data/moves.js keys.
//
// 1: {
//   levelUp: [{ level: 1, move: "Tackle" }],
//   tm: ["Toxic"],
//   egg: ["Skull Bash"],
//   max: []
// }
//
// "max" (Max Moves) is left empty for every entry -- Dynamax was a Gen 8
// mechanic removed in Gen 9, so there is no current-gen data for it.
// levelUp/tm/egg use the most recent game version that has real data for
// that Pokémon (noted per-entry in HISTORY.md where it isn't Gen 9 itself).

var MOVESETS = {
  1: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Growl"},{level:3,move:"Vine Whip"},{level:6,move:"Growth"},{level:9,move:"Leech Seed"},{level:12,move:"Razor Leaf"},{level:15,move:"Poison Powder"},{level:15,move:"Sleep Powder"},{level:18,move:"Seed Bomb"},{level:21,move:"Take Down"},{level:24,move:"Sweet Scent"},{level:27,move:"Synthesis"},{level:30,move:"Worry Seed"},{level:33,move:"Power Whip"},{level:36,move:"Solar Beam"}],
    tm: ["Swords Dance","Body Slam","Take Down","Double-Edge","Solar Beam","Toxic","Rest","Substitute","Curse","Protect","Sludge Bomb","Giga Drain","Endure","Charm","False Swipe","Sleep Talk","Sunny Day","Facade","Helping Hand","Knock Off","Weather Ball","Bullet Seed","Magical Leaf","Seed Bomb","Energy Ball","Leaf Storm","Grass Knot","Venoshock","Acid Spray","Grass Pledge","Grassy Terrain","Grassy Glide","Tera Blast","Trailblaze"],
    egg: ["Petal Dance","Toxic","Curse","Ingrain"],
    max: []
  },
  2: {
    levelUp: [{level:1,move:"Vine Whip"},{level:1,move:"Tackle"},{level:1,move:"Growl"},{level:1,move:"Growth"},{level:9,move:"Leech Seed"},{level:12,move:"Razor Leaf"},{level:15,move:"Poison Powder"},{level:15,move:"Sleep Powder"},{level:20,move:"Seed Bomb"},{level:25,move:"Take Down"},{level:30,move:"Sweet Scent"},{level:35,move:"Synthesis"},{level:40,move:"Worry Seed"},{level:45,move:"Power Whip"},{level:50,move:"Solar Beam"}],
    tm: ["Swords Dance","Body Slam","Take Down","Double-Edge","Roar","Solar Beam","Toxic","Rest","Substitute","Curse","Protect","Sludge Bomb","Giga Drain","Endure","Charm","False Swipe","Sleep Talk","Sunny Day","Facade","Helping Hand","Knock Off","Weather Ball","Bullet Seed","Magical Leaf","Seed Bomb","Energy Ball","Leaf Storm","Grass Knot","Venoshock","Acid Spray","Grass Pledge","Grassy Terrain","Grassy Glide","Tera Blast","Trailblaze"],
    egg: ["Petal Dance","Toxic","Curse","Ingrain"],
    max: []
  },
  3: {
    levelUp: [{level:0,move:"Petal Blizzard"},{level:1,move:"Growth"},{level:1,move:"Petal Dance"},{level:1,move:"Vine Whip"},{level:1,move:"Tackle"},{level:1,move:"Growl"},{level:9,move:"Leech Seed"},{level:12,move:"Razor Leaf"},{level:15,move:"Sleep Powder"},{level:15,move:"Poison Powder"},{level:20,move:"Seed Bomb"},{level:25,move:"Take Down"},{level:30,move:"Sweet Scent"},{level:37,move:"Synthesis"},{level:44,move:"Worry Seed"},{level:51,move:"Power Whip"},{level:58,move:"Solar Beam"}],
    tm: ["Swords Dance","Body Slam","Take Down","Double-Edge","Roar","Hyper Beam","Solar Beam","Earthquake","Toxic","Amnesia","Rest","Substitute","Curse","Protect","Scary Face","Sludge Bomb","Giga Drain","Endure","Charm","False Swipe","Sleep Talk","Sunny Day","Facade","Helping Hand","Knock Off","Weather Ball","Bullet Seed","Frenzy Plant","Magical Leaf","Poison Jab","Seed Bomb","Energy Ball","Earth Power","Giga Impact","Leaf Storm","Grass Knot","Venoshock","Acid Spray","Grass Pledge","Bulldoze","Petal Blizzard","Grassy Terrain","Stomping Tantrum","Grassy Glide","Tera Blast","Trailblaze"],
    egg: ["Petal Dance","Toxic","Curse","Ingrain"],
    max: []
  },
  4: {
    levelUp: [{level:1,move:"Scratch"},{level:1,move:"Growl"},{level:4,move:"Ember"},{level:8,move:"Smokescreen"},{level:12,move:"Dragon Breath"},{level:17,move:"Fire Fang"},{level:20,move:"Slash"},{level:24,move:"Flamethrower"},{level:28,move:"Scary Face"},{level:32,move:"Fire Spin"},{level:36,move:"Inferno"},{level:40,move:"Flare Blitz"}],
    tm: ["Fire Punch","Thunder Punch","Swords Dance","Body Slam","Take Down","Flamethrower","Fire Spin","Dig","Fire Blast","Swift","Rest","Rock Slide","Substitute","Protect","Scary Face","Outrage","Endure","False Swipe","Sleep Talk","Metal Claw","Sunny Day","Crunch","Heat Wave","Will-O-Wisp","Facade","Helping Hand","Brick Break","Overheat","Rock Tomb","Dragon Claw","Dragon Dance","Fling","Flare Blitz","Dragon Pulse","Focus Blast","Shadow Claw","Fire Fang","Flame Charge","Fire Pledge","Dragon Tail","Tera Blast","Roar","Focus Punch","Weather Ball","Breaking Swipe","Temper Flare"],
    egg: ["Bite","Counter","Belly Drum","Iron Tail","Metal Claw","Ancient Power","Dragon Rush","Dragon Tail"],
    max: []
  },
  5: {
    levelUp: [{level:1,move:"Scratch"},{level:1,move:"Growl"},{level:1,move:"Ember"},{level:1,move:"Smokescreen"},{level:12,move:"Dragon Breath"},{level:19,move:"Fire Fang"},{level:24,move:"Slash"},{level:30,move:"Flamethrower"},{level:37,move:"Scary Face"},{level:48,move:"Inferno"},{level:54,move:"Flare Blitz"}],
    tm: ["Fire Punch","Thunder Punch","Swords Dance","Body Slam","Take Down","Flamethrower","Fire Spin","Dig","Fire Blast","Swift","Rest","Rock Slide","Substitute","Protect","Scary Face","Outrage","Endure","False Swipe","Sleep Talk","Sunny Day","Crunch","Heat Wave","Will-O-Wisp","Facade","Helping Hand","Brick Break","Overheat","Rock Tomb","Dragon Claw","Dragon Dance","Fling","Flare Blitz","Dragon Pulse","Shadow Claw","Fire Fang","Flame Charge","Fire Pledge","Dragon Tail","Tera Blast","Roar","Focus Punch","Weather Ball","Focus Blast","Breaking Swipe","Temper Flare"],
    egg: ["Bite","Counter","Belly Drum","Iron Tail","Metal Claw","Ancient Power","Dragon Rush","Dragon Tail"],
    max: []
  },
  6: {
    levelUp: [{level:0,move:"Air Slash"},{level:1,move:"Scratch"},{level:1,move:"Growl"},{level:1,move:"Ember"},{level:1,move:"Smokescreen"},{level:1,move:"Heat Wave"},{level:1,move:"Dragon Claw"},{level:12,move:"Dragon Breath"},{level:19,move:"Fire Fang"},{level:24,move:"Slash"},{level:30,move:"Flamethrower"},{level:39,move:"Scary Face"},{level:46,move:"Fire Spin"},{level:54,move:"Inferno"},{level:62,move:"Flare Blitz"}],
    tm: ["Fire Punch","Thunder Punch","Swords Dance","Fly","Body Slam","Take Down","Flamethrower","Hyper Beam","Solar Beam","Fire Spin","Earthquake","Dig","Fire Blast","Swift","Rest","Rock Slide","Substitute","Protect","Scary Face","Outrage","Sandstorm","Endure","Sleep Talk","Sunny Day","Crunch","Heat Wave","Will-O-Wisp","Facade","Helping Hand","Brick Break","Blast Burn","Air Cutter","Overheat","Rock Tomb","Aerial Ace","Dragon Claw","Dragon Dance","Fling","Flare Blitz","Air Slash","Dragon Pulse","Focus Blast","Giga Impact","Shadow Claw","Fire Fang","Flame Charge","Acrobatics","Fire Pledge","Bulldoze","Dragon Tail","Hurricane","Tera Blast","Roar","Heat Crash","Focus Punch","Weather Ball","Double-Edge","Breaking Swipe","Scorching Sands","Dragon Cheer","Temper Flare"],
    egg: ["Bite","Counter","Belly Drum","Iron Tail","Metal Claw","Ancient Power","Dragon Rush","Dragon Tail"],
    max: []
  },
  7: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Tail Whip"},{level:3,move:"Water Gun"},{level:6,move:"Withdraw"},{level:9,move:"Rapid Spin"},{level:12,move:"Bite"},{level:15,move:"Water Pulse"},{level:18,move:"Protect"},{level:21,move:"Rain Dance"},{level:24,move:"Aqua Tail"},{level:27,move:"Shell Smash"},{level:30,move:"Iron Defense"},{level:33,move:"Hydro Pump"},{level:36,move:"Wave Crash"}],
    tm: ["Ice Punch","Body Slam","Take Down","Double-Edge","Hydro Pump","Surf","Ice Beam","Blizzard","Dig","Haze","Rest","Substitute","Protect","Icy Wind","Endure","Sleep Talk","Rain Dance","Whirlpool","Facade","Focus Punch","Helping Hand","Brick Break","Weather Ball","Muddy Water","Iron Defense","Mud Shot","Water Pulse","Gyro Ball","Fling","Zen Headbutt","Water Pledge","Liquidation","Flip Turn","Tera Blast","Ice Spinner","Chilling Water"],
    egg: ["Mist","Flail","Mirror Coat","Fake Out","Yawn","Water Spout","Aqua Ring","Aqua Jet","Life Dew"],
    max: []
  },
  8: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Tail Whip"},{level:1,move:"Water Gun"},{level:1,move:"Withdraw"},{level:9,move:"Rapid Spin"},{level:12,move:"Bite"},{level:15,move:"Water Pulse"},{level:20,move:"Protect"},{level:25,move:"Rain Dance"},{level:30,move:"Aqua Tail"},{level:35,move:"Shell Smash"},{level:40,move:"Iron Defense"},{level:45,move:"Hydro Pump"},{level:50,move:"Wave Crash"}],
    tm: ["Ice Punch","Body Slam","Take Down","Double-Edge","Hydro Pump","Surf","Ice Beam","Blizzard","Dig","Haze","Rest","Substitute","Protect","Icy Wind","Endure","Sleep Talk","Rain Dance","Whirlpool","Facade","Focus Punch","Helping Hand","Brick Break","Weather Ball","Muddy Water","Iron Defense","Mud Shot","Water Pulse","Gyro Ball","Fling","Zen Headbutt","Water Pledge","Liquidation","Flip Turn","Tera Blast","Ice Spinner","Chilling Water"],
    egg: ["Mist","Flail","Mirror Coat","Fake Out","Yawn","Water Spout","Aqua Ring","Aqua Jet","Life Dew"],
    max: []
  },
  9: {
    levelUp: [{level:0,move:"Flash Cannon"},{level:1,move:"Tackle"},{level:1,move:"Tail Whip"},{level:1,move:"Water Gun"},{level:1,move:"Withdraw"},{level:9,move:"Rapid Spin"},{level:12,move:"Bite"},{level:15,move:"Water Pulse"},{level:20,move:"Protect"},{level:25,move:"Rain Dance"},{level:30,move:"Aqua Tail"},{level:35,move:"Shell Smash"},{level:42,move:"Iron Defense"},{level:49,move:"Hydro Pump"},{level:56,move:"Wave Crash"}],
    tm: ["Ice Punch","Body Slam","Take Down","Double-Edge","Roar","Hydro Pump","Surf","Ice Beam","Blizzard","Hyper Beam","Earthquake","Dig","Haze","Rest","Rock Slide","Substitute","Protect","Scary Face","Icy Wind","Endure","Sleep Talk","Rain Dance","Crunch","Whirlpool","Facade","Focus Punch","Helping Hand","Brick Break","Hydro Cannon","Weather Ball","Rock Tomb","Muddy Water","Iron Defense","Mud Shot","Water Pulse","Gyro Ball","Fling","Aura Sphere","Dark Pulse","Dragon Pulse","Focus Blast","Giga Impact","Avalanche","Zen Headbutt","Flash Cannon","Smack Down","Water Pledge","Liquidation","Body Press","Flip Turn","Tera Blast","Ice Spinner","Chilling Water"],
    egg: ["Mist","Flail","Mirror Coat","Fake Out","Yawn","Water Spout","Aqua Ring","Aqua Jet","Life Dew"],
    max: []
  },
  10: {
    levelUp: [{level:1,move:"String Shot"},{level:1,move:"Tackle"},{level:9,move:"Bug Bite"}],
    tm: [],
    egg: [],
    max: []
  },
  11: {
    levelUp: [{level:0,move:"Harden"},{level:1,move:"Harden"}],
    tm: [],
    egg: [],
    max: []
  },
  12: {
    levelUp: [{level:0,move:"Gust"},{level:1,move:"Bug Bite"},{level:1,move:"Gust"},{level:1,move:"Harden"},{level:1,move:"String Shot"},{level:1,move:"Tackle"},{level:4,move:"Supersonic"},{level:8,move:"Confusion"},{level:12,move:"Poison Powder"},{level:12,move:"Sleep Powder"},{level:12,move:"Stun Spore"},{level:16,move:"Psybeam"},{level:20,move:"Whirlwind"},{level:24,move:"Air Slash"},{level:28,move:"Safeguard"},{level:32,move:"Bug Buzz"},{level:36,move:"Tailwind"},{level:40,move:"Rage Powder"},{level:44,move:"Quiver Dance"}],
    tm: ["Hyper Beam","Solar Beam","Psychic","Double Team","Dream Eater","Flash","Rest","Substitute","Thief","Protect","Giga Drain","Endure","Swagger","Attract","Sleep Talk","Safeguard","Rain Dance","Sunny Day","Psych Up","Shadow Ball","Facade","Skill Swap","Aerial Ace","Roost","U-turn","Bug Buzz","Energy Ball","Giga Impact","Defog"],
    egg: [],
    max: []
  },
  13: {
    levelUp: [{level:1,move:"Poison Sting"},{level:1,move:"String Shot"},{level:9,move:"Bug Bite"}],
    tm: [],
    egg: [],
    max: []
  },
  14: {
    levelUp: [{level:0,move:"Harden"},{level:1,move:"Harden"}],
    tm: [],
    egg: [],
    max: []
  },
  15: {
    levelUp: [{level:0,move:"Fury Attack"},{level:1,move:"Bug Bite"},{level:1,move:"Fury Attack"},{level:1,move:"Harden"},{level:1,move:"Poison Sting"},{level:1,move:"String Shot"},{level:11,move:"Fury Cutter"},{level:14,move:"Laser Focus"},{level:17,move:"Poison Sting"},{level:20,move:"Focus Energy"},{level:23,move:"Venoshock"},{level:26,move:"Assurance"},{level:29,move:"Toxic Spikes"},{level:32,move:"Pin Missile"},{level:35,move:"Poison Jab"},{level:38,move:"Agility"},{level:41,move:"Endeavor"},{level:44,move:"Fell Stinger"}],
    tm: ["Swords Dance","Cut","Hyper Beam","Solar Beam","Double Team","Flash","Rest","Substitute","Thief","Protect","Sludge Bomb","Giga Drain","Endure","False Swipe","Swagger","Attract","Sleep Talk","Sunny Day","Rock Smash","Facade","Brick Break","Aerial Ace","Roost","U-turn","Payback","Poison Jab","X-Scissor","Giga Impact","Defog"],
    egg: [],
    max: []
  },
  16: {
    levelUp: [{level:1,move:"Tackle"},{level:5,move:"Sand Attack"},{level:9,move:"Gust"},{level:13,move:"Quick Attack"},{level:17,move:"Whirlwind"},{level:21,move:"Twister"},{level:25,move:"Feather Dance"},{level:29,move:"Agility"},{level:33,move:"Wing Attack"},{level:37,move:"Roost"},{level:41,move:"Tailwind"},{level:45,move:"Aerial Ace"},{level:49,move:"Air Slash"},{level:53,move:"Hurricane"}],
    tm: ["Fly","Double Team","Rest","Substitute","Thief","Protect","Endure","Swagger","Steel Wing","Attract","Sleep Talk","Rain Dance","Sunny Day","Facade","Aerial Ace","Roost","Pluck","U-turn","Defog","Work Up"],
    egg: ["Uproar","Air Cutter","Air Slash","Brave Bird"],
    max: []
  },
  17: {
    levelUp: [{level:1,move:"Gust"},{level:1,move:"Sand Attack"},{level:1,move:"Tackle"},{level:5,move:"Sand Attack"},{level:9,move:"Gust"},{level:13,move:"Quick Attack"},{level:17,move:"Whirlwind"},{level:22,move:"Twister"},{level:27,move:"Feather Dance"},{level:32,move:"Agility"},{level:37,move:"Wing Attack"},{level:42,move:"Roost"},{level:47,move:"Tailwind"},{level:52,move:"Aerial Ace"},{level:57,move:"Air Slash"},{level:62,move:"Hurricane"}],
    tm: ["Fly","Double Team","Rest","Substitute","Thief","Protect","Endure","Swagger","Steel Wing","Attract","Sleep Talk","Rain Dance","Sunny Day","Facade","Aerial Ace","Roost","Pluck","U-turn","Defog","Work Up"],
    egg: [],
    max: []
  },
  18: {
    levelUp: [{level:1,move:"Gust"},{level:1,move:"Hurricane"},{level:1,move:"Quick Attack"},{level:1,move:"Sand Attack"},{level:1,move:"Tackle"},{level:5,move:"Sand Attack"},{level:9,move:"Gust"},{level:13,move:"Quick Attack"},{level:17,move:"Whirlwind"},{level:22,move:"Twister"},{level:27,move:"Feather Dance"},{level:32,move:"Agility"},{level:38,move:"Wing Attack"},{level:44,move:"Roost"},{level:50,move:"Tailwind"},{level:56,move:"Aerial Ace"},{level:62,move:"Air Slash"},{level:68,move:"Hurricane"}],
    tm: ["Fly","Hyper Beam","Double Team","Rest","Substitute","Thief","Protect","Endure","Swagger","Steel Wing","Attract","Sleep Talk","Rain Dance","Sunny Day","Facade","Aerial Ace","Roost","Pluck","U-turn","Giga Impact","Defog","Work Up"],
    egg: [],
    max: []
  },
  19: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Tail Whip"},{level:4,move:"Quick Attack"},{level:7,move:"Focus Energy"},{level:10,move:"Bite"},{level:13,move:"Laser Focus"},{level:16,move:"Take Down"},{level:19,move:"Assurance"},{level:22,move:"Crunch"},{level:25,move:"Sucker Punch"},{level:28,move:"Super Fang"},{level:31,move:"Double-Edge"},{level:34,move:"Endeavor"}],
    tm: ["Cut","Ice Beam","Blizzard","Thunderbolt","Thunder Wave","Thunder","Dig","Double Team","Rest","Substitute","Thief","Protect","Sludge Bomb","Endure","Swagger","Attract","Sleep Talk","Iron Tail","Rain Dance","Sunny Day","Shadow Ball","Rock Smash","Facade","Taunt","Shock Wave","Pluck","Grass Knot","Charge Beam","Work Up"],
    egg: ["Bite","Counter","Screech","Fury Swipes","Flame Wheel","Reversal","Uproar","Revenge","Last Resort","Final Gambit"],
    max: []
  },
  20: {
    levelUp: [{level:0,move:"Scary Face"},{level:1,move:"Focus Energy"},{level:1,move:"Quick Attack"},{level:1,move:"Scary Face"},{level:1,move:"Swords Dance"},{level:1,move:"Tackle"},{level:1,move:"Tail Whip"},{level:4,move:"Quick Attack"},{level:7,move:"Focus Energy"},{level:10,move:"Bite"},{level:13,move:"Laser Focus"},{level:16,move:"Take Down"},{level:19,move:"Assurance"},{level:24,move:"Crunch"},{level:29,move:"Sucker Punch"},{level:34,move:"Super Fang"},{level:39,move:"Double-Edge"},{level:44,move:"Endeavor"}],
    tm: ["Swords Dance","Cut","Roar","Ice Beam","Blizzard","Hyper Beam","Strength","Thunderbolt","Thunder Wave","Thunder","Dig","Double Team","Rest","Substitute","Thief","Protect","Sludge Bomb","Endure","Swagger","Attract","Sleep Talk","Iron Tail","Rain Dance","Sunny Day","Shadow Ball","Rock Smash","Facade","Taunt","Shock Wave","Pluck","Giga Impact","Grass Knot","Charge Beam","Work Up"],
    egg: [],
    max: []
  },
  21: {
    levelUp: [{level:1,move:"Growl"},{level:1,move:"Peck"},{level:4,move:"Leer"},{level:8,move:"Assurance"},{level:11,move:"Fury Attack"},{level:15,move:"Aerial Ace"},{level:18,move:"Wing Attack"},{level:22,move:"Take Down"},{level:25,move:"Agility"},{level:29,move:"Focus Energy"},{level:32,move:"Roost"},{level:36,move:"Drill Peck"}],
    tm: ["Fly","Double Team","Rest","Substitute","Thief","Protect","Endure","False Swipe","Swagger","Steel Wing","Attract","Sleep Talk","Rain Dance","Sunny Day","Facade","Aerial Ace","Roost","Pluck","U-turn","Defog","Work Up"],
    egg: ["Whirlwind","Quick Attack","Sky Attack","Tri Attack","Scary Face","Uproar","Feather Dance","Astonish"],
    max: []
  },
  22: {
    levelUp: [{level:1,move:"Drill Run"},{level:1,move:"Growl"},{level:1,move:"Leer"},{level:1,move:"Peck"},{level:1,move:"Pluck"},{level:4,move:"Leer"},{level:8,move:"Assurance"},{level:11,move:"Fury Attack"},{level:15,move:"Aerial Ace"},{level:18,move:"Wing Attack"},{level:23,move:"Take Down"},{level:27,move:"Agility"},{level:32,move:"Focus Energy"},{level:36,move:"Roost"},{level:41,move:"Drill Peck"},{level:45,move:"Drill Run"}],
    tm: ["Fly","Hyper Beam","Double Team","Rest","Substitute","Thief","Protect","Endure","False Swipe","Swagger","Steel Wing","Attract","Sleep Talk","Rain Dance","Sunny Day","Facade","Aerial Ace","Roost","Pluck","U-turn","Giga Impact","Defog","Work Up"],
    egg: [],
    max: []
  },
  23: {
    levelUp: [{level:1,move:"Wrap"},{level:1,move:"Leer"},{level:4,move:"Poison Sting"},{level:9,move:"Bite"},{level:12,move:"Glare"},{level:17,move:"Screech"},{level:20,move:"Acid"},{level:25,move:"Swallow"},{level:25,move:"Stockpile"},{level:25,move:"Spit Up"},{level:28,move:"Acid Spray"},{level:33,move:"Sludge Bomb"},{level:36,move:"Gastro Acid"},{level:38,move:"Belch"},{level:41,move:"Haze"},{level:44,move:"Coil"},{level:49,move:"Gunk Shot"}],
    tm: ["Take Down","Earthquake","Dig","Toxic","Haze","Leech Life","Rest","Rock Slide","Substitute","Thief","Spite","Protect","Scary Face","Sludge Bomb","Mud-Slap","Giga Drain","Endure","Sleep Talk","Rain Dance","Sunny Day","Crunch","Facade","Knock Off","Rock Tomb","Mud Shot","Poison Tail","Toxic Spikes","Poison Jab","Dark Pulse","Seed Bomb","Fire Fang","Gunk Shot","Venoshock","Acid Spray","Snarl","Psychic Fangs","Scale Shot","Lash Out","Tera Blast","Trailblaze","Double-Edge","Sludge Wave","Skitter Smack"],
    egg: ["Spite","Scary Face","Poison Fang","Poison Tail","Sucker Punch","Switcheroo"],
    max: []
  },
  24: {
    levelUp: [{level:0,move:"Crunch"},{level:1,move:"Wrap"},{level:1,move:"Poison Sting"},{level:1,move:"Leer"},{level:1,move:"Bite"},{level:1,move:"Fire Fang"},{level:1,move:"Ice Fang"},{level:1,move:"Thunder Fang"},{level:12,move:"Glare"},{level:17,move:"Screech"},{level:20,move:"Acid"},{level:27,move:"Swallow"},{level:27,move:"Stockpile"},{level:27,move:"Spit Up"},{level:32,move:"Acid Spray"},{level:39,move:"Sludge Bomb"},{level:44,move:"Gastro Acid"},{level:48,move:"Belch"},{level:51,move:"Haze"},{level:56,move:"Coil"},{level:63,move:"Gunk Shot"}],
    tm: ["Body Slam","Take Down","Hyper Beam","Earthquake","Dig","Toxic","Haze","Leech Life","Rest","Rock Slide","Substitute","Thief","Spite","Protect","Scary Face","Sludge Bomb","Mud-Slap","Giga Drain","Endure","Sleep Talk","Rain Dance","Sunny Day","Crunch","Facade","Knock Off","Rock Tomb","Mud Shot","Poison Tail","Toxic Spikes","Poison Jab","Dark Pulse","Seed Bomb","Giga Impact","Thunder Fang","Ice Fang","Fire Fang","Gunk Shot","Venoshock","Acid Spray","Bulldoze","Dragon Tail","Snarl","Psychic Fangs","Stomping Tantrum","Scale Shot","Lash Out","Tera Blast","Trailblaze","Pain Split","Double-Edge","Sludge Wave","Skitter Smack","Throat Chop","Breaking Swipe"],
    egg: ["Spite","Scary Face","Poison Fang","Poison Tail","Sucker Punch","Switcheroo"],
    max: []
  },
  25: {
    levelUp: [{level:1,move:"Nuzzle"},{level:1,move:"Nasty Plot"},{level:1,move:"Charm"},{level:1,move:"Sweet Kiss"},{level:1,move:"Play Nice"},{level:1,move:"Quick Attack"},{level:1,move:"Tail Whip"},{level:1,move:"Thunder Shock"},{level:1,move:"Growl"},{level:4,move:"Thunder Wave"},{level:8,move:"Double Team"},{level:12,move:"Electro Ball"},{level:16,move:"Feint"},{level:20,move:"Spark"},{level:24,move:"Agility"},{level:28,move:"Iron Tail"},{level:32,move:"Discharge"},{level:36,move:"Thunderbolt"},{level:40,move:"Light Screen"},{level:44,move:"Thunder"}],
    tm: ["Thunder Punch","Body Slam","Take Down","Surf","Thunderbolt","Thunder Wave","Thunder","Dig","Agility","Light Screen","Reflect","Swift","Rest","Substitute","Thief","Reversal","Protect","Endure","Charm","Sleep Talk","Encore","Rain Dance","Facade","Helping Hand","Brick Break","Fake Tears","Fling","Nasty Plot","Grass Knot","Charge Beam","Electro Ball","Volt Switch","Wild Charge","Disarming Voice","Draining Kiss","Play Rough","Eerie Impulse","Electric Terrain","Tera Blast","Trailblaze","Charge","Knock Off","Focus Punch","Endeavor","Electroweb","Alluring Voice","Upper Hand"],
    egg: [],
    max: []
  },
  26: {
    levelUp: [{level:0,move:"Thunder Punch"},{level:1,move:"Electro Ball"},{level:1,move:"Discharge"},{level:1,move:"Nasty Plot"},{level:1,move:"Feint"},{level:1,move:"Iron Tail"},{level:1,move:"Spark"},{level:1,move:"Charm"},{level:1,move:"Sweet Kiss"},{level:1,move:"Play Nice"},{level:1,move:"Nuzzle"},{level:1,move:"Quick Attack"},{level:1,move:"Agility"},{level:1,move:"Thunder"},{level:1,move:"Thunder Wave"},{level:1,move:"Thunder Shock"},{level:1,move:"Growl"},{level:1,move:"Tail Whip"},{level:1,move:"Double Team"},{level:1,move:"Light Screen"},{level:5,move:"Thunderbolt"}],
    tm: ["Thunder Punch","Body Slam","Take Down","Surf","Hyper Beam","Thunderbolt","Thunder Wave","Thunder","Dig","Agility","Light Screen","Reflect","Swift","Rest","Substitute","Thief","Reversal","Protect","Endure","Charm","Sleep Talk","Encore","Rain Dance","Facade","Helping Hand","Brick Break","Fling","Focus Blast","Giga Impact","Nasty Plot","Grass Knot","Charge Beam","Electro Ball","Volt Switch","Wild Charge","Disarming Voice","Draining Kiss","Play Rough","Eerie Impulse","Electric Terrain","Tera Blast","Trailblaze","Charge","Knock Off","Focus Punch","Endeavor","Electroweb","Alluring Voice","Upper Hand"],
    egg: [],
    max: []
  },
  27: {
    levelUp: [{level:1,move:"Scratch"},{level:1,move:"Defense Curl"},{level:3,move:"Poison Sting"},{level:6,move:"Sand Attack"},{level:9,move:"Rollout"},{level:12,move:"Fury Cutter"},{level:15,move:"Rapid Spin"},{level:18,move:"Bulldoze"},{level:21,move:"Swift"},{level:24,move:"Fury Swipes"},{level:27,move:"Agility"},{level:30,move:"Slash"},{level:33,move:"Dig"},{level:36,move:"Gyro Ball"},{level:39,move:"Swords Dance"},{level:42,move:"Sandstorm"},{level:45,move:"Earthquake"}],
    tm: ["Swords Dance","Body Slam","Take Down","Low Kick","Earthquake","Dig","Agility","Swift","Amnesia","Leech Life","Rest","Rock Slide","Super Fang","Substitute","Thief","Protect","Mud-Slap","Spikes","Sandstorm","Endure","False Swipe","Sleep Talk","Metal Claw","Sunny Day","Facade","Focus Punch","Brick Break","Knock Off","Rock Tomb","Sand Tomb","Aerial Ace","Mud Shot","Gyro Ball","Fling","Poison Jab","X-Scissor","Earth Power","Shadow Claw","Stone Edge","Stealth Rock","Smack Down","Bulldoze","High Horsepower","Stomping Tantrum","Tera Blast","Double-Edge","Endeavor","Scorching Sands","Throat Chop","Curse"],
    egg: ["Counter","Flail","Mud-Slap","Metal Claw","Night Slash","Hone Claws"],
    max: []
  },
  28: {
    levelUp: [{level:1,move:"Scratch"},{level:1,move:"Crush Claw"},{level:1,move:"Sand Attack"},{level:1,move:"Poison Sting"},{level:1,move:"Defense Curl"},{level:9,move:"Rollout"},{level:12,move:"Fury Cutter"},{level:15,move:"Rapid Spin"},{level:18,move:"Bulldoze"},{level:21,move:"Swift"},{level:26,move:"Fury Swipes"},{level:31,move:"Sand Tomb"},{level:36,move:"Slash"},{level:41,move:"Dig"},{level:46,move:"Gyro Ball"},{level:51,move:"Swords Dance"},{level:56,move:"Sandstorm"},{level:61,move:"Earthquake"}],
    tm: ["Swords Dance","Body Slam","Take Down","Hyper Beam","Low Kick","Earthquake","Dig","Agility","Swift","Amnesia","Leech Life","Rest","Rock Slide","Super Fang","Substitute","Thief","Protect","Mud-Slap","Spikes","Sandstorm","Endure","False Swipe","Sleep Talk","Metal Claw","Sunny Day","Facade","Focus Punch","Brick Break","Knock Off","Rock Tomb","Sand Tomb","Aerial Ace","Mud Shot","Gyro Ball","Fling","Poison Jab","X-Scissor","Focus Blast","Earth Power","Giga Impact","Shadow Claw","Gunk Shot","Stone Edge","Stealth Rock","Smack Down","Bulldoze","Drill Run","High Horsepower","Stomping Tantrum","Tera Blast","Double-Edge","Endeavor","Scorching Sands","Throat Chop","Curse"],
    egg: ["Counter","Flail","Mud-Slap","Metal Claw","Night Slash","Hone Claws"],
    max: []
  },
  29: {
    levelUp: [{level:1,move:"Growl"},{level:1,move:"Poison Sting"},{level:5,move:"Scratch"},{level:10,move:"Tail Whip"},{level:15,move:"Fury Swipes"},{level:20,move:"Toxic Spikes"},{level:25,move:"Double Kick"},{level:30,move:"Bite"},{level:35,move:"Helping Hand"},{level:40,move:"Toxic"},{level:45,move:"Flatter"},{level:50,move:"Crunch"},{level:55,move:"Earth Power"}],
    tm: ["Cut","Ice Beam","Blizzard","Strength","Thunderbolt","Thunder","Dig","Toxic","Double Team","Rest","Substitute","Thief","Protect","Sludge Bomb","Endure","Swagger","Attract","Sleep Talk","Iron Tail","Rain Dance","Sunny Day","Rock Smash","Facade","Aerial Ace","Shock Wave","Water Pulse","Poison Jab","Shadow Claw"],
    egg: ["Take Down","Supersonic","Disable","Counter","Focus Energy","Skull Bash","Charm","Beat Up","Poison Fang","Poison Tail","Venom Drench"],
    max: []
  },
  30: {
    levelUp: [{level:1,move:"Growl"},{level:1,move:"Poison Sting"},{level:1,move:"Scratch"},{level:1,move:"Tail Whip"},{level:15,move:"Fury Swipes"},{level:22,move:"Toxic Spikes"},{level:29,move:"Double Kick"},{level:36,move:"Bite"},{level:43,move:"Helping Hand"},{level:50,move:"Toxic"},{level:57,move:"Flatter"},{level:64,move:"Crunch"},{level:71,move:"Earth Power"}],
    tm: ["Cut","Ice Beam","Blizzard","Strength","Thunderbolt","Thunder","Dig","Toxic","Double Team","Rest","Substitute","Thief","Protect","Sludge Bomb","Endure","Swagger","Attract","Sleep Talk","Iron Tail","Rain Dance","Sunny Day","Rock Smash","Facade","Aerial Ace","Shock Wave","Water Pulse","Poison Jab","Shadow Claw"],
    egg: [],
    max: []
  },
  31: {
    levelUp: [{level:0,move:"Superpower"},{level:1,move:"Bite"},{level:1,move:"Crunch"},{level:1,move:"Double Kick"},{level:1,move:"Earth Power"},{level:1,move:"Flatter"},{level:1,move:"Fury Swipes"},{level:1,move:"Growl"},{level:1,move:"Helping Hand"},{level:1,move:"Poison Sting"},{level:1,move:"Scratch"},{level:1,move:"Sludge Wave"},{level:1,move:"Superpower"},{level:1,move:"Tail Whip"},{level:1,move:"Toxic"},{level:1,move:"Toxic Spikes"}],
    tm: ["Cut","Roar","Flamethrower","Surf","Ice Beam","Blizzard","Hyper Beam","Strength","Thunderbolt","Thunder","Earthquake","Dig","Toxic","Double Team","Fire Blast","Rest","Rock Slide","Substitute","Thief","Protect","Sludge Bomb","Sandstorm","Endure","Swagger","Attract","Sleep Talk","Iron Tail","Rain Dance","Sunny Day","Shadow Ball","Rock Smash","Torment","Facade","Focus Punch","Taunt","Brick Break","Rock Tomb","Aerial Ace","Shock Wave","Water Pulse","Fling","Poison Jab","Dragon Pulse","Focus Blast","Giga Impact","Avalanche","Shadow Claw","Rock Climb","Stone Edge","Stealth Rock","Bulldoze"],
    egg: [],
    max: []
  },
  32: {
    levelUp: [{level:1,move:"Leer"},{level:1,move:"Poison Sting"},{level:5,move:"Peck"},{level:10,move:"Focus Energy"},{level:15,move:"Fury Attack"},{level:20,move:"Toxic Spikes"},{level:25,move:"Double Kick"},{level:30,move:"Horn Attack"},{level:35,move:"Helping Hand"},{level:40,move:"Toxic"},{level:45,move:"Flatter"},{level:50,move:"Poison Jab"},{level:55,move:"Earth Power"}],
    tm: ["Cut","Ice Beam","Blizzard","Strength","Thunderbolt","Thunder","Dig","Toxic","Double Team","Rest","Substitute","Thief","Protect","Sludge Bomb","Endure","Swagger","Attract","Sleep Talk","Iron Tail","Rain Dance","Sunny Day","Rock Smash","Facade","Shock Wave","Water Pulse","Poison Jab","Shadow Claw"],
    egg: ["Horn Drill","Take Down","Thrash","Supersonic","Disable","Counter","Confusion","Amnesia","Beat Up","Poison Tail","Sucker Punch","Head Smash","Venom Drench"],
    max: []
  },
  33: {
    levelUp: [{level:1,move:"Focus Energy"},{level:1,move:"Leer"},{level:1,move:"Peck"},{level:1,move:"Poison Sting"},{level:15,move:"Fury Attack"},{level:22,move:"Toxic Spikes"},{level:29,move:"Double Kick"},{level:36,move:"Horn Attack"},{level:43,move:"Helping Hand"},{level:50,move:"Toxic"},{level:57,move:"Flatter"},{level:64,move:"Poison Jab"},{level:71,move:"Earth Power"}],
    tm: ["Cut","Ice Beam","Blizzard","Strength","Thunderbolt","Thunder","Dig","Toxic","Double Team","Rest","Substitute","Thief","Protect","Sludge Bomb","Endure","Swagger","Attract","Sleep Talk","Iron Tail","Rain Dance","Sunny Day","Rock Smash","Facade","Shock Wave","Water Pulse","Poison Jab","Shadow Claw"],
    egg: [],
    max: []
  },
  34: {
    levelUp: [{level:0,move:"Megahorn"},{level:1,move:"Double Kick"},{level:1,move:"Earth Power"},{level:1,move:"Flatter"},{level:1,move:"Focus Energy"},{level:1,move:"Fury Attack"},{level:1,move:"Helping Hand"},{level:1,move:"Horn Attack"},{level:1,move:"Leer"},{level:1,move:"Megahorn"},{level:1,move:"Peck"},{level:1,move:"Poison Jab"},{level:1,move:"Poison Sting"},{level:1,move:"Sludge Wave"},{level:1,move:"Toxic"},{level:1,move:"Toxic Spikes"}],
    tm: ["Cut","Roar","Flamethrower","Surf","Ice Beam","Blizzard","Hyper Beam","Strength","Thunderbolt","Thunder","Earthquake","Dig","Toxic","Double Team","Fire Blast","Rest","Rock Slide","Substitute","Thief","Protect","Sludge Bomb","Sandstorm","Endure","Swagger","Attract","Sleep Talk","Iron Tail","Rain Dance","Sunny Day","Shadow Ball","Rock Smash","Torment","Facade","Focus Punch","Taunt","Brick Break","Rock Tomb","Shock Wave","Water Pulse","Fling","Poison Jab","Dragon Pulse","Focus Blast","Giga Impact","Avalanche","Shadow Claw","Rock Climb","Stone Edge","Stealth Rock","Bulldoze"],
    egg: [],
    max: []
  },
  35: {
    levelUp: [{level:1,move:"Pound"},{level:1,move:"Growl"},{level:1,move:"Sing"},{level:1,move:"Defense Curl"},{level:1,move:"Disarming Voice"},{level:1,move:"Splash"},{level:1,move:"Sweet Kiss"},{level:1,move:"Charm"},{level:1,move:"Copycat"},{level:4,move:"Stored Power"},{level:8,move:"Encore"},{level:12,move:"After You"},{level:16,move:"Life Dew"},{level:20,move:"Metronome"},{level:24,move:"Moonlight"},{level:28,move:"Gravity"},{level:32,move:"Meteor Mash"},{level:36,move:"Follow Me"},{level:40,move:"Cosmic Power"},{level:44,move:"Moonblast"},{level:48,move:"Healing Wish"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Take Down","Flamethrower","Ice Beam","Blizzard","Psybeam","Solar Beam","Thunderbolt","Thunder Wave","Thunder","Dig","Psychic","Night Shade","Light Screen","Reflect","Metronome","Fire Blast","Swift","Amnesia","Rest","Substitute","Thief","Protect","Icy Wind","Endure","Charm","Sleep Talk","Baton Pass","Encore","Rain Dance","Sunny Day","Shadow Ball","Uproar","Facade","Focus Punch","Helping Hand","Trick","Brick Break","Knock Off","Skill Swap","Imprison","Hyper Voice","Fake Tears","Magical Leaf","Calm Mind","Water Pulse","Gravity","Fling","Drain Punch","Zen Headbutt","Stealth Rock","Grass Knot","Charge Beam","Psyshock","Stored Power","Disarming Voice","Draining Kiss","Misty Terrain","Play Rough","Dazzling Gleam","Misty Explosion","Dual Wingbeat","Tera Blast","Chilling Water","Psych Up","Double-Edge","Endeavor","Meteor Beam","Alluring Voice"],
    egg: ["Present","Wish","Tickle","Heal Pulse"],
    max: []
  },
  36: {
    levelUp: [{level:1,move:"Metronome"},{level:1,move:"Meteor Mash"},{level:1,move:"Moonblast"},{level:1,move:"Life Dew"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Take Down","Flamethrower","Ice Beam","Blizzard","Psybeam","Hyper Beam","Solar Beam","Thunderbolt","Thunder Wave","Thunder","Dig","Psychic","Night Shade","Light Screen","Reflect","Metronome","Fire Blast","Swift","Amnesia","Rest","Substitute","Thief","Protect","Icy Wind","Endure","Charm","Sleep Talk","Baton Pass","Encore","Rain Dance","Sunny Day","Shadow Ball","Uproar","Facade","Focus Punch","Helping Hand","Trick","Brick Break","Knock Off","Skill Swap","Imprison","Hyper Voice","Fake Tears","Magical Leaf","Calm Mind","Water Pulse","Gravity","Fling","Drain Punch","Focus Blast","Giga Impact","Zen Headbutt","Stealth Rock","Grass Knot","Charge Beam","Psyshock","Stored Power","Disarming Voice","Draining Kiss","Misty Terrain","Play Rough","Dazzling Gleam","Misty Explosion","Dual Wingbeat","Tera Blast","Chilling Water","Psych Up","Double-Edge","Endeavor","Future Sight","Meteor Beam","Alluring Voice"],
    egg: ["Pound","Growl","Sing","Defense Curl","Splash","Sweet Kiss","Charm","Present","Encore","Moonlight","Follow Me","Wish","Tickle","Cosmic Power","Gravity","Healing Wish","Copycat","After You","Stored Power","Heal Pulse","Disarming Voice"],
    max: []
  },
  37: {
    levelUp: [{level:1,move:"Tail Whip"},{level:1,move:"Ember"},{level:4,move:"Disable"},{level:8,move:"Quick Attack"},{level:12,move:"Spite"},{level:16,move:"Incinerate"},{level:20,move:"Confuse Ray"},{level:24,move:"Will-O-Wisp"},{level:28,move:"Extrasensory"},{level:32,move:"Flamethrower"},{level:36,move:"Imprison"},{level:40,move:"Fire Spin"},{level:44,move:"Safeguard"},{level:48,move:"Inferno"},{level:52,move:"Fire Blast"}],
    tm: ["Body Slam","Take Down","Roar","Flamethrower","Fire Spin","Dig","Agility","Confuse Ray","Fire Blast","Swift","Rest","Substitute","Spite","Protect","Endure","Charm","Sleep Talk","Baton Pass","Encore","Sunny Day","Heat Wave","Will-O-Wisp","Facade","Helping Hand","Imprison","Weather Ball","Overheat","Flare Blitz","Dark Pulse","Energy Ball","Nasty Plot","Zen Headbutt","Flame Charge","Foul Play","Hex","Snarl","Burning Jealousy","Tera Blast","Pain Split","Psych Up","Double-Edge"],
    egg: ["Roar","Hypnosis","Flail","Memento","Howl","Healing Wish","Flame Charge","Baby-Doll Eyes"],
    max: []
  },
  38: {
    levelUp: [{level:1,move:"Quick Attack"},{level:1,move:"Flamethrower"},{level:1,move:"Tail Whip"}],
    tm: ["Body Slam","Take Down","Roar","Flamethrower","Hyper Beam","Solar Beam","Fire Spin","Dig","Agility","Night Shade","Confuse Ray","Fire Blast","Swift","Rest","Substitute","Spite","Protect","Endure","Charm","Sleep Talk","Baton Pass","Encore","Sunny Day","Shadow Ball","Heat Wave","Will-O-Wisp","Facade","Helping Hand","Imprison","Weather Ball","Fake Tears","Overheat","Calm Mind","Flare Blitz","Dark Pulse","Energy Ball","Giga Impact","Nasty Plot","Zen Headbutt","Psyshock","Flame Charge","Foul Play","Stored Power","Hex","Snarl","Burning Jealousy","Tera Blast","Pain Split","Psych Up","Double-Edge","Scorching Sands"],
    egg: ["Roar","Hypnosis","Flail","Memento","Howl","Healing Wish","Flame Charge","Baby-Doll Eyes"],
    max: []
  },
  39: {
    levelUp: [{level:1,move:"Disarming Voice"},{level:1,move:"Copycat"},{level:1,move:"Sweet Kiss"},{level:1,move:"Defense Curl"},{level:1,move:"Charm"},{level:1,move:"Sing"},{level:1,move:"Disable"},{level:1,move:"Pound"},{level:4,move:"Echoed Voice"},{level:8,move:"Covet"},{level:12,move:"Stockpile"},{level:12,move:"Spit Up"},{level:12,move:"Swallow"},{level:16,move:"Round"},{level:20,move:"Rest"},{level:24,move:"Body Slam"},{level:28,move:"Mimic"},{level:32,move:"Gyro Ball"},{level:36,move:"Hyper Voice"},{level:44,move:"Double-Edge"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Take Down","Flamethrower","Ice Beam","Blizzard","Solar Beam","Thunderbolt","Thunder Wave","Thunder","Dig","Psychic","Light Screen","Reflect","Metronome","Fire Blast","Swift","Amnesia","Rest","Substitute","Thief","Protect","Icy Wind","Sandstorm","Endure","Charm","Sleep Talk","Baton Pass","Encore","Rain Dance","Sunny Day","Shadow Ball","Facade","Taunt","Helping Hand","Brick Break","Skill Swap","Hyper Voice","Fake Tears","Magical Leaf","Calm Mind","Water Pulse","Fling","Dark Pulse","Drain Punch","Energy Ball","Nasty Plot","Zen Headbutt","Stealth Rock","Grass Knot","Psyshock","Stored Power","Wild Charge","Disarming Voice","Draining Kiss","Misty Terrain","Play Rough","Dazzling Gleam","Body Press","Tera Blast","Ice Spinner","Trailblaze","Chilling Water","Gravity","Gyro Ball","Knock Off","Uproar","Focus Punch","Misty Explosion","Pain Split","Psych Up","Double-Edge","Endeavor","Alluring Voice","Psychic Noise"],
    egg: [],
    max: []
  },
  40: {
    levelUp: [{level:1,move:"Stockpile"},{level:1,move:"Echoed Voice"},{level:1,move:"Round"},{level:1,move:"Copycat"},{level:1,move:"Gyro Ball"},{level:1,move:"Covet"},{level:1,move:"Hyper Voice"},{level:1,move:"Swallow"},{level:1,move:"Spit Up"},{level:1,move:"Disarming Voice"},{level:1,move:"Pound"},{level:1,move:"Sweet Kiss"},{level:1,move:"Rest"},{level:1,move:"Defense Curl"},{level:1,move:"Mimic"},{level:1,move:"Disable"},{level:1,move:"Sing"},{level:1,move:"Double-Edge"},{level:1,move:"Body Slam"},{level:1,move:"Charm"},{level:5,move:"Play Rough"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Take Down","Flamethrower","Ice Beam","Blizzard","Hyper Beam","Solar Beam","Thunderbolt","Thunder Wave","Thunder","Dig","Psychic","Light Screen","Reflect","Metronome","Fire Blast","Swift","Amnesia","Rest","Substitute","Thief","Protect","Icy Wind","Sandstorm","Endure","Charm","Sleep Talk","Baton Pass","Encore","Rain Dance","Sunny Day","Shadow Ball","Facade","Taunt","Helping Hand","Brick Break","Skill Swap","Hyper Voice","Fake Tears","Magical Leaf","Calm Mind","Water Pulse","Fling","Dark Pulse","Drain Punch","Focus Blast","Energy Ball","Giga Impact","Nasty Plot","Zen Headbutt","Stealth Rock","Grass Knot","Psyshock","Stored Power","Wild Charge","Disarming Voice","Draining Kiss","Misty Terrain","Play Rough","Dazzling Gleam","Body Press","Tera Blast","Ice Spinner","Trailblaze","Chilling Water","Gravity","Gyro Ball","Knock Off","Uproar","Focus Punch","Misty Explosion","Pain Split","Psych Up","Double-Edge","Endeavor","Expanding Force","Alluring Voice","Psychic Noise"],
    egg: [],
    max: []
  },
  41: {
    levelUp: [{level:1,move:"Gust"},{level:6,move:"Hypnosis"},{level:11,move:"Bite"},{level:18,move:"Air Cutter"},{level:25,move:"Cross Poison"},{level:34,move:"Air Slash"},{level:43,move:"Leech Life"}],
    tm: [],
    egg: [],
    max: []
  },
  42: {
    levelUp: [{level:1,move:"Gust"},{level:6,move:"Hypnosis"},{level:11,move:"Bite"},{level:18,move:"Air Cutter"},{level:25,move:"Cross Poison"},{level:34,move:"Air Slash"},{level:43,move:"Leech Life"}],
    tm: [],
    egg: [],
    max: []
  },
  43: {
    levelUp: [{level:1,move:"Absorb"},{level:1,move:"Growth"},{level:4,move:"Acid"},{level:8,move:"Sweet Scent"},{level:12,move:"Mega Drain"},{level:14,move:"Poison Powder"},{level:16,move:"Stun Spore"},{level:18,move:"Sleep Powder"},{level:20,move:"Giga Drain"},{level:24,move:"Toxic"},{level:28,move:"Moonblast"},{level:32,move:"Grassy Terrain"},{level:36,move:"Moonlight"},{level:40,move:"Petal Dance"}],
    tm: ["Swords Dance","Solar Beam","Toxic","Rest","Substitute","Protect","Sludge Bomb","Giga Drain","Endure","Charm","Sleep Talk","Sunny Day","Facade","Helping Hand","Bullet Seed","Magical Leaf","Seed Bomb","Energy Ball","Leaf Storm","Grass Knot","Venoshock","Acid Spray","Grassy Terrain","Grassy Glide","Tera Blast","Trailblaze"],
    egg: ["Leech Seed","Razor Leaf","Flail","Synthesis","Ingrain","Teeter Dance","Tickle","After You","Strength Sap"],
    max: []
  },
  44: {
    levelUp: [{level:1,move:"Acid"},{level:1,move:"Absorb"},{level:1,move:"Growth"},{level:1,move:"Sweet Scent"},{level:12,move:"Mega Drain"},{level:14,move:"Poison Powder"},{level:16,move:"Stun Spore"},{level:18,move:"Sleep Powder"},{level:20,move:"Giga Drain"},{level:26,move:"Toxic"},{level:32,move:"Moonblast"},{level:38,move:"Grassy Terrain"},{level:44,move:"Moonlight"},{level:50,move:"Petal Dance"}],
    tm: ["Swords Dance","Solar Beam","Toxic","Rest","Substitute","Protect","Sludge Bomb","Giga Drain","Endure","Charm","Sleep Talk","Sunny Day","Facade","Helping Hand","Bullet Seed","Magical Leaf","Seed Bomb","Energy Ball","Leaf Storm","Grass Knot","Venoshock","Acid Spray","Petal Blizzard","Grassy Terrain","Pollen Puff","Grassy Glide","Tera Blast","Trailblaze"],
    egg: ["Leech Seed","Razor Leaf","Flail","Synthesis","Ingrain","Teeter Dance","Tickle","After You","Strength Sap"],
    max: []
  },
  45: {
    levelUp: [{level:0,move:"Petal Blizzard"},{level:1,move:"Acid"},{level:1,move:"Absorb"},{level:1,move:"Mega Drain"},{level:1,move:"Growth"},{level:1,move:"Poison Powder"},{level:1,move:"Stun Spore"},{level:1,move:"Sleep Powder"},{level:1,move:"Petal Dance"},{level:1,move:"Toxic"},{level:1,move:"Giga Drain"},{level:1,move:"Sweet Scent"},{level:1,move:"Moonlight"},{level:1,move:"Grassy Terrain"},{level:1,move:"Moonblast"}],
    tm: ["Swords Dance","Body Slam","Hyper Beam","Solar Beam","Toxic","Rest","Substitute","Protect","Sludge Bomb","Giga Drain","Endure","Charm","Sleep Talk","Sunny Day","Facade","Helping Hand","Weather Ball","Bullet Seed","Magical Leaf","Fling","Seed Bomb","Energy Ball","Giga Impact","Leaf Storm","Grass Knot","Venoshock","Sludge Wave","Acid Spray","Petal Blizzard","Grassy Terrain","Dazzling Gleam","Solar Blade","Pollen Puff","Grassy Glide","Tera Blast","Trailblaze"],
    egg: ["Leech Seed","Razor Leaf","Flail","Synthesis","Ingrain","Teeter Dance","Tickle","After You","Strength Sap"],
    max: []
  },
  46: {
    levelUp: [{level:1,move:"Absorb"},{level:5,move:"Stun Spore"},{level:9,move:"Poison Powder"},{level:15,move:"Venoshock"},{level:21,move:"Slash"},{level:29,move:"Spore"},{level:37,move:"X-Scissor"},{level:47,move:"Energy Ball"}],
    tm: [],
    egg: [],
    max: []
  },
  47: {
    levelUp: [{level:1,move:"Absorb"},{level:5,move:"Stun Spore"},{level:9,move:"Poison Powder"},{level:15,move:"Venoshock"},{level:21,move:"Slash"},{level:29,move:"Spore"},{level:37,move:"X-Scissor"},{level:47,move:"Energy Ball"}],
    tm: [],
    egg: [],
    max: []
  },
  48: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Disable"},{level:5,move:"Supersonic"},{level:11,move:"Confusion"},{level:13,move:"Poison Powder"},{level:17,move:"Psybeam"},{level:23,move:"Stun Spore"},{level:25,move:"Bug Buzz"},{level:29,move:"Sleep Powder"},{level:35,move:"Leech Life"},{level:37,move:"Zen Headbutt"},{level:41,move:"Poison Fang"},{level:47,move:"Psychic"}],
    tm: ["Take Down","Psybeam","Solar Beam","Psychic","Agility","Night Shade","Confuse Ray","Swift","Leech Life","Rest","Substitute","Thief","Protect","Sludge Bomb","Giga Drain","Endure","Sleep Talk","Baton Pass","Sunny Day","Facade","Skill Swap","Toxic Spikes","Bug Buzz","Energy Ball","Zen Headbutt","Venoshock","Acid Spray","Struggle Bug","Tera Blast","Pounce","Toxic","Bug Bite","Lunge","Endeavor","Skitter Smack","Psychic Noise"],
    egg: ["Agility","Screech","Baton Pass","Morning Sun","Toxic Spikes","Bug Bite","Venoshock","Rage Powder"],
    max: []
  },
  49: {
    levelUp: [{level:0,move:"Air Slash"},{level:1,move:"Tackle"},{level:1,move:"Supersonic"},{level:1,move:"Disable"},{level:1,move:"Quiver Dance"},{level:11,move:"Confusion"},{level:13,move:"Poison Powder"},{level:17,move:"Psybeam"},{level:23,move:"Stun Spore"},{level:25,move:"Bug Buzz"},{level:29,move:"Sleep Powder"},{level:37,move:"Leech Life"},{level:41,move:"Zen Headbutt"},{level:47,move:"Poison Fang"},{level:55,move:"Psychic"}],
    tm: ["Take Down","Psybeam","Hyper Beam","Solar Beam","Psychic","Agility","Night Shade","Confuse Ray","Swift","Leech Life","Rest","Substitute","Thief","Protect","Sludge Bomb","Giga Drain","Endure","Sleep Talk","Baton Pass","Sunny Day","Facade","Skill Swap","Air Cutter","U-turn","Toxic Spikes","Air Slash","Bug Buzz","Energy Ball","Giga Impact","Zen Headbutt","Venoshock","Acid Spray","Acrobatics","Struggle Bug","Tera Blast","Pounce","Toxic","Bug Bite","Lunge","Double-Edge","Endeavor","Sludge Wave","Skitter Smack","Psychic Noise"],
    egg: [],
    max: []
  },
  50: {
    levelUp: [{level:1,move:"Scratch"},{level:1,move:"Sand Attack"},{level:4,move:"Growl"},{level:8,move:"Astonish"},{level:12,move:"Mud-Slap"},{level:16,move:"Bulldoze"},{level:20,move:"Sucker Punch"},{level:24,move:"Slash"},{level:28,move:"Sandstorm"},{level:32,move:"Dig"},{level:36,move:"Earth Power"},{level:40,move:"Earthquake"},{level:44,move:"Fissure"}],
    tm: ["Swords Dance","Body Slam","Take Down","Earthquake","Dig","Agility","Rest","Rock Slide","Substitute","Thief","Reversal","Protect","Sludge Bomb","Mud-Slap","Sandstorm","Endure","Charm","Sleep Talk","Sunny Day","Facade","Helping Hand","Rock Tomb","Mud Shot","Rock Blast","Earth Power","Shadow Claw","Stone Edge","Stealth Rock","Foul Play","Bulldoze","Stomping Tantrum","Tera Blast","Sand Tomb","Smack Down","Uproar","Double-Edge","Endeavor","Scorching Sands","Throat Chop","Curse"],
    egg: ["Headbutt","Ancient Power","Memento","Hone Claws","Final Gambit"],
    max: []
  },
  51: {
    levelUp: [{level:0,move:"Sand Tomb"},{level:1,move:"Scratch"},{level:1,move:"Sand Attack"},{level:1,move:"Growl"},{level:1,move:"Tri Attack"},{level:1,move:"Astonish"},{level:1,move:"Night Slash"},{level:12,move:"Mud-Slap"},{level:16,move:"Bulldoze"},{level:20,move:"Sucker Punch"},{level:24,move:"Slash"},{level:30,move:"Sandstorm"},{level:36,move:"Dig"},{level:42,move:"Earth Power"},{level:48,move:"Earthquake"},{level:54,move:"Fissure"}],
    tm: ["Swords Dance","Body Slam","Take Down","Hyper Beam","Earthquake","Dig","Agility","Rest","Rock Slide","Substitute","Thief","Reversal","Protect","Sludge Bomb","Mud-Slap","Sandstorm","Endure","Charm","Sleep Talk","Sunny Day","Facade","Rock Tomb","Mud Shot","Rock Blast","Earth Power","Giga Impact","Shadow Claw","Stone Edge","Stealth Rock","Foul Play","Bulldoze","Stomping Tantrum","Tera Blast","Sand Tomb","Smack Down","Uproar","Double-Edge","Endeavor","Sludge Wave","Scorching Sands","Throat Chop","Curse"],
    egg: [],
    max: []
  },
  52: {
    levelUp: [{level:1,move:"Growl"},{level:1,move:"Fake Out"},{level:4,move:"Feint"},{level:8,move:"Scratch"},{level:12,move:"Pay Day"},{level:16,move:"Bite"},{level:20,move:"Taunt"},{level:24,move:"Assurance"},{level:29,move:"Fury Swipes"},{level:32,move:"Screech"},{level:36,move:"Slash"},{level:40,move:"Nasty Plot"},{level:44,move:"Play Rough"}],
    tm: ["Body Slam","Take Down","Thunderbolt","Thunder Wave","Thunder","Dig","Agility","Swift","Amnesia","Rest","Substitute","Thief","Protect","Icy Wind","Endure","Charm","False Swipe","Sleep Talk","Metal Claw","Rain Dance","Sunny Day","Shadow Ball","Facade","Taunt","Helping Hand","Hyper Voice","Fake Tears","Aerial Ace","U-turn","Dark Pulse","Seed Bomb","Power Gem","Nasty Plot","Shadow Claw","Gunk Shot","Foul Play","Snarl","Play Rough","Tera Blast","Trailblaze","Chilling Water","Spite","Knock Off","Lash Out","Pain Split","Psych Up","Double-Edge","Endeavor","Throat Chop"],
    egg: ["Tail Whip","Hypnosis","Flail","Spite","Covet","Last Resort"],
    max: []
  },
  53: {
    levelUp: [{level:0,move:"Power Gem"},{level:1,move:"Scratch"},{level:1,move:"Growl"},{level:1,move:"Fake Out"},{level:1,move:"Feint"},{level:1,move:"Switcheroo"},{level:12,move:"Pay Day"},{level:16,move:"Bite"},{level:20,move:"Taunt"},{level:24,move:"Assurance"},{level:31,move:"Fury Swipes"},{level:36,move:"Screech"},{level:42,move:"Slash"},{level:48,move:"Nasty Plot"},{level:54,move:"Play Rough"}],
    tm: ["Body Slam","Take Down","Hyper Beam","Thunderbolt","Thunder Wave","Thunder","Dig","Agility","Swift","Amnesia","Rest","Substitute","Thief","Protect","Icy Wind","Endure","Charm","False Swipe","Sleep Talk","Metal Claw","Rain Dance","Sunny Day","Shadow Ball","Facade","Taunt","Helping Hand","Hyper Voice","Fake Tears","Aerial Ace","U-turn","Dark Pulse","Seed Bomb","Power Gem","Giga Impact","Nasty Plot","Shadow Claw","Gunk Shot","Foul Play","Snarl","Play Rough","Tera Blast","Trailblaze","Chilling Water","Roar","Spite","Knock Off","Lash Out","Pain Split","Psych Up","Double-Edge","Endeavor","Skitter Smack","Throat Chop"],
    egg: [],
    max: []
  },
  54: {
    levelUp: [{level:1,move:"Scratch"},{level:1,move:"Tail Whip"},{level:3,move:"Water Gun"},{level:6,move:"Confusion"},{level:9,move:"Fury Swipes"},{level:12,move:"Water Pulse"},{level:15,move:"Disable"},{level:18,move:"Zen Headbutt"},{level:21,move:"Screech"},{level:24,move:"Aqua Tail"},{level:27,move:"Soak"},{level:30,move:"Psych Up"},{level:34,move:"Amnesia"},{level:39,move:"Wonder Room"}],
    tm: ["Ice Punch","Body Slam","Take Down","Hydro Pump","Surf","Ice Beam","Blizzard","Psybeam","Low Kick","Dig","Psychic","Confuse Ray","Light Screen","Metronome","Waterfall","Swift","Amnesia","Rest","Substitute","Thief","Protect","Icy Wind","Endure","Sleep Talk","Encore","Rain Dance","Facade","Taunt","Helping Hand","Brick Break","Skill Swap","Mud Shot","Calm Mind","Water Pulse","Fling","Nasty Plot","Shadow Claw","Zen Headbutt","Psyshock","Low Sweep","Liquidation","Tera Blast","Trailblaze","Chilling Water","Haze","Knock Off","Vacuum Wave","Focus Punch","Flip Turn","Psych Up","Double-Edge","Endeavor","Whirlpool","Muddy Water","Psychic Noise"],
    egg: ["Psybeam","Hypnosis","Confuse Ray","Cross Chop","Yawn","Simple Beam","Clear Smog"],
    max: []
  },
  55: {
    levelUp: [{level:1,move:"Scratch"},{level:1,move:"Tail Whip"},{level:1,move:"Water Gun"},{level:1,move:"Confusion"},{level:1,move:"Aqua Jet"},{level:9,move:"Fury Swipes"},{level:12,move:"Water Pulse"},{level:15,move:"Disable"},{level:18,move:"Zen Headbutt"},{level:21,move:"Screech"},{level:24,move:"Aqua Tail"},{level:27,move:"Soak"},{level:30,move:"Psych Up"},{level:36,move:"Amnesia"},{level:40,move:"Hydro Pump"},{level:45,move:"Wonder Room"}],
    tm: ["Ice Punch","Body Slam","Take Down","Hydro Pump","Surf","Ice Beam","Blizzard","Psybeam","Hyper Beam","Low Kick","Dig","Psychic","Confuse Ray","Light Screen","Metronome","Waterfall","Swift","Amnesia","Rest","Substitute","Thief","Protect","Icy Wind","Endure","Sleep Talk","Encore","Rain Dance","Facade","Taunt","Helping Hand","Brick Break","Skill Swap","Mud Shot","Calm Mind","Water Pulse","Fling","Power Gem","Focus Blast","Giga Impact","Nasty Plot","Shadow Claw","Zen Headbutt","Grass Knot","Psyshock","Low Sweep","Liquidation","Tera Blast","Trailblaze","Chilling Water","Haze","Knock Off","Vacuum Wave","Focus Punch","Flip Turn","Psych Up","Double-Edge","Endeavor","Whirlpool","Muddy Water","Future Sight","Psychic Noise"],
    egg: [],
    max: []
  },
  56: {
    levelUp: [{level:1,move:"Scratch"},{level:1,move:"Leer"},{level:1,move:"Focus Energy"},{level:1,move:"Covet"},{level:5,move:"Fury Swipes"},{level:8,move:"Low Kick"},{level:12,move:"Seismic Toss"},{level:17,move:"Swagger"},{level:22,move:"Cross Chop"},{level:26,move:"Assurance"},{level:29,move:"Thrash"},{level:33,move:"Close Combat"},{level:36,move:"Screech"},{level:40,move:"Stomping Tantrum"},{level:44,move:"Outrage"},{level:48,move:"Final Gambit"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Take Down","Low Kick","Thunderbolt","Earthquake","Dig","Metronome","Swift","Rest","Rock Slide","Substitute","Thief","Reversal","Protect","Scary Face","Outrage","Endure","Sleep Talk","Encore","Rain Dance","Sunny Day","Facade","Taunt","Helping Hand","Brick Break","Overheat","Rock Tomb","Bulk Up","U-turn","Close Combat","Fling","Poison Jab","Seed Bomb","Drain Punch","Focus Blast","Shadow Claw","Gunk Shot","Stone Edge","Low Sweep","Acrobatics","Bulldoze","Stomping Tantrum","Tera Blast","Spite","Uproar","Focus Punch","Lash Out","Double-Edge","Endeavor","Throat Chop","Curse"],
    egg: ["Counter","Curse","Spite","Encore","Beat Up","Night Slash"],
    max: []
  },
  57: {
    levelUp: [{level:1,move:"Scratch"},{level:1,move:"Leer"},{level:1,move:"Fling"},{level:1,move:"Focus Energy"},{level:5,move:"Fury Swipes"},{level:8,move:"Low Kick"},{level:15,move:"Seismic Toss"},{level:17,move:"Swagger"},{level:22,move:"Cross Chop"},{level:26,move:"Assurance"},{level:30,move:"Thrash"},{level:35,move:"Rage Fist"},{level:39,move:"Close Combat"},{level:44,move:"Screech"},{level:48,move:"Stomping Tantrum"},{level:53,move:"Outrage"},{level:57,move:"Final Gambit"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Take Down","Hyper Beam","Low Kick","Thunderbolt","Thunder","Earthquake","Dig","Metronome","Swift","Rest","Rock Slide","Substitute","Thief","Reversal","Protect","Scary Face","Outrage","Endure","Sleep Talk","Encore","Rain Dance","Sunny Day","Facade","Taunt","Helping Hand","Brick Break","Overheat","Rock Tomb","Bulk Up","U-turn","Close Combat","Fling","Poison Jab","Seed Bomb","Drain Punch","Focus Blast","Giga Impact","Shadow Claw","Gunk Shot","Stone Edge","Stealth Rock","Low Sweep","Acrobatics","Bulldoze","Stomping Tantrum","Tera Blast","Spite","Smack Down","Vacuum Wave","Uproar","Focus Punch","Lash Out","Double-Edge","Endeavor","Throat Chop","Curse"],
    egg: [],
    max: []
  },
  58: {
    levelUp: [{level:1,move:"Leer"},{level:1,move:"Ember"},{level:4,move:"Howl"},{level:8,move:"Bite"},{level:12,move:"Flame Wheel"},{level:16,move:"Helping Hand"},{level:20,move:"Agility"},{level:24,move:"Fire Fang"},{level:28,move:"Retaliate"},{level:32,move:"Crunch"},{level:36,move:"Take Down"},{level:40,move:"Flamethrower"},{level:44,move:"Roar"},{level:48,move:"Play Rough"},{level:52,move:"Reversal"},{level:56,move:"Flare Blitz"}],
    tm: ["Body Slam","Take Down","Flamethrower","Fire Spin","Dig","Agility","Fire Blast","Swift","Rest","Substitute","Thief","Reversal","Protect","Scary Face","Outrage","Endure","Charm","Sleep Talk","Sunny Day","Crunch","Heat Wave","Will-O-Wisp","Facade","Helping Hand","Overheat","Close Combat","Flare Blitz","Thunder Fang","Fire Fang","Flame Charge","Wild Charge","Snarl","Play Rough","Psychic Fangs","Tera Blast","Roar","Double-Edge","Temper Flare","Curse"],
    egg: ["Double Kick","Thrash","Double-Edge","Morning Sun","Covet","Raging Fury"],
    max: []
  },
  59: {
    levelUp: [{level:0,move:"Extreme Speed"},{level:1,move:"Play Rough"},{level:1,move:"Fire Fang"},{level:1,move:"Flare Blitz"},{level:1,move:"Howl"},{level:1,move:"Helping Hand"},{level:1,move:"Crunch"},{level:1,move:"Retaliate"},{level:1,move:"Reversal"},{level:1,move:"Agility"},{level:1,move:"Ember"},{level:1,move:"Roar"},{level:1,move:"Bite"},{level:1,move:"Leer"},{level:1,move:"Flame Wheel"},{level:1,move:"Take Down"},{level:5,move:"Flamethrower"}],
    tm: ["Body Slam","Take Down","Flamethrower","Hyper Beam","Solar Beam","Fire Spin","Dig","Agility","Fire Blast","Swift","Rest","Substitute","Thief","Reversal","Protect","Scary Face","Outrage","Endure","Charm","Sleep Talk","Sunny Day","Crunch","Heat Wave","Will-O-Wisp","Facade","Helping Hand","Hyper Voice","Overheat","Aerial Ace","Close Combat","Flare Blitz","Dragon Pulse","Giga Impact","Thunder Fang","Fire Fang","Iron Head","Flame Charge","Bulldoze","Wild Charge","Snarl","Play Rough","Psychic Fangs","Tera Blast","Roar","Heat Crash","Double-Edge","Temper Flare","Scorching Sands","Curse"],
    egg: [],
    max: []
  },
  60: {
    levelUp: [{level:1,move:"Water Gun"},{level:1,move:"Hypnosis"},{level:6,move:"Pound"},{level:12,move:"Mud Shot"},{level:18,move:"Bubble Beam"},{level:24,move:"Rain Dance"},{level:30,move:"Body Slam"},{level:36,move:"Earth Power"},{level:42,move:"Hydro Pump"},{level:48,move:"Belly Drum"},{level:54,move:"Double-Edge"}],
    tm: ["Body Slam","Take Down","Hydro Pump","Surf","Ice Beam","Blizzard","Low Kick","Dig","Psychic","Haze","Waterfall","Swift","Amnesia","Rest","Substitute","Thief","Protect","Mud-Slap","Icy Wind","Endure","Sleep Talk","Encore","Rain Dance","Facade","Focus Punch","Helping Hand","Weather Ball","Mud Shot","Water Pulse","Earth Power","Bulldoze","Liquidation","Tera Blast","Chilling Water","Double-Edge","Endeavor","Whirlpool","Muddy Water"],
    egg: ["Mist","Splash","Endeavor","Muddy Water","Water Pulse"],
    max: []
  },
  61: {
    levelUp: [{level:1,move:"Pound"},{level:1,move:"Water Gun"},{level:1,move:"Hypnosis"},{level:1,move:"Mud Shot"},{level:18,move:"Bubble Beam"},{level:24,move:"Rain Dance"},{level:32,move:"Body Slam"},{level:40,move:"Earth Power"},{level:48,move:"Hydro Pump"},{level:56,move:"Belly Drum"},{level:66,move:"Double-Edge"}],
    tm: ["Ice Punch","Body Slam","Take Down","Hydro Pump","Surf","Ice Beam","Blizzard","Low Kick","Earthquake","Dig","Psychic","Haze","Metronome","Waterfall","Swift","Amnesia","Rest","Substitute","Thief","Protect","Mud-Slap","Icy Wind","Endure","Sleep Talk","Encore","Rain Dance","Facade","Focus Punch","Helping Hand","Brick Break","Weather Ball","Mud Shot","Water Pulse","Fling","Earth Power","Low Sweep","Bulldoze","Liquidation","Tera Blast","Chilling Water","Psych Up","Double-Edge","Endeavor","Whirlpool","Muddy Water"],
    egg: ["Mist","Splash","Endeavor","Muddy Water","Water Pulse"],
    max: []
  },
  62: {
    levelUp: [{level:0,move:"Dynamic Punch"},{level:1,move:"Body Slam"},{level:1,move:"Bubble Beam"},{level:1,move:"Hypnosis"}],
    tm: ["Ice Punch","Body Slam","Take Down","Hydro Pump","Surf","Ice Beam","Blizzard","Hyper Beam","Low Kick","Earthquake","Dig","Psychic","Haze","Metronome","Waterfall","Swift","Amnesia","Rest","Rock Slide","Substitute","Thief","Reversal","Protect","Scary Face","Mud-Slap","Icy Wind","Endure","Sleep Talk","Baton Pass","Encore","Rain Dance","Facade","Focus Punch","Taunt","Helping Hand","Brick Break","Knock Off","Weather Ball","Rock Tomb","Bulk Up","Mud Shot","Water Pulse","Close Combat","Fling","Poison Jab","Drain Punch","Vacuum Wave","Focus Blast","Earth Power","Giga Impact","Low Sweep","Bulldoze","High Horsepower","Liquidation","Tera Blast","Chilling Water","Psych Up","Double-Edge","Endeavor","Whirlpool","Muddy Water","Coaching","Throat Chop","Upper Hand"],
    egg: ["Pound","Double-Edge","Mist","Water Gun","Hydro Pump","Splash","Belly Drum","Rain Dance","Endeavor","Muddy Water","Mud Shot","Water Pulse","Earth Power","Circle Throw"],
    max: []
  },
  63: {
    levelUp: [{level:1,move:"Teleport"}],
    tm: [],
    egg: [],
    max: []
  },
  64: {
    levelUp: [{level:0,move:"Confusion"},{level:1,move:"Teleport"},{level:6,move:"Hypnosis"},{level:11,move:"Calm Mind"},{level:18,move:"Psycho Cut"},{level:25,move:"Zen Headbutt"},{level:34,move:"Recover"},{level:43,move:"Psychic"}],
    tm: [],
    egg: [],
    max: []
  },
  65: {
    levelUp: [{level:1,move:"Teleport"},{level:6,move:"Hypnosis"},{level:6,move:"Confusion"},{level:11,move:"Calm Mind"},{level:18,move:"Psycho Cut"},{level:25,move:"Zen Headbutt"},{level:34,move:"Recover"},{level:43,move:"Psychic"}],
    tm: [],
    egg: [],
    max: []
  },
  66: {
    levelUp: [{level:1,move:"Tackle"},{level:6,move:"Rock Smash"},{level:11,move:"Bullet Punch"},{level:18,move:"Double Hit"},{level:22,move:"Mach Punch"},{level:25,move:"Bulk Up"},{level:34,move:"Double-Edge"},{level:43,move:"Close Combat"}],
    tm: [],
    egg: [],
    max: []
  },
  67: {
    levelUp: [{level:1,move:"Tackle"},{level:6,move:"Rock Smash"},{level:11,move:"Bullet Punch"},{level:18,move:"Double Hit"},{level:22,move:"Mach Punch"},{level:25,move:"Bulk Up"},{level:34,move:"Double-Edge"},{level:43,move:"Close Combat"}],
    tm: [],
    egg: [],
    max: []
  },
  68: {
    levelUp: [{level:1,move:"Tackle"},{level:6,move:"Rock Smash"},{level:11,move:"Bullet Punch"},{level:18,move:"Double Hit"},{level:22,move:"Mach Punch"},{level:25,move:"Bulk Up"},{level:30,move:"Drain Punch"},{level:34,move:"Double-Edge"},{level:43,move:"Close Combat"}],
    tm: [],
    egg: [],
    max: []
  },
  69: {
    levelUp: [{level:1,move:"Vine Whip"},{level:7,move:"Growth"},{level:11,move:"Wrap"},{level:13,move:"Sleep Powder"},{level:15,move:"Poison Powder"},{level:17,move:"Stun Spore"},{level:23,move:"Acid"},{level:27,move:"Knock Off"},{level:29,move:"Sweet Scent"},{level:35,move:"Gastro Acid"},{level:39,move:"Razor Leaf"},{level:41,move:"Poison Jab"},{level:47,move:"Slam"},{level:52,move:"Power Whip"}],
    tm: ["Swords Dance","Solar Beam","Toxic","Reflect","Leech Life","Rest","Substitute","Thief","Protect","Sludge Bomb","Giga Drain","Endure","Sleep Talk","Encore","Sunny Day","Facade","Knock Off","Weather Ball","Bullet Seed","Magical Leaf","Poison Jab","Seed Bomb","Energy Ball","Leaf Storm","Grass Knot","Venoshock","Acid Spray","Grassy Terrain","Lunge","Grassy Glide","Tera Blast","Pounce","Trailblaze","Sludge Wave"],
    egg: ["Synthesis","Ingrain","Tickle","Worry Seed","Sucker Punch","Clear Smog","Strength Sap"],
    max: []
  },
  70: {
    levelUp: [{level:1,move:"Vine Whip"},{level:1,move:"Wrap"},{level:1,move:"Growth"},{level:13,move:"Sleep Powder"},{level:15,move:"Poison Powder"},{level:17,move:"Stun Spore"},{level:24,move:"Acid"},{level:29,move:"Knock Off"},{level:32,move:"Sweet Scent"},{level:39,move:"Gastro Acid"},{level:44,move:"Razor Leaf"},{level:47,move:"Poison Jab"},{level:54,move:"Slam"},{level:58,move:"Power Whip"}],
    tm: ["Swords Dance","Body Slam","Solar Beam","Toxic","Reflect","Swift","Leech Life","Rest","Substitute","Thief","Protect","Sludge Bomb","Giga Drain","Endure","Sleep Talk","Encore","Sunny Day","Facade","Knock Off","Weather Ball","Bullet Seed","Magical Leaf","Poison Jab","Seed Bomb","Energy Ball","Leaf Storm","Grass Knot","Bug Bite","Venoshock","Acid Spray","Grassy Terrain","Lunge","Grassy Glide","Tera Blast","Pounce","Trailblaze","Sludge Wave"],
    egg: ["Synthesis","Ingrain","Tickle","Worry Seed","Sucker Punch","Clear Smog","Strength Sap"],
    max: []
  },
  71: {
    levelUp: [{level:0,move:"Leaf Storm"},{level:1,move:"Vine Whip"},{level:1,move:"Razor Leaf"},{level:1,move:"Sleep Powder"},{level:1,move:"Sweet Scent"},{level:44,move:"Leaf Blade"}],
    tm: ["Swords Dance","Body Slam","Hyper Beam","Solar Beam","Toxic","Reflect","Swift","Leech Life","Rest","Substitute","Thief","Protect","Scary Face","Sludge Bomb","Giga Drain","Endure","Sleep Talk","Encore","Sunny Day","Facade","Knock Off","Weather Ball","Bullet Seed","Magical Leaf","Poison Jab","Seed Bomb","Energy Ball","Giga Impact","Leaf Storm","Grass Knot","Bug Bite","Venoshock","Acid Spray","Grassy Terrain","Lunge","Grassy Glide","Tera Blast","Pounce","Trailblaze","Sludge Wave"],
    egg: ["Synthesis","Stockpile","Spit Up","Swallow","Ingrain","Tickle","Gastro Acid","Worry Seed","Sucker Punch","Power Whip","Clear Smog","Strength Sap"],
    max: []
  },
  72: {
    levelUp: [{level:1,move:"Poison Sting"},{level:1,move:"Water Gun"},{level:4,move:"Acid"},{level:8,move:"Wrap"},{level:12,move:"Supersonic"},{level:16,move:"Water Pulse"},{level:20,move:"Screech"},{level:24,move:"Bubble Beam"},{level:28,move:"Hex"},{level:32,move:"Acid Armor"},{level:36,move:"Poison Jab"},{level:40,move:"Surf"},{level:44,move:"Sludge Wave"},{level:48,move:"Hydro Pump"}],
    tm: ["Swords Dance","Hydro Pump","Surf","Ice Beam","Blizzard","Toxic","Confuse Ray","Haze","Swift","Rest","Substitute","Thief","Protect","Sludge Bomb","Icy Wind","Giga Drain","Endure","Sleep Talk","Rain Dance","Whirlpool","Facade","Knock Off","Muddy Water","Mud Shot","Water Pulse","Toxic Spikes","Poison Jab","Gunk Shot","Venoshock","Sludge Wave","Acid Spray","Hex","Dazzling Gleam","Throat Chop","Liquidation","Flip Turn","Tera Blast","Pounce","Chilling Water"],
    egg: ["Aurora Beam","Confuse Ray","Haze","Rapid Spin","Mirror Coat","Knock Off","Tickle","Acupressure","Aqua Ring"],
    max: []
  },
  73: {
    levelUp: [{level:1,move:"Wrap"},{level:1,move:"Poison Sting"},{level:1,move:"Acid"},{level:1,move:"Water Gun"},{level:1,move:"Reflect Type"},{level:12,move:"Supersonic"},{level:16,move:"Water Pulse"},{level:20,move:"Screech"},{level:24,move:"Bubble Beam"},{level:28,move:"Hex"},{level:34,move:"Acid Armor"},{level:40,move:"Poison Jab"},{level:46,move:"Surf"},{level:52,move:"Sludge Wave"},{level:58,move:"Hydro Pump"}],
    tm: ["Swords Dance","Hydro Pump","Surf","Ice Beam","Blizzard","Hyper Beam","Toxic","Confuse Ray","Haze","Swift","Rest","Substitute","Thief","Protect","Scary Face","Sludge Bomb","Icy Wind","Giga Drain","Endure","Sleep Talk","Rain Dance","Whirlpool","Facade","Knock Off","Weather Ball","Muddy Water","Mud Shot","Water Pulse","Toxic Spikes","Poison Jab","Giga Impact","Gunk Shot","Venoshock","Sludge Wave","Acid Spray","Hex","Dazzling Gleam","Throat Chop","Liquidation","Skitter Smack","Flip Turn","Tera Blast","Pounce","Chilling Water"],
    egg: ["Aurora Beam","Confuse Ray","Haze","Rapid Spin","Mirror Coat","Knock Off","Tickle","Acupressure","Aqua Ring"],
    max: []
  },
  74: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Defense Curl"},{level:6,move:"Rock Polish"},{level:10,move:"Rollout"},{level:12,move:"Bulldoze"},{level:16,move:"Rock Throw"},{level:18,move:"Smack Down"},{level:24,move:"Self-Destruct"},{level:28,move:"Stealth Rock"},{level:30,move:"Rock Blast"},{level:34,move:"Earthquake"},{level:36,move:"Explosion"},{level:40,move:"Double-Edge"},{level:42,move:"Stone Edge"}],
    tm: ["Fire Punch","Thunder Punch","Body Slam","Take Down","Flamethrower","Earthquake","Dig","Metronome","Fire Blast","Rest","Rock Slide","Substitute","Protect","Scary Face","Mud-Slap","Sandstorm","Endure","Sleep Talk","Sunny Day","Facade","Focus Punch","Brick Break","Rock Tomb","Iron Defense","Mud Shot","Rock Blast","Gyro Ball","Fling","Earth Power","Stone Edge","Stealth Rock","Smack Down","Bulldoze","High Horsepower","Stomping Tantrum","Tera Blast","Double-Edge","Curse"],
    egg: ["Mega Punch","Curse","Flail","Dynamic Punch","Block","Hammer Arm","Wide Guard"],
    max: []
  },
  75: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Defense Curl"},{level:1,move:"Rock Polish"},{level:10,move:"Rollout"},{level:12,move:"Bulldoze"},{level:16,move:"Rock Throw"},{level:18,move:"Smack Down"},{level:24,move:"Self-Destruct"},{level:30,move:"Stealth Rock"},{level:34,move:"Rock Blast"},{level:40,move:"Earthquake"},{level:44,move:"Explosion"},{level:50,move:"Double-Edge"},{level:54,move:"Stone Edge"}],
    tm: ["Fire Punch","Thunder Punch","Body Slam","Take Down","Flamethrower","Earthquake","Dig","Metronome","Fire Blast","Rest","Rock Slide","Substitute","Protect","Scary Face","Mud-Slap","Sandstorm","Endure","Sleep Talk","Sunny Day","Facade","Focus Punch","Brick Break","Rock Tomb","Iron Defense","Mud Shot","Rock Blast","Fling","Focus Blast","Earth Power","Iron Head","Stone Edge","Stealth Rock","Smack Down","Heavy Slam","Bulldoze","High Horsepower","Stomping Tantrum","Body Press","Tera Blast","Gyro Ball","Double-Edge","Curse","Hard Press"],
    egg: ["Mega Punch","Curse","Flail","Dynamic Punch","Block","Hammer Arm","Wide Guard"],
    max: []
  },
  76: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Defense Curl"},{level:1,move:"Rock Polish"},{level:1,move:"Heavy Slam"},{level:16,move:"Rock Throw"},{level:18,move:"Smack Down"},{level:22,move:"Bulldoze"},{level:24,move:"Self-Destruct"},{level:30,move:"Stealth Rock"},{level:34,move:"Rock Blast"},{level:40,move:"Earthquake"},{level:44,move:"Explosion"},{level:50,move:"Double-Edge"},{level:54,move:"Stone Edge"}],
    tm: ["Fire Punch","Thunder Punch","Body Slam","Take Down","Roar","Flamethrower","Hyper Beam","Earthquake","Dig","Metronome","Fire Blast","Rest","Rock Slide","Substitute","Protect","Scary Face","Mud-Slap","Sandstorm","Endure","Sleep Talk","Sunny Day","Facade","Focus Punch","Brick Break","Rock Tomb","Iron Defense","Mud Shot","Rock Blast","Gyro Ball","Fling","Focus Blast","Earth Power","Giga Impact","Iron Head","Stone Edge","Stealth Rock","Smack Down","Heavy Slam","Bulldoze","High Horsepower","Stomping Tantrum","Body Press","Tera Blast","Double-Edge","Curse","Hard Press"],
    egg: ["Mega Punch","Curse","Flail","Dynamic Punch","Block","Hammer Arm","Wide Guard"],
    max: []
  },
  77: {
    levelUp: [{level:1,move:"Tackle"},{level:5,move:"Ember"},{level:9,move:"Double Hit"},{level:15,move:"Flame Wheel"},{level:21,move:"Hypnosis"},{level:29,move:"Fire Blast"},{level:37,move:"Double-Edge"},{level:47,move:"Flare Blitz"}],
    tm: [],
    egg: [],
    max: []
  },
  78: {
    levelUp: [{level:1,move:"Tackle"},{level:5,move:"Ember"},{level:9,move:"Double Hit"},{level:15,move:"Flame Wheel"},{level:21,move:"Hypnosis"},{level:29,move:"Fire Blast"},{level:37,move:"Double-Edge"},{level:47,move:"Flare Blitz"}],
    tm: [],
    egg: [],
    max: []
  },
  79: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Curse"},{level:3,move:"Growl"},{level:6,move:"Water Gun"},{level:9,move:"Yawn"},{level:12,move:"Confusion"},{level:15,move:"Disable"},{level:18,move:"Water Pulse"},{level:21,move:"Headbutt"},{level:24,move:"Zen Headbutt"},{level:27,move:"Amnesia"},{level:30,move:"Surf"},{level:33,move:"Slack Off"},{level:36,move:"Psychic"},{level:39,move:"Psych Up"},{level:42,move:"Rain Dance"},{level:45,move:"Heal Pulse"}],
    tm: ["Body Slam","Take Down","Flamethrower","Hydro Pump","Surf","Ice Beam","Blizzard","Psybeam","Thunder Wave","Earthquake","Dig","Psychic","Light Screen","Fire Blast","Waterfall","Swift","Amnesia","Rest","Substitute","Protect","Icy Wind","Endure","Sleep Talk","Rain Dance","Sunny Day","Shadow Ball","Facade","Helping Hand","Trick","Skill Swap","Imprison","Mud Shot","Calm Mind","Water Pulse","Avalanche","Zen Headbutt","Trick Room","Grass Knot","Psyshock","Foul Play","Stored Power","Bulldoze","Psychic Terrain","Liquidation","Tera Blast","Snowscape","Chilling Water","Weather Ball","Psych Up","Whirlpool","Expanding Force","Curse"],
    egg: ["Stomp","Belly Drum","Block","Belch"],
    max: []
  },
  80: {
    levelUp: [{level:1,move:"Withdraw"},{level:1,move:"Tackle"},{level:1,move:"Growl"},{level:1,move:"Water Gun"},{level:1,move:"Curse"},{level:9,move:"Yawn"},{level:12,move:"Confusion"},{level:15,move:"Disable"},{level:18,move:"Water Pulse"},{level:21,move:"Headbutt"},{level:24,move:"Zen Headbutt"},{level:27,move:"Amnesia"},{level:30,move:"Surf"},{level:33,move:"Slack Off"},{level:36,move:"Psychic"},{level:41,move:"Psych Up"},{level:46,move:"Rain Dance"},{level:51,move:"Heal Pulse"}],
    tm: ["Ice Punch","Body Slam","Take Down","Flamethrower","Hydro Pump","Surf","Ice Beam","Blizzard","Psybeam","Hyper Beam","Thunder Wave","Earthquake","Dig","Psychic","Light Screen","Metronome","Fire Blast","Waterfall","Swift","Amnesia","Rest","Substitute","Protect","Icy Wind","Endure","Sleep Talk","Rain Dance","Sunny Day","Shadow Ball","Facade","Helping Hand","Trick","Brick Break","Skill Swap","Imprison","Iron Defense","Mud Shot","Calm Mind","Water Pulse","Fling","Drain Punch","Focus Blast","Giga Impact","Nasty Plot","Avalanche","Zen Headbutt","Trick Room","Grass Knot","Psyshock","Foul Play","Stored Power","Bulldoze","Psychic Terrain","Liquidation","Body Press","Tera Blast","Snowscape","Chilling Water","Scald","Focus Punch","Weather Ball","Psych Up","Whirlpool","Muddy Water","Future Sight","Expanding Force","Curse","Psychic Noise"],
    egg: ["Future Sight"],
    max: []
  },
  81: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Thunder Shock"},{level:4,move:"Supersonic"},{level:8,move:"Thunder Wave"},{level:12,move:"Electro Ball"},{level:16,move:"Gyro Ball"},{level:20,move:"Spark"},{level:24,move:"Screech"},{level:28,move:"Magnet Rise"},{level:32,move:"Flash Cannon"},{level:36,move:"Discharge"},{level:40,move:"Metal Sound"},{level:44,move:"Light Screen"},{level:48,move:"Lock-On"},{level:52,move:"Zap Cannon"}],
    tm: ["Take Down","Thunderbolt","Thunder Wave","Thunder","Confuse Ray","Light Screen","Reflect","Swift","Rest","Substitute","Protect","Sandstorm","Endure","Sleep Talk","Rain Dance","Sunny Day","Facade","Helping Hand","Iron Defense","Flash Cannon","Iron Head","Charge Beam","Heavy Slam","Electro Ball","Volt Switch","Wild Charge","Eerie Impulse","Electric Terrain","Steel Beam","Tera Blast","Charge","Gravity","Gyro Ball","Electroweb","Metal Sound"],
    egg: ["Explosion","Electroweb"],
    max: []
  },
  82: {
    levelUp: [{level:0,move:"Tri Attack"},{level:1,move:"Thunder Wave"},{level:1,move:"Electric Terrain"},{level:1,move:"Tackle"},{level:1,move:"Supersonic"},{level:1,move:"Thunder Shock"},{level:12,move:"Electro Ball"},{level:16,move:"Gyro Ball"},{level:20,move:"Spark"},{level:24,move:"Screech"},{level:28,move:"Magnet Rise"},{level:34,move:"Flash Cannon"},{level:40,move:"Discharge"},{level:46,move:"Metal Sound"},{level:52,move:"Light Screen"},{level:58,move:"Lock-On"},{level:64,move:"Zap Cannon"}],
    tm: ["Take Down","Hyper Beam","Thunderbolt","Thunder Wave","Thunder","Confuse Ray","Light Screen","Reflect","Swift","Rest","Substitute","Protect","Sandstorm","Endure","Sleep Talk","Rain Dance","Sunny Day","Facade","Helping Hand","Iron Defense","Flash Cannon","Iron Head","Charge Beam","Heavy Slam","Electro Ball","Volt Switch","Wild Charge","Eerie Impulse","Electric Terrain","Steel Beam","Tera Blast","Charge","Gravity","Gyro Ball","Electroweb","Metal Sound"],
    egg: [],
    max: []
  },
  83: {
    levelUp: [{level:1,move:"Peck"},{level:1,move:"Sand Attack"},{level:5,move:"Leer"},{level:10,move:"Fury Cutter"},{level:15,move:"Cut"},{level:20,move:"Aerial Ace"},{level:25,move:"Air Cutter"},{level:30,move:"Knock Off"},{level:35,move:"False Swipe"},{level:40,move:"Slash"},{level:45,move:"Swords Dance"},{level:50,move:"Air Slash"},{level:55,move:"Leaf Blade"},{level:60,move:"Agility"},{level:65,move:"Brave Bird"}],
    tm: ["Swords Dance","Cut","Fly","Double Team","Rest","Substitute","Thief","Protect","Endure","False Swipe","Swagger","Steel Wing","Attract","Sleep Talk","Iron Tail","Sunny Day","Psych Up","Facade","Aerial Ace","Roost","Pluck","U-turn","Poison Jab","Defog","Work Up"],
    egg: ["Gust","Quick Attack","Sky Attack","Curse","Flail","Mud-Slap","Revenge","Feather Dance","Covet","Leaf Blade","Feint","Night Slash","Simple Beam","Final Gambit"],
    max: []
  },
  84: {
    levelUp: [{level:1,move:"Growl"},{level:1,move:"Peck"},{level:5,move:"Quick Attack"},{level:9,move:"Fury Attack"},{level:14,move:"Pluck"},{level:19,move:"Double Hit"},{level:23,move:"Agility"},{level:27,move:"Uproar"},{level:30,move:"Acupressure"},{level:33,move:"Swords Dance"},{level:36,move:"Drill Peck"},{level:39,move:"Endeavor"},{level:43,move:"Thrash"}],
    tm: ["Swords Dance","Body Slam","Take Down","Double-Edge","Low Kick","Agility","Swift","Rest","Substitute","Thief","Protect","Mud-Slap","Endure","Sleep Talk","Baton Pass","Rain Dance","Sunny Day","Uproar","Facade","Helping Hand","Knock Off","Endeavor","Feather Dance","Aerial Ace","Tailwind","Brave Bird","Acrobatics","Throat Chop","Lunge","Tera Blast"],
    egg: ["Whirlwind","Sky Attack","Flail","Assurance"],
    max: []
  },
  85: {
    levelUp: [{level:0,move:"Tri Attack"},{level:1,move:"Growl"},{level:1,move:"Peck"},{level:1,move:"Quick Attack"},{level:12,move:"Fury Attack"},{level:15,move:"Pluck"},{level:19,move:"Double Hit"},{level:23,move:"Agility"},{level:26,move:"Uproar"},{level:30,move:"Acupressure"},{level:34,move:"Swords Dance"},{level:38,move:"Drill Peck"},{level:43,move:"Endeavor"},{level:50,move:"Thrash"}],
    tm: ["Swords Dance","Fly","Body Slam","Take Down","Double-Edge","Hyper Beam","Low Kick","Agility","Swift","Rest","Substitute","Thief","Protect","Scary Face","Mud-Slap","Endure","Sleep Talk","Baton Pass","Rain Dance","Sunny Day","Uproar","Facade","Taunt","Helping Hand","Knock Off","Endeavor","Feather Dance","Aerial Ace","Tailwind","Brave Bird","Giga Impact","Acrobatics","Drill Run","Throat Chop","Lunge","Stomping Tantrum","Tera Blast","Pounce","Trailblaze"],
    egg: ["Whirlwind","Sky Attack","Flail","Assurance"],
    max: []
  },
  86: {
    levelUp: [{level:1,move:"Headbutt"},{level:3,move:"Growl"},{level:7,move:"Charm"},{level:11,move:"Icy Wind"},{level:13,move:"Encore"},{level:17,move:"Ice Shard"},{level:21,move:"Rest"},{level:23,move:"Aqua Ring"},{level:27,move:"Aurora Beam"},{level:31,move:"Aqua Jet"},{level:33,move:"Brine"},{level:37,move:"Take Down"},{level:41,move:"Dive"},{level:43,move:"Aqua Tail"},{level:47,move:"Ice Beam"},{level:51,move:"Safeguard"},{level:53,move:"Snowscape"}],
    tm: ["Body Slam","Take Down","Double-Edge","Hydro Pump","Surf","Ice Beam","Blizzard","Haze","Waterfall","Rest","Substitute","Thief","Curse","Protect","Icy Wind","Endure","Charm","Sleep Talk","Encore","Rain Dance","Whirlpool","Uproar","Facade","Helping Hand","Weather Ball","Muddy Water","Icicle Spear","Water Pulse","Fling","Avalanche","Drill Run","Smart Strike","Flip Turn","Triple Axel","Tera Blast","Ice Spinner","Snowscape","Chilling Water"],
    egg: ["Horn Drill","Disable","Lick","Perish Song","Fake Out","Stockpile","Spit Up","Swallow","Entrainment","Belch"],
    max: []
  },
  87: {
    levelUp: [{level:0,move:"Sheer Cold"},{level:1,move:"Headbutt"},{level:1,move:"Growl"},{level:1,move:"Icy Wind"},{level:13,move:"Encore"},{level:17,move:"Ice Shard"},{level:21,move:"Rest"},{level:23,move:"Aqua Ring"},{level:27,move:"Aurora Beam"},{level:31,move:"Aqua Jet"},{level:33,move:"Brine"},{level:39,move:"Take Down"},{level:45,move:"Dive"},{level:49,move:"Aqua Tail"},{level:55,move:"Ice Beam"},{level:61,move:"Safeguard"},{level:65,move:"Snowscape"}],
    tm: ["Body Slam","Take Down","Double-Edge","Hydro Pump","Surf","Ice Beam","Blizzard","Hyper Beam","Haze","Waterfall","Rest","Substitute","Thief","Curse","Protect","Icy Wind","Endure","Charm","Sleep Talk","Encore","Rain Dance","Whirlpool","Uproar","Facade","Helping Hand","Knock Off","Endeavor","Weather Ball","Muddy Water","Icicle Spear","Water Pulse","Fling","Giga Impact","Avalanche","Drill Run","Play Rough","Smart Strike","Liquidation","Flip Turn","Triple Axel","Tera Blast","Ice Spinner","Snowscape","Chilling Water","Alluring Voice"],
    egg: ["Horn Drill","Disable","Lick","Perish Song","Fake Out","Stockpile","Spit Up","Swallow","Entrainment","Belch"],
    max: []
  },
  88: {
    levelUp: [{level:1,move:"Pound"},{level:1,move:"Poison Gas"},{level:4,move:"Harden"},{level:7,move:"Mud-Slap"},{level:12,move:"Disable"},{level:15,move:"Sludge"},{level:18,move:"Mud Shot"},{level:21,move:"Minimize"},{level:26,move:"Toxic"},{level:29,move:"Sludge Bomb"},{level:32,move:"Sludge Wave"},{level:37,move:"Screech"},{level:40,move:"Gunk Shot"},{level:43,move:"Acid Armor"},{level:46,move:"Belch"},{level:48,move:"Memento"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Take Down","Flamethrower","Thunderbolt","Thunder","Dig","Confuse Ray","Metronome","Fire Blast","Rest","Rock Slide","Substitute","Thief","Protect","Scary Face","Sludge Bomb","Mud-Slap","Sandstorm","Giga Drain","Endure","Sleep Talk","Rain Dance","Sunny Day","Shadow Ball","Facade","Taunt","Helping Hand","Imprison","Rock Tomb","Mud Shot","Fling","Poison Jab","Drain Punch","Zen Headbutt","Gunk Shot","Venoshock","Acid Spray","Hex","Tera Blast","Haze","Toxic","Pain Split","Sludge Wave","Curse"],
    egg: ["Haze","Curse","Mean Look","Stockpile","Spit Up","Swallow","Shadow Punch","Shadow Sneak","Acid Spray"],
    max: []
  },
  89: {
    levelUp: [{level:1,move:"Pound"},{level:1,move:"Harden"},{level:1,move:"Poison Gas"},{level:1,move:"Mud-Slap"},{level:12,move:"Disable"},{level:15,move:"Sludge"},{level:18,move:"Mud Shot"},{level:21,move:"Minimize"},{level:26,move:"Toxic"},{level:29,move:"Sludge Bomb"},{level:32,move:"Sludge Wave"},{level:37,move:"Screech"},{level:40,move:"Gunk Shot"},{level:46,move:"Acid Armor"},{level:52,move:"Belch"},{level:57,move:"Memento"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Take Down","Flamethrower","Hyper Beam","Thunderbolt","Thunder","Dig","Confuse Ray","Metronome","Fire Blast","Swift","Rest","Rock Slide","Substitute","Thief","Protect","Scary Face","Sludge Bomb","Mud-Slap","Sandstorm","Giga Drain","Endure","Sleep Talk","Rain Dance","Sunny Day","Shadow Ball","Facade","Taunt","Helping Hand","Brick Break","Imprison","Rock Tomb","Mud Shot","Fling","Toxic Spikes","Poison Jab","Dark Pulse","Drain Punch","Focus Blast","Giga Impact","Zen Headbutt","Gunk Shot","Venoshock","Acid Spray","Hex","Tera Blast","Haze","Toxic","Spite","Knock Off","Lunge","Focus Punch","Lash Out","Pain Split","Sludge Wave","Curse"],
    egg: [],
    max: []
  },
  90: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Water Gun"},{level:4,move:"Withdraw"},{level:8,move:"Ice Shard"},{level:12,move:"Leer"},{level:16,move:"Whirlpool"},{level:20,move:"Supersonic"},{level:24,move:"Aurora Beam"},{level:28,move:"Protect"},{level:32,move:"Razor Shell"},{level:36,move:"Iron Defense"},{level:40,move:"Ice Beam"},{level:44,move:"Shell Smash"},{level:48,move:"Hydro Pump"}],
    tm: ["Take Down","Hydro Pump","Surf","Ice Beam","Blizzard","Waterfall","Swift","Rest","Substitute","Protect","Spikes","Icy Wind","Endure","Sleep Talk","Rain Dance","Facade","Helping Hand","Iron Defense","Mud Shot","Rock Blast","Water Pulse","Toxic Spikes","Avalanche","Liquidation","Tera Blast","Ice Spinner","Snowscape","Chilling Water","Icicle Spear","Whirlpool"],
    egg: ["Bubble Beam","Water Pulse","Aqua Ring","Life Dew"],
    max: []
  },
  91: {
    levelUp: [{level:0,move:"Icicle Spear"},{level:1,move:"Icicle Crash"},{level:1,move:"Shell Smash"},{level:1,move:"Ice Shard"},{level:1,move:"Toxic Spikes"},{level:1,move:"Iron Defense"},{level:1,move:"Whirlpool"},{level:1,move:"Spikes"},{level:1,move:"Protect"},{level:1,move:"Withdraw"},{level:1,move:"Aurora Beam"},{level:1,move:"Ice Beam"},{level:1,move:"Hydro Pump"},{level:1,move:"Water Gun"},{level:1,move:"Supersonic"},{level:1,move:"Leer"},{level:1,move:"Tackle"},{level:5,move:"Razor Shell"}],
    tm: ["Body Slam","Take Down","Hydro Pump","Surf","Ice Beam","Blizzard","Hyper Beam","Light Screen","Waterfall","Swift","Rest","Substitute","Protect","Scary Face","Spikes","Icy Wind","Endure","Sleep Talk","Rain Dance","Facade","Helping Hand","Iron Defense","Mud Shot","Rock Blast","Water Pulse","Toxic Spikes","Poison Jab","Giga Impact","Avalanche","Drill Run","Smart Strike","Liquidation","Tera Blast","Ice Spinner","Snowscape","Chilling Water","Icicle Spear","Weather Ball","Whirlpool"],
    egg: [],
    max: []
  },
  92: {
    levelUp: [{level:1,move:"Confuse Ray"},{level:1,move:"Lick"},{level:4,move:"Hypnosis"},{level:8,move:"Mean Look"},{level:12,move:"Payback"},{level:16,move:"Spite"},{level:20,move:"Curse"},{level:24,move:"Hex"},{level:28,move:"Night Shade"},{level:32,move:"Sucker Punch"},{level:36,move:"Dark Pulse"},{level:40,move:"Shadow Ball"},{level:44,move:"Destiny Bond"},{level:48,move:"Dream Eater"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Thunderbolt","Thunder","Psychic","Night Shade","Confuse Ray","Rest","Substitute","Thief","Protect","Scary Face","Sludge Bomb","Icy Wind","Giga Drain","Endure","Sleep Talk","Rain Dance","Sunny Day","Shadow Ball","Will-O-Wisp","Facade","Taunt","Trick","Skill Swap","Imprison","Poison Jab","Dark Pulse","Energy Ball","Nasty Plot","Trick Room","Gunk Shot","Venoshock","Acid Spray","Foul Play","Hex","Dazzling Gleam","Tera Blast","Haze","Toxic","Spite","Poltergeist","Pain Split","Psych Up","Sludge Wave","Skitter Smack","Curse"],
    egg: ["Disable","Toxic","Haze","Smog","Perish Song","Astonish","Clear Smog","Reflect Type"],
    max: []
  },
  93: {
    levelUp: [{level:0,move:"Shadow Punch"},{level:1,move:"Hypnosis"},{level:1,move:"Confuse Ray"},{level:1,move:"Lick"},{level:1,move:"Mean Look"},{level:12,move:"Payback"},{level:16,move:"Spite"},{level:20,move:"Curse"},{level:24,move:"Hex"},{level:30,move:"Night Shade"},{level:36,move:"Sucker Punch"},{level:42,move:"Dark Pulse"},{level:48,move:"Shadow Ball"},{level:54,move:"Destiny Bond"},{level:60,move:"Dream Eater"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Thunderbolt","Thunder","Psychic","Night Shade","Confuse Ray","Metronome","Rest","Substitute","Thief","Protect","Scary Face","Sludge Bomb","Icy Wind","Giga Drain","Endure","Sleep Talk","Encore","Rain Dance","Sunny Day","Shadow Ball","Will-O-Wisp","Facade","Taunt","Trick","Skill Swap","Imprison","Fling","Toxic Spikes","Poison Jab","Dark Pulse","Focus Blast","Energy Ball","Nasty Plot","Shadow Claw","Trick Room","Gunk Shot","Venoshock","Acid Spray","Foul Play","Hex","Phantom Force","Dazzling Gleam","Tera Blast","Haze","Toxic","Spite","Poltergeist","Pain Split","Psych Up","Sludge Wave","Skitter Smack","Curse"],
    egg: [],
    max: []
  },
  94: {
    levelUp: [{level:1,move:"Mean Look"},{level:1,move:"Shadow Punch"},{level:1,move:"Reflect Type"},{level:1,move:"Perish Song"},{level:1,move:"Lick"},{level:1,move:"Confuse Ray"},{level:1,move:"Hypnosis"},{level:12,move:"Payback"},{level:16,move:"Spite"},{level:20,move:"Curse"},{level:24,move:"Hex"},{level:30,move:"Night Shade"},{level:36,move:"Sucker Punch"},{level:42,move:"Dark Pulse"},{level:48,move:"Shadow Ball"},{level:54,move:"Destiny Bond"},{level:60,move:"Dream Eater"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Hyper Beam","Thunderbolt","Thunder Wave","Thunder","Psychic","Night Shade","Confuse Ray","Metronome","Rest","Substitute","Thief","Protect","Scary Face","Sludge Bomb","Icy Wind","Giga Drain","Endure","Sleep Talk","Encore","Rain Dance","Sunny Day","Shadow Ball","Will-O-Wisp","Facade","Taunt","Trick","Brick Break","Skill Swap","Imprison","Fling","Toxic Spikes","Poison Jab","Dark Pulse","Drain Punch","Focus Blast","Energy Ball","Giga Impact","Nasty Plot","Shadow Claw","Trick Room","Gunk Shot","Venoshock","Acid Spray","Foul Play","Hex","Phantom Force","Dazzling Gleam","Tera Blast","Haze","Toxic","Spite","Knock Off","Focus Punch","Poltergeist","Pain Split","Psych Up","Sludge Wave","Skitter Smack","Curse","Psychic Noise"],
    egg: [],
    max: []
  },
  95: {
    levelUp: [{level:1,move:"Rollout"},{level:6,move:"Tackle"},{level:11,move:"Bulldoze"},{level:18,move:"Rock Slide"},{level:25,move:"Stealth Rock"},{level:34,move:"High Horsepower"},{level:43,move:"Iron Tail"}],
    tm: [],
    egg: [],
    max: []
  },
  96: {
    levelUp: [{level:1,move:"Pound"},{level:1,move:"Hypnosis"},{level:5,move:"Disable"},{level:9,move:"Confusion"},{level:13,move:"Headbutt"},{level:17,move:"Poison Gas"},{level:21,move:"Psybeam"},{level:25,move:"Psych Up"},{level:29,move:"Zen Headbutt"},{level:33,move:"Swagger"},{level:37,move:"Psychic"},{level:41,move:"Nasty Plot"},{level:45,move:"Psyshock"},{level:49,move:"Future Sight"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Take Down","Psybeam","Low Kick","Thunder Wave","Psychic","Night Shade","Light Screen","Reflect","Metronome","Swift","Rest","Substitute","Thief","Protect","Endure","Sleep Talk","Encore","Rain Dance","Sunny Day","Shadow Ball","Facade","Taunt","Helping Hand","Trick","Brick Break","Skill Swap","Imprison","Calm Mind","Fling","Drain Punch","Focus Blast","Nasty Plot","Zen Headbutt","Trick Room","Grass Knot","Psyshock","Low Sweep","Foul Play","Stored Power","Draining Kiss","Dazzling Gleam","Psychic Terrain","Tera Blast","Trailblaze","Haze","Toxic","Knock Off","Focus Punch","Psych Up","Double-Edge","Endeavor","Future Sight","Expanding Force","Curse","Psychic Noise"],
    egg: ["Fire Punch","Ice Punch","Thunder Punch","Flatter","Role Play","Guard Swap","Psycho Cut","Power Split"],
    max: []
  },
  97: {
    levelUp: [{level:1,move:"Pound"},{level:1,move:"Disable"},{level:1,move:"Confusion"},{level:1,move:"Hypnosis"},{level:1,move:"Switcheroo"},{level:13,move:"Headbutt"},{level:17,move:"Poison Gas"},{level:21,move:"Psybeam"},{level:25,move:"Psych Up"},{level:32,move:"Zen Headbutt"},{level:37,move:"Swagger"},{level:42,move:"Psychic"},{level:47,move:"Nasty Plot"},{level:51,move:"Psyshock"},{level:56,move:"Future Sight"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Take Down","Psybeam","Hyper Beam","Low Kick","Thunder Wave","Psychic","Night Shade","Confuse Ray","Light Screen","Reflect","Metronome","Swift","Rest","Substitute","Thief","Protect","Scary Face","Endure","Sleep Talk","Baton Pass","Encore","Rain Dance","Sunny Day","Shadow Ball","Facade","Taunt","Helping Hand","Trick","Brick Break","Skill Swap","Imprison","Calm Mind","Fling","Drain Punch","Focus Blast","Giga Impact","Nasty Plot","Zen Headbutt","Trick Room","Grass Knot","Psyshock","Low Sweep","Foul Play","Stored Power","Hex","Draining Kiss","Dazzling Gleam","Psychic Terrain","Body Press","Tera Blast","Trailblaze","Haze","Toxic","Knock Off","Focus Punch","Psych Up","Double-Edge","Endeavor","Future Sight","Expanding Force","Curse","Psychic Noise"],
    egg: [],
    max: []
  },
  98: {
    levelUp: [{level:1,move:"Leer"},{level:1,move:"Water Gun"},{level:4,move:"Harden"},{level:8,move:"Metal Claw"},{level:12,move:"Mud Shot"},{level:16,move:"Protect"},{level:20,move:"Bubble Beam"},{level:24,move:"Stomp"},{level:29,move:"Flail"},{level:32,move:"Razor Shell"},{level:36,move:"Slam"},{level:40,move:"Swords Dance"},{level:44,move:"Crabhammer"},{level:48,move:"Guillotine"}],
    tm: ["Swords Dance","Cut","Surf","Ice Beam","Blizzard","Strength","Dig","Double Team","Rest","Rock Slide","Substitute","Thief","Protect","Endure","False Swipe","Swagger","Attract","Sleep Talk","Rain Dance","Rock Smash","Hail","Facade","Brick Break","Rock Tomb","Water Pulse","Brine","Fling","X-Scissor","Scald"],
    egg: ["Slam","Agility","Haze","Amnesia","Slash","Flail","Ancient Power","Knock Off","Tickle","Hammer Arm","Night Slash","Ally Switch"],
    max: []
  },
  99: {
    levelUp: [{level:1,move:"Hammer Arm"},{level:1,move:"Harden"},{level:1,move:"Leer"},{level:1,move:"Metal Claw"},{level:1,move:"Water Gun"},{level:1,move:"Wide Guard"},{level:12,move:"Mud Shot"},{level:16,move:"Protect"},{level:20,move:"Bubble Beam"},{level:24,move:"Stomp"},{level:31,move:"Flail"},{level:36,move:"Razor Shell"},{level:42,move:"Slam"},{level:48,move:"Swords Dance"},{level:54,move:"Crabhammer"},{level:60,move:"Guillotine"}],
    tm: ["Swords Dance","Cut","Surf","Ice Beam","Blizzard","Hyper Beam","Strength","Dig","Double Team","Rest","Rock Slide","Substitute","Thief","Protect","Endure","False Swipe","Swagger","Attract","Sleep Talk","Rain Dance","Rock Smash","Hail","Facade","Brick Break","Rock Tomb","Water Pulse","Brine","Fling","X-Scissor","Giga Impact","Scald"],
    egg: [],
    max: []
  },
  100: {
    levelUp: [{level:1,move:"Charge"},{level:1,move:"Tackle"},{level:4,move:"Thunder Shock"},{level:6,move:"Eerie Impulse"},{level:9,move:"Spark"},{level:11,move:"Rollout"},{level:13,move:"Screech"},{level:16,move:"Charge Beam"},{level:20,move:"Swift"},{level:22,move:"Electro Ball"},{level:26,move:"Self-Destruct"},{level:29,move:"Light Screen"},{level:34,move:"Magnet Rise"},{level:37,move:"Discharge"},{level:41,move:"Explosion"},{level:46,move:"Gyro Ball"},{level:50,move:"Mirror Coat"}],
    tm: ["Take Down","Thunderbolt","Thunder Wave","Thunder","Agility","Light Screen","Swift","Rest","Substitute","Thief","Protect","Endure","Sleep Talk","Rain Dance","Facade","Taunt","Helping Hand","Charge Beam","Electro Ball","Foul Play","Volt Switch","Wild Charge","Eerie Impulse","Electric Terrain","Tera Blast","Charge","Gyro Ball","Double-Edge","Electroweb","Metal Sound"],
    egg: ["Recycle","Metal Sound"],
    max: []
  },
  101: {
    levelUp: [{level:1,move:"Eerie Impulse"},{level:1,move:"Charge"},{level:1,move:"Magnetic Flux"},{level:1,move:"Tackle"},{level:1,move:"Thunder Shock"},{level:9,move:"Spark"},{level:11,move:"Rollout"},{level:13,move:"Screech"},{level:16,move:"Charge Beam"},{level:20,move:"Swift"},{level:22,move:"Electro Ball"},{level:26,move:"Self-Destruct"},{level:29,move:"Light Screen"},{level:36,move:"Magnet Rise"},{level:41,move:"Discharge"},{level:47,move:"Explosion"},{level:54,move:"Gyro Ball"},{level:58,move:"Mirror Coat"}],
    tm: ["Take Down","Hyper Beam","Thunderbolt","Thunder Wave","Thunder","Agility","Light Screen","Swift","Rest","Substitute","Thief","Protect","Scary Face","Endure","Sleep Talk","Rain Dance","Facade","Taunt","Helping Hand","Giga Impact","Charge Beam","Electro Ball","Foul Play","Volt Switch","Wild Charge","Eerie Impulse","Electric Terrain","Tera Blast","Charge","Gyro Ball","Double-Edge","Supercell Slam","Electroweb","Metal Sound","Curse"],
    egg: [],
    max: []
  },
  102: {
    levelUp: [{level:1,move:"Absorb"},{level:1,move:"Hypnosis"},{level:5,move:"Reflect"},{level:10,move:"Leech Seed"},{level:15,move:"Mega Drain"},{level:20,move:"Confusion"},{level:25,move:"Synthesis"},{level:30,move:"Bullet Seed"},{level:35,move:"Giga Drain"},{level:40,move:"Extrasensory"},{level:45,move:"Uproar"},{level:50,move:"Worry Seed"},{level:55,move:"Solar Beam"}],
    tm: ["Swords Dance","Psybeam","Solar Beam","Psychic","Light Screen","Reflect","Rest","Substitute","Thief","Curse","Protect","Sludge Bomb","Giga Drain","Endure","Sleep Talk","Sunny Day","Psych Up","Uproar","Facade","Helping Hand","Trick","Skill Swap","Imprison","Bullet Seed","Seed Bomb","Energy Ball","Zen Headbutt","Leaf Storm","Grass Knot","Psyshock","Stored Power","Grassy Terrain","Grassy Glide","Tera Blast","Psychic Noise"],
    egg: ["Poison Powder","Stun Spore","Sleep Powder","Curse","Moonlight","Ancient Power","Ingrain","Block"],
    max: []
  },
  103: {
    levelUp: [{level:0,move:"Stomp"},{level:1,move:"Leaf Storm"},{level:1,move:"Seed Bomb"},{level:1,move:"Worry Seed"},{level:1,move:"Bullet Seed"},{level:1,move:"Extrasensory"},{level:1,move:"Uproar"},{level:1,move:"Synthesis"},{level:1,move:"Psyshock"},{level:1,move:"Reflect"},{level:1,move:"Hypnosis"},{level:1,move:"Confusion"},{level:1,move:"Solar Beam"},{level:1,move:"Leech Seed"},{level:1,move:"Mega Drain"},{level:1,move:"Absorb"},{level:1,move:"Wood Hammer"},{level:1,move:"Giga Drain"}],
    tm: ["Swords Dance","Body Slam","Take Down","Double-Edge","Psybeam","Hyper Beam","Low Kick","Solar Beam","Earthquake","Psychic","Light Screen","Reflect","Rest","Substitute","Thief","Curse","Protect","Sludge Bomb","Giga Drain","Endure","Sleep Talk","Sunny Day","Psych Up","Future Sight","Uproar","Facade","Helping Hand","Trick","Skill Swap","Imprison","Bullet Seed","Magical Leaf","Calm Mind","Gravity","Seed Bomb","Energy Ball","Giga Impact","Zen Headbutt","Trick Room","Leaf Storm","Grass Knot","Psyshock","Stored Power","Bulldoze","Grassy Terrain","Psychic Terrain","Stomping Tantrum","Expanding Force","Grassy Glide","Tera Blast","Psychic Noise"],
    egg: [],
    max: []
  },
  104: {
    levelUp: [{level:1,move:"Growl"},{level:1,move:"Mud-Slap"},{level:4,move:"Tail Whip"},{level:8,move:"False Swipe"},{level:12,move:"Headbutt"},{level:16,move:"Retaliate"},{level:20,move:"Fling"},{level:24,move:"Stomping Tantrum"},{level:29,move:"Bone Rush"},{level:32,move:"Focus Energy"},{level:36,move:"Endeavor"},{level:40,move:"Bonemerang"},{level:44,move:"Thrash"},{level:48,move:"Double-Edge"}],
    tm: ["Swords Dance","Flamethrower","Ice Beam","Blizzard","Strength","Earthquake","Dig","Double Team","Fire Blast","Rest","Rock Slide","Substitute","Thief","Protect","Sandstorm","Endure","False Swipe","Swagger","Attract","Sleep Talk","Iron Tail","Sunny Day","Rock Smash","Facade","Focus Punch","Brick Break","Rock Tomb","Aerial Ace","Fling","Rock Climb","Stealth Rock","Bulldoze"],
    egg: ["Double Kick","Leer","Screech","Skull Bash","Curse","Belly Drum","Perish Song","Detect","Ancient Power","Iron Head"],
    max: []
  },
  105: {
    levelUp: [{level:1,move:"False Swipe"},{level:1,move:"Growl"},{level:1,move:"Mud-Slap"},{level:1,move:"Tail Whip"},{level:12,move:"Headbutt"},{level:16,move:"Retaliate"},{level:20,move:"Fling"},{level:24,move:"Stomping Tantrum"},{level:31,move:"Bone Rush"},{level:36,move:"Focus Energy"},{level:42,move:"Endeavor"},{level:48,move:"Bonemerang"},{level:54,move:"Thrash"},{level:60,move:"Double-Edge"}],
    tm: ["Swords Dance","Flamethrower","Ice Beam","Blizzard","Hyper Beam","Strength","Earthquake","Dig","Double Team","Fire Blast","Rest","Rock Slide","Substitute","Thief","Protect","Sandstorm","Endure","False Swipe","Swagger","Attract","Sleep Talk","Iron Tail","Sunny Day","Rock Smash","Facade","Focus Punch","Brick Break","Rock Tomb","Aerial Ace","Fling","Focus Blast","Giga Impact","Rock Climb","Stone Edge","Stealth Rock","Bulldoze"],
    egg: [],
    max: []
  },
  106: {
    levelUp: [{level:0,move:"Brick Break"},{level:1,move:"Fake Out"},{level:1,move:"Tackle"},{level:1,move:"Helping Hand"},{level:1,move:"Focus Energy"},{level:1,move:"Low Sweep"},{level:4,move:"Double Kick"},{level:8,move:"Low Kick"},{level:12,move:"Endure"},{level:16,move:"Sucker Punch"},{level:21,move:"Wide Guard"},{level:24,move:"Blaze Kick"},{level:28,move:"Feint"},{level:32,move:"Mega Kick"},{level:36,move:"Close Combat"},{level:40,move:"Reversal"},{level:44,move:"High Jump Kick"},{level:50,move:"Axe Kick"}],
    tm: ["Swords Dance","Body Slam","Take Down","Double-Edge","Low Kick","Earthquake","Metronome","Swift","Rest","Rock Slide","Substitute","Thief","Reversal","Protect","Scary Face","Mud-Slap","Endure","Sleep Talk","Baton Pass","Rain Dance","Sunny Day","Uproar","Facade","Taunt","Helping Hand","Brick Break","Knock Off","Endeavor","Rock Tomb","Bulk Up","Close Combat","Fling","Aura Sphere","Poison Jab","Vacuum Wave","Focus Blast","Giga Impact","Stone Edge","Low Sweep","Bulldoze","Throat Chop","Lunge","Stomping Tantrum","Coaching","Tera Blast","Upper Hand"],
    egg: ["Counter","High Jump Kick","Mach Punch","Rapid Spin","Feint","Vacuum Wave","Bullet Punch"],
    max: []
  },
  107: {
    levelUp: [{level:0,move:"Drain Punch"},{level:1,move:"Feint"},{level:1,move:"Tackle"},{level:1,move:"Helping Hand"},{level:1,move:"Fake Out"},{level:1,move:"Focus Energy"},{level:4,move:"Mach Punch"},{level:8,move:"Vacuum Wave"},{level:12,move:"Detect"},{level:16,move:"Bullet Punch"},{level:21,move:"Quick Guard"},{level:24,move:"Thunder Punch"},{level:24,move:"Ice Punch"},{level:24,move:"Fire Punch"},{level:28,move:"Agility"},{level:32,move:"Mega Punch"},{level:36,move:"Close Combat"},{level:40,move:"Counter"},{level:44,move:"Focus Punch"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Swords Dance","Body Slam","Take Down","Double-Edge","Low Kick","Earthquake","Agility","Metronome","Swift","Rest","Rock Slide","Substitute","Thief","Reversal","Protect","Scary Face","Mud-Slap","Endure","Sleep Talk","Baton Pass","Encore","Rain Dance","Sunny Day","Uproar","Facade","Focus Punch","Taunt","Helping Hand","Brick Break","Knock Off","Endeavor","Rock Tomb","Bulk Up","Close Combat","Fling","Aura Sphere","Poison Jab","Drain Punch","Vacuum Wave","Focus Blast","Giga Impact","Stone Edge","Low Sweep","Bulldoze","Throat Chop","Coaching","Tera Blast","Trailblaze","Upper Hand"],
    egg: ["Counter","High Jump Kick","Mach Punch","Rapid Spin","Feint","Vacuum Wave","Bullet Punch"],
    max: []
  },
  108: {
    levelUp: [{level:1,move:"Tackle"},{level:6,move:"Rest"},{level:11,move:"Bulldoze"},{level:18,move:"Zen Headbutt"},{level:25,move:"Double-Edge"},{level:34,move:"Rollout"},{level:43,move:"Giga Impact"}],
    tm: [],
    egg: [],
    max: []
  },
  109: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Poison Gas"},{level:4,move:"Smog"},{level:8,move:"Smokescreen"},{level:12,move:"Clear Smog"},{level:16,move:"Assurance"},{level:20,move:"Sludge"},{level:24,move:"Haze"},{level:28,move:"Self-Destruct"},{level:32,move:"Sludge Bomb"},{level:36,move:"Toxic"},{level:40,move:"Belch"},{level:44,move:"Explosion"},{level:48,move:"Memento"},{level:52,move:"Destiny Bond"}],
    tm: ["Body Slam","Take Down","Flamethrower","Psybeam","Thunderbolt","Thunder","Toxic","Haze","Fire Blast","Rest","Substitute","Thief","Spite","Protect","Scary Face","Sludge Bomb","Endure","Sleep Talk","Rain Dance","Sunny Day","Shadow Ball","Will-O-Wisp","Facade","Taunt","Gyro Ball","Toxic Spikes","Dark Pulse","Gunk Shot","Venoshock","Acid Spray","Tera Blast","Pain Split","Sludge Wave","Curse"],
    egg: ["Curse","Spite","Pain Split","Stockpile","Spit Up","Swallow"],
    max: []
  },
  110: {
    levelUp: [{level:0,move:"Double Hit"},{level:1,move:"Tackle"},{level:1,move:"Smokescreen"},{level:1,move:"Smog"},{level:1,move:"Poison Gas"},{level:1,move:"Heat Wave"},{level:12,move:"Clear Smog"},{level:16,move:"Assurance"},{level:20,move:"Sludge"},{level:24,move:"Haze"},{level:28,move:"Self-Destruct"},{level:32,move:"Sludge Bomb"},{level:38,move:"Toxic"},{level:44,move:"Belch"},{level:50,move:"Explosion"},{level:56,move:"Memento"},{level:62,move:"Destiny Bond"}],
    tm: ["Body Slam","Take Down","Flamethrower","Psybeam","Hyper Beam","Thunderbolt","Thunder","Toxic","Haze","Fire Blast","Rest","Substitute","Thief","Spite","Protect","Scary Face","Sludge Bomb","Endure","Sleep Talk","Rain Dance","Sunny Day","Shadow Ball","Heat Wave","Will-O-Wisp","Facade","Taunt","Gyro Ball","Toxic Spikes","Dark Pulse","Giga Impact","Gunk Shot","Venoshock","Acid Spray","Tera Blast","Pain Split","Sludge Wave","Curse"],
    egg: [],
    max: []
  },
  111: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Tail Whip"},{level:5,move:"Smack Down"},{level:10,move:"Bulldoze"},{level:15,move:"Horn Attack"},{level:20,move:"Scary Face"},{level:25,move:"Stomp"},{level:30,move:"Rock Blast"},{level:35,move:"Drill Run"},{level:40,move:"Take Down"},{level:45,move:"Earthquake"},{level:50,move:"Stone Edge"},{level:55,move:"Megahorn"},{level:60,move:"Horn Drill"}],
    tm: ["Swords Dance","Body Slam","Take Down","Double-Edge","Roar","Flamethrower","Ice Beam","Blizzard","Thunderbolt","Thunder","Earthquake","Dig","Fire Blast","Rest","Rock Slide","Substitute","Thief","Curse","Reversal","Protect","Scary Face","Mud-Slap","Icy Wind","Sandstorm","Endure","Sleep Talk","Rain Dance","Sunny Day","Crunch","Uproar","Facade","Endeavor","Rock Tomb","Mud Shot","Rock Blast","Poison Jab","Dragon Pulse","Earth Power","Thunder Fang","Ice Fang","Fire Fang","Stone Edge","Stealth Rock","Smack Down","Heavy Slam","Bulldoze","Drill Run","High Horsepower","Smart Strike","Stomping Tantrum","Body Press","Scorching Sands","Tera Blast","Supercell Slam"],
    egg: ["Counter","Curse","Metal Burst","Rock Polish","Dragon Rush","Guard Split"],
    max: []
  },
  112: {
    levelUp: [{level:0,move:"Hammer Arm"},{level:1,move:"Tackle"},{level:1,move:"Tail Whip"},{level:1,move:"Smack Down"},{level:1,move:"Bulldoze"},{level:15,move:"Horn Attack"},{level:20,move:"Scary Face"},{level:25,move:"Stomp"},{level:30,move:"Rock Blast"},{level:35,move:"Drill Run"},{level:40,move:"Take Down"},{level:47,move:"Earthquake"},{level:54,move:"Stone Edge"},{level:61,move:"Megahorn"},{level:68,move:"Horn Drill"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Swords Dance","Body Slam","Take Down","Double-Edge","Roar","Flamethrower","Hydro Pump","Surf","Ice Beam","Blizzard","Hyper Beam","Thunderbolt","Thunder","Earthquake","Dig","Fire Blast","Rest","Rock Slide","Substitute","Thief","Curse","Reversal","Protect","Scary Face","Mud-Slap","Icy Wind","Outrage","Sandstorm","Endure","Sleep Talk","Rain Dance","Sunny Day","Crunch","Uproar","Facade","Focus Punch","Helping Hand","Brick Break","Endeavor","Rock Tomb","Iron Defense","Mud Shot","Rock Blast","Fling","Poison Jab","Dragon Pulse","Focus Blast","Earth Power","Giga Impact","Avalanche","Shadow Claw","Thunder Fang","Ice Fang","Fire Fang","Stone Edge","Stealth Rock","Smack Down","Heavy Slam","Bulldoze","Drill Run","Heat Crash","High Horsepower","Smart Strike","Stomping Tantrum","Body Press","Breaking Swipe","Meteor Beam","Scorching Sands","Tera Blast","Supercell Slam"],
    egg: ["Counter","Curse","Metal Burst","Rock Polish","Dragon Rush","Guard Split"],
    max: []
  },
  113: {
    levelUp: [{level:1,move:"Charm"},{level:1,move:"Copycat"},{level:1,move:"Covet"},{level:1,move:"Disarming Voice"},{level:1,move:"Sweet Kiss"},{level:1,move:"Pound"},{level:1,move:"Defense Curl"},{level:4,move:"Tail Whip"},{level:8,move:"Echoed Voice"},{level:12,move:"Life Dew"},{level:16,move:"Sing"},{level:20,move:"Fling"},{level:24,move:"Take Down"},{level:28,move:"Heal Pulse"},{level:32,move:"Helping Hand"},{level:36,move:"Light Screen"},{level:40,move:"Double-Edge"},{level:44,move:"Soft-Boiled"},{level:48,move:"Last Resort"},{level:52,move:"Healing Wish"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Take Down","Flamethrower","Ice Beam","Blizzard","Hyper Beam","Solar Beam","Thunderbolt","Thunder Wave","Thunder","Earthquake","Psychic","Light Screen","Metronome","Fire Blast","Swift","Rest","Rock Slide","Substitute","Thief","Protect","Icy Wind","Sandstorm","Endure","Charm","Sleep Talk","Rain Dance","Sunny Day","Shadow Ball","Facade","Helping Hand","Brick Break","Skill Swap","Hyper Voice","Rock Tomb","Calm Mind","Water Pulse","Fling","Drain Punch","Focus Blast","Giga Impact","Zen Headbutt","Stealth Rock","Grass Knot","Stored Power","Bulldoze","Wild Charge","Disarming Voice","Electric Terrain","Dazzling Gleam","Stomping Tantrum","Tera Blast","Snowscape","Trailblaze","Chilling Water","Gravity","Double-Edge","Endeavor"],
    egg: ["Seismic Toss","Heal Bell","Present","Gravity"],
    max: []
  },
  114: {
    levelUp: [{level:1,move:"Absorb"},{level:6,move:"Stun Spore"},{level:11,move:"Poison Powder"},{level:15,move:"Acid Spray"},{level:18,move:"Double Hit"},{level:25,move:"Energy Ball"},{level:34,move:"Ancient Power"},{level:43,move:"Sleep Powder"}],
    tm: [],
    egg: [],
    max: []
  },
  115: {
    levelUp: [{level:1,move:"Pound"},{level:1,move:"Tail Whip"},{level:4,move:"Growl"},{level:8,move:"Fake Out"},{level:12,move:"Bite"},{level:16,move:"Stomp"},{level:20,move:"Focus Energy"},{level:24,move:"Headbutt"},{level:28,move:"Sucker Punch"},{level:32,move:"Double Hit"},{level:36,move:"Crunch"},{level:40,move:"Endure"},{level:44,move:"Reversal"},{level:48,move:"Outrage"},{level:52,move:"Last Resort"}],
    tm: ["Cut","Roar","Flamethrower","Surf","Ice Beam","Blizzard","Hyper Beam","Strength","Solar Beam","Thunderbolt","Thunder","Earthquake","Dig","Double Team","Fire Blast","Rest","Rock Slide","Substitute","Thief","Protect","Sandstorm","Endure","Swagger","Attract","Sleep Talk","Safeguard","Iron Tail","Rain Dance","Sunny Day","Shadow Ball","Rock Smash","Hail","Facade","Focus Punch","Brick Break","Rock Tomb","Aerial Ace","Shock Wave","Water Pulse","Fling","Drain Punch","Focus Blast","Giga Impact","Avalanche","Shadow Claw","Rock Climb","Bulldoze","Work Up"],
    egg: ["Stomp","Double-Edge","Disable","Counter","Focus Energy","Uproar","Endeavor","Crush Claw","Hammer Arm","Circle Throw"],
    max: []
  },
  116: {
    levelUp: [{level:1,move:"Leer"},{level:1,move:"Water Gun"},{level:5,move:"Smokescreen"},{level:10,move:"Twister"},{level:15,move:"Focus Energy"},{level:20,move:"Dragon Breath"},{level:25,move:"Bubble Beam"},{level:30,move:"Agility"},{level:35,move:"Water Pulse"},{level:40,move:"Dragon Pulse"},{level:45,move:"Hydro Pump"},{level:50,move:"Dragon Dance"},{level:55,move:"Rain Dance"}],
    tm: ["Hydro Pump","Surf","Ice Beam","Blizzard","Agility","Waterfall","Swift","Rest","Substitute","Protect","Icy Wind","Outrage","Endure","Sleep Talk","Rain Dance","Whirlpool","Facade","Weather Ball","Muddy Water","Dragon Dance","Water Pulse","Dragon Pulse","Flash Cannon","Liquidation","Scale Shot","Flip Turn","Tera Blast","Chilling Water"],
    egg: ["Disable","Aurora Beam","Splash","Flail","Clear Smog"],
    max: []
  },
  117: {
    levelUp: [{level:1,move:"Leer"},{level:1,move:"Water Gun"},{level:1,move:"Smokescreen"},{level:1,move:"Twister"},{level:15,move:"Focus Energy"},{level:20,move:"Dragon Breath"},{level:25,move:"Bubble Beam"},{level:30,move:"Agility"},{level:37,move:"Water Pulse"},{level:44,move:"Dragon Pulse"},{level:51,move:"Hydro Pump"},{level:58,move:"Dragon Dance"},{level:65,move:"Rain Dance"}],
    tm: ["Hydro Pump","Surf","Ice Beam","Blizzard","Hyper Beam","Agility","Waterfall","Swift","Rest","Substitute","Protect","Scary Face","Icy Wind","Outrage","Endure","Sleep Talk","Rain Dance","Whirlpool","Facade","Weather Ball","Muddy Water","Dragon Dance","Water Pulse","Dragon Pulse","Giga Impact","Flash Cannon","Liquidation","Scale Shot","Flip Turn","Tera Blast","Snowscape","Chilling Water"],
    egg: ["Disable","Aurora Beam","Splash","Flail","Clear Smog"],
    max: []
  },
  118: {
    levelUp: [{level:1,move:"Peck"},{level:1,move:"Tail Whip"},{level:5,move:"Supersonic"},{level:10,move:"Water Pulse"},{level:15,move:"Horn Attack"},{level:20,move:"Agility"},{level:25,move:"Aqua Ring"},{level:30,move:"Flail"},{level:35,move:"Waterfall"},{level:40,move:"Soak"},{level:45,move:"Megahorn"},{level:50,move:"Horn Drill"}],
    tm: ["Swords Dance","Surf","Ice Beam","Blizzard","Double Team","Waterfall","Rest","Substitute","Protect","Endure","Swagger","Attract","Sleep Talk","Rain Dance","Hail","Facade","Water Pulse","Poison Jab","Scald"],
    egg: ["Body Slam","Hydro Pump","Psybeam","Haze","Skull Bash","Mud-Slap","Mud Shot","Acupressure","Aqua Tail"],
    max: []
  },
  119: {
    levelUp: [{level:1,move:"Peck"},{level:1,move:"Supersonic"},{level:1,move:"Tail Whip"},{level:1,move:"Water Pulse"},{level:15,move:"Horn Attack"},{level:20,move:"Agility"},{level:25,move:"Aqua Ring"},{level:30,move:"Flail"},{level:37,move:"Waterfall"},{level:44,move:"Soak"},{level:51,move:"Megahorn"},{level:58,move:"Horn Drill"}],
    tm: ["Swords Dance","Surf","Ice Beam","Blizzard","Hyper Beam","Double Team","Waterfall","Rest","Substitute","Protect","Endure","Swagger","Attract","Sleep Talk","Rain Dance","Hail","Facade","Water Pulse","Poison Jab","Giga Impact","Scald"],
    egg: [],
    max: []
  },
  120: {
    levelUp: [{level:1,move:"Harden"},{level:1,move:"Tackle"},{level:4,move:"Water Gun"},{level:8,move:"Confuse Ray"},{level:12,move:"Rapid Spin"},{level:16,move:"Minimize"},{level:20,move:"Swift"},{level:24,move:"Psybeam"},{level:28,move:"Brine"},{level:32,move:"Light Screen"},{level:36,move:"Power Gem"},{level:40,move:"Psychic"},{level:44,move:"Surf"},{level:48,move:"Recover"},{level:52,move:"Cosmic Power"},{level:56,move:"Hydro Pump"}],
    tm: ["Surf","Ice Beam","Blizzard","Thunderbolt","Thunder Wave","Thunder","Psychic","Double Team","Light Screen","Reflect","Waterfall","Flash","Rest","Substitute","Protect","Endure","Swagger","Sleep Talk","Rain Dance","Psych Up","Hail","Facade","Recycle","Water Pulse","Gyro Ball","Brine","Flash Cannon","Scald","Dazzling Gleam"],
    egg: [],
    max: []
  },
  121: {
    levelUp: [{level:1,move:"Brine"},{level:1,move:"Confuse Ray"},{level:1,move:"Cosmic Power"},{level:1,move:"Harden"},{level:1,move:"Hydro Pump"},{level:1,move:"Light Screen"},{level:1,move:"Minimize"},{level:1,move:"Power Gem"},{level:1,move:"Psybeam"},{level:1,move:"Psychic"},{level:1,move:"Rapid Spin"},{level:1,move:"Recover"},{level:1,move:"Surf"},{level:1,move:"Swift"},{level:1,move:"Tackle"},{level:1,move:"Water Gun"}],
    tm: ["Surf","Ice Beam","Blizzard","Hyper Beam","Thunderbolt","Thunder Wave","Thunder","Psychic","Double Team","Light Screen","Reflect","Waterfall","Dream Eater","Flash","Rest","Substitute","Protect","Endure","Swagger","Sleep Talk","Rain Dance","Psych Up","Hail","Facade","Recycle","Skill Swap","Water Pulse","Gyro Ball","Brine","Giga Impact","Avalanche","Flash Cannon","Trick Room","Grass Knot","Scald","Dazzling Gleam"],
    egg: [],
    max: []
  },
  122: {
    levelUp: [{level:1,move:"Confusion"},{level:6,move:"Hypnosis"},{level:11,move:"Iron Defense"},{level:18,move:"Zen Headbutt"},{level:25,move:"Mimic"},{level:34,move:"Psychic"},{level:43,move:"Calm Mind"},{level:46,move:"Dazzling Gleam"}],
    tm: [],
    egg: [],
    max: []
  },
  123: {
    levelUp: [{level:1,move:"Leer"},{level:1,move:"Quick Attack"},{level:4,move:"Fury Cutter"},{level:8,move:"False Swipe"},{level:12,move:"Wing Attack"},{level:16,move:"Double Team"},{level:20,move:"Double Hit"},{level:24,move:"Slash"},{level:28,move:"Focus Energy"},{level:32,move:"Agility"},{level:36,move:"Air Slash"},{level:40,move:"X-Scissor"},{level:44,move:"Swords Dance"}],
    tm: ["Swords Dance","Take Down","Hyper Beam","Agility","Light Screen","Swift","Rest","Substitute","Thief","Reversal","Protect","Scary Face","Endure","False Swipe","Sleep Talk","Baton Pass","Rain Dance","Sunny Day","Facade","Helping Hand","Brick Break","Air Cutter","Aerial Ace","Tailwind","U-turn","Close Combat","Air Slash","X-Scissor","Bug Buzz","Giga Impact","Acrobatics","Struggle Bug","Tera Blast","Pounce","Trailblaze","Bug Bite","Vacuum Wave","Lunge","Dual Wingbeat","Skitter Smack"],
    egg: ["Counter","Feint","Night Slash","Defog","Quick Guard"],
    max: []
  },
  124: {
    levelUp: [{level:1,move:"Copycat"},{level:1,move:"Lick"},{level:1,move:"Pound"},{level:1,move:"Powder Snow"},{level:1,move:"Sweet Kiss"},{level:12,move:"Confusion"},{level:16,move:"Covet"},{level:20,move:"Sing"},{level:24,move:"Fake Tears"},{level:28,move:"Ice Punch"},{level:34,move:"Psychic"},{level:40,move:"Lovely Kiss"},{level:46,move:"Mean Look"},{level:52,move:"Perish Song"},{level:58,move:"Blizzard"}],
    tm: ["Ice Beam","Blizzard","Hyper Beam","Psychic","Double Team","Light Screen","Reflect","Dream Eater","Flash","Rest","Substitute","Thief","Protect","Endure","Swagger","Attract","Sleep Talk","Rain Dance","Psych Up","Shadow Ball","Hail","Torment","Facade","Focus Punch","Taunt","Recycle","Brick Break","Skill Swap","Calm Mind","Water Pulse","Payback","Fling","Drain Punch","Focus Blast","Energy Ball","Giga Impact","Nasty Plot","Avalanche","Trick Room","Grass Knot"],
    egg: [],
    max: []
  },
  125: {
    levelUp: [{level:1,move:"Leer"},{level:1,move:"Thunder Shock"},{level:1,move:"Quick Attack"},{level:1,move:"Charge"},{level:12,move:"Swift"},{level:16,move:"Shock Wave"},{level:20,move:"Thunder Wave"},{level:24,move:"Screech"},{level:28,move:"Thunder Punch"},{level:34,move:"Discharge"},{level:40,move:"Low Kick"},{level:46,move:"Thunderbolt"},{level:52,move:"Light Screen"},{level:58,move:"Thunder"},{level:64,move:"Giga Impact"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Take Down","Double-Edge","Hyper Beam","Low Kick","Thunderbolt","Thunder Wave","Thunder","Psychic","Light Screen","Metronome","Swift","Rest","Substitute","Thief","Protect","Endure","Sleep Talk","Rain Dance","Uproar","Facade","Focus Punch","Charge","Taunt","Helping Hand","Brick Break","Knock Off","Metal Sound","Bulk Up","Fling","Focus Blast","Giga Impact","Charge Beam","Electro Ball","Low Sweep","Volt Switch","Electroweb","Wild Charge","Eerie Impulse","Electric Terrain","Tera Blast","Trailblaze","Supercell Slam"],
    egg: ["Dynamic Punch","Cross Chop","Focus Punch","Follow Me","Hammer Arm","Feint"],
    max: []
  },
  126: {
    levelUp: [{level:1,move:"Leer"},{level:1,move:"Ember"},{level:1,move:"Smokescreen"},{level:1,move:"Smog"},{level:12,move:"Clear Smog"},{level:16,move:"Flame Wheel"},{level:20,move:"Confuse Ray"},{level:24,move:"Scary Face"},{level:28,move:"Fire Punch"},{level:34,move:"Lava Plume"},{level:40,move:"Low Kick"},{level:46,move:"Flamethrower"},{level:52,move:"Sunny Day"},{level:58,move:"Fire Blast"},{level:64,move:"Hyper Beam"}],
    tm: ["Fire Punch","Thunder Punch","Body Slam","Take Down","Double-Edge","Roar","Flamethrower","Hyper Beam","Low Kick","Fire Spin","Psychic","Confuse Ray","Metronome","Fire Blast","Rest","Substitute","Thief","Curse","Protect","Scary Face","Endure","Sleep Talk","Sunny Day","Uproar","Heat Wave","Will-O-Wisp","Facade","Focus Punch","Taunt","Helping Hand","Brick Break","Knock Off","Overheat","Fling","Flare Blitz","Poison Jab","Focus Blast","Giga Impact","Flame Charge","Low Sweep","Acid Spray","Heat Crash","Burning Jealousy","Scorching Sands","Tera Blast","Temper Flare"],
    egg: ["Mach Punch","Belly Drum","Dynamic Punch","Cross Chop","Focus Punch","Follow Me","Belch"],
    max: []
  },
  127: {
    levelUp: [{level:1,move:"Harden"},{level:1,move:"Vise Grip"},{level:4,move:"Focus Energy"},{level:8,move:"Bind"},{level:12,move:"Seismic Toss"},{level:16,move:"Bug Bite"},{level:20,move:"Storm Throw"},{level:24,move:"Double Hit"},{level:28,move:"Vital Throw"},{level:32,move:"X-Scissor"},{level:36,move:"Strength"},{level:40,move:"Swords Dance"},{level:44,move:"Submission"},{level:48,move:"Guillotine"},{level:52,move:"Superpower"}],
    tm: ["Swords Dance","Cut","Hyper Beam","Strength","Earthquake","Dig","Double Team","Rest","Rock Slide","Substitute","Thief","Protect","Endure","False Swipe","Swagger","Attract","Sleep Talk","Rain Dance","Sunny Day","Rock Smash","Facade","Focus Punch","Brick Break","Rock Tomb","Bulk Up","Fling","X-Scissor","Focus Blast","Giga Impact","Rock Climb","Stone Edge","Stealth Rock","Bulldoze"],
    egg: ["Fury Attack","Thrash","Quick Attack","Flail","Superpower","Feint","Close Combat","Bug Bite"],
    max: []
  },
  128: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Tail Whip"},{level:5,move:"Work Up"},{level:10,move:"Payback"},{level:15,move:"Assurance"},{level:20,move:"Horn Attack"},{level:25,move:"Scary Face"},{level:30,move:"Zen Headbutt"},{level:35,move:"Raging Bull"},{level:40,move:"Rest"},{level:45,move:"Swagger"},{level:50,move:"Thrash"},{level:55,move:"Double-Edge"},{level:60,move:"Giga Impact"}],
    tm: ["Body Slam","Take Down","Flamethrower","Surf","Ice Beam","Blizzard","Hyper Beam","Solar Beam","Thunderbolt","Thunder","Earthquake","Dig","Fire Blast","Rest","Rock Slide","Substitute","Thief","Reversal","Protect","Scary Face","Icy Wind","Outrage","Sandstorm","Endure","Sleep Talk","Rain Dance","Sunny Day","Shadow Ball","Facade","Helping Hand","Rock Tomb","Close Combat","Giga Impact","Zen Headbutt","Iron Head","Stone Edge","Bulldoze","Wild Charge","Smart Strike","Stomping Tantrum","Tera Blast","Trailblaze","High Horsepower","Lash Out","Double-Edge","Endeavor","Throat Chop","Curse"],
    egg: ["Curse","Endeavor"],
    max: []
  },
  129: {
    levelUp: [{level:1,move:"Splash"},{level:15,move:"Tackle"},{level:25,move:"Flail"}],
    tm: [],
    egg: [],
    max: []
  },
  130: {
    levelUp: [{level:0,move:"Bite"},{level:1,move:"Tackle"},{level:1,move:"Leer"},{level:1,move:"Twister"},{level:1,move:"Splash"},{level:1,move:"Flail"},{level:4,move:"Whirlpool"},{level:8,move:"Ice Fang"},{level:12,move:"Brine"},{level:16,move:"Scary Face"},{level:21,move:"Waterfall"},{level:24,move:"Crunch"},{level:28,move:"Rain Dance"},{level:32,move:"Aqua Tail"},{level:36,move:"Dragon Dance"},{level:40,move:"Hydro Pump"},{level:44,move:"Hurricane"},{level:48,move:"Thrash"},{level:52,move:"Hyper Beam"}],
    tm: ["Body Slam","Take Down","Flamethrower","Hydro Pump","Surf","Ice Beam","Blizzard","Hyper Beam","Thunderbolt","Thunder Wave","Thunder","Earthquake","Fire Blast","Waterfall","Rest","Substitute","Protect","Scary Face","Icy Wind","Outrage","Sandstorm","Endure","Sleep Talk","Rain Dance","Sunny Day","Crunch","Facade","Taunt","Helping Hand","Dragon Dance","Water Pulse","Dark Pulse","Dragon Pulse","Giga Impact","Avalanche","Ice Fang","Iron Head","Stone Edge","Bulldoze","Dragon Tail","Hurricane","Tera Blast","Chilling Water","Roar","Spite","Scald","Lash Out","Scale Shot","Double-Edge","Endeavor","Temper Flare","Whirlpool","Muddy Water","Dragon Cheer"],
    egg: [],
    max: []
  },
  131: {
    levelUp: [{level:1,move:"Growl"},{level:1,move:"Water Gun"},{level:5,move:"Sing"},{level:10,move:"Mist"},{level:15,move:"Life Dew"},{level:20,move:"Ice Shard"},{level:25,move:"Confuse Ray"},{level:30,move:"Water Pulse"},{level:35,move:"Brine"},{level:40,move:"Body Slam"},{level:45,move:"Ice Beam"},{level:50,move:"Rain Dance"},{level:55,move:"Hydro Pump"},{level:60,move:"Perish Song"},{level:65,move:"Sheer Cold"}],
    tm: ["Body Slam","Take Down","Double-Edge","Hydro Pump","Surf","Ice Beam","Blizzard","Hyper Beam","Thunderbolt","Thunder","Earthquake","Psychic","Confuse Ray","Haze","Reflect","Waterfall","Rest","Substitute","Curse","Protect","Icy Wind","Outrage","Endure","Charm","Sleep Talk","Rain Dance","Whirlpool","Facade","Helping Hand","Hyper Voice","Weather Ball","Muddy Water","Icicle Spear","Dragon Dance","Water Pulse","Dragon Pulse","Giga Impact","Avalanche","Zen Headbutt","Iron Head","Bulldoze","Drill Run","Disarming Voice","Smart Strike","Liquidation","Body Press","Tera Blast","Snowscape","Chilling Water","Dragon Cheer","Alluring Voice","Psychic Noise"],
    egg: ["Horn Drill","Fissure","Curse","Ancient Power","Tickle","Freeze-Dry","Sparkling Aria"],
    max: []
  },
  132: {
    levelUp: [{level:1,move:"Transform"}],
    tm: [],
    egg: [],
    max: []
  },
  133: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Tail Whip"},{level:1,move:"Growl"},{level:1,move:"Helping Hand"},{level:1,move:"Covet"},{level:5,move:"Sand Attack"},{level:10,move:"Quick Attack"},{level:15,move:"Baby-Doll Eyes"},{level:20,move:"Swift"},{level:25,move:"Bite"},{level:30,move:"Copycat"},{level:35,move:"Baton Pass"},{level:40,move:"Take Down"},{level:45,move:"Charm"},{level:50,move:"Double-Edge"},{level:55,move:"Last Resort"}],
    tm: ["Body Slam","Take Down","Dig","Swift","Rest","Substitute","Protect","Mud-Slap","Endure","Charm","Sleep Talk","Baton Pass","Rain Dance","Sunny Day","Shadow Ball","Facade","Helping Hand","Hyper Voice","Fake Tears","Calm Mind","Stored Power","Tera Blast","Trailblaze","Roar","Weather Ball","Double-Edge","Curse","Alluring Voice"],
    egg: ["Double Kick","Curse","Flail","Mud-Slap","Detect","Wish","Yawn","Tickle"],
    max: []
  },
  134: {
    levelUp: [{level:0,move:"Water Gun"},{level:1,move:"Tackle"},{level:1,move:"Take Down"},{level:1,move:"Double-Edge"},{level:1,move:"Tail Whip"},{level:1,move:"Bite"},{level:1,move:"Growl"},{level:1,move:"Copycat"},{level:1,move:"Covet"},{level:1,move:"Helping Hand"},{level:1,move:"Swift"},{level:1,move:"Baton Pass"},{level:1,move:"Charm"},{level:5,move:"Sand Attack"},{level:10,move:"Quick Attack"},{level:15,move:"Baby-Doll Eyes"},{level:20,move:"Haze"},{level:25,move:"Water Pulse"},{level:30,move:"Aurora Beam"},{level:35,move:"Aqua Ring"},{level:40,move:"Muddy Water"},{level:45,move:"Acid Armor"},{level:50,move:"Hydro Pump"},{level:55,move:"Last Resort"}],
    tm: ["Body Slam","Take Down","Hydro Pump","Surf","Ice Beam","Blizzard","Hyper Beam","Dig","Waterfall","Swift","Rest","Substitute","Protect","Mud-Slap","Icy Wind","Endure","Charm","Sleep Talk","Baton Pass","Rain Dance","Sunny Day","Shadow Ball","Facade","Helping Hand","Hyper Voice","Fake Tears","Calm Mind","Water Pulse","Giga Impact","Stored Power","Liquidation","Tera Blast","Trailblaze","Chilling Water","Roar","Haze","Scald","Weather Ball","Flip Turn","Double-Edge","Whirlpool","Muddy Water","Curse","Alluring Voice"],
    egg: [],
    max: []
  },
  135: {
    levelUp: [{level:0,move:"Thunder Shock"},{level:1,move:"Baton Pass"},{level:1,move:"Swift"},{level:1,move:"Helping Hand"},{level:1,move:"Covet"},{level:1,move:"Charm"},{level:1,move:"Bite"},{level:1,move:"Growl"},{level:1,move:"Tail Whip"},{level:1,move:"Double-Edge"},{level:1,move:"Take Down"},{level:1,move:"Tackle"},{level:1,move:"Copycat"},{level:5,move:"Sand Attack"},{level:10,move:"Quick Attack"},{level:15,move:"Baby-Doll Eyes"},{level:20,move:"Thunder Wave"},{level:25,move:"Double Kick"},{level:30,move:"Thunder Fang"},{level:35,move:"Pin Missile"},{level:40,move:"Discharge"},{level:45,move:"Agility"},{level:50,move:"Thunder"},{level:55,move:"Last Resort"}],
    tm: ["Body Slam","Take Down","Hyper Beam","Thunderbolt","Thunder Wave","Thunder","Dig","Agility","Light Screen","Swift","Rest","Substitute","Protect","Mud-Slap","Endure","Charm","False Swipe","Sleep Talk","Baton Pass","Rain Dance","Sunny Day","Shadow Ball","Facade","Helping Hand","Hyper Voice","Fake Tears","Calm Mind","Giga Impact","Thunder Fang","Electro Ball","Stored Power","Volt Switch","Wild Charge","Eerie Impulse","Electric Terrain","Tera Blast","Trailblaze","Roar","Charge","Weather Ball","Double-Edge","Electroweb","Metal Sound","Curse","Alluring Voice"],
    egg: [],
    max: []
  },
  136: {
    levelUp: [{level:0,move:"Ember"},{level:1,move:"Swift"},{level:1,move:"Tackle"},{level:1,move:"Take Down"},{level:1,move:"Double-Edge"},{level:1,move:"Tail Whip"},{level:1,move:"Copycat"},{level:1,move:"Growl"},{level:1,move:"Covet"},{level:1,move:"Helping Hand"},{level:1,move:"Baton Pass"},{level:1,move:"Charm"},{level:5,move:"Sand Attack"},{level:10,move:"Quick Attack"},{level:15,move:"Baby-Doll Eyes"},{level:20,move:"Smog"},{level:25,move:"Bite"},{level:30,move:"Fire Fang"},{level:35,move:"Fire Spin"},{level:40,move:"Lava Plume"},{level:45,move:"Scary Face"},{level:50,move:"Flare Blitz"},{level:55,move:"Last Resort"}],
    tm: ["Body Slam","Take Down","Flamethrower","Hyper Beam","Fire Spin","Dig","Fire Blast","Swift","Rest","Substitute","Protect","Scary Face","Mud-Slap","Endure","Charm","Sleep Talk","Baton Pass","Rain Dance","Sunny Day","Shadow Ball","Heat Wave","Will-O-Wisp","Facade","Helping Hand","Hyper Voice","Fake Tears","Overheat","Calm Mind","Flare Blitz","Giga Impact","Fire Fang","Stored Power","Tera Blast","Trailblaze","Roar","Weather Ball","Burning Jealousy","Double-Edge","Endeavor","Temper Flare","Scorching Sands","Curse","Alluring Voice"],
    egg: [],
    max: []
  },
  137: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Conversion"},{level:5,move:"Recycle"},{level:10,move:"Magnet Rise"},{level:15,move:"Thunder Shock"},{level:20,move:"Psybeam"},{level:25,move:"Conversion 2"},{level:30,move:"Agility"},{level:35,move:"Recover"},{level:40,move:"Discharge"},{level:45,move:"Tri Attack"},{level:50,move:"Double-Edge"},{level:55,move:"Lock-On"},{level:60,move:"Zap Cannon"}],
    tm: ["Take Down","Double-Edge","Ice Beam","Blizzard","Psybeam","Hyper Beam","Solar Beam","Thunderbolt","Thunder Wave","Thunder","Psychic","Agility","Swift","Rest","Substitute","Thief","Protect","Icy Wind","Endure","Sleep Talk","Rain Dance","Sunny Day","Shadow Ball","Facade","Charge","Trick","Gravity","Giga Impact","Zen Headbutt","Trick Room","Charge Beam","Psyshock","Foul Play","Electroweb","Eerie Impulse","Tera Blast"],
    egg: [],
    max: []
  },
  138: {
    levelUp: [{level:1,move:"Bind"},{level:1,move:"Withdraw"},{level:5,move:"Rollout"},{level:10,move:"Sand Attack"},{level:15,move:"Water Gun"},{level:20,move:"Leer"},{level:25,move:"Mud Shot"},{level:30,move:"Ancient Power"},{level:35,move:"Brine"},{level:41,move:"Protect"},{level:45,move:"Rock Blast"},{level:50,move:"Surf"},{level:55,move:"Shell Smash"},{level:60,move:"Hydro Pump"}],
    tm: ["Surf","Ice Beam","Blizzard","Double Team","Waterfall","Rest","Rock Slide","Substitute","Thief","Protect","Sandstorm","Endure","Swagger","Attract","Sleep Talk","Rain Dance","Rock Smash","Hail","Facade","Rock Tomb","Water Pulse","Gyro Ball","Brine","Rock Polish","Stealth Rock","Scald"],
    egg: ["Slam","Bite","Supersonic","Bubble Beam","Aurora Beam","Haze","Spikes","Whirlpool","Knock Off","Tickle","Muddy Water","Toxic Spikes","Reflect Type"],
    max: []
  },
  139: {
    levelUp: [{level:0,move:"Crunch"},{level:1,move:"Bind"},{level:1,move:"Crunch"},{level:1,move:"Rollout"},{level:1,move:"Sand Attack"},{level:1,move:"Withdraw"},{level:15,move:"Water Gun"},{level:20,move:"Leer"},{level:25,move:"Mud Shot"},{level:30,move:"Ancient Power"},{level:35,move:"Brine"},{level:43,move:"Protect"},{level:49,move:"Rock Blast"},{level:56,move:"Surf"},{level:63,move:"Shell Smash"},{level:70,move:"Hydro Pump"}],
    tm: ["Surf","Ice Beam","Blizzard","Hyper Beam","Double Team","Waterfall","Rest","Rock Slide","Substitute","Thief","Protect","Sandstorm","Endure","Swagger","Attract","Sleep Talk","Rain Dance","Rock Smash","Hail","Facade","Rock Tomb","Water Pulse","Gyro Ball","Brine","Rock Polish","Giga Impact","Rock Climb","Stone Edge","Stealth Rock","Scald"],
    egg: [],
    max: []
  },
  140: {
    levelUp: [{level:1,move:"Absorb"},{level:1,move:"Harden"},{level:5,move:"Scratch"},{level:10,move:"Sand Attack"},{level:15,move:"Aqua Jet"},{level:20,move:"Leer"},{level:25,move:"Mud Shot"},{level:30,move:"Ancient Power"},{level:35,move:"Brine"},{level:41,move:"Protect"},{level:45,move:"Leech Life"},{level:50,move:"Liquidation"},{level:55,move:"Metal Sound"},{level:60,move:"Stone Edge"}],
    tm: ["Surf","Ice Beam","Blizzard","Dig","Double Team","Waterfall","Rest","Rock Slide","Substitute","Thief","Protect","Sandstorm","Giga Drain","Endure","Swagger","Attract","Sleep Talk","Rain Dance","Rock Smash","Hail","Facade","Rock Tomb","Aerial Ace","Water Pulse","Brine","Rock Polish","Stone Edge","Stealth Rock","Scald"],
    egg: ["Take Down","Bubble Beam","Aurora Beam","Mega Drain","Screech","Confuse Ray","Flail","Icy Wind","Rapid Spin","Knock Off","Mud Shot"],
    max: []
  },
  141: {
    levelUp: [{level:0,move:"Slash"},{level:1,move:"Absorb"},{level:1,move:"Feint"},{level:1,move:"Harden"},{level:1,move:"Night Slash"},{level:1,move:"Sand Attack"},{level:1,move:"Scratch"},{level:1,move:"Slash"},{level:15,move:"Aqua Jet"},{level:20,move:"Leer"},{level:25,move:"Mud Shot"},{level:30,move:"Ancient Power"},{level:35,move:"Brine"},{level:43,move:"Protect"},{level:49,move:"Leech Life"},{level:56,move:"Liquidation"},{level:63,move:"Metal Sound"},{level:70,move:"Stone Edge"}],
    tm: ["Swords Dance","Cut","Surf","Ice Beam","Blizzard","Hyper Beam","Dig","Double Team","Waterfall","Rest","Rock Slide","Substitute","Thief","Protect","Sandstorm","Giga Drain","Endure","Swagger","Attract","Sleep Talk","Rain Dance","Rock Smash","Hail","Facade","Brick Break","Rock Tomb","Aerial Ace","Water Pulse","Brine","Rock Polish","X-Scissor","Giga Impact","Rock Climb","Stone Edge","Stealth Rock","Scald"],
    egg: [],
    max: []
  },
  142: {
    levelUp: [{level:1,move:"Ancient Power"},{level:1,move:"Bite"},{level:5,move:"Supersonic"},{level:10,move:"Wing Attack"},{level:15,move:"Scary Face"},{level:20,move:"Rock Slide"},{level:25,move:"Roar"},{level:30,move:"Crunch"},{level:35,move:"Iron Head"},{level:40,move:"Take Down"},{level:45,move:"Stone Edge"},{level:50,move:"Agility"},{level:55,move:"Hyper Beam"},{level:60,move:"Giga Impact"}],
    tm: ["Fly","Roar","Flamethrower","Hyper Beam","Strength","Earthquake","Double Team","Fire Blast","Rest","Rock Slide","Substitute","Thief","Protect","Sandstorm","Endure","Swagger","Steel Wing","Attract","Sleep Talk","Iron Tail","Rain Dance","Sunny Day","Rock Smash","Torment","Facade","Taunt","Rock Tomb","Aerial Ace","Dragon Claw","Roost","Payback","Rock Polish","Dragon Pulse","Giga Impact","Defog","Stone Edge","Stealth Rock","Bulldoze"],
    egg: ["Whirlwind","Curse","Dragon Breath","Tailwind","Assurance","Wide Guard"],
    max: []
  },
  143: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Last Resort"},{level:1,move:"Swallow"},{level:1,move:"Screech"},{level:1,move:"Defense Curl"},{level:1,move:"Metronome"},{level:1,move:"Lick"},{level:1,move:"Fling"},{level:1,move:"Recycle"},{level:1,move:"Stockpile"},{level:1,move:"Flail"},{level:1,move:"Covet"},{level:1,move:"Block"},{level:12,move:"Yawn"},{level:16,move:"Bite"},{level:20,move:"Snore"},{level:20,move:"Sleep Talk"},{level:20,move:"Rest"},{level:24,move:"Crunch"},{level:28,move:"Body Slam"},{level:32,move:"Heavy Slam"},{level:36,move:"Amnesia"},{level:40,move:"High Horsepower"},{level:44,move:"Hammer Arm"},{level:48,move:"Belly Drum"},{level:52,move:"Belch"},{level:56,move:"Giga Impact"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Take Down","Flamethrower","Surf","Ice Beam","Blizzard","Hyper Beam","Solar Beam","Thunderbolt","Thunder","Earthquake","Dig","Metronome","Fire Blast","Amnesia","Rest","Rock Slide","Substitute","Protect","Mud-Slap","Icy Wind","Outrage","Sandstorm","Endure","Charm","Sleep Talk","Encore","Rain Dance","Sunny Day","Crunch","Shadow Ball","Uproar","Facade","Focus Punch","Helping Hand","Brick Break","Hyper Voice","Rock Tomb","Fling","Seed Bomb","Focus Blast","Giga Impact","Zen Headbutt","Gunk Shot","Iron Head","Smack Down","Heavy Slam","Bulldoze","Wild Charge","Heat Crash","High Horsepower","Stomping Tantrum","Body Press","Tera Blast","Trailblaze","Chilling Water","Double-Edge","Supercell Slam","Curse","Hard Press"],
    egg: ["Double-Edge","Counter","Fissure","Curse","Belch"],
    max: []
  },
  144: {
    levelUp: [{level:1,move:"Gust"},{level:1,move:"Mist"},{level:5,move:"Powder Snow"},{level:10,move:"Reflect"},{level:15,move:"Ice Shard"},{level:20,move:"Agility"},{level:25,move:"Ancient Power"},{level:30,move:"Tailwind"},{level:35,move:"Freeze-Dry"},{level:40,move:"Roost"},{level:45,move:"Ice Beam"},{level:50,move:"Snowscape"},{level:55,move:"Hurricane"},{level:60,move:"Haze"},{level:65,move:"Blizzard"},{level:70,move:"Sheer Cold"}],
    tm: ["Fly","Take Down","Ice Beam","Blizzard","Hyper Beam","Agility","Light Screen","Reflect","Swift","Rest","Substitute","Protect","Icy Wind","Sandstorm","Endure","Sleep Talk","Rain Dance","Sunny Day","Facade","Helping Hand","Air Cutter","Aerial Ace","Water Pulse","Tailwind","U-turn","Air Slash","Brave Bird","Giga Impact","Avalanche","Hurricane","Tera Blast","Ice Spinner","Snowscape","Roar","Haze","Icicle Spear","Weather Ball","Dual Wingbeat","Double-Edge","Triple Axel","Feather Dance"],
    egg: [],
    max: []
  },
  145: {
    levelUp: [{level:1,move:"Peck"},{level:1,move:"Thunder Wave"},{level:5,move:"Thunder Shock"},{level:10,move:"Light Screen"},{level:15,move:"Pluck"},{level:20,move:"Agility"},{level:25,move:"Ancient Power"},{level:30,move:"Charge"},{level:35,move:"Drill Peck"},{level:40,move:"Roost"},{level:45,move:"Discharge"},{level:50,move:"Rain Dance"},{level:55,move:"Thunder"},{level:60,move:"Detect"},{level:65,move:"Magnetic Flux"},{level:70,move:"Zap Cannon"}],
    tm: ["Fly","Take Down","Hyper Beam","Thunderbolt","Thunder Wave","Thunder","Agility","Light Screen","Swift","Rest","Substitute","Protect","Sandstorm","Endure","Sleep Talk","Baton Pass","Rain Dance","Sunny Day","Heat Wave","Facade","Helping Hand","Air Cutter","Aerial Ace","Tailwind","U-turn","Brave Bird","Giga Impact","Electro Ball","Acrobatics","Volt Switch","Wild Charge","Hurricane","Eerie Impulse","Electric Terrain","Tera Blast","Charge","Weather Ball","Dual Wingbeat","Supercell Slam","Metal Sound"],
    egg: [],
    max: []
  },
  146: {
    levelUp: [{level:1,move:"Gust"},{level:1,move:"Leer"},{level:5,move:"Ember"},{level:10,move:"Safeguard"},{level:15,move:"Wing Attack"},{level:20,move:"Agility"},{level:25,move:"Ancient Power"},{level:30,move:"Incinerate"},{level:35,move:"Air Slash"},{level:40,move:"Roost"},{level:45,move:"Heat Wave"},{level:50,move:"Sunny Day"},{level:55,move:"Hurricane"},{level:60,move:"Endure"},{level:65,move:"Overheat"},{level:70,move:"Sky Attack"}],
    tm: ["Fly","Take Down","Flamethrower","Hyper Beam","Solar Beam","Fire Spin","Agility","Fire Blast","Swift","Rest","Substitute","Protect","Sandstorm","Endure","Sleep Talk","Rain Dance","Sunny Day","Heat Wave","Will-O-Wisp","Facade","Helping Hand","Air Cutter","Overheat","Aerial Ace","Tailwind","U-turn","Flare Blitz","Air Slash","Brave Bird","Giga Impact","Flame Charge","Acrobatics","Hurricane","Tera Blast","Roar","Weather Ball","Burning Jealousy","Dual Wingbeat","Double-Edge","Temper Flare","Scorching Sands"],
    egg: [],
    max: []
  },
  147: {
    levelUp: [{level:1,move:"Wrap"},{level:1,move:"Leer"},{level:5,move:"Twister"},{level:10,move:"Thunder Wave"},{level:15,move:"Dragon Tail"},{level:20,move:"Agility"},{level:25,move:"Slam"},{level:31,move:"Aqua Tail"},{level:35,move:"Dragon Rush"},{level:40,move:"Safeguard"},{level:45,move:"Rain Dance"},{level:50,move:"Dragon Dance"},{level:55,move:"Outrage"},{level:60,move:"Hyper Beam"}],
    tm: ["Body Slam","Take Down","Flamethrower","Hydro Pump","Surf","Ice Beam","Blizzard","Hyper Beam","Fire Spin","Thunderbolt","Thunder Wave","Thunder","Agility","Light Screen","Fire Blast","Waterfall","Swift","Rest","Substitute","Protect","Icy Wind","Outrage","Endure","Sleep Talk","Rain Dance","Sunny Day","Facade","Helping Hand","Dragon Dance","Water Pulse","Dragon Pulse","Giga Impact","Draco Meteor","Iron Head","Dragon Tail","Tera Blast","Chilling Water","Haze","Scale Shot","Breaking Swipe","Dragon Cheer"],
    egg: ["Supersonic","Mist","Dragon Breath","Extreme Speed","Water Pulse","Aqua Jet"],
    max: []
  },
  148: {
    levelUp: [{level:1,move:"Wrap"},{level:1,move:"Leer"},{level:1,move:"Thunder Wave"},{level:1,move:"Twister"},{level:15,move:"Dragon Tail"},{level:20,move:"Agility"},{level:25,move:"Slam"},{level:33,move:"Aqua Tail"},{level:39,move:"Dragon Rush"},{level:46,move:"Safeguard"},{level:53,move:"Rain Dance"},{level:60,move:"Dragon Dance"},{level:67,move:"Outrage"},{level:74,move:"Hyper Beam"}],
    tm: ["Body Slam","Take Down","Flamethrower","Hydro Pump","Surf","Ice Beam","Blizzard","Hyper Beam","Fire Spin","Thunderbolt","Thunder Wave","Thunder","Agility","Light Screen","Fire Blast","Waterfall","Swift","Rest","Substitute","Protect","Icy Wind","Outrage","Endure","Sleep Talk","Rain Dance","Sunny Day","Facade","Helping Hand","Dragon Dance","Water Pulse","Dragon Pulse","Giga Impact","Draco Meteor","Iron Head","Dragon Tail","Tera Blast","Chilling Water","Haze","Weather Ball","Scale Shot","Breaking Swipe","Dragon Cheer"],
    egg: [],
    max: []
  },
  149: {
    levelUp: [{level:0,move:"Hurricane"},{level:1,move:"Roost"},{level:1,move:"Extreme Speed"},{level:1,move:"Twister"},{level:1,move:"Thunder Wave"},{level:1,move:"Fire Punch"},{level:1,move:"Wrap"},{level:1,move:"Wing Attack"},{level:1,move:"Thunder Punch"},{level:1,move:"Leer"},{level:15,move:"Dragon Tail"},{level:20,move:"Agility"},{level:25,move:"Slam"},{level:33,move:"Aqua Tail"},{level:39,move:"Dragon Rush"},{level:41,move:"Outrage"},{level:46,move:"Safeguard"},{level:53,move:"Rain Dance"},{level:62,move:"Dragon Dance"},{level:80,move:"Hyper Beam"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Fly","Body Slam","Take Down","Flamethrower","Hydro Pump","Surf","Ice Beam","Blizzard","Hyper Beam","Low Kick","Fire Spin","Thunderbolt","Thunder Wave","Thunder","Earthquake","Agility","Light Screen","Metronome","Fire Blast","Waterfall","Swift","Rest","Rock Slide","Substitute","Protect","Scary Face","Icy Wind","Outrage","Sandstorm","Endure","Sleep Talk","Encore","Rain Dance","Sunny Day","Heat Wave","Facade","Helping Hand","Brick Break","Air Cutter","Rock Tomb","Aerial Ace","Dragon Claw","Dragon Dance","Water Pulse","Tailwind","Fling","Air Slash","Dragon Pulse","Focus Blast","Giga Impact","Draco Meteor","Iron Head","Stone Edge","Bulldoze","Dragon Tail","Hurricane","Stomping Tantrum","Body Press","Tera Blast","Ice Spinner","Snowscape","Chilling Water","Roar","Haze","Focus Punch","Weather Ball","Scale Shot","Breaking Swipe","Dragon Cheer"],
    egg: [],
    max: []
  },
  150: {
    levelUp: [{level:1,move:"Disable"},{level:1,move:"Confusion"},{level:1,move:"Swift"},{level:1,move:"Life Dew"},{level:8,move:"Ancient Power"},{level:16,move:"Psycho Cut"},{level:24,move:"Safeguard"},{level:32,move:"Amnesia"},{level:40,move:"Aura Sphere"},{level:48,move:"Psychic"},{level:56,move:"Power Swap"},{level:56,move:"Guard Swap"},{level:64,move:"Mist"},{level:72,move:"Psystrike"},{level:80,move:"Recover"},{level:88,move:"Future Sight"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Take Down","Flamethrower","Ice Beam","Blizzard","Psybeam","Hyper Beam","Low Kick","Solar Beam","Thunderbolt","Thunder Wave","Thunder","Earthquake","Psychic","Agility","Night Shade","Confuse Ray","Light Screen","Reflect","Metronome","Fire Blast","Swift","Amnesia","Rest","Rock Slide","Substitute","Reversal","Protect","Scary Face","Icy Wind","Sandstorm","Endure","Sleep Talk","Rain Dance","Sunny Day","Shadow Ball","Will-O-Wisp","Facade","Taunt","Helping Hand","Trick","Brick Break","Skill Swap","Imprison","Rock Tomb","Bulk Up","Calm Mind","Fling","Aura Sphere","Poison Jab","Dark Pulse","Power Gem","Drain Punch","Focus Blast","Energy Ball","Earth Power","Giga Impact","Nasty Plot","Avalanche","Zen Headbutt","Trick Room","Stone Edge","Grass Knot","Psyshock","Electro Ball","Low Sweep","Foul Play","Stored Power","Hex","Bulldoze","Hurricane","Psychic Terrain","Stomping Tantrum","Tera Blast","Trailblaze","Chilling Water","Spite","Gravity","Knock Off","Focus Punch","Weather Ball","Lash Out","Psych Up","Double-Edge","Future Sight","Expanding Force","Curse","Psychic Noise"],
    egg: [],
    max: []
  },
  151: {
    levelUp: [{level:1,move:"Pound"},{level:1,move:"Reflect Type"},{level:10,move:"Amnesia"},{level:20,move:"Baton Pass"},{level:30,move:"Ancient Power"},{level:40,move:"Life Dew"},{level:50,move:"Nasty Plot"},{level:60,move:"Metronome"},{level:70,move:"Imprison"},{level:80,move:"Transform"},{level:90,move:"Aura Sphere"},{level:100,move:"Psychic"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Swords Dance","Fly","Body Slam","Take Down","Flamethrower","Hydro Pump","Surf","Ice Beam","Blizzard","Psybeam","Hyper Beam","Low Kick","Solar Beam","Fire Spin","Thunderbolt","Thunder Wave","Thunder","Earthquake","Dig","Psychic","Agility","Night Shade","Confuse Ray","Light Screen","Reflect","Metronome","Fire Blast","Waterfall","Swift","Amnesia","Leech Life","Rest","Rock Slide","Substitute","Thief","Reversal","Protect","Scary Face","Sludge Bomb","Mud-Slap","Spikes","Icy Wind","Outrage","Sandstorm","Giga Drain","Endure","Charm","False Swipe","Sleep Talk","Baton Pass","Encore","Metal Claw","Rain Dance","Sunny Day","Crunch","Shadow Ball","Heat Wave","Will-O-Wisp","Facade","Taunt","Helping Hand","Trick","Brick Break","Skill Swap","Imprison","Hyper Voice","Blast Burn","Hydro Cannon","Fake Tears","Air Cutter","Overheat","Rock Tomb","Bullet Seed","Aerial Ace","Iron Defense","Dragon Claw","Frenzy Plant","Bulk Up","Mud Shot","Poison Tail","Magical Leaf","Calm Mind","Dragon Dance","Rock Blast","Water Pulse","Tailwind","U-turn","Close Combat","Fling","Toxic Spikes","Flare Blitz","Aura Sphere","Poison Jab","Dark Pulse","Seed Bomb","Air Slash","X-Scissor","Bug Buzz","Dragon Pulse","Power Gem","Drain Punch","Focus Blast","Energy Ball","Brave Bird","Earth Power","Giga Impact","Nasty Plot","Avalanche","Shadow Claw","Thunder Fang","Ice Fang","Fire Fang","Zen Headbutt","Flash Cannon","Trick Room","Draco Meteor","Leaf Storm","Gunk Shot","Iron Head","Stone Edge","Stealth Rock","Grass Knot","Charge Beam","Psyshock","Venoshock","Heavy Slam","Electro Ball","Flame Charge","Low Sweep","Acid Spray","Foul Play","Stored Power","Hex","Acrobatics","Water Pledge","Fire Pledge","Grass Pledge","Volt Switch","Struggle Bug","Bulldoze","Dragon Tail","Wild Charge","Drill Run","Hurricane","Snarl","Phantom Force","Disarming Voice","Draining Kiss","Grassy Terrain","Misty Terrain","Play Rough","Eerie Impulse","Electric Terrain","Dazzling Gleam","Pollen Puff","Psychic Terrain","Smart Strike","Psychic Fangs","Stomping Tantrum","Liquidation","Body Press","Steel Beam","Tera Blast","Ice Spinner","Snowscape","Pounce","Trailblaze","Chilling Water","Roar","Charge","Haze","Toxic","Sand Tomb","Spite","Gravity","Smack Down","Gyro Ball","Knock Off","Bug Bite","Super Fang","Vacuum Wave","Lunge","High Horsepower","Icicle Spear","Scald","Heat Crash","Solar Blade","Uproar","Focus Punch","Weather Ball","Grassy Glide","Burning Jealousy","Flip Turn","Dual Wingbeat","Poltergeist","Lash Out","Scale Shot","Misty Explosion","Pain Split","Psych Up","Double-Edge","Endeavor","Petal Blizzard","Temper Flare","Whirlpool","Muddy Water","Supercell Slam","Electroweb","Triple Axel","Coaching","Sludge Wave","Scorching Sands","Feather Dance","Future Sight","Expanding Force","Skitter Smack","Meteor Beam","Throat Chop","Breaking Swipe","Metal Sound","Curse","Hard Press","Dragon Cheer","Alluring Voice","Psychic Noise","Upper Hand"],
    egg: [],
    max: []
  },
  152: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Growl"},{level:6,move:"Razor Leaf"},{level:9,move:"Poison Powder"},{level:12,move:"Synthesis"},{level:17,move:"Reflect"},{level:20,move:"Magical Leaf"},{level:23,move:"Leech Seed"},{level:28,move:"Sweet Scent"},{level:31,move:"Light Screen"},{level:34,move:"Body Slam"},{level:39,move:"Safeguard"},{level:42,move:"Giga Drain"},{level:45,move:"Solar Beam"}],
    tm: ["Swords Dance","Body Slam","Take Down","Double-Edge","Solar Beam","Light Screen","Reflect","Rest","Substitute","Curse","Protect","Mud-Slap","Giga Drain","Endure","Charm","Sleep Talk","Encore","Sunny Day","Facade","Helping Hand","Fake Tears","Bullet Seed","Magical Leaf","Seed Bomb","Energy Ball","Leaf Storm","Grass Knot","Grass Pledge","Grassy Terrain","Solar Blade","Grassy Glide","Tera Blast","Trailblaze"],
    egg: ["Vine Whip","Counter","Flail","Ancient Power","Ingrain","Heal Pulse"],
    max: []
  },
  153: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Growl"},{level:1,move:"Razor Leaf"},{level:1,move:"Poison Powder"},{level:12,move:"Synthesis"},{level:18,move:"Reflect"},{level:22,move:"Magical Leaf"},{level:26,move:"Leech Seed"},{level:32,move:"Sweet Scent"},{level:36,move:"Light Screen"},{level:40,move:"Body Slam"},{level:46,move:"Safeguard"},{level:50,move:"Giga Drain"},{level:54,move:"Solar Beam"}],
    tm: ["Swords Dance","Body Slam","Take Down","Double-Edge","Solar Beam","Light Screen","Reflect","Rest","Substitute","Curse","Protect","Mud-Slap","Giga Drain","Endure","Charm","Sleep Talk","Encore","Sunny Day","Facade","Helping Hand","Knock Off","Fake Tears","Bullet Seed","Magical Leaf","Seed Bomb","Energy Ball","Leaf Storm","Grass Knot","Grass Pledge","Grassy Terrain","Solar Blade","Stomping Tantrum","Grassy Glide","Tera Blast","Trailblaze"],
    egg: ["Vine Whip","Counter","Flail","Ancient Power","Ingrain","Heal Pulse"],
    max: []
  },
  154: {
    levelUp: [{level:0,move:"Petal Dance"},{level:1,move:"Tackle"},{level:1,move:"Growl"},{level:1,move:"Razor Leaf"},{level:1,move:"Poison Powder"},{level:1,move:"Petal Blizzard"},{level:12,move:"Synthesis"},{level:18,move:"Reflect"},{level:22,move:"Magical Leaf"},{level:26,move:"Leech Seed"},{level:34,move:"Sweet Scent"},{level:40,move:"Light Screen"},{level:46,move:"Body Slam"},{level:54,move:"Safeguard"},{level:60,move:"Giga Drain"},{level:65,move:"Solar Beam"}],
    tm: ["Swords Dance","Body Slam","Take Down","Double-Edge","Hyper Beam","Solar Beam","Earthquake","Light Screen","Reflect","Rest","Substitute","Curse","Protect","Mud-Slap","Outrage","Giga Drain","Endure","Charm","Sleep Talk","Encore","Sunny Day","Facade","Helping Hand","Knock Off","Endeavor","Weather Ball","Fake Tears","Bullet Seed","Frenzy Plant","Magical Leaf","Seed Bomb","Energy Ball","Giga Impact","Zen Headbutt","Leaf Storm","Grass Knot","Grass Pledge","Bulldoze","Dragon Tail","Petal Blizzard","Grassy Terrain","Solar Blade","Stomping Tantrum","Body Press","Grassy Glide","Tera Blast","Trailblaze"],
    egg: ["Vine Whip","Counter","Flail","Ancient Power","Ingrain","Heal Pulse"],
    max: []
  },
  155: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Leer"},{level:6,move:"Smokescreen"},{level:10,move:"Ember"},{level:13,move:"Quick Attack"},{level:19,move:"Flame Wheel"},{level:22,move:"Defense Curl"},{level:28,move:"Flame Charge"},{level:31,move:"Swift"},{level:37,move:"Lava Plume"},{level:40,move:"Flamethrower"},{level:46,move:"Inferno"},{level:49,move:"Rollout"},{level:55,move:"Double-Edge"},{level:58,move:"Overheat"},{level:64,move:"Eruption"}],
    tm: ["Body Slam","Take Down","Flamethrower","Fire Spin","Dig","Fire Blast","Swift","Rest","Substitute","Reversal","Protect","Endure","Sleep Talk","Sunny Day","Heat Wave","Will-O-Wisp","Facade","Overheat","Aerial Ace","Flare Blitz","Fire Fang","Zen Headbutt","Iron Head","Flame Charge","Fire Pledge","Wild Charge","Play Rough","Tera Blast","Roar","Burning Jealousy","Double-Edge","Curse","Temper Flare"],
    egg: ["Double Kick","Curse","Reversal","Extrasensory","Howl","Covet"],
    max: []
  },
  156: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Leer"},{level:1,move:"Smokescreen"},{level:10,move:"Ember"},{level:13,move:"Quick Attack"},{level:20,move:"Flame Wheel"},{level:24,move:"Defense Curl"},{level:31,move:"Swift"},{level:35,move:"Flame Charge"},{level:42,move:"Lava Plume"},{level:46,move:"Flamethrower"},{level:53,move:"Inferno"},{level:57,move:"Rollout"},{level:64,move:"Double-Edge"},{level:68,move:"Overheat"},{level:75,move:"Eruption"}],
    tm: ["Body Slam","Take Down","Flamethrower","Fire Spin","Dig","Fire Blast","Swift","Rest","Substitute","Reversal","Protect","Endure","Sleep Talk","Sunny Day","Heat Wave","Will-O-Wisp","Facade","Brick Break","Overheat","Aerial Ace","Flare Blitz","Fire Fang","Zen Headbutt","Iron Head","Flame Charge","Fire Pledge","Wild Charge","Play Rough","Tera Blast","Roar","Burning Jealousy","Double-Edge","Curse","Endeavor","Temper Flare"],
    egg: ["Double Kick","Curse","Reversal","Extrasensory","Howl","Covet"],
    max: []
  },
  157: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Double-Edge"},{level:1,move:"Leer"},{level:1,move:"Ember"},{level:1,move:"Gyro Ball"},{level:1,move:"Smokescreen"},{level:1,move:"Eruption"},{level:13,move:"Quick Attack"},{level:20,move:"Flame Wheel"},{level:24,move:"Defense Curl"},{level:31,move:"Swift"},{level:35,move:"Flame Charge"},{level:43,move:"Lava Plume"},{level:48,move:"Flamethrower"},{level:56,move:"Inferno"},{level:61,move:"Rollout"},{level:74,move:"Overheat"}],
    tm: ["Fire Punch","Thunder Punch","Body Slam","Take Down","Flamethrower","Hyper Beam","Low Kick","Solar Beam","Fire Spin","Earthquake","Dig","Fire Blast","Swift","Rest","Rock Slide","Substitute","Reversal","Protect","Endure","Sleep Talk","Sunny Day","Shadow Ball","Heat Wave","Will-O-Wisp","Facade","Helping Hand","Brick Break","Blast Burn","Overheat","Rock Tomb","Aerial Ace","Fling","Flare Blitz","Focus Blast","Giga Impact","Shadow Claw","Fire Fang","Zen Headbutt","Iron Head","Flame Charge","Fire Pledge","Bulldoze","Wild Charge","Play Rough","Stomping Tantrum","Tera Blast","Roar","Gyro Ball","Focus Punch","Burning Jealousy","Double-Edge","Night Shade","Confuse Ray","Curse","Spite","Endeavor","Calm Mind","Hex","Throat Chop","Poltergeist","Scorching Sands","Temper Flare"],
    egg: ["Double Kick","Curse","Reversal","Extrasensory","Howl","Covet"],
    max: []
  },
  158: {
    levelUp: [{level:1,move:"Scratch"},{level:1,move:"Leer"},{level:6,move:"Water Gun"},{level:9,move:"Bite"},{level:13,move:"Scary Face"},{level:19,move:"Ice Fang"},{level:22,move:"Flail"},{level:27,move:"Crunch"},{level:30,move:"Slash"},{level:33,move:"Screech"},{level:37,move:"Thrash"},{level:41,move:"Aqua Tail"},{level:45,move:"Superpower"},{level:50,move:"Hydro Pump"}],
    tm: ["Ice Punch","Swords Dance","Take Down","Double-Edge","Hydro Pump","Surf","Ice Beam","Blizzard","Low Kick","Dig","Waterfall","Rest","Rock Slide","Substitute","Thief","Curse","Spite","Protect","Scary Face","Mud-Slap","Icy Wind","Endure","Sleep Talk","Metal Claw","Rain Dance","Crunch","Whirlpool","Uproar","Facade","Focus Punch","Brick Break","Endeavor","Fake Tears","Rock Tomb","Muddy Water","Aerial Ace","Dragon Claw","Dragon Dance","Water Pulse","Fling","Shadow Claw","Ice Fang","Water Pledge","Liquidation","Breaking Swipe","Flip Turn","Tera Blast","Trailblaze","Chilling Water"],
    egg: ["Counter","Ancient Power","Flatter","Block","Aqua Jet"],
    max: []
  },
  159: {
    levelUp: [{level:1,move:"Scratch"},{level:1,move:"Leer"},{level:1,move:"Water Gun"},{level:13,move:"Bite"},{level:15,move:"Scary Face"},{level:21,move:"Ice Fang"},{level:24,move:"Flail"},{level:30,move:"Crunch"},{level:34,move:"Slash"},{level:37,move:"Screech"},{level:42,move:"Thrash"},{level:47,move:"Aqua Tail"},{level:50,move:"Superpower"},{level:55,move:"Hydro Pump"}],
    tm: ["Ice Punch","Swords Dance","Take Down","Double-Edge","Roar","Hydro Pump","Surf","Ice Beam","Blizzard","Low Kick","Dig","Waterfall","Rest","Rock Slide","Substitute","Thief","Curse","Spite","Protect","Scary Face","Mud-Slap","Icy Wind","Endure","Sleep Talk","Metal Claw","Rain Dance","Crunch","Whirlpool","Uproar","Facade","Focus Punch","Brick Break","Endeavor","Fake Tears","Rock Tomb","Muddy Water","Aerial Ace","Dragon Claw","Dragon Dance","Water Pulse","Fling","Shadow Claw","Ice Fang","Water Pledge","Psychic Fangs","Liquidation","Breaking Swipe","Flip Turn","Tera Blast","Trailblaze","Chilling Water"],
    egg: ["Counter","Ancient Power","Flatter","Block","Aqua Jet"],
    max: []
  },
  160: {
    levelUp: [{level:1,move:"Scratch"},{level:1,move:"Leer"},{level:1,move:"Water Gun"},{level:1,move:"Agility"},{level:13,move:"Bite"},{level:15,move:"Scary Face"},{level:21,move:"Ice Fang"},{level:24,move:"Flail"},{level:32,move:"Crunch"},{level:37,move:"Slash"},{level:44,move:"Screech"},{level:51,move:"Thrash"},{level:59,move:"Aqua Tail"},{level:65,move:"Superpower"},{level:70,move:"Hydro Pump"}],
    tm: ["Ice Punch","Swords Dance","Body Slam","Take Down","Double-Edge","Roar","Hydro Pump","Surf","Ice Beam","Blizzard","Hyper Beam","Low Kick","Earthquake","Dig","Agility","Waterfall","Rest","Rock Slide","Substitute","Thief","Curse","Spite","Protect","Scary Face","Mud-Slap","Icy Wind","Outrage","Endure","Sleep Talk","Metal Claw","Rain Dance","Crunch","Whirlpool","Uproar","Facade","Focus Punch","Helping Hand","Brick Break","Endeavor","Hydro Cannon","Fake Tears","Rock Tomb","Muddy Water","Aerial Ace","Dragon Claw","Dragon Dance","Water Pulse","Fling","Focus Blast","Giga Impact","Avalanche","Shadow Claw","Ice Fang","Water Pledge","Bulldoze","Dragon Tail","Snarl","Psychic Fangs","Stomping Tantrum","Liquidation","Breaking Swipe","Scale Shot","Lash Out","Flip Turn","Tera Blast","Trailblaze","Chilling Water"],
    egg: ["Counter","Ancient Power","Flatter","Block","Aqua Jet"],
    max: []
  },
  161: {
    levelUp: [{level:1,move:"Scratch"},{level:4,move:"Defense Curl"},{level:7,move:"Quick Attack"},{level:13,move:"Fury Swipes"},{level:16,move:"Helping Hand"},{level:19,move:"Follow Me"},{level:25,move:"Slam"},{level:28,move:"Rest"},{level:31,move:"Sucker Punch"},{level:36,move:"Amnesia"},{level:39,move:"Baton Pass"},{level:42,move:"Double-Edge"},{level:47,move:"Hyper Voice"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Take Down","Flamethrower","Surf","Ice Beam","Blizzard","Solar Beam","Thunderbolt","Thunder","Dig","Swift","Amnesia","Rest","Super Fang","Substitute","Thief","Reversal","Protect","Endure","Charm","Sleep Talk","Baton Pass","Rain Dance","Sunny Day","Shadow Ball","Uproar","Facade","Focus Punch","Helping Hand","Trick","Brick Break","Knock Off","Hyper Voice","Water Pulse","U-turn","Fling","Seed Bomb","Shadow Claw","Grass Knot","Charge Beam","Play Rough","Tera Blast","Trailblaze","Chilling Water","Double-Edge","Endeavor"],
    egg: ["Focus Energy","Slash","Reversal","Last Resort","Baby-Doll Eyes","Tidy Up"],
    max: []
  },
  162: {
    levelUp: [{level:0,move:"Agility"},{level:1,move:"Scratch"},{level:1,move:"Quick Attack"},{level:1,move:"Defense Curl"},{level:1,move:"Coil"},{level:13,move:"Fury Swipes"},{level:17,move:"Helping Hand"},{level:21,move:"Follow Me"},{level:28,move:"Slam"},{level:32,move:"Rest"},{level:36,move:"Sucker Punch"},{level:42,move:"Amnesia"},{level:46,move:"Baton Pass"},{level:50,move:"Double-Edge"},{level:56,move:"Hyper Voice"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Take Down","Flamethrower","Surf","Ice Beam","Blizzard","Hyper Beam","Solar Beam","Thunderbolt","Thunder","Dig","Agility","Swift","Amnesia","Rest","Super Fang","Substitute","Thief","Reversal","Protect","Endure","Charm","Sleep Talk","Baton Pass","Rain Dance","Sunny Day","Shadow Ball","Uproar","Facade","Focus Punch","Helping Hand","Trick","Brick Break","Knock Off","Hyper Voice","Water Pulse","U-turn","Fling","Seed Bomb","Focus Blast","Giga Impact","Shadow Claw","Zen Headbutt","Grass Knot","Charge Beam","Play Rough","Tera Blast","Trailblaze","Chilling Water","Double-Edge","Endeavor"],
    egg: ["Focus Energy","Slash","Reversal","Last Resort","Baby-Doll Eyes","Tidy Up"],
    max: []
  },
  163: {
    levelUp: [{level:1,move:"Growl"},{level:1,move:"Peck"},{level:3,move:"Tackle"},{level:6,move:"Echoed Voice"},{level:9,move:"Confusion"},{level:12,move:"Reflect"},{level:15,move:"Defog"},{level:18,move:"Air Slash"},{level:21,move:"Extrasensory"},{level:24,move:"Take Down"},{level:27,move:"Uproar"},{level:30,move:"Roost"},{level:33,move:"Moonblast"},{level:36,move:"Hypnosis"},{level:39,move:"Dream Eater"}],
    tm: ["Fly","Take Down","Psybeam","Psychic","Agility","Night Shade","Confuse Ray","Haze","Reflect","Swift","Amnesia","Rest","Substitute","Thief","Spite","Protect","Endure","Sleep Talk","Rain Dance","Sunny Day","Shadow Ball","Uproar","Heat Wave","Facade","Skill Swap","Imprison","Hyper Voice","Air Cutter","Aerial Ace","Calm Mind","Tailwind","Air Slash","Brave Bird","Nasty Plot","Zen Headbutt","Stored Power","Acrobatics","Hurricane","Dual Wingbeat","Tera Blast","Psych Up","Feather Dance"],
    egg: ["Wing Attack","Whirlwind","Supersonic","Night Shade","Feather Dance"],
    max: []
  },
  164: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Growl"},{level:1,move:"Peck"},{level:1,move:"Sky Attack"},{level:1,move:"Echoed Voice"},{level:9,move:"Confusion"},{level:12,move:"Reflect"},{level:18,move:"Air Slash"},{level:23,move:"Extrasensory"},{level:28,move:"Take Down"},{level:33,move:"Uproar"},{level:38,move:"Roost"},{level:43,move:"Moonblast"},{level:48,move:"Hypnosis"},{level:53,move:"Dream Eater"}],
    tm: ["Fly","Body Slam","Take Down","Psybeam","Hyper Beam","Psychic","Agility","Night Shade","Confuse Ray","Haze","Reflect","Swift","Amnesia","Rest","Substitute","Thief","Spite","Protect","Scary Face","Endure","Sleep Talk","Rain Dance","Sunny Day","Shadow Ball","Uproar","Heat Wave","Facade","Skill Swap","Imprison","Hyper Voice","Air Cutter","Aerial Ace","Calm Mind","Tailwind","Air Slash","Brave Bird","Giga Impact","Nasty Plot","Zen Headbutt","Stored Power","Acrobatics","Hurricane","Dual Wingbeat","Tera Blast","Psych Up","Double-Edge","Feather Dance","Future Sight","Curse","Psychic Noise"],
    egg: ["Wing Attack","Whirlwind","Supersonic","Night Shade","Feather Dance"],
    max: []
  },
  165: {
    levelUp: [{level:1,move:"Tackle"},{level:5,move:"Supersonic"},{level:8,move:"Swift"},{level:12,move:"Light Screen"},{level:12,move:"Reflect"},{level:12,move:"Safeguard"},{level:15,move:"Mach Punch"},{level:19,move:"Roost"},{level:22,move:"Struggle Bug"},{level:26,move:"Baton Pass"},{level:29,move:"Agility"},{level:33,move:"Bug Buzz"},{level:36,move:"Air Slash"},{level:40,move:"Double-Edge"}],
    tm: ["Swords Dance","Solar Beam","Dig","Double Team","Light Screen","Reflect","Flash","Rest","Substitute","Thief","Protect","Giga Drain","Endure","Swagger","Attract","Sleep Talk","Safeguard","Sunny Day","Facade","Focus Punch","Brick Break","Aerial Ace","Roost","U-turn","Fling","Bug Buzz","Drain Punch"],
    egg: ["Psybeam","Counter","Screech","Encore","Knock Off","Tailwind","Bug Bite"],
    max: []
  },
  166: {
    levelUp: [{level:1,move:"Supersonic"},{level:1,move:"Swift"},{level:1,move:"Tackle"},{level:5,move:"Supersonic"},{level:8,move:"Swift"},{level:12,move:"Light Screen"},{level:12,move:"Reflect"},{level:12,move:"Safeguard"},{level:15,move:"Mach Punch"},{level:20,move:"Roost"},{level:24,move:"Struggle Bug"},{level:29,move:"Baton Pass"},{level:33,move:"Agility"},{level:38,move:"Bug Buzz"},{level:42,move:"Air Slash"},{level:47,move:"Double-Edge"}],
    tm: ["Swords Dance","Hyper Beam","Strength","Solar Beam","Dig","Double Team","Light Screen","Reflect","Flash","Rest","Substitute","Thief","Protect","Giga Drain","Endure","Swagger","Attract","Sleep Talk","Safeguard","Sunny Day","Rock Smash","Facade","Focus Punch","Brick Break","Aerial Ace","Roost","U-turn","Fling","Bug Buzz","Drain Punch","Focus Blast","Giga Impact"],
    egg: [],
    max: []
  },
  167: {
    levelUp: [{level:1,move:"Poison Sting"},{level:1,move:"String Shot"},{level:5,move:"Absorb"},{level:8,move:"Infestation"},{level:12,move:"Scary Face"},{level:15,move:"Night Shade"},{level:19,move:"Shadow Sneak"},{level:22,move:"Fury Swipes"},{level:26,move:"Sucker Punch"},{level:29,move:"Agility"},{level:33,move:"Pin Missile"},{level:36,move:"Psychic"},{level:40,move:"Poison Jab"},{level:44,move:"Cross Poison"},{level:47,move:"Sticky Web"},{level:51,move:"Toxic Thread"}],
    tm: ["Solar Beam","Dig","Toxic","Psychic","Agility","Night Shade","Leech Life","Rest","Substitute","Thief","Spite","Protect","Scary Face","Sludge Bomb","Giga Drain","Endure","Sleep Talk","Baton Pass","Sunny Day","Facade","Knock Off","Toxic Spikes","Poison Jab","X-Scissor","Bug Buzz","Bug Bite","Venoshock","Acid Spray","Foul Play","Hex","Struggle Bug","Lunge","Tera Blast","Pounce","Trailblaze","Electroweb","Sludge Wave","Skitter Smack"],
    egg: ["Disable","Megahorn","Night Slash","Rage Powder","Lunge"],
    max: []
  },
  168: {
    levelUp: [{level:0,move:"Swords Dance"},{level:1,move:"Poison Sting"},{level:1,move:"Fell Stinger"},{level:1,move:"Absorb"},{level:1,move:"String Shot"},{level:1,move:"Bug Bite"},{level:1,move:"Focus Energy"},{level:8,move:"Infestation"},{level:12,move:"Scary Face"},{level:15,move:"Night Shade"},{level:19,move:"Shadow Sneak"},{level:23,move:"Fury Swipes"},{level:28,move:"Sucker Punch"},{level:31,move:"Agility"},{level:35,move:"Pin Missile"},{level:41,move:"Psychic"},{level:46,move:"Poison Jab"},{level:50,move:"Cross Poison"},{level:54,move:"Sticky Web"},{level:59,move:"Toxic Thread"}],
    tm: ["Swords Dance","Hyper Beam","Solar Beam","Dig","Toxic","Psychic","Agility","Night Shade","Leech Life","Rest","Substitute","Thief","Spite","Protect","Scary Face","Sludge Bomb","Giga Drain","Endure","Sleep Talk","Baton Pass","Sunny Day","Facade","Knock Off","Toxic Spikes","Poison Jab","X-Scissor","Bug Buzz","Giga Impact","Bug Bite","Venoshock","Acid Spray","Foul Play","Hex","Struggle Bug","Lunge","Smart Strike","Tera Blast","Pounce","Trailblaze","Electroweb","Sludge Wave","Skitter Smack","Throat Chop"],
    egg: ["Disable","Megahorn","Night Slash","Rage Powder","Lunge"],
    max: []
  },
  169: {
    levelUp: [{level:1,move:"Gust"},{level:6,move:"Hypnosis"},{level:11,move:"Bite"},{level:18,move:"Air Cutter"},{level:25,move:"Cross Poison"},{level:34,move:"Air Slash"},{level:43,move:"Leech Life"}],
    tm: [],
    egg: [],
    max: []
  },
  170: {
    levelUp: [{level:1,move:"Supersonic"},{level:1,move:"Water Gun"},{level:4,move:"Electro Ball"},{level:8,move:"Thunder Wave"},{level:12,move:"Bubble Beam"},{level:16,move:"Confuse Ray"},{level:20,move:"Spark"},{level:24,move:"Charge"},{level:28,move:"Discharge"},{level:32,move:"Aqua Ring"},{level:36,move:"Flail"},{level:40,move:"Take Down"},{level:44,move:"Hydro Pump"}],
    tm: ["Take Down","Double-Edge","Hydro Pump","Surf","Ice Beam","Blizzard","Psybeam","Thunderbolt","Thunder Wave","Thunder","Agility","Confuse Ray","Waterfall","Amnesia","Rest","Substitute","Curse","Protect","Icy Wind","Endure","Sleep Talk","Rain Dance","Whirlpool","Facade","Charge","Muddy Water","Water Pulse","Charge Beam","Electro Ball","Scald","Volt Switch","Electroweb","Wild Charge","Eerie Impulse","Electric Terrain","Dazzling Gleam","Liquidation","Flip Turn","Tera Blast","Chilling Water"],
    egg: ["Mist","Psybeam","Water Pulse","Sucker Punch","Soak"],
    max: []
  },
  171: {
    levelUp: [{level:0,move:"Swallow"},{level:0,move:"Spit Up"},{level:0,move:"Stockpile"},{level:1,move:"Eerie Impulse"},{level:1,move:"Supersonic"},{level:1,move:"Water Gun"},{level:1,move:"Thunder Wave"},{level:1,move:"Electro Ball"},{level:12,move:"Bubble Beam"},{level:16,move:"Confuse Ray"},{level:20,move:"Spark"},{level:24,move:"Charge"},{level:30,move:"Discharge"},{level:36,move:"Aqua Ring"},{level:42,move:"Flail"},{level:48,move:"Take Down"},{level:54,move:"Hydro Pump"}],
    tm: ["Take Down","Double-Edge","Hydro Pump","Surf","Ice Beam","Blizzard","Psybeam","Hyper Beam","Thunderbolt","Thunder Wave","Thunder","Agility","Confuse Ray","Waterfall","Amnesia","Rest","Substitute","Curse","Protect","Icy Wind","Endure","Sleep Talk","Rain Dance","Whirlpool","Facade","Charge","Muddy Water","Water Pulse","Giga Impact","Charge Beam","Electro Ball","Scald","Volt Switch","Electroweb","Wild Charge","Eerie Impulse","Electric Terrain","Dazzling Gleam","Liquidation","Flip Turn","Tera Blast","Chilling Water"],
    egg: ["Mist","Psybeam","Water Pulse","Sucker Punch","Soak"],
    max: []
  },
  172: {
    levelUp: [{level:1,move:"Tail Whip"},{level:1,move:"Thunder Shock"},{level:4,move:"Play Nice"},{level:8,move:"Sweet Kiss"},{level:12,move:"Nuzzle"},{level:16,move:"Nasty Plot"},{level:20,move:"Charm"}],
    tm: ["Thunder Punch","Body Slam","Take Down","Surf","Thunderbolt","Thunder Wave","Thunder","Light Screen","Reflect","Swift","Rest","Substitute","Reversal","Protect","Endure","Charm","Sleep Talk","Encore","Rain Dance","Facade","Helping Hand","Fling","Nasty Plot","Grass Knot","Electro Ball","Volt Switch","Wild Charge","Disarming Voice","Play Rough","Electric Terrain","Tera Blast","Trailblaze","Charge","Electroweb"],
    egg: ["Flail","Present","Fake Out","Charge","Wish","Tickle","Disarming Voice"],
    max: []
  },
  173: {
    levelUp: [{level:1,move:"Pound"},{level:1,move:"Splash"},{level:1,move:"Copycat"},{level:4,move:"Sing"},{level:8,move:"Sweet Kiss"},{level:12,move:"Disarming Voice"},{level:16,move:"Encore"},{level:20,move:"Charm"}],
    tm: ["Body Slam","Flamethrower","Psybeam","Solar Beam","Thunder Wave","Dig","Psychic","Light Screen","Reflect","Metronome","Fire Blast","Swift","Amnesia","Rest","Substitute","Protect","Icy Wind","Endure","Charm","Sleep Talk","Encore","Rain Dance","Sunny Day","Shadow Ball","Uproar","Facade","Helping Hand","Trick","Hyper Voice","Fake Tears","Magical Leaf","Calm Mind","Water Pulse","Gravity","Fling","Zen Headbutt","Grass Knot","Psyshock","Stored Power","Disarming Voice","Draining Kiss","Misty Terrain","Play Rough","Dazzling Gleam","Tera Blast","Chilling Water","Endeavor","Alluring Voice"],
    egg: ["Present","Wish","Tickle","Heal Pulse"],
    max: []
  },
  174: {
    levelUp: [{level:1,move:"Pound"},{level:1,move:"Sing"},{level:1,move:"Copycat"},{level:4,move:"Defense Curl"},{level:8,move:"Sweet Kiss"},{level:12,move:"Disarming Voice"},{level:16,move:"Disable"},{level:20,move:"Charm"}],
    tm: ["Body Slam","Take Down","Flamethrower","Solar Beam","Thunder Wave","Dig","Psychic","Light Screen","Reflect","Fire Blast","Swift","Rest","Substitute","Protect","Icy Wind","Endure","Charm","Sleep Talk","Encore","Rain Dance","Sunny Day","Shadow Ball","Facade","Helping Hand","Hyper Voice","Fake Tears","Fling","Grass Knot","Wild Charge","Disarming Voice","Draining Kiss","Misty Terrain","Play Rough","Dazzling Gleam","Tera Blast","Trailblaze","Gravity","Pain Split","Psych Up","Double-Edge","Endeavor","Alluring Voice"],
    egg: ["Perish Song","Rollout","Present","Wish","Covet","Gravity","Last Resort","Heal Pulse"],
    max: []
  },
  175: {
    levelUp: [{level:1,move:"Tackle"},{level:6,move:"Fairy Wind"},{level:11,move:"Draining Kiss"},{level:18,move:"Calm Mind"},{level:25,move:"Baby-Doll Eyes"},{level:34,move:"Extrasensory"},{level:43,move:"Moonblast"}],
    tm: [],
    egg: [],
    max: []
  },
  176: {
    levelUp: [{level:0,move:"Air Cutter"},{level:1,move:"Tackle"},{level:6,move:"Fairy Wind"},{level:11,move:"Draining Kiss"},{level:18,move:"Calm Mind"},{level:25,move:"Baby-Doll Eyes"},{level:25,move:"Air Slash"},{level:34,move:"Extrasensory"},{level:43,move:"Moonblast"}],
    tm: [],
    egg: [],
    max: []
  },
  177: {
    levelUp: [{level:1,move:"Leer"},{level:1,move:"Peck"},{level:5,move:"Stored Power"},{level:10,move:"Teleport"},{level:15,move:"Confuse Ray"},{level:20,move:"Night Shade"},{level:26,move:"Psycho Shift"},{level:30,move:"Power Swap"},{level:35,move:"Guard Swap"},{level:35,move:"Psychic"},{level:40,move:"Wish"},{level:45,move:"Future Sight"}],
    tm: ["Solar Beam","Thunder Wave","Psychic","Double Team","Light Screen","Reflect","Dream Eater","Flash","Rest","Substitute","Thief","Protect","Giga Drain","Endure","Swagger","Steel Wing","Attract","Sleep Talk","Rain Dance","Sunny Day","Psych Up","Shadow Ball","Facade","Skill Swap","Aerial Ace","Calm Mind","Roost","Pluck","U-turn","Trick Room","Grass Knot","Dazzling Gleam"],
    egg: ["Drill Peck","Quick Attack","Haze","Feather Dance","Sucker Punch","Zen Headbutt","Simple Beam","Ally Switch"],
    max: []
  },
  178: {
    levelUp: [{level:0,move:"Air Slash"},{level:1,move:"Air Slash"},{level:1,move:"Leer"},{level:1,move:"Peck"},{level:1,move:"Stored Power"},{level:1,move:"Tailwind"},{level:1,move:"Teleport"},{level:15,move:"Confuse Ray"},{level:20,move:"Night Shade"},{level:28,move:"Psycho Shift"},{level:34,move:"Guard Swap"},{level:34,move:"Power Swap"},{level:41,move:"Psychic"},{level:48,move:"Wish"},{level:55,move:"Future Sight"}],
    tm: ["Fly","Hyper Beam","Solar Beam","Thunder Wave","Psychic","Double Team","Light Screen","Reflect","Dream Eater","Flash","Rest","Substitute","Thief","Protect","Giga Drain","Endure","Swagger","Steel Wing","Attract","Sleep Talk","Rain Dance","Sunny Day","Psych Up","Shadow Ball","Facade","Skill Swap","Aerial Ace","Calm Mind","Roost","Pluck","U-turn","Giga Impact","Defog","Trick Room","Grass Knot","Dazzling Gleam"],
    egg: [],
    max: []
  },
  179: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Growl"},{level:4,move:"Thunder Wave"},{level:8,move:"Thunder Shock"},{level:11,move:"Cotton Spore"},{level:15,move:"Charge"},{level:18,move:"Take Down"},{level:22,move:"Electro Ball"},{level:25,move:"Confuse Ray"},{level:29,move:"Power Gem"},{level:32,move:"Discharge"},{level:36,move:"Cotton Guard"},{level:39,move:"Dazzling Gleam"},{level:43,move:"Light Screen"},{level:46,move:"Thunder"}],
    tm: ["Body Slam","Take Down","Thunderbolt","Thunder Wave","Thunder","Dig","Agility","Confuse Ray","Light Screen","Reflect","Rest","Substitute","Protect","Endure","Sleep Talk","Rain Dance","Sunny Day","Facade","Helping Hand","Power Gem","Charge Beam","Electro Ball","Volt Switch","Wild Charge","Eerie Impulse","Electric Terrain","Dazzling Gleam","Tera Blast","Trailblaze","Charge","Double-Edge","Endeavor","Electroweb"],
    egg: ["Agility","Flatter","After You","Electroweb","Eerie Impulse","Electric Terrain"],
    max: []
  },
  180: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Growl"},{level:6,move:"Thunder Shock"},{level:9,move:"Thunder Wave"},{level:11,move:"Cotton Spore"},{level:16,move:"Charge"},{level:20,move:"Take Down"},{level:25,move:"Electro Ball"},{level:29,move:"Confuse Ray"},{level:34,move:"Power Gem"},{level:38,move:"Discharge"},{level:43,move:"Cotton Guard"},{level:47,move:"Dazzling Gleam"},{level:52,move:"Light Screen"},{level:56,move:"Thunder"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Take Down","Low Kick","Thunderbolt","Thunder Wave","Thunder","Dig","Agility","Confuse Ray","Light Screen","Reflect","Swift","Rest","Substitute","Protect","Endure","Sleep Talk","Rain Dance","Sunny Day","Facade","Helping Hand","Brick Break","Fling","Power Gem","Charge Beam","Electro Ball","Volt Switch","Wild Charge","Eerie Impulse","Electric Terrain","Dazzling Gleam","Tera Blast","Trailblaze","Roar","Charge","Focus Punch","Double-Edge","Endeavor","Electroweb"],
    egg: [],
    max: []
  },
  181: {
    levelUp: [{level:0,move:"Thunder Punch"},{level:1,move:"Fire Punch"},{level:1,move:"Tackle"},{level:1,move:"Growl"},{level:1,move:"Thunder Shock"},{level:1,move:"Thunder Wave"},{level:1,move:"Dragon Pulse"},{level:1,move:"Magnetic Flux"},{level:1,move:"Zap Cannon"},{level:11,move:"Cotton Spore"},{level:16,move:"Charge"},{level:20,move:"Take Down"},{level:25,move:"Electro Ball"},{level:29,move:"Confuse Ray"},{level:35,move:"Power Gem"},{level:40,move:"Discharge"},{level:46,move:"Cotton Guard"},{level:51,move:"Dazzling Gleam"},{level:57,move:"Light Screen"},{level:62,move:"Thunder"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Take Down","Hyper Beam","Low Kick","Thunderbolt","Thunder Wave","Thunder","Dig","Agility","Confuse Ray","Light Screen","Reflect","Swift","Rest","Substitute","Protect","Outrage","Endure","Sleep Talk","Rain Dance","Sunny Day","Facade","Helping Hand","Brick Break","Fling","Dragon Pulse","Power Gem","Focus Blast","Giga Impact","Charge Beam","Electro Ball","Volt Switch","Bulldoze","Dragon Tail","Wild Charge","Eerie Impulse","Electric Terrain","Dazzling Gleam","Stomping Tantrum","Tera Blast","Trailblaze","Roar","Charge","Focus Punch","Double-Edge","Endeavor","Supercell Slam","Electroweb","Meteor Beam","Breaking Swipe","Dragon Cheer"],
    egg: [],
    max: []
  },
  182: {
    levelUp: [{level:0,move:"Petal Blizzard"},{level:1,move:"Acid"},{level:1,move:"Absorb"},{level:1,move:"Mega Drain"},{level:1,move:"Growth"},{level:1,move:"Poison Powder"},{level:1,move:"Stun Spore"},{level:1,move:"Sleep Powder"},{level:1,move:"Petal Dance"},{level:1,move:"Toxic"},{level:1,move:"Giga Drain"},{level:1,move:"Sweet Scent"},{level:1,move:"Moonlight"},{level:1,move:"Quiver Dance"},{level:1,move:"Grassy Terrain"},{level:1,move:"Moonblast"}],
    tm: ["Swords Dance","Hyper Beam","Solar Beam","Toxic","Rest","Substitute","Protect","Sludge Bomb","Giga Drain","Endure","Charm","Sleep Talk","Baton Pass","Encore","Sunny Day","Uproar","Facade","Helping Hand","Endeavor","Weather Ball","Bullet Seed","Magical Leaf","Fling","Seed Bomb","Drain Punch","Energy Ball","Giga Impact","Leaf Storm","Grass Knot","Venoshock","Acid Spray","Petal Blizzard","Grassy Terrain","Play Rough","Dazzling Gleam","Solar Blade","Pollen Puff","Grassy Glide","Triple Axel","Tera Blast","Trailblaze"],
    egg: ["Leech Seed","Razor Leaf","Flail","Synthesis","Ingrain","Teeter Dance","Tickle","After You","Strength Sap"],
    max: []
  },
  183: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Helping Hand"},{level:1,move:"Tail Whip"},{level:1,move:"Water Gun"},{level:1,move:"Rollout"},{level:1,move:"Defense Curl"},{level:6,move:"Bubble Beam"},{level:9,move:"Charm"},{level:12,move:"Slam"},{level:15,move:"Bounce"},{level:19,move:"Aqua Tail"},{level:21,move:"Play Rough"},{level:24,move:"Aqua Ring"},{level:27,move:"Rain Dance"},{level:30,move:"Hydro Pump"},{level:33,move:"Double-Edge"},{level:36,move:"Superpower"}],
    tm: ["Ice Punch","Body Slam","Take Down","Hydro Pump","Surf","Ice Beam","Blizzard","Dig","Light Screen","Metronome","Waterfall","Swift","Amnesia","Rest","Substitute","Protect","Mud-Slap","Icy Wind","Endure","Charm","Sleep Talk","Encore","Rain Dance","Facade","Helping Hand","Brick Break","Hyper Voice","Fake Tears","Mud Shot","Water Pulse","Fling","Grass Knot","Bulldoze","Disarming Voice","Draining Kiss","Misty Terrain","Play Rough","Liquidation","Tera Blast","Ice Spinner","Snowscape","Trailblaze","Chilling Water","Knock Off","Focus Punch","Misty Explosion","Double-Edge","Whirlpool","Muddy Water","Alluring Voice"],
    egg: [],
    max: []
  },
  184: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Helping Hand"},{level:1,move:"Tail Whip"},{level:1,move:"Water Gun"},{level:1,move:"Rollout"},{level:1,move:"Defense Curl"},{level:6,move:"Bubble Beam"},{level:9,move:"Charm"},{level:12,move:"Slam"},{level:15,move:"Bounce"},{level:21,move:"Aqua Tail"},{level:25,move:"Play Rough"},{level:30,move:"Aqua Ring"},{level:35,move:"Rain Dance"},{level:40,move:"Hydro Pump"},{level:45,move:"Double-Edge"},{level:50,move:"Superpower"}],
    tm: ["Ice Punch","Body Slam","Take Down","Hydro Pump","Surf","Ice Beam","Blizzard","Hyper Beam","Dig","Light Screen","Metronome","Waterfall","Swift","Amnesia","Rest","Substitute","Protect","Mud-Slap","Icy Wind","Endure","Charm","Sleep Talk","Encore","Rain Dance","Facade","Helping Hand","Brick Break","Hyper Voice","Fake Tears","Mud Shot","Water Pulse","Fling","Focus Blast","Giga Impact","Grass Knot","Bulldoze","Disarming Voice","Draining Kiss","Misty Terrain","Play Rough","Liquidation","Tera Blast","Ice Spinner","Snowscape","Trailblaze","Chilling Water","Knock Off","Focus Punch","Misty Explosion","Double-Edge","Whirlpool","Muddy Water","Alluring Voice"],
    egg: [],
    max: []
  },
  185: {
    levelUp: [{level:0,move:"Slam"},{level:1,move:"Wood Hammer"},{level:1,move:"Stone Edge"},{level:1,move:"Copycat"},{level:1,move:"Hammer Arm"},{level:1,move:"Flail"},{level:1,move:"Fake Tears"},{level:1,move:"Rock Throw"},{level:12,move:"Block"},{level:16,move:"Mimic"},{level:20,move:"Rock Tomb"},{level:24,move:"Tearful Look"},{level:28,move:"Sucker Punch"},{level:32,move:"Rock Slide"},{level:36,move:"Low Kick"},{level:40,move:"Counter"},{level:44,move:"Double-Edge"},{level:48,move:"Head Smash"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Take Down","Hyper Beam","Low Kick","Earthquake","Dig","Rest","Rock Slide","Substitute","Thief","Protect","Mud-Slap","Spikes","Sandstorm","Endure","Sleep Talk","Sunny Day","Facade","Taunt","Helping Hand","Brick Break","Fake Tears","Rock Tomb","Iron Defense","Mud Shot","Calm Mind","Rock Blast","Fling","Power Gem","Drain Punch","Earth Power","Giga Impact","Stone Edge","Stealth Rock","Grass Knot","Low Sweep","Foul Play","Bulldoze","Stomping Tantrum","Body Press","Tera Blast","Trailblaze","Sand Tomb","Smack Down","High Horsepower","Focus Punch","Psych Up","Double-Edge","Endeavor","Meteor Beam","Curse"],
    egg: [],
    max: []
  },
  186: {
    levelUp: [{level:0,move:"Bounce"},{level:1,move:"Pound"},{level:1,move:"Hydro Pump"},{level:1,move:"Belly Drum"},{level:1,move:"Rain Dance"}],
    tm: ["Ice Punch","Body Slam","Take Down","Hydro Pump","Surf","Ice Beam","Blizzard","Hyper Beam","Low Kick","Earthquake","Dig","Psychic","Haze","Metronome","Waterfall","Swift","Amnesia","Rest","Substitute","Thief","Protect","Mud-Slap","Icy Wind","Endure","Sleep Talk","Encore","Rain Dance","Facade","Focus Punch","Helping Hand","Brick Break","Hyper Voice","Weather Ball","Mud Shot","Water Pulse","Fling","Focus Blast","Earth Power","Giga Impact","Low Sweep","Bulldoze","Liquidation","Tera Blast","Chilling Water","Psych Up","Double-Edge","Endeavor","Whirlpool","Muddy Water"],
    egg: ["Body Slam","Double-Edge","Mist","Water Gun","Bubble Beam","Hypnosis","Splash","Perish Song","Swagger","Endeavor","Hyper Voice","Muddy Water","Mud Shot","Water Pulse","Earth Power"],
    max: []
  },
  187: {
    levelUp: [{level:1,move:"Splash"},{level:1,move:"Tackle"},{level:4,move:"Tail Whip"},{level:6,move:"Absorb"},{level:8,move:"Fairy Wind"},{level:10,move:"Poison Powder"},{level:10,move:"Stun Spore"},{level:10,move:"Sleep Powder"},{level:12,move:"Bullet Seed"},{level:15,move:"Synthesis"},{level:19,move:"Leech Seed"},{level:22,move:"Mega Drain"},{level:24,move:"Acrobatics"},{level:27,move:"Cotton Spore"},{level:29,move:"U-turn"},{level:32,move:"Giga Drain"},{level:35,move:"Bounce"},{level:38,move:"Memento"}],
    tm: ["Swords Dance","Take Down","Solar Beam","Light Screen","Reflect","Rest","Substitute","Thief","Protect","Giga Drain","Endure","Charm","Sleep Talk","Baton Pass","Encore","Rain Dance","Sunny Day","Facade","Helping Hand","Bullet Seed","Aerial Ace","Magical Leaf","Tailwind","U-turn","Fling","Seed Bomb","Energy Ball","Leaf Storm","Grass Knot","Acrobatics","Grassy Terrain","Dazzling Gleam","Pollen Puff","Tera Blast","Trailblaze","Lunge","Double-Edge"],
    egg: ["Encore","Worry Seed","Seed Bomb","Switcheroo","Rage Powder","Cotton Guard","Grassy Terrain","Strength Sap"],
    max: []
  },
  188: {
    levelUp: [{level:1,move:"Splash"},{level:1,move:"Tail Whip"},{level:1,move:"Absorb"},{level:1,move:"Synthesis"},{level:8,move:"Tackle"},{level:10,move:"Fairy Wind"},{level:12,move:"Poison Powder"},{level:12,move:"Stun Spore"},{level:12,move:"Sleep Powder"},{level:15,move:"Bullet Seed"},{level:20,move:"Leech Seed"},{level:24,move:"Mega Drain"},{level:28,move:"Acrobatics"},{level:31,move:"Cotton Spore"},{level:34,move:"U-turn"},{level:37,move:"Giga Drain"},{level:41,move:"Bounce"},{level:44,move:"Memento"}],
    tm: ["Swords Dance","Take Down","Solar Beam","Light Screen","Reflect","Rest","Substitute","Thief","Protect","Giga Drain","Endure","Charm","Sleep Talk","Baton Pass","Encore","Sunny Day","Facade","Helping Hand","Bullet Seed","Aerial Ace","Magical Leaf","Tailwind","U-turn","Fling","Seed Bomb","Energy Ball","Leaf Storm","Grass Knot","Acrobatics","Grassy Terrain","Dazzling Gleam","Pollen Puff","Tera Blast","Trailblaze","Lunge","Double-Edge","Endeavor"],
    egg: [],
    max: []
  },
  189: {
    levelUp: [{level:1,move:"Splash"},{level:1,move:"Tail Whip"},{level:1,move:"Absorb"},{level:1,move:"Synthesis"},{level:8,move:"Tackle"},{level:10,move:"Fairy Wind"},{level:12,move:"Poison Powder"},{level:12,move:"Stun Spore"},{level:12,move:"Sleep Powder"},{level:15,move:"Bullet Seed"},{level:20,move:"Leech Seed"},{level:24,move:"Mega Drain"},{level:30,move:"Acrobatics"},{level:35,move:"Cotton Spore"},{level:39,move:"U-turn"},{level:43,move:"Giga Drain"},{level:49,move:"Bounce"},{level:55,move:"Memento"}],
    tm: ["Swords Dance","Take Down","Hyper Beam","Solar Beam","Light Screen","Reflect","Rest","Substitute","Thief","Protect","Giga Drain","Endure","Charm","Sleep Talk","Baton Pass","Encore","Rain Dance","Sunny Day","Facade","Helping Hand","Bullet Seed","Aerial Ace","Magical Leaf","Tailwind","U-turn","Fling","Seed Bomb","Energy Ball","Giga Impact","Leaf Storm","Grass Knot","Acrobatics","Grassy Terrain","Dazzling Gleam","Pollen Puff","Tera Blast","Trailblaze","Lunge","Double-Edge","Endeavor"],
    egg: [],
    max: []
  },
  190: {
    levelUp: [{level:1,move:"Scratch"},{level:1,move:"Tail Whip"},{level:4,move:"Sand Attack"},{level:8,move:"Astonish"},{level:11,move:"Baton Pass"},{level:15,move:"Tickle"},{level:18,move:"Fury Swipes"},{level:22,move:"Swift"},{level:25,move:"Screech"},{level:29,move:"Agility"},{level:32,move:"Double Hit"},{level:36,move:"Fling"},{level:39,move:"Nasty Plot"},{level:43,move:"Last Resort"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Take Down","Low Kick","Solar Beam","Thunderbolt","Thunder Wave","Thunder","Dig","Agility","Metronome","Swift","Rest","Substitute","Thief","Spite","Protect","Mud-Slap","Endure","Sleep Talk","Baton Pass","Rain Dance","Sunny Day","Shadow Ball","Facade","Focus Punch","Taunt","Helping Hand","Brick Break","Knock Off","Aerial Ace","Mud Shot","Water Pulse","U-turn","Fling","Seed Bomb","Nasty Plot","Shadow Claw","Gunk Shot","Grass Knot","Smack Down","Low Sweep","Foul Play","Acrobatics","Tera Blast","Trailblaze","Chilling Water","Double-Edge","Endeavor","Throat Chop","Upper Hand"],
    egg: ["Slam","Counter","Iron Tail","Beat Up","Fake Out","Bounce","Covet","Switcheroo","Quick Guard"],
    max: []
  },
  191: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Growth"},{level:7,move:"Absorb"},{level:10,move:"Mega Drain"},{level:16,move:"Razor Leaf"},{level:19,move:"Worry Seed"},{level:22,move:"Giga Drain"},{level:25,move:"Endeavor"},{level:28,move:"Synthesis"},{level:31,move:"Solar Beam"},{level:34,move:"Double-Edge"},{level:36,move:"Sunny Day"},{level:39,move:"Seed Bomb"}],
    tm: ["Take Down","Solar Beam","Light Screen","Rest","Substitute","Protect","Giga Drain","Endure","Sleep Talk","Encore","Rain Dance","Sunny Day","Facade","Helping Hand","Bullet Seed","Magical Leaf","Seed Bomb","Energy Ball","Earth Power","Leaf Storm","Grass Knot","Grassy Terrain","Tera Blast","Trailblaze","Weather Ball","Double-Edge","Endeavor","Curse"],
    egg: ["Leech Seed","Curse","Encore","Morning Sun","Ingrain","Grassy Terrain"],
    max: []
  },
  192: {
    levelUp: [{level:1,move:"Pound"},{level:1,move:"Tackle"},{level:1,move:"Growth"},{level:4,move:"Ingrain"},{level:7,move:"Absorb"},{level:10,move:"Mega Drain"},{level:13,move:"Leech Seed"},{level:16,move:"Razor Leaf"},{level:19,move:"Worry Seed"},{level:22,move:"Giga Drain"},{level:25,move:"Bullet Seed"},{level:28,move:"Petal Dance"},{level:31,move:"Solar Beam"},{level:34,move:"Double-Edge"},{level:39,move:"Sunny Day"},{level:43,move:"Leaf Storm"},{level:50,move:"Petal Blizzard"}],
    tm: ["Swords Dance","Take Down","Hyper Beam","Solar Beam","Light Screen","Rest","Substitute","Protect","Sludge Bomb","Giga Drain","Endure","Sleep Talk","Encore","Rain Dance","Sunny Day","Facade","Helping Hand","Bullet Seed","Magical Leaf","Seed Bomb","Energy Ball","Earth Power","Giga Impact","Leaf Storm","Grass Knot","Grassy Terrain","Dazzling Gleam","Tera Blast","Trailblaze","Weather Ball","Grassy Glide","Double-Edge","Endeavor","Petal Blizzard","Curse"],
    egg: [],
    max: []
  },
  193: {
    levelUp: [{level:1,move:"Tackle"},{level:6,move:"Quick Attack"},{level:11,move:"Double Team"},{level:14,move:"Air Cutter"},{level:17,move:"Detect"},{level:22,move:"Supersonic"},{level:27,move:"Uproar"},{level:30,move:"Bug Bite"},{level:33,move:"Ancient Power"},{level:38,move:"Hypnosis"},{level:43,move:"Wing Attack"},{level:46,move:"Screech"},{level:49,move:"U-turn"},{level:54,move:"Air Slash"},{level:57,move:"Bug Buzz"}],
    tm: ["Swords Dance","Take Down","Solar Beam","Psychic","Swift","Leech Life","Rest","Substitute","Thief","Reversal","Protect","Giga Drain","Endure","Sleep Talk","Sunny Day","Shadow Ball","Uproar","Facade","Air Cutter","Aerial Ace","Tailwind","U-turn","Air Slash","Bug Buzz","Bug Bite","Struggle Bug","Lunge","Tera Blast","Pounce","Psych Up","Double-Edge","Skitter Smack","Psychic Noise"],
    egg: ["Whirlwind","Double-Edge","Feint"],
    max: []
  },
  194: {
    levelUp: [{level:1,move:"Tail Whip"},{level:1,move:"Water Gun"},{level:4,move:"Rain Dance"},{level:8,move:"Mud Shot"},{level:12,move:"Mist"},{level:12,move:"Haze"},{level:16,move:"Slam"},{level:21,move:"Yawn"},{level:24,move:"Aqua Tail"},{level:28,move:"Muddy Water"},{level:32,move:"Amnesia"},{level:36,move:"Toxic"},{level:40,move:"Earthquake"}],
    tm: ["Body Slam","Take Down","Hydro Pump","Surf","Ice Beam","Blizzard","Earthquake","Dig","Waterfall","Amnesia","Rest","Rock Slide","Substitute","Protect","Sludge Bomb","Mud-Slap","Spikes","Icy Wind","Sandstorm","Endure","Sleep Talk","Encore","Rain Dance","Facade","Helping Hand","Rock Tomb","Mud Shot","Water Pulse","Earth Power","Avalanche","Stone Edge","Stealth Rock","Acid Spray","Bulldoze","Stomping Tantrum","Liquidation","Tera Blast","Snowscape","Trailblaze","Chilling Water","Haze","Toxic","Double-Edge","Whirlpool","Muddy Water","Sludge Wave","Curse"],
    egg: ["Double Kick","Counter","Recover","Curse","Ancient Power","Stockpile","Spit Up","Swallow","Acid Spray","After You"],
    max: []
  },
  195: {
    levelUp: [{level:1,move:"Tail Whip"},{level:1,move:"Water Gun"},{level:1,move:"Rain Dance"},{level:1,move:"Mud Shot"},{level:12,move:"Mist"},{level:12,move:"Haze"},{level:16,move:"Slam"},{level:23,move:"Yawn"},{level:28,move:"Aqua Tail"},{level:34,move:"Muddy Water"},{level:40,move:"Amnesia"},{level:46,move:"Toxic"},{level:52,move:"Earthquake"}],
    tm: ["Ice Punch","Body Slam","Take Down","Hydro Pump","Surf","Ice Beam","Blizzard","Hyper Beam","Earthquake","Dig","Waterfall","Amnesia","Rest","Rock Slide","Substitute","Thief","Protect","Sludge Bomb","Mud-Slap","Spikes","Icy Wind","Sandstorm","Endure","Sleep Talk","Encore","Rain Dance","Facade","Helping Hand","Brick Break","Rock Tomb","Mud Shot","Water Pulse","Fling","Toxic Spikes","Drain Punch","Focus Blast","Earth Power","Giga Impact","Avalanche","Stone Edge","Stealth Rock","Acid Spray","Bulldoze","Eerie Impulse","Stomping Tantrum","Liquidation","Body Press","Tera Blast","Snowscape","Trailblaze","Chilling Water","Haze","Toxic","High Horsepower","Focus Punch","Double-Edge","Whirlpool","Muddy Water","Sludge Wave","Curse"],
    egg: [],
    max: []
  },
  196: {
    levelUp: [{level:0,move:"Confusion"},{level:1,move:"Tackle"},{level:1,move:"Take Down"},{level:1,move:"Double-Edge"},{level:1,move:"Tail Whip"},{level:1,move:"Bite"},{level:1,move:"Growl"},{level:1,move:"Copycat"},{level:1,move:"Covet"},{level:1,move:"Helping Hand"},{level:1,move:"Charm"},{level:1,move:"Baton Pass"},{level:5,move:"Sand Attack"},{level:10,move:"Quick Attack"},{level:15,move:"Baby-Doll Eyes"},{level:20,move:"Swift"},{level:25,move:"Psybeam"},{level:30,move:"Morning Sun"},{level:35,move:"Power Swap"},{level:40,move:"Psychic"},{level:45,move:"Psych Up"},{level:50,move:"Future Sight"},{level:55,move:"Last Resort"}],
    tm: ["Body Slam","Take Down","Psybeam","Hyper Beam","Thunder Wave","Dig","Psychic","Confuse Ray","Light Screen","Reflect","Swift","Rest","Substitute","Protect","Mud-Slap","Endure","Charm","Sleep Talk","Baton Pass","Rain Dance","Sunny Day","Shadow Ball","Facade","Helping Hand","Trick","Skill Swap","Imprison","Hyper Voice","Fake Tears","Magical Leaf","Calm Mind","Power Gem","Giga Impact","Zen Headbutt","Trick Room","Grass Knot","Psyshock","Stored Power","Draining Kiss","Dazzling Gleam","Psychic Terrain","Psychic Fangs","Tera Blast","Trailblaze","Roar","Gravity","Weather Ball","Psych Up","Double-Edge","Future Sight","Expanding Force","Curse","Alluring Voice","Psychic Noise"],
    egg: [],
    max: []
  },
  197: {
    levelUp: [{level:0,move:"Snarl"},{level:1,move:"Charm"},{level:1,move:"Tackle"},{level:1,move:"Take Down"},{level:1,move:"Double-Edge"},{level:1,move:"Tail Whip"},{level:1,move:"Bite"},{level:1,move:"Growl"},{level:1,move:"Copycat"},{level:1,move:"Covet"},{level:1,move:"Helping Hand"},{level:1,move:"Swift"},{level:1,move:"Baton Pass"},{level:5,move:"Sand Attack"},{level:10,move:"Quick Attack"},{level:15,move:"Baby-Doll Eyes"},{level:20,move:"Confuse Ray"},{level:25,move:"Assurance"},{level:30,move:"Moonlight"},{level:35,move:"Guard Swap"},{level:40,move:"Dark Pulse"},{level:45,move:"Screech"},{level:50,move:"Mean Look"},{level:55,move:"Last Resort"}],
    tm: ["Body Slam","Take Down","Hyper Beam","Thunder Wave","Dig","Psychic","Confuse Ray","Light Screen","Reflect","Swift","Rest","Substitute","Thief","Protect","Scary Face","Endure","Charm","Sleep Talk","Baton Pass","Rain Dance","Sunny Day","Crunch","Shadow Ball","Facade","Taunt","Helping Hand","Skill Swap","Hyper Voice","Fake Tears","Calm Mind","Dark Pulse","Giga Impact","Foul Play","Stored Power","Snarl","Tera Blast","Trailblaze","Roar","Toxic","Spite","Weather Ball","Lash Out","Psych Up","Double-Edge","Throat Chop","Curse","Alluring Voice"],
    egg: [],
    max: []
  },
  198: {
    levelUp: [{level:1,move:"Peck"},{level:1,move:"Astonish"},{level:5,move:"Gust"},{level:11,move:"Haze"},{level:15,move:"Wing Attack"},{level:21,move:"Night Shade"},{level:25,move:"Assurance"},{level:31,move:"Taunt"},{level:35,move:"Mean Look"},{level:40,move:"Foul Play"},{level:50,move:"Sucker Punch"},{level:55,move:"Torment"},{level:60,move:"Quash"}],
    tm: ["Fly","Take Down","Hyper Beam","Thunder Wave","Psychic","Night Shade","Confuse Ray","Rest","Substitute","Thief","Protect","Scary Face","Mud-Slap","Icy Wind","Endure","Sleep Talk","Rain Dance","Sunny Day","Shadow Ball","Heat Wave","Facade","Taunt","Air Cutter","Aerial Ace","Calm Mind","Tailwind","U-turn","Dark Pulse","Air Slash","Brave Bird","Giga Impact","Nasty Plot","Foul Play","Hex","Acrobatics","Hurricane","Snarl","Tera Blast","Haze","Spite","Uproar","Dual Wingbeat","Lash Out","Double-Edge","Feather Dance","Psychic Noise"],
    egg: ["Whirlwind","Drill Peck","Screech","Confuse Ray","Sky Attack","Perish Song","Flatter","Feather Dance","Brave Bird"],
    max: []
  },
  199: {
    levelUp: [{level:1,move:"Curse"},{level:1,move:"Tackle"},{level:1,move:"Growl"},{level:1,move:"Water Gun"},{level:1,move:"Power Gem"},{level:1,move:"Nasty Plot"},{level:1,move:"Swagger"},{level:9,move:"Yawn"},{level:12,move:"Confusion"},{level:15,move:"Disable"},{level:18,move:"Water Pulse"},{level:21,move:"Headbutt"},{level:27,move:"Amnesia"},{level:30,move:"Surf"},{level:33,move:"Slack Off"},{level:36,move:"Psychic"},{level:39,move:"Psych Up"},{level:42,move:"Rain Dance"},{level:45,move:"Heal Pulse"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Take Down","Flamethrower","Hydro Pump","Surf","Ice Beam","Blizzard","Psybeam","Hyper Beam","Thunder Wave","Earthquake","Dig","Psychic","Light Screen","Reflect","Metronome","Fire Blast","Waterfall","Swift","Amnesia","Rest","Rock Slide","Substitute","Protect","Icy Wind","Endure","Sleep Talk","Rain Dance","Sunny Day","Shadow Ball","Facade","Trick","Brick Break","Skill Swap","Imprison","Rock Tomb","Iron Defense","Mud Shot","Calm Mind","Water Pulse","Fling","Power Gem","Drain Punch","Focus Blast","Giga Impact","Nasty Plot","Avalanche","Zen Headbutt","Trick Room","Grass Knot","Psyshock","Foul Play","Stored Power","Bulldoze","Psychic Terrain","Liquidation","Tera Blast","Snowscape","Chilling Water","Scald","Focus Punch","Weather Ball","Psych Up","Whirlpool","Muddy Water","Future Sight","Expanding Force","Curse","Psychic Noise"],
    egg: ["Future Sight","Chilly Reception"],
    max: []
  },
  200: {
    levelUp: [{level:1,move:"Growl"},{level:1,move:"Confusion"},{level:10,move:"Astonish"},{level:14,move:"Confuse Ray"},{level:19,move:"Mean Look"},{level:23,move:"Hex"},{level:28,move:"Psybeam"},{level:32,move:"Pain Split"},{level:37,move:"Payback"},{level:41,move:"Shadow Ball"},{level:46,move:"Perish Song"},{level:50,move:"Power Gem"}],
    tm: ["Psybeam","Hyper Beam","Thunderbolt","Thunder Wave","Thunder","Psychic","Night Shade","Confuse Ray","Swift","Rest","Substitute","Thief","Protect","Scary Face","Icy Wind","Endure","Charm","Sleep Talk","Rain Dance","Sunny Day","Shadow Ball","Will-O-Wisp","Facade","Taunt","Helping Hand","Trick","Skill Swap","Imprison","Hyper Voice","Fake Tears","Magical Leaf","Calm Mind","Dark Pulse","Power Gem","Energy Ball","Giga Impact","Nasty Plot","Trick Room","Grass Knot","Charge Beam","Psyshock","Foul Play","Stored Power","Hex","Phantom Force","Draining Kiss","Dazzling Gleam","Tera Blast","Snowscape","Spite","Burning Jealousy","Poltergeist","Pain Split","Psych Up","Future Sight","Curse","Psychic Noise"],
    egg: ["Screech","Curse","Spite","Destiny Bond","Memento","Imprison","Sucker Punch","Shadow Sneak","Wonder Room"],
    max: []
  },
  201: {
    levelUp: [{level:1,move:"Hidden Power"}],
    tm: [],
    egg: [],
    max: []
  },
  202: {
    levelUp: [{level:0,move:"Counter"},{level:0,move:"Destiny Bond"},{level:0,move:"Mirror Coat"},{level:0,move:"Safeguard"},{level:1,move:"Amnesia"},{level:1,move:"Charm"},{level:1,move:"Counter"},{level:1,move:"Destiny Bond"},{level:1,move:"Encore"},{level:1,move:"Mirror Coat"},{level:1,move:"Safeguard"},{level:1,move:"Splash"}],
    tm: ["Safeguard"],
    egg: [],
    max: []
  },
  203: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Growl"},{level:1,move:"Astonish"},{level:1,move:"Power Swap"},{level:1,move:"Guard Swap"},{level:5,move:"Confusion"},{level:10,move:"Assurance"},{level:14,move:"Stomp"},{level:19,move:"Psybeam"},{level:23,move:"Agility"},{level:28,move:"Double Hit"},{level:32,move:"Twin Beam"},{level:37,move:"Crunch"},{level:41,move:"Baton Pass"},{level:46,move:"Nasty Plot"},{level:50,move:"Psychic"}],
    tm: ["Body Slam","Take Down","Psybeam","Hyper Beam","Low Kick","Thunderbolt","Thunder Wave","Thunder","Earthquake","Psychic","Agility","Confuse Ray","Light Screen","Reflect","Swift","Amnesia","Rest","Substitute","Thief","Protect","Endure","Sleep Talk","Baton Pass","Rain Dance","Sunny Day","Crunch","Shadow Ball","Facade","Helping Hand","Trick","Skill Swap","Imprison","Hyper Voice","Calm Mind","Energy Ball","Giga Impact","Nasty Plot","Zen Headbutt","Trick Room","Grass Knot","Charge Beam","Psyshock","Foul Play","Stored Power","Bulldoze","Dazzling Gleam","Psychic Terrain","Psychic Fangs","Stomping Tantrum","Tera Blast","Trailblaze","Gravity","High Horsepower","Uproar","Psych Up","Double-Edge","Endeavor","Future Sight","Expanding Force","Psychic Noise"],
    egg: ["Double Kick","Take Down","Mean Look","Mirror Coat","Future Sight","Beat Up","Uproar","Wish","Ally Switch"],
    max: []
  },
  204: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Protect"},{level:6,move:"Self-Destruct"},{level:9,move:"Bug Bite"},{level:12,move:"Take Down"},{level:17,move:"Rapid Spin"},{level:20,move:"Rollout"},{level:23,move:"Curse"},{level:28,move:"Spikes"},{level:31,move:"Payback"},{level:34,move:"Explosion"},{level:39,move:"Iron Defense"},{level:42,move:"Gyro Ball"},{level:45,move:"Double-Edge"}],
    tm: ["Body Slam","Take Down","Solar Beam","Dig","Light Screen","Reflect","Swift","Rest","Rock Slide","Substitute","Reversal","Protect","Spikes","Sandstorm","Giga Drain","Endure","Sleep Talk","Rain Dance","Sunny Day","Facade","Helping Hand","Rock Tomb","Iron Defense","Rock Blast","Toxic Spikes","Poison Jab","Seed Bomb","Bug Buzz","Stealth Rock","Venoshock","Struggle Bug","Bulldoze","Drill Run","Tera Blast","Ice Spinner","Pounce","Sand Tomb","Gravity","Gyro Ball","Bug Bite","Lunge","Pain Split","Double-Edge","Curse"],
    egg: ["Pin Missile","Counter","Swift","Flail","Sand Tomb","Power Trick","Toxic Spikes"],
    max: []
  },
  205: {
    levelUp: [{level:0,move:"Heavy Slam"},{level:1,move:"Magnet Rise"},{level:1,move:"Toxic Spikes"},{level:1,move:"Bug Bite"},{level:1,move:"Protect"},{level:1,move:"Zap Cannon"},{level:1,move:"Self-Destruct"},{level:1,move:"Tackle"},{level:12,move:"Take Down"},{level:17,move:"Rapid Spin"},{level:20,move:"Rollout"},{level:23,move:"Curse"},{level:28,move:"Spikes"},{level:32,move:"Payback"},{level:36,move:"Explosion"},{level:42,move:"Iron Defense"},{level:46,move:"Gyro Ball"},{level:50,move:"Double-Edge"}],
    tm: ["Body Slam","Take Down","Hyper Beam","Solar Beam","Thunder Wave","Earthquake","Dig","Light Screen","Reflect","Swift","Rest","Rock Slide","Substitute","Reversal","Protect","Spikes","Sandstorm","Giga Drain","Endure","Sleep Talk","Rain Dance","Sunny Day","Facade","Helping Hand","Rock Tomb","Iron Defense","Rock Blast","Toxic Spikes","Poison Jab","Seed Bomb","Bug Buzz","Earth Power","Giga Impact","Flash Cannon","Iron Head","Stone Edge","Stealth Rock","Venoshock","Heavy Slam","Volt Switch","Struggle Bug","Bulldoze","Drill Run","Smart Strike","Body Press","Steel Beam","Tera Blast","Ice Spinner","Pounce","Sand Tomb","Gravity","Gyro Ball","Bug Bite","Lunge","Pain Split","Double-Edge","Metal Sound","Curse","Hard Press"],
    egg: [],
    max: []
  },
  206: {
    levelUp: [{level:1,move:"Defense Curl"},{level:1,move:"Flail"},{level:4,move:"Mud-Slap"},{level:8,move:"Rollout"},{level:12,move:"Glare"},{level:16,move:"Screech"},{level:20,move:"Ancient Power"},{level:24,move:"Drill Run"},{level:28,move:"Yawn"},{level:32,move:"Hyper Drill"},{level:36,move:"Roost"},{level:40,move:"Dragon Rush"},{level:44,move:"Coil"},{level:48,move:"Double-Edge"},{level:52,move:"Endeavor"}],
    tm: ["Body Slam","Take Down","Flamethrower","Ice Beam","Blizzard","Hyper Beam","Solar Beam","Thunderbolt","Thunder","Earthquake","Dig","Agility","Fire Blast","Amnesia","Rest","Rock Slide","Substitute","Thief","Protect","Scary Face","Mud-Slap","Sandstorm","Endure","Sleep Talk","Baton Pass","Rain Dance","Sunny Day","Shadow Ball","Facade","Helping Hand","Hyper Voice","Rock Tomb","Mud Shot","Poison Tail","Calm Mind","Poison Jab","Air Slash","Earth Power","Giga Impact","Zen Headbutt","Stone Edge","Stealth Rock","Stored Power","Hex","Bulldoze","Wild Charge","Drill Run","Smart Strike","Stomping Tantrum","Tera Blast","Ice Spinner","Pounce","Chilling Water","Toxic","Spite","Gyro Ball","Lunge","Uproar","Scale Shot","Pain Split","Psych Up","Double-Edge","Endeavor","Skitter Smack","Breaking Swipe","Curse"],
    egg: ["Headbutt","Bite","Curse","Astonish","Last Resort","Aqua Tail"],
    max: []
  },
  207: {
    levelUp: [{level:1,move:"Poison Sting"},{level:4,move:"Sand Attack"},{level:7,move:"Harden"},{level:10,move:"Knock Off"},{level:13,move:"Quick Attack"},{level:16,move:"Fury Cutter"},{level:19,move:"Poison Tail"},{level:22,move:"Acrobatics"},{level:27,move:"Slash"},{level:30,move:"U-turn"},{level:35,move:"Screech"},{level:40,move:"X-Scissor"},{level:45,move:"Crabhammer"},{level:50,move:"Swords Dance"}],
    tm: ["Swords Dance","Take Down","Earthquake","Toxic","Agility","Swift","Rest","Rock Slide","Substitute","Thief","Protect","Scary Face","Sludge Bomb","Mud-Slap","Spikes","Sandstorm","Endure","False Swipe","Sleep Talk","Baton Pass","Metal Claw","Rain Dance","Sunny Day","Crunch","Facade","Taunt","Brick Break","Knock Off","Rock Tomb","Sand Tomb","Aerial Ace","Mud Shot","Poison Tail","Tailwind","U-turn","Fling","Toxic Spikes","Poison Jab","Dark Pulse","X-Scissor","Earth Power","Thunder Fang","Ice Fang","Fire Fang","Gunk Shot","Stone Edge","Stealth Rock","Venoshock","Acrobatics","Struggle Bug","Bulldoze","High Horsepower","Lunge","Psychic Fangs","Scale Shot","Dual Wingbeat","Tera Blast","Double-Edge","Skitter Smack","Throat Chop","Breaking Swipe"],
    egg: ["Wing Attack","Double-Edge","Counter","Feint","Night Slash","Cross Poison"],
    max: []
  },
  208: {
    levelUp: [{level:1,move:"Rollout"},{level:6,move:"Tackle"},{level:11,move:"Bulldoze"},{level:18,move:"Rock Slide"},{level:25,move:"Stealth Rock"},{level:34,move:"High Horsepower"},{level:43,move:"Iron Tail"}],
    tm: [],
    egg: [],
    max: []
  },
  209: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Tail Whip"},{level:1,move:"Growl"},{level:1,move:"Scary Face"},{level:1,move:"Charm"},{level:1,move:"Thunder Fang"},{level:1,move:"Ice Fang"},{level:1,move:"Fire Fang"},{level:7,move:"Bite"},{level:13,move:"Lick"},{level:19,move:"Headbutt"},{level:25,move:"Roar"},{level:31,move:"Last Resort"},{level:37,move:"Play Rough"},{level:43,move:"Payback"},{level:49,move:"Crunch"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Take Down","Double-Edge","Roar","Flamethrower","Low Kick","Solar Beam","Thunderbolt","Thunder Wave","Thunder","Earthquake","Dig","Metronome","Fire Blast","Rest","Super Fang","Substitute","Thief","Curse","Reversal","Spite","Protect","Scary Face","Sludge Bomb","Mud-Slap","Endure","Charm","Sleep Talk","Encore","Rain Dance","Sunny Day","Crunch","Shadow Ball","Uproar","Facade","Focus Punch","Taunt","Helping Hand","Brick Break","Endeavor","Hyper Voice","Fake Tears","Overheat","Bulk Up","Water Pulse","Close Combat","Fling","Thunder Fang","Ice Fang","Fire Fang","Bulldoze","Wild Charge","Snarl","Play Rough","Dazzling Gleam","Psychic Fangs","Stomping Tantrum","Lash Out","Tera Blast","Trailblaze","Temper Flare"],
    egg: ["Counter","Mimic","Snore","Present","Retaliate"],
    max: []
  },
  210: {
    levelUp: [{level:1,move:"Outrage"},{level:1,move:"Tackle"},{level:1,move:"Tail Whip"},{level:1,move:"Growl"},{level:1,move:"Ice Fang"},{level:1,move:"Scary Face"},{level:1,move:"Fire Fang"},{level:1,move:"Charm"},{level:1,move:"Thunder Fang"},{level:7,move:"Bite"},{level:13,move:"Lick"},{level:19,move:"Headbutt"},{level:27,move:"Roar"},{level:35,move:"Last Resort"},{level:43,move:"Play Rough"},{level:51,move:"Payback"},{level:59,move:"Crunch"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Take Down","Double-Edge","Roar","Flamethrower","Hyper Beam","Low Kick","Solar Beam","Thunderbolt","Thunder Wave","Thunder","Earthquake","Dig","Metronome","Fire Blast","Rest","Rock Slide","Super Fang","Substitute","Thief","Curse","Reversal","Spite","Protect","Scary Face","Sludge Bomb","Mud-Slap","Outrage","Endure","Charm","Sleep Talk","Encore","Rain Dance","Sunny Day","Crunch","Shadow Ball","Uproar","Facade","Focus Punch","Taunt","Helping Hand","Brick Break","Endeavor","Hyper Voice","Fake Tears","Overheat","Rock Tomb","Bulk Up","Water Pulse","Close Combat","Fling","Focus Blast","Giga Impact","Thunder Fang","Ice Fang","Fire Fang","Stone Edge","Low Sweep","Bulldoze","Wild Charge","Snarl","Play Rough","Dazzling Gleam","Psychic Fangs","Stomping Tantrum","Lash Out","Tera Blast","Trailblaze","Temper Flare"],
    egg: ["Counter","Mimic","Snore","Present","Retaliate"],
    max: []
  },
  211: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Poison Sting"},{level:4,move:"Harden"},{level:8,move:"Water Gun"},{level:12,move:"Fell Stinger"},{level:16,move:"Minimize"},{level:20,move:"Spikes"},{level:24,move:"Brine"},{level:28,move:"Poison Jab"},{level:32,move:"Pin Missile"},{level:36,move:"Toxic Spikes"},{level:40,move:"Stockpile"},{level:40,move:"Spit Up"},{level:44,move:"Toxic"},{level:48,move:"Aqua Tail"},{level:52,move:"Acupressure"},{level:56,move:"Destiny Bond"}],
    tm: ["Swords Dance","Take Down","Hydro Pump","Surf","Ice Beam","Blizzard","Thunder Wave","Agility","Waterfall","Swift","Rest","Substitute","Reversal","Protect","Scary Face","Sludge Bomb","Spikes","Icy Wind","Endure","Sleep Talk","Rain Dance","Crunch","Shadow Ball","Facade","Taunt","Mud Shot","Poison Tail","Water Pulse","Toxic Spikes","Poison Jab","Giga Impact","Gunk Shot","Venoshock","Acid Spray","Hex","Liquidation","Tera Blast","Chilling Water","Haze","Toxic","Spite","Gyro Ball","Flip Turn","Scale Shot","Pain Split","Double-Edge","Whirlpool","Sludge Wave","Throat Chop","Curse"],
    egg: ["Supersonic","Bubble Beam","Haze","Self-Destruct","Flail","Astonish","Water Pulse","Aqua Jet","Acid Spray","Barb Barrage"],
    max: []
  },
  212: {
    levelUp: [{level:0,move:"Bullet Punch"},{level:1,move:"False Swipe"},{level:1,move:"Wing Attack"},{level:1,move:"Leer"},{level:1,move:"Agility"},{level:1,move:"Quick Attack"},{level:1,move:"Air Slash"},{level:1,move:"Fury Cutter"},{level:12,move:"Metal Claw"},{level:16,move:"Double Team"},{level:20,move:"Double Hit"},{level:24,move:"Slash"},{level:28,move:"Focus Energy"},{level:32,move:"Iron Defense"},{level:36,move:"Iron Head"},{level:40,move:"X-Scissor"},{level:44,move:"Swords Dance"}],
    tm: ["Swords Dance","Take Down","Hyper Beam","Agility","Light Screen","Swift","Rest","Substitute","Thief","Reversal","Protect","Scary Face","Sandstorm","Endure","False Swipe","Sleep Talk","Baton Pass","Metal Claw","Rain Dance","Sunny Day","Facade","Helping Hand","Brick Break","Air Cutter","Aerial Ace","Iron Defense","Tailwind","U-turn","Close Combat","Fling","Air Slash","X-Scissor","Bug Buzz","Giga Impact","Flash Cannon","Iron Head","Acrobatics","Struggle Bug","Steel Beam","Tera Blast","Pounce","Trailblaze","Knock Off","Bug Bite","Vacuum Wave","Lunge","Dual Wingbeat","Double-Edge","Skitter Smack","Curse","Hard Press"],
    egg: [],
    max: []
  },
  213: {
    levelUp: [{level:1,move:"Withdraw"},{level:1,move:"Wrap"},{level:5,move:"Rollout"},{level:10,move:"Struggle Bug"},{level:15,move:"Rock Throw"},{level:20,move:"Safeguard"},{level:25,move:"Rest"},{level:30,move:"Bug Bite"},{level:35,move:"Guard Split"},{level:35,move:"Power Split"},{level:40,move:"Rock Slide"},{level:45,move:"Gastro Acid"},{level:50,move:"Sticky Web"},{level:55,move:"Power Trick"},{level:60,move:"Stone Edge"},{level:65,move:"Shell Smash"}],
    tm: ["Strength","Earthquake","Dig","Toxic","Double Team","Flash","Rest","Rock Slide","Substitute","Protect","Sludge Bomb","Sandstorm","Endure","Swagger","Attract","Sleep Talk","Safeguard","Sunny Day","Rock Smash","Facade","Rock Tomb","Gyro Ball","Rock Polish","Stone Edge","Stealth Rock","Bulldoze"],
    egg: ["Acid","Defense Curl","Mud-Slap","Sweet Scent","Helping Hand","Knock Off","Sand Tomb","Covet","Rock Blast","Acupressure","Final Gambit","Infestation"],
    max: []
  },
  214: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Leer"},{level:1,move:"Arm Thrust"},{level:5,move:"Fury Attack"},{level:10,move:"Endure"},{level:15,move:"Aerial Ace"},{level:20,move:"Horn Attack"},{level:25,move:"Counter"},{level:30,move:"Brick Break"},{level:35,move:"Pin Missile"},{level:40,move:"Throat Chop"},{level:45,move:"Thrash"},{level:50,move:"Swords Dance"},{level:55,move:"Megahorn"},{level:60,move:"Close Combat"}],
    tm: ["Swords Dance","Body Slam","Take Down","Hyper Beam","Low Kick","Earthquake","Dig","Rest","Rock Slide","Substitute","Thief","Reversal","Protect","Spikes","Endure","False Swipe","Sleep Talk","Rain Dance","Sunny Day","Facade","Helping Hand","Brick Break","Rock Tomb","Bullet Seed","Aerial Ace","Iron Defense","Bulk Up","Rock Blast","Close Combat","Fling","Bug Buzz","Focus Blast","Giga Impact","Shadow Claw","Stone Edge","Struggle Bug","Bulldoze","Smart Strike","Tera Blast","Pounce","Trailblaze","Smack Down","Knock Off","Bug Bite","Vacuum Wave","Lunge","High Horsepower","Focus Punch","Double-Edge","Endeavor","Coaching","Skitter Smack","Throat Chop","Curse","Upper Hand"],
    egg: ["Double-Edge","Seismic Toss","Harden","Flail","Feint","Night Slash"],
    max: []
  },
  215: {
    levelUp: [{level:1,move:"Scratch"},{level:1,move:"Leer"},{level:6,move:"Taunt"},{level:12,move:"Quick Attack"},{level:18,move:"Metal Claw"},{level:24,move:"Icy Wind"},{level:30,move:"Fury Swipes"},{level:36,move:"Hone Claws"},{level:42,move:"Beat Up"},{level:48,move:"Agility"},{level:54,move:"Screech"},{level:60,move:"Slash"}],
    tm: ["Ice Punch","Swords Dance","Take Down","Surf","Ice Beam","Blizzard","Low Kick","Dig","Agility","Swift","Rest","Substitute","Thief","Reversal","Protect","Scary Face","Icy Wind","Endure","False Swipe","Sleep Talk","Metal Claw","Rain Dance","Sunny Day","Shadow Ball","Facade","Taunt","Helping Hand","Brick Break","Fake Tears","Aerial Ace","Calm Mind","Water Pulse","Fling","Poison Jab","Dark Pulse","X-Scissor","Giga Impact","Nasty Plot","Avalanche","Shadow Claw","Low Sweep","Foul Play","Snarl","Tera Blast","Snowscape","Trailblaze","Spite","Knock Off","Icicle Spear","Focus Punch","Lash Out","Triple Axel","Throat Chop","Upper Hand"],
    egg: ["Bite","Counter","Spite","Fake Out","Feint","Ice Shard","Double Hit","Icicle Crash"],
    max: []
  },
  216: {
    levelUp: [{level:1,move:"Scratch"},{level:1,move:"Lick"},{level:1,move:"Covet"},{level:1,move:"Fling"},{level:1,move:"Baby-Doll Eyes"},{level:8,move:"Fury Swipes"},{level:13,move:"Payback"},{level:17,move:"Sweet Scent"},{level:22,move:"Slash"},{level:25,move:"Play Nice"},{level:29,move:"Play Rough"},{level:33,move:"Charm"},{level:37,move:"Rest"},{level:37,move:"Snore"},{level:41,move:"Thrash"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Swords Dance","Body Slam","Take Down","Low Kick","Earthquake","Dig","Metronome","Swift","Rest","Rock Slide","Substitute","Thief","Protect","Endure","Charm","Sleep Talk","Metal Claw","Rain Dance","Sunny Day","Crunch","Facade","Taunt","Helping Hand","Brick Break","Hyper Voice","Fake Tears","Rock Tomb","Aerial Ace","Bulk Up","Close Combat","Fling","Seed Bomb","Avalanche","Shadow Claw","Gunk Shot","Bulldoze","Play Rough","Tera Blast","Trailblaze","Smack Down","Uproar","Focus Punch","Double-Edge"],
    egg: ["Double-Edge","Counter","Seismic Toss","Belly Drum","Fury Cutter","Metal Claw","Cross Chop","Crunch","Yawn","Fake Tears","Close Combat","Night Slash"],
    max: []
  },
  217: {
    levelUp: [{level:1,move:"Scratch"},{level:1,move:"Leer"},{level:1,move:"Lick"},{level:1,move:"Fake Tears"},{level:1,move:"Covet"},{level:8,move:"Fury Swipes"},{level:13,move:"Payback"},{level:17,move:"Sweet Scent"},{level:22,move:"Slash"},{level:25,move:"Play Nice"},{level:29,move:"Play Rough"},{level:35,move:"Scary Face"},{level:41,move:"Rest"},{level:41,move:"Snore"},{level:48,move:"High Horsepower"},{level:56,move:"Thrash"},{level:64,move:"Hammer Arm"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Swords Dance","Body Slam","Take Down","Hyper Beam","Low Kick","Earthquake","Dig","Metronome","Swift","Rest","Rock Slide","Substitute","Thief","Protect","Scary Face","Endure","Charm","Sleep Talk","Metal Claw","Rain Dance","Sunny Day","Crunch","Facade","Taunt","Helping Hand","Brick Break","Hyper Voice","Fake Tears","Rock Tomb","Aerial Ace","Bulk Up","Close Combat","Fling","Seed Bomb","Giga Impact","Avalanche","Shadow Claw","Gunk Shot","Stone Edge","Bulldoze","Play Rough","Stomping Tantrum","Tera Blast","Trailblaze","Smack Down","High Horsepower","Uproar","Focus Punch","Double-Edge","Throat Chop"],
    egg: [],
    max: []
  },
  218: {
    levelUp: [{level:1,move:"Smog"},{level:1,move:"Yawn"},{level:6,move:"Ember"},{level:8,move:"Rock Throw"},{level:13,move:"Harden"},{level:20,move:"Clear Smog"},{level:22,move:"Ancient Power"},{level:27,move:"Incinerate"},{level:29,move:"Rock Slide"},{level:34,move:"Lava Plume"},{level:36,move:"Amnesia"},{level:41,move:"Body Slam"},{level:43,move:"Recover"},{level:48,move:"Flamethrower"},{level:50,move:"Earth Power"}],
    tm: ["Body Slam","Take Down","Flamethrower","Fire Spin","Earthquake","Light Screen","Reflect","Fire Blast","Amnesia","Rest","Rock Slide","Substitute","Protect","Mud-Slap","Sandstorm","Endure","Sleep Talk","Sunny Day","Heat Wave","Will-O-Wisp","Facade","Overheat","Rock Tomb","Iron Defense","Mud Shot","Rock Blast","Power Gem","Earth Power","Stone Edge","Stealth Rock","Smack Down","Flame Charge","Bulldoze","Heat Crash","High Horsepower","Tera Blast","Pain Split","Temper Flare","Curse"],
    egg: ["Smokescreen","Acid Armor","Curse","Rollout","Stockpile","Memento","Guard Swap","Inferno"],
    max: []
  },
  219: {
    levelUp: [{level:0,move:"Shell Smash"},{level:1,move:"Ember"},{level:1,move:"Rock Throw"},{level:1,move:"Smog"},{level:1,move:"Yawn"},{level:1,move:"Earth Power"},{level:13,move:"Harden"},{level:20,move:"Clear Smog"},{level:22,move:"Ancient Power"},{level:27,move:"Incinerate"},{level:29,move:"Rock Slide"},{level:34,move:"Lava Plume"},{level:36,move:"Amnesia"},{level:43,move:"Body Slam"},{level:47,move:"Recover"},{level:54,move:"Flamethrower"}],
    tm: ["Body Slam","Take Down","Flamethrower","Hyper Beam","Solar Beam","Fire Spin","Earthquake","Light Screen","Reflect","Fire Blast","Amnesia","Rest","Rock Slide","Substitute","Protect","Mud-Slap","Sandstorm","Endure","Sleep Talk","Sunny Day","Heat Wave","Will-O-Wisp","Facade","Overheat","Rock Tomb","Sand Tomb","Iron Defense","Mud Shot","Rock Blast","Gyro Ball","Flare Blitz","Power Gem","Earth Power","Giga Impact","Stone Edge","Stealth Rock","Smack Down","Flame Charge","Bulldoze","Heat Crash","Stomping Tantrum","Burning Jealousy","Tera Blast","Pain Split","Temper Flare","Scorching Sands","Curse"],
    egg: ["Smokescreen","Acid Armor","Curse","Rollout","Stockpile","Memento","Guard Swap","Inferno"],
    max: []
  },
  220: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Mud-Slap"},{level:5,move:"Powder Snow"},{level:10,move:"Flail"},{level:15,move:"Ice Shard"},{level:20,move:"Mist"},{level:25,move:"Endure"},{level:30,move:"Icy Wind"},{level:35,move:"Amnesia"},{level:40,move:"Take Down"},{level:45,move:"Earthquake"},{level:50,move:"Blizzard"}],
    tm: ["Body Slam","Take Down","Roar","Ice Beam","Blizzard","Earthquake","Dig","Haze","Amnesia","Rest","Rock Slide","Substitute","Reversal","Protect","Scary Face","Mud-Slap","Icy Wind","Sandstorm","Endure","Charm","Sleep Talk","Rain Dance","Facade","Rock Tomb","Sand Tomb","Icicle Spear","Mud Shot","Earth Power","Avalanche","Ice Fang","Stone Edge","Stealth Rock","Smack Down","Bulldoze","High Horsepower","Stomping Tantrum","Tera Blast","Snowscape","Trailblaze","Double-Edge","Endeavor","Curse"],
    egg: ["Double-Edge","Bite","Fissure","Curse","Ancient Power","Icicle Crash","Freeze-Dry"],
    max: []
  },
  221: {
    levelUp: [{level:0,move:"Ice Fang"},{level:1,move:"Tackle"},{level:1,move:"Flail"},{level:1,move:"Powder Snow"},{level:1,move:"Mud-Slap"},{level:1,move:"Ancient Power"},{level:15,move:"Ice Shard"},{level:20,move:"Mist"},{level:25,move:"Endure"},{level:30,move:"Icy Wind"},{level:37,move:"Amnesia"},{level:44,move:"Take Down"},{level:51,move:"Earthquake"},{level:58,move:"Blizzard"},{level:65,move:"Thrash"}],
    tm: ["Body Slam","Take Down","Roar","Ice Beam","Blizzard","Hyper Beam","Earthquake","Dig","Haze","Amnesia","Rest","Rock Slide","Substitute","Reversal","Protect","Scary Face","Mud-Slap","Icy Wind","Sandstorm","Endure","Charm","Sleep Talk","Rain Dance","Facade","Rock Tomb","Sand Tomb","Icicle Spear","Mud Shot","Earth Power","Giga Impact","Avalanche","Ice Fang","Stone Edge","Stealth Rock","Smack Down","Bulldoze","High Horsepower","Stomping Tantrum","Tera Blast","Snowscape","Trailblaze","Double-Edge","Endeavor","Throat Chop","Curse"],
    egg: ["Double-Edge","Bite","Fissure","Curse","Ancient Power","Icicle Crash","Freeze-Dry"],
    max: []
  },
  222: {
    levelUp: [{level:1,move:"Harden"},{level:1,move:"Tackle"},{level:5,move:"Water Gun"},{level:10,move:"Aqua Ring"},{level:15,move:"Endure"},{level:20,move:"Ancient Power"},{level:25,move:"Bubble Beam"},{level:30,move:"Flail"},{level:35,move:"Life Dew"},{level:40,move:"Power Gem"},{level:45,move:"Earth Power"},{level:50,move:"Recover"},{level:55,move:"Mirror Coat"}],
    tm: ["Surf","Ice Beam","Blizzard","Strength","Earthquake","Dig","Psychic","Double Team","Light Screen","Reflect","Explosion","Rest","Rock Slide","Substitute","Protect","Sandstorm","Endure","Swagger","Attract","Sleep Talk","Safeguard","Rain Dance","Sunny Day","Shadow Ball","Rock Smash","Hail","Facade","Rock Tomb","Calm Mind","Water Pulse","Brine","Rock Polish","Stone Edge","Stealth Rock","Scald","Bulldoze"],
    egg: ["Mist","Screech","Confuse Ray","Amnesia","Curse","Nature Power","Ingrain","Icicle Spear","Aqua Ring","Head Smash","Liquidation"],
    max: []
  },
  223: {
    levelUp: [{level:1,move:"Bubble"},{level:6,move:"Acid Spray"},{level:11,move:"Charge Beam"},{level:18,move:"Water Pulse"},{level:25,move:"Ice Beam"},{level:34,move:"Hydro Pump"},{level:43,move:"Hyper Beam"}],
    tm: [],
    egg: [],
    max: []
  },
  224: {
    levelUp: [{level:0,move:"Octazooka"},{level:1,move:"Bubble"},{level:6,move:"Acid Spray"},{level:11,move:"Charge Beam"},{level:18,move:"Water Pulse"},{level:25,move:"Ice Beam"},{level:34,move:"Hydro Pump"},{level:43,move:"Hyper Beam"}],
    tm: [],
    egg: [],
    max: []
  },
  225: {
    levelUp: [{level:1,move:"Present"},{level:25,move:"Drill Peck"}],
    tm: ["Ice Punch","Fly","Body Slam","Take Down","Ice Beam","Blizzard","Hyper Beam","Agility","Swift","Rest","Substitute","Thief","Reversal","Protect","Spikes","Icy Wind","Endure","Sleep Talk","Baton Pass","Rain Dance","Facade","Helping Hand","Brick Break","Air Cutter","Aerial Ace","Water Pulse","Tailwind","Fling","Seed Bomb","Air Slash","Brave Bird","Giga Impact","Avalanche","Gunk Shot","Foul Play","Acrobatics","Drill Run","Tera Blast","Ice Spinner","Snowscape","Trailblaze","Chilling Water","Haze","Icicle Spear","Focus Punch","Weather Ball","Dual Wingbeat","Endeavor","Triple Axel","Feather Dance"],
    egg: ["Aurora Beam","Counter","Quick Attack","Splash","Destiny Bond","Rapid Spin","Fake Out","Memento","Ice Shard","Freeze-Dry","Aurora Veil"],
    max: []
  },
  226: {
    levelUp: [{level:1,move:"Tackle"},{level:5,move:"Bubble"},{level:9,move:"Aerial Ace"},{level:15,move:"Water Pulse"},{level:21,move:"Air Slash"},{level:29,move:"Roost"},{level:37,move:"Hydro Pump"},{level:47,move:"Double-Edge"}],
    tm: [],
    egg: [],
    max: []
  },
  227: {
    levelUp: [{level:1,move:"Leer"},{level:1,move:"Peck"},{level:4,move:"Sand Attack"},{level:8,move:"Fury Attack"},{level:12,move:"Metal Claw"},{level:16,move:"Agility"},{level:20,move:"Wing Attack"},{level:24,move:"Slash"},{level:28,move:"Steel Wing"},{level:32,move:"Payback"},{level:36,move:"Drill Peck"},{level:40,move:"Metal Sound"},{level:44,move:"Spikes"},{level:48,move:"Iron Defense"},{level:52,move:"Brave Bird"}],
    tm: ["Swords Dance","Fly","Take Down","Roar","Hyper Beam","Agility","Swift","Rest","Rock Slide","Substitute","Thief","Curse","Reversal","Protect","Spikes","Icy Wind","Sandstorm","Endure","Sleep Talk","Metal Claw","Sunny Day","Facade","Taunt","Air Cutter","Rock Tomb","Metal Sound","Sand Tomb","Aerial Ace","Iron Defense","Tailwind","Dark Pulse","Air Slash","X-Scissor","Brave Bird","Giga Impact","Flash Cannon","Iron Head","Stealth Rock","Drill Run","Hurricane","Body Press","Steel Beam","Dual Wingbeat","Tera Blast"],
    egg: ["Whirlwind","Sky Attack","Curse","Air Cutter","Roost","Feint","Night Slash"],
    max: []
  },
  228: {
    levelUp: [{level:1,move:"Leer"},{level:1,move:"Ember"},{level:4,move:"Howl"},{level:8,move:"Smog"},{level:13,move:"Roar"},{level:16,move:"Bite"},{level:20,move:"Incinerate"},{level:25,move:"Beat Up"},{level:28,move:"Fire Fang"},{level:32,move:"Torment"},{level:37,move:"Comeuppance"},{level:40,move:"Foul Play"},{level:44,move:"Flamethrower"},{level:49,move:"Crunch"},{level:52,move:"Nasty Plot"},{level:56,move:"Inferno"}],
    tm: ["Body Slam","Take Down","Flamethrower","Solar Beam","Fire Spin","Fire Blast","Rest","Substitute","Thief","Reversal","Protect","Scary Face","Sludge Bomb","Mud-Slap","Endure","Sleep Talk","Rain Dance","Sunny Day","Crunch","Shadow Ball","Heat Wave","Will-O-Wisp","Facade","Taunt","Helping Hand","Hyper Voice","Overheat","Mud Shot","Flare Blitz","Dark Pulse","Nasty Plot","Thunder Fang","Fire Fang","Flame Charge","Foul Play","Snarl","Psychic Fangs","Tera Blast","Trailblaze","Roar","Toxic","Spite","Super Fang","Burning Jealousy","Lash Out","Pain Split","Double-Edge","Temper Flare"],
    egg: ["Counter","Fire Spin","Reversal","Spite","Destiny Bond","Feint","Sucker Punch","Thunder Fang"],
    max: []
  },
  229: {
    levelUp: [{level:1,move:"Leer"},{level:1,move:"Ember"},{level:1,move:"Smog"},{level:1,move:"Thunder Fang"},{level:1,move:"Howl"},{level:1,move:"Nasty Plot"},{level:13,move:"Roar"},{level:16,move:"Bite"},{level:20,move:"Incinerate"},{level:26,move:"Beat Up"},{level:30,move:"Fire Fang"},{level:35,move:"Torment"},{level:41,move:"Comeuppance"},{level:45,move:"Foul Play"},{level:50,move:"Flamethrower"},{level:56,move:"Crunch"},{level:62,move:"Inferno"}],
    tm: ["Body Slam","Take Down","Flamethrower","Hyper Beam","Solar Beam","Fire Spin","Fire Blast","Rest","Substitute","Thief","Reversal","Protect","Scary Face","Sludge Bomb","Mud-Slap","Endure","Sleep Talk","Rain Dance","Sunny Day","Crunch","Shadow Ball","Heat Wave","Will-O-Wisp","Facade","Taunt","Helping Hand","Hyper Voice","Overheat","Mud Shot","Flare Blitz","Dark Pulse","Giga Impact","Nasty Plot","Thunder Fang","Fire Fang","Flame Charge","Foul Play","Snarl","Psychic Fangs","Tera Blast","Trailblaze","Roar","Toxic","Spite","Super Fang","Burning Jealousy","Lash Out","Pain Split","Double-Edge","Endeavor","Temper Flare","Throat Chop"],
    egg: [],
    max: []
  },
  230: {
    levelUp: [{level:1,move:"Leer"},{level:1,move:"Water Gun"},{level:1,move:"Smokescreen"},{level:1,move:"Twister"},{level:1,move:"Whirlpool"},{level:1,move:"Yawn"},{level:15,move:"Focus Energy"},{level:20,move:"Dragon Breath"},{level:25,move:"Bubble Beam"},{level:30,move:"Agility"},{level:37,move:"Water Pulse"},{level:44,move:"Dragon Pulse"},{level:51,move:"Hydro Pump"},{level:58,move:"Dragon Dance"},{level:65,move:"Rain Dance"},{level:72,move:"Wave Crash"}],
    tm: ["Body Slam","Take Down","Double-Edge","Hydro Pump","Surf","Ice Beam","Blizzard","Hyper Beam","Agility","Waterfall","Swift","Rest","Substitute","Protect","Scary Face","Icy Wind","Outrage","Endure","Sleep Talk","Rain Dance","Whirlpool","Facade","Weather Ball","Muddy Water","Dragon Dance","Water Pulse","Dragon Pulse","Giga Impact","Flash Cannon","Draco Meteor","Iron Head","Scald","Hurricane","Liquidation","Breaking Swipe","Scale Shot","Flip Turn","Tera Blast","Snowscape","Chilling Water"],
    egg: ["Disable","Aurora Beam","Splash","Flail","Clear Smog"],
    max: []
  },
  231: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Growl"},{level:1,move:"Defense Curl"},{level:6,move:"Flail"},{level:10,move:"Rollout"},{level:15,move:"Bulldoze"},{level:19,move:"Endure"},{level:24,move:"Slam"},{level:28,move:"Take Down"},{level:33,move:"Charm"},{level:37,move:"Last Resort"},{level:42,move:"Double-Edge"}],
    tm: ["Body Slam","Take Down","Earthquake","Dig","Rest","Rock Slide","Substitute","Thief","Protect","Mud-Slap","Sandstorm","Endure","Charm","Sleep Talk","Encore","Rain Dance","Sunny Day","Facade","Helping Hand","Hyper Voice","Rock Tomb","Mud Shot","Seed Bomb","Earth Power","Gunk Shot","Iron Head","Stone Edge","Stealth Rock","Heavy Slam","Bulldoze","Play Rough","Stomping Tantrum","Tera Blast","Trailblaze","Roar","Sand Tomb","Smack Down","Knock Off","High Horsepower","Double-Edge","Endeavor","Curse"],
    egg: ["Body Slam","Counter","Fissure","Focus Energy","Snore","Ancient Power","Endeavor","Ice Shard","Head Smash","Heavy Slam","Play Rough","High Horsepower"],
    max: []
  },
  232: {
    levelUp: [{level:0,move:"Fury Attack"},{level:1,move:"Horn Attack"},{level:1,move:"Growl"},{level:1,move:"Defense Curl"},{level:1,move:"Thunder Fang"},{level:1,move:"Fire Fang"},{level:1,move:"Bulldoze"},{level:6,move:"Rapid Spin"},{level:10,move:"Rollout"},{level:15,move:"Assurance"},{level:19,move:"Knock Off"},{level:24,move:"Slam"},{level:30,move:"Stomping Tantrum"},{level:37,move:"Scary Face"},{level:43,move:"Earthquake"},{level:50,move:"Giga Impact"}],
    tm: ["Body Slam","Take Down","Hyper Beam","Earthquake","Dig","Rest","Rock Slide","Substitute","Thief","Protect","Scary Face","Mud-Slap","Sandstorm","Endure","Charm","Sleep Talk","Encore","Rain Dance","Sunny Day","Facade","Helping Hand","Hyper Voice","Rock Tomb","Iron Defense","Mud Shot","Poison Jab","Seed Bomb","Earth Power","Giga Impact","Thunder Fang","Ice Fang","Fire Fang","Gunk Shot","Iron Head","Stone Edge","Stealth Rock","Heavy Slam","Bulldoze","Play Rough","Smart Strike","Stomping Tantrum","Body Press","Tera Blast","Ice Spinner","Trailblaze","Roar","Sand Tomb","Smack Down","Gyro Ball","Knock Off","High Horsepower","Double-Edge","Endeavor","Throat Chop","Curse"],
    egg: [],
    max: []
  },
  233: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Defense Curl"},{level:1,move:"Conversion"},{level:1,move:"Recycle"},{level:1,move:"Magnet Rise"},{level:15,move:"Thunder Shock"},{level:20,move:"Psybeam"},{level:25,move:"Conversion 2"},{level:30,move:"Agility"},{level:35,move:"Recover"},{level:40,move:"Discharge"},{level:45,move:"Tri Attack"},{level:50,move:"Lock-On"},{level:55,move:"Zap Cannon"},{level:60,move:"Hyper Beam"}],
    tm: ["Take Down","Double-Edge","Ice Beam","Blizzard","Psybeam","Hyper Beam","Solar Beam","Thunderbolt","Thunder Wave","Thunder","Psychic","Agility","Swift","Rest","Substitute","Thief","Protect","Icy Wind","Endure","Sleep Talk","Rain Dance","Sunny Day","Shadow Ball","Facade","Charge","Trick","Gravity","Giga Impact","Zen Headbutt","Trick Room","Charge Beam","Psyshock","Foul Play","Electroweb","Eerie Impulse","Tera Blast"],
    egg: [],
    max: []
  },
  234: {
    levelUp: [{level:1,move:"Tackle"},{level:3,move:"Leer"},{level:7,move:"Astonish"},{level:10,move:"Hypnosis"},{level:13,move:"Stomp"},{level:16,move:"Sand Attack"},{level:21,move:"Take Down"},{level:23,move:"Confuse Ray"},{level:27,move:"Calm Mind"},{level:32,move:"Role Play"},{level:37,move:"Zen Headbutt"},{level:49,move:"Imprison"},{level:55,move:"Double-Edge"}],
    tm: ["Body Slam","Take Down","Psybeam","Hyper Beam","Solar Beam","Thunderbolt","Thunder Wave","Thunder","Earthquake","Dig","Psychic","Agility","Confuse Ray","Light Screen","Reflect","Swift","Rest","Substitute","Thief","Protect","Scary Face","Endure","Sleep Talk","Rain Dance","Sunny Day","Shadow Ball","Facade","Helping Hand","Trick","Skill Swap","Imprison","Calm Mind","Energy Ball","Earth Power","Giga Impact","Zen Headbutt","Trick Room","Charge Beam","Psyshock","Stored Power","Bulldoze","Wild Charge","Tera Blast","Trailblaze","Roar","Spite","Gravity","Lunge","Uproar","Psych Up","Double-Edge","Future Sight","Throat Chop","Curse"],
    egg: ["Double Kick","Thrash","Bite","Disable","Spite","Megahorn","Extrasensory","Psyshield Bash"],
    max: []
  },
  235: {
    levelUp: [{level:1,move:"Sketch"}],
    tm: [],
    egg: [],
    max: []
  },
  236: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Focus Energy"},{level:1,move:"Fake Out"},{level:1,move:"Helping Hand"}],
    tm: ["Body Slam","Take Down","Low Kick","Swift","Rest","Rock Slide","Substitute","Thief","Protect","Endure","Sleep Talk","Rain Dance","Sunny Day","Uproar","Facade","Helping Hand","Brick Break","Bulk Up","Vacuum Wave","Low Sweep","Bulldoze","Tera Blast","Upper Hand"],
    egg: ["Counter","High Jump Kick","Mach Punch","Rapid Spin","Feint","Vacuum Wave","Bullet Punch"],
    max: []
  },
  237: {
    levelUp: [{level:0,move:"Triple Kick"},{level:1,move:"Tackle"},{level:1,move:"Feint"},{level:1,move:"Helping Hand"},{level:1,move:"Focus Energy"},{level:1,move:"Fake Out"},{level:4,move:"Quick Attack"},{level:8,move:"Gyro Ball"},{level:12,move:"Detect"},{level:16,move:"Rapid Spin"},{level:21,move:"Wide Guard"},{level:21,move:"Quick Guard"},{level:24,move:"Sucker Punch"},{level:28,move:"Agility"},{level:32,move:"Dig"},{level:36,move:"Close Combat"},{level:40,move:"Counter"},{level:44,move:"Endeavor"}],
    tm: ["Body Slam","Take Down","Double-Edge","Low Kick","Earthquake","Dig","Agility","Swift","Rest","Rock Slide","Substitute","Thief","Reversal","Protect","Sandstorm","Endure","Sleep Talk","Baton Pass","Rain Dance","Sunny Day","Uproar","Facade","Helping Hand","Brick Break","Endeavor","Aerial Ace","Bulk Up","Gyro Ball","Close Combat","Vacuum Wave","Focus Blast","Giga Impact","Stone Edge","Low Sweep","Bulldoze","Drill Run","Coaching","Triple Axel","Tera Blast","Ice Spinner","Upper Hand"],
    egg: ["Counter","High Jump Kick","Mach Punch","Rapid Spin","Feint","Vacuum Wave","Bullet Punch"],
    max: []
  },
  238: {
    levelUp: [{level:1,move:"Lick"},{level:1,move:"Pound"},{level:4,move:"Powder Snow"},{level:8,move:"Copycat"},{level:12,move:"Confusion"},{level:16,move:"Covet"},{level:20,move:"Sing"},{level:24,move:"Fake Tears"},{level:28,move:"Ice Punch"},{level:32,move:"Psychic"},{level:36,move:"Sweet Kiss"},{level:40,move:"Mean Look"},{level:44,move:"Perish Song"},{level:48,move:"Blizzard"}],
    tm: ["Ice Beam","Blizzard","Psychic","Double Team","Light Screen","Reflect","Dream Eater","Flash","Rest","Substitute","Thief","Protect","Endure","Swagger","Attract","Sleep Talk","Rain Dance","Psych Up","Shadow Ball","Hail","Facade","Recycle","Skill Swap","Calm Mind","Water Pulse","Payback","Fling","Nasty Plot","Avalanche","Trick Room","Grass Knot"],
    egg: ["Ice Punch","Fake Out","Role Play","Wish"],
    max: []
  },
  239: {
    levelUp: [{level:1,move:"Leer"},{level:1,move:"Quick Attack"},{level:4,move:"Thunder Shock"},{level:8,move:"Charge"},{level:12,move:"Swift"},{level:16,move:"Shock Wave"},{level:20,move:"Thunder Wave"},{level:24,move:"Screech"},{level:28,move:"Thunder Punch"},{level:32,move:"Discharge"},{level:36,move:"Low Kick"},{level:40,move:"Thunderbolt"},{level:44,move:"Light Screen"},{level:48,move:"Thunder"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Take Down","Double-Edge","Low Kick","Thunderbolt","Thunder Wave","Thunder","Psychic","Light Screen","Swift","Rest","Substitute","Thief","Protect","Endure","Sleep Talk","Rain Dance","Uproar","Facade","Focus Punch","Charge","Taunt","Helping Hand","Brick Break","Knock Off","Metal Sound","Fling","Focus Blast","Charge Beam","Electro Ball","Volt Switch","Electroweb","Wild Charge","Eerie Impulse","Electric Terrain","Tera Blast","Trailblaze","Supercell Slam"],
    egg: ["Dynamic Punch","Cross Chop","Focus Punch","Follow Me","Hammer Arm","Feint"],
    max: []
  },
  240: {
    levelUp: [{level:1,move:"Leer"},{level:1,move:"Smog"},{level:4,move:"Ember"},{level:8,move:"Smokescreen"},{level:12,move:"Clear Smog"},{level:16,move:"Flame Wheel"},{level:20,move:"Confuse Ray"},{level:24,move:"Scary Face"},{level:28,move:"Fire Punch"},{level:32,move:"Lava Plume"},{level:36,move:"Low Kick"},{level:40,move:"Flamethrower"},{level:44,move:"Sunny Day"},{level:48,move:"Fire Blast"}],
    tm: ["Fire Punch","Thunder Punch","Body Slam","Take Down","Double-Edge","Flamethrower","Low Kick","Fire Spin","Psychic","Confuse Ray","Fire Blast","Rest","Substitute","Thief","Curse","Protect","Scary Face","Endure","Sleep Talk","Sunny Day","Heat Wave","Will-O-Wisp","Facade","Focus Punch","Helping Hand","Brick Break","Overheat","Fling","Flare Blitz","Poison Jab","Flame Charge","Acid Spray","Burning Jealousy","Tera Blast","Temper Flare"],
    egg: ["Mach Punch","Belly Drum","Dynamic Punch","Cross Chop","Focus Punch","Follow Me","Belch"],
    max: []
  },
  241: {
    levelUp: [{level:1,move:"Growl"},{level:1,move:"Tackle"},{level:5,move:"Rollout"},{level:10,move:"Defense Curl"},{level:15,move:"Stomp"},{level:20,move:"Heal Bell"},{level:25,move:"Headbutt"},{level:30,move:"Zen Headbutt"},{level:35,move:"Milk Drink"},{level:40,move:"Body Slam"},{level:45,move:"Play Rough"},{level:50,move:"Charm"},{level:55,move:"High Horsepower"}],
    tm: ["Surf","Ice Beam","Blizzard","Hyper Beam","Strength","Solar Beam","Thunderbolt","Thunder Wave","Thunder","Earthquake","Double Team","Rest","Rock Slide","Substitute","Protect","Sandstorm","Endure","Swagger","Attract","Sleep Talk","Iron Tail","Rain Dance","Sunny Day","Psych Up","Shadow Ball","Rock Smash","Facade","Focus Punch","Brick Break","Rock Tomb","Shock Wave","Water Pulse","Gyro Ball","Fling","Focus Blast","Giga Impact","Stealth Rock","Bulldoze","Work Up"],
    egg: ["Double-Edge","Seismic Toss","Curse","Reversal","Present","Helping Hand","Hammer Arm","Belch"],
    max: []
  },
  242: {
    levelUp: [{level:1,move:"Charm"},{level:1,move:"Copycat"},{level:1,move:"Covet"},{level:1,move:"Disarming Voice"},{level:1,move:"Sweet Kiss"},{level:1,move:"Pound"},{level:1,move:"Defense Curl"},{level:4,move:"Tail Whip"},{level:8,move:"Echoed Voice"},{level:12,move:"Life Dew"},{level:16,move:"Sing"},{level:20,move:"Fling"},{level:24,move:"Take Down"},{level:28,move:"Heal Pulse"},{level:32,move:"Helping Hand"},{level:36,move:"Light Screen"},{level:40,move:"Double-Edge"},{level:44,move:"Soft-Boiled"},{level:48,move:"Last Resort"},{level:52,move:"Healing Wish"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Take Down","Flamethrower","Ice Beam","Blizzard","Hyper Beam","Solar Beam","Thunderbolt","Thunder Wave","Thunder","Earthquake","Psychic","Light Screen","Metronome","Fire Blast","Swift","Rest","Rock Slide","Substitute","Thief","Protect","Icy Wind","Sandstorm","Endure","Charm","Sleep Talk","Rain Dance","Sunny Day","Shadow Ball","Facade","Helping Hand","Trick","Brick Break","Skill Swap","Hyper Voice","Rock Tomb","Calm Mind","Water Pulse","Fling","Drain Punch","Focus Blast","Giga Impact","Avalanche","Zen Headbutt","Stealth Rock","Grass Knot","Stored Power","Bulldoze","Wild Charge","Disarming Voice","Electric Terrain","Dazzling Gleam","Stomping Tantrum","Tera Blast","Snowscape","Trailblaze","Chilling Water","Gravity","Focus Punch","Double-Edge","Psych Up","Endeavor","Alluring Voice"],
    egg: ["Seismic Toss","Heal Bell","Present","Gravity"],
    max: []
  },
  243: {
    levelUp: [{level:1,move:"Leer"},{level:1,move:"Charge"},{level:1,move:"Extreme Speed"},{level:1,move:"Thunder Shock"},{level:1,move:"Quick Attack"},{level:6,move:"Spark"},{level:12,move:"Bite"},{level:18,move:"Calm Mind"},{level:24,move:"Roar"},{level:30,move:"Thunder Fang"},{level:36,move:"Howl"},{level:42,move:"Crunch"},{level:48,move:"Extrasensory"},{level:54,move:"Discharge"},{level:60,move:"Reflect"},{level:66,move:"Rain Dance"},{level:72,move:"Thunder"},{level:78,move:"Zap Cannon"}],
    tm: ["Body Slam","Take Down","Double-Edge","Roar","Hyper Beam","Thunderbolt","Thunder Wave","Thunder","Agility","Light Screen","Reflect","Swift","Rest","Substitute","Protect","Scary Face","Mud-Slap","Sandstorm","Endure","Sleep Talk","Rain Dance","Sunny Day","Crunch","Shadow Ball","Facade","Charge","Helping Hand","Weather Ball","Calm Mind","Aura Sphere","Giga Impact","Thunder Fang","Iron Head","Charge Beam","Electro Ball","Scald","Volt Switch","Electroweb","Wild Charge","Snarl","Eerie Impulse","Electric Terrain","Throat Chop","Tera Blast","Trailblaze","Supercell Slam"],
    egg: [],
    max: []
  },
  244: {
    levelUp: [{level:1,move:"Stomp"},{level:1,move:"Leer"},{level:1,move:"Ember"},{level:1,move:"Smokescreen"},{level:6,move:"Flame Wheel"},{level:12,move:"Bite"},{level:18,move:"Calm Mind"},{level:24,move:"Roar"},{level:30,move:"Fire Fang"},{level:36,move:"Scary Face"},{level:42,move:"Crunch"},{level:48,move:"Extrasensory"},{level:54,move:"Lava Plume"},{level:60,move:"Swagger"},{level:66,move:"Sunny Day"},{level:72,move:"Fire Blast"},{level:78,move:"Eruption"}],
    tm: ["Body Slam","Take Down","Double-Edge","Roar","Flamethrower","Hyper Beam","Solar Beam","Fire Spin","Dig","Agility","Fire Blast","Swift","Rest","Substitute","Reversal","Protect","Scary Face","Sandstorm","Endure","Sleep Talk","Rain Dance","Sunny Day","Crunch","Shadow Ball","Heat Wave","Will-O-Wisp","Facade","Helping Hand","Weather Ball","Overheat","Calm Mind","Flare Blitz","Giga Impact","Fire Fang","Iron Head","Stone Edge","Flame Charge","Bulldoze","Snarl","Stomping Tantrum","Scorching Sands","Tera Blast","Trailblaze"],
    egg: ["Sacred Fire","Extreme Speed"],
    max: []
  },
  245: {
    levelUp: [{level:1,move:"Gust"},{level:1,move:"Leer"},{level:1,move:"Mist"},{level:1,move:"Water Gun"},{level:6,move:"Water Pulse"},{level:12,move:"Bite"},{level:18,move:"Calm Mind"},{level:24,move:"Roar"},{level:30,move:"Ice Fang"},{level:36,move:"Tailwind"},{level:42,move:"Crunch"},{level:48,move:"Extrasensory"},{level:54,move:"Surf"},{level:60,move:"Mirror Coat"},{level:66,move:"Rain Dance"},{level:72,move:"Hydro Pump"},{level:78,move:"Blizzard"}],
    tm: ["Body Slam","Take Down","Double-Edge","Roar","Hydro Pump","Surf","Ice Beam","Blizzard","Hyper Beam","Agility","Waterfall","Swift","Rest","Substitute","Protect","Icy Wind","Sandstorm","Endure","Sleep Talk","Rain Dance","Crunch","Shadow Ball","Whirlpool","Facade","Helping Hand","Weather Ball","Calm Mind","Water Pulse","Tailwind","Air Slash","Giga Impact","Avalanche","Ice Fang","Iron Head","Scald","Snarl","Liquidation","Tera Blast","Snowscape","Trailblaze","Chilling Water"],
    egg: ["Extreme Speed","Sheer Cold"],
    max: []
  },
  246: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Leer"},{level:3,move:"Rock Throw"},{level:6,move:"Payback"},{level:9,move:"Bite"},{level:12,move:"Scary Face"},{level:15,move:"Rock Slide"},{level:18,move:"Stomping Tantrum"},{level:21,move:"Screech"},{level:24,move:"Smack Down"},{level:27,move:"Crunch"},{level:31,move:"Earthquake"},{level:33,move:"Stone Edge"},{level:36,move:"Thrash"},{level:39,move:"Sandstorm"},{level:42,move:"Hyper Beam"}],
    tm: ["Body Slam","Take Down","Hyper Beam","Earthquake","Dig","Rest","Rock Slide","Substitute","Protect","Scary Face","Mud-Slap","Outrage","Sandstorm","Endure","Sleep Talk","Rain Dance","Sunny Day","Crunch","Facade","Taunt","Helping Hand","Brick Break","Rock Tomb","Iron Defense","Mud Shot","Dragon Dance","Rock Blast","Dark Pulse","Earth Power","Giga Impact","Iron Head","Stone Edge","Stealth Rock","Bulldoze","Snarl","Stomping Tantrum","Tera Blast","Sand Tomb","Spite","Smack Down","Double-Edge","Curse"],
    egg: ["Stomp","Focus Energy","Curse","Outrage","Ancient Power","Iron Defense","Dragon Dance","Assurance","Iron Head"],
    max: []
  },
  247: {
    levelUp: [{level:0,move:"Iron Defense"},{level:1,move:"Tackle"},{level:1,move:"Payback"},{level:1,move:"Leer"},{level:1,move:"Rock Throw"},{level:9,move:"Bite"},{level:12,move:"Scary Face"},{level:15,move:"Rock Slide"},{level:18,move:"Stomping Tantrum"},{level:21,move:"Screech"},{level:24,move:"Smack Down"},{level:27,move:"Crunch"},{level:33,move:"Earthquake"},{level:37,move:"Stone Edge"},{level:42,move:"Thrash"},{level:47,move:"Sandstorm"},{level:52,move:"Hyper Beam"}],
    tm: ["Body Slam","Take Down","Hyper Beam","Earthquake","Dig","Rest","Rock Slide","Substitute","Protect","Scary Face","Mud-Slap","Outrage","Sandstorm","Endure","Sleep Talk","Rain Dance","Sunny Day","Crunch","Facade","Taunt","Helping Hand","Brick Break","Rock Tomb","Aerial Ace","Iron Defense","Mud Shot","Dragon Dance","Rock Blast","Dark Pulse","Earth Power","Giga Impact","Iron Head","Stone Edge","Stealth Rock","Bulldoze","Snarl","Stomping Tantrum","Tera Blast","Sand Tomb","Spite","Smack Down","High Horsepower","Lash Out","Double-Edge","Curse"],
    egg: [],
    max: []
  },
  248: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Fire Fang"},{level:1,move:"Leer"},{level:1,move:"Ice Fang"},{level:1,move:"Rock Throw"},{level:1,move:"Thunder Fang"},{level:1,move:"Dark Pulse"},{level:1,move:"Payback"},{level:1,move:"Iron Defense"},{level:9,move:"Bite"},{level:12,move:"Scary Face"},{level:15,move:"Rock Slide"},{level:18,move:"Stomping Tantrum"},{level:21,move:"Screech"},{level:24,move:"Smack Down"},{level:27,move:"Crunch"},{level:33,move:"Earthquake"},{level:37,move:"Stone Edge"},{level:42,move:"Thrash"},{level:47,move:"Sandstorm"},{level:52,move:"Hyper Beam"},{level:59,move:"Giga Impact"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Take Down","Flamethrower","Hydro Pump","Surf","Ice Beam","Blizzard","Hyper Beam","Low Kick","Thunderbolt","Thunder Wave","Thunder","Earthquake","Dig","Fire Blast","Rest","Rock Slide","Substitute","Protect","Scary Face","Mud-Slap","Icy Wind","Outrage","Sandstorm","Endure","Sleep Talk","Rain Dance","Sunny Day","Crunch","Facade","Taunt","Helping Hand","Brick Break","Rock Tomb","Aerial Ace","Iron Defense","Dragon Claw","Mud Shot","Dragon Dance","Rock Blast","Fling","Dark Pulse","Dragon Pulse","Power Gem","Focus Blast","Earth Power","Giga Impact","Avalanche","Shadow Claw","Thunder Fang","Ice Fang","Fire Fang","Iron Head","Stone Edge","Stealth Rock","Heavy Slam","Foul Play","Bulldoze","Dragon Tail","Snarl","Stomping Tantrum","Body Press","Tera Blast","Roar","Sand Tomb","Spite","Smack Down","Knock Off","High Horsepower","Focus Punch","Lash Out","Double-Edge","Muddy Water","Breaking Swipe","Curse","Hard Press"],
    egg: [],
    max: []
  },
  249: {
    levelUp: [{level:1,move:"Gust"},{level:1,move:"Whirlwind"},{level:1,move:"Ancient Power"},{level:1,move:"Weather Ball"},{level:9,move:"Mist"},{level:18,move:"Safeguard"},{level:27,move:"Calm Mind"},{level:36,move:"Extrasensory"},{level:45,move:"Recover"},{level:54,move:"Aeroblast"},{level:63,move:"Rain Dance"},{level:72,move:"Hydro Pump"},{level:81,move:"Future Sight"},{level:90,move:"Sky Attack"}],
    tm: ["Fly","Body Slam","Take Down","Double-Edge","Hydro Pump","Surf","Ice Beam","Blizzard","Hyper Beam","Thunderbolt","Thunder","Earthquake","Psychic","Light Screen","Reflect","Waterfall","Swift","Rest","Substitute","Curse","Protect","Scary Face","Icy Wind","Sandstorm","Giga Drain","Endure","Sleep Talk","Rain Dance","Sunny Day","Psych Up","Shadow Ball","Future Sight","Whirlpool","Facade","Helping Hand","Trick","Skill Swap","Imprison","Hyper Voice","Weather Ball","Air Cutter","Aerial Ace","Calm Mind","Water Pulse","Tailwind","Air Slash","Dragon Pulse","Brave Bird","Earth Power","Giga Impact","Avalanche","Zen Headbutt","Iron Head","Charge Beam","Psyshock","Acrobatics","Dragon Tail","Hurricane","Liquidation","Scale Shot","Dual Wingbeat","Tera Blast","Chilling Water","Psychic Noise"],
    egg: ["Dragon Rush"],
    max: []
  },
  250: {
    levelUp: [{level:1,move:"Gust"},{level:1,move:"Whirlwind"},{level:1,move:"Ancient Power"},{level:1,move:"Weather Ball"},{level:9,move:"Life Dew"},{level:18,move:"Safeguard"},{level:27,move:"Calm Mind"},{level:36,move:"Extrasensory"},{level:45,move:"Recover"},{level:54,move:"Sacred Fire"},{level:63,move:"Sunny Day"},{level:72,move:"Fire Blast"},{level:81,move:"Future Sight"},{level:90,move:"Sky Attack"},{level:99,move:"Overheat"}],
    tm: ["Fly","Body Slam","Take Down","Double-Edge","Flamethrower","Hyper Beam","Solar Beam","Fire Spin","Thunderbolt","Thunder","Earthquake","Psychic","Light Screen","Reflect","Fire Blast","Swift","Rest","Substitute","Protect","Sandstorm","Giga Drain","Endure","Sleep Talk","Rain Dance","Sunny Day","Psych Up","Shadow Ball","Future Sight","Heat Wave","Will-O-Wisp","Facade","Helping Hand","Imprison","Hyper Voice","Weather Ball","Air Cutter","Overheat","Aerial Ace","Calm Mind","Tailwind","Flare Blitz","Air Slash","Brave Bird","Earth Power","Giga Impact","Zen Headbutt","Iron Head","Charge Beam","Flame Charge","Hurricane","Dual Wingbeat","Scorching Sands","Tera Blast"],
    egg: [],
    max: []
  },
  251: {
    levelUp: [{level:1,move:"Confusion"},{level:1,move:"Heal Bell"},{level:10,move:"Magical Leaf"},{level:20,move:"Baton Pass"},{level:30,move:"Ancient Power"},{level:40,move:"Life Dew"},{level:50,move:"Leech Seed"},{level:60,move:"Recover"},{level:70,move:"Future Sight"},{level:80,move:"Healing Wish"},{level:90,move:"Leaf Storm"},{level:100,move:"Perish Song"}],
    tm: ["Swords Dance","Cut","Hyper Beam","Solar Beam","Thunder Wave","Psychic","Double Team","Light Screen","Reflect","Dream Eater","Flash","Rest","Substitute","Protect","Sandstorm","Giga Drain","Endure","Swagger","Sleep Talk","Safeguard","Rain Dance","Sunny Day","Psych Up","Shadow Ball","Facade","Skill Swap","Aerial Ace","Calm Mind","Shock Wave","Water Pulse","U-turn","Fling","Energy Ball","Giga Impact","Nasty Plot","Trick Room","Stealth Rock","Grass Knot","Charge Beam","Dazzling Gleam"],
    egg: [],
    max: []
  },
  252: {
    levelUp: [{level:1,move:"Pound"},{level:1,move:"Leer"},{level:3,move:"Leafage"},{level:6,move:"Quick Attack"},{level:9,move:"Mega Drain"},{level:12,move:"Detect"},{level:15,move:"Quick Guard"},{level:18,move:"Assurance"},{level:21,move:"Giga Drain"},{level:24,move:"Slam"},{level:27,move:"Double Team"},{level:30,move:"Energy Ball"},{level:33,move:"Screech"},{level:36,move:"Endeavor"},{level:39,move:"Leaf Storm"}],
    tm: ["Thunder Punch","Swords Dance","Take Down","Low Kick","Solar Beam","Dig","Agility","Swift","Rest","Rock Slide","Substitute","Thief","Protect","Giga Drain","Endure","Sleep Talk","Sunny Day","Crunch","Facade","Helping Hand","Brick Break","Endeavor","Rock Tomb","Bullet Seed","Aerial Ace","Magical Leaf","Fling","Seed Bomb","Drain Punch","Energy Ball","Leaf Storm","Grass Knot","Acrobatics","Grass Pledge","Dragon Tail","Grassy Terrain","Breaking Swipe","Grassy Glide","Tera Blast","Trailblaze","Upper Hand"],
    egg: ["Double Kick","Absorb","Leech Seed","Slash","Dragon Breath","Synthesis","Worry Seed","Night Slash"],
    max: []
  },
  253: {
    levelUp: [{level:1,move:"Pound"},{level:1,move:"Leer"},{level:1,move:"Quick Attack"},{level:1,move:"Leafage"},{level:9,move:"Mega Drain"},{level:12,move:"Detect"},{level:15,move:"Quick Guard"},{level:20,move:"Assurance"},{level:25,move:"Giga Drain"},{level:30,move:"Slam"},{level:35,move:"Double Team"},{level:40,move:"Leaf Blade"},{level:45,move:"Screech"},{level:50,move:"Endeavor"},{level:55,move:"Leaf Storm"}],
    tm: ["Thunder Punch","Swords Dance","Take Down","Low Kick","Solar Beam","Dig","Agility","Swift","Rest","Rock Slide","Substitute","Thief","Protect","Giga Drain","Endure","False Swipe","Sleep Talk","Sunny Day","Crunch","Facade","Focus Punch","Helping Hand","Brick Break","Endeavor","Rock Tomb","Bullet Seed","Aerial Ace","Magical Leaf","Fling","Seed Bomb","X-Scissor","Drain Punch","Vacuum Wave","Energy Ball","Leaf Storm","Grass Knot","Low Sweep","Acrobatics","Grass Pledge","Dragon Tail","Grassy Terrain","Breaking Swipe","Grassy Glide","Tera Blast","Trailblaze","Upper Hand"],
    egg: ["Double Kick","Absorb","Leech Seed","Slash","False Swipe","Fury Cutter","Dragon Breath","Synthesis","Worry Seed","Night Slash","X-Scissor","Energy Ball"],
    max: []
  },
  254: {
    levelUp: [{level:0,move:"Leaf Blade"},{level:1,move:"Pound"},{level:1,move:"Leer"},{level:1,move:"Quick Attack"},{level:1,move:"Leafage"},{level:5,move:"Mega Drain"},{level:12,move:"Detect"},{level:15,move:"Quick Guard"},{level:20,move:"Assurance"},{level:25,move:"Giga Drain"},{level:30,move:"Slam"},{level:35,move:"Double Team"},{level:42,move:"Screech"},{level:49,move:"Endeavor"},{level:56,move:"Leaf Storm"}],
    tm: ["Thunder Punch","Swords Dance","Body Slam","Take Down","Double-Edge","Roar","Hyper Beam","Low Kick","Solar Beam","Earthquake","Dig","Agility","Swift","Rest","Rock Slide","Substitute","Thief","Protect","Outrage","Giga Drain","Endure","False Swipe","Sleep Talk","Sunny Day","Crunch","Facade","Focus Punch","Helping Hand","Brick Break","Endeavor","Rock Tomb","Bullet Seed","Aerial Ace","Dragon Claw","Frenzy Plant","Magical Leaf","Dragon Dance","Fling","Seed Bomb","X-Scissor","Dragon Pulse","Drain Punch","Vacuum Wave","Focus Blast","Energy Ball","Giga Impact","Leaf Storm","Grass Knot","Low Sweep","Acrobatics","Grass Pledge","Bulldoze","Dragon Tail","Grassy Terrain","Solar Blade","Throat Chop","Breaking Swipe","Scale Shot","Grassy Glide","Tera Blast","Trailblaze","Dragon Cheer","Upper Hand"],
    egg: ["Double Kick","Absorb","Leech Seed","Slash","False Swipe","Fury Cutter","Dragon Breath","Synthesis","Worry Seed","Night Slash","X-Scissor","Energy Ball","Shed Tail"],
    max: []
  },
  255: {
    levelUp: [{level:1,move:"Scratch"},{level:1,move:"Growl"},{level:3,move:"Ember"},{level:6,move:"Quick Attack"},{level:9,move:"Flame Charge"},{level:12,move:"Detect"},{level:15,move:"Sand Attack"},{level:18,move:"Aerial Ace"},{level:21,move:"Slash"},{level:24,move:"Bounce"},{level:27,move:"Focus Energy"},{level:30,move:"Flamethrower"},{level:33,move:"Feather Dance"},{level:36,move:"Reversal"},{level:39,move:"Flare Blitz"}],
    tm: ["Swords Dance","Body Slam","Take Down","Double-Edge","Flamethrower","Low Kick","Fire Spin","Dig","Agility","Fire Blast","Swift","Rest","Rock Slide","Substitute","Curse","Reversal","Protect","Endure","Sleep Talk","Baton Pass","Sunny Day","Uproar","Heat Wave","Will-O-Wisp","Facade","Helping Hand","Feather Dance","Overheat","Rock Tomb","Aerial Ace","Flare Blitz","Shadow Claw","Flame Charge","Fire Pledge","Tera Blast","Temper Flare"],
    egg: ["Peck","Counter","Crush Claw","Feint","Last Resort","Night Slash"],
    max: []
  },
  256: {
    levelUp: [{level:0,move:"Double Kick"},{level:1,move:"Scratch"},{level:1,move:"Growl"},{level:1,move:"Ember"},{level:1,move:"Quick Attack"},{level:9,move:"Flame Charge"},{level:12,move:"Detect"},{level:15,move:"Sand Attack"},{level:20,move:"Aerial Ace"},{level:25,move:"Slash"},{level:30,move:"Bounce"},{level:35,move:"Focus Energy"},{level:40,move:"Blaze Kick"},{level:45,move:"Bulk Up"},{level:50,move:"Reversal"},{level:55,move:"Flare Blitz"}],
    tm: ["Fire Punch","Thunder Punch","Swords Dance","Body Slam","Take Down","Double-Edge","Flamethrower","Low Kick","Fire Spin","Dig","Agility","Fire Blast","Swift","Rest","Rock Slide","Substitute","Thief","Curse","Reversal","Protect","Endure","Sleep Talk","Baton Pass","Sunny Day","Uproar","Heat Wave","Will-O-Wisp","Facade","Focus Punch","Helping Hand","Brick Break","Feather Dance","Overheat","Rock Tomb","Aerial Ace","Bulk Up","Close Combat","Fling","Flare Blitz","Poison Jab","Vacuum Wave","Focus Blast","Shadow Claw","Flame Charge","Low Sweep","Fire Pledge","Coaching","Tera Blast","Temper Flare"],
    egg: ["Flamethrower","Peck","Counter","Feather Dance","Crush Claw","Feint","Last Resort","Night Slash"],
    max: []
  },
  257: {
    levelUp: [{level:0,move:"Blaze Kick"},{level:1,move:"Scratch"},{level:1,move:"Double Kick"},{level:1,move:"Growl"},{level:1,move:"Quick Attack"},{level:9,move:"Flame Charge"},{level:12,move:"Detect"},{level:15,move:"Sand Attack"},{level:20,move:"Aerial Ace"},{level:25,move:"Slash"},{level:30,move:"Bounce"},{level:35,move:"Focus Energy"},{level:42,move:"Bulk Up"},{level:49,move:"Reversal"},{level:56,move:"Flare Blitz"},{level:63,move:"Brave Bird"}],
    tm: ["Fire Punch","Thunder Punch","Swords Dance","Body Slam","Take Down","Double-Edge","Roar","Flamethrower","Hyper Beam","Low Kick","Solar Beam","Fire Spin","Earthquake","Dig","Agility","Fire Blast","Swift","Rest","Rock Slide","Substitute","Thief","Curse","Reversal","Protect","Mud-Slap","Endure","Sleep Talk","Baton Pass","Sunny Day","Uproar","Heat Wave","Will-O-Wisp","Facade","Focus Punch","Helping Hand","Brick Break","Knock Off","Feather Dance","Blast Burn","Overheat","Rock Tomb","Aerial Ace","Bulk Up","U-turn","Close Combat","Fling","Flare Blitz","Aura Sphere","Poison Jab","Vacuum Wave","Focus Blast","Brave Bird","Giga Impact","Shadow Claw","Stone Edge","Flame Charge","Low Sweep","Acrobatics","Fire Pledge","Bulldoze","Heat Crash","Coaching","Scorching Sands","Tera Blast","Temper Flare","Upper Hand"],
    egg: ["Fire Punch","Ember","Flamethrower","Peck","Counter","Feather Dance","Crush Claw","Feint","Last Resort","Night Slash"],
    max: []
  },
  258: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Growl"},{level:3,move:"Water Gun"},{level:6,move:"Rock Smash"},{level:9,move:"Rock Throw"},{level:12,move:"Protect"},{level:15,move:"Supersonic"},{level:18,move:"Water Pulse"},{level:21,move:"Rock Slide"},{level:24,move:"Take Down"},{level:27,move:"Amnesia"},{level:30,move:"Surf"},{level:33,move:"Screech"},{level:36,move:"Endeavor"},{level:39,move:"Hydro Pump"}],
    tm: ["Body Slam","Take Down","Double-Edge","Roar","Hydro Pump","Surf","Ice Beam","Blizzard","Low Kick","Dig","Waterfall","Amnesia","Rest","Rock Slide","Substitute","Curse","Protect","Mud-Slap","Icy Wind","Endure","Sleep Talk","Rain Dance","Whirlpool","Uproar","Facade","Endeavor","Rock Tomb","Muddy Water","Mud Shot","Water Pulse","Earth Power","Avalanche","Sludge Wave","Water Pledge","Liquidation","Tera Blast","Chilling Water"],
    egg: ["Stomp","Double-Edge","Bite","Counter","Sludge","Curse","Mud-Slap","Mirror Coat","Ancient Power","Yawn","Wide Guard"],
    max: []
  },
  259: {
    levelUp: [{level:0,move:"Mud Shot"},{level:1,move:"Tackle"},{level:1,move:"Growl"},{level:1,move:"Water Gun"},{level:9,move:"Rock Throw"},{level:12,move:"Protect"},{level:15,move:"Supersonic"},{level:20,move:"Water Pulse"},{level:25,move:"Rock Slide"},{level:30,move:"Take Down"},{level:35,move:"Amnesia"},{level:40,move:"Muddy Water"},{level:45,move:"Screech"},{level:50,move:"Endeavor"},{level:55,move:"Hydro Pump"}],
    tm: ["Ice Punch","Body Slam","Take Down","Double-Edge","Roar","Hydro Pump","Surf","Ice Beam","Blizzard","Low Kick","Earthquake","Dig","Waterfall","Amnesia","Rest","Rock Slide","Substitute","Curse","Protect","Mud-Slap","Icy Wind","Endure","Sleep Talk","Rain Dance","Whirlpool","Uproar","Facade","Focus Punch","Helping Hand","Brick Break","Endeavor","Rock Tomb","Sand Tomb","Muddy Water","Mud Shot","Water Pulse","Fling","Earth Power","Avalanche","Stealth Rock","Sludge Wave","Water Pledge","Bulldoze","Liquidation","Tera Blast","Chilling Water"],
    egg: ["Stomp","Double-Edge","Bite","Counter","Sludge","Curse","Mud-Slap","Mirror Coat","Ancient Power","Rock Smash","Yawn","Wide Guard"],
    max: []
  },
  260: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Growl"},{level:1,move:"Water Gun"},{level:1,move:"Mud Shot"},{level:9,move:"Rock Throw"},{level:12,move:"Protect"},{level:15,move:"Supersonic"},{level:20,move:"Water Pulse"},{level:25,move:"Rock Slide"},{level:30,move:"Take Down"},{level:35,move:"Amnesia"},{level:42,move:"Muddy Water"},{level:49,move:"Screech"},{level:56,move:"Endeavor"},{level:63,move:"Hydro Pump"}],
    tm: ["Ice Punch","Body Slam","Take Down","Double-Edge","Roar","Hydro Pump","Surf","Ice Beam","Blizzard","Hyper Beam","Low Kick","Earthquake","Dig","Waterfall","Amnesia","Rest","Rock Slide","Substitute","Curse","Protect","Scary Face","Mud-Slap","Icy Wind","Outrage","Endure","Sleep Talk","Rain Dance","Whirlpool","Uproar","Facade","Focus Punch","Helping Hand","Brick Break","Knock Off","Endeavor","Hydro Cannon","Weather Ball","Rock Tomb","Sand Tomb","Muddy Water","Bulk Up","Mud Shot","Water Pulse","Fling","Poison Jab","Focus Blast","Earth Power","Giga Impact","Avalanche","Stone Edge","Stealth Rock","Smack Down","Sludge Wave","Water Pledge","Bulldoze","High Horsepower","Stomping Tantrum","Liquidation","Body Press","Flip Turn","Tera Blast","Chilling Water","Hard Press"],
    egg: ["Stomp","Double-Edge","Bite","Surf","Counter","Earthquake","Sludge","Curse","Mud-Slap","Mirror Coat","Ancient Power","Rock Smash","Yawn","Hammer Arm","Wide Guard"],
    max: []
  },
  261: {
    levelUp: [{level:1,move:"Tackle"},{level:4,move:"Howl"},{level:7,move:"Sand Attack"},{level:10,move:"Bite"},{level:13,move:"Leer"},{level:16,move:"Roar"},{level:19,move:"Swagger"},{level:22,move:"Assurance"},{level:25,move:"Scary Face"},{level:28,move:"Taunt"},{level:31,move:"Crunch"},{level:34,move:"Yawn"},{level:36,move:"Take Down"},{level:40,move:"Sucker Punch"},{level:44,move:"Play Rough"}],
    tm: ["Take Down","Roar","Dig","Rest","Super Fang","Substitute","Thief","Spite","Protect","Scary Face","Mud-Slap","Endure","Charm","Sleep Talk","Rain Dance","Sunny Day","Crunch","Shadow Ball","Uproar","Facade","Taunt","Helping Hand","Hyper Voice","Dark Pulse","Nasty Plot","Thunder Fang","Ice Fang","Fire Fang","Foul Play","Snarl","Play Rough","Psychic Fangs","Lash Out","Tera Blast","Trailblaze","Double-Edge","Endeavor"],
    egg: ["Poison Fang","Astonish","Covet"],
    max: []
  },
  262: {
    levelUp: [{level:0,move:"Snarl"},{level:1,move:"Crunch"},{level:1,move:"Fire Fang"},{level:1,move:"Ice Fang"},{level:1,move:"Thunder Fang"},{level:1,move:"Thief"},{level:1,move:"Sand Attack"},{level:1,move:"Bite"},{level:1,move:"Tackle"},{level:13,move:"Howl"},{level:13,move:"Leer"},{level:16,move:"Roar"},{level:20,move:"Swagger"},{level:24,move:"Assurance"},{level:28,move:"Scary Face"},{level:36,move:"Taunt"},{level:44,move:"Yawn"},{level:48,move:"Take Down"},{level:52,move:"Sucker Punch"},{level:56,move:"Play Rough"}],
    tm: ["Body Slam","Take Down","Roar","Hyper Beam","Dig","Rest","Super Fang","Substitute","Thief","Spite","Protect","Scary Face","Mud-Slap","Endure","Charm","Sleep Talk","Rain Dance","Sunny Day","Crunch","Shadow Ball","Uproar","Facade","Taunt","Helping Hand","Hyper Voice","Dark Pulse","Giga Impact","Nasty Plot","Thunder Fang","Ice Fang","Fire Fang","Foul Play","Snarl","Play Rough","Psychic Fangs","Lash Out","Tera Blast","Trailblaze","Double-Edge","Endeavor","Throat Chop"],
    egg: ["Poison Fang","Astonish","Covet"],
    max: []
  },
  263: {
    levelUp: [{level:1,move:"Growl"},{level:1,move:"Tackle"},{level:3,move:"Sand Attack"},{level:6,move:"Tail Whip"},{level:9,move:"Covet"},{level:12,move:"Headbutt"},{level:15,move:"Baby-Doll Eyes"},{level:18,move:"Pin Missile"},{level:21,move:"Rest"},{level:24,move:"Take Down"},{level:27,move:"Fling"},{level:30,move:"Flail"},{level:33,move:"Belly Drum"},{level:36,move:"Double-Edge"}],
    tm: ["Cut","Surf","Ice Beam","Blizzard","Thunderbolt","Thunder Wave","Thunder","Dig","Double Team","Rest","Substitute","Thief","Protect","Endure","Swagger","Attract","Sleep Talk","Iron Tail","Rain Dance","Sunny Day","Shadow Ball","Rock Smash","Facade","Shock Wave","Water Pulse","Fling","Grass Knot","Charge Beam","Work Up"],
    egg: ["Mud-Slap","Charm","Extreme Speed","Helping Hand","Trick","Tickle","Simple Beam"],
    max: []
  },
  264: {
    levelUp: [{level:0,move:"Slash"},{level:1,move:"Baby-Doll Eyes"},{level:1,move:"Growl"},{level:1,move:"Pin Missile"},{level:1,move:"Sand Attack"},{level:1,move:"Slash"},{level:1,move:"Switcheroo"},{level:1,move:"Tackle"},{level:1,move:"Tail Whip"},{level:9,move:"Covet"},{level:12,move:"Headbutt"},{level:15,move:"Hone Claws"},{level:18,move:"Fury Swipes"},{level:23,move:"Rest"},{level:28,move:"Take Down"},{level:33,move:"Fling"},{level:38,move:"Flail"},{level:43,move:"Belly Drum"},{level:48,move:"Double-Edge"}],
    tm: ["Cut","Roar","Surf","Ice Beam","Blizzard","Hyper Beam","Strength","Thunderbolt","Thunder Wave","Thunder","Dig","Double Team","Rest","Substitute","Thief","Protect","Endure","Swagger","Attract","Sleep Talk","Iron Tail","Rain Dance","Sunny Day","Shadow Ball","Rock Smash","Facade","Shock Wave","Water Pulse","Fling","Giga Impact","Shadow Claw","Grass Knot","Charge Beam","Work Up"],
    egg: [],
    max: []
  },
  265: {
    levelUp: [{level:1,move:"Poison Sting"},{level:6,move:"Tackle"}],
    tm: [],
    egg: [],
    max: []
  },
  266: {
    levelUp: [{level:0,move:"Iron Defense"},{level:1,move:"Poison Sting"},{level:6,move:"Tackle"}],
    tm: [],
    egg: [],
    max: []
  },
  267: {
    levelUp: [{level:0,move:"Air Cutter"},{level:1,move:"Poison Sting"},{level:6,move:"Tackle"},{level:6,move:"Iron Defense"},{level:11,move:"Stun Spore"},{level:18,move:"Silver Wind"},{level:25,move:"Venoshock"},{level:34,move:"Air Slash"},{level:43,move:"Bug Buzz"}],
    tm: [],
    egg: [],
    max: []
  },
  268: {
    levelUp: [{level:0,move:"Iron Defense"},{level:1,move:"Poison Sting"},{level:6,move:"Tackle"}],
    tm: [],
    egg: [],
    max: []
  },
  269: {
    levelUp: [{level:0,move:"Confusion"},{level:1,move:"Poison Sting"},{level:6,move:"Tackle"},{level:6,move:"Iron Defense"},{level:11,move:"Poison Powder"},{level:18,move:"Silver Wind"},{level:25,move:"Venoshock"},{level:34,move:"Extrasensory"},{level:43,move:"Bug Buzz"}],
    tm: [],
    egg: [],
    max: []
  },
  270: {
    levelUp: [{level:1,move:"Growl"},{level:1,move:"Astonish"},{level:3,move:"Absorb"},{level:6,move:"Water Gun"},{level:9,move:"Mist"},{level:12,move:"Mega Drain"},{level:16,move:"Flail"},{level:20,move:"Bubble Beam"},{level:24,move:"Leech Seed"},{level:28,move:"Giga Drain"},{level:33,move:"Rain Dance"},{level:38,move:"Zen Headbutt"},{level:43,move:"Energy Ball"}],
    tm: ["Swords Dance","Body Slam","Take Down","Surf","Ice Beam","Blizzard","Solar Beam","Rest","Substitute","Thief","Protect","Icy Wind","Giga Drain","Endure","Sleep Talk","Rain Dance","Sunny Day","Uproar","Facade","Weather Ball","Bullet Seed","Magical Leaf","Water Pulse","Seed Bomb","Energy Ball","Zen Headbutt","Grass Knot","Disarming Voice","Grassy Terrain","Grassy Glide","Tera Blast","Trailblaze","Chilling Water","Double-Edge","Whirlpool","Muddy Water"],
    egg: ["Counter","Razor Leaf","Sweet Scent","Synthesis","Teeter Dance","Tickle"],
    max: []
  },
  271: {
    levelUp: [{level:1,move:"Growl"},{level:1,move:"Water Gun"},{level:1,move:"Astonish"},{level:1,move:"Teeter Dance"},{level:1,move:"Absorb"},{level:1,move:"Knock Off"},{level:1,move:"Fake Out"},{level:1,move:"Flail"},{level:9,move:"Mist"},{level:12,move:"Mega Drain"},{level:18,move:"Fury Swipes"},{level:24,move:"Bubble Beam"},{level:30,move:"Leech Seed"},{level:36,move:"Giga Drain"},{level:50,move:"Zen Headbutt"},{level:57,move:"Energy Ball"},{level:64,move:"Hydro Pump"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Swords Dance","Body Slam","Take Down","Hydro Pump","Surf","Ice Beam","Blizzard","Solar Beam","Metronome","Waterfall","Rest","Substitute","Thief","Protect","Icy Wind","Giga Drain","Endure","Sleep Talk","Encore","Rain Dance","Sunny Day","Uproar","Facade","Brick Break","Knock Off","Hyper Voice","Weather Ball","Bullet Seed","Mud Shot","Magical Leaf","Water Pulse","Fling","Seed Bomb","Drain Punch","Energy Ball","Zen Headbutt","Grass Knot","Disarming Voice","Grassy Terrain","Grassy Glide","Tera Blast","Trailblaze","Chilling Water","Double-Edge","Whirlpool","Muddy Water"],
    egg: ["Counter","Razor Leaf","Sweet Scent","Synthesis","Teeter Dance","Tickle"],
    max: []
  },
  272: {
    levelUp: [{level:1,move:"Fake Out"},{level:1,move:"Rain Dance"},{level:1,move:"Bubble Beam"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Swords Dance","Body Slam","Take Down","Hydro Pump","Surf","Ice Beam","Blizzard","Hyper Beam","Solar Beam","Metronome","Waterfall","Swift","Amnesia","Rest","Substitute","Thief","Protect","Icy Wind","Giga Drain","Endure","Sleep Talk","Encore","Rain Dance","Sunny Day","Uproar","Facade","Focus Punch","Brick Break","Knock Off","Hyper Voice","Weather Ball","Bullet Seed","Mud Shot","Magical Leaf","Water Pulse","Fling","Seed Bomb","Drain Punch","Focus Blast","Energy Ball","Giga Impact","Zen Headbutt","Leaf Storm","Grass Knot","Disarming Voice","Grassy Terrain","Grassy Glide","Tera Blast","Ice Spinner","Trailblaze","Chilling Water","Double-Edge","Whirlpool","Muddy Water"],
    egg: ["Growl","Mist","Water Gun","Hydro Pump","Counter","Absorb","Mega Drain","Razor Leaf","Fury Swipes","Flail","Sweet Scent","Synthesis","Knock Off","Teeter Dance","Astonish","Tickle","Energy Ball","Zen Headbutt"],
    max: []
  },
  273: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Harden"},{level:3,move:"Absorb"},{level:6,move:"Astonish"},{level:9,move:"Growth"},{level:12,move:"Rollout"},{level:15,move:"Mega Drain"},{level:18,move:"Payback"},{level:21,move:"Headbutt"},{level:24,move:"Sunny Day"},{level:27,move:"Synthesis"},{level:30,move:"Sucker Punch"},{level:33,move:"Explosion"}],
    tm: ["Body Slam","Take Down","Solar Beam","Dig","Amnesia","Rest","Substitute","Spite","Protect","Giga Drain","Endure","False Swipe","Sleep Talk","Rain Dance","Sunny Day","Shadow Ball","Facade","Bullet Seed","Magical Leaf","Seed Bomb","Energy Ball","Nasty Plot","Leaf Storm","Grass Knot","Foul Play","Grassy Terrain","Grassy Glide","Tera Blast","Trailblaze","Double-Edge","Endeavor","Curse"],
    egg: ["Take Down","Leech Seed","Quick Attack","Worry Seed","Night Slash","Defog"],
    max: []
  },
  274: {
    levelUp: [{level:0,move:"Razor Leaf"},{level:1,move:"Tackle"},{level:1,move:"Absorb"},{level:1,move:"Harden"},{level:1,move:"Explosion"},{level:1,move:"Swagger"},{level:1,move:"Air Cutter"},{level:1,move:"Fake Out"},{level:1,move:"Torment"},{level:1,move:"Astonish"},{level:9,move:"Growth"},{level:12,move:"Rollout"},{level:18,move:"Mega Drain"},{level:24,move:"Payback"},{level:30,move:"Synthesis"},{level:36,move:"Sunny Day"},{level:43,move:"Extrasensory"},{level:50,move:"Sucker Punch"},{level:57,move:"Leaf Blade"}],
    tm: ["Swords Dance","Body Slam","Take Down","Low Kick","Solar Beam","Dig","Swift","Amnesia","Rest","Rock Slide","Substitute","Thief","Spite","Protect","Scary Face","Giga Drain","Endure","False Swipe","Sleep Talk","Rain Dance","Sunny Day","Shadow Ball","Uproar","Facade","Brick Break","Knock Off","Weather Ball","Air Cutter","Rock Tomb","Bullet Seed","Magical Leaf","Fling","Dark Pulse","Seed Bomb","Energy Ball","Nasty Plot","Leaf Storm","Grass Knot","Low Sweep","Foul Play","Snarl","Grassy Terrain","Solar Blade","Grassy Glide","Lash Out","Tera Blast","Trailblaze","Chilling Water","Psych Up","Double-Edge","Endeavor","Curse"],
    egg: ["Take Down","Leech Seed","Quick Attack","Worry Seed","Night Slash","Defog"],
    max: []
  },
  275: {
    levelUp: [{level:0,move:"Leaf Blade"},{level:1,move:"Sunny Day"},{level:1,move:"Air Cutter"},{level:1,move:"Payback"},{level:1,move:"Hurricane"}],
    tm: ["Swords Dance","Body Slam","Take Down","Hyper Beam","Low Kick","Solar Beam","Dig","Confuse Ray","Swift","Amnesia","Rest","Rock Slide","Substitute","Thief","Reversal","Spite","Protect","Scary Face","Icy Wind","Giga Drain","Endure","False Swipe","Sleep Talk","Rain Dance","Sunny Day","Shadow Ball","Uproar","Heat Wave","Will-O-Wisp","Facade","Taunt","Brick Break","Knock Off","Imprison","Weather Ball","Air Cutter","Rock Tomb","Bullet Seed","Aerial Ace","Magical Leaf","Tailwind","Fling","Toxic Spikes","Dark Pulse","Seed Bomb","Air Slash","X-Scissor","Vacuum Wave","Focus Blast","Energy Ball","Giga Impact","Nasty Plot","Leaf Storm","Grass Knot","Low Sweep","Foul Play","Hex","Hurricane","Snarl","Grassy Terrain","Solar Blade","Grassy Glide","Lash Out","Tera Blast","Trailblaze","Chilling Water","Psych Up","Double-Edge","Endeavor","Petal Blizzard","Throat Chop","Curse","Upper Hand"],
    egg: ["Whirlwind","Tackle","Take Down","Absorb","Mega Drain","Leech Seed","Growth","Razor Leaf","Quick Attack","Harden","Explosion","Rollout","Swagger","Synthesis","Beat Up","Fake Out","Torment","Astonish","Extrasensory","Worry Seed","Sucker Punch","Night Slash","Defog"],
    max: []
  },
  276: {
    levelUp: [{level:1,move:"Growl"},{level:1,move:"Peck"},{level:5,move:"Focus Energy"},{level:9,move:"Quick Attack"},{level:13,move:"Wing Attack"},{level:17,move:"Double Team"},{level:21,move:"Aerial Ace"},{level:25,move:"Quick Guard"},{level:29,move:"Agility"},{level:33,move:"Air Slash"},{level:37,move:"Endeavor"},{level:41,move:"Brave Bird"},{level:45,move:"Reversal"}],
    tm: ["Fly","Double Team","Rest","Substitute","Thief","Protect","Endure","Swagger","Steel Wing","Attract","Sleep Talk","Rain Dance","Sunny Day","Facade","Aerial Ace","Roost","Pluck","U-turn","Defog","Work Up"],
    egg: ["Whirlwind","Supersonic","Sky Attack","Brave Bird","Hurricane","Boomburst"],
    max: []
  },
  277: {
    levelUp: [{level:1,move:"Air Slash"},{level:1,move:"Brave Bird"},{level:1,move:"Focus Energy"},{level:1,move:"Growl"},{level:1,move:"Peck"},{level:1,move:"Pluck"},{level:1,move:"Quick Attack"},{level:5,move:"Focus Energy"},{level:9,move:"Quick Attack"},{level:13,move:"Wing Attack"},{level:17,move:"Double Team"},{level:21,move:"Aerial Ace"},{level:27,move:"Quick Guard"},{level:33,move:"Agility"},{level:39,move:"Air Slash"},{level:45,move:"Endeavor"},{level:51,move:"Brave Bird"},{level:57,move:"Reversal"}],
    tm: ["Fly","Hyper Beam","Double Team","Rest","Substitute","Thief","Protect","Endure","Swagger","Steel Wing","Attract","Sleep Talk","Rain Dance","Sunny Day","Facade","Aerial Ace","Roost","Pluck","U-turn","Giga Impact","Defog","Work Up"],
    egg: [],
    max: []
  },
  278: {
    levelUp: [{level:1,move:"Growl"},{level:1,move:"Water Gun"},{level:5,move:"Quick Attack"},{level:10,move:"Supersonic"},{level:15,move:"Wing Attack"},{level:20,move:"Water Pulse"},{level:26,move:"Agility"},{level:30,move:"Air Slash"},{level:35,move:"Mist"},{level:40,move:"Roost"},{level:45,move:"Hurricane"}],
    tm: ["Fly","Take Down","Hydro Pump","Surf","Ice Beam","Blizzard","Agility","Waterfall","Swift","Rest","Substitute","Thief","Protect","Icy Wind","Endure","Sleep Talk","Rain Dance","Facade","Helping Hand","Air Cutter","Aerial Ace","Water Pulse","Tailwind","U-turn","Air Slash","Brave Bird","Acrobatics","Hurricane","Liquidation","Tera Blast","Snowscape","Chilling Water","Knock Off","Dual Wingbeat","Whirlpool","Muddy Water","Feather Dance"],
    egg: ["Gust","Twister","Knock Off","Air Cutter","Aerial Ace","Aqua Ring","Wide Guard","Soak"],
    max: []
  },
  279: {
    levelUp: [{level:1,move:"Growl"},{level:1,move:"Supersonic"},{level:1,move:"Air Slash"},{level:1,move:"Water Gun"},{level:1,move:"Tailwind"},{level:1,move:"Agility"},{level:1,move:"Quick Attack"},{level:1,move:"Protect"},{level:1,move:"Soak"},{level:15,move:"Wing Attack"},{level:20,move:"Water Pulse"},{level:28,move:"Stockpile"},{level:28,move:"Spit Up"},{level:28,move:"Swallow"},{level:34,move:"Fling"},{level:41,move:"Mist"},{level:48,move:"Roost"},{level:55,move:"Hurricane"},{level:62,move:"Hydro Pump"}],
    tm: ["Fly","Body Slam","Take Down","Hydro Pump","Surf","Ice Beam","Blizzard","Hyper Beam","Agility","Waterfall","Swift","Rest","Substitute","Thief","Protect","Icy Wind","Endure","Sleep Talk","Rain Dance","Facade","Helping Hand","Air Cutter","Aerial Ace","Water Pulse","Tailwind","U-turn","Fling","Seed Bomb","Air Slash","Brave Bird","Giga Impact","Gunk Shot","Acrobatics","Hurricane","Liquidation","Tera Blast","Snowscape","Chilling Water","Knock Off","Weather Ball","Dual Wingbeat","Whirlpool","Muddy Water","Feather Dance"],
    egg: ["Wide Guard"],
    max: []
  },
  280: {
    levelUp: [{level:1,move:"Growl"},{level:1,move:"Disarming Voice"},{level:3,move:"Double Team"},{level:6,move:"Confusion"},{level:9,move:"Hypnosis"},{level:12,move:"Draining Kiss"},{level:15,move:"Teleport"},{level:18,move:"Psybeam"},{level:21,move:"Life Dew"},{level:24,move:"Charm"},{level:27,move:"Calm Mind"},{level:30,move:"Psychic"},{level:33,move:"Heal Pulse"},{level:36,move:"Dream Eater"},{level:39,move:"Future Sight"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Psybeam","Thunderbolt","Thunder Wave","Psychic","Confuse Ray","Light Screen","Reflect","Metronome","Swift","Rest","Substitute","Thief","Protect","Icy Wind","Endure","Charm","Sleep Talk","Encore","Rain Dance","Sunny Day","Shadow Ball","Will-O-Wisp","Facade","Taunt","Helping Hand","Trick","Skill Swap","Imprison","Hyper Voice","Magical Leaf","Calm Mind","Fling","Zen Headbutt","Trick Room","Grass Knot","Charge Beam","Psyshock","Stored Power","Disarming Voice","Draining Kiss","Misty Terrain","Dazzling Gleam","Psychic Terrain","Tera Blast","Knock Off","Pain Split","Psych Up","Future Sight","Expanding Force","Alluring Voice"],
    egg: ["Disable","Confuse Ray","Destiny Bond","Mean Look","Memento","Knock Off","Shadow Sneak","Mystical Fire"],
    max: []
  },
  281: {
    levelUp: [{level:1,move:"Growl"},{level:1,move:"Confusion"},{level:1,move:"Double Team"},{level:1,move:"Disarming Voice"},{level:9,move:"Hypnosis"},{level:12,move:"Draining Kiss"},{level:15,move:"Teleport"},{level:18,move:"Psybeam"},{level:23,move:"Life Dew"},{level:28,move:"Charm"},{level:33,move:"Calm Mind"},{level:38,move:"Psychic"},{level:43,move:"Heal Pulse"},{level:48,move:"Dream Eater"},{level:53,move:"Future Sight"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Psybeam","Hyper Beam","Thunderbolt","Thunder Wave","Psychic","Confuse Ray","Light Screen","Reflect","Metronome","Swift","Rest","Substitute","Thief","Protect","Icy Wind","Endure","Charm","Sleep Talk","Encore","Rain Dance","Sunny Day","Shadow Ball","Will-O-Wisp","Facade","Taunt","Helping Hand","Trick","Skill Swap","Imprison","Hyper Voice","Magical Leaf","Calm Mind","Fling","Zen Headbutt","Trick Room","Grass Knot","Charge Beam","Psyshock","Stored Power","Disarming Voice","Draining Kiss","Misty Terrain","Dazzling Gleam","Psychic Terrain","Tera Blast","Knock Off","Pain Split","Psych Up","Triple Axel","Future Sight","Expanding Force","Alluring Voice"],
    egg: [],
    max: []
  },
  282: {
    levelUp: [{level:0,move:"Dazzling Gleam"},{level:1,move:"Growl"},{level:1,move:"Confusion"},{level:1,move:"Mystical Fire"},{level:1,move:"Double Team"},{level:1,move:"Misty Terrain"},{level:1,move:"Charm"},{level:1,move:"Disarming Voice"},{level:1,move:"Healing Wish"},{level:1,move:"Heal Pulse"},{level:9,move:"Hypnosis"},{level:12,move:"Draining Kiss"},{level:15,move:"Teleport"},{level:18,move:"Psybeam"},{level:23,move:"Life Dew"},{level:28,move:"Wish"},{level:35,move:"Calm Mind"},{level:42,move:"Psychic"},{level:49,move:"Moonblast"},{level:56,move:"Dream Eater"},{level:63,move:"Future Sight"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Psybeam","Hyper Beam","Thunderbolt","Thunder Wave","Psychic","Night Shade","Confuse Ray","Light Screen","Reflect","Metronome","Swift","Rest","Substitute","Thief","Protect","Icy Wind","Endure","Charm","Sleep Talk","Encore","Rain Dance","Sunny Day","Shadow Ball","Will-O-Wisp","Facade","Taunt","Helping Hand","Trick","Skill Swap","Imprison","Hyper Voice","Magical Leaf","Calm Mind","Fling","Aura Sphere","Focus Blast","Energy Ball","Giga Impact","Zen Headbutt","Trick Room","Grass Knot","Charge Beam","Psyshock","Stored Power","Disarming Voice","Draining Kiss","Misty Terrain","Dazzling Gleam","Psychic Terrain","Tera Blast","Gravity","Knock Off","Vacuum Wave","Misty Explosion","Pain Split","Psych Up","Triple Axel","Future Sight","Expanding Force","Alluring Voice","Psychic Noise"],
    egg: [],
    max: []
  },
  283: {
    levelUp: [{level:1,move:"Water Gun"},{level:6,move:"Quick Attack"},{level:9,move:"Sweet Scent"},{level:14,move:"Soak"},{level:17,move:"Bubble Beam"},{level:22,move:"Agility"},{level:25,move:"Mist"},{level:25,move:"Haze"},{level:35,move:"Baton Pass"},{level:38,move:"Sticky Web"}],
    tm: ["Take Down","Hydro Pump","Surf","Ice Beam","Blizzard","Psybeam","Solar Beam","Agility","Waterfall","Leech Life","Rest","Substitute","Thief","Protect","Mud-Slap","Icy Wind","Giga Drain","Endure","Sleep Talk","Baton Pass","Rain Dance","Sunny Day","Shadow Ball","Facade","Helping Hand","Mud Shot","Water Pulse","Bug Buzz","Acrobatics","Struggle Bug","Liquidation","Tera Blast","Pounce","Chilling Water","Haze","Bug Bite","Lunge","Psych Up","Skitter Smack"],
    egg: ["Hydro Pump","Psybeam","Mud Shot","Bug Bite","Aqua Jet","Power Split","Fell Stinger","Lunge"],
    max: []
  },
  284: {
    levelUp: [{level:1,move:"Whirlwind"},{level:1,move:"Water Gun"},{level:1,move:"Quick Attack"},{level:1,move:"Sweet Scent"},{level:1,move:"Soak"},{level:17,move:"Gust"},{level:22,move:"Scary Face"},{level:22,move:"Air Cutter"},{level:26,move:"Stun Spore"},{level:32,move:"Air Slash"},{level:38,move:"Giga Drain"},{level:44,move:"Bug Buzz"},{level:52,move:"Quiver Dance"}],
    tm: ["Take Down","Hydro Pump","Surf","Ice Beam","Blizzard","Psybeam","Hyper Beam","Solar Beam","Agility","Waterfall","Swift","Leech Life","Rest","Substitute","Thief","Protect","Scary Face","Mud-Slap","Icy Wind","Giga Drain","Endure","Sleep Talk","Baton Pass","Rain Dance","Sunny Day","Shadow Ball","Facade","Helping Hand","Air Cutter","Aerial Ace","Mud Shot","Water Pulse","Tailwind","U-turn","Air Slash","Bug Buzz","Energy Ball","Giga Impact","Foul Play","Acrobatics","Struggle Bug","Hurricane","Liquidation","Tera Blast","Pounce","Chilling Water","Haze","Bug Bite","Lunge","Weather Ball","Dual Wingbeat","Psych Up","Skitter Smack"],
    egg: [],
    max: []
  },
  285: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Absorb"},{level:5,move:"Stun Spore"},{level:8,move:"Leech Seed"},{level:12,move:"Mega Drain"},{level:15,move:"Headbutt"},{level:19,move:"Poison Powder"},{level:26,move:"Giga Drain"},{level:29,move:"Growth"},{level:33,move:"Toxic"},{level:36,move:"Seed Bomb"},{level:40,move:"Spore"}],
    tm: ["Body Slam","Take Down","Solar Beam","Swift","Rest","Substitute","Protect","Sludge Bomb","Giga Drain","Endure","Charm","False Swipe","Sleep Talk","Rain Dance","Sunny Day","Facade","Helping Hand","Fake Tears","Bullet Seed","Magical Leaf","Seed Bomb","Drain Punch","Energy Ball","Zen Headbutt","Gunk Shot","Grass Knot","Venoshock","Grassy Terrain","Tera Blast","Pounce","Toxic"],
    egg: ["Charm","Helping Hand","Fake Tears","Worry Seed"],
    max: []
  },
  286: {
    levelUp: [{level:0,move:"Mach Punch"},{level:1,move:"Stun Spore"},{level:1,move:"Tackle"},{level:1,move:"Absorb"},{level:1,move:"Leech Seed"},{level:1,move:"Growth"},{level:1,move:"Poison Powder"},{level:1,move:"Toxic"},{level:12,move:"Mega Drain"},{level:15,move:"Headbutt"},{level:19,move:"Feint"},{level:22,move:"Counter"},{level:28,move:"Force Palm"},{level:33,move:"Worry Seed"},{level:39,move:"Brick Break"},{level:44,move:"Seed Bomb"},{level:50,move:"Dynamic Punch"},{level:55,move:"Focus Punch"}],
    tm: ["Thunder Punch","Swords Dance","Body Slam","Take Down","Hyper Beam","Low Kick","Solar Beam","Dig","Swift","Rest","Rock Slide","Substitute","Reversal","Protect","Sludge Bomb","Mud-Slap","Giga Drain","Endure","Charm","False Swipe","Sleep Talk","Rain Dance","Sunny Day","Facade","Helping Hand","Brick Break","Fake Tears","Rock Tomb","Bullet Seed","Aerial Ace","Bulk Up","Mud Shot","Magical Leaf","Close Combat","Fling","Poison Jab","Seed Bomb","Drain Punch","Focus Blast","Energy Ball","Giga Impact","Zen Headbutt","Leaf Storm","Gunk Shot","Stone Edge","Grass Knot","Venoshock","Low Sweep","Bulldoze","Grassy Terrain","Tera Blast","Pounce","Toxic","Focus Punch"],
    egg: [],
    max: []
  },
  287: {
    levelUp: [{level:1,move:"Scratch"},{level:1,move:"Yawn"},{level:6,move:"Encore"},{level:9,move:"Slack Off"},{level:14,move:"Headbutt"},{level:17,move:"Amnesia"},{level:22,move:"Covet"},{level:25,move:"Throat Chop"},{level:30,move:"Counter"},{level:33,move:"Flail"},{level:38,move:"Play Rough"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Take Down","Flamethrower","Ice Beam","Blizzard","Solar Beam","Thunderbolt","Thunder","Metronome","Fire Blast","Amnesia","Rest","Rock Slide","Substitute","Thief","Protect","Mud-Slap","Icy Wind","Endure","False Swipe","Sleep Talk","Encore","Metal Claw","Rain Dance","Sunny Day","Shadow Ball","Facade","Helping Hand","Brick Break","Rock Tomb","Aerial Ace","Bulk Up","Mud Shot","Fling","Poison Jab","Seed Bomb","X-Scissor","Shadow Claw","Zen Headbutt","Gunk Shot","Play Rough","Tera Blast","Chilling Water","Focus Punch","Throat Chop","Curse"],
    egg: ["Body Slam","Slash","Snore","Curse","Crush Claw","Tickle","Hammer Arm","Night Slash","After You"],
    max: []
  },
  288: {
    levelUp: [{level:1,move:"Scratch"},{level:1,move:"Focus Energy"},{level:1,move:"Encore"},{level:1,move:"Uproar"},{level:14,move:"Fury Swipes"},{level:17,move:"Endure"},{level:23,move:"Slash"},{level:27,move:"Throat Chop"},{level:33,move:"Counter"},{level:37,move:"Focus Punch"},{level:43,move:"Reversal"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Take Down","Flamethrower","Ice Beam","Blizzard","Low Kick","Solar Beam","Thunderbolt","Thunder Wave","Thunder","Earthquake","Dig","Metronome","Fire Blast","Amnesia","Rest","Rock Slide","Substitute","Thief","Reversal","Protect","Scary Face","Mud-Slap","Icy Wind","Outrage","Endure","False Swipe","Sleep Talk","Encore","Metal Claw","Rain Dance","Sunny Day","Shadow Ball","Facade","Taunt","Helping Hand","Brick Break","Hyper Voice","Rock Tomb","Aerial Ace","Bulk Up","Mud Shot","Fling","Poison Jab","Seed Bomb","X-Scissor","Drain Punch","Focus Blast","Shadow Claw","Zen Headbutt","Gunk Shot","Low Sweep","Bulldoze","Play Rough","Stomping Tantrum","Tera Blast","Trailblaze","Chilling Water","Roar","Knock Off","Uproar","Focus Punch","Lash Out","Double-Edge","Endeavor","Throat Chop","Curse"],
    egg: [],
    max: []
  },
  289: {
    levelUp: [{level:0,move:"Swagger"},{level:1,move:"Scratch"},{level:1,move:"Encore"},{level:1,move:"Yawn"},{level:1,move:"Slack Off"},{level:1,move:"Sucker Punch"},{level:17,move:"Amnesia"},{level:23,move:"Covet"},{level:27,move:"Throat Chop"},{level:33,move:"Counter"},{level:39,move:"Flail"},{level:45,move:"Fling"},{level:52,move:"Mega Kick"},{level:63,move:"Hammer Arm"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Take Down","Flamethrower","Ice Beam","Blizzard","Hyper Beam","Low Kick","Solar Beam","Thunderbolt","Thunder Wave","Thunder","Earthquake","Dig","Metronome","Fire Blast","Amnesia","Rest","Rock Slide","Substitute","Thief","Reversal","Protect","Scary Face","Mud-Slap","Icy Wind","Outrage","Endure","False Swipe","Sleep Talk","Encore","Metal Claw","Rain Dance","Sunny Day","Shadow Ball","Facade","Taunt","Helping Hand","Brick Break","Hyper Voice","Rock Tomb","Aerial Ace","Bulk Up","Mud Shot","Fling","Poison Jab","Seed Bomb","X-Scissor","Drain Punch","Focus Blast","Giga Impact","Shadow Claw","Zen Headbutt","Gunk Shot","Heavy Slam","Low Sweep","Bulldoze","Wild Charge","Play Rough","Stomping Tantrum","Body Press","Tera Blast","Pounce","Trailblaze","Chilling Water","Roar","Smack Down","Knock Off","High Horsepower","Uproar","Focus Punch","Lash Out","Double-Edge","Endeavor","Throat Chop","Curse","Hard Press"],
    egg: [],
    max: []
  },
  290: {
    levelUp: [{level:1,move:"Sand Attack"},{level:1,move:"Scratch"},{level:5,move:"Harden"},{level:10,move:"False Swipe"},{level:15,move:"Mud-Slap"},{level:21,move:"Absorb"},{level:25,move:"Metal Claw"},{level:30,move:"Fury Swipes"},{level:35,move:"Mind Reader"},{level:40,move:"Dig"}],
    tm: ["Cut","Solar Beam","Dig","Double Team","Flash","Rest","Substitute","Protect","Sandstorm","Giga Drain","Endure","False Swipe","Swagger","Sleep Talk","Sunny Day","Shadow Ball","Facade","Aerial Ace","X-Scissor","Bug Buzz"],
    egg: ["Gust","Flail","Night Slash","Bug Bite","Final Gambit"],
    max: []
  },
  291: {
    levelUp: [{level:0,move:"Double Team"},{level:0,move:"Fury Cutter"},{level:0,move:"Screech"},{level:1,move:"Aerial Ace"},{level:1,move:"Baton Pass"},{level:1,move:"Dig"},{level:1,move:"Double Team"},{level:1,move:"False Swipe"},{level:1,move:"Fury Cutter"},{level:1,move:"Harden"},{level:1,move:"Metal Claw"},{level:1,move:"Mud-Slap"},{level:1,move:"Sand Attack"},{level:1,move:"Scratch"},{level:1,move:"Screech"},{level:15,move:"Agility"},{level:23,move:"Absorb"},{level:29,move:"Bug Bite"},{level:36,move:"Fury Swipes"},{level:43,move:"Mind Reader"},{level:50,move:"Slash"},{level:57,move:"Swords Dance"},{level:64,move:"X-Scissor"}],
    tm: ["Swords Dance","Cut","Hyper Beam","Solar Beam","Dig","Double Team","Flash","Rest","Substitute","Thief","Protect","Sandstorm","Giga Drain","Endure","False Swipe","Swagger","Sleep Talk","Sunny Day","Shadow Ball","Facade","Aerial Ace","Roost","U-turn","X-Scissor","Bug Buzz","Giga Impact","Defog"],
    egg: [],
    max: []
  },
  292: {
    levelUp: [{level:1,move:"Dig"},{level:1,move:"False Swipe"},{level:1,move:"Grudge"},{level:1,move:"Harden"},{level:1,move:"Metal Claw"},{level:1,move:"Mud-Slap"},{level:1,move:"Sand Attack"},{level:1,move:"Scratch"},{level:1,move:"Shadow Claw"},{level:15,move:"Confuse Ray"},{level:23,move:"Absorb"},{level:29,move:"Shadow Sneak"},{level:36,move:"Fury Swipes"},{level:43,move:"Mind Reader"},{level:50,move:"Shadow Ball"},{level:57,move:"Spite"},{level:64,move:"Phantom Force"}],
    tm: ["Cut","Hyper Beam","Solar Beam","Dig","Double Team","Dream Eater","Flash","Rest","Substitute","Thief","Protect","Sandstorm","Giga Drain","Endure","False Swipe","Swagger","Sleep Talk","Sunny Day","Shadow Ball","Will-O-Wisp","Facade","Aerial Ace","X-Scissor","Bug Buzz","Giga Impact","Shadow Claw"],
    egg: [],
    max: []
  },
  293: {
    levelUp: [{level:1,move:"Astonish"},{level:1,move:"Pound"},{level:5,move:"Echoed Voice"},{level:10,move:"Howl"},{level:15,move:"Rest"},{level:15,move:"Sleep Talk"},{level:21,move:"Stomp"},{level:25,move:"Roar"},{level:30,move:"Supersonic"},{level:35,move:"Uproar"},{level:40,move:"Screech"},{level:45,move:"Hyper Voice"}],
    tm: ["Roar","Flamethrower","Ice Beam","Blizzard","Solar Beam","Double Team","Fire Blast","Rest","Substitute","Protect","Endure","Swagger","Attract","Sleep Talk","Rain Dance","Sunny Day","Shadow Ball","Facade","Shock Wave","Water Pulse","Fling","Work Up"],
    egg: ["Whirlwind","Take Down","Smokescreen","Snore","Endeavor","Fake Tears","Extrasensory","Hammer Arm","Circle Throw","Disarming Voice"],
    max: []
  },
  294: {
    levelUp: [{level:0,move:"Bite"},{level:1,move:"Astonish"},{level:1,move:"Bite"},{level:1,move:"Echoed Voice"},{level:1,move:"Howl"},{level:1,move:"Pound"},{level:15,move:"Rest"},{level:15,move:"Sleep Talk"},{level:23,move:"Stomp"},{level:29,move:"Roar"},{level:36,move:"Supersonic"},{level:43,move:"Uproar"},{level:50,move:"Screech"},{level:57,move:"Hyper Voice"}],
    tm: ["Roar","Flamethrower","Ice Beam","Blizzard","Strength","Solar Beam","Earthquake","Double Team","Fire Blast","Rest","Rock Slide","Substitute","Protect","Endure","Swagger","Attract","Sleep Talk","Rain Dance","Sunny Day","Shadow Ball","Rock Smash","Torment","Facade","Taunt","Brick Break","Overheat","Rock Tomb","Shock Wave","Water Pulse","Fling","Bulldoze","Work Up"],
    egg: [],
    max: []
  },
  295: {
    levelUp: [{level:0,move:"Crunch"},{level:1,move:"Astonish"},{level:1,move:"Bite"},{level:1,move:"Crunch"},{level:1,move:"Echoed Voice"},{level:1,move:"Fire Fang"},{level:1,move:"Howl"},{level:1,move:"Ice Fang"},{level:1,move:"Pound"},{level:1,move:"Thunder Fang"},{level:15,move:"Rest"},{level:15,move:"Sleep Talk"},{level:23,move:"Stomp"},{level:29,move:"Roar"},{level:36,move:"Supersonic"},{level:45,move:"Uproar"},{level:54,move:"Screech"},{level:63,move:"Hyper Voice"},{level:72,move:"Boomburst"},{level:81,move:"Hyper Beam"}],
    tm: ["Roar","Flamethrower","Surf","Ice Beam","Blizzard","Hyper Beam","Strength","Solar Beam","Earthquake","Double Team","Fire Blast","Rest","Rock Slide","Substitute","Protect","Endure","Swagger","Attract","Sleep Talk","Rain Dance","Sunny Day","Shadow Ball","Rock Smash","Torment","Facade","Taunt","Brick Break","Overheat","Rock Tomb","Shock Wave","Water Pulse","Fling","Focus Blast","Giga Impact","Avalanche","Rock Climb","Bulldoze","Work Up"],
    egg: [],
    max: []
  },
  296: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Focus Energy"},{level:4,move:"Sand Attack"},{level:7,move:"Arm Thrust"},{level:10,move:"Fake Out"},{level:13,move:"Force Palm"},{level:16,move:"Whirlwind"},{level:19,move:"Knock Off"},{level:22,move:"Bulk Up"},{level:25,move:"Belly Drum"},{level:28,move:"Detect"},{level:31,move:"Seismic Toss"},{level:34,move:"Focus Punch"},{level:37,move:"Endure"},{level:40,move:"Close Combat"},{level:43,move:"Reversal"},{level:46,move:"Heavy Slam"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Take Down","Surf","Low Kick","Earthquake","Dig","Metronome","Swift","Rest","Rock Slide","Substitute","Thief","Reversal","Protect","Mud-Slap","Endure","Sleep Talk","Rain Dance","Sunny Day","Facade","Taunt","Helping Hand","Brick Break","Rock Tomb","Bulk Up","Mud Shot","Close Combat","Fling","Poison Jab","Drain Punch","Focus Blast","Zen Headbutt","Stone Edge","Heavy Slam","Low Sweep","Bulldoze","Stomping Tantrum","Body Press","Tera Blast","Chilling Water","Smack Down","Knock Off","Vacuum Wave","Focus Punch","Double-Edge","Coaching","Upper Hand"],
    egg: ["Counter","Dynamic Punch","Cross Chop","Helping Hand","Feint","Bullet Punch","Wide Guard"],
    max: []
  },
  297: {
    levelUp: [{level:1,move:"Sand Attack"},{level:1,move:"Tackle"},{level:1,move:"Focus Energy"},{level:1,move:"Brine"},{level:1,move:"Arm Thrust"},{level:10,move:"Fake Out"},{level:13,move:"Force Palm"},{level:16,move:"Whirlwind"},{level:19,move:"Knock Off"},{level:22,move:"Bulk Up"},{level:26,move:"Belly Drum"},{level:30,move:"Detect"},{level:34,move:"Seismic Toss"},{level:38,move:"Focus Punch"},{level:42,move:"Endure"},{level:46,move:"Close Combat"},{level:50,move:"Reversal"},{level:54,move:"Heavy Slam"},{level:60,move:"Headlong Rush"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Take Down","Surf","Hyper Beam","Low Kick","Earthquake","Dig","Metronome","Swift","Rest","Rock Slide","Substitute","Thief","Reversal","Protect","Scary Face","Mud-Slap","Endure","Sleep Talk","Rain Dance","Sunny Day","Facade","Taunt","Helping Hand","Brick Break","Rock Tomb","Bulk Up","Mud Shot","Close Combat","Fling","Poison Jab","Drain Punch","Focus Blast","Giga Impact","Zen Headbutt","Iron Head","Stone Edge","Heavy Slam","Low Sweep","Bulldoze","Stomping Tantrum","Body Press","Tera Blast","Chilling Water","Smack Down","Knock Off","Vacuum Wave","Focus Punch","Lash Out","Double-Edge","Coaching","Throat Chop","Curse","Upper Hand"],
    egg: [],
    max: []
  },
  298: {
    levelUp: [{level:1,move:"Tail Whip"},{level:1,move:"Water Gun"},{level:1,move:"Splash"},{level:3,move:"Helping Hand"},{level:6,move:"Bubble Beam"},{level:9,move:"Charm"},{level:12,move:"Slam"},{level:15,move:"Bounce"}],
    tm: ["Body Slam","Take Down","Surf","Ice Beam","Blizzard","Light Screen","Waterfall","Rest","Substitute","Protect","Mud-Slap","Icy Wind","Endure","Charm","Sleep Talk","Encore","Rain Dance","Facade","Helping Hand","Hyper Voice","Fake Tears","Mud Shot","Draining Kiss","Tera Blast","Alluring Voice"],
    egg: ["Sing","Supersonic","Belly Drum","Perish Song","Present","Tickle","Copycat","Aqua Jet","Soak"],
    max: []
  },
  299: {
    levelUp: [{level:1,move:"Tackle"},{level:4,move:"Harden"},{level:7,move:"Block"},{level:10,move:"Rock Throw"},{level:13,move:"Thunder Wave"},{level:16,move:"Rest"},{level:19,move:"Spark"},{level:22,move:"Rock Slide"},{level:25,move:"Power Gem"},{level:28,move:"Rock Blast"},{level:31,move:"Discharge"},{level:34,move:"Sandstorm"},{level:37,move:"Earth Power"},{level:40,move:"Stone Edge"},{level:43,move:"Zap Cannon"},{level:43,move:"Lock-On"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Take Down","Thunderbolt","Thunder Wave","Thunder","Earthquake","Rest","Rock Slide","Substitute","Protect","Sandstorm","Endure","Sleep Talk","Sunny Day","Facade","Taunt","Helping Hand","Rock Tomb","Sand Tomb","Iron Defense","Rock Blast","Gravity","Power Gem","Earth Power","Flash Cannon","Stone Edge","Stealth Rock","Smack Down","Heavy Slam","Volt Switch","Bulldoze","Dazzling Gleam","High Horsepower","Stomping Tantrum","Body Press","Steel Beam","Tera Blast","Pain Split","Double-Edge","Meteor Beam","Curse"],
    egg: ["Double-Edge","Rollout","Head Smash","Wide Guard"],
    max: []
  },
  300: {
    levelUp: [{level:1,move:"Fake Out"},{level:1,move:"Growl"},{level:1,move:"Tail Whip"},{level:4,move:"Tackle"},{level:7,move:"Sing"},{level:10,move:"Attract"},{level:13,move:"Disarming Voice"},{level:16,move:"Fury Swipes"},{level:19,move:"Copycat"},{level:22,move:"Payback"},{level:25,move:"Charm"},{level:31,move:"Facade"},{level:34,move:"Covet"},{level:37,move:"Heal Bell"},{level:40,move:"Double-Edge"},{level:43,move:"Baby-Doll Eyes"},{level:46,move:"Play Rough"}],
    tm: ["Ice Beam","Blizzard","Solar Beam","Thunderbolt","Thunder Wave","Thunder","Dig","Double Team","Dream Eater","Flash","Rest","Substitute","Protect","Endure","Swagger","Attract","Sleep Talk","Safeguard","Iron Tail","Rain Dance","Sunny Day","Psych Up","Shadow Ball","Facade","Calm Mind","Shock Wave","Water Pulse","Payback","Nasty Plot","Grass Knot","Charge Beam","Work Up"],
    egg: ["Baton Pass","Fake Out","Uproar","Helping Hand","Wish","Fake Tears","Tickle","Cosmic Power","Last Resort","Sucker Punch","Zen Headbutt","Simple Beam"],
    max: []
  },
  301: {
    levelUp: [{level:1,move:"Attract"},{level:1,move:"Baby-Doll Eyes"},{level:1,move:"Charm"},{level:1,move:"Copycat"},{level:1,move:"Covet"},{level:1,move:"Disarming Voice"},{level:1,move:"Double-Edge"},{level:1,move:"Facade"},{level:1,move:"Fake Out"},{level:1,move:"Fury Swipes"},{level:1,move:"Growl"},{level:1,move:"Heal Bell"},{level:1,move:"Payback"},{level:1,move:"Play Rough"},{level:1,move:"Sing"},{level:1,move:"Tackle"},{level:1,move:"Tail Whip"}],
    tm: ["Ice Beam","Blizzard","Hyper Beam","Strength","Solar Beam","Thunderbolt","Thunder Wave","Thunder","Dig","Double Team","Dream Eater","Flash","Rest","Substitute","Protect","Endure","Swagger","Attract","Sleep Talk","Safeguard","Iron Tail","Rain Dance","Sunny Day","Psych Up","Shadow Ball","Rock Smash","Facade","Calm Mind","Shock Wave","Water Pulse","Payback","Giga Impact","Nasty Plot","Grass Knot","Charge Beam","Work Up"],
    egg: [],
    max: []
  },
  302: {
    levelUp: [{level:1,move:"Scratch"},{level:1,move:"Leer"},{level:3,move:"Astonish"},{level:9,move:"Shadow Sneak"},{level:12,move:"Fake Out"},{level:15,move:"Disable"},{level:18,move:"Detect"},{level:21,move:"Night Shade"},{level:24,move:"Fury Swipes"},{level:27,move:"Knock Off"},{level:30,move:"Quash"},{level:33,move:"Shadow Claw"},{level:36,move:"Mean Look"},{level:39,move:"Power Gem"},{level:42,move:"Zen Headbutt"},{level:45,move:"Shadow Ball"},{level:48,move:"Foul Play"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Take Down","Psybeam","Hyper Beam","Low Kick","Thunder Wave","Dig","Psychic","Night Shade","Confuse Ray","Light Screen","Reflect","Metronome","Rest","Substitute","Thief","Protect","Mud-Slap","Icy Wind","Giga Drain","Endure","Sleep Talk","Encore","Metal Claw","Rain Dance","Sunny Day","Shadow Ball","Will-O-Wisp","Facade","Taunt","Helping Hand","Trick","Brick Break","Skill Swap","Imprison","Rock Tomb","Aerial Ace","Bulk Up","Mud Shot","Calm Mind","Fling","Poison Jab","Dark Pulse","X-Scissor","Power Gem","Drain Punch","Energy Ball","Giga Impact","Nasty Plot","Shadow Claw","Zen Headbutt","Low Sweep","Foul Play","Hex","Snarl","Phantom Force","Dazzling Gleam","Tera Blast","Spite","Gravity","Gyro Ball","Knock Off","Focus Punch","Poltergeist","Lash Out","Pain Split","Psych Up","Skitter Smack","Throat Chop"],
    egg: ["Recover","Torment","Flatter","Feint","Metal Burst","Sucker Punch"],
    max: []
  },
  303: {
    levelUp: [{level:1,move:"Astonish"},{level:1,move:"Growl"},{level:4,move:"Fairy Wind"},{level:8,move:"Baton Pass"},{level:12,move:"Bite"},{level:16,move:"Spit Up"},{level:16,move:"Stockpile"},{level:16,move:"Swallow"},{level:20,move:"Sucker Punch"},{level:24,move:"Iron Defense"},{level:28,move:"Crunch"},{level:32,move:"Sweet Scent"},{level:36,move:"Iron Head"},{level:40,move:"Taunt"},{level:44,move:"Fake Tears"},{level:48,move:"Play Rough"}],
    tm: ["Swords Dance","Flamethrower","Ice Beam","Hyper Beam","Strength","Solar Beam","Double Team","Fire Blast","Rest","Rock Slide","Substitute","Protect","Sludge Bomb","Sandstorm","Endure","False Swipe","Swagger","Attract","Sleep Talk","Rain Dance","Sunny Day","Shadow Ball","Rock Smash","Torment","Facade","Focus Punch","Taunt","Brick Break","Rock Tomb","Payback","Fling","Dark Pulse","Focus Blast","Giga Impact","Flash Cannon","Stone Edge","Stealth Rock","Grass Knot","Charge Beam"],
    egg: ["Slam","Seismic Toss","Ancient Power","Poison Fang","Tickle","Metal Burst","Guard Swap","Sucker Punch","Thunder Fang","Ice Fang","Fire Fang","Misty Terrain","Power-Up Punch"],
    max: []
  },
  304: {
    levelUp: [{level:1,move:"Harden"},{level:1,move:"Tackle"},{level:4,move:"Metal Claw"},{level:8,move:"Rock Tomb"},{level:12,move:"Roar"},{level:16,move:"Headbutt"},{level:20,move:"Protect"},{level:24,move:"Rock Slide"},{level:28,move:"Iron Head"},{level:33,move:"Metal Sound"},{level:36,move:"Take Down"},{level:40,move:"Autotomize"},{level:44,move:"Iron Tail"},{level:48,move:"Iron Defense"},{level:52,move:"Heavy Slam"},{level:56,move:"Double-Edge"},{level:60,move:"Metal Burst"}],
    tm: ["Cut","Roar","Strength","Earthquake","Dig","Double Team","Rest","Rock Slide","Substitute","Protect","Sandstorm","Endure","Swagger","Attract","Sleep Talk","Iron Tail","Rain Dance","Sunny Day","Rock Smash","Facade","Rock Tomb","Aerial Ace","Shock Wave","Water Pulse","Rock Polish","Shadow Claw","Stealth Rock","Bulldoze"],
    egg: ["Stomp","Body Slam","Screech","Curse","Reversal","Mud-Slap","Superpower","Endeavor","Dragon Rush","Iron Head","Head Smash"],
    max: []
  },
  305: {
    levelUp: [{level:1,move:"Harden"},{level:1,move:"Metal Claw"},{level:1,move:"Rock Tomb"},{level:1,move:"Tackle"},{level:12,move:"Roar"},{level:16,move:"Headbutt"},{level:20,move:"Protect"},{level:24,move:"Rock Slide"},{level:28,move:"Iron Head"},{level:35,move:"Metal Sound"},{level:40,move:"Take Down"},{level:46,move:"Autotomize"},{level:52,move:"Iron Tail"},{level:58,move:"Iron Defense"},{level:64,move:"Heavy Slam"},{level:70,move:"Double-Edge"},{level:76,move:"Metal Burst"}],
    tm: ["Cut","Roar","Strength","Earthquake","Dig","Double Team","Rest","Rock Slide","Substitute","Protect","Sandstorm","Endure","Swagger","Attract","Sleep Talk","Iron Tail","Rain Dance","Sunny Day","Rock Smash","Facade","Rock Tomb","Aerial Ace","Shock Wave","Water Pulse","Rock Polish","Shadow Claw","Stone Edge","Stealth Rock","Bulldoze"],
    egg: [],
    max: []
  },
  306: {
    levelUp: [{level:1,move:"Harden"},{level:1,move:"Metal Claw"},{level:1,move:"Rock Tomb"},{level:1,move:"Tackle"},{level:12,move:"Roar"},{level:16,move:"Headbutt"},{level:20,move:"Protect"},{level:24,move:"Rock Slide"},{level:28,move:"Iron Head"},{level:35,move:"Metal Sound"},{level:40,move:"Take Down"},{level:48,move:"Autotomize"},{level:56,move:"Iron Tail"},{level:64,move:"Iron Defense"},{level:72,move:"Heavy Slam"},{level:80,move:"Double-Edge"},{level:88,move:"Metal Burst"}],
    tm: ["Cut","Roar","Flamethrower","Surf","Ice Beam","Blizzard","Hyper Beam","Strength","Solar Beam","Thunderbolt","Thunder Wave","Thunder","Earthquake","Dig","Double Team","Fire Blast","Rest","Rock Slide","Substitute","Protect","Sandstorm","Endure","Swagger","Attract","Sleep Talk","Iron Tail","Rain Dance","Sunny Day","Rock Smash","Facade","Focus Punch","Taunt","Brick Break","Rock Tomb","Aerial Ace","Dragon Claw","Shock Wave","Water Pulse","Payback","Fling","Rock Polish","Dark Pulse","Dragon Pulse","Focus Blast","Giga Impact","Avalanche","Shadow Claw","Flash Cannon","Rock Climb","Stone Edge","Stealth Rock","Bulldoze"],
    egg: [],
    max: []
  },
  307: {
    levelUp: [{level:1,move:"Confusion"},{level:1,move:"Work Up"},{level:9,move:"Detect"},{level:12,move:"Endure"},{level:15,move:"Feint"},{level:17,move:"Force Palm"},{level:20,move:"Psybeam"},{level:23,move:"Calm Mind"},{level:25,move:"Zen Headbutt"},{level:28,move:"High Jump Kick"},{level:31,move:"Psych Up"},{level:33,move:"Acupressure"},{level:36,move:"Power Trick"},{level:39,move:"Reversal"},{level:41,move:"Recover"},{level:44,move:"Counter"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Take Down","Psybeam","Low Kick","Psychic","Night Shade","Light Screen","Reflect","Metronome","Swift","Rest","Rock Slide","Substitute","Thief","Reversal","Protect","Endure","Sleep Talk","Baton Pass","Rain Dance","Sunny Day","Shadow Ball","Facade","Taunt","Helping Hand","Trick","Brick Break","Skill Swap","Imprison","Rock Tomb","Aerial Ace","Bulk Up","Calm Mind","Close Combat","Fling","Poison Jab","Drain Punch","Focus Blast","Zen Headbutt","Trick Room","Grass Knot","Psyshock","Low Sweep","Stored Power","Psychic Terrain","Tera Blast","Trailblaze","Focus Punch","Pain Split","Psych Up","Expanding Force","Upper Hand"],
    egg: ["Fire Punch","Ice Punch","Thunder Punch","Dynamic Punch","Baton Pass","Fake Out","Power Swap","Guard Swap","Bullet Punch","Psycho Cut","Quick Guard"],
    max: []
  },
  308: {
    levelUp: [{level:1,move:"Fire Punch"},{level:1,move:"Ice Punch"},{level:1,move:"Thunder Punch"},{level:1,move:"Work Up"},{level:1,move:"Detect"},{level:1,move:"Confusion"},{level:12,move:"Endure"},{level:15,move:"Feint"},{level:17,move:"Force Palm"},{level:20,move:"Psybeam"},{level:23,move:"Calm Mind"},{level:25,move:"Zen Headbutt"},{level:28,move:"High Jump Kick"},{level:31,move:"Psych Up"},{level:33,move:"Acupressure"},{level:36,move:"Power Trick"},{level:47,move:"Recover"},{level:53,move:"Counter"},{level:53,move:"Axe Kick"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Take Down","Psybeam","Hyper Beam","Low Kick","Psychic","Night Shade","Light Screen","Reflect","Metronome","Swift","Rest","Rock Slide","Substitute","Thief","Reversal","Protect","Endure","Sleep Talk","Baton Pass","Rain Dance","Sunny Day","Shadow Ball","Facade","Taunt","Helping Hand","Trick","Brick Break","Skill Swap","Imprison","Rock Tomb","Aerial Ace","Bulk Up","Calm Mind","Close Combat","Fling","Aura Sphere","Poison Jab","Drain Punch","Focus Blast","Energy Ball","Giga Impact","Zen Headbutt","Trick Room","Grass Knot","Psyshock","Low Sweep","Stored Power","Psychic Terrain","Tera Blast","Trailblaze","Gravity","Vacuum Wave","Focus Punch","Pain Split","Psych Up","Expanding Force","Upper Hand"],
    egg: [],
    max: []
  },
  309: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Thunder Wave"},{level:4,move:"Leer"},{level:8,move:"Howl"},{level:12,move:"Quick Attack"},{level:16,move:"Shock Wave"},{level:20,move:"Bite"},{level:24,move:"Thunder Fang"},{level:28,move:"Roar"},{level:32,move:"Discharge"},{level:36,move:"Charge"},{level:40,move:"Wild Charge"},{level:44,move:"Thunder"}],
    tm: ["Roar","Flamethrower","Strength","Thunderbolt","Thunder Wave","Thunder","Double Team","Light Screen","Flash","Rest","Substitute","Thief","Protect","Endure","Swagger","Attract","Sleep Talk","Iron Tail","Rain Dance","Facade","Shock Wave","Charge Beam","Volt Switch","Snarl"],
    egg: ["Headbutt","Swift","Curse","Spark","Crunch","Uproar","Switcheroo","Thunder Fang","Ice Fang","Fire Fang","Discharge","Electro Ball","Eerie Impulse"],
    max: []
  },
  310: {
    levelUp: [{level:1,move:"Fire Fang"},{level:1,move:"Howl"},{level:1,move:"Leer"},{level:1,move:"Tackle"},{level:1,move:"Thunder Wave"},{level:12,move:"Quick Attack"},{level:16,move:"Shock Wave"},{level:20,move:"Bite"},{level:24,move:"Thunder Fang"},{level:30,move:"Roar"},{level:36,move:"Discharge"},{level:42,move:"Charge"},{level:48,move:"Wild Charge"},{level:54,move:"Thunder"},{level:60,move:"Electric Terrain"}],
    tm: ["Roar","Flamethrower","Hyper Beam","Strength","Thunderbolt","Thunder Wave","Thunder","Double Team","Light Screen","Flash","Rest","Substitute","Thief","Protect","Endure","Swagger","Attract","Sleep Talk","Iron Tail","Rain Dance","Facade","Overheat","Shock Wave","Giga Impact","Charge Beam","Volt Switch","Snarl"],
    egg: [],
    max: []
  },
  311: {
    levelUp: [{level:1,move:"Quick Attack"},{level:1,move:"Play Nice"},{level:1,move:"Growl"},{level:1,move:"Thunder Wave"},{level:4,move:"Helping Hand"},{level:7,move:"Spark"},{level:10,move:"Encore"},{level:13,move:"Switcheroo"},{level:16,move:"Swift"},{level:19,move:"Electro Ball"},{level:22,move:"Copycat"},{level:26,move:"Charge"},{level:31,move:"Discharge"},{level:34,move:"Baton Pass"},{level:37,move:"Agility"},{level:40,move:"Last Resort"},{level:43,move:"Thunder"},{level:46,move:"Nasty Plot"},{level:49,move:"Entrainment"}],
    tm: ["Thunder Punch","Thunderbolt","Thunder Wave","Thunder","Agility","Light Screen","Swift","Rest","Super Fang","Substitute","Protect","Mud-Slap","Endure","Charm","Sleep Talk","Baton Pass","Encore","Rain Dance","Uproar","Facade","Charge","Helping Hand","Endeavor","Skill Swap","Fake Tears","Fling","Nasty Plot","Grass Knot","Charge Beam","Electro Ball","Volt Switch","Electroweb","Wild Charge","Play Rough","Eerie Impulse","Electric Terrain","Tera Blast","Trailblaze","Alluring Voice"],
    egg: ["Sing","Sweet Kiss","Charm","Wish","Nuzzle"],
    max: []
  },
  312: {
    levelUp: [{level:1,move:"Quick Attack"},{level:1,move:"Play Nice"},{level:1,move:"Growl"},{level:1,move:"Thunder Wave"},{level:4,move:"Helping Hand"},{level:7,move:"Spark"},{level:10,move:"Encore"},{level:13,move:"Switcheroo"},{level:16,move:"Swift"},{level:19,move:"Electro Ball"},{level:22,move:"Copycat"},{level:26,move:"Charge"},{level:31,move:"Discharge"},{level:34,move:"Baton Pass"},{level:37,move:"Agility"},{level:40,move:"Last Resort"},{level:43,move:"Thunder"},{level:46,move:"Nasty Plot"},{level:49,move:"Entrainment"}],
    tm: ["Thunder Punch","Thunderbolt","Thunder Wave","Thunder","Agility","Light Screen","Swift","Rest","Super Fang","Substitute","Protect","Mud-Slap","Endure","Charm","Sleep Talk","Baton Pass","Encore","Rain Dance","Uproar","Facade","Charge","Helping Hand","Endeavor","Fake Tears","Fling","Nasty Plot","Grass Knot","Charge Beam","Electro Ball","Volt Switch","Electroweb","Wild Charge","Play Rough","Electric Terrain","Tera Blast","Trailblaze","Alluring Voice"],
    egg: ["Sing","Sweet Kiss","Charm","Wish","Fake Tears","Nuzzle"],
    max: []
  },
  313: {
    levelUp: [{level:1,move:"Tackle"},{level:5,move:"Double Team"},{level:8,move:"Confuse Ray"},{level:12,move:"Quick Attack"},{level:15,move:"Struggle Bug"},{level:19,move:"Moonlight"},{level:22,move:"Tail Glow"},{level:26,move:"Protect"},{level:29,move:"Zen Headbutt"},{level:33,move:"Helping Hand"},{level:36,move:"Bug Buzz"},{level:40,move:"Play Rough"},{level:43,move:"Double-Edge"},{level:47,move:"Infestation"}],
    tm: ["Ice Punch","Thunder Punch","Body Slam","Take Down","Solar Beam","Thunder Wave","Thunder","Confuse Ray","Light Screen","Metronome","Swift","Rest","Substitute","Thief","Protect","Mud-Slap","Giga Drain","Endure","Sleep Talk","Baton Pass","Encore","Rain Dance","Sunny Day","Shadow Ball","Facade","Focus Punch","Taunt","Helping Hand","Trick","Brick Break","Air Cutter","Aerial Ace","Water Pulse","Tailwind","U-turn","Fling","Air Slash","Bug Buzz","Zen Headbutt","Bug Bite","Charge Beam","Acrobatics","Struggle Bug","Play Rough","Dazzling Gleam","Lunge","Tera Blast","Pounce","Trailblaze","Chilling Water","Double-Edge","Endeavor","Skitter Smack"],
    egg: ["Counter","Seismic Toss","Swagger","Roost"],
    max: []
  },
  314: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Play Nice"},{level:5,move:"Sweet Scent"},{level:9,move:"Charm"},{level:12,move:"Quick Attack"},{level:15,move:"Struggle Bug"},{level:19,move:"Moonlight"},{level:22,move:"Wish"},{level:26,move:"Encore"},{level:29,move:"Flatter"},{level:33,move:"Zen Headbutt"},{level:36,move:"Helping Hand"},{level:40,move:"Bug Buzz"},{level:43,move:"Play Rough"},{level:47,move:"Infestation"}],
    tm: ["Ice Punch","Thunder Punch","Take Down","Solar Beam","Thunderbolt","Thunder Wave","Thunder","Confuse Ray","Light Screen","Metronome","Swift","Rest","Substitute","Thief","Protect","Mud-Slap","Giga Drain","Endure","Charm","Sleep Talk","Baton Pass","Encore","Rain Dance","Sunny Day","Shadow Ball","Facade","Focus Punch","Helping Hand","Trick","Brick Break","Fake Tears","Air Cutter","Aerial Ace","Water Pulse","Tailwind","U-turn","Fling","Air Slash","Bug Buzz","Zen Headbutt","Bug Bite","Charge Beam","Acrobatics","Struggle Bug","Disarming Voice","Draining Kiss","Play Rough","Dazzling Gleam","Tera Blast","Pounce","Trailblaze","Psych Up","Double-Edge","Endeavor","Skitter Smack"],
    egg: ["Growth","Attract","Roost"],
    max: []
  },
  315: {
    levelUp: [{level:1,move:"Poison Sting"},{level:6,move:"Absorb"},{level:11,move:"Poison Powder"},{level:18,move:"Stun Spore"},{level:25,move:"Venoshock"},{level:34,move:"Poison Jab"},{level:43,move:"Energy Ball"},{level:52,move:"Petal Dance"}],
    tm: [],
    egg: [],
    max: []
  },
  316: {
    levelUp: [{level:1,move:"Pound"},{level:5,move:"Yawn"},{level:8,move:"Poison Gas"},{level:10,move:"Sludge"},{level:12,move:"Amnesia"},{level:17,move:"Acid Spray"},{level:20,move:"Encore"},{level:25,move:"Toxic"},{level:28,move:"Stockpile"},{level:28,move:"Spit Up"},{level:28,move:"Swallow"},{level:33,move:"Sludge Bomb"},{level:36,move:"Gastro Acid"},{level:41,move:"Belch"},{level:44,move:"Pain Split"},{level:49,move:"Gunk Shot"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Swords Dance","Body Slam","Take Down","Ice Beam","Solar Beam","Thunder Wave","Amnesia","Rest","Substitute","Thief","Protect","Sludge Bomb","Mud-Slap","Giga Drain","Endure","Sleep Talk","Encore","Rain Dance","Sunny Day","Shadow Ball","Facade","Helping Hand","Bullet Seed","Mud Shot","Water Pulse","Fling","Toxic Spikes","Poison Jab","Seed Bomb","Gunk Shot","Venoshock","Acid Spray","Tera Blast","Toxic","Pain Split","Sludge Wave","Curse"],
    egg: ["Smog","Acid Armor","Curse","Mud-Slap","Destiny Bond","Clear Smog","Stuff Cheeks"],
    max: []
  },
  317: {
    levelUp: [{level:0,move:"Body Slam"},{level:1,move:"Pound"},{level:1,move:"Sludge"},{level:1,move:"Poison Gas"},{level:1,move:"Yawn"},{level:1,move:"Gunk Shot"},{level:12,move:"Amnesia"},{level:17,move:"Acid Spray"},{level:20,move:"Encore"},{level:25,move:"Toxic"},{level:30,move:"Stockpile"},{level:30,move:"Spit Up"},{level:30,move:"Swallow"},{level:37,move:"Sludge Bomb"},{level:42,move:"Gastro Acid"},{level:49,move:"Belch"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Swords Dance","Body Slam","Take Down","Ice Beam","Hyper Beam","Solar Beam","Thunder Wave","Earthquake","Metronome","Amnesia","Rest","Substitute","Thief","Protect","Sludge Bomb","Mud-Slap","Giga Drain","Endure","Sleep Talk","Encore","Rain Dance","Sunny Day","Shadow Ball","Facade","Helping Hand","Brick Break","Bullet Seed","Mud Shot","Water Pulse","Fling","Toxic Spikes","Poison Jab","Seed Bomb","Giga Impact","Zen Headbutt","Gunk Shot","Venoshock","Acid Spray","Bulldoze","Body Press","Tera Blast","Toxic","Knock Off","Pain Split","Double-Edge","Sludge Wave","Curse"],
    egg: [],
    max: []
  },
  318: {
    levelUp: [{level:1,move:"Aqua Jet"},{level:1,move:"Leer"},{level:4,move:"Poison Fang"},{level:8,move:"Focus Energy"},{level:12,move:"Scary Face"},{level:16,move:"Bite"},{level:20,move:"Ice Fang"},{level:24,move:"Screech"},{level:28,move:"Swagger"},{level:32,move:"Crunch"},{level:36,move:"Agility"},{level:40,move:"Liquidation"},{level:44,move:"Take Down"}],
    tm: ["Surf","Ice Beam","Blizzard","Double Team","Waterfall","Rest","Substitute","Thief","Protect","Endure","Swagger","Attract","Sleep Talk","Rain Dance","Hail","Torment","Facade","Taunt","Water Pulse","Brine","Payback","Dark Pulse","Scald","Snarl"],
    egg: ["Thrash","Double-Edge","Hydro Pump","Swift","Destiny Bond","Ancient Power"],
    max: []
  },
  319: {
    levelUp: [{level:0,move:"Slash"},{level:1,move:"Aqua Jet"},{level:1,move:"Focus Energy"},{level:1,move:"Leer"},{level:1,move:"Night Slash"},{level:1,move:"Poison Fang"},{level:1,move:"Slash"},{level:12,move:"Scary Face"},{level:16,move:"Bite"},{level:20,move:"Ice Fang"},{level:24,move:"Screech"},{level:28,move:"Swagger"},{level:34,move:"Crunch"},{level:40,move:"Agility"},{level:46,move:"Liquidation"},{level:52,move:"Take Down"}],
    tm: ["Roar","Surf","Ice Beam","Blizzard","Hyper Beam","Strength","Earthquake","Double Team","Waterfall","Rest","Substitute","Thief","Protect","Endure","Swagger","Attract","Sleep Talk","Rain Dance","Rock Smash","Hail","Torment","Facade","Taunt","Rock Tomb","Water Pulse","Brine","Payback","Poison Jab","Dark Pulse","Giga Impact","Avalanche","Scald","Bulldoze","Snarl"],
    egg: [],
    max: []
  },
  320: {
    levelUp: [{level:1,move:"Splash"},{level:3,move:"Growl"},{level:6,move:"Astonish"},{level:12,move:"Water Gun"},{level:15,move:"Mist"},{level:18,move:"Water Pulse"},{level:21,move:"Heavy Slam"},{level:24,move:"Brine"},{level:27,move:"Whirlpool"},{level:30,move:"Dive"},{level:33,move:"Bounce"},{level:36,move:"Body Slam"},{level:39,move:"Rest"},{level:42,move:"Amnesia"},{level:45,move:"Hydro Pump"},{level:48,move:"Water Spout"}],
    tm: ["Roar","Surf","Ice Beam","Blizzard","Strength","Earthquake","Double Team","Waterfall","Rest","Substitute","Protect","Endure","Swagger","Attract","Sleep Talk","Rain Dance","Rock Smash","Hail","Facade","Rock Tomb","Water Pulse","Brine","Avalanche","Scald","Bulldoze"],
    egg: ["Body Slam","Thrash","Double-Edge","Fissure","Defense Curl","Snore","Curse","Rollout","Tickle","Aqua Ring","Zen Headbutt","Soak","Clear Smog"],
    max: []
  },
  321: {
    levelUp: [{level:1,move:"Astonish"},{level:1,move:"Growl"},{level:1,move:"Noble Roar"},{level:1,move:"Soak"},{level:1,move:"Splash"},{level:1,move:"Water Gun"},{level:15,move:"Mist"},{level:18,move:"Water Pulse"},{level:21,move:"Heavy Slam"},{level:24,move:"Brine"},{level:27,move:"Whirlpool"},{level:30,move:"Dive"},{level:33,move:"Bounce"},{level:36,move:"Body Slam"},{level:39,move:"Rest"},{level:44,move:"Amnesia"},{level:49,move:"Hydro Pump"},{level:54,move:"Water Spout"}],
    tm: ["Roar","Surf","Ice Beam","Blizzard","Hyper Beam","Strength","Earthquake","Double Team","Waterfall","Rest","Substitute","Protect","Endure","Swagger","Attract","Sleep Talk","Rain Dance","Rock Smash","Hail","Facade","Rock Tomb","Water Pulse","Brine","Giga Impact","Avalanche","Scald","Bulldoze"],
    egg: [],
    max: []
  },
  322: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Growl"},{level:5,move:"Ember"},{level:8,move:"Focus Energy"},{level:12,move:"Bulldoze"},{level:15,move:"Incinerate"},{level:19,move:"Amnesia"},{level:22,move:"Lava Plume"},{level:26,move:"Earth Power"},{level:29,move:"Curse"},{level:31,move:"Take Down"},{level:40,move:"Earthquake"},{level:43,move:"Flamethrower"},{level:47,move:"Double-Edge"}],
    tm: ["Body Slam","Take Down","Flamethrower","Fire Spin","Earthquake","Dig","Fire Blast","Amnesia","Rest","Rock Slide","Substitute","Protect","Scary Face","Mud-Slap","Sandstorm","Endure","Charm","Sleep Talk","Rain Dance","Sunny Day","Heat Wave","Will-O-Wisp","Facade","Helping Hand","Overheat","Rock Tomb","Mud Shot","Flare Blitz","Earth Power","Zen Headbutt","Flash Cannon","Iron Head","Stone Edge","Stealth Rock","Heavy Slam","Flame Charge","Bulldoze","Stomping Tantrum","Body Press","Tera Blast","Trailblaze","Roar","High Horsepower","Heat Crash","Lash Out","Double-Edge","Endeavor","Temper Flare","Scorching Sands","Curse"],
    egg: ["Stomp","Body Slam","Growth","Defense Curl","Scary Face","Rollout","Ancient Power","Stockpile","Spit Up","Swallow","Heat Wave","Yawn","Howl","Iron Head","Heavy Slam"],
    max: []
  },
  323: {
    levelUp: [{level:0,move:"Rock Slide"},{level:1,move:"Tackle"},{level:1,move:"Growl"},{level:1,move:"Ember"},{level:1,move:"Fissure"},{level:1,move:"Focus Energy"},{level:1,move:"Eruption"},{level:12,move:"Bulldoze"},{level:15,move:"Incinerate"},{level:19,move:"Amnesia"},{level:22,move:"Lava Plume"},{level:26,move:"Earth Power"},{level:29,move:"Curse"},{level:31,move:"Take Down"},{level:39,move:"Yawn"},{level:46,move:"Earthquake"}],
    tm: ["Body Slam","Take Down","Flamethrower","Hyper Beam","Solar Beam","Fire Spin","Earthquake","Dig","Fire Blast","Amnesia","Rest","Rock Slide","Substitute","Protect","Scary Face","Mud-Slap","Sandstorm","Endure","Charm","Sleep Talk","Rain Dance","Sunny Day","Heat Wave","Will-O-Wisp","Facade","Helping Hand","Overheat","Rock Tomb","Mud Shot","Flare Blitz","Earth Power","Giga Impact","Zen Headbutt","Flash Cannon","Iron Head","Stone Edge","Stealth Rock","Heavy Slam","Flame Charge","Bulldoze","Stomping Tantrum","Body Press","Tera Blast","Trailblaze","Roar","Smack Down","High Horsepower","Heat Crash","Lash Out","Double-Edge","Endeavor","Temper Flare","Scorching Sands","Curse"],
    egg: [],
    max: []
  },
  324: {
    levelUp: [{level:1,move:"Ember"},{level:1,move:"Smog"},{level:4,move:"Withdraw"},{level:8,move:"Rapid Spin"},{level:12,move:"Smokescreen"},{level:16,move:"Clear Smog"},{level:20,move:"Flame Wheel"},{level:24,move:"Protect"},{level:28,move:"Lava Plume"},{level:32,move:"Body Slam"},{level:36,move:"Iron Defense"},{level:40,move:"Flamethrower"},{level:44,move:"Curse"},{level:48,move:"Heat Wave"},{level:52,move:"Amnesia"},{level:56,move:"Inferno"},{level:60,move:"Shell Smash"},{level:64,move:"Eruption"}],
    tm: ["Body Slam","Take Down","Flamethrower","Hyper Beam","Solar Beam","Fire Spin","Earthquake","Fire Blast","Amnesia","Rest","Rock Slide","Substitute","Protect","Sludge Bomb","Sandstorm","Endure","Sleep Talk","Sunny Day","Heat Wave","Will-O-Wisp","Facade","Helping Hand","Overheat","Rock Tomb","Iron Defense","Flare Blitz","Earth Power","Giga Impact","Zen Headbutt","Stone Edge","Stealth Rock","Heavy Slam","Flame Charge","Bulldoze","Stomping Tantrum","Body Press","Tera Blast","Gyro Ball","Heat Crash","Weather Ball","Burning Jealousy","Double-Edge","Temper Flare","Scorching Sands","Curse"],
    egg: ["Fissure","Flail","Ancient Power","Yawn"],
    max: []
  },
  325: {
    levelUp: [{level:1,move:"Splash"},{level:7,move:"Confusion"},{level:10,move:"Growl"},{level:14,move:"Psybeam"},{level:18,move:"Psych Up"},{level:22,move:"Confuse Ray"},{level:29,move:"Rest"},{level:29,move:"Power Gem"},{level:33,move:"Snore"},{level:38,move:"Psyshock"},{level:40,move:"Payback"},{level:44,move:"Psychic"},{level:50,move:"Bounce"}],
    tm: ["Body Slam","Take Down","Psybeam","Thunder Wave","Psychic","Night Shade","Confuse Ray","Light Screen","Reflect","Swift","Amnesia","Rest","Substitute","Thief","Protect","Icy Wind","Endure","Sleep Talk","Encore","Rain Dance","Sunny Day","Shadow Ball","Facade","Taunt","Helping Hand","Trick","Skill Swap","Imprison","Calm Mind","Power Gem","Zen Headbutt","Flash Cannon","Trick Room","Grass Knot","Charge Beam","Psyshock","Stored Power","Snarl","Dazzling Gleam","Psychic Terrain","Tera Blast","Snowscape","Trailblaze","Chilling Water","Lunge","Uproar","Psych Up","Endeavor","Future Sight","Expanding Force"],
    egg: ["Whirlwind","Amnesia","Mirror Coat","Future Sight","Trick","Extrasensory","Zen Headbutt","Simple Beam"],
    max: []
  },
  326: {
    levelUp: [{level:0,move:"Teeter Dance"},{level:1,move:"Psybeam"},{level:1,move:"Confusion"},{level:1,move:"Splash"},{level:1,move:"Belch"},{level:18,move:"Psych Up"},{level:22,move:"Confuse Ray"},{level:26,move:"Zen Headbutt"},{level:29,move:"Power Gem"},{level:35,move:"Rest"},{level:35,move:"Snore"},{level:42,move:"Psyshock"},{level:46,move:"Payback"},{level:52,move:"Psychic"},{level:60,move:"Bounce"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Take Down","Psybeam","Hyper Beam","Low Kick","Thunder Wave","Dig","Psychic","Night Shade","Confuse Ray","Light Screen","Reflect","Metronome","Swift","Amnesia","Rest","Substitute","Thief","Protect","Mud-Slap","Icy Wind","Endure","Sleep Talk","Encore","Rain Dance","Sunny Day","Shadow Ball","Facade","Taunt","Helping Hand","Trick","Brick Break","Skill Swap","Imprison","Hyper Voice","Mud Shot","Calm Mind","Fling","Seed Bomb","Power Gem","Drain Punch","Focus Blast","Energy Ball","Earth Power","Giga Impact","Nasty Plot","Zen Headbutt","Flash Cannon","Trick Room","Grass Knot","Charge Beam","Psyshock","Low Sweep","Stored Power","Bulldoze","Snarl","Dazzling Gleam","Psychic Terrain","Stomping Tantrum","Body Press","Tera Blast","Snowscape","Trailblaze","Chilling Water","Lunge","Uproar","Focus Punch","Psych Up","Endeavor","Future Sight","Expanding Force","Psychic Noise"],
    egg: [],
    max: []
  },
  327: {
    levelUp: [{level:1,move:"Tackle"},{level:5,move:"Copycat"},{level:10,move:"Teeter Dance"},{level:14,move:"Psybeam"},{level:19,move:"Hypnosis"},{level:23,move:"Body Slam"},{level:28,move:"Sucker Punch"},{level:32,move:"Teeter Dance"},{level:37,move:"Uproar"},{level:41,move:"Psych Up"},{level:46,move:"Double-Edge"},{level:50,move:"Flail"},{level:55,move:"Thrash"}],
    tm: ["Strength","Dig","Psychic","Double Team","Dream Eater","Flash","Rest","Rock Slide","Substitute","Thief","Protect","Endure","Swagger","Attract","Sleep Talk","Safeguard","Rain Dance","Sunny Day","Psych Up","Shadow Ball","Rock Smash","Facade","Focus Punch","Recycle","Brick Break","Skill Swap","Rock Tomb","Calm Mind","Shock Wave","Water Pulse","Fling","Drain Punch","Trick Room","Work Up"],
    egg: ["Disable","Icy Wind","Baton Pass","Encore","Rapid Spin","Fake Out","Trick","Role Play","Wish","Fake Tears","Psycho Shift","Psycho Cut","Guard Split"],
    max: []
  },
  328: {
    levelUp: [{level:1,move:"Sand Attack"},{level:1,move:"Astonish"},{level:8,move:"Bite"},{level:12,move:"Mud-Slap"},{level:16,move:"Sand Tomb"},{level:20,move:"Bulldoze"},{level:24,move:"Dig"},{level:28,move:"Crunch"},{level:32,move:"Sandstorm"},{level:36,move:"Earth Power"},{level:40,move:"Earthquake"},{level:44,move:"Superpower"},{level:48,move:"Fissure"}],
    tm: ["Body Slam","Take Down","Hyper Beam","Earthquake","Dig","Rest","Rock Slide","Substitute","Protect","Mud-Slap","Sandstorm","Giga Drain","Endure","Sleep Talk","Sunny Day","Crunch","Facade","Rock Tomb","Sand Tomb","Mud Shot","Earth Power","Stone Edge","Stealth Rock","Bug Bite","Struggle Bug","Bulldoze","Scorching Sands","Tera Blast"],
    egg: ["Gust","Quick Attack","Flail","Fury Cutter","Feint","Bug Bite","First Impression"],
    max: []
  },
  329: {
    levelUp: [{level:0,move:"Dragon Breath"},{level:1,move:"Sand Attack"},{level:1,move:"Bite"},{level:1,move:"Dig"},{level:12,move:"Mud-Slap"},{level:16,move:"Sand Tomb"},{level:20,move:"Dragon Tail"},{level:24,move:"Screech"},{level:28,move:"Bug Buzz"},{level:32,move:"Sandstorm"},{level:38,move:"Earth Power"},{level:44,move:"Earthquake"},{level:50,move:"Uproar"},{level:56,move:"Dragon Rush"},{level:62,move:"Boomburst"}],
    tm: ["Fly","Body Slam","Take Down","Hyper Beam","Solar Beam","Earthquake","Dig","Swift","Rest","Rock Slide","Substitute","Protect","Mud-Slap","Outrage","Sandstorm","Giga Drain","Endure","Sleep Talk","Sunny Day","Crunch","Uproar","Heat Wave","Facade","Air Cutter","Rock Tomb","Sand Tomb","Aerial Ace","Dragon Claw","Mud Shot","Tailwind","U-turn","Air Slash","Bug Buzz","Dragon Pulse","Earth Power","Giga Impact","Draco Meteor","Stone Edge","Stealth Rock","Bug Bite","Struggle Bug","Bulldoze","Dragon Tail","Throat Chop","Dual Wingbeat","Scorching Sands","Tera Blast"],
    egg: ["Gust","Supersonic","Fissure","Quick Attack","Flail","Fury Cutter","Crunch","Superpower","Astonish","Feint","Bug Bite","Bulldoze","First Impression"],
    max: []
  },
  330: {
    levelUp: [{level:0,move:"Dragon Claw"},{level:1,move:"Sand Attack"},{level:1,move:"Supersonic"},{level:1,move:"Dragon Breath"},{level:1,move:"Bulldoze"},{level:12,move:"Mud-Slap"},{level:16,move:"Sand Tomb"},{level:20,move:"Dragon Tail"},{level:24,move:"Screech"},{level:28,move:"Bug Buzz"},{level:32,move:"Sandstorm"},{level:38,move:"Earth Power"},{level:44,move:"Earthquake"},{level:52,move:"Uproar"},{level:60,move:"Dragon Rush"},{level:68,move:"Boomburst"}],
    tm: ["Fire Punch","Thunder Punch","Fly","Body Slam","Take Down","Double-Edge","Flamethrower","Hyper Beam","Solar Beam","Fire Spin","Earthquake","Dig","Agility","Fire Blast","Swift","Rest","Rock Slide","Substitute","Protect","Mud-Slap","Outrage","Sandstorm","Giga Drain","Endure","Sleep Talk","Sunny Day","Crunch","Uproar","Heat Wave","Facade","Helping Hand","Air Cutter","Rock Tomb","Sand Tomb","Aerial Ace","Dragon Claw","Mud Shot","Dragon Dance","Tailwind","U-turn","Air Slash","Bug Buzz","Dragon Pulse","Vacuum Wave","Earth Power","Giga Impact","Draco Meteor","Stone Edge","Stealth Rock","Bug Bite","Struggle Bug","Bulldoze","Dragon Tail","Throat Chop","Breaking Swipe","Scale Shot","Dual Wingbeat","Scorching Sands","Tera Blast","Dragon Cheer","Alluring Voice","Psychic Noise"],
    egg: ["Gust","Bite","Fissure","Dig","Quick Attack","Flail","Fury Cutter","Crunch","Superpower","Astonish","Dragon Dance","Feint","Bug Bite","First Impression"],
    max: []
  },
  331: {
    levelUp: [{level:1,move:"Poison Sting"},{level:1,move:"Leer"},{level:4,move:"Absorb"},{level:7,move:"Growth"},{level:10,move:"Leech Seed"},{level:13,move:"Sand Attack"},{level:16,move:"Bullet Seed"},{level:19,move:"Power Trip"},{level:22,move:"Ingrain"},{level:26,move:"Payback"},{level:30,move:"Spikes"},{level:34,move:"Sucker Punch"},{level:38,move:"Pin Missile"},{level:42,move:"Energy Ball"},{level:46,move:"Cotton Spore"},{level:50,move:"Sandstorm"},{level:54,move:"Destiny Bond"}],
    tm: ["Thunder Punch","Swords Dance","Body Slam","Take Down","Low Kick","Solar Beam","Dig","Swift","Rest","Substitute","Thief","Protect","Scary Face","Spikes","Sandstorm","Giga Drain","Endure","Sleep Talk","Encore","Rain Dance","Sunny Day","Facade","Helping Hand","Brick Break","Bullet Seed","Magical Leaf","Fling","Toxic Spikes","Poison Jab","Dark Pulse","Seed Bomb","Drain Punch","Energy Ball","Nasty Plot","Leaf Storm","Grass Knot","Venoshock","Foul Play","Bulldoze","Grassy Terrain","Tera Blast","Trailblaze","Spite","Focus Punch","Grassy Glide","Endeavor","Skitter Smack","Throat Chop","Curse"],
    egg: ["Disable","Acid","Counter","Teeter Dance","Block","Switcheroo","Belch","Fell Stinger"],
    max: []
  },
  332: {
    levelUp: [{level:0,move:"Spiky Shield"},{level:1,move:"Poison Sting"},{level:1,move:"Leer"},{level:1,move:"Absorb"},{level:1,move:"Growth"},{level:1,move:"Destiny Bond"},{level:10,move:"Leech Seed"},{level:13,move:"Sand Attack"},{level:16,move:"Bullet Seed"},{level:19,move:"Power Trip"},{level:22,move:"Ingrain"},{level:26,move:"Payback"},{level:30,move:"Spikes"},{level:35,move:"Sucker Punch"},{level:38,move:"Pin Missile"},{level:44,move:"Energy Ball"},{level:49,move:"Cotton Spore"},{level:54,move:"Sandstorm"}],
    tm: ["Thunder Punch","Swords Dance","Body Slam","Take Down","Hyper Beam","Low Kick","Solar Beam","Dig","Swift","Rest","Substitute","Thief","Protect","Scary Face","Spikes","Sandstorm","Giga Drain","Endure","Sleep Talk","Encore","Rain Dance","Sunny Day","Shadow Ball","Facade","Taunt","Helping Hand","Brick Break","Bullet Seed","Magical Leaf","Fling","Toxic Spikes","Poison Jab","Dark Pulse","Seed Bomb","Drain Punch","Focus Blast","Energy Ball","Giga Impact","Nasty Plot","Zen Headbutt","Leaf Storm","Grass Knot","Venoshock","Foul Play","Bulldoze","Grassy Terrain","Stomping Tantrum","Tera Blast","Trailblaze","Spite","Knock Off","Lunge","Focus Punch","Grassy Glide","Lash Out","Endeavor","Skitter Smack","Throat Chop","Curse"],
    egg: [],
    max: []
  },
  333: {
    levelUp: [{level:1,move:"Growl"},{level:1,move:"Peck"},{level:4,move:"Disarming Voice"},{level:8,move:"Mist"},{level:12,move:"Fury Attack"},{level:16,move:"Round"},{level:20,move:"Dragon Breath"},{level:24,move:"Safeguard"},{level:28,move:"Sing"},{level:32,move:"Cotton Guard"},{level:36,move:"Take Down"},{level:40,move:"Moonblast"},{level:44,move:"Perish Song"}],
    tm: ["Fly","Body Slam","Take Down","Ice Beam","Solar Beam","Agility","Swift","Rest","Substitute","Thief","Protect","Endure","Sleep Talk","Rain Dance","Sunny Day","Heat Wave","Facade","Helping Hand","Hyper Voice","Aerial Ace","Tailwind","Dragon Pulse","Brave Bird","Acrobatics","Hurricane","Disarming Voice","Play Rough","Dazzling Gleam","Tera Blast","Trailblaze","Haze","Dual Wingbeat","Endeavor","Feather Dance","Dragon Cheer"],
    egg: ["Haze","Feather Dance","Astonish","Roost","Tailwind","Dragon Rush","Defog"],
    max: []
  },
  334: {
    levelUp: [{level:0,move:"Dragon Pulse"},{level:1,move:"Growl"},{level:1,move:"Mist"},{level:1,move:"Peck"},{level:1,move:"Pluck"},{level:1,move:"Disarming Voice"},{level:12,move:"Fury Attack"},{level:16,move:"Round"},{level:20,move:"Dragon Breath"},{level:24,move:"Safeguard"},{level:28,move:"Sing"},{level:32,move:"Cotton Guard"},{level:38,move:"Take Down"},{level:44,move:"Moonblast"},{level:50,move:"Perish Song"},{level:56,move:"Sky Attack"}],
    tm: ["Fly","Body Slam","Take Down","Flamethrower","Ice Beam","Hyper Beam","Solar Beam","Fire Spin","Earthquake","Agility","Fire Blast","Swift","Rest","Substitute","Thief","Protect","Outrage","Endure","Sleep Talk","Rain Dance","Sunny Day","Heat Wave","Will-O-Wisp","Facade","Helping Hand","Hyper Voice","Aerial Ace","Dragon Claw","Dragon Dance","Tailwind","Dragon Pulse","Brave Bird","Giga Impact","Draco Meteor","Acrobatics","Bulldoze","Hurricane","Disarming Voice","Play Rough","Dazzling Gleam","Tera Blast","Snowscape","Trailblaze","Roar","Haze","Weather Ball","Dual Wingbeat","Double-Edge","Endeavor","Feather Dance","Breaking Swipe","Dragon Cheer","Alluring Voice"],
    egg: [],
    max: []
  },
  335: {
    levelUp: [{level:1,move:"Scratch"},{level:1,move:"Leer"},{level:5,move:"Quick Attack"},{level:8,move:"Fury Cutter"},{level:12,move:"Metal Claw"},{level:15,move:"Hone Claws"},{level:19,move:"Slash"},{level:22,move:"Power Trip"},{level:26,move:"Crush Claw"},{level:29,move:"False Swipe"},{level:33,move:"Switcheroo"},{level:36,move:"Detect"},{level:40,move:"X-Scissor"},{level:43,move:"Taunt"},{level:47,move:"Swords Dance"},{level:50,move:"Close Combat"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Swords Dance","Body Slam","Take Down","Flamethrower","Surf","Ice Beam","Blizzard","Hyper Beam","Low Kick","Solar Beam","Thunderbolt","Thunder Wave","Thunder","Dig","Agility","Fire Blast","Swift","Rest","Rock Slide","Substitute","Thief","Reversal","Protect","Icy Wind","Endure","False Swipe","Sleep Talk","Baton Pass","Metal Claw","Rain Dance","Sunny Day","Shadow Ball","Facade","Taunt","Helping Hand","Brick Break","Rock Tomb","Aerial Ace","Close Combat","Fling","Aura Sphere","Poison Jab","Seed Bomb","X-Scissor","Focus Blast","Giga Impact","Shadow Claw","Zen Headbutt","Gunk Shot","Grass Knot","Low Sweep","Tera Blast","Roar","Knock Off","Focus Punch","Double-Edge","Endeavor","Throat Chop","Curse","Upper Hand"],
    egg: ["Double Kick","Disable","Counter","Fury Swipes","Curse","Flail","Belly Drum","Feint","Night Slash","Double Hit","Quick Guard","Final Gambit"],
    max: []
  },
  336: {
    levelUp: [{level:1,move:"Wrap"},{level:1,move:"Swagger"},{level:4,move:"Bite"},{level:6,move:"Lick"},{level:9,move:"Poison Tail"},{level:11,move:"Feint"},{level:14,move:"Screech"},{level:19,move:"Glare"},{level:21,move:"Poison Fang"},{level:24,move:"Venoshock"},{level:29,move:"Gastro Acid"},{level:31,move:"Poison Jab"},{level:34,move:"Haze"},{level:39,move:"Crunch"},{level:41,move:"Belch"},{level:44,move:"Coil"},{level:46,move:"Sludge Bomb"}],
    tm: ["Swords Dance","Body Slam","Take Down","Flamethrower","Hyper Beam","Earthquake","Dig","Rest","Substitute","Thief","Reversal","Protect","Scary Face","Sludge Bomb","Giga Drain","Endure","Sleep Talk","Rain Dance","Sunny Day","Crunch","Facade","Taunt","Helping Hand","Brick Break","Poison Tail","Poison Jab","Dark Pulse","Seed Bomb","X-Scissor","Giga Impact","Thunder Fang","Ice Fang","Fire Fang","Zen Headbutt","Gunk Shot","Iron Head","Venoshock","Acid Spray","Bulldoze","Snarl","Psychic Fangs","Tera Blast","Pounce","Trailblaze","Haze","Toxic","Knock Off","Lash Out","Double-Edge","Endeavor","Sludge Wave","Skitter Smack","Throat Chop","Breaking Swipe","Curse"],
    egg: ["Body Slam","Scary Face","Stockpile","Spit Up","Swallow","Assurance","Night Slash","Switcheroo","Final Gambit"],
    max: []
  },
  337: {
    levelUp: [{level:1,move:"Confusion"},{level:1,move:"Harden"},{level:1,move:"Moonblast"},{level:1,move:"Moonlight"},{level:1,move:"Rock Throw"},{level:1,move:"Tackle"},{level:5,move:"Hypnosis"},{level:10,move:"Rock Polish"},{level:15,move:"Rock Slide"},{level:20,move:"Psyshock"},{level:25,move:"Cosmic Power"},{level:30,move:"Psychic"},{level:35,move:"Stone Edge"},{level:40,move:"Future Sight"},{level:45,move:"Magic Room"},{level:50,move:"Explosion"}],
    tm: ["Ice Beam","Blizzard","Hyper Beam","Earthquake","Psychic","Double Team","Light Screen","Reflect","Dream Eater","Flash","Explosion","Rest","Rock Slide","Substitute","Protect","Sandstorm","Endure","Swagger","Sleep Talk","Safeguard","Rain Dance","Psych Up","Shadow Ball","Hail","Facade","Recycle","Skill Swap","Rock Tomb","Calm Mind","Gyro Ball","Rock Polish","Giga Impact","Nasty Plot","Trick Room","Stone Edge","Stealth Rock","Grass Knot","Charge Beam","Bulldoze"],
    egg: [],
    max: []
  },
  338: {
    levelUp: [{level:1,move:"Confusion"},{level:1,move:"Flare Blitz"},{level:1,move:"Harden"},{level:1,move:"Morning Sun"},{level:1,move:"Rock Throw"},{level:1,move:"Tackle"},{level:5,move:"Hypnosis"},{level:10,move:"Rock Polish"},{level:15,move:"Rock Slide"},{level:20,move:"Zen Headbutt"},{level:25,move:"Cosmic Power"},{level:30,move:"Psychic"},{level:35,move:"Stone Edge"},{level:40,move:"Solar Beam"},{level:45,move:"Wonder Room"},{level:50,move:"Explosion"}],
    tm: ["Swords Dance","Flamethrower","Hyper Beam","Solar Beam","Earthquake","Psychic","Double Team","Light Screen","Reflect","Fire Blast","Dream Eater","Flash","Explosion","Rest","Rock Slide","Substitute","Protect","Sandstorm","Endure","Swagger","Sleep Talk","Safeguard","Rain Dance","Sunny Day","Psych Up","Shadow Ball","Will-O-Wisp","Facade","Recycle","Skill Swap","Overheat","Rock Tomb","Calm Mind","Gyro Ball","Rock Polish","Giga Impact","Trick Room","Stone Edge","Stealth Rock","Grass Knot","Charge Beam","Bulldoze"],
    egg: [],
    max: []
  },
  339: {
    levelUp: [{level:1,move:"Water Gun"},{level:1,move:"Mud-Slap"},{level:6,move:"Rest"},{level:6,move:"Snore"},{level:12,move:"Water Pulse"},{level:18,move:"Amnesia"},{level:24,move:"Aqua Tail"},{level:31,move:"Muddy Water"},{level:36,move:"Earthquake"},{level:42,move:"Future Sight"},{level:48,move:"Fissure"}],
    tm: ["Take Down","Hydro Pump","Surf","Ice Beam","Blizzard","Earthquake","Waterfall","Swift","Amnesia","Rest","Rock Slide","Substitute","Protect","Mud-Slap","Icy Wind","Outrage","Sandstorm","Endure","Sleep Talk","Rain Dance","Sunny Day","Facade","Helping Hand","Rock Tomb","Mud Shot","Dragon Dance","Water Pulse","Earth Power","Zen Headbutt","Stone Edge","Stealth Rock","Bulldoze","Stomping Tantrum","Liquidation","Tera Blast","Chilling Water","High Horsepower","Double-Edge","Whirlpool","Muddy Water","Future Sight"],
    egg: ["Take Down","Thrash","Flail","Spark"],
    max: []
  },
  340: {
    levelUp: [{level:0,move:"Thrash"},{level:1,move:"Water Gun"},{level:1,move:"Rest"},{level:1,move:"Snore"},{level:1,move:"Mud-Slap"},{level:1,move:"Tickle"},{level:1,move:"Zen Headbutt"},{level:1,move:"Belch"},{level:12,move:"Water Pulse"},{level:18,move:"Amnesia"},{level:24,move:"Aqua Tail"},{level:33,move:"Muddy Water"},{level:40,move:"Earthquake"},{level:48,move:"Future Sight"},{level:56,move:"Fissure"}],
    tm: ["Body Slam","Take Down","Hydro Pump","Surf","Ice Beam","Blizzard","Hyper Beam","Earthquake","Waterfall","Swift","Amnesia","Rest","Rock Slide","Substitute","Protect","Scary Face","Mud-Slap","Spikes","Icy Wind","Outrage","Sandstorm","Endure","Sleep Talk","Rain Dance","Sunny Day","Facade","Helping Hand","Rock Tomb","Mud Shot","Dragon Dance","Water Pulse","Earth Power","Giga Impact","Zen Headbutt","Stone Edge","Stealth Rock","Bulldoze","Stomping Tantrum","Liquidation","Tera Blast","Chilling Water","Sand Tomb","High Horsepower","Weather Ball","Double-Edge","Whirlpool","Muddy Water","Future Sight","Curse"],
    egg: [],
    max: []
  },
  341: {
    levelUp: [{level:1,move:"Water Gun"},{level:1,move:"Harden"},{level:4,move:"Leer"},{level:8,move:"Taunt"},{level:12,move:"Bubble Beam"},{level:16,move:"Knock Off"},{level:20,move:"Double Hit"},{level:24,move:"Protect"},{level:28,move:"Night Slash"},{level:32,move:"Razor Shell"},{level:36,move:"Swords Dance"},{level:40,move:"Crunch"},{level:44,move:"Crabhammer"},{level:48,move:"Endeavor"},{level:52,move:"Guillotine"}],
    tm: ["Swords Dance","Body Slam","Take Down","Hydro Pump","Surf","Ice Beam","Blizzard","Dig","Waterfall","Rest","Rock Slide","Substitute","Thief","Protect","Sludge Bomb","Icy Wind","Endure","False Swipe","Sleep Talk","Metal Claw","Rain Dance","Crunch","Facade","Taunt","Brick Break","Knock Off","Rock Tomb","Iron Defense","Mud Shot","Dragon Dance","Water Pulse","Fling","X-Scissor","Liquidation","Tera Blast","Chilling Water","Double-Edge","Endeavor","Whirlpool","Muddy Water"],
    egg: ["Double-Edge","Slash","Metal Claw","Ancient Power","Switcheroo","Aqua Jet"],
    max: []
  },
  342: {
    levelUp: [{level:0,move:"Swift"},{level:1,move:"Leer"},{level:1,move:"Water Gun"},{level:1,move:"Harden"},{level:1,move:"Taunt"},{level:12,move:"Bubble Beam"},{level:16,move:"Knock Off"},{level:20,move:"Double Hit"},{level:24,move:"Protect"},{level:28,move:"Night Slash"},{level:34,move:"Razor Shell"},{level:40,move:"Swords Dance"},{level:46,move:"Crunch"},{level:52,move:"Crabhammer"},{level:58,move:"Endeavor"},{level:64,move:"Guillotine"}],
    tm: ["Swords Dance","Body Slam","Take Down","Hydro Pump","Surf","Ice Beam","Blizzard","Hyper Beam","Dig","Waterfall","Swift","Rest","Rock Slide","Substitute","Thief","Spite","Protect","Scary Face","Sludge Bomb","Icy Wind","Endure","False Swipe","Sleep Talk","Metal Claw","Rain Dance","Crunch","Facade","Taunt","Brick Break","Knock Off","Rock Tomb","Iron Defense","Mud Shot","Dragon Dance","Water Pulse","Close Combat","Fling","Dark Pulse","X-Scissor","Giga Impact","Nasty Plot","Avalanche","Snarl","Liquidation","Lash Out","Tera Blast","Chilling Water","Double-Edge","Endeavor","Whirlpool","Muddy Water","Sludge Wave","Hard Press"],
    egg: ["Double-Edge","Slash","Metal Claw","Ancient Power","Switcheroo","Aqua Jet"],
    max: []
  },
  343: {
    levelUp: [{level:1,move:"Harden"},{level:1,move:"Mud-Slap"},{level:3,move:"Rapid Spin"},{level:6,move:"Confusion"},{level:9,move:"Rock Tomb"},{level:12,move:"Power Trick"},{level:15,move:"Psybeam"},{level:18,move:"Ancient Power"},{level:21,move:"Imprison"},{level:24,move:"Cosmic Power"},{level:27,move:"Extrasensory"},{level:30,move:"Earth Power"},{level:33,move:"Self-Destruct"},{level:36,move:"Guard Split"},{level:36,move:"Power Split"},{level:39,move:"Sandstorm"},{level:42,move:"Explosion"}],
    tm: ["Ice Beam","Solar Beam","Earthquake","Dig","Psychic","Double Team","Light Screen","Reflect","Dream Eater","Flash","Explosion","Rest","Rock Slide","Substitute","Protect","Sandstorm","Endure","Swagger","Sleep Talk","Safeguard","Rain Dance","Sunny Day","Psych Up","Shadow Ball","Facade","Recycle","Skill Swap","Rock Tomb","Calm Mind","Gyro Ball","Rock Polish","Trick Room","Stealth Rock","Grass Knot","Charge Beam","Bulldoze","Dazzling Gleam"],
    egg: [],
    max: []
  },
  344: {
    levelUp: [{level:0,move:"Hyper Beam"},{level:1,move:"Confusion"},{level:1,move:"Harden"},{level:1,move:"Hyper Beam"},{level:1,move:"Mud-Slap"},{level:1,move:"Rapid Spin"},{level:1,move:"Teleport"},{level:9,move:"Rock Tomb"},{level:12,move:"Power Trick"},{level:15,move:"Psybeam"},{level:18,move:"Ancient Power"},{level:21,move:"Imprison"},{level:24,move:"Cosmic Power"},{level:27,move:"Extrasensory"},{level:30,move:"Earth Power"},{level:33,move:"Self-Destruct"},{level:38,move:"Guard Split"},{level:38,move:"Power Split"},{level:43,move:"Sandstorm"},{level:48,move:"Explosion"}],
    tm: ["Ice Beam","Hyper Beam","Strength","Solar Beam","Earthquake","Dig","Psychic","Double Team","Light Screen","Reflect","Dream Eater","Flash","Explosion","Rest","Rock Slide","Substitute","Protect","Sandstorm","Endure","Swagger","Sleep Talk","Safeguard","Rain Dance","Sunny Day","Psych Up","Shadow Ball","Rock Smash","Facade","Recycle","Skill Swap","Rock Tomb","Calm Mind","Gyro Ball","Rock Polish","Giga Impact","Nasty Plot","Trick Room","Stone Edge","Stealth Rock","Grass Knot","Charge Beam","Bulldoze","Dazzling Gleam"],
    egg: [],
    max: []
  },
  345: {
    levelUp: [{level:1,move:"Astonish"},{level:1,move:"Wrap"},{level:4,move:"Acid"},{level:8,move:"Confuse Ray"},{level:12,move:"Ingrain"},{level:16,move:"Ancient Power"},{level:20,move:"Mega Drain"},{level:24,move:"Brine"},{level:28,move:"Amnesia"},{level:32,move:"Gastro Acid"},{level:36,move:"Giga Drain"},{level:41,move:"Spit Up"},{level:41,move:"Stockpile"},{level:41,move:"Swallow"},{level:44,move:"Energy Ball"}],
    tm: ["Swords Dance","Solar Beam","Double Team","Flash","Rest","Rock Slide","Substitute","Protect","Sludge Bomb","Sandstorm","Giga Drain","Endure","Swagger","Attract","Sleep Talk","Sunny Day","Facade","Rock Tomb","Bullet Seed","Brine","Rock Polish","Energy Ball","Stealth Rock","Grass Knot"],
    egg: ["Bind","Mega Drain","Recover","Curse","Mirror Coat","Tickle"],
    max: []
  },
  346: {
    levelUp: [{level:1,move:"Acid"},{level:1,move:"Astonish"},{level:1,move:"Confuse Ray"},{level:1,move:"Leech Seed"},{level:1,move:"Wrap"},{level:12,move:"Ingrain"},{level:16,move:"Ancient Power"},{level:20,move:"Mega Drain"},{level:24,move:"Brine"},{level:28,move:"Amnesia"},{level:32,move:"Gastro Acid"},{level:36,move:"Giga Drain"},{level:43,move:"Spit Up"},{level:43,move:"Stockpile"},{level:43,move:"Swallow"},{level:48,move:"Energy Ball"}],
    tm: ["Swords Dance","Hyper Beam","Strength","Solar Beam","Earthquake","Dig","Double Team","Flash","Rest","Rock Slide","Substitute","Protect","Sludge Bomb","Sandstorm","Giga Drain","Endure","Swagger","Attract","Sleep Talk","Sunny Day","Rock Smash","Facade","Rock Tomb","Bullet Seed","Brine","Rock Polish","Energy Ball","Giga Impact","Stone Edge","Stealth Rock","Grass Knot","Bulldoze"],
    egg: [],
    max: []
  },
  347: {
    levelUp: [{level:1,move:"Fury Cutter"},{level:1,move:"Harden"},{level:4,move:"Water Gun"},{level:8,move:"Smack Down"},{level:12,move:"Metal Claw"},{level:16,move:"Ancient Power"},{level:20,move:"Bug Bite"},{level:24,move:"Brine"},{level:28,move:"Slash"},{level:32,move:"Crush Claw"},{level:36,move:"Rock Blast"},{level:41,move:"Protect"},{level:44,move:"X-Scissor"}],
    tm: ["Swords Dance","Cut","Dig","Double Team","Rest","Rock Slide","Substitute","Protect","Sandstorm","Endure","False Swipe","Swagger","Attract","Sleep Talk","Sunny Day","Rock Smash","Facade","Brick Break","Rock Tomb","Aerial Ace","Water Pulse","Brine","Rock Polish","X-Scissor","Stealth Rock"],
    egg: ["Sand Attack","Screech","Curse","Rapid Spin","Knock Off","Iron Defense","Cross Poison","Aqua Jet"],
    max: []
  },
  348: {
    levelUp: [{level:1,move:"Fury Cutter"},{level:1,move:"Harden"},{level:1,move:"Smack Down"},{level:1,move:"Water Gun"},{level:12,move:"Metal Claw"},{level:16,move:"Ancient Power"},{level:20,move:"Bug Bite"},{level:24,move:"Brine"},{level:28,move:"Slash"},{level:32,move:"Crush Claw"},{level:36,move:"Rock Blast"},{level:43,move:"Protect"},{level:48,move:"X-Scissor"}],
    tm: ["Swords Dance","Cut","Hyper Beam","Strength","Earthquake","Dig","Double Team","Rest","Rock Slide","Substitute","Protect","Sandstorm","Endure","False Swipe","Swagger","Attract","Sleep Talk","Iron Tail","Sunny Day","Rock Smash","Facade","Brick Break","Rock Tomb","Aerial Ace","Water Pulse","Brine","Rock Polish","X-Scissor","Giga Impact","Shadow Claw","Flash Cannon","Stone Edge","Stealth Rock","Bulldoze"],
    egg: [],
    max: []
  },
  349: {
    levelUp: [{level:1,move:"Splash"},{level:15,move:"Tackle"},{level:25,move:"Flail"}],
    tm: ["Surf","Ice Beam","Blizzard","Confuse Ray","Light Screen","Haze","Waterfall","Swift","Rest","Substitute","Protect","Icy Wind","Endure","Sleep Talk","Rain Dance","Facade","Mud Shot","Water Pulse","Dragon Pulse","Scale Shot","Tera Blast","Chilling Water","Double-Edge","Whirlpool","Muddy Water"],
    egg: ["Mist","Hypnosis","Confuse Ray","Haze","Dragon Breath","Mirror Coat","Tickle"],
    max: []
  },
  350: {
    levelUp: [{level:0,move:"Water Pulse"},{level:1,move:"Tackle"},{level:1,move:"Wrap"},{level:1,move:"Water Gun"},{level:1,move:"Splash"},{level:1,move:"Flail"},{level:4,move:"Disarming Voice"},{level:8,move:"Twister"},{level:12,move:"Aqua Ring"},{level:16,move:"Attract"},{level:20,move:"Life Dew"},{level:24,move:"Dragon Tail"},{level:28,move:"Recover"},{level:32,move:"Aqua Tail"},{level:36,move:"Safeguard"},{level:40,move:"Surf"},{level:44,move:"Rain Dance"},{level:48,move:"Coil"},{level:52,move:"Hydro Pump"}],
    tm: ["Body Slam","Take Down","Hydro Pump","Surf","Ice Beam","Blizzard","Hyper Beam","Confuse Ray","Light Screen","Haze","Waterfall","Swift","Rest","Substitute","Protect","Icy Wind","Endure","Sleep Talk","Rain Dance","Facade","Helping Hand","Imprison","Weather Ball","Mud Shot","Dragon Dance","Water Pulse","Dragon Pulse","Giga Impact","Avalanche","Iron Head","Scald","Bulldoze","Dragon Tail","Disarming Voice","Draining Kiss","Scale Shot","Flip Turn","Tera Blast","Chilling Water","Psych Up","Double-Edge","Whirlpool","Muddy Water","Triple Axel","Skitter Smack","Breaking Swipe","Dragon Cheer","Alluring Voice"],
    egg: ["Mist","Hypnosis","Confuse Ray","Haze","Dragon Breath","Mirror Coat","Tickle"],
    max: []
  },
  351: {
    levelUp: [{level:1,move:"Tackle"},{level:10,move:"Ember"},{level:10,move:"Powder Snow"},{level:10,move:"Water Gun"},{level:15,move:"Headbutt"},{level:20,move:"Hail"},{level:20,move:"Rain Dance"},{level:20,move:"Sunny Day"},{level:25,move:"Weather Ball"},{level:35,move:"Blizzard"},{level:35,move:"Fire Blast"},{level:35,move:"Hydro Pump"},{level:45,move:"Hurricane"}],
    tm: ["Flamethrower","Ice Beam","Blizzard","Solar Beam","Thunderbolt","Thunder Wave","Thunder","Double Team","Fire Blast","Flash","Rest","Substitute","Thief","Protect","Sandstorm","Endure","Swagger","Attract","Sleep Talk","Rain Dance","Sunny Day","Psych Up","Shadow Ball","Hail","Facade","Shock Wave","Water Pulse","Energy Ball","Avalanche","Scald","Work Up"],
    egg: ["Disable","Amnesia","Future Sight","Cosmic Power","Guard Swap","Clear Smog","Hex","Reflect Type"],
    max: []
  },
  352: {
    levelUp: [{level:1,move:"Astonish"},{level:1,move:"Lick"},{level:1,move:"Scratch"},{level:1,move:"Tail Whip"},{level:1,move:"Thief"},{level:4,move:"Bind"},{level:7,move:"Shadow Sneak"},{level:10,move:"Feint"},{level:13,move:"Fury Swipes"},{level:16,move:"Disable"},{level:18,move:"Psybeam"},{level:21,move:"Ancient Power"},{level:25,move:"Slash"},{level:30,move:"Detect"},{level:33,move:"Shadow Claw"},{level:38,move:"Screech"},{level:42,move:"Substitute"},{level:46,move:"Sucker Punch"},{level:50,move:"Foul Play"}],
    tm: ["Cut","Flamethrower","Ice Beam","Blizzard","Strength","Solar Beam","Thunderbolt","Thunder Wave","Thunder","Dig","Double Team","Fire Blast","Flash","Rest","Rock Slide","Substitute","Thief","Protect","Endure","Swagger","Attract","Sleep Talk","Iron Tail","Rain Dance","Sunny Day","Psych Up","Shadow Ball","Rock Smash","Facade","Focus Punch","Recycle","Brick Break","Skill Swap","Rock Tomb","Aerial Ace","Shock Wave","Water Pulse","Fling","Drain Punch","Nasty Plot","Shadow Claw","Trick Room","Stealth Rock","Grass Knot","Charge Beam","Work Up"],
    egg: ["Disable","Recover","Fake Out","Trick","Magic Coat","Foul Play","Power-Up Punch"],
    max: []
  },
  353: {
    levelUp: [{level:1,move:"Astonish"},{level:4,move:"Screech"},{level:7,move:"Night Shade"},{level:10,move:"Spite"},{level:16,move:"Will-O-Wisp"},{level:19,move:"Shadow Sneak"},{level:22,move:"Hex"},{level:26,move:"Curse"},{level:30,move:"Shadow Ball"},{level:34,move:"Role Play"},{level:38,move:"Sucker Punch"},{level:42,move:"Trick"},{level:48,move:"Phantom Force"}],
    tm: ["Psybeam","Thunderbolt","Thunder Wave","Thunder","Psychic","Night Shade","Confuse Ray","Metronome","Rest","Substitute","Thief","Protect","Scary Face","Icy Wind","Endure","Sleep Talk","Encore","Rain Dance","Sunny Day","Shadow Ball","Will-O-Wisp","Facade","Taunt","Helping Hand","Trick","Skill Swap","Imprison","Calm Mind","Dark Pulse","Nasty Plot","Trick Room","Gunk Shot","Charge Beam","Foul Play","Hex","Phantom Force","Dazzling Gleam","Tera Blast","Pounce","Spite","Poltergeist","Lash Out","Pain Split","Psych Up","Skitter Smack","Curse"],
    egg: ["Disable","Confuse Ray","Destiny Bond","Imprison","Gunk Shot"],
    max: []
  },
  354: {
    levelUp: [{level:0,move:"Knock Off"},{level:1,move:"Night Shade"},{level:1,move:"Screech"},{level:1,move:"Spite"},{level:16,move:"Will-O-Wisp"},{level:19,move:"Shadow Sneak"},{level:22,move:"Hex"},{level:26,move:"Curse"},{level:30,move:"Shadow Ball"},{level:34,move:"Role Play"},{level:40,move:"Sucker Punch"},{level:46,move:"Trick"},{level:53,move:"Phantom Force"}],
    tm: ["Swords Dance","Psybeam","Hyper Beam","Thunderbolt","Thunder Wave","Thunder","Psychic","Night Shade","Confuse Ray","Metronome","Rest","Substitute","Thief","Protect","Scary Face","Icy Wind","Endure","Sleep Talk","Encore","Rain Dance","Sunny Day","Shadow Ball","Will-O-Wisp","Facade","Taunt","Helping Hand","Trick","Skill Swap","Imprison","Calm Mind","Fling","Dark Pulse","Giga Impact","Nasty Plot","Shadow Claw","Trick Room","Gunk Shot","Charge Beam","Foul Play","Hex","Phantom Force","Dazzling Gleam","Tera Blast","Pounce","Trailblaze","Spite","Knock Off","Burning Jealousy","Poltergeist","Lash Out","Pain Split","Psych Up","Skitter Smack","Throat Chop","Curse"],
    egg: [],
    max: []
  },
  355: {
    levelUp: [{level:1,move:"Leer"},{level:1,move:"Astonish"},{level:4,move:"Disable"},{level:8,move:"Shadow Sneak"},{level:12,move:"Confuse Ray"},{level:16,move:"Night Shade"},{level:20,move:"Payback"},{level:24,move:"Will-O-Wisp"},{level:28,move:"Mean Look"},{level:32,move:"Hex"},{level:36,move:"Curse"},{level:40,move:"Shadow Ball"},{level:44,move:"Future Sight"}],
    tm: ["Ice Beam","Blizzard","Psychic","Night Shade","Confuse Ray","Haze","Leech Life","Rest","Substitute","Thief","Spite","Protect","Icy Wind","Endure","Sleep Talk","Rain Dance","Sunny Day","Shadow Ball","Will-O-Wisp","Facade","Taunt","Helping Hand","Trick","Skill Swap","Imprison","Calm Mind","Gravity","Fling","Dark Pulse","Trick Room","Charge Beam","Hex","Phantom Force","Poltergeist","Tera Blast","Pain Split","Psych Up","Future Sight","Skitter Smack","Curse"],
    egg: ["Haze","Pain Split","Memento"],
    max: []
  },
  356: {
    levelUp: [{level:0,move:"Shadow Punch"},{level:1,move:"Fire Punch"},{level:1,move:"Ice Punch"},{level:1,move:"Thunder Punch"},{level:1,move:"Bind"},{level:1,move:"Leer"},{level:1,move:"Disable"},{level:1,move:"Shadow Sneak"},{level:1,move:"Gravity"},{level:1,move:"Astonish"},{level:12,move:"Confuse Ray"},{level:16,move:"Night Shade"},{level:20,move:"Payback"},{level:24,move:"Will-O-Wisp"},{level:28,move:"Mean Look"},{level:32,move:"Hex"},{level:36,move:"Curse"},{level:42,move:"Shadow Ball"},{level:48,move:"Future Sight"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Ice Beam","Blizzard","Hyper Beam","Psychic","Night Shade","Confuse Ray","Haze","Metronome","Leech Life","Rest","Substitute","Thief","Spite","Protect","Icy Wind","Endure","Sleep Talk","Rain Dance","Sunny Day","Shadow Ball","Will-O-Wisp","Facade","Focus Punch","Taunt","Helping Hand","Trick","Brick Break","Skill Swap","Imprison","Calm Mind","Gravity","Fling","Dark Pulse","Giga Impact","Trick Room","Charge Beam","Hex","Phantom Force","Poltergeist","Tera Blast","Pain Split","Psych Up","Future Sight","Skitter Smack","Curse"],
    egg: ["Haze","Pain Split","Memento"],
    max: []
  },
  357: {
    levelUp: [{level:1,move:"Gust"},{level:1,move:"Leer"},{level:1,move:"Growth"},{level:1,move:"Razor Leaf"},{level:1,move:"Leaf Storm"},{level:6,move:"Sweet Scent"},{level:10,move:"Stomp"},{level:16,move:"Magical Leaf"},{level:21,move:"Whirlwind"},{level:30,move:"Wide Guard"},{level:36,move:"Air Slash"},{level:41,move:"Body Slam"},{level:46,move:"Outrage"},{level:50,move:"Synthesis"},{level:56,move:"Solar Beam"}],
    tm: ["Swords Dance","Fly","Body Slam","Take Down","Hyper Beam","Solar Beam","Earthquake","Rest","Substitute","Protect","Outrage","Giga Drain","Endure","Sleep Talk","Rain Dance","Sunny Day","Facade","Helping Hand","Air Cutter","Bullet Seed","Aerial Ace","Magical Leaf","Dragon Dance","Tailwind","U-turn","Seed Bomb","Air Slash","Dragon Pulse","Energy Ball","Giga Impact","Zen Headbutt","Leaf Storm","Grass Knot","Bulldoze","Dragon Tail","Hurricane","Grassy Terrain","Stomping Tantrum","Body Press","Tera Blast","Trailblaze","Roar","Spite","Solar Blade","Dual Wingbeat","Double-Edge","Petal Blizzard","Curse"],
    egg: ["Slam","Headbutt","Leech Seed","Curse","Leaf Blade","Dragon Dance"],
    max: []
  },
  358: {
    levelUp: [{level:1,move:"Wrap"},{level:1,move:"Growl"},{level:1,move:"Confusion"},{level:1,move:"Astonish"},{level:1,move:"Healing Wish"},{level:13,move:"Yawn"},{level:16,move:"Stored Power"},{level:19,move:"Take Down"},{level:22,move:"Extrasensory"},{level:27,move:"Heal Bell"},{level:32,move:"Uproar"},{level:37,move:"Safeguard"},{level:42,move:"Double-Edge"},{level:47,move:"Heal Pulse"}],
    tm: ["Take Down","Psybeam","Thunder Wave","Psychic","Light Screen","Reflect","Swift","Rest","Substitute","Protect","Icy Wind","Endure","Charm","Sleep Talk","Baton Pass","Encore","Rain Dance","Sunny Day","Shadow Ball","Uproar","Facade","Taunt","Helping Hand","Trick","Knock Off","Skill Swap","Imprison","Hyper Voice","Fake Tears","Calm Mind","Gravity","Energy Ball","Zen Headbutt","Trick Room","Grass Knot","Charge Beam","Psyshock","Stored Power","Snarl","Disarming Voice","Draining Kiss","Dazzling Gleam","Tera Blast","Psych Up","Double-Edge","Future Sight","Expanding Force","Curse","Psychic Noise"],
    egg: ["Disable","Hypnosis","Recover","Curse","Wish","Recycle","Cosmic Power","Ally Switch"],
    max: []
  },
  359: {
    levelUp: [{level:1,move:"Leer"},{level:1,move:"Quick Attack"},{level:5,move:"Double Team"},{level:10,move:"Knock Off"},{level:15,move:"Detect"},{level:20,move:"Taunt"},{level:25,move:"Slash"},{level:30,move:"Night Slash"},{level:35,move:"Focus Energy"},{level:40,move:"Sucker Punch"},{level:45,move:"Swords Dance"},{level:50,move:"Future Sight"},{level:55,move:"Perish Song"}],
    tm: ["Swords Dance","Cut","Flamethrower","Ice Beam","Blizzard","Hyper Beam","Strength","Thunderbolt","Thunder Wave","Thunder","Double Team","Fire Blast","Dream Eater","Flash","Rest","Rock Slide","Substitute","Thief","Protect","Sandstorm","Endure","False Swipe","Swagger","Attract","Sleep Talk","Iron Tail","Rain Dance","Sunny Day","Psych Up","Shadow Ball","Rock Smash","Hail","Torment","Will-O-Wisp","Facade","Taunt","Rock Tomb","Aerial Ace","Calm Mind","Shock Wave","Water Pulse","Payback","Dark Pulse","X-Scissor","Giga Impact","Shadow Claw","Stone Edge","Charge Beam","Snarl"],
    egg: ["Double-Edge","Bite","Curse","Perish Song","Mean Look","Megahorn","Baton Pass","Magic Coat","Feint","Assurance","Sucker Punch","Zen Headbutt","Hex","Play Rough"],
    max: []
  },
  360: {
    levelUp: [{level:1,move:"Amnesia"},{level:1,move:"Charm"},{level:1,move:"Counter"},{level:1,move:"Destiny Bond"},{level:1,move:"Encore"},{level:1,move:"Mirror Coat"},{level:1,move:"Safeguard"},{level:1,move:"Splash"}],
    tm: ["Safeguard"],
    egg: [],
    max: []
  },
  361: {
    levelUp: [{level:1,move:"Headbutt"},{level:1,move:"Powder Snow"},{level:1,move:"Astonish"},{level:5,move:"Leer"},{level:10,move:"Double Team"},{level:15,move:"Ice Shard"},{level:20,move:"Protect"},{level:25,move:"Icy Wind"},{level:30,move:"Frost Breath"},{level:35,move:"Bite"},{level:40,move:"Ice Fang"},{level:45,move:"Snowscape"},{level:50,move:"Weather Ball"},{level:55,move:"Crunch"},{level:60,move:"Blizzard"}],
    tm: ["Body Slam","Take Down","Ice Beam","Blizzard","Light Screen","Rest","Substitute","Protect","Spikes","Icy Wind","Endure","Sleep Talk","Rain Dance","Crunch","Shadow Ball","Facade","Helping Hand","Fake Tears","Water Pulse","Avalanche","Ice Fang","Hex","Tera Blast","Ice Spinner","Snowscape","Trailblaze","Chilling Water","Spite","Icicle Spear","Weather Ball"],
    egg: ["Disable","Rollout","Block","Switcheroo","Icicle Crash"],
    max: []
  },
  362: {
    levelUp: [{level:0,move:"Freeze-Dry"},{level:1,move:"Headbutt"},{level:1,move:"Leer"},{level:1,move:"Double Team"},{level:1,move:"Powder Snow"},{level:1,move:"Astonish"},{level:1,move:"Sheer Cold"},{level:15,move:"Ice Shard"},{level:20,move:"Protect"},{level:25,move:"Icy Wind"},{level:30,move:"Frost Breath"},{level:35,move:"Bite"},{level:40,move:"Ice Fang"},{level:47,move:"Snowscape"},{level:54,move:"Weather Ball"},{level:61,move:"Crunch"},{level:68,move:"Blizzard"}],
    tm: ["Body Slam","Take Down","Ice Beam","Blizzard","Hyper Beam","Earthquake","Light Screen","Rest","Substitute","Protect","Scary Face","Spikes","Icy Wind","Endure","Sleep Talk","Rain Dance","Crunch","Shadow Ball","Facade","Taunt","Helping Hand","Fake Tears","Water Pulse","Dark Pulse","Giga Impact","Avalanche","Ice Fang","Iron Head","Foul Play","Hex","Bulldoze","Tera Blast","Ice Spinner","Snowscape","Trailblaze","Chilling Water","Spite","Gyro Ball","Icicle Spear","Weather Ball"],
    egg: [],
    max: []
  },
  363: {
    levelUp: [{level:1,move:"Rollout"},{level:6,move:"Powder Snow"},{level:11,move:"Water Pulse"},{level:18,move:"Rest"},{level:25,move:"Liquidation"},{level:34,move:"Ice Beam"},{level:43,move:"Blizzard"}],
    tm: [],
    egg: [],
    max: []
  },
  364: {
    levelUp: [{level:1,move:"Rollout"},{level:6,move:"Powder Snow"},{level:11,move:"Water Pulse"},{level:18,move:"Rest"},{level:25,move:"Liquidation"},{level:34,move:"Ice Beam"},{level:43,move:"Blizzard"}],
    tm: [],
    egg: [],
    max: []
  },
  365: {
    levelUp: [{level:1,move:"Rollout"},{level:6,move:"Powder Snow"},{level:11,move:"Water Pulse"},{level:18,move:"Rest"},{level:25,move:"Liquidation"},{level:34,move:"Ice Beam"},{level:43,move:"Blizzard"}],
    tm: [],
    egg: [],
    max: []
  },
  366: {
    levelUp: [{level:1,move:"Iron Defense"},{level:1,move:"Water Gun"},{level:1,move:"Whirlpool"},{level:50,move:"Shell Smash"}],
    tm: ["Surf","Ice Beam","Blizzard","Double Team","Waterfall","Rest","Substitute","Protect","Endure","Swagger","Attract","Sleep Talk","Rain Dance","Hail","Facade","Water Pulse","Brine","Scald"],
    egg: ["Body Slam","Supersonic","Confuse Ray","Muddy Water","Aqua Ring"],
    max: []
  },
  367: {
    levelUp: [{level:1,move:"Bite"},{level:1,move:"Iron Defense"},{level:1,move:"Shell Smash"},{level:1,move:"Water Gun"},{level:1,move:"Whirlpool"},{level:5,move:"Screech"},{level:9,move:"Scary Face"},{level:11,move:"Rain Dance"},{level:14,move:"Water Pulse"},{level:16,move:"Ice Fang"},{level:19,move:"Brine"},{level:23,move:"Sucker Punch"},{level:26,move:"Dive"},{level:29,move:"Baton Pass"},{level:34,move:"Crunch"},{level:39,move:"Aqua Tail"},{level:45,move:"Coil"},{level:50,move:"Hydro Pump"}],
    tm: ["Surf","Ice Beam","Blizzard","Hyper Beam","Double Team","Waterfall","Rest","Substitute","Protect","Endure","Swagger","Attract","Sleep Talk","Rain Dance","Hail","Facade","Rock Tomb","Water Pulse","Brine","Giga Impact","Scald"],
    egg: [],
    max: []
  },
  368: {
    levelUp: [{level:1,move:"Confusion"},{level:1,move:"Iron Defense"},{level:1,move:"Shell Smash"},{level:1,move:"Water Gun"},{level:1,move:"Whirlpool"},{level:5,move:"Rain Dance"},{level:9,move:"Agility"},{level:11,move:"Draining Kiss"},{level:14,move:"Water Pulse"},{level:16,move:"Amnesia"},{level:19,move:"Aqua Ring"},{level:23,move:"Safeguard"},{level:26,move:"Dive"},{level:29,move:"Baton Pass"},{level:34,move:"Psychic"},{level:39,move:"Aqua Tail"},{level:45,move:"Coil"},{level:50,move:"Hydro Pump"}],
    tm: ["Surf","Ice Beam","Blizzard","Hyper Beam","Psychic","Double Team","Waterfall","Rest","Substitute","Protect","Endure","Swagger","Attract","Sleep Talk","Safeguard","Rain Dance","Psych Up","Shadow Ball","Hail","Facade","Water Pulse","Brine","Giga Impact","Scald"],
    egg: [],
    max: []
  },
  369: {
    levelUp: [{level:1,move:"Harden"},{level:1,move:"Tackle"},{level:5,move:"Water Gun"},{level:10,move:"Ancient Power"},{level:15,move:"Yawn"},{level:20,move:"Dive"},{level:25,move:"Take Down"},{level:30,move:"Aqua Tail"},{level:35,move:"Rest"},{level:40,move:"Flail"},{level:45,move:"Hydro Pump"},{level:50,move:"Double-Edge"},{level:55,move:"Head Smash"}],
    tm: ["Surf","Ice Beam","Blizzard","Hyper Beam","Earthquake","Double Team","Waterfall","Rest","Rock Slide","Substitute","Protect","Sandstorm","Endure","Swagger","Attract","Sleep Talk","Safeguard","Rain Dance","Psych Up","Rock Smash","Hail","Facade","Rock Tomb","Calm Mind","Water Pulse","Brine","Rock Polish","Giga Impact","Stone Edge","Stealth Rock","Scald","Bulldoze"],
    egg: ["Skull Bash","Amnesia","Snore","Mud-Slap","Muddy Water","Mud Shot","Aqua Tail","Zen Headbutt"],
    max: []
  },
  370: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Charm"},{level:4,move:"Water Gun"},{level:7,move:"Agility"},{level:13,move:"Wish"},{level:17,move:"Water Pulse"},{level:20,move:"Attract"},{level:22,move:"Draining Kiss"},{level:26,move:"Flail"},{level:31,move:"Sweet Kiss"},{level:34,move:"Take Down"},{level:37,move:"Baby-Doll Eyes"},{level:40,move:"Aqua Ring"},{level:42,move:"Soak"},{level:46,move:"Hydro Pump"},{level:49,move:"Safeguard"}],
    tm: ["Take Down","Hydro Pump","Surf","Ice Beam","Blizzard","Agility","Waterfall","Rest","Substitute","Protect","Icy Wind","Endure","Charm","Sleep Talk","Rain Dance","Facade","Water Pulse","Draining Kiss","Liquidation","Tera Blast","Snowscape","Flip Turn","Scale Shot","Psych Up","Endeavor","Whirlpool"],
    egg: ["Supersonic","Splash","Aqua Jet","Entrainment"],
    max: []
  },
  371: {
    levelUp: [{level:1,move:"Leer"},{level:1,move:"Ember"},{level:5,move:"Bite"},{level:10,move:"Dragon Breath"},{level:15,move:"Headbutt"},{level:20,move:"Scary Face"},{level:25,move:"Crunch"},{level:31,move:"Dragon Claw"},{level:35,move:"Zen Headbutt"},{level:40,move:"Focus Energy"},{level:45,move:"Flamethrower"},{level:50,move:"Outrage"},{level:55,move:"Double-Edge"}],
    tm: ["Body Slam","Take Down","Flamethrower","Hydro Pump","Fire Spin","Fire Blast","Rest","Rock Slide","Substitute","Protect","Scary Face","Mud-Slap","Outrage","Endure","Sleep Talk","Rain Dance","Sunny Day","Crunch","Facade","Helping Hand","Brick Break","Hyper Voice","Rock Tomb","Iron Defense","Dragon Claw","Dragon Dance","Dragon Pulse","Shadow Claw","Thunder Fang","Fire Fang","Zen Headbutt","Draco Meteor","Iron Head","Dragon Tail","Tera Blast","Roar","Double-Edge","Dragon Cheer"],
    egg: ["Thrash","Defense Curl","Twister","Dragon Rush"],
    max: []
  },
  372: {
    levelUp: [{level:0,move:"Protect"},{level:1,move:"Leer"},{level:1,move:"Bite"},{level:1,move:"Ember"},{level:1,move:"Dragon Breath"},{level:15,move:"Headbutt"},{level:20,move:"Scary Face"},{level:25,move:"Crunch"},{level:33,move:"Dragon Claw"},{level:39,move:"Zen Headbutt"},{level:46,move:"Focus Energy"},{level:53,move:"Flamethrower"},{level:60,move:"Outrage"},{level:67,move:"Double-Edge"}],
    tm: ["Body Slam","Take Down","Flamethrower","Hydro Pump","Fire Spin","Fire Blast","Rest","Rock Slide","Substitute","Protect","Scary Face","Mud-Slap","Outrage","Endure","Sleep Talk","Rain Dance","Sunny Day","Crunch","Facade","Helping Hand","Brick Break","Hyper Voice","Rock Tomb","Iron Defense","Dragon Claw","Dragon Dance","Dragon Pulse","Shadow Claw","Thunder Fang","Fire Fang","Zen Headbutt","Draco Meteor","Iron Head","Dragon Tail","Tera Blast","Roar","Double-Edge","Temper Flare","Dragon Cheer"],
    egg: [],
    max: []
  },
  373: {
    levelUp: [{level:0,move:"Fly"},{level:1,move:"Roost"},{level:1,move:"Dragon Breath"},{level:1,move:"Dragon Tail"},{level:1,move:"Ember"},{level:1,move:"Dual Wingbeat"},{level:1,move:"Leer"},{level:1,move:"Bite"},{level:1,move:"Protect"},{level:15,move:"Headbutt"},{level:20,move:"Scary Face"},{level:25,move:"Crunch"},{level:33,move:"Dragon Claw"},{level:39,move:"Zen Headbutt"},{level:46,move:"Focus Energy"},{level:55,move:"Flamethrower"},{level:73,move:"Double-Edge"}],
    tm: ["Fly","Body Slam","Take Down","Flamethrower","Hydro Pump","Hyper Beam","Fire Spin","Earthquake","Fire Blast","Swift","Rest","Rock Slide","Substitute","Protect","Scary Face","Mud-Slap","Outrage","Endure","Sleep Talk","Rain Dance","Sunny Day","Crunch","Heat Wave","Facade","Helping Hand","Brick Break","Hyper Voice","Rock Tomb","Aerial Ace","Iron Defense","Dragon Claw","Dragon Dance","Tailwind","Air Slash","Dragon Pulse","Giga Impact","Shadow Claw","Thunder Fang","Fire Fang","Zen Headbutt","Draco Meteor","Iron Head","Stone Edge","Bulldoze","Dragon Tail","Hurricane","Psychic Fangs","Tera Blast","Roar","Dual Wingbeat","Double-Edge","Temper Flare","Breaking Swipe","Dragon Cheer"],
    egg: [],
    max: []
  },
  374: {
    levelUp: [{level:1,move:"Tackle"}],
    tm: ["Take Down","Iron Defense","Zen Headbutt","Iron Head","Steel Beam","Tera Blast"],
    egg: [],
    max: []
  },
  375: {
    levelUp: [{level:0,move:"Confusion"},{level:0,move:"Metal Claw"},{level:1,move:"Tackle"},{level:1,move:"Bullet Punch"},{level:1,move:"Hone Claws"},{level:6,move:"Zen Headbutt"},{level:12,move:"Magnet Rise"},{level:18,move:"Flash Cannon"},{level:26,move:"Take Down"},{level:34,move:"Psychic"},{level:42,move:"Scary Face"},{level:50,move:"Meteor Mash"},{level:58,move:"Iron Defense"},{level:66,move:"Agility"},{level:74,move:"Hyper Beam"}],
    tm: ["Ice Punch","Thunder Punch","Body Slam","Take Down","Double-Edge","Hyper Beam","Earthquake","Psychic","Agility","Light Screen","Reflect","Swift","Rest","Rock Slide","Substitute","Protect","Scary Face","Sludge Bomb","Icy Wind","Sandstorm","Endure","Sleep Talk","Metal Claw","Rain Dance","Sunny Day","Psych Up","Shadow Ball","Future Sight","Facade","Focus Punch","Trick","Brick Break","Rock Tomb","Aerial Ace","Iron Defense","Gravity","Gyro Ball","Giga Impact","Zen Headbutt","Flash Cannon","Iron Head","Stealth Rock","Grass Knot","Psyshock","Heavy Slam","Bulldoze","Steel Beam","Expanding Force","Meteor Beam","Tera Blast","Trailblaze","Hard Press","Psychic Noise"],
    egg: [],
    max: []
  },
  376: {
    levelUp: [{level:0,move:"Hammer Arm"},{level:1,move:"Tackle"},{level:1,move:"Confusion"},{level:1,move:"Metal Claw"},{level:1,move:"Bullet Punch"},{level:6,move:"Zen Headbutt"},{level:12,move:"Magnet Rise"},{level:16,move:"Flash Cannon"},{level:26,move:"Take Down"},{level:34,move:"Psychic"},{level:42,move:"Scary Face"},{level:52,move:"Meteor Mash"},{level:62,move:"Iron Defense"},{level:72,move:"Agility"},{level:82,move:"Hyper Beam"}],
    tm: ["Ice Punch","Thunder Punch","Body Slam","Take Down","Double-Edge","Hyper Beam","Earthquake","Psychic","Agility","Light Screen","Reflect","Swift","Rest","Rock Slide","Substitute","Protect","Scary Face","Sludge Bomb","Mud-Slap","Icy Wind","Sandstorm","Endure","Sleep Talk","Metal Claw","Rain Dance","Sunny Day","Psych Up","Shadow Ball","Future Sight","Facade","Focus Punch","Trick","Brick Break","Knock Off","Rock Tomb","Aerial Ace","Iron Defense","Gravity","Gyro Ball","Giga Impact","Shadow Claw","Zen Headbutt","Flash Cannon","Iron Head","Stone Edge","Stealth Rock","Grass Knot","Psyshock","Heavy Slam","Bulldoze","Psychic Fangs","Stomping Tantrum","Body Press","Steel Beam","Expanding Force","Meteor Beam","Tera Blast","Trailblaze","Hard Press","Psychic Noise"],
    egg: ["Explosion","Hone Claws"],
    max: []
  },
  377: {
    levelUp: [{level:1,move:"Rock Throw"},{level:1,move:"Charge Beam"},{level:6,move:"Bulldoze"},{level:12,move:"Ancient Power"},{level:18,move:"Stomp"},{level:24,move:"Rock Slide"},{level:30,move:"Curse"},{level:36,move:"Iron Defense"},{level:42,move:"Hammer Arm"},{level:48,move:"Stone Edge"},{level:54,move:"Superpower"},{level:60,move:"Lock-On"},{level:66,move:"Zap Cannon"},{level:72,move:"Hyper Beam"},{level:78,move:"Explosion"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Take Down","Double-Edge","Hyper Beam","Thunderbolt","Thunder Wave","Thunder","Earthquake","Dig","Rest","Rock Slide","Substitute","Curse","Protect","Sandstorm","Endure","Sleep Talk","Sunny Day","Facade","Focus Punch","Brick Break","Rock Tomb","Sand Tomb","Iron Defense","Rock Blast","Gravity","Fling","Power Gem","Drain Punch","Focus Blast","Earth Power","Giga Impact","Flash Cannon","Iron Head","Stone Edge","Stealth Rock","Charge Beam","Smack Down","Heavy Slam","Bulldoze","Stomping Tantrum","Body Press","Meteor Beam","Tera Blast","Hard Press"],
    egg: [],
    max: []
  },
  378: {
    levelUp: [{level:1,move:"Icy Wind"},{level:1,move:"Charge Beam"},{level:6,move:"Bulldoze"},{level:12,move:"Ancient Power"},{level:18,move:"Stomp"},{level:24,move:"Ice Beam"},{level:30,move:"Curse"},{level:36,move:"Amnesia"},{level:42,move:"Hammer Arm"},{level:48,move:"Blizzard"},{level:54,move:"Superpower"},{level:60,move:"Lock-On"},{level:66,move:"Zap Cannon"},{level:72,move:"Hyper Beam"},{level:78,move:"Explosion"}],
    tm: ["Ice Punch","Thunder Punch","Body Slam","Ice Beam","Blizzard","Hyper Beam","Thunderbolt","Thunder Wave","Thunder","Earthquake","Amnesia","Rest","Rock Slide","Substitute","Curse","Protect","Icy Wind","Endure","Sleep Talk","Rain Dance","Facade","Focus Punch","Brick Break","Rock Tomb","Icicle Spear","Gravity","Fling","Focus Blast","Giga Impact","Avalanche","Flash Cannon","Iron Head","Charge Beam","Heavy Slam","Bulldoze","Stomping Tantrum","Body Press","Tera Blast","Ice Spinner","Snowscape"],
    egg: [],
    max: []
  },
  379: {
    levelUp: [{level:1,move:"Metal Claw"},{level:1,move:"Charge Beam"},{level:6,move:"Bulldoze"},{level:12,move:"Ancient Power"},{level:18,move:"Stomp"},{level:24,move:"Flash Cannon"},{level:24,move:"Iron Head"},{level:30,move:"Curse"},{level:36,move:"Amnesia"},{level:36,move:"Iron Defense"},{level:42,move:"Hammer Arm"},{level:48,move:"Heavy Slam"},{level:54,move:"Superpower"},{level:60,move:"Lock-On"},{level:66,move:"Zap Cannon"},{level:72,move:"Hyper Beam"},{level:78,move:"Explosion"}],
    tm: ["Ice Punch","Thunder Punch","Body Slam","Take Down","Double-Edge","Hyper Beam","Thunderbolt","Thunder Wave","Thunder","Earthquake","Amnesia","Rest","Rock Slide","Substitute","Curse","Protect","Sandstorm","Endure","Sleep Talk","Metal Claw","Rain Dance","Sunny Day","Facade","Focus Punch","Brick Break","Rock Tomb","Metal Sound","Sand Tomb","Iron Defense","Gravity","Fling","Focus Blast","Giga Impact","Shadow Claw","Flash Cannon","Iron Head","Stealth Rock","Charge Beam","Heavy Slam","Bulldoze","Stomping Tantrum","Body Press","Steel Beam","Meteor Beam","Tera Blast","Ice Spinner","Hard Press"],
    egg: [],
    max: []
  },
  380: {
    levelUp: [{level:1,move:"Charm"},{level:1,move:"Stored Power"},{level:5,move:"Helping Hand"},{level:10,move:"Recover"},{level:15,move:"Confusion"},{level:20,move:"Tailwind"},{level:25,move:"Dragon Breath"},{level:30,move:"Wish"},{level:35,move:"Mist Ball"},{level:40,move:"Zen Headbutt"},{level:45,move:"Dragon Pulse"},{level:50,move:"Heal Pulse"},{level:55,move:"Reflect Type"},{level:60,move:"Psychic"},{level:65,move:"Guard Split"},{level:70,move:"Healing Wish"}],
    tm: ["Fly","Body Slam","Take Down","Double-Edge","Roar","Surf","Ice Beam","Hyper Beam","Solar Beam","Thunderbolt","Thunder Wave","Thunder","Earthquake","Psychic","Agility","Light Screen","Reflect","Waterfall","Swift","Rest","Substitute","Protect","Icy Wind","Outrage","Sandstorm","Endure","Charm","Sleep Talk","Baton Pass","Rain Dance","Sunny Day","Psych Up","Shadow Ball","Future Sight","Whirlpool","Facade","Helping Hand","Trick","Weather Ball","Air Cutter","Aerial Ace","Dragon Claw","Calm Mind","Dragon Dance","Water Pulse","Tailwind","Aura Sphere","Air Slash","Dragon Pulse","Energy Ball","Giga Impact","Shadow Claw","Zen Headbutt","Draco Meteor","Grass Knot","Charge Beam","Psyshock","Stored Power","Bulldoze","Disarming Voice","Draining Kiss","Liquidation","Breaking Swipe","Scale Shot","Dual Wingbeat","Tera Blast","Chilling Water","Dragon Cheer","Alluring Voice"],
    egg: [],
    max: []
  },
  381: {
    levelUp: [{level:1,move:"Dragon Dance"},{level:1,move:"Stored Power"},{level:5,move:"Helping Hand"},{level:10,move:"Recover"},{level:15,move:"Confusion"},{level:20,move:"Tailwind"},{level:25,move:"Dragon Breath"},{level:30,move:"Ally Switch"},{level:35,move:"Luster Purge"},{level:40,move:"Zen Headbutt"},{level:45,move:"Dragon Pulse"},{level:50,move:"Heal Pulse"},{level:55,move:"Simple Beam"},{level:60,move:"Psychic"},{level:65,move:"Power Split"},{level:70,move:"Memento"}],
    tm: ["Fly","Body Slam","Take Down","Double-Edge","Roar","Surf","Ice Beam","Hyper Beam","Solar Beam","Thunderbolt","Thunder Wave","Thunder","Earthquake","Psychic","Agility","Light Screen","Reflect","Waterfall","Swift","Rest","Substitute","Protect","Icy Wind","Outrage","Sandstorm","Endure","Sleep Talk","Baton Pass","Rain Dance","Sunny Day","Psych Up","Shadow Ball","Future Sight","Facade","Helping Hand","Trick","Weather Ball","Air Cutter","Aerial Ace","Dragon Claw","Calm Mind","Dragon Dance","Water Pulse","Tailwind","Aura Sphere","Air Slash","Dragon Pulse","Energy Ball","Giga Impact","Shadow Claw","Zen Headbutt","Draco Meteor","Grass Knot","Charge Beam","Psyshock","Stored Power","Bulldoze","Liquidation","Breaking Swipe","Scale Shot","Flip Turn","Dual Wingbeat","Tera Blast","Chilling Water","Dragon Cheer","Psychic Noise"],
    egg: [],
    max: []
  },
  382: {
    levelUp: [{level:1,move:"Body Slam"},{level:1,move:"Scary Face"},{level:1,move:"Ancient Power"},{level:1,move:"Water Pulse"},{level:1,move:"Origin Pulse"},{level:9,move:"Aqua Tail"},{level:18,move:"Calm Mind"},{level:27,move:"Muddy Water"},{level:36,move:"Ice Beam"},{level:45,move:"Sheer Cold"},{level:54,move:"Aqua Ring"},{level:72,move:"Hydro Pump"},{level:81,move:"Double-Edge"},{level:90,move:"Water Spout"}],
    tm: ["Body Slam","Take Down","Hydro Pump","Surf","Ice Beam","Blizzard","Hyper Beam","Thunderbolt","Thunder Wave","Thunder","Earthquake","Waterfall","Rest","Rock Slide","Substitute","Protect","Scary Face","Icy Wind","Endure","Sleep Talk","Rain Dance","Facade","Helping Hand","Brick Break","Rock Tomb","Calm Mind","Water Pulse","Giga Impact","Avalanche","Iron Head","Heavy Slam","Bulldoze","Liquidation","Tera Blast","Chilling Water","Roar","Double-Edge","Whirlpool","Muddy Water"],
    egg: [],
    max: []
  },
  383: {
    levelUp: [{level:1,move:"Scary Face"},{level:1,move:"Ancient Power"},{level:1,move:"Mud Shot"},{level:1,move:"Lava Plume"},{level:1,move:"Precipice Blades"},{level:9,move:"Earth Power"},{level:18,move:"Bulk Up"},{level:27,move:"Earthquake"},{level:36,move:"Hammer Arm"},{level:45,move:"Fissure"},{level:54,move:"Rest"},{level:72,move:"Fire Blast"},{level:81,move:"Solar Beam"},{level:90,move:"Eruption"}],
    tm: ["Fire Punch","Thunder Punch","Swords Dance","Body Slam","Take Down","Flamethrower","Hyper Beam","Solar Beam","Thunderbolt","Thunder Wave","Thunder","Earthquake","Dig","Fire Blast","Rest","Rock Slide","Substitute","Protect","Scary Face","Mud-Slap","Spikes","Sandstorm","Endure","Sleep Talk","Metal Claw","Sunny Day","Crunch","Heat Wave","Will-O-Wisp","Facade","Helping Hand","Brick Break","Overheat","Rock Tomb","Aerial Ace","Dragon Claw","Bulk Up","Mud Shot","Rock Blast","Fling","Dragon Pulse","Focus Blast","Earth Power","Giga Impact","Shadow Claw","Fire Fang","Zen Headbutt","Iron Head","Stone Edge","Stealth Rock","Heavy Slam","Bulldoze","Stomping Tantrum","Body Press","Tera Blast","Roar","Sand Tomb","Smack Down","High Horsepower","Heat Crash","Focus Punch","Double-Edge","Scorching Sands"],
    egg: [],
    max: []
  },
  384: {
    levelUp: [{level:1,move:"Scary Face"},{level:1,move:"Twister"},{level:1,move:"Ancient Power"},{level:1,move:"Air Slash"},{level:1,move:"Dragon Ascent"},{level:9,move:"Crunch"},{level:18,move:"Dragon Dance"},{level:27,move:"Extreme Speed"},{level:36,move:"Dragon Pulse"},{level:45,move:"Hyper Voice"},{level:54,move:"Rest"},{level:63,move:"Fly"},{level:72,move:"Hurricane"},{level:81,move:"Outrage"},{level:90,move:"Hyper Beam"}],
    tm: ["Swords Dance","Fly","Body Slam","Take Down","Flamethrower","Hydro Pump","Surf","Ice Beam","Blizzard","Hyper Beam","Solar Beam","Thunderbolt","Thunder Wave","Thunder","Earthquake","Fire Blast","Waterfall","Swift","Rest","Rock Slide","Substitute","Protect","Scary Face","Icy Wind","Outrage","Sandstorm","Endure","Sleep Talk","Rain Dance","Sunny Day","Crunch","Facade","Helping Hand","Brick Break","Hyper Voice","Overheat","Rock Tomb","Aerial Ace","Dragon Claw","Bulk Up","Dragon Dance","Tailwind","U-turn","Fling","Air Slash","Dragon Pulse","Focus Blast","Energy Ball","Earth Power","Giga Impact","Avalanche","Shadow Claw","Draco Meteor","Iron Head","Stone Edge","Stealth Rock","Bulldoze","Dragon Tail","Wild Charge","Hurricane","Tera Blast","Roar","Gyro Ball","Scale Shot","Double-Edge","Whirlpool","Meteor Beam","Breaking Swipe","Dragon Cheer"],
    egg: [],
    max: []
  },
  385: {
    levelUp: [{level:1,move:"Confusion"},{level:1,move:"Wish"},{level:7,move:"Swift"},{level:21,move:"Life Dew"},{level:28,move:"Zen Headbutt"},{level:35,move:"Gravity"},{level:42,move:"Psychic"},{level:49,move:"Meteor Mash"},{level:56,move:"Healing Wish"},{level:63,move:"Rest"},{level:70,move:"Future Sight"},{level:77,move:"Double-Edge"},{level:84,move:"Cosmic Power"},{level:91,move:"Last Resort"},{level:98,move:"Doom Desire"}],
    tm: ["Gravity","Fire Punch","Ice Punch","Thunder Punch","Body Slam","Double-Edge","Psybeam","Hyper Beam","Thunderbolt","Thunder Wave","Thunder","Psychic","Confuse Ray","Light Screen","Reflect","Metronome","Swift","Amnesia","Rest","Substitute","Protect","Mud-Slap","Icy Wind","Sandstorm","Endure","Charm","Sleep Talk","Baton Pass","Encore","Rain Dance","Sunny Day","Psych Up","Shadow Ball","Future Sight","Facade","Helping Hand","Trick","Skill Swap","Imprison","Fake Tears","Metal Sound","Iron Defense","Calm Mind","Water Pulse","U-turn","Fling","Aura Sphere","Drain Punch","Energy Ball","Giga Impact","Zen Headbutt","Flash Cannon","Trick Room","Iron Head","Stealth Rock","Grass Knot","Charge Beam","Psyshock","Stored Power","Play Rough","Dazzling Gleam","Steel Beam","Expanding Force","Meteor Beam","Tera Blast","Psychic Noise"],
    egg: [],
    max: []
  },
  386: {
    levelUp: [{level:1,move:"Wrap"},{level:1,move:"Leer"},{level:7,move:"Night Shade"},{level:13,move:"Teleport"},{level:19,move:"Knock Off"},{level:25,move:"Psyshock"},{level:31,move:"Psychic"},{level:37,move:"Gravity"},{level:43,move:"Skill Swap"},{level:49,move:"Zen Headbutt"},{level:55,move:"Cosmic Power"},{level:61,move:"Recover"},{level:67,move:"Psycho Boost"},{level:73,move:"Hyper Beam"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Take Down","Ice Beam","Psybeam","Hyper Beam","Low Kick","Solar Beam","Thunderbolt","Thunder Wave","Thunder","Psychic","Agility","Night Shade","Light Screen","Reflect","Swift","Rest","Rock Slide","Substitute","Protect","Scary Face","Icy Wind","Endure","Sleep Talk","Pain Split","Rain Dance","Sunny Day","Psych Up","Shadow Ball","Future Sight","Facade","Trick","Brick Break","Knock Off","Skill Swap","Imprison","Rock Tomb","Aerial Ace","Calm Mind","Water Pulse","Gravity","Fling","Poison Jab","Dark Pulse","Drain Punch","Focus Blast","Energy Ball","Giga Impact","Nasty Plot","Zen Headbutt","Flash Cannon","Trick Room","Stealth Rock","Grass Knot","Charge Beam","Psyshock","Low Sweep","Stored Power","Throat Chop","Psychic Terrain","Stomping Tantrum","Expanding Force","Meteor Beam","Tera Blast","Psychic Noise"],
    egg: [],
    max: []
  },
  387: {
    levelUp: [{level:1,move:"Tackle"},{level:5,move:"Withdraw"},{level:9,move:"Absorb"},{level:13,move:"Razor Leaf"},{level:17,move:"Curse"},{level:21,move:"Bite"},{level:25,move:"Mega Drain"},{level:29,move:"Leech Seed"},{level:33,move:"Synthesis"},{level:37,move:"Crunch"},{level:41,move:"Giga Drain"},{level:45,move:"Leaf Storm"}],
    tm: ["Swords Dance","Body Slam","Take Down","Roar","Solar Beam","Light Screen","Reflect","Amnesia","Rest","Substitute","Protect","Mud-Slap","Giga Drain","Endure","Sleep Talk","Sunny Day","Crunch","Facade","Sand Tomb","Bullet Seed","Mud Shot","Magical Leaf","Seed Bomb","Energy Ball","Earth Power","Zen Headbutt","Leaf Storm","Iron Head","Stealth Rock","Grass Knot","Smack Down","Heavy Slam","Grass Pledge","Bulldoze","Grassy Terrain","Grassy Glide","Tera Blast","Trailblaze","Double-Edge","Curse"],
    egg: ["Thrash","Double-Edge","Growth","Stockpile","Spit Up","Swallow","Superpower","Tickle","Worry Seed","Wide Guard","Shell Smash"],
    max: []
  },
  388: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Absorb"},{level:1,move:"Withdraw"},{level:13,move:"Razor Leaf"},{level:17,move:"Curse"},{level:22,move:"Bite"},{level:27,move:"Mega Drain"},{level:32,move:"Leech Seed"},{level:37,move:"Synthesis"},{level:42,move:"Crunch"},{level:47,move:"Giga Drain"},{level:52,move:"Leaf Storm"}],
    tm: ["Swords Dance","Body Slam","Take Down","Roar","Solar Beam","Light Screen","Reflect","Amnesia","Rest","Substitute","Protect","Mud-Slap","Giga Drain","Endure","Sleep Talk","Sunny Day","Crunch","Facade","Sand Tomb","Bullet Seed","Mud Shot","Magical Leaf","Seed Bomb","Energy Ball","Earth Power","Zen Headbutt","Leaf Storm","Iron Head","Stealth Rock","Grass Knot","Smack Down","Heavy Slam","Grass Pledge","Bulldoze","Grassy Terrain","Grassy Glide","Tera Blast","Trailblaze","Double-Edge","Curse"],
    egg: ["Thrash","Double-Edge","Growth","Stockpile","Spit Up","Swallow","Superpower","Tickle","Worry Seed","Wide Guard","Shell Smash"],
    max: []
  },
  389: {
    levelUp: [{level:0,move:"Earthquake"},{level:1,move:"Tackle"},{level:1,move:"Absorb"},{level:1,move:"Razor Leaf"},{level:1,move:"Withdraw"},{level:1,move:"Wood Hammer"},{level:17,move:"Curse"},{level:22,move:"Bite"},{level:27,move:"Mega Drain"},{level:33,move:"Leech Seed"},{level:39,move:"Synthesis"},{level:45,move:"Crunch"},{level:51,move:"Giga Drain"},{level:57,move:"Leaf Storm"},{level:63,move:"Headlong Rush"}],
    tm: ["Swords Dance","Body Slam","Take Down","Roar","Hyper Beam","Solar Beam","Earthquake","Light Screen","Reflect","Amnesia","Rest","Rock Slide","Substitute","Protect","Scary Face","Mud-Slap","Outrage","Sandstorm","Giga Drain","Endure","Sleep Talk","Sunny Day","Crunch","Facade","Hyper Voice","Rock Tomb","Sand Tomb","Bullet Seed","Iron Defense","Frenzy Plant","Mud Shot","Magical Leaf","Rock Blast","Seed Bomb","Energy Ball","Earth Power","Giga Impact","Zen Headbutt","Leaf Storm","Iron Head","Stone Edge","Stealth Rock","Grass Knot","Smack Down","Heavy Slam","Grass Pledge","Bulldoze","Grassy Terrain","High Horsepower","Stomping Tantrum","Body Press","Grassy Glide","Tera Blast","Trailblaze","Double-Edge","Curse","Scorching Sands","Hard Press"],
    egg: ["Thrash","Double-Edge","Growth","Stockpile","Spit Up","Swallow","Superpower","Tickle","Worry Seed","Wide Guard","Shell Smash"],
    max: []
  },
  390: {
    levelUp: [{level:1,move:"Scratch"},{level:1,move:"Leer"},{level:7,move:"Ember"},{level:9,move:"Taunt"},{level:15,move:"Fury Swipes"},{level:17,move:"Flame Wheel"},{level:23,move:"Nasty Plot"},{level:25,move:"Torment"},{level:31,move:"Facade"},{level:33,move:"Fire Spin"},{level:39,move:"Acrobatics"},{level:41,move:"Slack Off"},{level:47,move:"Flamethrower"}],
    tm: ["Fire Punch","Thunder Punch","Swords Dance","Take Down","Flamethrower","Low Kick","Fire Spin","Dig","Agility","Metronome","Fire Blast","Swift","Rest","Rock Slide","Substitute","Thief","Protect","Mud-Slap","Endure","Sleep Talk","Encore","Sunny Day","Uproar","Heat Wave","Will-O-Wisp","Facade","Focus Punch","Taunt","Helping Hand","Brick Break","Knock Off","Fake Tears","Overheat","Rock Tomb","Bulk Up","U-turn","Fling","Flare Blitz","Poison Jab","Vacuum Wave","Nasty Plot","Shadow Claw","Zen Headbutt","Gunk Shot","Stealth Rock","Grass Knot","Flame Charge","Low Sweep","Acrobatics","Fire Pledge","Burning Jealousy","Tera Blast","Double-Edge","Psych Up","Endeavor","Temper Flare"],
    egg: ["Fire Punch","Thunder Punch","Double Kick","Counter","Focus Energy","Encore","Fake Out","Heat Wave","Helping Hand","Switcheroo"],
    max: []
  },
  391: {
    levelUp: [{level:0,move:"Mach Punch"},{level:1,move:"Scratch"},{level:1,move:"Leer"},{level:1,move:"Ember"},{level:9,move:"Taunt"},{level:16,move:"Fury Swipes"},{level:19,move:"Flame Wheel"},{level:26,move:"Feint"},{level:29,move:"Torment"},{level:36,move:"Close Combat"},{level:39,move:"Fire Spin"},{level:46,move:"Acrobatics"},{level:49,move:"Slack Off"},{level:56,move:"Flare Blitz"}],
    tm: ["Fire Punch","Thunder Punch","Swords Dance","Take Down","Flamethrower","Low Kick","Fire Spin","Dig","Agility","Metronome","Fire Blast","Swift","Rest","Rock Slide","Substitute","Thief","Reversal","Protect","Mud-Slap","Endure","Sleep Talk","Encore","Sunny Day","Uproar","Heat Wave","Will-O-Wisp","Facade","Focus Punch","Taunt","Helping Hand","Brick Break","Knock Off","Fake Tears","Overheat","Rock Tomb","Bulk Up","U-turn","Close Combat","Fling","Flare Blitz","Poison Jab","Drain Punch","Vacuum Wave","Focus Blast","Nasty Plot","Shadow Claw","Zen Headbutt","Gunk Shot","Stealth Rock","Grass Knot","Smack Down","Flame Charge","Low Sweep","Acrobatics","Fire Pledge","Burning Jealousy","Lash Out","Tera Blast","Double-Edge","Psych Up","Endeavor","Temper Flare","Upper Hand"],
    egg: ["Fire Punch","Thunder Punch","Double Kick","Counter","Focus Energy","Encore","Fake Out","Heat Wave","Helping Hand","Switcheroo"],
    max: []
  },
  392: {
    levelUp: [{level:0,move:"Close Combat"},{level:1,move:"Scratch"},{level:1,move:"Leer"},{level:1,move:"Ember"},{level:1,move:"Mach Punch"},{level:16,move:"Fury Swipes"},{level:19,move:"Flame Wheel"},{level:26,move:"Feint"},{level:29,move:"Torment"},{level:42,move:"Fire Spin"},{level:47,move:"Flare Blitz"},{level:52,move:"Acrobatics"},{level:58,move:"Calm Mind"},{level:65,move:"Raging Fury"}],
    tm: ["Fire Punch","Thunder Punch","Swords Dance","Body Slam","Take Down","Roar","Flamethrower","Hyper Beam","Low Kick","Solar Beam","Fire Spin","Earthquake","Dig","Agility","Metronome","Fire Blast","Swift","Rest","Rock Slide","Substitute","Thief","Reversal","Protect","Scary Face","Mud-Slap","Endure","Sleep Talk","Encore","Sunny Day","Uproar","Heat Wave","Will-O-Wisp","Facade","Focus Punch","Taunt","Helping Hand","Brick Break","Knock Off","Blast Burn","Fake Tears","Overheat","Rock Tomb","Aerial Ace","Bulk Up","Calm Mind","U-turn","Close Combat","Fling","Flare Blitz","Aura Sphere","Poison Jab","Drain Punch","Vacuum Wave","Focus Blast","Giga Impact","Nasty Plot","Shadow Claw","Zen Headbutt","Gunk Shot","Stone Edge","Stealth Rock","Grass Knot","Smack Down","Flame Charge","Low Sweep","Acrobatics","Fire Pledge","Bulldoze","Burning Jealousy","Lash Out","Tera Blast","Double-Edge","Psych Up","Endeavor","Throat Chop","Coaching","Scorching Sands","Temper Flare","Upper Hand"],
    egg: ["Fire Punch","Thunder Punch","Double Kick","Counter","Focus Energy","Encore","Fake Out","Heat Wave","Taunt","Helping Hand","Slack Off","Switcheroo"],
    max: []
  },
  393: {
    levelUp: [{level:1,move:"Pound"},{level:4,move:"Growl"},{level:8,move:"Water Gun"},{level:11,move:"Charm"},{level:15,move:"Peck"},{level:18,move:"Bubble Beam"},{level:22,move:"Swagger"},{level:25,move:"Fury Attack"},{level:29,move:"Brine"},{level:32,move:"Whirlpool"},{level:36,move:"Mist"},{level:39,move:"Drill Peck"},{level:43,move:"Hydro Pump"}],
    tm: ["Hydro Pump","Surf","Ice Beam","Blizzard","Agility","Haze","Waterfall","Swift","Rest","Substitute","Protect","Icy Wind","Endure","Charm","Sleep Talk","Rain Dance","Facade","Helping Hand","Brick Break","Weather Ball","Rock Tomb","Aerial Ace","Water Pulse","Fling","Grass Knot","Water Pledge","Disarming Voice","Liquidation","Flip Turn","Tera Blast","Ice Spinner","Snowscape","Chilling Water","Psych Up","Whirlpool","Feather Dance","Triple Axel"],
    egg: ["Supersonic","Snore","Yawn","Feather Dance","Roost","Aqua Ring","Power Trip"],
    max: []
  },
  394: {
    levelUp: [{level:0,move:"Metal Claw"},{level:1,move:"Tackle"},{level:1,move:"Growl"},{level:1,move:"Water Gun"},{level:15,move:"Peck"},{level:19,move:"Bubble Beam"},{level:24,move:"Swagger"},{level:28,move:"Fury Attack"},{level:33,move:"Brine"},{level:37,move:"Whirlpool"},{level:42,move:"Mist"},{level:46,move:"Drill Peck"},{level:50,move:"Hydro Pump"}],
    tm: ["Take Down","Hydro Pump","Surf","Ice Beam","Blizzard","Agility","Haze","Waterfall","Swift","Rest","Substitute","Protect","Icy Wind","Endure","Charm","Sleep Talk","Metal Claw","Rain Dance","Facade","Helping Hand","Brick Break","Weather Ball","Rock Tomb","Aerial Ace","Water Pulse","Fling","Shadow Claw","Grass Knot","Water Pledge","Disarming Voice","Liquidation","Flip Turn","Tera Blast","Ice Spinner","Snowscape","Chilling Water","Double-Edge","Psych Up","Whirlpool","Feather Dance","Triple Axel"],
    egg: ["Supersonic","Snore","Yawn","Feather Dance","Roost","Aqua Ring","Power Trip"],
    max: []
  },
  395: {
    levelUp: [{level:0,move:"Aqua Jet"},{level:1,move:"Tackle"},{level:1,move:"Growl"},{level:1,move:"Water Gun"},{level:1,move:"Metal Claw"},{level:11,move:"Swords Dance"},{level:15,move:"Peck"},{level:19,move:"Bubble Beam"},{level:24,move:"Swagger"},{level:28,move:"Fury Attack"},{level:33,move:"Brine"},{level:39,move:"Whirlpool"},{level:46,move:"Mist"},{level:52,move:"Drill Peck"},{level:59,move:"Hydro Pump"},{level:66,move:"Wave Crash"}],
    tm: ["Swords Dance","Body Slam","Take Down","Roar","Hydro Pump","Surf","Ice Beam","Blizzard","Hyper Beam","Earthquake","Agility","Haze","Waterfall","Swift","Rest","Rock Slide","Substitute","Protect","Scary Face","Mud-Slap","Icy Wind","Endure","Charm","False Swipe","Sleep Talk","Metal Claw","Rain Dance","Uproar","Facade","Helping Hand","Brick Break","Knock Off","Hydro Cannon","Weather Ball","Air Cutter","Rock Tomb","Aerial Ace","Iron Defense","Water Pulse","Fling","Air Slash","Vacuum Wave","Giga Impact","Avalanche","Shadow Claw","Flash Cannon","Stealth Rock","Grass Knot","Water Pledge","Bulldoze","Disarming Voice","Liquidation","Steel Beam","Lash Out","Flip Turn","Dual Wingbeat","Tera Blast","Ice Spinner","Snowscape","Chilling Water","Double-Edge","Psych Up","Whirlpool","Feather Dance","Metal Sound","Throat Chop","Triple Axel"],
    egg: ["Supersonic","Snore","Yawn","Feather Dance","Roost","Aqua Ring","Power Trip"],
    max: []
  },
  396: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Growl"},{level:5,move:"Quick Attack"},{level:9,move:"Wing Attack"},{level:13,move:"Double Team"},{level:17,move:"Endeavor"},{level:21,move:"Whirlwind"},{level:25,move:"Aerial Ace"},{level:29,move:"Take Down"},{level:33,move:"Agility"},{level:37,move:"Brave Bird"},{level:41,move:"Final Gambit"}],
    tm: ["Fly","Take Down","Agility","Swift","Rest","Substitute","Thief","Protect","Endure","Sleep Talk","Rain Dance","Sunny Day","Heat Wave","Facade","Helping Hand","Air Cutter","Aerial Ace","Tailwind","U-turn","Air Slash","Brave Bird","Acrobatics","Hurricane","Tera Blast","Uproar","Dual Wingbeat","Double-Edge","Endeavor","Feather Dance"],
    egg: ["Sand Attack","Fury Attack","Double-Edge","Uproar","Feather Dance","Astonish"],
    max: []
  },
  397: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Growl"},{level:1,move:"Quick Attack"},{level:9,move:"Wing Attack"},{level:13,move:"Double Team"},{level:18,move:"Endeavor"},{level:23,move:"Whirlwind"},{level:28,move:"Aerial Ace"},{level:33,move:"Take Down"},{level:38,move:"Agility"},{level:43,move:"Brave Bird"},{level:48,move:"Final Gambit"}],
    tm: ["Fly","Take Down","Agility","Swift","Rest","Substitute","Thief","Protect","Endure","Sleep Talk","Rain Dance","Sunny Day","Heat Wave","Facade","Helping Hand","Air Cutter","Aerial Ace","Tailwind","U-turn","Air Slash","Brave Bird","Acrobatics","Hurricane","Tera Blast","Uproar","Dual Wingbeat","Double-Edge","Endeavor","Feather Dance"],
    egg: [],
    max: []
  },
  398: {
    levelUp: [{level:0,move:"Close Combat"},{level:1,move:"Wing Attack"},{level:1,move:"Tackle"},{level:1,move:"Growl"},{level:1,move:"Quick Attack"},{level:13,move:"Double Team"},{level:18,move:"Endeavor"},{level:23,move:"Whirlwind"},{level:28,move:"Aerial Ace"},{level:33,move:"Take Down"},{level:41,move:"Agility"},{level:49,move:"Brave Bird"},{level:57,move:"Final Gambit"}],
    tm: ["Fly","Take Down","Hyper Beam","Agility","Swift","Rest","Substitute","Thief","Protect","Endure","Sleep Talk","Rain Dance","Sunny Day","Heat Wave","Facade","Helping Hand","Air Cutter","Aerial Ace","Tailwind","U-turn","Close Combat","Air Slash","Brave Bird","Giga Impact","Acrobatics","Struggle Bug","Hurricane","Tera Blast","Uproar","Dual Wingbeat","Double-Edge","Endeavor","Feather Dance"],
    egg: [],
    max: []
  },
  399: {
    levelUp: [{level:1,move:"Rollout"},{level:5,move:"Tackle"},{level:10,move:"Bite"},{level:16,move:"Rest"},{level:23,move:"Crunch"},{level:31,move:"Swords Dance"},{level:40,move:"Double-Edge"}],
    tm: [],
    egg: [],
    max: []
  },
  400: {
    levelUp: [{level:0,move:"Water Pulse"},{level:1,move:"Rollout"},{level:5,move:"Tackle"},{level:10,move:"Bite"},{level:16,move:"Rest"},{level:23,move:"Crunch"},{level:23,move:"Aqua Tail"},{level:31,move:"Swords Dance"},{level:40,move:"Double-Edge"}],
    tm: [],
    egg: [],
    max: []
  },
  401: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Growl"},{level:6,move:"Struggle Bug"},{level:16,move:"Bug Bite"}],
    tm: ["Struggle Bug","Tera Blast","Bug Bite","Lunge","Endeavor","Skitter Smack"],
    egg: [],
    max: []
  },
  402: {
    levelUp: [{level:0,move:"Fury Cutter"},{level:1,move:"Tackle"},{level:1,move:"Growl"},{level:14,move:"Absorb"},{level:18,move:"Sing"},{level:22,move:"Focus Energy"},{level:26,move:"Slash"},{level:30,move:"X-Scissor"},{level:34,move:"Screech"},{level:36,move:"Fell Stinger"},{level:38,move:"Taunt"},{level:42,move:"Night Slash"},{level:44,move:"Sticky Web"},{level:46,move:"Bug Buzz"},{level:50,move:"Perish Song"}],
    tm: ["Swords Dance","Take Down","Hyper Beam","Leech Life","Rest","Substitute","Protect","Giga Drain","Endure","False Swipe","Sleep Talk","Baton Pass","Rain Dance","Sunny Day","Facade","Taunt","Helping Hand","Brick Break","Hyper Voice","Aerial Ace","X-Scissor","Bug Buzz","Giga Impact","Struggle Bug","Tera Blast","Pounce","Trailblaze","Knock Off","Bug Bite","Lunge","Uproar","Endeavor","Skitter Smack","Throat Chop"],
    egg: [],
    max: []
  },
  403: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Leer"},{level:4,move:"Thunder Shock"},{level:8,move:"Charge"},{level:12,move:"Bite"},{level:16,move:"Spark"},{level:20,move:"Roar"},{level:24,move:"Volt Switch"},{level:28,move:"Scary Face"},{level:32,move:"Thunder Wave"},{level:36,move:"Crunch"},{level:40,move:"Discharge"},{level:44,move:"Swagger"},{level:48,move:"Wild Charge"}],
    tm: ["Take Down","Thunderbolt","Thunder Wave","Thunder","Confuse Ray","Light Screen","Swift","Rest","Substitute","Thief","Protect","Scary Face","Endure","Sleep Talk","Rain Dance","Sunny Day","Crunch","Facade","Helping Hand","Fake Tears","Thunder Fang","Ice Fang","Fire Fang","Charge Beam","Electro Ball","Volt Switch","Wild Charge","Snarl","Play Rough","Eerie Impulse","Electric Terrain","Psychic Fangs","Tera Blast","Trailblaze","Roar","Charge","Double-Edge","Electroweb"],
    egg: ["Double Kick","Take Down","Quick Attack","Howl","Shock Wave","Night Slash","Baby-Doll Eyes"],
    max: []
  },
  404: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Leer"},{level:1,move:"Thunder Shock"},{level:1,move:"Charge"},{level:12,move:"Bite"},{level:18,move:"Spark"},{level:24,move:"Roar"},{level:31,move:"Volt Switch"},{level:36,move:"Scary Face"},{level:42,move:"Thunder Wave"},{level:48,move:"Crunch"},{level:54,move:"Discharge"},{level:60,move:"Swagger"},{level:68,move:"Wild Charge"}],
    tm: ["Take Down","Thunderbolt","Thunder Wave","Thunder","Confuse Ray","Light Screen","Swift","Rest","Substitute","Thief","Protect","Scary Face","Endure","Sleep Talk","Rain Dance","Sunny Day","Crunch","Facade","Helping Hand","Fake Tears","Thunder Fang","Ice Fang","Fire Fang","Charge Beam","Electro Ball","Volt Switch","Wild Charge","Snarl","Play Rough","Eerie Impulse","Electric Terrain","Psychic Fangs","Tera Blast","Trailblaze","Roar","Charge","Double-Edge","Electroweb"],
    egg: [],
    max: []
  },
  405: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Leer"},{level:1,move:"Thunder Shock"},{level:1,move:"Charge"},{level:1,move:"Electric Terrain"},{level:12,move:"Bite"},{level:18,move:"Spark"},{level:24,move:"Roar"},{level:33,move:"Volt Switch"},{level:40,move:"Scary Face"},{level:48,move:"Thunder Wave"},{level:56,move:"Crunch"},{level:64,move:"Discharge"},{level:72,move:"Swagger"},{level:80,move:"Wild Charge"}],
    tm: ["Body Slam","Take Down","Hyper Beam","Thunderbolt","Thunder Wave","Thunder","Agility","Confuse Ray","Light Screen","Swift","Rest","Substitute","Thief","Protect","Scary Face","Endure","Sleep Talk","Rain Dance","Sunny Day","Crunch","Facade","Helping Hand","Fake Tears","Giga Impact","Thunder Fang","Ice Fang","Fire Fang","Charge Beam","Electro Ball","Volt Switch","Wild Charge","Snarl","Play Rough","Eerie Impulse","Electric Terrain","Psychic Fangs","Tera Blast","Trailblaze","Roar","Charge","Double-Edge","Supercell Slam","Electroweb","Throat Chop"],
    egg: [],
    max: []
  },
  406: {
    levelUp: [{level:1,move:"Poison Sting"},{level:6,move:"Absorb"},{level:11,move:"Poison Powder"},{level:18,move:"Stun Spore"},{level:25,move:"Venoshock"},{level:34,move:"Poison Jab"},{level:43,move:"Energy Ball"},{level:52,move:"Petal Dance"}],
    tm: [],
    egg: [],
    max: []
  },
  407: {
    levelUp: [{level:1,move:"Poison Sting"},{level:6,move:"Absorb"},{level:11,move:"Poison Powder"},{level:18,move:"Stun Spore"},{level:25,move:"Venoshock"},{level:34,move:"Poison Jab"},{level:43,move:"Energy Ball"},{level:52,move:"Petal Dance"}],
    tm: [],
    egg: [],
    max: []
  },
  408: {
    levelUp: [{level:1,move:"Headbutt"},{level:1,move:"Leer"},{level:6,move:"Focus Energy"},{level:10,move:"Rock Smash"},{level:15,move:"Take Down"},{level:19,move:"Scary Face"},{level:24,move:"Assurance"},{level:28,move:"Slam"},{level:33,move:"Ancient Power"},{level:37,move:"Zen Headbutt"},{level:42,move:"Screech"},{level:46,move:"Head Smash"}],
    tm: ["Fire Punch","Thunder Punch","Swords Dance","Body Slam","Take Down","Double-Edge","Roar","Flamethrower","Ice Beam","Blizzard","Thunderbolt","Thunder","Earthquake","Dig","Fire Blast","Rest","Rock Slide","Substitute","Thief","Curse","Protect","Scary Face","Mud-Slap","Sandstorm","Endure","Sleep Talk","Rain Dance","Sunny Day","Crunch","Uproar","Facade","Endeavor","Rock Tomb","Rock Blast","Fling","Dragon Pulse","Earth Power","Zen Headbutt","Iron Head","Stone Edge","Stealth Rock","Smack Down","Bulldoze","Stomping Tantrum","Tera Blast","Trailblaze","Dragon Cheer"],
    egg: ["Whirlwind","Stomp","Thrash","Hammer Arm"],
    max: []
  },
  409: {
    levelUp: [{level:0,move:"Endeavor"},{level:1,move:"Headbutt"},{level:1,move:"Leer"},{level:1,move:"Focus Energy"},{level:10,move:"Rock Smash"},{level:15,move:"Take Down"},{level:19,move:"Scary Face"},{level:24,move:"Assurance"},{level:28,move:"Slam"},{level:36,move:"Ancient Power"},{level:43,move:"Zen Headbutt"},{level:51,move:"Screech"},{level:58,move:"Head Smash"}],
    tm: ["Fire Punch","Thunder Punch","Swords Dance","Body Slam","Take Down","Double-Edge","Roar","Flamethrower","Surf","Ice Beam","Blizzard","Hyper Beam","Thunderbolt","Thunder","Earthquake","Dig","Fire Blast","Rest","Rock Slide","Substitute","Thief","Curse","Protect","Scary Face","Mud-Slap","Outrage","Sandstorm","Endure","Sleep Talk","Rain Dance","Sunny Day","Crunch","Uproar","Facade","Focus Punch","Brick Break","Endeavor","Rock Tomb","Dragon Claw","Rock Blast","Fling","Dragon Pulse","Focus Blast","Earth Power","Giga Impact","Avalanche","Zen Headbutt","Iron Head","Stone Edge","Stealth Rock","Smack Down","Heavy Slam","Bulldoze","Dragon Tail","Stomping Tantrum","Body Press","Breaking Swipe","Tera Blast","Trailblaze","Dragon Cheer","Supercell Slam"],
    egg: ["Whirlwind","Stomp","Thrash","Hammer Arm"],
    max: []
  },
  410: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Protect"},{level:6,move:"Taunt"},{level:10,move:"Metal Sound"},{level:15,move:"Take Down"},{level:19,move:"Iron Defense"},{level:24,move:"Swagger"},{level:28,move:"Ancient Power"},{level:33,move:"Endure"},{level:37,move:"Metal Burst"},{level:42,move:"Iron Head"},{level:46,move:"Heavy Slam"}],
    tm: ["Body Slam","Take Down","Double-Edge","Roar","Flamethrower","Ice Beam","Blizzard","Thunderbolt","Thunder","Earthquake","Dig","Fire Blast","Rest","Rock Slide","Substitute","Curse","Protect","Scary Face","Mud-Slap","Sandstorm","Endure","Sleep Talk","Rain Dance","Sunny Day","Facade","Taunt","Rock Tomb","Metal Sound","Sand Tomb","Iron Defense","Rock Blast","Power Gem","Earth Power","Flash Cannon","Iron Head","Stone Edge","Stealth Rock","Smack Down","Heavy Slam","Bulldoze","Stomping Tantrum","Steel Beam","Scorching Sands","Tera Blast","Trailblaze","Hard Press"],
    egg: ["Headbutt","Counter","Fissure","Screech","Focus Energy","Guard Split"],
    max: []
  },
  411: {
    levelUp: [{level:0,move:"Block"},{level:1,move:"Tackle"},{level:1,move:"Protect"},{level:1,move:"Taunt"},{level:1,move:"Metal Sound"},{level:15,move:"Take Down"},{level:19,move:"Iron Defense"},{level:24,move:"Swagger"},{level:28,move:"Ancient Power"},{level:36,move:"Endure"},{level:43,move:"Metal Burst"},{level:51,move:"Iron Head"},{level:58,move:"Heavy Slam"}],
    tm: ["Body Slam","Take Down","Double-Edge","Roar","Flamethrower","Ice Beam","Blizzard","Hyper Beam","Thunderbolt","Thunder","Earthquake","Dig","Reflect","Fire Blast","Rest","Rock Slide","Substitute","Curse","Reversal","Protect","Scary Face","Mud-Slap","Outrage","Sandstorm","Endure","Sleep Talk","Rain Dance","Sunny Day","Facade","Taunt","Rock Tomb","Metal Sound","Sand Tomb","Iron Defense","Rock Blast","Power Gem","Earth Power","Giga Impact","Avalanche","Flash Cannon","Iron Head","Stone Edge","Stealth Rock","Smack Down","Heavy Slam","Foul Play","Bulldoze","Stomping Tantrum","Body Press","Steel Beam","Meteor Beam","Scorching Sands","Tera Blast","Trailblaze","Hard Press"],
    egg: ["Headbutt","Counter","Fissure","Screech","Focus Energy","Wide Guard","Guard Split"],
    max: []
  },
  412: {
    levelUp: [{level:1,move:"Struggle Bug"}],
    tm: [],
    egg: [],
    max: []
  },
  413: {
    levelUp: [{level:1,move:"Struggle Bug"},{level:6,move:"Gust"},{level:11,move:"Confusion"},{level:18,move:"Silver Wind"},{level:25,move:"Energy Ball"},{level:34,move:"Psychic"},{level:43,move:"Bug Buzz"}],
    tm: [],
    egg: [],
    max: []
  },
  414: {
    levelUp: [{level:1,move:"Struggle Bug"},{level:6,move:"Gust"},{level:11,move:"Confusion"},{level:18,move:"Silver Wind"},{level:25,move:"Air Slash"},{level:34,move:"Psychic"},{level:43,move:"Bug Buzz"}],
    tm: [],
    egg: [],
    max: []
  },
  415: {
    levelUp: [{level:1,move:"Gust"},{level:1,move:"Sweet Scent"},{level:1,move:"Bug Bite"},{level:1,move:"Struggle Bug"}],
    tm: ["Sleep Talk","Bug Buzz","Struggle Bug","Tera Blast","Bug Bite","Lunge","Endeavor","Skitter Smack"],
    egg: [],
    max: []
  },
  416: {
    levelUp: [{level:0,move:"Slash"},{level:1,move:"Sweet Scent"},{level:1,move:"Struggle Bug"},{level:1,move:"Bug Bite"},{level:1,move:"Gust"},{level:1,move:"Confuse Ray"},{level:1,move:"Poison Sting"},{level:4,move:"Fury Cutter"},{level:8,move:"Aromatic Mist"},{level:12,move:"Fell Stinger"},{level:16,move:"Fury Swipes"},{level:20,move:"Swagger"},{level:24,move:"Roost"},{level:28,move:"Air Slash"},{level:32,move:"Power Gem"},{level:36,move:"Toxic"},{level:40,move:"Attack Order"},{level:40,move:"Defend Order"},{level:44,move:"Destiny Bond"}],
    tm: ["Take Down","Hyper Beam","Agility","Confuse Ray","Swift","Rest","Substitute","Thief","Reversal","Protect","Scary Face","Sludge Bomb","Spikes","Endure","Sleep Talk","Rain Dance","Sunny Day","Facade","Taunt","Helping Hand","Aerial Ace","U-turn","Fling","Toxic Spikes","Air Slash","X-Scissor","Bug Buzz","Power Gem","Giga Impact","Venoshock","Hex","Acrobatics","Struggle Bug","Hurricane","Pollen Puff","Tera Blast","Pounce","Toxic","Spite","Bug Bite","Lunge","Dual Wingbeat","Endeavor","Skitter Smack","Psychic Noise"],
    egg: [],
    max: []
  },
  417: {
    levelUp: [{level:1,move:"Growl"},{level:1,move:"Thunder Shock"},{level:5,move:"Quick Attack"},{level:9,move:"Charm"},{level:13,move:"Spark"},{level:17,move:"Endure"},{level:19,move:"Nuzzle"},{level:21,move:"Swift"},{level:25,move:"Electro Ball"},{level:29,move:"Sweet Kiss"},{level:33,move:"Thunder Wave"},{level:37,move:"Super Fang"},{level:41,move:"Discharge"},{level:45,move:"Last Resort"},{level:49,move:"Thunder"}],
    tm: ["Thunder Punch","Take Down","Hyper Beam","Thunderbolt","Thunder Wave","Thunder","Dig","Agility","Light Screen","Swift","Rest","Substitute","Thief","Protect","Mud-Slap","Endure","Charm","Sleep Talk","Encore","Rain Dance","Sunny Day","Facade","Helping Hand","Fake Tears","Aerial Ace","Mud Shot","U-turn","Fling","Seed Bomb","Giga Impact","Thunder Fang","Gunk Shot","Grass Knot","Charge Beam","Electro Ball","Volt Switch","Wild Charge","Play Rough","Eerie Impulse","Electric Terrain","Tera Blast","Trailblaze","Charge","Super Fang","Uproar","Endeavor","Electroweb","Alluring Voice"],
    egg: ["Tail Whip","Bite","Defense Curl","Flail","Rollout","Flatter","Follow Me","Charge","Fake Tears","Covet","Baby-Doll Eyes"],
    max: []
  },
  418: {
    levelUp: [{level:1,move:"Tackle"},{level:4,move:"Growl"},{level:7,move:"Soak"},{level:11,move:"Quick Attack"},{level:15,move:"Water Gun"},{level:18,move:"Bite"},{level:21,move:"Swift"},{level:24,move:"Aqua Jet"},{level:27,move:"Double Hit"},{level:31,move:"Whirlpool"},{level:35,move:"Liquidation"},{level:38,move:"Aqua Tail"},{level:41,move:"Agility"},{level:45,move:"Hydro Pump"},{level:49,move:"Wave Crash"}],
    tm: ["Ice Punch","Take Down","Hydro Pump","Surf","Ice Beam","Blizzard","Low Kick","Dig","Agility","Waterfall","Swift","Rest","Substitute","Thief","Protect","Mud-Slap","Icy Wind","Endure","Sleep Talk","Baton Pass","Rain Dance","Crunch","Facade","Taunt","Helping Hand","Brick Break","Rock Tomb","Bulk Up","Water Pulse","Fling","Ice Fang","Low Sweep","Liquidation","Tera Blast","Ice Spinner","Chilling Water","Roar","Focus Punch","Flip Turn","Whirlpool"],
    egg: ["Headbutt","Fury Swipes","Slash","Mud-Slap","Fury Cutter","Baton Pass","Helping Hand","Aqua Ring"],
    max: []
  },
  419: {
    levelUp: [{level:1,move:"Growl"},{level:1,move:"Quick Attack"},{level:1,move:"Crunch"},{level:1,move:"Ice Fang"},{level:1,move:"Soak"},{level:15,move:"Water Gun"},{level:18,move:"Bite"},{level:21,move:"Swift"},{level:24,move:"Aqua Jet"},{level:29,move:"Double Hit"},{level:35,move:"Whirlpool"},{level:41,move:"Liquidation"},{level:46,move:"Aqua Tail"},{level:51,move:"Agility"},{level:57,move:"Hydro Pump"},{level:62,move:"Wave Crash"}],
    tm: ["Ice Punch","Body Slam","Take Down","Hydro Pump","Surf","Ice Beam","Blizzard","Hyper Beam","Low Kick","Dig","Agility","Metronome","Waterfall","Swift","Rest","Substitute","Thief","Protect","Scary Face","Mud-Slap","Icy Wind","Endure","Sleep Talk","Baton Pass","Rain Dance","Crunch","Facade","Taunt","Helping Hand","Brick Break","Rock Tomb","Bulk Up","Water Pulse","Fling","Focus Blast","Giga Impact","Ice Fang","Low Sweep","Snarl","Liquidation","Tera Blast","Ice Spinner","Chilling Water","Roar","Focus Punch","Flip Turn","Double-Edge","Whirlpool","Muddy Water"],
    egg: [],
    max: []
  },
  420: {
    levelUp: [{level:1,move:"Absorb"},{level:5,move:"Tackle"},{level:9,move:"Stun Spore"},{level:15,move:"Draining Kiss"},{level:21,move:"Energy Ball"},{level:29,move:"Sleep Powder"},{level:37,move:"Double-Edge"},{level:47,move:"Petal Dance"}],
    tm: [],
    egg: [],
    max: []
  },
  421: {
    levelUp: [{level:1,move:"Absorb"},{level:5,move:"Tackle"},{level:9,move:"Stun Spore"},{level:15,move:"Draining Kiss"},{level:21,move:"Energy Ball"},{level:29,move:"Sleep Powder"},{level:37,move:"Double-Edge"},{level:47,move:"Petal Dance"}],
    tm: [],
    egg: [],
    max: []
  },
  422: {
    levelUp: [{level:1,move:"Water Gun"},{level:1,move:"Mud-Slap"},{level:5,move:"Harden"},{level:10,move:"Recover"},{level:15,move:"Water Pulse"},{level:20,move:"Ancient Power"},{level:25,move:"Body Slam"},{level:31,move:"Muddy Water"},{level:35,move:"Earth Power"},{level:40,move:"Rain Dance"},{level:45,move:"Memento"}],
    tm: ["Body Slam","Take Down","Hydro Pump","Surf","Ice Beam","Blizzard","Waterfall","Amnesia","Rest","Rock Slide","Substitute","Protect","Mud-Slap","Icy Wind","Sandstorm","Endure","Sleep Talk","Rain Dance","Facade","Helping Hand","Rock Tomb","Mud Shot","Water Pulse","Earth Power","Stone Edge","Stealth Rock","Bulldoze","Liquidation","Tera Blast","Snowscape","Chilling Water","Pain Split","Whirlpool","Muddy Water","Skitter Smack","Curse"],
    egg: ["Mist","Counter","Sludge","Acid Armor","Curse","Mirror Coat","Stockpile","Spit Up","Swallow","Yawn","Clear Smog"],
    max: []
  },
  423: {
    levelUp: [{level:1,move:"Water Gun"},{level:1,move:"Recover"},{level:1,move:"Harden"},{level:1,move:"Mud-Slap"},{level:15,move:"Water Pulse"},{level:20,move:"Ancient Power"},{level:25,move:"Body Slam"},{level:33,move:"Muddy Water"},{level:39,move:"Earth Power"},{level:46,move:"Rain Dance"},{level:53,move:"Memento"}],
    tm: ["Body Slam","Take Down","Hydro Pump","Surf","Ice Beam","Blizzard","Hyper Beam","Earthquake","Dig","Waterfall","Amnesia","Rest","Rock Slide","Substitute","Protect","Sludge Bomb","Mud-Slap","Spikes","Icy Wind","Sandstorm","Endure","Sleep Talk","Rain Dance","Facade","Helping Hand","Rock Tomb","Mud Shot","Rock Blast","Water Pulse","Earth Power","Giga Impact","Stone Edge","Stealth Rock","Bulldoze","Stomping Tantrum","Liquidation","Tera Blast","Snowscape","Chilling Water","Sand Tomb","Weather Ball","Pain Split","Whirlpool","Muddy Water","Sludge Wave","Skitter Smack","Curse"],
    egg: [],
    max: []
  },
  424: {
    levelUp: [{level:1,move:"Scratch"},{level:1,move:"Sand Attack"},{level:1,move:"Tail Whip"},{level:1,move:"Astonish"},{level:11,move:"Baton Pass"},{level:15,move:"Tickle"},{level:18,move:"Fury Swipes"},{level:22,move:"Swift"},{level:25,move:"Screech"},{level:29,move:"Agility"},{level:32,move:"Double Hit"},{level:36,move:"Fling"},{level:39,move:"Nasty Plot"},{level:43,move:"Last Resort"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Take Down","Hyper Beam","Low Kick","Solar Beam","Thunderbolt","Thunder Wave","Thunder","Dig","Agility","Metronome","Swift","Rest","Substitute","Thief","Spite","Protect","Mud-Slap","Endure","Sleep Talk","Baton Pass","Rain Dance","Sunny Day","Shadow Ball","Facade","Focus Punch","Taunt","Helping Hand","Brick Break","Knock Off","Aerial Ace","Mud Shot","Water Pulse","U-turn","Fling","Seed Bomb","Giga Impact","Nasty Plot","Shadow Claw","Gunk Shot","Grass Knot","Smack Down","Low Sweep","Foul Play","Acrobatics","Tera Blast","Trailblaze","Chilling Water","Double-Edge","Endeavor","Triple Axel","Throat Chop","Upper Hand"],
    egg: ["Slam","Counter","Iron Tail","Beat Up","Fake Out","Bounce","Covet","Switcheroo","Quick Guard"],
    max: []
  },
  425: {
    levelUp: [{level:1,move:"Minimize"},{level:1,move:"Astonish"},{level:4,move:"Gust"},{level:8,move:"Focus Energy"},{level:12,move:"Payback"},{level:16,move:"Hex"},{level:20,move:"Shadow Ball"},{level:24,move:"Stockpile"},{level:24,move:"Spit Up"},{level:24,move:"Swallow"},{level:29,move:"Self-Destruct"},{level:32,move:"Destiny Bond"},{level:36,move:"Baton Pass"},{level:40,move:"Tailwind"},{level:44,move:"Explosion"}],
    tm: ["Fly","Psybeam","Thunderbolt","Thunder Wave","Thunder","Psychic","Night Shade","Swift","Amnesia","Rest","Substitute","Thief","Protect","Icy Wind","Endure","Sleep Talk","Baton Pass","Rain Dance","Sunny Day","Shadow Ball","Will-O-Wisp","Facade","Helping Hand","Trick","Skill Swap","Imprison","Air Cutter","Aerial Ace","Calm Mind","Tailwind","Trick Room","Stored Power","Hex","Acrobatics","Phantom Force","Tera Blast","Haze","Spite","Gyro Ball","Knock Off","Weather Ball","Pain Split","Temper Flare","Curse"],
    egg: ["Disable","Hypnosis","Haze","Memento","Defog","Clear Smog"],
    max: []
  },
  426: {
    levelUp: [{level:0,move:"Phantom Force"},{level:1,move:"Astonish"},{level:1,move:"Strength Sap"},{level:1,move:"Gust"},{level:1,move:"Focus Energy"},{level:1,move:"Minimize"},{level:12,move:"Payback"},{level:16,move:"Hex"},{level:20,move:"Shadow Ball"},{level:24,move:"Stockpile"},{level:24,move:"Spit Up"},{level:24,move:"Swallow"},{level:31,move:"Self-Destruct"},{level:36,move:"Destiny Bond"},{level:42,move:"Baton Pass"},{level:48,move:"Tailwind"},{level:54,move:"Explosion"}],
    tm: ["Fly","Body Slam","Psybeam","Hyper Beam","Thunderbolt","Thunder Wave","Thunder","Psychic","Night Shade","Swift","Amnesia","Rest","Substitute","Thief","Protect","Icy Wind","Endure","Sleep Talk","Baton Pass","Rain Dance","Sunny Day","Shadow Ball","Will-O-Wisp","Facade","Helping Hand","Trick","Skill Swap","Imprison","Air Cutter","Aerial Ace","Calm Mind","Tailwind","Fling","Air Slash","Giga Impact","Trick Room","Stored Power","Hex","Acrobatics","Phantom Force","Tera Blast","Haze","Spite","Gyro Ball","Knock Off","Weather Ball","Pain Split","Temper Flare","Curse"],
    egg: [],
    max: []
  },
  427: {
    levelUp: [{level:1,move:"Quick Attack"},{level:5,move:"Baby-Doll Eyes"},{level:10,move:"Swift"},{level:16,move:"Draining Kiss"},{level:23,move:"Double Hit"},{level:31,move:"Play Rough"},{level:40,move:"Double-Edge"}],
    tm: [],
    egg: [],
    max: []
  },
  428: {
    levelUp: [{level:1,move:"Quick Attack"},{level:1,move:"Mach Punch"},{level:5,move:"Baby-Doll Eyes"},{level:10,move:"Swift"},{level:16,move:"Draining Kiss"},{level:23,move:"Double Hit"},{level:31,move:"Play Rough"},{level:40,move:"Double-Edge"},{level:40,move:"Close Combat"}],
    tm: [],
    egg: [],
    max: []
  },
  429: {
    levelUp: [{level:1,move:"Growl"},{level:1,move:"Spite"},{level:1,move:"Astonish"},{level:1,move:"Magical Leaf"},{level:1,move:"Power Gem"},{level:1,move:"Phantom Force"},{level:1,move:"Mystical Fire"}],
    tm: ["Psybeam","Hyper Beam","Thunderbolt","Thunder Wave","Thunder","Psychic","Night Shade","Confuse Ray","Swift","Rest","Substitute","Thief","Protect","Scary Face","Icy Wind","Endure","Charm","Sleep Talk","Rain Dance","Sunny Day","Shadow Ball","Will-O-Wisp","Facade","Taunt","Helping Hand","Trick","Skill Swap","Imprison","Hyper Voice","Fake Tears","Magical Leaf","Calm Mind","Dark Pulse","Power Gem","Energy Ball","Giga Impact","Nasty Plot","Trick Room","Grass Knot","Charge Beam","Psyshock","Foul Play","Stored Power","Hex","Phantom Force","Draining Kiss","Dazzling Gleam","Tera Blast","Snowscape","Spite","Burning Jealousy","Poltergeist","Lash Out","Pain Split","Psych Up","Future Sight","Curse","Psychic Noise"],
    egg: [],
    max: []
  },
  430: {
    levelUp: [{level:1,move:"Wing Attack"},{level:1,move:"Haze"},{level:1,move:"Astonish"},{level:1,move:"Sucker Punch"},{level:1,move:"Night Slash"},{level:1,move:"Quash"},{level:25,move:"Swagger"},{level:35,move:"Nasty Plot"},{level:45,move:"Foul Play"},{level:55,move:"Dark Pulse"},{level:65,move:"Comeuppance"}],
    tm: ["Fly","Take Down","Hyper Beam","Thunder Wave","Psychic","Night Shade","Confuse Ray","Rest","Substitute","Thief","Protect","Scary Face","Mud-Slap","Icy Wind","Endure","Sleep Talk","Rain Dance","Sunny Day","Shadow Ball","Heat Wave","Facade","Taunt","Helping Hand","Air Cutter","Aerial Ace","Calm Mind","Tailwind","U-turn","Dark Pulse","Air Slash","Brave Bird","Giga Impact","Nasty Plot","Foul Play","Hex","Acrobatics","Hurricane","Snarl","Tera Blast","Chilling Water","Haze","Spite","Uproar","Dual Wingbeat","Lash Out","Psych Up","Double-Edge","Endeavor","Feather Dance","Psychic Noise"],
    egg: [],
    max: []
  },
  431: {
    levelUp: [{level:1,move:"Tackle"},{level:5,move:"Hypnosis"},{level:10,move:"Nasty Plot"},{level:16,move:"Slash"},{level:23,move:"Night Slash"},{level:31,move:"Play Rough"},{level:40,move:"Double-Edge"}],
    tm: [],
    egg: [],
    max: []
  },
  432: {
    levelUp: [{level:1,move:"Tackle"},{level:5,move:"Hypnosis"},{level:10,move:"Nasty Plot"},{level:16,move:"Slash"},{level:23,move:"Night Slash"},{level:31,move:"Play Rough"},{level:40,move:"Double-Edge"}],
    tm: [],
    egg: [],
    max: []
  },
  433: {
    levelUp: [{level:1,move:"Wrap"},{level:4,move:"Growl"},{level:7,move:"Astonish"},{level:10,move:"Confusion"},{level:13,move:"Yawn"},{level:16,move:"Last Resort"},{level:19,move:"Entrainment"},{level:32,move:"Uproar"}],
    tm: ["Thunder Wave","Psychic","Light Screen","Reflect","Rest","Substitute","Protect","Icy Wind","Endure","Sleep Talk","Baton Pass","Rain Dance","Sunny Day","Shadow Ball","Uproar","Facade","Taunt","Helping Hand","Trick","Knock Off","Skill Swap","Hyper Voice","Calm Mind","Gravity","Energy Ball","Zen Headbutt","Trick Room","Grass Knot","Charge Beam","Psyshock","Stored Power","Dazzling Gleam","Tera Blast","Psych Up","Double-Edge","Future Sight","Curse","Psychic Noise"],
    egg: ["Disable","Hypnosis","Recover","Curse","Wish","Recycle","Cosmic Power","Ally Switch"],
    max: []
  },
  434: {
    levelUp: [{level:1,move:"Scratch"},{level:1,move:"Poison Gas"},{level:3,move:"Feint"},{level:6,move:"Smokescreen"},{level:9,move:"Acid Spray"},{level:12,move:"Fury Swipes"},{level:15,move:"Focus Energy"},{level:18,move:"Bite"},{level:21,move:"Venoshock"},{level:24,move:"Screech"},{level:27,move:"Toxic"},{level:30,move:"Sucker Punch"},{level:33,move:"Memento"},{level:36,move:"Night Slash"},{level:39,move:"Belch"},{level:42,move:"Explosion"}],
    tm: ["Body Slam","Take Down","Flamethrower","Dig","Fire Blast","Swift","Rest","Substitute","Thief","Protect","Scary Face","Sludge Bomb","Endure","Sleep Talk","Rain Dance","Sunny Day","Crunch","Shadow Ball","Facade","Taunt","Helping Hand","Poison Tail","Toxic Spikes","Poison Jab","Dark Pulse","Nasty Plot","Shadow Claw","Gunk Shot","Venoshock","Acid Spray","Foul Play","Hex","Snarl","Play Rough","Tera Blast","Trailblaze","Roar","Haze","Toxic","Knock Off","Lash Out","Double-Edge","Temper Flare","Sludge Wave","Throat Chop"],
    egg: ["Double-Edge","Leer","Haze","Smog","Slash","Astonish"],
    max: []
  },
  435: {
    levelUp: [{level:0,move:"Flamethrower"},{level:1,move:"Scratch"},{level:1,move:"Smokescreen"},{level:1,move:"Poison Gas"},{level:1,move:"Feint"},{level:12,move:"Fury Swipes"},{level:15,move:"Focus Energy"},{level:18,move:"Bite"},{level:21,move:"Venoshock"},{level:24,move:"Screech"},{level:27,move:"Toxic"},{level:30,move:"Sucker Punch"},{level:33,move:"Memento"},{level:38,move:"Night Slash"},{level:43,move:"Belch"},{level:48,move:"Explosion"}],
    tm: ["Body Slam","Take Down","Flamethrower","Hyper Beam","Fire Spin","Dig","Fire Blast","Swift","Rest","Substitute","Thief","Protect","Scary Face","Sludge Bomb","Endure","Sleep Talk","Rain Dance","Sunny Day","Crunch","Shadow Ball","Facade","Taunt","Helping Hand","Poison Tail","Toxic Spikes","Poison Jab","Dark Pulse","Giga Impact","Nasty Plot","Shadow Claw","Gunk Shot","Venoshock","Acid Spray","Foul Play","Hex","Snarl","Play Rough","Tera Blast","Trailblaze","Roar","Haze","Toxic","Knock Off","Super Fang","Burning Jealousy","Lash Out","Double-Edge","Endeavor","Temper Flare","Sludge Wave","Throat Chop"],
    egg: [],
    max: []
  },
  436: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Confusion"},{level:4,move:"Confuse Ray"},{level:8,move:"Payback"},{level:12,move:"Imprison"},{level:16,move:"Gyro Ball"},{level:20,move:"Hypnosis"},{level:24,move:"Safeguard"},{level:28,move:"Extrasensory"},{level:32,move:"Heavy Slam"},{level:36,move:"Iron Defense"},{level:40,move:"Metal Sound"},{level:44,move:"Future Sight"}],
    tm: ["Body Slam","Take Down","Solar Beam","Earthquake","Psychic","Confuse Ray","Light Screen","Reflect","Rest","Rock Slide","Substitute","Protect","Sandstorm","Endure","Sleep Talk","Rain Dance","Sunny Day","Shadow Ball","Facade","Helping Hand","Trick","Skill Swap","Imprison","Rock Tomb","Iron Defense","Calm Mind","Rock Blast","Power Gem","Zen Headbutt","Flash Cannon","Trick Room","Iron Head","Stealth Rock","Grass Knot","Charge Beam","Psyshock","Heavy Slam","Stored Power","Hex","Bulldoze","Psychic Terrain","Stomping Tantrum","Steel Beam","Tera Blast","Ice Spinner","Gravity","Gyro Ball","Psych Up","Future Sight","Expanding Force","Metal Sound"],
    egg: ["Recycle","Gravity"],
    max: []
  },
  437: {
    levelUp: [{level:0,move:"Block"},{level:1,move:"Tackle"},{level:1,move:"Confusion"},{level:1,move:"Confuse Ray"},{level:1,move:"Weather Ball"},{level:1,move:"Payback"},{level:1,move:"Sunny Day"},{level:12,move:"Imprison"},{level:16,move:"Gyro Ball"},{level:20,move:"Hypnosis"},{level:24,move:"Safeguard"},{level:28,move:"Extrasensory"},{level:32,move:"Heavy Slam"},{level:38,move:"Iron Defense"},{level:44,move:"Metal Sound"},{level:50,move:"Future Sight"},{level:56,move:"Rain Dance"}],
    tm: ["Body Slam","Take Down","Psybeam","Hyper Beam","Solar Beam","Earthquake","Psychic","Night Shade","Confuse Ray","Light Screen","Reflect","Rest","Rock Slide","Substitute","Protect","Sandstorm","Endure","Sleep Talk","Rain Dance","Sunny Day","Shadow Ball","Facade","Helping Hand","Trick","Skill Swap","Imprison","Rock Tomb","Iron Defense","Calm Mind","Rock Blast","Power Gem","Giga Impact","Zen Headbutt","Flash Cannon","Trick Room","Iron Head","Stealth Rock","Grass Knot","Charge Beam","Psyshock","Heavy Slam","Stored Power","Hex","Bulldoze","Psychic Terrain","Stomping Tantrum","Body Press","Steel Beam","Tera Blast","Ice Spinner","Gravity","Gyro Ball","Weather Ball","Psych Up","Future Sight","Expanding Force","Meteor Beam","Metal Sound","Hard Press","Psychic Noise"],
    egg: [],
    max: []
  },
  438: {
    levelUp: [{level:1,move:"Fake Tears"},{level:1,move:"Copycat"},{level:4,move:"Flail"},{level:8,move:"Rock Throw"},{level:12,move:"Block"},{level:16,move:"Mimic"},{level:20,move:"Rock Tomb"},{level:24,move:"Tearful Look"},{level:28,move:"Sucker Punch"},{level:32,move:"Rock Slide"},{level:36,move:"Low Kick"},{level:40,move:"Counter"},{level:44,move:"Double-Edge"}],
    tm: ["Body Slam","Take Down","Low Kick","Earthquake","Dig","Rest","Rock Slide","Substitute","Thief","Protect","Mud-Slap","Spikes","Sandstorm","Endure","Sleep Talk","Sunny Day","Facade","Helping Hand","Brick Break","Fake Tears","Rock Tomb","Mud Shot","Calm Mind","Rock Blast","Power Gem","Earth Power","Stone Edge","Stealth Rock","Grass Knot","Foul Play","Bulldoze","Stomping Tantrum","Tera Blast","Trailblaze","Sand Tomb","Smack Down","Psych Up","Double-Edge","Curse"],
    egg: ["Headbutt","Harden","Defense Curl","Curse","Rollout","Rock Polish"],
    max: []
  },
  439: {
    levelUp: [{level:1,move:"Confusion"},{level:6,move:"Hypnosis"},{level:11,move:"Iron Defense"},{level:18,move:"Zen Headbutt"},{level:25,move:"Mimic"},{level:34,move:"Psychic"},{level:43,move:"Calm Mind"}],
    tm: [],
    egg: [],
    max: []
  },
  440: {
    levelUp: [{level:1,move:"Pound"},{level:1,move:"Copycat"},{level:4,move:"Defense Curl"},{level:8,move:"Sweet Kiss"},{level:12,move:"Disarming Voice"},{level:16,move:"Covet"},{level:20,move:"Charm"}],
    tm: ["Take Down","Solar Beam","Thunder Wave","Psychic","Light Screen","Metronome","Rest","Substitute","Protect","Icy Wind","Endure","Charm","Sleep Talk","Rain Dance","Sunny Day","Shadow Ball","Facade","Helping Hand","Hyper Voice","Fling","Zen Headbutt","Grass Knot","Stored Power","Disarming Voice","Tera Blast","Snowscape","Gravity"],
    egg: ["Seismic Toss","Heal Bell","Present","Gravity"],
    max: []
  },
  441: {
    levelUp: [{level:1,move:"Gust"},{level:6,move:"Swift"},{level:11,move:"Air Cutter"},{level:18,move:"Roost"},{level:25,move:"Air Slash"},{level:30,move:"Mimic"},{level:34,move:"Nasty Plot"},{level:43,move:"Play Rough"},{level:52,move:"Hurricane"}],
    tm: [],
    egg: [],
    max: []
  },
  442: {
    levelUp: [{level:1,move:"Night Shade"},{level:1,move:"Confuse Ray"},{level:5,move:"Shadow Sneak"},{level:10,move:"Spite"},{level:15,move:"Payback"},{level:20,move:"Nasty Plot"},{level:25,move:"Hex"},{level:30,move:"Memento"},{level:35,move:"Sucker Punch"},{level:40,move:"Curse"},{level:45,move:"Shadow Ball"},{level:50,move:"Dark Pulse"},{level:55,move:"Hypnosis"},{level:60,move:"Dream Eater"}],
    tm: ["Body Slam","Psybeam","Hyper Beam","Psychic","Night Shade","Confuse Ray","Rest","Substitute","Thief","Protect","Scary Face","Icy Wind","Endure","Sleep Talk","Rain Dance","Sunny Day","Shadow Ball","Will-O-Wisp","Facade","Taunt","Helping Hand","Trick","Skill Swap","Imprison","Rock Tomb","Calm Mind","Dark Pulse","Giga Impact","Nasty Plot","Trick Room","Psyshock","Foul Play","Stored Power","Hex","Snarl","Phantom Force","Tera Blast","Toxic","Spite","Burning Jealousy","Poltergeist","Lash Out","Pain Split","Curse"],
    egg: ["Disable","Smokescreen","Destiny Bond","Pain Split","Ally Switch"],
    max: []
  },
  443: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Sand Tomb"},{level:6,move:"Sand Attack"},{level:12,move:"Dragon Breath"},{level:18,move:"Bulldoze"},{level:25,move:"Bite"},{level:30,move:"Slash"},{level:36,move:"Dragon Claw"},{level:42,move:"Dig"},{level:48,move:"Sandstorm"},{level:54,move:"Take Down"},{level:60,move:"Dragon Rush"}],
    tm: ["Swords Dance","Body Slam","Take Down","Flamethrower","Earthquake","Dig","Fire Blast","Swift","Rest","Rock Slide","Substitute","Protect","Scary Face","Outrage","Sandstorm","Endure","False Swipe","Sleep Talk","Metal Claw","Rain Dance","Sunny Day","Facade","Helping Hand","Rock Tomb","Dragon Claw","Mud Shot","Dragon Pulse","Earth Power","Shadow Claw","Thunder Fang","Fire Fang","Draco Meteor","Iron Head","Stone Edge","Stealth Rock","Bulldoze","Dragon Tail","Tera Blast","Sand Tomb","Scale Shot","Double-Edge","Scorching Sands","Dragon Cheer"],
    egg: ["Thrash","Double-Edge","Metal Claw","Twister"],
    max: []
  },
  444: {
    levelUp: [{level:1,move:"Sand Attack"},{level:1,move:"Tackle"},{level:1,move:"Dragon Breath"},{level:1,move:"Sand Tomb"},{level:18,move:"Bulldoze"},{level:27,move:"Bite"},{level:34,move:"Slash"},{level:42,move:"Dragon Claw"},{level:50,move:"Dig"},{level:58,move:"Sandstorm"},{level:66,move:"Take Down"},{level:74,move:"Dragon Rush"}],
    tm: ["Swords Dance","Body Slam","Take Down","Flamethrower","Earthquake","Dig","Fire Blast","Swift","Rest","Rock Slide","Substitute","Protect","Scary Face","Outrage","Sandstorm","Endure","False Swipe","Sleep Talk","Metal Claw","Rain Dance","Sunny Day","Crunch","Facade","Helping Hand","Rock Tomb","Aerial Ace","Dragon Claw","Mud Shot","Dragon Pulse","Power Gem","Earth Power","Shadow Claw","Thunder Fang","Fire Fang","Draco Meteor","Iron Head","Stone Edge","Stealth Rock","Bulldoze","Dragon Tail","Tera Blast","Sand Tomb","Scale Shot","Double-Edge","Scorching Sands","Breaking Swipe","Dragon Cheer"],
    egg: [],
    max: []
  },
  445: {
    levelUp: [{level:0,move:"Crunch"},{level:1,move:"Sand Attack"},{level:1,move:"Tackle"},{level:1,move:"Dragon Breath"},{level:1,move:"Sand Tomb"},{level:18,move:"Bulldoze"},{level:27,move:"Bite"},{level:34,move:"Slash"},{level:42,move:"Dragon Claw"},{level:52,move:"Dig"},{level:62,move:"Sandstorm"},{level:72,move:"Take Down"},{level:82,move:"Dragon Rush"}],
    tm: ["Swords Dance","Body Slam","Take Down","Flamethrower","Surf","Hyper Beam","Earthquake","Dig","Fire Blast","Swift","Rest","Rock Slide","Substitute","Protect","Scary Face","Spikes","Outrage","Sandstorm","Endure","False Swipe","Sleep Talk","Metal Claw","Rain Dance","Sunny Day","Crunch","Facade","Helping Hand","Brick Break","Rock Tomb","Aerial Ace","Dragon Claw","Mud Shot","Fling","Poison Jab","Dragon Pulse","Power Gem","Earth Power","Giga Impact","Shadow Claw","Thunder Fang","Fire Fang","Draco Meteor","Iron Head","Stone Edge","Stealth Rock","Bulldoze","Dragon Tail","Stomping Tantrum","Liquidation","Tera Blast","Sand Tomb","Scale Shot","Double-Edge","Scorching Sands","Breaking Swipe","Dragon Cheer"],
    egg: [],
    max: []
  },
  446: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Lick"},{level:4,move:"Defense Curl"},{level:8,move:"Recycle"},{level:12,move:"Covet"},{level:16,move:"Bite"},{level:20,move:"Stockpile"},{level:20,move:"Swallow"},{level:24,move:"Screech"},{level:28,move:"Body Slam"},{level:32,move:"Fling"},{level:36,move:"Amnesia"},{level:40,move:"Metronome"},{level:44,move:"Flail"},{level:48,move:"Belly Drum"},{level:52,move:"Last Resort"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Take Down","Flamethrower","Surf","Ice Beam","Blizzard","Solar Beam","Thunderbolt","Thunder","Earthquake","Dig","Metronome","Fire Blast","Amnesia","Rest","Rock Slide","Substitute","Protect","Mud-Slap","Icy Wind","Sandstorm","Endure","Charm","Sleep Talk","Encore","Rain Dance","Sunny Day","Crunch","Shadow Ball","Uproar","Facade","Focus Punch","Helping Hand","Brick Break","Hyper Voice","Rock Tomb","Fling","Seed Bomb","Giga Impact","Zen Headbutt","Gunk Shot","Bulldoze","Stomping Tantrum","Tera Blast","Trailblaze","Chilling Water","Double-Edge","Curse"],
    egg: ["Double-Edge","Counter","Fissure","Curse","Belch"],
    max: []
  },
  447: {
    levelUp: [{level:1,move:"Quick Attack"},{level:1,move:"Endure"},{level:4,move:"Feint"},{level:8,move:"Metal Claw"},{level:12,move:"Counter"},{level:16,move:"Work Up"},{level:20,move:"Rock Smash"},{level:24,move:"Vacuum Wave"},{level:28,move:"Screech"},{level:32,move:"Quick Guard"},{level:36,move:"Force Palm"},{level:40,move:"Swords Dance"},{level:44,move:"Helping Hand"},{level:48,move:"Copycat"},{level:52,move:"Final Gambit"},{level:56,move:"Reversal"}],
    tm: ["Ice Punch","Thunder Punch","Swords Dance","Take Down","Low Kick","Earthquake","Dig","Agility","Swift","Rest","Rock Slide","Substitute","Reversal","Protect","Endure","Sleep Talk","Metal Claw","Rain Dance","Sunny Day","Crunch","Facade","Helping Hand","Brick Break","Rock Tomb","Aerial Ace","Bulk Up","Close Combat","Fling","Poison Jab","Drain Punch","Focus Blast","Nasty Plot","Shadow Claw","Zen Headbutt","Low Sweep","Bulldoze","Tera Blast","Trailblaze","Vacuum Wave","Focus Punch","Psych Up","Coaching","Upper Hand"],
    egg: ["Bite","High Jump Kick","Detect","Cross Chop","Howl","Bullet Punch","Circle Throw"],
    max: []
  },
  448: {
    levelUp: [{level:0,move:"Aura Sphere"},{level:1,move:"Copycat"},{level:1,move:"Feint"},{level:1,move:"Helping Hand"},{level:1,move:"Rock Smash"},{level:1,move:"Metal Claw"},{level:1,move:"Vacuum Wave"},{level:1,move:"Detect"},{level:1,move:"Reversal"},{level:1,move:"Screech"},{level:1,move:"Quick Attack"},{level:1,move:"Final Gambit"},{level:1,move:"Life Dew"},{level:12,move:"Counter"},{level:16,move:"Work Up"},{level:20,move:"Force Palm"},{level:24,move:"Calm Mind"},{level:28,move:"Metal Sound"},{level:32,move:"Quick Guard"},{level:36,move:"Bone Rush"},{level:40,move:"Swords Dance"},{level:44,move:"Heal Pulse"},{level:48,move:"Meteor Mash"},{level:52,move:"Dragon Pulse"},{level:56,move:"Extreme Speed"},{level:60,move:"Close Combat"}],
    tm: ["Ice Punch","Thunder Punch","Swords Dance","Body Slam","Take Down","Hyper Beam","Low Kick","Earthquake","Dig","Psychic","Agility","Metronome","Swift","Rest","Rock Slide","Substitute","Reversal","Protect","Scary Face","Endure","Sleep Talk","Metal Claw","Rain Dance","Sunny Day","Crunch","Shadow Ball","Facade","Helping Hand","Brick Break","Rock Tomb","Aerial Ace","Iron Defense","Bulk Up","Calm Mind","Water Pulse","Close Combat","Fling","Aura Sphere","Poison Jab","Dark Pulse","Dragon Pulse","Drain Punch","Focus Blast","Giga Impact","Nasty Plot","Shadow Claw","Zen Headbutt","Flash Cannon","Stone Edge","Low Sweep","Bulldoze","Steel Beam","Tera Blast","Trailblaze","Roar","Vacuum Wave","Focus Punch","Psych Up","Coaching","Metal Sound","Upper Hand"],
    egg: [],
    max: []
  },
  449: {
    levelUp: [{level:1,move:"Sand Attack"},{level:1,move:"Tackle"},{level:4,move:"Bite"},{level:8,move:"Yawn"},{level:12,move:"Sand Tomb"},{level:16,move:"Dig"},{level:20,move:"Crunch"},{level:24,move:"Sandstorm"},{level:28,move:"Take Down"},{level:32,move:"Roar"},{level:36,move:"Rest"},{level:40,move:"Earthquake"},{level:44,move:"Double-Edge"},{level:48,move:"Fissure"},{level:52,move:"Slack Off"}],
    tm: ["Body Slam","Take Down","Earthquake","Dig","Amnesia","Rest","Rock Slide","Substitute","Protect","Mud-Slap","Sandstorm","Endure","Sleep Talk","Sunny Day","Crunch","Facade","Helping Hand","Rock Tomb","Mud Shot","Earth Power","Thunder Fang","Ice Fang","Fire Fang","Stone Edge","Stealth Rock","Bulldoze","Stomping Tantrum","Body Press","Tera Blast","Roar","Sand Tomb","High Horsepower","Double-Edge","Muddy Water","Scorching Sands","Curse"],
    egg: ["Whirlwind","Curse","Stockpile","Spit Up","Swallow"],
    max: []
  },
  450: {
    levelUp: [{level:1,move:"Fire Fang"},{level:1,move:"Thunder Fang"},{level:1,move:"Yawn"},{level:1,move:"Ice Fang"},{level:1,move:"Sand Attack"},{level:1,move:"Tackle"},{level:1,move:"Bite"},{level:12,move:"Sand Tomb"},{level:16,move:"Dig"},{level:20,move:"Crunch"},{level:24,move:"Sandstorm"},{level:28,move:"Take Down"},{level:32,move:"Roar"},{level:38,move:"Rest"},{level:44,move:"Earthquake"},{level:50,move:"Double-Edge"},{level:56,move:"Fissure"},{level:62,move:"Slack Off"}],
    tm: ["Body Slam","Take Down","Hyper Beam","Earthquake","Dig","Amnesia","Rest","Rock Slide","Substitute","Protect","Mud-Slap","Sandstorm","Endure","Sleep Talk","Sunny Day","Crunch","Facade","Helping Hand","Hyper Voice","Rock Tomb","Mud Shot","Earth Power","Giga Impact","Thunder Fang","Ice Fang","Fire Fang","Iron Head","Stone Edge","Stealth Rock","Heavy Slam","Bulldoze","Stomping Tantrum","Body Press","Tera Blast","Roar","Sand Tomb","High Horsepower","Double-Edge","Muddy Water","Scorching Sands","Curse","Hard Press"],
    egg: [],
    max: []
  },
  451: {
    levelUp: [{level:1,move:"Poison Sting"},{level:6,move:"Bite"},{level:11,move:"Venoshock"},{level:18,move:"Cross Poison"},{level:25,move:"Swords Dance"},{level:34,move:"X-Scissor"},{level:43,move:"Crunch"}],
    tm: [],
    egg: [],
    max: []
  },
  452: {
    levelUp: [{level:1,move:"Poison Sting"},{level:6,move:"Bite"},{level:11,move:"Venoshock"},{level:18,move:"Cross Poison"},{level:25,move:"Swords Dance"},{level:34,move:"X-Scissor"},{level:43,move:"Crunch"}],
    tm: [],
    egg: [],
    max: []
  },
  453: {
    levelUp: [{level:1,move:"Poison Sting"},{level:1,move:"Mud-Slap"},{level:4,move:"Astonish"},{level:8,move:"Taunt"},{level:12,move:"Flatter"},{level:16,move:"Low Kick"},{level:20,move:"Venoshock"},{level:24,move:"Sucker Punch"},{level:28,move:"Swagger"},{level:32,move:"Poison Jab"},{level:36,move:"Toxic"},{level:40,move:"Nasty Plot"},{level:44,move:"Sludge Bomb"},{level:48,move:"Belch"}],
    tm: ["Ice Punch","Thunder Punch","Take Down","Low Kick","Earthquake","Dig","Rest","Rock Slide","Substitute","Thief","Reversal","Protect","Scary Face","Sludge Bomb","Mud-Slap","Icy Wind","Endure","Sleep Talk","Baton Pass","Encore","Rain Dance","Sunny Day","Shadow Ball","Facade","Taunt","Helping Hand","Brick Break","Rock Tomb","Aerial Ace","Bulk Up","Mud Shot","Fling","Poison Jab","X-Scissor","Drain Punch","Focus Blast","Nasty Plot","Shadow Claw","Gunk Shot","Venoshock","Low Sweep","Acid Spray","Foul Play","Bulldoze","Tera Blast","Chilling Water","Toxic","Spite","Knock Off","Super Fang","Vacuum Wave","Focus Punch","Lash Out","Coaching","Sludge Wave","Upper Hand"],
    egg: ["Headbutt","Counter","Dynamic Punch","Cross Chop","Fake Out","Feint","Vacuum Wave","Bullet Punch","Quick Guard"],
    max: []
  },
  454: {
    levelUp: [{level:1,move:"Poison Sting"},{level:1,move:"Mud-Slap"},{level:1,move:"Taunt"},{level:1,move:"Astonish"},{level:12,move:"Flatter"},{level:16,move:"Low Kick"},{level:20,move:"Venoshock"},{level:24,move:"Sucker Punch"},{level:28,move:"Swagger"},{level:32,move:"Poison Jab"},{level:36,move:"Toxic"},{level:42,move:"Nasty Plot"},{level:48,move:"Sludge Bomb"},{level:54,move:"Belch"}],
    tm: ["Ice Punch","Thunder Punch","Swords Dance","Take Down","Hyper Beam","Low Kick","Earthquake","Dig","Rest","Rock Slide","Substitute","Thief","Reversal","Protect","Scary Face","Sludge Bomb","Mud-Slap","Icy Wind","Endure","Sleep Talk","Baton Pass","Encore","Rain Dance","Sunny Day","Shadow Ball","Facade","Taunt","Helping Hand","Brick Break","Rock Tomb","Aerial Ace","Bulk Up","Mud Shot","Close Combat","Fling","Poison Jab","Dark Pulse","X-Scissor","Drain Punch","Focus Blast","Giga Impact","Nasty Plot","Shadow Claw","Gunk Shot","Stone Edge","Venoshock","Low Sweep","Acid Spray","Foul Play","Bulldoze","Tera Blast","Chilling Water","Toxic","Spite","Knock Off","Super Fang","Vacuum Wave","Focus Punch","Lash Out","Coaching","Sludge Wave","Throat Chop","Upper Hand"],
    egg: [],
    max: []
  },
  455: {
    levelUp: [{level:1,move:"Absorb"},{level:6,move:"Acid Spray"},{level:11,move:"Bite"},{level:18,move:"Stun Spore"},{level:25,move:"Crunch"},{level:34,move:"Sleep Powder"},{level:43,move:"Energy Ball"}],
    tm: [],
    egg: [],
    max: []
  },
  456: {
    levelUp: [{level:1,move:"Pound"},{level:6,move:"Water Gun"},{level:13,move:"Rain Dance"},{level:17,move:"Gust"},{level:22,move:"Water Pulse"},{level:26,move:"Attract"},{level:29,move:"Safeguard"},{level:33,move:"Aqua Ring"},{level:38,move:"Whirlpool"},{level:42,move:"U-turn"},{level:45,move:"Bounce"},{level:49,move:"Tailwind"},{level:54,move:"Soak"}],
    tm: ["Take Down","Hydro Pump","Surf","Ice Beam","Blizzard","Psybeam","Agility","Confuse Ray","Waterfall","Swift","Rest","Substitute","Thief","Protect","Icy Wind","Endure","Charm","Sleep Talk","Rain Dance","Facade","Helping Hand","Water Pulse","Tailwind","U-turn","Acrobatics","Dazzling Gleam","Tera Blast","Chilling Water","Flip Turn","Psych Up","Whirlpool","Alluring Voice"],
    egg: ["Psybeam","Aurora Beam","Agility","Confuse Ray","Flail","Sweet Kiss","Charm","Tickle","Aqua Tail"],
    max: []
  },
  457: {
    levelUp: [{level:1,move:"Pound"},{level:1,move:"Gust"},{level:1,move:"Water Gun"},{level:1,move:"Soak"},{level:13,move:"Rain Dance"},{level:22,move:"Water Pulse"},{level:26,move:"Attract"},{level:29,move:"Safeguard"},{level:35,move:"Aqua Ring"},{level:42,move:"Whirlpool"},{level:48,move:"U-turn"},{level:53,move:"Bounce"},{level:59,move:"Tailwind"}],
    tm: ["Take Down","Hydro Pump","Surf","Ice Beam","Blizzard","Psybeam","Hyper Beam","Agility","Confuse Ray","Waterfall","Swift","Rest","Substitute","Thief","Protect","Icy Wind","Endure","Charm","Sleep Talk","Encore","Rain Dance","Facade","Helping Hand","Air Cutter","Water Pulse","Tailwind","U-turn","Air Slash","Giga Impact","Acrobatics","Dazzling Gleam","Tera Blast","Chilling Water","Flip Turn","Psych Up","Whirlpool","Alluring Voice"],
    egg: [],
    max: []
  },
  458: {
    levelUp: [{level:1,move:"Tackle"},{level:5,move:"Bubble"},{level:9,move:"Aerial Ace"},{level:15,move:"Water Pulse"},{level:21,move:"Air Slash"},{level:29,move:"Roost"},{level:37,move:"Hydro Pump"},{level:47,move:"Double-Edge"}],
    tm: [],
    egg: [],
    max: []
  },
  459: {
    levelUp: [{level:1,move:"Leer"},{level:1,move:"Powder Snow"},{level:5,move:"Leafage"},{level:10,move:"Mist"},{level:15,move:"Ice Shard"},{level:20,move:"Razor Leaf"},{level:25,move:"Icy Wind"},{level:30,move:"Swagger"},{level:35,move:"Ingrain"},{level:41,move:"Wood Hammer"},{level:45,move:"Blizzard"},{level:50,move:"Sheer Cold"}],
    tm: ["Ice Punch","Swords Dance","Body Slam","Take Down","Ice Beam","Blizzard","Solar Beam","Rest","Substitute","Protect","Mud-Slap","Icy Wind","Giga Drain","Endure","Sleep Talk","Rain Dance","Facade","Helping Hand","Bullet Seed","Magical Leaf","Water Pulse","Seed Bomb","Energy Ball","Avalanche","Leaf Storm","Grass Knot","Tera Blast","Ice Spinner","Snowscape","Trailblaze","Chilling Water","Icicle Spear","Weather Ball","Grassy Glide","Double-Edge","Curse"],
    egg: ["Stomp","Double-Edge","Leech Seed","Growth","Weather Ball"],
    max: []
  },
  460: {
    levelUp: [{level:0,move:"Ice Punch"},{level:1,move:"Leer"},{level:1,move:"Mist"},{level:1,move:"Powder Snow"},{level:1,move:"Leafage"},{level:1,move:"Aurora Veil"},{level:15,move:"Ice Shard"},{level:20,move:"Razor Leaf"},{level:25,move:"Icy Wind"},{level:30,move:"Swagger"},{level:35,move:"Ingrain"},{level:43,move:"Wood Hammer"},{level:49,move:"Blizzard"},{level:56,move:"Sheer Cold"}],
    tm: ["Ice Punch","Swords Dance","Body Slam","Take Down","Ice Beam","Blizzard","Hyper Beam","Low Kick","Solar Beam","Earthquake","Rest","Rock Slide","Substitute","Protect","Scary Face","Mud-Slap","Icy Wind","Outrage","Giga Drain","Endure","Sleep Talk","Rain Dance","Facade","Helping Hand","Brick Break","Rock Tomb","Bullet Seed","Magical Leaf","Water Pulse","Fling","Seed Bomb","Focus Blast","Energy Ball","Earth Power","Giga Impact","Avalanche","Leaf Storm","Grass Knot","Bulldoze","Stomping Tantrum","Body Press","Tera Blast","Ice Spinner","Snowscape","Trailblaze","Chilling Water","Icicle Spear","Focus Punch","Weather Ball","Grassy Glide","Double-Edge","Curse","Hard Press"],
    egg: [],
    max: []
  },
  461: {
    levelUp: [{level:1,move:"Scratch"},{level:1,move:"Leer"},{level:1,move:"Agility"},{level:1,move:"Quick Attack"},{level:1,move:"Assurance"},{level:1,move:"Taunt"},{level:1,move:"Slash"},{level:1,move:"Beat Up"},{level:1,move:"Ice Shard"},{level:18,move:"Metal Claw"},{level:24,move:"Icy Wind"},{level:30,move:"Fury Swipes"},{level:36,move:"Hone Claws"},{level:42,move:"Fling"},{level:48,move:"Nasty Plot"},{level:54,move:"Screech"},{level:60,move:"Night Slash"},{level:66,move:"Dark Pulse"}],
    tm: ["Ice Punch","Swords Dance","Take Down","Surf","Ice Beam","Blizzard","Hyper Beam","Low Kick","Dig","Agility","Metronome","Swift","Rest","Substitute","Thief","Protect","Scary Face","Icy Wind","Endure","False Swipe","Sleep Talk","Baton Pass","Metal Claw","Rain Dance","Sunny Day","Shadow Ball","Facade","Taunt","Helping Hand","Brick Break","Fake Tears","Aerial Ace","Calm Mind","Water Pulse","Fling","Poison Jab","Dark Pulse","X-Scissor","Focus Blast","Giga Impact","Nasty Plot","Avalanche","Shadow Claw","Low Sweep","Foul Play","Snarl","Tera Blast","Ice Spinner","Snowscape","Trailblaze","Chilling Water","Spite","Knock Off","Icicle Spear","Focus Punch","Lash Out","Triple Axel","Throat Chop","Upper Hand"],
    egg: [],
    max: []
  },
  462: {
    levelUp: [{level:1,move:"Electric Terrain"},{level:1,move:"Mirror Coat"},{level:1,move:"Magnetic Flux"},{level:1,move:"Tri Attack"},{level:1,move:"Tackle"},{level:1,move:"Thunder Wave"},{level:1,move:"Thunder Shock"},{level:1,move:"Supersonic"},{level:12,move:"Electro Ball"},{level:16,move:"Gyro Ball"},{level:20,move:"Spark"},{level:24,move:"Screech"},{level:28,move:"Magnet Rise"},{level:34,move:"Flash Cannon"},{level:40,move:"Discharge"},{level:46,move:"Metal Sound"},{level:52,move:"Light Screen"},{level:58,move:"Lock-On"},{level:64,move:"Zap Cannon"}],
    tm: ["Body Slam","Take Down","Hyper Beam","Thunderbolt","Thunder Wave","Thunder","Confuse Ray","Light Screen","Reflect","Swift","Rest","Substitute","Protect","Sandstorm","Endure","Sleep Talk","Rain Dance","Sunny Day","Facade","Helping Hand","Iron Defense","Giga Impact","Flash Cannon","Iron Head","Charge Beam","Heavy Slam","Electro Ball","Volt Switch","Wild Charge","Eerie Impulse","Electric Terrain","Body Press","Steel Beam","Tera Blast","Charge","Gravity","Gyro Ball","Double-Edge","Supercell Slam","Electroweb","Metal Sound","Hard Press"],
    egg: [],
    max: []
  },
  463: {
    levelUp: [{level:1,move:"Tackle"},{level:6,move:"Rest"},{level:11,move:"Bulldoze"},{level:18,move:"Zen Headbutt"},{level:25,move:"Double-Edge"},{level:34,move:"Rollout"},{level:43,move:"Giga Impact"}],
    tm: [],
    egg: [],
    max: []
  },
  464: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Tail Whip"},{level:1,move:"Hammer Arm"},{level:1,move:"Smack Down"},{level:1,move:"Bulldoze"},{level:15,move:"Horn Attack"},{level:20,move:"Scary Face"},{level:25,move:"Stomp"},{level:30,move:"Rock Blast"},{level:35,move:"Drill Run"},{level:40,move:"Take Down"},{level:47,move:"Earthquake"},{level:54,move:"Stone Edge"},{level:61,move:"Megahorn"},{level:68,move:"Horn Drill"},{level:75,move:"Rock Wrecker"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Swords Dance","Body Slam","Take Down","Double-Edge","Roar","Flamethrower","Hydro Pump","Surf","Ice Beam","Blizzard","Hyper Beam","Thunderbolt","Thunder","Earthquake","Dig","Fire Blast","Rest","Rock Slide","Substitute","Thief","Curse","Reversal","Protect","Scary Face","Mud-Slap","Icy Wind","Outrage","Sandstorm","Endure","Sleep Talk","Metal Claw","Rain Dance","Sunny Day","Crunch","Uproar","Facade","Focus Punch","Helping Hand","Brick Break","Endeavor","Rock Tomb","Iron Defense","Mud Shot","Rock Blast","Fling","Poison Jab","Dragon Pulse","Focus Blast","Earth Power","Giga Impact","Avalanche","Shadow Claw","Thunder Fang","Ice Fang","Fire Fang","Flash Cannon","Iron Head","Stone Edge","Stealth Rock","Smack Down","Heavy Slam","Bulldoze","Dragon Tail","Drill Run","Heat Crash","High Horsepower","Smart Strike","Stomping Tantrum","Body Press","Breaking Swipe","Meteor Beam","Scorching Sands","Tera Blast","Temper Flare","Supercell Slam"],
    egg: ["Counter","Curse","Metal Burst","Rock Polish","Dragon Rush","Guard Split"],
    max: []
  },
  465: {
    levelUp: [{level:1,move:"Absorb"},{level:6,move:"Stun Spore"},{level:11,move:"Poison Powder"},{level:15,move:"Acid Spray"},{level:18,move:"Double Hit"},{level:25,move:"Energy Ball"},{level:34,move:"Ancient Power"},{level:43,move:"Sleep Powder"},{level:52,move:"Sludge Bomb"}],
    tm: [],
    egg: [],
    max: []
  },
  466: {
    levelUp: [{level:1,move:"Leer"},{level:1,move:"Thunder Shock"},{level:1,move:"Quick Attack"},{level:1,move:"Charge"},{level:12,move:"Swift"},{level:16,move:"Shock Wave"},{level:20,move:"Thunder Wave"},{level:24,move:"Screech"},{level:28,move:"Thunder Punch"},{level:34,move:"Discharge"},{level:40,move:"Low Kick"},{level:46,move:"Thunderbolt"},{level:52,move:"Light Screen"},{level:58,move:"Thunder"},{level:64,move:"Giga Impact"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Take Down","Double-Edge","Flamethrower","Hyper Beam","Low Kick","Thunderbolt","Thunder Wave","Thunder","Earthquake","Dig","Psychic","Light Screen","Reflect","Metronome","Swift","Rest","Rock Slide","Substitute","Thief","Protect","Endure","Sleep Talk","Rain Dance","Uproar","Facade","Focus Punch","Charge","Taunt","Helping Hand","Brick Break","Knock Off","Weather Ball","Rock Tomb","Metal Sound","Bulk Up","Fling","Focus Blast","Giga Impact","Charge Beam","Electro Ball","Low Sweep","Volt Switch","Bulldoze","Electroweb","Wild Charge","Eerie Impulse","Electric Terrain","Stomping Tantrum","Tera Blast","Trailblaze","Supercell Slam"],
    egg: ["Dynamic Punch","Cross Chop","Focus Punch","Follow Me","Hammer Arm","Feint"],
    max: []
  },
  467: {
    levelUp: [{level:1,move:"Leer"},{level:1,move:"Ember"},{level:1,move:"Smokescreen"},{level:1,move:"Smog"},{level:12,move:"Clear Smog"},{level:16,move:"Flame Wheel"},{level:20,move:"Confuse Ray"},{level:24,move:"Scary Face"},{level:28,move:"Fire Punch"},{level:34,move:"Lava Plume"},{level:40,move:"Low Kick"},{level:46,move:"Flamethrower"},{level:52,move:"Sunny Day"},{level:58,move:"Fire Blast"},{level:64,move:"Hyper Beam"}],
    tm: ["Fire Punch","Thunder Punch","Body Slam","Take Down","Double-Edge","Roar","Flamethrower","Hyper Beam","Low Kick","Solar Beam","Fire Spin","Thunderbolt","Earthquake","Psychic","Confuse Ray","Metronome","Fire Blast","Rest","Rock Slide","Substitute","Thief","Curse","Protect","Scary Face","Endure","Sleep Talk","Sunny Day","Uproar","Heat Wave","Will-O-Wisp","Facade","Focus Punch","Taunt","Helping Hand","Brick Break","Knock Off","Hyper Voice","Weather Ball","Overheat","Rock Tomb","Fling","Flare Blitz","Poison Jab","Focus Blast","Giga Impact","Flame Charge","Low Sweep","Acid Spray","Bulldoze","Heat Crash","Stomping Tantrum","Burning Jealousy","Scorching Sands","Tera Blast","Temper Flare"],
    egg: ["Mach Punch","Belly Drum","Dynamic Punch","Cross Chop","Focus Punch","Follow Me","Belch"],
    max: []
  },
  468: {
    levelUp: [{level:1,move:"Tackle"},{level:6,move:"Fairy Wind"},{level:11,move:"Draining Kiss"},{level:11,move:"Air Cutter"},{level:18,move:"Calm Mind"},{level:25,move:"Baby-Doll Eyes"},{level:25,move:"Air Slash"},{level:34,move:"Extrasensory"},{level:43,move:"Moonblast"}],
    tm: [],
    egg: [],
    max: []
  },
  469: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Double Team"},{level:1,move:"Night Slash"},{level:1,move:"Air Slash"},{level:1,move:"Bug Buzz"},{level:14,move:"Quick Attack"},{level:17,move:"Detect"},{level:22,move:"Supersonic"},{level:27,move:"Uproar"},{level:30,move:"Bug Bite"},{level:33,move:"Ancient Power"},{level:38,move:"Feint"},{level:43,move:"Slash"},{level:46,move:"Screech"},{level:49,move:"U-turn"}],
    tm: ["Swords Dance","Take Down","Hyper Beam","Solar Beam","Psychic","Swift","Leech Life","Rest","Substitute","Thief","Reversal","Protect","Scary Face","Giga Drain","Endure","Sleep Talk","Sunny Day","Crunch","Shadow Ball","Uproar","Facade","Air Cutter","Aerial Ace","Tailwind","U-turn","Air Slash","Bug Buzz","Giga Impact","Bug Bite","Struggle Bug","Lunge","Dual Wingbeat","Tera Blast","Pounce","Psych Up","Double-Edge","Skitter Smack","Psychic Noise"],
    egg: ["Whirlwind","Double-Edge","Feint"],
    max: []
  },
  470: {
    levelUp: [{level:0,move:"Razor Leaf"},{level:1,move:"Swift"},{level:1,move:"Tackle"},{level:1,move:"Take Down"},{level:1,move:"Double-Edge"},{level:1,move:"Tail Whip"},{level:1,move:"Bite"},{level:1,move:"Growl"},{level:1,move:"Copycat"},{level:1,move:"Covet"},{level:1,move:"Helping Hand"},{level:1,move:"Charm"},{level:1,move:"Baton Pass"},{level:5,move:"Sand Attack"},{level:10,move:"Quick Attack"},{level:15,move:"Baby-Doll Eyes"},{level:20,move:"Leech Seed"},{level:25,move:"Magical Leaf"},{level:30,move:"Synthesis"},{level:35,move:"Sunny Day"},{level:40,move:"Giga Drain"},{level:45,move:"Swords Dance"},{level:50,move:"Leaf Blade"},{level:55,move:"Last Resort"}],
    tm: ["Swords Dance","Body Slam","Take Down","Hyper Beam","Solar Beam","Dig","Swift","Rest","Substitute","Protect","Mud-Slap","Giga Drain","Endure","Charm","Sleep Talk","Baton Pass","Rain Dance","Sunny Day","Shadow Ball","Facade","Helping Hand","Hyper Voice","Fake Tears","Bullet Seed","Aerial Ace","Mud Shot","Magical Leaf","Calm Mind","Seed Bomb","X-Scissor","Energy Ball","Giga Impact","Leaf Storm","Grass Knot","Stored Power","Tera Blast","Trailblaze","Roar","Knock Off","Solar Blade","Weather Ball","Grassy Glide","Double-Edge","Curse","Alluring Voice"],
    egg: [],
    max: []
  },
  471: {
    levelUp: [{level:0,move:"Icy Wind"},{level:1,move:"Charm"},{level:1,move:"Tackle"},{level:1,move:"Take Down"},{level:1,move:"Double-Edge"},{level:1,move:"Tail Whip"},{level:1,move:"Growl"},{level:1,move:"Swift"},{level:1,move:"Copycat"},{level:1,move:"Covet"},{level:1,move:"Baton Pass"},{level:1,move:"Helping Hand"},{level:5,move:"Sand Attack"},{level:10,move:"Quick Attack"},{level:15,move:"Baby-Doll Eyes"},{level:20,move:"Ice Shard"},{level:25,move:"Bite"},{level:30,move:"Ice Fang"},{level:35,move:"Snowscape"},{level:40,move:"Freeze-Dry"},{level:45,move:"Mirror Coat"},{level:50,move:"Blizzard"},{level:55,move:"Last Resort"}],
    tm: ["Body Slam","Take Down","Ice Beam","Blizzard","Hyper Beam","Dig","Swift","Rest","Substitute","Protect","Mud-Slap","Icy Wind","Endure","Charm","Sleep Talk","Baton Pass","Rain Dance","Sunny Day","Shadow Ball","Facade","Helping Hand","Hyper Voice","Fake Tears","Mud Shot","Calm Mind","Water Pulse","Giga Impact","Avalanche","Ice Fang","Stored Power","Tera Blast","Snowscape","Chilling Water","Roar","Haze","Gravity","Icicle Spear","Weather Ball","Double-Edge","Triple Axel","Curse","Alluring Voice"],
    egg: [],
    max: []
  },
  472: {
    levelUp: [{level:1,move:"Sand Attack"},{level:1,move:"Harden"},{level:1,move:"Poison Jab"},{level:1,move:"Thunder Fang"},{level:1,move:"Ice Fang"},{level:1,move:"Fire Fang"},{level:13,move:"Quick Attack"},{level:16,move:"Fury Cutter"},{level:19,move:"Knock Off"},{level:22,move:"Acrobatics"},{level:27,move:"Night Slash"},{level:30,move:"U-turn"},{level:35,move:"Screech"},{level:40,move:"X-Scissor"},{level:45,move:"Crabhammer"},{level:50,move:"Swords Dance"}],
    tm: ["Swords Dance","Take Down","Hyper Beam","Earthquake","Toxic","Agility","Swift","Rest","Rock Slide","Substitute","Thief","Protect","Scary Face","Sludge Bomb","Mud-Slap","Spikes","Sandstorm","Endure","False Swipe","Sleep Talk","Baton Pass","Metal Claw","Rain Dance","Sunny Day","Crunch","Facade","Taunt","Brick Break","Knock Off","Rock Tomb","Sand Tomb","Aerial Ace","Mud Shot","Poison Tail","Tailwind","U-turn","Fling","Toxic Spikes","Poison Jab","Dark Pulse","X-Scissor","Earth Power","Giga Impact","Thunder Fang","Ice Fang","Fire Fang","Gunk Shot","Stone Edge","Stealth Rock","Venoshock","Acrobatics","Struggle Bug","Bulldoze","High Horsepower","Lunge","Psychic Fangs","Dual Wingbeat","Tera Blast","Scale Shot","Double-Edge","Skitter Smack","Throat Chop","Breaking Swipe"],
    egg: ["Wing Attack","Double-Edge","Counter","Feint","Night Slash","Cross Poison"],
    max: []
  },
  473: {
    levelUp: [{level:0,move:"Double Hit"},{level:1,move:"Tackle"},{level:1,move:"Flail"},{level:1,move:"Powder Snow"},{level:1,move:"Mud-Slap"},{level:1,move:"Ancient Power"},{level:1,move:"Ice Fang"},{level:15,move:"Ice Shard"},{level:20,move:"Mist"},{level:25,move:"Endure"},{level:30,move:"Icy Wind"},{level:37,move:"Amnesia"},{level:44,move:"Take Down"},{level:51,move:"Earthquake"},{level:58,move:"Blizzard"},{level:65,move:"Thrash"}],
    tm: ["Body Slam","Take Down","Roar","Ice Beam","Blizzard","Hyper Beam","Earthquake","Dig","Haze","Reflect","Amnesia","Rest","Rock Slide","Substitute","Reversal","Protect","Scary Face","Mud-Slap","Icy Wind","Sandstorm","Endure","Charm","Sleep Talk","Rain Dance","Facade","Knock Off","Rock Tomb","Sand Tomb","Icicle Spear","Mud Shot","Rock Blast","Earth Power","Giga Impact","Avalanche","Ice Fang","Iron Head","Stone Edge","Stealth Rock","Smack Down","Heavy Slam","Bulldoze","High Horsepower","Stomping Tantrum","Body Press","Tera Blast","Snowscape","Trailblaze","Double-Edge","Endeavor","Throat Chop","Curse","Hard Press"],
    egg: ["Double-Edge","Bite","Fissure","Curse","Ancient Power","Icicle Crash","Freeze-Dry"],
    max: []
  },
  474: {
    levelUp: [{level:1,move:"Conversion"},{level:1,move:"Nasty Plot"},{level:1,move:"Magnet Rise"},{level:1,move:"Recycle"},{level:1,move:"Trick Room"},{level:1,move:"Defense Curl"},{level:1,move:"Tackle"},{level:15,move:"Thunder Shock"},{level:20,move:"Psybeam"},{level:25,move:"Conversion 2"},{level:30,move:"Agility"},{level:35,move:"Recover"},{level:40,move:"Discharge"},{level:45,move:"Tri Attack"},{level:50,move:"Double-Edge"},{level:55,move:"Lock-On"},{level:60,move:"Zap Cannon"},{level:65,move:"Hyper Beam"}],
    tm: ["Take Down","Double-Edge","Ice Beam","Blizzard","Psybeam","Hyper Beam","Solar Beam","Thunderbolt","Thunder Wave","Thunder","Psychic","Agility","Swift","Rest","Substitute","Thief","Protect","Icy Wind","Endure","Sleep Talk","Rain Dance","Sunny Day","Shadow Ball","Uproar","Facade","Charge","Trick","Gravity","Dark Pulse","Giga Impact","Nasty Plot","Zen Headbutt","Trick Room","Charge Beam","Psyshock","Foul Play","Electroweb","Eerie Impulse","Tera Blast"],
    egg: [],
    max: []
  },
  475: {
    levelUp: [{level:0,move:"Slash"},{level:1,move:"Night Slash"},{level:1,move:"Imprison"},{level:1,move:"Life Dew"},{level:1,move:"Future Sight"},{level:1,move:"Fury Cutter"},{level:1,move:"Sacred Sword"},{level:1,move:"Charm"},{level:1,move:"Disarming Voice"},{level:1,move:"Calm Mind"},{level:1,move:"Leaf Blade"},{level:1,move:"Double Team"},{level:1,move:"Draining Kiss"},{level:1,move:"Hypnosis"},{level:1,move:"Psychic"},{level:1,move:"Confusion"},{level:1,move:"Psybeam"},{level:1,move:"Growl"},{level:1,move:"Leer"},{level:1,move:"Dream Eater"},{level:1,move:"Aqua Cutter"},{level:9,move:"Helping Hand"},{level:12,move:"Feint"},{level:15,move:"Teleport"},{level:18,move:"Aerial Ace"},{level:23,move:"False Swipe"},{level:28,move:"Protect"},{level:35,move:"Swords Dance"},{level:42,move:"Psycho Cut"},{level:49,move:"Heal Pulse"},{level:56,move:"Wide Guard"},{level:56,move:"Quick Guard"},{level:63,move:"Close Combat"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Swords Dance","Body Slam","Take Down","Psybeam","Hyper Beam","Low Kick","Thunderbolt","Thunder Wave","Earthquake","Psychic","Agility","Night Shade","Confuse Ray","Light Screen","Reflect","Swift","Rest","Rock Slide","Substitute","Thief","Reversal","Protect","Icy Wind","Endure","Charm","False Swipe","Sleep Talk","Encore","Rain Dance","Sunny Day","Shadow Ball","Will-O-Wisp","Facade","Taunt","Helping Hand","Trick","Brick Break","Skill Swap","Imprison","Hyper Voice","Rock Tomb","Aerial Ace","Bulk Up","Magical Leaf","Calm Mind","Close Combat","Fling","Aura Sphere","Poison Jab","Air Slash","X-Scissor","Drain Punch","Focus Blast","Energy Ball","Giga Impact","Shadow Claw","Zen Headbutt","Trick Room","Stone Edge","Grass Knot","Charge Beam","Psyshock","Low Sweep","Stored Power","Hex","Bulldoze","Disarming Voice","Draining Kiss","Misty Terrain","Dazzling Gleam","Psychic Terrain","Tera Blast","Knock Off","Vacuum Wave","Solar Blade","Focus Punch","Pain Split","Psych Up","Triple Axel","Coaching","Future Sight","Expanding Force","Throat Chop","Alluring Voice","Upper Hand"],
    egg: [],
    max: []
  },
  476: {
    levelUp: [{level:0,move:"Tri Attack"},{level:1,move:"Magnetic Flux"},{level:1,move:"Magnet Rise"},{level:1,move:"Gravity"},{level:1,move:"Block"},{level:1,move:"Wide Guard"},{level:1,move:"Iron Defense"},{level:1,move:"Tackle"},{level:13,move:"Thunder Wave"},{level:16,move:"Rest"},{level:19,move:"Spark"},{level:22,move:"Rock Slide"},{level:25,move:"Power Gem"},{level:28,move:"Rock Blast"},{level:31,move:"Discharge"},{level:34,move:"Sandstorm"},{level:37,move:"Earth Power"},{level:40,move:"Stone Edge"},{level:43,move:"Zap Cannon"},{level:43,move:"Lock-On"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Take Down","Hyper Beam","Thunderbolt","Thunder Wave","Thunder","Earthquake","Rest","Rock Slide","Substitute","Protect","Sandstorm","Endure","Sleep Talk","Sunny Day","Facade","Taunt","Helping Hand","Rock Tomb","Sand Tomb","Iron Defense","Rock Blast","Gravity","Power Gem","Earth Power","Giga Impact","Flash Cannon","Iron Head","Stone Edge","Stealth Rock","Smack Down","Heavy Slam","Volt Switch","Bulldoze","Dazzling Gleam","High Horsepower","Stomping Tantrum","Body Press","Steel Beam","Tera Blast","Pain Split","Double-Edge","Supercell Slam","Meteor Beam","Metal Sound","Curse","Hard Press"],
    egg: ["Double-Edge","Rollout","Head Smash","Wide Guard"],
    max: []
  },
  477: {
    levelUp: [{level:1,move:"Fire Punch"},{level:1,move:"Ice Punch"},{level:1,move:"Thunder Punch"},{level:1,move:"Bind"},{level:1,move:"Leer"},{level:1,move:"Disable"},{level:1,move:"Shadow Sneak"},{level:1,move:"Gravity"},{level:1,move:"Shadow Punch"},{level:1,move:"Astonish"},{level:12,move:"Confuse Ray"},{level:16,move:"Night Shade"},{level:20,move:"Payback"},{level:24,move:"Will-O-Wisp"},{level:28,move:"Mean Look"},{level:32,move:"Hex"},{level:36,move:"Curse"},{level:42,move:"Shadow Ball"},{level:48,move:"Future Sight"},{level:54,move:"Destiny Bond"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Ice Beam","Blizzard","Hyper Beam","Earthquake","Psychic","Night Shade","Confuse Ray","Haze","Metronome","Swift","Leech Life","Rest","Rock Slide","Substitute","Thief","Spite","Protect","Icy Wind","Endure","Sleep Talk","Rain Dance","Sunny Day","Shadow Ball","Will-O-Wisp","Facade","Focus Punch","Taunt","Helping Hand","Trick","Brick Break","Skill Swap","Imprison","Rock Tomb","Calm Mind","Gravity","Fling","Dark Pulse","Focus Blast","Giga Impact","Trick Room","Charge Beam","Hex","Phantom Force","Poltergeist","Tera Blast","Pain Split","Psych Up","Future Sight","Skitter Smack","Curse","Hard Press"],
    egg: ["Haze","Pain Split","Memento"],
    max: []
  },
  478: {
    levelUp: [{level:0,move:"Hex"},{level:1,move:"Crunch"},{level:1,move:"Ice Fang"},{level:1,move:"Astonish"},{level:1,move:"Destiny Bond"},{level:1,move:"Protect"},{level:1,move:"Headbutt"},{level:1,move:"Double Team"},{level:1,move:"Bite"},{level:1,move:"Leer"},{level:1,move:"Powder Snow"},{level:15,move:"Ice Shard"},{level:20,move:"Draining Kiss"},{level:25,move:"Icy Wind"},{level:30,move:"Frost Breath"},{level:35,move:"Confuse Ray"},{level:40,move:"Snowscape"},{level:47,move:"Will-O-Wisp"},{level:54,move:"Aurora Veil"},{level:61,move:"Shadow Ball"},{level:68,move:"Blizzard"}],
    tm: ["Ice Punch","Body Slam","Take Down","Ice Beam","Blizzard","Hyper Beam","Thunderbolt","Thunder Wave","Thunder","Psychic","Night Shade","Confuse Ray","Light Screen","Reflect","Rest","Substitute","Protect","Scary Face","Spikes","Icy Wind","Endure","Charm","Sleep Talk","Rain Dance","Crunch","Shadow Ball","Will-O-Wisp","Facade","Taunt","Helping Hand","Trick","Imprison","Fake Tears","Water Pulse","Fling","Giga Impact","Avalanche","Ice Fang","Hex","Draining Kiss","Tera Blast","Ice Spinner","Snowscape","Chilling Water","Haze","Spite","Icicle Spear","Weather Ball","Poltergeist","Pain Split","Psych Up","Triple Axel","Curse"],
    egg: [],
    max: []
  },
  479: {
    levelUp: [{level:1,move:"Double Team"},{level:1,move:"Astonish"},{level:5,move:"Thunder Shock"},{level:10,move:"Confuse Ray"},{level:15,move:"Charge"},{level:20,move:"Electro Ball"},{level:25,move:"Thunder Wave"},{level:30,move:"Shock Wave"},{level:35,move:"Hex"},{level:40,move:"Substitute"},{level:45,move:"Trick"},{level:50,move:"Discharge"},{level:55,move:"Uproar"}],
    tm: ["Thunderbolt","Thunder Wave","Thunder","Night Shade","Confuse Ray","Light Screen","Reflect","Swift","Rest","Substitute","Thief","Protect","Endure","Sleep Talk","Rain Dance","Sunny Day","Shadow Ball","Will-O-Wisp","Facade","Helping Hand","Trick","Hyper Voice","Dark Pulse","Nasty Plot","Charge Beam","Electro Ball","Foul Play","Stored Power","Hex","Volt Switch","Eerie Impulse","Electric Terrain","Tera Blast","Charge","Spite","Uproar","Poltergeist","Pain Split","Electroweb"],
    egg: [],
    max: []
  },
  480: {
    levelUp: [{level:1,move:"Confusion"},{level:1,move:"Rest"},{level:7,move:"Swift"},{level:14,move:"Endure"},{level:21,move:"Psybeam"},{level:28,move:"Imprison"},{level:35,move:"Extrasensory"},{level:42,move:"Amnesia"},{level:49,move:"Psychic"},{level:56,move:"Yawn"},{level:63,move:"Future Sight"},{level:70,move:"Flail"},{level:77,move:"Memento"},{level:84,move:"Mystical Power"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Psybeam","Hyper Beam","Solar Beam","Thunderbolt","Thunder Wave","Thunder","Psychic","Confuse Ray","Light Screen","Reflect","Metronome","Swift","Amnesia","Rest","Substitute","Protect","Mud-Slap","Sandstorm","Giga Drain","Endure","Sleep Talk","Baton Pass","Encore","Rain Dance","Sunny Day","Shadow Ball","Facade","Helping Hand","Trick","Skill Swap","Imprison","Calm Mind","Water Pulse","U-turn","Fling","Drain Punch","Energy Ball","Giga Impact","Nasty Plot","Zen Headbutt","Trick Room","Stealth Rock","Grass Knot","Charge Beam","Psyshock","Foul Play","Stored Power","Acrobatics","Draining Kiss","Play Rough","Dazzling Gleam","Tera Blast","Knock Off","Pain Split","Psych Up","Future Sight","Expanding Force","Psychic Noise"],
    egg: [],
    max: []
  },
  481: {
    levelUp: [{level:1,move:"Confusion"},{level:1,move:"Rest"},{level:7,move:"Swift"},{level:14,move:"Protect"},{level:21,move:"Psybeam"},{level:28,move:"Imprison"},{level:35,move:"Extrasensory"},{level:42,move:"Charm"},{level:49,move:"Psychic"},{level:56,move:"Flatter"},{level:63,move:"Future Sight"},{level:70,move:"Copycat"},{level:77,move:"Healing Wish"},{level:84,move:"Mystical Power"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Ice Beam","Blizzard","Psybeam","Hyper Beam","Thunderbolt","Thunder Wave","Thunder","Psychic","Confuse Ray","Light Screen","Reflect","Metronome","Swift","Rest","Substitute","Protect","Sandstorm","Endure","Charm","Sleep Talk","Baton Pass","Encore","Rain Dance","Sunny Day","Shadow Ball","Facade","Helping Hand","Trick","Skill Swap","Imprison","Calm Mind","Water Pulse","U-turn","Fling","Drain Punch","Energy Ball","Giga Impact","Nasty Plot","Zen Headbutt","Trick Room","Stealth Rock","Grass Knot","Charge Beam","Psyshock","Stored Power","Acrobatics","Draining Kiss","Play Rough","Dazzling Gleam","Tera Blast","Knock Off","Pain Split","Psych Up","Double-Edge","Future Sight","Expanding Force","Psychic Noise"],
    egg: [],
    max: []
  },
  482: {
    levelUp: [{level:1,move:"Confusion"},{level:1,move:"Rest"},{level:7,move:"Swift"},{level:14,move:"Detect"},{level:21,move:"Psybeam"},{level:28,move:"Imprison"},{level:35,move:"Extrasensory"},{level:42,move:"Nasty Plot"},{level:49,move:"Psychic"},{level:56,move:"Uproar"},{level:63,move:"Future Sight"},{level:70,move:"Last Resort"},{level:77,move:"Explosion"},{level:84,move:"Mystical Power"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Flamethrower","Psybeam","Hyper Beam","Thunderbolt","Thunder Wave","Thunder","Psychic","Light Screen","Reflect","Metronome","Fire Blast","Swift","Rest","Substitute","Protect","Mud-Slap","Sandstorm","Endure","Sleep Talk","Baton Pass","Encore","Rain Dance","Sunny Day","Shadow Ball","Facade","Taunt","Helping Hand","Trick","Skill Swap","Imprison","Calm Mind","Water Pulse","U-turn","Fling","Drain Punch","Energy Ball","Giga Impact","Nasty Plot","Zen Headbutt","Trick Room","Stealth Rock","Grass Knot","Charge Beam","Psyshock","Stored Power","Acrobatics","Draining Kiss","Play Rough","Dazzling Gleam","Tera Blast","Knock Off","Uproar","Psych Up","Double-Edge","Endeavor","Future Sight","Expanding Force"],
    egg: [],
    max: []
  },
  483: {
    levelUp: [{level:1,move:"Scary Face"},{level:1,move:"Metal Claw"},{level:8,move:"Dragon Breath"},{level:16,move:"Ancient Power"},{level:24,move:"Slash"},{level:32,move:"Flash Cannon"},{level:40,move:"Dragon Claw"},{level:48,move:"Aura Sphere"},{level:56,move:"Power Gem"},{level:64,move:"Metal Burst"},{level:72,move:"Earth Power"},{level:80,move:"Iron Tail"},{level:88,move:"Roar of Time"}],
    tm: ["Body Slam","Take Down","Flamethrower","Ice Beam","Blizzard","Hyper Beam","Thunderbolt","Thunder Wave","Thunder","Earthquake","Fire Blast","Swift","Rest","Rock Slide","Substitute","Protect","Scary Face","Outrage","Sandstorm","Endure","Sleep Talk","Metal Claw","Rain Dance","Sunny Day","Facade","Trick","Brick Break","Hyper Voice","Overheat","Rock Tomb","Iron Defense","Dragon Claw","Bulk Up","Aura Sphere","Dragon Pulse","Power Gem","Focus Blast","Earth Power","Giga Impact","Shadow Claw","Flash Cannon","Trick Room","Draco Meteor","Iron Head","Stone Edge","Stealth Rock","Heavy Slam","Bulldoze","Dragon Tail","Stomping Tantrum","Body Press","Steel Beam","Tera Blast","Roar","Gravity","Scale Shot","Psych Up","Breaking Swipe","Metal Sound"],
    egg: [],
    max: []
  },
  484: {
    levelUp: [{level:1,move:"Scary Face"},{level:1,move:"Water Pulse"},{level:8,move:"Dragon Breath"},{level:16,move:"Ancient Power"},{level:24,move:"Slash"},{level:32,move:"Aqua Ring"},{level:48,move:"Aura Sphere"},{level:56,move:"Power Gem"},{level:64,move:"Aqua Tail"},{level:72,move:"Earth Power"},{level:80,move:"Spacial Rend"},{level:88,move:"Hydro Pump"}],
    tm: ["Body Slam","Take Down","Flamethrower","Hydro Pump","Surf","Ice Beam","Blizzard","Hyper Beam","Thunderbolt","Thunder Wave","Thunder","Earthquake","Fire Blast","Waterfall","Swift","Rest","Rock Slide","Substitute","Protect","Scary Face","Icy Wind","Outrage","Sandstorm","Endure","Sleep Talk","Rain Dance","Sunny Day","Facade","Trick","Brick Break","Hyper Voice","Rock Tomb","Aerial Ace","Dragon Claw","Bulk Up","Water Pulse","Fling","Aura Sphere","Dragon Pulse","Power Gem","Focus Blast","Earth Power","Giga Impact","Avalanche","Shadow Claw","Trick Room","Draco Meteor","Stone Edge","Heavy Slam","Bulldoze","Dragon Tail","Stomping Tantrum","Liquidation","Body Press","Tera Blast","Snowscape","Chilling Water","Roar","Gravity","Dual Wingbeat","Scale Shot","Psych Up","Whirlpool","Breaking Swipe"],
    egg: [],
    max: []
  },
  485: {
    levelUp: [{level:1,move:"Leer"},{level:1,move:"Fire Spin"},{level:6,move:"Metal Claw"},{level:12,move:"Ancient Power"},{level:18,move:"Fire Fang"},{level:24,move:"Scary Face"},{level:30,move:"Iron Head"},{level:36,move:"Crunch"},{level:42,move:"Lava Plume"},{level:48,move:"Metal Sound"},{level:54,move:"Earth Power"},{level:60,move:"Heat Wave"},{level:66,move:"Stone Edge"},{level:72,move:"Magma Storm"}],
    tm: ["Body Slam","Take Down","Flamethrower","Hyper Beam","Solar Beam","Fire Spin","Earthquake","Dig","Fire Blast","Rest","Rock Slide","Substitute","Protect","Scary Face","Sandstorm","Endure","Sleep Talk","Metal Claw","Sunny Day","Crunch","Heat Wave","Will-O-Wisp","Facade","Taunt","Overheat","Rock Tomb","Iron Defense","Rock Blast","Flare Blitz","Dark Pulse","Dragon Pulse","Power Gem","Earth Power","Giga Impact","Fire Fang","Flash Cannon","Iron Head","Stone Edge","Stealth Rock","Heavy Slam","Flame Charge","Bulldoze","Stomping Tantrum","Body Press","Steel Beam","Tera Blast","Pounce","Lunge","Heat Crash","Burning Jealousy","Scorching Sands","Metal Sound","Hard Press"],
    egg: [],
    max: []
  },
  486: {
    levelUp: [{level:1,move:"Pound"},{level:1,move:"Confuse Ray"},{level:6,move:"Payback"},{level:12,move:"Facade"},{level:18,move:"Stomp"},{level:24,move:"Protect"},{level:30,move:"Knock Off"},{level:36,move:"Mega Punch"},{level:42,move:"Body Press"},{level:48,move:"Wide Guard"},{level:54,move:"Zen Headbutt"},{level:60,move:"Heavy Slam"},{level:66,move:"Hammer Arm"},{level:72,move:"Giga Impact"},{level:78,move:"Crush Grip"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Body Slam","Double-Edge","Hyper Beam","Thunderbolt","Thunder Wave","Thunder","Earthquake","Confuse Ray","Rest","Rock Slide","Substitute","Protect","Icy Wind","Endure","Sleep Talk","Rain Dance","Sunny Day","Facade","Focus Punch","Brick Break","Knock Off","Rock Tomb","Gravity","Fling","Drain Punch","Focus Blast","Earth Power","Giga Impact","Avalanche","Zen Headbutt","Iron Head","Stone Edge","Smack Down","Heavy Slam","Bulldoze","Heat Crash","High Horsepower","Stomping Tantrum","Body Press","Tera Blast","Hard Press"],
    egg: [],
    max: []
  },
  487: {
    levelUp: [{level:1,move:"Shadow Sneak"},{level:1,move:"Defog"},{level:7,move:"Dragon Breath"},{level:14,move:"Ancient Power"},{level:21,move:"Hex"},{level:28,move:"Slash"},{level:35,move:"Scary Face"},{level:42,move:"Shadow Claw"},{level:49,move:"Pain Split"},{level:56,move:"Aura Sphere"},{level:63,move:"Dragon Claw"},{level:70,move:"Earth Power"},{level:77,move:"Shadow Force"},{level:84,move:"Destiny Bond"}],
    tm: ["Fly","Body Slam","Take Down","Hyper Beam","Thunderbolt","Thunder Wave","Thunder","Earthquake","Psychic","Confuse Ray","Swift","Rest","Substitute","Protect","Scary Face","Icy Wind","Outrage","Endure","Sleep Talk","Rain Dance","Sunny Day","Shadow Ball","Will-O-Wisp","Facade","Hyper Voice","Dragon Claw","Calm Mind","Aura Sphere","Dark Pulse","Dragon Pulse","Energy Ball","Earth Power","Giga Impact","Shadow Claw","Draco Meteor","Iron Head","Stone Edge","Hex","Bulldoze","Dragon Tail","Phantom Force","Tera Blast","Roar","Spite","Gravity","Dual Wingbeat","Poltergeist","Pain Split","Skitter Smack","Breaking Swipe","Curse"],
    egg: [],
    max: []
  },
  488: {
    levelUp: [{level:1,move:"Confusion"},{level:1,move:"Double Team"},{level:6,move:"Mist"},{level:12,move:"Aurora Beam"},{level:18,move:"Psybeam"},{level:24,move:"Ally Switch"},{level:30,move:"Slash"},{level:36,move:"Psycho Cut"},{level:42,move:"Moonlight"},{level:48,move:"Safeguard"},{level:54,move:"Psychic"},{level:60,move:"Moonblast"},{level:66,move:"Future Sight"},{level:72,move:"Lunar Dance"},{level:72,move:"Lunar Blessing"}],
    tm: ["Body Slam","Ice Beam","Psybeam","Hyper Beam","Solar Beam","Thunderbolt","Thunder Wave","Thunder","Psychic","Confuse Ray","Light Screen","Reflect","Swift","Rest","Substitute","Protect","Scary Face","Mud-Slap","Icy Wind","Endure","Sleep Talk","Rain Dance","Sunny Day","Shadow Ball","Facade","Helping Hand","Trick","Skill Swap","Calm Mind","Power Gem","Energy Ball","Giga Impact","Zen Headbutt","Trick Room","Grass Knot","Charge Beam","Psyshock","Stored Power","Dazzling Gleam","Psychic Terrain","Tera Blast","Gravity","Psych Up","Future Sight","Expanding Force"],
    egg: [],
    max: []
  },
  489: {
    levelUp: [{level:1,move:"Water Gun"},{level:9,move:"Charm"},{level:16,move:"Supersonic"},{level:24,move:"Bubble Beam"},{level:31,move:"Acid Armor"},{level:39,move:"Whirlpool"},{level:46,move:"Water Pulse"},{level:54,move:"Aqua Ring"},{level:61,move:"Dive"},{level:69,move:"Rain Dance"},{level:75,move:"Take Heart"}],
    tm: ["Haze","Knock Off","Scald","Weather Ball","Flip Turn","Hydro Pump","Surf","Ice Beam","Blizzard","Waterfall","Swift","Rest","Substitute","Protect","Icy Wind","Endure","Charm","Sleep Talk","Baton Pass","Rain Dance","Psych Up","Whirlpool","Facade","Helping Hand","Water Pulse","U-turn","Fling","Zen Headbutt","Grass Knot","Disarming Voice","Dazzling Gleam","Liquidation","Tera Blast","Chilling Water","Alluring Voice"],
    egg: [],
    max: []
  },
  490: {
    levelUp: [{level:1,move:"Water Gun"},{level:1,move:"Tail Glow"},{level:1,move:"Heart Swap"},{level:9,move:"Charm"},{level:16,move:"Supersonic"},{level:24,move:"Bubble Beam"},{level:31,move:"Acid Armor"},{level:39,move:"Whirlpool"},{level:46,move:"Water Pulse"},{level:54,move:"Aqua Ring"},{level:61,move:"Dive"},{level:69,move:"Rain Dance"},{level:76,move:"Take Heart"}],
    tm: ["Haze","Knock Off","Scald","Weather Ball","Flip Turn","Hydro Pump","Surf","Ice Beam","Blizzard","Psybeam","Hyper Beam","Psychic","Light Screen","Reflect","Waterfall","Swift","Rest","Substitute","Protect","Mud-Slap","Icy Wind","Endure","Charm","Sleep Talk","Baton Pass","Rain Dance","Psych Up","Shadow Ball","Whirlpool","Facade","Helping Hand","Skill Swap","Fake Tears","Calm Mind","Water Pulse","U-turn","Fling","Energy Ball","Giga Impact","Zen Headbutt","Grass Knot","Stored Power","Disarming Voice","Dazzling Gleam","Liquidation","Tera Blast","Chilling Water","Alluring Voice"],
    egg: [],
    max: []
  },
  491: {
    levelUp: [{level:1,move:"Disable"},{level:11,move:"Quick Attack"},{level:20,move:"Hypnosis"},{level:29,move:"Sucker Punch"},{level:38,move:"Night Shade"},{level:47,move:"Double Team"},{level:57,move:"Haze"},{level:66,move:"Dark Void"},{level:75,move:"Nasty Plot"},{level:84,move:"Dream Eater"},{level:93,move:"Dark Pulse"}],
    tm: ["Haze","Spite","Knock Off","Focus Punch","Lash Out","Swords Dance","Ice Beam","Blizzard","Hyper Beam","Thunder Wave","Thunder","Psychic","Night Shade","Confuse Ray","Swift","Rest","Rock Slide","Substitute","Thief","Curse","Protect","Scary Face","Sludge Bomb","Icy Wind","Endure","Sleep Talk","Rain Dance","Sunny Day","Psych Up","Shadow Ball","Will-O-Wisp","Facade","Taunt","Trick","Brick Break","Rock Tomb","Calm Mind","Fling","Poison Jab","Dark Pulse","X-Scissor","Drain Punch","Focus Blast","Giga Impact","Nasty Plot","Shadow Claw","Charge Beam","Psyshock","Foul Play","Hex","Snarl","Throat Chop","Tera Blast"],
    egg: [],
    max: []
  },
  492: {
    levelUp: [{level:1,move:"Growth"},{level:10,move:"Magical Leaf"},{level:19,move:"Leech Seed"},{level:28,move:"Synthesis"},{level:37,move:"Sweet Scent"},{level:46,move:"Play Rough"},{level:55,move:"Worry Seed"},{level:64,move:"Grassy Terrain"},{level:73,move:"Energy Ball"},{level:82,move:"Sweet Kiss"},{level:91,move:"Healing Wish"},{level:100,move:"Seed Flare"}],
    tm: ["Grassy Glide","Swords Dance","Take Down","Double-Edge","Hyper Beam","Solar Beam","Psychic","Swift","Rest","Substitute","Protect","Giga Drain","Endure","Sleep Talk","Baton Pass","Sunny Day","Psych Up","Facade","Endeavor","Air Cutter","Bullet Seed","Magical Leaf","Tailwind","Seed Bomb","Air Slash","Energy Ball","Earth Power","Giga Impact","Zen Headbutt","Leaf Storm","Grass Knot","Petal Blizzard","Disarming Voice","Grassy Terrain","Play Rough","Dazzling Gleam","Tera Blast","Trailblaze"],
    egg: [],
    max: []
  },
  493: {
    levelUp: [{level:1,move:"Seismic Toss"},{level:1,move:"Cosmic Power"},{level:10,move:"Gravity"},{level:20,move:"Earth Power"},{level:30,move:"Hyper Voice"},{level:40,move:"Extreme Speed"},{level:50,move:"Healing Wish"},{level:60,move:"Future Sight"},{level:70,move:"Recover"},{level:80,move:"Hyper Beam"},{level:90,move:"Perish Song"},{level:100,move:"Judgment"}],
    tm: ["Swords Dance","Fly","Body Slam","Take Down","Flamethrower","Hydro Pump","Surf","Ice Beam","Blizzard","Hyper Beam","Solar Beam","Thunderbolt","Thunder Wave","Thunder","Earthquake","Psychic","Agility","Confuse Ray","Light Screen","Reflect","Fire Blast","Waterfall","Swift","Rest","Rock Slide","Substitute","Protect","Scary Face","Sludge Bomb","Icy Wind","Outrage","Sandstorm","Giga Drain","Endure","Sleep Talk","Rain Dance","Sunny Day","Shadow Ball","Heat Wave","Will-O-Wisp","Facade","Taunt","Trick","Brick Break","Imprison","Hyper Voice","Overheat","Rock Tomb","Bullet Seed","Iron Defense","Dragon Claw","Bulk Up","Magical Leaf","Calm Mind","Dragon Dance","Water Pulse","Tailwind","Flare Blitz","Aura Sphere","Poison Jab","Dark Pulse","Air Slash","X-Scissor","Bug Buzz","Dragon Pulse","Power Gem","Focus Blast","Energy Ball","Earth Power","Giga Impact","Avalanche","Shadow Claw","Zen Headbutt","Flash Cannon","Trick Room","Draco Meteor","Gunk Shot","Iron Head","Stone Edge","Stealth Rock","Grass Knot","Charge Beam","Psyshock","Heavy Slam","Acid Spray","Foul Play","Stored Power","Hex","Bulldoze","Dragon Tail","Wild Charge","Hurricane","Snarl","Phantom Force","Grassy Terrain","Misty Terrain","Electric Terrain","Dazzling Gleam","Psychic Terrain","Stomping Tantrum","Liquidation","Body Press","Steel Beam","Tera Blast","Trailblaze","Chilling Water","Roar","Gravity","Psych Up","Double-Edge","Supercell Slam","Scorching Sands","Future Sight","Meteor Beam"],
    egg: [],
    max: []
  },
  501: {
    levelUp: [{level:1,move:"Tackle"},{level:5,move:"Tail Whip"},{level:7,move:"Water Gun"},{level:11,move:"Soak"},{level:13,move:"Focus Energy"},{level:17,move:"Razor Shell"},{level:19,move:"Fury Cutter"},{level:23,move:"Water Pulse"},{level:25,move:"Aerial Ace"},{level:29,move:"Aqua Jet"},{level:31,move:"Encore"},{level:35,move:"Aqua Tail"},{level:37,move:"Retaliate"},{level:41,move:"Swords Dance"},{level:43,move:"Hydro Pump"}],
    tm: ["Swords Dance","Take Down","Hydro Pump","Surf","Ice Beam","Blizzard","Dig","Waterfall","Swift","Rest","Substitute","Thief","Protect","Icy Wind","Endure","False Swipe","Sleep Talk","Encore","Rain Dance","Facade","Taunt","Helping Hand","Aerial Ace","Water Pulse","Fling","Air Slash","X-Scissor","Avalanche","Grass Knot","Water Pledge","Liquidation","Tera Blast","Snowscape","Chilling Water","Knock Off","Flip Turn","Whirlpool"],
    egg: ["Screech","Detect","Knock Off","Copycat","Night Slash","Air Slash","Sacred Sword","Aqua Cutter"],
    max: []
  },
  502: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Tail Whip"},{level:1,move:"Water Gun"},{level:1,move:"Soak"},{level:13,move:"Focus Energy"},{level:18,move:"Razor Shell"},{level:21,move:"Fury Cutter"},{level:26,move:"Water Pulse"},{level:29,move:"Aerial Ace"},{level:34,move:"Aqua Jet"},{level:37,move:"Encore"},{level:42,move:"Aqua Tail"},{level:45,move:"Retaliate"},{level:50,move:"Swords Dance"},{level:53,move:"Hydro Pump"}],
    tm: ["Swords Dance","Take Down","Hydro Pump","Surf","Ice Beam","Blizzard","Dig","Waterfall","Swift","Rest","Substitute","Thief","Protect","Icy Wind","Endure","False Swipe","Sleep Talk","Encore","Rain Dance","Facade","Taunt","Helping Hand","Brick Break","Aerial Ace","Water Pulse","Fling","Air Slash","X-Scissor","Avalanche","Grass Knot","Water Pledge","Liquidation","Tera Blast","Snowscape","Chilling Water","Knock Off","Vacuum Wave","Flip Turn","Whirlpool"],
    egg: ["Screech","Detect","Knock Off","Copycat","Night Slash","Air Slash","Sacred Sword","Aqua Cutter"],
    max: []
  },
  503: {
    levelUp: [{level:0,move:"Slash"},{level:1,move:"Megahorn"},{level:1,move:"Tackle"},{level:1,move:"Tail Whip"},{level:1,move:"Water Gun"},{level:1,move:"Soak"},{level:13,move:"Focus Energy"},{level:18,move:"Razor Shell"},{level:21,move:"Fury Cutter"},{level:25,move:"Water Pulse"},{level:29,move:"Aerial Ace"},{level:34,move:"Aqua Jet"},{level:39,move:"Encore"},{level:46,move:"Aqua Tail"},{level:51,move:"Retaliate"},{level:58,move:"Swords Dance"},{level:63,move:"Hydro Pump"}],
    tm: ["Swords Dance","Body Slam","Take Down","Hydro Pump","Surf","Ice Beam","Blizzard","Hyper Beam","Dig","Waterfall","Swift","Rest","Substitute","Thief","Protect","Scary Face","Icy Wind","Endure","False Swipe","Sleep Talk","Encore","Rain Dance","Facade","Taunt","Helping Hand","Brick Break","Hydro Cannon","Aerial Ace","Water Pulse","Fling","Air Slash","X-Scissor","Giga Impact","Avalanche","Grass Knot","Water Pledge","Bulldoze","Drill Run","Smart Strike","Liquidation","Tera Blast","Snowscape","Chilling Water","Knock Off","Vacuum Wave","Flip Turn","Whirlpool","Dark Pulse","Snarl","Throat Chop","Lash Out","Upper Hand"],
    egg: ["Screech","Detect","Knock Off","Copycat","Night Slash","Air Slash","Sacred Sword","Aqua Cutter"],
    max: []
  },
  548: {
    levelUp: [{level:1,move:"Absorb"},{level:1,move:"Growth"},{level:3,move:"Helping Hand"},{level:6,move:"Stun Spore"},{level:9,move:"Mega Drain"},{level:12,move:"Charm"},{level:15,move:"Magical Leaf"},{level:18,move:"Sleep Powder"},{level:21,move:"Giga Drain"},{level:24,move:"Leech Seed"},{level:27,move:"After You"},{level:30,move:"Energy Ball"},{level:33,move:"Synthesis"},{level:36,move:"Sunny Day"},{level:39,move:"Entrainment"},{level:42,move:"Leaf Storm"}],
    tm: ["Solar Beam","Rest","Substitute","Protect","Giga Drain","Endure","Charm","Sleep Talk","Encore","Sunny Day","Facade","Helping Hand","Bullet Seed","Magical Leaf","Seed Bomb","Energy Ball","Leaf Storm","Grass Knot","Pollen Puff","Tera Blast","Trailblaze","Grassy Glide"],
    egg: ["Sweet Scent","Ingrain","Healing Wish","Worry Seed"],
    max: []
  },
  549: {
    levelUp: [{level:0,move:"Petal Dance"},{level:1,move:"Petal Blizzard"},{level:1,move:"Entrainment"},{level:1,move:"Quiver Dance"},{level:1,move:"Leaf Storm"},{level:1,move:"Energy Ball"},{level:1,move:"Teeter Dance"},{level:1,move:"Helping Hand"},{level:1,move:"Sunny Day"},{level:1,move:"Synthesis"},{level:1,move:"Charm"},{level:1,move:"Giga Drain"},{level:1,move:"Sleep Powder"},{level:1,move:"Stun Spore"},{level:1,move:"Growth"},{level:1,move:"Leech Seed"},{level:1,move:"Mega Drain"},{level:1,move:"After You"},{level:1,move:"Absorb"},{level:5,move:"Magical Leaf"}],
    tm: ["Swords Dance","Hyper Beam","Solar Beam","Light Screen","Rest","Substitute","Protect","Giga Drain","Endure","Charm","Sleep Talk","Encore","Sunny Day","Facade","Helping Hand","Bullet Seed","Magical Leaf","Seed Bomb","Energy Ball","Giga Impact","Leaf Storm","Grass Knot","Grassy Terrain","Pollen Puff","Tera Blast","Trailblaze","Solar Blade","Weather Ball","Grassy Glide","Psych Up","Petal Blizzard","Alluring Voice"],
    egg: [],
    max: []
  },
  550: {
    levelUp: [{level:1,move:"Tail Whip"},{level:1,move:"Water Gun"},{level:4,move:"Tackle"},{level:8,move:"Flail"},{level:12,move:"Aqua Jet"},{level:16,move:"Bite"},{level:20,move:"Scary Face"},{level:24,move:"Headbutt"},{level:28,move:"Soak"},{level:32,move:"Crunch"},{level:36,move:"Take Down"},{level:40,move:"Final Gambit"},{level:44,move:"Wave Crash"},{level:48,move:"Thrash"},{level:52,move:"Double-Edge"},{level:56,move:"Head Smash"}],
    tm: ["Take Down","Hydro Pump","Surf","Ice Beam","Blizzard","Hyper Beam","Agility","Waterfall","Swift","Rest","Substitute","Reversal","Protect","Scary Face","Icy Wind","Endure","Sleep Talk","Rain Dance","Crunch","Facade","Taunt","Mud Shot","Water Pulse","Giga Impact","Ice Fang","Zen Headbutt","Psychic Fangs","Liquidation","Tera Blast","Snowscape","Chilling Water","Flip Turn","Scale Shot","Double-Edge","Endeavor","Whirlpool","Muddy Water"],
    egg: ["Bubble Beam","Endeavor"],
    max: []
  },
  570: {
    levelUp: [{level:1,move:"Scratch"},{level:1,move:"Leer"},{level:4,move:"Torment"},{level:8,move:"Hone Claws"},{level:12,move:"Fury Swipes"},{level:16,move:"Scary Face"},{level:20,move:"Taunt"},{level:24,move:"Knock Off"},{level:28,move:"Fake Tears"},{level:32,move:"Agility"},{level:36,move:"Imprison"},{level:40,move:"Night Daze"},{level:44,move:"Nasty Plot"},{level:48,move:"Foul Play"}],
    tm: ["Swords Dance","Take Down","Dig","Agility","Night Shade","Confuse Ray","Swift","Rest","Substitute","Thief","Protect","Scary Face","Sludge Bomb","Endure","Sleep Talk","Encore","Rain Dance","Sunny Day","Shadow Ball","Facade","Taunt","Helping Hand","Trick","Imprison","Hyper Voice","Fake Tears","Calm Mind","U-turn","Fling","Dark Pulse","Nasty Plot","Shadow Claw","Grass Knot","Foul Play","Hex","Snarl","Tera Blast","Roar","Spite","Knock Off","Burning Jealousy","Lash Out","Pain Split","Psych Up","Skitter Smack"],
    egg: ["Counter","Detect","Memento","Extrasensory","Copycat","Sucker Punch"],
    max: []
  },
  571: {
    levelUp: [{level:0,move:"Night Slash"},{level:1,move:"Scratch"},{level:1,move:"Leer"},{level:1,move:"Torment"},{level:1,move:"U-turn"},{level:1,move:"Hone Claws"},{level:12,move:"Fury Swipes"},{level:20,move:"Taunt"},{level:24,move:"Knock Off"},{level:28,move:"Fake Tears"},{level:34,move:"Agility"},{level:40,move:"Imprison"},{level:46,move:"Night Daze"},{level:52,move:"Nasty Plot"},{level:58,move:"Foul Play"}],
    tm: ["Swords Dance","Body Slam","Take Down","Flamethrower","Hyper Beam","Low Kick","Dig","Psychic","Agility","Night Shade","Confuse Ray","Swift","Rest","Substitute","Thief","Protect","Scary Face","Sludge Bomb","Endure","Sleep Talk","Rain Dance","Sunny Day","Crunch","Shadow Ball","Facade","Taunt","Helping Hand","Trick","Brick Break","Imprison","Hyper Voice","Fake Tears","Aerial Ace","Calm Mind","U-turn","Fling","Dark Pulse","Focus Blast","Giga Impact","Nasty Plot","Shadow Claw","Grass Knot","Low Sweep","Foul Play","Hex","Snarl","Tera Blast","Roar","Toxic","Spite","Knock Off","Burning Jealousy","Lash Out","Pain Split","Psych Up","Skitter Smack","Throat Chop"],
    egg: [],
    max: []
  },
  627: {
    levelUp: [{level:1,move:"Leer"},{level:1,move:"Peck"},{level:6,move:"Hone Claws"},{level:12,move:"Wing Attack"},{level:18,move:"Tailwind"},{level:24,move:"Scary Face"},{level:30,move:"Aerial Ace"},{level:36,move:"Slash"},{level:42,move:"Whirlwind"},{level:48,move:"Crush Claw"},{level:55,move:"Air Slash"},{level:60,move:"Defog"},{level:66,move:"Thrash"},{level:72,move:"Brave Bird"}],
    tm: ["Fly","Body Slam","Take Down","Agility","Swift","Rest","Rock Slide","Substitute","Protect","Scary Face","Endure","Sleep Talk","Rain Dance","Sunny Day","Heat Wave","Facade","Helping Hand","Air Cutter","Rock Tomb","Aerial Ace","Bulk Up","Tailwind","U-turn","Close Combat","Air Slash","Brave Bird","Shadow Claw","Zen Headbutt","Acrobatics","Hurricane","Tera Blast","Dual Wingbeat","Double-Edge","Feather Dance"],
    egg: ["Rock Smash","Roost"],
    max: []
  },
  628: {
    levelUp: [{level:0,move:"Superpower"},{level:1,move:"Wing Attack"},{level:1,move:"Leer"},{level:1,move:"Peck"},{level:1,move:"Sky Attack"},{level:1,move:"Hone Claws"},{level:18,move:"Tailwind"},{level:24,move:"Scary Face"},{level:30,move:"Aerial Ace"},{level:36,move:"Slash"},{level:42,move:"Whirlwind"},{level:48,move:"Crush Claw"},{level:57,move:"Air Slash"},{level:64,move:"Defog"},{level:72,move:"Thrash"}],
    tm: ["Fly","Body Slam","Take Down","Hyper Beam","Agility","Swift","Rest","Rock Slide","Substitute","Reversal","Protect","Scary Face","Endure","Sleep Talk","Metal Claw","Rain Dance","Sunny Day","Heat Wave","Facade","Helping Hand","Air Cutter","Rock Tomb","Aerial Ace","Bulk Up","Tailwind","U-turn","Close Combat","Air Slash","Brave Bird","Giga Impact","Shadow Claw","Zen Headbutt","Iron Head","Acrobatics","Hurricane","Tera Blast","Dual Wingbeat","Double-Edge","Feather Dance"],
    egg: [],
    max: []
  },
  641: {
    levelUp: [{level:1,move:"Gust"},{level:1,move:"Astonish"},{level:5,move:"Leer"},{level:10,move:"Swagger"},{level:15,move:"Bite"},{level:20,move:"Air Cutter"},{level:25,move:"Agility"},{level:30,move:"Tailwind"},{level:35,move:"Air Slash"},{level:40,move:"Crunch"},{level:45,move:"Extrasensory"},{level:50,move:"Uproar"},{level:55,move:"Hammer Arm"},{level:60,move:"Rain Dance"},{level:65,move:"Hurricane"},{level:70,move:"Thrash"},{level:77,move:"Bleakwind Storm"}],
    tm: ["Fly","Body Slam","Take Down","Hyper Beam","Psychic","Agility","Metronome","Rest","Substitute","Thief","Reversal","Protect","Scary Face","Sludge Bomb","Icy Wind","Sandstorm","Endure","Sleep Talk","Rain Dance","Sunny Day","Crunch","Heat Wave","Facade","Taunt","Brick Break","Air Cutter","Bulk Up","Tailwind","U-turn","Fling","Dark Pulse","Air Slash","Focus Blast","Giga Impact","Nasty Plot","Grass Knot","Foul Play","Acrobatics","Hurricane","Tera Blast","Snowscape","Chilling Water","Smack Down","Knock Off","Uproar","Weather Ball","Lash Out","Sludge Wave"],
    egg: [],
    max: []
  },
  642: {
    levelUp: [{level:1,move:"Thunder Shock"},{level:1,move:"Astonish"},{level:5,move:"Leer"},{level:10,move:"Swagger"},{level:15,move:"Bite"},{level:20,move:"Shock Wave"},{level:25,move:"Agility"},{level:30,move:"Charge"},{level:35,move:"Volt Switch"},{level:40,move:"Crunch"},{level:45,move:"Discharge"},{level:50,move:"Uproar"},{level:55,move:"Hammer Arm"},{level:60,move:"Rain Dance"},{level:65,move:"Thunder"},{level:70,move:"Thrash"},{level:75,move:"Wildbolt Storm"}],
    tm: ["Thunder Punch","Fly","Body Slam","Take Down","Hyper Beam","Thunderbolt","Thunder Wave","Thunder","Psychic","Agility","Rest","Substitute","Thief","Protect","Scary Face","Sludge Bomb","Endure","Sleep Talk","Rain Dance","Sunny Day","Crunch","Facade","Taunt","Brick Break","Bulk Up","U-turn","Fling","Dark Pulse","Focus Blast","Giga Impact","Nasty Plot","Zen Headbutt","Flash Cannon","Grass Knot","Charge Beam","Electro Ball","Foul Play","Acrobatics","Volt Switch","Wild Charge","Snarl","Eerie Impulse","Electric Terrain","Smart Strike","Tera Blast","Charge","Smack Down","Knock Off","Uproar","Weather Ball","Lash Out","Supercell Slam","Electroweb","Sludge Wave"],
    egg: [],
    max: []
  },
  645: {
    levelUp: [{level:1,move:"Smack Down"},{level:1,move:"Sand Tomb"},{level:5,move:"Leer"},{level:10,move:"Block"},{level:15,move:"Bulldoze"},{level:20,move:"Rock Tomb"},{level:30,move:"Imprison"},{level:35,move:"Rock Slide"},{level:40,move:"Earth Power"},{level:45,move:"Extrasensory"},{level:50,move:"Stone Edge"},{level:55,move:"Hammer Arm"},{level:60,move:"Sandstorm"},{level:65,move:"Earthquake"},{level:70,move:"Outrage"},{level:75,move:"Fissure"},{level:80,move:"Sandsear Storm"}],
    tm: ["Swords Dance","Fly","Body Slam","Take Down","Hyper Beam","Earthquake","Dig","Psychic","Rest","Rock Slide","Substitute","Protect","Scary Face","Sludge Bomb","Mud-Slap","Outrage","Sandstorm","Endure","Sleep Talk","Rain Dance","Sunny Day","Crunch","Facade","Taunt","Brick Break","Imprison","Rock Tomb","Bulk Up","Mud Shot","Calm Mind","U-turn","Fling","Focus Blast","Earth Power","Giga Impact","Nasty Plot","Stone Edge","Stealth Rock","Grass Knot","Bulldoze","Stomping Tantrum","Tera Blast","Sand Tomb","Gravity","Smack Down","Weather Ball","Sludge Wave","Scorching Sands"],
    egg: [],
    max: []
  },
  700: {
    levelUp: [{level:0,move:"Disarming Voice"},{level:1,move:"Baton Pass"},{level:1,move:"Tackle"},{level:1,move:"Take Down"},{level:1,move:"Double-Edge"},{level:1,move:"Tail Whip"},{level:1,move:"Bite"},{level:1,move:"Growl"},{level:1,move:"Copycat"},{level:1,move:"Covet"},{level:1,move:"Charm"},{level:1,move:"Helping Hand"},{level:5,move:"Sand Attack"},{level:10,move:"Quick Attack"},{level:15,move:"Baby-Doll Eyes"},{level:20,move:"Swift"},{level:25,move:"Light Screen"},{level:30,move:"Draining Kiss"},{level:35,move:"Misty Terrain"},{level:40,move:"Skill Swap"},{level:45,move:"Psych Up"},{level:50,move:"Moonblast"},{level:55,move:"Last Resort"}],
    tm: ["Body Slam","Take Down","Hyper Beam","Dig","Psychic","Light Screen","Reflect","Swift","Rest","Substitute","Protect","Endure","Charm","Sleep Talk","Baton Pass","Rain Dance","Sunny Day","Shadow Ball","Facade","Helping Hand","Skill Swap","Hyper Voice","Fake Tears","Magical Leaf","Calm Mind","Giga Impact","Psyshock","Stored Power","Disarming Voice","Draining Kiss","Misty Terrain","Play Rough","Dazzling Gleam","Tera Blast","Trailblaze","Roar","Weather Ball","Misty Explosion","Psych Up","Double-Edge","Curse","Alluring Voice"],
    egg: [],
    max: []
  },
  704: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Absorb"},{level:5,move:"Water Gun"},{level:10,move:"Dragon Breath"},{level:15,move:"Protect"},{level:20,move:"Flail"},{level:25,move:"Water Pulse"},{level:30,move:"Rain Dance"},{level:35,move:"Dragon Pulse"},{level:41,move:"Curse"},{level:45,move:"Body Slam"},{level:50,move:"Muddy Water"}],
    tm: ["Body Slam","Take Down","Thunderbolt","Rest","Rock Slide","Substitute","Protect","Sludge Bomb","Outrage","Endure","Charm","Sleep Talk","Rain Dance","Sunny Day","Facade","Mud Shot","Water Pulse","Dragon Pulse","Draco Meteor","Tera Blast","Chilling Water","Muddy Water","Sludge Wave","Skitter Smack","Curse"],
    egg: ["Counter","Life Dew"],
    max: []
  },
  705: {
    levelUp: [{level:0,move:"Acid Spray"},{level:1,move:"Tackle"},{level:1,move:"Water Gun"},{level:1,move:"Absorb"},{level:1,move:"Acid Armor"},{level:1,move:"Dragon Breath"},{level:15,move:"Protect"},{level:20,move:"Flail"},{level:25,move:"Water Pulse"},{level:30,move:"Rain Dance"},{level:35,move:"Dragon Pulse"},{level:43,move:"Curse"},{level:49,move:"Body Slam"},{level:56,move:"Muddy Water"}],
    tm: ["Body Slam","Take Down","Ice Beam","Blizzard","Thunderbolt","Thunder","Rest","Rock Slide","Substitute","Protect","Sludge Bomb","Outrage","Endure","Charm","Sleep Talk","Rain Dance","Sunny Day","Facade","Mud Shot","Water Pulse","Dragon Pulse","Draco Meteor","Acid Spray","Tera Blast","Chilling Water","Toxic","Muddy Water","Sludge Wave","Skitter Smack","Curse"],
    egg: [],
    max: []
  },
  706: {
    levelUp: [{level:0,move:"Aqua Tail"},{level:1,move:"Tearful Look"},{level:1,move:"Feint"},{level:1,move:"Poison Tail"},{level:1,move:"Acid Spray"},{level:1,move:"Dragon Breath"},{level:1,move:"Tackle"},{level:1,move:"Absorb"},{level:1,move:"Water Gun"},{level:15,move:"Protect"},{level:20,move:"Flail"},{level:25,move:"Water Pulse"},{level:30,move:"Rain Dance"},{level:43,move:"Curse"},{level:49,move:"Body Slam"},{level:58,move:"Muddy Water"},{level:67,move:"Power Whip"}],
    tm: ["Fire Punch","Thunder Punch","Body Slam","Take Down","Flamethrower","Hydro Pump","Surf","Ice Beam","Blizzard","Hyper Beam","Thunderbolt","Thunder","Earthquake","Fire Blast","Rest","Rock Slide","Substitute","Protect","Sludge Bomb","Outrage","Endure","Charm","Sleep Talk","Rain Dance","Sunny Day","Facade","Dragon Claw","Mud Shot","Poison Tail","Water Pulse","Dragon Pulse","Focus Blast","Giga Impact","Draco Meteor","Acid Spray","Bulldoze","Dragon Tail","Stomping Tantrum","Body Press","Tera Blast","Chilling Water","Toxic","Knock Off","Scald","Focus Punch","Weather Ball","Muddy Water","Sludge Wave","Skitter Smack","Breaking Swipe","Curse","Dragon Cheer"],
    egg: [],
    max: []
  },
  712: {
    levelUp: [{level:1,move:"Harden"},{level:1,move:"Rapid Spin"},{level:3,move:"Tackle"},{level:6,move:"Powder Snow"},{level:9,move:"Curse"},{level:12,move:"Icy Wind"},{level:15,move:"Protect"},{level:18,move:"Avalanche"},{level:21,move:"Bite"},{level:24,move:"Ice Fang"},{level:27,move:"Iron Defense"},{level:30,move:"Recover"},{level:33,move:"Crunch"},{level:36,move:"Take Down"},{level:39,move:"Blizzard"},{level:42,move:"Double-Edge"}],
    tm: ["Body Slam","Take Down","Ice Beam","Blizzard","Rest","Rock Slide","Substitute","Protect","Icy Wind","Endure","Sleep Talk","Rain Dance","Crunch","Facade","Rock Tomb","Iron Defense","Avalanche","Ice Fang","Stone Edge","Bulldoze","Tera Blast","Ice Spinner","Snowscape","Chilling Water","Gyro Ball","Icicle Spear","Double-Edge","Curse"],
    egg: ["Mist","Mirror Coat","Aurora Veil"],
    max: []
  },
  713: {
    levelUp: [{level:0,move:"Body Slam"},{level:1,move:"Powder Snow"},{level:1,move:"Rapid Spin"},{level:1,move:"Wide Guard"},{level:1,move:"Harden"},{level:1,move:"Tackle"},{level:9,move:"Curse"},{level:12,move:"Icy Wind"},{level:15,move:"Protect"},{level:18,move:"Avalanche"},{level:21,move:"Bite"},{level:24,move:"Ice Fang"},{level:27,move:"Iron Defense"},{level:30,move:"Recover"},{level:33,move:"Crunch"},{level:36,move:"Take Down"},{level:41,move:"Blizzard"},{level:46,move:"Double-Edge"},{level:51,move:"Icicle Crash"}],
    tm: ["Body Slam","Take Down","Hydro Pump","Surf","Ice Beam","Blizzard","Hyper Beam","Earthquake","Rest","Rock Slide","Substitute","Protect","Scary Face","Icy Wind","Endure","Sleep Talk","Rain Dance","Crunch","Facade","Rock Tomb","Iron Defense","Giga Impact","Avalanche","Ice Fang","Flash Cannon","Iron Head","Stone Edge","Heavy Slam","Bulldoze","Stomping Tantrum","Body Press","Tera Blast","Ice Spinner","Snowscape","Chilling Water","Gyro Ball","High Horsepower","Icicle Spear","Double-Edge","Curse"],
    egg: [],
    max: []
  },
  722: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Growl"},{level:3,move:"Leafage"},{level:6,move:"Astonish"},{level:9,move:"Peck"},{level:12,move:"Shadow Sneak"},{level:15,move:"Razor Leaf"},{level:18,move:"Synthesis"},{level:21,move:"Pluck"},{level:24,move:"Nasty Plot"},{level:27,move:"Sucker Punch"},{level:30,move:"Leaf Blade"},{level:33,move:"Feather Dance"},{level:36,move:"Brave Bird"}],
    tm: ["Swords Dance","Take Down","Solar Beam","Night Shade","Confuse Ray","Light Screen","Swift","Rest","Substitute","Protect","Giga Drain","Endure","False Swipe","Sleep Talk","Rain Dance","Sunny Day","Facade","Helping Hand","Air Cutter","Bullet Seed","Aerial Ace","Magical Leaf","Seed Bomb","Air Slash","Energy Ball","Brave Bird","Nasty Plot","Shadow Claw","Leaf Storm","Grass Knot","Grass Pledge","Grassy Terrain","Tera Blast","Trailblaze","Haze","Knock Off","Grassy Glide","Dual Wingbeat","Feather Dance"],
    egg: ["Double Team","Confuse Ray","Knock Off","Roost","Defog"],
    max: []
  },
  723: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Growl"},{level:1,move:"Astonish"},{level:1,move:"Leafage"},{level:9,move:"Peck"},{level:12,move:"Shadow Sneak"},{level:15,move:"Razor Leaf"},{level:20,move:"Synthesis"},{level:25,move:"Pluck"},{level:30,move:"Nasty Plot"},{level:35,move:"Sucker Punch"},{level:40,move:"Leaf Blade"},{level:45,move:"Feather Dance"},{level:50,move:"Brave Bird"}],
    tm: ["Swords Dance","Take Down","Solar Beam","Swift","Rest","Substitute","Protect","Giga Drain","Endure","False Swipe","Sleep Talk","Baton Pass","Rain Dance","Sunny Day","Facade","Helping Hand","Air Cutter","Bullet Seed","Aerial Ace","Magical Leaf","Tailwind","Seed Bomb","Air Slash","Energy Ball","Brave Bird","Nasty Plot","Shadow Claw","Leaf Storm","Grass Knot","Grass Pledge","Grassy Terrain","Tera Blast","Trailblaze","Haze","Knock Off","Grassy Glide","Dual Wingbeat","Night Shade","Confuse Ray","Light Screen","Feather Dance"],
    egg: ["Double Team","Confuse Ray","Knock Off","Roost","Defog"],
    max: []
  },
  724: {
    levelUp: [{level:0,move:"Spirit Shackle"},{level:1,move:"Leafage"},{level:1,move:"Phantom Force"},{level:1,move:"Leaf Storm"},{level:1,move:"U-turn"},{level:1,move:"Astonish"},{level:1,move:"Tackle"},{level:1,move:"Spite"},{level:1,move:"Growl"},{level:9,move:"Peck"},{level:12,move:"Shadow Sneak"},{level:15,move:"Razor Leaf"},{level:20,move:"Synthesis"},{level:25,move:"Pluck"},{level:30,move:"Nasty Plot"},{level:37,move:"Sucker Punch"},{level:44,move:"Leaf Blade"},{level:51,move:"Feather Dance"},{level:58,move:"Brave Bird"}],
    tm: ["Swords Dance","Take Down","Hyper Beam","Low Kick","Solar Beam","Night Shade","Confuse Ray","Light Screen","Swift","Rest","Substitute","Protect","Giga Drain","Endure","False Swipe","Sleep Talk","Baton Pass","Rain Dance","Sunny Day","Shadow Ball","Facade","Helping Hand","Imprison","Air Cutter","Bullet Seed","Aerial Ace","Frenzy Plant","Magical Leaf","Tailwind","U-turn","Seed Bomb","Air Slash","Energy Ball","Brave Bird","Giga Impact","Nasty Plot","Shadow Claw","Leaf Storm","Grass Knot","Low Sweep","Hex","Acrobatics","Grass Pledge","Hurricane","Phantom Force","Grassy Terrain","Tera Blast","Trailblaze","Haze","Spite","Smack Down","Knock Off","Solar Blade","Grassy Glide","Dual Wingbeat","Poltergeist","Curse","Reversal","Scary Face","Focus Punch","Taunt","Brick Break","Feather Dance","Rock Tomb","Bulk Up","Close Combat","Aura Sphere","Focus Blast","Skitter Smack","Coaching","Upper Hand"],
    egg: ["Double Team","Confuse Ray","Knock Off","Roost","Defog"],
    max: []
  },
  899: {
    levelUp: [{level:0,move:"Psyshield Bash"},{level:1,move:"Tackle"},{level:3,move:"Leer"},{level:7,move:"Astonish"},{level:10,move:"Hypnosis"},{level:13,move:"Stomp"},{level:16,move:"Sand Attack"},{level:21,move:"Take Down"},{level:23,move:"Confuse Ray"},{level:27,move:"Calm Mind"},{level:32,move:"Role Play"},{level:37,move:"Zen Headbutt"},{level:49,move:"Imprison"},{level:55,move:"Double-Edge"},{level:62,move:"Megahorn"}],
    tm: ["Body Slam","Take Down","Psybeam","Hyper Beam","Solar Beam","Thunderbolt","Thunder Wave","Thunder","Earthquake","Dig","Psychic","Agility","Confuse Ray","Light Screen","Reflect","Swift","Rest","Substitute","Thief","Protect","Scary Face","Endure","Sleep Talk","Rain Dance","Sunny Day","Shadow Ball","Facade","Helping Hand","Trick","Skill Swap","Imprison","Calm Mind","Energy Ball","Earth Power","Giga Impact","Zen Headbutt","Trick Room","Charge Beam","Psyshock","Stored Power","Bulldoze","Wild Charge","Tera Blast","Trailblaze","Roar","Spite","Gravity","Lunge","High Horsepower","Uproar","Psych Up","Double-Edge","Future Sight","Expanding Force","Throat Chop","Curse","Psychic Noise"],
    egg: [],
    max: []
  },
  900: {
    levelUp: [{level:0,move:"Stone Axe"},{level:1,move:"Leer"},{level:1,move:"Quick Attack"},{level:4,move:"Fury Cutter"},{level:8,move:"False Swipe"},{level:12,move:"Smack Down"},{level:16,move:"Double Team"},{level:20,move:"Double Hit"},{level:24,move:"Slash"},{level:28,move:"Focus Energy"},{level:32,move:"Agility"},{level:36,move:"Rock Slide"},{level:40,move:"X-Scissor"},{level:44,move:"Swords Dance"}],
    tm: ["Swords Dance","Take Down","Hyper Beam","Agility","Light Screen","Swift","Rest","Rock Slide","Substitute","Thief","Reversal","Protect","Scary Face","Sandstorm","Endure","False Swipe","Sleep Talk","Baton Pass","Sunny Day","Facade","Helping Hand","Brick Break","Air Cutter","Rock Tomb","Aerial Ace","Rock Blast","Tailwind","U-turn","Close Combat","Air Slash","X-Scissor","Bug Buzz","Giga Impact","Stone Edge","Stealth Rock","Acrobatics","Struggle Bug","Tera Blast","Pounce","Trailblaze","Smack Down","Bug Bite","Vacuum Wave","Lunge","Dual Wingbeat","Double-Edge","Skitter Smack"],
    egg: [],
    max: []
  },
  901: {
    levelUp: [{level:0,move:"Headlong Rush"},{level:1,move:"Fake Tears"},{level:1,move:"Covet"},{level:1,move:"Scratch"},{level:1,move:"Leer"},{level:1,move:"Lick"},{level:8,move:"Fury Swipes"},{level:13,move:"Payback"},{level:17,move:"Sweet Scent"},{level:22,move:"Slash"},{level:25,move:"Play Nice"},{level:29,move:"Play Rough"},{level:35,move:"Scary Face"},{level:41,move:"Rest"},{level:41,move:"Snore"},{level:48,move:"High Horsepower"},{level:56,move:"Thrash"},{level:64,move:"Hammer Arm"}],
    tm: ["Fire Punch","Ice Punch","Thunder Punch","Swords Dance","Body Slam","Take Down","Hyper Beam","Low Kick","Earthquake","Dig","Metronome","Swift","Rest","Rock Slide","Substitute","Thief","Protect","Scary Face","Endure","Charm","Sleep Talk","Metal Claw","Rain Dance","Sunny Day","Crunch","Facade","Taunt","Helping Hand","Brick Break","Hyper Voice","Fake Tears","Rock Tomb","Aerial Ace","Bulk Up","Close Combat","Fling","Seed Bomb","Drain Punch","Vacuum Wave","Earth Power","Giga Impact","Avalanche","Shadow Claw","Gunk Shot","Stone Edge","Heavy Slam","Bulldoze","Play Rough","Stomping Tantrum","Body Press","Tera Blast","Trailblaze","Roar","Smack Down","High Horsepower","Uproar","Focus Punch","Double-Edge","Supercell Slam","Throat Chop","Curse","Hard Press"],
    egg: [],
    max: []
  },
  902: {
    levelUp: [{level:1,move:"Shadow Ball"},{level:1,move:"Tail Whip"},{level:1,move:"Water Gun"},{level:1,move:"Phantom Force"},{level:4,move:"Tackle"},{level:8,move:"Flail"},{level:12,move:"Aqua Jet"},{level:16,move:"Bite"},{level:20,move:"Scary Face"},{level:24,move:"Headbutt"},{level:28,move:"Soak"},{level:32,move:"Crunch"},{level:36,move:"Take Down"},{level:40,move:"Uproar"},{level:44,move:"Wave Crash"},{level:48,move:"Thrash"},{level:52,move:"Double-Edge"},{level:56,move:"Head Smash"}],
    tm: ["Take Down","Hydro Pump","Surf","Ice Beam","Blizzard","Hyper Beam","Agility","Night Shade","Confuse Ray","Waterfall","Rest","Substitute","Protect","Scary Face","Icy Wind","Outrage","Sleep Talk","Rain Dance","Crunch","Shadow Ball","Facade","Mud Shot","Water Pulse","Giga Impact","Ice Fang","Hex","Phantom Force","Psychic Fangs","Liquidation","Tera Blast","Snowscape","Chilling Water","Spite","Uproar","Flip Turn","Scale Shot","Pain Split","Double-Edge","Endeavor","Whirlpool","Muddy Water"],
    egg: ["Endeavor","Last Respects"],
    max: []
  },
  903: {
    levelUp: [{level:0,move:"Dire Claw"},{level:1,move:"Scratch"},{level:1,move:"Leer"},{level:1,move:"Rock Smash"},{level:1,move:"Fling"},{level:6,move:"Taunt"},{level:12,move:"Quick Attack"},{level:18,move:"Metal Claw"},{level:24,move:"Poison Jab"},{level:30,move:"Brick Break"},{level:36,move:"Hone Claws"},{level:42,move:"Slash"},{level:48,move:"Agility"},{level:54,move:"Screech"},{level:60,move:"Close Combat"}],
    tm: ["Fire Punch","Swords Dance","Take Down","Hyper Beam","Low Kick","Dig","Agility","Swift","Rest","Rock Slide","Substitute","Thief","Reversal","Protect","Sludge Bomb","Endure","False Swipe","Sleep Talk","Metal Claw","Rain Dance","Sunny Day","Shadow Ball","Facade","Taunt","Brick Break","Rock Tomb","Aerial Ace","Bulk Up","Poison Tail","Calm Mind","U-turn","Close Combat","Fling","Toxic Spikes","Poison Jab","X-Scissor","Focus Blast","Giga Impact","Nasty Plot","Shadow Claw","Gunk Shot","Grass Knot","Venoshock","Low Sweep","Acid Spray","Acrobatics","Tera Blast","Trailblaze","Toxic","Spite","Vacuum Wave","Focus Punch","Lash Out","Coaching","Sludge Wave","Throat Chop","Upper Hand"],
    egg: [],
    max: []
  },
  904: {
    levelUp: [{level:1,move:"Tackle"},{level:1,move:"Poison Sting"},{level:4,move:"Harden"},{level:8,move:"Bite"},{level:12,move:"Fell Stinger"},{level:16,move:"Minimize"},{level:20,move:"Spikes"},{level:24,move:"Brine"},{level:28,move:"Barb Barrage"},{level:32,move:"Pin Missile"},{level:36,move:"Toxic Spikes"},{level:40,move:"Stockpile"},{level:40,move:"Spit Up"},{level:44,move:"Toxic"},{level:48,move:"Crunch"},{level:52,move:"Acupressure"},{level:56,move:"Destiny Bond"}],
    tm: ["Swords Dance","Take Down","Hydro Pump","Surf","Ice Beam","Blizzard","Hyper Beam","Agility","Waterfall","Rest","Substitute","Reversal","Protect","Scary Face","Sludge Bomb","Spikes","Icy Wind","Endure","Sleep Talk","Rain Dance","Crunch","Shadow Ball","Facade","Taunt","Mud Shot","Poison Tail","Toxic Spikes","Poison Jab","Dark Pulse","Giga Impact","Gunk Shot","Venoshock","Smart Strike","Liquidation","Tera Blast","Chilling Water","Haze","Toxic","Spite","Gyro Ball","Lash Out","Scale Shot","Pain Split","Double-Edge","Sludge Wave","Throat Chop","Curse"],
    egg: [],
    max: []
  },
  905: {
    levelUp: [{level:1,move:"Astonish"},{level:1,move:"Fairy Wind"},{level:5,move:"Torment"},{level:10,move:"Flatter"},{level:15,move:"Twister"},{level:20,move:"Draining Kiss"},{level:25,move:"Iron Defense"},{level:30,move:"Imprison"},{level:35,move:"Mystical Fire"},{level:40,move:"Dazzling Gleam"},{level:45,move:"Extrasensory"},{level:50,move:"Uproar"},{level:55,move:"Superpower"},{level:60,move:"Healing Wish"},{level:65,move:"Moonblast"},{level:70,move:"Outrage"},{level:75,move:"Springtide Storm"}],
    tm: ["Fly","Body Slam","Take Down","Hyper Beam","Psychic","Agility","Rest","Substitute","Protect","Scary Face","Sludge Bomb","Outrage","Endure","Sleep Talk","Rain Dance","Sunny Day","Facade","Taunt","Imprison","Iron Defense","Calm Mind","Tailwind","Focus Blast","Earth Power","Giga Impact","Zen Headbutt","Iron Head","Grass Knot","Disarming Voice","Draining Kiss","Grassy Terrain","Misty Terrain","Play Rough","Dazzling Gleam","Tera Blast","Uproar","Weather Ball","Misty Explosion","Psych Up","Alluring Voice"],
    egg: [],
    max: []
  }
};
