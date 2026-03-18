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
import { pxToRem } from '../../../common';
import { GridColSpec } from '../../modules/components/GridTable';
import filterIcon from './ui/assets/icons/filter-Icon.svg';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import {
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
  status: 'Pending' | 'Approved' | 'Declined';
};

const allBookings: BookingRow[] = [
  {
    id: '1',
    bookingId: 'BK-20491',
    patient: 'Claire Beaumont',
    pickupLocation: '120 King St W, Toronto, ON',
    destination: 'Toronto General Hospital',
    dateTime: 'Mar 9, 2026 · 09:00 AM',
    status: 'Pending',
  },
  {
    id: '2',
    bookingId: 'BK-20490',
    patient: 'Pierre Tremblay',
    pickupLocation: '455 Ste-Catherine St W, Montreal, QC',
    destination: 'Montreal General Hospital',
    dateTime: 'Mar 9, 2026 · 10:30 AM',
    status: 'Approved',
  },
  {
    id: '3',
    bookingId: 'BK-20489',
    patient: "Margaret O'Brien",
    pickupLocation: '1150 12 Ave SW, Calgary, AB',
    destination: 'Foothills Medical Centre',
    dateTime: 'Mar 9, 2026 · 11:15 AM',
    status: 'Approved',
  },
  {
    id: '4',
    bookingId: 'BK-20488',
    patient: 'Gordon MacPherson',
    pickupLocation: '321 Elgin St, Ottawa, ON',
    destination: 'The Ottawa Hospital',
    dateTime: 'Mar 9, 2026 · 12:00 PM',
    status: 'Declined',
  },
  {
    id: '5',
    bookingId: 'BK-20487',
    patient: 'Dorothy MacLeod',
    pickupLocation: '1225 Gladstone Ave, Ottawa, ON',
    destination: 'Ottawa Kidney Care Centre',
    dateTime: 'Mar 9, 2026 · 01:30 PM',
    status: 'Pending',
  },
  {
    id: '6',
    bookingId: 'BK-20486',
    patient: 'Joseph Nguyen',
    pickupLocation: '888 Burrard St, Vancouver, BC',
    destination: 'Vancouver General Hospital',
    dateTime: 'Mar 9, 2026 · 02:00 PM',
    status: 'Approved',
  },
  {
    id: '7',
    bookingId: 'BK-20485',
    patient: 'Isabelle Côté',
    pickupLocation: '800 René-Lévesque Blvd, Montreal, QC',
    destination: 'Montreal Heart Institute',
    dateTime: 'Mar 9, 2026 · 03:00 PM',
    status: 'Pending',
  },
];

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
          <IconButton size="small" sx={{ color: '#9CA3AF' }}>
            <VisibilityOutlinedIcon sx={{ fontSize: 15 }} />
          </IconButton>
          {status === 'Pending' && (
            <>
              <IconButton size="small" sx={{ color: '#9CA3AF' }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 15 }} />
              </IconButton>
              <IconButton size="small" sx={{ color: '#9CA3AF' }}>
                <CancelOutlinedIcon sx={{ fontSize: 15 }} />
              </IconButton>
            </>
          )}
        </RowStack>
      );
    },
  },
];

export const BookingPage = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBookings = useMemo(() => {
    let filtered = allBookings;

    if (activeFilter !== 'All') {
      filtered = filtered.filter((b) => b.status === activeFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.bookingId.toLowerCase().includes(query) ||
          b.patient.toLowerCase().includes(query) ||
          b.pickupLocation.toLowerCase().includes(query) ||
          b.destination.toLowerCase().includes(query) ||
          b.dateTime.toLowerCase().includes(query) ||
          b.status.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [activeFilter, searchQuery]);

  const statusFilter = [
    { text: 'All', count: allBookings.length, active: activeFilter === 'All' },
    {
      text: 'Pending',
      count: allBookings.filter((b) => b.status === 'Pending').length,
      active: activeFilter === 'Pending',
    },
    {
      text: 'Approved',
      count: allBookings.filter((b) => b.status === 'Approved').length,
      active: activeFilter === 'Approved',
    },
    {
      text: 'Declined',
      count: allBookings.filter((b) => b.status === 'Declined').length,
      active: activeFilter === 'Declined',
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
          initialPageSize={4}
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
                  onClick={() => setActiveFilter(filter.text)}
                />
              ))}
            </RowStack>
            <RowStack spacing={1}>
              <AppSearchField
                name="search"
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                boxProps={{
                  sx: { width: '240px' },
                }}
              />
              <RowStack
                spacing={1}
                sx={{
                  padding: '11.5px 16.07px',
                  borderRadius: '14px',
                  background: '#F7F9FB',
                  border: '0.67px solid #E8ECF0',
                  cursor: 'pointer',
                }}
              >
                <StyledImage
                  src={filterIcon}
                  alt="filter"
                  sx={{
                    width: '15px',
                    height: '15px',
                  }}
                />
                <Typography
                  sx={{
                    color: (theme) => theme.color.grey,
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 600,
                    fontSize: pxToRem(13),
                    lineHeight: '19.5px',
                  }}
                >
                  Filter
                </Typography>
              </RowStack>
            </RowStack>
          </RowStack>
        </AppGridtable>
      </Stack>
    </AppDashboardLayout>
  );
};
