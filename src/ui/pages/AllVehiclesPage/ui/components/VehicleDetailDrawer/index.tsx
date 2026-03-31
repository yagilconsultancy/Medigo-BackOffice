'use client';

import { Box, IconButton, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined';
import AirlineSeatReclineNormalOutlinedIcon from '@mui/icons-material/AirlineSeatReclineNormalOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import FingerprintOutlinedIcon from '@mui/icons-material/FingerprintOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { AppModal, RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import type { VehicleRow } from '../../..';

// ─── Status Config ──────────────────────────────────────────────────────────

type VehicleStatus = 'Active' | 'Maintenance' | 'Inactive';

const statusConfig: Record<VehicleStatus, { color: string; bg: string }> = {
  Active: { color: '#059669', bg: '#ECFDF5' },
  Maintenance: { color: '#D97706', bg: '#FFFBEB' },
  Inactive: { color: '#6B7280', bg: '#F3F4F6' },
};

// ─── Component ──────────────────────────────────────────────────────────────

type VehicleDetailDrawerProps = {
  open: boolean;
  onClose: () => void;
  vehicle: VehicleRow | null;
  onEditVehicle: () => void;
  onScheduleService: () => void;
};

export const VehicleDetailDrawer = ({
  open,
  onClose,
  vehicle,
  onEditVehicle,
  onScheduleService,
}: VehicleDetailDrawerProps) => {
  if (!vehicle) return null;

  const currentStatus = statusConfig[vehicle.status];

  const detailRows = [
    {
      icon: (
        <PersonOutlineOutlinedIcon sx={{ fontSize: 11, color: '#9CA3AF' }} />
      ),
      label: 'Assigned Driver',
      value: vehicle.driver,
    },
    {
      icon: <BusinessOutlinedIcon sx={{ fontSize: 11, color: '#9CA3AF' }} />,
      label: 'Fleet',
      value: vehicle.fleet,
    },
    {
      icon: (
        <ConfirmationNumberOutlinedIcon
          sx={{ fontSize: 11, color: '#9CA3AF' }}
        />
      ),
      label: 'Plate',
      value: vehicle.plate,
    },
    {
      icon: <FingerprintOutlinedIcon sx={{ fontSize: 11, color: '#9CA3AF' }} />,
      label: 'VIN',
      value: vehicle.vin,
    },
    {
      icon: (
        <VerifiedUserOutlinedIcon sx={{ fontSize: 11, color: '#9CA3AF' }} />
      ),
      label: 'Insurance',
      value: vehicle.insurance,
    },
    {
      icon: <DescriptionOutlinedIcon sx={{ fontSize: 11, color: '#9CA3AF' }} />,
      label: 'Registration',
      value: vehicle.registration,
    },
    {
      icon: <BuildOutlinedIcon sx={{ fontSize: 11, color: '#9CA3AF' }} />,
      label: 'Last Service',
      value: vehicle.lastService,
    },
    {
      icon: <EventOutlinedIcon sx={{ fontSize: 11, color: '#9CA3AF' }} />,
      label: 'Next Service',
      value: vehicle.nextService,
    },
  ];

  return (
    <AppModal
      open={open}
      setOpen={() => onClose()}
      label="vehicle-detail-modal"
      padding="0px"
      sx={{
        '& .MuiDialog-paper': {
          width: 480,
          maxWidth: 480,
          borderRadius: '20px',
          boxShadow: '0px 32px 80px 0px rgba(0, 0, 0, 0.18)',
          overflow: 'hidden',
        },
      }}
    >
      <Stack>
        {/* Close Button */}
        <RowStack justifyContent={'flex-end'} sx={{ padding: '16px 20px 0' }}>
          <IconButton
            onClick={onClose}
            sx={{
              width: 30,
              height: 30,
              borderRadius: '8px',
              background: '#F3F4F6',
              border: '0.67px solid #E5E7EB',
              '&:hover': { background: '#E5E7EB' },
            }}
          >
            <CloseIcon sx={{ fontSize: 14, color: '#6B7280' }} />
          </IconButton>
        </RowStack>

        {/* Header Section */}
        <Stack
          alignItems={'center'}
          sx={{
            padding: '8px 24px 24px',
            borderBottom: '0.67px solid #F0F4F8',
          }}
        >
          {/* Green Gradient Avatar */}
          <Box
            sx={{
              width: 84,
              height: 84,
              borderRadius: '42px',
              background:
                'linear-gradient(135deg, rgba(16, 185, 129, 1) 0%, rgba(16, 185, 129, 0.33) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                width: 30,
                height: 30,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                width="25"
                height="13"
                viewBox="0 0 25 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 6.25a5 5 0 015-5h0a5 5 0 010 10M11.25 11.25h7.5M18.75 8.75a5 5 0 100-10"
                  stroke="#059669"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </Box>
          </Box>

          {/* Vehicle Name */}
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 700,
              fontSize: pxToRem(20),
              lineHeight: '1.5em',
              color: '#111827',
              marginTop: '12px',
              textAlign: 'center',
            }}
          >
            {vehicle.vehicle}
          </Typography>

          {/* Category · Status · VH-ID */}
          <RowStack spacing={'8px'} sx={{ marginTop: '4px' }}>
            <Box
              sx={{
                padding: '3px 10px',
                borderRadius: '100px',
                background: '#ECFDF5',
              }}
            >
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(11.5),
                  lineHeight: '1.5em',
                  color: '#059669',
                }}
              >
                {vehicle.category}
              </Typography>
            </Box>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(12),
                color: '#9CA3AF',
              }}
            >
              ·
            </Typography>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(11.5),
                lineHeight: '1.5em',
                color: currentStatus.color,
              }}
            >
              {vehicle.status}
            </Typography>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(12),
                color: '#9CA3AF',
              }}
            >
              ·
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
              {vehicle.vehicleId}
            </Typography>
          </RowStack>

          {/* Stat Boxes */}
          <RowStack sx={{ marginTop: '16px', gap: '12px', width: '100%' }}>
            <StatBox
              icon={
                <SpeedOutlinedIcon sx={{ fontSize: 14, color: '#9CA3AF' }} />
              }
              value={vehicle.mileage}
              label="Mileage"
            />
            <StatBox
              icon={
                <AirlineSeatReclineNormalOutlinedIcon
                  sx={{ fontSize: 14, color: '#9CA3AF' }}
                />
              }
              value={`${vehicle.capacity} seats`}
              label="Capacity"
            />
            <StatBox
              icon={
                <BuildOutlinedIcon sx={{ fontSize: 14, color: '#9CA3AF' }} />
              }
              value={vehicle.lastService}
              label="Last Service"
            />
          </RowStack>
        </Stack>

        {/* Vehicle Details Section */}
        <Stack spacing={'8px'} sx={{ padding: '20px 24px' }}>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 700,
              fontSize: pxToRem(11),
              lineHeight: '1.5em',
              letterSpacing: '0.05em',
              color: '#9CA3AF',
              textTransform: 'uppercase',
            }}
          >
            Vehicle Details
          </Typography>

          {/* 2-Column Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
            }}
          >
            {detailRows.map((row) => (
              <DetailCell
                key={row.label}
                icon={row.icon}
                label={row.label}
                value={row.value}
              />
            ))}
          </Box>
        </Stack>

        {/* Footer Buttons */}
        <RowStack spacing={'12px'} sx={{ padding: '0 24px 20px' }}>
          <Box
            onClick={onEditVehicle}
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              height: 40,
              background: '#F7F9FB',
              border: '0.67px solid #E5E7EB',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'opacity 0.15s ease',
              '&:hover': { opacity: 0.85 },
            }}
          >
            <EditOutlinedIcon sx={{ fontSize: 13, color: '#374151' }} />
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(13),
                lineHeight: '1.5em',
                color: '#374151',
              }}
            >
              Edit Vehicle
            </Typography>
          </Box>
          <Box
            onClick={onScheduleService}
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              height: 40,
              background: '#FFFBEB',
              border: '0.67px solid #FDE68A',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'opacity 0.15s ease',
              '&:hover': { opacity: 0.85 },
            }}
          >
            <BuildOutlinedIcon sx={{ fontSize: 13, color: '#D97706' }} />
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(13),
                lineHeight: '1.5em',
                color: '#D97706',
              }}
            >
              Schedule Service
            </Typography>
          </Box>
        </RowStack>
      </Stack>
    </AppModal>
  );
};

// ─── Sub-Components ─────────────────────────────────────────────────────────

const StatBox = ({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) => (
  <Stack
    alignItems={'center'}
    sx={{
      flex: 1,
      background: '#F7F9FB',
      border: '0.67px solid #F0F4F8',
      borderRadius: '14px',
      padding: '12px 12px 10px',
    }}
  >
    {icon}
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 700,
        fontSize: pxToRem(13),
        lineHeight: '1.5em',
        color: '#111827',
        marginTop: '4px',
        textAlign: 'center',
      }}
    >
      {value}
    </Typography>
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 400,
        fontSize: pxToRem(11),
        lineHeight: '1.5em',
        color: '#9CA3AF',
        textAlign: 'center',
      }}
    >
      {label}
    </Typography>
  </Stack>
);

const DetailCell = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <Stack
    sx={{
      background: '#F7F9FB',
      borderRadius: '14px',
      padding: '10px 12px',
      gap: '4px',
    }}
  >
    <RowStack spacing={'6px'}>
      {icon}
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 600,
          fontSize: pxToRem(10.5),
          lineHeight: '1.5em',
          color: '#9CA3AF',
        }}
      >
        {label}
      </Typography>
    </RowStack>
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 500,
        fontSize: pxToRem(12.5),
        lineHeight: '1.5em',
        color: value === 'Unassigned' ? '#D97706' : '#111827',
      }}
    >
      {value}
    </Typography>
  </Stack>
);
