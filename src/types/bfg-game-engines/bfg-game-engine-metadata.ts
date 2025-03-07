import React from "react";
import { z } from "zod";
import { NewGameTable } from "../core/game-table/game-table";
import { BfgGameTypedJson, createBfgGameTypedJsonMetadata } from "../core/branded-values/bfg-game-typed-json";
import { GameTableSeat } from "../core/game-table/game-table";
import { GameTableActionResult } from "../core/game-table/table-phase";
import { BfgSupportedGameTitle, BfgSupportedGameTitlesSchema } from "./supported-games";



export type BfgGameEngineProcessor<GS, GA, TGameTitle extends z.infer<typeof BfgSupportedGameTitlesSchema>> = {
  createInitialGameState: (initialGameTableAction: GA) => GS;  // for tic-tac-toe, this is the empty board
  createInitialGameTableAction: (gameTable: NewGameTable) => GA;  // for tic-tac-toe, this is creating the board
  // createInitialGameTableAction: (gameTable: NewGameTable) => GA;  // for tic-tac-toe, this is creating the board
  // createNextPlayersToAct: (gameAction: GA, gameState: GS) => GameTableSeat[];  // for tic-tac-toe, this is ping-ponging between players

  createGameStateJson: (gameState: GS) => BfgGameTypedJson<TGameTitle>;  // this creates the representation of the board as JSON
  parseGameStateJson: (jsonString: BfgGameTypedJson<TGameTitle>) => GS;  // this parses the JSON back into the game state

  createGameActionJson: (gameAction: GA) => BfgGameTypedJson<TGameTitle>;  // this creates the representation of the game action as JSON
  parseGameActionJson: (jsonString: BfgGameTypedJson<TGameTitle>) => GA;  // this parses the JSON back into the game action

  createGameStateRepresentationComponent: (playerSeat: GameTableSeat, gameState: GS) => React.ReactNode;
  createGameStateActionInputComponent: (playerSeat: GameTableSeat, gameState: GS, onGameAction: (gameState: GS, gameAction: GA) => void) => React.ReactNode;
  createGameStateCombinationRepresentationAndInputComponent?: (playerSeat: GameTableSeat, gameState: GS, onGameAction: (gameState: GS, gameAction: GA) => void) => React.ReactNode | undefined,

  applyGameAction: (gameState: GS, gameAction: GA) => GameTableActionResult<GS>;

  gameStateBrandedJsonString: BfgGameTypedJson<TGameTitle>;
  gameStateJsonSchema: z.ZodSchema<GS>;

  gameActionBrandedJsonString: BfgGameTypedJson<TGameTitle>;
  gameActionJsonSchema: z.ZodSchema<GA>;
}



export const createBfgGameEngineProcessor = <GS extends z.AnyZodObject, GA extends z.ZodType>(
  gameTitle: BfgSupportedGameTitle,
  gameStateSchema: GS,
  gameActionSchema: GA,

  applyGameAction: (gameState: z.infer<GS>, gameAction: z.infer<GA>) => GameTableActionResult<z.infer<GS>>,

  createInitialGameState: (initialGameTableAction: z.infer<GA>) => z.infer<GS>,
  // createNextPlayersToAct: (gameAction: z.infer<GA>, gameState: z.infer<GS>) => GameTableSeat[],
  createInitialGameTableAction: (gameTable: NewGameTable) => z.infer<GA>,

  createGameStateRepresentationComponent: (
    myPlayerSeat: GameTableSeat,
    gameState: z.infer<GS>
  ) => React.ReactNode,
  createGameStateActionInputComponent: (
    myPlayerSeat: GameTableSeat,
    gameState: z.infer<GS>, 
    onGameAction: (gameState: z.infer<GS>, gameAction: z.infer<GA>) => void
  ) => React.ReactNode,
  createGameStateCombinationRepresentationAndInputComponent?: (
    myPlayerSeat: GameTableSeat,
    gameState: z.infer<GS>, 
    onGameAction: (gameState: z.infer<GS>, gameAction: z.infer<GA>) => void
  ) => React.ReactNode | undefined,

): BfgGameEngineProcessor<z.infer<GS>, z.infer<GA>, BfgSupportedGameTitle> => {

  type TGameTitle = z.infer<typeof BfgSupportedGameTitlesSchema>;
  // type TGAname = z.infer<typeof BfgSupportedGameTitlesSchema>;
  type TInfer = z.infer<GS>;

  const createBrandedJsonValue = (obj: TInfer): BfgGameTypedJson<TGameTitle> => {
    const json = JSON.stringify(obj);
    return json as BfgGameTypedJson<TGameTitle>;
  }

  const gameStateBrandedJsonString = createBfgGameTypedJsonMetadata(gameTitle, 'game-state', gameStateSchema);
  const gameActionBrandedJsonString = createBfgGameTypedJsonMetadata(gameTitle, 'game-action', gameActionSchema);

  const processor: BfgGameEngineProcessor<z.infer<GS>, z.infer<GA>, BfgSupportedGameTitle> = {
    createInitialGameState,
    createInitialGameTableAction,
    
    createGameStateJson: (obj: TInfer) => createBrandedJsonValue(obj),
    parseGameStateJson: (jsonString: BfgGameTypedJson<TGameTitle>) => {
      const json = JSON.parse(jsonString);
      return gameStateSchema.parse(json) as GS;
    },

    createGameActionJson: (obj: TInfer) => createBrandedJsonValue(obj),
    parseGameActionJson: (jsonString: BfgGameTypedJson<TGameTitle>) => {
      const json = JSON.parse(jsonString);
      return gameActionSchema.parse(json) as GA;
    },

    createGameStateRepresentationComponent,
    createGameStateActionInputComponent,
    createGameStateCombinationRepresentationAndInputComponent,

    applyGameAction,

    gameStateBrandedJsonString: gameStateBrandedJsonString.getBrandedSchema(),
    gameStateJsonSchema: gameStateSchema,

    gameActionBrandedJsonString: gameActionBrandedJsonString.getBrandedSchema(),
    gameActionJsonSchema: gameActionSchema,
  } as const;

  return processor;
}
