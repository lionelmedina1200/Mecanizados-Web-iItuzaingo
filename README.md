# Mecanizado Ituzaingó S.A. — Sitio Web

Sitio web institucional. HTML + CSS + JS puro. Sin dependencias, sin build steps.

## Estructura

```
mecanizado-ituzaingo/
├── index.html          → Homepage
├── mecanizado.html     → Mecanizado CNC
├── estampado.html      → Estampado
├── laser.html          → Corte Láser
├── calidad.html        → Calidad ISO
├── contacto.html       → Formulario de cotización
├── css/
│   ├── main.css        → Variables de color (paleta Acero & Naranja) y estilos globales
│   ├── navbar.css      → Navegación
│   ├── hero.css        → Sección hero de la homepage
│   ├── servicios.css   → Grilla de servicios
│   ├── contacto.css    → Formulario y datos de contacto
│   └── footer.css      → Pie de página
├── js/
│   ├── main.js         → Navbar scroll + menú mobile + animaciones fade-in
│   ├── formulario.js   → Validación y envío del formulario de contacto
│   └── animaciones.js  → Efectos opcionales (contadores animados)
└── assets/
    ├── images/
    │   ├── portfolio/  → Fotos de piezas fabricadas
    │   └── clientes/   → Logos de clientes
    ├── fonts/          → Tipografías locales (opcional)
    └── favicon.ico
```

## Cómo correr en local

1. Abrí la carpeta en VS Code
2. Instalá la extensión **Live Server**
3. Click derecho en `index.html` → **Open with Live Server**

No necesitás npm, node ni ninguna dependencia.

## Formulario de contacto

El formulario usa Formspree (gratis hasta 50 envíos/mes).

1. Creá cuenta en https://formspree.io
2. Creá un nuevo formulario
3. Reemplazá `REEMPLAZAR_CON_TU_ID` en `js/formulario.js` con tu ID

Alternativas gratuitas: Netlify Forms, Web3Forms.

## Deploy gratuito

### Netlify (recomendado)
1. Creá cuenta en https://netlify.com
2. Arrastrá la carpeta del proyecto a Netlify
3. Listo — te da una URL en segundos

### GitHub Pages
1. Subí el proyecto a un repo en GitHub
2. Settings → Pages → Branch: main → Save

## Paleta de colores

| Variable          | Valor     | Uso                        |
|-------------------|-----------|----------------------------|
| --color-bg        | #0f131c   | Fondo principal            |
| --color-surface   | #1A1F2E   | Tarjetas y navbar          |
| --color-surface-2 | #2C3347   | Inputs y fondos secundarios|
| --color-accent    | #F26522   | Naranja — botones y CTA    |
| --color-text      | #ffffff   | Texto principal            |
| --color-text-muted| #B0B8C1   | Texto secundario           |

Todos los colores están en `css/main.css` como variables CSS. Para cambiar la paleta, editá solo ese archivo.
