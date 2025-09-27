// import { useLiveLobby } from "~/data/bfg-db-lobbies";
// import { useParams } from "react-router-dom";
// import { BfgGameLobbyId } from "~/types/core/branded-values/bfg-branded-ids";
// import { BfgWhoAmIProvider } from "~/state/who-am-i/BfgWhoAmIProvider";
// import { JoinLobbyComponent } from "~/components/lobby/join-lobby-component";


// export const JoinLobbyPage = () => {
//   const { lobbyId } = useParams();

//   if (!lobbyId) {
//     throw new Error("Lobby ID is required");
//   }

//   const bfgGameLobbyId = BfgGameLobbyId.parseId(lobbyId);

//   const lobby = useLiveLobby(bfgGameLobbyId);


//   // // Monitor a single field
//   // const lobbyStatus = useLiveLobbyField(lobbyId, 'status');

//   // // Monitor multiple fields
//   // const { status, description } = useLiveLobbyFields(lobbyId, ['status', 'description']) || {};

//   // // Monitor all lobbies with a specific status
//   // const activeLobbies = useLiveLobbiesByField('status', 'lobby-status-valid');

//   return (
//     <>
//       <BfgWhoAmIProvider>
//         <div>Join Lobby</div>
//         <JoinLobbyComponent lobbyId={bfgGameLobbyId} />
//       </BfgWhoAmIProvider>
//     </>
//   );
// }
