import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  FormControl,
  FormGroup,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
} from '@mui/material';
import { AvailableGameTitleChoice } from '~/types/enums/game-shelf';
import { useBfgWhoAmIContext } from '~/state/who-am-i/BfgWhoAmIContext';
import { NewGameTable, DbGameTable, NewGameTableSchema } from '~/types/core/game-table/game-table';
import { AvailableGameTitles } from '~/types/bfg-game-engines/supported-games';



interface CreateNewGameTableDialogProps {
  allDataItems: DbGameTable[];
  onNewDataItemCreated: (data: NewGameTable) => void;
  onClose: () => void;
}


export const CreateNewGameTableDialog = ({ onNewDataItemCreated, onClose }: CreateNewGameTableDialogProps) => {
  const { defaultPlayerProfileId: playerId } = useBfgWhoAmIContext();

  if (!playerId) {
    throw new Error("Player ID is required");
  }

  const { control, handleSubmit, formState, setValue } = useForm<NewGameTable>({
    resolver: zodResolver(NewGameTableSchema),
    defaultValues: {
      gameHostPlayerProfileId: playerId,
      p1: playerId,
      gameTitle: 'Tic Tac Toe' as AvailableGameTitleChoice,
      createdAt: new Date(),
      sharedWith: [],
      tablePhase: 'table-phase-lobby',
      // latestActionId: BfgGameTableActionId.createId(),
    },
    mode: 'onChange',
  });

  const { errors } = formState;

  // const { errors, isValid } = formState;
  // const gameTitle = watch('gameTitle');
  // const formValues = watch();

  // console.log("form state:", formState);
  // console.log("current game title:", gameTitle);
  // console.log("form is valid:", isValid);
  // console.log("form errors:", errors);
  // console.log("all form values:", formValues);
  // console.log("playerId:", playerId);

  if (!playerId) {
    return null;
  }

  const onSubmit = async (formData: NewGameTable) => {
    try {
      // You can add any pre-submission logic here
      console.log("Starting form submission...");
      
      // Example: Validate something before proceeding
      if (!formData.gameTitle) {
        throw new Error("Game title is required");
      }

      // const selectedGameTitle = AvailableGameTitles.find((title) => title === formData.gameTitle);

      // if (!selectedGameTitle) {
      //   throw new Error("Game title is required");
      // }

      // const selectedGameProcessor = BfgGameEngineMetadata[selectedGameTitle];

      // const initialGameState = selectedGameProcessor.createInitialGameState(formData);

      // const initialGameTableAction = selectedGameProcessor.createInitialGameTableAction(formData.id);

      // const initialGameTableActionJson = selectedGameProcessor.createJson(initialGameTableAction);

      // Example: Make an API call
      // const response = await api.createGameTable(formData);
      
      // Example: Update some state
      // setSomeState(formData.someValue);
      
      // Example: Show a success message
      // toast.success("Game table created successfully!");
      
      // const updatedFormData = {
      //   ...formData,
      //   latestActionId: initialGameTableAction.id,
      //   // gameState: initialGameState,
      //   // gameTableActions: [initialGameTableActionJson],
      // }

      // Call the original handler
      onNewDataItemCreated(formData as DbGameTable);
      
      // Close the dialog
      onClose();
      
      // You can add any post-submission logic here
      console.log("Form submission completed successfully");
    } catch (error) {
      // Handle any errors that occur during submission
      console.error("Error submitting form:", error);
      // Example: Show error message to user
      // toast.error("Failed to create game table");
    }
  };

  const handleSelectedGameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newGameTitle = event.target.value as AvailableGameTitleChoice;
    console.log(`handleSelectedGameChange: ${newGameTitle}`);
    setValue('gameTitle', newGameTitle);
  };


  return (
    <Dialog 
      open={true} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Set Up Game Table
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <FormControl error={!!errors.gameTitle}>
              <FormGroup>
                <Controller
                  name="gameTitle"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      {...field}
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                        handleSelectedGameChange(e);
                      }}
                    >
                      {[...AvailableGameTitles].sort().map((title) => (
                        <FormControlLabel
                          key={title}
                          control={<Radio value={title} />}
                          label={title}
                        />
                      ))}
                    </RadioGroup>
                  )}
                />
              </FormGroup>
              
              {errors && (
                // <FormHelperText>{errors.message}</FormHelperText>
                <div>Errors: {JSON.stringify(errors)}</div>
              )}
            </FormControl>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <Button onClick={onClose}>Cancel</Button>
              <Button 
                type="submit"
                variant="contained"
                // onClick={() => {
                //   console.log("Submit button clicked");
                //   console.log("Current form values:", control._formValues);
                // }}
              >
                Create Game Table
              </Button>
            </div>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  );
}
