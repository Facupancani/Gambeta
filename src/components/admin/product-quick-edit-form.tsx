"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_LABELS } from "@/lib/product-status";

/**
 * Inline price/status editor for the products table. Split out into its own
 * client component because Select's label-mapping function (children as a
 * function) can't be passed down from the server-rendered table page —
 * functions aren't serializable across the server/client boundary.
 */
export function ProductQuickEditForm({
  action,
  price,
  status,
}: {
  action: (formData: FormData) => void | Promise<void>;
  price: number;
  status: string;
}) {
  // Re-key on value change: after a successful save, revalidatePath
  // re-renders this row with new price/status but the same row identity,
  // and these uncontrolled fields won't pick up the new defaultValue on
  // their own — remounting them does (see BACKLOG.md for the same bug
  // found in the categories table).
  return (
    <form action={action} className="flex items-center gap-2">
      <Input
        key={price}
        type="number"
        name="price"
        defaultValue={price}
        min={1}
        className="h-8 w-28"
      />
      <Select key={status} name="status" defaultValue={status}>
        <SelectTrigger className="h-8 w-32">
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
      <Button type="submit" size="sm" variant="outline">
        Guardar
      </Button>
    </form>
  );
}
