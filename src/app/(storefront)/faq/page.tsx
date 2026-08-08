import type { Metadata } from "next";
import { InstitutionalBanner } from "@/components/institutional-banner";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
};

// Free-license stock photo (Unsplash) — hands checking a worn boot resting
// on a ball, no visible brand logos. Portrait original; objectPosition
// keeps the boot/ball (lower half of frame) in view under the wide crop.
const BANNER_URL =
  "https://res.cloudinary.com/l20lh4uz/image/upload/v1786153122/gambeta/institucional/w63vouloepugphhdwvqu.jpg";

const FAQS = [
  {
    q: "¿Cómo compro?",
    a: "Elegís el producto y el talle en el catálogo, tocás \"Comprar por WhatsApp\" y se abre una conversación con el pedido ya armado. Ahí coordinamos pago y envío.",
  },
  {
    q: "¿Hacen envíos a todo el país?",
    a: "Sí. También podés coordinar retiro en persona si te queda más cómodo.",
  },
  {
    q: "¿Tienen stock de todos los talles?",
    a: "La mayoría de los productos se confirman contra pedido. Al escribirnos por WhatsApp te confirmamos disponibilidad real antes de coordinar el pago.",
  },
  {
    q: "¿Cómo sé qué talle pedir?",
    a: "Escribinos por WhatsApp con tu talle habitual y te ayudamos a elegir el equivalente correcto.",
  },
];

export default function FaqPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-heading text-3xl font-bold">
        Preguntas frecuentes
      </h1>

      <InstitutionalBanner
        src={BANNER_URL}
        alt="Revisando un botín antes de jugar"
        objectPosition="center 65%"
      />

      <div className="mt-10 flex flex-col gap-6">
        {FAQS.map((faq) => (
          <div key={faq.q}>
            <h2 className="font-heading font-semibold">{faq.q}</h2>
            <p className="mt-1 text-muted-foreground">{faq.a}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
