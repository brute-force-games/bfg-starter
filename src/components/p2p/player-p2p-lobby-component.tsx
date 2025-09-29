import { GameLobbyId } from "~/types/core/branded-values/bfg-branded-ids"
import { useP2pLobby } from "~/hooks/p2p/use-p2p-lobby"
import { PrivatePlayerProfile } from "~/models/private-player-profile"
import { PublicPlayerProfile } from "~/models/public-player-profile"
import { PeerProfilesComponent } from "./peer-profiles-component"
import { LobbyPlayerChoicesComponent } from "../lobby/lobby-player-choices-component"
import { BfgSupportedGameTitles } from "~/types/bfg-game-engines/supported-games"
import { LobbyPlayerJoinGameComponent } from "../lobby/lobby-player-join-game-component"


interface IPlayerP2pLobbyComponentProps {
  lobbyId: GameLobbyId
  playerProfile: PrivatePlayerProfile
}

export const PlayerP2pLobbyComponent = ({
  lobbyId,
  playerProfile,
}: IPlayerP2pLobbyComponentProps) => {

  const lobby = useP2pLobby(lobbyId as GameLobbyId, playerProfile);

  const { lobbyDetails, sendPlayerMove } = lobby;

  if (!lobby) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        color: '#666'
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '16px',
          opacity: 0.5
        }}>
          ⏳
        </div>
        <h3 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '18px',
          color: '#333'
        }}>
          Connecting to lobby...
        </h3>
        <p style={{ 
          margin: 0, 
          fontSize: '14px',
          color: '#666'
        }}>
          Please wait while we establish the connection.
        </p>
      </div>
    )
  }

  const hostProfile = lobbyDetails?.hostPlayerProfile as PublicPlayerProfile;

  const lobbyOptions = lobbyDetails?.lobbyOptions ?? {
    gameChoices: [],
    maxPlayers: 8,
  };

  const lobbyState = lobby.lobbyDetails?.lobbyState;

  const onSelectGameChoice = (gameChoice: BfgSupportedGameTitles) => {
    sendPlayerMove({ move: 'set-game-choice', gameChoice: gameChoice });
  }
  const onTakeSeat = () => {
    sendPlayerMove({ move: 'take-seat' });
  }
  const onLeaveSeat = () => {
    sendPlayerMove({ move: 'leave-seat' });
  }

  if (!lobbyState) {
    return (
      <div>
        Connecting to lobby... 
        Make sure the host has started the lobby. Please wait while we establish the connection.
      </div>
    )
  }

  const gameLink = lobbyState.gameLink;

  if (gameLink) {
    return (
      <LobbyPlayerJoinGameComponent
        // lobbyOptions={lobbyOptions}
        lobbyState={lobbyState}
        currentPlayerProfile={playerProfile}
        // onSelectGameChoice={onSelectGameChoice}
        // onTakeSeat={onTakeSeat}
        // onLeaveSeat={onLeaveSeat}
      />
)
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
          🎯 Joined Lobby
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
            🟢 {lobby.connectionStatus}
          </div>
        </div>
      </div>

      <LobbyPlayerChoicesComponent 
        lobbyOptions={lobbyOptions}
        lobbyState={lobbyState}
        currentPlayerProfile={playerProfile}
        onSelectGameChoice={onSelectGameChoice}
        onTakeSeat={onTakeSeat}
        onLeaveSeat={onLeaveSeat}
      />

      {/* Player Profile Section */}
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
          👤 Your Profile
        </h2>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#007bff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            marginRight: '16px',
            fontSize: '20px',
            fontWeight: 'bold'
          }}>
            {playerProfile.avatarImageUrl ? (
              <img 
                src={playerProfile.avatarImageUrl} 
                alt={`${playerProfile.handle} avatar`}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  borderRadius: '50%', 
                  objectFit: 'cover' 
                }}
              />
            ) : (
              playerProfile.handle.substring(0, 2).toUpperCase()
            )}
          </div>
          <div>
            <h3 style={{ 
              margin: 0, 
              fontSize: '18px', 
              fontWeight: '600',
              color: '#333'
            }}>
              {playerProfile.handle}
            </h3>
            <div style={{
              fontSize: '14px',
              color: '#666'
            }}>
              Player
            </div>
          </div>
        </div>
      </div>

      {/* Lobby Data Section */}
      {lobby.lobbyDetails && (() => {
        try {
          return (
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
                🏠 Lobby Information
              </h2>
              <div style={{
                fontSize: '14px',
                color: '#666',
                lineHeight: '1.5'
              }}>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Host:</strong> {hostProfile.handle}
                </div>
                <div style={{ 
                  fontSize: '12px',
                  color: '#888',
                  fontFamily: 'monospace',
                  backgroundColor: '#fff',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #dee2e6'
                }}>
                  <strong>Host ID:</strong> {hostProfile.id}
                </div>
              </div>
            </div>
          );
        } catch (error) {
          console.error('Failed to parse host profile:', error);
          return null;
        }
      })()}

      {/* Peer Profiles Section */}
      <PeerProfilesComponent
        peerProfiles={lobby.peerProfiles}
        playerProfiles={lobby.playerProfiles}
      />
    </div>
  )
}
