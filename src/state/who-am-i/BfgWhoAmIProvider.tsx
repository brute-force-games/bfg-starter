import React, { useEffect, useState } from "react";
import { UserLogin } from "dexie-cloud-addon";
import { bfgDb, fetchAppKeyValuesFromDb } from "~/data/bfg-db";
import { BfgWhoAmIContext } from "./BfgWhoAmIContext";
import { DexieCloudEmail } from "~/types/core/branded-values/branded-strings";
import { BfgUserDexieStatus } from "~/types/core/user/user-dexie-status";
import UserInteractionWrapper from "~/pages/sign-in/UserInteractionWrapper";
import { GamePlayerId } from "~/types/core/branded-values/bfg-branded-ids";
import { BfgPlayerIdKey } from "~/types/core/app-key-values/app-key-values";
import { MyPlayerProvider } from "~/data/persisted-player/persisted-player-provider";


export const LOCAL_STORAGE_KEY_DBK_USER_IDENTITY_KEY = "dbk-userIdentity";


export interface BfgWhoAmIProviderProps { 
  blah: string;
}

interface IBfgWhoAmIProviderProps {
  children: React.ReactNode;
}


export const BfgWhoAmIProvider = ({ children }: IBfgWhoAmIProviderProps) => {

  const [currentDexieUser, setCurrentDexieUser] = useState<UserLogin | null>(null);
  const [playerId, setPlayerId] = useState<GamePlayerId | null>(null);

  console.log("BfgWhoAmIProvider: currentDexieUser", currentDexieUser);


  useEffect(() => {
    if (!bfgDb.cloud) {
      console.error("DbkWhoAmIProvider: doneBlocksDb.cloud is not available");
      setCurrentDexieUser(null);
      return;
    }

    bfgDb.cloud.currentUser.subscribe((user) => {
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
  }, []);


  useEffect(() => {
    console.log("BfgWhoAmIProvider: useEffect: Starting effect");
    
    if (!bfgDb) {
      console.error("BfgWhoAmIProvider: bfgDb is not available");
      return;
    }

    // Check if the database is open
    // if (!bfgDb.isOpen()) {
    //   console.error("BfgWhoAmIProvider: Database is not open");
    //   return;
    // }

    const initializeAppKeyValues = async () => {
      try {
        console.log("BfgWhoAmIProvider: useEffect: initializeAppKeyValues: Starting");
        console.log("BfgWhoAmIProvider: useEffect: initializeAppKeyValues: fetching app key values");
        
        const appKeyValues = await fetchAppKeyValuesFromDb(bfgDb);

        console.log("BfgWhoAmIProvider: appKeyValues", appKeyValues);

        if (appKeyValues.appInstanceKeyValues[BfgPlayerIdKey]) {
          setPlayerId(appKeyValues.appInstanceKeyValues[BfgPlayerIdKey]);
          console.log("BfgWhoAmIProvider: Successfully set playerId");
        } else {
          console.log("BfgWhoAmIProvider: No playerId found in appKeyValues");
        }
      } catch (error) {
        console.error("BfgWhoAmIProvider: Error in initializeAppKeyValues:", error);
      }
    };

    console.log("BfgWhoAmIProvider: useEffect: Calling initializeAppKeyValues");
    initializeAppKeyValues();
    console.log("BfgWhoAmIProvider: useEffect: Called initializeAppKeyValues");
  }, []);



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

        playerId,
        profileIds: [],
      }}>
        <UserInteractionWrapper>
          <MyPlayerProvider>
            {children}
          </MyPlayerProvider>
        </UserInteractionWrapper>
    </BfgWhoAmIContext.Provider>
  );
}
