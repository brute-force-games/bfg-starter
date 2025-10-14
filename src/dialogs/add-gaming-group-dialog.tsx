// import { useEffect, useState } from 'react';
// import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, TextField } from '@bfg-engine';
// import { Controller, useForm } from 'react-hook-form';
// import { NewGamingGroup } from '~/types/core/play-group/play-group-db';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { NewGamingGroupParametersSchema } from '~/types/core/play-group/play-group';
// import { useLiveFriends } from '~/data/bfg-db-friends';
// import { DexieCloudEmail } from '~/types/core/branded-values/branded-strings';


// interface AddGamingGroupDialogProps {
//   onNewDataItemCreated: (data: NewGamingGroup) => void;
//   onClose: () => void;
// }


// export const AddGamingGroupDialog = ({ onNewDataItemCreated, onClose }: AddGamingGroupDialogProps) => {

//   const myFriends = useLiveFriends() || [];

//   const defaultFormValues: NewGamingGroup = {
//     name: 'My New Play Group',
//     memberIdentities: [],
//   }

//   const { control, handleSubmit, formState, trigger } = useForm<NewGamingGroup>({
//     resolver: zodResolver(NewGamingGroupParametersSchema),
//     defaultValues: defaultFormValues,
//     mode: 'onChange',
//     reValidateMode: 'onChange',
//   });

//   // Trigger validation when component mounts
//   useEffect(() => {
//     trigger('name');
//   }, [trigger]);

//   const { errors } = formState;

//   const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  

//   const handleFriendChange = (friend: string, included: boolean) => {
//     if (included) {
//       setSelectedFriends(prev => [...prev, friend]);
//     } else {
//       setSelectedFriends(prev => prev.filter(f => f !== friend));
//     }
//   };

//   const onSubmit = async (formData: NewGamingGroup) => {

//     const newPlayGroup: NewGamingGroup = {
//       name: formData.name,
//       memberIdentities: selectedFriends.map(friend => ({
//         dexieIdentity: { dexieEmailValue: friend as DexieCloudEmail }
//       }))
//     }

//     console.log("onSubmit form values:", newPlayGroup);
//     onNewDataItemCreated(newPlayGroup);

//     onClose();
//   };
  

//   return (
//     <Dialog
//       open={true}
//       onClose={onClose}
//       maxWidth="sm" 
//       fullWidth
//     >
//       <DialogTitle>Add Play Group</DialogTitle>
//       <DialogContent>
//         <div style={{ display: 'flex', flexDirection: 'column', paddingTop: '10px' }}>
//           <FormControl error={!!errors.name}>
//             <Controller
//               name="name"
//               control={control}
//               render={({ field }) => (
//                 <TextField 
//                   {...field}
//                   label="Group Name" 
//                   error={!!errors.name}
//                   helperText={errors.name?.message}
//                   fullWidth 
//                 />
//               )}
//             />
//           </FormControl>
//           {
//             myFriends.map(friend => (
//               <FormControlLabel 
//                 key={friend.email} 
//                 control={
//                   <Checkbox 
//                     checked={selectedFriends.includes(friend.email)}
//                     onChange={() => handleFriendChange(friend.email, !selectedFriends.includes(friend.email))}
//                   />
//                 } 
//                 label={friend.name} 
//               />
//             ))
//           }
//         </div>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button variant="contained" onClick={handleSubmit(onSubmit)}>Submit</Button>
//       </DialogActions>
//     </Dialog>
//   );
// }
