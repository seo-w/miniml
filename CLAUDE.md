# Proyecto: refactor del theme HubSpot "Minimal by Triario"

Este archivo es el punto de entrada para continuar este proyecto desde
cualquier equipo. Se carga automáticamente como contexto al abrir Claude Code,
tanto desde `minimal/` como desde la carpeta de arriba.

**Dónde vive este archivo (2026-08-11):** el archivo REAL es
`minimal/CLAUDE.md`, para que viaje con el theme al repo de git. En la carpeta
de arriba hay un **symlink** apuntando acá, no una copia — así hay una sola
fuente de verdad y no hay dos versiones que se desincronicen. No lo conviertas
en dos archivos.

**No se sube a HubSpot.** Hay un `.hsignore` en la raíz del proyecto y otro
dentro de `minimal/` (el CLI busca el archivo en el directorio desde el que se
corre el comando, así que hacen falta los dos para cubrir ambos casos).
Verificado subiendo el theme completo desde las dos ubicaciones: ni `CLAUDE.md`
ni `.hsignore` llegan al Design Manager.

## Continuar desde otro equipo u otra cuenta de Claude

Este archivo **no alcanza por sí solo**. Es la memoria de decisiones y
aprendizajes, no el proyecto. Lo que hace falta además, en orden de qué bloquea
más:

1. **Autenticar el CLI de HubSpot — esto es el bloqueador real.** La auth NO
   está en el repo ni puede estar: vive en `~/.hscli/config.yml` con un
   `personalAccessKey` por portal, que es secreto y por máquina. Sin esto no se
   puede subir ni leer nada, y ningún comando `hs` de estas notas funciona.
   En el equipo nuevo:
   - generar un **personal access key** en cada portal (HubSpot → Settings →
     Integrations → Private Apps / Personal Access Key)
   - correr `hs init` (o `hs auth`) y pegarlo
   - nombrar las cuentas **igual que acá** (`Parautos`, `demo-acount`), porque
     todos los comandos documentados usan `--account=<nombre>`
   - verificar con `hs accounts list`

   **Ojo con el nombre del sandbox (corregido 2026-08-11):** es `demo-acount`
   (así, con esa grafía), no `DemoAccount`. Y el CLI **no falla** con un
   `--account` que no existe: cae en silencio a la cuenta default, que hoy es
   **Topaz (491500)**, un portal que no tiene este theme. Pasó de verdad y el
   síntoma es confuso — el upload arranca bien y revienta con
   `Missing template: minimal/modules/helpers.html` más un montón de
   `Cannot find method <macro>_min`, como si los macros estuvieran rotos. No lo
   están: es que se está subiendo al portal equivocado. Verificar siempre la
   primera línea del upload, que dice a qué cuenta va.
2. **El código del theme.** Este archivo documenta el *por qué*, no el *qué*.
   Hace falta la carpeta `minimal/` completa — que es justamente para lo que
   está el repo de git.
3. **El respaldo pre-proyecto.** `minimal-backup-2026-08-09/` está **fuera** de
   `minimal/`, así que si el repo es la carpeta del theme, ese respaldo NO
   viaja. Es la única foto anterior a todos los cambios de este proyecto.
4. **Lo que vive en el portal de HubSpot y no en ningún archivo.** Nada de esto
   está en git:
   - La página `/test` del sandbox y sus **instancias publicadas** de módulos
     (`image_box`, `icon_box`, `slider`, `accordion`, `custom_section`,
     `card_grid`). Buena parte de la verificación de este proyecto depende de
     tenerlas; en un portal distinto hay que volver a armarlas.
   - Los **valores de la configuración del theme** (los 44 campos de fuente,
     colores de botón, etc.) se guardan por portal.
   - El pendiente del **menú móvil**: es contenido global del header, se edita
     en el editor de HubSpot, no en archivos.

No hace falta llevar `.claude/settings.local.json` (solo tiene un allowlist de
permisos con rutas de scratchpad ya viejas) ni `~/.claude/plans/`.

## Qué es esto

Theme de HubSpot CMS de la agencia Triario (`minimal/`), en **producción**
en al menos un portal real. Objetivo del proyecto: modernizarlo para
performance (PageSpeed/Core Web Vitals) y SEO técnico, eliminando jQuery y
librerías legacy pesadas (Slick, accordionjs, zooming, animate.css global),
sin romper el sitio en producción, dejándolo reutilizable como base para
otros clientes de la agencia.

**Ya hay git** (corregido 2026-08-11; antes esta sección decía que no). El
repo vive en la carpeta del theme, rama `master`, y tiene historial real desde
los últimos cambios. Además sigue existiendo `minimal-backup-2026-08-09/`
(copia completa del theme ANTES de cualquier cambio de este proyecto), que es
la única foto anterior a git y vive **fuera** de la carpeta del theme, así que
no viaja con el repo.

## Cuentas / entorno

- **HubSpot CLI** (`hs`) ya instalado y con dos cuentas configuradas:
  - **Parautos** (id `50104043`) — portal de **producción** real. No
    subir nada ahí sin confirmación explícita del usuario cada vez.
    **CORRECCIÓN (2026-08-10, verificado): el theme Minimal NO era lo que
    corre en Parautos.** El Design Manager de ese portal tenía `growth`
    (label "Growth"), `session` y `session-test` (las dos con label
    "Session"), y ninguna carpeta `minimal`. O sea que la frase "en
    producción en al menos un portal real" no aplica a Parautos — si aplica
    a algún portal, es a otro que no está configurado en este CLI.
    Consecuencia práctica: subir `minimal` ahí es **aditivo** (crea carpeta
    nueva, no sobreescribe Growth ni Session) y **no afecta el sitio en
    vivo** hasta que alguien cambie el theme de una plantilla a mano.
  - **demo-acount** (id `51581785`) — portal **sandbox** de pruebas. Todo este
    proyecto se validó ahí. **Ya no es la cuenta default del CLI**: hoy la
    default es Topaz (491500), así que el `--account` es obligatorio y hay que
    escribirlo bien (ver la advertencia de arriba).
- Subir cambios: `hs cms upload miniml minimal --account=demo-acount`
  (o el archivo específico en vez de la carpeta completa, más rápido).
  **La carpeta local se llama `miniml/` y la remota `minimal/`**, así que los
  dos argumentos de `upload` no son iguales: origen local primero, destino
  remoto después.
- Página de prueba real en el sandbox:
  `https://51581785.hs-sites.com/test` — tiene instancias de `image_box`,
  `icon_box`, `slider`, y `accordion` ya puestas y publicadas.
- **Cache**: para ver cambios sin caché de HubSpot, agregar
  `?hsCacheBuster=<número o timestamp>` a la URL (tip que dio el usuario).

## Estado: las 9 fases del plan están completas

El plan completo original queda en `~/.claude/plans/` de la sesión que lo
generó (no es portable entre equipos) — este resumen es la versión
persistente. Fases (todas verificadas en vivo contra el sandbox):

1. **Carga condicional**: `animate.css` y `zooming` ya no se cargan en
   toda página — solo cuando el módulo realmente los usa
   (`modules/helpers.html` macro `animation_min`, `modules/image.module`).
2. **Imágenes**: `width`/`height`/`alt` reales en todos los `<img>` del
   theme (helpers.html macro `image_min`, `post_macro.html`,
   `video_box.module`, `templates/blog-post.html`). Tope de ancho vía el
   mecanismo **nativo** de HubSpot (ver sección de aprendizajes abajo).
3. **SEO técnico**: `templates/partials/head.html` (nuevo, reemplaza el
   `<head>` duplicado de los layouts) con viewport, Open Graph, Twitter
   Card, hreflang. JSON-LD en `templates/partials/structured-data.html`
   (archivo aparte, fácil de borrar/desactivar — ver ese archivo para el
   toggle `theme.seo.enable_structured_data`).
4. **Código muerto**: borrado `js/init-accordion.js` (duplicado),
   `modules/css/divider.css` y `popup.css` (huérfanos verificados).
5. **Accesibilidad**: `alt`/`aria-label` reales en tarjetas de blog
   (`post_macro.html`, antes tenían `alt` en un `<a>`, que no hace nada).
6. **jQuery — consumidores aislados** → vanilla: `js/tabs.js`,
   `js/vertical-menu.js`, `custom_pupop.module`, `custom_section.module`,
   `video_popup.module`, modal de `video_box.module`. Menú móvil
   (`templates/partials/header.html` + `js/header.js`) ahora usa un
   `<button>` real con `aria-expanded`/`aria-controls` en vez de un
   `<span>` — **pendiente**: ver sección de pendientes abajo.
7. **Accordion** → vanilla con ARIA (`js/accordion.js`,
   `modules/accordion.module`). Comportamiento: un panel abierto a la vez,
   **sí se puede cerrar el abierto haciendo clic otra vez** (decisión
   explícita del usuario, distinto al accordionjs original que no dejaba).
8. **Slick → carrusel vanilla** (`js/carousel.js`, ver también la sección
   "Fixes del carrusel (2026-08-10)" más abajo,
   `modules/css/carousel.css`, macro `slider_min` en `modules/helpers.html`,
   más `modules/slider.module`). Afecta 6 módulos: `icon_box`, `counter`,
   `image_box`, `post`, `video_box`, `slider.module`. `library/slick/`
   borrado.
9. **jQuery removido del sitio** — `library/jquery/` borrado,
   `require_js` condicional quitado de `templates/partials/head.html`.
   Confirmado: `typeof window.$ === "undefined"` en el sitio real.

Extra (no estaba en el plan original, surgió durante la Fase 2): se agregó
un toggle de **lazy-load opcional para fondos** (`js/lazy-background.js`),
usado por `custom_section.module` (campo `lazy_load_background`) — útil
para secciones con imagen de fondo bien abajo en la página.

## Aprendizajes clave (para no re-descubrirlos ni re-debatirlos)

- **HubSpot ya convierte a WebP automáticamente** y genera `srcset`
  responsive, pero SOLO si el `<img>` tiene atributos `width`/`height`
  (documentado por HubSpot). Verificado en vivo con `fetch()` +
  `Accept: image/webp` contra el CDN real.
- **El `sizes` que genera HubSpot NO se puede sobreescribir** — asume que
  la imagen ocupa todo su `width`, no sabe si está en una grilla de 2-3
  columnas. Probado directamente: cualquier `sizes` propio que se ponga en
  el `<img>` es ignorado. Mitigación: al configurar el tope de ancho de
  una imagen, pensar en el ancho REAL en pantalla (contenedor ÷ columnas),
  no en un número grande "por si acaso".
- **El campo de imagen de HubSpot ya tiene un tope de ancho nativo** —
  `size_type: "auto_custom_max"` + `image_field.max_width`/`.max_height`,
  activado cuando el editor usa el manejador de recorte en el selector de
  imagen (no hay que agregar un campo custom para esto — se intentó y se
  revirtió, ver `modules/helpers.html` macro `image_min`).
- **HubSpot minifica el CSS del theme automáticamente al servirlo** (quita
  comentarios, funde selectores) — no vale la pena minificar el CSS fuente
  a mano, ya lo hace HubSpot en su pipeline. Verificado comparando la
  fuente local de `header.css` (con comentarios) contra lo que responde
  el CDN real (sin comentarios).
- **`resize_image_url()` sí es compatible con el WebP automático** —
  verificado pidiendo un ancho ad-hoc al mismo endpoint.
- **AVIF no está disponible de forma confiable en HubSpot todavía** — no
  es algo que el theme pueda forzar.
- **Instancias de módulo ya publicadas NO heredan defaults de campos
  nuevos** — si agregas un campo a `fields.json`, el contenido que ya
  estaba puesto en una página sigue con ese campo vacío hasta que alguien
  lo edite manualmente en el editor de esa página (no en Design Manager,
  que es el default del módulo, no la instancia).
- **Scripts inline que llaman una función de un archivo externo cargado
  aparte necesitan `document.addEventListener('DOMContentLoaded', ...)`**
  — sin esto hay una carrera real entre el script inline y el `<script
  src>` externo, causando `ReferenceError: X is not defined` de forma
  intermitente (pasó con `initCarousel` y podía pasar con
  `lazyLoadBackground`). Ya corregido en ambos casos.
- **Herramienta de navegador de este entorno**: el tool `navigate` puede
  colgarse. Si pasa, usar `javascript_tool` con
  `window.location.href = 'URL?hsCacheBuster=' + Date.now()` como
  alternativa, y `fetch()` desde una pestaña que ya esté en el dominio
  correcto para leer HTML crudo sin depender de `navigate`.
- **HubL corre sobre Java y NO tiene `.startswith()`** — da
  `Cannot find method startswith with 1 parameters in class java.lang.String`.
  Para "empieza por http" usar `'://' in url`. En general, no asumir que los
  métodos de string de Python existen en HubL.
- **El filtro `split` de HubL DESCARTA los tokens vacíos.**
  `'https://host/f.woff2'|split('/')` devuelve `['https:','host','f.woff2']`
  (sin el vacío del `//`), así que el host queda en el índice **1**, no en el
  2 como sería en Python. Para sacar el origen de una URL, partir por `'://'`
  y no por `'/'`.
- **La validación de plantilla al subir sí ejecuta el cuerpo de los loops** —
  un `{% for %}` sobre una lista vacía pasa la validación y el mismo archivo
  con la lista llena puede fallar. Si se agrega lógica dentro de un loop que
  normalmente está vacío, hay que probarla con datos de verdad y después
  volver a vaciar.
- **HubSpot NO rompe `:has()`** — su pipeline de CSS lo emite intacto y lo
  escopa por instancia igual que cualquier otro selector. Verificado en
  vivo: `#hs_cos_wrapper_header_poup-module-2 .icons__anchor:has(>.icons__text)`.
  O sea que sí se puede usar CSS moderno en vez de calcular banderas en
  HubL, que además es más frágil (ver el punto de `{% set %}` abajo).
- **`{% set %}` dentro de un `{% for %}` NO se ve afuera del loop** (scoping
  de Jinja, y HubL hereda esto). El workaround del theme es mutar una lista
  con `{% do lista.append(...) %}` / `.insert(...)`. Pero antes de hacer eso,
  ver si CSS puro resuelve el caso — casi siempre es menos código y más
  robusto.
- **`font_min` emite `line-height` en `%`** (no px) y con especificidad
  `.clase` a secas. Si el CSS base tiene una regla más específica sobre el
  mismo elemento (ej. `.icons__anchor>span{line-height:0}` para el span del
  icono), esa gana y el `line-height` del campo se ignora. Hay que emitir
  una regla aparte con especificidad mayor, en `%` para no cambiar la unidad.
- **`gap` le gana a `margin-right`** cuando un elemento puede ir en varias
  direcciones (icono a la izq/der/arriba/abajo del texto): un solo valor
  cubre las 4, y no deja espacio sobrante cuando el vecino está vacío.
- **Los archivos `.js`/`.css` del theme se sirven con `max-age=1209600`
  (14 días)** desde una URL con hash. `?hsCacheBuster=` en la URL de la
  página SOLO refresca el HTML, no los assets referenciados aparte. Para
  ver un cambio de JS en el navegador hay que forzar recarga
  (`Cmd+Shift+R`) o incógnito. Es la razón por la que un fix ya subido
  puede parecer "que sigue igual".
- **En este theme el scroller vertical de la página es `<body>`**
  (`body{overflow-y:auto}`, `html{overflow-y:visible}`), no el viewport.
  Por eso `window.scrollY` se queda en `0` y medirlo para detectar
  movimiento vertical da un falso negativo. Medir `document.body.scrollTop`.
- **El navegador automatizado de este entorno no ejecuta scroll vertical
  programático** — ni `window.scrollTo`, ni `body.scrollTop`, ni
  `documentElement.scrollTop` se mueven, y el autoplay del carrusel se
  pausa solo porque el cursor virtual queda encima del contenedor
  (`mouseenter` → `stop()`). Conclusión práctica: **el salto vertical del
  carrusel no se puede verificar desde acá**, hay que confirmarlo a ojo en
  un navegador normal. Lo que sí se puede verificar desde acá: el JS
  servido por el CDN (con `curl` + `grep`), y la cantidad de dots /
  `position` / anchos reales de cada instancia con `javascript_tool`
  (ojo: hay que tomar un `screenshot` primero, o el viewport reporta 0x0 y
  todas las medidas salen en 0).

## Fixes del carrusel (2026-08-10)

Reporte del usuario: "los módulos con slide hacen que la pantalla se mueva
de arriba a abajo" + mejorar los dots. Verificado y cerrado por el usuario
("parece que ya"). Los 6 módulos con slide (`icon_box`, `counter`,
`image_box`, `post`, `video_box`, `slider.module`) comparten
`initCarousel`, así que **era un solo bug, no seis**.

1. **Salto vertical de la página — causa raíz**: `scrollToSlide()` usaba
   `slides[index].scrollIntoView({block:'nearest'})`. Ese método evalúa
   **todos** los ancestros con scroll, incluida la página, así que movía el
   scroll vertical además del horizontal. Ahora usa
   `track.scrollTo({left: slides[index].offsetLeft, behavior:'smooth'})`,
   que solo puede mover el track. **No volver a `scrollIntoView` acá.**
   (Un intento anterior de este mismo cambio se había revertido creyendo
   que no funcionaba; el problema real era el caché de 14 días del `.js`,
   ver la sección de aprendizajes.)
2. **Aislamiento entre instancias**: no había bug. Cada llamada a
   `initCarousel` ya tiene su propio closure (`track`, `slides`, `dots`,
   `currentIndex` son locales). Se veía igual en todos los módulos porque
   compartían la línea rota, no porque se interfirieran.
3. **Dots por páginas reales, no uno por slide**: `buildDots()` cuenta
   `pages = slides <= visibles ? 0 : ceil((slides - visibles) / scrollBy) + 1`.
   Si todo cabe en pantalla → **0 dots**. `getVisibleCount()` mide el ancho
   real de track/slide en vez de duplicar los breakpoints CSS que genera
   `slider_min`. Se reconstruye en `resize`. Verificado en vivo en `/test`:
   `icon_box` 3 slides / 3 visibles → 0 dots; `image_box` 3/3 → 0 dots;
   `slider` hero 3 slides / 1 visible → 3 dots.
4. **`slider.module` emitía dos atributos `class`** en el mismo `<div>`:
   `class="carousel"` literal más el que genera `helper.advance_min(...)`.
   La clase `carousel` se perdía, así que `.carousel{position:relative}`
   nunca aplicaba y las flechas (`position:absolute`) se posicionaban
   contra un ancestro lejano. Fix: `carousel` va dentro de
   `classes_module` (los `insert()` corrieron un índice) y el `<div>` ya no
   lleva `class` propio. **`advance_min` siempre emite su propio atributo
   `class` — nunca poner otro `class` en el mismo elemento.**
5. **`IntersectionObserver` reemplazado por un listener de `scroll`**:
   marcaba `currentIndex` con *cualquier* slide visible al 50%, así que con
   3 visibles se sobreescribían entre sí y el índice quedaba impredecible
   (flechas y autoplay saltaban desde una posición equivocada). El listener
   calcula el slide más cercano a `track.scrollLeft` — menos código y
   correcto, y sigue funcionando con swipe manual en móvil.

Nota: `autoplay` se pausa en `mouseenter`/`focusin` (comportamiento
intencional). Con `infinite: false` el autoplay se queda pegado en el
último slide — comportamiento preexistente, no se tocó.

## Texto junto al icono, con posición (2026-08-10)

Pedido: poder poner un texto y elegir si va arriba, abajo, izquierda o
derecha del icono. **Son dos módulos distintos, no uno**:

- **`icon_list.module`** ya tenía icono + texto por ítem (con estilos de
  fuente, hover y enlace), solo fijo a la izquierda. Se le agregó el campo
  **Estilos → item → Icon → Text position**.
- **`icons.module`** (la fila de iconos tipo redes sociales) no tenía texto.
  Se le agregó: campo **Text** por ítem, y a nivel módulo en **Estilos →
  Icons**: **Text position**, **Text gap** y **Text** (grupo de fuente
  completo, copiado del `title` de `icon_list` en vez de inventarlo).

Decisiones de implementación (para no re-debatirlas):

1. **El icono se mueve con `order: 1`, NO con `flex-direction: row-reverse`.**
   Con `row-reverse` habría que tocar `justify-content`, que ya lo controla
   el campo *Alignment* del `item_box` en `icon_list` (y es
   `justify-content:center` fijo en el CSS base de `icons`). Usar `order`
   deja ese campo intacto. Mismo patrón en los dos módulos.
2. **`gap` en vez de `margin-right`** para el espacio icono↔texto: un solo
   valor sirve para las 4 direcciones. En `icon_list` reemplazó los
   `margin-right` de `.icon-list__icon`/`.icon-list__image`
   (`modules/css/icon_list.css` y el override por instancia). El default
   del theme sigue en `10px`, así que se ve idéntico a antes.
3. **`'right'` no emite CSS** en ninguno de los dos — es el comportamiento
   histórico. Las instancias ya publicadas tienen el campo vacío y se
   siguen viendo igual (ver el aprendizaje de que las instancias
   publicadas no heredan defaults de campos nuevos).
4. **En `icons.module` el cuadrado fijo se suelta con `:has()`, no con una
   bandera de HubL.** `.icons__anchor` es un cuadrado
   (`width`/`height` = `icon_size_content`) que solo tiene sentido con el
   icono solo. Condicionarlo a `text_position` estaba mal: el default
   `'right'` habría soltado el cuadrado en instancias **nuevas sin texto**,
   rompiendo el círculo del icono. Se usa
   `.icons__anchor:has(>.icons__text)`, que además **funciona con ítems
   mezclados** (unos con texto, otros sin) — cosa que una bandera a nivel
   módulo no puede hacer. Si algún día hay que soportar navegadores sin
   `:has()` (Firefox <121), el fallback es texto apretado, no roto.

## Auditoría de rendimiento + fixes (2026-08-10)

Línea base medida contra `/test` (no estimada): TTFB 0.14s, HTML 97KB, CSS
19.6KB brotli / **183KB crudo**, JS del theme 2.8KB brotli, terceros de
HubSpot ~11KB, imágenes 380KB **todas ya en WebP**, 6 `@font-face` todas con
`font-display:swap`. HTTP/2 + brotli activos. **El peso no es el problema de
este theme** — las fases 1–9 lo dejaron bien. Los problemas eran de *cuándo*
pasan las cosas.

Aplicado y verificado en el CDN real:

1. **CLS de los dots del carrusel** — `buildDots()` los inyecta después del
   primer paint, así que empujaban ~10px todo lo de abajo, en los 6 módulos
   con slide. Fix: `min-height:10px` en `.carousel__dots`
   (`modules/css/carousel.css`), más un `min-height` por instancia con el
   valor real cuando el módulo configura `dots.size` (macro `slider_min`).
   **Contrapartida aceptada**: cuando no hacen falta dots quedan 10px
   vacíos. Se prefirió eso al salto.
2. **`scroll` del track: `{passive:true}` + throttle con `requestAnimationFrame`**
   — antes el loop O(n) sobre los slides y el toggle de clases corrían en
   cada evento de scroll (~cada frame en scroll suave y swipe).
3. **`resize` con debounce de 150ms** — antes cada evento reconstruía todo el
   DOM de los dots y leía `offsetWidth`/`clientWidth` (layout forzado).
   `resize` dispara en ráfaga al arrastrar la ventana y al rotar el móvil.
4. **`animate.css` con `{ async: true }`** (`modules/helpers.html`, macro
   `animation_min`) — 72KB crudos de keyframes fuera del camino crítico. Es
   seguro porque ningún estilo de layout depende de ese archivo y la
   animación la dispara `animationMin()` por JS. **Sin verificar en vivo**:
   `/test` no tiene módulos con animación, así que ahí no se carga.

No tocado a propósito: **`main.css` son 167KB crudos y ~137KB de eso es
Bootstrap** (`_bootstrap-utilities.css` define 1138 clases y solo **7** se
usan en el theme; `_bootstrap-grid.css` 1189 definidas y **11** usadas).
Comprimido son solo 14.7KB, así que el ahorro en bytes es chico y el riesgo
real: **un editor puede escribir `mt-3` o `col-md-6` en el campo *Classes* de
cualquier módulo o dentro de un rich text**, y eso no aparece en el código
fuente. Es el mismo error que ya se cometió con `_layout.css` en la auditoría
inicial. Para decidirlo hay que revisar páginas publicadas reales.

## Familias de fuente: 3 → 2 (2026-08-10)

`Work Sans` se cargaba entera (2 archivos) para **dos campos**:
`form.button.default.font.font` y `form.button.hover.font.font`. Su default
pasó a **Roboto**, porque los otros 8 defaults de fuente del grupo `form`
(título, labels, campos, placeholder, legal, errores, choice/select) ya eran
Roboto — así el formulario queda coherente consigo mismo.

Solo se cambió la familia; tamaño (16px), color (`#fff`) y peso (300) quedaron
igual. Verificado en vivo: la página pasó de **6 `@font-face` a 4** (Roboto y
Spartan, 400 y 700 cada una) y de 6 descargas `.woff2` a 4. `Work Sans` ya no
aparece en ninguna parte del theme.

**Sigue siendo un default, no algo fijo**: cualquier cliente puede elegir otra
fuente para el botón desde la configuración del theme y se usa la que elija.
Los sitios ya publicados que tengan un valor guardado en ese campo conservan
el suyo. Ojo con esto último al medir: en el sandbox el cambio se vio de
inmediato porque esos campos no tenían valor guardado.

Nota sobre cómo cuenta HubSpot: cada peso declara `src` con `.woff` y `.woff2`,
así que en el HTML aparecen 8 URLs pero el navegador solo baja los `.woff2`.
Para medir descargas reales hay que contar `.woff2`, no las URLs.

## Precarga de fuentes (`templates/partials/font-preload.html`, 2026-08-10)

Objetivo: que sirva para Google Fonts, para fuentes de terceros y para
fuentes subidas al File Manager, en un theme reutilizable por cliente.

**Es un archivo y no un campo del theme porque HubSpot no lo permite**: el
`fields.json` de un theme solo admite **Boolean, Border, Choice, Color, Font,
Image, Number, Spacing**. Verificado subiendo: `'text' fields are not
supported in theme fields.json`, e igual con `'url'`. Mismo motivo por el que
`structured-data.html` tiene el nombre de empresa hardcodeado.

Se edita la lista `fonts` de ese archivo. **Vacía por defecto = no emite
nada**, que es el estado seguro y con el que quedó.

Hallazgos que definieron el diseño (medidos, no asumidos):

- **HubSpot auto-hospeda las Google Fonts en el mismo dominio**
  (`/_hcms/googlefonts/<Familia>/<peso>.woff2`), no en `fonts.gstatic.com`.
  O sea que **`preconnect` no sirve para Google Fonts** acá.
- **Los `@font-face` de Google los emite HubSpot inline en el `<head>`**
  (byte 11.188 de 97KB, antes de `</head>`), así que el navegador ya los
  descubre temprano y **el preload gana poco** en ese caso.
- **Para una fuente propietaria el preload rinde MUCHO más**, al revés de lo
  que parece: iría con `@font-face` en `css/_custom.css`, que es una hoja
  **externa**, así que la cadena es HTML → CSS → fuente, en serie. El
  preload la rompe.
- **No derivar la URL de los campos de fuente del theme.** Hay **44 campos
  de fuente** independientes; construir `/_hcms/googlefonts/{{font}}/...` se
  rompe con `font_set` CUSTOM, con fuentes websafe (no existe el `.woff2` →
  preload a un 404) y con pesos distintos de regular/700. Y con 44 campos no
  se sabe cuál es la fuente del LCP: depende de qué módulo caiga como
  elemento LCP en cada página.
- **`crossorigin` es obligatorio en un preload de fuente incluso en el mismo
  dominio** — las fuentes siempre se piden en modo CORS y sin ese atributo el
  navegador **descarga el archivo dos veces**. Es el error clásico.
- El `type` solo se emite para `.woff2`; un `type` que no coincida hace que
  el navegador ignore el preload.

## ID y clases en `custom_section.module` (2026-08-10)

Se le agregó el grupo **Advance** (campos `id_module` y `classes`), copiado
verbatim del que ya tienen los otros **26 módulos** del theme.

**Pero este módulo es la excepción y no usa `helper.advance_min()`.** No
renderiza wrapper propio: emite un `<span class="reference-module-{{name}}">`
como marcador y por JS le agrega la clase al **ancestro dnd** que corresponda
según el campo *Type section* (`.dnd-section`, `.dnd-section>.row-fluid` o
`.dnd-column`). El id y las clases tienen que ir a ese mismo elemento, así que
se aplican dentro de ese script, no en un atributo del template.

- **`className += ' clase'` en vez de `classList.add()`**: el campo es texto
  libre y el editor puede escribir varias clases separadas por espacio en un
  solo ítem. `classList.add()` lanza `InvalidCharacterError` con espacios,
  `className` no.
- **Limitación real: los enlaces ancla (`#mi-id`) NO funcionan en la primera
  carga.** El navegador intenta saltar al ancla antes de que corra el JS y el
  id todavía no existe. Si el caso de uso es un menú que salta a secciones,
  esto no sirve — el id tendría que venir en el HTML del servidor, y ese HTML
  lo genera HubSpot para el área dnd, no este módulo. Haría falta otro enfoque.
- Las clases llegan después del primer paint, así que si traen estilos
  visuales puede haber parpadeo. No es nuevo: el módulo ya funciona así para
  el fondo que aplica hoy.

Validación del loop con datos reales (por el aprendizaje de que la validación
de subida sí ejecuta el cuerpo de los `{% for %}`): se forzó
`classes_module = ['prueba-uno', 'prueba-dos tres']` — incluyendo un ítem con
espacio —, se subió para que HubSpot lo compilara, pasó, y se volvió a vaciar.
Sin restos de la prueba en el archivo (verificado con `grep`).

**Sin verificar a ojo**: no hay instancia de `custom_section` en `/test`, así
que no se vio el render final.

## Párrafo por ítem en `icon_list.module` (2026-08-11)

Pedido: un párrafo debajo de cada título. Campo **Description** por ítem +
grupo **Estilos → item → Description**.

Se copió el idioma de `icon_box`, que ya resolvía el mismo patrón
(icono + título + descripción), con dos diferencias deliberadas:

- **Default vacío, no lorem ipsum.** `icon_box` trae texto de relleno; acá se
  dejó `""` para que las instancias nuevas no aparezcan con placeholder.
- **Se copió el grupo `description` de `icon_box` y NO el `title` de
  `icon_list`**, porque el de `icon_box` no incluye `hover` — un párrafo no lo
  necesita. Trae `font`, `line_height`, `letter_spacing`, `margin_bottom`.
- Se agregó `margin_bottom` al grupo `title` de `icon_list` (no lo tenía;
  el de `icon_box` sí): es lo que controla el espacio título↔párrafo.
  `font_min` ya lo soporta, así que no hizo falta código nuevo.

**Ampliación tipográfica (2026-08-11).** El grupo quedó con los **7** campos que
`font_min` sabe consumir: `font`, `font_size_mobile`, `line_height`,
`letter_spacing`, `font_weight`, `text_color`, `margin_bottom`. Los tres
últimos que se agregaron (`font_size_mobile`, `font_weight`, `text_color`) se
copiaron verbatim de `headline`, `horizontal_menu` y `accordion`
respectivamente. **Fue solo `fields.json`, cero código**: la llamada
`font_min(items_style.description, 'icon-list__description')` ya existía y el
macro lee los 7 campos.

Dos cosas que conviene tener claras de este grupo:

- **Familia, tamaño y color ya venían en el campo `font`** (el tipo `font` de
  HubSpot incluye los tres, más bold/italic/underline). `text_color` y
  `font_weight` son overrides explícitos que se emiten *después* de
  `field.font.css` dentro de la misma regla, así que ganan sobre lo que traiga
  el campo `font`. No son duplicados: son la forma de pisar un valor sin tocar
  el selector de fuente.
- **`font_size_mobile` no va en la misma regla**: `font_min` lo emite en un
  `media_min()` aparte (`max-width` del breakpoint móvil del theme).

**El párrafo necesitó un contenedor nuevo, `.icon-list__content`.**
`.icon-list__item` es flex en fila (icono | texto), así que un `<p>` suelto
caía *al lado* del título, no debajo. Antes de envolver se verificó que
**ningún selector del theme usa hijo directo sobre `.icon-list__anchor`** — por
eso envolver no rompió las instancias publicadas. El `gap` del ítem sigue
quedando entre el icono y este bloque, y el *Text position* sigue funcionando
porque `order`/`flex-direction` operan sobre el ítem, no sobre el texto.

**`.icon-list__description{margin:0}` en el CSS base**: el `<p>` trae
`margin: 1em` del navegador y aparecería un espacio que ningún campo del editor
explica. Consecuencia aceptada: por defecto título y párrafo quedan pegados y
hay que usar el `margin bottom` del título para separarlos. Se prefirió eso a
un número mágico en el CSS base.

Verificado en vivo en `/test` (sí hay una instancia de `icon_list` ahí): los 3
ítems siguen renderizando, el wrapper aparece 3 veces con el `<a>` del título
dentro, y 0 párrafos — correcto, la instancia publicada tiene el campo nuevo
vacío. Subido a Parautos y verificado leyendo de vuelta.

## Background size/position detallado en `custom_section` (2026-08-11)

Subgrupo **Background size y position (detallado)** en `styles.default` y
`styles.mobile`, con macro local `background_detail_min` en el propio
`module.html` (se usa 2 veces y no lo consume otro módulo, por eso no está en
`helpers.html`).

**Lo que NO se construyó, porque ya era nativo** (verificado antes de escribir
código):

- **Presets de size y position por breakpoint ya existían.** El campo es de
  tipo `backgroundimage`, no `image`, y la doc de HubSpot confirma que trae
  subcampos de background position y background size; `.css` los emite. Como
  `default` y `mobile` tienen cada uno su campo, ya se podía poner `cover` en
  desktop y `contain` en móvil.
- **El toggle "mostrar u ocultar fondo" no hacía falta.** `media_desktop_min()`
  es `min-width` y `media_min()` es `max-width`, así que los fondos ya son
  independientes por breakpoint: dejar vacía la imagen de móvil ya es "sin
  fondo en móvil", y el navegador **no descarga** la imagen de desktop en
  móvil. Un booleano habría duplicado eso.

**Lo que sí faltaba**: valores exactos. El campo nativo solo da presets
(`cover`/`contain`/`auto` y una grilla de 9 posiciones), así que
`background-size: 300px 200px` o `background-position: right 30px bottom 10px`
eran imposibles.

**`!important` es deliberado acá.** Este módulo estiliza el elemento dnd, donde
compite con los "background layers" nativos de las secciones dnd de HubSpot,
que **sí usan `!important`** (medido en vivo:
`.main_drop_area-row-0-background-layers{background-position:left top !important}`).
Sin `!important` los valores exactos perderían justo cuando ya hay un fondo
configurado, que es cuando el editor los necesita.

### Bug corregido el mismo día: la distancia se descartaba en silencio

La primera versión exigía un borde concreto en **ambos** ejes
(`position_x in ['left','right'] and position_y in ['top','bottom']`) para
aceptar distancias. Con `position_y = 'center'` — configuración perfectamente
razonable — caía a la rama de palabras clave y **descartaba la distancia sin
avisar**. Reportado como "la distancia horizontal no se aplica".

La causa era una lectura de más de la spec: la tercera forma de `<bg-position>`
es `[center | [left|right] <len>?] && [center | [top|bottom] <len>?]`, que **sí
admite** mezclar un eje con distancia y el otro en `center`. O sea que
`background-position: right 30px center` es válido y no hacía falta la
restricción. Ahora cada eje se resuelve por separado:

- borde concreto → se usa con su distancia
- sin definir → se asume el borde por defecto de CSS (`left`/`top`), así la
  distancia que escribió el editor sí se aplica
- `center` explícito → gana `center` y esa distancia se ignora (centrar y
  desplazar desde un borde son contradictorios y CSS no lo permite)

Verificado en vivo emitiendo las tres rutas: `right 30px center`,
`right 30px bottom 10px`, y `left 25px top 0px`.

**Técnica que resolvió el diagnóstico y conviene reusar**: los valores de una
instancia no se pueden leer desde el CLI, así que se inyectó temporalmente un
comentario CSS con los campos crudos
(`/* debug {{class}}: pos_x=[{{position_x}}] off_x=[{{offset_x}}] ... */`) y se
leyó del HTML servido. Ahí se vio que `off_x` llegaba **vacío** — el campo no
se había guardado —, lo cual separó "dato faltante" de "bug de código" en vez
de seguir adivinando. Debug y pruebas removidos y verificado con `grep` que no
quedaron restos, local y en vivo.

## Módulo nuevo: `card_grid.module` (masonry de tarjetas, 2026-08-11)

Pedido: reproducir el mosaico de "Soluciones especializadas según tu industria"
de `https://parautos.com.mx/`, flexible y reutilizable.

**Lo que hace el original** (es WordPress + Divi, se leyó su CSS real): todas
las tarjetas iguales — `padding: 250px 20px 20px`, `border-radius: 20px`,
`overflow: hidden`, overlay con `::after` + `rgba(0,0,0,0.5)`, título con
`z-index: 2` y fuente Oswald 34px. **El escalonado no son offsets ni masonry
real**: es el mismo `padding-top` en todas más títulos de distinto número de
líneas, en 3 columnas de 2 tarjetas cada una.

### El layout costó tres intentos — no repetirlos

1. **multicol (`columns: 3`)** — parecía ideal porque las tarjetas fluyen hacia
   abajo y las columnas se escalonan solas. **Falla con cualquier cantidad que
   no sea múltiplo de las columnas**: no reparte en round-robin, llena cada
   columna hasta una altura objetivo. Medido con 7 tarjetas: **3+3+1**, con la
   tercera columna casi vacía.
2. **grid normal** — reparte parejo (3+2+2) pero **alinea las filas**: si una
   tarjeta es más alta, sus vecinas dejan hueco debajo y la fila siguiente
   arranca después de la más alta. No es lo que se pidió.
3. **grid con row spans (el que quedó)** — masonry de verdad:
   `grid-auto-rows: 1px`, cada ítem con `grid-row: span (alto + gap)`,
   `row-gap: 0` (el espacio lo aporta el sobrante del span) y
   `grid-auto-flow: row dense` para que las cortas rellenen huecos.
   Verificado en vivo: donde la de arriba mide 250 la siguiente arranca en 283;
   donde mide 320, en 353.

**El span solo se puede calcular porque los altos son valores explícitos del
editor.** Por eso en modo masonry el alto es `height` fijo y NO `padding-top`:
si dependiera del largo del título no habría forma de saberlo en el servidor.
El modo `columns` (multicol) quedó como alternativa y ahí sí el alto es
`padding-top`, para que la tarjeta crezca con el texto.

`grid-template-rows: masonry` haría todo esto en una línea pero **no tiene
soporte en navegadores todavía**. Está marcado con `ponytail:` en el código.

### Bug encontrado al medir: tarjetas de 270px en vez de 250

El `padding-top: 250px` del CSS base peleaba con el `height` del modo masonry:
con `box-sizing: border-box` **una caja no puede ser más baja que la suma de sus
paddings**, así que quedaba en 250+20=270 y los spans no cuadraban. El CSS base
bajó a `padding: 20px` y el alto grande lo emite solo el modo que lo necesita.

### Decisiones de implementación

- **La imagen va como `<img>` con `object-fit`, NO como `background-image`.**
  Un `background-image` de CSS **no recibe nada** del pipeline de HubSpot: sin
  `srcset`, sin WebP automático, sin `width`/`height` y sin `loading="lazy"`.
  Pasando por `helper.image_min` se lleva todo. `card.image_size` /
  `image_position` se mapean a `object-fit` / `object-position`.
  Efecto colateral: desapareció el `{% for %}` que emitía un `background-image`
  por tarjeta.
- **Sin sufijo `--{{name}}` en las clases**: `{% scope_css %}` ya prefija con
  `#hs_cos_wrapper_<name>`; agregarlo sería escopar dos veces. Las clases
  `--{{loop.index}}` sí se usan, para el alto/span por ítem, y van en el `<li>`
  porque el `<li>` es el grid item.
- **`helper.anchor_min` y no un `<a>` a mano.** Una versión previa hecha a mano
  perdía el `rel="nofollow"` cuando además se abría en pestaña nueva, e ignoraba
  `mailto:` para enlaces de tipo EMAIL_ADDRESS.
- **`alt=""` a propósito**: la imagen es decorativa y el título ya dice de qué
  es la tarjeta; un alt que lo repita se lee dos veces en un lector de pantalla.
  Si el editor pone un alt en el campo, `image_min` usa el suyo.

### Limitaciones aceptadas

- **El título se recorta si no cabe** en el alto fijo (modo masonry). Es el
  precio de que el span coincida con el alto real.
- **`dense` puede adelantar una tarjeta** para tapar un hueco, así que el orden
  visual no siempre es el orden de los ítems. Es inherente a cualquier masonry.
- En modo `columns` el orden de lectura es por columna, no de lado a lado.

## `image_box.module`: imagen, botones múltiples e iconos (2026-08-11)

Siete cambios pedidos de corrido. Lo que hay que saber de cada uno:

### 1. `cover` / `contain` + color de fondo (grupo `styles.image`)

Campos `fit`, `height`, `height_mobile`, `background_color`.

- **`object-fit` no hace nada sin un alto definido**: sin alto la imagen usa su
  tamaño natural y no hay nada que recortar ni encajar. Está dicho en el texto
  de ayuda del campo.
- **El color de fondo va sobre el propio `<img>`, no en un div envolvente.** Con
  `contain` el aire que queda dentro de la caja de la imagen lo pinta el
  `background-color` del `<img>`. Un wrapper habría sido un elemento de más para
  el mismo resultado. También se ve detrás de PNG con transparencia.

### 2. Botones: de uno a varios, y el contenedor vacío eliminado

`items.button` (uno) pasó a `items.buttons` (repetido), copiando el idioma que
ya usaba `slider.module`.

**Bug que existía desde antes**: el contenedor se emitía con
`{% if button_anchor %}`, y `button_anchor` es un **objeto** — siempre truthy,
aunque el enlace esté vacío. O sea que el `<div class="button-group">` salía en
TODAS las tarjetas siempre. Ahora se arma una lista `valid_buttons` (texto Y
enlace) y el contenedor solo existe si hay al menos uno. Verificado en vivo: 0
divs de botones en una instancia sin botones configurados.

**Ojo con el cambio de nombre del campo**: una instancia publicada con el viejo
`button` pierde ese dato y hay que volver a ponerlo en el editor. Hay una guarda
`item.buttons is truthy ? ... : []` porque si no, el `for` iteraría sobre algo
indefinido en esas instancias. Fue seguro hacerlo ahora porque el theme está
**inactivo** en Parautos; con el theme en vivo, un cambio de forma de campo pide
más cuidado.

### 3. Apariencia por botón, como OVERRIDE (no como campo obligatorio)

El theme ya genera **16 apariencias** (`primary`, `secondary`, los dos `-link`,
`light`, `dark`, `one`…`ten`, cada una con hover) y 5 tamaños desde
`modules/css/button.css` + ajustes del theme. El vocabulario ya existía; solo
faltaba elegirlo por botón, así que **no hay CSS nuevo**.

Se hizo con una opción `(usar el del módulo)` por defecto, en vez de copiar tal
cual el campo obligatorio de `slider.module`: así las instancias existentes no
cambian, no hay que configurar cada botón, y solo se toca el que se quiera
distinto (el caso típico: un primario y un secundario).

### 4. Icono por botón: del set o propio

Grupo `icon` por botón con `custom_icon` (toggle), `icon` (set de HubSpot),
`image` (imagen propia) y `align` (izq/der del texto), más
`styles.button.icon_size` a nivel módulo (vacío = 15px).

- Los campos `icon` e `image` se muestran **excluyentes** con las reglas de
  visibilidad del theme. El `id` del toggle es `image-box-button-custom-icon` y
  no `custom-icon`, para no cruzarse con el de `button.module`.
- **`button.module` tiene estos mismos campos pero su template NUNCA renderiza
  la variante de imagen** — son campos muertos ahí. Acá sí están conectados.
- La imagen propia pasa por `helper.image_min`, así que se lleva srcset, WebP,
  `width`/`height` y `loading`. Necesitó CSS propio
  (`.image-box__button-icon`: `width` del icon_size + `height:auto`) porque si no
  sale del tamaño del archivo subido; el icono del set no necesita nada, el CSS
  base ya lo dimensiona con `.button .hs_cos_wrapper_type_icon`.
- **El HTML del icono se arma en un `{% set %}` y se decide con `|trim`.** Esto
  resuelve el caso raro de "toggle encendido pero sin imagen subida": no queda un
  envoltorio vacío, cae a botón de texto plano. Verificado forzando los 6 casos
  (set izq/der, propio izq/der, propio sin imagen, sin nada).

### 5. Acomodo de los botones

`styles.button.direction` (fila con wrap / columna) + `gap`. Emite `display:flex`
sobre una clase propia `.image-box__buttons` y **no toca el `.button-group`** del
CSS base, que es `display:block` y lo comparten otros módulos.

### 6. La tarjeta salió a un macro local

El bloque de la tarjeta estaba **duplicado** entre la rama slider y la de grid,
así que cualquier arreglo había que hacerlo dos veces. Ahora es
`image_box_card(item, style_default, size_default, icon_size_default)`.

## Módulo nuevo: `testimonial.module` (2026-08-11)

Pedido: reproducir el carrusel de testimonios de "Lo que dicen nuestros
clientes" de `https://parautos.com.mx/`, donde las flechas de navegación
aparecen al pasar el mouse.

**Qué es el original** (WordPress + Divi, se leyó su HTML real): un
`et_pb_slider` donde cada slide es **un solo bloque de texto enriquecido** con
todo adentro — la foto como `<img>`, el párrafo, las estrellas como **una
imagen PNG** (`stars.png`, 193×32) y la firma `<strong>Nombre</strong> |
Empresa`. O sea que no hay campos: el editor arma cada testimonio a mano y no
hay forma de cambiar la calificación sin cambiar la imagen.

### Decisiones de implementación

- **Reusa el carrusel del theme, no trae uno propio.** Se llama a
  `helper.slider_min(...)`, el mismo macro que ya usan `icon_box`, `counter`,
  `image_box`, `post`, `video_box` y `slider`. Así hereda gratis columnas por
  breakpoint, dots por páginas reales, autoplay, teclado y los tres fixes de
  rendimiento del carrusel — y cualquier arreglo futuro de `js/carousel.js` lo
  arregla también acá. Los defaults quedaron en 1 columna y dots encendidos.
- **La calificación son iconos, no una imagen.** Campo `rating` por ítem
  (número) + un icono configurable a nivel módulo (default `star` sólido) y un
  máximo. Se dibujan `max` iconos y los que superan la calificación van con el
  color "vacío". Ventaja concreta sobre el PNG del original: no hay descarga,
  escala sin pixelarse, el color sale de un campo, y cambiar de 5 a 4 estrellas
  es escribir un número.
- **Accesibilidad de la calificación**: el contenedor lleva `role="img"` +
  `aria-label="4 de 5"` y cada icono va `aria-hidden`. Para un lector de
  pantalla es UNA información, no cinco iconos sueltos.
- **Las flechas al hover se ocultan con `opacity` a secas, NUNCA con
  `visibility`/`display`.** Un elemento con `visibility:hidden` deja de ser
  enfocable, así que el usuario de teclado no podría llegar nunca a la flecha y
  el `:focus-within` que la revela jamás se dispararía. Con `opacity` el botón
  sigue en el orden de tabulación. Todo va dentro de
  `@media (hover: hover)` para que en pantallas táctiles —donde el hover no
  existe— las flechas se vean siempre.
- **La clase del hover viaja por el parámetro `classes` de `slider_min`**, no
  como un `class` propio en el mismo `<div>`. `slider_min` ya emite su atributo
  `class`; poner otro hace que uno se pierda — es exactamente el bug de
  `slider.module` de 2026-08-10.
- **La separación entre tarjetas va como `padding` del slide, no como `gap` del
  track.** `slider_min` calcula el ancho del slide con `calc(100%/columnas)`,
  así que un `gap` desbordaría el último.
- **Separador de la firma configurable y con el espacio en CSS**: el
  `margin` a los lados está en `.testimonial__separator`, no como `&nbsp;` en
  el HTML, para que al dejar el campo vacío no quede un espacio suelto.

### Aprendizaje nuevo (verificado por el validador de HubSpot)

- **En un módulo, un campo `text` NO se admite en la pestaña STYLE**:
  `text field 'styles.separator.text' is not allowed in the 'STYLE' tab`. Es
  primo del límite ya documentado para el `fields.json` del *theme* (que solo
  admite Boolean, Border, Choice, Color, Font, Image, Number, Spacing), pero es
  otra cosa: acá el tipo sí existe, lo que no se puede es ponerlo en esa
  pestaña. Por eso el carácter separador quedó en contenido (grupo *Firma*) y
  solo su color en estilos.
- **Copiar un grupo de otro módulo se lleva sus reglas de visibilidad.** Los
  grupos `slider_options` y `styles.slider` de `icon_box` están condicionados
  al toggle `show-as-carousel`; al copiarlos a un módulo que no tiene ese
  toggle, HubSpot rechaza el upload con
  `no controlling_field with id 'show-as-carousel' exists`. Hay que limpiar las
  claves `visibility` al copiar.

### Sin verificar a ojo

El módulo **sube y compila** en el sandbox, pero **no hay ninguna instancia
puesta en una página todavía**, así que el render final no se ha visto. Para
verlo hay que agregarlo a `/test` desde el editor de HubSpot (las instancias
son contenido del portal, no viajan en archivos).

### Bug de fondo que destapó este módulo (2026-08-12)

Reporte del usuario: puesto en `/test` de Parautos, "no funciona como un
slider". No era del módulo — era del macro `slider_min`, o sea de **los 6
módulos con carrusel**, desde siempre.

**Las rutas relativas de `get_asset_url()` se resuelven contra el archivo que
contiene la llamada, NO contra el módulo que llama al macro.** En `slider_min`
estaban como `'../../modules/css/carousel.css'` y `'../../js/carousel.js'`, que
desde `minimal/modules/helpers.html` se salen de la raíz del theme. Resultado:
`get_asset_url` devuelve **cadena vacía en silencio** — el `<link>` sale con
`href=""` y el `<script>` del carrusel no se emite. Sin ese JS no existe
`initCarousel` y sin ese CSS `.carousel__track` no es flex, así que los slides
quedan apilados: exactamente "no funciona como slider".

**Por qué nadie lo vio en meses:** `slider.module` pide esos mismos dos
archivos desde su **propio** `module.html`, donde la ruta sí resuelve. La
página `/test` del sandbox tiene una instancia de `slider.module`, así que
cargaba los assets para todos los demás módulos de la página. En Parautos no
hay ninguna instancia de `slider.module` y el andamio desapareció. La pista
estaba a la vista igual: esa página del sandbox emitía un
`<link rel="stylesheet" href="">` vacío, que era el require roto.

Corregido a `'../modules/css/carousel.css'` y `'../js/carousel.js'`. Ojo:
**`'css/carousel.css'` a secas NO resuelve** (probado en vivo, seguía saliendo
`href=""`); hay que subir un nivel y volver a bajar. La referencia de qué forma
sirve estaba en el mismo archivo: el `'../library/animate/...'` de
`animation_min`, que siempre funcionó.

Verificado en vivo en los dos portales después del fix: los dos assets cargan
con URL real, `carousel__track{display:flex;overflow-x:auto}` llega servido, y
la página pasó de 1 a **0** `<link>` vacíos.

**Lección de método, no de código:** este módulo se dio por entregado con un
"sube y compila". Compilar no es funcionar — el `href=""` lo emitía HubSpot sin
error alguno. Un módulo nuevo no está verificado hasta que se lee el HTML
servido de una instancia real.

### Segunda ronda de fixes (2026-08-12), los tres del mismo origen

Reporte: no se ve la navegación por puntos, el tamaño de las flechas no hace
nada, y al deslizar "se corren los bordes de un lado a otro".

1. **El `border-radius` iba en cada tarjeta.** Ahora `box_min` se aplica al
   **contenedor** (`.testimonial-carousel`) y no a `.testimonial`. Las tarjetas
   se deslizan DENTRO del recuadro en vez de arrastrar cada una su propio borde,
   y los dots quedan adentro del recuadro. **No hace falta `overflow:hidden`**:
   el track ya recorta su contenido por ser `overflow-x:auto`, así que un slide
   nunca se pinta sobre el padding del contenedor.
2. **`arrows.size` solo emitía `font-size`**, y `carousel.css` fija el botón en
   36×36 — el glifo crecía dentro de una caja que no se movía, así que a ojo
   "no hacía nada". Ahora emite también `width`/`height` al **doble** del
   valor, que es la proporción del default del theme (36/18): un size de 18
   reproduce exactamente lo de antes.
3. **Bug real que destapó el cambio 1**: `scrollToSlide` usaba
   `slides[index].offsetLeft` tal cual. `offsetLeft` se mide desde el
   `offsetParent`, que es `.carousel` (tiene `position:relative`), **no** el
   track. Al ponerle padding al contenedor, ese padding quedó sumado en todos
   los `offsetLeft` y cada salto se pasaba por esa cantidad (medido en vivo:
   `[40, 609, 1177]` con el track en `offsetLeft: 40`). Ahora hay un
   `offsetOf(i)` que resta el del primer slide — correcto con o sin padding, y
   se usa también en el listener de scroll. Afecta a los 6 módulos con
   carrusel.

**Lo que NO se pudo verificar desde acá** (y confirma lo ya documentado): el
navegador de este entorno **no ejecuta scroll horizontal ni siquiera asignando
`track.scrollLeft` directo** — devuelve 0 siempre. Se verificó lo medible: el
JS servido trae `offsetOf`, el CSS emitido trae `width`/`height` en la flecha, y
los dots existen (3) y marcan el activo al hacer clic. El desplazamiento hay que
confirmarlo a ojo.

**Y un recordatorio que costó**: `slides[0].offsetWidth` da **0** cuando el
navegador automatizado reporta viewport 0×0, y `getVisibleCount()` cae a
`slides.length`, así que `buildDots()` calcula 0 páginas y parece que los dots
no existen. Hay que tomar un `screenshot` ANTES de medir (ya estaba
documentado; volvió a morder).

### Pendiente relacionado que se encontró de paso

**El campo *Type of arrows* del carrusel no hace nada.** `slider_min` emite una
clase `slick-arrow-<tipo>` y `slider.module` otra igual, pero **no existe CSS
para esas clases en ninguna parte del theme** (se fue con `library/slick/`).
Verificado con `grep` sobre todo el repo: las únicas dos apariciones son las
que las emiten. O se les escribe el CSS o se quita el campo.

## `image.module`: object-fit y tamaño exacto (2026-08-12)

Dos campos nuevos en **Estilos → Imagen**: `object_fit` (los 5 valores de CSS) y
`object_position`. Ambos con default vacío, así que no emiten nada y las
instancias publicadas se ven igual.

**Por qué "anchura y altura exactas" no se respetaba**: el CSS base del módulo
tiene `.custom-image__image{width:100%;height:auto}`
(`modules/css/custom_image.css`), y una clase le gana a los atributos
`width`/`height` del `<img>`. Daba igual lo que eligiera el editor: el alto
siempre salía automático. Ahora, cuando `size_type == 'exact'`, el módulo emite
`width`/`height` como CSS por instancia — escopado con
`#hs_cos_wrapper_<name>`, así que gana sobre el CSS base sin `!important`.

**`max-width:100%` va junto con el ancho fijo**, si no un ancho grande desborda
en móvil. Efecto colateral honesto: cuando el ancho se achica y el alto sigue
fijo, la imagen se deformaría — y para eso está justamente el `object-fit`.
Por eso los dos cambios son uno solo y el texto de ayuda del campo lo dice.

**Verificado en vivo, no solo compilado**: se forzaron temporalmente
`object_fit`, `object_position` y la rama de `exact` en el template, se leyó el
HTML servido del sandbox (emitió `width`/`max-width`/`height` y
`object-fit`/`object-position` correctos), y se revirtió. Confirmado después con
`grep` que no quedaron restos, local y en vivo, y que la instancia existente
sigue renderizando sin CSS extra.

## `box-shadow`: dos bugs en los macros compartidos (2026-08-12)

Reporte sobre `icons.module`: la sombra configurada no se aplica, y la que no se
quiere sí aparece. Las dos ciertas, con causas distintas, y **ninguna era del
módulo** — las dos vivían en `modules/helpers.html`.

### Bug 1: `box_min` probaba una variable que no existe

La condición que decide si se emite la regla decía `shadow_color.color`.
**`shadow_color` no existe en ninguna parte del repo** (`grep -rn` daba esa
única línea); la variable definida tres líneas arriba se llama `shadow`. En HubL
un nombre indefinido es null, así que ese término **siempre era falso**: la
sombra sola nunca abría el bloque y solo se emitía de rebote, cuando además
había fondo, padding, borde o radio. Como los campos de `icons` son todos
`default: null`, configurar únicamente la sombra no producía absolutamente nada.

Ahora se prueban los subcampos de verdad (`shadow.color.color or shadow.blur or
shadow.position_x or shadow.position_y or shadow.disable`). Arregla los **27
módulos** que llaman `box_min`, y solo puede *agregar* reglas que un editor ya
había configurado y se descartaban en silencio.

### Bug 2: no existía ninguna forma de emitir "sin sombra"

**La sombra de los iconos no sale del módulo: sale del theme.**
`theme.icons_module.default.shadow` (`fields.json`, ~línea 8839) trae color
`#292929` al 20%, blur 5, x 2, y 2, y `modules/css/icons.css` llama a `box_min`
con esos valores. Ahí sí hay `background_color` (#ffffff) y `border_radius`
(200) no nulos, así que el bloque se abría y pintaba
`box-shadow:2px 2px 5px rgba(41,41,41,.2)` en **todos** los `.icons__anchor` del
sitio. Vaciar los campos del módulo no la quitaba, porque "vacío" significa
"heredá lo del theme", no "quitala".

Se agregó un booleano `disable` ("Quitar la sombra") a los tres grupos `shadow`
de `icons.module`, que emite `box-shadow: none`. Al ser regla por instancia
(`#hs_cos_wrapper_<name>`) le gana al CSS base **sin `!important`**. Default
`false` = nada cambia en lo publicado. `shadow_min`/`box_min` lo soportan de
forma genérica: dárselo a otro módulo es pegar el booleano en su `fields.json`,
sin tocar código.

**Workaround que se encontró en vivo**: una instancia real en Parautos tenía
fondo blanco al 0% y color de sombra blanco al 0% — o sea, alguien la hizo
invisible a mano porque no había interruptor. Funciona, pero ahora sobra.

### De paso, dos defectos más en `shadow_min`

- **Los ejes estaban invertidos**: emitía `position_y position_x blur` cuando CSS
  es `offset-x offset-y blur`, así que los campos *Position x/y* hacían lo
  contrario de lo que dicen. **No cambia nada visualmente por defecto**: se
  revisó el `fields.json` del theme y los de los 27 módulos, y el único default
  de sombra con valores en todo el theme es `icons_module.default.shadow`, con
  x=2 e y=2 (simétrico). Solo se movería una instancia donde alguien haya puesto
  x≠y a mano.
- **Un `0` se convertía en `10px`**: el `is truthy?` trataba cualquier valor
  falsy como vacío, así que no se podía pegar la sombra al elemento. Ahora usa
  `|default(10)`, que solo sustituye null/undefined. Verificado: el `0` llega
  como `0px` y el fallback de 10px se conserva cuando el campo va vacío.
- **Ahora se exige color**: sin él, `color_min` emitía `rgba(, 1)`, una
  declaración inválida que el navegador descartaba igual.

### Verificado en vivo (las 4 rutas, leyendo el CSS servido)

Con reglas de prueba temporales en el sandbox, borradas después (`grep` sin
restos, local y en vivo):

| Config | Emitido |
|---|---|
| solo sombra, x=20, y=0, blur=7 | `box-shadow:20px 0px 7px rgba(255,0,0,0.5)` |
| `disable` encendido | `box-shadow:none` |
| solo blur, sin color | regla vacía (sin `rgba(, 1)`) |
| solo color | `box-shadow:10px 10px 10px rgba(0,255,0,1.0)` |

Después del cambio, **ninguna** instancia del sandbox estrenó sombras
inesperadas, y el CSS base del theme sigue emitiendo exactamente lo mismo que
antes.

## Pendientes / por hacer

- **Menú móvil (`header.html`) no muestra el `<button>` accesible en el
  sitio real todavía** — es contenido global ya publicado, así que el
  nuevo campo `is_button` (y sus valores default puestos en la plantilla)
  no se heredó. Hay que entrar al editor de HubSpot, abrir el header,
  editar los dos ítems de ícono (abrir/cerrar menú) y:
  - Activar el toggle **"Render as button"**.
  - **Aria label**: `Abrir menú` (ícono de hamburguesa) / `Cerrar menú`
    (ícono de X).
  - **Aria controls**: `header-popup` en ambos (es el `id` fijo del panel
    del menú, no cambia).
  - Sin esto, el menú sigue funcionando (JS vanilla ya no depende de
    jQuery), solo le falta el pulido de accesibilidad.
- **Subido a Parautos el 2026-08-10** (`hs cms upload minimal minimal
  --account=Parautos`, 229 archivos): quedó como theme **nuevo e inactivo**
  en `minimal/`, junto a Growth y Session, que no se tocaron. Verificado
  después de subir: `carousel.js` en producción trae los tres fixes
  (`passive`, `requestAnimationFrame`, `setTimeout(buildDots, 150)`) y
  `font-preload.html` llegó con la lista vacía.
  Después se subió aparte `modules/custom_section.module` (los campos ID y
  clases, ver su sección más arriba) y quedó verificado en Parautos: el grupo
  `advance` está, el `module.html` aplica id y clases, sin restos de la prueba.
  **Falta el paso que sí es riesgoso**: activar el theme en una plantilla de
  Parautos. Antes de hacerlo, correr el checklist de abajo.

  Al 2026-08-11 Parautos está al día con el local, incluyendo
  `custom_section` (advance + background detallado con el fix de la distancia),
  `icon_list` (párrafo + los 7 campos de tipografía), el módulo nuevo
  `card_grid` (más su `modules/css/card_grid.css`), `image_box` (los 7 cambios
  de imagen/botones/iconos) y el módulo nuevo `testimonial` (más su
  `modules/css/testimonial.css`). Verificado leyendo los archivos de vuelta, no
  de memoria.

  **Al comparar con `hs cms fetch`, esperar diferencias que NO son un problema**:
  el fetch devuelve la versión normalizada por HubSpot, no el archivo tal cual
  se subió. En `meta.json` agrega `module_id` y `content_types`, y **omite
  siempre `help_text`** y los arrays vacíos (`js_assets`, `tags`…) — verificado
  contra `card_grid`, que lleva días arriba y funcionando, y tampoco lo
  devuelve. En `fields.json` agrega `id`, `tab` y `display_width` por campo, y
  omite las claves cuyo valor era vacío o nulo (`default: null`,
  `validation_regex: ""`, `show_emoji_picker: false`). Para comparar de verdad
  hay que mirar la estructura (nombres, tipos, anidación) y los defaults que
  importan, no hacer un `diff` crudo.

  Para comparar local vs Parautos sin subir nada (útil para detectar desfases
  como el de `custom_section`, que quedó fuera por orden cronológico):
  `hs cms fetch minimal/<ruta> /tmp/x --account=Parautos` y diff contra el
  archivo local. `find minimal -type f -exec stat -f "%Sm %N" -t "%Y-%m-%d %H:%M" {} \; | sort -r`
  lista lo modificado más reciente, que es por dónde empezar a mirar.
- **Antes de ACTIVAR el theme en una plantilla de Parautos** (subirlo ya no
  es el riesgo; activarlo sí):
  - Revisar el Design Manager de producción por módulos personalizados
    fuera de este repo local que puedan usar `$(...)` (jQuery) — si
    existen, se rompen silenciosamente al no estar ya jQuery en el sitio.
    Ojo: los themes `growth`/`session` de ese portal son de terceros y
    pueden tener sus propios módulos con jQuery; conviene revisarlos si
    alguna página va a mezclar módulos de esos themes con este.
  - Probar el sitio completo publicado en el sandbox con contenido real
    (no solo la página `/test`), especialmente páginas con blog, buscador
    (`search_result.module`, que quedó fuera del alcance de este proyecto
    por ser una plantilla que rellena JS propio de HubSpot — no se tocó).
  - Considerar completar `templates/partials/structured-data.html`
    (`company_name`, `social_links` — hoy vacíos a propósito, ver el
    comentario de cabecera de ese archivo) si el cliente final quiere
    JSON-LD de Organization/WebSite completo.
- **Fuera de alcance a propósito** (no tocar sin una razón nueva):
  - `css/objects/_layout.css`, `_bootstrap-grid.css`,
    `_bootstrap-utilities.css`, `_containers-dnd.css` — CSS estructural
    real de HubSpot (`dnd_row`/`dnd_column` emiten `row-fluid`/`spanN`),
    no legacy muerto como parecía en la auditoría inicial.
  - `modules/search_result.module` — plantilla rellenada por JS propio de
    HubSpot (no hay archivo JS del theme que lo controle), riesgo real de
    romper la búsqueda si se cambia la estructura sin verificar el
    contrato exacto que espera ese script.
