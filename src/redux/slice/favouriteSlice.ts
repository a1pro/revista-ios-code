import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../types";

interface FavouriteState {
  favourites: Product[];
}

const initialState: FavouriteState = {
  favourites: [],
};

const favouriteSlice = createSlice({
  name: "favourite",
  initialState,
  reducers: {
    addFavourite(state, action: PayloadAction<Product>) {
      const exists = state.favourites.find(item => item.id === action.payload.id);
      if (!exists) {
        state.favourites.push(action.payload);
      }
    },
    removeFavourite(state, action: PayloadAction<{ id: Number }>) {
      state.favourites = state.favourites.filter(item => item.id !== action.payload.id);
    },
    clearFavourites(state) {
      state.favourites = [];
    },
    clearAll: (state) => {
  state.favourites = [];
},
  },
  
});

export const { addFavourite, removeFavourite, clearFavourites } = favouriteSlice.actions;
export default favouriteSlice.reducer;
