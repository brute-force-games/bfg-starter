import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.{ts,tsx}", "tests/**/*.test.{ts,tsx}", "tests/**/*.spec.{ts,tsx}", "src/**/*.spec.{ts,tsx}"],
    exclude: ["modules/**"],
    environment: "node",
  },
});
