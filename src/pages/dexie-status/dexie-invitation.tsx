import { Invite } from "dexie-cloud-addon";
import { Button, Typography } from "@mui/material";
import { CenteredHorizontalContainerDiv } from "~/components/special-divs";


interface DexieInvitationProps {
  invitation: Invite;
}

export const DexieInvitation = ({ invitation }: DexieInvitationProps) => {

  const { invitedBy, name } = invitation;

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
          {/* {name}: {email} | {InvitedByName} | {userId} | {realmId} 
        <br />
        {realm?.name} */}
          {name}
      </Typography>
      <Button variant="contained" color="primary" onClick={() => {
        invitation.accept();
        }}>
          Accept
        </Button>
      </CenteredHorizontalContainerDiv>
    </>
  );
};
