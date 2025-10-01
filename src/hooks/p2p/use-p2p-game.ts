import { useState, useEffect } from "react";
import { joinRoom, Room } from "trystero";
import { P2P_GAME_PLAYER_PROFILE_DATA_ACTION_KEY, P2P_GAME_PLAYER_MOVE_DATA_ACTION_KEY, P2P_GAME_TABLE_ACTION_KEY, P2P_GAME_ACTIONS_ACTION_KEY } from "~/components/p2p/constants";
import { GameTable } from "~/models/game-table/game-table";
import { DbGameTableAction } from "~/models/game-table/game-table-action";
import { PublicPlayerProfile } from "~/models/public-player-profile";
import { TrysteroConfig } from "~/p2p/trystero-config";
import { AbfgSupportedGameTitle } from "~/types/bfg-game-engines/supported-games";
import { GameTableId, PlayerProfileId } from "~/types/core/branded-values/bfg-branded-ids"
import { BfgGameSpecificGameStateTypedJson } from "~/types/core/branded-values/bfg-game-state-typed-json";
import { ConnectionEvent } from "./use-p2p-lobby";

// Re-export for convenience
export type { ConnectionEvent };


export interface IP2pGame {
  room: Room
  connectionStatus: string
  connectionEvents: ConnectionEvent[]

  peerProfiles: Map<string, PublicPlayerProfile>
  playerProfiles: Map<PlayerProfileId, PublicPlayerProfile>

  gameTable: GameTable | null;
  gameActions: DbGameTableAction[];

  sendPlayerMove: (move: BfgGameSpecificGameStateTypedJson<AbfgSupportedGameTitle>) => void
  getPlayerMove: (callback: (move: BfgGameSpecificGameStateTypedJson<AbfgSupportedGameTitle>, peer: string) => void) => void
  
  refreshConnection: () => void
}


export const useP2pGame = (gameTableId: GameTableId, myPlayerProfile: PublicPlayerProfile | null): IP2pGame => {
  
  // Create room - gets recreated on every render
  const room = joinRoom(TrysteroConfig, gameTableId);

  const [gameTable, setGameTable] = useState<GameTable | null>(null)
  const [gameActions, setGameActions] = useState<DbGameTableAction[]>([])
  const [peerProfiles, setPeerProfiles] = useState<Map<string, PublicPlayerProfile>>(new Map())
  const [connectionEvents, setConnectionEvents] = useState<ConnectionEvent[]>([]);

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

  const [, getPublicGameTableData] = room.makeAction<GameTable>(P2P_GAME_TABLE_ACTION_KEY);
  const [, getPublicGameActionsData] = room.makeAction<DbGameTableAction[]>(P2P_GAME_ACTIONS_ACTION_KEY);
  const [sendPlayerProfile, getPlayerProfile] = room.makeAction<PublicPlayerProfile>(P2P_GAME_PLAYER_PROFILE_DATA_ACTION_KEY)
  const [sendPlayerMove, getPlayerMove] = room.makeAction<BfgGameSpecificGameStateTypedJson<AbfgSupportedGameTitle>>(P2P_GAME_PLAYER_MOVE_DATA_ACTION_KEY)

  if (!myPlayerProfile) {
    throw new Error('My player profile is required');
  }

  const connectionStatus = `Connected to ${peerProfiles.size} peers`;

  // Initialize connection event on mount
  useEffect(() => {
    addConnectionEvent('initialized', 'P2P game connection initialized', 0);
  }, []);

  // // Cleanup on unmount
  // useEffect(() => {
  //   return () => {
  //     console.log('🔌 Cleaning up P2P game connection');
  //     room.leave();
  //   };
  // }, []); // No dependencies - cleanup only on unmount

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

  getPublicGameTableData((publicGameTableData: GameTable, peer: string) => {
    console.log('🎮 Received game table data from peer:', peer, publicGameTableData)
    setGameTable(publicGameTableData)
  })

  getPublicGameActionsData((publicGameActionsData: DbGameTableAction[], peer: string) => {
    console.log('🎮 Received game actions data from peer:', peer, publicGameActionsData)
    setGameActions(publicGameActionsData)
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
    setGameTable(null);
    setGameActions([]);
    // Room will be recreated on next render automatically
  };

  
  return {
    room,
    gameTable,
    gameActions,
    connectionStatus: connectionStatus,
    connectionEvents,
    peerProfiles,
    playerProfiles,
    sendPlayerMove,
    getPlayerMove,
    refreshConnection,
  }
}
