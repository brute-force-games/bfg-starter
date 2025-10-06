// // import { useLiveQuery } from "dexie-react-hooks"
// // import { bfgDb } from "./bfg-db";
// import { BfgPlayerProfileId } from "~/types/core/branded-values/bfg-branded-ids";
// import { DbPlayerProfileId } from "~/types/core/branded-values/branded-strings";
// import { DbPlayerProfile } from "~/types/core/player-profile/player-profile-db";
// import { NewPlayerProfileParameters } from "~/types/core/player-profile/player-profile";


// export const useLivePlayerProfiles = (): DbPlayerProfile[] | undefined => {
//   const playerProfiles = useLiveQuery(async () => {
//     return await bfgDb.myPlayerProfiles.toArray();
//   })

//   return playerProfiles;
// }


// export const useLiveDefaultPlayerProfile = (): DbPlayerProfile | undefined => {
//   const activePlayerProfile = useLiveQuery(async () => {
//     const playerProfiles = await bfgDb.myPlayerProfiles.toArray();
//     const activePlayerProfiles = playerProfiles?.filter((playerProfile) => playerProfile.isDefault);
    
//     if (!activePlayerProfiles) {
//       return undefined;
//     }

//     if (activePlayerProfiles.length > 1) {
//       console.error("Multiple active player profiles found");
//       return undefined;
//     }

//     return activePlayerProfiles[0];
//   })

//   return activePlayerProfile;
// }


// export const useLivePlayerProfile = (playerProfileId: DbPlayerProfileId): DbPlayerProfile | undefined => {
//   const playerProfile = useLiveQuery(async () => {
//     return await bfgDb.myPlayerProfiles.get(playerProfileId);
//   }, [playerProfileId])
  
//   return playerProfile;
// }


// export const setDefaultPlayerProfile = async (playerProfileId: DbPlayerProfileId) => {
//   await bfgDb.transaction('rw', bfgDb.myPlayerProfiles, async () => {

//     const playerProfiles = await bfgDb.myPlayerProfiles.toArray();
//     const updatedPlayerProfiles = playerProfiles.map((playerProfile) => {
//       if (playerProfile.id === playerProfileId) {
//         return { ...playerProfile, isDefault: true };
//       } else {
//         return { ...playerProfile, isDefault: false };
//       }
//     });

//     await bfgDb.myPlayerProfiles.clear();
//     await bfgDb.myPlayerProfiles.bulkPut(updatedPlayerProfiles);
//   });
// }


// export const deleteAllPlayerProfiles = async () => {
//   await bfgDb.myPlayerProfiles.clear();
// } 


// export const updatePlayerProfileHandle = async (playerProfileId: DbPlayerProfileId, newHandle: string) => {
//   await bfgDb.transaction('rw', bfgDb.myPlayerProfiles, async () => {
//     const playerProfile = await bfgDb.myPlayerProfiles.get(playerProfileId);
//     if (!playerProfile) {
//       console.error("Player profile not found");
//       return;
//     }
//     playerProfile.handle = newHandle;
//     await bfgDb.myPlayerProfiles.put(playerProfile);
//   });
// }


// export const addNewPlayerProfile = async (playerProfileParameters: NewPlayerProfileParameters) => {

//   const existingPlayerProfiles = await bfgDb.myPlayerProfiles.toArray();
//   const setAsDefault = (existingPlayerProfiles.length === 0);

//   const newPlayerProfileId = BfgPlayerProfileId.createId();

//   const newPlayerProfile: DbPlayerProfile = {
//     id: newPlayerProfileId,
//     handle: playerProfileParameters.handle,
//     isDefault: setAsDefault,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   }

//   const added = await bfgDb.myPlayerProfiles.add(newPlayerProfile);

//   console.log("DB: player profile added", added);
// }
