// Extends Vitest's `expect` with jest-dom matchers (toHaveTextContent,
// toBeInTheDocument, etc.) used across __tests__/*.test.tsx.
import "@testing-library/jest-dom/vitest";

// React Testing Library's auto-cleanup-after-each-test hooks into a
// global `afterEach` — since vitest.config.mts doesn't set `test.globals:
// true` (tests import `test`/`expect` explicitly instead, matching the
// official Next.js Vitest guide), that hook never registers on its own.
// Without this, DOM trees from earlier tests in the same file pile up and
// break selectors like `getByText` ("multiple elements found") in any
// later test — confirmed by hitting exactly that failure before adding
// this line.
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});
