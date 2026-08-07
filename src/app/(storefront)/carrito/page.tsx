import Link from "next/link";
import { Button } from "@/components/ui/button";

// TODO (próxima sesión): carrito multi-producto persistente (localStorage +
// Context) que arma un único mensaje de WhatsApp con todos los items. Por
// ahora cada producto se compra directo desde su página vía WhatsApp.
export default function CartPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col items-start gap-4 px-4 py-20">
      <h1 className="font-heading text-3xl font-bold">Carrito</h1>
      <p className="text-muted-foreground">
        Por ahora cada producto se compra directo por WhatsApp desde su
        página — elegís el talle y te lleva a la conversación con el pedido
        ya armado. El carrito con varios productos juntos está en camino.
      </p>
      <Button render={<Link href="/catalogo">Ir al catálogo</Link>} />
    </main>
  );
}
