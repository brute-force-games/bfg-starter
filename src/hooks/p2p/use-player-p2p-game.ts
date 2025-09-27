import { TablePhase } from "~/models/game-table/table-phase";
import { PrivatePlayerProfile } from "~/models/private-player-profile";
import { GameTableId, PlayerProfileId } from "~/types/core/branded-values/bfg-branded-ids";


interface IPlayerP2pGame {
  id: GameTableId;
  gameTitle: string;
  gameHostPlayerProfileId: PlayerProfileId;
  tablePhase: TablePhase;
  currentStatusDescription: string;
}


export const usePlayerP2pGame = (gameTableId: GameTableId, playerProfile: PrivatePlayerProfile): IPlayerP2pGame | null => {

  return null;
}
