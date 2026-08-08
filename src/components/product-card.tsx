"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { CategoryIcon } from "@/lib/category-icon";
import { useCart } from "@/lib/cart-context";

export type ProductCardData = {
  slug: string;
  name: string;
  price: number;
  status: "ACTIVE" | "PAUSED" | "SOLD_OUT";
  categoryName: string;
  categorySlug: string;
  imageUrl?: string | null;
  /** First variant, used only for the quick-add "+" button — no size picker on the card. */
  quickAddVariantId?: string | null;
  quickAddVariantSize?: string | null;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const { addItem } = useCart();
  const canQuickAdd = product.status === "ACTIVE" && !!product.quickAddVariantId;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.quickAddVariantId) return;
    addItem({
      variantId: product.quickAddVariantId,
      productSlug: product.slug,
      productName: product.name,
      price: product.price,
      size: product.quickAddVariantSize ?? "",
      imageUrl: product.imageUrl,
    });
    toast.success("Agregado al carrito", { description: product.name });
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-foreground/40">
      {/* `contents` keeps the outer div's flex layout in charge while still
          making the whole card (image + text) one native click target —
          the quick-add button below sits outside this anchor so it isn't
          an invalid <button> nested inside an <a>. */}
      <Link href={`/producto/${product.slug}`} className="contents">
        <div className="relative aspect-square w-full overflow-hidden bg-secondary">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <CategoryIcon
                categorySlug={product.categorySlug}
                className="size-10"
                strokeWidth={1.25}
              />
              <span className="text-xs">{product.categoryName}</span>
            </div>
          )}
          {product.status === "SOLD_OUT" && (
            <Badge variant="secondary" className="absolute left-3 top-3">
              Agotado
            </Badge>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-1 p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {product.categoryName}
          </p>
          <h3 className="font-heading font-medium leading-snug">
            {product.name}
          </h3>
          <p className="mt-auto pt-2 font-semibold text-foreground">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
      {canQuickAdd && (
        <button
          type="button"
          onClick={handleQuickAdd}
          aria-label={`Agregar ${product.name} al carrito`}
          className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-sm backdrop-blur transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
        >
          <Plus className="size-4" />
        </button>
      )}
    </div>
  );
}
