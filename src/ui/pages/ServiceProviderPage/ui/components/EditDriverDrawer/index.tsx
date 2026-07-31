'use client';

import { useState, useMemo } from 'react';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';
import dayjs, { Dayjs } from 'dayjs';
import {
  Avatar,
  Box,
  Checkbox,
  CircularProgress,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
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
  useGetDriverDetail,
  useGetFleetVehicles,
  useResolvedApiQuery,
  bgCheckOptions,
  bgCheckLabelToValue,
  bgCheckValueToLabel,
  DRIVER_ACCOUNT_STATUSES,
} from '../../../../../../common';
import type {
  AdminDriverDetailResponse,
  FleetCompanyDetailResponse,
  UpdateDriverPayload,
  VehicleResponse,
} from '../../../../../../common';
import {
  AppButton,
  AppDatePickerPopover,
  FormikAppTextField,
  RowStack,
} from '../../../../../modules/components';
import { AppDropdownMenu } from '../../../../../modules/components/AppDropdownMenu';

// ─── Types ──────────────────────────────────────────────────────────────────

export type EditDriverDrawerProps = {
  open: boolean;
  onClose: () => void;
  driverId: string | null;
  onSuccess?: () => void;
};

// ─── Static Dropdown Options ────────────────────────────────────────────────

// bgCheckOptions / bgCheckLabelToValue / bgCheckValueToLabel and the account
// status list all come from common/data/driver-status, shared with AddDriverDrawer.
const accountStatusOptions = [...DRIVER_ACCOUNT_STATUSES];

// ─── Default Driver Detail ──────────────────────────────────────────────────

const DEFAULT_DRIVER_DETAIL: AdminDriverDetailResponse = {
  user_id: '',
  first_name: '',
  last_name: '',
  email: null,
  phone: null,
  avatar_url: null,
  fleet_id: null,
  fleet_name: null,
  account_status: 'active',
  is_online: false,
  is_approved: false,
  rating: 0,
  total_trips: 0,
  specialty: null,
  service_capabilities: [],
  vehicle_type: null,
  vehicle_make: null,
  vehicle_model: null,
  vehicle_year: null,
  vehicle_plate: null,
  vehicle_color: null,
  vehicle_vin: null,
  vehicle_photo_url: null,
  license_number: null,
  license_expiry: null,
  medical_transport_certification: null,
  date_of_birth: null,
  address: null,
  city: null,
  province: null,
  postal_code: null,
  emergency_contact_name: null,
  emergency_contact_phone: null,
  background_check_status: null,
  suspension_reason: null,
  suspended_at: null,
  deactivated_at: null,
  approved_at: null,
  notes: null,
  invited_via_email: null,
  trip_stats: { total_trips: 0, hours_online: 0, average_earnings: 0 },
  documents: [],
  ratings: [],
  suspension_history: [],
  invite_token: null,
  created_at: null,
  updated_at: null,
};

// ─── Helpers ────────────────────────────────────────────────────────────────

const toDisplayDate = (value?: string | null): string => {
  if (!value) return '';
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format('MM/DD/YYYY') : '';
};

const toIsoDate = (value?: string | null): string | null => {
  if (!value) return null;
  const parsed = dayjs(value, 'MM/DD/YYYY');
  return parsed.isValid() ? parsed.format('YYYY-MM-DD') : null;
};

const buildVehicleLabel = (vehicle: VehicleResponse) =>
  `${vehicle.make} ${vehicle.model} · ${vehicle.year} (${vehicle.plate_number})`;

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
  gender: Yup.string(),
  emergencyContactName: Yup.string(),
  emergencyContactPhone: Yup.string(),
  address: Yup.string(),
  city: Yup.string(),
  province: Yup.string(),
  postalCode: Yup.string(),
  specialty: Yup.string(),
  accountStatus: Yup.string(),
  notes: Yup.string(),
});

const emptyInitialValues = {
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
  gender: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  address: '',
  city: '',
  province: '',
  postalCode: '',
  specialty: '',
  accountStatus: '',
  notes: '',
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

export const EditDriverDrawer = ({
  open,
  onClose,
  driverId,
  onSuccess,
}: EditDriverDrawerProps) => {
  const { updateDriver, resendDriverReactivation } = useDriversApi();
  const [isResendingReactivation, setIsResendingReactivation] = useState(false);
  const resolvedDriverId = driverId ?? '';

  const handleResendReactivation = async () => {
    if (!resolvedDriverId) return;
    setIsResendingReactivation(true);
    try {
      await resendDriverReactivation({ driverId: resolvedDriverId });
    } finally {
      setIsResendingReactivation(false);
    }
  };

  const {
    data: detail,
    isLoading: isLoadingDetail,
    isFetching: isFetchingDetail,
  } = useResolvedApiQuery(
    useGetDriverDetail,
    DEFAULT_DRIVER_DETAIL,
    resolvedDriverId
  );

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

  const hasDetail = Boolean(detail && detail.user_id);

  // Compute initial values from the resolved driver detail
  const editInitialValues = useMemo(() => {
    if (!hasDetail) return emptyInitialValues;

    const caps = (detail.service_capabilities || []).map((c) =>
      c.toLowerCase()
    );

    // Build the vehicle label matching the dropdown format
    const vehicleLabel =
      detail.vehicle_make && detail.vehicle_model
        ? `${detail.vehicle_make} ${detail.vehicle_model} · ${detail.vehicle_year ?? ''} (${detail.vehicle_plate ?? ''})`
        : '';

    return {
      firstName: detail.first_name || '',
      lastName: detail.last_name || '',
      phone: detail.phone || '',
      email: detail.email || '',
      dateOfBirth: toDisplayDate(detail.date_of_birth),
      fleet: detail.fleet_name || '',
      licenseNumber: detail.license_number || '',
      licenseExpiry: toDisplayDate(detail.license_expiry),
      medicalCertification: detail.medical_transport_certification || '',
      bgCheckStatus: bgCheckValueToLabel(detail.background_check_status),
      vehicle: vehicleLabel,
      wheelchairAssistance: caps.includes('wheelchair_assistance'),
      medicalEscort: caps.includes('medical_escort'),
      seniorAssistance: caps.includes('senior_assistance'),
      stretcherTransport: caps.includes('stretcher_transport'),
      gender: detail.gender || '',
      emergencyContactName: detail.emergency_contact_name || '',
      emergencyContactPhone: detail.emergency_contact_phone || '',
      address: detail.address || '',
      city: detail.city || '',
      province: detail.province || '',
      postalCode: detail.postal_code || '',
      specialty: detail.specialty || '',
      accountStatus: detail.account_status || '',
      notes: detail.notes || '',
    };
  }, [hasDetail, detail]);

  const isInitialLoading = isLoadingDetail && !hasDetail;

  const handleClose = () => {
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
        initialValues={editInitialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={async (values, { setSubmitting }) => {
          try {
            if (!resolvedDriverId) {
              setSubmitting(false);
              return;
            }

            const fleetId = fleetOptionMap.get(values.fleet) || null;

            const fleetVehicles = fleetId
              ? allVehicles.filter((v) => v.business_id === fleetId)
              : [];
            const selectedVehicle = fleetVehicles.find(
              (v) => buildVehicleLabel(v) === values.vehicle
            );

            const capabilities = [
              values.wheelchairAssistance && 'wheelchair_assistance',
              values.seniorAssistance && 'senior_assistance',
              values.medicalEscort && 'medical_escort',
              values.stretcherTransport && 'stretcher_transport',
            ].filter(Boolean) as string[];

            const payload: UpdateDriverPayload = {
              driverId: resolvedDriverId,
              first_name: values.firstName.trim() || null,
              last_name: values.lastName.trim() || null,
              phone: values.phone.trim() || null,
              email: values.email.trim() || null,
              // undefined (omitted), not null: business_id is NOT NULL, so an
              // explicit null is rejected rather than silently clearing it.
              fleet_id: fleetId || undefined,
              license_number: values.licenseNumber.trim() || null,
              license_expiry: toIsoDate(values.licenseExpiry),
              medical_transport_certification:
                values.medicalCertification.trim() || null,
              background_check_status: bgCheckLabelToValue(
                values.bgCheckStatus
              ),
              vehicle_id: selectedVehicle?.id ?? null,
              service_capabilities: capabilities.length ? capabilities : null,
              date_of_birth: toIsoDate(values.dateOfBirth),
              gender: values.gender.trim() || null,
              emergency_contact_name:
                values.emergencyContactName.trim() || null,
              emergency_contact_phone:
                values.emergencyContactPhone.trim() || null,
              address: values.address.trim() || null,
              city: values.city.trim() || null,
              province: values.province.trim() || null,
              postal_code: values.postalCode.trim() || null,
              specialty: values.specialty.trim() || null,
              // Also NOT NULL — omit rather than clear.
              account_status: values.accountStatus || undefined,
              notes: values.notes.trim() || null,
            };

            const success = await updateDriver(payload);

            if (success) {
              handleClose();
              onSuccess?.();
            }
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, dirty, values }) => {
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
                      Edit Driver
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 400,
                        fontSize: pxToRem(13),
                        color: '#6B7280',
                      }}
                    >
                      Update driver profile, credentials, and fleet assignments.
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
                  position: 'relative',
                }}
              >
                {isInitialLoading ? (
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    sx={{ py: '80px' }}
                  >
                    <CircularProgress size={28} sx={{ color: '#2F6FED' }} />
                  </Stack>
                ) : (
                  <Stack spacing={'20px'}>
                    {/* Section 1: Personal Information */}
                    <Stack spacing={'16px'}>
                      <SectionHeader
                        icon={
                          <PersonOutlineIcon
                            sx={{ fontSize: 16, color: '#2F6FED' }}
                          />
                        }
                        title="Personal Information"
                      />

                      {/* Avatar is read-only here: only the driver can change
                          it (PUT /users/me/avatar); there is no admin upload
                          endpoint, so an upload control here would discard the
                          file silently. */}
                      <RowStack spacing={'16px'}>
                        <Avatar
                          src={detail.avatar_url || undefined}
                          sx={{
                            width: 72,
                            height: 72,
                            fontSize: pxToRem(24),
                            fontWeight: 700,
                            background: '#EBF2FF',
                            color: '#2F6FED',
                          }}
                        >
                          {!detail.avatar_url && (
                            <CameraAltOutlinedIcon
                              sx={{ fontSize: 24, color: '#2F6FED' }}
                            />
                          )}
                        </Avatar>
                        <Typography
                          sx={{
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 400,
                            fontSize: pxToRem(11.5),
                            color: '#9CA3AF',
                          }}
                        >
                          Profile photo is set by the driver in their app.
                        </Typography>
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
                            disabled={true}
                          />
                        </Stack>
                      </Box>

                      {/* Pending reactivation: driver changed email but hasn't
                          reactivated yet — allow resending the reactivation email */}
                      {detail?.pending_reactivation && (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '12px',
                            p: '10px 12px',
                            borderRadius: '8px',
                            border: '1px solid #FCD9B6',
                            bgcolor: '#FFF7ED',
                          }}
                        >
                          <Typography
                            sx={{ fontSize: 12.5, color: '#9A5B12', flex: 1 }}
                          >
                            Email changed — the driver hasn&apos;t reactivated
                            their account yet.
                          </Typography>
                          <AppButton
                            variant="outlined"
                            onClick={handleResendReactivation}
                            disabled={isResendingReactivation}
                            sx={{
                              textTransform: 'none',
                              whiteSpace: 'nowrap',
                              minWidth: 'auto',
                            }}
                          >
                            {isResendingReactivation
                              ? 'Sending…'
                              : 'Resend reactivation'}
                          </AppButton>
                        </Box>
                      )}

                      {/* Date of Birth */}
                      <FormikDateField
                        name="dateOfBirth"
                        label="Date of Birth"
                      />

                      {/* Gender + Emergency contact */}
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '16px',
                        }}
                      >
                        <Stack spacing={'6px'}>
                          <FieldLabel text="Gender" />
                          <FormikAppTextField
                            name="gender"
                            placeholder="e.g. female"
                          />
                        </Stack>
                        <Stack spacing={'6px'}>
                          <FieldLabel text="Emergency Contact Name" />
                          <FormikAppTextField
                            name="emergencyContactName"
                            placeholder="Full name"
                          />
                        </Stack>
                      </Box>
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '16px',
                        }}
                      >
                        <Stack spacing={'6px'}>
                          <FieldLabel text="Emergency Contact Phone" />
                          <FormikAppTextField
                            name="emergencyContactPhone"
                            placeholder="+1 (555) 000-0000"
                          />
                        </Stack>
                        <Stack spacing={'6px'}>
                          <FieldLabel text="Street Address" />
                          <FormikAppTextField
                            name="address"
                            placeholder="1 Queen St W"
                          />
                        </Stack>
                      </Box>
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr 1fr',
                          gap: '16px',
                        }}
                      >
                        <Stack spacing={'6px'}>
                          <FieldLabel text="City" />
                          <FormikAppTextField
                            name="city"
                            placeholder="Toronto"
                          />
                        </Stack>
                        <Stack spacing={'6px'}>
                          <FieldLabel text="Province" />
                          <FormikAppTextField
                            name="province"
                            placeholder="ON"
                          />
                        </Stack>
                        <Stack spacing={'6px'}>
                          <FieldLabel text="Postal Code" />
                          <FormikAppTextField
                            name="postalCode"
                            placeholder="M5H 2N2"
                          />
                        </Stack>
                      </Box>
                    </Stack>

                    {/* Section 2: Fleet Company */}
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
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
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

                    {/* Section 3: Driver Credentials */}
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
                    </SectionCard>

                    {/* Section 4: Vehicle Assignment */}
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
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
                              fontWeight: 400,
                              fontSize: pxToRem(12),
                              color: '#374151',
                            }}
                          >
                            Showing {vehicleOptions.length}{' '}
                            {vehicleOptions.length === 1
                              ? 'vehicle'
                              : 'vehicles'}{' '}
                            for{' '}
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

                    {/* Section 5: Service Capabilities */}
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

                    {/* Section 6: Account Settings */}
                    <SectionCard>
                      <SectionHeader
                        icon={
                          <SettingsOutlinedIcon
                            sx={{ fontSize: 16, color: '#2F6FED' }}
                          />
                        }
                        title="Account Settings"
                      />
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '16px',
                        }}
                      >
                        <FormikDropdownField
                          name="accountStatus"
                          label="Account Status"
                          options={accountStatusOptions}
                          placeholder="Select status"
                        />
                        <Stack spacing={'6px'}>
                          <FieldLabel text="Specialty" />
                          <FormikAppTextField
                            name="specialty"
                            placeholder="e.g. paramedic"
                          />
                        </Stack>
                      </Box>
                      <Stack spacing={'6px'}>
                        <FieldLabel text="Internal Notes" />
                        <FormikAppTextField
                          name="notes"
                          placeholder="Visible to admins only"
                          multiline
                          minRows={3}
                        />
                      </Stack>
                    </SectionCard>
                  </Stack>
                )}
                {isFetchingDetail && hasDetail && !isInitialLoading && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <CircularProgress size={14} sx={{ color: '#9CA3AF' }} />
                  </Box>
                )}
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
                      <CheckOutlinedIcon sx={{ fontSize: 16 }} />
                    ) : undefined
                  }
                  isLoading={isSubmitting}
                  disabled={!dirty}
                  sx={{
                    height: '40px',
                    borderRadius: '10px',
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
          );
        }}
      </Formik>
    </Drawer>
  );
};
