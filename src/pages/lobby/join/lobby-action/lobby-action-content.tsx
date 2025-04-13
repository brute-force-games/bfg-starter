// import { JoinLobbyForm } from "./join-lobby-form";
// import { LeaveLobbyForm } from "./leave-lobby-form";
// import { PlayerId } from "../../../../types/core/branded-values/bs-player-id";
// import { GameLobbyComplete, GameLobbyInProgress } from "../../../../types/core/game-lobby";
// import { JoinGameForm } from "./join-game-form";
// import { FullLobbyForm } from "./full-lobby-form";
// import { PlayerInLobby } from "../../../../types/player/player";
// import { HostLinksForm } from "./host-links-form";


// interface ILobbyActionButtonProps {
//   myPlayerId: PlayerId;
//   lobby: GameLobbyInProgress;
  
//   onPlayerLeavesLobby: (playerId: PlayerId) => void;
//   onPlayerJoinsLobby: (playerData: PlayerInLobby) => void;
// }


// export const LobbyActionContent = (props: ILobbyActionButtonProps) => {
  
//   const { myPlayerId, lobby, onPlayerLeavesLobby, onPlayerJoinsLobby } = props;
//   const { players, } = lobby;

//   const isMyPlayerInLobby = players.some((player) => player.playerId === myPlayerId);
//   const isLobbyFull = players.length >= lobby.maxNumPlayers;
//   const isMyPlayerHost = lobby.gameHostPlayerId === myPlayerId;


//   if (isMyPlayerInLobby) {
//     if (lobby.status.started) {
//       const completeLobby = lobby as GameLobbyComplete;
//       if (isMyPlayerHost) {
//         return (
//           <HostLinksForm
//             lobby={completeLobby}
//           />
//         );
//       } 
      
//       return (
//         <JoinGameForm
//           lobby={completeLobby}
//         />
//       );
//     } else {
//       return (
//         <LeaveLobbyForm
//           onPlayerLeavesLobby={() => onPlayerLeavesLobby(myPlayerId)}
//         />
//       );
//     }
//   }

//   if (isLobbyFull) {
//     return (
//       <FullLobbyForm />
//     );
//   }

//   return (
//     <JoinLobbyForm
//       lobby={lobby}
//       myPlayerId={myPlayerId}
//       onPlayerJoinsLobby={onPlayerJoinsLobby}
//     />
//   );
// }
