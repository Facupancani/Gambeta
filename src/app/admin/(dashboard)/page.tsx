import { prisma } from "@/lib/prisma";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export default async function AdminHomePage() {
  const [productCount, categoryCount, soldOutCount] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.product.count({ where: { status: "SOLD_OUT" } }),
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
    </div>
  );
}
