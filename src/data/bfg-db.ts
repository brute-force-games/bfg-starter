import { Dexie, Table } from "dexie";
import dexieCloud from "dexie-cloud-addon";
import { GameFriendAccount } from "../types/core/game-friend/friend";
import { GameTable } from "../types/core/game-table";
import { PlayerProfile } from "../types/core/player/player-profile";;
import { getEnvSettings } from "../env/env-utils";
import { DbGameLobby } from "../types/core/game-lobby/game-lobby-db";


type BruteForceGamesDbTables = {
  
  myPlayerProfiles: Table<PlayerProfile, 'id'>;
  myFriends: Table<GameFriendAccount, 'id'>;
  myGameTables: Table<GameTable, 'id'>;
  myGameLobbies: Table<DbGameLobby, 'id'>;
  
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
  });
}
