import React, { createContext, useEffect, useState } from "react";
import { UserLogin } from "dexie-cloud-addon";

// import { BfgUserCompositeIdentity } from "~/data/zod-types/schemas/shared/user/user-identity";
// import { useDexieEnvironment } from "../DexieEnvironmentProvider";
// import { DbkAppKeyValue, DbkUserIdKey, DbkUserHandleKey } from "~/data/zod-types/schemas/app-key-values";
// import { dbkAppKvParseString } from "~/data/serdeser/deser-utils";
// import { dbkUpdateStringAppKv } from "~/data/serdeser/ser-utils";
// import { DbkUserHandle, DbkUserId, DexieCloudEmail } from "~/data/zod-types/branded-types/branded-strings";
// import { generateDbkUserId } from "~/data/app-instance/user-handle-generator";
// import { DbkUserDexieProgress, DbkUserDexieStatus } from "~/data/zod-types/schemas/shared/user/user-dexie-status";
import { bfgDb } from "~/data/bfg-db";
import { BfgWhoAmIContextType } from "./BfgWhoAmIContext";
import { DexieCloudEmail } from "~/types/core/branded-values/branded-strings";
import { BfgUserDexieStatus } from "~/types/core/user/user-dexie-status";


export const LOCAL_STORAGE_KEY_DBK_USER_IDENTITY_KEY = "dbk-userIdentity";


// export interface ISetUserIdentity {
//   dbkUserHandle: DbkUserHandle;
//   // dexieCloudEmail: DexieCloudEmail | null;
// }


// export interface BfgWhoAmIContextType {
//   // identity: DbkUserCompositeIdentity;
//   dexieStatus: DbkUserDexieStatus;

//   // setAndPersistUserIdentity: (newIdentity: DbkUserCompositeIdentity) => void;
// }


export interface BfgWhoAmIProviderProps { 
  blah: string;
}

const BfgWhoAmIContext = createContext<BfgWhoAmIContextType | undefined>(undefined);

interface IBfgWhoAmIProviderProps {
  children: React.ReactNode;
}


export const BfgWhoAmIProvider = ({ children }: IBfgWhoAmIProviderProps) => {

  // const { doneBlocksDb } = useDexieEnvironment();

  // const [userHandleKvValue, setUserHandleKvValue] = useState<DbkAppKeyValue | null>(null);
  // const [userIdKvValue, setUserIdKvValue] = useState<DbkAppKeyValue | null>(null);

  // const [userHandle, setUserHandle] = useState<DbkUserHandle | null>(null);
  // const [userId, setUserId] = useState<DbkUserId | null>(null);

  const [currentDexieUser, setCurrentDexieUser] = useState<UserLogin | null>(null);

  console.log("DbkWhoAmIProvider: currentDexieUser", currentDexieUser);


  // useLiveQuery(
  //   async () => {

  //     const userIdRowFromDb = await bfgDb
  //       .dbkKeyValues
  //       .where('appKey')
  //       .equals(DbkUserIdKey)
  //       .first();

  //     if (userIdRowFromDb) {
  //       const parsedValue = dbkAppKvParseString(userIdRowFromDb);
  //       setUserIdKvValue(userIdRowFromDb);
  //       setUserId(parsedValue as DbkUserId);
  //     } else {
  //       const newUserId = generateDbkUserId();
  //       const newUserIdKvValue: DbkAppKeyValue = {
  //         appKey: DbkUserIdKey,
  //         appEncodedValue: newUserId,
  //         appEncodedTypeDescription: 'DbkUserId',
  //         appValueEncoding: 'string',
  //       }
  //       doneBlocksDb.dbkKeyValues.add(newUserIdKvValue);
  //       setUserIdKvValue(newUserIdKvValue);
  //       setUserId(newUserId);
  //     }
  //   },
  //   []
  // );

  // useLiveQuery(
  //   async () => {

  //     const userHandleRowFromDb = await doneBlocksDb
  //       .dbkKeyValues
  //       .where('appKey')
  //       .equals(DbkUserHandleKey)
  //       .first();

  //     if (userHandleRowFromDb) {
  //       const parsedValue = dbkAppKvParseString(userHandleRowFromDb);
  //       setUserHandleKvValue(userHandleRowFromDb);
  //       setUserHandle(parsedValue as DbkUserHandle);
  //     }
  //   },
  //   []
  // );


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



  // const setAndPersistUserIdentity = async (newIdentity: ISetUserIdentity) => {
  //   console.log("setting and persisting user identity", newIdentity);

  //   if (!userIdKvValue) {
  //     console.log('UserSettingsProvider: no user id found when setting/persisting user identity');
      
  //     const newUserId = generateDbkUserId();
  //     const newUserIdKvValue: DbkAppKeyValue = {
  //       appKey: DbkUserIdKey,
  //       appEncodedValue: newUserId,
  //       appEncodedTypeDescription: 'DbkUserId',
  //       appValueEncoding: 'string',
  //     }
  //     doneBlocksDb.dbkKeyValues.add(newUserIdKvValue);

  //     setUserIdKvValue(newUserIdKvValue);
  //     setUserId(newUserId);
  //   } else {
  //     // Don't set update the user id kv value if it already exists
  //   }

  //   if (!userHandleKvValue) {
  //     console.log('UserSettingsProvider: no user handle found when setting/persisting user identity');

  //     const newUserHandleKvValue: DbkAppKeyValue = {
  //       appKey: DbkUserHandleKey,
  //       appEncodedValue: newIdentity.dbkUserHandle,
  //       appEncodedTypeDescription: 'DbkUserHandle',
  //       appValueEncoding: 'string',
  //     }
  //     doneBlocksDb.dbkKeyValues.add(newUserHandleKvValue);

  //     setUserHandleKvValue(newUserHandleKvValue);
  //     setUserHandle(newIdentity.dbkUserHandle);
      
  //   } else {
  //     const updatedUserHandleKvValue = dbkUpdateStringAppKv(newIdentity.dbkUserHandle, userHandleKvValue);
  //     doneBlocksDb.dbkKeyValues.update(userHandleKvValue, updatedUserHandleKvValue);  
  //   }

  //   // if (!userDexieCloudEmailKvValue) {
  //   //   console.error('UserSettingsProvider: no dexie cloud email kv value found when persisting user identity');
  //   //   return;
  //   // }

  //   // if (newIdentity.dexieCloudEmail) {
  //   //   const updatedDexieCloudEmailKvValue = dbkUpdateStringAppKv(newIdentity.dexieCloudEmail, userDexieCloudEmailKvValue);
  //   //   doneBlocksDb.dbkKeyValues.update(userDexieCloudEmailKvValue, updatedDexieCloudEmailKvValue);
  //   // } else {
  //   //   console.log("deleting dexie cloud email kv value", userDexieCloudEmailKvValue.id);
  //   //   doneBlocksDb.dbkKeyValues.delete(userDexieCloudEmailKvValue.id);
  //   // }
  // }

  // if (!userHandle || !userId) {
  //   return null;
  // }



  // const getUserCompositeIdentity = (): DbkUserCompositeIdentity => {
    
  //   return {
  //     dbkUserId: userId,
  //     dbkUserHandle: userHandle,
  //   }
  // }

  // const userCompositeIdentity = getUserCompositeIdentity();

  const dexieEmailValue = currentDexieUser?.email as DexieCloudEmail;
  const emailVerified = currentDexieUser?.claims?.email_verified === true;
  const hasDexieUser = currentDexieUser !== null;
  const isLoggedIn = currentDexieUser?.isLoggedIn === true;
  const lastLogin = currentDexieUser?.lastLogin ?? null;
  const licenseType = currentDexieUser?.license?.type;
  const licenseStatus = currentDexieUser?.license?.status;

  console.log("currentDexieUser", currentDexieUser);

  // const getDexieProgress = (): DbkUserDexieProgress => {
  //   if (!dexieEmailValue) {
  //     return 'no-email';
  //   }

  //   if (!emailVerified) {
  //     return 'unverified-email';
  //   }

  //   if (isLoggedIn) {
  //     return 'verified-logged-in';
  //   } 
    
  //   return 'verified-logged-out';
  // }

  // const dexieProgress = getDexieProgress();


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
        // identity: userCompositeIdentity,
        dexieStatus,

        // setAndPersistUserIdentity,
      }}>
      {children}
    </BfgWhoAmIContext.Provider>
  );
}


// export const useBfgWhoAmIContext = (): BfgWhoAmIContextType => {
//   const context = useContext(BfgWhoAmIContext);
//   if (!context) {
//     throw new Error('useBfgWhoAmIContext must be used within a BfgWhoAmIProvider');
//   }
//   return context;
// }


// export const useRiskyBfgWhoAmIContext = (): BfgWhoAmIContextType | null => {
//   const context = useContext(BfgWhoAmIContext);
//   if (!context) {
//     return null;
//   }
//   return context;
// }
