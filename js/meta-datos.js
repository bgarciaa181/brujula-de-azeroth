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
