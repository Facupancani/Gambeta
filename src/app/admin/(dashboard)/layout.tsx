import Link from "next/link";
import { verifySession } from "@/lib/dal";
import { logout } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";

const NAV_LINKS = [
  { href: "/admin", label: "Inicio" },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/categorias", label: "Categorías" },
];

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Real protection for this whole section — proxy.ts already redirected
  // unauthenticated requests, but this is the check that actually matters.
  const session = await verifySession();

  return (
    <div className="flex min-h-screen flex-col sm:flex-row">
      {/* Mobile-only top bar — the sidebar below is `hidden` under `sm`,
          same split as the storefront header/mobile-nav pattern. */}
      <header className="flex items-center gap-1 border-b border-sidebar-border bg-sidebar p-2 text-sidebar-foreground sm:hidden">
        <AdminMobileNav email={session.email} />
        <Link href="/admin" className="font-heading text-lg font-bold">
          Gambeta
        </Link>
      </header>

      <aside className="hidden w-60 shrink-0 flex-col justify-between border-r border-sidebar-border bg-sidebar p-4 text-sidebar-foreground sm:flex">
        <div>
          <Link href="/admin" className="font-heading text-xl font-bold">
            Gambeta
          </Link>
          <nav className="mt-8 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-2 border-t border-sidebar-border pt-4">
          <p className="truncate px-3 text-xs text-muted-foreground">
            {session.email}
          </p>
          <form action={logout}>
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="w-full justify-start"
            >
              Cerrar sesión
            </Button>
          </form>
        </div>
      </aside>
      <main id="main-content" className="min-w-0 flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
