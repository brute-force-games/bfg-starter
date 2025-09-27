import { useCallback, useEffect } from "react"
import { PublicPlayerProfile } from "~/models/public-player-profile"
import { GameLobbyId, PlayerProfileId } from "~/types/core/branded-values/bfg-branded-ids"
import { P2P_LOBBY_DETAILS_ACTION_KEY, P2P_LOBBY_PLAYER_PROFILE_DATA_ACTION_KEY } from "./constants"
import { PeerProfilesComponent } from "./peer-profiles-component"
import { HostP2pLobbyDetails, PlayerP2pLobbyMove } from "~/models/p2p-details"
import { LobbyHostOptionsComponent } from "../lobby/lobby-host-options-component"
import { GameLobby, LobbyOptions } from "~/models/p2p-lobby"
import { useP2pLobby } from "~/hooks/p2p/use-p2p-lobby"
import { playerTakeSeat } from "~/data/game-lobby-ops/player-take-seat"
import { playerSetGameChoice } from "~/data/game-lobby-ops/player-set-game-choice"
import { LobbyStateComponent } from "../lobby/lobby-host-state-component"
import { updateHostedLobbyPlayerPool } from "~/store/hosted-lobbies-store"
import { playerLeaveSeat } from "~/data/game-lobby-ops/player-leave-seat"


interface IHostedP2pLobbyComponentProps {
  lobbyId: GameLobbyId
  hostPlayerProfile: PublicPlayerProfile

  lobbyOptions: LobbyOptions
  lobbyState: GameLobby

  updateLobbyState: (lobbyState: GameLobby) => void

  setLobbyOptions: (lobbyOptions: LobbyOptions) => void
  setLobbyPlayerPool: (playerPool: PlayerProfileId[]) => void
}

export const HostedP2pLobbyComponent = ({
  lobbyId,
  hostPlayerProfile,
  lobbyOptions,
  lobbyState,
  updateLobbyState,
  setLobbyPlayerPool,
  setLobbyOptions,
}: IHostedP2pLobbyComponentProps) => {
  
  const p2pLobby = useP2pLobby(lobbyId, hostPlayerProfile);
  const { room, connectionStatus, peerProfiles, playerProfiles, getPlayerMove } = p2pLobby;

  // const hostedLobbyPeers = p2pLobby.playerProfiles;
  // console.log('hostedLobbyPeers', hostedLobbyPeers);

  const [sendLobbyData] = room.makeAction<HostP2pLobbyDetails>(P2P_LOBBY_DETAILS_ACTION_KEY)
  const [sendPlayerProfile, getPlayerProfile] = room.makeAction<PublicPlayerProfile>(P2P_LOBBY_PLAYER_PROFILE_DATA_ACTION_KEY)
  // const [sendPlayerMove, getPlayerMove] = room.makeAction<PlayerP2pLobbyMove>(P2P_LOBBY_PLAYER_MOVE_DATA_ACTION_KEY)

  const doSendLobbyData = useCallback(() => {
    if (lobbyState) {
      const lobbyData: HostP2pLobbyDetails = {
        hostPlayerProfile,
        lobbyOptions,
        lobbyState,
      }

      sendLobbyData(lobbyData);
    } else {
      console.log('no lobby details to send');
    }
  }, [hostPlayerProfile, lobbyOptions, lobbyState, sendLobbyData])

  useEffect(() => {
    doSendLobbyData();
  }, [doSendLobbyData])

  // Handle peer connections
  room.onPeerJoin(peer => {
    sendPlayerProfile(hostPlayerProfile, peer)
    doSendLobbyData();
  })

  // room.onPeerLeave(peer => {
  //   console.log('Peer left hosted lobby:', peer)
  //   setConnectionStatus(`Hosting lobby - ${Object.keys(peerProfiles).length - 1} players connected`)
  //   // Remove the peer from our profiles
  //   setPeerProfiles(prev => {
  //     const updated = { ...prev }
  //     delete updated[peer]
  //     return updated
  //   })
  // })

  // // Listen for player profiles from peers
  // getPlayerProfile((playerProfile: PublicPlayerProfile, peer: string) => {
  //   console.log('Received player profile from peer:', peer, playerProfile)
  //   setPeerProfiles(prev => ({ ...prev, [peer]: playerProfile }))
  // })

  getPlayerMove(async (move: PlayerP2pLobbyMove, peer: string) => {
    console.log('Received player move from peer:', peer, move);

    const playerId = peerProfiles.get(peer)?.id;
    if (!playerId) {
      console.error('Player ID not found for peer:', peer);
      return;
    }

    switch (move.move) {
      case 'set-game-choice':
        const updatedLobbyForGameChoice = await playerSetGameChoice(lobbyState, playerId, move.gameChoice);
        if (updatedLobbyForGameChoice) {
          updateLobbyState(updatedLobbyForGameChoice);
        }
        break;

      case 'take-seat':
        const updatedLobbyForSeat = await playerTakeSeat(lobbyState, playerId);
        console.log('updatedLobbyForSeat', updatedLobbyForSeat);
        if (updatedLobbyForSeat) {
          updateHostedLobbyPlayerPool(lobbyId, updatedLobbyForSeat.playerPool as PlayerProfileId[]);
        }
        break;

      case 'leave-seat':
        const updatedLobbyForLeaveSeat = await playerLeaveSeat(lobbyState, playerId);
        console.log('updatedLobbyForLeaveSeat', updatedLobbyForLeaveSeat);
        if (updatedLobbyForLeaveSeat) {
          updateHostedLobbyPlayerPool(lobbyId, updatedLobbyForLeaveSeat.playerPool as PlayerProfileId[]);
        }
        break;
      
      default:
        console.error('Unknown player move:', move);
        break;
    }
  })

  // const handleResendLobbyData = () => {
  //   doSendLobbyData();
  //   // if (lobbyDetails) {
  //   //   sendLobbyData({
  //   //     hostPlayerProfile: hostPlayerProfile,
  //   //     lobbyOptions: lobbyOptions,
  //   //     lobbyState: lobbyDetails,
  //   //   })
  //   // }
  // }

  const onSetLobbyOptions = (lobbyOptions: LobbyOptions) => {
    setLobbyOptions(lobbyOptions);
    doSendLobbyData();
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ 
          fontSize: '28px', 
          margin: '0 0 8px 0', 
          color: '#333',
          fontWeight: '600'
        }}>
          🎮 Hosted Lobby [{lobbyOptions.gameChoices.length} games, {lobbyOptions.maxPlayers} players]
        </h1>
        <div style={{ 
          fontSize: '16px', 
          color: '#666',
          marginBottom: '16px'
        }}>
          Lobby ID: <code style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '4px 8px', 
            borderRadius: '4px',
            fontFamily: 'monospace'
          }}>{lobbyId}</code>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div style={{
            padding: '8px 16px',
            backgroundColor: '#e8f5e8',
            color: '#155724',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '500',
            border: '1px solid #c3e6cb'
          }}>
            🟢 {connectionStatus}
          </div>
          <button 
            onClick={doSendLobbyData}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            🔄 Resend Lobby Data
          </button>
        </div>
      </div>

      <LobbyStateComponent
        lobbyState={lobbyState}
        updateLobbyState={updateLobbyState}
        setLobbyPlayerPool={setLobbyPlayerPool}
        playerProfiles={playerProfiles}
      />

      <LobbyHostOptionsComponent
        lobbyOptions={lobbyOptions}
        setLobbyOptions={onSetLobbyOptions}
      />

      {/* Host Profile Section */}
      <div style={{ 
        marginBottom: '32px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        border: '1px solid #e9ecef'
      }}>
        <h2 style={{ 
          margin: '0 0 16px 0', 
          fontSize: '20px', 
          color: '#333',
          fontWeight: '600'
        }}>
          👑 Host Profile
        </h2>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#ffc107',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            marginRight: '16px',
            fontSize: '20px',
            fontWeight: 'bold'
          }}>
            {hostPlayerProfile.avatarImageUrl ? (
              <img 
                src={hostPlayerProfile.avatarImageUrl} 
                alt={`${hostPlayerProfile.handle} avatar`}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  borderRadius: '50%', 
                  objectFit: 'cover' 
                }}
              />
            ) : (
              hostPlayerProfile.handle.substring(0, 2).toUpperCase()
            )}
          </div>
          <div>
            <h3 style={{ 
              margin: 0, 
              fontSize: '18px', 
              fontWeight: '600',
              color: '#333'
            }}>
              {hostPlayerProfile.handle}
            </h3>
            <div style={{
              fontSize: '14px',
              color: '#666'
            }}>
              Lobby Host
            </div>
          </div>
        </div>
      </div>

      {/* Peer Profiles Section */}
      <PeerProfilesComponent
        peerProfiles={peerProfiles}
        playerProfiles={playerProfiles}
      />
    </div>
  )
}
