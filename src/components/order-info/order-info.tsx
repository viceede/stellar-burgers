import { getOrderDetails } from '@/services/slices/orderDetailsSlice';
import { useDispatch, useSelector } from '@/services/store';
import { Preloader, OrderInfoUI } from '@ui';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import type { TIngredient, TIngredientsWithCount } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();
  const orderData = useSelector((state) => state.orderDetails.order);
  const isLoading = useSelector((state) => state.orderDetails.isLoading);
  const error = useSelector((state) => state.orderDetails.error);

  const ingredients: TIngredient[] = useSelector(
    (state) => state.ingredients.ingredients
  );

  useEffect(() => {
    if (number) {
      void dispatch(getOrderDetails(Number(number)));
    }
  }, [dispatch, number]);

  const orderInfo = useMemo(() => {
    if (!orderData || ingredients.length === 0) {
      return null;
    }

    const date = new Date(orderData.createdAt);

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, id: string) => {
        if (acc[id]) {
          acc[id].count++;
        } else {
          const ingredient = ingredients.find((item) => item._id === id);

          if (ingredient) {
            acc[id] = {
              ...ingredient,
              count: 1,
            };
          }
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (sum, ingredient) => sum + ingredient.price * ingredient.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, ingredients]);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div className="text text_type_main-medium">
        Не удалось загрузить заказ: {error}
      </div>
    );
  }

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
