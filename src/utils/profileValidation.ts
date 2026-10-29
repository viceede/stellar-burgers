import type { TRegisterData } from '@/utils/burger-api';
import type { TUser } from '@/utils/types';

export type TProfileFormValues = TRegisterData;

export type TProfileFormErrors = Partial<Record<keyof TProfileFormValues, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Сверь ограничение длины с требованиями API проекта.
const MIN_PASSWORD_LENGTH = 6;

export const validateProfileForm = (values: TProfileFormValues): TProfileFormErrors => {
  const errors: TProfileFormErrors = {};

  const name = values.name.trim();
  const email = values.email.trim();
  const password = values.password;

  if (!name) {
    errors.name = 'Имя не должно быть пустым';
  }

  if (!email) {
    errors.email = 'E-mail не должен быть пустым';
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Введите корректный E-mail';
  }

  if (password.length > 0 && password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Пароль должен содержать не менее ${MIN_PASSWORD_LENGTH} символов`;
  }

  return errors;
};

export const getUpdatedProfileData = (
  values: TProfileFormValues,
  currentUser: TUser
): Partial<TRegisterData> => {
  const updatedData: Partial<TRegisterData> = {};

  const name = values.name.trim();
  const email = values.email.trim();

  if (name !== currentUser.name) {
    updatedData.name = name;
  }

  if (email !== currentUser.email) {
    updatedData.email = email;
  }

  if (values.password.length > 0) {
    updatedData.password = values.password;
  }

  return updatedData;
};
