import { IconButton, Stack, Typography } from '@mui/material';
import {
  AppButton,
  AppLabelField,
  AppModal,
  FormikAppPasswordField,
  RowStack,
} from '../../../../../components';
import { ApiChangePasswordPayload, pxToRem } from '../../../../../../../common';
import CloseIcon from '@mui/icons-material/Close';
import LockResetIcon from '@mui/icons-material/LockReset';
import { Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';

type ChangePasswordModalProps = {
  open: boolean;
  handleClose: () => void;
  onSubmit: (payload: ApiChangePasswordPayload) => Promise<boolean>;
};

type ChangePasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const ChangePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required('current password is required'),
  newPassword: Yup.string()
    .min(8, 'new password must be at least 8 characters')
    .required('new password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'confirm password must match new password')
    .required('confirm password is required'),
});

const initialValues: ChangePasswordFormValues = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export const ChangePasswordModal = ({
  open,
  handleClose,
  onSubmit,
}: ChangePasswordModalProps) => {
  const handleSubmit = async (
    values: ChangePasswordFormValues,
    { setSubmitting, resetForm }: FormikHelpers<ChangePasswordFormValues>
  ) => {
    setSubmitting(true);
    const success = await onSubmit({
      current_password: values.currentPassword,
      new_password: values.newPassword,
    });

    if (success) {
      resetForm();
      handleClose();
    }

    setSubmitting(false);
  };

  return (
    <AppModal label="change-password-modal" open={open} setOpen={handleClose}>
      <Stack spacing={3} sx={{ width: '420px' }}>
        <RowStack width={'100%'} justifyContent={'space-between'}>
          <RowStack spacing={1.25}>
            <Stack
              sx={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: '#EFF6FF',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LockResetIcon sx={{ color: '#2563EB', fontSize: 22 }} />
            </Stack>
            <Stack spacing={0.25}>
              <Typography
                sx={{
                  color: (theme) => theme.color.deepBlue,
                  fontWeight: 600,
                  fontSize: pxToRem(20),
                  lineHeight: '30px',
                  fontFamily: (theme) => theme.typography.fontFamily,
                }}
              >
                Change Password
              </Typography>
              <Typography
                sx={{
                  color: '#64748B',
                  fontWeight: 400,
                  fontSize: pxToRem(14),
                  lineHeight: '21px',
                  fontFamily: (theme) => theme.typography.fontFamily,
                }}
              >
                Update your admin account password
              </Typography>
            </Stack>
          </RowStack>
          <IconButton
            onClick={handleClose}
            sx={{
              background: '#F7F9FB',
              border: '0.67px solid #E5E7EB',
              borderRadius: '14px',
              width: '33.3px',
              height: '33.3px',
            }}
          >
            <CloseIcon sx={{ color: '#6B7280', fontSize: 18 }} />
          </IconButton>
        </RowStack>

        <Formik
          initialValues={initialValues}
          validationSchema={ChangePasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ dirty, isSubmitting, isValid }) => (
            <Form>
              <Stack spacing={'20px'}>
                <Stack spacing={0.5}>
                  <AppLabelField label="Current Password" />
                  <FormikAppPasswordField
                    name="currentPassword"
                    type="password"
                    placeholder="Enter current password"
                  />
                </Stack>
                <Stack spacing={0.5}>
                  <AppLabelField label="New Password" />
                  <FormikAppPasswordField
                    name="newPassword"
                    type="password"
                    placeholder="Enter new password"
                  />
                </Stack>
                <Stack spacing={0.5}>
                  <AppLabelField label="Confirm Password" />
                  <FormikAppPasswordField
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                  />
                </Stack>

                <RowStack spacing={2} width={'100%'}>
                  <AppButton
                    type="button"
                    fullWidth
                    onClick={handleClose}
                    disabled={isSubmitting}
                    sx={{
                      background: '#F7F9FB',
                      border: '0.67px solid #E8ECF0',
                      color: '#344054',
                      fontWeight: 600,
                      fontSize: pxToRem(14),
                      lineHeight: '21px',
                      '&:hover': {
                        background: '#F7F9FB',
                      },
                    }}
                  >
                    Cancel
                  </AppButton>
                  <AppButton
                    type="submit"
                    fullWidth
                    disabled={!isValid || !dirty || isSubmitting}
                    isLoading={isSubmitting}
                    sx={{
                      fontWeight: 600,
                      fontSize: pxToRem(14),
                      lineHeight: '21px',
                    }}
                  >
                    Update Password
                  </AppButton>
                </RowStack>
              </Stack>
            </Form>
          )}
        </Formik>
      </Stack>
    </AppModal>
  );
};
