import { TicTacToeGameAction, TicTacToeGameState, TicTacToeGameStateProcessor } from "./tic-tac-toe-engine";
import { BfgSupportedGameTitle } from "./supported-games";
import { FlipACoinGameAction, FlipACoinGameState, FlipACoinGameStateProcessor } from "./flip-a-coin-engine";
import { BfgGameEngineProcessor } from "./bfg-game-engine-metadata";
import { DbGameTable, NewGameTable } from "../core/game-table/game-table";
import { FlipACoinGameDefinition, GameDefinition, TicTacToeGameDefinition } from "../enums/game-shelf";


export type BfgGameEngineMetadata<GS, GA> = {
  definition: GameDefinition;
  processor: BfgGameEngineProcessor<BfgSupportedGameTitle, GS, GA>;
  // [key: string]: BfgGameEngineProcessor<any, any, any>;
}

export const TicTacToeGameMetadata: BfgGameEngineMetadata<TicTacToeGameState, TicTacToeGameAction> = {
  definition: TicTacToeGameDefinition,
  processor: TicTacToeGameStateProcessor,
  // gameStateJsonSchema: TicTacToeGameStateSchema,
  // gameActionJsonSchema: TicTacToeGameActionSchema,
}

export const FlipACoinGameMetadata: BfgGameEngineMetadata<FlipACoinGameState, FlipACoinGameAction> = {
  definition: FlipACoinGameDefinition,
  processor: FlipACoinGameStateProcessor,
}

export const AllBfgGameMetadata = {
  ['Tic Tac Toe']: TicTacToeGameMetadata,
  ['Flip a Coin']: FlipACoinGameMetadata,

  // ['Hangman']: TicTacToeGameStateProcessor,
  // ['Backgammon']: TicTacToeGameStateProcessor,
  // ['Chess']: TicTacToeGameStateProcessor,
} as const;


// export const AllBfgGameMetadata = {
//   ['Tic Tac Toe']: TicTacToeGameStateProcessor,
//   // ['Hangman']: TicTacToeGameStateProcessor,
//   // ['Backgammon']: TicTacToeGameStateProcessor,
//   // ['Chess']: TicTacToeGameStateProcessor,
//   ['Flip a Coin']: FlipACoinGameStateProcessor,
// } as const;


export const getBfgGameMetadata = (gameTable: DbGameTable | NewGameTable) => {

  const gameTitle = gameTable.gameTitle as keyof typeof AllBfgGameMetadata;
  const gameMetadata = AllBfgGameMetadata[gameTitle];

  // const gameStateJsonSchema = gameMetadata["gameStateJsonSchema"];
  // const gameActionJsonSchema = gameMetadata["gameActionJsonSchema"];
  
  // const gameMetadata = AllBfgGameMetadata[gameTitle] as BfgGameEngineMetadata<
  //   z.infer<typeof AllBfgGameMetadata[typeof gameTable.gameTitle]["gameStateJsonSchema"]>,
  //   z.infer<typeof AllBfgGameMetadata[typeof gameTable.gameTitle]["gameActionJsonSchema"]>
  // >;

  // const gameMetadata = AllBfgGameMetadata[gameTitle] as BfgGameEngineMetadata<
  //   z.infer<typeof AllBfgGameMetadata[typeof gameTable.gameTitle]>,
  //   z.infer<typeof AllBfgGameMetadata[typeof gameTable.gameTitle]>
  // >;

  return gameMetadata;
}


export const getBfgGameEngine = (gameTable: DbGameTable | NewGameTable) => {
  const gameMetadata = getBfgGameMetadata(gameTable);
  return gameMetadata.processor;
}


export const getBfgGameDefinition = (gameTable: DbGameTable | NewGameTable) => {
  const gameMetadata = getBfgGameMetadata(gameTable);
  return gameMetadata.definition;
}

