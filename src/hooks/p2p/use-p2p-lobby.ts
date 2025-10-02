import { useState, useEffect } from "react";
import { joinRoom, Room } from "trystero";
import { P2P_LOBBY_DETAILS_ACTION_KEY, P2P_LOBBY_PLAYER_PROFILE_DATA_ACTION_KEY, P2P_LOBBY_PLAYER_MOVE_DATA_ACTION_KEY } from "~/components/p2p/constants";
import { HostP2pLobbyDetails, PlayerP2pLobbyMove } from "~/models/p2p-details";  
import { PublicPlayerProfile } from "~/models/public-player-profile";
import { TrysteroConfig } from "~/p2p/trystero-config";
import { GameLobbyId, PlayerProfileId } from "~/types/core/branded-values/bfg-branded-ids"

export interface ConnectionEvent {
  type: 'initialized' | 'peer-joined' | 'peer-left' | 'auto-refresh' | 'join-error'
  timestamp: Date
  peerCount: number
  message: string
}

export interface IP2pLobby {
  room: Room
  connectionStatus: string
  connectionEvents: ConnectionEvent[]

  peerProfiles: Map<string, PublicPlayerProfile>
  playerProfiles: Map<PlayerProfileId, PublicPlayerProfile>

  lobbyDetails: HostP2pLobbyDetails | null

  getPlayerProfile: (callback: (playerProfile: PublicPlayerProfile, peer: string) => void) => void

  sendPlayerMove: (move: PlayerP2pLobbyMove) => void
  getPlayerMove: (callback: (move: PlayerP2pLobbyMove, peer: string) => void) => void
  
  refreshConnection: () => void
}


export const useP2pLobby = (lobbyId: GameLobbyId, myPlayerProfile: PublicPlayerProfile): IP2pLobby => {
  
  const [lobbyDetails, setLobbyDetails] = useState<HostP2pLobbyDetails | null>(null)
  const [peerProfiles, setPeerProfiles] = useState<Map<string, PublicPlayerProfile>>(new Map())
  const [connectionEvents, setConnectionEvents] = useState<ConnectionEvent[]>([]);

  // Create room - gets recreated on every render
  const room = joinRoom(TrysteroConfig, lobbyId, (error: {
    error: string;
    appId: string;
    roomId: string;
    peerId: string;
  }) => {
    console.error('Join error:', error)
    addConnectionEvent('join-error', `Join error: ${error.error}`, 0);
  });
  console.log('room', room)

  const addConnectionEvent = (type: ConnectionEvent['type'], message: string, peerCount: number) => {
    const event: ConnectionEvent = {
      type,
      timestamp: new Date(),
      peerCount,
      message
    };
    console.log(`📡 [${event.timestamp.toLocaleTimeString()}] ${event.message}`);
    setConnectionEvents(prev => [...prev, event]);
  };

  const [_, getPublicHostData] = room.makeAction<HostP2pLobbyDetails>(P2P_LOBBY_DETAILS_ACTION_KEY);
  const [sendPlayerProfile, getPlayerProfile] = room.makeAction<PublicPlayerProfile>(P2P_LOBBY_PLAYER_PROFILE_DATA_ACTION_KEY)
  const [sendPlayerMove, getPlayerMove] = room.makeAction<PlayerP2pLobbyMove>(P2P_LOBBY_PLAYER_MOVE_DATA_ACTION_KEY)

  const connectionStatus = `Connected to ${peerProfiles.size} peers`;

  // Initialize connection event on mount
  useEffect(() => {
    addConnectionEvent('initialized', 'P2P lobby connection initialized', 0);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('🔌 Cleaning up P2P lobby connection');
      room.leave();
    };
  }, []); // No dependencies - cleanup only on unmount

  room.onPeerJoin(peer => {
    console.log('Peer joined:', peer)
    sendPlayerProfile(myPlayerProfile, peer);
    setPeerProfiles(prev => {
      const updated = new Map(prev).set(peer, myPlayerProfile);
      const newCount = updated.size;
      addConnectionEvent('peer-joined', `Peer joined (total: ${newCount})`, newCount);
      return updated;
    });
  })

  room.onPeerLeave(peer => {
    console.log('Peer left:', peer)
    setPeerProfiles(prev => {
      const updated = new Map(prev)
      updated.delete(peer)
      const newCount = updated.size;
      addConnectionEvent('peer-left', `Peer left (total: ${newCount})`, newCount);
      return updated;
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

  const refreshConnection = () => {
    addConnectionEvent('auto-refresh', 'Connection refreshed manually', peerProfiles.size);
    setPeerProfiles(new Map());
    setLobbyDetails(null);
    // Room will be recreated on next render automatically
  };

  
  return {
    room,
    lobbyDetails,
    connectionStatus: connectionStatus,
    connectionEvents,
    peerProfiles,
    playerProfiles,
    getPlayerProfile,
    sendPlayerMove,
    getPlayerMove,
    refreshConnection,
  }
}
