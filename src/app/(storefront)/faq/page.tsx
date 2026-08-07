import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
};

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
      <div className="mt-8 flex flex-col gap-6">
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
