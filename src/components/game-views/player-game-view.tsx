// import { z } from "zod";
// import { GameTable, GameTableSeat } from "~/models/game-table/game-table";
// import { BfgGameSpecificGameStateTypedJson } from "~/types/core/branded-values/bfg-game-state-typed-json";
// import { DbGameTableAction } from "~/models/game-table/game-table-action";
// import { getTypedBfgGameMetadata, BfgGameEngineProcessor } from "~/types/bfg-game-engines/bfg-game-engines";
// import { PrivatePlayerProfile } from "~/models/private-player-profile";
// import { AbfgSupportedGameTitle } from "~/types/bfg-game-engines/supported-games";


// interface PlayerGameViewProps {
//   myPlayerSeat: GameTableSeat;
//   myPlayerProfile: PrivatePlayerProfile;
//   gameTable: GameTable;
//   gameActions: DbGameTableAction[];
  
//   onPlayerGameAction: (playerAction: BfgGameSpecificGameStateTypedJson<AbfgSupportedGameTitle>) => void
// }

// export const PlayerGameView = (props: PlayerGameViewProps) => {
//   const { myPlayerSeat, gameTable, gameActions, onPlayerGameAction } = props;

//   const latestAction = gameActions[gameActions.length - 1];
//   const gameTitle = gameTable.gameTitle;

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

//   const onPlayerMoveAction = async (gameState: typeof gameSpecificState, gameAction: typeof latestGameSpecificAction) => {
//     console.log("onGameAction", gameState, gameAction);

//     const playerMoveJson = gameEngine.createGameSpecificActionJson(gameAction);
//     onPlayerGameAction(playerMoveJson);
//   }

//   const gameRepresentation = gameRendererFactory.createGameStateCombinationRepresentationAndInputComponent(myPlayerSeat, gameSpecificState, latestGameSpecificAction, onPlayerMoveAction);


//   if (!gameMetadata) {
//     return (
//       <div className="p-6">
//         <h1 className="text-3xl font-bold mb-6">Loading Game Metadata...</h1>
//         <div className="text-gray-600">Loading game metadata...</div>
//       </div>
//     )
//   }

//   return (
//     <div>
//       {gameRepresentation}
//     </div>
//   );
// }
