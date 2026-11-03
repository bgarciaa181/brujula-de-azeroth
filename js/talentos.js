// Calculadora de talentos de Brújula de Azeroth
// Reglas de Classic: 51 puntos (del nivel 10 al 60), cada fila pide 5 puntos más en ese árbol
// y los requisitos tienen que estar al máximo.

const PUNTOS_MAX = 51;
const NIVEL_INICIAL = 10;
const LETRAS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

let clase = "guerrero";
let lista = [];      // todos los talentos de la clase en un solo array
let orden = [];      // índices de los talentos en el orden en que se pusieron los puntos
let arbolMovil = 0;  // árbol que se ve en el móvil
let nivelJugador = 10;

// ---------- Utilidades ----------
function claseActual() {
  return CLASSES.find(c => c.id === clase);
}

function iconoTalento(t, extraClase = "") {
  if (!t.icono) return `<span class="t-icon unknown ${extraClase}" aria-hidden="true">?</span>`;
  return `<span class="t-icon ${extraClase}" aria-hidden="true"><img src="${ICONOS_URL}${t.icono}.jpg" alt="" loading="lazy" onerror="this.remove()"></span>`;
}

function avisar(texto) {
  const t = document.getElementById("toast");
  t.textContent = texto;
  clearTimeout(avisar.timer);
  avisar.timer = setTimeout(() => { t.textContent = ""; }, 2500);
}

// Prepara la lista de talentos de la clase elegida
function cargarClase(id) {
  clase = id;
  lista = [];
  const arboles = TALENTOS[clase];
  Object.keys(arboles).forEach((nombreArbol, a) => {
    for (const t of arboles[nombreArbol]) {
      lista.push({ arbol: a, nombreArbol, nombre: t[0], fila: t[1], rangos: t[2], icono: t[3], req: t[4], desc: t[5] });
    }
  });
  orden = [];
  arbolMovil = 0;
}

// ---------- Reglas ----------
function puntosEn(indice) {
  return orden.filter(i => i === indice).length;
}

function puntosArbol(a) {
  return orden.filter(i => lista[i].arbol === a).length;
}

// Devuelve "" si se puede poner un punto, o el motivo por el que no
function motivoBloqueo(indice) {
  const t = lista[indice];
  if (t.nombre === "?") return "Este talento se conocerá cuando salga el juego.";
  if (orden.length >= PUNTOS_MAX) return "Ya has usado los 51 puntos.";
  if (puntosEn(indice) >= t.rangos) return "Este talento ya está al máximo.";
  const necesarios = (t.fila - 1) * 5;
  if (puntosArbol(t.arbol) < necesarios) return `Necesitas ${necesarios} puntos en ${t.nombreArbol} para esta fila.`;
  if (t.req && t.req !== "?") {
    const r = lista.findIndex(x => x.arbol === t.arbol && x.nombre === t.req);
    if (r >= 0 && puntosEn(r) < lista[r].rangos) return `Antes tienes que completar ${t.req}.`;
  }
  return "";
}

function ponerPunto(indice) {
  const motivo = motivoBloqueo(indice);
  if (!motivo) {
    orden.push(indice);
    guardarEnEnlace();
    pintarTodo();
  }
  mostrarInfo(indice, motivo);
}

// ---------- Enlace para compartir ----------
function codigoBuild() {
  return orden.map(i => LETRAS[i]).join("");
}

function guardarEnEnlace() {
  const hash = orden.length ? `#${clase}=${codigoBuild()}` : `#${clase}`;
  history.replaceState(null, "", hash);
}

function leerEnlace() {
  const partes = location.hash.slice(1).split("=");
  const id = partes[0];
  if (!TALENTOS[id]) return;
  cargarClase(id);
  // Volvemos a poner los puntos uno a uno, comprobando las reglas
  for (const letra of partes[1] || "") {
    const i = LETRAS.indexOf(letra);
    if (i >= 0 && i < lista.length && !motivoBloqueo(i)) orden.push(i);
  }
}

// ---------- Pintar ----------
function pintarClases() {
  const caja = document.getElementById("class-pick");
  caja.innerHTML = "";
  for (const c of CLASSES) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "class-btn";
    b.style.setProperty("--cls", c.color);
    b.setAttribute("aria-pressed", String(c.id === clase));
    b.innerHTML = `${iconoClase(c)}<span>${c.nombre}</span>`;
    b.addEventListener("click", () => {
      cargarClase(c.id);
      guardarEnEnlace();
      pintarTodo();
    });
    caja.appendChild(b);
  }
}

function pintarResumen() {
  const c = claseActual();
  const nombres = Object.keys(TALENTOS[clase]);
  const reparto = nombres.map((n, a) => `${n} <b>${puntosArbol(a)}</b>`).join(" · ");
  const nivel = orden.length ? NIVEL_INICIAL + orden.length - 1 : "—";
  document.getElementById("t-sum").innerHTML = `
    <span class="sum-class" style="--cls:${c.color}">${c.nombre}</span>
    <span class="sum-points"><b>${orden.length}</b>/${PUNTOS_MAX} puntos · nivel ${nivel}</span>
    <span class="sum-split">${reparto}</span>`;
}

function pintarArboles() {
  const nombres = Object.keys(TALENTOS[clase]);

  // Pestañas para el móvil
  const tabs = document.getElementById("tree-tabs");
  tabs.innerHTML = "";
  nombres.forEach((n, a) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "tree-tab";
    b.setAttribute("role", "tab");
    b.setAttribute("aria-selected", String(a === arbolMovil));
    b.innerHTML = `${n} <b>${puntosArbol(a)}</b>`;
    b.addEventListener("click", () => { arbolMovil = a; pintarArboles(); });
    tabs.appendChild(b);
  });

  const caja = document.getElementById("trees");
  caja.innerHTML = "";
  nombres.forEach((n, a) => {
    const arbol = document.createElement("div");
    arbol.className = "tree-box" + (a === arbolMovil ? " active" : "");
    arbol.innerHTML = `<h3>${n} <span>${puntosArbol(a)} puntos</span></h3>`;

    for (let fila = 1; fila <= 7; fila++) {
      const filaDiv = document.createElement("div");
      filaDiv.className = "t-row";
      const abierta = puntosArbol(a) >= (fila - 1) * 5;
      filaDiv.innerHTML = `<span class="row-req">${(fila - 1) * 5}</span>`;
      if (!abierta) filaDiv.classList.add("closed");

      lista.forEach((t, i) => {
        if (t.arbol !== a || t.fila !== fila) return;
        const p = puntosEn(i);
        const b = document.createElement("button");
        b.type = "button";
        b.className = "talent";
        if (p === t.rangos) b.classList.add("max");
        else if (p > 0) b.classList.add("some");
        else if (!motivoBloqueo(i)) b.classList.add("open");
        if (t.nombre === "?") b.classList.add("hidden-talent");
        b.setAttribute("aria-label", `${t.nombre}, ${p} de ${t.rangos}`);
        b.innerHTML = `${iconoTalento(t)}<span class="rank">${p}/${t.rangos}</span><span class="t-name">${t.nombre}</span>`;
        b.addEventListener("click", () => ponerPunto(i));
        filaDiv.appendChild(b);
      });
      arbol.appendChild(filaDiv);
    }
    caja.appendChild(arbol);
  });
}

function mostrarInfo(indice, motivo) {
  const t = lista[indice];
  const p = puntosEn(indice);
  document.getElementById("t-info").innerHTML = `
    <div class="info-head">${iconoTalento(t)}<div><b>${t.nombre}</b><span>${t.nombreArbol} · fila ${t.fila} · ${p}/${t.rangos}</span></div></div>
    ${t.desc ? `<p class="info-desc">${t.desc}</p>` : ""}
    ${t.req ? `<p class="info-req">Requisito: ${t.req === "?" ? "un talento que aún no se conoce" : t.req}</p>` : ""}
    ${motivo ? `<p class="info-block">${motivo}</p>` : ""}`;
}

function pintarOrden() {
  const ol = document.getElementById("order-list");
  const siguiente = nivelJugador - NIVEL_INICIAL; // posición del punto de tu nivel
  ol.innerHTML = "";
  if (orden.length === 0) {
    ol.innerHTML = '<li class="empty">Todavía no has puesto ningún punto. Toca un talento en los árboles.</li>';
  }
  const rangoHasta = {};
  orden.forEach((indice, pos) => {
    rangoHasta[indice] = (rangoHasta[indice] || 0) + 1;
    const t = lista[indice];
    const li = document.createElement("li");
    li.className = "order-item";
    if (pos < siguiente) li.classList.add("done");
    if (pos === siguiente) li.classList.add("now");
    li.innerHTML = `<span class="lvl">${NIVEL_INICIAL + pos}</span>${iconoTalento(t, "small")}<span class="o-name">${t.nombre}</span><span class="o-rank">${rangoHasta[indice]}/${t.rangos}</span>`;
    ol.appendChild(li);
  });

  // Tarjeta grande con el talento de tu nivel
  const box = document.getElementById("next-pick");
  const t = orden[siguiente] !== undefined ? lista[orden[siguiente]] : null;
  if (t) {
    const rango = orden.slice(0, siguiente + 1).filter(i => i === orden[siguiente]).length;
    box.innerHTML = `<span class="np-label">En el nivel ${nivelJugador} pon el punto en</span>
      <div class="np-main">${iconoTalento(t, "big")}<div><b>${t.nombre}</b><span>${t.nombreArbol} · rango ${rango} de ${t.rangos}</span></div></div>`;
  } else {
    box.innerHTML = `<span class="np-label">${orden.length ? "La build no llega a tu nivel todavía." : "Cuando tengas una build, aquí verás qué talento toca en tu nivel."}</span>`;
  }
}

function pintarExtras() {
  const builds = BUILDS[clase] || [];
  const caja = document.getElementById("builds");
  if (builds.length === 0) {
    caja.innerHTML = '<p class="pending">Todavía no hay builds comprobadas para esta clase. Las añadiremos cuando salga el juego y las hayamos probado. Mientras, puedes hacer la tuya y compartirla con "Copiar enlace".</p>';
  } else {
    caja.innerHTML = "";
    for (const b of builds) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn build-btn";
      btn.innerHTML = `<b>${b.nombre}</b><span>${b.autor ? "por " + b.autor : ""}</span>`;
      btn.addEventListener("click", () => {
        location.hash = `${clase}=${b.codigo}`;
      });
      caja.appendChild(btn);
    }
  }

  const rot = ROTACIONES[clase] || [];
  const cajaRot = document.getElementById("rotation");
  if (rot.length === 0) {
    cajaRot.innerHTML = '<p class="pending">Pendiente. Pondremos el orden de habilidades de cada especialización cuando lo hayamos probado en el juego.</p>';
  } else {
    cajaRot.innerHTML = rot.map(r => `
      <div class="rot"><h3>${r.spec}</h3><ol>
        ${r.pasos.map(p => `<li>${iconoTalento({ icono: p[0] }, "small")}<b>${p[1]}</b><span>${p[2]}</span></li>`).join("")}
      </ol></div>`).join("");
  }
}

function pintarTodo() {
  pintarClases();
  pintarResumen();
  pintarArboles();
  pintarOrden();
  pintarExtras();
}

// ---------- Botones ----------
function copiar(texto, mensaje) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(texto)
      .then(() => avisar(mensaje))
      .catch(() => avisar("No se ha podido copiar. Copia el enlace de la barra del navegador."));
  } else {
    avisar("Tu navegador no deja copiar. Copia el enlace de la barra del navegador.");
  }
}

document.getElementById("btn-undo").addEventListener("click", () => {
  if (orden.length === 0) return;
  orden.pop();
  guardarEnEnlace();
  pintarTodo();
});

document.getElementById("btn-reset").addEventListener("click", () => {
  orden = [];
  guardarEnEnlace();
  pintarTodo();
  avisar("Árboles vacíos.");
});

document.getElementById("btn-link").addEventListener("click", () => {
  copiar(location.href, "Enlace copiado. Pégalo donde quieras para compartir tu build.");
});

document.getElementById("btn-text").addEventListener("click", () => {
  const c = claseActual();
  const rangos = {};
  const lineas = orden.map((i, pos) => {
    rangos[i] = (rangos[i] || 0) + 1;
    return `Nv ${NIVEL_INICIAL + pos}: ${lista[i].nombre} (${rangos[i]}/${lista[i].rangos})`;
  });
  copiar(`${c.nombre} - Brújula de Azeroth\n${lineas.join("\n")}\n${location.href}`, "Lista copiada.");
});

// Copia el enlace de la build y abre el foro para crear un tema nuevo
document.getElementById("btn-forum").addEventListener("click", () => {
  if (orden.length === 0) {
    avisar("Primero pon algunos puntos en los árboles.");
    return;
  }
  copiar(location.href, "Enlace copiado. Pégalo en el tema nuevo del foro.");
  window.open("https://github.com/bgarciaa181/brujula-de-azeroth/discussions/new/choose", "_blank", "noopener");
});

document.getElementById("btn-screen").addEventListener("click", e => {
  const activo = document.body.classList.toggle("segunda-pantalla");
  e.currentTarget.setAttribute("aria-pressed", String(activo));
});

document.getElementById("my-level").addEventListener("input", e => {
  const n = parseInt(e.target.value, 10);
  if (n >= 10 && n <= 60) {
    nivelJugador = n;
    pintarOrden();
  }
});

window.addEventListener("hashchange", () => {
  leerEnlace();
  pintarTodo();
});

// ---------- Inicio ----------
cargarClase("guerrero");
leerEnlace();
pintarTodo();
