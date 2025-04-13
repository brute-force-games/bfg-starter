// import { z } from "zod";
// // import { BfgAppKeyValue } from "~/types/core/app-key-values/app-key-values";



// export const dbkSerializeObjectToJson = <T extends z.ZodType>(schema: T, value: z.infer<T>): string => {

//   const parsed = schema.safeParse(value);
//   if (!parsed.success) {
//     throw new Error(`Schema validation failed for ${value}`);
//   }

//   return JSON.stringify(value);
// };


// export const dbkSerializeObjectToUpdatedAppKv = <T extends z.ZodType>(schema: T, value: z.infer<T>, appKv: BfgAppKeyValue): BfgAppKeyValue => {

//   if (appKv.appValueEncoding !== 'jsonObject') {
//     throw new Error(`Invalid appValue encoding for dbkSerializeObjectToUpdatedAppKv. Expected jsonObject, got ${appKv.appValueEncoding}`);
//   }

//   const parsed = schema.safeParse(value);
//   if (!parsed.success) {
//     console.error(`Failed to validate app kv value for ${appKv.appKey} with schema ${schema._type} using encoding ${appKv.appValueEncoding}`, parsed.error);
//     throw new Error(`Schema validation failed for ${appKv.appKey}`);
//   }

//   const appEncodedValue = JSON.stringify(parsed.data);
//   return {
//     ...appKv,
//     appEncodedValue,
//   };
// };


// export const dbkUpdateStringAppKv = (newValue: string, appKv: BfgAppKeyValue): BfgAppKeyValue => {

//   if (appKv.appValueEncoding !== 'string') {
//     throw new Error(`Invalid appValue encoding for dbkUpdateStringAppKv. Expected string, got ${appKv.appValueEncoding}`);
//   }

//   return {
//     ...appKv,
//     appEncodedValue: newValue,
//   };
// };
