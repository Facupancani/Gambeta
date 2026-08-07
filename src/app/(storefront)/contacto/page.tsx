import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Escribinos por WhatsApp para cualquier consulta.",
};

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-heading text-3xl font-bold">Contacto</h1>
      <p className="mt-4 text-muted-foreground">
        ¿Tenés dudas sobre un producto, un talle, o cómo comprar? Escribinos
        directo por WhatsApp y te respondemos a la brevedad.
      </p>
      {WHATSAPP_NUMBER && (
        <Button
          size="lg"
          className="mt-6"
          nativeButton={false}
          render={
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
            >
              Escribir por WhatsApp
            </a>
          }
        />
      )}
    </main>
  );
}
