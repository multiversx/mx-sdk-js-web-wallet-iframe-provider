import { responseTypeMap } from '@multiversx/sdk-web-wallet-cross-window-provider/out/constants/windowProviderConstants';
import { WindowProviderRequestEnums } from '@multiversx/sdk-web-wallet-cross-window-provider/out/enums/windowProviderEnums';
import {
  PostMessageParamsType,
  PostMessageReturnType
} from '@multiversx/sdk-web-wallet-cross-window-provider/out/types';
import { WindowManager } from '@multiversx/sdk-web-wallet-cross-window-provider/out/WindowManager';
import { IframeProviderContentWindowModel } from './IframeManager.types';
import { iframeWindowReadyEvent } from '../constants';

export class IframeManager extends WindowManager {
  private iframeWalletComponent: IframeProviderContentWindowModel | null = null;
  private readonly iframeId = 'mx-iframe-wallet';
  private hasHandshake: boolean;

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
    const result = await super.closeConnection();
    this.iframeWalletComponent?.remove();
    this.walletWindow = null;
    return result;
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
