import {
  fetchIngredients,
  selectIngredients,
  selectIngredientsError,
  selectIngredientsLoading,
} from '@/services/slices/ingredientsSlice';
import { getUser } from '@/services/slices/userSlice';
import { useDispatch, useSelector } from '@/services/store';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword,
} from '@pages';
import { Preloader } from '@ui';
import { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import { ProtectedRoute } from '../common/protectedRoute';

import type { AppContentProps } from './type';
import type { TIngredient } from '@utils-types';

import '../../index.css';

import styles from './app.module.css';

const App = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const ingredients: TIngredient[] = useSelector(selectIngredients);
  const isIngredientsLoading = useSelector(selectIngredientsLoading);
  const ingredientsError = useSelector(selectIngredientsError);

  useEffect(() => {
    void dispatch(fetchIngredients());
  }, [dispatch]);

  useEffect(() => {
    void dispatch(getUser());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <AppContent
        ingredients={ingredients}
        isLoading={isIngredientsLoading}
        error={ingredientsError}
      />
    </div>
  );
};

export default App;

/* Маршруты показываются только когда ингредиенты загружены: без них не
   отрисовать ни конструктор, ни состав заказа. */
const AppContent = ({
  ingredients,
  isLoading,
  error,
}: AppContentProps): React.JSX.Element => {
  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>
        Не удалось загрузить ингредиенты
        {error.message ? `: ${error.message}` : '.'}
      </p>
    );
  }

  if (!ingredients.length) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>Нет ингредиентов</p>
    );
  }

  return <RouteComponent />;
};

const RouteComponent = (): React.JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { background?: Location };
  const backgroundLocation = state?.background;

  const handleModalClick = (): void => {
    void navigate(-1);
  };

  const orderInfoElement: React.ReactElement = (
    <div>
      <h2 className={`${styles.detailHeader} text text_type_main-large`}>
        Информация о заказе
      </h2>
      <OrderInfo />
    </div>
  );

  const ingredientDetailsElement: React.ReactElement = (
    <div className={styles.detailPageWrap}>
      <h2 className={`${styles.detailHeader} text text_type_main-large`}>
        Детали ингредиента
      </h2>
      <IngredientDetails />
    </div>
  );

  return (
    <>
      <Routes location={backgroundLocation ?? location}>
        {/* Открытые маршруты */}
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />

        {/* Защищенные маршруты */}
        <Route element={<ProtectedRoute onlyUnAuth />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/orders" element={<ProfileOrders />} />
        </Route>

        {/* Полноэкранные версии модалок */}
        <Route path="/feed/:number" element={orderInfoElement} />
        <Route path="/ingredients/:id" element={ingredientDetailsElement} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile/orders/:number" element={orderInfoElement} />
        </Route>

        {/* Страница не найдена */}
        <Route path="*" element={<NotFound404 />} />
      </Routes>

      {/* Модалки */}
      {backgroundLocation && (
        <Routes>
          <Route
            path="/feed/:number"
            element={
              <Modal title="Информация о заказе" onClose={handleModalClick}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path="/ingredients/:id"
            element={
              <Modal title="Детали ингредиента" onClose={handleModalClick}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path="/profile/orders/:number"
            element={
              <Modal title="Информация о заказе" onClose={handleModalClick}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </>
  );
};
