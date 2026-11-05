// ---------- DATOS ----------
// Datos del juego (cliente 1.60.1). Si quieres corregir algo, edita este archivo.
// habilidades = hechizos que enseña el entrenador · nuevas = habilidades que no existían en Classic
const RACES = {
  humano:   { nombre: "Humano",              faccion: "alianza" },
  enano:    { nombre: "Enano",               faccion: "alianza" },
  elfo:     { nombre: "Elfo de la noche",    faccion: "alianza" },
  gnomo:    { nombre: "Gnomo",               faccion: "alianza" },
  skyHO:    { nombre: "Skyborne (High Order)", faccion: "alianza" },
  orco:     { nombre: "Orco",                faccion: "horda" },
  nomuerto: { nombre: "No-muerto",           faccion: "horda" },
  tauren:   { nombre: "Tauren",              faccion: "horda" },
  trol:     { nombre: "Trol",                faccion: "horda" },
  skyWS:    { nombre: "Skyborne (Windshaper)", faccion: "horda" }
};

// Iconos oficiales de clase, servidos por Blizzard
const ICONOS_URL = "https://render.worldofwarcraft.com/us/icons/56/";

// ---------- ICONOS ----------
// Devuelve el HTML del icono de una clase. Si la imagen no carga, se ve la inicial.
function iconoClase(c) {
  return `<span class="sigil" aria-hidden="true"><span class="sigil-letter">${c.nombre[0]}</span>` +
    `<img src="${ICONOS_URL}${c.icono}.jpg" alt="" loading="lazy" onerror="this.remove()"></span>`;
}

// Icono cualquiera del juego (habilidad, profesión, objeto...)
function iconoWow(icono, extra = "") {
  return `<span class="wow-icon ${extra}" aria-hidden="true"><img src="${ICONOS_URL}${icono}.jpg" alt="" loading="lazy" onerror="this.remove()"></span>`;
}

// Iconos de rol: iconos reales del juego, con un borde del color del rol
const ROL_ICONO = {
  tanque: "inv_shield_06",
  sanador: "spell_holy_flashheal",
  melee: "ability_dualwield",
  distancia: "inv_weapon_bow_07"
};

function iconoRol(rol) {
  return `<span class="wow-icon rol rol-${rol}" title="${ROLES[rol]}" aria-hidden="true"><img src="${ICONOS_URL}${ROL_ICONO[rol]}.jpg" alt="" loading="lazy" onerror="this.remove()"></span>`;
}

const ROLES = {
  tanque:    "Tanque",
  sanador:   "Sanador",
  melee:     "Cuerpo a cuerpo",
  distancia: "A distancia"
};

const CLASSES = [
  { id: "guerrero", icono: "classicon_warrior", habilidades: 39, nuevas: 2, nombre: "Guerrero", color: "#C69B6D", recurso: "Ira",
    roles: ["tanque", "melee"],
    pitch: "Armadura pesada y golpes directos. Genera ira al pegar y recibir daño.",
    arboles: [["Armas", "Daño", "ability_warrior_savageblow"], ["Furia", "Daño", "ability_warrior_innerrage"], ["Protección", "Tanque", "ability_warrior_defensivestance"]],
    razas: ["humano","enano","elfo","gnomo","skyHO","orco","nomuerto","tauren","trol","skyWS"] },
  { id: "paladin", icono: "classicon_paladin", habilidades: 55, nuevas: 7, nombre: "Paladín", color: "#F48CBA", recurso: "Maná",
    roles: ["tanque", "sanador", "melee"],
    pitch: "Guerrero sagrado que aguanta mucho y puede curarse a sí mismo.",
    arboles: [["Sagrado", "Sanador", "spell_holy_holybolt"], ["Protección", "Tanque", "spell_holy_devotionaura"], ["Reprensión", "Daño", "spell_holy_auraoflight"]],
    razas: ["humano","enano","nomuerto"], facil: true },
  { id: "cazador", icono: "classicon_hunter", habilidades: 62, nuevas: 4, nombre: "Cazador", color: "#AAD372", recurso: "Maná",
    roles: ["distancia"],
    pitch: "Ataca desde lejos mientras su mascota se lleva los golpes.",
    arboles: [["Bestias", "Daño", "ability_hunter_beasttaming"], ["Puntería", "Daño", "ability_marksmanship"], ["Supervivencia", "Daño", "ability_hunter_swiftstrike"]],
    razas: ["humano","enano","elfo","skyHO","orco","tauren","trol","skyWS"], facil: true },
  { id: "picaro", icono: "classicon_rogue", habilidades: 28, nuevas: 1, nombre: "Pícaro", color: "#FFF468", recurso: "Energía",
    roles: ["melee"],
    pitch: "Sigilo, venenos y mucho daño en poco tiempo. Elige cuándo empieza la pelea.",
    arboles: [["Asesinato", "Daño", "ability_rogue_eviscerate"], ["Combate", "Daño", "ability_backstab"], ["Sutileza", "Daño", "ability_stealth"]],
    razas: ["humano","enano","elfo","gnomo","skyHO","orco","nomuerto","trol","skyWS"] },
  { id: "sacerdote", icono: "classicon_priest", habilidades: 56, nuevas: 6, nombre: "Sacerdote", color: "#E8E8E8", recurso: "Maná",
    roles: ["sanador", "distancia"],
    pitch: "El sanador clásico. Con Sombras se convierte en un lanzador de daño.",
    arboles: [["Disciplina", "Sanador", "spell_holy_wordfortitude"], ["Sagrado", "Sanador", "spell_holy_guardianspirit"], ["Sombras", "Daño", "spell_shadow_shadowwordpain"]],
    razas: ["humano","enano","elfo","gnomo","nomuerto","trol"] },
  { id: "chaman", icono: "classicon_shaman", habilidades: 55, nuevas: 4, nombre: "Chamán", color: "#3F8FE8", recurso: "Maná",
    roles: ["sanador", "melee", "distancia"],
    pitch: "Usa tótems que ayudan al grupo. Puede curar, pegar o lanzar hechizos.",
    arboles: [["Elemental", "Daño a distancia", "spell_nature_lightning"], ["Mejora", "Daño cuerpo a cuerpo", "spell_nature_lightningshield"], ["Restauración", "Sanador", "spell_nature_magicimmunity"]],
    razas: ["enano","orco","tauren","trol","skyWS"] },
  { id: "mago", icono: "classicon_mage", habilidades: 63, nuevas: 3, nombre: "Mago", color: "#3FC7EB", recurso: "Maná",
    roles: ["distancia"],
    pitch: "Mucho daño desde lejos y control de enemigos. Frágil si te alcanzan.",
    arboles: [["Arcano", "Daño", "spell_holy_magicalsentry"], ["Fuego", "Daño", "spell_fire_firebolt02"], ["Escarcha", "Daño", "spell_frost_frostbolt02"]],
    razas: ["humano","gnomo","skyHO","orco","nomuerto","trol"] },
  { id: "brujo", icono: "classicon_warlock", habilidades: 51, nuevas: 2, nombre: "Brujo", color: "#8788EE", recurso: "Maná",
    roles: ["distancia"],
    pitch: "Invoca demonios y desgasta a los enemigos con daño a lo largo del tiempo.",
    arboles: [["Aflicción", "Daño", "spell_shadow_deathcoil"], ["Demonología", "Daño", "spell_shadow_metamorphosis"], ["Destrucción", "Daño", "spell_shadow_rainoffire"]],
    razas: ["humano","gnomo","orco","nomuerto","trol"] },
  { id: "druida", icono: "classicon_druid", habilidades: 58, nuevas: 1, nombre: "Druida", color: "#FF7C0A", recurso: "Maná",
    roles: ["tanque", "sanador", "melee", "distancia"],
    pitch: "Cambia de forma para hacer de todo: oso, felino, sanador o lanzador.",
    arboles: [["Equilibrio", "Daño a distancia", "spell_nature_starfall"], ["Combate feral", "Tanque o daño", "ability_racial_bearform"], ["Restauración", "Sanador", "spell_nature_healingtouch"]],
    razas: ["elfo","skyHO","tauren","skyWS"] }
];


// ---------- RAZAS: habilidades raciales ----------
// Fuente: datos del cliente 1.60.1. Nombres en inglés, como aparecen en los datos del juego.
// nueva: true = habilidad que no existía en Classic
const RACIALES = {
  humano: { inicio: "Bosque de Elwynn", habilidades: [
    ["Perception", "Aumenta mucho la detección de sigilo durante 20 s."],
    ["Ruthless", "+2% de probabilidad de golpe crítico con hechizos y ataques."],
    ["The Human Spirit", "+5% de Espíritu."],
    ["Will to Survive", "Quita al instante todos los aturdimientos.", true] ] },
  enano: { inicio: "Dun Morogh", habilidades: [
    ["Find Treasure", "Muestra los tesoros cercanos en el minimapa."],
    ["Stoneform", "Quita y te hace inmune a sangrados, venenos y enfermedades, y reduce un 10% el daño físico durante 8 s."],
    ["Earth Fury", "+2% al daño y la sanación de los golpes críticos.", true],
    ["Big Game Hunter", "+5% de daño contra bestias.", true] ] },
  elfo: { inicio: "Teldrassil", habilidades: [
    ["Shadowmeld", "Te escondes en las sombras mientras no te muevas. En combate hace que los enemigos tengan menos probabilidad de atacarte."],
    ["Quickness", "+1% de esquivar y +2% de velocidad de movimiento. Pícaros y druidas son más difíciles de detectar en sigilo."],
    ["Wisp Spirit", "Al morir te conviertes en fuego fatuo con +75% de velocidad."],
    ["Elune's Light", "+10% de probabilidad de crítico durante 15 s.", true] ] },
  gnomo: { inicio: "Dun Morogh", habilidades: [
    ["Escape Artist", "Te libra al instante de los efectos que te frenan o inmovilizan y te da inmunidad 3 s."],
    ["Expansive Mind", "+5% de maná máximo."],
    ["Engineering Specialization", "Tus aparatos de ingeniería fallan un 20% menos."],
    ["Eureka!", "Tus habilidades de daño directo cuestan un 10% menos de energía y hacen un 10% más de daño durante 8 s.", true] ] },
  skyHO: { inicio: "Isla Zephras", habilidades: [
    ["Read Leyline", "+100% de regeneración de salud y maná. Dura 15 min si hay una línea ley cerca, si no 30 s.", true],
    ["Walk on Air", "Planeas por el aire durante 10 s controlando la dirección.", true],
    ["Elemental Insight", "+5% de daño contra elementales.", true],
    ["Wind Blessed", "+3% de celeridad con hechizos, cuerpo a cuerpo y a distancia.", true] ] },
  orco: { inicio: "Durotar", habilidades: [
    ["Blood Fury", "+10% de poder de ataque y poder con hechizos durante 15 s."],
    ["Hardiness", "Los aturdimientos te duran un 20% menos."],
    ["Savage", "+1% de probabilidad de golpe crítico."],
    ["Shatter Curse", "Quita al instante todas las maldiciones y reduce un 5% el daño mágico durante 8 s.", true] ] },
  nomuerto: { inicio: "Claros de Tirisfal", habilidades: [
    ["Underwater Breathing", "Aguantas la respiración bajo el agua un 300% más."],
    ["Will of the Forsaken", "Quita al instante los efectos de miedo, sueño y control mental."],
    ["Cannibalize", "Comiendo un cadáver humanoide o no-muerto recuperas un 7% de salud y maná cada 2 s durante 10 s."],
    ["Touch of the Grave", "Tus ataques tienen un 20% de probabilidad de robar salud (hasta el 5% de tu salud máxima).", true] ] },
  tauren: { inicio: "Mulgore", habilidades: [
    ["War Stomp", "Aturde a los enemigos a 8 m durante 2 s."],
    ["Endurance", "+5% de salud y +2% al daño y la sanación de los críticos."],
    ["Cultivation", "Haces crecer una copia de una hierba cercana que puedes recoger sin Herboristería."],
    ["Plainsrunning", "Ganas un 1% de velocidad cada 5 s en movimiento, hasta un 30%. Y un 3% más de velocidad en montura.", true] ] },
  trol: { inicio: "Durotar", habilidades: [
    ["Berserking", "+10% de velocidad de ataque y de lanzamiento de hechizos."],
    ["Regeneration", "+20% de regeneración de salud, y un 20% sigue funcionando en combate."],
    ["Beast Slaying", "+5% de daño contra bestias."],
    ["Rapid Regeneration", "Recuperas el 50% de tu salud en 6 s si no te mueves ni recibes daño.", true] ] },
  skyWS: { inicio: "Isla Zephras", habilidades: [
    ["Walk on Air", "Planeas por el aire durante 10 s controlando la dirección.", true],
    ["Elemental Insight", "+5% de daño contra elementales.", true],
    ["Wind Blessed", "+3% de celeridad con hechizos, cuerpo a cuerpo y a distancia.", true],
    ["Skysight", "+10% de velocidad de movimiento y en montura. Dura 15 min cerca de una convergencia elemental, si no 30 s.", true] ] }
};

// ---------- PROFESIONES ----------
// Fuente: datos del cliente 1.60.1. Todas llegan a 300 puntos.
// [nombre, tipo, recetas totales, recetas nuevas en Forever, icono]
const PROFESIONES = {
  principales: [
    ["Peletería", "Fabricación", 595, 271, "trade_leatherworking"],
    ["Herrería", "Fabricación", 512, 197, "trade_blacksmithing"],
    ["Sastrería", "Fabricación", 471, 180, "trade_tailoring"],
    ["Ingeniería", "Fabricación", 282, 77, "trade_engineering"],
    ["Encantamiento", "Fabricación", 262, 63, "trade_engraving"],
    ["Alquimia", "Fabricación", 196, 70, "trade_alchemy"],
    ["Minería", "Recolección", 21, 5, "trade_mining"],
    ["Herboristería", "Recolección", 7, 5, "trade_herbalism"],
    ["Desuello", "Recolección", 4, 4, "inv_misc_pelt_wolf_01"]
  ],
  secundarias: [
    ["Cocina", "Fabricación", 133, 44, "inv_misc_food_15"],
    ["Primeros auxilios", "Fabricación", 32, 17, "spell_holy_sealofsacrifice"],
    ["Pesca", "Recolección", 6, 5, "trade_fishing"],
    ["Comprensión", "Nueva: sube usándola", 7, 7, "inv_misc_book_09"]
  ]
};

// Parejas de profesiones: una recoge los materiales que usa la otra
const PAREJAS = [
  ["Minería", "Herrería", "La minería saca el metal que necesita la herrería."],
  ["Minería", "Ingeniería", "La ingeniería también usa metal y piedra."],
  ["Desuello", "Peletería", "El desuello saca el cuero que usa la peletería."],
  ["Herboristería", "Alquimia", "La alquimia hace pociones con hierbas."],
  ["Sastrería", "Encantamiento", "La tela cae de los enemigos, y lo que fabricas lo puedes desencantar."],
  ["Minería", "Herboristería", "Dos de recolección: para ganar oro vendiendo materiales."]
];

// ---------- CALENDARIO OFICIAL ----------
// estado: "hecho", "pronto" o "futuro"
const CALENDARIO = [
  { fecha: "17 sep – 22 oct 2026", titulo: "Beta", icono: "inv_misc_spyglass_02", texto: "Beta cerrada hasta nivel 30.", estado: "hecho" },
  { fecha: "27 oct 2026", titulo: "Reserva de nombres", icono: "inv_misc_note_01", texto: "Creación de personajes anticipada.", estado: "hecho" },
  { fecha: "5 nov 2026 · 00:00", titulo: "Lanzamiento", icono: "inv_misc_map_01", texto: "Abren los servidores (4 nov a las 15:00 en EE. UU., hora del Pacífico).", estado: "pronto" },
  { fecha: "9 dic 2026", titulo: "Abren las primeras raids", icono: "achievement_boss_onyxia", texto: "Barrow Deeps (10 jugadores, 8 jefes), Cima Hyjal (20 jugadores, 13 jefes) y Guarida de Onyxia (40 jugadores, 1 jefe).", estado: "futuro" },
  { fecha: "Invierno 2026", titulo: "Modo Hardcore", icono: "inv_misc_bone_humanskull_01", texto: "Servidores donde si mueres, pierdes el personaje. Sin fecha exacta todavía.", estado: "futuro" },
  { fecha: "Primavera 2027", titulo: "Primera gran actualización", icono: "inv_misc_head_dragon_01", texto: "Dos raids nuevas de nivel 60, dos mazmorras nuevas, nuevas misiones y zona, una cadena de misiones legendaria y nueva temporada JcJ.", estado: "futuro" },
  { fecha: "Verano 2027", titulo: "Segunda gran actualización", icono: "inv_scroll_03", texto: "Una raid nueva de nivel 60 y una raid clásica renovada.", estado: "futuro" }
];

// ---------- MASCOTAS DE CAZADOR ----------
// Fuentes: foreverdb.net (cliente beta 1.60.1.70707) y mmonster.co (beta 70450)
// velocidad = segundos entre ataques (menos = ataca más rápido)
// estado: "nueva" = mascota nueva de Forever · "vista" = vista en la beta de Forever · "classic" = dato de Classic, sin confirmar aún en Forever
// [nombre, icono, habilidad, qué hace, sirve para PvE, sirve para PvP]
// PvE / PvP según lo que hace la habilidad de la familia
const FAMILIAS = [
  ["Lobo", "ability_hunter_pet_wolf", "Furious Howl", "Sube el poder de ataque del grupo", true, false],
  ["Felino", "ability_hunter_pet_cat", "Prowl", "Sigilo para emboscar", false, true],
  ["Oso", "ability_hunter_pet_bear", "Swipe", "Golpea a varios enemigos a la vez", true, false],
  ["Jabalí", "ability_hunter_pet_boar", "Charge", "Carga hacia el enemigo", false, true],
  ["Raptor", "ability_hunter_pet_raptor", "Savage Rend", "Desgarro con sangrado", true, false],
  ["Serpiente alada", "ability_hunter_pet_windserpent", "Lightning Breath", "Rayo a distancia que ignora armadura", true, true],
  ["Murciélago", "ability_hunter_pet_bat", "Sonic Blast", "Molesta a los lanzadores de hechizos", false, true],
  ["Ave rapaz", "ability_hunter_pet_owl", "Mine!", "Desarma al enemigo", false, true],
  ["Carroñero", "ability_hunter_pet_vulture", "Demoralizing Screech", "Baja el ataque de los enemigos", true, false],
  ["Crocolisco", "ability_hunter_pet_crocolisk", "Dismember", "Reduce la sanación que recibe el enemigo", false, true],
  ["Hiena", "ability_hunter_pet_hyena", "Tendon Rip", "Ralentiza al enemigo", false, true],
  ["Gorila", "ability_hunter_pet_gorilla", "Thunderstomp", "Daño en área", true, false],
  ["Escórpido", "ability_hunter_pet_scorpid", "Scorpid Poison", "Veneno que hace daño con el tiempo", true, false],
  ["Araña", "ability_hunter_pet_spider", "Web", "Inmoviliza al enemigo", false, true],
  ["Tortuga", "ability_hunter_pet_turtle", "Shell Shield", "Reduce el daño que recibe", true, false],
  ["Cangrejo", "ability_hunter_pet_crab", "Pinch", "Pellizco de daño", true, false],
  ["Zancaalta", "ability_hunter_pet_tallstrider", "Dust Cloud", "Ciega al enemigo", false, true],
  ["Zorro", null, "Trickster's Dance", "Familia nueva, aún por probar", false, false],
  ["Can del Núcleo", "ability_hunter_pet_corehound", "Lava Breath", "Exótica, no se puede domar todavía", false, false]
];

// [nombre, familia, nivel, zona, velocidad o null, estado, nota]
const MASCOTAS = [
  ["Shal'ma", "Felino", 9, "Durotar", null, "nueva", "Felino nuevo de Forever en la zona de inicio de orcos y trols."],
  ["Ghostfang", "Felino", 10, "Dun Morogh", null, "nueva", "Felino nuevo de Forever para empezar en la Alianza."],
  ["Matriarch Bristlefur", "Oso", 10, "Bosque de Elwynn", null, "nueva", "Osa nueva de Forever al lado de Ventormenta."],
  ["Nightscreech", "Ave rapaz", 10, "Teldrassil", null, "nueva", "Ave rapaz nueva de Forever."],
  ["Fernfeather", "Zancaalta", 10, "Isla Zephras", null, "nueva", "Nueva, en la zona de inicio de los Skyborne."],
  ["The Rake", "Felino", 10, "Mulgore", 1.2, "vista", "Ataca muy rápido para su nivel. Ideal para empezar en la Horda."],
  ["Timber", "Lobo", 10, "Dun Morogh", 2.0, "vista", "Lobo de nivel 10 que ya viene con Bite 2."],
  ["Mother Fang", "Araña", 10, "Bosque de Elwynn", null, "vista", "Araña rara para empezar en la Alianza."],
  ["Coldrasp", "Lobo", 12, "Claros de Tirisfal", 1.5, "nueva", "Lobo nuevo de Forever que ya trae Furious Howl."],
  ["Mystmane", "Oso", 13, "Isla Zephras", 1.6, "nueva", "Oso nuevo de Forever que ataca bastante rápido para ser un oso."],
  ["Humar the Pridelord", "Felino", 23, "Los Baldíos", 1.3, "vista", "Élite rara. Felino rápido y muy buscado."],
  ["Mist Howler", "Lobo", 22, "Vallefresno", 1.3, "classic", "Lobo rápido con Furious Howl."],
  ["Lupos", "Lobo", 23, "Bosque del Ocaso", 2.0, "classic", "Lobo raro muy conocido de Classic, con Bite 3."],
  ["Broken Tooth", "Felino", 37, "Tierras Inhóspitas", 1.0, "classic", "El más rápido de la lista: un ataque por segundo."],
  ["Snarler", "Lobo", 42, "Feralas", 2.0, "classic", "Lobo con Bite 6 y Furious Howl 3."],
  ["Ravage", "Hiena", 51, "Las Tierras Devastadas", 1.3, "classic", "Hiena rápida para el final del juego."],
  ["Deathmaw", "Lobo", 53, "Las Estepas Ardientes", 1.2, "classic", "Lobo rápido para el final del juego."]
];

// ---------- ICONOS DE RAZA ----------
// Los Skyborne son nuevos y no tienen icono propio en el servidor de Blizzard
const ICONO_RAZA = {
  humano: "human", enano: "dwarf", elfo: "nightelf", gnomo: "gnome",
  orco: "orc", nomuerto: "undead", tauren: "tauren", trol: "troll"
};

// Escudos oficiales de Alianza y Horda
function iconoFaccion(f, extra = "") {
  const icono = f === "alianza" ? "achievement_pvp_a_a" : "achievement_pvp_h_h";
  return `<span class="wow-icon faction-icon ${extra}" title="${f === "alianza" ? "Alianza" : "Horda"}" aria-hidden="true"><img src="${ICONOS_URL}${icono}.jpg" alt="" loading="lazy" onerror="this.remove()"></span>`;
}

function iconoRaza(id, genero = "male", extra = "") {
  const r = ICONO_RAZA[id];
  const img = r ? `<img src="${ICONOS_URL}achievement_character_${r}_${genero}.jpg" alt="" loading="lazy" onerror="this.remove()">` : "";
  return `<span class="wow-icon race-icon ${extra}" aria-hidden="true"><span class="letter">${RACES[id].nombre[0]}</span>${img}</span>`;
}

// ---------- RAIDS DEL 9 DE DICIEMBRE ----------
const APERTURA_RAIDS = new Date("2026-12-09T00:00:00+01:00");
// Jefes según Method.gg (avance de las raids de Forever)
const RAIDS = [
  { nombre: "Barrow Deeps", jugadores: 10, jefes: 8, icono: null, nota: "Nueva en Forever",
    lista: ["Deepscar Matriarch", "Khalith the Dreadspinner", "Amethrax", "Ravus and Darlissa", "Elder Tangleclaw", "Well of Sorrow", "Del'lynar Songwood", "Sonya Darkhallow"],
    final: "Sonya Darkhallow parece la jefa final." },
  { nombre: "Cima Hyjal", jugadores: 20, jefes: 13, icono: "achievement_boss_archimonde", nota: "Hyjal Summit",
    lista: ["Ancient Guardian", "Bandalar", "Ancient of Decay", "Time-Lost Battalion", "Sylvestris Dusksong", "Old Gloomlurker", "Gharalis the Abyssal", "Kathris the Haunted", "Anara Chillwind", "Elder Minderel", "Tracker Stillwind", "Council of Thorns", "Nythus the Dreambound", "The Wild King"],
    final: "Empieza con el Ancient Guardian y se abre en varios caminos. The Wild King es el jefe final. Blizzard dice 13 jefes y Method nombra 14 encuentros: aún no está claro cuál no cuenta." },
  { nombre: "Guarida de Onyxia", jugadores: 40, jefes: 1, icono: "achievement_boss_onyxia", nota: "Onyxia's Lair",
    lista: ["Onyxia"],
    final: "Tres fases con mucho fuego: lleva resistencia al fuego. Necesitas el Drakefire Amulet." }
];

// ---------- TEST: ¿QUÉ CLASE VA CONTIGO? ----------
// Cada respuesta suma puntos a unas clases. Gana la que más tenga.
const TEST = [
  { pregunta: "En grupo, ¿qué te gusta hacer?", opciones: [
    { texto: "Proteger al grupo", rol: "tanque", puntos: { guerrero: 3, paladin: 2, druida: 2 } },
    { texto: "Curar a los demás", rol: "sanador", puntos: { sacerdote: 3, paladin: 2, chaman: 2, druida: 2 } },
    { texto: "Hacer mucho daño", rol: "melee", puntos: { picaro: 2, mago: 2, brujo: 2, cazador: 2, guerrero: 1 } }
  ] },
  { pregunta: "¿Cerca o lejos del enemigo?", opciones: [
    { texto: "Cuerpo a cuerpo", rol: "melee", puntos: { guerrero: 2, picaro: 2, paladin: 2, chaman: 1, druida: 1 } },
    { texto: "Desde lejos", rol: "distancia", puntos: { mago: 2, brujo: 2, cazador: 2, sacerdote: 1, chaman: 1, druida: 1 } },
    { texto: "Me da igual", icono: "inv_misc_coin_01", puntos: { druida: 2, chaman: 2, paladin: 1 } }
  ] },
  { pregunta: "¿Quieres un compañero que luche contigo?", opciones: [
    { texto: "Sí, una bestia", icono: "ability_hunter_beasttaming", puntos: { cazador: 4 } },
    { texto: "Sí, un demonio", icono: "spell_shadow_metamorphosis", puntos: { brujo: 4 } },
    { texto: "No, voy por libre", icono: "ability_stealth", puntos: { picaro: 1, guerrero: 1, mago: 1, sacerdote: 1 } }
  ] },
  { pregunta: "¿Qué te mola más?", opciones: [
    { texto: "Sigilo y emboscadas", icono: "ability_stealth", puntos: { picaro: 3, druida: 1 } },
    { texto: "Armadura pesada", icono: "ability_warrior_defensivestance", puntos: { guerrero: 3, paladin: 3 } },
    { texto: "Fuego, hielo y rayos", icono: "spell_fire_firebolt02", puntos: { mago: 3, chaman: 2 } },
    { texto: "Cambiar de forma", icono: "ability_racial_bearform", puntos: { druida: 4 } }
  ] },
  { pregunta: "¿Es tu primera vez en WoW?", opciones: [
    { texto: "Sí, soy nuevo", icono: "inv_misc_map_01", puntos: { cazador: 2, paladin: 2 } },
    { texto: "No, ya he jugado", icono: "inv_misc_book_09", puntos: {} }
  ] }
];

// ---------- MAZMORRAS (PvE) ----------
// Fuente: foreverchanges.pro (beta 1.60.1.70753)
// Niveles de las nuevas: Blizzard. Niveles de las clásicas: datos de Classic, sin confirmar en Forever.
// [nombre, nivel mínimo, nivel máximo, zona, nueva en Forever]
const MAZMORRAS = [
  ["Hall of Thanes", 13, 18, "Bajo Forjaz", true],
  ["Sima Ígnea", 13, 18, "Orgrimmar", false],
  ["Ruins of Lordaeron", 15, 20, "Lordaeron", true],
  ["Cuevas de los Lamentos", 17, 24, "Los Baldíos", false],
  ["Las Minas de la Muerte", 17, 26, "Páramos de Poniente", false],
  ["Castillo de Colmillo Oscuro", 22, 30, "Bosque de Argénteos", false],
  ["Cavernas de Brazanegra", 24, 32, "Vallefresno", false],
  ["Las Mazmorras", 24, 32, "Ventormenta", false],
  ["Excavation Site: Wetlands", 26, 31, "Los Humedales", true],
  ["City of Dalaran", 28, 33, "Montañas de Alterac", true],
  ["Gnomeregan", 29, 38, "Dun Morogh", false],
  ["Horado Rajacieno", 29, 38, "Los Baldíos", false],
  ["Monasterio Escarlata: Cementerio", 30, 38, "Claros de Tirisfal", false],
  ["Monasterio Escarlata: Biblioteca", 33, 41, "Claros de Tirisfal", false],
  ["The Drowned City", 35, 40, "Costa de Tuercespina", true],
  ["Monasterio Escarlata: Armería", 36, 44, "Claros de Tirisfal", false],
  ["Zahúrda Rajacieno", 37, 46, "Los Baldíos", false],
  ["Monasterio Escarlata: Catedral", 38, 46, "Claros de Tirisfal", false],
  ["Krol'dok Stronghold", 40, 45, "Riverglades", true],
  ["Uldaman", 41, 51, "Tierras Inhóspitas", false],
  ["Zul'Farrak", 44, 54, "Tanaris", false],
  ["Maraudon", 46, 55, "Desolace", false],
  ["Alcaz Prison", 48, 53, "Marjal Revolcafango", true],
  ["Templo de Atal'Hakkar", 50, 60, "Pantano de las Penas", false],
  ["Profundidades de Roca Negra", 52, 60, "Montaña Roca Negra", false],
  ["La Masacre: Este", 54, 60, "Feralas", false],
  ["Blackmaw Hold", 55, 60, "Azshara", true],
  ["Cumbre de Roca Negra Inferior", 55, 60, "Montaña Roca Negra", false],
  ["La Masacre: Norte", 56, 60, "Feralas", false],
  ["La Masacre: Oeste", 56, 60, "Feralas", false],
  ["Scholomance", 58, 60, "Tierras de la Peste del Oeste", false],
  ["Shaper's Terrace", 58, 60, "Cráter de Un'Goro", true],
  ["Stratholme: Puerta principal", 58, 60, "Tierras de la Peste del Este", false],
  ["Stratholme: Puerta de servicio", 58, 60, "Tierras de la Peste del Este", false],
  ["Cumbre de Roca Negra Superior", 59, 60, "Montaña Roca Negra", false]
];

// ---------- CAMPOS DE BATALLA (PvP) ----------
// Fuente: MetaBot.GG (cliente 1.60.1). El tamaño de los equipos aún no se conoce.
const CAMPOS_BATALLA = [
  { nombre: "Garganta Grito de Guerra", icono: "achievement_bg_winwsg", nueva: false, tipo: "Captura la bandera" },
  { nombre: "Cuenca de Arathi", icono: "achievement_bg_winab", nueva: false, tipo: "Controla las bases" },
  { nombre: "Valle de Alterac", icono: "achievement_bg_winav", nueva: false, tipo: "Gran batalla" },
  { nombre: "Battle for Gilneas", icono: "achievement_battleground_battleforgilneas", nueva: true, tipo: "" },
  { nombre: "Darkspear Islands", icono: "inv_misc_tournaments_banner_troll", nueva: true, tipo: "" }
];

// ---------- ZONAS PARA SUBIR DE NIVEL ----------
// Fuente: wow-travelcraft.com y mmonster.co (datos de la beta). Shen'dralas aún no tiene nivel confirmado.
// [nombre, nivel mínimo, nivel máximo, facción ("alianza", "horda" o "ambas"), nueva o cambiada en Forever, continente]
const ZONAS = [
  ["Dun Morogh", 1, 10, "alianza", true, "Reinos del Este"],
  ["Bosque de Elwynn", 1, 10, "alianza", true, "Reinos del Este"],
  ["Teldrassil", 1, 10, "alianza", false, "Kalimdor"],
  ["Claros de Tirisfal", 1, 10, "horda", true, "Reinos del Este"],
  ["Durotar", 1, 10, "horda", false, "Kalimdor"],
  ["Mulgore", 1, 10, "horda", false, "Kalimdor"],
  ["Isla Zephras", 1, 12, "ambas", true, "Solo Skyborne"],
  ["Loch Modan", 10, 20, "alianza", false, "Reinos del Este"],
  ["Páramos de Poniente", 10, 20, "alianza", false, "Reinos del Este"],
  ["Costa Oscura", 10, 20, "alianza", false, "Kalimdor"],
  ["Bosque de Argénteos", 10, 20, "horda", false, "Reinos del Este"],
  ["Los Baldíos", 10, 25, "horda", false, "Kalimdor"],
  ["Montañas Crestagrana", 15, 25, "ambas", true, "Reinos del Este"],
  ["Sierra Espolón", 15, 27, "ambas", false, "Kalimdor"],
  ["Bosque del Ocaso", 18, 30, "ambas", true, "Reinos del Este"],
  ["Vallefresno", 18, 30, "ambas", false, "Kalimdor"],
  ["Laderas de Trabalomas", 20, 30, "ambas", true, "Reinos del Este"],
  ["Los Humedales", 20, 30, "ambas", true, "Reinos del Este"],
  ["Las Mil Agujas", 25, 35, "ambas", false, "Kalimdor"],
  ["Montañas de Alterac", 30, 40, "ambas", true, "Reinos del Este"],
  ["Tierras Altas de Arathi", 30, 40, "ambas", false, "Reinos del Este"],
  ["Desolace", 30, 40, "ambas", true, "Kalimdor"],
  ["Vega de Tuercespina", 30, 45, "ambas", true, "Reinos del Este"],
  ["Tierras Inhóspitas", 35, 45, "ambas", true, "Reinos del Este"],
  ["Riverglades", 35, 45, "ambas", true, "Reinos del Este"],
  ["Pantano de las Penas", 35, 45, "ambas", true, "Reinos del Este"],
  ["Marjal Revolcafango", 35, 45, "ambas", true, "Kalimdor"],
  ["Tierras del Interior", 40, 50, "ambas", false, "Reinos del Este"],
  ["Feralas", 40, 50, "ambas", false, "Kalimdor"],
  ["Tanaris", 40, 50, "ambas", true, "Kalimdor"],
  ["La Garganta de Fuego", 43, 50, "ambas", false, "Reinos del Este"],
  ["Las Tierras Devastadas", 45, 55, "ambas", false, "Reinos del Este"],
  ["Azshara", 45, 55, "ambas", true, "Kalimdor"],
  ["Frondavil", 48, 55, "ambas", false, "Kalimdor"],
  ["Cráter de Un'Goro", 48, 55, "ambas", true, "Kalimdor"],
  ["Las Estepas Ardientes", 50, 58, "ambas", true, "Reinos del Este"],
  ["Tierras de la Peste del Oeste", 51, 58, "ambas", false, "Reinos del Este"],
  ["Tierras de la Peste del Este", 53, 60, "ambas", false, "Reinos del Este"],
  ["Cuna del Invierno", 53, 60, "ambas", true, "Kalimdor"],
  ["Paso de la Muerte", 55, 60, "ambas", false, "Reinos del Este"],
  ["Claro de la Luna", 55, 60, "ambas", false, "Kalimdor"],
  ["Silithus", 55, 60, "ambas", false, "Kalimdor"],
  ["Monte Hyjal", 55, 60, "ambas", true, "Kalimdor"]
];
// Zonas completamente nuevas de Forever (para marcarlas aparte)
const ZONAS_NUEVAS = ["Isla Zephras", "Riverglades", "Monte Hyjal"];

// Ayudas para las mascotas
function familia(nombre) {
  return FAMILIAS.find(f => f[0] === nombre);
}

function iconoFamilia(nombre) {
  const f = FAMILIAS.find(x => x[0] === nombre);
  const icono = f && f[1] ? `<img src="${ICONOS_URL}${f[1]}.jpg" alt="" loading="lazy" onerror="this.remove()">` : "";
  return `<span class="pet-icon" aria-hidden="true"><span>${nombre[0]}</span>${icono}</span>`;
}

// ---------- DÓNDE ESTÁ CADA MASCOTA ----------
// Fuente: wowforeverpets.com (datos sincronizados de Forever). Coordenadas en % del mapa de la zona.
// conoce = habilidades con las que viene al domarla · aprende = las que puede aprender después
const MASCOTAS_MAPA = {
  "Shal'ma": { puntos: [[59.8, 89.2], [60.4, 89.6], [60.8, 89.8], [61.4, 90.6], [62.8, 96.8], [63.6, 95.6], [69, 71.6], [69.8, 71.4]], conoce: [], aprende: ["Bite", "Claw", "Dash"] },
  "Ghostfang": { puntos: [[74.2, 63.2], [74.8, 63.4], [79.4, 42.8], [79.8, 43], [80.4, 46.6], [80.8, 46.8], [81.6, 55.4], [82, 55.8]], conoce: [], aprende: ["Bite", "Claw", "Dash"] },
  "Matriarch Bristlefur": { puntos: [[51, 80.6], [51.8, 79.2], [59, 80.6], [59.6, 80.8], [63.2, 77], [64.8, 77], [65.2, 77.8], [67.4, 76.8]], conoce: [], aprende: ["Bite", "Claw", "Dash"] },
  "Nightscreech": { puntos: [[38.2, 28.2], [40, 55.6], [40.2, 54.8], [46.4, 33.6], [46.8, 32]], conoce: [], aprende: ["Claw", "Dive"] },
  "Fernfeather": { puntos: [[48, 85.4], [51.4, 82.4], [51.4, 83], [53.6, 80], [54, 79.4]], conoce: [], aprende: ["Bite", "Dash"] },
  "The Rake": { puntos: [[47, 19.4], [48.6, 17.8], [49.4, 24.6], [50.2, 22.6], [51.4, 18.4], [52.4, 13.4], [52.8, 19.4], [54.2, 23.2]], conoce: [], aprende: ["Bite", "Claw", "Dash"] },
  "Timber": { puntos: [[33.2, 40.4], [33.4, 40.8], [33.6, 40.2], [34, 39], [34.2, 41.8], [34.4, 43], [34.6, 41.6], [36.4, 41.8]], conoce: ["Bite 2"], aprende: ["Bite", "Dash"] },
  "Mother Fang": { puntos: [[60.4, 47], [60.8, 47], [61.4, 48], [61.4, 48.8], [61.6, 47.4], [61.8, 47.8]], conoce: [], aprende: ["Bite", "Dash"] },
  "Coldrasp": { puntos: [[19.8, 65]], conoce: ["Furious Howl 1", "Faster Attack 3"], aprende: ["Bite", "Dash"] },
  "Mystmane": { puntos: [[57.6, 37], [57.8, 38.2], [58.8, 37.6], [60.2, 34.6], [60.2, 36.8], [60.4, 36.2], [60.8, 35.4]], conoce: ["Increased Attackspeed 2"], aprende: ["Bite", "Claw", "Dash"] },
  "Humar the Pridelord": { puntos: [[62, 33.4], [62, 34.8]], conoce: [], aprende: ["Bite", "Claw", "Dash"] },
  "Mist Howler": { puntos: [[17, 30.2], [19.6, 29.6], [22.2, 29.4], [22.4, 33.4], [22.8, 35.4], [23.8, 37.2], [26.4, 18.8], [29.2, 17.8]], conoce: ["Furious Howl 1"], aprende: ["Bite", "Dash"] },
  "Lupos": { puntos: [[19.8, 29.6], [22.2, 25.8], [23.8, 31.2], [25.6, 27.8], [28, 27.6], [29.6, 29], [34, 28.2], [36.2, 27.2]], conoce: ["Bite 3"], aprende: ["Bite", "Dash"] },
  "Broken Tooth": { puntos: [[25.8, 48.6], [43.4, 36.8], [45, 34.4], [46.8, 37], [51.6, 14], [53.4, 19], [54.8, 15.4], [60.4, 30.2]], conoce: ["Dash 1"], aprende: ["Bite", "Claw", "Dash"] },
  "Snarler": { puntos: [[74.8, 35.4], [75.8, 37.8], [76.6, 38.4], [77.6, 39.8], [79.6, 41.6], [81.2, 39.2], [82.8, 38.8], [85.4, 37]], conoce: ["Bite 6", "Furious Howl 3"], aprende: ["Bite", "Dash"] },
  "Ravage": { puntos: [[44.2, 34.8], [47.4, 35], [48.6, 35.6], [49.8, 35.2], [58.2, 36.6], [59.4, 37.6], [60.6, 37.2], [63, 36.4]], conoce: ["Dash 3"], aprende: ["Bite", "Dash"] },
  "Deathmaw": { puntos: [[70.8, 29], [75, 32.4], [79.4, 58.6], [81, 59], [81.8, 29.8], [82.6, 30.4], [86.4, 51.4], [88, 50.2]], conoce: [], aprende: ["Bite", "Dash"] }
};

// Qué hace cada habilidad de mascota, si es activa o pasiva, y para qué sirve
// [qué hace, "activa" o "pasiva", sirve en PvE, sirve en PvP]
const HABILIDADES_MASCOTA = {
  "Bite": ["Mordisco: daño directo", "activa", true, true],
  "Claw": ["Zarpazo: daño directo", "activa", true, true],
  "Dash": ["Acelerón: corre más rápido un momento", "activa", false, true],
  "Dive": ["Picado: vuela más rápido un momento", "activa", false, true],
  "Furious Howl": ["Aullido: sube el ataque del grupo", "activa", true, false],
  "Faster Attack": ["Ataca más rápido siempre", "pasiva", true, true],
  "Increased Attackspeed": ["Ataca más rápido siempre", "pasiva", true, true]
};

// ---------- CHECKLIST DEL DÍA 1 ----------
// [id, icono, texto, detalle]
const CHECKLIST = [
  ["test", "inv_misc_dice_01", "Elige tu clase", "Haz el test si dudas"],
  ["pj", "achievement_character_human_male", "Crea tu personaje", "Facción, raza y clase"],
  ["entrenador", "inv_misc_book_09", "Visita a tu entrenador al subir de nivel", "Ahí aprendes las habilidades nuevas"],
  ["profes", "trade_mining", "Elige dos profesiones", "Las de recolección dan oro desde el principio"],
  ["secundarias", "spell_holy_sealofsacrifice", "Aprende Primeros auxilios y Cocina", "Son secundarias, puedes tener todas"],
  ["talento", "ability_marksmanship", "Nivel 10: tu primer punto de talento", "Planéalo en la calculadora"],
  ["cazador", "ability_hunter_beasttaming", "Cazador: misión de domar a nivel 10", "Te la da tu entrenador de clase"],
  ["mazmorra", "achievement_dungeon_classicdungeonmaster", "Tu primera mazmorra", "Mira cuál te toca en el Diario"],
  ["hermandad", "inv_misc_tournaments_banner_troll", "Únete a una hermandad", "Subir en grupo es más rápido y divertido"],
  ["comunidad", "inv_misc_note_01", "Deja tu build o tu duda en la web", "Ayudas a los que vienen detrás"]
];

// ---------- CAMPAMENTOS (nuevo en Forever) ----------
// Cada profesión construye un objeto para el campamento. Sentarte o fabricar 1 minuto junto al fuego
// te da el bonus de todos los objetos durante 1 hora. Fuente: MmonsteR (datos de la beta, 21 oct).
// [profesión, objeto nivel 1, qué da, no se acumula con, objeto nivel 2, objeto nivel 3]
const CAMPAMENTO = [
  ["Alquimia", "Mana Well", "Regeneración de maná", "Bendición de sabiduría", "Fermenter", "Alchemy Laboratory"],
  ["Herrería", "Sharpening Wheel", "Fuerza", "Tótem Fuerza de la tierra", "Anvil", "Master Forge"],
  ["Encantamiento", "Enchanted Lute", "Armadura, todas las estadísticas y resistencias", "Marca de lo salvaje", "Arcane Salvager", "Arcane Forge"],
  ["Ingeniería", "Reagent Bot", "Vende componentes (el de nivel 2 también repara)", null, "Repair Bot", "Anarchist's Workbench"],
  ["Herboristería", "Incense Candle", "Intelecto", "Intelecto Arcano", "Greenhouse", "Seed Hybridizer"],
  ["Peletería", "Camp Tent", "Descanso: más experiencia (hasta 5% de un nivel)", null, "Tanning Rack", "Sewing Machine"],
  ["Minería", "Lodestone", "Poder de ataque cuerpo a cuerpo", "Bendición de poderío", "Rock Garden", "Molten Foundry"],
  ["Desuello", "Camp Chair", "+2% de crítico", "Aura de lechúcico lunar", "Field Guide", "Trapper's Workbench"],
  ["Sastrería", "Faction Banner", "Espíritu (solo tu facción)", "Espíritu divino", "Spinning Wheel", "Loom"],
  ["Primeros auxilios", "First Aid Kit", "Aguante", "Palabra de poder: entereza", "Toxin Study", "Plague Doctor's Laboratory"],
  ["Pesca", "Fish Bowl", "+8% a todas las estadísticas", "Bendición de reyes", "Fishing Rack", null]
];
// Niveles del fuego: cuántos objetos caben
const FUEGOS = [["Básico", 3], ["Oficial", 5], ["Experto", 10]];
// Profesiones de fabricación que dan puntos de Legado (a 150, 225 y 300). Cuentan para toda la cuenta.
const OFICIOS_LEGADO = ["Alquimia", "Herrería", "Encantamiento", "Ingeniería", "Peletería", "Sastrería"];

// ---------- ¿QUÉ PROFESIONES ME COJO? ----------
// Tipo de armadura de cada clase: así sabemos qué profesión le hace su equipo
const ARMADURA = { guerrero: "placas", paladin: "placas", cazador: "cuero", picaro: "cuero", chaman: "cuero", druida: "cuero", mago: "tela", brujo: "tela", sacerdote: "tela" };
// [profesión 1, profesión 2, para qué, por qué (corto)]
const PAREJAS_META = {
  equipo: {
    placas: ["Minería", "Herrería", "Te fabricas tus armas y tus placas", "La minería te da el metal gratis. Y tu campamento da Fuerza y poder de ataque."],
    cuero: ["Desuello", "Peletería", "Te fabricas tu cuero y tu malla", "Despellejas lo que ya matas. Y la tienda de campaña da más experiencia a tu grupo."],
    tela: ["Sastrería", "Encantamiento", "Te haces tu ropa y encantas tu equipo", "La tela cae sola de los enemigos y lo que no uses lo desencantas. Además, bolsas para todos."]
  },
  pve: ["Ingeniería", "Alquimia", "Para raids", "Pociones y frascos para aguantar más, y aparatos útiles."],
  pvp: ["Ingeniería", "Minería", "Para PvP", "Granadas, capa de escape y aparatos que solo puede usar un ingeniero. La minería le da el metal."],
  oro: ["Herboristería", "Alquimia", "Para ganar oro", "Pociones y frascos siempre se venden, sobre todo los días de raid. Y las hierbas raras valen mucho."],
  subir: ["Desuello", "Herboristería", "Para subir rápido y con oro", "Las dos recogen mientras subes sin gastar nada. A 60 cambias una por una de fabricación."]
};
// Preguntas que se hace todo el mundo
const PREGUNTAS_OFICIOS = [
  ["inv_misc_note_01", "¿Cuántas profesiones puedo tener?", "Dos principales. Además Cocina, Primeros auxilios y Pesca, que no ocupan hueco: cógelas siempre."],
  ["spell_holy_dispelmagic", "¿Puedo cambiar de profesión?", "Sí, olvidándola en el libro de profesiones. Pierdes lo que habías subido. Las de recolección se cambian sin perder recetas."],
  ["inv_letter_15", "¿Puedo pasar lo que fabrico a mis otros personajes?", "Sí, por correo, si son de la misma facción y el mismo modo. Ojo: lo que se fabrica con recetas de Merchant's Favor se liga al recogerlo y no se puede pasar."],
  ["inv_misc_gem_sapphire_01", "¿Qué gano subiendo profesiones?", "Puntos de Legado para toda la cuenta (a 150, 225 y 300 en las de fabricación) y objetos de campamento con bonus."],
  ["trade_engineering", "¿Merece la pena Ingeniería?", "Para PvP sí. Pero casi todo lo que hace solo lo puede usar un ingeniero, así que no sirve para tus otros personajes."],
  ["inv_misc_coin_01", "¿Cuál da más oro?", "Mientras subes, Desuello. A nivel 60, Encantamiento y Alquimia, con Herboristería para conseguir las hierbas."],
  ["inv_misc_book_09", "¿Hay Joyería o Inscripción?", "No en el lanzamiento. Blizzard tiene prevista una actualización de profesiones y Legado para el verano de 2027."]
];
