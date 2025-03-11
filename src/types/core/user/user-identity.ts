import { z } from "zod";
import { BfgUserDexieStatusSchema } from "./user-dexie-status";
import { DexieCloudEmailSchema } from "../branded-values/branded-strings";


export const BfgDexieUserIdentitySchema = z.object({
  dexieEmailValue: DexieCloudEmailSchema,
}).describe('BfgDexieUserIdentity');

export type BfgDexieUserIdentity = z.infer<typeof BfgDexieUserIdentitySchema>;


export const BfgUserCompositeIdentitySchema = z.object({
  dexieUserIdentity: BfgDexieUserIdentitySchema,
  dexieStatus: BfgUserDexieStatusSchema,
}).describe('BfgUserCompositeIdentity');

export type BfgUserCompositeIdentity = z.infer<typeof BfgUserCompositeIdentitySchema>;


export const BfgBasicIdentityDataSchema = z.object({
  dexieIdentity: BfgDexieUserIdentitySchema,
}).describe('BfgBasicIdentityData');

export type BfgBasicIdentityData = z.infer<typeof BfgBasicIdentityDataSchema>;

