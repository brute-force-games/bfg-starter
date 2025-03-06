import { TicTacToeGameStateProcessor } from "./tic-tac-toe-engine";



export const BfgGameEngineMetadata = {
  ['Tic Tac Toe']: TicTacToeGameStateProcessor,
  ['Hangman']: TicTacToeGameStateProcessor,
  ['Backgammon']: TicTacToeGameStateProcessor,
  ['Chess']: TicTacToeGameStateProcessor,
} as const;

