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
  Alert,
  TextField,
  InputAdornment,
  IconButton
} from "@mui/material"
import { 
  Person, 
  CheckCircle, 
  Home,
  ContentCopy,
  Link as LinkIcon
} from "@mui/icons-material"
import { useState } from "react"
import { LobbyTabsComponent } from "../lobby/lobby-tabs-component"
import { GameLobbyId } from "~/types/core/branded-values/bfg-branded-ids"
import { useP2pLobby } from "~/hooks/p2p/use-p2p-lobby"
import { PrivatePlayerProfile } from "~/models/private-player-profile"
import { PublicPlayerProfile } from "~/models/public-player-profile"
import { P2pConnectionComponent } from "./p2p-connection-component"
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

  const [copySuccess, setCopySuccess] = useState(false);
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
            {/* <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Lobby ID: {lobbyId} • {lobbyOptions.gameChoices.length} games available
            </Typography> */}
          </Box>
        </Stack>

        {/* Share Link Section */}
        <Box>
          {/* <Typography variant="subtitle2" sx={{ mb: 1, opacity: 0.9 }}>
            Share this lobby link:
          </Typography> */}
          <Stack direction="row" spacing={1} alignItems="center">
          <IconButton
              onClick={copyToClipboard}
              sx={{
                backgroundColor: copySuccess ? 'success.main' : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                '&:hover': {
                  backgroundColor: copySuccess ? 'success.dark' : 'rgba(255, 255, 255, 0.2)',
                }
              }}
            >
              {copySuccess ? <CheckCircle /> : <ContentCopy />}
            </IconButton>
            <TextField
              value={joinLobbyLink}
              size="small"
              fullWidth
              variant="outlined"
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                  </InputAdornment>
                ),
                sx: {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',
                    fontFamily: 'monospace',
                  }
                }
              }}
            />
          </Stack>
          {copySuccess && (
            <Alert severity="success" sx={{ mt: 1, backgroundColor: 'rgba(76, 175, 80, 0.2)' }}>
              Link copied to clipboard!
            </Alert>
          )}
        </Box>
      </Paper>

      {/* Tabbed Content */}
      <LobbyTabsComponent
        lobbyType="player"
        lobbyInfoContent={
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
          </Box>
        }
        p2pConnectionContent={
          <P2pConnectionComponent
            connectionStatus={lobby.connectionStatus}
            peerProfiles={lobby.peerProfiles}
            playerProfiles={lobby.playerProfiles}
          />
        }
      />
    </Container>
  )
}
