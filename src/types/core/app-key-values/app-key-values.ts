import { z } from "zod";
// import { DexieIdSchema } from "../dexie-id";


export const AppValueEncodingEnum = z.enum([
  'jsonObject',
  'string',
  'bytes',
  // 'base64',
]).describe('AppValueEncoding');


export type AppValueEncoding = z.infer<typeof AppValueEncodingEnum>;
export type AppValueEncodingType = typeof AppValueEncodingEnum.enum;



export const BfgPlayerIdKey = 'bfg-player-id' as const;
// export const BfgUserIdKey = 'bfg-user-id' as const;
// export const BfgUserHandleKey = 'bfg-user-handle' as const;
// export const BfgUserAppSettingsKey = 'bfg-user-app-settings' as const;
// export const BfgUserProjectDefaultValuesKey = 'bfg-user-project-default-values' as const;

// export const DexieCloudUserEmailKey = 'dexie-cloud-user-email' as const;


export const AppInstanceKeyEnumSchema = z.enum([
  BfgPlayerIdKey,
  // BfgUserIdKey,
  // BfgUserHandleKey,
  // BfgUserAppSettingsKey,
  // BfgUserProjectDefaultValuesKey,
]);

export type AppInstanceKey = z.infer<typeof AppInstanceKeyEnumSchema>;


export const BfgAppKeyValueSchema = z.object({
  // id: BfgAppKeyValueId.,
  appKey: AppInstanceKeyEnumSchema,
  appEncodedValue: z.union([z.string(), z.instanceof(Uint8Array)]),
  appEncodedTypeDescription: z.string(),
  appValueEncoding: AppValueEncodingEnum,
}).describe('DbkAppKeyValue');

export type BfgAppKeyValue = z.infer<typeof BfgAppKeyValueSchema>;
// export type NewBfgAppKeyValue = Omit<BfgAppKeyValue, 'id'>;
