'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Checkbox,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import AccessibleOutlinedIcon from '@mui/icons-material/AccessibleOutlined';
import EscalatorWarningOutlinedIcon from '@mui/icons-material/EscalatorWarningOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import CheckIcon from '@mui/icons-material/Check';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';
import dayjs, { Dayjs } from 'dayjs';
import {
  RowStack,
  AppButton,
  AppModal,
  AppDatePickerPopover,
  FormikAppTextField,
  AppSelect,
  UserDropdownMenuInput,
  UserInputData,
} from '../../../../../modules/components';
import {
  pxToRem,
  useFleetVehiclesApi,
  useResolvedApiQuery,
  useGetFleetVehicleById,
} from '../../../../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type VehicleCategory =
  | 'Standard Ride'
  | 'Wheelchair Accessible'
  | 'Assisted Ride'
  | 'Stretcher Transport';

type EditVehicleDrawerProps = {
  open: boolean;
  onClose: () => void;
  vehicleId: string | null;
  onSave: () => void;
};

// ─── Constants ──────────────────────────────────────────────────────────────

const categoryCards: {
  value: VehicleCategory;
  label: string;
  desc: string;
  icon: React.ReactNode;
}[] = [
  {
    value: 'Standard Ride',
    label: 'Standard Ride',
    desc: 'Regular sedan or minivan',
    icon: <DirectionsCarOutlinedIcon sx={{ fontSize: 18 }} />,
  },
  {
    value: 'Wheelchair Accessible',
    label: 'Wheelchair Accessible',
    desc: 'WAV with ramp/lift equipment',
    icon: <AccessibleOutlinedIcon sx={{ fontSize: 18 }} />,
  },
  {
    value: 'Assisted Ride',
    label: 'Assisted Ride',
    desc: 'Aide-assisted medical transport',
    icon: <EscalatorWarningOutlinedIcon sx={{ fontSize: 18 }} />,
  },
  {
    value: 'Stretcher Transport',
    label: 'Stretcher Transport',
    desc: 'Non-emergency stretcher transport',
    icon: <LocalHospitalOutlinedIcon sx={{ fontSize: 18 }} />,
  },
];

const fleetOptions = [
  'Independent (MediGo Direct)',
  'MedRide Express',
  'CareTransit Co.',
  'HealthHaul LLC',
  'SafeRide Medical',
  'MobCare Transport',
  'Apex Medical Rides',
];

// ─── Validation Schema ──────────────────────────────────────────────────────

const validationSchema = Yup.object().shape({
  make: Yup.string().required('Make is required'),
  model: Yup.string().required('Model is required'),
  year: Yup.string(),
  plate: Yup.string().required('License plate is required'),
  vin: Yup.string(),
  color: Yup.string(),
  capacity: Yup.string(),
  fleet: Yup.string(),
  insuranceProvider: Yup.string(),
  regAuthority: Yup.string(),
  mileage: Yup.string(),
  notes: Yup.string(),
});

const initialValues = {
  make: '',
  model: '',
  year: '',
  plate: '',
  vin: '',
  color: '',
  capacity: '',
  fleet: '',
  insuranceProvider: '',
  regAuthority: '',
  mileage: '',
  notes: '',
};

// ─── Component ──────────────────────────────────────────────────────────────

export const EditVehicleDrawer = ({
  open,
  onClose,
  vehicleId,
  onSave,
}: EditVehicleDrawerProps) => {
  // Hooks
  const { updateVehicle } = useFleetVehiclesApi();
  const { data: vehicleData } = useResolvedApiQuery(
    useGetFleetVehicleById,
    null,
    vehicleId || ''
  );

  // State
  const [category, setCategory] = useState<VehicleCategory | ''>('');
  const [wavRamp, setWavRamp] = useState(false);
  const [stretcherMount, setStretcherMount] = useState(false);
  const [lastInspection, setLastInspection] = useState<Dayjs | null>(null);
  const [insuranceExpiry, setInsuranceExpiry] = useState<Dayjs | null>(null);
  const [registrationExpiry, setRegistrationExpiry] = useState<Dayjs | null>(
    null
  );
  const [selectedDriver, setSelectedDriver] = useState<UserInputData | null>(
    null
  );
  const [formValues, setFormValues] = useState(initialValues);

  // Prefill form when vehicle data loads
  useEffect(() => {
    if (vehicleData && open) {
      setFormValues({
        make: vehicleData.make || '',
        model: vehicleData.model || '',
        year: vehicleData.year?.toString() || '',
        plate: vehicleData.plate_number || '',
        vin: vehicleData.vin || '',
        color: vehicleData.color || '',
        capacity: vehicleData.passenger_capacity?.toString() || '',
        fleet: vehicleData.fleet_name || '',
        insuranceProvider: vehicleData.insurance_provider || '',
        regAuthority: vehicleData.registration_authority || '',
        mileage: vehicleData.mileage?.toString() || '',
        notes: vehicleData.internal_notes || '',
      });

      setCategory((vehicleData.category as VehicleCategory) || '');

      // Set special equipment
      const equipment = vehicleData.special_equipment || [];
      setWavRamp(equipment.includes('WAV Ramp/Lift'));
      setStretcherMount(equipment.includes('Stretcher Mount'));

      // Set dates
      setLastInspection(
        vehicleData.last_inspection_date
          ? dayjs(vehicleData.last_inspection_date)
          : null
      );
      setInsuranceExpiry(
        vehicleData.insurance_expiry
          ? dayjs(vehicleData.insurance_expiry)
          : null
      );
      setRegistrationExpiry(
        vehicleData.registration_expiry
          ? dayjs(vehicleData.registration_expiry)
          : null
      );

      // Set driver if available
      if (vehicleData.driver_name && vehicleData.driver_profile_id) {
        const names = vehicleData.driver_name.split(' ');
        setSelectedDriver({
          id: vehicleData.driver_profile_id,
          firstName: names[0] || '',
          lastName: names.slice(1).join(' ') || '',
          role: 'driver',
        });
      } else {
        setSelectedDriver(null);
      }
    }
  }, [vehicleData, open]);

  const statusOptions: ('Active' | 'Maintenance' | 'Inactive')[] = [
    'Active',
    'Maintenance',
    'Inactive',
  ];

  const statusColors: Record<
    string,
    { color: string; bg: string; border: string }
  > = {
    Active: { color: '#059669', bg: '#ECFDF5', border: '#059669' },
    Maintenance: { color: '#D97706', bg: '#FFFBEB', border: '#D97706' },
    Inactive: { color: '#6B7280', bg: '#F3F4F6', border: '#6B7280' },
  };

  const handleSubmit = async (values: typeof initialValues) => {
    if (!vehicleId) {
      console.log('Vehicle ID is missing');
      return;
    }

    // Build special equipment array
    const specialEquipment: string[] = [];
    if (wavRamp) specialEquipment.push('WAV Ramp/Lift');
    if (stretcherMount) specialEquipment.push('Stretcher Mount');

    // Build payload
    const payload = {
      vehicleId,
      vehicle_name: `${values.year} ${values.make} ${values.model}`.trim(),
      make: values.make,
      model: values.model,
      year: values.year ? parseInt(values.year, 10) : null,
      plate_number: values.plate,
      color: values.color || null,
      vin: values.vin || null,
      category: category || null,
      mileage: values.mileage ? parseInt(values.mileage, 10) : null,
      insurance_expiry: insuranceExpiry
        ? insuranceExpiry.format('YYYY-MM-DD')
        : null,
      registration_expiry: registrationExpiry
        ? registrationExpiry.format('YYYY-MM-DD')
        : null,
      passenger_capacity: values.capacity
        ? parseInt(values.capacity, 10)
        : null,
      special_equipment: specialEquipment.length > 0 ? specialEquipment : null,
      insurance_provider: values.insuranceProvider || null,
      registration_authority: values.regAuthority || null,
      last_inspection_date: lastInspection
        ? lastInspection.format('YYYY-MM-DD')
        : null,
      internal_notes: values.notes || null,
    };

    const success = await updateVehicle(payload);

    if (success) {
      onSave();
    }
  };

  return (
    <AppModal
      open={open}
      setOpen={() => onClose()}
      label="edit-vehicle-modal"
      padding="0px"
    >
      <Formik
        initialValues={formValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, isValid, dirty, values }) => (
          <Form>
            {/* Header */}
            <RowStack
              justifyContent={'space-between'}
              sx={{
                padding: '20px 24px',
                borderBottom: '0.67px solid #F0F4F8',
                flexShrink: 0,
              }}
            >
              <Stack spacing={'2px'}>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 700,
                    fontSize: pxToRem(18),
                    color: '#111827',
                    lineHeight: '1.5em',
                  }}
                >
                  Edit Vehicle
                </Typography>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(13),
                    color: '#9CA3AF',
                    lineHeight: '1.5em',
                  }}
                >
                  Update vehicle information and settings.
                </Typography>
              </Stack>
              <IconButton
                onClick={onClose}
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: '8px',
                  background: '#F3F4F6',
                  border: '0.67px solid #E5E7EB',
                }}
              >
                <CloseIcon sx={{ fontSize: 14, color: '#6B7280' }} />
              </IconButton>
            </RowStack>

            {/* Scrollable Content */}
            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                padding: '24px 32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              {/* Section 1: Vehicle Identity */}
              <SectionCard
                icon={
                  <DirectionsCarOutlinedIcon
                    sx={{ fontSize: 16, color: '#2F6FED' }}
                  />
                }
                iconBg="#EBF2FF"
                title="Vehicle Identity"
              >
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '12px',
                  }}
                >
                  <FormField label="Make*">
                    <FormikAppTextField
                      name="make"
                      placeholder="e.g. Toyota"
                      borderRadius="10px"
                    />
                  </FormField>
                  <FormField label="Model*">
                    <FormikAppTextField
                      name="model"
                      placeholder="e.g. Sienna"
                      borderRadius="10px"
                    />
                  </FormField>
                  <FormField label="Year">
                    <FormikAppTextField
                      name="year"
                      placeholder="2024"
                      borderRadius="10px"
                    />
                  </FormField>
                </Box>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '12px',
                  }}
                >
                  <FormField label="License Plate*">
                    <FormikAppTextField
                      name="plate"
                      placeholder="e.g. ABC-1234"
                      borderRadius="10px"
                    />
                  </FormField>
                  <FormField label="VIN">
                    <FormikAppTextField
                      name="vin"
                      placeholder="17-char VIN"
                      borderRadius="10px"
                    />
                  </FormField>
                  <FormField label="Color">
                    <FormikAppTextField
                      name="color"
                      placeholder="e.g. Pearl White"
                      borderRadius="10px"
                    />
                  </FormField>
                </Box>
              </SectionCard>

              {/* Section 2: Vehicle Category */}
              <SectionCard
                icon={
                  <CategoryOutlinedIcon
                    sx={{ fontSize: 16, color: '#7C3AED' }}
                  />
                }
                iconBg="#F3EEFF"
                title="Vehicle Category"
              >
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(12.5),
                    color: '#9CA3AF',
                    lineHeight: '1.5em',
                    marginTop: '-8px',
                  }}
                >
                  Select the service type this vehicle is equipped for.
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                  }}
                >
                  {categoryCards.map((card) => {
                    const isSelected = category === card.value;
                    return (
                      <Box
                        key={card.value}
                        onClick={() => setCategory(card.value)}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '14px 16px',
                          background: isSelected ? '#EBF2FF' : '#FFFFFF',
                          border: `0.67px solid ${isSelected ? '#2F6FED' : '#E8ECF0'}`,
                          borderRadius: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          '&:hover': {
                            background: isSelected ? '#EBF2FF' : '#F7F9FB',
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: '10px',
                            background: isSelected ? '#DBEAFE' : '#F7F9FB',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            '& .MuiSvgIcon-root': {
                              color: isSelected ? '#2F6FED' : '#6B7280',
                            },
                          }}
                        >
                          {card.icon}
                        </Box>
                        <Stack spacing={0} sx={{ flex: 1 }}>
                          <Typography
                            sx={{
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
                              fontWeight: 600,
                              fontSize: pxToRem(13),
                              color: isSelected ? '#2F6FED' : '#374151',
                            }}
                          >
                            {card.label}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
                              fontWeight: 400,
                              fontSize: pxToRem(11.5),
                              color: '#9CA3AF',
                            }}
                          >
                            {card.desc}
                          </Typography>
                        </Stack>
                        <Box
                          sx={{
                            width: 18,
                            height: 18,
                            borderRadius: '4px',
                            background: isSelected ? '#2F6FED' : '#FFFFFF',
                            border: `1.5px solid ${isSelected ? '#2F6FED' : '#D1D5DB'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {isSelected && (
                            <CheckIcon
                              sx={{ fontSize: 12, color: '#FFFFFF' }}
                            />
                          )}
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
                <FormField label="Passenger Capacity">
                  <FormikAppTextField
                    name="capacity"
                    placeholder="5"
                    borderRadius="10px"
                  />
                </FormField>
                <Stack spacing={'8px'}>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 600,
                      fontSize: pxToRem(12),
                      color: '#374151',
                    }}
                  >
                    Special Equipment
                  </Typography>
                  <RowStack spacing={'12px'}>
                    <ChipCheckbox
                      label="WAV Ramp/Lift"
                      checked={wavRamp}
                      onChange={setWavRamp}
                    />
                    <ChipCheckbox
                      label="Stretcher Mount"
                      checked={stretcherMount}
                      onChange={setStretcherMount}
                    />
                  </RowStack>
                </Stack>
              </SectionCard>

              {/* Section 3: Fleet & Driver Assignment */}
              <SectionCard
                icon={
                  <GroupsOutlinedIcon sx={{ fontSize: 16, color: '#D97706' }} />
                }
                iconBg="#FFFBEB"
                title="Fleet & Driver Assignment"
              >
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                  }}
                >
                  <AppSelect
                    name="fleet"
                    label="Fleet Company"
                    options={fleetOptions}
                    placeholder="Select fleet"
                  />
                  <FormField label="Assigned Driver">
                    <UserDropdownMenuInput
                      type="driver"
                      handleUserSelected={(user) => setSelectedDriver(user)}
                      selectedUserId={selectedDriver?.id}
                      selectedUserName={
                        selectedDriver
                          ? `${selectedDriver.firstName} ${selectedDriver.lastName}`
                          : undefined
                      }
                    />
                  </FormField>
                </Box>
                <RowStack
                  spacing={'8px'}
                  sx={{
                    background: '#F0F9FF',
                    border: '0.67px solid #BAE6FD',
                    borderRadius: '14px',
                    padding: '10px 12px',
                  }}
                >
                  <InfoOutlinedIcon
                    sx={{ fontSize: 14, color: '#0284C7', flexShrink: 0 }}
                  />
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 400,
                      fontSize: pxToRem(12.5),
                      lineHeight: '1.5em',
                      color: '#0C4A6E',
                    }}
                  >
                    This vehicle is registered under {values.fleet || 'MediGo'}{' '}
                    with{' '}
                    {selectedDriver
                      ? `${selectedDriver.firstName} ${selectedDriver.lastName} assigned`
                      : 'no driver assigned yet'}
                    .
                  </Typography>
                </RowStack>
              </SectionCard>

              {/* Section 4: Documents & Insurance */}
              <SectionCard
                icon={
                  <DescriptionOutlinedIcon
                    sx={{ fontSize: 16, color: '#059669' }}
                  />
                }
                iconBg="#ECFDF5"
                title="Documents & Insurance"
              >
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                  }}
                >
                  <FormField label="Insurance Provider">
                    <FormikAppTextField
                      name="insuranceProvider"
                      placeholder="e.g. State Farm"
                      borderRadius="10px"
                    />
                  </FormField>
                  <FormField label="Insurance Expiry">
                    <AppDatePickerPopover
                      value={insuranceExpiry}
                      onChange={setInsuranceExpiry}
                      minDate={dayjs()}
                      format="MMM DD, YYYY"
                      buttonSx={{
                        height: 39,
                        borderRadius: '10px',
                        background: '#F7F9FB',
                        border: '0.67px solid #E8ECF0',
                        boxShadow: 'none',
                        justifyContent: 'flex-start',
                      }}
                      textSx={{
                        fontWeight: insuranceExpiry ? 500 : 400,
                        fontSize: pxToRem(13),
                        color: insuranceExpiry
                          ? '#111827'
                          : 'rgba(55, 65, 81, 0.5)',
                      }}
                    />
                  </FormField>
                </Box>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                  }}
                >
                  <FormField label="Registration Authority">
                    <FormikAppTextField
                      name="regAuthority"
                      placeholder="e.g. NY DMV"
                      borderRadius="10px"
                    />
                  </FormField>
                  <FormField label="Registration Expiry">
                    <AppDatePickerPopover
                      value={registrationExpiry}
                      onChange={setRegistrationExpiry}
                      minDate={dayjs()}
                      format="MMM DD, YYYY"
                      buttonSx={{
                        height: 39,
                        borderRadius: '10px',
                        background: '#F7F9FB',
                        border: '0.67px solid #E8ECF0',
                        boxShadow: 'none',
                        justifyContent: 'flex-start',
                      }}
                      textSx={{
                        fontWeight: registrationExpiry ? 500 : 400,
                        fontSize: pxToRem(13),
                        color: registrationExpiry
                          ? '#111827'
                          : 'rgba(55, 65, 81, 0.5)',
                      }}
                    />
                  </FormField>
                </Box>
                <FormField label="Last Inspection Date">
                  <AppDatePickerPopover
                    value={lastInspection}
                    onChange={setLastInspection}
                    maxDate={dayjs()}
                    format="MMM DD, YYYY"
                    buttonSx={{
                      height: 39,
                      borderRadius: '10px',
                      background: '#F7F9FB',
                      border: '0.67px solid #E8ECF0',
                      boxShadow: 'none',
                      justifyContent: 'flex-start',
                    }}
                    textSx={{
                      fontWeight: lastInspection ? 500 : 400,
                      fontSize: pxToRem(13),
                      color: lastInspection
                        ? '#111827'
                        : 'rgba(55, 65, 81, 0.5)',
                    }}
                  />
                </FormField>
              </SectionCard>

              {/* Section 5: Operational Info */}
              <SectionCard
                icon={
                  <TuneOutlinedIcon sx={{ fontSize: 16, color: '#EF4444' }} />
                }
                iconBg="#FEF2F2"
                title="Operational Info"
              >
                <FormField label="Current Mileage">
                  <FormikAppTextField
                    name="mileage"
                    placeholder="0 mi"
                    borderRadius="10px"
                  />
                </FormField>
                <FormField label="Internal Notes (optional)">
                  <NotesField />
                </FormField>
              </SectionCard>
            </Box>

            {/* Footer */}
            <RowStack
              justifyContent={'space-between'}
              sx={{
                padding: '16px 32px',
                borderTop: '0.67px solid #EAECF0',
                boxShadow: '0px -1px 8px rgba(0, 0, 0, 0.06)',
                flexShrink: 0,
              }}
            >
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12),
                  color: '#9CA3AF',
                }}
              >
                * Make, Model, and Plate are required
              </Typography>
              <RowStack spacing={'12px'}>
                <Box
                  onClick={onClose}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 40,
                    padding: '0 20px',
                    background: '#FFFFFF',
                    border: '0.67px solid #E5E7EB',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'opacity 0.15s ease',
                    '&:hover': { opacity: 0.85 },
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
                  isLoading={isSubmitting}
                  disabled={!isValid || !dirty}
                  startIcon={
                    !isSubmitting ? (
                      <SaveOutlinedIcon
                        sx={{ fontSize: 14, color: '#FFFFFF' }}
                      />
                    ) : undefined
                  }
                  sx={{
                    height: 40,
                    padding: '0 20px',
                    background:
                      isValid && dirty ? '#2F6FED' : 'rgba(47, 111, 237, 0.5)',
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 600,
                    fontSize: pxToRem(13),
                    color: '#FFFFFF',
                    '&:hover': {
                      background: '#2860D4',
                    },
                    '&.Mui-disabled': {
                      background: 'rgba(47, 111, 237, 0.5)',
                      color: '#FFFFFF',
                    },
                  }}
                >
                  Save Changes
                </AppButton>
              </RowStack>
            </RowStack>
          </Form>
        )}
      </Formik>
    </AppModal>
  );
};

// ─── Notes Field (Formik-integrated multiline) ──────────────────────────────

const NotesField = () => {
  const [field] = useField('notes');
  return (
    <TextField
      {...field}
      multiline
      rows={3}
      placeholder="e.g. WAV ramp serviced Mar 2026, tire rotation due..."
      fullWidth
      sx={{
        '& .MuiOutlinedInput-root': {
          background: '#F7F9FB',
          borderRadius: '10px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          fontSize: pxToRem(13),
          color: '#111827',
          alignItems: 'flex-start',
          '& fieldset': { borderColor: '#E8ECF0', borderWidth: '0.67px' },
          '&:hover fieldset': { borderColor: '#E8ECF0' },
          '&.Mui-focused fieldset': {
            borderColor: '#2F6FED',
            borderWidth: '1px',
          },
        },
        '& .MuiInputBase-input::placeholder': {
          color: 'rgba(55, 65, 81, 0.5)',
          opacity: 1,
        },
      }}
    />
  );
};

// ─── Sub-Components ─────────────────────────────────────────────────────────

const SectionCard = ({
  icon,
  iconBg,
  title,
  children,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  children: React.ReactNode;
}) => (
  <Stack
    spacing={'16px'}
    sx={{
      border: '0.67px solid #F0F4F8',
      borderRadius: '16px',
      overflow: 'hidden',
    }}
  >
    <RowStack
      spacing={'10px'}
      sx={{
        padding: '14px 20px',
        background: '#FAFBFC',
        borderBottom: '0.67px solid #F0F4F8',
      }}
    >
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: '8px',
          background: iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
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
    <Stack spacing={'16px'} sx={{ padding: '0 24px 24px' }}>
      {children}
    </Stack>
  </Stack>
);

const FormField = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <Stack spacing={'6px'}>
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 600,
        fontSize: pxToRem(12),
        lineHeight: '1.5em',
        color: '#374151',
      }}
    >
      {label}
    </Typography>
    {children}
  </Stack>
);

const ChipCheckbox = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}) => (
  <RowStack
    onClick={() => onChange(!checked)}
    spacing={'6px'}
    sx={{
      padding: '6px 12px',
      background: checked ? '#EBF2FF' : '#FFFFFF',
      border: `0.67px solid ${checked ? '#2F6FED' : '#E8ECF0'}`,
      borderRadius: '9px',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      '&:hover': { background: checked ? '#EBF2FF' : '#F7F9FB' },
    }}
  >
    <Checkbox
      checked={checked}
      size="small"
      sx={{
        padding: 0,
        width: 16,
        height: 16,
        color: '#D1D5DB',
        '&.Mui-checked': { color: '#2F6FED' },
      }}
    />
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 500,
        fontSize: pxToRem(12.5),
        color: checked ? '#2F6FED' : '#374151',
      }}
    >
      {label}
    </Typography>
  </RowStack>
);
