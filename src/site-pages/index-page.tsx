import { Link } from '@tanstack/react-router'
import { useRiskyMyDefaultPlayerProfile } from '@bfg-engine/hooks/stores/use-my-player-profiles-store'
import { NoUserIndexPage } from './no-user-index-page'
import { Container, Typography, Button, Stack } from '@bfg-engine'
import { NoActivityAppBar } from '@bfg-engine/ui/components/app-bars/no-activity-app-bar'


export const IndexPage = () => {
  const myPlayerProfile = useRiskyMyDefaultPlayerProfile();

  if (!myPlayerProfile) {
    return <NoUserIndexPage />
  }

  return (
    <>
      <NoActivityAppBar />
      <Container style={{ padding: '24px' }}>
        <Stack spacing={3}>
          <Typography variant="h3">Welcome to Brute Force Games</Typography>
          <Typography variant="body1" color="secondary">
            Start a lobby to play with your friends!
          </Typography>
          <Link to="/new-lobby" style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="primary">
              Create Lobby
            </Button>
          </Link>
        </Stack>
      </Container>
    </>
  )
}
