import { TrysteroConfig } from "@bfg-engine";
import { env } from "./env/env-schema";

// Parse Nostr relay URLs from comma-separated string
const getNostrRelays = (): string[] => {
  return env.VITE_NOSTR_RELAYS.split(',').map((relay: string) => relay.trim()).filter(Boolean);
};

export const BfgStarterTrysteroConfig: TrysteroConfig = {
  appId: env.VITE_TRYSTERO_APP_ID,
  // Use alternative Nostr relays that don't require PoW
  tracker: {
    announce: getNostrRelays()
  }
}

export const BfgStarterSupabaseTrysteroConfig: any = {
  appId: env.VITE_SUPABASE_URL,
  supabaseKey: env.VITE_SUPABASE_ANON_KEY,
  // tracker: {
  //   announce: [
  //     'wss://relay.damus.io',
  //     'wss://relay.snort.social', 
  //     'wss://nosr.org',
  //     'wss://relay.nostr.band'
  //   ]
  // }
}