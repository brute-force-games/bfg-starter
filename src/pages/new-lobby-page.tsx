import { z } from 'zod';
import { useState } from 'react';
import { Link } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Button, 
  Alert, 
  Box, 
  Stack, 
  CircularProgress,
  Chip
} from '@mui/material';
import { useMyDefaultPlayerProfile } from '~/hooks/stores/use-my-player-profiles-store';
import { GameLobby } from '~/models/p2p-lobby';
import { convertPrivateToPublicProfile } from '~/types/utils';
import { useHostedLobbyActions } from '~/hooks/stores/use-hosted-lobbies-store';
import { BfgGameLobbyId } from '~/types/core/branded-values/bfg-branded-ids';
import { BfgSupportedGameTitles, BfgSupportedGameTitlesSchema } from '~/types/bfg-game-engines/supported-games';
import { getAvailableGameTitles } from '~/games-registry/games-registry';
import { AllBfgGameMetadata } from '~/types/bfg-game-engines/bfg-game-engines';

// Form validation schema with enhanced Zod validation
const createLobbyFormSchema = z.object({
  lobbyName: z.string()
    .min(1, 'Lobby name is required')
    .max(50, 'Lobby name must be less than 50 characters')
    .regex(/^[a-zA-Z0-9\s\-_']+$/, 'Lobby name can only contain letters, numbers, spaces, hyphens, underscores, and apostrophes')
    .transform((val) => val.trim()),
  gameTitle: BfgSupportedGameTitlesSchema
    .optional(),
});

type CreateLobbyFormData = z.infer<typeof createLobbyFormSchema>;


export const NewLobbyPage = () => {
  
  const defaultPlayerProfile = useMyDefaultPlayerProfile();
  
  // Form state
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [createdLobbyId, setCreatedLobbyId] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<string>('');

  const hostedLobbyActions = useHostedLobbyActions();

  // Calculate default lobby name (safe even if profile is null)
  const defaultLobbyName = defaultPlayerProfile ? `${defaultPlayerProfile.handle}'s Lobby` : '';

  // TanStack Form with Zod validation - MUST be called before any early returns
  const form = useForm({
    defaultValues: {
      lobbyName: defaultLobbyName,
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

      const getMinAndMaxNumPlayers = (gameTitle: BfgSupportedGameTitles | undefined) => {
        if (!gameTitle) {
          return {
            minNumPlayers: 1,
            maxNumPlayers: 8,
          };
        }

        const selectedGameMetadata = AllBfgGameMetadata[gameTitle];
        return {
          minNumPlayers: selectedGameMetadata.definition.minNumPlayersForGame,
          maxNumPlayers: selectedGameMetadata.definition.maxNumPlayersForGame,
        };
      }

      const { minNumPlayers, maxNumPlayers } = getMinAndMaxNumPlayers(formData.gameTitle);

      const publicHostPlayerProfile = convertPrivateToPublicProfile(defaultPlayerProfile);
      const newLobbyId = BfgGameLobbyId.createId();
      const now = Date.now();

      const newLobby: GameLobby = {
        id: newLobbyId,
        createdAt: now,
        currentStatusDescription: `Created by ${formData.lobbyName}`,
        lobbyName: formData.lobbyName,
        gameHostPlayerProfile: publicHostPlayerProfile,
        gameTitle: formData.gameTitle,
        playerPool: [],
        maxNumPlayers,
        minNumPlayers,
        isLobbyValid: false,
        updatedAt: now,
      };

      await hostedLobbyActions.addLobby(newLobby);

      setCreatedLobbyId(newLobbyId);

      form.reset();
      
    } catch (error) {
      console.error('Error creating game table:', error);
      setError('Failed to create game table. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  // Show loading state if player profile is not loaded
  if (!defaultPlayerProfile) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Create New Game Lobby
        </Typography>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <Stack spacing={2} alignItems="center">
              <CircularProgress />
              <Typography variant="body1" color="text.secondary">
                Loading player profile...
              </Typography>
            </Stack>
          </Box>
        </Paper>
      </Container>
    );
  }

  // Show lobby creation success if a lobby was just created
  if (createdLobbyId) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Host a Lobby
        </Typography>
        
        <Paper elevation={2} sx={{ p: 3 }}>
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Lobby Created Successfully!
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Your lobby has been created and is ready for players to join.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Link
                to="/hosted-lobby/$lobbyId"
                params={{ lobbyId: createdLobbyId }}
                style={{ textDecoration: 'none' }}
              >
                <Button
                  variant="contained"
                  color="primary"
                >
                  Go to Hosted Lobby
                </Button>
              </Link>
              <Link
                to="/join-lobby/$lobbyId"
                params={{ lobbyId: createdLobbyId }}
                style={{ textDecoration: 'none' }}
              >
                <Button
                  variant="contained"
                  color="warning"
                >
                  Go to Player Lobby
                </Button>
              </Link>
              <Button
                onClick={copyJoinLink}
                variant="contained"
                color="secondary"
              >
                Copy Join Link
              </Button>
            </Stack>
            {copySuccess && (
              <Chip 
                label={copySuccess} 
                color="success" 
                size="small" 
                sx={{ mt: 2 }} 
              />
            )}
          </Alert>
          
          <Box sx={{ mt: 3 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                setCreatedLobbyId(null);
                setCopySuccess('');
                form.reset();
              }}
            >
              Create Another Lobby
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  const availableGameTitles = getAvailableGameTitles();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
        Host a Lobby
      </Typography>
      
      <Paper elevation={2} sx={{ p: 3 }}>
        {/* <Typography variant="h5" component="h2" gutterBottom fontWeight="medium">
          Host a Lobby
        </Typography> */}
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Create a lobby to invite your friends to join.
        </Typography>
          
        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
          
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <Stack spacing={3}>
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
                <TextField
                  label="Lobby Name"
                  placeholder="Enter lobby name..."
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  error={field.state.meta.errors.length > 0}
                  helperText={field.state.meta.errors.length > 0 ? field.state.meta.errors[0] : ''}
                  fullWidth
                  variant="outlined"
                />
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

            <form.Field
              name="gameTitle"
              validators={{
                onChange: ({ value }) => {
                  const result = createLobbyFormSchema.shape.gameTitle.safeParse(value);
                  return result.success ? undefined : result.error.errors[0]?.message;
                },
              }}
              children={(field: any) => (
                <FormControl fullWidth error={field.state.meta.errors.length > 0}>
                  <InputLabel>Game Title</InputLabel>
                  <Select
                    value={field.state.value || ''}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    label="Game Title"
                  >
                    <MenuItem value="">
                      <em>Select a game...</em>
                    </MenuItem>
                    {availableGameTitles.map((title) => (
                      <MenuItem key={title} value={title}>
                        {title}
                      </MenuItem>
                    ))}
                  </Select>
                  {field.state.meta.errors.length > 0 && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                      {field.state.meta.errors[0]}
                    </Typography>
                  )}
                </FormControl>
              )}
            />
              
            <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
              <Button 
                type="submit"
                variant="contained"
                color="primary"
                disabled={isCreating || !form.state.isValid}
                startIcon={isCreating ? <CircularProgress size={20} /> : null}
                sx={{ minWidth: 160 }}
              >
                {isCreating ? 'Creating...' : 'Host Game Lobby'}
              </Button>
              {/* <Button 
                type="button"
                variant="outlined"
                color="secondary"
                disabled={isCreating}
                onClick={() => form.reset()}
              >
                Cancel
              </Button> */}
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Container>
  )
}
