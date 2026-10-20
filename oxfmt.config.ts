import { siteOxfmtConfig } from "./packages/site-setup/src/oxfmt.ts";

/**
 * bfg-starter's own formatting: the setup formatted the way every site is, by its own preset. The
 * old app's modules/ (in git history's terms, not this repo's) is left alone.
 */
export default siteOxfmtConfig({ ignore: ["modules/**"] });
