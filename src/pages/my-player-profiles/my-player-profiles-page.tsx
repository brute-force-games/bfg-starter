// import { Typography, Button } from "@mui/material";
// import { useState } from "react";
// import { MyPlayerProvider } from "~/data/persisted-player/persisted-player-provider";
// import { addNewFriend, deleteAllFriends, useLiveFriends } from "~/data/bfg-db-friends";
// import { GameFriendAccount, NewGameFriendParameters } from "~/types/core/game-friend/friend";
// import { FriendDetailsComponent } from "~/components/friend-details-component";
// import { AddFriendDialog } from "~/dialogs/add-friend-dialog";


// export const MyFriendsPage = () => {

//   const [openCreateNewFriendDialog, setOpenCreateNewFriendDialog] = useState(false);

//   const allFriends = useLiveFriends();

//   console.log("MyFriendsPage: allFriends", allFriends);

//   const doDeleteAllFriends = async () => {
//     await deleteAllFriends();
//   }

//   const onCreateNewFriend = async (friendParameters: NewGameFriendParameters) => {

//     console.log("MyFriendsPage: onCreateNewFriend");
//     console.log("friendParameters:", friendParameters);

//     const newFriend: GameFriendAccount = {
//       status: "pending",
//       name: friendParameters.name,
//       email: friendParameters.email,
//     }

//     await addNewFriend(newFriend);

//     console.log("MyFriendsPage: onCreateNewFriend: added new friend");
//   }

//   return (
//     <>
//       <MyPlayerProvider>
//         <Typography variant="h1">My Friends</Typography>
//         <Button
//           variant="contained"
//           color="primary" 
//           onClick={() => setOpenCreateNewFriendDialog(true)}
//         >
//           Create Friend
//         </Button>

//         <Button
//           variant="contained"
//           color="warning" 
//           onClick={doDeleteAllFriends}
//         >
//           Delete All Friends
//         </Button>

//         <Typography variant="h2">All Friends</Typography>

//         {
//           allFriends && allFriends.length > 0 && (
//             <>
//               <Typography variant="h3">
//                 {allFriends.length} friends found
//               </Typography>
//               <div> 
//                 {
//                   allFriends?.map(friend => (
//                     <FriendDetailsComponent
//                       key={friend.id} 
//                       friendId={friend.id!}
//                     />
//                   ))
//                 }
//               </div>
//             </>
//           )
//         }

//         {
//           openCreateNewFriendDialog && (
//             <AddFriendDialog
//               onCreateNewFriend={onCreateNewFriend}
//               onClose={() => setOpenCreateNewFriendDialog(false)}
//             />
//           )
//         }
//       </MyPlayerProvider>
//     </>
//   );
// };


import { DataPage } from "~/components/data-page/data-page";
import { addNewPlayerProfile, deleteAllPlayerProfiles, useLivePlayerProfiles } from "~/data/bfg-db-player-profiles";
import { AddPlayerProfileDialog } from "~/dialogs/add-player-profile-dialog";
import { NewPlayerProfileParameters } from "~/types/core/player-profile/player-profile";

export const MyPlayerProfilesPage = () => {

  const allPlayerProfiles = useLivePlayerProfiles();

  console.log("MyPlayerProfilesPage: allPlayerProfiles", allPlayerProfiles);

  const onDeleteAllData = async () => {
    await deleteAllPlayerProfiles();
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
      <DataPage
        dataName="Player Profiles"
        allDetailsComponents={allDetailsComponents}
        addNewDialogComponent={AddPlayerProfileDialog}
        onNewDataItemCreated={onNewDataItemCreated}
        onDeleteAllData={onDeleteAllData}
      />
    </>
  )
}
