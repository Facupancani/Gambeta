import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

const RECENT_LIMIT = 6;

export default async function AdminHomePage() {
  const [productCount, categoryCount, soldOutCount, recentProducts] =
    await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.product.count({ where: { status: "SOLD_OUT" } }),
      prisma.product.findMany({
        include: { category: true },
        orderBy: { updatedAt: "desc" },
        take: RECENT_LIMIT,
      }),
    ]);

  const stats = [
    { label: "Productos", value: productCount },
    { label: "Categorías", value: categoryCount },
    { label: "Agotados", value: soldOutCount },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Inicio</h1>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Actividad reciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Todavía no hay productos cargados.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {recentProducts.map((product) => (
                <li
                  key={product.id}
                  className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/admin/productos/${product.id}/editar`}
                      className="truncate font-medium hover:underline"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {product.category.name} ·{" "}
                      {product.createdAt.getTime() ===
                      product.updatedAt.getTime()
                        ? "creado"
                        : "editado"}{" "}
                      {product.updatedAt.toLocaleDateString("es-AR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-medium">
                    {formatPrice(product.price)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
