'use client';

import { Box, Grid, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { AppModal } from '../../../../../modules/components/AppModal';
import {
  AppButton,
  FormikAppTextField,
  RowStack,
} from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type InviteAdminModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: InviteAdminFormValues) => void;
};

type InviteAdminFormValues = {
  fullName: string;
  emailAddress: string;
  assignRole: string;
};

// ─── Roles ──────────────────────────────────────────────────────────────────

const roleOptions = [
  { label: 'Super Admin', color: '#2F6FED', borderColor: '#2F6FED', bg: '#EBF2FF' },
  { label: 'Operations Admin', color: '#10B981', borderColor: '#10B981', bg: '#ECFDF5' },
  { label: 'Finance Admin', color: '#6366F1', borderColor: '#6366F1', bg: '#EEF2FF' },
  { label: 'Support Admin', color: '#F59E0B', borderColor: '#F59E0B', bg: '#FFFBEB' },
];

// ─── Validation ─────────────────────────────────────────────────────────────

const validationSchema = Yup.object({
  fullName: Yup.string().required('Full name is required'),
  emailAddress: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  assignRole: Yup.string().required('Please select a role'),
});

const initialValues: InviteAdminFormValues = {
  fullName: '',
  emailAddress: '',
  assignRole: '',
};

// ─── Label Component ────────────────────────────────────────────────────────

const FieldLabel = ({ label }: { label: string }) => (
  <Typography
    sx={{
      fontFamily: (theme) => theme.typography.fontFamily,
      fontWeight: 600,
      fontSize: pxToRem(12.5),
      color: '#374151',
      lineHeight: '1.5em',
    }}
  >
    {label}
  </Typography>
);

// ─── Role Selector ──────────────────────────────────────────────────────────

const RoleSelector = () => {
  const { values, setFieldValue } = useFormikContext<InviteAdminFormValues>();

  return (
    <Grid container spacing={'10px'}>
      {roleOptions.map((role) => {
        const isSelected = values.assignRole === role.label;
        return (
          <Grid key={role.label} size={{ xs: 6 }}>
            <RowStack
              onClick={() => setFieldValue('assignRole', role.label)}
              spacing={'8px'}
              sx={{
                padding: '10px 14px',
                borderRadius: '10px',
                cursor: 'pointer',
                background: isSelected ? role.bg : '#FFFFFF',
                border: isSelected
                  ? `1.5px solid ${role.borderColor}`
                  : '1px solid #E8ECF0',
                transition: 'all 0.15s ease',
                '&:hover': {
                  borderColor: role.borderColor,
                },
              }}
            >
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  border: isSelected
                    ? `4px solid ${role.color}`
                    : '1.5px solid #D1D5DB',
                  flexShrink: 0,
                }}
              />
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: isSelected ? 600 : 400,
                  fontSize: pxToRem(13),
                  color: isSelected ? role.color : '#374151',
                  lineHeight: '1.5em',
                }}
              >
                {role.label}
              </Typography>
            </RowStack>
          </Grid>
        );
      })}
    </Grid>
  );
};

// ─── Component ──────────────────────────────────────────────────────────────

export const InviteAdminModal = ({
  open,
  onClose,
  onSubmit,
}: InviteAdminModalProps) => {
  return (
    <AppModal
      open={open}
      setOpen={() => onClose()}
      label="invite-admin-modal"
      padding="0px"
      sx={{
        '& .MuiDialog-paper': {
          width: 480,
          maxWidth: 480,
          borderRadius: '16px',
          boxShadow: '0px 32px 80px 0px rgba(0, 0, 0, 0.22)',
          overflow: 'hidden',
        },
      }}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            onSubmit(values);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, isValid, dirty }) => (
          <Form>
            <Stack>
              {/* ── Header ─────────────────────────────────────── */}
              <RowStack
                justifyContent={'space-between'}
                alignItems={'center'}
                sx={{
                  padding: '20px 24px',
                  borderBottom: '0.67px solid #F0F4F8',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 700,
                    fontSize: pxToRem(15),
                    color: '#111827',
                  }}
                >
                  Invite Admin
                </Typography>

                <Box
                  onClick={onClose}
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '14px',
                    background: '#F7F9FB',
                    border: '0.67px solid #E8ECF0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                    '&:hover': { background: '#E8ECF0' },
                  }}
                >
                  <CloseIcon sx={{ fontSize: 14, color: '#6B7280' }} />
                </Box>
              </RowStack>

              {/* ── Body ──────────────────────────────────────── */}
              <Stack spacing={'16px'} sx={{ padding: '20px 24px' }}>
                {/* Full Name */}
                <Stack spacing={'6px'}>
                  <FieldLabel label="Full Name" />
                  <FormikAppTextField
                    name="fullName"
                    placeholder="e.g. Claire Beaumont"
                    borderRadius="10px"
                  />
                </Stack>

                {/* Email Address */}
                <Stack spacing={'6px'}>
                  <FieldLabel label="Email Address" />
                  <FormikAppTextField
                    name="emailAddress"
                    placeholder="claire@medigo.ca"
                    borderRadius="10px"
                  />
                </Stack>

                {/* Assign Role */}
                <Stack spacing={'6px'}>
                  <FieldLabel label="Assign Role" />
                  <RoleSelector />
                </Stack>

                {/* ── Footer Buttons ─────────────────────────── */}
                <RowStack spacing={'12px'} sx={{ pt: '4px' }}>
                  <AppButton
                    variant="contained"
                    color="secondary"
                    onClick={onClose}
                    disabled={isSubmitting}
                    sx={{
                      flex: 1,
                      height: 43,
                      borderRadius: '10px',
                      background: '#F7F9FB',
                      border: '0.67px solid #E8ECF0',
                      color: '#374151',
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: pxToRem(13),
                      boxShadow: 'none',
                      '&:hover': {
                        background: '#E8ECF0',
                        boxShadow: 'none',
                      },
                    }}
                  >
                    Cancel
                  </AppButton>
                  <AppButton
                    type="submit"
                    variant="contained"
                    isLoading={isSubmitting}
                    disabled={!isValid || !dirty}
                    sx={{
                      flex: 1,
                      height: 43,
                      borderRadius: '10px',
                      background: '#2F6FED',
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: pxToRem(13),
                      boxShadow: 'none',
                      '&:hover': {
                        background: '#2558C9',
                        boxShadow: 'none',
                      },
                      '&.Mui-disabled': {
                        background: 'rgba(47, 111, 237, 0.5)',
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                    }}
                  >
                    Send Invite
                  </AppButton>
                </RowStack>
              </Stack>
            </Stack>
          </Form>
        )}
      </Formik>
    </AppModal>
  );
};
