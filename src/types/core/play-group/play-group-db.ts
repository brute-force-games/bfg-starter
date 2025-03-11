import { DbGamingGroupId } from "../branded-values/branded-strings";
import { GamingGroup } from "./play-group";


export type NewGamingGroup = GamingGroup


export type DbGamingGroup = NewGamingGroup & {
  id?: DbGamingGroupId;
}
