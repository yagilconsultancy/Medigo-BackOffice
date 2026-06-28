'use client';

import { Box, Stack, Typography } from '@mui/material';
import {
  AppButton,
  AppLabelField,
  Centered,
  FormikAppPasswordField,
  FormikAppTextField,
  StyledImage,
  StyledLink,
} from '../../modules/components';
import appLogo from '../../assets/icons/app-logo.svg';
import {
  ApiResetPasswordPayload,
  getForgotPasswordUserId,
  pxToRem,
} from '../../../common';
import { Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useAuthApi } from '../../../common/hooks/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useState } from 'react';

const RESET_OTP_PURPOSE = 'forgot_password';

type ResetPasswordFormValues = {
  code: string;
  newPassword: string;
  confirmNewPassword: string;
};

const ResetPasswordSchema = Yup.object().shape({
  code: Yup.string().required('reset code is required'),
  newPassword: Yup.string()
    .min(8, 'new password must be at least 8 characters')
    .required('new password is required'),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'confirm password must match new password')
    .required('confirm password is required'),
});

export const ResetPasswordPage = () => {
  const { resetPassword, resendResetPasswordOtp } = useAuthApi();
  const router = useRouter();
  const [isResending, setIsResending] = useState(false);

  const initialValues: ResetPasswordFormValues = {
    code: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  const handleResendCode = async () => {
    const user_id = getForgotPasswordUserId();

    if (!user_id) {
      toast.error('Please request a new password reset link.');
      router.push('/forgot-password');
      return;
    }

    setIsResending(true);
    await resendResetPasswordOtp({ user_id, purpose: RESET_OTP_PURPOSE });
    setIsResending(false);
  };

  const handleSubmit = async (
    values: ResetPasswordFormValues,
    { setSubmitting }: FormikHelpers<ResetPasswordFormValues>
  ) => {
    const user_id = getForgotPasswordUserId();

    if (!user_id) {
      toast.error('Please request a new password reset link.');
      setSubmitting(false);
      router.push('/forgot-password');
      return;
    }

    const payload: ApiResetPasswordPayload = {
      user_id,
      code: values.code,
      new_password: values.newPassword,
    };

    setSubmitting(true);
    const success = await resetPassword(payload);
    if (success) {
      router.push('/login');
    }
    setSubmitting(false);
  };

  return (
    <Box
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
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Centered spacing={'49px'} sx={{ width: '560px' }} direction={'column'}>
        <Stack spacing={0.5} alignItems={'center'}>
          <StyledImage
            src={appLogo}
            alt="medigo-logo"
            sx={{
              width: '184px',
              height: '80px',
            }}
          />
          <Typography
            sx={{
              color: '#93C5FD',
              fontFamily: (theme) => theme.typography.fontFamily,
              textAlign: 'center',
              fontSize: pxToRem(14),
              lineHeight: '22.75px',
              fontWeight: 400,
            }}
          >
            Non-Emergency Medical Transportation Platform
          </Typography>
        </Stack>
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
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                color: (theme) => theme.color.deepBlue,
                fontSize: pxToRem(26),
                lineHeight: '32.5px',
                fontWeight: 600,
              }}
            >
              Reset Password
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
              Enter the reset code and choose a new admin password
            </Typography>
          </Stack>
          <Formik
            initialValues={initialValues}
            validationSchema={ResetPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ values, isSubmitting, isValid }) => (
              <Form>
                <Stack spacing={'20px'}>
                  <Stack spacing={0.5}>
                    <AppLabelField label="Reset Code" />
                    <FormikAppTextField
                      name="code"
                      placeholder="Enter reset code"
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
                      name="confirmNewPassword"
                      placeholder="Confirm new password"
                    />
                  </Stack>
                  <AppButton
                    type="submit"
                    disabled={
                      !isValid ||
                      !values.code ||
                      !values.newPassword ||
                      !values.confirmNewPassword
                    }
                    isLoading={isSubmitting}
                  >
                    Reset Password
                  </AppButton>
                  <AppButton
                    type="button"
                    variant="text"
                    onClick={handleResendCode}
                    disabled={isResending}
                    sx={{
                      alignSelf: 'center',
                      color: '#2563EB',
                      background: 'transparent',
                      padding: 0,
                      minWidth: 'auto',
                      '&:hover': {
                        background: 'transparent',
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {isResending ? 'Resending code...' : 'Resend code'}
                  </AppButton>
                  <StyledLink
                    href={'/login'}
                    sx={{
                      color: '#3B82F6',
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontSize: pxToRem(14),
                      textAlign: 'center',
                      fontWeight: 500,
                      lineHeight: '21px',
                    }}
                  >
                    Back to login
                  </StyledLink>
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
