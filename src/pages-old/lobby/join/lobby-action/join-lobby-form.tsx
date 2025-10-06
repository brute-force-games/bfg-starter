// import { Button, Stack, TextField } from "@mui/material";
// import { Controller, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { GameLobbyInProgress } from "../../../../types/core/game-lobby";
// import { PlayerId } from "../../../../types/core/branded-values/bs-player-id";
// import { PlayerInLobby, PlayerInLobbySchema } from "../../../../types/player/player";


// interface IJoinLobbyFormProps {
//   lobby: GameLobbyInProgress;
//   myPlayerId: PlayerId;
//   onPlayerJoinsLobby: (player: PlayerInLobby) => void;
// }


// export const JoinLobbyForm = (props: IJoinLobbyFormProps) => {
//   const { lobby, myPlayerId, onPlayerJoinsLobby } = props;
//   const { players, } = lobby;

//   const isMyPlayerInLobby = players.some((player) => player.playerId === myPlayerId);
//   if (isMyPlayerInLobby) {
//     throw new Error("My player is already in the lobby");
//   }


//   const { control, handleSubmit, formState: { errors } } = useForm<PlayerInLobby>({
//     resolver: zodResolver(PlayerInLobbySchema),
//     defaultValues: {
//       playerId: myPlayerId,
//       name: "Player " + (players.length + 1),
//     },
//   });

//   const onSubmit = async (data: PlayerInLobby) => {
//     console.log(data);

//     const myPlayerData: PlayerInLobby = {
//       playerId: myPlayerId,
//       name: data.name,
//     };

//     onPlayerJoinsLobby(myPlayerData);
//   }

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <Stack spacing={3}>
//         { !isMyPlayerInLobby && (
//           <Controller
//             name="name"
//             control={control}
//             render={({ field }) => (
//               <TextField
//                 {...field}
//                 label="Player Name"
//                 variant="outlined"
//                 fullWidth
//                 error={!!errors.name}
//                 helperText={errors.name?.message}
//                 disabled={isMyPlayerInLobby}
//               />
//             )}
//           />
//         )}

//           <Button
//             type="submit"
//             variant="contained"
//             size="large"
//             fullWidth
//           >
//             Join Lobby
//           </Button>
        
//         {/* {isMyPlayerInLobby ? (
//           <Button
//             type="submit"
//             variant="contained"
//             size="large"
//             fullWidth
//           >
//             Leave Lobby
//           </Button>
//         ) : (
//           <Button
//             type="submit"
//             variant="contained"
//             size="large"
//             fullWidth
//           >
//             Join Lobby
//           </Button>
//         )} */}
// {/* 
//         {isGameReady ? (
//           <Button
//             variant="contained"
//             size="large"
//             fullWidth
//           >
//             Go to Game
//           </Button>
//         ) : (
//           <div>
//             Waiting for game to start...
//           </div>
//         )} */}
//       </Stack>
//     </form>
//   );
// }