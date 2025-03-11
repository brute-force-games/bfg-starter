import { Box, Button, Typography } from "@mui/material";
import { Toolbar } from "@mui/material";
import { AppBar } from "@mui/material";
import { Link } from 'react-router';
import { UserProfileAccessComponent } from "./user-profile-access-component";
import { useBfgWhoAmIContext } from "~/state/who-am-i/BfgWhoAmIContext";


export const BruteForceGamesAppBar = () => {

  const { dexieStatus, myNotifications } = useBfgWhoAmIContext();
  // const bfgWhoAmIContext = useRiskyBfgWhoAmIContext();

  // const allInvites = useObservable(bfgDb.cloud.invites);

  // const getNotifications = (): CloudNotification[] => {
  //   if (!allInvites) {
  //     return [];
  //   }

  //   const notifications = allInvites
  //     .filter((i) => !i.accepted && !i.rejected)
  //     .map((i) => ({
  //       id: i.id,
  //       message: `An invitation from ${i.invitedBy?.name}`,
  //       from: i.invitedBy?.email ?? '',
  //       to: i.email ?? '',
  //       createdAt: i.invitedDate ?? new Date(),
  //     }));

  //   return notifications;
  // }

  // const notifications = getNotifications();
  const notificationsCount = myNotifications.length;

  const notificationLinkTitle = notificationsCount > 0 ? `Notifications (${notificationsCount})` : "Notifications";

  
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
          <Link to="/games-shelf" style={{ textDecoration: 'none' }}>
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
          </Link>

        </Box>

        <UserProfileAccessComponent
          dexieStatus={dexieStatus}
        />

      </Toolbar>
    </AppBar>
  )
}
