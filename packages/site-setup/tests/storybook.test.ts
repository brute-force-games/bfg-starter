import { LINKED_DEDUPE } from "../src/astro.ts";
import { SITE_STORIES, siteStorybookConfig, viteFinalFor } from "../src/storybook.ts";

/** A site's Storybook (src/storybook.ts): React on Vite, its own stories, its links served. */

const SITE = { root: "/sites/one" };

describe("a site's Storybook", () => {
  it("is React on Vite, the site's own stories, with no telemetry", () => {
    expect(siteStorybookConfig(SITE)).toMatchObject({
      framework: "@storybook/react-vite",
      stories: [...SITE_STORIES],
      core: { disableTelemetry: true },
    });
  });

  it("leaves Storybook's Vite alone when the site links nothing", () => {
    // Arrange
    const vite = { root: "/sites/one/.storybook" };
    // Act, Assert
    expect(viteFinalFor(SITE)(vite)).toBe(vite);
  });

  it("serves the linked checkouts, one copy of each shared package, as the Astro config does", () => {
    // Arrange
    const vite = { resolve: { alias: { "@": "/sites/one/src" } }, server: { port: 6006 } };
    // Act
    const final = viteFinalFor({ ...SITE, linked: "/sites" })(vite);
    // Assert
    expect(final).toEqual({
      resolve: { alias: { "@": "/sites/one/src" }, dedupe: [...LINKED_DEDUPE] },
      server: { port: 6006, fs: { allow: ["/sites/one", "/sites"] } },
    });
  });
});
