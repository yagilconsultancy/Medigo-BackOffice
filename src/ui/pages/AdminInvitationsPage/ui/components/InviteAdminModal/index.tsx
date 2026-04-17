'use client';

import { Box, Grid, Stack, Typography, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { AppModal } from '../../../../../modules/components/AppModal';
import {
  AppButton,
  FormikAppTextField,
  RowStack,
} from '../../../../../modules/components';
import {
  pxToRem,
  useListAdminRoles,
  useResolvedApiQuery,
  useAdminInvitationsApi,
} from '../../../../../../common';
import type { AdminRoleCardResponse } from '../../../../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type InviteAdminModalProps = {
  open: boolean;
  onClose: () => void;
};

type InviteAdminFormValues = {
  fullName: string;
  emailAddress: string;
  assignRole: string;
};

// ─── Helper Functions ───────────────────────────────────────────────────────

// Helper function to generate light background color from hex
const getLightBg = (hexColor: string): string => {
  // Map of specific colors to their light backgrounds
  const colorBgMap: Record<string, string> = {
    '#8B5CF6': '#F5F3FF', // Purple
    '#3B82F6': '#EFF6FF', // Blue
    '#10B981': '#ECFDF5', // Green
    '#F59E0B': '#FFFBEB', // Amber/Yellow
    '#2F6FED': '#EBF2FF', // Blue (legacy)
    '#6366F1': '#EEF2FF', // Indigo
    '#EC4899': '#FDF2F8', // Pink
  };
  return colorBgMap[hexColor] || '#F3F4F6'; // Default gray background
};

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

  // Fetch roles from API
  const { data: apiRolesData, isFetching } = useResolvedApiQuery(
    useListAdminRoles,
    [] as AdminRoleCardResponse[]
  );

  // Map API roles to role options
  const roleOptions = apiRolesData.map((role) => {
    const roleColor = role.color || '#6B7280';
    const roleBg = getLightBg(roleColor);

    return {
      id: role.id,
      name: role.name,
      label: role.display_name,
      color: roleColor,
      borderColor: roleColor,
      bg: roleBg,
    };
  });

  if (isFetching) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
        }}
      >
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Grid container spacing={'10px'}>
      {roleOptions.map((role) => {
        const isSelected = values.assignRole === role.name;
        return (
          <Grid key={role.id} size={{ xs: 6 }}>
            <RowStack
              onClick={() => setFieldValue('assignRole', role.name)}
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

export const InviteAdminModal = ({ open, onClose }: InviteAdminModalProps) => {
  const { inviteAdmin } = useAdminInvitationsApi();

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
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            const success = await inviteAdmin({
              full_name: values.fullName,
              email: values.emailAddress,
              role_name: values.assignRole,
            });

            if (success) {
              resetForm();
              onClose();
            }
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
                  <CloseIcon sx={{ fontSize: 16, color: '#374151' }} />
                </Box>
              </RowStack>

              {/* ── Form Content ───────────────────────────────── */}
              <Stack spacing={'24px'} sx={{ padding: '24px' }}>
                {/* Full Name */}
                <Stack spacing={'8px'}>
                  <FieldLabel label="Full Name" />
                  <FormikAppTextField
                    name="fullName"
                    placeholder="Enter admin full name"
                    variant="outlined"
                  />
                </Stack>

                {/* Email Address */}
                <Stack spacing={'8px'}>
                  <FieldLabel label="Email Address" />
                  <FormikAppTextField
                    name="emailAddress"
                    placeholder="Enter admin email address"
                    variant="outlined"
                    type="email"
                  />
                </Stack>

                {/* Assign Role */}
                <Stack spacing={'12px'}>
                  <FieldLabel label="Assign Role" />
                  <RoleSelector />
                </Stack>
              </Stack>

              {/* ── Footer (Actions) ───────────────────────────── */}
              <RowStack
                justifyContent={'flex-end'}
                spacing={'10px'}
                sx={{
                  padding: '16px 24px',
                  borderTop: '0.67px solid #F0F4F8',
                }}
              >
                <AppButton
                  onClick={onClose}
                  variant="contained"
                  color="secondary"
                  disabled={isSubmitting}
                  sx={{
                    textTransform: 'none',
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 600,
                    fontSize: pxToRem(13),
                    padding: '10px 20px',
                    borderRadius: '10px',
                  }}
                >
                  Cancel
                </AppButton>

                <AppButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting || !isValid || !dirty}
                  sx={{
                    textTransform: 'none',
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 600,
                    fontSize: pxToRem(13),
                    padding: '10px 20px',
                    borderRadius: '10px',
                    '&.Mui-disabled': {
                      background: '#E8ECF0',
                      color: '#9CA3AF',
                    },
                  }}
                  isLoading={isSubmitting}
                >
                  Send Invitation
                </AppButton>
              </RowStack>
            </Stack>
          </Form>
        )}
      </Formik>
    </AppModal>
  );
};
