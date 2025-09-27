import { GameLobby, LobbyOptions } from "~/models/p2p-lobby"
import { BfgSupportedGameTitles } from "~/types/bfg-game-engines/supported-games"
import { PrivatePlayerProfile } from "~/models/private-player-profile"


interface ILobbyPlayerChoicesComponentProps {
  lobbyOptions: LobbyOptions
  lobbyState: GameLobby
  currentPlayerProfile?: PrivatePlayerProfile

  onSelectGameChoice: (gameChoice: BfgSupportedGameTitles) => void
  onTakeSeat: () => void
  onLeaveSeat: () => void
}

export const LobbyPlayerChoicesComponent = ({ 
  lobbyOptions,
  lobbyState,
  currentPlayerProfile,
  onSelectGameChoice,
  onTakeSeat,
  onLeaveSeat,
}: ILobbyPlayerChoicesComponentProps) => {

  const handleGameChoice = (gameChoice: BfgSupportedGameTitles) => {
    console.log('Selecting game choice:', gameChoice);
    onSelectGameChoice(gameChoice);
  };

  const handleTakeSeat = () => {
    onTakeSeat();
  };

  const handleLeaveSeat = () => {
    onLeaveSeat();
  };

  // Check if the current player is already in the lobby
  const isPlayerAlreadyInLobby = currentPlayerProfile 
    ? lobbyState.playerPool.includes(currentPlayerProfile.id)
    : false;

  return (
    <div>
      Lobby - {lobbyState.lobbyName} ({lobbyOptions.gameChoices.length} games available)
      <div style={{ marginTop: '16px' }}>
        {lobbyOptions.gameChoices.map(choice => (
          <button
            key={choice}
            onClick={() => handleGameChoice(choice)}
            style={{
              margin: '4px',
              padding: '8px 16px',
              backgroundColor: lobbyState.gameTitle === choice ? '#4CAF50' : '#f0f0f0',
              color: lobbyState.gameTitle === choice ? 'white' : 'black',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: lobbyState.gameTitle === choice ? 'bold' : 'normal'
            }}
            onMouseOver={(e) => {
              if (lobbyState.gameTitle !== choice) {
                e.currentTarget.style.backgroundColor = '#e0e0e0';
              }
            }}
            onMouseOut={(e) => {
              if (lobbyState.gameTitle !== choice) {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
              }
            }}
          >
            {choice}
          </button>
        ))}
      </div>

      

      <div style={{ marginTop: '16px', fontWeight: 'bold' }}>
        Selected Game Choice: {lobbyState.gameTitle || 'None'}
      </div>

      {/* Seat Management Section */}
      <div style={{ marginTop: '16px' }}>
        <h3>Seat Management</h3>
        <div style={{ marginBottom: '8px' }}>
          Players at table: {lobbyState.playerPool.length}/{lobbyState.maxNumPlayers}
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => {
              // Use the next available seat when taking seat
              handleTakeSeat();
            }}
            disabled={lobbyState.playerPool.length >= lobbyState.maxNumPlayers || isPlayerAlreadyInLobby}
            style={{
              margin: '2px',
              padding: '8px 16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: (lobbyState.playerPool.length >= lobbyState.maxNumPlayers || isPlayerAlreadyInLobby) ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              opacity: (lobbyState.playerPool.length >= lobbyState.maxNumPlayers || isPlayerAlreadyInLobby) ? 0.5 : 1
            }}
          >
            Take Seat
          </button>
          
          <button
            onClick={() => {
              // Use the current player's position for leaving seat
              handleLeaveSeat();
            }}
            disabled={!isPlayerAlreadyInLobby}
            style={{
              margin: '2px',
              padding: '8px 16px',
              backgroundColor: '#f44336',
              color: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: !isPlayerAlreadyInLobby ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              opacity: !isPlayerAlreadyInLobby ? 0.5 : 1
            }}
          >
            Leave Seat
          </button>
        </div>
      </div>
    </div>
  )
}
