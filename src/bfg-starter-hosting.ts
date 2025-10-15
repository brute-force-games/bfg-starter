import { GameTableId, GameFriendId, GameHostingContextType } from "@bfg-engine";
import { BfgStarterTrysteroConfig } from "./trystero-config";


const getWindowOrigin = () => {
  return window.location.origin;
}

const createJoinGameUrl = (gameTableId: GameTableId) => {
  return `${getWindowOrigin()}/games/${gameTableId}`;
}

const createFriendUrl = (friendId: GameFriendId) => {
  console.log("createFriendUrl", friendId);
  return `${getWindowOrigin()}/friends/${friendId}`;
}

const createHostedGameUrl = (gameTableId: GameTableId) => {
  return `${getWindowOrigin()}/hosted-games/${gameTableId}`;
}

const createPlayerGameUrl = (gameTableId: GameTableId) => {
  return `${getWindowOrigin()}/games/${gameTableId}`;
}

const getTrysteroConfig = () => {
  return BfgStarterTrysteroConfig;
}


export const BfgStarterGameHosting: GameHostingContextType = {
  getTrysteroConfig,
  createJoinGameUrl,
  createFriendUrl,
  createHostedGameUrl,
  createPlayerGameUrl,
}
