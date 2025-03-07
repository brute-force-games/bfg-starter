import { z } from "zod";
import { useParams } from "react-router-dom";
import { useLiveGameTable, useLiveGameTableActions } from "~/data/bfg-db-game-tables";
import { matchPlayerToSeat } from "~/data/dexie-data-ops/match-player-to-seat";
import { orderGameTableActions } from "~/data/dexie-data-ops/order-game-table-actions";
import { useBfgWhoAmIContext } from "~/state/who-am-i/BfgWhoAmIContext";
import { DbGameTableId } from "~/types/core/branded-values/branded-strings";
import { BfgGameEngineMetadata } from "~/types/game-engines/bfg-game-engines";
import { BrandedJson } from "~/types/core/branded-values/bfg-branded-json";
import { asPlayerMakeMove } from "~/data/dexie-data-ops/as-player-make-move";
import { TicTacToeActionComponent } from "~/game-engine-components/tic-tac-toe/tic-tac-toe-action-component";
import { getPlayerSeatSymbol } from "~/types/game-engines/tic-tac-toe-engine";


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

  const gameEngineMetadata = BfgGameEngineMetadata[gameTable.gameTitle];

  if (!gameEngineMetadata) {
    return <div>No game engine metadata found</div>;
  }

  console.log("latestAction.actionOutcomeGameStateJson", latestAction.actionOutcomeGameStateJson);

  const gameState = gameEngineMetadata.parseGameStateJson(
    latestAction.actionOutcomeGameStateJson as BrandedJson<typeof gameTable.gameTitle>);

  console.log("parsed game state", gameState);

  const onGameAction = async (
    gameState: z.infer<typeof gameEngineMetadata.gameStateJsonSchema>,
    gameAction: z.infer<typeof gameEngineMetadata.gameActionJsonSchema>
  ) => {
  
    // const gameResult = gameEngineMetadata.applyGameAction(gameState, gameAction);
    // console.log("after action - game result", gameResult);

    await asPlayerMakeMove(gameTable.id, playerId, gameAction);
  }
  
  
  const gameRepresentationComponent = gameEngineMetadata.createGameStateRepresentationComponent(myPlayerSeat, gameState);
  const gameActionInputComponent = gameEngineMetadata.createGameStateActionInputComponent(myPlayerSeat, gameState, onGameAction);
  const gameCombinationRepresentationAndInputComponent = gameEngineMetadata.createGameStateCombinationRepresentationAndInputComponent(myPlayerSeat, gameState, onGameAction);

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
