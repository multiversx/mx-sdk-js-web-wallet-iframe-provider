export interface MetamaskProxyProviderContentWindowModel {
  readonly contentWindow: Window | null;
  walletAddress: string;
  getContainer(): HTMLDivElement;
  getIframe(): HTMLIFrameElement;
  getContentWindow(): Window | null;
  setUrl(url: string): void;
  remove(): void;
  setWalletVisible(visible: boolean): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject
  ): void;
}
