/**
 * Whether a page's Astro islands have all hydrated: Astro takes an island's `ssr` attribute off
 * once it has, and a press before then is lost. What "Ready" means on a page with no room
 * (bfg-core's docs/design-notes/ready-status.md): every island, not only the status's own.
 */

/** The selector for an island still showing the server's HTML. */
const UNHYDRATED_ISLAND = "astro-island[ssr]";

/** Whether no island under `root` is still waiting to hydrate. */
export const allIslandsHydrated = (root: ParentNode): boolean =>
  root.querySelector(UNHYDRATED_ISLAND) === null;

/**
 * Calls `done` once every island in `document` has hydrated: at once if they have, else when the
 * last one does (a MutationObserver, disconnected then). Returns what stops watching.
 */
export function whenAllIslandsHydrated(document: Document, done: () => void): () => void {
  if (allIslandsHydrated(document)) {
    done();
    return () => {
      // Nothing is being watched.
    };
  }
  const observer = new MutationObserver(() => {
    if (allIslandsHydrated(document)) {
      observer.disconnect();
      done();
    }
  });
  observer.observe(document, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["ssr"],
  });
  return () => {
    observer.disconnect();
  };
}
