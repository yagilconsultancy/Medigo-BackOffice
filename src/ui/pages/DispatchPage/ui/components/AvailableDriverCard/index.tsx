import { Box, Chip, Stack, Typography } from '@mui/material';
import { RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';

export type AvailableDriver = {
  id: string;
  initials: string;
  initialsColor: string;
  name: string;
  vehicle: string;
  rating: number;
  trips: number;
  distance: string;
  eta: string;
  status: 'Available' | 'On Break';
  avatar?: string;
};

type AvailableDriverCardProps = {
  driver: AvailableDriver;
};

export const AvailableDriverCard = ({ driver }: AvailableDriverCardProps) => {
  const statusColor = driver.status === 'Available' ? '#059669' : '#D97706';
  const statusBg = driver.status === 'Available' ? '#ECFDF5' : '#FFFBEB';

  return (
    <RowStack
      spacing={'12px'}
      sx={{
        padding: '14px 0',
        borderBottom: '0.67px solid #F3F4F6',
        '&:last-child': { borderBottom: 'none' },
      }}
    >
      {/* Avatar */}
      <Box
        sx={{
          width: 36,
          height: 36,
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
            fontSize: pxToRem(11.5),
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
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(11),
            color: (theme) => theme.color.lightGrey,
          }}
        >
          <Typography
            component="span"
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(11),
              color: '#F59E0B',
            }}
          >
            ★ {driver.rating}
          </Typography>
          {' · '}
          {driver.trips} trips{' · '}
          {driver.distance}
        </Typography>
      </Stack>

      {/* Status + ETA */}
      <Stack alignItems="flex-end" spacing={'4px'} sx={{ flexShrink: 0 }}>
        <Chip
          label={driver.status}
          size="small"
          sx={{
            background: statusBg,
            color: statusColor,
            fontSize: pxToRem(10.5),
            fontWeight: 600,
            height: '20px',
            borderRadius: '10px',
          }}
        />
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(10.5),
            color: (theme) => theme.color.lightGrey,
          }}
        >
          ETA {driver.eta}
        </Typography>
      </Stack>
    </RowStack>
  );
};
