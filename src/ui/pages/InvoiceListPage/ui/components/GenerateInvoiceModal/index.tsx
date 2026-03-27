'use client';

import { useState } from 'react';
import {
  Box,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { AppModal } from '../../../../../modules/components/AppModal';
import {
  AppButton,
  FormikAppTextField,
  RowStack,
} from '../../../../../modules/components';
import { AppDropdownMenu } from '../../../../../modules/components/AppDropdownMenu';
import { pxToRem } from '../../../../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type GenerateInvoiceModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: InvoiceFormValues) => void;
};

type InvoiceFormValues = {
  recipientName: string;
  email: string;
  rideType: string;
  numberOfTrips: string;
  amount: string;
  notes: string;
};

// ─── Validation ─────────────────────────────────────────────────────────────

const validationSchema = Yup.object({
  recipientName: Yup.string().required('Recipient name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  rideType: Yup.string(),
  numberOfTrips: Yup.string(),
  amount: Yup.string().required('Amount is required'),
  notes: Yup.string(),
});

const initialValues: InvoiceFormValues = {
  recipientName: '',
  email: '',
  rideType: '',
  numberOfTrips: '',
  amount: '',
  notes: '',
};

// ─── Constants ──────────────────────────────────────────────────────────────

const rideTypeOptions = [
  'Standard Medical',
  'Wheelchair Accessible',
  'Assisted Ride',
  'Stretcher Transport',
];

// ─── Label Component ────────────────────────────────────────────────────────

const FieldLabel = ({
  label,
  required,
}: {
  label: string;
  required?: boolean;
}) => (
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
    {required && (
      <Typography
        component="span"
        sx={{ color: '#EF4444', ml: '2px' }}
      >
        *
      </Typography>
    )}
  </Typography>
);

// ─── Component ──────────────────────────────────────────────────────────────

export const GenerateInvoiceModal = ({
  open,
  onClose,
  onSubmit,
}: GenerateInvoiceModalProps) => {
  const [rideTypeAnchorEl, setRideTypeAnchorEl] =
    useState<null | HTMLElement>(null);

  return (
    <AppModal
      open={open}
      setOpen={() => onClose()}
      label="generate-invoice-modal"
      padding="0px"
      sx={{
        '& .MuiDialog-paper': {
          width: 520,
          maxWidth: 520,
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
        {({ isSubmitting, isValid, dirty, setFieldValue, values }) => (
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
                <Stack spacing={'2px'}>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 700,
                      fontSize: pxToRem(15),
                      color: '#111827',
                    }}
                  >
                    Generate New Invoice
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 400,
                      fontSize: pxToRem(12.5),
                      color: '#9CA3AF',
                    }}
                  >
                    Fill in the details to create and send an invoice
                  </Typography>
                </Stack>

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
                {/* Row 1: Recipient Name + Email */}
                <RowStack spacing={'12px'} alignItems={'flex-start'}>
                  <Stack spacing={'6px'} sx={{ flex: 1 }}>
                    <FieldLabel label="Recipient Name" required />
                    <FormikAppTextField
                      name="recipientName"
                      placeholder="e.g. Helen Moore"
                      borderRadius="10px"
                    />
                  </Stack>
                  <Stack spacing={'6px'} sx={{ flex: 1 }}>
                    <FieldLabel label="Email Address" required />
                    <FormikAppTextField
                      name="email"
                      placeholder="billing@example.com"
                      borderRadius="10px"
                    />
                  </Stack>
                </RowStack>

                {/* Row 2: Ride Type + Number of Trips */}
                <RowStack spacing={'12px'} alignItems={'flex-start'}>
                  <Stack spacing={'6px'} sx={{ flex: 1 }}>
                    <FieldLabel label="Ride Type" />
                    <Box
                      onClick={(e) => setRideTypeAnchorEl(e.currentTarget)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 14px',
                        height: 42,
                        background: '#F7F9FB',
                        border: '0.67px solid #E8ECF0',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        '&:hover': { borderColor: '#D1D5DB' },
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: (theme) =>
                            theme.typography.fontFamily,
                          fontWeight: 400,
                          fontSize: pxToRem(13),
                          color: values.rideType
                            ? '#374151'
                            : 'rgba(55, 65, 81, 0.5)',
                        }}
                      >
                        {values.rideType || 'Select Ride type'}
                      </Typography>
                      <KeyboardArrowDownIcon
                        sx={{ fontSize: 18, color: '#9CA3AF' }}
                      />
                    </Box>
                    <AppDropdownMenu
                      open={Boolean(rideTypeAnchorEl)}
                      anchorEl={rideTypeAnchorEl}
                      onClose={() => setRideTypeAnchorEl(null)}
                      options={rideTypeOptions}
                      selectedOption={values.rideType}
                      onOptionSelected={(option) => {
                        setFieldValue('rideType', option);
                        setRideTypeAnchorEl(null);
                      }}
                      minWidth="228px"
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                      }}
                    />
                  </Stack>
                  <Stack spacing={'6px'} sx={{ flex: 1 }}>
                    <FieldLabel label="Number of Trips" />
                    <FormikAppTextField
                      name="numberOfTrips"
                      placeholder="e.g. 12"
                      type="number"
                      borderRadius="10px"
                    />
                  </Stack>
                </RowStack>

                {/* Row 3: Invoice Amount */}
                <Stack spacing={'6px'}>
                  <FieldLabel label="Invoice Amount (CAD)" required />
                  <FormikAppTextField
                    name="amount"
                    placeholder="0.00"
                    type="number"
                    borderRadius="14px"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment
                            position="start"
                            sx={{
                              mr: 0,
                              '& .MuiTypography-root': {
                                fontFamily: 'Inter, sans-serif',
                                fontWeight: 600,
                                fontSize: pxToRem(14),
                                color: '#9CA3AF',
                              },
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '0 12px',
                                marginLeft: '-14px',
                                height: 42,
                                background: '#F0F4F8',
                                borderRight: '0.67px solid #E8ECF0',
                                borderTopLeftRadius: '14px',
                                borderBottomLeftRadius: '14px',
                              }}
                            >
                              <Typography
                                sx={{
                                  fontFamily: (theme) =>
                                    theme.typography.fontFamily,
                                  fontWeight: 600,
                                  fontSize: pxToRem(14),
                                  color: '#9CA3AF',
                                }}
                              >
                                $
                              </Typography>
                            </Box>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Stack>

                {/* Row 4: Notes */}
                <Stack spacing={'6px'}>
                  <FieldLabel label="Notes (optional)" />
                  <FormikAppTextField
                    name="notes"
                    placeholder="Additional details for this invoice…"
                    multiline
                    rows={3}
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
                    color="primary"
                    isLoading={isSubmitting}
                    disabled={!isValid || !dirty}
                    sx={{
                      flex: 1,
                      height: 43,
                      borderRadius: '10px',
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: pxToRem(13),
                      boxShadow: 'none',
                      '&:hover': { boxShadow: 'none' },
                    }}
                  >
                    Generate & Send Invoice
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
