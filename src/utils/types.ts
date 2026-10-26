import type { SerializedError } from '@reduxjs/toolkit';
import type { ReactNode } from 'react';

export type TIngredient = {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
};

export type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: SerializedError | null;
};

export type TConstructorIngredient = TIngredient & {
  id: string;
};

export type TMoveIngredientPayload = {
  id: TConstructorIngredient['id'];
  direction: 'up' | 'down';
};

export type TOrder = {
  _id: string;
  status: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  ingredients: string[];
};

export type TOrdersData = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

export type TOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

export type TNewOrderState = {
  order: TOrder | null;
  name: string | null;
  isLoading: boolean;
  error: string | null;
};

export type TOrderDetailsState = {
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

export type TUser = {
  email: string;
  name: string;
};

export type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
};

export type TTabMode = 'bun' | 'sauce' | 'main';

export type TConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

export type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: unknown;
};

export type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children?: ReactNode;
};
