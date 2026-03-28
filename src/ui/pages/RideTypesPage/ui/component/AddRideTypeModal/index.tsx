'use client';

import { Box, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { AppModal } from '../../../../../modules/components/AppModal';
import {
  AppButton,
  FormikAppTextField,
  RowStack,
} from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type AddRideTypeModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: AddRideTypeFormValues) => void;
};

type AddRideTypeFormValues = {
  rideTypeName: string;
  description: string;
  baseFare: string;
  perKmRate: string;
};

// ─── Validation ─────────────────────────────────────────────────────────────

const validationSchema = Yup.object({
  rideTypeName: Yup.string().required('Ride type name is required'),
  description: Yup.string().required('Description is required'),
  baseFare: Yup.string().required('Base fare is required'),
  perKmRate: Yup.string().required('Per km rate is required'),
});

const initialValues: AddRideTypeFormValues = {
  rideTypeName: '',
  description: '',
  baseFare: '',
  perKmRate: '',
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

// ─── Component ──────────────────────────────────────────────────────────────

export const AddRideTypeModal = ({
  open,
  onClose,
  onSubmit,
}: AddRideTypeModalProps) => {
  return (
    <AppModal
      open={open}
      setOpen={() => onClose()}
      label="add-ride-type-modal"
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
                  Add New Ride Type
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
                {/* Ride Type Name */}
                <Stack spacing={'6px'}>
                  <FieldLabel label="Ride Type Name" />
                  <FormikAppTextField
                    name="rideTypeName"
                    placeholder="e.g. Stretcher Transport"
                    borderRadius="10px"
                  />
                </Stack>

                {/* Description */}
                <Stack spacing={'6px'}>
                  <FieldLabel label="Description" />
                  <FormikAppTextField
                    name="description"
                    placeholder="Short description of this ride type"
                    borderRadius="10px"
                  />
                </Stack>

                {/* Base Fare (CAD) */}
                <Stack spacing={'6px'}>
                  <FieldLabel label="Base Fare (CAD)" />
                  <FormikAppTextField
                    name="baseFare"
                    placeholder="e.g. 22.00"
                    borderRadius="10px"
                  />
                </Stack>

                {/* Per km Rate */}
                <Stack spacing={'6px'}>
                  <FieldLabel label="Per km Rate" />
                  <FormikAppTextField
                    name="perKmRate"
                    placeholder="e.g. 3.80"
                    borderRadius="10px"
                  />
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
                    Add Ride Type
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
