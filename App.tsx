import React, {useEffect, useState} from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import 'react-native-gesture-handler';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import 'react-native-reanimated';
import {
  Platform,
  LogBox,
  PermissionsAndroid,
  StatusBar,
  NativeModules,
} from 'react-native';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';
import {AuthProvider} from './src/context/AuthContext';
import Toast from 'react-native-toast-message';
import {I18nextProvider} from 'react-i18next';
import i18n from './src/context/i18n';
import {StripeProvider} from '@stripe/stripe-react-native';
import {MyFatoorahService} from './src/service/MyFatoorahService';
import {t} from 'i18next';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

LogBox.ignoreAllLogs();

// ==========================================
// CHECK NATIVE MODULES
// ==========================================

// Check if required native modules are available
const isNativeModuleAvailable = (moduleName: string): boolean => {
  return !!NativeModules[moduleName];
};

// ==========================================
// GLOBAL API CONFIGURATION
// ==========================================

/**
 * Get clean language code from i18n
 * Converts "en_IN,en;q=0.9" to "en"
 */
const getCleanLanguage = (): string => {
  try {
    let language = i18n.language || 'en';

    // Remove quality values (e.g., ";q=0.9")
    if (language.includes(';')) {
      language = language.split(';')[0].trim();
    }

    // Remove comma-separated values (e.g., "en_IN,en")
    if (language.includes(',')) {
      language = language.split(',')[0].trim();
    }

    // Remove region (e.g., "en_IN" -> "en")
    if (language.includes('_')) {
      language = language.split('_')[0];
    }

    // Remove region with dash (e.g., "en-US" -> "en")
    if (language.includes('-')) {
      language = language.split('-')[0];
    }

    // Ensure language is supported
    if (language !== 'en' && language !== 'ar') {
      language = 'en';
    }

    return language;
  } catch (error) {
    console.warn('⚠️ Error getting language:', error);
    return 'en';
  }
};

/**
 * Get auth token from storage
 */
const getAuthToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    return token;
  } catch (error) {
    console.warn('⚠️ Error getting auth token:', error);
    return null;
  }
};

/**
 * Set up global axios interceptors
 */
const setupAxiosInterceptors = () => {
  // Request interceptor - adds language and token to every request
  axios.interceptors.request.use(
    async config => {
      // Add language header
      const language = getCleanLanguage();
      config.headers['Accept-Language'] = language;

      // Add auth token if available
      const token = await getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );

  // Response interceptor - handles global errors
  axios.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      if (error.response) {
        // Server responded with error
        const status = error.response.status;

        switch (status) {
          case 401:
            // Unauthorized - clear token and redirect to login
            // console.log('🔒 Session expired. Please login again.');
            AsyncStorage.removeItem('authToken');
            break;
          case 500:
            console.error('Server error:', error.response.data);
            break;
          default:
            console.error(`API Error ${status}:`, error.response.data);
        }
      } else if (error.request) {
        // No response from server
        console.error('No response from server:', error.request);
      } else {
        // Request setup error
        console.error('Request error:', error.message);
      }

      return Promise.reject(error);
    },
  );

  // Listen for language changes and update headers
  i18n.on('languageChanged', lng => {
    const cleanLanguage = getCleanLanguage();
    axios.defaults.headers.common['Accept-Language'] = cleanLanguage;
    // console.log(`🌐 Language updated to: ${cleanLanguage}`);
  });

  // console.log('✅ Axios interceptors configured successfully');
};

// ==========================================
// PERMISSIONS
// ==========================================

const requestAppPermissions = async (): Promise<boolean> => {
  try {
    // Check if permissions module is available
    if (!NativeModules.RNPermissions) {
      console.warn('⚠️ RNPermissions module not available');
      return true; // Continue without permissions
    }

    if (Platform.OS !== 'android') return true;

    if (Platform.Version >= 33) {
      await request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
      await request(PERMISSIONS.ANDROID.CAMERA);
      const storageResult = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs storage access to save PDFs and invoices.',
          buttonNeutral: 'Ask Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      return storageResult === PermissionsAndroid.RESULTS.GRANTED;
    } else if (Platform.Version >= 29) {
      const readResult = await request(
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      );
      const cameraResult = await request(PERMISSIONS.ANDROID.CAMERA);
      const writeResult = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      return (
        readResult === RESULTS.GRANTED &&
        writeResult === PermissionsAndroid.RESULTS.GRANTED
      );
    }
    // Android < 10
    else {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);
      const allGranted = Object.values(result).every(
        status => status === PermissionsAndroid.RESULTS.GRANTED,
      );
      return allGranted;
    }
  } catch (error) {
    console.error('❌ Permission error:', error);
    return false;
  }
};

// ==========================================
// INITIALIZE MYFATOORAH SAFELY
// ==========================================

const initializeMyFatoorah = async (): Promise<boolean> => {
  try {
    // Check if MyFatoorah native module is available
    if (!NativeModules.MyFatoorahService) {
      console.warn('⚠️ MyFatoorahService native module not available');
      return false;
    }

    const initialized = await MyFatoorahService.initialize();
    // if (initialized) {
    //   console.log('✅ MyFatoorahService initialized successfully');
    // } else {
    //   console.warn('⚠️ MyFatoorahService initialization returned false');
    // }
    return initialized;
  } catch (error) {
    console.warn('⚠️ MyFatoorahService initialization failed:', error);
    return false;
  }
};

// ==========================================
// APP COMPONENT
// ==========================================

export default function App() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // Set up global axios interceptors
    setupAxiosInterceptors();

    const initializeApp = async () => {
      try {
        // console.log('🚀 Initializing app...');

        // 1. Request permissions (skip if module not available)
        let hasPermissions = true;
        try {
          hasPermissions = await requestAppPermissions();
          if (!hasPermissions) {
            Toast.show({
              type: 'error',
              text1: t('error'),
              text2: t('PermissionsRequired'),
            });
          }
        } catch (permError) {
          console.warn('⚠️ Permission error, continuing:', permError);
          hasPermissions = true; // Continue anyway
        }

        // 2. Initialize MyFatoorah (optional - continues if fails)
        await initializeMyFatoorah();

        // 3. Set initial language header
        const initialLanguage = getCleanLanguage();
        axios.defaults.headers.common['Accept-Language'] = initialLanguage;
        // console.log(`🌐 Initial language set to: ${initialLanguage}`);

        // 4. App is ready
        setAppReady(true);
        // console.log('✅ App initialized successfully');
      } catch (error) {
        console.error('❌ App initialization failed:', error);

        Toast.show({
          type: 'error',
          text1: 'Initialization Error',
          text2:
            'App failed to initialize properly. Some features may not work.',
        });

        // Still show app even if initialization fails
        setAppReady(true);
      }
    };

    // Delay initialization to ensure all modules are loaded
    setTimeout(initializeApp, 100);

    // Cleanup function
    return () => {
      // Remove language listener
      i18n.off('languageChanged');
    };
  }, []);

  // Show loading screen while app initializes
  if (!appReady) {
    return null;
  }

  const isDarkMode = false;

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <SafeAreaProvider>
          <AuthProvider>
            <StripeProvider publishableKey="pk_test_51JZY5CSCqlwwKkyVzOcjCof5WPcRz6oBX4QWBRyGdMHe8dd6MjpDfFV1W5iWf5qhSHJmPrlFcRY4NOZzsiWU1XRH00xlas7QiI">
              <GestureHandlerRootView style={{flex: 1}}>
                <StatusBar
                  backgroundColor={isDarkMode ? '#1a1a1a' : '#F8F9FA'}
                  barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                  translucent={false}
                />
                <SafeAreaView
                  style={{
                    flex: 1,
                    backgroundColor: isDarkMode ? '#1a1a1a' : '#F8F9FA',
                  }}>
                  <AppNavigator />
                </SafeAreaView>
                <Toast />
              </GestureHandlerRootView>
            </StripeProvider>
          </AuthProvider>
        </SafeAreaProvider>
      </I18nextProvider>
    </Provider>
  );
}

// Export helper functions for use in other files
export {getCleanLanguage};
