// import React from "react";
// import { BfgWhoAmIContext } from "./BfgWhoAmIContext";
// import { PlayerProfileId } from "~/types/branded-values/player-profile-id";
// import { MyPlayerProvider } from "~/data/persisted-player/persisted-player-provider";
// import { useMyPlayerProfiles, useDefaultProfileId } from "~/hooks/use-my-player-profiles";
// // import { fetchAppKeyValues } from "~/data/app-key-values";
// // import { setPlayerIdAppKey, useLiveAppKeys } from "~/data/bfg-db-appkeys";


// // export const LOCAL_STORAGE_KEY_DBK_USER_IDENTITY_KEY = "dbk-userIdentity";


// export interface BfgWhoAmIProviderProps { 
//   blah: string;
// }

// interface IBfgWhoAmIProviderProps {
//   children: React.ReactNode;
// }


// export const BfgWhoAmIProvider = ({ children }: IBfgWhoAmIProviderProps) => {
//   const allPlayerProfiles = useMyPlayerProfiles();
//   const defaultPlayerProfileId = useDefaultProfileId();

//   const allPlayerProfileIds = allPlayerProfiles
//     .map((playerProfile) => playerProfile.id)
//     .filter((id) => id !== null) as PlayerProfileId[];
  
//   return (
//     <BfgWhoAmIContext.Provider
//       value={{
//         profileIds: allPlayerProfileIds,
//         defaultPlayerProfileId,
//       }}>
//         <MyPlayerProvider>
//           {children}
//         </MyPlayerProvider>
//     </BfgWhoAmIContext.Provider>
//   );
// }
