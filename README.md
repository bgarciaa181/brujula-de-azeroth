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
├── index.html        → la página principal
├── talentos.html     → la calculadora de talentos
├── css/estilos.css   → el diseño
├── css/talentos.css  → el diseño de la calculadora
├── js/datos.js       → clases, razas, profesiones, mascotas y calendario
├── js/talentos-datos.js → árboles de talentos, builds y orden de habilidades
├── js/talentos.js    → la calculadora
├── js/app.js         → filtros, fichas, comparador, noticias y cuenta atrás
├── data/noticias.json → noticias (las escribe el script)
├── scripts/noticias.py → script que busca las noticias
├── .github/workflows/ → GitHub Action que lanza el script cada 3 horas
└── README.md
```

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
