import { test, expect } from "@playwright/test";

// Critical-path e2e: this is the whole business model (no payment
// gateway, no order records — WhatsApp *is* checkout), so it's the one
// flow that absolutely has to keep working. Runs against the real dev
// server + real (seeded) DB per playwright.config.ts — no mocking layer,
// consistent with this being a portfolio demo, not a project with a
// dedicated test-DB pipeline (see BACKLOG.md "Pase portfolio-ready").

test("catálogo → PDP → carrito → link de WhatsApp con el pedido", async ({
  page,
}) => {
  await page.goto("/catalogo");
  await expect(page.getByRole("heading", { name: "Catálogo" })).toBeVisible();

  // `exact: false` — the whole ProductCard is one <a> (image + eyebrow +
  // name + price all inside it), so its accessible name is all of that
  // concatenated, not just the product name in isolation.
  await page
    .getByRole("link", { name: "Botines Gambeta Veloz FG", exact: false })
    .click();
  await expect(page).toHaveURL(/\/producto\/gambeta-veloz-fg/);

  // Pick a specific size instead of relying on whatever's selected by
  // default, so the assertions below aren't tied to seed-data order.
  await page.getByRole("button", { name: "40 · Negro/Verde" }).click();
  await page.getByRole("button", { name: "Agregar al carrito" }).click();
  await expect(page.getByText("Agregado al carrito")).toBeVisible();

  await page.getByRole("link", { name: "Ver carrito" }).click();
  await expect(page).toHaveURL(/\/carrito/);
  await expect(
    page.getByRole("link", { name: "Botines Gambeta Veloz FG" })
  ).toBeVisible();
  // \s also matches U+00A0 (the non-breaking space Intl's es-AR currency
  // formatter puts after "$" — see __tests__/format.test.ts), so this
  // doesn't depend on getting that exact whitespace character right here.
  await expect(page.getByText(/\$\s*62\.000/).first()).toBeVisible();

  // wa.me redirects to api.whatsapp.com essentially instantly — even
  // reading `popup.url()` right after the `popup` event fired still saw
  // the post-redirect URL in practice, so following the popup at all is
  // a dead end. Instead, intercept window.open() itself in the page so
  // we capture the exact URL buildWhatsappCheckoutUrl() (src/lib/whatsapp.ts)
  // computed, before anything gets a chance to navigate/redirect.
  await page.evaluate(() => {
    (window as unknown as { __openedUrl?: string }).__openedUrl = undefined;
    window.open = (url) => {
      (window as unknown as { __openedUrl?: string }).__openedUrl = String(url);
      return null;
    };
  });
  await page.getByRole("button", { name: "Finalizar por WhatsApp" }).click();

  const openedUrl = await page.evaluate(
    () => (window as unknown as { __openedUrl?: string }).__openedUrl
  );
  expect(openedUrl).toBeTruthy();
  const popupUrl = new URL(openedUrl!);
  expect(popupUrl.hostname).toBe("wa.me");
  const message = decodeURIComponent(popupUrl.search);
  expect(message).toContain("Botines Gambeta Veloz FG");
  expect(message).toContain("40");
  expect(message).toContain("Total: $");
});
