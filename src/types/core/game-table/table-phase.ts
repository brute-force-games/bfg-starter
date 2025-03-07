import { z } from "zod";


export const TablePhaseEnumSchema = z.enum([
  "table-phase-lobby",
  "table-phase-game-in-progress",
  "table-phase-game-complete-with-winners",
  "table-phase-game-complete-with-draw",
  "table-phase-game-abandoned",
  "table-phase-error",
]);

export type TablePhase = z.infer<typeof TablePhaseEnumSchema>;

// export const GameTableActionResultSchema = z.object({
//   tablePhase: TablePhaseEnumSchema,
// });

// export type GameTableActionResult = z.infer<typeof GameTableActionResultSchema>;

export type GameTableActionResult<T> = {
  tablePhase: TablePhase;
  gameState: T
}