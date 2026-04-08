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
  AppSelect,
} from '../../../../../modules/components';
import { UserDropdownMenuInput } from '../../../../../modules/components/UserDropdownMenuInput';
import { AppDropdownMenu } from '../../../../../modules/components/AppDropdownMenu';
import { pxToRem } from '../../../../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type IssueDisciplinaryActionModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: DisciplinaryFormValues) => void;
};

type DisciplinaryFormValues = {
  subjectType: string;
  subjectId: string;
  subjectName: string;
  incidentReference: string;
  actionType: string;
  duration: string;
  reason: string;
};

// ─── Validation ─────────────────────────────────────────────────────────────

const validationSchema = Yup.object({
  subjectType: Yup.string().required('Subject type is required'),
  subjectName: Yup.string().required('Subject is required'),
  incidentReference: Yup.string().required('Incident reference is required'),
  actionType: Yup.string().required('Action type is required'),
  duration: Yup.string().required('Duration is required'),
  reason: Yup.string().required('Reason is required'),
});

const initialValues: DisciplinaryFormValues = {
  subjectType: '',
  subjectId: '',
  subjectName: '',
  incidentReference: '',
  actionType: '',
  duration: '',
  reason: '',
};

// ─── Constants ──────────────────────────────────────────────────────────────

const subjectTypeOptions = ['Driver', 'Rider'];

const actionTypeOptions = [
  'Account Suspension',
  'Driving Suspension',
  'Written Warning',
  'Account Warning',
  'Driving Ban',
];

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

export const IssueDisciplinaryActionModal = ({
  open,
  onClose,
  onSubmit,
}: IssueDisciplinaryActionModalProps) => {
  const [typeAnchorEl, setTypeAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <AppModal
      open={open}
      setOpen={() => onClose()}
      label="issue-disciplinary-action-modal"
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
                  Issue Disciplinary Action
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
                {/* Subject Type */}
                <AppSelect
                  name="subjectType"
                  label="Subject Type"
                  options={subjectTypeOptions}
                  placeholder="Select subject type"
                  required
                />

                {/* Subject Selection - Dynamic based on Subject Type */}
                {values.subjectType === 'Driver' && (
                  <Stack spacing={'6px'}>
                    <FieldLabel label="Select Driver" />
                    <UserDropdownMenuInput
                      type="driver"
                      selectedUserId={values.subjectId}
                      selectedUserName={values.subjectName}
                      handleUserSelected={(user) => {
                        setFieldValue('subjectId', user.id);
                        setFieldValue(
                          'subjectName',
                          `${user.firstName} ${user.lastName}`
                        );
                      }}
                    />
                  </Stack>
                )}

                {values.subjectType === 'Rider' && (
                  <Stack spacing={'6px'}>
                    <FieldLabel label="Select Rider" />
                    <UserDropdownMenuInput
                      type="rider"
                      selectedUserId={values.subjectId}
                      selectedUserName={values.subjectName}
                      handleUserSelected={(user) => {
                        setFieldValue('subjectId', user.id);
                        setFieldValue(
                          'subjectName',
                          `${user.firstName} ${user.lastName}`
                        );
                      }}
                    />
                  </Stack>
                )}

                {/* Incident Reference */}
                <Stack spacing={'6px'}>
                  <FieldLabel label="Incident Reference" />
                  <FormikAppTextField
                    name="incidentReference"
                    placeholder="e.g. INC-4401"
                    borderRadius="10px"
                  />
                </Stack>

                {/* Action Type (Dropdown) */}
                <Stack spacing={'6px'}>
                  <FieldLabel label="Action Type" />
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
                        color: values.actionType
                          ? '#374151'
                          : 'rgba(55, 65, 81, 0.5)',
                      }}
                    >
                      {values.actionType || 'Suspension / Warning / Ban'}
                    </Typography>
                    <KeyboardArrowDownIcon
                      sx={{ fontSize: 18, color: '#9CA3AF' }}
                    />
                  </Box>
                  <AppDropdownMenu
                    open={Boolean(typeAnchorEl)}
                    anchorEl={typeAnchorEl}
                    onClose={() => setTypeAnchorEl(null)}
                    options={actionTypeOptions}
                    selectedOption={values.actionType}
                    onOptionSelected={(option) => {
                      setFieldValue('actionType', option);
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

                {/* Duration */}
                <Stack spacing={'6px'}>
                  <FieldLabel label="Duration" />
                  <FormikAppTextField
                    name="duration"
                    placeholder="e.g. 7 days / On Record"
                    borderRadius="10px"
                  />
                </Stack>

                {/* Reason */}
                <Stack spacing={'6px'}>
                  <FieldLabel label="Reason" />
                  <FormikAppTextField
                    name="reason"
                    placeholder="Describe the reason for this action..."
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
                    isLoading={isSubmitting}
                    disabled={!isValid || !dirty}
                    sx={{
                      flex: 1,
                      height: 43,
                      borderRadius: '10px',
                      background: '#6366F1',
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: pxToRem(13),
                      boxShadow: 'none',
                      '&:hover': {
                        background: '#4F46E5',
                        boxShadow: 'none',
                      },
                      '&.Mui-disabled': {
                        background: 'rgba(99, 102, 241, 0.5)',
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                    }}
                  >
                    Issue Action
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
