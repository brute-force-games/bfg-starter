import { useLiveQuery } from "dexie-react-hooks"
import { bfgDb } from "./bfg-db";
import { DbGameFriendId, DbGameLobbyId } from "~/types/core/branded-values/branded-strings";
import { DbGameLobby, NewDbGameLobby } from "~/types/core/game-lobby/game-lobby-db";
import { GameLobbyId } from "~/types/core/branded-values/bfg-branded-ids";
import { getTiedRealmId } from "dexie-cloud-addon";



export const useLiveLobbies = (): DbGameLobby[] | undefined => {
  const lobbies = useLiveQuery(async () => {
    return await bfgDb.myGameLobbies.toArray();
  })
  return lobbies;
}


export const useLiveLobby = (lobbyId: DbGameLobbyId): DbGameLobby | undefined => {
  const lobby = useLiveQuery(async () => {
    return await bfgDb.myGameLobbies.get(lobbyId);
  })
  return lobby;
}


export const useLiveLobbyField = <T extends keyof DbGameLobby>(
  lobbyId: DbGameLobbyId,
  field: T
): DbGameLobby[T] | undefined => {
  const value = useLiveQuery(async () => {
    const lobby = await bfgDb.myGameLobbies.get(lobbyId);
    console.log("DB: useLiveLobbyField", lobbyId, field, lobby?.[field]);
    return lobby?.[field];
  });
  return value;
}


export const addNewLobby = async (lobby: NewDbGameLobby) => {
  console.log("DB: addNewLobby", bfgDb);
  console.log("DB: myLobbies", bfgDb.myGameLobbies);

  const newLobbyId = GameLobbyId.createId();

  const newLobby: DbGameLobby = {
    id: newLobbyId,
    ...lobby,
  }

  const added = await bfgDb.myGameLobbies.add(newLobby);

  console.log("DB: added", added);
}


export const deleteAllLobbies = async () => {
  await bfgDb.myGameLobbies.clear();
} 


export const shareLobbyWithFriends = async (lobbyId: DbGameLobbyId, friendIds: DbGameFriendId[]) => {

  // Do a sync-consistent transaction that moves the space and its cards into a new realm
  // See http://dexie.org/cloud/docs/consistency
  return bfgDb.transaction(
    'rw',
    [bfgDb.myGameLobbies, bfgDb.myFriends, bfgDb.realms, bfgDb.members],
    async () => {

      const lobby = await bfgDb.myGameLobbies.get(lobbyId);
      const friends = await bfgDb.myFriends.where('id').anyOf(friendIds).toArray();

      if (!lobby) {
        throw new Error("Lobby not found");
      }

      // const lobbyId = lobby.id!;

      // Add or update a realm, tied to the lobby using getTiedRealmId():
      const realmId = getTiedRealmId(lobbyId)

      // Create a realm for the shared lobby. Use put to not fail if it already exists.
      // (Sync consistency)
      bfgDb.realms.put({
        realmId,
        name: lobby.gameTitle,
        represents: `A game lobby for ${lobby.gameTitle}`,
      })

      bfgDb.myGameLobbies.update(lobby, { realmId })

      // Move the space into the realm:
      // db.spaces.update(space.id, { realmId })

      // // Sync consisently move all its cards into the realm:
      // db.cards.where('spaceId').equals(space.id).modify({
      //   realmId,
      // })

      // Add the members to share it to:
      if (friends.length > 0) {
        bfgDb.members.bulkAdd(
          friends.map((friend) => ({
            realmId,
            email: friend.email,
            name: friend.name,
            invite: true,
            permissions: {
              manage: '*', // Give your friend full permissions within this new realm.
            },
          })),
        )
      }
    },
  )

  // lobby.sharedWith = friendIds;
  // await bfgDb.myGameLobbies.put(lobby);
}


export const updateLobbyDescription = async (lobbyId: DbGameLobbyId, description: string) => {
  const lobby = await bfgDb.myGameLobbies.get(lobbyId);
  if (!lobby) {
    throw new Error("Lobby not found");
  }

  bfgDb.transaction(
    'rw',
    [bfgDb.myGameLobbies],
    async () => {
      await bfgDb.myGameLobbies.update(lobby, { description });
      // await bfgDb.cloud.sync();
    }
  )

  // await bfgDb.myGameLobbies.update(lobby, { description });
  // await bfgDb.cloud.sync();
}



export const unshareLobbyFromFriends = async (lobby: DbGameLobby, friendIds: DbGameFriendId[]) => {
  const realmId = lobby.realmId || ''

  const friends = await bfgDb.myFriends.where('id').anyOf(friendIds).toArray();

  return bfgDb
    .members
    .where('[email+realmId]')
    .anyOf(
      friends.map(
        (friend) => [friend.email ?? '', realmId] as [string, string],
      ),
    )
    .delete()
}