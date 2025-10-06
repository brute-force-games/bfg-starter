# Wallet-Based Authentication Integration

This document describes the integration of `minimal-slp-wallet` for user identity, authentication, and key management in the BFG (Brute Force Games) application.

## Overview

The wallet integration provides a comprehensive system for managing user identity and cryptographic operations using Bitcoin Cash (BCH) wallet infrastructure. It focuses on identity management and key derivation rather than actual BCH transactions, allowing users to manage multiple keys for different purposes from a single seed phrase.

## Key Features

- **HD Wallet Support**: Generate multiple keys from a single master seed phrase
- **Purpose-Specific Keys**: Different key classes for identity, lobbies, games, and signing
- **Identity Management**: Focus on user identity and authentication without BCH transactions
- **Key Derivation**: Create purpose-specific keys for different game scenarios
- **Authentication**: Challenge-response authentication using wallet signatures (placeholder implementation)
- **Move Signing**: Sign game moves and transactions with wallet keys (placeholder implementation)
- **Backward Compatibility**: Works alongside existing RSA-based authentication

## Architecture

### Core Components

1. **WalletManager** (`src/crypto/wallet-manager.ts`)
   - Manages HD wallet operations
   - Handles key derivation and wallet initialization
   - Provides singleton instance for global access

2. **Key Types** (`src/crypto/wallet-key-types.ts`)
   - Defines key derivation paths and purposes
   - Provides type-safe key classes (IdentityKey, LobbyKey, GameKey, SigningKey)
   - Includes validation schemas

3. **Key Derivation Utils** (`src/crypto/key-derivation-utils.ts`)
   - Utilities for deriving specific keys for different purposes
   - Context-aware key management for different game scenarios
   - Deterministic key generation from identifiers

4. **Enhanced Crypto Utils** (`src/crypto/crypto-utils.ts`)
   - Extended to support wallet-based authentication
   - Maintains backward compatibility with RSA keys
   - Provides wallet-specific signing and verification functions

5. **Updated Player Profiles** (`src/models/private-player-profile.ts`, `src/models/public-player-profile.ts`)
   - Support for both RSA and wallet-based identity
   - Enhanced profile creation functions
   - Secure mnemonic storage options

## Key Derivation Paths

The system uses BIP44-compliant derivation paths:

```
m/44'/145'/0'/{purpose_index}/{key_index}
```

Where:
- `44'`: BIP44 standard
- `145'`: Bitcoin Cash coin type
- `0'`: Account index (0 for main account)
- `purpose_index`: 
  - `0`: Identity keys
  - `1`: Lobby keys
  - `2`: Game keys
  - `3`: Signing keys
- `key_index`: Specific key within that purpose

## Usage Examples

### 1. Initialize a New Wallet

```typescript
import { initializeNewWallet } from '~/crypto/crypto-utils';

// Create a new wallet with generated mnemonic
const masterWallet = await initializeNewWallet();
console.log('Mnemonic:', masterWallet.mnemonic);
console.log('Address:', masterWallet.address);
```

### 2. Import Existing Wallet

```typescript
import { initializeWalletFromMnemonic, initializeWalletFromPrivateKey } from '~/crypto/crypto-utils';

// Initialize from existing mnemonic (preserves the provided mnemonic)
const masterWallet = await initializeWalletFromMnemonic(mnemonic);

// Initialize from existing private key
const masterWallet = await initializeWalletFromPrivateKey(privateKeyWIF);
```

### 3. Create Player Profile with Wallet

```typescript
import { 
  createWalletBasedPlayerProfile,
  createPlayerProfileFromPrivateKey 
} from '~/models/private-player-profile';

// Create profile with new wallet
const profile = await createWalletBasedPlayerProfile(
  'player_handle',
  'https://example.com/avatar.jpg',
  'password_hint'
);

// Create profile from existing private key
const profile = await createPlayerProfileFromPrivateKey(
  'player_handle',
  'L1furRqmUockQgWDG4wkwAQmMoQacUF6GLrckd9CwUgCq4GGZFeD',
  'https://example.com/avatar.jpg',
  'password_hint'
);
```

### 4. Derive Purpose-Specific Keys

```typescript
import { 
  deriveLobbyKey, 
  deriveGameKey, 
  deriveTableSigningKey 
} from '~/crypto/key-derivation-utils';

// Derive keys for specific purposes
const lobbyKey = await deriveLobbyKey('lobby-123');
const gameKey = await deriveGameKey('game-456');
const signingKey = await deriveTableSigningKey('table-789');
```

### 5. Authentication Challenge-Response

```typescript
import { 
  createAuthenticationChallenge,
  verifyAuthenticationChallenge 
} from '~/crypto/crypto-utils';

// Create challenge
const challenge = `Challenge: ${Date.now()}`;
const response = await createAuthenticationChallenge(challenge, identityKey);

// Verify challenge
const isValid = await verifyAuthenticationChallenge(
  response.challenge,
  response.signature,
  response.address
);
```

### 6. Sign and Verify Moves

```typescript
import { 
  signMoveWithWallet,
  verifyWalletSignedMove 
} from '~/crypto/crypto-utils';

// Sign a move
const moveData = { action: 'move', position: [1, 2] };
const signature = await signMoveWithWallet(moveData, signingKey.walletKey);

// Verify a move
const isValid = await verifyWalletSignedMove(moveData, signature, signingKey.publicKey);
```

### 7. Sign and Verify Arbitrary Strings

```typescript
import { walletManager } from '~/crypto/wallet-manager';

// Sign an arbitrary string
const message = 'Hello, World!';
const signature = await walletManager.signMessage(message, walletKey);

// Verify the signature
const isValid = await walletManager.verifyMessage(message, signature, walletKey.publicKey);
```

## Key Classes

### IdentityKey
- Primary user identity and authentication
- Used for login and profile verification
- Derived from path: `m/44'/145'/0'/0/{index}`

### LobbyKey
- Creating and managing game lobbies
- Lobby-specific operations and permissions
- Derived from path: `m/44'/145'/0'/1/{index}`

### GameKey
- Creating and managing individual games
- Game-specific operations and state management
- Derived from path: `m/44'/145'/0'/2/{index}`

### SigningKey
- Signing moves and transactions
- Cryptographic operations for game actions
- Derived from path: `m/44'/145'/0'/3/{index}`

## Current Implementation Status

### ✅ Fully Implemented
- **Wallet Creation**: Generate new wallets with mnemonics
- **Key Management**: Create and manage different key types
- **Player Profiles**: Support for wallet-based player profiles
- **Key Derivation**: Purpose-specific key generation
- **Message Signing**: Sign arbitrary strings using ECPair
- **Signature Verification**: Verify signatures against public keys
- **Private Key Import**: Create wallets from existing private keys
- **UI Components**: Complete demo interface

### 🔄 Future Enhancements (Optional)
- **Hardware Wallet Support**: Integration with hardware wallets

## Security Considerations

### Mnemonic Storage
- **Never store mnemonics in plain text**
- Use encryption for local storage
- Consider hardware wallet integration for production
- Provide clear backup and recovery instructions

### Key Management
- Each purpose has its own key derivation path (currently separate wallets)
- Keys are generated for different purposes
- Private keys should never be transmitted over the network
- Use challenge-response for authentication (when properly implemented)

### Best Practices
1. Always validate signatures before trusting data (when implemented)
2. Use HTTPS for all wallet operations
3. Implement proper error handling for wallet failures
4. Provide clear user feedback for wallet operations
5. Consider implementing key rotation strategies

## Integration with Existing Systems

### Player Profiles
The system supports both RSA and wallet-based profiles:

```typescript
// RSA-based profile (existing)
const rsaProfile = await createPrivatePlayerProfile('handle');

// Wallet-based profile (new)
const walletProfile = await createWalletBasedPlayerProfile('handle');
```

### Move Signing
Both signing methods are supported:

```typescript
// RSA signing (existing)
const rsaSignedMove = await createSignedMove(moveData, privateKey, publicKey);

// Wallet signing (new)
const walletSignedMove = await createWalletSignedMove(moveData, walletKey);
```

## Demo Component

A comprehensive demo component is available at `src/components/wallet-auth-demo-component.tsx` that demonstrates:

- Wallet creation and import
- Player profile creation
- Key derivation for different purposes
- Authentication challenge-response
- Move signing and verification

## Dependencies

- `minimal-slp-wallet`: Core wallet functionality
- `zod`: Schema validation
- Existing BFG dependencies

## Future Enhancements

1. **Hardware Wallet Support**: Integration with hardware wallets for enhanced security
2. **Multi-Signature Support**: Collaborative key management for shared resources
3. **SLP Token Integration**: Support for SLP token-based game economies
4. **Cross-Chain Support**: Extend to other blockchain networks
5. **Advanced Key Rotation**: Automated key rotation strategies
6. **Wallet Recovery**: Enhanced recovery mechanisms for lost wallets

## Troubleshooting

### Common Issues

1. **Wallet Not Initialized**: Ensure `initializeNewWallet()` or `initializeWalletFromMnemonic()` is called first
2. **Invalid Mnemonic**: Verify the mnemonic phrase is correct and properly formatted
3. **Key Derivation Failures**: Check that the wallet is properly initialized before deriving keys
4. **Signature Verification Failures**: Ensure the correct address and message are used for verification

### Debug Mode

Enable debug logging by setting the appropriate environment variables or using browser developer tools to inspect wallet operations.

## Contributing

When contributing to the wallet integration:

1. Follow the existing code style and patterns
2. Add comprehensive tests for new functionality
3. Update documentation for any API changes
4. Consider security implications of all changes
5. Test with both testnet and mainnet environments

## License

This wallet integration follows the same license as the main BFG project.
