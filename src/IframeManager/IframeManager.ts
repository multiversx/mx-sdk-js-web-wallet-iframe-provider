import { WindowProviderResponseEnums } from '@multiversx/sdk-dapp-utils/out';
import { responseTypeMap } from '@multiversx/sdk-dapp-utils/out/constants/windowProviderConstants';
import { WindowProviderRequestEnums } from '@multiversx/sdk-dapp-utils/out/enums/windowProviderEnums';
import {
  PostMessageParamsType,
  PostMessageReturnType
} from '@multiversx/sdk-dapp-utils/out/types';
import { WindowManager } from '@multiversx/sdk-web-wallet-cross-window-provider/out/WindowManager';
import { safeDocument, safeWindow } from '../constants';
import { IframeProviderEventDataType } from '../IframeProvider';
import { IframeProviderContentWindowModel } from './IframeProviderContentWindow.model';

export class IframeManager extends WindowManager {
  private iframeWalletComponent: IframeProviderContentWindowModel | null = null;
  private readonly iframeId = 'mx-iframe-wallet';

  constructor(props?: { onDisconnect?: () => Promise<boolean> }) {
    super();
    this.registerToChildResponse({
      onDisconnect: props?.onDisconnect
    });
  }

  public get iframeWallet() {
    return this.iframeWalletComponent;
  }

  public override async postMessage<T extends WindowProviderRequestEnums>({
    type,
    payload
  }: PostMessageParamsType<T>): Promise<PostMessageReturnType<T>> {
    await this.handshake(type);

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
    return Boolean(this.walletWindow);
  }

  public override closeWalletWindow(): void {
    if (!this.walletWindow) {
      return;
    }

    this.iframeWallet?.setWalletVisible(false);
  }

  public override async setWalletWindow(): Promise<void> {
    if (this.walletWindow) {
      this.iframeWallet?.setWalletVisible(true);
      return;
    }

    const anchor = safeDocument.getElementById?.('root');

    const module = await import('./IframeProviderContentWindow');
    const IframeProviderContentWindow = module.IframeProviderContentWindow;

    this.iframeWalletComponent = new IframeProviderContentWindow({
      id: this.iframeId,
      anchor,
      url: this.walletUrl
    });
    this.iframeWalletComponent.walletAddress = this.walletUrl;

    const iframe = await new Promise(
      (resolve: (value?: HTMLIFrameElement) => void) => {
        this.iframeWalletComponent?.addEventListener(
          'iframeWindowReady',
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
    this.setWalletVisible(true);
  }

  public setWalletVisible(visible: boolean): void {
    this.iframeWalletComponent?.setWalletVisible(visible);
  }

  private registerToChildResponse = <
    T extends WindowProviderResponseEnums
  >(props?: {
    onDisconnect?: () => Promise<boolean>;
  }) => {
    safeWindow.addEventListener?.(
      'message',
      async (event: MessageEvent<IframeProviderEventDataType<T>>) => {
        const { data } = event;

        const type = data.type;

        if (event.origin !== this.walletUrl) {
          return;
        }

        if (type === WindowProviderResponseEnums.disconnectResponse) {
          await props?.onDisconnect?.();
          sessionStorage.clear();
          localStorage.clear();
          window.location.reload();
          return;
        }
      }
    );
  };
}
