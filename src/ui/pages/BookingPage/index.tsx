'use client';

import { useState, useMemo } from 'react';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppGridtable,
  AppPillCount,
  AppSearchField,
  DashboardTitleAndDesc,
  RowStack,
  StyledImage,
} from '../../modules/components';
import { pxToRem, useGetAllBookings } from '../../../common';
import { RideResponse } from '../../../common/types';
import { GridColSpec } from '../../modules/components/GridTable';
import { EmptyState } from '../../modules/blocks';
import filterIcon from './ui/assets/icons/filter-Icon.svg';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import dayjs from 'dayjs';
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
    | 'Pending'
    | 'Approved'
    | 'Declined'
    | 'None'
    | 'Processed'
    | 'Full Refund';
};

export const BookingPage = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [openApprove, setOpenApprove] = useState<boolean>(false);
  const [openDecline, setOpenDecline] = useState<boolean>(false);
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [statusDetail, setStatusDetail] = useState<BookingRow['status']>(null);

  const filterToApiStatus: Record<string, string | undefined> = {
    All: undefined,
    Pending: 'pending',
    Approved: 'approved',
    Declined: 'declined',
  };

  const bookingsQuery = useGetAllBookings({
    status: filterToApiStatus[activeFilter],
    search: searchQuery || undefined,
    page,
    limit: pageSize,
  });
  const allCountQuery = useGetAllBookings({ page: 1, limit: 1 });
  const pendingCountQuery = useGetAllBookings({ status: 'pending', page: 1, limit: 1 });
  const approvedCountQuery = useGetAllBookings({ status: 'approved', page: 1, limit: 1 });
  const declinedCountQuery = useGetAllBookings({ status: 'declined', page: 1, limit: 1 });

  const bookingsData = bookingsQuery.data;

  const statusMap: Record<string, BookingRow['status']> = {
    requested: 'Pending',
    pending: 'Pending',
    approved: 'Approved',
    confirmed: 'Approved',
    accepted: 'Approved',
    declined: 'Declined',
    rejected: 'Declined',
    cancelled: 'Declined',
  };

  const filteredBookings = useMemo(() => {
    if (!bookingsData?.data?.length) return [];
    return bookingsData.data.map((ride: RideResponse, index: number) => ({
      id: ride.id,
      bookingId: `BK-${String((bookingsData.total ?? 0) - ((bookingsData.page - 1) * (bookingsData.limit ?? 10)) - index + 20484).padStart(5, '0')}`,
      patient: ride.facility_name || ride.rider_id.slice(0, 8),
      pickupLocation: ride.pickup_address,
      destination: ride.destination_address,
      dateTime: dayjs(ride.scheduled_at).format('MMM D, YYYY · hh:mm A'),
      status: statusMap[ride.status?.toLowerCase()] || 'Pending',
    }));
  }, [bookingsData]);

  const statusFilter = [
    { text: 'All', count: allCountQuery.data?.total ?? 0, active: activeFilter === 'All' },
    { text: 'Pending', count: pendingCountQuery.data?.total ?? 0, active: activeFilter === 'Pending' },
    { text: 'Approved', count: approvedCountQuery.data?.total ?? 0, active: activeFilter === 'Approved' },
    { text: 'Declined', count: declinedCountQuery.data?.total ?? 0, active: activeFilter === 'Declined' },
  ];

  const handleOpenApprove = () => {
    setOpenApprove(true);
  };
  const handleOpenDetail = (status: BookingRow['status']) => {
    setOpenDetail(true);
    setStatusDetail(status);
  };

  const handleCloseApprove = () => {
    setOpenApprove(false);
  };

  const handleOpenDecline = () => {
    setOpenDecline(true);
  };

  const handleCloseDecline = () => {
    setOpenDecline(false);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
  };

  const columns: GridColSpec<BookingRow>[] = [
    {
      field: 'bookingId',
      headerName: 'Booking ID',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => <BookingIdComponent bookingId={params.value} />,
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
        const status = params.row.status;
        return (
          <RowStack spacing={0.5}>
            <IconButton
              size="small"
              sx={{
                color: '#9CA3AF',
              }}
              onClick={() => handleOpenDetail(status)}
            >
              <VisibilityOutlinedIcon sx={{ fontSize: 15 }} />
            </IconButton>
            {status === 'Pending' && (
              <>
                <IconButton
                  size="small"
                  sx={{
                    color: '#9CA3AF',
                  }}
                  onClick={handleOpenApprove}
                >
                  <CheckCircleOutlineIcon sx={{ fontSize: 15 }} />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{
                    color: '#9CA3AF',
                  }}
                  onClick={handleOpenDecline}
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
        text="BK-20491 · Claire Beaumont · Mar 9, 2026 · 09:00 AM"
        location="120 King St W, Toronto, ON → Toronto General Hospital"
        textBeforeBtn="This will mark the booking as approved and notify the patient."
        textBtn="Confirm Approval"
        btnBg="#059669"
      />
      <ApproveDeclineModal
        modalLabel="decline-modal"
        open={openDecline}
        handleClose={handleCloseDecline}
        title="Decline Booking"
        text="BK-20491 · Claire Beaumont · Mar 9, 2026 · 09:00 AM"
        location="120 King St W, Toronto, ON → Toronto General Hospital"
        textBeforeBtn="This will decline the booking and notify the patient."
        textBtn="Confirm Decline"
        btnBg="#EF4444"
      />
      <BookingDetailModal
        open={openDetail}
        handleClose={handleCloseDetail}
        bookingId={'BK-20491'}
        status={statusDetail}
      />
    </AppDashboardLayout>
  );
};
