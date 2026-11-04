# Brújula de Azeroth

Fansite **no oficial** en español para quien empieza en **World of Warcraft: Forever**.
Explica las 9 clases de forma sencilla: qué rol cumplen, sus árboles de talentos y qué razas pueden jugarlas en cada facción.

Pensada sobre todo para verla en el móvil.

## Qué tiene

- Cuenta atrás para el lanzamiento en España.
- Las 9 clases con filtros por rol y por facción.
- Una ficha por clase con su icono oficial (se puede compartir con un enlace como `#mago`).
- Comparador para ver dos clases lado a lado.
- Calculadora de talentos (`talentos.html`) con el orden por nivel, enlace para compartir la build y modo segunda pantalla.
- Mascotas raras de cazador con nivel, zona y velocidad de ataque.
- Razas con sus habilidades raciales, profesiones y calendario oficial.
- Noticias de WoW Forever que se actualizan solas cada 3 horas.
- Lo básico de los talentos en 3 ideas.
- Enlaces a calculadoras de talentos completas.

## Datos

Todos los datos de clases, árboles y razas salen del juego (cliente 1.60.1).
No se inventa nada: lo que todavía no se ha comprobado en el juego aparece como "pendiente".

Los datos están en `js/datos.js`, así que es fácil corregirlos o añadir información.

## Estructura

```
brujula-de-azeroth/
├── index.html          → inicio: tu personaje, qué te toca ahora y accesos
├── aventura.html       → diario de aventuras, mapa de Azeroth y checklist del día 1
├── clases.html         → clases, test, crea tu personaje, comparador y razas
├── clase.html          → la página de cada clase (clase.html?c=mago)
├── talentos.html       → calculadora de talentos
├── mascotas.html       → mascotas de cazador con minimapa
├── pve-pvp.html        → mazmorras, campos de batalla, raids y calendario
├── oficios.html        → profesiones
├── meta.html           → meta PvE y PvP: varias tier lists juntas
├── juegos.html         → ruleta de personaje, nombres por raza y minijuego
├── comunidad.html      → foro, comentarios y noticias
├── directo.html        → tu personaje para poner en OBS (stream)
├── manifest.webmanifest y sw.js → para instalar la web como app
├── css/estilos.css     → el diseño de toda la web
├── css/talentos.css    → el diseño de la calculadora
├── js/layout.js        → menú, pestañas, buscador y pie (común a todas las páginas)
├── js/app.js           → lo de cada página
├── js/meta-datos.js    → las notas del meta (cambiar aquí con cada parche)
├── js/datos.js         → datos del juego (clases, razas, zonas, mascotas…)
├── js/talentos-datos.js → árboles de talentos
├── js/talentos-es.js   → traducción de los talentos al español
├── js/talentos.js      → la calculadora
├── data/noticias.json  → noticias (las escribe el script)
├── scripts/noticias.py → script que busca las noticias
└── .github/workflows/  → GitHub Action que lanza el script cada 3 horas
```

Para añadir una pestaña nueva a una página basta con poner `data-tab="Nombre"` y `data-icon="icono"` en su `<section>`.

## Cómo verla en tu ordenador

Descarga el repositorio y abre `index.html` con el navegador. No hace falta instalar nada.

## Cómo colaborar

¿Juegas una clase y sabes qué talentos van bien para subir de nivel? ¡Ayuda!

1. Haz un *fork* del repositorio.
2. Edita `js/datos.js` o `js/talentos-datos.js` con la información que quieras añadir o corregir. Las builds y el orden de habilidades van en `js/talentos-datos.js`.
3. Abre un *pull request* explicando qué has cambiado y de dónde sale el dato.

## Autora

Creado por **Bea García** · [@bgarciaa181](https://github.com/bgarciaa181)

## Aviso legal

Brújula de Azeroth es un fansite no oficial y sin ánimo de lucro. No está afiliado ni respaldado por Blizzard Entertainment.
World of Warcraft y Warcraft son marcas de Blizzard Entertainment.
