import { siteAstroConfig } from "@brute-force-games/site-setup/astro";

/** The example site: the shared Astro preset, its URL and port. */
export default siteAstroConfig({
  root: import.meta.dirname,
  site: "https://example.bruteforce.games",
  port: 4330,
});
