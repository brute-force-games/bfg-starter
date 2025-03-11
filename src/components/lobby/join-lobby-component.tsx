import { useLiveGameTable } from "~/data/bfg-db-game-tables";
import { Typography, Stack } from "@mui/material";
import { DbGameTableId } from "~/types/core/branded-values/branded-strings";
import { useBfgWhoAmIContext } from "~/state/who-am-i/BfgWhoAmIContext";


interface IJoinGameTableComponentProps {
  gameTableId: DbGameTableId;
}

export const JoinGameTableComponent = ({ gameTableId }: IJoinGameTableComponentProps) => {

  // const myPlayerProfile = useMyPlayerProfile();
  const { dexieStatus, defaultPlayerProfileId: playerId } = useBfgWhoAmIContext();

  // const [openShareDialog, setOpenShareDialog] = useState(false);
  // const [timer, setTimer] = useState(0);
  const gameTable = useLiveGameTable(gameTableId);

  console.log("JoinGameTableComponent: gameTable", gameTable);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setTimer(prev => prev + 1);
  //     bfgDb.cloud.sync({purpose: 'pull', wait: false}) 
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, []);






  return (
    <div>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">

          <Typography variant="h5">
            {/* <Link to={createLobbyUrl(lobbyId)}> */}
              Join Lobby
            {/* </Link> */}
          </Typography>
          <Typography>
              My Dexie Email: {dexieStatus.dexieEmailValue}
          </Typography>
          <Typography>
              My Player Id: {playerId}
          </Typography>
        </Stack>
      </Stack>
    </div>
  );
};
