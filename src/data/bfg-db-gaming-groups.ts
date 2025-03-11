import { useLiveQuery } from "dexie-react-hooks";
import { bfgDb } from "./bfg-db";
import { DbGamingGroupId } from "~/types/core/branded-values/branded-strings";
import { DbGamingGroup } from "~/types/core/play-group/play-group-db";
import { BfgGamingGroupId } from "~/types/core/branded-values/bfg-branded-ids";


export const useLiveGamingGroups = () => {
  const playGroups = useLiveQuery(async () => {
    return await bfgDb.myGamingGroups.toArray();
  })

  return playGroups;
}


export const useLiveGamingGroup = (playGroupId: DbGamingGroupId) => {
  const playGroup = useLiveQuery(async () => {
    return await bfgDb.myGamingGroups.get(playGroupId);
  })

  return playGroup;
}


export const addNewGamingGroup = async (playGroup: DbGamingGroup) => {
  const newPlayGroupId = BfgGamingGroupId.createId();

  const newPlayGroup: DbGamingGroup = {
    ...playGroup,
    id: newPlayGroupId,
  }

  await bfgDb.myGamingGroups.add(newPlayGroup);
}


export const deleteAllGamingGroups = async () => {
  await bfgDb.myGamingGroups.clear();
}