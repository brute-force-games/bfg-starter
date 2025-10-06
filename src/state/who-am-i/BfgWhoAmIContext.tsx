// import { createContext, useContext } from "react";
// import { PlayerProfileId } from "~/types/branded-values/player-profile-id";

// export interface BfgWhoAmIContextType {
//   defaultPlayerProfileId: PlayerProfileId | null;
//   profileIds: PlayerProfileId[];
// }


// export const BfgWhoAmIContext = createContext<BfgWhoAmIContextType | undefined>(undefined);

// console.log("BfgWhoAmIContext: created");


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
