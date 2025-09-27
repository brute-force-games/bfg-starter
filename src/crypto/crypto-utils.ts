import { z } from 'zod';

/**
 * Cryptographic utilities for player profiles and move signing
 */

export interface CryptoKeyPair {
  publicKey: string;  // PEM formatted public key
  privateKey: string; // PEM formatted private key
}

export interface SignedMove {
  move: string;       // JSON stringified move data
  signature: string;  // Base64 encoded signature
  publicKey: string;  // PEM formatted public key for verification
}

/**
 * Generate a new RSA key pair for a player profile
 */
export const generateKeyPair = async (): Promise<CryptoKeyPair> => {
  try {
    // Generate key pair using Web Crypto API
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'RSASSA-PKCS1-v1_5',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256',
      },
      true, // extractable
      ['sign', 'verify']
    );

    // Export public key
    const publicKeyBuffer = await crypto.subtle.exportKey('spki', keyPair.publicKey);
    const publicKeyPem = bufferToPem(publicKeyBuffer, 'PUBLIC KEY');

    // Export private key
    const privateKeyBuffer = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
    const privateKeyPem = bufferToPem(privateKeyBuffer, 'PRIVATE KEY');

    return {
      publicKey: publicKeyPem,
      privateKey: privateKeyPem,
    };
  } catch (error) {
    console.error('Error generating key pair:', error);
    throw new Error('Failed to generate cryptographic key pair');
  }
};

/**
 * Sign a move with a private key
 */
export const signMove = async (
  moveData: any,
  privateKeyPem: string
): Promise<string> => {
  try {
    // Convert PEM to CryptoKey
    const privateKey = await pemToCryptoKey(privateKeyPem, 'private');

    // Stringify move data for signing
    const moveString = JSON.stringify(moveData);
    const moveBuffer = new TextEncoder().encode(moveString);

    // Sign the move
    const signatureBuffer = await crypto.subtle.sign(
      'RSASSA-PKCS1-v1_5',
      privateKey,
      moveBuffer
    );

    // Convert to base64
    return bufferToBase64(signatureBuffer);
  } catch (error) {
    console.error('Error signing move:', error);
    throw new Error('Failed to sign move');
  }
};

/**
 * Verify a signed move
 */
export const verifyMove = async (
  moveData: any,
  signature: string,
  publicKeyPem: string
): Promise<boolean> => {
  try {
    // Convert PEM to CryptoKey
    const publicKey = await pemToCryptoKey(publicKeyPem, 'public');

    // Stringify move data for verification
    const moveString = JSON.stringify(moveData);
    const moveBuffer = new TextEncoder().encode(moveString);

    // Convert signature from base64
    const signatureBuffer = base64ToBuffer(signature);

    // Verify the signature
    return await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      publicKey,
      signatureBuffer,
      moveBuffer
    );
  } catch (error) {
    console.error('Error verifying move:', error);
    return false;
  }
};

/**
 * Create a signed move object
 */
export const createSignedMove = async (
  moveData: any,
  privateKeyPem: string,
  publicKeyPem: string
): Promise<SignedMove> => {
  const signature = await signMove(moveData, privateKeyPem);
  
  return {
    move: JSON.stringify(moveData),
    signature,
    publicKey: publicKeyPem,
  };
};

/**
 * Verify a signed move object
 */
export const verifySignedMove = async (signedMove: SignedMove): Promise<boolean> => {
  try {
    const moveData = JSON.parse(signedMove.move);
    return await verifyMove(moveData, signedMove.signature, signedMove.publicKey);
  } catch (error) {
    console.error('Error verifying signed move:', error);
    return false;
  }
};

// Helper functions

/**
 * Convert buffer to PEM format
 */
const bufferToPem = (buffer: ArrayBuffer, type: string): string => {
  const base64 = bufferToBase64(buffer);
  return `-----BEGIN ${type}-----\n${base64.match(/.{1,64}/g)?.join('\n')}\n-----END ${type}-----`;
};

/**
 * Convert buffer to base64 string
 */
const bufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

/**
 * Convert base64 string to buffer
 */
const base64ToBuffer = (base64: string): ArrayBuffer => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

/**
 * Convert PEM string to CryptoKey
 */
const pemToCryptoKey = async (pem: string, type: 'public' | 'private'): Promise<CryptoKey> => {
  // Remove PEM headers and newlines
  const pemContents = pem
    .replace(/-----BEGIN (PUBLIC|PRIVATE) KEY-----/, '')
    .replace(/-----END (PUBLIC|PRIVATE) KEY-----/, '')
    .replace(/\s/g, '');

  // Convert base64 to buffer
  const buffer = base64ToBuffer(pemContents);

  // Import key
  if (type === 'public') {
    return await crypto.subtle.importKey(
      'spki',
      buffer,
      {
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256',
      },
      false,
      ['verify']
    );
  } else {
    return await crypto.subtle.importKey(
      'pkcs8',
      buffer,
      {
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256',
      },
      false,
      ['sign']
    );
  }
};

// Zod schemas for validation

export const CryptoKeyPairSchema = z.object({
  publicKey: z.string().min(1),
  privateKey: z.string().min(1),
});

export const SignedMoveSchema = z.object({
  move: z.string(),
  signature: z.string(),
  publicKey: z.string(),
});

export type CryptoKeyPairType = z.infer<typeof CryptoKeyPairSchema>;
export type SignedMoveType = z.infer<typeof SignedMoveSchema>;
