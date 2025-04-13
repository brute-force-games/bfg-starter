// import { useForm, Controller } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   FormControl,
//   FormGroup,
//   FormControlLabel,
//   Radio,
//   RadioGroup,
//   Stack,
//   FormHelperText,
//   TextField} from '@mui/material';
// import { AvailableGameTitles, AllGamesOnShelfArray } from '~/types/enums/game-shelf';
// import { useMyPlayerContext } from '~/data/persisted-player/persisted-player-store';
// import { NewGameLobbyParameters, NewGameLobbyParametersSchema } from '~/types/core/lobby-phase/lobby-phase';
// import { VerticalSpacerDiv } from '~/components/special-divs';
// import { useState } from 'react';
// import { GameTitle } from '~/types/core/branded-values/branded-strings';


// interface CreateNewLobbyDialogProps {
//   onCreateNewLobby: (lobbyParameters: NewGameLobbyParameters) => void;

//   onClose: () => void;
// }

// export const CreateNewLobbyDialog = ({ onCreateNewLobby, onClose }: CreateNewLobbyDialogProps) => {
//   const { myPlayerId } = useMyPlayerContext();

//   const [selectedGameTitle, setSelectedGameTitle] = useState<GameTitle>('Tic Tac Toe' as GameTitle);

//   const selectedGameDefinition = AllGamesOnShelfArray
//     .find(game => game.title === selectedGameTitle);

//   console.log("selectedGameDefinition:", selectedGameDefinition);

//   if (!selectedGameDefinition) {
//     throw new Error(`Game definition not found for game title: ${selectedGameTitle}`);
//   }

//   const defaultFormValues: NewGameLobbyParameters = {
//     gameHostPlayerId: myPlayerId,
//     gameOnShelf: selectedGameDefinition,
//     lobbyMinNumPlayers: selectedGameDefinition.minNumPlayersForGame,
//     lobbyMaxNumPlayers: selectedGameDefinition.maxNumPlayersForGame,
//   }

//   const { control, handleSubmit, formState, setValue } = useForm<NewGameLobbyParameters>({
//     resolver: zodResolver(NewGameLobbyParametersSchema),
//     defaultValues: defaultFormValues,
//   });

//   const { errors } = formState;

//   console.log("control:", control);

//   const onSubmit = async (formData: NewGameLobbyParameters) => {

//     console.log("onSubmit form values:", formData);
//     onCreateNewLobby(formData);

//     onClose();
//   };

//   const handleSelectedGameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const newGameTitle = event.target.value as GameTitle;
//     console.log(`handleSelectedGameChange: ${newGameTitle}`);
//     setSelectedGameTitle(newGameTitle);
    
//     // Update form values with new game's min and max players
//     const newGameDefinition = AllGamesOnShelfArray.find(game => game.title === newGameTitle);
//     if (newGameDefinition) {
//       setValue('lobbyMinNumPlayers', newGameDefinition.minNumPlayersForGame);
//       setValue('lobbyMaxNumPlayers', newGameDefinition.maxNumPlayersForGame);
//       setValue('gameOnShelf', newGameDefinition);
//     }
//   };


//   return (
//     <Dialog 
//       open={true} 
//       onClose={onClose}
//       maxWidth="sm"
//       fullWidth
//     >
//       <DialogTitle>
//         Start Game Lobby
//       </DialogTitle>
//       <DialogContent>
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <Stack spacing={3} sx={{ mt: 2 }}>
//             <FormControl error={!!errors.gameOnShelf}>

//               <FormGroup>
//                 <Controller
//                   name="gameOnShelf"
//                   control={control}
//                   render={() => (
//                     <RadioGroup
//                       value={selectedGameTitle}
//                       onChange={handleSelectedGameChange}
//                     >
//                       {[...AvailableGameTitles].sort().map((title) => (
//                         <FormControlLabel
//                           key={title}
//                           control={<Radio value={title} />}
//                           label={title}
//                         />
//                       ))}
//                     </RadioGroup>
//                   )}
//                 />
//               </FormGroup>

//               <VerticalSpacerDiv height={10} />
//               <Controller
//                 name="lobbyMinNumPlayers"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     {...field}
//                     type="number"
//                     label="Minimum Player Count"
//                     error={!!errors.lobbyMinNumPlayers}
//                     helperText={errors.lobbyMinNumPlayers?.message}
//                     inputProps={{ 
//                       min: selectedGameDefinition.minNumPlayersForGame, 
//                       max: selectedGameDefinition.maxNumPlayersForGame 
//                     }}
//                   />
//                 )}
//               />

//               <VerticalSpacerDiv height={10} />

//               <Controller
//                 name="lobbyMaxNumPlayers"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     {...field}
//                     type="number"
//                     label="Maximum Player Count"
//                     error={!!errors.lobbyMaxNumPlayers}
//                     helperText={errors.lobbyMaxNumPlayers?.message}
//                     inputProps={{ 
//                       min: selectedGameDefinition.minNumPlayersForGame, 
//                       max: selectedGameDefinition.maxNumPlayersForGame 
//                     }}
//                   />
//                 )}
//               />

//               {errors.gameOnShelf && (
//                 <FormHelperText>{errors.gameOnShelf.message}</FormHelperText>
//               )}
//             </FormControl>

//           </Stack>
//         </form>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button 
//           onClick={handleSubmit(onSubmit)}
//           variant="contained"
//         >
//           Start Lobby
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }
