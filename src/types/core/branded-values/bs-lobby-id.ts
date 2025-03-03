import { z } from "zod";


/**
 * A globally unique identifier for a lobby instance
 * Format: 'lobby_' followed by a UUID v4
 * Example: lobby_123e4567-e89b-12d3-a456-426614174000
 */
export const LobbyIdSchema = z.string().brand('LobbyId');

export type LobbyId = z.infer<typeof LobbyIdSchema>;

export const createLobbyId = (tbId: string): LobbyId => {
  return tbId as LobbyId;
    // const uuid = crypto.randomUUID();
    // const lobbyId = `lobby_${uuid}`;
    // return LobbyIdSchema.parse(lobbyId);
}

export const isValidLobbyId = (id: string): id is LobbyId => {
    return /^lobby_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(id);
}
