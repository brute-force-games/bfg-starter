import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  Stack,
  TextField} from '@mui/material';
import { NewPlayerProfileParameters, NewPlayerProfileParametersSchema } from '~/types/core/player-profile/player-profile';
import { Controller } from 'react-hook-form';


interface AddPlayerProfileDialogProps {
  onNewDataItemCreated: (playerProfileParameters: NewPlayerProfileParameters) => void;

  onClose: () => void;
}

export const AddPlayerProfileDialog = ({ onNewDataItemCreated, onClose }: AddPlayerProfileDialogProps) => {

  const defaultFormValues: NewPlayerProfileParameters = {
    handle: "bob",
  }

  const { control, handleSubmit, formState } = useForm<NewPlayerProfileParameters>({
    resolver: zodResolver(NewPlayerProfileParametersSchema),
    defaultValues: defaultFormValues,
  });

  const { errors } = formState;

  console.log("control:", control);

  const onSubmit = async (formData: NewPlayerProfileParameters) => {

    console.log("onSubmit form values:", formData);
    onNewDataItemCreated(formData);

    onClose();
  };
  

  return (
    <Dialog 
      open={true} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Add Player Profile
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <FormControl error={!!errors.handle}>
              <Controller
                name="handle"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Player Profile Handle"
                    error={!!errors.handle}
                    helperText={errors.handle?.message}
                  />
                )}
              />
            </FormControl>
          </Stack>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit(onSubmit)}
          variant="contained"
        >
          Add Player Profile
        </Button>
      </DialogActions>
    </Dialog>
  );
}
