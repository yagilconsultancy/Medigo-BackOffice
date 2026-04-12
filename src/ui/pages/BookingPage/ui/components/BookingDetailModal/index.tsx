import { alpha, IconButton, Stack, Typography, useTheme } from '@mui/material';
import {
  AppButton,
  AppModal,
  RowStack,
  StyledImage,
} from '../../../../../modules/components';
import { BookingIdComponent } from '../BookingIdComponent';
import { StatusComponent } from '../StatusComponent';
import { pxToRem } from '../../../../../../common';
import CloseIcon from '@mui/icons-material/Close';
import { BoxDetailComponent } from '../BoxDetailComponent';
import patientIcon from '../../assets/icons/patient-Icon.svg';
import destinationIcon from '../../assets/icons/destination-Icon.jpg';
import dateIcon from '../../assets/icons/date-Icon.svg';
import pickupIcon from '../../assets/icons/pickup-Icon.svg';
import warningIcon from '../../assets/icons/warning-Icon.svg';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useRouter } from 'next/navigation';
import { BookingRow } from '../../..';

type BookingDetailtModalProps = {
  open: boolean;
  handleClose: () => void;
  bookingId: string;
  rideId: string;
  status: BookingRow['status'];
  patientName: string;
  phoneNum?: string;
  dateTime: string;
  pickup: string;
  destination: string;
  specialRequirements?: string;
  onApprove?: () => void;
  onDecline?: () => void;
};

export const BookingDetailModal = ({
  open,
  handleClose,
  bookingId,
  rideId,
  status,
  patientName,
  phoneNum,
  dateTime,
  pickup,
  destination,
  specialRequirements,
  onApprove,
  onDecline,
}: BookingDetailtModalProps) => {
  const theme = useTheme();
  const router = useRouter();

  const handleViewFullDetails = () => {
    handleClose();
    router.push(`/bookings/${rideId}`);
  };

  return (
    <AppModal label="booking-detail" open={open} setOpen={handleClose}>
      <Stack spacing={2} sx={{ width: '560px' }}>
        <RowStack width={'100%'} justifyContent={'space-between'}>
          <Stack spacing={0.3}>
            <RowStack spacing={1}>
              <BookingIdComponent bookingId={bookingId} />
              <StatusComponent status={status} />
            </RowStack>
            <Typography
              sx={{
                color: (theme) => theme.color.deepBlue,
                fontWeight: 500,
                fontFamily: (theme) => theme.typography.fontFamily,
                fontStyle: 'medium',
                fontSize: pxToRem(20),
                lineHeight: '30px',
              }}
            >
              Booking Details
            </Typography>
          </Stack>
          <IconButton
            onClick={handleClose}
            sx={{
              background: '#F7F9FB',
              border: '0.67px solid #E5E7EB',
              borderRadius: '14px',
              width: '33.3px',
              height: '33.3px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CloseIcon sx={{ color: '#6B7280' }} />
          </IconButton>
        </RowStack>
        <RowStack width={'100%'} spacing={2} alignItems="stretch">
          <BoxDetailComponent
            icon={patientIcon}
            iconTag="Patient"
            patientName={patientName}
            phoneNum={phoneNum}
          />
          <BoxDetailComponent
            icon={dateIcon}
            iconTag="Date & Time"
            patientName={dateTime}
          />
        </RowStack>
        <Stack spacing={'12px'}>
          <BoxDetailComponent
            icon={pickupIcon}
            iconTag="Pickup"
            patientName={pickup}
          />
          <BoxDetailComponent
            icon={destinationIcon}
            iconTag="Destination"
            patientName={destination}
          />
        </Stack>
        {specialRequirements && (
          <Stack
            sx={{
              padding: '18.67px 16.67px',
              border: '0.67px solid #FDE68A',
              borderRadius: '14px',
              background: '#FFFBEB',
            }}
          >
            <RowStack spacing={1}>
              <StyledImage
                src={warningIcon}
                alt="icon"
                sx={{
                  width: '14px',
                  height: '14px',
                }}
              />
              <Typography
                sx={{
                  color: (theme) => theme.color.warning,
                  fontWeight: 600,
                  fontSize: pxToRem(12),
                  lineHeight: '18px',
                  fontFamily: (theme) => theme.typography.fontFamily,
                }}
              >
                Special Requirements
              </Typography>
            </RowStack>
            <Typography
              sx={{
                color: (theme) => theme.color.deepYellow,
                fontWeight: 400,
                fontSize: pxToRem(13.5),
                lineHeight: '20px',
                fontFamily: (theme) => theme.typography.fontFamily,
              }}
            >
              {specialRequirements}
            </Typography>
          </Stack>
        )}
        <RowStack spacing={'12px'} width={'100%'}>
          {status === 'requested' && (
            <>
              <AppButton
                sx={{
                  background: '#F7F9FB',
                  border: '0.67px solid #E8ECF0',
                  color: (theme) => theme.color.error,
                  fontWeight: 600,
                  fontSize: pxToRem(13),
                  lineHeight: '19.5px',
                }}
                fullWidth
                onClick={() => {
                  handleClose();
                  onDecline?.();
                }}
              >
                Decline Booking
              </AppButton>
              <AppButton
                sx={{
                  background: '#059669',
                  color: (theme) => theme.palette.background.default,
                  fontWeight: 600,
                  fontSize: pxToRem(13),
                  lineHeight: '19.5px',
                  '&:hover': {
                    background: alpha('#059669', 0.95),
                  },
                }}
                fullWidth
                onClick={() => {
                  handleClose();
                  onApprove?.();
                }}
              >
                Approve Booking
              </AppButton>
            </>
          )}
          <AppButton
            sx={{
              background: 'none',
              color: 'primary.main',
              fontWeight: 600,
              fontSize: pxToRem(13),
              lineHeight: '19.5px',
              '&:hover': {
                background: 'none',
              },
            }}
            fullWidth
            onClick={handleViewFullDetails}
            endIcon={
              <ArrowForwardIcon
                sx={{
                  color: 'primary.main',
                }}
              />
            }
          >
            View Full Details
          </AppButton>
        </RowStack>
      </Stack>
    </AppModal>
  );
};
