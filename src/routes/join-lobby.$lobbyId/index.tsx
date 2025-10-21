import { createFileRoute } from '@tanstack/react-router'
import { LobbyPlayerStateComponent } from '@bfg-engine';
import { useP2pLobbyPlayerContext } from '@bfg-engine/hooks/p2p/p2p-lobby-player-context';
import { BfgSupportedGameTitle } from '@bfg-engine/models/game-box-definition';
import { BfgJoinLobbyAppBar, JoinLobbyTabId } from './-components';


// const paramsSchema = z.object({
//   lobbyId: BfgGameLobbyId.idSchema,
// })


const JoinLobbyIndexRoute = () => {

  const lobby = useP2pLobbyPlayerContext();
  const { allPlayerProfiles, myPlayerProfile, sendPlayerMove } = lobby;

  const activeTabId: JoinLobbyTabId = '/join-lobby/$lobbyId';

  const lobbyState = lobby.lobbyDetails?.lobbyState ?? null;
  const lobbyOptions = lobby.lobbyDetails?.lobbyOptions ?? null;

  const onSelectGameChoice = (gameChoice: BfgSupportedGameTitle) => {
    sendPlayerMove({ move: 'set-game-choice', gameChoice: gameChoice });
  }

  const onTakeSeat = () => {
    sendPlayerMove({ move: 'take-seat' });
  }
  
  const onLeaveSeat = () => {
    sendPlayerMove({ move: 'leave-seat' });
  }

  return (
    <>
      <BfgJoinLobbyAppBar activeTabId={activeTabId} />
      <LobbyPlayerStateComponent
        playerProfiles={allPlayerProfiles}
        lobbyState={lobbyState}
        currentPlayerProfile={myPlayerProfile}
        lobbyOptions={lobbyOptions}
        onSelectGameChoice={onSelectGameChoice}
        onTakeSeat={onTakeSeat}
        onLeaveSeat={onLeaveSeat}
      />
    </>
  )
}


export const Route = createFileRoute('/join-lobby/$lobbyId/')({
  // params: {
  //   parse: (params) => paramsSchema.parse(params),
  //   stringify: (params) => ({ lobbyId: params.lobbyId }),
  // },
  component: JoinLobbyIndexRoute,
})
