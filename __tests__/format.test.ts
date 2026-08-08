import { expect, test } from "vitest";
import { formatPrice } from "@/lib/format";

// Intl's es-AR currency format puts a U+00A0 (non-breaking space) between
// "$" and the number, not a regular space — confirmed by inspecting the
// real output rather than guessed, hence the explicit   escape below
// (a literal space character here would silently make these tests wrong).
const NBSP = " ";

test("formats a round number with thousand separators", () => {
  expect(formatPrice(62000)).toBe(`$${NBSP}62.000`);
});

test("formats zero", () => {
  expect(formatPrice(0)).toBe(`$${NBSP}0`);
});

test("formats large numbers with multiple thousand separators", () => {
  expect(formatPrice(1234567)).toBe(`$${NBSP}1.234.567`);
});

test("rounds decimals away (maximumFractionDigits: 0)", () => {
  expect(formatPrice(49999.6)).toBe(`$${NBSP}50.000`);
});
