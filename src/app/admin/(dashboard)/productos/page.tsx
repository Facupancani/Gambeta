import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { duplicateProduct, deleteProduct, quickUpdateProduct } from "@/lib/actions/products";
import { Button } from "@/components/ui/button";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { ProductQuickEditForm } from "@/components/admin/product-quick-edit-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true, variants: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Productos</h1>
        <Button
          nativeButton={false}
          render={<Link href="/admin/productos/nuevo">Nuevo producto</Link>}
        />
      </div>

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
              <TableHead>Talles</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const duplicateWithId = duplicateProduct.bind(null, product.id);
              const deleteWithId = deleteProduct.bind(null, product.id);
              const quickUpdateWithId = quickUpdateProduct.bind(null, product.id);

              return (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/admin/productos/${product.id}/editar`}
                      className="hover:text-primary hover:underline"
                    >
                      {product.name}
                    </Link>
                  </TableCell>
                  <TableCell>{product.category.name}</TableCell>
                  <TableCell>
                    {product.variants.map((v) => v.size).join(", ") || "—"}
                  </TableCell>

                  <TableCell colSpan={2}>
                    <ProductQuickEditForm
                      action={quickUpdateWithId}
                      price={product.price}
                      status={product.status}
                    />
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        render={
                          <Link href={`/admin/productos/${product.id}/editar`}>
                            Editar
                          </Link>
                        }
                        nativeButton={false}
                      />
                      <form action={duplicateWithId}>
                        <Button type="submit" size="sm" variant="ghost">
                          Duplicar
                        </Button>
                      </form>
                      <form action={deleteWithId}>
                        <ConfirmSubmitButton
                          size="sm"
                          variant="ghost"
                          confirmMessage={`¿Borrar "${product.name}"? Esta acción no se puede deshacer.`}
                        >
                          Borrar
                        </ConfirmSubmitButton>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
