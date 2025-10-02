declare module 'minimal-slp-wallet' {
  interface WalletInfo {
    mnemonic: string;
    hdPath: string;
    cashAddress: string;
    privateKey: string;
    publicKey: string;
  }

  interface BCHJS {
    Mnemonic: {
      generate(entropy: number): string;
      validate(mnemonic: string): boolean;
      toSeed(mnemonic: string): Promise<Buffer>;
    };
    HDNode: {
      fromSeed(seed: Buffer): any;
      toWIF(hdNode: any): string;
      toPublicKey(hdNode: any): Buffer;
      toCashAddress(hdNode: any): string;
    };
    ECPair: {
      fromWIF(wif: string): any;
      toCashAddress(keyPair: any): string;
    };
    BitcoinCash: {
      signMessageWithPrivKey(privateKey: string, message: string): string;
      verifyMessage(address: string, signature: string, message: string): boolean;
    };
  }

  class MinimalBCHWallet {
    walletInfo: WalletInfo | null;
    bchjs: BCHJS;
    
    constructor();
    create(): Promise<void>;
    encryptWallet(password: string): Promise<string>;
    decryptWallet(encrypted: string, password: string): Promise<string>;
  }

  export default MinimalBCHWallet;
}
