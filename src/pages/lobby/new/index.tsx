import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Container,
  Typography,
  Button,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Paper,
  Stack,
  FormHelperText
} from '@mui/material';
import { GameLobbyInProgress, GameLobbyInProgressSchema, } from '../../../types/core/game-lobby';
import { GameOnShelf } from '../../../types/enums/game-shelf';
import UserInteractionWrapper from '../../sign-in/UserInteractionWrapper';
import { useLiveLobbies } from '../../../data/db-query';
import { useMyPlayerContext } from '../../../data/persisted-player/persisted-player-store';



export const CreateNewLobbyPage = () => {

  const [redirectToLobbyPath, _setRedirectToLobbyPath] = useState<string | null>(null);
  const { myPlayerId } = useMyPlayerContext();

  // const lobbyId = getUniqueId();
  // const gameId = getUniqueId();
  // const lobbyId = "lobby_123";
  // const gameId = "game_123";
  // const gameTbId = createGameId(gameId);
  // const lobbyTbId = createLobbyId(lobbyId);

  // const myPlayerId = "player_123" as PlayerId;

  const lobbies = useLiveLobbies();
  // const justSomeData = useLiveJustSomeData();

  console.log("lobbies", lobbies);
  // console.log("justSomeData", justSomeData);
  console.log("CreateNewLobbyPage");

  const defaultFormValues: GameLobbyInProgress = {
    // name: "My Secret Pyramid Game",
    // maxNumPlayers: 4,
    gameOnShelf: "TIC_TAC_TOE",
    gameHostPlayerId: myPlayerId,
    players: [],
    status: {
      started: false,
    },

    // lobbyTbId,
    // gameTbId,
    // randomSeed: "0",
  }

  const { control, handleSubmit, formState: { errors } } = useForm<GameLobbyInProgress>({
    resolver: zodResolver(GameLobbyInProgressSchema),
    defaultValues: defaultFormValues,
  });

  const onSubmit = async () => {

    // const lobbyStoreContent = createInitialLobbyStoreValue(lobbyParameters);

    // const newLobbySync = await createLobbyStateSyncStore(lobbyTbId);
    // const { persister, synchronizer } = newLobbySync;

    // await persister.save();
    // await synchronizer.startSync(lobbyStoreContent);
    // await synchronizer.save();

    // const lobbyPath = createLobbyPath(lobbyParameters.lobbyTbId);
    // setRedirectToLobbyPath(lobbyPath);

    // console.log("adding justSomeData");
    // const newJustSomeData = {
    //   // id: "123" + new Date().getTime(),
    //   name: "My Secret Pyramid Game",
    //   other: 123,
    // };

    // bfgDb.justSomeData.add(newJustSomeData);

    // console.log("newJustSomeData", newJustSomeData);

    // console.log("new justSomeData", justSomeData);

    // const q = await bfgDb.justSomeData.toArray();
    // console.log("q", q);
    
  };

  if (redirectToLobbyPath) {
    return (
      <Navigate to={redirectToLobbyPath} />
    );
  }

  return (
    <>
      <UserInteractionWrapper>

        {/* <Helmet>
          <title>SPG - Create Game Lobby</title>
        </Helmet> */}
        <Container 
          maxWidth="sm"
        >
          <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Start Game Lobby
            </Typography>

            {/* <Button onClick={() => {
              onSubmit();
            }}>Add Just Some Data</Button> */}

            {/* <ul>
              {justSomeData?.map((item) => (
                <li key={item.id}>{item.name}</li>
              ))}
            </ul> */}


            
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={3}>
              {/*   <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Lobby Name"
                      variant="outlined"
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  )}
                /> */}

                {/* <Controller
                  name="maxNumPlayers"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Max Number of Players"
                      type="number"
                      variant="outlined"
                      fullWidth
                      InputProps={{ inputProps: { min: 2, max: 6 } }}
                      error={!!errors.maxNumPlayers}
                      helperText={errors.maxNumPlayers?.message}
                    />
                  )}
                /> */}

                <FormControl error={!!errors.gameOnShelf}>
                  {/* <Typography variant="subtitle1" gutterBottom>
                    Select Game
                  </Typography> */}
                  <FormGroup>
                    {Object.entries(GameOnShelf).map(([key, value]) => (
                      <Controller
                        key={key}
                        name="gameOnShelf"
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={field.value === key}
                                onChange={(e) => {
                                  field.onChange(e.target.checked ? key : null);
                                }}
                              />
                            }
                            label={value}
                          />
                        )}
                      />
                    ))}
                  </FormGroup>
                  {errors.gameOnShelf && (
                    <FormHelperText>{errors.gameOnShelf.message}</FormHelperText>
                  )}
                </FormControl>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                >
                  Start Lobby
                </Button>
              </Stack>
            </form>
          </Paper>
        </Container>
      </UserInteractionWrapper>
    </>
  );
}
