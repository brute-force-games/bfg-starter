import { GameLobbyId } from "~/types/core/branded-values/bfg-branded-ids";
import { useP2pLobby } from "./use-p2p-lobby";
import { PublicPlayerProfile } from "~/models/public-player-profile";
import { HostP2pLobbyDetails } from "~/models/p2p-details";
import { P2P_LOBBY_DETAILS_ACTION_KEY } from "~/components/p2p/constants";
import { IP2pLobby } from "./use-p2p-lobby";


interface IHostedP2pLobbyData {
  p2pLobby: IP2pLobby
  
  lobbyDetails: HostP2pLobbyDetails | null
  connectionStatus: string
  peerProfiles: Map<string, PublicPlayerProfile>

  sendLobbyData: (lobbyData: HostP2pLobbyDetails) => void
  getPlayerProfile: (callback: (playerProfile: PublicPlayerProfile, peer: string) => void) => void
}

export const useHostedP2pLobby = (lobbyId: GameLobbyId, hostPlayerProfile: PublicPlayerProfile): IHostedP2pLobbyData => {

  const lobby = useP2pLobby(lobbyId, hostPlayerProfile);
  const { room, peerProfiles, getPlayerProfile } = lobby;

  const [sendLobbyData] = room.makeAction<HostP2pLobbyDetails>(P2P_LOBBY_DETAILS_ACTION_KEY)

  const retVal: IHostedP2pLobbyData = {
    p2pLobby: lobby,
    lobbyDetails: lobby.lobbyDetails,
    connectionStatus: lobby.connectionStatus,
    peerProfiles,
    sendLobbyData,
    getPlayerProfile,
  }
  
  return retVal;
}
