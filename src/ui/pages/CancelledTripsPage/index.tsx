'use client';

import { useState, useMemo } from 'react';
import { Grid, IconButton, Stack, Typography } from '@mui/material';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppGridtable,
  AppSearchField,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import {
  pxToRem,
  useGetCancelledTrips,
  useGetCancelledTripsKpis,
  useResolvedApiQuery,
} from '../../../common';
import dayjs from 'dayjs';
import { GridColSpec } from '../../modules/components/GridTable';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { CancelledTripDetailModal, CancelledTripDetail } from './ui/components';
import {
  BookingIdComponent,
  StatusComponent,
} from '../BookingPage/ui/components';
import { BookingRow } from '../BookingPage';
import { EmptyState } from '../../modules/blocks';

type CancelledTripRow = {
  id: string;
  bookingId: string;
  patient: string;
  route: string;
  date: string;
  reason: string;
  cancelledBy: string;
  refund: BookingRow['status'];
  amount: string;
};

export const CancelledTripsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<CancelledTripDetail | null>(
    null
  );

  const { data: kpis } = useResolvedApiQuery(useGetCancelledTripsKpis, null);

  const cancelledQuery = useGetCancelledTrips({ page, limit: 20 });

  const cancelledTrips = useMemo(() => {
    const items = cancelledQuery.data?.data;
    if (!items?.length) return [];
    return items.map((item) => ({
      id: item.id,
      bookingId: item.id.slice(0, 8).toUpperCase(),
      patient: item.rider_name,
      route: `${item.pickup_address} \u2192 ${item.destination_address}`,
      date: dayjs(item.scheduled_at).format('MMM D, YYYY'),
      reason: item.cancellation_reason || 'Unknown',
      cancelledBy: item.cancelled_by_name || 'Unknown',
      refund: (item.refund_status?.charAt(0).toUpperCase() +
        (item.refund_status?.slice(1) || '')) as BookingRow['status'],
      amount:
        item.refund_amount != null
          ? `$${item.refund_amount.toFixed(2)}`
          : '$0.00',
    }));
  }, [cancelledQuery.data]);

  const filteredTrips = useMemo(() => {
    if (!searchQuery.trim()) return cancelledTrips;
    const query = searchQuery.toLowerCase();
    return cancelledTrips.filter(
      (t) =>
        t.bookingId.toLowerCase().includes(query) ||
        t.patient.toLowerCase().includes(query) ||
        t.route.toLowerCase().includes(query) ||
        t.reason.toLowerCase().includes(query) ||
        t.cancelledBy.toLowerCase().includes(query)
    );
  }, [searchQuery, cancelledTrips]);

  const statCards = [
    {
      value: String(kpis?.total_cancelled ?? 0),
      label: 'Total Cancelled',
      color: '#EF4444',
    },
    {
      value: String(kpis?.no_show_count ?? 0),
      label: 'Rider No-show',
      color: '#F59E0B',
    },
    {
      value: String(kpis?.refunds_pending ?? 0),
      label: 'Refunds Pending',
      color: '#6366F1',
    },
    {
      value: String(kpis?.refunds_processed ?? 0),
      label: 'Refunds Processed',
      color: '#059669',
    },
  ];

  const handleViewTrip = (tripId: string) => {
    setSelectedTrip(null);
    setDetailOpen(true);
  };

  const columns: GridColSpec<CancelledTripRow>[] = [
    {
      field: 'bookingId',
      headerName: 'Booking ID',
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => <BookingIdComponent bookingId={params.value} />,
    },
    {
      field: 'patient',
      headerName: 'Patient',
      flex: 1,
      minWidth: 140,
    },
    {
      field: 'route',
      headerName: 'Route',
      flex: 1,
      minWidth: 220,
    },
    {
      field: 'date',
      headerName: 'Date',
      flex: 0.8,
      minWidth: 100,
    },
    {
      field: 'reason',
      headerName: 'Reason',
      flex: 1,
      minWidth: 130,
    },
    {
      field: 'cancelledBy',
      headerName: 'Cancelled By',
      flex: 0.8,
      minWidth: 100,
    },
    {
      field: 'refund',
      headerName: 'Refund',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => <StatusComponent status={params.value} />,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 0.6,
      minWidth: 80,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(12.5),
            color: (theme) => theme.color.deepBlue,
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'actions' as string,
      headerName: 'Actions',
      flex: 0.5,
      minWidth: 60,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          size="small"
          sx={{ color: '#9CA3AF' }}
          onClick={() => handleViewTrip(params.row.id)}
        >
          <VisibilityOutlinedIcon sx={{ fontSize: 15 }} />
        </IconButton>
      ),
    },
  ];

  return (
    <AppDashboardLayout>
      <Stack spacing={3}>
        <DashboardTitleAndDesc
          title="Cancelled Trips"
          desc="Review all cancelled bookings and refund statuses"
        />

        {/* Stat Cards */}
        <Grid container spacing={'12px'}>
          {statCards.map((card, index) => (
            <Grid size={{ xs: 6, md: 3 }} key={index}>
              <Stack
                spacing={'4px'}
                sx={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '21px',
                  border: '0.67px solid #EAECF0',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 700,
                    fontSize: pxToRem(28),
                    lineHeight: '42px',
                    color: card.color,
                  }}
                >
                  {card.value}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(13),
                    lineHeight: '19.5px',
                    color: (theme) => theme.color.lightGrey,
                  }}
                >
                  {card.label}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>

        {/* Cancelled Trips Table */}
        <AppGridtable
          columns={columns}
          data={filteredTrips}
          emptyState={<EmptyState animationSrc="/empty.json" />}
          initialPageSize={6}
          sx={{
            height: 'auto',
            width: '100%',
          }}
        >
          <RowStack justifyContent="space-between" width="100%">
            <RowStack spacing={1}>
              <CancelOutlinedIcon sx={{ color: '#4B5563' }} />
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 500,
                  fontSize: pxToRem(16),
                  color: (theme) => theme.color.deepBlue,
                }}
              >
                Cancelled Trips
              </Typography>
            </RowStack>
            <AppSearchField
              name="search"
              placeholder="Search cancelled trips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              boxProps={{
                sx: { width: '240px' },
              }}
            />
          </RowStack>
        </AppGridtable>
      </Stack>

      <CancelledTripDetailModal
        open={detailOpen}
        setOpen={setDetailOpen}
        trip={selectedTrip}
      />
    </AppDashboardLayout>
  );
};
