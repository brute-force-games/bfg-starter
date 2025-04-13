// import { z } from "zod";

// const playerIdRegex = /^player_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

// /**
//  * A globally unique identifier for a player
//  * Format: 'player_' followed by a UUID v4
//  * Example: player_123e4567-e89b-12d3-a456-426614174000
//  */
// export const BfgPlayerIdSchema = z.string().regex(playerIdRegex).brand('BfgPlayerId');

// export type BfgPlayerId = z.infer<typeof BfgPlayerIdSchema>;

// export function createPlayerId(): BfgPlayerId {
//     const uuid = crypto.randomUUID();
//     const playerId = `player_${uuid}`;
//     return BfgPlayerIdSchema.parse(playerId);
// }

// export function isValidPlayerId(id: string): id is BfgPlayerId {
//     return /^player_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(id);
// }
