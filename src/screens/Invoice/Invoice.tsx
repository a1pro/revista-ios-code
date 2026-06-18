import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, BackHandler, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import Feather from 'react-native-vector-icons/Feather';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import RNPrint from 'react-native-print';
import COLORS from '../../utils/Colors';
import { t } from 'i18next';
import { primeicon } from '../../utils/premimumuser';
import { styles } from './style';

type Props = NativeStackScreenProps<RootStackParamList, 'Invoice'>;

interface OrderItem {
  id: number;
  product: { discount_type: string; name: string; unit_price: number; tax: number };
  qty: number;
  price: number;
  discount: number;
  tax: number;
}

interface InvoiceData {
  id: number;
  order_group_id: string;
  created_at: string;
  order_amount: number;
  payment_status: string;
  order_status: string;
  payment_method: string;
  transaction_ref: string;
  details: OrderItem[];
  shipping_address_data: string;
  customer_type: string;
  shipping_cost: number;
  discount_amount: number;
}

const Invoice: React.FC<Props> = ({ route, navigation }) => {
  const invoiceData: InvoiceData = route.params as unknown as InvoiceData;
  const [primemember, setPrimemember] = useState<number>(1);
  const [curency, setcurency] = useState<string>('﷼');
  const [supportcontect, setsupportcontect] = useState<string>('support@revista.com | +1 (555) 123-4567');

  const primeIcon = async () => {
    const prime = await primeicon();
    setPrimemember(prime.prime_member_status);
  };

  useEffect(() => {
    primeIcon();
  }, []);

  const isPrimeMember = primemember === 1;

  const calculateItemTotal = (item: OrderItem) => {
    let total = item.price * item.qty;
    if (!isPrimeMember) return total;
    if (item.product.discount_type === 'flat') total -= item.discount;
    else total -= (total * item.discount) / 100;
    return Math.max(0, total);
  };

  const calculateSubtotal = () => invoiceData.details.reduce((sum, item) => sum + calculateItemTotal(item), 0);

  const calculateTaxTotal = () => invoiceData.details.reduce((sum, item) => sum + (item.price * item.qty * item.tax) / 100, 0);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  const shippingAddress = invoiceData.shipping_address_data ? JSON.parse(invoiceData.shipping_address_data) : null;

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return '#10B981'; // green
      case 'pending':
      case 'unpaid':
        return '#F59E0B'; // orange
      default:
        return '#6B7280'; // gray
    }
  };

  const generateInvoiceHTML = () => {
    const itemsHTML = invoiceData.details
      .map(item => {
        const itemTotal = calculateItemTotal(item);
        return `
          <tr>
            <td style="text-align:left; padding:8px;">${item.product.name}<br/><small style="color:#6B7280;">Tax: ${item.tax}% | Discount: ${item.discount} ${item.product.discount_type === 'flat' ? 'Flat' : '%'}</small></td>
            <td style="text-align:center; padding:8px;">${item.qty}</td>
            <td style="text-align:center; padding:8px;">${curency}${item.price.toFixed(2)}</td>
            <td style="text-align:right; padding:8px;">${curency}${itemTotal.toFixed(2)}</td>
          </tr>
        `;
      })
      .join('');

    return `
      <html>
        <head>
          <meta charset="utf-8"/>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; color: #333; background:#f9fafb; }
            h1 { text-align: center; color: #1E40AF; margin-bottom:5px; }
            .invoice-id { text-align:center; font-size:32px; font-weight:bold; color:#1E40AF; margin-bottom:20px; }
            table { width:100%; border-collapse: collapse; margin-top:20px; background:#fff; box-shadow:0 2px 4px rgba(0,0,0,0.05); }
            th { background:#f2f2f2; padding:12px; border-bottom:2px solid #ddd; text-align:center; font-weight:600; }
            td { border-bottom:1px solid #eee; padding:10px; font-size:14px; }
            .summary { margin-top:30px; width:100%; font-size:16px; }
            .summary div { display:flex; justify-content:space-between; margin-bottom:8px; }
            .total { font-size:22px; font-weight:bold; color:#1E40AF; margin-top:10px; }
            .footer { margin-top:40px; text-align:center; font-size:12px; color:#777; }
            .status { padding:6px 12px; border-radius:20px; color:white; font-weight:bold; display:inline-block; margin-left:10px; }
            h3 { margin-bottom:5px; color:#1F2937; }
            .customer-info p { margin:2px 0; font-size:14px; }
          </style>
        </head>
        <body>
          <h1>INVOICE</h1>
          <div class="invoice-id">#${invoiceData.id}</div>

          <p><b>Date:</b> ${formatDate(invoiceData.created_at)}</p>
          <p><b>Payment Method:</b> ${invoiceData.payment_method}</p>
          <p><b>Payment Status:</b> <span class="status" style="background:${getPaymentStatusColor(invoiceData.payment_status)};">${invoiceData.payment_status.toUpperCase()}</span></p>
          <p><b>Transaction ID:</b> ${invoiceData.transaction_ref}</p>
          
          <h3>Customer Info</h3>
          <div class="customer-info">
            <p>${shippingAddress ? shippingAddress.contact_person_name : 'N/A'}</p>
            <p>${shippingAddress ? shippingAddress.address : ''}</p>
            <p>${shippingAddress ? shippingAddress.city + ', ' + shippingAddress.country : ''}</p>
            <p>${shippingAddress?.email || ''}</p>
            <p>${shippingAddress?.phone || ''}</p>
          </div>
          
          <table>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
            ${itemsHTML}
          </table>

          <div class="summary">
            <div><span>Subtotal</span><span>${curency}${calculateSubtotal().toFixed(2)}</span></div>
            ${invoiceData.discount_amount > 0 ? `<div><span>Discount</span><span>-${curency}${invoiceData.discount_amount.toFixed(2)}</span></div>` : ''}
            <div><span>Tax</span><span>${curency}${calculateTaxTotal().toFixed(2)}</span></div>
            <div><span>Shipping</span><span>${curency}${invoiceData.shipping_cost.toFixed(2)}</span></div>
            <div class="total"><span>Total</span><span>${curency}${invoiceData.order_amount.toFixed(2)}</span></div>
          </div>

          <div class="footer">
            <p>Thank you for your purchase!</p>
            <p>${supportcontect}</p>
          </div>
        </body>
      </html>
    `;
  };

  const generatePDF = async () => {
    try {
      const html = generateInvoiceHTML();
      await RNPrint.print({ html });
      Toast.show({ type: 'success', text1: 'Success', text2: 'Invoice PDF generated' });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'PDF generation failed' });
    }
  };
  
const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'processing': return '#3B82F6';
      default: return COLORS.headertext;
    }
  };
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.reset({ index: 0, routes: [{ name: 'Dashboard' }] });
        return true;
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [navigation])
  );
// console.log(invoiceData)
  return (
    
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{t('Invoice')}</Text>
        <TouchableOpacity style={styles.downloadButton} onPress={generatePDF}>
          <Feather name="download" size={20} color={COLORS.backgroundColor} />
          <Text style={styles.downloadButtonText}>{t('DownloadPDF')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >

        <ScrollView
          horizontal={false}
          showsVerticalScrollIndicator={false}
        >
          
            <View
              style={{
                paddingHorizontal: 20,
                paddingVertical: 30,
                backgroundColor: COLORS.white,
                minHeight: 520,
                width: 410,
              }}
            >
              <View style={{ alignItems: 'center', marginBottom: 30 }}>
                <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1F2937' }}>
                  {t('INVOICE')}
                </Text>
                <Text style={{ fontSize: 36, fontWeight: '800', color: '#1E40AF', marginTop: 5 }}>
                  #{invoiceData.id}
                </Text>
              </View>

              {/* Invoice Info Row */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, color: COLORS.headertext, fontWeight: '500' }}>{t('date')}</Text>
                  <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 4 }}>
                    {formatDate(invoiceData.created_at)}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, color: COLORS.headertext, fontWeight: '500' }}>{t('PaymentMethod')}</Text>
                  <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 4 }}>
                    {invoiceData.payment_method}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, color: COLORS.headertext, fontWeight: '500' }}>{t('status')}</Text>
                  <View style={{
                    backgroundColor: getStatusColor(invoiceData.payment_status),
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 20,
                    alignSelf: 'flex-start',
                    marginTop: 4,
                  }}>
                    <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>
                      {invoiceData.payment_status.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Divider */}
              <View style={{
                height: 1,
                backgroundColor: COLORS.borderbottom,
                marginBottom: 25,
              }} />

              {/* Customer & Transaction Info */}
              <View style={{ flexDirection: 'row', marginBottom: 25 }}>
                <View style={{ flex: 1, marginRight: 15 }}>
                  <Text style={{ fontSize: 14, color: COLORS.headertext, marginBottom: 8 }}>{t('Customer')}</Text>
                  {shippingAddress ? (
                    <>
                      <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 4 }}>
                        {shippingAddress?.contact_person_name}
                      </Text>
                      <Text style={{ fontSize: 14, color: COLORS.invoicetxt, lineHeight: 20 }}>
                        {shippingAddress?.address}
                      </Text>
                      <Text style={{ fontSize: 14, color: COLORS.invoicetxt, lineHeight: 20 }}>
                        {shippingAddress?.city}, {shippingAddress?.country}
                      </Text>
                    </>
                  ) : (
                    <Text style={{ fontSize: 16, color: COLORS.invoicetxt }}>{t('CustomerDetails')}</Text>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, color: COLORS.headertext, marginBottom: 8 }}>{t('Transaction')}</Text>
                  <Text style={{ fontSize: 14, color: COLORS.invoicetxt, lineHeight: 20 }}>
                    Transaction ID: {invoiceData.transaction_ref}
                  </Text>
                  <Text style={{ fontSize: 14, color: COLORS.invoicetxt, lineHeight: 20 }}>
                    {t('orderid')}: {invoiceData.order_group_id}
                  </Text>
                </View>
              </View>

              {/* Items Table */}
              <View style={{ marginBottom: 30 }}>
                <Text style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: '#1F2937',
                  marginBottom: 15,
                }}>
                  {t('OrderItems')}
                </Text>

                {/* Table Header */}
                <View style={{
                  flexDirection: 'row',
                  backgroundColor: '#F9FAFB',
                  paddingVertical: 12,
                  paddingHorizontal: 15,
                  borderRadius: 8,
                  marginBottom: 8,
                }}>
                  <Text style={{ flex: 2.5, fontSize: 14, fontWeight: '600', color: COLORS.invoicetxt }}>
                    {t('Description')}
                  </Text>
                  <Text style={{ flex: 0.8, fontSize: 14, fontWeight: '600', color: COLORS.invoicetxt, textAlign: 'center' }}>
                    {t('qty')}
                  </Text>
                  <Text style={{ flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.invoicetxt, textAlign: 'center' }}>
                    {t('price')}
                  </Text>
                  <Text style={{ flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.invoicetxt, textAlign: 'right' }}>
                    {t('total')}
                  </Text>
                </View>

                {/* Items */}
                
                {invoiceData.details.map((item) => {
                  const itemTotal = calculateItemTotal(item);
                  return (
                    <View key={item.id} style={{
                      flexDirection: 'row',
                      paddingVertical: 12,
                      paddingHorizontal: 15,
                      borderBottomWidth: 1,
                      borderBottomColor: '#F3F4F6',
                    }}>
                      <View style={{ flex: 2.5 }}>
                        <Text style={{ fontSize: 15, fontWeight: '600', color: '#1F2937', marginBottom: 2 }}>
                          {item.product.name}
                        </Text>
                        <Text style={{ fontSize: 13, color: COLORS.headertext }}>
                          {t('Tax')}: {item.tax}% | {t('discount')}: {item.discount} {item?.product?.discount_type === "flat" ? t('Flat') : "%"}
                        </Text>
                      </View>
                      <Text style={{
                        flex: 0.8,
                        fontSize: 15,
                        fontWeight: '600',
                        textAlign: 'center',
                      }}>
                        {item.qty}
                      </Text>
                      <Text style={{
                        flex: 1,
                        fontSize: 15,
                        fontWeight: '600',
                        textAlign: 'center',
                      }}>
                        {curency}{item.price.toFixed(2)}
                      </Text>
                      <Text style={{
                        flex: 1,
                        fontSize: 15,
                        fontWeight: '700',
                        color: '#1E40AF',
                        textAlign: 'right',
                      }}>
                        {curency}{itemTotal.toFixed(2)}
                      </Text>
                    </View>
                  );
                })}
              </View>

              {/* Summary Table */}
              <View style={{
                backgroundColor: '#F8FAFC',
                padding: 20,
                borderRadius: 12,
                marginBottom: 25,
              }}>
                <Text style={{
                  fontSize: 18,
                  fontWeight: '700',
                  marginBottom: 20,
                }}>
                  {t('orderSummary')}
                </Text>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ fontSize: 16, color: COLORS.invoicetxt }}>{t('subTotal')}</Text>
                  <Text style={{ fontSize: 16, fontWeight: '600' }}>{curency}{calculateSubtotal().toFixed(2)}</Text>
                </View>

                {invoiceData.discount_amount > 0 && (
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={{ fontSize: 16, color: COLORS.invoicetxt }}>{t('discount')}</Text>
                    <Text style={{ fontSize: 16, color: '#EF4444' }}>-{curency}{invoiceData.discount_amount.toFixed(2)}</Text>
                  </View>
                )}

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ fontSize: 16, color: COLORS.invoicetxt }}>{t('Tax')}</Text>
                  <Text style={{ fontSize: 16, fontWeight: '600' }}>{curency}{calculateTaxTotal().toFixed(2)}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
                  <Text style={{ fontSize: 16, color: COLORS.invoicetxt }}>{t('Shipping')}</Text>
                  <Text style={{ fontSize: 16, fontWeight: '600' }}>{curency}{invoiceData.shipping_cost.toFixed(2)}</Text>
                </View>

                {/* Total */}
                <View style={{
                  height: 2,
                  backgroundColor: '#1E40AF',
                  marginVertical: 10,
                }} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 24, fontWeight: '800', color: '#1F2937' }}>{t('total')}</Text>
                  <Text style={{
                    fontSize: 28,
                    fontWeight: '900',
                    color: '#1E40AF',
                  }}>
                    {curency}{invoiceData.order_amount.toFixed(2)}
                  </Text>
                </View>
              </View>

              {/* Footer */}
              <View style={{
                padding: 20,
                borderTopWidth: 1,
                borderTopColor: COLORS.borderbottom,
                alignItems: 'center',
              }}>
                <Text style={{ fontSize: 14, color: COLORS.headertext, textAlign: 'center', marginBottom: 10 }}>
                  {t('thanksmsg')}
                </Text>
                <Text style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center' }}>
                  {supportcontect}
                </Text>
              </View>
            </View>
        </ScrollView>
      </ScrollView>
    </SafeAreaView >
  );
};

export default Invoice;