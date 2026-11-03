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
    b.textContent = texto;
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
    [["todos", "Todos los roles"], ...Object.entries(ROLES)],
    () => rolElegido, v => rolElegido = v);
  crearChips("faction-filter",
    [["todas", "Ambas facciones"], ["alianza", "Alianza"], ["horda", "Horda"]],
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
      <p class="trees">${c.arboles.map(a => a[0]).join(" · ")}</p>
      <div class="tags">${c.roles.map(r => `<span class="tag">${ROLES[r]}</span>`).join("")}</div>
      ${c.facil ? '<span class="easy">Fácil para empezar</span>' : ""}`;
    card.style.setProperty("--i", i);
    card.addEventListener("click", () => { location.hash = c.id; });
    grid.appendChild(card);
  });
  document.getElementById("result-count").textContent =
    lista.length === 0 ? "Ninguna clase cumple esos filtros."
    : `${lista.length} ${lista.length === 1 ? "clase" : "clases"}. Toca una para ver su ficha.`;
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
        <p>Recurso: ${c.recurso} · ${c.roles.map(r => ROLES[r]).join(", ")}</p>
      </div>
      <button class="close" type="button" aria-label="Cerrar">×</button>
    </div>
    <div class="d-body">
      <p class="pitch">${c.pitch}</p>
      <div class="stats">
        <div><b>${c.habilidades}</b><span>habilidades de entrenador</span></div>
        <div><b>${c.nuevas}</b><span>nuevas en Forever</span></div>
        <div><b>${c.razas.length}</b><span>razas disponibles</span></div>
      </div>
      <div>
        <h3>Sus 3 árboles de talentos</h3>
        <div class="tree-list">${c.arboles.map(a => `<div class="tree"><b>${a[0]}</b><span>${a[1]}</span></div>`).join("")}</div>
      </div>
      <div>
        <h3>Razas que pueden jugarla</h3>
        <div class="races">
          <div><strong>Alianza</strong>${ali.join(", ") || "Ninguna"}</div>
          <div><strong>Horda</strong>${hor.join(", ") || "Ninguna"}</div>
        </div>
      </div>
      <div>
        <h3>Talentos para subir de nivel</h3>
        <p class="pending">Lo añadiremos cuando salga el juego y lo hayamos probado. Mientras tanto, puedes hacer tu propia build.</p>
        <a class="cta" href="talentos.html#${c.id}">Abrir los talentos de ${c.nombre} →</a>
      </div>
    </div>`;
  dialogo.querySelector(".close").addEventListener("click", cerrarFicha);
  if (!dialogo.open) dialogo.showModal();
}

function cerrarFicha() {
  history.replaceState(null, "", location.pathname + location.search);
  if (dialogo.open) dialogo.close();
}
dialogo.addEventListener("cancel", e => { e.preventDefault(); cerrarFicha(); });
dialogo.addEventListener("click", e => { if (e.target === dialogo) cerrarFicha(); });
window.addEventListener("hashchange", () => abrirFicha(location.hash.slice(1)));

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

  // Cada fila: [nombre, valor de A, valor de B, ¿es un número?]
  const filas = [
    ["Roles", a.roles.map(r => ROLES[r]).join(", "), b.roles.map(r => ROLES[r]).join(", "), false],
    ["Recurso", a.recurso, b.recurso, false],
    ["Árboles", a.arboles.map(t => t[0]).join(", "), b.arboles.map(t => t[0]).join(", "), false],
    ["Habilidades", a.habilidades, b.habilidades, true],
    ["Nuevas en Forever", a.nuevas, b.nuevas, true],
    ["Razas de Alianza", contarRazas(a, "alianza"), contarRazas(b, "alianza"), true],
    ["Razas de Horda", contarRazas(a, "horda"), contarRazas(b, "horda"), true]
  ];

  let html = `<div class="cmp-row cmp-head">
      <span></span>
      <span class="cmp-cls" style="--cls:${a.color}">${iconoClase(a)}<b>${a.nombre}</b></span>
      <span class="cmp-cls" style="--cls:${b.color}">${iconoClase(b)}<b>${b.nombre}</b></span>
    </div>`;

  for (const [nombre, va, vb, numero] of filas) {
    const ganaA = numero && va > vb ? " win" : "";
    const ganaB = numero && vb > va ? " win" : "";
    html += `<div class="cmp-row">
        <span class="cmp-label">${nombre}</span>
        <span class="cmp-val${ganaA}">${va}</span>
        <span class="cmp-val${ganaB}">${vb}</span>
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

function pintarMascotas() {
  const estados = { nueva: "Nueva en Forever", vista: "Vista en la beta", classic: "Dato de Classic" };
  document.getElementById("pets").innerHTML = MASCOTAS.map(m => `
    <div class="pet ${m[5]}">
      ${iconoFamilia(m[1])}
      <div class="pet-main">
        <b>${m[0]}</b>
        <span class="pet-meta">${m[1]} · nivel ${m[2]} · ${m[3]}</span>
        <p>${m[6]}</p>
      </div>
      <div class="pet-side">
        ${m[4] ? `<span class="pet-speed"><b>${m[4].toFixed(1)} s</b>por ataque</span>` : ""}
        <span class="pet-state" title="${estados[m[5]]}"><i class="dot ${m[5]}"></i></span>
      </div>
    </div>`).join("");

  document.getElementById("families").innerHTML = FAMILIAS.map(f => `
    <div class="family">${iconoFamilia(f[0])}<div><b>${f[0]}</b><span>${f[2]} · ${f[3]}</span></div></div>`).join("");
}

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
        <span class="faction-badge">${raza.faccion === "alianza" ? "Alianza" : "Horda"}</span>
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
function filaProfesion(p) {
  return `<div class="prof">
      <span class="prof-name">${p[0]}<small>${p[1]}</small></span>
      <span class="prof-num">${p[2]}<small>recetas</small></span>
      <span class="prof-num new">+${p[3]}<small>nuevas</small></span>
    </div>`;
}

function pintarProfesiones() {
  document.getElementById("prof-main").innerHTML = PROFESIONES.principales.map(filaProfesion).join("");
  document.getElementById("prof-sec").innerHTML = PROFESIONES.secundarias.map(filaProfesion).join("");
  document.getElementById("prof-pairs").innerHTML = PAREJAS.map(p =>
    `<div class="pair"><b>${p[0]} + ${p[1]}</b><span>${p[2]}</span></div>`).join("");
}

// ---------- CALENDARIO ----------
function pintarCalendario() {
  const etiquetas = { hecho: "Hecho", pronto: "Ya llega", futuro: "Próximamente" };
  document.getElementById("timeline").innerHTML = CALENDARIO.map(e => `
    <li class="step ${e.estado}">
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

pintar();
prepararComparador();
pintarMascotas();
pintarRazas();
pintarProfesiones();
pintarCalendario();
cargarNoticias();
if (location.hash) abrirFicha(location.hash.slice(1));
