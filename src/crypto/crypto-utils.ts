// import { z } from 'zod';
// import { IdentityKey, WalletKey } from './wallet-key-types';

// /**
//  * Cryptographic utilities for player profiles and move signing
//  * Supports both traditional RSA keys and BCH/SLP wallet-based authentication
//  */

// export interface CryptoKeyPair {
//   publicKey: string;  // PEM formatted public key
//   privateKey: string; // PEM formatted private key
// }

// export interface SignedMove {
//   move: string;       // JSON stringified move data
//   signature: string;  // Base64 encoded signature
//   publicKey: string;  // PEM formatted public key for verification
// }

// /**
//  * Generate a new RSA key pair for a player profile
//  */
// export const generateKeyPair = async (): Promise<CryptoKeyPair> => {
//   try {
//     // Generate key pair using Web Crypto API
//     const keyPair = await crypto.subtle.generateKey(
//       {
//         name: 'RSASSA-PKCS1-v1_5',
//         modulusLength: 2048,
//         publicExponent: new Uint8Array([1, 0, 1]),
//         hash: 'SHA-256',
//       },
//       true, // extractable
//       ['sign', 'verify']
//     );

//     // Export public key
//     const publicKeyBuffer = await crypto.subtle.exportKey('spki', keyPair.publicKey);
//     const publicKeyPem = bufferToPem(publicKeyBuffer, 'PUBLIC KEY');

//     // Export private key
//     const privateKeyBuffer = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
//     const privateKeyPem = bufferToPem(privateKeyBuffer, 'PRIVATE KEY');

//     return {
//       publicKey: publicKeyPem,
//       privateKey: privateKeyPem,
//     };
//   } catch (error) {
//     console.error('Error generating key pair:', error);
//     throw new Error('Failed to generate cryptographic key pair');
//   }
// };

// /**
//  * Generate multiple RSA key pairs in batch
//  * Useful for creating multiple identities or rotating keys
//  */
// export const generateMultipleKeyPairs = async (count: number): Promise<CryptoKeyPair[]> => {
//   if (count <= 0) {
//     throw new Error('Count must be greater than 0');
//   }
  
//   if (count > 100) {
//     throw new Error('Count cannot exceed 100 key pairs per batch');
//   }

//   try {
//     const keyPairs: CryptoKeyPair[] = [];
    
//     // Generate key pairs in parallel for better performance
//     const promises = Array.from({ length: count }, async () => {
//       return await generateKeyPair();
//     });
    
//     const results = await Promise.all(promises);
//     keyPairs.push(...results);
    
//     return keyPairs;
//   } catch (error) {
//     console.error('Error generating multiple key pairs:', error);
//     throw new Error('Failed to generate multiple cryptographic key pairs');
//   }
// };

// /**
//  * Sign a move with a private key
//  */
// export const signMove = async (
//   moveData: any,
//   privateKeyPem: string
// ): Promise<string> => {
//   try {
//     // Convert PEM to CryptoKey
//     const privateKey = await pemToCryptoKey(privateKeyPem, 'private');

//     // Stringify move data for signing
//     const moveString = JSON.stringify(moveData);
//     const moveBuffer = new TextEncoder().encode(moveString);

//     // Sign the move
//     const signatureBuffer = await crypto.subtle.sign(
//       'RSASSA-PKCS1-v1_5',
//       privateKey,
//       moveBuffer
//     );

//     // Convert to base64
//     return bufferToBase64(signatureBuffer);
//   } catch (error) {
//     console.error('Error signing move:', error);
//     throw new Error('Failed to sign move');
//   }
// };

// /**
//  * Verify a signed move
//  */
// export const verifyMove = async (
//   moveData: any,
//   signature: string,
//   publicKeyPem: string
// ): Promise<boolean> => {
//   try {
//     // Convert PEM to CryptoKey
//     const publicKey = await pemToCryptoKey(publicKeyPem, 'public');

//     // Stringify move data for verification
//     const moveString = JSON.stringify(moveData);
//     const moveBuffer = new TextEncoder().encode(moveString);

//     // Convert signature from base64
//     const signatureBuffer = base64ToBuffer(signature);

//     // Verify the signature
//     return await crypto.subtle.verify(
//       'RSASSA-PKCS1-v1_5',
//       publicKey,
//       signatureBuffer,
//       moveBuffer
//     );
//   } catch (error) {
//     console.error('Error verifying move:', error);
//     return false;
//   }
// };

// /**
//  * Create a signed move object
//  */
// export const createSignedMove = async (
//   moveData: any,
//   privateKeyPem: string,
//   publicKeyPem: string
// ): Promise<SignedMove> => {
//   const signature = await signMove(moveData, privateKeyPem);
  
//   return {
//     move: JSON.stringify(moveData),
//     signature,
//     publicKey: publicKeyPem,
//   };
// };

// /**
//  * Verify a signed move object
//  */
// export const verifySignedMove = async (signedMove: SignedMove): Promise<boolean> => {
//   try {
//     const moveData = JSON.parse(signedMove.move);
//     return await verifyMove(moveData, signedMove.signature, signedMove.publicKey);
//   } catch (error) {
//     console.error('Error verifying signed move:', error);
//     return false;
//   }
// };

// // Helper functions

// /**
//  * Convert buffer to PEM format
//  */
// const bufferToPem = (buffer: ArrayBuffer, type: string): string => {
//   const base64 = bufferToBase64(buffer);
//   return `-----BEGIN ${type}-----\n${base64.match(/.{1,64}/g)?.join('\n')}\n-----END ${type}-----`;
// };

// /**
//  * Convert buffer to base64 string
//  */
// const bufferToBase64 = (buffer: ArrayBuffer): string => {
//   const bytes = new Uint8Array(buffer);
//   let binary = '';
//   for (let i = 0; i < bytes.byteLength; i++) {
//     binary += String.fromCharCode(bytes[i]);
//   }
//   return btoa(binary);
// };

// /**
//  * Convert base64 string to buffer
//  */
// const base64ToBuffer = (base64: string): ArrayBuffer => {
//   const binary = atob(base64);
//   const bytes = new Uint8Array(binary.length);
//   for (let i = 0; i < binary.length; i++) {
//     bytes[i] = binary.charCodeAt(i);
//   }
//   return bytes.buffer;
// };

// /**
//  * Convert PEM string to CryptoKey
//  */
// const pemToCryptoKey = async (pem: string, type: 'public' | 'private'): Promise<CryptoKey> => {
//   // Remove PEM headers and newlines
//   const pemContents = pem
//     .replace(/-----BEGIN (PUBLIC|PRIVATE) KEY-----/, '')
//     .replace(/-----END (PUBLIC|PRIVATE) KEY-----/, '')
//     .replace(/\s/g, '');

//   // Convert base64 to buffer
//   const buffer = base64ToBuffer(pemContents);

//   // Import key
//   if (type === 'public') {
//     return await crypto.subtle.importKey(
//       'spki',
//       buffer,
//       {
//         name: 'RSASSA-PKCS1-v1_5',
//         hash: 'SHA-256',
//       },
//       false,
//       ['verify']
//     );
//   } else {
//     return await crypto.subtle.importKey(
//       'pkcs8',
//       buffer,
//       {
//         name: 'RSASSA-PKCS1-v1_5',
//         hash: 'SHA-256',
//       },
//       false,
//       ['sign']
//     );
//   }
// };

// // Zod schemas for validation

// export const CryptoKeyPairSchema = z.object({
//   publicKey: z.string().min(1),
//   privateKey: z.string().min(1),
// });

// export const SignedMoveSchema = z.object({
//   move: z.string(),
//   signature: z.string(),
//   publicKey: z.string(),
// });

// export type CryptoKeyPairType = z.infer<typeof CryptoKeyPairSchema>;
// export type SignedMoveType = z.infer<typeof SignedMoveSchema>;

// // ============================================================================
// // WALLET-BASED AUTHENTICATION FUNCTIONS
// // ============================================================================

// /**
//  * Wallet-based signed move interface
//  */
// export interface WalletSignedMove {
//   move: string;           // JSON stringified move data
//   signature: string;      // BCH signature
//   address: string;        // BCH address that signed the move
//   publicKey: string;      // Public key for verification
// }

// /**
//  * Sign a move using a wallet key
//  */
// export const signMoveWithWallet = async (
//   moveData: any,
//   walletKey: WalletKey
// ): Promise<string> => {
//   try {
//     const moveString = JSON.stringify(moveData);
//     const signature = await walletManager.signMessage(moveString, walletKey);
//     return signature;
//   } catch (error) {
//     console.error('Error signing move with wallet:', error);
//     throw new Error('Failed to sign move with wallet');
//   }
// };

// /**
//  * Verify a wallet-signed move
//  */
// export const verifyWalletSignedMove = async (
//   moveData: any,
//   signature: string,
//   address: string
// ): Promise<boolean> => {
//   try {
//     const moveString = JSON.stringify(moveData);
//     return await walletManager.verifyMessage(moveString, signature, address);
//   } catch (error) {
//     console.error('Error verifying wallet-signed move:', error);
//     return false;
//   }
// };

// /**
//  * Create a wallet-signed move object
//  */
// export const createWalletSignedMove = async (
//   moveData: any,
//   walletKey: WalletKey
// ): Promise<WalletSignedMove> => {
//   const signature = await signMoveWithWallet(moveData, walletKey);
  
//   return {
//     move: JSON.stringify(moveData),
//     signature,
//     address: walletKey.address,
//     publicKey: walletKey.publicKey,
//   };
// };

// /**
//  * Verify a wallet-signed move object
//  */
// export const verifyWalletSignedMoveObject = async (signedMove: WalletSignedMove): Promise<boolean> => {
//   try {
//     const moveData = JSON.parse(signedMove.move);
//     return await verifyWalletSignedMove(moveData, signedMove.signature, signedMove.address);
//   } catch (error) {
//     console.error('Error verifying wallet-signed move object:', error);
//     return false;
//   }
// };

// /**
//  * Sign a message with an identity key for authentication
//  */
// export const signAuthenticationMessage = async (
//   message: string,
//   identityKey: IdentityKey
// ): Promise<string> => {
//   try {
//     const signature = await walletManager.signMessage(message, identityKey.walletKey);
//     return signature;
//   } catch (error) {
//     console.error('Error signing authentication message:', error);
//     throw new Error('Failed to sign authentication message');
//   }
// };

// /**
//  * Verify an authentication message signature
//  */
// export const verifyAuthenticationMessage = async (
//   message: string,
//   signature: string,
//   address: string
// ): Promise<boolean> => {
//   try {
//     return await walletManager.verifyMessage(message, signature, address);
//   } catch (error) {
//     console.error('Error verifying authentication message:', error);
//     return false;
//   }
// };

// /**
//  * Create a challenge-response authentication token
//  */
// export const createAuthenticationChallenge = async (
//   challenge: string,
//   identityKey: IdentityKey
// ): Promise<{
//   challenge: string;
//   signature: string;
//   address: string;
//   publicKey: string;
// }> => {
//   try {
//     const signature = await signAuthenticationMessage(challenge, identityKey);
    
//     return {
//       challenge,
//       signature,
//       address: identityKey.address,
//       publicKey: identityKey.publicKey,
//     };
//   } catch (error) {
//     console.error('Error creating authentication challenge:', error);
//     throw new Error('Failed to create authentication challenge');
//   }
// };

// /**
//  * Verify an authentication challenge response
//  */
// export const verifyAuthenticationChallenge = async (
//   challenge: string,
//   signature: string,
//   address: string
// ): Promise<boolean> => {
//   return await verifyAuthenticationMessage(challenge, signature, address);
// };

// // ============================================================================
// // WALLET MANAGEMENT UTILITIES
// // ============================================================================

// /**
//  * Initialize a new wallet for a user
//  */
// export const initializeNewWallet = async () => {
//   return await walletManager.createNewWallet();
// };

// /**
//  * Initialize wallet from existing mnemonic
//  */
// export const initializeWalletFromMnemonic = async (mnemonic: string) => {
//   return await walletManager.initializeFromMnemonic(mnemonic);
// };

// /**
//  * Initialize wallet from existing private key
//  */
// export const initializeWalletFromPrivateKey = async (privateKey: string) => {
//   return await walletManager.initializeFromPrivateKey(privateKey);
// };

// /**
//  * Get the primary identity key for the current wallet
//  */
// export const getPrimaryIdentityKey = async (): Promise<IdentityKey> => {
//   return await walletManager.getIdentityKey(0);
// };

// /**
//  * Check if wallet is initialized
//  */
// export const isWalletInitialized = (): boolean => {
//   return walletManager.isInitialized();
// };

// /**
//  * Get wallet balance
//  */
// export const getWalletBalance = async (): Promise<number> => {
//   return await walletManager.getBalance();
// };

// // ============================================================================
// // SCHEMAS FOR WALLET-BASED AUTHENTICATION
// // ============================================================================

// export const WalletSignedMoveSchema = z.object({
//   move: z.string(),
//   signature: z.string(),
//   address: z.string(),
//   publicKey: z.string(),
// });

// export const AuthenticationChallengeSchema = z.object({
//   challenge: z.string(),
//   signature: z.string(),
//   address: z.string(),
//   publicKey: z.string(),
// });

// export type WalletSignedMoveType = z.infer<typeof WalletSignedMoveSchema>;
// export type AuthenticationChallengeType = z.infer<typeof AuthenticationChallengeSchema>;
