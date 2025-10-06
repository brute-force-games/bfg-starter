import { GameFriendId, GameTableId } from "./types/core/branded-values/bfg-branded-ids";


const getWindowOrigin = () => {
  return window.location.origin;
}

export const createJoinGameUrl = (gameTableId: GameTableId) => {
  return `${getWindowOrigin()}/games/${gameTableId}`;
}

export const createFriendUrl = (friendId: GameFriendId) => {
  console.log("createFriendUrl", friendId);
  return `${getWindowOrigin()}/friends/${friendId}`;
}

export const createHostedGameUrl = (gameTableId: GameTableId) => {
  return `${getWindowOrigin()}/hosted-games/${gameTableId}`;
}

export const createPlayerGameUrl = (gameTableId: GameTableId) => {
  return `${getWindowOrigin()}/games/${gameTableId}`;
}
