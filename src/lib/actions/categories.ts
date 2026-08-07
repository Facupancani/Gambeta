"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";
import { slugify } from "@/lib/slugify";

const CategorySchema = z.object({
  name: z.string().min(2, { error: "El nombre es muy corto." }),
});

export type CategoryFormState = { error?: string } | null;

export async function createCategory(
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  await verifySession();
  const parsed = CategorySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Ingresá un nombre válido." };

  const slug = slugify(parsed.data.name);
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) return { error: "Ya existe una categoría con ese nombre." };

  await prisma.category.create({ data: { name: parsed.data.name, slug } });
  revalidatePath("/admin/categorias");
  revalidatePath("/catalogo");
  return null;
}

export async function renameCategory(categoryId: string, formData: FormData) {
  await verifySession();
  const parsed = CategorySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  await prisma.category.update({
    where: { id: categoryId },
    data: { name: parsed.data.name, slug: slugify(parsed.data.name) },
  });
  revalidatePath("/admin/categorias");
  revalidatePath("/catalogo");
}

export async function deleteCategory(categoryId: string) {
  await verifySession();
  const productCount = await prisma.product.count({ where: { categoryId } });
  if (productCount > 0) {
    // No la borramos silenciosamente si tiene productos — evita productos huérfanos.
    throw new Error(
      `No se puede borrar: tiene ${productCount} producto(s) asociado(s). Movelos a otra categoría primero.`
    );
  }
  await prisma.category.delete({ where: { id: categoryId } });
  revalidatePath("/admin/categorias");
}
