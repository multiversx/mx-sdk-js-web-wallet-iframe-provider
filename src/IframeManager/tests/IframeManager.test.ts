import { IframeManager } from '../IframeManager';

const walletUrl = 'https://wallet.example.com';

const getIframes = () =>
  document.querySelectorAll<HTMLIFrameElement>('iframe#mx-iframe-wallet');

// jsdom does not load the wallet page, so fire the iframe load event by hand
const loadIframe = async () => {
  for (let i = 0; i < 20 && getIframes().length === 0; i++) {
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  getIframes().forEach((iframe) => iframe.dispatchEvent(new Event('load')));
};

const openWallet = async (manager: IframeManager) => {
  const opened = manager.setWalletWindow();
  await loadIframe();
  return opened;
};

describe('IframeManager', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should load the wallet URL in an iframe', async () => {
    const manager = new IframeManager();
    manager.setWalletUrl(walletUrl);

    await expect(openWallet(manager)).resolves.toBe(true);

    expect(getIframes()).toHaveLength(1);
    expect(getIframes()[0].src).toBe(`${walletUrl}/`);
    expect(manager.walletWindow).toBe(getIframes()[0].contentWindow);
  });

  it.each(['javascript:alert(document.domain)', 'data:text/html,hi', ''])(
    'should not load a non-http(s) wallet URL: %p',
    async (url) => {
      const manager = new IframeManager();
      manager.setWalletUrl(url);

      await expect(manager.setWalletWindow()).rejects.toThrow(
        'Invalid wallet URL'
      );
      expect(getIframes()).toHaveLength(0);
    }
  );

  it('should create a single iframe for concurrent calls', async () => {
    const manager = new IframeManager();
    manager.setWalletUrl(walletUrl);

    const first = manager.setWalletWindow();
    const second = manager.setWalletWindow();
    await loadIframe();

    await expect(Promise.all([first, second])).resolves.toEqual([true, true]);
    expect(getIframes()).toHaveLength(1);
  });

  it('should replace the iframe after the wallet window is reset', async () => {
    const manager = new IframeManager();
    manager.setWalletUrl(walletUrl);
    await openWallet(manager);

    // What the base class does when the wallet ends the session
    manager.walletWindow = null;
    await openWallet(manager);

    expect(getIframes()).toHaveLength(1);
    expect(manager.walletWindow).toBe(getIframes()[0].contentWindow);
  });

  it('should remove the iframe even if closing the connection fails', async () => {
    const manager = new IframeManager();
    manager.setWalletUrl(walletUrl);
    await openWallet(manager);

    // Not initialized, so the base class throws before messaging the wallet
    await expect(manager.closeConnection()).rejects.toThrow();

    expect(getIframes()).toHaveLength(0);
    expect(manager.walletWindow).toBeNull();
  });
});
