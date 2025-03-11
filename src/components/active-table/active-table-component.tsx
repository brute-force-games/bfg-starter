import { DbGameTable } from "~/types/core/game-table/game-table";
import { GameTablePlayerOptionsComponent } from "../game-table-details/game-table-player-options-component";
import { PlayerProfileId } from "~/types/core/branded-values/bfg-branded-ids";


interface IActiveTableComponentProps {
  myPlayerProfileId: PlayerProfileId;
  table: DbGameTable;
} 


export const ActiveTableComponent = ({ myPlayerProfileId, table }: IActiveTableComponentProps) => {
  return (
    <div>
      <div>{table.gameTitle}</div>
      <div>{table.gameHostPlayerProfileId}</div>
      <GameTablePlayerOptionsComponent
        myPlayerProfileId={myPlayerProfileId}
        gameTable={table}
      />
    </div>
  );
};
