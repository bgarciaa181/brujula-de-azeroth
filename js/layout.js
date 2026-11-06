// layout.js: lo que comparten todas las páginas
// Menú de arriba, pestañas dentro de cada página, buscador y pie de página.

// ---------- PÁGINAS DE LA WEB ----------
// [archivo, nombre, icono]
const PAGINAS = [
  ["index.html", "Inicio", "inv_misc_map_01"],
  ["aventura.html", "Aventura", "inv_misc_spyglass_02"],
  ["clases.html", "Clases", "classicon_warrior"],
  ["talentos.html", "Talentos", "ability_marksmanship"],
  ["mascotas.html", "Mascotas", "ability_hunter_beasttaming"],
  ["pve-pvp.html", "PvE y PvP", "achievement_pvp_p_250k"],
  ["oficios.html", "Profesiones", "trade_blacksmithing"],
  ["meta.html", "Meta", "achievement_bg_winwsg"],
  ["juegos.html", "Juegos", "inv_misc_dice_01"],
  ["comunidad.html", "Comunidad", "inv_misc_note_01"],
  ["parches.html", "Parches", "inv_misc_note_06"],
  ["addons.html", "Addons", "inv_gizmo_02"]
];

// Teclas de la barra, como en el juego: 1 2 3 ... 9 0 - =
const TECLAS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="];

// En qué página está cada sección (para el buscador y los enlaces)
const SECCION_PAGINA = {
  diario: "aventura.html", mapa: "aventura.html", checklist: "aventura.html",
  clases: "clases.html", test: "clases.html", personaje: "clases.html", comparador: "clases.html", razas: "clases.html", basico: "clases.html",
  mascotas: "mascotas.html", mejores: "mascotas.html", aspectos: "mascotas.html",
  modo: "pve-pvp.html", raids: "pve-pvp.html", calendario: "pve-pvp.html",
  profesiones: "oficios.html", cual: "oficios.html", "elige-oficio": "oficios.html", "plan-alts": "oficios.html", preguntas: "oficios.html", "tus-oficios": "oficios.html", campamento: "oficios.html",
  comunidad: "comunidad.html", aportar: "comunidad.html", noticias: "comunidad.html",
  elige: "meta.html", "meta-pvp": "meta.html", "meta-pve": "meta.html", "meta-clases": "meta.html",
  juego: "juegos.html", ruleta: "juegos.html", nombres: "juegos.html",
  "parches-clases": "parches.html", "parches-general": "parches.html",
  "addons-lista": "addons.html", "addons-serie": "addons.html", "addons-instalar": "addons.html"
};

function paginaActual() {
  const archivo = location.pathname.split("/").pop();
  if (archivo === "") return "index.html";
  if (archivo === "clase.html") return "clases.html";   // la página de una clase cuenta como "Clases"
  return archivo;
}

// ---------- MI PERSONAJE ----------
// Se guarda en el navegador y lo usan todas las páginas
// Puedes tener varios personajes. Se guardan en este navegador (no hace falta cuenta).
// Cada uno: { id, nombre, apellido, faccion, raza, clase, nivel, genero }
const MAX_PERSONAJES = 12;

function leerPersonajes() {
  try {
    let lista = JSON.parse(localStorage.getItem("mis-personajes"));
    if (Array.isArray(lista)) return lista;
    // Antes solo se guardaba uno: lo pasamos a la lista nueva
    const viejo = JSON.parse(localStorage.getItem("mi-personaje"));
    lista = viejo ? [{ ...viejo, id: nuevoId(), nombre: viejo.nombre === "Aventurero" ? "" : (viejo.nombre || "") }] : [];
    localStorage.setItem("mis-personajes", JSON.stringify(lista));
    if (lista[0]) localStorage.setItem("pj-activo", lista[0].id);
    localStorage.removeItem("mi-personaje");
    return lista;
  } catch (e) { return []; }
}

function guardarPersonajes(lista) {
  try { localStorage.setItem("mis-personajes", JSON.stringify(lista)); } catch (e) {}
}

function nuevoId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// El personaje que estás usando ahora
function leerPerfil() {
  const lista = leerPersonajes();
  let id = null;
  try { id = localStorage.getItem("pj-activo"); } catch (e) {}
  return lista.find(p => p.id === id) || lista[0] || null;
}

function elegirActivo(id) {
  try { localStorage.setItem("pj-activo", id); } catch (e) {}
}

// Guarda un personaje: si ya existe (mismo id) lo cambia, si no lo añade
function guardarPerfil(perfil) {
  const lista = leerPersonajes();
  if (!perfil.id) perfil.id = nuevoId();
  const i = lista.findIndex(x => x.id === perfil.id);
  if (i >= 0) lista[i] = perfil; else lista.push(perfil);
  guardarPersonajes(lista.slice(-MAX_PERSONAJES));
  elegirActivo(perfil.id);
  pintarBotonPj();
  if (typeof darLogro === "function") {
    darLogro("pj");
    if (lista.length >= 3) darLogro("pj3");
    if (perfil.nivel >= 60) darLogro("nivel60");
  }
  return perfil;
}

// Cambia solo una cosa del personaje activo (por ejemplo el nivel)
function cambiarPerfil(cambios) {
  const p = leerPerfil();
  if (p) guardarPerfil({ ...p, ...cambios });
}

function borrarPersonaje(id) {
  guardarPersonajes(leerPersonajes().filter(p => p.id !== id));
  pintarBotonPj();
}

function nombreCompleto(p) {
  return [p.nombre, p.apellido].filter(Boolean).join(" ") || "Sin nombre";
}

// Nombre válido: solo letras, de 2 a 12. Primera en mayúscula, como en el juego.
function limpiarNombre(texto) {
  const t = (texto || "").trim();
  return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
}
function nombreValido(texto) {
  return /^\p{L}{2,12}$/u.test((texto || "").trim());
}

// ---------- BLOQUEAR EL SCROLL DEL FONDO ----------
function bloquearFondo(si) {
  document.documentElement.classList.toggle("bloqueo", si);
}

// ---------- MENÚ DE ARRIBA ----------
function pintarCabecera() {
  const actual = paginaActual();
  const cabecera = document.getElementById("site-header");
  if (!cabecera) return;
  cabecera.className = "site-header";
  cabecera.innerHTML = `
    <div class="wrap site-header-in">
      <a class="logo" href="index.html" aria-label="Brújula de Azeroth, inicio">
        <img src="img/icono.svg" alt="" width="34" height="34">
        <span>Brújula<br>de Azeroth</span>
      </a>
      <div class="abar">
        <nav class="site-nav" aria-label="Páginas">
          ${PAGINAS.map(([archivo, nombre, icono], i) => `
            <a href="${archivo}" class="site-link${archivo === actual ? " active" : ""}"${archivo === actual ? ' aria-current="page"' : ""} title="${nombre} (tecla ${(i + 1) % 10})">
              <span class="slot">${iconoWow(icono, "sm")}<kbd>${TECLAS[i] || ""}</kbd></span><span class="slot-name">${nombre}</span>
            </a>`).join("")}
        </nav>
      </div>
      <button type="button" class="pj-btn" id="pj-open" aria-label="Mis personajes"></button>
      <button type="button" class="search-btn" id="search-open" aria-label="Buscar">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M15.5 15.5L21 21" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>
        <span>Buscar</span>
      </button>
    </div>`;
  // En el móvil, que se vea la página activa en el menú
  const activo = cabecera.querySelector(".site-link.active");
  if (activo) activo.scrollIntoView({ block: "nearest", inline: "center" });
}

// Atajos de teclado como en el juego: del 1 al 0 (y el - y el =) cambias de página
document.addEventListener("keydown", e => {
  if (e.ctrlKey || e.altKey || e.metaKey || e.repeat) return;
  const t = e.target;
  if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
  if (document.querySelector(".search-layer:not([hidden]), .pj-layer:not([hidden]), dialog[open]")) return;
  const i = TECLAS.indexOf(e.key);
  if (i < 0) return;
  if (PAGINAS[i]) {
    const slot = document.querySelectorAll(".site-link")[i];
    if (slot) slot.classList.add("pulsado");
    setTimeout(() => { location.href = PAGINAS[i][0]; }, 120);
  }
});

// ---------- PIE DE PÁGINA ----------
function pintarPie() {
  const pie = document.getElementById("site-footer");
  if (!pie) return;
  pie.innerHTML = `
    <div class="wrap">
      <nav class="foot-links" aria-label="Páginas">${PAGINAS.map(([a, n]) => `<a href="${a}">${n}</a>`).join("")}</nav>
      <p>Brújula de Azeroth es un fansite no oficial y sin ánimo de lucro. No está afiliado ni respaldado por Blizzard Entertainment. World of Warcraft y Warcraft son marcas de Blizzard Entertainment. Iconos © Blizzard Entertainment.</p>
      <p>Talentos del lanzamiento (ForeverChanges); otros datos de MetaBot.GG, foreverdb.net, wowforeverpets.com, mmonster.co y de la hoja de ruta oficial de Blizzard.</p>
      <button type="button" class="btn-instalar" hidden>📲 Instalar como app</button>
      <p class="credit">Creado por <strong>Bea García</strong> · <a href="https://github.com/bgarciaa181" target="_blank" rel="noopener">github.com/bgarciaa181</a></p>
    </div>`;
}

// ---------- PESTAÑAS DENTRO DE CADA PÁGINA ----------
// Cada <section data-tab="Nombre" data-icon="icono"> se convierte en una pestaña.
let secciones = [];

function prepararPestanas() {
  secciones = [...document.querySelectorAll("main section[data-tab]")];
  if (secciones.length < 2) return;

  const barra = document.createElement("div");
  barra.className = "page-tabs";
  barra.setAttribute("role", "tablist");
  barra.innerHTML = secciones.map(s => `
    <button type="button" class="page-tab" role="tab" data-sec="${s.id}" aria-controls="${s.id}">
      ${s.dataset.icon ? iconoWow(s.dataset.icon, "sm") : ""}<span>${s.dataset.tab}</span>
    </button>`).join("");
  secciones[0].parentNode.insertBefore(barra, secciones[0]);
  barra.querySelectorAll(".page-tab").forEach(b => b.addEventListener("click", () => {
    history.replaceState(null, "", "#" + b.dataset.sec);
    mostrarSeccion(b.dataset.sec);
  }));

  const inicial = secciones.find(s => s.id === location.hash.slice(1));
  mostrarSeccion(inicial ? inicial.id : secciones[0].id, false);
}

function mostrarSeccion(id, subir = true) {
  if (secciones.length < 2) return false;
  const existe = secciones.some(s => s.id === id);
  if (!existe) return false;
  secciones.forEach(s => { s.hidden = s.id !== id; });
  document.querySelectorAll(".page-tab").forEach(b => {
    const activa = b.dataset.sec === id;
    b.setAttribute("aria-selected", String(activa));
    if (activa) b.scrollIntoView({ block: "nearest", inline: "center" });
  });
  if (subir) {
    const barra = document.querySelector(".page-tabs");
    if (barra && barra.getBoundingClientRect().top < 0) barra.scrollIntoView({ behavior: "smooth" });
  }
  return true;
}

window.addEventListener("hashchange", () => mostrarSeccion(location.hash.slice(1)));

// Ir a una sección: si está en esta página cambia de pestaña, si no, abre la otra página
function irA(id) {
  const pagina = SECCION_PAGINA[id];
  if (pagina && pagina !== paginaActual()) {
    location.href = `${pagina}#${id}`;
    return;
  }
  if (!mostrarSeccion(id)) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  } else {
    history.replaceState(null, "", "#" + id);
  }
}

// ---------- BUSCADOR ----------
function sinTildes(texto) {
  return texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

// Todo lo que se puede buscar, con la página a la que lleva
const INDICE = [];
function prepararIndice() {
  INDICE.push({ texto: "Elige tu main (Horda o Alianza, Normal o PvP)", tipo: "Ayuda para decidir", icono: iconoWow("inv_misc_dice_01", "sm"), url: "meta.html#elige" });
  INDICE.push({ texto: "Meta y tier list", tipo: "Las specs más fuertes · PvE y PvP", icono: iconoWow("achievement_bg_winwsg", "sm"), url: "meta.html" });
  for (const c of CLASSES) {
    INDICE.push({ texto: c.nombre, tipo: "Clase", icono: iconoClase(c), url: `clase.html?c=${c.id}` });
    for (const a of c.arboles) {
      INDICE.push({ texto: `${a[0]} (${c.nombre})`, tipo: "Especialización", icono: iconoWow(a[2], "sm"), url: `clase.html?c=${c.id}` });
    }
  }
  for (const [id, r] of Object.entries(RACES)) {
    INDICE.push({ texto: r.nombre, tipo: r.faccion === "alianza" ? "Raza · Alianza" : "Raza · Horda", icono: iconoRaza(id, "male", "sm"), url: "clases.html#razas" });
    for (const h of RACIALES[id].habilidades) {
      INDICE.push({ texto: h[0], tipo: `Racial de ${r.nombre}`, icono: iconoRaza(id, "male", "sm"), url: "clases.html#razas" });
    }
  }
  for (const m of MASCOTAS) {
    INDICE.push({ texto: m[0], tipo: `Mascota · ${m[1]} nivel ${m[2]}`, icono: iconoFamilia(m[1]), url: "mascotas.html#mascotas" });
  }
  for (const f of FAMILIAS) {
    INDICE.push({ texto: f[0], tipo: `Familia de mascota · ${f[2]}`, icono: iconoFamilia(f[0]), url: "mascotas.html#mascotas" });
  }
  for (const p of [...PROFESIONES.principales, ...PROFESIONES.secundarias]) {
    INDICE.push({ texto: p[0], tipo: "Profesión", icono: iconoWow(p[4], "sm"), url: "oficios.html" });
  }
  for (const m of MAZMORRAS) {
    INDICE.push({ texto: m[0], tipo: `Mazmorra · nivel ${m[1]}–${m[2]}`, icono: iconoWow("achievement_dungeon_classicdungeonmaster", "sm"), url: "pve-pvp.html#modo", nivel: m[1], clave: "dg-nivel" });
  }
  for (const z of ZONAS) {
    INDICE.push({ texto: z[0], tipo: `Zona · nivel ${z[1]}–${z[2]}`, icono: iconoWow("inv_misc_map_01", "sm"), url: "aventura.html#diario", nivel: z[1], clave: "diario-nivel", faccion: z[3] });
  }
  for (const c of CAMPOS_BATALLA) {
    INDICE.push({ texto: c.nombre, tipo: "Campo de batalla · PvP", icono: iconoWow(c.icono, "sm"), url: "pve-pvp.html#modo", modo: "pvp" });
  }
  for (const r of RAIDS) {
    INDICE.push({ texto: r.nombre, tipo: `Raid de ${r.jugadores}`, icono: r.icono ? iconoWow(r.icono, "sm") : '<span class="wow-icon sm unknown">?</span>', url: "pve-pvp.html#raids" });
  }
  for (const [claseId, arboles] of Object.entries(TALENTOS)) {
    const c = CLASSES.find(x => x.id === claseId);
    for (const [arbol, lista] of Object.entries(arboles)) {
      for (const t of lista) {
        if (!t[3]) continue;
        const es = (TALENTOS_ES[claseId] || {})[t[0]];
        INDICE.push({ texto: es ? `${es[0]} (${t[0]})` : t[0], tipo: `Talento · ${c.nombre}, ${arbol}`, icono: iconoWow(t[3], "sm"), url: `talentos.html#${claseId}` });
      }
    }
  }
}

// Al elegir un resultado: guarda el nivel o la facción si hace falta y abre la página
function irAResultado(x) {
  try {
    if (x.clave) localStorage.setItem(x.clave, x.nivel);
    if (x.faccion && x.faccion !== "ambas") localStorage.setItem("diario-faccion", x.faccion);
    if (x.modo) localStorage.setItem("modo-juego", x.modo);
  } catch (e) {}
  const [pagina, hash] = x.url.split("#");
  if (pagina === location.pathname.split("/").pop() && hash) {
    location.hash = hash || "";
    location.reload();
  } else {
    location.href = x.url;
  }
}

function prepararBuscador() {
  const capa = document.createElement("div");
  capa.className = "search-layer";
  capa.id = "search-layer";
  capa.hidden = true;
  capa.innerHTML = `
    <div class="search-box" role="dialog" aria-label="Buscar en la web">
      <div class="search-input">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M15.5 15.5L21 21" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>
        <input type="search" id="search-input" placeholder="Clase, raza, mascota, zona, talento…" autocomplete="off">
        <button type="button" id="search-close" aria-label="Cerrar">Esc</button>
      </div>
      <div class="search-results" id="search-results"></div>
    </div>`;
  document.body.appendChild(capa);
  const caja = capa.querySelector("#search-input");

  function abrir() {
    if (INDICE.length === 0) prepararIndice();
    capa.hidden = false;
    bloquearFondo(true);
    caja.value = "";
    buscar();
    caja.focus();
  }
  function cerrar() {
    capa.hidden = true;
    bloquearFondo(false);
  }
  function buscar() {
    const q = sinTildes(caja.value.trim());
    const res = capa.querySelector("#search-results");
    if (q.length < 2) {
      res.innerHTML = `<p class="search-tip">Escribe al menos 2 letras. Prueba con <i>lobo</i>, <i>gnomo</i>, <i>herrería</i> o <i>frenesí</i>.</p>`;
      return;
    }
    const porNombre = INDICE.filter(x => sinTildes(x.texto).includes(q));
    const porTipo = INDICE.filter(x => !sinTildes(x.texto).includes(q) && sinTildes(x.tipo).includes(q));
    const encontrados = [...porNombre, ...porTipo].slice(0, 12);
    if (encontrados.length === 0) {
      res.innerHTML = `<p class="search-tip">No hay nada con "${caja.value}".</p>`;
      return;
    }
    res.innerHTML = "";
    for (const x of encontrados) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "search-item";
      b.innerHTML = `${x.icono}<span><b>${x.texto}</b><small>${x.tipo}</small></span>`;
      b.addEventListener("click", () => { cerrar(); irAResultado(x); });
      res.appendChild(b);
    }
  }

  document.getElementById("search-open").addEventListener("click", abrir);
  capa.querySelector("#search-close").addEventListener("click", cerrar);
  caja.addEventListener("input", buscar);
  caja.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      const primero = capa.querySelector(".search-item");
      if (primero) primero.click();
    }
  });
  capa.addEventListener("click", e => { if (e.target === capa) cerrar(); });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !capa.hidden) cerrar();
    if (e.key === "/" && capa.hidden && !["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement.tagName)) {
      e.preventDefault();
      abrir();
    }
  });
}


// ---------- LOGROS DE LA WEB ----------
// [id, icono, nombre, cómo se consigue]
const LOGROS = [
  ["pj", "achievement_character_human_male", "Nace un héroe", "Crea tu primer personaje"],
  ["pj3", "achievement_character_orc_male", "Alter adicto", "Ten 3 personajes"],
  ["test", "inv_misc_book_09", "Conócete a ti mismo", "Haz el test de clase"],
  ["ruleta", "inv_misc_coin_01", "Que decida el destino", "Gira la ruleta"],
  ["nombre", "inv_misc_note_01", "Bautizo", "Usa el generador de nombres"],
  ["racha10", "ability_marksmanship", "Ojo de halcón", "Acierta 10 seguidas en Adivina la clase"],
  ["pregunta", "inv_misc_spyglass_02", "Sabio de Azeroth", "Acierta la pregunta del día"],
  ["racha3", "inv_misc_pocketwatch_01", "Fiel a la cita", "Responde la pregunta del día 3 días seguidos"],
  ["dia1", "inv_misc_map_01", "Lista para el Día 1", "Completa el checklist del Día 1"],
  ["meta", "achievement_bg_winwsg", "Sigue el meta", "Mira la página Meta"],
  ["talentos", "ability_hunter_beasttaming", "Arquitecto de talentos", "Gasta los 51 puntos en la calculadora"],
  ["tarjeta", "inv_misc_gem_sapphire_01", "Fama en Azeroth", "Crea la imagen de tu personaje"],
  ["nivel60", "achievement_boss_onyxia", "¡Nivel 60!", "Pon a un personaje a nivel 60"],
  ["app", "inv_misc_head_dragon_01", "Siempre a mano", "Instala la web como app"]
];

function leerLogros() {
  try { return JSON.parse(localStorage.getItem("logros")) || {}; } catch (e) { return {}; }
}

// Da un logro (solo la primera vez) y enseña el aviso dorado
function darLogro(id) {
  const hechos = leerLogros();
  if (hechos[id]) return;
  const l = LOGROS.find(x => x[0] === id);
  if (!l) return;
  hechos[id] = Date.now();
  try { localStorage.setItem("logros", JSON.stringify(hechos)); } catch (e) {}
  let caja = document.getElementById("achievement");
  if (!caja) {
    caja = document.createElement("div");
    caja.className = "achievement";
    caja.id = "achievement";
    document.body.appendChild(caja);
  }
  // Si ya hay otro aviso en pantalla, esperamos un poco
  setTimeout(() => {
    caja.innerHTML = `${iconoWow(l[1], "lg")}<div><small>¡Logro conseguido!</small><b>${l[2]}</b></div>`;
    caja.hidden = false;
    clearTimeout(darLogro.t);
    darLogro.t = setTimeout(() => { caja.hidden = true; }, 3500);
  }, caja.hidden === false ? 1800 : 0);
}

// ---------- IMAGEN DEL PERSONAJE PARA COMPARTIR ----------
function cargarImagen(src) {
  return new Promise(res => {
    const i = new Image();
    i.crossOrigin = "anonymous";
    i.onload = () => res(i);
    i.onerror = () => res(null);
    i.src = src;
  });
}

async function crearTarjeta(p) {
  const c = CLASSES.find(x => x.id === p.clase);
  const r = RACES[p.raza];
  const W = 1080, H = 1080;
  const lienzo = document.createElement("canvas");
  lienzo.width = W; lienzo.height = H;
  const g = lienzo.getContext("2d");
  await (document.fonts ? document.fonts.ready : Promise.resolve());

  // Fondo: noche con el color de la clase
  g.fillStyle = "#0b0e1a"; g.fillRect(0, 0, W, H);
  let grad = g.createRadialGradient(W / 2, 380, 50, W / 2, 380, 700);
  grad.addColorStop(0, c.color + "66"); grad.addColorStop(1, "#0b0e1a00");
  g.fillStyle = grad; g.fillRect(0, 0, W, H);
  // Estrellas
  g.fillStyle = "#ffffff";
  for (let k = 0; k < 90; k++) { g.globalAlpha = Math.random() * .6; g.fillRect((k * 397) % W, (k * 211) % 620, 2, 2); }
  g.globalAlpha = 1;
  // Marco dorado
  g.strokeStyle = "#8c6a2c"; g.lineWidth = 6; g.strokeRect(30, 30, W - 60, H - 60);
  g.strokeStyle = "#d6b06a"; g.lineWidth = 2; g.strokeRect(44, 44, W - 88, H - 88);

  // Iconos de raza y clase
  const racial = ICONO_RAZA[p.raza];
  const [imgRaza, imgClase, imgFac] = await Promise.all([
    racial ? cargarImagen(`${ICONOS_URL}achievement_character_${racial}_${p.genero || "male"}.jpg`) : null,
    cargarImagen(`${ICONOS_URL}${c.icono}.jpg`),
    cargarImagen(`${ICONOS_URL}${p.faccion === "alianza" ? "achievement_pvp_a_a" : "achievement_pvp_h_h"}.jpg`)
  ]);
  const icono = (img, x, y, t, borde) => {
    g.fillStyle = "#000"; g.fillRect(x - 6, y - 6, t + 12, t + 12);
    g.fillStyle = borde; g.fillRect(x - 4, y - 4, t + 8, t + 8);
    if (img) g.drawImage(img, x, y, t, t);
    else { g.fillStyle = "#1c2440"; g.fillRect(x, y, t, t); }
  };
  icono(imgRaza, W / 2 - 190, 150, 240, "#d6b06a");
  icono(imgClase, W / 2 + 20, 290, 150, c.color);
  if (imgFac) icono(imgFac, 90, 90, 80, "#8c6a2c");

  g.textAlign = "center";
  g.fillStyle = "#f5dc9f";
  g.font = '700 84px "Alegreya SC", Georgia, serif';
  g.fillText(nombreCompleto(p), W / 2, 560, W - 140);
  g.font = '500 44px "Alegreya Sans", sans-serif';
  g.fillStyle = "#ece4d2";
  const linea = `${r.nombre} `;
  const ancho1 = g.measureText(linea).width, ancho2 = g.measureText(c.nombre).width;
  const x0 = W / 2 - (ancho1 + ancho2) / 2;
  g.textAlign = "left";
  g.fillText(linea, x0, 625);
  g.fillStyle = c.color; g.fillText(c.nombre, x0 + ancho1, 625);
  g.textAlign = "center";

  // Nivel
  g.fillStyle = "#a7a08f"; g.font = '500 30px "Alegreya Sans", sans-serif';
  g.fillText(`NIVEL ${p.nivel || 1} · ${p.faccion === "alianza" ? "ALIANZA" : "HORDA"}`, W / 2, 690);
  g.fillStyle = "#121729"; g.fillRect(190, 712, 700, 16);
  g.fillStyle = c.color; g.fillRect(190, 712, 700 * Math.min(1, (p.nivel || 1) / 60), 16);

  // Meta de su clase
  if (typeof mejorSpec === "function") {
    const pve = mejorSpec(p.clase, "pve"), pvp = mejorSpec(p.clase, "pvp");
    g.font = '700 34px "Alegreya Sans", sans-serif';
    [[pve, "PvE"], [pvp, "PvP"]].forEach(([m, t], i) => {
      if (!m) return;
      const y = 800 + i * 62;
      g.fillStyle = "#1c2440"; g.fillRect(170, y - 42, 740, 54);
      g.fillStyle = "#ff9a66"; g.textAlign = "left"; g.fillText(t, 195, y);
      g.fillStyle = "#ece4d2"; g.fillText(`Meta: ${m.nombre}`.slice(0, 34), 290, y);
      g.fillStyle = "#ff7a3d"; g.fillRect(842, y - 36, 44, 42);
      g.fillStyle = "#141826"; g.textAlign = "center"; g.fillText(m.letra, 864, y - 3);
    });
  }

  // Firma de la web
  g.textAlign = "center";
  g.fillStyle = "#d6b06a"; g.font = '700 38px "Alegreya SC", Georgia, serif';
  g.fillText("Brújula de Azeroth", W / 2, 985);
  g.fillStyle = "#a7a08f"; g.font = '400 24px "Alegreya Sans", sans-serif';
  g.fillText("Guía de WoW Forever en español · bgarciaa181.github.io/brujula-de-azeroth", W / 2, 1022);

  return new Promise(res => lienzo.toBlob(res, "image/png"));
}

async function compartirTarjeta(p, boton) {
  if (boton) boton.textContent = "Creando…";
  const blob = await crearTarjeta(p);
  const archivo = new File([blob], `${(p.nombre || "personaje").toLowerCase()}-brujula.png`, { type: "image/png" });
  darLogro("tarjeta");
  // En el móvil se abre el menú de compartir; en el ordenador se descarga
  if (navigator.canShare && navigator.canShare({ files: [archivo] })) {
    try { await navigator.share({ files: [archivo], title: nombreCompleto(p) }); } catch (e) {}
  } else {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = archivo.name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  }
  if (boton) boton.textContent = "Imagen";
}

// ---------- MIS PERSONAJES (botón del menú y panel) ----------
function pintarBotonPj() {
  const b = document.getElementById("pj-open");
  if (!b) return;
  const p = leerPerfil();
  const c = p && CLASSES.find(x => x.id === p.clase);
  b.innerHTML = p && c && RACES[p.raza]
    ? `${iconoRaza(p.raza, p.genero || "male", "sm")}<span><b>${p.nombre || "Sin nombre"}</b><small style="color:${c.color}">${c.nombre} · ${p.nivel || 1}</small></span>`
    : `<span class="pj-plus">+</span><span><b>Mi personaje</b><small>Créalo</small></span>`;
}

// Qué dice el meta de este personaje (spec más fuerte y si su raza es la más votada)
function lineaMeta(p) {
  if (typeof mejorSpec !== "function") return "";
  const partes = [["pve", "PvE"], ["pvp", "PvP"]].map(([m, t]) => {
    const spec = mejorSpec(p.clase, m);
    const raza = mejorRaza(p.clase, p.faccion, m);
    if (!spec) return "";
    const ok = raza.razas.includes(p.raza);
    return `<span class="pj-meta"><i>${t}</i> ${spec.nombre} <em class="t-${spec.letra}">${spec.letra}</em>
      <span class="${ok ? "si" : "no"}" title="${ok ? "Tu raza es de las más votadas" : "Raza más votada: " + raza.razas.map(r => RACES[r].nombre).join(" o ")}">${ok ? "✓ raza meta" : "raza meta: " + raza.razas.map(r => RACES[r].nombre).join("/")}</span></span>`;
  }).join("");
  return `<a class="pj-metas" href="meta.html#elige">${partes}</a>`;
}

function avisoRapido(texto) {
  let t = document.getElementById("aviso-rapido");
  if (!t) {
    t = document.createElement("div");
    t.id = "aviso-rapido";
    t.className = "aviso-rapido";
    t.setAttribute("role", "status");
    document.body.appendChild(t);
  }
  t.textContent = texto;
  t.hidden = false;
  clearTimeout(avisoRapido.t);
  avisoRapido.t = setTimeout(() => { t.hidden = true; }, 3000);
}

function pintarLogros() {
  const hechos = leerLogros();
  const n = LOGROS.filter(l => hechos[l[0]]).length;
  return `<div class="pj-logros">
    <b>Logros <span>${n} / ${LOGROS.length}</span></b>
    <div class="pj-logros-grid">${LOGROS.map(([id, ic, nom, como]) =>
      `<span class="pj-logro${hechos[id] ? " hecho" : ""}" title="${nom}: ${como}">${iconoWow(ic, "lg")}<small>${hechos[id] ? nom : como}</small></span>`).join("")}</div>
  </div>`;
}

// Un personaje metido en un texto corto (para enlaces)
function codigoPersonaje(p) {
  const { nombre, apellido, faccion, raza, clase, nivel, genero } = p;
  return btoa(unescape(encodeURIComponent(JSON.stringify({ nombre, apellido, faccion, raza, clase, nivel, genero })))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function leerCodigo(codigo) {
  return JSON.parse(decodeURIComponent(escape(atob(codigo.replace(/-/g, "+").replace(/_/g, "/")))));
}

// Enlace para llevarte los personajes a otro móvil u ordenador
function enlacePersonajes() {
  const datos = leerPersonajes().map(({ nombre, apellido, faccion, raza, clase, nivel, genero, profs }) => ({ nombre, apellido, faccion, raza, clase, nivel, genero, profs }));
  const codigo = btoa(unescape(encodeURIComponent(JSON.stringify(datos)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return location.href.split(/[?#]/)[0].replace(/[^/]*$/, "") + "index.html?pjs=" + codigo;
}

function importarPersonajes() {
  const codigo = new URLSearchParams(location.search).get("pjs");
  if (!codigo) return;
  try {
    const texto = decodeURIComponent(escape(atob(codigo.replace(/-/g, "+").replace(/_/g, "/"))));
    const nuevos = JSON.parse(texto).filter(p => p && RACES[p.raza] && CLASSES.some(c => c.id === p.clase));
    const lista = leerPersonajes();
    let n = 0;
    for (const p of nuevos) {
      const igual = lista.find(x => nombreCompleto(x) === nombreCompleto(p) && x.clase === p.clase);
      if (igual) Object.assign(igual, p); else { lista.push({ ...p, id: nuevoId() }); n++; }
    }
    guardarPersonajes(lista.slice(-MAX_PERSONAJES));
    if (!leerPerfil() && lista[0]) elegirActivo(lista[0].id);
    avisoRapido(n ? `${n} personaje${n > 1 ? "s" : ""} añadido${n > 1 ? "s" : ""}` : "Personajes actualizados");
  } catch (e) {
    avisoRapido("Ese enlace no es válido");
  }
  history.replaceState(null, "", location.pathname + location.hash);
}

function prepararPersonajes() {
  const capa = document.createElement("div");
  capa.className = "pj-layer";
  capa.id = "pj-layer";
  capa.hidden = true;
  document.body.appendChild(capa);
  let editando = null;
  let borrando = null;

  function pintar() {
    const lista = leerPersonajes();
    const activo = leerPerfil();
    capa.innerHTML = `
      <div class="pj-box" role="dialog" aria-label="Mis personajes">
        <div class="pj-top">
          <h2>Mis personajes</h2>
          <button type="button" class="pj-close" data-a="cerrar" aria-label="Cerrar">✕</button>
        </div>
        <div class="pj-list">
          ${lista.length ? lista.map(p => {
            const c = CLASSES.find(x => x.id === p.clase);
            if (!c || !RACES[p.raza]) return "";
            const es = activo && activo.id === p.id;
            return `<div class="pj-item${es ? " activo" : ""}" style="--cls:${c.color}">
              <div class="pj-icons">${iconoRaza(p.raza, p.genero || "male", "lg")}${iconoClase(c)}</div>
              ${editando === p.id ? `
                <form class="pj-edit" data-id="${p.id}">
                  <input name="n" maxlength="12" placeholder="Nombre" value="${p.nombre || ""}" aria-label="Nombre" required>
                  <input name="a" maxlength="12" placeholder="Apellido" value="${p.apellido || ""}" aria-label="Apellido" required>
                  <button type="submit" class="pj-mini oro">Guardar</button>
                  <small class="pj-err"></small>
                </form>` : `
                <div class="pj-txt">
                  <b>${nombreCompleto(p)}${es ? '<span class="pj-tag">jugando</span>' : ""}</b>
                  <small>${RACES[p.raza].nombre} <span style="color:${c.color}">${c.nombre}</span> · nivel ${p.nivel || 1}</small>
                  ${!p.nombre || !p.apellido ? '<small class="pj-warn">Le falta nombre y apellido</small>' : ""}
                  ${(p.profs || []).length ? `<small class="pj-profs">${p.profs.map(x => `${x.n} ${x.s}`).join(" · ")}</small>` : ""}
                  ${lineaMeta(p)}
                </div>`}
              <div class="pj-acts">
                ${es ? "" : `<button type="button" class="pj-mini oro" data-a="usar" data-id="${p.id}">Jugar</button>`}
                ${editando === p.id ? "" : `<button type="button" class="pj-mini" data-a="editar" data-id="${p.id}">Nombre</button>`}
                <button type="button" class="pj-mini" data-a="imagen" data-id="${p.id}">Imagen</button>
                <a class="pj-mini" href="oficios.html#tus-oficios">Profesiones</a>
                <a class="pj-mini" href="directo.html?d=${codigoPersonaje(p)}" title="Para poner en OBS">Directo</a>
                <button type="button" class="pj-mini rojo" data-a="borrar" data-id="${p.id}">${borrando === p.id ? "¿Seguro?" : "Borrar"}</button>
              </div>
            </div>`;
          }).join("") : '<p class="pj-empty">Aún no tienes personajes. Crea uno y la web se adapta a él: tus talentos, tus zonas, tu meta.</p>'}
        </div>
        <a class="cta pj-new" href="clases.html#personaje">+ Crear personaje</a>
        ${pintarLogros()}
        ${lista.length ? `
        <div class="pj-sync">
          <b>¿Los quieres en el móvil o en otro ordenador?</b>
          <small>Copia este enlace y ábrelo allí. Se guardan en el navegador, sin cuenta ni contraseña.</small>
          <button type="button" class="pj-mini oro" data-a="enlace">Copiar enlace</button>
        </div>` : ""}
      </div>`;
  }

  function abrir() { editando = null; borrando = null; pintar(); capa.hidden = false; bloquearFondo(true); }
  function cerrar() { capa.hidden = true; bloquearFondo(false); }
  window.abrirPersonajes = abrir;

  document.getElementById("pj-open").addEventListener("click", abrir);
  capa.addEventListener("click", async e => {
    if (e.target === capa) return cerrar();
    const b = e.target.closest("[data-a]");
    if (!b) return;
    const id = b.dataset.id;
    if (b.dataset.a === "cerrar") return cerrar();
    if (b.dataset.a === "usar") { elegirActivo(id); pintarBotonPj(); avisoRapido("Personaje cambiado"); setTimeout(() => location.reload(), 400); return; }
    if (b.dataset.a === "editar") { editando = id; borrando = null; pintar(); capa.querySelector(".pj-edit input").focus(); return; }
    if (b.dataset.a === "borrar") {
      if (borrando !== id) { borrando = id; pintar(); return; }
      borrarPersonaje(id); borrando = null; pintar(); return;
    }
    if (b.dataset.a === "imagen") { const p = leerPersonajes().find(x => x.id === id); if (p) compartirTarjeta(p, b); return; }
    if (b.dataset.a === "enlace") {
      try { await navigator.clipboard.writeText(enlacePersonajes()); b.textContent = "¡Copiado!"; }
      catch (err) { prompt("Copia este enlace:", enlacePersonajes()); }
    }
  });
  capa.addEventListener("submit", e => {
    e.preventDefault();
    const f = e.target;
    const n = f.n.value, a = f.a.value;
    if (!nombreValido(n) || !nombreValido(a)) {
      f.querySelector(".pj-err").textContent = "Nombre y apellido: solo letras, de 2 a 12.";
      return;
    }
    const p = leerPersonajes().find(x => x.id === f.dataset.id);
    if (p) {
      const activo = leerPerfil();
      guardarPerfil({ ...p, nombre: limpiarNombre(n), apellido: limpiarNombre(a) });
      if (activo) elegirActivo(activo.id);
      pintarBotonPj();
    }
    editando = null; pintar();
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !capa.hidden) cerrar(); });
}

// ---------- INSTALAR COMO APP ----------
let avisoInstalar = null;
function prepararApp() {
  if ("serviceWorker" in navigator && location.protocol === "https:") {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
  window.addEventListener("beforeinstallprompt", e => {
    e.preventDefault();
    avisoInstalar = e;
    document.querySelectorAll(".btn-instalar").forEach(b => b.hidden = false);
  });
  window.addEventListener("appinstalled", () => { darLogro("app"); avisoInstalar = null; });
  if (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) darLogro("app");
  document.addEventListener("click", async e => {
    const b = e.target.closest(".btn-instalar");
    if (!b || !avisoInstalar) return;
    avisoInstalar.prompt();
    await avisoInstalar.userChoice;
    avisoInstalar = null;
    b.hidden = true;
  });
}

// La altura del menú se guarda en una variable CSS, para que las barras fijas se coloquen debajo
function medirCabecera() {
  const h = document.getElementById("site-header");
  if (h) document.documentElement.style.setProperty("--hdr", h.offsetHeight + "px");
}

// ---------- ARRANQUE ----------
pintarCabecera();
medirCabecera();
window.addEventListener("resize", medirCabecera);
pintarPie();
prepararPestanas();
prepararBuscador();
importarPersonajes();
prepararApp();
pintarBotonPj();
prepararPersonajes();
