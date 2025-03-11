import { CardContent, Typography, CardActions, Button, Card } from "@mui/material";
import { BfgSupportedGameTitle } from "~/types/bfg-game-engines/supported-games";


interface GameOnShelfProps {
  title: BfgSupportedGameTitle;
  onStartGame: (gameTitle: BfgSupportedGameTitle) => void;
}

export const GameOnShelf = (props: GameOnShelfProps) => {
  const { title, onStartGame } = props;

  const handleStartGame = () => {
    onStartGame(title);
  }
  
  return (
    <Card sx={{ minWidth: 275, maxWidth: 275 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {title}
        </Typography>
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button size="small" onClick={handleStartGame}>Start a Table</Button>
      </CardActions>
    </Card>
  );
};
