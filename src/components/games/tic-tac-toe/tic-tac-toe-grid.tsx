import { TicTacToeMove, TicTacToeGameState } from "~/types/game-engines/tic-tac-toe-engine";
import { Grid, Button, Typography, Box } from '@mui/material';

interface TicTacToeGridProps {
  gameState: TicTacToeGameState;
  onGameAction: (gameAction: TicTacToeMove) => void;
}

export const TicTacToeGrid = (props: TicTacToeGridProps) => {
  const { gameState, onGameAction } = props;

  const handleCellClick = (index: number) => {

    console.log("handleCellClick", index);

    if (gameState.board[index] !== '-') return;
    
    const cellNumber = (index + 1).toString() as '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
    onGameAction({
      moveCell: cellNumber,
      movePlayer: gameState.currentPlayer,
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
              disabled={cell !== '-' || gameState.resolution !== 'game-in-progress'}
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
          ? `Current player: ${gameState.currentPlayer === 'p1' ? 'X' : 'O'}`
          : gameState.resolution === 'game-over-draw'
            ? "Game Over - Draw!"
            : gameState.resolution === 'game-over-x-wins'
              ? "Game Over - X Wins!"
              : "Game Over - O Wins!"}
      </Typography>
    </Box>
  );
};
