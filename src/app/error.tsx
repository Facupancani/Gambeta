"use client";

import { useEffect } from "react";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

// Root error boundary — catches anything not caught by a more specific
// error.tsx closer to the segment that threw. Error boundaries must be
// Client Components (Next 16 requirement). Uses `retry`, not the older
// `reset` prop name — confirmed against this project's actual Next docs
// (node_modules/next/dist/docs/.../error.md) since this Next version has
// breaking changes vs. training data (see AGENTS.md).
export default function GlobalError({
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
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <TriangleAlert className="size-10 text-muted-foreground" />
      <h1 className="font-heading text-3xl font-bold">Algo salió mal</h1>
      <p className="text-muted-foreground">
        Tuvimos un error inesperado. Podés reintentar o volver al inicio.
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
