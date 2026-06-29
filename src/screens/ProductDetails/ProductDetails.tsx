
// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react-native/no-inline-styles */
// /* eslint-disable eqeqeq */
// /* eslint-disable react/no-unstable-nested-components */

// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   ScrollView,
//   TextInput,
//   Modal,
//   Dimensions,
// } from 'react-native';
// import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
// import { Gesture, GestureDetector } from 'react-native-gesture-handler';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../../types';
// import IMAGES from '../../assets/images';
// import VectorIcon from '../../components/VectorIcon';
// import COLORS from '../../utils/Colors';
// import { addCartItem } from '../../redux/slice/cartSlice';
// import { useDispatch } from 'react-redux';
// import { addFavourite, removeFavourite } from '../../redux/slice/favouriteSlice';
// import { AppDispatch } from '../../redux/store';
// import { base_url, Base_Url } from '../../utils/ApiUrl';
// import { useFocusEffect } from '@react-navigation/native';
// import Toast from 'react-native-toast-message';
// import { useTranslation } from 'react-i18next';
// import Loader from '../../components/Loader';
// import ImageViewer from 'react-native-image-zoom-viewer';
// import { isUserPremium, primeicon } from '../../utils/premimumuser';
// import Subscriptionstyle from '../../components/Subscriptionstyle';
// import style from './style';
// import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
// import SafeImage from '../../components/SafeImage';

// interface prime {
//   id: number;
//   general_icon: {
//     icon: string;
//     title: string;
//   };
//   prime_icon: {
//     icon: string;
//     title: string;
//   };
// }

// type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetails'>;

// const ProductDetails: React.FC<Props> = ({ route, navigation }) => {
//   const insets = useSafeAreaInsets();
//   const { width } = Dimensions.get('window');
//   const { product } = route.params as any;
//   const dispatch = useDispatch<AppDispatch>();
//   const [similarProducts, setSimilarProducts] = useState([]);
//   const [similarLoading, setSimilarLoading] = useState(false);
//   const [quantity, setQuantity] = useState<number>(1);
//   const [ispremimum, setispremimum] = useState<boolean>(false);
//   const [wishlistLoading, setWishlistLoading] = useState(false);
//   const [cartLoading, setCartLoading] = useState(false);
//   const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
//   const [isReviewsModalVisible, setIsReviewsModalVisible] = useState(false);
//   const [reviewRating, setReviewRating] = useState(0);
//   const [reviewComment, setReviewComment] = useState('');
//   const [submittingReview, setSubmittingReview] = useState(false);
//   const [reviews, setReviews] = useState([]);
//   const [reviewsLoading, setReviewsLoading] = useState(false);
//   const [isImageModalVisible, setIsImageModalVisible] = useState(false);
//   const [imageResetId, setImageResetId] = useState(0);
//   const [selectedColor, setSelectedColor] = useState<string | null>(null);
//   const [selectedSize, setSelectedSize] = useState<string | null>(null);
//   const [fullViewImage, setfullViewImage] = useState<boolean>(false);
//   const [currentIndex, setCurrentIndex] = useState<number>(0);
//   const [icon, setprimeicon] = useState<prime | null>(null);
//   const [isFavoriteLocal, setIsFavoriteLocal] = useState(false);
//   const [loaded, setLoaded] = useState<boolean>(false);
  
//   const { t } = useTranslation();
//   const primeIcon = async () => {
//     const prime = await primeicon();
//     setprimeicon(prime.data[0]);
//   };
  
//   // console.log(product)
//   const isFavorite = isFavoriteLocal;
//   const getAllImages = () => {
//     let arr: string[] = [];

//     if (selectedColor && product?.color_image?.length > 0) {
//       const colorMatch = product.color_image.find((ci: { color: string; }) =>
//         ci.color.replace('#', '').toUpperCase() ===
//         selectedColor.replace('#', '').toUpperCase()
//       );

//       if (colorMatch?.image_name) {
//         arr.push(`${base_url}/${colorMatch.image_name}`);
//       }
//     }

//     if (Array.isArray(product?.images) && product.images.length > 0) {
//       product.images.forEach((img: any) => {
//         arr.push(`${base_url}/${img}`);
//       });
//     }

//     if (arr.length === 0 && product.thumbnail) {
//       arr.push(`${base_url}/${product.thumbnail}`)
//     }

//     return arr;
//   };
//   // console.log(product)
//   const rating =
//     Array.isArray(product?.rating) && product?.rating?.length > 0
//       ? Number(product?.rating[0]?.average) || 0
//       : 0;
//   const reviewsCount = product?.reviews_count || 0;

//   const handleQuantityChange = (type: 'inc' | 'dec') => {
//     setQuantity(q => (type === 'inc' ? q + 1 : q > 1 ? q - 1 : 1));
//   };
//   //  check validation for add to cart and WishList
//   const checkvalidate = () => {
//     if (
//       product?.choice_options?.length > 0 &&
//       product?.choice_options[0]?.options?.length > 0 &&
//       !selectedSize
//     ) {
//       Toast.show({
//         type: 'error',
//         text1: t('error'),
//         text2: t('sizeselecterror'),
//       });
//       return false;
//     }

//     if (
//       product?.colors_formatted?.length > 0 &&
//       !selectedColor
//     ) {
//       Toast.show({
//         type: 'error',
//         text1: t('error'),
//         text2: t('colorselecterror'),
//       });
//       return false;
//     }

//     return true;
//   };

//   useEffect(() => {
//     const fetchSimilarProducts = async () => {
//       try {
//         setSimilarLoading(true);
//         const token = await AsyncStorage.getItem('token');
//         if (!token) {
//           Toast.show({
//             type: 'error',
//             text1: t('error'),
//             text2: t('noToken'),
//           });
//           setSimilarLoading(false);
//           return;
//         }
//         const res = await axios.get(
//           `${Base_Url.relatedproduct}/${product.id}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           },
//         );
//         setSimilarProducts(res.data || []);
//       } catch (error) {
//         setSimilarProducts([]);
//       } finally {
//         setSimilarLoading(false);
//       }
//     };

//     if (product?.id) {
//       fetchSimilarProducts();
//     }
//     primeIcon();
//   }, [product.id, t]);

//   const handleAddToWishlist = async () => {
//     if (!checkvalidate()) return;
//     try {
//       setWishlistLoading(true);
//       const token = await AsyncStorage.getItem('token');
//       if (!token) {
//         Toast.show({
//           type: 'error',
//           text1: t('error'),
//           text2: t('noToken'),
//         });
//         setWishlistLoading(false);
//         return;
//       }
//       const formData = new FormData();
//       formData.append('product_id', product.id.toString());
//       if (selectedSize) {
//         formData.append('size', selectedSize);
//       }
//       if (selectedColor) {
//         formData.append('color', selectedColor);
//       }
//       console.log(formData)
//       const res = await axios.post(Base_Url.addWishlist, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       if (res.data && res.data.message === 'Successfully added!') {
//         dispatch(addFavourite(product));
//         Toast.show({
//           type: 'success',
//           text1: t('success'),
//           text2: res.data.message || t('addedtofav'),
//         });
//         navigation.navigate('WishList')
//       } else {
//         Toast.show({
//           type: 'error',
//           text1: t('error'),
//           text2: res.data.message || t('failtofav'),
//         });
//       }
//     } catch (error) {

//       Toast.show({
//         type: 'error',
//         text1: t('error'),
//         text2: (error as any)?.response?.data?.message || t('failtofav'),
//       });

//     } finally {
//       setWishlistLoading(false);
//     }
//   };

//   const handleRemoveFromWishlist = async () => {
//     try {
//       setWishlistLoading(true);
//       const token = await AsyncStorage.getItem('token');
//       if (!token) {
//         Toast.show({
//           type: 'error',
//           text1: t('error'),
//           text2: t('noToken'),
//         });
//         setWishlistLoading(false);
//         return;
//       }
//       const formData = new FormData();
//       formData.append('product_id', product.id.toString());
//       const res = await axios.post(Base_Url.wishlistremove, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       if (
//         res.data &&
//         res.data.message === 'Successfully removed!'
//       ) {
//         dispatch(removeFavourite({ id: product.id }));

//         Toast.show({
//           type: 'success',
//           text1: t('success'),
//           text2: t('removefromfav'),
//         });
//       } else {

//         Toast.show({
//           type: 'error',
//           text1: 'Error',
//           text2: res.data.message || t('fail2'),
//         });
//       }
//     } catch (error) {

//       Toast.show({
//         type: 'error',
//         text1: t('error'),
//         text2: (error as any)?.response?.data?.message ||
//           t('fail2'),
//       });

//     } finally {
//       setWishlistLoading(false);
//     }
//   };

//   const handleAddToCart = async () => {
//     if (!checkvalidate()) return;
//     try {
//       setCartLoading(true);
//       const token = await AsyncStorage.getItem('token');
//       if (!token) {
//         Toast.show({
//           type: 'error',
//           text1: t('error'),
//           text2: t('noToken'),
//         });
//         setCartLoading(false);
//         return;
//       }
//       const formData = new FormData();
//       formData.append('id', product.id.toString());
//       formData.append('quantity', quantity.toString());
//       if (selectedSize) {
//         formData.append('size', selectedSize);
//       }
//       // console.log('selectedColor:',selectedColor)
//       if (selectedColor) {
//         formData.append('color', selectedColor);
//       }
//       // console.log(formData)
//       const res = await axios.post(Base_Url.addtocart, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//         params: {
//           guest_id: 1,
//         },
//       });
//       // console.log(res)
//       if (res.data && res.data.message === 'Successfully added!') {
//         dispatch(addCartItem({ ...product, quantity }));
//         Toast.show({
//           type: 'success',
//           text1: t('success'),
//           text2: res.data.message || t('addtocart'),
//         });
//         navigation.navigate('Dashboard', {
//           screen: `AddtoCart`,
//         } as never);
//       } else {
//         Toast.show({
//           type: 'error',
//           text1: t('error'),
//           text2: res.data.message || t('failCart'),
//         });
//       }
//     } catch (error: any) {
//       Toast.show({
//         type: 'error',
//         text1: t('error'),
//         text2: error?.response?.data?.message || t('erroraddingcart'),
//       });
//     } finally {
//       setCartLoading(false);
//     }
//   };

//   const handleToggleFavourite = async () => {
//     if (isFavorite) {
//       await handleRemoveFromWishlist();
//     } else {
//       await handleAddToWishlist();
//     }
//   };

//   const openReviewModal = () => {
//     setReviewRating(0);
//     setReviewComment('');
//     setIsReviewModalVisible(true);
//   };

//   const closeReviewModal = () => setIsReviewModalVisible(false);

//   const handleStarPress = (star: number) => {
//     setReviewRating(star);
//   };

//   const submitReview = async () => {
//     if (reviewRating === 0 || !reviewComment.trim()) {
//       Toast.show({
//         type: 'error',
//         text1: t('validation'),
//         text2: t('validation22'),
//       });
//       return;
//     }
//     setSubmittingReview(true);
//     try {
//       const token = await AsyncStorage.getItem('token');
//       if (!token) {
//         Toast.show({
//           type: 'error',
//           text1: t('error'),
//           text2: t('noToken'),
//         });
//         setSubmittingReview(false);
//         return;
//       }
//       const payload = {
//         product_id: product.id,
//         comment: reviewComment,
//         rating: reviewRating,
//       };
//       const res = await axios.post(
//         Base_Url.submitreview,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         },
//       );

//       if (res.data && res.data.message === 'Successfully submitted review!') {
//         Toast.show({
//           type: 'success',
//           text1: t('success'),
//           text2: t('reviewSubmitted'),
//         });
//         closeReviewModal();
//         await fetchReviews();
//       } else {
//         Toast.show({
//           type: 'error',
//           text1: t('error'),
//           text2: res.data.message || t('failedreview'),
//         });
//       }
//     } catch (error: any) {
//       Toast.show({
//         type: 'error',
//         text1: 'Error',
//         text2: error?.response?.data?.message || t('errorsubmit'),
//       });

//     } finally {
//       setSubmittingReview(false);
//     }
//   };

//   const premimumuser = async () => {
//     const premimum = await isUserPremium();

//     if (premimum) {

//       setispremimum(true);
//     } else {
//       setispremimum(false);
//     }
//   };
//   const checkWishlist = async () => {
//     try {
//       const token = await AsyncStorage.getItem('token');
//       if (!token) return;

//       const res = await axios.get(Base_Url.getWishlist, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const wishlist = res?.data;

//       const exists = wishlist.some((item: any) => item?.product_full_info?.id === product.id);
//       setIsFavoriteLocal(exists);
//     } catch (error) {
//       console.log('wishlist check error', error);
//     }
//   };
//   useFocusEffect(
//     useCallback(() => {
//       fetchReviews();
//       premimumuser();
//       checkWishlist();
//     }, [])
//   );
//   useEffect(() => {
//     checkWishlist();

//   }, [handleRemoveFromWishlist]);
//   const fetchReviews = async () => {
//     setReviewsLoading(true);
//     try {
//       setReviews(product.reviews || []);
//     } catch (error) {
//       Toast.show({
//         type: 'error',
//         text1: t('error'),
//         text2: t('failload'),
//       });
//     } finally {
//       setReviewsLoading(false);
//     }
//   };

//   const openReviewsModal = () => {
//     fetchReviews();
//     setIsReviewsModalVisible(true);
//   };

//   const closeReviewsModal = () => setIsReviewsModalVisible(false);
//   const seller = product?.seller || {};
//   const shop = seller?.shop || {};

//   const ZoomableImage: React.FC<{ source: any; style?: any; resetKey?: number }> = ({ source, style, resetKey }) => {
//     const scale = useSharedValue(1);
//     const savedScale = useSharedValue(1);
//     const translationX = useSharedValue(0);
//     const translationY = useSharedValue(0);
//     const savedTranslationX = useSharedValue(0);
//     const savedTranslationY = useSharedValue(0);

//     const clamp = (value: number, min: number, max: number) => {
//       'worklet';
//       return Math.min(Math.max(value, min), max);
//     };

//     const pinch = Gesture.Pinch()
//       .onUpdate((e) => {
//         scale.value = clamp(savedScale.value * e.scale, 1, 4);
//       })
//       .onEnd(() => {
//         savedScale.value = scale.value;
//       });

//     const pan = Gesture.Pan()
//       .onUpdate((e) => {
//         const factor = scale.value > 1 ? 1 : 0;
//         translationX.value = savedTranslationX.value + e.translationX * factor;
//         translationY.value = savedTranslationY.value + e.translationY * factor;
//       })
//       .onEnd(() => {
//         savedTranslationX.value = translationX.value;
//         savedTranslationY.value = translationY.value;
//       });

//     const composed = Gesture.Simultaneous(pan, pinch);

//     const animatedStyle = useAnimatedStyle(() => ({
//       transform: [
//         { scale: scale.value },
//         { translateX: translationX.value },
//         { translateY: translationY.value },
//       ],
//     }));

//     React.useEffect(() => {
//       scale.value = 1;
//       savedScale.value = 1;
//       translationX.value = 0;
//       translationY.value = 0;
//       savedTranslationX.value = 0;
//       savedTranslationY.value = 0;
//     }, [resetKey]);

//     return (
//       <View style={style.zoomableImageContainer}>
//         <GestureDetector gesture={composed}>
//           <Animated.Image source={source} style={[style, animatedStyle, style.zoomableImage]} resizeMode="contain" />
//         </GestureDetector>
//       </View>
//     );
//   };

//   const price = Number(product?.unit_price) || 0;
//   const discount = Number(product?.discount) || 0;
//   const discountType = product?.discount_type || 'percent';

//   let displayPrice = price;
//   let showDiscountPrice = false;

//   if (ispremimum && discount > 0) {
//     if (discountType === 'flat') {
//       displayPrice = price - discount;
//     } else if (discountType === 'percent') {
//       displayPrice = price - (price * discount) / 100;
//     }
//     showDiscountPrice = true;
//   }

//   const showSubscribeMessage = !ispremimum && discount > 0;
//   const showPrimeUserSection = ispremimum;

//   const getValidImageUrl = (img: string) => {
//     if (!img) { return null; }

//     let cleaned = img.replace(/\/+/, '/');

//     if (cleaned.startsWith('http')) { return cleaned; }

//     return `${base_url}/${cleaned}`;
//   };

//   const LazyImage = ({
//     uri,
//     imageStyle,
//   }: {
//     uri: string;
//     imageStyle: any;
//   }) => {

//     return (
//       <View style={[style.lazyImageContainer, imageStyle]}>

//         {/* 1. Placeholder (ONLY when not loaded) */}
//         {!loaded && (
//           <Image
//             source={IMAGES.imgplaceholder}
//             style={[imageStyle, { position: 'absolute' }]}
//             resizeMode="cover"
//           />
//         )}

//         {/* 2. Real image (ONLY after load) */}
//         <Image
//           source={{ uri }}
//           style={[
//             imageStyle,
//             { opacity: loaded ? 1 : 0 },
//           ]}
//           resizeMode="contain"
//           onLoadEnd={() => setLoaded(true)}
//           fadeDuration={0}
//         />
//       </View>
//     );
//   };



//   const currentStock = Number(product?.current_stock) || 0;
//   const isOutOfStock = currentStock <= 0;
//   return (
//     <SafeAreaView style={[style.container, {
//       paddingBottom: insets.bottom
//     }]}>
//       <View style={style.headerContainer}>
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           style={style.backButton}>
//           <VectorIcon
//             size={24}
//             type="AntDesign"
//             name="left"
//             color={COLORS.black}
//           />
//         </TouchableOpacity>
//         <Text style={style.headerTitle}>{t('productDetails')}</Text>
//         <View style={style.placeholder} />
//       </View>

//       <ScrollView>
//         <ScrollView
//           horizontal
//           pagingEnabled
//           showsHorizontalScrollIndicator={false}
//           onScroll={e => {
//             const index = Math.round(e.nativeEvent.contentOffset.x / width);
//             setCurrentIndex(index);
//           }}
//           scrollEventThrottle={16}
//         >
//           {getAllImages().map((imgUrl, index) => {
//             const validUrl = getValidImageUrl(imgUrl);

//             return validUrl ? (
//               <TouchableOpacity
//                 key={index}
//                 onPress={() => { setCurrentIndex(index); setfullViewImage(true); }}
//                 activeOpacity={0.9}
//               >
//                 <LazyImage
//                   uri={validUrl}
//                   imageStyle={style.mainImage}
//                 />
//               </TouchableOpacity>
//             ) : null;
//           })}
//         </ScrollView>

//         <Modal
//           visible={fullViewImage}
//           transparent
//           animationType="slide"
//           onRequestClose={() => setfullViewImage(false)}
//         >
//           <ImageViewer
//             imageUrls={getAllImages().map(imgUrl => ({ url: imgUrl }))}
//             index={currentIndex}
//             enableSwipeDown
//             onSwipeDown={() => setfullViewImage(false)}
//             backgroundColor="black"
//             enablePreload={true}
//             key={currentIndex}
//           />
//         </Modal>

//         <View style={style.card}>
//           <View style={style.nameandicon}>
//             <Text style={style.productName} numberOfLines={1} ellipsizeMode="tail">{product?.name}</Text>
//             <View style={style.primeiconContainer}>
//               <Image
//                 source={{ uri: `${base_url}/${icon?.general_icon.icon}` }}
//                 style={style.primeicon}
//                 resizeMode="contain"
//               />
//             </View>
//           </View>

//           <View style={style.priceContainer}>
//             {showDiscountPrice ? (
//               <View style={style.discountPriceContainer}>
//                 <Text style={style.discountPrice}>
//                   {displayPrice.toFixed(2)} <Text style={style.currency}>﷼</Text>
//                 </Text>
//                 <View style={style.originalPriceContainer}>
//                   <Text style={style.originalPrice}>
//                     {price.toFixed(2)} <Text style={style.currency}>﷼</Text>
//                   </Text>
//                   <Text style={style.discountBadge}>
//                     ({discountType === 'flat' ? discount : discount + '%'} OFF)
//                   </Text>
//                 </View>
//               </View>
//             ) : showSubscribeMessage ? (
//               <View>
//                 <Text style={style.originalPriceNoDiscount}>
//                   {price.toFixed(2)} <Text style={style.currency}>﷼</Text>
//                 </Text>
//                 <Text style={style.subscribeMessage}>
//                   {t('nonprime')}{discountType === 'flat' ? ` ${discount} ﷼ ` : discount + '%'} off
//                 </Text>
//               </View>
//             ) : (
//               <Text style={style.normalPrice}>
//                 {price.toFixed(2)} <Text style={style.currency}>﷼</Text>
//               </Text>
//             )}
//             {showPrimeUserSection && (
//               <Subscriptionstyle />
//             )}
//           </View>

//           {product?.colors_formatted?.length > 0 && (
//             <View style={style.colorSection}>
//               <Text style={style.sectionTitle}>{t('color')}</Text>
//               <View style={style.colorContainer}>
//                 {product.colors_formatted.map((c: any, i: number) => (
//                   <TouchableOpacity
//                     key={i}
//                     onPress={() => setSelectedColor(c.code)}
//                     style={[
//                       style.colorButton,
//                       {
//                         backgroundColor: c.code,
//                         borderColor: selectedColor === c.code ? COLORS.btnbg : COLORS.halfmodal,
//                         borderWidth: selectedColor === c.code ? 2 : 1,
//                       },
//                     ]}
//                   />
//                 ))}
//               </View>
//             </View>
//           )}

//           {product?.choice_options?.length > 0 &&
//             product?.choice_options[0]?.options?.length > 0 && (
//               <View style={style.sizeSection}>
//                 <Text style={style.sectionTitle}>{t('size')}</Text>
//                 <View style={style.sizeContainer}>
//                   {product?.choice_options[0]?.options.map((sz: string, i: number) => (
//                     <TouchableOpacity
//                       key={i}
//                       onPress={() => setSelectedSize(sz)}
//                       style={[
//                         style.sizeButton,
//                         {
//                           borderColor: selectedSize === sz ? COLORS.btnbg : COLORS.halfmodal,
//                           backgroundColor: selectedSize === sz ? style.selectedSizeButton.backgroundColor : COLORS.white,
//                         },
//                       ]}
//                     >
//                       <Text style={[
//                         style.sizeButtonText,
//                         { color: selectedSize === sz ? COLORS.white : COLORS.black },
//                       ]}>
//                         {sz}
//                       </Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               </View>
//             )}

//           <Text style={style.sectionTitle}>{t('details')}</Text>
//           <Text style={style.detailsText}>
//             {product?.details
//               ? product?.details.replace(/<[^>]+>/g, '')
//               : 'No details available.'}
//           </Text>

//           <View style={style.quantityRow}>
//             <Text style={style.sectionTitle}>{t('quantity')}</Text>
//             <View style={style.quantitySelector}>
//               <TouchableOpacity
//                 style={style.qtyBtn}
//                 onPress={() => handleQuantityChange('dec')}>
//                 <Text style={style.qtyBtnText}>-</Text>
//               </TouchableOpacity>
//               <Text style={style.qtyValue}>{quantity}</Text>
//               <TouchableOpacity
//                 style={style.qtyBtn}
//                 onPress={() => handleQuantityChange('inc')}>
//                 <Text style={style.qtyBtnText}>+</Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           <View style={style.sellerRow}>
//             <Text style={style.soldByText}>{t('Soldby')}: </Text>
//             <TouchableOpacity onPress={() => (navigation.navigate as any)('Seller', { seller, shop })}>
//               <Text style={style.sellerNameText}>
//                 {seller.f_name} {seller.l_name}
//               </Text>
//             </TouchableOpacity>
//           </View>

//           <View style={style.row}>
//             <VectorIcon
//               size={18}
//               type="FontAwesome"
//               name="star"
//               color="#FFD700"
//               style={style.starIcon}
//             />
//             <Text style={style.ratingText}>
//               {product?.reviews?.length > 0
//                 ? (
//                   product?.reviews.reduce((acc: number, review: { rating: number; }) => acc + (review as { rating: number }).rating, 0) /
//                   product?.reviews.length
//                 ).toFixed(1)
//                 : rating > 0
//                   ? rating.toFixed(1)
//                   : 'No rating'}
//             </Text>
//             <TouchableOpacity onPress={openReviewsModal}>
//               <Text style={style.reviewLinkText}>
//                 ({product?.reviews?.length || reviewsCount}{' '}
//                 {product?.reviews.length === 1 || reviewsCount === 1
//                   ? 'review'
//                   : 'reviews'}
//                 )
//               </Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={style.reviewButton}
//               onPress={openReviewModal}>
//               <Text style={style.reviewButtonText}>{t('addreview')}</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         <Text style={style.sectionTitle}>{t('similarProducts')}</Text>
//         {similarLoading ? (
//           <Loader size="medium" />
//         ) : similarProducts?.length === 0 ? (
//           <Text style={style.noSimilarText}>
//             {t('noSimilar')}
//           </Text>
//         ) : (
//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             style={style.similarProductsScroll}>
//             {similarProducts.map((item, idx) => (

//               <TouchableOpacity
//                 key={(item as { id: number }).id || idx}
//                 style={style.similarCard}
//                 onPress={() =>
//                   navigation.push('ProductDetails', { product: item })
//                 }>
//                 <SafeImage
//                   uri={
//                     (item as { thumbnail: string })?.thumbnail
//                       ? `${base_url}/${(item as { thumbnail: string }).thumbnail}`
//                       : null
//                   }
//                   style={style.similarImage}
//                   resizeMode="cover"
//                 />
//                 <Text style={style.similarName} numberOfLines={1}>
//                   {(item as { name: string }).name}
//                 </Text>
//                 <Text style={style.similarPrice}>
//                   {(item as { unit_price: number }).unit_price?.toFixed(2)}{' '}
//                   <Text style={style.currency}>﷼</Text>
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         )}
//       </ScrollView>

//       <View style={style.bottomBar}>
//         <TouchableOpacity
//           style={style.heartBtn}
//           onPress={handleToggleFavourite}
//           activeOpacity={0.7}
//           disabled={wishlistLoading}>
//           {wishlistLoading ? (
//             <Loader size="small" />
//           ) : (
//             <VectorIcon
//               size={22}
//               type="FontAwesome"
//               name={isFavorite ? 'heart' : 'heart-o'}
//               color={isFavorite ? 'red' : COLORS.black}
//             />
//           )}
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[
//             style.cartBtn,
//             (isOutOfStock || cartLoading) && style.disabledCartButton,
//           ]}
//           onPress={handleAddToCart}
//           disabled={cartLoading || isOutOfStock}
//         >
//           {cartLoading ? (
//             <Loader size="small" />
//           ) : isOutOfStock ? (
//             <Text style={style.outOfStockText}>{t('nostock')}</Text>
//           ) : (
//             <Text style={style.cartBtnText}>{t('cart')}</Text>
//           )}
//         </TouchableOpacity>
//       </View>

//       <View style={style.bottomBarUnderline} />

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={isImageModalVisible}
//         onRequestClose={() => { setIsImageModalVisible(false); setImageResetId(id => id + 1); }}>
//         <View style={style.imageModalContainer}>
//           <TouchableOpacity
//             onPress={() => { setIsImageModalVisible(false); setImageResetId(id => id + 1); }}
//             style={style.closeModalButton}
//             activeOpacity={0.7}
//           >
//             <VectorIcon size={26} type="AntDesign" name="close" color={COLORS.white} />
//           </TouchableOpacity>
//           <View style={style.imageModalContent}>
//             <ZoomableImage source={getAllImages} resetKey={imageResetId} />
//           </View>
//         </View>
//       </Modal>

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={isReviewModalVisible}
//         onRequestClose={closeReviewModal}>
//         <TouchableOpacity
//           style={style.modalBackdrop}
//           activeOpacity={1}
//           onPress={closeReviewModal}
//         />
//         <View style={style.reviewModalContainer}>
//           <Text style={style.reviewModalTitle}>{t('review')}</Text>
//           <Text style={style.orderText}>
//             Order #{product?.order_number || 'xxxxxxx'}
//           </Text>
//           <View style={style.starsRow}>
//             {[1, 2, 3, 4, 5].map(star => (
//               <TouchableOpacity
//                 key={star}
//                 onPress={() => handleStarPress(star)}>
//                 <VectorIcon
//                   size={32}
//                   type="FontAwesome"
//                   name={reviewRating >= star ? 'star' : 'star-o'}
//                   color={COLORS.star}
//                   style={style.starIconModal}
//                 />
//               </TouchableOpacity>
//             ))}
//           </View>
//           <TextInput
//             style={style.commentInput}
//             placeholder="Your comment"
//             value={reviewComment}
//             onChangeText={setReviewComment}
//             multiline
//             numberOfLines={4}
//             placeholderTextColor={COLORS.placeholder}
//           />
//           <TouchableOpacity
//             style={style.submitReviewButton}
//             onPress={submitReview}
//             disabled={submittingReview}>
//             {submittingReview ? (
//               <Loader size="small" />
//             ) : (
//               <Text style={style.submitReviewButtonText}>{t('say')}</Text>
//             )}
//           </TouchableOpacity>
//         </View>
//       </Modal>

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={isReviewsModalVisible}
//         onRequestClose={closeReviewsModal}>
//         <TouchableOpacity
//           style={style.modalBackdrop}
//           activeOpacity={1}
//           onPress={closeReviewsModal}
//         />
//         <View style={style.reviewsModalContainer}>
//           <View style={style.reviewsModalHeader}>
//             <View style={style.modalHandle} />
//             <Text style={style.reviewsModalTitle}>{t('productReview')}</Text>
//           </View>
//           <ScrollView style={style.reviewsScrollView}>
//             {reviewsLoading ? (
//               <Loader size="medium" />
//             ) : reviews.length === 0 ? (
//               <Text style={style.noReviewsText}>
//                 {t('noReview')}
//               </Text>
//             ) : (
//               reviews.map((review, idx) => (
//                 <View key={(review as any)?.id || idx} style={style.reviewCard}>
//                   <View style={style.reviewHeader}>
//                     <Image
//                       source={
//                         (review as any)?.customer?.image_path &&
//                           (review as any)?.customer?.image_path !== 'def.png'
//                           ? {
//                             uri: (review as any)?.customer?.image_path.startsWith('http')
//                               ? (review as any)?.customer?.image_path
//                               : (review as any)?.customer?.image_path.startsWith('storage')
//                                 ? `${base_url}/${(review as any)?.customer?.image_path}`
//                                 : `${base_url}/storage/app/public/profile/${(review as any)?.customer?.image_path}`
//                           }
//                           : IMAGES.imgplaceholder
//                       }
//                       style={style.reviewAvatar}
//                     />
//                     <View style={style.reviewUserInfo}>
//                       <Text style={style.reviewUserName}>
//                         {`${(review as any)?.customer?.f_name} ${(review as any)?.customer?.l_name}` || ''}{' '}
//                       </Text>
//                     </View>
//                   </View>
//                   <View style={style.reviewStars}>
//                     {[1, 2, 3, 4, 5].map(star => (
//                       <VectorIcon
//                         key={star}
//                         size={18}
//                         type="FontAwesome"
//                         name={(review as any).rating >= star ? 'star' : 'star-o'}
//                         color={COLORS.star}
//                         style={style.reviewStarIcon}
//                       />
//                     ))}
//                   </View>
//                   <Text style={style.reviewCommentText}>
//                     {(review as any).comment}
//                   </Text>
//                 </View>
//               ))
//             )}
//           </ScrollView>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable eqeqeq */
/* eslint-disable react/no-unstable-nested-components */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Dimensions,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import IMAGES from '../../assets/images';
import VectorIcon from '../../components/VectorIcon';
import COLORS from '../../utils/Colors';
import { addCartItem } from '../../redux/slice/cartSlice';
import { useDispatch } from 'react-redux';
import { addFavourite, removeFavourite } from '../../redux/slice/favouriteSlice';
import { AppDispatch } from '../../redux/store';
import { base_url, Base_Url } from '../../utils/ApiUrl';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import Loader from '../../components/Loader';
import ImageViewer from 'react-native-image-zoom-viewer';
import { isUserPremium, primeicon } from '../../utils/premimumuser';
import Subscriptionstyle from '../../components/Subscriptionstyle';
import style from './style';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import SafeImage from '../../components/SafeImage';

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

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetails'>;

const ProductDetails: React.FC<Props> = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { width } = Dimensions.get('window');
  const { product } = route.params as any;
  const dispatch = useDispatch<AppDispatch>();
  const [similarProducts, setSimilarProducts] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [ispremimum, setispremimum] = useState<boolean>(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [isReviewsModalVisible, setIsReviewsModalVisible] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [imageResetId, setImageResetId] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [fullViewImage, setfullViewImage] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [icon, setprimeicon] = useState<prime | null>(null);
  const [isFavoriteLocal, setIsFavoriteLocal] = useState(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  
  const { t } = useTranslation();
  
  const primeIcon = async () => {
    const prime = await primeicon();
    setprimeicon(prime.data[0]);
  };
  
  const isFavorite = isFavoriteLocal;
  
  const getAllImages = () => {
    let arr: string[] = [];

    if (selectedColor && product?.color_image?.length > 0) {
      const colorMatch = product.color_image.find((ci: { color: string; }) =>
        ci.color.replace('#', '').toUpperCase() ===
        selectedColor.replace('#', '').toUpperCase()
      );

      if (colorMatch?.image_name) {
        arr.push(`${base_url}/${colorMatch.image_name}`);
      }
    }

    if (Array.isArray(product?.images) && product.images.length > 0) {
      product.images.forEach((img: any) => {
        arr.push(`${base_url}/${img}`);
      });
    }

    if (arr.length === 0 && product.thumbnail) {
      arr.push(`${base_url}/${product.thumbnail}`)
    }

    return arr;
  };
  
  const rating =
    Array.isArray(product?.rating) && product?.rating?.length > 0
      ? Number(product?.rating[0]?.average) || 0
      : 0;
  const reviewsCount = product?.reviews_count || 0;

  // Helper function to get stock quantity for a specific color
  const getColorStock = (colorCode: string) => {
    if (!product?.variation || !Array.isArray(product.variation)) {
      return 0;
    }
    
    // Find the variation that matches this color
    const variation = product.variation.find((v: any) => {
      // Check if the variation type matches the color name
      // Map color codes to color names (you may need to adjust this mapping)
      const colorName = getColorNameFromCode(colorCode);
      return v.type && v.type.toLowerCase() === colorName.toLowerCase();
    });
    
    return variation ? variation.qty || 0 : 0;
  };

  // Helper function to get stock quantity for a specific size
  const getSizeStock = (size: string) => {
    if (!product?.variation || !Array.isArray(product.variation)) {
      return 0;
    }
    
    // Find the variation that matches this size
    const variation = product.variation.find((v: any) => {
      return v.type && v.type.toLowerCase() === size.toLowerCase();
    });
    
    return variation ? variation.qty || 0 : 0;
  };

  // Helper function to get color name from color code
  const getColorNameFromCode = (colorCode: string) => {
    // Map common color codes to names
    const colorMap: {[key: string]: string} = {
      '#9ACD32': 'YellowGreen',
      '#FFFF00': 'Yellow',
      '#FF0000': 'Red',
      '#00FF00': 'Green',
      '#0000FF': 'Blue',
      '#FFFFFF': 'White',
      '#000000': 'Black',
      '#FFA500': 'Orange',
      '#800080': 'Purple',
      '#FFC0CB': 'Pink',
      '#808080': 'Gray',
      '#A52A2A': 'Brown',
    };
    
    const normalizedCode = colorCode.toUpperCase();
    return colorMap[normalizedCode] || colorCode;
  };

  // Helper function to check if a color is in stock
  const isColorInStock = (colorCode: string) => {
    const stock = getColorStock(colorCode);
    return stock > 0;
  };

  // Helper function to check if a size is in stock
  const isSizeInStock = (size: string) => {
    const stock = getSizeStock(size);
    return stock > 0;
  };

  const handleQuantityChange = (type: 'inc' | 'dec') => {
    setQuantity(q => (type === 'inc' ? q + 1 : q > 1 ? q - 1 : 1));
  };
  
  // Check validation for add to cart and WishList
  const checkvalidate = () => {
    if (
      product?.choice_options?.length > 0 &&
      product?.choice_options[0]?.options?.length > 0 &&
      !selectedSize
    ) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: t('sizeselecterror'),
      });
      return false;
    }

    if (
      product?.colors_formatted?.length > 0 &&
      !selectedColor
    ) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: t('colorselecterror'),
      });
      return false;
    }

    // Check if selected color is in stock
    if (selectedColor && !isColorInStock(selectedColor)) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: 'Selected color is out of stock',
      });
      return false;
    }

    // Check if selected size is in stock
    if (selectedSize && !isSizeInStock(selectedSize)) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: 'Selected size is out of stock',
      });
      return false;
    }

    return true;
  };

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        setSimilarLoading(true);
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Toast.show({
            type: 'error',
            text1: t('error'),
            text2: t('noToken'),
          });
          setSimilarLoading(false);
          return;
        }
        const res = await axios.get(
          `${Base_Url.relatedproduct}/${product.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setSimilarProducts(res.data || []);
      } catch (error) {
        setSimilarProducts([]);
      } finally {
        setSimilarLoading(false);
      }
    };

    if (product?.id) {
      fetchSimilarProducts();
    }
    primeIcon();
  }, [product.id, t]);

  const handleAddToWishlist = async () => {
    if (!checkvalidate()) return;
    try {
      setWishlistLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: t('noToken'),
        });
        setWishlistLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append('product_id', product.id.toString());
      if (selectedSize) {
        formData.append('size', selectedSize);
      }
      if (selectedColor) {
        formData.append('color', selectedColor);
      }
      const res = await axios.post(Base_Url.addWishlist, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.data && res.data.message === 'Successfully added!') {
        dispatch(addFavourite(product));
        Toast.show({
          type: 'success',
          text1: t('success'),
          text2: res.data.message || t('addedtofav'),
        });
        navigation.navigate('WishList')
      } else {
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: res.data.message || t('failtofav'),
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: (error as any)?.response?.data?.message || t('failtofav'),
      });
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleRemoveFromWishlist = async () => {
    try {
      setWishlistLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: t('noToken'),
        });
        setWishlistLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append('product_id', product.id.toString());
      const res = await axios.post(Base_Url.wishlistremove, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (
        res.data &&
        res.data.message === 'Successfully removed!'
      ) {
        dispatch(removeFavourite({ id: product.id }));
        Toast.show({
          type: 'success',
          text1: t('success'),
          text2: t('removefromfav'),
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res.data.message || t('fail2'),
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: (error as any)?.response?.data?.message ||
          t('fail2'),
      });
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!checkvalidate()) return;
    try {
      setCartLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: t('noToken'),
        });
        setCartLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append('id', product.id.toString());
      formData.append('quantity', quantity.toString());
      if (selectedSize) {
        formData.append('size', selectedSize);
      }
      if (selectedColor) {
        formData.append('color', selectedColor);
      }
      const res = await axios.post(Base_Url.addtocart, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        params: {
          guest_id: 1,
        },
      });
      if (res.data && res.data.message === 'Successfully added!') {
        dispatch(addCartItem({ ...product, quantity }));
        Toast.show({
          type: 'success',
          text1: t('success'),
          text2: res.data.message || t('addtocart'),
        });
        navigation.navigate('Dashboard', {
          screen: `AddtoCart`,
        } as never);
      } else {
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: res.data.message || t('failCart'),
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: error?.response?.data?.message || t('erroraddingcart'),
      });
    } finally {
      setCartLoading(false);
    }
  };

  const handleToggleFavourite = async () => {
    if (isFavorite) {
      await handleRemoveFromWishlist();
    } else {
      await handleAddToWishlist();
    }
  };

  const openReviewModal = () => {
    setReviewRating(0);
    setReviewComment('');
    setIsReviewModalVisible(true);
  };

  const closeReviewModal = () => setIsReviewModalVisible(false);

  const handleStarPress = (star: number) => {
    setReviewRating(star);
  };

  const submitReview = async () => {
    if (reviewRating === 0 || !reviewComment.trim()) {
      Toast.show({
        type: 'error',
        text1: t('validation'),
        text2: t('validation22'),
      });
      return;
    }
    setSubmittingReview(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: t('noToken'),
        });
        setSubmittingReview(false);
        return;
      }
      const payload = {
        product_id: product.id,
        comment: reviewComment,
        rating: reviewRating,
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
          text1: t('success'),
          text2: t('reviewSubmitted'),
        });
        closeReviewModal();
        await fetchReviews();
      } else {
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: res.data.message || t('failedreview'),
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.message || t('errorsubmit'),
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  const premimumuser = async () => {
    const premimum = await isUserPremium();
    if (premimum) {
      setispremimum(true);
    } else {
      setispremimum(false);
    }
  };
  
  const checkWishlist = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const res = await axios.get(Base_Url.getWishlist, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const wishlist = res?.data;
      const exists = wishlist.some((item: any) => item?.product_full_info?.id === product.id);
      setIsFavoriteLocal(exists);
    } catch (error) {
      console.log('wishlist check error', error);
    }
  };
  
  useFocusEffect(
    useCallback(() => {
      fetchReviews();
      premimumuser();
      checkWishlist();
    }, [])
  );
  
  useEffect(() => {
    checkWishlist();
  }, [handleRemoveFromWishlist]);
  
  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      setReviews(product.reviews || []);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: t('failload'),
      });
    } finally {
      setReviewsLoading(false);
    }
  };

  const openReviewsModal = () => {
    fetchReviews();
    setIsReviewsModalVisible(true);
  };

  const closeReviewsModal = () => setIsReviewsModalVisible(false);
  const seller = product?.seller || {};
  const shop = seller?.shop || {};

  const ZoomableImage: React.FC<{ source: any; style?: any; resetKey?: number }> = ({ source, style, resetKey }) => {
    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);
    const translationX = useSharedValue(0);
    const translationY = useSharedValue(0);
    const savedTranslationX = useSharedValue(0);
    const savedTranslationY = useSharedValue(0);

    const clamp = (value: number, min: number, max: number) => {
      'worklet';
      return Math.min(Math.max(value, min), max);
    };

    const pinch = Gesture.Pinch()
      .onUpdate((e) => {
        scale.value = clamp(savedScale.value * e.scale, 1, 4);
      })
      .onEnd(() => {
        savedScale.value = scale.value;
      });

    const pan = Gesture.Pan()
      .onUpdate((e) => {
        const factor = scale.value > 1 ? 1 : 0;
        translationX.value = savedTranslationX.value + e.translationX * factor;
        translationY.value = savedTranslationY.value + e.translationY * factor;
      })
      .onEnd(() => {
        savedTranslationX.value = translationX.value;
        savedTranslationY.value = translationY.value;
      });

    const composed = Gesture.Simultaneous(pan, pinch);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        { scale: scale.value },
        { translateX: translationX.value },
        { translateY: translationY.value },
      ],
    }));

    React.useEffect(() => {
      scale.value = 1;
      savedScale.value = 1;
      translationX.value = 0;
      translationY.value = 0;
      savedTranslationX.value = 0;
      savedTranslationY.value = 0;
    }, [resetKey]);

    return (
      <View style={style.zoomableImageContainer}>
        <GestureDetector gesture={composed}>
          <Animated.Image source={source} style={[style, animatedStyle, style.zoomableImage]} resizeMode="contain" />
        </GestureDetector>
      </View>
    );
  };

  const price = Number(product?.unit_price) || 0;
  const discount = Number(product?.discount) || 0;
  const discountType = product?.discount_type || 'percent';

  let displayPrice = price;
  let showDiscountPrice = false;

  if (ispremimum && discount > 0) {
    if (discountType === 'flat') {
      displayPrice = price - discount;
    } else if (discountType === 'percent') {
      displayPrice = price - (price * discount) / 100;
    }
    showDiscountPrice = true;
  }

  const showSubscribeMessage = !ispremimum && discount > 0;
  const showPrimeUserSection = ispremimum;

  const getValidImageUrl = (img: string) => {
    if (!img) { return null; }
    let cleaned = img.replace(/\/+/, '/');
    if (cleaned.startsWith('http')) { return cleaned; }
    return `${base_url}/${cleaned}`;
  };

  const LazyImage = ({
    uri,
    imageStyle,
  }: {
    uri: string;
    imageStyle: any;
  }) => {
    return (
      <View style={[style.lazyImageContainer, imageStyle]}>
        {!loaded && (
          <Image
            source={IMAGES.imgplaceholder}
            style={[imageStyle, { position: 'absolute' }]}
            resizeMode="cover"
          />
        )}
        <Image
          source={{ uri }}
          style={[
            imageStyle,
            { opacity: loaded ? 1 : 0 },
          ]}
          resizeMode="contain"
          onLoadEnd={() => setLoaded(true)}
          fadeDuration={0}
        />
      </View>
    );
  };

  const currentStock = Number(product?.current_stock) || 0;
  const isOutOfStock = currentStock <= 0;
  
  return (
    <SafeAreaView style={[style.container, {
      paddingBottom: insets.bottom
    }]}>
      <View style={style.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={style.backButton}>
          <VectorIcon
            size={24}
            type="AntDesign"
            name="left"
            color={COLORS.black}
          />
        </TouchableOpacity>
        <Text style={style.headerTitle}>{t('productDetails')}</Text>
        <View style={style.placeholder} />
      </View>

      <ScrollView>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={e => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setCurrentIndex(index);
          }}
          scrollEventThrottle={16}
        >
          {getAllImages().map((imgUrl, index) => {
            const validUrl = getValidImageUrl(imgUrl);
            return validUrl ? (
              <TouchableOpacity
                key={index}
                onPress={() => { setCurrentIndex(index); setfullViewImage(true); }}
                activeOpacity={0.9}
              >
                <LazyImage
                  uri={validUrl}
                  imageStyle={style.mainImage}
                />
              </TouchableOpacity>
            ) : null;
          })}
        </ScrollView>

        <Modal
          visible={fullViewImage}
          transparent
          animationType="slide"
          onRequestClose={() => setfullViewImage(false)}
        >
          <ImageViewer
            imageUrls={getAllImages().map(imgUrl => ({ url: imgUrl }))}
            index={currentIndex}
            enableSwipeDown
            onSwipeDown={() => setfullViewImage(false)}
            backgroundColor="black"
            enablePreload={true}
            key={currentIndex}
          />
        </Modal>

        <View style={style.card}>
          <View style={style.nameandicon}>
            <Text style={style.productName} numberOfLines={1} ellipsizeMode="tail">{product?.name}</Text>
            <View style={style.primeiconContainer}>
              <Image
                source={{ uri: `${base_url}/${icon?.general_icon.icon}` }}
                style={style.primeicon}
                resizeMode="contain"
              />
            </View>
          </View>

          <View style={style.priceContainer}>
            {showDiscountPrice ? (
              <View style={style.discountPriceContainer}>
                <Text style={style.discountPrice}>
                  {displayPrice.toFixed(2)} <Text style={style.currency}>﷼</Text>
                </Text>
                <View style={style.originalPriceContainer}>
                  <Text style={style.originalPrice}>
                    {price.toFixed(2)} <Text style={style.currency}>﷼</Text>
                  </Text>
                  <Text style={style.discountBadge}>
                    ({discountType === 'flat' ? discount : discount + '%'} OFF)
                  </Text>
                </View>
              </View>
            ) : showSubscribeMessage ? (
              <View>
                <Text style={style.originalPriceNoDiscount}>
                  {price.toFixed(2)} <Text style={style.currency}>﷼</Text>
                </Text>
                <Text style={style.subscribeMessage}>
                  {t('nonprime')}{discountType === 'flat' ? ` ${discount} ﷼ ` : discount + '%'} off
                </Text>
              </View>
            ) : (
              <Text style={style.normalPrice}>
                {price.toFixed(2)} <Text style={style.currency}>﷼</Text>
              </Text>
            )}
            {showPrimeUserSection && (
              <Subscriptionstyle />
            )}
          </View>

          {product?.colors_formatted?.length > 0 && (
            <View style={style.colorSection}>
              <Text style={style.sectionTitle}>{t('color')}</Text>
              <View style={style.colorContainer}>
                {product.colors_formatted.map((c: any, i: number) => {
                  const inStock = isColorInStock(c.code);
                  // Debug log to check stock status
                  console.log(`Color ${c.code} (${getColorNameFromCode(c.code)}) in stock:`, inStock);
                  return (
                    <View key={i} style={style.colorWrapper}>
                      <TouchableOpacity
                        onPress={() => inStock && setSelectedColor(c.code)}
                        style={[
                          style.colorButton,
                          {
                            backgroundColor: c.code,
                            borderColor: selectedColor === c.code ? COLORS.btnbg : COLORS.halfmodal,
                            borderWidth: selectedColor === c.code ? 2 : 1,
                            opacity: inStock ? 1 : 0.5,
                          },
                        ]}
                        disabled={!inStock}
                      />
                      {!inStock && (
                        <View style={style.outOfStockOverlay}>
                          <View style={style.diagonalLine1} />
                          <View style={style.diagonalLine2} />
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {product?.choice_options?.length > 0 &&
            product?.choice_options[0]?.options?.length > 0 && (
              <View style={style.sizeSection}>
                <Text style={style.sectionTitle}>{t('size')}</Text>
                <View style={style.sizeContainer}>
                  {product?.choice_options[0]?.options.map((sz: string, i: number) => {
                    const inStock = isSizeInStock(sz);
                    console.log(`Size ${sz} in stock:`, inStock);
                    return (
                      <View key={i} style={style.sizeWrapper}>
                        <TouchableOpacity
                          onPress={() => inStock && setSelectedSize(sz)}
                          style={[
                            style.sizeButton,
                            {
                              borderColor: selectedSize === sz ? COLORS.btnbg : COLORS.halfmodal,
                              backgroundColor: selectedSize === sz ? style.selectedSizeButton.backgroundColor : COLORS.white,
                              opacity: inStock ? 1 : 0.5,
                            },
                          ]}
                          disabled={!inStock}
                        >
                          <Text style={[
                            style.sizeButtonText,
                            { color: selectedSize === sz ? COLORS.white : COLORS.black },
                          ]}>
                            {sz}
                          </Text>
                        </TouchableOpacity>
                        {!inStock && (
                          <View style={style.sizeOutOfStockOverlay}>
                            <View style={style.diagonalLine1} />
                            <View style={style.diagonalLine2} />
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

          <Text style={style.sectionTitle}>{t('details')}</Text>
          <Text style={style.detailsText}>
            {product?.details
              ? product?.details.replace(/<[^>]+>/g, '')
              : 'No details available.'}
          </Text>

          <View style={style.quantityRow}>
            <Text style={style.sectionTitle}>{t('quantity')}</Text>
            <View style={style.quantitySelector}>
              <TouchableOpacity
                style={style.qtyBtn}
                onPress={() => handleQuantityChange('dec')}>
                <Text style={style.qtyBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={style.qtyValue}>{quantity}</Text>
              <TouchableOpacity
                style={style.qtyBtn}
                onPress={() => handleQuantityChange('inc')}>
                <Text style={style.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={style.sellerRow}>
            <Text style={style.soldByText}>{t('Soldby')}: </Text>
            <TouchableOpacity onPress={() => (navigation.navigate as any)('Seller', { seller, shop })}>
              <Text style={style.sellerNameText}>
                {seller.f_name} {seller.l_name}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={style.row}>
            <VectorIcon
              size={18}
              type="FontAwesome"
              name="star"
              color="#FFD700"
              style={style.starIcon}
            />
            <Text style={style.ratingText}>
              {product?.reviews?.length > 0
                ? (
                  product?.reviews.reduce((acc: number, review: { rating: number; }) => acc + (review as { rating: number }).rating, 0) /
                  product?.reviews.length
                ).toFixed(1)
                : rating > 0
                  ? rating.toFixed(1)
                  : 'No rating'}
            </Text>
            <TouchableOpacity onPress={openReviewsModal}>
              <Text style={style.reviewLinkText}>
                ({product?.reviews?.length || reviewsCount}{' '}
                {product?.reviews.length === 1 || reviewsCount === 1
                  ? 'review'
                  : 'reviews'}
                )
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={style.reviewButton}
              onPress={openReviewModal}>
              <Text style={style.reviewButtonText}>{t('addreview')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={style.sectionTitle}>{t('similarProducts')}</Text>
        {similarLoading ? (
          <Loader size="medium" />
        ) : similarProducts?.length === 0 ? (
          <Text style={style.noSimilarText}>
            {t('noSimilar')}
          </Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={style.similarProductsScroll}>
            {similarProducts.map((item, idx) => (
              <TouchableOpacity
                key={(item as { id: number }).id || idx}
                style={style.similarCard}
                onPress={() =>
                  navigation.push('ProductDetails', { product: item })
                }>
                <SafeImage
                  uri={
                    (item as { thumbnail: string })?.thumbnail
                      ? `${base_url}/${(item as { thumbnail: string }).thumbnail}`
                      : null
                  }
                  style={style.similarImage}
                  resizeMode="cover"
                />
                <Text style={style.similarName} numberOfLines={1}>
                  {(item as { name: string }).name}
                </Text>
                <Text style={style.similarPrice}>
                  {(item as { unit_price: number }).unit_price?.toFixed(2)}{' '}
                  <Text style={style.currency}>﷼</Text>
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </ScrollView>

      <View style={style.bottomBar}>
        <TouchableOpacity
          style={style.heartBtn}
          onPress={handleToggleFavourite}
          activeOpacity={0.7}
          disabled={wishlistLoading}>
          {wishlistLoading ? (
            <Loader size="small" />
          ) : (
            <VectorIcon
              size={22}
              type="FontAwesome"
              name={isFavorite ? 'heart' : 'heart-o'}
              color={isFavorite ? 'red' : COLORS.black}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            style.cartBtn,
            (isOutOfStock || cartLoading) && style.disabledCartButton,
          ]}
          onPress={handleAddToCart}
          disabled={cartLoading || isOutOfStock}
        >
          {cartLoading ? (
            <Loader size="small" />
          ) : isOutOfStock ? (
            <Text style={style.outOfStockText}>{t('nostock')}</Text>
          ) : (
            <Text style={style.cartBtnText}>{t('cart')}</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={style.bottomBarUnderline} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={isImageModalVisible}
        onRequestClose={() => { setIsImageModalVisible(false); setImageResetId(id => id + 1); }}>
        <View style={style.imageModalContainer}>
          <TouchableOpacity
            onPress={() => { setIsImageModalVisible(false); setImageResetId(id => id + 1); }}
            style={style.closeModalButton}
            activeOpacity={0.7}
          >
            <VectorIcon size={26} type="AntDesign" name="close" color={COLORS.white} />
          </TouchableOpacity>
          <View style={style.imageModalContent}>
            <ZoomableImage source={getAllImages} resetKey={imageResetId} />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isReviewModalVisible}
        onRequestClose={closeReviewModal}>
        <TouchableOpacity
          style={style.modalBackdrop}
          activeOpacity={1}
          onPress={closeReviewModal}
        />
        <View style={style.reviewModalContainer}>
          <Text style={style.reviewModalTitle}>{t('review')}</Text>
          <Text style={style.orderText}>
            Order #{product?.order_number || 'xxxxxxx'}
          </Text>
          <View style={style.starsRow}>
            {[1, 2, 3, 4, 5].map(star => (
              <TouchableOpacity
                key={star}
                onPress={() => handleStarPress(star)}>
                <VectorIcon
                  size={32}
                  type="FontAwesome"
                  name={reviewRating >= star ? 'star' : 'star-o'}
                  color={COLORS.star}
                  style={style.starIconModal}
                />
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={style.commentInput}
            placeholder="Your comment"
            value={reviewComment}
            onChangeText={setReviewComment}
            multiline
            numberOfLines={4}
            placeholderTextColor={COLORS.placeholder}
          />
          <TouchableOpacity
            style={style.submitReviewButton}
            onPress={submitReview}
            disabled={submittingReview}>
            {submittingReview ? (
              <Loader size="small" />
            ) : (
              <Text style={style.submitReviewButtonText}>{t('say')}</Text>
            )}
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isReviewsModalVisible}
        onRequestClose={closeReviewsModal}>
        <TouchableOpacity
          style={style.modalBackdrop}
          activeOpacity={1}
          onPress={closeReviewsModal}
        />
        <View style={style.reviewsModalContainer}>
          <View style={style.reviewsModalHeader}>
            <View style={style.modalHandle} />
            <Text style={style.reviewsModalTitle}>{t('productReview')}</Text>
          </View>
          <ScrollView style={style.reviewsScrollView}>
            {reviewsLoading ? (
              <Loader size="medium" />
            ) : reviews.length === 0 ? (
              <Text style={style.noReviewsText}>
                {t('noReview')}
              </Text>
            ) : (
              reviews.map((review, idx) => (
                <View key={(review as any)?.id || idx} style={style.reviewCard}>
                  <View style={style.reviewHeader}>
                    <Image
                      source={
                        (review as any)?.customer?.image_path &&
                          (review as any)?.customer?.image_path !== 'def.png'
                          ? {
                            uri: (review as any)?.customer?.image_path.startsWith('http')
                              ? (review as any)?.customer?.image_path
                              : (review as any)?.customer?.image_path.startsWith('storage')
                                ? `${base_url}/${(review as any)?.customer?.image_path}`
                                : `${base_url}/storage/app/public/profile/${(review as any)?.customer?.image_path}`
                          }
                          : IMAGES.imgplaceholder
                      }
                      style={style.reviewAvatar}
                    />
                    <View style={style.reviewUserInfo}>
                      <Text style={style.reviewUserName}>
                        {`${(review as any)?.customer?.f_name} ${(review as any)?.customer?.l_name}` || ''}{' '}
                      </Text>
                    </View>
                  </View>
                  <View style={style.reviewStars}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <VectorIcon
                        key={star}
                        size={18}
                        type="FontAwesome"
                        name={(review as any).rating >= star ? 'star' : 'star-o'}
                        color={COLORS.star}
                        style={style.reviewStarIcon}
                      />
                    ))}
                  </View>
                  <Text style={style.reviewCommentText}>
                    {(review as any).comment}
                  </Text>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ProductDetails;