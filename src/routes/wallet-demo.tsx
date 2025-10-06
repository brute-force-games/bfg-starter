import { createFileRoute } from '@tanstack/react-router'
import { WalletAuthDemoComponent } from '~/components/wallet-auth-demo-component'

export const Route = createFileRoute('/wallet-demo')({
  component: WalletDemoPage,
})

function WalletDemoPage() {
  return <WalletAuthDemoComponent />
}
