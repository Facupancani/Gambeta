/** Turns "Botines Gambeta Veloz FG" into "botines-gambeta-veloz-fg". */
export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip combining diacritics (á→a, ñ→n, etc.)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
}
