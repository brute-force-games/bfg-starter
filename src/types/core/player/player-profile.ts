import { z } from "zod";


export const PlayerProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});


export type PlayerProfile = z.infer<typeof PlayerProfileSchema>;
