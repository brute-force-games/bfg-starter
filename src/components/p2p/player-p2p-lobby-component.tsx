import { 
  Typography, 
  Container,
  Paper,
  CircularProgress,
  Alert} from "@mui/material"
import { 
  Groups,
  Wifi} from "@mui/icons-material"
import { TabsContainerPanel } from "../tabs-container-panel"
import { GameLobbyId } from "~/types/core/branded-values/bfg-branded-ids"
import { useP2pLobby } from "~/hooks/p2p/use-p2p-lobby"
import { PrivatePlayerProfile } from "~/models/private-player-profile"
import { P2pConnectionComponent } from "./p2p-connection-component"
import { BfgSupportedGameTitles } from "~/types/bfg-game-engines/supported-games"
import { LobbyPlayerJoinGameComponent } from "../lobby/lobby-player-join-game-component"
import { LobbyPlayerStateComponent } from "../lobby/lobby-player-state-component"


interface IPlayerP2pLobbyComponentProps {
  lobbyId: GameLobbyId
  playerProfile: PrivatePlayerProfile
}

export const PlayerP2pLobbyComponent = ({
  lobbyId,
  playerProfile,
}: IPlayerP2pLobbyComponentProps) => {

  const lobby = useP2pLobby(lobbyId as GameLobbyId, playerProfile);
  console.log('PlayerP2pLobbyComponent: lobby', lobby);

  const { sendPlayerMove } = lobby;

  if (!lobby) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress size={48} sx={{ mb: 2, color: 'primary.main' }} />
          <Typography variant="h6" component="h3" sx={{ mb: 1, color: 'text.primary' }}>
            Connecting to lobby...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please wait while we establish the connection.
          </Typography>
        </Paper>
      </Container>
    )
  }

  const lobbyState = lobby.lobbyDetails?.lobbyState;
  const lobbyOptions = lobby.lobbyDetails?.lobbyOptions;

  const onSelectGameChoice = (gameChoice: BfgSupportedGameTitles) => {
    sendPlayerMove({ move: 'set-game-choice', gameChoice: gameChoice });
  }
  const onTakeSeat = () => {
    sendPlayerMove({ move: 'take-seat' });
  }
  const onLeaveSeat = () => {
    sendPlayerMove({ move: 'leave-seat' });
  }

  console.log('PlayerP2pLobbyComponent: lobbyState', lobbyState);
  console.log('PlayerP2pLobbyComponent: lobbyOptions', lobbyOptions);

  if (!lobbyState || !lobbyOptions) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress size={48} sx={{ mb: 2, color: 'primary.main' }} />
          <Typography variant="h6" component="h3" sx={{ mb: 1, color: 'text.primary' }}>
            Connecting to lobby...
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Make sure the host has started the lobby. Please wait while we establish the connection.
          </Typography>
          <Alert severity="info" sx={{ textAlign: 'left' }}>
            Waiting for lobby data from the host.
          </Alert>
        </Paper>
      </Container>
    )
  }

  const gameLink = lobbyState.gameLink;

  if (gameLink) {
    return (
      <LobbyPlayerJoinGameComponent
        lobbyState={lobbyState}
        currentPlayerProfile={playerProfile}
      />
    )
  }


  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <TabsContainerPanel
        tabs={[
          {
            title: "Player Lobby",
            icon: <Groups />,
            content: (
              <LobbyPlayerStateComponent
                playerProfiles={lobby.playerProfiles}
                lobbyState={lobbyState}
                currentPlayerProfile={playerProfile}
                lobbyOptions={lobbyOptions}
                onSelectGameChoice={onSelectGameChoice}
                onTakeSeat={onTakeSeat}
                onLeaveSeat={onLeaveSeat}
              />
            )
          },
          {
            title: "P2P",
            icon: <Wifi />,
            content: (
              <P2pConnectionComponent
                connectionStatus={lobby.connectionStatus}
                connectionEvents={lobby.connectionEvents}
                peerProfiles={lobby.peerProfiles}
                playerProfiles={lobby.playerProfiles}
                onRefreshConnection={lobby.refreshConnection}
              />
            )
          }
        ]}
        tabColor="linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)"
        ariaLabel="player lobby tabs"
      />
    </Container>
  )
}
