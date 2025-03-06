import { Dexie, EntityTable, Table } from "dexie";
import dexieCloud from "dexie-cloud-addon";
import { getEnvSettings } from "../env/env-utils";
import { DbPlayerProfile } from "~/types/core/player-profile/player-profile-db";
import { DbFriendAccount } from "~/types/core/friend-account/friend-db";
import { AppValueEncodingEnum, BfgAppKeyValue, BfgPlayerIdKey, NewBfgAppKeyValue } from "~/types/core/app-key-values/app-key-values";
import { bfgAppKvParseString } from "~/env/serdeser/deser-utils";
import { BfgGamePlayerId, GamePlayerId } from "~/types/core/branded-values/bfg-branded-ids";
import { InitAppInstanceKeyValuesResult } from "~/types/core/app-key-values/app-instance-types";
import { AppInstanceKeyValues } from "~/types/core/app-key-values/app-instance-kv";
import { DbGameTable } from "~/types/core/game-table/game-table";
import { DbGameTableAction } from "~/types/core/game-table/game-table-action";


type BruteForceGamesDbTables = {
  
  myPlayerProfiles: Table<DbPlayerProfile, 'id'>;
  myFriends: Table<DbFriendAccount, 'id'>;

  gameTables: Table<DbGameTable, 'id'>;
  gameTableActions: Table<DbGameTableAction, 'id'>;


  // myGameTables: Table<GameTable, 'id'>;

  bfgAppKeyValues: EntityTable<BfgAppKeyValue, 'appKey'>;
};

const DEXIE_BRUTE_FORCE_GAMES_DB_NAME = 'BruteForceGamesDb';

export type BruteForceGamesDb = Dexie & BruteForceGamesDbTables;


export const bfgDb = new Dexie(DEXIE_BRUTE_FORCE_GAMES_DB_NAME, {addons: [dexieCloud]}) as BruteForceGamesDb;

// Schema declaration:
bfgDb.version(1).stores({
  myPlayerProfiles: 'id, name, createdAt, updatedAt',
  myFriends: 'id, name, createdAt, updatedAt',
  // myGameLobbies: 'id, status, gameTitle, lobbyMinNumPlayers, lobbyMaxNumPlayers, gameHostPlayerId',
  gameTables: 'id, gameHostPlayerId, gameTitle, createdAt, updatedAt',
  gameTableActions: 'id, gameTableId, previousActionId, createdAt',
  

  bfgAppKeyValues: 'appKey',
});


const envSettings = getEnvSettings();


export const fetchAppKeyValuesFromDb = async (db: BruteForceGamesDb): Promise<InitAppInstanceKeyValuesResult> => {

  const initializationWarnings: string[] = [];

  console.log("fetchAppKeyValuesFromDb: db", db);

  console.log("fetchAppKeyValuesFromDb: db.bfgAppKeyValues", db.bfgAppKeyValues);

  const appInstanceKeyValues = await db.transaction('rw', 
    db.bfgAppKeyValues,
    async () => {

      console.log("fetchAppKeyValuesFromDb: db.bfgAppKeyValues", db.bfgAppKeyValues);

      const playerIdRow = await db
        .bfgAppKeyValues
        .where('appKey')
        .equals(BfgPlayerIdKey)
        .first();

      const playerId = playerIdRow ? 
        bfgAppKvParseString(playerIdRow) :
        null;

      if (playerId) {
        console.log("LOADED APP KEY VALUES: PLAYER ID", playerId);

        const appInstanceKeyValues: AppInstanceKeyValues = {
          [BfgPlayerIdKey]: playerId as GamePlayerId,
        };
  
        return appInstanceKeyValues;
      }

      const newPlayerId = BfgGamePlayerId.createId();
      const newKeyValue: NewBfgAppKeyValue = {
        appKey: BfgPlayerIdKey,
        appEncodedValue: newPlayerId,
        appEncodedTypeDescription: BfgPlayerIdKey,
        appValueEncoding: AppValueEncodingEnum.Values.string,
      };

      console.log("ADDING NEW PLAYER ID TO APP KEY VALUES", newKeyValue);

      await db.bfgAppKeyValues.add(newKeyValue);

      const appInstanceKeyValues: AppInstanceKeyValues = {
        [BfgPlayerIdKey]: playerId as GamePlayerId,
      };

      return appInstanceKeyValues;
    }
  );

  console.log("fetchAppKeyValuesFromDb: appInstanceKeyValues done await", appInstanceKeyValues);


  return {
    appInstanceKeyValues,
    errors: initializationWarnings,
  };
}


if (envSettings.cloudConfig.isCloudEnabled) {
  console.log("BFG DB: configuring cloud");
  console.log("BFG DB: envSettings", envSettings);
  const dexieCloudUrl = envSettings.cloudConfig.syncUrl;

  bfgDb.cloud.configure({
    databaseUrl: dexieCloudUrl,
    requireAuth: true, // optional
    customLoginGui: true,
    tryUseServiceWorker: true,
    periodicSync: {
      minInterval: 1000,
    }
  });
}
