import type { ReactNode } from 'react'
import {
  Outlet,
  createRootRoute,
  Scripts,
} from '@tanstack/react-router'
import { ProfileGuard } from '~/components/profile-guard'
import { BruteForceGamesAppBar } from '~/components/bfg-app-bar/app-bar'
// import { BfgWhoAmIProvider } from '~/state/who-am-i/BfgWhoAmIProvider'

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

function RootComponent() {
  return (
    <RootDocument>
      <BruteForceGamesAppBar />
      <ProfileGuard>
        <Outlet />
      </ProfileGuard>
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      {children}
      <Scripts />
    </>
  )
}