// import { 
//   Box,
//   Button,
//   CheckCircle,
//   Chip,
//   History,
//   List,
//   Paper,
//   Refresh,
//   Stack,
//   Typography
// } from "@bfg-engine"
// import { PeerProfilesComponent } from "./peer-profiles-component"
// import { PublicPlayerProfile } from "~/models/public-player-profile"
// import { PlayerProfileId } from "~/types/core/branded-values/bfg-branded-ids"
// import { ConnectionEvent } from "~/hooks/p2p/use-p2p-lobby"


// interface P2pConnectionComponentProps {
//   connectionStatus: string
//   connectionEvents?: ConnectionEvent[]
//   peerProfiles: Map<string, PublicPlayerProfile>
//   playerProfiles: Map<PlayerProfileId, PublicPlayerProfile>
//   onResendLobbyData?: () => void
//   onRefreshConnection?: () => void
// }

// export const P2pConnectionComponent = ({
//   connectionStatus,
//   connectionEvents = [],
//   peerProfiles,
//   playerProfiles,
//   onResendLobbyData,
//   onRefreshConnection
// }: P2pConnectionComponentProps) => {
  
//   const getEventColor = (type: ConnectionEvent['type']) => {
//     switch (type) {
//       case 'initialized': return 'primary';
//       case 'peer-joined': return 'success';
//       case 'peer-left': return 'warning';
//       case 'auto-refresh': return 'info';
//       default: return 'default';
//     }
//   };

//   const getEventIcon = (type: ConnectionEvent['type']) => {
//     switch (type) {
//       case 'initialized': return '🚀';
//       case 'peer-joined': return '👋';
//       case 'peer-left': return '👋';
//       case 'auto-refresh': return '🔄';
//       default: return '📡';
//     }
//   };

//   return (
//     <>
//       <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
//         <CheckCircle sx={{ fontSize: 24, color: 'success.main' }} />
//         <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
//           Connection Status
//         </Typography>
//       </Stack>
//       <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
//         <Chip 
//           icon={<CheckCircle />}
//           label={connectionStatus}
//           color="success"
//           variant="outlined"
//         />
//         {onResendLobbyData && (
//           <Button
//             variant="outlined"
//             startIcon={<Refresh />}
//             onClick={onResendLobbyData}
//             size="small"
//           >
//             Resend Lobby Data
//           </Button>
//         )}
//         {onRefreshConnection && (
//           <Button
//             variant="outlined"
//             color="warning"
//             startIcon={<Refresh />}
//             onClick={onRefreshConnection}
//             size="small"
//           >
//             Refresh Connection
//           </Button>
//         )}
//       </Stack>
//       <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//         Current P2P connection status and peer communication controls.
//       </Typography>
      
//       <PeerProfilesComponent
//         peerProfiles={peerProfiles}
//         playerProfiles={playerProfiles}
//       />
      
//       {connectionEvents.length > 0 && (
//         <Box style={{ marginTop: '24px' }}>
//           <Stack direction="row" alignItems="center" spacing={1} style={{ marginBottom: '8px' }}>
//             <History style={{ fontSize: 20 }} />
//             <Typography variant="subtitle2" style={{ fontWeight: 'bold' }}>
//               Connection Events
//             </Typography>
//           </Stack>
//           <Paper variant="outlined" style={{ maxHeight: 200, overflow: 'auto' }}>
//             <List>
//               {connectionEvents.slice().reverse().map((event, index) => (
//                 <div key={index} style={{ padding: '8px 16px', borderBottom: '1px solid #eee' }}>
//                   <Stack direction="row" alignItems="center" spacing={1}>
//                     <span>{getEventIcon(event.type)}</span>
//                     <Typography variant="body2">{event.message}</Typography>
//                     <Chip 
//                       label={event.type} 
//                       size="small" 
//                       color={getEventColor(event.type)}
//                       style={{ marginLeft: '8px' }}
//                     />
//                   </Stack>
//                   <Typography variant="caption" style={{ color: '#666', marginTop: '4px', display: 'block' }}>
//                     {event.timestamp.toLocaleTimeString()}
//                   </Typography>
//                 </div>
//               ))}
//             </List>
//           </Paper>
//         </Box>
//       )}
//     </>
//   )
// }
