import { createContext, useContext } from "react";
import { GamePlayerId, PlayerProfileId } from "~/types/core/branded-values/bfg-branded-ids";
import { BfgUserDexieStatus } from "~/types/core/user/user-dexie-status";


export interface BfgWhoAmIContextType {
  dexieStatus: BfgUserDexieStatus;

  playerId: GamePlayerId | null;
  profileIds: PlayerProfileId[];
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
