// @vitest-environment jsdom
import { composeStory } from "@storybook/react";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { applyTheme, sitePreview } from "../src/storybookPreview.ts";

/** A site's Storybook preview (src/storybookPreview.ts): its theme toolbar, as the pages do it. */

afterEach(() => {
  delete document.documentElement.dataset["theme"];
});

describe("the theme", () => {
  it.each([
    { theme: "light", set: "light" },
    { theme: "dark", set: "dark" },
    { theme: "system", set: undefined },
    { theme: undefined, set: undefined },
  ])("$theme sets data-theme to $set", ({ theme, set }) => {
    // Arrange
    document.documentElement.dataset["theme"] = "stale";
    // Act
    applyTheme(theme, document.documentElement);
    // Assert
    expect(document.documentElement.dataset["theme"]).toBe(set);
  });
});

describe("a story, in the preview", () => {
  it("is shown in the toolbar's theme", () => {
    // Arrange
    const Story = composeStory(
      { render: () => createElement("p", null, "hello"), globals: { theme: "dark" } },
      { title: "Example" },
      sitePreview,
    );
    // Act
    const html = renderToString(createElement(Story));
    // Assert
    expect(html).toBe("<p>hello</p>");
    expect(document.documentElement.dataset["theme"]).toBe("dark");
  });
});
