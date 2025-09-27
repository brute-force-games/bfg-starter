import { GameLobby } from "~/models/p2p-lobby";
import { PlayerProfileId } from "~/types/core/branded-values/bfg-branded-ids";


export const playerTakeSeat = async (lobby: GameLobby, playerId: PlayerProfileId): Promise<GameLobby | null> => {
  // Create updated lobby with the player assigned to the seat
  const updatedLobby: GameLobby = {
    ...lobby,
    playerPool: [...lobby.playerPool, playerId],
    updatedAt: Date.now()
  };

  return updatedLobby;
}