import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { duplicateProduct, deleteProduct, quickUpdateProduct } from "@/lib/actions/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export const metadata: Metadata = {
  title: "Productos",
  robots: { index: false, follow: false },
};

const PAGE_SIZE = 10;

type SearchParams = Promise<{ q?: string; page?: string }>;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const where = q ? { name: { contains: q } } : undefined;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true, variants: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Builds "?q=...&page=N" while dropping empty params — used by the
  // pagination links below so they preserve the current search term.
  const pageHref = (targetPage: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (targetPage > 1) params.set("page", String(targetPage));
    const qs = params.toString();
    return qs ? `/admin/productos?${qs}` : "/admin/productos";
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Productos</h1>
        <Button
          nativeButton={false}
          render={<Link href="/admin/productos/nuevo">Nuevo producto</Link>}
        />
      </div>

      <form action="/admin/productos" className="mt-4 flex max-w-sm gap-2">
        <Input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Buscar por nombre..."
          aria-label="Buscar productos por nombre"
        />
        <Button type="submit" variant="outline">
          Buscar
        </Button>
      </form>

      {products.length === 0 ? (
        <p className="mt-6 text-muted-foreground">
          {q
            ? `No encontramos productos que coincidan con "${q}".`
            : "Todavía no hay productos cargados."}
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

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <p>
            Página {page} de {totalPages} · {total} productos
          </p>
          <div className="flex gap-2">
            {/* Real disabled <button> at the boundaries — a disabled prop
                on a Button rendered as a Link wouldn't actually block
                navigation, since `disabled` isn't a valid <a> attribute. */}
            {page > 1 ? (
              <Button
                size="sm"
                variant="outline"
                nativeButton={false}
                render={<Link href={pageHref(page - 1)}>Anterior</Link>}
              />
            ) : (
              <Button size="sm" variant="outline" disabled>
                Anterior
              </Button>
            )}
            {page < totalPages ? (
              <Button
                size="sm"
                variant="outline"
                nativeButton={false}
                render={<Link href={pageHref(page + 1)}>Siguiente</Link>}
              />
            ) : (
              <Button size="sm" variant="outline" disabled>
                Siguiente
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
