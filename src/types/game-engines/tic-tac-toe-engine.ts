import { z } from "zod";
import { createBfgGameEngineProcessor } from "./bfg-game-engine-metadata";
import { GameTableSeat, GameTableSeatSchema, NewGameTable } from "../core/game-table/game-table";
import { createTicTacToeRepresentation, createTicTacToeInput, createTicTacToeComboRepresentationAndInput } from "~/components/games/tic-tac-toe/tic-tac-toe-components";


export const TicTacToeResolutionSchema = z.enum([
  'game-in-progress',
  'game-over-draw',
  'game-over-x-wins',
  'game-over-o-wins',
])

export type TicTacToeResolution = z.infer<typeof TicTacToeResolutionSchema>;


export const TicTacToeMoveCellSchema = z.enum([
  '1', '2', '3',
  '4', '5', '6',
  '7', '8', '9',
])

export type TicTacToeMoveCell = z.infer<typeof TicTacToeMoveCellSchema>;


export const TicTacToeMoveSchema = z.object({
  moveCell: TicTacToeMoveCellSchema,
  movePlayer: GameTableSeatSchema,
})

export type TicTacToeMove = z.infer<typeof TicTacToeMoveSchema>;


export const TicTacToeGameStateSchema = z.object({
  board: z.string().length(9),
  currentPlayer: GameTableSeatSchema,
  resolution: TicTacToeResolutionSchema,
}).describe('Tic Tac Toe');

export type TicTacToeGameState = z.infer<typeof TicTacToeGameStateSchema>;

export const TicTacToeGameName = 'Tic Tac Toe' as const;


const initialGameState: TicTacToeGameState = {
  board: "---------",
  currentPlayer: 'p1' as GameTableSeat,
  resolution: 'game-in-progress' as TicTacToeResolution,
}


const createInitialGameState = (_gameTable: NewGameTable): TicTacToeGameState => {
  return initialGameState;
}


const createInitialGameTableAction = (_gameTable: NewGameTable): TicTacToeMove => {
  return {
    moveCell: '1',
    movePlayer: 'p1',
  };
}


const createNextPlayersToAct = (_gameState: TicTacToeGameState): GameTableSeat[] => {
  return ['p1'];
}



export const TicTacToeGameStateProcessor = createBfgGameEngineProcessor(
  TicTacToeGameStateSchema,
  TicTacToeMoveSchema,
  
  createInitialGameState,
  createNextPlayersToAct,
  createInitialGameTableAction,

  createTicTacToeRepresentation,
  createTicTacToeInput,
  createTicTacToeComboRepresentationAndInput,
);
