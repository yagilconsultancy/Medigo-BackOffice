'use client';

import { useState, useEffect } from 'react';
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

type EditRoleModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  roleId: string;
  initialData: {
    display_name: string;
    description: string;
    color: string;
  };
};

export type EditRoleFormValues = {
  display_name: string;
  description: string;
  color: string;
};

// ─── Validation ─────────────────────────────────────────────────────────────

const validationSchema = Yup.object({
  display_name: Yup.string().required('Display name is required'),
  description: Yup.string().required('Description is required'),
});

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

export const EditRoleModal = ({
  open,
  onClose,
  onSuccess,
  roleId,
  initialData,
}: EditRoleModalProps) => {
  const [color, setColor] = useState(initialData.color || '#000000');
  const { updateAdminRole } = useRolesPermissionsApi();

  // Update color when initialData changes
  useEffect(() => {
    setColor(initialData.color || '#000000');
  }, [initialData.color]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const success = await updateAdminRole({
        roleId,
        display_name: values.display_name || null,
        description: values.description || null,
        color: color || null,
      });

      if (success) {
        resetForm();
        onClose();
        onSuccess();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppModal
      open={open}
      setOpen={() => onClose()}
      label="edit-role-modal"
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
        initialValues={{
          display_name: initialData.display_name,
          description: initialData.description,
          color: initialData.color,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
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
                  Edit Role
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
                    disabled={!isValid || (!dirty && color === initialData.color)}
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
                    Update Role
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
