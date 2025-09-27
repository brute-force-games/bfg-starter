import { GameLobby } from "~/models/p2p-lobby";
import { PlayerProfileId } from "~/types/core/branded-values/bfg-branded-ids";


export const playerLeaveSeat = async (lobby: GameLobby, playerId: PlayerProfileId): Promise<GameLobby | null> => {
  // Create updated lobby with the player removed from the seat
  const updatedLobby: GameLobby = {
    ...lobby,
    playerPool: lobby.playerPool.filter(id => id !== playerId),
    updatedAt: Date.now()
  };

  return updatedLobby;
}