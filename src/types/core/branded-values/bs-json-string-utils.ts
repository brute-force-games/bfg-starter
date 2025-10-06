import { z } from "zod";


export const createBrandedJsonSchema = <U extends z.SomeZodObject>(
  schema: U
): z.ZodBranded<z.ZodString, string> => {
  const retVal = z.string().brand(schema.description + 'Json');
  return retVal;
}


export const createBrandedJson = <T>(state: T, schema: z.ZodSchema<T>): z.infer<typeof schema> => {
  const json = JSON.stringify(state);
  const parseResult = schema.safeParse(json);
  if (!parseResult.success) {
    throw new Error(`Failed to parse JSON: ${parseResult.error}`);
  }
  return parseResult.data as z.infer<typeof schema>;
}
