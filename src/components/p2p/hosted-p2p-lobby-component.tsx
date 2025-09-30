import { useCallback, useEffect, useState } from "react"
import { 
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
import { LobbyHostOptionsDialog } from "~/dialogs/lobby-host-options-dialog"
import { LobbyPlayerStateComponent } from "../lobby/lobby-player-state-component"
import { BfgSupportedGameTitles } from "~/types/bfg-game-engines/supported-games"
import { PrivatePlayerProfile } from "~/models/private-player-profile"


interface IHostedP2pLobbyComponentProps {
  lobbyId: GameLobbyId
  hostPlayerProfile: PrivatePlayerProfile

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
  const { room, getPlayerMove, playerProfiles, sendPlayerMove } = p2pLobby;

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

  const applyPlayerMove = async (move: PlayerP2pLobbyMove, playerId: PlayerProfileId) => {
    console.log('applyPlayerMove', move, playerId);
    console.log('Received player move from peer:', playerId, move);

    // const playerId = peerProfiles.get(peer)?.id;
    // if (!playerId) {
    //   console.error('Player ID not found for peer:', peer);
    //   return;
    // }

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
  }


  getPlayerMove(async (move: PlayerP2pLobbyMove, peer: string) => {
    const playerId = peerProfiles.get(peer)?.id;
    if (!playerId) {
      console.error('Player ID not found for peer:', peer);
      return;
    }
    await applyPlayerMove(move, playerId);
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

  const onSelectGameChoice = async (gameChoice: BfgSupportedGameTitles) => {
    await applyPlayerMove({ move: 'set-game-choice', gameChoice: gameChoice }, hostPlayerProfile.id);
    // sendPlayerMove({ move: 'set-game-choice', gameChoice: gameChoice });
  }
  const onTakeSeat = async () => {
    await applyPlayerMove({ move: 'take-seat' }, hostPlayerProfile.id);
    // sendPlayerMove({ move: 'take-seat' });
  }
  const onLeaveSeat = async () => {
    await applyPlayerMove({ move: 'leave-seat' }, hostPlayerProfile.id);
    // sendPlayerMove({ move: 'leave-seat' });
  }


  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <TabsContainerPanel
        tabs={[
          {
            title: "Lobby Admin",
            icon: <Groups />,
            content: (
              <LobbyHostStateComponent
                playerProfiles={playerProfiles}
                lobbyState={lobbyState}
                updateLobbyState={updateLobbyState}
                setLobbyPlayerPool={setLobbyPlayerPool}
                onOpenLobbyOptionsDialog={handleOpenLobbyOptionsDialog}
              />
            )
          },
          // {
          //   title: "Player Lobby",
          //   icon: <Groups />,
          //   content: (
          //     <LobbyPlayerTabPanelComponent 
          //       lobbyState={lobbyState}
          //       currentPlayerProfile={hostPlayerProfile}
          //     />
          //   )
          // },
          {
            title: "Player Lobby",
            icon: <Groups />,
            content: (
              <LobbyPlayerStateComponent
                playerProfiles={playerProfiles}
                lobbyState={lobbyState}
                currentPlayerProfile={hostPlayerProfile}
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
