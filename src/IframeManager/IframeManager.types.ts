export type IframeProviderContentWindowProps = {
  id: string;
  url: string;
};

export interface IframeProviderContentWindowModel {
  readonly contentWindow: Window | null;
  walletAddress: string;
  getContainer(): HTMLDivElement;
  getIframe(): HTMLIFrameElement;
  getContentWindow(): Window | null;
  setUrl(url: string): void;
  remove(): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject
  ): void;
}
