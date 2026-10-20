import { useEffect, useState } from "react";
import { whenAllIslandsHydrated } from "./islands.ts";

/**
 * Whether every island on the page has hydrated (islands.ts): false in the server's HTML and
 * until the last island does, then true. For a page's status island; a room's page combines it
 * with the room's own readiness.
 */
export function useAllIslandsHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(
    () =>
      whenAllIslandsHydrated(document, () => {
        setHydrated(true);
      }),
    [],
  );
  return hydrated;
}
