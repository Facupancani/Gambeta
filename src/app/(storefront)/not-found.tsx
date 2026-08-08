import Link from "next/link";
import { PackageX } from "lucide-react";
import { Button } from "@/components/ui/button";

// Storefront-scoped not-found — this is what actually renders when the PDP
// calls notFound() on a missing/paused product slug (producto/[slug]/page.tsx),
// since it's the closest boundary above that segment. Because it lives
// inside the (storefront) route group, it renders wrapped by
// `(storefront)/layout.tsx` — header and footer stay visible, unlike the
// bare root not-found.tsx.
export default function StorefrontNotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <PackageX className="size-10 text-muted-foreground" />
      <h1 className="font-heading text-3xl font-bold">
        No encontramos ese producto
      </h1>
      <p className="text-muted-foreground">
        Puede que se haya agotado, que ya no esté disponible o que el link
        esté roto. Mirá el resto del catálogo.
      </p>
      <Button
        nativeButton={false}
        render={<Link href="/catalogo">Ver catálogo</Link>}
      />
    </main>
  );
}
