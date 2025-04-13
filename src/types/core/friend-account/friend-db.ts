import { DbGameFriendId } from "../branded-values/branded-strings";
import { FriendAccount } from "./friend";


export type NewDbFriendAccount = FriendAccount


export type DbFriendAccount = NewDbFriendAccount & {
  id?: DbGameFriendId;
}
