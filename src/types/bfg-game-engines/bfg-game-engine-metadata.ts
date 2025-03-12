import React from "react";
import { z } from "zod";
import { DbGameTable, NewGameTable } from "../core/game-table/game-table";
import { BfgGameTypedJson, createBfgGameTypedJsonMetadata } from "../core/branded-values/bfg-game-typed-json";
import { GameTableSeat } from "../core/game-table/game-table";
import { GameTableActionResult } from "../core/game-table/table-phase";
import { AbfgSupportedGameTitle } from "./supported-games";
import { BfgGameSpecificAction, BfgGameSpecificGameState, DbGameTableAction } from "../core/game-table/game-table-action";
import { BfgGameSpecificTableAction } from "../core/game-table/game-table-action";
import { BfgGameEngineProcessor } from "./bfg-game-engines";


export interface IBfgGameEngineProcessor<
  // GS, GA
  GS extends BfgGameSpecificGameState,
  GA extends BfgGameSpecificAction,
  // GS extends z.ZodType,
  // GA extends z.ZodType,
  // GS extends z.infer<typeof BfgGameSpecificGameStateSchema>,
  // GA extends z.infer<typeof BfgGameSpecificActionSchema>
> {

  gameTitle: AbfgSupportedGameTitle,
  // gameStateSchema: z.ZodObject<GS>,
  // gameActionSchema: z.ZodObject<GA>,

  applyGameAction: (tableState: DbGameTable, gameState: GS, gameAction: GA) => GameTableActionResult<GS>,

  createInitialGameSpecificState: (initialGameSpecificAction: GA) => GameTableActionResult<GS>,
  createInitialGameTableAction: (gameTable: NewGameTable) => BfgGameSpecificTableAction<GA>,

  createGameStateRepresentationComponent: (
    myPlayerSeat: GameTableSeat,
    gameState: GS,
    mostRecentAction: GA
  ) => React.ReactNode,

  createGameStateActionInputComponent: (
    myPlayerSeat: GameTableSeat,
    gameState: GS, 
    mostRecentAction: GA,
    onGameAction: (gameState: GS, gameAction: GA) => void
  ) => React.ReactNode,

  createGameStateCombinationRepresentationAndInputComponent?: (
    myPlayerSeat: GameTableSeat,
    gameState: GS, 
    mostRecentAction: GA,
    onGameAction: (gameState: GS, gameAction: GA) => void
  ) => React.ReactNode | undefined,

  createGameHistoryComponent?: (
    myPlayerSeat: GameTableSeat,
    gameState: GS,
    gameActions: BfgGameSpecificTableAction<GA>[]
  ) => React.ReactNode,

  // narrowGameActionsToValidGameActions?: (gameActions: DbGameTableAction[]) => BfgGameSpecificTableAction<GA>[];



  // createInitialGameState: (initialGameTableAction: GA) => GS;  // for tic-tac-toe, this is the empty board
  // createInitialGameTableAction: (gameTable: NewGameTable) => GA;  // for tic-tac-toe, this is creating the board
  // // createInitialGameTableAction: (gameTable: NewGameTable) => GA;  // for tic-tac-toe, this is creating the board
  // // createNextPlayersToAct: (gameAction: GA, gameState: GS) => GameTableSeat[];  // for tic-tac-toe, this is ping-ponging between players
}





// export type BfgGameEngineProcessor<
//   TGameTitle extends z.infer<typeof BfgSupportedGameTitlesSchema>, 
//   GS extends z.ZodType, 
//   GA extends z.ZodType
// > = {
//   createInitialGameState: (initialGameTableAction: GA) => GS;  // for tic-tac-toe, this is the empty board
//   createInitialGameTableAction: (gameTable: NewGameTable) => GA;  // for tic-tac-toe, this is creating the board
//   // createInitialGameTableAction: (gameTable: NewGameTable) => GA;  // for tic-tac-toe, this is creating the board
//   // createNextPlayersToAct: (gameAction: GA, gameState: GS) => GameTableSeat[];  // for tic-tac-toe, this is ping-ponging between players

//   createGameStateJson: (gameState: GS) => BfgGameTypedJson<TGameTitle>;  // this creates the representation of the board as JSON
//   parseGameStateJson: (jsonString: BfgGameTypedJson<TGameTitle>) => GS;  // this parses the JSON back into the game state

//   createGameActionJson: (gameAction: GA) => BfgGameTypedJson<TGameTitle>;  // this creates the representation of the game action as JSON
//   parseGameActionJson: (jsonString: BfgGameTypedJson<TGameTitle>) => GA;  // this parses the JSON back into the game action

//   createGameStateRepresentationComponent: (playerSeat: GameTableSeat, gameState: GS, mostRecentAction: GA) => React.ReactNode;
//   createGameStateActionInputComponent: (playerSeat: GameTableSeat, gameState: GS, mostRecentAction: GA, onGameAction: (gameState: GS, gameAction: GA) => void) => React.ReactNode;
//   createGameStateCombinationRepresentationAndInputComponent?: (playerSeat: GameTableSeat, gameState: GS, mostRecentAction: GA, onGameAction: (gameState: GS, gameAction: GA) => void) => React.ReactNode | undefined,
  
//   // // narrowGameActionsToValidGameActions: (gameActions: DbGameTableAction[]) => GA[];
//   narrowGameActionsToValidGameActions: (gameActions: DbGameTableAction[]) => BfgGameSpecificTableAction<GA>[];

//   createGameHistoryComponent: (playerSeat: GameTableSeat, gameState: GS, 
//     gameActions: BfgGameSpecificTableAction<GA>[]) => React.ReactNode;

//   applyGameAction: (gameState: GS, gameAction: GA) => GameTableActionResult<GS>;

//   gameStateBrandedJsonString: BfgGameTypedJson<TGameTitle>;
//   gameStateJsonSchema: z.ZodSchema<GS>;

//   gameActionBrandedJsonString: BfgGameTypedJson<TGameTitle>;
//   gameActionJsonSchema: z.ZodSchema<GA>;
// }

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
  gameTitle: AbfgSupportedGameTitle,
  gameStateSchema: GS,
  gameActionSchema: GA,
  processorImplementation: IBfgGameEngineProcessor<GS, GA>,

): BfgGameEngineProcessor<z.infer<GS>, z.infer<GA>> => {

  // type TGameTitle = z.infer<typeof BfgSupportedGameTitlesSchema>;
  type TGameStateInferred = z.infer<GS>;
  type TGameActionInferred = z.infer<GA>;

  const createBrandedJsonValue = (obj: TGameStateInferred): BfgGameTypedJson<AbfgSupportedGameTitle> => {
    const json = JSON.stringify(obj);
    return json as BfgGameTypedJson<AbfgSupportedGameTitle>;
  }


  // // Type narrowing for game title
  // const isTicTacToe = (title: TheBfgGameTitle): title is "Tic Tac Toe" => title === "Tic Tac Toe";
  // const isFlipACoin = (title: TheBfgGameTitle): title is "Flip a Coin" => title === "Flip a Coin";

  // Use the type guards to ensure correct branding
  // const gameStateBrandedJsonString = isTicTacToe(gameTitle)
  //   ? createBfgGameTypedJsonMetadata(gameTitle, 'game-state', gameStateSchema)
  //   : isFlipACoin(gameTitle)
  //   ? createBfgGameTypedJsonMetadata(gameTitle, 'game-state', gameStateSchema)
  //   : createBfgGameTypedJsonMetadata(gameTitle, 'game-state', gameStateSchema); // Handle other cases if needed

  const gameStateBrandedJsonString = createBfgGameTypedJsonMetadata(gameTitle, 'game-state', gameStateSchema);

  const gameActionBrandedJsonString = createBfgGameTypedJsonMetadata(gameTitle, 'game-action', gameActionSchema);

  // const gameActionJsonBrandedSchema = z.infer<typeof gameActionBrandedJsonString>;

  // const gameSpecificTableActionSchema = createBfgGameSpecificTableActionSchema(gameActionSchema);

  // type TGameSpecificTableActionInferred = z.infer<typeof gameSpecificTableActionSchema>;


  // const createInitialGameState = processorImplementation.createInitialGameState;


  const createBfgInitialGameState = (initialGameTableAction: BfgGameSpecificTableAction<GA>): GameTableActionResult<GS> => {
    const initialGameState = processorImplementation.createInitialGameSpecificState(initialGameTableAction.gameSpecificAction);
    return initialGameState;
  }


  const narrowGameActionsToValidGameActions = (gameActions: DbGameTableAction[]): BfgGameSpecificTableAction<GA>[] => {
    // return processorImplementation.narrowGameActionsToValidGameActions(gameActions);

    const retVal: BfgGameSpecificTableAction<GA>[] = [];

    for (const gameAction of gameActions) {

      // const gameSpecificAction = gameAction.gameSpecificAction;
      const parsedGameSpecificAction = gameActionSchema.parse(gameAction.actionJson);

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
    // createInitialGameState: processorImplementation.createInitialGameState,
    // createInitialGameTableAction: processorImplementation.createInitialGameTableAction,

    ...processorImplementation,

    createBfgInitialGameState,
    createBfgGameSpecificInitialGameTableAction: processorImplementation.createInitialGameTableAction,



    createGameSpecificStateJson: (obj: TGameStateInferred) => createBrandedJsonValue(obj),
    parseGameSpecificStateJson: (jsonString: BfgGameTypedJson<AbfgSupportedGameTitle>) => {
      const json = JSON.parse(jsonString);
      return gameStateSchema.parse(json) as GS;
    },

    createGameSpecificActionJson: (obj: TGameActionInferred) => createBrandedJsonValue(obj),
    parseGameSpecificActionJson: (jsonString: BfgGameTypedJson<AbfgSupportedGameTitle>) => {
      const json = JSON.parse(jsonString);
      return gameActionSchema.parse(json) as GA;
    },

    narrowGameActionsToValidGameActions,

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
  
  

    // createGameStateRepresentationComponent,
    // createGameStateActionInputComponent,
    // createGameHistoryComponent,

    // createGameStateCombinationRepresentationAndInputComponent,
    // applyGameAction,

    gameStateBrandedJsonString: gameStateBrandedJsonString.getBrandedSchema(),
    gameStateJsonSchema: gameStateSchema,

    gameActionBrandedJsonString: gameActionBrandedJsonString.getBrandedSchema(),
    gameActionJsonSchema: gameActionSchema,
  } as const;

  return processor;
}

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
