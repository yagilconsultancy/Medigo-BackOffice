'use client';

import { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
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

type FileIncidentModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: IncidentFormValues) => void;
};

type IncidentFormValues = {
  incidentType: string;
  subject: string;
  filedBy: string;
  description: string;
};

// ─── Validation ─────────────────────────────────────────────────────────────

const validationSchema = Yup.object({
  incidentType: Yup.string().required('Incident type is required'),
  subject: Yup.string().required('Subject is required'),
  filedBy: Yup.string().required('Filed by is required'),
  description: Yup.string().required('Description is required'),
});

const initialValues: IncidentFormValues = {
  incidentType: '',
  subject: '',
  filedBy: '',
  description: '',
};

// ─── Constants ──────────────────────────────────────────────────────────────

const incidentTypeOptions = ['Driver Complaint', 'Rider Complaint', 'Accident'];

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

export const FileIncidentModal = ({
  open,
  onClose,
  onSubmit,
}: FileIncidentModalProps) => {
  const [typeAnchorEl, setTypeAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <AppModal
      open={open}
      setOpen={() => onClose()}
      label="file-incident-modal"
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
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 700,
                    fontSize: pxToRem(15),
                    color: '#111827',
                  }}
                >
                  File New Incident
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
                {/* Incident Type (Dropdown) */}
                <Stack spacing={'6px'}>
                  <FieldLabel label="Incident Type" />
                  <Box
                    onClick={(e) => setTypeAnchorEl(e.currentTarget)}
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
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 400,
                        fontSize: pxToRem(13),
                        color: values.incidentType
                          ? '#374151'
                          : 'rgba(55, 65, 81, 0.5)',
                      }}
                    >
                      {values.incidentType ||
                        'Driver Complaint / Rider Complaint / Accident'}
                    </Typography>
                    <KeyboardArrowDownIcon
                      sx={{ fontSize: 18, color: '#9CA3AF' }}
                    />
                  </Box>
                  <AppDropdownMenu
                    open={Boolean(typeAnchorEl)}
                    anchorEl={typeAnchorEl}
                    onClose={() => setTypeAnchorEl(null)}
                    options={incidentTypeOptions}
                    selectedOption={values.incidentType}
                    onOptionSelected={(option) => {
                      setFieldValue('incidentType', option);
                      setTypeAnchorEl(null);
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

                {/* Subject */}
                <Stack spacing={'6px'}>
                  <FieldLabel label="Subject (Name or Vehicle)" />
                  <FormikAppTextField
                    name="subject"
                    placeholder="e.g. Liam MacDonald"
                    borderRadius="10px"
                  />
                </Stack>

                {/* Filed By */}
                <Stack spacing={'6px'}>
                  <FieldLabel label="Filed By" />
                  <FormikAppTextField
                    name="filedBy"
                    placeholder="Name of the person filing"
                    borderRadius="10px"
                  />
                </Stack>

                {/* Description */}
                <Stack spacing={'6px'}>
                  <FieldLabel label="Description" />
                  <FormikAppTextField
                    name="description"
                    placeholder="Describe what happened..."
                    multiline
                    rows={4}
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
                    Submit Report
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
