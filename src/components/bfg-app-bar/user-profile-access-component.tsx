import { Box, Tooltip, IconButton, Avatar } from "@mui/material"
import { DbkAppBarMenu, DbkAppBarMenuItem } from "./app-bar-menu"
import { useState } from "react";
// import { doneBlocksDb } from "~/data/dexie-db/doneblock-db";
import md5 from 'md5';
// import { BfgUserCompositeIdentity } from "~/data/zod-types/schemas/shared/user/user-identity";
import { BfgUserDexieStatus } from "~/types/core/user/user-dexie-status";
import { useEnvSettings } from "~/env/EnvSettingsContext";
import { bfgDb } from "~/data/bfg-db";
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
  // dbkIdentity: DbkUserCompositeIdentity;
  dexieStatus: BfgUserDexieStatus;
}

export const UserProfileAccessComponent = (props: UserProfileAccessComponentProps) => {

  const { envSettings } = useEnvSettings();
  // const { myProjects, exportSavedProject } = useAllMyProjectsDataContext();

  const { dexieStatus } = props;

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);


  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  
  // const userName = dbkIdentity.dbkUserHandle;
  const emailToUse = dexieStatus?.dexieEmailValue;
  const userName = emailToUse || '???';
  const isCloudEnabled = envSettings.cloudConfig.isCloudEnabled;

  const getCloudActionMenuItem = () => {
    if (isCloudEnabled) {
      const logInOrOutMenuItem = dexieStatus.isLoggedIn ?
        { type: 'menu-action' as const, title: 'Log Out', action: () => bfgDb.cloud.logout() } :
        { type: 'menu-action' as const, title: 'Log In', action: () => bfgDb.cloud.login() };

      return logInOrOutMenuItem;
    }
    
    // return { type: 'menu-link' as const, title: 'Dexie Status', link: { to: DEXIE_STATUS_PAGE_PATH } };
    return { type: 'menu-link' as const, title: 'Dexie Status', link: { to: '/dexie-status' } };
    
  }

  // const doDownloadProfileBackup = async () => {
  //   const exportTime = new Date();
  //   const exportFilename = createProfileExportFilename(exportTime, dbkIdentity, ACTIVE_PROFILE_EXPORT_VERSION);
  
  //   const dataToExport = await createProfileExportData(exportTime, dbkIdentity, myProjects, exportSavedProject);
  //   const exportContent = JSON.stringify(dataToExport, null, 2);

  //   downloadExportData(exportContent, exportFilename);
  // }

  const cloudActionMenuItem = getCloudActionMenuItem();

  const menuItems: DbkAppBarMenuItem[] = [
    { type: 'menu-label', title: userName },
    { type: 'menu-divider' },
    { type: 'menu-link', title: 'My Profile', link: { to: '/my-profile' } },
    { type: 'menu-link', title: 'My Settings', link: { to: '/user-settings' } },
    { type: 'menu-link', title: 'About DoneBlock', link: { to: '/about' } },
    // { type: 'menu-divider' },
    // { type: 'menu-action', title: 'Download Profile Backup', action: doDownloadProfileBackup },
    { type: 'menu-divider' },
    cloudActionMenuItem,
  ];

  const getUserImageUrl = () => {
    if (!emailToUse) {
      return `https://ui-avatars.com/api/?name=${userName}`;
    }

    const hash = md5(emailToUse.toLowerCase().trim());
    return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=200`;
  };

  const avatarImageUrl = getUserImageUrl();
  
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