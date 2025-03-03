import { z } from "zod";
import { DexieCloudEmailSchema } from "~/types/core/branded-values/branded-strings";


// export const DbkUserDexieProgressSchema = z.enum([
//   'no-email',
//   'unverified-email',
//   'verified-logged-out',
//   'verified-logged-in',
// ]);

// export type DbkUserDexieProgress = z.infer<typeof DbkUserDexieProgressSchema>;


export const BfgUserDexieStatusSchema = z.object({
  hasDexieUser: z.boolean(),
  // dexieProgress: DbkUserDexieProgressSchema,
  isLoggedIn: z.boolean(),
  lastLogin: z.date().nullable(),
  // dbkEmailValue: DexieCloudEmailSchema.nullable(),
  dexieEmailValue: DexieCloudEmailSchema.nullable(),
  emailVerified: z.boolean(),
  licenseType: z.any(),
  licenseStatus: z.any(),
});

export type BfgUserDexieStatus = z.infer<typeof BfgUserDexieStatusSchema>;
