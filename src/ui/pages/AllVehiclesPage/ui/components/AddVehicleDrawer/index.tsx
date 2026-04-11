'use client';

import { useRef, useState } from 'react';
import {
  Box,
  Checkbox,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import AccessibleOutlinedIcon from '@mui/icons-material/AccessibleOutlined';
import EscalatorWarningOutlinedIcon from '@mui/icons-material/EscalatorWarningOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
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
  FleetDropdownMenuInput,
  FleetInputData,
  FleetDriverDropdownMenuInput,
  FleetDriverInputData,
} from '../../../../../modules/components';
import { pxToRem, useFleetVehiclesApi } from '../../../../../../common';
import { toast } from 'sonner';

// ─── Types ──────────────────────────────────────────────────────────────────

type VehicleCategory =
  | 'Standard Ride'
  | 'Wheelchair Accessible'
  | 'Assisted Ride'
  | 'Stretcher Transport';

type AddVehicleDrawerProps = {
  open: boolean;
  onClose: () => void;
  onAdd: () => void;
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

// ─── Validation Schema ──────────────────────────────────────────────────────

const validationSchema = Yup.object().shape({
  make: Yup.string().required('Make is required'),
  model: Yup.string().required('Model is required'),
  year: Yup.string(),
  plate: Yup.string().required('License plate is required'),
  vin: Yup.string(),
  color: Yup.string(),
  capacity: Yup.string(),
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
  insuranceProvider: '',
  regAuthority: '',
  mileage: '',
  notes: '',
};

// ─── Component ──────────────────────────────────────────────────────────────

export const AddVehicleDrawer = ({
  open,
  onClose,
  onAdd,
}: AddVehicleDrawerProps) => {
  // Hooks
  const { createVehicle } = useFleetVehiclesApi();

  // State
  const [category, setCategory] = useState<VehicleCategory | ''>('');
  const [wavRamp, setWavRamp] = useState(false);
  const [stretcherMount, setStretcherMount] = useState(false);
  const [status, setStatus] = useState<'Active' | 'Maintenance' | 'Inactive'>(
    'Active'
  );
  const [lastInspection, setLastInspection] = useState<Dayjs | null>(null);
  const [insuranceExpiry, setInsuranceExpiry] = useState<Dayjs | null>(null);
  const [registrationExpiry, setRegistrationExpiry] = useState<Dayjs | null>(
    null
  );
  const [insuranceFile, setInsuranceFile] = useState<File | null>(null);
  const [registrationFile, setRegistrationFile] = useState<File | null>(null);
  const [inspectionFile, setInspectionFile] = useState<File | null>(null);
  const [selectedDriver, setSelectedDriver] =
    useState<FleetDriverInputData | null>(null);
  const [selectedFleet, setSelectedFleet] = useState<FleetInputData | null>(
    null
  );
  const insuranceInputRef = useRef<HTMLInputElement | null>(null);
  const registrationInputRef = useRef<HTMLInputElement | null>(null);
  const inspectionInputRef = useRef<HTMLInputElement | null>(null);

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
    if (!category) {
      toast.error('Category is required but not selected');
      return;
    }

    if (!selectedFleet?.id) {
      toast.error('Please select a fleet company');
      return;
    }

    // Build special equipment array
    const specialEquipment: string[] = [];
    if (wavRamp) specialEquipment.push('WAV Ramp/Lift');
    if (stretcherMount) specialEquipment.push('Stretcher Mount');

    // Build payload
    const payload = {
      business_id: selectedFleet.id,
      driver_profile_id: selectedDriver?.id || null,
      vehicle_name: `${values.year} ${values.make} ${values.model}`.trim(),
      make: values.make,
      model: values.model,
      year: values.year ? parseInt(values.year, 10) : new Date().getFullYear(),
      plate_number: values.plate,
      color: values.color || null,
      vin: values.vin || null,
      category,
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
      special_equipment: specialEquipment.length > 0 ? specialEquipment : [],
      insurance_provider: values.insuranceProvider || null,
      registration_authority: values.regAuthority || null,
      last_inspection_date: lastInspection
        ? lastInspection.format('YYYY-MM-DD')
        : null,
      internal_notes: values.notes || null,
      insurance_file: insuranceFile,
      registration_file: registrationFile,
      inspection_file: inspectionFile,
    };
    // console.log('Submitting vehicle with payload:', payload);
    // return
    const success = await createVehicle(payload);

    console.log('Create vehicle result:', success);

    if (success) {
      onAdd();
      // Reset form state
      setCategory('');
      setWavRamp(false);
      setStretcherMount(false);
      setStatus('Active');
      setLastInspection(null);
      setInsuranceExpiry(null);
      setRegistrationExpiry(null);
      setInsuranceFile(null);
      setRegistrationFile(null);
      setInspectionFile(null);
      setSelectedDriver(null);
      setSelectedFleet(null);
    }
  };

  return (
    <AppModal
      open={open}
      setOpen={() => onClose()}
      label="add-vehicle-modal"
      padding="0px"
    >
      <Formik
        initialValues={initialValues}
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
                  Add New Vehicle
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
                  Register a vehicle and assign it to a driver or fleet.
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
                  <FormField label="Fleet Company*">
                    <FleetDropdownMenuInput
                      handleFleetSelected={(fleet) => {
                        setSelectedFleet(fleet);
                        setSelectedDriver(null); // Reset driver when fleet changes
                      }}
                      selectedFleetId={selectedFleet?.id}
                      selectedFleetName={selectedFleet?.name}
                    />
                  </FormField>
                  <FormField label="Assigned Driver">
                    <FleetDriverDropdownMenuInput
                      fleetId={selectedFleet?.id}
                      handleDriverSelected={(driver) =>
                        setSelectedDriver(driver)
                      }
                      selectedDriverId={selectedDriver?.id}
                      selectedDriverName={selectedDriver?.displayName}
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
                    This vehicle will be registered under{' '}
                    {selectedFleet?.name || 'a fleet company'} with{' '}
                    {selectedDriver
                      ? `${selectedDriver.displayName} assigned`
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
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '12px',
                  }}
                >
                  <FileUploadZone
                    label="Insurance Certificate"
                    file={insuranceFile}
                    inputRef={insuranceInputRef}
                    onFileChange={setInsuranceFile}
                  />
                  <FileUploadZone
                    label="Registration Document"
                    file={registrationFile}
                    inputRef={registrationInputRef}
                    onFileChange={setRegistrationFile}
                  />
                  <FileUploadZone
                    label="Inspection Report"
                    file={inspectionFile}
                    inputRef={inspectionInputRef}
                    onFileChange={setInspectionFile}
                  />
                </Box>
              </SectionCard>

              {/* Section 5: Status & Operational Info */}
              <SectionCard
                icon={
                  <TuneOutlinedIcon sx={{ fontSize: 16, color: '#EF4444' }} />
                }
                iconBg="#FEF2F2"
                title="Status & Operational Info"
              >
                <Stack spacing={'6px'}>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 600,
                      fontSize: pxToRem(12),
                      color: '#374151',
                    }}
                  >
                    Vehicle Status
                  </Typography>
                  <RowStack spacing={'8px'}>
                    {statusOptions.map((opt) => {
                      const isActive = status === opt;
                      const config = statusColors[opt];
                      return (
                        <Box
                          key={opt}
                          onClick={() => setStatus(opt)}
                          sx={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 36,
                            background: isActive ? config.bg : '#FFFFFF',
                            border: `0.67px solid ${isActive ? config.border : '#E8ECF0'}`,
                            borderRadius: '9px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            '&:hover': { opacity: 0.85 },
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
                              fontWeight: 600,
                              fontSize: pxToRem(12.5),
                              color: isActive ? config.color : '#6B7280',
                            }}
                          >
                            {opt}
                          </Typography>
                        </Box>
                      );
                    })}
                  </RowStack>
                </Stack>
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
                  disabled={!isValid || !dirty || !category}
                  startIcon={
                    !isSubmitting ? (
                      <AddOutlinedIcon
                        sx={{ fontSize: 14, color: '#FFFFFF' }}
                      />
                    ) : undefined
                  }
                  sx={{
                    height: 40,
                    padding: '0 20px',
                    background:
                      isValid && dirty && category
                        ? '#2F6FED'
                        : 'rgba(47, 111, 237, 0.5)',
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
                  Add Vehicle
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

const FileUploadZone = ({
  label,
  file,
  inputRef,
  onFileChange,
}: {
  label: string;
  file: File | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (file: File | null) => void;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onFileChange(f);
    e.target.value = '';
  };

  return (
    <Stack spacing={'6px'}>
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 700,
          fontSize: pxToRem(12),
          color: '#374151',
        }}
      >
        {label}
      </Typography>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,image/*"
        hidden
        onChange={handleChange}
      />
      <Box
        onClick={() => inputRef.current?.click()}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          padding: '16px 12px',
          background: file ? '#EEF3FF' : '#FAFBFC',
          border: `1px dashed ${file ? '#2F6FED' : '#D1D5DB'}`,
          borderRadius: '10px',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          '&:hover': {
            borderColor: '#2F6FED',
            background: file ? '#EEF3FF' : '#F0F4F8',
          },
        }}
      >
        {file ? (
          <>
            <CheckCircleOutlineIcon sx={{ fontSize: 18, color: '#2F6FED' }} />
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(11.5),
                color: '#2F6FED',
                textAlign: 'center',
              }}
            >
              File selected
            </Typography>
            <RowStack spacing={'4px'}>
              <AttachFileIcon sx={{ fontSize: 11, color: '#6B7280' }} />
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(10.5),
                  color: '#6B7280',
                  maxWidth: '120px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {file.name}
              </Typography>
            </RowStack>
          </>
        ) : (
          <>
            <CloudUploadOutlinedIcon sx={{ fontSize: 20, color: '#9CA3AF' }} />
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(11.5),
                color: '#374151',
                textAlign: 'center',
              }}
            >
              Upload PDF or image
            </Typography>
          </>
        )}
      </Box>
    </Stack>
  );
};
