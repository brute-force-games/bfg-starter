import { Box, Button, Typography } from "@mui/material";
import { Toolbar } from "@mui/material";
import { AppBar } from "@mui/material";
import { Link } from '@tanstack/react-router';
import { useMyDefaultPlayerProfile, useMyPlayerProfiles } from "~/hooks/stores/use-my-player-profiles-store";
import { UserProfileAccessComponent } from "./user-profile-access-component";


export const BruteForceGamesAppBar = () => {
  
  const myPlayerProfiles = useMyPlayerProfiles();
  const myDefaultPlayerProfile = useMyDefaultPlayerProfile();
  
  return (
    <AppBar 
      position="static" 
      sx={{ 
        width: '100%',
        minWidth: '100vw',
        overflow: 'visible'
      }}
    >
      <Toolbar sx={{ 
        width: '100%',
        maxWidth: 'none',
        px: { xs: 2, sm: 3, md: 4 },
        overflow: 'visible',
        minHeight: '64px'
      }}>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: 'bold' }}
        >
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Brute Force Games
          </Link>
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          gap: 2,
          flexShrink: 1,
          minWidth: 0
        }}>
          <Link to="/new-lobby" style={{ textDecoration: 'none' }}>
            <Button color="inherit">Play Now</Button>
          </Link>
          {/* <Link to="/games-list" style={{ textDecoration: 'none' }}>
            <Button color="inherit">Games List</Button>
          </Link> */}
          <Link to="/my-hosted-games" style={{ textDecoration: 'none' }}>
            <Button color="inherit">My Hosted Games</Button>
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
        <UserProfileAccessComponent
          myPlayerProfiles={myPlayerProfiles}
          myDefaultPlayerProfile={myDefaultPlayerProfile}
        />

        {/* User profile access removed - local-only mode */}

      </Toolbar>
    </AppBar>
  )
}
