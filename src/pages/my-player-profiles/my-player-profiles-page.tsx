import { Button, Typography } from "@mui/material";
import { DataPage } from "~/components/data-page/data-page";
import { clearAppKeys, useLiveAppKeys } from "~/data/bfg-db-appkeys";
import { addNewPlayerProfile, deleteAllPlayerProfiles, useLivePlayerProfiles } from "~/data/bfg-db-player-profiles";
import { AddPlayerProfileDialog } from "~/dialogs/add-player-profile-dialog";
import { useBfgWhoAmIContext } from "~/state/who-am-i/BfgWhoAmIContext";
import { NewPlayerProfileParameters } from "~/types/core/player-profile/player-profile";
import { DbPlayerProfile } from "~/types/core/player-profile/player-profile-db";


export const MyPlayerProfilesPage = () => {

  const { playerId } = useBfgWhoAmIContext();

  const allPlayerProfiles = useLivePlayerProfiles();
  const appKeys = useLiveAppKeys();

  if (!allPlayerProfiles) {
    return <div>No player profiles found</div>;
  }

  console.log("MyPlayerProfilesPage: allPlayerProfiles", allPlayerProfiles);

  const onDeleteAllData = async () => {
    await deleteAllPlayerProfiles();
  }

  const logAppKeys = () => {
    appKeys?.forEach((appKey) => {
      console.log("MyPlayerProfilesPage: appKey", appKey);
    });
  }

  const onNewDataItemCreated = async (playerProfileParameters: NewPlayerProfileParameters) => {
    console.log("MyPlayerProfilesPage: onNewDataItemCreated");
    await addNewPlayerProfile(playerProfileParameters);
  }

  const allDetailsComponents = allPlayerProfiles?.map((playerProfile) => (
    <div key={playerProfile.id}>
      {playerProfile.handle}
    </div>
  ))
  

  return (
    <>
      <Typography variant="h6">My Player ID: {playerId}</Typography>
      <Button onClick={() => clearAppKeys()}>Clear App Keys</Button>
      <Button onClick={() => logAppKeys()}>Show App Keys</Button>
      

      <DataPage<NewPlayerProfileParameters, DbPlayerProfile>
        itemName="Player Profiles"
        allDataItems={allPlayerProfiles}
        allDataComponents={allDetailsComponents}
        addNewDialogComponent={AddPlayerProfileDialog}
        onNewDataItemCreated={onNewDataItemCreated}
        onDeleteAllData={onDeleteAllData}
      />
    </>
  )
}
