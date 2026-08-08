import { expect, test } from "vitest";
import { slugify } from "@/lib/slugify";

test("lowercases and joins words with hyphens", () => {
  expect(slugify("Botines Gambeta Veloz FG")).toBe("botines-gambeta-veloz-fg");
});

test("strips accents (Spanish content is the whole point here)", () => {
  expect(slugify("Canilleras Pequeñas")).toBe("canilleras-pequenas");
  expect(slugify("Botín Última Edición")).toBe("botin-ultima-edicion");
});

test("collapses non-alphanumeric runs into a single hyphen", () => {
  expect(slugify("Medias N°5 / Talle Único")).toBe("medias-n-5-talle-unico");
});

test("trims leading/trailing hyphens", () => {
  expect(slugify("  ¡Botines!  ")).toBe("botines");
});
