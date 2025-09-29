import { ReactNode, useState } from "react"
import { 
  Box, 
  Tabs, 
  Tab, 
  Card, 
  CardContent, 
  Typography,
  Paper
} from "@mui/material"
import { 
  Groups, 
  Wifi 
} from "@mui/icons-material"

interface TabPanelProps {
  children?: ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`lobby-tabpanel-${index}`}
      aria-labelledby={`lobby-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  )
}

interface LobbyTabsComponentProps {
  lobbyInfoContent: ReactNode
  p2pConnectionContent: ReactNode
  lobbyType: 'hosted' | 'player'
}

export const LobbyTabsComponent = ({
  lobbyInfoContent,
  p2pConnectionContent,
  lobbyType
}: LobbyTabsComponentProps) => {
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const getTabColor = () => {
    return lobbyType === 'hosted' 
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)'
  }

  return (
    <Card elevation={2}>
      <Paper 
        elevation={1} 
        sx={{ 
          background: getTabColor(),
          color: 'white',
          borderRadius: '4px 4px 0 0'
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="lobby tabs"
          sx={{
            '& .MuiTab-root': {
              color: 'rgba(255, 255, 255, 0.7)',
              fontWeight: 'bold',
              textTransform: 'none',
              fontSize: '1rem',
              minHeight: 48,
            },
            '& .Mui-selected': {
              color: 'white !important',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'white',
              height: 3,
            },
          }}
        >
          <Tab
            icon={<Groups />}
            label="Lobby & Game Info"
            id="lobby-tab-0"
            aria-controls="lobby-tabpanel-0"
          />
          <Tab
            icon={<Wifi />}
            label="P2P Connection"
            id="lobby-tab-1"
            aria-controls="lobby-tabpanel-1"
          />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        {lobbyInfoContent}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {p2pConnectionContent}
      </TabPanel>
    </Card>
  )
}
