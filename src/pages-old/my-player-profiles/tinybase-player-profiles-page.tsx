import { Typography, Alert, Box } from "@mui/material";
import { DataPage } from "~/components/data-page/data-page";
import { PlayerProfileComponent } from "~/components/player-profile-component";
import { AddPlayerProfileDialog } from "~/dialogs/add-player-profile-dialog";
import { PrivatePlayerProfile } from "~/models/private-player-profile";
import {
  useMyPlayerProfiles,
  useDefaultPlayerProfile,
  usePlayerProfileActions,
} from "~/hooks/stores/use-my-player-profiles-store";

export const TinyBasePlayerProfilesPage = () => {
  const allPlayerProfiles = useMyPlayerProfiles();
  const defaultPlayerProfile = useDefaultPlayerProfile();
  const { addProfile, removeProfile, setDefault, clearAll } = usePlayerProfileActions();

  const alertUserToCreatePlayerProfile = allPlayerProfiles.length === 0;
  const alertUserToSetDefaultPlayerProfile = !alertUserToCreatePlayerProfile && !defaultPlayerProfile;

  const onDeleteAllData = async () => {
    try {
      clearAll();
    } catch (error) {
      console.error('Error clearing player profiles:', error);
    }
  };

  const onNewDataItemCreated = async (newProfile: PrivatePlayerProfile) => {
    console.log("TinyBasePlayerProfilesPage: onNewDataItemCreated", newProfile);
    
    try {
      // The profile is already added to the store by the dialog
      // We just need to handle any additional logic here if needed
    } catch (error) {
      console.error('Error handling new profile:', error);
    }
  };

  const onSetDefaultProfile = async (profileId: string) => {
    try {
      await setDefault(profileId);
    } catch (error) {
      console.error('Error setting default profile:', error);
    }
  };

  const onDeleteProfile = async (profileId: string) => {
    try {
      removeProfile(profileId);
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  };

  const allDetailsComponents = allPlayerProfiles?.map((playerProfile) => (
    <PlayerProfileComponent
      key={playerProfile.id}
      playerProfile={playerProfile}
      defaultPlayerProfileId={defaultPlayerProfile?.id || null}
      onSetDefault={() => onSetDefaultProfile(playerProfile.id)}
      onDelete={() => onDeleteProfile(playerProfile.id)}
    />
  ));

  const defaultPlayerProfileHandle = defaultPlayerProfile?.handle;

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 2 }}>
        Player profiles are stored in TinyBase with cryptographic keys for secure move signing.
        All data is persisted locally and updates reactively across the application.
      </Alert>

      {alertUserToCreatePlayerProfile && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          No player profiles found. You'll need to create one to get started.
        </Alert>
      )}

      {alertUserToSetDefaultPlayerProfile && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          No default player profile set. Please set one as your default profile.
        </Alert>
      )}

      <Typography variant="h6" sx={{ mb: 2 }}>
        Default Player Profile: {defaultPlayerProfileHandle || 'None'}
      </Typography>
      
      <DataPage<PrivatePlayerProfile, PrivatePlayerProfile>
        itemName="Player Profiles"
        allDataItems={allPlayerProfiles}
        allDataComponents={allDetailsComponents}
        addNewDialogComponent={AddPlayerProfileDialog}
        onNewDataItemCreated={onNewDataItemCreated}
        onDeleteAllData={onDeleteAllData}
      />
    </Box>
  );
};
