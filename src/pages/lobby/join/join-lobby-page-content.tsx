// import { useLobbyState } from '../../../state/lobby-sync/lobby-store';
// import { 
//   Stack, 
//   Button, 
//   Typography, 
//   Paper, 
//   Box,
//   List,
//   ListItem,
//   ListItemText,
//   Divider,
// } from '@mui/material';
// import ContentCopyIcon from '@mui/icons-material/ContentCopy';
// import { createLobbyUrl } from '../../../data/url-factory';
// import { LobbyActionContent } from './lobby-action/lobby-action-content';
// import { PlayerId } from '../../../types/core/branded-values/bs-player-id';


// interface IJoinLobbyPageContentProps {
//   myPlayerId: PlayerId;
// }


// export const JoinLobbyPageContent = (props: IJoinLobbyPageContentProps) => {
//   const { gameLobby, onPlayerJoinsLobby, onPlayerLeavesLobby, onStartGame } = useLobbyState();
//   const { lobbyTbId, players, } = gameLobby;
//   const { myPlayerId } = props;

//   const isMyPlayerHost = gameLobby.gameHostPlayerId === myPlayerId;

//   const joinGameLobbyUrl = createLobbyUrl(lobbyTbId);


//   return (
//     <Stack spacing={3} maxWidth="md" mx="auto">
//       <Typography variant="h4" component="h1">
//         {gameLobby.name}
//       </Typography>
//       <Typography variant="subtitle1">
//         Card Set: {gameLobby.cardSet}
//       </Typography>

//       <Paper elevation={3} sx={{ p: 3 }}>
//         <Stack spacing={3}>
//           <Typography variant="subtitle1">
//             Max Players: {gameLobby.maxNumPlayers}
//           </Typography>

//           <LobbyActionContent
//             myPlayerId={myPlayerId}
//             lobby={gameLobby}
//             onPlayerJoinsLobby={onPlayerJoinsLobby}
//             onPlayerLeavesLobby={onPlayerLeavesLobby}
//           />
          
//           <Box>
//             <Typography variant="h6" gutterBottom>
//               Players ({players.length}/{gameLobby.maxNumPlayers})
//             </Typography>
//             <List>
//               {players.map((player, index) => (
//                 <div key={player.playerId as PlayerId}>
//                   <ListItem>
//                     <ListItemText primary={player.name} />
//                     {player.playerId === myPlayerId && ( <div>*</div> )}
//                     {player.playerId === gameLobby.gameHostPlayerId && ( <div>Host</div> )}
//                   </ListItem>
//                   {index < gameLobby.maxNumPlayers - 1 && <Divider />}
//                 </div>
//               ))}
              
//               {[...Array(gameLobby.maxNumPlayers - players.length)].map((_, index) => (
//                 <div key={`empty-${index}`}>
//                   <ListItem>
//                     <ListItemText 
//                       primary="Waiting for player..."
//                       sx={{ color: 'text.disabled' }}
//                     />
//                   </ListItem>
//                   {index < gameLobby.maxNumPlayers - players.length - 1 && <Divider />}
//                 </div>
//               ))}
//             </List>
//           </Box>

//           <Box>
//             <Button
//               startIcon={<ContentCopyIcon />}
//               variant="outlined"
//               onClick={() => navigator.clipboard.writeText(joinGameLobbyUrl)}
//               disabled={gameLobby.status.started}
//             >
//               Copy Invite Link
//             </Button>
//           </Box>

//           {isMyPlayerHost && (
//             <Box>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 disabled={players.length < 1}
//                 onClick={onStartGame}
//               >
//                 Start Game
//               </Button>
//             </Box>
//           )}
//         </Stack>
//       </Paper>
//     </Stack>
//   );
// }
