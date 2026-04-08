'use client';

import { useEffect, useRef } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { AppModal } from '../../../../../modules/components/AppModal';
import {
  AppButton,
  FormikAppTextField,
  RowStack,
  RideDropdownMenuInput,
} from '../../../../../modules/components';
import { AppSelect } from '../../../../../modules/components/AppSelectDropdown';
import { pxToRem, useIncidentsApi } from '../../../../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type FileIncidentModalProps = {
  open: boolean;
  onClose: () => void;
};

type IncidentFormValues = {
  incidentType: string;
  severity: string;
  subjectName: string;
  subjectId?: string;
  subjectType: string;
  ride_id?: string;
  rideDisplay?: string;
  description: string;
};

// ─── Validation ─────────────────────────────────────────────────────────────

const validationSchema = Yup.object({
  incidentType: Yup.string().required('Incident type is required'),
  severity: Yup.string().required('Severity is required'),
  subjectName: Yup.string().optional(),
  subjectId: Yup.string().optional(),
  subjectType: Yup.string().required('Subject type is required'),
  ride_id: Yup.string().optional(),
  description: Yup.string().optional(),
});

const initialValues: IncidentFormValues = {
  incidentType: '',
  severity: '',
  subjectName: '',
  subjectId: '',
  subjectType: '',
  ride_id: '',
  rideDisplay: '',
  description: '',
};

// ─── Constants ──────────────────────────────────────────────────────────────

const incidentTypeOptions = ['Driver Complaint', 'Rider Complaint', 'Accident'];
const severityOptions = ['Low', 'Medium', 'High', 'Critical'];
const subjectTypeOptions = ['Driver', 'Rider', 'Vehicle'];

// Map UI values to API values
const incidentTypeToApi: Record<string, string> = {
  'Driver Complaint': 'driver_complaint',
  'Rider Complaint': 'rider_complaint',
  Accident: 'accident',
};

const severityToApi: Record<string, string> = {
  Low: 'low',
  Medium: 'medium',
  High: 'high',
  Critical: 'critical',
};

const subjectTypeToApi: Record<string, string> = {
  Driver: 'driver',
  Rider: 'rider',
  // Vehicle: 'vehicle',
};

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

// Helper component to clear subject fields when subject type changes
const SubjectTypeChangeHandler = ({
  subjectType,
  setFieldValue,
}: {
  subjectType: string;
  setFieldValue: (field: string, value: any) => void;
}) => {
  const prevSubjectTypeRef = useRef<string>(subjectType);

  useEffect(() => {
    if (
      prevSubjectTypeRef.current !== subjectType &&
      prevSubjectTypeRef.current !== ''
    ) {
      // Clear subject fields when type changes
      setFieldValue('subjectName', '');
      setFieldValue('subjectId', '');
    }
    prevSubjectTypeRef.current = subjectType;
  }, [subjectType, setFieldValue]);

  return null;
};

export const FileIncidentModal = ({
  open,
  onClose,
}: FileIncidentModalProps) => {
  const { createIncident } = useIncidentsApi();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const payload = {
        incident_type: incidentTypeToApi[values.incidentType],
        severity: severityToApi[values.severity],
        subject_name: values.subjectName,
        subject_id: values.subjectId || undefined,
        subject_type: subjectTypeToApi[values.subjectType],
        ride_id: values.rideId || undefined,
        description: values.description,
      };

      const success = await createIncident(payload);
      if (success) {
        resetForm();
        onClose();
      }
    } finally {
      setSubmitting(false);
    }
  };

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
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, isValid, dirty, setFieldValue, values }) => (
          <Form>
            <SubjectTypeChangeHandler
              subjectType={values.subjectType}
              setFieldValue={setFieldValue}
            />
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
              <Stack spacing={'16px'} sx={{ padding: '20px 24px' }}>
                {/* Incident Type */}
                <AppSelect
                  name="incidentType"
                  label="Incident Type"
                  options={incidentTypeOptions}
                  placeholder="Select incident type"
                  required
                />

                {/* Severity */}
                <AppSelect
                  name="severity"
                  label="Severity"
                  options={severityOptions}
                  placeholder="Select severity level"
                  required
                />

                {/* Subject Type */}
                <AppSelect
                  name="subjectType"
                  label="Subject Type"
                  options={subjectTypeOptions}
                  placeholder="Select subject type"
                  required
                />

                {/* Subject Selection - Dynamic based on Subject Type */}
                {/* {values.subjectType === 'Driver' && (
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

                {values.subjectType === 'Vehicle' && (
                  <>
                    <Stack spacing={'6px'}>
                      <FieldLabel label="Vehicle/Subject Name" />
                      <FormikAppTextField
                        name="subjectName"
                        placeholder="e.g. Tesla Model 3"
                        borderRadius="10px"
                      />
                    </Stack>
                    <Stack spacing={'6px'}>
                      <FieldLabel label="Vehicle ID (Optional)" />
                      <FormikAppTextField
                        name="subjectId"
                        placeholder="e.g. 3fa85f64-5717-4562-b3fc-2c963f66afa6"
                        borderRadius="10px"
                      />
                    </Stack>
                  </>
                )} */}

                {/* Ride/Trip Selection (Optional) */}
                <Stack spacing={'6px'}>
                  <FieldLabel label="Ride/Trip" />
                  <RideDropdownMenuInput
                    selectedRideId={values.ride_id}
                    selectedRideDisplay={values.rideDisplay}
                    handleRideSelected={(ride) => {
                      setFieldValue('ride_id', ride.id);
                      setFieldValue(
                        'rideDisplay',
                        `${ride.pickup_address.substring(0, 30)}... → ${ride.destination_address.substring(0, 30)}...`
                      );
                    }}
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
