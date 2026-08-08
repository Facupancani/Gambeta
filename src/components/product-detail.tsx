"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/format";
import { ProductGallery, pickImagesForColor } from "@/components/product-gallery";
import { ProductBuyButton } from "@/components/product-buy-button";

type GalleryImage = { url: string; color?: string | null };
type Variant = { id: string; size: string; color?: string | null };

/**
 * Owns the "which color is selected" state and wires it between the two
 * previously-independent client islands on the PDP (`ProductGallery` and
 * `ProductBuyButton`, which sit on opposite sides of the page's two-column
 * grid, not as siblings) — picking a size/color in the buy button now
 * updates which photos the gallery shows. Neither child component knows
 * about the other; this is the only place that does. The static text
 * (category/name/price/description) moved in here too since it sits
 * between them in the grid — Client Components are still server-rendered
 * on first load (same as any Server Component) per
 * node_modules/next/dist/docs, so there's no SEO/perf cost to that.
 */
export function ProductDetail({
  images,
  productName,
  categoryName,
  categorySlug,
  description,
  price,
  productSlug,
  variants,
  soldOut,
}: {
  images: GalleryImage[];
  productName: string;
  categoryName: string;
  categorySlug: string;
  description: string;
  price: number;
  productSlug: string;
  variants: Variant[];
  soldOut: boolean;
}) {
  const [selectedColor, setSelectedColor] = useState<string | null | undefined>(
    variants[0]?.color
  );

  // Same rule the gallery uses internally, so the cart thumbnail matches
  // whatever photo is actually showing instead of always the first upload.
  const cartImage = pickImagesForColor(images, selectedColor)[0];

  return (
    <div className="grid gap-10 sm:grid-cols-2">
      <ProductGallery
        images={images}
        productName={productName}
        categorySlug={categorySlug}
        categoryName={categoryName}
        selectedColor={selectedColor}
      />

      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {categoryName}
        </p>
        <h1 className="font-heading mt-1 text-3xl font-bold">{productName}</h1>
        <p className="mt-3 text-2xl font-semibold text-foreground">
          {formatPrice(price)}
        </p>
        <p className="mt-6 text-muted-foreground">{description}</p>

        <div className="mt-8">
          <ProductBuyButton
            productSlug={productSlug}
            productName={productName}
            price={price}
            imageUrl={cartImage?.url}
            variants={variants}
            soldOut={soldOut}
            onVariantChange={(variant) => setSelectedColor(variant.color)}
          />
        </div>
      </div>
    </div>
  );
}
