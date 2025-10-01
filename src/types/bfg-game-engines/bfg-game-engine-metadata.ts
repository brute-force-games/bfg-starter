import React from "react";
import { z } from "zod";
import { BfgGameSpecificGameStateTypedJson, createBfgGameTypedJsonMetadata } from "../core/branded-values/bfg-game-state-typed-json";
import { GameTable, GameTableSeat } from "../../models/game-table/game-table";
import { GameTableActionResult } from "../../models/game-table/table-phase";
import { AbfgSupportedGameTitle } from "./supported-games";
import { BfgGameSpecificTableAction } from "../../models/game-table/game-table-action";
import { BfgGameEngineProcessor } from "./bfg-game-engines";


export interface IBfgGameEngineProcessor<
  GS extends z.ZodTypeAny,
  GA extends z.ZodTypeAny
> {

  gameTitle: AbfgSupportedGameTitle,

  applyGameAction: (
    tableState: GameTable,
    gameState: z.infer<GS>,
    gameAction: z.infer<GA>
  ) => GameTableActionResult<z.infer<GS>>,

  createInitialGameSpecificState: (initialGameSpecificAction: z.infer<GA>) => z.infer<GS>,
  createInitialGameTableAction: (gameTable: GameTable) => BfgGameSpecificTableAction<z.infer<GA>>,

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

  const createBrandedGameStateJsonValue = (obj: TGameStateInferred): BfgGameSpecificGameStateTypedJson<AbfgSupportedGameTitle> => {
    const json = JSON.stringify(obj);
    console.log("createBrandedGameStateJsonValue", json);
    return json as BfgGameSpecificGameStateTypedJson<AbfgSupportedGameTitle>;
  }

  const createBrandedGameActionJsonValue = (obj: TGameActionInferred): BfgGameSpecificGameStateTypedJson<AbfgSupportedGameTitle> => {
    const json = JSON.stringify(obj);
    return json as BfgGameSpecificGameStateTypedJson<AbfgSupportedGameTitle>;
  }

  const gameStateBrandedJsonString = createBfgGameTypedJsonMetadata(gameTitle, 'game-state', gameStateSchema);
  const gameActionBrandedJsonString = createBfgGameTypedJsonMetadata(gameTitle, 'game-action', gameActionSchema);

  const createBfgInitialGameState = (initialGameTableAction: BfgGameSpecificTableAction<GA>): GameTableActionResult<GS> => {
    const initialGameSpecificState = processorImplementation.createInitialGameSpecificState(initialGameTableAction.gameSpecificAction);
    
    return initialGameSpecificState;
  }


  // const narrowGameActionsToValidGameActions = (gameActions: DbGameTableAction[]): BfgGameSpecificTableAction<GA>[] => {

  //   const retVal: BfgGameSpecificTableAction<GA>[] = [];

  //   for (const gameAction of gameActions) {

  //     const gameSpecificActionJson = JSON.parse(gameAction.actionJson);
  //     const parsedGameSpecificAction = gameActionSchema.parse(gameSpecificActionJson);

  //     const bfgAction: BfgGameSpecificTableAction<GA> = {
  //       gameTableActionId: gameAction.id,
  //       source: gameAction.source,
  //       actionType: gameAction.actionType,
  //       gameSpecificAction: parsedGameSpecificAction,
  //     };

  //     retVal.push(bfgAction);
  //   }

  //   return retVal;
  // }


  const processor: BfgGameEngineProcessor<z.infer<GS>, z.infer<GA>> = {

    ...processorImplementation,

    createBfgInitialGameSpecificState: createBfgInitialGameState,
    createBfgGameSpecificInitialGameTableAction: processorImplementation.createInitialGameTableAction,

    createGameSpecificGameStateJson: (obj: TGameStateInferred) => createBrandedGameStateJsonValue(obj),
    parseGameSpecificGameStateJson: (jsonString: BfgGameSpecificGameStateTypedJson<AbfgSupportedGameTitle>) => {

      // console.log("parseGameSpecificGameStateJson", jsonString);
      const json = JSON.parse(jsonString);
      return gameStateSchema.parse(json) as GS;
    },

    createGameSpecificActionJson: (obj: TGameActionInferred) => createBrandedGameActionJsonValue(obj),
    parseGameSpecificActionJson: (jsonString: BfgGameSpecificGameStateTypedJson<AbfgSupportedGameTitle>) => {
      const json = JSON.parse(jsonString);
      return gameActionSchema.parse(json) as GA;
    },

    // narrowGameActionsToValidGameActions,

    gameStateBrandedJsonString: gameStateBrandedJsonString.getBrandedSchema(),
    gameStateJsonSchema: gameStateSchema,

    gameActionBrandedJsonString: gameActionBrandedJsonString.getBrandedSchema(),
    gameActionJsonSchema: gameActionSchema,
  } as const;

  return processor;
}
