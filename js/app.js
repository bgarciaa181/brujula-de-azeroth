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
    b.innerHTML = (ROLES[valor] ? iconoRol(valor) : "") + `<span>${texto}</span>`;
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
          <div><strong>Alianza</strong>${ali.join(", ") || "Ninguna"}</div>
          <div><strong>Horda</strong>${hor.join(", ") || "Ninguna"}</div>
        </div>
      </div>
      <div>
        <a class="cta" href="talentos.html#${c.id}">Ver talentos de ${c.nombre} →</a>
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
    ["Razas de Alianza", contarRazas(a, "alianza"), contarRazas(b, "alianza"), 5],
    ["Razas de Horda", contarRazas(a, "horda"), contarRazas(b, "horda"), 5]
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

// ---------- TIRA DE CLASES DE LA CABECERA ----------
document.getElementById("hero-classes").innerHTML = CLASSES.map(c =>
  `<a href="#${c.id}" class="hero-cls" style="--cls:${c.color}" title="${c.nombre}">${iconoClase(c)}<span>${c.nombre}</span></a>`).join("");

pintar();
pintarTest();
prepararComparador();
pintarMascotas();
pintarRazas();
pintarProfesiones();
pintarCalendario();
cargarNoticias();
if (location.hash) abrirFicha(location.hash.slice(1));
