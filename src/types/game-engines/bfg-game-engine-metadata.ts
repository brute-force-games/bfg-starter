import React from "react";
import { z } from "zod";
import { NewGameTable } from "../core/game-table/game-table";
import { BrandedJson, BrandedJsonSchema } from "../core/branded-values/bfg-branded-json";
import { createBrandedJsonSchema } from "../core/branded-values/bs-json-string-utils";
import { GameTableSeat } from "../core/game-table/game-table";



export type BfgGameEngineProcessor<GS, GA, GSname extends string, GAname extends string> = {
  createInitialGameState: (gameTable: NewGameTable) => GS;  // for tic-tac-toe, this is the empty board
  createInitialGameTableAction: (gameTable: NewGameTable) => GA;  // for tic-tac-toe, this is creating the board
  createNextPlayersToAct: (gameAction: GA, gameState: GS) => GameTableSeat[];  // for tic-tac-toe, this is ping-ponging between players

  createGameStateJson: (gameState: GS) => BrandedJson<GSname>;  // this creates the representation of the board as JSON
  parseGameStateJson: (jsonString: BrandedJson<GSname>) => GS;  // this parses the JSON back into the game state

  createGameActionJson: (gameAction: GA) => BrandedJson<GAname>;  // this creates the representation of the game action as JSON
  parseGameActionJson: (jsonString: BrandedJson<GSname>) => GA;  // this parses the JSON back into the game action

  createGameStateRepresentationComponent: (gameState: GS) => React.ReactNode;
  createGameStateActionInputComponent: (gameState: GS, onGameAction: (gameState: GS, gameAction: GA) => void) => React.ReactNode;
  createGameStateCombinationRepresentationAndInputComponent: (gameState: GS, onGameAction: (gameState: GS, gameAction: GA) => void) => React.ReactNode | undefined,

  applyGameAction: (gameState: GS, gameAction: GA) => GS;

  gameStateBrandedJsonString: BrandedJsonSchema<GSname>;
  gameStateJsonSchema: z.ZodSchema<GS>;

  gameActionBrandedJsonString: BrandedJsonSchema<GSname>;
  gameActionJsonSchema: z.ZodSchema<GA>;
}



export const createBfgGameEngineProcessor = <GS extends z.AnyZodObject, GA extends z.AnyZodObject>(
  gameStateSchema: GS,
  gameActionSchema: GA,

  applyGameAction: (gameState: z.infer<GS>, gameAction: z.infer<GA>) => z.infer<GS>,

  createInitialGameState: (gameTable: NewGameTable) => z.infer<GS>,
  createNextPlayersToAct: (gameState: z.infer<GS>) => GameTableSeat[],
  createInitialGameTableAction: (gameTable: NewGameTable) => z.infer<GA>,

  createGameStateRepresentationComponent: (gameState: z.infer<GS>) => React.ReactNode,
  createGameStateActionInputComponent: (gameState: z.infer<GS>, onGameAction: (gameState: z.infer<GS>, gameAction: z.infer<GA>) => void) => React.ReactNode,
  createGameStateCombinationRepresentationAndInputComponent: (gameState: z.infer<GS>, onGameAction: (gameState: z.infer<GS>, gameAction: z.infer<GA>) => void) => React.ReactNode | undefined,

): BfgGameEngineProcessor<z.infer<GS>, z.infer<GA>, NonNullable<GS['description']>, NonNullable<GA['description']>> => {

  type TGSname = NonNullable<GS['description']>;
  type TGAname = NonNullable<GA['description']>;
  type TInfer = z.infer<GS>;

  const createBrandedJsonValue = (obj: TInfer): BrandedJson<TGSname> => {
    const json = JSON.stringify(obj);
    return json as BrandedJson<TGSname>;
  }

  const gameStateBrandedJsonString = createBrandedJsonSchema(gameStateSchema);
  const gameActionBrandedJsonString = createBrandedJsonSchema(gameActionSchema);

  const processor: BfgGameEngineProcessor<z.infer<GS>, z.infer<GA>, TGSname, TGAname> = {
    createInitialGameState,
    createNextPlayersToAct,
    createInitialGameTableAction,
    
    createGameStateJson: (obj: TInfer) => createBrandedJsonValue(obj),
    parseGameStateJson: (jsonString: BrandedJson<TGSname>) => {
      const json = JSON.parse(jsonString);
      return gameStateSchema.parse(json) as GS;
    },

    createGameActionJson: (obj: TInfer) => createBrandedJsonValue(obj),
    parseGameActionJson: (jsonString: BrandedJson<TGAname>) => {
      const json = JSON.parse(jsonString);
      return gameActionSchema.parse(json) as GA;
    },

    createGameStateRepresentationComponent,
    createGameStateActionInputComponent,
    createGameStateCombinationRepresentationAndInputComponent,

    applyGameAction,

    gameStateBrandedJsonString,
    gameStateJsonSchema: gameStateSchema,

    gameActionBrandedJsonString,
    gameActionJsonSchema: gameActionSchema,
  } as const;

  return processor;
}
