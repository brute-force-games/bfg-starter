import { Typography } from "@mui/material";
import { DbGameFriendId } from "~/types/core/branded-values/branded-strings";
import { createFriendUrl } from "~/router-links";
import { Link } from "react-router";
import { useLiveFriend } from "~/data/bfg-db-friends";


interface IGameFriendDetailsComponentProps {
  friendId: DbGameFriendId;
}

export const FriendDetailsComponent = ({ friendId }: IGameFriendDetailsComponentProps) => {

  const friend = useLiveFriend(friendId);

  console.log("FriendDetailsComponent: friend", friend);

  return (
    <div>
      <Typography variant="h4">
        <Link to={createFriendUrl(friendId)}>
          Friend Details
        </Link>
      </Typography>
      <Typography>Friend ID: {friendId}</Typography>
      <Typography>Friend Name: {friend?.name}</Typography>
      <Typography>Friend Email: {friend?.email}</Typography>
    </div>
  );
};
