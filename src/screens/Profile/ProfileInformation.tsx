
import React, { useCallback, useState } from 'react';
import {
    View,
    Image,
    ScrollView,
    TouchableOpacity,
} from 'react-native';

import { CustomText } from '../../components/CustomText';
import CustomButton from '../../components/Buttons/CustomButton';
import COLORS from '../../utils/Colors';
import IMAGES from '../../assets/images';
import { styles } from './profieinfostyle';
import { base_url, Base_Url } from '../../utils/ApiUrl';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { verticalScale } from '../../utils/Metrics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VectorIcon from '../../components/VectorIcon';
import { t } from 'i18next';
import { useFocusEffect } from '@react-navigation/native';
import Loader from '../../components/Loader';
import { SafeAreaView } from 'react-native-safe-area-context';

type props = NativeStackScreenProps<RootStackParamList, 'Profileinfo'>;

const ProfileInformation: React.FC<props> = ({ navigation }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [imageLoading, setImageLoading] = useState<boolean>(true);
    const [imageError, setImageError] = useState<boolean>(false);
    const [userinfo, setuserinfo] = useState<any>({
        name: '',
        l_name: '',
        f_name: '',
        email: '',
        phone: '',
        image: IMAGES.imgplaceholder,
    });

    const profileinfo = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');

            if (token) {
                const res = await axios.get(Base_Url.getProfile, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setuserinfo(res?.data?.customer);
            }
        } catch (error: any) {
            console.log(error.message);
        } finally {
            setLoading(false);
        }
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

    useFocusEffect(
        useCallback(() => {
            profileinfo();
            // Reset image loading state when profile loads
            setImageLoading(true);
            setImageError(false);
        }, [])
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <Loader fullScreen size="large" />
            </SafeAreaView>
        );
    }

    // Determine the image source
    const getImageSource = () => {
        if (userinfo?.image && userinfo.image.trim() !== '') {
            return { uri: `${base_url}/${userinfo.image}` };
        }
        return IMAGES.imgplaceholder;
    };

    // Check if we should show placeholder
    const showPlaceholder = imageLoading || imageError || !userinfo?.image || userinfo.image.trim() === '';

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <VectorIcon
                        name="chevron-thin-left"
                        type="Entypo"
                        size={24}
                        color={COLORS.black}
                    />
                </TouchableOpacity>

                <CustomText
                    type="subHeading"
                    fontWeight="bold"
                    color={COLORS.black}
                >
                    {t('profile')}
                </CustomText>

                <View />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View >
                        {showPlaceholder && (
                            <Image
                                source={IMAGES.imgplaceholder}
                                style={styles.avatar}
                            />
                        )}

                        {!imageError && userinfo?.image && userinfo.image.trim() !== '' && (
                            <Image
                                source={getImageSource()}
                                style={[
                                    styles.avatar,
                                    { opacity: imageLoading ? 0 : 1 }
                                ]}
                                onLoadStart={() => {
                                    setImageLoading(true);
                                    setImageError(false);
                                }}
                                onLoad={() => {
                                    setImageLoading(false);
                                    setImageError(false);
                                }}
                                onError={() => {
                                    setImageError(true);
                                    setImageLoading(false);
                                }}
                            />
                        )}
                    </View>

                    <CustomText
                        type="title"
                        fontWeight="bold"
                        color={COLORS.black}
                        style={styles.userName}
                    >
                        {`${userinfo.f_name} ${userinfo.l_name}`}
                    </CustomText>

                    <CustomText
                        type="default"
                        color={COLORS.headertext}
                    >
                        {userinfo.email}
                    </CustomText>
                </View>

                <View style={styles.infoCard}>
                    <InfoRow
                        label={t('fullname')}
                        value={`${userinfo.f_name} ${userinfo.l_name}`}
                    />

                    <InfoRow
                        label={t('email')}
                        value={userinfo.email}
                    />

                    <InfoRow
                        label={t('phonenumber')}
                        value={userinfo.phone}
                    />

                    <InfoRow
                        label={t('membersince')}
                        value={formatLocalDate(userinfo.created_at)}
                        isLast
                    />
                </View>

                {/* Button */}
                <CustomButton
                    title={t('editProfile')}
                    onPress={() => navigation.navigate('EditProfile' as any, { userData: userinfo })}
                    style={{ ...styles.editButton, paddingVertical: verticalScale(1) }}
                    backgroundColor={COLORS.btnbg}
                    textColor={COLORS.white}
                    textSize="title"
                />
            </ScrollView>
        </SafeAreaView>
    );
};

const InfoRow = ({
    label,
    value,
    isLast = false,
}: {
    label: string;
    value: string;
    isLast?: boolean;
}) => (
    <View
        style={[
            styles.infoRow,
            !isLast && styles.borderBottom,
        ]}
    >
        <CustomText
            type="default"
            color={COLORS.headertext}
        >
            {label}
        </CustomText>

        <CustomText
            type="default"
            fontWeight="600"
            color={COLORS.black}
        >
            {value}
        </CustomText>
    </View>
);

export default ProfileInformation;