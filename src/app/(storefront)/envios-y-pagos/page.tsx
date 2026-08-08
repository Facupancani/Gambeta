import type { Metadata } from "next";
import { InstitutionalBanner } from "@/components/institutional-banner";

export const metadata: Metadata = {
  title: "Envíos y pagos",
  description: "Cómo hacemos los envíos y cómo se coordina el pago.",
};

// Free-license stock photo (Unsplash, RoseBox رز باکس) — person-to-person
// box handoff outdoors, no visible courier/brand labels. Replaces an
// earlier plain kraft-cardboard-box-on-white banner that read as generic
// stock photography; this one fits the "coordinamos todo personalmente"
// story better than a studio product shot. 2 candidates were shown to the
// user before picking this one — see BACKLOG.md for the comparison.
const BANNER_URL =
  "https://res.cloudinary.com/l20lh4uz/image/upload/v1786168129/gambeta/institucional/xbzrx8terdvh48fphshh.jpg";

export default function ShippingAndPaymentsPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-heading text-3xl font-bold">Envíos y pagos</h1>

      <InstitutionalBanner src={BANNER_URL} alt="Entrega de un pedido en persona" />

      <section className="mt-10">
        <h2 className="font-heading text-xl font-semibold">Envíos</h2>
        <p className="mt-2 text-muted-foreground">
          Hacemos envíos a todo el país. También podés coordinar el retiro en
          persona si estás cerca. El costo y el tiempo de envío se confirman
          por WhatsApp según tu ubicación.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-heading text-xl font-semibold">Pagos</h2>
        <p className="mt-2 text-muted-foreground">
          El pago se coordina directamente por WhatsApp una vez confirmado el
          pedido — transferencia, efectivo en el retiro, u otros medios que
          arreglemos juntos.
        </p>
      </section>
    </main>
  );
}
