import { Dexie, Table } from "dexie";
import dexieCloud from "dexie-cloud-addon";
import { FriendAccount } from "../types/core/player/friend";
import { GameTable } from "../types/core/game-table";
import { PlayerProfile } from "../types/core/player/player-profile";
import { GameLobby } from "../types/core/game-lobby";
import { getEnvSettings } from "../env/env-utils";



// type JustSomeData = {
//   id?: string;
//   name: string;
//   other: number;
// }


type BruteForceGamesDbTables = {
  // myLobbies: Table<GameLobbyComplete, 'id'>;
  myPlayerProfiles: Table<PlayerProfile, 'id'>;
  myFriends: Table<FriendAccount, 'id'>;
  myGameTables: Table<GameTable, 'id'>;
  myGameLobbies: Table<GameLobby, 'id'>;
  
  // justSomeData: Table<JustSomeData, 'id'>;

  // projects: EntityTable<ProjectItem, 'id'>;
  // projectGraphVersions: EntityTable<DbkSavedProjectGraphVersion, 'id'>;
  // projectItemToActiveGraphVersionLinks: EntityTable<DbkProjectItemToActiveGraphVersionLink, 'id'>;

  // graphNodeData: EntityTable<DbkGraphNodeData, 'id'>;
  // graphNodePositions: EntityTable<DbkGraphNodePosition, 'id'>;
  // graphNodeConnections: EntityTable<DbkGraphNodeConnection, 'id'>;
  // graphViewports: EntityTable<DbkGraphViewport, 'id'>;

  // dbkKeyValues: EntityTable<DbkAppKeyValue, 'id'>;
};

const DEXIE_BRUTE_FORCE_GAMES_DB_NAME = 'BruteForceGamesDb';

export type BruteForceGamesDb = Dexie & BruteForceGamesDbTables;


export const bfgDb = new Dexie(DEXIE_BRUTE_FORCE_GAMES_DB_NAME, {addons: [dexieCloud]}) as BruteForceGamesDb;

// Schema declaration:
bfgDb.version(1).stores({
  // myLobbies: '@id, name, createdAt, updatedAt',
  // justSomeData: '@id, name, other',
  myFriends: '@id, name, createdAt, updatedAt',
  myGameTables: '@id, name, createdAt, updatedAt',

  // dbkKeyValues: '@id, appKey',
});


// export const DEXIE_CLOUD_URL = "https://zt0h2t1rs.dexie.cloud";
const envSettings = getEnvSettings();

if (envSettings.cloudConfig.isCloudEnabled) {
  const dexieCloudUrl = envSettings.cloudConfig.syncUrl;

  bfgDb.cloud.configure({
    databaseUrl: dexieCloudUrl,
    requireAuth: true, // optional
    customLoginGui: true,
  });
}
