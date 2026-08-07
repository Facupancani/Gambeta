import { formatPrice } from "@/lib/format";

export type CheckoutItem = {
  name: string;
  size: string;
  color?: string | null;
  quantity: number;
  price: number;
};

/**
 * Builds a wa.me link with the cart pre-filled as a readable message.
 * This IS the checkout — there's no payment gateway or order record; the
 * conversation in WhatsApp is where the sale actually happens.
 */
export function buildWhatsappCheckoutUrl(items: CheckoutItem[]) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!number) {
    throw new Error("NEXT_PUBLIC_WHATSAPP_NUMBER is not set (check your .env file)");
  }

  const lines = [
    "¡Hola! Quiero hacer este pedido:",
    "",
    ...items.map((item) => {
      const variant = [item.size, item.color].filter(Boolean).join(" / ");
      return `• ${item.quantity}x ${item.name} (${variant}) — ${formatPrice(item.price * item.quantity)}`;
    }),
    "",
    `Total: ${formatPrice(items.reduce((sum, item) => sum + item.price * item.quantity, 0))}`,
  ];

  const message = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${number}?text=${message}`;
}
