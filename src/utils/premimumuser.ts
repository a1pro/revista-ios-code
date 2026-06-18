import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Base_Url } from './ApiUrl';
import { t } from 'i18next';
import Toast from 'react-native-toast-message';

interface Plan {
  id: number;
  name: string;
  price: number;
  type: number;
  status: number;
  duration: string;
  is_subscribed: boolean;
  subscription_end_date: string | null;
  [key: string]: any;
}

interface PremiumCheckResult {
  isPremium: boolean;
  premiumPlan: Plan | null;
  allPlans: Plan[];
  message?: string;
}

/**
 * Check if user has active Premium subscription
 * @returns Promise<PremiumCheckResult>
 */
export const checkPremiumStatus = async (): Promise<PremiumCheckResult> => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (!token) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: t('noToken'),
      });
      return {
        isPremium: false,
        premiumPlan: null,
        allPlans: [],
        message: 'User not logged in',
      };
    }
    const response = await axios.get(Base_Url.subscriptionplan, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response?.data?.status) {
      const plans: Plan[] = response.data.plans;
      const premiumPlan = plans.find((plan: Plan) => plan.is_subscribed === true);

      if (premiumPlan) {
        if (premiumPlan.is_subscribed === true) {
          return {
            isPremium: true,
            premiumPlan: premiumPlan,
            allPlans: plans,
            message: 'Active Premium subscription found',
          };
        } else {
          return {
            isPremium: false,
            premiumPlan: premiumPlan,
            allPlans: plans,
            message: 'Premium plan exists but not subscribed',
          };
        }
      } else {
        return {
          isPremium: false,
          premiumPlan: null,
          allPlans: plans,
          message: 'No Premium plan found',
        };
      }
    } else {
      return {
        isPremium: false,
        premiumPlan: null,
        allPlans: [],
        message: 'API response status is false',
      };
    }
  } catch (error: any) {
    return {
      isPremium: false,
      premiumPlan: null,
      allPlans: [],
      message: `Error: ${error.message || 'Unknown error'}`,
    };
  }
};

export const isUserPremium = async (): Promise<boolean> => {
  const result = await checkPremiumStatus();
  return result.isPremium;
};
let premiumCache: {
  isPremium: boolean;
  premiumPlan: Plan | null;
  timestamp: number;
} | null = null;

const CACHE_DURATION = 5 * 60 * 1000;

export const getCachedPremiumStatus = async (): Promise<PremiumCheckResult> => {
  if (premiumCache && (Date.now() - premiumCache.timestamp) < CACHE_DURATION) {
    return {
      isPremium: premiumCache.isPremium,
      premiumPlan: premiumCache.premiumPlan,
      allPlans: [],
      message: 'From cache',
    };
  }
  const result = await checkPremiumStatus();

  premiumCache = {
    isPremium: result.isPremium,
    premiumPlan: result.premiumPlan,
    timestamp: Date.now(),
  };
  return result;
};

export const primeicon = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const result = await axios.get(Base_Url.primemember, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return result?.data;
  } catch (error:any) {

console.log(error);
  }
};
