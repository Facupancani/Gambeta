"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VariantEditor, type VariantItem } from "@/components/admin/variant-editor";
import { ImageUploader, type ProductImageItem } from "@/components/admin/image-uploader";
import { slugify } from "@/lib/slugify";
import { STATUS_LABELS } from "@/lib/product-status";
import type { ProductFormState } from "@/lib/actions/products";
import { generateProductDescription } from "@/lib/actions/ai";

type Category = { id: string; name: string };

export type ProductFormInitialData = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  categoryId: string;
  status: "ACTIVE" | "PAUSED" | "SOLD_OUT";
  variants: VariantItem[];
  images: ProductImageItem[];
};

export function ProductForm({
  categories,
  initial,
  action,
  submitLabel,
}: {
  categories: Category[];
  initial?: ProductFormInitialData;
  action: (
    prevState: ProductFormState,
    formData: FormData
  ) => Promise<ProductFormState>;
  submitLabel: string;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<ProductFormState, FormData>(
    action,
    null
  );

  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [variants, setVariants] = useState<VariantItem[]>(initial?.variants ?? []);
  const [images, setImages] = useState<ProductImageItem[]>(initial?.images ?? []);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  // AI description helper — separate from the main `useActionState` above
  // on purpose: it can't share that hook (its "form" would have to nest
  // inside the outer <form>, which is invalid HTML), and calling the
  // Server Action directly here is simpler than a second nested form.
  const [aiNotes, setAiNotes] = useState("");
  const [aiPending, setAiPending] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleGenerateDescription = async () => {
    if (!name.trim()) {
      setAiError("Escribí el nombre del producto primero.");
      return;
    }
    setAiPending(true);
    setAiError(null);
    const categoryName = categories.find((c) => c.id === categoryId)?.name;
    const result = await generateProductDescription({
      name,
      categoryName,
      notes: aiNotes,
    });
    setAiPending(false);
    if (result.error) {
      setAiError(result.error);
      return;
    }
    if (result.description) setDescription(result.description);
  };

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          name="name"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          required
        />
        {state?.fieldErrors?.name && (
          <p className="text-sm text-destructive">{state.fieldErrors.name[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="slug">URL (slug)</Label>
        <Input
          id="slug"
          name="slug"
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(slugify(e.target.value));
          }}
          required
        />
        <p className="text-xs text-muted-foreground">
          Se genera sola desde el nombre. Va a quedar en /producto/{slug || "..."}
        </p>
        {state?.fieldErrors?.slug && (
          <p className="text-sm text-destructive">{state.fieldErrors.slug[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          required
        />
        {state?.fieldErrors?.description && (
          <p className="text-sm text-destructive">
            {state.fieldErrors.description[0]}
          </p>
        )}

        {/* No hay equipo de marketing acá — esto ayuda a redactar algo
            razonable en vez de dejar el campo en blanco o copiar/pegar
            genérico. El texto que devuelve es un borrador para revisar y
            editar, no se guarda solo. */}
        <div className="mt-1 rounded-lg border border-dashed border-border p-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <p className="text-xs font-medium">Ayuda para redactarla (IA)</p>
          </div>
          <Input
            placeholder="Datos que tengas a mano: material, para qué cancha, color, corte... (opcional)"
            value={aiNotes}
            onChange={(e) => setAiNotes(e.target.value)}
            className="mt-2"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            disabled={aiPending}
            onClick={handleGenerateDescription}
          >
            {aiPending ? "Generando..." : "Generar borrador"}
          </Button>
          {aiError && <p className="mt-2 text-sm text-destructive">{aiError}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="price">Precio (ARS)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min={1}
            step={1}
            defaultValue={initial?.price}
            required
          />
          {state?.fieldErrors?.price && (
            <p className="text-sm text-destructive">{state.fieldErrors.price[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="status">Estado</Label>
          <Select name="status" defaultValue={initial?.status ?? "ACTIVE"}>
            <SelectTrigger id="status" className="w-full">
              <SelectValue>
                {(value: string) => STATUS_LABELS[value] ?? value}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">Activo</SelectItem>
              <SelectItem value="PAUSED">Pausado</SelectItem>
              <SelectItem value="SOLD_OUT">Agotado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="categoryId">Categoría</Label>
        <Select
          name="categoryId"
          value={categoryId}
          onValueChange={(value) => setCategoryId(value ?? "")}
        >
          <SelectTrigger id="categoryId" className="w-full">
            <SelectValue>
              {(value: string) =>
                categories.find((c) => c.id === value)?.name ??
                "Elegí una categoría"
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {state?.fieldErrors?.categoryId && (
          <p className="text-sm text-destructive">
            {state.fieldErrors.categoryId[0]}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label>Talles</Label>
        <VariantEditor variants={variants} onChange={setVariants} />
        <input type="hidden" name="variantsJson" value={JSON.stringify(variants)} />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Fotos</Label>
        <ImageUploader
          images={images}
          onChange={setImages}
          availableColors={[
            ...new Set(
              variants
                .map((v) => v.color?.trim())
                .filter((color): color is string => Boolean(color))
            ),
          ]}
        />
        <p className="text-xs text-muted-foreground">
          Si el producto tiene más de un color, podés etiquetar cada foto con
          el color que muestra — en la página del producto, elegir ese color
          va a mostrar esa foto automáticamente.
        </p>
        <input type="hidden" name="imagesJson" value={JSON.stringify(images)} />
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando..." : submitLabel}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/productos")}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
