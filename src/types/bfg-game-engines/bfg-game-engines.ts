import { z } from "zod";
import { TicTacToeGameAction, TicTacToeGameState, TicTacToeGameStateProcessor } from "./tic-tac-toe-engine";
import { AbfgSupportedGameTitle } from "./supported-games";
// import { FlipACoinGameActionSchema, FlipACoinGameStateSchema, FlipACoinGameStateProcessor } from "./flip-a-coin-engine";
import { DbGameTable, NewGameTable, GameTableSeat } from "../core/game-table/game-table";
import { GameDefinition, TicTacToeGameDefinition } from "../enums/game-shelf";
import { BfgGameTypedJson } from "../core/branded-values/bfg-game-typed-json";
import { BfgGameSpecificActionSchema, BfgGameSpecificGameStateSchema, BfgGameSpecificTableAction, DbGameTableAction } from "../core/game-table/game-table-action";
import { GameTableActionResult } from "../core/game-table/table-phase";




// export type BfgGameEngineProcessor<
//   TGameTitle extends "Tic Tac Toe" | "Flip a Coin", 
//   GS extends z.ZodType, 
//   GA extends z.ZodType
// > = {
//   createInitialGameState: (initialGameTableAction: z.infer<GA>) => z.infer<GS>;
//   createBfgGameSpecificInitialGameTableAction: (gameTable: NewGameTable) => BfgGameSpecificTableAction<GA>;

//   createGameStateJson: (gameState: z.infer<GS>) => TGameTitle extends "Tic Tac Toe" ? BfgGameTypedJsonTicTacToe : BfgGameTypedJsonFlipACoin;
//   parseGameStateJson: (jsonString: TGameTitle extends "Tic Tac Toe" ? BfgGameTypedJsonTicTacToe : BfgGameTypedJsonFlipACoin) => z.infer<GS>;

//   createGameActionJson: (gameAction: z.infer<GA>) => TGameTitle extends "Tic Tac Toe" ? BfgGameTypedJsonTicTacToe : BfgGameTypedJsonFlipACoin;
//   parseGameActionJson: (jsonString: TGameTitle extends "Tic Tac Toe" ? BfgGameTypedJsonTicTacToe : BfgGameTypedJsonFlipACoin) => z.infer<GA>;

//   // Other methods...
// }


// export type BfgWrappedGameSpecificAction<GA extends z.ZodType> = BfgGameSpecificTableAction<z.infer<GA>>;



export type BfgGameEngineProcessor<
  GS extends z.infer<typeof BfgGameSpecificGameStateSchema>, 
  GA extends z.infer<typeof BfgGameSpecificActionSchema>
> = {

  
  createBfgGameSpecificInitialGameTableAction: (
    gameTable: NewGameTable
  ) => BfgGameSpecificTableAction<GA>;  // Ensure this is inferred from Zod schema

  createBfgInitialGameState: (
    initialGameTableAction: BfgGameSpecificTableAction<GA>
  ) => GS;  // Ensure this is inferred from Zod schema

  createGameSpecificStateJson: (
    gameState: GS
  ) => BfgGameTypedJson<AbfgSupportedGameTitle>;  // Ensure this is inferred from Zod schema

  parseGameSpecificStateJson: (
    jsonString: BfgGameTypedJson<AbfgSupportedGameTitle>
  ) => GS;  // Ensure this is inferred from Zod schema

  createGameSpecificActionJson: (
    gameAction: GA
  ) => BfgGameTypedJson<AbfgSupportedGameTitle>;  // Ensure this is inferred from Zod schema
  
  parseGameSpecificActionJson: (
    jsonString: BfgGameTypedJson<AbfgSupportedGameTitle>
  ) => GA;  // Ensure this is inferred from Zod schema

  createGameStateRepresentationComponent: (
    playerSeat: GameTableSeat,
    gameState: GS,
    mostRecentAction: GA
  ) => React.ReactNode;

  createGameStateActionInputComponent: (
    playerSeat: GameTableSeat,
    gameState: GS,
    mostRecentAction: GA,
    onGameAction: (gameState: GS, gameAction: GA) => void
  ) => React.ReactNode;

  createGameStateCombinationRepresentationAndInputComponent?: (
    playerSeat: GameTableSeat,
    gameState: GS,
    mostRecentAction: GA,
    onGameAction: (gameState: GS, gameAction: GA) => void
  ) => React.ReactNode | undefined,
  
  // // narrowGameActionsToValidGameActions: (gameActions: DbGameTableAction[]) => GA[];
  narrowGameActionsToValidGameActions: (
    gameActions: DbGameTableAction[]
  ) => BfgGameSpecificTableAction<GA>[];

  createGameHistoryComponent?: (
    playerSeat: GameTableSeat,
    gameState: GS,
    gameActions: BfgGameSpecificTableAction<GA>[]
  ) => React.ReactNode;

  applyGameAction: (
    tableState: DbGameTable,
    gameState: GS,
    gameAction: GA
  ) => GameTableActionResult<GS>;

  gameStateBrandedJsonString: BfgGameTypedJson<AbfgSupportedGameTitle>;
  gameStateJsonSchema: z.ZodSchema<GS>;

  gameActionBrandedJsonString: BfgGameTypedJson<AbfgSupportedGameTitle>;
  gameActionJsonSchema: z.ZodSchema<GA>;
}



export type BfgGameEngineMetadata<
  GS extends z.infer<typeof BfgGameSpecificGameStateSchema>,
  GA extends z.infer<typeof BfgGameSpecificActionSchema>
> = {
  definition: GameDefinition;
  processor: BfgGameEngineProcessor<GS, GA>;
}

export const TicTacToeGameMetadata: BfgGameEngineMetadata<TicTacToeGameState, TicTacToeGameAction> = {
  definition: TicTacToeGameDefinition,
  processor: TicTacToeGameStateProcessor,
}

// export const FlipACoinGameMetadata: BfgGameEngineMetadata<typeof FlipACoinGameStateSchema, typeof FlipACoinGameActionSchema> = {
//   definition: FlipACoinGameDefinition,
//   processor: FlipACoinGameStateProcessor,
// }

export const AllBfgGameMetadata = {
  ['Tic Tac Toe']: TicTacToeGameMetadata,
  // ['Flip a Coin']: FlipACoinGameMetadata,

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


// export type BfgGameEngineProcessor<
//   TGameTitle extends z.infer<typeof BfgSupportedGameTitlesSchema>, 
//   GS extends z.ZodType, 
//   GA extends z.ZodType
// > = {
//   createInitialGameState: (initialGameTableAction: z.infer<GA>) => GS;  // Ensure this is inferred from Zod schema
//   createInitialGameTableAction: (gameTable: NewGameTable) => z.infer<GA>;  // Ensure this is inferred from Zod schema

//   // Other methods...
// }

