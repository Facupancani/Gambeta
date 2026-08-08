import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

// Root not-found — catches any URL that doesn't match a route at all,
// anywhere in the app (login/admin included), since this is the outermost
// boundary. Renders inside the root layout (body already carries the dark
// theme via globals.css), so no header/footer chrome here on purpose —
// storefront URLs get their own richer not-found.tsx with the site chrome
// (see `(storefront)/not-found.tsx`).
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <SearchX className="size-10 text-muted-foreground" />
      <h1 className="font-heading text-3xl font-bold">Página no encontrada</h1>
      <p className="text-muted-foreground">
        No encontramos lo que buscabas. Puede que el link esté roto o que la
        página se haya movido.
      </p>
      <Button
        nativeButton={false}
        render={<Link href="/">Volver al inicio</Link>}
      />
    </main>
  );
}
