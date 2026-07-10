
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, I18nManager } from 'react-native';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from './style';
import COLORS from '../../utils/Colors';
import { CustomText } from '../../components/CustomText';
import { RootStackParamList } from '../../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import VectorIcon from '../../components/VectorIcon';
import { SafeAreaView } from 'react-native-safe-area-context';    
import { LanguageUtils } from '../../utils/LanguageUtils';

const LANGUAGES = [
  { key: 'en', label: 'English' },
  { key: 'sa', label: 'Arabic' },
];
console.log(LANGUAGES.map(()=> console.log()))
type Props = NativeStackScreenProps<RootStackParamList, 'Language'>;

const Language: React.FC<Props> = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const [selected, setSelected] = useState<string>('en');
  const [isLoading, setIsLoading] = useState(true);
  
console.log('selected:',selected)

  useEffect(() => {
    initializeLanguage();
    
  }, []);

  const initializeLanguage = async () => {
    try {
      const savedLanguage = await LanguageUtils.loadLanguage();
      if (savedLanguage) {
        setSelected(savedLanguage);
          await AsyncStorage.setItem('language', savedLanguage) 
        // Apply the language without showing toast
        console.log('savedlanguage:',savedLanguage)
        LanguageUtils.applyLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Error initializing language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSelectLanguage = async (langKey: string) => {
    try {
      setSelected(langKey);
         await AsyncStorage.setItem('language', langKey);
await AsyncStorage.setItem('langKey', langKey);
      
      // Apply language changes
      LanguageUtils.applyLanguage(langKey);
      
      // Save to AsyncStorage
      await LanguageUtils.saveLanguage(langKey);
      
      // Show success toast
      Toast.show({
        type: 'success',
        text1: t('success'),
        text2: t('changeLanguageSuccess'),
      });
    } catch (error) {
      console.error('Error changing language:', error);
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: t('changeLanguageError'),
      });
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <CustomText>{t('loading')}</CustomText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <VectorIcon
            type="AntDesign"
            name={I18nManager.isRTL ? "right" : "left"}
            size={24}
            color={COLORS.textColor}
          />
        </TouchableOpacity>

        <CustomText
          type="heading"
          color={COLORS.textColor}
          fontWeight="bold"
          style={styles.header}>
          {t('language')}
        </CustomText>
        
        <View style={styles.optionsContainer}>
          {LANGUAGES.map(lang => (
            <TouchableOpacity
              key={lang.key}
              style={[
                styles.option,
                selected === lang.key && styles.optionSelected,
              ]}
              onPress={() => onSelectLanguage(lang.key)}
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.optionText,
                  selected === lang.key && styles.optionTextSelected,
                ]}>
                {lang.label}
              </Text>
              <View style={styles.iconContainer}>
                {selected === lang.key ? (
                  <VectorIcon
                    type="Ionicons"
                    name="radio-button-on"
                    size={22}
                    color="#2676FD"
                  />
                ) : (
                  <VectorIcon
                    type="Ionicons"
                    name="radio-button-off"
                    size={22}
                    color="#E2E4E9"
                  />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Language;