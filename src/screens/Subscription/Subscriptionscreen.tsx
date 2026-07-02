
import React, { useCallback, useEffect, useState } from 'react';
import { View, TouchableOpacity, BackHandler, ScrollView, Image, Text, FlatList } from 'react-native';
import { RootStackParamList } from '../../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import styles from './style';
import COLORS from '../../utils/Colors';
import { CustomText } from '../../components/CustomText';
import VectorIcon from '../../components/VectorIcon';
import axios from 'axios';
import { t } from 'i18next';
import CustomButton from '../../components/Buttons/CustomButton';
import { horizontalScale } from '../../utils/Metrics';
import IMAGES from '../../assets/images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Base_Url } from '../../utils/ApiUrl';
import Toast from 'react-native-toast-message';
import { PaymentPurpose } from '../../service/paymentTypes';
import Loader from '../../components/Loader';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'Subscriptionscreen'>;

// Types for API data
interface Feature {
    feature_title: string;
    feature_description: string;
}

interface PlanCategory {
    id: number;
    name: string;
}

interface SubscriptionPlan {
    id: number;
    name: string;
    duration: string;
    price: number;
    type: number;
    status: number;
    is_subscribed: boolean;
    subscription_end_date: string | null;
    plan_badges: string;
    features: Feature[];
    plan_categories: PlanCategory[];
}

interface SubscriptionScreenParams {
    source?: 'signup' | 'profile';
}

const Subscriptionscreen: React.FC<Props> = ({ navigation, route }) => {
    // All hooks must be at the top level, before any conditional logic
    const [loading, setLoading] = useState(true);
    const [userinfo, setUserInfo] = useState<any>(null);
    const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
    const [selectedPlanData, setSelectedPlanData] = useState<SubscriptionPlan | null>(null);
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    
    // Get the source from route params (default to 'profile' if not specified)
    const params = route?.params as SubscriptionScreenParams | undefined;
    const source = params?.source || 'profile';

    // Handle back navigation based on source
    const handleBackNavigation = useCallback(() => {
        if (source === 'signup') {
            // Navigate to Home screen (MainTabs)
            // Try to reset to MainTabs or navigate directly
            navigation.reset({
                index: 0,
                routes: [{ name: 'Dashboard' }],
            });
        } else {
            // Just go back to previous screen
            if (navigation.canGoBack()) {
                navigation.goBack();
            } else {
                // If can't go back, navigate to home
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Dashboard' }],
                });
            }
        }
    }, [navigation, source]);

    // Handle hardware back button press
    const handleBackPress = useCallback(() => {
        handleBackNavigation();
        return true;
    }, [handleBackNavigation]);

    // Hook 1: Back handler for hardware button
    useEffect(() => {
        const subscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        return () => subscription.remove();
    }, [handleBackPress]);

    useEffect(() => {
        fetchSubscriptionPlans();
    }, []);

    // Now define all functions
    const fetchSubscriptionPlans = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');

            if (!token) {
                Toast.show({
                    type: 'error',
                    text1: 'Authentication Required',
                    text2: 'Please login to view subscription plans',
                });
                setPlans([]);
                return;
            }

            const profileResult = await axios.get(Base_Url.getProfile, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUserInfo(profileResult?.data?.customer);

            const res = await axios.get(Base_Url.subscriptionplan, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });


            if (res?.data?.status) {
                const plansData: SubscriptionPlan[] = res.data.plans.map((plan: any) => ({
                    id: plan.id,
                    name: plan.name,
                    duration: plan.duration,
                    price: plan.price,
                    type: plan.type,
                    status: plan.status,
                    is_subscribed: plan.is_subscribed || false,
                    subscription_end_date: plan.subscription_end_date || null,
                    plan_badges: plan.plan_badges || '',
                    features: plan.features || [],
                    plan_categories: plan.plan_categories || [],
                }));

                setPlans(plansData);

                if (plansData.length > 0 && !selectedPlan) {
                    setSelectedPlan(plansData[0].id);
                    setSelectedPlanData(plansData[0]);
                }
            } else {
                Toast.show({
                    type: 'error',
                    text1: t('error'),
                    text2: res?.data?.message || 'Failed to fetch subscription plans',
                });
                setPlans([]);
            }
        } catch (error: any) {
            console.error('Error fetching subscription plans:', error);
            Toast.show({
                type: 'error',
                text1: t('NetworkError'),
                text2: error.message || 'Network error occurred',
            });
            setPlans([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = (plan?: SubscriptionPlan) => {
        const planToSubscribe = plan || selectedPlanData;

        if (!planToSubscribe) {
            Toast.show({
                type: 'error',
                text1: t('error'),
                text2: 'Please select a plan first',
            });
            return;
        }

        if (planToSubscribe.is_subscribed) {
            Toast.show({
                type: 'info',
                text1: t('Subscription'),
                text2: 'You are already subscribed to this plan',
            });
            return;
        }

        navigation.navigate('Payment', {
            amount: planToSubscribe.price,
            purpose: 'subscription' as PaymentPurpose,
            planId: planToSubscribe.id.toString(),
            planName: planToSubscribe.name,
            planDuration: planToSubscribe.duration,
            customer: userinfo,
            metadata: {
                isSubscription: true,
                subscriptionPlanData: {
                    planId: planToSubscribe.id?.toString(),
                    planName: planToSubscribe.name,
                    duration: planToSubscribe.duration,
                    features: planToSubscribe.features.map(f => f.feature_title),
                },
            },
        });
    };

    const handleUpgradePress = () => {
        if (selectedPlanData) {
            handleSubscribe(selectedPlanData);
        } else {
            Toast.show({
                type: 'error',
                text1: t('error'),
                text2: 'Please select a plan first',
            });
        }
    };

    const handlePlanSelect = (plan: SubscriptionPlan) => {
        setSelectedPlan(plan.id);
        setSelectedPlanData(plan);
    };

    const getBadgeStyle = (badgeText: string) => {
        switch (badgeText?.toLowerCase()) {
            case 'most popular':
                return { backgroundColor: COLORS.btnbg };
            case 'recommended':
                return { backgroundColor: COLORS.btnbg };
            case 'best value':
                return { backgroundColor: COLORS.btnbg };
            default:
                return { backgroundColor: COLORS.btnbg };
        }
    };

    const renderFeatureGridItem = ({ item, index }: { item: Feature; index: number }) => (
        <View key={index} style={styles.featureGridCard}>
            <View style={styles.featureGridIcon}>
                <VectorIcon
                    name="checkcircle"
                    type="AntDesign"
                    size={14}
                    color={COLORS.btnbg}
                />
                <CustomText
                    type='default'
                    color={COLORS.textColor}
                    fontWeight='bold'
                    style={styles.featureGridTitle}
                >
                    {item.feature_title}
                </CustomText>
            </View>
            {item.feature_description && (
                <CustomText
                    type='small'
                    color={COLORS.disableText}
                    style={styles.featureGridDescription}
                >
                    {item.feature_description}
                </CustomText>
            )}
        </View>
    );

    const renderPlanCard = ({ item }: { item: SubscriptionPlan }) => {
        const isSelected = selectedPlan === item.id;

        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => handlePlanSelect(item)}
                style={[
                    styles.planCard,
                    isSelected && styles.selectedPlanCard,
                ]}
            >
                {item.plan_badges && !item.is_subscribed && (
                    <View
                        style={[
                            styles.popularBadge,
                            {
                                backgroundColor: isSelected
                                    ? COLORS.white
                                    : COLORS.btnbg,
                            },
                        ]}
                    >
                        <CustomText
                            type="small"
                            color={isSelected ? COLORS.btnbg : COLORS.white}
                            fontWeight="bold"
                        >
                            {item.plan_badges}
                        </CustomText>
                    </View>
                )}

                {item.is_subscribed && (
                    <View style={[styles.popularBadge, { backgroundColor: isSelected ? COLORS.white : COLORS.btnbg }]}>
                        <CustomText
                            type='small'
                            color={isSelected ? COLORS.btnbg : COLORS.white}
                            fontWeight='bold'
                        >
                            {'SUBSCRIBED'}
                        </CustomText>
                    </View>
                )}

                <CustomText
                    type='subHeading'
                    color={isSelected ? COLORS.white : COLORS.btnbg}
                    fontWeight='bold'
                    style={styles.planName}
                >
                    {item.name}
                </CustomText>

                <CustomText
                    type='default'
                    color={isSelected ? COLORS.white : COLORS.disableText}
                >
                    {item.duration}
                </CustomText>

                <CustomText
                    type='heading'
                    color={isSelected ? COLORS.white : COLORS.btnbg}
                    fontWeight='bold'
                    style={styles.planPrice}
                >
                    {item.price} SAR
                </CustomText>

                {item.subscription_end_date && item.is_subscribed && (
                    <CustomText
                        type='small'
                        color={isSelected ? COLORS.white : COLORS.disableText}
                    >
                        Valid: {formatDate(item.subscription_end_date)}
                    </CustomText>
                )}
            </TouchableOpacity>
        );
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch (error) {
            return 'Invalid Date';
        }
    };

    const getDisplayCategories = () => {
        if (selectedPlanData && selectedPlanData.plan_categories && selectedPlanData.plan_categories.length > 0) {
            return selectedPlanData.plan_categories;
        }
        if (plans.length > 0 && plans[0].plan_categories && plans[0].plan_categories.length > 0) {
            return plans[0].plan_categories;
        }
        return [];
    };

    const getDisplayFeatures = () => {
        if (selectedPlanData && selectedPlanData.features && selectedPlanData.features.length > 0) {
            return selectedPlanData.features;
        }
        if (plans.length > 0 && plans[0].features && plans[0].features.length > 0) {
            return plans[0].features;
        }
        return [];
    };

    // Handle header back button press
    const handleHeaderBackPress = () => {
        handleBackNavigation();
    };

    // Calculate display data AFTER all hooks
    const displayFeatures = getDisplayFeatures();
    const displayCategories = getDisplayCategories();

    // Loading state render (after all hooks)
    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleHeaderBackPress}>
                        <VectorIcon
                            size={30}
                            type="AntDesign"
                            name="left"
                            color={COLORS.black}
                        />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{t('premium')}</Text>
                    <View style={styles.placeholder} />
                </View>
                <View style={styles.loadingContainer}>
                    <Loader size='large' />
                </View>
            </SafeAreaView>
        );
    }

    // Main render
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleHeaderBackPress}>
                    <VectorIcon
                        size={30}
                        type="AntDesign"
                        name="left"
                        color={COLORS.black}
                        style={{ marginRight: horizontalScale(30) }}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('premium')}</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Premium Card Section */}
                <View style={styles.profileSection}>
                    <View style={styles.cardHeading}>
                        <Image source={IMAGES.premiumicon} resizeMode='contain' style={styles.iconImg} />
                        <CustomText type='heading' color={COLORS.premiumcolor}>{t('premiumhading')}</CustomText>
                    </View>
                    <CustomText style={styles.cardText} type='subTitle' color={COLORS.white}>
                        {t('unlockbenifit')}
                    </CustomText>
                    <CustomButton
                        style={styles.upgradeBtn}
                        title={t('upgrade')}
                        backgroundColor={COLORS.white}
                        textColor={COLORS.btnbg}
                        textSize='title'
                        onPress={() => handleSubscribe()}
                    />
                </View>

                {/* Why Premium Section - Features */}
                {displayFeatures.length > 0 && (
                    <>
                        <CustomText type='subHeading' color={COLORS.btnbg} fontWeight={'bold'} style={styles.sectionTitle}>
                            {t('whypremium')}
                        </CustomText>
                        <FlatList
                            data={displayFeatures}
                            renderItem={renderFeatureGridItem}
                            keyExtractor={(_, index) => index.toString()}
                            numColumns={2}
                            scrollEnabled={false}
                            contentContainerStyle={styles.benefitsGrid}
                            columnWrapperStyle={styles.benefitsRow}
                        />
                    </>
                )}

                {/* Included Categories Section */}
                {displayCategories.length > 0 && (
                    <>
                        <CustomText type='subHeading' color={COLORS.btnbg} fontWeight={'bold'} style={styles.sectionTitle}>
                            {t('includedCategories') || 'Included Categories'}
                        </CustomText>
                        <View style={styles.categoriesGrid}>
                            {displayCategories.map((item) => (
                                <View key={item.id} style={styles.categoryCard}>
                                    <CustomText type='default' color={COLORS.textColor} fontWeight='500'>
                                        {item.name}
                                    </CustomText>
                                </View>
                            ))}
                        </View>
                    </>
                )}

                {/* Choose Your Plan Section */}
                <CustomText type='subHeading' color={COLORS.btnbg} fontWeight={'bold'} style={styles.sectionTitle}>
                    {t('chooseYourPlan') || 'Choose your Plan'}
                </CustomText>

                <View style={styles.plansContainer}>
                    {plans.map((item) => (
                        <React.Fragment key={item.id}>
                            {renderPlanCard({ item })}
                        </React.Fragment>
                    ))}
                </View>

                {/* Start Membership Button */}
                <CustomButton
                    title={selectedPlanData?.is_subscribed ? 'Manage Subscription' : (t('startMembership') || 'Start Membership')}
                    backgroundColor={selectedPlan && !selectedPlanData?.is_subscribed ? COLORS.btnbg : COLORS.disableText}
                    textColor={COLORS.white}
                    onPress={handleUpgradePress}
                    disabled={!selectedPlan || selectedPlanData?.is_subscribed}
                    style={styles.startMembershipBtn}
                />

                {/* Terms Text */}
                <View style={styles.termsContainer}>
                    <CustomText type='small' color={COLORS.disableText} style={styles.termsText}>
                        {t('subscriptionRenewText')}
                    </CustomText>
                    <TouchableOpacity onPress={() => navigation.navigate('Terms')}>
                        <CustomText type='small' color={COLORS.btnbg} style={styles.termsLink}>
                            {t('termsConditions')}
                        </CustomText>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Subscriptionscreen;