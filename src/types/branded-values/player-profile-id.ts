// import { z } from 'zod';

// /**
//  * Branded string type for player profile IDs with prefix
//  */

// export const PlayerProfileIdSchema = z.string().brand('PlayerProfileId');

// export type PlayerProfileId = z.infer<typeof PlayerProfileIdSchema>;

// /**
//  * Create a new player profile ID with the 'profile_' prefix
//  */
// export const createPlayerProfileId = (): PlayerProfileId => {
//   const uuid = crypto.randomUUID();
//   return `profile_${uuid}` as PlayerProfileId;
// };

// /**
//  * Validate if a string is a valid player profile ID
//  */
// export const isPlayerProfileId = (value: string): value is PlayerProfileId => {
//   return value.startsWith('profile_') && value.length > 8; // 'profile_' + at least 1 char
// };

// /**
//  * Parse a string as a player profile ID
//  */
// export const parsePlayerProfileId = (value: string): PlayerProfileId | null => {
//   if (isPlayerProfileId(value)) {
//     return value as PlayerProfileId;
//   }
//   return null;
// };
