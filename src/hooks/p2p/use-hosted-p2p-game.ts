import { PlayerProfileId } from "~/types/core/branded-values/bfg-branded-ids";
import { PublicPlayerProfile } from "~/models/public-player-profile";
import { useP2pGame, ConnectionEvent } from "./use-p2p-game";
import { GameTable } from "~/models/game-table/game-table";
import { BfgGameSpecificGameStateTypedJson } from "~/types/core/branded-values/bfg-game-state-typed-json";
import { AbfgSupportedGameTitle } from "~/types/bfg-game-engines/supported-games";
import { Room } from "trystero";
import { P2P_GAME_ACTIONS_ACTION_KEY, P2P_GAME_TABLE_ACTION_KEY } from "~/components/p2p/constants";
import { DbGameTableAction } from "~/models/game-table/game-table-action";


interface IHostedP2pGameData {
  room: Room
  connectionStatus: string
  connectionEvents: ConnectionEvent[]
  peerProfiles: Map<string, PublicPlayerProfile>
  playerProfiles: Map<PlayerProfileId, PublicPlayerProfile>

  sendGameTableData: (gameTable: GameTable) => void
  sendGameActionsData: (gameActions: DbGameTableAction[]) => void

  getPlayerMove: (callback: (move: BfgGameSpecificGameStateTypedJson<AbfgSupportedGameTitle>, peer: string) => void) => void
  
  refreshConnection: () => void
}

export const useHostedP2pGame = (
  gameTable: GameTable | null,
  hostPlayerProfile: PublicPlayerProfile | null,
): IHostedP2pGameData => {

  if (!gameTable) {
    throw new Error('Game table is required');
  }

  if (!hostPlayerProfile) {
    throw new Error('Host player profile is required');
  }

  const p2pGame = useP2pGame(gameTable.id, hostPlayerProfile);
  const { room } = p2pGame;

  const [sendGameTableData] = room.makeAction<GameTable>(P2P_GAME_TABLE_ACTION_KEY);
  const [sendGameActionsData] = room.makeAction<DbGameTableAction[]>(P2P_GAME_ACTIONS_ACTION_KEY);

  const retVal = {
    ...p2pGame,
    sendGameTableData,
    sendGameActionsData,
  } satisfies IHostedP2pGameData;
  
  return retVal;
}
