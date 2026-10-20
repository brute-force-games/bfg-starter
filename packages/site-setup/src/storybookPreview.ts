import type { Decorator, Preview } from "@storybook/react-vite";
import { createElement } from "react";

/**
 * A site's Storybook preview (its .storybook/preview.tsx spreads this): a theme toolbar, as the
 * site's pages do it: "system" follows the OS; light and dark set `data-theme` on <html>, which
 * the tokens (./styles/tokens.css) read.
 */

/** Sets `root`'s theme from the toolbar's `theme`: light or dark, or the system's for anything else. */
export function applyTheme(theme: unknown, root: HTMLElement): void {
  if (theme === "light" || theme === "dark") {
    root.dataset["theme"] = theme;
  } else {
    delete root.dataset["theme"];
  }
}

/** Each story in the toolbar's theme. */
export const withTheme: Decorator = (Story, context) => {
  applyTheme(context.globals["theme"], document.documentElement);
  return createElement(Story);
};

export const sitePreview: Preview = {
  globalTypes: {
    theme: {
      description: "Color theme",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: [
          { value: "system", title: "Match system" },
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "system" },
  decorators: [withTheme],
  parameters: { backgrounds: { disable: true }, layout: "centered" },
};
