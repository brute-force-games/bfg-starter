// import { useState } from 'react'
// import { useObservable } from 'dexie-react-hooks'
// // import { db } from './db' // A module that exports the Dexie instance with dexie-cloud-addon attached.
// import {
//   resolveText,
//   DXCInputField,
//   DXCUserInteraction,
// } from 'dexie-cloud-addon'
// import styled from '@emotion/styled'
// // import { doneBlocksDb } from '~/data/dexie-db/doneblock-db'
// import { bfgDb } from '~/data/bfg-db'

// /** Example login dialog
//  *
//  * This component showcases how to provide a custom login GUI for login dialog.
//  * The principle is simple:
//  *   * We use useObservable() to observe `db.cloud.userInteraction` into local variable ui.
//  *   * If it is undefined, the system does not need to show any dialog (which is the most common case)
//  *   * Else if ui is truthy, it will have the following properties:
//  *     * ui.type = type of dialog ('email', 'otp', 'message-alert' or 'logout-confirmation')
//  *     * ui.title = the suggested title of the dialog. You can use it or use your own based on ui.type.
//  *     * ui.alerts = array of alerts (warnings, errors or information messages to show to user). This array
//  *       may be present in any type of dialog.
//  *     * ui.fields = input fields to collect from user. This is an object where key is the field name and
//  *       value is a field description (DXCInputField)
//  *     * ui.submitLabel = A suggested text for the submit / OK button
//  *     * ui.cancelLabel = undefined if no cancel button is appropriate, or a suggested text for the cancel button.
//  *     * ui.onSubmit = callback to call when fields have been collected from user. Accepts an object where
//  *       key is the field name and value is the collected value.
//  *     * ui.onCancel = callback to call if user clicks cancel button.
//  */
// export const MyDexieLoginGUI = () => {
//   console.log("STARTING MyDexieLoginGUI");
//   // const { doneBlocksDb } = useDexieDatabases();
//   // const doneBlocksDb = createDexieDoneBlocksDbCloud();
//   console.log("bfgDb", bfgDb);

//   if (!bfgDb.cloud) {
//     console.log("bfgDb.cloud is not available");
//     // return null;
//     throw new Error("bfgDb.cloud is not available");
//   }

//   const ui = useObservable(bfgDb.cloud.userInteraction);
//   console.log("ui", ui);
//   if (!ui) return null // No user interaction is requested.

//   console.log("RETURNING MyDexieLoginDialog");
//   return <MyDexieLoginDialog ui={ui} />
// }

// export const MyDexieLoginDialog = ({ ui }: { ui: DXCUserInteraction }) => {
//   const [params, setParams] = useState<{ [param: string]: string }>({})

//   return (
//     <MyDialogStyling>
//       <div className="fullscreen darken" />
//       <div className="fullscreen dlg-outer">
//         <div className="dlg-inner">
//           <h2>Login for DoneBlock</h2>
//           <h3>{ui.title}</h3>
//           {ui.alerts?.map((alert, i) => (
//             <p key={i} className={`dxcdlg-alert-${alert.type}`}>
//               {resolveText(alert)}
//             </p>
//           ))}
//           <form
//             onSubmit={(ev) => {
//               ev.preventDefault()
//               ui.onSubmit(params)
//             }}
//           >
//             {(Object.entries(ui.fields) as [string, DXCInputField][]).map(
//               ([fieldName, { type, label, placeholder }], idx) => (
//                 <label key={idx}>
//                   {label ? `${label}: ` : ''}
//                   <input
//                     type={type}
//                     name={fieldName}
//                     autoFocus
//                     placeholder={placeholder}
//                     value={params[fieldName] || ''}
//                     onChange={(ev) => {
//                       const value = ev.target.value
//                       const updatedParams = {
//                         ...params,
//                         [fieldName]: value,
//                       }
//                       setParams(updatedParams)
//                     }}
//                   />
//                 </label>
//               )
//             )}
//           </form>
//           <div className="dxc-buttons">
//             <>
//               <button type="submit" onClick={() => ui.onSubmit(params)}>
//                 {ui.submitLabel}
//               </button>
//               {ui.cancelLabel && (
//                 <button onClick={ui.onCancel}>{ui.cancelLabel}</button>
//               )}
//             </>
//           </div>
//         </div>
//       </div>
//     </MyDialogStyling>
//   )
// }

// // Dialog styling
// const MyDialogStyling = styled.div`
//   .fullscreen {
//     position: fixed;
//     top: 0;
//     left: 0;
//     width: 100vw;
//     height: 100vh;
//   }
//   .darken {
//     opacity: 0.5;
//     background-color: #000;
//     z-index: 150;
//     backdrop-filter: blur(2px);
//     -webkit-backdrop-filter: blur(2px);
//   }
//   .dlg-outer {
//     z-index: 150;
//     align-items: center;
//     display: flex;
//     justify-content: center;
//   }
//   .dlg-inner {
//     position: relative;
//     color: #222;
//     background-color: #fff;
//     padding: 30px;
//     margin-bottom: 2em;
//     max-width: 90%;
//     max-height: 90%;
//     overflow-y: auto;
//     border: 3px solid #3d3d5d;
//     border-radius: 8px;
//     box-shadow: 0 0 80px 10px #666;
//     width: auto;
//     font-family: sans-serif;
//   }
//   .dlg-input {
//     height: 35px;
//     width: 17em;
//     border-color: #ccf4;
//     outline: none;
//     font-size: 17pt;
//     padding: 8px;
//   }
//   .alert-error {
//     color: red;
//     font-weight: bold;
//   }
//   .alert-warning {
//     color: #f80;
//     font-weight: bold;
//   }
//   .alert-info {
//     color: black;
//   }
// `