import { z } from 'zod';
import { createFileRoute } from '@tanstack/react-router'
import { BfgGameLobbyId } from '@bfg-engine/models/types/bfg-branded-ids';
import { LobbyPlayerStateComponent } from '@bfg-engine';
import { BfgHostedLobbyAppBar, HostedLobbyTabId } from './-components';
import { useP2pHostedLobbyContext  } from '@bfg-engine/hooks/p2p/hosted-p2p-lobby-context';


const paramsSchema = z.object({
  lobbyId: BfgGameLobbyId.idSchema,
})


const HostedLobbyPlayerRoute = () => {

  const lobby = useP2pHostedLobbyContext();
  const {
    allPlayerProfiles,
    myHostPlayerProfile,
    lobbyState,
    lobbyOptions,
    onSelectGameChoice,
    onTakeSeat,
    onLeaveSeat,
  } = lobby;

  const activeTabId: HostedLobbyTabId = '/hosted-lobby/$lobbyId/player';

  return (
    <>
      <BfgHostedLobbyAppBar activeTabId={activeTabId} />
      <LobbyPlayerStateComponent
        playerProfiles={allPlayerProfiles}
        currentPlayerProfile={myHostPlayerProfile}
        lobbyState={lobbyState}
        lobbyOptions={lobbyOptions}
        onSelectGameChoice={onSelectGameChoice}
        onTakeSeat={onTakeSeat}
        onLeaveSeat={onLeaveSeat}
      />
    </>
  )
}


export const Route = createFileRoute('/hosted-lobby/$lobbyId/player')({
  params: {
    parse: (params) => paramsSchema.parse(params),
    stringify: (params) => ({ lobbyId: params.lobbyId }),
  },
  component: HostedLobbyPlayerRoute,
})

