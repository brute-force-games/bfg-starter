import { z } from "zod";
import { GameTable, GameTableSeat } from "~/models/game-table/game-table";
import { BfgGameSpecificGameStateTypedJson } from "~/types/core/branded-values/bfg-game-state-typed-json";
import { DbGameTableAction } from "~/models/game-table/game-table-action";
import { AllBfgGameMetadata, BfgGameEngineProcessor } from "~/types/bfg-game-engines/bfg-game-engines";
import { asPlayerMakeMove } from "~/data/game-table-ops/as-player-make-move";
import { PrivatePlayerProfile } from "~/models/private-player-profile";
import { PlayerP2pGameMove } from "~/models/p2p-details";


interface HostedGameViewProps {
  myPlayerSeat: GameTableSeat;
  myPlayerProfile: PrivatePlayerProfile;
  hostedGame: GameTable;
  gameActions: DbGameTableAction[];
  
  onPlayerGameAction: (playerAction: PlayerP2pGameMove) => void
}

export const HostedGameView = (props: HostedGameViewProps) => {
  const { myPlayerSeat, myPlayerProfile, hostedGame, gameActions, onPlayerGameAction } = props;

  const latestAction = gameActions[gameActions.length - 1];
  const gameTitle = hostedGame.gameTitle;

  const gameMetadata = AllBfgGameMetadata[gameTitle];
  const gameEngine = gameMetadata.processor as BfgGameEngineProcessor<
    z.infer<typeof gameMetadata.processor["gameStateJsonSchema"]>,
    z.infer<typeof gameMetadata.processor["gameActionJsonSchema"]>
  >;
  
  const gameSpecificState = gameEngine.parseGameSpecificGameStateJson(
    latestAction.actionOutcomeGameStateJson as BfgGameSpecificGameStateTypedJson<typeof gameTitle>);

  const latestGameSpecificAction = gameEngine.parseGameSpecificActionJson(
    latestAction.actionJson as BfgGameSpecificGameStateTypedJson<typeof gameTitle>);

  // const gameRepresentation = gameEngine
  //   .createGameStateRepresentationComponent(myPlayerSeat, gameSpecificState, latestGameSpecificAction);

  const onGameAction = async (gameState: z.infer<typeof gameMetadata.processor["gameStateJsonSchema"]>, gameAction: z.infer<typeof gameMetadata.processor["gameActionJsonSchema"]>) => {
    console.log("onGameAction", gameState, gameAction);

    // onPlayerGameAction(gameAction);
    await asPlayerMakeMove(hostedGame.id, myPlayerProfile.id, gameAction);
  }

  const gameRepresentation = gameEngine?.createGameStateCombinationRepresentationAndInputComponent ?
    gameEngine.createGameStateCombinationRepresentationAndInputComponent(myPlayerSeat, gameSpecificState, latestGameSpecificAction, onGameAction) :
    <>
      {gameEngine.createGameStateRepresentationComponent(myPlayerSeat, gameSpecificState, latestGameSpecificAction)}
      {gameEngine.createGameStateActionInputComponent(myPlayerSeat, gameSpecificState, latestGameSpecificAction, onGameAction)}
    </>


  if (!gameMetadata) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Loading Game Metadata...</h1>
        <div className="text-gray-600">Loading game metadata...</div>
      </div>
    )
  }

  return (
    <div>
      {/* <div>Hosted Game: {hostedGame.gameTitle}</div>
      <div>Hosted Game ID: {hostedGame.id}</div>
      <div>Hosted Game State: {JSON.stringify(gameSpecificState)}</div>
      <div>Hosted Game Actions: {JSON.stringify(gameActions)}</div> */}
      {/* <div>Hosted Game Representation: {gameRepresentation}</div> */}
      {gameRepresentation}
    </div>
  );
      // <div>Hosted Game: {hostedGame.gameTitle}</div>
    // <div>Hosted Game ID: {hostedGame.id}</div>
    // <div>Hosted Game State: {JSON.stringify(hostedGame.gameState)}</div>
    // <div>Hosted Game Actions: {JSON.stringify(hostedGame.gameActions)}</div>
}
