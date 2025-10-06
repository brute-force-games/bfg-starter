// import { z } from "zod"
// import { HostedGameView } from "~/components/game-view/hosted-game-view"
// import { matchPlayerToSeat } from "~/data/game-table-ops/player-seat-utils"
// import { useHostedP2pGame } from "~/hooks/p2p/use-hosted-p2p-game"
// import { useGameActions } from "~/hooks/stores/use-game-actions-store"
// import { useHostedGame } from "~/hooks/stores/use-hosted-games-store"
// import { useMyDefaultPlayerProfile } from "~/hooks/stores/use-my-player-profiles-store"
// import { AllBfgGameMetadata, BfgGameEngineProcessor } from "~/types/bfg-game-engines/bfg-game-engines"
// import { AbfgSupportedGameTitle } from "~/types/bfg-game-engines/supported-games"
// import { GameTableId } from "~/types/core/branded-values/bfg-branded-ids"
// import { BfgGameSpecificGameStateTypedJson } from "~/types/core/branded-values/bfg-game-state-typed-json"


// interface HostedP2pGameComponentProps {
//   gameTableId: GameTableId
// }


// export const HostedP2pGameComponent = ({ gameTableId }: HostedP2pGameComponentProps) => {

//   const hostPlayerProfile = useMyDefaultPlayerProfile();
  
//   const hostedGame = useHostedGame(gameTableId);
//   const gameActions = useGameActions(gameTableId);

//   const p2pGame = useHostedP2pGame(hostedGame, hostPlayerProfile);
//   const { peerProfiles, playerProfiles } = p2pGame;

//   if (!hostPlayerProfile) {
//     return (
//       <div className="p-6">
//         <h1 className="text-3xl font-bold mb-6">Loading Profile...</h1>
//         <div className="text-gray-600">Loading profile details...</div>
//       </div>
//     )
//   }

//   if (!hostedGame) {
//     return (
//       <div className="p-6">
//         <h1 className="text-3xl font-bold mb-6">Loading Game...</h1>
//         <div className="text-gray-600">Loading game details...</div>
//       </div>
//     )
//   }

//   const myPlayerSeat = matchPlayerToSeat(hostPlayerProfile.id, hostedGame);

//   if (!myPlayerSeat) {
//     console.log("You are not at this game table")
//     console.log("hostedGame", hostedGame)
//     console.log("myPlayerSeat", myPlayerSeat)
//     console.log("hostPlayerProfile.id", hostPlayerProfile.id)
//     console.log("hostedGame.gameHostPlayerProfileId", hostedGame.gameHostPlayerProfileId)
//     return <div>You are not at this game table</div>;
//   }

//   const { getPlayerMove } = p2pGame;

//   const gameTitle = hostedGame.gameTitle;
//   const gameMetadata = AllBfgGameMetadata[gameTitle];
//   const gameEngine = gameMetadata.processor as BfgGameEngineProcessor<
//     z.infer<typeof gameMetadata.processor["gameStateJsonSchema"]>,
//     z.infer<typeof gameMetadata.processor["gameActionJsonSchema"]>
//   >;

//   // const onPlayerGameAction = (playerAction: BfgGameSpecificGameStateTypedJson<AbfgSupportedGameTitle>) => {
//   //   console.log('p2pGame.sendPlayerMove', playerAction);
//   //   p2pGame.sendPlayerMove(playerAction);
//   // }

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

//     <HostedGameView
//       myPlayerProfile={hostPlayerProfile}
//       onPlayerGameAction={handlePlayerMove}
//       myPlayerSeat={myPlayerSeat}
//       hostedGame={hostedGame}
//       gameActions={gameActions}
//       peerProfiles={peerProfiles}
//       playerProfiles={playerProfiles}
//     />
//   )
// }
