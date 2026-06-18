import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../types";

interface CartState {
  cartItems: Product[];
}

const initialState: CartState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addCartItem(state, action: PayloadAction<Product>) {
      // Check if product already in cart
      const exists = state.cartItems.find(item => item.id === action.payload.id);
      if (!exists) {
        state.cartItems.push(action.payload);
      }
    },
    removeCartItem(state, action: PayloadAction<{ id: string }>) {
      state.cartItems = state.cartItems.filter(item => item.id !== action.payload.id);
    },
    clearCart(state) {
      state.cartItems = [];
    },
  },
});

export const { addCartItem, removeCartItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
