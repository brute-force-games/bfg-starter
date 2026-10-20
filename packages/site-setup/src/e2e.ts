import type { Locator, Page } from "@playwright/test";
import { READY_STATUS_NAME, readinessText } from "@brute-force-games/room-view/readiness";

/**
 * A site's end-to-end helpers (bfg-core's docs/design-notes/ready-status.md): every test opens a
 * page through `open`, which waits for the page's status to read "Ready" (a room's page, the
 * room's), so nothing is checked before the page can be used. Playwright's types only, never its
 * code: a site's runner must load one copy of it (playwright.ts says why).
 */

/** The page's one status (by its name, READY_STATUS_NAME), once it reads "Ready", in room-view's words. */
export const readyStatus = (page: Page): Locator =>
  page
    .getByRole("status", { name: READY_STATUS_NAME })
    .filter({ hasText: new RegExp(`^${readinessText({ kind: "ready" })}$`, "u") });

/** Waits for the page's status to read "Ready". */
export async function pageReady(page: Page): Promise<void> {
  await readyStatus(page).waitFor({ state: "visible" });
}

/** Waits for the island holding `locator` to hydrate (Astro takes its `ssr` attribute off). */
export async function islandHydrated(locator: Locator): Promise<void> {
  await locator.page().locator("astro-island:not([ssr])", { has: locator }).first().waitFor();
}

/** Opens `url` and waits until the page is ready: how every test starts on a page. */
export async function open(page: Page, url: string): Promise<void> {
  await page.goto(url);
  await pageReady(page);
}
