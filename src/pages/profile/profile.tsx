import { useProfileForm } from '@/hooks/useProfileForm';
import { updateUser } from '@/services/slices/userSlice';
import { useDispatch, useSelector } from '@/services/store';
import {
  getUpdatedProfileData,
  validateProfileForm,
  type TProfileFormValues,
} from '@/utils/profileValidation';
import { ProfileUI } from '@ui-pages';
import { useEffect, useMemo } from 'react';

import type { FormEvent } from 'react';

export const Profile = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  const updateUserError = useSelector((state) => state.user.error);
  const isLoading = useSelector((state) => state.user.isLoading);

  const initialValues = useMemo<TProfileFormValues>(
    () => ({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: '',
    }),
    [user?.name, user?.email]
  );

  const {
    formValue,
    errors,
    changeField,
    touchField,
    markSubmitted,
    resetForm,
    clearPassword,
  } = useProfileForm(initialValues);

  useEffect((): void => {
    resetForm(initialValues);
  }, [initialValues, resetForm]);

  const isFormChanged =
    formValue.name.trim() !== (user?.name ?? '') ||
    formValue.email.trim() !== (user?.email ?? '') ||
    formValue.password.length > 0;

  const handleChange = (field: keyof TProfileFormValues, value: string): void => {
    changeField(field, value);
  };

  const handleBlur = (field: keyof TProfileFormValues): void => {
    touchField(field);
  };

  const submitProfile = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    markSubmitted();

    if (!user || isLoading) {
      return;
    }

    const validationErrors = validateProfileForm(formValue);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const updatedData = getUpdatedProfileData(formValue, user);

    if (Object.keys(updatedData).length === 0) {
      return;
    }

    try {
      await dispatch(updateUser(updatedData)).unwrap();
      clearPassword();
    } catch {
      // Ошибка запроса отображается через updateUserError.
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    void submitProfile(event);
  };

  const handleCancel = (): void => {
    resetForm(initialValues);
  };

  return (
    <ProfileUI
      formValue={formValue}
      errors={errors}
      updateUserError={updateUserError}
      isLoading={isLoading}
      isFormChanged={isFormChanged}
      onChange={handleChange}
      onBlur={handleBlur}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
};
