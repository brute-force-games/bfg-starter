import { TrysteroConfig } from "@bfg-engine";


export const BfgStarterTrysteroConfig: TrysteroConfig = {
  // appId: 'bfg-starter-trystero-test2',
  appId: 'Kartoffel5583',
  // Use alternative Nostr relays that don't require PoW
  tracker: {
    announce: [
      'wss://relay.snort.social', 
      'wss://nosr.org',
      'wss://relay.nostr.band',
      'wss://relay.damus.io',
    ]
  }
}

export const BfgStarterSupabaseTrysteroConfig: any = {
  appId: 'https://daqryoumnoqtafafupwz.supabase.co',
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhcXJ5b3Vtbm9xdGFmYWZ1cHd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzODEzMDAsImV4cCI6MjA2Njk1NzMwMH0._gAsid1K4V64iO1EIIdhucrwjb7VIKg8jX6gggKbYhA',
  // tracker: {
  //   announce: [
  //     'wss://relay.damus.io',
  //     'wss://relay.snort.social', 
  //     'wss://nosr.org',
  //     'wss://relay.nostr.band'
  //   ]
  // }
}