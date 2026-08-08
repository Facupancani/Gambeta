import { expect, test } from "vitest";
import { pickImagesForColor } from "@/components/product-gallery";

const images = [
  { url: "blanco-1.jpg", color: "Blanco" },
  { url: "blanco-2.jpg", color: "Blanco" },
  { url: "negro-1.jpg", color: "Negro" },
  { url: "generico.jpg", color: null },
];

test("no color selected → returns every image untouched", () => {
  expect(pickImagesForColor(images, undefined)).toEqual(images);
  expect(pickImagesForColor(images, null)).toEqual(images);
});

test("color with tagged photos → returns only those, in original order", () => {
  expect(pickImagesForColor(images, "Blanco")).toEqual([
    images[0],
    images[1],
  ]);
});

test("color with no tagged photos → falls back to every image instead of an empty gallery", () => {
  expect(pickImagesForColor(images, "Azul")).toEqual(images);
});

test("product with no color-tagged images at all → any selected color is a no-op", () => {
  const untagged: { url: string; color?: string | null }[] = [
    { url: "a.jpg" },
    { url: "b.jpg" },
  ];
  expect(pickImagesForColor(untagged, "Blanco")).toEqual(untagged);
});
