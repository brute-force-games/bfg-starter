import { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router'
// import { getAvailableGameTitles } from '~/games-registry/games-registry';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { useMyDefaultPlayerProfile } from '~/hooks/stores/use-my-player-profiles-store';
import { GameLobby } from '~/models/p2p-lobby';
import { convertPrivateToPublicProfile } from '~/types/utils';
import { useHostedLobbyActions } from '~/hooks/stores/use-hosted-lobbies-store';
import { BfgGameLobbyId } from '~/types/core/branded-values/bfg-branded-ids';

// Form validation schema with enhanced Zod validation
const createLobbyFormSchema = z.object({
  // selectedGame: z.string()
  //   .min(1, 'Please select a game')
  //   .refine((val) => val !== '', 'Please select a game'),
  lobbyName: z.string()
    .min(1, 'Lobby name is required')
    .max(50, 'Lobby name must be less than 50 characters')
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Lobby name can only contain letters, numbers, spaces, hyphens, and underscores')
    .transform((val) => val.trim()),
  maxPlayers: z.string()
    .min(1, 'Please select max players')
    .refine((val) => ['2', '3', '4', '5', '6', '7', '8',].includes(val), 'Please select a valid number of players'),
});

type CreateLobbyFormData = z.infer<typeof createLobbyFormSchema>;

export const Route = createFileRoute('/new-lobby')({
  // ssr: false, // Disable SSR for this route
  component: NewLobbyPage,
})

function NewLobbyPage() {
  
  // const availableGameTitles = getAvailableGameTitles();
  const defaultPlayerProfile = useMyDefaultPlayerProfile();
  // const defaultPlayerProfile = useLiveDefaultPlayerProfile();
  // const defaultPlayerProfileId = defaultPlayerProfile?.id;
  
  // Form state
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [createdLobbyId, setCreatedLobbyId] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<string>('');

  const hostedLobbyActions = useHostedLobbyActions();

  // Show loading state if player profile is not loaded
  if (!defaultPlayerProfile) {
    return (
      <div className="ap-6">
        <h1 className="text-3xl font-bold mb-6">Create New Game Lobby</h1>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border rounded-lg p-6 shadow-md">
            <div className="text-center">
              <p className="text-gray-600">Loading player profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const defaultLobbyName = `Lobby - ${defaultPlayerProfile.handle}`;

  // TanStack Form with Zod validation
  const form = useForm({
    defaultValues: {
      // selectedGame: '',
      lobbyName: defaultLobbyName,
      maxPlayers: '2',
    } as CreateLobbyFormData,
    onSubmit: async ({ value }: { value: CreateLobbyFormData }) => {
      await handleSubmit(value);
    },
  });

  const copyJoinLink = async () => {
    if (!createdLobbyId) return;
    
    const joinUrl = `${window.location.origin}/join-lobby/${createdLobbyId}`;
    
    try {
      await navigator.clipboard.writeText(joinUrl);
      setCopySuccess('Join link copied to clipboard!');
      // Clear the success message after 3 seconds
      setTimeout(() => setCopySuccess(''), 3000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      setCopySuccess('Failed to copy link. Please copy manually.');
    }
  };

  const handleSubmit = async (formData: CreateLobbyFormData) => {
    try {
      // Clear previous messages
      setError('');
      setSuccess('');
      setCopySuccess('');
      setCreatedLobbyId(null);
      setIsCreating(true);
      
      if (!defaultPlayerProfile) {
        setError('No player profile available');
        return;
      }

      // Validate form data using Zod schema
      const validationResult = createLobbyFormSchema.safeParse(formData);
      if (!validationResult.success) {
        const firstError = validationResult.error.errors[0];
        setError(firstError.message);
        return;
      }

      const publicHostPlayerProfile = convertPrivateToPublicProfile(defaultPlayerProfile);
      const newLobbyId = BfgGameLobbyId.createId();
      const now = Date.now();

      const newLobby: GameLobby = {
        id: newLobbyId,
        createdAt: now,
        currentStatusDescription: `Created by ${formData.lobbyName}`,
        lobbyName: formData.lobbyName,
        gameHostPlayerProfile: publicHostPlayerProfile,
        playerPool: [],
        maxNumPlayers: parseInt(formData.maxPlayers),
        minNumPlayers: 1,
        isLobbyValid: false,
        updatedAt: now,
      };

      await hostedLobbyActions.addLobby(newLobby);

      setSuccess(`Game lobby "${formData.lobbyName}" created successfully!`);
      setCreatedLobbyId(newLobbyId);

      form.reset();
      
    } catch (error) {
      console.error('Error creating game table:', error);
      setError('Failed to create game table. Please try again.');
    } finally {
      setIsCreating(false);
    }
  }


  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Lobby</h1>
      
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Host a Lobby</h2>
          <p className="text-gray-600 mb-6">
            Create a new lobby that you can host and invite friends to join.
          </p>
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {/* Success Message */}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
              {createdLobbyId && (
                <div className="mt-3">
                  <div className="flex gap-3 items-center">
                    <Link
                      to="/hosted-lobby/$lobbyId"
                      params={{ lobbyId: createdLobbyId }}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    >
                      Go to Hosted Lobby
                    </Link>
                    <Link
                      to="/join-lobby/$lobbyId"
                      params={{ lobbyId: createdLobbyId }}
                      className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    >
                      Join Link
                    </Link>
                    <button
                      onClick={copyJoinLink}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      Copy Join Link
                    </button>
                  </div>
                  {copySuccess && (
                    <p className="text-sm mt-2 text-green-600">{copySuccess}</p>
                  )}
                </div>
              )}
            </div>
          )}
          
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <div className="space-y-4">
              {/* <form.Field
                name="selectedGame"
                validators={{
                  onChange: ({ value }) => {
                    const result = createLobbyFormSchema.shape.selectedGame.safeParse(value);
                    return result.success ? undefined : result.error.errors[0]?.message;
                  },
                }}
                children={(field: any) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Game
                    </label>
                    <select 
                      className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                        field.state.meta.errors.length > 0 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    >
                      <option value="">Select a game...</option>
                      {availableGameTitles.map((title) => (
                        <option key={title} value={title}>{title}</option>
                      ))}
                    </select>
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-red-500 text-sm mt-1">{field.state.meta.errors[0]}</p>
                    )}
                  </div>
                )}
              /> */}
              
              <form.Field
                name="lobbyName"
                validators={{
                  onChange: ({ value }) => {
                    const result = createLobbyFormSchema.shape.lobbyName.safeParse(value);
                    return result.success ? undefined : result.error.errors[0]?.message;
                  },
                  onBlur: ({ value }) => {
                    // Additional validation on blur for better UX
                    if (value && value.length > 0) {
                      const result = createLobbyFormSchema.shape.lobbyName.safeParse(value);
                      return result.success ? undefined : result.error.errors[0]?.message;
                    }
                    return undefined;
                  },
                }}
                children={(field: any) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lobby Name
                    </label>
                    <input 
                      type="text" 
                      placeholder="Enter lobby name..."
                      className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                        field.state.meta.errors.length > 0 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-red-500 text-sm mt-1">{field.state.meta.errors[0]}</p>
                    )}
                  </div>
                )}
              />
              
              {/* <form.Field
                name="maxPlayers"
                validators={{
                  onChange: ({ value }) => {
                    const result = createLobbyFormSchema.shape.maxPlayers.safeParse(value);
                    return result.success ? undefined : result.error.errors[0]?.message;
                  },
                }}
                children={(field: any) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Players
                    </label>
                    <select 
                      className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                        field.state.meta.errors.length > 0 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    >
                      <option value="2">2 Players</option>
                      <option value="3">3 Players</option>
                      <option value="4">4 Players</option>
                      <option value="5">5 Players</option>
                      <option value="6">6 Players</option>
                      <option value="7">7 Players</option>
                      <option value="8">8 Players</option>
                    </select>
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-red-500 text-sm mt-1">{field.state.meta.errors[0]}</p>
                    )}
                  </div>
                )}
              /> */}
              
              <div className="flex gap-4 pt-4">
                <button 
                  type="submit"
                  className={`px-6 py-2 rounded focus:outline-none focus:ring-2 ${
                    isCreating || !form.state.isValid
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                      : 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500'
                  }`}
                  disabled={isCreating || !form.state.isValid}
                >
                  {isCreating ? 'Creating...' : 'Host Game Lobby'}
                </button>
                <button 
                  type="button"
                  className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  disabled={isCreating}
                  onClick={() => form.reset()}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
