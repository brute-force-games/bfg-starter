import { GameTableId } from "./types/core/branded-values/bfg-branded-ids";
import { DbGameFriendId, DbGameTableId } from "./types/core/branded-values/branded-strings";


// export const createLobbyUrl = (lobbyId: DbGameLobbyId) => {
//   return `/lobbies/${lobbyId}`;
// }

export const createJoinGameUrl = (gameTableId: GameTableId) => {
  return `/games/${gameTableId}`;
}

export const createFriendUrl = (friendId: DbGameFriendId) => {
  console.log("createFriendUrl", friendId);
  return `/friends/${friendId}`;
}

export const createHostedGameUrl = (gameTableId: DbGameTableId) => {
  return `/hosted-games/${gameTableId}`;
}

export const createPlayerGameUrl = (gameTableId: DbGameTableId) => {
  return `/games/${gameTableId}`;
}
