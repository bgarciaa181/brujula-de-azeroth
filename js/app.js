// ---------- ESTADO DE LOS FILTROS ----------
let rolElegido = "todos";
let faccionElegida = "todas";

function crearChips(contenedor, opciones, getActual, alPulsar) {
  const caja = document.getElementById(contenedor);
  caja.innerHTML = "";
  for (const [valor, texto] of opciones) {
    const b = document.createElement("button");
    b.className = "chip";
    b.type = "button";
    let icono = "";
    if (ROLES[valor]) icono = iconoRol(valor);
    if (valor === "alianza" || valor === "horda") icono = iconoFaccion(valor, "chip-icon");
    b.innerHTML = icono + `<span>${texto}</span>`;
    b.setAttribute("aria-pressed", String(getActual() === valor));
    b.addEventListener("click", () => { alPulsar(valor); pintar(); });
    caja.appendChild(b);
  }
}

function razasDeFaccion(clase) {
  if (faccionElegida === "todas") return clase.razas;
  return clase.razas.filter(r => RACES[r].faccion === faccionElegida);
}

function pintar() {
  crearChips("role-filter",
    [["todos", "Todos"], ...Object.entries(ROLES)],
    () => rolElegido, v => rolElegido = v);
  crearChips("faction-filter",
    [["todas", "Las dos facciones"], ["alianza", "Alianza"], ["horda", "Horda"]],
    () => faccionElegida, v => faccionElegida = v);

  const lista = CLASSES.filter(c =>
    (rolElegido === "todos" || c.roles.includes(rolElegido)) &&
    razasDeFaccion(c).length > 0
  );

  const grid = document.getElementById("grid");
  grid.innerHTML = "";
  lista.forEach((c, i) => {
    const card = document.createElement("button");
    card.className = "card";
    card.type = "button";
    card.style.setProperty("--cls", c.color);
    card.innerHTML = `
      ${iconoClase(c)}
      <h3>${c.nombre}</h3>
      <div class="roles">${c.roles.map(iconoRol).join("")}</div>
      <div class="specs">${c.arboles.map(a => `<span class="spec" title="${a[0]}">${iconoWow(a[2])}<small>${a[0]}</small></span>`).join("")}</div>
      ${c.facil ? '<span class="easy">Fácil</span>' : ""}`;
    card.style.setProperty("--i", i);
    card.addEventListener("click", () => { location.hash = c.id; });
    grid.appendChild(card);
  });
  document.getElementById("result-count").textContent =
    lista.length === 0 ? "Ninguna clase cumple esos filtros."
    : "Toca una clase para ver su ficha.";
}

// ---------- BLOQUEAR EL SCROLL DEL FONDO ----------
// Mientras hay una ventana abierta, la página de detrás no se mueve
function bloquearFondo(si) {
  document.documentElement.classList.toggle("bloqueo", si);
}

// ---------- FICHA DE CLASE ----------
const dialogo = document.getElementById("detail");

function abrirFicha(id) {
  const c = CLASSES.find(x => x.id === id);
  if (!c) { if (dialogo.open) dialogo.close(); return; }
  const ali = c.razas.filter(r => RACES[r].faccion === "alianza").map(r => RACES[r].nombre);
  const hor = c.razas.filter(r => RACES[r].faccion === "horda").map(r => RACES[r].nombre);
  dialogo.style.setProperty("--cls", c.color);
  dialogo.innerHTML = `
    <div class="d-head">
      ${iconoClase(c)}
      <div>
        <h2 id="d-name">${c.nombre}</h2>
        <div class="roles">${c.roles.map(iconoRol).join("")}<span class="res">${c.recurso}</span></div>
      </div>
      <button class="close" type="button" aria-label="Cerrar">×</button>
    </div>
    <div class="d-body">
      <p class="pitch">${c.pitch}</p>
      <div class="stats">
        <div><b>${c.habilidades}</b><span>habilidades</span></div>
        <div><b>${c.nuevas}</b><span>nuevas en Forever</span></div>
        <div><b>${c.razas.length}</b><span>razas</span></div>
      </div>
      <div>
        <h3>Especializaciones</h3>
        <div class="tree-list">${c.arboles.map(a => `<div class="tree">${iconoWow(a[2])}<b>${a[0]}</b><span>${a[1]}</span></div>`).join("")}</div>
      </div>
      <div>
        <h3>Razas</h3>
        <div class="races">
          <div><strong>${iconoFaccion("alianza", "sm")} Alianza</strong>${ali.join(", ") || "Ninguna"}</div>
          <div><strong>${iconoFaccion("horda", "sm")} Horda</strong>${hor.join(", ") || "Ninguna"}</div>
        </div>
      </div>
      <div>
        <a class="cta" href="talentos.html#${c.id}">Ver talentos de ${c.nombre} →</a>
      </div>
    </div>`;
  dialogo.querySelector(".close").addEventListener("click", cerrarFicha);
  if (!dialogo.open) dialogo.showModal();
  bloquearFondo(true);
}

function cerrarFicha() {
  history.replaceState(null, "", location.pathname + location.search);
  if (dialogo.open) dialogo.close();
}
dialogo.addEventListener("cancel", e => { e.preventDefault(); cerrarFicha(); });
dialogo.addEventListener("close", () => bloquearFondo(false));
dialogo.addEventListener("click", e => { if (e.target === dialogo) cerrarFicha(); });
window.addEventListener("hashchange", () => abrirFicha(location.hash.slice(1)));

// ---------- TEST ----------
let pasoTest = 0;
let puntosTest = {};

function iconoOpcion(op) {
  return op.rol ? iconoRol(op.rol) : iconoWow(op.icono, "lg");
}

function pintarTest() {
  const caja = document.getElementById("quiz");

  // Resultado final
  if (pasoTest >= TEST.length) {
    const orden = CLASSES.slice().sort((a, b) => (puntosTest[b.id] || 0) - (puntosTest[a.id] || 0));
    const c = orden[0];
    const otras = orden.slice(1, 3);
    caja.innerHTML = `
      <div class="quiz-result" style="--cls:${c.color}">
        <span class="quiz-label">Tu clase es</span>
        ${iconoClase(c)}
        <h3>${c.nombre}</h3>
        <p class="pitch">${c.pitch}</p>
        <div class="roles">${c.roles.map(iconoRol).join("")}</div>
        <div class="quiz-actions">
          <a class="cta" href="#${c.id}">Ver ficha</a>
          <a class="cta ghost" href="talentos.html#${c.id}">Sus talentos</a>
          <button type="button" class="cta ghost" id="quiz-again">Repetir</button>
        </div>
        <p class="quiz-also">También te pegan: ${otras.map(o => `<a href="#${o.id}" style="color:${o.color}">${o.nombre}</a>`).join(" y ")}</p>
      </div>`;
    document.getElementById("quiz-again").addEventListener("click", () => {
      pasoTest = 0;
      puntosTest = {};
      pintarTest();
    });
    return;
  }

  // Pregunta actual
  const q = TEST[pasoTest];
  caja.innerHTML = `
    <div class="quiz-progress">${TEST.map((_, i) => `<span class="${i < pasoTest ? "done" : i === pasoTest ? "now" : ""}"></span>`).join("")}</div>
    <h3 class="quiz-q">${q.pregunta}</h3>
    <div class="quiz-options"></div>`;
  const opciones = caja.querySelector(".quiz-options");
  for (const op of q.opciones) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "quiz-opt";
    b.innerHTML = `${iconoOpcion(op)}<span>${op.texto}</span>`;
    b.addEventListener("click", () => {
      for (const [id, n] of Object.entries(op.puntos)) {
        puntosTest[id] = (puntosTest[id] || 0) + n;
      }
      pasoTest++;
      pintarTest();
    });
    opciones.appendChild(b);
  }
}

// ---------- PvE / PvP ----------
let modoJuego = "pve";

function cambiarModo(modo) {
  modoJuego = modo;
  document.getElementById("mode-pve").setAttribute("aria-selected", String(modo === "pve"));
  document.getElementById("mode-pvp").setAttribute("aria-selected", String(modo === "pvp"));
  document.getElementById("panel-pve").hidden = modo !== "pve";
  document.getElementById("panel-pvp").hidden = modo !== "pvp";
  // Las mascotas de más abajo también se filtran igual
  modoMascotas = modo;
  pintarMascotas();
}

function pintarMazmorras() {
  const nivel = parseInt(document.getElementById("dg-lvl").value, 10);
  document.getElementById("dg-lvl-out").textContent = nivel;

  // Mazmorras para tu nivel ahora
  const ahora = MAZMORRAS.filter(m => m[1] <= nivel && nivel <= m[2]);
  document.getElementById("dg-now").innerHTML = ahora.length
    ? ahora.map(m => `
      <div class="dg-card${m[4] ? " new" : ""}">
        <span class="dg-lv">${m[1]}–${m[2]}</span>
        <b>${m[0]}</b>
        <small>${m[3]}</small>
        ${m[4] ? '<span class="new-badge">Nueva</span>' : ""}
      </div>`).join("")
    : '<p class="empty">No hay mazmorras para tu nivel. ¡Sigue subiendo!</p>';

  // Gráfico con todas: cada barra va del nivel mínimo al máximo
  document.getElementById("dg-chart").innerHTML = `
    <div class="dg-axis">${[10, 20, 30, 40, 50, 60].map(n => `<span style="left:${(n - 10) * 2}%">${n}</span>`).join("")}</div>
    <div class="dg-me" style="left:${(nivel - 10) * 2}%"></div>
    ${MAZMORRAS.map(m => {
      const activa = m[1] <= nivel && nivel <= m[2];
      return `<div class="dg-row${activa ? " on" : ""}">
        <span class="dg-name">${m[0]}${m[4] ? " ★" : ""}</span>
        <span class="dg-track"><span class="dg-bar" style="left:${(m[1] - 10) * 2}%;width:${(m[2] - m[1]) * 2}%"></span></span>
      </div>`;
    }).join("")}`;
}

function pintarPvP() {
  document.getElementById("bg-list").innerHTML = CAMPOS_BATALLA.map(c => `
    <div class="bg-card${c.nueva ? " new" : ""}">
      ${iconoWow(c.icono, "xl")}
      <b>${c.nombre}</b>
      ${c.tipo ? `<small>${c.tipo}</small>` : ""}
      ${c.nueva ? '<span class="new-badge">Nuevo en Forever</span>' : ""}
    </div>`).join("");

  // Las mascotas PvP más rápidas
  const pets = MASCOTAS.filter(m => familia(m[1])[5]).sort((a, b) => (a[4] || 99) - (b[4] || 99)).slice(0, 4);
  document.getElementById("pvp-pets").innerHTML = pets.map(m => `
    <div class="mini-pet">${iconoFamilia(m[1])}<span><b>${m[0]}</b><small>${m[1]} · nv ${m[2]}${m[4] ? ` · ${m[4].toFixed(1)} s` : ""}</small></span></div>`).join("");
}

document.getElementById("mode-pve").addEventListener("click", () => cambiarModo("pve"));
document.getElementById("mode-pvp").addEventListener("click", () => cambiarModo("pvp"));
document.getElementById("dg-lvl").addEventListener("input", pintarMazmorras);

// ---------- CREA TU PERSONAJE ----------
const pj = { faccion: null, raza: null, clase: null, genero: "male" };

function pintarPersonaje() {
  // 1. Facción
  const fac = document.getElementById("b-factions");
  fac.innerHTML = "";
  for (const [id, nombre] of [["alianza", "Alianza"], ["horda", "Horda"]]) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "b-faction " + id;
    b.setAttribute("aria-pressed", String(pj.faccion === id));
    b.innerHTML = `${iconoFaccion(id, "lg")}<span>${nombre}</span>`;
    b.addEventListener("click", () => {
      pj.faccion = id;
      if (pj.raza && RACES[pj.raza].faccion !== id) { pj.raza = null; pj.clase = null; }
      pintarPersonaje();
    });
    fac.appendChild(b);
  }

  // 2. Raza (solo las de la facción elegida)
  const razas = document.getElementById("b-races");
  razas.innerHTML = "";
  for (const [id, r] of Object.entries(RACES)) {
    if (pj.faccion && r.faccion !== pj.faccion) continue;
    const b = document.createElement("button");
    b.type = "button";
    b.className = "b-pick";
    b.setAttribute("aria-pressed", String(pj.raza === id));
    b.innerHTML = `${iconoRaza(id, pj.genero, "lg")}<span>${r.nombre}</span>`;
    b.addEventListener("click", () => {
      pj.raza = id;
      pj.faccion = r.faccion;
      const c = CLASSES.find(x => x.id === pj.clase);
      if (c && !c.razas.includes(id)) pj.clase = null;
      pintarPersonaje();
    });
    razas.appendChild(b);
  }

  // 3. Clase (las que no puede esa raza salen apagadas)
  const clases = document.getElementById("b-classes");
  clases.innerHTML = "";
  for (const c of CLASSES) {
    const posible = !pj.raza || c.razas.includes(pj.raza);
    const b = document.createElement("button");
    b.type = "button";
    b.className = "b-pick";
    b.style.setProperty("--cls", c.color);
    b.disabled = !posible;
    b.setAttribute("aria-pressed", String(pj.clase === c.id));
    b.innerHTML = `${iconoClase(c)}<span>${c.nombre}</span>`;
    b.addEventListener("click", () => {
      pj.clase = c.id;
      if (pj.raza && !c.razas.includes(pj.raza)) pj.raza = null;
      pintarPersonaje();
    });
    clases.appendChild(b);
  }

  // Resultado
  const res = document.getElementById("b-result");
  if (!pj.raza || !pj.clase) {
    res.innerHTML = `<p class="b-hint">${!pj.raza ? "Elige una raza" : "Ahora elige una clase"} para ver tu personaje.</p>`;
    return;
  }
  const r = RACES[pj.raza];
  const c = CLASSES.find(x => x.id === pj.clase);
  const info = RACIALES[pj.raza];
  res.innerHTML = `
    <div class="b-card ${r.faccion}" style="--cls:${c.color}">
      <div class="b-portrait">${iconoRaza(pj.raza, pj.genero, "xl")}${iconoClase(c)}</div>
      <div class="b-info">
        <span class="b-fac">${iconoFaccion(r.faccion, "sm")} ${r.faccion === "alianza" ? "Alianza" : "Horda"} · empieza en ${info.inicio}</span>
        <h3>${r.nombre} <span style="color:${c.color}">${c.nombre}</span></h3>
        <div class="roles">${c.roles.map(iconoRol).join("")}${c.arboles.map(a => `<span title="${a[0]}">${iconoWow(a[2], "sm")}</span>`).join("")}</div>
        <ul class="b-racials">${info.habilidades.map(h => `<li${h[2] ? ' class="new"' : ""} title="${h[1]}">${h[0]}</li>`).join("")}</ul>
        <a class="cta" href="talentos.html#${c.id}">Planear sus talentos →</a>
      </div>
    </div>`;
}

document.getElementById("b-gender").addEventListener("click", () => {
  pj.genero = pj.genero === "male" ? "female" : "male";
  pintarPersonaje();
});

// ---------- MINIJUEGO: ¿DE QUÉ CLASE ES? ----------
const juego = { racha: 0, mejor: 0, actual: null, respondido: false };
const TALENTOS_JUEGO = [];
for (const [claseId, arboles] of Object.entries(TALENTOS)) {
  for (const [arbol, lista] of Object.entries(arboles)) {
    for (const t of lista) {
      if (t[3]) TALENTOS_JUEGO.push({ clase: claseId, arbol, nombre: t[0], icono: t[3] });
    }
  }
}

function nuevaRonda() {
  juego.actual = TALENTOS_JUEGO[Math.floor(Math.random() * TALENTOS_JUEGO.length)];
  juego.respondido = false;
  // 4 opciones: la buena y 3 al azar
  const otras = CLASSES.filter(c => c.id !== juego.actual.clase).sort(() => Math.random() - .5).slice(0, 3);
  juego.opciones = [CLASSES.find(c => c.id === juego.actual.clase), ...otras].sort(() => Math.random() - .5);
  pintarJuego();
}

function pintarJuego(elegida) {
  const t = juego.actual;
  const caja = document.getElementById("game");
  const buena = CLASSES.find(c => c.id === t.clase);
  caja.innerHTML = `
    <div class="g-score"><span>Racha <b>${juego.racha}</b></span><span>Récord <b>${juego.mejor}</b></span></div>
    <div class="g-icon ${juego.respondido ? (elegida === t.clase ? "ok" : "ko") : ""}">${iconoWow(t.icono, "xxl")}</div>
    <p class="g-name">${juego.respondido ? `<b>${t.nombre}</b> · ${buena.nombre}, ${t.arbol}` : "¿De qué clase es este talento?"}</p>
    <div class="g-options"></div>
    ${juego.respondido ? '<button type="button" class="cta" id="g-next">Siguiente →</button>' : ""}`;
  const opts = caja.querySelector(".g-options");
  for (const c of juego.opciones) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "g-opt";
    b.style.setProperty("--cls", c.color);
    if (juego.respondido) {
      b.disabled = true;
      if (c.id === t.clase) b.classList.add("right");
      else if (c.id === elegida) b.classList.add("wrong");
    }
    b.innerHTML = `${iconoClase(c)}<span>${c.nombre}</span>`;
    b.addEventListener("click", () => {
      juego.respondido = true;
      if (c.id === t.clase) {
        juego.racha++;
        juego.mejor = Math.max(juego.mejor, juego.racha);
        try { localStorage.setItem("brujula-record", juego.mejor); } catch (e) {}
      } else {
        juego.racha = 0;
      }
      pintarJuego(c.id);
    });
    opts.appendChild(b);
  }
  const sig = document.getElementById("g-next");
  if (sig) sig.addEventListener("click", nuevaRonda);
}

try { juego.mejor = parseInt(localStorage.getItem("brujula-record"), 10) || 0; } catch (e) {}

// ---------- MASCOTAS POR NIVEL ----------
function filtrarMascotas() {
  const nivel = parseInt(document.getElementById("pet-lvl").value, 10);
  document.getElementById("pet-lvl-out").textContent = nivel;
  let n = 0;
  const fichas = document.querySelectorAll("#pets .pet");
  fichas.forEach(el => {
    const puede = parseInt(el.dataset.nivel, 10) <= nivel;
    el.classList.toggle("locked", !puede);
    if (puede) n++;
  });
  document.getElementById("pet-count").textContent = `${n} de ${fichas.length} disponibles`;
}
document.getElementById("pet-lvl").addEventListener("input", filtrarMascotas);

// ---------- RAIDS ----------
function pintarRaids() {
  const dias = Math.ceil((APERTURA_RAIDS - new Date()) / 86400000);
  document.getElementById("raids-count").textContent = dias > 0
    ? `Faltan ${dias} días. Las tres abren el mismo día.`
    : "¡Ya están abiertas!";
  document.getElementById("raids-list").innerHTML = RAIDS.map(r => `
    <div class="raid">
      ${r.icono ? iconoWow(r.icono, "xl") : '<span class="wow-icon xl unknown" aria-hidden="true">?</span>'}
      <h3>${r.nombre}</h3>
      <span class="raid-note">${r.nota}</span>
      <div class="raid-stats">
        <div><b>${r.jugadores}</b><span>jugadores</span></div>
        <div><b>${r.jefes}</b><span>${r.jefes === 1 ? "jefe" : "jefes"}</span></div>
      </div>
      <div class="raid-people" aria-hidden="true">${"<i></i>".repeat(r.jugadores)}</div>
    </div>`).join("");
}

// ---------- COMPARADOR ----------
const selA = document.getElementById("cmp-a");
const selB = document.getElementById("cmp-b");

function prepararComparador() {
  for (const sel of [selA, selB]) {
    for (const c of CLASSES) {
      const op = document.createElement("option");
      op.value = c.id;
      op.textContent = c.nombre;
      sel.appendChild(op);
    }
  }
  selA.value = "guerrero";
  selB.value = "mago";
  selA.addEventListener("change", comparar);
  selB.addEventListener("change", comparar);
  comparar();
}

function contarRazas(c, faccion) {
  return c.razas.filter(r => RACES[r].faccion === faccion).length;
}

function comparar() {
  const a = CLASSES.find(c => c.id === selA.value);
  const b = CLASSES.find(c => c.id === selB.value);

  // Filas con iconos
  const iconos = [
    ["Roles", c => c.roles.map(iconoRol).join("")],
    ["Especializaciones", c => c.arboles.map(t => `<span title="${t[0]}">${iconoWow(t[2], "sm")}</span>`).join("")],
    ["Recurso", c => `<span class="res">${c.recurso}</span>`]
  ];
  // Filas con números: se dibujan como barras
  const numeros = [
    ["Habilidades", a.habilidades, b.habilidades, 65],
    ["Nuevas en Forever", a.nuevas, b.nuevas, 8],
    [`${iconoFaccion("alianza", "sm")} Razas`, contarRazas(a, "alianza"), contarRazas(b, "alianza"), 5],
    [`${iconoFaccion("horda", "sm")} Razas`, contarRazas(a, "horda"), contarRazas(b, "horda"), 5]
  ];

  let html = `<div class="cmp-row cmp-head">
      <span></span>
      <span class="cmp-cls" style="--cls:${a.color}">${iconoClase(a)}<b>${a.nombre}</b></span>
      <span class="cmp-cls" style="--cls:${b.color}">${iconoClase(b)}<b>${b.nombre}</b></span>
    </div>`;

  for (const [nombre, f] of iconos) {
    html += `<div class="cmp-row">
        <span class="cmp-label">${nombre}</span>
        <span class="cmp-val icons">${f(a)}</span>
        <span class="cmp-val icons">${f(b)}</span>
      </div>`;
  }

  for (const [nombre, va, vb, max] of numeros) {
    const barra = (v, color, gana) => `<span class="cmp-val bar${gana ? " win" : ""}">
        <span class="bar-track"><span class="bar-fill" style="width:${Math.round(v / max * 100)}%;background:${color}"></span></span><b>${v}</b></span>`;
    html += `<div class="cmp-row">
        <span class="cmp-label">${nombre}</span>
        ${barra(va, a.color, va > vb)}
        ${barra(vb, b.color, vb > va)}
      </div>`;
  }
  document.getElementById("cmp-table").innerHTML = html;
}

// ---------- MASCOTAS ----------
function iconoFamilia(nombre) {
  const f = FAMILIAS.find(x => x[0] === nombre);
  const icono = f && f[1] ? `<img src="${ICONOS_URL}${f[1]}.jpg" alt="" loading="lazy" onerror="this.remove()">` : "";
  return `<span class="pet-icon" aria-hidden="true"><span>${nombre[0]}</span>${icono}</span>`;
}

let modoMascotas = "todas";

function familia(nombre) {
  return FAMILIAS.find(f => f[0] === nombre);
}

function etiquetasUso(f) {
  return (f[4] ? '<b class="tag-pve">PvE</b>' : "") + (f[5] ? '<b class="tag-pvp">PvP</b>' : "");
}

function pintarMascotas() {
  // Botones PvE / PvP
  crearChips("pet-mode",
    [["todas", "Todas"], ["pve", "Mejores para PvE"], ["pvp", "Mejores para PvP"]],
    () => modoMascotas, v => modoMascotas = v);
  for (const b of document.querySelectorAll("#pet-mode .chip")) {
    b.addEventListener("click", pintarMascotas);
  }

  const estados = { nueva: "Nueva en Forever", vista: "Vista en la beta", classic: "Dato de Classic" };
  let lista = MASCOTAS.map((m, i) => ({ m, i, f: familia(m[1]) }));

  if (modoMascotas === "pve") lista = lista.filter(x => x.f[4]);
  if (modoMascotas === "pvp") lista = lista.filter(x => x.f[5]);

  if (document.getElementById("pet-sort").value === "rapida") {
    // Las que no tienen velocidad conocida van al final
    lista.sort((a, b) => (a.m[4] || 99) - (b.m[4] || 99));
  }

  document.getElementById("pets").innerHTML = lista.map(({ m, f }) => `
    <div class="pet ${m[5]}" data-nivel="${m[2]}">
      ${iconoFamilia(m[1])}
      <div class="pet-main">
        <b>${m[0]}</b>
        <span class="pet-meta">${m[1]} · nivel ${m[2]} · ${m[3]}</span>
        <span class="pet-ability">${f[2]}: ${f[3].toLowerCase()} ${etiquetasUso(f)}</span>
        <p>${m[6]}</p>
      </div>
      <div class="pet-side">
        ${m[4] ? `<span class="pet-speed"><b>${m[4].toFixed(1)} s</b>por ataque</span>` : ""}
        <span class="pet-state" title="${estados[m[5]]}"><i class="dot ${m[5]}"></i></span>
      </div>
    </div>`).join("") || '<p class="empty">Ninguna mascota de la lista cumple ese filtro.</p>';

  document.getElementById("families").innerHTML = FAMILIAS.map(f => `
    <div class="family">${iconoFamilia(f[0])}<div><b>${f[0]} ${etiquetasUso(f)}</b><span>${f[2]} · ${f[3]}</span></div></div>`).join("");

  filtrarMascotas();
}

document.getElementById("pet-sort").addEventListener("change", pintarMascotas);

// ---------- RAZAS ----------
let faccionRazas = "todas";

function pintarRazas() {
  crearChips("race-filter",
    [["todas", "Todas"], ["alianza", "Alianza"], ["horda", "Horda"]],
    () => faccionRazas, v => faccionRazas = v);
  // crearChips llama a pintar(); aquí volvemos a pintar las razas
  for (const b of document.querySelectorAll("#race-filter .chip")) {
    b.addEventListener("click", pintarRazas);
  }

  const lista = document.getElementById("races-list");
  lista.innerHTML = "";
  for (const [id, raza] of Object.entries(RACES)) {
    if (faccionRazas !== "todas" && raza.faccion !== faccionRazas) continue;
    const info = RACIALES[id];
    const clases = CLASSES.filter(c => c.razas.includes(id));

    const det = document.createElement("details");
    det.className = "race " + raza.faccion;
    det.innerHTML = `
      <summary>
        <span class="race-name">${raza.nombre}</span>
        ${iconoFaccion(raza.faccion, "sm")}
        <span class="race-classes">${clases.map(c => `<span class="mini" style="--cls:${c.color}" title="${c.nombre}">${iconoClase(c)}</span>`).join("")}</span>
      </summary>
      <div class="race-body">
        <p class="race-start">Empieza en: <b>${info.inicio}</b> · ${clases.length} clases</p>
        <ul class="racials">
          ${info.habilidades.map(h => `<li><b>${h[0]}</b>${h[2] ? ' <span class="new-badge">Nueva</span>' : ""}<span>${h[1]}</span></li>`).join("")}
        </ul>
      </div>`;
    lista.appendChild(det);
  }
}

// ---------- PROFESIONES ----------
function iconoProfesion(nombre) {
  const p = [...PROFESIONES.principales, ...PROFESIONES.secundarias].find(x => x[0] === nombre);
  return iconoWow(p[4]);
}

function fichaProfesion(p) {
  return `<div class="prof-tile ${p[1] === "Recolección" ? "gather" : ""}">
      ${iconoWow(p[4], "lg")}
      <b>${p[0]}</b>
      <span class="prof-count">${p[2]} recetas</span>
      <span class="prof-new">+${p[3]} nuevas</span>
    </div>`;
}

function pintarProfesiones() {
  document.getElementById("prof-main").innerHTML = PROFESIONES.principales.map(fichaProfesion).join("");
  document.getElementById("prof-sec").innerHTML = PROFESIONES.secundarias.map(fichaProfesion).join("");
  document.getElementById("prof-pairs").innerHTML = PAREJAS.map(p => `
    <div class="pair">
      <span class="pair-icons">${iconoProfesion(p[0])}<i>+</i>${iconoProfesion(p[1])}</span>
      <div><b>${p[0]} + ${p[1]}</b><span>${p[2]}</span></div>
    </div>`).join("");
}

// ---------- CALENDARIO ----------
function pintarCalendario() {
  const etiquetas = { hecho: "Hecho", pronto: "Ya llega", futuro: "Próximamente" };
  document.getElementById("timeline").innerHTML = CALENDARIO.map(e => `
    <li class="step ${e.estado}">
      ${iconoWow(e.icono, "step-icon")}
      <span class="step-date">${e.fecha}</span>
      <h3>${e.titulo} <span class="step-state">${etiquetas[e.estado]}</span></h3>
      <p>${e.texto}</p>
    </li>`).join("");
}

// ---------- CUENTA ATRÁS ----------
// 4 nov 2026 a las 15:00 PST = 23:00 UTC = 5 nov 00:00 en España
const LANZAMIENTO = new Date("2026-11-04T23:00:00Z");
function cuentaAtras() {
  const falta = LANZAMIENTO - new Date();
  const el = document.getElementById("count-time");
  if (falta <= 0) {
    el.textContent = "¡Ya disponible!";
    return;
  }
  const h = Math.floor(falta / 3600000);
  const m = Math.floor((falta % 3600000) / 60000);
  const s = Math.floor((falta % 60000) / 1000);
  el.textContent = `${h} h ${String(m).padStart(2, "0")} min ${String(s).padStart(2, "0")} s`;
}
cuentaAtras();
setInterval(cuentaAtras, 1000);

// ---------- NOTICIAS ----------
// Lee data/noticias.json, que actualiza el script scripts/noticias.py
function formatearFecha(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
}

function cargarNoticias() {
  const lista = document.getElementById("news-list");
  fetch("data/noticias.json")
    .then(respuesta => respuesta.json())
    .then(noticias => {
      if (noticias.length === 0) {
        lista.innerHTML = '<p class="empty">Todavía no hay noticias de Forever. Vuelve en unas horas.</p>';
        return;
      }
      lista.innerHTML = "";
      for (const n of noticias.slice(0, 6)) {
        const a = document.createElement("a");
        a.className = "news-item";
        a.href = n.enlace;
        a.target = "_blank";
        a.rel = "noopener";
        const titulo = document.createElement("span");
        titulo.className = "news-title";
        titulo.textContent = n.titulo;
        const meta = document.createElement("span");
        meta.className = "news-meta";
        meta.textContent = `${n.fuente} · ${formatearFecha(n.fecha)}`;
        a.append(titulo, meta);
        lista.appendChild(a);
      }
    })
    .catch(() => {
      lista.innerHTML = '<p class="empty">No se han podido cargar las noticias ahora mismo.</p>';
    });
}

// ---------- MENÚ DE SECCIONES ----------
const SECCIONES = [
  ["clases", "Clases", "classicon_warrior"],
  ["modo", "PvE / PvP", "achievement_pvp_p_250k"],
  ["test", "Test", "inv_misc_dice_01"],
  ["personaje", "Personaje", "achievement_character_human_male"],
  ["talentos.html", "Talentos", "ability_marksmanship"],
  ["comparador", "Comparar", "inv_misc_coin_01"],
  ["juego", "Juego", "inv_misc_questionmark"],
  ["mascotas", "Mascotas", "ability_hunter_beasttaming"],
  ["razas", "Razas", "achievement_character_orc_male"],
  ["profesiones", "Oficios", "trade_blacksmithing"],
  ["raids", "Raids", "achievement_boss_onyxia"],
  ["calendario", "Calendario", "inv_misc_pocketwatch_01"],
  ["noticias", "Noticias", "inv_scroll_03"]
];

function pintarMenu() {
  document.getElementById("nav-items").innerHTML = SECCIONES.map(([id, nombre, icono]) => {
    const href = id.endsWith(".html") ? id : "#" + id;
    return `<a href="${href}" class="nav-item" data-sec="${id}">${iconoWow(icono, "sm")}<span>${nombre}</span></a>`;
  }).join("");
}

// Marca en el menú la sección que estás viendo
function seguirScroll() {
  const observador = new IntersectionObserver(entradas => {
    for (const e of entradas) {
      if (!e.isIntersecting) continue;
      document.querySelectorAll(".nav-item").forEach(a => a.classList.toggle("active", a.dataset.sec === e.target.id));
      const activo = document.querySelector(`.nav-item[data-sec="${e.target.id}"]`);
      if (activo) activo.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    }
  }, { rootMargin: "-40% 0px -55% 0px" });
  document.querySelectorAll("main section[id]").forEach(sec => observador.observe(sec));
}

// ---------- BUSCADOR ----------
function sinTildes(texto) {
  return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Junta en una lista todo lo que se puede buscar
const INDICE = [];
for (const c of CLASSES) {
  INDICE.push({ texto: c.nombre, tipo: "Clase", icono: iconoClase(c), ir: () => { location.hash = c.id; } });
  for (const a of c.arboles) {
    INDICE.push({ texto: `${a[0]} (${c.nombre})`, tipo: "Especialización", icono: iconoWow(a[2], "sm"), ir: () => { location.hash = c.id; } });
  }
}
for (const [id, r] of Object.entries(RACES)) {
  INDICE.push({ texto: r.nombre, tipo: r.faccion === "alianza" ? "Raza · Alianza" : "Raza · Horda", icono: iconoRaza(id, "male", "sm"), ir: () => abrirRaza(id) });
  for (const h of RACIALES[id].habilidades) {
    INDICE.push({ texto: h[0], tipo: `Racial de ${r.nombre}`, icono: iconoRaza(id, "male", "sm"), ir: () => abrirRaza(id) });
  }
}
for (const m of MASCOTAS) {
  INDICE.push({ texto: m[0], tipo: `Mascota · ${m[1]} nivel ${m[2]}`, icono: iconoFamilia(m[1]), ir: () => irA("mascotas") });
}
for (const f of FAMILIAS) {
  INDICE.push({ texto: f[0], tipo: `Familia de mascota · ${f[2]}`, icono: iconoFamilia(f[0]), ir: () => irA("mascotas") });
}
for (const p of [...PROFESIONES.principales, ...PROFESIONES.secundarias]) {
  INDICE.push({ texto: p[0], tipo: "Profesión", icono: iconoWow(p[4], "sm"), ir: () => irA("profesiones") });
}
for (const m of MAZMORRAS) {
  INDICE.push({ texto: m[0], tipo: `Mazmorra · nivel ${m[1]}–${m[2]}`, icono: iconoWow("achievement_dungeon_classicdungeonmaster", "sm"), ir: () => { cambiarModo("pve"); document.getElementById("dg-lvl").value = m[1]; pintarMazmorras(); irA("modo"); } });
}
for (const c of CAMPOS_BATALLA) {
  INDICE.push({ texto: c.nombre, tipo: "Campo de batalla · PvP", icono: iconoWow(c.icono, "sm"), ir: () => { cambiarModo("pvp"); irA("modo"); } });
}
for (const r of RAIDS) {
  INDICE.push({ texto: r.nombre, tipo: `Raid de ${r.jugadores}`, icono: r.icono ? iconoWow(r.icono, "sm") : '<span class="wow-icon sm unknown">?</span>', ir: () => irA("raids") });
}
for (const [claseId, arboles] of Object.entries(TALENTOS)) {
  const c = CLASSES.find(x => x.id === claseId);
  for (const [arbol, lista] of Object.entries(arboles)) {
    for (const t of lista) {
      if (!t[3]) continue;
      INDICE.push({ texto: t[0], tipo: `Talento · ${c.nombre}, ${arbol}`, icono: iconoWow(t[3], "sm"), ir: () => { location.href = "talentos.html#" + claseId; } });
    }
  }
}

function irA(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

function abrirRaza(id) {
  faccionRazas = "todas";
  pintarRazas();
  const det = document.querySelectorAll("#races-list details")[Object.keys(RACES).indexOf(id)];
  det.open = true;
  det.scrollIntoView({ behavior: "smooth", block: "center" });
}

const capa = document.getElementById("search-layer");
const caja = document.getElementById("search-input");

function abrirBuscador() {
  capa.hidden = false;
  bloquearFondo(true);
  caja.value = "";
  buscar();
  caja.focus();
}

function cerrarBuscador() {
  capa.hidden = true;
  bloquearFondo(false);
}

function buscar() {
  const q = sinTildes(caja.value.trim());
  const res = document.getElementById("search-results");
  if (q.length < 2) {
    res.innerHTML = `<p class="search-tip">Escribe al menos 2 letras. Prueba con <i>lobo</i>, <i>gnomo</i>, <i>herrería</i> o <i>shadow</i>.</p>`;
    return;
  }
  // Primero lo que coincide en el nombre, luego lo que coincide en el tipo
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
    b.addEventListener("click", () => { cerrarBuscador(); x.ir(); });
    res.appendChild(b);
  }
}

document.getElementById("search-open").addEventListener("click", abrirBuscador);
document.getElementById("search-close").addEventListener("click", cerrarBuscador);
caja.addEventListener("input", buscar);
caja.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    const primero = document.querySelector(".search-item");
    if (primero) primero.click();
  }
});
capa.addEventListener("click", e => { if (e.target === capa) cerrarBuscador(); });
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && !capa.hidden) cerrarBuscador();
  if (e.key === "/" && capa.hidden && !["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    e.preventDefault();
    abrirBuscador();
  }
});

// ---------- TIRA DE CLASES DE LA CABECERA ----------
document.getElementById("hero-classes").innerHTML = CLASSES.map(c =>
  `<a href="#${c.id}" class="hero-cls" style="--cls:${c.color}" title="${c.nombre}">${iconoClase(c)}<span>${c.nombre}</span></a>`).join("");

pintarMenu();
seguirScroll();
pintar();
pintarTest();
pintarPersonaje();
nuevaRonda();
pintarRaids();
prepararComparador();
pintarMascotas();
pintarMazmorras();
pintarPvP();
pintarRazas();
pintarProfesiones();
pintarCalendario();
cargarNoticias();
if (location.hash) abrirFicha(location.hash.slice(1));
