import { z } from "zod";

const playerIdRegex = /^player_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

/**
 * A globally unique identifier for a game instance
 * Format: 'game_' followed by a UUID v4
 * Example: game_123e4567-e89b-12d3-a456-426614174000
 */
export const PlayerIdSchema = z.string().regex(playerIdRegex).brand('PlayerId');

export type PlayerId = z.infer<typeof PlayerIdSchema>;

export function createPlayerId(): PlayerId {
    const uuid = crypto.randomUUID();
    const playerId = `player_${uuid}`;
    return PlayerIdSchema.parse(playerId);
}

export function isValidPlayerId(id: string): id is PlayerId {
    return /^player_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(id);
}
