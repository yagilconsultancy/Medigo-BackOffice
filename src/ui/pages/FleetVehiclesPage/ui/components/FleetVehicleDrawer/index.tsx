import {
  Box,
  Chip,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import FingerprintOutlinedIcon from '@mui/icons-material/FingerprintOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import { RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import { VehicleStatus } from '../VehicleStatusChip';
import { DocValidity } from '../DocValidityChip';
import type { FleetVehicleRow } from '../../..';

// ─── Status Config ──────────────────────────────────────────────────────────

type DrawerVehicleStatus = 'Active' | 'Maintenance' | 'Inactive';

const statusConfig: Record<
  DrawerVehicleStatus,
  { color: string; bg: string; activeBorder: string }
> = {
  Active: { color: '#059669', bg: '#ECFDF5', activeBorder: '#059669' },
  Maintenance: { color: '#D97706', bg: '#FFFBEB', activeBorder: '#D97706' },
  Inactive: { color: '#6B7280', bg: '#F3F4F6', activeBorder: '#6B7280' },
};

const statusOptions: DrawerVehicleStatus[] = [
  'Active',
  'Maintenance',
  'Inactive',
];

const docValidityConfig: Record<DocValidity, { color: string; bg: string }> = {
  Valid: { color: '#059669', bg: '#ECFDF5' },
  Expiring: { color: '#D97706', bg: '#FFFBEB' },
  Expired: { color: '#EF4444', bg: '#FEF2F2' },
};

// ─── Component ──────────────────────────────────────────────────────────────

type FleetVehicleDrawerProps = {
  open: boolean;
  onClose: () => void;
  vehicle: FleetVehicleRow | null;
  onStatusChange?: (
    vehicle: FleetVehicleRow,
    newStatus: VehicleStatus
  ) => void;
  onScheduleMaintenance?: () => void;
};

export const FleetVehicleDrawer = ({
  open,
  onClose,
  vehicle,
  onStatusChange,
  onScheduleMaintenance,
}: FleetVehicleDrawerProps) => {
  if (!vehicle) return null;

  const currentStatus = statusConfig[vehicle.status];

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: '425px',
          boxShadow: '-4px 0px 40px 0px rgba(0, 0, 0, 0.12)',
          border: 'none',
        },
      }}
    >
      <Stack sx={{ height: '100%', overflow: 'auto' }}>
        {/* Blue Header Section */}
        <Stack
          sx={{
            background: '#2F6FED',
            padding: '24px',
            position: 'relative',
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: 30,
              height: 30,
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.15)',
            }}
          >
            <CloseIcon sx={{ fontSize: 15, color: '#FFFFFF' }} />
          </IconButton>

          {/* Vehicle Icon */}
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: '14px',
              background: 'rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DirectionsCarOutlinedIcon
              sx={{ fontSize: 22, color: '#FFFFFF' }}
            />
          </Box>

          {/* Vehicle Name */}
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 700,
              fontSize: pxToRem(17),
              lineHeight: '1.5em',
              color: '#FFFFFF',
              marginTop: '12px',
            }}
          >
            {vehicle.vehicle}
          </Typography>

          {/* Vehicle ID + Plate */}
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(12),
              lineHeight: '1.5em',
              color: 'rgba(255, 255, 255, 0.7)',
            }}
          >
            {vehicle.vehicleId} · {vehicle.plate}
          </Typography>

          {/* Mini Stat Boxes */}
          <RowStack
            sx={{
              marginTop: '16px',
              gap: '12px',
            }}
          >
            <MiniStatBox label="STATUS" value={vehicle.status} />
            <MiniStatBox
              label="CATEGORY"
              value={vehicle.category === 'Standard Ride' ? 'Standard' : vehicle.category === 'Wheelchair Accessible' ? 'WAV' : 'Assisted'}
            />
            <MiniStatBox label="MILEAGE" value={vehicle.mileage} />
          </RowStack>
        </Stack>

        {/* Content Sections */}
        <Stack spacing={'20px'} sx={{ padding: '24px', flex: 1 }}>
          {/* Change Status */}
          <Stack spacing={'8px'}>
            <SectionLabel>CHANGE STATUS</SectionLabel>
            <RowStack spacing={'8px'}>
              {statusOptions.map((status) => {
                const isActive = vehicle.status === status;
                const config = statusConfig[status];
                return (
                  <Box
                    key={status}
                    onClick={() => onStatusChange?.(vehicle, status)}
                    sx={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '35px',
                      background: isActive ? config.bg : '#FFFFFF',
                      border: `0.67px solid ${isActive ? config.activeBorder : '#E8ECF0'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      '&:hover': { opacity: 0.85 },
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 600,
                        fontSize: pxToRem(12),
                        lineHeight: '1.5em',
                        color: isActive ? config.color : '#6B7280',
                        textAlign: 'center',
                      }}
                    >
                      {status}
                    </Typography>
                  </Box>
                );
              })}
            </RowStack>
          </Stack>

          {/* Vehicle Details */}
          <Stack spacing={'8px'}>
            <SectionLabel>VEHICLE DETAILS</SectionLabel>
            <DetailRow
              icon={
                <PersonOutlineOutlinedIcon
                  sx={{ fontSize: 13, color: '#9CA3AF' }}
                />
              }
              label="Assigned Driver"
              value={vehicle.driver}
            />
            <DetailRow
              icon={
                <BusinessOutlinedIcon
                  sx={{ fontSize: 13, color: '#9CA3AF' }}
                />
              }
              label="Fleet Network"
              value={vehicle.fleet}
            />
            <DetailRow
              icon={
                <FingerprintOutlinedIcon
                  sx={{ fontSize: 13, color: '#9CA3AF' }}
                />
              }
              label="VIN"
              value={vehicle.vin}
            />
          </Stack>

          {/* Compliance Documents */}
          <Stack spacing={'8px'}>
            <SectionLabel>COMPLIANCE DOCUMENTS</SectionLabel>
            <ComplianceRow
              icon={
                <VerifiedUserOutlinedIcon
                  sx={{ fontSize: 13, color: '#9CA3AF' }}
                />
              }
              label="Insurance"
              validity={vehicle.insurance}
            />
            <ComplianceRow
              icon={
                <DescriptionOutlinedIcon
                  sx={{ fontSize: 13, color: '#9CA3AF' }}
                />
              }
              label="Registration"
              validity={vehicle.registration}
            />
          </Stack>
        </Stack>

        {/* Footer Buttons */}
        <Stack spacing={'8px'} sx={{ padding: '0 24px 24px' }}>
          <Box
            onClick={onScheduleMaintenance}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              height: '41px',
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
              Schedule Maintenance
            </Typography>
          </Box>
          <Box
            onClick={() => onStatusChange?.(vehicle, 'Inactive')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              height: '41px',
              background: '#F3F4F6',
              border: '0.67px solid #E5E7EB',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'opacity 0.15s ease',
              '&:hover': { opacity: 0.85 },
            }}
          >
            <BlockOutlinedIcon sx={{ fontSize: 13, color: '#6B7280' }} />
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(13),
                lineHeight: '1.5em',
                color: '#6B7280',
              }}
            >
              Mark Inactive
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Drawer>
  );
};

// ─── Sub-Components ─────────────────────────────────────────────────────────

const SectionLabel = ({ children }: { children: string }) => (
  <Typography
    sx={{
      fontFamily: (theme) => theme.typography.fontFamily,
      fontWeight: 700,
      fontSize: pxToRem(10),
      lineHeight: '1.5em',
      letterSpacing: '0.08em',
      color: '#9CA3AF',
      textTransform: 'uppercase',
    }}
  >
    {children}
  </Typography>
);

const MiniStatBox = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <Stack
    sx={{
      flex: 1,
      background: 'rgba(255, 255, 255, 0.12)',
      borderRadius: '14px',
      padding: '12px 12px 0',
    }}
  >
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 400,
        fontSize: pxToRem(10),
        lineHeight: '1.5em',
        color: 'rgba(255, 255, 255, 0.6)',
      }}
    >
      {label}
    </Typography>
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 600,
        fontSize: pxToRem(12.5),
        lineHeight: '1.5em',
        color: '#FFFFFF',
      }}
    >
      {value}
    </Typography>
  </Stack>
);

const DetailRow = ({
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
      padding: '0 16px',
    }}
  >
    <RowStack
      spacing={'8px'}
      sx={{ justifyContent: 'space-between', width: '100%' }}
    >
      <RowStack spacing={'8px'}>
        {icon}
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(12),
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
          fontSize: pxToRem(13),
          lineHeight: '1.5em',
          color: '#111827',
        }}
      >
        {value}
      </Typography>
    </RowStack>
  </Stack>
);

const ComplianceRow = ({
  icon,
  label,
  validity,
}: {
  icon: React.ReactNode;
  label: string;
  validity: DocValidity;
}) => {
  const config = docValidityConfig[validity];
  return (
    <Stack
      sx={{
        background: '#F7F9FB',
        borderRadius: '14px',
        padding: '12px 16px 0',
      }}
    >
      <RowStack
        spacing={'8px'}
        sx={{ justifyContent: 'space-between', width: '100%' }}
      >
        <RowStack spacing={'8px'}>
          {icon}
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(12),
              lineHeight: '1.5em',
              color: '#9CA3AF',
            }}
          >
            {label}
          </Typography>
        </RowStack>
        <Chip
          label={validity}
          size="small"
          sx={{
            background: config.bg,
            color: config.color,
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: pxToRem(11.5),
            height: '21px',
            borderRadius: '100px',
          }}
        />
      </RowStack>
    </Stack>
  );
};
