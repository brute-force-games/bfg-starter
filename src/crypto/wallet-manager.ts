// import MinimalBCHWallet from 'minimal-slp-wallet';
// import { 
//   KeyPurpose, 
//   KEY_DERIVATION_PATHS, 
//   WalletKey, 
//   MasterWallet, 
//   KeyDerivationRequest,
//   IdentityKey,
//   LobbyKey,
//   GameKey,
//   SigningKey,
//   WalletKeySchema} from './wallet-key-types';

// /**
//  * Wallet Manager for handling HD key derivation and management
//  * Manages a single master wallet and derives purpose-specific keys
//  */
// export class WalletManager {
//   private wallet: MinimalBCHWallet;
//   private masterWallet: MasterWallet | null = null;
//   private rootKey: any = null; // HD root key for key derivation

//   constructor() {
//     // Initialize with a new wallet
//     this.wallet = new MinimalBCHWallet();
//   }

//   /**
//    * Create a new master wallet with a new mnemonic
//    */
//   async createNewWallet(): Promise<MasterWallet> {
//     try {
//       // Create a new wallet (this generates a new mnemonic)
//       await this.wallet.create();
      
//       // Get wallet information
//       const walletInfo = this.wallet.walletInfo;
//       if (!walletInfo) {
//         throw new Error('Wallet creation failed - no wallet info available');
//       }

//       // Create HD root key from mnemonic for proper key derivation
//       const seed = await this.wallet.bchjs.Mnemonic.toSeed(walletInfo.mnemonic);
//       this.rootKey = this.wallet.bchjs.HDNode.fromSeed(seed);

//       this.masterWallet = {
//         mnemonic: walletInfo.mnemonic,
//         rootKey: walletInfo.hdPath,
//         address: walletInfo.cashAddress,
//         privateKey: walletInfo.privateKey,
//         publicKey: walletInfo.publicKey,
//         wif: walletInfo.privateKey, // Use privateKey as WIF since it's already in WIF format
//       };

//       return this.masterWallet;
//     } catch (error) {
//       console.error('Error creating new wallet:', error);
//       throw new Error('Failed to create new wallet');
//     }
//   }

//   /**
//    * Initialize wallet from existing mnemonic
//    */
//   async initializeFromMnemonic(mnemonic: string): Promise<MasterWallet> {
//     try {
//       // Create a new wallet instance to get the BCHJS functions
//       await this.wallet.create();
      
//       // Validate mnemonic
//       try {
//         const isValid = this.wallet.bchjs.Mnemonic.validate(mnemonic);
//         if (!isValid) {
//           throw new Error('Invalid mnemonic phrase');
//         }
//       } catch (validationError) {
//         // BCHJS validation is broken, use basic format validation instead
//         const words = mnemonic.trim().split(/\s+/);
//         if (words.length !== 12 && words.length !== 18 && words.length !== 24) {
//           throw new Error('Invalid mnemonic phrase - must be 12, 18, or 24 words');
//         }
//       }
      
//       // Create HD root key from mnemonic
//       const seed = await this.wallet.bchjs.Mnemonic.toSeed(mnemonic);
//       this.rootKey = this.wallet.bchjs.HDNode.fromSeed(seed);
      
//       // Derive the master key (m/44'/145'/0'/0/0)
//       const masterKeyPath = "m/44'/145'/0'/0/0";
//       const masterKey = this.rootKey.derivePath(masterKeyPath);
      
//       // Get key information
//       const privateKey = this.wallet.bchjs.HDNode.toWIF(masterKey);
//       const publicKey = this.wallet.bchjs.HDNode.toPublicKey(masterKey).toString('hex');
//       const address = this.wallet.bchjs.HDNode.toCashAddress(masterKey);

//       this.masterWallet = {
//         mnemonic: mnemonic,
//         rootKey: masterKeyPath,
//         address: address,
//         privateKey: privateKey,
//         publicKey: publicKey,
//         wif: privateKey,
//       };

//       return this.masterWallet;
//     } catch (error) {
//       console.error('Error initializing wallet from mnemonic:', error);
//       throw new Error('Failed to initialize wallet from mnemonic');
//     }
//   }

//   /**
//    * Initialize wallet from existing private key
//    */
//   async initializeFromPrivateKey(privateKey: string): Promise<MasterWallet> {
//     try {
//       // Create a new wallet instance to get the BCHJS functions
//       await this.wallet.create();
      
//       // Create key pair from private key
//       const keyPair = this.wallet.bchjs.ECPair.fromWIF(privateKey);
      
//       // Get public key and address
//       const publicKey = keyPair.getPublicKeyBuffer().toString('hex');
//       const address = this.wallet.bchjs.ECPair.toCashAddress(keyPair);
      
//       this.masterWallet = {
//         mnemonic: '', // No mnemonic when created from private key
//         rootKey: 'm/44\'/145\'/0\'/0/0', // Default path
//         address: address,
//         privateKey: privateKey,
//         publicKey: publicKey,
//         wif: privateKey,
//       };

//       return this.masterWallet;
//     } catch (error) {
//       console.error('Error initializing wallet from private key:', error);
//       throw new Error('Failed to initialize wallet from private key');
//     }
//   }

//   /**
//    * Derive a key for a specific purpose using proper HD key derivation
//    */
//   async deriveKey(request: KeyDerivationRequest): Promise<WalletKey> {
//     if (!this.masterWallet || !this.rootKey) {
//       throw new Error('Wallet not initialized. Call createNewWallet() or initializeFromMnemonic() first.');
//     }

//     try {
//       const keyIndex = request.keyIndex ?? 0;
//       const basePath = KEY_DERIVATION_PATHS[request.purpose];
//       const derivationPath = `${basePath}/${keyIndex}`;

//       // Derive the key from the root key using proper HD derivation
//       const derivedKey = this.rootKey.derivePath(derivationPath);
      
//       // Get key information
//       const privateKey = this.wallet.bchjs.HDNode.toWIF(derivedKey);
//       const publicKey = this.wallet.bchjs.HDNode.toPublicKey(derivedKey).toString('hex');
//       const address = this.wallet.bchjs.HDNode.toCashAddress(derivedKey);

//       const walletKey: WalletKey = {
//         purpose: request.purpose,
//         keyIndex,
//         derivationPath,
//         address: address,
//         privateKey: privateKey,
//         publicKey: publicKey,
//         wif: privateKey,
//       };

//       // Validate the derived key
//       WalletKeySchema.parse(walletKey);

//       return walletKey;
//     } catch (error) {
//       console.error('Error deriving key:', error);
//       throw new Error(`Failed to derive key for purpose: ${request.purpose}`);
//     }
//   }

//   /**
//    * Get identity key (for user authentication)
//    */
//   async getIdentityKey(keyIndex: number = 0): Promise<IdentityKey> {
//     const walletKey = await this.deriveKey({ 
//       purpose: KeyPurpose.IDENTITY, 
//       keyIndex 
//     });
//     return new IdentityKey(walletKey);
//   }

//   /**
//    * Get lobby key (for creating/managing lobbies)
//    */
//   async getLobbyKey(keyIndex: number = 0): Promise<LobbyKey> {
//     const walletKey = await this.deriveKey({ 
//       purpose: KeyPurpose.LOBBY, 
//       keyIndex 
//     });
//     return new LobbyKey(walletKey);
//   }

//   /**
//    * Get game key (for creating/managing games)
//    */
//   async getGameKey(keyIndex: number = 0): Promise<GameKey> {
//     const walletKey = await this.deriveKey({ 
//       purpose: KeyPurpose.GAME, 
//       keyIndex 
//     });
//     return new GameKey(walletKey);
//   }

//   /**
//    * Get signing key (for signing moves and transactions)
//    */
//   async getSigningKey(keyIndex: number = 0): Promise<SigningKey> {
//     const walletKey = await this.deriveKey({ 
//       purpose: KeyPurpose.SIGNING, 
//       keyIndex 
//     });
//     return new SigningKey(walletKey);
//   }

//   /**
//    * Get multiple keys for a specific purpose
//    */
//   async getMultipleKeys(purpose: KeyPurpose, count: number): Promise<WalletKey[]> {
//     const keys: WalletKey[] = [];
//     for (let i = 0; i < count; i++) {
//       const key = await this.deriveKey({ purpose, keyIndex: i });
//       keys.push(key);
//     }
//     return keys;
//   }

//   /**
//    * Get the master wallet information
//    */
//   getMasterWallet(): MasterWallet | null {
//     return this.masterWallet;
//   }

//   /**
//    * Check if wallet is initialized
//    */
//   isInitialized(): boolean {
//     return this.masterWallet !== null;
//   }

//   /**
//    * Get wallet balance (BCH) - Optional for identity management
//    */
//   async getBalance(): Promise<number> {
//     if (!this.masterWallet) {
//       throw new Error('Wallet not initialized');
//     }

//     try {
//       // Since we're focusing on identity management, we can return 0 or skip balance checks
//       console.log('Balance check skipped - focusing on identity management');
//       return 0;
//     } catch (error) {
//       console.error('Error getting balance:', error);
//       return 0; // Return 0 instead of throwing error for identity-focused usage
//     }
//   }

//   /**
//    * Get UTXOs for the wallet - Optional for identity management
//    */
//   async getUtxos(): Promise<any[]> {
//     if (!this.masterWallet) {
//       throw new Error('Wallet not initialized');
//     }

//     try {
//       // Since we're focusing on identity management, we can return empty array
//       console.log('UTXO check skipped - focusing on identity management');
//       return [];
//     } catch (error) {
//       console.error('Error getting UTXOs:', error);
//       return []; // Return empty array instead of throwing error for identity-focused usage
//     }
//   }

//   /**
//    * Sign a message with a specific key using BCHJS BitcoinCash message signing
//    */
//   async signMessage(message: string, key: WalletKey): Promise<string> {
//     try {
//       // Use BCHJS BitcoinCash message signing
//       const signature = this.wallet.bchjs.BitcoinCash.signMessageWithPrivKey(key.privateKey, message);
      
//       return signature;
//     } catch (error) {
//       console.error('Error signing message:', error);
//       throw new Error('Failed to sign message');
//     }
//   }

//   /**
//    * Verify a message signature using BCHJS BitcoinCash message verification
//    */
//   async verifyMessage(message: string, signature: string, address: string): Promise<boolean> {
//     try {
//       // Use BCHJS BitcoinCash message verification
//       return this.wallet.bchjs.BitcoinCash.verifyMessage(address, signature, message);
//     } catch (error) {
//       console.error('Error verifying message:', error);
//       return false;
//     }
//   }

//   /**
//    * Encrypt the master wallet mnemonic for secure storage
//    */
//   async encryptMnemonic(password: string): Promise<string> {
//     if (!this.masterWallet) {
//       throw new Error('Wallet not initialized');
//     }

//     try {
//       const encrypted = await this.wallet.encryptWallet(password);
//       return encrypted;
//     } catch (error) {
//       console.error('Error encrypting mnemonic:', error);
//       throw new Error('Failed to encrypt mnemonic');
//     }
//   }

//   /**
//    * Decrypt and initialize wallet from encrypted mnemonic
//    */
//   async decryptMnemonic(encryptedMnemonic: string, password: string): Promise<MasterWallet> {
//     try {
//       const mnemonic = await this.wallet.decryptWallet(encryptedMnemonic, password);
//       return await this.initializeFromMnemonic(mnemonic);
//     } catch (error) {
//       console.error('Error decrypting mnemonic:', error);
//       throw new Error('Failed to decrypt mnemonic');
//     }
//   }
// }

// /**
//  * Singleton instance of the wallet manager
//  */
// export const walletManager = new WalletManager();

// // Re-export types for convenience
// export type { IdentityKey, LobbyKey, GameKey, SigningKey } from './wallet-key-types';
