import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import { I18nManager } from 'react-native';

const LANGUAGE_KEY = 'appLanguage';

export const LanguageUtils = {
  // Save language to AsyncStorage
  saveLanguage: async (langKey: string) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, langKey);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  },

  // Load language from AsyncStorage
  loadLanguage: async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      return savedLanguage;
    } catch (error) {
      console.error('Error loading language:', error);
      return null;
    }
  },

  // Apply language (change i18n and RTL settings)
  applyLanguage: (langKey: string) => {
    const i18nLang = langKey === 'sa' ? 'ar' : langKey;
    
    // Change i18n language
    i18n.changeLanguage(i18nLang);
    
    // Handle RTL for Arabic
    const isRTL = i18nLang === 'ar';
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
    
    // Return the i18n language code
    return i18nLang;
  },

  // Initialize language on app start
  initializeLanguage: async () => {
    const savedLanguage = await LanguageUtils.loadLanguage();
    const defaultLanguage = savedLanguage || 'en';
    
    // Apply the saved language
    LanguageUtils.applyLanguage(defaultLanguage);
    
    return defaultLanguage;
  }
};