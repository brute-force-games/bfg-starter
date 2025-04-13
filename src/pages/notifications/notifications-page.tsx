import { Box, Typography } from "@mui/material";
import { NotificationsComponent } from "~/components/notifications-component";


export const NotificationsPage = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <Typography variant="h3">My Notifications</Typography>
      <NotificationsComponent />
    </Box>
  );
};
