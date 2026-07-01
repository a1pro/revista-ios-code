/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { CustomText } from '../../components/CustomText';
import COLORS from '../../utils/Colors';
import styles from './style';
import VectorIcon from '../../components/VectorIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { base_url, Base_Url } from '../../utils/ApiUrl';
import axios from 'axios';
import Loader from '../../components/Loader';
import { t } from 'i18next';

type Props = NativeStackScreenProps<RootStackParamList, 'Order'>;

const Order: React.FC<Props> = ({ navigation }) => {
  const [orders, setorders] = useState([]);
  const [loading, setLoading] = useState(true);
  const orderlist = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const res = await axios.get(Base_Url.getorder, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setorders(res?.data?.data || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    orderlist();
  }, []);

  const renderOrder = ({ item }: { item: any; index: number }) => {
    const firstProduct = item.details[0].product;
    const productThumbnail = firstProduct.thumbnail;
    const totalItems = item.details.reduce((sum: any, detail: { qty: any; quantity: any; }) => {
      return sum + (detail.qty || detail.quantity || 1);
    }, 0);

    return (
      <SafeAreaView>
        

        <View style={styles.orderCard}>
          <Image
            source={{ uri: `${base_url}/${productThumbnail}` }}
            style={styles.productImage}
          />
          <View style={{ flex: 1, marginLeft: 8 }}>
            <CustomText style={styles.orderNumber}>
             {t('Order')} #{item.id}
            </CustomText>
            <CustomText style={styles.deliveryType}>{item.order_type}</CustomText>
            <CustomText style={{ fontSize: 14, color: '#555' }}>
              {firstProduct.name}
            </CustomText>
            <View style={styles.statusRow}>
              <CustomText style={styles.statusDelivered}>{item.order_status}</CustomText>
              <Icon
                name="check-circle"
                size={18}
                color={COLORS.btnbg}
                style={{ marginLeft: 4 }}
              />
            </View>
          </View>
          <View
            style={{
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              height: 80,
            }}
          >
            <CustomText style={styles.itemsCount}>
              {totalItems} {t('Items')}
            </CustomText>
            <TouchableOpacity style={styles.reviewBtn} onPress={() => (navigation.navigate as any)('ProductReviewScreen', { order: item })}>
              <CustomText style={styles.reviewBtnText}>{t('review')}</CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView >
    );
  };

if (loading) {
  return (
    <SafeAreaView style={styles.container}>
      <Loader fullScreen size="large" />
    </SafeAreaView>
  );
}
return (
  <SafeAreaView style={styles.container}>
    <View style={styles.inner}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <VectorIcon
            type="AntDesign"
            name="left"
            size={24}
            color={COLORS.textColor}
          />
        </TouchableOpacity>
        <CustomText
          type="heading"
          color={COLORS.textColor}
          fontWeight="bold"
          style={styles.headerText}
        >
          {t('myOrders')}
        </CustomText>
      </View>
      <FlatList
        data={orders}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderOrder}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  </SafeAreaView>
);
};

export default Order;
