'use client';

import { useMemo, useRef, useState } from 'react';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';
import dayjs, { Dayjs } from 'dayjs';
import {
  Avatar,
  Box,
  Checkbox,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import {
  pxToRem,
  useDriversApi,
  useGetAllFleetCompanies,
  useGetFleetVehicles,
  useResolvedApiQuery,
} from '../../../../../../common';
import type {
  CreateDriverPayload,
  FleetCompanyDetailResponse,
  VehicleResponse,
} from '../../../../../../common';
import {
  AppButton,
  AppDatePickerPopover,
  FormikAppPasswordField,
  FormikAppTextField,
  RowStack,
  VisuallyHiddenInput,
} from '../../../../../modules/components';
import { AppDropdownMenu } from '../../../../../modules/components/AppDropdownMenu';

// ─── Types ──────────────────────────────────────────────────────────────────

export type AddDriverDrawerProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

// ─── Static Dropdown Options ────────────────────────────────────────────────

const bgCheckOptions = ['Verified', 'Pending', 'Not Verified'];

// ─── Date Helper ────────────────────────────────────────────────────────────

const toIsoDate = (value?: string | null): string | null => {
  if (!value) return null;
  const parsed = dayjs(value, 'MM/DD/YYYY');
  return parsed.isValid() ? parsed.format('YYYY-MM-DD') : null;
};

// ─── Service Capabilities Config ────────────────────────────────────────────

const capabilitiesConfig = [
  { name: 'wheelchairAssistance', label: 'Wheelchair Assistance' },
  { name: 'seniorAssistance', label: 'Senior Assistance' },
  { name: 'medicalEscort', label: 'Medical Escort Support' },
  { name: 'stretcherTransport', label: 'Stretcher Transport' },
];

// ─── Validation Schema ──────────────────────────────────────────────────────

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  phone: Yup.string().required('Phone number is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  dateOfBirth: Yup.string(),
  fleet: Yup.string().required('Fleet company is required'),
  licenseNumber: Yup.string().required('License number is required'),
  licenseExpiry: Yup.string().required('License expiry date is required'),
  medicalCertification: Yup.string(),
  bgCheckStatus: Yup.string(),
  vehicle: Yup.string(),
  wheelchairAssistance: Yup.boolean(),
  medicalEscort: Yup.boolean(),
  seniorAssistance: Yup.boolean(),
  stretcherTransport: Yup.boolean(),
  appPassword: Yup.string(),
});

const initialValues = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  dateOfBirth: '',
  fleet: '',
  licenseNumber: '',
  licenseExpiry: '',
  medicalCertification: '',
  bgCheckStatus: '',
  vehicle: '',
  wheelchairAssistance: false,
  medicalEscort: false,
  seniorAssistance: false,
  stretcherTransport: false,
  appPassword: '',
};

// ─── Section Card Wrapper ──────────────────────────────────────────────────

const SectionCard = ({ children }: { children: React.ReactNode }) => (
  <Stack
    spacing={'16px'}
    sx={{
      background: '#FFFFFF',
      border: '0.67px solid #F0F4F8',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.04)',
    }}
  >
    {children}
  </Stack>
);

// ─── Reusable Section Header ────────────────────────────────────────────────

const SectionHeader = ({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) => (
  <RowStack spacing={'10px'}>
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: '8px',
        background: '#EBF2FF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {icon}
    </Box>
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 700,
        fontSize: pxToRem(14),
        color: '#111827',
      }}
    >
      {title}
    </Typography>
  </RowStack>
);

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
      fontWeight: 600,
      fontSize: pxToRem(12.5),
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
  startIcon,
}: {
  name: string;
  label: string;
  options: string[];
  placeholder: string;
  required?: boolean;
  startIcon?: React.ReactNode;
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
          height: '45px',
          padding: '0 14px',
          borderRadius: '10px',
          border: `1px solid ${meta.touched && meta.error ? '#EF4444' : '#E5E7EB'}`,
          background: '#FFFFFF',
          cursor: 'pointer',
          transition: 'border-color 0.2s ease',
          '&:hover': {
            borderColor: meta.touched && meta.error ? '#EF4444' : '#9CA3AF',
          },
        }}
      >
        {startIcon}
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(14),
            color: field.value ? '#111827' : '#9CA3AF',
            flex: 1,
          }}
        >
          {field.value || placeholder}
        </Typography>
        <KeyboardArrowDownIcon sx={{ fontSize: 18, color: '#9CA3AF' }} />
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

// ─── Formik Date Field ──────────────────────────────────────────────────────

const FormikDateField = ({
  name,
  label,
  required,
}: {
  name: string;
  label: string;
  required?: boolean;
}) => {
  const [, meta, helpers] = useField(name);

  return (
    <Stack spacing={'6px'}>
      <FieldLabel text={label} required={required} />
      <AppDatePickerPopover
        value={meta.value ? dayjs(meta.value, 'MM/DD/YYYY') : null}
        onChange={(date: Dayjs | null) => {
          helpers.setValue(date ? date.format('MM/DD/YYYY') : '');
          helpers.setTouched(true);
        }}
        format="MM/DD/YYYY"
        buttonSx={{
          width: '100%',
          height: '45px',
          borderRadius: '10px',
          border: `1px solid ${meta.touched && meta.error ? '#EF4444' : '#E5E7EB'}`,
          background: '#FFFFFF',
          justifyContent: 'flex-start',
          padding: '0 14px',
          '&:hover': {
            borderColor: meta.touched && meta.error ? '#EF4444' : '#9CA3AF',
            background: '#FFFFFF',
          },
        }}
        textSx={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          fontSize: pxToRem(14),
          color: meta.value ? '#111827' : '#9CA3AF',
        }}
        iconSx={{ color: '#9CA3AF', fontSize: 18 }}
      />
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
    </Stack>
  );
};

// ─── File Upload Field ──────────────────────────────────────────────────────

const FileUploadField = ({
  label,
  file,
  onFileSelect,
  onFileClear,
}: {
  label: string;
  file: File | null;
  onFileSelect: (file: File) => void;
  onFileClear: () => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Stack spacing={'6px'} height="auto">
      <FieldLabel text={label} />
      {file ? (
        <RowStack
          sx={{
            height: '80px',
            padding: '0 14px',
            borderRadius: '10px',
            border: '0.67px solid #BBF7D0',
            background: '#ECFDF5',
          }}
        >
          <RowStack spacing={'8px'} sx={{ overflow: 'hidden', flex: 1 }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 16, color: '#059669' }} />
            <Typography
              noWrap
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 500,
                fontSize: pxToRem(13),
                color: '#059669',
              }}
            >
              {file.name}
            </Typography>
          </RowStack>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onFileClear();
              if (inputRef.current) inputRef.current.value = '';
            }}
            sx={{
              width: 22,
              height: 22,
              color: '#EF4444',
              '&:hover': { background: 'rgba(239, 68, 68, 0.08)' },
            }}
          >
            <CancelOutlinedIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </RowStack>
      ) : (
        <AppButton
          onClick={() => inputRef.current?.click()}
          sx={{
            height: '80px',
            padding: '0 14px',
            borderRadius: '10px',
            border: '1px dashed #D1D5DB',
            background: '#FAFBFC',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': { borderColor: '#2F6FED', background: '#F7F9FF' },
          }}
        >
          <Stack
            alignItems={'center'}
            justifyContent={'center'}
            spacing={'6px'}
            sx={{
              // height: '80px',
              // padding: '0 14px',
              // borderRadius: '10px',
              // border: '1px dashed #D1D5DB',
              // background: '#FAFBFC',
              cursor: 'pointer',
              // transition: 'all 0.2s ease',
              // '&:hover': { borderColor: '#2F6FED', background: '#F7F9FF' },
            }}
          >
            <CloudUploadOutlinedIcon sx={{ fontSize: 20, color: '#9CA3AF' }} />
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(12.5),
                color: '#9CA3AF',
              }}
            >
              Click to upload PDF or image
            </Typography>
          </Stack>
        </AppButton>
      )}
      <VisuallyHiddenInput
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.webp"
        onChange={(e) => {
          const selected = e.target.files?.[0];
          if (selected) onFileSelect(selected);
        }}
      />
    </Stack>
  );
};

// ─── Formik Checkbox Card ───────────────────────────────────────────────────

const FormikCheckboxCard = ({
  name,
  label,
}: {
  name: string;
  label: string;
}) => {
  const [field, , helpers] = useField(name);

  return (
    <RowStack
      onClick={() => helpers.setValue(!field.value)}
      sx={{
        padding: '12px 14px',
        background: field.value ? '#EEF3FF' : '#F7F9FB',
        border: `0.67px solid ${field.value ? '#C7D7F9' : '#F0F2F5'}`,
        borderRadius: '12px',
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
        sx={{
          color: '#D1D5DB',
          '&.Mui-checked': { color: '#2F6FED' },
          padding: '4px',
        }}
      />
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 500,
          fontSize: pxToRem(13),
          color: '#374151',
          flex: 1,
          ml: '10px',
        }}
      >
        {label}
      </Typography>
    </RowStack>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────────

export const AddDriverDrawer = ({
  open,
  onClose,
  onSuccess,
}: AddDriverDrawerProps) => {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [certFile, setCertFile] = useState<File | null>(null);

  const { createDriver } = useDriversApi();

  const { data: fleetCompanies } = useResolvedApiQuery(
    useGetAllFleetCompanies,
    [] as FleetCompanyDetailResponse[]
  );

  const vehiclesQuery = useGetFleetVehicles({ page: 1, limit: 100 });
  const allVehicles: VehicleResponse[] = useMemo(
    () => vehiclesQuery.data?.data ?? [],
    [vehiclesQuery.data]
  );

  const fleetOptionMap = useMemo(() => {
    const map = new Map<string, string>();
    fleetCompanies.forEach((company) => map.set(company.name, company.id));
    return map;
  }, [fleetCompanies]);

  const fleetOptions = useMemo(
    () => fleetCompanies.map((company) => company.name),
    [fleetCompanies]
  );

  const buildVehicleLabel = (vehicle: VehicleResponse) =>
    `${vehicle.make} ${vehicle.model} · ${vehicle.year} (${vehicle.plate_number})`;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    setAvatarPreview(null);
    setLicenseFile(null);
    setCertFile(null);
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 860,
          boxShadow: '-4px 0px 48px rgba(0, 0, 0, 0.14)',
        },
      }}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            const fleetId = fleetOptionMap.get(values.fleet);
            if (!fleetId) {
              setSubmitting(false);
              return;
            }

            const fleetVehicles = allVehicles.filter(
              (v) => v.business_id === fleetId
            );
            const selectedVehicle = fleetVehicles.find(
              (v) => buildVehicleLabel(v) === values.vehicle
            );

            const capabilities = [
              values.wheelchairAssistance && 'wheelchair_assistance',
              values.seniorAssistance && 'senior_assistance',
              values.medicalEscort && 'medical_escort',
              values.stretcherTransport && 'stretcher_transport',
            ].filter(Boolean) as string[];

            const payload: CreateDriverPayload = {
              first_name: values.firstName.trim(),
              last_name: values.lastName.trim(),
              email: values.email.trim(),
              fleet_id: fleetId,
              phone: values.phone.trim() || null,
              license_number: values.licenseNumber.trim() || null,
              license_expiry: toIsoDate(values.licenseExpiry),
              medical_transport_certification:
                values.medicalCertification.trim() || null,
              background_check_status: values.bgCheckStatus || undefined,
              vehicle_id: selectedVehicle?.id ?? null,
              service_capabilities: capabilities.length
                ? capabilities.join(',')
                : null,
              date_of_birth: toIsoDate(values.dateOfBirth),
              drivers_license_file: licenseFile,
              certificate_file: certFile,
            };

            const success = await createDriver(payload);

            if (success) {
              resetForm();
              handleClose();
              onSuccess?.();
            }
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, isValid, dirty, values }) => {
          const selectedFleetId = fleetOptionMap.get(values.fleet);
          const filteredVehicles = selectedFleetId
            ? allVehicles.filter((v) => v.business_id === selectedFleetId)
            : [];
          const vehicleOptions = filteredVehicles.map(buildVehicleLabel);

          return (
          <Form
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            {/* ─── Header ────────────────────────────────────────── */}
            <Stack
              sx={{
                padding: '20px 24px',
                borderBottom: '0.67px solid #F0F4F8',
              }}
            >
              <RowStack justifyContent={'space-between'}>
                <Stack spacing={'4px'}>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 700,
                      fontSize: pxToRem(18),
                      color: '#111827',
                    }}
                  >
                    Add New Driver
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 400,
                      fontSize: pxToRem(13),
                      color: '#6B7280',
                    }}
                  >
                    Create a new driver profile and assign them to a fleet and
                    vehicle.
                  </Typography>
                </Stack>
                <IconButton
                  onClick={handleClose}
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
            </Stack>

            {/* ─── Scrollable Content ────────────────────────────── */}
            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                padding: '24px',
                '::-webkit-scrollbar': { display: 'none' },
                scrollbarWidth: 'none',
              }}
            >
              <Stack spacing={'20px'}>
                {/* ═══ Section 1: Personal Information ═══════════ */}
                <Stack spacing={'16px'}>
                  <SectionHeader
                    icon={
                      <PersonOutlineIcon
                        sx={{ fontSize: 16, color: '#2F6FED' }}
                      />
                    }
                    title="Personal Information"
                  />

                  {/* Avatar Upload */}
                  <RowStack spacing={'16px'}>
                    <Avatar
                      src={avatarPreview || undefined}
                      sx={{
                        width: 72,
                        height: 72,
                        fontSize: pxToRem(24),
                        fontWeight: 700,
                        background: '#EBF2FF',
                        color: '#2F6FED',
                      }}
                    >
                      {!avatarPreview && (
                        <CameraAltOutlinedIcon
                          sx={{ fontSize: 24, color: '#2F6FED' }}
                        />
                      )}
                    </Avatar>
                    <Stack spacing={'6px'}>
                      <Box
                        onClick={() => avatarInputRef.current?.click()}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '34px',
                          borderRadius: '8px',
                          padding: '0 16px',
                          border: '0.67px solid #E5E7EB',
                          background: '#FFFFFF',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            borderColor: '#2F6FED',
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 600,
                            fontSize: pxToRem(12.5),
                            color: '#374151',
                            '&:hover': { color: '#2F6FED' },
                          }}
                        >
                          {avatarPreview ? 'Replace Photo' : 'Upload Photo'}
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 400,
                          fontSize: pxToRem(11.5),
                          color: '#9CA3AF',
                        }}
                      >
                        Upload a clear headshot. JPG, PNG or WebP, max 5MB
                      </Typography>
                    </Stack>
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      style={{ display: 'none' }}
                      onChange={handleAvatarChange}
                    />
                  </RowStack>

                  {/* Name Row */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                    }}
                  >
                    <Stack spacing={'6px'}>
                      <FieldLabel text="First Name" required />
                      <FormikAppTextField
                        name="firstName"
                        placeholder="e.g. Marcus"
                      />
                    </Stack>
                    <Stack spacing={'6px'}>
                      <FieldLabel text="Last Name" required />
                      <FormikAppTextField
                        name="lastName"
                        placeholder="e.g. Johnson"
                      />
                    </Stack>
                  </Box>

                  {/* Phone + Email Row */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                    }}
                  >
                    <Stack spacing={'6px'}>
                      <FieldLabel text="Phone Number" required />
                      <FormikAppTextField
                        name="phone"
                        placeholder="+1 (555) 000-0000"
                      />
                    </Stack>
                    <Stack spacing={'6px'}>
                      <FieldLabel text="Email Address" required />
                      <FormikAppTextField
                        name="email"
                        placeholder="driver@example.com"
                      />
                    </Stack>
                  </Box>

                  {/* Date of Birth */}
                  <FormikDateField name="dateOfBirth" label="Date of Birth" />
                </Stack>

                {/* ═══ Section 2: Fleet Company ══════════════════ */}
                <Stack spacing={'16px'}>
                  <SectionHeader
                    icon={
                      <BusinessOutlinedIcon
                        sx={{ fontSize: 16, color: '#2F6FED' }}
                      />
                    }
                    title="Fleet Company"
                  />
                  <FormikDropdownField
                    name="fleet"
                    label="Select Fleet"
                    options={fleetOptions}
                    placeholder="Independent (MediGo Direct)"
                    required
                  />
                  {values.fleet && (
                    <RowStack
                      spacing={'8px'}
                      sx={{
                        padding: '10px 14px',
                        background: '#EEF3FF',
                        borderRadius: '10px',
                        border: '0.67px solid #C7D7F9',
                      }}
                    >
                      <InfoOutlinedIcon
                        sx={{ fontSize: 15, color: '#2F6FED' }}
                      />
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 400,
                          fontSize: pxToRem(12),
                          color: '#374151',
                        }}
                      >
                        This driver will be directly managed by{' '}
                        <Typography
                          component="span"
                          sx={{
                            fontWeight: 700,
                            fontSize: pxToRem(12),
                            color: '#111827',
                          }}
                        >
                          {values.fleet === 'Independent (MediGo Direct)'
                            ? 'MediGo (Independent)'
                            : values.fleet}
                        </Typography>
                      </Typography>
                    </RowStack>
                  )}
                </Stack>

                {/* ═══ Section 3: Driver Credentials ═════════════ */}
                <SectionCard>
                  <SectionHeader
                    icon={
                      <BadgeOutlinedIcon
                        sx={{ fontSize: 16, color: '#2F6FED' }}
                      />
                    }
                    title="Driver Credentials"
                  />

                  {/* License Number + Expiry */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                    }}
                  >
                    <Stack spacing={'6px'}>
                      <FieldLabel text="Driver License Number" required />
                      <FormikAppTextField
                        name="licenseNumber"
                        placeholder="e.g. DL-NY-448821"
                      />
                    </Stack>
                    <FormikDateField
                      name="licenseExpiry"
                      label="License Expiry Date"
                      required
                    />
                  </Box>

                  {/* Medical Cert + BG Check */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                    }}
                  >
                    <Stack spacing={'6px'}>
                      <FieldLabel text="Medical Transport Certification" />
                      <FormikAppTextField
                        name="medicalCertification"
                        placeholder="Certification ID or reference"
                      />
                    </Stack>
                    <FormikDropdownField
                      name="bgCheckStatus"
                      label="Background Check Status"
                      options={bgCheckOptions}
                      placeholder="Select status"
                    />
                  </Box>

                  {/* License Upload + Cert Upload */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                    }}
                  >
                    <FileUploadField
                      label="Driver License Upload"
                      file={licenseFile}
                      onFileSelect={setLicenseFile}
                      onFileClear={() => setLicenseFile(null)}
                    />
                    <FileUploadField
                      label="Certification Upload"
                      file={certFile}
                      onFileSelect={setCertFile}
                      onFileClear={() => setCertFile(null)}
                    />
                  </Box>
                </SectionCard>

                {/* ═══ Section 4: Vehicle Assignment ═════════════ */}
                <SectionCard>
                  <SectionHeader
                    icon={
                      <DirectionsCarOutlinedIcon
                        sx={{ fontSize: 16, color: '#2F6FED' }}
                      />
                    }
                    title="Vehicle Assignment"
                  />
                  <FormikDropdownField
                    name="vehicle"
                    label="Assign Vehicle"
                    options={vehicleOptions}
                    placeholder="Select a vehicle"
                    startIcon={
                      <DirectionsCarOutlinedIcon
                        sx={{ fontSize: 16, color: '#9CA3AF' }}
                      />
                    }
                  />
                  {values.fleet && (
                    <RowStack
                      spacing={'8px'}
                      sx={{
                        padding: '10px 14px',
                        background: '#EEF3FF',
                        borderRadius: '10px',
                        border: '0.67px solid #C7D7F9',
                      }}
                    >
                      <InfoOutlinedIcon
                        sx={{ fontSize: 15, color: '#2F6FED' }}
                      />
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 400,
                          fontSize: pxToRem(12),
                          color: '#374151',
                        }}
                      >
                        Showing 3 vehicles for{' '}
                        <Typography
                          component="span"
                          sx={{
                            fontWeight: 700,
                            fontSize: pxToRem(12),
                            color: '#111827',
                          }}
                        >
                          {values.fleet}
                        </Typography>
                        . Selecting a different fleet above will update this
                        list.
                      </Typography>
                    </RowStack>
                  )}
                </SectionCard>

                {/* ═══ Section 5: Service Capabilities ═══════════ */}
                <SectionCard>
                  <SectionHeader
                    icon={
                      <MedicalServicesOutlinedIcon
                        sx={{ fontSize: 16, color: '#2F6FED' }}
                      />
                    }
                    title="Service Capabilities"
                  />
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 400,
                      fontSize: pxToRem(12.5),
                      color: '#6B7280',
                    }}
                  >
                    Select the service types this driver is certified to
                    provide.
                  </Typography>
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
                      />
                    ))}
                  </Box>
                </SectionCard>

                {/* ═══ Section 6: Account Settings ═══════════════ */}
                <SectionCard>
                  <SectionHeader
                    icon={
                      <SettingsOutlinedIcon
                        sx={{ fontSize: 16, color: '#2F6FED' }}
                      />
                    }
                    title="Account Settings"
                  />
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 700,
                      fontSize: pxToRem(11),
                      letterSpacing: '0.6px',
                      color: '#6B7280',
                      textTransform: 'uppercase',
                    }}
                  >
                    Create Driver App Login
                  </Typography>
                  <Stack spacing={'6px'}>
                    <FieldLabel text="App Password" />
                    <FormikAppPasswordField
                      name="appPassword"
                      placeholder="Set initial password"
                    />
                  </Stack>
                </SectionCard>
              </Stack>
            </Box>

            {/* ─── Footer ────────────────────────────────────────── */}
            <RowStack
              justifyContent={'flex-end'}
              spacing={'12px'}
              sx={{
                padding: '16px 24px',
                borderTop: '0.67px solid #F0F4F8',
              }}
            >
              <Box
                onClick={isSubmitting ? undefined : handleClose}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '40px',
                  padding: '0 24px',
                  borderRadius: '10px',
                  border: '0.67px solid #E8ECF0',
                  background: '#FFFFFF',
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
                    <AddOutlinedIcon sx={{ fontSize: 16 }} />
                  ) : undefined
                }
                isLoading={isSubmitting}
                disabled={!isValid || !dirty}
                sx={{
                  height: '40px',
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: pxToRem(13),
                  padding: '0 24px',
                }}
              >
                Add Driver
              </AppButton>
            </RowStack>
          </Form>
          );
        }}
      </Formik>
    </Drawer>
  );
};
