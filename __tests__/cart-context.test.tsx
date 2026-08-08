import { beforeEach, expect, test } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CartProvider, useCart } from "@/lib/cart-context";

// cart-context is a Context + hooks, not a pure reducer function, so this
// exercises it through a tiny consumer component instead of unit-testing
// an extracted function — same approach the Next.js Vitest guide points
// to for anything that isn't a plain sync function/component (see
// vitest.config.mts's comment on why async Server Components aren't
// covered here at all).
function CartHarness() {
  const { items, addItem, removeItem, updateQuantity, totalItems, totalPrice } =
    useCart();

  const item = {
    variantId: "v1",
    productSlug: "botines-gambeta-veloz-fg",
    productName: "Botines Gambeta Veloz FG",
    price: 62000,
    size: "42",
  };
  const otherItem = { ...item, variantId: "v2", size: "43" };

  return (
    <div>
      <p data-testid="count">{totalItems}</p>
      <p data-testid="total">{totalPrice}</p>
      <p data-testid="lines">{items.length}</p>
      <button onClick={() => addItem(item)}>add v1</button>
      <button onClick={() => addItem(otherItem)}>add v2</button>
      <button onClick={() => removeItem("v1")}>remove v1</button>
      <button onClick={() => updateQuantity("v1", 3)}>set v1 qty 3</button>
      <button onClick={() => updateQuantity("v1", 0)}>zero v1 qty</button>
    </div>
  );
}

beforeEach(() => {
  localStorage.clear();
});

test("adding the same variant twice merges into one line with quantity 2", async () => {
  render(
    <CartProvider>
      <CartHarness />
    </CartProvider>
  );

  fireEvent.click(screen.getByText("add v1"));
  fireEvent.click(screen.getByText("add v1"));

  expect(await screen.findByTestId("lines")).toHaveTextContent("1");
  expect(screen.getByTestId("count")).toHaveTextContent("2");
  expect(screen.getByTestId("total")).toHaveTextContent("124000");
});

test("different variants stay as separate lines", async () => {
  render(
    <CartProvider>
      <CartHarness />
    </CartProvider>
  );

  fireEvent.click(screen.getByText("add v1"));
  fireEvent.click(screen.getByText("add v2"));

  expect(await screen.findByTestId("lines")).toHaveTextContent("2");
  expect(screen.getByTestId("count")).toHaveTextContent("2");
});

test("updateQuantity sets an exact quantity", async () => {
  render(
    <CartProvider>
      <CartHarness />
    </CartProvider>
  );

  fireEvent.click(screen.getByText("add v1"));
  await screen.findByTestId("lines");
  fireEvent.click(screen.getByText("set v1 qty 3"));

  expect(screen.getByTestId("count")).toHaveTextContent("3");
  expect(screen.getByTestId("total")).toHaveTextContent("186000");
});

test("updateQuantity to 0 removes the line, same as removeItem", async () => {
  render(
    <CartProvider>
      <CartHarness />
    </CartProvider>
  );

  fireEvent.click(screen.getByText("add v1"));
  await screen.findByTestId("lines");
  fireEvent.click(screen.getByText("zero v1 qty"));

  expect(screen.getByTestId("lines")).toHaveTextContent("0");
  expect(screen.getByTestId("count")).toHaveTextContent("0");
});

test("removeItem drops the line entirely", async () => {
  render(
    <CartProvider>
      <CartHarness />
    </CartProvider>
  );

  fireEvent.click(screen.getByText("add v1"));
  fireEvent.click(screen.getByText("add v2"));
  await screen.findByTestId("lines");
  fireEvent.click(screen.getByText("remove v1"));

  expect(screen.getByTestId("lines")).toHaveTextContent("1");
  expect(screen.getByTestId("count")).toHaveTextContent("1");
});
