import { z } from "zod";


// export const JsonValueContainerSchema = z.object({
//   jsonValue: z.any(),
// });

export const createJsonValueContainerSchema = <T>(schema: z.ZodType<T>) => {
  return z.object({
    jsonValue: schema,
  });
}

export type JsonValueContainer<T> = z.infer<ReturnType<typeof createJsonValueContainerSchema<T>>>;



// export const createAllPlayersSchema = <T>(schema: z.ZodType<T>) => {
//   return z.object({
//     p1: schema.nullable(),
//     p2: schema.nullable(),
//     p3: schema.nullable(),
//     p4: schema.nullable(),
//     p5: schema.nullable(),
//     p6: schema.nullable(),
//   });
// }


// export type JsonValueContainer<T> = z.infer<typeof JsonValueContainerSchema<T>>;

// export type JsonValueContainer<T> = {
//   jsonValue: T;
// }