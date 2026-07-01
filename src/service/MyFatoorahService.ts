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
import { Platform, NativeModules } from 'react-native';

// Check if the native module is available
const isMyFatoorahAvailable = () => {
  try {
    // Check if MFSDK is properly initialized
    return MFSDK && typeof MFSDK.init === 'function';
  } catch (error) {
    console.warn('MyFatoorah SDK not available:', error);
    return false;
  }
};

const API_KEY = 'SK_KWT_NY2ViaWQhjQSWMXCzqZAzqXHHXYYIF0Uk73JtGAztkiecUZuy39uMd1ShSvbjBOx';
const COUNTRY = MFCountry.SAUDIARABIA;
const ENVIRONMENT = MFEnvironment.TEST;

let isSDKInitialized = false;

export const initializeMyFatoorah = async (): Promise<boolean> => {
  try {
    if (!API_KEY) {
      console.warn('⚠️ MYFATOORAH_API_KEY environment variable is not set');
      return false;
    }
console.log('444444444')
// Check if SDK is already initialized
if (isSDKInitialized) {
      console.log('475964748')
      return true;
    }

    // Check if the native module is available
    if (!isMyFatoorahAvailable()) {
      console.warn('⚠️ MyFatoorah native module is not available');
      return false;
    }

    // Initialize the SDK
    await MFSDK.init(API_KEY, COUNTRY, ENVIRONMENT);
    isSDKInitialized = true;
    return true;
  } catch (error) {
    console.error('MyFatoorah SDK initialization failed:', error);
    // Don't throw - just return false
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
      console.error('Error in getPaymentMethods:', error);
      return {
        success: false,
        error: error.message || 'Failed to get payment methods',
      };
    }
  },

  async executePayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    try {
      const initialized = await this.initialize();
      if (!initialized) {
        return {
          success: false,
          error: 'MyFatoorah service is not available',
        };
      }

      const { amount, customer, metadata } = paymentRequest;
      const sessionRequest = new MFInitiateSessionRequest(customer.email || 'test@test.com');
      sessionRequest.SaveToken = false;
      sessionRequest.IsRecurring = false;

      const sessionResponse = await MFSDK.initiateSession(sessionRequest, MFLanguage.ENGLISH);

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
          console.log('INVOICE CREATED:', invoiceId);
        }
      );

      return {
        success: true,
        invoiceId: String(response.InvoiceId),
        status: response.InvoiceStatus,
        allRes: response,
      };
    } catch (error: any) {
      console.error('Payment execution error:', error);
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
      console.error('Get payment status error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  async healthCheck(): Promise<boolean> {
    try {
      const initialized = await this.initialize();
      if (!initialized) {
        return false;
      }
      const result = await this.getPaymentMethods(1);
      return result.success;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  },
};