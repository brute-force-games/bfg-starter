// import { Typography } from "@mui/material";
// import { Link } from "react-router-dom";
// import { GameLobbyComplete } from "../../../../types/core/game-lobby";
// import { createSpectatorUrl } from "../../../../data/url-factory";
// import { createDev4Url } from "../../../../data/url-factory";
// import { createDevHostUrl } from "../../../../data/url-factory";


// interface IHostLinksFormProps {
//   lobby: GameLobbyComplete;
// }

// export const HostLinksForm = (props: IHostLinksFormProps) => {
//   const { lobby } = props;
//   const gameUrl = lobby.status.gameUrl;
//   const gameId = lobby.gameTbId;

//   const spectatorUrl = createSpectatorUrl(gameId);
//   const dev4Url = createDev4Url(gameId);
//   const devHostUrl = createDevHostUrl(gameId, lobby.gameHostPlayerId);

  
//   return (
//     <>
//       <Typography variant="subtitle1">
//         Game URL: <Link to={gameUrl}>{gameUrl}</Link>
//       </Typography>
//       <Typography variant="subtitle1">
//         Spectator URL: <Link to={spectatorUrl}>{spectatorUrl}</Link>
//       </Typography>
//       <Typography variant="subtitle1">
//         Dev4 URL: <Link to={dev4Url}>{dev4Url}</Link>
//       </Typography>
//       <Typography variant="subtitle1">
//         Dev Host URL: <Link to={devHostUrl}>{devHostUrl}</Link>
//       </Typography>
//     </>
//   );
// }
