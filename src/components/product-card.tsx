import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

export type ProductCardData = {
  slug: string;
  name: string;
  price: number;
  status: "ACTIVE" | "PAUSED" | "SOLD_OUT";
  categoryName: string;
  imageUrl?: string | null;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <Link
      href={`/producto/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/50"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-secondary">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            {product.categoryName}
          </div>
        )}
        {product.status === "SOLD_OUT" && (
          <Badge variant="secondary" className="absolute left-3 top-3">
            Agotado
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {product.categoryName}
        </p>
        <h3 className="font-heading font-medium leading-snug">
          {product.name}
        </h3>
        <p className="mt-auto pt-2 font-semibold text-primary">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
