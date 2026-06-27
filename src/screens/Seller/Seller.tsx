
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Share,
} from 'react-native';
import IMAGES from '../../assets/images';
import VectorIcon from '../../components/VectorIcon';
import COLORS from '../../utils/Colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { base_url, Base_Url } from '../../utils/ApiUrl';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { CustomText } from '../../components/CustomText';
import { horizontalScale, verticalScale } from '../../utils/Metrics';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Product {
  id: number;
  name: string;
  unit_price: number;
  thumbnail_path: string;
  quantity: number;
  image: string;
  price: number;
}

type SellerNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Seller'>;

const Seller = () => {
  const navigation = useNavigation<SellerNavigationProp>();
  const { t } = useTranslation();

  const route = useRoute<any>();
  const { seller, shop } = route?.params || {};

  const [popularProducts, setPopularProducts] = useState<[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [ratingdata, setRatingdata] = useState<any>();
  const [usercount, setusercount] = useState(0);
  // Track image loading errors for products
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});

  const fetchPopularProducts = async (sellerId: any) => {
    setLoadingProducts(true);
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        setLoadingProducts(false);
        return;
      }
      const res = await axios.get(
        `${Base_Url.getProductsBySeller}/${sellerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (res.data && res.data.products) {
        setPopularProducts(res.data.products);
        // Reset image errors for new products
        setImageErrors({});
      } else {
        setPopularProducts([]);
      }
    } catch (err) {
      setPopularProducts([]);
    }
    setLoadingProducts(false);
  };

  const formatLocalDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatUserCount = (count: number): string => {
    if (count < 1000) {
      return count.toString();
    } else if (count >= 1000 && count < 10000) {
      const formatted = (count / 1000).toFixed(2);
      return `${formatted} K`;
    } else if (count >= 10000 && count < 100000) {
      const formatted = (count / 1000).toFixed(1);
      return `${formatted} K`;
    } else if (count >= 100000 && count < 1000000) {
      const formatted = (count / 1000).toFixed(1);
      return `${formatted} K`;
    } else if (count >= 1000000) {
      const formatted = (count / 1000000).toFixed(2);
      return `${formatted} M`;
    }
    return count.toString();
  };

  // seller's customer  
  const sellerCustomer = async (sellerId:any) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(`${Base_Url.customercount}?seller_id=${sellerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      if (res?.data?.success) {
        setusercount(res?.data?.count);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  // seller review 
  const sellerreview = async (sellerId:any) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(`${Base_Url.sellerReview}?seller_id=${sellerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      console.log(res);
      if (res?.data?.success) {
        setRatingdata(res?.data);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    sellerreview(seller.id);
    sellerCustomer(seller.id);
  }, []);

  useEffect(() => {
    if (seller?.id) {
      fetchPopularProducts(seller.id);
    }
  }, [seller?.id]);

  // Handle image error for product thumbnail
  const handleImageError = (productId: number) => {
    setImageErrors(prev => ({
      ...prev,
      [productId]: true
    }));
  };

  // Get product image source with fallback
  const getProductImageSource = (item: Product) => {
    // Check if image has error or thumbnail_path is invalid
    if (imageErrors[item.id] || !item?.thumbnail_path) {
      return IMAGES?.imgplaceholder;
    }
    
    // Construct image URL
    let imageUrl = '';
    if (item.thumbnail_path.startsWith('storage')) {
      imageUrl = `${base_url}/${item.thumbnail_path}`;
    } else {
      imageUrl = `${base_url}/storage/app/public/product/thumbnail/${item.thumbnail_path}`;
    }
    
    return { uri: imageUrl };
  };

  const bannerImage =
    shop?.banner && typeof shop.banner === 'string'
      ? shop.banner.startsWith('storage')
        ? { uri: `${base_url}/${shop?.banner}` }
        : { uri: `${base_url}/storage/app/public/shop/banner/${shop?.banner}` }
      : IMAGES?.imgplaceholder;

  const sellerImage = seller?.image
    ? seller.image.startsWith('storage')
      ? { uri: `${base_url}/${seller?.image}` }
      : { uri: `${base_url}/storage/app/public/seller/${seller?.image}` }
    : IMAGES?.imgplaceholder;

  // Extract shop or seller contact details
  const shopContact = shop?.contact;
  const sellerContact = seller?.contact;
  const shopEmail = shop?.email;
  const sellerEmail = seller?.email;

  // Handle dynamic call linking
  const handleCallPress = () => {
    const phoneNumber = shopContact || sellerContact;
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };
  // Handle dynamic email linking
  const handleEmailPress = () => {
    const targetEmail = shopEmail || sellerEmail;
    if (targetEmail) {
      Linking.openURL(`mailto:${targetEmail}`);
    }
  };

  // Handle dynamic share linking
  const onSharePress = async () => {
    let message = '';
    if (seller) {
      message += `Seller: ${seller.f_name || ''} ${seller.l_name || seller.name || ''}\n`;
      if (seller.rating) { message += `Rating: ${seller.rating}\n`; }
      if (seller.reviews_count) { message += `Reviews: ${seller.reviews_count}\n`; }
      if (seller.contact) { message += `Contact: ${seller.contact}\n`; }
      if (seller.email) { message += `Email: ${seller.email}\n`; }
      if (seller.address) { message += `Address: ${seller.address}\n`; }
    }
    if (shop) {
      message += `Shop: ${shop.name || ''}\n`;
      if (shop.address) { message += `Shop Address: ${shop.address}\n`; }
      if (shop.contact) { message += `Shop Contact: ${shop.contact}\n`; }
      if (shop.email) { message += `Shop Email: ${shop.email}\n`; }
    }
    try {
      await Share.share({ message });
    } catch (error) {
      // Optionally handle error
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <VectorIcon
            size={24}
            type="AntDesign"
            name="left"
            color={COLORS.black}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('sellerDetails')}</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView>
        {/* Banner image */}
        <Image
          source={bannerImage}
          style={styles.headerImage}
          resizeMode="contain"
        />

        {/* Icons and Profile Row */}
        <View style={styles.iconProfileRow}>
          <View style={styles.iconsLeft}>
            <TouchableOpacity style={styles.iconButton} onPress={onSharePress}>
              <VectorIcon type="Feather" name="share-2" size={24} color={COLORS.black} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={handleEmailPress}>
              <VectorIcon type="Feather" name="mail" size={24} color={COLORS.black} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={handleCallPress}>
              <VectorIcon type="Feather" name="phone" size={24} color={COLORS.black} />
            </TouchableOpacity>
          </View>
          <View style={styles.profileRight}>
            <Image source={sellerImage} style={styles.profileImageRow} />
          </View>
        </View>

        {/* Seller name and rating below profile pic */}
        <View style={styles.profileTextBelow}>
          <Text style={styles.sellerNameBelow}>
            {seller?.f_name || ''} {seller?.l_name || seller?.name || ''}
          </Text>
          <View style={styles.joindate}>
            <Text style={styles.ratingBelow}>
              {t('from')}{formatLocalDate(seller?.created_at)}
            </Text>
          </View>
        </View>

        {/* Shop details */}
        <View style={styles.sellerinfosection}>
          <View style={styles.infobox}>
            <View style={{ flexDirection: 'row', paddingHorizontal: horizontalScale(5) }}>
              <VectorIcon style={styles.icon} name='help-circle' type='Feather' />
              <CustomText type='title' fontWeight='bold'>{t("sellerRating")}</CustomText>
            </View>
            <View style={{ alignItems: 'center', flexDirection: 'row', marginVertical: verticalScale(10), paddingHorizontal: horizontalScale(5) }}>
              <VectorIcon style={styles.icon} name='star' type='AntDesign' />
              <CustomText type='title' fontWeight={'bold'} >{ratingdata?.averageRating}</CustomText>
            </View>
            <CustomText type='subTitle' fontWeight={'bold'}>
              {ratingdata?.positivePercentage != null
                ? `${ratingdata.positivePercentage}% ${t('positiverating')}`
                : t('% positive Rating')}
            </CustomText>
          </View>
          <View style={styles.infobox}>
            <CustomText type='title' fontWeight={'bold'} >{t("customers")}</CustomText>
            <CustomText type='title' fontWeight={'bold'} style={{ marginVertical: verticalScale(10) }}>
              {formatUserCount(usercount)}
            </CustomText>
            <CustomText type='subTitle' fontWeight={'bold'} >{t("Overlastdays")}</CustomText>
          </View>
        </View>

        {seller?.address && (
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>{t('sellerAddress')}</Text>
            <Text style={styles.infoText}>{seller.address}</Text>
          </View>
        )}
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>{t('contactInformation')}</Text>
          {(seller?.contact || shop?.contact) && (
            <Text style={styles.infoText}>{shopContact || sellerContact}</Text>
          )}
          {(seller?.email || shop?.email) && (
            <Text style={styles.infoText}>{shopEmail || sellerEmail}</Text>
          )}
        </View>

        {/* Popular Products */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('popularProducts')}</Text>
        </View>
        {loadingProducts ? (
          <ActivityIndicator style={{ marginVertical: 18 }} size="large" color={COLORS.btnbg} />
        ) : (
          <FlatList
            data={popularProducts}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id?.toString()}
            renderItem={({ item }: { item: Product }) => (
              <View style={styles.productCard}>
                <View style={styles.productImageWrapper}>
                  <Image
                    source={getProductImageSource(item)}
                    style={styles.productImagePlaceholder}
                    resizeMode="cover"
                    onError={() => handleImageError(item.id)}
                    // Show placeholder while loading
                    defaultSource={IMAGES?.imgplaceholder}
                  />
                 
                  
                </View>
                <Text style={styles.productName} numberOfLines={2}>
                  {item?.name}
                </Text>
                <Text style={styles.productPrice}>
                  {item?.unit_price ? ` ﷼  ${item?.unit_price}` : ''}
                </Text>
              </View>
            )}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            ListEmptyComponent={
              <Text style={{ color: COLORS.review, margin: 16 }}>
                {t('noProducts')}
              </Text>
            }
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: COLORS.bckbtn,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  joindate: {
    backgroundColor: COLORS.btnbg,
    paddingHorizontal: verticalScale(10),
    paddingVertical: verticalScale(5),
    borderRadius: 6,
  },
  container: { flex: 1, backgroundColor: COLORS.white },
  headerImage: {
    width: '90%',
    height: 150,
    borderRadius: 15,
    alignSelf: 'center'
  },
  iconProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    marginTop: 22,
    marginBottom: 8,
  },
  iconsLeft: {
    flexDirection: 'row',
  },
  iconButton: {
    backgroundColor: COLORS.white,
    borderRadius: 40,
    padding: 11,
    marginHorizontal: 6,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },
  profileRight: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 18,
  },
  profileImageRow: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    borderColor: COLORS.white,
    backgroundColor: '#eee',
  },
  profileTextBelow: {
    alignItems: 'flex-end',
    marginRight: 32,
    marginBottom: 12,
  },
  sellerNameBelow: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
    textAlign: 'right',
  },
  ratingBelow: {
    color: COLORS.white,
    fontWeight: 'bold',
    marginTop: 2,
    textAlign: 'right',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  viewAll: { color: '#2563eb', fontWeight: 'bold' },
  productCard: {
    width: 120,
    backgroundColor: '#f6f6f6',
    borderRadius: 12,
    marginRight: 12,
    alignItems: 'center',
    padding: 12,
  },
  productImageWrapper: {
    position: 'relative',
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#e0e0e0',
  },
  productImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  imageLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productName: { 
    fontWeight: '600', 
    fontSize: 15, 
    textAlign: 'center',
    marginTop: 4,
  },
  productPrice: { 
    color: '#2563eb', 
    marginTop: 4, 
    textAlign: 'center' 
  },
  infoBox: {
    backgroundColor: '#f6f6f6',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 10,
    padding: 12,
  },
  infoLabel: { fontWeight: 'bold', marginBottom: 4 },
  infoText: { color: COLORS.reviewcmt },
  sellerinfosection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infobox: {
    backgroundColor: COLORS.white,
    elevation: 4,
    height: verticalScale(120),
    alignSelf: 'center',
    padding: horizontalScale(20),
    borderRadius: 9,
  },
  icon: {
    marginRight: horizontalScale(10)
  }
});

export default Seller;