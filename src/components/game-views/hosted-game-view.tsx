// import { z } from "zod";
// import { GameTable, GameTableSeat } from "~/models/game-table/game-table";
// import { BfgGameSpecificGameStateTypedJson } from "~/types/core/branded-values/bfg-game-state-typed-json";
// import { DbGameTableAction } from "~/models/game-table/game-table-action";
// import { getTypedBfgGameMetadata, BfgGameEngineProcessor } from "~/types/bfg-game-engines/bfg-game-engines";
// import { PrivatePlayerProfile } from "~/models/private-player-profile";
// import { AbfgSupportedGameTitle } from "~/types/bfg-game-engines/supported-games";
// import { PublicPlayerProfile } from "~/models/public-player-profile";
// import { PlayerProfileId } from "~/types/core/branded-values/bfg-branded-ids";


// interface HostedGameViewProps {
//   myPlayerSeat: GameTableSeat;
//   myPlayerProfile: PrivatePlayerProfile;
//   hostedGame: GameTable;
//   gameActions: DbGameTableAction[];

//   peerProfiles: Map<string, PublicPlayerProfile>;
//   playerProfiles: Map<PlayerProfileId, PublicPlayerProfile>;
  
//   onPlayerGameAction: (playerAction: BfgGameSpecificGameStateTypedJson<AbfgSupportedGameTitle>) => void
// }

// export const HostedGameView = (props: HostedGameViewProps) => {
//   const { hostedGame, gameActions, onPlayerGameAction } = props;

//   const latestAction = gameActions[gameActions.length - 1];
//   const gameTitle = hostedGame.gameTitle;
  
//   const gameMetadata = getTypedBfgGameMetadata(gameTitle);
//   const gameEngine = gameMetadata.processor as BfgGameEngineProcessor<
//     z.infer<typeof gameMetadata.processor["gameStateJsonSchema"]>,
//     z.infer<typeof gameMetadata.processor["gameActionJsonSchema"]>
//   >;
//   const gameRendererFactory = gameEngine.rendererFactory;

//   const gameSpecificState = gameEngine.parseGameSpecificGameStateJson(
//     latestAction.actionOutcomeGameStateJson as BfgGameSpecificGameStateTypedJson<typeof gameTitle>);

//   const latestGameSpecificAction = gameEngine.parseGameSpecificActionJson(
//     latestAction.actionJson as BfgGameSpecificGameStateTypedJson<typeof gameTitle>);

//   // Type-safe callback function that works with the specific game engine
//   const onPlayerMoveAction = async (gameState: typeof gameSpecificState, gameAction: typeof latestGameSpecificAction) => {
//     console.log("onGameAction", gameState, gameAction);
//     const playerMoveJson = gameEngine.createGameSpecificActionJson(gameAction);
//     onPlayerGameAction(playerMoveJson);
//   }

//   const createHostRepresentation = gameRendererFactory.createGameStateHostComponent;
//   const hostRepresentation = createHostRepresentation(hostedGame, gameSpecificState, latestGameSpecificAction, onPlayerMoveAction);
  
  
//   // const hostRepresentation = (gameRendererFactory as {
//   //   createGameStateHostComponent: (
//   //     gameTable: GameTable,
//   //     gameState: GameStateType,
//   //     mostRecentAction: GameActionType,
//   //     onGameAction: (gameState: GameStateType, gameAction: GameActionType) => void
//   //   ) => React.ReactNode;
//   // }).createGameStateHostComponent(hostedGame, gameSpecificState, latestGameSpecificAction, onPlayerMoveAction);

//   return (
//     <div>
//       <div>BFG Table Phase: {hostedGame.tablePhase}</div>
//       {hostRepresentation}
      
//       {/* <PeerProfilesComponent
//         peerProfiles={peerProfiles}
//         playerProfiles={playerProfiles}
//       /> */}
//     </div>
//   );
// }
