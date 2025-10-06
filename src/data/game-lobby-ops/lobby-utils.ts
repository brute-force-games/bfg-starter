import { GameLobby } from "~/models/p2p-lobby";
import { AllBfgGameMetadata } from "~/types/bfg-game-engines/bfg-game-engines";

export const validateLobby = (lobby: GameLobby): boolean => {
  if (!lobby.gameTitle) {
    return false;
  }

  const numPlayers = lobby.playerPool.length;
  const gameMetadata = AllBfgGameMetadata[lobby.gameTitle];

  const isValidNumberOfPlayers = numPlayers >= gameMetadata.definition.minNumPlayersForGame && numPlayers <= gameMetadata.definition.maxNumPlayersForGame;
  return isValidNumberOfPlayers;
}
