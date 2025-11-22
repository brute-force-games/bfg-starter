import { z } from 'zod';
import { createFileRoute } from '@tanstack/react-router'
import { GameTableAccessRoleSchema } from '@bfg-engine/models/game-roles';
import { BfgGameTableIdToolbox } from '@bfg-engine/models/types/bfg-branded-uuids';


const paramsSchema = z.object({
  role: GameTableAccessRoleSchema,
  tableId: BfgGameTableIdToolbox.idSchema,
})

// const GameDetailsRoute = () => {
  
//   const bfgGameRoom = useBfgGameRoomForContextRole();

//   if (!bfgGameRoom) {
//     return (
//       <Container style={{ padding: '24px' }}>
//         <Stack spacing={3}>
//           <Typography variant="h3">Loading Game...</Typography>
//           <Typography variant="body1" color="secondary">
//             Loading P2P Game...
//           </Typography>
//         </Stack>
//       </Container>
//     )
//   }
  
//   // const { publicGameDetails, allowedRoles, accessRole } = bfgGameRoom;
//   const { gameRoom } = bfgGameRoom;
//   const { publicGameDetails, allowedRoles, accessRole } = gameRoom;

//   if (!publicGameDetails) {
//     return <div>Public game details not found</div>;
//   }

//   if (!allowedRoles.includes(accessRole)) {
//     return <div>You are not allowed to access this game table as a {accessRole}</div>;
//   }
  
//   if (accessRole === 'host') {
    
//     return (
//       <HostedGameDetailsPage
//         {...gameRoom}
//       />
//     )
//   }

//   if (accessRole === 'play') {
    
//     return (
//       <PlayerGameDetailsPage
//         {...gameRoom}
//       />
//     )
//   }
//   if (accessRole === 'watch') {
//     return (
//       <ObserverGameDetailsPage
//         {...gameRoom}
//       />
//     )
//   }

//   throw new Error(`Invalid game table access role: ${accessRole}`);
// }


export const Route = createFileRoute('/xgames/$role/$tableId/game-details')({
  // component: GameDetailsRoute,
  component: () => <div>Hello Game Details Page</div>,
  params: {
    parse: (params) => paramsSchema.parse(params),
    stringify: (params) => ({ role: params.role, tableId: params.tableId }),
  },
})
