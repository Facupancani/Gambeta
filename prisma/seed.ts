import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

/**
 * Seeds an admin user + a realistic-looking catalog so the site looks
 * complete for the first demo, before real product data/photos exist.
 * Safe to re-run: categories/products are upserted by slug.
 */

const CATEGORIES = [
  { name: "Botines", slug: "botines" },
  { name: "Pelotas", slug: "pelotas" },
  { name: "Canilleras", slug: "canilleras" },
  { name: "Medias", slug: "medias" },
] as const;

const PRODUCTS: Array<{
  slug: string;
  name: string;
  description: string;
  price: number;
  category: (typeof CATEGORIES)[number]["slug"];
  status?: "ACTIVE" | "PAUSED" | "SOLD_OUT";
  variants: Array<{ size: string; color?: string }>;
}> = [
  {
    slug: "gambeta-veloz-fg",
    name: "Botines Gambeta Veloz FG",
    description:
      "Botines de tapones firmes pensados para jugadores rápidos. Corte bajo, suela liviana y agarre en cancha de césped natural o sintético de alta densidad.",
    price: 62000,
    category: "botines",
    variants: [
      { size: "38", color: "Negro/Verde" },
      { size: "39", color: "Negro/Verde" },
      { size: "40", color: "Negro/Verde" },
      { size: "41", color: "Negro/Verde" },
      { size: "42", color: "Negro/Verde" },
      { size: "43", color: "Negro/Verde" },
    ],
  },
  {
    slug: "gambeta-control-ag",
    name: "Botines Gambeta Control AG",
    description:
      "Pensados para quienes priorizan el toque y el control del balón. Zona de contacto texturada y plantilla con buena amortiguación.",
    price: 58000,
    category: "botines",
    variants: [
      { size: "39", color: "Blanco/Dorado" },
      { size: "40", color: "Blanco/Dorado" },
      { size: "41", color: "Blanco/Dorado" },
      { size: "42", color: "Blanco/Dorado" },
      { size: "43", color: "Blanco/Dorado" },
    ],
  },
  {
    slug: "society-turf-pro",
    name: "Botines Society Turf Pro",
    description:
      "Suela multitaco de goma pensada para césped sintético corto (fútbol 5 / society). Buena tracción y durabilidad para uso frecuente.",
    price: 49000,
    category: "botines",
    variants: [
      { size: "38", color: "Negro" },
      { size: "39", color: "Negro" },
      { size: "40", color: "Negro" },
      { size: "41", color: "Negro" },
      { size: "42", color: "Negro" },
      { size: "43", color: "Negro" },
      { size: "44", color: "Negro" },
    ],
  },
  {
    slug: "gambeta-elite-x",
    name: "Botines Gambeta Elite X",
    description:
      "Línea premium de la marca: upper sintético de bajo peso, cuello ajustable y diseño pensado para jugadores que buscan destacarse en cancha.",
    price: 74000,
    category: "botines",
    status: "SOLD_OUT",
    variants: [
      { size: "40", color: "Rojo/Negro" },
      { size: "41", color: "Rojo/Negro" },
      { size: "42", color: "Rojo/Negro" },
    ],
  },
  {
    slug: "pelota-matchball-n5",
    name: "Pelota de fútbol N°5 Matchball",
    description:
      "Pelota reglamentaria N°5, cámara butílica y cubierta termosellada para mantener la forma en partidos exigentes.",
    price: 28000,
    category: "pelotas",
    variants: [{ size: "N°5" }],
  },
  {
    slug: "pelota-society-n4",
    name: "Pelota de fútbol 5 N°4",
    description: "Pelota N°4 pensada para canchas de fútbol 5 / society, buen agarre y rebote controlado.",
    price: 22000,
    category: "pelotas",
    variants: [{ size: "N°4" }],
  },
  {
    slug: "canilleras-pro-compression",
    name: "Canilleras Pro Compression",
    description:
      "Canilleras livianas con manga de compresión incluida, protección rígida sin perder movilidad.",
    price: 15000,
    category: "canilleras",
    variants: [
      { size: "S" },
      { size: "M" },
      { size: "L" },
    ],
  },
  {
    slug: "canilleras-classic",
    name: "Canilleras Classic con tobillera",
    description: "Canilleras clásicas con protección de tobillo, sujeción con velcro ajustable.",
    price: 12000,
    category: "canilleras",
    variants: [{ size: "Único" }],
  },
  {
    slug: "medias-largas-clasicas",
    name: "Medias de fútbol largas",
    description: "Medias altas hasta la rodilla, elástico firme para sujetar la canillera, varios colores disponibles.",
    price: 8000,
    category: "medias",
    variants: [
      { size: "Único", color: "Blanco" },
      { size: "Único", color: "Negro" },
      { size: "Único", color: "Azul" },
    ],
  },
];

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await prisma.adminUser.upsert({
      where: { email: adminEmail },
      update: {},
      create: { email: adminEmail, name: "Admin", passwordHash },
    });
    console.log(`✔ Admin listo: ${adminEmail}`);
  } else {
    console.warn(
      "⚠ ADMIN_EMAIL / ADMIN_PASSWORD no están definidos en .env — no se creó ningún admin."
    );
  }

  const categoryIdBySlug = new Map<string, string>();
  for (const category of CATEGORIES) {
    const saved = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category,
    });
    categoryIdBySlug.set(category.slug, saved.id);
  }
  console.log(`✔ ${CATEGORIES.length} categorías listas`);

  for (const product of PRODUCTS) {
    const categoryId = categoryIdBySlug.get(product.category);
    if (!categoryId) continue;

    const existing = await prisma.product.findUnique({
      where: { slug: product.slug },
    });
    if (existing) continue; // no pisamos ediciones manuales ya hechas desde el panel

    await prisma.product.create({
      data: {
        slug: product.slug,
        name: product.name,
        description: product.description,
        price: product.price,
        status: product.status ?? "ACTIVE",
        categoryId,
        variants: { create: product.variants },
      },
    });
  }
  console.log(`✔ Catálogo de ejemplo listo (${PRODUCTS.length} productos)`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
