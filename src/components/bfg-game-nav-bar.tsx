import { GameTableAccessRole } from "@bfg-engine/models/game-roles";
import { BruteForceGamesAppBar } from "@bfg-engine/ui/components/bfg-app-bar/app-bar";
import { getGameTabItems, GameTabId } from "~/routes/games2.$role.$tableId/-components";
import { NavSpine } from "@bfg-engine/ui/components/bfg-app-bar/nav-spine/index";
import { useAppSettings } from "@bfg-engine/hooks/stores/use-my-app-settings-store";


interface BfgGameNavBarProps<TTabId extends string = string> {
  // isNarrowScreen: boolean;
  myGameTableAccess: GameTableAccessRole;
  activeTabId: TTabId;  
}

export const BfgGameNavBar = <TTabId extends GameTabId = GameTabId>(props: BfgGameNavBarProps<TTabId>) => {
  const { myGameTableAccess, activeTabId } = props;

  // const myPlayerProfiles = useMyPlayerProfiles();
  // const myDefaultPlayerProfile = useRiskyMyDefaultPlayerProfile();
  const appSettings = useAppSettings();

  if (appSettings.gameSpineLocation === 'nav-bar') {
    const gameSpineComponent = <div>Game Spine</div>;

    return (
      <BruteForceGamesAppBar>
        {gameSpineComponent}
      </BruteForceGamesAppBar>
    )    
  }

  // return (
  //   <BruteForceGamesAppBar>
  //     {({ isNarrowScreen }) => (
  //       <>
  //         <NavSpine
  //           title="Brute Force Games Starter"
  //           isNarrowScreen={isNarrowScreen}
  //           tabsConfig={{
  //             tabItems: gameTabItems,
  //             activeTabId: activeTabId,
  //             onTabChange: () => {}

  const gameTabItems = getGameTabItems(myGameTableAccess);

  // const children = 
  //   // (isNarrowScreen: boolean) => (
  //     <>
  //       <NavSpine
  //         title="Brute Force Games Starter"
  //         isNarrowScreen={isNarrowScreen}
  //         tabsConfig={{
  //           tabItems: gameTabItems,
  //           activeTabId: activeTabId,
  //           onTabChange: () => {}
  //         }}
  //       />
  //       <Box style={{ flexGrow: 1 }} />
  //       <UserProfileAccessComponent
  //         myPlayerProfiles={myPlayerProfiles}
  //         myDefaultPlayerProfile={myDefaultPlayerProfile}
  //       />
  //     </>
  //   // )
  

  return (
    <BruteForceGamesAppBar>
      {({ isNarrowScreen }) => (
        <>
          <NavSpine
            title="Brute Force Games Starter"
            isNarrowScreen={isNarrowScreen}
            tabsConfig={{
              tabItems: gameTabItems,
              activeTabId: activeTabId,
              onTabChange: () => {}
            }}
          />
          {/* <Box style={{ flexGrow: 1 }} />
          <UserProfileAccessComponent
            myPlayerProfiles={myPlayerProfiles}
            myDefaultPlayerProfile={myDefaultPlayerProfile}
          /> */}
        </>
      )}
    </BruteForceGamesAppBar>
  )
}
