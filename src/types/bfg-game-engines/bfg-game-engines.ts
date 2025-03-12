import { z } from "zod";
import { TicTacToeGameActionSchema, TicTacToeGameStateSchema, TicTacToeGameStateProcessor } from "./tic-tac-toe-engine";
import { FlipACoinGameActionSchema, FlipACoinGameStateSchema, FlipACoinGameStateProcessor } from "./flip-a-coin-engine";
import { DbGameTable, NewGameTable, GameTableSeat } from "../core/game-table/game-table";
import { FlipACoinGameDefinition, GameDefinition, TicTacToeGameDefinition } from "../enums/game-shelf";
import { BfgGameSpecificActionJsonString, BfgGameSpecificGameStateJsonString } from "../core/branded-values/bfg-game-state-typed-json";
import { BfgGameSpecificTableAction, DbGameTableAction } from "../core/game-table/game-table-action";
import { GameTableActionResult } from "../core/game-table/table-phase";


export type BfgGameEngineProcessor<
  GS extends z.ZodTypeAny, 
  GA extends z.ZodTypeAny
> = {
  
  createBfgGameSpecificInitialGameTableAction: (
    gameTable: NewGameTable
  ) => BfgGameSpecificTableAction<GA>;  // Ensure this is inferred from Zod schema

  createBfgInitialGameSpecificState: (
    initialGameTableAction: BfgGameSpecificTableAction<GA>
  ) => GS;  // Ensure this is inferred from Zod schema

  createGameSpecificGameStateJson: (
    gameState: GS
  ) => BfgGameSpecificGameStateJsonString;  // Ensure this is inferred from Zod schema

  parseGameSpecificGameStateJson: (
    jsonString: BfgGameSpecificGameStateJsonString
  ) => GS;  // Ensure this is inferred from Zod schema

  createGameSpecificActionJson: (
    gameAction: GA
  ) => BfgGameSpecificActionJsonString;  // Ensure this is inferred from Zod schema
  
  parseGameSpecificActionJson: (
    jsonString: BfgGameSpecificActionJsonString
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

  gameStateSchema: z.ZodSchema<GS>;

  gameActionSchema: z.ZodSchema<GA>;
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


export const getBfgGameMetadata = (gameTable: DbGameTable | NewGameTable) => {

  const gameTitle = gameTable.gameTitle as keyof typeof AllBfgGameMetadata;
  const gameMetadata = AllBfgGameMetadata[gameTitle];

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
