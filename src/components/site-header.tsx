import Link from "next/link";
import { CartBadge } from "@/components/cart-badge";
import { MobileNav } from "@/components/mobile-nav";
import { SiteSearch } from "@/components/site-search";

const NAV_LINKS = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/envios-y-pagos", label: "Envíos y pagos" },
];

export function SiteHeader() {
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
        <nav className="hidden items-center gap-6 text-sm font-medium sm:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <CartBadge />
      </div>
    </header>
  );
}
