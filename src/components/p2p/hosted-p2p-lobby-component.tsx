import { useCallback, useEffect, useState } from "react"
import { PublicPlayerProfile } from "~/models/public-player-profile"
import { GameLobbyId, PlayerProfileId } from "~/types/core/branded-values/bfg-branded-ids"
import { PeerProfilesComponent } from "./peer-profiles-component"
import { HostP2pLobbyDetails, PlayerP2pLobbyMove } from "~/models/p2p-details"
import { LobbyHostOptionsComponent } from "../lobby/lobby-host-options-component"
import { GameLobby, LobbyOptions } from "~/models/p2p-lobby"
import { playerTakeSeat } from "~/data/game-lobby-ops/player-take-seat"
import { playerSetGameChoice } from "~/data/game-lobby-ops/player-set-game-choice"
import { LobbyStateComponent } from "../lobby/lobby-host-state-component"
import { updateHostedLobbyPlayerPool } from "~/store/hosted-lobbies-store"
import { playerLeaveSeat } from "~/data/game-lobby-ops/player-leave-seat"
import { useHostedP2pLobby } from "~/hooks/p2p/use-hosted-p2p-lobby"


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
  
  const [copySuccess, setCopySuccess] = useState(false);
  const hostedP2pLobby = useHostedP2pLobby(lobbyId, hostPlayerProfile);
  const { p2pLobby, connectionStatus, peerProfiles, sendLobbyData } = hostedP2pLobby;
  const { room, getPlayerMove, playerProfiles } = p2pLobby;

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
  room.onPeerJoin(_peer => {
    doSendLobbyData();
  })


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
          updateLobbyState(updatedLobbyForSeat);
        }
        break;

      case 'leave-seat':
        const updatedLobbyForLeaveSeat = await playerLeaveSeat(lobbyState, playerId);
        console.log('updatedLobbyForLeaveSeat', updatedLobbyForLeaveSeat);
        if (updatedLobbyForLeaveSeat) {
          updateHostedLobbyPlayerPool(lobbyId, updatedLobbyForLeaveSeat.playerPool as PlayerProfileId[]);
          updateLobbyState(updatedLobbyForLeaveSeat);
        }
        break;
      
      default:
        console.error('Unknown player move:', move);
        break;
    }
  })

  const onSetLobbyOptions = (lobbyOptions: LobbyOptions) => {
    setLobbyOptions(lobbyOptions);
    doSendLobbyData();
  }

  const joinLobbyLink = `${window.location.origin}/join-lobby/${lobbyId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(joinLobbyLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = joinLobbyLink;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed: ', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ 
          fontSize: '28px', 
          margin: '0 0 8px 0', 
          color: '#333',
          fontWeight: '600'
        }}>
          🎮 Hosted Lobby [{lobbyOptions.gameChoices.length} games]
        </h1>
        <div style={{ 
          fontSize: '16px', 
          color: '#666',
          marginBottom: '16px'
        }}>
          <div style={{ marginBottom: '8px' }}>Join Lobby Link:</div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            <a 
              href={joinLobbyLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '8px 12px', 
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontSize: '14px',
                color: '#007bff',
                textDecoration: 'none',
                border: '1px solid #e9ecef',
                display: 'inline-block',
                maxWidth: '400px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e9ecef';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
              }}
            >
              {joinLobbyLink}
            </a>
            <button
              onClick={copyToClipboard}
              style={{
                padding: '8px 12px',
                backgroundColor: copySuccess ? '#28a745' : '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!copySuccess) {
                  e.currentTarget.style.backgroundColor = '#5a6268';
                }
              }}
              onMouseLeave={(e) => {
                if (!copySuccess) {
                  e.currentTarget.style.backgroundColor = '#6c757d';
                }
              }}
            >
              {copySuccess ? '✅ Copied!' : '📋 Copy'}
            </button>
          </div>
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
