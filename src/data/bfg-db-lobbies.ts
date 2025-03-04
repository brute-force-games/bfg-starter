import { useLiveQuery } from "dexie-react-hooks"
import { bfgDb } from "./bfg-db";
import { DbGameLobbyId } from "~/types/core/branded-values/branded-strings";
import { DbGameLobby, NewDbGameLobby } from "~/types/core/game-lobby/game-lobby-db";



export const useLiveLobbies = (): DbGameLobby[] | undefined => {
  const lobbies = useLiveQuery(async () => {
    return await bfgDb.myGameLobbies.toArray();
  })
  return lobbies;
}


export const useLiveLobby = (lobbyId: DbGameLobbyId): DbGameLobby | undefined => {
  const lobby = useLiveQuery(async () => {
    return await bfgDb.myGameLobbies.get(lobbyId);
  })
  return lobby;
}


export const addNewLobby = async (lobby: NewDbGameLobby) => {
  console.log("DB: addNewLobby", bfgDb);
  console.log("DB: myLobbies", bfgDb.myGameLobbies);
  const added = await bfgDb.myGameLobbies.add(lobby);

  console.log("DB: added", added);
}
