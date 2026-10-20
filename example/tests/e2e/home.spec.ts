import { expect, test } from "@playwright/test";

/** The example's home page, in a real browser: its React island hydrates and counts presses. */

test("the island counts each press", async ({ page }) => {
  await page.goto("/");
  const button = page.getByRole("button", { name: /Pressed \d+ times/u });

  await button.click();
  await button.click();

  await expect(button).toHaveText("Pressed 2 times");
});
