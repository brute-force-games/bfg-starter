import { z } from "zod";
import { BfgGameEngineMetadata } from "~/types/game-engines/bfg-game-engines";
import { bfgDb } from "../bfg-db";
import { DbGameTableId, DbPlayerProfileId } from "~/types/core/branded-values/branded-strings";
import { BfgGameTableActionId } from "~/types/core/branded-values/bfg-branded-ids";
import { DbGameTableAction } from "~/types/core/game-table/game-table-action";
import { DbGameTable } from "~/types/core/game-table/game-table";
import { BrandedJson } from "~/types/core/branded-values/bfg-branded-json";
import { getLatestAction } from "./order-game-table-actions";
import { getPlayerActionSource } from "./player-seat-utils";


export const asPlayerMakeMove = async <T extends z.infer<typeof gameEngineMetadata.gameActionJsonSchema>>(
  tableId: DbGameTableId, 
  playerId: DbPlayerProfileId, 
  playerAction: T
) => {
  
  const gameTable = await bfgDb.gameTables.get(tableId);

  if (!gameTable) {
    throw new Error("Table not found");
  }

  const gameEngineMetadata = BfgGameEngineMetadata[gameTable.gameTitle];

  if (!gameEngineMetadata) {
    throw new Error(`Game state metadata not found: ${gameTable.gameTitle}`);
  }


  const playerActionSource = getPlayerActionSource(gameTable, playerId);  

  const latestAction = await getLatestAction(tableId);

  const initialGameState = gameEngineMetadata.parseGameStateJson(
    latestAction.actionOutcomeGameStateJson as BrandedJson<typeof gameTable.gameTitle>);

  const afterActionResult = gameEngineMetadata.applyGameAction(initialGameState, playerAction);
  const afterActionGameState = afterActionResult.gameState;

  const playerActionJson = gameEngineMetadata.createGameActionJson(playerAction);
  const actionOutcomeGameStateJson = gameEngineMetadata.createGameStateJson(afterActionGameState);

  const mostRecentGameActionId = gameTable.latestActionId;
  const startActionId = BfgGameTableActionId.createId();


  // if (afterActionResult.tablePhase !== 'table-phase-game-in-progress') {
  //   throw new Error("Game is not in progress");
  // }

  const hostStartsGameAction: DbGameTableAction = {
    id: startActionId,
    gameTableId: tableId,
    previousActionId: mostRecentGameActionId,
    createdAt: new Date(),

    source: playerActionSource,
    actionType: "game-table-action-player-move",
    // nextPlayersToAct,
    actionJson: playerActionJson,
    actionOutcomeGameStateJson,

    realmId: gameTable.realmId,
  }

  const tablePhase = afterActionResult.tablePhase;

  await bfgDb.transaction(
    'rw',
    [bfgDb.gameTables, bfgDb.gameTableActions],
    async () => {

      const updatedGameTable: DbGameTable = {
        ...gameTable,
        tablePhase,
        latestActionId: startActionId,
      }

      await bfgDb
        .gameTables
        .update(gameTable, updatedGameTable);

      await bfgDb.gameTableActions.add(hostStartsGameAction);
    }
  );
}
