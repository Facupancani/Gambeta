import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Botines, pelotas, canilleras y medias para jugadores amateurs.",
};

type SearchParams = Promise<{ categoria?: string; q?: string }>;

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { categoria, q } = await searchParams;

  const [categories, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: {
        status: { not: "PAUSED" },
        category: categoria ? { slug: categoria } : undefined,
        name: q ? { contains: q } : undefined,
      },
      include: {
        category: true,
        images: { orderBy: { order: "asc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-heading text-3xl font-bold">Catálogo</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/catalogo"
          className={cn(
            "rounded-full border border-border px-4 py-1.5 text-sm",
            !categoria && "border-primary bg-primary/10 text-primary"
          )}
        >
          Todos
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/catalogo?categoria=${category.slug}`}
            className={cn(
              "rounded-full border border-border px-4 py-1.5 text-sm",
              categoria === category.slug &&
                "border-primary bg-primary/10 text-primary"
            )}
          >
            {category.name}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="mt-12 text-muted-foreground">
          No encontramos productos con ese filtro.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                slug: product.slug,
                name: product.name,
                price: product.price,
                status: product.status,
                categoryName: product.category.name,
                imageUrl: product.images[0]?.url,
              }}
            />
          ))}
        </div>
      )}
    </main>
  );
}
