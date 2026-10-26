import { selectUser, selectIsAuthChecked } from '@/services/slices/userSlice';
import { useSelector } from '@/services/store';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { Preloader } from '../ui';

import type { TProtectedRouteProps } from '@/utils/types';
import type { ReactNode } from 'react';

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children,
}: TProtectedRouteProps): ReactNode => {
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    const state = location.state as {
      from?: { pathname?: string };
    } | null;

    const from = state?.from?.pathname ?? '/';

    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children ? <>{children}</> : <Outlet />;
};
