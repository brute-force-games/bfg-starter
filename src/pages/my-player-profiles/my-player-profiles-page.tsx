import { Typography } from "@mui/material";
import { DataPage } from "~/components/data-page/data-page";
import { PlayerProfileComponent } from "~/components/player-profile-component";
import { addNewPlayerProfile, deleteAllPlayerProfiles, useLiveDefaultPlayerProfile, useLivePlayerProfiles } from "~/data/bfg-db-player-profiles";
import { AddPlayerProfileDialog } from "~/dialogs/add-player-profile-dialog";
import { NewPlayerProfileParameters } from "~/types/core/player-profile/player-profile";
import { DbPlayerProfile } from "~/types/core/player-profile/player-profile-db";


export const MyPlayerProfilesPage = () => {

  const allPlayerProfiles = useLivePlayerProfiles();
  const defaultPlayerProfile = useLiveDefaultPlayerProfile();

  const alertUserToCreatePlayerProfile = (!allPlayerProfiles || allPlayerProfiles.length === 0);
  const alertUserToSetDefaultPlayerProfile = (!alertUserToCreatePlayerProfile && !defaultPlayerProfile);


  const onDeleteAllData = async () => {
    await deleteAllPlayerProfiles();
  }

  const onNewDataItemCreated = async (playerProfileParameters: NewPlayerProfileParameters) => {
    console.log("MyPlayerProfilesPage: onNewDataItemCreated");
    await addNewPlayerProfile(playerProfileParameters);
  }

  const allDetailsComponents = allPlayerProfiles?.map((playerProfile) => (
    <PlayerProfileComponent
      key={playerProfile.id}
      playerProfile={playerProfile}
      defaultPlayerProfileId={defaultPlayerProfile?.id || null}
    />
  ))

  const defaultPlayerProfileHandle = defaultPlayerProfile?.handle;
  

  return (
    <>
      {alertUserToCreatePlayerProfile && (
        <div>
          No player profiles found. You'll have to add one to get started.
        </div>
      )}

      {alertUserToSetDefaultPlayerProfile && (
        <div>
          No default player profile found. You'll have to set one to get started.
        </div>
      )}


      <Typography variant="h6">
        Default Player Profile: {defaultPlayerProfileHandle}
      </Typography>
      

      <DataPage<NewPlayerProfileParameters, DbPlayerProfile>
        itemName="Player Profiles"
        allDataItems={allPlayerProfiles ?? []}
        allDataComponents={allDetailsComponents}
        addNewDialogComponent={AddPlayerProfileDialog}
        onNewDataItemCreated={onNewDataItemCreated}
        onDeleteAllData={onDeleteAllData}
      />
    </>
  )
}
