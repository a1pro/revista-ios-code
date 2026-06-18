/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  Dimensions,
  ScrollView,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import VectorIcon from '../../components/VectorIcon';
import COLORS from '../../utils/Colors';
import IMAGES from '../../assets/images';
import { t } from 'i18next';
import { base_url } from '../../utils/ApiUrl';

const { width, height } = Dimensions.get('window');
const BANNER_HEIGHT = 180;

const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Toys'];
const sortOptions = [
  'Latest',
  'Low to High Price',
  'High to Low Price',
  'A to Z Order',
  'Z to A Order',
];

type Seller = {
  product_list: never[];
  banner_path: any;
  name: string;
  banner?: string;
  seller?: {
    image_path: any; image?: string
  };
  rating?: number;
  reviews_count?: number;
  orders_count?: number;
};

type RouteParams = {
  seller: Seller;
};

const SellerDetails: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const seller = route.params?.seller;
  const [categoryModal, setCategoryModal] = useState(false);
  const [sortModal, setSortModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSort, setSelectedSort] = useState('');
  const [search, setSearch] = useState('');
  const [chatModal, setChatModal] = useState(false);
  const [message, setMessage] = useState('');

  const bannerSource = seller?.banner
    ? {
      uri: `${base_url}/${seller.banner_path
        }`,
    }
    : IMAGES.imgplaceholder;

  const avatarSource = seller?.seller?.image
    ? {
      uri: `${base_url}/${seller.seller.image_path
        }`,
    }
    : IMAGES.imgplaceholder;

  const handleSendMessage = () => {
    setChatModal(false);
    setMessage('');
    // Optionally, navigate to chat screen
    (navigation as any).navigate('Inbox');
  };
const renderProduct = ({item}: any) => {
  
  return (
    <TouchableOpacity style={styles.productCard}>
      <Image source={{uri: `${base_url}/${item?.thumbnail}`}} style={styles.productImage} />

      <Text numberOfLines={2} style={styles.productName}>
        {item?.name}
      </Text>

      <Text style={styles.productPrice}>
        ﷼{item?.unit_price ?? 0}
      </Text>
    </TouchableOpacity>
  );
};
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f6f8fa' }}>
      <View style={{ flex: 1, backgroundColor: '#fcfdff' }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}>
            <VectorIcon
              type="Ionicons"
              name="arrow-back"
              size={24}
              color={COLORS.black}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('SellerDetails')}</Text>
          <View style={{ width: 32 }} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search products from this seller"
            value={search}
            onChangeText={setSearch}
          />
          <VectorIcon type="Feather" name="search" size={18} color="#888" />
        </View>

        {/* Banner */}
        <View>
          <Image source={bannerSource} style={styles.bannerImage} />
          <View style={styles.sellerCard}>
            <Image source={avatarSource} style={styles.avatar} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.sellerName}>{seller?.name ?? 'Shop'}</Text>
              <View style={styles.ratingRow}>
                <VectorIcon
                  type="FontAwesome"
                  name="star"
                  size={14}
                  color="#FFA500"
                />
                <Text style={styles.ratingText}>
                  {seller?.rating?.toFixed(1) ?? '0.0'}
                </Text>
                <Text style={styles.reviewsText}>
                  ({seller?.reviews_count ?? 0} {t('reviews')})
                </Text>
              </View>
              <Text style={styles.ordersText}>
                {seller?.orders_count ?? 0} {t('orders')}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.chatBtn}
              onPress={() => setChatModal(true)}>
              <VectorIcon
                type="MaterialIcons"
                name="chat"
                size={18}
                color="#333"
              />
              <Text style={styles.chatBtnText}>{t('chat')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Filter Row */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setCategoryModal(true)}>
            <VectorIcon
              type="MaterialIcons"
              name="category"
              size={18}
              color="#888"
            />
            <Text style={styles.filterButtonText}>
              {selectedCategory ? selectedCategory : 'Category'}
            </Text>
            <VectorIcon
              type="Entypo"
              name="chevron-down"
              size={16}
              color="#888"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setSortModal(true)}>
            <VectorIcon
              type="MaterialIcons"
              name="sort"
              size={18}
              color="#888"
            />
            <Text style={styles.filterButtonText}>
              {selectedSort ? selectedSort : 'Sort By'}
            </Text>
            <VectorIcon
              type="Entypo"
              name="chevron-down"
              size={16}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        {/* Chat Modal */}
        <Modal animationType="slide" transparent={true} visible={chatModal}>
          <View style={styles.modalContainer}>
            <View style={styles.chatModalContent}>
              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => setChatModal(false)}>
                <VectorIcon
                  type="Ionicons"
                  name="close"
                  size={24}
                  color="#333"
                />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{t('sendmsgtovandor')}</Text>
              <TextInput
                style={styles.messageInput}
                placeholder="Type your message..."
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={4}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.goToChatButton]}
                  onPress={() => {
                    setChatModal(false);
                    (navigation.navigate as any)('ChatScreen', { user: { ...seller } });
                  }}>
                  <Text style={styles.modalButtonText}>{t('GotoChatBox')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.sendButton]}
                  onPress={handleSendMessage}>
                  <Text style={styles.modalButtonText}>{t('Send')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Category Modal */}
        <Modal visible={categoryModal} transparent animationType="fade">
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setCategoryModal(false)}
            activeOpacity={1}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{t('allCategories')}</Text>
              <ScrollView>
                {categories.map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={styles.modalItem}
                    onPress={() => {
                      setSelectedCategory(cat);
                      setCategoryModal(false);
                    }}>
                    <Text style={styles.modalItemText}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Sort Modal */}
        <Modal visible={sortModal} transparent animationType="fade">
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setSortModal(false)}
            activeOpacity={1}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{t('SortBy')}</Text>
              <ScrollView>
                {sortOptions.map(opt => (
                  <TouchableOpacity
                    key={opt}
                    style={styles.modalItem}
                    onPress={() => {
                      setSelectedSort(opt);
                      setSortModal(false);
                    }}>
                    <Text style={styles.modalItemText}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Placeholder */}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <FlatList
    data={seller?.product_list || []}
    renderItem={renderProduct}
    keyExtractor={(item:any, index) => item?.id?.toString() || index.toString()}
    numColumns={2}
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{padding: 12}}

    ListEmptyComponent={() => (
      <View style={{alignItems: 'center', marginTop: 40}}>
        <Text style={{color: '#999', fontSize: 16}}>
          No products available
        </Text>
      </View>
    )}
  />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    backgroundColor: COLORS.white,
    elevation: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  backBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginHorizontal: 14,
    marginTop: 14,
    marginBottom: 10,
    elevation: 1,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.black,
    marginRight: 8,
  },
  bannerImage: {
    width: width,
    height: BANNER_HEIGHT,
    backgroundColor: '#e9ecef',
  },
  sellerCard: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: BANNER_HEIGHT - 36,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    elevation: 3,
    shadowColor: COLORS.black,
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#e9ecef',
  },
  sellerName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  ratingText: {
    fontSize: 14,
    color: '#FFA500',
    fontWeight: 'bold',
    marginLeft: 3,
  },
  reviewsText: {
    fontSize: 13,
    color: COLORS.review,
    marginLeft: 6,
  },
  ordersText: {
    fontSize: 13,
    color: COLORS.review,
    marginTop: 2,
  },
  chatBtn: {
    backgroundColor: COLORS.btnTxt,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginLeft: 10,
  },
  chatBtnText: {
    marginLeft: 4,
    color: COLORS.reviewcmt,
    fontWeight: '600',
    fontSize: 14,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 14,
    marginTop: 56,
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginTop: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    elevation: 1,
    minWidth: 130,
    justifyContent: 'center',
  },
  filterButtonText: {
    fontSize: 15,
    color: COLORS.black,
    marginHorizontal: 6,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.09)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingVertical: 8,
    width: 220,
    elevation: 4,
    maxHeight: 340,
  },
  modalItem: {
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  modalItemText: {
    fontSize: 15,
    color: COLORS.black,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  chatModalContent: {
    width: width,
    height: height * 0.5,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalClose: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 17,
    color: COLORS.black,
    marginBottom: 12,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: COLORS.placeholder,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  goToChatButton: {
    backgroundColor: COLORS.placeholder,
  },
  sendButton: {
    backgroundColor: COLORS.appColor,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  productCard: {
  flex: 1,
  backgroundColor: COLORS.white,
  margin: 6,
  borderRadius: 10,
  padding: 10,
  elevation: 2,
},

productImage: {
  width: '100%',
  height: 120,
  borderRadius: 8,
  marginBottom: 6,
},

productName: {
  fontSize: 14,
  color: COLORS.black,
  fontWeight: '500',
},

productPrice: {
  fontSize: 15,
  color: COLORS.appColor,
  fontWeight: 'bold',
  marginTop: 4,
},
});

export default SellerDetails;
