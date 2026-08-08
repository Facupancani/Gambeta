"use client";

import { useEffect } from "react";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

// Covers both /admin/login and everything under /admin/(dashboard) — this
// is the closest common ancestor segment for the whole admin section
// (there's no shared admin/layout.tsx, just the `admin/` path prefix).
export default function AdminError({
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
    <main
      id="main-content"
      className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center"
    >
      <TriangleAlert className="size-10 text-muted-foreground" />
      <h1 className="font-heading text-3xl font-bold">Algo salió mal</h1>
      <p className="text-muted-foreground">
        Hubo un error en el panel. Podés reintentar o volver al inicio del
        admin.
      </p>
      <div className="flex gap-3">
        <Button onClick={() => retry()}>Reintentar</Button>
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/admin">Volver al inicio</Link>}
        />
      </div>
    </main>
  );
}
