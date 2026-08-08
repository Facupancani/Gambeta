# Backlog — Gambeta

Fuente de verdad del trabajo pendiente entre sesiones/loops. Se actualiza en
cada bloque de trabajo: tildar lo hecho, agregar lo que surja, dejar una nota
en "Notas / bloqueos" si algo queda a mitad de camino o depende del usuario.

## Día 1 — Fundacional ✅ (hecho, commit inicial)
- [x] Setup Next.js 16 + TS + Tailwind + shadcn + Prisma 7
- [x] Modelo de datos (Product/ProductVariant/ProductImage/Category/AdminUser)
- [x] Auth de admin (sesión JWT liviana, proxy.ts, DAL)
- [x] Home, Catálogo, PDP, institucionales — compra directa por WhatsApp
- [x] Vistas de lectura del panel admin
- [x] Identidad de marca v1 aplicada (paleta, tipografía)
- [x] SEO básico (robots, sitemap, metadata)
- [x] Seed con catálogo de ejemplo

## Día 2 — Carrito multi-producto ✅ (hecho y verificado en navegador)
- [x] `CartContext` + persistencia en localStorage
- [x] Botón "Agregar al carrito" en PDP (además de la compra directa que ya existe)
- [x] Página `/carrito` real: listar items, cambiar cantidad, quitar, total
- [x] Checkout: un solo mensaje de WhatsApp con todos los items del carrito
- [x] Indicador de cantidad de items en el header

## Día 3 — Panel admin completo ✅ (hecho y verificado en navegador contra TiDB real)
- [x] Crear producto (formulario + Server Action + validación con zod)
- [x] Editar producto
- [x] Carga de imágenes vía Cloudinary Upload Widget (drag & drop, múltiples, reordenar) — código integrado y revisado; la subida real en sí no se probó en vivo (ver nota abajo)
- [x] Duplicar producto
- [x] Edición rápida inline (estado, precio) desde la tabla
- [x] CRUD de categorías (crear/editar/borrar, con protección: no deja borrar categorías con productos)
- [x] Borrar producto (con confirmación vía window.confirm)

## Día 4 — Deploy y pulido
- [x] Conectar repo a GitHub (remoto + primer push) — hecho en el bloque anterior
- [ ] **Deploy a Vercel + variables de entorno — BLOQUEADO, necesita al usuario (ver Notas/bloqueos)**
- [x] Verificar con datos reales (TiDB + Cloudinary ya conectados) — hecho en el Día 3
- [x] `npm run build` de producción — pasa limpio, sin errores
- [x] QA mobile (viewport 375px): Home revisada, se encontró y arregló un gap real (nav completamente oculta en mobile sin alternativa) agregando menú hamburguesa con Sheet
- [x] QA end-to-end mobile del flujo de compra completo: catálogo→PDP→agregar al carrito→carrito→total — todo verificado en viewport 375px, sin overflow horizontal en ninguna página, sin errores de consola
- [ ] Revisar Core Web Vitals / performance básica más a fondo
- [ ] Pase final de identidad de marca (ajustes que pida el usuario o su colega)

## V2 (fuera de alcance por ahora)
- [ ] Pago online (Mercado Pago)
- [ ] Importación CSV/Excel masiva
- [ ] IA para autocompletar info de producto desde fotos
- [ ] Reviews, wishlist, cuentas de cliente, cupones
- [ ] Dashboard de analítica / historial de pedidos

## Notas / bloqueos
- ✅ TiDB, Cloudinary y GitHub ya conectados y verificados (ver abajo). Vercel:
  se aborda recién en el Día 4, no bloquea el trabajo de Días 2-3.
- IMPORTANTE (2026-08-07): `DATABASE_URL` necesita `?sslaccept=strict` al final
  para que el schema engine de Prisma (CLI de migraciones) conecte por TLS —
  sin eso tira "Connections using insecure transport are prohibited". El
  adapter de runtime (`src/lib/prisma.ts`) ya fuerza `ssl: true` por su cuenta,
  así que esto solo afectaba a `prisma migrate`/`prisma db push`, no a la app.
- La base de datos usada es `test` (la que TiDB Serverless provee por
  default), no `gambeta` — no hace falta crear una nueva, ya está en uso.
- Verificado end-to-end el 2026-08-07 contra TiDB real: migración inicial
  aplicada, seed cargado (admin + 9 productos + 4 categorías), login de admin,
  dashboard, listado de productos, storefront — todo probado con el navegador,
  sin errores de consola. Primer push a GitHub hecho
  (github.com/Facupancani/Gambeta, branch `master`).
- Bug encontrado y arreglado: los `<Button>` de shadcn (Base UI) que usan
  `render={<Link>...}` o `render={<a>...}` necesitan `nativeButton={false}`
  explícito, si no tiran un warning de accesibilidad en consola. Tenerlo en
  cuenta para cualquier botón nuevo que renderice como link. Apareció de
  nuevo en el botón "Nuevo producto" del Día 3 — chequear siempre que se
  agregue un botón que renderiza como link.

### Bugs encontrados y arreglados en el Día 3 (verificación en navegador)
- **`SelectValue` de Base UI muestra el `value` crudo, no la etiqueta**: sin
  pasarle una función `children` (`(value) => label`), el trigger del Select
  mostraba el ID de categoría o el enum de estado en vez de "Botines"/
  "Activo". Se arregló en `product-form.tsx` y `product-quick-edit-form.tsx`
  pasando una función de mapeo. Si se agrega un Select nuevo, tenerlo en cuenta.
- **Funciones como children de un Client Component no pueden venir de un
  Server Component**: `productos/page.tsx` (Server Component) intentaba pasar
  `<SelectValue>{(value) => ...}</SelectValue>` directamente, lo cual rompe
  la serialización RSC ("Functions are not valid as a child of Client
  Components"). Se resolvió extrayendo esa parte a
  `product-quick-edit-form.tsx`, un Client Component dedicado.
- **Inputs no controlados con `defaultValue` que cambia después del mount**:
  al renombrar una categoría o actualizar precio/estado inline, el input
  seguía mostrando el valor viejo (o tiraba warning de Base UI: "changing
  the default value state of an uncontrolled FieldControl") porque React
  reusa la misma instancia del input al revalidar. Se arregló agregando
  `key={valor}` a esos inputs/selects (en `categorias/page.tsx` y
  `product-quick-edit-form.tsx`) para forzar remount cuando el valor cambia.
  Mismo patrón aplicado preventivamente con `key={product.id}` en
  `ProductForm` dentro de la página de edición, para que no arrastre datos
  del producto anterior si se navega entre ediciones sin remount completo.
- **Entorno de testing con navegador no compone frames** ("the Browser pane
  is not displayed"): los popovers posicionados por floating-ui (el listado
  desplegable de un Select) miden `getBoundingClientRect() = {0,0,0,0}`, así
  que un click por coordenadas de mouse no le pega. Se sorteó despachando
  eventos de puntero directo sobre el nodo del DOM, o llamando
  `form.requestSubmit()` para probar la Server Action de punta a punta. Esto
  es una limitación del entorno de pruebas automatizado, no del código — un
  usuario real con mouse no tiene este problema. Tenerlo en cuenta para
  futuras verificaciones: si un click no parece hacer nada, probar
  `requestSubmit()`/`dispatchEvent` antes de asumir que el código está roto.
- **Sin probar en vivo**: la subida real de imágenes vía el widget de
  Cloudinary (es un iframe de terceros) no se pudo automatizar con las
  herramientas de browser disponibles. El código sigue el patrón oficial de
  Cloudinary y se revisó a fondo, pero conviene que el usuario haga una
  prueba manual real (subir 1-2 fotos a un producto) la primera vez que use
  el panel.

### Día 4 — lo encontrado hasta ahora
- **Bug real arreglado**: en mobile (viewport angosto) la navegación del
  header quedaba completamente oculta (`hidden sm:flex`) sin ninguna
  alternativa — el único acceso a Catálogo/Nosotros/etc. era el CTA del hero
  o scrollear hasta el footer. Se agregó `src/components/mobile-nav.tsx`
  (botón hamburguesa + Sheet lateral con todos los links) usando el
  componente Sheet que ya estaba instalado desde el Día 1.
- **Mismo tipo de limitación del entorno de testing, nueva variante**: al
  navegar tocando un link dentro del Sheet mobile, el panel (ya
  correctamente marcado `data-closed`/`data-ending-style` por React/Base UI)
  se queda montado e interceptando clicks, porque su desmontaje depende de
  que termine una transición CSS (`transitionend`) — evento que nunca
  dispara en este navegador de pruebas sin compositing real. El fix de
  código (cerrar el Sheet ajustando estado durante el render cuando cambia
  `usePathname()`, sin usar `useEffect` para no chocar con la regla de lint
  `react-hooks/set-state-in-effect`) es correcto y necesario de todos modos.
  **Pendiente**: confirmar visualmente en un navegador real (o que el
  usuario lo pruebe en su celular) que el menú se cierra prolijo al navegar
  — no debería fallar, pero no se pudo verificar 100% con las herramientas
  disponibles acá.
- `npm run build` (build de producción) corre limpio, sin errores de
  TypeScript ni de compilación. Rutas estáticas vs. dinámicas se generaron
  como se esperaba (Home es estática pero se revalida on-demand vía
  `revalidatePath("/")` en las Server Actions de productos, así que no
  debería mostrar datos viejos).

### BLOQUEO — deploy a Vercel necesita acción del usuario
No hay forma de que yo despliegue a Vercel sin que el usuario haga al menos
uno de estos pasos (no tengo `vercel` CLI autenticado en esta máquina, y
autenticar-me yo mismo implicaría un login interactivo/OAuth que las reglas
de seguridad no me permiten completar por él):

1. **Opción más simple (recomendada)**: entrar a vercel.com (ya tiene cuenta
   creada) → "Add New" → "Project" → importar el repo
   `github.com/Facupancani/Gambeta` → antes de dar "Deploy", cargar las
   variables de entorno (son las mismas que están en el `.env` local:
   `DATABASE_URL`, `SESSION_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`,
   `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`,
   `NEXT_PUBLIC_WHATSAPP_NUMBER`, y `NEXT_PUBLIC_SITE_URL` — esta última
   hay que ponerla como la URL que Vercel asigne, ej.
   `https://gambeta.vercel.app`, se puede ajustar después del primer deploy)
   → Deploy.
2. **Alternativa**: instalar Vercel CLI (`npm i -g vercel`) y correr
   `vercel login` (abre el navegador para loguearse) — una vez logueado,
   puedo tomar la posta y correr `vercel link` + `vercel env add` + `vercel
   deploy` yo mismo desde acá.

En cuanto el usuario haga cualquiera de las dos, avisar para retomar y
terminar el resto del Día 4 (verificar el deploy real, QA final, pulido).

## Pase de diseño (post-feedback del usuario, 2026-08-07) — ✅ HECHO Y VERIFICADO

El usuario dio feedback real sobre el sitio funcionando: falta personalidad,
tipografía de heading parece "de código", sin imágenes, faltan afordancias de
UX (agregar al carrito desde la card, volver atrás en PDP). Se investigó
benchmark dirigido y se cerró un plan concreto. Referencia principal aprobada
por el usuario: **myrsport.com.ar** (marca de sneakers urbana AR). Se
inspeccionó en vivo (no solo por descripción) y se midieron valores reales:

- Fondo negro puro (`#000`) — confirmado que el negro NO era el problema real
  (la personalidad la da el peso de la imagen/contenido, no el color de
  fondo). **No aclarar el fondo — sumar contenido visual encima.**
- Heading font: **Bebas Neue** (confirmado en el DOM real de MYR — coincide
  con una de las 3 opciones ya propuestas al usuario, así que queda elegida).
- Body font: Inter — igual a la nuestra, sin cambios ahí.
- Botones: `border-radius: 0px`, chicos, tipografía protagonista
  (ej. "VER MÁS" — 12px, padding 10px 15px, fondo negro/texto blanco, sin
  redondeo). Patrón: pocos botones convencionales, más texto+línea.
- Nav de MYR (orden real): hamburguesa (menú) → logo centro → ícono
  buscador → cuenta → ícono carrito con contador. El usuario pidió adaptar
  esto pero con la lupa arriba a la **izquierda** específicamente (no calcar
  posición exacta de MYR ahí).
- Patrones adicionales de benchmark (conocimiento general, no navegado en
  vivo por límite de contexto de la sesión — válido igual, son patrones muy
  establecidos): **Nike.com** → tipografía enorme y segura en el hero, CTAs
  minimalistas (texto subrayado + un solo botón rectangular protagonista),
  mucho whitespace, la foto de producto siempre al frente. **Streetwear
  premium (Off-White/Aime Leon Dore)** → botones cuadrados, uppercase con
  tracking usado con moderación (no en todo), fotografía por sobre
  ilustración. **On Running** → aunque ellos usan fondo claro (no aplica acá
  directo), el patrón que sí aplica es "el color lo pone la foto de
  producto, el chrome de la UI se mantiene neutro".

### Tareas a ejecutar (orden sugerido) — ✅ TODO HECHO Y VERIFICADO (2026-08-07)
- [x] Cambiar fuente de heading global de Space Grotesk → **Bebas Neue**
  (`next/font/google`, `weight: "400"` porque no es variable). Confirmado
  API de fonts contra `node_modules/next/dist/docs/` antes de tocar código
  (sin breaking changes ahí). Como Bebas Neue solo tiene peso 400, se agregó
  `.font-heading { font-weight: 400 !important }` en `globals.css` para que
  no dispare bold sintético del navegador al combinarse con las clases
  `font-bold`/`font-semibold` que ya usaba el resto del código. Verificado
  en navegador: headings, eyebrow y logo renderizan con la fuente nueva sin
  errores de consola.
- [x] Bajar `--radius` global de 0.75rem a **0.125rem** (extremo inferior del
  rango sugerido) — botones/cards/pills quedan casi cuadrados. Verificado
  visualmente vía accessibility tree (no hay forma de comparar radios en
  píxeles con las herramientas disponibles, pero la clase se aplica y no
  rompe layout en ningún viewport probado).
- [x] Paleta reducida a un solo acento: se sacó el segundo acento amarillo
  (`--brand-yellow`, usado antes en "Ver catálogo", "Agregar al carrito" y
  "Finalizar por WhatsApp") y esos 3 CTAs ahora usan el verde `--primary`
  (variant "default" del Button). El resto de los usos decorativos de verde
  (bordes hover de card, pills de categoría activas, precio, links) se
  pasaron a negro/blanco/gris (`foreground`/`muted-foreground`, o invertido
  `bg-foreground text-background` para estados "seleccionado"). Token
  `--brand-yellow` se deja definido pero sin usar, documentado en el
  comentario de `globals.css` por si se necesita un acento futuro.
- [x] Header: "Carrito" en texto → ícono `ShoppingBag` (lucide-react) con
  badge de cantidad (`cart-badge.tsx`). Verificado en navegador: agregar un
  producto vía quick-add y confirmar en `/carrito` que el item aparece
  (probado end-to-end, ver abajo).
- [x] Header: ícono de lupa a la izquierda del logo (`site-search.tsx`,
  nuevo componente) — toggle a un input inline que navega a
  `/catalogo?q=...`. Nota de entorno: el `key: "Return"` sintético del
  navegador de pruebas no siempre dispara el submit nativo del `<form>`
  (mismo tipo de limitación ya documentada en Día 3/4 con popovers y
  transiciones CSS) — se confirmó el flujo real disparando
  `form.requestSubmit()` vía JS, que navegó correctamente a
  `/catalogo?q=medias` y filtró a 1 resultado. Un click real de mouse no
  tiene este problema.
- [x] Placeholders ilustrados por categoría: `src/lib/category-icon.tsx`
  mapea `Category.slug` → ícono de lucide-react (`SportShoe` botines,
  `Volleyball` pelotas, `Shield` canilleras, `Shirt` medias, fallback
  `Package`). Aplicado en `ProductCard` y en la PDP.
- [x] Botón rápido "+" en `ProductCard` (catálogo y home): usa la primera
  variante del producto (sin selector de talle en la card). Requirió pasar
  `variants: { take: 1 }` en las queries de home/catálogo. La card se
  reestructuró de `<Link>` envolvente a `<div>` + `<Link className="contents">`
  para el área clickeable, con el botón "+" como hermano posicionado encima
  (evita anidar `<button>` dentro de `<a>`, HTML inválido). Verificado
  end-to-end en navegador: click en "+" en Home agrega el item sin navegar,
  toast de confirmación, y `/carrito` muestra el producto con talle "Único"
  y el total correcto. Correctamente ausente en el único producto
  `SOLD_OUT` (Botines Gambeta Elite X).
- [x] Flecha "Volver al catálogo" en la PDP (`producto/[slug]/page.tsx`),
  con ícono `ArrowLeft`, apunta a `/catalogo`.
- [x] **8-9 fotos de stock cargadas** (9 en total, una por producto del
  seed — botines: Unsplash; pelotas: Unsplash; canilleras: Wikimedia
  Commons; medias: Pexels — todas de licencia libre/gratuita, fuentes
  documentadas en `prisma/seed-images.ts`). Descargadas, subidas a
  Cloudinary vía el mismo preset unsigned que ya usa el widget del admin
  (`prisma/seed-images.ts`, no forma parte de `npm run db:seed` — es un
  script aparte pensado para correr una vez, seguro de re-correr) y
  asociadas como `ProductImage` de cada producto. Verificado: el request
  directo al optimizador de imágenes de Next.js devuelve 200/image-jpeg
  para las URLs de Cloudinary, y la imagen `priority` de una PDP cargó con
  `naturalWidth` real (640px) — confirma que el pipeline completo
  (Cloudinary → Next/Image) funciona. Las miniaturas lazy-load de las
  grillas de Home/Catálogo no se pudieron confirmar pixel a pixel en este
  navegador de pruebas (el `IntersectionObserver` del lazy-loading no
  dispara sin compositing real — mismo tipo de limitación ya documentada en
  Día 3/4), pero usan el mismo componente `<Image>` y la misma URL
  verificada, así que no hay motivo para que se comporten distinto en un
  navegador real.
- [x] Páginas institucionales (Nosotros/FAQ/Contacto/Envíos): NO se
  tocaron — solo heredan el cambio global de fuente/paleta/radius vía
  `globals.css`/`layout.tsx`, ningún archivo propio de esas páginas fue
  editado.
- [x] Verificado con navegador (visual vía accessibility tree + consola sin
  errores) en desktop (1280px) y mobile (375px, sin overflow horizontal) en
  Home, Catálogo (con y sin filtro), PDP, Carrito, y panel Admin
  (Inicio/Productos) antes de dar todo por terminado.

**Nota de licencias**: 2 de las 9 fotos (canilleras, vía Wikimedia Commons)
son CC-BY-SA y piden atribución si se usan públicamente; el resto
(Unsplash/Pexels) no la requiere. Como es catálogo de ejemplo, no bloquea,
pero si el usuario quiere reemplazar canilleras por fotos propias/CC0 más
adelante, tenerlo en cuenta. Fuente completa de cada foto en
`prisma/seed-images.ts`.

### Nota de método (pedido explícito del usuario, para tenerlo en cuenta en
futuras sesiones): antes de programar cambios de diseño, definir opciones
concretas primero (ej. 3 fuentes candidatas con el porqué) en vez de
implementar a ciegas. Al usuario le gustó este approach y pidió que se
mantenga como forma de trabajo para decisiones de diseño futuras.

## Pendiente — Hero con foto (feedback del 2026-08-07, sesión 2, NO implementado)

El usuario, después de ver el pase de diseño ya hecho, pidió esto anotado
para retomar en otro momento (ahora sigue con otra cosa, no tocar todavía):

- [ ] **Hero de la Home con foto de impacto**: el hero actual (`page.tsx`,
  sección superior) es solo texto sobre fondo negro — el usuario lo quiere
  con una foto grande que dé personalidad e impacto inicial, mencionando
  explícitamente **Nike, Adidas y myrsport.com.ar** como referencia (mismo
  benchmark ya usado en el pase de diseño anterior — ver sección de arriba
  para los patrones ya investigados de esas marcas: tipografía enorme +
  foto de producto siempre al frente en Nike, fotografía por sobre
  ilustración en streetwear premium). Definir antes de implementar: ¿foto
  de stock (mismo criterio de licencia libre que se usó para el catálogo)
  o esperar a que el usuario tenga foto propia? Seguir la nota de método de
  arriba — proponer 2-3 opciones concretas de composición/foto antes de
  programar.
- [ ] **Botón "Ver catálogo" del hero → fondo blanco, texto negro**: pedido
  explícito y puntual, distinto del resto de los CTAs primarios (que usan
  el verde `--primary` desde el pase de diseño anterior). Es una excepción
  para este botón específico, no un cambio del acento global — probablemente
  como variant nuevo de `Button` (ej. `variant="invert"`:
  `bg-white text-black hover:bg-white/90`) en vez de tocar `--primary`.
  Confirmar con navegador que contrasta bien sobre la foto del hero nueva
  una vez que esa foto exista.

*(Absorbido como categoría A de la sección siguiente — se sigue trackeando
acá abajo, no hace falta volver a esta nota.)*

## Pase "portfolio-ready" (loop autónomo, iniciado 2026-08-07, sesión 3)

El usuario pidió reemplazar su propia posición en la creación: un loop
autónomo (`/loop`, modo dinámico, sin intervalo fijo) que audite, planee y
ejecute hasta que el sitio esté a nivel "profesional para portfolio" —
UX/UI correcta, demo completa, todo excepto el deploy (que sigue bloqueado
por el usuario, ver nota de Vercel arriba). Plan diseñado con un agente
Explore (auditoría read-only del estado actual) + un agente Plan
(estructura de este pase), y 4 preguntas de alcance ya respondidas por el
usuario:

1. **Páginas institucionales**: ahora SÍ entran en alcance (antes estaban
   explícitamente excluidas).
2. **Tests**: sí, sumar una suite básica (Vitest + Playwright) como parte
   de "profesional".
3. **Git**: commit + push seguido a la rama actual (`docs/design-pass-plan`,
   ya trackea `origin/docs/design-pass-plan` y tiene el PR #1 abierto —
   **no crear rama nueva**, seguir ahí: es descendiente fast-forward de
   `master` y el PR #1 ya cuenta la historia completa scaffold→pulido, así
   que conviene que este pase sea el mismo hilo). PR #1 se actualiza
   (descripción/checklist) en cada hito, se abre a revisión del usuario
   recién cuando se cumpla la condición de cierre de abajo — el merge es
   decisión del usuario, no del loop.
4. **Check-ins**: avisar al usuario en cada hito (una categoría completa),
   no en cada micro-cambio, no en silencio total.

**Fuera de alcance, no tocar**: todo lo que ya está en "V2" más abajo
(Mercado Pago, cuentas/wishlist/reviews/cupones, dashboard de analítica,
import CSV, IA de fotos) y el deploy a Vercel (bloqueo ya documentado, no
intentar destrabarlo desde acá).

**Estado actual**: arrancando — próxima iteración: categoría C (hygiene
técnica: error/not-found/loading + metadata/OG/favicon), por ser la base
más barata y menos ambigua antes de entrar en decisiones de diseño (hero).

### Checklist por categoría

**A. Hero / impacto visual (Home)**
- [ ] Foto de stock real en el hero (Nike/Adidas/MYR de referencia), misma
  autorización de licencia libre ya usada para las 9 fotos del catálogo,
  subida a Cloudinary igual que esas.
- [ ] 2-3 opciones de composición/foto propuestas y una elegida, con el
  porqué documentado acá (nota de método del usuario).
- [ ] `Button` `variant="invert"` (`bg-white text-black hover:bg-white/90`)
  nuevo en `src/components/ui/button.tsx`, usado solo en el CTA "Ver
  catálogo" del hero — excepción puntual, no cambia `--primary` global.
- [ ] Verificado en navegador: contraste ok sobre la foto real, responsive
  sin overflow en 375px y desktop.

**B. Contenido institucional (Nosotros/FAQ/Contacto/Envíos)**
- [ ] Cada una de las 4 páginas suma al menos una imagen de stock real
  (Cloudinary), on-brand.
- [ ] Nosotros: algo más que un bloque único (ej. sección "cómo
  trabajamos" o imagen de estilo de vida/producto) — no hace falta foto
  real del equipo.
- [ ] Las 4 páginas revisadas para que no se sientan "más finas" que el
  resto del sitio (sin mínimo de palabras fijo).
- [ ] Sin lorem ipsum ni placeholders en ningún lado.

**C. Hygiene técnica — routing / SEO / OG / favicon**
- [ ] `error.tsx` on-brand en raíz, `(storefront)` y `admin`.
- [ ] `not-found.tsx` on-brand en raíz y `(storefront)` (para que el
  `notFound()` de la PDP ya no caiga en el 404 default de Next).
- [ ] `loading.tsx` al menos en `(storefront)` y `admin`.
- [ ] `layout.tsx` raíz: `metadataBase`, `openGraph`, `twitter`, `icons`.
- [ ] `icon.tsx`/`apple-icon.png` reemplazando el favicon default de Next.
- [ ] `opengraph-image.tsx` al menos en raíz (ideal: también en
  `/catalogo` y `/producto/[slug]`).
- [ ] Sacar los SVG default de Next sin usar en `public/` (file.svg,
  globe.svg, next.svg, vercel.svg, window.svg) — confirmar antes que nada
  los referencia.

**D. Accesibilidad básica**
- [ ] Input de `site-search.tsx` (una vez expandido) con label
  visible o `aria-label`/`aria-labelledby`.
- [ ] Link "saltar al contenido" en el layout raíz, apuntando a `<main>`.
- [ ] Chequeo manual de contraste de `--muted-foreground` sobre el fondo
  oscuro para texto chico (WCAG AA, 4.5:1) — ajustar el token si no pasa,
  documentar el resultado igual si pasa.
- [ ] Pasada de tab-order/foco visible en storefront y admin.

**E. Pulido del panel admin**
- [ ] Dashboard: actividad reciente (últimos N productos creados/editados)
  además de las 3 stat cards que ya hay — sin librería de gráficos, una
  lista/tabla alcanza.
- [ ] Paginación en `/admin/productos` (una vez crezca el seed, ver F).
- [ ] Buscador/filtro por nombre en `/admin/productos` (categoría/estado
  es nice-to-have, no obligatorio).
- [ ] Loading states (`loading.tsx` o skeleton inline) en listados/detalle
  de admin.

**F. Datos de demo (seed)**
- [ ] Catálogo ampliado más allá de 9 productos (apuntar a ~20-30, para
  que la paginación/búsqueda de E tengan sentido real) — categorías
  realistas, se puede sumar 1-2 más si suma (ej. "Botines de
  entrenamiento").
- [ ] Galería de imágenes en la PDP: 2-3 fotos por producto en vez de 1
  (el modelo `ProductImage` ya soporta múltiples — confirmar antes de
  asumir que hace falta tocar el schema).
- [ ] Mantener al menos un producto `SOLD_OUT` (ya existe, no perderlo).

**G. Tests**
- [ ] Vitest configurado (`vitest.config.mts`, `__tests__/` en la raíz,
  siguiendo la guía oficial de Next 16 en
  `node_modules/next/dist/docs/01-app/02-guides/testing/vitest.md`) con
  tests de `formatPrice` (`src/lib/format.ts`), `slugify`
  (`src/lib/slugify.ts`) y lógica del carrito (`src/lib/cart-context.tsx`).
- [ ] Playwright (`@playwright/test`, no el wrapper experimental
  `next experimental-test`) con 1-2 specs e2e del flujo crítico: catálogo
  → PDP → carrito → link de checkout de WhatsApp generado bien.
- [ ] Scripts nuevos en `package.json`: `test`, `test:e2e`, `typecheck`.
- [ ] Los 4 comandos (`lint`, `typecheck`, `test`, `test:e2e`) pasan limpios.

**H. Housekeeping**
- [ ] `README.md`: sección "Estado del proyecto" actualizada (carrito y
  CRUD de admin ya NO están pendientes, están hechos) y sacar la
  referencia a la ruta local del plan (`C:\Users\facup\...`).
- [ ] `BACKLOG.md` actualizado en cada iteración, no solo al final.

### Condición de cierre (el loop se para solo cuando se cumple TODO esto)
1. Todos los ítems de A-H tildados (o marcados como excepción documentada
   y aceptada, mismo patrón que el bloqueo de Vercel).
2. `npm run build` limpio.
3. `npm run typecheck` limpio.
4. `npm run test` y `npm run test:e2e` pasan.
5. `npm run lint` limpio.
6. Pasada final completa en navegador (desktop + 375px mobile) por Home,
   Catálogo, PDP, Carrito, las 4 institucionales, error/not-found
   provocados a propósito, y admin (dashboard/productos con
   paginación-búsqueda/categorías) — sin errores de consola, sin overflow
   horizontal.
7. `README.md` sin secciones desactualizadas.
8. PR #1 actualizado con la descripción final, listo para que el usuario
   decida cuándo revisar/mergear (el loop no mergea).
9. Mensaje final al usuario resumiendo todo el recorrido, aclarando que
   el deploy a Vercel sigue siendo el único paso pendiente y por qué (ver
   bloqueo documentado arriba).

Ante una decisión ambigua de "qué tan terminado es suficiente" (ej. si una
foto institucional ya suma lo necesario), el criterio es seguir con juicio
propio y documentar la decisión acá (mismo tono que "Notas / bloqueos"),
no parar a preguntar — los check-ins son por hito, no por micro-decisión.
Preguntar solo ante bloqueos reales (credenciales, decisiones de negocio
ambiguas), no ante juicio estético dentro de la latitud ya autorizada.
