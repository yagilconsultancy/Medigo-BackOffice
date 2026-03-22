import { Box, Grid, IconButton, Stack, Typography } from '@mui/material';
import {
  AppButton,
  AppModal,
  RowStack,
  StyledImage,
} from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import CloseIcon from '@mui/icons-material/Close';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import patientIcon from '../../assets/icons/patient-Icon.svg';
import dateIcon from '../../assets/icons/date-Icon.svg';
import pickupIcon from '../../assets/icons/pickup-Icon.svg';
import destinationIcon from '../../assets/icons/destination-Icon.svg';

export type CancelledTripDetail = {
  bookingId: string;
  serviceType: string;
  patientName: string;
  age: number;
  phone: string;
  dateTime: string;
  pickup: string;
  destination: string;
  cancellationReason: string;
  cancelledBy: string;
  assignedDriver: string;
  refundStatus: string;
  amount: string;
};

type CancelledTripDetailModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  trip: CancelledTripDetail | null;
};

export const CancelledTripDetailModal = ({
  open,
  setOpen,
  trip,
}: CancelledTripDetailModalProps) => {
  if (!trip) return null;

  const detailRows = [
    { label: 'Cancellation Reason', value: trip.cancellationReason },
    { label: 'Cancelled By', value: trip.cancelledBy },
    { label: 'Assigned Driver', value: trip.assignedDriver },
    { label: 'Refund Status', value: trip.refundStatus },
    { label: 'Amount', value: trip.amount },
  ];

  const [date, time] = trip.dateTime.split(', ').reduce(
    (acc, part, index) => {
      if (index === 0) acc[0] = part;
      else acc[1] = acc[1] ? `${acc[1]}, ${part}` : part;
      return acc;
    },
    ['', ''] as [string, string]
  );

  return (
    <AppModal
      open={open}
      setOpen={setOpen}
      label="cancelled-trip-detail"
      sx={{
        '& .MuiDialog-paper': {
          width: '520px',
          padding: '0 !important',
          overflow: 'hidden',
        },
      }}
    >
      <Stack>
        {/* Red Header */}
        <RowStack
          justifyContent="space-between"
          sx={{
            background: '#FEF2F2',
            padding: '20px 24px',
          }}
        >
          <RowStack spacing={'12px'}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '12px',
                background: '#FEE2E2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CancelOutlinedIcon sx={{ fontSize: 20, color: '#EF4444' }} />
            </Box>
            <Stack spacing={'2px'}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(16),
                  color: '#991B1B',
                }}
              >
                Cancelled Trip
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12),
                  color: '#DC2626',
                }}
              >
                {trip.bookingId} · {trip.serviceType}
              </Typography>
            </Stack>
          </RowStack>
          <IconButton onClick={() => setOpen(false)} size="small">
            <CloseIcon sx={{ fontSize: 18, color: '#991B1B' }} />
          </IconButton>
        </RowStack>

        {/* Body */}
        <Stack spacing={'20px'} sx={{ padding: '24px' }}>
          {/* Patient & Date Grid */}
          <Grid container spacing={'12px'}>
            <Grid size={{ xs: 6 }}>
              <Stack
                spacing={'6px'}
                sx={{
                  background: '#F7F9FB',
                  borderRadius: '14px',
                  padding: '16px',
                }}
              >
                <RowStack spacing={'6px'}>
                  <StyledImage
                    src={patientIcon}
                    alt="patient"
                    width={14}
                    height={14}
                  />
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 500,
                      fontSize: pxToRem(11),
                      color: (theme) => theme.color.lightGrey,
                      textTransform: 'uppercase',
                    }}
                  >
                    Patient
                  </Typography>
                </RowStack>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 700,
                    fontSize: pxToRem(14),
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
                  Age {trip.age} · {trip.phone}
                </Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Stack
                spacing={'6px'}
                sx={{
                  background: '#F7F9FB',
                  borderRadius: '14px',
                  padding: '16px',
                }}
              >
                <RowStack spacing={'6px'}>
                  <StyledImage
                    src={dateIcon}
                    alt="date"
                    width={14}
                    height={14}
                  />
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 500,
                      fontSize: pxToRem(11),
                      color: (theme) => theme.color.lightGrey,
                      textTransform: 'uppercase',
                    }}
                  >
                    Date & Time
                  </Typography>
                </RowStack>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 700,
                    fontSize: pxToRem(14),
                    color: (theme) => theme.color.deepBlue,
                  }}
                >
                  {date}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(11.5),
                    color: (theme) => theme.color.lightGrey,
                  }}
                >
                  {time}
                </Typography>
              </Stack>
            </Grid>
          </Grid>

          {/* Route */}
          <Stack
            spacing={'12px'}
            sx={{
              background: '#F7F9FB',
              borderRadius: '14px',
              padding: '16px',
            }}
          >
            <Stack spacing={'4px'}>
              <RowStack spacing={'6px'}>
                <StyledImage
                  src={pickupIcon}
                  alt="pickup"
                  width={14}
                  height={14}
                />
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 500,
                    fontSize: pxToRem(11),
                    color: '#2F6FED',
                    textTransform: 'uppercase',
                  }}
                >
                  Pickup
                </Typography>
              </RowStack>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 500,
                  fontSize: pxToRem(13),
                  color: (theme) => theme.color.deepBlue,
                  paddingLeft: '20px',
                }}
              >
                {trip.pickup}
              </Typography>
            </Stack>
            <Stack spacing={'4px'}>
              <RowStack spacing={'6px'}>
                <StyledImage
                  src={destinationIcon}
                  alt="destination"
                  width={14}
                  height={14}
                />
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 500,
                    fontSize: pxToRem(11),
                    color: '#EF4444',
                    textTransform: 'uppercase',
                  }}
                >
                  Destination
                </Typography>
              </RowStack>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 500,
                  fontSize: pxToRem(13),
                  color: (theme) => theme.color.deepBlue,
                  paddingLeft: '20px',
                }}
              >
                {trip.destination}
              </Typography>
            </Stack>
          </Stack>

          {/* Detail Rows */}
          <Stack spacing={'8px'}>
            {detailRows.map((row, index) => (
              <RowStack
                key={index}
                justifyContent="space-between"
                sx={{
                  background: '#F7F9FB',
                  borderRadius: '12px',
                  padding: '12px 16px',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(12.5),
                    color: (theme) => theme.color.lightGrey,
                  }}
                >
                  {row.label}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 600,
                    fontSize: pxToRem(12.5),
                    color: (theme) => theme.color.deepBlue,
                  }}
                >
                  {row.value}
                </Typography>
              </RowStack>
            ))}
          </Stack>

          {/* Close Button */}
          <AppButton
            onClick={() => setOpen(false)}
            sx={{
              background: '#F3F4F6',
              color: (theme) => theme.color.grey,
              fontWeight: 600,
              fontSize: pxToRem(13),
              borderRadius: '10px',
              padding: '10px 24px',
              '&:hover': {
                background: '#E5E7EB',
              },
            }}
          >
            Close
          </AppButton>
        </Stack>
      </Stack>
    </AppModal>
  );
};
