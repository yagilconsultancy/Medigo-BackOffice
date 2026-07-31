'use client';

import { useState, useMemo } from 'react';
import { IconButton, Stack, Tooltip } from '@mui/material';
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
  useAssignDriverToBooking,
  useReassignDriver,
  useAssignCareAssistantToBooking,
  extractValidationErrorMessage,
  useDebouncedValue,
  RIDE_STATUS_ALL,
  RIDE_STATUS_APPROVED,
  RIDE_STATUS_COMPLETED,
  RIDE_STATUS_DECLINED,
  RIDE_STATUS_IN_FLIGHT,
  RIDE_STATUS_PENDING,
  toStatusParam,
} from '../../../common';
import {
  AssignDriverModal,
  AssignCareAssistantModal,
} from '../BookingDetailPage/ui/components';
import { RideResponse } from '../../../common/types';
import { GridColSpec } from '../../modules/components/GridTable';
import { EmptyState } from '../../modules/blocks';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';
import LocalTaxiOutlinedIcon from '@mui/icons-material/LocalTaxiOutlined';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import { DeleteBookingModal } from '../CancelledTripsPage/ui/components';
import dayjs from 'dayjs';
import { toast } from 'sonner';
import {
  ApproveDeclineModal,
  BookingDetailModal,
  BookingIdComponent,
  ClientComponent,
  EditBookingModal,
  StatusComponent,
} from './ui/components';

// Bookings can only be edited before they are in transit or finished.
const NON_EDITABLE_STATUSES: BookingRow['status'][] = [
  'in_progress',
  'completed',
  'cancelled',
  'no_show',
];

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
  tripType: string;
  driverId?: string | null;
  caregiverId?: string | null;
  /** The rider's own note from the booking form ("Additional Notes"). */
  specialInstructions?: string | null;
  phoneNum?: string | null;
};

// A driver can be assigned before one exists (requested/confirmed)...
const DRIVER_ASSIGN_STATUSES: BookingRow['status'][] = [
  'requested',
  'confirmed',
];
// ...or reassigned to another once one is already on the trip.
const DRIVER_REASSIGN_STATUSES: BookingRow['status'][] = [
  'driver_assigned',
  'driver_en_route',
  'driver_arrived',
];

// Care assistants are only assignable on care-assistant trips before pickup.
const CARE_ASSISTANT_ASSIGNABLE_STATUSES: BookingRow['status'][] = [
  'requested',
  'confirmed',
];

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
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openAssignDriver, setOpenAssignDriver] = useState<boolean>(false);
  const [openAssignCareAssistant, setOpenAssignCareAssistant] =
    useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  const approveBookingMutation = useApproveBooking();
  const declineBookingMutation = useDeclineBooking();
  const assignDriverMutation = useAssignDriverToBooking();
  const reassignDriverMutation = useReassignDriver();
  const assignCareAssistantMutation = useAssignCareAssistantToBooking();

  // "All" has to cover every status — leaving the in-flight ones out made any
  // booking with a driver attached invisible on every tab.
  const filterToApiStatus: Record<string, string> = {
    All: toStatusParam(RIDE_STATUS_ALL),
    Pending: toStatusParam(RIDE_STATUS_PENDING),
    Approved: toStatusParam(RIDE_STATUS_APPROVED),
    'In Progress': toStatusParam(RIDE_STATUS_IN_FLIGHT),
    Completed: toStatusParam(RIDE_STATUS_COMPLETED),
    Declined: toStatusParam(RIDE_STATUS_DECLINED),
  };

  // Trails the input so each keystroke doesn't mint a new query key.
  const debouncedSearch = useDebouncedValue(searchQuery);

  const bookingsQuery = useGetAllBookings({
    status: filterToApiStatus[activeFilter],
    search: debouncedSearch || undefined,
    page,
    limit: pageSize,
  });
  const allCountQuery = useGetAllBookings({
    status: filterToApiStatus['All'],
    page: 1,
    limit: 1,
  });
  const requestedCountQuery = useGetAllBookings({
    status: filterToApiStatus['Pending'],
    page: 1,
    limit: 1,
  });
  const confirmedCountQuery = useGetAllBookings({
    status: filterToApiStatus['Approved'],
    page: 1,
    limit: 1,
  });
  const inFlightCountQuery = useGetAllBookings({
    status: filterToApiStatus['In Progress'],
    page: 1,
    limit: 1,
  });
  const cancelledCountQuery = useGetAllBookings({
    status: filterToApiStatus['Declined'],
    page: 1,
    limit: 1,
  });
  const completedCountQuery = useGetAllBookings({
    status: filterToApiStatus['Completed'],
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
      tripType: ride.trip_type,
      driverId: ride.driver_id,
      caregiverId: ride.caregiver_id,
      specialInstructions: ride.special_instructions,
      phoneNum: ride.passenger_phone,
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
      text: 'In Progress',
      count: inFlightCountQuery.data?.total ?? 0,
      active: activeFilter === 'In Progress',
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

  const handleOpenDetail = (booking: BookingRow) => {
    setSelectedBooking(booking);
    setOpenDetail(true);
  };

  const handleOpenEdit = (booking: BookingRow) => {
    setSelectedBooking(booking);
    setOpenEdit(true);
  };

  const handleOpenAssignDriver = (booking: BookingRow) => {
    setSelectedBooking(booking);
    setOpenAssignDriver(true);
  };

  const handleOpenAssignCareAssistant = (booking: BookingRow) => {
    setSelectedBooking(booking);
    setOpenAssignCareAssistant(true);
  };

  const handleOpenDelete = (booking: BookingRow) => {
    setSelectedBooking(booking);
    setOpenDelete(true);
  };

  const handleCloseApprove = () => setOpenApprove(false);
  const handleCloseDecline = () => setOpenDecline(false);
  const handleCloseDetail = () => setOpenDetail(false);
  const handleCloseEdit = () => setOpenEdit(false);
  const handleCloseAssignDriver = () => setOpenAssignDriver(false);
  const handleCloseAssignCareAssistant = () =>
    setOpenAssignCareAssistant(false);
  const handleCloseDelete = () => setOpenDelete(false);

  // A driver already on the trip is reassigned; otherwise it's a fresh assign.
  const driverIsReassign = !!selectedBooking?.driverId;

  const handleAssignDriver = (driverId: string) => {
    if (!selectedBooking) return;
    const mutation = driverIsReassign
      ? reassignDriverMutation
      : assignDriverMutation;
    mutation.mutate(
      { rideId: selectedBooking.id, driver_id: driverId },
      {
        onSuccess: () => {
          toast.success(
            driverIsReassign
              ? 'Driver reassigned successfully'
              : 'Driver assigned successfully'
          );
          handleCloseAssignDriver();
        },
        onError: (error) => {
          toast.error(
            extractValidationErrorMessage(
              error,
              driverIsReassign
                ? 'Failed to reassign driver'
                : 'Failed to assign driver'
            )
          );
        },
      }
    );
  };

  const handleAssignCareAssistant = (caregiverId: string) => {
    if (!selectedBooking) return;
    assignCareAssistantMutation.mutate(
      { rideId: selectedBooking.id, caregiver_id: caregiverId },
      {
        onSuccess: () => {
          toast.success(
            selectedBooking.caregiverId
              ? 'Care assistant reassigned successfully'
              : 'Care assistant assigned successfully'
          );
          handleCloseAssignCareAssistant();
        },
        onError: (error) => {
          toast.error(
            extractValidationErrorMessage(
              error,
              'Failed to assign care assistant'
            )
          );
        },
      }
    );
  };

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
      renderCell: (params) => (
        <RowStack spacing={0.5}>
          <ClientComponent text={params.value} />
          {/* Flags that the rider left a note on the booking, which is otherwise
              only visible once you open the record. */}
          {params.row.specialInstructions ? (
            <Tooltip
              title={`Note from rider: ${params.row.specialInstructions}`}
            >
              <StickyNote2OutlinedIcon
                sx={{ fontSize: 15, color: '#D97706', flexShrink: 0 }}
              />
            </Tooltip>
          ) : null}
        </RowStack>
      ),
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
        const isEditable = !NON_EDITABLE_STATUSES.includes(row.status);
        return (
          <RowStack spacing={0.5}>
            {/* Completed and cancelled rows have no edit pen, so this is their
                only way in. */}
            <IconButton
              size="small"
              sx={{ color: '#9CA3AF' }}
              onClick={() => handleOpenDetail(row)}
              aria-label="View booking"
            >
              <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
            </IconButton>
            {isEditable && (
              <IconButton
                size="small"
                sx={{ color: '#9CA3AF' }}
                onClick={() => handleOpenEdit(row)}
                aria-label="Edit booking"
              >
                <EditOutlinedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            )}
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
            {(row.status === 'cancelled' || row.status === 'no_show') && (
              <Tooltip title="Delete booking">
                <IconButton
                  size="small"
                  sx={{ color: '#EF4444' }}
                  onClick={() => handleOpenDelete(row)}
                  aria-label="Delete booking"
                >
                  <DeleteOutlineIcon sx={{ fontSize: 15 }} />
                </IconButton>
              </Tooltip>
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
              placeholder="Search by client, booking ID, or location"
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
        phoneNum={selectedBooking?.phoneNum ?? undefined}
        dateTime={selectedBooking?.dateTime ?? ''}
        pickup={selectedBooking?.pickupLocation ?? ''}
        destination={selectedBooking?.destination ?? ''}
        specialRequirements={selectedBooking?.specialInstructions ?? undefined}
        onApprove={() => setOpenApprove(true)}
        onDecline={() => setOpenDecline(true)}
      />
      <EditBookingModal
        open={openEdit}
        handleClose={handleCloseEdit}
        rideId={selectedBooking?.id ?? ''}
        bookingId={selectedBooking?.bookingId.slice(0, 7) ?? ''}
      />
      <DeleteBookingModal
        open={openDelete}
        onClose={handleCloseDelete}
        onSuccess={handleCloseDelete}
        rideId={selectedBooking?.id ?? ''}
        bookingId={selectedBooking?.bookingId.slice(0, 7) ?? ''}
      />
      <AssignDriverModal
        open={openAssignDriver}
        handleClose={handleCloseAssignDriver}
        rideId={selectedBooking?.id ?? ''}
        onAssign={handleAssignDriver}
        isAssigning={
          assignDriverMutation.isPending || reassignDriverMutation.isPending
        }
        title={driverIsReassign ? 'Reassign Driver' : 'Assign Driver'}
        description={
          driverIsReassign
            ? 'The current driver is unavailable. Select another driver to take over this booking.'
            : 'Select a driver from the available list to assign to this booking.'
        }
        confirmLabel={driverIsReassign ? 'Reassign Driver' : 'Assign Driver'}
      />
      <AssignCareAssistantModal
        open={openAssignCareAssistant}
        handleClose={handleCloseAssignCareAssistant}
        onAssign={handleAssignCareAssistant}
        isAssigning={assignCareAssistantMutation.isPending}
        title={
          selectedBooking?.caregiverId
            ? 'Reassign Care Assistant'
            : 'Assign Care Assistant'
        }
        description={
          selectedBooking?.caregiverId
            ? 'The current care assistant is unavailable. Select another to assign to this booking.'
            : 'Select a care assistant from the available list to assign to this booking.'
        }
        confirmLabel={
          selectedBooking?.caregiverId
            ? 'Reassign Care Assistant'
            : 'Assign Care Assistant'
        }
      />
    </AppDashboardLayout>
  );
};
