// ---------- META DEL JUEGO ----------
// Juntamos varias tier lists públicas y sacamos la media de cada especialización.
// Cuando salga un parche, se cambian las letras de aquí y la fecha. Nada más.
// Letras: S (lo mejor), A, B, C, D.

const META_FECHA = "4 nov 2026";
const META_PARCHE = "Cliente 1.60.1 (beta, nivel 30 llevado a 60)";

// Las fuentes. La letra corta es la que sale en cada especialización.
const META_FUENTES = {
  L: ["LFCarry", "https://lfcarry.com/guides/wow-forever-tier-list", "4 nov"],
  Y: ["MythicSim (simulaciones)", "https://mythicsim.com/wow-forever/tier-list", "3 nov"],
  M: ["MmonsteR", "https://mmonster.co/wow-forever/guides/tier-lists/pvp-tier-list", "3 nov"],
  I: ["WoW Forever Info", "https://wowforeverinfo.com/tier-lists/pvp/", "31 oct"],
  "1": ["Lista pública 1 (recopilada por MmonsteR)", "https://mmonster.co/wow-forever/guides/tier-lists/tank-healer-tier-list", "3 nov"],
  "2": ["Lista pública 2 (recopilada por MmonsteR)", "https://mmonster.co/wow-forever/guides/tier-lists/tank-healer-tier-list", "3 nov"],
  "3": ["Lista pública 3 (recopilada por MmonsteR)", "https://mmonster.co/wow-forever/guides/tier-lists/tank-healer-tier-list", "3 nov"]
};

// [clase, especialización, notas por fuente, detalle opcional]
const META = {
  dps: [
    ["guerrero", "Armas", { L: "A", Y: "B" }],
    ["guerrero", "Furia", { L: "A", Y: "A" }],
    ["paladin", "Reprensión", { L: "B", Y: "S" }],
    ["cazador", "Bestias", { L: "S", Y: "B" }],
    ["cazador", "Puntería", { L: "S", Y: "A" }],
    ["cazador", "Supervivencia", { L: "A", Y: "S" }],
    ["picaro", "Asesinato", { L: "A", Y: "B" }],
    ["picaro", "Combate", { L: "A", Y: "B" }],
    ["picaro", "Sutileza", { L: "B", Y: "B" }],
    ["sacerdote", "Sombras", { L: "B", Y: "B" }],
    ["chaman", "Elemental", { L: "A", Y: "C" }],
    ["chaman", "Mejora", { L: "S", Y: "S" }],
    ["mago", "Arcano", { L: "B", Y: "A" }],
    ["mago", "Fuego", { L: "B", Y: "A" }],
    ["mago", "Escarcha", { L: "B", Y: "C" }],
    ["brujo", "Aflicción", { L: "B", Y: "B" }],
    ["brujo", "Demonología", { L: "A", Y: "A" }],
    ["brujo", "Destrucción", { L: "B", Y: "A" }],
    ["druida", "Combate feral", { L: "B", Y: "A" }, "felino"],
    ["druida", "Equilibrio", { L: "C", Y: "B" }]
  ],
  tanque: [
    ["paladin", "Protección", { 1: "S", 2: "S" }],
    ["guerrero", "Protección", { 1: "S", 2: "A" }],
    ["druida", "Combate feral", { 1: "A", 2: "B" }, "oso"]
  ],
  sanador: [
    ["sacerdote", "Disciplina", { 1: "S", 2: "S", 3: "S" }],
    ["chaman", "Restauración", { 1: "S", 2: "A", 3: "A" }],
    ["sacerdote", "Sagrado", { 1: "S", 2: "A", 3: "B" }],
    ["druida", "Restauración", { 1: "A", 2: "S", 3: "S" }],
    ["paladin", "Sagrado", { 1: "A", 2: "B", 3: "A" }]
  ],
  // Campos de batalla
  bg: [
    ["sacerdote", "Disciplina", { I: "S", M: "A" }],
    ["chaman", "Restauración", { I: "S", M: "B" }],
    ["mago", "Escarcha", { I: "S", M: "A" }],
    ["brujo", "Aflicción", { I: "S", M: "A" }],
    ["sacerdote", "Sagrado", { I: "A", M: "B" }],
    ["sacerdote", "Sombras", { I: "A", M: "A" }],
    ["brujo", "Demonología", { I: "A", M: "S" }],
    ["brujo", "Destrucción", { I: "A", M: "B" }],
    ["guerrero", "Armas", { I: "A", M: "B" }],
    ["chaman", "Mejora", { I: "A", M: "B" }],
    ["chaman", "Elemental", { I: "A", M: "B" }],
    ["cazador", "Puntería", { I: "A", M: "A" }],
    ["cazador", "Bestias", { I: "A", M: "A" }],
    ["picaro", "Sutileza", { I: "A", M: "A" }],
    ["druida", "Combate feral", { I: "A", M: "A" }, "oso"],
    ["paladin", "Sagrado", { I: "A", M: "A" }],
    ["druida", "Restauración", { I: "A", M: "A" }],
    ["picaro", "Asesinato", { I: "B", M: "B" }],
    ["picaro", "Combate", { I: "B", M: "B" }],
    ["druida", "Combate feral", { I: "B", M: "A" }, "felino"],
    ["mago", "Fuego", { I: "B", M: "B" }],
    ["mago", "Arcano", { I: "B", M: "C" }],
    ["druida", "Equilibrio", { I: "B", M: "C" }],
    ["paladin", "Reprensión", { I: "B", M: "B" }],
    ["cazador", "Supervivencia", { I: "B", M: "A" }],
    ["guerrero", "Furia", { I: "C", M: "C" }],
    ["guerrero", "Protección", { I: "C", M: "C" }],
    ["paladin", "Protección", { I: "D", M: "C" }]
  ],
  // Duelos y mundo abierto
  duelo: [
    ["brujo", "Aflicción", { I: "S", M: "A" }],
    ["brujo", "Demonología", { I: "S", M: "S" }],
    ["picaro", "Sutileza", { I: "S", M: "A" }],
    ["mago", "Escarcha", { I: "S", M: "A" }],
    ["sacerdote", "Sombras", { I: "S", M: "A" }],
    ["sacerdote", "Disciplina", { I: "A", M: "A" }],
    ["brujo", "Destrucción", { I: "A", M: "B" }],
    ["picaro", "Asesinato", { I: "A", M: "B" }],
    ["picaro", "Combate", { I: "A", M: "B" }],
    ["cazador", "Puntería", { I: "A", M: "A" }],
    ["cazador", "Bestias", { I: "A", M: "A" }],
    ["chaman", "Mejora", { I: "A", M: "B" }],
    ["chaman", "Elemental", { I: "A", M: "B" }],
    ["guerrero", "Armas", { I: "B", M: "B" }],
    ["druida", "Restauración", { I: "B", M: "A" }],
    ["paladin", "Sagrado", { I: "B", M: "A" }],
    ["sacerdote", "Sagrado", { I: "B", M: "B" }],
    ["mago", "Fuego", { I: "B", M: "B" }],
    ["mago", "Arcano", { I: "B", M: "C" }],
    ["druida", "Equilibrio", { I: "B", M: "C" }],
    ["cazador", "Supervivencia", { I: "B", M: "A" }],
    ["druida", "Combate feral", { I: "B", M: "A" }, "felino"],
    ["paladin", "Reprensión", { I: "C", M: "B" }],
    ["guerrero", "Furia", { I: "C", M: "C" }],
    ["chaman", "Restauración", { I: "C", M: "B" }],
    ["druida", "Combate feral", { I: "C", M: "A" }, "oso"],
    ["guerrero", "Protección", { I: "D", M: "C" }],
    ["paladin", "Protección", { I: "D", M: "C" }]
  ]
};

// Pasar letras a números y al revés
const NOTA = { S: 4, A: 3, B: 2, C: 1, D: 0 };
function letraMedia(notas) {
  const v = Object.values(notas).map(l => NOTA[l]);
  const media = v.reduce((a, b) => a + b, 0) / v.length;
  return ["D", "C", "B", "A", "S"][Math.min(4, Math.floor(media + 0.5))];
}
function puntosMeta(notas) {
  const v = Object.values(notas).map(l => NOTA[l]);
  return v.reduce((a, b) => a + b, 0) / v.length;
}
// ¿Están de acuerdo las fuentes?
function acuerdoMeta(notas) {
  const v = Object.values(notas).map(l => NOTA[l]);
  const dif = Math.max(...v) - Math.min(...v);
  return dif === 0 ? "acuerdo" : dif === 1 ? "casi" : "debate";
}

// La mejor especialización de una clase en un modo ("pve" o "pvp")
function mejorSpec(claseId, modo) {
  const listas = modo === "pvp" ? ["bg", "duelo"] : ["dps", "tanque", "sanador"];
  const suma = {};
  for (const l of listas) {
    for (const [c, arbol, notas, extra] of META[l]) {
      if (c !== claseId) continue;
      const k = arbol + (extra ? ` (${extra})` : "");
      suma[k] = suma[k] || { arbol, extra, puntos: [], lista: l };
      suma[k].puntos.push(puntosMeta(notas));
      if (puntosMeta(notas) >= Math.max(...suma[k].puntos)) suma[k].lista = l;
    }
  }
  const lista = Object.values(suma).map(x => ({ ...x, media: x.puntos.reduce((a, b) => a + b, 0) / x.puntos.length }));
  lista.sort((a, b) => b.media - a.media);
  const m = lista[0];
  if (!m) return null;
  const ROL = { tanque: "tanque", sanador: "sanador" };
  const nombre = x => x.arbol + (x.extra ? ` (${x.extra})` : (ROL[x.lista] ? ` (${ROL[x.lista]})` : ""));
  const empatadas = lista.filter(x => x.media === m.media).map(nombre);
  return { ...m, nombre: empatadas.join(" o "), empate: empatadas.length > 1, letra: ["D", "C", "B", "A", "S"][Math.min(4, Math.floor(m.media + 0.5))] };
}

// ---------- MEJOR RAZA PARA CADA CLASE ----------
// Votos de 3 guías: M = MmonsteR, H = Hotspawn, C = ConquestCapped
const RAZA_FUENTES = {
  M: ["MmonsteR", "https://mmonster.co/wow-forever/guides/tier-lists/race-tier-list", "3 nov"],
  H: ["Hotspawn", "https://www.hotspawn.com/world-of-warcraft/guide/wow-forever-best-race-for-each-class", "26 oct"],
  C: ["ConquestCapped", "https://conquestcapped.com/guides/wow-forever/wow-forever-race-tier-list/", "27 oct"]
};
const RAZA_META = {
  guerrero: { alianza: { pve: { M: "elfo", H: "humano", C: "humano" }, pvp: { M: "humano", H: "humano", C: "humano" } },
              horda:   { pve: { M: "orco", H: "skyWS", C: "orco" },     pvp: { H: "orco", C: "orco" } } },
  paladin:  { alianza: { pve: { M: "humano", H: "humano", C: "humano" }, pvp: { M: "humano", H: "humano", C: "enano" } },
              horda:   { pve: { M: "nomuerto", H: "nomuerto", C: "nomuerto" }, pvp: { H: "nomuerto", C: "nomuerto" } } },
  cazador:  { alianza: { pve: { M: "enano", H: "skyHO", C: "humano" }, pvp: { H: "elfo", C: "elfo" } },
              horda:   { pve: { M: "orco", H: "skyWS", C: "orco" },  pvp: { M: "tauren", H: "orco", C: "orco" } } },
  picaro:   { alianza: { pve: { M: "elfo", H: "humano", C: "humano" }, pvp: { H: "humano", C: "gnomo" } },
              horda:   { pve: { M: "orco", H: "skyWS", C: "orco" },    pvp: { M: "nomuerto", H: "nomuerto", C: "orco" } } },
  sacerdote:{ alianza: { pve: { M: "gnomo", H: "humano", C: "gnomo" }, pvp: { M: "humano", H: "elfo", C: "humano" } },
              horda:   { pve: { M: "nomuerto", H: "nomuerto", C: "trol" }, pvp: { H: "nomuerto", C: "nomuerto" } } },
  chaman:   { alianza: { pve: { M: "enano", H: "enano", C: "enano" }, pvp: { H: "enano", C: "enano" } },
              horda:   { pve: { M: "orco", H: "orco", C: "orco" },    pvp: { M: "trol", H: "orco", C: "orco" } } },
  mago:     { alianza: { pve: { M: "gnomo", H: "skyHO", C: "skyHO" }, pvp: { H: "humano", C: "gnomo" } },
              horda:   { pve: { M: "orco", H: "nomuerto", C: "orco" }, pvp: { M: "nomuerto", H: "nomuerto", C: "nomuerto" } } },
  brujo:    { alianza: { pve: { M: "gnomo", H: "humano", C: "humano" }, pvp: { M: "humano", H: "gnomo", C: "humano" } },
              horda:   { pve: { M: "orco", H: "nomuerto", C: "orco" },  pvp: { H: "nomuerto", C: "nomuerto" } } },
  druida:   { alianza: { pve: { M: "elfo", H: "elfo", C: "skyHO" },   pvp: { H: "elfo", C: "elfo" } },
              horda:   { pve: { M: "tauren", H: "tauren", C: "skyWS" }, pvp: { H: "tauren", C: "tauren" } } }
};

// La raza con más votos (si empatan, salen las dos)
function mejorRaza(claseId, faccion, modo) {
  const votos = (RAZA_META[claseId] && RAZA_META[claseId][faccion] && RAZA_META[claseId][faccion][modo]) || {};
  const cuenta = {};
  for (const r of Object.values(votos)) cuenta[r] = (cuenta[r] || 0) + 1;
  const max = Math.max(0, ...Object.values(cuenta));
  return { razas: Object.keys(cuenta).filter(r => cuenta[r] === max), votos, max, total: Object.keys(votos).length };
}

// Población de la beta (censo no oficial, Blizzard no da cifras)
const POBLACION = {
  fuente: ["WoW Forever Data (censo de la beta)", "https://wowforeverdata.com/factions"],
  total: { alianza: 48.6, horda: 51.4 },
  normal: { alianza: 46.3, horda: 53.7 },
  pvp: { alianza: 50.9, horda: 49.1 }
};

// ---------- MEJORES MASCOTAS A NIVEL 60 ----------
// M = MmonsteR (daño y aguante de cada familia), L = Leprestore (tier list de familias)
const MASCOTA_FUENTES = {
  M: ["MmonsteR", "https://mmonster.co/wow-forever/guides/hunter-pets/best-pets", "3 oct"],
  L: ["Leprestore", "https://leprestore.com/guides/world-of-warcraft-forever/forever-best-hunter-pet-tier-list/", "27 oct"]
};
// [familia, notas, para qué sirve (corto)]
const MASCOTA_META = {
  raid: [
    ["Felino", { M: "S", L: "S" }, "+10% de daño"],
    ["Raptor", { M: "S", L: "S" }, "+10% de daño y sangrado"],
    ["Lobo", { M: "B", L: "S" }, "Más ataque para tu grupo"],
    ["Zancaalta", { M: "B", L: "S" }, "Baja la armadura del jefe"],
    ["Carroñero", { M: "B", L: "S" }, "El jefe pega más flojo"],
    ["Serpiente alada", { M: "A", L: "A" }, "+7% de daño, ataque a distancia"],
    ["Murciélago", { M: "A", L: "A" }, "+7% de daño"],
    ["Araña", { M: "A", L: "A" }, "+7% de daño"],
    ["Ave rapaz", { M: "A", L: "B" }, "+7% de daño"],
    ["Crocolisco", { M: "B", L: "A" }, "Normal"],
    ["Hiena", { M: "B", L: "A" }, "Normal"],
    ["Gorila", { M: "B", L: "B" }, "Daño en área"],
    ["Zorro", { M: "B", L: "B" }, "Nueva, pico de daño cada 3 min"],
    ["Escórpido", { M: "C", L: "B" }, "Veneno en peleas largas"],
    ["Cangrejo", { M: "C", L: "A" }, "Aguanta, pega poco"],
    ["Oso", { M: "C", L: "A" }, "Aguanta, pega poco"],
    ["Jabalí", { M: "C", L: "B" }, "Aguanta, pega poco"],
    ["Tortuga", { M: "C", L: "C" }, "Aguanta, pega poco"]
  ],
  pvp: [
    ["Felino", { L: "S" }, "Embosca en sigilo"],
    ["Araña", { L: "A" }, "Inmoviliza 4 s"],
    ["Crocolisco", { L: "A" }, "−25% de curación al rival"],
    ["Murciélago", { L: "A" }, "Frena a los magos y curanderos"],
    ["Cangrejo", { L: "A" }, "Ralentiza un 50%"],
    ["Hiena", { L: "A" }, "Ralentiza y desangra"],
    ["Ave rapaz", { L: "B" }, "Desarma 3 s"],
    ["Raptor", { L: "S" }, "Mucho daño"]
  ],
  solo: [
    ["Oso", { M: "S" }, "Aguanta los golpes por ti"],
    ["Jabalí", { M: "S" }, "Aguanta y carga al enemigo"],
    ["Tortuga", { M: "S" }, "La que más aguanta"],
    ["Escórpido", { M: "A" }, "Aguanta bien"],
    ["Cangrejo", { M: "A" }, "Aguanta bien"],
    ["Lobo", { M: "B" }, "Equilibrado"],
    ["Felino", { M: "C" }, "Pega mucho, aguanta poco"],
    ["Raptor", { M: "C" }, "Pega mucho, aguanta poco"]
  ]
};

// ---------- PROFESIONES: CUÁL ME COJO ----------
// L = Leprestore (tier por PvE, PvP y oro), C = ConquestCapped (notas de oro, venta y subida)
const OFICIO_FUENTES = {
  L: ["Leprestore", "https://leprestore.com/guides/world-of-warcraft-forever/wow-forever-profession-tier-list-best-pve-pvp-goldmaking/", "24 oct"],
  C: ["ConquestCapped", "https://conquestcapped.com/guides/wow-forever/wow-forever-best-professions/", "1 nov"]
};
// [profesión, notas, por qué (corto)]
const OFICIO_META = {
  pve: [
    ["Alquimia", { L: "S" }, "Pociones y frascos para raid"],
    ["Ingeniería", { L: "S" }, "Bombas y aparatos útiles"],
    ["Minería", { L: "A" }, "Metal para tu equipo"],
    ["Encantamiento", { L: "A" }, "Mejora tu equipo"],
    ["Sastrería", { L: "A" }, "Equipo de tela y bolsas"],
    ["Herrería", { L: "A" }, "Equipo de placas"],
    ["Herboristería", { L: "B" }, "Hierbas para alquimia"],
    ["Peletería", { L: "B" }, "Equipo de cuero y malla"],
    ["Desuello", { L: "B" }, "Cuero para peletería"]
  ],
  pvp: [
    ["Ingeniería", { L: "S", C: "S" }, "Granadas y capa de escape"],
    ["Minería", { L: "S" }, "Va con ingeniería"],
    ["Alquimia", { L: "A" }, "Pociones para aguantar"],
    ["Encantamiento", { L: "A" }, "Mejora tu equipo"],
    ["Herboristería", { L: "A" }, "Hierbas para pociones"],
    ["Sastrería", { L: "B" }, "Equipo de tela"],
    ["Herrería", { L: "B" }, "Equipo de placas"],
    ["Peletería", { L: "B" }, "Equipo de cuero y malla"],
    ["Desuello", { L: "D" }, "No aporta en PvP"]
  ],
  oro: [
    ["Encantamiento", { L: "S", C: "S" }, "Encantar y vender polvo"],
    ["Alquimia", { L: "S", C: "S" }, "Pociones y frascos siempre se venden"],
    ["Herboristería", { L: "S", C: "S" }, "Las hierbas raras valen mucho"],
    ["Minería", { L: "S", C: "B" }, "Todos necesitan metal"],
    ["Sastrería", { L: "A", C: "A" }, "Bolsas desde el día 1"],
    ["Desuello", { L: "A", C: "S" }, "Oro rápido mientras subes"],
    ["Herrería", { L: "B", C: "B" }, "Solo con recetas raras"],
    ["Peletería", { L: "B", C: "B" }, "Normal"],
    ["Ingeniería", { L: "C", C: "C" }, "Lo que hace casi solo lo usan ingenieros"]
  ]
};
// Para subir de nivel (lo que dicen las guías, sin ranking)
const OFICIO_SUBIR = [
  ["Cocina", "+5% de experiencia con su comida", "C"],
  ["Peletería", "Su tienda de campaña da descanso (más experiencia)", "L"],
  ["Desuello", "El oro más rápido mientras subes: despellejas lo que ya matas", "C"],
  ["Primeros auxilios", "Ahora hace las pociones de vida", "L"]
];
// Lo que más se vende (según ConquestCapped)
const SE_VENDE = [
  ["Encantamiento", "Encantamientos y polvo"],
  ["Alquimia", "Elixir of the Mongoose, Flask of the Titans y pociones los días de raid"],
  ["Herboristería", "Hierbas raras: Frilled Lichen, Mountain Silversage"],
  ["Sastrería", "Bolsas"],
  ["Herboristería", "Black Lotus (ahora el vendedor le pone precio máximo)"],
  ["Desuello", "Light Leather y materiales básicos: siempre hay compradores"]
];
// Parejas recomendadas [prof 1, prof 2, para qué]
const OFICIO_COMBOS = [
  ["Ingeniería", "Minería", "PvP"],
  ["Ingeniería", "Alquimia", "PvE"],
  ["Sastrería", "Encantamiento", "Oro a nivel 60"],
  ["Herboristería", "Alquimia", "Consumibles y oro"],
  ["Desuello", "Herboristería", "Oro mientras subes"],
  ["Desuello", "Peletería", "Cazadores, pícaros, chamanes y druidas"],
  ["Minería", "Herrería", "Guerreros y paladines"]
];
