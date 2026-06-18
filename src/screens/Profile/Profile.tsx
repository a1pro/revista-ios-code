import React, { JSX, useCallback } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { CustomText } from '../../components/CustomText';
import CustomButton from '../../components/Buttons/CustomButton';
import VectorIcon from '../../components/VectorIcon';
import IMAGES from '../../assets/images';
import COLORS from '../../utils/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Base_Url } from '../../utils/ApiUrl';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import { styles } from './style';
import { verticalScale } from '../../utils/Metrics';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const Profile: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();

  const handleLogout = async () => {
    Alert.alert(t('logout'), t('logoutConfirm'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('logout'),
        style: 'destructive',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('token');
            if (!token) return;

            const response = await axios.post(Base_Url.logout, {}, {
              headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.message === 'Successfully logged out') {
              await AsyncStorage.removeItem('token');
              navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            }
          } catch (error) {
            Toast.show({
              type: 'error',
              text1: t('error'),
              text2: t('logoutFailed'),
            });
          }
        },
      },
    ]);
  };

  const renderRow = (iconName: string, title: string, screen?: string, rightIcon?: JSX.Element) => (
  <>
    <TouchableOpacity
      style={styles.rowSection}
      onPress={() => {
        if (screen) navigation.navigate(screen as any);
      }}
    >
      <View style={styles.iconName}>
        <View style={styles.icon}>
          <VectorIcon name={iconName} size={25} type='Feather' />
        </View>
        <View style={styles.content}>
          <CustomText type='title' color={COLORS.black}>{title}</CustomText>
        </View>
      </View>
      {rightIcon}
    </TouchableOpacity>
    <View style={styles.horizontalBar} />
  </>
);

  return (
    <SafeAreaView style={styles.container}>

      <CustomText
        type="heading"
        color={COLORS.textColor}
        fontWeight="bold"
        style={styles.headerText}
        >
        {t('account')}
      </CustomText>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Premium Card */}
        <View style={styles.profileSection}>
          <View style={styles.cardHeading}>
            <Image source={IMAGES.premiumicon} resizeMode='contain' style={styles.iconImg} />
            <CustomText type='heading' color={COLORS.premiumcolor}>{t('premiumhading')}</CustomText>
          </View>
          <CustomText style={styles.cardText} type='subTitle' color={COLORS.white}>{t('premshorcont')}</CustomText>
          <CustomButton
            style={{ ...styles.upgradeBtn, paddingVertical: verticalScale(1) }}
            title={t('upgrade')}
            backgroundColor={COLORS.white}
            textColor={COLORS.btnbg}
            textSize='title'
            onPress={() => navigation.navigate('Subscriptionscreen')} />

        </View>

        {/* Section 1 */}
<View style={styles.middleCard}>
  {renderRow('user', t('profileinfo'), 'Profileinfo', <VectorIcon name='arrow-right' size={25} type='Feather' color={COLORS.placeholder} />)}
  {renderRow('shield', t('privacysec'), 'Privacypolicy', <VectorIcon name='arrow-right' size={25} type='Feather' color={COLORS.placeholder} />)}
  {renderRow('credit-card', t('subBill'), 'Subscriptionscreen', <VectorIcon name='arrow-right' size={25} type='Feather' color={COLORS.placeholder} />)}
</View>

{/* Section 2 */}
<View style={styles.middleCard}>
  {renderRow('heart', t('wishlist'),'WishList', <VectorIcon name='arrow-right' size={25} type='Feather' color={COLORS.placeholder} />)}
  {renderRow('truck', t('myOrders'), 'Order', <VectorIcon name='arrow-right' size={25} type='Feather' color={COLORS.placeholder} />)}
  {renderRow('globe', t('language'), 'Language', <CustomText type='default' color={COLORS.placeholder}>English</CustomText>)}
 
</View>

        <CustomButton title={t('logout')} onPress={() => handleLogout()}></CustomButton>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;