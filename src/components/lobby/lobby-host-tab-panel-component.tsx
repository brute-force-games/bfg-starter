// import { useState } from "react"
// import { GameLobby } from "~/models/p2p-lobby"
// import { PublicPlayerProfile } from "~/models/public-player-profile"
// import { PlayerProfileId } from "~/types/core/branded-values/bfg-branded-ids"


// interface ILobbyHostTabPanelComponentProps {
//   lobbyState: GameLobby
//   playerProfiles: Map<PlayerProfileId, PublicPlayerProfile>
//   updateLobbyState: (lobbyState: GameLobby) => void
//   setLobbyPlayerPool: (playerPool: PlayerProfileId[]) => void
// }

// export const LobbyHostTabPanelComponent = ({
//   lobbyState,
//   playerProfiles,
//   updateLobbyState,
//   setLobbyPlayerPool,
// }: ILobbyHostTabPanelComponentProps) => {

//   const [isStartingGame, setIsStartingGame] = useState(false);

//   const lobbyValidLabel = lobbyState.isLobbyValid ? 
//     '[Valid]' :
//     '[Invalid]';

//   const playerCountLabel = lobbyState.gameTitle === undefined ? 
//     '' :
//     `[${lobbyState.minNumPlayers} - ${lobbyState.maxNumPlayers} players]`;

//   const isGameStarted = lobbyState.gameLink !== undefined;
  
//   const hostingLink = lobbyState.gameTableId ? 
//     `${window.location.origin}/hosted-games/${lobbyState.gameTableId}` :
//     '';

//   const playerPoolHandles = lobbyState.playerPool.map(playerId => {
//     const playerProfile = playerProfiles.get(playerId);
//     if (!playerProfile) {
//       return (
//         <div key={playerId}>
//           {playerId} (name not available)
//         </div>
//       );
//     }
//     return (
//       <div key={playerId}>
//         {playerProfile.handle}
//       </div>
//     )
//   })

//   const startGame = async () => {
//     if (!lobbyState.gameTitle) {
//       alert('Please select a game title first');
//       return;
//     }
//   }

//   return (
//     <div>
//       <h1>Lobby Host Tab Panel</h1>
//       <div>
//         Lobby State {lobbyState.lobbyName} {lobbyValidLabel} - {lobbyState.playerPool.length}
//       </div>
//       <div> 
//         Game Title - {lobbyState.gameTitle} {playerCountLabel}
//       </div>
//       <div>
//         Game Link - {lobbyState.gameLink}
//       </div>
//       <div>
//         Hosting Link - <a href={hostingLink} target="_blank" rel="noopener noreferrer">{hostingLink}</a>
//       </div>
//       <div>
//         Player Pool [{lobbyState.playerPool.length}/{lobbyState.maxNumPlayers}]
//         <>{playerPoolHandles}</>
//       </div>
//       <div>
//         <button 
//           onClick={() => updateLobbyState({ ...lobbyState, gameTitle: undefined })}
//           disabled={isGameStarted}
//         >
//           Clear Game
//         </button>
//         <button
//           onClick={() => setLobbyPlayerPool([])}
//           disabled={isGameStarted}
//         >
//           Clear Seats
//         </button>
//         <button 
//           onClick={() => startGame()}
//           disabled={isGameStarted || isStartingGame || !lobbyState.isLobbyValid}
//         >
//           {isStartingGame ? "Starting Game..." : "Start Game"}
//         </button>
//       </div>
//     </div>
//   )
// }