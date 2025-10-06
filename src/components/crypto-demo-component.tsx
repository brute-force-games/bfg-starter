import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Alert,
  Paper,
  Stack,
  Divider,
} from '@mui/material';
import { generateKeyPair, signMove, verifyMove } from '~/crypto/crypto-utils';

/**
 * Demo component to showcase the cryptographic player profile system
 * This shows how key generation, signing, and verification work
 */
export const CryptoDemoComponent = () => {
  const [keyPair, setKeyPair] = useState<{ publicKey: string; privateKey: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [signedMove, setSignedMove] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleGenerateKeys = async () => {
    setIsGenerating(true);
    try {
      const keys = await generateKeyPair();
      setKeyPair(keys);
      setSignedMove(null);
      setVerificationResult(null);
    } catch (error) {
      console.error('Error generating keys:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSignMove = async () => {
    if (!keyPair) return;

    setIsSigning(true);
    try {
      const moveData = {
        playerId: 'demo-player',
        action: 'move-to-position',
        position: { x: 1, y: 2 },
        timestamp: new Date().toISOString(),
        gameTableId: 'demo-table',
      };

      const signature = await signMove(moveData, keyPair.privateKey);
      setSignedMove(signature);
      setVerificationResult(null);
    } catch (error) {
      console.error('Error signing move:', error);
    } finally {
      setIsSigning(false);
    }
  };

  const handleVerifyMove = async () => {
    if (!keyPair || !signedMove) return;

    setIsVerifying(true);
    try {
      const moveData = {
        playerId: 'demo-player',
        action: 'move-to-position',
        position: { x: 1, y: 2 },
        timestamp: new Date().toISOString(),
        gameTableId: 'demo-table',
      };

      const isValid = await verifyMove(moveData, signedMove, keyPair.publicKey);
      setVerificationResult(isValid);
    } catch (error) {
      console.error('Error verifying move:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReset = () => {
    setKeyPair(null);
    setSignedMove(null);
    setVerificationResult(null);
  };

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h5" gutterBottom>
        Cryptographic Player Profile Demo
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        This demo shows how player moves are cryptographically signed and verified.
        All operations happen client-side using the Web Crypto API.
      </Typography>

      <Stack spacing={3}>
        {/* Step 1: Generate Keys */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Step 1: Generate Cryptographic Key Pair
          </Typography>
          <Button
            variant="contained"
            onClick={handleGenerateKeys}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating Keys...' : 'Generate Key Pair'}
          </Button>
          
          {keyPair && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Key pair generated successfully! Private key is kept secret, public key can be shared.
            </Alert>
          )}
        </Box>

        <Divider />

        {/* Step 2: Sign Move */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Step 2: Sign a Game Move
          </Typography>
          <Button
            variant="contained"
            onClick={handleSignMove}
            disabled={!keyPair || isSigning}
          >
            {isSigning ? 'Signing Move...' : 'Sign Demo Move'}
          </Button>
          
          {signedMove && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Move signed successfully! The signature proves this move came from the private key holder.
            </Alert>
          )}
        </Box>

        <Divider />

        {/* Step 3: Verify Move */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Step 3: Verify the Signed Move
          </Typography>
          <Button
            variant="contained"
            onClick={handleVerifyMove}
            disabled={!keyPair || !signedMove || isVerifying}
          >
            {isVerifying ? 'Verifying...' : 'Verify Signature'}
          </Button>
          
          {verificationResult !== null && (
            <Alert 
              severity={verificationResult ? "success" : "error"} 
              sx={{ mt: 2 }}
            >
              {verificationResult 
                ? "✅ Signature is valid! Move is authentic and untampered."
                : "❌ Signature verification failed! Move may be tampered with."
              }
            </Alert>
          )}
        </Box>

        <Divider />

        {/* Reset */}
        <Box>
          <Button variant="outlined" onClick={handleReset}>
            Reset Demo
          </Button>
        </Box>

        {/* Technical Details */}
        <Box>
          <Typography variant="h6" gutterBottom>
            How It Works
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Each player profile gets a unique RSA key pair (2048-bit)
            • Private key signs moves and stays on the player's device
            • Public key is shared with other players for verification
            • Moves are signed with SHA-256 + RSA-PKCS1-v1_5
            • All cryptographic operations use the Web Crypto API
            • No server involvement - everything is client-side
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};
