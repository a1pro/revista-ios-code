/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useState } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { base_url, Base_Url } from '../../utils/ApiUrl';
import IMAGES from '../../assets/images';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { verticalScale } from '../../utils/Metrics';
const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.42;
const CARD_HEIGHT = 250;
type props = NativeStackScreenProps<RootStackParamList, 'TopSellers'>;
const TopSeller: React.FC<props> = () => {
  const [sellers, setSellers] = useState<any[]>([]);
  const [loadedBannerImages, setLoadedBannerImages] = useState<{ [key: number]: boolean }>({});
  const [loadedAvatarImages, setLoadedAvatarImages] = useState<{ [key: number]: boolean }>({});
  const navigation = useNavigation();
  const { t } = useTranslation();
  const fetchSellers = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
      const res = await axios.get(Base_Url.topseller, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (res.data) {
        setSellers(res.data);
      } else {
        setSellers([]);
      }
    } catch (error) {
      console.log('Error fetching sellers:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSellers();
    }, [])
  );

  const renderSeller = ({ item }: { item: any }) => {
    const bannerSource = item?.banner_path
      ? {
        uri: `${base_url}/${item?.banner_path
          }`
      }
      : IMAGES.imgplaceholder;

    const avatarSource = item.seller?.image_path
      ? { uri: `${base_url}/${item?.seller?.image_path}` }
      : IMAGES.imgplaceholder;

    const shopName = item.name || 'Shop';
    const rating = item.rating ?? 0.0;
    const reviews = item.reviews_count ?? 0;
    const productsCount = item.products_count ?? 0;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() => (navigation as any).navigate('SellerDetails', { seller: item })}
      >
        <View style={styles.bannerContainer}>
          <Image
            source={IMAGES.imgplaceholder}
            style={styles.bannerImage}
            resizeMode="cover"
          />

          <Image
            source={bannerSource}
            style={[
              styles.bannerImage,
              {
                position: 'absolute',
                opacity: loadedBannerImages[item.id] ? 1 : 0,
              },
            ]}
            resizeMode="cover"
            onLoad={() =>
              setLoadedBannerImages(prev => ({
                ...prev,
                [item.id]: true,
              }))
            }
          />
        </View>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarImageContainer}>
            <Image
              source={IMAGES.imgplaceholder}
              style={styles.avatar}
              resizeMode="cover"
            />

            <Image
              source={avatarSource}
              style={[
                styles.avatar,
                {
                  position: 'absolute',
                  opacity: loadedAvatarImages[item.id] ? 1 : 0,
                },
              ]}
              resizeMode="cover"
              onLoad={() =>
                setLoadedAvatarImages(prev => ({
                  ...prev,
                  [item.id]: true,
                }))
              }
            />
          </View>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.shopName} numberOfLines={1}>{shopName}</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.ratingText}>{parseFloat(rating).toFixed(1)}</Text>
            <VectorIcon type="FontAwesome" name="star" size={14} color="#FFA500" style={{ marginLeft: 2 }} />
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>{t('topSellers')}</Text>
        <TouchableOpacity style={styles.viewAllBtn} onPress={() => navigation.navigate('AllSellerScreen' as never)}>
          <Text style={styles.viewAllText}>{t('seeAll')}</Text>
          <VectorIcon
            size={20}
            type="Ionicons"
            name="arrow-forward"
            color={COLORS.btnbg }
            style={styles.viewAllIcon}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={sellers}
        keyExtractor={item => item?.id?.toString()}
        renderItem={renderSeller}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 6, paddingHorizontal: 8 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingTop: 8,
    paddingBottom: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  viewAllBtn: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row'
  },
  viewAllText: {
    color: COLORS.btnbg,
    fontWeight: '600',
    fontSize: 14,
    marginRight:verticalScale(4)
  },
   viewAllIcon: {
    marginLeft: 4,
  },
  arrow: {
    fontSize: 18,
    color: COLORS.btnbg,
    marginRight:verticalScale(-8)
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#f7fbff',
    borderRadius: 12,
    marginRight: 12,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  bannerContainer: {
  width: '100%',
  height: 70,
},

avatarImageContainer: {
  width: 54,
  height: 54,
  borderRadius: 27,
  overflow: 'hidden',
},
  bannerImage: {
    width: '100%',
    height: 70,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#e9ecef',
  },
  avatarContainer: {
    position: 'absolute',
    top: 38,
    left: CARD_WIDTH / 2 - 28,
    zIndex: 2,
    backgroundColor: COLORS.white,
    borderRadius: 28,
    padding: 2,
    elevation: 2,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#e9ecef',
  },
  infoSection: {
    marginTop: 36,
    alignItems: 'center',
    paddingHorizontal: 8,
    height: 100,
    justifyContent: 'space-around',
  },
  shopName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: COLORS.black,
    marginTop: 8,
    marginBottom: 2,
    textAlign: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 14,
    color: '#FFA500',
    fontWeight: 'bold',
  },
  ratingLabel: {
    fontSize: 13,
    color: COLORS.review,
    marginLeft: 3,
  },


  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 8,
  },

  statsBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsNumber: {
    fontWeight: 'bold',
    color: COLORS.black,
    fontSize: 15,
  },
  statsLabel: {
    color: COLORS.review,
    fontSize: 13,
    marginTop: 2,
  },
});

export default TopSeller;
