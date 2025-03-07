import { TicTacToeGameStateProcessor } from "./tic-tac-toe-engine";



export const BfgGameEngineMetadata = {
  ['Tic Tac Toe']: TicTacToeGameStateProcessor,
  ['Hangman']: TicTacToeGameStateProcessor,
  ['Backgammon']: TicTacToeGameStateProcessor,
  ['Chess']: TicTacToeGameStateProcessor,
  ['Flip a Coin']: TicTacToeGameStateProcessor,
} as const;

