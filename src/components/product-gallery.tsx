"use client";

import { useState } from "react";
import Image from "next/image";
import { CategoryIcon } from "@/lib/category-icon";
import { cn } from "@/lib/utils";

type GalleryImage = { url: string; color?: string | null };

/**
 * Picks which images to show for a given color: images explicitly tagged
 * with that color if any exist, otherwise every image (covers products
 * that don't tag colors at all — the common case — and colors that don't
 * have a dedicated photo yet, which still show *something* instead of an
 * empty gallery). Exported so `product-detail.tsx` can reuse the exact
 * same rule to pick the cart-thumbnail image, instead of duplicating it.
 */
export function pickImagesForColor<T extends { color?: string | null }>(
  images: T[],
  color?: string | null
): T[] {
  if (!color) return images;
  const tagged = images.filter((image) => image.color === color);
  return tagged.length > 0 ? tagged : images;
}

export function ProductGallery({
  images,
  productName,
  categorySlug,
  categoryName,
  selectedColor,
}: {
  images: GalleryImage[];
  productName: string;
  categorySlug: string;
  categoryName: string;
  /** Currently selected variant's color, if any — filters which photos show. */
  selectedColor?: string | null;
}) {
  const displayed = pickImagesForColor(images, selectedColor);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Reset the active thumbnail back to 0 whenever the *set* of displayed
  // images changes (e.g. switching color to one with its own photos) —
  // otherwise the previous index could point at an unrelated photo, or
  // past the end of a shorter list. Adjusting state during render (React's
  // documented "adjust state when a prop changes" pattern) instead of an
  // effect, same approach already used in mobile-nav.tsx for the same
  // reason: an effect would fire a beat late and flash the stale photo.
  const displayedKey = displayed.map((image) => image.url).join("|");
  const [lastDisplayedKey, setLastDisplayedKey] = useState(displayedKey);
  if (displayedKey !== lastDisplayedKey) {
    setLastDisplayedKey(displayedKey);
    setSelectedIndex(0);
  }

  const active = displayed[selectedIndex];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-xl bg-secondary">
        {active ? (
          <Image
            src={active.url}
            alt={productName}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <CategoryIcon
              categorySlug={categorySlug}
              className="size-16"
              strokeWidth={1.25}
            />
            <span className="text-sm">{categoryName}</span>
          </div>
        )}
      </div>

      {/* Thumbnail strip — only worth showing once there's actually a
          choice to make (2+ photos). A single photo (or none) keeps the
          plain hero image above, same as before this gallery existed. */}
      {displayed.length > 1 && (
        <div className="mt-3 flex gap-2">
          {displayed.map((image, index) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-label={`Ver foto ${index + 1} de ${productName}`}
              aria-current={index === selectedIndex}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-md bg-secondary transition-colors",
                index === selectedIndex
                  ? "ring-2 ring-foreground"
                  : "opacity-70 hover:opacity-100"
              )}
            >
              <Image
                src={image.url}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
