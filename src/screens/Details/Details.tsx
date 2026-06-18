
import React, { useEffect, useState } from 'react';
import {
  View,
  SafeAreaView,
  Image,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import styles from './style';
import VectorIcon from '../../components/VectorIcon';
import COLORS from '../../utils/Colors';
import { verticalScale } from '../../utils/Metrics';
import { isUserPremium, primeicon } from '../../utils/premimumuser';
import { base_url } from '../../utils/ApiUrl';
import Subscriptionstyle from '../../components/Subscriptionstyle';
import { t } from 'i18next';
import IMAGES from '../../assets/images';

interface prime {
  id: number;
  general_icon: {
    icon: string;
    title: string;
  };
  prime_icon: {
    icon: string;
    title: string;
  };
}

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

const Details: React.FC<Props> = ({ route, navigation }) => {
  const [ispremimum, setispremimum] = useState<Boolean>(false);
  const { products = [], subCategory } = (route.params as any);
  const [icon, setprimeicon] = useState<prime | null>(null);
  const [loadedImages, setLoadedImages] = useState<{ [key: string]: boolean }>({});

  const primeIcon = async () => {
    const prime = await primeicon();
    setprimeicon(prime.data[0]);
  };

  const premiumuser = async () => {
    const premimum = await isUserPremium();
    setispremimum(premimum);
  };

  useEffect(() => {
    primeIcon();
    premiumuser();
  }, []);

  const getDiscountedPrice = (price: number, discount: number, discountType: string) => {
    if (discountType === 'flat') return price - discount;
    return price - (price * discount) / 100;
  };

  const getDiscountText = (discount: number, discountType: string) => {
    if (discountType === 'flat') return `${discount.toFixed(2)} SAR OFF`;
    return `${discount}% OFF`;
  };

  const getSubscribeMessage = (discount: number, discountType: string) => {
    if (discountType === 'flat') return `${t('nonprime')} ${discount.toFixed(2)} SAR off`;
    return `${t('nonprime')} ${discount}% off`;
  };

  const renderProduct = (item: any) => {
    const price = Number(item.unit_price) || 0;
    const discount = Number(item.discount) || 0;
    const discountType = item?.discount_type || 'percentage';
    let displayPrice = price;
    let showDiscountPrice = false;
    let showSubscribeMessage = false;

    if (ispremimum && discount > 0) {
      displayPrice = getDiscountedPrice(price, discount, discountType);
      showDiscountPrice = true;
    } else if (!ispremimum && discount > 0) {
      showSubscribeMessage = true;
    }

    const isLoaded = loadedImages[item.id];

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => navigation.navigate('ProductDetails', { product: item })}
      >
        <Image
          source={isLoaded ? { uri: `${base_url}/${item.thumbnail}` } : IMAGES.imgplaceholder}
          style={styles.productImage}
          resizeMode="contain"
          onLoad={() => setLoadedImages(prev => ({ ...prev, [item.id]: true }))}
          onError={() => setLoadedImages(prev => ({ ...prev, [item.id]: false }))}
        />

        <View style={styles.nameandicon}>
          <Text style={styles.productName} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
          {icon?.general_icon?.icon && (
            <Image
              source={{ uri: `${base_url}/${icon.general_icon.icon}` }}
              style={styles.primeicon}
              resizeMode="contain"
            />
          )}
        </View>

        <View style={{ marginTop: 2, alignSelf: 'flex-start' }}>
          {showDiscountPrice ? (
            <View style={{ alignItems: 'flex-start' }}>
              <Text style={[styles.price, { color: 'green', fontWeight: 'bold', fontSize: 20 }]}>
                {displayPrice.toFixed(2)} ﷼
              </Text>
              <Text style={{ textDecorationLine: 'line-through', color: 'gray', fontSize: 15 }}>
                {price.toFixed(2)} ﷼
              </Text>
              <Text style={{ color: '#e63946', fontWeight: 'bold' }}>
                ({getDiscountText(discount, discountType)})
              </Text>
            </View>
          ) : showSubscribeMessage ? (
            <View>
              <Text style={[styles.price, { color: COLORS.appColor, fontWeight: 'bold', fontSize: 20 }]}>
                {price.toFixed(2)} ﷼
              </Text>
              <Text style={{ fontSize: 12, color: COLORS.headertext, textAlign: 'center', marginTop: 2 }}>
                {getSubscribeMessage(discount, discountType)}
              </Text>
            </View>
          ) : (
            <Text style={[styles.price, { color: COLORS.appColor, fontWeight: 'bold', fontSize: 20 }]}>
              {price.toFixed(2)} ﷼
            </Text>
          )}

          {ispremimum && <Subscriptionstyle />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <VectorIcon
            size={30}
            type="AntDesign"
            name="left"
            color={COLORS.black}
            style={{ marginRight: verticalScale(30) }}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{subCategory?.title || 'Products'}</Text>
        <View style={styles.placeholder} />
      </View>

      {products.length > 0 ? (
        <FlatList
          data={products}
          renderItem={({ item }) => renderProduct(item)}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text style={{ textAlign: 'center', margin: 32, fontSize: 16, color: COLORS.review }}>
          {t('noproductavailable')}
        </Text>
      )}
    </SafeAreaView>
  );
};

export default Details;