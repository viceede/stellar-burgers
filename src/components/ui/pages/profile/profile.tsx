import { ProfileMenu } from '@/components/profile-menu';
import { Button, Input } from '@krgaa/react-developer-burger-ui-components';

import type { TProfileUIProps } from './type';

import styles from './profile.module.css';

export const ProfileUI = ({
  formValue,
  errors,
  updateUserError,
  isLoading,
  isFormChanged,
  onChange,
  onBlur,
  onSubmit,
  onCancel,
}: TProfileUIProps): React.JSX.Element => (
  <main className={styles.container}>
    <div className={`mt-30 mr-15 ${styles.menu}`}>
      <ProfileMenu />
    </div>

    <form className={`mt-30 ${styles.form}`} onSubmit={onSubmit} noValidate>
      <>
        <div className="pb-6">
          <Input
            type={'text'}
            placeholder="Имя"
            value={formValue.name}
            name={'name'}
            onChange={(event) => onChange('name', event.target.value)}
            onBlur={() => onBlur('name')}
            error={Boolean(errors.name)}
            errorText={errors.name ?? ''}
            disabled={isLoading}
            size={'default'}
            icon={'EditIcon'}
          />
        </div>
        <div className="pb-6">
          <Input
            type={'email'}
            placeholder={'E-mail'}
            value={formValue.email}
            name={'email'}
            onChange={(event) => onChange('email', event.target.value)}
            onBlur={() => onBlur('email')}
            error={Boolean(errors.email)}
            errorText={errors.email ?? ''}
            disabled={isLoading}
            size={'default'}
            icon={'EditIcon'}
          />
        </div>
        <div className="pb-6">
          <Input
            type={'password'}
            placeholder={'Новый пароль'}
            value={formValue.password}
            name={'password'}
            onChange={(event) => onChange('password', event.target.value)}
            onBlur={() => onBlur('password')}
            error={Boolean(errors.password)}
            errorText={errors.password ?? ''}
            disabled={isLoading}
            size={'default'}
            icon={'EditIcon'}
          />
        </div>

        {updateUserError && (
          <p className={`${styles.error} pt-5 text text_type_main-default`} role="alert">
            {updateUserError}
          </p>
        )}

        {isFormChanged && (
          <div>
            <Button
              htmlType="button"
              type="secondary"
              size="medium"
              onClick={onCancel}
              disabled={isLoading}
            >
              Отменить
            </Button>

            <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
              {isLoading ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </div>
        )}
      </>
    </form>
  </main>
);
