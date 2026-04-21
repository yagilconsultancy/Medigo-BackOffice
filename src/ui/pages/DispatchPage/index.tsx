'use client';

import { Box, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppButton,
  AppGoogleMap,
  AppGoogleMapsProvider,
  DashboardTitleAndDesc,
  RowStack,
  StyledImage,
  type MarkerPosition,
} from '../../modules/components';
import { EmptyState } from '../../modules/blocks';
import {
  pxToRem,
  useGetDispatchDashboard,
  useResolvedApiQuery,
  useDispatchApi,
  useGetActiveTrips,
  useGetTripDetail,
  useDispatchSocket,
} from '../../../common';
import { useState, useMemo, useCallback } from 'react';
import {
  DispatchStatCard,
  // DispatchBookingCard,
  // DispatchBooking,
  // AvailableDriverCard,
  // AvailableDriver,
  ActiveTripCard,
  ActiveTrip,
  TripTelemetryPanel,
  // DispatchAssignModal,
} from './ui/components';

// import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
// import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import pendingIcon from './ui/assets/icons/dispatch-pending-Icon.svg';
import driverIcon from './ui/assets/icons/driverinfo-icon.svg';
import userGroupIcon from './ui/assets/icons/drivermanagement-Icon.svg';
import tripIcon from './ui/assets/icons/tripstatus-icon.svg';
// import assignIcon from './ui/assets/icons/assign-icon.svg';

// type ViewTab = 'assignments' | 'liveMap';

const formatEta = (minutes: number): string => {
  if (minutes < 1) return `${Math.round(minutes * 60)}s`;
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMin = Math.round(minutes % 60);
  if (hours < 24) {
    return remainingMin > 0 ? `${hours}h ${remainingMin}m` : `${hours}h`;
  }
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
};

export const DispatchPage = () => {
  // const [activeView, setActiveView] = useState<ViewTab>('assignments');
  // const [assignModalOpen, setAssignModalOpen] = useState(false);
  // const [selectedBooking, setSelectedBooking] =
  //   useState<DispatchBooking | null>(null);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  // Socket.IO connection for real-time updates
  const {
    isConnected,
    isJoined,
    locationUpdates,
    error: socketError,
  } = useDispatchSocket();

  // Fetch dispatch dashboard data (KPIs + unassigned rides + available drivers)
  const { data: dashboardData, isFetching: isFetchingDashboard } =
    useResolvedApiQuery(useGetDispatchDashboard, null);
  const activeTripsQuery = useGetActiveTrips();
  const { data: selectedTripDetailData } = useResolvedApiQuery(
    useGetTripDetail,
    null,
    selectedTripId || ''
  );
  // const { triggerAutoDispatch } = useDispatchApi();
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

  // Transform active trips from API to UI format with real-time updates
  const activeTrips = useMemo<ActiveTrip[]>(() => {
    const driverColors = [
      '#2F6FED',
      '#8B5CF6',
      '#F59E0B',
      '#EF4444',
      '#059669',
      '#0EA5E9',
    ];

    const response = activeTripsQuery.data;
    const trips =
      response && 'data' in response && response.success ? response.data : [];
    return trips.map((trip, index) => {
      const nameParts = (trip.driver_name || '').split(' ');
      const initials =
        nameParts.length > 1
          ? `${nameParts[0][0]}${nameParts[1][0]}`
          : nameParts[0]?.substring(0, 2) || 'DR';

      // Get real-time location update from socket if available
      const realtimeUpdate = locationUpdates.get(trip.ride_id);

      // Use real-time speed if available, otherwise fall back to API data
      const currentSpeed = realtimeUpdate?.speed ?? trip.current_speed;

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
        eta: trip.eta_minutes ? formatEta(trip.eta_minutes) : 'N/A',
        patientName: trip.patient_name || 'Unknown Patient',
        driverName: trip.driver_name || 'Unassigned',
        driverInitials: initials.toUpperCase(),
        driverInitialsColor: driverColors[index % driverColors.length],
        speed: currentSpeed ? `${Math.round(currentSpeed)} mph` : '0 mph',
        progress: trip.progress_percent || 0,
        // Store real-time location for map updates
        location: realtimeUpdate
          ? {
              lat: realtimeUpdate.latitude,
              lng: realtimeUpdate.longitude,
              heading: realtimeUpdate.heading,
            }
          : trip.current_latitude && trip.current_longitude
            ? {
                lat: trip.current_latitude,
                lng: trip.current_longitude,
                heading: trip.current_heading ?? undefined,
              }
            : undefined,
      };
    });
  }, [activeTripsQuery.data, locationUpdates]);

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

  // Compute driving route for the dispatch map polyline
  const computeRoute = useCallback(
    async (input: {
      origin: MarkerPosition;
      destination: MarkerPosition;
      waypoints?: MarkerPosition[];
    }): Promise<{ polyline: MarkerPosition[] } | null> => {
      try {
        const routesLib = (await google.maps.importLibrary('routes')) as any;
        const Route = routesLib.Route;

        const request: Record<string, any> = {
          origin: input.origin,
          destination: input.destination,
          travelMode: 'DRIVE',
          fields: ['path'],
        };

        if (input.waypoints?.length) {
          request.intermediates = input.waypoints;
        }

        const { routes } = await Route.computeRoutes(request);

        const route = routes?.[0];
        if (!route?.path?.length) return null;

        const polyline: MarkerPosition[] = route.path.map((point: any) => ({
          lat: typeof point.lat === 'function' ? point.lat() : point.lat,
          lng: typeof point.lng === 'function' ? point.lng() : point.lng,
        }));

        return { polyline };
      } catch {
        return null;
      }
    },
    []
  );

  // Build map props from selected trip detail + real-time socket data
  const realtimeUpdate = selectedTripId
    ? locationUpdates.get(selectedTripId)
    : undefined;

  const driverLat =
    realtimeUpdate?.latitude ??
    selectedTripDetailData?.current_latitude ??
    selectedTrip?.location?.lat;
  const driverLng =
    realtimeUpdate?.longitude ??
    selectedTripDetailData?.current_longitude ??
    selectedTrip?.location?.lng;
  const driverHeading =
    realtimeUpdate?.heading ??
    selectedTripDetailData?.current_heading ??
    selectedTrip?.location?.heading;

  const destLat = selectedTripDetailData?.destination_latitude;
  const destLng = selectedTripDetailData?.destination_longitude;

  const hasTruckPosition = driverLat != null && driverLng != null;
  const hasDestination = destLat != null && destLng != null;

  const kpis = dashboardData?.kpis || {
    pending_assignments: 0,
    assigned_today: 0,
    available_drivers: 0,
    drivers_on_trip: 0,
  };

  const statCards = [
    {
      icon: pendingIcon,
      value: kpis.pending_assignments.toString(),
      label: 'Pending Assignments',
      subtitle: 'Awaiting driver',
      badge: {
        text: `${kpis.pending_assignments} pending`,
        color: '#F59E0B',
        bg: '#FFFBEB',
      },
    },
    {
      icon: tripIcon,
      value: kpis.assigned_today.toString(),
      label: 'Assigned Today',
      subtitle: 'Dispatched trips',
      badge: {
        text: "Today's total",
        color: '#2F6FED',
        bg: '#EEF3FF',
      },
    },
    {
      icon: driverIcon,
      value: kpis.available_drivers.toString(),
      label: 'Available Drivers',
      subtitle: 'Ready to dispatch',
      badge: { text: 'Online now', color: '#059669', bg: '#ECFDF5' },
    },
    {
      icon: userGroupIcon,
      value: kpis.drivers_on_trip.toString(),
      label: 'Drivers on Trip',
      subtitle: 'Currently active',
      badge: { text: 'In transit', color: '#9CA3AF', bg: '#F3F4F6' },
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

          {/* Real-time Connection Status */}
          {/* <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              background: isConnected && isJoined ? '#ECFDF5' : '#FEF2F2',
              border: `0.67px solid ${isConnected && isJoined ? '#059669' : '#EF4444'}`,
            }}
          >
            <Box
              sx={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: isConnected && isJoined ? '#059669' : '#EF4444',
                animation:
                  isConnected && isJoined ? 'pulse 2s infinite' : 'none',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.5 },
                },
              }}
            />
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(12),
                color: isConnected && isJoined ? '#059669' : '#EF4444',
              }}
            >
              {isConnected && isJoined ? 'Live Tracking' : 'Connecting...'}
            </Typography>
          </Box> */}

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
          {isFetchingDashboard
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
                  {isFetchingActiveTrips
                    ? 'Loading...'
                    : `${activeTrips.length} trips in progress`}
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
                    markerPositions={
                      hasDestination ? [{ lat: destLat!, lng: destLng! }] : []
                    }
                    truckMarker={
                      hasTruckPosition
                        ? {
                            position: {
                              lat: driverLat!,
                              lng: driverLng!,
                            },
                            heading: driverHeading ?? 0,
                          }
                        : undefined
                    }
                    mapContainerStyle={{ width: '100%', height: '400px' }}
                    showDirections={hasTruckPosition && hasDestination}
                    computeRoute={computeRoute}
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
                  tripId={
                    selectedTripDetailData?.trip_id_display ||
                    selectedTrip.tripId
                  }
                  patientName={
                    selectedTripDetailData?.patient_name ||
                    selectedTrip.patientName
                  }
                  driverName={
                    selectedTripDetailData?.driver_name ||
                    selectedTrip.driverName
                  }
                  driverPhone={
                    selectedTripDetailData?.driver_phone || undefined
                  }
                  speed={
                    realtimeUpdate?.speed != null
                      ? `${Math.round(realtimeUpdate.speed)} mph`
                      : selectedTripDetailData?.current_speed != null
                        ? `${Math.round(selectedTripDetailData.current_speed)} mph`
                        : selectedTrip.speed
                  }
                  eta={
                    selectedTripDetailData?.eta_minutes != null
                      ? formatEta(selectedTripDetailData.eta_minutes)
                      : selectedTrip.eta
                  }
                  progress={
                    selectedTripDetailData?.progress_percent ??
                    selectedTrip.progress
                  }
                  status={selectedTripDetailData?.status || selectedTrip.status}
                  statusColor={selectedTrip.statusColor}
                  pickup={
                    selectedTripDetailData?.pickup_address || 'Loading...'
                  }
                  destination={
                    selectedTripDetailData?.destination_address || 'Loading...'
                  }
                  vehicle={selectedTripDetailData?.driver_vehicle || undefined}
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
