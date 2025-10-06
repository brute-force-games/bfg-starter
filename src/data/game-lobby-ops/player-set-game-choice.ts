import { GameLobby } from "~/models/p2p-lobby";
import { AllBfgGameMetadata } from "~/types/bfg-game-engines/bfg-game-engines";
import { BfgSupportedGameTitles } from "~/types/bfg-game-engines/supported-games";
import { PlayerProfileId } from "~/types/core/branded-values/bfg-branded-ids";


export const playerSetGameChoice = async (lobby: GameLobby, playerId: PlayerProfileId, gameChoice: BfgSupportedGameTitles): Promise<GameLobby | null> => {
  console.log('playerSetGameChoice', lobby, playerId, gameChoice);

  const gameMetadata = AllBfgGameMetadata[gameChoice];

  const minNumPlayers = gameMetadata.definition.minNumPlayersForGame;
  const maxNumPlayers = gameMetadata.definition.maxNumPlayersForGame;
  const numPlayers = lobby.playerPool.length;

  const isLobbyValid = numPlayers >= minNumPlayers && numPlayers <= maxNumPlayers;
  
  const updatedLobby: GameLobby = {
    ...lobby,
    gameTitle: gameChoice,
    minNumPlayers,
    maxNumPlayers,
    isLobbyValid,
    updatedAt: Date.now(),
  };
  return updatedLobby;
}
