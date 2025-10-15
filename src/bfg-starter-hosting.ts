import { GameTableId, GameFriendId, GameHostingContextType } from "@bfg-engine";
import { BfgStarterTrysteroConfig } from "./trystero-config";
/**
 * Get the base URL for the application, including the configured base path.
 * This respects the Vite BASE_URL configuration for deployments to subdirectories.
 */
export const getBaseUrl = (): string => {
  const origin = window.location.origin;
  const basePath = import.meta.env.BASE_URL || '/';
  return `${origin}${basePath}`.replace(/\/+$/, ''); // Remove trailing slash
};


const createJoinGameUrl = (gameTableId: GameTableId) => {
  return `${getBaseUrl()}/games/${gameTableId}`;
}

const createFriendUrl = (friendId: GameFriendId) => {
  console.log("createFriendUrl", friendId);
  return `${getBaseUrl()}/friends/${friendId}`;
}

const createHostedGameUrl = (gameTableId: GameTableId) => {
  return `${getBaseUrl()}/hosted-games/${gameTableId}`;
}

const createPlayerGameUrl = (gameTableId: GameTableId) => {
  return `${getBaseUrl()}/games/${gameTableId}`;
}

const getTrysteroConfig = () => {
  return BfgStarterTrysteroConfig;
}


export const BfgStarterGameHosting: GameHostingContextType = {
  getTrysteroConfig,
  getBaseUrl,
  createJoinGameUrl,
  createFriendUrl,
  createHostedGameUrl,
  createPlayerGameUrl,
}
