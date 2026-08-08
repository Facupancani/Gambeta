import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";

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

export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    include: {
      category: true,
      images: { orderBy: { order: "asc" }, take: 1 },
      variants: { orderBy: { createdAt: "asc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

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
          <p className="max-w-lg text-lg text-white/85">
            Botines y accesorios pensados para quien juega por pasión, no por
            vitrina. Elegís en el catálogo, coordinamos todo por WhatsApp.
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

      {featuredProducts.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-24">
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
    </main>
  );
}
