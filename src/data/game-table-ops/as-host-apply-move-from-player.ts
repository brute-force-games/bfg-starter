import { z } from "zod";
import { getBfgGameMetadata } from "~/types/bfg-game-engines/bfg-game-engines";
import { PlayerProfileId } from "~/types/core/branded-values/bfg-branded-ids";
import { DbGameTableAction } from "~/models/game-table/game-table-action";
import { getPlayerActionSource } from "./player-seat-utils";
import { BfgGameSpecificGameStateTypedJson } from "~/types/core/branded-values/bfg-game-state-typed-json";
import { BfgGameEngineProcessor } from "~/types/bfg-game-engines/bfg-game-engines";
import { GameTable } from "~/models/game-table/game-table";
import { TablePhase } from "~/models/game-table/table-phase";


export type HostApplyMoveFromPlayerResult = {
  resultTablePhase: TablePhase;
  gameTable: GameTable;
  gameAction: DbGameTableAction;
}

export const asHostApplyMoveFromPlayer = async <GameSpecificAction extends z.ZodTypeAny>(
  gameTable: GameTable,
  gameActions: DbGameTableAction[],
  playerId: PlayerProfileId, 
  playerAction: z.infer<GameSpecificAction>
): Promise<HostApplyMoveFromPlayerResult> => {
  
  if (!gameTable) {
    throw new Error("Table not found");
  }

  console.log("INCOMING PLAYER ACTION", playerAction);

  const selectedGameMetadata = getBfgGameMetadata(gameTable);
  const selectedGameEngine = selectedGameMetadata.processor as BfgGameEngineProcessor<
    z.infer<typeof selectedGameMetadata.processor["gameStateJsonSchema"]>,
    z.infer<typeof selectedGameMetadata.processor["gameActionJsonSchema"]>
  >;

  const playerActionSource = getPlayerActionSource(gameTable, playerId);  

  const latestAction = gameActions[gameActions.length - 1];

  const initialGameState = selectedGameEngine.parseGameSpecificGameStateJson(
    latestAction.actionOutcomeGameStateJson as BfgGameSpecificGameStateTypedJson<typeof gameTable.gameTitle>);

  console.log("MAKE MOVE - INITIAL GAME STATE", initialGameState);

  const afterActionResult = selectedGameEngine.applyGameAction(gameTable, initialGameState, playerAction);

  const { tablePhase, gameSpecificStateSummary } = afterActionResult;

  console.log("MAKE MOVE - PLAYER ACTION", playerAction);
  console.log("MAKE MOVE - AFTER ACTION RESULT", afterActionResult);

  const playerActionJson = selectedGameEngine.createGameSpecificActionJson(playerAction);

  console.log("MAKE MOVE - playerActionJson", playerActionJson);

  const actionOutcomeGameState = afterActionResult.gameSpecificState;
  const actionOutcomeGameStateJson = selectedGameEngine.createGameSpecificGameStateJson(actionOutcomeGameState);
  console.log("MAKE MOVE - actionOutcomeGameStateJson", actionOutcomeGameStateJson);

  const now = Date.now();

  const nextGameTable: GameTable = {
    ...gameTable,
    tablePhase,
    currentStatusDescription: gameSpecificStateSummary,
  }

  const playerMoveAction: DbGameTableAction = {
    gameTableId: gameTable.id,
    createdAt: now,
    source: playerActionSource,
    actionType: "game-table-action-player-move",
    actionJson: playerActionJson,
    actionOutcomeGameStateJson,
  }

  const retVal: HostApplyMoveFromPlayerResult = {
    resultTablePhase: tablePhase,
    gameTable: nextGameTable,
    gameAction: playerMoveAction,
  } satisfies HostApplyMoveFromPlayerResult;

  return retVal;

  // return actionOutcomeGameState;

  // const playerMoveAction: DbGameTableAction = {
  //   gameTableId: gameTable.id,
  //   createdAt: now,

  //   source: playerActionSource,
  //   actionType: "game-table-action-player-move",
  //   actionJson: playerActionJson,
  //   actionOutcomeGameStateJson,
  // }

  // const tablePhase = afterActionResult.tablePhase;

  // await bfgDb.transaction(
  //   'rw',
  //   [bfgDb.gameTables, bfgDb.gameTableActions],
  //   async () => {
  //     const updatedGameTable: DbGameTable = {
  //       ...gameTable,
  //       tablePhase,
  //       latestActionId: startActionId,
  //       currentStatusDescription: gameStateSummary,
  //     }

  //     await bfgDb
  //       .gameTables
  //       .update(gameTable, updatedGameTable);

  //     await bfgDb.gameTableActions.add(playerMoveAction);
  //   }
  // );
}
