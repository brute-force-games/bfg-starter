// // import { AppInstanceKey, DbkUserHandleKey, DbkUserIdKey, DbkUserProjectDefaultValuesKey } from "../zod-types/schemas/app-key-values";
// // import { DbkUserAppSettingsKey } from "../zod-types/schemas/app-key-values";
// // import { DefaultDbkUserAppSettings, DefaultDbkUserProjectDefaultValues, DefaultDbkUserHandle, DefaultDbkUserId } from "./app-instance-defaults";
// import { GamePlayerId } from "../branded-values/bfg-branded-ids";
// import { BfgPlayerIdKey } from "./app-key-values";


// // type AppInstanceKeyValueData<T extends string | object | Uint8Array> = {
// //   kvKey: AppInstanceKey;
// //   kvDefaultValue: T;
// // };


// // export const AppInstanceDefaultKeyValues: AppInstanceKeyValueData<string | object | Uint8Array>[] = [
// //   {
// //     kvKey: BfgPlayerIdKey,
// //     kvDefaultValue: DefaultBfgPlayerId,
// //   },
// // ] as const;


// export type AppInstanceKeyValues = {
//   [BfgPlayerIdKey]: GamePlayerId;

//   // [DbkUserIdKey]: typeof DefaultDbkUserId;
//   // [DbkUserHandleKey]: typeof DefaultDbkUserHandle;
//   // [DbkUserAppSettingsKey]: typeof DefaultDbkUserAppSettings;
//   // [DbkUserProjectDefaultValuesKey]: typeof DefaultDbkUserProjectDefaultValues;
// };


// // type AppInstanceKeyValuesAutomated = {
// //   [K in AppInstanceKey]: 
// //     Extract<typeof AppInstanceDefaultKeyValues[number], { kvKey: K }>['kvDefaultValue']
// // };

// // type AssertEqual<T, U> = (<V>() => V extends T ? 1 : 2) extends (<V>() => V extends U ? 1 : 2) ? 
// //   true :
// //   false;


// // //@ts-ignore   This is a compile-time check to ensure AppInstanceKeyValues matches AppInstanceKeyValuesAutomated
// // type AutoAssertAppInstanceKeyValuesIsDeclaredNicely = AssertEqual<AppInstanceKeyValues, AppInstanceKeyValuesAutomated> extends true ? true : false;

// // // Add both these lines for runtime checking with an error message
// // const RUNTIME_TYPE_CHECK: AutoAssertAppInstanceKeyValuesIsDeclaredNicely = true;
// // console.log('RUNTIME_TYPE_CHECK', RUNTIME_TYPE_CHECK);
// // if (RUNTIME_TYPE_CHECK !== true){
// //   throw new Error('AppInstanceKeyValues type mismatch detected');
// // }
