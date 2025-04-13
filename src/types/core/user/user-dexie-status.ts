import { z } from "zod";
import { DexieCloudEmailSchema } from "~/types/core/branded-values/branded-strings";


export const BfgUserDexieStatusSchema = z.object({
  hasDexieUser: z.boolean(),
  isLoggedIn: z.boolean(),
  lastLogin: z.date().nullable(),
  dexieEmailValue: DexieCloudEmailSchema.nullable(),
  emailVerified: z.boolean(),
  licenseType: z.any(),
  licenseStatus: z.any(),
});

export type BfgUserDexieStatus = z.infer<typeof BfgUserDexieStatusSchema>;
