/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  SafeAreaView,
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

interface OrderDetailItem {
  order_status: string;
  id: number;
  product_id: number;
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

interface ReviewData {
  product_id: number;
  rating: number;
  comment: string;
  order_id: number;
}

const ProductReviewScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { t } = useTranslation();
  const orderData = route.params?.orderData || route.params;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<{ [key: number]: boolean }>({});
  const [reviews, setReviews] = useState<{ [key: number]: ReviewData }>({});
  const [submittedReviews, setSubmittedReviews] = useState<number[]>([]);
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

        return {
          id: item.id,
          product_id: item.product_id,
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
        order.order_status === 'delivered');
      
      setOrders(deliveredOrdersWithItems);
      const initialReviews: { [key: number]: ReviewData } = {};
      deliveredOrdersWithItems.forEach((order: Order) => {
        order.details.forEach((item: OrderDetailItem) => {
          initialReviews[item.product_id] = {
            product_id: item.product_id,
            order_id: order.id,
            rating: 0,
            comment: '',
          };
        });
      });

      setReviews(initialReviews);
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

  const handleRatingPress = (productId: number, rating: number) => {
    setReviews(prev => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || { product_id: productId, order_id: 0, rating: 0, comment: '' }),
        rating,
      },
    }));
  };

  const handleCommentChange = (productId: number, comment: string) => {
    setReviews(prev => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || { product_id: productId, order_id: 0, rating: 0, comment: '' }),
        comment,
      },
    }));
  };


  const submitReview = async (productId: number) => {
    const review = reviews[productId];
    if (review.rating === 0 || !review.comment.trim()) {
      Toast.show({
        type: 'error',
        text1: t('validation') || 'Validation Error',
        text2: t('validation22') || 'Please provide both rating and comment',
      });
      return;
    }

    setSubmitting(prev => ({ ...prev, [productId]: true }));

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Toast.show({
          type: 'error',
          text1: t('error') || 'Error',
          text2: t('noToken') || 'Please login again',
        });
        setSubmitting(prev => ({ ...prev, [productId]: false }));
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
          text2: t('reviewSubmitted'),
        });

        setSubmittedReviews(prev => [...prev, productId]);

        setReviews(prev => {
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
      setSubmitting(prev => ({ ...prev, [productId]: false }));
    }
  };

  const renderStars = (productId: number) => {
    const currentRating = reviews[productId]?.rating || 0;

    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map(star => (
          <TouchableOpacity
            key={star}
            onPress={() => handleRatingPress(productId, star)}
            disabled={submitting[productId] || submittedReviews.includes(productId)}
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
  const renderProductItem = ({ item }: { item: OrderDetailItem }) => {
    const review = reviews[item.product_id];
    const isSubmitted = submittedReviews.includes(item.product_id);
    const isSubmitting = submitting[item.product_id];

    if (isSubmitted) {
      return null;
    }
    return (
      <View style={styles.productCard}>
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
            {/* <Text style={styles.deliveryDate}>
              {t('Deliveredon')}: {new Date(item.delivery_date || '').toLocaleDateString()}
            </Text> */}
            {/* <Text style={styles.price}>${item.price.toFixed(2)}</Text> */}
          </View>
        </View>

        {/* Rating Section */}
        <View style={styles.ratingSection}>
          <Text style={styles.sectionTitle}>{t('rateProduct') || 'Rate this product'}</Text>
          {renderStars(item.product_id)}
        </View>

        {/* Comment Section */}
        <View style={styles.commentSection}>
          <Text style={styles.sectionTitle}>{t('writeReview')}</Text>
          <TextInput
            style={styles.commentInput}
            placeholder={t('reviewPlaceholder')}
            placeholderTextColor={COLORS.placeholder}
            multiline
            numberOfLines={4}
            value={review?.comment || ''}
            onChangeText={(text) => handleCommentChange(item.product_id, text)}
            editable={!isSubmitting && !isSubmitted}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            (review?.rating === 0 || !review?.comment?.trim()) && styles.submitButtonDisabled,
          ]}
          onPress={() => submitReview(item.product_id)}
          disabled={review?.rating === 0 || !review?.comment?.trim() || isSubmitting}
        >
          {isSubmitting ? (
            <Loader size="small" />
          ) : (
            <Text style={styles.submitButtonText}>{t('submit')}</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };
  // Render order section
  const renderOrderSection = ({ item: order }: { item: Order }) => {
    const unreviewedItems = order.details.filter(item =>
      !submittedReviews.includes(item.product_id)
    );

    if (unreviewedItems.length === 0) {
      return null;
    }

    return (
      <View style={styles.orderSection}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderNumber}>{t('ordernum')} {order.order_number}</Text>
          <Text style={styles.deliveryStatus}>
            {t('status')} {order.order_status}
          </Text>
          <Text>
            {new Date(order.created_at).toLocaleDateString()}
          </Text>
        </View>

        <FlatList
          data={unreviewedItems}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.product_id.toString()}
          scrollEnabled={false}
          contentContainerStyle={styles.orderItemsContainer}
        />
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Loader size="large"  />
        <Text style={styles.loadingText}>{t('Loadingreviews')}</Text>
      </SafeAreaView>
    );
  }

  const hasDeliveredOrders = orders.length > 0;
  const hasUnreviewedProducts = Object.keys(reviews).length > 0;

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
      {!hasDeliveredOrders || !hasUnreviewedProducts ? (
        <View style={styles.emptyContainer}>
          <Icon name="rate-review" size={80} color="#CCCCCC" />
          <Text style={styles.emptyTitle}>
            {orderData?.order_status === 'delivered'
              ? (t('noReviewsPending'))
              : (t('deliveredPanding'))
            }
          </Text>
          <Text style={styles.emptyMessage}>
            {orderData?.order_status === 'delivered' && hasUnreviewedProducts === false
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
        <>
          {/* Orders List */}
          <FlatList
            data={orders}
            renderItem={renderOrderSection}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[COLORS.appColor]}
              />
            }
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Icon name="rate-review" size={80} color="#CCCCCC" />
                <Text style={styles.emptyTitle}>
                  {t('allReviewsSubmitted')}
                </Text>
                <Text style={styles.emptyMessage}>
                  {t('thankYouForReviews')}
                </Text>
              </View>
            }
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default ProductReviewScreen;
