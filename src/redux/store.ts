import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slice/cartSlice";
import favouriteReducer from "./slice/favouriteSlice";
import addressReducer from './slice/addressSlice'
 import ordersReducer from './slice/ordersSlice'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    favourite: favouriteReducer,
     address: addressReducer,
      orders: ordersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;