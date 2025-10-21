import { FileRoutesByTo } from "~/routeTree.gen";


export type ChildRoutesOf<TPath extends string> = Extract<
  keyof FileRoutesByTo,
  `${TPath}${string}`
>;
