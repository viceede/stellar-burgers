import { getOrders, selectOrders } from '@/services/slices/ordersSlice';
import { useDispatch, useSelector } from '@/services/store';
import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import type { TOrder } from '@utils-types';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrders()).catch((error) => {
      console.error('Не удалось загрузить историю заказов: ', error);
    });
  }, [dispatch]);

  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector(selectOrders);

  return <ProfileOrdersUI orders={orders} />;
};
