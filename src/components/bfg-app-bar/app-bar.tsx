import { Box, Button, Typography } from "@mui/material";
import { Toolbar } from "@mui/material";
import { AppBar } from "@mui/material";
import { Link } from 'react-router';
import { UserProfileAccessComponent } from "./user-profile-access-component";
import { useBfgWhoAmIContext } from "~/state/who-am-i/BfgWhoAmIContext";


export const BruteForceGamesAppBar = () => {

  const { dexieStatus } = useBfgWhoAmIContext();

  
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: 'bold' }}
        >
          <Link to="/" style={{ textDecoration: 'none' }}>
            Brute Force Games
          </Link>
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Link to="/my-doneblocks" style={{ textDecoration: 'none' }}>
            <Button color="inherit">My DoneBlocks</Button>
          </Link>
          <Link to="/doneblock-templates" style={{ textDecoration: 'none' }}>
            <Button color="inherit">DB Templates</Button>
          </Link>
        </Box>

        <UserProfileAccessComponent
          // dbkIdentity={identity}
          dexieStatus={dexieStatus}
        />

      </Toolbar>
    </AppBar>
  )
}
