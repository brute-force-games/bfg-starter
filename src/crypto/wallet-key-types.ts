// import { z } from 'zod';

// /**
//  * Key derivation paths for different purposes in the BFG application
//  * All keys are derived from a single master seed phrase using HD wallet derivation
//  */
// export enum KeyPurpose {
//   IDENTITY = 'identity',     // User identity and authentication
//   LOBBY = 'lobby',          // Creating and managing lobbies
//   GAME = 'game',            // Creating and managing games
//   SIGNING = 'signing',      // Signing moves and transactions
// }

// /**
//  * Key derivation path structure
//  * Format: m/44'/145'/0'/{purpose_index}/{key_index}
//  * - 44': BIP44 standard
//  * - 145': Bitcoin Cash coin type
//  * - 0': Account index (0 for main account)
//  * - purpose_index: Specific purpose (0=identity, 1=lobby, 2=game, 3=signing)
//  * - key_index: Specific key within that purpose
//  */
// export const KEY_DERIVATION_PATHS = {
//   [KeyPurpose.IDENTITY]: "m/44'/145'/0'/0",      // Identity keys
//   [KeyPurpose.LOBBY]: "m/44'/145'/0'/1",         // Lobby keys
//   [KeyPurpose.GAME]: "m/44'/145'/0'/2",          // Game keys
//   [KeyPurpose.SIGNING]: "m/44'/145'/0'/3",       // Signing keys
// } as const;

// /**
//  * Wallet key information
//  */
// export interface WalletKey {
//   purpose: KeyPurpose;
//   keyIndex: number;
//   derivationPath: string;
//   address: string;
//   privateKey: string;
//   publicKey: string;
//   wif: string; // Wallet Import Format
// }

// /**
//  * Master wallet information
//  */
// export interface MasterWallet {
//   mnemonic: string;
//   rootKey: string;
//   address: string;
//   privateKey: string;
//   publicKey: string;
//   wif: string;
// }

// /**
//  * Key derivation request
//  */
// export interface KeyDerivationRequest {
//   purpose: KeyPurpose;
//   keyIndex?: number; // Defaults to 0 if not specified
// }

// /**
//  * Wallet key schema for validation
//  */
// export const WalletKeySchema = z.object({
//   purpose: z.nativeEnum(KeyPurpose),
//   keyIndex: z.number().int().min(0),
//   derivationPath: z.string(),
//   address: z.string(),
//   privateKey: z.string(),
//   publicKey: z.string(),
//   wif: z.string(),
// });

// /**
//  * Master wallet schema for validation
//  */
// export const MasterWalletSchema = z.object({
//   mnemonic: z.string(),
//   rootKey: z.string(),
//   address: z.string(),
//   privateKey: z.string(),
//   publicKey: z.string(),
//   wif: z.string(),
// });

// export type WalletKeyType = z.infer<typeof WalletKeySchema>;
// export type MasterWalletType = z.infer<typeof MasterWalletSchema>;

// /**
//  * Key class definitions for different purposes
//  */
// export class IdentityKey {
//   constructor(public walletKey: WalletKey) {
//     if (walletKey.purpose !== KeyPurpose.IDENTITY) {
//       throw new Error('IdentityKey must be created with an IDENTITY purpose key');
//     }
//   }

//   get address(): string {
//     return this.walletKey.address;
//   }

//   get publicKey(): string {
//     return this.walletKey.publicKey;
//   }

//   get privateKey(): string {
//     return this.walletKey.privateKey;
//   }

//   get wif(): string {
//     return this.walletKey.wif;
//   }
// }

// export class LobbyKey {
//   constructor(public walletKey: WalletKey) {
//     if (walletKey.purpose !== KeyPurpose.LOBBY) {
//       throw new Error('LobbyKey must be created with a LOBBY purpose key');
//     }
//   }

//   get address(): string {
//     return this.walletKey.address;
//   }

//   get publicKey(): string {
//     return this.walletKey.publicKey;
//   }

//   get privateKey(): string {
//     return this.walletKey.privateKey;
//   }

//   get wif(): string {
//     return this.walletKey.wif;
//   }
// }

// export class GameKey {
//   constructor(public walletKey: WalletKey) {
//     if (walletKey.purpose !== KeyPurpose.GAME) {
//       throw new Error('GameKey must be created with a GAME purpose key');
//     }
//   }

//   get address(): string {
//     return this.walletKey.address;
//   }

//   get publicKey(): string {
//     return this.walletKey.publicKey;
//   }

//   get privateKey(): string {
//     return this.walletKey.privateKey;
//   }

//   get wif(): string {
//     return this.walletKey.wif;
//   }
// }

// export class SigningKey {
//   constructor(public walletKey: WalletKey) {
//     if (walletKey.purpose !== KeyPurpose.SIGNING) {
//       throw new Error('SigningKey must be created with a SIGNING purpose key');
//     }
//   }

//   get address(): string {
//     return this.walletKey.address;
//   }

//   get publicKey(): string {
//     return this.walletKey.publicKey;
//   }

//   get privateKey(): string {
//     return this.walletKey.privateKey;
//   }

//   get wif(): string {
//     return this.walletKey.wif;
//   }
// }
