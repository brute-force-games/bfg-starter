import { PrivatePlayerProfile } from "~/models/private-player-profile";
import { GameTableId, PlayerProfileId } from "~/types/core/branded-values/bfg-branded-ids";
import { useP2pGame } from "./use-p2p-game";
import { BfgGameSpecificGameStateTypedJson } from "~/types/core/branded-values/bfg-game-state-typed-json";
import { AbfgSupportedGameTitle } from "~/types/bfg-game-engines/supported-games";
import { DbGameTableAction } from "~/models/game-table/game-table-action";
import { GameTable, GameTableSeat } from "~/models/game-table/game-table";
import { matchPlayerToSeat } from "~/data/game-table-ops/player-seat-utils";
import { PublicPlayerProfile } from "~/models/public-player-profile";


interface IPlayerP2pGame {
  gameTable: GameTable | null;
  gameActions: DbGameTableAction[];

  peerProfiles: Map<string, PublicPlayerProfile>
  playerProfiles: Map<PlayerProfileId, PublicPlayerProfile>

  myPlayerSeat: GameTableSeat | undefined;

  sendPlayerMove: (move: BfgGameSpecificGameStateTypedJson<AbfgSupportedGameTitle>) => void
  getPlayerMove: (callback: (move: BfgGameSpecificGameStateTypedJson<AbfgSupportedGameTitle>, peer: string) => void) => void
}


export const usePlayerP2pGame = (gameTableId: GameTableId, playerProfile: PrivatePlayerProfile): IPlayerP2pGame | null => {

  const p2pGame = useP2pGame(gameTableId, playerProfile);

  const { gameTable } = p2pGame;

  const myPlayerSeat = matchPlayerToSeat(playerProfile.id, gameTable);

  return {
    ...p2pGame,
    myPlayerSeat,
  };
}
