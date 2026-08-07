import "dotenv/config";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "../src/lib/prisma";

/**
 * One-off script: uploads the 8-9 free-license stock photos (Unsplash /
 * Pexels / Wikimedia Commons, all approved by the user — see BACKLOG.md
 * "Pase de diseño") to Cloudinary via the existing unsigned upload preset,
 * then attaches each as the (single) ProductImage for its seed product.
 *
 * Not wired into `npm run db:seed` on purpose — this touches real Cloudinary
 * storage and is meant to run once. Re-running is still safe (it replaces
 * any existing images for these product slugs instead of duplicating them),
 * but STOCK_DIR below points at a session-scoped scratch folder that isn't
 * committed to the repo and won't exist later — the images already live in
 * Cloudinary and are linked in the DB, so there's normally no need to
 * re-run this. Kept mainly as a record of what was uploaded and from where
 * (see the `source` field on each entry). To actually re-run: re-download
 * the files listed below into some local folder and point STOCK_DIR at it.
 *
 * Usage: npx tsx prisma/seed-images.ts
 */

const STOCK_DIR = path.resolve(
  "C:/Users/facup/AppData/Local/Temp/claude/C--Trabajos-Botines-E-commerce/9720e153-ee80-4e18-853c-b105933a0b72/scratchpad/stock-photos"
);

const IMAGES: Array<{
  productSlug: string;
  file: string;
  source: string;
}> = [
  {
    productSlug: "gambeta-veloz-fg",
    file: "gambeta-veloz-fg.jpg",
    source: "Unsplash — Braden Hopkins, photo-1684355414454-ed132f6c41cd",
  },
  {
    productSlug: "gambeta-control-ag",
    file: "gambeta-control-ag.jpg",
    source: "Unsplash — Fachry Zella Devandra, photo-1514514757092-71ebbc3db4e6",
  },
  {
    productSlug: "society-turf-pro",
    file: "society-turf-pro.jpg",
    source: "Unsplash — Fachry Zella Devandra, photo-1536121884011-9c4fd4ee19c6",
  },
  {
    productSlug: "gambeta-elite-x",
    file: "gambeta-elite-x.jpg",
    source: "Unsplash — Jonathan Ward, photo-1620650663852-9ff13eb84d8f",
  },
  {
    productSlug: "pelota-matchball-n5",
    file: "pelota-matchball-n5.jpg",
    source: "Unsplash — photo-1543351611-58f69d7c1781",
  },
  {
    productSlug: "pelota-society-n4",
    file: "pelota-society-n4.jpg",
    source: "Unsplash — photo-1721257001239-60fe6a768dbb",
  },
  {
    productSlug: "canilleras-pro-compression",
    file: "canilleras-pro-compression.png",
    source:
      "Wikimedia Commons — Schienbeinschützer_adidas.png by Luxo, CC-BY-SA-3.0",
  },
  {
    productSlug: "canilleras-classic",
    file: "canilleras-classic.jpg",
    source: "Wikimedia Commons — Shinguard.jpg, CC-BY-SA",
  },
  {
    productSlug: "medias-largas-clasicas",
    file: "medias-largas-clasicas.jpg",
    source: "Pexels — Alfredo Dacosta, pexels-photo-35571216",
  },
];

async function uploadToCloudinary(filePath: string): Promise<{
  secure_url: string;
  public_id: string;
}> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Faltan NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME / NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET en .env"
    );
  }

  const buffer = await readFile(filePath);
  const blob = new Blob([buffer]);
  const form = new FormData();
  form.append("file", blob, path.basename(filePath));
  form.append("upload_preset", uploadPreset);
  form.append("folder", "gambeta/seed");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: form }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cloudinary upload failed (${res.status}): ${text}`);
  }
  return res.json();
}

async function main() {
  for (const image of IMAGES) {
    const product = await prisma.product.findUnique({
      where: { slug: image.productSlug },
    });
    if (!product) {
      console.warn(`⚠ Producto no encontrado: ${image.productSlug}, salteo`);
      continue;
    }

    const filePath = path.join(STOCK_DIR, image.file);
    console.log(`↑ Subiendo ${image.file} para ${image.productSlug}...`);
    const uploaded = await uploadToCloudinary(filePath);

    // Reemplaza cualquier imagen previa de este producto (script re-corrible).
    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: uploaded.secure_url,
        publicId: uploaded.public_id,
        order: 0,
      },
    });
    console.log(`  ✔ ${uploaded.secure_url}  (${image.source})`);
  }
  console.log("✔ Listo.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
