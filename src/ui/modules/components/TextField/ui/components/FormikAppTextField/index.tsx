'use client';

import { AppTextField, AppTextFieldProps } from '../AppTextField';
import { useFormikAppTextField } from '../../../common';

export type FormikAppTextFieldProps = AppTextFieldProps & {
  validateBeforeTouch?: boolean;
};

export const FormikAppTextField = (props: FormikAppTextFieldProps) => {
  const { field, handleChange, hasError, errorMessage } =
    useFormikAppTextField(props);

  return (
    <AppTextField
      {...field}
      {...props}
      onChange={handleChange}
      error={hasError}
      errorMessage={errorMessage}
    />
  );
};
