// import { useState } from 'react';
// import {
//   Box,
//   Button,
//   Checkbox,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   FormControl,
//   FormControlLabel,
//   FormGroup,
//   Stack,
//   Typography
// } from '@bfg-engine';
// import { LobbyOptions } from '~/models/p2p-lobby';
// import { BfgSupportedGameTitles, BfgSupportedGameTitlesSchema } from '~/types/bfg-game-engines/supported-games';

// interface LobbyHostOptionsDialogProps {
//   open: boolean;
//   onClose: () => void;
//   onSave: (lobbyOptions: LobbyOptions) => void;
//   initialLobbyOptions: LobbyOptions;
// }

// export const LobbyHostOptionsDialog = ({ 
//   open, 
//   onClose, 
//   onSave, 
//   initialLobbyOptions 
// }: LobbyHostOptionsDialogProps) => {
//   const [tempGameChoices, setTempGameChoices] = useState<BfgSupportedGameTitles[]>(
//     initialLobbyOptions.gameChoices
//   );

//   const allGameChoices = BfgSupportedGameTitlesSchema.options;

//   const handleGameChoiceChange = (gameChoice: BfgSupportedGameTitles, checked: boolean) => {
//     if (checked) {
//       setTempGameChoices(prev => [...prev, gameChoice]);
//     } else {
//       setTempGameChoices(prev => prev.filter(choice => choice !== gameChoice));
//     }
//   };

//   const handleSave = () => {
//     const updatedLobbyOptions: LobbyOptions = {
//       ...initialLobbyOptions,
//       gameChoices: tempGameChoices,
//     };
//     onSave(updatedLobbyOptions);
//     onClose();
//   };

//   const handleCancel = () => {
//     // Reset to initial state
//     setTempGameChoices(initialLobbyOptions.gameChoices);
//     onClose();
//   };

//   return (
//     <Dialog 
//       open={open} 
//       onClose={handleCancel}
//       maxWidth="sm"
//       fullWidth
//     >
//       <DialogTitle>
//         Configure Game Choices
//       </DialogTitle>
//       <DialogContent>
//         <Stack spacing={2} sx={{ mt: 1 }}>
//           <Typography variant="body2" color="text.secondary">
//             Select which games will be available for players to choose from in this lobby.
//           </Typography>
          
//           <FormControl component="fieldset">
//             <FormGroup>
//               {allGameChoices.map(choice => {
//                 const isSelected = tempGameChoices.includes(choice);
//                 return (
//                   <FormControlLabel
//                     key={choice}
//                     control={
//                       <Checkbox
//                         checked={isSelected}
//                         onChange={(e) => handleGameChoiceChange(choice, e.target.checked)}
//                         color="primary"
//                       />
//                     }
//                     label={choice}
//                   />
//                 );
//               })}
//             </FormGroup>
//           </FormControl>

//           {tempGameChoices.length === 0 && (
//             <Box sx={{ mt: 2 }}>
//               <Typography variant="body2" color="warning.main" fontStyle="italic">
//                 ⚠️ No games selected. Players won't be able to choose a game.
//               </Typography>
//             </Box>
//           )}
//         </Stack>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={handleCancel} color="inherit">
//           Cancel
//         </Button>
//         <Button 
//           onClick={handleSave}
//           variant="contained"
//           color="primary"
//         >
//           Save Changes
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };
