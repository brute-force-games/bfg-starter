import { BfgGameEngineMetadata } from "~/types/game-engines/bfg-game-engines";
import { bfgDb } from "../bfg-db";
import { DbGameTableId, DbPlayerProfileId } from "~/types/core/branded-values/branded-strings";
import { BfgGameTableActionId } from "~/types/core/branded-values/bfg-branded-ids";
import { DbGameTableAction } from "~/types/core/game-table/game-table-action";
import { DbGameTable } from "~/types/core/game-table/game-table";


export const asPlayerMakeMove = async <T>(
  tableId: DbGameTableId, 
  playerId: DbPlayerProfileId, 
  playerAction: T
) => {
  console.log("DB: asPlayerMakeMove", tableId, playerId);
  const gameTable = await bfgDb.gameTables.get(tableId);

  if (!gameTable) {
    throw new Error("Table not found");
  }

  const gameEngineMetadata = BfgGameEngineMetadata[gameTable.gameTitle];

  if (!gameEngineMetadata) {
    throw new Error("Game state metadata not found");
  }

  const initGameAction = gameEngineMetadata.createInitialGameTableAction(gameTable);
  const initialGameState = gameEngineMetadata.createInitialGameState(gameTable);
  const gameStateJson = gameEngineMetadata.createGameStateJson(initialGameState);
  const nextPlayersToAct = gameEngineMetadata.createNextPlayersToAct(initGameAction, initialGameState);

  const mostRecentGameActionId = gameTable.latestActionId;
  const startActionId = BfgGameTableActionId.createId();

  const hostStartsGameAction: DbGameTableAction = {
    id: startActionId,
    gameTableId: tableId,
    previousActionId: mostRecentGameActionId,
    createdAt: new Date(),

    source: "game-table-action-source-host",
    actionType: "game-table-action-host-starts-game",
    nextPlayersToAct,
    actionJson: "start-game",
    actionOutcomeGameStateJson: gameStateJson,
  }

  await bfgDb.transaction(
    'rw',
    [bfgDb.gameTables, bfgDb.gameTableActions],
    async () => {

      const updatedGameTable: DbGameTable = {
        ...gameTable,
        tablePhase: "table-phase-game-in-progress",
        latestActionId: startActionId,
      }

      await bfgDb
        .gameTables
        .update(gameTable, updatedGameTable);

      await bfgDb.gameTableActions.add(hostStartsGameAction);
    }
  );
}
