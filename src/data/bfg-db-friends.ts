import { useLiveQuery } from "dexie-react-hooks"
import { bfgDb } from "./bfg-db";
import { NewGameFriendParameters } from "~/types/core/friend-account/friend";
import { DbFriendAccount } from "~/types/core/friend-account/friend-db";
import { BfgGameFriendId } from "~/types/core/branded-values/bfg-branded-ids";
import { DbGameFriendId } from "~/types/core/branded-values/branded-strings";


export const useLiveFriends = (): DbFriendAccount[] | undefined => {
  const friends = useLiveQuery(async () => {
    return await bfgDb.myFriends.toArray();
  })
  return friends;
}


export const useLiveFriend = (friendId: DbGameFriendId): DbFriendAccount | undefined => {
  const friend = useLiveQuery(async () => {
    return await bfgDb.myFriends.get(friendId);
  }, [friendId])
  return friend;
}


export const deleteAllFriends = async () => {
  await bfgDb.myFriends.clear();
} 


export const addNewFriend = async (friendParameters: NewGameFriendParameters) => {

  const newFriendId = BfgGameFriendId.createId();

  console.log("DB: newFriendId", newFriendId);

  const newFriend: DbFriendAccount = {
    id: newFriendId,
    status: "pending",
    name: friendParameters.name,
    email: friendParameters.email,
  }

  const added = await bfgDb.myFriends.add(newFriend);

  console.log("DB: added", added);
}
