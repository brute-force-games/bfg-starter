import React, { useEffect, useState } from "react";
import { UserLogin } from "dexie-cloud-addon";
import { bfgDb } from "~/data/bfg-db";
import { BfgWhoAmIContext } from "./BfgWhoAmIContext";
import { DexieCloudEmail } from "~/types/core/branded-values/branded-strings";
import { BfgUserDexieStatus } from "~/types/core/user/user-dexie-status";
import UserInteractionWrapper from "~/pages/sign-in/UserInteractionWrapper";
import { PlayerProfileId } from "~/types/core/branded-values/bfg-branded-ids";
import { MyPlayerProvider } from "~/data/persisted-player/persisted-player-provider";
import { useLivePlayerProfiles } from "~/data/bfg-db-player-profiles";
import { CloudNotification } from "~/types/core/player/notifications";
import { useObservable } from "dexie-react-hooks";
// import { fetchAppKeyValues } from "~/data/app-key-values";
// import { setPlayerIdAppKey, useLiveAppKeys } from "~/data/bfg-db-appkeys";


// export const LOCAL_STORAGE_KEY_DBK_USER_IDENTITY_KEY = "dbk-userIdentity";


export interface BfgWhoAmIProviderProps { 
  blah: string;
}

interface IBfgWhoAmIProviderProps {
  children: React.ReactNode;
}


export const BfgWhoAmIProvider = ({ children }: IBfgWhoAmIProviderProps) => {

  // const { myPlayerId } = useMyPlayerContext();

  const [currentDexieUser, setCurrentDexieUser] = useState<UserLogin | null>(null);
  // const [ , setTimer] = useState(0);
  // const [playerId, setPlayerId] = useState<GamePlayerId | null>(null);


  // const appKeys = useLiveAppKeys();
  // console.log("appKeys", appKeys);

  // const playerId = appKeys?.find((appKey) => appKey.appKey === BfgPlayerIdKey)?.appEncodedValue as GamePlayerId;
  // console.log("playerId", playerId);

  const allPlayerProfiles = useLivePlayerProfiles();

  const allPlayerProfileIds = allPlayerProfiles
    ?.map((playerProfile) => playerProfile.id)
    .filter((id) => id !== null) as PlayerProfileId[];

  const defaultPlayerProfileId = allPlayerProfiles
    ?.find((playerProfile) => playerProfile.isDefault)?.id as PlayerProfileId | undefined
    ?? null;


  useEffect(() => {
    if (!bfgDb.cloud) {
      console.error("DbkWhoAmIProvider: doneBlocksDb.cloud is not available");
      setCurrentDexieUser(null);
      return;
    }

    // if (!playerId) {
    //   // console.error("DbkWhoAmIProvider: playerId is not available");
    //   // setCurrentDexieUser(null);
    //   const newPlayerId = BfgGamePlayerId.createId();
    //   console.log("DbkWhoAmIProvider: setting newPlayerId", newPlayerId);
    //   setPlayerIdAppKey(newPlayerId as GamePlayerId);
    //   return;
    // }

    const userSubscription = bfgDb.cloud.currentUser.subscribe(async (user) => {
      if (user.isLoggedIn) {
        setCurrentDexieUser(user);

        const userName = user.name;
        const userId = user.userId;

        if (!userName || !userId) {
          console.error("User name or user id is not set");
          return;
        }

      } else {
        setCurrentDexieUser(null);
      }
    });

    return () => {
      userSubscription.unsubscribe();
    }
  }, []);


  const allInvites = useObservable(bfgDb.cloud.invites);

  const getNotifications = (): CloudNotification[] => {
    if (!allInvites) {
      return [];
    }

    const notifications = allInvites
      .filter((i) => !i.accepted && !i.rejected)
      .map((i) => ({
        id: i.id,
        // message: `An invitation from ${i.invitedBy?.name}`,
        // message: `Play with ${i.invitedBy?.name}`,
        message: `Play ${i.name}`,
        from: i.invitedBy?.name ?? '',
        to: i.email ?? '',
        createdAt: i.invitedDate ?? new Date(),
      }));

    return notifications;
  }

  const notifications = getNotifications();

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setTimer(prev => prev + 1);
  //     bfgDb.cloud.sync({purpose: 'pull', wait: false}) 
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, []);


  // useEffect(() => {
  //   console.log("BfgWhoAmIProvider: useEffect: Starting effect");
    
  //   if (!bfgDb) {
  //     console.error("BfgWhoAmIProvider: bfgDb is not available");
  //     return;
  //   }

  //   // Check if the database is open
  //   if (!bfgDb.isOpen()) {
  //     console.error("BfgWhoAmIProvider: Database is not open");
  //     // return;
  //   }

  //   const initializeAppKeyValues = async () => {
  //     try {
  //       console.log("BfgWhoAmIProvider: useEffect: initializeAppKeyValues: Starting");
  //       console.log("BfgWhoAmIProvider: useEffect: initializeAppKeyValues: fetching app key values");
        
  //       // const appKeyValues = await fetchAppKeyValues(bfgDb);
  //       const appKeyValues = await fetchAppKeyValuesFromDb(bfgDb);

  //       console.log("BfgWhoAmIProvider: appKeyValues", appKeyValues);

  //       if (appKeyValues.appInstanceKeyValues[BfgPlayerIdKey]) {
  //         setPlayerId(appKeyValues.appInstanceKeyValues[BfgPlayerIdKey]);
  //         console.log("BfgWhoAmIProvider: Successfully set playerId");
  //       } else {
  //         console.log("BfgWhoAmIProvider: No playerId found in appKeyValues");
  //       }
  //     } catch (error) {
  //       console.error("BfgWhoAmIProvider: Error in initializeAppKeyValues:", error);
  //     }
  //   };

  //   console.log("BfgWhoAmIProvider: useEffect: Calling initializeAppKeyValues");
  //   initializeAppKeyValues();
  //   console.log("BfgWhoAmIProvider: useEffect: Called initializeAppKeyValues");
  // }, []);



  const dexieEmailValue = currentDexieUser?.email as DexieCloudEmail;
  const emailVerified = currentDexieUser?.claims?.email_verified === true;
  const hasDexieUser = currentDexieUser !== null;
  const isLoggedIn = currentDexieUser?.isLoggedIn === true;
  const lastLogin = currentDexieUser?.lastLogin ?? null;
  const licenseType = currentDexieUser?.license?.type;
  const licenseStatus = currentDexieUser?.license?.status;

  console.log("currentDexieUser", currentDexieUser);
  


  // https://dexie.org/cloud/docs/UserLogin
  const dexieStatus: BfgUserDexieStatus = {
    hasDexieUser,
    // dexieProgress,
    isLoggedIn,
    dexieEmailValue,
    emailVerified,
    licenseType,
    licenseStatus,
    lastLogin,
  };
  
  return (
    <BfgWhoAmIContext.Provider
      value={{
        dexieStatus,
        
        myNotifications: notifications,
        
        profileIds: allPlayerProfileIds,
        defaultPlayerProfileId,
      }}>
        <UserInteractionWrapper>
          <MyPlayerProvider>
            {children}
          </MyPlayerProvider>
        </UserInteractionWrapper>
    </BfgWhoAmIContext.Provider>
  );
}
