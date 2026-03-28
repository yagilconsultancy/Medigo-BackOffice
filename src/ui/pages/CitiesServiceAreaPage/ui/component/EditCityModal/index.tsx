'use client';

import { Box, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
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

type EditCityModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: EditCityFormValues) => void;
  cityData: {
    cityName: string;
    province: string;
    numberOfZones: number;
    activeDrivers: number;
    activeRiders: number;
  };
};

type EditCityFormValues = {
  cityName: string;
  province: string;
  numberOfZones: string;
  activeDrivers: string;
  activeRiders: string;
};

// ─── Validation ─────────────────────────────────────────────────────────────

const validationSchema = Yup.object({
  cityName: Yup.string().required('City name is required'),
  province: Yup.string().required('Province / Territory is required'),
  numberOfZones: Yup.string().required('Number of zones is required'),
  activeDrivers: Yup.string().required('Active drivers is required'),
  activeRiders: Yup.string().required('Active riders is required'),
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

// ─── Component ──────────────────────────────────────────────────────────────

export const EditCityModal = ({
  open,
  onClose,
  onSubmit,
  cityData,
}: EditCityModalProps) => {
  const initialValues: EditCityFormValues = {
    cityName: cityData.cityName,
    province: cityData.province,
    numberOfZones: String(cityData.numberOfZones),
    activeDrivers: String(cityData.activeDrivers),
    activeRiders: String(cityData.activeRiders),
  };

  return (
    <AppModal
      open={open}
      setOpen={() => onClose()}
      label="edit-city-modal"
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
        enableReinitialize
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
                <RowStack spacing={'12px'}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: '#EBF2FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <LocationOnOutlinedIcon
                      sx={{ fontSize: 18, color: '#2F6FED' }}
                    />
                  </Box>
                  <Stack spacing={'2px'}>
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 700,
                        fontSize: pxToRem(15),
                        color: '#111827',
                      }}
                    >
                      Edit City
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 400,
                        fontSize: pxToRem(12.5),
                        color: '#6B7280',
                      }}
                    >
                      {cityData.cityName}, {cityData.province}
                    </Typography>
                  </Stack>
                </RowStack>

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
                {/* City Name */}
                <Stack spacing={'6px'}>
                  <FieldLabel label="City Name" />
                  <FormikAppTextField
                    name="cityName"
                    placeholder="City name"
                    borderRadius="10px"
                  />
                </Stack>

                {/* Province / Territory */}
                <Stack spacing={'6px'}>
                  <FieldLabel label="Province / Territory" />
                  <FormikAppTextField
                    name="province"
                    placeholder="Province or territory"
                    borderRadius="10px"
                  />
                </Stack>

                {/* Number of Zones */}
                <Stack spacing={'6px'}>
                  <FieldLabel label="Number of Zones" />
                  <FormikAppTextField
                    name="numberOfZones"
                    placeholder="Number of zones"
                    borderRadius="10px"
                  />
                </Stack>

                {/* Active Drivers */}
                <Stack spacing={'6px'}>
                  <FieldLabel label="Active Drivers" />
                  <FormikAppTextField
                    name="activeDrivers"
                    placeholder="Active drivers"
                    borderRadius="10px"
                  />
                </Stack>

                {/* Active Riders */}
                <Stack spacing={'6px'}>
                  <FieldLabel label="Active Riders" />
                  <FormikAppTextField
                    name="activeRiders"
                    placeholder="Active riders"
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
                    Save Changes
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
