import { Outlet, createRootRoute, Scripts, } from '@tanstack/react-router'
import { ProfileGuard } from '@bfg-engine/ui/components/profile-guard'
import { BruteForceGamesAppBar } from '@bfg-engine/ui/components/bfg-app-bar/app-bar'
import { GameHostingProvider } from '@bfg-engine/hooks/games-registry/game-hosting'
import { BfgStarterGameHosting } from '../bfg-starter-hosting'


export const RootComponent = () => {
  return (
    <>
      <GameHostingProvider gameHosting={BfgStarterGameHosting}>
        <BruteForceGamesAppBar />
        <ProfileGuard>
          <Outlet />
        </ProfileGuard>
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
})
