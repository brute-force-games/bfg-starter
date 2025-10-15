import { TrysteroConfig } from "@bfg-engine";


export const BfgStarterTrysteroConfig: TrysteroConfig = {
  appId: 'bfg-starter-trystero-test1',
  // Use alternative Nostr relays that don't require PoW
  tracker: {
    announce: [
      'wss://relay.damus.io',
      'wss://relay.snort.social', 
      'wss://nosr.org',
      'wss://relay.nostr.band'
    ]
  }
}