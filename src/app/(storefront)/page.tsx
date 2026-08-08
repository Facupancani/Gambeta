import Link from "next/link";
import Image from "next/image";
import {
  MessageCircle,
  Truck,
  ShieldCheck,
  CreditCard,
  ShoppingCart,
  PackageCheck,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { CategoryIcon } from "@/lib/category-icon";
import { FAQS } from "@/lib/faqs";
import { cn } from "@/lib/utils";

// Hero photo — chosen over 2 other candidates (one had real sponsor logos
// and an ad banner visible, unusable; another was portrait-oriented with a
// bright cool-toned sky that fought the brand palette). This one is
// landscape, night-match lighting (~65% of the frame is already near-black
// sky), and pairs well with a gradient overlay without fighting it. Free
// license (Unsplash), uploaded to Cloudinary same as the catalog photos —
// see BACKLOG.md "Pase portfolio-ready", categoría A, for the full
// comparison of the 3 options considered.
const HERO_IMAGE_URL =
  "https://res.cloudinary.com/l20lh4uz/image/upload/v1786152279/gambeta/hero/orhwsfmaquyy9oprgznc.jpg";

// Same photo already used on /nosotros (picadito amateur en una plaza) —
// reused here for the brand-story teaser instead of sourcing a new stock
// photo, since it's already the right subject (this same team) and keeps
// the "no random new asset per section" discipline. See BACKLOG.md
// "Pase portfolio-ready", categoría B, for the original selection.
const STORY_IMAGE_URL =
  "https://res.cloudinary.com/l20lh4uz/image/upload/v1786153120/gambeta/institucional/geesrzl5vda9bbfh0yuo.jpg";

const TRUST_POINTS = [
  {
    icon: MessageCircle,
    title: "Coordinás por WhatsApp",
    description: "Hablás directo con nosotros, sin formularios ni esperas.",
  },
  {
    icon: Truck,
    title: "Envíos a todo el país",
    description: "O retirás en persona si te queda cerca.",
  },
  {
    icon: ShieldCheck,
    title: "Stock confirmado",
    description: "Te avisamos disponibilidad real antes de que pagues.",
  },
  {
    icon: CreditCard,
    title: "Pago como te quede cómodo",
    description: "Transferencia, efectivo, lo que arreglemos juntos.",
  },
];

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

const STEPS = [
  {
    icon: ShoppingCart,
    title: "Elegís en el catálogo",
    description: "Filtrás por categoría o buscás directo lo que necesitás.",
  },
  {
    icon: MessageCircle,
    title: "Coordinamos por WhatsApp",
    description: "Te confirmamos talle, stock y forma de pago al toque.",
  },
  {
    icon: PackageCheck,
    title: "Lo recibís donde quieras",
    description: "Envío a todo el país o retiro en persona, como prefieras.",
  },
];

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    prisma.product.findMany({
      where: { status: "ACTIVE" },
      include: {
        category: true,
        images: { orderBy: { order: "asc" }, take: 1 },
        variants: { orderBy: { createdAt: "asc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    // createdAt asc (not name asc, unlike the catalog's filter pills) so
    // the grid below follows the seed's intentional order — botines
    // first, entrenamiento last — instead of falling alphabetically.
    // Also pulls one real product photo per category (no new asset —
    // reuses whatever's already attached to a product in that category)
    // for the tile background; categories where every product still uses
    // the icon-only fallback just render without a photo.
    prisma.category.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        _count: { select: { products: { where: { status: { not: "PAUSED" } } } } },
        products: {
          where: { status: { not: "PAUSED" }, images: { some: {} } },
          orderBy: { createdAt: "desc" },
          take: 1,
          include: { images: { orderBy: { order: "asc" }, take: 1 } },
        },
      },
    }),
  ]);

  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE_URL}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[35%_50%]"
          />
          {/* Left-to-right scrim so the text (which sits on the left) has
              guaranteed contrast regardless of what's directly behind it,
              plus a bottom scrim for the brighter grass strip at the foot
              of the photo. Both fade out toward the right/top, so the
              photo itself still reads clearly there. */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
        </div>

        <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-24 sm:py-36">
          <p className="font-heading text-sm font-semibold uppercase tracking-widest text-white/80">
            Botines · Pelotas · Canilleras · Medias
          </p>
          <h1 className="font-heading text-4xl font-bold leading-tight text-white sm:text-6xl">
            Jugás vos.
            <br />
            El equipo lo ponemos nosotros.
          </h1>
          {/* Short and declarative on purpose — the old copy here
              ("Botines y accesorios pensados para... Elegís en el
              catálogo, coordinamos todo por WhatsApp.") explained the
              site instead of sounding like a slogan. The logistics part
              of that sentence now lives in the trust strip right below,
              where it actually reads as reassurance instead of a pitch. */}
          <p className="max-w-lg text-lg text-white/85">
            Menos vitrina, más cancha.
          </p>
          <div className="flex gap-3">
            <Button
              size="lg"
              variant="invert"
              nativeButton={false}
              render={<Link href="/catalogo">Ver catálogo</Link>}
            />
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
              nativeButton={false}
              render={<Link href="/nosotros">Conocenos</Link>}
            />
          </div>
        </div>
      </section>

      <section className="border-b border-border/60 bg-secondary/40">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 sm:grid-cols-4">
          {TRUST_POINTS.map((point) => (
            <div key={point.title} className="flex flex-col gap-1.5">
              <point.icon className="size-5 text-primary" strokeWidth={1.5} />
              <p className="text-sm font-medium">{point.title}</p>
              <p className="text-xs text-muted-foreground">{point.description}</p>
            </div>
          ))}
        </div>
      </section>

      {categories.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-heading text-2xl font-bold">Explorá por categoría</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Todo lo que necesitás para jugar, en un solo lugar.
              </p>
            </div>
            <Link
              href="/catalogo"
              className="shrink-0 text-sm text-foreground underline-offset-4 hover:underline"
            >
              Ver catálogo completo
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((category) => {
              const photoUrl = category.products[0]?.images[0]?.url;
              return (
                <Link
                  key={category.id}
                  href={`/catalogo?categoria=${category.slug}`}
                  className="group relative flex aspect-square flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border border-border bg-card p-4 text-center transition-colors hover:border-foreground/40"
                >
                  {photoUrl && (
                    <>
                      <Image
                        src={photoUrl}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {/* Same dark scrim treatment as the hero, just
                          radial-ish via a flat bottom-heavy gradient —
                          keeps icon/name legible over any photo without
                          needing a per-photo crop check. */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10" />
                    </>
                  )}
                  <CategoryIcon
                    categorySlug={category.slug}
                    className={cn(
                      "relative z-10 size-8 transition-colors group-hover:text-primary",
                      photoUrl ? "text-white" : "text-muted-foreground"
                    )}
                    strokeWidth={1.5}
                  />
                  <div className="relative z-10">
                    <p
                      className={cn(
                        "font-heading font-medium",
                        photoUrl && "text-white"
                      )}
                    >
                      {category.name}
                    </p>
                    <p
                      className={cn(
                        "mt-0.5 text-xs",
                        photoUrl ? "text-white/75" : "text-muted-foreground"
                      )}
                    >
                      {category._count.products}{" "}
                      {category._count.products === 1 ? "producto" : "productos"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {featuredProducts.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="flex items-baseline justify-between">
            <h2 className="font-heading text-2xl font-bold">Recién llegados</h2>
            <Link href="/catalogo" className="text-sm text-foreground underline-offset-4 hover:underline">
              Ver todo
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                  status: product.status,
                  categoryName: product.category.name,
                  categorySlug: product.category.slug,
                  imageUrl: product.images[0]?.url,
                  quickAddVariantId: product.variants[0]?.id,
                  quickAddVariantSize: product.variants[0]?.size,
                }}
              />
            ))}
          </div>
        </section>
      )}

      <section className="border-t border-border/60 bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="font-heading text-2xl font-bold">Cómo funciona</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            {STEPS.map((step, index) => (
              <div key={step.title}>
                <div className="flex items-center gap-2">
                  <step.icon className="size-5 text-primary" strokeWidth={1.5} />
                  <span className="font-heading text-sm text-muted-foreground">
                    Paso {index + 1}
                  </span>
                </div>
                <h3 className="mt-2 font-medium">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
          <Link
            href="/nosotros"
            className="mt-8 inline-block text-sm text-foreground underline-offset-4 hover:underline"
          >
            Conocé más sobre nosotros →
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid items-center gap-8 sm:grid-cols-2">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-secondary">
            <Image
              src={STORY_IMAGE_URL}
              alt="Picadito amateur en una plaza"
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
              style={{ objectPosition: "center 78%" }}
            />
          </div>
          <div>
            <p className="font-heading text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Quiénes somos
            </p>
            <h2 className="mt-2 font-heading text-2xl font-bold sm:text-3xl">
              Nace de la pasión por el fútbol de todos los días
            </h2>
            <p className="mt-4 text-muted-foreground">
              El fútbol 5 de los miércoles, el picadito con amigos, el
              potrero del barrio. Elegimos cada producto pensando en quien
              juega por gusto, no por vitrina — buena relación
              precio-calidad, sin vueltas y con asesoramiento real por
              WhatsApp en cada pedido.
            </p>
            <Button
              className="mt-6"
              variant="outline"
              nativeButton={false}
              render={<Link href="/nosotros">Conocé la historia completa</Link>}
            />
          </div>
        </div>
      </section>

      <section className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-baseline justify-between">
            <h2 className="font-heading text-2xl font-bold">Preguntas frecuentes</h2>
            <Link href="/faq" className="text-sm text-foreground underline-offset-4 hover:underline">
              Ver todas
            </Link>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {FAQS.slice(0, 3).map((faq) => (
              <div key={faq.q}>
                <h3 className="font-heading font-medium">{faq.q}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 bg-secondary/40">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-16 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold">
              ¿Listo para tu próximo partido?
            </h2>
            <p className="mt-1 text-muted-foreground">
              Escribinos por WhatsApp y armamos tu pedido juntos.
            </p>
          </div>
          <div className="flex gap-3">
            {/* Straight to wa.me, same as /contacto — a "final CTA" that
                says "escribir por WhatsApp" should be one click away from
                actually doing that, not a second stop on /contacto first. */}
            <Button
              size="lg"
              nativeButton={false}
              render={
                WHATSAPP_NUMBER ? (
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Escribir por WhatsApp
                  </a>
                ) : (
                  <Link href="/contacto">Escribir por WhatsApp</Link>
                )
              }
            />
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={<Link href="/catalogo">Ver catálogo</Link>}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
