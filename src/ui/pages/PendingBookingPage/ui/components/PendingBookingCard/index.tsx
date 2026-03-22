import { Box, Chip, IconButton, Stack, Typography } from '@mui/material';
import { RowStack, StyledImage } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { StaticImageData } from 'next/image';
import timeIcon from '../../assets/icons/time-icon.svg';
import riderIcon from '../../assets/icons/rider-icon.svg';
import locationIcon from '../../assets/icons/location-icon.svg';
import warningIcon from '../../assets/icons/warning-Icon.svg';

export type PendingBooking = {
  id: string;
  bookingId: string;
  vehicleType: string;
  vehicleTypeColor: string;
  vehicleTypeBg: string;
  serviceType: string;
  serviceTypeColor: string;
  serviceTypeBg: string;
  serviceIcon?: boolean;
  waitTime: string;
  chipIcon?: StaticImageData | null;
  patientName: string;
  patientAge: number;
  patientPhone: string;
  pickup: string;
  destination: string;
  dateTime: string;
  specialNote?: string;
};

type PendingBookingCardProps = {
  booking: PendingBooking;
  onViewDetail: () => void;
  onAssignDriver: () => void;
};

export const PendingBookingCard = ({
  booking,
  onViewDetail,
  onAssignDriver,
}: PendingBookingCardProps) => {
  return (
    <Stack
      sx={{
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '21px',
        border: '0.67px solid #EAECF0',
      }}
    >
      <RowStack spacing={'16px'} alignItems="flex-start">
        {/* Clock Icon */}
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: '14px',
            background: '#FFFBEB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <StyledImage src={timeIcon} alt="time" width={20} height={20} />
        </Box>

        {/* Content */}
        <Stack spacing={'6px'} sx={{ flex: 1 }}>
          {/* Top row: Booking ID + pills + wait time */}
          <RowStack spacing={'8px'} flexWrap="wrap">
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 700,
                fontSize: pxToRem(14),
                color: (theme) => theme.color.deepBlue,
              }}
            >
              {booking.bookingId}
            </Typography>
            <Chip
              label={booking.vehicleType}
              size="small"
              sx={{
                background: booking.vehicleTypeBg,
                color: booking.vehicleTypeColor,
                fontSize: pxToRem(11.5),
                fontWeight: 600,
                height: '22px',
                borderRadius: '11px',
              }}
            />
            <Chip
              label={booking.serviceType}
              size="small"
              icon={
                booking.chipIcon ? (
                  <StyledImage
                    src={booking.chipIcon}
                    alt="chip-icon"
                    sx={{
                      width: '11px',
                      height: '11px',
                    }}
                  />
                ) : null
              }
              sx={{
                background: booking.serviceTypeBg,
                color: booking.serviceTypeColor,
                fontSize: pxToRem(11),
                fontWeight: 600,
                height: '22px',
                borderRadius: '11px',
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
              Waiting: {booking.waitTime}
            </Typography>
          </RowStack>

          {/* Patient info */}
          <RowStack spacing={'8px'}>
            <StyledImage src={riderIcon} alt="rider" width={13} height={13} />
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(13),
                color: (theme) => theme.color.grey,
              }}
            >
              {booking.patientName}
            </Typography>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(12),
                color: (theme) => theme.color.lightGrey,
              }}
            >
              · Age {booking.patientAge} · {booking.patientPhone}
            </Typography>
          </RowStack>

          {/* Route */}
          <RowStack spacing={'8px'}>
            <StyledImage
              src={locationIcon}
              alt="location"
              width={13}
              height={13}
            />
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(13),
                color: (theme) => theme.color.lightGrey,
              }}
            >
              {booking.pickup} → {booking.destination}
            </Typography>
          </RowStack>

          {/* Date/Time */}
          <RowStack spacing={'8px'}>
            <StyledImage src={timeIcon} alt="date" width={13} height={13} />
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(13),
                color: (theme) => theme.color.lightGrey,
              }}
            >
              {booking.dateTime}
            </Typography>
          </RowStack>

          {/* Special Note */}
          {booking.specialNote && (
            <RowStack spacing={'6px'}>
              <StyledImage
                src={warningIcon}
                alt="warning"
                width={12}
                height={12}
              />
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12),
                  color: '#D97706',
                }}
              >
                {booking.specialNote}
              </Typography>
            </RowStack>
          )}
        </Stack>

        {/* Action Buttons */}
        <RowStack spacing={'4px'} sx={{ flexShrink: 0 }}>
          <IconButton
            onClick={onAssignDriver}
            sx={{
              width: 30,
              height: 30,
              borderRadius: '7px',
              // border: '0.67px solid #E5E7EB',
              background: '#FFFFFF',
            }}
          >
            <PersonAddAltOutlinedIcon sx={{ fontSize: 15, color: '#9CA3AF' }} />
          </IconButton>
          <IconButton
            onClick={onViewDetail}
            sx={{
              width: 30,
              height: 30,
              borderRadius: '7px',
              // border: '0.67px solid #E5E7EB',
              background: '#FFFFFF',
            }}
          >
            <VisibilityOutlinedIcon sx={{ fontSize: 15, color: '#9CA3AF' }} />
          </IconButton>
        </RowStack>
      </RowStack>
    </Stack>
  );
};
