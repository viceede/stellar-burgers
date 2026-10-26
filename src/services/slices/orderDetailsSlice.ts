import { getOrderByNumberApi } from '@/utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TOrderDetailsState } from '@/utils/types';

const initialState: TOrderDetailsState = {
  order: null,
  isLoading: false,
  error: null,
};

export const getOrderDetails = createAsyncThunk(
  'orderDetails/getOrderDetails',
  async (number: number, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(number);

      if (!response.success || response.orders.length === 0) {
        return rejectWithValue('Заказ не найден');
      }

      const order = response.orders.find((item) => item.number === number);

      if (!order) {
        return rejectWithValue('Заказ не найден');
      }

      return order;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Не удалось загрузить информацию о заказе'
      );
    }
  }
);

const orderDetailsSlice = createSlice({
  name: 'orderDetails',
  initialState,
  reducers: {
    clearOrderDetails: (state) => {
      state.order = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  selectors: {
    selectOrderDetails: (state) => state.order,
    selectOrderDetailsLoadingState: (state) => state.isLoading,
    selectOrderDetailsError: (state) => state.error,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.order = null;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.order = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : (action.error.message ?? 'Не удалось загрузить заказ');
      });
  },
});

export const { clearOrderDetails } = orderDetailsSlice.actions;

export const {
  selectOrderDetails,
  selectOrderDetailsLoadingState,
  selectOrderDetailsError,
} = orderDetailsSlice.selectors;

export default orderDetailsSlice.reducer;
