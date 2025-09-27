import { Box, Button, Typography } from "@mui/material";
import { Toolbar } from "@mui/material";
import { AppBar } from "@mui/material";
import { Link } from '@tanstack/react-router';
import { useMyPlayerProfiles } from "~/hooks/stores/use-my-player-profiles-store";


export const BruteForceGamesAppBar = () => {

  // console.log("BruteForceGamesAppBar");

  // Use the "risky" context hook that returns null if context isn't available
  // const contextData = useRiskyBfgWhoAmIContext();
  const myPlayerProfiles = useMyPlayerProfiles();

  
  return (
    <AppBar 
      position="static" 
      sx={{ 
        width: '100%',
        minWidth: '100vw'
      }}
    >
      <Toolbar sx={{ width: '100%' }}>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: 'bold' }}
        >
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Brute Force Games
          </Link>
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          
          <Link to="/start-new-game" style={{ textDecoration: 'none' }}>
            <Button color="inherit">Start New Game</Button>
          </Link>
          <Link to="/new-lobby" style={{ textDecoration: 'none' }}>
            <Button color="inherit">Set Up New Lobby</Button>
          </Link>
          <Link to="/my-hosted-games" style={{ textDecoration: 'none' }}>
            <Button color="inherit">My Hosted Games</Button>
          </Link>
          <Link to="/hosted-games-demo" style={{ textDecoration: 'none' }}>
            <Button color="inherit">Games Demo</Button>
          </Link>
          {/* Always show Player Profiles link, but disable if no profiles */}
          {myPlayerProfiles && myPlayerProfiles.length > 0 ? (
            <Link to="/my-player-profiles" style={{ textDecoration: 'none' }}>
              <Button color="inherit">Player Profiles</Button>
            </Link>
          ) : (
            <Button color="inherit" disabled>
              Player Profiles
            </Button>
          )}
          {/* <Link to="/games-shelf" style={{ textDecoration: 'none' }}>
            <Button color="inherit">Games Shelf</Button>
          </Link>
          <Link to="/active-tables" style={{ textDecoration: 'none' }}>
            <Button color="inherit">Active Tables</Button>
          </Link>
          <Link to="/finished-games" style={{ textDecoration: 'none' }}>
            <Button color="inherit">Finished Games</Button>
          </Link>
          <Link to="/notifications" style={{ textDecoration: 'none' }}>
            <Button color="inherit">{notificationLinkTitle}</Button>
          </Link> */}

        </Box>

        {/* User profile access removed - local-only mode */}

      </Toolbar>
    </AppBar>
  )
}
