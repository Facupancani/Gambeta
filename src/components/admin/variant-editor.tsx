"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type VariantItem = { size: string; color?: string };

export function VariantEditor({
  variants,
  onChange,
}: {
  variants: VariantItem[];
  onChange: (variants: VariantItem[]) => void;
}) {
  const update = (index: number, patch: Partial<VariantItem>) => {
    onChange(variants.map((v, i) => (i === index ? { ...v, ...patch } : v)));
  };

  const remove = (index: number) => {
    onChange(variants.filter((_, i) => i !== index));
  };

  const add = () => {
    onChange([...variants, { size: "", color: "" }]);
  };

  return (
    <div className="flex flex-col gap-2">
      {variants.map((variant, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            placeholder="Talle (ej: 42)"
            value={variant.size}
            onChange={(e) => update(index, { size: e.target.value })}
            className="w-32"
          />
          <Input
            placeholder="Color (opcional)"
            value={variant.color ?? ""}
            onChange={(e) => update(index, { color: e.target.value })}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Quitar talle"
            onClick={() => remove(index)}
          >
            <Trash2 />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={add}
        className="w-fit"
      >
        <Plus /> Agregar talle
      </Button>
      {variants.length === 0 && (
        <p className="text-xs text-muted-foreground">
          Sin talles cargados todavía — el producto se verá sin selector de
          talle en la página pública.
        </p>
      )}
    </div>
  );
}
