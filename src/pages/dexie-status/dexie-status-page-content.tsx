import { Typography } from "@mui/material";
import { UserLogin } from "dexie-cloud-addon";
import { useState, useEffect } from "react";
import { bfgDb } from "../../data/bfg-db";
import { useEnvSettings } from "../../env/EnvSettingsContext";
import { useBfgWhoAmIContext } from "~/state/who-am-i/BfgWhoAmIContext";
import { BfgWhoAmIProvider } from "~/state/who-am-i/BfgWhoAmIProvider";
import { useObservable } from "dexie-react-hooks";
import { DexieInvitation } from "./dexie-invitation";


// export const DEXIE_STATUS_PAGE_PATH = '/dexie-status';


export const DexieStatusPageContent = () => {

  const { dexieStatus } = useBfgWhoAmIContext();
  const { envSettings } = useEnvSettings();

  const [currentUser, setCurrentUser] = useState<UserLogin | null>(null);

  const cloudConfig = envSettings.cloudConfig;
  const isCloudEnabled = cloudConfig.isCloudEnabled;

  const allInvites = useObservable(bfgDb.cloud.invites)
  const invites = allInvites?.filter((i) => !i.accepted && !i.rejected)



  useEffect(() => {
    const subscription = bfgDb.cloud.currentUser.subscribe((user) => {
      setCurrentUser(user);
      bfgDb.cloud.login();
      bfgDb.cloud.sync();
    });

    return () => {
      subscription.unsubscribe();
    }
  }, []);


  if (!cloudConfig.isCloudEnabled) {
    return <div>Cloud Disabled</div>;
  }

  const dexieCloudUrl = cloudConfig.syncUrl;

  console.log("ManageSyncPage: dexieCloudUrl", dexieCloudUrl);

  const handleLogin = async () => {
    console.log("ManageSyncPage: handleLogin");
    await bfgDb.cloud.login();
    await bfgDb.cloud.sync();
    console.log("ManageSyncPage: handleLogin: after sync");
  }

  const handleLogout = async () => {
    console.log("ManageSyncPage: handleLogout");
    await bfgDb.cloud.sync();
    await bfgDb.cloud.logout();
  }


  return (
    <>
      <BfgWhoAmIProvider>
        <>
          <title>{envSettings.pageTitlePrefix} BFG - Login</title>
          <meta name="description" content="DoneBlock" />
        </>
        <>
          <Typography variant="h6">
            User Handle:
            {/* {identity.dbkUserHandle} */}
          </Typography>
          <Typography variant="h6">
            Invites from:
            {invites?.map((i) => <DexieInvitation invitation={i} />)}
          </Typography>
          <Typography variant="h6">
            {isCloudEnabled ? "Cloud Enabled" : "Cloud Disabled"}
          </Typography>
          <Typography variant="h6">
            Dexie Cloud URL: {dexieCloudUrl}
          </Typography>
          <Typography variant="h6">
            {currentUser?.isLoggedIn ? "Logged In to Sync" : "Not Logged In to Sync"}
          </Typography>
          <Typography variant="h6">
            Sync Email: {dexieStatus.dexieEmailValue}
          </Typography>

          {
            cloudConfig.isCloudEnabled && 
            (currentUser?.isLoggedIn ? (
                <button onClick={handleLogout}>Logout</button>
              ) : (
                <button onClick={handleLogin}>Login</button>
              )
            )
          }
        </>
      </BfgWhoAmIProvider>
    </>
  );
};
