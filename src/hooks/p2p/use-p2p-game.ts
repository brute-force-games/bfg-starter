import { useState } from "react";
import { joinRoom, Room } from "trystero";
import { P2P_GAME_DETAILS_ACTION_KEY, P2P_GAME_PLAYER_PROFILE_DATA_ACTION_KEY, P2P_GAME_PLAYER_MOVE_DATA_ACTION_KEY } from "~/components/p2p/constants";
import { HostP2pLobbyDetails, PlayerP2pGameMove } from "~/models/p2p-details";  
import { PublicPlayerProfile } from "~/models/public-player-profile";
import { TrysteroConfig } from "~/p2p/trystero-config";
import { GameTableId, PlayerProfileId } from "~/types/core/branded-values/bfg-branded-ids"


export interface IP2pGame {
  room: Room
  connectionStatus: string

  peerProfiles: Map<string, PublicPlayerProfile>
  playerProfiles: Map<PlayerProfileId, PublicPlayerProfile>

  lobbyDetails: HostP2pLobbyDetails | null

  sendPlayerMove: (move: PlayerP2pGameMove) => void
  getPlayerMove: (callback: (move: PlayerP2pGameMove, peer: string) => void) => void
}


export const useP2pGame = (gameTableId: GameTableId, myPlayerProfile: PublicPlayerProfile | null): IP2pGame => {
  
  const room = joinRoom(TrysteroConfig, gameTableId);

  const [lobbyDetails, setLobbyDetails] = useState<HostP2pLobbyDetails | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<string>('Connecting...')
  const [peerProfiles, setPeerProfiles] = useState<Map<string, PublicPlayerProfile>>(new Map())

  const [_, getPublicHostData] = room.makeAction<HostP2pLobbyDetails>(P2P_GAME_DETAILS_ACTION_KEY);
  const [sendPlayerProfile, getPlayerProfile] = room.makeAction<PublicPlayerProfile>(P2P_GAME_PLAYER_PROFILE_DATA_ACTION_KEY)
  const [sendPlayerMove, getPlayerMove] = room.makeAction<PlayerP2pGameMove>(P2P_GAME_PLAYER_MOVE_DATA_ACTION_KEY)

  if (!myPlayerProfile) {
    throw new Error('My player profile is required');
  }

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
    sendPlayerMove,
    getPlayerMove,
  }
}
