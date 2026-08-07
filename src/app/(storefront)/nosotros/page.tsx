import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Quiénes somos y por qué elegimos vender por WhatsApp.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-heading text-3xl font-bold">Nosotros</h1>
      <p className="mt-6 text-muted-foreground">
        Gambeta nace de la pasión por el fútbol de todos los días: el fútbol 5
        de los miércoles, el picadito con amigos, el potrero del barrio.
        Elegimos cada producto pensando en quien juega por gusto, no por
        vitrina — buena relación precio-calidad, sin vueltas.
      </p>
      <p className="mt-4 text-muted-foreground">
        Coordinamos cada pedido personalmente por WhatsApp: te asesoramos con
        el talle, confirmamos disponibilidad y arreglamos el envío o el
        retiro como te quede más cómodo.
      </p>
    </main>
  );
}
