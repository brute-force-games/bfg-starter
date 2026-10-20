import { createRequire } from "node:module";
import { join } from "node:path";
import type { Browser, BrowserType, Page } from "@playwright/test";
import { z } from "zod";
import { readyStatus } from "../e2e.ts";
import {
  SMOKE_TIMEOUT_MS,
  type PageVisit,
  type ServerError,
  type SmokeBrowser,
} from "./smokeCheck.ts";

/**
 * The smoke check's browser: headless Chromium from the site's own Playwright, loaded from the
 * site's install (`root`), never this package's: the site links the setup by `file:`, and inside
 * Playwright's runner (the e2e gate) a second copy would refuse to load (playwright.ts says why).
 */

/** Playwright's Chromium, as much of it as the check uses. */
const browserTypeSchema = z.custom<BrowserType>(
  (value) => typeof value === "object" && value !== null && "launch" in value,
);

/** The site's Playwright module (a function, Playwright's `test`, carrying its browsers). */
const playwrightSchema = z.custom<{ readonly chromium: unknown }>(
  (value) =>
    (typeof value === "function" || typeof value === "object") &&
    value !== null &&
    "chromium" in value,
);

/** The site's own Playwright's Chromium, from `root`'s install; why not, if it has none. */
export function siteChromium(root: string): BrowserType {
  const requireFromSite = createRequire(join(root, "package.json"));
  let playwright: unknown;
  try {
    playwright = requireFromSite("@playwright/test");
  } catch {
    throw new Error(
      `No @playwright/test in ${root}: the smoke check uses the site's own. Install it there.`,
    );
  }
  return chromiumOf(playwright);
}

/** The Chromium a loaded Playwright module carries; a parse error if it isn't one. */
export const chromiumOf = (playwright: unknown): BrowserType =>
  browserTypeSchema.parse(playwrightSchema.parse(playwright).chromium);

/** Opens `url` in `page`: what it saw until its status read Ready, or `timeoutMs` passed. */
async function visitIn(page: Page, url: string, timeoutMs: number): Promise<PageVisit> {
  const pageErrors: string[] = [];
  const serverErrors: ServerError[] = [];
  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });
  page.on("response", (response) => {
    if (response.status() >= 500) {
      serverErrors.push({ url: response.url(), status: response.status() });
    }
  });
  let ready = true;
  try {
    await page.goto(url, { timeout: timeoutMs });
    await readyStatus(page).waitFor({ state: "visible", timeout: timeoutMs });
  } catch {
    ready = false;
  }
  return { pageErrors, serverErrors, ready };
}

/** A smoke browser over `browser`: a fresh page per visit, closed after it. */
export const smokeBrowserOver = (browser: Browser, timeoutMs = SMOKE_TIMEOUT_MS): SmokeBrowser => ({
  timeoutMs,
  visit: async (url) => {
    const page = await browser.newPage();
    try {
      return await visitIn(page, url, timeoutMs);
    } finally {
      await page.close();
    }
  },
  close: () => browser.close(),
});

/** Launches the site's headless Chromium, for one smoke check. */
export const openSiteBrowser = async (
  root: string,
  timeoutMs = SMOKE_TIMEOUT_MS,
): Promise<SmokeBrowser> => smokeBrowserOver(await siteChromium(root).launch(), timeoutMs);
