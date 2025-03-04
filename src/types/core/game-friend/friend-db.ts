import { DbGameFriendId } from "../branded-values/branded-strings";
import { GameFriendAccount } from "./friend";


export type NewDbGameFriendAccount = GameFriendAccount


export type DbGameFriendAccount = NewDbGameFriendAccount & {
  id?: DbGameFriendId;
}
