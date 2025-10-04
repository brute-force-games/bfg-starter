import { z } from "zod";
import { TicTacToeGameActionSchema, TicTacToeGameStateSchema, TicTacToeGameStateProcessor } from "./tic-tac-toe-engine";
import { AbfgSupportedGameTitle } from "./supported-games";
import { FlipACoinGameActionSchema, FlipACoinGameStateSchema, FlipACoinGameStateProcessor } from "./flip-a-coin-engine";
import { GameTable, GameTableSeat } from "../../models/game-table/game-table";
import { FlipACoinGameDefinition, GameDefinition, HangmanGameDefinition, TicTacToeGameDefinition } from "../enums/game-shelf";
import { BfgGameSpecificGameStateTypedJson } from "../core/branded-values/bfg-game-state-typed-json";
import { BfgGameSpecificTableAction } from "../../models/game-table/game-table-action";
import { GameTableActionResult } from "../../models/game-table/table-phase";
import { HangmanGameActionSchema, HangmanGameStateSchema, HangmanGameStateProcessor } from "./hangman-engine";


export type BfgGameEngineRendererFactory<
  GS extends z.ZodTypeAny,
  GA extends z.ZodTypeAny
> = {
  createGameStateRepresentationComponent: (
    playerSeat: GameTableSeat,
    gameState: z.infer<GS>,
    mostRecentAction: z.infer<GA>
  ) => React.ReactNode;

  createGameStateActionInputComponent: (
    playerSeat: GameTableSeat,
    gameState: z.infer<GS>,
    mostRecentAction: z.infer<GA>,
    onGameAction: (gameState: z.infer<GS>, gameAction: z.infer<GA>) => void
  ) => React.ReactNode;

  createGameStateCombinationRepresentationAndInputComponent?: (
    playerSeat: GameTableSeat,
    gameState: z.infer<GS>,
    mostRecentAction: z.infer<GA>,
    onGameAction: (gameState: z.infer<GS>, gameAction: z.infer<GA>) => void
  ) => React.ReactNode | undefined,
  
  // // narrowGameActionsToValidGameActions: (gameActions: DbGameTableAction[]) => GA[];
  // narrowGameActionsToValidGameActions: (
  //   gameActions: DbGameTableAction[]
  // ) => BfgGameSpecificTableAction<GA>[];

  createGameHistoryComponent?: (
    playerSeat: GameTableSeat,
    gameState: z.infer<GS>,
    gameActions: BfgGameSpecificTableAction<z.infer<GA>>[]
  ) => React.ReactNode;

  createGameStateHostComponent: (
    gameTable: GameTable,
    gameState: z.infer<GS>,
    mostRecentAction: z.infer<GA>,
    onGameAction: (gameState: z.infer<GS>, gameAction: z.infer<GA>) => void
  ) => React.ReactNode;
}



export type BfgGameEngineProcessor<
  GS extends z.ZodTypeAny, 
  GA extends z.ZodTypeAny
> = {

  rendererFactory: BfgGameEngineRendererFactory<GS, GA>;
  
  createBfgGameSpecificInitialGameTableAction: (
    gameTable: GameTable
  ) => BfgGameSpecificTableAction<z.infer<GA>>;  // Ensure this is inferred from Zod schema

  createBfgInitialGameSpecificState: (
    initialGameTableAction: BfgGameSpecificTableAction<z.infer<GA>>
  ) => z.infer<GS>;  // Ensure this is inferred from Zod schema

  createGameSpecificGameStateJson: (
    gameState: z.infer<GS>
  ) => BfgGameSpecificGameStateTypedJson<AbfgSupportedGameTitle>;  // Ensure this is inferred from Zod schema

  parseGameSpecificGameStateJson: (
    jsonString: BfgGameSpecificGameStateTypedJson<AbfgSupportedGameTitle>
  ) => z.infer<GS>;  // Ensure this is inferred from Zod schema

  createGameSpecificActionJson: (
    gameAction: z.infer<GA>
  ) => BfgGameSpecificGameStateTypedJson<AbfgSupportedGameTitle>;  // Ensure this is inferred from Zod schema
  
  parseGameSpecificActionJson: (
    jsonString: BfgGameSpecificGameStateTypedJson<AbfgSupportedGameTitle>
  ) => z.infer<GA>;  // Ensure this is inferred from Zod schema

  // createGameStateRepresentationComponent: (
  //   playerSeat: GameTableSeat,
  //   gameState: GS,
  //   mostRecentAction: GA
  // ) => React.ReactNode;

  // createGameStateActionInputComponent: (
  //   playerSeat: GameTableSeat,
  //   gameState: GS,
  //   mostRecentAction: GA,
  //   onGameAction: (gameState: GS, gameAction: GA) => void
  // ) => React.ReactNode;

  // createGameStateCombinationRepresentationAndInputComponent?: (
  //   playerSeat: GameTableSeat,
  //   gameState: GS,
  //   mostRecentAction: GA,
  //   onGameAction: (gameState: GS, gameAction: GA) => void
  // ) => React.ReactNode | undefined,
  
  // // // narrowGameActionsToValidGameActions: (gameActions: DbGameTableAction[]) => GA[];
  // // narrowGameActionsToValidGameActions: (
  // //   gameActions: DbGameTableAction[]
  // // ) => BfgGameSpecificTableAction<GA>[];

  // createGameHistoryComponent?: (
  //   playerSeat: GameTableSeat,
  //   gameState: GS,
  //   gameActions: BfgGameSpecificTableAction<GA>[]
  // ) => React.ReactNode;

  // narrowGameStateToValidGameActions: (
  //   tableState: GameTable,
  //   gameState: z.infer<GS>,
  // ) => BfgGameSpecificTableAction<GA>[];

  applyGameAction: (
    tableState: GameTable,
    gameState: z.infer<GS>,
    gameAction: z.infer<GA>
  ) => GameTableActionResult<z.infer<GS>>;

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

export const HangmanGameMetadata: BfgGameEngineMetadata<typeof HangmanGameStateSchema, typeof HangmanGameActionSchema> = {
  definition: HangmanGameDefinition,
  processor: HangmanGameStateProcessor,
}


export const AllBfgGameMetadata = {
  ['Tic Tac Toe']: TicTacToeGameMetadata,
  ['Flip a Coin']: FlipACoinGameMetadata,
  ['Hangman']: HangmanGameMetadata,

  // ['Backgammon']: TicTacToeGameStateProcessor,
  // ['Chess']: TicTacToeGameStateProcessor,
} as const;


export const getBfgGameMetadata = (gameTable: GameTable) => {

  const gameTitle = gameTable.gameTitle as keyof typeof AllBfgGameMetadata;
  const gameMetadata = AllBfgGameMetadata[gameTitle];

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

// Typed accessor for game metadata that eliminates union type complexity
export const getTypedBfgGameMetadata = <T extends keyof typeof AllBfgGameMetadata>(
  gameTitle: T
): typeof AllBfgGameMetadata[T] => {
  return AllBfgGameMetadata[gameTitle];
}

// Typed accessor for game processor that eliminates union type complexity
export const getTypedBfgGameProcessor = <T extends keyof typeof AllBfgGameMetadata>(
  gameTitle: T
): typeof AllBfgGameMetadata[T]['processor'] => {
  return AllBfgGameMetadata[gameTitle].processor;
}

// Helper function to create initial game data with proper typing using games registry
export const createInitialGameData = (
  gameTitle: keyof typeof AllBfgGameMetadata,
  gameTable: GameTable
) => {
  const gameEngine = getTypedBfgGameProcessor(gameTitle);
  
  // This is the same pattern for all games, no need for switch statement
  // Using type assertions to work around TypeScript's union type limitations
  const initGameAction = gameEngine.createBfgGameSpecificInitialGameTableAction(gameTable) as any;
  const initialGameSpecificState = gameEngine.createBfgInitialGameSpecificState(initGameAction) as any;
  const gameStateJson = gameEngine.createGameSpecificGameStateJson(initialGameSpecificState) as any;
  const actionJson = gameEngine.createGameSpecificActionJson(initGameAction.gameSpecificAction) as any;
  
  return { initGameAction, initialGameSpecificState, gameStateJson, actionJson };
}

// Alternative registry-based version that uses the games registry directly
export const createInitialGameDataFromRegistry = (
  gameTitle: string, // Using string to work with the registry
  gameTable: GameTable
) => {
  // Import the registry function dynamically to avoid circular dependencies
  const { getGameMetadata } = require('../../games-registry/games-registry');
  const gameMetadata = getGameMetadata(gameTitle);
  const gameEngine = gameMetadata.processor;
  
  // Same pattern for all games - using type assertions for flexibility
  const initGameAction = gameEngine.createBfgGameSpecificInitialGameTableAction(gameTable) as any;
  const initialGameSpecificState = gameEngine.createBfgInitialGameSpecificState(initGameAction) as any;
  const gameStateJson = gameEngine.createGameSpecificGameStateJson(initialGameSpecificState) as any;
  const actionJson = gameEngine.createGameSpecificActionJson(initGameAction.gameSpecificAction) as any;
  
  return { initGameAction, initialGameSpecificState, gameStateJson, actionJson };
}
