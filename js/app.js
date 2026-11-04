// app.js: lo de cada página. Cada parte solo se pone en marcha si su página la tiene.

function $(id) {
  return document.getElementById(id);
}

// Añade un evento solo si el elemento existe en esta página
function on(id, evento, funcion) {
  const el = $(id);
  if (el) el.addEventListener(evento, funcion);
}

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
    card.addEventListener("click", () => { location.href = `clase.html?c=${c.id}`; });
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
  history.replaceState(null, "", location.pathname + location.search + "#clases");
  if (dialogo.open) dialogo.close();
}
if (dialogo) {
  dialogo.addEventListener("cancel", e => { e.preventDefault(); cerrarFicha(); });
  dialogo.addEventListener("close", () => bloquearFondo(false));
  dialogo.addEventListener("click", e => { if (e.target === dialogo) cerrarFicha(); });
  // Si la dirección termina en #mago, #cazador... se abre la ficha de esa clase
  window.addEventListener("hashchange", () => abrirFichaDesdeEnlace());
}

function abrirFichaDesdeEnlace() {
  const id = location.hash.slice(1);
  // Los enlaces antiguos tipo clases.html#mago llevan ahora a la página de la clase
  if (CLASSES.some(c => c.id === id)) {
    location.replace(`clase.html?c=${id}`);
  } else if (dialogo && dialogo.open) {
    dialogo.close();
  }
}

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
          <a class="cta" href="clase.html?c=${c.id}">Ver su página</a>
          <a class="cta ghost" href="talentos.html#${c.id}">Sus talentos</a>
          <button type="button" class="cta ghost" id="quiz-again">Repetir</button>
        </div>
        <p class="quiz-also">También te pegan: ${otras.map(o => `<a href="#${o.id}" style="color:${o.color}">${o.nombre}</a>`).join(" y ")}</p>
      </div>`;
    on("quiz-again", "click", () => {
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

// ---------- DIARIO DE AVENTURAS ----------
const diario = { faccion: "alianza", nivel: 1 };
try {
  diario.faccion = localStorage.getItem("diario-faccion") || "alianza";
  diario.nivel = parseInt(localStorage.getItem("diario-nivel"), 10) || 1;
} catch (e) {}
// Si tienes personaje guardado, el diario empieza con su facción y su nivel
if (leerPerfil()) {
  diario.faccion = leerPerfil().faccion;
  diario.nivel = leerPerfil().nivel || diario.nivel;
}

function zonasDeFaccion() {
  return ZONAS.filter(z => z[3] === "ambas" || z[3] === diario.faccion);
}

function lineaObjetivo(icono, titulo, detalle, extra = "") {
  return `<li class="j-goal">${icono}<span><b>${titulo}</b>${detalle ? `<small>${detalle}</small>` : ""}</span>${extra}</li>`;
}

function pintarDiario() {
  const n = diario.nivel;
  document.getElementById("j-lvl").value = n;
  document.getElementById("j-lvl-out").textContent = n;
  try {
    localStorage.setItem("diario-faccion", diario.faccion);
    localStorage.setItem("diario-nivel", n);
  } catch (e) {}
  if (leerPerfil() && leerPerfil().faccion === diario.faccion) cambiarPerfil({ nivel: n });

  // Facciones
  const fac = document.getElementById("j-factions");
  fac.innerHTML = "";
  for (const [id, nombre] of [["alianza", "Alianza"], ["horda", "Horda"]]) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "j-fac " + id;
    b.setAttribute("aria-pressed", String(diario.faccion === id));
    b.innerHTML = `${iconoFaccion(id, "lg")}<span>${nombre}</span>`;
    b.addEventListener("click", () => { diario.faccion = id; pintarDiario(); });
    fac.appendChild(b);
  }

  if (document.getElementById("continents")) pintarMapa();

  // Página izquierda: qué hacer ahora
  const zonas = zonasDeFaccion().filter(z => z[1] <= n && n <= z[2]);
  const mazmorras = MAZMORRAS.filter(m => m[1] <= n && n <= m[2]);
  const mascotas = MASCOTAS.filter(m => m[2] <= n && m[2] >= n - 6);
  const proximas = zonasDeFaccion().filter(z => z[1] > n && z[1] <= n + 6);
  const raids = n === 60 ? RAIDS : [];

  let html = `<h3 class="j-title">Nivel ${n}</h3><p class="j-sub">${diario.faccion === "alianza" ? "Alianza" : "Horda"} · lo que te toca ahora</p>`;

  html += `<h4 class="j-head"><span class="mark">!</span> Ve a estas zonas</h4><ul class="j-list">`;
  html += zonas.length
    ? zonas.map(z => lineaObjetivo(
        '<span class="j-dot zone"></span>',
        z[0],
        `${z[1]}–${z[2]} · ${z[5]}`,
        ZONAS_NUEVAS.includes(z[0]) ? '<span class="new-badge">Nueva</span>' : (z[4] ? '<span class="j-changed">Cambiada</span>' : ""))).join("")
    : lineaObjetivo('<span class="j-dot zone"></span>', "Sin zonas para este nivel", "");
  html += `</ul>`;

  if (mazmorras.length) {
    html += `<h4 class="j-head"><span class="mark">!</span> Mazmorras con grupo</h4><ul class="j-list">`;
    html += mazmorras.map(m => lineaObjetivo(iconoWow("achievement_dungeon_classicdungeonmaster", "sm"), m[0], `${m[1]}–${m[2]} · ${m[3]}`, m[4] ? '<span class="new-badge">Nueva</span>' : "")).join("");
    html += `</ul>`;
  }

  if (raids.length) {
    html += `<h4 class="j-head"><span class="mark">!</span> Raids</h4><ul class="j-list">`;
    html += raids.map(r => lineaObjetivo(r.icono ? iconoWow(r.icono, "sm") : '<span class="wow-icon sm unknown">?</span>', r.nombre, `${r.jugadores} jugadores · 9 de diciembre`)).join("");
    html += `</ul>`;
  }

  if (mascotas.length) {
    html += `<h4 class="j-head"><span class="mark">?</span> Si eres cazador, doma</h4><ul class="j-list">`;
    html += mascotas.map(m => lineaObjetivo(iconoFamilia(m[1]), m[0], `${m[1]} nv ${m[2]} · ${m[3]}`)).join("");
    html += `</ul>`;
  }

  if (proximas.length) {
    html += `<h4 class="j-head soon">Pronto</h4><ul class="j-list soon">`;
    html += proximas.map(z => lineaObjetivo('<span class="j-dot soon"></span>', z[0], `desde nivel ${z[1]}`)).join("");
    html += `</ul>`;
  }
  document.getElementById("j-now").innerHTML = html;

  // Página derecha: la ruta completa del 1 al 60
  const ruta = zonasDeFaccion().slice().sort((a, b) => a[1] - b[1] || a[2] - b[2]);
  document.getElementById("j-route").innerHTML = `
    <h3 class="j-title">Ruta 1–60</h3>
    <p class="j-sub">Toca una zona para saltar a su nivel</p>
    <div class="j-route">
      ${ruta.map(z => {
        const estado = n > z[2] ? "done" : (z[1] <= n ? "now" : "");
        return `<button type="button" class="j-zone ${estado}" data-lvl="${z[1]}">
          <span class="j-zlv">${z[1]}–${z[2]}</span>
          <span class="j-zname">${z[0]}${ZONAS_NUEVAS.includes(z[0]) ? " ★" : ""}</span>
          <span class="j-zbar"><i style="left:${(z[1] - 1) / 59 * 100}%;width:${(z[2] - z[1]) / 59 * 100}%"></i><b style="left:${(n - 1) / 59 * 100}%"></b></span>
        </button>`;
      }).join("")}
    </div>
    <p class="j-foot">★ zona nueva de Forever · Shen'dralas aún no tiene nivel confirmado</p>`;
  // La ruta se mueve sola hasta la primera zona de tu nivel
  const lista = document.querySelector(".j-route");
  const actual = lista.querySelector(".j-zone.now");
  if (actual) lista.scrollTop = actual.offsetTop - lista.offsetTop - 60;

  document.querySelectorAll(".j-zone").forEach(b => b.addEventListener("click", () => {
    diario.nivel = parseInt(b.dataset.lvl, 10);
    pintarDiario();
  }));
}

function cambiarNivelDiario(delta) {
  diario.nivel = Math.min(60, Math.max(1, diario.nivel + delta));
  pintarDiario();
}
on("j-lvl", "input", e => { diario.nivel = parseInt(e.target.value, 10); pintarDiario(); });
on("j-minus", "click", () => cambiarNivelDiario(-1));
on("j-plus", "click", () => cambiarNivelDiario(1));

// ---------- MAPA DE AZEROTH (colores de dificultad del juego) ----------
// Gris, verde, amarillo, naranja o rojo según la diferencia entre tu nivel y el de la zona
function colorDificultad(nivelZona, nivel) {
  const d = nivelZona - nivel;
  if (d >= 5) return "rojo";
  if (d >= 3) return "naranja";
  if (d >= -2) return "amarillo";
  if (d >= -8) return "verde";
  return "gris";
}

function pintarMapa() {
  const n = diario.nivel;
  document.getElementById("map-info").textContent = `${diario.faccion === "alianza" ? "Alianza" : "Horda"}, nivel ${n}`;
  const continentes = ["Reinos del Este", "Kalimdor", "Solo Skyborne"];
  document.getElementById("continents").innerHTML = continentes.map(c => {
    const zonas = ZONAS.filter(z => z[5] === c).sort((a, b) => a[1] - b[1]);
    return `<div class="continent">
      <h3>${c === "Solo Skyborne" ? "Isla Zephras (Skyborne)" : c}</h3>
      <div class="zone-tiles">${zonas.map(z => {
        const media = Math.round((z[1] + z[2]) / 2);
        const enemiga = z[3] !== "ambas" && z[3] !== diario.faccion;
        const color = colorDificultad(media, n);
        return `<button type="button" class="zone-tile ${color}${enemiga ? " enemy" : ""}" data-lvl="${z[1]}" title="${z[0]}: niveles ${z[1]}–${z[2]}">
          <b>${z[0]}</b><span>${z[1]}–${z[2]}</span>
          ${enemiga ? iconoFaccion(z[3], "sm") : ""}
          ${ZONAS_NUEVAS.includes(z[0]) ? '<i class="new-dot">★</i>' : ""}
        </button>`;
      }).join("")}</div>
    </div>`;
  }).join("");
  document.querySelectorAll(".zone-tile").forEach(b => b.addEventListener("click", () => {
    diario.nivel = parseInt(b.dataset.lvl, 10);
    pintarDiario();
    irA("diario");
  }));
}

// ---------- CHECKLIST DEL DÍA 1 ----------
let hechos = [];
try { hechos = JSON.parse(localStorage.getItem("checklist") || "[]"); } catch (e) {}

function mostrarLogro(texto) {
  const caja = document.getElementById("achievement");
  caja.innerHTML = `${iconoWow("inv_misc_note_01", "lg")}<div><small>¡Logro conseguido!</small><b>${texto}</b></div>`;
  caja.hidden = false;
  clearTimeout(mostrarLogro.t);
  mostrarLogro.t = setTimeout(() => { caja.hidden = true; }, 3500);
}

function pintarChecklist() {
  const ul = document.getElementById("check-list");
  ul.innerHTML = "";
  for (const [id, icono, texto, detalle] of CHECKLIST) {
    const li = document.createElement("li");
    const hecho = hechos.includes(id);
    li.className = "check-item" + (hecho ? " done" : "");
    li.innerHTML = `<label>
      <input type="checkbox" id="chk-${id}" ${hecho ? "checked" : ""}>
      ${iconoWow(icono)}
      <span><b>${texto}</b><small>${detalle}</small></span>
    </label>`;
    li.querySelector("input").addEventListener("change", e => {
      hechos = e.target.checked ? [...hechos, id] : hechos.filter(x => x !== id);
      try { localStorage.setItem("checklist", JSON.stringify(hechos)); } catch (err) {}
      if (e.target.checked) mostrarLogro(hechos.length === CHECKLIST.length ? "¡Día 1 completado!" : texto);
      pintarChecklist();
    });
    ul.appendChild(li);
  }
  document.getElementById("check-bar").style.width = `${hechos.length / CHECKLIST.length * 100}%`;
  document.getElementById("check-bar").textContent = `${hechos.length}/${CHECKLIST.length}`;
}

// ---------- PvE / PvP ----------
let modoJuego = "pve";

function cambiarModo(modo) {
  modoJuego = modo;
  $("mode-pve").setAttribute("aria-selected", String(modo === "pve"));
  document.getElementById("mode-pvp").setAttribute("aria-selected", String(modo === "pvp"));
  document.getElementById("panel-pve").hidden = modo !== "pve";
  document.getElementById("panel-pvp").hidden = modo !== "pvp";
  // Las mascotas de más abajo también se filtran igual
  try { localStorage.setItem("modo-juego", modo); } catch (e) {}
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

on("mode-pve", "click", () => cambiarModo("pve"));
on("mode-pvp", "click", () => cambiarModo("pvp"));
on("dg-lvl", "input", pintarMazmorras);

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
        <div class="b-save">
          <label for="b-name">Nombre</label>
          <input type="text" id="b-name" maxlength="12" placeholder="Tu nombre" value="${(leerPerfil() && leerPerfil().nombre) || ""}">
          <button type="button" class="cta" id="b-save">Guardar como mi personaje</button>
        </div>
        <a class="b-link" href="clase.html?c=${c.id}">Ver la página del ${c.nombre} →</a>
      </div>
    </div>`;
  $("b-save").addEventListener("click", () => {
    const anterior = leerPerfil();
    guardarPerfil({
      nombre: $("b-name").value.trim() || "Aventurero",
      faccion: r.faccion, raza: pj.raza, clase: pj.clase, genero: pj.genero,
      nivel: anterior && anterior.clase === pj.clase ? anterior.nivel : 1
    });
    mostrarLogro("¡Personaje guardado! La web se adapta a él");
  });
}

on("b-gender", "click", () => {
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
on("pet-lvl", "input", filtrarMascotas);

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
  try {
    if (localStorage.getItem("cmp-a")) { selA.value = localStorage.getItem("cmp-a"); localStorage.removeItem("cmp-a"); }
    if (localStorage.getItem("cmp-b")) { selB.value = localStorage.getItem("cmp-b"); localStorage.removeItem("cmp-b"); }
  } catch (e) {}
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

let modoMascotas = "todas";


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
        <button type="button" class="pet-where" data-pet="${m[0]}" aria-expanded="false">Dónde está y habilidades</button>
      </div>
      <div class="pet-side">
        ${m[4] ? `<span class="pet-speed"><b>${m[4].toFixed(1)} s</b>por ataque</span>` : ""}
        <span class="pet-state" title="${estados[m[5]]}"><i class="dot ${m[5]}"></i></span>
      </div>
      <div class="pet-detail" hidden></div>
    </div>`).join("") || '<p class="empty">Ninguna mascota de la lista cumple ese filtro.</p>';

  document.querySelectorAll(".pet-where").forEach(b => b.addEventListener("click", () => abrirMascota(b)));

  document.getElementById("families").innerHTML = FAMILIAS.map(f => `
    <div class="family">${iconoFamilia(f[0])}<div><b>${f[0]} ${etiquetasUso(f)}</b><span>${f[2]} · ${f[3]}</span></div></div>`).join("");

  filtrarMascotas();
}

on("pet-sort", "change", pintarMascotas);

// Minimapa con los sitios donde aparece la mascota y sus habilidades
function chipHabilidad(texto, f) {
  const base = texto.replace(/ \d+$/, "");
  const info = HABILIDADES_MASCOTA[base] || (f && f[2] === base ? [f[3], "activa", f[4], f[5]] : null);
  if (!info) return `<span class="ab-chip">${texto}</span>`;
  return `<span class="ab-chip ${info[1]}" title="${info[0]}"><b>${texto}</b><small>${info[0]}</small>
    <span class="ab-tags">${info[1] === "pasiva" ? '<i class="tag-pas">Pasiva</i>' : '<i class="tag-act">Activa</i>'}${info[2] ? '<b class="tag-pve">PvE</b>' : ""}${info[3] ? '<b class="tag-pvp">PvP</b>' : ""}</span></span>`;
}

function abrirMascota(boton) {
  const ficha = boton.closest(".pet");
  const panel = ficha.querySelector(".pet-detail");
  const abierto = !panel.hidden;
  panel.hidden = abierto;
  boton.setAttribute("aria-expanded", String(!abierto));
  boton.textContent = abierto ? "Dónde está y habilidades" : "Ocultar";
  if (abierto) return;

  const m = MASCOTAS.find(x => x[0] === boton.dataset.pet);
  const f = familia(m[1]);
  const datos = MASCOTAS_MAPA[m[0]];
  const conoce = datos.conoce.length ? datos.conoce : [];
  const aprende = [...datos.aprende, f[2]].filter((h, i, a) => a.indexOf(h) === i);

  panel.innerHTML = `
    <div class="mm-wrap">
      <div class="minimap" aria-label="Mapa de ${m[3]} con los sitios donde aparece ${m[0]}">
        <span class="mm-n">N</span>
        ${datos.puntos.map(p => `<i class="mm-spot" style="left:${p[0]}%;top:${p[1]}%" title="${p[0]}, ${p[1]}"></i>`).join("")}
      </div>
      <span class="mm-zone">${m[3]}</span>
    </div>
    <div class="pet-info">
      <p class="mm-coords"><b>Coordenadas:</b> ${datos.puntos.map(p => `${p[0]}, ${p[1]}`).join(" · ")}</p>
      ${conoce.length ? `<h4>Viene con</h4><div class="ab-list">${conoce.map(h => chipHabilidad(h, f)).join("")}</div>` : ""}
      <h4>Puede aprender</h4>
      <div class="ab-list">${aprende.map(h => chipHabilidad(h, f)).join("")}</div>
      <p class="mm-note">Los círculos rojos son los sitios donde suele aparecer. Al ser rara, puede tardar en salir.</p>
    </div>`;
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
  // Cuando ya ha salido el juego, el lanzamiento pasa a "hecho" y las raids a "ya llega"
  if (new Date() >= LANZAMIENTO) {
    for (const e of CALENDARIO) {
      if (e.titulo === "Lanzamiento") e.estado = "hecho";
      if (e.titulo === "Abren las primeras raids" && new Date() < APERTURA_RAIDS) e.estado = "pronto";
      if (e.titulo === "Abren las primeras raids" && new Date() >= APERTURA_RAIDS) e.estado = "hecho";
    }
  }
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
  const el = $("count-time");
  if (!el) return;
  if (falta <= 0) {
    el.textContent = "¡Ya disponible!";
    if ($("count-label")) $("count-label").textContent = "WoW Forever";
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

// ---------- PÁGINA DE UNA CLASE (clase.html?c=mago) ----------
function nombreTalento(claseId, t) {
  const es = (TALENTOS_ES[claseId] || {})[t[0]];
  return es ? es[0] : t[0];
}

function pintarClase() {
  const pedida = new URLSearchParams(location.search).get("c");
  const perfil = leerPerfil();
  const c = CLASSES.find(x => x.id === pedida) || CLASSES.find(x => perfil && x.id === perfil.clase) || CLASSES[0];
  document.title = `${c.nombre} · Brújula de Azeroth`;
  document.documentElement.style.setProperty("--cls", c.color);

  // Cambiar de clase sin volver atrás
  $("class-switch").innerHTML = CLASSES.map(x => `
    <a href="clase.html?c=${x.id}" class="cs-item${x.id === c.id ? " active" : ""}" style="--cls:${x.color}" title="${x.nombre}">${iconoClase(x)}<span>${x.nombre}</span></a>`).join("");

  const arboles = TALENTOS[c.id];
  const ali = c.razas.filter(r => RACES[r].faccion === "alianza");
  const hor = c.razas.filter(r => RACES[r].faccion === "horda");
  const esMia = perfil && perfil.clase === c.id;

  let html = `
    <section class="cp-hero">
      <div class="cp-portrait">${iconoClase(c)}</div>
      <div class="cp-info">
        <h1>${c.nombre}</h1>
        <p class="pitch">${c.pitch}</p>
        <div class="roles">${c.roles.map(r => `${iconoRol(r)}<span class="cp-role">${ROLES[r]}</span>`).join("")}</div>
        <div class="cp-stats">
          <div><b>${c.recurso}</b><span>recurso</span></div>
          <div><b>${c.habilidades}</b><span>habilidades</span></div>
          <div><b>${c.nuevas}</b><span>nuevas en Forever</span></div>
          <div><b>${c.razas.length}</b><span>razas</span></div>
        </div>
        <div class="cp-actions">
          <a class="cta" href="talentos.html#${c.id}">Calculadora de talentos</a>
          ${esMia ? '<span class="cp-mine">★ Es tu clase</span>' : `<button type="button" class="cta ghost" id="cp-pick">Crear personaje ${c.nombre}</button>`}
        </div>
      </div>
    </section>

    <section class="cp-block">
      <h2>Especializaciones</h2>
      <div class="cp-specs">
        ${c.arboles.map(a => {
          const lista = arboles[a[0]] || [];
          const final = lista.filter(t => t[3]).sort((a, b) => b[1] - a[1])[0];
          return `<div class="cp-spec">
            ${iconoWow(a[2], "xl")}
            <h3>${a[0]}</h3>
            <span class="cp-spec-role">${a[1]}</span>
            ${final ? `<div class="cp-final">${iconoWow(final[3], "sm")}<span><small>Talento final</small><b>${nombreTalento(c.id, final)}</b></span></div>` : ""}
          </div>`;
        }).join("")}
      </div>
    </section>

    <section class="cp-block">
      <h2>Talentos especiales</h2>
      <p class="cp-sub">Los de un solo punto. Suelen ser los que cambian tu forma de jugar.</p>
      <div class="cp-key">
        ${Object.entries(arboles).map(([arbol, lista]) => `
          <div class="cp-key-tree">
            <h3>${arbol}</h3>
            <div class="cp-key-icons">
              ${lista.filter(t => t[2] === 1 && t[3]).map(t => `
                <a class="cp-key-item" href="talentos.html#${c.id}" title="${t[5]}">
                  ${iconoWow(t[3], "lg")}<span>${nombreTalento(c.id, t)}</span><small>fila ${t[1]}</small>
                </a>`).join("")}
            </div>
          </div>`).join("")}
      </div>
    </section>

    <section class="cp-block">
      <h2>Razas</h2>
      <div class="cp-races">
        ${[["alianza", ali], ["horda", hor]].map(([f, lista]) => `
          <div class="cp-fac ${f}">
            <h3>${iconoFaccion(f, "sm")} ${f === "alianza" ? "Alianza" : "Horda"}</h3>
            <div class="cp-race-list">
              ${lista.length ? lista.map(r => `<a class="cp-race" href="clases.html#razas">${iconoRaza(r, "male", "lg")}<span>${RACES[r].nombre}</span></a>`).join("") : '<p class="empty">Ninguna raza</p>'}
            </div>
          </div>`).join("")}
      </div>
    </section>`;

  if (c.id === "cazador") {
    const pets = MASCOTAS.slice().sort((a, b) => a[2] - b[2]).slice(0, 4);
    html += `
    <section class="cp-block">
      <h2>Mascotas para empezar</h2>
      <div class="mode-pets">${pets.map(m => `<a class="mini-pet" href="mascotas.html">${iconoFamilia(m[1])}<span><b>${m[0]}</b><small>${m[1]} · nv ${m[2]} · ${m[3]}</small></span></a>`).join("")}</div>
      <a class="b-link" href="mascotas.html">Ver todas las mascotas con su mapa →</a>
    </section>`;
  }

  const otras = CLASSES.filter(x => x.id !== c.id && x.roles.some(r => c.roles.includes(r))).slice(0, 4);
  html += `
    <section class="cp-block">
      <h2>Compárala con</h2>
      <div class="cp-compare">
        ${otras.map(x => `<button type="button" class="cp-cmp" data-otra="${x.id}" style="--cls:${x.color}">${iconoClase(x)}<span>${c.nombre} vs ${x.nombre}</span></button>`).join("")}
      </div>
    </section>`;

  $("clase-page").innerHTML = html;

  const elegir = $("cp-pick");
  if (elegir) elegir.addEventListener("click", () => {
    try { localStorage.setItem("pj-clase", c.id); } catch (e) {}
    location.href = "clases.html#personaje";
  });
  document.querySelectorAll(".cp-cmp").forEach(b => b.addEventListener("click", () => {
    try { localStorage.setItem("cmp-a", c.id); localStorage.setItem("cmp-b", b.dataset.otra); } catch (e) {}
    location.href = "clases.html#comparador";
  }));
}

// ---------- PORTADA: TU PERSONAJE ----------
// Si guardaste tu personaje, la portada te dice qué hacer a tu nivel
function pintarMiPersonaje() {
  const caja = $("mi-pj");
  const p = leerPerfil();
  const c = p && CLASSES.find(x => x.id === p.clase);
  if (!p || !c || !RACES[p.raza]) {
    caja.className = "mi-pj vacio";
    caja.innerHTML = `
      <div class="mp-empty">
        ${iconoWow("achievement_character_human_male", "xl")}
        <div>
          <h2>Crea tu personaje</h2>
          <p>Y la web se adapta a ti: tus talentos, tus zonas y tus mazmorras.</p>
        </div>
      </div>
      <div class="mp-ctas">
        <a class="cta" href="clases.html#personaje">Crear personaje</a>
        <a class="cta ghost" href="clases.html#test">No sé qué clase</a>
        <a class="cta ghost" href="juegos.html#ruleta">Que decida la ruleta</a>
      </div>`;
    return;
  }

  const n = p.nivel || 1;
  const zonas = ZONAS.filter(z => (z[3] === "ambas" || z[3] === p.faccion) && z[1] <= n && n <= z[2]).slice(0, 2);
  const mazmorra = MAZMORRAS.find(m => m[1] <= n && n <= m[2] && (n >= m[1] + 2 || m[2] - m[1] < 4)) || MAZMORRAS.find(m => m[1] > n);
  const objetivos = [];
  for (const z of zonas) objetivos.push([iconoWow("inv_misc_map_01", "sm"), z[0], `zona ${z[1]}–${z[2]}`, "aventura.html#diario"]);
  if (mazmorra) objetivos.push([iconoWow("achievement_dungeon_gloryofthehero", "sm"), mazmorra[0], mazmorra[1] > n ? `mazmorra desde nivel ${mazmorra[1]}` : `mazmorra ${mazmorra[1]}–${mazmorra[2]}`, "pve-pvp.html#modo"]);
  if (c.id === "cazador") {
    const pet = MASCOTAS.filter(m => m[2] <= n + 2).sort((a, b) => b[2] - a[2])[0];
    if (pet) objetivos.push([iconoFamilia(pet[1]), pet[0], `mascota nv ${pet[2]} · ${pet[3]}`, "mascotas.html"]);
  }
  if (n >= 10) objetivos.push([iconoWow("ability_marksmanship", "sm"), "Tu próximo talento", "en la calculadora", `talentos.html#${c.id}`]);

  caja.className = "mi-pj";
  caja.style.setProperty("--cls", c.color);
  caja.innerHTML = `
    <div class="mp-head">
      <div class="mp-icons">${iconoRaza(p.raza, p.genero || "male", "xl")}${iconoClase(c)}</div>
      <div class="mp-who">
        <small>Tu personaje</small>
        <h2>${p.nombre || "Sin nombre"}</h2>
        <span>${RACES[p.raza].nombre} · <b style="color:${c.color}">${c.nombre}</b> · ${iconoFaccion(p.faccion, "sm")}</span>
      </div>
      <div class="mp-lvl" aria-label="Tu nivel">
        <button type="button" id="mp-minus" aria-label="Bajar nivel">−</button>
        <span><small>nivel</small><b>${n}</b></span>
        <button type="button" id="mp-plus" aria-label="Subir nivel">+</button>
      </div>
    </div>
    <div class="mp-bar" aria-hidden="true"><i style="width:${(n / 60) * 100}%"></i></div>
    <h3 class="mp-now">Ahora te toca</h3>
    <div class="mp-goals">
      ${objetivos.map(([icono, t, d, url]) => `<a class="mp-goal" href="${url}">${icono}<span><b>${t}</b><small>${d}</small></span></a>`).join("")}
    </div>
    <div class="mp-links">
      <a href="clase.html?c=${c.id}">Mi clase</a>
      <a href="talentos.html#${c.id}">Mis talentos</a>
      <a href="aventura.html#diario">Mi diario</a>
      <a href="clases.html#personaje" class="mp-change">Cambiar</a>
    </div>`;

  const subir = d => {
    cambiarPerfil({ nivel: Math.min(60, Math.max(1, n + d)) });
    try { localStorage.setItem("diario-nivel", Math.min(60, Math.max(1, n + d))); localStorage.setItem("diario-faccion", p.faccion); } catch (e) {}
    if (n + d === 60) mostrarLogro("¡Nivel 60! Ya puedes ir a las raids");
    pintarMiPersonaje();
  };
  $("mp-minus").addEventListener("click", () => subir(-1));
  $("mp-plus").addEventListener("click", () => subir(1));
}

// ---------- JUEGOS: RULETA DE PERSONAJE ----------
const ruleta = { faccion: "todas", rol: "todos", girando: false, resultado: null };

function combinacionesValidas() {
  const lista = [];
  for (const c of CLASSES) {
    if (ruleta.rol !== "todos" && !c.roles.includes(ruleta.rol)) continue;
    for (const r of c.razas) {
      if (ruleta.faccion !== "todas" && RACES[r].faccion !== ruleta.faccion) continue;
      lista.push([r, c.id]);
    }
  }
  return lista;
}

function pintarRuletaFiltros() {
  const fac = [["todas", "Cualquiera"], ["alianza", "Alianza"], ["horda", "Horda"]];
  $("rl-faction").innerHTML = fac.map(([id, t]) =>
    `<button type="button" class="chip" data-f="${id}" aria-pressed="${ruleta.faccion === id}">${id !== "todas" ? iconoFaccion(id, "sm") : ""}${t}</button>`).join("");
  const roles = [["todos", "Cualquier rol"], ...Object.entries(ROLES)];
  $("rl-role").innerHTML = roles.map(([id, t]) =>
    `<button type="button" class="chip" data-r="${id}" aria-pressed="${ruleta.rol === id}">${id !== "todos" ? iconoRol(id) : ""}${t}</button>`).join("");
  $("rl-faction").querySelectorAll("button").forEach(b => b.addEventListener("click", () => { ruleta.faccion = b.dataset.f; pintarRuletaFiltros(); }));
  $("rl-role").querySelectorAll("button").forEach(b => b.addEventListener("click", () => { ruleta.rol = b.dataset.r; pintarRuletaFiltros(); }));
}

function pintarRuletaCara(raza, claseId, final) {
  const c = CLASSES.find(x => x.id === claseId);
  $("rl-wheel").innerHTML = `
    <div class="rl-slot">${iconoRaza(raza, "male", "xl")}<span>${RACES[raza].nombre}</span></div>
    <div class="rl-plus">+</div>
    <div class="rl-slot" style="--cls:${c.color}">${iconoClase(c)}<span style="color:${c.color}">${c.nombre}</span></div>`;
  $("rl-wheel").classList.toggle("final", !!final);
}

function girarRuleta() {
  if (ruleta.girando) return;
  const lista = combinacionesValidas();
  if (!lista.length) { $("rl-result").innerHTML = '<p class="empty">No hay ninguna combinación con esos filtros.</p>'; return; }
  ruleta.girando = true;
  $("rl-result").innerHTML = "";
  $("rl-spin").disabled = true;
  const elegido = lista[Math.floor(Math.random() * lista.length)];
  const lento = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let paso = 0;
  const pasos = lento ? 1 : 22;
  const tick = () => {
    paso++;
    if (paso >= pasos) {
      pintarRuletaCara(elegido[0], elegido[1], true);
      terminarRuleta(elegido);
      return;
    }
    const x = lista[Math.floor(Math.random() * lista.length)];
    pintarRuletaCara(x[0], x[1], false);
    setTimeout(tick, 40 + paso * paso * 0.7);
  };
  tick();
}

function terminarRuleta([raza, claseId]) {
  ruleta.girando = false;
  ruleta.resultado = [raza, claseId];
  $("rl-spin").disabled = false;
  $("rl-spin").textContent = "Girar otra vez";
  const c = CLASSES.find(x => x.id === claseId);
  $("rl-result").innerHTML = `
    <p class="rl-text">Te toca ser <b>${RACES[raza].nombre}</b> <b style="color:${c.color}">${c.nombre}</b> de la ${RACES[raza].faccion === "alianza" ? "Alianza" : "Horda"}.</p>
    <p class="rl-pitch">${c.pitch}</p>
    <div class="rl-actions">
      <button type="button" class="cta" id="rl-create">Crear este personaje</button>
      <a class="cta ghost" href="clase.html?c=${c.id}">Ver la clase</a>
      <a class="cta ghost" href="#nombres" id="rl-name">Buscarle nombre</a>
    </div>`;
  $("rl-create").addEventListener("click", () => {
    try { localStorage.setItem("pj-raza", raza); localStorage.setItem("pj-clase", claseId); } catch (e) {}
    location.href = "clases.html#personaje";
  });
  $("rl-name").addEventListener("click", () => { nombres.raza = raza; pintarNombres(); });
}

// ---------- JUEGOS: GENERADOR DE NOMBRES ----------
// Sílabas inventadas con el "sonido" de cada raza. Los nombres salen al azar.
const SILABAS = {
  humano:   [["Al", "Ber", "Ced", "Dor", "El", "Gar", "Hal", "Mar", "Ro", "Wil", "Ed", "Ser", "Lia", "Ka"], ["", "a", "e", "i", "o", "ri", "de", "la"], ["ric", "win", "dan", "eth", "mond", "ton", "ra", "na", "lyn", "sa", "bel"]],
  enano:    [["Bru", "Dur", "Gor", "Thor", "Mag", "Bal", "Kra", "Hur", "Grim", "Dol", "Bel", "Hil"], ["", "", "a", "i", "o"], ["din", "grim", "nar", "bek", "dur", "rik", "li", "da", "dis", "gar", "mok"]],
  elfo:     [["Ae", "Ly", "Sha", "Ty", "El", "Ara", "Ily", "Fa", "Na", "Mal", "Ze", "Sy"], ["la", "ri", "the", "ra", "dri", "ne", "", "va"], ["ndris", "nore", "lia", "ras", "thas", "vel", "riel", "wyn", "sae", "dor"]],
  gnomo:    [["Fiz", "Tin", "Bin", "Wiz", "Gim", "Nob", "Pip", "Zip", "Kli", "Spro", "Mek"], ["", "a", "i", "le", "zle", "ble"], ["wick", "bolt", "gear", "nik", "cket", "fuse", "zy", "tok", "spin", "ket"]],
  skyHO:    [["Aer", "Ky", "Zeph", "Sil", "Ori", "Cae", "Nim", "Vey", "Ala", "Ser"], ["a", "i", "e", "ri", "", "lo"], ["lis", "wen", "ros", "ra", "dor", "eth", "ys", "phae", "nor"]],
  orco:     [["Gru", "Kro", "Thra", "Zug", "Mog", "Gor", "Dra", "Ur", "Kar", "Rok", "Gar", "Naz"], ["", "", "a", "o", "u"], ["gash", "nak", "mok", "thar", "rok", "gul", "rash", "dra", "ka", "grim", "tok"]],
  nomuerto: [["Mor", "Vel", "Ske", "Cor", "Gri", "Nec", "Sar", "Lur", "Dre", "Ash", "Vor"], ["a", "e", "o", "i", "va", ""], ["vane", "mor", "dred", "sius", "rin", "ghast", "ith", "na", "lis", "goth"]],
  tauren:   [["Ha", "Ka", "Ma", "Ta", "Ba", "Mu", "Ko", "Ne", "Ru", "Tah", "Ho"], ["", "ka", "no", "wa", "ra", "ma"], ["hoof", "ruk", "tah", "ne", "wa", "mu", "sha", "kan", "tor", "li"]],
  trol:     [["Zul", "Jin", "Vol", "Ra", "Ze", "Sen", "Ka", "Mal", "Tak", "Zan", "Ji"], ["'", "a", "i", "ja", "'"], ["jin", "zu", "ka", "tal", "ji", "rak", "zin", "ma", "kal", "do"]],
  skyWS:    [["Vey", "Sha", "Kae", "Zir", "Tal", "Ryn", "Sae", "Ori", "Fen", "Ves"], ["a", "e", "i", "ra", "", "wi"], ["sha", "rin", "wynd", "kai", "ros", "ael", "rys", "tha", "len"]]
};
const nombres = { raza: "humano", lista: [], copiado: null };

function nombreAlAzar(raza) {
  const [a, b, c] = SILABAS[raza];
  const al = l => l[Math.floor(Math.random() * l.length)];
  let n = al(a) + al(b) + al(c);
  n = n.replace(/'+$/, "").replace(/''/g, "'").replace(/([aeiou])\1+/gi, "$1");
  return n.charAt(0).toUpperCase() + n.slice(1).toLowerCase().replace(/'(.)/, (m, x) => "'" + x.toUpperCase());
}

function nuevosNombres() {
  const vistos = new Set();
  let intentos = 0;
  while (vistos.size < 8 && intentos++ < 80) {
    const n = nombreAlAzar(nombres.raza);
    if (n.length >= 4 && n.length <= 12) vistos.add(n);
  }
  nombres.lista = [...vistos];
}

function pintarNombres() {
  if (!$("nm-races")) return;
  $("nm-races").innerHTML = Object.keys(SILABAS).map(r =>
    `<button type="button" class="nm-race ${RACES[r].faccion}" data-r="${r}" aria-pressed="${nombres.raza === r}" title="${RACES[r].nombre}">${iconoRaza(r, "male", "lg")}<span>${RACES[r].nombre}</span></button>`).join("");
  $("nm-races").querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
    nombres.raza = b.dataset.r; nuevosNombres(); pintarNombres();
  }));
  if (!nombres.lista.length) nuevosNombres();
  const p = leerPerfil();
  $("nm-list").innerHTML = nombres.lista.map(n => `
    <button type="button" class="nm-name" data-n="${n}">${n}<small>${nombres.copiado === n ? "¡Copiado!" : "copiar"}</small></button>`).join("");
  $("nm-list").querySelectorAll(".nm-name").forEach(b => b.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(b.dataset.n); } catch (e) {}
    nombres.copiado = b.dataset.n;
    if (p) { cambiarPerfil({ nombre: b.dataset.n }); mostrarLogro(`${b.dataset.n} es ahora el nombre de tu personaje`); }
    pintarNombres();
  }));
  $("nm-tip").textContent = p ? "Toca un nombre para copiarlo y ponérselo a tu personaje." : "Toca un nombre para copiarlo.";
}

// ---------- PORTADA: TARJETAS PARA EXPLORAR ----------
const EXPLORA = [
  ["aventura.html", "Aventura", "inv_misc_spyglass_02", "Qué hacer a tu nivel, mapa y checklist", "#5b8def"],
  ["clases.html", "Clases y razas", "classicon_warrior", "Las 9 clases, test y crea tu personaje", "#C69B6D"],
  ["talentos.html", "Talentos", "ability_marksmanship", "Calculadora con orden por nivel", "#d6b06a"],
  ["mascotas.html", "Mascotas", "ability_hunter_beasttaming", "Raras con minimapa y habilidades", "#AAD372"],
  ["pve-pvp.html", "PvE y PvP", "achievement_pvp_p_250k", "Mazmorras, raids y campos de batalla", "#e0634f"],
  ["oficios.html", "Oficios", "trade_blacksmithing", "Las 13 profesiones y cuáles combinar", "#b07ce8"],
  ["juegos.html", "Juegos", "inv_misc_dice_01", "Minijuego, ruleta y nombres", "#f0a04b"],
  ["comunidad.html", "Comunidad", "inv_misc_note_01", "Foro, comentarios y noticias", "#3FC7EB"]
];

function pintarExplora() {
  $("explore").innerHTML = EXPLORA.map(([url, titulo, icono, texto, color]) => `
    <a class="explore-card" href="${url}" style="--c:${color}">
      ${iconoWow(icono, "xl")}
      <b>${titulo}</b>
      <span>${texto}</span>
      <i class="explore-go" aria-hidden="true">→</i>
    </a>`).join("");
}

// ---------- ARRANQUE ----------
// Cada parte solo se pinta si está en la página

if ($("hero-classes")) {
  $("hero-classes").innerHTML = CLASSES.map(c =>
    `<a href="clase.html?c=${c.id}" class="hero-cls" style="--cls:${c.color}" title="${c.nombre}">${iconoClase(c)}<span>${c.nombre}</span></a>`).join("");
}
if ($("explore")) pintarExplora();
if ($("mi-pj")) pintarMiPersonaje();
if ($("rl-wheel")) {
  pintarRuletaFiltros();
  pintarRuletaCara("humano", "guerrero", false);
  $("rl-spin").addEventListener("click", girarRuleta);
}
if ($("nm-list")) {
  $("nm-again").addEventListener("click", () => { nuevosNombres(); nombres.copiado = null; pintarNombres(); });
  pintarNombres();
}
if ($("j-book")) pintarDiario();
if ($("check-list")) pintarChecklist();
if ($("grid")) pintar();
if ($("quiz")) pintarTest();
if ($("b-factions")) {
  // Si vienes desde la página de una clase, ya llega elegida
  try {
    const pre = localStorage.getItem("pj-clase");
    const raza = localStorage.getItem("pj-raza");
    if (raza && RACES[raza]) { pj.raza = raza; pj.faccion = RACES[raza].faccion; localStorage.removeItem("pj-raza"); }
    if (pre) { pj.clase = pre; localStorage.removeItem("pj-clase"); }
  } catch (e) {}
  pintarPersonaje();
}
if ($("clase-page")) pintarClase();
if ($("game")) nuevaRonda();
if ($("raids-list")) pintarRaids();
if ($("cmp-a")) prepararComparador();
if ($("pets")) pintarMascotas();
if ($("dg-chart")) {
  try {
    const n = parseInt(localStorage.getItem("dg-nivel"), 10);
    if (n) { $("dg-lvl").value = n; localStorage.removeItem("dg-nivel"); }
    if (localStorage.getItem("modo-juego") === "pvp") cambiarModo("pvp");
  } catch (e) {}
  pintarMazmorras();
  pintarPvP();
}
if ($("races-list")) pintarRazas();
if ($("prof-main")) pintarProfesiones();
if ($("timeline")) pintarCalendario();
if ($("news-list")) cargarNoticias();
if (dialogo) abrirFichaDesdeEnlace();
