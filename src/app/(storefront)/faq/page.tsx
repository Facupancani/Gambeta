import type { Metadata } from "next";
import { InstitutionalBanner } from "@/components/institutional-banner";
import { FAQS } from "@/lib/faqs";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description:
    "Cómo comprar, envíos, stock y talles — las dudas más comunes antes de pedir.",
};

// Free-license stock photo (Unsplash) — hands checking a worn boot resting
// on a ball, no visible brand logos. Portrait original; objectPosition
// keeps the boot/ball (lower half of frame) in view under the wide crop.
const BANNER_URL =
  "https://res.cloudinary.com/l20lh4uz/image/upload/v1786153122/gambeta/institucional/w63vouloepugphhdwvqu.jpg";

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
