// import { z } from "zod"
// import { matchPlayerToSeat } from "~/data/game-table-ops/player-seat-utils"
// import { usePlayerP2pGame } from "~/hooks/p2p/use-player-p2p-game"
// import { AllBfgGameMetadata, BfgGameEngineProcessor } from "~/types/bfg-game-engines/bfg-game-engines"
// import { AbfgSupportedGameTitle } from "~/types/bfg-game-engines/supported-games"
// import { GameTableId } from "~/types/core/branded-values/bfg-branded-ids"
// import { BfgGameSpecificGameStateTypedJson } from "~/types/core/branded-values/bfg-game-state-typed-json"
// import { PlayerGameView } from "./game-view/player-game-view"
// import { PrivatePlayerProfile } from "~/models/private-player-profile"


// interface PlayerP2pGameComponentProps {
//   playerProfile: PrivatePlayerProfile
//   gameTableId: GameTableId
// }


// export const PlayerP2pGameComponent = ({ gameTableId, playerProfile }: PlayerP2pGameComponentProps) => {

//   const p2pGame = usePlayerP2pGame(gameTableId, playerProfile);

//   if (!playerProfile) {
//     return (
//       <div className="p-6">
//         <h1 className="text-3xl font-bold mb-6">Loading Profile...</h1>
//         <div className="text-gray-600">Loading profile details...</div>
//       </div>
//     )
//   }

//   const { gameTable, gameActions, getPlayerMove } = p2pGame;

//   if (!gameTable || !gameActions) {
//     return (
//       <div className="p-6">
//         <h1 className="text-3xl font-bold mb-6">Loading Game...</h1>
//         <div className="text-gray-600">Loading game details...</div>
//       </div>
//     )
//   }

//   const myPlayerSeat = matchPlayerToSeat(playerProfile.id, gameTable);

//   if (!myPlayerSeat) {
//     console.log("You are not at this game table")
//     console.log("gameTable", gameTable)
//     console.log("myPlayerSeat", myPlayerSeat)
//     console.log("playerProfile.id", playerProfile.id)
//     console.log("gameTable.gameHostPlayerProfileId", gameTable.gameHostPlayerProfileId)
//     return <div>You are not at this game table</div>;
//   }

//   // const { getPlayerMove } = p2pGame;


//   const gameTitle = gameTable.gameTitle;
//   const gameMetadata = AllBfgGameMetadata[gameTitle];
//   const gameEngine = gameMetadata.processor as BfgGameEngineProcessor<
//     z.infer<typeof gameMetadata.processor["gameStateJsonSchema"]>,
//     z.infer<typeof gameMetadata.processor["gameActionJsonSchema"]>
//   >;


//   const handlePlayerMove = async (move: BfgGameSpecificGameStateTypedJson<AbfgSupportedGameTitle>) => {
//     const actionJson = move as BfgGameSpecificGameStateTypedJson<AbfgSupportedGameTitle>;
//     const playerMoveJson = gameEngine.parseGameSpecificActionJson(actionJson);
//     console.log('playerMoveJson', playerMoveJson);
//   }

  
//   getPlayerMove(async (move: BfgGameSpecificGameStateTypedJson<AbfgSupportedGameTitle>, peer: string) => {
//     console.log('Received player move from peer:', peer, move);
//     await handlePlayerMove(move);
//   })

//   return (

//     <PlayerGameView
//       myPlayerProfile={hostPlayerProfile}
//       onPlayerGameAction={handlePlayerMove}
//       myPlayerSeat={myPlayerSeat}
//       // hostedGame={hostedGame}
//       gameActions={gameActions}
//     />
//   )
// }
