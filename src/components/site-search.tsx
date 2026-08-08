"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Search icon that reveals an inline input on click, reusing the
 * `/catalogo?q=` filter that already exists server-side (see
 * `catalogo/page.tsx`) — this only adds the missing UI to trigger it.
 */
export function SiteSearch() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleOpen = () => {
    setOpen(true);
    // Wait for the input to mount before focusing it.
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = inputRef.current?.value.trim();
    setOpen(false);
    router.push(q ? `/catalogo?q=${encodeURIComponent(q)}` : "/catalogo");
  };

  if (!open) {
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label="Buscar productos"
        onClick={handleOpen}
      >
        <Search />
      </Button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-1"
      role="search"
    >
      <input
        ref={inputRef}
        type="search"
        name="q"
        aria-label="Buscar productos"
        placeholder="Buscar botines..."
        onBlur={() => setOpen(false)}
        className="h-9 w-32 rounded-md border border-border bg-transparent px-2 text-sm outline-none focus:border-foreground/50 sm:w-48"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Cerrar búsqueda"
        // onMouseDown (not onClick) fires before the input's onBlur, so the
        // close button reliably wins the race instead of onBlur closing the
        // form and yanking the button out from under the click.
        onMouseDown={() => setOpen(false)}
      >
        <X />
      </Button>
    </form>
  );
}
