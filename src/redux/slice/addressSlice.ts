import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Address {
  id: string;
  address: string;
  city: string;
  postcode: string;
  phone: string;
}

interface AddressState {
  addresses: Address[];
  selectedId: string | null;
}


const initialState: AddressState = {
  addresses: [],
  selectedId: null,
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    addAddress(state, action: PayloadAction<Address>) {
      state.addresses.push(action.payload);
      // Optionally set as selected if it's the first address
      if (state.addresses.length === 1) {
        state.selectedId = action.payload.id;
      }
    },
    removeAddress(state, action: PayloadAction<string>) {
      state.addresses = state.addresses.filter(addr => addr.id !== action.payload);
      // If the removed address was selected, reset selectedId
      if (state.selectedId === action.payload) {
        state.selectedId = state.addresses.length > 0 ? state.addresses[0].id : null;
      }
    },
    selectAddress(state, action: PayloadAction<string>) {
      state.selectedId = action.payload;
    },
    updateAddress(state, action: PayloadAction<Address>) {
      const idx = state.addresses.findIndex(addr => addr.id === action.payload.id);
      if (idx !== -1) {
        state.addresses[idx] = action.payload;
      }
    },
  },
});

export const { addAddress, removeAddress, selectAddress, updateAddress } = addressSlice.actions;
export default addressSlice.reducer;
