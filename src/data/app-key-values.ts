// // import { AppInstanceKeyValues } from "~/types/core/app-key-values/app-instance-kv";

// import { useLiveQuery } from "dexie-react-hooks";
// import { bfgDb } from "./bfg-db";
// import { AppInstanceKeyValues } from "~/types/core/app-key-values/app-instance-kv";


// // export const fetchAppKeyValues = async (): Promise<AppInstanceKeyValues> => {
// //   const appKeyValues = await db.appKeyValues.toArray();
// //   return appKeyValues;
// // };


// export const useLiveAppKeyValues = (): AppInstanceKeyValues[] | undefined => {
//   const appKeyValues = useLiveQuery(async () => {
//     return await bfgDb.appKeyValues.toArray();
//   });
  
//   return appKeyValues;
// }
