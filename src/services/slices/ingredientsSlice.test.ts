import reducer, { fetchIngredients } from './ingredientsSlice';

import type { TIngredient, TIngredientsState } from '@/utils/types';

const ingredient: TIngredient = {
  _id: 'ingredient-1',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 7,
  fat: 20,
  carbohydrates: 50,
  calories: 300,
  price: 1255,
  image: 'image.png',
  image_large: 'image-large.png',
  image_mobile: 'image-mobile.png',
};

const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null,
};

describe('редьюсер слайса ingredients', () => {
  test('Возвращает исходное состояния для несуществующего экшна и неизвестного состояния', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  test('состояние pending для fetchIngredients', () => {
    const state: TIngredientsState = {
      ingredients: [ingredient],
      isLoading: false,
      error: { message: 'Previous error' },
    };

    expect(reducer(state, fetchIngredients.pending('request-1'))).toEqual({
      ingredients: [ingredient],
      isLoading: true,
      error: null,
    });
  });

  test('состояние fulfilled fetchIngredients', () => {
    const state: TIngredientsState = {
      ingredients: [],
      isLoading: true,
      error: null,
    };

    expect(
      reducer(state, fetchIngredients.fulfilled([ingredient], 'request-1'))
    ).toEqual({
      ingredients: [ingredient],
      isLoading: false,
      error: null,
    });
  });

  test('состояние rejected для fetchIngredients', () => {
    const state: TIngredientsState = {
      ingredients: [ingredient],
      isLoading: true,
      error: null,
    };
    const action = fetchIngredients.rejected(
      new Error('Не удалось загрузить ингредиенты'),
      'request-1'
    );

    const result = reducer(state, action);

    expect(result.ingredients).toEqual([ingredient]);
    expect(result.isLoading).toBe(false);
    expect(result.error).toEqual(
      expect.objectContaining({
        name: 'Error',
        message: 'Не удалось загрузить ингредиенты',
      })
    );
  });
});
