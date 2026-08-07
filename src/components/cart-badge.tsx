"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export function CartBadge() {
  const { totalItems } = useCart();

  return (
    <Link
      href="/carrito"
      className="relative rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:border-primary/50"
    >
      Carrito
      {totalItems > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
