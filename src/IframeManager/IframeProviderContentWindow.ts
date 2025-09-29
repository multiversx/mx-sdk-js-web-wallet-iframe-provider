import { iframeWindowReadyEvent, safeDocument } from '../constants';
import {
  IframeProviderContentWindowModel,
  IframeProviderContentWindowProps
} from './IframeManager.types';

export class IframeProviderContentWindow
  implements IframeProviderContentWindowModel
{
  public contentWindow: Window | null = null;
  public walletAddress = '';
  private readonly container: HTMLDivElement;
  private readonly iframe: HTMLIFrameElement;

  public constructor(props: IframeProviderContentWindowProps) {
    const { id, url } = props;

    this.container = safeDocument.createElement?.('div') as HTMLDivElement;
    this.iframe = safeDocument.createElement?.('iframe') as HTMLIFrameElement;

    this.iframe.id = id;
    this.iframe.src = url;

    this.container.appendChild(this.iframe);
    safeDocument.body?.appendChild?.(this.container);

    this.contentWindow = this.iframe.contentWindow;
    this.setupWindow();
  }

  private setupWindow() {
    this.iframe.onload = () => {
      this.contentWindow = this.iframe.contentWindow;
      const event = new CustomEvent(iframeWindowReadyEvent, {
        detail: this.iframe
      });
      this.iframe.dispatchEvent(event);
    };
  }

  public getContainer(): HTMLDivElement {
    return this.container;
  }

  public getIframe(): HTMLIFrameElement {
    return this.iframe;
  }

  public getContentWindow(): Window | null {
    return this.contentWindow;
  }

  public setUrl(url: string): void {
    this.iframe.setAttribute('src', url);
  }

  public remove(): void {
    this.container.remove();
  }

  public addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject
  ): void {
    this.iframe.addEventListener(type, listener);
  }
}
