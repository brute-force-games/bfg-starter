import { z } from 'zod';


export const GameMoveIndexSchema = z.number()
  .int()
  .nonnegative()
  .brand('GameMoveIndex');

export type GameMoveIndex = z.infer<typeof GameMoveIndexSchema>;

export const createGameMoveIndex = (index: number): GameMoveIndex => {
  const parsed = GameMoveIndexSchema.parse(index);
  return parsed;
};

export const isGameMoveIndex = (value: unknown): value is GameMoveIndex => {
  return GameMoveIndexSchema.safeParse(value).success;
}; 