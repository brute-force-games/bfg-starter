import { DbGameTable, GameTableSeat } from "~/types/core/game-table/game-table"


interface IGameTableSeatDetailsComponentProps {
  gameSeat: GameTableSeat;
  gameTable: DbGameTable;
  maxNumPlayers: number;
}

export const GameTableSeatDetailsComponent = ({ gameSeat, gameTable, maxNumPlayers }: IGameTableSeatDetailsComponentProps) => {

  if (gameTable.tablePhase === "table-phase-lobby") {
    switch (gameSeat) {
      case "p1":
        return (
          <p>P1: {gameTable.p1}</p>
        )
      case "p2":
        return (
          maxNumPlayers > 1 && (
            <p>P2: {gameTable.p2}</p>
          )
        )
      case "p3":
        return (
          maxNumPlayers > 2 && (
            <p>P3: {gameTable.p3}</p>
          )
        )
      case "p4":
        return (
          maxNumPlayers > 3 && (
            <p>P4: {gameTable.p4}</p>
          )
        )
      case "p5":
        return (
          maxNumPlayers > 4 && (
            <p>P5: {gameTable.p5}</p>
          )
        )
      case "p6":
        return (
          maxNumPlayers > 5 && (
            <p>P6: {gameTable.p6}</p>
          )
        )
      case "p7":
        return (
          maxNumPlayers > 6 && (
            <p>P7: {gameTable.p7}</p>
          )
        )
      case "p8":
        return (
          maxNumPlayers > 7 && (
            <p>P8: {gameTable.p8}</p>
          )
        )
      default:
        return null;
    }
  }

  if (gameTable.tablePhase === "table-phase-game-in-progress") {
    const playerSeat = gameTable[gameSeat];

    if (!playerSeat) {
      return null;
    }
    
    return (
      <p>Game in progress - {gameSeat.toUpperCase()}</p>
    )
  }
  
  return (
    <div>
      <p>P1: {gameTable.p1}</p>
    </div>
  );
}