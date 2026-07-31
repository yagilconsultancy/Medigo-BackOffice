'use client';

import { Grid, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import { EmptyState } from '../../modules/blocks';
import { AppGridtable, AppPillCount, RowStack } from '../../modules/components';
import { GridColSpec } from '../../modules/components/GridTable';
import {
  pxToRem,
  useGetUnassignedRides,
  useGetAvailableDispatchDrivers,
  useResolvedApiQuery,
  useDispatchApi,
  useGetAllBookings,
  RIDE_STATUS_IN_FLIGHT,
  toStatusParam,
} from '../../../common';
import { useState, useMemo } from 'react';
import {
  UnassignedRideCard,
  UnassignedRide,
  RideDriverCard,
  RideDriver,
} from './ui/components';
import {
  BookingDetailModal,
  BookingIdComponent,
  ClientComponent,
  StatusComponent,
} from '../BookingPage/ui/components';
import { BookingRow } from '../BookingPage';
import dayjs from 'dayjs';

// ─── Component ──────────────────────────────────────────────────────────────

type Assignment = {
  driverId: string;
  driverName: string;
};

type AssignedRideRow = {
  id: string;
  bookingId: string;
  patient: string;
  driver: string;
  pickupLocation: string;
  destination: string;
  dateTime: string;
  status: string;
};

export const RideAssignmentPage = () => {
  const router = useRouter();
  const [selectedRideId, setSelectedRideId] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<Record<string, Assignment>>(
    {}
  );
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [selectedRideForDetail, setSelectedRideForDetail] = useState<
    string | null
  >(null);
  const [activeTab, setActiveTab] = useState<'Unassigned' | 'Assigned'>(
    'Unassigned'
  );
  const [assignedPage, setAssignedPage] = useState(1);

  // Called directly, not through useResolvedApiQuery: this endpoint returns a
  // paginated envelope ({data, total, ...}), which that helper mis-unwraps.
  const assignedQuery = useGetAllBookings({
    status: toStatusParam(RIDE_STATUS_IN_FLIGHT),
    page: assignedPage,
    limit: 10,
  });

  // Fetch unassigned rides and available drivers
  const { data: unassignedRidesData } = useResolvedApiQuery(
    useGetUnassignedRides,
    null,
    {
      page: 1,
      limit: 20,
    }
  );
  const { data: availableDriversData } = useResolvedApiQuery(
    useGetAvailableDispatchDrivers,
    null
  );
  const { manuallyAssignDriver } = useDispatchApi();

  const resolvedUnassignedRides = useMemo(() => {
    return unassignedRidesData?.rides || [];
  }, [unassignedRidesData]);

  const assignedRows = useMemo<AssignedRideRow[]>(() => {
    const rides = assignedQuery.data?.data ?? [];
    return rides.map((ride) => ({
      id: ride.id,
      bookingId: ride.id.slice(0, 7).toUpperCase(),
      patient: ride.rider_name || '—',
      driver: ride.driver_name || 'Unassigned',
      pickupLocation: ride.pickup_address,
      destination: ride.destination_address,
      dateTime: dayjs(ride.scheduled_at).format('MMM D, YYYY · hh:mm A'),
      status: ride.status,
    }));
  }, [assignedQuery.data]);

  const resolvedAvailableDrivers = useMemo(() => {
    return availableDriversData || [];
  }, [availableDriversData]);
  // Transform unassigned rides to UI format
  const allRides = useMemo<UnassignedRide[]>(() => {
    const rideColors = [
      { color: '#2F6FED', bg: '#EBF2FF' },
      { color: '#059669', bg: '#ECFDF5' },
      { color: '#8B5CF6', bg: '#F3F0FF' },
      { color: '#F59E0B', bg: '#FFFBEB' },
      { color: '#EF4444', bg: '#FEF2F2' },
    ];

    return (resolvedUnassignedRides || []).map((ride, index) => {
      const colorScheme = rideColors[index % rideColors.length];
      const specialReq = ride.special_requirements?.[0] || 'Standard Ride';

      let specialNoteBg = '#EBF2FF';
      let specialNoteColor = '#2F6FED';
      if (specialReq.toLowerCase().includes('wheelchair')) {
        specialNoteBg = '#FFFBEB';
        specialNoteColor = '#D97706';
      } else if (
        specialReq.toLowerCase().includes('assist') ||
        specialReq.toLowerCase().includes('care')
      ) {
        specialNoteBg = '#FEF3C7';
        specialNoteColor = '#92400E';
      }

      return {
        id: ride.ride_id,
        bookingId: ride.booking_number,
        bookingIdColor: colorScheme.color,
        bookingIdBg: colorScheme.bg,
        patientName: ride.rider_name,
        pickup: ride.pickup_address,
        destination: ride.destination_address,
        time: new Date(ride.scheduled_at).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
        distance: ride.distance_km
          ? `${(ride.distance_km * 0.621371).toFixed(1)} mi`
          : 'N/A',
        specialNote: specialReq,
        specialNoteBg,
        specialNoteColor,
      };
    });
  }, [resolvedUnassignedRides]);

  // Transform available drivers to UI format
  const allDrivers = useMemo<RideDriver[]>(() => {
    const driverColors = [
      '#8B5CF6',
      '#F59E0B',
      '#0EA5E9',
      '#EF4444',
      '#2F6FED',
      '#059669',
    ];

    return (resolvedAvailableDrivers || []).map((driver, index) => {
      const nameParts = driver.driver_name.split(' ');
      const initials =
        nameParts.length > 1
          ? `${nameParts[0][0]}${nameParts[1][0]}`
          : nameParts[0].substring(0, 2);

      return {
        id: driver.driver_id,
        initials: initials.toUpperCase(),
        initialsColor: driverColors[index % driverColors.length],
        name: driver.driver_name,
        vehicle: driver.vehicle_info,
        rating: driver.rating,
        trips: driver.total_trips,
        distance: driver.distance_from_pickup
          ? `${driver.distance_from_pickup.toFixed(1)} mi`
          : 'N/A',
        eta: driver.eta_minutes ? `${driver.eta_minutes} min` : 'N/A',
      };
    });
  }, [resolvedAvailableDrivers]);

  const assignedDriverIds = new Set(
    Object.values(assignments).map((a) => a.driverId)
  );
  const filteredDrivers = allDrivers.filter(
    (d) => !assignedDriverIds.has(d.id)
  );

  const handleAssign = async (driverId: string) => {
    if (!selectedRideId) return;

    const driver = allDrivers.find((d) => d.id === driverId);
    const ride = allRides.find((r) => r.id === selectedRideId);
    if (!driver || !ride) return;

    const success = await manuallyAssignDriver({
      rideId: selectedRideId,
      driver_id: driverId,
    });

    if (success) {
      setAssignments((prev) => ({
        ...prev,
        [selectedRideId]: { driverId, driverName: driver.name },
      }));
      setSelectedRideId(null);
    }
  };

  const handleRideClick = (rideId: string) => {
    setSelectedRideId((prev) => (prev === rideId ? null : rideId));
  };

  const assignedColumns: GridColSpec<AssignedRideRow>[] = [
    {
      field: 'bookingId',
      headerName: 'Booking ID',
      flex: 1,
      minWidth: 110,
      renderCell: (params) => <BookingIdComponent bookingId={params.value} />,
    },
    {
      field: 'patient',
      headerName: 'Client',
      flex: 1.1,
      minWidth: 140,
      renderCell: (params) => <ClientComponent text={params.value} />,
    },
    {
      field: 'driver',
      headerName: 'Driver',
      flex: 1,
      minWidth: 130,
    },
    {
      field: 'pickupLocation',
      headerName: 'Pickup Location',
      flex: 1.4,
      minWidth: 170,
    },
    {
      field: 'destination',
      headerName: 'Destination',
      flex: 1.3,
      minWidth: 170,
    },
    {
      field: 'dateTime',
      headerName: 'Date & Time',
      flex: 1.2,
      minWidth: 170,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.9,
      minWidth: 120,
      renderCell: (params) => (
        <StatusComponent status={params.value as BookingRow['status']} />
      ),
    },
  ];

  const handleViewDetails = (rideId: string) => {
    setSelectedRideForDetail(rideId);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedRideForDetail(null);
  };

  const selectedRideDetail = useMemo(() => {
    if (!selectedRideForDetail) return null;
    const apiRide = resolvedUnassignedRides.find(
      (r) => r.ride_id === selectedRideForDetail
    );
    const uiRide = allRides.find((r) => r.id === selectedRideForDetail);
    if (!apiRide || !uiRide) return null;
    return {
      bookingId: apiRide.booking_number?.slice(0, 7) || '',
      rideId: apiRide.ride_id,
      // @ts-ignore
      status: apiRide.status?.toLowerCase() as any,
      patientName: apiRide.rider_name,
      dateTime: dayjs(apiRide.scheduled_at).format('MMM D, YYYY · hh:mm A'),
      pickup: apiRide.pickup_address,
      destination: apiRide.destination_address,
      specialRequirements: apiRide.special_requirements?.join(', '),
    };
  }, [selectedRideForDetail, resolvedUnassignedRides, allRides]);

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <Stack spacing={'4px'}>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 500,
              fontSize: pxToRem(24),
              lineHeight: '36px',
              color: (theme) => theme.color.deepBlue,
            }}
          >
            Ride Assignment
          </Typography>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(14),
              lineHeight: '21px',
              color: (theme) => theme.color.lightGrey,
            }}
          >
            Manually assign or reassign drivers to pending rides
          </Typography>
        </Stack>

        {/* Assigned rides used to be reachable only by drilling into a driver,
            so they get their own tab here. */}
        <RowStack spacing={1}>
          <AppPillCount
            text="Unassigned"
            count={allRides.length}
            active={activeTab === 'Unassigned'}
            onClick={() => setActiveTab('Unassigned')}
          />
          <AppPillCount
            text="Assigned"
            count={assignedQuery.data?.total ?? 0}
            active={activeTab === 'Assigned'}
            onClick={() => setActiveTab('Assigned')}
          />
        </RowStack>

        {activeTab === 'Assigned' ? (
          <AppGridtable<AssignedRideRow>
            columns={assignedColumns}
            data={assignedRows}
            disableAutoPagination
            totalRows={assignedQuery.data?.total ?? 0}
            isFetchingData={assignedQuery.isFetching}
            initialPageSize={10}
            onPaginationModelChange={(model) => {
              setAssignedPage(model.page + 1);
            }}
            onRowClick={(row) => router.push(`/dispatch/rides/${row.id}`)}
            emptyState={<EmptyState emptyState="No Assigned Rides" />}
            sx={{ height: 'auto', width: '100%' }}
          >
            <Stack spacing={'2px'} sx={{ pb: 1 }}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(15),
                  color: (theme) => theme.color.deepBlue,
                }}
              >
                Assigned Rides
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12),
                  color: (theme) => theme.color.lightGrey,
                }}
              >
                Rides with a driver attached. Select one to open its full
                record.
              </Typography>
            </Stack>
          </AppGridtable>
        ) : (
          /* Two-Column Layout */
          <Grid container spacing={'20px'} alignItems="stretch">
            {/* Left: Unassigned Rides */}
            <Grid size={{ xs: 12, lg: 6 }} sx={{ height: 'auto' }}>
              <Stack
                spacing={'12px'}
                sx={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '0.67px solid #EAECF0',
                  maxHeight: '700px',
                  overflowY: 'auto',
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
                    Select a booking to assign a driver
                  </Typography>
                </Stack>

                {allRides.length === 0 ? (
                  <Stack
                    sx={{
                      height: '400px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <EmptyState emptyState="No Approved Booking" />
                  </Stack>
                ) : (
                  <>
                    {allRides.map((ride) => (
                      <UnassignedRideCard
                        key={ride.id}
                        ride={{
                          ...ride,
                          assignedDriver: assignments[ride.id]?.driverName,
                        }}
                        isSelected={selectedRideId === ride.id}
                        onClick={() => handleRideClick(ride.id)}
                        onViewDetails={() => handleViewDetails(ride.id)}
                      />
                    ))}
                  </>
                )}
              </Stack>
            </Grid>

            {/* Right: Available Drivers */}
            <Grid size={{ xs: 12, lg: 6 }} sx={{ height: 'auto' }}>
              <Stack
                spacing={'12px'}
                sx={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '0.67px solid #EAECF0',
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
                    Select a driver to assign
                  </Typography>
                </Stack>

                {filteredDrivers.length === 0 ? (
                  <Stack
                    sx={{
                      height: '400px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <EmptyState emptyState="No Available Drivers" />
                  </Stack>
                ) : (
                  <>
                    {filteredDrivers.map((driver) => (
                      <RideDriverCard
                        key={driver.id}
                        driver={driver}
                        isActive={!!selectedRideId}
                        onAssign={() => handleAssign(driver.id)}
                      />
                    ))}
                  </>
                )}
              </Stack>
            </Grid>
          </Grid>
        )}
      </Stack>
      {selectedRideDetail && (
        <BookingDetailModal
          open={openDetail}
          handleClose={handleCloseDetail}
          bookingId={selectedRideDetail.bookingId}
          rideId={selectedRideDetail.rideId}
          status={selectedRideDetail.status}
          patientName={selectedRideDetail.patientName}
          dateTime={selectedRideDetail.dateTime}
          pickup={selectedRideDetail.pickup}
          destination={selectedRideDetail.destination}
          specialRequirements={selectedRideDetail.specialRequirements}
        />
      )}
    </AppDashboardLayout>
  );
};
