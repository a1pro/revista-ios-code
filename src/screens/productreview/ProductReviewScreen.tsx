
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import COLORS from '../../utils/Colors';
import styles from './style';
import { Base_Url, base_url } from '../../utils/ApiUrl';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../components/Loader';
import { SafeAreaView } from 'react-native-safe-area-context';
import SellerReviewModal from '../../components/sellerReview/SellerReviewModal';

interface OrderDetailItem {
  id: number;
  product_id: number;
  seller_id: number;
  product_details: string;
  qty: number;
  price: number;
  delivery_status: string;
  delivery_date?: string;
  product: {
    name: string;
    thumbnail: string;
    images?: string;
  };
  seller?: {
    id: number;
    name: string;
  };
}

interface Order {
  id: number;
  order_number: string;
  order_status: string;
  order_amount: number;
  details: OrderDetailItem[];
  created_at: string;
  expected_delivery_date?: string;
}

interface ProductReviewData {
  product_id: number;
  rating: number;
  comment: string;
  order_id: number;
  seller_id: number;
}

interface SellerReviewData {
  seller_id: number;
  rating: number;
  message: string;
  order_id: number;
  product_ids: number[];
}

const ProductReviewScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { t } = useTranslation();
  const orderData = route.params?.orderData || route.params;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<{ [key: string]: boolean }>({});
  
  // Product reviews state
  const [productReviews, setProductReviews] = useState<{ [key: number]: ProductReviewData }>({});
  const [submittedProductReviews, setSubmittedProductReviews] = useState<number[]>([]);
  
  // Seller reviews state
  const [sellerReviews, setSellerReviews] = useState<{ [key: number]: SellerReviewData }>({});
  const [submittedSellerReviews, setSubmittedSellerReviews] = useState<{ [key: number]: boolean }>({});
  const [sellerReviewData, setSellerReviewData] = useState<{ [key: number]: { rating: number; message: string } }>({});
  
  // Track which products are associated with which sellers for review grouping
  const [sellerProductMap, setSellerProductMap] = useState<{ [sellerId: number]: number[] }>({});
  
  // Modal state for seller review - single product
  const [sellerModalVisible, setSellerModalVisible] = useState<boolean>(false);
  const [selectedSeller, setSelectedSeller] = useState<{
    id: number;
    name: string;
    productId: number;
  } | null>(null);

  const transformOrderData = (data: any): Order[] => {
    if (!data || !data.details) {
      return [];
    }

    const order: Order = {
      id: data.id,
      order_number: `${data.id}`,
      order_status: data.order_status,
      order_amount: data.order_amount,
      details: data.details.map((item: any) => {
        
        const productDetails = (item.product);
        const sellerId = item.seller_id || item.product?.seller_id || 0;
        
        return {
          id: item.id,
          product_id: item.product_id,
          seller_id: sellerId,
          product_details: item.product_details,
          qty: item.qty,
          price: item.price,
          delivery_status: item.delivery_status,
          delivery_date: item.delivery_date,
          product: {
            name: productDetails.name || 'Unknown Product',
            thumbnail: productDetails.thumbnail ? `${productDetails.thumbnail}` : '',
            images: item.product?.thum,
          },
          seller: {
            id: sellerId,
            name: item.seller?.name || item.product?.seller?.name || `Seller ${sellerId}`,
          }
        };
      }),
      created_at: data.created_at,
      expected_delivery_date: data.expected_delivery_date,
    };

    return [order];
  };

  const loadOrderData = () => {
    try {
      setLoading(true);
      const transformedOrders = transformOrderData(orderData.order);
      const deliveredOrdersWithItems = transformedOrders.filter((order: Order) =>
        order.order_status === 'delivered'
      );

      setOrders(deliveredOrdersWithItems);
      
      // Initialize reviews and track seller-product relationships
      const initialProductReviews: { [key: number]: ProductReviewData } = {};
      const initialSellerReviews: { [key: number]: SellerReviewData } = {};
      const sellerProductMapTemp: { [sellerId: number]: number[] } = {};
      const initialSellerReviewData: { [key: number]: { rating: number; message: string } } = {};
      
      deliveredOrdersWithItems.forEach((order: Order) => {
        order.details.forEach((item: OrderDetailItem) => {
          const sellerId = item.seller_id;
          
          // Product review
          initialProductReviews[item.product_id] = {
            product_id: item.product_id,
            order_id: order.id,
            seller_id: sellerId,
            rating: 0,
            comment: '',
          };
          
          // Track product-seller relationship
          if (!sellerProductMapTemp[sellerId]) {
            sellerProductMapTemp[sellerId] = [];
          }
          if (!sellerProductMapTemp[sellerId].includes(item.product_id)) {
            sellerProductMapTemp[sellerId].push(item.product_id);
          }
          
          // Initialize seller review only once per seller
          if (!initialSellerReviews[sellerId]) {
            initialSellerReviews[sellerId] = {
              seller_id: sellerId,
              order_id: order.id,
              rating: 0,
              message: '',
              product_ids: [],
            };
            initialSellerReviewData[sellerId] = {
              rating: 0,
              message: '',
            };
          }
          initialSellerReviews[sellerId].product_ids.push(item.product_id);
        });
      });

      setProductReviews(initialProductReviews);
      setSellerReviews(initialSellerReviews);
      setSellerProductMap(sellerProductMapTemp);
      setSellerReviewData(initialSellerReviewData);
      
    } catch (error) {
      console.error('Error loading order data:', error);
      Toast.show({
        type: 'error',
        text1: t('fetchError') || 'Error',
        text2: t('fetchError') || 'Failed to load orders. Please try again.',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (orderData) {
      const timer = setTimeout(() => {
        loadOrderData();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [orderData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    const timer = setTimeout(() => {
      loadOrderData();
    }, 1000);
    return () => clearTimeout(timer);
  }, [orderData]);

  // Product Review Handlers
  const handleProductRatingPress = (productId: number, rating: number) => {
    setProductReviews(prev => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || { product_id: productId, order_id: 0, seller_id: 0, rating: 0, comment: '' }),
        rating,
      },
    }));
  };

  const handleProductCommentChange = (productId: number, comment: string) => {
    setProductReviews(prev => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || { product_id: productId, order_id: 0, seller_id: 0, rating: 0, comment: '' }),
        comment,
      },
    }));
  };

  // Submit Product Review
  const submitProductReview = async (productId: number) => {
    const review = productReviews[productId];
    if (review.rating === 0 || !review.comment.trim()) {
      Toast.show({
        type: 'error',
        text1: t('validation') || 'Validation Error',
        text2: t('validation22') || 'Please provide both rating and comment for the product',
      });
      return;
    }

    const submitKey = `product_${productId}`;
    setSubmitting(prev => ({ ...prev, [submitKey]: true }));

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Toast.show({
          type: 'error',
          text1: t('error') || 'Error',
          text2: t('noToken') || 'Please login again',
        });
        setSubmitting(prev => ({ ...prev, [submitKey]: false }));
        return;
      }

      const payload = {
        product_id: productId,
        comment: review.comment,
        rating: review.rating,
      };

      const res = await axios.post(
        Base_Url.submitreview,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      
      if (res.data && res.data.message === 'Successfully submitted review!') {
        Toast.show({
          type: 'success',
          text1: t('success') || 'Success',
          text2: t('reviewSubmitted') || 'Product review submitted successfully!',
        });

        setSubmittedProductReviews(prev => [...prev, productId]);
        setProductReviews(prev => {
          const newReviews = { ...prev };
          delete newReviews[productId];
          return newReviews;
        });
      } else {
        Toast.show({
          type: 'error',
          text1: t('error') || 'Error',
          text2: res.data.message || t('failedreview') || 'Failed to submit review',
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.message || t('errorsubmit') || 'Error submitting review',
      });
    } finally {
      setSubmitting(prev => ({ ...prev, [submitKey]: false }));
    }
  };

  // Open Seller Review Modal - Single Product
  const openSellerReviewModal = (sellerId: number, sellerName: string, productId: number) => {
    setSelectedSeller({
      id: sellerId,
      name: sellerName,
      productId: productId, // Single product ID
    });
    setSellerModalVisible(true);
  };

  // Close Seller Review Modal
  const closeSellerReviewModal = () => {
    setSellerModalVisible(false);
    setSelectedSeller(null);
  };

  // Handle successful seller review submission
  const handleSellerReviewSuccess = () => {
    // Refresh the data to update the UI
    loadOrderData();
  };

  // Check if seller review should be shown
  const shouldShowSellerReview = (sellerId: number): boolean => {
    // Check if seller review is already submitted
    if (submittedSellerReviews[sellerId]) {
      return false;
    }
    
    // Check if there are any unreviewed products from this seller
    const productIds = sellerProductMap[sellerId] || [];
    const hasUnreviewedProducts = productIds.some(id => !submittedProductReviews.includes(id));
    
    return hasUnreviewedProducts;
  };

  // Check if seller review is already given
  const isSellerReviewSubmitted = (sellerId: number): boolean => {
    return submittedSellerReviews[sellerId] || false;
  };

  // Get seller review data for display
  const getSellerReviewDisplay = (sellerId: number) => {
    if (submittedSellerReviews[sellerId] && sellerReviewData[sellerId]) {
      return sellerReviewData[sellerId];
    }
    return null;
  };

  // Render Product Stars
  const renderProductStars = (productId: number) => {
    const currentRating = productReviews[productId]?.rating || 0;
    const submitKey = `product_${productId}`;
    const isSubmitting = submitting[submitKey] || false;
    const isSubmitted = submittedProductReviews.includes(productId);

    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map(star => (
          <TouchableOpacity
            key={star}
            onPress={() => handleProductRatingPress(productId, star)}
            disabled={isSubmitting || isSubmitted}
          >
            <Icon
              name={star <= currentRating ? 'star' : 'star-border'}
              size={30}
              color={star <= currentRating ? COLORS.star : '#CCCCCC'}
              style={styles.starIcon}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Render Individual Product Item
  const renderProductItem = ({ item }: { item: OrderDetailItem }) => {
    const productReview = productReviews[item.product_id];
    const isProductSubmitted = submittedProductReviews.includes(item.product_id);
    const sellerId = item.seller_id;
    const isSellerSubmitted = isSellerReviewSubmitted(sellerId);
    const submitProductKey = `product_${item.product_id}`;
    const isSubmittingProduct = submitting[submitProductKey] || false;

    // If product review is submitted, don't show it
    if (isProductSubmitted) {
      return null;
    }

    // Check if seller review should be shown (only on the first product of each seller)
    const showSellerReview = shouldShowSellerReview(sellerId);
    const sellerReviewDisplay = getSellerReviewDisplay(sellerId);
    return (
      <View style={styles.productCard}>
        {/* Product Header */}
        <View style={styles.productHeader}>
          <Image
            source={{
              uri: `${base_url}/${item.product.thumbnail}`,
            }}
            style={styles.productImage}
            resizeMode="cover"
          />
          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={2}>
              {item.product.name}
            </Text>
            <Text style={styles.orderInfo}>
              Order #{orderData?.id} • Qty: {item.qty}
            </Text>
            {item.seller && (
              <Text style={styles.sellerName}>
                {t('seller')}: {item.seller.name}
              </Text>
            )}
            <Text style={styles.productStatus}>
              {t('status')}: {item.delivery_status}
            </Text>
          </View>
        </View>

        {/* Product Rating Section */}
        <View style={styles.ratingSection}>
          <Text style={styles.sectionTitle}>
            {t('rateProduct') || 'Rate this product'}
          </Text>
          {renderProductStars(item.product_id)}
        </View>

        {/* Product Comment Section */}
        <View style={styles.commentSection}>
          <Text style={styles.sectionTitle}>{t('writeReview')}</Text>
          <TextInput
            style={styles.commentInput}
            placeholder={t('reviewPlaceholder') || 'Write your product review...'}
            placeholderTextColor={COLORS.placeholder}
            multiline
            numberOfLines={3}
            value={productReview?.comment || ''}
            onChangeText={(text) => handleProductCommentChange(item.product_id, text)}
            editable={!isSubmittingProduct}
          />
        </View>

        {/* Product Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            (productReview?.rating === 0 || !productReview?.comment?.trim()) && styles.submitButtonDisabled,
          ]}
          onPress={() => submitProductReview(item.product_id)}
          disabled={productReview?.rating === 0 || !productReview?.comment?.trim() || isSubmittingProduct}
        >
          {isSubmittingProduct ? (
            <Loader size="small" />
          ) : (
            <Text style={styles.submitButtonText}>
              {t('submitProductReview')}
            </Text>
          )}
        </TouchableOpacity>

        {/* Seller Review Section - Show rate seller button or submitted review */}
        <View style={styles.divider} />
        
        {isSellerSubmitted && sellerReviewDisplay ? (
          // Show submitted seller review
          <View style={styles.sellerReviewContainer}>
            <View style={styles.sellerReviewHeader}>
              <Text style={styles.sellerReviewTitle}>
                {t('sellerReview') || `Seller: ${item.seller?.name || 'Seller'}`}
              </Text>
              <View style={styles.submittedBadge}>
                <Text style={styles.submittedBadgeText}>{t('submitted')}</Text>
              </View>
            </View>
            {/* <View style={styles.sellerReviewStars}>
              {[1, 2, 3, 4, 5].map(star => (
                <Icon
                  key={star}
                  name={star <= sellerReviewDisplay.rating ? 'star' : 'star-border'}
                  size={20}
                  color={star <= sellerReviewDisplay.rating ? COLORS.star : '#CCCCCC'}
                  style={styles.starIcon}
                />
              ))}
            </View> */}
            <Text style={styles.sellerReviewMessage}>
              {sellerReviewDisplay.message}
            </Text>
          </View>
        ) : showSellerReview ? (
          // Show rate seller button - Pass single product ID
          <View style={styles.sellerReviewContainer}>
            <View style={styles.sellerReviewHeader}>
              <Text style={styles.sellerReviewTitle}>
                {t('rateSeller')}
              </Text>
              
            </View>
            <TouchableOpacity
              style={styles.rateSellerButton}
              onPress={() => openSellerReviewModal(sellerId, item.seller?.name || 'Seller', item.product_id)}
            >
              <Icon name="rate-review" size={24} color={COLORS.white} />
              <Text style={styles.rateSellerButtonText}>
                {t('rateSellerNow') }
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Seller review already completed for this seller
          <View style={styles.sellerReviewContainer}>
            <Text style={styles.sellerReviewCompleted}>
              {t('sellerReviewCompleted') || '✓ Seller review completed'}
            </Text>
          </View>
        )}
      </View>
    );
  };

  // Group products by seller for better organization
  const getGroupedProducts = (order: Order) => {
    const grouped: { [sellerId: number]: OrderDetailItem[] } = {};
    
    order.details.forEach(item => {
      if (!grouped[item.seller_id]) {
        grouped[item.seller_id] = [];
      }
      grouped[item.seller_id].push(item);
    });
    
    return grouped;
  };

  // Render Order Section
  const renderOrderSection = ({ item: order }: { item: Order }) => {
    const groupedProducts = getGroupedProducts(order);
    const allProducts = order.details;
    
    // Check if all products are reviewed
    const allProductsReviewed = allProducts.every(item => 
      submittedProductReviews.includes(item.product_id)
    );
    
    // Check if all seller reviews are submitted
    const allSellerReviewsSubmitted = Object.keys(groupedProducts).every(sellerId => 
      submittedSellerReviews[parseInt(sellerId)] || 
      allProducts.every(item => submittedProductReviews.includes(item.product_id))
    );

    // If everything is reviewed, don't show this order
    if (allProductsReviewed && allSellerReviewsSubmitted) {
      return null;
    }

    return (
      <View style={styles.orderSection}>
        <View style={styles.orderHeader}>
          <View style={styles.orderHeaderLeft}>
            <Text style={styles.orderNumber}>
              {t('ordernum')} {order.order_number}
            </Text>
            <Text style={styles.orderDate}>
              {new Date(order.created_at).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.orderStatusBadge}>
            <Text style={styles.orderStatusText}>
              {order.order_status.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Show products grouped by seller */}
        <View style={styles.productsContainer}>
          {Object.entries(groupedProducts).map(([sellerId, products]) => {
            const seller = products[0]?.seller;
            const sellerIdNum = parseInt(sellerId);
            const isSellerReviewSubmitted = submittedSellerReviews[sellerIdNum];
            
            // Check if all products from this seller are reviewed
            const allSellerProductsReviewed = products.every(p => 
              submittedProductReviews.includes(p.product_id)
            );
            
            // If seller review is submitted OR all products are reviewed, skip this seller group
            if (isSellerReviewSubmitted || allSellerProductsReviewed) {
              return null;
            }
            
            return (
              <View key={sellerId} style={styles.sellerGroup}>
                <View style={styles.sellerGroupHeader}>
                  <Icon name="store" size={20} color={COLORS.btnbg} />
                  <Text style={styles.sellerGroupTitle}>
                    {seller?.name || `Seller ${sellerId}`}
                  </Text>
                  <Text style={styles.sellerGroupCount}>
                    {products.length} {t('products') || 'products'}
                  </Text>
                </View>
                
                {products.map(product => (
                  <View key={product.product_id}>
                    {renderProductItem({ item: product })}
                  </View>
                ))}
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Loader size="large" />
        <Text style={styles.loadingText}>{t('Loadingreviews')}</Text>
      </SafeAreaView>
    );
  }

  const hasDeliveredOrders = orders.length > 0;
  const hasUnreviewedItems = Object.keys(productReviews).length > 0 || Object.keys(sellerReviews).length > 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('productReviews')}</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Empty State */}
      {!hasDeliveredOrders || !hasUnreviewedItems ? (
        <View style={styles.emptyContainer}>
          <Icon name="rate-review" size={80} color="#CCCCCC" />
          <Text style={styles.emptyTitle}>
            {orderData?.order_status === 'delivered'
              ? (t('noReviewsPending'))
              : (t('deliveredPanding'))
            }
          </Text>
          <Text style={styles.emptyMessage}>
            {orderData?.order_status === 'delivered' && !hasUnreviewedItems
              ? (t('allReviewsSubmitted'))
              : orderData?.order_status === 'delivered'
                ? (t('noReviewsMessage'))
                : (t('productnotdelivered'))
            }
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.browseButtonText}>{t('backToorders')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderSection}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.btnbg]}
            />
          }
          contentContainerStyle={styles.listContainer}
        />
      )}

      {/* Seller Review Modal - Pass single product ID */}
      <SellerReviewModal  
        visible={sellerModalVisible}
        onClose={closeSellerReviewModal}
        productId={selectedSeller?.productId || 0} 
        sellerId={selectedSeller?.id || 0}
        sellerName={selectedSeller?.name || 'Seller'}
        onSuccess={handleSellerReviewSuccess}
      />
    </SafeAreaView>
  );
};

export default ProductReviewScreen;