import { GameLobby, LobbyOptions } from "~/models/p2p-lobby"
import { PlayerProfileId } from "~/types/core/branded-values/bfg-branded-ids"
import { PublicPlayerProfile } from "~/models/public-player-profile"
import { BfgShareableLinkComponent } from "../bfg-shareable-link-component"
// Commented out - imports not currently used
// import { 
//   Box, 
//   Typography, 
//   Button, 
//   Stack, 
//   Chip,
//   Gamepad
// } from "@bfg-engine"
import { PrivatePlayerProfile } from "~/models/private-player-profile"
import { BfgSupportedGameTitles } from "~/types/bfg-game-engines/supported-games"


interface IGamePlayerStateComponentProps {
  // playerProfiles: Map<PlayerProfileId, PublicPlayerProfile>
  // lobbyState: GameLobby
  // currentPlayerProfile: PrivatePlayerProfile
  // lobbyOptions: LobbyOptions

  // onSelectGameChoice: (gameChoice: BfgSupportedGameTitles) => void
  // onTakeSeat: () => void
  // onLeaveSeat: () => void
}

export const GamePlayerStateComponent = ({
  // playerProfiles,
  // lobbyState,
  // currentPlayerProfile,
  // lobbyOptions,
  // onSelectGameChoice,
  // onTakeSeat,
  // onLeaveSeat,
}: IGamePlayerStateComponentProps) => {

  return (
    <div>
      <h1>Game Player State Component</h1>
    </div>
  )

  // const hostProfile = lobbyState.gameHostPlayerProfile as PublicPlayerProfile;

  // const playerRangeLabel = lobbyState.minNumPlayers === lobbyState.maxNumPlayers ? 
  //   `${lobbyState.minNumPlayers} players` :
  //   `${lobbyState.minNumPlayers} - ${lobbyState.maxNumPlayers} players`;

  
  // const joinLobbyLink = `${window.location.origin}/join-lobby/${lobbyState.id}`;

  // const getPlayerProfile = (playerId: PlayerProfileId) => {
  //   const playerProfile = playerProfiles.get(playerId);
  //   if (playerProfile) {
  //     return playerProfile;
  //   }

  //   if (currentPlayerProfile.id === playerId) {
  //     return currentPlayerProfile;
  //   }

  //   return playerProfile;
  // }
  
  // return (
  //   <Box>
  //     <Stack spacing={2}>
  //       {/* Lobby Status */}
  //       <Box>
  //         <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
  //           <Typography variant="h6" component="h2" gutterBottom>
  //             {lobbyState.lobbyName}
  //           </Typography>
  //           <Chip 
  //             label={`${lobbyState.playerPool.length} players`}
  //             variant="outlined"
  //             size="small"
  //           />
  //         </Stack>
  //         <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontStyle: 'italic' }}>
  //           hosted by {hostProfile.handle}
  //         </Typography>
  //       </Box>

  //       {/* Game Selection */}
  //       <Box>
  //         <Typography variant="h6" component="h2" gutterBottom>
  //           Game Selection
  //         </Typography>
  //         <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mb: 2 }}>
  //           <Gamepad sx={{ color: 'primary.main' }} />
  //           <Typography variant="body1">
  //             {lobbyState.gameTitle || "No game selected"}
  //           </Typography>
  //           {lobbyState.gameTitle && (
  //             <Chip 
  //               label={`${playerRangeLabel}`}
  //               variant="outlined"
  //               size="small"
  //             />
  //           )}
  //         </Stack>
          
  //         {/* Game Choice Buttons */}
  //         <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
  //           {lobbyOptions.gameChoices.map(choice => (
  //             <Button
  //               key={choice}
  //               variant={lobbyState.gameTitle === choice ? "contained" : "outlined"}
  //               size="small"
  //               onClick={() => onSelectGameChoice(choice)}
  //               sx={{ minWidth: 'auto' }}
  //             >
  //               {choice}
  //             </Button>
  //           ))}
  //         </Stack>
  //       </Box>

  //       {/* Player Pool */}
  //       <Box>
  //         <Typography variant="h6" component="h2" gutterBottom>
  //           Player Pool
  //         </Typography>
  //         <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
  //           <Typography variant="body2" color="text.secondary">
  //             [{lobbyState.playerPool.length}/{lobbyState.maxNumPlayers}]
  //           </Typography>
  //         </Stack>
          
  //         {/* Seat Management */}
  //         <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
  //           <Button
  //             variant="contained"
  //             size="small"
  //             onClick={onTakeSeat}
  //             disabled={lobbyState.playerPool.length >= lobbyState.maxNumPlayers || lobbyState.playerPool.includes(currentPlayerProfile.id)}
  //             color="primary"
  //           >
  //             Take Seat
  //           </Button>
  //           <Button
  //             variant="outlined"
  //             size="small"
  //             onClick={onLeaveSeat}
  //             disabled={!lobbyState.playerPool.includes(currentPlayerProfile.id)}
  //             color="secondary"
  //           >
  //             Leave Seat
  //           </Button>
  //         </Stack>
          
  //         <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
  //           {lobbyState.playerPool.map(playerId => {
  //             const playerProfile = getPlayerProfile(playerId);
  //             if (!playerProfile) {
  //               return (
  //                 <Chip 
  //                   key={playerId}
  //                   label={`${playerId} (name not available)`}
  //                   variant="outlined"
  //                   color="error"
  //                   size="small"
  //                 />
  //               );
  //             }
  //             const isCurrentPlayer = playerId === playerProfile.id;
  //             return (
  //               <Chip 
  //                 key={playerId}
  //                 label={playerProfile.handle}
  //                 variant={isCurrentPlayer ? "filled" : "outlined"}
  //                 color={isCurrentPlayer ? "primary" : "default"}
  //                 size="small"
  //               />
  //             );
  //           })}
  //           {lobbyState.playerPool.length === 0 && (
  //             <Typography variant="body2" color="text.secondary" fontStyle="italic">
  //               No players in pool
  //             </Typography>
  //           )}
  //         </Stack>
  //       </Box>
        
  //       {/* Join Link */}
  //       <Box>
  //         <BfgShareableLinkComponent
  //           variant="standard"
  //           linkLabel="Join Lobby Link"
  //           linkUrl={joinLobbyLink}
  //         />
  //       </Box>
  //     </Stack>
  //   </Box>
  // )
}
