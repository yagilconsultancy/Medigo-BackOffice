import { Box, Grid, IconButton, Stack, Typography } from '@mui/material';
import {
  AppButton,
  AppModal,
  RowStack,
} from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';

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
              <WarningAmberRoundedIcon
                sx={{ fontSize: 20, color: '#EF4444' }}
              />
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
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <Stack spacing={'4px'}>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(11),
                    color: (theme) => theme.color.lightGrey,
                  }}
                >
                  Patient
                </Typography>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 600,
                    fontSize: pxToRem(13),
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
              <Stack spacing={'4px'}>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(11),
                    color: (theme) => theme.color.lightGrey,
                  }}
                >
                  Date & Time
                </Typography>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 600,
                    fontSize: pxToRem(13),
                    color: (theme) => theme.color.deepBlue,
                  }}
                >
                  {trip.dateTime}
                </Typography>
              </Stack>
            </Grid>
          </Grid>

          {/* Route */}
          <Stack spacing={'8px'}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(11),
                color: (theme) => theme.color.lightGrey,
              }}
            >
              Route
            </Typography>
            <Stack spacing={'6px'}>
              <RowStack spacing={'8px'}>
                <FmdGoodOutlinedIcon sx={{ fontSize: 16, color: '#2F6FED' }} />
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 500,
                    fontSize: pxToRem(12.5),
                    color: (theme) => theme.color.deepBlue,
                  }}
                >
                  {trip.pickup}
                </Typography>
              </RowStack>
              <RowStack spacing={'8px'}>
                <FmdGoodOutlinedIcon sx={{ fontSize: 16, color: '#EF4444' }} />
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 500,
                    fontSize: pxToRem(12.5),
                    color: (theme) => theme.color.deepBlue,
                  }}
                >
                  {trip.destination}
                </Typography>
              </RowStack>
            </Stack>
          </Stack>

          {/* Detail Rows */}
          <Stack
            spacing={0}
            sx={{
              border: '0.67px solid #F3F4F6',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            <DetailRow
              label="Cancellation Reason"
              value={trip.cancellationReason}
            />
            <DetailRow label="Cancelled By" value={trip.cancelledBy} />
            <DetailRow label="Assigned Driver" value={trip.assignedDriver} />
            <DetailRow label="Refund Status" value={trip.refundStatus} />
            <DetailRow label="Amount" value={trip.amount} isLast />
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

const DetailRow = ({
  label,
  value,
  isLast,
}: {
  label: string;
  value: string;
  isLast?: boolean;
}) => (
  <RowStack
    justifyContent="space-between"
    sx={{
      padding: '12px 16px',
      borderBottom: isLast ? 'none' : '0.67px solid #F3F4F6',
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
      {label}
    </Typography>
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 600,
        fontSize: pxToRem(12.5),
        color: (theme) => theme.color.deepBlue,
      }}
    >
      {value}
    </Typography>
  </RowStack>
);
