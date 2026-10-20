import { expect, test } from "@playwright/test";
import { open } from "@brute-force-games/site-setup/e2e";

/** The example's home page, in a real browser: its React island hydrates and counts presses. */

test("the island counts each press", async ({ page }) => {
  // Arrange: "Ready" only once every island on the page has hydrated, so no press is lost.
  await open(page, "/");
  const button = page.getByRole("button", { name: /Pressed \d+ times/u });
  // Act, Assert
  await button.click();
  await expect(button).toHaveText("Pressed 1 times");
  await button.click();
  await expect(button).toHaveText("Pressed 2 times");
});
