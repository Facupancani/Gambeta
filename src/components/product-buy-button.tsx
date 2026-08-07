"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { buildWhatsappCheckoutUrl } from "@/lib/whatsapp";
import { useCart } from "@/lib/cart-context";
import { cn } from "@/lib/utils";

type Variant = { id: string; size: string; color?: string | null };

export function ProductBuyButton({
  productSlug,
  productName,
  price,
  imageUrl,
  variants,
  soldOut,
}: {
  productSlug: string;
  productName: string;
  price: number;
  imageUrl?: string | null;
  variants: Variant[];
  soldOut: boolean;
}) {
  const [selected, setSelected] = useState<Variant | undefined>(variants[0]);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (!selected) return;
    addItem({
      variantId: selected.id,
      productSlug,
      productName,
      price,
      size: selected.size,
      color: selected.color,
      imageUrl,
    });
    toast.success("Agregado al carrito", {
      description: `${productName} · talle ${selected.size}`,
    });
  };

  const handleBuyNow = () => {
    if (!selected) return;
    const url = buildWhatsappCheckoutUrl([
      {
        name: productName,
        size: selected.size,
        color: selected.color,
        quantity: 1,
        price,
      },
    ]);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (soldOut) {
    return (
      <Button size="lg" disabled className="w-full sm:w-auto">
        Agotado
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {variants.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium">Talle</p>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                onClick={() => setSelected(variant)}
                className={cn(
                  "rounded-md border border-border px-3 py-1.5 text-sm transition-colors",
                  selected?.id === variant.id
                    ? "border-foreground bg-foreground text-background"
                    : "hover:border-foreground/50"
                )}
              >
                {variant.size}
                {variant.color ? ` · ${variant.color}` : ""}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          size="lg"
          onClick={handleAddToCart}
          disabled={!selected}
          className="sm:w-auto"
        >
          Agregar al carrito
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={handleBuyNow}
          disabled={!selected}
          className="sm:w-auto"
        >
          Comprar directo por WhatsApp
        </Button>
      </div>
    </div>
  );
}
