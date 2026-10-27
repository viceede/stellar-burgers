import type { TProfileFormErrors, TProfileFormValues } from '@/utils/profileValidation';
import type { FormEvent } from 'react';

export type TProfileUIProps = {
  formValue: TProfileFormValues;
  errors: TProfileFormErrors;
  updateUserError: string | null;
  isLoading: boolean;
  isFormChanged: boolean;
  onChange: (field: keyof TProfileFormValues, value: string) => void;
  onBlur: (field: keyof TProfileFormValues) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};
