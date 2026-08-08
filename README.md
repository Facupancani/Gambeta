# Gambeta

E-commerce de botines de fútbol y accesorios. Catálogo público + checkout vía
WhatsApp (sin pasarela de pago) + panel de administración para cargar
productos sin conocimientos técnicos.

## Stack

- **Next.js 16** (App Router) — frontend y backend en un solo proyecto.
- **Prisma 7** + **MySQL** (vía [TiDB Cloud Serverless](https://tidbcloud.com), free tier) con el driver adapter `@prisma/adapter-mariadb`.
- **Tailwind CSS v4** + **shadcn/ui** (sobre Base UI, no Radix) para los componentes.
- **jose** para sesiones de admin (JWT en cookie httpOnly) — sin librería de auth externa, ver `src/lib/session.ts`.
- **Cloudinary** para las imágenes de producto.
- Deploy en **Vercel** (frontend + API en el mismo lugar).

## Setup

1. `npm install`
2. Copiá `.env.example` a `.env` y completá:
   - `DATABASE_URL`: TiDB Cloud → tu cluster → **Connect** → elegí **Prisma**, copiá el connection string.
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` y `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`: dashboard de Cloudinary → creá un upload preset **unsigned** (Settings → Upload).
   - `SESSION_SECRET`: generalo con `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`.
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD`: credenciales del primer usuario admin (se hashea al correr el seed).
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`: número de WhatsApp para el checkout, formato internacional sin "+".
3. `npx prisma migrate dev --name init` — crea las tablas en TiDB.
4. `npm run db:seed` — crea el admin y carga un catálogo de ejemplo.
5. `npm run dev` — abre [http://localhost:3000](http://localhost:3000). El panel admin está en `/admin/login`.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit`, sin generar archivos |
| `npm run test` | Tests unitarios (Vitest), una sola pasada |
| `npm run test:watch` | Tests unitarios en modo watch |
| `npm run test:e2e` | Tests end-to-end (Playwright) contra el dev server |
| `npm run db:migrate` | Corre migraciones de Prisma |
| `npm run db:seed` | Crea admin + catálogo de ejemplo |
| `npm run db:studio` | Abre Prisma Studio para ver/editar datos a mano |

## Estado del proyecto

Fuente de verdad del trabajo pendiente: `BACKLOG.md`, en este mismo repo.

**Hecho**: setup del proyecto, modelo de datos, auth de admin, carrito
multi-producto, checkout por WhatsApp (un producto o el carrito entero),
CRUD completo del panel admin (crear/editar/duplicar/borrar productos,
carga de imágenes vía Cloudinary, categorías, edición rápida inline,
paginación y búsqueda), Home/Catálogo/Producto (con galería de fotos)/
institucionales, identidad visual (tipografía Bebas Neue + Inter, paleta
de un acento, hero e iconografía propia), SEO/OG completo (metadata,
sitemap, robots, favicon/OG generados por código), accesibilidad básica
(skip link, contraste medido, `aria-label`s), páginas de error/404/
loading a medida, y una suite de tests (Vitest + Playwright) cubriendo la
lógica core y el flujo de compra de punta a punta.

**Pendiente**: deploy a Vercel — bloqueado, necesita que el usuario haga
login en vercel.com o autentique la CLI (ver el bloqueo documentado en
`BACKLOG.md`, sección "Día 4"). Es la única pieza que falta para tener el
sitio completo online.
