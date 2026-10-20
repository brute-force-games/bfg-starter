import { extname, normalize, resolve, sep } from "node:path";

/** A static build served under a path of the dev server (Storybook's, at /storybook/): its files, safely. */

const contentTypes: Readonly<Record<string, string>> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".map": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

/** A file's Content-Type, by its extension. */
export function contentTypeFor(path: string): string {
  return contentTypes[extname(path).toLowerCase()] ?? "application/octet-stream";
}

/** Where a request under the mount goes: to its trailing-slash form, a file, or nowhere. */
export type StaticTarget =
  | { readonly kind: "redirect"; readonly location: string }
  | { readonly kind: "file"; readonly path: string }
  | { readonly kind: "outside" };

/**
 * Maps a request under `mount` (e.g. "/storybook") onto a file in `root`. The bare mount path
 * redirects to its trailing-slash form, so the build's relative asset URLs resolve. A path
 * that escapes `root` (e.g. "/storybook/../package.json") is refused.
 */
export function resolveStaticTarget(root: string, mount: string, requestUrl: string): StaticTarget {
  const pathname = decodeURIComponent(new URL(requestUrl, "http://localhost").pathname);
  if (pathname === mount) {
    return { kind: "redirect", location: `${mount}/` };
  }
  // URL parsing has already collapsed "..", so anything that climbed out of the mount lands here.
  if (!pathname.startsWith(`${mount}/`)) {
    return { kind: "outside" };
  }
  const relative = pathname.slice(mount.length + 1);
  const withIndex = relative === "" || relative.endsWith("/") ? `${relative}index.html` : relative;
  const rootDir = resolve(root);
  const path = resolve(rootDir, normalize(withIndex));
  if (path !== rootDir && !path.startsWith(rootDir + sep)) {
    return { kind: "outside" };
  }
  return { kind: "file", path };
}
