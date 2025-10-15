# bfg-starter

I created this repo to better understand local-first dev and cloud syncing for board games (they're just fancy state machines, really) using a React frontend. I'm trying to shake out the common layers of abstraction (e.g. user IDs, emails, invitations/notifications, how data is structured for sharing) that are present so someone can write a board game engine and UI like they would a react component - a board game state, and actions that mutate that state, but with players and secret information accounted for. 


I'm really trying to figure out how to get multiplayer security for the best value. Engines I've been messing with along with some notes for my future reference...


### [Dexie / Dexie Cloud](https://dexie.org/cloud/)
I like the concept of the Dexie Cloud plan - reasonable price with a decent security model at the web application layer. It's the most multiplayer plug and play I've come across that doesn't require any server maintenance and Big Tech.

#### Configuring for your own Dexie Cloud instance
Update the [Dexie Cloud Config](./src/data/sync-engines/dexie-cloud/dexie-config.ts) file with your own DB instance URL.



### [Tinybase / Cloudflare Durable Objects](https://tinybase.org/guides/integrations/cloudflare-durable-objects/)

This demo could also use Tinybase Durable Objects, but we're not there yet. I've had luck with it in other scenarios, so it could work here.

## Deployment

### GitHub Pages

This project is configured to automatically deploy to GitHub Pages when changes are pushed to the `main` branch.

#### Initial Setup

1. Go to your repository settings on GitHub
2. Navigate to **Settings > Pages**
3. Under **Build and deployment**, set:
   - **Source**: GitHub Actions
4. Push to the `main` branch to trigger the deployment

The site will be available at: `https://YOUR_USERNAME.github.io/bfg-starter/`

#### Manual Deployment

To build for GitHub Pages locally:
```bash
npm run build:gh-pages
```

The built files will be in the `dist` directory.