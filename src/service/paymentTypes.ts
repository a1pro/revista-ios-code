export interface CustomerDetails {
  phone: string;
  name: string;
  email: string;
  mobile: string;
  address?: string;
}

export interface PaymentItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  type: 'product' | 'subscription';
}

export interface PaymentRequest {
  amount: number;
  currency?: string;
  customer: CustomerDetails;
  items: PaymentItem[];
  orderId?: string;
  subscriptionId?: string;
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  [x: string]: any;
  success: boolean;
  invoiceId?: string;
  paymentUrl?: string;
  error?: string;
  data?: any;
}


export interface PaymentItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  description?: string;
}

export type PaymentPurpose =
  | 'subscription'
  | 'purchase'
  | 'donation'
  | 'service'
  | 'other'
  | string;

export interface PaymentRequest {
  amount: number;
  customer: CustomerDetails;
  items: PaymentItem[];
  orderId?: string;
  subscriptionId?: string;
  metadata?: {
    [key: string]: any;
  };
}

