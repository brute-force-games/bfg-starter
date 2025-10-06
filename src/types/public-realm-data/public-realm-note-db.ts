// import { z } from "zod";
// import { PublicRealmNote, PublicRealmNoteSchema } from "./public-realm-note";
// import { BfgPublicRealmNoteId, BfgDexieRealmId } from "../core/branded-values/bfg-branded-ids";


// export type NewPublicRealmNote = PublicRealmNote;


// // export type DbPublicRealmNote = NewPublicRealmNote & {
// //   id?: DbPublicRealmNoteId;
// // }

// export const DbPublicRealmNoteSchema = PublicRealmNoteSchema.extend({
//   id: BfgPublicRealmNoteId.idSchema,

//   createdAt: z.date(),
//   updatedAt: z.date(),
  
//   owner: z.string().optional(),
//   realmId: BfgDexieRealmId.idSchema.optional(),
// })

// export type DbPublicRealmNote = z.infer<typeof DbPublicRealmNoteSchema>;
