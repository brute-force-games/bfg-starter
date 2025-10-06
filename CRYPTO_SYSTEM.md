# Cryptographic Player Profile System

This document describes the cryptographic player profile system implemented for the BFG (Brute Force Games) starter application.

## Overview

The system provides cryptographic security for player moves using public/private key pairs. Each player profile includes a unique RSA key pair, and all moves are digitally signed with the player's private key. This ensures:

- **Authenticity**: Moves can be verified as coming from the claimed player
- **Integrity**: Moves cannot be tampered with after signing
- **Non-repudiation**: Players cannot deny making moves they signed
- **Privacy**: All profile data is stored client-side only

## Architecture

### Core Components

1. **Crypto Utils** (`src/crypto/crypto-utils.ts`)
   - Key pair generation using Web Crypto API
   - Digital signature creation and verification
   - PEM format key handling

2. **Player Profile Models**
   - `PrivatePlayerProfile`: Extends `PublicPlayerProfile` with private key and sensitive data (client-side only)
   - `PublicPlayerProfile`: Contains public key and basic info (for sharing)

3. **Client Storage** (`src/data/client-player-profiles.ts`)
   - localStorage-based storage for player profiles
   - No server involvement
   - Profile management functions

4. **Signed Game Actions** (`src/types/core/game-table/signed-game-action.ts`)
   - Extended game action structure with digital signatures
   - Verification functions for signed moves

## Key Features

### Inheritance Architecture
- `PrivatePlayerProfile` extends `PublicPlayerProfile`
- Private profiles contain all public data plus private keys
- Clean separation between public and private data

### Client-Side Only
- All player profile data stored in localStorage
- No server required for profile management
- Private keys never leave the user's device

### Cryptographic Security
- RSA 2048-bit key pairs
- SHA-256 hashing with RSA-PKCS1-v1_5 signing
- Web Crypto API for all cryptographic operations

### Move Signing
- Every player move is digitally signed
- Signatures include move data, player ID, timestamp
- Automatic verification of incoming moves

## Usage

### Creating a Player Profile

```typescript
import { addPrivatePlayerProfile } from '~/data/client-player-profiles';

const profile = await addPrivatePlayerProfile(
  'PlayerHandle',
  'https://avatar-url.com/image.jpg',
  true // isDefault
);
```

### Making a Signed Move

```typescript
import { asPlayerMakeSignedMove } from '~/data/dexie-data-ops/as-player-make-signed-move';

await asPlayerMakeSignedMove(
  gameTableId,
  playerProfile, // Contains private key
  moveAction
);
```

### Verifying a Move

```typescript
import { verifySignedMove } from '~/types/core/game-table/signed-game-action';

const isValid = await verifySignedMove(signedAction);
```

## Security Considerations

### Key Management
- Private keys are generated client-side and never transmitted
- Keys are stored in localStorage (consider encrypted storage for production)
- Key pairs are unique per player profile

### Signature Verification
- All player moves are automatically verified before processing
- Invalid signatures are rejected
- Host actions don't require signatures

### Data Privacy
- No profile data is sent to servers
- Public keys are only shared when needed for verification
- All cryptographic operations happen locally

## File Structure

```
src/
├── crypto/
│   └── crypto-utils.ts           # Core cryptographic functions
├── models/
│   ├── private-player-profile.ts # Private profile with keys
│   └── public-player-profile.ts  # Public profile for sharing
├── data/
│   ├── client-player-profiles.ts # Client-side storage
│   └── dexie-data-ops/
│       └── as-player-make-signed-move.ts # Signed move creation
├── types/core/game-table/
│   └── signed-game-action.ts     # Signed action structures
└── components/
    └── crypto-demo-component.tsx # Demo component
```

## Dependencies

- `zod`: Schema validation
- `uuid`: Unique ID generation
- Web Crypto API: Built-in browser cryptography

## Future Enhancements

1. **Key Rotation**: Allow players to rotate their keys
2. **Encrypted Storage**: Encrypt private keys in localStorage
3. **Key Backup**: Secure backup/restore functionality
4. **Multi-device Sync**: Encrypted key synchronization
5. **Hardware Security**: Integration with hardware security modules

## Demo

The `CryptoDemoComponent` provides an interactive demo showing:
- Key pair generation
- Move signing
- Signature verification

This helps users understand how the cryptographic system works.
