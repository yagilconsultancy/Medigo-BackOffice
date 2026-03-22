import { Chip, Stack, Typography } from '@mui/material';
import { RowStack, StyledImage } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import pickupIcon from '../../../../DispatchPage/ui/assets/icons/pickup-icon.svg';
import destinationIcon from '../../../../DispatchPage/ui/assets/icons/destination-icon.svg';

export type UnassignedRide = {
  id: string;
  bookingId: string;
  bookingIdColor: string;
  bookingIdBg: string;
  patientName: string;
  pickup: string;
  destination: string;
  time: string;
  distance: string;
  specialNote?: string;
  specialNoteBg?: string;
  specialNoteColor?: string;
  assignedDriver?: string;
};

type UnassignedRideCardProps = {
  ride: UnassignedRide;
  isSelected: boolean;
  onClick: () => void;
};

export const UnassignedRideCard = ({
  ride,
  isSelected,
  onClick,
}: UnassignedRideCardProps) => {
  const isAssigned = !!ride.assignedDriver;

  return (
    <Stack
      spacing={'10px'}
      onClick={!isAssigned ? onClick : undefined}
      sx={{
        background: isSelected ? '#F7F9FB' : '#FFFFFF',
        borderRadius: '14px',
        padding: '16px',
        border: isSelected ? '1.5px solid #2F6FED' : '0.67px solid #EAECF0',
        cursor: isAssigned ? 'default' : 'pointer',
        transition: 'all 0.15s',
        '&:hover': !isAssigned
          ? {
              borderColor: isSelected ? '#2F6FED' : '#D1D5DB',
            }
          : {},
      }}
    >
      {/* Top: Booking ID chip + Special Note chip + Assigned chip */}
      <RowStack spacing={'8px'} flexWrap="wrap">
        <Chip
          label={ride.bookingId}
          size="small"
          sx={{
            background: ride.bookingIdBg,
            color: ride.bookingIdColor,
            fontSize: pxToRem(11),
            fontWeight: 700,
            height: '22px',
            borderRadius: '6px',
          }}
        />
        {ride.specialNote && (
          <Chip
            label={ride.specialNote}
            size="small"
            sx={{
              background: ride.specialNoteBg || '#FFFBEB',
              color: ride.specialNoteColor || '#D97706',
              fontSize: pxToRem(10.5),
              fontWeight: 600,
              height: '22px',
              borderRadius: '6px',
            }}
          />
        )}
        {isAssigned && (
          <Chip
            label="Assigned"
            size="small"
            sx={{
              background: '#ECFDF5',
              color: '#059669',
              fontSize: pxToRem(10.5),
              fontWeight: 600,
              height: '22px',
              borderRadius: '6px',
              marginLeft: 'auto !important',
            }}
          />
        )}
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
        {ride.patientName}
      </Typography>

      {/* Assigned Driver text */}
      {isAssigned && (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 500,
            fontSize: pxToRem(12),
            color: '#059669',
          }}
        >
          Assigned to {ride.assignedDriver}
        </Typography>
      )}

      {/* Route */}
      <Stack spacing={'4px'}>
        <RowStack spacing={'6px'}>
          <StyledImage src={pickupIcon} alt="pickup" width={12} height={12} />
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(12),
              color: (theme) => theme.color.lightGrey,
            }}
          >
            {ride.pickup}
          </Typography>
        </RowStack>
        <RowStack spacing={'6px'}>
          <StyledImage
            src={destinationIcon}
            alt="destination"
            width={12}
            height={12}
          />
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(12),
              color: (theme) => theme.color.lightGrey,
            }}
          >
            {ride.destination}
          </Typography>
        </RowStack>
      </Stack>

      {/* Time + Distance */}
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 400,
          fontSize: pxToRem(11.5),
          color: (theme) => theme.color.lightGrey,
        }}
      >
        {ride.time} · {ride.distance}
      </Typography>
    </Stack>
  );
};
