import { z } from "zod";
import { createBfgGameEngineProcessor } from "./bfg-game-engine-metadata";
import { NewGameTable } from "../core/game-table/game-table";
import { GameTableActionResult } from "../core/game-table/table-phase";
import { createFlipACoinInput, createFlipACoinRepresentation } from "~/game-engine-components/flip-a-coin/flip-a-coin-components";
import { BfgSupportedGameTitle } from "./supported-games";
import { GameTableSeatSchema } from "../core/game-table/game-table";


export const FlipACoinResolutionSchema = z.enum([
  'game-in-progress',
  'game-over-heads-wins',
  'game-over-tails-wins',
])

export type FlipACoinResolution = z.infer<typeof FlipACoinResolutionSchema>;


export const FlipACoinOutcomeSchema = z.enum([
  'heads',
  'tails',
])

export type FlipACoinOutcome = z.infer<typeof FlipACoinOutcomeSchema>;


export const FlipACoinPlayerOutcomePreferenceSchema = z.enum([
  'heads',
  'tails',
  'no-preference',
])

export type FlipACoinPlayerOutcomePreference = z.infer<typeof FlipACoinPlayerOutcomePreferenceSchema>;


export const CoinChoiceSchema = z.enum([
  'penny',
  'nickel',
  'dime',
  'quarter',
])

export type CoinChoice = z.infer<typeof CoinChoiceSchema>;


export const FlipACoinStartGameSchema = z.object({
  actionType: z.literal('game-table-action-host-start-game'),
})

export type FlipACoinStartGame = z.infer<typeof FlipACoinStartGameSchema>;


export const FlipACoinActionChooseCoinSchema = z.object({
  actionType: z.literal('game-table-action-player-choose-coin'),
  chosenCoin: CoinChoiceSchema,
})


export const FlipACoinActionFlipCoinSchema = z.object({
  actionType: z.literal('game-table-action-player-flip-coin'),
  // chosenCoin: CoinChoiceSchema,
  outcome: FlipACoinOutcomeSchema,
})

export const FlipACoinActionPreferOutcomeSchema = z.object({
  actionType: z.literal('game-table-action-player-prefer-outcome'),
  seat: GameTableSeatSchema,
  preferredOutcome: FlipACoinPlayerOutcomePreferenceSchema,
})

export const FlipACoinGameActionSchema = z.discriminatedUnion('actionType', [
  FlipACoinStartGameSchema,
  FlipACoinActionChooseCoinSchema, 
  FlipACoinActionFlipCoinSchema,
  FlipACoinActionPreferOutcomeSchema,
])

export type FlipACoinGameAction = z.infer<typeof FlipACoinGameActionSchema>;


export const FlipACoinGameStateSchema = z.object({
  chosenCoin: CoinChoiceSchema,
  isFlipped: z.boolean(),
  outcome: FlipACoinOutcomeSchema.optional(),
  playerOutcomePreferences: z.record(GameTableSeatSchema, FlipACoinPlayerOutcomePreferenceSchema)
    .optional()
    .default({
      'p1': 'no-preference',
      'p2': 'no-preference',
      'p3': 'no-preference',
      'p4': 'no-preference',
      'p5': 'no-preference',
      'p6': 'no-preference',
      'p7': 'no-preference',
      'p8': 'no-preference',
    }),
}).describe('Flip A Coin');

export type FlipACoinGameState = z.infer<typeof FlipACoinGameStateSchema>;

export const FlipACoinGameName = 'Flip A Coin' as const;


const createInitialGameState = (
  initialGameTableAction: FlipACoinGameAction,
): FlipACoinGameState => {

  if (initialGameTableAction.actionType !== 'game-table-action-host-start-game') {
    throw new Error("Initial game table action must be a host start game");
  }

  return {
    chosenCoin: 'penny',
    isFlipped: false,
    outcome: undefined,
    playerOutcomePreferences: {
      'p1': 'no-preference',
      'p2': 'no-preference',
      'p3': 'no-preference',
      'p4': 'no-preference',
      'p5': 'no-preference',
      'p6': 'no-preference',
      'p7': 'no-preference',
      'p8': 'no-preference',
    },
  };
}


const createInitialGameTableAction = (
  _gameTable: NewGameTable,
): FlipACoinGameAction => {
  return {
    actionType: 'game-table-action-host-start-game',
  };
}


const applyGameAction = (
  gameState: FlipACoinGameState,
  gameAction: FlipACoinGameAction,
): GameTableActionResult<FlipACoinGameState> => {

  if (gameAction.actionType === 'game-table-action-player-choose-coin') {

    return {
      tablePhase: 'table-phase-game-in-progress',
      gameState: {
        ...gameState,
        chosenCoin: gameAction.chosenCoin,
      }
    }
  } 

  if (gameAction.actionType === 'game-table-action-player-prefer-outcome') {
    return {
      tablePhase: 'table-phase-game-in-progress',
      gameState: {
        ...gameState,
        playerOutcomePreferences: { 
          ...gameState.playerOutcomePreferences,
          [gameAction.seat]: gameAction.preferredOutcome,
        },
      }
    }
  }
  
  if (gameAction.actionType === 'game-table-action-player-flip-coin') {
    return {
      tablePhase: 'table-phase-game-in-progress',
      gameState: {
        ...gameState,
        isFlipped: true,
        outcome: gameAction.outcome,
      }
    }
  }

  return {
    tablePhase: 'table-phase-error',
    gameState: gameState,
  };
}


export const FlipACoinGameStateProcessor = createBfgGameEngineProcessor(
  FlipACoinGameName as BfgSupportedGameTitle,
  FlipACoinGameStateSchema,
  FlipACoinGameActionSchema,

  applyGameAction,

  createInitialGameState,
  createInitialGameTableAction,

  createFlipACoinRepresentation,
  createFlipACoinInput,
  // createFlipACoinComboRepresentationAndInput,
);
