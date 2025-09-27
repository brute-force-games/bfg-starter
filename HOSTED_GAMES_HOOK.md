# Hosted Games Hook and TinyBase Store

This document explains how to use the hosted games hook and TinyBase store for managing game table data in the Brute Force Games application.

## Overview

The hosted games system provides reactive state management for game tables using TinyBase. It includes:

- **TinyBase Store**: Persistent storage with automatic localStorage synchronization
- **React Hooks**: Reactive data access with automatic re-rendering
- **CRUD Operations**: Create, read, update, and delete operations for hosted games
- **Data Validation**: Zod schema validation for type safety

## Files

- `src/store/hosted-games-store.ts` - TinyBase store implementation
- `src/hooks/use-hosted-games.ts` - React hooks for reactive data access
- `src/components/hosted-games-demo-component.tsx` - Example usage component

## Store API

### Core Functions

```typescript
import { 
  hostedGamesStore,
  addHostedGame,
  updateHostedGame,
  deleteHostedGame,
  getHostedGame,
  getAllHostedGames,
  clearAllHostedGames
} from '~/store/hosted-games-store';

// Add a new hosted game
const success = addHostedGame(gameTable);

// Update an existing game
const success = updateHostedGame(gameId, updates);

// Delete a game
const success = deleteHostedGame(gameId);

// Get a specific game
const game = getHostedGame(gameId);

// Get all games
const allGames = getAllHostedGames();

// Clear all games (for testing)
clearAllHostedGames();
```

### Filtering Functions

```typescript
import { 
  getHostedGamesByHost,
  getHostedGamesByTitle,
  getHostedGamesByPhase
} from '~/store/hosted-games-store';

// Get games by host player
const hostGames = getHostedGamesByHost(hostPlayerId);

// Get games by title
const ticTacToeGames = getHostedGamesByTitle('tic-tac-toe');

// Get games by phase
const activeGames = getHostedGamesByPhase('in-progress');
```

## React Hooks API

### Basic Hooks

```typescript
import { 
  useHostedGames,
  useHostedGame,
  useHostedGamesCount,
  useHostedGameActions
} from '~/hooks/use-hosted-games';

function MyComponent() {
  // Get all hosted games (reactive)
  const allGames = useHostedGames();
  
  // Get a specific game (reactive)
  const game = useHostedGame(gameId);
  
  // Get games count (reactive)
  const count = useHostedGamesCount();
  
  // Get action functions
  const { addGame, updateGame, removeGame, clearAll } = useHostedGameActions();
  
  return (
    <div>
      <p>Total games: {count}</p>
      {allGames.map(game => (
        <div key={game.id}>{game.gameTitle}</div>
      ))}
    </div>
  );
}
```

### Filtering Hooks

```typescript
import { 
  useHostedGamesByHost,
  useHostedGamesByTitle,
  useHostedGamesByPhase,
  useActiveHostedGames,
  useFinishedHostedGames,
  useWaitingHostedGames,
  useInProgressHostedGames
} from '~/hooks/use-hosted-games';

function MyComponent() {
  // Get games by various filters (all reactive)
  const hostGames = useHostedGamesByHost(hostPlayerId);
  const ticTacToeGames = useHostedGamesByTitle('tic-tac-toe');
  const activeGames = useActiveHostedGames();
  const finishedGames = useFinishedHostedGames();
  const waitingGames = useWaitingHostedGames();
  const inProgressGames = useInProgressHostedGames();
  
  return (
    <div>
      <h2>Active Games: {activeGames.length}</h2>
      <h2>Finished Games: {finishedGames.length}</h2>
      <h2>Waiting Games: {waitingGames.length}</h2>
    </div>
  );
}
```

### Utility Hooks

```typescript
import { 
  useRecentHostedGames,
  useHostedGamesStats
} from '~/hooks/use-hosted-games';

function MyComponent() {
  // Get recent games (sorted by creation date)
  const recentGames = useRecentHostedGames(10); // Last 10 games
  
  // Get statistics
  const stats = useHostedGamesStats();
  
  return (
    <div>
      <h2>Statistics</h2>
      <p>Total: {stats.total}</p>
      <p>Active: {stats.active}</p>
      <p>Finished: {stats.finished}</p>
      <p>Waiting: {stats.waiting}</p>
      <p>In Progress: {stats.inProgress}</p>
    </div>
  );
}
```

## Data Structure

The hosted games store uses the `DbGameTable` type from the game table schema:

```typescript
interface DbGameTable {
  id: BfgGameTableId;
  gameTitle: string;
  gameHostPlayerProfileId: string;
  tablePhase: string;
  currentStatusDescription: string;
  sharedWith: string[];
  p1: string;
  p2?: string;
  p3?: string;
  p4?: string;
  p5?: string;
  p6?: string;
  p7?: string;
  p8?: string;
  createdAt: Date;
  latestActionId: string;
  realmId?: string;
}
```

## Persistence

The store automatically persists data to localStorage using TinyBase's local persister. Data is:

- Automatically loaded when the store is created
- Automatically saved when data changes
- Stored under the key `tinybase_hosted_games`

## Validation

All data is validated using Zod schemas:

- `DbGameTableSchema` validates game table data
- Invalid data is logged and filtered out
- Type safety is maintained throughout the application

## Example Usage

See `src/components/hosted-games-demo-component.tsx` for a complete example showing:

- How to display statistics
- How to add, update, and remove games
- How to filter and display games by different criteria
- How to use all the available hooks

## Integration with Existing Code

The hosted games system is designed to work alongside the existing player profiles system:

- Uses the same TinyBase patterns
- Follows the same validation approach
- Maintains consistency with existing code style
- Can be easily integrated into existing components

## Performance Considerations

- TinyBase provides efficient reactive updates
- Data is only re-rendered when relevant data changes
- Local storage persistence is asynchronous and non-blocking
- Large datasets are handled efficiently through TinyBase's optimizations
