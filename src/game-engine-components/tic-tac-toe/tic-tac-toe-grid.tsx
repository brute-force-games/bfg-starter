import { TicTacToeMove, TicTacToeGameState, TicTacToeMoveCell, getPlayerSeatSymbol, getCurrentPlayer } from "~/types/bfg-game-engines/tic-tac-toe-engine";
import { Grid, Button, Typography, Box } from '@mui/material';
import { GameTableSeat } from "~/models/game-table/game-table";


interface TicTacToeGridProps {
  myPlayerSeat: GameTableSeat;
  gameState: TicTacToeGameState;
  onGameAction: (gameState: TicTacToeGameState, gameAction: TicTacToeMove) => void;
}


export const TicTacToeGrid = (props: TicTacToeGridProps) => {
  const { myPlayerSeat, gameState, onGameAction } = props;

  const currentPlayer = getCurrentPlayer(gameState);
  const isMyTurn = currentPlayer === myPlayerSeat;
  const currentPlayerSymbol = getPlayerSeatSymbol(currentPlayer);
  const myPlayerSeatSymbol = getPlayerSeatSymbol(myPlayerSeat);

  console.log("IS MY TURN", isMyTurn);
  console.log("CURRENT PLAYER", currentPlayer, currentPlayerSymbol);
  console.log("MY PLAYER SEAT", myPlayerSeat, myPlayerSeatSymbol);

  const handleCellClick = (index: number) => {
    console.log("handleCellClick", index);

    if (gameState.board[index] !== '-') return;
    
    // Convert index to coordinate format (a1-c3)
    const row = Math.floor(index / 3) + 1;
    const colLetter = ['a', 'b', 'c'][index % 3];
    const moveCell = `${colLetter}${row}` as TicTacToeMoveCell;
    
    onGameAction(gameState, {
      actionType: 'game-table-action-player-move',
      moveCell,
      movePlayer: currentPlayer,
    });
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <Grid container spacing={1} sx={{ width: 'fit-content' }}>
        {gameState.board.split('').map((cell, index) => (
          <Grid item xs={4} key={index}>
            <Button
              variant="outlined"
              onClick={() => {
                console.log("onClick", index);
                handleCellClick(index);
              }}
              disabled={cell !== '-' || gameState.resolution !== 'game-in-progress' || !isMyTurn}
              sx={{
                width: 64,
                height: 64,
                fontSize: '2rem',
                fontWeight: 'bold',
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                },
              }}
            >
              {cell === '-' ? '' : cell}
            </Button>
          </Grid>
        ))}
      </Grid>
      <Typography variant="h6" fontWeight="semibold">
        {gameState.resolution === 'game-in-progress' 
          ? `Current player: ${currentPlayerSymbol} [I am ${myPlayerSeatSymbol}]`
          : gameState.resolution === 'game-over-draw'
            ? "Game Over - Draw!"
            : gameState.resolution === 'game-over-x-wins'
              ? "Game Over - X Wins!"
              : "Game Over - O Wins!"}
      </Typography>
    </Box>
  );
};
