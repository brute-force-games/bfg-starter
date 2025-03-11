import { Button, Typography } from "@mui/material";
import { setDefaultPlayerProfile, updatePlayerProfileHandle } from "~/data/bfg-db-player-profiles";
import { DbPlayerProfile } from "~/types/core/player-profile/player-profile-db";
import { CenteredHorizontalContainerDiv } from "./special-divs";
import { DbPlayerProfileId } from "~/types/core/branded-values/branded-strings";


interface PlayerProfileComponentProps {
  defaultPlayerProfileId: DbPlayerProfileId | null;
  playerProfile: DbPlayerProfile;
}


export const PlayerProfileComponent = (props: PlayerProfileComponentProps) => {
  const { playerProfile, defaultPlayerProfileId } = props;

  const playerProfileId = playerProfile.id;

  if (!playerProfileId) {
    console.error("PlayerProfileComponent: playerProfile.id is not set");
    return (
      <div>
        {playerProfile.handle} - (Player Profile ID is not set)
      </div>
    );
  }

  const setThisAsDefaultPlayerProfile = () => {
    setDefaultPlayerProfile(playerProfileId);
  }

  const updateHandleForProfile = () => {
    const newHandle = prompt("Enter a new handle for this profile");
    if (newHandle) {
      updatePlayerProfileHandle(playerProfileId, newHandle);
    }
  }

  return (
    <CenteredHorizontalContainerDiv>
      <Typography variant="h6">{playerProfile.handle}</Typography>
      <Button 
        onClick={() => setThisAsDefaultPlayerProfile()}
        disabled={playerProfileId === defaultPlayerProfileId}
      >
        Set as Default
      </Button>
      <Button onClick={() => updateHandleForProfile()}>Update Handle</Button>
    </CenteredHorizontalContainerDiv>
  );
}
