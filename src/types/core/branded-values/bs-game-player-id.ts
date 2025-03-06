// import { z } from "zod";

// const gamePlayerIdRegex = /^game_player_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

// /**
//  * A globally unique identifier for a player in a game instance
//  * Format: 'game_player_' followed by a UUID v4
//  * Example: game_player_123e4567-e89b-12d3-a456-426614174000
//  */
// export const GamePlayerIdSchema = z.string().regex(gamePlayerIdRegex).brand('GamePlayerId');

// export type GamePlayerId = z.infer<typeof GamePlayerIdSchema>;

// export const createGamePlayerId = (): GamePlayerId => {
//     const uuid = crypto.randomUUID();
//     const gamePlayerId = `game_player_${uuid}`;
//     return GamePlayerIdSchema.parse(gamePlayerId);
// }

// export const isValidGamePlayerId = (id: string): id is GamePlayerId => {
//     return /^game_player_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(id);
// }
