// import { GameTableAccessRole } from "@bfg-engine/models/game-roles";
// import { BruteForceGamesAppBar } from "@bfg-engine/ui/components/bfg-app-bar/app-bar";
// import { getGameTabItems, GameTabId } from "~/routes/games2.$role.$tableId/-components";
// import { NavSpine } from "@bfg-engine/ui/components/bfg-app-bar/nav-spine/index";
// import { useMyPlayerProfiles, useRiskyMyDefaultPlayerProfile } from "@bfg-engine/hooks/stores/use-my-player-profiles-store";
// import { UserProfileAccessComponent } from "@bfg-engine/ui/components/bfg-app-bar/user-profile-access-component";
// import { Box } from "@bfg-engine/ui/bfg-ui";


// interface BfgStarterGameNavBarProps<TTabId extends string = string> {
//   myGameTableAccess: GameTableAccessRole;
//   activeTabId: TTabId;  
// }

// export const BfgStarterGameNavBar = <TTabId extends GameTabId = GameTabId>(props: BfgStarterGameNavBarProps<TTabId>) => {
//   const { myGameTableAccess, activeTabId } = props;

//   const myPlayerProfiles = useMyPlayerProfiles();
//   const myDefaultPlayerProfile = useRiskyMyDefaultPlayerProfile();

//   const gameTabItems = getGameTabItems(myGameTableAccess);

//   // const children = 
//   //   // (isNarrowScreen: boolean) => (
//   //     <>
//   //       <NavSpine
//   //         title="Brute Force Games Starter"
//   //         isNarrowScreen={isNarrowScreen}
//   //         tabsConfig={{
//   //           tabItems: gameTabItems,
//   //           activeTabId: activeTabId,
//   //           onTabChange: () => {}
//   //         }}
//   //       />
//   //       <Box style={{ flexGrow: 1 }} />
//   //       <UserProfileAccessComponent
//   //         myPlayerProfiles={myPlayerProfiles}
//   //         myDefaultPlayerProfile={myDefaultPlayerProfile}
//   //       />
//   //     </>
//   //   // )
  

//   return (
//     <BruteForceGamesAppBar>
//       {/* {({ isNarrowScreen }) => ( */}
//         <NavSpine
//           title="Brute Force Games Starter"
//           isNarrowScreen={isNarrowScreen}
//           tabsConfig={{
//             tabItems: gameTabItems,
//             activeTabId: activeTabId,
//             onTabChange: () => {}
//           }}
//         />
//       {/* )} */}
//       <Box style={{ flexGrow: 1 }} />
//       <UserProfileAccessComponent
//         myPlayerProfiles={myPlayerProfiles}
//         myDefaultPlayerProfile={myDefaultPlayerProfile}
//       />
//     </BruteForceGamesAppBar>
//   )
// }
