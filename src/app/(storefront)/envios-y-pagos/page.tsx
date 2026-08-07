import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Envíos y pagos",
  description: "Cómo hacemos los envíos y cómo se coordina el pago.",
};

export default function ShippingAndPaymentsPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-heading text-3xl font-bold">Envíos y pagos</h1>

      <section className="mt-8">
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
