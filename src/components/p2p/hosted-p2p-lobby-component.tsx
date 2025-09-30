import { useCallback, useEffect, useState } from "react"
import { 
  Box, 
  Container} from "@mui/material"
import { 
  Groups,
  Wifi
} from "@mui/icons-material"
import { TabsContainerPanel } from "../lobby/tabs-container-panel"
import { GameLobbyId, PlayerProfileId } from "~/types/core/branded-values/bfg-branded-ids"
import { P2pConnectionComponent } from "./p2p-connection-component"
import { HostP2pLobbyDetails, PlayerP2pLobbyMove } from "~/models/p2p-details"
import { GameLobby, LobbyOptions } from "~/models/p2p-lobby"
import { playerTakeSeat } from "~/data/game-lobby-ops/player-take-seat"
import { playerSetGameChoice } from "~/data/game-lobby-ops/player-set-game-choice"
import { LobbyHostStateComponent } from "../lobby/lobby-host-state-component"
import { updateHostedLobbyPlayerPool } from "~/store/hosted-lobbies-store"
import { playerLeaveSeat } from "~/data/game-lobby-ops/player-leave-seat"
import { useHostedP2pLobby } from "~/hooks/p2p/use-hosted-p2p-lobby"
import { PublicPlayerProfile } from "~/models/public-player-profile"
import { LobbyHostOptionsDialog } from "~/dialogs/lobby-host-options-dialog"


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
  const [isLobbyOptionsDialogOpen, setIsLobbyOptionsDialogOpen] = useState(false);
  
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

  const handleOpenLobbyOptionsDialog = () => {
    setIsLobbyOptionsDialogOpen(true);
  };

  const handleCloseLobbyOptionsDialog = () => {
    setIsLobbyOptionsDialogOpen(false);
  };

  const handleSaveLobbyOptions = (updatedLobbyOptions: LobbyOptions) => {
    onSetLobbyOptions(updatedLobbyOptions);
  };


  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <TabsContainerPanel
        tabs={[
          {
            title: "Lobby Admin",
            icon: <Groups />,
            content: (
              <Box sx={{ display: 'grid', gap: 3 }}>
                {/* <LobbyHostOptionsComponent
                  lobbyOptions={lobbyOptions}
                  setLobbyOptions={onSetLobbyOptions}
                /> */}
                <LobbyHostStateComponent
                  playerProfiles={playerProfiles}
                  lobbyState={lobbyState}
                  updateLobbyState={updateLobbyState}
                  setLobbyPlayerPool={setLobbyPlayerPool}
                  onOpenLobbyOptionsDialog={handleOpenLobbyOptionsDialog}
                />
              </Box>
            )
          },
          // {
          //   title: "Lobby",
          //   icon: <Groups />,
          //   content: (
          //     <LobbyPlayerTabPanelComponent 
          //       lobbyState={lobbyState}
          //       currentPlayerProfile={hostPlayerProfile}
          //     />
          //   )
          // },
          {
            title: "P2P Connection",
            icon: <Wifi />,
            content: (
              <P2pConnectionComponent
                connectionStatus={connectionStatus}
                peerProfiles={peerProfiles}
                playerProfiles={playerProfiles}
                onResendLobbyData={doSendLobbyData}
              />
            )
          }
        ]}
        tabColor="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        ariaLabel="hosted lobby tabs"
      />
      
      <LobbyHostOptionsDialog
        open={isLobbyOptionsDialogOpen}
        onClose={handleCloseLobbyOptionsDialog}
        onSave={handleSaveLobbyOptions}
        initialLobbyOptions={lobbyOptions}
      />
    </Container>
  )
}
