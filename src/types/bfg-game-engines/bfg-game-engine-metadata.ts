import React from "react";
import { z } from "zod";
import { DbGameTable, NewGameTable } from "../core/game-table/game-table";
import { GameTableSeat } from "../core/game-table/game-table";
import { GameTableActionResult } from "../core/game-table/table-phase";
import { AbfgSupportedGameTitle } from "./supported-games";
import { DbGameTableAction } from "../core/game-table/game-table-action";
import { BfgGameSpecificTableAction } from "../core/game-table/game-table-action";
import { BfgGameEngineProcessor } from "./bfg-game-engines";
import { BfgGameSpecificActionJsonString, BfgGameSpecificGameStateJsonString } from "../core/branded-values/bfg-game-state-typed-json";


export interface IBfgGameEngineProcessor<
  GS extends z.ZodTypeAny,
  GA extends z.ZodTypeAny
> {

  gameTitle: AbfgSupportedGameTitle,

  applyGameAction: (
    tableState: DbGameTable,
    gameState: z.infer<GS>,
    gameAction: z.infer<GA>
  ) => GameTableActionResult<z.infer<GS>>,

  createInitialGameSpecificState: (initialGameSpecificAction: z.infer<GA>) => z.infer<GS>,
  createInitialGameTableAction: (gameTable: NewGameTable) => BfgGameSpecificTableAction<z.infer<GA>>,

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

  createGameHistoryComponent?: (
    myPlayerSeat: GameTableSeat,
    gameState: z.infer<GS>,
    gameActions: BfgGameSpecificTableAction<z.infer<GA>>[]
  ) => React.ReactNode,
}


export const createBfgGameEngineProcessor = <
  GS extends z.ZodTypeAny,
  GA extends z.ZodTypeAny
>(
  gameTitle: AbfgSupportedGameTitle,
  gameStateSchema: GS,
  gameActionSchema: GA,
  processorImplementation: IBfgGameEngineProcessor<GS, GA>,

): BfgGameEngineProcessor<GS, GA> => {

  type TGameStateInferred = z.infer<GS>;
  type TGameActionInferred = z.infer<GA>;

  const createBrandedGameStateJsonValue = (obj: TGameStateInferred): BfgGameSpecificGameStateJsonString => {
    const json = JSON.stringify(obj);
    console.log("createBrandedGameStateJsonValue", json);
    const retVal = {
      bfgGameTitle: gameTitle,
      bfgGameDataJsonType: 'game-state',
      jsonString: json,
    } as BfgGameSpecificGameStateJsonString;
    return retVal;
  }

  const createBrandedGameActionJsonValue = (obj: TGameActionInferred): BfgGameSpecificActionJsonString => {
    const json = JSON.stringify(obj);
    const retVal = {
      bfgGameTitle: gameTitle,
      bfgGameDataJsonType: 'game-action',
      jsonString: json,
    } as BfgGameSpecificActionJsonString;
    return retVal;
  }


  const createBfgInitialGameState = (initialGameTableAction: BfgGameSpecificTableAction<GA>): GameTableActionResult<GS> => {
    const initialGameSpecificState = processorImplementation.createInitialGameSpecificState(initialGameTableAction.gameSpecificAction);
    
    return initialGameSpecificState;
  }


  const narrowGameActionsToValidGameActions = (gameActions: DbGameTableAction[]): BfgGameSpecificTableAction<GA>[] => {

    const retVal: BfgGameSpecificTableAction<GA>[] = [];

    for (const gameAction of gameActions) {

      const gameSpecificActionJson = JSON.parse(gameAction.actionJson);
      const parsedGameSpecificAction = gameActionSchema.parse(gameSpecificActionJson);

      const bfgAction: BfgGameSpecificTableAction<GA> = {
        gameTableActionId: gameAction.id,
        source: gameAction.source,
        actionType: gameAction.actionType,
        gameSpecificAction: parsedGameSpecificAction,
      };

      retVal.push(bfgAction);
    }

    return retVal;
  }


  const processor: BfgGameEngineProcessor<z.infer<GS>, z.infer<GA>> = {

    ...processorImplementation,

    createBfgInitialGameSpecificState: createBfgInitialGameState,
    createBfgGameSpecificInitialGameTableAction: processorImplementation.createInitialGameTableAction,

    createGameSpecificGameStateJson: (obj: TGameStateInferred) => createBrandedGameStateJsonValue(obj),
    parseGameSpecificGameStateJson: (gameTypeJson: BfgGameSpecificGameStateJsonString) => {

      console.log("parseGameSpecificGameStateJson", gameTypeJson);
      const json = JSON.parse(gameTypeJson.jsonString);
      return gameStateSchema.parse(json) as GS;
    },

    createGameSpecificActionJson: (obj: TGameActionInferred) => createBrandedGameActionJsonValue(obj),
    parseGameSpecificActionJson: (gameTypeJson: BfgGameSpecificActionJsonString) => {
      const json = JSON.parse(gameTypeJson.jsonString);
      return gameActionSchema.parse(json) as GA;
    },

    narrowGameActionsToValidGameActions,

    gameStateSchema: gameStateSchema,

    gameActionSchema: gameActionSchema,
  } as const;

  return processor;
}
