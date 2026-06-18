/* eslint-disable react-hooks/rules-of-hooks */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { MyFatoorahService } from '../../service/MyFatoorahService';
import { CustomerDetails, PaymentRequest, PaymentItem, PaymentPurpose } from '../../service/paymentTypes';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { Base_Url } from '../../utils/ApiUrl';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { t } from 'i18next';
import PaymentScreenstyle from './paymentscreenstyle';
import Loader from '../../components/Loader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type PaymentScreenProps = {
  plan: any;
  amount: number;
  purpose: PaymentPurpose;
  customer?: CustomerDetails;
  items?: PaymentItem[];
  orderId?: string;
  subscriptionId?: string;
  planId?: string;
  planName?: string;
  planDuration?: string;
  metadata?: {
    cartItems?: any[];
    totalTax?: number;
    totalShipping?: number;
    couponDiscount?: number;
    isSubscription?: boolean;
    address?: {
      id: number;
      address?: string;
      city?: string;
      state?: string;
      country?: string;
      zip?: string;
    };
    latitude?: string;
    longitude?: string;
    subscriptionPlanData?: {
      planId: string;
      planName: string;
      duration: string;
      features?: string[];
    };
    [key: string]: any;
  };
  onSuccess?: (data: any) => void;
  onFailure?: (error: string) => void;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Payment'>;

interface PaymentMethod {
  PaymentMethodId: number;
  PaymentMethodEn: string;
  name?: string;
  ImageUrl?: string;
  [key: string]: any;
}

interface PaymentResult {
  success: boolean;
  invoiceId?: string;
  invoiceReference?: string;
  transactionId?: string;
  InvoiceStatus?: string;
  error?: string;
  [key: string]: any;
}

const PaymentScreen: React.FC<Props> = ({ route, navigation }) => {
  const insets = useSafeAreaInsets()
  const params = route.params as PaymentScreenProps;
  const {
    amount = params?.plan?.amount,
    purpose = 'subscription' as PaymentPurpose,
    customer: initialCustomer,
    items = [],
    orderId,
    subscriptionId,
    planId,
    planName,
    planDuration,
    metadata = {},
    onSuccess,
    onFailure,
  } = params;

  if (!amount) {
    return (
      <View style={PaymentScreenstyle.errorContainer}>
        <Text style={PaymentScreenstyle.errorText}>{t('Invalidpaymentamount')}.</Text>
        <TouchableOpacity
          style={PaymentScreenstyle.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={PaymentScreenstyle.backButtonText}>{t('GoBack')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const [loading, setLoading] = useState<boolean>(true);
  const [processing, setProcessing] = useState<boolean>(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  const [customer] = useState<CustomerDetails>(
    initialCustomer || {
      name: '',
      email: '',
      mobile: '',
      phone: '',
      address: '',
      ...(initialCustomer || {}),
    }
  );

  const isSubscriptionPayment = metadata?.isSubscription || purpose === 'subscription';

  useEffect(() => {
    initializePayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializePayment = async (): Promise<void> => {
    try {
      setLoading(true);

      const initialized = await MyFatoorahService.initialize();
      if (!initialized) {
        throw new Error('Failed to initialize payment service');
      }

      const result: PaymentResult = await MyFatoorahService.getPaymentMethods(amount);

      if (result.success && result.methods) {
        const methods: PaymentMethod[] = Array.isArray(result.methods) ? result.methods : [];
        setPaymentMethods(methods);
        if (methods.length > 0) {
          setSelectedMethod(methods[0]);
        }
      } else {
        Toast.show({
          type: 'error',
          text1: t('PaymentMethods'),
          text2: result.error || t('Nopaymentmethodsavailable'),
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: t('InitializationError'),
        text2: error.message,
      });
      if (onFailure) { onFailure(error.message); }
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (): Promise<void> => {
    if (!selectedMethod) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: t('SelectPaymentMethod'),
      });
      return;
    }

    try {
      setProcessing(true);

      const paymentMetadata = {
        ...metadata,
        paymentMethodId: selectedMethod.PaymentMethodId,
        purpose,
      };

      if (isSubscriptionPayment) {
        paymentMetadata.isSubscription = true;
        paymentMetadata.subscriptionPlanData = {
          planId: planId || '',
          planName: planName || '',
          duration: planDuration || '',
          features: metadata?.subscriptionPlanData?.features || [],
        };
      }

      const paymentRequest: PaymentRequest = {
        amount,
        customer,
        items,
        subscriptionId,
        metadata: paymentMetadata,
      };

      const result: PaymentResult | any = await MyFatoorahService.executePayment(paymentRequest);

      if (result?.InvoiceStatus === 'Paid') {

        await processSuccessfulPayment(result);
        return;
      }

      if (result?.invoiceId) {
        const data = await MyFatoorahService.getPaymentStatus(result.invoiceId);

        if (data.success && data.status === 'Paid') {
          await processSuccessfulPayment(result, data);
        } else {
          handlePaymentFailure(String(data?.error) || t('Payment not completed'));
        }
      } else {
        handlePaymentFailure(String(result?.error) || t('Paymentinitializationfailed'));
      }
    } catch (error: any) {
      const errorMsg = error.message || t('Unknown payment error');
      Toast.show({
        type: 'error',
        text1: t('Payment Error'),
        text2: errorMsg,
      });
      if (onFailure) { onFailure(errorMsg); }
    } finally {
      setProcessing(false);
    }
  };

  const processSuccessfulPayment = async (paymentResult: any, statusData?: any) => {
    try {

      const paymentData = {
        invoiceId: String(paymentResult.invoiceId || paymentResult.InvoiceId || ''),
        invoiceReference: String(paymentResult?.allRes?.InvoiceReference),
        transactionId: String(
          paymentResult.allRes.InvoiceTransactions[0]?.TransactionId
        ),
        InvoiceTransactions: paymentResult?.allRes?.InvoiceTransactions.map((id: any) => id),
        InvoiceStatus: paymentResult.InvoiceStatus || statusData?.status || 'Paid',
        paymentDate: new Date().toISOString(),
      };

      const token = await AsyncStorage.getItem('token');
      if (isSubscriptionPayment) {
        await handleSubscriptionPayment(paymentData, token);
      } else {
        await handleOrderPayment(paymentData, token);
      }

    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  };

  const handleSubscriptionPayment = async (paymentData: any, token: string | null) => {
    try {
      const subscriptionPayload = {
        customer: {
          id: (customer as any).id,
          email: customer.email,
        },
        planId: planId || params?.plan?.id,
        payment_data: paymentData,
        payment_method: 'myfatoorah',
        amount: amount,
        customerId: customer,
        metadata: {
          ...metadata,
          paymentDate: new Date().toISOString(),
        },
      };

      const res = await axios.post(Base_Url.purchasesubscriptionplans, subscriptionPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (res?.data?.status) {
        Toast.show({
          type: 'success',
          text1: t('Success'),
          text2: t('Subscriptionactivatedsuccessfully'),
        });
        navigation.navigate('Dashboard');
      } else {
        Toast.show({
          type: 'error',
          text1: t('SubscriptionFailed'),
          text2: t('Failedtoactivatesubscription'),
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: t('SubscriptionError'),
        text2: error.response?.data?.message || error.message,
      });
      throw error;
    }
  };

 
  const handleOrderPayment = async (paymentData: any, token: string | null) => {
  try {
    
    const productIds = metadata?.cartItems?.map((item: any) => ({
      product_id: item.product_id,
      quantity: item.quantity,
      seller_id: item.seller_id,
    })) || [];
    
    const addressData = (metadata?.address || {}) as any;
    const addressId = addressData.id || null;
    
    const payload = {
      customer: {
        name: customer.name || addressData.contact_person_name || '',
        email: customer.email,
        mobile: customer.mobile || addressData.phone || '',
        address: {
          id: addressId,
          address: addressData.address || '',
          address_type: addressData.address_type || 'Home',
          city: addressData.city || '',
          state: addressData.state || '',
          country: addressData.country || '',
          zip: addressData.zip || '',
          contact_person_name: customer.name || addressData.contact_person_name || '',
          is_billing: true,
          latitude: addressData.latitude ? parseFloat(addressData.latitude) : null,
          longitude: addressData?.longitude ? parseFloat(addressData.longitude) : null,
          phone: addressData?.phone || customer.mobile || '',
        },
      },
      is_guest: 1,
      payment_method: 'myfatoorah',
      order_amount: amount,
      commission: null,
      addressId: addressId,
      products: productIds,
      latitude: metadata?.latitude ? parseFloat(metadata.latitude) : null,
      longitude: metadata.longitude ? parseFloat(metadata.longitude) : null,
      payment_data: paymentData,
    };
    
    
    const response = await axios.post(Base_Url.placeorder, payload, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    if (response?.data?.success === true) {
      
      try {
        await axios.post(Base_Url.clearCart, {}, {
          headers: { Authorization: `Bearer ${token}` },
          params: { guest_id: 1 },
        });
      } catch (clearCartError) {
        console.warn('Cart clear failed (non-critical):', clearCartError);
      }

      Toast.show({
        type: 'success',
        text1: t('Success'),
        text2: t('orderPlaced'),
      });

      navigation.navigate('Invoice', {
        id: response.data.order?.id || Date.now(), // Order ID
        order_group_id: response.data.order?.order_group_id || '',
        created_at: new Date().toISOString(),
        order_amount: amount,
        payment_status: 'PAID',
        order_status: 'confirmed',
        payment_method: 'MyFatoorah',
        transaction_ref: paymentData.transactionId || paymentData.invoiceId || '',
       details: (metadata.cartItems || []).map((item: any, index: number) => ({ 
          id: index,
          product: {
            name: item.name || `Product ${index + 1}`,
            unit_price: item.price || 0,
            tax: item.tax || 0,
            discount_type: item.discount_type || 'percentage',
          },
          qty: item.quantity || 1,
          price: item.price || 0,
          discount: item.discount || 0,
          tax: item.tax || 0,
        })),
        shipping_address_data: JSON.stringify({
          contact_person_name: customer.name || addressData.contact_person_name || '',
          address: addressData.address || '',
          city: addressData.city || '',
          country: addressData.country || '',
          phone: customer.mobile || addressData.phone || '',
          ...addressData,
        }),
        customer_type: 'guest',
        shipping_cost: metadata.totalShipping || 0,
        discount_amount: metadata.couponDiscount || 0,
      });

      if (onSuccess) { onSuccess(response.data); }
      
    }
    } catch (orderError: any) {
      console.error('Order Error Details:', orderError);
      if (orderError.code === 'ECONNABORTED') {
        Toast.show({ type: 'error', text1: t('Timeout'), text2: t('Requesttimedout') });
      } else if (orderError.message === 'Network Error') {
        Toast.show({
          type: 'error',
          text1: t('NetworkError'),
          text2: t('Checkyourinternetconnection'),
        });
      } else {
        Toast.show({
          type: 'error',
          text1: t('OrderFailed'),
          text2: orderError.response?.data?.message || orderError.message,
        });
      }
      throw orderError;
    }
  };

  const handlePaymentFailure = (errorMessage: string) => {
    Toast.show({
      type: 'error',
      text1: t('error'),
      text2: t('PaymentFailed') || errorMessage,
    });

    if (onFailure) { onFailure(errorMessage); }
  };

  if (loading) {
    return (
      <View style={PaymentScreenstyle.center}>
        <Loader size="large" />
        <Text style={PaymentScreenstyle.loadingText}>{t('InitializingPayment')}...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[PaymentScreenstyle.container, {
      paddingBottom: insets.bottom
    }]}>
      <View style={PaymentScreenstyle.header}>
        <Text style={PaymentScreenstyle.title}>{t('CompletePayment')}</Text>
        <View style={PaymentScreenstyle.amountContainer}>
          <Text style={PaymentScreenstyle.amount}>{t('SAR')} {amount.toFixed(2)}</Text>
        </View>
      </View>

      <ScrollView style={PaymentScreenstyle.scrollView} contentContainerStyle={PaymentScreenstyle.scrollContent}>
        {isSubscriptionPayment && (
          <View style={[PaymentScreenstyle.section, PaymentScreenstyle.subscriptionSection]}>
            <Text style={PaymentScreenstyle.subscriptionBadge}>{t('Subscription')}</Text>
            <Text style={PaymentScreenstyle.sectionTitle}>
              {planName ? `${t('Plan')}: ${planName}` : t('SubscriptionPayment')}
            </Text>
            {planDuration && (
              <Text style={PaymentScreenstyle.planDuration}>{t('Duration')}: {planDuration}</Text>
            )}
          </View>
        )}

        <View style={PaymentScreenstyle.section}>
          <Text style={PaymentScreenstyle.sectionTitle}>
            {t('PaymentFor')}: {purpose.toString().toUpperCase()}
          </Text>
          {orderId && <Text style={PaymentScreenstyle.orderId}>{t('Order')}: {orderId}</Text>}
          {subscriptionId && <Text style={PaymentScreenstyle.orderId}>{t('SubscriptionID')}: {subscriptionId}</Text>}
          {planId && <Text style={PaymentScreenstyle.orderId}>{t('PlanID')}: {planId}</Text>}
        </View>

        <View style={PaymentScreenstyle.section}>
          <Text style={PaymentScreenstyle.sectionTitle}>{t('SelectPaymentMethod')} *</Text>
          {paymentMethods.length > 0 ? (
            paymentMethods.map((method, index) => (
              <TouchableOpacity
                key={`${method.PaymentMethodId}-${index}`}
                style={[
                  PaymentScreenstyle.methodButton,
                  selectedMethod?.PaymentMethodId === method.PaymentMethodId && PaymentScreenstyle.methodButtonActive,
                ]}
                onPress={() => setSelectedMethod(method)}
              >
                <Text style={[
                  PaymentScreenstyle.methodText,
                  selectedMethod?.PaymentMethodId === method.PaymentMethodId && PaymentScreenstyle.methodTextActive,
                ]}>
                  {method.PaymentMethodEn || method.name || `${t('Method')} ${method.PaymentMethodId}`}
                </Text>
                {method.ImageUrl && (
                  <View style={PaymentScreenstyle.methodIcon}>
                    <Text style={PaymentScreenstyle.methodIconText}>💳</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))
          ) : (
            <Text style={PaymentScreenstyle.noMethods}>{t('Nopaymentmethodsavailable')}</Text>
          )}
        </View>

        {!isSubscriptionPayment && metadata.cartItems && metadata.cartItems.length > 0 && (
          <View style={PaymentScreenstyle.section}>
            <Text style={PaymentScreenstyle.sectionTitle}>{t('orderSummary')}</Text>
            {metadata.cartItems.slice(0, 3).map((item: any, index: number) => (
              <View key={index} style={PaymentScreenstyle.cartItem}>
                <View style={PaymentScreenstyle.cartItemInfo}>
                  <Text style={PaymentScreenstyle.cartItemName} numberOfLines={1}>
                    {item.name || `${t('Item')} ${index + 1}`}
                  </Text>
                  <Text style={PaymentScreenstyle.cartItemQuantity}>{t('quantity')}: {item.quantity || 1}</Text>
                </View>
                <Text style={PaymentScreenstyle.cartItemPrice}>
                  {t('SAR')} {((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                </Text>
              </View>
            ))}

            {metadata.cartItems.length > 3 && (
              <Text style={PaymentScreenstyle.moreItemsText}>
                + {metadata.cartItems.length - 3} {t('moreitems')}
              </Text>
            )}

            <View style={PaymentScreenstyle.summaryItem}>
              <Text style={PaymentScreenstyle.summaryLabel}>{t('Items')}:</Text>
              <Text style={PaymentScreenstyle.summaryValue}>{metadata.cartItems.length}</Text>
            </View>
            <View style={PaymentScreenstyle.summaryItem}>
              <Text style={PaymentScreenstyle.summaryLabel}>{t('Tax')}:</Text>
              <Text style={PaymentScreenstyle.summaryValue}>{t('SAR')} {metadata.totalTax?.toFixed(2) || '0.00'}</Text>
            </View>
            <View style={PaymentScreenstyle.summaryItem}>
              <Text style={PaymentScreenstyle.summaryLabel}>{t('Shipping')}:</Text>
              <Text style={PaymentScreenstyle.summaryValue}>{t('SAR')} {metadata.totalShipping?.toFixed(2) || '0.00'}</Text>
            </View>
            <View style={PaymentScreenstyle.summaryItem}>
              <Text style={PaymentScreenstyle.summaryLabel}>{t('discount')}:</Text>
              <Text style={PaymentScreenstyle.summaryValue}>{t('SAR')} {metadata.couponDiscount?.toFixed(2) || '0.00'}</Text>
            </View>
            <View style={[PaymentScreenstyle.summaryItem, PaymentScreenstyle.totalItem]}>
              <Text style={[PaymentScreenstyle.summaryLabel, PaymentScreenstyle.totalLabel]}>{t('Total')}:</Text>
              <Text style={[PaymentScreenstyle.summaryValue, PaymentScreenstyle.totalValue]}>{t('SAR')} {amount.toFixed(2)}</Text>
            </View>
          </View>
        )}

        {isSubscriptionPayment && (
          <View style={PaymentScreenstyle.section}>
            <Text style={PaymentScreenstyle.sectionTitle}>{t('Subscription Summary')}</Text>
            <View style={PaymentScreenstyle.summaryItem}>
              <Text style={PaymentScreenstyle.summaryLabel}>{t('Plan Name')}:</Text>
              <Text style={PaymentScreenstyle.summaryValue}>{planName || t('Subscription Plan')}</Text>
            </View>
            <View style={PaymentScreenstyle.summaryItem}>
              <Text style={PaymentScreenstyle.summaryLabel}>{t('Duration')}:</Text>
              <Text style={PaymentScreenstyle.summaryValue}>{planDuration || t('Not specified')}</Text>
            </View>
            <View style={PaymentScreenstyle.summaryItem}>
              <Text style={PaymentScreenstyle.summaryLabel}>{t('Payment Frequency')}:</Text>
              <Text style={PaymentScreenstyle.summaryValue}>
                {planDuration?.toLowerCase().includes('month') ? t('Monthly') :
                  planDuration?.toLowerCase().includes('year') ? t('Yearly') : t('One-time')}
              </Text>
            </View>
            <View style={[PaymentScreenstyle.summaryItem, PaymentScreenstyle.totalItem]}>
              <Text style={[PaymentScreenstyle.summaryLabel, PaymentScreenstyle.totalLabel]}>{t('total')}:</Text>
              <Text style={[PaymentScreenstyle.summaryValue, PaymentScreenstyle.totalValue]}>{t('SAR')} {amount.toFixed(2)}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={PaymentScreenstyle.footer}>
        <TouchableOpacity
          style={[
            PaymentScreenstyle.payButton,
            (!selectedMethod || processing) && PaymentScreenstyle.payButtonDisabled,
          ]}
          onPress={handlePayment}
          disabled={!selectedMethod || processing}
        >
          {processing ? (
            <Loader size="large" />
          ) : (
            <Text style={PaymentScreenstyle.payButtonText}>
              {t('Pay')} {t('SAR')} {amount.toFixed(2)}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PaymentScreen;
