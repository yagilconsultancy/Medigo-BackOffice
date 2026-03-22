'use client';

import { useState, useMemo } from 'react';
import { Chip, Grid, IconButton, Stack, Typography } from '@mui/material';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppGridtable,
  AppSearchField,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { pxToRem } from '../../../common';
import { GridColSpec } from '../../modules/components/GridTable';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { CancelledTripDetailModal, CancelledTripDetail } from './ui/components';
import { BookingIdComponent, StatusComponent } from '../BookingPage/ui/components';
import { BookingRow } from '../BookingPage';

type CancelledTripRow = {
  id: string;
  bookingId: string;
  patient: string;
  route: string;
  date: string;
  reason: string;
  cancelledBy: string;
  refund: BookingRow["status"];
  amount: string;
};

const statCards = [
  { value: '6', label: 'Total Cancelled', color: '#EF4444' },
  { value: '1', label: 'Rider No-show', color: '#F59E0B' },
  { value: '1', label: 'Refunds Pending', color: '#6366F1' },
  { value: '3', label: 'Refunds Processed', color: '#059669' },
];

const cancelledTrips: CancelledTripRow[] = [
  {
    id: '1',
    bookingId: 'BK-20488',
    patient: 'Gordon MacPherson',
    route: '321 Elgin St, Ottawa → The Ottawa Hospital',
    date: 'Mar 8, 2026',
    reason: 'Rider No-show',
    cancelledBy: 'System (auto)',
    refund: 'Pending',
    amount: '$40.00',
  },
  {
    id: '2',
    bookingId: 'BK-20487',
    patient: 'Jacques Bourgeois',
    route: '88 Sherbrooke St E, Montreal → Montreal Heart Institute',
    date: 'Mar 7, 2026',
    reason: 'Driver Unavailable',
    cancelledBy: 'System',
    refund: 'Processed',
    amount: '$35.50',
  },
  {
    id: '3',
    bookingId: 'BK-20486',
    patient: "Margaret O'Brien",
    route: '1150 12 Ave SW, Calgary → Foothills Medical Centre',
    date: 'Mar 7, 2026',
    reason: 'Rider Request',
    cancelledBy: 'Rider',
    refund: 'None',
    amount: '$0.00',
  },
  {
    id: '4',
    bookingId: 'BK-20485',
    patient: 'Pierre Tremblay',
    route: '455 Ste-Catherine St W, Montreal → Montreal General Hospital',
    date: 'Mar 6, 2026',
    reason: 'Vehicle Breakdown',
    cancelledBy: 'Driver',
    refund: 'Full Refund',
    amount: '$48.00',
  },
  {
    id: '5',
    bookingId: 'BK-20484',
    patient: 'Lisa Anderson',
    route: '800 Rene-Levesque Blvd W → Montreal Heart Institute',
    date: 'Mar 5, 2026',
    reason: 'Medical Emergency',
    cancelledBy: 'Admin',
    refund: 'Processed',
    amount: '$42.75',
  },
  {
    id: '6',
    bookingId: 'BK-20483',
    patient: 'Helen Moore',
    route: '120 King St W, Toronto → Toronto General Hospital',
    date: 'Mar 4, 2026',
    reason: 'Appointment Rescheduled',
    cancelledBy: 'Rider',
    refund: 'None',
    amount: '$0.00',
  },
];

const tripDetails: Record<string, CancelledTripDetail> = {
  '1': {
    bookingId: 'BK-20488',
    serviceType: 'Standard Medical',
    patientName: 'Gordon MacPherson',
    age: 44,
    phone: '+1 613 555 0312',
    dateTime: 'Mar 8, 2026, 12:00 PM',
    pickup: '321 Elgin St, Ottawa, ON',
    destination: 'The Ottawa Hospital',
    cancellationReason: 'Rider No-show',
    cancelledBy: 'System (auto)',
    assignedDriver: 'Anna Kim',
    refundStatus: 'Pending',
    amount: '$40.00',
  },
  '2': {
    bookingId: 'BK-20487',
    serviceType: 'Standard Medical',
    patientName: 'Jacques Bourgeois',
    age: 58,
    phone: '+1 514 555 0198',
    dateTime: 'Mar 7, 2026, 09:30 AM',
    pickup: '88 Sherbrooke St E, Montreal, QC',
    destination: 'Montreal Heart Institute',
    cancellationReason: 'Driver Unavailable',
    cancelledBy: 'System',
    assignedDriver: 'Sophie Tremblay',
    refundStatus: 'Processed',
    amount: '$35.50',
  },
  '3': {
    bookingId: 'BK-20486',
    serviceType: 'Standard Medical',
    patientName: "Margaret O'Brien",
    age: 72,
    phone: '+1 403 555 0245',
    dateTime: 'Mar 7, 2026, 11:00 AM',
    pickup: '1150 12 Ave SW, Calgary, AB',
    destination: 'Foothills Medical Centre',
    cancellationReason: 'Rider Request',
    cancelledBy: 'Rider',
    assignedDriver: 'David Chen',
    refundStatus: 'None',
    amount: '$0.00',
  },
  '4': {
    bookingId: 'BK-20485',
    serviceType: 'Standard Medical',
    patientName: 'Pierre Tremblay',
    age: 65,
    phone: '+1 514 555 0334',
    dateTime: 'Mar 6, 2026, 11:30 AM',
    pickup: '455 Ste-Catherine St W, Montreal, QC',
    destination: 'Montreal General Hospital',
    cancellationReason: 'Vehicle Breakdown',
    cancelledBy: 'Driver',
    assignedDriver: 'Anna Kim',
    refundStatus: 'Full Refund',
    amount: '$48.00',
  },
  '5': {
    bookingId: 'BK-20484',
    serviceType: 'Standard Medical',
    patientName: 'Lisa Anderson',
    age: 51,
    phone: '+1 514 555 0467',
    dateTime: 'Mar 5, 2026, 02:00 PM',
    pickup: '800 Rene-Levesque Blvd W, Montreal, QC',
    destination: 'Montreal Heart Institute',
    cancellationReason: 'Medical Emergency',
    cancelledBy: 'Admin',
    assignedDriver: 'Liam MacDonald',
    refundStatus: 'Processed',
    amount: '$42.75',
  },
  '6': {
    bookingId: 'BK-20483',
    serviceType: 'Standard Medical',
    patientName: 'Helen Moore',
    age: 68,
    phone: '+1 416 555 0523',
    dateTime: 'Mar 4, 2026, 10:00 AM',
    pickup: '120 King St W, Toronto, ON',
    destination: 'Toronto General Hospital',
    cancellationReason: 'Appointment Rescheduled',
    cancelledBy: 'Rider',
    assignedDriver: 'Marcus Johnson',
    refundStatus: 'None',
    amount: '$0.00',
  },
};

export const CancelledTripsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<CancelledTripDetail | null>(
    null
  );

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
  }, [searchQuery]);

  const handleViewTrip = (tripId: string) => {
    setSelectedTrip(tripDetails[tripId] || null);
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
