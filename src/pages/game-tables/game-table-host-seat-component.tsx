import { asHostStartGame } from "~/data/dexie-data-ops/as-host-start-game";
import { DbPlayerProfileId } from "~/types/core/branded-values/branded-strings";
import { DbGameTable } from "~/types/core/game-table/game-table";
import { Button } from "@mui/material";


export type IGameTableHostSeatComponentProps = {
  myPlayerId: DbPlayerProfileId;
  gameTable: DbGameTable;
}


export const GameTableHostSeatComponent = (props: IGameTableHostSeatComponentProps) => {

  const { myPlayerId, gameTable } = props;

  if (myPlayerId !== gameTable.gameHostPlayerId) {
    return <div>I am not the host</div>;
  }

  return (
    <div>
      <p>I am host</p>
      <Button onClick={async () => {
        console.log("GameTableHostSeatPage: gameTable", gameTable);
        await asHostStartGame(gameTable.id, myPlayerId);
      }}>
        Start Game
      </Button>
    </div>
  )
};
