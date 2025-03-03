// import { getUniqueId } from "tinybase/common";
// import { z } from "zod";


// export const TinybaseIdSchema = z.string().brand('TinybaseId');

// export type TinybaseId = z.infer<typeof TinybaseIdSchema>;

// export const createTinybaseId = (tinybaseId: string): TinybaseId => {
//   return tinybaseId as TinybaseId;
// }

// export const createNewTinybaseId = (): TinybaseId => {
//   const tinybaseId = getUniqueId();
//   const retVal = createTinybaseId(tinybaseId);
//   return retVal;
// }