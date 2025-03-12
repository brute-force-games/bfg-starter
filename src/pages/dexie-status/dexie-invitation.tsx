import { Invite } from "dexie-cloud-addon";
import { Button, Typography } from "@mui/material";
import { CenteredHorizontalContainerDiv } from "~/components/special-divs";
import { useNavigate } from "react-router-dom";


interface DexieInvitationProps {
  invitation: Invite;
}

export const DexieInvitation = ({ invitation }: DexieInvitationProps) => {

  const { invitedBy, name } = invitation;
  const navigate = useNavigate();

  if (!invitedBy) {
    return (
      <div>
        Invitation unclear
      </div>
    )
  }

  // const { email, name: InvitedByName, userId } = invitedBy;

  return (
    <>
      <CenteredHorizontalContainerDiv>
        <Typography variant="h6">
          {name}
        </Typography>
        <Button variant="contained" color="primary" onClick={() => {
          const gameTableId = invitation.realmId.split("~")[1];
          console.log("invitation", invitation);
          invitation.accept();
          navigate(`/game-tables/${gameTableId}/seat`);
          }}
        >
          Join Game Table
        </Button>
      </CenteredHorizontalContainerDiv>
    </>
  );
};
