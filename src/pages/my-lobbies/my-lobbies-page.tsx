// import { Typography, Button } from "@mui/material";
// import { CreateNewLobbyDialog } from "~/dialogs/create-new-lobby-dialog";
// import { useState } from "react";
// import { MyPlayerProvider } from "~/data/persisted-player/persisted-player-provider";
// import { NewGameLobbyParameters } from "~/types/core/lobby-phase/lobby-phase";
// import { addNewLobby, deleteAllLobbies, useLiveLobbies } from "~/data/bfg-db-lobbies";
// import { NewDbGameLobby } from "~/types/core/lobby-phase/lobby-phase-db";
// import { LobbyDetailsComponent } from "~/components/lobby/lobby-details-component";
// import { BfgWhoAmIProvider } from "~/state/who-am-i/BfgWhoAmIProvider";


// export const MyLobbiesPage = () => {

//   const [openCreateNewLobbyDialog, setOpenCreateNewLobbyDialog] = useState(false);

//   const allLobbies = useLiveLobbies();

//   console.log("MyLobbiesPage: allLobbies", allLobbies);

//   const onCreateNewLobby = async (lobbyParameters: NewGameLobbyParameters) => {

//     console.log("MyLobbiesPage: onCreateNewLobby");
//     console.log("lobbyParameters:", lobbyParameters);

//     const newLobby: NewDbGameLobby = {
//       status: "lobby-status-valid",
//       gameTitle: lobbyParameters.gameOnShelf.title,
//       lobbyMinNumPlayers: lobbyParameters.lobbyMinNumPlayers,
//       lobbyMaxNumPlayers: lobbyParameters.lobbyMaxNumPlayers,
//       gameHostPlayerId: lobbyParameters.gameHostPlayerId,
//       createdAt: new Date().toISOString(),
//     }

//     await addNewLobby(newLobby);

//     console.log("MyLobbiesPage: onCreateNewLobby: added new lobby");
//   }

//   const doDeleteAllLobbies = async () => {
//     await deleteAllLobbies();
//     console.log("MyLobbiesPage: doDeleteAllLobbies: deleted all lobbies");
//   }

//   return (
//     <>
//       <BfgWhoAmIProvider>
//         <MyPlayerProvider>
//           <Typography variant="h1">My Lobbies</Typography>
//           <Button
//             variant="contained"
//             color="primary" 
//             onClick={() => setOpenCreateNewLobbyDialog(true)}
//           >
//             Create Lobby
//           </Button>

//           <Button
//             variant="contained"
//             color="warning" 
//             onClick={doDeleteAllLobbies}
//           >
//             Delete All Lobbies
//           </Button>

//           <Typography variant="h2">All Lobbies</Typography>

//           {
//             allLobbies && allLobbies.length > 0 && (
//               <>
//                 <Typography variant="h3">
//                   {allLobbies.length} lobbies found
//                 </Typography>
//                 <div> 
//                   {
//                     allLobbies?.map(lobby => (
//                       <LobbyDetailsComponent key={lobby.id} lobbyId={lobby.id!} />
//                     ))
//                   }
//                 </div>
//               </>
//             )
//           }

//           {
//             openCreateNewLobbyDialog && (
//               <CreateNewLobbyDialog
//                 onCreateNewLobby={onCreateNewLobby}
//                 onClose={() => setOpenCreateNewLobbyDialog(false)}
//               />
//             )
//           }
//         </MyPlayerProvider>
//       </BfgWhoAmIProvider>
//     </>
//   );
// };
