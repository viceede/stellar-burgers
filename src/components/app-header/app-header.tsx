import { selectUser } from '@/services/slices/userSlice';
import { useSelector } from '@/services/store';
import { AppHeaderUI } from '@ui';

export const AppHeader = (): React.JSX.Element => {
  const user = useSelector(selectUser);
  const userName = user?.name ?? undefined;

  return <AppHeaderUI userName={userName} />;
};
