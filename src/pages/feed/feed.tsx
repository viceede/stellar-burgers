import { getFeeds, selectOrders } from '@/services/slices/feedSlice';
import { useDispatch, useSelector } from '@/services/store';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useEffect } from 'react';

import type { TOrder } from '@utils-types';

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const handleGetFeeds = (): void => {
    dispatch(getFeeds()).catch((error) => {
      console.error('Не удалось запросить ленту заказов: ', error);
    });
  };

  useEffect(() => {
    handleGetFeeds();
  }, [dispatch]);

  const orders: TOrder[] = useSelector(selectOrders);

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
