import {
  clearUserError,
  registerUser,
  selectUserError,
} from '@/services/slices/userSlice';
import { useDispatch, useSelector } from '@/services/store';
import { RegisterUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Register = (): React.JSX.Element => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const errorText = useSelector(selectUserError) ?? undefined;
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(clearUserError());
  }, [dispatch]);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    dispatch(clearUserError());

    const data = {
      email,
      name: userName,
      password,
    };

    const register = async (): Promise<void> => {
      try {
        await dispatch(registerUser(data)).unwrap();

        void navigate('/', { replace: true });
      } catch (error) {
        console.error('Не удалось зарегистрироваться: ', error);
      }
    };

    void register();
  };

  return (
    <RegisterUI
      errorText={errorText}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
      isPasswordValid={isPasswordValid}
      setIsPasswordValid={setIsPasswordValid}
    />
  );
};
