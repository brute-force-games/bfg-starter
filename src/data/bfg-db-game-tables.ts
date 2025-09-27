// import { useLiveQuery } from "dexie-react-hooks"
// import { bfgDb } from "./bfg-db";
// import { DbGameFriendId, DbGameTableId, DbPlayerProfileId } from "~/types/core/branded-values/branded-strings";
// import { DbGameTable, GameTableSeat, NewGameTable } from "~/types/core/game-table/game-table";
// import { DbGameTableAction } from "~/types/core/game-table/game-table-action";
// import { initializeGameTable } from "./dexie-data-ops/initialize-game-table";


// export const useLiveGameTables = (): DbGameTable[] | undefined => {
//   const gameTables = useLiveQuery(async () => {
//     return await bfgDb.gameTables.toArray();
//   })

//   return gameTables;
// }


// export const useLiveGameTable = (tableId?: DbGameTableId): DbGameTable | undefined => {
//   const table = useLiveQuery(async () => {
//     if (!tableId) {
//       return undefined;
//     }
//     return await bfgDb.gameTables.get(tableId);
//   }, [tableId])

//   return table;
// }



// export const useLiveGameTableActions = (tableId?: DbGameTableId): DbGameTableAction[] | undefined => {
//   const actions = useLiveQuery(async () => {
//     if (!tableId) {
//       return undefined;
//     }

//     console.log("DB: useLiveGameTableActions ACTIVE", tableId);

//     // return await bfgDb.gameTableActions.where('gameTableId').equals(tableId).toArray();

//     const allActions = await bfgDb.gameTableActions.toArray();
//     const allActionsForTable = allActions.filter((action) => action.gameTableId === tableId);
//     return allActionsForTable;
    
//   }, [tableId, bfgDb.gameTableActions])

//   return actions;
// }


// export const deleteAllPlayerGameTables = async (playerId: DbPlayerProfileId) => {

//   await bfgDb.gameTables
//     .where('gameHostPlayerId')
//     .equals(playerId)
//     .delete();
// } 


// export const deleteAllGameTables = async () => {
//   await bfgDb.gameTables.clear();
// } 


// export const shareGameTableWithFriends = async (tableId: DbGameTableId, invitationText: string, friendIds: DbGameFriendId[]) => {

//   console.log("DB: shareGameTableWithFriends", tableId, friendIds);

//   // Do a sync-consistent transaction that moves the space and its cards into a new realm
//   // See http://dexie.org/cloud/docs/consistency
//   return bfgDb.transaction(
//     'rw',
//     [bfgDb.gameTables, bfgDb.myFriends, bfgDb.realms, bfgDb.members],
//     async () => {

//       const gameTable = await bfgDb.gameTables.get(tableId);

//       console.log("DB: shareGameTableWithFriends in transaction", tableId, gameTable);
//       const friends = await bfgDb.myFriends.where('id').anyOf(friendIds).toArray();

//       console.log("DB: shareGameTableWithFriends in transaction - 2", tableId, friends);

//       if (!gameTable) {
//         throw new Error("Table not found");
//       }

//       const realmId = gameTable.realmId;

//       if (!realmId) {
//         throw new Error("Realm not found");
//       }

//       // // Add or update a realm, tied to the lobby using getTiedRealmId():
//       // const realmId = getTiedRealmId(tableId)

//       // // Create a realm for the shared game table. Use put to not fail if it already exists.
//       // // (Sync consistency)
//       // bfgDb.realms.put({
//       //   realmId,
//       //   name: gameTable.gameTitle,
//       //   represents: `A game table for ${gameTable.gameTitle}`,
//       // })

//       // bfgDb.gameTables.update(gameTable, { realmId });

//       console.log("DB: shareGameTableWithFriends - sending invite to friends", tableId, friends);

//       if (friends.length > 0) {
//         bfgDb.members.bulkAdd(
//           friends.map((friend) => ({
//             realmId,
//             email: friend.email,
//             name: invitationText,
//             invite: true,
//             permissions: {
//               manage: '*', // Give your friend full permissions within this new realm.
//             },
//           })),
//         )
//       }
//     },
//   )
// }


// export const startGameTableWithFriends = async (newGameTable: NewGameTable, inviteMessage: string, friendIds: DbGameFriendId[]) => {

//   const gameTable = await initializeGameTable(newGameTable);
  
//   if (!gameTable) {
//     throw new Error("Table not found");
//   }

//   await shareGameTableWithFriends(gameTable.id, inviteMessage, friendIds);

//   return gameTable;
// }


// export const unshareGameTableFromFriends = async (table: DbGameTable, friendIds: DbGameFriendId[]) => {
//   const realmId = table.realmId || ''

//   const friends = await bfgDb.myFriends.where('id').anyOf(friendIds).toArray();

//   return bfgDb
//     .members
//     .where('[email+realmId]')
//     .anyOf(
//       friends.map(
//         (friend) => [friend.email ?? '', realmId] as [string, string],
//       ),
//     )
//     .delete()
// }


// export const sitAtGameTable = async (tableId: DbGameTableId, playerId: DbPlayerProfileId, playerSeat: GameTableSeat) => {

//   const txResult = await bfgDb.transaction(
//     'rw',
//     [bfgDb.gameTables, bfgDb.myFriends, bfgDb.realms, bfgDb.members],
//     async () => {

//       const gameTable = await bfgDb.gameTables.get(tableId);

//       if (!gameTable) {
//         throw new Error("Table not found");
//       }

//       gameTable[playerSeat] = playerId;

//       bfgDb.gameTables.update( gameTable, {
//         ...gameTable,
//         [playerSeat]: playerId,
//       })
//     }
//   )

//   return txResult;
// }
