import { z } from "zod";


/**
 * A globally unique identifier for a game instance
 * Format: 'game_' followed by a UUID v4
 * Example: game_123e4567-e89b-12d3-a456-426614174000
 */
export const GameIdSchema = z.string().brand('GameId');

export type GameId = z.infer<typeof GameIdSchema>;

export const createGameId = (tbId: string): GameId => {
    return tbId as GameId;
    // const uuid = crypto.randomUUID();
    // const gameId = `game_${uuid}`;
    // return GameIdSchema.parse(gameId);
}

export const isValidGameId = (id: string): id is GameId => {
    return /^game_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(id);
}
