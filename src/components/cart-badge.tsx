"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export function CartBadge() {
  const { totalItems } = useCart();

  return (
    <Link
      href="/carrito"
      aria-label="Ver carrito"
      className="relative flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent"
    >
      <ShoppingBag className="size-5" />
      {totalItems > 0 && (
        <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
