import { GameFriendId } from "@bfg-engine";
import { getBaseUrl } from "./bfg-starter-hosting";
import type { BfgGameInstanceId } from "../modules/bfg-engine/src/models/types/bfg-branded-uuids";


export const createFriendUrl = (friendId: GameFriendId) => {
  console.log("createFriendUrl", friendId);
  return `${getBaseUrl()}/friends/${friendId}`;
}

export const createJoinGameUrl = (gameInstanceId: BfgGameInstanceId) => {
  return `${getBaseUrl()}/games/${gameInstanceId}`;
}

export const createHostedGameUrl = (gameInstanceId: BfgGameInstanceId) => {
  return `${getBaseUrl()}/hosted-games/${gameInstanceId}`;
}

export const createPlayerGameUrl = (gameInstanceId: BfgGameInstanceId) => {
  return `${getBaseUrl()}/games/${gameInstanceId}`;
}
