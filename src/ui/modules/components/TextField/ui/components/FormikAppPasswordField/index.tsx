import { FormikAppTextFieldProps } from '../FormikAppTextField';
import { useFormikAppTextField } from '../../../common';
import { AppPasswordField } from '../AppPasswordField';

export type FormikAppPasswordFieldProps = FormikAppTextFieldProps;

export const FormikAppPasswordField = (props: FormikAppPasswordFieldProps) => {
  const { field, handleChange, hasError, errorMessage } =
    useFormikAppTextField(props);

  return (
    <AppPasswordField
      {...field}
      {...props}
      onChange={handleChange}
      error={hasError}
      errorMessage={errorMessage}
    />
  );
};
