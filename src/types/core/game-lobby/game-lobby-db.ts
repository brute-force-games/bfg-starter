import { BfgPlayerId } from "../branded-values/bs-player-id";
import { DbGameFriendId, DbGameLobbyId } from "../branded-values/branded-strings";
import { AvailableGameTitleChoice } from "~/types/enums/game-shelf";
import { GameLobbyStatusEnum } from "./game-lobby";


export type NewDbGameLobby = {
  status: GameLobbyStatusEnum,
  gameTitle: AvailableGameTitleChoice,
  lobbyMinNumPlayers: number,
  lobbyMaxNumPlayers: number,
  gameHostPlayerId: BfgPlayerId,

  description?: string,


  sharedWith?: DbGameFriendId[],

  realmId?: string,
  createdAt: string,
  owner?: string,
}



export type DbGameLobby = NewDbGameLobby & {
  id?: DbGameLobbyId;
}
