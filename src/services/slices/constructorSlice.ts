import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';

import type {
  TConstructorIngredient,
  TConstructorState,
  TIngredient,
  TMoveIngredientPayload,
} from '@/utils/types';

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
};

const moveIngredient = (
  ingredients: TConstructorState['ingredients'],
  id: TConstructorIngredient['id'],
  direction: 'up' | 'down'
): TConstructorState['ingredients'] => {
  const currentIndex = ingredients.findIndex((ingredient) => ingredient.id === id);

  if (currentIndex === -1) {
    return ingredients;
  }

  const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

  if (newIndex < 0 || newIndex >= ingredients.length) {
    return ingredients;
  }

  const result = [...ingredients];
  [result[currentIndex], result[newIndex]] = [result[newIndex], result[currentIndex]];

  return result;
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addItem: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const item = action.payload;
        switch (item.type) {
          case 'bun':
            state.bun = item;
            break;
          default:
            state.ingredients.push(item);
            break;
        }
      },
      prepare: (item: TIngredient) => ({
        payload: {
          ...item,
          _id: item._id,
          id: nanoid(),
        },
      }),
    },
    removeItem: (state, action: PayloadAction<TConstructorIngredient['id']>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    removeAllItems: (state) => {
      state.ingredients = [];
      state.bun = null;
    },
    moveItem: (state, action: PayloadAction<TMoveIngredientPayload>) => {
      const { id, direction } = action.payload;

      state.ingredients = moveIngredient(state.ingredients, id, direction);
    },
  },
  selectors: {
    selectItems: (state) => state.ingredients,
    selectBun: (state) => state.bun,
  },
});

export const { addItem, removeItem, removeAllItems, moveItem } =
  constructorSlice.actions;
export const { selectItems, selectBun } = constructorSlice.selectors;
export default constructorSlice.reducer;
