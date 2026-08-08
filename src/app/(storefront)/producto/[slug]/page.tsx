import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { ProductBuyButton } from "@/components/product-buy-button";
import { ProductGallery } from "@/components/product-gallery";
import { ProductCard } from "@/components/product-card";

type Params = Promise<{ slug: string }>;

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: { orderBy: { order: "asc" } },
      variants: true,
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: product.images[0]
      ? { images: [{ url: product.images[0].url }] }
      : undefined,
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product || product.status === "PAUSED") notFound();

  const mainImage = product.images[0];

  // Same category, current product excluded — a plain "browse the rest of
  // the category" cross-sell, not a similarity/recommendation algorithm.
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      status: { not: "PAUSED" },
      id: { not: product.id },
    },
    include: {
      category: true,
      images: { orderBy: { order: "asc" }, take: 1 },
      variants: { orderBy: { createdAt: "asc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <Link
        href="/catalogo"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Volver al catálogo
      </Link>
      <div className="grid gap-10 sm:grid-cols-2">
        <ProductGallery
          images={product.images}
          productName={product.name}
          categorySlug={product.category.slug}
          categoryName={product.category.name}
        />

        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {product.category.name}
          </p>
          <h1 className="font-heading mt-1 text-3xl font-bold">
            {product.name}
          </h1>
          <p className="mt-3 text-2xl font-semibold text-foreground">
            {formatPrice(product.price)}
          </p>
          <p className="mt-6 text-muted-foreground">{product.description}</p>

          <div className="mt-8">
            <ProductBuyButton
              productSlug={product.slug}
              productName={product.name}
              price={product.price}
              imageUrl={mainImage?.url}
              variants={product.variants}
              soldOut={product.status === "SOLD_OUT"}
            />
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-16 border-t border-border/60 pt-10">
          <h2 className="font-heading text-xl font-bold">
            También te puede interesar
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {relatedProducts.map((related) => (
              <ProductCard
                key={related.id}
                product={{
                  slug: related.slug,
                  name: related.name,
                  price: related.price,
                  status: related.status,
                  categoryName: related.category.name,
                  categorySlug: related.category.slug,
                  imageUrl: related.images[0]?.url,
                  quickAddVariantId: related.variants[0]?.id,
                  quickAddVariantSize: related.variants[0]?.size,
                }}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
