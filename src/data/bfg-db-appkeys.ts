import { AppValueEncodingEnum, BfgAppKeyValue, BfgPlayerIdKey } from "~/types/core/app-key-values/app-key-values";
import { bfgDb } from "./bfg-db";
import { GamePlayerId } from "~/types/core/branded-values/bfg-branded-ids";
import { useLiveQuery } from "dexie-react-hooks";


export const useLiveAppKeys = (): BfgAppKeyValue[] | undefined => {
  const appKeys = useLiveQuery(async () => {
    return await bfgDb.appKeyValues.toArray();
  })

  return appKeys;
}


export const setPlayerIdAppKey = async (playerId: GamePlayerId) => {
  const playerIdAppKey = {
    appKey: BfgPlayerIdKey,
    appEncodedValue: playerId,
    appEncodedTypeDescription: BfgPlayerIdKey,
    appValueEncoding: AppValueEncodingEnum.Values.string,
  }

  console.log("ADDING PLAYER ID APP KEY", playerIdAppKey);

  await bfgDb.appKeyValues.add(playerIdAppKey);
}


export const clearAppKeys = async () => {
  await bfgDb.appKeyValues.clear();
}
