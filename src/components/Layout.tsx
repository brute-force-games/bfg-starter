// import { 
//   Box} from '@mui/material';
// import { Outlet } from 'react-router-dom';
// import { BruteForceGamesAppBar } from './bfg-app-bar/app-bar';
// import { useBfgWhoAmIContext } from '~/state/who-am-i/BfgWhoAmIContext';

// export const Layout = () => {
//   // const navigate = useNavigate();

//   const bfgWhoAmIContext = useBfgWhoAmIContext();

//   console.log("bfgWhoAmIContext", bfgWhoAmIContext);
//   return (
//     <>
//     <Box sx={{ display: 'flex', width: '100vw', flexDirection: 'column', minHeight: '100vh' }}>
//       <BruteForceGamesAppBar />

//       {/* <AppBar position="static" sx={{ width: '100%' }}>
//         <Container 
//           maxWidth={false}
//           disableGutters
//           sx={{
//             minWidth: 'unset',
//             padding: 0,
//           }}
//         >
//           <Toolbar disableGutters>
//             <Button 
//               color="inherit" 
//               onClick={() => navigate('/')}
//             >
//               Home
//             </Button>
//             <Button 
//               color="inherit" 
//               onClick={() => navigate('/dexie-status')}
//             >
//               Dexie Status
//             </Button>
//             <Button 
//               color="inherit" 
//               onClick={() => navigate('/my-player-profiles')}
//             >
//               My Player Profiles
//             </Button>
//             <Button 
//               color="inherit" 
//               onClick={() => navigate('/my-friends')}
//             >
//               My Friends
//             </Button>
//             <Button 
//               color="inherit" 
//               onClick={() => navigate('/game-tables')}
//             >
//               Game Tables
//             </Button>
//           </Toolbar>
//         </Container>
//       </AppBar> */}

//       {/* <Container 
//         component="main"
//         disableGutters
//         sx={{ 
//           flex: 1, 
//           display: 'flex',
//           flexDirection: 'column',
//           py: 4,
//           padding: 0,
//           minWidth: 'unset',
//         }}
//       > */}
//         <Outlet />
//       {/* </Container> */}
//     </Box>
//     </>
//   );
// }; 
