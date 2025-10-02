/**
 * Example demonstrating the new mnemonic-based key management system
 * This shows how profiles can derive multiple keys and rotate them as needed
 */

import { 
  createPrivatePlayerProfile,
  getActiveIdentityKey,
  getActiveLobbyKey,
  getActiveGameKey,
  getActiveSigningKey,
  rotateKey,
  rotateAllKeys,
  getKeyByIndex,
  isKeyRetired,
  getRetiredKeysForPurpose,
  generateMultipleKeysFromProfile,
  generateMultipleIdentityKeys,
  generateMultipleLobbyKeys,
  generateMultipleGameKeys,
  generateMultipleSigningKeys,
  PrivatePlayerProfile
} from '~/models/private-player-profile';
import { KeyPurpose } from '~/crypto/wallet-key-types';
import { generateMultipleKeyPairs } from '~/crypto/crypto-utils';

/**
 * Example: Creating a profile and using its keys
 */
export async function exampleKeyManagement() {
  console.log('=== Key Management Example ===');
  
  // 1. Create a new profile (this generates a mnemonic and initializes key indices)
  const profile = await createPrivatePlayerProfile('TestPlayer', 'https://example.com/avatar.jpg');
  console.log('Created profile with mnemonic:', profile.walletMnemonic);
  console.log('Initial key indices:', profile.activeKeyIndices);
  
  // 2. Get the current active keys for different purposes
  const identityKey = await getActiveIdentityKey(profile);
  const lobbyKey = await getActiveLobbyKey(profile);
  const gameKey = await getActiveGameKey(profile);
  const signingKey = await getActiveSigningKey(profile);
  
  console.log('Identity key address:', identityKey.address);
  console.log('Lobby key address:', lobbyKey.address);
  console.log('Game key address:', gameKey.address);
  console.log('Signing key address:', signingKey.address);
  
  // 3. Rotate a specific key (e.g., signing key)
  console.log('\n--- Rotating signing key ---');
  const updatedProfile = rotateKey(profile, KeyPurpose.SIGNING);
  console.log('New signing key index:', updatedProfile.activeKeyIndices.signing);
  console.log('Retired keys:', updatedProfile.retiredKeyIndices);
  
  // 4. Get the new signing key
  const newSigningKey = await getActiveSigningKey(updatedProfile);
  console.log('New signing key address:', newSigningKey.address);
  
  // 5. Access a retired key (for verification purposes)
  const retiredSigningKey = await getKeyByIndex(updatedProfile, KeyPurpose.SIGNING, 0);
  console.log('Retired signing key address:', retiredSigningKey.address);
  
  // 6. Check if a key is retired
  const isRetired = isKeyRetired(updatedProfile, KeyPurpose.SIGNING, 0);
  console.log('Is key 0 retired?', isRetired);
  
  // 7. Get all retired keys for a purpose
  const retiredSigningKeys = getRetiredKeysForPurpose(updatedProfile, KeyPurpose.SIGNING);
  console.log('All retired signing keys:', retiredSigningKeys);
  
  // 8. Rotate all keys (useful for security events)
  console.log('\n--- Rotating all keys ---');
  const fullyRotatedProfile = rotateAllKeys(updatedProfile);
  console.log('All new key indices:', fullyRotatedProfile.activeKeyIndices);
  console.log('All retired keys:', fullyRotatedProfile.retiredKeyIndices);
  
  return fullyRotatedProfile;
}

/**
 * Example: Key rotation for security
 */
export async function exampleSecurityRotation(profile: PrivatePlayerProfile) {
  console.log('\n=== Security Key Rotation Example ===');
  
  // Simulate a security event - rotate all keys
  const secureProfile = rotateAllKeys(profile);
  
  // Get new keys
  const newIdentityKey = await getActiveIdentityKey(secureProfile);
  const newLobbyKey = await getActiveLobbyKey(secureProfile);
  
  console.log('New identity key after security rotation:', newIdentityKey.address);
  console.log('New lobby key after security rotation:', newLobbyKey.address);
  
  // Verify old keys are retired
  const oldIdentityKey = await getKeyByIndex(secureProfile, KeyPurpose.IDENTITY, 0);
  const isOldIdentityRetired = isKeyRetired(secureProfile, KeyPurpose.IDENTITY, 0);
  
  console.log('Old identity key (should be retired):', oldIdentityKey.address);
  console.log('Is old identity key retired?', isOldIdentityRetired);
  
  return secureProfile;
}

/**
 * Example: Using keys for different game scenarios
 */
export async function exampleGameScenarios(profile: PrivatePlayerProfile) {
  console.log('\n=== Game Scenarios Example ===');
  
  // Scenario 1: Hosting a lobby
  const lobbyKey = await getActiveLobbyKey(profile);
  console.log('Lobby host key:', lobbyKey.address);
  
  // Scenario 2: Joining a game
  const gameKey = await getActiveGameKey(profile);
  console.log('Game player key:', gameKey.address);
  
  // Scenario 3: Signing a move
  const signingKey = await getActiveSigningKey(profile);
  console.log('Move signing key:', signingKey.address);
  
  // Scenario 4: Identity verification
  const identityKey = await getActiveIdentityKey(profile);
  console.log('Identity verification key:', identityKey.address);
  
  // After the game, rotate the signing key for security
  const updatedProfile = rotateKey(profile, KeyPurpose.SIGNING);
  const newSigningKey = await getActiveSigningKey(updatedProfile);
  console.log('New signing key after game:', newSigningKey.address);
  
  return updatedProfile;
}

/**
 * Example: Generating multiple keys in batch
 */
export async function exampleMultipleKeyGeneration() {
  console.log('\n=== Multiple Key Generation Example ===');
  
  // 1. Generate multiple RSA keypairs (legacy system)
  console.log('--- Generating RSA Keypairs ---');
  const rsaKeyPairs = await generateMultipleKeyPairs(5);
  console.log(`Generated ${rsaKeyPairs.length} RSA keypairs`);
  rsaKeyPairs.forEach((keyPair, index) => {
    console.log(`RSA Keypair ${index + 1}:`);
    console.log(`  Public Key: ${keyPair.publicKey.substring(0, 50)}...`);
    console.log(`  Private Key: ${keyPair.privateKey.substring(0, 50)}...`);
  });
  
  // 2. Create a profile and generate multiple wallet-based keys
  const profile = await createPrivatePlayerProfile('MultiKeyPlayer');
  console.log('\n--- Generating Wallet-Based Keys ---');
  
  // Generate multiple identity keys
  const identityKeys = await generateMultipleIdentityKeys(profile, 3);
  console.log(`Generated ${identityKeys.length} identity keys:`);
  identityKeys.forEach((key, index) => {
    console.log(`  Identity Key ${index + 1}: ${key.address}`);
  });
  
  // Generate multiple lobby keys
  const lobbyKeys = await generateMultipleLobbyKeys(profile, 5);
  console.log(`Generated ${lobbyKeys.length} lobby keys:`);
  lobbyKeys.forEach((key, index) => {
    console.log(`  Lobby Key ${index + 1}: ${key.address}`);
  });
  
  // Generate multiple game keys
  const gameKeys = await generateMultipleGameKeys(profile, 10);
  console.log(`Generated ${gameKeys.length} game keys:`);
  gameKeys.forEach((key, index) => {
    console.log(`  Game Key ${index + 1}: ${key.address}`);
  });
  
  // Generate multiple signing keys
  const signingKeys = await generateMultipleSigningKeys(profile, 7);
  console.log(`Generated ${signingKeys.length} signing keys:`);
  signingKeys.forEach((key, index) => {
    console.log(`  Signing Key ${index + 1}: ${key.address}`);
  });
  
  // 3. Generate keys with custom start index
  console.log('\n--- Generating Keys with Custom Start Index ---');
  const customKeys = await generateMultipleKeysFromProfile(profile, KeyPurpose.SIGNING, 3, 100);
  console.log(`Generated 3 signing keys starting from index 100:`);
  customKeys.forEach((key, index) => {
    console.log(`  Signing Key ${100 + index}: ${key.address}`);
  });
  
  return profile;
}

/**
 * Example: Batch key generation for different scenarios
 */
export async function exampleBatchKeyScenarios(profile: PrivatePlayerProfile) {
  console.log('\n=== Batch Key Generation Scenarios ===');
  
  // Scenario 1: Prepare keys for multiple lobbies
  console.log('--- Scenario 1: Multiple Lobbies ---');
  const lobbyKeys = await generateMultipleLobbyKeys(profile, 5);
  console.log(`Prepared ${lobbyKeys.length} keys for hosting multiple lobbies`);
  
  // Scenario 2: Prepare keys for multiple games
  console.log('--- Scenario 2: Multiple Games ---');
  const gameKeys = await generateMultipleGameKeys(profile, 10);
  console.log(`Prepared ${gameKeys.length} keys for joining multiple games`);
  
  // Scenario 3: Prepare signing keys for high-frequency operations
  console.log('--- Scenario 3: High-Frequency Signing ---');
  const signingKeys = await generateMultipleSigningKeys(profile, 20);
  console.log(`Prepared ${signingKeys.length} keys for high-frequency signing operations`);
  
  // Scenario 4: Generate keys for different purposes in one batch
  console.log('--- Scenario 4: Mixed Purpose Keys ---');
  const [identityKeys, lobbyKeys2, gameKeys2, signingKeys2] = await Promise.all([
    generateMultipleIdentityKeys(profile, 2),
    generateMultipleLobbyKeys(profile, 3),
    generateMultipleGameKeys(profile, 4),
    generateMultipleSigningKeys(profile, 5)
  ]);
  
  console.log(`Generated mixed keys:`);
  console.log(`  Identity keys: ${identityKeys.length}`);
  console.log(`  Lobby keys: ${lobbyKeys2.length}`);
  console.log(`  Game keys: ${gameKeys2.length}`);
  console.log(`  Signing keys: ${signingKeys2.length}`);
  
  return {
    identityKeys,
    lobbyKeys: lobbyKeys2,
    gameKeys: gameKeys2,
    signingKeys: signingKeys2
  };
}

/**
 * Run all examples
 */
export async function runAllExamples() {
  try {
    const profile = await exampleKeyManagement();
    await exampleSecurityRotation(profile);
    await exampleGameScenarios(profile);
    await exampleMultipleKeyGeneration();
    await exampleBatchKeyScenarios(profile);
    console.log('\n=== All examples completed successfully! ===');
  } catch (error) {
    console.error('Error running examples:', error);
  }
}
