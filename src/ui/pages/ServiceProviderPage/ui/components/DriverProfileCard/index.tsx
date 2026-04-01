'use client';

import {
  Avatar,
  Box,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import AccessibleOutlinedIcon from '@mui/icons-material/AccessibleOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { pxToRem } from '../../../../../../common';
import { RowStack } from '../../../../../modules/components';

// ─── Types ──────────────────────────────────────────────────────────────────

export type DriverProfileCardData = {
  id: string;
  name: string;
  avatar: string;
  joinedDate: string;
  status: string;
  fleet: string;
  vehicle: string;
  phone: string;
  license: string;
  capabilities: string[];
  rating: number;
  trips: number;
};

type DriverProfileCardProps = {
  driver: DriverProfileCardData;
  onEdit?: (driver: DriverProfileCardData) => void;
  onDocuments?: (driver: DriverProfileCardData) => void;
  onSuspend?: (driver: DriverProfileCardData) => void;
};

// ─── Status Config ──────────────────────────────────────────────────────────

const statusStyles: Record<string, { color: string; bg: string }> = {
  Available: { color: '#166534', bg: 'rgba(22, 101, 52, 0.08)' },
  'On Trip': { color: '#6366F1', bg: 'rgba(99, 102, 241, 0.08)' },
  Suspended: { color: '#991B1B', bg: 'rgba(153, 27, 27, 0.08)' },
};

// ─── Capability Icons ───────────────────────────────────────────────────────

const capabilityIcons: Record<string, React.ReactNode> = {
  'Wheelchair Assistance': (
    <AccessibleOutlinedIcon sx={{ fontSize: 10, color: '#2F6FED' }} />
  ),
  'Senior Assistance': (
    <FavoriteBorderOutlinedIcon sx={{ fontSize: 10, color: '#2F6FED' }} />
  ),
};

// ─── Component ──────────────────────────────────────────────────────────────

export const DriverProfileCard = ({
  driver,
  onEdit,
  onDocuments,
  onSuspend,
}: DriverProfileCardProps) => {
  const status = statusStyles[driver.status] || statusStyles['Available'];

  const nameParts = driver.name.split(' ');
  const initials =
    nameParts.length > 1
      ? `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`
      : nameParts[0].charAt(0);

  return (
    <Box
      sx={{
        background: '#FFFFFF',
        border: '0.67px solid rgba(0, 0, 0, 0.1)',
        borderRadius: '16px',
        boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Section 1: Header (blue tint bg) ─────────────────────────── */}
      <Box
        sx={{
          background: 'rgba(47, 111, 237, 0.05)',
          borderBottom: '0.67px solid #F0F4F8',
          padding: '16px 20px',
        }}
      >
        <RowStack justifyContent={'space-between'}>
          {/* Left: Avatar + Name */}
          <RowStack spacing={'10px'}>
            <Avatar
              src={driver.avatar || undefined}
              alt={driver.name}
              sx={{
                width: 46,
                height: 46,
                fontSize: pxToRem(14),
                fontWeight: 600,
                background: '#EBF2FF',
                color: '#2F6FED',
              }}
            >
              {initials}
            </Avatar>
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
                {driver.name}
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
                Joined {driver.joinedDate}
              </Typography>
            </Stack>
          </RowStack>

          {/* Right: Status + Fleet badges */}
          <Stack spacing={'4px'} alignItems={'flex-end'}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(11.5),
                lineHeight: '1.5em',
                color: status.color,
              }}
            >
              {driver.status}
            </Typography>
            <Box
              sx={{
                background: 'rgba(47, 111, 237, 0.09)',
                borderRadius: '100px',
                padding: '1px 10px',
              }}
            >
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(11.5),
                  lineHeight: '1.5em',
                  color: '#2F6FED',
                }}
              >
                {driver.fleet}
              </Typography>
            </Box>
          </Stack>
        </RowStack>
      </Box>

      {/* ── Section 2: Fleet & Vehicle info row ──────────────────────── */}
      <Stack sx={{ padding: '16px 20px', gap: '12px' }}>
        <Box
          sx={{
            background: '#F7F9FB',
            border: '0.67px solid #F0F2F5',
            borderRadius: '14px',
            padding: '0',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* Fleet Company */}
          <RowStack
            spacing={'10px'}
            sx={{ flex: 1, padding: '14px 16px' }}
          >
            <BusinessOutlinedIcon
              sx={{ fontSize: 13, color: '#9CA3AF' }}
            />
            <Stack spacing={0}>
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
                Fleet Company
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(13),
                  lineHeight: '1.5em',
                  color: '#2F6FED',
                }}
              >
                {driver.fleet}
              </Typography>
            </Stack>
          </RowStack>

          {/* Divider */}
          <Box
            sx={{
              width: '1px',
              height: '32px',
              background: '#E5E7EB',
              flexShrink: 0,
            }}
          />

          {/* Vehicle */}
          <RowStack
            spacing={'10px'}
            sx={{ flex: 1, padding: '14px 16px' }}
          >
            <DirectionsCarOutlinedIcon
              sx={{ fontSize: 13, color: '#9CA3AF' }}
            />
            <Stack spacing={0}>
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
                Vehicle
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(13),
                  lineHeight: '1.5em',
                  color: '#374151',
                }}
              >
                {driver.vehicle}
              </Typography>
            </Stack>
          </RowStack>
        </Box>

        {/* ── Phone & License row ──────────────────────────────────── */}
        <RowStack spacing={0} sx={{ width: '100%' }}>
          {/* Phone */}
          <Stack
            sx={{
              flex: 1,
              background: '#F7F9FB',
              borderRadius: '14px',
              padding: '10px 12px',
              gap: '2px',
            }}
          >
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
              Phone
            </Typography>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(12),
                lineHeight: '1.5em',
                color: '#374151',
              }}
            >
              {driver.phone}
            </Typography>
          </Stack>

          {/* License */}
          <Stack
            sx={{
              flex: 1,
              background: '#F7F9FB',
              borderRadius: '14px',
              padding: '10px 12px',
              gap: '2px',
            }}
          >
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
              License
            </Typography>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(12),
                lineHeight: '1.5em',
                color: '#374151',
              }}
            >
              {driver.license}
            </Typography>
          </Stack>
        </RowStack>

        {/* ── Capability Chips ─────────────────────────────────────── */}
        {driver.capabilities.length > 0 && (
          <RowStack spacing={'6px'} sx={{ flexWrap: 'wrap' }}>
            {driver.capabilities.map((cap) => (
              <Chip
                key={cap}
                icon={capabilityIcons[cap] as React.ReactElement || undefined}
                label={cap}
                size="small"
                sx={{
                  background: '#EEF3FF',
                  color: '#2F6FED',
                  border: '0.67px solid #C7D7F9',
                  borderRadius: '100px',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: pxToRem(11),
                  height: '22px',
                  '& .MuiChip-icon': {
                    marginLeft: '6px',
                    marginRight: '-2px',
                  },
                }}
              />
            ))}
          </RowStack>
        )}
      </Stack>

      {/* ── Section 3: Footer — Rating + Action Buttons ──────────────── */}
      <RowStack
        justifyContent={'space-between'}
        sx={{
          borderTop: '0.67px solid #F3F4F6',
          padding: '10px 20px',
          marginTop: 'auto',
        }}
      >
        {/* Rating + Trips */}
        <RowStack spacing={'8px'}>
          <StarIcon sx={{ fontSize: 16, color: '#F59E0B' }} />
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 700,
              fontSize: pxToRem(13),
              lineHeight: '1.5em',
              color: '#374151',
            }}
          >
            {driver.rating.toFixed(1)}
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
            · {driver.trips} trips
          </Typography>
        </RowStack>

        {/* Action Buttons */}
        <RowStack spacing={'6px'}>
          {/* Edit */}
          <Box
            onClick={() => onEdit?.(driver)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              background: '#EEF3FF',
              border: '0.67px solid #C7D7F9',
              borderRadius: '10px',
              cursor: 'pointer',
              '&:hover': { background: '#E0EBFF' },
            }}
          >
            <EditOutlinedIcon sx={{ fontSize: 11, color: '#2F6FED' }} />
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(12),
                lineHeight: '1.5em',
                color: '#2F6FED',
              }}
            >
              Edit
            </Typography>
          </Box>

          {/* Documents */}
          <Box
            onClick={() => onDocuments?.(driver)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              background: '#FFFFFF',
              border: '0.67px solid #E5E7EB',
              borderRadius: '10px',
              cursor: 'pointer',
              '&:hover': { background: '#F9FAFB' },
            }}
          >
            <DescriptionOutlinedIcon
              sx={{ fontSize: 11, color: '#374151' }}
            />
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(12),
                lineHeight: '1.5em',
                color: '#374151',
              }}
            >
              Documents
            </Typography>
          </Box>

          {/* Suspend */}
          <Box
            onClick={() => onSuspend?.(driver)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              background: '#FEF2F2',
              border: '0.67px solid #FECACA',
              borderRadius: '10px',
              cursor: 'pointer',
              '&:hover': { background: '#FEE2E2' },
            }}
          >
            <BlockOutlinedIcon sx={{ fontSize: 11, color: '#EF4444' }} />
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(12),
                lineHeight: '1.5em',
                color: '#EF4444',
              }}
            >
              Suspend
            </Typography>
          </Box>
        </RowStack>
      </RowStack>
    </Box>
  );
};
