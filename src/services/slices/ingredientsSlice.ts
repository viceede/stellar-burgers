import { getIngredientsApi } from '@/utils/burger-api';
import { createAsyncThunk, type SerializedError, createSlice } from '@reduxjs/toolkit';

import type { RootState } from '../store';
import type { TIngredient } from '@/utils/types';

type IngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: SerializedError | null;
};

const initialState: IngredientsState = {
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

export const selectIngredients = (state: RootState): IngredientsState['ingredients'] =>
  state.ingredients.ingredients;
export const selectIngredientsLoading = (
  state: RootState
): IngredientsState['isLoading'] => state.ingredients.isLoading;
export const selectIngredientsError = (state: RootState): IngredientsState['error'] =>
  state.ingredients.error;
