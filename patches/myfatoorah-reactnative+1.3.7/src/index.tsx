import React from 'react';
import { NativeModules, NativeEventEmitter, ProcessedColorValue, requireNativeComponent, Platform } from 'react-native';
import {
  MFCountry,
  MFEnvironment,
  MFLanguage,
  MFCurrencyISO,
  MFMobileCountryCodeISO,
  MFNotificationOption,
  MFKeyType,
  MFFontWeight,
  MFFontFamily,
  MFRecurringType,
  MFTokenType,
} from './MFEnums';
import {
  MFSendPaymentRequest,
  MFSendPaymentResponse,
  MFInitiatePaymentRequest,
  MFInitiatePaymentResponse,
  MFGetPaymentStatusRequest,
  MFGetPaymentStatusResponse,
  MFExecutePaymentRequest,
  MFExecutePaymentResponse,
  MFDirectPaymentRequest,
  MFDirectPaymentResponse,
  MFInitiateSessionRequest,
  MFInitiateSessionResponse,
  MFCallbackResponse,
  MFCardViewStyle,
  MFApplePayStyle,
  MFPaymentMethod,
  MFCustomerAddress,
  MFInvoiceItem,
  MFSupplier,
  MFRecurringModel,
  MFProcessingDetails,
  MFPaymentWithTokenRequest,
  MFInvoiceTransaction,
  MFSupplierItem,
  MFCardRequest,
  DirectPaymentResponse,
  CardInfo,
  MFError,
  MFSubmitCardViewResponse,
  MFCardViewInput,
  MFCardViewPlaceHolder,
  MFCardViewLabel,
  MFCardViewText,
  MFCardViewError,
  MFBoxShadow,
  MFSavedCardText,
  MFDeleteAlert,
  MFApplePayToken,
  MFApplePayRequest,
  MFGooglePayRequest,
  MFGooglePayButtonStyle
} from './MFModels';
import { LINKING_ERROR, modelParser, PLATFORM_ERROR } from './MFUtils';
import { GooglePayButtonConstants, IGooglePayButtonProps, MFGPayButton } from './GooglePay';

//#region SDK

const _proxy = new Proxy(
  {},
  {
    get() {
      throw new Error(LINKING_ERROR);
    },
  }
);
const MFModule = NativeModules.MFModule ? NativeModules.MFModule : _proxy;

// SAFE: Only create event emitter if module exists
let MFEventEmitter = null;
try {
  if (NativeModules.MFModule) {
    MFEventEmitter = new NativeEventEmitter(NativeModules.MFModule);
  } else {
    console.warn('⚠️ MFModule not available, event emitter not created');
  }
} catch (error) {
  console.warn('⚠️ Failed to create MFEventEmitter:', error);
}

interface IMFSDK {
  init(apiKey: string, country: MFCountry, environment: MFEnvironment): void;
  setUpActionBar(
    toolBarTitle: String,
    toolBarTitleColor: ProcessedColorValue | null | undefined,
    toolBarBackgroundColor: ProcessedColorValue | null | undefined,
    isShowToolBar: Boolean
  ): void;
  sendPayment(request: MFSendPaymentRequest, lang: String): Promise<MFSendPaymentResponse>;
  initiatePayment(request: MFInitiatePaymentRequest, lang: String): Promise<MFInitiatePaymentResponse>;
  getPaymentStatus(request: MFGetPaymentStatusRequest, lang: String): Promise<MFGetPaymentStatusResponse>;
  executePayment(request: MFExecutePaymentRequest, lang: String, onInvoiceCreated: (invoiceId: string) => void): Promise<MFGetPaymentStatusResponse>;
  executePaymentWithSavedToken(
    request: MFPaymentWithTokenRequest,
    lang: String,
    onInvoiceCreated: (invoiceId: string) => void
  ): Promise<MFGetPaymentStatusResponse>;
  executeDirectPayment(
    directPaymentRequest: MFDirectPaymentRequest,
    lang: String,
    onInvoiceCreated: (invoiceId: string) => void
  ): Promise<MFDirectPaymentResponse>;
  cancelRecurringPayment(recurringId: String, lang: String): Promise<Boolean>;
  cancelToken(tokenId: String, lang: String): Promise<Boolean>;
  initiateSession(initiateSessionRequest: MFInitiateSessionRequest): Promise<MFInitiateSessionResponse>;
}

class MyFatoorahReactNative implements IMFSDK {
  async init(apiKey: string, country: MFCountry, environment: MFEnvironment) {
    await MFModule.init(apiKey, country, environment);
  }
  async setUpActionBar(
    toolBarTitle: String,
    toolBarTitleColor: ProcessedColorValue | null | undefined,
    toolBarBackgroundColor: ProcessedColorValue | null | undefined,
    isShowToolBar: Boolean
  ) {
    await MFModule.setUpActionBar(toolBarTitle, toolBarTitleColor, toolBarBackgroundColor, isShowToolBar);
  }
  async initiatePayment(initiatePaymentRequest: MFInitiatePaymentRequest, lang: MFLanguage): Promise<MFInitiatePaymentResponse> {
    var jsonResponse = await MFModule.InitiatePayment(initiatePaymentRequest, lang);
    return modelParser<MFInitiatePaymentResponse>(jsonResponse);
  }
  async sendPayment(sendPaymentRequest: MFSendPaymentRequest, lang: MFLanguage): Promise<MFSendPaymentResponse> {
    var jsonResponse = await MFModule.SendPayment(sendPaymentRequest, lang);
    return modelParser<MFSendPaymentResponse>(jsonResponse);
  }
  async getPaymentStatus(getPaymentStatusRequest: MFGetPaymentStatusRequest, lang: MFLanguage): Promise<MFGetPaymentStatusResponse> {
    var jsonResponse = await MFModule.GetPaymentStatus(getPaymentStatusRequest, lang);
    return modelParser<MFGetPaymentStatusResponse>(jsonResponse);
  }
  async executePayment(
    executePaymentRequest: MFExecutePaymentRequest,
    lang: MFLanguage,
    onInvoiceCreated: (invoiceId: string) => void
  ): Promise<MFGetPaymentStatusResponse> {
    this.AddOnInvoiceCreatedListener(onInvoiceCreated);
    var jsonResponse = await MFModule.ExecutePayment(executePaymentRequest, lang);
    return modelParser<MFGetPaymentStatusResponse>(jsonResponse);
  }
  async executePaymentWithSavedToken(
    executePaymentRequest: MFPaymentWithTokenRequest,
    lang: MFLanguage,
    onInvoiceCreated: (invoiceId: string) => void
  ): Promise<MFGetPaymentStatusResponse> {
    this.AddOnInvoiceCreatedListener(onInvoiceCreated);
    var jsonResponse = await MFModule.ExecutePaymentWithSavedToken(executePaymentRequest, lang);
    return modelParser<MFGetPaymentStatusResponse>(jsonResponse);
  }
  async executeDirectPayment(
    directPaymentRequest: MFDirectPaymentRequest,
    lang: String,
    onInvoiceCreated: (invoiceId: string) => void
  ): Promise<MFDirectPaymentResponse> {
    this.AddOnInvoiceCreatedListener(onInvoiceCreated);
    var jsonResponse = await MFModule.ExecuteDirectPayment(directPaymentRequest, lang);
    return modelParser<MFDirectPaymentResponse>(jsonResponse);
  }
  async cancelToken(tokenId: String, lang: String): Promise<Boolean> {
    var response = await MFModule.cancelToken(tokenId, lang);
    return response;
  }
  async cancelRecurringPayment(recurringId: String, lang: String): Promise<Boolean> {
    var response = await MFModule.cancelRecurringPayment(recurringId, lang);
    return response;
  }
  async initiateSession(initiateSessionRequest: MFInitiateSessionRequest): Promise<MFInitiateSessionResponse> {
    var jsonResponse = await MFModule.InitiateSession(initiateSessionRequest);
    return modelParser<MFInitiateSessionResponse>(jsonResponse);
  }
  private AddOnInvoiceCreatedListener(listener: (invoiceId: string) => void) {
    if (MFEventEmitter) {
      MFEventEmitter.removeAllListeners(MFConstants.InvoiceCreatedEventName);
      MFEventEmitter.addListener(MFConstants.InvoiceCreatedEventName, listener);
    }
  }
  async getApplePayToken(request: MFApplePayRequest): Promise<MFApplePayToken> {
    var jsonResponse = await MFModule.getApplePayToken(request);
    return modelParser<MFApplePayToken>(jsonResponse);
  }
  async applePayNativePayment(
    request: MFApplePayRequest,
    executePaymentRequest: MFExecutePaymentRequest,
    onInvoiceCreated: (invoiceId: string) => void
  ): Promise<MFGetPaymentStatusResponse> {
    this.AddOnInvoiceCreatedListener(onInvoiceCreated);
    var jsonResponse = await MFModule.applePayNativePayment(request, executePaymentRequest);
    return modelParser<MFGetPaymentStatusResponse>(jsonResponse);
  }
}

const MFSDK = new MyFatoorahReactNative();
//#endregion

//#region CardView

const CardView = requireNativeComponent<ICardViewProps>('MFCardView');

interface ICardViewProps {
  style: any;
  paymentStyle?: MFCardViewStyle;
}

interface IMFCardView {
  load(initiateSessionResponse: MFInitiateSessionResponse, onCardBinChanged: (bin: string) => void): Promise<String>;
  validate(currency?: string): Promise<string>;
  submit(currency?: string): Promise<MFSubmitCardViewResponse>;
  pay(
    request: MFExecutePaymentRequest,
    lang: MFLanguage,
    onInvoiceCreated: (invoiceId: string) => void,
    currency?: string
  ): Promise<MFGetPaymentStatusResponse>;
}

class MFCardPaymentView extends React.Component<ICardViewProps> implements IMFCardView {
  constructor(props: any) {
    super(props);
  }

  async validate(currency?: string): Promise<string> {
    if (currency === undefined) currency = '';

    var response = await MFModule.Validate(currency);
    return response;
  }
  async submit(currency?: string): Promise<MFSubmitCardViewResponse> {
    if (currency === undefined) currency = '';

    var response = await MFModule.Validate(currency);
    return response;
  }
  async load(initiateSessionResponse: MFInitiateSessionResponse, onCardBinChanged: (bin: string) => void): Promise<String> {
    setTimeout(() => {}, 100);
    this.AddOnCardBinChangedListener(onCardBinChanged);
    var jsonResponse = await MFModule.LoadCardView(initiateSessionResponse);
    return jsonResponse;
  }
  private AddOnCardBinChangedListener(listener: (bin: string) => void) {
    if (MFEventEmitter) {
      MFEventEmitter.removeAllListeners(MFConstants.CardBinChangedEventName);
      MFEventEmitter.addListener(MFConstants.CardBinChangedEventName, listener);
    }
  }
  async pay(
    executePaymentRequest: MFExecutePaymentRequest,
    lang: MFLanguage,
    onInvoiceCreated: (invoiceId: string) => void,
    currency?: string
  ): Promise<MFGetPaymentStatusResponse> {
    if (currency === undefined) currency = '';

    this.AddOnInvoiceCreatedListener(onInvoiceCreated);
    var jsonResponse = await MFModule.Pay(executePaymentRequest, lang, currency);
    return modelParser<MFGetPaymentStatusResponse>(jsonResponse);
  }

  private AddOnInvoiceCreatedListener(listener: (invoiceId: string) => void) {
    if (MFEventEmitter) {
      MFEventEmitter.removeAllListeners(MFConstants.InvoiceCreatedEventName);
      MFEventEmitter.addListener(MFConstants.InvoiceCreatedEventName, listener);
    }
  }

  render() {
    return <CardView {...this.props} />;
  }
}

//#endregion

//#region GooglePay

/**
 * @deprecated Use MFGPayButton instead. This interface will be removed in a future version.
 */
interface IMFGooglePayButton {
  /**
   * @deprecated Use MFGPayButton.setupWithAutoExecute instead.
   */
  setupGooglePayHelper(
    sessionId: String,
    googlePayRequest: MFGooglePayRequest,
    onInvoiceCreated: (invoiceId: string) => void
  ): Promise<MFGetPaymentStatusResponse>;

  /**
   * @deprecated Use MFGPayButton.setupTokenOnly instead.
   */
  setupGooglePayTokenHelper(googlePayRequest: MFGooglePayRequest): Promise<string>;

  /**
   * @deprecated Use MFGPayButton.setupWithAutoExecute instead.
   */
  setupWithAutoExecute(
    sessionId: string,
    googlePayRequest: MFGooglePayRequest,
    onInvoiceCreated?: (invoiceId: string) => void,
    onExecutePaymentSuccess?: (response: MFGetPaymentStatusResponse) => void,
    onError?: (error: MFError) => void
  ): Promise<MFGetPaymentStatusResponse>;

  /**
   * @deprecated Use MFGPayButton.setupWithManualExecute instead.
   */
  setupWithManualExecute(
    sessionId: string,
    googlePayRequest: MFGooglePayRequest,
    onSessionUpdated?: (updatedSessionId: string) => void,
    onError?: (error: MFError) => void
  ): Promise<string>;

  /**
   * @deprecated Use MFGPayButton.executePayment instead.
   */
  executePayment(
    executePaymentRequest: MFExecutePaymentRequest,
    lang: MFLanguage,
    onInvoiceCreated: (invoiceId: string) => void
  ): Promise<MFGetPaymentStatusResponse>;
}

/**
 * MFGooglePayButton - Old Google Pay implementation wrapper.
 *
 * @deprecated Use MFGPayButton instead. This old implementation will be removed in a future version.
 */
class MFGooglePayButton extends React.Component<IGooglePayButtonProps> implements IMFGooglePayButton {

  /**
   * @deprecated Use MFGPayButton instead.
   */
  constructor(props: any) { super(props); }

  mfGPayButton: MFGPayButton | null = null;

  /**
   * @deprecated Use MFGPayButton.setupWithAutoExecute instead.
   */
  async setupGooglePayHelper(
    sessionId: String,
    googlePayRequest: MFGooglePayRequest,
    onInvoiceCreated: (invoiceId: string) => void
  ): Promise<MFGetPaymentStatusResponse> {
    if (!this.mfGPayButton) {
      throw new Error('MFGPayButton ref is not set');
    }
    return new Promise<MFGetPaymentStatusResponse>(async (resolve, reject) => {
      try {
        await this.mfGPayButton!.setupWithAutoExecute(
          sessionId.toString(),
          googlePayRequest,
          onInvoiceCreated,
          (response) => {
            resolve(response);
          },
          (error) => {
            reject(error);
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * @deprecated Use MFGPayButton.setupTokenOnly instead.
   */
  async setupGooglePayTokenHelper(googlePayRequest: MFGooglePayRequest): Promise<string> {
    if (!this.mfGPayButton) {
      throw new Error('MFGPayButton ref is not set');
    }
    return new Promise<string>(async (resolve, reject) => {
      try {
        await this.mfGPayButton!.setupTokenOnly(
          googlePayRequest,
          (receivedToken) => {
            resolve(receivedToken!);
          },
          (error) => {
            reject(error);
          });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * @deprecated Use MFGPayButton.setupWithAutoExecute instead.
   */
  async setupWithAutoExecute(
    sessionId: String,
    googlePayRequest: MFGooglePayRequest,
    onInvoiceCreated?: (invoiceId: string) => void,
    onExecutePaymentSuccess?: (response: MFGetPaymentStatusResponse) => void,
    onError?: (error: MFError) => void
  ): Promise<MFGetPaymentStatusResponse> {
    if (!this.mfGPayButton) {
      throw new Error('MFGPayButton ref is not set');
    }
    return new Promise<MFGetPaymentStatusResponse>(async (resolve, reject) => {
      try {
        await this.mfGPayButton!.setupWithAutoExecute(
          sessionId.toString(),
          googlePayRequest,
          onInvoiceCreated,
          (response) => {
            onExecutePaymentSuccess && onExecutePaymentSuccess(response);
            resolve(response);
          },
          (error) => {
            onError && onError(error);
            reject(error);
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * @deprecated Use MFGPayButton.setupWithManualExecute instead.
   */
  async setupWithManualExecute(
    sessionId: String,
    googlePayRequest: MFGooglePayRequest,
    onSessionUpdated?: (updatedSessionId: string) => void,
    onError?: (error: MFError) => void
  ): Promise<string> {
    if (!this.mfGPayButton) {
      throw new Error('MFGPayButton ref is not set');
    }
    return new Promise<string>(async (resolve, reject) => {
      try {
        await this.mfGPayButton!.setupWithManualExecute(
          sessionId.toString(),
          googlePayRequest,
          (updatedSessionId) => {
            onSessionUpdated && onSessionUpdated(updatedSessionId);
            resolve(updatedSessionId);
          },
          (error) => {
            onError && onError(error);
            reject(error);
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * @deprecated Use MFGPayButton.executePayment instead.
   */
  async executePayment(
    executePaymentRequest: MFExecutePaymentRequest,
    lang: MFLanguage,
    onInvoiceCreated: (invoiceId: string) => void
  ): Promise<MFGetPaymentStatusResponse> {
    if (!this.mfGPayButton) {
      throw new Error('MFGPayButton ref is not set');
    }
    return this.mfGPayButton.executePayment(executePaymentRequest, lang, onInvoiceCreated);
  }

  /**
   * @deprecated Use MFGPayButton directly instead.
   */
  render() {
    return <MFGPayButton ref={(ref) => { (this.mfGPayButton = ref) }} {...this.props} />;
  }
}

/**
 * @deprecated Use MFGPayButton.setupTokenOnly and MFGPayButton.openSheet instead.
 */
interface IMFGooglePayHelperModule {
  /**
   * @deprecated Use MFGPayButton.setupTokenOnly instead.
   */
  configForToken(googlePayRequest: MFGooglePayRequest): Promise<string>;

  /**
   * @deprecated Use MFGPayButton.openSheet instead.
   */
  openSheet(): Promise<string>;
}

/**
 * @deprecated Use MFGPayButton instead. This helper will be removed in a future version.
 */
class MFGooglePayHelperModule implements IMFGooglePayHelperModule {
  /**
   * @deprecated Use MFGPayButton.setupTokenOnly instead.
   */
  async configForToken(googlePayRequest: MFGooglePayRequest): Promise<string> {
    const jsonResponse = await MFModule.GooglePayTokenConfig(googlePayRequest);
    return modelParser<string>(jsonResponse);
  }

  /**
   * @deprecated Use MFGPayButton.openSheet instead.
   */
  async openSheet(): Promise<string> {
    const jsonResponse = await MFModule.GooglePayOpenSheet();
    return modelParser<string>(jsonResponse);
  }
}

/**
 * @deprecated Use MFGPayButton instead.
 */
const MFGooglePayHelper = new MFGooglePayHelperModule();

//#endregion

//#region ApplePay

const ApplePay = requireNativeComponent<IApplePayProps>('MFApplePay');

interface IApplePayProps {
  style: any;
  applePayButtonStyle?: MFApplePayStyle;
}

interface IMFApplePayButton {
  applePayPayment(request: MFExecutePaymentRequest, lang: MFLanguage, onInvoiceCreated: (invoiceId: string) => void): Promise<MFGetPaymentStatusResponse>;
  applePayDisplay(request: MFExecutePaymentRequest, lang: MFLanguage): Promise<string>;
  displayApplePayButton(session: MFInitiateSessionResponse, executePaymentRequest: MFExecutePaymentRequest, lang: MFLanguage): Promise<MFCallbackResponse>;
  applePayExecutePayment(request: MFExecutePaymentRequest | undefined): Promise<MFGetPaymentStatusResponse>;
}

class MFApplePayButtonView extends React.Component<IApplePayProps> implements IMFApplePayButton {
  constructor(props: any) {
    super(props);
    if (Platform.OS === 'android') {
      throw new Error(PLATFORM_ERROR);
    }
  }

  async applePayPayment(
    executePaymentRequest: MFExecutePaymentRequest,
    lang: MFLanguage,
    onInvoiceCreated: (invoiceId: string) => void
  ): Promise<MFGetPaymentStatusResponse> {
    this.AddOnInvoiceCreatedListener(onInvoiceCreated);
    var jsonResponse = await MFModule.ApplePayPayment(executePaymentRequest, lang);
    return modelParser<MFGetPaymentStatusResponse>(jsonResponse);
  }

  async applePayDisplay(executePaymentRequest: MFExecutePaymentRequest, lang: MFLanguage): Promise<string> {
    console.warn('The applePayDisplay is deprecated and will be removed in the future. Please use the displayApplePayButton instead.');
    var response = await MFModule.ApplePayDisplay(executePaymentRequest, lang);
    return response;
  }

  async displayApplePayButton(
    session: MFInitiateSessionResponse,
    executePaymentRequest: MFExecutePaymentRequest,
    lang: MFLanguage
  ): Promise<MFCallbackResponse> {
    var response = await MFModule.DisplayApplePayButton(session, executePaymentRequest, lang);
    return modelParser<MFCallbackResponse>(response);
  }

  async applePayExecutePayment(executePaymentRequest?: MFExecutePaymentRequest | undefined): Promise<MFGetPaymentStatusResponse> {
    var jsonResponse = await MFModule.ApplePayExecutePayment(executePaymentRequest);
    return modelParser<MFGetPaymentStatusResponse>(jsonResponse);
  }

  private AddOnInvoiceCreatedListener(listener: (invoiceId: string) => void) {
    if (MFEventEmitter) {
      MFEventEmitter.removeAllListeners(MFConstants.InvoiceCreatedEventName);
      MFEventEmitter.addListener(MFConstants.InvoiceCreatedEventName, listener);
    }
  }

  render() {
    return <ApplePay {...this.props} />;
  }
}

//#endregion

//#region ApplePay V3
interface IMFApplePay {
  loadApplePay(
    session: MFInitiateSessionResponse,
    request: MFExecutePaymentRequest,
    lang: MFLanguage,
    merchantName: String | undefined,
    onApplePayLoaded?: (loaded: Boolean) => void
  ): Promise<Boolean>;
  openApplePaymentSheet(): Promise<MFCallbackResponse>;
  completeApplePayment(request: MFExecutePaymentRequest | undefined, onInvoiceCreated: (invoiceId: string) => void): Promise<MFGetPaymentStatusResponse>;
}

class MFApplePayClass implements IMFApplePay {
  async loadApplePay(
    session: MFInitiateSessionResponse,
    request: MFExecutePaymentRequest,
    lang: MFLanguage,
    merchantName: String | undefined = undefined,
    onApplePayLoaded?: (loaded: Boolean) => void
  ): Promise<Boolean> {
    if (onApplePayLoaded instanceof Function) {
      this.AddOnApplePayLoadedListener(onApplePayLoaded);
    }
    var jsonResponse = await MFModule.LoadApplePay(session, request, lang, merchantName);
    return modelParser<Boolean>(jsonResponse);
  }

  async openApplePaymentSheet(): Promise<MFCallbackResponse> {
    var jsonResponse = await MFModule.OpenApplePaymentSheet();
    return modelParser<MFCallbackResponse>(jsonResponse);
  }

  async completeApplePayment(
    executePaymentRequest: MFExecutePaymentRequest | undefined = undefined,
    onInvoiceCreated?: (invoiceId: string) => void
  ): Promise<MFGetPaymentStatusResponse> {
    if (onInvoiceCreated instanceof Function) {
      this.AddOnInvoiceCreatedListener(onInvoiceCreated);
    }
    var jsonResponse = await MFModule.CompleteApplePayment(executePaymentRequest);
    return modelParser<MFGetPaymentStatusResponse>(jsonResponse);
  }

  private AddOnInvoiceCreatedListener(listener: (invoiceId: string) => void) {
    if (MFEventEmitter) {
      MFEventEmitter.removeAllListeners(MFConstants.InvoiceCreatedEventName);
      MFEventEmitter.addListener(MFConstants.InvoiceCreatedEventName, listener);
    }
  }

  private AddOnApplePayLoadedListener(listener: (loaded: Boolean) => void) {
    let onApplePayLoadedListener = 'applePayLoaded';
    if (MFEventEmitter) {
      MFEventEmitter.removeAllListeners(onApplePayLoadedListener);
      MFEventEmitter.addListener(onApplePayLoadedListener, listener);
    }
  }
}

const MFApplePay = new MFApplePayClass();
//#endregion

const MFConstants = {
  InvoiceCreatedEventName: 'onInvoiceCreated',
  CardBinChangedEventName: 'onCardBinChanged',
};

export {
  //#region Classes
  MFSDK,
  MFCardPaymentView,
  MFGooglePayButton,
  MFApplePayButtonView,
  MFApplePay,
  //#endregion

  //#region InitiatePayment
  MFInitiatePaymentRequest,
  MFInitiatePaymentResponse,
  MFPaymentMethod,
  MFTokenType,
  //#endregion

  //#region SendPayment
  MFSendPaymentRequest,
  MFCustomerAddress,
  MFInvoiceItem,
  MFSupplier,
  MFSendPaymentResponse,
  //#endregion

  //#region ExecutePayment
  MFExecutePaymentRequest,
  MFExecutePaymentResponse,
  MFRecurringModel,
  MFProcessingDetails,
  MFPaymentWithTokenRequest,
  //#endregion

  //#region GetPaymentStatus
  MFGetPaymentStatusRequest,
  MFGetPaymentStatusResponse,
  MFInvoiceTransaction,
  MFSupplierItem,
  //#endregion

  //#region InitiateSession
  MFInitiateSessionRequest,
  MFInitiateSessionResponse,
  //#endregion

  //#region DirectPayment
  MFDirectPaymentRequest,
  MFCardRequest,
  MFDirectPaymentResponse,
  DirectPaymentResponse,
  CardInfo,
  //#endregion

  //#region Error
  MFError,
  //#endregion

  //#region Enums
  MFEnvironment,
  MFLanguage,
  MFCurrencyISO,
  MFCountry,
  MFMobileCountryCodeISO,
  MFNotificationOption,
  MFKeyType,
  MFFontWeight,
  MFFontFamily,
  MFRecurringType,
  //#endregion

  //#region PaymentCardViewConfig
  MFSubmitCardViewResponse,
  MFCardViewStyle,
  MFCardViewInput,
  MFCardViewPlaceHolder,
  MFCardViewLabel,
  MFCardViewText,
  MFCardViewError,
  MFBoxShadow,
  MFSavedCardText,
  MFDeleteAlert,
  MFApplePayStyle,
  //#endregion

  //#region Apple Pay Native
  MFApplePayToken,
  MFApplePayRequest,
  //#endregion

  //#region GooglePay
  MFGooglePayRequest,
  GooglePayButtonConstants,
  MFGooglePayHelper,
  MFGooglePayButtonStyle,
  // New (Recommended):
  MFGPayButton,
  //#endregion
};