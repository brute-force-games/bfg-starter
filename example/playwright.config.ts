import { sitePlaywrightConfig } from "@brute-force-games/site-setup/playwright";

/** The example site's end-to-end tests: the shared preset, against its own dev server (port 4330). */
export default sitePlaywrightConfig({ port: 4330 });
