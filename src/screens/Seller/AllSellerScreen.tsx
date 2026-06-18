/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import VectorIcon from '../../components/VectorIcon';
import COLORS from '../../utils/Colors';
import axios from 'axios';
import IMAGES from '../../assets/images';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Loader from '../../components/Loader';
import { base_url, Base_Url } from '../../utils/ApiUrl';
import { t } from 'i18next';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 36) / 2;
const CARD_HEIGHT = 150;

const BANNER_BASE_URL = 'https://revista-sa.com/storage/app/public/shop/banner';
const AVATAR_BASE_URL = 'https://revista-sa.com/storage/app/public/seller';

interface Seller {
  image_path: any;
  banner_path: any;
  id: number;
  seller_id: number;
  name: string;
  banner?: string;
  image?: string;
  products_count?: number;
  reviews_count?: number;
  rating?: number;
}

const AllSellerScreen: React.FC = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp<any>>();
  const fetchSellers = async () => {
    try {
      const res = await axios.get(Base_Url.allseller);
      // console.log(res.data)
      if (res.data) {setSellers(res.data);}

    } catch (error) {
      console.log('Error fetching sellers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const renderSeller = ({ item }: { item: Seller }) => {
    const bannerSource = item.banner
      ? { uri: `${base_url}/${item?.banner_path}` }
      : IMAGES.imgplaceholder;
    const avatarSource = item.image
      ? { uri: `${base_url}/${item?.image_path}` }
      : { uri: `${base_url}/${IMAGES.imgplaceholder}`};
    const shopName = item.name || 'Shop';
    const rating = item.rating ?? 0.0;
    const reviews = item.reviews_count ?? 0;
    const productsCount = item.products_count ?? 0;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() => (navigation.navigate as any)('SellerDetails', { sellerId: item.seller_id,seller:item })}
      >
        <Image source={bannerSource} style={styles.bannerImage} />
        <View style={styles.avatarContainer}>
          <Image source={avatarSource} style={styles.avatar} />
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.shopName} numberOfLines={1}>{shopName}</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.ratingText}>{parseFloat(rating.toString()).toFixed(1)}</Text>
            <VectorIcon type="FontAwesome" name="star" size={13} color="#FFA500" style={{ marginLeft: 2 }} />
            <Text style={styles.ratingLabel}> {t('rating')}</Text>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statsBox}>
              <Text style={styles.statsNumber}>{reviews}</Text>
              <Text style={styles.statsLabel}>{t('reviews')}</Text>
            </View>
            <View style={styles.statsBox}>
              <Text style={styles.statsNumber}>{productsCount}</Text>
              <Text style={styles.statsLabel}>{t('products')}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <Loader fullScreen size="large" />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <VectorIcon
            size={24}
            type="AntDesign"
            name="left"
            color={COLORS.black}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('AllSellers')}</Text>
        <View style={styles.placeholder} />
      </View>
      <FlatList
        data={sellers}
        keyExtractor={item => item.id.toString()}
        renderItem={renderSeller}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 12 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f7fbff',
    flex: 1,
    paddingTop: 5,
  },
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

  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: COLORS.black,
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  bannerImage: {
    width: '100%',
    height: 50,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#e9ecef',
  },
  avatarContainer: {
    position: 'absolute',
    top: 28,
    left: CARD_WIDTH / 2 - 24,
    zIndex: 2,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 2,
    elevation: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e9ecef',
  },
  infoSection: {
    marginTop: 26,
    alignItems: 'center',
    paddingHorizontal: 8,
    flex: 1,
  },
  shopName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: COLORS.black,
    marginTop: 6,
    marginBottom: 2,
    textAlign: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 13,
    color: '#FFA500',
    fontWeight: 'bold',
  },
  ratingLabel: {
    fontSize: 12,
    color: COLORS.review,
    marginLeft: 3,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 4,
  },
  statsBox: {
    flex: 1,
    alignItems: 'center',
  },
  statsNumber: {
    fontWeight: 'bold',
    color: COLORS.black,
    fontSize: 14,
  },
  statsLabel: {
    color: COLORS.review,
    fontSize: 12,
    marginTop: 2,
  },
});

export default AllSellerScreen;
