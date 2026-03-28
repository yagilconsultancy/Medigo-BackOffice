'use client';

import { Box, Stack, Switch, Typography } from '@mui/material';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type CityServiceCardProps = {
  cityName: string;
  serviceZones: number;
  isActive: boolean;
  drivers?: number;
  riders?: number;
  totalTrips?: number;
  onToggle?: () => void;
  onEdit?: () => void;
};

// ─── Stat Mini Card ─────────────────────────────────────────────────────────

const StatMiniCard = ({
  value,
  label,
}: {
  value: string;
  label: string;
}) => (
  <Stack
    alignItems={'center'}
    justifyContent={'center'}
    sx={{
      flex: 1,
      background: '#FFFFFF',
      borderRadius: '12px',
      border: '0.67px solid #F0F4F8',
      padding: '12px 8px',
    }}
  >
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 700,
        fontSize: pxToRem(16),
        color: '#2F6FED',
        lineHeight: '1.3em',
      }}
    >
      {value}
    </Typography>
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 500,
        fontSize: pxToRem(12),
        color: '#6B7280',
        lineHeight: '1.5em',
        marginTop: '2px',
      }}
    >
      {label}
    </Typography>
  </Stack>
);

// ─── Component ──────────────────────────────────────────────────────────────

export const CityServiceCard = ({
  cityName,
  serviceZones,
  isActive,
  drivers,
  riders,
  totalTrips,
  onToggle,
  onEdit,
}: CityServiceCardProps) => {
  return (
    <Stack
      spacing={'12px'}
      sx={{
        background: '#F3F4F6',
        border: '0.67px solid #F0F4F8',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: isActive
          ? '0px 1px 4px 0px rgba(0, 0, 0, 0.06)'
          : 'none',
      }}
    >
      {/* Top Row: City Info + Controls */}
      <RowStack
        justifyContent={'space-between'}
        sx={{ width: '100%' }}
      >
        {/* City Info */}
        <RowStack spacing={'12px'}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: '#EBF2FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <LocationOnOutlinedIcon
              sx={{ fontSize: 20, color: '#2F6FED' }}
            />
          </Box>
          <Stack spacing={'2px'}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(14),
                color: '#111827',
                lineHeight: '1.4em',
              }}
            >
              {cityName}
            </Typography>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(12.5),
                color: '#6B7280',
                lineHeight: '1.5em',
              }}
            >
              {serviceZones} service zone{serviceZones !== 1 ? 's' : ''}
            </Typography>
          </Stack>
        </RowStack>

        {/* Controls */}
        <RowStack spacing={'8px'}>
          <Switch
            checked={isActive}
            onChange={onToggle}
            sx={{
              width: 42,
              height: 26,
              padding: 0,
              '& .MuiSwitch-switchBase': {
                padding: 0,
                margin: '2px',
                transitionDuration: '300ms',
                '&.Mui-checked': {
                  transform: 'translateX(16px)',
                  color: '#fff',
                  '& + .MuiSwitch-track': {
                    backgroundColor: '#2F6FED',
                    opacity: 1,
                    border: 0,
                  },
                },
                '&.Mui-focusVisible .MuiSwitch-thumb': {
                  color: '#2F6FED',
                  border: '6px solid #fff',
                },
              },
              '& .MuiSwitch-thumb': {
                boxSizing: 'border-box',
                width: 22,
                height: 22,
              },
              '& .MuiSwitch-track': {
                borderRadius: 26 / 2,
                backgroundColor: '#D1D5DB',
                opacity: 1,
              },
            }}
          />
          <Box
            onClick={onEdit}
            sx={{
              width: 32,
              height: 32,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              '&:hover': { background: '#F0F4F8' },
            }}
          >
            <EditOutlinedIcon sx={{ fontSize: 18, color: '#9CA3AF' }} />
          </Box>
        </RowStack>
      </RowStack>

      {/* Stats Row or Inactive Message */}
      {isActive ? (
        <RowStack spacing={'12px'}>
          <StatMiniCard
            value={drivers?.toLocaleString() ?? '0'}
            label="Drivers"
          />
          <StatMiniCard
            value={riders?.toLocaleString() ?? '0'}
            label="Riders"
          />
          <StatMiniCard
            value={totalTrips?.toLocaleString() ?? '0'}
            label="Total Trips"
          />
        </RowStack>
      ) : (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(12.5),
            color: '#9CA3AF',
            lineHeight: '1.5em',
            fontStyle: 'italic',
          }}
        >
          City is currently inactive — no active drivers or riders
        </Typography>
      )}
    </Stack>
  );
};
