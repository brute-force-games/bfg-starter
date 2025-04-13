import { AvailableGameTitlesArray, AbfgSupportedGameTitle } from "~/types/bfg-game-engines/supported-games";
import { GameOnShelf } from "./game-on-shelf";
import { Stack } from "@mui/material";
import { useState } from "react";
import { StartGameWithFriendsDialog } from "~/dialogs/start-game-with-friends-dialog";
import { startGameTableWithFriends } from "~/data/bfg-db-game-tables";
import { NewGameTable } from "~/types/core/game-table/game-table";
import { DbGameFriendId } from "~/types/core/branded-values/branded-strings";
import { useLiveDefaultPlayerProfile } from "~/data/bfg-db-player-profiles";
import { useNavigate } from "react-router-dom";


export const GamesShelfPage = () => {

  const navigate = useNavigate();

  const [startTableGameTitle, setStartTableGameTitle] = useState<AbfgSupportedGameTitle | null>(null);

  const myProfile = useLiveDefaultPlayerProfile();

  const myProfileId = myProfile?.id;

  const handleStartTable = async (gameTitle: AbfgSupportedGameTitle, friendIds: DbGameFriendId[]) => {

    if (!myProfile || !myProfileId) {
      throw new Error("No default player profile/profile id");
    }

    const newGameTable: NewGameTable = {
      gameTitle,
      gameHostPlayerProfileId: myProfileId,
      tablePhase: "table-phase-lobby",
      sharedWith: [],
      p1: myProfileId,
      createdAt: new Date(),
      currentStatusDescription: "Game table created",
    }

    const inviterHandle = myProfile.handle;

    const inviteMessage = `Play ${gameTitle} with ${inviterHandle}`;
    
    const gameTable = await startGameTableWithFriends(newGameTable, inviteMessage, friendIds);

    setStartTableGameTitle(null);

    navigate(`/game-tables/${gameTable.id}/seat`);
  }

  return (
    <div>
      <h2>Brute Force Games Shelf</h2>
      <Stack spacing={2} direction="column" alignItems="center">
        {
          AvailableGameTitlesArray
            .map((title) => (
              <GameOnShelf key={title} title={title} onStartGame={() => setStartTableGameTitle(title)} />
            ))
        }
        {
            startTableGameTitle && (
            <StartGameWithFriendsDialog
              gameTitle={startTableGameTitle}
              onStart={handleStartTable}
              onClose={() => setStartTableGameTitle(null)}
            />
          )
        }
      </Stack>
    </div>
  );
};
