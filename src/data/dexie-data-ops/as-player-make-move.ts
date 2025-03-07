import { z } from "zod";
import { BfgGameEngineMetadata, getGameEngineMetadataForGameTable } from "~/types/bfg-game-engines/bfg-game-engines";
import { bfgDb } from "../bfg-db";
import { DbGameTableId, DbPlayerProfileId } from "~/types/core/branded-values/branded-strings";
import { BfgGameTableActionId } from "~/types/core/branded-values/bfg-branded-ids";
import { DbGameTableAction } from "~/types/core/game-table/game-table-action";
import { DbGameTable } from "~/types/core/game-table/game-table";
import { getLatestAction } from "./order-game-table-actions";
import { getPlayerActionSource } from "./player-seat-utils";
import { BfgGameTypedJson } from "~/types/core/branded-values/bfg-game-typed-json";


export const asPlayerMakeMove = async (
  tableId: DbGameTableId, 
  playerId: DbPlayerProfileId, 
  playerAction: z.infer<typeof BfgGameEngineMetadata[keyof typeof BfgGameEngineMetadata]["gameActionJsonSchema"]>
) => {
  const gameTable = await bfgDb.gameTables.get(tableId);

  if (!gameTable) {
    throw new Error("Table not found");
  }

  const selectedGameProcessor = getGameEngineMetadataForGameTable(gameTable);

  // const selectedGameProcessor = gameEngineMetadata as BfgGameEngineProcessor<
  //   z.infer<typeof gameEngineMetadata["gameStateJsonSchema"]>,
  //   z.infer<typeof gameEngineMetadata["gameActionJsonSchema"]>,
  //   typeof gameTable.gameTitle
  // >;

  const playerActionSource = getPlayerActionSource(gameTable, playerId);  

  const latestAction = await getLatestAction(tableId);

  const initialGameState = selectedGameProcessor.parseGameStateJson(
    latestAction.actionOutcomeGameStateJson as BfgGameTypedJson<typeof gameTable.gameTitle>);

  const afterActionResult = selectedGameProcessor.applyGameAction(initialGameState, playerAction);
  const afterActionGameState = afterActionResult.gameState;

  const playerActionJson = selectedGameProcessor.createGameActionJson(playerAction);
  const actionOutcomeGameStateJson = selectedGameProcessor.createGameStateJson(afterActionGameState);

  const mostRecentGameActionId = gameTable.latestActionId;
  const startActionId = BfgGameTableActionId.createId();

  const hostStartsGameAction: DbGameTableAction = {
    id: startActionId,
    gameTableId: tableId,
    previousActionId: mostRecentGameActionId,
    createdAt: new Date(),

    source: playerActionSource,
    actionType: "game-table-action-player-move",
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
