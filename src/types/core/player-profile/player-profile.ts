import { z } from "zod";


export const NewPlayerProfileParametersSchema = z.object({
  handle: z.string().min(4, "Handle must be at least 4 characters long"),
})

export type NewPlayerProfileParameters = z.infer<typeof NewPlayerProfileParametersSchema>;
