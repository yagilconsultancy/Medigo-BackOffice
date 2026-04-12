'use client';

import { useMemo, useState } from 'react';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Checkbox,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AccessibleOutlinedIcon from '@mui/icons-material/AccessibleOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined';
import { pxToRem, useCaregiversApi } from '../../../../../../common';
import type { UpdateCaregiverPayload } from '../../../../../../common';
import {
  AppButton,
  FormikAppTextField,
  RowStack,
} from '../../../../../modules/components';
import { AppDropdownMenu } from '../../../../../modules/components/AppDropdownMenu';
import { CaregiverProfileCardData } from '../CaregiverProfileCard';

// ─── Types ──────────────────────────────────────────────────────────────────

export type EditCaregiverDrawerData = CaregiverProfileCardData & {
  email?: string;
};

export type EditCaregiverDrawerProps = {
  open: boolean;
  onClose: () => void;
  caregiver: EditCaregiverDrawerData | null;
  onSuccess?: () => void;
};

// ─── Dropdown Options ───────────────────────────────────────────────────────

const specialtyOptions = [
  'Personal Support Worker',
  'Registered Nurse',
  'Home Health Aide',
  'Certified Nursing Assistant',
  'Occupational Therapist',
  'Licensed Practical Nurse',
];

const statusOptions = ['Available', 'On Assignment', 'Suspended'];

// ─── Capabilities Config ────────────────────────────────────────────────────

const capabilitiesConfig = [
  {
    name: 'wheelchairAssistance',
    label: 'Wheelchair Assistance',
    icon: <AccessibleOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />,
    iconBg: '#EBF2FF',
  },
  {
    name: 'seniorAssistance',
    label: 'Senior Assistance',
    icon: (
      <FavoriteBorderOutlinedIcon sx={{ fontSize: 18, color: '#EC4899' }} />
    ),
    iconBg: '#FDF2F8',
  },
  {
    name: 'medicalEscort',
    label: 'Medical Escort',
    icon: <SupportAgentOutlinedIcon sx={{ fontSize: 18, color: '#8B5CF6' }} />,
    iconBg: '#F5F3FF',
  },
  {
    name: 'stretcherTransport',
    label: 'Stretcher Transport',
    icon: <MonitorHeartOutlinedIcon sx={{ fontSize: 18, color: '#F59E0B' }} />,
    iconBg: '#FFFBEB',
  },
];

// ─── Capability label → field name mapping ──────────────────────────────────

const capabilityLabelToField: Record<string, string> = {
  'Wheelchair Assistance': 'wheelchairAssistance',
  'Senior Assistance': 'seniorAssistance',
  'Medical Escort': 'medicalEscort',
  'Stretcher Transport': 'stretcherTransport',
  // Also handle variations from mock data
  'Mobility Assistance': 'wheelchairAssistance',
  'Dementia Care': 'seniorAssistance',
  'Palliative Care': 'medicalEscort',
  'Medical Escort Support': 'medicalEscort',
};

// ─── Validation Schema ──────────────────────────────────────────────────────

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  phone: Yup.string().required('Phone number is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  specialty: Yup.string().required('Specialty is required'),
  status: Yup.string().required('Status is required'),
  city: Yup.string().required('City is required'),
  wheelchairAssistance: Yup.boolean(),
  seniorAssistance: Yup.boolean(),
  medicalEscort: Yup.boolean(),
  stretcherTransport: Yup.boolean(),
});

// ─── Reusable Field Label ───────────────────────────────────────────────────

const FieldLabel = ({
  text,
  required,
}: {
  text: string;
  required?: boolean;
}) => (
  <Typography
    sx={{
      fontFamily: (theme) => theme.typography.fontFamily,
      fontWeight: 700,
      fontSize: pxToRem(12),
      color: '#374151',
    }}
  >
    {text}
    {required && (
      <Typography component="span" sx={{ color: '#EF4444', ml: '2px' }}>
        *
      </Typography>
    )}
  </Typography>
);

// ─── Formik Dropdown Field ──────────────────────────────────────────────────

const FormikDropdownField = ({
  name,
  label,
  options,
  placeholder,
  required,
}: {
  name: string;
  label: string;
  options: string[];
  placeholder: string;
  required?: boolean;
}) => {
  const [field, meta, helpers] = useField(name);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <Stack spacing={'6px'}>
      <FieldLabel text={label} required={required} />
      <Box
        onClick={(e: React.MouseEvent<HTMLDivElement>) =>
          setAnchorEl(e.currentTarget)
        }
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          height: '38.83px',
          padding: '0 12px',
          borderRadius: '9px',
          border: `0.67px solid ${meta.touched && meta.error ? '#EF4444' : '#E8ECF0'}`,
          background: '#FFFFFF',
          cursor: 'pointer',
          transition: 'border-color 0.2s ease',
          '&:hover': {
            borderColor: meta.touched && meta.error ? '#EF4444' : '#9CA3AF',
          },
        }}
      >
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 500,
            fontSize: pxToRem(12),
            color: field.value ? '#374151' : 'rgba(55, 65, 81, 0.4)',
            flex: 1,
          }}
        >
          {field.value || placeholder}
        </Typography>
        <KeyboardArrowDownIcon sx={{ fontSize: 14, color: '#9CA3AF' }} />
      </Box>
      {meta.touched && meta.error && (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(11.5),
            color: '#EF4444',
          }}
        >
          {meta.error}
        </Typography>
      )}
      <AppDropdownMenu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null);
          helpers.setTouched(true);
        }}
        options={options}
        selectedOption={field.value}
        onOptionSelected={(option) => {
          helpers.setValue(option);
          helpers.setTouched(true);
          setAnchorEl(null);
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        sx={{
          '& .MuiPaper-root': {
            minWidth: anchorEl?.offsetWidth || 'auto',
          },
        }}
      />
    </Stack>
  );
};

// ─── Formik Checkbox Card ───────────────────────────────────────────────────

const FormikCheckboxCard = ({
  name,
  label,
  icon,
  iconBg,
}: {
  name: string;
  label: string;
  icon: React.ReactNode;
  iconBg: string;
}) => {
  const [field, , helpers] = useField(name);

  return (
    <RowStack
      onClick={() => helpers.setValue(!field.value)}
      sx={{
        padding: '12px',
        background: field.value ? '#EEF3FF' : '#F7F9FB',
        border: `1.33px solid ${field.value ? '#C7D7F9' : '#E8ECF0'}`,
        borderRadius: '14px',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        '&:hover': {
          borderColor: '#C7D7F9',
          background: '#F7F9FF',
        },
      }}
    >
      <Checkbox
        checked={!!field.value}
        size="small"
        sx={{
          color: 'rgba(0, 0, 0, 0.2)',
          '&.Mui-checked': { color: '#2F6FED' },
          padding: '2px',
          width: 16,
          height: 16,
        }}
      />
      <Box
        sx={{
          width: 14,
          height: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          ml: '12px',
          '& .MuiSvgIcon-root': { fontSize: 14 },
        }}
      >
        {icon}
      </Box>
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 600,
          fontSize: pxToRem(12.5),
          color: '#374151',
          flex: 1,
          ml: '12px',
        }}
      >
        {label}
      </Typography>
    </RowStack>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────────

export const EditCaregiverDrawer = ({
  open,
  onClose,
  caregiver,
  onSuccess,
}: EditCaregiverDrawerProps) => {
  const { updateCaregiver } = useCaregiversApi();

  const initialValues = useMemo(() => {
    if (!caregiver) {
      return {
        fullName: '',
        phone: '',
        email: '',
        specialty: '',
        status: '',
        city: '',
        wheelchairAssistance: false,
        seniorAssistance: false,
        medicalEscort: false,
        stretcherTransport: false,
      };
    }

    // Map capabilities array to boolean fields
    const caps: Record<string, boolean> = {
      wheelchairAssistance: false,
      seniorAssistance: false,
      medicalEscort: false,
      stretcherTransport: false,
    };
    caregiver.capabilities.forEach((cap) => {
      const fieldName = capabilityLabelToField[cap];
      if (fieldName) caps[fieldName] = true;
    });

    return {
      fullName: caregiver.name,
      phone: caregiver.phone,
      email: caregiver.email || '',
      specialty: caregiver.specialty,
      status: caregiver.status,
      city: caregiver.location,
      ...caps,
    };
  }, [caregiver]);

  if (!caregiver) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 680,
          boxShadow: '-4px 0px 48px rgba(0, 0, 0, 0.14)',
        },
      }}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const [firstName, ...lastNameParts] = values.fullName
              .trim()
              .split(' ');
            const lastName = lastNameParts.join(' ') || firstName;

            const capabilities = [
              values.wheelchairAssistance && 'Wheelchair Assistance',
              values.seniorAssistance && 'Senior Assistance',
              values.medicalEscort && 'Medical Escort',
              values.stretcherTransport && 'Stretcher Transport',
            ].filter(Boolean) as string[];

            const payload: UpdateCaregiverPayload = {
              caregiverId: caregiver.id,
              first_name: firstName,
              last_name: lastName,
              email: values.email.trim() || null,
              phone: values.phone.trim() || null,
              specialty: values.specialty || null,
              city: values.city.trim() || null,
              province: null,
              capabilities: capabilities.length ? capabilities : null,
              fleet_id: null,
            };

            const success = await updateCaregiver(payload);

            if (success) {
              onClose();
              onSuccess?.();
            }
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, isValid, dirty }) => (
          <Form
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            {/* ─── Header ────────────────────────────────────────── */}
            <RowStack
              justifyContent={'space-between'}
              sx={{
                padding: '20px 32px',
                borderBottom: '0.67px solid #EAECF0',
                boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.05)',
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
                Edit Caregiver
              </Typography>
              <IconButton
                onClick={onClose}
                sx={{
                  width: 32,
                  height: 32,
                  background: '#F3F4F6',
                  border: '0.67px solid #E5E7EB',
                  borderRadius: '8px',
                  '&:hover': { background: '#E5E7EB' },
                }}
              >
                <CloseIcon sx={{ fontSize: 14, color: '#6B7280' }} />
              </IconButton>
            </RowStack>

            {/* ─── Scrollable Content ────────────────────────────── */}
            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                padding: '32px',
                paddingRight: '47px',
                '::-webkit-scrollbar': { display: 'none' },
                scrollbarWidth: 'none',
              }}
            >
              {/* Personal Information Card */}
              <Box
                sx={{
                  border: '0.67px solid #EAECF0',
                  borderRadius: '16px',
                  overflow: 'hidden',
                }}
              >
                {/* Card Header */}
                <RowStack
                  spacing={'12px'}
                  sx={{
                    background: '#FAFBFF',
                    borderBottom: '0.67px solid #F0F2F5',
                    padding: '16px 24px',
                  }}
                >
                  <PersonOutlineIcon sx={{ fontSize: 15, color: '#2F6FED' }} />
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 700,
                      fontSize: pxToRem(13.5),
                      color: '#111827',
                    }}
                  >
                    Personal Information
                  </Typography>
                </RowStack>

                {/* Card Body */}
                <Stack spacing={'16px'} sx={{ padding: '24px' }}>
                  {/* Full Name */}
                  <Stack spacing={'6px'}>
                    <FieldLabel text="Full Name" required />
                    <FormikAppTextField
                      name="fullName"
                      placeholder="Emma Thompson"
                      borderRadius="9px"
                    />
                  </Stack>

                  {/* Phone + Email */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                    }}
                  >
                    <Stack spacing={'6px'}>
                      <FieldLabel text="Phone" required />
                      <FormikAppTextField
                        name="phone"
                        placeholder="+1 416 555 0198"
                        borderRadius="9px"
                      />
                    </Stack>
                    <Stack spacing={'6px'}>
                      <FieldLabel text="Email" required />
                      <FormikAppTextField
                        name="email"
                        placeholder="e.thompson@medigo.ca"
                        borderRadius="9px"
                      />
                    </Stack>
                  </Box>

                  {/* Specialty + Status */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                    }}
                  >
                    <FormikDropdownField
                      name="specialty"
                      label="Specialty"
                      options={specialtyOptions}
                      placeholder="Personal Support Worker"
                      required
                    />
                    <FormikDropdownField
                      name="status"
                      label="Status"
                      options={statusOptions}
                      placeholder="Available"
                      required
                    />
                  </Box>

                  {/* City */}
                  <Stack spacing={'6px'}>
                    <FieldLabel text="City" required />
                    <FormikAppTextField
                      name="city"
                      placeholder="Toronto, ON"
                      borderRadius="9px"
                    />
                  </Stack>

                  {/* Capabilities */}
                  <Stack spacing={'8px'}>
                    <FieldLabel text="Capabilities" />
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '12px',
                      }}
                    >
                      {capabilitiesConfig.map((cap) => (
                        <FormikCheckboxCard
                          key={cap.name}
                          name={cap.name}
                          label={cap.label}
                          icon={cap.icon}
                          iconBg={cap.iconBg}
                        />
                      ))}
                    </Box>
                  </Stack>
                </Stack>
              </Box>
            </Box>

            {/* ─── Footer ────────────────────────────────────────── */}
            <RowStack
              justifyContent={'flex-end'}
              spacing={'12px'}
              sx={{
                padding: '16px 32px',
                borderTop: '0.67px solid #EAECF0',
              }}
            >
              <Box
                onClick={isSubmitting ? undefined : onClose}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '41px',
                  padding: '0 24px',
                  borderRadius: '14px',
                  border: '0.67px solid #E8ECF0',
                  background: '#F7F9FB',
                  cursor: isSubmitting ? 'default' : 'pointer',
                  opacity: isSubmitting ? 0.5 : 1,
                  transition: 'opacity 0.15s ease',
                  '&:hover': isSubmitting ? {} : { opacity: 0.85 },
                }}
              >
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 600,
                    fontSize: pxToRem(13),
                    color: '#374151',
                  }}
                >
                  Cancel
                </Typography>
              </Box>
              <AppButton
                type="submit"
                startIcon={
                  !isSubmitting ? (
                    <CheckOutlinedIcon sx={{ fontSize: 14 }} />
                  ) : undefined
                }
                isLoading={isSubmitting}
                disabled={!dirty}
                sx={{
                  height: '40px',
                  borderRadius: '14px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: pxToRem(13),
                  padding: '0 24px',
                }}
              >
                Save Changes
              </AppButton>
            </RowStack>
          </Form>
        )}
      </Formik>
    </Drawer>
  );
};
