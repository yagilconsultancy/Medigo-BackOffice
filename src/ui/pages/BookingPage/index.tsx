'use client';

import { useState, useMemo } from 'react';
import { IconButton, Stack } from '@mui/material';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppGridtable,
  AppPillCount,
  AppSearchField,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import {
  useGetAllBookings,
  useApproveBooking,
  useDeclineBooking,
} from '../../../common';
import { RideResponse } from '../../../common/types';
import { GridColSpec } from '../../modules/components/GridTable';
import { EmptyState } from '../../modules/blocks';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import dayjs from 'dayjs';
import { toast } from 'sonner';
import {
  ApproveDeclineModal,
  BookingDetailModal,
  BookingIdComponent,
  ClientComponent,
  StatusComponent,
} from './ui/components';

export type BookingRow = {
  id: string;
  bookingId: string;
  patient: string;
  pickupLocation: string;
  destination: string;
  dateTime: string;
  status:
    | 'requested'
    | 'pending_business_assignment'
    | 'confirmed'
    | 'driver_assigned'
    | 'driver_en_route'
    | 'driver_arrived'
    | 'in_progress'
    | 'completed'
    | 'cancelled'
    | 'no_show';
};

export const BookingPage = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<BookingRow | null>(
    null
  );
  const [openApprove, setOpenApprove] = useState<boolean>(false);
  const [openDecline, setOpenDecline] = useState<boolean>(false);
  const [openDetail, setOpenDetail] = useState<boolean>(false);

  const approveBookingMutation = useApproveBooking();
  const declineBookingMutation = useDeclineBooking();

  const filterToApiStatus: Record<string, string | undefined> = {
    All: 'requested,confirmed,cancelled,completed',
    Pending: 'requested',
    Approved: 'confirmed',
    Declined: 'cancelled',
    Completed: 'completed',
  };

  const bookingsQuery = useGetAllBookings({
    status: filterToApiStatus[activeFilter],
    search: searchQuery || undefined,
    page,
    limit: pageSize,
  });
  const allCountQuery = useGetAllBookings({
    status: 'requested,confirmed,cancelled,completed',
    page: 1,
    limit: 1,
  });
  const requestedCountQuery = useGetAllBookings({
    status: 'requested',
    page: 1,
    limit: 1,
  });
  const confirmedCountQuery = useGetAllBookings({
    status: 'confirmed',
    page: 1,
    limit: 1,
  });
  const cancelledCountQuery = useGetAllBookings({
    status: 'cancelled',
    page: 1,
    limit: 1,
  });
  const completedCountQuery = useGetAllBookings({
    status: 'completed',
    page: 1,
    limit: 1,
  });

  const bookingsData = bookingsQuery.data;

  const statusMap: Record<string, BookingRow['status']> = {
    requested: 'requested',
    pending_business_assignment: 'pending_business_assignment',
    confirmed: 'confirmed',
    driver_assigned: 'driver_assigned',
    driver_en_route: 'driver_en_route',
    driver_arrived: 'driver_arrived',
    in_progress: 'in_progress',
    completed: 'completed',
    cancelled: 'cancelled',
    no_show: 'no_show',
  };

  const filteredBookings = useMemo(() => {
    if (!bookingsData?.data?.length) return [];
    return bookingsData.data.map((ride: RideResponse, index: number) => ({
      id: ride.id,
      bookingId: ride.id.padStart(5, '0'),
      patient: ride.rider_name,
      pickupLocation: ride.pickup_address,
      destination: ride.destination_address,
      dateTime: dayjs(ride.scheduled_at).format('MMM D, YYYY · hh:mm A'),
      status: statusMap[ride.status?.toLowerCase()] || 'requested',
    }));
  }, [bookingsData]);

  const statusFilter = [
    {
      text: 'All',
      count: allCountQuery.data?.total ?? 0,
      active: activeFilter === 'All',
    },
    {
      text: 'Pending',
      count: requestedCountQuery.data?.total ?? 0,
      active: activeFilter === 'Pending',
    },
    {
      text: 'Approved',
      count: confirmedCountQuery.data?.total ?? 0,
      active: activeFilter === 'Approved',
    },
    {
      text: 'Completed',
      count: completedCountQuery.data?.total ?? 0,
      active: activeFilter === 'Completed',
    },
    {
      text: 'Declined',
      count: cancelledCountQuery.data?.total ?? 0,
      active: activeFilter === 'Declined',
    },
  ];

  const handleOpenApprove = (booking: BookingRow) => {
    setSelectedBooking(booking);
    setOpenApprove(true);
  };

  const handleOpenDecline = (booking: BookingRow) => {
    setSelectedBooking(booking);
    setOpenDecline(true);
  };

  // const handleOpenDetail = (booking: BookingRow) => {
  //   setSelectedBooking(booking);
  //   setOpenDetail(true);
  // };

  const handleCloseApprove = () => setOpenApprove(false);
  const handleCloseDecline = () => setOpenDecline(false);
  const handleCloseDetail = () => setOpenDetail(false);

  const handleConfirmApprove = () => {
    if (!selectedBooking) return;
    approveBookingMutation.mutate(
      { rideId: selectedBooking.id },
      {
        onSuccess: () => {
          toast.success('Booking approved successfully');
          handleCloseApprove();
        },
        onError: () => {
          toast.error('Failed to approve booking');
        },
      }
    );
  };

  const handleConfirmDecline = () => {
    if (!selectedBooking) return;
    declineBookingMutation.mutate(
      { rideId: selectedBooking.id, reason: 'Declined by admin' },
      {
        onSuccess: () => {
          toast.success('Booking declined successfully');
          handleCloseDecline();
        },
        onError: () => {
          toast.error('Failed to decline booking');
        },
      }
    );
  };

  const columns: GridColSpec<BookingRow>[] = [
    {
      field: 'bookingId',
      headerName: 'Booking ID',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <BookingIdComponent bookingId={params.value.slice(0, 7)} />
      ),
    },
    {
      field: 'patient',
      headerName: 'Client',
      flex: 1.2,
      minWidth: 150,
      renderCell: (params) => <ClientComponent text={params.value} />,
    },
    {
      field: 'pickupLocation',
      headerName: 'Pickup Location',
      flex: 1.5,
      minWidth: 180,
    },
    {
      field: 'destination',
      headerName: 'Destination',
      flex: 1.3,
      minWidth: 180,
    },
    {
      field: 'dateTime',
      headerName: 'Date & Time',
      flex: 1.3,
      minWidth: 180,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => (
        <StatusComponent status={params.value as BookingRow['status']} />
      ),
    },
    {
      field: 'actions' as string,
      headerName: 'Actions',
      flex: 0.8,
      minWidth: 120,
      sortable: false,
      renderCell: (params) => {
        const row = params.row;
        return (
          <RowStack spacing={0.5}>
            {/* <IconButton
              size="small"
              sx={{
                color: '#9CA3AF',
              }}
              onClick={() => handleOpenDetail(row)}
            >
              <VisibilityOutlinedIcon sx={{ fontSize: 15 }} />
            </IconButton> */}
            {row.status === 'requested' && (
              <>
                <IconButton
                  size="small"
                  sx={{
                    color: '#9CA3AF',
                  }}
                  onClick={() => handleOpenApprove(row)}
                >
                  <CheckCircleOutlineIcon sx={{ fontSize: 15 }} />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{
                    color: '#9CA3AF',
                  }}
                  onClick={() => handleOpenDecline(row)}
                >
                  <CancelOutlinedIcon sx={{ fontSize: 15 }} />
                </IconButton>
              </>
            )}
          </RowStack>
        );
      },
    },
  ];

  return (
    <AppDashboardLayout>
      <Stack spacing={3}>
        <DashboardTitleAndDesc
          title="Booking Management"
          desc={`Review, approve, and manage all patient transport bookings`}
        />
        <AppGridtable
          columns={columns}
          data={filteredBookings}
          disableAutoPagination
          totalRows={bookingsData?.total ?? 0}
          initialPageSize={pageSize}
          isFetchingData={bookingsQuery.isFetching}
          onPaginationModelChange={(model) => {
            setPage(model.page + 1);
          }}
          emptyState={<EmptyState animationSrc="/empty.json" />}
          sx={{
            height: 'auto',
            width: '100%',
          }}
        >
          <RowStack justifyContent={'space-between'} width={'100%'}>
            <RowStack spacing={1}>
              {statusFilter.map((filter, index) => (
                <AppPillCount
                  {...filter}
                  key={index}
                  onClick={() => {
                    setActiveFilter(filter.text);
                    setPage(1);
                  }}
                />
              ))}
            </RowStack>
            <AppSearchField
              name="search"
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              boxProps={{
                sx: { width: '240px' },
              }}
            />
          </RowStack>
        </AppGridtable>
      </Stack>
      <ApproveDeclineModal
        modalLabel="approve-modal"
        open={openApprove}
        handleClose={handleCloseApprove}
        title="Approve Booking"
        text={`${selectedBooking?.bookingId} · ${selectedBooking?.patient} · ${selectedBooking?.dateTime}`}
        location={`${selectedBooking?.pickupLocation} → ${selectedBooking?.destination}`}
        textBeforeBtn="This will mark the booking as approved and notify the patient."
        textBtn="Confirm Approval"
        btnBg="#059669"
        onConfirm={handleConfirmApprove}
        isLoading={approveBookingMutation.isPending}
      />
      <ApproveDeclineModal
        modalLabel="decline-modal"
        open={openDecline}
        handleClose={handleCloseDecline}
        title="Decline Booking"
        text={`${selectedBooking?.bookingId} · ${selectedBooking?.patient} · ${selectedBooking?.dateTime}`}
        location={`${selectedBooking?.pickupLocation} → ${selectedBooking?.destination}`}
        textBeforeBtn="This will decline the booking and notify the patient."
        textBtn="Confirm Decline"
        btnBg="#EF4444"
        onConfirm={handleConfirmDecline}
        isLoading={declineBookingMutation.isPending}
      />
      <BookingDetailModal
        open={openDetail}
        handleClose={handleCloseDetail}
        bookingId={selectedBooking?.bookingId.slice(0, 7) ?? ''}
        rideId={selectedBooking?.id ?? ''}
        status={selectedBooking?.status ?? 'requested'}
        patientName={selectedBooking?.patient ?? ''}
        dateTime={selectedBooking?.dateTime ?? ''}
        pickup={selectedBooking?.pickupLocation ?? ''}
        destination={selectedBooking?.destination ?? ''}
        onApprove={() => setOpenApprove(true)}
        onDecline={() => setOpenDecline(true)}
      />
    </AppDashboardLayout>
  );
};
