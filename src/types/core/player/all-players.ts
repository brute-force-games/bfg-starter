import { z } from "zod";


export const createAllPlayersSchema = (schema: z.ZodType) => {
  return z.object({
    p1: schema.optional(),
    p2: schema.optional(),
    p3: schema.optional(),
    p4: schema.optional(),
    p5: schema.optional(),
    p6: schema.optional(),
  });
}