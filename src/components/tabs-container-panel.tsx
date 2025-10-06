import { ReactNode, useState } from "react"
import { 
  Box, 
  Tabs, 
  Tab, 
  Card, 
  Paper
} from "@mui/material"

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
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
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

export interface TabInfo {
  title: string
  icon: React.ReactElement
  content: ReactNode
}

interface TabsContainerPanelProps {
  tabs: TabInfo[]
  tabColor?: string
  ariaLabel?: string
}

export const TabsContainerPanel = ({
  tabs,
  tabColor = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  ariaLabel = "tabs"
}: TabsContainerPanelProps) => {
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  return (
    <Card elevation={2}>
      <Paper 
        elevation={1} 
        sx={{ 
          background: tabColor,
          color: 'white',
          borderRadius: '4px 4px 0 0'
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label={ariaLabel}
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
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              icon={tab.icon}
              label={tab.title}
              id={`tab-${index}`}
              aria-controls={`tabpanel-${index}`}
            />
          ))}
        </Tabs>
      </Paper>

      {tabs.map((tab, index) => (
        <TabPanel key={index} value={tabValue} index={index}>
          {tab.content}
        </TabPanel>
      ))}
    </Card>
  )
}
