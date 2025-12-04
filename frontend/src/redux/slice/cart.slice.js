import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartService } from '../../api/cartService.js';

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (privateClient, { rejectWithValue }) => {
    try {
      if (!privateClient) {
        console.error('❌ No privateClient provided to fetchCart');
        return rejectWithValue('No authentication client available');
      }
      console.log('🛒 Fetching cart...');
      const response = await cartService.getCart(privateClient);
      console.log('🛒 Cart API response:', response.data?.data);
      return response.data?.data;
    } catch (error) {
      console.error('🛒 Cart fetch error:', error);
      return rejectWithValue(error.response?.data || error.message || 'Failed to fetch cart');
    }
  }
);

const initialState = {
  shops: [],
  summary: null,
  loading: false,
  error: null,
  lastUpdated: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.shops = action.payload?.shops || [];
        state.summary = action.payload?.summary || null;
        state.lastUpdated = new Date().toISOString();
        console.log('✅ Cart updated with shops:', action.payload?.shops);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error('❌ Cart fetch rejected:', action.payload);
      });
  }
});

export const { clearError } = cartSlice.actions;
export default cartSlice.reducer;
