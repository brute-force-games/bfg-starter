import { GameFriendId, GameHostingContextType } from "@bfg-engine";
import { BfgStarterTrysteroConfig } from "./bfg-trystero-config";
import type { BfgGameInstanceId } from "../modules/bfg-engine/src/models/types/bfg-branded-uuids";
import { getAppVersionString, getEnvSettings } from "./env/env-utils";

/**
 * Get just the base path portion (without origin) for router configuration.
 * This respects the Vite BASE_URL configuration for deployments to subdirectories.
 */
export const getBasePath = (): string => {
  const basePath = import.meta.env.BASE_URL || '/';
  // Ensure it starts with / and doesn't end with / (unless it's just '/')
  const normalized = basePath.startsWith('/') ? basePath : `/${basePath}`;
  return normalized === '/' ? '/' : normalized.replace(/\/+$/, '');
};

/**
 * Get the base URL for the application, including the configured base path.
 * This respects the Vite BASE_URL configuration for deployments to subdirectories.
 */
export const getBaseUrl = (): string => {
  const origin = window.location.origin;
  const basePath = getBasePath();
  return basePath === '/' ? origin : `${origin}${basePath}`;
};

const createFriendUrl = (friendId: GameFriendId) => {
  console.log("createFriendUrl", friendId);
  return `${getBaseUrl()}/friends/${friendId}`;
}

// const createJoinGameUrl = (gameTableId: BfgGameTableId) => {
//   return `${getBaseUrl()}/games/${gameTableId}`;
// }

// const createHostedGameUrl = (gameTableId: BfgGameTableId) => {
//   return `${getBaseUrl()}/hosted-games/${gameTableId}`;
// }

// const createPlayerGameUrl = (gameTableId: BfgGameTableId) => {
//   return `${getBaseUrl()}/games/${gameTableId}`;
// }

const createJoinGameUrl = (gameInstanceId: BfgGameInstanceId) => {
  return `${getBaseUrl()}/games/play/${gameInstanceId}`;
}

const createHostedGameUrl = (gameInstanceId: BfgGameInstanceId) => {
  return `${getBaseUrl()}/games/host/${gameInstanceId}`;
}

const createPlayerGameUrl = (gameInstanceId: BfgGameInstanceId) => {
  return `${getBaseUrl()}/games/play/${gameInstanceId}`;
}

const createObserverGameUrl = (gameInstanceId: BfgGameInstanceId) => {
  return `${getBaseUrl()}/games/watch/${gameInstanceId}`;
}

const getTrysteroConfig = () => {
  return BfgStarterTrysteroConfig;
  // return BfgStarterSupabaseTrysteroConfig;
}


export const BfgStarterGameHosting: GameHostingContextType = {
  getSiteTitle: () => {
    return 'Brute Force Games Starter';
  },
  getTrysteroConfig,
  getBaseUrl,
  createJoinGameUrl,
  createFriendUrl,
  createHostedGameUrl,
  createPlayerGameUrl,
  createObserverGameUrl,
  getEnvSettings,
  getAppVersion: getAppVersionString,
}
