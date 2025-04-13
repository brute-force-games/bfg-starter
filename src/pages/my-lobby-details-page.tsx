// import { useLiveLobby } from "~/data/bfg-db-lobbies";
// import { useParams } from "react-router-dom";
// import { BfgGameLobbyId } from "~/types/core/branded-values/bfg-branded-ids";
// import { LobbyDetailsComponent } from "~/components/lobby/lobby-details-component";
// import { BfgWhoAmIProvider } from "~/state/who-am-i/BfgWhoAmIProvider";


// export const MyLobbyDetailsPage = () => {
//   const { lobbyId } = useParams();

//   if (!lobbyId) {
//     throw new Error("Lobby ID is required");
//   }

//   const dbGameLobbyId = BfgGameLobbyId.parseId(lobbyId);

//   const lobby = useLiveLobby(dbGameLobbyId);


//   // // Monitor a single field
//   // const lobbyStatus = useLiveLobbyField(lobbyId, 'status');

//   // // Monitor multiple fields
//   // const { status, description } = useLiveLobbyFields(lobbyId, ['status', 'description']) || {};

//   // // Monitor all lobbies with a specific status
//   // const activeLobbies = useLiveLobbiesByField('status', 'lobby-status-valid');

//   return (
//     <>
//       <BfgWhoAmIProvider>
//         <div>My Lobby Details</div>
//         <LobbyDetailsComponent lobbyId={dbGameLobbyId} />
//         <div>
//           <pre>
//             {JSON.stringify(lobby, null, 2)}
//           </pre>
//         </div>
//       </BfgWhoAmIProvider>
//     </>
//   );
// }
