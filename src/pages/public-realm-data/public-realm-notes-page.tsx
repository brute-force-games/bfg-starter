// import { Button } from "@mui/material";
// import { DataPage } from "~/components/data-page/data-page";
// import { CenteredHorizontalContainerDiv } from "~/components/special-divs";
// import { bfgDb } from "~/data/bfg-db";
// import { addNewPublicRealmNote, DEXIE_PUBLIC_REALM_ID, publicizePublicRealmNote, revokePublicRealmNote, useLivePublicRealmNotes } from "~/data/bfg-db-public-realm-notes";
// import { AddPublicRealmDataDialog } from "~/dialogs/add-public-realm-data-dialog";
// import { DbPublicRealmNote, NewPublicRealmNote } from "~/types/public-realm-data/public-realm-note-db";


// export const PublicRealmNotesPage = () => {

//   const publicRealmNotes = useLivePublicRealmNotes();

//   console.log("PUBLIC REALM NOTES", publicRealmNotes);


//   const showRealms = async () => {
//     const allRealms = await bfgDb.realms.toArray();
//     console.log("PUBLIC RELAM?", allRealms);
//   }


//   const PublicRealmNoteComponent = ({ note }: { note: DbPublicRealmNote }) => {

//     return (
//       <CenteredHorizontalContainerDiv>
//         <div>{note?.text} [{note?.realmId}]</div>
//         <div>{note?.createdAt.toLocaleString()}</div>
//         <Button
//           variant="outlined" color="primary" 
//           disabled={note.realmId === DEXIE_PUBLIC_REALM_ID}
//           onClick={() => { publicizePublicRealmNote(note.id); }}
//         >
//           Publicize
//         </Button>
//         <Button
//           variant="outlined" color="secondary"
//           disabled={note.realmId !== DEXIE_PUBLIC_REALM_ID}
//           onClick={() => { revokePublicRealmNote(note.id); }}
//         >
//           Revoke
//         </Button>
//       </CenteredHorizontalContainerDiv>
//     );
//   }

//   const allDetailsComponents = publicRealmNotes?.map((note) => (
//     <PublicRealmNoteComponent
//       key={note.id}
//       note={note}
//     />
//   ));

//   const onNewDataItemCreated = async (newNote: NewPublicRealmNote) => {
//     await addNewPublicRealmNote(newNote);
//   }

//   const onDeleteAllData = async () => {
//     await bfgDb.publicRealmNotes.clear();
//   }


//   return (
//     <>
//       <Button onClick={showRealms}>
//         LOG ALL REALMS
//       </Button>
//       <DataPage<NewPublicRealmNote, DbPublicRealmNote>
//         itemName="Public Realm Notes"
//         allDataItems={publicRealmNotes ?? []}
//         allDataComponents={allDetailsComponents}
//         addNewDialogComponent={AddPublicRealmDataDialog}
//         onNewDataItemCreated={onNewDataItemCreated}
//         onDeleteAllData={onDeleteAllData}
//       />
//     </>
//   )
// };
