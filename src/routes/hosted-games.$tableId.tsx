import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { HostedP2pGameComponent } from '~/components/p2p/hosted-p2p-game-component'
import { useGameActions } from '~/hooks/stores/use-game-actions-store'
import { useHostedGame } from '~/hooks/stores/use-hosted-games-store'
import { createJoinGameUrl } from '~/router-links'
import { GameTableId } from '~/types/core/branded-values/bfg-branded-ids'


export const Route = createFileRoute('/hosted-games/$tableId')({
  component: HostedGamePage,
})


function HostedGamePage() {
  const { tableId } = Route.useParams();
  const gameTableId = tableId as GameTableId;

  const hostedGame = useHostedGame(gameTableId);
  const gameActions = useGameActions(gameTableId);
  // const [copySuccess, setCopySuccess] = useState(false);

  // const joinLink = createJoinGameUrl(gameTableId);
  // const fullJoinUrl = `${window.location.origin}${joinLink}`;

  // const copyJoinUrlToClipboard = async () => {
  //   try {
  //     await navigator.clipboard.writeText(fullJoinUrl);
  //     setCopySuccess(true);
  //     setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
  //   } catch (err) {
  //     console.error('Failed to copy: ', err);
  //   }
  // };


  return (
    <div className="p-6">
      {/* <h1 className="text-3xl font-bold mb-6">Hosted Game</h1> */}

      <HostedP2pGameComponent
        gameTableId={gameTableId}
      />

    </div>
  )
}
