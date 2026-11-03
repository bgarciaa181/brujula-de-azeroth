// ---------- DATOS ----------
// Datos del juego (cliente 1.60.1). Si quieres corregir algo, edita este archivo.
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

const ROLES = {
  tanque:    "Tanque",
  sanador:   "Sanador",
  melee:     "Daño cuerpo a cuerpo",
  distancia: "Daño a distancia"
};

const CLASSES = [
  { id: "guerrero", nombre: "Guerrero", color: "#C69B6D", recurso: "Ira",
    roles: ["tanque", "melee"],
    pitch: "Armadura pesada y golpes directos. Genera ira al pegar y recibir daño.",
    arboles: [["Armas", "Daño"], ["Furia", "Daño"], ["Protección", "Tanque"]],
    razas: ["humano","enano","elfo","gnomo","skyHO","orco","nomuerto","tauren","trol","skyWS"] },
  { id: "paladin", nombre: "Paladín", color: "#F48CBA", recurso: "Maná",
    roles: ["tanque", "sanador", "melee"],
    pitch: "Guerrero sagrado que aguanta mucho y puede curarse a sí mismo.",
    arboles: [["Sagrado", "Sanador"], ["Protección", "Tanque"], ["Reprensión", "Daño"]],
    razas: ["humano","enano","nomuerto"], facil: true },
  { id: "cazador", nombre: "Cazador", color: "#AAD372", recurso: "Maná",
    roles: ["distancia"],
    pitch: "Ataca desde lejos mientras su mascota se lleva los golpes.",
    arboles: [["Bestias", "Daño"], ["Puntería", "Daño"], ["Supervivencia", "Daño"]],
    razas: ["humano","enano","elfo","skyHO","orco","tauren","trol","skyWS"], facil: true },
  { id: "picaro", nombre: "Pícaro", color: "#FFF468", recurso: "Energía",
    roles: ["melee"],
    pitch: "Sigilo, venenos y mucho daño en poco tiempo. Elige cuándo empieza la pelea.",
    arboles: [["Asesinato", "Daño"], ["Combate", "Daño"], ["Sutileza", "Daño"]],
    razas: ["humano","enano","elfo","gnomo","skyHO","orco","nomuerto","trol","skyWS"] },
  { id: "sacerdote", nombre: "Sacerdote", color: "#E8E8E8", recurso: "Maná",
    roles: ["sanador", "distancia"],
    pitch: "El sanador clásico. Con Sombras se convierte en un lanzador de daño.",
    arboles: [["Disciplina", "Sanador"], ["Sagrado", "Sanador"], ["Sombras", "Daño"]],
    razas: ["humano","enano","elfo","gnomo","nomuerto","trol"] },
  { id: "chaman", nombre: "Chamán", color: "#3F8FE8", recurso: "Maná",
    roles: ["sanador", "melee", "distancia"],
    pitch: "Usa tótems que ayudan al grupo. Puede curar, pegar o lanzar hechizos.",
    arboles: [["Elemental", "Daño a distancia"], ["Mejora", "Daño cuerpo a cuerpo"], ["Restauración", "Sanador"]],
    razas: ["enano","orco","tauren","trol","skyWS"] },
  { id: "mago", nombre: "Mago", color: "#3FC7EB", recurso: "Maná",
    roles: ["distancia"],
    pitch: "Mucho daño desde lejos y control de enemigos. Frágil si te alcanzan.",
    arboles: [["Arcano", "Daño"], ["Fuego", "Daño"], ["Escarcha", "Daño"]],
    razas: ["humano","gnomo","skyHO","orco","nomuerto","trol"] },
  { id: "brujo", nombre: "Brujo", color: "#8788EE", recurso: "Maná",
    roles: ["distancia"],
    pitch: "Invoca demonios y desgasta a los enemigos con daño a lo largo del tiempo.",
    arboles: [["Aflicción", "Daño"], ["Demonología", "Daño"], ["Destrucción", "Daño"]],
    razas: ["humano","gnomo","orco","nomuerto","trol"] },
  { id: "druida", nombre: "Druida", color: "#FF7C0A", recurso: "Maná",
    roles: ["tanque", "sanador", "melee", "distancia"],
    pitch: "Cambia de forma para hacer de todo: oso, felino, sanador o lanzador.",
    arboles: [["Equilibrio", "Daño a distancia"], ["Combate feral", "Tanque o daño"], ["Restauración", "Sanador"]],
    razas: ["elfo","skyHO","tauren","skyWS"] }
];

