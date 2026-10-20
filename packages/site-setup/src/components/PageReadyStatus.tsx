import {
  READY_STATUS_NAME,
  readinessText,
  type RoomReadiness,
} from "@brute-force-games/room-view/readiness";
import { useAllIslandsHydrated } from "./useAllIslandsHydrated.ts";

/**
 * A page's ready status, for a page with no room (bfg-core's docs/design-notes/ready-status.md):
 * "Loading…" in the server's HTML and until every island has hydrated, then "Ready", in room-view's
 * words, so a player reads the same status on every page. One per page: BaseLayout places it, and
 * a room's page puts the room's status there instead. Named as room-ui's ReadyStatus is
 * (READY_STATUS_NAME), so an end-to-end test finds the page's one status by its role and name, and
 * waits for its text (the setup's `pageReady`); a game's own statuses stay unnamed beside it.
 */

/** A page's readiness: loading until its islands have hydrated, then ready. */
export const pageReadiness = (hydrated: boolean): RoomReadiness =>
  hydrated ? { kind: "ready" } : { kind: "loading" };

export function PageReadyStatus(): React.JSX.Element {
  return (
    <output aria-live="polite" aria-label={READY_STATUS_NAME}>
      {readinessText(pageReadiness(useAllIslandsHydrated()))}
    </output>
  );
}
