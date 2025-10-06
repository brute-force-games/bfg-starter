import { GameLobby } from "~/models/p2p-lobby";
import { PlayerProfileId } from "~/types/core/branded-values/bfg-branded-ids";
import { validateLobby } from "./lobby-utils";


export const playerTakeSeat = async (lobby: GameLobby, playerId: PlayerProfileId): Promise<GameLobby | null> => {
  // Create updated lobby with the player assigned to the seat

  const updatedPlayerPool = [...lobby.playerPool.filter(id => id !== playerId), playerId];

  const updatedLobby: GameLobby = {
    ...lobby,
    playerPool: updatedPlayerPool,
  };

  const isLobbyValid = validateLobby(updatedLobby);

  const validatedLobby = {
    ...updatedLobby,
    isLobbyValid,
    updatedAt: Date.now(),
  };

  return validatedLobby;
}
