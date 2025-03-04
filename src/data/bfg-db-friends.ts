import { useLiveQuery } from "dexie-react-hooks"
import { bfgDb } from "./bfg-db";
import { NewGameFriendParameters } from "~/types/core/game-friend/friend";
import { DbGameFriendAccount } from "~/types/core/game-friend/friend-db";
import { GameFriendId } from "~/types/core/branded-values/bfg-branded-ids";
import { DbGameFriendId } from "~/types/core/branded-values/branded-strings";


export const useLiveFriends = (): DbGameFriendAccount[] | undefined => {
  const friends = useLiveQuery(async () => {
    return await bfgDb.myFriends.toArray();
  })
  return friends;
}


export const useLiveFriend = (friendId: DbGameFriendId): DbGameFriendAccount | undefined => {
  const friend = useLiveQuery(async () => {
    return await bfgDb.myFriends.get(friendId);
  })
  return friend;
}


export const deleteAllFriends = async () => {
  await bfgDb.myFriends.clear();
} 


export const addNewFriend = async (friendParameters: NewGameFriendParameters) => {

  const newFriendId = GameFriendId.createId();

  console.log("DB: newFriendId", newFriendId);

  const newFriend: DbGameFriendAccount = {
    id: newFriendId,
    status: "pending",
    name: friendParameters.name,
    email: friendParameters.email,
  }

  const added = await bfgDb.myFriends.add(newFriend);

  console.log("DB: added", added);
}
