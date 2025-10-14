// import { walletManager } from './wallet-manager';
// import { 
//   KeyPurpose, 
//   IdentityKey, 
//   LobbyKey, 
//   GameKey, 
//   SigningKey,
//   WalletKey 
// } from './wallet-key-types';

// /**
//  * Utility functions for deriving specific keys for different purposes
//  */

// /**
//  * Derive a unique key for a specific lobby
//  * Uses the lobby ID to generate a deterministic key index
//  */
// export async function deriveLobbyKey(lobbyId: string): Promise<LobbyKey> {
//   // Convert lobby ID to a numeric key index using a simple hash
//   const keyIndex = hashStringToNumber(lobbyId);
//   return await walletManager.getLobbyKey(keyIndex);
// }

// /**
//  * Derive a unique key for a specific game
//  * Uses the game ID to generate a deterministic key index
//  */
// export async function deriveGameKey(gameId: string): Promise<GameKey> {
//   // Convert game ID to a numeric key index using a simple hash
//   const keyIndex = hashStringToNumber(gameId);
//   return await walletManager.getGameKey(keyIndex);
// }

// /**
//  * Derive a unique signing key for a specific game table
//  * Uses the table ID to generate a deterministic key index
//  */
// export async function deriveTableSigningKey(tableId: string): Promise<SigningKey> {
//   // Convert table ID to a numeric key index using a simple hash
//   const keyIndex = hashStringToNumber(tableId);
//   return await walletManager.getSigningKey(keyIndex);
// }

// /**
//  * Derive multiple lobby keys for a user
//  * Useful for managing multiple lobbies
//  */
// export async function deriveMultipleLobbyKeys(count: number): Promise<LobbyKey[]> {
//   const walletKeys = await walletManager.getMultipleKeys(KeyPurpose.LOBBY, count);
//   return walletKeys.map(key => new LobbyKey(key));
// }

// /**
//  * Derive multiple game keys for a user
//  * Useful for managing multiple games
//  */
// export async function deriveMultipleGameKeys(count: number): Promise<GameKey[]> {
//   const walletKeys = await walletManager.getMultipleKeys(KeyPurpose.GAME, count);
//   return walletKeys.map(key => new GameKey(key));
// }

// /**
//  * Derive multiple signing keys for a user
//  * Useful for signing moves in multiple games
//  */
// export async function deriveMultipleSigningKeys(count: number): Promise<SigningKey[]> {
//   const walletKeys = await walletManager.getMultipleKeys(KeyPurpose.SIGNING, count);
//   return walletKeys.map(key => new SigningKey(key));
// }

// /**
//  * Get the primary identity key for a user
//  * This is the main key used for user authentication
//  */
// export async function getPrimaryIdentityKey(): Promise<IdentityKey> {
//   return await walletManager.getIdentityKey(0);
// }

// /**
//  * Get a secondary identity key for a user
//  * Useful for creating multiple identities or personas
//  */
// export async function getSecondaryIdentityKey(index: number): Promise<IdentityKey> {
//   return await walletManager.getIdentityKey(index);
// }

// /**
//  * Derive a key for a specific purpose and identifier
//  * Generic function that can be used for any purpose
//  */
// export async function deriveKeyForIdentifier(
//   purpose: KeyPurpose, 
//   identifier: string
// ): Promise<WalletKey> {
//   const keyIndex = hashStringToNumber(identifier);
//   return await walletManager.deriveKey({ purpose, keyIndex });
// }

// /**
//  * Get all keys for a specific purpose up to a certain count
//  * Useful for getting all available keys of a certain type
//  */
// export async function getAllKeysForPurpose(
//   purpose: KeyPurpose, 
//   maxCount: number = 10
// ): Promise<WalletKey[]> {
//   return await walletManager.getMultipleKeys(purpose, maxCount);
// }

// /**
//  * Simple hash function to convert a string to a number
//  * Used for deterministic key derivation from IDs
//  */
// function hashStringToNumber(str: string): number {
//   let hash = 0;
//   for (let i = 0; i < str.length; i++) {
//     const char = str.charCodeAt(i);
//     hash = ((hash << 5) - hash) + char;
//     hash = hash & hash; // Convert to 32-bit integer
//   }
//   return Math.abs(hash) % 1000000; // Limit to reasonable range
// }

// /**
//  * Key derivation context for different game scenarios
//  */
// export class KeyDerivationContext {
//   private static instance: KeyDerivationContext;
  
//   private constructor() {}
  
//   static getInstance(): KeyDerivationContext {
//     if (!KeyDerivationContext.instance) {
//       KeyDerivationContext.instance = new KeyDerivationContext();
//     }
//     return KeyDerivationContext.instance;
//   }

//   /**
//    * Get keys for hosting a lobby
//    */
//   async getLobbyHostKeys(lobbyId: string): Promise<{
//     identity: IdentityKey;
//     lobby: LobbyKey;
//     signing: SigningKey;
//   }> {
//     const [identity, lobby, signing] = await Promise.all([
//       getPrimaryIdentityKey(),
//       deriveLobbyKey(lobbyId),
//       deriveTableSigningKey(lobbyId)
//     ]);

//     return { identity, lobby, signing };
//   }

//   /**
//    * Get keys for joining a game
//    */
//   async getGamePlayerKeys(gameId: string): Promise<{
//     identity: IdentityKey;
//     game: GameKey;
//     signing: SigningKey;
//   }> {
//     const [identity, game, signing] = await Promise.all([
//       getPrimaryIdentityKey(),
//       deriveGameKey(gameId),
//       deriveTableSigningKey(gameId)
//     ]);

//     return { identity, game, signing };
//   }

//   /**
//    * Get keys for creating a new game table
//    */
//   async getGameTableKeys(tableId: string): Promise<{
//     identity: IdentityKey;
//     game: GameKey;
//     signing: SigningKey;
//   }> {
//     return await this.getGamePlayerKeys(tableId);
//   }

//   /**
//    * Get keys for managing a gaming group
//    */
//   async getGamingGroupKeys(groupId: string): Promise<{
//     identity: IdentityKey;
//     signing: SigningKey;
//   }> {
//     const [identity, signing] = await Promise.all([
//       getPrimaryIdentityKey(),
//       deriveTableSigningKey(groupId)
//     ]);

//     return { identity, signing };
//   }
// }

// /**
//  * Export singleton instance
//  */
// export const keyDerivationContext = KeyDerivationContext.getInstance();
