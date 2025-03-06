import React from "react";
import { z } from "zod";
import { NewGameTable } from "../core/game-table/game-table";
import { BrandedJson, BrandedJsonSchema } from "../core/branded-values/bfg-branded-json";
import { createBrandedJsonSchema } from "../core/branded-values/bs-json-string-utils";
import { GameTableSeat } from "../core/game-table/game-table";



export type BfgGameEngineProcessor<GS, GA, Tname extends string> = {
  createInitialGameState: (gameTable: NewGameTable) => GS;  // for tic-tac-toe, this is the empty board
  createInitialGameTableAction: (gameTable: NewGameTable) => GA;  // for tic-tac-toe, this is creating the board
  createNextPlayersToAct: (gameAction: GA, gameState: GS) => GameTableSeat[];  // for tic-tac-toe, this is ping-ponging between players

  createGameStateJson: (gameState: GS, gameAction: GA) => BrandedJson<Tname>;  // this creates the representation of the board as JSON
  parseGameStateJson: (jsonString: BrandedJson<Tname>) => GS;  // this parses the JSON back into the game state

  createGameStateRepresentationComponent: (gameState: GS) => React.ReactNode;
  createGameStateActionInputComponent: (gameState: GS, onGameAction: (gameAction: GA) => void) => React.ReactNode;
  createGameStateCombinationRepresentationAndInputComponent: (gameState: GS, onGameAction: (gameAction: GA) => void) => React.ReactNode | undefined,

  gameStateBrandedJsonString: BrandedJsonSchema<Tname>;
  gameStateJsonSchema: z.ZodSchema<GS>;

  gameActionBrandedJsonString: BrandedJsonSchema<Tname>;
  gameActionJsonSchema: z.ZodSchema<GA>;
}



export const createBfgGameEngineProcessor = <GS extends z.AnyZodObject, GA extends z.AnyZodObject>(
  gameStateSchema: GS,
  gameActionSchema: GA,

  createInitialGameState: (gameTable: NewGameTable) => z.infer<GS>,
  createNextPlayersToAct: (gameState: z.infer<GS>) => GameTableSeat[],
  createInitialGameTableAction: (gameTable: NewGameTable) => z.infer<GA>,

  createGameStateRepresentationComponent: (gameState: z.infer<GS>) => React.ReactNode,
  createGameStateActionInputComponent: (gameState: z.infer<GS>, onGameAction: (gameAction: z.infer<GA>) => void) => React.ReactNode,
  createGameStateCombinationRepresentationAndInputComponent: (gameState: z.infer<GS>, onGameAction: (gameAction: z.infer<GA>) => void) => React.ReactNode | undefined,

): BfgGameEngineProcessor<z.infer<GS>, z.infer<GA>, NonNullable<GS['description']>> => {

  type TGSname = NonNullable<GS['description']>;
  type TGAname = NonNullable<GA['description']>;
  type TInfer = z.infer<GS>;

  const createBrandedJsonValue = (obj: TInfer): BrandedJson<TGSname> => {
    const json = JSON.stringify(obj);
    return json as BrandedJson<TGSname>;
  }

  const gameStateBrandedJsonString = createBrandedJsonSchema(gameStateSchema);
  const gameActionBrandedJsonString = createBrandedJsonSchema(gameActionSchema);

  const processor: BfgGameEngineProcessor<z.infer<GS>, z.infer<GA>, TGSname> = {
    createInitialGameState,
    createNextPlayersToAct,
    createInitialGameTableAction,
    
    createGameStateJson: (obj: TInfer) => createBrandedJsonValue(obj),
    parseGameStateJson: (jsonString: BrandedJson<TGSname>) => {
      const json = JSON.parse(jsonString);
      return gameStateSchema.parse(json) as GS;
    },

    createGameStateRepresentationComponent,
    createGameStateActionInputComponent,
    createGameStateCombinationRepresentationAndInputComponent,

    gameStateBrandedJsonString,
    gameStateJsonSchema: gameStateSchema,

    gameActionBrandedJsonString,
    gameActionJsonSchema: gameActionSchema,
  } as const;

  return processor;
}
