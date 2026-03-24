import { Box, Stack, Typography } from '@mui/material';
import { RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';

export type TripRoute = {
  tripId: string;
  origin: string;
  destination: string;
  timeRange: string;
  distanceDuration: string;
  riderName: string;
};

export type DriverRoute = {
  id: string;
  driverName: string;
  driverInitials: string;
  driverColor: string;
  driverAvatar?: string;
  date: string;
  tripCount: number;
  totalDistance: string;
  trips: TripRoute[];
};

type DriverRouteCardProps = {
  driver: DriverRoute;
};

export const DriverRouteCard = ({ driver }: DriverRouteCardProps) => {
  return (
    <Stack
      sx={{
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '0.67px solid #F0F4F8',
        boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
        overflow: 'hidden',
      }}
    >
      {/* Driver Header */}
      <RowStack
        sx={{
          padding: '16px 20px',
          background: `${driver.driverColor}08`,
          borderBottom: '0.67px solid #F0F4F8',
        }}
      >
        {/* Avatar */}
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: driver.driverColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginRight: '12px',
          }}
        >
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 700,
              fontSize: pxToRem(12),
              color: '#FFFFFF',
              lineHeight: 1,
            }}
          >
            {driver.driverInitials}
          </Typography>
        </Box>

        {/* Driver Info */}
        <Stack spacing={'2px'} sx={{ flex: 1 }}>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 700,
              fontSize: pxToRem(14),
              color: '#111827',
            }}
          >
            {driver.driverName}
          </Typography>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(12),
              color: '#9CA3AF',
            }}
          >
            {driver.date} · {driver.tripCount} trip
            {driver.tripCount !== 1 ? 's' : ''}
          </Typography>
        </Stack>

        {/* Total Distance */}
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(13),
            color: driver.driverColor,
          }}
        >
          {driver.totalDistance} total
        </Typography>
      </RowStack>

      {/* Trip Rows */}
      <Stack>
        {driver.trips.map((trip, index) => (
          <TripRow
            key={trip.tripId}
            trip={trip}
            isLast={index === driver.trips.length - 1}
          />
        ))}
      </Stack>
    </Stack>
  );
};

// ─── Trip Row ────────────────────────────────────────────────────────────────

const TripRow = ({ trip, isLast }: { trip: TripRoute; isLast: boolean }) => (
  <RowStack
    sx={{
      padding: '16px 20px',
      borderBottom: isLast ? 'none' : '0.67px solid #F7F9FB',
      alignItems: 'stretch',
    }}
  >
    {/* Route Timeline Indicator */}
    <Stack
      sx={{
        alignItems: 'center',
        marginRight: '12px',
        paddingTop: '3px',
      }}
    >
      {/* Green origin dot */}
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#10B981',
          flexShrink: 0,
        }}
      />
      {/* Connecting line */}
      <Box
        sx={{
          width: 0,
          flex: 1,
          borderLeft: '1.5px solid #E8ECF0',
          minHeight: '20px',
        }}
      />
      {/* Red destination dot */}
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#EF4444',
          flexShrink: 0,
        }}
      />
    </Stack>

    {/* Addresses */}
    <Stack spacing={'16px'} sx={{ flex: 1 }}>
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 400,
          fontSize: pxToRem(12.5),
          color: '#374151',
        }}
      >
        {trip.origin}
      </Typography>
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 400,
          fontSize: pxToRem(12.5),
          color: '#374151',
        }}
      >
        {trip.destination}
      </Typography>
    </Stack>

    {/* Time & Distance */}
    <Stack
      spacing={'16px'}
      sx={{ alignItems: 'flex-end', marginRight: '20px' }}
    >
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 400,
          fontSize: pxToRem(12),
          color: '#9CA3AF',
        }}
      >
        {trip.timeRange}
      </Typography>
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 400,
          fontSize: pxToRem(12.5),
          color: '#374151',
        }}
      >
        {trip.distanceDuration}
      </Typography>
    </Stack>

    {/* Trip ID & Rider */}
    <Stack spacing={'16px'} sx={{ alignItems: 'flex-end', minWidth: '130px' }}>
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 400,
          fontSize: pxToRem(12),
          color: '#9CA3AF',
        }}
      >
        {trip.tripId}
      </Typography>
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 400,
          fontSize: pxToRem(12),
          color: '#9CA3AF',
        }}
      >
        Rider: {trip.riderName}
      </Typography>
    </Stack>
  </RowStack>
);
