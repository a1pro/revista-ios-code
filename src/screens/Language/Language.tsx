import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, I18nManager } from 'react-native';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';

import styles from './style';
import COLORS from '../../utils/Colors';
import { CustomText } from '../../components/CustomText';
import { RootStackParamList } from '../../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import VectorIcon from '../../components/VectorIcon';

const LANGUAGES = [
  { key: 'en', label: 'English' },
  { key: 'sa', label: 'Arabic' },
];

type Props = NativeStackScreenProps<RootStackParamList, 'Language'>;

const Language: React.FC<Props> = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const [selected, setSelected] = useState<string>('en');

  // Optional: Load saved language from AsyncStorage on mount
  useEffect(() => {
    // Example using AsyncStorage:
    // AsyncStorage.getItem('appLanguage').then(lang => {
    //   if (lang) {
    //     setSelected(lang);
    //     const i18nLang = lang === 'sa' ? 'ar' : lang;
    //     i18n.changeLanguage(i18nLang);
    //     I18nManager.allowRTL(i18nLang === 'ar');
    //     I18nManager.forceRTL(i18nLang === 'ar');
    //   }
    // });
  }, []);

  const onSelectLanguage = (langKey: string) => {
    setSelected(langKey);
    // Map 'sa' to 'ar' for i18n
    const i18nLang = langKey === 'sa' ? 'ar' : langKey;
    i18n.changeLanguage(i18nLang);
    I18nManager.allowRTL(i18nLang === 'ar');
    I18nManager.forceRTL(i18nLang === 'ar');
    // Optional: Save language to AsyncStorage
    // AsyncStorage.setItem('appLanguage', langKey);
    Toast.show({
      type: 'success',
      text1: t('success'),
      text2: t('changeLanguageSuccess'),
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <VectorIcon
            type="AntDesign"
            name="left"
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
