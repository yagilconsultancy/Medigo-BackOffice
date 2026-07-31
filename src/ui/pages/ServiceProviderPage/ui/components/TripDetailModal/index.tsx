import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import {
  AppButton,
  AppModal,
  RowStack,
} from '../../../../../modules/components';
import { pxToRem, useGetBookingDetail } from '../../../../../../common';
import { StatusComponent } from '../../../../BookingPage/ui/components';
import { BookingRow } from '../../../../BookingPage';

type TripDetailModalProps = {
  open: boolean;
  onClose: () => void;
  rideId: string;
};

const SectionLabel = ({ text }: { text: string }) => (
  <Typography
    sx={{
      fontFamily: (theme) => theme.typography.fontFamily,
      fontWeight: 700,
      fontSize: pxToRem(10),
      letterSpacing: '0.08em',
      color: '#9CA3AF',
      textTransform: 'uppercase',
    }}
  >
    {text}
  </Typography>
);

const Field = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => (
  <Stack spacing={0.25} sx={{ minWidth: 0, flex: 1 }}>
    <Typography sx={{ fontSize: pxToRem(10.5), color: '#9CA3AF' }}>
      {label}
    </Typography>
    <Typography
      sx={{
        fontSize: pxToRem(12.5),
        fontWeight: 600,
        color: '#111827',
        wordBreak: 'break-word',
      }}
    >
      {value === null || value === undefined || value === '' ? '—' : value}
    </Typography>
  </Stack>
);

const titleCase = (value?: string | null) =>
  value
    ? value
        .split(/[_\s-]+/)
        .filter(Boolean)
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
        .join(' ')
    : undefined;

const money = (value?: number | null) =>
  value === null || value === undefined
    ? undefined
    : `$${Number(value).toFixed(2)}`;

/**
 * Full record for one ride, fetched by id.
 *
 * Opened from a driver's Trips tab. It fetches rather than taking props because
 * the trips list only carries summary fields — the point of opening it is to see
 * everything about the rider and the trip.
 */
export const TripDetailModal = ({
  open,
  onClose,
  rideId,
}: TripDetailModalProps) => {
  const router = useRouter();
  const { data, isFetching } = useGetBookingDetail(open ? rideId : '');
  const booking = data && data.success ? data.data : undefined;

  const passengerName = [
    booking?.passenger_first_name,
    booking?.passenger_last_name,
  ]
    .filter(Boolean)
    .join(' ');

  const vehicle = [
    booking?.driver_vehicle_make,
    booking?.driver_vehicle_model,
    booking?.driver_vehicle_color,
  ]
    .filter(Boolean)
    .join(' ');

  const goToFullPage = () => {
    onClose();
    router.push(`/dispatch/rides/${rideId}`);
  };

  return (
    <AppModal
      open={open}
      setOpen={() => onClose()}
      label="trip-detail-modal"
      padding="0px"
      // No zIndex override needed: AppModal is a Dialog, which already sits at
      // zIndex.modal (1300) above the drawer's 1200, and MUI's ModalManager
      // handles the stacking of the two.
    >
      <Box
        sx={{
          width: { xs: '100%', sm: 560 },
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <RowStack
          justifyContent="space-between"
          sx={{ px: 3, py: 2.5, borderBottom: '0.67px solid #EAECF0' }}
        >
          <Stack spacing={0.25}>
            <Typography
              sx={{ fontWeight: 700, fontSize: pxToRem(14), color: '#111827' }}
            >
              Trip Details
            </Typography>
            <Typography
              sx={{
                fontSize: pxToRem(11.5),
                color: '#2F6FED',
                fontWeight: 700,
              }}
            >
              {rideId ? `#${rideId.slice(0, 8).toUpperCase()}` : '—'}
            </Typography>
          </Stack>
          <IconButton onClick={onClose} size="small" aria-label="Close">
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </RowStack>

        {isFetching && !booking ? (
          <Stack alignItems="center" sx={{ py: 6 }}>
            <CircularProgress size={22} sx={{ color: '#2F6FED' }} />
          </Stack>
        ) : !booking ? (
          <Stack alignItems="center" sx={{ py: 6 }}>
            <Typography sx={{ fontSize: pxToRem(12.5), color: '#6B7280' }}>
              Could not load this trip.
            </Typography>
          </Stack>
        ) : (
          <Stack spacing={2.5} sx={{ px: 3, py: 2.5 }}>
            <RowStack justifyContent="space-between">
              <SectionLabel text="Status" />
              <StatusComponent
                status={booking.status as BookingRow['status']}
              />
            </RowStack>

            <Divider />

            {/* Rider */}
            <Stack spacing={1.5}>
              <SectionLabel text="Rider" />
              <RowStack spacing={2} sx={{ alignItems: 'flex-start' }}>
                <Field label="Name" value={booking.rider_name} />
                <Field label="Phone" value={booking.rider_phone} />
              </RowStack>
              <RowStack spacing={2} sx={{ alignItems: 'flex-start' }}>
                <Field label="Rating" value={booking.rider_rating} />
                <Field label="Total Trips" value={booking.rider_trip_count} />
              </RowStack>
              {passengerName ? (
                <RowStack spacing={2} sx={{ alignItems: 'flex-start' }}>
                  <Field label="Passenger" value={passengerName} />
                  <Field
                    label="Passenger Phone"
                    value={booking.passenger_phone}
                  />
                </RowStack>
              ) : null}
            </Stack>

            <Divider />

            {/* Trip */}
            <Stack spacing={1.5}>
              <SectionLabel text="Trip" />
              <Field label="Pickup" value={booking.pickup_address} />
              <Field label="Destination" value={booking.destination_address} />
              <RowStack spacing={2} sx={{ alignItems: 'flex-start' }}>
                <Field
                  label="Scheduled"
                  value={dayjs(booking.scheduled_at).format(
                    'MMM D, YYYY · hh:mm A'
                  )}
                />
                <Field label="Ride Type" value={titleCase(booking.ride_type)} />
              </RowStack>
              <RowStack spacing={2} sx={{ alignItems: 'flex-start' }}>
                <Field label="Trip Type" value={titleCase(booking.trip_type)} />
                <Field
                  label="Structure"
                  value={titleCase(booking.trip_structure)}
                />
              </RowStack>
              <RowStack spacing={2} sx={{ alignItems: 'flex-start' }}>
                <Field
                  label="Visit Type"
                  value={titleCase(booking.visit_type)}
                />
                <Field label="Facility" value={booking.facility_name} />
              </RowStack>
              <RowStack spacing={2} sx={{ alignItems: 'flex-start' }}>
                <Field
                  label="Mobility"
                  value={titleCase(booking.mobility_level)}
                />
                <Field
                  label="Assistance"
                  value={titleCase(booking.assistance_level)}
                />
              </RowStack>
            </Stack>

            {booking.special_instructions ? (
              <>
                <Divider />
                <Stack spacing={1}>
                  <SectionLabel text="Note From Rider" />
                  <Typography
                    sx={{
                      fontSize: pxToRem(12.5),
                      color: '#111827',
                      whiteSpace: 'pre-wrap',
                      background: '#FFFBEB',
                      border: '0.67px solid #FDE68A',
                      borderRadius: '10px',
                      padding: '12px 14px',
                    }}
                  >
                    {booking.special_instructions}
                  </Typography>
                </Stack>
              </>
            ) : null}

            <Divider />

            {/* Driver & vehicle */}
            <Stack spacing={1.5}>
              <SectionLabel text="Driver & Vehicle" />
              <RowStack spacing={2} sx={{ alignItems: 'flex-start' }}>
                <Field label="Driver" value={booking.driver_name} />
                <Field label="Driver Phone" value={booking.driver_phone} />
              </RowStack>
              <RowStack spacing={2} sx={{ alignItems: 'flex-start' }}>
                <Field label="Vehicle" value={vehicle} />
                <Field label="Plate" value={booking.driver_vehicle_plate} />
              </RowStack>
            </Stack>

            <Divider />

            {/* Fare */}
            <Stack spacing={1.5}>
              <SectionLabel text="Fare" />
              <RowStack spacing={2} sx={{ alignItems: 'flex-start' }}>
                <Field
                  label="Estimated"
                  value={money(booking.estimated_fare)}
                />
                <Field label="Final" value={money(booking.final_fare)} />
              </RowStack>
              {booking.fare_breakdown ? (
                <RowStack spacing={2} sx={{ alignItems: 'flex-start' }}>
                  <Field
                    label="Total"
                    value={money(booking.fare_breakdown.total_fare)}
                  />
                  <Field
                    label="Payment Method"
                    value={titleCase(booking.fare_breakdown.payment_method)}
                  />
                </RowStack>
              ) : null}
            </Stack>

            <AppButton
              endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
              sx={{
                background: '#F7F9FB',
                border: '0.67px solid #E8ECF0',
                color: '#374151',
                fontWeight: 600,
                fontSize: pxToRem(12.5),
                textTransform: 'none',
              }}
              onClick={goToFullPage}
            >
              View full booking record
            </AppButton>
          </Stack>
        )}
      </Box>
    </AppModal>
  );
};
