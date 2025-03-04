import { Dexie, Table } from "dexie";
import dexieCloud from "dexie-cloud-addon";
import { GameTable } from "../types/core/game-table";
import { getEnvSettings } from "../env/env-utils";
import { DbGameLobby } from "../types/core/game-lobby/game-lobby-db";
import { DbPlayerProfile } from "~/types/core/player-profile/player-profile-db";
import { DbGameFriendAccount } from "~/types/core/game-friend/friend-db";


type BruteForceGamesDbTables = {
  
  myPlayerProfiles: Table<DbPlayerProfile, 'id'>;
  myFriends: Table<DbGameFriendAccount, 'id'>;
  myGameTables: Table<GameTable, 'id'>;
  myGameLobbies: Table<DbGameLobby, 'id'>;
  
  // justSomeData: Table<JustSomeData, 'id'>;

  // dbkKeyValues: EntityTable<DbkAppKeyValue, 'id'>;
};

const DEXIE_BRUTE_FORCE_GAMES_DB_NAME = 'BruteForceGamesDb';

export type BruteForceGamesDb = Dexie & BruteForceGamesDbTables;


export const bfgDb = new Dexie(DEXIE_BRUTE_FORCE_GAMES_DB_NAME, {addons: [dexieCloud]}) as BruteForceGamesDb;

// Schema declaration:
bfgDb.version(1).stores({
  myPlayerProfiles: 'id, name, createdAt, updatedAt',
  myFriends: 'id, name, createdAt, updatedAt',
  myGameTables: 'id, name, createdAt, updatedAt',
  myGameLobbies: 'id, status, gameTitle, lobbyMinNumPlayers, lobbyMaxNumPlayers, gameHostPlayerId',

  // dbkKeyValues: '@id, appKey',
});



const envSettings = getEnvSettings();

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
      minInterval: 5000,
    }
  });
}
