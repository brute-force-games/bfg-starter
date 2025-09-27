import { createFileRoute } from '@tanstack/react-router'
// import { useState } from 'react';
// import { initializeGameTable } from '~/data/game-table-ops/initialize-game-table';
// import { getAvailableGameTitles } from '~/games-registry/games-registry';
// import { useMyDefaultPlayerProfile } from '~/hooks/use-my-player-profiles';
// import { AbfgSupportedGameTitle } from '~/types/bfg-game-engines/supported-games';
// import { createHostedGameUrl } from '~/router-links';

export const Route = createFileRoute('/start-new-game')({
  // component: StartNewGamePage,
})

// const AvailableGameCard = ({ gameTitle, onPlayNow, disabled }: { gameTitle: string, onPlayNow: () => void, disabled?: boolean }) => {
//   return (
//     <div className="border rounded-lg p-6 shadow-md">
//       <h2 className="text-xl font-semibold mb-3">{gameTitle}</h2>
//       <p className="text-gray-600 mb-4">Description</p>
//       <button 
//         className={`px-4 py-2 rounded ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white`} 
//         onClick={onPlayNow}
//         disabled={disabled}
//       >
//         {disabled ? 'Creating...' : 'Play Now'}
//       </button>
//     </div>
//   )
// }

// function StartNewGamePage() {

//   const availableGameTitles = getAvailableGameTitles();
//   const defaultPlayerProfile = useMyDefaultPlayerProfile();
//   const navigate = useNavigate();

//   const [isCreating, setIsCreating] = useState<boolean>(false);

//   const onStartHostedGame = async (gameTitle: AbfgSupportedGameTitle) => {
//     if (!defaultPlayerProfile) {
//       console.error('No player profile available');
//       return;
//     }

//     console.log("onStartGame", gameTitle);
//     setIsCreating(true);

//     try {
//       const newGameTable: GameTable = {
//         gameTitle,
//         gameHostPlayerProfileId: defaultPlayerProfile.id,
//         tablePhase: 'table-phase-lobby',
//         currentStatusDescription: `Hosted by ${defaultPlayerProfile.handle}`,
//         p1: defaultPlayerProfile.id,
//         // id: BfgGameTableId.createId(),
//         // latestActionId: BfgGameTableActionId.createId(),
//         // createdAt: now,
//       };

//       console.log('Creating game table with parameters:', newGameTable);
//       const createdTableId = await initializeGameTable(newGameTable);
//       console.log('Game table created successfully:', createdTableId);
      
//       // Navigate to the hosted game page
//       const hostedGameUrl = createHostedGameUrl(createdTableId);
//       navigate({ to: hostedGameUrl });
      
//     } catch (error) {
//       console.error('Error creating game table:', error);
//     } finally {
//       setIsCreating(false);
//     }
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6">New Game</h1>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {
//           availableGameTitles.map((gameTitle) => (
//             <AvailableGameCard 
//               key={gameTitle} 
//               gameTitle={gameTitle} 
//               onPlayNow={() => onStartHostedGame(gameTitle)} 
//               disabled={isCreating}
//             />
//           ))
//         }
//         {/* <div className="border rounded-lg p-6 shadow-md">
//           <h2 className="text-xl font-semibold mb-3">Tic Tac Toe</h2>
//           <p className="text-gray-600 mb-4">Classic 3x3 grid game</p>
//           <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
//             Play Now
//           </button>
//         </div>
        
//         <div className="border rounded-lg p-6 shadow-md">
//           <h2 className="text-xl font-semibold mb-3">Flip a Coin</h2>
//           <p className="text-gray-600 mb-4">Simple chance game</p>
//           <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
//             Play Now
//           </button>
//         </div>
        
//         <div className="border rounded-lg p-6 shadow-md">
//           <h2 className="text-xl font-semibold mb-3">More Games</h2>
//           <p className="text-gray-600 mb-4">Coming soon...</p>
//           <button className="bg-gray-500 text-white px-4 py-2 rounded cursor-not-allowed" disabled>
//             Coming Soon
//           </button>
//         </div> */}
//       </div>
//     </div>
//   )
// }
