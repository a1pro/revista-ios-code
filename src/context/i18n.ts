import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { NativeModules, Platform } from 'react-native';

import en from './en.json';
import ar from './ar.json';

/**
 * Get device language in a clean format
 */
const getDeviceLanguage = (): string => {
  try {
    let language = 'en';

    if (Platform.OS === 'ios') {
      const nativeLanguage = NativeModules.SettingsManager?.settings?.AppleLocale ||
        NativeModules.SettingsManager?.settings?.AppleLanguages?.[0] ||
        'en';
      language = nativeLanguage.split('-')[0].split('_')[0];
    } else if (Platform.OS === 'android') {
      const nativeLanguage = NativeModules.I18nManager?.localeIdentifier || 'en';
      language = nativeLanguage.split('_')[0].split('-')[0];
    }

    if (language !== 'en' && language !== 'ar') {
      language = 'en';
    }

    return language;
  } catch (error) {
    console.warn('⚠️ Error getting device language:', error);
    return 'en';
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    lng: getDeviceLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['navigator'],
      caches: [],
    },
    load: 'currentOnly',
    preload: [],
  });

export const getCleanLanguage = (): string => {
  let language = i18n.language || 'en';
  if (language.includes(';')) language = language.split(';')[0].trim();
  if (language.includes(',')) language = language.split(',')[0].trim();
  if (language.includes('_')) language = language.split('_')[0];
  if (language.includes('-')) language = language.split('-')[0];
  return (language === 'en' || language === 'ar') ? language : 'en';
};

export default i18n;