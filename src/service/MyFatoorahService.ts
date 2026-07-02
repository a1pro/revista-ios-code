import { NativeModules, Platform } from 'react-native';
import {
  MFCurrencyISO,
  MFExecutePaymentRequest,
  MFGetPaymentStatusRequest,
  MFInitiatePaymentRequest,
  MFKeyType,
  MFLanguage,
  MFCountry,
  MFEnvironment,
  MFSDK,
  MFInitiateSessionRequest,
} from 'myfatoorah-reactnative';
import { PaymentRequest, PaymentResponse } from './paymentTypes';

const API_KEY = 'SK_KWT_NY2ViaWQhjQSWMXCzqZAzqXHHXYYIF0Uk73JtGAztkiecUZuy39uMd1ShSvbjBOx';
const COUNTRY = MFCountry.SAUDIARABIA;
const ENVIRONMENT = MFEnvironment.TEST;

let isSDKInitialized = false;

// Check if native module is available
const isNativeModuleAvailable = (): boolean => {
  if (Platform.OS === 'ios') {
    const hasModule = !!NativeModules.MFModule;
    console.log(`🔍 iOS Native Module MFModule available: ${hasModule}`);

    if (!hasModule) {
      console.warn('⚠️ MFModule not found. Check if pod is installed correctly.');
      console.log('Available native modules:', Object.keys(NativeModules).filter(key =>
        key.includes('MF') || key.includes('myfatoorah')
      ));
    }
    return hasModule;
  }
  return true;
};

export const initializeMyFatoorah = async (): Promise<boolean> => {
  try {
    console.log('🔄 Initializing MyFatoorah SDK...');

    if (!API_KEY) {
      console.error('❌ API_KEY is not set');
      return false;
    }

    if (isSDKInitialized) {
      console.log('✅ SDK already initialized');
      return true;
    }

    // Check native module for iOS
    if (Platform.OS === 'ios' && !isNativeModuleAvailable()) {
      console.error('❌ Native module not available on iOS');
      return false;
    }

    // Wait a bit for iOS native modules to load
    if (Platform.OS === 'ios') {
      console.log('⏳ Waiting for iOS native modules...');
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    await MFSDK.init(API_KEY, COUNTRY, ENVIRONMENT);
    isSDKInitialized = true;
    console.log('✅ MyFatoorah SDK initialized successfully');
    return true;
  } catch (error: any) {
    console.error('❌ MyFatoorah SDK initialization failed:', error);
    return false;
  }
};

export const MyFatoorahService = {
  initialize: initializeMyFatoorah,

  async getPaymentMethods(amount: number, currency: string = 'SAR'): Promise<{
    success: boolean;
    methods?: any[];
    error?: string;
  }> {
    try {
      console.log('🔄 Getting payment methods...');

      const initialized = await this.initialize();
      if (!initialized) {
        return {
          success: false,
          error: 'MyFatoorah service is not available',
        };
      }

      if (amount <= 0) {
        return {
          success: false,
          error: 'Amount must be greater than 0',
        };
      }

      const request = new MFInitiatePaymentRequest(amount, currency as MFCurrencyISO);
      const response = await MFSDK.initiatePayment(request, MFLanguage.ENGLISH);

      if (response?.PaymentMethods) {
        return {
          success: true,
          methods: response.PaymentMethods,
        };
      }

      return {
        success: false,
        error: 'No payment methods available',
      };
    } catch (error: any) {
      console.error('❌ Error in getPaymentMethods:', error);
      return {
        success: false,
        error: error.message || 'Failed to get payment methods',
      };
    }
  },

  async executePayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    try {
      console.log('🔄 Executing payment...');

      const initialized = await this.initialize();
      if (!initialized) {
        return {
          success: false,
          error: 'MyFatoorah service is not available',
        };
      }

      const { amount, customer, metadata } = paymentRequest;

      // Create session
      const sessionRequest = new MFInitiateSessionRequest(customer.email || 'test@test.com');
      sessionRequest.SaveToken = false;
      sessionRequest.IsRecurring = false;

      const sessionResponse = await MFSDK.initiateSession(sessionRequest, MFLanguage.ENGLISH);

      // Execute payment
      const executeRequest = new MFExecutePaymentRequest(amount);
      executeRequest.SessionId = sessionResponse.SessionId;
      executeRequest.PaymentMethodId = metadata?.paymentMethodId;
      executeRequest.CustomerEmail = customer.email;
      executeRequest.CustomerMobile = customer.mobile;
      executeRequest.DisplayCurrencyIso = MFCurrencyISO.SAUDIARABIA_SAR;
      executeRequest.CustomerName = customer.name || 'Customer';
      executeRequest.CustomerReference = `ORDER_${Date.now()}`;

      const response = await MFSDK.executePayment(
        executeRequest,
        MFLanguage.ENGLISH,
        (invoiceId: string) => {
          console.log('📨 INVOICE CREATED:', invoiceId);
        }
      );

      return {
        success: true,
        invoiceId: String(response.InvoiceId),
        status: response.InvoiceStatus,
        allRes: response,
      };
    } catch (error: any) {
      console.error('❌ Payment execution error:', error);
      return {
        success: false,
        error: error.message || 'Payment failed',
      };
    }
  },

  async getPaymentStatus(invoiceId: string): Promise<{
    success: boolean;
    status?: string;
    error?: string;
  }> {
    try {
      const initialized = await this.initialize();
      if (!initialized) {
        return {
          success: false,
          error: 'MyFatoorah service is not available',
        };
      }

      const request = new MFGetPaymentStatusRequest(invoiceId, MFKeyType.INVOICEID);
      const response = await MFSDK.getPaymentStatus(request, MFLanguage.ENGLISH);

      if (response?.InvoiceStatus === 'Paid') {
        return {
          success: true,
          status: response.InvoiceStatus,
        };
      }

      return {
        success: false,
        error: 'Payment failed',
      };
    } catch (error: any) {
      console.error('❌ Get payment status error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  async healthCheck(): Promise<boolean> {
    try {
      const initialized = await this.initialize();
      if (!initialized) return false;
      const result = await this.getPaymentMethods(1);
      return result.success;
    } catch (error) {
      console.error('❌ Health check failed:', error);
      return false;
    }
  },
};