import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Stack,
} from '@mui/material';
import { useLiveFriends } from '~/data/bfg-db-friends';
import { DbGameLobbyId } from '~/types/core/branded-values/branded-strings';
import { DbGameFriendId } from '~/types/core/branded-values/branded-strings';
import { useLiveGameTables } from '~/data/bfg-db-game-tables';


interface ShareWithFriendsDialogProps {
  onShare: (lobbyId: DbGameLobbyId, friendIds: DbGameFriendId[]) => void;
  onClose: () => void;
}

export const ShareWithFriendsDialog = ({ onShare, onClose }: ShareWithFriendsDialogProps) => {
  const [selectedLobbyId, setSelectedLobbyId] = useState<DbGameLobbyId | ''>('');
  const [selectedFriendIds, setSelectedFriendIds] = useState<DbGameFriendId[]>([]);

  const gameTables = useLiveGameTables();
  const friends = useLiveFriends();

  const handleShare = () => {
    if (selectedLobbyId && selectedFriendIds.length > 0) {
      onShare(selectedLobbyId, selectedFriendIds);
      onClose();
    }
  };

  const handleFriendToggle = (friendId: DbGameFriendId) => {
    setSelectedFriendIds(prev => {
      if (prev.includes(friendId)) {
        return prev.filter(id => id !== friendId);
      } else {
        return [...prev, friendId];
      }
    });
  };

  return (
    <Dialog 
      open={true} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Share Game Table with Friends
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Select Lobby</InputLabel>
            <Select
              value={selectedLobbyId}
              label="Select Lobby"
              onChange={(e) => setSelectedLobbyId(e.target.value as DbGameLobbyId)}
            >
              {gameTables?.map(gameTable => (
                <MenuItem key={gameTable.id} value={gameTable.id}>
                  {gameTable.gameTitle} (ID: {gameTable.id})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedFriendIds.length === friends?.length}
                  indeterminate={selectedFriendIds.length > 0 && selectedFriendIds.length < (friends?.length || 0)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedFriendIds(friends?.map(f => f.id!) || []);
                    } else {
                      setSelectedFriendIds([]);
                    }
                  }}
                />
              }
              label="Select All Friends"
            />
            {friends?.map(friend => (
              <FormControlLabel
                key={friend.id}
                control={
                  <Checkbox
                    checked={selectedFriendIds.includes(friend.id!)}
                    onChange={() => handleFriendToggle(friend.id!)}
                  />
                }
                label={`${friend.name} (${friend.email})`}
              />
            ))}
          </FormGroup>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleShare}
          variant="contained"
          disabled={!selectedLobbyId || selectedFriendIds.length === 0}
        >
          Share
        </Button>
      </DialogActions>
    </Dialog>
  );
};
