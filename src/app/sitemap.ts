import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const STATIC_ROUTES = ["", "/catalogo", "/nosotros", "/envios-y-pagos", "/contacto", "/faq"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const products = await prisma.product.findMany({
    where: { status: { not: "PAUSED" } },
    select: { slug: true, updatedAt: true },
  });

  return [
    ...STATIC_ROUTES.map((route) => ({
      url: `${base}${route}`,
      lastModified: new Date(),
    })),
    ...products.map((product) => ({
      url: `${base}/producto/${product.slug}`,
      lastModified: product.updatedAt,
    })),
  ];
}
