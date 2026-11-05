// Service worker: guarda la web para que funcione sin internet.
// Primero intenta la red (para ver siempre lo último) y si no hay conexión usa lo guardado.
const CACHE = "brujula-v28";
const BASICOS = [
  "./", "index.html", "aventura.html", "clases.html", "clase.html", "talentos.html", "mascotas.html",
  "pve-pvp.html", "oficios.html", "meta.html", "juegos.html", "comunidad.html",
  "css/estilos.css?v=28", "css/talentos.css?v=28",
  "js/datos.js?v=28", "js/talentos-datos.js?v=28", "js/talentos-es.js?v=28", "js/meta-datos.js?v=28",
  "js/layout.js?v=28", "js/app.js?v=28", "js/talentos.js?v=28", "img/icono.svg"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASICOS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(nombres => Promise.all(nombres.filter(n => n !== CACHE).map(n => caches.delete(n)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  // Iconos de Blizzard: si ya los tenemos, no los volvemos a pedir
  if (url.hostname === "render.worldofwarcraft.com") {
    e.respondWith(caches.open(CACHE).then(async c => {
      const guardado = await c.match(e.request);
      if (guardado) return guardado;
      const r = await fetch(e.request);
      if (r.ok || r.type === "opaque") c.put(e.request, r.clone());
      return r;
    }));
    return;
  }
  if (url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok) caches.open(CACHE).then(c => c.put(e.request, r.clone()));
      return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: false }).then(r => r || caches.match(e.request, { ignoreSearch: true })))
  );
});
