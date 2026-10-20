import { contentTypeFor, resolveStaticTarget } from "../../src/integrations/staticDir.ts";

/** A static build under a dev server's path (src/integrations/staticDir.ts): its files, safely. */

const root = "/srv/storybook-static";

describe("resolveStaticTarget", () => {
  it("redirects the bare mount to its trailing-slash form so relative assets resolve", () => {
    expect(resolveStaticTarget(root, "/storybook", "/storybook")).toEqual({
      kind: "redirect",
      location: "/storybook/",
    });
  });

  it.each([
    ["/storybook/", `${root}/index.html`],
    ["/storybook/iframe.html?id=button--primary", `${root}/iframe.html`],
    ["/storybook/sb-manager/runtime.js", `${root}/sb-manager/runtime.js`],
    ["/storybook/assets/", `${root}/assets/index.html`],
  ])("maps %s to %s", (url, path) => {
    expect(resolveStaticTarget(root, "/storybook", url)).toEqual({ kind: "file", path });
  });

  it.each([
    "/storybook/../package.json",
    "/storybook/%2e%2e/secrets.txt",
    "/storybook/a/../../x",
    "/storybook/..%2F..%2Fpackage.json",
  ])("refuses %s, which escapes the build directory", (url) => {
    expect(resolveStaticTarget(root, "/storybook", url)).toEqual({ kind: "outside" });
  });
});

describe("contentTypeFor", () => {
  it.each([
    ["index.html", "text/html; charset=utf-8"],
    ["runtime.JS", "text/javascript; charset=utf-8"],
    ["font.woff2", "font/woff2"],
    ["blob.bin", "application/octet-stream"],
  ])("types %s as %s", (path, type) => {
    expect(contentTypeFor(path)).toBe(type);
  });
});
