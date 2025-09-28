import { GameLobby } from "~/models/p2p-lobby";
import { PlayerProfileId } from "~/types/core/branded-values/bfg-branded-ids";


export const playerLeaveSeat = async (lobby: GameLobby, playerId: PlayerProfileId): Promise<GameLobby | null> => {
  // Create updated lobby with the player removed from the seat

  const updatedPlayerPool = lobby.playerPool.filter(id => id !== playerId);
  const numPlayers = updatedPlayerPool.length;

  const isLobbyValid = numPlayers >= lobby.minNumPlayers && numPlayers <= lobby.maxNumPlayers;
  console.log("PLAYER LEAVE SEAT - isLobbyValid", isLobbyValid);

  const updatedLobby: GameLobby = {
    ...lobby,
    playerPool: updatedPlayerPool,
    isLobbyValid,
    updatedAt: Date.now(),
  };

  return updatedLobby;
}