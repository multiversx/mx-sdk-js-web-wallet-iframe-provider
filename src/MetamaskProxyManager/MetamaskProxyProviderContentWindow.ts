import { safeDocument } from '../constants';
import {
  bodyStyle,
  containerStyle,
  headerStyle,
  headingElementStyle,
  iframeStyle,
  titleElementStyle,
  toggleIconElementStyle
} from './MetamaskProxyManager.styles';
import { MetamaskProxyProviderContentWindowModel } from './MetamaskProxyProviderContentWindow.model';

type MetamaskProxyProviderContentWindowProps = {
  id: string;
  url: string;
  anchor?: HTMLElement;
};

export class MetamaskProxyProviderContentWindow
  implements MetamaskProxyProviderContentWindowModel
{
  public contentWindow: Window | null;
  public walletAddress = '';

  private readonly container: HTMLDivElement;
  private readonly header: HTMLDivElement;
  private readonly title: HTMLDivElement;
  private readonly body: HTMLDivElement;
  private readonly iframe: HTMLIFrameElement;

  public constructor(props: MetamaskProxyProviderContentWindowProps) {
    const { id, url, anchor } = props;

    this.container = safeDocument.createElement?.('div');
    this.header = safeDocument.createElement?.('div');
    this.title = safeDocument.createElement?.('div');
    this.body = safeDocument.createElement?.('div');
    this.iframe = safeDocument.createElement?.('iframe');
    this.iframe.allow = 'publickey-credentials-get *';
    console.log('herererere!@!#!@#! creating content window111');
    this.buildWindow(id, url);
    this.contentWindow = this.iframe.contentWindow;
    this.setupWindow();

    if (anchor) {
      anchor.appendChild(this.container);
    } else {
      safeDocument.body?.appendChild?.(this.container);
    }
  }

  private buildWindow(id: string, url: string) {
    this.container.id = `window-container-${id}`;
    this.iframe.id = id;
    this.iframe.src = url;

    this.container.style.cssText = containerStyle;
    this.header.style.cssText = headerStyle;
    this.body.style.cssText = bodyStyle;
    this.iframe.style.cssText = iframeStyle;

    this.buildContainer();
  }

  private buildHeader() {
    const metaMaskIcon =
      '<img src="https://developer.apple.com/assets/elements/icons/passkeys/passkeys-96x96_2x.png" class="icon-passkeys center" width="50" alt="" data-hires-status="pending">';

    const toggleIcon =
      '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="arrow-right-to-line" class="svg-inline--fa fa-arrow-right-to-line " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="width: 20px;color: #737373;"><path fill="currentColor" d="M448 88c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 336c0 13.3 10.7 24 24 24s24-10.7 24-24l0-336zM312.4 273.5c4.8-4.5 7.6-10.9 7.6-17.5s-2.7-12.9-7.6-17.5l-136-128c-9.7-9.1-24.8-8.6-33.9 1s-8.6 24.8 1 33.9L235.5 232 152 232 24 232c-13.3 0-24 10.7-24 24s10.7 24 24 24l128 0 83.5 0-91.9 86.5c-9.7 9.1-10.1 24.3-1 33.9s24.3 10.1 33.9 1l136-128z"></path></svg>';

    const headingElement = safeDocument.createElement?.('div');
    const metaMaskIconElement = safeDocument.createElement?.('div');
    const toggleIconElement = safeDocument.createElement?.('div');

    metaMaskIconElement.innerHTML = metaMaskIcon;
    toggleIconElement.innerHTML = toggleIcon;
    toggleIconElement.style.cssText = toggleIconElementStyle;
    this.title.innerText = 'Passkey Login';
    this.title.style.cssText = titleElementStyle;

    headingElement.id = 'metamask-proxy-window-toggle-button';
    headingElement.style.cssText = headingElementStyle;
    headingElement.appendChild(metaMaskIconElement);
    headingElement.appendChild(this.title);
    headingElement.appendChild(toggleIconElement);

    headingElement.onclick = () => {
      if (this.body.style.visibility === 'visible') {
        this.forceHidden();
        return;
      }

      this.forceVisible();
    };

    this.header.appendChild(headingElement);
  }

  private buildContainer() {
    this.container.appendChild(this.header);
    this.container.appendChild(this.body);
    this.body.appendChild(this.iframe);
    this.buildHeader();
  }

  private setupWindow() {
    this.iframe.onload = () => {
      this.contentWindow = this.iframe.contentWindow;

      const event = new CustomEvent('metamaskProxyWindowReady', {
        detail: this.iframe
      });

      this.iframe.dispatchEvent(event);
    };
  }

  private forceVisible() {
    this.body.style.visibility = 'visible';
    this.container.style.visibility = 'visible';
    this.container.style.height = 'calc(100vh - 64px - 8px)';
    this.container.style.transform = 'translateX(0)';
    this.title.style.opacity = '1';
  }

  private forceHidden() {
    this.body.style.visibility = 'hidden';
    this.container.style.height = '80px';
    this.container.style.transform =
      'translateX(calc(min(420px, 100vw - 8px) - 80px)';
    this.title.style.opacity = '0';
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

  public setWalletVisible(visible: boolean): void {
    if (visible) {
      this.forceVisible();
      return;
    }

    this.forceHidden();
  }

  public addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject
  ): void {
    this.iframe.addEventListener(type, listener);
  }
}
