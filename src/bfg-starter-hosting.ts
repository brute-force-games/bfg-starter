import { GameTableId, GameFriendId, GameHostingContextType } from "@bfg-engine";
import { BfgStarterTrysteroConfig } from "./trystero-config";

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

// const createJoinGameUrl = (gameTableId: GameTableId) => {
//   return `${getBaseUrl()}/games/${gameTableId}`;
// }

// const createHostedGameUrl = (gameTableId: GameTableId) => {
//   return `${getBaseUrl()}/hosted-games/${gameTableId}`;
// }

// const createPlayerGameUrl = (gameTableId: GameTableId) => {
//   return `${getBaseUrl()}/games/${gameTableId}`;
// }

const createJoinGameUrl = (gameTableId: GameTableId) => {
  return `${getBaseUrl()}/games2/play/${gameTableId}`;
}

const createHostedGameUrl = (gameTableId: GameTableId) => {
  return `${getBaseUrl()}/games2/host/${gameTableId}`;
}

const createPlayerGameUrl = (gameTableId: GameTableId) => {
  return `${getBaseUrl()}/games2/play/${gameTableId}`;
}

const createObserverGameUrl = (gameTableId: GameTableId) => {
  return `${getBaseUrl()}/games2/watch/${gameTableId}`;
}

const getTrysteroConfig = () => {
  return BfgStarterTrysteroConfig;
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
}
