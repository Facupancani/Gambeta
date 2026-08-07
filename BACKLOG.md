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
