import { asHostStartGame } from "~/data/dexie-data-ops/as-host-start-game";
import { DbPlayerProfileId } from "~/types/core/branded-values/branded-strings";
import { DbGameTable } from "~/types/core/game-table/game-table";
import { Button } from "@mui/material";


export type IGameTableHostSeatComponentProps = {
  myPlayerId: DbPlayerProfileId;
  gameTable: DbGameTable;
}


// const NotReadyToStartGameComponent = () => {
//   return <div>Not ready to start game</div>;
// }

// const ReadyToStartGameComponent = () => {
//   return <div>Ready to start game</div>;
// }

// const GameInProgressComponent = () => {
//   return <div>Game is already in progress</div>;
// }

export const GameTableHostSeatComponent = (props: IGameTableHostSeatComponentProps) => {

  const { myPlayerId, gameTable } = props;

  if (myPlayerId !== gameTable.gameHostPlayerProfileId) {
    return <div>I am not the host</div>;
  }


  const NotReadyToStartGameComponent = () => {
    return <div>Not ready to start game</div>;
  }

  const ReadyToStartGameComponent = () => {
    return (
      <Button onClick={async () => {
        console.log("ReadyToStartGameComponent:", gameTable);
        await asHostStartGame(gameTable.id, myPlayerId);
      }}>
        Start Game
      </Button>
    )
  }

  const GameInProgressComponent = () => {
    return <div>Game is in progress</div>;
  }

  const getHostActionComponent = () => {
    if (gameTable.tablePhase === "table-phase-lobby") {
      if (gameTable.p1 && gameTable.p2) {
        return <ReadyToStartGameComponent />;
      }
      return <NotReadyToStartGameComponent />;
    }

    return <GameInProgressComponent />;
  }

  const hostActionComponent = getHostActionComponent();

  // if (gameTable.tablePhase === "table-phase-lobby") {
  //   if (gameTable.p1 && gameTable.p2) {
  //     return <ReadyToStartGameComponent />;
  //   }
  //   return <NotReadyToStartGameComponent />;
  // }

  // return <GameInProgressComponent />;


  return (
    <div>
      <p>I am host</p>
      {hostActionComponent}
      {/* <Button onClick={async () => {
        console.log("GameTableHostSeatPage: gameTable", gameTable);
        await asHostStartGame(gameTable.id, myPlayerId);
      }}>
        Start Game
      </Button> */}
    </div>
  )
};
