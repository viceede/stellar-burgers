import reducer, {
  addItem,
  moveItem,
  removeAllItems,
  removeItem,
} from './constructorSlice';

import type {
  TConstructorIngredient,
  TConstructorState,
  TIngredient,
} from '@/utils/types';

const bun: TIngredient = {
  _id: 'bun-1',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 7,
  fat: 20,
  carbohydrates: 50,
  calories: 300,
  price: 1255,
  image: 'bun.png',
  image_large: 'bun-large.png',
  image_mobile: 'bun-mobile.png',
};

const filling: TIngredient = {
  _id: 'filling-1',
  name: 'Мясо бессмертных моллюсков',
  type: 'main',
  proteins: 10,
  fat: 5,
  carbohydrates: 2,
  calories: 100,
  price: 1337,
  image: 'filling.png',
  image_large: 'filling-large.png',
  image_mobile: 'filling-mobile.png',
};

const makeConstructorIngredient = (
  ingredient: TIngredient,
  id: string
): TConstructorIngredient => ({ ...ingredient, id });

const bunInConstructor = makeConstructorIngredient(bun, 'bun-id');
const firstFilling = makeConstructorIngredient(filling, 'filling-1-id');
const secondFilling = makeConstructorIngredient(
  { ...filling, _id: 'filling-2', name: 'Соус Spicy-X' },
  'filling-2-id'
);

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
};

describe('редьюсер burgerConstructor', () => {
  test('возвращает исходное состояние для несуществующего экшна с начальным состоянием undefined', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  test('проверка работы addItem для булки', () => {
    const action = addItem(bun);
    const result = reducer(initialState, action);

    expect(result.bun).toEqual(action.payload);
    expect(result.ingredients).toEqual([]);
    expect(action.payload.id).toEqual(expect.any(String));
  });

  test('проверка работы addItem для обычного ингредиента', () => {
    const action = addItem(filling);
    const result = reducer(initialState, action);

    expect(result.bun).toBeNull();
    expect(result.ingredients).toEqual([action.payload]);
    expect(action.payload.id).toEqual(expect.any(String));
  });

  test('проверка работы removeItem', () => {
    const state: TConstructorState = {
      bun: bunInConstructor,
      ingredients: [firstFilling, secondFilling],
    };

    expect(reducer(state, removeItem(firstFilling.id))).toEqual({
      bun: bunInConstructor,
      ingredients: [secondFilling],
    });
  });

  test('проверка работы removeAllItems', () => {
    const state: TConstructorState = {
      bun: bunInConstructor,
      ingredients: [firstFilling, secondFilling],
    };

    expect(reducer(state, removeAllItems())).toEqual(initialState);
  });

  test('проверка работы moveItem на перемещение вверх', () => {
    const state: TConstructorState = {
      bun: bunInConstructor,
      ingredients: [firstFilling, secondFilling],
    };

    expect(reducer(state, moveItem({ id: secondFilling.id, direction: 'up' }))).toEqual({
      bun: bunInConstructor,
      ingredients: [secondFilling, firstFilling],
    });
  });

  test('проверка работы moveItem на перемещение вниз', () => {
    const state: TConstructorState = {
      bun: bunInConstructor,
      ingredients: [firstFilling, secondFilling],
    };

    expect(reducer(state, moveItem({ id: firstFilling.id, direction: 'down' }))).toEqual(
      {
        bun: bunInConstructor,
        ingredients: [secondFilling, firstFilling],
      }
    );
  });

  test('не меняет ингредиенты когда ингредиент нельзя передвигать', () => {
    const state: TConstructorState = {
      bun: bunInConstructor,
      ingredients: [firstFilling, secondFilling],
    };

    expect(reducer(state, moveItem({ id: firstFilling.id, direction: 'up' }))).toEqual(
      state
    );
    expect(
      reducer(state, moveItem({ id: secondFilling.id, direction: 'down' }))
    ).toEqual(state);
    expect(reducer(state, moveItem({ id: 'missing-id', direction: 'up' }))).toEqual(
      state
    );
  });
});
