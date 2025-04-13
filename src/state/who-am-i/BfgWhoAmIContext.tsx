import { createContext, useContext } from "react";
import { PlayerProfileId } from "~/types/core/branded-values/bfg-branded-ids";
import { CloudNotification } from "~/types/core/player/notifications";
import { BfgUserDexieStatus } from "~/types/core/user/user-dexie-status";


export interface BfgWhoAmIContextType {
  dexieStatus: BfgUserDexieStatus;
  
  defaultPlayerProfileId: PlayerProfileId | null;
  profileIds: PlayerProfileId[];

  myNotifications: CloudNotification[];
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
