import { useState } from 'react'
import { PlayerP2pLobbyComponent } from '@bfg-engine/ui/components/player-p2p-lobby-component'
import { useRiskyMyDefaultPlayerProfile } from '@bfg-engine/hooks/stores/use-my-player-profiles-store'
import { GameLobbyId } from '@bfg-engine/models/types/bfg-branded-ids'
import { Typography } from '@bfg-engine'
import { JoinLobbyTabId } from '@bfg-engine/ui/components/bfg-tabs'
import { AppBarTabItem } from '@bfg-engine/ui/components/bfg-app-bar/tab-item-hook'
import { BruteForceGamesAppBar } from '@bfg-engine/ui/components/bfg-app-bar/app-bar'


interface JoinLobbyPageProps {
  lobbyId: GameLobbyId;
}

export const JoinLobbyPage = ({ lobbyId }: JoinLobbyPageProps) => {

  const JoinLobbyTabItems: readonly AppBarTabItem<JoinLobbyTabId>[] = [
    { id: 'player-lobby', label: 'Player Lobby' },
    { id: 'player-p2p-lobby-details', label: 'P2P' },
  ];
  
  const [activeTabId, setActiveTabId] = useState<JoinLobbyTabId>('player-lobby');
  
  const myPlayerProfile = useRiskyMyDefaultPlayerProfile();
 
  if (!myPlayerProfile) {
    return <Typography variant="body1">Loading player profile...</Typography>
  }

  return (
    <>
      <BruteForceGamesAppBar 
        tabsConfig={{
          tabItems: JoinLobbyTabItems,
          activeTabId: activeTabId,
          onTabChange: setActiveTabId
        }}
      />
      <PlayerP2pLobbyComponent
        lobbyId={lobbyId}
        playerProfile={myPlayerProfile}
        activeTabId={activeTabId}
      />
    </>
  )
}
