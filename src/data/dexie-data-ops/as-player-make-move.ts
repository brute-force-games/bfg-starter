import { z } from "zod";
import { getBfgGameMetadata } from "~/types/bfg-game-engines/bfg-game-engines";
import { bfgDb } from "../bfg-db";
import { DbGameTableId, DbPlayerProfileId } from "~/types/core/branded-values/branded-strings";
import { BfgGameTableActionId } from "~/types/core/branded-values/bfg-branded-ids";
import { DbGameTableAction } from "~/types/core/game-table/game-table-action";
import { DbGameTable } from "~/types/core/game-table/game-table";
import { getLatestAction } from "./order-game-table-actions";
import { getPlayerActionSource } from "./player-seat-utils";
import { BfgGameSpecificGameStateTypedJson } from "~/types/core/branded-values/bfg-game-state-typed-json";
import { BfgGameEngineProcessor } from "~/types/bfg-game-engines/bfg-game-engines";


export const asPlayerMakeMove = async <GameSpecificAction extends z.ZodType>(
  tableId: DbGameTableId, 
  playerId: DbPlayerProfileId, 
  playerAction: z.infer<GameSpecificAction>
) => {
  const gameTable = await bfgDb.gameTables.get(tableId);

  if (!gameTable) {
    throw new Error("Table not found");
  }

  console.log("INCOMING PLAYER ACTION", playerAction);

  const selectedGameMetadata = getBfgGameMetadata(gameTable);
  const selectedGameEngine = selectedGameMetadata.processor as BfgGameEngineProcessor<
    // typeof gameTable.gameTitle,
    z.infer<typeof selectedGameMetadata.processor["gameStateJsonSchema"]>,
    z.infer<typeof selectedGameMetadata.processor["gameActionJsonSchema"]>
  >;
  
  const playerActionSource = getPlayerActionSource(gameTable, playerId);  

  const latestAction = await getLatestAction(tableId);

  const initialGameState = selectedGameEngine.parseGameSpecificGameStateJson(
    latestAction.actionOutcomeGameStateJson as BfgGameSpecificGameStateTypedJson<typeof gameTable.gameTitle>);

  const afterActionResult = selectedGameEngine.applyGameAction(gameTable, initialGameState, playerAction);

  // const gameSpecificAction = playerAction.gameSpecificAction;
  console.log("MAKE MOVE - PLAYER ACTION", playerAction);

  const playerActionJson = selectedGameEngine.createGameSpecificActionJson(playerAction);

  console.log("MAKE MOVE - playerActionJson", playerActionJson);

  const actionOutcomeGameState = afterActionResult.gameSpecificState;
  const actionOutcomeGameStateJson = selectedGameEngine.createGameSpecificGameStateJson(actionOutcomeGameState);
  console.log("MAKE MOVE - actionOutcomeGameStateJson", actionOutcomeGameStateJson);

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
