"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import { buildWhatsappCheckoutUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";

/**
 * Client Component split out of `carrito/page.tsx` (`useCart` needs a
 * client boundary) so that page can stay a Server Component and export
 * `metadata` — `generateMetadata`/`metadata` are Server-Component-only,
 * per node_modules/next/dist/docs/.../generate-metadata.md ("If you need
 * to use Client Component features, keep your page.tsx as a Server
 * Component and move the Client Component logic to a separate file").
 */
export function CartView() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  const handleCheckout = () => {
    const url = buildWhatsappCheckoutUrl(
      items.map((item) => ({
        name: item.productName,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.price,
      }))
    );
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (items.length === 0) {
    return (
      <main className="mx-auto flex max-w-2xl flex-col items-start gap-4 px-4 py-20">
        <h1 className="font-heading text-3xl font-bold">Carrito</h1>
        <p className="text-muted-foreground">
          Todavía no agregaste nada. Elegí algo del catálogo para empezar.
        </p>
        <Button
          nativeButton={false}
          render={<Link href="/catalogo">Ir al catálogo</Link>}
        />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-heading text-3xl font-bold">Carrito</h1>

      <div className="mt-8 flex flex-col gap-4">
        {items.map((item) => (
          <div
            key={item.variantId}
            className="flex items-center gap-4 rounded-xl border border-border p-4"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.productName}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              ) : null}
            </div>

            <div className="flex-1">
              <Link
                href={`/producto/${item.productSlug}`}
                className="font-medium hover:underline"
              >
                {item.productName}
              </Link>
              <p className="text-sm text-muted-foreground">
                {[item.size, item.color].filter(Boolean).join(" · ")}
              </p>
              <p className="mt-1 font-semibold text-foreground">
                {formatPrice(item.price)}
              </p>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Restar cantidad"
                onClick={() =>
                  updateQuantity(item.variantId, item.quantity - 1)
                }
              >
                <Minus />
              </Button>
              <span className="w-6 text-center text-sm">{item.quantity}</span>
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Sumar cantidad"
                onClick={() =>
                  updateQuantity(item.variantId, item.quantity + 1)
                }
              >
                <Plus />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Quitar del carrito"
              onClick={() => removeItem(item.variantId)}
            >
              <Trash2 />
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-stretch gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-lg font-semibold">
          Total: {formatPrice(totalPrice)}
        </p>
        <Button size="lg" onClick={handleCheckout}>
          Finalizar por WhatsApp
        </Button>
      </div>
    </main>
  );
}
