import { Button } from "@mui/material";


interface ILeaveLobbyFormProps {
  onPlayerLeavesLobby: () => void;
}

export const LeaveLobbyForm = (props: ILeaveLobbyFormProps) => {
  
  return (
    <Button
      onClick={props.onPlayerLeavesLobby}
      variant="contained"
      size="large"
      fullWidth
    >
      Leave Lobby
    </Button>
  );
}
