import { z } from "zod";
import { getBfgGameMetadata } from "~/types/bfg-game-engines/bfg-game-engines";
import { bfgDb } from "../bfg-db";
import { DbGameTableId, DbPlayerProfileId } from "~/types/core/branded-values/branded-strings";
import { BfgGameTableActionId } from "~/types/core/branded-values/bfg-branded-ids";
import { DbGameTableAction } from "~/types/core/game-table/game-table-action";
import { DbGameTable } from "~/types/core/game-table/game-table";
import { getLatestAction } from "./order-game-table-actions";
import { getPlayerActionSource } from "./player-seat-utils";
import { BfgGameEngineProcessor } from "~/types/bfg-game-engines/bfg-game-engines";
import { BfgGameSpecificGameStateJsonString } from "~/types/core/branded-values/bfg-game-state-typed-json";


export const asPlayerMakeMove = async <GameSpecificAction extends z.ZodTypeAny>(
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

  // const selectedGameEngine = selectedGameMetadata.processor;

  const playerActionSource = getPlayerActionSource(gameTable, playerId);  

  const latestAction = await getLatestAction(tableId);

  const latestGameStateSpecificJson: BfgGameSpecificGameStateJsonString = {
    bfgGameTitle: gameTable.gameTitle,
    bfgGameDataJsonType: 'game-state',
    jsonString: latestAction.actionOutcomeGameStateJson,
  } as BfgGameSpecificGameStateJsonString;

  // const latestGameActionSpecificJson: BfgGameSpecificActionJsonString = {
  //   bfgGameTitle: gameTable.gameTitle,
  //   bfgGameDataJsonType: 'game-action',
  //   jsonString: latestAction.actionJson,
  // } as BfgGameSpecificActionJsonString;
  

  const initialGameState = selectedGameEngine.parseGameSpecificGameStateJson(latestGameStateSpecificJson);

  console.log("MAKE MOVE - INITIAL GAME STATE", initialGameState);

  const afterActionResult = selectedGameEngine.applyGameAction(gameTable, initialGameState, playerAction);

  const gameStateSummary = afterActionResult.gameSpecificStateSummary;

  // const gameSpecificAction = playerAction.gameSpecificAction;
  console.log("MAKE MOVE - PLAYER ACTION", playerAction);
  console.log("MAKE MOVE - AFTER ACTION RESULT", afterActionResult);

  const playerActionJson = selectedGameEngine.createGameSpecificActionJson(playerAction);

  console.log("MAKE MOVE - playerActionJson", playerActionJson);

  const actionOutcomeGameState = afterActionResult.gameSpecificState;
  const actionOutcomeGameStateJson = selectedGameEngine.createGameSpecificGameStateJson(actionOutcomeGameState);
  console.log("MAKE MOVE - actionOutcomeGameStateJson", actionOutcomeGameStateJson);

  const mostRecentGameActionId = gameTable.latestActionId;
  const startActionId = BfgGameTableActionId.createId();

  const playerMoveAction: DbGameTableAction = {
    id: startActionId,
    gameTableId: tableId,
    previousActionId: mostRecentGameActionId,
    createdAt: new Date(),

    source: playerActionSource,
    actionType: "game-table-action-player-move",
    actionJson: playerActionJson.jsonString,
    actionOutcomeGameStateJson: actionOutcomeGameStateJson.jsonString,

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
        currentStatusDescription: gameStateSummary,
      }

      await bfgDb
        .gameTables
        .update(gameTable, updatedGameTable);

      await bfgDb.gameTableActions.add(playerMoveAction);
    }
  );
}
