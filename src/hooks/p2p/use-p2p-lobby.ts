import { useState } from "react";
import { joinRoom, Room } from "trystero";
import { P2P_LOBBY_DETAILS_ACTION_KEY, P2P_LOBBY_PLAYER_PROFILE_DATA_ACTION_KEY, P2P_LOBBY_PLAYER_MOVE_DATA_ACTION_KEY } from "~/components/p2p/constants";
import { HostP2pLobbyDetails, PlayerP2pLobbyMove } from "~/models/p2p-details";  
import { PublicPlayerProfile } from "~/models/public-player-profile";
import { TrysteroConfig } from "~/p2p/trystero-config";
import { GameLobbyId, PlayerProfileId } from "~/types/core/branded-values/bfg-branded-ids"


export interface IP2pLobby {
  room: Room
  connectionStatus: string

  peerProfiles: Map<string, PublicPlayerProfile>
  playerProfiles: Map<PlayerProfileId, PublicPlayerProfile>

  lobbyDetails: HostP2pLobbyDetails | null

  getPlayerProfile: (callback: (playerProfile: PublicPlayerProfile, peer: string) => void) => void

  sendPlayerMove: (move: PlayerP2pLobbyMove) => void
  getPlayerMove: (callback: (move: PlayerP2pLobbyMove, peer: string) => void) => void
}


export const useP2pLobby = (lobbyId: GameLobbyId, myPlayerProfile: PublicPlayerProfile): IP2pLobby => {
  
  const room = joinRoom(TrysteroConfig, lobbyId);

  const [lobbyDetails, setLobbyDetails] = useState<HostP2pLobbyDetails | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<string>('Connecting...')
  const [peerProfiles, setPeerProfiles] = useState<Map<string, PublicPlayerProfile>>(new Map())

  const [_, getPublicHostData] = room.makeAction<HostP2pLobbyDetails>(P2P_LOBBY_DETAILS_ACTION_KEY);
  const [sendPlayerProfile, getPlayerProfile] = room.makeAction<PublicPlayerProfile>(P2P_LOBBY_PLAYER_PROFILE_DATA_ACTION_KEY)
  const [sendPlayerMove, getPlayerMove] = room.makeAction<PlayerP2pLobbyMove>(P2P_LOBBY_PLAYER_MOVE_DATA_ACTION_KEY)


  room.onPeerJoin(peer => {
    console.log('Peer joined:', peer)
    setConnectionStatus(`Connected to ${peerProfiles.size + 1} peers`);
    sendPlayerProfile(myPlayerProfile, peer);
    setPeerProfiles(prev => new Map(prev).set(peer, myPlayerProfile))
  })

  room.onPeerLeave(peer => {
    console.log('Peer left:', peer)
    setConnectionStatus(`Connected to ${peerProfiles.size - 1} peers`)
    setPeerProfiles(prev => {
      const updated = new Map(prev)
      updated.delete(peer)
      return updated
    })
  })

  getPublicHostData((publicHostData: HostP2pLobbyDetails, peer: string) => {
    console.log('getPublicHostData - ', peer, publicHostData)
    setLobbyDetails(publicHostData)
  })

  getPlayerProfile((playerProfile: PublicPlayerProfile, peer: string) => {
    setPeerProfiles(prev => new Map(prev).set(peer, playerProfile))
  })

  const playerProfiles = new Map<PlayerProfileId, PublicPlayerProfile>(
    Array.from(peerProfiles.values()).map(profile => [profile.id, profile])
  );

  
  return {
    room,
    lobbyDetails,
    connectionStatus: connectionStatus,
    peerProfiles,
    playerProfiles,
    getPlayerProfile,
    sendPlayerMove,
    getPlayerMove,
  }
}
