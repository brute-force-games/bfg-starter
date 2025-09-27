import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router'
import { getAvailableGameTitles } from '~/games-registry/games-registry';
import { initializeGameTable } from '~/data/game-table-ops/initialize-game-table';
import { GameTable, NewGameTable } from '~/models/game-table/game-table';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { useMyDefaultPlayerProfile } from '~/hooks/stores/use-my-player-profiles-store';

// Form validation schema with enhanced Zod validation
const createTableFormSchema = z.object({
  selectedGame: z.string()
    .min(1, 'Please select a game')
    .refine((val) => val !== '', 'Please select a game'),
  tableName: z.string()
    .min(1, 'Table name is required')
    .max(50, 'Table name must be less than 50 characters')
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Table name can only contain letters, numbers, spaces, hyphens, and underscores')
    .transform((val) => val.trim()),
  maxPlayers: z.string()
    .min(1, 'Please select max players')
    .refine((val) => ['2', '3', '4', '6'].includes(val), 'Please select a valid number of players'),
});

type CreateTableFormData = z.infer<typeof createTableFormSchema>;

export const Route = createFileRoute('/new-table')({
  // ssr: false, // Disable SSR for this route
  component: NewTablePage,
})

function NewTablePage() {
  
  const availableGameTitles = getAvailableGameTitles();
  const defaultPlayerProfile = useMyDefaultPlayerProfile();
  // const defaultPlayerProfile = useLiveDefaultPlayerProfile();
  // const defaultPlayerProfileId = defaultPlayerProfile?.id;
  
  // Form state
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // TanStack Form with Zod validation
  const form = useForm({
    defaultValues: {
      selectedGame: '',
      tableName: '',
      maxPlayers: '2',
    } as CreateTableFormData,
    onSubmit: async ({ value }: { value: CreateTableFormData }) => {
      await handleSubmit(value);
    },
  });

  const handleSubmit = async (formData: CreateTableFormData) => {
    // Clear previous messages
    setError('');
    setSuccess('');
    
    if (!defaultPlayerProfile) {
      setError('No player profile available');
      return;
    }

    // Validate form data using Zod schema
    const validationResult = createTableFormSchema.safeParse(formData);
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      setError(firstError.message);
      return;
    }

    setIsCreating(true);

    // const now = Date.now();

    try {
      const newGameTable: NewGameTable = {
        gameTitle: formData.selectedGame as any, // Type assertion for game title
        gameHostPlayerProfileId: defaultPlayerProfile.id,
        tablePhase: 'table-phase-lobby',
        currentStatusDescription: `Hosted by ${formData.tableName}`,
        p1: defaultPlayerProfile.id,
        // createdAt: now,
        
      };

      console.log('Creating game table with parameters:', newGameTable);
      const createdTable = await initializeGameTable(newGameTable);
      console.log('Game table created successfully:', createdTable);
      
      setSuccess(`Game table "${formData.tableName}" created successfully!`);
      
      // Reset form
      form.reset();
      
    } catch (error) {
      console.error('Error creating game table:', error);
      setError('Failed to create game table. Please try again.');
    } finally {
      setIsCreating(false);
    }
  }

  // Show loading state if player profile is not loaded
  if (!defaultPlayerProfile) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Create New Game Table</h1>
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

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Game Table</h1>
      
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Host a New Game</h2>
          <p className="text-gray-600 mb-6">
            Create a new game table that you can host and invite friends to join.
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
              <form.Field
                name="selectedGame"
                validators={{
                  onChange: ({ value }) => {
                    const result = createTableFormSchema.shape.selectedGame.safeParse(value);
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
              />
              
              <form.Field
                name="tableName"
                validators={{
                  onChange: ({ value }) => {
                    const result = createTableFormSchema.shape.tableName.safeParse(value);
                    return result.success ? undefined : result.error.errors[0]?.message;
                  },
                  onBlur: ({ value }) => {
                    // Additional validation on blur for better UX
                    if (value && value.length > 0) {
                      const result = createTableFormSchema.shape.tableName.safeParse(value);
                      return result.success ? undefined : result.error.errors[0]?.message;
                    }
                    return undefined;
                  },
                }}
                children={(field: any) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Table Name
                    </label>
                    <input 
                      type="text" 
                      placeholder="Enter table name..."
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
              
              <form.Field
                name="maxPlayers"
                validators={{
                  onChange: ({ value }) => {
                    const result = createTableFormSchema.shape.maxPlayers.safeParse(value);
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
                      <option value="6">6 Players</option>
                    </select>
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-red-500 text-sm mt-1">{field.state.meta.errors[0]}</p>
                    )}
                  </div>
                )}
              />
              
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
                  {isCreating ? 'Creating...' : 'Host Game Table'}
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
