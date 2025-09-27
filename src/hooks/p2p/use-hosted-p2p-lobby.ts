import { GameLobbyId } from "~/types/core/branded-values/bfg-branded-ids";
import { useP2pLobby } from "./use-p2p-lobby";
import { PublicPlayerProfile } from "~/models/public-player-profile";
import { HostP2pLobbyDetails } from "~/models/p2p-details";


interface IHostedP2pLobbyData {
  lobbyDetails: HostP2pLobbyDetails | null
  connectionStatus: string
  peerProfiles: Record<string, PublicPlayerProfile>
}

export const useHostedP2pLobby = (lobbyId: GameLobbyId, hostPlayerProfile: PublicPlayerProfile): IHostedP2pLobbyData => {

  const lobby = useP2pLobby(lobbyId, hostPlayerProfile);

  const retVal: IHostedP2pLobbyData = {
    lobbyDetails: lobby.lobbyDetails,
    connectionStatus: lobby.connectionStatus,
    peerProfiles: Object.fromEntries(lobby.peerProfiles.entries()),
  }
  
  return retVal;
}
