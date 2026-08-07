import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";

export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    include: {
      category: true,
      images: { orderBy: { order: "asc" }, take: 1 },
      variants: { orderBy: { createdAt: "asc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  return (
    <main>
      <section className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-20 sm:py-28">
        <p className="font-heading text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Botines · Pelotas · Canilleras · Medias
        </p>
        <h1 className="font-heading text-4xl font-bold leading-tight sm:text-6xl">
          Jugás vos.
          <br />
          El equipo lo ponemos nosotros.
        </h1>
        <p className="max-w-lg text-lg text-muted-foreground">
          Botines y accesorios pensados para quien juega por pasión, no por
          vitrina. Elegís en el catálogo, coordinamos todo por WhatsApp.
        </p>
        <div className="flex gap-3">
          <Button
            size="lg"
            nativeButton={false}
            render={<Link href="/catalogo">Ver catálogo</Link>}
          />
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            render={<Link href="/nosotros">Conocenos</Link>}
          />
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-24">
          <div className="flex items-baseline justify-between">
            <h2 className="font-heading text-2xl font-bold">Recién llegados</h2>
            <Link href="/catalogo" className="text-sm text-foreground underline-offset-4 hover:underline">
              Ver todo
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                  status: product.status,
                  categoryName: product.category.name,
                  categorySlug: product.category.slug,
                  imageUrl: product.images[0]?.url,
                  quickAddVariantId: product.variants[0]?.id,
                  quickAddVariantSize: product.variants[0]?.size,
                }}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
