import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  updateProduct,
  deleteProduct,
  duplicateProduct,
} from "@/lib/actions/products";
import { ProductForm } from "@/components/admin/product-form";
import { Button } from "@/components/ui/button";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ created?: string; saved?: string; duplicated?: string }>;

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { id } = await params;
  const { created, saved, duplicated } = await searchParams;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { variants: true, images: { orderBy: { order: "asc" } } },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  const updateWithId = updateProduct.bind(null, product.id);
  const deleteWithId = deleteProduct.bind(null, product.id);
  const duplicateWithId = duplicateProduct.bind(null, product.id);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Editar producto</h1>
        <div className="flex gap-2">
          <form action={duplicateWithId}>
            <Button type="submit" variant="outline" size="sm">
              Duplicar
            </Button>
          </form>
          <form
            action={async () => {
              "use server";
              await deleteWithId();
              redirect("/admin/productos");
            }}
          >
            <ConfirmSubmitButton
              variant="ghost"
              size="sm"
              confirmMessage={`¿Borrar "${product.name}"? Esta acción no se puede deshacer.`}
            >
              Borrar
            </ConfirmSubmitButton>
          </form>
        </div>
      </div>

      {created && (
        <p className="mt-4 rounded-md bg-primary/10 px-3 py-2 text-sm text-primary">
          Producto creado. Ahora podés seguir editándolo.
        </p>
      )}
      {saved && (
        <p className="mt-4 rounded-md bg-primary/10 px-3 py-2 text-sm text-primary">
          Cambios guardados.
        </p>
      )}
      {duplicated && (
        <p className="mt-4 rounded-md bg-primary/10 px-3 py-2 text-sm text-primary">
          Producto duplicado — quedó pausado, revisá los datos antes de activarlo.
        </p>
      )}

      <div className="mt-6">
        <ProductForm
          // Force a remount when navigating between different products'
          // edit pages — otherwise React reuses this component instance and
          // the uncontrolled fields (name/slug/description/price/images/
          // variants) keep showing the previous product's data.
          key={product.id}
          categories={categories}
          action={updateWithId}
          submitLabel="Guardar cambios"
          initial={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: product.price,
            categoryId: product.categoryId,
            status: product.status,
            variants: product.variants.map((v) => ({
              size: v.size,
              color: v.color ?? undefined,
            })),
            images: product.images.map((img) => ({
              url: img.url,
              publicId: img.publicId ?? undefined,
            })),
          }}
        />
      </div>
    </div>
  );
}
