# bfg-starter

I created this repo to better understand local-first dev and cloud syncing for board games (they're just fancy state machines, really) using a React frontend. I'm trying to shake out the common layers of abstraction (e.g. user IDs, emails, invitations/notifications, how data is structured for sharing) that are present so someone can write a board game engine and UI like they would a react component - a board game state, and actions that mutate that state, but with players and secret information accounted for. 


I'm really trying to figure out how to get multiplayer security for the best value. Engines I've been messing with along with some notes for my future reference...


### [Dexie / Dexie Cloud](https://dexie.org/cloud/)
I like the concept of the Dexie Cloud plan - reasonable price with a decent security model at the web application layer. It's the most multiplayer plug and play I've come across that doesn't require any server maintenance and Big Tech.

#### Configuring for your own Dexie Cloud instance
Update the [Dexie Cloud Config](./src/data/sync-engines/dexie-cloud/dexie-config.ts) file with your own DB instance URL.



### [Tinybase / Cloudflare Durable Objects](https://tinybase.org/guides/integrations/cloudflare-durable-objects/)

This demo could also use Tinybase Durable Objects, but we're not there yet. I've had luck with it in other scenarios, so it could work here.

## Development & Debugging

### Browser Debugging Setup

This project is configured for full TypeScript debugging in the browser with VS Code integration.

#### Method 1: VS Code Debugger (Recommended)

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Set breakpoints in VS Code:**
   - Open any `.tsx` or `.ts` file
   - Click in the left margin next to line numbers to set breakpoints
   - You can also set conditional breakpoints by right-clicking

3. **Launch the debugger:**
   - Press `F5` or go to Run & Debug panel (Ctrl+Shift+D)
   - Select "Launch Chrome against localhost" from the dropdown
   - Click the green play button

4. **Debug features available:**
   - ✅ Breakpoints in TypeScript/React code
   - ✅ Step through code line by line
   - ✅ Inspect variables and React state
   - ✅ Call stack navigation
   - ✅ Watch expressions
   - ✅ Console debugging

#### Method 2: Chrome DevTools (Alternative)

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Open Chrome with debugging enabled:**
   ```bash
   # On macOS
   /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-debug
   ```

3. **Attach VS Code to Chrome:**
   - Use the "Attach to Chrome" configuration in VS Code
   - This allows you to debug while using your regular Chrome profile

#### Method 3: Browser DevTools Only

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Open Chrome DevTools:**
   - Open `http://localhost:62776` in Chrome
   - Press `F12` or right-click → "Inspect"
   - Go to Sources tab to set breakpoints
   - Use Console tab for debugging

#### Debugging P2P Game Logic

The project includes specialized debugging for P2P game mechanics:

- **Game State Debugging**: Set breakpoints in game engine processors
- **P2P Connection Debugging**: Debug Trystero connections and message passing
- **Player Profile Debugging**: Inspect cryptographic identities and wallet states
- **Game Table Operations**: Debug host/player interactions and game state mutations

#### Available Scripts

```bash
# Start development server with debugging enabled
npm run dev

# Build with source maps for debugging
npm run build

# Preview built application
npm run preview

# Generate route definitions
npm run generate-routes
```

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