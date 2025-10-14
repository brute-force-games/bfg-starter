// import { usePlayerP2pGame } from "~/hooks/p2p/use-player-p2p-game"
// import { PrivatePlayerProfile } from "~/models/private-player-profile"
// import { GameTableId } from "~/types/core/branded-values/bfg-branded-ids"
// import { PlayerGameView } from "../game-views/player-game-view"
// import { BfgGameSpecificGameStateTypedJson } from "~/types/core/branded-values/bfg-game-state-typed-json"
// import { AbfgSupportedGameTitle } from "~/types/bfg-game-engines/supported-games"
// import { Container, Groups, Wifi } from "@bfg-engine"
// import { TabsContainerPanel } from "../tabs-container-panel"
// import { P2pConnectionComponent } from "./p2p-connection-component"


// interface IPlayerP2pGameComponentProps {
//   gameTableId: GameTableId
//   playerProfile: PrivatePlayerProfile
// }

// export const PlayerP2pGameComponent = ({ gameTableId, playerProfile }: IPlayerP2pGameComponentProps) => {

//   const p2pGame = usePlayerP2pGame(gameTableId, playerProfile);

//   if (!p2pGame) {
//     return <div>Loading P2P Game...</div>;
//   }

//   const { gameTable, gameActions, myPlayerSeat, sendPlayerMove } = p2pGame;

//   if (!gameTable || !gameActions || !myPlayerSeat) {
//     console.log("🔍 PlayerP2pGameComponent Debug Info:")
//     console.log("  gameTable:", gameTable)
//     console.log("  gameActions:", gameActions)
//     console.log("  myPlayerSeat:", myPlayerSeat)
//     console.log("  connectionStatus:", p2pGame.connectionStatus)
//     console.log("  peerCount:", p2pGame.peerProfiles.size)
//     console.log("  connectionEvents:", p2pGame.connectionEvents)
    
//     return (
//       <Container maxWidth="lg" style={{ paddingTop: '24px', paddingBottom: '24px' }}>
//         <TabsContainerPanel
//           tabs={[
//             {
//               title: "Loading Game",
//               icon: <Groups />,
//               content: (
//                 <div style={{ padding: '20px', textAlign: 'center' }}>
//                   <h3>Loading game content...</h3>
//                   <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
//                     <div>Connection: {p2pGame.connectionStatus}</div>
//                     <div>Peers connected: {p2pGame.peerProfiles.size}</div>
//                     {p2pGame.peerProfiles.size === 0 && (
//                       <div style={{ marginTop: '10px', color: '#d32f2f' }}>
//                         ⚠️ No host detected. Make sure someone is running the game host at:<br/>
//                         <code>/hosted-games/{gameTableId}</code>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )
//             },
//             {
//               title: "P2P Debug",
//               icon: <Wifi />,
//               content: (
//                 <P2pConnectionComponent
//                   connectionStatus={p2pGame.connectionStatus}
//                   connectionEvents={p2pGame.connectionEvents}
//                   peerProfiles={p2pGame.peerProfiles}
//                   playerProfiles={p2pGame.playerProfiles}
//                   onRefreshConnection={p2pGame.refreshConnection}
//                 />
//               )
//             }
//           ]}
//           tabColor="linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)"
//           ariaLabel="loading game tabs"
//         />
//       </Container>
//     );
//   }

//   const onPlayerGameAction = (move: BfgGameSpecificGameStateTypedJson<AbfgSupportedGameTitle>) => {
//     sendPlayerMove(move);
//   }

//   const newView = true;

//   if (newView) {
//     return (
//       <Container maxWidth="lg" style={{ paddingTop: '24px', paddingBottom: '24px' }}>
//         <TabsContainerPanel
//           tabs={[
//             {
//               title: "Player Game",
//               icon: <Groups />,
//               content: (
//                 <PlayerGameView
//                   myPlayerProfile={playerProfile}
//                   myPlayerSeat={myPlayerSeat}
//                   gameTable={gameTable}
//                   gameActions={gameActions}
//                   onPlayerGameAction={onPlayerGameAction}
//                 />
        
//                 // <GamePlayerStateComponent
//                   // playerProfiles={lobby.playerProfiles}
//                   // lobbyState={lobbyState}
//                   // currentPlayerProfile={playerProfile}
//                   // lobbyOptions={lobbyOptions}
//                   // onSelectGameChoice={onSelectGameChoice}
//                   // onTakeSeat={onTakeSeat}
//                   // onLeaveSeat={onLeaveSeat}
//                 // />
//               )
//             },
//             {
//               title: "P2P",
//               icon: <Wifi />,
//               content: (
//                 <P2pConnectionComponent
//                   connectionStatus={p2pGame.connectionStatus}
//                   connectionEvents={p2pGame.connectionEvents}
//                   peerProfiles={p2pGame.peerProfiles}
//                   playerProfiles={p2pGame.playerProfiles}
//                   onRefreshConnection={p2pGame.refreshConnection}
//                 />
//               )
//             }
//           ]}
//           tabColor="linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)"
//           ariaLabel="player lobby tabs"
//         />
//       </Container>
//     )
//   }

//   return (
//     <>
//       <PlayerGameView
//         myPlayerProfile={playerProfile}
//         myPlayerSeat={myPlayerSeat}
//         gameTable={gameTable}
//         gameActions={gameActions}
//         onPlayerGameAction={onPlayerGameAction}
//       />
//       {/* <PeerProfilesComponent
//         peerProfiles={peerProfiles}
//         playerProfiles={playerProfiles}
//       /> */}
//     </>
//   )
// }
