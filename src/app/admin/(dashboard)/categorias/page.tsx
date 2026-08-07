import { prisma } from "@/lib/prisma";
import {
  createCategory,
  renameCategory,
  deleteCategory,
} from "@/lib/actions/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Categorías</h1>

      <form
        action={async (formData: FormData) => {
          "use server";
          await createCategory(null, formData);
        }}
        className="mt-6 flex max-w-sm gap-2"
      >
        <Input name="name" placeholder="Nombre de la nueva categoría" required />
        <Button type="submit">Crear</Button>
      </form>

      {categories.length === 0 ? (
        <p className="mt-6 text-muted-foreground">
          Todavía no hay categorías cargadas.
        </p>
      ) : (
        <Table className="mt-6 max-w-2xl">
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Productos</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => {
              const renameWithId = renameCategory.bind(null, category.id);
              const deleteWithId = deleteCategory.bind(null, category.id);

              return (
                <TableRow key={category.id}>
                  <TableCell>
                    <form action={renameWithId} className="flex items-center gap-2">
                      <Input
                        // Re-key on name change: after a successful rename,
                        // revalidatePath re-renders this row with a new
                        // `category.name` but the same `category.id`, and an
                        // uncontrolled input won't pick up the new
                        // defaultValue on its own — remounting it does.
                        key={category.name}
                        name="name"
                        defaultValue={category.name}
                        className="h-8 w-48"
                      />
                      <Button type="submit" size="sm" variant="outline">
                        Guardar
                      </Button>
                    </form>
                  </TableCell>
                  <TableCell>{category._count.products}</TableCell>
                  <TableCell className="text-right">
                    <form action={deleteWithId}>
                      <ConfirmSubmitButton
                        size="sm"
                        variant="ghost"
                        confirmMessage={`¿Borrar la categoría "${category.name}"?`}
                        disabled={category._count.products > 0}
                      >
                        Borrar
                      </ConfirmSubmitButton>
                    </form>
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
