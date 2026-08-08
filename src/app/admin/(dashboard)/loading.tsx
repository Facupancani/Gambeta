import { Skeleton } from "@/components/ui/skeleton";

// Shared across the admin dashboard/productos/categorias routes. Kept
// generic for the same reason as the storefront one — one loading.tsx
// serves every page in the segment.
export default function AdminLoading() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}
