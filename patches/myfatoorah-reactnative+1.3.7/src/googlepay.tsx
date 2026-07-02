import React from 'react';
import { NativeEventEmitter, NativeModules, requireNativeComponent, StyleSheet } from 'react-native';
import { MFLanguage } from './MFEnums';
import { MFGetPaymentStatusResponse, MFExecutePaymentRequest, MFGooglePayRequest, MFError } from './MFModels';
import { modelParser } from './MFUtils';

//#region GooglePay V2 (MFGPayModule - Recommended)
const MFGPayConstants = {
    MFGPayModuleNAME: 'MFGPayModule',
    MFGooglePayButtonModuleNAME: 'MFGooglePayButton',
    GPayReceivedTokenEventName: 'onGPayReceivedToken',
    GPaySessionUpdatedEventName: 'onGPaySessionUpdated',
    GPayExecutePaymentSuccessEventName: 'onGPayExecutePaymentSuccess',
    GPayInvoiceCreatedEventName: 'onGPayInvoiceCreated',
    GPayErrorEventName: 'onGPayError',
};

interface IGooglePayButtonProps {
    style?: any;
    type?: number;
    theme?: number;
    radius?: number;
}

const styles = StyleSheet.create({
    googlePay: {
        width: '90%',
        height: 70,
        margin: 10,
    },
});

const { MFGPayModule: MFGPayNative } = NativeModules;

// SAFE: Only create event emitter if module exists
let MFEventEmitter = null;
try {
    if (NativeModules.MFGPayModule) {
        MFEventEmitter = new NativeEventEmitter(NativeModules.MFGPayModule);
    } else {
        console.warn('⚠️ MFGPayModule not available, event emitter not created');
    }
} catch (error) {
    console.warn('⚠️ Failed to create GooglePay event emitter:', error);
}

const GooglePayButton = requireNativeComponent<IGooglePayButtonProps>('MFGooglePayButton');

const { GooglePayButtonConstants } = NativeModules;

type Listener<T> = ((value: T) => void) | undefined;

interface IMFGPayButton {
    setupWithAutoExecute(sessionId: string, googlePayRequest: MFGooglePayRequest): Promise<{ isReady: boolean }>;

    setupWithManualExecute(sessionId: string, googlePayRequest: MFGooglePayRequest): Promise<{ isReady: boolean }>;

    setupTokenOnly(googlePayRequest: MFGooglePayRequest): Promise<{ isReady: boolean }>;

    isGooglePayAvailable(): Promise<boolean>;

    updateRequestAmount(amount: string): Promise<{ isUpdated: boolean }>;

    openSheet(): Promise<{ isInvoked: boolean }>;

    executePayment(executePaymentRequest: MFExecutePaymentRequest, lang: MFLanguage): Promise<MFGetPaymentStatusResponse>;
}

class MFGPayButton extends React.Component<IGooglePayButtonProps> implements IMFGPayButton {
    constructor(props: any) { super(props); }

    async setupWithAutoExecute(
        sessionId: string,
        googlePayRequest: MFGooglePayRequest,
        onInvoiceCreated?: (invoiceId: string) => void,
        onExecutePaymentSuccess?: (response: MFGetPaymentStatusResponse) => void,
        onError?: (error: MFError) => void
    ): Promise<{ isReady: boolean }> {
        this.registerListener<string>(MFGPayConstants.GPayInvoiceCreatedEventName, onInvoiceCreated);
        this.registerListener<MFGetPaymentStatusResponse>(MFGPayConstants.GPayExecutePaymentSuccessEventName, onExecutePaymentSuccess);
        this.registerListener<MFError>(MFGPayConstants.GPayErrorEventName, onError);

        const jsonResponse = await MFGPayNative.setupWithAutoExecute(sessionId, googlePayRequest);
        return modelParser<{ isReady: boolean }>(jsonResponse);
    }

    async setupWithManualExecute(
        sessionId: string,
        googlePayRequest: MFGooglePayRequest,
        onSessionUpdated?: (updatedSessionId: string) => void,
        onError?: (error: MFError) => void
    ): Promise<{ isReady: boolean }> {
        this.registerListener<string>(MFGPayConstants.GPaySessionUpdatedEventName, onSessionUpdated);
        this.registerListener<MFError>(MFGPayConstants.GPayErrorEventName, onError);

        const jsonResponse = await MFGPayNative.setupWithManualExecute(sessionId, googlePayRequest);
        return modelParser<{ isReady: boolean }>(jsonResponse);
    }

    async setupTokenOnly(
        googlePayRequest: MFGooglePayRequest,
        onReceivedToken?: (token: string) => void,
        onError?: (error: MFError) => void
    ): Promise<{ isReady: boolean }> {
        this.registerListener<string>(MFGPayConstants.GPayReceivedTokenEventName, onReceivedToken);
        this.registerListener(MFGPayConstants.GPayErrorEventName, onError);

        const jsonResponse = await MFGPayNative.setupTokenOnly(googlePayRequest);
        return modelParser<{ isReady: boolean }>(jsonResponse);
    }

    async isGooglePayAvailable(): Promise<boolean> {
        return await MFGPayNative.isGooglePayAvailable();
    }

    async updateRequestAmount(amount: string): Promise<{ isUpdated: boolean }> {
        const jsonResponse = await MFGPayNative.updateRequestAmount(amount);
        return modelParser<{ isUpdated: boolean }>(jsonResponse);
    }

    async openSheet(): Promise<{ isInvoked: boolean }> {
        const jsonResponse = await MFGPayNative.openSheet();
        return modelParser<{ isInvoked: boolean }>(jsonResponse);
    }

    async executePayment(
        executePaymentRequest: MFExecutePaymentRequest,
        lang: MFLanguage,
        onInvoiceCreated?: (invoiceId: string) => void
    ): Promise<MFGetPaymentStatusResponse> {
        this.registerListener<string>(MFGPayConstants.GPayInvoiceCreatedEventName, onInvoiceCreated);

        const jsonResponse = await MFGPayNative.executePayment(executePaymentRequest, lang);
        return modelParser<MFGetPaymentStatusResponse>(jsonResponse);
    }

    private registerListener<T>(eventName: string, listener?: Listener<T>) {
        if (MFEventEmitter) {
            MFEventEmitter.removeAllListeners(eventName);

            if (typeof listener === 'function') {
                MFEventEmitter.addListener(eventName, (data: T | string) => {
                    let parsedData: T;

                    try {
                        if (
                            eventName === MFGPayConstants.GPayReceivedTokenEventName ||
                            eventName === MFGPayConstants.GPayInvoiceCreatedEventName
                        ) {
                            parsedData = data as T; // keep token as-is
                        } else {
                            parsedData = typeof data === 'string' ? modelParser<T>(data) : data;
                        }
                    } catch {
                        parsedData = data as T;
                    }

                    listener(parsedData);
                });
            }
        } else {
            console.warn(`⚠️ Event emitter not available for event: ${eventName}`);
        }
    }

    render() {
        return <GooglePayButton {...this.props} style={this.props.style ?? styles.googlePay} />;
    }
}

export { MFGPayButton, GooglePayButtonConstants, IGooglePayButtonProps };
//#endregion