import { GameFriendId, GameTableId } from "@bfg-engine";
import { getBaseUrl } from "./bfg-starter-hosting";


export const createJoinGameUrl = (gameTableId: GameTableId) => {
  return `${getBaseUrl()}/games/${gameTableId}`;
}

export const createFriendUrl = (friendId: GameFriendId) => {
  console.log("createFriendUrl", friendId);
  return `${getBaseUrl()}/friends/${friendId}`;
}

export const createHostedGameUrl = (gameTableId: GameTableId) => {
  return `${getBaseUrl()}/hosted-games/${gameTableId}`;
}

export const createPlayerGameUrl = (gameTableId: GameTableId) => {
  return `${getBaseUrl()}/games/${gameTableId}`;
}
