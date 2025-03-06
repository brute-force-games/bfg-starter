import { useParams } from "react-router-dom";
import { useLiveGameTable, useLiveGameTableActions } from "~/data/bfg-db-game-tables";
import { matchPlayerToSeat } from "~/data/dexie-data-ops/match-player-to-seat";
import { orderGameTableActions } from "~/data/dexie-data-ops/order-game-table-actions";
import { useBfgWhoAmIContext } from "~/state/who-am-i/BfgWhoAmIContext";
import { DbGameTableId } from "~/types/core/branded-values/branded-strings";
import { BfgGameEngineMetadata } from "~/types/game-engines/bfg-game-engines";
import { BrandedJson } from "~/types/core/branded-values/bfg-branded-json";
import { z } from "zod";
import { asPlayerMakeMove } from "~/data/dexie-data-ops/as-player-make-move";


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

  const myPlayerSeat = matchPlayerToSeat(playerId, gameTable);

  if (!myPlayerSeat) {
    return <div>You are not at this game table</div>;
  }

  const latestAction = orderedGameTableActions[orderedGameTableActions.length - 1];

  if (!latestAction) {
    return <div>No latest action found</div>;
  }

  const isItMyTurnToAct = latestAction.nextPlayersToAct.includes(myPlayerSeat);

  const gameEngineMetadata = BfgGameEngineMetadata[gameTable.gameTitle];

  if (!gameEngineMetadata) {
    return <div>No game engine metadata found</div>;
  }

  const gameState = gameEngineMetadata.parseGameStateJson(
    latestAction.actionOutcomeGameStateJson as BrandedJson<typeof gameTable.gameTitle>);

  console.log("parsed game state", gameState);

  const onGameAction = async (gameState: z.infer<typeof gameEngineMetadata.gameStateJsonSchema>, gameAction: z.infer<typeof gameEngineMetadata.gameActionJsonSchema>) => {
    const newGameState = gameEngineMetadata.applyGameAction(gameState, gameAction);
    console.log("next action - new game state", newGameState);

    await asPlayerMakeMove(gameTable.id, playerId, gameAction);
  }
  
  
  const gameRepresentationComponent = gameEngineMetadata.createGameStateRepresentationComponent(gameState);
  const gameActionInputComponent = gameEngineMetadata.createGameStateActionInputComponent(gameState, onGameAction);
  const gameCombinationRepresentationAndInputComponent = gameEngineMetadata.createGameStateCombinationRepresentationAndInputComponent(gameState, onGameAction);

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
      <div>Is it my turn to act? {isItMyTurnToAct ? "Yes" : "No"}</div>
      <div>My Seat: {myPlayerSeat}</div>
      
      {gameUserInteraction}

      <div>Game History</div>
      <div>
        {orderedGameTableActions.map(action => (
          <div key={action.id}>
            <div>Action ID: {action.id}</div>
            <div>Action Type: {action.actionType}</div>
            <div>Action Source: {action.source}</div>
            <div>Action Outcome Game State JSON: {action.actionOutcomeGameStateJson}</div>
          </div>
        ))}
      </div>

      <div>Latest action: {latestAction.id}</div>
      <div>Latest action source: {latestAction.source}</div>
      <div>Latest action type: {latestAction.actionType}</div>
    </>
  )
}
