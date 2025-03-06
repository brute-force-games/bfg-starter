import { BfgGameEngineMetadata } from "~/types/game-engines/bfg-game-engines";
import { bfgDb } from "../bfg-db";
import { DbGameTableId, DbPlayerProfileId } from "~/types/core/branded-values/branded-strings";
import { BfgGameTableActionId } from "~/types/core/branded-values/bfg-branded-ids";
import { DbGameTableAction } from "~/types/core/game-table/game-table-action";
import { DbGameTable } from "~/types/core/game-table/game-table";
import { BrandedJson } from "~/types/core/branded-values/bfg-branded-json";
import { getLatestAction } from "./order-game-table-actions";
import { z } from "zod";


export const asPlayerMakeMove = async <T extends z.infer<typeof gameEngineMetadata.gameActionJsonSchema>>(
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

  const latestAction = await getLatestAction(tableId);

  const initialGameState = gameEngineMetadata.parseGameStateJson(
    latestAction.actionOutcomeGameStateJson as BrandedJson<typeof gameTable.gameTitle>);

  const afterActionGameState = gameEngineMetadata.applyGameAction(initialGameState, playerAction);

  const nextPlayersToAct = gameEngineMetadata.createNextPlayersToAct(playerAction, afterActionGameState);

  const actionOutcomeGameStateJson = gameEngineMetadata.createGameStateJson(afterActionGameState, playerAction);

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
    actionOutcomeGameStateJson,
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
