import { z } from "zod";
import { createBfgGameEngineProcessor } from "./bfg-game-engine-metadata";
import { NewGameTable } from "../core/game-table/game-table";
import { GameTableActionResult } from "../core/game-table/table-phase";
import { createFlipACoinInput, createFlipACoinRepresentation } from "~/game-engine-components/flip-a-coin/flip-a-coin-components";
import { BfgSupportedGameTitle } from "./supported-games";


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
  chosenCoin: CoinChoiceSchema,
  outcome: FlipACoinOutcomeSchema,
})

export const FlipACoinGameActionSchema = z.discriminatedUnion('actionType', [
  FlipACoinStartGameSchema,
  FlipACoinActionChooseCoinSchema, 
  FlipACoinActionFlipCoinSchema,
])

export type FlipACoinGameAction = z.infer<typeof FlipACoinGameActionSchema>;


export const FlipACoinGameStateSchema = z.object({
  chosenCoin: CoinChoiceSchema,
  isFlipped: z.boolean(),
  outcome: FlipACoinOutcomeSchema.optional(),
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
  _gameAction: FlipACoinGameAction,
): GameTableActionResult<FlipACoinGameState> => {

  return {
    tablePhase: 'table-phase-game-in-progress',
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
