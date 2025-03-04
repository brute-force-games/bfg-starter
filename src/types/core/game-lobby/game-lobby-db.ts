import { BfgPlayerId } from "../branded-values/bs-player-id";
import { DbGameLobbyId } from "../branded-values/branded-strings";
import { AvailableGameTitleChoice } from "~/types/enums/game-shelf";
import { GameLobbyStatusEnum } from "./game-lobby";


export type NewDbGameLobby = {
  status: GameLobbyStatusEnum,
  gameTitle: AvailableGameTitleChoice,
  lobbyMinNumPlayers: number,
  lobbyMaxNumPlayers: number,
  gameHostPlayerId: BfgPlayerId,
}


export type DbGameLobby = NewDbGameLobby & {
  id?: DbGameLobbyId;
}
