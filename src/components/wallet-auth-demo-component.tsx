import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Alert,
  Chip,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  IdentityKey,
  LobbyKey,
  GameKey,
  SigningKey,
} from '~/crypto/wallet-manager';
import {
  initializeNewWallet,
  initializeWalletFromMnemonic,
  getPrimaryIdentityKey,
  isWalletInitialized,
  getWalletBalance,
  createAuthenticationChallenge,
  verifyAuthenticationChallenge,
  signMoveWithWallet,
  verifyWalletSignedMove,
  initializeWalletFromPrivateKey,
} from '~/crypto/crypto-utils';
import {
  createWalletBasedPlayerProfile,
  createPlayerProfileFromWallet,
  createPlayerProfileFromPrivateKey,
} from '~/models/private-player-profile';
import {
  deriveLobbyKey,
  deriveGameKey,
  deriveTableSigningKey,
} from '~/crypto/key-derivation-utils';

/**
 * Demo component showing wallet-based authentication and key management
 */
export const WalletAuthDemoComponent: React.FC = () => {
  const [walletInitialized, setWalletInitialized] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [mnemonic, setMnemonic] = useState('');
  const [inputMnemonic, setInputMnemonic] = useState('');
  const [inputPrivateKey, setInputPrivateKey] = useState('');
  const [handle, setHandle] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [passwordHint, setPasswordHint] = useState('');
  const [identityKey, setIdentityKey] = useState<IdentityKey | null>(null);
  const [lobbyKey, setLobbyKey] = useState<LobbyKey | null>(null);
  const [gameKey, setGameKey] = useState<GameKey | null>(null);
  const [signingKey, setSigningKey] = useState<SigningKey | null>(null);
  const [authChallenge, setAuthChallenge] = useState<string>('');
  const [authResponse, setAuthResponse] = useState<any>(null);
  const [moveData, setMoveData] = useState('{"action": "move", "position": [1, 2]}');
  const [signedMove, setSignedMove] = useState<any>(null);
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  const [error, setError] = useState<string>('');

  // Check wallet initialization status
  useEffect(() => {
    setWalletInitialized(isWalletInitialized());
    if (isWalletInitialized()) {
      loadWalletInfo();
    }
  }, []);

  const loadWalletInfo = async () => {
    try {
      const balance = await getWalletBalance();
      setWalletBalance(balance);
      
      const identity = await getPrimaryIdentityKey();
      setIdentityKey(identity);
    } catch (err) {
      setError(`Failed to load wallet info: ${err}`);
    }
  };

  const handleCreateNewWallet = async () => {
    try {
      setError('');
      const masterWallet = await initializeNewWallet();
      setMnemonic(masterWallet.mnemonic);
      setWalletInitialized(true);
      await loadWalletInfo();
    } catch (err) {
      setError(`Failed to create wallet: ${err}`);
    }
  };

  const handleImportWallet = async () => {
    try {
      setError('');
      const masterWallet = await initializeWalletFromMnemonic(inputMnemonic);
      setMnemonic(masterWallet.mnemonic);
      setWalletInitialized(true);
      await loadWalletInfo();
    } catch (err) {
      setError(`Failed to import wallet: ${err}`);
    }
  };

  const handleImportFromPrivateKey = async () => {
    try {
      setError('');
      const masterWallet = await initializeWalletFromPrivateKey(inputPrivateKey);
      setMnemonic(masterWallet.mnemonic || 'No mnemonic (created from private key)');
      setWalletInitialized(true);
      await loadWalletInfo();
    } catch (err) {
      setError(`Failed to import wallet from private key: ${err}`);
    }
  };

  const handleCreatePlayerProfile = async () => {
    try {
      setError('');
      if (!handle.trim()) {
        setError('Handle is required');
        return;
      }

      const profile = await createWalletBasedPlayerProfile(
        handle,
        avatarUrl || undefined
      );
      
      console.log('Created wallet-based player profile:', profile);
      setError(''); // Clear any previous errors
    } catch (err) {
      setError(`Failed to create player profile: ${err}`);
    }
  };

  const handleImportPlayerProfile = async () => {
    try {
      setError('');
      if (!handle.trim() || !inputMnemonic.trim()) {
        setError('Handle and mnemonic are required');
        return;
      }

      const profile = await createPlayerProfileFromWallet(
        handle,
        inputMnemonic,
        avatarUrl || undefined
      );
      
      console.log('Created player profile from wallet:', profile);
      setError(''); // Clear any previous errors
    } catch (err) {
      setError(`Failed to create player profile from wallet: ${err}`);
    }
  };

  const handleImportPlayerProfileFromPrivateKey = async () => {
    try {
      setError('');
      if (!handle.trim() || !inputPrivateKey.trim()) {
        setError('Handle and private key are required');
        return;
      }

      const profile = await createPlayerProfileFromPrivateKey(
        handle,
        inputPrivateKey,
        avatarUrl || undefined
      );
      
      console.log('Created player profile from private key:', profile);
      setError(''); // Clear any previous errors
    } catch (err) {
      setError(`Failed to create player profile from private key: ${err}`);
    }
  };

  const handleDeriveKeys = async () => {
    try {
      setError('');
      
      // Derive keys for specific purposes
      const lobbyId = 'lobby-123';
      const gameId = 'game-456';
      const tableId = 'table-789';

      const [lobby, game, signing] = await Promise.all([
        deriveLobbyKey(lobbyId),
        deriveGameKey(gameId),
        deriveTableSigningKey(tableId),
      ]);

      setLobbyKey(lobby);
      setGameKey(game);
      setSigningKey(signing);
    } catch (err) {
      setError(`Failed to derive keys: ${err}`);
    }
  };

  const handleCreateAuthChallenge = async () => {
    try {
      setError('');
      if (!identityKey) {
        setError('Identity key not available');
        return;
      }

      const challenge = `Challenge: ${Date.now()}`;
      setAuthChallenge(challenge);
      
      const response = await createAuthenticationChallenge(challenge, identityKey);
      setAuthResponse(response);
    } catch (err) {
      setError(`Failed to create auth challenge: ${err}`);
    }
  };

  const handleVerifyAuthChallenge = async () => {
    try {
      setError('');
      if (!authResponse) {
        setError('No auth response to verify');
        return;
      }

      const isValid = await verifyAuthenticationChallenge(
        authResponse.challenge,
        authResponse.signature,
        authResponse.address
      );
      
      setVerificationResult(isValid);
    } catch (err) {
      setError(`Failed to verify auth challenge: ${err}`);
    }
  };

  const handleSignMove = async () => {
    try {
      setError('');
      if (!signingKey) {
        setError('Signing key not available');
        return;
      }

      const move = JSON.parse(moveData);
      const signed = await signMoveWithWallet(move, signingKey.walletKey);
      
      setSignedMove({
        move: moveData,
        signature: signed,
        address: signingKey.address,
        publicKey: signingKey.publicKey,
      });
    } catch (err) {
      setError(`Failed to sign move: ${err}`);
    }
  };

  const handleVerifyMove = async () => {
    try {
      setError('');
      if (!signedMove) {
        setError('No signed move to verify');
        return;
      }

      const move = JSON.parse(signedMove.move);
      const isValid = await verifyWalletSignedMove(
        move,
        signedMove.signature,
        signedMove.address
      );
      
      setVerificationResult(isValid);
    } catch (err) {
      setError(`Failed to verify move: ${err}`);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Wallet-Based Authentication Demo
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        This demo shows how to use @psf/bch-js for user identity, authentication, 
        and key management in the BFG application. You can create different classes of keys 
        for various purposes using proper HD key derivation. Note: This focuses on identity management rather than BCH transactions.
      </Typography>

      <Alert severity="info" sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Current Implementation Status:
        </Typography>
        <Typography variant="body2">
          ✅ Wallet creation and key management are fully functional<br/>
          ✅ Message signing and verification are now implemented<br/>
          ✅ Private key import and instantiation are supported<br/>
          ✅ Mnemonic import now preserves the provided mnemonic<br/>
          {/* ✅ All core wallet functionality is complete */}
        </Typography>
      </Alert>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Wallet Management */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Wallet Management
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Chip 
                  label={walletInitialized ? 'Wallet Initialized' : 'No Wallet'} 
                  color={walletInitialized ? 'success' : 'default'}
                />
                {walletInitialized && (
                  <Chip 
                    label={`Balance: ${walletBalance} BCH`} 
                    color="info"
                    sx={{ ml: 1 }}
                  />
                )}
              </Box>

              <Button 
                variant="contained" 
                onClick={handleCreateNewWallet}
                disabled={walletInitialized}
                sx={{ mb: 2, mr: 1 }}
              >
                Create New Wallet
              </Button>

              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Import Mnemonic"
                  value={inputMnemonic}
                  onChange={(e) => setInputMnemonic(e.target.value)}
                  multiline
                  rows={3}
                  disabled={walletInitialized}
                  sx={{ mb: 1 }}
                />
                <Button 
                  variant="outlined" 
                  onClick={handleImportWallet}
                  disabled={walletInitialized || !inputMnemonic.trim()}
                  sx={{ mb: 1, mr: 1 }}
                >
                  Import Wallet
                </Button>
              </Box>

              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Import Private Key (WIF format)"
                  value={inputPrivateKey}
                  onChange={(e) => setInputPrivateKey(e.target.value)}
                  disabled={walletInitialized}
                  sx={{ mb: 1 }}
                />
                <Button 
                  variant="outlined" 
                  onClick={handleImportFromPrivateKey}
                  disabled={walletInitialized || !inputPrivateKey.trim()}
                >
                  Import from Private Key
                </Button>
              </Box>

              {mnemonic && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Generated Mnemonic (Keep Safe!):
                  </Typography>
                  <TextField
                    fullWidth
                    value={mnemonic}
                    multiline
                    rows={3}
                    InputProps={{ readOnly: true }}
                    size="small"
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Player Profile Creation */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Player Profile Creation
              </Typography>

              <TextField
                fullWidth
                label="Handle"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Avatar URL (optional)"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Password Hint (optional)"
                value={passwordHint}
                onChange={(e) => setPasswordHint(e.target.value)}
                sx={{ mb: 2 }}
              />

              <Button 
                variant="contained" 
                onClick={handleCreatePlayerProfile}
                disabled={!walletInitialized || !handle.trim()}
                sx={{ mb: 1, mr: 1 }}
              >
                Create Profile
              </Button>

              <Button 
                variant="outlined" 
                onClick={handleImportPlayerProfile}
                disabled={!handle.trim() || !inputMnemonic.trim()}
                sx={{ mb: 1, mr: 1 }}
              >
                Import Profile (Mnemonic)
              </Button>

              <Button 
                variant="outlined" 
                onClick={handleImportPlayerProfileFromPrivateKey}
                disabled={!handle.trim() || !inputPrivateKey.trim()}
              >
                Import Profile (Private Key)
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Key Derivation */}
        <Grid size={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Key Derivation
              </Typography>
              
              <Button 
                variant="contained" 
                onClick={handleDeriveKeys}
                disabled={!walletInitialized}
                sx={{ mb: 2 }}
              >
                Derive Purpose-Specific Keys
              </Button>

              <Grid container spacing={2}>
                {identityKey && (
                  <Grid size={{ xs: 12, md: 3 }}>
                    <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Identity Key
                      </Typography>
                      <Typography variant="caption" display="block">
                        Address: {identityKey.address.slice(0, 20)}...
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {lobbyKey && (
                  <Grid size={{ xs: 12, md: 3 }}>
                    <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Lobby Key
                      </Typography>
                      <Typography variant="caption" display="block">
                        Address: {lobbyKey.address.slice(0, 20)}...
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {gameKey && (
                  <Grid size={{ xs: 12, md: 3 }}>
                    <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Game Key
                      </Typography>
                      <Typography variant="caption" display="block">
                        Address: {gameKey.address.slice(0, 20)}...
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {signingKey && (
                  <Grid size={{ xs: 12, md: 3 }}>
                    <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Signing Key
                      </Typography>
                      <Typography variant="caption" display="block">
                        Address: {signingKey.address.slice(0, 20)}...
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Authentication Demo */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Authentication Demo
              </Typography>

              <Button 
                variant="contained" 
                onClick={handleCreateAuthChallenge}
                disabled={!identityKey}
                sx={{ mb: 2 }}
              >
                Create Auth Challenge
              </Button>

              {authChallenge && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Challenge:
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: 'grey.100', p: 1 }}>
                    {authChallenge}
                  </Typography>
                </Box>
              )}

              {authResponse && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Auth Response:
                  </Typography>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="body2">View Response Details</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                        {JSON.stringify(authResponse, null, 2)}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              )}

              <Button 
                variant="outlined" 
                onClick={handleVerifyAuthChallenge}
                disabled={!authResponse}
                sx={{ mb: 2 }}
              >
                Verify Challenge
              </Button>

              {verificationResult !== null && (
                <Alert severity={verificationResult ? 'success' : 'error'}>
                  Verification: {verificationResult ? 'SUCCESS' : 'FAILED'}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Move Signing Demo */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Move Signing Demo
              </Typography>

              <TextField
                fullWidth
                label="Move Data (JSON)"
                value={moveData}
                onChange={(e) => setMoveData(e.target.value)}
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />

              <Button 
                variant="contained" 
                onClick={handleSignMove}
                disabled={!signingKey}
                sx={{ mb: 2, mr: 1 }}
              >
                Sign Move
              </Button>

              <Button 
                variant="outlined" 
                onClick={handleVerifyMove}
                disabled={!signedMove}
              >
                Verify Move
              </Button>

              {signedMove && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Signed Move:
                  </Typography>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="body2">View Signed Move</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                        {JSON.stringify(signedMove, null, 2)}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
