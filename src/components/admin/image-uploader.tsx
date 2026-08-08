"use client";

import { useState } from "react";
import Image from "next/image";
import Script from "next/script";
import { ArrowLeft, ArrowRight, ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ProductImageItem = { url: string; publicId?: string; color?: string };

// Cloudinary's widget attaches itself to `window.cloudinary` once its script loads.
declare global {
  interface Window {
    cloudinary?: {
      createUploadWidget: (
        options: Record<string, unknown>,
        callback: (
          error: unknown,
          result: { event: string; info: { secure_url: string; public_id: string } }
        ) => void
      ) => { open: () => void };
    };
  }
}

/**
 * Drag&drop-capable image uploader for products. Opens Cloudinary's hosted
 * widget (unsigned preset — no server round-trip needed) and keeps a local
 * ordered list of {url, publicId}. The parent form serializes that list into
 * a hidden JSON field on submit; nothing is persisted until the whole
 * product form is saved.
 */
export function ImageUploader({
  images,
  onChange,
  availableColors = [],
}: {
  images: ProductImageItem[];
  onChange: (images: ProductImageItem[]) => void;
  /** Distinct colors already entered in the variants/talles editor above —
   * lets each photo be tagged against one of them instead of free text, so
   * it can't drift out of sync with what the size selector actually offers. */
  availableColors?: string[];
}) {
  const [scriptReady, setScriptReady] = useState(false);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const configured = Boolean(cloudName && uploadPreset);

  const openWidget = () => {
    if (!configured || !scriptReady || !window.cloudinary) return;

    // Seeded from current images, then updated on every successful upload
    // within this widget session — the widget can fire its callback once
    // per file when multiple files are dropped at once, so we accumulate
    // into this local variable rather than closing over the (stale) `images`
    // prop on every call.
    let uploaded = [...images];

    window.cloudinary
      .createUploadWidget(
        {
          cloudName,
          uploadPreset,
          multiple: true,
          maxFiles: 8,
          sources: ["local", "url", "camera"],
        },
        (error, result) => {
          if (!error && result?.event === "success") {
            uploaded = [
              ...uploaded,
              { url: result.info.secure_url, publicId: result.info.public_id },
            ];
            onChange(uploaded);
          }
        }
      )
      .open();
  };

  const removeAt = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const setColor = (index: number, color: string) => {
    onChange(
      images.map((image, i) =>
        i === index ? { ...image, color: color || undefined } : image
      )
    );
  };

  return (
    <div>
      <Script
        src="https://upload-widget.cloudinary.com/global/all.js"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
      />

      <div className="flex flex-wrap gap-3">
        {images.map((image, index) => (
          <div key={image.publicId ?? image.url} className="flex flex-col gap-1">
            <div className="group relative h-24 w-24 overflow-hidden rounded-lg border border-border bg-secondary">
              <Image
                src={image.url}
                alt=""
                fill
                sizes="96px"
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Mover antes"
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                >
                  <ArrowLeft />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Quitar imagen"
                  onClick={() => removeAt(index)}
                >
                  <X />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Mover después"
                  disabled={index === images.length - 1}
                  onClick={() => move(index, 1)}
                >
                  <ArrowRight />
                </Button>
              </div>
              {index === 0 && (
                <span className="absolute bottom-1 left-1 rounded bg-background/80 px-1.5 py-0.5 text-[10px] font-medium">
                  Portada
                </span>
              )}
            </div>
            {/* Only shown once the product actually has colors to tag
                against — otherwise it'd just be a dropdown with one
                meaningless "Sin color" option on every product. */}
            {availableColors.length > 0 && (
              <select
                aria-label="Color de esta foto"
                value={image.color ?? ""}
                onChange={(e) => setColor(index, e.target.value)}
                className="w-24 rounded-md border border-border bg-transparent px-1 py-1 text-[11px] text-foreground outline-none focus:border-foreground/50"
              >
                <option value="">Sin color</option>
                {availableColors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={openWidget}
          disabled={!configured || !scriptReady}
          className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border text-xs text-muted-foreground hover:border-primary/50 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ImagePlus className="size-5" />
          Subir
        </button>
      </div>

      {!configured && (
        <p className="mt-2 text-xs text-destructive">
          Falta configurar Cloudinary en el .env (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME /
          NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET).
        </p>
      )}
    </div>
  );
}
