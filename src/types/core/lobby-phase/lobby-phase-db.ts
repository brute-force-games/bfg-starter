import { DbGameFriendId, DbGameLobbyId, DbPlayerProfileId } from "../branded-values/branded-strings";
import { AvailableGameTitleChoice } from "~/types/enums/game-shelf";
import { LobbyStatusEnum } from "./lobby-phase";


export type NewDbGameLobby = {
  status: LobbyStatusEnum,
  gameTitle: AvailableGameTitleChoice,
  lobbyMinNumPlayers: number,
  lobbyMaxNumPlayers: number,
  gameHostPlayerId: DbPlayerProfileId,

  description?: string,

  sharedWith?: DbGameFriendId[],
  createdAt: string;
  owner?: string;    
}


export type DbGameLobby = NewDbGameLobby & {
  id?: DbGameLobbyId;

  realmId?: string;
}
