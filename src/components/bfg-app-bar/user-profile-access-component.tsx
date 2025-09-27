import { Box, Tooltip, IconButton, Avatar } from "@mui/material"
import { DbkAppBarMenu, DbkAppBarMenuItem } from "./app-bar-menu"
import { useState } from "react";
// import { doneBlocksDb } from "~/data/dexie-db/doneblock-db";
// import md5 from 'md5';
// import { BfgUserCompositeIdentity } from "~/data/zod-types/schemas/shared/user/user-identity";
// import { useEnvSettings } from "~/env/EnvSettingsContext";
// import { bfgDb } from "~/data/bfg-db";
// import { DEXIE_STATUS_PAGE_PATH } from "~/pages/dexie-status/dexie-status-page";
// import { DbkUserDexieStatus } from "~/data/zod-types/schemas/shared/user/user-dexie-status";
// import { MANAGE_SYNC_PAGE_PATH } from "~/pages/manage-sync/manage-sync";
// import { useEnvSettings } from "~/data/providers/env/EnvSettingsProvider";
// import { createProfileExportFilename } from "~/data/export/export-filenames";
// import { useAllMyProjectsDataContext } from "~/data/data-types";
// import { ACTIVE_PROFILE_EXPORT_VERSION } from "~/data/zod-types/schemas/import-export/versions";
// import { createProfileExportData } from "~/pages/my-profile/my-profile-utils";
// import { downloadExportData } from "~/data/export/download-export-data";


interface UserProfileAccessComponentProps {
  localStatus: {
    hasLocalUser: boolean;
    isLoggedIn: boolean;
    localEmailValue: string | null;
    emailVerified: boolean;
    licenseType: string | null;
    licenseStatus: string | null;
    lastLogin: Date | null;
  };
}

export const UserProfileAccessComponent = (props: UserProfileAccessComponentProps) => {

  // const { envSettings } = useEnvSettings();
  // const { myProjects, exportSavedProject } = useAllMyProjectsDataContext();

  const { localStatus } = props;

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);


  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  
  // const userName = dbkIdentity.dbkUserHandle;
  const emailToUse = localStatus?.localEmailValue;
  const userName = emailToUse || 'Local User';
  // const isCloudEnabled = envSettings.cloudConfig.isCloudEnabled;

  // const getCloudActionMenuItem = () => {
  //   // Local-only mode - no cloud functionality
  //   const localOnlyMenuItem = { 
  //     type: 'menu-action' as const, 
  //     title: 'Local Mode', 
  //     action: () => console.log('Running in local-only mode') 
  //   };

  //   return localOnlyMenuItem;
  // }

  // const doDownloadProfileBackup = async () => {
  //   const exportTime = new Date();
  //   const exportFilename = createProfileExportFilename(exportTime, dbkIdentity, ACTIVE_PROFILE_EXPORT_VERSION);
  
  //   const dataToExport = await createProfileExportData(exportTime, dbkIdentity, myProjects, exportSavedProject);
  //   const exportContent = JSON.stringify(dataToExport, null, 2);

  //   downloadExportData(exportContent, exportFilename);
  // }

  // const cloudActionMenuItem = getCloudActionMenuItem();

  const menuItems: DbkAppBarMenuItem[] = [
    { type: 'menu-label', title: userName },
    { type: 'menu-divider' },
    // { type: 'menu-link', title: 'Player Profile', link: { to: '/my-player-profiles' } },
    // { type: 'menu-link', title: 'Gaming Groups', link: { to: '/gaming-groups' } },
    // { type: 'menu-link', title: 'My Friends', link: { to: '/my-friends' } },
    // { type: 'menu-link', title: 'Dexie Data', link: { to: DEXIE_DATA_PAGE_ROUTE } },
    // { type: 'menu-link', title: 'Dexie Status', link: { to: '/dexie-status', } },
    { type: 'menu-anchor', title: 'BFG Starter on Github', href: 'https://github.com/brute-force-games/bfg-starter' },
    // { type: 'menu-divider' },
    // { type: 'menu-action', title: 'Download Profile Backup', action: doDownloadProfileBackup },
    { type: 'menu-divider' },
    // cloudActionMenuItem,
  ];

  // const getUserImageUrl = () => {
  //   if (!emailToUse) {
  //     return `https://ui-avatars.com/api/?name=${userName}`;
  //   }

  //   const hash = md5(emailToUse.toLowerCase().trim());
  //   return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=200`;
  // };

  // const avatarImageUrl = getUserImageUrl();
  const avatarImageUrl = '';
  
  return (

    <Box sx={{ flexGrow: 0 }}>
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