import { orderBurgerApi } from '@/utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TNewOrderState } from '@/utils/types';

const initialState: TNewOrderState = {
  order: null,
  name: null,
  isLoading: false,
  error: null,
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredients: string[], { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredients);

      if (!response.success) {
        return rejectWithValue('Не удалось оформить заказ');
      }

      return {
        order: response.order,
        name: response.name,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Произошла ошибка при оформлении заказа'
      );
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.name = null;
      state.error = null;
    },
  },
  selectors: {
    selectCreatedOrder: (state) => state.order,
    selectCreatedOrderName: (state) => state.name,
    selectOrderLoadingState: (state) => state.isLoading,
    selectOrderError: (state) => state.error,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload.order;
        state.name = action.payload.name;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : (action.error.message ?? 'Не удалось оформить заказ');
      });
  },
});

export const { clearOrder } = orderSlice.actions;

export const {
  selectCreatedOrder,
  selectCreatedOrderName,
  selectOrderLoadingState,
  selectOrderError,
} = orderSlice.selectors;

export default orderSlice.reducer;
