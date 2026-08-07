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
- DB real (TiDB) y Cloudinary: el usuario ya creó las cuentas, faltan las
  credenciales en `.env` (las pega él mismo, no van por chat).
- GitHub: no hay repo remoto conectado todavía ni `gh` CLI instalado en esta
  máquina — falta que el usuario cree el repo (privado) y pase la URL.
- Vercel: se aborda recién en el Día 4, no bloquea el trabajo de Días 2-3.
