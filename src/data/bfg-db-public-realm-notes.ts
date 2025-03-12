// import { useLiveQuery } from "dexie-react-hooks";
// import { bfgDb } from "./bfg-db";
// import { DbPublicRealmNote, NewPublicRealmNote } from "~/types/public-realm-data/public-realm-note-db";
// import { BfgPublicRealmNoteId, PublicRealmNoteId } from "~/types/core/branded-values/bfg-branded-ids";
// import { DbPublicRealmNoteId } from "~/types/core/branded-values/branded-strings";


// export const DEXIE_PUBLIC_REALM_ID = "rlm-public" as unknown as DbPublicRealmNoteId;


// export const useLivePublicRealmNotes = (): DbPublicRealmNote[] | undefined => {
//   const publicRealmNotes = useLiveQuery(async () => {
//     return await bfgDb.publicRealmNotes.toArray();
//   })

//   return publicRealmNotes;
// }


// export const useLivePublicRealmNote = (noteId?: PublicRealmNoteId): DbPublicRealmNote | undefined => {
//   const note = useLiveQuery(async () => {
//     if (!noteId) {
//       return undefined;
//     }
//     return await bfgDb.publicRealmNotes.get(noteId);
//   }, [noteId])

//   return note;
// }


// export const addNewPublicRealmNote = async (noteParameters: NewPublicRealmNote) => {

//   const newNoteId = BfgPublicRealmNoteId.createId();

//   const newNote: DbPublicRealmNote = {
//     ...noteParameters,
//     id: newNoteId,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   }

//   const added = await bfgDb.publicRealmNotes.add(newNote);

//   const storedNote = await bfgDb.publicRealmNotes.get(newNoteId);

//   console.log("DB: public realm note added", storedNote);
// }


// export const publicizePublicRealmNote =  async (noteId: DbPublicRealmNoteId) => {
//   const note = await bfgDb.publicRealmNotes.get(noteId);
//   if (!note) {
//     return;
//   }

//   const updatedNote = {
//     ...note,
//     realmId: DEXIE_PUBLIC_REALM_ID,
//   }
//   console.log("UPDAINT NOTE", updatedNote);

//   await bfgDb.publicRealmNotes.update(note, {
//     owner: "rlm-public",
//     realmId: DEXIE_PUBLIC_REALM_ID,
//   });

//   const storedNote = await bfgDb.publicRealmNotes.get(noteId);

//   console.log("DB: public realm note updated", storedNote);

//   return storedNote;
// }


// export const revokePublicRealmNote = async (noteId: DbPublicRealmNoteId) => {
//   const note = await bfgDb.publicRealmNotes.get(noteId);
//   if (!note) {
//     return;
//   }

//   await bfgDb.publicRealmNotes.update(note, {
//     realmId: undefined,
//   });
// }
