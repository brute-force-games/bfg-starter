import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  Stack,
  TextField,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
} from '@mui/material';
import { NewPlayerProfileParameters, NewPlayerProfileParametersSchema } from '~/types/core/player-profile/player-profile';
import { Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useBfgWhoAmIContext } from '~/state/who-am-i/BfgWhoAmIContext';
import { PrivatePlayerProfile } from '~/models/private-player-profile';
import { usePlayerProfileActions, useMyPlayerProfiles } from '~/hooks/stores/use-my-player-profiles-store';

interface AddPlayerProfileDialogProps {
  allDataItems: PrivatePlayerProfile[];
  onNewDataItemCreated: (playerProfile: PrivatePlayerProfile) => void;
  onClose: () => void;
}

export const TinyBaseAddPlayerProfileDialog = ({ allDataItems, onNewDataItemCreated, onClose }: AddPlayerProfileDialogProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const { addProfile } = usePlayerProfileActions();

  const defaultNewHandleValue = "Player";

  interface FormData {
    handle: string;
    avatarImageUrl?: string;
    isDefault: boolean;
  }

  const defaultFormValues: FormData = {
    handle: defaultNewHandleValue,
    avatarImageUrl: '',
    isDefault: false,
  }

  const doesHandleAlreadyExist = (handle: string) => {
    return allDataItems?.some(playerProfile => playerProfile.handle === handle);
  }

  const formSchema = NewPlayerProfileParametersSchema.extend({
    avatarImageUrl: z.string().optional(),
    isDefault: z.boolean(),
  }).refine(
    (data) => !doesHandleAlreadyExist(data.handle),
    {
      message: "You already have a profile with this handle",
      path: ["handle"]
    }
  );

  const { control, handleSubmit, formState, trigger } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  // Trigger validation when component mounts
  useEffect(() => {
    trigger('handle');
  }, [trigger]);

  const { errors } = formState;

  const onSubmit = async (formData: FormData) => {
    setIsCreating(true);
    setCreateError(null);

    try {
      console.log("Creating player profile with TinyBase:", formData);
      
      // Add profile to TinyBase store
      const profileId = await addProfile(
        formData.handle,
        formData.avatarImageUrl || undefined,
        formData.isDefault
      );

      // Get the created profile from the store
      const { playerProfileStore } = await import('~/store/player-profile-store');
      const profileData = playerProfileStore.getRow('playerProfiles', profileId);
      
      if (!profileData) {
        throw new Error('Failed to retrieve created profile');
      }

      const newProfile: PrivatePlayerProfile = {
        id: profileId,
        handle: profileData.handle,
        avatarImageUrl: profileData.avatarImageUrl || undefined,
        publicKey: profileData.publicKey,
        privateKey: profileData.privateKey,
        isDefault: profileData.isDefault,
        createdAt: new Date(profileData.createdAt),
        updatedAt: new Date(profileData.updatedAt),
      };

      console.log("Created player profile:", newProfile);
      onNewDataItemCreated(newProfile);
      onClose();
    } catch (error) {
      console.error("Error creating player profile:", error);
      setCreateError(error instanceof Error ? error.message : 'Failed to create player profile');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog 
      open={true} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Add Player Profile (TinyBase)
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3} sx={{ mt: 2 }}>
            {createError && (
              <Alert severity="error">
                {createError}
              </Alert>
            )}
            
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
                    disabled={formState.isSubmitting || isCreating}
                  />
                )}
              />
            </FormControl>

            <FormControl error={!!errors.avatarImageUrl}>
              <Controller
                name="avatarImageUrl"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <TextField
                    {...field}
                    label="Avatar Image URL (optional)"
                    error={!!errors.avatarImageUrl}
                    helperText={errors.avatarImageUrl?.message}
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value.trim())}
                    disabled={formState.isSubmitting || isCreating}
                  />
                )}
              />
            </FormControl>

            <FormControl>
              <Controller
                name="isDefault"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <FormControlLabel
                    {...field}
                    control={
                      <Checkbox
                        checked={value}
                        onChange={(e) => onChange(e.target.checked)}
                        disabled={formState.isSubmitting || isCreating}
                      />
                    }
                    label="Set as default profile"
                  />
                )}
              />
            </FormControl>

            <Alert severity="info">
              This profile will be created with cryptographic keys for secure move signing. 
              All data is stored in TinyBase and persisted locally on your device.
            </Alert>
          </Stack>
          <DialogActions>
            <Button type="button" onClick={onClose} disabled={isCreating}>
              Cancel
            </Button>
            <Button 
              type="submit"
              variant="contained"
              disabled={!formState.isValid || formState.isSubmitting || isCreating}
            >
              {isCreating ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Creating Profile...
                </>
              ) : (
                'Create Player Profile'
              )}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};
