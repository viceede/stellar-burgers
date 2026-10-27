import { selectIngredients } from '@/services/slices/ingredientsSlice';
import { clearOrderDetails, getOrderDetails } from '@/services/slices/orderDetailsSlice';
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

  const ingredients: TIngredient[] = useSelector(selectIngredients);

  useEffect(() => {
    if (!number) return;

    dispatch(clearOrderDetails());
    void dispatch(getOrderDetails(Number(number)));
  }, [dispatch, number]);

  const orderInfo = useMemo(() => {
    if (!orderData || ingredients.length === 0) {
      return null;
    }

    const date = new Date(orderData.createdAt);

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
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
