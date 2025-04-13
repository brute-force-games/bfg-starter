import { z } from "zod";
import { useParams } from "react-router-dom";
import { useLiveGameTable, useLiveGameTableActions } from "~/data/bfg-db-game-tables";
import { orderGameTableActions } from "~/data/dexie-data-ops/order-game-table-actions";
import { useBfgWhoAmIContext } from "~/state/who-am-i/BfgWhoAmIContext";
import { DbGameTableId } from "~/types/core/branded-values/branded-strings";
import { AllBfgGameMetadata } from "~/types/bfg-game-engines/bfg-game-engines";
import { BfgGameSpecificGameStateTypedJson } from "~/types/core/branded-values/bfg-game-state-typed-json";
import { asPlayerMakeMove } from "~/data/dexie-data-ops/as-player-make-move";
import { TicTacToeActionComponent } from "~/game-engine-components/tic-tac-toe/tic-tac-toe-action-component";
import { matchPlayerToSeat } from "~/data/dexie-data-ops/player-seat-utils";
import { VerticalSpacerDiv } from "~/components/special-divs";
import { BfgGameEngineProcessor } from "~/types/bfg-game-engines/bfg-game-engines";
import { BfgGameSpecificActionSchema, BfgGameSpecificGameStateSchema } from "~/types/core/game-table/game-table-action";
import { useLiveQuery } from "dexie-react-hooks";
import { bfgDb } from "~/data/bfg-db";


export const GameTableNextActionPage = () => {

  const { gameTableId } = useParams();
  const whoAmI = useBfgWhoAmIContext();

  const dbGameTableId = gameTableId as DbGameTableId | undefined;

  const gameTable = useLiveGameTable(dbGameTableId);
  // const gameTableActions = useLiveGameTableActions(dbGameTableId);

  const gameTableActions = useLiveQuery(async () => {
    if (!dbGameTableId) {
      return undefined;
    }

    console.log("DB: useLiveGameTableActions ACTIVE", dbGameTableId);

    return await bfgDb.gameTableActions.where('gameTableId').equals(dbGameTableId).toArray();

    // const allActions = bfgDb.gameTableActions.toArray();
    // const allActionsForTable = allActions.filter((action) => action.gameTableId === dbGameTableId);
    // return allActionsForTable;
    
  }, [dbGameTableId])

  const profileId = whoAmI.defaultPlayerProfileId;

  if (!profileId) {
    return <div>No player profile id found</div>;
  }

  if (!gameTableActions) {
    return <div>No game table actions/history found</div>;
  }

  if (!gameTable) {
    return <div>No game table found</div>;
  }

  const myPlayerSeat = matchPlayerToSeat(profileId, gameTable);

  if (!myPlayerSeat) {
    return <div>You are not at this game table</div>;
  }


  // console.log("latestAction.nextPlayersToAct", latestAction.nextPlayersToAct);
  // const isItMyTurnToAct = latestAction.nextPlayersToAct.includes(myPlayerSeat);
  // const isItMyTurnToAct = gameTable.currentPlayer === myPlayerSeat;

  // console.log("isItMyTurnToAct", isItMyTurnToAct);
  // console.log("nextPlayersToAct", latestAction.nextPlayersToAct);

  const gameEngineMetadata = AllBfgGameMetadata[gameTable.gameTitle];

  const gameEngine = gameEngineMetadata.processor as BfgGameEngineProcessor<
    // typeof gameTable.gameTitle,
    // z.infer<typeof gameEngineMetadata.processor["gameStateJsonSchema"]>,
    // z.infer<typeof gameEngineMetadata.processor["gameActionJsonSchema"]>
    GameStateType,
    GameActionType
  >;

  if (!gameEngine) {
    return <div>No game engine found</div>;
  }

  type GameStateType = z.infer<typeof gameEngineMetadata.processor["gameStateJsonSchema"]>;
  type GameActionType = z.infer<typeof gameEngineMetadata.processor["gameActionJsonSchema"]>;

  // const validGameActions = gameEngineMetadata.processor
  //   .narrowGameActionsToValidGameActions(gameTableActions);


  // const narrowGameActionsToValidGameActions = (
  //   gameActions: z.infer<typeof gameEngineMetadata.processor["gameActionJsonSchema"]>[]
  // ): z.infer<typeof gameEngineMetadata.processor["gameActionJsonSchema"]>[] => {
  //   return gameActions.filter(action => {
  //     return (
  //       (action.actionType === "game-table-action-player-move" && 
  //        action.moveCell && 
  //        action.movePlayer) || 
  //       (action.actionType === "game-table-action-host-setup-board" && 
  //        action.board)
  //     );
  //   });
  // }

  // const validGameActions = narrowGameActionsToValidGameActions(gameTableActions);

  const toProcessGameTableActions = gameTableActions;

  console.log("gameTable - next action page", gameTable);
  const orderedGameTableActions = orderGameTableActions(toProcessGameTableActions);
  console.log("orderedGameTableActions", orderedGameTableActions);

  const latestAction = orderedGameTableActions[orderedGameTableActions.length - 1];

  if (!latestAction) {
    return <div>No latest action found</div>;
  }



  console.log("latestAction.actionOutcomeGameStateJson", latestAction.actionOutcomeGameStateJson);

  const onGameAction = async <
    GameSpecificState extends z.infer<typeof BfgGameSpecificGameStateSchema>,
    GameSpecificAction extends z.infer<typeof BfgGameSpecificActionSchema>
  >(
    // _gameState: z.infer<typeof gameEngine.gameStateJsonSchema>,
    // gameAction: z.infer<typeof gameEngine.gameActionJsonSchema>
    _gameState: GameSpecificState,
    gameAction: GameSpecificAction
  ) => {
    await asPlayerMakeMove(gameTable.id, profileId, gameAction);
  }
  
  // const gameState = gameEngine.parseGameStateJson(
  //   latestAction.actionOutcomeGameStateJson as BfgGameTypedJson<typeof gameTable.gameTitle>);

  console.log("latestAction.actionOutcomeGameStateJson", latestAction.actionOutcomeGameStateJson);

  const gameSpecificState = gameEngine.parseGameSpecificGameStateJson(
    latestAction.actionOutcomeGameStateJson as BfgGameSpecificGameStateTypedJson<typeof gameTable.gameTitle>);

  const latestGameSpecificAction = gameEngine.parseGameSpecificActionJson(
    latestAction.actionJson as BfgGameSpecificGameStateTypedJson<typeof gameTable.gameTitle>);

  console.log("parsed game state", gameSpecificState);


  const gameRepresentationComponent = gameEngine.createGameStateRepresentationComponent(myPlayerSeat, gameSpecificState, latestGameSpecificAction);
  const gameActionInputComponent = gameEngine.createGameStateActionInputComponent(myPlayerSeat, gameSpecificState, latestGameSpecificAction, onGameAction);
  
  const gameCombinationRepresentationAndInputComponent = gameEngine
    .createGameStateCombinationRepresentationAndInputComponent ?
    gameEngine.createGameStateCombinationRepresentationAndInputComponent(myPlayerSeat, gameSpecificState, latestGameSpecificAction, onGameAction) : 
    undefined;
    

  const validGameActions = gameEngine.narrowGameActionsToValidGameActions(orderedGameTableActions);

  const gameHistoryComponent = gameEngine.createGameHistoryComponent ?
    gameEngine.createGameHistoryComponent(myPlayerSeat, gameSpecificState, validGameActions) :
    undefined;


  const gameUserInteraction = 
    gameCombinationRepresentationAndInputComponent ?
      <>
        {gameCombinationRepresentationAndInputComponent}
      </>
      :
      <>
        {gameRepresentationComponent}
        {gameActionInputComponent}
      </>


  return (
    <>
      <VerticalSpacerDiv height={20} />
      
      {gameUserInteraction}

      <div>Game History [{orderedGameTableActions.length}]</div>
      {gameHistoryComponent}
      
      <div>
        {orderedGameTableActions.map(action => (
          <TicTacToeActionComponent
            myPlayerSeat={myPlayerSeat}
            key={action.id}
            gameTable={gameTable}
            action={action}
          />
        ))}
      </div>
    </>
  )
}
