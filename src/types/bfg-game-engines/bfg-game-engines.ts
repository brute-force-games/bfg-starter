import { z } from "zod";
import { TicTacToeGameStateProcessor } from "./tic-tac-toe-engine";
import { FlipACoinGameStateProcessor } from "./flip-a-coin-engine";
import { BfgGameEngineProcessor } from "./bfg-game-engine-metadata";
import { DbGameTable, NewGameTable } from "../core/game-table/game-table";


export const BfgGameEngineMetadata = {
  ['Tic Tac Toe']: TicTacToeGameStateProcessor,
  // ['Hangman']: TicTacToeGameStateProcessor,
  // ['Backgammon']: TicTacToeGameStateProcessor,
  // ['Chess']: TicTacToeGameStateProcessor,
  ['Flip a Coin']: FlipACoinGameStateProcessor,
} as const;



export const getGameEngineMetadataForGameTable = (gameTable: DbGameTable | NewGameTable) => {

  const gameTitle = gameTable.gameTitle as keyof typeof BfgGameEngineMetadata;
  
  const gameEngineMetadata = BfgGameEngineMetadata[gameTitle] as BfgGameEngineProcessor<
    z.infer<typeof BfgGameEngineMetadata[typeof gameTable.gameTitle]["gameStateJsonSchema"]>,
    z.infer<typeof BfgGameEngineMetadata[typeof gameTable.gameTitle]["gameActionJsonSchema"]>,
    typeof gameTable.gameTitle
  >;

  return gameEngineMetadata;
}
