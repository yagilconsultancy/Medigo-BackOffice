'use client';

import {
  Box,
  Grid,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppButton,
  AppGoogleMap,
  AppGoogleMapsProvider,
  DashboardTitleAndDesc,
  RowStack,
  StyledImage,
} from '../../modules/components';
import { EmptyState } from '../../modules/blocks';
import {
  pxToRem,
  useGetDispatchDashboard,
  useResolvedApiQuery,
  useDispatchApi,
  useGetActiveTripKpis,
  useGetActiveTrips,
  useGetTripDetail,
} from '../../../common';
import { useState, useMemo } from 'react';
import {
  DispatchStatCard,
  DispatchBookingCard,
  DispatchBooking,
  AvailableDriverCard,
  AvailableDriver,
  ActiveTripCard,
  ActiveTrip,
  TripTelemetryPanel,
  DispatchAssignModal,
} from './ui/components';

import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import pendingIcon from './ui/assets/icons/dispatch-pending-Icon.svg';
import driverIcon from './ui/assets/icons/driverinfo-icon.svg';
import userGroupIcon from './ui/assets/icons/drivermanagement-Icon.svg';
import tripIcon from './ui/assets/icons/tripstatus-icon.svg';
import assignIcon from './ui/assets/icons/assign-icon.svg';

const availableDrivers: AvailableDriver[] = [
  {
    id: '1',
    initials: 'MJ',
    initialsColor: '#2F6FED',
    name: 'Marcus Johnson',
    vehicle: 'Toyota Sienna WAV',
    rating: 4.9,
    trips: 312,
    distance: '0.4 mi',
    eta: '3 min',
    status: 'Available',
  },
  {
    id: '2',
    initials: 'SW',
    initialsColor: '#8B5CF6',
    name: 'Sarah Williams',
    vehicle: 'Honda Odyssey',
    rating: 4.8,
    trips: 287,
    distance: '0.8 mi',
    eta: '5 min',
    status: 'Available',
  },
  {
    id: '3',
    initials: 'DC',
    initialsColor: '#F59E0B',
    name: 'David Chen',
    vehicle: 'Ford Escape',
    rating: 4.8,
    trips: 264,
    distance: '1.1 mi',
    eta: '7 min',
    status: 'Available',
  },
  {
    id: '4',
    initials: 'ER',
    initialsColor: '#EF4444',
    name: 'Emily Rodriguez',
    vehicle: 'Chrysler Pacifica',
    rating: 4.7,
    trips: 241,
    distance: '1.4 mi',
    eta: '9 min',
    status: 'Available',
  },
  {
    id: '5',
    initials: 'JT',
    initialsColor: '#059669',
    name: 'James Thompson',
    vehicle: 'Dodge Grand Caravan',
    rating: 4.7,
    trips: 218,
    distance: '1.8 mi',
    eta: '11 min',
    status: 'Available',
  },
  {
    id: '6',
    initials: 'AK',
    initialsColor: '#0EA5E9',
    name: 'Anna Kim',
    vehicle: 'Toyota Camry',
    rating: 4.6,
    trips: 195,
    distance: '2.2 mi',
    eta: '13 min',
    status: 'Available',
  },
];

const activeTrips: ActiveTrip[] = [
  {
    id: '1',
    tripId: 'TR-8801',
    status: 'In Transit',
    statusColor: '#2F6FED',
    statusBg: '#EBF2FF',
    eta: '7 min',
    patientName: 'Helen Moore',
    driverName: 'Marcus Johnson',
    driverInitials: 'MJ',
    driverInitialsColor: '#2F6FED',
    speed: '33 mph',
    progress: 75,
  },
  {
    id: '2',
    tripId: 'TR-8800',
    status: 'In Transit',
    statusColor: '#2F6FED',
    statusBg: '#EBF2FF',
    eta: '14 min',
    patientName: 'Robert Garcia',
    driverName: 'Sarah Williams',
    driverInitials: 'SW',
    driverInitialsColor: '#8B5CF6',
    speed: '26 mph',
    progress: 48,
  },
  {
    id: '3',
    tripId: 'TR-8799',
    status: 'Arriving',
    statusColor: '#059669',
    statusBg: '#ECFDF5',
    eta: '2 min',
    patientName: 'Daniel Martinez',
    driverName: 'David Chen',
    driverInitials: 'DC',
    driverInitialsColor: '#F59E0B',
    speed: '16 mph',
    progress: 94,
  },
  {
    id: '4',
    tripId: 'TR-8798',
    status: 'In Transit',
    statusColor: '#2F6FED',
    statusBg: '#EBF2FF',
    eta: '21 min',
    patientName: 'Nancy White',
    driverName: 'Emily Rodriguez',
    driverInitials: 'ER',
    driverInitialsColor: '#EF4444',
    speed: '43 mph',
    progress: 31,
  },
  {
    id: '5',
    tripId: 'TR-8797',
    status: 'In Transit',
    statusColor: '#2F6FED',
    statusBg: '#EBF2FF',
    eta: '30 min',
    patientName: 'Patricia Clark',
    driverName: 'James Thompson',
    driverInitials: 'JT',
    driverInitialsColor: '#059669',
    speed: '38 mph',
    progress: 18,
  },
];

// type ViewTab = 'assignments' | 'liveMap';

export const DispatchPage = () => {
  // const [activeView, setActiveView] = useState<ViewTab>('assignments');
  // const [assignModalOpen, setAssignModalOpen] = useState(false);
  // const [selectedBooking, setSelectedBooking] =
  //   useState<DispatchBooking | null>(null);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  // Fetch dispatch dashboard data
  // const dashboardQuery = useGetDispatchDashboard();
  const kpisQuery = useGetActiveTripKpis();
  const activeTripsQuery = useGetActiveTrips();
  const { data: dashboardData } = useResolvedApiQuery(
    useGetActiveTripKpis,
    null
  );
  const { data: activeTripsData } = useResolvedApiQuery(
    useGetActiveTrips,
    null
  );
  const { data: selectedTripDetailData } = useResolvedApiQuery(
    useGetTripDetail,
    null,
    selectedTripId || ''
  );
  // const { triggerAutoDispatch } = useDispatchApi();
  // const isFetchingDashboard = dashboardQuery.isFetching;
  const isFetchingKpis = kpisQuery.isFetching;
  const isFetchingActiveTrips = activeTripsQuery.isFetching;

  // Transform unassigned rides to pending bookings format
  // const pendingBookings = useMemo<DispatchBooking[]>(() => {
  //   return (dashboardData?.unassigned_rides || []).map((ride, index) => ({
  //     id: ride.ride_id,
  //     bookingId: ride.booking_number,
  //     patientName: ride.rider_name,
  //     time: new Date(ride.scheduled_at).toLocaleTimeString('en-US', {
  //       hour: '2-digit',
  //       minute: '2-digit',
  //       hour12: true,
  //     }),
  //     pickup: ride.pickup_address,
  //     destination: ride.destination_address,
  //     specialNote: ride.special_requirements?.[0],
  //     specialNoteType: ride.special_requirements?.[0]
  //       ? ride.special_requirements[0].toLowerCase().includes('wheelchair')
  //         ? 'wheelchair'
  //         : ride.special_requirements[0].toLowerCase().includes('care')
  //           ? 'careAssistant'
  //           : ride.special_requirements[0].toLowerCase().includes('oxygen')
  //             ? 'oxygen'
  //             : undefined
  //       : undefined,
  //     status: index === 0 ? ('urgent' as const) : undefined,
  //   }));
  // }, [dashboardData?.unassigned_rides]);

  // Transform active trips from API to UI format
  const activeTrips = useMemo<ActiveTrip[]>(() => {
    const driverColors = [
      '#2F6FED',
      '#8B5CF6',
      '#F59E0B',
      '#EF4444',
      '#059669',
      '#0EA5E9',
    ];

    return (activeTripsData || []).map((trip, index) => {
      const nameParts = (trip.driver_name || '').split(' ');
      const initials =
        nameParts.length > 1
          ? `${nameParts[0][0]}${nameParts[1][0]}`
          : nameParts[0]?.substring(0, 2) || 'DR';

      // Determine status based on ETA
      const etaMinutes = trip.eta_minutes || 0;
      const status = etaMinutes <= 5 ? 'Arriving' : 'In Transit';
      const statusColor = etaMinutes <= 5 ? '#059669' : '#2F6FED';
      const statusBg = etaMinutes <= 5 ? '#ECFDF5' : '#EBF2FF';

      return {
        id: trip.ride_id,
        tripId: trip.trip_id_display,
        status,
        statusColor,
        statusBg,
        eta: trip.eta_minutes ? `${trip.eta_minutes} min` : 'N/A',
        patientName: trip.patient_name || 'Unknown Patient',
        driverName: trip.driver_name || 'Unassigned',
        driverInitials: initials.toUpperCase(),
        driverInitialsColor: driverColors[index % driverColors.length],
        speed: trip.current_speed ? `${Math.round(trip.current_speed)} mph` : '0 mph',
        progress: trip.progress_percent || 0,
      };
    });
  }, [activeTripsData]);

  // Transform available drivers
  // const availableDrivers = useMemo<AvailableDriver[]>(() => {
  //   const driverColors = [
  //     '#2F6FED',
  //     '#8B5CF6',
  //     '#F59E0B',
  //     '#EF4444',
  //     '#059669',
  //     '#0EA5E9',
  //   ];

  //   return (dashboardData?.available_drivers || []).map((driver, index) => {
  //     const nameParts = driver.driver_name.split(' ');
  //     const initials =
  //       nameParts.length > 1
  //         ? `${nameParts[0][0]}${nameParts[1][0]}`
  //         : nameParts[0].substring(0, 2);

  //     return {
  //       id: driver.driver_id,
  //       initials: initials.toUpperCase(),
  //       initialsColor: driverColors[index % driverColors.length],
  //       name: driver.driver_name,
  //       vehicle: driver.vehicle_info,
  //       rating: driver.rating,
  //       trips: driver.total_trips,
  //       distance: driver.distance_from_pickup
  //         ? `${driver.distance_from_pickup.toFixed(1)} mi`
  //         : 'N/A',
  //       eta: driver.eta_minutes ? `${driver.eta_minutes} min` : 'N/A',
  //       status: 'Available' as const,
  //     };
  //   });
  // }, [dashboardData?.available_drivers]);

  // Add isBestMatch flag for modal driver list
  // const dispatchDrivers = useMemo(() => {
  //   return availableDrivers.map((d, i) => ({
  //     ...d,
  //     isBestMatch: i === 0,
  //   }));
  // }, [availableDrivers]);

  // Set default selected trip to first trip
  const selectedTrip = useMemo(() => {
    if (!selectedTripId && activeTrips.length > 0) {
      setSelectedTripId(activeTrips[0].id);
      return activeTrips[0];
    }
    return activeTrips.find((t) => t.id === selectedTripId) || activeTrips[0];
  }, [selectedTripId, activeTrips]);

  // const handleAssignDriver = (booking: DispatchBooking) => {
  //   setSelectedBooking(booking);
  //   setAssignModalOpen(true);
  // };

  // const handleAutoAssignAll = async () => {
  //   await triggerAutoDispatch();
  // };

  const kpis = dashboardData || {
    active_trips: 0,
    arriving_soon: 0,
    avg_speed: null,
    completed_today: 0,
  };

  const statCards = [
    {
      icon: tripIcon,
      value: kpis.active_trips.toString(),
      label: 'Active Trips',
      subtitle: 'Currently in progress',
      badge: {
        text: `${kpis.active_trips} live now`,
        color: '#2F6FED',
        bg: '#EEF3FF',
      },
      progress: `${kpis.active_trips} tracking`,
    },
    {
      icon: pendingIcon,
      value: kpis.arriving_soon.toString(),
      label: 'Arriving Soon',
      subtitle: 'Within 5 minutes',
      badge: { text: 'ETA < 5 min', color: '#F59E0B', bg: '#FFFBEB' },
    },
    {
      icon: driverIcon,
      value: kpis.avg_speed ? `${kpis.avg_speed.toFixed(1)} mph` : 'N/A',
      label: 'Average Speed',
      subtitle: 'Active fleet',
      badge: { text: 'Real-time', color: '#059669', bg: '#ECFDF5' },
    },
    {
      icon: userGroupIcon,
      value: kpis.completed_today.toString(),
      label: 'Completed Today',
      subtitle: 'Finished trips',
      badge: { text: 'Today\'s total', color: '#9CA3AF', bg: '#F3F4F6' },
    },
  ];

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <RowStack justifyContent="space-between">
          <DashboardTitleAndDesc
            title="Dispatch Center"
            desc="Assign drivers to pending bookings and monitor active dispatches"
          />

          {/* View Toggle */}
          {/* <Tabs
            value={activeView === 'assignments' ? 0 : 1}
            onChange={(_, newValue) =>
              setActiveView(newValue === 0 ? 'assignments' : 'liveMap')
            }
            sx={{
              minHeight: 'auto',
              background: '#F3F4F6',
              borderRadius: '10px',
              padding: '3px',
              '& .MuiTabs-indicator': {
                display: 'none',
              },
              '& .MuiTabs-flexContainer': {
                gap: 0,
              },
            }}
          >
            <Tab
              icon={
                <GridViewOutlinedIcon
                  sx={{
                    fontSize: pxToRem(16),
                    color: (theme) => theme.color.deepBlue,
                  }}
                />
              }
              iconPosition="start"
              label="Assignments"
              disableRipple
              sx={{
                minHeight: 'auto',
                minWidth: 'auto',
                padding: '8px 20px',
                borderRadius: '8px',
                textTransform: 'none',
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(12.5),
                color: '#6B7280',
                transition: 'all 0.2s',
                '&.Mui-selected': {
                  color: (theme) => theme.color.deepBlue,
                  background: '#ffffff',
                },
              }}
            />
            <Tab
              icon={<MapOutlinedIcon sx={{ fontSize: 16 }} />}
              iconPosition="start"
              label="Live Map"
              disableRipple
              sx={{
                minHeight: 'auto',
                minWidth: 'auto',
                padding: '8px 20px',
                borderRadius: '8px',
                textTransform: 'none',
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(12.5),
                color: '#6B7280',
                transition: 'all 0.2s',
                '&.Mui-selected': {
                  color: '#2F6FED',
                  background: '#FFFFFF',
                },
              }}
            />
          </Tabs> */}
        </RowStack>

        {/* Stat Cards */}
        <Grid container spacing={'12px'}>
          {isFetchingKpis
            ? Array.from({ length: 4 }).map((_, index) => (
                <Grid key={index} size={{ xs: 6, lg: 3 }}>
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={120}
                    sx={{ borderRadius: '14px' }}
                  />
                </Grid>
              ))
            : statCards.map((card, index) => (
                <Grid
                  key={index}
                  size={{ xs: 6, lg: 3 }}
                  alignItems={'stretch'}
                >
                  <DispatchStatCard {...card} />
                </Grid>
              ))}
        </Grid>

        {/* ═══════════ ASSIGNMENTS VIEW ═══════════ */}
        {/* {activeView === 'assignments' && (
          <Grid container spacing={'20px'} alignItems="stretch">
            <Grid size={{ xs: 12, lg: 5 }} sx={{ height: '100%' }}>
              <Stack
                spacing={'12px'}
                sx={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '0.67px solid #EAECF0',
                  height: '100%',
                }}
              >
                <Stack spacing={'2px'}>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 600,
                      fontSize: pxToRem(15),
                      color: (theme) => theme.color.deepBlue,
                    }}
                  >
                    Approved Bookings
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 400,
                      fontSize: pxToRem(12),
                      color: (theme) => theme.color.lightGrey,
                    }}
                  >
                    {pendingBookings.length} awaiting driver assignment
                  </Typography>
                </Stack>

                {pendingBookings.length === 0 ? (
                  <Stack
                    sx={{
                      height: '600px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <EmptyState emptyState="No Pending Bookings" />
                  </Stack>
                ) : (
                  <Stack
                    sx={{
                      height: '600px',
                      overflowY: 'auto',
                      '::-webkit-scrollbar': { display: 'none' },
                      scrollbarWidth: 'none',
                    }}
                    spacing={0.4}
                  >
                    {pendingBookings.map((booking) => (
                      <DispatchBookingCard
                        key={booking.id}
                        booking={booking}
                        onAssignDriver={() => handleAssignDriver(booking)}
                      />
                    ))}
                  </Stack>
                )}
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, lg: 7 }} sx={{ height: '100%' }}>
              <Stack
                spacing={'0px'}
                sx={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '0.67px solid #EAECF0',
                  height: '100%',
                }}
              >
                <RowStack
                  justifyContent="space-between"
                  sx={{ marginBottom: '8px' }}
                >
                  <Stack spacing={'2px'}>
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 600,
                        fontSize: pxToRem(15),
                        color: (theme) => theme.color.deepBlue,
                      }}
                    >
                      Available Drivers
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 400,
                        fontSize: pxToRem(12),
                        color: (theme) => theme.color.lightGrey,
                      }}
                    >
                      {availableDrivers.length} ready to dispatch
                    </Typography>
                  </Stack>
                  <AppButton
                    onClick={handleAutoAssignAll}
                    sx={{
                      background: '#F7F9FB',
                      color: (theme) => theme.color.deepBlue,
                      fontWeight: 600,
                      fontSize: pxToRem(12),
                      borderRadius: '8px',
                      padding: '6px 14px',
                      minWidth: 'auto',
                      '&:hover': { background: '#EBF2FF' },
                    }}
                    startIcon={
                      <StyledImage
                        src={assignIcon}
                        alt="assign-driver"
                        sx={{
                          width: '13px',
                          height: '13px',
                        }}
                      />
                    }
                  >
                    Auto Assign All
                  </AppButton>
                </RowStack>

                {availableDrivers.length === 0 ? (
                  <Stack
                    sx={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: '400px',
                    }}
                  >
                    <EmptyState emptyState="No Available Drivers" />
                  </Stack>
                ) : (
                  <>
                    {availableDrivers.map((driver) => (
                      <AvailableDriverCard key={driver.id} driver={driver} />
                    ))}
                  </>
                )}
              </Stack>
            </Grid>
          </Grid>
        )} */}

          <Grid container spacing={'20px'}>
            {/* Left: Active Trips */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Stack
                sx={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  border: '0.67px solid #EAECF0',
                  overflow: 'hidden',
                }}
              >
                <Stack spacing={'2px'} sx={{ padding: '20px 20px 12px' }}>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 600,
                      fontSize: pxToRem(15),
                      color: (theme) => theme.color.deepBlue,
                    }}
                  >
                    Active Trips
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 400,
                      fontSize: pxToRem(12),
                      color: (theme) => theme.color.lightGrey,
                    }}
                  >
                    {isFetchingActiveTrips ? 'Loading...' : `${activeTrips.length} trips in progress`}
                  </Typography>
                </Stack>

                {isFetchingActiveTrips ? (
                  <Stack spacing={1} sx={{ padding: '0 20px 20px' }}>
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} variant="rounded" height={100} />
                    ))}
                  </Stack>
                ) : activeTrips.length === 0 ? (
                  <Stack
                    sx={{
                      height: '300px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <EmptyState emptyState="No Active Trips" />
                  </Stack>
                ) : (
                  activeTrips.map((trip) => (
                    <ActiveTripCard
                      key={trip.id}
                      trip={trip}
                      isSelected={selectedTripId === trip.id}
                      onClick={() => setSelectedTripId(trip.id)}
                    />
                  ))
                )}
              </Stack>
            </Grid>

            {/* Right: Map + Telemetry */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <Stack spacing={'16px'}>
                {/* Map */}
                <Box
                  sx={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    border: '0.67px solid #EAECF0',
                    overflow: 'hidden',
                    height: '400px',
                    position: 'relative',
                  }}
                >
                  <AppGoogleMapsProvider
                    apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
                  >
                    <AppGoogleMap
                      markerPositions={[
                        { lat: 43.6532, lng: -79.3832 },
                        { lat: 43.6615, lng: -79.3956 },
                      ]}
                      mapContainerStyle={{ width: '100%', height: '400px' }}
                      showDirections={false}
                    />
                  </AppGoogleMapsProvider>
                  {/* Map Overlay Badge */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      background: '#2F6FED',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      zIndex: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 600,
                        fontSize: pxToRem(11),
                        color: '#FFFFFF',
                      }}
                    >
                      Live Dispatch Map
                    </Typography>
                  </Box>
                </Box>

                {/* Trip Telemetry */}
                {selectedTrip ? (
                  <TripTelemetryPanel
                    tripId={selectedTrip.tripId}
                    patientName={selectedTrip.patientName}
                    driverName={selectedTrip.driverName}
                    speed={selectedTrip.speed}
                    eta={selectedTrip.eta}
                    progress={selectedTrip.progress}
                    status={selectedTrip.status}
                    pickup={selectedTripDetailData?.pickup_address || 'Loading...'}
                    destination={selectedTripDetailData?.destination_address || 'Loading...'}
                  />
                ) : (
                  <Box
                    sx={{
                      background: '#FFFFFF',
                      borderRadius: '16px',
                      border: '0.67px solid #EAECF0',
                      padding: '20px',
                      height: '200px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        color: (theme) => theme.color.lightGrey,
                        fontSize: pxToRem(14),
                      }}
                    >
                      Select a trip to view telemetry
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Grid>
          </Grid>
      </Stack>

      {/* Dispatch Assign Driver Modal */}
      {/* {selectedBooking && (
        <DispatchAssignModal
          open={assignModalOpen}
          handleClose={() => setAssignModalOpen(false)}
          bookingId={selectedBooking.bookingId}
          patientName={selectedBooking.patientName}
          time={selectedBooking.time}
          pickup={selectedBooking.pickup}
          destination={selectedBooking.destination}
          specialNote={selectedBooking.specialNote}
          drivers={dispatchDrivers}
        />
      )} */}
    </AppDashboardLayout>
  );
};
