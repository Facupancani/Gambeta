"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

/**
 * Shown on `/catalogo` only when a `?q=` search is active (see the header's
 * `SiteSearch`, which is the thing that gets you here in the first place).
 * Surfaces the term that was searched — before this, submitting "pelota"
 * filtered the grid with zero on-page confirmation of what was actually
 * searched — and lets it be edited/cleared without going back to the tiny
 * header input. Preserves the active category filter across edits.
 */
export function CatalogSearchBar({
  query,
  categoria,
}: {
  query: string;
  categoria?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(query);

  const buildHref = (q: string) => {
    const params = new URLSearchParams();
    if (categoria) params.set("categoria", categoria);
    if (q) params.set("q", q);
    const qs = params.toString();
    return qs ? `/catalogo?${qs}` : "/catalogo";
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(buildHref(value.trim()));
  };

  const handleClear = () => {
    setValue("");
    router.push(buildHref(""));
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
    >
      <span>Buscando resultados para</span>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Editar búsqueda"
        className="h-8 min-w-0 flex-1 rounded-md border border-border bg-transparent px-2 text-foreground outline-none focus:border-foreground/50 sm:w-56 sm:flex-none"
      />
      <button
        type="submit"
        className="text-foreground underline underline-offset-4 hover:no-underline"
      >
        Buscar
      </button>
      <button
        type="button"
        onClick={handleClear}
        className="inline-flex items-center gap-1 hover:text-foreground"
      >
        <X className="size-3.5" />
        Quitar búsqueda
      </button>
    </form>
  );
}
