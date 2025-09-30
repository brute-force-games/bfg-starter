import { 
  Typography, 
  Container,
  Paper,
  CircularProgress,
  Alert} from "@mui/material"
import { 
  Groups,
  Wifi} from "@mui/icons-material"
import { TabsContainerPanel } from "../lobby/tabs-container-panel"
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
  // p2pPlayerLobbyData: IPlayerP2pLobbyData
}

export const PlayerP2pLobbyComponent = ({
  lobbyId,
  playerProfile,
}: IPlayerP2pLobbyComponentProps) => {

  const lobby = useP2pLobby(lobbyId as GameLobbyId, playerProfile);

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
        // lobbyOptions={lobbyOptions}
        lobbyState={lobbyState}
        currentPlayerProfile={playerProfile}
        // onSelectGameChoice={onSelectGameChoice}
        // onTakeSeat={onTakeSeat}
        // onLeaveSeat={onLeaveSeat}
      />
    )
  }

  // const playerRangeLabel = lobbyState.minNumPlayers === lobbyState.maxNumPlayers ? 
  //   `${lobbyState.minNumPlayers} players` :
  //   `${lobbyState.minNumPlayers} - ${lobbyState.maxNumPlayers} players`;



  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header Section */}
      {/* <Paper elevation={2} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)', color: 'white' }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Person sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              Joined Lobby
            </Typography>
          </Box>
        </Stack>

      </Paper> */}

      {/* Tabbed Content */}
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
                peerProfiles={lobby.peerProfiles}
                playerProfiles={lobby.playerProfiles}
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
