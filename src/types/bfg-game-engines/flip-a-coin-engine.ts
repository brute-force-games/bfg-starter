// import { z } from "zod";
// import { createBfgGameEngineProcessor, IBfgGameEngineProcessor } from "./bfg-game-engine-metadata";
// import { NewGameTable, PLAYER_SEATS } from "../core/game-table/game-table";
// import { GameTableActionResult } from "../core/game-table/table-phase";
// import { createFlipACoinInput, createFlipACoinRepresentation } from "~/game-engine-components/flip-a-coin/flip-a-coin-components";
// import { FlipACoinGameName } from "./supported-games";
// import { GameTableSeatSchema } from "../core/game-table/game-table";


// export const FlipACoinResolutionSchema = z.enum([
//   'game-in-progress',
//   'game-over-heads-wins',
//   'game-over-tails-wins',
// ])

// export type FlipACoinResolution = z.infer<typeof FlipACoinResolutionSchema>;


// export const FlipACoinResultSchema = z.enum([
//   'heads',
//   'tails',
// ])

// export type FlipACoinResult = z.infer<typeof FlipACoinResultSchema>;


// export const FlipACoinPlayerFlipResultPreferenceSchema = z.enum([
//   'heads',
//   'tails',
//   'no-preference',
// ])

// export type FlipACoinPlayerFlipResultPreference = z.infer<typeof FlipACoinPlayerFlipResultPreferenceSchema>;


// export const CoinChoiceSchema = z.enum([
//   'penny',
//   'nickel',
//   'dime',
//   'quarter',
// ])

// export type CoinChoice = z.infer<typeof CoinChoiceSchema>;


// export const FLIP_A_COIN_GAME_TABLE_ACTION_START_GAME = 'game-table-action-host-start-game' as const;
// export const FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_CHOOSE_COIN = 'game-table-action-player-choose-coin' as const;
// export const FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_FLIP_COIN = 'game-table-action-player-flip-coin' as const;
// export const FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_PREFER_FLIP_RESULT = 'game-table-action-player-prefer-flip-result' as const;
// export const FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_CALL_IT_AND_FINISH_GAME = 'game-table-action-player-call-it-and-finish-game' as const;
// export const FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_CANCEL_GAME = 'game-table-action-player-cancel-game' as const;


// export const FlipACoinStartGameSchema = z.object({
//   actionType: z.literal(FLIP_A_COIN_GAME_TABLE_ACTION_START_GAME),
// })

// export type FlipACoinStartGame = z.infer<typeof FlipACoinStartGameSchema>;


// export const FlipACoinActionChooseCoinSchema = z.object({
//   actionType: z.literal(FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_CHOOSE_COIN),
//   seat: GameTableSeatSchema,
//   chosenCoin: CoinChoiceSchema,
// })

// export const FlipACoinActionFlipCoinSchema = z.object({
//   actionType: z.literal(FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_FLIP_COIN),
//   seat: GameTableSeatSchema,
//   flipResult: FlipACoinResultSchema,
// })

// export const FlipACoinActionPreferOutcomeSchema = z.object({
//   actionType: z.literal(FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_PREFER_FLIP_RESULT),
//   seat: GameTableSeatSchema,
//   preferredFlipResult: FlipACoinPlayerFlipResultPreferenceSchema,
// })

// export const FlipACoinActionCallItAndFinishGameSchema = z.object({
//   actionType: z.literal(FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_CALL_IT_AND_FINISH_GAME),
//   seat: GameTableSeatSchema,
//   calledFlipResult: FlipACoinResultSchema,
// })

// export const FlipACoinActionCancelGameSchema = z.object({
//   actionType: z.literal(FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_CANCEL_GAME),
//   seat: GameTableSeatSchema,
//   cancellationReason: z.string(),
// })

// export const FlipACoinGameActionSchema = z.discriminatedUnion('actionType', [
//   FlipACoinStartGameSchema,
//   FlipACoinActionChooseCoinSchema, 
//   FlipACoinActionFlipCoinSchema,
//   FlipACoinActionPreferOutcomeSchema,
//   FlipACoinActionCallItAndFinishGameSchema,
//   FlipACoinActionCancelGameSchema,
// ])

// export type FlipACoinGameAction = z.infer<typeof FlipACoinGameActionSchema>;


// export const FlipACoinGameStateSchema = z.object({
//   chosenCoin: CoinChoiceSchema,
  
//   isGameOver: z.boolean(),
//   finalFlipResult: FlipACoinResultSchema.optional(),
//   outcomeSummary: z.string().optional(),

//   isFlipped: z.boolean(),
//   flipResult: FlipACoinResultSchema.optional(),  
  
//   playerFlipResultPreferences: z.record(GameTableSeatSchema, FlipACoinPlayerFlipResultPreferenceSchema)
//     .optional()
//     .default({
//       'p1': 'no-preference',
//       'p2': 'no-preference',
//       'p3': 'no-preference',
//       'p4': 'no-preference',
//       'p5': 'no-preference',
//       'p6': 'no-preference',
//       'p7': 'no-preference',
//       'p8': 'no-preference',
//     }),
// }).describe('Flip A Coin');

// export type FlipACoinGameState = z.infer<typeof FlipACoinGameStateSchema>;

// // export const FlipACoinGameName = 'Flip A Coin' as const;


// const createInitialGameState = (
//   initialGameTableAction: FlipACoinGameAction,
// ): FlipACoinGameState => {

//   if (initialGameTableAction.actionType !== 'game-table-action-host-start-game') {
//     throw new Error("Initial game table action must be a host start game");
//   }

//   return {
//     chosenCoin: 'penny',
//     isFlipped: false,
//     isGameOver: false,
//     flipResult: undefined,
//     playerFlipResultPreferences: {
//       'p1': 'no-preference',
//       'p2': 'no-preference',
//       'p3': 'no-preference',
//       'p4': 'no-preference',
//       'p5': 'no-preference',
//       'p6': 'no-preference',
//       'p7': 'no-preference',
//       'p8': 'no-preference',
//     },
//   };
// }


// const createInitialGameTableAction = (
//   _gameTable: NewGameTable,
// ): FlipACoinGameAction => {
//   return {
//     actionType: FLIP_A_COIN_GAME_TABLE_ACTION_START_GAME,
//   };
// }


// const applyGameAction = (
//   gameState: FlipACoinGameState,
//   gameAction: FlipACoinGameAction,
// ): GameTableActionResult<FlipACoinGameState> => {

//   if (gameAction.actionType === FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_CHOOSE_COIN) {

//     const summary = `Player ${gameAction.seat} chose ${gameAction.chosenCoin}`;

//     return {
//       tablePhase: 'table-phase-game-in-progress',
//       gameState: {
//         ...gameState,
//         chosenCoin: gameAction.chosenCoin,
//         outcomeSummary: summary,
//       },
//       description: summary,
//     }
//   } 

//   if (gameAction.actionType === FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_PREFER_FLIP_RESULT) {
//     const summary = `Player ${gameAction.seat} prefers ${gameAction.preferredFlipResult}`;

//     return {
//       tablePhase: 'table-phase-game-in-progress',
//       gameState: {
//         ...gameState,
//         playerFlipResultPreferences: { 
//           ...gameState.playerFlipResultPreferences,
//           [gameAction.seat]: gameAction.preferredFlipResult,
//         },
//         outcomeSummary: summary,
//       },
//       description: summary,
//     }
//   }
  
//   if (gameAction.actionType === FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_FLIP_COIN) {
//     const summary = `Player ${gameAction.seat} flipped the ${gameState.chosenCoin} and got ${gameAction.flipResult}`;

//     return {
//       tablePhase: 'table-phase-game-in-progress',
//       gameState: {
//         ...gameState,
//         isFlipped: true,
//         flipResult: gameAction.flipResult,
//         outcomeSummary: summary,
//       },
//       description: summary,
//     }
//   }

//   if (gameAction.actionType === FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_CALL_IT_AND_FINISH_GAME) {
//     const summary = `Player ${gameAction.seat} called it for ${gameState.flipResult}`;

//     if (!gameState.isFlipped) {
//       return {
//         tablePhase: 'table-phase-error',
//         gameState: {
//           ...gameState,
//           isGameOver: true,
//           outcomeSummary: summary,
//         },
//         description: summary,
//       }
//     }

//     const winningPlayers = PLAYER_SEATS.filter(seat => {
//       const playerFlipResultPreference = gameState.playerFlipResultPreferences[seat];
//       return playerFlipResultPreference === gameState.flipResult;
//     });

//     const anyWinners = winningPlayers.length > 0;

//     if (anyWinners) {
//       const summary = `Player ${gameAction.seat} called it for ${gameState.flipResult} - ${winningPlayers.join(', ')} win`;

//       return {
//         tablePhase: 'table-phase-game-complete-with-winners',
//         gameState: {
//           ...gameState,
//           isGameOver: true,
//           finalFlipResult: gameState.flipResult,
//           outcomeSummary: summary,
//         },
//         description: summary,
//       }
//     }

//     const drawSummary = `Player ${gameAction.seat} called it for ${gameState.flipResult} - no winners`;

//     return {
//       tablePhase: 'table-phase-game-complete-with-draw',
//       gameState: {
//         ...gameState,
//         isGameOver: true,
//         finalFlipResult: gameState.flipResult,
//         outcomeSummary: drawSummary,
//       },
//       description: drawSummary,
//     }
//   }

//   if (gameAction.actionType === FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_CANCEL_GAME) {
//     return {
//       tablePhase: 'table-phase-game-abandoned',
//       gameState: {
//         ...gameState,
//         isGameOver: true,
//         outcomeSummary: gameAction.cancellationReason,
//       },
//       description: gameAction.cancellationReason,
//     }
//   }

//   return {
//     tablePhase: 'table-phase-error',
//     gameState: gameState,
//     description: `Error - invalid game action`,
//   };
// }


// const flipACoinProcessorImplementation: IBfgGameEngineProcessor<typeof FlipACoinGameStateSchema, typeof FlipACoinGameActionSchema> = {
//   gameTitle: FlipACoinGameName,
//   gameStateSchema: FlipACoinGameStateSchema,
//   gameActionSchema: FlipACoinGameActionSchema,

//   applyGameAction,
//   createInitialGameState,
//   createInitialGameTableAction,

//   createGameStateRepresentationComponent: createFlipACoinRepresentation,
//   createGameStateActionInputComponent: createFlipACoinInput,

//   createGameStateCombinationRepresentationAndInputComponent: undefined,
// }



// export const FlipACoinGameStateProcessor = createBfgGameEngineProcessor(
//   FlipACoinGameName,
//   FlipACoinGameStateSchema,
//   FlipACoinGameActionSchema,

//   flipACoinProcessorImplementation,

//   // applyGameAction,

//   // createInitialGameState,
//   // createInitialGameTableAction,

//   // createFlipACoinRepresentation,
//   // createFlipACoinInput,
//   // createFlipACoinComboRepresentationAndInput,
// );
