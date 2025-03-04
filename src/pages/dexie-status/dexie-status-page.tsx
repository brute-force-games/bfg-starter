import { BfgWhoAmIProvider } from "~/state/who-am-i/BfgWhoAmIProvider";
import { DexieStatusPageContent } from "./dexie-status-page-content";
import { EnvSettingsProvider } from "~/env/EnvSettingsProvider";
import UserInteractionWrapper from "../sign-in/UserInteractionWrapper";
// import UserInteractionWrapper from "~/components/user-interaction-wrapper";


// export const DEXIE_STATUS_PAGE_PATH = '/dexie-status';


export const DexieStatusPage = () => {


  return (
    <>
      <EnvSettingsProvider>
        <BfgWhoAmIProvider>
          <UserInteractionWrapper>
            <>    
              <title>BFG - Login</title>
              <meta name="description" content="DoneBlock" />
            </>
            <DexieStatusPageContent />
          </UserInteractionWrapper>
        </BfgWhoAmIProvider>
      </EnvSettingsProvider>
    </>
  );
};
