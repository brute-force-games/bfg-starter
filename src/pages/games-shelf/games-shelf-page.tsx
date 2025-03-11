import { AvailableGameTitlesArray, BfgSupportedGameTitle } from "~/types/bfg-game-engines/supported-games";
import { GameOnShelf } from "./game-on-shelf";
import { Stack } from "@mui/material";
import { useState } from "react";
import { StartGameWithFriendsDialog } from "~/dialogs/start-game-with-friends-dialog";
import { startGameTableWithFriends } from "~/data/bfg-db-game-tables";
import { NewGameTable } from "~/types/core/game-table/game-table";
import { DbGameFriendId } from "~/types/core/branded-values/branded-strings";
import { useLiveDefaultPlayerProfile } from "~/data/bfg-db-player-profiles";


export const GamesShelfPage = () => {

  const [startTableGameTitle, setStartTableGameTitle] = useState<BfgSupportedGameTitle | null>(null);

  const myProfile = useLiveDefaultPlayerProfile();

  const myProfileId = myProfile?.id;

  const handleStartTable = async (gameTitle: BfgSupportedGameTitle, friendIds: DbGameFriendId[]) => {

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
    }

    const inviterHandle = myProfile.handle;

    const inviteMessage = `Play ${gameTitle} with ${inviterHandle}`;
    
    await startGameTableWithFriends(newGameTable, inviteMessage, friendIds);
    setStartTableGameTitle(null);
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
