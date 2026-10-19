'use client';

import { Box, Stack, Typography } from '@mui/material';
import {
  AppButton,
  AppLabelField,
  Centered,
  FormikAppPasswordField,
  StyledImage,
} from '../../modules/components';
import appLogo from '../../assets/icons/app-logo.svg';
import {
  ApiChangePasswordPayload,
  getAuthToken,
  pxToRem,
  removeAuthToken,
  removeMustChangePassword,
  removeRefreshToken,
} from '../../../common';
import { Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { newPasswordRule } from '@/common/utils/passwordRule';
import { useAuthApi } from '../../../common/hooks/api';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

type FormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const Schema = Yup.object().shape({
  currentPassword: Yup.string().required('one-time password is required'),
  newPassword: newPasswordRule('new password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'confirm password must match new password')
    .required('confirm password is required'),
});

const initialValues: FormValues = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export const ChangePasswordRequiredPage = () => {
  const { changePassword } = useAuthApi();
  const router = useRouter();

  // Only reachable while signed in
  useEffect(() => {
    if (!getAuthToken()) {
      router.replace('/login');
    }
  }, [router]);

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    setSubmitting(true);
    const payload: ApiChangePasswordPayload = {
      current_password: values.currentPassword,
      new_password: values.newPassword,
    };
    const success = await changePassword(payload);
    if (success) {
      // The server signs the account out everywhere after a password change
      removeMustChangePassword();
      removeAuthToken();
      removeRefreshToken();
      toast.success('Password updated. Please sign in with your new password.');
      router.replace('/login');
    }
    setSubmitting(false);
  };

  return (
    <Box
      component="main"
      sx={{
        background: `linear-gradient(
                135deg,
                #060F2E,
                #0A1A4E,
                #0D2369,
                #1040A8,
                #1D4ED8
                )`,
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Centered spacing={'49px'} sx={{ width: '560px' }} direction={'column'}>
        <StyledImage
          src={appLogo}
          alt="medigo-logo"
          sx={{ width: '184px', height: '80px' }}
        />
        <Stack
          sx={{
            width: '100%',
            maxWidth: '420px',
            background: '#FFFFFFE5',
            padding: '40.75px',
            border: '0.667px solid #FFFFFF80',
            boxShadow:
              '0 32px 80px -10px rgba(6, 15, 46, 0.60), 0 0 0 1px rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
          }}
          spacing={4}
        >
          <Stack spacing={0.5}>
            <Typography
              component="h1"
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                color: (theme) => theme.color.deepBlue,
                fontSize: pxToRem(26),
                lineHeight: '32.5px',
                fontWeight: 600,
              }}
            >
              Choose a new password
            </Typography>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                color: '#64748B',
                fontSize: pxToRem(15),
                lineHeight: '24.5px',
                fontWeight: 400,
              }}
            >
              You signed in with a one-time password. Enter it below, then
              choose your own password to continue.
            </Typography>
          </Stack>
          <Formik
            initialValues={initialValues}
            validationSchema={Schema}
            onSubmit={handleSubmit}
          >
            {({ values, isSubmitting, isValid }) => (
              <Form>
                <Stack spacing={'20px'}>
                  <Stack spacing={0.5}>
                    <AppLabelField label="One-time Password" />
                    <FormikAppPasswordField
                      name="currentPassword"
                      placeholder="Enter the password from your email"
                    />
                  </Stack>
                  <Stack spacing={0.5}>
                    <AppLabelField label="New Password" />
                    <FormikAppPasswordField
                      name="newPassword"
                      placeholder="Enter new password"
                    />
                  </Stack>
                  <Stack spacing={0.5}>
                    <AppLabelField label="Confirm New Password" />
                    <FormikAppPasswordField
                      name="confirmPassword"
                      placeholder="Confirm new password"
                    />
                  </Stack>
                  <AppButton
                    type="submit"
                    disabled={
                      !isValid ||
                      !values.currentPassword ||
                      !values.newPassword ||
                      !values.confirmPassword
                    }
                    isLoading={isSubmitting}
                  >
                    Update Password
                  </AppButton>
                </Stack>
              </Form>
            )}
          </Formik>
        </Stack>
        <Centered>
          <Typography
            sx={{
              color: '#FFFFFF99',
              fontSize: pxToRem(13),
              lineHeight: '19.5px',
              fontFamily: (theme) => theme.typography.fontFamily,
              textAlign: 'center',
              fontWeight: 400,
            }}
          >
            © {new Date().getFullYear()} MediGO. All rights reserved.
          </Typography>
        </Centered>
      </Centered>
    </Box>
  );
};
