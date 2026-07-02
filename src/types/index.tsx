export type Category = {
  id: string;
  name: string;
  [key: string]: any;
};

import { CustomerDetails, PaymentItem, PaymentPurpose } from '../service/paymentTypes';

export type Product = {
  quantity: number;
  id: string;
  name: string;
  image: any;
  price: number;
};

export type UserChat = {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: string;
  lastTime?: string;
  type?: 'vendor' | 'deliveryman';
};

export interface Seller {
  id: string;
  name: string;
  rating: number;
  image: string;
  // Add other seller properties as needed
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: any;
  // Add other cart item properties as needed
}

export interface OrderItem {
  discount_type: string;
  discount: number;
  tax: number;
  shipping_cost: number;
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: any;
  // Add other order item properties as needed
}

export interface Order {
  id?: string;
  items: OrderItem[];
  total: number;
  timestamp: string;
  address?: any;
  paymentMethod: string;
  paymentStatus?: 'pending' | 'paid' | 'failed';
}
export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPass:undefined;
  BannerSlider: undefined;
  Home: undefined;
  Dashboard: undefined;
  HomemadeProducts: undefined;
  AllCategories: undefined;
  SubCategories: { category: Category };
  Details: { subCategory: string };
  ProductDetails: { product: Product };
  Profile: undefined;
  AddtoCart: undefined;
  Magzine: undefined;
  EditProfile: { userData: any };
  WishList: undefined;
  Address: undefined;
  Order: undefined;
  Language: undefined;
  SaveAddress: undefined;
  Terms: undefined;
  FlashSale: undefined;
  MagazineProduct: { categoryId: number };
  AllSellerScreen: undefined;
  TopSellers: undefined;
  SellerDetails: { seller: Seller };
  Inbox: undefined;
  ChatScreen: { user: UserChat };
  CheckoutScreen: { cartItems: CartItem[]; total: number };
  Seller: undefined;
  AllLatestProducts: undefined;
  CategorySection2: undefined;
  HandmadeSubcategories: undefined;
  Subscriptionscreen: undefined;
  HandmadeProducts: undefined;
  Subscription: undefined;
  BrandedProductSubCategories: undefined;
  ProductReviewScreen:undefined
  // PremiumCheckout:undefined
  Privacypolicy:undefined
  Profileinfo:undefined
  Payment: {
    amount: number;
    purpose: PaymentPurpose;
    customer?: CustomerDetails;
    items?: PaymentItem[];
    orderId?: string;
    subscriptionId?: string;
    planId?: string;
    planName?: string;
    planDuration?: string;
    metadata?: {
      cartItems?: any[];
      totalTax?: number;
      totalShipping?: number;
      couponDiscount?: number;
      isSubscription?: boolean;
      subscriptionPlanData?: {
        planId: string;
        planName: string;
        duration: string;
        features?: string[];
      };
      [key: string]: any;
    };
    onSuccess?: (data: any) => void;
    onFailure?: (error: string) => void;
  };
  plan?: {
    id: string;
    name: string;
    amount: number;
    currency: string;
    duration: string;
    benefits?: string[];
  
  };
  PaymentSuccess: {
    invoiceId: string;
    amount: number;
    customer: CustomerDetails;
    purpose: string;
    paymentType: 'instant' | 'link';
    transactionId?: string;
  };

   Invoice: {
    id: number;
    order_group_id: string;
    created_at: string;
    order_amount: number;
    payment_status: string;
    order_status: string;
    payment_method: string;
    transaction_ref: string;
    details: Array<{
      id: number;
      product: {
        name: string;
        unit_price: number;
        tax: number;
        discount_type: string;
      };
      qty: number;
      price: number;
      discount: number;
      tax: number;
    }>;
    shipping_address_data: string;
    customer_type: string;
    shipping_cost: number;
    discount_amount: number;
  };

  
};
