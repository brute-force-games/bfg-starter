import { Link } from '@tanstack/react-router'
// import { NoActivityAppBar }  from '../../modules/bfg-engine/src/ui/components/app-bars/no-activity-app-bar'
import { Container, Typography, Button, Stack } from '@bfg-engine'


export const NoUserIndexPage = () => {
  return (
    <>
      {/* <NoActivityAppBar /> */}
      <Container style={{ padding: '24px' }}>
        <Stack spacing={3}>
          <Typography variant="h3">Welcome to Brute Force Games</Typography>
          <Typography variant="body1" color="secondary">
            Create a player profile to start playing!
          </Typography>
          <Link to="/my-player-profiles" style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="primary">
              Create Profile
            </Button>
          </Link>
        </Stack>
      </Container>
    </>
  )
}
