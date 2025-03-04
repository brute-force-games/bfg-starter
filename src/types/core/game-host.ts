import { z } from "zod";
import { BfgPlayerIdSchema } from "./branded-values/bs-player-id";

export const GameHostSchema = z.object({
  id: BfgPlayerIdSchema,
  name: z.string(),
});


export type GameHost = z.infer<typeof GameHostSchema>;
