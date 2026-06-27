import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '../../utils/Colors';
import { Base_Url } from '../../utils/ApiUrl';
import Loader from '../../components/Loader';
import { verticalScale } from '../../utils/Metrics';

interface SellerReviewModalProps {
    visible: boolean;
    onClose: () => void;
    sellerId: number;
    sellerName?: string;
    productId?: number;
    orderId?: number;
    onSuccess?: () => void;
}

const SellerReviewModal: React.FC<SellerReviewModalProps> = ({
    visible,
    onClose,
    sellerId,
    sellerName = 'Seller',
    productId,
    orderId,
    onSuccess,
}) => {
    const { t } = useTranslation();
    const [rating, setRating] = useState<number>(0);
    const [message, setMessage] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Reset state when modal closes
    useEffect(() => {
        if (!visible) {
            setRating(0);
            setMessage('');
        }
    }, [visible]);

    const handleSubmit = async () => {
        if (rating === 0) {
            Toast.show({
                type: 'error',
                text1: t('validation') || 'Validation Error',
                text2: t('sellerRatingRequired') || 'Please select a rating for the seller',
            });
            return;
        }

        if (!message.trim()) {
            Toast.show({
                type: 'error',
                text1: t('validation') || 'Validation Error',
                text2: t('sellerFeedbackRequired') || 'Please provide feedback for the seller',
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Toast.show({
                    type: 'error',
                    text1: t('error') || 'Error',
                    text2: t('noToken') || 'Please login again',
                });
                setIsSubmitting(false);
                return;
            }

            const payload = {
                product_id: productId,
                seller_id: sellerId,
                message: message.trim(),
                rating: rating,
            };
            console.log(payload)
            const response = await axios.post(
                Base_Url.sellerReviewAdd,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('res: ', response)
            if (response.data && response.data.success) {
                Toast.show({
                    type: 'success',
                    text1: t('success'),
                    text2: t('sellerReviewSubmitted') || 'Seller review submitted successfully!',
                });

                // Call onSuccess callback if provided
                if (onSuccess) {
                    onSuccess();
                }

                // Close modal
                onClose();
            } else {
                Toast.show({
                    type: 'error',
                    text1: t('error') || 'Error',
                    text2: response.data?.message || t('failedSellerReview') || 'Failed to submit seller review',
                });
            }
        } catch (error: any) {
            console.error('Seller review error:', error);
            Toast.show({
                type: 'error',
                text1: t('error') || 'Error',
                text2: error?.response?.data?.message || 'Error submitting seller review',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStars = () => {
        return (
            <View style={styles.modalStarsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                        key={star}
                        onPress={() => setRating(star)}
                        disabled={isSubmitting}
                        style={styles.modalStarButton}
                    >
                        <Icon
                            name={star <= rating ? 'star' : 'star-border'}
                            size={40}
                            color={star <= rating ? COLORS.star : '#CCCCCC'}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <View style={styles.modalContainer}>
                    {/* Modal Header */}
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>
                            {t('rateSeller')}
                        </Text>
                        <TouchableOpacity
                            onPress={onClose}
                            style={styles.modalCloseButton}
                            disabled={isSubmitting}
                        >
                            <Icon name="close" size={24} color={COLORS.black} />
                        </TouchableOpacity>
                    </View>

                    {/* Seller Name */}
                    <View style={styles.modalSellerInfo}>
                        <Icon name="store" size={24} color={COLORS.btnbg} />
                        <Text style={styles.modalSellerName}>
                            {sellerName}
                        </Text>
                    </View>

                    {/* Modal Body */}
                    <View style={styles.modalBody}>
                        {/* Rating Stars */}
                        <View style={styles.modalRatingSection}>
                            <Text style={styles.modalSectionTitle}>
                                {t('rating')}
                            </Text>
                            {renderStars()}
                        </View>

                        {/* Review Input */}
                        <View style={styles.modalCommentSection}>
                            <Text style={styles.modalSectionTitle}>
                                {t('feedback')}
                            </Text>
                            <TextInput
                                style={styles.modalInput}
                                placeholder={t('sellerReviewPlaceholder')}
                                placeholderTextColor={COLORS.placeholder}
                                multiline
                                numberOfLines={4}
                                value={message}
                                onChangeText={setMessage}
                                editable={!isSubmitting}
                            />
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity
                            style={[
                                styles.modalSubmitButton,
                                (rating === 0 || !message.trim()) && styles.submitButtonDisabled,
                            ]}
                            onPress={handleSubmit}
                            disabled={rating === 0 || !message.trim() || isSubmitting}
                        >
                            {isSubmitting ? (
                                <Loader size="small" />
                            ) : (
                                <Text style={styles.modalSubmitButtonText}>
                                    {t('submitReview') || 'Submit Review'}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    // ============ MODAL OVERLAY ============
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    // ============ MODAL CONTAINER ============
    modalContainer: {
        // borderWidth: 3,
        backgroundColor: COLORS.white,
        borderRadius: 16,
        width: '100%',
        height: verticalScale(500),
        maxWidth: 400,
        padding: 24,
        elevation: 5,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },

    // ============ MODAL HEADER ============
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.borderbottom || '#E0E0E0',
        paddingBottom: 16,
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.black,
    },
    modalCloseButton: {
        padding: 4,
    },

    // ============ SELLER INFO ============
    modalSellerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 14,
        backgroundColor: COLORS.backgroundColor || '#F5F5F5',
        borderRadius: 8,
        marginBottom: 16,
    },
    modalSellerName: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.black,
        marginLeft: 10,
    },

    // ============ MODAL BODY ============
    modalBody: {
        flex: 1,
        // borderWidth: 3,
        height: 30,
        // width: 50
    },

    // ============ RATING SECTION ============
    modalRatingSection: {
        marginBottom: 16,
    },
    modalStarsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
    },
    modalStarButton: {
        paddingHorizontal: 8,
    },

    // ============ COMMENT SECTION ============
    modalCommentSection: {
        marginBottom: 16,
    },
    modalSectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.black,
        marginBottom: 8,
    },
    modalInput: {
        borderWidth: 1,
        borderColor: COLORS.revista3 || '#E0E0E0',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        minHeight: 100,
        maxHeight: 150,
        textAlignVertical: 'top',
        backgroundColor: COLORS.backgroundColor || '#F5F5F5',
    },

    // ============ SUBMIT BUTTON ============
    modalSubmitButton: {
        backgroundColor: COLORS.btnbg || '#007AFF',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    modalSubmitButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },

    // ============ BUTTON DISABLED STATE ============
    submitButtonDisabled: {
        opacity: 0.6,
    },
});

export default SellerReviewModal;