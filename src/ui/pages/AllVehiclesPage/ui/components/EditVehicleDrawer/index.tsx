'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Checkbox,
  Drawer,
  IconButton,
  MenuItem,
  Select,
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
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import type { VehicleRow } from '../../..';

// ─── Types ──────────────────────────────────────────────────────────────────

type VehicleCategory =
  | 'Standard Ride'
  | 'Wheelchair Accessible'
  | 'Assisted Ride'
  | 'Stretcher Transport';

type EditVehicleDrawerProps = {
  open: boolean;
  onClose: () => void;
  vehicle: VehicleRow | null;
  onSave: () => void;
};

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

const driverOptions = [
  'Marcus Johnson',
  'Sarah Williams',
  'David Chen',
  'Emily Rodriguez',
  'James Thompson',
  'Anna Kim',
  'Tom Roberts',
  'Grace Miller',
  'Leon Price',
  'Unassigned',
];

// ─── Component ──────────────────────────────────────────────────────────────

export const EditVehicleDrawer = ({
  open,
  onClose,
  vehicle,
  onSave,
}: EditVehicleDrawerProps) => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [plate, setPlate] = useState('');
  const [vin, setVin] = useState('');
  const [color, setColor] = useState('');
  const [category, setCategory] = useState<VehicleCategory | ''>('');
  const [capacity, setCapacity] = useState('');
  const [wavRamp, setWavRamp] = useState(false);
  const [stretcherMount, setStretcherMount] = useState(false);
  const [fleet, setFleet] = useState('');
  const [driver, setDriver] = useState('');
  const [insuranceProvider, setInsuranceProvider] = useState('');
  const [insuranceExpiry, setInsuranceExpiry] = useState('');
  const [regAuthority, setRegAuthority] = useState('');
  const [registrationExpiry, setRegistrationExpiry] = useState('');
  const [lastInspection, setLastInspection] = useState('');
  const [status, setStatus] = useState<'Active' | 'Maintenance' | 'Inactive'>(
    'Active'
  );
  const [mileage, setMileage] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (open && vehicle) {
      const parts = vehicle.vehicle.split(' ');
      setYear(parts.length >= 1 ? parts[0] : '');
      setMake(parts.length >= 2 ? parts[1] : '');
      setModel(parts.length >= 3 ? parts.slice(2).join(' ') : '');
      setPlate(vehicle.plate);
      setVin(vehicle.vin);
      setColor(vehicle.color || '');
      setCategory(vehicle.category as VehicleCategory);
      setCapacity(String(vehicle.capacity));
      setWavRamp(
        vehicle.category === 'Wheelchair Accessible' ||
          vehicle.category === 'Stretcher Transport'
      );
      setStretcherMount(vehicle.category === 'Stretcher Transport');
      setFleet(
        vehicle.fleet === 'MediGo'
          ? 'Independent (MediGo Direct)'
          : vehicle.fleet
      );
      setDriver(vehicle.driver);
      setInsuranceProvider('State Farm');
      setInsuranceExpiry(vehicle.insuranceExpiry || '');
      setRegAuthority('NY DMV');
      setRegistrationExpiry(vehicle.registrationExpiry || '');
      setLastInspection('');
      setStatus(vehicle.status);
      setMileage(vehicle.mileage);
      setNotes('');
    }
  }, [open, vehicle]);

  const isFormValid = useMemo(
    () =>
      make.trim().length > 0 &&
      model.trim().length > 0 &&
      plate.trim().length > 0,
    [make, model, plate]
  );

  const handleSave = useCallback(() => {
    if (isFormValid) {
      onSave();
    }
  }, [isFormValid, onSave]);

  const statusOptions: ('Active' | 'Maintenance' | 'Inactive')[] = [
    'Active',
    'Maintenance',
    'Inactive',
  ];

  const statusColors: Record<string, { color: string; bg: string; border: string }> = {
    Active: { color: '#059669', bg: '#ECFDF5', border: '#059669' },
    Maintenance: { color: '#D97706', bg: '#FFFBEB', border: '#D97706' },
    Inactive: { color: '#6B7280', bg: '#F3F4F6', border: '#6B7280' },
  };

  if (!vehicle) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: '860px',
          boxShadow: '-4px 0px 40px 0px rgba(0, 0, 0, 0.12)',
          border: 'none',
          overflow: 'hidden',
        },
      }}
    >
      <Stack sx={{ height: '100%' }}>
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
              Update vehicle information, fleet assignment, and registration
              documents.
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
            icon={<DirectionsCarOutlinedIcon sx={{ fontSize: 16, color: '#2F6FED' }} />}
            iconBg="#EBF2FF"
            title="Vehicle Identity"
          >
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <FormField label="Make*">
                <FormTextField value={make} onChange={setMake} placeholder="e.g. Toyota" />
              </FormField>
              <FormField label="Model*">
                <FormTextField value={model} onChange={setModel} placeholder="e.g. Sienna" />
              </FormField>
              <FormField label="Year">
                <FormTextField value={year} onChange={setYear} placeholder="2024" />
              </FormField>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <FormField label="License Plate*">
                <FormTextField value={plate} onChange={setPlate} placeholder="e.g. ABC-1234" />
              </FormField>
              <FormField label="VIN">
                <FormTextField value={vin} onChange={setVin} placeholder="17-char VIN" />
              </FormField>
              <FormField label="Color">
                <FormTextField value={color} onChange={setColor} placeholder="e.g. Pearl White" />
              </FormField>
            </Box>
          </SectionCard>

          {/* Section 2: Vehicle Category */}
          <SectionCard
            icon={<CategoryOutlinedIcon sx={{ fontSize: 16, color: '#7C3AED' }} />}
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
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
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
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 600,
                          fontSize: pxToRem(13),
                          color: isSelected ? '#2F6FED' : '#374151',
                        }}
                      >
                        {card.label}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
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
                        <CheckIcon sx={{ fontSize: 12, color: '#FFFFFF' }} />
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Box>
            <FormField label="Passenger Capacity">
              <FormTextField value={capacity} onChange={setCapacity} placeholder="5" />
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
            icon={<GroupsOutlinedIcon sx={{ fontSize: 16, color: '#D97706' }} />}
            iconBg="#FFFBEB"
            title="Fleet & Driver Assignment"
          >
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <FormField label="Fleet Company*">
                <FormSelect
                  value={fleet}
                  onChange={setFleet}
                  placeholder="Select fleet"
                  options={fleetOptions}
                />
              </FormField>
              <FormField label="Assigned Driver">
                <FormSelect
                  value={driver}
                  onChange={setDriver}
                  placeholder="Select driver"
                  options={driverOptions}
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
              <InfoOutlinedIcon sx={{ fontSize: 14, color: '#0284C7' }} />
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12.5),
                  lineHeight: '1.5em',
                  color: '#0C4A6E',
                }}
              >
                Registered under {fleet || 'MediGo'} · assigned to{' '}
                {driver && driver !== 'Unassigned'
                  ? `${driver}`
                  : 'no driver'}
                .
              </Typography>
            </RowStack>
          </SectionCard>

          {/* Section 4: Documents & Insurance */}
          <SectionCard
            icon={<DescriptionOutlinedIcon sx={{ fontSize: 16, color: '#059669' }} />}
            iconBg="#ECFDF5"
            title="Documents & Insurance"
          >
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <FormField label="Insurance Provider">
                <FormTextField
                  value={insuranceProvider}
                  onChange={setInsuranceProvider}
                  placeholder="e.g. State Farm"
                />
              </FormField>
              <FormField label="Insurance Expiry">
                <FormDateField value={insuranceExpiry} onChange={setInsuranceExpiry} />
              </FormField>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <FormField label="Registration Authority">
                <FormTextField
                  value={regAuthority}
                  onChange={setRegAuthority}
                  placeholder="e.g. NY DMV"
                />
              </FormField>
              <FormField label="Registration Expiry">
                <FormDateField
                  value={registrationExpiry}
                  onChange={setRegistrationExpiry}
                />
              </FormField>
            </Box>
            <FormField label="Last Inspection Date">
              <FormDateField value={lastInspection} onChange={setLastInspection} />
            </FormField>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <FileUploadZone label="Insurance Certificate" />
              <FileUploadZone label="Registration Document" />
              <FileUploadZone label="Inspection Report" />
            </Box>
          </SectionCard>

          {/* Section 5: Status & Operational Info */}
          <SectionCard
            icon={<TuneOutlinedIcon sx={{ fontSize: 16, color: '#EF4444' }} />}
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
                          fontFamily: (theme) => theme.typography.fontFamily,
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
              <FormTextField value={mileage} onChange={setMileage} placeholder="0 mi" />
            </FormField>
            <FormField label="Internal Notes (optional)">
              <TextField
                multiline
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. WAV ramp serviced Mar 2026, tire rotation due..."
                fullWidth
                sx={textFieldMultilineSx}
              />
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
            <Box
              onClick={handleSave}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                height: 40,
                padding: '0 20px',
                background: isFormValid
                  ? '#2F6FED'
                  : 'rgba(47, 111, 237, 0.5)',
                borderRadius: '10px',
                cursor: isFormValid ? 'pointer' : 'default',
                transition: 'all 0.15s ease',
                '&:hover': { opacity: isFormValid ? 0.9 : 1 },
              }}
            >
              <SaveOutlinedIcon sx={{ fontSize: 14, color: '#FFFFFF' }} />
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(13),
                  color: '#FFFFFF',
                }}
              >
                Save Changes
              </Typography>
            </Box>
          </RowStack>
        </RowStack>
      </Stack>
    </Drawer>
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

const textFieldSx = {
  '& .MuiOutlinedInput-root': {
    height: '39px',
    background: '#F7F9FB',
    borderRadius: '10px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 400,
    fontSize: pxToRem(13),
    color: '#111827',
    '& fieldset': { borderColor: '#E8ECF0', borderWidth: '0.67px' },
    '&:hover fieldset': { borderColor: '#E8ECF0' },
    '&.Mui-focused fieldset': { borderColor: '#2F6FED', borderWidth: '1px' },
  },
  '& .MuiInputBase-input::placeholder': {
    color: 'rgba(55, 65, 81, 0.5)',
    opacity: 1,
  },
};

const textFieldMultilineSx = {
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
    '&.Mui-focused fieldset': { borderColor: '#2F6FED', borderWidth: '1px' },
  },
  '& .MuiInputBase-input::placeholder': {
    color: 'rgba(55, 65, 81, 0.5)',
    opacity: 1,
  },
};

const FormTextField = ({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
}) => (
  <TextField
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    fullWidth
    sx={textFieldSx}
  />
);

const FormDateField = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) => (
  <TextField
    type="date"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    fullWidth
    sx={textFieldSx}
  />
);

const FormSelect = ({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  options: string[];
}) => (
  <Select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    displayEmpty
    fullWidth
    renderValue={(selected) =>
      selected || (
        <Typography sx={{ color: 'rgba(55, 65, 81, 0.5)' }}>
          {placeholder}
        </Typography>
      )
    }
    sx={{
      height: '39px',
      background: '#F7F9FB',
      borderRadius: '10px',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 400,
      fontSize: pxToRem(13),
      color: '#111827',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#E8ECF0',
        borderWidth: '0.67px',
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#E8ECF0',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#2F6FED',
        borderWidth: '1px',
      },
    }}
  >
    {options.map((opt) => (
      <MenuItem key={opt} value={opt}>
        {opt}
      </MenuItem>
    ))}
  </Select>
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

const FileUploadZone = ({ label }: { label: string }) => (
  <Stack
    alignItems={'center'}
    justifyContent={'center'}
    spacing={'6px'}
    sx={{
      padding: '20px 12px',
      background: '#FAFBFC',
      border: '1px dashed #D1D5DB',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'background 0.15s ease',
      '&:hover': { background: '#F0F4F8' },
    }}
  >
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
      {label}
    </Typography>
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 400,
        fontSize: pxToRem(10.5),
        color: '#2F6FED',
        textAlign: 'center',
      }}
    >
      Replace / Upload
    </Typography>
  </Stack>
);
