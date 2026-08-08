import { Skeleton } from "@/components/ui/skeleton";

// Shared across every route in (storefront) — Next doesn't support
// per-route loading UI without nested folders, so this stays generic
// (a centered pulse) rather than mimicking one specific page's layout
// (e.g. a product grid), which would look wrong on /carrito or the PDP.
export default function StorefrontLoading() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center px-4 py-10">
      <div className="flex flex-col items-center gap-3">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>
    </main>
  );
}
