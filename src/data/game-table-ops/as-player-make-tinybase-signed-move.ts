// import { z } from "zod";
// import { getBfgGameMetadata } from "~/types/bfg-game-engines/bfg-game-engines";
// import { bfgDb } from "../bfg-db";
// import { DbGameTableId } from "~/types/core/branded-values/branded-strings";
// import { BfgGameTableActionId } from "~/types/core/branded-values/bfg-branded-ids";
// import { DbGameTable } from "~/models/game-table/game-table";
// import { getLatestAction } from "./order-game-table-actions";
// import { getPlayerActionSource } from "./player-seat-utils";
// import { BfgGameSpecificGameStateTypedJson } from "~/types/core/branded-values/bfg-game-state-typed-json";
// import { BfgGameEngineProcessor } from "~/types/bfg-game-engines/bfg-game-engines";
// import { createSignedGameAction } from "~/models/game-table/signed-game-action";
// import { playerProfileStore } from "~/store/player-profile-store";

// /**
//  * Make a signed move as a player using TinyBase profile data
//  * This function gets the private key from the TinyBase store
//  */
// export const asPlayerMakeTinyBaseSignedMove = async <GameSpecificAction extends z.ZodTypeAny>(
//   tableId: DbGameTableId, 
//   playerProfileId: string,
//   playerAction: z.infer<GameSpecificAction>
// ) => {
//   const gameTable = await bfgDb.gameTables.get(tableId);

//   if (!gameTable) {
//     throw new Error("Table not found");
//   }

//   // Get player profile from TinyBase store
//   const profileData = playerProfileStore.getRow('playerProfiles', playerProfileId);
//   if (!profileData) {
//     throw new Error("Player profile not found in TinyBase store");
//   }

//   console.log("INCOMING TINYBASE SIGNED PLAYER ACTION", playerAction);

//   const selectedGameMetadata = getBfgGameMetadata(gameTable);
//   const selectedGameEngine = selectedGameMetadata.processor as BfgGameEngineProcessor<
//     z.infer<typeof selectedGameMetadata.processor["gameStateJsonSchema"]>,
//     z.infer<typeof selectedGameMetadata.processor["gameActionJsonSchema"]>
//   >;

//   const playerActionSource = getPlayerActionSource(gameTable, playerProfileId);  

//   const latestAction = await getLatestAction(tableId);

//   const initialGameState = selectedGameEngine.parseGameSpecificGameStateJson(
//     latestAction.actionOutcomeGameStateJson as BfgGameSpecificGameStateTypedJson<typeof gameTable.gameTitle>);

//   console.log("MAKE TINYBASE SIGNED MOVE - INITIAL GAME STATE", initialGameState);

//   const afterActionResult = selectedGameEngine.applyGameAction(gameTable, initialGameState, playerAction);

//   const gameStateSummary = afterActionResult.gameSpecificStateSummary;

//   console.log("MAKE TINYBASE SIGNED MOVE - PLAYER ACTION", playerAction);
//   console.log("MAKE TINYBASE SIGNED MOVE - AFTER ACTION RESULT", afterActionResult);

//   const playerActionJson = selectedGameEngine.createGameSpecificActionJson(playerAction);

//   console.log("MAKE TINYBASE SIGNED MOVE - playerActionJson", playerActionJson);

//   const actionOutcomeGameState = afterActionResult.gameSpecificState;
//   const actionOutcomeGameStateJson = selectedGameEngine.createGameSpecificGameStateJson(actionOutcomeGameState);
//   console.log("MAKE TINYBASE SIGNED MOVE - actionOutcomeGameStateJson", actionOutcomeGameStateJson);

//   const mostRecentGameActionId = gameTable.latestActionId;
//   const startActionId = BfgGameTableActionId.createId();

//   // Create the base game action
//   const baseGameAction = {
//     id: startActionId,
//     gameTableId: tableId,
//     previousActionId: mostRecentGameActionId,
//     createdAt: new Date(),

//     source: playerActionSource,
//     actionType: "game-table-action-player-move" as const,
//     actionJson: playerActionJson,
//     actionOutcomeGameStateJson,

//     realmId: gameTable.realmId,
//   };

//   // Create signed version of the action using private key from TinyBase
//   const signedGameAction = await createSignedGameAction(
//     baseGameAction,
//     profileData.privateKey,
//     playerProfileId
//   );

//   console.log("MAKE TINYBASE SIGNED MOVE - signedGameAction", signedGameAction);

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

//       // Store the signed action (for now, we'll store it as a regular action but with signature data)
//       // TODO: Update the database schema to support signed actions
//       await bfgDb.gameTableActions.add({
//         ...signedGameAction,
//         // Store signature data in a custom field for now
//         actionJson: JSON.stringify({
//           originalAction: playerActionJson,
//           signature: signedGameAction.signature,
//           playerId: signedGameAction.playerId,
//           playerHandle: profileData.handle,
//           publicKey: profileData.publicKey,
//         }),
//       });
//     }
//   );
// }

// /**
//  * Verify a signed move before processing it (using TinyBase profile data)
//  */
// export const verifyTinyBaseSignedMove = async (signedAction: any): Promise<boolean> => {
//   try {
//     const { verifySignedMove: verifyCrypto } = await import('~/crypto/crypto-utils');
    
//     if (!signedAction.signature) {
//       console.error('Move missing signature');
//       return false;
//     }
    
//     // If we have the player ID, we can get the public key from TinyBase for verification
//     if (signedAction.playerId) {
//       const profileData = playerProfileStore.getRow('playerProfiles', signedAction.playerId);
//       if (profileData) {
//         // Use the public key from TinyBase for verification
//         return await verifyCrypto(signedAction.signature);
//       }
//     }
    
//     // Fallback to the signature's embedded public key
//     return await verifyCrypto(signedAction.signature);
//   } catch (error) {
//     console.error('Error verifying TinyBase signed move:', error);
//     return false;
//   }
// };
