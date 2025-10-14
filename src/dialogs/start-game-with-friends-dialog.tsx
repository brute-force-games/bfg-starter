// import { useState, useEffect } from 'react';
// import {
//   Button,
//   Checkbox,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   FormControlLabel,
//   FormGroup,
//   Stack,
// } from '@bfg-engine';
// import { useLiveFriends } from '~/data/bfg-db-friends';
// import { DbGameFriendId } from '~/types/core/branded-values/branded-strings';
// import { AbfgSupportedGameTitle } from '~/types/bfg-game-engines/supported-games';
// import { AllBfgGameMetadata } from '~/types/bfg-game-engines/bfg-game-engines';


// interface StartGameWithFriendsDialogProps {
//   gameTitle: AbfgSupportedGameTitle;
//   onStart: (gameTitle: AbfgSupportedGameTitle, friendIds: DbGameFriendId[]) => void;
//   onClose: () => void;
// }

// export const StartGameWithFriendsDialog = ({ gameTitle, onStart, onClose }: StartGameWithFriendsDialogProps) => {

//   const friends = useLiveFriends();

//   const [friendsLoaded, setFriendsLoaded] = useState(false);
//   const [selectedFriendIds, setSelectedFriendIds] = useState<DbGameFriendId[]>(friends?.map(f => f.id!) || []);

//   const selectedGame = AllBfgGameMetadata[gameTitle];

//   const minNumPlayersExcludingSelf = selectedGame.definition.minNumPlayersForGame - 1;
//   const maxNumPlayersExcludingSelf = selectedGame.definition.maxNumPlayersForGame - 1;

//   useEffect(() => {
//     if (!friends || friendsLoaded) {
//       return;
//     }

//     setFriendsLoaded(true);
//     setSelectedFriendIds(friends.map(f => f.id!));

//   }, [friends, friendsLoaded]);


//   const handleStartGame = () => {
//     if (selectedFriendIds.length > 0) {
//       onStart(gameTitle, selectedFriendIds);
//       onClose();
//     }
//   };

//   const handleFriendToggle = (friendId: DbGameFriendId) => {
//     setSelectedFriendIds(prev => {
//       if (prev.includes(friendId)) {
//         return prev.filter(id => id !== friendId);
//       } else {
//         return [...prev, friendId];
//       }
//     });
//   };


//   return (
//     <Dialog 
//       open={true} 
//       onClose={onClose}
//       maxWidth="sm"
//       fullWidth
//     >
//       <DialogTitle>
//         Play {gameTitle} with Friends
//       </DialogTitle>
//       <DialogContent>
//         <Stack spacing={3} sx={{ mt: 2 }}>

//           <FormGroup>
//             {/* <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={selectedFriendIds.length === friends?.length}
//                   indeterminate={selectedFriendIds.length > 0 && selectedFriendIds.length < (friends?.length || 0)}
//                   onChange={(e) => {
//                     if (e.target.checked) {
//                       setSelectedFriendIds(friends?.map(f => f.id!) || []);
//                     } else {
//                       setSelectedFriendIds([]);
//                     }
//                   }}
//                 />
//               }
//               label="Select All Friends"
//             /> */}
//             {friends?.map(friend => (
//               <FormControlLabel
//                 key={friend.id}
//                 control={
//                   <Checkbox
//                     checked={selectedFriendIds.includes(friend.id!)}
//                     onChange={() => handleFriendToggle(friend.id!)}
//                   />
//                 }
//                 label={`${friend.name} (${friend.email})`}
//               />
//             ))}
//           </FormGroup>
//         </Stack>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button 
//           onClick={handleStartGame}
//           variant="contained"
//           disabled={
//             selectedFriendIds.length < minNumPlayersExcludingSelf ||
//             selectedFriendIds.length > maxNumPlayersExcludingSelf
//           }
//         >
//           Share
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };
