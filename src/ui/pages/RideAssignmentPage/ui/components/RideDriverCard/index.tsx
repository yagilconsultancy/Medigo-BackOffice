import { Box, Stack, Typography } from '@mui/material';
import { AppButton, RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';

export type RideDriver = {
  id: string;
  initials: string;
  initialsColor: string;
  name: string;
  vehicle: string;
  rating: number;
  trips: number;
  distance: string;
  eta: string;
};

type RideDriverCardProps = {
  driver: RideDriver;
  isActive: boolean;
  onAssign: () => void;
};

export const RideDriverCard = ({
  driver,
  isActive,
  onAssign,
}: RideDriverCardProps) => {
  return (
    <RowStack
      spacing={'12px'}
      sx={{
        background: '#F7F9FB',
        borderRadius: '12px',
        padding: '14px 16px',
        transition: 'all 0.15s',
      }}
    >
      {/* Avatar */}
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: driver.initialsColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(12),
            color: '#FFFFFF',
          }}
        >
          {driver.initials}
        </Typography>
      </Box>

      {/* Info */}
      <Stack sx={{ flex: 1 }} spacing={'2px'}>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(13),
            color: (theme) => theme.color.deepBlue,
          }}
        >
          {driver.name}
        </Typography>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(11.5),
            color: (theme) => theme.color.lightGrey,
          }}
        >
          {driver.vehicle}
        </Typography>
        <RowStack spacing={'8px'}>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(11),
              color: '#F59E0B',
            }}
          >
            ★ {driver.rating}
          </Typography>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(11),
              color: (theme) => theme.color.lightGrey,
            }}
          >
            {driver.distance} away
          </Typography>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(11),
              color: (theme) => theme.color.lightGrey,
            }}
          >
            ETA {driver.eta}
          </Typography>
        </RowStack>
      </Stack>

      {/* Assign Button */}
      <AppButton
        onClick={isActive ? onAssign : undefined}
        sx={{
          background: isActive
            ? (theme) => theme.palette.primary.main
            : 'transparent',
          color: isActive ? '#FFFFFF' : (theme) => theme.color.lightGrey,
          border: isActive ? 'none' : '1px solid #D1D5DB',
          fontWeight: 600,
          fontSize: pxToRem(12),
          borderRadius: '8px',
          padding: '6px 16px',
          minWidth: 'auto',
          flexShrink: 0,
          cursor: isActive ? 'pointer' : 'default',
          opacity: isActive ? 1 : 0.6,
          '&:hover': isActive
            ? { background: '#2563EB' }
            : { background: 'transparent' },
        }}
      >
        Assign
      </AppButton>
    </RowStack>
  );
};
