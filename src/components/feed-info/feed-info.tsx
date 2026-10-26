import {
  selectFeedError,
  selectFeedLoading,
  selectOrders,
  selectTotal,
  selectTotalToday,
} from '@/services/slices/feedSlice';
import { useSelector } from '@/services/store';
import { FeedInfoUI } from '@ui';

import type { TOrder } from '@utils-types';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo = (): React.JSX.Element => {
  const feed = {
    orders: useSelector(selectOrders),
    total: useSelector(selectTotal),
    totalToday: useSelector(selectTotalToday),
    isLoading: useSelector(selectFeedLoading),
    error: useSelector(selectFeedError),
  };
  const orders: TOrder[] = feed.orders;

  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI readyOrders={readyOrders} pendingOrders={pendingOrders} feed={feed} />
  );
};
