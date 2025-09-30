import { 
  Typography, 
  Chip, 
  Stack,
  Button
} from "@mui/material"
import { 
  CheckCircle, 
  Refresh
} from "@mui/icons-material"
import { PeerProfilesComponent } from "./peer-profiles-component"
import { PublicPlayerProfile } from "~/models/public-player-profile"
import { PlayerProfileId } from "~/types/core/branded-values/bfg-branded-ids"


interface P2pConnectionComponentProps {
  connectionStatus: string
  peerProfiles: Map<string, PublicPlayerProfile>
  playerProfiles: Map<PlayerProfileId, PublicPlayerProfile>
  onResendLobbyData?: () => void
}

export const P2pConnectionComponent = ({
  connectionStatus,
  peerProfiles,
  playerProfiles,
  onResendLobbyData
}: P2pConnectionComponentProps) => {
  return (
    <>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <CheckCircle sx={{ fontSize: 24, color: 'success.main' }} />
        <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
          Connection Status
        </Typography>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <Chip 
          icon={<CheckCircle />}
          label={connectionStatus}
          color="success"
          variant="outlined"
        />
        {onResendLobbyData && (
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={onResendLobbyData}
            size="small"
          >
            Resend Lobby Data
          </Button>
        )}
      </Stack>
      <Typography variant="body2" color="text.secondary">
        Current P2P connection status and peer communication controls.
      </Typography>
      
      <PeerProfilesComponent
        peerProfiles={peerProfiles}
        playerProfiles={playerProfiles}
      />
    </>
  )
}
