import { Box, Chip, LinearProgress, Stack, Typography } from '@mui/material';
import { RowStack, StyledImage } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import speedIcon from '../../assets/icons/speed-icon.svg';

export type ActiveTrip = {
  id: string;
  tripId: string;
  status: 'In Transit' | 'Arriving' | 'Loading';
  statusColor: string;
  statusBg: string;
  eta: string;
  patientName: string;
  driverName: string;
  driverInitials: string;
  driverInitialsColor: string;
  speed: string;
  progress: number;
};

type ActiveTripCardProps = {
  trip: ActiveTrip;
  isSelected?: boolean;
  onClick?: () => void;
};

export const ActiveTripCard = ({
  trip,
  isSelected,
  onClick,
}: ActiveTripCardProps) => {
  return (
    <RowStack
      spacing={'14px'}
      onClick={onClick}
      sx={{
        padding: '14px 16px',
        borderLeft: isSelected
          ? `3px solid ${trip.driverInitialsColor}`
          : 'none',
        borderBottom: '0.67px solid #F3F4F6',
        cursor: 'pointer',
        background: isSelected ? '#F7F9FB' : 'transparent',
        transition: 'background 0.15s',
        '&:hover': {
          background: '#F7F9FB',
        },
      }}
    >
      {/* Avatar */}
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: trip.driverInitialsColor,
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
          {trip.driverInitials}
        </Typography>
      </Box>

      {/* Content */}
      <Stack spacing={'6px'} sx={{ flex: 1 }}>
        {/* Top: Trip ID + Status + ETA */}
        <RowStack spacing={'8px'}>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 700,
              fontSize: pxToRem(12.5),
              color: (theme) => theme.color.deepBlue,
            }}
          >
            {trip.tripId}
          </Typography>
          <Chip
            label={trip.status}
            size="small"
            sx={{
              background: trip.statusBg,
              color: trip.statusColor,
              fontSize: pxToRem(10),
              fontWeight: 600,
              height: '18px',
              borderRadius: '9px',
            }}
          />
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(11),
              color: (theme) => theme.color.lightGrey,
              marginLeft: 'auto !important',
            }}
          >
            {trip.eta}
          </Typography>
        </RowStack>

        {/* Patient + Driver */}
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(12.5),
            color: (theme) => theme.color.deepBlue,
          }}
        >
          {trip.patientName}
        </Typography>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(11.5),
            color: (theme) => theme.color.lightGrey,
          }}
        >
          ↳ {trip.driverName}
        </Typography>

        {/* Speed */}
        <RowStack spacing={'4px'}>
          <StyledImage src={speedIcon} alt="speed" width={11} height={11} />
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(11),
              color: (theme) => theme.color.lightGrey,
            }}
          >
            {trip.speed}
          </Typography>
        </RowStack>

        {/* Progress */}
        <Stack spacing={'4px'}>
          <LinearProgress
            variant="determinate"
            value={trip.progress}
            sx={{
              height: 4,
              borderRadius: 2,
              backgroundColor: '#E5E7EB',
              '& .MuiLinearProgress-bar': {
                borderRadius: 2,
                backgroundColor: trip.statusColor,
              },
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
            {trip.progress}% complete
          </Typography>
        </Stack>
      </Stack>
    </RowStack>
  );
};
