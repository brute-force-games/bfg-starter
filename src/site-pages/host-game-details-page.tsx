import { useState } from "react"
import { GameActionHistoryComponent } from "@bfg-engine/ui/components/game-action-history-component"
import { BfgGameScreenFrame } from "@bfg-engine/ui/components/bfg-game-screen-frame"
import { Box, Paper, Stack, Tabs, Tab, Settings, TabPanel, Typography } from "@bfg-engine"
import { GameTabId, getGameTabItems } from "~/routes/games/-components"
import { PrettyJsonObject } from "@bfg-engine/ui/bfg-ui/components/PrettyJsonObject/PrettyJsonObject"
import { Gamepad, History } from "@bfg-engine/ui/bfg-ui/icons"
import { IBfgGameTableForHost } from "@bfg-engine/hooks/p2p/game/p2p-game-types"
import { convertHostEventToBoardEvent } from "../../modules/bfg-engine/src/models/game-table/game-table-event-converter"

// interface IHostedGameDetailsComponentProps {
//   gameRoom: gameRoom
//   gameActions: DbgameRoomAction[]
// }

export const HostedGameDetailsPage = (props: IBfgGameTableForHost) => {
  
  // const { hostGameDetails, p2pDetails, accessRole } = props;
  const { hostGameDetails, publicGameDetails, p2pDetails, accessRole, gameMetadata } = props;
  
  if (!hostGameDetails || !publicGameDetails || !p2pDetails || !gameMetadata) {
    return <div>Game details not available</div>;
  }
  
  // const { gameMetadata, gameRoom, watcherGameEvents } = hostGameDetails;
  // const { gameActions } = hostGameDetails;
  const { gameRoom, watcherGameEvents } = publicGameDetails;
  const { allPlayerProfiles } = p2pDetails;
  const [activeTab, setActiveTab] = useState(0);

  // const gameRegistry = useGameRegistry();
  // const gameMetadata = gameRegistry.getGameMetadata(gameRoom.gameTitle);

  // const latestGameSpecificStateStr = gameActions.length > 0 ? 
  //   gameActions[gameActions.length - 1].nextGameStateStr :
  //   null;
  // const latestGameSpecificState = latestGameSpecificStateStr ?
  //   gameMetadata.encoders.hostGameStateEncoder.decode(latestGameSpecificStateStr) :
  //   null;

  // const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
  //   setActiveTab(newValue);
  // };
  const activeTabId: GameTabId = '/games/host/$tableId/game-details';



  const gameTabItems = getGameTabItems(accessRole);
  const tabsConfig = {
    tabItems: gameTabItems,
    activeTabId: activeTabId,
    onTabClicked: () => { console.log('onTabClicked not implemented'); }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const latestHostGameEvent = hostGameDetails.latestHostGameEvent;
  const latestHostGameState = latestHostGameEvent.nextGameHostState;

  // Convert host events to board events format for GameActionHistoryComponent
  const gameActions = hostGameDetails.hostGameEvents.map(event => 
    convertHostEventToBoardEvent(event, gameMetadata)
  );


  return (
    <BfgGameScreenFrame
      tabsConfig={tabsConfig}
      gameMetadata={gameMetadata}
      gameRoom={gameRoom}
      allPlayerProfiles={allPlayerProfiles}
      gameState={latestHostGameState}
      boardEvents={watcherGameEvents}
    >
      <Box>
        <Paper elevation={2}>
          <Stack direction="column" spacing={0}>
            <Box style={{ display: 'flex', justifyContent: 'center' }}>
              <Tabs value={activeTab} onChange={handleTabChange}>
                <Tab label="Game Details" icon={<Settings />} />
                <Tab label="Action History" icon={<History />} />
                <Tab label="Game State JSON" icon={<Gamepad />} />
              </Tabs>
            </Box>

          <TabPanel value={activeTab} index={0}>
            <Stack direction="column" spacing={4}>
              <Stack direction="column" spacing={2}>
                <Box>
                  <Typography variant="body1" component="span" style={{ fontWeight: 500 }}>
                    Game Title:
                  </Typography>
                  <Typography variant="body1" component="span" style={{ marginLeft: '8px' }}>
                    {gameRoom?.gameTitle}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body1" component="span" style={{ fontWeight: 500 }}>
                    Game ID:
                  </Typography>
                  <Typography variant="body2" component="span" style={{ marginLeft: '8px', fontFamily: 'monospace' }}>
                    {gameRoom?.id}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body1" component="span" style={{ fontWeight: 500 }}>
                    Status:
                  </Typography>
                  <Typography variant="body1" component="span" style={{ marginLeft: '8px' }}>
                    {gameRoom?.latestRoomStatusDescription}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body1" component="span" style={{ fontWeight: 500 }}>
                    Phase:
                  </Typography>
                  <Typography variant="body1" component="span" style={{ marginLeft: '8px' }}>
                    {gameRoom?.latestRoomPhase}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body1" component="span" style={{ fontWeight: 500 }}>
                    Created:
                  </Typography>
                  <Typography variant="body1" component="span" style={{ marginLeft: '8px' }}>
                    {gameRoom ? new Date(gameRoom.createdAt).toLocaleString() : ''}
                  </Typography>
                </Box>
              </Stack>
              
              <Box style={{ marginTop: '24px' }}>
                <Typography variant="h6" gutterBottom>
                  Raw Game Data
                </Typography>
                <PrettyJsonObject>
                  {gameRoom}
                </PrettyJsonObject>
              </Box>
            </Stack>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <Box>
              <GameActionHistoryComponent
                gameMetadata={gameMetadata}
                gameActions={gameActions}
              />
            </Box>
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <Box>
              <PrettyJsonObject>
                {latestHostGameState}
              </PrettyJsonObject>
            </Box>
          </TabPanel>
          </Stack>
        </Paper>
      </Box>
    </BfgGameScreenFrame>
  )
}
