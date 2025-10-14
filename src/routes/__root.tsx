import { Outlet, createRootRoute, Scripts, } from '@tanstack/react-router'
import { ProfileGuard } from '@bfg-engine/ui/components/profile-guard'
import { BruteForceGamesAppBar } from '@bfg-engine/ui/components/bfg-app-bar/app-bar'


export const RootComponent = () => {
  return (
    <>
      <BruteForceGamesAppBar />
      <ProfileGuard>
        <Outlet />
      </ProfileGuard>
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
})
