import type { Metadata } from "next";
import { ShoppingCart, MessageCircle, PackageCheck } from "lucide-react";
import { InstitutionalBanner } from "@/components/institutional-banner";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Quiénes somos y por qué elegimos vender por WhatsApp.",
};

// Free-license stock photo (Unsplash) — amateur pickup game in a park, no
// visible sponsor branding. Portrait original, cropped to a wide banner;
// objectPosition keeps the players (lower-left of frame) in view instead
// of the bare winter tree branches that dominate the top half.
const BANNER_URL =
  "https://res.cloudinary.com/l20lh4uz/image/upload/v1786153120/gambeta/institucional/geesrzl5vda9bbfh0yuo.jpg";

const STEPS = [
  {
    icon: ShoppingCart,
    title: "Elegís en el catálogo",
    description: "Recorrés los productos y elegís talle y color sin apuro.",
  },
  {
    icon: MessageCircle,
    title: "Coordinamos por WhatsApp",
    description:
      "Te confirmamos stock real, te asesoramos con el talle y arreglamos pago y envío.",
  },
  {
    icon: PackageCheck,
    title: "Recibís donde te quede cómodo",
    description: "Envío a todo el país o retiro en persona, como prefieras.",
  },
];

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

      <InstitutionalBanner
        src={BANNER_URL}
        alt="Picadito amateur en una plaza"
        objectPosition="center 78%"
      />

      <h2 className="font-heading mt-12 text-xl font-semibold">
        Cómo trabajamos
      </h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        {STEPS.map((step, index) => (
          <div key={step.title}>
            <div className="flex items-center gap-2">
              <step.icon className="size-5 text-primary" strokeWidth={1.5} />
              <span className="font-heading text-sm text-muted-foreground">
                Paso {index + 1}
              </span>
            </div>
            <h3 className="mt-2 font-medium">{step.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
