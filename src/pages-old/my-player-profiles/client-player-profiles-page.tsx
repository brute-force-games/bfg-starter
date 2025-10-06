// import { Typography, Alert, Box } from "@mui/material";
// import { DataPage } from "~/components/data-page/data-page";
// import { PlayerProfileComponent } from "~/components/player-profile-component";
// import { AddPlayerProfileDialog } from "~/dialogs/add-player-profile-dialog";
// import { PrivatePlayerProfile } from "~/models/private-player-profile";
// import { useState, useEffect } from "react";
// import {
//   getPrivatePlayerProfiles,
//   getDefaultPrivatePlayerProfile,
//   clearAllPlayerProfiles,
//   setDefaultPlayerProfile,
//   deletePrivatePlayerProfile,
// } from "~/data/client-player-profiles";

// export const ClientPlayerProfilesPage = () => {
//   const [allPlayerProfiles, setAllPlayerProfiles] = useState<PrivatePlayerProfile[]>([]);
//   const [defaultPlayerProfile, setDefaultPlayerProfile] = useState<PrivatePlayerProfile | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // Load player profiles on component mount
//   useEffect(() => {
//     const loadProfiles = () => {
//       try {
//         const profiles = getPrivatePlayerProfiles();
//         const defaultProfile = getDefaultPrivatePlayerProfile();
        
//         setAllPlayerProfiles(profiles);
//         setDefaultPlayerProfile(defaultProfile);
//       } catch (error) {
//         console.error('Error loading player profiles:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadProfiles();
//   }, []);

//   const alertUserToCreatePlayerProfile = allPlayerProfiles.length === 0;
//   const alertUserToSetDefaultPlayerProfile = !alertUserToCreatePlayerProfile && !defaultPlayerProfile;

//   const onDeleteAllData = async () => {
//     try {
//       clearAllPlayerProfiles();
//       setAllPlayerProfiles([]);
//       setDefaultPlayerProfile(null);
//     } catch (error) {
//       console.error('Error clearing player profiles:', error);
//     }
//   };

//   const onNewDataItemCreated = async (newProfile: PrivatePlayerProfile) => {
//     console.log("ClientPlayerProfilesPage: onNewDataItemCreated", newProfile);
    
//     // Reload profiles to get the updated list
//     const profiles = getPrivatePlayerProfiles();
//     const defaultProfile = getDefaultPrivatePlayerProfile();
    
//     setAllPlayerProfiles(profiles);
//     setDefaultPlayerProfile(defaultProfile);
//   };

//   const onSetDefaultProfile = async (profileId: string) => {
//     try {
//       setDefaultPlayerProfile(profileId);
      
//       // Update all profiles to set the correct default
//       const profiles = getPrivatePlayerProfiles();
//       setAllPlayerProfiles(profiles);
//       setDefaultPlayerProfile(getDefaultPrivatePlayerProfile());
//     } catch (error) {
//       console.error('Error setting default profile:', error);
//     }
//   };

//   const onDeleteProfile = async (profileId: string) => {
//     try {
//       deletePrivatePlayerProfile(profileId);
      
//       // Reload profiles
//       const profiles = getPrivatePlayerProfiles();
//       const defaultProfile = getDefaultPrivatePlayerProfile();
      
//       setAllPlayerProfiles(profiles);
//       setDefaultPlayerProfile(defaultProfile);
//     } catch (error) {
//       console.error('Error deleting profile:', error);
//     }
//   };

//   const allDetailsComponents = allPlayerProfiles?.map((playerProfile) => (
//     <PlayerProfileComponent
//       key={playerProfile.id}
//       playerProfile={playerProfile}
//       defaultPlayerProfileId={defaultPlayerProfile?.id || null}
//       onSetDefault={() => onSetDefaultProfile(playerProfile.id)}
//       onDelete={() => onDeleteProfile(playerProfile.id)}
//     />
//   ));

//   const defaultPlayerProfileHandle = defaultPlayerProfile?.handle;

//   if (isLoading) {
//     return <Typography>Loading player profiles...</Typography>;
//   }

//   return (
//     <Box>
//       <Alert severity="info" sx={{ mb: 2 }}>
//         Player profiles are stored locally on your device with cryptographic keys for secure move signing.
//         No server storage is used - all data remains private to you.
//       </Alert>

//       {alertUserToCreatePlayerProfile && (
//         <Alert severity="warning" sx={{ mb: 2 }}>
//           No player profiles found. You'll need to create one to get started.
//         </Alert>
//       )}

//       {alertUserToSetDefaultPlayerProfile && (
//         <Alert severity="warning" sx={{ mb: 2 }}>
//           No default player profile set. Please set one as your default profile.
//         </Alert>
//       )}

//       <Typography variant="h6" sx={{ mb: 2 }}>
//         Default Player Profile: {defaultPlayerProfileHandle || 'None'}
//       </Typography>
      
//       <DataPage<PrivatePlayerProfile, PrivatePlayerProfile>
//         itemName="Player Profiles"
//         allDataItems={allPlayerProfiles}
//         allDataComponents={allDetailsComponents}
//         addNewDialogComponent={AddPlayerProfileDialog}
//         onNewDataItemCreated={onNewDataItemCreated}
//         onDeleteAllData={onDeleteAllData}
//       />
//     </Box>
//   );
// };
