import { z } from "zod";
import { TicTacToeGameActionSchema, TicTacToeGameStateSchema, TicTacToeGameStateProcessor } from "./tic-tac-toe-engine";
import { AbfgSupportedGameTitle } from "./supported-games";
import { FlipACoinGameActionSchema, FlipACoinGameStateSchema, FlipACoinGameStateProcessor } from "./flip-a-coin-engine";
import { GameTable, GameTableSeat } from "../../models/game-table/game-table";
import { FlipACoinGameDefinition, GameDefinition, TicTacToeGameDefinition } from "../enums/game-shelf";
import { BfgGameSpecificGameStateTypedJson } from "../core/branded-values/bfg-game-state-typed-json";
import { BfgGameSpecificTableAction, DbGameTableAction } from "../../models/game-table/game-table-action";
import { GameTableActionResult } from "../../models/game-table/table-phase";




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
  GS extends z.ZodTypeAny, 
  GA extends z.ZodTypeAny
> = {
  
  createBfgGameSpecificInitialGameTableAction: (
    gameTable: GameTable
  ) => BfgGameSpecificTableAction<GA>;  // Ensure this is inferred from Zod schema

  createBfgInitialGameSpecificState: (
    initialGameTableAction: BfgGameSpecificTableAction<GA>
  ) => GS;  // Ensure this is inferred from Zod schema

  createGameSpecificGameStateJson: (
    gameState: GS
  ) => BfgGameSpecificGameStateTypedJson<AbfgSupportedGameTitle>;  // Ensure this is inferred from Zod schema

  parseGameSpecificGameStateJson: (
    jsonString: BfgGameSpecificGameStateTypedJson<AbfgSupportedGameTitle>
  ) => GS;  // Ensure this is inferred from Zod schema

  createGameSpecificActionJson: (
    gameAction: GA
  ) => BfgGameSpecificGameStateTypedJson<AbfgSupportedGameTitle>;  // Ensure this is inferred from Zod schema
  
  parseGameSpecificActionJson: (
    jsonString: BfgGameSpecificGameStateTypedJson<AbfgSupportedGameTitle>
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
    tableState: GameTable,
    gameState: GS,
    gameAction: GA
  ) => GameTableActionResult<GS>;

  gameStateBrandedJsonString: BfgGameSpecificGameStateTypedJson<AbfgSupportedGameTitle>;
  gameStateJsonSchema: z.ZodSchema<GS>;

  gameActionBrandedJsonString: BfgGameSpecificGameStateTypedJson<AbfgSupportedGameTitle>;
  gameActionJsonSchema: z.ZodSchema<GA>;
}



export type BfgGameEngineMetadata<
  GS extends z.ZodTypeAny,
  GA extends z.ZodTypeAny
> = {
  definition: GameDefinition;
  processor: BfgGameEngineProcessor<GS, GA>;
}

export const TicTacToeGameMetadata: BfgGameEngineMetadata<
  typeof TicTacToeGameStateSchema,
  typeof TicTacToeGameActionSchema
> = {
  definition: TicTacToeGameDefinition,
  processor: TicTacToeGameStateProcessor,
}

export const FlipACoinGameMetadata: BfgGameEngineMetadata<typeof FlipACoinGameStateSchema, typeof FlipACoinGameActionSchema> = {
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


export const getBfgGameMetadata = (gameTable: GameTable) => {

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


export const getBfgGameEngine = (gameTable: GameTable) => {
  const gameMetadata = getBfgGameMetadata(gameTable);
  return gameMetadata.processor;
}


export const getBfgGameDefinition = (gameTable: GameTable) => {
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

