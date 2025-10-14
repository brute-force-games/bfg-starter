// import { z } from 'zod';

// /**
//  * Web Crypto API utilities for signing/verifying and encrypting/decrypting messages
//  * Uses ECDSA (P-384) for signing and RSA-OAEP for encryption
//  */

// // ============================================================================
// // TYPE DEFINITIONS
// // ============================================================================

// export interface SigningKeyPair {
//   publicKey: string;  // JWK format JSON string
//   privateKey: string; // JWK format JSON string
// }

// export interface EncryptionKeyPair {
//   publicKey: string;  // JWK format JSON string
//   privateKey: string; // JWK format JSON string
// }

// export interface CryptoKeys {
//   signing: SigningKeyPair;
//   encryption: EncryptionKeyPair;
// }

// export interface SignedMessage {
//   message: string;
//   signature: string; // Base64 encoded
//   publicKey: string; // JWK format JSON string
// }

// export interface EncryptedMessage {
//   ciphertext: string; // Base64 encoded
//   iv: string;         // Base64 encoded initialization vector
// }

// // ============================================================================
// // ZOD SCHEMAS
// // ============================================================================

// export const SigningKeyPairSchema = z.object({
//   publicKey: z.string(),
//   privateKey: z.string(),
// });

// export const EncryptionKeyPairSchema = z.object({
//   publicKey: z.string(),
//   privateKey: z.string(),
// });

// export const CryptoKeysSchema = z.object({
//   signing: SigningKeyPairSchema,
//   encryption: EncryptionKeyPairSchema,
// });

// export const SignedMessageSchema = z.object({
//   message: z.string(),
//   signature: z.string(),
//   publicKey: z.string(),
// });

// export const EncryptedMessageSchema = z.object({
//   ciphertext: z.string(),
//   iv: z.string(),
// });

// // ============================================================================
// // KEY GENERATION
// // ============================================================================

// /**
//  * Generate ECDSA key pair for signing/verifying messages
//  * Uses P-384 curve for strong security
//  */
// export const generateSigningKeyPair = async (): Promise<SigningKeyPair> => {
//   try {
//     const keyPair = await crypto.subtle.generateKey(
//       {
//         name: 'ECDSA',
//         namedCurve: 'P-384', // Strong elliptic curve
//       },
//       true, // extractable
//       ['sign', 'verify']
//     );

//     // Export keys as JWK for easy serialization
//     const publicKeyJwk = await crypto.subtle.exportKey('jwk', keyPair.publicKey);
//     const privateKeyJwk = await crypto.subtle.exportKey('jwk', keyPair.privateKey);

//     return {
//       publicKey: JSON.stringify(publicKeyJwk),
//       privateKey: JSON.stringify(privateKeyJwk),
//     };
//   } catch (error) {
//     console.error('Error generating signing key pair:', error);
//     throw new Error('Failed to generate signing key pair');
//   }
// };

// /**
//  * Generate RSA-OAEP key pair for encrypting/decrypting messages
//  * Uses 4096-bit keys for strong security
//  */
// export const generateEncryptionKeyPair = async (): Promise<EncryptionKeyPair> => {
//   try {
//     const keyPair = await crypto.subtle.generateKey(
//       {
//         name: 'RSA-OAEP',
//         modulusLength: 4096,
//         publicExponent: new Uint8Array([1, 0, 1]),
//         hash: 'SHA-256',
//       },
//       true, // extractable
//       ['encrypt', 'decrypt']
//     );

//     // Export keys as JWK for easy serialization
//     const publicKeyJwk = await crypto.subtle.exportKey('jwk', keyPair.publicKey);
//     const privateKeyJwk = await crypto.subtle.exportKey('jwk', keyPair.privateKey);

//     return {
//       publicKey: JSON.stringify(publicKeyJwk),
//       privateKey: JSON.stringify(privateKeyJwk),
//     };
//   } catch (error) {
//     console.error('Error generating encryption key pair:', error);
//     throw new Error('Failed to generate encryption key pair');
//   }
// };

// /**
//  * Generate both signing and encryption key pairs
//  */
// export const generateCryptoKeys = async (): Promise<CryptoKeys> => {
//   try {
//     const [signing, encryption] = await Promise.all([
//       generateSigningKeyPair(),
//       generateEncryptionKeyPair(),
//     ]);

//     return { signing, encryption };
//   } catch (error) {
//     console.error('Error generating crypto keys:', error);
//     throw new Error('Failed to generate crypto keys');
//   }
// };

// // ============================================================================
// // SIGNING AND VERIFICATION
// // ============================================================================

// /**
//  * Sign a message using a private signing key
//  */
// export const signMessage = async (
//   message: string,
//   privateKeyJwk: string
// ): Promise<string> => {
//   try {
//     const privateKey = await crypto.subtle.importKey(
//       'jwk',
//       JSON.parse(privateKeyJwk),
//       {
//         name: 'ECDSA',
//         namedCurve: 'P-384',
//       },
//       false,
//       ['sign']
//     );

//     const messageBuffer = new TextEncoder().encode(message);
//     const signatureBuffer = await crypto.subtle.sign(
//       {
//         name: 'ECDSA',
//         hash: 'SHA-384',
//       },
//       privateKey,
//       messageBuffer
//     );

//     return bufferToBase64(signatureBuffer);
//   } catch (error) {
//     console.error('Error signing message:', error);
//     throw new Error('Failed to sign message');
//   }
// };

// /**
//  * Verify a message signature using a public signing key
//  */
// export const verifySignature = async (
//   message: string,
//   signature: string,
//   publicKeyJwk: string
// ): Promise<boolean> => {
//   try {
//     const publicKey = await crypto.subtle.importKey(
//       'jwk',
//       JSON.parse(publicKeyJwk),
//       {
//         name: 'ECDSA',
//         namedCurve: 'P-384',
//       },
//       false,
//       ['verify']
//     );

//     const messageBuffer = new TextEncoder().encode(message);
//     const signatureBuffer = base64ToBuffer(signature);

//     return await crypto.subtle.verify(
//       {
//         name: 'ECDSA',
//         hash: 'SHA-384',
//       },
//       publicKey,
//       signatureBuffer,
//       messageBuffer
//     );
//   } catch (error) {
//     console.error('Error verifying signature:', error);
//     return false;
//   }
// };

// /**
//  * Create a signed message object
//  */
// export const createSignedMessage = async (
//   message: string,
//   privateKeyJwk: string,
//   publicKeyJwk: string
// ): Promise<SignedMessage> => {
//   const signature = await signMessage(message, privateKeyJwk);
  
//   return {
//     message,
//     signature,
//     publicKey: publicKeyJwk,
//   };
// };

// /**
//  * Verify a signed message object
//  */
// export const verifySignedMessage = async (
//   signedMessage: SignedMessage
// ): Promise<boolean> => {
//   return await verifySignature(
//     signedMessage.message,
//     signedMessage.signature,
//     signedMessage.publicKey
//   );
// };

// // ============================================================================
// // ENCRYPTION AND DECRYPTION
// // ============================================================================

// /**
//  * Encrypt a message using a public encryption key
//  */
// export const encryptMessage = async (
//   message: string,
//   publicKeyJwk: string
// ): Promise<EncryptedMessage> => {
//   try {
//     const publicKey = await crypto.subtle.importKey(
//       'jwk',
//       JSON.parse(publicKeyJwk),
//       {
//         name: 'RSA-OAEP',
//         hash: 'SHA-256',
//       },
//       false,
//       ['encrypt']
//     );

//     const messageBuffer = new TextEncoder().encode(message);
//     const encryptedBuffer = await crypto.subtle.encrypt(
//       {
//         name: 'RSA-OAEP',
//       },
//       publicKey,
//       messageBuffer
//     );

//     // For RSA-OAEP, we don't use IV, but we'll keep the structure consistent
//     return {
//       ciphertext: bufferToBase64(encryptedBuffer),
//       iv: '', // Not used for RSA-OAEP
//     };
//   } catch (error) {
//     console.error('Error encrypting message:', error);
//     throw new Error('Failed to encrypt message');
//   }
// };

// /**
//  * Decrypt a message using a private encryption key
//  */
// export const decryptMessage = async (
//   encryptedMessage: EncryptedMessage,
//   privateKeyJwk: string
// ): Promise<string> => {
//   try {
//     const privateKey = await crypto.subtle.importKey(
//       'jwk',
//       JSON.parse(privateKeyJwk),
//       {
//         name: 'RSA-OAEP',
//         hash: 'SHA-256',
//       },
//       false,
//       ['decrypt']
//     );

//     const encryptedBuffer = base64ToBuffer(encryptedMessage.ciphertext);
//     const decryptedBuffer = await crypto.subtle.decrypt(
//       {
//         name: 'RSA-OAEP',
//       },
//       privateKey,
//       encryptedBuffer
//     );

//     return new TextDecoder().decode(decryptedBuffer);
//   } catch (error) {
//     console.error('Error decrypting message:', error);
//     throw new Error('Failed to decrypt message');
//   }
// };

// // ============================================================================
// // SYMMETRIC ENCRYPTION (for large messages)
// // ============================================================================

// /**
//  * Generate a symmetric AES-GCM key for encrypting large messages
//  */
// export const generateSymmetricKey = async (): Promise<CryptoKey> => {
//   return await crypto.subtle.generateKey(
//     {
//       name: 'AES-GCM',
//       length: 256,
//     },
//     true,
//     ['encrypt', 'decrypt']
//   );
// };

// /**
//  * Encrypt a message using AES-GCM (for large messages)
//  */
// export const encryptMessageSymmetric = async (
//   message: string,
//   key: CryptoKey
// ): Promise<EncryptedMessage> => {
//   try {
//     const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for AES-GCM
//     const messageBuffer = new TextEncoder().encode(message);
    
//     const encryptedBuffer = await crypto.subtle.encrypt(
//       {
//         name: 'AES-GCM',
//         iv: iv,
//       },
//       key,
//       messageBuffer
//     );

//     return {
//       ciphertext: bufferToBase64(encryptedBuffer),
//       iv: bufferToBase64(iv.buffer),
//     };
//   } catch (error) {
//     console.error('Error encrypting message with symmetric key:', error);
//     throw new Error('Failed to encrypt message with symmetric key');
//   }
// };

// /**
//  * Decrypt a message using AES-GCM (for large messages)
//  */
// export const decryptMessageSymmetric = async (
//   encryptedMessage: EncryptedMessage,
//   key: CryptoKey
// ): Promise<string> => {
//   try {
//     const iv = base64ToBuffer(encryptedMessage.iv);
//     const encryptedBuffer = base64ToBuffer(encryptedMessage.ciphertext);
    
//     const decryptedBuffer = await crypto.subtle.decrypt(
//       {
//         name: 'AES-GCM',
//         iv: iv,
//       },
//       key,
//       encryptedBuffer
//     );

//     return new TextDecoder().decode(decryptedBuffer);
//   } catch (error) {
//     console.error('Error decrypting message with symmetric key:', error);
//     throw new Error('Failed to decrypt message with symmetric key');
//   }
// };

// /**
//  * Export symmetric key as JWK
//  */
// export const exportSymmetricKey = async (key: CryptoKey): Promise<string> => {
//   const jwk = await crypto.subtle.exportKey('jwk', key);
//   return JSON.stringify(jwk);
// };

// /**
//  * Import symmetric key from JWK
//  */
// export const importSymmetricKey = async (jwkString: string): Promise<CryptoKey> => {
//   const jwk = JSON.parse(jwkString);
//   return await crypto.subtle.importKey(
//     'jwk',
//     jwk,
//     {
//       name: 'AES-GCM',
//       length: 256,
//     },
//     true,
//     ['encrypt', 'decrypt']
//   );
// };

// // ============================================================================
// // HELPER FUNCTIONS
// // ============================================================================

// /**
//  * Convert ArrayBuffer to Base64 string
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
//  * Convert Base64 string to ArrayBuffer
//  */
// const base64ToBuffer = (base64: string): ArrayBuffer => {
//   const binary = atob(base64);
//   const bytes = new Uint8Array(binary.length);
//   for (let i = 0; i < binary.length; i++) {
//     bytes[i] = binary.charCodeAt(i);
//   }
//   return bytes.buffer;
// };

// // ============================================================================
// // UTILITY FUNCTIONS
// // ============================================================================

// /**
//  * Hash a message using SHA-256
//  */
// export const hashMessage = async (message: string): Promise<string> => {
//   const messageBuffer = new TextEncoder().encode(message);
//   const hashBuffer = await crypto.subtle.digest('SHA-256', messageBuffer);
//   return bufferToBase64(hashBuffer);
// };

// /**
//  * Generate a random nonce (number used once) for challenge-response auth
//  */
// export const generateNonce = (): string => {
//   const randomBytes = crypto.getRandomValues(new Uint8Array(32));
//   return bufferToBase64(randomBytes.buffer);
// };

// /**
//  * Create a challenge-response authentication token
//  */
// export const createAuthChallenge = async (
//   challenge: string,
//   privateKeyJwk: string,
//   publicKeyJwk: string
// ): Promise<{
//   challenge: string;
//   signature: string;
//   publicKey: string;
//   timestamp: number;
// }> => {
//   const timestamp = Date.now();
//   const messageToSign = `${challenge}:${timestamp}`;
//   const signature = await signMessage(messageToSign, privateKeyJwk);
  
//   return {
//     challenge,
//     signature,
//     publicKey: publicKeyJwk,
//     timestamp,
//   };
// };

// /**
//  * Verify a challenge-response authentication token
//  */
// export const verifyAuthChallenge = async (
//   challenge: string,
//   signature: string,
//   publicKeyJwk: string,
//   timestamp: number,
//   maxAgeMs: number = 60000 // Default 60 seconds
// ): Promise<boolean> => {
//   // Check if timestamp is not too old
//   const now = Date.now();
//   if (now - timestamp > maxAgeMs) {
//     console.warn('Challenge timestamp is too old');
//     return false;
//   }
  
//   const messageToVerify = `${challenge}:${timestamp}`;
//   return await verifySignature(messageToVerify, signature, publicKeyJwk);
// };

