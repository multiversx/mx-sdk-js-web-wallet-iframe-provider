import { responseTypeMap } from '@multiversx/sdk-web-wallet-cross-window-provider/out/constants/windowProviderConstants';
import { WindowProviderRequestEnums } from '@multiversx/sdk-web-wallet-cross-window-provider/out/enums/windowProviderEnums';
import {
  PostMessageParamsType,
  PostMessageReturnType
} from '@multiversx/sdk-web-wallet-cross-window-provider/out/types';
import { WindowManager } from '@multiversx/sdk-web-wallet-cross-window-provider/out/WindowManager';
import { iframeWindowReadyEvent } from '../constants';
import { IframeProviderContentWindowModel } from './IframeManager.types';

const isAllowedWalletUrl = (url: string) => {
  try {
    const { protocol } = new URL(url);
    return protocol === 'https:' || protocol === 'http:';
  } catch {
    return false;
  }
};

export class IframeManager extends WindowManager {
  private iframeWalletComponent: IframeProviderContentWindowModel | null = null;
  private readonly iframeId = 'mx-iframe-wallet';
  private hasHandshake: boolean;
  private pendingWalletWindow: Promise<boolean> | null = null;

  constructor() {
    super();

    this.hasHandshake = false;
  }

  public get iframeWallet() {
    return this.iframeWalletComponent;
  }

  public override async postMessage<T extends WindowProviderRequestEnums>({
    type,
    payload
  }: PostMessageParamsType<T>): Promise<PostMessageReturnType<T>> {
    this.hasHandshake = await this.handshake(type);

    if (!this.hasHandshake) {
      throw new Error('Cannot establish handshake');
    }

    this.walletWindow?.postMessage(
      {
        type,
        payload
      },
      this.walletUrl
    );

    return await this.listenOnce(responseTypeMap[type]);
  }

  public override async closeConnection(): Promise<boolean> {
    try {
      return await super.closeConnection();
    } finally {
      // Remove the wallet iframe even if the logout message fails
      this.removeIframe();
    }
  }

  private removeIframe() {
    this.iframeWalletComponent?.remove();
    this.iframeWalletComponent = null;
    this.walletWindow = null;
    this.hasHandshake = false;
  }

  public override isWalletOpened(): boolean {
    return Boolean(this.walletWindow) && this.hasHandshake;
  }

  public override closeWalletWindow(): void {
    if (!this.walletWindow) {
      return;
    }
  }

  public override async setWalletWindow(): Promise<boolean> {
    if (this.walletWindow) {
      return true;
    }

    // Concurrent calls share one iframe instead of each creating their own
    if (!this.pendingWalletWindow) {
      this.pendingWalletWindow = this.createIframe().finally(() => {
        this.pendingWalletWindow = null;
      });
    }

    return this.pendingWalletWindow;
  }

  private async createIframe(): Promise<boolean> {
    if (!isAllowedWalletUrl(this.walletUrl)) {
      throw new Error('Invalid wallet URL: only http(s) URLs are allowed');
    }
    
    this.removeIframe();

    const module = await import('./IframeProviderContentWindow');
    const IframeProviderContentWindow = module.IframeProviderContentWindow;

    this.iframeWalletComponent = new IframeProviderContentWindow({
      id: this.iframeId,
      url: this.walletUrl
    });
    this.iframeWalletComponent.walletAddress = this.walletUrl;

    const iframe = await new Promise(
      (resolve: (value?: HTMLIFrameElement) => void) => {
        this.iframeWalletComponent?.addEventListener(
          iframeWindowReadyEvent,
          (event: Event & { detail?: HTMLIFrameElement }) => {
            resolve(event.detail);
          }
        );
      }
    );

    if (!iframe) {
      throw new Error('Cannot initialize iframe window');
    }

    this.walletWindow = iframe.contentWindow;
    return true;
  }
}
