'use client';

import { Box, Stack, Typography } from '@mui/material';
import {
  AppButton,
  AppLabelField,
  Centered,
  FormikAppTextField,
  StyledImage,
  StyledLink,
} from '../../modules/components';
import appLogo from '../../assets/icons/app-logo.svg';
import { ApiForgotPasswordPayload, pxToRem } from '../../../common';
import { Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useAuthApi } from '../../../common/hooks/api';
import { useRouter } from 'next/navigation';

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('must be an email').required('email is required'),
});

export const ForgotPasswordPage = () => {
  const { forgotPassword } = useAuthApi();
  const router = useRouter();

  const initialValues: ApiForgotPasswordPayload = {
    email: '',
  };

  const handleSubmit = async (
    values: ApiForgotPasswordPayload,
    { setSubmitting }: FormikHelpers<ApiForgotPasswordPayload>
  ) => {
    setSubmitting(true);
    const success = await forgotPassword({ email: values.email });
    if (success) {
      router.push('/reset-password');
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
              Forgot Password
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
              Enter your admin email to receive password reset instructions
            </Typography>
          </Stack>
          <Formik
            initialValues={initialValues}
            validationSchema={ForgotPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ values, isSubmitting, isValid }) => (
              <Form>
                <Stack spacing={'20px'}>
                  <Stack spacing={0.5}>
                    <AppLabelField label="Email Address" />
                    <FormikAppTextField
                      name="email"
                      placeholder="admin@medigo.com"
                    />
                  </Stack>
                  <AppButton
                    type="submit"
                    disabled={!isValid || !values.email}
                    isLoading={isSubmitting}
                  >
                    Send Reset Instructions
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
