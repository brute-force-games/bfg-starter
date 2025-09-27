// import { z } from "zod";
// import { getBfgGameMetadata } from "~/types/bfg-game-engines/bfg-game-engines";
// import { BfgGameTableActionId, GameTableId, PlayerProfileId } from "~/types/core/branded-values/bfg-branded-ids";
// import { DbGameTableAction } from "~/models/game-table/game-table-action";
// import { getPlayerActionSource } from "./player-seat-utils";
// import { BfgGameSpecificGameStateTypedJson } from "~/types/core/branded-values/bfg-game-state-typed-json";
// import { BfgGameEngineProcessor } from "~/types/bfg-game-engines/bfg-game-engines";


// export const asPlayerMakeMove = async <GameSpecificAction extends z.ZodTypeAny>(
//   tableId: GameTableId, 
//   playerId: PlayerProfileId, 
//   playerAction: z.infer<GameSpecificAction>
// ) => {
//   const gameTable = await bfgDb.gameTables.get(tableId);

//   if (!gameTable) {
//     throw new Error("Table not found");
//   }

//   console.log("INCOMING PLAYER ACTION", playerAction);

//   const selectedGameMetadata = getBfgGameMetadata(gameTable);
//   const selectedGameEngine = selectedGameMetadata.processor as BfgGameEngineProcessor<
//     z.infer<typeof selectedGameMetadata.processor["gameStateJsonSchema"]>,
//     z.infer<typeof selectedGameMetadata.processor["gameActionJsonSchema"]>
//   >;

//   // const selectedGameEngine = selectedGameMetadata.processor;

//   const playerActionSource = getPlayerActionSource(gameTable, playerId);  

//   const latestAction = await getLatestAction(tableId);

//   const initialGameState = selectedGameEngine.parseGameSpecificGameStateJson(
//     latestAction.actionOutcomeGameStateJson as BfgGameSpecificGameStateTypedJson<typeof gameTable.gameTitle>);

//   console.log("MAKE MOVE - INITIAL GAME STATE", initialGameState);

//   const afterActionResult = selectedGameEngine.applyGameAction(gameTable, initialGameState, playerAction);

//   const gameStateSummary = afterActionResult.gameSpecificStateSummary;

//   // const gameSpecificAction = playerAction.gameSpecificAction;
//   console.log("MAKE MOVE - PLAYER ACTION", playerAction);
//   console.log("MAKE MOVE - AFTER ACTION RESULT", afterActionResult);

//   const playerActionJson = selectedGameEngine.createGameSpecificActionJson(playerAction);

//   console.log("MAKE MOVE - playerActionJson", playerActionJson);

//   const actionOutcomeGameState = afterActionResult.gameSpecificState;
//   const actionOutcomeGameStateJson = selectedGameEngine.createGameSpecificGameStateJson(actionOutcomeGameState);
//   console.log("MAKE MOVE - actionOutcomeGameStateJson", actionOutcomeGameStateJson);

//   const mostRecentGameActionId = gameTable.latestActionId;
//   const startActionId = BfgGameTableActionId.createId();

//   const playerMoveAction: DbGameTableAction = {
//     id: startActionId,
//     gameTableId: tableId,
//     previousActionId: mostRecentGameActionId,
//     createdAt: new Date(),

//     source: playerActionSource,
//     actionType: "game-table-action-player-move",
//     actionJson: playerActionJson,
//     actionOutcomeGameStateJson,

//     realmId: gameTable.realmId,
//   }

//   const tablePhase = afterActionResult.tablePhase;

//   await bfgDb.transaction(
//     'rw',
//     [bfgDb.gameTables, bfgDb.gameTableActions],
//     async () => {
//       const updatedGameTable: DbGameTable = {
//         ...gameTable,
//         tablePhase,
//         latestActionId: startActionId,
//         currentStatusDescription: gameStateSummary,
//       }

//       await bfgDb
//         .gameTables
//         .update(gameTable, updatedGameTable);

//       await bfgDb.gameTableActions.add(playerMoveAction);
//     }
//   );
// }
