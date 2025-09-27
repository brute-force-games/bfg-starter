import { useState } from "react";
import { joinRoom, Room } from "trystero";
import { P2P_GAME_PLAYER_PROFILE_DATA_ACTION_KEY, P2P_GAME_PLAYER_MOVE_DATA_ACTION_KEY, P2P_GAME_TABLE_ACTION_KEY, P2P_GAME_ACTIONS_ACTION_KEY } from "~/components/p2p/constants";
import { GameTable } from "~/models/game-table/game-table";
import { DbGameTableAction } from "~/models/game-table/game-table-action";
import { PublicPlayerProfile } from "~/models/public-player-profile";
import { TrysteroConfig } from "~/p2p/trystero-config";
import { AbfgSupportedGameTitle } from "~/types/bfg-game-engines/supported-games";
import { GameTableId, PlayerProfileId } from "~/types/core/branded-values/bfg-branded-ids"
import { BfgGameSpecificGameStateTypedJson } from "~/types/core/branded-values/bfg-game-state-typed-json";


export interface IP2pGame {
  room: Room
  connectionStatus: string

  peerProfiles: Map<string, PublicPlayerProfile>
  playerProfiles: Map<PlayerProfileId, PublicPlayerProfile>

  gameTable: GameTable | null;
  gameActions: DbGameTableAction[];

  sendPlayerMove: (move: BfgGameSpecificGameStateTypedJson<AbfgSupportedGameTitle>) => void
  getPlayerMove: (callback: (move: BfgGameSpecificGameStateTypedJson<AbfgSupportedGameTitle>, peer: string) => void) => void
}


export const useP2pGame = (gameTableId: GameTableId, myPlayerProfile: PublicPlayerProfile | null): IP2pGame => {
  
  const room = joinRoom(TrysteroConfig, gameTableId);

  const [gameTable, setGameTable] = useState<GameTable | null>(null)
  const [gameActions, setGameActions] = useState<DbGameTableAction[]>([])
  const [connectionStatus, setConnectionStatus] = useState<string>('Connecting...')
  const [peerProfiles, setPeerProfiles] = useState<Map<string, PublicPlayerProfile>>(new Map())

  const [, getPublicGameTableData] = room.makeAction<GameTable>(P2P_GAME_TABLE_ACTION_KEY);
  const [, getPublicGameActionsData] = room.makeAction<DbGameTableAction[]>(P2P_GAME_ACTIONS_ACTION_KEY);
  const [sendPlayerProfile, getPlayerProfile] = room.makeAction<PublicPlayerProfile>(P2P_GAME_PLAYER_PROFILE_DATA_ACTION_KEY)
  const [sendPlayerMove, getPlayerMove] = room.makeAction<BfgGameSpecificGameStateTypedJson<AbfgSupportedGameTitle>>(P2P_GAME_PLAYER_MOVE_DATA_ACTION_KEY)

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

  getPublicGameTableData((publicGameTableData: GameTable, _peer: string) => {
    setGameTable(publicGameTableData)
  })

  getPublicGameActionsData((publicGameActionsData: DbGameTableAction[], _peer: string) => {
    setGameActions(publicGameActionsData)
  })

  getPlayerProfile((playerProfile: PublicPlayerProfile, peer: string) => {
    setPeerProfiles(prev => new Map(prev).set(peer, playerProfile))
  })

  const playerProfiles = new Map<PlayerProfileId, PublicPlayerProfile>(
    Array.from(peerProfiles.values()).map(profile => [profile.id, profile])
  );

  
  return {
    room,
    gameTable,
    gameActions,
    connectionStatus: connectionStatus,
    peerProfiles,
    playerProfiles,
    sendPlayerMove,
    getPlayerMove,
  }
}
