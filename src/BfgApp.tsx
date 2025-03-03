// import { BrowserRouter } from "react-router-dom";

// import { MyDexieLoginGUI } from "./components/bfg-dexie-cloud-login-gui";
// import { BfgAppRoutes } from "./router";


// export const BfgApp = () => {
//     return (
//       <>
//         <MyDexieLoginGUI />
//         <BrowserRouter>
//           <BfgAppRoutes />
//         </BrowserRouter>
//       </>
//     )
// }



import './App.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'


export const BruteForceGamesApp = () => {

  
  return (
    <>
      {/* <MyPlayerProvider>
        <PlayerSettingsProvider> */}
          {/* <HelmetProvider> */}
            <RouterProvider router={router} />
          {/* </HelmetProvider> */}
        {/* </PlayerSettingsProvider>
      </MyPlayerProvider> */}
    </>
  )
}
