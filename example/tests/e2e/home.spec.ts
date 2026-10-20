import { expect, test } from "@playwright/test";

/** The example's home page, in a real browser: its React island hydrates and counts presses. */

test("the island counts each press", async ({ page }) => {
  // Arrange
  await page.goto("/");
  // Astro takes `ssr` off an island once it has hydrated: a press before then is lost.
  const island = page.locator("astro-island", { has: page.getByRole("button") });
  await expect(island).not.toHaveAttribute("ssr");
  const button = island.getByRole("button", { name: /Pressed \d+ times/u });
  // Act, Assert
  await button.click();
  await expect(button).toHaveText("Pressed 1 times");
  await button.click();
  await expect(button).toHaveText("Pressed 2 times");
});
