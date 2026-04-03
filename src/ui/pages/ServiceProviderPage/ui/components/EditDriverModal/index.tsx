'use client';

import { useRef, useState, useMemo } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Avatar, Box, IconButton, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { pxToRem } from '../../../../../../common';
import {
  AppButton,
  AppModal,
  FormikAppTextField,
  RowStack,
  VisuallyHiddenInput,
} from '../../../../../modules/components';
import { AppDropdownMenu } from '../../../../../modules/components/AppDropdownMenu';
import { DriverProfileCardData } from '../DriverProfileCard';

// ─── Types ──────────────────────────────────────────────────────────────────

type EditDriverModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  driver: DriverProfileCardData | null;
};

// ─── Dropdown Options ───────────────────────────────────────────────────────

const fleetOptions = [
  'Independent (MediGo Direct)',
  'MedRide Express',
  'CareTransit Co.',
  'HealthHaul LLC',
  'SafeRide Medical',
  'MobiCare Transport',
];

const tripStatusOptions = ['Available', 'On Trip', 'Off Duty'];
const accountStatusOptions = ['Active', 'Suspended', 'Pending'];
const docStatusOptions = ['Complete', 'Pending', 'Incomplete'];

// ─── Validation ─────────────────────────────────────────────────────────────

const validationSchema = Yup.object({
  fullName: Yup.string().required('Full name is required'),
  phone: Yup.string().required('Phone is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  fleet: Yup.string().required('Fleet is required'),
  tripStatus: Yup.string().required('Trip status is required'),
  accountStatus: Yup.string().required('Account status is required'),
  documentStatus: Yup.string().required('Document status is required'),
});

// ─── Reusable Dropdown Field ────────────────────────────────────────────────

const DropdownField = ({
  label,
  value,
  options,
  onChange,
  startIcon,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
  startIcon?: React.ReactNode;
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <Stack spacing={'6px'} sx={{ flex: 1 }}>
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 700,
          fontSize: pxToRem(12),
          lineHeight: '1.5em',
          color: '#374151',
        }}
      >
        {label}
      </Typography>
      <Box
        onClick={(e: React.MouseEvent<HTMLDivElement>) =>
          setAnchorEl(e.currentTarget)
        }
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '9px 12px',
          background: '#F9FAFB',
          border: '0.67px solid #E8ECF0',
          borderRadius: '10px',
          cursor: 'pointer',
          '&:hover': { borderColor: '#D1D5DB' },
        }}
      >
        {startIcon && (
          <Box sx={{ display: 'flex', color: '#9CA3AF' }}>{startIcon}</Box>
        )}
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(13),
            color: '#374151',
            flexGrow: 1,
          }}
        >
          {value}
        </Typography>
        <KeyboardArrowDownIcon sx={{ fontSize: 13, color: '#9CA3AF' }} />
      </Box>
      <AppDropdownMenu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        options={options}
        selectedOption={value}
        onOptionSelected={(opt) => {
          onChange(opt);
          setAnchorEl(null);
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      />
    </Stack>
  );
};

// ─── Component ──────────────────────────────────────────────────────────────

export const EditDriverModal = ({
  open,
  setOpen,
  driver,
}: EditDriverModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const initialValues = useMemo(() => {
    if (!driver) {
      return {
        fullName: '',
        phone: '',
        email: '',
        fleet: '',
        tripStatus: '',
        accountStatus: '',
        documentStatus: '',
      };
    }
    return {
      fullName: driver.name,
      phone: driver.phone,
      email: '',
      fleet: driver.fleet,
      tripStatus: driver.status,
      accountStatus: 'Active',
      documentStatus: 'Complete',
    };
  }, [driver]);

  if (!driver) return null;

  const nameParts = driver.name.split(' ');
  const initials =
    nameParts.length > 1
      ? `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`
      : nameParts[0].charAt(0);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  return (
    <AppModal
      open={open}
      setOpen={setOpen}
      label="Edit Driver"
      padding="0"
      sx={{
        '& .MuiDialog-paper': {
          width: '460px',
          maxWidth: '460px',
        },
      }}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={(values) => {
          console.log('Save driver:', driver.id, values);
          setOpen(false);
        }}
      >
        {({ values, setFieldValue, dirty }) => (
          <Form>
            <Stack sx={{ maxHeight: '90vh' }}>
              {/* ── Header ────────────────────────────────────────── */}
              <RowStack
                justifyContent={'space-between'}
                sx={{
                  padding: '20px 24px',
                  borderBottom: '0.67px solid #F0F4F8',
                }}
              >
                <Stack spacing={0}>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 700,
                      fontSize: pxToRem(15),
                      lineHeight: '1.5em',
                      color: '#111827',
                    }}
                  >
                    Edit Driver
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 400,
                      fontSize: pxToRem(12),
                      lineHeight: '1.5em',
                      color: '#9CA3AF',
                    }}
                  >
                    Manage driver details here
                  </Typography>
                </Stack>
                <IconButton
                  onClick={() => setOpen(false)}
                  sx={{
                    width: 30,
                    height: 30,
                    background: '#F3F4F6',
                    border: '0.67px solid #E5E7EB',
                    borderRadius: '8px',
                    '&:hover': { background: '#E5E7EB' },
                  }}
                >
                  <CloseIcon sx={{ fontSize: 14, color: '#6B7280' }} />
                </IconButton>
              </RowStack>

              {/* ── Scrollable Content ─────────────────────────────── */}
              <Stack
                spacing={'16px'}
                sx={{
                  padding: '24px 24px 24px',
                  overflowY: 'auto',
                  flex: 1,
                }}
              >
                {/* Profile Photo */}
                <Box
                  sx={{
                    background: '#F7F9FB',
                    border: '0.67px solid #EAECF0',
                    borderRadius: '14px',
                    padding: '16px',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 700,
                      fontSize: pxToRem(12),
                      lineHeight: '1.5em',
                      color: '#374151',
                      marginBottom: '10px',
                    }}
                  >
                    Profile Photo
                  </Typography>
                  <RowStack spacing={'16px'}>
                    <Avatar
                      src={avatarPreview || driver.avatar || undefined}
                      alt={driver.name}
                      sx={{
                        width: 56,
                        height: 56,
                        fontSize: pxToRem(18),
                        fontWeight: 600,
                        background: '#EBF2FF',
                        color: '#2F6FED',
                      }}
                    >
                      {initials}
                    </Avatar>
                    <Stack spacing={'5px'}>
                      <Box
                        onClick={() => fileInputRef.current?.click()}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 14px',
                          background: '#FFFFFF',
                          border: '1.33px solid #D1D5DB',
                          borderRadius: '9px',
                          cursor: 'pointer',
                          '&:hover': { background: '#F9FAFB' },
                        }}
                      >
                        <CloudUploadOutlinedIcon
                          sx={{ fontSize: 13, color: '#374151' }}
                        />
                        <Typography
                          sx={{
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 600,
                            fontSize: pxToRem(12.5),
                            lineHeight: '1.5em',
                            color: '#374151',
                          }}
                        >
                          Upload New Photo
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 400,
                          fontSize: pxToRem(11),
                          lineHeight: '1.5em',
                          color: '#9CA3AF',
                        }}
                      >
                        JPG, PNG or WebP · max 5 MB
                      </Typography>
                    </Stack>
                    <VisuallyHiddenInput
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleAvatarChange}
                    />
                  </RowStack>
                </Box>

                {/* Full Name */}
                <Stack spacing={'6px'}>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 700,
                      fontSize: pxToRem(12),
                      lineHeight: '1.5em',
                      color: '#374151',
                    }}
                  >
                    Full Name
                  </Typography>
                  <FormikAppTextField
                    name="fullName"
                    placeholder="Full name"
                    fontSize={{ xs: pxToRem(13) }}
                    padding={{ xs: '9px 12px' }}
                  />
                </Stack>

                {/* Phone Number */}
                <Stack spacing={'6px'}>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 700,
                      fontSize: pxToRem(12),
                      lineHeight: '1.5em',
                      color: '#374151',
                    }}
                  >
                    Phone Number
                  </Typography>
                  <FormikAppTextField
                    name="phone"
                    placeholder="Phone number"
                    fontSize={{ xs: pxToRem(13) }}
                    padding={{ xs: '9px 12px 9px 34px' }}
                    endIcon={
                      <PhoneOutlinedIcon
                        sx={{
                          fontSize: 13,
                          color: '#9CA3AF',
                          position: 'absolute',
                          left: 12,
                          top: '50%',
                          transform: 'translateY(-50%)',
                        }}
                      />
                    }
                  />
                </Stack>

                {/* Email Address */}
                <Stack spacing={'6px'}>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 700,
                      fontSize: pxToRem(12),
                      lineHeight: '1.5em',
                      color: '#374151',
                    }}
                  >
                    Email Address
                  </Typography>
                  <FormikAppTextField
                    name="email"
                    placeholder="Email address"
                    fontSize={{ xs: pxToRem(13) }}
                    padding={{ xs: '9px 12px 9px 34px' }}
                    endIcon={
                      <EmailOutlinedIcon
                        sx={{
                          fontSize: 13,
                          color: '#9CA3AF',
                          position: 'absolute',
                          left: 12,
                          top: '50%',
                          transform: 'translateY(-50%)',
                        }}
                      />
                    }
                  />
                </Stack>

                {/* Fleet Assignment */}
                <DropdownField
                  label="Fleet Assignment"
                  value={values.fleet}
                  options={fleetOptions}
                  onChange={(val) => setFieldValue('fleet', val)}
                />

                {/* Trip Status */}
                <DropdownField
                  label="Trip Status"
                  value={values.tripStatus}
                  options={tripStatusOptions}
                  onChange={(val) => setFieldValue('tripStatus', val)}
                />

                {/* Account Status */}
                <DropdownField
                  label="Account Status"
                  value={values.accountStatus}
                  options={accountStatusOptions}
                  onChange={(val) => setFieldValue('accountStatus', val)}
                />

                {/* Document Status */}
                <DropdownField
                  label="Document Status"
                  value={values.documentStatus}
                  options={docStatusOptions}
                  onChange={(val) => setFieldValue('documentStatus', val)}
                />
              </Stack>

              {/* ── Footer ────────────────────────────────────────── */}
              <RowStack
                spacing={'12px'}
                sx={{
                  padding: '16px 24px',
                  borderTop: '0.67px solid #F0F4F8',
                }}
              >
                <Box
                  onClick={() => setOpen(false)}
                  sx={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '10px',
                    background: '#F7F9FB',
                    border: '0.67px solid #E8ECF0',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    '&:hover': { background: '#F0F2F5' },
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 600,
                      fontSize: pxToRem(13),
                      lineHeight: '1.5em',
                      color: '#374151',
                    }}
                  >
                    Cancel
                  </Typography>
                </Box>
                <AppButton
                  type="submit"
                  disabled={!dirty}
                  sx={{
                    flex: 1,
                    height: '41px',
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: pxToRem(13),
                  }}
                >
                  <CheckOutlinedIcon sx={{ fontSize: 14 }} />
                  Save Changes
                </AppButton>
              </RowStack>
            </Stack>
          </Form>
        )}
      </Formik>
    </AppModal>
  );
};
