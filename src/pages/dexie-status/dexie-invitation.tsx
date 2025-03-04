import { Invite } from "dexie-cloud-addon";
import { Button, Typography } from "@mui/material";


interface DexieInvitationProps {
  invitation: Invite;
}

export const DexieInvitation = ({ invitation }: DexieInvitationProps) => {

  const { invitedBy, realmId, realm } = invitation;

  if (!invitedBy) {
    return (
      <div>
        Invitation unclear
      </div>
    )
  }

  const { email, name, userId } = invitedBy;

  return (
    <>
      <Typography variant="h6">
        {email} | {name} | {userId} | {realmId} 
        <br />
        {realm?.name}
      </Typography>
      <Button variant="contained" color="primary" onClick={() => {
        invitation.accept();
      }}>
        Accept
      </Button>
    </>
  );
};
