import { BfgGameEngineMetadata } from "~/types/game-engines/bfg-game-engines";
import { bfgDb } from "../bfg-db";
import { DbGameTableId, DbPlayerProfileId } from "~/types/core/branded-values/branded-strings";
import { BfgGameTableActionId } from "~/types/core/branded-values/bfg-branded-ids";
import { DbGameTableAction } from "~/types/core/game-table/game-table-action";
import { DbGameTable } from "~/types/core/game-table/game-table";


export const asHostStartGame = async (tableId: DbGameTableId, hostPlayerId: DbPlayerProfileId) => {
  console.log("DB: asHostStartGame", tableId);
  const gameTable = await bfgDb.gameTables.get(tableId);

  if (!gameTable) {
    throw new Error("Table not found");
  }

  if (gameTable.gameHostPlayerId !== hostPlayerId) {
    throw new Error("Player is not the host");
  }

  const selectedGameStateMetadata = BfgGameEngineMetadata[gameTable.gameTitle];

  if (!selectedGameStateMetadata) {
    throw new Error("Game state metadata not found");
  }

  const initGameAction = selectedGameStateMetadata.createInitialGameTableAction(gameTable);
  const initialGameState = selectedGameStateMetadata.createInitialGameState(gameTable);
  const gameStateJson = selectedGameStateMetadata.createGameStateJson(initialGameState);
  const nextPlayersToAct = selectedGameStateMetadata.createNextPlayersToAct(initGameAction, initialGameState);

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
        // gameStateJson,
      }

      await bfgDb
        .gameTables
        .update(gameTable, updatedGameTable);

      await bfgDb.gameTableActions.add(hostStartsGameAction);
    }
  );
}
