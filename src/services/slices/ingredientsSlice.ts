import { getIngredientsApi } from '@/utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { RootState } from '../store';
import type { TIngredient, TIngredientsState } from '@/utils/types';

const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null,
};

export const fetchIngredients = createAsyncThunk<TIngredient[], void>(
  'ingredients/fetchAll',
  async () => getIngredientsApi()
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      });
  },
});

export default ingredientsSlice.reducer;

export const selectIngredients = (state: RootState): TIngredientsState['ingredients'] =>
  state.ingredients.ingredients;
export const selectIngredientsLoading = (
  state: RootState
): TIngredientsState['isLoading'] => state.ingredients.isLoading;
export const selectIngredientsError = (state: RootState): TIngredientsState['error'] =>
  state.ingredients.error;
