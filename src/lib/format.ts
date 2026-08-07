/** Formats an integer amount of Argentine pesos as "$45.000". */
export function formatPrice(priceInArs: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(priceInArs);
}
