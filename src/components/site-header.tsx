"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CartBadge } from "@/components/cart-badge";
import { MobileNav } from "@/components/mobile-nav";
import { SiteSearch } from "@/components/site-search";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/envios-y-pagos", label: "Envíos y pagos" },
];

/** Home only matches the exact root path; everything else also matches its own sub-routes (e.g. `/producto/:slug` keeps "Catálogo" marked active). */
function isNavLinkActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-1">
          <div className="sm:hidden">
            <MobileNav />
          </div>
          {/* Search sits leftmost, ahead of the logo — adapted from the
              myrsport.com.ar nav pattern per the user's explicit call to put
              it on the left (not copying MYR's exact slot for it). */}
          <SiteSearch />
          <Link href="/" className="font-heading text-xl font-bold tracking-tight">
            Gambeta
          </Link>
        </div>
        <nav className="hidden items-center gap-6 text-sm sm:flex">
          {NAV_LINKS.map((link) => {
            const active = isNavLinkActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "transition-colors hover:text-foreground",
                  active
                    ? "font-bold text-white"
                    : "font-medium text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <CartBadge />
      </div>
    </header>
  );
}
