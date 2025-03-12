import React from "react";
import { z } from "zod";
import { DbGameTable, NewGameTable } from "../core/game-table/game-table";
import { BfgGameSpecificGameStateTypedJson, createBfgGameTypedJsonMetadata } from "../core/branded-values/bfg-game-state-typed-json";
import { GameTableSeat } from "../core/game-table/game-table";
import { GameTableActionResult } from "../core/game-table/table-phase";
import { AbfgSupportedGameTitle } from "./supported-games";
import { DbGameTableAction } from "../core/game-table/game-table-action";
import { BfgGameSpecificTableAction } from "../core/game-table/game-table-action";
import { BfgGameEngineProcessor } from "./bfg-game-engines";


export interface IBfgGameEngineProcessor<
  // GS, GA
  // GS extends BfgGameSpecificGameState,
  // GA extends BfgGameSpecificAction,
  // GS extends z.ZodType,
  // GA extends z.ZodType,
  GS extends z.ZodSchema,
  GA extends z.ZodSchema
> {

  gameTitle: AbfgSupportedGameTitle,
  // gameStateSchema: z.ZodObject<GS>,
  // gameActionSchema: z.ZodObject<GA>,

  // type GS = z.infer<typeof GSZ>,
  // type GA = z.infer<typeof GAZ>,

  applyGameAction: (
    tableState: DbGameTable,
    gameState: z.infer<GS>,
    gameAction: z.infer<GA>
  ) => GameTableActionResult<z.infer<GS>>,

  // createInitialGameSpecificState: (initialGameSpecificAction: z.infer<GA>) => GameTableActionResult<z.infer<GS>>,
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

export const createBfgGameEngineProcessor = <
  // GS extends z.infer<typeof BfgGameSpecificGameStateSchema>, 
  // GA extends z.infer<typeof BfgGameSpecificActionSchema>
  // GS extends z.ZodSchema<typeof BfgGameSpecificGameStateSchema>,
  // GA extends z.ZodSchema<typeof BfgGameSpecificActionSchema>
  GS extends z.ZodSchema,
  GA extends z.ZodSchema
>(
  gameTitle: AbfgSupportedGameTitle,
  gameStateSchema: GS,
  gameActionSchema: GA,
  processorImplementation: IBfgGameEngineProcessor<GS, GA>,

): BfgGameEngineProcessor<GS, GA> => {

  // type TGameTitle = z.infer<typeof BfgSupportedGameTitlesSchema>;
  // type TGameStateInferred = z.infer<GS>;
  // type TGameActionInferred = z.infer<GA>;

  type TGameStateInferred = GS;
  type TGameActionInferred = GA;

  const createBrandedGameStateJsonValue = (obj: TGameStateInferred): BfgGameSpecificGameStateTypedJson<AbfgSupportedGameTitle> => {
    const json = JSON.stringify(obj);
    console.log("createBrandedGameStateJsonValue", json);
    return json as BfgGameSpecificGameStateTypedJson<AbfgSupportedGameTitle>;
  }

  const createBrandedGameActionJsonValue = (obj: TGameActionInferred): BfgGameSpecificGameStateTypedJson<AbfgSupportedGameTitle> => {
    const json = JSON.stringify(obj);
    return json as BfgGameSpecificGameStateTypedJson<AbfgSupportedGameTitle>;
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
    const initialGameSpecificState = processorImplementation.createInitialGameSpecificState(initialGameTableAction.gameSpecificAction);
    
    return initialGameSpecificState;


    // const initialGameState: GameTableActionResult<GS> = {
    //   gameSpecificState: initialGameSpecificState,
    //   tablePhase: 'table-phase-game-in-progress',
    //   gameSpecificStateSummary: `Game started with board: ${initialGameSpecificState.board}`,
    // };
    
    // return initialGameState;
  }


  const narrowGameActionsToValidGameActions = (gameActions: DbGameTableAction[]): BfgGameSpecificTableAction<GA>[] => {
    // return processorImplementation.narrowGameActionsToValidGameActions(gameActions);

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
    parseGameSpecificGameStateJson: (jsonString: BfgGameSpecificGameStateTypedJson<AbfgSupportedGameTitle>) => {

      console.log("parseGameSpecificGameStateJson", jsonString);
      const json = JSON.parse(jsonString);
      return gameStateSchema.parse(json) as GS;
    },

    createGameSpecificActionJson: (obj: TGameActionInferred) => createBrandedGameActionJsonValue(obj),
    parseGameSpecificActionJson: (jsonString: BfgGameSpecificGameStateTypedJson<AbfgSupportedGameTitle>) => {
      const json = JSON.parse(jsonString);
      return gameActionSchema.parse(json) as GA;
    },

    narrowGameActionsToValidGameActions,

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
