# TinyBase Integration for Player Profiles

This document describes the TinyBase integration for the cryptographic player profile system.

## Overview

TinyBase provides reactive state management for player profiles with automatic persistence to localStorage. This replaces the previous localStorage-based storage with a more robust, reactive solution.

## Architecture

### Core Components

1. **TinyBase Store** (`src/store/player-profile-store.ts`)
   - Centralized store for all player profile data
   - Automatic persistence to localStorage
   - Type-safe operations with proper error handling

2. **React Hooks** (`src/hooks/use-player-profiles.ts`)
   - Reactive hooks for accessing player profile data
   - Automatic re-renders when data changes
   - Type-safe operations

3. **UI Components**
   - Updated dialogs and pages to use TinyBase
   - Reactive updates across the application

## Key Features

### Reactive State Management
- All profile data is stored in a centralized TinyBase store
- UI components automatically re-render when data changes
- No manual state synchronization needed

### Automatic Persistence
- Store data is automatically saved to localStorage
- Data is restored when the application loads
- No manual save/load operations required

### Type Safety
- Full TypeScript support with proper type checking
- Zod schema validation for data integrity
- Type-safe operations throughout the application

### Performance
- Efficient reactive updates
- Minimal re-renders
- Optimized data access patterns

## Usage

### Basic Operations

```typescript
import { usePlayerProfiles, usePlayerProfileActions } from '~/hooks/use-player-profiles';

// Get all profiles (reactive)
const profiles = usePlayerProfiles();

// Get default profile (reactive)
const defaultProfile = useDefaultPlayerProfile();

// Profile actions
const { addProfile, updateProfile, removeProfile, setDefault } = usePlayerProfileActions();
```

### Adding a Profile

```typescript
const profileId = await addProfile(
  'PlayerHandle',
  'https://avatar-url.com/image.jpg',
  true // isDefault
);
```

### Making Signed Moves

```typescript
import { asPlayerMakeTinyBaseSignedMove } from '~/data/dexie-data-ops/as-player-make-tinybase-signed-move';

await asPlayerMakeTinyBaseSignedMove(
  gameTableId,
  playerProfileId, // Just the ID, private key retrieved from store
  moveAction
);
```

## Store Schema

### Player Profiles Table

```typescript
{
  handle: string,
  avatarImageUrl?: string,
  isDefault: boolean,
  publicKey: string,
  privateKey: string,
  createdAt: string,
  updatedAt: string
}
```

### Values

```typescript
{
  defaultProfileId: string
}
```

## File Structure

```
src/
├── store/
│   └── player-profile-store.ts     # TinyBase store setup and operations
├── hooks/
│   └── use-player-profiles.ts      # React hooks for store access
├── pages/my-player-profiles/
│   └── tinybase-player-profiles-page.tsx  # Updated UI using TinyBase
├── dialogs/
│   └── tinybase-add-player-profile-dialog.tsx  # Updated dialog
└── data/dexie-data-ops/
    └── as-player-make-tinybase-signed-move.ts  # Updated move function
```

## Benefits Over Previous Implementation

1. **Reactive Updates**: UI automatically updates when data changes
2. **Centralized State**: Single source of truth for all profile data
3. **Type Safety**: Full TypeScript support with proper error handling
4. **Performance**: Efficient updates with minimal re-renders
5. **Persistence**: Automatic save/restore functionality
6. **Developer Experience**: Clean, predictable API

## Migration from localStorage

The TinyBase integration maintains compatibility with the existing data models while providing enhanced functionality:

- Same data structures (`PrivatePlayerProfile`, `PublicPlayerProfile`)
- Same cryptographic operations
- Enhanced reactive capabilities
- Better error handling and type safety

## Dependencies

- `tinybase`: Core state management library
- `tinybase/ui-react`: React integration hooks

## Future Enhancements

1. **Real-time Sync**: Multi-device synchronization
2. **Offline Support**: Enhanced offline capabilities
3. **Data Validation**: Enhanced schema validation
4. **Performance Optimization**: Further performance improvements
5. **Developer Tools**: TinyBase DevTools integration
