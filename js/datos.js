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

const ROLES = {
  tanque:    "Tanque",
  sanador:   "Sanador",
  melee:     "Daño cuerpo a cuerpo",
  distancia: "Daño a distancia"
};

const CLASSES = [
  { id: "guerrero", icono: "classicon_warrior", habilidades: 39, nuevas: 2, nombre: "Guerrero", color: "#C69B6D", recurso: "Ira",
    roles: ["tanque", "melee"],
    pitch: "Armadura pesada y golpes directos. Genera ira al pegar y recibir daño.",
    arboles: [["Armas", "Daño"], ["Furia", "Daño"], ["Protección", "Tanque"]],
    razas: ["humano","enano","elfo","gnomo","skyHO","orco","nomuerto","tauren","trol","skyWS"] },
  { id: "paladin", icono: "classicon_paladin", habilidades: 55, nuevas: 7, nombre: "Paladín", color: "#F48CBA", recurso: "Maná",
    roles: ["tanque", "sanador", "melee"],
    pitch: "Guerrero sagrado que aguanta mucho y puede curarse a sí mismo.",
    arboles: [["Sagrado", "Sanador"], ["Protección", "Tanque"], ["Reprensión", "Daño"]],
    razas: ["humano","enano","nomuerto"], facil: true },
  { id: "cazador", icono: "classicon_hunter", habilidades: 62, nuevas: 4, nombre: "Cazador", color: "#AAD372", recurso: "Maná",
    roles: ["distancia"],
    pitch: "Ataca desde lejos mientras su mascota se lleva los golpes.",
    arboles: [["Bestias", "Daño"], ["Puntería", "Daño"], ["Supervivencia", "Daño"]],
    razas: ["humano","enano","elfo","skyHO","orco","tauren","trol","skyWS"], facil: true },
  { id: "picaro", icono: "classicon_rogue", habilidades: 28, nuevas: 1, nombre: "Pícaro", color: "#FFF468", recurso: "Energía",
    roles: ["melee"],
    pitch: "Sigilo, venenos y mucho daño en poco tiempo. Elige cuándo empieza la pelea.",
    arboles: [["Asesinato", "Daño"], ["Combate", "Daño"], ["Sutileza", "Daño"]],
    razas: ["humano","enano","elfo","gnomo","skyHO","orco","nomuerto","trol","skyWS"] },
  { id: "sacerdote", icono: "classicon_priest", habilidades: 56, nuevas: 6, nombre: "Sacerdote", color: "#E8E8E8", recurso: "Maná",
    roles: ["sanador", "distancia"],
    pitch: "El sanador clásico. Con Sombras se convierte en un lanzador de daño.",
    arboles: [["Disciplina", "Sanador"], ["Sagrado", "Sanador"], ["Sombras", "Daño"]],
    razas: ["humano","enano","elfo","gnomo","nomuerto","trol"] },
  { id: "chaman", icono: "classicon_shaman", habilidades: 55, nuevas: 4, nombre: "Chamán", color: "#3F8FE8", recurso: "Maná",
    roles: ["sanador", "melee", "distancia"],
    pitch: "Usa tótems que ayudan al grupo. Puede curar, pegar o lanzar hechizos.",
    arboles: [["Elemental", "Daño a distancia"], ["Mejora", "Daño cuerpo a cuerpo"], ["Restauración", "Sanador"]],
    razas: ["enano","orco","tauren","trol","skyWS"] },
  { id: "mago", icono: "classicon_mage", habilidades: 63, nuevas: 3, nombre: "Mago", color: "#3FC7EB", recurso: "Maná",
    roles: ["distancia"],
    pitch: "Mucho daño desde lejos y control de enemigos. Frágil si te alcanzan.",
    arboles: [["Arcano", "Daño"], ["Fuego", "Daño"], ["Escarcha", "Daño"]],
    razas: ["humano","gnomo","skyHO","orco","nomuerto","trol"] },
  { id: "brujo", icono: "classicon_warlock", habilidades: 51, nuevas: 2, nombre: "Brujo", color: "#8788EE", recurso: "Maná",
    roles: ["distancia"],
    pitch: "Invoca demonios y desgasta a los enemigos con daño a lo largo del tiempo.",
    arboles: [["Aflicción", "Daño"], ["Demonología", "Daño"], ["Destrucción", "Daño"]],
    razas: ["humano","gnomo","orco","nomuerto","trol"] },
  { id: "druida", icono: "classicon_druid", habilidades: 58, nuevas: 1, nombre: "Druida", color: "#FF7C0A", recurso: "Maná",
    roles: ["tanque", "sanador", "melee", "distancia"],
    pitch: "Cambia de forma para hacer de todo: oso, felino, sanador o lanzador.",
    arboles: [["Equilibrio", "Daño a distancia"], ["Combate feral", "Tanque o daño"], ["Restauración", "Sanador"]],
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
// [nombre, tipo, recetas totales, recetas nuevas en Forever]
const PROFESIONES = {
  principales: [
    ["Peletería", "Fabricación", 595, 271],
    ["Herrería", "Fabricación", 512, 197],
    ["Sastrería", "Fabricación", 471, 180],
    ["Ingeniería", "Fabricación", 282, 77],
    ["Encantamiento", "Fabricación", 262, 63],
    ["Alquimia", "Fabricación", 196, 70],
    ["Minería", "Recolección", 21, 5],
    ["Herboristería", "Recolección", 7, 5],
    ["Desuello", "Recolección", 4, 4]
  ],
  secundarias: [
    ["Cocina", "Fabricación", 133, 44],
    ["Primeros auxilios", "Fabricación", 32, 17],
    ["Pesca", "Recolección", 6, 5],
    ["Comprensión", "Nueva: sube usándola", 7, 7]
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
  { fecha: "17 sep – 22 oct 2026", titulo: "Beta", texto: "Beta cerrada hasta nivel 30.", estado: "hecho" },
  { fecha: "27 oct 2026", titulo: "Reserva de nombres", texto: "Creación de personajes anticipada.", estado: "hecho" },
  { fecha: "5 nov 2026 · 00:00", titulo: "Lanzamiento", texto: "Abren los servidores (4 nov a las 15:00 en EE. UU., hora del Pacífico).", estado: "pronto" },
  { fecha: "9 dic 2026", titulo: "Abren las primeras raids", texto: "Barrow Deeps (10 jugadores, 8 jefes), Cima Hyjal (20 jugadores, 13 jefes) y Guarida de Onyxia (40 jugadores, 1 jefe).", estado: "futuro" },
  { fecha: "Invierno 2026", titulo: "Modo Hardcore", texto: "Servidores donde si mueres, pierdes el personaje. Sin fecha exacta todavía.", estado: "futuro" },
  { fecha: "Primavera 2027", titulo: "Primera gran actualización", texto: "Dos raids nuevas de nivel 60, dos mazmorras nuevas, nuevas misiones y zona, una cadena de misiones legendaria y nueva temporada JcJ.", estado: "futuro" },
  { fecha: "Verano 2027", titulo: "Segunda gran actualización", texto: "Una raid nueva de nivel 60 y una raid clásica renovada.", estado: "futuro" }
];

// ---------- MASCOTAS DE CAZADOR ----------
// Fuentes: foreverdb.net (cliente beta 1.60.1.70707) y mmonster.co (beta 70450)
// velocidad = segundos entre ataques (menos = ataca más rápido)
// estado: "nueva" = mascota nueva de Forever · "vista" = vista en la beta de Forever · "classic" = dato de Classic, sin confirmar aún en Forever
const FAMILIAS = [
  ["Lobo", "ability_hunter_pet_wolf", "Furious Howl", "Sube el poder de ataque del grupo"],
  ["Felino", "ability_hunter_pet_cat", "Prowl", "Sigilo para emboscar"],
  ["Oso", "ability_hunter_pet_bear", "Swipe", "Golpea a varios enemigos"],
  ["Jabalí", "ability_hunter_pet_boar", "Charge", "Carga hacia el enemigo"],
  ["Raptor", "ability_hunter_pet_raptor", "Savage Rend", "Desgarro con sangrado"],
  ["Serpiente alada", "ability_hunter_pet_windserpent", "Lightning Breath", "Ataque de rayo a distancia"],
  ["Murciélago", "ability_hunter_pet_bat", "Sonic Blast", "Molesta a los lanzadores de hechizos"],
  ["Ave rapaz", "ability_hunter_pet_owl", "Mine!", "Desarma al enemigo"],
  ["Carroñero", "ability_hunter_pet_vulture", "Demoralizing Screech", "Baja el ataque del enemigo"],
  ["Crocolisco", "ability_hunter_pet_crocolisk", "Dismember", "Reduce la sanación del enemigo"],
  ["Hiena", "ability_hunter_pet_hyena", "Tendon Rip", "Ralentiza al enemigo"],
  ["Gorila", "ability_hunter_pet_gorilla", "Thunderstomp", "Daño en área"],
  ["Escórpido", "ability_hunter_pet_scorpid", "Scorpid Poison", "Veneno"],
  ["Araña", "ability_hunter_pet_spider", "Web", "Inmoviliza al enemigo"],
  ["Tortuga", "ability_hunter_pet_turtle", "Shell Shield", "Reduce el daño recibido"],
  ["Cangrejo", "ability_hunter_pet_crab", "Pinch", "Pellizco"],
  ["Zancaalta", "ability_hunter_pet_tallstrider", "Dust Cloud", "Ciega al enemigo"],
  ["Zorro", null, "Trickster's Dance", "Familia nueva"],
  ["Can del Núcleo", "ability_hunter_pet_corehound", "Lava Breath", "Exótica"]
];

// [nombre, familia, nivel, zona, velocidad o null, estado, nota]
const MASCOTAS = [
  ["Shal'ma", "Felino", 9, "Durotar", null, "nueva", "Felino nuevo de Forever en la zona de inicio de orcos y trols."],
  ["Ghostfang", "Felino", 10, "Dun Morogh", null, "nueva", "Felino nuevo de Forever para empezar en la Alianza."],
  ["Matriarch Bristlefur", "Oso", 10, "Bosque de Elwynn", null, "nueva", "Osa nueva de Forever al lado de Ventormenta."],
  ["Nightscreech", "Ave rapaz", 10, "Teldrassil", null, "nueva", "Ave rapaz nueva de Forever."],
  ["Fernfeather", "Zancaalta", 10, "Isla Zephras", null, "nueva", "Nueva, en la zona de inicio de los Skyborne."],
  ["The Rake", "Felino", 10, "Mulgore", 1.2, "vista", "Ataca muy rápido para su nivel. Ideal para empezar en la Horda."],
  ["Timber", "Lobo", 10, "Dun Morogh", null, "vista", "Lobo de nivel 10 que ya viene con Bite 2."],
  ["Mother Fang", "Araña", 10, "Bosque de Elwynn", null, "vista", "Araña rara para empezar en la Alianza."],
  ["Coldrasp", "Lobo", 12, "Claros de Tirisfal", 1.5, "nueva", "Lobo nuevo de Forever que ya trae Furious Howl."],
  ["Mystmane", "Oso", 13, "Isla Zephras", 1.6, "nueva", "Oso nuevo de Forever que trae Savage Rend, la habilidad de los raptores."],
  ["Humar the Pridelord", "Felino", 23, "Los Baldíos", 1.3, "vista", "Élite rara. Felino rápido y muy buscado."],
  ["Mist Howler", "Lobo", 22, "Vallefresno", 1.3, "classic", "Lobo rápido con Furious Howl."],
  ["Lupos", "Lobo", 23, "Bosque del Ocaso", null, "classic", "Lobo raro muy conocido de Classic, con Bite 3."],
  ["Broken Tooth", "Felino", 37, "Tierras Inhóspitas", 1.0, "classic", "El más rápido de la lista: un ataque por segundo."],
  ["Snarler", "Lobo", 42, "Feralas", null, "classic", "Lobo con Bite 6 y Furious Howl 3."],
  ["Ravage", "Hiena", 51, "Las Tierras Devastadas", 1.3, "classic", "Hiena rápida para el final del juego."],
  ["Deathmaw", "Lobo", 53, "Las Estepas Ardientes", 1.2, "classic", "Lobo rápido para el final del juego."]
];
