import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  Avatar, 
  Container,
  Paper,
  Stack,
  CircularProgress,
  Alert
} from "@mui/material"
import { 
  Person, 
  CheckCircle, 
  Home
} from "@mui/icons-material"
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

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)', color: 'white' }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Person sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              Joined Lobby
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Lobby ID: {lobbyId}
            </Typography>
          </Box>
        </Stack>

        {/* Connection Status */}
        <Stack direction="row" alignItems="center" spacing={2}>
          <Chip 
            icon={<CheckCircle />}
            label={lobby.connectionStatus}
            color="success"
            variant="outlined"
            sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: 'white',
              '& .MuiChip-icon': { color: 'white' }
            }}
          />
        </Stack>
      </Paper>

      {/* Main Content Grid */}
      <Box sx={{ display: 'grid', gap: 3 }}>
        {/* Player Choices Component */}
        <Card elevation={1}>
          <CardContent>
            <LobbyPlayerChoicesComponent 
              lobbyOptions={lobbyOptions}
              lobbyState={lobbyState}
              currentPlayerProfile={playerProfile}
              onSelectGameChoice={onSelectGameChoice}
              onTakeSeat={onTakeSeat}
              onLeaveSeat={onLeaveSeat}
            />
          </CardContent>
        </Card>

        {/* Player Profile Section */}
        <Card elevation={1} sx={{ background: 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)' }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar
                src={playerProfile.avatarImageUrl}
                sx={{ 
                  width: 64, 
                  height: 64, 
                  bgcolor: 'primary.main',
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}
              >
                {!playerProfile.avatarImageUrl && 
                  playerProfile.handle.substring(0, 2).toUpperCase()
                }
              </Avatar>
              <Box>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  {playerProfile.handle}
                </Typography>
                <Chip 
                  icon={<Person />}
                  label="Player"
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Lobby Information Section */}
        {lobby.lobbyDetails && (() => {
          try {
            return (
              <Card elevation={1}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                    <Home sx={{ fontSize: 24, color: 'primary.main' }} />
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                      Lobby Information
                    </Typography>
                  </Stack>
                  <Box sx={{ pl: 4 }}>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Host:</strong> {hostProfile.handle}
                    </Typography>
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 2, 
                        backgroundColor: 'grey.50',
                        fontFamily: 'monospace'
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Host ID: {hostProfile.id}
                      </Typography>
                    </Paper>
                  </Box>
                </CardContent>
              </Card>
            );
          } catch (error) {
            console.error('Failed to parse host profile:', error);
            return null;
          }
        })()}

        {/* Peer Profiles Section */}
        <Card elevation={1}>
          <CardContent>
            <PeerProfilesComponent
              peerProfiles={lobby.peerProfiles}
              playerProfiles={lobby.playerProfiles}
            />
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}
