// import { GameLobby } from "~/models/p2p-lobby"
// import { PrivatePlayerProfile } from "~/models/private-player-profile"
// import { 
//   Avatar,
//   Box,
//   Button,
//   CheckCircle as CheckCircleIcon,
//   OpenInNew as OpenInNewIcon,
//   Paper,
//   Typography
// } from '@bfg-engine'


// interface ILobbyPlayerJoinGameComponentProps {
//   lobbyState: GameLobby
//   currentPlayerProfile?: PrivatePlayerProfile
// }

// export const LobbyPlayerJoinGameComponent = ({ 
//   lobbyState,
//   // currentPlayerProfile,
// }: ILobbyPlayerJoinGameComponentProps) => {

//   // const handleGameChoice = (gameChoice: BfgSupportedGameTitles) => {
//   //   console.log('Selecting game choice:', gameChoice);
//   //   onSelectGameChoice(gameChoice);
//   // };

//   // const handleTakeSeat = () => {
//   //   onTakeSeat();
//   // };

//   // const handleLeaveSeat = () => {
//   //   onLeaveSeat();
//   // };

//   // Check if the current player is already in the lobby
//   // const isPlayerAlreadyInLobby = currentPlayerProfile 
//   //   ? lobbyState.playerPool.includes(currentPlayerProfile.id)
//   //   : false;

//   return (
//     <Paper 
//       elevation={3} 
//       style={{ 
//         padding: '24px', 
//         borderRadius: 8,
//         textAlign: 'center'
//       }}
//     >
//       <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//         {/* Success Icon */}
//         <Avatar 
//           style={{ 
//             backgroundColor: '#81c784', 
//             marginBottom: '16px',
//             width: 40,
//             height: 40
//           }}
//         >
//           <CheckCircleIcon style={{ color: '#4caf50', fontSize: 24 }} />
//         </Avatar>
        
//         {/* Main Message */}
//         <Typography 
//           variant="h4" 
//           component="h2" 
//           style={{ 
//             fontWeight: 'bold', 
//             marginBottom: '8px'
//           }}
//         >
//           Game Has Started!
//         </Typography>
        
//         <Typography 
//           variant="h6" 
//           style={{ 
//             color: '#666',
//             marginBottom: '24px'
//           }}
//         >
//           The game is now live and ready to play. Click the link below to join the action!
//         </Typography>
        
//         {/* Game Link Button */}
//         <Box style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
//           <a
//             href={lobbyState.gameLink}
//             target="_blank"
//             rel="noopener noreferrer"
//             style={{ textDecoration: 'none' }}
//           >
//             <Button
//               variant="contained"
//               size="large"
//               startIcon={<OpenInNewIcon />}
//               style={{
//                 padding: '12px 32px',
//                 fontSize: '1.1rem',
//                 fontWeight: 500,
//                 textTransform: 'none',
//                 transition: 'all 0.2s ease-in-out'
//               }}
//             >
//               Join Game Now
//             </Button>
//           </a>
          
//           {/* Additional Info */}
//           <Typography 
//             variant="body2" 
//             style={{ color: '#999' }}
//           >
//             This link will open in a new tab
//           </Typography>
//         </Box>
//       </Box>
//     </Paper>
//   )
// }
