import { getFeedsApi } from '@/utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TFeedState } from '@/utils/types';

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
};

export const getFeeds = createAsyncThunk(
  'feed/getFeeds',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFeedsApi();

      return {
        orders: response.orders,
        total: response.total,
        totalToday: response.totalToday,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Не удалось загрузить ленту заказов'
      );
    }
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {
    selectOrders: (state) => state.orders,
    selectTotal: (state) => state.total,
    selectTotalToday: (state) => state.totalToday,
    selectFeedLoading: (state) => state.isLoading,
    selectFeedError: (state) => state.error,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? action.error.message ?? 'Произошла ошибка';
      });
  },
});

export const {
  selectOrders,
  selectTotal,
  selectTotalToday,
  selectFeedLoading,
  selectFeedError,
} = feedSlice.selectors;

export default feedSlice.reducer;
