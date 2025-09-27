import { GameLobby } from "~/models/p2p-lobby";
import { BfgSupportedGameTitles } from "~/types/bfg-game-engines/supported-games";
import { PlayerProfileId } from "~/types/core/branded-values/bfg-branded-ids";


export const playerSetGameChoice = async (lobby: GameLobby, playerId: PlayerProfileId, gameChoice: BfgSupportedGameTitles): Promise<GameLobby | null> => {
  console.log('playerSetGameChoice', lobby, playerId, gameChoice);
  const updatedLobby: GameLobby = {
    ...lobby,
    gameTitle: gameChoice,
    updatedAt: Date.now()
  };
  return updatedLobby;
}
