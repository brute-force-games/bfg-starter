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
import { useEffect } from 'react';


interface AddPlayerProfileDialogProps {
  allDataItems: NewPlayerProfileParameters[];
  onNewDataItemCreated: (playerProfileParameters: NewPlayerProfileParameters) => void;
  onClose: () => void;
}

export const AddPlayerProfileDialog = ({ allDataItems, onNewDataItemCreated, onClose }: AddPlayerProfileDialogProps) => {

  const defaultFormValues: NewPlayerProfileParameters = {
    handle: "Player",
  }

  const doesHandleAlreadyExist = (handle: string) => {
    return allDataItems?.some(playerProfile => playerProfile.handle === handle);
  }

  const formSchema = NewPlayerProfileParametersSchema.refine(
    (data) => !doesHandleAlreadyExist(data.handle),
    {
      message: "This handle is already taken",
      path: ["handle"]
    }
  );

  const { control, handleSubmit, formState, trigger } = useForm<NewPlayerProfileParameters>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  // Trigger validation when component mounts
  useEffect(() => {
    trigger('handle');
  }, [trigger]);

  // const { errors, isValid, isDirty } = formState;
  const { errors } = formState;

  // console.log("form state:", {
  //   errors,
  //   isValid,
  //   isDirty,
  //   values: control._formValues
  // });

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
                render={({ field: { onChange, value, ...field } }) => (
                  <TextField
                    {...field}
                    label="Profile Handle"
                    error={!!errors.handle}
                    helperText={errors.handle?.message}
                    value={value}
                    onChange={async (e) => {
                      const newValue = e.target.value.trim();
                      onChange(newValue);
                      await trigger('handle');
                    }}
                    disabled={formState.isSubmitting}
                  />
                )}
              />
            </FormControl>
          </Stack>
          <DialogActions>
            <Button type="button" onClick={onClose}>Cancel</Button>
            <Button 
              type="submit"
              variant="contained"
              disabled={!formState.isValid || formState.isSubmitting}
            >
              Add Player Profile
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
