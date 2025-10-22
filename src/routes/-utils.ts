import { FileRoutesByTo, FileRouteTypes } from "~/routeTree.gen";


export type ChildRoutesOf<TPath extends string> = Extract<
  keyof FileRoutesByTo,
  `${TPath}${string}`
>;


export type NoActivitiesTabId = Extract<
  FileRouteTypes["id"],
  "/new-lobby" | "/my-player-profiles"
>;