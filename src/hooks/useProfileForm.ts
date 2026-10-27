import {
  validateProfileForm,
  type TProfileFormErrors,
  type TProfileFormValues,
} from '@/utils/profileValidation';
import { useCallback, useReducer } from 'react';

type TProfileFormState = {
  values: TProfileFormValues;
  touched: Partial<Record<keyof TProfileFormValues, boolean>>;
  submitted: boolean;
};

type TProfileFormAction =
  | {
      type: 'change';
      field: keyof TProfileFormValues;
      value: string;
    }
  | {
      type: 'blur';
      field: keyof TProfileFormValues;
    }
  | { type: 'submit' }
  | {
      type: 'reset';
      values: TProfileFormValues;
    }
  | { type: 'clearPassword' };

export type TUseProfileFormReturn = {
  formValue: TProfileFormValues;
  errors: TProfileFormErrors;
  isValid: boolean;
  changeField: (field: keyof TProfileFormValues, value: string) => void;
  touchField: (field: keyof TProfileFormValues) => void;
  markSubmitted: () => void;
  resetForm: (values: TProfileFormValues) => void;
  clearPassword: () => void;
};

const createInitialState = (values: TProfileFormValues): TProfileFormState => ({
  values,
  touched: {},
  submitted: false,
});

const profileFormReducer = (
  state: TProfileFormState,
  action: TProfileFormAction
): TProfileFormState => {
  switch (action.type) {
    case 'change':
      return {
        ...state,
        values: {
          ...state.values,
          [action.field]: action.value,
        },
      };

    case 'blur':
      return {
        ...state,
        touched: {
          ...state.touched,
          [action.field]: true,
        },
      };

    case 'submit':
      return {
        ...state,
        submitted: true,
      };

    case 'reset':
      return createInitialState(action.values);

    case 'clearPassword':
      return {
        ...state,
        values: {
          ...state.values,
          password: '',
        },
        touched: {
          ...state.touched,
          password: false,
        },
      };

    default:
      return state;
  }
};

export const useProfileForm = (
  initialValues: TProfileFormValues
): TUseProfileFormReturn => {
  const [state, dispatch] = useReducer(
    profileFormReducer,
    initialValues,
    createInitialState
  );

  const allErrors = validateProfileForm(state.values);
  const errors: TProfileFormErrors = {};

  (Object.keys(allErrors) as (keyof TProfileFormValues)[]).forEach((field) => {
    if (state.submitted || state.touched[field]) {
      const error = allErrors[field];

      if (error) {
        errors[field] = error;
      }
    }
  });

  const isValid = Object.keys(allErrors).length === 0;

  const changeField = useCallback(
    (field: keyof TProfileFormValues, value: string): void => {
      dispatch({
        type: 'change',
        field,
        value,
      });
    },
    []
  );

  const touchField = useCallback((field: keyof TProfileFormValues): void => {
    dispatch({
      type: 'blur',
      field,
    });
  }, []);

  const markSubmitted = useCallback((): void => {
    dispatch({ type: 'submit' });
  }, []);

  const resetForm = useCallback((values: TProfileFormValues): void => {
    dispatch({
      type: 'reset',
      values,
    });
  }, []);

  const clearPassword = useCallback((): void => {
    dispatch({ type: 'clearPassword' });
  }, []);

  return {
    formValue: state.values,
    errors,
    isValid,
    changeField,
    touchField,
    markSubmitted,
    resetForm,
    clearPassword,
  };
};
