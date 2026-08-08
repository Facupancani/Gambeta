"use client";

import { useEffect } from "react";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

// Storefront-scoped error boundary — catches errors thrown while rendering
// Home/Catálogo/PDP/Carrito (e.g. a DB read failing) without losing the
// header/footer chrome, since it renders inside `(storefront)/layout.tsx`.
export default function StorefrontError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <TriangleAlert className="size-10 text-muted-foreground" />
      <h1 className="font-heading text-3xl font-bold">Algo salió mal</h1>
      <p className="text-muted-foreground">
        No pudimos cargar esta página. Podés reintentar o volver al inicio.
      </p>
      <div className="flex gap-3">
        <Button onClick={() => retry()}>Reintentar</Button>
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/">Volver al inicio</Link>}
        />
      </div>
    </main>
  );
}
