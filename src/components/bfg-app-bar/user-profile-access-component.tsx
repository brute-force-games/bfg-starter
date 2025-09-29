import { Box, Tooltip, IconButton, Avatar } from "@mui/material"
import { DbkAppBarMenu, DbkAppBarMenuItem } from "./app-bar-menu"
import { useState } from "react";
import { PrivatePlayerProfile } from "~/models/private-player-profile";


interface UserProfileAccessComponentProps {
  myPlayerProfiles: PrivatePlayerProfile[];
  myDefaultPlayerProfile: PrivatePlayerProfile | null;
}

export const UserProfileAccessComponent = (props: UserProfileAccessComponentProps) => {

  const { myPlayerProfiles, myDefaultPlayerProfile } = props;

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);


  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const userName = myDefaultPlayerProfile?.handle || myPlayerProfiles[0]?.handle || 'Local User';

  const menuItems: DbkAppBarMenuItem[] = [
    { type: 'menu-label', title: userName },
    { type: 'menu-divider' },
    { type: 'menu-link', title: 'Player Profile', link: { to: '/my-player-profiles' } },
    // { type: 'menu-link', title: 'Gaming Groups', link: { to: '/gaming-groups' } },
    // { type: 'menu-link', title: 'My Friends', link: { to: '/my-friends' } },
    { type: 'menu-anchor', title: 'BFG Starter on Github', href: 'https://github.com/brute-force-games/bfg-starter' },
    // { type: 'menu-action', title: 'Download Profile Backup', action: doDownloadProfileBackup },
  ];
  
  const avatarImageUrl = '';
  
  return (
    <Box sx={{ 
      flexGrow: 0,
      flexShrink: 0,
      minWidth: 'fit-content'
    }}>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar src={avatarImageUrl} alt={"username"} />
        </IconButton>
      </Tooltip>
      <DbkAppBarMenu
        anchorElUser={anchorElUser}
        userMenuItems={menuItems}
        handleCloseUserMenu={handleCloseUserMenu}
      />
    </Box>  
  )
}
