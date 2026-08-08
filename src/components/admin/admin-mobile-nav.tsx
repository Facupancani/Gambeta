"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/actions/auth";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { href: "/admin", label: "Inicio" },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/categorias", label: "Categorías" },
];

/**
 * Hamburger + Sheet for the admin sidebar nav, shown only below `sm` —
 * the fixed w-60 sidebar in admin/(dashboard)/layout.tsx is `hidden` at
 * that breakpoint. Same pattern as the storefront's mobile-nav.tsx.
 */
export function AdminMobileNav({ email }: { email: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Same "close on route change during render" pattern as the storefront
  // mobile-nav — see that file's comment for why (avoids a stuck,
  // click-eating Sheet in environments where transitionend never fires).
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" aria-label="Abrir menú" />}
      >
        <Menu />
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle className="font-heading text-xl">Gambeta</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-2 py-2.5 text-sm font-medium hover:bg-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-4 flex flex-col gap-2 border-t border-border px-4 pt-4">
          <p className="truncate text-xs text-muted-foreground">{email}</p>
          <form action={logout}>
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="w-full justify-start px-0"
            >
              Cerrar sesión
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
