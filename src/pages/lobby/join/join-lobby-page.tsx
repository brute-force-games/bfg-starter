// import { useParams } from 'react-router-dom';
// import { LobbyStoreProvider } from '../../../state/lobby-sync/lobby-store-provider';
// import { JoinLobbyPageContent } from './join-lobby-page-content';
// import { LobbyId } from '../../../types/core/branded-values/bs-lobby-id';
// import { Helmet } from 'react-helmet-async';
// import { useMyPlayerContext } from '../../../state/persisted-player/persisted-player-store';


// export const JoinLobbyPage = () => {

//   const { lobbyId } = useParams();
//   const { myPlayerId } = useMyPlayerContext();


//   if (!lobbyId) {
//     return <div>No lobby ID</div>;
//   }

//   const brandedLobbyId = lobbyId as LobbyId;
  
//   return (
//     <LobbyStoreProvider
//       lobbyId={brandedLobbyId}
//     >
//       <Helmet>
//         <title>SPG - Game Lobby</title>
//       </Helmet>
//       <JoinLobbyPageContent myPlayerId={myPlayerId} />
//     </LobbyStoreProvider>
//   );
// }
