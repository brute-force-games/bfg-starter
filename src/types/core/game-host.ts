import { z } from "zod";
import { PlayerIdSchema } from "./branded-values/bs-player-id";

export const GameHostSchema = z.object({
  id: PlayerIdSchema,
  name: z.string(),
});


export type GameHost = z.infer<typeof GameHostSchema>;