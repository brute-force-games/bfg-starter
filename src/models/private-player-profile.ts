import { z } from 'zod';
import { PublicPlayerProfileSchema, PublicPlayerProfile } from './public-player-profile';

/**
 * Private player profile - extends public profile with sensitive data stored client-side only
 * This includes the private key for signing moves
 */
export const PrivatePlayerProfileSchema = PublicPlayerProfileSchema.extend({
  // Private key for signing moves (public key is already in the base profile)
  privateKey: z.string(),
});

export type PrivatePlayerProfile = z.infer<typeof PrivatePlayerProfileSchema>;

/**
 * Convert a private player profile to a public one (removes private key and sensitive data)
 */
export const privateToPublicProfile = (privateProfile: PrivatePlayerProfile): PublicPlayerProfile => {
  return {
    id: privateProfile.id,
    handle: privateProfile.handle,
    avatarImageUrl: privateProfile.avatarImageUrl,
    publicKey: privateProfile.publicKey,
    createdAt: privateProfile.createdAt,
    updatedAt: privateProfile.updatedAt,
  };
};

/**
 * Create a new private player profile with generated keys
 */
export const createPrivatePlayerProfile = async (
  handle: string,
  avatarImageUrl?: string
): Promise<Omit<PrivatePlayerProfile, 'id' | 'createdAt' | 'updatedAt'>> => {
  // Import the crypto utils dynamically to avoid circular dependencies
  const { generateKeyPair } = await import('~/crypto/crypto-utils');
  
  const keyPair = await generateKeyPair();
  
  return {
    handle,
    avatarImageUrl,
    publicKey: keyPair.publicKey, // Store public key directly in profile
    privateKey: keyPair.privateKey, // Store only the private key
  };
};
