import { Box, Chip, Stack, Typography } from '@mui/material';
import {
  AppButton,
  RowStack,
  StyledImage,
} from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import userGroupIcon from '../../assets/icons/assigndriver-Icon.svg';

export type DispatchBooking = {
  id: string;
  bookingId: string;
  patientName: string;
  time: string;
  pickup: string;
  destination: string;
  specialNote?: string;
  specialNoteType?: 'wheelchair' | 'careAssistant' | 'oxygen';
  assignedDriver?: string;
  status?: 'urgent' | 'standard';
};

type DispatchBookingCardProps = {
  booking: DispatchBooking;
  onAssignDriver: () => void;
};

export const DispatchBookingCard = ({
  booking,
  onAssignDriver,
}: DispatchBookingCardProps) => {
  const isAssigned = !!booking.assignedDriver;
  const needsCareAssistant = booking.specialNoteType === 'careAssistant';

  return (
    <Stack
      spacing={'12px'}
      sx={{
        background: '#FFFFFF',
        borderRadius: '14px',
        padding: '16px',
        border: '0.67px solid #EAECF0',
      }}
    >
      {/* Header: Booking ID + Status + Time */}
      <RowStack justifyContent="space-between">
        <RowStack spacing={'8px'}>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 700,
              fontSize: pxToRem(13),
              color: '#2F6FED',
            }}
          >
            {booking.bookingId}
          </Typography>
          {booking.status === 'urgent' && (
            <Chip
              label="Urgent"
              size="small"
              sx={{
                background: '#FEF2F2',
                color: '#EF4444',
                fontSize: pxToRem(10.5),
                fontWeight: 600,
                height: '20px',
                borderRadius: '10px',
              }}
            />
          )}
          {booking.status === 'standard' && (
            <Chip
              label="Standard"
              size="small"
              sx={{
                background: '#EBF2FF',
                color: '#2F6FED',
                fontSize: pxToRem(10.5),
                fontWeight: 600,
                height: '20px',
                borderRadius: '10px',
              }}
            />
          )}
        </RowStack>
        <RowStack spacing={'4px'}>
          <AccessTimeOutlinedIcon
            sx={{ fontSize: 14, color: (theme) => theme.color.lightGrey }}
          />
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(12),
              color: (theme) => theme.color.lightGrey,
            }}
          >
            {booking.time}
          </Typography>
        </RowStack>
      </RowStack>

      {/* Patient Name */}
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 600,
          fontSize: pxToRem(14),
          color: (theme) => theme.color.deepBlue,
        }}
      >
        {booking.patientName}
      </Typography>

      {/* Route */}
      <Stack spacing={'6px'}>
        <RowStack spacing={'8px'}>
          <Box
            sx={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              border: '1.5px solid #9CA3AF',
              flexShrink: 0,
            }}
          />
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(12),
              color: (theme) => theme.color.lightGrey,
            }}
          >
            {booking.pickup}
          </Typography>
        </RowStack>
        <RowStack spacing={'8px'}>
          <Box
            sx={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#374151',
              flexShrink: 0,
            }}
          />
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(12),
              color: (theme) => theme.color.lightGrey,
            }}
          >
            {booking.destination}
          </Typography>
        </RowStack>
      </Stack>

      {/* Special Note */}
      {booking.specialNote && (
        <RowStack
          spacing={'6px'}
          sx={{
            background: '#FFFBEB',
            borderRadius: '8px',
            padding: '8px 12px',
          }}
        >
          <WarningAmberRoundedIcon sx={{ fontSize: 14, color: '#D97706' }} />
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 500,
              fontSize: pxToRem(11.5),
              color: '#D97706',
            }}
          >
            {booking.specialNote}
          </Typography>
        </RowStack>
      )}

      {/* Assigned Driver or Assign Button */}
      {isAssigned ? (
        <RowStack
          spacing={'8px'}
          sx={{
            background: '#F0FDF4',
            borderRadius: '10px',
            padding: '10px 14px',
          }}
        >
          <PersonAddAltOutlinedIcon sx={{ fontSize: 16, color: '#059669' }} />
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(12.5),
              color: '#059669',
            }}
          >
            {booking.assignedDriver}
          </Typography>
          <Chip
            label="Booking"
            size="small"
            sx={{
              background: '#DCFCE7',
              color: '#059669',
              fontSize: pxToRem(10),
              fontWeight: 600,
              height: '18px',
              borderRadius: '9px',
              marginLeft: 'auto !important',
            }}
          />
        </RowStack>
      ) : (
        <AppButton
          fullWidth
          onClick={onAssignDriver}
          sx={{
            background: (theme) => theme.palette.primary.main,
            color: '#FFFFFF',
            fontWeight: 600,
            fontSize: pxToRem(12.5),
            borderRadius: '10px',
            padding: '10px 16px',
            '&:hover': {
              background: '#2563EB',
            },
          }}
          startIcon={
            <StyledImage
              src={userGroupIcon}
              alt="assign-driver"
              sx={{
                width: '13px',
                height: '13px',
              }}
            />
          }
        >
          {needsCareAssistant
            ? 'Assign Driver + Care Assistant'
            : 'Assign Driver'}
        </AppButton>
      )}
    </Stack>
  );
};
