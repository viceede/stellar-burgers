import { clearUserError, loginUser, selectUserError } from '@/services/slices/userSlice';
import { useDispatch, useSelector } from '@/services/store';
import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const errorText = useSelector(selectUserError) ?? undefined;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(clearUserError());
  }, [dispatch]);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    const data = {
      email,
      password,
    };

    const login = async (): Promise<void> => {
      try {
        await dispatch(loginUser(data)).unwrap();

        void navigate('/', { replace: true });
      } catch (error) {
        console.error('Не удалось войти в аккаунт: ', error);
      }
    };

    void login();
  };

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
      isPasswordValid={isPasswordValid}
      setIsPasswordValid={setIsPasswordValid}
    />
  );
};
