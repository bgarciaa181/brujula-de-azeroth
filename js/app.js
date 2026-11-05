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
    darLogro("test");
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
        <p class="quiz-also">También te pegan: ${otras.map(o => `<a href="clase.html?c=${o.id}" style="color:${o.color}">${o.nombre}</a>`).join(" y ")}</p>
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
      if (e.target.checked && hechos.length === CHECKLIST.length) darLogro("dia1");
      else if (e.target.checked) mostrarLogro(texto);
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
        ${lineaMeta({ clase: pj.clase, raza: pj.raza, faccion: r.faccion })}
        <form class="b-save" id="b-save-form">
          <div class="b-names">
            <label>Nombre <input type="text" id="b-name" maxlength="12" placeholder="Obligatorio" autocomplete="off" required></label>
            <label>Apellido <input type="text" id="b-last" maxlength="12" placeholder="Obligatorio" autocomplete="off" required></label>
          </div>
          <small class="b-err" id="b-err">En Forever el nombre y el apellido son obligatorios. ¿Sin ideas? <a href="juegos.html#nombres">Generador de nombres</a></small>
          <button type="submit" class="cta" id="b-save" disabled>Guardar personaje</button>
        </form>
        <a class="b-link" href="clase.html?c=${c.id}">Ver la página del ${c.nombre} →</a>
      </div>
    </div>`;
  // El botón solo se activa con nombre y apellido válidos
  const comprobar = () => {
    const okN = nombreValido($("b-name").value), okA = nombreValido($("b-last").value);
    $("b-save").disabled = !(okN && okA);
    const algo = $("b-name").value || $("b-last").value;
    $("b-err").classList.toggle("mal", !!algo && !(okN && okA));
    if (algo && !(okN && okA)) $("b-err").textContent = "Solo letras, sin espacios ni números, de 2 a 12 cada uno.";
  };
  $("b-name").addEventListener("input", comprobar);
  $("b-last").addEventListener("input", comprobar);
  $("b-save-form").addEventListener("submit", e => {
    e.preventDefault();
    if ($("b-save").disabled) return;
    const nombre = limpiarNombre($("b-name").value), apellido = limpiarNombre($("b-last").value);
    const repetido = leerPersonajes().find(x => x.nombre === nombre && x.apellido === apellido);
    guardarPerfil({
      id: repetido ? repetido.id : undefined,
      nombre, apellido,
      faccion: r.faccion, raza: pj.raza, clase: pj.clase, genero: pj.genero,
      nivel: repetido ? repetido.nivel : 1
    });
    $("b-save-form").outerHTML = `<div class="b-saved">✓ <b>${nombre} ${apellido}</b> guardado. Lo tienes arriba en el menú y en <a href="index.html">Inicio</a>.</div>`;
    mostrarLogro(`¡${nombre} ${apellido} está listo para la aventura!`);
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
        if (juego.racha >= 10) darLogro("racha10");
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
      ${r.lista ? `<details class="raid-bosses">
        <summary>Ver los jefes</summary>
        <ol>${r.lista.map(j => `<li>${iconoWow("inv_misc_bone_humanskull_01", "sm")}<span>${j}</span></li>`).join("")}</ol>
        <p>${r.final}</p>
      </details>` : ""}
    </div>`).join("") + '<p class="bp-note">Jefes según <a href="https://www.method.gg/wow-forever/wow-forever-raids-a-look-at-barrow-deeps-hyjal-summit-and-onyxias-lair" target="_blank" rel="noopener">Method</a>. Los nombres salen en inglés porque aún no hay traducción oficial.</p>';
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

let familiaFiltro = null;
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
  // Si vienes de "Las mejores", solo esa familia
  const filtro = document.getElementById("pet-fam");
  if (familiaFiltro) lista = lista.filter(x => x.m[1] === familiaFiltro);
  if (filtro) {
    filtro.hidden = !familiaFiltro;
    filtro.innerHTML = familiaFiltro ? `Solo ${familiaFiltro} <b>✕</b>` : "";
  }

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
        <div class="pet-btns">
          <button type="button" class="pet-where" data-pet="${m[0]}" aria-expanded="false">Dónde está y habilidades</button>
          <a class="pet-look" href="https://wowforeverpets.com/pets/${m[0].toLowerCase().replace(/'/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}" target="_blank" rel="noopener" title="Abre su ficha con foto en wowforeverpets.com">👁 Ver cómo es</a>
        </div>
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
          const insignias = [["pve", "PvE"], ["pvp", "PvP"]].map(([m, t]) => {
            const mejor = mejorSpec(c.id, m);
            return mejor && mejor.nombre.split(" o ").some(n => n.split(" (")[0] === a[0]) ? `<span class="cp-meta">★ Meta ${t}${mejor.empate ? " (empate)" : ""}</span>` : "";
          }).join("");
          return `<div class="cp-spec">
            ${insignias ? `<div class="cp-metas">${insignias}</div>` : ""}
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

// ---------- META: TIER LISTS ----------
const metaVista = { pvp: "bg", pve: "dps" };
const TIER_TEXTO = { S: "Lo más fuerte", A: "Muy buena", B: "Buena", C: "Floja", D: "Muy floja" };

function chipMeta([claseId, arbol, notas, extra], miClase) {
  const c = CLASSES.find(x => x.id === claseId);
  const a = c.arboles.find(x => x[0] === arbol);
  const acuerdo = acuerdoMeta(notas);
  return `<a class="mt-chip${miClase === claseId ? " mia" : ""}" href="clase.html?c=${claseId}" style="--cls:${c.color}">
    ${iconoWow(a ? a[2] : c.icono, "lg")}
    <span class="mt-name"><b>${arbol}${extra ? ` <i>${extra}</i>` : ""}</b><small>${c.nombre}</small></span>
    <span class="mt-votes">${Object.entries(notas).map(([f, l]) => `<em class="t-${l}" title="${META_FUENTES[f][0]}: ${l}">${l}</em>`).join("")}</span>
    ${acuerdo === "debate" ? '<span class="mt-debate" title="Las fuentes no se ponen de acuerdo">debate</span>' : ""}
  </a>`;
}

function pintarTier(cajaId, lista) {
  const p = leerPerfil();
  const mia = p && p.clase;
  const filas = { S: [], A: [], B: [], C: [], D: [] };
  for (const x of lista) filas[letraMedia(x[2])].push(x);
  for (const k in filas) filas[k].sort((a, b) => puntosMeta(b[2]) - puntosMeta(a[2]));
  $(cajaId).innerHTML = Object.entries(filas).filter(([, l]) => l.length).map(([t, l]) => `
    <div class="mt-row">
      <div class="mt-tier t-${t}"><b>${t}</b><small>${TIER_TEXTO[t]}</small></div>
      <div class="mt-specs">${l.map(x => chipMeta(x, mia)).join("")}</div>
    </div>`).join("");
}

function pintarMeta() {
  darLogro("meta");
  // Botones para cambiar de lista
  for (const [grupo, caja] of [["pvp", "mt-pvp-mode"], ["pve", "mt-pve-mode"]]) {
    $(caja).querySelectorAll("button").forEach(b => {
      b.setAttribute("aria-pressed", String(metaVista[grupo] === b.dataset.v));
      b.onclick = () => { metaVista[grupo] = b.dataset.v; pintarMeta(); };
    });
  }
  pintarTier("mt-pvp", META[metaVista.pvp]);
  pintarTier("mt-pve", META[metaVista.pve]);

  // Por clase: la especialización más fuerte de cada una
  const p = leerPerfil();
  $("mt-classes").innerHTML = CLASSES.map(c => {
    const pve = mejorSpec(c.id, "pve");
    const pvp = mejorSpec(c.id, "pvp");
    const linea = (m, txt) => m ? `<div class="mt-best"><small>${txt}</small><b>${m.nombre}</b><em class="t-${m.letra}">${m.letra}</em></div>` : "";
    return `<a class="mt-class${p && p.clase === c.id ? " mia" : ""}" href="clase.html?c=${c.id}" style="--cls:${c.color}">
      <div class="mt-class-head">${iconoClase(c)}<b>${c.nombre}</b>${p && p.clase === c.id ? '<span class="mt-you">tu clase</span>' : ""}</div>
      ${linea(pve, "Meta PvE")}${linea(pvp, "Meta PvP")}
    </a>`;
  }).join("");

  $("mt-sources").innerHTML = Object.entries(META_FUENTES).map(([k, [n, url, f]]) =>
    `<li><em>${k}</em> <a href="${url}" target="_blank" rel="noopener">${n}</a> <small>· ${f}</small></li>`).join("");
  document.querySelectorAll(".mt-date").forEach(e => e.textContent = META_FECHA);
  document.querySelectorAll(".mt-patch").forEach(e => e.textContent = META_PARCHE);
}

// ---------- META: ELIGE TU MAIN ----------
const elige = { faccion: null, modo: "pvp" };

function pintarElige() {
  const p = leerPerfil();
  if (!elige.faccion) elige.faccion = (p && p.faccion) || "horda";

  // Barra de población
  const pob = POBLACION.total;
  $("el-pop").innerHTML = `
    <div class="el-bar"><span class="alianza" style="width:${pob.alianza}%">${iconoFaccion("alianza", "sm")} ${pob.alianza}%</span><span class="horda" style="width:${pob.horda}%">${pob.horda}% ${iconoFaccion("horda", "sm")}</span></div>
    <p class="el-note">Casi a medias. En modo Normal: Horda ${POBLACION.normal.horda}% · en PvP: Alianza ${POBLACION.pvp.alianza}%. <a href="${POBLACION.fuente[1]}" target="_blank" rel="noopener">${POBLACION.fuente[0]}</a></p>`;

  // Botones de facción y de modo
  $("el-fac").innerHTML = [["alianza", "Alianza"], ["horda", "Horda"]].map(([id, t]) =>
    `<button type="button" class="el-opt ${id}" data-f="${id}" aria-pressed="${elige.faccion === id}">${iconoFaccion(id, "lg")}<span>${t}</span></button>`).join("");
  $("el-mode").innerHTML = [["pve", "PvE", "Mazmorras y raids", "achievement_dungeon_classicdungeonmaster"], ["pvp", "PvP", "Campos de batalla y duelos", "achievement_pvp_p_250k"]].map(([id, t, d, ic]) =>
    `<button type="button" class="el-opt" data-m="${id}" aria-pressed="${elige.modo === id}">${iconoWow(ic, "lg")}<span>${t}<small>${d}</small></span></button>`).join("");
  $("el-fac").querySelectorAll("button").forEach(b => b.onclick = () => { elige.faccion = b.dataset.f; pintarElige(); });
  $("el-mode").querySelectorAll("button").forEach(b => b.onclick = () => { elige.modo = b.dataset.m; pintarElige(); });

  // Ranking de clases para ese modo, con su mejor raza en esa facción
  const filas = CLASSES.map(c => ({ c, spec: mejorSpec(c.id, elige.modo), raza: mejorRaza(c.id, elige.faccion, elige.modo) }))
    .filter(x => x.spec && x.raza.razas.length)
    .sort((a, b) => b.spec.media - a.spec.media);

  $("el-result").innerHTML = filas.map((x, i) => {
    const r0 = x.raza.razas[0];
    const debate = x.raza.max < 2;
    return `<div class="el-row${i < 3 ? " top" : ""}${p && p.clase === x.c.id ? " mia" : ""}" style="--cls:${x.c.color}">
      <span class="el-pos">${i + 1}</span>
      <div class="el-combo">${iconoRaza(r0, "male", "lg")}${iconoClase(x.c)}</div>
      <div class="el-txt">
        <b>${x.raza.razas.map(r => RACES[r].nombre).join(" o ")} <span style="color:${x.c.color}">${x.c.nombre}</span></b>
        <small>${x.spec.nombre} · <em class="t-${x.spec.letra}">${x.spec.letra}</em>
          · raza: ${Object.entries(x.raza.votos).map(([f, r]) => `<i title="${RAZA_FUENTES[f][0]}">${RACES[r].nombre.split(" ")[0]}</i>`).join("")}
          ${debate ? '<span class="mt-debate">debate</span>' : ""}</small>
      </div>
      <button type="button" class="el-make" data-r="${r0}" data-c="${x.c.id}">Crear</button>
    </div>`;
  }).join("");
  $("el-result").querySelectorAll(".el-make").forEach(b => b.onclick = () => {
    try { localStorage.setItem("pj-raza", b.dataset.r); localStorage.setItem("pj-clase", b.dataset.c); } catch (e) {}
    location.href = "clases.html#personaje";
  });
  $("el-sources").innerHTML = Object.values(RAZA_FUENTES).map(([n, u, f]) => `<a href="${u}" target="_blank" rel="noopener">${n}</a> (${f})`).join(" · ");
}

// ---------- MASCOTAS: LAS MEJORES A NIVEL 60 ----------
const MODOS_MASCOTA = [
  ["raid", "Raids", "achievement_boss_onyxia", "Para hacer daño contra jefes"],
  ["pvp", "PvP", "achievement_pvp_p_250k", "Para pelear contra jugadores"],
  ["solo", "Subir solo", "ability_hunter_beasttaming", "Que aguante mientras disparas"]
];
let modoMascota = "raid";

function pintarMejoresMascotas() {
  $("bp-modes").innerHTML = MODOS_MASCOTA.map(([id, t, ic, d]) =>
    `<button type="button" class="bp-mode" data-m="${id}" aria-pressed="${modoMascota === id}">${iconoWow(ic, "lg")}<span><b>${t}</b><small>${d}</small></span></button>`).join("");
  $("bp-modes").querySelectorAll("button").forEach(b => b.onclick = () => { modoMascota = b.dataset.m; pintarMejoresMascotas(); });

  const lista = MASCOTA_META[modoMascota].slice().sort((a, b) => puntosMeta(b[1]) - puntosMeta(a[1]));
  const raras = fam => MASCOTAS.filter(m => m[1] === fam).length;
  const tarjeta = ([fam, notas, txt], puesto) => {
    const f = FAMILIAS.find(x => x[0] === fam);
    const letra = letraMedia(notas);
    return `<a class="bp-card p${puesto}" href="#mascotas" data-fam="${fam}">
      ${puesto <= 3 ? `<span class="bp-medal">${["🥇", "🥈", "🥉"][puesto - 1]}</span>` : ""}
      ${iconoFamilia(fam)}
      <b>${fam}</b>
      <span class="bp-what">${txt}</span>
      <span class="bp-tier t-${letra}">${letra}</span>
      ${f ? `<small class="bp-skill">${f[2]}</small>` : ""}
      ${raras(fam) ? `<small class="bp-where">${raras(fam)} rara${raras(fam) > 1 ? "s" : ""} en el mapa →</small>` : ""}
    </a>`;
  };
  $("bp-podium").innerHTML = lista.slice(0, 3).map((x, i) => tarjeta(x, i + 1)).join("");
  $("bp-rest").innerHTML = lista.slice(3).map((x, i) => tarjeta(x, i + 4)).join("");
  document.querySelectorAll(".bp-card").forEach(a => a.addEventListener("click", () => {
    familiaFiltro = a.dataset.fam;
    if ($("pets")) pintarMascotas();
on("pet-fam", "click", () => { familiaFiltro = null; pintarMascotas(); });
  }));

  const usadas = new Set(MASCOTA_META[modoMascota].flatMap(x => Object.keys(x[1])));
  $("bp-note").innerHTML = (modoMascota === "raid"
    ? "Las raids abren el 9 de diciembre: cuando se prueben, pondremos la mejor para cada jefe. "
    : "") + "Notas de: " + [...usadas].map(k => `<a href="${MASCOTA_FUENTES[k][1]}" target="_blank" rel="noopener">${MASCOTA_FUENTES[k][0]}</a>`).join(" · ") + ". Datos de la beta.";
}

// ---------- PORTADA: PREGUNTA DEL DÍA ----------
// Cada día sale una pregunta distinta, hecha con los datos reales de la web
function hoyTexto() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
// Números "al azar" pero siempre iguales para el mismo día
function azarDelDia(semilla) {
  let a = semilla;
  return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}

function preguntaDelDia() {
  const azar = azarDelDia(parseInt(hoyTexto().replace(/-/g, ""), 10));
  const uno = l => l[Math.floor(azar() * l.length)];
  const mezclar = l => l.map(x => [azar(), x]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
  const opciones = (buena, malas) => mezclar([buena, ...mezclar([...new Set(malas)].filter(x => x !== buena)).slice(0, 3)]);
  const tipos = [
    () => { // Talento → clase
      const c = uno(CLASSES), arbol = uno(Object.keys(TALENTOS[c.id]));
      const t = uno(TALENTOS[c.id][arbol].filter(x => x[3]));
      const es = (TALENTOS_ES[c.id] || {})[t[0]];
      return { icono: iconoWow(t[3], "xl"), texto: `¿De qué clase es el talento <b>${es ? es[0] : t[0]}</b>?`, buena: c.nombre, opciones: opciones(c.nombre, CLASSES.map(x => x.nombre)), url: `talentos.html#${c.id}` };
    },
    () => { // Raza → zona de inicio
      const id = uno(Object.keys(RACIALES)), z = RACIALES[id].inicio;
      return { icono: iconoRaza(id, "male", "xl"), texto: `¿Dónde empieza un <b>${RACES[id].nombre}</b>?`, buena: z, opciones: opciones(z, Object.values(RACIALES).map(r => r.inicio)), url: "aventura.html#mapa" };
    },
    () => { // Mascota rara → familia
      const m = uno(MASCOTAS);
      return { icono: iconoFamilia(m[1]), texto: `<b>${m[0]}</b> (${m[3]}), ¿qué tipo de mascota es?`, buena: m[1], opciones: opciones(m[1], FAMILIAS.map(f => f[0])), url: "mascotas.html#mascotas" };
    },
    () => { // Mazmorra → nivel
      const m = uno(MAZMORRAS);
      const buena = `${m[1]}–${m[2]}`;
      return { icono: iconoWow("achievement_dungeon_classicdungeonmaster", "xl"), texto: `¿Para qué niveles es <b>${m[0]}</b>?`, buena, opciones: opciones(buena, MAZMORRAS.map(x => `${x[1]}–${x[2]}`)), url: "pve-pvp.html#modo" };
    },
    () => { // Racial → raza
      const id = uno(Object.keys(RACIALES));
      const propias = RACIALES[id].habilidades.filter(h => Object.entries(RACIALES).filter(([k, r]) => r.habilidades.some(x => x[0] === h[0])).length === 1);
      const h = uno(propias.length ? propias : RACIALES[id].habilidades);
      return { icono: iconoWow("inv_misc_book_09", "xl"), texto: `¿Qué raza tiene la racial <b>${h[0]}</b>? <small>${h[1]}</small>`, buena: RACES[id].nombre, opciones: opciones(RACES[id].nombre, Object.values(RACES).map(r => r.nombre)), url: "clases.html#razas" };
    }
  ];
  return uno(tipos)();
}

function pintarPregunta() {
  const caja = $("pregunta");
  const q = preguntaDelDia();
  const hoy = hoyTexto();
  let guardada = null, racha = { ultima: null, dias: 0 };
  try {
    guardada = JSON.parse(localStorage.getItem("pregunta"));
    racha = JSON.parse(localStorage.getItem("pregunta-racha")) || racha;
  } catch (e) {}
  const respondida = guardada && guardada.fecha === hoy ? guardada.respuesta : null;

  caja.innerHTML = `
    <div class="pd-head"><small>Pregunta del día</small>${racha.dias ? `<span class="pd-streak" title="Días seguidos">🔥 ${racha.dias}</span>` : ""}</div>
    <div class="pd-q">${q.icono}<p>${q.texto}</p></div>
    <div class="pd-opts">${q.opciones.map(o => {
      const cls = !respondida ? "" : o === q.buena ? " ok" : o === respondida ? " ko" : " off";
      return `<button type="button" class="pd-opt${cls}" data-o="${o}" ${respondida ? "disabled" : ""}>${o}</button>`;
    }).join("")}</div>
    ${respondida ? `<p class="pd-after">${respondida === q.buena ? "¡Correcto!" : "¡Casi!"} Vuelve mañana para otra. <a href="${q.url}">Saber más →</a></p>` : ""}`;

  caja.querySelectorAll(".pd-opt").forEach(b => b.addEventListener("click", () => {
    const ayer = new Date(); ayer.setDate(ayer.getDate() - 1);
    const ayerTexto = `${ayer.getFullYear()}-${String(ayer.getMonth() + 1).padStart(2, "0")}-${String(ayer.getDate()).padStart(2, "0")}`;
    racha = { ultima: hoy, dias: racha.ultima === ayerTexto ? racha.dias + 1 : 1 };
    try {
      localStorage.setItem("pregunta", JSON.stringify({ fecha: hoy, respuesta: b.dataset.o }));
      localStorage.setItem("pregunta-racha", JSON.stringify(racha));
    } catch (e) {}
    if (b.dataset.o === q.buena) darLogro("pregunta");
    if (racha.dias >= 3) darLogro("racha3");
    pintarPregunta();
  }));
}

// ---------- PORTADA: RELOJES DE AZEROTH ----------
// Fechas del calendario oficial. Las que aún no tienen día exacto salen sin cuenta atrás.
const RELOJES = [
  ["Lanzamiento", "inv_misc_map_01", new Date("2026-11-04T23:00:00Z"), "5 nov · 00:00"],
  ["Abren las raids", "achievement_boss_onyxia", new Date("2026-12-08T23:00:00Z"), "9 dic · hora por confirmar"],
  ["Modo Hardcore", "inv_misc_bone_humanskull_01", null, "Invierno 2026"],
  ["1.ª gran actualización", "inv_misc_head_dragon_01", null, "Primavera 2027"]
];

function pintarRelojes() {
  const ahora = new Date();
  $("relojes").innerHTML = `<div class="pd-head"><small>Relojes de Azeroth</small></div>` + RELOJES.map(([t, ic, fecha, nota]) => {
    let valor;
    if (!fecha) valor = `<b>${nota}</b>`;
    else if (fecha <= ahora) {
      const dias = Math.floor((ahora - fecha) / 86400000);
      valor = `<b>${dias === 0 ? "¡Hoy!" : `Hace ${dias} día${dias > 1 ? "s" : ""}`}</b>`;
    } else {
      const f = fecha - ahora;
      const d = Math.floor(f / 86400000), h = Math.floor(f % 86400000 / 3600000), m = Math.floor(f % 3600000 / 60000), sg = Math.floor(f % 60000 / 1000);
      valor = `<b class="rl-count">${d ? `${d}d ` : ""}${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sg).padStart(2, "0")}</b>`;
    }
    return `<div class="clock">${iconoWow(ic, "lg")}<span><small>${t}</small>${valor}${fecha ? `<em>${nota}</em>` : ""}</span></div>`;
  }).join("");
}

// ---------- PROFESIONES: ASISTENTE, PLAN DE PERSONAJES Y PREGUNTAS ----------
const asistente = { clase: null, meta: "equipo" };
const METAS_OFICIO = [
  ["equipo", "Fabricarme mi equipo", "inv_hammer_04"],
  ["pve", "Raids (PvE)", "achievement_dungeon_classicdungeonmaster"],
  ["pvp", "PvP", "achievement_pvp_p_250k"],
  ["oro", "Ganar oro", "inv_misc_coin_01"],
  ["subir", "Subir rápido", "inv_misc_map_01"]
];

function parejaPara(claseId, meta) {
  return meta === "equipo" ? PAREJAS_META.equipo[ARMADURA[claseId]] : PAREJAS_META[meta];
}

function pintarAsistenteOficios() {
  const p = leerPerfil();
  if (!asistente.clase) asistente.clase = (p && p.clase) || "guerrero";
  $("eo-classes").innerHTML = CLASSES.map(c =>
    `<button type="button" class="eo-class" data-c="${c.id}" aria-pressed="${asistente.clase === c.id}" style="--cls:${c.color}" title="${c.nombre}">${iconoClase(c)}<span>${c.nombre}</span></button>`).join("");
  $("eo-goals").innerHTML = METAS_OFICIO.map(([id, t, ic]) =>
    `<button type="button" class="bp-mode" data-m="${id}" aria-pressed="${asistente.meta === id}">${iconoWow(ic, "lg")}<span><b>${t}</b></span></button>`).join("");
  $("eo-classes").querySelectorAll("button").forEach(b => b.onclick = () => { asistente.clase = b.dataset.c; pintarAsistenteOficios(); });
  $("eo-goals").querySelectorAll("button").forEach(b => b.onclick = () => { asistente.meta = b.dataset.m; pintarAsistenteOficios(); });

  const c = CLASSES.find(x => x.id === asistente.clase);
  const [a, b, para, porque] = parejaPara(c.id, asistente.meta);
  // Otra opción: la de su equipo si ha elegido otra cosa, o la de oro si ha elegido equipo
  const otra = asistente.meta === "equipo" ? PAREJAS_META.oro : PAREJAS_META.equipo[ARMADURA[c.id]];
  const avisos = [];
  if ([a, b].includes("Ingeniería")) avisos.push("Casi todo lo de Ingeniería solo lo puede usar un ingeniero.");
  if ([a, b].includes("Desuello") && [a, b].includes("Herboristería")) avisos.push("A nivel 60 cambia una de las dos por una de fabricación.");
  avisos.push("Coge también Cocina, Primeros auxilios y Pesca: no ocupan hueco.");

  $("eo-result").innerHTML = `
    <div class="eo-card" style="--cls:${c.color}">
      <div class="eo-pair">${iconoOficio(a)}<i>+</i>${iconoOficio(b)}</div>
      <div class="eo-txt">
        <small>${c.nombre} · ${para}</small>
        <h3>${a} + ${b}</h3>
        <p><b>¿Por qué?</b> ${porque}</p>
        <ul>${avisos.map(x => `<li>${x}</li>`).join("")}</ul>
      </div>
    </div>
    <div class="eo-alt">${iconoOficio(otra[0], "sm")}${iconoOficio(otra[1], "sm")}<span>Otra opción: <b>${otra[0]} + ${otra[1]}</b> · ${otra[2].toLowerCase()}</span></div>`;
}

// Reparte profesiones entre tus personajes para cubrir el máximo posible
function planAlts(lista) {
  const cubiertas = new Set();
  const plan = [];
  const candidatas = p => {
    const propia = PAREJAS_META.equipo[ARMADURA[p.clase]];
    return [propia, PAREJAS_META.oro, PAREJAS_META.equipo.placas, PAREJAS_META.equipo.cuero, PAREJAS_META.equipo.tela, PAREJAS_META.pvp, PAREJAS_META.pve]
      .map(x => [x[0], x[1], x === propia]);
  };
  // Primero los que ya tienen profesiones puestas
  const orden = lista.slice().sort((x, y) => (y.profs || []).length - (x.profs || []).length);
  for (const p of orden) {
    if ((p.profs || []).length === 2) {
      p.profs.forEach(x => cubiertas.add(x.n));
      plan.push([p, p.profs.map(x => x.n), true]);
      continue;
    }
    let mejor = null, nuevas = -1;
    for (const [x, y, propia] of candidatas(p)) {
      const n = [x, y].filter(z => !cubiertas.has(z)).length + (propia ? 0.5 : 0);
      if (n > nuevas) { nuevas = n; mejor = [x, y]; }
    }
    mejor.forEach(z => cubiertas.add(z));
    plan.push([p, mejor, false]);
  }
  return { plan, cubiertas };
}

function pintarPlanAlts() {
  const lista = leerPersonajes();
  if (!lista.length) {
    $("pa-plan").innerHTML = `<div class="to-empty">${iconoWow("achievement_character_human_male", "xl")}<p>Crea tus personajes (puedes tener varios) y te decimos qué profesiones dar a cada uno.</p><a class="cta" href="clases.html#personaje">Crear personaje</a></div>`;
    return;
  }
  const { plan, cubiertas } = planAlts(lista);
  const faltan = TODAS_PRINCIPALES().filter(n => !cubiertas.has(n));
  $("pa-plan").innerHTML = `
    <div class="pa-list">${plan.map(([p, profs, yaTiene]) => {
      const c = CLASSES.find(x => x.id === p.clase);
      return `<div class="pa-row" style="--cls:${c.color}">
        <div class="to-who">${iconoRaza(p.raza, p.genero || "male", "lg")}${iconoClase(c)}<span><b>${nombreCompleto(p)}</b><small style="color:${c.color}">${c.nombre}</small></span></div>
        <div class="pa-profs">${profs.map(n => `<span class="pa-prof">${iconoOficio(n, "lg")}<small>${n}</small></span>`).join("")}</div>
        ${yaTiene ? '<em class="pa-tag">ya las tiene</em>' : `<button type="button" class="pa-use" data-id="${p.id}" data-p="${profs.join("|")}">Ponérselas</button>`}
      </div>`;
    }).join("")}</div>
    <div class="pa-sum"><b>${cubiertas.size} / 9</b> profesiones cubiertas
      ${faltan.length ? `<span>Te falta: ${faltan.map(n => `${iconoOficio(n, "sm")} ${n}`).join(", ")}.
        ${faltan.includes("Ingeniería") ? "Consejo: a nivel 60, cambia una de recolección por Ingeniería." : "Con otro personaje lo tendrías todo."}</span>` : "<span>¡Lo tienes todo cubierto!</span>"}
    </div>`;
  $("pa-plan").querySelectorAll(".pa-use").forEach(b => b.onclick = () => {
    const todos = leerPersonajes();
    const p = todos.find(x => x.id === b.dataset.id);
    p.profs = b.dataset.p.split("|").map(n => ({ n, s: 1 }));
    guardarPersonajes(todos);
    pintarPlanAlts();
    if ($("to-chars")) pintarTusOficios();
  });
}

function pintarPreguntasOficios() {
  $("faq").innerHTML = PREGUNTAS_OFICIOS.map(([ic, q, r]) =>
    `<details class="faq-item"><summary>${iconoWow(ic, "lg")}<b>${q}</b></summary><p>${r}</p></details>`).join("");
}

// ---------- OFICIOS: TUS PROFESIONES, TALLER Y LEGADO ----------
const TODAS_PRINCIPALES = () => PROFESIONES.principales.map(p => p[0]);

// Lo próximo que te toca con una profesión según tu habilidad
function siguientePaso(nombre, nivel) {
  const pasos = [];
  const rangos = [[75, "Oficial"], [150, "Experto"], [225, "Artesano"]];
  const r = rangos.find(([n]) => nivel < n);
  if (r) pasos.push([r[0], `Al acercarte a ${r[0]}, aprende ${r[1]} con el instructor`]);
  if (nivel < 20) pasos.push([20, "A 20: objeto de campamento nivel 1"]);
  else if (nivel < 140) pasos.push([140, "A 140: objeto de campamento nivel 2 (con plano)"]);
  if (OFICIOS_LEGADO.includes(nombre)) {
    const l = [150, 225, 300].find(n => nivel < n);
    if (l) pasos.push([l, `A ${l}: punto de Legado`]);
  }
  pasos.sort((a, b) => a[0] - b[0]);
  return nivel >= 300 ? "¡Al máximo!" : (pasos[0] ? pasos[0][1] : "");
}

function pintarTusOficios() {
  const lista = leerPersonajes();
  const caja = $("to-chars");
  if (!lista.length) {
    caja.innerHTML = `<div class="to-empty">${iconoWow("trade_blacksmithing", "xl")}<p>Primero crea tu personaje y aquí le pones sus profesiones.</p><a class="cta" href="clases.html#personaje">Crear personaje</a></div>`;
  } else {
    caja.innerHTML = lista.map(p => {
      const c = CLASSES.find(x => x.id === p.clase);
      if (!c) return "";
      const profs = (p.profs || []).concat([null, null]).slice(0, 2);
      return `<div class="to-char" style="--cls:${c.color}">
        <div class="to-who">${iconoRaza(p.raza, p.genero || "male", "lg")}${iconoClase(c)}<span><b>${nombreCompleto(p)}</b><small style="color:${c.color}">${c.nombre} · ${p.nivel || 1}</small></span></div>
        ${profs.map((pr, k) => `
          <div class="to-slot">
            <label class="to-pick">${pr ? iconoOficio(pr.n, "lg") : '<span class="wow-icon lg to-plus">+</span>'}
              <select data-id="${p.id}" data-k="${k}" aria-label="Profesión ${k + 1}">
                <option value="">Elegir profesión</option>
                ${TODAS_PRINCIPALES().filter(n => !profs.some((o, j) => j !== k && o && o.n === n)).map(n => `<option ${pr && pr.n === n ? "selected" : ""}>${n}</option>`).join("")}
              </select>
            </label>
            ${pr ? `<div class="to-skill">
              <div class="to-skill-top"><b>${pr.n}</b><span><button type="button" data-id="${p.id}" data-k="${k}" data-d="-5" aria-label="Bajar">−</button><input type="number" min="1" max="300" value="${pr.s}" data-id="${p.id}" data-k="${k}" aria-label="Habilidad"><button type="button" data-id="${p.id}" data-k="${k}" data-d="5" aria-label="Subir">+</button></span></div>
              <div class="to-bar"><i style="width:${pr.s / 3}%"></i>${[75, 150, 225].map(m => `<em style="left:${m / 3}%"></em>`).join("")}${OFICIOS_LEGADO.includes(pr.n) ? [150, 225, 300].map(m => `<u class="${pr.s >= m ? "ok" : ""}" style="left:${m / 3}%" title="Legado a ${m}">★</u>`).join("") : ""}</div>
              <small class="to-next">${siguientePaso(pr.n, pr.s)}</small>
            </div>` : '<small class="to-next">Sin profesión</small>'}
          </div>`).join("")}
      </div>`;
    }).join("");
  }

  // Cambios
  const guardar = (id, k, cambio) => {
    const todos = leerPersonajes();
    const p = todos.find(x => x.id === id);
    if (!p) return;
    const profs = (p.profs || []).concat([null, null]).slice(0, 2);
    profs[k] = cambio(profs[k]);
    p.profs = profs.filter(Boolean);
    guardarPersonajes(todos);
    pintarTusOficios();
  };
  caja.querySelectorAll("select").forEach(sel => sel.onchange = () =>
    guardar(sel.dataset.id, +sel.dataset.k, old => sel.value ? { n: sel.value, s: old && old.n === sel.value ? old.s : 1 } : null));
  caja.querySelectorAll(".to-skill button").forEach(b => b.onclick = () =>
    guardar(b.dataset.id, +b.dataset.k, old => ({ ...old, s: Math.min(300, Math.max(1, old.s + Number(b.dataset.d))) })));
  caja.querySelectorAll(".to-skill input").forEach(inp => inp.onchange = () =>
    guardar(inp.dataset.id, +inp.dataset.k, old => ({ ...old, s: Math.min(300, Math.max(1, parseInt(inp.value, 10) || 1)) })));

  // Taller: quién tiene cada profesión
  const quien = {};
  for (const p of lista) for (const pr of p.profs || []) (quien[pr.n] = quien[pr.n] || []).push(p);
  $("to-taller").innerHTML = TODAS_PRINCIPALES().map(n => {
    const ps = quien[n] || [];
    return `<div class="to-t${ps.length ? " si" : ""}">${iconoOficio(n, "lg")}<b>${n}</b>
      <small>${ps.length ? ps.map(p => `<i style="color:${CLASSES.find(c => c.id === p.clase).color}">${p.nombre || "?"}</i>`).join(", ") : "Nadie"}</small></div>`;
  }).join("");

  // Legado: la mejor habilidad de la cuenta en cada profesión de fabricación
  let total = 0;
  $("to-legado").innerHTML = OFICIOS_LEGADO.map(n => {
    const max = Math.max(0, ...lista.flatMap(p => (p.profs || []).filter(pr => pr.n === n).map(pr => pr.s)));
    const hechos = [150, 225, 300].filter(m => max >= m).length;
    total += hechos;
    return `<div class="to-l">${iconoOficio(n, "sm")}<b>${n}</b><span>${[150, 225, 300].map(m => `<u class="${max >= m ? "ok" : ""}">★</u>`).join("")}</span></div>`;
  }).join("") + `<div class="to-total"><b>${total}</b> / 18 puntos de Legado por profesiones</div>`;
  // El campamento y el plan se actualizan con tus profesiones
  if ($("camp-grid")) pintarCampamento();
  if ($("pa-plan") && typeof pintarPlanAlts === "function") pintarPlanAlts();
}

function pintarCampamento() {
  $("cp-fires").innerHTML = FUEGOS.map(([n, obj]) => `<div class="cp-fire">${iconoWow("spell_fire_fire", "lg")}<span><b>Fuego ${n}</b><small>${obj} objetos</small></span></div>`).join("");
  const mias = new Set(leerPersonajes().flatMap(p => (p.profs || []).map(pr => pr.n)));
  $("camp-grid").innerHTML = CAMPAMENTO.map(([prof, obj, da, no, t2, t3]) => `
    <div class="camp${mias.has(prof) ? " mia" : ""}">
      ${iconoOficio(prof, "lg")}
      <div><b>${da}</b><small>${prof} · ${obj}</small>${no ? `<em>No se suma con ${no}</em>` : ""}</div>
    </div>`).join("");
}

// ---------- OFICIOS: CUÁL ME COJO ----------
const MODOS_OFICIO = [
  ["pve", "PvE", "achievement_dungeon_classicdungeonmaster"],
  ["pvp", "PvP", "achievement_pvp_p_250k"],
  ["oro", "Oro", "inv_misc_coin_01"],
  ["subir", "Subir de nivel", "inv_misc_map_01"]
];
let modoOficio = "oro";

function iconoOficio(nombre, tam = "xl") {
  const p = [...PROFESIONES.principales, ...PROFESIONES.secundarias].find(x => x[0] === nombre);
  return iconoWow(p ? p[4] : "inv_misc_note_01", tam);
}

function pintarCualOficio() {
  // Si tienes personaje, empezamos por lo que más te interesa
  $("of-modes").innerHTML = MODOS_OFICIO.map(([id, t, ic]) =>
    `<button type="button" class="bp-mode" data-m="${id}" aria-pressed="${modoOficio === id}">${iconoWow(ic, "lg")}<span><b>${t}</b></span></button>`).join("");
  $("of-modes").querySelectorAll("button").forEach(b => b.onclick = () => { modoOficio = b.dataset.m; pintarCualOficio(); });

  const tarjeta = (nombre, txt, letra, puesto) => `
    <div class="bp-card p${puesto}">
      ${puesto <= 3 ? `<span class="bp-medal">${["🥇", "🥈", "🥉"][puesto - 1]}</span>` : ""}
      ${iconoOficio(nombre)}
      <b>${nombre}</b>
      <span class="bp-what">${txt}</span>
      ${letra ? `<span class="bp-tier t-${letra}">${letra}</span>` : ""}
    </div>`;

  if (modoOficio === "subir") {
    $("of-podium").innerHTML = OFICIO_SUBIR.slice(0, 3).map(([n, t], i) => tarjeta(n, t, null, i + 1)).join("");
    $("of-rest").innerHTML = OFICIO_SUBIR.slice(3).map(([n, t], i) => tarjeta(n, t, null, i + 4)).join("") +
      '<p class="of-tip">Puedes llegar a 60 sin profesiones. Cocina y Primeros auxilios no ocupan hueco: cógelas siempre.</p>';
  } else {
    const lista = OFICIO_META[modoOficio].slice().sort((a, b) => puntosMeta(b[1]) - puntosMeta(a[1]));
    $("of-podium").innerHTML = lista.slice(0, 3).map(([n, notas, t], i) => tarjeta(n, t, letraMedia(notas), i + 1)).join("");
    $("of-rest").innerHTML = lista.slice(3).map(([n, notas, t], i) => tarjeta(n, t, letraMedia(notas), i + 4)).join("");
  }

  const p = leerPerfil();
  const miClase = p && CLASSES.find(c => c.id === p.clase);
  $("of-combos").innerHTML = OFICIO_COMBOS.map(([a, b, t]) => {
    const mia = miClase && t.toLowerCase().includes(miClase.nombre.toLowerCase().slice(0, 5));
    const marcado = (modoOficio === "pvp" && t === "PvP") || (modoOficio === "pve" && t === "PvE") || (modoOficio === "oro" && /oro/i.test(t)) || (modoOficio === "subir" && /subes/.test(t));
    return `<div class="of-combo${marcado || mia ? " on" : ""}">${iconoOficio(a, "lg")}<i>+</i>${iconoOficio(b, "lg")}<span><b>${t}</b><small>${a} + ${b}</small></span>${mia ? '<em>tu clase</em>' : ""}</div>`;
  }).join("");
  $("of-sell").innerHTML = SE_VENDE.map(([prof, txt]) => `<div class="of-item">${iconoOficio(prof, "sm")}<span>${txt}</span></div>`).join("");
  $("of-note").innerHTML = "Notas de: " + Object.values(OFICIO_FUENTES).map(([n, u, f]) => `<a href="${u}" target="_blank" rel="noopener">${n}</a> (${f})`).join(" · ") +
    ". Aún no hay precios reales de la subasta: se verán cuando salga el juego.";
}

// ---------- COMUNIDAD: APORTAR ----------
// No hay servidor: abrimos la página de Reddit o de GitHub con el texto ya escrito
const TIPOS_APORTE = [["raro", "Un raro o una mascota", "ability_hunter_beasttaming"], ["fallo", "Algo está mal", "spell_holy_dispelmagic"], ["consejo", "Un consejo", "inv_misc_note_01"], ["otro", "Otra cosa", "inv_letter_15"]];
let tipoAporte = "raro";

function prepararAportar() {
  const pintarTipos = () => {
    $("ap-types").innerHTML = TIPOS_APORTE.map(([id, t, ic]) =>
      `<button type="button" class="bp-mode" data-t="${id}" aria-pressed="${tipoAporte === id}">${iconoWow(ic, "lg")}<span><b>${t}</b></span></button>`).join("");
    $("ap-types").querySelectorAll("button").forEach(b => b.onclick = () => { tipoAporte = b.dataset.t; pintarTipos(); });
  };
  pintarTipos();
  document.querySelectorAll(".ap-btn").forEach(b => b.onclick = () => {
    const titulo = $("ap-title").value.trim(), texto = $("ap-text").value.trim();
    if (!titulo || !texto) { $("ap-form").reportValidity(); return; }
    const etiqueta = TIPOS_APORTE.find(x => x[0] === tipoAporte)[1];
    const cuerpo = `${texto}\n\n(${etiqueta} · enviado desde Brújula de Azeroth)`;
    const url = b.dataset.to === "reddit"
      ? `https://www.reddit.com/r/WoWForeverEsp/submit?type=TEXT&title=${encodeURIComponent("[Aporte] " + titulo)}&text=${encodeURIComponent(cuerpo)}`
      : `https://github.com/bgarciaa181/brujula-de-azeroth/discussions/new?category=announcements&title=${encodeURIComponent("[Aporte] " + titulo)}&body=${encodeURIComponent(cuerpo)}`;
    window.open(url, "_blank", "noopener");
  });
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
  for (const pr of p.profs || []) {
    if (pr.s < 300) objetivos.push([iconoOficio(pr.n, "sm"), `${pr.n} ${pr.s}`, siguientePaso(pr.n, pr.s), "oficios.html#tus-oficios"]);
  }

  caja.className = "mi-pj";
  caja.style.setProperty("--cls", c.color);
  caja.innerHTML = `
    <div class="mp-head">
      <div class="mp-icons">${iconoRaza(p.raza, p.genero || "male", "xl")}${iconoClase(c)}</div>
      <div class="mp-who">
        <small>Tu personaje</small>
        <h2>${nombreCompleto(p)}</h2>
        <span>${RACES[p.raza].nombre} · <b style="color:${c.color}">${c.nombre}</b> · ${iconoFaccion(p.faccion, "sm")}</span>
      </div>
      <div class="mp-lvl" aria-label="Tu nivel">
        <button type="button" id="mp-minus" aria-label="Bajar nivel">−</button>
        <span><small>nivel</small><b>${n}</b></span>
        <button type="button" id="mp-plus" aria-label="Subir nivel">+</button>
      </div>
    </div>
    <div class="mp-bar" aria-hidden="true"><i style="width:${(n / 60) * 100}%"></i></div>
    <a class="mp-meta" href="meta.html">${(() => { const a = mejorSpec(c.id, "pve"), b = mejorSpec(c.id, "pvp"); return `<span>Meta PvE: <b>${a ? a.nombre : "—"}</b></span><span>Meta PvP: <b>${b ? b.nombre : "—"}</b></span>`; })()}<i>→</i></a>
    <h3 class="mp-now">Ahora te toca</h3>
    <div class="mp-goals">
      ${objetivos.map(([icono, t, d, url]) => `<a class="mp-goal" href="${url}">${icono}<span><b>${t}</b><small>${d}</small></span></a>`).join("")}
    </div>
    <div class="mp-links">
      <a href="clase.html?c=${c.id}">Mi clase</a>
      <a href="talentos.html#${c.id}">Mis talentos</a>
      <a href="aventura.html#diario">Mi diario</a>
      <button type="button" class="mp-change" onclick="abrirPersonajes()">Mis personajes (${leerPersonajes().length})</button>
    </div>`;

  const subir = d => {
    cambiarPerfil({ nivel: Math.min(60, Math.max(1, n + d)) });
    try { localStorage.setItem("diario-nivel", Math.min(60, Math.max(1, n + d))); localStorage.setItem("diario-faccion", p.faccion); } catch (e) {}
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
  darLogro("ruleta");
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
  trol:     [["Zul", "Jin", "Vol", "Ra", "Ze", "Sen", "Ka", "Mal", "Tak", "Zan", "Ji"], ["", "a", "i", "ja", "u"], ["jin", "zu", "ka", "tal", "ji", "rak", "zin", "ma", "kal", "do"]],
  skyWS:    [["Vey", "Sha", "Kae", "Zir", "Tal", "Ryn", "Sae", "Ori", "Fen", "Ves"], ["a", "e", "i", "ra", "", "wi"], ["sha", "rin", "wynd", "kai", "ros", "ael", "rys", "tha", "len"]]
};
// En Forever el apellido es obligatorio. Se forma con dos trozos (sin espacios ni símbolos).
const APELLIDOS = {
  humano:   [["Ash", "Bright", "Hart", "Thorn", "Mill", "Hollow", "Fair", "Wester", "Rook", "Dawn", "Marsh", "Oak"], ["ford", "well", "vale", "wick", "brook", "mere", "ridge", "field", "ton", "croft"]],
  enano:    [["Granite", "Coal", "Flint", "Copper", "Deep", "Anvil", "Ember", "Stout", "Rumble", "Slate"], ["mantle", "fist", "brew", "delve", "keg", "braid", "helm", "grip", "mug"]],
  elfo:     [["Moon", "Silver", "Leaf", "Shade", "Dusk", "Mist", "Glade", "Dew", "Thistle", "Willow"], ["whisper", "bough", "glen", "blossom", "leaf", "brook", "veil", "thorn", "light"]],
  gnomo:    [["Cog", "Gear", "Spark", "Fizz", "Tinker", "Bolt", "Widget", "Fuse", "Gadget", "Nut"], ["spinner", "whistle", "twist", "bang", "nozzle", "bottom", "pop", "tock", "wobble"]],
  skyHO:    [["Cloud", "Gale", "Zephyr", "Aether", "High", "Feather", "Breeze", "Sun", "Azure", "Crest"], ["wing", "drift", "song", "reach", "spire", "plume", "veil", "sail", "glide"]],
  orco:     [["Skull", "Bone", "War", "Rage", "Grim", "Gore", "Scar", "Ash", "Red", "Rust"], ["fang", "maw", "tusk", "axe", "hide", "rend", "jaw", "spike", "brow"]],
  nomuerto: [["Grave", "Rot", "Bleak", "Dread", "Mourn", "Crypt", "Gloom", "Pale", "Hollow", "Dust"], ["whisper", "shroud", "bane", "stitch", "veil", "bone", "marrow", "grin", "worm"]],
  tauren:   [["Earth", "Plain", "Stone", "Mesa", "Grass", "River", "Dust", "Tall", "Sage", "Cloud"], ["hoof", "horn", "mane", "walker", "strider", "runner", "hide", "song", "drum"]],
  trol:     [["Zah", "Raz", "Tal", "Shen", "Mojo", "Voo", "Kal", "Zan", "Jab", "Tika"], ["jin", "zah", "kaz", "ruk", "mon", "juju", "zeek", "ka", "tiki"]],
  skyWS:    [["Gale", "Storm", "Squall", "Tempest", "Breeze", "Cyclone", "Sky", "Vane", "Whirl", "Rain"], ["wing", "caller", "drift", "song", "talon", "plume", "dancer", "sail", "eye"]]
};
// Apellidos de personajes famosos del juego: no los usamos
const APELLIDOS_PROHIBIDOS = ["bronzebeard", "wildhammer", "ironforge", "stormwind", "hellscream", "doomhammer", "bloodhoof",
  "shadowsong", "whisperwind", "stormrage", "windrunner", "sunstrider", "thunderbrew", "grimtotem", "runetotem", "thunderhorn",
  "staghelm", "proudmoore", "menethil", "frostwolf", "warsong", "blackrock", "shadowmoon", "skyhorn", "stormsong"];

const nombres = { raza: "humano", lista: [], copiado: null };

function nombreAlAzar(raza) {
  const [a, b, c] = SILABAS[raza];
  const al = l => l[Math.floor(Math.random() * l.length)];
  let n = (al(a) + al(b) + al(c)).replace(/'/g, "").replace(/([aeiou])\1+/gi, "$1");
  return n.charAt(0).toUpperCase() + n.slice(1).toLowerCase();
}

function apellidoAlAzar(raza) {
  const [a, b] = APELLIDOS[raza];
  const al = l => l[Math.floor(Math.random() * l.length)];
  const n = (al(a) + al(b)).replace(/([a-z])\1\1/gi, "$1$1");
  return n.charAt(0).toUpperCase() + n.slice(1).toLowerCase();
}

function nuevosNombres() {
  const vistos = new Set();
  let intentos = 0;
  while (vistos.size < 8 && intentos++ < 200) {
    const n = nombreAlAzar(nombres.raza);
    const a = apellidoAlAzar(nombres.raza);
    if (n.length < 4 || n.length > 12 || a.length > 12) continue;
    if (APELLIDOS_PROHIBIDOS.includes(a.toLowerCase())) continue;
    vistos.add(`${n} ${a}`);
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
    <button type="button" class="nm-name" data-n="${n}">${n.split(" ")[0]}<span class="nm-last">${n.split(" ")[1]}</span><small>${nombres.copiado === n ? "¡Copiado!" : "copiar"}</small></button>`).join("");
  $("nm-list").querySelectorAll(".nm-name").forEach(b => b.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(b.dataset.n); } catch (e) {}
    nombres.copiado = b.dataset.n;
    darLogro("nombre");
    if (p) {
      const [nombre, apellido] = b.dataset.n.split(" ");
      cambiarPerfil({ nombre, apellido });
      mostrarLogro(`${b.dataset.n} es ahora el nombre de ${RACES[p.raza].nombre} ${CLASSES.find(x => x.id === p.clase).nombre}`);
    }
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
  ["oficios.html", "Profesiones", "trade_blacksmithing", "Cuáles coger y por qué", "#b07ce8"],
  ["meta.html", "Meta", "achievement_bg_winwsg", "Las specs más fuertes en PvE y PvP", "#ff7a3d"],
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
if ($("ap-form")) prepararAportar();
if ($("pregunta")) pintarPregunta();
if ($("relojes")) { pintarRelojes(); setInterval(pintarRelojes, 1000); }
if ($("mt-pvp")) pintarMeta();
if ($("el-result")) pintarElige();
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
if ($("bp-podium")) pintarMejoresMascotas();
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
if ($("of-podium")) pintarCualOficio();
if ($("to-chars")) pintarTusOficios();
if ($("camp-grid")) pintarCampamento();
if ($("eo-result")) pintarAsistenteOficios();
if ($("pa-plan")) pintarPlanAlts();
if ($("faq")) pintarPreguntasOficios();
if ($("prof-main")) pintarProfesiones();
if ($("timeline")) pintarCalendario();
if ($("news-list")) cargarNoticias();
if (dialogo) abrirFichaDesdeEnlace();
