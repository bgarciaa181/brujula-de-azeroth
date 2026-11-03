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
  for (const c of lista) {
    const card = document.createElement("button");
    card.className = "card";
    card.type = "button";
    card.style.setProperty("--cls", c.color);
    card.innerHTML = `
      <span class="sigil" aria-hidden="true">${c.nombre[0]}</span>
      <h3>${c.nombre}</h3>
      <p class="trees">${c.arboles.map(a => a[0]).join(" · ")}</p>
      <div class="tags">${c.roles.map(r => `<span class="tag">${ROLES[r]}</span>`).join("")}</div>
      ${c.facil ? '<span class="easy">Fácil para empezar</span>' : ""}`;
    card.addEventListener("click", () => { location.hash = c.id; });
    grid.appendChild(card);
  }
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
      <span class="sigil" aria-hidden="true">${c.nombre[0]}</span>
      <div>
        <h2 id="d-name">${c.nombre}</h2>
        <p>Recurso: ${c.recurso} · ${c.roles.map(r => ROLES[r]).join(", ")}</p>
      </div>
      <button class="close" type="button" aria-label="Cerrar">×</button>
    </div>
    <div class="d-body">
      <p class="pitch">${c.pitch}</p>
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
        <p class="pending">Lo añadiremos cuando salga el juego y lo hayamos probado. Mientras tanto, puedes mirar una calculadora completa más abajo en la página.</p>
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

pintar();
if (location.hash) abrirFicha(location.hash.slice(1));
