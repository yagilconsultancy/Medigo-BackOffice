'use client';

import { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { AppModal } from '../../../../../modules/components/AppModal';
import {
  AppButton,
  FormikAppTextField,
  ColorPicker,
  RowStack,
} from '../../../../../modules/components';
import { pxToRem, useRolesPermissionsApi } from '../../../../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type CreateRoleModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export type CreateRoleFormValues = {
  name: string;
  display_name: string;
  description: string;
  color: string;
};

// ─── Validation ─────────────────────────────────────────────────────────────

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Role name is required')
    .matches(
      /^[a-z_]+$/,
      'Role name must be lowercase with underscores only (e.g., finance_admin)'
    ),
  display_name: Yup.string().required('Display name is required'),
  description: Yup.string().required('Description is required'),
});

const initialValues: CreateRoleFormValues = {
  name: '',
  display_name: '',
  description: '',
  color: '#000000',
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

export const CreateRoleModal = ({
  open,
  onClose,
  onSuccess,
}: CreateRoleModalProps) => {
  const [color, setColor] = useState('#000000');
  const { createAdminRole } = useRolesPermissionsApi();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const success = await createAdminRole({
        name: values.name,
        display_name: values.display_name,
        description: values.description || null,
        color: color || null,
      });

      if (success) {
        resetForm();
        setColor('#000000');
        onClose();
        onSuccess();
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppModal
      open={open}
      setOpen={() => onClose()}
      label="create-role-modal"
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
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, isValid, dirty }) => (
          <Form>
            <Stack>
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
                  Create New Role
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

              <Stack spacing={'16px'} sx={{ padding: '20px 24px' }}>
                {/* Role Name (snake_case) */}
                <Stack spacing={'6px'}>
                  <FieldLabel label="Role Name" />
                  <FormikAppTextField
                    name="name"
                    placeholder="e.g. finance_admin"
                    borderRadius="10px"
                  />
                </Stack>

                {/* Display Name */}
                <Stack spacing={'6px'}>
                  <FieldLabel label="Display Name" />
                  <FormikAppTextField
                    name="display_name"
                    placeholder="e.g. Finance Admin"
                    borderRadius="10px"
                  />
                </Stack>

                {/* Description */}
                <Stack spacing={'6px'}>
                  <FieldLabel label="Description" />
                  <FormikAppTextField
                    name="description"
                    placeholder="e.g. Manages financial operations and reports"
                    borderRadius="10px"
                    multiline
                    rows={3}
                  />
                </Stack>

                {/* Color (Optional) */}
                <ColorPicker
                  value={color}
                  onChange={setColor}
                  label="Color"
                />

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
                    Create Role
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
