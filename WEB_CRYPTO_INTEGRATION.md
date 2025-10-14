# Web Crypto API Integration

This document describes the Web Crypto API integration for player profiles, which provides secure cryptographic operations for signing, verifying, encrypting, and decrypting messages.

## Overview

Player profiles now include Web Crypto API key pairs for:
- **Signing/Verification**: ECDSA P-384 keys for signing messages and verifying signatures
- **Encryption/Decryption**: RSA-OAEP 4096-bit keys for encrypting and decrypting messages

## Key Features

### 1. Automatic Key Generation
When a new player profile is created, signing and encryption key pairs are automatically generated using the Web Crypto API:

```typescript
const profile = await createPrivatePlayerProfile('playerHandle', 'avatarUrl');
// profile now has:
// - signingPublicKey / signingPrivateKey (ECDSA P-384)
// - encryptionPublicKey / encryptionPrivateKey (RSA-OAEP 4096)
```

### 2. Signing and Verification

**Sign a message:**
```typescript
import { signMessageWithProfile } from '~/models/private-player-profile';

const signature = await signMessageWithProfile(profile, 'Hello, World!');
```

**Verify a signature:**
```typescript
import { verifyMessageWithProfile } from '~/models/private-player-profile';

const isValid = await verifyMessageWithProfile(
  publicProfile,
  'Hello, World!',
  signature
);
```

### 3. Encryption and Decryption

**Encrypt a message for a recipient:**
```typescript
import { encryptMessageForProfile } from '~/models/private-player-profile';

const encrypted = await encryptMessageForProfile(
  recipientPublicProfile,
  'Secret message'
);
// Returns: { ciphertext: string, iv: string }
```

**Decrypt a received message:**
```typescript
import { decryptMessageWithProfile } from '~/models/private-player-profile';

const decrypted = await decryptMessageWithProfile(
  yourPrivateProfile,
  encryptedMessage
);
```

### 4. Authentication Challenges

**Create an authentication challenge:**
```typescript
import { createAuthChallengeWithProfile } from '~/models/private-player-profile';

const authToken = await createAuthChallengeWithProfile(
  profile,
  'random-challenge-string'
);
// Returns: { challenge, signature, publicKey, timestamp }
```

**Verify an authentication challenge:**
```typescript
import { verifyAuthChallengeWithProfile } from '~/models/private-player-profile';

const isValid = await verifyAuthChallengeWithProfile(
  publicProfile,
  authToken.challenge,
  authToken.signature,
  authToken.timestamp,
  60000 // max age in milliseconds (optional, default 60 seconds)
);
```

## Profile Schema Changes

### Public Player Profile
```typescript
{
  id: string;
  handle: string;
  avatarImageUrl?: string;
  
  // Web Crypto API public keys (JWK format)
  signingPublicKey?: string;      // For verifying signatures
  encryptionPublicKey?: string;   // For encrypting messages
  
  // Legacy fields (deprecated)
  publicKey?: string;
  walletAddress?: string;
  walletPublicKey?: string;
  
  createdAt: number;
  updatedAt: number;
}
```

### Private Player Profile
Extends `PublicPlayerProfile` with:
```typescript
{
  // Web Crypto API private keys (JWK format)
  signingPrivateKey?: string;     // For signing messages
  encryptionPrivateKey?: string;  // For decrypting messages
  
  // Legacy field (deprecated)
  walletMnemonic?: string;
}
```

## Low-Level Crypto Utilities

Direct access to crypto operations is available in `~/crypto/web-crypto-utils.ts`:

### Key Generation
```typescript
import { generateCryptoKeys } from '~/crypto/web-crypto-utils';

const keys = await generateCryptoKeys();
// Returns both signing and encryption key pairs
```

### Signing and Verification
```typescript
import { signMessage, verifySignature } from '~/crypto/web-crypto-utils';

const signature = await signMessage(message, privateKeyJwk);
const isValid = await verifySignature(message, signature, publicKeyJwk);
```

### Encryption and Decryption
```typescript
import { encryptMessage, decryptMessage } from '~/crypto/web-crypto-utils';

const encrypted = await encryptMessage(message, publicKeyJwk);
const decrypted = await decryptMessage(encrypted, privateKeyJwk);
```

### Symmetric Encryption (for large messages)
For encrypting large messages, AES-GCM symmetric encryption is more efficient:

```typescript
import { 
  generateSymmetricKey,
  encryptMessageSymmetric,
  decryptMessageSymmetric,
  exportSymmetricKey,
  importSymmetricKey
} from '~/crypto/web-crypto-utils';

// Generate a symmetric key
const symmetricKey = await generateSymmetricKey();

// Encrypt with symmetric key
const encrypted = await encryptMessageSymmetric(largeMessage, symmetricKey);

// Decrypt with symmetric key
const decrypted = await decryptMessageSymmetric(encrypted, symmetricKey);

// Export/import for sharing (you'd encrypt this with RSA-OAEP)
const keyJwk = await exportSymmetricKey(symmetricKey);
const importedKey = await importSymmetricKey(keyJwk);
```

### Utility Functions
```typescript
import { hashMessage, generateNonce } from '~/crypto/web-crypto-utils';

// Hash a message with SHA-256
const hash = await hashMessage('message');

// Generate a random nonce for challenge-response auth
const nonce = generateNonce();
```

## Security Considerations

1. **Key Storage**: Private keys are stored in TinyBase localStorage. Ensure proper application security.

2. **Key Rotation**: Currently not implemented. Keys are generated once per profile.

3. **Challenge Expiration**: Authentication challenges expire after 60 seconds by default to prevent replay attacks.

4. **Algorithm Choices**:
   - ECDSA P-384: Strong elliptic curve for signing
   - RSA-OAEP 4096: Strong asymmetric encryption
   - AES-GCM 256: Strong symmetric encryption for large messages

5. **Public Key Distribution**: Public keys are shared in `PublicPlayerProfile` objects. Ensure proper key verification in production.

## Migration from Legacy System

The legacy wallet-based system (BCH/SLP) is deprecated but still supported through optional fields. New profiles automatically use Web Crypto API keys.

### Legacy Functions (Deprecated)
- `createWalletBasedPlayerProfile` - now redirects to `createPrivatePlayerProfile`
- `createPlayerProfileFromWallet` - now redirects to `createPrivatePlayerProfile`
- `createPlayerProfileFromPrivateKey` - now redirects to `createPrivatePlayerProfile`

## Example: Secure Messaging

Here's a complete example of secure messaging between two players:

```typescript
import { 
  createPrivatePlayerProfile,
  encryptMessageForProfile,
  decryptMessageWithProfile,
  signMessageWithProfile,
  verifyMessageWithProfile
} from '~/models/private-player-profile';
import { getPublicProfile } from '~/store/player-profile-store';

// Alice creates her profile
const aliceProfile = await createPrivatePlayerProfile('Alice');

// Bob creates his profile
const bobProfile = await createPrivatePlayerProfile('Bob');

// Get Bob's public profile
const bobPublicProfile = getPublicProfile(bobProfile.id);

// Alice encrypts and signs a message for Bob
const message = 'Hello Bob!';
const encrypted = await encryptMessageForProfile(bobPublicProfile, message);
const signature = await signMessageWithProfile(aliceProfile, message);

// Bob receives the encrypted message and signature
// Bob decrypts the message
const decrypted = await decryptMessageWithProfile(bobProfile, encrypted);

// Bob verifies it came from Alice
const alicePublicProfile = getPublicProfile(aliceProfile.id);
const isValid = await verifyMessageWithProfile(
  alicePublicProfile,
  decrypted,
  signature
);

console.log('Decrypted:', decrypted); // "Hello Bob!"
console.log('Valid signature:', isValid); // true
```

## Testing

A crypto test dialog is available at `src/dialogs/crypto-test-dialog.tsx` for testing cryptographic operations.

## Future Enhancements

1. **Key Rotation**: Implement key versioning and rotation
2. **Key Backup**: Add encrypted key backup/recovery
3. **Multi-device**: Support for syncing keys across devices
4. **Hardware Keys**: Integration with hardware security modules
5. **End-to-End Encryption**: Complete E2EE for game sessions

