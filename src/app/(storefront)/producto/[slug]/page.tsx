import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { ProductBuyButton } from "@/components/product-buy-button";
import { CategoryIcon } from "@/lib/category-icon";

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
        <div className="relative aspect-square overflow-hidden rounded-xl bg-secondary">
          {mainImage ? (
            <Image
              src={mainImage.url}
              alt={product.name}
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <CategoryIcon
                categorySlug={product.category.slug}
                className="size-16"
                strokeWidth={1.25}
              />
              <span className="text-sm">{product.category.name}</span>
            </div>
          )}
        </div>

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
    </main>
  );
}
