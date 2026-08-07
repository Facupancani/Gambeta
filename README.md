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
| `npm run db:migrate` | Corre migraciones de Prisma |
| `npm run db:seed` | Crea admin + catálogo de ejemplo |
| `npm run db:studio` | Abre Prisma Studio para ver/editar datos a mano |

## Estado del proyecto

Ver el plan y el backlog completo en `C:\Users\facup\.claude\plans\contexto-quiero-desarrollar-un-sleepy-possum.md`.

Hecho hasta ahora: setup del proyecto, modelo de datos, auth de admin, Home/Catálogo/Producto/institucionales, checkout de un solo producto por WhatsApp, vistas de lectura del panel admin, SEO básico (sitemap/robots/metadata).

Pendiente: carrito multi-producto, CRUD completo del panel admin (crear/editar productos, carga de imágenes, duplicar, edición rápida), deploy a Vercel, identidad visual definitiva (el nombre "Gambeta" y la paleta ya están aplicados, pero es la primera pasada).
