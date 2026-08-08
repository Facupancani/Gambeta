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

**Estado actual**: categorías A, C, D, E, F, G y H ✅ terminadas y
verificadas (ver detalle abajo) — queda solo B (institucionales), la
última categoría del checklist. Próxima iteración: B, y con eso se
cumple la condición de cierre (ver más abajo) salvo por la verificación
final completa.

### Checklist por categoría

**A. Hero / impacto visual (Home)** ✅ HECHO Y VERIFICADO

**3 opciones de foto comparadas (bajadas y miradas de verdad, no solo por
alt text) antes de programar, como pide la nota de método:**
1. **Descartada** — foto de un partido amateur en cancha sintética,
   buena luz, PERO tiene logos de sponsors reales en las camisetas
   (`TARGOBANK`) y un cartel publicitario de una marca de apuestas rusa
   (`ВУЛКАН`) bien visible de fondo. Inutilizable — no se puede poner
   publicidad de terceros (y menos de apuestas) en el hero.
2. **Elegida** — jugador en movimiento (motion blur) pateando al arco de
   noche, cielo nocturno ocupando ~65% del cuadro (casi negro ya de
   base), luces de estadio como puntos pequeños de fondo. Horizontal
   (1600×895, encaja perfecto con un hero ancho), paleta oscura que
   combina directo con el fondo de la marca sin pelearse, y sin ningún
   logo/marca real visible más que el nombre borroso e ilegible de la
   pelota. La que mejor cumple el patrón Nike investigado
  ("tipografía enorme y segura... la foto de producto/acción siempre al
  frente").
3. **Descartada** — jugador pateando, ángulo bajo dramático, MUY vistosa,
  pero vertical/retrato (no una relación de aspecto horizontal para un
  hero ancho) y con un cielo celeste-grisáceo que no combina con la
  paleta negra de la marca; hubiera necesitado recortar tanto que se
  perdía el impacto.

**Implementación:**
- [x] Foto (opción 2) subida a Cloudinary (`gambeta/hero/`, licencia
  libre Unsplash, misma autorización ya vigente).
- [x] Hero rediseñado en `src/app/(storefront)/page.tsx`: foto de fondo
  full-bleed (`next/image` `fill` + `priority`, es el LCP de la Home)
  con dos scrims (`bg-gradient-to-r` de izquierda a derecha y
  `bg-gradient-to-t` abajo) — el scrim izquierdo arranca en
  `from-background` (100% opaco, sin `/valor`), así que donde arranca el
  texto (borde izquierdo) el color efectivo es sólido, idéntico a un
  hero sin foto — contraste garantizado por construcción, no por suerte.
  Confirmado inspeccionando el `background-image` computado real del
  navegador (el stop del 0% es el `--background` sólido, sin alpha).
- [x] `Button` `variant="invert"` (`bg-white text-black hover:bg-white/90`)
  nuevo en `button.tsx`, usado solo en "Ver catálogo" — excepción puntual
  documentada en el propio código, no toca `--primary`. "Conocenos" pasó
  a variant outline con estilos blancos sobre transparente (antes
  dependía de los tokens de fondo sólido, que ya no aplican sobre una
  foto).
- [x] Verificado en navegador: `GET` de la imagen 200, `naturalWidth`/
  `naturalHeight` reales (no rota), botones con los colores exactos
  esperados (`rgb(255,255,255)`/`rgb(0,0,0)` en "Ver catálogo"), sin
  errores de consola, sin overflow horizontal en 375px.

**B. Contenido institucional (Nosotros/FAQ/Contacto/Envíos)**
- [ ] Cada una de las 4 páginas suma al menos una imagen de stock real
  (Cloudinary), on-brand.
- [ ] Nosotros: algo más que un bloque único (ej. sección "cómo
  trabajamos" o imagen de estilo de vida/producto) — no hace falta foto
  real del equipo.
- [ ] Las 4 páginas revisadas para que no se sientan "más finas" que el
  resto del sitio (sin mínimo de palabras fijo).
- [ ] Sin lorem ipsum ni placeholders en ningún lado.

**C. Hygiene técnica — routing / SEO / OG / favicon** ✅ HECHO Y VERIFICADO
- [x] `error.tsx` on-brand en raíz, `(storefront)` y `admin` (cubre
  `/admin/login` y todo `/admin/(dashboard)/*`, ancestro común de ambos).
  Confirmado contra la doc real de esta versión de Next
  (`node_modules/next/dist/docs/.../error.md`) que la prop es `retry`, no
  `reset` (breaking change vs. Next viejo) — los 3 archivos usan `retry`.
- [x] `not-found.tsx` on-brand en raíz y `(storefront)` — el `notFound()`
  de la PDP ahora cae en el de `(storefront)` (mantiene header/footer),
  cualquier URL rota fuera de eso cae en el de raíz. Verificado en
  navegador: `/esto-no-existe` → 404 de raíz; `/producto/no-existe` → 404
  de storefront con header/footer/nav intactos (confirmado con
  `read_page`, no solo texto).
- [x] `loading.tsx` en `(storefront)` y `admin/(dashboard)` — genérico
  (no imita el layout de una página específica, Next no permite
  loading.tsx por-ruta sin carpetas anidadas por página).
- [x] `layout.tsx` raíz: `metadataBase` (reusa `NEXT_PUBLIC_SITE_URL`,
  mismo patrón que `sitemap.ts`/`robots.ts`), `openGraph`, `twitter`
  (`summary_large_image`). `icons` no hace falta declararlo a mano —
  Next lo autodetecta de `icon.tsx`/`apple-icon.tsx`.
- [x] `icon.tsx` (32×32) y `apple-icon.tsx` (180×180) generados por código
  con `next/og` `ImageResponse` — reemplazan el favicon default de Next
  (`src/app/favicon.ico`, eliminado). Colores exactos sampleados de las
  variables CSS reales corriendo la app (canvas probe, no adivinados
  desde el oklch fuente): fondo `#090f0b`, verde `#32ce69`. Verificado:
  `GET /icon` y `GET /apple-icon` devuelven 200 con las dimensiones
  correctas.
- [x] `opengraph-image.tsx` en raíz (1200×630, mismo esquema de color,
  wordmark "GAMBETA" + eyebrow + barra verde) — verificado 200, dimensión
  real 1200×630, y por canvas que el texto renderizó de verdad (11 colores
  distintos muestreados: fondo, verde, blanco, grises de antialiasing —
  no una imagen en blanco). La PDP ya tenía su propio OG dinámico (foto
  real del producto) desde el pase de diseño anterior, así que el caso
  más importante (compartir un link de producto) ya estaba cubierto.
  **Intentado y descartado** un `opengraph-image.tsx` propio para
  `/catalogo`: devuelve 404 de forma consistente (confirmado con `curl`
  directo, reinicio de server, y `.next` limpio) cuando el archivo vive
  anidado dentro de un route group (`(storefront)/catalogo/`), pero
  funciona perfecto (200) en una carpeta anidada idéntica fuera de un
  route group — parece un bug/limitación real de esta versión de Next con
  archivos de metadata-imagen dentro de route groups anidados, no un
  error de código. Como era un ítem "ideal" (no obligatorio) y el caso
  que sí importa (PDP) ya funciona, se descartó en vez de seguir
  investigando — si se necesita en el futuro, evaluar sacar `/catalogo`
  del route group `(storefront)` o esperar un fix de Next.
- [x] Sacados los SVG default de Next sin usar en `public/` (file.svg,
  globe.svg, next.svg, vercel.svg, window.svg) — confirmado por grep que
  nada los referenciaba antes de borrarlos.

**D. Accesibilidad básica** ✅ HECHO Y VERIFICADO
- [x] Input de `site-search.tsx` (una vez expandido) con
  `aria-label="Buscar productos"`.
- [x] Link "saltar al contenido" (`src/app/layout.tsx`, primer hijo de
  `<body>`, `sr-only focus:not-sr-only`) apuntando a `#main-content`. Ese
  id vive en el wrapper de `(storefront)/layout.tsx` (cubre todas las
  páginas de storefront + sus error/not-found/loading) y en
  `admin/(dashboard)/layout.tsx` (cubre dashboard/productos/categorías) —
  más 4 páginas standalone que no comparten esos layouts y necesitaban su
  propio id: `app/error.tsx`, `app/not-found.tsx`, `app/admin/error.tsx`,
  `app/admin/login/page.tsx`.
- [x] Contraste medido (no adivinado) con canvas probe + fórmula WCAG real
  (relative luminance) sobre los colores reales de `globals.css`:
  `--muted-foreground` sobre `--background` → **6.27:1**; sobre `--card`
  → **5.78:1**; `--primary` sobre `--background` → **9.37:1**;
  `--primary-foreground` sobre `--primary` → **9.34:1**. Los 4 pasan AA
  (4.5:1) cómodos, ninguno necesitó ajuste.
- [x] Tab-order revisado: el skip link es el primer elemento focuseable
  del DOM (confirmado por orden real de `querySelectorAll`), seguido por
  header (búsqueda/logo/nav/carrito) y después el contenido. **Nota de
  entorno** (mismo tipo de limitación ya documentada en Día 3/4): este
  navegador de pruebas reporta `document.hasFocus() === false` incluso
  con la pestaña "fronteada" (sin compositing real), así que
  `element.matches(':focus')` nunca da `true` acá aunque
  `document.activeElement` sí sea el correcto — no se pudo confirmar
  visualmente el estilo `:focus` del skip link interactuando de verdad.
  Se verificó en su lugar a nivel de CSS compilado (recorriendo
  `document.styleSheets` con `@layer` incluido) que las reglas
  `.focus\:not-sr-only:focus`, `.focus\:fixed:focus`,
  `.focus\:bg-foreground:focus`, etc. existen con las propiedades
  correctas — el código es correcto, es la interacción en vivo la que no
  se pudo probar acá. Un usuario real tabulando no debería tener este
  problema.

**E. Pulido del panel admin** ✅ HECHO Y VERIFICADO
- [x] Dashboard (`admin/(dashboard)/page.tsx`): sección "Actividad
  reciente" debajo de las 3 stat cards — últimos 6 productos por
  `updatedAt desc`, con link a editar, categoría, precio, y "creado"/
  "editado" + fecha (comparando `createdAt`/`updatedAt`). Sin librería
  de gráficos, una lista alcanza.
- [x] Paginación en `/admin/productos`: `PAGE_SIZE = 10`, `skip`/`take` +
  `count` en paralelo con `Promise.all`, controles "Anterior"/"Siguiente"
  que preservan `?q=` en la URL. El límite se probó con los 20 productos
  reales de la categoría F: página 1 = los 10 más nuevos, página 2 = los
  10 restantes (verificado por contenido real, no solo por código).
- [x] Buscador por nombre en `/admin/productos` (`?q=`, `contains`
  case-insensitive, mismo patrón que el buscador del catálogo público).
  Probado con `?q=medias` → filtra exactamente a los 3 productos de
  medias, ni uno más ni uno menos.
- [x] Loading states: ya cubierto en la categoría C
  (`admin/(dashboard)/loading.tsx`), compartido por dashboard/productos/
  categorías.
- [x] **Bug real encontrado y arreglado** (no estaba en el checklist
  original, pero cae directo en "pulido del panel admin"): el layout de
  admin (`admin/(dashboard)/layout.tsx`) tenía un sidebar fijo `w-60` sin
  ninguna alternativa en mobile — igual al bug de nav del Día 4 en el
  storefront, pero nunca se había arreglado del lado admin. Confirmado
  con `scrollWidth` (529px) vs `clientWidth` (375px) en
  `/admin`, `/admin/productos` y `/admin/categorias` — las tres rotas
  desbordaban. Se arregló con el mismo patrón que ya existe en
  `mobile-nav.tsx` del storefront: `src/components/admin/admin-mobile-nav.tsx`
  (nuevo, hamburguesa + Sheet con los mismos links + el logout que antes
  solo vivía en el sidebar de escritorio) + una barra superior mobile-only
  en el layout (`sm:hidden`), sidebar de escritorio ahora `hidden sm:flex`.
  Verificado: `scrollWidth === clientWidth` (375) en las tres rutas
  después del fix.

**Nota de entorno** (mismo tipo de limitación ya documentada varias veces
en Día 3/4 y en la categoría D de este pase): en `/admin/productos`
específicamente, esta pestaña de pruebas se queda mostrando el skeleton
de `loading.tsx` indefinidamente — ni con reload duro
(`window.location.reload()`, `document.readyState === "complete"`) ni en
una pestaña nueva se termina de componer el swap visual del boundary de
Suspense, aunque el HTML que manda el servidor sí trae el contenido real
completo (confirmado bajando la respuesta cruda con `fetch()` +
`DOMParser`: la tabla, la paginación y el buscador están ahí, con los
datos correctos). Se verificó la funcionalidad real igual, por ese
camino: página 1 trae los 10 productos más nuevos, página 2 trae los 10
restantes, `?q=medias` filtra a los 3 productos correctos, y el input de
búsqueda refleja el término buscado. El botón "Anterior" en la página 1
es un `<button disabled>` real (no un link con `disabled` puesto encima,
que no bloquearía la navegación en un `<a>`). Es limitación del entorno
de pruebas, no del código — otras páginas con el mismo `loading.tsx`
(`/admin` sí resolvió bien en esta misma sesión) sugieren que es más una
cuestión de timing/scheduler en esta pestaña específica que un problema
sistemático.

**F. Datos de demo (seed)** ✅ HECHO Y VERIFICADO
- [x] Catálogo ampliado de 9 a **20 productos**, categoría nueva
  **"Botines de entrenamiento"** (slug `entrenamiento`) sumada a las 4
  que ya había → 5 categorías. 11 productos nuevos en `prisma/seed.ts`
  (2 botines, 2 pelotas, 2 canilleras, 2 medias, 3 entrenamiento), mismo
  estilo de copy/precios que los 9 originales. Corrido `npm run db:seed`
  contra la base real — idempotente (upsert por slug), no pisó nada de
  lo que ya había.
- [x] Galería de imágenes en la PDP: confirmado que `ProductImage` ya
  soportaba múltiples por producto (no hizo falta tocar el schema).
  Se construyó `src/components/product-gallery.tsx` (Client Component
  con selector de miniaturas, foto principal + tira de thumbnails,
  `aria-label`/`aria-current` en cada miniatura) y se integró en la PDP
  reemplazando la imagen estática. Con 1 sola foto (o ninguna) se ve
  igual que antes — la tira de miniaturas solo aparece con 2+ fotos.
  **Verificado con click real** (no simulado): en `/producto/gambeta-veloz-fg`
  se clickeó la segunda miniatura y se confirmó por `<img src>` que la
  foto principal cambió a la segunda URL de Cloudinary — funciona de
  punta a punta. Se sumó una 2ª foto de galería a 3 productos
  representativos (`gambeta-veloz-fg`, `gambeta-elite-x`,
  `pelota-matchball-n5`) en vez de a los 20 — criterio propio: mostrar la
  capacidad real en una muestra en vez de gastar mucho tiempo bajando
  fotos para cada producto, ver nota de `prisma/seed-images.ts`.
- [x] 6 de los 11 productos nuevos tienen foto real (los 3 de
  "entrenamiento" + 2 pelotas + 1 botín); los otros 5 (2 canilleras, 2
  medias, 1 botín) usan el fallback de ícono+texto por categoría que ya
  existía — mismo patrón intencional documentado en el pase de diseño
  anterior, no es un hueco. 9 fotos nuevas (Unsplash, licencia libre)
  subidas a Cloudinary vía `prisma/seed-images.ts` extendido con una
  segunda lista (`GALLERY_ADDITIONS`) que suma una foto sin borrar la
  que ya había, a diferencia de `IMAGES` que sí reemplaza — evita que
  correr el script de nuevo pise la primera foto de un producto con
  galería.
- [x] `Botines Gambeta Elite X` sigue `SOLD_OUT` (badge "Agotado"
  confirmado en el catálogo).

**G. Tests** ✅ HECHO Y VERIFICADO
- [x] Vitest configurado (`vitest.config.mts`, `vitest.setup.ts`,
  `__tests__/` en la raíz), siguiendo la guía oficial de Next 16
  (`node_modules/next/dist/docs/01-app/02-guides/testing/vitest.md`).
  13 tests en 3 archivos:
  - `format.test.ts` (`formatPrice`): número redondo, cero, números
    grandes con miles, redondeo de decimales. Nota real: `Intl` en
    `es-AR` pone un espacio **no separable** (`\u00A0`, no un espacio
    normal) entre "$" y el número — confirmado inspeccionando el output
    real carácter por carácter antes de escribir las aserciones, no
    adivinado (si se hubiera usado un espacio normal el test habría
    fallado en silencio... no, habría fallado ruidosamente, pero por el
    motivo equivocado).
  - `slugify.test.ts`: acentos/ñ (contenido en español), símbolos como
    "N°5" colapsando a un solo guión, trim de guiones al borde.
  - `cart-context.test.tsx`: como `CartProvider` es Context + hooks y no
    un reducer puro, se testea renderizando un componente arnés chico
    con `@testing-library/react` — merge de cantidad al agregar la misma
    variante dos veces, variantes distintas quedan en líneas separadas,
    `updateQuantity` exacto, `updateQuantity(0)` saca la línea igual que
    `removeItem`.
- [x] Playwright (`@playwright/test` estándar, no el wrapper experimental
  `next experimental-test` — sin flag experimental de por medio, mejor
  documentado). `playwright.config.ts` (solo Chromium, `webServer`
  reusa el dev server si ya está corriendo) + `e2e/purchase-flow.spec.ts`:
  catálogo → click en producto → PDP → elegir talle → agregar al
  carrito → toast → `/carrito` → click "Finalizar por WhatsApp" →
  confirma que la URL generada es realmente un link de `wa.me` con el
  producto, el talle y el total en el mensaje.
- [x] Scripts en `package.json`: `test` (`vitest run`, no watch — así
  `npm run test` termina y devuelve un exit code, no queda colgado),
  `test:watch`, `test:e2e`, `typecheck` (`tsc --noEmit`).
- [x] Los 4 comandos (`lint`, `typecheck`, `test`, `test:e2e`) + `build`
  pasan limpios.

**Bugs/quirks reales encontrados armando esto** (documentados porque son
el tipo de cosa que puede volver a pasar):
- **Conflicto de dependencias al instalar `@vitejs/plugin-react`**: la
  versión más nueva (6.x) trae `@rolldown/plugin-babel`, que pide
  `@babel/core@^8`, mientras que `shadcn` (ya en el proyecto) pide
  `@babel/core@^7` — `npm install` fallaba con `ERESOLVE`. Se resolvió
  pineando `@vitejs/plugin-react@5.2.0` (última versión antes de ese
  cambio) en vez de forzar con `--legacy-peer-deps`.
- **Vitest con el pool default ("forks") se cuelga en este entorno**:
  los 3 archivos de test tiraban timeout ("Failed to start forks
  worker"). La causa más probable es el espacio en la ruta del repo
  (`C:\Trabajos\Botines E-commerce`), un disparador conocido de
  problemas al spawnear procesos en Windows. Se cambió a `pool: "threads"`
  en `vitest.config.mts` (usa `worker_threads` en vez de procesos hijo)
  y desapareció.
- **`@testing-library/react` no limpiaba el DOM entre tests**: sin
  `test.globals: true` en la config (no se usó, para seguir el patrón de
  imports explícitos de la guía oficial), el auto-cleanup de Testing
  Library nunca se registra solo. Se agregó `afterEach(() => cleanup())`
  a mano en `vitest.setup.ts` — sin esto, `cart-context.test.tsx` tiraba
  "multiple elements found" a partir del segundo test del archivo.
- **wa.me redirige a `api.whatsapp.com` casi instantáneo**: el primer
  intento del test e2e seguía el popup con `waitForEvent("popup")` +
  `waitForLoadState`, y para cuando se leía `popup.url()` ya había
  redirigido — el test comparaba contra el host equivocado. Se
  resolvió interceptando `window.open` directamente en la página
  (`page.evaluate` reemplazando `window.open` antes del click) para
  capturar la URL exacta que arma `buildWhatsappCheckoutUrl` (en
  `src/lib/whatsapp.ts`), sin depender de que el popup navegue.
- **Un `npm run build` se cayó una vez con un crash nativo de worker de
  Windows** (exit code `3221226505`, sin relación con el código — pasó
  limpio al reintentar en el momento y de nuevo acá). Si vuelve a pasar
  en el futuro, reintentar antes de asumir que es un error real.

**H. Housekeeping** ✅ HECHO Y VERIFICADO
- [x] `README.md`: sección "Estado del proyecto" reescrita reflejando lo
  que realmente está hecho hoy (carrito, CRUD admin completo, galería de
  fotos, SEO/OG, accesibilidad, tests — todo lo de este pase y de los
  anteriores), sacada la referencia a la ruta local del plan
  (`C:\Users\facup\...`), y apunta a `BACKLOG.md` como fuente de verdad
  en vez de a un archivo que no existe en el repo. Tabla de scripts
  completada con `lint`/`typecheck`/`test`/`test:watch`/`test:e2e`, que
  no estaban. Confirmado por grep que no queda ninguna otra referencia a
  rutas locales (`C:\Users\facup`) en el repo fuera de `BACKLOG.md`
  mismo (que sí es un log de trabajo interno, no un doc público — tiene
  sentido que mencione la carpeta scratch donde se bajaron las fotos).
- [x] `BACKLOG.md` actualizado en cada iteración de este pase (no solo al
  final) — política ya seguida desde la categoría C en adelante.

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
