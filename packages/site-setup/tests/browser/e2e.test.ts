import { chromium, type Browser, type Page } from "@playwright/test";
import { islandHydrated, open, pageReady, readyStatus } from "../../src/e2e.ts";

/**
 * The e2e helpers (src/e2e.ts) in a real headless Chromium: a page whose status turns "Ready" late,
 * an island that hydrates late, and a page that never gets there. No server: each page is set
 * inline, or opened from a data: URL.
 */

let browser: Browser;
let page: Page;

beforeAll(async () => {
  browser = await chromium.launch();
});

afterAll(async () => {
  await browser.close();
});

beforeEach(async () => {
  page = await browser.newPage();
  page.setDefaultTimeout(2000);
});

afterEach(async () => {
  await page.close();
});

/** A page whose status reads "Loading…", then `then` after `afterMs`. */
const statusPage = (then: string, afterMs: number): string =>
  `<p role="status" aria-label="Page status">Loading…</p><script>setTimeout(() => { document.querySelector("p").textContent = ${JSON.stringify(then)}; }, ${String(afterMs)});</script>`;

describe("waiting for the page to be ready", () => {
  it("waits until the status reads Ready", async () => {
    // Arrange
    await page.setContent(statusPage("Ready", 200));
    // Act
    await pageReady(page);
    // Assert
    expect(await readyStatus(page).count()).toBe(1);
  });

  it("doesn't take an unnamed status's Ready for the page's", async () => {
    // Arrange: a game's own status says Ready; the page's still loads.
    await page.setContent(
      '<p role="status">Ready</p><p role="status" aria-label="Page status">Loading…</p>',
    );
    // Act, Assert
    await expect(pageReady(page)).rejects.toThrow(/Timeout/u);
  });

  it("doesn't take another status for Ready", async () => {
    // Arrange
    await page.setContent(statusPage("Ready to go", 0));
    // Act, Assert
    await expect(pageReady(page)).rejects.toThrow(/Timeout/u);
  });

  it("opens a page, and waits for its Ready", async () => {
    await open(page, `data:text/html,${encodeURIComponent(statusPage("Ready", 100))}`);
    expect(await readyStatus(page).count()).toBe(1);
  });
});

describe("waiting for an island to hydrate", () => {
  it("waits until its island loses ssr", async () => {
    // Arrange
    await page.setContent(
      '<astro-island ssr><button>Press</button></astro-island><script>setTimeout(() => document.querySelector("astro-island").removeAttribute("ssr"), 200);</script>',
    );
    const button = page.getByRole("button", { name: "Press" });
    // Act
    await islandHydrated(button);
    // Assert
    expect(await page.locator("astro-island[ssr]").count()).toBe(0);
  });

  it("times out while it still shows the server's HTML", async () => {
    await page.setContent("<astro-island ssr><button>Press</button></astro-island>");
    await expect(islandHydrated(page.getByRole("button", { name: "Press" }))).rejects.toThrow(
      /Timeout/u,
    );
  });
});
