import { z } from "zod";
// import { DbkUserProjectDefaultValuesSchema } from "../user-project-default-values";
// import { DbkUserHandleSchema, DbkUserIdSchema } from "~/data/zod-types/branded-types/branded-strings";
import { BfgUserDexieStatusSchema } from "./user-dexie-status";



// export const DbkUserIdentitySchemaProfileV1Schema = z.object({
//   dbkUserHandle: DbkUserHandleSchema,
// }).describe('DbkUserIdentityProfileV1');

// export type DbkUserIdentityProfileV1 = z.infer<typeof DbkUserIdentitySchemaProfileV1Schema>;


// export const DbkUserProfileUserProfileV1Schema = z.object({
//   projectDefaultValues: DbkUserProjectDefaultValuesSchema,
// }).describe('DbkUserProfileUserProfileV1');

// export type DbkUserProfileUserProfileV1 = z.infer<typeof DbkUserProfileUserProfileV1Schema>;


// const getCurrentDbkUserId = () => {
//   return 'dkb-user-not-set';
// }


export const BfgUserCompositeIdentitySchema = z.object({
  // dbkUserId: DbkUserIdSchema.default(() => getCurrentDbkUserId()),
  // dbkUserHandle: DbkUserHandleSchema,
  dexieStatus: BfgUserDexieStatusSchema,
}).describe('BfgUserCompositeIdentity');

export type BfgUserCompositeIdentity = z.infer<typeof BfgUserCompositeIdentitySchema>;
