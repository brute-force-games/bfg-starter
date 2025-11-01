import { Outlet, createRootRoute, Scripts, useRouter } from '@tanstack/react-router'
import { GameHostingProvider } from '@bfg-engine/hooks/games-registry/game-hosting'
import { BfgStarterGameHosting } from '../bfg-starter-hosting'
import { Container, Paper, Typography, Button, Stack, Box } from '@bfg-engine'
import { Inspector } from 'tinybase/ui-react-inspector'
import { Provider } from 'tinybase/ui-react'
import { playerProfileStore } from '@bfg-engine/tb-store/player-profile-store'
import { hostedGamesStore } from '@bfg-engine/tb-store/hosted-games-store'
import { hostedLobbiesStore } from '@bfg-engine/tb-store/hosted-lobbies-store'
import { appSettingsStore } from '@bfg-engine/tb-store/app-settings-store'

export const RootErrorComponent = ({ error }: { error: Error }) => {
  const router = useRouter()
  
  return (
    <Container maxWidth="md" style={{ padding: '32px' }}>
      <Paper elevation={2} style={{ 
        backgroundColor: '#fee',
        border: '2px solid #c00',
        padding: '24px'
      }}>
        <Stack spacing={2}>
          <Typography variant="h4" color="error" style={{ marginTop: 0 }}>
            Something went wrong
          </Typography>
          
          <Paper elevation={1} style={{ padding: '16px', backgroundColor: '#fff' }}>
            <Typography variant="body1" style={{ fontWeight: 'bold', marginBottom: '8px' }}>
              Error:
            </Typography>
            <Box component="pre" style={{ 
              marginTop: '8px',
              overflow: 'auto',
              fontSize: '0.9rem',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {error.message}
            </Box>
            {error.stack && (
              <Box component="details" style={{ marginTop: '16px' }}>
                <Box component="summary" style={{ 
                  cursor: 'pointer', 
                  color: '#666'
                }}>
                  Stack trace
                </Box>
                <Box component="pre" style={{ 
                  marginTop: '8px',
                  fontSize: '0.75rem',
                  color: '#666',
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {error.stack}
                </Box>
              </Box>
            )}
          </Paper>
          
          <Stack direction="row" spacing={2}>
            <Button
              onClick={() => router.navigate({ to: '/' })}
              variant="contained"
              color="primary"
            >
              Go Home
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="contained"
              color="secondary"
            >
              Reload Page
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  )
}

export const RootComponent = () => {
  return (
    <>
      <GameHostingProvider
        gameHosting={BfgStarterGameHosting}
      >
        <Outlet />
        <Provider store={playerProfileStore} storesById={{ 
          playerProfiles: playerProfileStore,
          hostedGames: hostedGamesStore,
          hostedLobbies: hostedLobbiesStore,
          appSettings: appSettingsStore,
        }}>
          <Inspector />
        </Provider>
      </GameHostingProvider>
      <Scripts />
    </>
  )
}


export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Brute Force Games',
      },
    ],
  }),
  component: RootComponent,
  errorComponent: RootErrorComponent,
})
