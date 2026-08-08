import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductDetail } from "@/components/product-detail";
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
      <ProductDetail
        images={product.images}
        productName={product.name}
        categoryName={product.category.name}
        categorySlug={product.category.slug}
        description={product.description}
        price={product.price}
        productSlug={product.slug}
        variants={product.variants}
        soldOut={product.status === "SOLD_OUT"}
      />

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
