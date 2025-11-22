import { FileRoutesByTo, FileRouteTypes } from "~/routeTree.gen";


export type ChildRoutesOf<TPath extends string> = Extract<
  keyof FileRoutesByTo,
  `${TPath}${string}`
>;


export type NoActivitiesTabId = Extract<
  FileRouteTypes["id"],
  "/new-lobby" | "/my-player-profiles"
>;


// export interface GameInstanceIds {
//   gameInstanceId: BfgGameInstanceId;
//   gameTableId: BfgGameTableId;
//   gameRoomId: BfgGameRoomId;
// }


// export const useGameAndRoomIdsFromGameInstanceId = (gameInstanceId: BfgGameInstanceId) => {
//   const instanceKey = extractUuidFromBfgUuidString(gameInstanceId) as BfgUuidMethodKeyValue;
//   const gameTableId = BfgGameTableIdToolbox.createIdForKey(instanceKey);
//   const gameRoomId = BfgGameRoomIdToolbox.createIdForKey(instanceKey);

//   return {
//     gameTableId,
//     gameRoomId,
//     gameInstanceId,
//   };
// };


// const extractUuidFromBfgUuidString = (bfgUuidString: string) => {
//   const uuid = bfgUuidString.split("_").slice(-1)[0];
//   return uuid;
// };
