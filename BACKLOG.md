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

## Día 2 — Carrito multi-producto
- [ ] `CartContext` + persistencia en localStorage
- [ ] Botón "Agregar al carrito" en PDP (además de la compra directa que ya existe)
- [ ] Página `/carrito` real: listar items, cambiar cantidad, quitar, total
- [ ] Checkout: un solo mensaje de WhatsApp con todos los items del carrito
- [ ] Indicador de cantidad de items en el header

## Día 3 — Panel admin completo
- [ ] Crear producto (formulario + Server Action + validación con zod)
- [ ] Editar producto
- [ ] Carga de imágenes vía Cloudinary Upload Widget (drag & drop, múltiples, reordenar)
- [ ] Duplicar producto
- [ ] Edición rápida inline (estado, precio) desde la tabla
- [ ] CRUD de categorías (crear/editar/borrar)
- [ ] Borrar producto (con confirmación)

## Día 4 — Deploy y pulido
- [ ] Conectar repo a GitHub (remoto + primer push)
- [ ] Deploy a Vercel + variables de entorno
- [ ] Verificar con datos reales (TiDB + Cloudinary ya conectados)
- [ ] QA end-to-end mobile: flujo de compra completo, carga de producto completa
- [ ] Revisar Core Web Vitals / performance básica
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
  cuenta para cualquier botón nuevo que renderice como link.
