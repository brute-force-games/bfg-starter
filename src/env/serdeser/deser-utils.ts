// import { BfgAppKeyValue } from "~/types/core/app-key-values/app-key-values";
// import { z } from "zod";

// export const SAVE_VERSION_ID_1 = "1";


// export const bfgAppParseKvObject = <T extends z.ZodType>(schema: T, appKv: BfgAppKeyValue): z.infer<T> => {

//   if (appKv.appValueEncoding === 'jsonObject') {
//     if (typeof appKv.appEncodedValue !== 'string') {
//       throw new Error(`Invalid appValue type for jsonObject encoding. Expected string (serialized JSON), got ${typeof appKv.appEncodedValue}`);
//     }

//     const parsedJson = JSON.parse(appKv.appEncodedValue);
//     console.log('parsedJson', parsedJson);
//     const parsed = schema.safeParse(parsedJson);
//     console.log('parsed', parsed);
//     if (!parsed.success) {
//       console.log('parsed.error', parsed.error);
//       console.error(`Failed to parse app kv value for ${appKv.appKey} with schema ${schema.description} using encoding ${appKv.appValueEncoding}`, parsed.error);
//       console.error("App kv value:", appKv.appEncodedValue);
//       throw new Error(`Failed to parse app kv value for ${appKv.appKey} with schema ${schema.description} using encoding ${appKv.appValueEncoding}`);
//     }
    
//     return parsed.data;
//   }

//   throw new Error(`Unsupported app kv value encoding for dbkAppKvParseObject: ${appKv.appValueEncoding}`);
// };


// export const bfgAppKvParseString = (appKv: BfgAppKeyValue): string => {

//   if (appKv.appValueEncoding === 'string') {
//     if (typeof appKv.appEncodedValue !== 'string') {
//       throw new Error(`Invalid appValue type for string encoding. Expected string, got ${typeof appKv.appEncodedValue}`);
//     }
//     return appKv.appEncodedValue;
//   }

//   throw new Error(`Unsupported app kv value encoding for bfgAppKvParseString: ${appKv.appValueEncoding}`);
// };
