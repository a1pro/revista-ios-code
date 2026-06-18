import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  images: string[];
  discount: number;
  discount_type: string;
  tax: number;
  shipping_cost: number;
}

interface Order {
  items: OrderItem[];
  total: number;
  timestamp: string;
  address?: string;
  paymentMethod: string;
}

interface OrdersState {
  orders: Order[];
}

const initialState: OrdersState = {
  orders: [],
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.push(action.payload);
    },
  },
});

export const { addOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
