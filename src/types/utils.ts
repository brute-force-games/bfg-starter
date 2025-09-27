import { PrivatePlayerProfile } from "~/models/private-player-profile";
import { PublicPlayerProfile } from "~/models/public-player-profile";


export const convertPrivateToPublicProfile = (privateProfile: PrivatePlayerProfile): PublicPlayerProfile => {
  const retVal: PublicPlayerProfile = {
    id: privateProfile.id,
    handle: privateProfile.handle,
    avatarImageUrl: privateProfile.avatarImageUrl,
    publicKey: privateProfile.publicKey,
    createdAt: privateProfile.createdAt,
    updatedAt: privateProfile.updatedAt,
  };

  return retVal;
};