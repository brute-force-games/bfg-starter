// import { Route, Routes } from "react-router-dom";
// import { LandingPage } from "./App";


// export const BfgAppRoutes = () => {

//   return (
//     <Routes>
//       <Route path="/" element={<LandingPage />} />
// {/* 
//       <Route path="/about" element={<AboutPage />} />
//       <Route path="/doneblock-graphs/:projectGraphId" element={<DoneBlockGraphPage />} />
//       <Route path="/doneblock-templates" element={<AllDoneBlockTemplates />} />
//       <Route path="/doneblocks/:projectId" element={<DoneBlockForIdPage />} />
//       <Route path="/github-issues" element={<GitHubIssuesPage />} />
//       <Route path="/my-doneblocks" element={<MyDoneBlocksPage />} />
//       <Route path="/user-settings" element={<UserSettingsPage />} />
//       <Route path="/my-profile" element={<MyDoneBlockProfilePage />} />
//       <Route path={MANAGE_SYNC_PAGE_PATH} element={<ManageSyncPage />} />
//       <Route path="/raw-data" element={<RawDataPage />} />
//       <Route path="/dexie-status" element={<DexieStatusPage />} /> */}
//     </Routes>  
//   );
// }


import { createBrowserRouter } from 'react-router-dom';
// import { Layout } from './components/Layout';
import { LandingPage } from './pages/landing/landing-page';
import { NotFound } from './pages/NotFound';
import { Layout } from './components/Layout';
// import { CreateNewLobbyPage } from './pages/lobby/new';
import { MyFriendsPage } from './pages/my-friends/my-friends-page';
// import { MyGamesPage } from './pages/my-games/my-games-page';
import { MyPlayerProfilesPage } from './pages/my-player-profiles/my-player-profiles-page';
// import { MyLobbiesPage } from './pages/my-lobbies/my-lobbies-page';
import { DexieStatusPage } from './pages/dexie-status/dexie-status-page';
// import { MyLobbyDetailsPage } from './pages/my-lobby-details-page';
import { MyFriendDetailsPage } from './pages/my-friends/my-friend-details-page';
// import { JoinLobbyPage } from './pages/join-lobby-page';
import { GameTablesPage } from './pages/game-tables/game-tables-page';
import { GameTableDetailsPage } from './pages/game-tables/game-table-details-page';
import { BfgWhoAmIProvider } from './state/who-am-i/BfgWhoAmIProvider';
import { GameTableSeatPage } from './pages/game-tables/game-table-seat-page';
import { GameTableActionsPage } from './pages/game-tables/game-table-actions-page';
import { GameTableNextActionPage } from './pages/game-tables/game-table-next-action-page';
// import { DexieStatusPage } from './pages/dexie-status/dexie-status-page';
// import { JoinLobbyPage } from './pages/lobby/join/join-lobby-page';
// import { NotFound } from './pages/NotFound';
// import { CreateNewLobbyPage } from './pages/lobby/new';
// import { GamePage } from './pages/game/game-page';
// import { Join4LobbyPage } from './pages/dev/join4/join4-lobby-page';
// import { Game4Page } from './pages/dev/game4/game4-page';
// import { DevHostPage } from './pages/dev/host/dev-host-page';
// import { SpectateGamePage } from './pages/game/views/spectator/spectate-game-page';


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },

      // {
      //   path: "sign-in",
      //   element: (
      //     <> 
      //       <div>you are here</div>
      //       <UserInteractionWrapper>
      //         <div>you are here2</div>
      //       </UserInteractionWrapper>
      //     </>
      //   ),
      // },
      
      {
        path: "dexie-status",
        element: <DexieStatusPage />,
      },

      {
        path: "game-tables",
        element: (
          <BfgWhoAmIProvider>
            <GameTablesPage />
          </BfgWhoAmIProvider>
        ),
      },

      {
        path: "game-tables/:gameTableId",
        element: (
          <BfgWhoAmIProvider>
            <GameTableDetailsPage />
          </BfgWhoAmIProvider>
        ),
      },

      {
        path: "game-tables/:gameTableId/seat",
        element: (
          <BfgWhoAmIProvider>
            <GameTableSeatPage />
          </BfgWhoAmIProvider>
        ),
      },

      {
        path: "game-tables/:gameTableId/actions",
        element: (
          <BfgWhoAmIProvider>
            <GameTableActionsPage />
          </BfgWhoAmIProvider>
        ),
      },

      {
        path: "game-tables/:gameTableId/next-action",
        element: (
          <BfgWhoAmIProvider>
            <GameTableNextActionPage />
          </BfgWhoAmIProvider>
        ),
      },

      // {
      //   path: "my-lobbies",
      //   element: <MyLobbiesPage />,
      // },

      // {
      //   path: "join-lobby/:lobbyId",
      //   element: <JoinLobbyPage />,
      // },

      // {
      //   path: "lobbies/:lobbyId",
      //   element: <MyLobbyDetailsPage />,
      // },

      // {
      //   path: "lobby/new",
      //   element: (
      //     <MyPlayerProvider>
      //       <CreateNewLobbyPage />
      //     </MyPlayerProvider>
      //   ),
      // },
      {
        path: "my-friends",
        element: (
          <MyFriendsPage />
        ),
      },

      {
        path: "friends/:friendId",
        element: <MyFriendDetailsPage />,
      },

      // {
      //   path: "my-games",
      //   element: <MyGamesPage />,
      // },
      {
        path: "my-player-profiles",
        element: <MyPlayerProfilesPage />,
      },

      // {
      //   path: "dev/host/:gameId",
      //   element: <DevHostPage />,
      // },
      // {
      //   path: "dev/join4/:lobbyId",
      //   element: <Join4LobbyPage />,
      // },
      // {
      //   path: "dev/game4/:gameId",
      //   element: <Game4Page />,
      // },
      // {
      //   path: "game/:gameId",
      //   element: <GamePage />,
      // },
      // {
      //   path: "spectate/:gameId",
      //   element: <SpectateGamePage />,
      // },
      // {
      //   path: "lobby/join/:lobbyId",
      //   element: <JoinLobbyPage />,
      // },
      // {
      //   path: "player-view",
      //   element: <PlayerViewIndex />,
      // },
      // {
      //   path: "player-view/:gameId",
      //   element: <PlayerViewApp />,
      // },
      // {
      //   path: "tb-example",
      //   element: <TbPlayerViewIndex />,
      // },
      // {
      //   path: "tb-example/:gameId",
      //   element: <TbPlayerViewApp />,
      // },
    ],
  },
]); 