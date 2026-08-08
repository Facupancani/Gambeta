import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { createProduct } from "@/lib/actions/products";
import { ProductForm } from "@/components/admin/product-form";

export const metadata: Metadata = {
  title: "Nuevo producto",
  robots: { index: false, follow: false },
};

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Nuevo producto</h1>
      <div className="mt-6">
        <ProductForm
          categories={categories}
          action={createProduct}
          submitLabel="Crear producto"
        />
      </div>
    </div>
  );
}
