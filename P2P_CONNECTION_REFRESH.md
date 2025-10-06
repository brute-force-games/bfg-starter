# P2P Connection Auto-Refresh & Tracking

This document describes the P2P connection refresh functionality added to the application.

## Overview

The P2P connection system now includes:
1. **Automatic connection tracking** - All connection events are logged with timestamps
2. **Manual refresh capability** - Users can manually refresh connections via UI
3. **Proper cleanup** - Connections are properly closed on component unmount
4. **Visual feedback** - Connection events are displayed in the UI with color-coded badges

## Features

### Connection Event Tracking

All P2P connections (both lobbies and games) now track the following events:
- `initialized` - When a connection is first established
- `peer-joined` - When a peer joins the room
- `peer-left` - When a peer leaves the room
- `auto-refresh` - When a connection is manually refreshed

Each event includes:
- Type of event
- Timestamp
- Number of peers connected
- Human-readable message

### Manual Connection Refresh

Users can manually refresh P2P connections by clicking the "Refresh Connection" button in the P2P tab. This will:
1. Leave the current P2P room
2. Create a new room with the same ID
3. Clear existing peer data
4. Log the refresh event with timestamp
5. Attempt to reconnect with peers

### Console Logging

All connection events are logged to the console with emoji indicators:
- 🚀 Initialization
- 👋 Peer join/leave
- 🔄 Connection refresh
- 🔌 Cleanup
- 📡 General events

Format: `📡 [HH:MM:SS] Event message`

### UI Display

The P2P Connection Component now shows:
1. **Connection Status** - Current number of connected peers
2. **Action Buttons**:
   - "Resend Lobby Data" (host only) - Resends game/lobby state to all peers
   - "Refresh Connection" - Manually refreshes the P2P connection
3. **Connection Events Log** - Scrollable list showing recent events with:
   - Event icon
   - Event message
   - Color-coded badge (blue for initialized, green for join, orange for leave, info for refresh)
   - Timestamp

## Files Modified

### Hooks
- `src/hooks/p2p/use-p2p-lobby.ts` - Added connection tracking and refresh to lobby hook
- `src/hooks/p2p/use-hosted-p2p-lobby.ts` - Pass through new properties
- `src/hooks/p2p/use-p2p-game.ts` - Added connection tracking and refresh to game hook
- `src/hooks/p2p/use-player-p2p-game.ts` - Updated interface with new properties
- `src/hooks/p2p/use-hosted-p2p-game.ts` - Pass through new properties

### Components
- `src/components/p2p/p2p-connection-component.tsx` - Added UI for events and refresh button
- `src/components/p2p/hosted-p2p-lobby-component.tsx` - Wire up new props
- `src/components/p2p/player-p2p-lobby-component.tsx` - Wire up new props
- `src/components/p2p/hosted-p2p-game-component.tsx` - Wire up new props
- `src/components/p2p/player-p2p-game-component.tsx` - Wire up new props

## Usage

### For Development

When developing and hot-reload breaks the P2P connection:
1. Navigate to the "P2P" tab
2. Check the connection events log to see what happened
3. Click "Refresh Connection" to manually reset the connection
4. The event log will show the refresh occurred with a timestamp

### For Production

The connection tracking helps debug peer connection issues:
- Monitor when peers join/leave
- See connection initialization times
- Track manual refreshes
- Identify connection stability issues

## Technical Details

### Connection Lifecycle

1. **Initialization**: When a hook is first called, it creates a new Trystero room
2. **Peer Events**: When peers join/leave, events are tracked and UI updates
3. **Refresh**: When refresh is triggered:
   - Old room is left (calls `room.leave()`)
   - New room is created with same ID
   - State is reset (peers cleared, data nulled)
   - Refresh event is logged
4. **Cleanup**: On component unmount, the room is properly closed

### State Management

Uses `useRef` to maintain room instance across renders while avoiding recreating the room unnecessarily. A `refreshKey` state variable tracks manual refreshes and triggers room recreation when incremented.

### Backwards Compatibility

All new props are optional in the `P2pConnectionComponent`, so existing usages continue to work without modification.

## Future Enhancements

Potential improvements:
- Auto-reconnect on peer count dropping to 0
- Configurable event log retention (currently unlimited)
- Export/download connection logs for debugging
- Connection quality metrics (latency, packet loss)
- Visual connection status indicators in the main UI

