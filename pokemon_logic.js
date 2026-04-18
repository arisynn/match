// ============================================================
//  pokemon_logic.js  —  Poké Match RPG: Logic & Data Layer
//  Pisahkan dari HTML agar update logic lebih gampang.
//  Versi: 2.0  (split architecture)
// ============================================================

// ── SPRITE / API URLS ──────────────────────────────────────
const POKE_SPRITE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';
const POKE_ANIM_URL   = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/';
const POKE_ART_URL    = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/';
const API_URL         = 'https://pokeapi.co/api/v2/pokemon/';
const MOVE_URL        = 'https://pokeapi.co/api/v2/move/';

// ── RARITY DATABASE (expanded) ────────────────────────────
const RARITY_DB = {
    common:    { ids: [1,4,7,10,13,16,19,21,23,29,32,41,43,46,48,50,52,54,56,58,60,63,66,69,72,74,79,83,86,90,92,96,98,100,102,104,108,111,114,116,118,120,128,132,138,140] },
    rare:      { ids: [25,35,39,55,62,68,71,73,75,76,78,82,84,85,87,88,89,93,94,95,97,99,101,103,105,106,107,109,110,112,113,115,117,119,121,122,123,124,125,126,127,130,133,134,136,137,139,141,142,143] },
    epic:      { ids: [94,123,130,131,134,135,136,143,147,148] },
    legendary: { ids: [144,145,146,149,150,151] }
};

// ── ITEMS DATABASE (diperluas, nama asli semua) ───────────
const ITEMS_DB = {
    // 'junk' tier → nama asli item
    junk: [
        { id: 'oran-berry',    name: 'Oran Berry',    type: 'heal', val: 10,  img: 'oran-berry'    },
        { id: 'pecha-berry',   name: 'Pecha Berry',   type: 'heal', val: 8,   img: 'pecha-berry'   },
        { id: 'rawst-berry',   name: 'Rawst Berry',   type: 'heal', val: 8,   img: 'rawst-berry'   },
        { id: 'aspear-berry',  name: 'Aspear Berry',  type: 'heal', val: 8,   img: 'aspear-berry'  },
    ],
    common: [
        { id: 'potion',        name: 'Potion',        type: 'heal', val: 50,  img: 'potion'        },
        { id: 'antidote',      name: 'Antidote',      type: 'heal', val: 30,  img: 'antidote'      },
        { id: 'paralyze-heal', name: 'Paralyze Heal', type: 'heal', val: 30,  img: 'paralyze-heal' },
    ],
    rare: [
        { id: 'super-potion',  name: 'Super Potion',  type: 'heal', val: 200, img: 'super-potion'  },
        { id: 'rare-candy',    name: 'Rare Candy',    type: 'exp',  val: 1,   img: 'rare-candy'    },
        { id: 'full-heal',     name: 'Full Heal',     type: 'heal', val: 150, img: 'full-heal'     },
        { id: 'hyper-potion',  name: 'Hyper Potion',  type: 'heal', val: 350, img: 'hyper-potion'  },
        { id: 'revive',        name: 'Revive',        type: 'revive', val: 1, img: 'revive'        },
    ],
    epic: [
        { id: 'thunder-stone', name: 'Thunder Stone', type: 'evo',  val: 1,   img: 'thunder-stone' },
        { id: 'fire-stone',    name: 'Fire Stone',    type: 'evo',  val: 1,   img: 'fire-stone'    },
        { id: 'water-stone',   name: 'Water Stone',   type: 'evo',  val: 1,   img: 'water-stone'   },
        { id: 'leaf-stone',    name: 'Leaf Stone',    type: 'evo',  val: 1,   img: 'leaf-stone'    },
        { id: 'max-potion',    name: 'Max Potion',    type: 'heal', val: 9999,img: 'max-potion'    },
        { id: 'max-revive',    name: 'Max Revive',    type: 'revive', val: 2, img: 'max-revive'    },
        { id: 'pp-up',         name: 'PP Up',         type: 'buff', val: 1,   img: 'pp-up'         },
        { id: 'x-attack',     name: 'X Attack',      type: 'buff', val: 1,   img: 'x-attack'      },
        { id: 'x-defense',    name: 'X Defense',     type: 'buff', val: 1,   img: 'x-defense'     },
    ]
};

// ── RARITY BADGE COLORS ───────────────────────────────────
const badgeColors = {
    junk:      'bg-gray-400 text-white',
    common:    'bg-slate-500 text-white',
    rare:      'bg-blue-500 text-white',
    epic:      'bg-purple-500 text-white',
    legendary: 'bg-yellow-400 text-yellow-900'
};

// ── EVOLUTION DB ──────────────────────────────────────────
const EVO_DB = {
    1:{target:2,reqLvl:16},2:{target:3,reqLvl:32},
    4:{target:5,reqLvl:16},5:{target:6,reqLvl:36},
    7:{target:8,reqLvl:16},8:{target:9,reqLvl:36},
    10:{target:11,reqLvl:7},11:{target:12,reqLvl:10},
    13:{target:14,reqLvl:7},14:{target:15,reqLvl:10},
    16:{target:17,reqLvl:18},17:{target:18,reqLvl:36},
    19:{target:20,reqLvl:20},
    25:{target:26,reqItem:'thunder-stone'},
    37:{target:38,reqItem:'fire-stone'},
    58:{target:59,reqLvl:28},
    60:{target:61,reqLvl:25},61:{target:62,reqLvl:36},
    63:{target:64,reqLvl:16},64:{target:65,reqLvl:36},
    66:{target:67,reqLvl:28},
    74:{target:75,reqLvl:25},75:{target:76,reqItem:'leaf-stone'},
    79:{target:80,reqLvl:37},
    86:{target:87,reqLvl:34},
    90:{target:91,reqItem:'water-stone'},
    92:{target:93,reqLvl:25},93:{target:94,reqLvl:40},
    98:{target:99,reqLvl:28},
    100:{target:101,reqLvl:30},
    102:{target:103,reqItem:'leaf-stone'},
    104:{target:105,reqLvl:28},
    111:{target:112,reqLvl:42},
    116:{target:117,reqLvl:32},
    118:{target:119,reqLvl:33},
    120:{target:121,reqItem:'water-stone'},
    129:{target:130,reqLvl:20},
    133:{target:135,reqItem:'thunder-stone'},
    138:{target:139,reqLvl:40},140:{target:141,reqLvl:40},
    147:{target:148,reqLvl:30},148:{target:149,reqLvl:55}
};

// ── TYPE COLORS & CHART ────────────────────────────────────
const typeColors = {
    normal:'#a8a878',fire:'#f08030',water:'#6890f0',electric:'#f8d030',
    grass:'#78c850',ice:'#98d8d8',fighting:'#c03028',poison:'#a040a0',
    ground:'#e0c068',flying:'#a890f0',psychic:'#f85888',bug:'#a8b820',
    rock:'#b8a038',ghost:'#705898',dragon:'#7038f8',dark:'#705848',
    steel:'#b8b8d0',fairy:'#ee99ac'
};
const typeChart = {
    normal:{weak:['fighting'],resist:['ghost']},
    fire:{weak:['water','ground','rock'],resist:['fire','grass','bug','fairy']},
    water:{weak:['electric','grass'],resist:['fire','water','ice']},
    grass:{weak:['fire','ice','poison','flying','bug'],resist:['water','grass','electric','ground']},
    electric:{weak:['ground'],resist:['electric','flying']},
    ice:{weak:['fire','fighting','rock','steel'],resist:['ice']},
    fighting:{weak:['flying','psychic','fairy'],resist:['bug','rock','dark']},
    poison:{weak:['ground','psychic'],resist:['grass','fighting','poison','fairy']},
    ground:{weak:['water','grass','ice'],resist:['poison','rock','electric']},
    flying:{weak:['electric','ice','rock'],resist:['grass','fighting','bug','ground']},
    psychic:{weak:['bug','ghost','dark'],resist:['fighting','psychic']},
    bug:{weak:['fire','flying','rock'],resist:['grass','fighting','ground']},
    rock:{weak:['water','grass','fighting','ground','steel'],resist:['normal','fire','poison','flying']},
    ghost:{weak:['ghost','dark'],resist:['poison','bug','normal','fighting']},
    dragon:{weak:['ice','dragon','fairy'],resist:['fire','water','grass','electric']},
    dark:{weak:['fighting','bug','fairy'],resist:['ghost','dark','psychic']},
    steel:{weak:['fire','fighting','ground'],resist:['normal','grass','ice','flying','psychic','bug','rock','dragon','steel','fairy','poison']},
    fairy:{weak:['poison','steel'],resist:['fighting','bug','dark','dragon']}
};

// ── STARTER POOL: 20 common pokemon, dipilih random 6 ─────
const STARTER_POOL = [
    { id:1,  name:'bulbasaur',  rarity:'common', hp:45, atk:49, def:49, spa:65, spd:65, speed:45, types:['grass','poison'], level:1, exp:0, currentMove:'vine-whip',  movePower:45, moveClass:'physical', moveType:'grass',  movePool:[{level:1,name:'tackle'},{level:4,name:'vine-whip'}],  cryUrl:'' },
    { id:4,  name:'charmander', rarity:'common', hp:39, atk:52, def:43, spa:60, spd:50, speed:65, types:['fire'],           level:1, exp:0, currentMove:'ember',       movePower:40, moveClass:'special',  moveType:'fire',   movePool:[{level:1,name:'scratch'},{level:7,name:'ember'}],     cryUrl:'' },
    { id:7,  name:'squirtle',   rarity:'common', hp:44, atk:48, def:65, spa:50, spd:64, speed:43, types:['water'],          level:1, exp:0, currentMove:'water-gun',   movePower:40, moveClass:'special',  moveType:'water',  movePool:[{level:1,name:'tackle'},{level:7,name:'water-gun'}],  cryUrl:'' },
    { id:10, name:'caterpie',   rarity:'common', hp:45, atk:30, def:35, spa:20, spd:20, speed:45, types:['bug'],            level:1, exp:0, currentMove:'tackle',      movePower:40, moveClass:'physical', moveType:'normal', movePool:[{level:1,name:'tackle'}],                             cryUrl:'' },
    { id:13, name:'weedle',     rarity:'common', hp:40, atk:35, def:30, spa:20, spd:20, speed:50, types:['bug','poison'],   level:1, exp:0, currentMove:'poison-sting',movePower:15, moveClass:'physical', moveType:'poison', movePool:[{level:1,name:'poison-sting'}],                        cryUrl:'' },
    { id:16, name:'pidgey',     rarity:'common', hp:40, atk:45, def:40, spa:35, spd:35, speed:56, types:['normal','flying'],level:1, exp:0, currentMove:'gust',        movePower:40, moveClass:'special',  moveType:'flying', movePool:[{level:1,name:'tackle'},{level:5,name:'gust'}],        cryUrl:'' },
    { id:19, name:'rattata',    rarity:'common', hp:30, atk:56, def:35, spa:25, spd:35, speed:72, types:['normal'],         level:1, exp:0, currentMove:'quick-attack',movePower:40, moveClass:'physical', moveType:'normal', movePool:[{level:1,name:'tackle'},{level:6,name:'quick-attack'}],cryUrl:'' },
    { id:21, name:'spearow',    rarity:'common', hp:40, atk:60, def:30, spa:31, spd:31, speed:70, types:['normal','flying'],level:1, exp:0, currentMove:'peck',        movePower:35, moveClass:'physical', moveType:'flying', movePool:[{level:1,name:'peck'}],                               cryUrl:'' },
    { id:23, name:'ekans',      rarity:'common', hp:35, atk:60, def:44, spa:40, spd:54, speed:55, types:['poison'],         level:1, exp:0, currentMove:'poison-sting',movePower:15, moveClass:'physical', moveType:'poison', movePool:[{level:1,name:'wrap'},{level:9,name:'poison-sting'}],  cryUrl:'' },
    { id:29, name:'nidoran-f',  rarity:'common', hp:55, atk:47, def:52, spa:40, spd:40, speed:41, types:['poison'],         level:1, exp:0, currentMove:'scratch',     movePower:40, moveClass:'physical', moveType:'normal', movePool:[{level:1,name:'scratch'},{level:9,name:'tail-whip'}],  cryUrl:'' },
    { id:32, name:'nidoran-m',  rarity:'common', hp:46, atk:57, def:40, spa:40, spd:40, speed:50, types:['poison'],         level:1, exp:0, currentMove:'peck',        movePower:35, moveClass:'physical', moveType:'flying', movePool:[{level:1,name:'leer'},{level:8,name:'peck'}],          cryUrl:'' },
    { id:41, name:'zubat',      rarity:'common', hp:40, atk:45, def:35, spa:30, spd:40, speed:55, types:['poison','flying'],level:1, exp:0, currentMove:'bite',        movePower:60, moveClass:'physical', moveType:'dark',   movePool:[{level:1,name:'leech-life'},{level:12,name:'bite'}],   cryUrl:'' },
    { id:43, name:'oddish',     rarity:'common', hp:45, atk:50, def:55, spa:75, spd:65, speed:30, types:['grass','poison'], level:1, exp:0, currentMove:'absorb',      movePower:20, moveClass:'special',  moveType:'grass',  movePool:[{level:1,name:'absorb'}],                             cryUrl:'' },
    { id:46, name:'paras',      rarity:'common', hp:35, atk:70, def:55, spa:45, spd:55, speed:25, types:['bug','grass'],    level:1, exp:0, currentMove:'scratch',     movePower:40, moveClass:'physical', moveType:'normal', movePool:[{level:1,name:'scratch'},{level:6,name:'stun-spore'}], cryUrl:'' },
    { id:48, name:'venonat',    rarity:'common', hp:60, atk:55, def:50, spa:40, spd:55, speed:45, types:['bug','poison'],   level:1, exp:0, currentMove:'tackle',      movePower:40, moveClass:'physical', moveType:'normal', movePool:[{level:1,name:'tackle'},{level:9,name:'confusion'}],   cryUrl:'' },
    { id:50, name:'diglett',    rarity:'common', hp:10, atk:55, def:25, spa:35, spd:45, speed:95, types:['ground'],         level:1, exp:0, currentMove:'scratch',     movePower:40, moveClass:'physical', moveType:'normal', movePool:[{level:1,name:'scratch'}],                            cryUrl:'' },
    { id:52, name:'meowth',     rarity:'common', hp:40, atk:45, def:35, spa:40, spd:40, speed:90, types:['normal'],         level:1, exp:0, currentMove:'scratch',     movePower:40, moveClass:'physical', moveType:'normal', movePool:[{level:1,name:'scratch'},{level:12,name:'pay-day'}],   cryUrl:'' },
    { id:54, name:'psyduck',    rarity:'common', hp:50, atk:52, def:48, spa:65, spd:50, speed:55, types:['water'],          level:1, exp:0, currentMove:'water-gun',   movePower:40, moveClass:'special',  moveType:'water',  movePool:[{level:1,name:'scratch'},{level:5,name:'water-gun'}],  cryUrl:'' },
    { id:58, name:'growlithe',  rarity:'common', hp:55, atk:70, def:45, spa:70, spd:50, speed:60, types:['fire'],           level:1, exp:0, currentMove:'ember',       movePower:40, moveClass:'special',  moveType:'fire',   movePool:[{level:1,name:'bite'},{level:7,name:'ember'}],         cryUrl:'' },
    { id:60, name:'poliwag',    rarity:'common', hp:40, atk:50, def:40, spa:40, spd:40, speed:90, types:['water'],          level:1, exp:0, currentMove:'water-gun',   movePower:40, moveClass:'special',  moveType:'water',  movePool:[{level:1,name:'water-gun'}],                          cryUrl:'' },
];

// ── HELPERS ───────────────────────────────────────────────
function getSpriteUrl(pokeId) { return `${POKE_SPRITE_URL}${pokeId}.png`; }
function getAnimUrl(pokeId)   { return `${POKE_ANIM_URL}front_default/${pokeId}.gif`; }
function genUID()             { return Math.random().toString(36).substring(2,10); }
function sleep(ms)            { return new Promise(r => setTimeout(r, ms)); }

function getMultiplier(atkType, defType) {
    if (!typeChart[defType]) return 1;
    if (typeChart[defType].resist.includes(atkType)) return 0.5;
    if (typeChart[defType].weak.includes(atkType))   return 1.5;
    return 1;
}
function calcStat(base, level, isHp = false) {
    if (isHp) return Math.floor(0.01 * (2 * base) * level) + level + 10;
    return Math.floor(0.01 * (2 * base) * level) + 5;
}
function calculateDamage(lvl, power, attackerAtk, defenderDef, isStab, typeMult) {
    let dmg = Math.floor((((2*lvl/5)+2)*power*(attackerAtk/Math.max(5,defenderDef)))/50)+2;
    if (isStab) dmg = Math.floor(dmg * 1.5);
    dmg = Math.floor(dmg * typeMult);
    return Math.max(1, Math.floor(dmg * ((Math.random() * 0.15) + 0.85)));
}

// ── AUDIO ENGINE ──────────────────────────────────────────
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function initAudio() {
    if (!audioCtx) audioCtx = new AudioCtx();
    if (audioCtx.state === 'suspended') audioCtx.resume();
}
function playSound(type) {
    try {
        initAudio();
        const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
        osc.connect(gain); gain.connect(audioCtx.destination);
        const t = audioCtx.currentTime;
        if (type==='hit')          { osc.type='square'; osc.frequency.setValueAtTime(150,t); osc.frequency.exponentialRampToValueAtTime(40,t+0.1); gain.gain.setValueAtTime(0.3,t); gain.gain.exponentialRampToValueAtTime(0.01,t+0.1); osc.start(); osc.stop(t+0.1); }
        else if(type==='supereffective'){ osc.type='sawtooth'; osc.frequency.setValueAtTime(400,t); osc.frequency.exponentialRampToValueAtTime(800,t+0.1); gain.gain.setValueAtTime(0.3,t); gain.gain.exponentialRampToValueAtTime(0.01,t+0.2); osc.start(); osc.stop(t+0.2); }
        else if(type==='coin')     { osc.type='sine'; osc.frequency.setValueAtTime(900,t); osc.frequency.setValueAtTime(1200,t+0.05); gain.gain.setValueAtTime(0.2,t); gain.gain.exponentialRampToValueAtTime(0.01,t+0.2); osc.start(); osc.stop(t+0.2); }
        else if(type==='heal')     { osc.type='sine'; osc.frequency.setValueAtTime(400,t); osc.frequency.linearRampToValueAtTime(800,t+0.3); gain.gain.setValueAtTime(0.3,t); gain.gain.exponentialRampToValueAtTime(0.01,t+0.4); osc.start(); osc.stop(t+0.4); }
        else if(type==='ko')       { osc.type='sawtooth'; osc.frequency.setValueAtTime(100,t); osc.frequency.exponentialRampToValueAtTime(20,t+0.3); gain.gain.setValueAtTime(0.4,t); gain.gain.exponentialRampToValueAtTime(0.01,t+0.4); osc.start(); osc.stop(t+0.4); }
        else if(type==='catch')    { osc.type='square'; osc.frequency.setValueAtTime(800,t); osc.frequency.setValueAtTime(1200,t+0.1); gain.gain.setValueAtTime(0.2,t); gain.gain.exponentialRampToValueAtTime(0.01,t+0.5); osc.start(); osc.stop(t+0.5); }
        else if(type==='legendary'){ for(let i=0;i<4;i++){const o2=audioCtx.createOscillator(),g2=audioCtx.createGain();o2.connect(g2);g2.connect(audioCtx.destination);const t2=t+i*0.12;o2.type='sine';o2.frequency.setValueAtTime([523,659,784,1047][i],t2);g2.gain.setValueAtTime(0.2,t2);g2.gain.exponentialRampToValueAtTime(0.01,t2+0.4);o2.start(t2);o2.stop(t2+0.4);} }
    } catch(e) {}
}
function playCry(url) {
    if (!url) return;
    try { const a = new Audio(url); a.volume = 0.3; a.play().catch(()=>{}); } catch(e) {}
}

// ── DEEP STORAGE: IndexedDB + localStorage fallback ───────
const DB_NAME = 'PokeMatchRPG', DB_STORE = 'saveData', DB_KEY = 'playerSave';
let db = null;
function openDB() {
    return new Promise((res, rej) => {
        if (db) { res(db); return; }
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = e => { const d = e.target.result; if(!d.objectStoreNames.contains(DB_STORE)) d.createObjectStore(DB_STORE); };
        req.onsuccess = e => { db = e.target.result; res(db); };
        req.onerror = () => rej(req.error);
    });
}
async function saveToStorage(data) {
    const str = JSON.stringify(data);
    try { const d=await openDB(); const tx=d.transaction(DB_STORE,'readwrite'); tx.objectStore(DB_STORE).put(str,DB_KEY); await new Promise((r,j)=>{tx.oncomplete=r;tx.onerror=j;}); } catch(e){}
    try { localStorage.setItem('poke_match_save', str); } catch(e) {}
}
async function loadFromStorage() {
    try { const d=await openDB(); const tx=d.transaction(DB_STORE,'readonly'); const req=tx.objectStore(DB_STORE).get(DB_KEY); const result=await new Promise((r,j)=>{req.onsuccess=()=>r(req.result);req.onerror=j;}); if(result) return JSON.parse(result); } catch(e){}
    try { const ls=localStorage.getItem('poke_match_save'); if(ls) return JSON.parse(ls); } catch(e){}
    return null;
}
function syncDataToDB() { if (window.player) saveToStorage(window.player); }

// ── FETCH HELPERS ─────────────────────────────────────────
async function fetchWithTimeout(resource, options = {}) {
    const { timeout = 5000 } = options;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(resource, { ...options, signal: controller.signal });
    clearTimeout(id); return response;
}
let moveCache = {};
async function fetchMoveDetails(moveName) {
    if (moveCache[moveName]) return moveCache[moveName];
    try {
        let res = await fetchWithTimeout(`${MOVE_URL}${moveName}`, {timeout:3000});
        let data = await res.json();
        let obj = { power: data.power||40, type: data.type.name, damageClass: data.damage_class.name };
        moveCache[moveName] = obj; return obj;
    } catch(e) { return { power:40, type:'normal', damageClass:'physical' }; }
}
function extractStats(data) {
    return {
        hp:    data.stats.find(s=>s.stat.name==='hp')?.base_stat||50,
        atk:   data.stats.find(s=>s.stat.name==='attack')?.base_stat||50,
        def:   data.stats.find(s=>s.stat.name==='defense')?.base_stat||50,
        spa:   data.stats.find(s=>s.stat.name==='special-attack')?.base_stat||50,
        spd:   data.stats.find(s=>s.stat.name==='special-defense')?.base_stat||50,
        speed: data.stats.find(s=>s.stat.name==='speed')?.base_stat||50
    };
}

// ── FETCH POKEMON FROM API ────────────────────────────────
async function fetchNewPokemon(pId, rarity) {
    try {
        let res  = await fetchWithTimeout(`${API_URL}${pId}`, {timeout:5000});
        let data = await res.json();
        let rawMoves = data.moves.filter(m => m.version_group_details?.length > 0 && m.version_group_details[0].move_learn_method.name === 'level-up');
        rawMoves.sort((a,b) => a.version_group_details[0].level_learned_at - b.version_group_details[0].level_learned_at);
        let mPool = [];
        for (let rm of rawMoves) {
            if (mPool.length >= 4) break;
            try {
                let mData = await fetchMoveDetails(rm.move.name);
                if (mData.damageClass !== 'status' && mData.power > 0)
                    mPool.push({ level: rm.version_group_details[0].level_learned_at, name: rm.move.name });
            } catch(e) {}
        }
        if (mPool.length === 0) mPool = [{level:1, name:'tackle'}];
        let moveDetails = await fetchMoveDetails(mPool[0].name);
        const baseStats = extractStats(data);
        return {
            uid: genUID(), isPokemon: true, id: Number(pId), name: data.name,
            rarity, hp: baseStats.hp, atk: baseStats.atk, def: baseStats.def,
            spa: baseStats.spa, spd: baseStats.spd, speed: baseStats.speed,
            types: data.types.map(t => t.type.name),
            spriteUrl: getSpriteUrl(Number(pId)),
            animUrl:   data.sprites?.other?.showdown?.front_default || getAnimUrl(pId),
            artUrl:    data.sprites?.other?.['official-artwork']?.front_default || `${POKE_ART_URL}${pId}.png`,
            level: 1, exp: 0,
            currentMove: mPool[0].name, movePower: moveDetails.power,
            moveClass: moveDetails.damageClass, moveType: moveDetails.type,
            movePool: mPool, cryUrl: data.cries?.latest || ''
        };
    } catch(e) {
        const fb = STARTER_POOL[Math.floor(Math.random() * STARTER_POOL.length)];
        return { ...JSON.parse(JSON.stringify(fb)), uid: genUID(), isPokemon: true, id: Number(pId), rarity, level:1, exp:0, spriteUrl: getSpriteUrl(Number(pId)), animUrl: getAnimUrl(pId), artUrl: `${POKE_ART_URL}${pId}.png` };
    }
}

// ── GACHA ROLL LOGIC ──────────────────────────────────────
// Rarity rates: Pokemon 60%, Items 40%
// Pokemon: Common 65%, Rare 25%, Epic 8% (+5%), Legendary 2%
// Items: Junk 55%, Common 25%, Rare 15%, Epic 5%
async function rollGachaSingleItem() {
    let isItem = Math.random() < 0.40;
    if (isItem) {
        let r = Math.random() * 100;
        let rarity = r < 55 ? 'junk' : r < 80 ? 'common' : r < 95 ? 'rare' : 'epic';
        let pool = ITEMS_DB[rarity];
        let chosen = pool[Math.floor(Math.random() * pool.length)];
        return { isPokemon: false, rarity, data: chosen };
    } else {
        window.player.pityCounter++;
        let r = Math.random() * 100, rarity = 'common';
        if (window.player.pityCounter >= 50) {
            rarity = Math.random() < 0.25 ? 'legendary' : 'epic';
            window.player.pityCounter = 0;
        } else {
            if      (r < 2)  rarity = 'legendary';
            else if (r < 10) rarity = 'epic';
            else if (r < 35) rarity = 'rare';
            else             rarity = 'common';
            if (rarity === 'legendary' || rarity === 'epic') window.player.pityCounter = 0;
        }
        const pool = RARITY_DB[rarity].ids;
        return { isPokemon: true, rarity, id: pool[Math.floor(Math.random() * pool.length)] };
    }
}

// ── BATTLE MECHANICS ──────────────────────────────────────
function initBattleParty() {
    window.battleParty = window.player.deck.map(uid => {
        let p = window.player.unlocked.find(u => u.uid === uid);
        if (!p) return null;
        let maxHp = calcStat(p.hp, p.level, true);
        return {
            ...JSON.parse(JSON.stringify(p)),
            maxHp, hp: maxHp, isKo: false,
            currentAtk: calcStat(p.atk, p.level),
            currentDef: calcStat(p.def, p.level),
            currentSpa: calcStat(p.spa, p.level),
            currentSpd: calcStat(p.spd, p.level),
        };
    }).filter(Boolean);
    window.activeSummonId = window.battleParty[0]?.uid || null;
}

function getActivePokemon()  { return window.battleParty?.find(p => p.uid === window.activeSummonId); }
function getAliveCount()     { return window.battleParty?.filter(p => !p.isKo).length || 0; }
function getNextAlivePokemon(){ return window.battleParty?.find(p => !p.isKo && p.uid !== window.activeSummonId); }

// Give EXP to all deck pokemon after battle
function giveExpToDeck(amount) {
    let lvlUp = false;
    window.player.deck.forEach(uid => {
        let p = window.player.unlocked.find(u => u.uid === uid);
        if (!p) return;
        p.exp += amount;
        let max = p.level * 100;
        while (p.exp >= max) { p.level++; p.exp -= max; p.atk+=2; p.def+=1; p.hp+=5; p.spa+=1; p.spd+=1; p.speed+=1; max = p.level * 100; lvlUp = true; }
    });
    return lvlUp;
}

// ── MATCH-3 BOARD HELPERS ─────────────────────────────────
const BOARD_WIDTH = 6;
function swap(board, i, j) { const t = board[i]; board[i] = board[j]; board[j] = t; }
function findMatches(board) {
    let matched = new Set();
    for(let r=0;r<BOARD_WIDTH;r++){for(let c=0;c<BOARD_WIDTH-2;c++){let i=r*BOARD_WIDTH+c;if(!board[i])continue;let uid=board[i].uid,ml=1;while(c+ml<BOARD_WIDTH&&board[i+ml]?.uid===uid)ml++;if(ml>=3)for(let k=0;k<ml;k++)matched.add(i+k);c+=ml-1;}}
    for(let c=0;c<BOARD_WIDTH;c++){for(let r=0;r<BOARD_WIDTH-2;r++){let i=r*BOARD_WIDTH+c;if(!board[i])continue;let uid=board[i].uid,ml=1;while(r+ml<BOARD_WIDTH&&board[i+ml*BOARD_WIDTH]?.uid===uid)ml++;if(ml>=3)for(let k=0;k<ml;k++)matched.add(i+k*BOARD_WIDTH);r+=ml-1;}}
    return Array.from(matched);
}
function resolveInitialMatches(board, getRandomFn) {
    let matches = findMatches(board), loop=0;
    while(matches.length>0&&loop<15){ matches.forEach(i=>board[i]=getRandomFn()); matches=findMatches(board); loop++; }
}
function hasPossibleMoves(board) {
    for(let r=0;r<BOARD_WIDTH;r++){for(let c=0;c<BOARD_WIDTH;c++){let i=r*BOARD_WIDTH+c;if(c<BOARD_WIDTH-1){swap(board,i,i+1);let m=findMatches(board);swap(board,i,i+1);if(m.length>0)return true;}if(r<BOARD_WIDTH-1){swap(board,i,i+BOARD_WIDTH);let m=findMatches(board);swap(board,i,i+BOARD_WIDTH);if(m.length>0)return true;}}}
    return false;
}
