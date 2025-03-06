import { useLiveQuery } from "dexie-react-hooks"
import { bfgDb } from "./bfg-db";
import { BfgPlayerProfileId } from "~/types/core/branded-values/bfg-branded-ids";
import { DbPlayerProfileId } from "~/types/core/branded-values/branded-strings";
import { DbPlayerProfile } from "~/types/core/player-profile/player-profile-db";
import { NewPlayerProfileParameters } from "~/types/core/player-profile/player-profile";


export const useLivePlayerProfiles = (): DbPlayerProfile[] | undefined => {
  const playerProfiles = useLiveQuery(async () => {
    return await bfgDb.myPlayerProfiles.toArray();
  })

  return playerProfiles;
}


export const useLivePlayerProfile = (playerProfileId: DbPlayerProfileId): DbPlayerProfile | undefined => {
  const playerProfile = useLiveQuery(async () => {
    return await bfgDb.myPlayerProfiles.get(playerProfileId);
  })
  
  return playerProfile;
}


export const deleteAllPlayerProfiles = async () => {
  await bfgDb.myPlayerProfiles.clear();
} 


export const addNewPlayerProfile = async (playerProfileParameters: NewPlayerProfileParameters) => {

  const newPlayerProfileId = BfgPlayerProfileId.createId();

  console.log("DB: newPlayerProfileId", newPlayerProfileId);

  const newPlayerProfile: DbPlayerProfile = {
    id: newPlayerProfileId,
    handle: playerProfileParameters.handle,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const added = await bfgDb.myPlayerProfiles.add(newPlayerProfile);

  console.log("DB: added", added);
}
