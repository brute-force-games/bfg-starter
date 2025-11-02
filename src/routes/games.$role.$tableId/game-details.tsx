import { z } from 'zod';
import { createFileRoute } from '@tanstack/react-router'
import { GameTabId, getGameTabItems } from './-components'
import { BfgGameTableId } from '@bfg-engine/models/types/bfg-branded-ids';
import { useP2pGameContext } from '@bfg-engine/hooks/p2p/game/p2p-game-context';
import { GameTableAccessRoleSchema } from '@bfg-engine/models/game-roles';
import { HostedGameDetailsComponent } from '@bfg-engine/ui/components/host-game-details-component';
import { PlayerGameDetailsComponent } from '@bfg-engine/ui/components/player-game-details-component';
import { ObserverP2pGameDetailsComponent, useGameRegistry } from '@bfg-engine';
import { BfgGameScreenFrame } from '@bfg-engine/ui/components/bfg-game-screen-frame';


const paramsSchema = z.object({
  role: GameTableAccessRoleSchema,
  tableId: BfgGameTableId.idSchema,
})

const GameDetailsRoute = () => {
  const { role, tableId } = Route.useParams()
  
  const p2pGame = useP2pGameContext();
  const { gameTable, gameActions, myGameTableAccess, hasRequestedTableAccess, allPlayerProfiles } = p2pGame;

  const gameRegistry = useGameRegistry();

  const activeTabId: GameTabId = '/games/$role/$tableId/game-details';

  if (!gameTable) {
    return <div>Game table not found: {tableId}</div>;
  }

  if (!hasRequestedTableAccess) {
    return <div>You are not allowed to access this game table as a {role}</div>;
  }
  const gameMetadata = gameRegistry.getGameMetadata(gameTable.gameTitle);

  const gameTabItems = getGameTabItems(myGameTableAccess);
  const tabsConfig = {
    tabItems: gameTabItems,
    activeTabId: activeTabId,
    onTabChange: () => { console.log('onTabChange not implemented'); }
  };

  const getGameScreen = () => {
    if (myGameTableAccess === 'host') {
      return (
        <HostedGameDetailsComponent
          gameTable={gameTable}
          gameActions={gameActions}
        />
      )
    }
    if (myGameTableAccess === 'player') {
      return (
        <PlayerGameDetailsComponent />
      )
    }
    if (myGameTableAccess === 'observer') {
      return (
        <ObserverP2pGameDetailsComponent
          gameTableId={tableId}
        />
      )
    }

    throw new Error(`Invalid game table access role: ${myGameTableAccess}`);
  }

  const gameScreen = getGameScreen();

  const latestGameAction = gameActions[gameActions.length - 1];
  const latestGameSpecificState = latestGameAction ?
    gameMetadata.gameSpecificStateEncoder.decode(latestGameAction.nextGameStateStr) :
    null;

  return (
    <BfgGameScreenFrame
      tabsConfig={tabsConfig}
      gameMetadata={gameMetadata}
      gameTable={gameTable}
      allPlayerProfiles={allPlayerProfiles}
      gameState={latestGameSpecificState}
      gameActions={gameActions}
    >
      {gameScreen}
    </BfgGameScreenFrame>
  )
}


export const Route = createFileRoute('/games/$role/$tableId/game-details')({
  component: GameDetailsRoute,
  params: {
    parse: (params) => paramsSchema.parse(params),
    stringify: (params) => ({ role: params.role, tableId: params.tableId }),
  },
})
