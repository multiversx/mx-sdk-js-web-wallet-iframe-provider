import { IframeLoginTypes } from '../constants';

const IframeLoginTypesExtended = {
  ...IframeLoginTypes
} as const;

export type ExtendedIframeLoginType<
  T extends
    keyof typeof IframeLoginTypesExtended = keyof typeof IframeLoginTypesExtended
> = T;

export type IframeProviderContentWindowProps<
  T extends
    keyof typeof IframeLoginTypesExtended = keyof typeof IframeLoginTypesExtended
> = {
  id: string;
  url: string;
  anchor?: HTMLElement;
  loginType: T;
};

/**
 * @description Login branding type for custom providers. Icon can be a `svg` or `img` tag
 * @example
 *  {
 *    custom: {
 *      title: 'Custom Login'
 *      icon: '<svg width="32" height="27" viewBox="0 0 30 27" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_3350_30150)"><path d="M27.5788 0.0566406L16.291 8.44025L18.3784 3.49404L27.5788 0.0566406Z" fill="#E2761B" stroke="#E2761B" stroke-width="0.113445" stroke-linecap="round" stroke-linejoin="round"></path><path d="M1.52125 0.0566406L12.7183 8.51967L10.733 3.49404L1.52125 0.0566406ZM23.5183 19.4898L20.512 24.0957L26.9444 25.8655L28.7935 19.5919L23.5183 19.4898ZM0.330078 19.5919L2.16789 25.8655L8.60025 24.0957L5.59394 19.4898L0.330078 19.5919Z" fill="#E4761B" stroke="#E4761B" stroke-width="0.113445" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8.23677 11.7077L6.44434 14.419L12.8313 14.7026L12.6044 7.83918L8.23677 11.7077ZM20.8632 11.7077L16.4389 7.75977L16.2914 14.7026L22.667 14.419L20.8632 11.7077ZM8.5998 24.0959L12.4343 22.224L9.12165 19.6375L8.5998 24.0959ZM16.6658 22.224L20.5116 24.0959L19.9784 19.6375L16.6658 22.224Z" fill="#E4761B" stroke="#E4761B" stroke-width="0.113445" stroke-linecap="round" stroke-linejoin="round"></path><path d="M20.5114 24.0965L16.6656 22.2246L16.9719 24.7318L16.9378 25.7868L20.5114 24.0965ZM8.59961 24.0965L12.1731 25.7868L12.1505 24.7318L12.4341 22.2246L8.59961 24.0965Z" fill="#D7C1B3" stroke="#D7C1B3" stroke-width="0.113445" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12.2304 17.9818L9.03125 17.0402L11.2888 16.0078L12.2304 17.9818ZM16.8703 17.9818L17.8119 16.0078L20.0808 17.0402L16.8703 17.9818Z" fill="#233447" stroke="#233447" stroke-width="0.113445" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8.60005 24.0958L9.14459 19.49L5.59375 19.5921L8.60005 24.0958ZM19.9673 19.49L20.5118 24.0958L23.5181 19.5921L19.9673 19.49ZM22.6673 14.4189L16.2916 14.7026L16.8816 17.9811L17.8232 16.0072L20.0921 17.0395L22.6673 14.4189ZM9.03114 17.0395L11.3001 16.0072L12.2303 17.9811L12.8316 14.7026L6.44459 14.4189L9.03114 17.0395Z" fill="#CD6116" stroke="#CD6116" stroke-width="0.113445" stroke-linecap="round" stroke-linejoin="round"></path><path d="M6.44434 14.4189L9.12165 19.6374L9.03089 17.0395L6.44434 14.4189ZM20.0918 17.0395L19.9784 19.6374L22.667 14.4189L20.0918 17.0395ZM12.8313 14.7026L12.2301 17.9811L12.9788 21.8496L13.149 16.7559L12.8313 14.7026ZM16.2914 14.7026L15.9851 16.7446L16.1212 21.8496L16.8813 17.9811L16.2914 14.7026Z" fill="#E4751F" stroke="#E4751F" stroke-width="0.113445" stroke-linecap="round" stroke-linejoin="round"></path><path d="M16.8817 17.9807L16.1216 21.8491L16.6661 22.2235L19.9787 19.637L20.0922 17.0391L16.8817 17.9807ZM9.03125 17.0391L9.12201 19.637L12.4346 22.2235L12.9791 21.8491L12.2304 17.9807L9.03125 17.0391Z" fill="#F6851B" stroke="#F6851B" stroke-width="0.113445" stroke-linecap="round" stroke-linejoin="round"></path><path d="M16.9378 25.786L16.9719 24.731L16.6883 24.4814H12.4114L12.1505 24.731L12.1731 25.786L8.59961 24.0957L9.84751 25.1167L12.3773 26.8751H16.7223L19.2635 25.1167L20.5114 24.0957L16.9378 25.786Z" fill="#C0AD9E" stroke="#C0AD9E" stroke-width="0.113445" stroke-linecap="round" stroke-linejoin="round"></path><path d="M16.6655 22.224L16.121 21.8496H12.9785L12.434 22.224L12.1504 24.7311L12.4113 24.4815H16.6882L16.9718 24.7311L16.6655 22.224Z" fill="#161616" stroke="#161616" stroke-width="0.113445" stroke-linecap="round" stroke-linejoin="round"></path><path d="M28.0551 8.98479L29.0194 4.35622L27.5786 0.0566406L16.6652 8.15664L20.8627 11.7075L26.7959 13.4432L28.1118 11.9117L27.5446 11.5033L28.4522 10.6751L27.7488 10.1306L28.6564 9.43857L28.0551 8.98479ZM0.0908203 4.35622L1.05511 8.98479L0.442501 9.43857L1.35006 10.1306L0.658047 10.6751L1.56561 11.5033L0.998383 11.9117L2.30301 13.4432L8.2362 11.7075L12.4337 8.15664L1.52023 0.0566406L0.0908203 4.35622Z" fill="#763D16" stroke="#763D16" stroke-width="0.113445" stroke-linecap="round" stroke-linejoin="round"></path><path d="M26.7969 13.4433L20.8637 11.7076L22.6675 14.4189L19.9788 19.6374L23.5183 19.592H28.7935L26.7969 13.4433ZM8.23722 11.7076L2.30403 13.4433L0.330078 19.592H5.59394L9.12209 19.6374L6.44478 14.4189L8.23722 11.7076ZM16.2918 14.7025L16.6662 8.15675L18.3906 3.49414H10.733L12.4347 8.15675L12.8318 14.7025L12.9679 16.7672L12.9792 21.8496H16.1217L16.1444 16.7672L16.2918 14.7025Z" fill="#F6851B" stroke="#F6851B" stroke-width="0.113445" stroke-linecap="round" stroke-linejoin="round"></path></g><defs><clipPath id="clip0_3350_30150"><rect width="29.1555" height="27" fill="white"></rect></clipPath></defs></svg>',
 *    }
 *  }
 */
export type LoginBrandingType<
  T extends
    keyof typeof IframeLoginTypesExtended = keyof typeof IframeLoginTypesExtended
> = {
  [key in T]: {
    icon: string;
    title: string;
  };
};

export interface IframeProviderContentWindowModel {
  readonly contentWindow: Window | null;
  walletAddress: string;
  getContainer(): HTMLDivElement;
  getIframe(): HTMLIFrameElement;
  getContentWindow(): Window | null;
  setUrl(url: string): void;
  setLoginBranding(loginBranding: LoginBrandingType): void;
  remove(): void;
  setWalletVisible(visible: boolean): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject
  ): void;
}
