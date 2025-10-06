import { GameLobby } from "~/models/p2p-lobby";
import { PlayerProfileId } from "~/types/core/branded-values/bfg-branded-ids";
import { validateLobby } from "./lobby-utils";


export const playerTakeSeat = async (lobby: GameLobby, playerId: PlayerProfileId): Promise<GameLobby | null> => {
  // Create updated lobby with the player assigned to the seat

  const updatedPlayerPool = [...lobby.playerPool.filter(id => id !== playerId), playerId];
  // const numPlayers = updatedPlayerPool.length;

  // const isLobbyValid = numPlayers >= lobby.minNumPlayers && numPlayers <= lobby.maxNumPlayers;
  // console.log("PLAYER TAKE SEAT - isLobbyValid", isLobbyValid);

  // console.log('playerTakeSeat: updatedPlayerPool', updatedPlayerPool);
  // console.log('playerTakeSeat: numPlayers', numPlayers);
  // console.log('playerTakeSeat: isLobbyValid', isLobbyValid);
  // console.log('playerTakeSeat: lobby', lobby);

  const updatedLobby: GameLobby = {
    ...lobby,
    playerPool: updatedPlayerPool,
    // isLobbyValid,
    // updatedAt: Date.now(),
  };

  const isLobbyValid = validateLobby(updatedLobby);

  const validatedLobby = {
    ...updatedLobby,
    isLobbyValid,
    updatedAt: Date.now(),
  };

  return validatedLobby;
}