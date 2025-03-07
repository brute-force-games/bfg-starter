import { Dexie, Table } from "dexie";
import dexieCloud from "dexie-cloud-addon";
import { getEnvSettings } from "../env/env-utils";
import { DbPlayerProfile } from "~/types/core/player-profile/player-profile-db";
import { DbFriendAccount } from "~/types/core/friend-account/friend-db";
// import { AppValueEncodingEnum, BfgAppKeyValue, BfgPlayerIdKey } from "~/types/core/app-key-values/app-key-values";
// import { bfgAppKvParseString } from "~/env/serdeser/deser-utils";
// import { BfgGamePlayerId, GamePlayerId } from "~/types/core/branded-values/bfg-branded-ids";
// import { InitAppInstanceKeyValuesResult } from "~/types/core/app-key-values/app-instance-types";
// import { AppInstanceKeyValues } from "~/types/core/app-key-values/app-instance-kv";
import { DbGameTable } from "~/types/core/game-table/game-table";
import { DbGameTableAction } from "~/types/core/game-table/game-table-action";
import { BfgAppKeyValue } from "~/types/core/app-key-values/app-key-values";
// import { AppValueEncodingEnum, BfgAppKeyValue, BfgPlayerIdKey } from "~/types/core/app-key-values/app-key-values";
// import { AppInstanceKeyValues } from "~/types/core/app-key-values/app-instance-kv";
// import { InitAppInstanceKeyValuesResult } from "~/types/core/app-key-values/app-instance-types";
// import { BfgGamePlayerId, GamePlayerId } from "~/types/core/branded-values/bfg-branded-ids";
// import { bfgAppKvParseString } from "~/env/serdeser/deser-utils";


type BruteForceGamesDbTables = {
  
  myPlayerProfiles: Table<DbPlayerProfile, 'id'>;
  myFriends: Table<DbFriendAccount, 'id'>;

  gameTables: Table<DbGameTable, 'id'>;
  gameTableActions: Table<DbGameTableAction, 'id'>;

  // abcAppKeyValues: Table<BfgAppKeyValue, 'id'>;
  appKeyValues: Table<BfgAppKeyValue, 'id'>;
};

const DEXIE_BRUTE_FORCE_GAMES_DB_NAME = 'BruteForceGamesDb';

export type BruteForceGamesDb = Dexie & BruteForceGamesDbTables;


export const bfgDb = new Dexie(DEXIE_BRUTE_FORCE_GAMES_DB_NAME, {addons: [dexieCloud]}) as BruteForceGamesDb;

// Schema declaration:
bfgDb.version(1).stores({
  myPlayerProfiles: 'id, name, createdAt, updatedAt',
  myFriends: 'id, name, createdAt, updatedAt',
  
  gameTables: 'id, gameHostPlayerId, gameTitle, createdAt, updatedAt',
  gameTableActions: 'id, gameTableId, previousActionId, createdAt',
  
  // abcAppKeyValues: 'appKey',
  appKeyValues: 'appKey',
});


const envSettings = getEnvSettings();


// export const fetchAppKeyValuesFromDb = async (db: BruteForceGamesDb): Promise<InitAppInstanceKeyValuesResult> => {

//   const initializationWarnings: string[] = [];

//   console.log("fetchAppKeyValuesFromDb: db", db);

//   console.log("fetchAppKeyValuesFromDb: db.bfgAppKeyValues", db.appKeyValues);

//   // const appInstanceKeyValues = await db.transaction('rw', 
//   //   db.appKeyValues,
//   //   async () => {

//       await db.open();
//       console.log("DB IS OPEN");

//       console.log("fetchAppKeyValuesFromDb: db.bfgAppKeyValues", db.appKeyValues);

//       const playerIdRow = await db
//         .appKeyValues
//         .where('appKey')
//         .equals(BfgPlayerIdKey)
//         .first();

//       console.log("fetchAppKeyValuesFromDb: playerIdRow", playerIdRow);

//       const playerId = playerIdRow ? 
//         bfgAppKvParseString(playerIdRow) :
//         null;

//       console.log("fetchAppKeyValuesFromDb: playerId", playerId);

//       if (playerId) {
//         console.log("LOADED APP KEY VALUES: PLAYER ID", playerId);

//         const appInstanceKeyValues: AppInstanceKeyValues = {
//           [BfgPlayerIdKey]: playerId as GamePlayerId,
//         };
  
//         return {
//           appInstanceKeyValues,
//           errors: initializationWarnings,
//         };
//       }

//       const newPlayerId = BfgGamePlayerId.createId();
//       const newKeyValue: BfgAppKeyValue = {
//         appKey: BfgPlayerIdKey,
//         appEncodedValue: newPlayerId,
//         appEncodedTypeDescription: BfgPlayerIdKey,
//         appValueEncoding: AppValueEncodingEnum.Values.string,
//       };

//       console.log("ADDING NEW PLAYER ID TO APP KEY VALUES", newKeyValue);

//       const y = await db.appKeyValues.add(newKeyValue);
//       console.log("AFTER SAVE - BEFORE SYNC - fetchAppKeyValuesFromDb: y", y);
//       // await db.cloud.sync();
//       console.log("AFTER SAVE - AFTER SYNC - fetchAppKeyValuesFromDb: y", y);

//       const x = await db.appKeyValues.toArray();
//       console.log("AFTER SAVE - fetchAppKeyValuesFromDb: x", x);

//       const appInstanceKeyValues: AppInstanceKeyValues = {
//         [BfgPlayerIdKey]: playerId as GamePlayerId,
//         // [BfgPlayerIdKey]: newKeyValue,
//       };

//       // return appInstanceKeyValues;
//     // }
//   // );

//   console.log("HERE IT IS");

//   // console.log("fetchAppKeyValuesFromDb: appInstanceKeyValues done await", appInstanceKeyValues);


//   return {
//     appInstanceKeyValues,
//     errors: initializationWarnings,
//   };
// }


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
