import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// TODO (Día 3): crear/editar producto, carga de imágenes (Cloudinary), duplicar,
// edición rápida inline. Esta es la vista de lectura mínima para cerrar el Día 1.

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "Activo",
  PAUSED: "Pausado",
  SOLD_OUT: "Agotado",
};

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true, variants: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Productos</h1>

      {products.length === 0 ? (
        <p className="mt-6 text-muted-foreground">
          Todavía no hay productos cargados.
        </p>
      ) : (
        <Table className="mt-6">
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Talles</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category.name}</TableCell>
                <TableCell>{formatPrice(product.price)}</TableCell>
                <TableCell>
                  {product.variants.map((v) => v.size).join(", ")}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {STATUS_LABEL[product.status]}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
