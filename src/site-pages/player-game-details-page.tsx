import { useState } from "react"
import { GameActionHistoryComponent } from "@bfg-engine/ui/components/game-action-history-component"
import { Paper, Stack, Typography, Box, Container, Settings, Tab, TabPanel, Tabs } from "@bfg-engine"
import { IBfgGameRoomForPlayer } from "@bfg-engine/hooks/p2p/game/p2p-game-types"
import { PrettyJsonObject } from "@bfg-engine/ui/bfg-ui/components/PrettyJsonObject/PrettyJsonObject"
import { Gamepad, History } from "@bfg-engine/ui/bfg-ui/icons"
import { BfgGameScreenFrame } from "@bfg-engine/ui/components/bfg-game-screen-frame"
import { GameTabId, getGameTabItems } from "~/routes/games.$role.$tableId/-components"

// interface IPlayerGameDetailsComponentProps {
//   gameTable: GameTable
//   gameActions: DbGameTableAction[]
// }

export const PlayerGameDetailsPage = (props: IBfgGameRoomForPlayer) => {

  const { playerGameDetails } = props;
  const { gameMetadata, gameTable, gameActions, allPlayerProfiles } = playerGameDetails;
  const [activeTab, setActiveTab] = useState(0);

  if (!gameMetadata || !gameTable || !gameActions) {
    return (
      <Container style={{ padding: '24px' }}>
        <Stack spacing={3}>
          <Typography variant="h3">Loading Player Game Details...</Typography>
          { !gameMetadata && <Typography variant="body1" color="secondary">Waiting for game metadata...</Typography> }
          { !gameTable && <Typography variant="body1" color="secondary">Waiting for game table...</Typography> }
          { !gameActions && <Typography variant="body1" color="secondary">Waiting for game actions...</Typography> }
        </Stack>
      </Container>
    );
  }

  // const gameRegistry = useGameRegistry();
  // const gameMetadata = gameRegistry.getGameMetadata(gameTable.gameTitle);

  const latestGameSpecificStateStr = gameActions.length > 0 ? 
    gameActions[gameActions.length - 1].nextGameStateStr :
    null;
  const latestGameSpecificState = latestGameSpecificStateStr ?
    gameMetadata.encoders.publicGameStateEncoder.decode(latestGameSpecificStateStr) :
    null;

  const activeTabId: GameTabId = '/games/$role/$tableId/game-details';
  const gameTabItems = getGameTabItems('play');
  const tabsConfig = {
    tabItems: gameTabItems,
    activeTabId: activeTabId,
    onTabClicked: () => { console.log('onTabClicked not implemented'); }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };


  return (
    <BfgGameScreenFrame
      tabsConfig={tabsConfig}
      gameMetadata={gameMetadata}
      gameTable={gameTable}
      allPlayerProfiles={allPlayerProfiles}
      gameState={latestGameSpecificState}
      gameActions={gameActions}
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
                    {gameTable?.gameTitle}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body1" component="span" style={{ fontWeight: 500 }}>
                    Game ID:
                  </Typography>
                  <Typography variant="body2" component="span" style={{ marginLeft: '8px', fontFamily: 'monospace' }}>
                    {gameTable?.id}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body1" component="span" style={{ fontWeight: 500 }}>
                    Status:
                  </Typography>
                  <Typography variant="body1" component="span" style={{ marginLeft: '8px' }}>
                    {gameTable?.currentStatusDescription}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body1" component="span" style={{ fontWeight: 500 }}>
                    Phase:
                  </Typography>
                  <Typography variant="body1" component="span" style={{ marginLeft: '8px' }}>
                    {gameTable?.tablePhase}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body1" component="span" style={{ fontWeight: 500 }}>
                    Created:
                  </Typography>
                  <Typography variant="body1" component="span" style={{ marginLeft: '8px' }}>
                    {gameTable ? new Date(gameTable.createdAt).toLocaleString() : ''}
                  </Typography>
                </Box>
              </Stack>
              
              <Box style={{ marginTop: '24px' }}>
                <Typography variant="h6" gutterBottom>
                  Raw Game Data
                </Typography>
                <PrettyJsonObject>
                  {gameTable}
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
                {latestGameSpecificState}
              </PrettyJsonObject>
            </Box>
          </TabPanel>
          </Stack>
        </Paper>
      </Box>
    </BfgGameScreenFrame>
  )
}