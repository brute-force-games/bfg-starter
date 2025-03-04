import { DbGameFriendId, DbGameLobbyId } from "./types/core/branded-values/branded-strings";


export const createLobbyUrl = (lobbyId: DbGameLobbyId) => {
  return `/lobbies/${lobbyId}`;
}

export const createFriendUrl = (friendId: DbGameFriendId) => {
  console.log("createFriendUrl", friendId);
  return `/friends/${friendId}`;
}
