import { z } from "zod";
import { GameTable, GameTableSeat } from "~/models/game-table/game-table";
import { BfgGameSpecificGameStateTypedJson } from "~/types/core/branded-values/bfg-game-state-typed-json";
import { DbGameTableAction } from "~/models/game-table/game-table-action";
import { AllBfgGameMetadata, BfgGameEngineProcessor } from "~/types/bfg-game-engines/bfg-game-engines";
import { PrivatePlayerProfile } from "~/models/private-player-profile";
import { AbfgSupportedGameTitle } from "~/types/bfg-game-engines/supported-games";
import { PeerProfilesComponent } from "../p2p/peer-profiles-component";
import { PublicPlayerProfile } from "~/models/public-player-profile";
import { PlayerProfileId } from "~/types/core/branded-values/bfg-branded-ids";


interface HostedGameViewProps {
  myPlayerSeat: GameTableSeat;
  myPlayerProfile: PrivatePlayerProfile;
  hostedGame: GameTable;
  gameActions: DbGameTableAction[];

  peerProfiles: Map<string, PublicPlayerProfile>;
  playerProfiles: Map<PlayerProfileId, PublicPlayerProfile>;
  
  onPlayerGameAction: (playerAction: BfgGameSpecificGameStateTypedJson<AbfgSupportedGameTitle>) => void
}

export const HostedGameView = (props: HostedGameViewProps) => {
  const { myPlayerSeat, hostedGame, gameActions, onPlayerGameAction, peerProfiles, playerProfiles } = props;

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

  const onPlayerMoveAction = async (gameState: z.infer<typeof gameMetadata.processor["gameStateJsonSchema"]>, gameAction: z.infer<typeof gameMetadata.processor["gameActionJsonSchema"]>) => {
    console.log("onGameAction", gameState, gameAction);

    // onPlayerGameAction(gameAction);
    // await asPlayerMakeMove(hostedGame.id, myPlayerProfile.id, gameAction);
    const playerMoveJson = gameEngine.createGameSpecificActionJson(gameAction);
    onPlayerGameAction(playerMoveJson);
  }

  const gameRepresentation = gameEngine?.createGameStateCombinationRepresentationAndInputComponent ?
    gameEngine.createGameStateCombinationRepresentationAndInputComponent(myPlayerSeat, gameSpecificState, latestGameSpecificAction, onPlayerMoveAction) :
    <>
      {gameEngine.createGameStateRepresentationComponent(myPlayerSeat, gameSpecificState, latestGameSpecificAction)}
      {gameEngine.createGameStateActionInputComponent(myPlayerSeat, gameSpecificState, latestGameSpecificAction, onPlayerMoveAction)}
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
      {gameRepresentation}
      
      <PeerProfilesComponent
        peerProfiles={peerProfiles}
        playerProfiles={playerProfiles}
      />
    </div>
  );
}
