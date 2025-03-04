import { createContext, useContext } from "react";
import { BfgUserDexieStatus } from "~/types/core/user/user-dexie-status";

// import { useDexieEnvironment } from "../DexieEnvironmentProvider";
// import { DbkAppKeyValue, DbkUserIdKey, DbkUserHandleKey } from "~/data/zod-types/schemas/app-key-values";
// import { dbkAppKvParseString } from "~/data/serdeser/deser-utils";
// import { dbkUpdateStringAppKv } from "~/data/serdeser/ser-utils";
// import { generateDbkUserId } from "~/data/app-instance/user-handle-generator";
// import { DbkUserDexieProgress, DbkUserDexieStatus } from "~/data/zod-types/schemas/shared/user/user-dexie-status";


// export const LOCAL_STORAGE_KEY_DBK_USER_IDENTITY_KEY = "dbk-userIdentity";


// export interface ISetUserIdentity {
//   dbkUserHandle: DbkUserHandle;
//   // dexieCloudEmail: DexieCloudEmail | null;
// }


export interface BfgWhoAmIContextType {
  // identity: DbkUserCompositeIdentity;
  dexieStatus: BfgUserDexieStatus;

  // setAndPersistUserIdentity: (newIdentity: DbkUserCompositeIdentity) => void;
}


export const BfgWhoAmIContext = createContext<BfgWhoAmIContextType | undefined>(undefined);

console.log("BfgWhoAmIContext: created");


export const useBfgWhoAmIContext = (): BfgWhoAmIContextType => {
  const context = useContext(BfgWhoAmIContext);
  if (!context) {
    throw new Error('useBfgWhoAmIContext must be used within a BfgWhoAmIProvider');
  }
  return context;
}


export const useRiskyBfgWhoAmIContext = (): BfgWhoAmIContextType | null => {
  const context = useContext(BfgWhoAmIContext);
  if (!context) {
    return null;
  }
  return context;
}
