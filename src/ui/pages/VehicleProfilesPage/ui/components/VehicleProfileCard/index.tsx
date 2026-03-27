'use client';

import { Box, Stack, Typography } from '@mui/material';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import FingerprintOutlinedIcon from '@mui/icons-material/FingerprintOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import { RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import type { VehicleCategory, VehicleStatus } from '../../../../AllVehiclesPage';

// ─── Types ──────────────────────────────────────────────────────────────────

export type VehicleProfileCardData = {
  id: string;
  vehicleId: string;
  vehicle: string;
  plate: string;
  category: VehicleCategory;
  status: VehicleStatus;
  driver: string;
  fleet: string;
  mileage: string;
  capacity: number;
  insurance: string;
  registration: string;
  lastService: string;
  vin: string;
};

type VehicleProfileCardProps = {
  vehicle: VehicleProfileCardData;
  onEditProfile: () => void;
  onDocuments: () => void;
  onScheduleService: () => void;
};

// ─── Configs ─────────────────────────────────────────────────────────────────

const categoryColors: Record<VehicleCategory, { color: string; bg: string }> = {
  'Wheelchair Accessible': { color: '#059669', bg: '#ECFDF5' },
  'Standard Ride': { color: '#2F6FED', bg: '#EBF2FF' },
  'Assisted Ride': { color: '#7C3AED', bg: '#F3EEFF' },
  'Stretcher Transport': { color: '#D97706', bg: '#FFFBEB' },
};

const statusConfig: Record<VehicleStatus, { color: string; bg: string }> = {
  Active: { color: '#059669', bg: '#ECFDF5' },
  Maintenance: { color: '#D97706', bg: '#FFFBEB' },
  Inactive: { color: '#6B7280', bg: '#F3F4F6' },
};

// ─── Component ──────────────────────────────────────────────────────────────

export const VehicleProfileCard = ({
  vehicle,
  onEditProfile,
  onDocuments,
  onScheduleService,
}: VehicleProfileCardProps) => {
  const catConfig = categoryColors[vehicle.category];
  const statCfg = statusConfig[vehicle.status];

  const statCards = [
    {
      icon: <PersonOutlineOutlinedIcon sx={{ fontSize: 13, color: '#9CA3AF' }} />,
      label: 'ASSIGNED DRIVER',
      value: vehicle.driver,
    },
    {
      icon: <ApartmentOutlinedIcon sx={{ fontSize: 13, color: '#9CA3AF' }} />,
      label: 'FLEET NETWORK',
      value: vehicle.fleet,
    },
    {
      icon: <SpeedOutlinedIcon sx={{ fontSize: 13, color: '#9CA3AF' }} />,
      label: 'MILEAGE',
      value: vehicle.mileage,
    },
    {
      icon: <GroupOutlinedIcon sx={{ fontSize: 13, color: '#9CA3AF' }} />,
      label: 'CAPACITY',
      value: `${vehicle.capacity} passengers`,
    },
    {
      icon: <SecurityOutlinedIcon sx={{ fontSize: 13, color: '#9CA3AF' }} />,
      label: 'INSURANCE',
      value: vehicle.insurance,
    },
    {
      icon: <DescriptionOutlinedIcon sx={{ fontSize: 13, color: '#9CA3AF' }} />,
      label: 'REGISTRATION',
      value: vehicle.registration,
    },
    {
      icon: <BuildOutlinedIcon sx={{ fontSize: 13, color: '#9CA3AF' }} />,
      label: 'LAST SERVICE',
      value: vehicle.lastService,
    },
    {
      icon: <FingerprintOutlinedIcon sx={{ fontSize: 13, color: '#9CA3AF' }} />,
      label: 'VIN',
      value: vehicle.vin,
    },
  ];

  return (
    <Stack
      spacing={'16px'}
      sx={{
        background: '#FFFFFF',
        border: '0.67px solid #E8ECF0',
        borderRadius: '16px',
        padding: '20px',
      }}
    >
      {/* Header: Icon + Vehicle Info + Status */}
      <RowStack justifyContent={'space-between'}>
        <RowStack spacing={'14px'}>
          {/* Circular Car Icon */}
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'rgba(47, 111, 237, 0.09)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <DirectionsCarOutlinedIcon sx={{ fontSize: 22, color: '#2F6FED' }} />
          </Box>

          {/* Vehicle Name + ID/Plate + Category */}
          <Stack spacing={'2px'}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 700,
                fontSize: pxToRem(17),
                lineHeight: '1.5em',
                color: '#111827',
              }}
            >
              {vehicle.vehicle}
            </Typography>
            <RowStack spacing={'8px'}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12),
                  lineHeight: '1.5em',
                  color: '#9CA3AF',
                }}
              >
                {vehicle.vehicleId} · {vehicle.plate}
              </Typography>
              <Box
                sx={{
                  padding: '1px 10px',
                  borderRadius: '100px',
                  background: catConfig.bg,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 600,
                    fontSize: pxToRem(11.5),
                    lineHeight: '1.5em',
                    color: catConfig.color,
                  }}
                >
                  {vehicle.category}
                </Typography>
              </Box>
            </RowStack>
          </Stack>
        </RowStack>

        {/* Status Badge */}
        <Box
          sx={{
            padding: '2px 10px',
            borderRadius: '100px',
            background: statCfg.bg,
            alignSelf: 'flex-start',
          }}
        >
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(12),
              lineHeight: '1.5em',
              color: statCfg.color,
            }}
          >
            {vehicle.status}
          </Typography>
        </Box>
      </RowStack>

      {/* Stats Grid — 4 columns */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
        }}
      >
        {statCards.map((stat) => (
          <Stack
            key={stat.label}
            sx={{
              background: '#F7F9FB',
              borderRadius: '14px',
              padding: '12px',
              gap: '4px',
            }}
          >
            <RowStack spacing={'6px'}>
              {stat.icon}
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(10),
                  lineHeight: '1.5em',
                  color: '#9CA3AF',
                  textTransform: 'uppercase',
                }}
              >
                {stat.label}
              </Typography>
            </RowStack>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 500,
                fontSize: pxToRem(12.5),
                lineHeight: '1.5em',
                color: stat.value === 'Unassigned' ? '#D97706' : '#374151',
              }}
            >
              {stat.value}
            </Typography>
          </Stack>
        ))}
      </Box>

      {/* Action Buttons — left-aligned, not full width */}
      <RowStack spacing={'8px'}>
        <ActionButton
          onClick={onEditProfile}
          icon={<EditOutlinedIcon sx={{ fontSize: 14, color: '#374151' }} />}
          label="Edit Profile"
          bg="#F7F9FB"
          border="#E8ECF0"
          color="#374151"
        />
        <ActionButton
          onClick={onDocuments}
          icon={<FolderOutlinedIcon sx={{ fontSize: 14, color: '#2F6FED' }} />}
          label="Documents"
          bg="#EBF2FF"
          border="#2F6FED"
          color="#2F6FED"
        />
        <ActionButton
          onClick={onScheduleService}
          icon={<EventOutlinedIcon sx={{ fontSize: 14, color: '#D97706' }} />}
          label="Schedule Service"
          bg="#FFFBEB"
          border="#D97706"
          color="#D97706"
        />
      </RowStack>
    </Stack>
  );
};

// ─── Sub-Components ─────────────────────────────────────────────────────────

const ActionButton = ({
  onClick,
  icon,
  label,
  bg,
  border,
  color,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  bg: string;
  border: string;
  color: string;
}) => (
  <Box
    onClick={onClick}
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '5px',
      height: 39,
      padding: '0 16px',
      background: bg,
      border: `0.67px solid ${border}`,
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'opacity 0.15s ease',
      '&:hover': { opacity: 0.85 },
    }}
  >
    {icon}
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 600,
        fontSize: pxToRem(13),
        lineHeight: '1.5em',
        color: color,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </Typography>
  </Box>
);
