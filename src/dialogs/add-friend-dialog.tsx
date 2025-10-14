// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import {
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   FormControl,
//   Stack,
//   TextField} from '@bfg-engine';
// import { NewGameFriendParameters, NewGameFriendParametersSchema } from '~/types/core/friend-account/friend';
// import { Controller } from 'react-hook-form';


// interface AddFriendDialogProps {
//   onCreateNewFriend: (friendParameters: NewGameFriendParameters) => void;

//   onClose: () => void;
// }

// export const AddFriendDialog = ({ onCreateNewFriend, onClose }: AddFriendDialogProps) => {

//   const defaultFormValues: NewGameFriendParameters = {
//     name: "",
//     email: "",
//   }

//   const { control, handleSubmit, formState } = useForm<NewGameFriendParameters>({
//     resolver: zodResolver(NewGameFriendParametersSchema),
//     defaultValues: defaultFormValues,
//   });

//   const { errors } = formState;

//   console.log("control:", control);

//   const onSubmit = async (formData: NewGameFriendParameters) => {

//     console.log("onSubmit form values:", formData);
//     onCreateNewFriend(formData);

//     onClose();
//   };
  

//   return (
//     <Dialog 
//       open={true} 
//       onClose={onClose}
//       maxWidth="sm"
//       fullWidth
//     >
//       <DialogTitle>
//         Add Friend
//       </DialogTitle>
//       <DialogContent>
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <Stack spacing={3} style={{ marginTop: '16px' }}>
//             <FormControl error={!!errors.name}>
//               <Controller
//                 name="name"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     {...field}
//                     label="Friend's Name"
//                     error={!!errors.name}
//                     helperText={errors.name?.message}
//                   />
//                 )}
//               />
//             </FormControl>

//             <FormControl error={!!errors.email}>
//               <Controller
//                 name="email"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     {...field}
//                     label="Friend's Email"
//                     type="email"
//                     error={!!errors.email}
//                     helperText={errors.email?.message}
//                   />
//                 )}
//               />
//             </FormControl>
//           </Stack>
//         </form>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button 
//           onClick={handleSubmit(onSubmit)}
//           variant="contained"
//           disabled={!formState.isValid || formState.isSubmitting}
//         >
//           Add Friend
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }
