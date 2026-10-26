import {
  selectBun,
  selectItems,
  removeAllItems,
} from '@/services/slices/constructorSlice';
import {
  clearOrder,
  selectCreatedOrder,
  selectOrderLoadingState,
  createOrder,
} from '@/services/slices/orderSlice';
import { selectUser } from '@/services/slices/userSlice';
import { useDispatch, useSelector } from '@/services/store';
import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import type { TConstructorIngredient, TConstructorState, TOrder } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser);

  const constructorItems: TConstructorState = {
    bun: useSelector(selectBun),
    ingredients: useSelector(selectItems),
  };
  const orderRequest = useSelector(selectOrderLoadingState);
  const orderModalData: TOrder | null = useSelector(selectCreatedOrder);

  const onOrderClick = (): void => {
    if (!constructorItems.bun || orderRequest) {
      return;
    }

    if (!user) {
      void navigate('/login', { state: { from: location } });
      return;
    }

    const ingredientsIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map(
        (ingredient: TConstructorIngredient) => ingredient._id
      ),
      constructorItems.bun._id,
    ];

    void dispatch(createOrder(ingredientsIds))
      .unwrap()
      .then(() => {
        dispatch(removeAllItems());
      })
      .catch((error: unknown) => {
        console.error('Не удалось оформить заказ:', error);
      });
  };

  const closeOrderModal = (): void => {
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
