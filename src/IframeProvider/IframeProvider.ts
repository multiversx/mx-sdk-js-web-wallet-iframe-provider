import type { SignableMessage } from '@multiversx/sdk-core/out';
import type { Transaction } from '@multiversx/sdk-core/out/transaction';
import {
  WindowProviderResponseEnums,
  ReplyWithPostMessagePayloadType
} from '@multiversx/sdk-dapp-utils/out';
import {
  CrossWindowProvider,
  ICrossWindowWalletAccount
  // !!! IMPORTANT !!! It is necessary to import explicitly from the file because the module exports (can export) some classes
  // that are using window API and will break the build process on the SSR environments (e.g. PopupConsent)
} from '@multiversx/sdk-web-wallet-cross-window-provider/out/CrossWindowProvider/CrossWindowProvider';
import {
  ErrCouldNotLogin,
  ErrProviderNotInitialized
} from '@multiversx/sdk-web-wallet-cross-window-provider/out/errors';
import { IframeManager } from '../IframeManager/IframeManager';

export type IframeProviderEventDataType<T extends WindowProviderResponseEnums> =
  {
    type: T;
    payload: ReplyWithPostMessagePayloadType<T>;
  };

export class IframeProvider extends CrossWindowProvider {
  protected static _instance: IframeProvider | null = null;
  protected readonly windowManager: IframeManager;

  public constructor() {
    super();
    this.windowManager = new IframeManager({
      onDisconnect: this.logout.bind(this)
    });
  }

  public static getInstance(): IframeProvider {
    if (!IframeProvider._instance) {
      IframeProvider._instance = new IframeProvider();
      return <IframeProvider>IframeProvider._instance;
    }

    return <IframeProvider>IframeProvider._instance;
  }

  public override async init(): Promise<boolean> {
    const initialized = await super.init();
    await this.windowManager.setWalletWindow();

    return initialized;
  }

  public override async login(
    options: {
      token?: string;
    } = {}
  ): Promise<ICrossWindowWalletAccount> {
    await this.windowManager.setWalletWindow();
    const account = await super.login(options);

    if (!account.address) {
      this.windowManager.iframeWallet?.remove();
      this.windowManager.walletWindow = null;
      throw new ErrCouldNotLogin();
    }

    return account;
  }

  public override async dispose(): Promise<boolean> {
    return super.dispose();
  }

  public override async logout(): Promise<boolean> {
    if (!this.initialized) {
      throw new ErrProviderNotInitialized();
    }

    try {
      this.ensureConnected();
      await this.windowManager.closeConnection();
    } catch (e) {
      console.error(e);
    }

    this.initialized = false;
    this.disconnect();

    return true;
  }

  public override async signTransaction(
    transaction: Transaction
  ): Promise<Transaction> {
    await this.windowManager.setWalletWindow();
    return super.signTransaction(transaction);
  }

  public override async signTransactions(
    transactions: Transaction[]
  ): Promise<Transaction[]> {
    await this.windowManager.setWalletWindow();
    return super.signTransactions(transactions);
  }

  public override async guardTransactions(
    transactions: Transaction[]
  ): Promise<Transaction[]> {
    await this.windowManager.setWalletWindow();
    return super.guardTransactions(transactions);
  }

  public override async signMessage(
    message: SignableMessage
  ): Promise<SignableMessage> {
    await this.windowManager.setWalletWindow();
    return super.signMessage(message);
  }

  public override async openPopupConsent(): Promise<boolean> {
    return true;
  }
}
