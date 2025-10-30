import { createFileRoute } from '@tanstack/react-router'
import { LobbyPlayerStateComponent } from '@bfg-engine';
import { useP2pLobbyPlayerContext } from '@bfg-engine/hooks/p2p/lobby/p2p-lobby-player-context';
import { BfgSupportedGameTitle } from '@bfg-engine/models/game-box-definition';
import { BfgJoinLobbyAppBar, JoinLobbyTabId } from './-components';
import { useEffect, useRef } from 'react';


// const paramsSchema = z.object({
//   lobbyId: BfgGameLobbyId.idSchema,
// })


const JoinLobbyIndexRoute = () => {

  const lobby = useP2pLobbyPlayerContext();
  const { allPlayerProfiles, myPlayerProfile, txPlayerMove } = lobby;
  const autoSeatAttempted = useRef(false);

  const activeTabId: JoinLobbyTabId = '/join-lobby/$lobbyId';

  const lobbyState = lobby.lobbyDetails?.lobbyState ?? null;
  const lobbyOptions = lobby.lobbyDetails?.lobbyOptions ?? null;

  // Get autoJoin parameter from search params
  const searchParams = Route.useSearch();
  const autoJoin = searchParams?.autoJoin ?? false;

  // Auto-seat logic: automatically take a seat if autoJoin is true and there's room
  useEffect(() => {
    if (!autoJoin || !lobbyState || autoSeatAttempted.current) {
      return;
    }

    const isPlayerAlreadySeated = lobbyState.playerPool.includes(myPlayerProfile.id);
    const currentPlayerCount = lobbyState.playerPool.length;
    const maxPlayers = lobbyState.maxNumPlayers;

    // Only auto-seat if:
    // 1. Player is not already seated
    // 2. There's room in the lobby (current players < max players)
    // 3. We haven't already attempted to auto-seat
    if (!isPlayerAlreadySeated && currentPlayerCount < maxPlayers) {
      console.log('Auto-seating player due to autoJoin parameter');
      txPlayerMove({ move: 'take-seat' });
      autoSeatAttempted.current = true;
    }
  }, [autoJoin, lobbyState, myPlayerProfile.id, txPlayerMove]);

  const onSelectGameChoice = (gameChoice: BfgSupportedGameTitle) => {
    txPlayerMove({ move: 'set-game-choice', gameChoice: gameChoice });
  }

  const onTakeSeat = () => {
    txPlayerMove({ move: 'take-seat' });
  }
  
  const onLeaveSeat = () => {
    txPlayerMove({ move: 'leave-seat' });
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
