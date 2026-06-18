import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import IMAGES from '../../assets/images';
import VectorIcon from '../../components/VectorIcon';
import COLORS from '../../utils/Colors';
import { useTranslation } from 'react-i18next';


import { base_url } from '../../utils/ApiUrl';
import { isUserPremium, primeicon } from '../../utils/premimumuser';
import Subscriptionstyle from '../../components/Subscriptionstyle';

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

type Props = NativeStackScreenProps<RootStackParamList, 'BrandedProductSubCategories'>;

const BrandedProductSubCategories: React.FC<Props> = ({ route, navigation }) => {
  const { category } = (route.params as any) || null;
  const [ispremimum, setispremimum] = useState<Boolean>(false);
  const [icon, setprimeicon] = useState<prime | null>(null);
  const [loadedImages, setLoadedImages] = useState<{ [key: number]: boolean }>({});
  const { t } = useTranslation();
  // console.log(category)
  const primeIcon = async () => {
    const prime = await primeicon();
    setprimeicon(prime.data[0]);
  };

  const premiumuser = async () => {
    const premimum = await isUserPremium();
    if (premimum) {
      setispremimum(premimum);
    } else {
      setispremimum(premimum);
    }
  };

  useEffect(() => {
    primeIcon();
    premiumuser();
  }, []);

  const getDiscountedPrice = (price: number, discount: number, discountType: string) => {
    if (discountType === 'flat') {
      return price - discount;
    } else {
      // percentage discount
      return price - (price * discount) / 100;
    }
  };

  const getDiscountText = (discount: number, discountType: string) => {
    if (discountType === 'flat') {
      return `${discount.toFixed(2)} SAR OFF`;
    } else {
      return `${discount}% OFF`;
    }
  };

  const getSubscribeMessage = (discount: number, discountType: string) => {
    if (discountType === 'flat') {
      return `${t('nonprime')} ${discount.toFixed(2)} SAR off`;
    } else {
      return `${t('nonprime')} ${discount}% off`;
    }
  };



  const renderProduct = ({ item }: any) => {
    const price = Number(item.unit_price) || 0;
    const discount = Number(item.discount) || 0;
    const discountType = item?.discount_type || 'percentage';
    console.log(item)
    let displayPrice = price;
    let showDiscountPrice = false;
    let showSubscribeMessage = false;

    if (ispremimum && discount > 0) {
      displayPrice = getDiscountedPrice(price, discount, discountType);
      showDiscountPrice = true;
    } else if (!ispremimum && discount > 0) {
      showSubscribeMessage = true;
    }
    //  const imageSource = item?.thumbnail
    //     ? { uri: `${base_url}/${item.thumbnail}` }
    //     : IMAGES.imgplaceholder;

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => navigation.navigate('ProductDetails', { product: item })}
      >
        <View style={{ width: '100%', height: 120, marginBottom: 8 }}>
          {!loadedImages[item.id] && (
            <Image
              source={IMAGES.imgplaceholder}
              style={[
                styles.productImage,
                {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                },
              ]}
              resizeMode="contain"
            />
          )}

          {item?.thumbnail ? (
            <Image
              source={{ uri: `${base_url}/${item.thumbnail}` }}
              style={styles.productImage}
              resizeMode="contain"
              onLoad={() =>
                setLoadedImages(prev => ({
                  ...prev,
                  [item.id]: true,
                }))
              }
              onError={() =>
                setLoadedImages(prev => ({
                  ...prev,
                  [item.id]: false,
                }))
              }
            />
          ) : (
            <Image
              source={IMAGES.imgplaceholder}
              style={styles.productImage}
              resizeMode="contain"
            />
          )}
        </View>

        {/* product name + prime icon */}
        <View style={styles.nameandicon}>
          <Text style={styles.productName} numberOfLines={1}>
            {item.name}
          </Text>

          {icon?.general_icon?.icon && (
            <Image
              source={{ uri: `${base_url}/${icon.general_icon.icon}` }}
              style={styles.primeicon}
            />
          )}
        </View>

        {/* price section */}

        {showDiscountPrice ? (
          <View style={{ alignItems: 'center' }}>
            <Text style={[styles.price, { color: 'green' }]}>
              {displayPrice.toFixed(2)} ﷼
            </Text>

            <Text style={styles.oldPrice}>
              {price.toFixed(2)} ﷼
            </Text>

            <Text style={styles.discountText}>
              ({getDiscountText(discount, discountType)})
            </Text>
          </View>
        ) : showSubscribeMessage ? (
          <View>
            <Text style={styles.price}>
              {price.toFixed(2)} ﷼
            </Text>

            <Text style={styles.subscribeText}>
              {getSubscribeMessage(discount, discountType)}
            </Text>
          </View>
        ) : (
          <Text style={styles.price}>
            {price.toFixed(2)} ﷼
          </Text>
        )}

        {ispremimum && <Subscriptionstyle />}
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <VectorIcon
              size={24}
              type="AntDesign"
              name="left"
              color={COLORS.black}
            />
          </TouchableOpacity>
          <Text style={styles.header}>
            {category.defaultname || category.name}
          </Text>
          <View style={styles.placeholder} />
        </View>


        <FlatList
          data={category.brand_products || []}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProduct}
          numColumns={2}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bckbtn },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.bckbtn,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black,
    flex: 1,
    textAlign: 'center',
  },
  productList: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },

  productCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    margin: 6,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    elevation: 2,
  },

  productImage: {
    width: '100%',
    height: 120,
    marginBottom: 8,
  },

  productName: {
    fontSize: 14,
    color: COLORS.black,
    textAlign: 'center',
    width: '85%'
  },

  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.appColor,
    marginTop: 4,
  },
  placeholder: { width: 40 },
  flatListContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  subCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginBottom: 10,
    padding: 14,
    borderRadius: 10,
    elevation: 1,
  },
  subCategoryImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
    resizeMode: 'cover',
    backgroundColor: '#eaeaea',
  },
  subCategoryText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.reviewcmt,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.review,
    marginTop: 32,
    fontSize: 16,
  },


  nameandicon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },



  primeicon: {
    width: 18,
    height: 18,
  },

  oldPrice: {
    textDecorationLine: 'line-through',
    color: 'gray',
    fontSize: 12,
  },

  discountText: {
    color: '#e63946',
    fontWeight: 'bold',
    fontSize: 12,
  },

  subscribeText: {
    fontSize: 11,
    color: COLORS.headertext,
    textAlign: 'center',
  },
});

export default BrandedProductSubCategories;
