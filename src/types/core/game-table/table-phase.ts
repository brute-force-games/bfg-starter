import { z } from "zod";


export const TablePhaseEnumSchema = z.enum([
  "table-phase-lobby",
  "table-phase-game-in-progress",
  "table-phase-game-complete",
  "table-status-game-abandoned",
]);
