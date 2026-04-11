'use client';

import { Box, Chip, Divider, Stack, Switch, Typography } from '@mui/material';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type RideTypeCardProps = {
  name: string;
  description: string;
  isActive: boolean;
  baseFare: number;
  perKm: number;
  perMin: number;
  minFare: number;
  onToggle?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

// ─── Pricing Stat ────────────────────────────────────────────────────────────

const PricingStat = ({ label, value }: { label: string; value: string }) => (
  <Stack spacing={'4px'} sx={{ flex: 1, padding: '12px 16px' }}>
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 500,
        fontSize: pxToRem(11.5),
        color: '#9CA3AF',
        lineHeight: '1.5em',
      }}
    >
      {label}
    </Typography>
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 700,
        fontSize: pxToRem(14),
        color: '#2F6FED',
        lineHeight: '1.4em',
      }}
    >
      {value}
    </Typography>
  </Stack>
);

// ─── Component ──────────────────────────────────────────────────────────────

export const RideTypeCard = ({
  name,
  description,
  isActive,
  baseFare,
  perKm,
  perMin,
  minFare,
  onToggle,
  onEdit,
  onDelete,
}: RideTypeCardProps) => {
  return (
    <Stack
      sx={{
        background: '#FFFFFF',
        border: '0.67px solid #F0F4F8',
        borderRadius: '16px',
        overflow: 'hidden',
      }}
    >
      {/* Top Row: Ride Info + Controls */}
      <RowStack
        justifyContent={'space-between'}
        sx={{ padding: '20px', width: '100%' }}
      >
        {/* Ride Info */}
        <RowStack spacing={'14px'} sx={{ flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: '#EDE9FE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <DirectionsCarOutlinedIcon
              sx={{ fontSize: 22, color: '#7C3AED' }}
            />
          </Box>
          <Stack spacing={'2px'} sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 700,
                fontSize: pxToRem(14),
                color: '#111827',
                lineHeight: '1.4em',
              }}
            >
              {name}
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
              {description}
            </Typography>
          </Stack>
        </RowStack>

        {/* Controls */}
        <RowStack spacing={'10px'} sx={{ flexShrink: 0, ml: '16px' }}>
          <Chip
            label={isActive ? 'Active' : 'Inactive'}
            size="small"
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(11.5),
              height: 26,
              borderRadius: '8px',
              ...(isActive
                ? {
                    background: '#ECFDF5',
                    color: '#059669',
                  }
                : {
                    background: '#F3F4F6',
                    color: '#9CA3AF',
                  }),
            }}
          />
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
          <Box
            onClick={onDelete}
            sx={{
              width: 32,
              height: 32,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              '&:hover': { background: '#FEF2F2' },
            }}
          >
            <DeleteOutlineIcon sx={{ fontSize: 18, color: '#EF4444' }} />
          </Box>
        </RowStack>
      </RowStack>

      {/* Pricing Row */}
      <RowStack
        divider={
          <Divider
            orientation="vertical"
            flexItem
            sx={{ borderColor: '#F0F4F8' }}
          />
        }
        sx={{
          borderTop: '0.67px solid #F0F4F8',
        }}
      >
        <PricingStat label="Base Fare" value={`$${baseFare.toFixed(2)}`} />
        <PricingStat label="Per km" value={`$${perKm.toFixed(2)}`} />
        <PricingStat label="Per min" value={`$${perMin.toFixed(2)}`} />
        <PricingStat label="Min Fare" value={`$${minFare.toFixed(2)}`} />
      </RowStack>
    </Stack>
  );
};
