import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";

export const metadata: Metadata = {
  title: "Carrito",
  description: "Revisá tu pedido y coordinalo por WhatsApp.",
};

export default function CartPage() {
  return <CartView />;
}
