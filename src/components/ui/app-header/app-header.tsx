import {
  BurgerIcon,
  ListIcon,
  ProfileIcon,
  Logo,
} from '@krgaa/react-developer-burger-ui-components';
import { Link, useLocation } from 'react-router-dom';

import type { TAppHeaderUIProps } from './type';

import styles from './app-header.module.css';

export const AppHeaderUI = ({ userName }: TAppHeaderUIProps): React.JSX.Element => {
  const path = useLocation().pathname;

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <Link
            to="/"
            className={`${styles.link} ${path === '/' ? styles.link_active : ''}`}
          >
            <BurgerIcon type={path === '/' ? 'primary' : 'secondary'} />
            <p className="text text_type_main-default ml-2 mr-10">Конструктор</p>
          </Link>
          <Link
            to="/feed"
            className={`${styles.link} ${path === '/feed' ? styles.link_active : ''}`}
          >
            <ListIcon type={path === '/feed' ? 'primary' : 'secondary'} />
            <p className="text text_type_main-default ml-2">Лента заказов</p>
          </Link>
        </div>
        <div className={styles.logo}>
          <Logo className="" />
        </div>
        <div className={styles.link_position_last}>
          <Link
            to="/profile"
            className={`${styles.link} ${path === '/profile' ? styles.link_active : ''}`}
          >
            <ProfileIcon type={path === '/profile' ? 'primary' : 'secondary'} />
            <p className="text text_type_main-default ml-2">
              {userName ?? 'Личный кабинет'}
            </p>
          </Link>
        </div>
      </nav>
    </header>
  );
};
