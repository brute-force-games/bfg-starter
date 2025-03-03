import { 
  AppBar, 
  Box, 
  Container, 
  Toolbar, 
  Button 
} from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';

export const Layout = () => {
  const navigate = useNavigate();

  return (
    <>
    <Box sx={{ display: 'flex', width: '100vw', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ width: '100%' }}>
        <Container 
          maxWidth={false}
          disableGutters
          sx={{
            minWidth: 'unset',
            padding: 0,
          }}
        >
          <Toolbar disableGutters>
            <Button 
              color="inherit" 
              onClick={() => navigate('/')}
            >
              Home
            </Button>
            <Button 
              color="inherit" 
              onClick={() => navigate('/dexie-status')}
            >
              Dexie Status
            </Button>
            {/* <Button 
              color="inherit" 
              onClick={() => navigate('/lobby/new')}
            >
              Start New Game
            </Button> */}
            <Button 
              color="inherit" 
              onClick={() => navigate('/my-player-profiles')}
            >
              My Player Profiles
            </Button>
            <Button 
              color="inherit" 
              onClick={() => navigate('/my-friends')}
            >
              My Friends
            </Button>
            <Button 
              color="inherit" 
              onClick={() => navigate('/my-lobbies')}
            >
              My Lobbies
            </Button>
            <Button 
              color="inherit" 
              onClick={() => navigate('/my-games')}
            >
              My Games
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      {/* <Container 
        component="main"
        disableGutters
        sx={{ 
          flex: 1, 
          display: 'flex',
          flexDirection: 'column',
          py: 4,
          padding: 0,
          minWidth: 'unset',
        }}
      > */}
        <Outlet />
      {/* </Container> */}
    </Box>
    </>
  );
}; 
