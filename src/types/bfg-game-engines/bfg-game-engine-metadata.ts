import React from "react";
import { z } from "zod";
import { NewGameTable } from "../core/game-table/game-table";
import { BfgGameTypedJson, createBfgGameTypedJsonMetadata } from "../core/branded-values/bfg-game-typed-json";
import { GameTableSeat } from "../core/game-table/game-table";
import { GameTableActionResult } from "../core/game-table/table-phase";
import { BfgSupportedGameTitle, BfgSupportedGameTitlesSchema } from "./supported-games";




export type BfgGameEngineProcessor<TGameTitle extends z.infer<typeof BfgSupportedGameTitlesSchema>, GS, GA> = {
  createInitialGameState: (initialGameTableAction: GA) => GS;  // for tic-tac-toe, this is the empty board
  createInitialGameTableAction: (gameTable: NewGameTable) => GA;  // for tic-tac-toe, this is creating the board
  // createInitialGameTableAction: (gameTable: NewGameTable) => GA;  // for tic-tac-toe, this is creating the board
  // createNextPlayersToAct: (gameAction: GA, gameState: GS) => GameTableSeat[];  // for tic-tac-toe, this is ping-ponging between players

  createGameStateJson: (gameState: GS) => BfgGameTypedJson<TGameTitle>;  // this creates the representation of the board as JSON
  parseGameStateJson: (jsonString: BfgGameTypedJson<TGameTitle>) => GS;  // this parses the JSON back into the game state

  createGameActionJson: (gameAction: GA) => BfgGameTypedJson<TGameTitle>;  // this creates the representation of the game action as JSON
  parseGameActionJson: (jsonString: BfgGameTypedJson<TGameTitle>) => GA;  // this parses the JSON back into the game action

  createGameStateRepresentationComponent: (playerSeat: GameTableSeat, gameState: GS, mostRecentAction: GA) => React.ReactNode;
  createGameStateActionInputComponent: (playerSeat: GameTableSeat, gameState: GS, mostRecentAction: GA, onGameAction: (gameState: GS, gameAction: GA) => void) => React.ReactNode;
  createGameStateCombinationRepresentationAndInputComponent?: (playerSeat: GameTableSeat, gameState: GS, mostRecentAction: GA, onGameAction: (gameState: GS, gameAction: GA) => void) => React.ReactNode | undefined,
  
  // // narrowGameActionsToValidGameActions: (gameActions: DbGameTableAction[]) => GA[];
  // narrowGameActionsToValidGameActions: (gameActions: DbGameTableAction[]) => 
  //   BfgGameSpecificTableAction<typeof BfgGameTableActionId.idSchema, GA>[];

  // createGameHistoryComponent: (playerSeat: GameTableSeat, gameState: GS, 
  //   gameActions: BfgGameSpecificTableAction<GameTableActionId, GA>[]) => React.ReactNode;

  applyGameAction: (gameState: GS, gameAction: GA) => GameTableActionResult<GS>;

  gameStateBrandedJsonString: BfgGameTypedJson<TGameTitle>;
  gameStateJsonSchema: z.ZodSchema<GS>;

  gameActionBrandedJsonString: BfgGameTypedJson<TGameTitle>;
  gameActionJsonSchema: z.ZodSchema<GA>;
}

// export type BfgGameSpecificTableAction<GameTableActionId, TA extends z.ZodType> = {
//   gameTableActionId: GameTableActionId,
//   source: z.infer<typeof GameTableActionSourceSchema>,
//   actionType: z.infer<typeof GameTableActionTypeSchema>,
//   gameSpecificAction: z.infer<TA>;
// };

// const _parseGameActionJson = (gameActionJson: BfgGameTypedJson<TGameTitle>): GA => {
//   return gameActionSchema.parse(gameActionJson) as GA;
// }

export const createBfgGameEngineProcessor = <GS extends z.ZodType, GA extends z.ZodType>(
  gameTitle: BfgSupportedGameTitle,
  gameStateSchema: GS,
  gameActionSchema: GA,

  applyGameAction: (gameState: z.infer<GS>, gameAction: z.infer<GA>) => GameTableActionResult<z.infer<GS>>,

  createInitialGameState: (initialGameTableAction: z.infer<GA>) => z.infer<GS>,
  createInitialGameTableAction: (gameTable: NewGameTable) => z.infer<GA>,

  createGameStateRepresentationComponent: (
    myPlayerSeat: GameTableSeat,
    gameState: z.infer<GS>,
    mostRecentAction: z.infer<GA>
  ) => React.ReactNode,

  createGameStateActionInputComponent: (
    myPlayerSeat: GameTableSeat,
    gameState: z.infer<GS>, 
    mostRecentAction: z.infer<GA>,
    onGameAction: (gameState: z.infer<GS>, gameAction: z.infer<GA>) => void
  ) => React.ReactNode,

  createGameStateCombinationRepresentationAndInputComponent?: (
    myPlayerSeat: GameTableSeat,
    gameState: z.infer<GS>, 
    mostRecentAction: z.infer<GA>,
    onGameAction: (gameState: z.infer<GS>, gameAction: z.infer<GA>) => void
  ) => React.ReactNode | undefined,

): BfgGameEngineProcessor<BfgSupportedGameTitle, z.infer<GS>, z.infer<GA>> => {

  type TGameTitle = z.infer<typeof BfgSupportedGameTitlesSchema>;
  type TGameStateInferred = z.infer<GS>;
  type TGameActionInferred = z.infer<GA>;

  const createBrandedJsonValue = (obj: TGameStateInferred): BfgGameTypedJson<TGameTitle> => {
    const json = JSON.stringify(obj);
    return json as BfgGameTypedJson<TGameTitle>;
  }

  const gameStateBrandedJsonString = createBfgGameTypedJsonMetadata(gameTitle, 'game-state', gameStateSchema);
  const gameActionBrandedJsonString = createBfgGameTypedJsonMetadata(gameTitle, 'game-action', gameActionSchema);

  // const gameActionJsonBrandedSchema = z.infer<typeof gameActionBrandedJsonString>;

  // const gameSpecificTableActionSchema = createBfgGameSpecificTableActionSchema(gameActionSchema);

  // type TGameSpecificTableActionInferred = z.infer<typeof gameSpecificTableActionSchema>;


  const processor: BfgGameEngineProcessor<BfgSupportedGameTitle, z.infer<GS>, z.infer<GA>> = {
    createInitialGameState,
    createInitialGameTableAction,
    
    createGameStateJson: (obj: TGameStateInferred) => createBrandedJsonValue(obj),
    parseGameStateJson: (jsonString: BfgGameTypedJson<TGameTitle>) => {
      const json = JSON.parse(jsonString);
      return gameStateSchema.parse(json) as GS;
    },

    createGameActionJson: (obj: TGameActionInferred) => createBrandedJsonValue(obj),
    parseGameActionJson: (jsonString: BfgGameTypedJson<TGameTitle>) => {
      const json = JSON.parse(jsonString);
      return gameActionSchema.parse(json) as GA;
    },

    // narrowGameActionsToValidGameActions: (gameActions: DbGameTableAction[]): BfgGameSpecificTableAction<GameTableActionId, GA>[] => {

    //   const parsedGameActions = gameActions.map(action => {
    //     const json = JSON.parse(action.actionJson);
    //     return {
    //       gameTableAction: action,
    //       gameSpecificAction: gameActionSchema.parse(json) as GA,
    //     };
    //   });

    //   const retVal = parsedGameActions.map(parsedGameAction => {
    //     return {
    //       gameTableActionId: parsedGameAction.gameTableAction.id,
    //       source: parsedGameAction.gameTableAction.source,
    //       actionType: parsedGameAction.gameTableAction.actionType,
    //       gameSpecificAction: parsedGameAction.gameSpecificAction,
    //     };
    //   });

    //   return retVal;
    // },

    // createGameHistoryComponent: (
    //   myPlayerSeat: GameTableSeat,
    //   gameState: z.infer<GS>,
    //   gameActions: BfgGameSpecificTableAction<typeof BfgGameTableActionId.idSchema, GA>[]
    // ) => React.ReactNode,
  
  

    createGameStateRepresentationComponent,
    createGameStateActionInputComponent,
    // createGameHistoryComponent,

    createGameStateCombinationRepresentationAndInputComponent,
    applyGameAction,

    gameStateBrandedJsonString: gameStateBrandedJsonString.getBrandedSchema(),
    gameStateJsonSchema: gameStateSchema,

    gameActionBrandedJsonString: gameActionBrandedJsonString.getBrandedSchema(),
    gameActionJsonSchema: gameActionSchema,
  } as const;

  return processor;
}
