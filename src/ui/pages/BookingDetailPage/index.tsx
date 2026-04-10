'use client';

import { useState } from 'react';
import {
  Box,
  Chip,
  Grid,
  Skeleton,
  Stack,
  Typography,
  alpha,
} from '@mui/material';
import { useParams } from 'next/navigation';
import dayjs from 'dayjs';
import { toast } from 'sonner';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppButton,
  CustomBreadCrumbs,
  DashboardTitle,
  RowStack,
  StyledImage,
} from '../../modules/components';
import { pxToRem } from '../../../common';
import {
  useGetBookingDetail,
  useAssignDriverToBooking,
  useReassignDriver,
} from '../../../common/hooks';
import { AdminBookingDetailResponse } from '../../../common/types';
import {
  StatChip,
  InfoCard,
  PersonCard,
  LiveRouteCard,
  TripTimeline,
  FareBreakdown,
  AssignDriverModal,
} from './ui/components';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import LoopIcon from '@mui/icons-material/Loop';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import tripstatusIcon from './ui/assets/icons/tripstatus-icon.svg';
import dollarIcon from './ui/assets/icons/dollar-icon.svg';
import distanceIcon from './ui/assets/icons/distance-icon.svg';
import timeIcon from './ui/assets/icons/time-icon.svg';
import locationIcon from './ui/assets/icons/location-icon.svg';
import clockIcon from './ui/assets/icons/clock-icon.svg';
import serviceIcon from './ui/assets/icons/service-icon.svg';
import usergroupIcon from './ui/assets/icons/usergroup-icon.svg';
import riderIcon from './ui/assets/icons/rider-icon.svg';
import driverinfoIcon from './ui/assets/icons/driverinfo-icon.svg';
import driverIcon from './ui/assets/icons/driver-icon.svg';
import careassistantIcon from './ui/assets/icons/careassistant-icon.svg';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const statusColorMap: Record<string, string> = {
  pending: '#D97706',
  requested: '#D97706',
  approved: '#059669',
  accepted: '#059669',
  in_progress: '#2563EB',
  completed: '#059669',
  declined: '#DC2626',
  cancelled: '#DC2626',
};

const formatStatus = (status: string) =>
  status
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

const getInitials = (name?: string | null) => {
  if (!name) return '—';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const formatCurrency = (amount?: number | null) => {
  if (amount == null) return '—';
  return `$${amount.toFixed(2)}`;
};

const getVehicleLabel = (d: AdminBookingDetailResponse) => {
  const parts = [
    d.driver_vehicle_make,
    d.driver_vehicle_model,
    d.driver_vehicle_type,
  ].filter(Boolean);
  return parts.length ? parts.join(' ') : undefined;
};

const getTripProgress = (d: AdminBookingDetailResponse) => {
  if (d.status === 'completed' || d.status === 'dropped_off') return 100;
  if (d.status === 'in_progress' || d.status === 'in_transit') return 60;
  if (d.status === 'picked_up') return 40;
  if (d.status === 'en_route') return 20;
  return 0;
};

const getServiceTypeInfo = (d: AdminBookingDetailResponse) => {
  const hasDriver = !!d.driver_name;
  const hasCareAssistant = d.assistance_level && d.assistance_level !== 'none';
  if (hasCareAssistant) {
    return {
      title: 'Transport + Care Assistant',
      description: 'Driver + Care Assistant required',
      driverStatus: hasDriver ? 'Assigned' : 'Unassigned',
      careAssistantStatus: 'Required',
    };
  }
  return {
    title: 'Standard Transport',
    description: 'Driver only',
    driverStatus: hasDriver ? 'Assigned' : 'Unassigned',
    careAssistantStatus: 'Not Required',
  };
};

const statIconSize = { width: 14, height: 14 };

export const BookingDetailPage = () => {
  const params = useParams();
  const id = (params?.id as string) || '';
  const bookingQuery = useGetBookingDetail(id);
  const assignDriverMutation = useAssignDriverToBooking();
  const reassignDriverMutation = useReassignDriver();
  const [openAssignDriver, setOpenAssignDriver] = useState(false);
  const [openReassignDriver, setOpenReassignDriver] = useState(false);

  const apiResponse = bookingQuery.data;
  const booking =
    apiResponse && 'data' in apiResponse ? apiResponse.data : null;

  const hasDriver = !!booking?.driver_id;

  const handleAssignDriver = (driverId: string) => {
    assignDriverMutation.mutate(
      { rideId: id, driver_id: driverId },
      {
        onSuccess: () => {
          toast.success('Driver assigned successfully');
          setOpenAssignDriver(false);
          bookingQuery.refetch();
        },
        onError: () => {
          toast.error('Failed to assign driver');
        },
      }
    );
  };

  const handleReassignDriver = (driverId: string) => {
    reassignDriverMutation.mutate(
      { rideId: id, driver_id: driverId },
      {
        onSuccess: () => {
          toast.success('Driver reassigned successfully');
          setOpenReassignDriver(false);
          bookingQuery.refetch();
        },
        onError: () => {
          toast.error('Failed to reassign driver');
        },
      }
    );
  };

  if (bookingQuery.isLoading) {
    return (
      <AppDashboardLayout>
        <Stack spacing={'20px'}>
          <Skeleton
            variant="rectangular"
            height={28}
            width={300}
            sx={{ borderRadius: '8px' }}
          />
          <RowStack justifyContent="space-between" width="100%">
            <Stack spacing={'6px'}>
              <Skeleton
                variant="rectangular"
                height={32}
                width={350}
                sx={{ borderRadius: '8px' }}
              />
              <Skeleton
                variant="rectangular"
                height={18}
                width={450}
                sx={{ borderRadius: '8px' }}
              />
            </Stack>
            <RowStack spacing={'8px'}>
              <Skeleton
                variant="rectangular"
                height={36}
                width={160}
                sx={{ borderRadius: '14px' }}
              />
              <Skeleton
                variant="rectangular"
                height={36}
                width={130}
                sx={{ borderRadius: '14px' }}
              />
            </RowStack>
          </RowStack>
          <RowStack spacing={'12px'} width="100%">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                height={60}
                sx={{ flex: 1, borderRadius: '12px' }}
              />
            ))}
          </RowStack>
          <Grid container spacing={'20px'}>
            <Grid size={{ sm: 12, lg: 3 }}>
              <Stack spacing={'16px'}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    variant="rectangular"
                    height={180}
                    sx={{ borderRadius: '16px' }}
                  />
                ))}
              </Stack>
            </Grid>
            <Grid size={{ sm: 12, lg: 9 }}>
              <Stack spacing={'16px'}>
                <Skeleton
                  variant="rectangular"
                  height={300}
                  sx={{ borderRadius: '16px' }}
                />
                <Skeleton
                  variant="rectangular"
                  height={250}
                  sx={{ borderRadius: '16px' }}
                />
                <Skeleton
                  variant="rectangular"
                  height={200}
                  sx={{ borderRadius: '16px' }}
                />
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </AppDashboardLayout>
    );
  }

  if (!booking) {
    return (
      <AppDashboardLayout>
        <Stack
          spacing={'20px'}
          alignItems="center"
          justifyContent="center"
          sx={{ minHeight: 400 }}
        >
          <Typography sx={{ fontSize: pxToRem(16), color: '#6B7280' }}>
            Booking not found
          </Typography>
        </Stack>
      </AppDashboardLayout>
    );
  }

  const statusColor = statusColorMap[booking.status] || '#6B7280';
  const displayStatus = formatStatus(booking.status);
  const serviceInfo = getServiceTypeInfo(booking);

  const timelineEntries = booking.timeline.map((entry, idx) => ({
    time: dayjs(entry.timestamp).format('MMM D · hh:mm A'),
    label: formatStatus(entry.to_status),
    isCompleted: idx < booking.timeline.length - 1,
    isCurrent: idx === booking.timeline.length - 1,
  }));

  const adminNotes = booking.admin_notes.map((note) => ({
    initial: (note.author_name || note.author_type || 'S')[0].toUpperCase(),
    author: note.author_name || formatStatus(note.author_type),
    time: dayjs(note.created_at).format('hh:mm A'),
    text: note.content,
  }));

  return (
    <AppDashboardLayout>
      <Stack spacing={'20px'}>
        <CustomBreadCrumbs
          breadcrumbsData={[
            { href: '/bookings', text: 'Booking Management' },
            { href: '/bookings', text: 'All Bookings' },
            { href: '#', text: booking.id.slice(0, 8).toUpperCase() },
          ]}
        />

        {/* Header */}
        <RowStack justifyContent="space-between" width="100%">
          <Stack spacing={'6px'}>
            <RowStack spacing={'10px'}>
              <DashboardTitle title="Booking Details" />
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(12),
                  color: '#6B7280',
                  background: '#F3F4F6',
                  borderRadius: '17px',
                  padding: '4px 12px',
                }}
              >
                {booking.id.slice(0, 8).toUpperCase()}
              </Typography>
              <Chip
                label={displayStatus}
                sx={{
                  background: alpha(statusColor, 0.1),
                  color: statusColor,
                  fontSize: pxToRem(12),
                  fontWeight: 600,
                  height: '27px',
                  borderRadius: '16px',
                }}
              />
            </RowStack>
            <RowStack spacing={'8px'}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12.5),
                  color: (theme) => theme.color.lightGrey,
                }}
              >
                {`Created ${dayjs(booking.created_at).format('MMM D, YYYY · hh:mm A')}`}
              </Typography>
              <NavigateNextIcon sx={{ fontSize: 13, color: '#D1D5DB' }} />
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12.5),
                  color: (theme) => theme.color.lightGrey,
                }}
              >
                {`Scheduled ${dayjs(booking.scheduled_at).format('MMM D, YYYY · hh:mm A')}`}
              </Typography>
            </RowStack>
          </Stack>

          <RowStack spacing={'8px'}>
            <AppButton
              sx={{
                background: '#F0FDF4',
                border: '0.67px solid #BBF7D0',
                color: '#16A34A',
                fontWeight: 600,
                fontSize: pxToRem(12.5),
                borderRadius: '14px',
                '&:hover': {
                  background: alpha('#16A34A', 0.12),
                },
              }}
              startIcon={
                <PersonAddAltOutlinedIcon
                  sx={{ fontSize: 13, color: '#16A34A' }}
                />
              }
            >
              Assign Care Assistant
            </AppButton>
            {hasDriver ? (
              <AppButton
                sx={{
                  background: '#FEF3C7',
                  border: '0.67px solid #FDE68A',
                  color: '#D97706',
                  fontWeight: 600,
                  fontSize: pxToRem(12.5),
                  borderRadius: '14px',
                  '&:hover': {
                    background: alpha('#D97706', 0.12),
                  },
                }}
                startIcon={<LoopIcon sx={{ fontSize: 13, color: '#D97706' }} />}
                onClick={() => setOpenReassignDriver(true)}
              >
                Reassign Driver
              </AppButton>
            ) : (
              <AppButton
                sx={{
                  background: (theme) => theme.palette.primary.main,
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: pxToRem(12.5),
                  borderRadius: '14px',
                  '&:hover': {
                    background: alpha('#2F6FED', 0.9),
                  },
                }}
                startIcon={<LoopIcon sx={{ fontSize: 13, color: '#FFFFFF' }} />}
                onClick={() => setOpenAssignDriver(true)}
              >
                Assign Driver
              </AppButton>
            )}
            <Box
              sx={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <MoreHorizIcon sx={{ fontSize: 24, color: '#6B7280' }} />
            </Box>
          </RowStack>
        </RowStack>

        {/* Stat Chips */}
        <RowStack spacing={'12px'} width="100%">
          {[
            {
              icon: (
                <StyledImage
                  src={tripstatusIcon}
                  alt="trip status"
                  {...statIconSize}
                />
              ),
              label: 'Trip Status',
              value: displayStatus,
              valueColor: statusColor,
              pulse:
                booking.status === 'in_progress' ||
                booking.status === 'en_route',
            },
            {
              icon: (
                <StyledImage
                  src={dollarIcon}
                  alt="total fare"
                  {...statIconSize}
                />
              ),
              label: 'Total Fare',
              value: formatCurrency(
                booking.final_fare ?? booking.estimated_fare
              ),
            },
            {
              icon: (
                <StyledImage
                  src={distanceIcon}
                  alt="distance"
                  {...statIconSize}
                />
              ),
              label: 'Distance',
              value: booking.actual_distance_miles
                ? `${booking.actual_distance_miles.toFixed(1)} mi`
                : booking.estimated_distance_miles
                  ? `${booking.estimated_distance_miles.toFixed(1)} mi`
                  : '—',
            },
            {
              icon: (
                <StyledImage src={timeIcon} alt="duration" {...statIconSize} />
              ),
              label: 'Est. Duration',
              value: booking.estimated_duration_minutes
                ? `${booking.estimated_duration_minutes} min`
                : '—',
            },
            {
              icon: (
                <StyledImage
                  src={locationIcon}
                  alt="picked up at"
                  {...statIconSize}
                />
              ),
              label: 'Picked Up At',
              value: booking.pickup_at
                ? dayjs(booking.pickup_at).format('hh:mm A')
                : '—',
            },
            {
              icon: (
                <StyledImage
                  src={clockIcon}
                  alt="eta arrival"
                  {...statIconSize}
                />
              ),
              label: 'ETA Arrival',
              value: booking.dropoff_at
                ? dayjs(booking.dropoff_at).format('hh:mm A')
                : booking.estimated_duration_minutes && booking.scheduled_at
                  ? dayjs(booking.scheduled_at)
                      .add(booking.estimated_duration_minutes, 'minute')
                      .format('hh:mm A')
                  : '—',
            },
          ].map((chip) => (
            <StatChip key={chip.label} {...chip} />
          ))}
        </RowStack>

        {/* Main Content: Left sidebar + Right content */}
        <Grid container spacing={'20px'}>
          {/* Left Column */}
          <Grid size={{ sm: 12, lg: 3 }}>
            <Stack spacing={'16px'}>
              {/* Service Type */}
              <InfoCard
                icon={
                  <StyledImage
                    src={serviceIcon}
                    alt="service type"
                    width={12}
                    height={12}
                  />
                }
                title="Service Type"
              >
                <Stack spacing={'12px'}>
                  <Box
                    sx={{
                      background: '#F0FDF4',
                      borderRadius: '14px',
                      padding: '12px',
                    }}
                  >
                    <RowStack spacing={'10px'}>
                      <Box
                        sx={{
                          width: 38,
                          height: 38,
                          borderRadius: '14px',
                          background: '#DCFCE7',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <StyledImage
                          src={usergroupIcon}
                          alt="service"
                          width={18}
                          height={18}
                        />
                      </Box>
                      <Stack spacing={'1px'}>
                        <Typography
                          sx={{
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 700,
                            fontSize: pxToRem(13.5),
                            color: '#15803D',
                          }}
                        >
                          {serviceInfo.title}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 400,
                            fontSize: pxToRem(11.5),
                            color: '#4ADE80',
                          }}
                        >
                          {serviceInfo.description}
                        </Typography>
                      </Stack>
                    </RowStack>
                  </Box>
                  <Stack spacing={'8px'}>
                    {[
                      {
                        icon: (
                          <StyledImage
                            src={driverIcon}
                            alt="driver"
                            width={12}
                            height={12}
                          />
                        ),
                        label: 'Driver',
                        status: serviceInfo.driverStatus,
                      },
                      {
                        icon: (
                          <StyledImage
                            src={careassistantIcon}
                            alt="care assistant"
                            width={12}
                            height={12}
                          />
                        ),
                        label: 'Care Assistant',
                        status: serviceInfo.careAssistantStatus,
                      },
                    ].map((row) => (
                      <RowStack
                        key={row.label}
                        justifyContent="space-between"
                        sx={{
                          background: '#F7F9FB',
                          borderRadius: '10px',
                          padding: '9px 12px',
                        }}
                      >
                        <RowStack spacing={'8px'}>
                          {row.icon}
                          <Typography
                            sx={{
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
                              fontWeight: 600,
                              fontSize: pxToRem(10.5),
                              color: (theme) => theme.color.grey,
                            }}
                          >
                            {row.label}
                          </Typography>
                        </RowStack>
                        <Chip
                          label={row.status}
                          size="small"
                          sx={{
                            background: alpha('#059669', 0.1),
                            color: '#059669',
                            fontSize: pxToRem(10.5),
                            fontWeight: 700,
                            height: '20px',
                            borderRadius: '10px',
                          }}
                        />
                      </RowStack>
                    ))}
                  </Stack>
                </Stack>
              </InfoCard>

              {/* Rider Information */}
              <InfoCard
                icon={
                  <StyledImage
                    src={riderIcon}
                    alt="rider"
                    width={12}
                    height={12}
                  />
                }
                title="Rider Information"
              >
                <PersonCard
                  initials={getInitials(booking.rider_name)}
                  name={booking.rider_name}
                  rating={booking.rider_rating}
                  phone={booking.rider_phone || undefined}
                  totalTrips={booking.rider_trip_count?.toString()}
                />
              </InfoCard>

              {/* Driver Information */}
              <InfoCard
                icon={
                  <StyledImage
                    src={driverinfoIcon}
                    alt="driver info"
                    width={12}
                    height={12}
                  />
                }
                title="Driver Information"
              >
                <PersonCard
                  initials={getInitials(booking.driver_name)}
                  name={booking.driver_name || 'Unassigned'}
                  rating={booking.driver_rating ?? undefined}
                  phone={booking.driver_phone || undefined}
                  vehicle={getVehicleLabel(booking)}
                  plate={booking.driver_vehicle_plate || undefined}
                />
              </InfoCard>

              {/* Care Assistant */}
              <InfoCard
                icon={
                  <StyledImage
                    src={careassistantIcon}
                    alt="care assistant"
                    width={12}
                    height={12}
                  />
                }
                title="Care Assistant"
              >
                <PersonCard
                  initials="—"
                  initialsColor="#16A34A"
                  name={
                    booking.assistance_level
                      ? formatStatus(booking.assistance_level)
                      : 'Not Required'
                  }
                />
              </InfoCard>
            </Stack>
          </Grid>

          {/* Right Column */}
          <Grid size={{ sm: 12, lg: 9 }}>
            <Stack spacing={'16px'}>
              <LiveRouteCard
                pickupAddress={booking.pickup_address}
                destinationAddress={booking.destination_address}
                tripProgress={getTripProgress(booking)}
                pickupLat={booking.pickup_latitude}
                pickupLng={booking.pickup_longitude}
                destinationLat={booking.destination_latitude}
                destinationLng={booking.destination_longitude}
              />
              <TripTimeline entries={timelineEntries} adminNotes={adminNotes} />
              <FareBreakdown
                baseFare={formatCurrency(booking.fare_breakdown?.base_fare)}
                careAssistantFee={formatCurrency(
                  booking.fare_breakdown?.insurance_gateway_fee
                )}
                platformFee={formatCurrency(
                  booking.fare_breakdown?.surcharges_capped
                )}
                totalAmount={formatCurrency(
                  booking.fare_breakdown?.total_fare ??
                    booking.final_fare ??
                    booking.estimated_fare
                )}
                paymentMethod={booking.fare_breakdown?.payment_method || '—'}
              />
            </Stack>
          </Grid>
        </Grid>
      </Stack>

      <AssignDriverModal
        open={openAssignDriver}
        handleClose={() => setOpenAssignDriver(false)}
        rideId={id}
        onAssign={handleAssignDriver}
        isAssigning={assignDriverMutation.isPending}
      />

      <AssignDriverModal
        open={openReassignDriver}
        handleClose={() => setOpenReassignDriver(false)}
        rideId={id}
        onAssign={handleReassignDriver}
        isAssigning={reassignDriverMutation.isPending}
        title="Reassign Driver"
        description="Select a new driver to reassign this booking to."
        confirmLabel="Reassign Driver"
      />
    </AppDashboardLayout>
  );
};
