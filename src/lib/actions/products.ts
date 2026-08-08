"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";

const VariantSchema = z.object({
  size: z.string().min(1),
  color: z.string().optional(),
});

const ImageSchema = z.object({
  url: z.url(),
  publicId: z.string().optional(),
  color: z.string().optional(),
});

const ProductSchema = z.object({
  name: z.string().min(2, { error: "El nombre es muy corto." }),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, {
      error: "Solo minúsculas, números y guiones (sin espacios ni acentos).",
    }),
  description: z.string().min(1, { error: "Agregá una descripción." }),
  price: z.coerce
    .number({ error: "Ingresá un precio válido." })
    .int()
    .positive({ error: "El precio tiene que ser mayor a cero." }),
  categoryId: z.string().min(1, { error: "Elegí una categoría." }),
  status: z.enum(["ACTIVE", "PAUSED", "SOLD_OUT"]),
});

export type ProductFormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
} | null;

function parseJsonField<T>(
  formData: FormData,
  field: string,
  schema: z.ZodType<T>
): T[] {
  const raw = formData.get(field);
  if (typeof raw !== "string" || raw.trim() === "") return [];
  try {
    return z.array(schema).parse(JSON.parse(raw));
  } catch {
    return [];
  }
}

async function assertSlugAvailable(slug: string, excludeId?: string) {
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing && existing.id !== excludeId) {
    return false;
  }
  return true;
}

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await verifySession();

  const parsed = ProductSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      error: "Revisá los campos marcados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  if (!(await assertSlugAvailable(parsed.data.slug))) {
    return {
      error: "Ya existe un producto con esa URL (slug). Cambiala.",
      fieldErrors: { slug: ["Ya está en uso"] },
    };
  }

  const variants = parseJsonField(formData, "variantsJson", VariantSchema);
  const images = parseJsonField(formData, "imagesJson", ImageSchema);

  const product = await prisma.product.create({
    data: {
      ...parsed.data,
      variants: { create: variants },
      images: { create: images.map((img, i) => ({ ...img, order: i })) },
    },
  });

  revalidatePath("/admin/productos");
  revalidatePath("/catalogo");
  revalidatePath("/");
  redirect(`/admin/productos/${product.id}/editar?created=1`);
}

export async function updateProduct(
  productId: string,
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await verifySession();

  const parsed = ProductSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      error: "Revisá los campos marcados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  if (!(await assertSlugAvailable(parsed.data.slug, productId))) {
    return {
      error: "Ya existe otro producto con esa URL (slug). Cambiala.",
      fieldErrors: { slug: ["Ya está en uso"] },
    };
  }

  const variants = parseJsonField(formData, "variantsJson", VariantSchema);
  const images = parseJsonField(formData, "imagesJson", ImageSchema);

  await prisma.$transaction([
    prisma.productVariant.deleteMany({ where: { productId } }),
    prisma.productImage.deleteMany({ where: { productId } }),
    prisma.product.update({
      where: { id: productId },
      data: {
        ...parsed.data,
        variants: { create: variants },
        images: { create: images.map((img, i) => ({ ...img, order: i })) },
      },
    }),
  ]);

  revalidatePath("/admin/productos");
  revalidatePath(`/producto/${parsed.data.slug}`);
  revalidatePath("/catalogo");
  revalidatePath("/");
  redirect(`/admin/productos/${productId}/editar?saved=1`);
}

export async function deleteProduct(productId: string) {
  await verifySession();
  const product = await prisma.product.delete({ where: { id: productId } });
  revalidatePath("/admin/productos");
  revalidatePath("/catalogo");
  revalidatePath("/");
  revalidatePath(`/producto/${product.slug}`);
}

export async function duplicateProduct(productId: string) {
  await verifySession();

  const original = await prisma.product.findUnique({
    where: { id: productId },
    include: { variants: true, images: true },
  });
  if (!original) return;

  // Find a free "-copia", "-copia-2", "-copia-3"... slug.
  let suffix = "";
  let attempt = 1;
  let candidateSlug = `${original.slug}-copia`;
  while (await prisma.product.findUnique({ where: { slug: candidateSlug } })) {
    attempt += 1;
    suffix = `-${attempt}`;
    candidateSlug = `${original.slug}-copia${suffix}`;
  }

  const copy = await prisma.product.create({
    data: {
      name: `${original.name} (copia)`,
      slug: candidateSlug,
      description: original.description,
      price: original.price,
      status: "PAUSED", // arranca pausado para no publicar por accidente
      categoryId: original.categoryId,
      variants: {
        create: original.variants.map((v) => ({ size: v.size, color: v.color })),
      },
      images: {
        create: original.images.map((img) => ({
          url: img.url,
          publicId: img.publicId,
          order: img.order,
          color: img.color,
        })),
      },
    },
  });

  revalidatePath("/admin/productos");
  redirect(`/admin/productos/${copy.id}/editar?duplicated=1`);
}

const QuickUpdateSchema = z.object({
  price: z.coerce.number().int().positive(),
  status: z.enum(["ACTIVE", "PAUSED", "SOLD_OUT"]),
});

export async function quickUpdateProduct(productId: string, formData: FormData) {
  await verifySession();
  const parsed = QuickUpdateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const product = await prisma.product.update({
    where: { id: productId },
    data: parsed.data,
  });

  revalidatePath("/admin/productos");
  revalidatePath("/catalogo");
  revalidatePath("/");
  revalidatePath(`/producto/${product.slug}`);
}
