import { smokeLines, smokePasses, smokeSite } from "../smoke/smokeCheck.ts";
import { yourDevServerUrl } from "./ownDevServer.ts";
import type { SitePorts } from "./ports.ts";
import type { SiteConfig } from "./siteConfig.ts";

/**
 * `bfg-site smoke`: whether the dev server in play (yours, at E2E_BASE_URL or the site's port;
 * verify's own when verify runs it) is healthy, page by page, before a heavy run. It never starts
 * or restarts a server. Exit 1 when it isn't, saying each failed page's first error.
 */
export async function smokeCommand(
  args: readonly string[],
  site: SitePorts,
  config: SiteConfig,
): Promise<number> {
  if (args.length > 0) {
    site.complain("Usage: bfg-site smoke");
    return 2;
  }
  const outcome = await smokeSite(
    site.root,
    config,
    yourDevServerUrl(config.devServerPort, site.env),
    site.smoke,
  );
  const passed = smokePasses(outcome);
  for (const line of smokeLines(outcome)) {
    (passed ? site.say : site.complain)(line);
  }
  return passed ? 0 : 1;
}
