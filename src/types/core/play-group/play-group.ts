import { z } from "zod";
import { BfgBasicIdentityDataSchema } from "../user/user-identity";

export const GamingGroupSchema = z.object({
  name: z.string().min(4, "Group name must be at least 4 characters long"),
  memberIdentities: z.array(BfgBasicIdentityDataSchema),
})

export type GamingGroup = z.infer<typeof GamingGroupSchema>;


export const NewGamingGroupParametersSchema = GamingGroupSchema.extend({})

export type NewGamingGroupParameters = z.infer<typeof NewGamingGroupParametersSchema>;
