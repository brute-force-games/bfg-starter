import { z } from "zod";
import { useParams } from "react-router-dom";
import { useLiveGameTable, useLiveGameTableActions } from "~/data/bfg-db-game-tables";
import { matchPlayerToSeat } from "~/data/dexie-data-ops/match-player-to-seat";
import { orderGameTableActions } from "~/data/dexie-data-ops/order-game-table-actions";
import { useBfgWhoAmIContext } from "~/state/who-am-i/BfgWhoAmIContext";
import { DbGameTableId } from "~/types/core/branded-values/branded-strings";
import { BfgGameEngineMetadata } from "~/types/bfg-game-engines/bfg-game-engines";
import { BfgGameTypedJson } from "~/types/core/branded-values/bfg-game-typed-json";
import { asPlayerMakeMove } from "~/data/dexie-data-ops/as-player-make-move";
import { TicTacToeActionComponent } from "~/game-engine-components/tic-tac-toe/tic-tac-toe-action-component";
import { getPlayerSeatSymbol } from "~/types/bfg-game-engines/tic-tac-toe-engine";
import { BfgGameEngineProcessor } from "~/types/bfg-game-engines/bfg-game-engine-metadata";
// import { BfgSupportedGameTitle } from "~/types/bfg-game-engines/supported-games";


export const GameTableNextActionPage = () => {

  const { gameTableId } = useParams();
  const whoAmI = useBfgWhoAmIContext();

  const gameTable = useLiveGameTable(gameTableId as DbGameTableId);
  const gameTableActions = useLiveGameTableActions(gameTableId as DbGameTableId);

  const playerId = whoAmI.playerId;

  if (!playerId) {
    return <div>No player id found</div>;
  }

  if (!gameTableActions) {
    return <div>No game table actions found</div>;
  }

  if (!gameTable) {
    return <div>No game table found</div>;
  }

  console.log("gameTable - next action page", gameTable);
  const orderedGameTableActions = orderGameTableActions(gameTableActions);
  console.log("orderedGameTableActions", orderedGameTableActions);

  const myPlayerSeat = matchPlayerToSeat(playerId, gameTable);

  if (!myPlayerSeat) {
    return <div>You are not at this game table</div>;
  }

  const latestAction = orderedGameTableActions[orderedGameTableActions.length - 1];

  if (!latestAction) {
    return <div>No latest action found</div>;
  }

  // console.log("latestAction.nextPlayersToAct", latestAction.nextPlayersToAct);
  // const isItMyTurnToAct = latestAction.nextPlayersToAct.includes(myPlayerSeat);
  // const isItMyTurnToAct = gameTable.currentPlayer === myPlayerSeat;

  // console.log("isItMyTurnToAct", isItMyTurnToAct);
  // console.log("nextPlayersToAct", latestAction.nextPlayersToAct);

  const gameEngineMetadata = BfgGameEngineMetadata[gameTable.gameTitle] as BfgGameEngineProcessor<
    z.infer<typeof BfgGameEngineMetadata[typeof gameTable.gameTitle]["gameStateJsonSchema"]>,
    z.infer<typeof BfgGameEngineMetadata[typeof gameTable.gameTitle]["gameActionJsonSchema"]>,
    typeof gameTable.gameTitle
  >;

  if (!gameEngineMetadata) {
    return <div>No game engine metadata found</div>;
  }

  console.log("latestAction.actionOutcomeGameStateJson", latestAction.actionOutcomeGameStateJson);

  const onGameAction = async (
    _gameState: z.infer<typeof gameEngineMetadata.gameStateJsonSchema>,
    gameAction: z.infer<typeof gameEngineMetadata.gameActionJsonSchema>
  ) => {
  
    await asPlayerMakeMove(gameTable.id, playerId, gameAction);
  }
  
  const gameState = gameEngineMetadata.parseGameStateJson(
    latestAction.actionOutcomeGameStateJson as BfgGameTypedJson<typeof gameTable.gameTitle>);

  console.log("parsed game state", gameState);

  
  const gameRepresentationComponent = gameEngineMetadata.createGameStateRepresentationComponent(myPlayerSeat, gameState);
  const gameActionInputComponent = gameEngineMetadata.createGameStateActionInputComponent(myPlayerSeat, gameState, onGameAction);
  const gameCombinationRepresentationAndInputComponent = gameEngineMetadata.createGameStateCombinationRepresentationAndInputComponent ?
    gameEngineMetadata.createGameStateCombinationRepresentationAndInputComponent(myPlayerSeat, gameState, onGameAction) : undefined;

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

  const myPlayerSeatSymbol = getPlayerSeatSymbol(myPlayerSeat);


  return (
    <>
      {/* <div>Is it my turn to act? {isItMyTurnToAct ? "Yes" : "No"}</div> */}
      <div>My Seat: {myPlayerSeat} [{myPlayerSeatSymbol}]</div>
      
      {gameUserInteraction}

      <div>Game History [{orderedGameTableActions.length}]</div>
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
