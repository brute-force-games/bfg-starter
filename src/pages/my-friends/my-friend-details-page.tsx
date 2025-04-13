import { useParams } from "react-router-dom";
import { useLiveFriend } from "~/data/bfg-db-friends";
import { FriendDetailsComponent } from "~/components/friend-details-component";
import { BfgGameFriendId } from "~/types/core/branded-values/bfg-branded-ids";


export const MyFriendDetailsPage = () => {
  const { friendId } = useParams();

  console.log("MyFriendDetailsPage: friendId", friendId);

  if (!friendId) {
    throw new Error("Friend ID is required");
  }

  const dbGameFriendId = BfgGameFriendId.parseId(friendId);

  const friend = useLiveFriend(dbGameFriendId);

  return (
    <>
      <div>My Friend Details</div>
      <FriendDetailsComponent friendId={dbGameFriendId} />
      <div>
        <pre>
          {JSON.stringify(friend, null, 2)}
        </pre>
      </div>
    </>
  );
}
