"use client";

import { useState } from "react";
import Image from "next/image";
import { CategoryIcon } from "@/lib/category-icon";
import { cn } from "@/lib/utils";

type GalleryImage = { url: string };

export function ProductGallery({
  images,
  productName,
  categorySlug,
  categoryName,
}: {
  images: GalleryImage[];
  productName: string;
  categorySlug: string;
  categoryName: string;
}) {
  const [selected, setSelected] = useState(0);
  const active = images[selected];

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
      {images.length > 1 && (
        <div className="mt-3 flex gap-2">
          {images.map((image, index) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setSelected(index)}
              aria-label={`Ver foto ${index + 1} de ${productName}`}
              aria-current={index === selected}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-md bg-secondary transition-colors",
                index === selected
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
