import { Box, Chip, Stack, Typography } from '@mui/material';
import { AppButton, RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import RepeatOutlinedIcon from '@mui/icons-material/RepeatOutlined';

export type ScheduledTrip = {
  id: string;
  patientName: string;
  bookingId: string;
  vehicleType: string;
  vehicleTypeColor: string;
  vehicleTypeBg: string;
  recurrence?: string;
  dateTime: string;
  route: string;
  driverName: string | null;
  onAssign?: () => void;
};

type ScheduledTripRowProps = {
  trip: ScheduledTrip;
  isLast?: boolean;
};

export const ScheduledTripRow = ({ trip, isLast }: ScheduledTripRowProps) => {
  const isUnassigned = !trip.driverName;

  return (
    <RowStack
      spacing={'20px'}
      sx={{
        padding: '16px 24px',
        borderBottom: isLast ? 'none' : '0.67px solid #F3F4F6',
      }}
    >
      {/* Calendar Icon */}
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: '14px',
          background: '#EBF2FF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <CalendarTodayOutlinedIcon sx={{ fontSize: 20, color: '#2F6FED' }} />
      </Box>

      {/* Content */}
      <Stack spacing={'4px'} sx={{ flex: 1 }}>
        {/* Top line: Name + Booking ID + Badges */}
        <RowStack spacing={'8px'} flexWrap="wrap">
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 700,
              fontSize: pxToRem(13.5),
              color: (theme) => theme.color.deepBlue,
            }}
          >
            {trip.patientName}
          </Typography>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(12),
              color: (theme) => theme.color.lightGrey,
            }}
          >
            · {trip.bookingId}
          </Typography>
          <Chip
            label={trip.vehicleType}
            size="small"
            sx={{
              background: trip.vehicleTypeBg,
              color: trip.vehicleTypeColor,
              fontSize: pxToRem(11.5),
              fontWeight: 600,
              height: '22px',
              borderRadius: '11px',
            }}
          />
          {trip.recurrence && (
            <Chip
              icon={
                <RepeatOutlinedIcon
                  sx={{ fontSize: 11, color: '#6366F1 !important' }}
                />
              }
              label={trip.recurrence}
              size="small"
              sx={{
                background: '#EEF2FF',
                color: '#6366F1',
                fontSize: pxToRem(11),
                fontWeight: 600,
                height: '22px',
                borderRadius: '11px',
              }}
            />
          )}
        </RowStack>

        {/* Bottom line: Date/Time + Route */}
        <RowStack spacing={'16px'}>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(12.5),
              color: (theme) => theme.color.lightGrey,
            }}
          >
            {trip.dateTime}
          </Typography>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(12.5),
              color: (theme) => theme.color.lightGrey,
            }}
          >
            {trip.route}
          </Typography>
        </RowStack>
      </Stack>

      {/* Driver Assignment */}
      <Stack alignItems="flex-end" sx={{ flexShrink: 0 }}>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(11),
            color: (theme) => theme.color.lightGrey,
          }}
        >
          Driver
        </Typography>
        {isUnassigned ? (
          <Stack spacing={'4px'} alignItems="flex-end">
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(13),
                color: '#F59E0B',
              }}
            >
              Unassigned
            </Typography>
            <AppButton
              onClick={trip.onAssign}
              sx={{
                background: '#2F6FED',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: pxToRem(12),
                borderRadius: '8px',
                padding: '6px 16px',
                minWidth: 'auto',
                '&:hover': {
                  background: '#2563EB',
                },
              }}
            >
              Assign
            </AppButton>
          </Stack>
        ) : (
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(13),
              color: (theme) => theme.color.grey,
            }}
          >
            {trip.driverName}
          </Typography>
        )}
      </Stack>
    </RowStack>
  );
};
