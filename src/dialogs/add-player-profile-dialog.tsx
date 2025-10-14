// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import {
//   Alert,
//   Button,
//   Checkbox,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   FormControl,
//   FormControlLabel,
//   Stack,
//   TextField} from '@bfg-engine';
// import { NewPlayerProfileParameters, NewPlayerProfileParametersSchema } from '~/types/core/player-profile/player-profile';
// import { Controller } from 'react-hook-form';
// import { useEffect, useState } from 'react';
// import { useBfgWhoAmIContext } from '~/state/who-am-i/BfgWhoAmIContext';
// import { PrivatePlayerProfile } from '~/models/private-player-profile';


// interface AddPlayerProfileDialogProps {
//   allDataItems: PrivatePlayerProfile[];
//   onNewDataItemCreated: (playerProfile: PrivatePlayerProfile) => void;
//   onClose: () => void;
// }

// export const AddPlayerProfileDialog = ({ allDataItems, onNewDataItemCreated, onClose }: AddPlayerProfileDialogProps) => {
//   const [isCreating, setIsCreating] = useState(false);
//   const [createError, setCreateError] = useState<string | null>(null);

//   const defaultNewHandleValue = "Player";

//   interface FormData {
//     handle: string;
//     avatarImageUrl?: string;
//     isDefault: boolean;
//   }

//   const defaultFormValues: FormData = {
//     handle: defaultNewHandleValue,
//     avatarImageUrl: '',
//     isDefault: false,
//   }

//   const doesHandleAlreadyExist = (handle: string) => {
//     return allDataItems?.some(playerProfile => playerProfile.handle === handle);
//   }

//   const formSchema = NewPlayerProfileParametersSchema.extend({
//     avatarImageUrl: z.string().optional(),
//     isDefault: z.boolean(),
//   }).refine(
//     (data) => !doesHandleAlreadyExist(data.handle),
//     {
//       message: "You already have a profile with this handle",
//       path: ["handle"]
//     }
//   );

//   const { control, handleSubmit, formState, trigger } = useForm<FormData>({
//     resolver: zodResolver(formSchema),
//     defaultValues: defaultFormValues,
//     mode: 'onChange',
//     reValidateMode: 'onChange',
//   });

//   // Trigger validation when component mounts
//   useEffect(() => {
//     trigger('handle');
//   }, [trigger]);

//   const { errors } = formState;

//   const onSubmit = async (formData: FormData) => {
//     setIsCreating(true);
//     setCreateError(null);

//     try {
//       console.log("Creating player profile with form data:", formData);
      
//       // Import the client storage function
//       const { addPrivatePlayerProfile } = await import('~/data/client-player-profiles');
      
//       // Create the profile with cryptographic keys
//       const newProfile = await addPrivatePlayerProfile(
//         formData.handle,
//         formData.avatarImageUrl || undefined,
//         formData.isDefault
//       );

//       console.log("Created player profile:", newProfile);
//       onNewDataItemCreated(newProfile);
//       onClose();
//     } catch (error) {
//       console.error("Error creating player profile:", error);
//       setCreateError(error instanceof Error ? error.message : 'Failed to create player profile');
//     } finally {
//       setIsCreating(false);
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
//         Add Player Profile
//       </DialogTitle>
//       <DialogContent>
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <Stack spacing={3} style={{ marginTop: '16px' }}>
//             {createError && (
//               <Alert severity="error">
//                 {createError}
//               </Alert>
//             )}
            
//             <FormControl error={!!errors.handle}>
//               <Controller
//                 name="handle"
//                 control={control}
//                 render={({ field: { onChange, value, ...field } }) => (
//                   <TextField
//                     {...field}
//                     label="Profile Handle"
//                     error={!!errors.handle}
//                     helperText={errors.handle?.message}
//                     value={value}
//                     onChange={async (e) => {
//                       const newValue = e.target.value.trim();
//                       onChange(newValue);
//                       await trigger('handle');
//                     }}
//                     disabled={formState.isSubmitting || isCreating}
//                   />
//                 )}
//               />
//             </FormControl>

//             <FormControl error={!!errors.avatarImageUrl}>
//               <Controller
//                 name="avatarImageUrl"
//                 control={control}
//                 render={({ field: { onChange, value, ...field } }) => (
//                   <TextField
//                     {...field}
//                     label="Avatar Image URL (optional)"
//                     error={!!errors.avatarImageUrl}
//                     helperText={errors.avatarImageUrl?.message}
//                     value={value || ''}
//                     onChange={(e) => onChange(e.target.value.trim())}
//                     disabled={formState.isSubmitting || isCreating}
//                   />
//                 )}
//               />
//             </FormControl>

//             <FormControl>
//               <Controller
//                 name="isDefault"
//                 control={control}
//                 render={({ field: { onChange, value, ...field } }) => (
//                   <FormControlLabel
//                     {...field}
//                     control={
//                       <Checkbox
//                         checked={value}
//                         onChange={(e) => onChange(e.target.checked)}
//                         disabled={formState.isSubmitting || isCreating}
//                       />
//                     }
//                     label="Set as default profile"
//                   />
//                 )}
//               />
//             </FormControl>

//             <Alert severity="info">
//               This profile will be created with cryptographic keys for secure move signing. 
//               All data is stored locally on your device.
//             </Alert>
//           </Stack>
//           <DialogActions>
//             <Button type="button" onClick={onClose} disabled={isCreating}>
//               Cancel
//             </Button>
//             <Button 
//               type="submit"
//               variant="contained"
//               disabled={!formState.isValid || formState.isSubmitting || isCreating}
//             >
//               {isCreating ? 'Creating Profile...' : 'Create Player Profile'}
//             </Button>
//           </DialogActions>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }
