import { useCallback, useEffect, useState } from "react"
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  Button, 
  Avatar, 
  Container,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Alert,
  Stack
} from "@mui/material"
import { 
  ContentCopy, 
  Refresh, 
  AdminPanelSettings, 
  Link as LinkIcon,
  CheckCircle
} from "@mui/icons-material"
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
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <AdminPanelSettings sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              Hosted Lobby
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              {lobbyOptions.gameChoices.length} games available
            </Typography>
          </Box>
        </Stack>

        {/* Connection Status */}
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Chip 
            icon={<CheckCircle />}
            label={connectionStatus}
            color="success"
            variant="outlined"
            sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: 'white',
              '& .MuiChip-icon': { color: 'white' }
            }}
          />
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={doSendLobbyData}
            sx={{ 
              borderColor: 'rgba(255, 255, 255, 0.5)',
              color: 'white',
              '&:hover': { 
                borderColor: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Resend Lobby Data
          </Button>
        </Stack>

        {/* Share Link Section */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, opacity: 0.9 }}>
            Share this lobby link:
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
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
          </Stack>
          {copySuccess && (
            <Alert severity="success" sx={{ mt: 1, backgroundColor: 'rgba(76, 175, 80, 0.2)' }}>
              Link copied to clipboard!
            </Alert>
          )}
        </Box>
      </Paper>

      {/* Main Content Grid */}
      <Box sx={{ display: 'grid', gap: 3 }}>
        {/* Lobby State Component */}
        <Card elevation={1}>
          <CardContent>
            <LobbyStateComponent
              lobbyState={lobbyState}
              updateLobbyState={updateLobbyState}
              setLobbyPlayerPool={setLobbyPlayerPool}
              playerProfiles={playerProfiles}
            />
          </CardContent>
        </Card>

        {/* Host Options Component */}
        <Card elevation={1}>
          <CardContent>
            <LobbyHostOptionsComponent
              lobbyOptions={lobbyOptions}
              setLobbyOptions={onSetLobbyOptions}
            />
          </CardContent>
        </Card>

        {/* Host Profile Section */}
        <Card elevation={1} sx={{ background: 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)' }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar
                src={hostPlayerProfile.avatarImageUrl}
                sx={{ 
                  width: 64, 
                  height: 64, 
                  bgcolor: 'primary.main',
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}
              >
                {!hostPlayerProfile.avatarImageUrl && 
                  hostPlayerProfile.handle.substring(0, 2).toUpperCase()
                }
              </Avatar>
              <Box>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  {hostPlayerProfile.handle}
                </Typography>
                <Chip 
                  icon={<AdminPanelSettings />}
                  label="Lobby Host"
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Peer Profiles Section */}
        <Card elevation={1}>
          <CardContent>
            <PeerProfilesComponent
              peerProfiles={peerProfiles}
              playerProfiles={playerProfiles}
            />
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}
