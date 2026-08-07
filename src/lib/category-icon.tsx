import {
  SportShoe,
  Volleyball,
  Shield,
  Shirt,
  Package,
  type LucideProps,
} from "lucide-react";

/**
 * Illustrated placeholder per category, used wherever a product has no
 * real photo yet (see BACKLOG.md "Pase de diseño" — gives visual weight
 * instead of the old plain-text fallback). Keyed by Category.slug from the
 * seed (prisma/seed.ts); falls back to a generic box icon for anything else.
 *
 * Implemented as a component (not a lookup returning a component reference)
 * on purpose — `react-hooks/static-components` flags assigning the result
 * of a function call to a PascalCase variable and rendering it as JSX,
 * since that pattern usually means a *new* component was created during
 * render. Resolving the icon inside this component's own body sidesteps
 * that without actually changing the behavior.
 */
const CATEGORY_ICONS: Record<string, typeof SportShoe> = {
  botines: SportShoe,
  pelotas: Volleyball,
  canilleras: Shield,
  medias: Shirt,
};

export function CategoryIcon({
  categorySlug,
  ...props
}: { categorySlug: string } & LucideProps) {
  const Icon = CATEGORY_ICONS[categorySlug] ?? Package;
  return <Icon {...props} />;
}
