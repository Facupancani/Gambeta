"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { buildWhatsappCheckoutUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type Variant = { id: string; size: string; color?: string | null };

export function ProductBuyButton({
  productName,
  price,
  variants,
  soldOut,
}: {
  productName: string;
  price: number;
  variants: Variant[];
  soldOut: boolean;
}) {
  const [selected, setSelected] = useState<Variant | undefined>(variants[0]);

  const handleBuy = () => {
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
                    ? "border-primary bg-primary/10 text-primary"
                    : "hover:border-primary/50"
                )}
              >
                {variant.size}
                {variant.color ? ` · ${variant.color}` : ""}
              </button>
            ))}
          </div>
        </div>
      )}
      <Button
        size="lg"
        onClick={handleBuy}
        disabled={!selected}
        className="w-full bg-brand-yellow text-brand-yellow-foreground hover:bg-brand-yellow/90 sm:w-auto"
      >
        Comprar por WhatsApp
      </Button>
    </div>
  );
}
