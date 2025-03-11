import { DbPlayerProfileId } from "../branded-values/branded-strings";
import { NewPlayerProfileParameters } from "./player-profile";



export type NewDbPlayerProfile = NewPlayerProfileParameters


export type DbPlayerProfile = NewDbPlayerProfile & {
  id?: DbPlayerProfileId;
  
  handle: string;
  avatarImageUrl?: string;
  isDefault: boolean;

  createdAt: Date;
  updatedAt: Date;
}
