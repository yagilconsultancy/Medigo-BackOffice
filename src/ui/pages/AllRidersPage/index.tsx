'use client';

import { useState, useMemo, useCallback } from 'react';
import { Box, Grid, IconButton, Stack, Typography, alpha } from '@mui/material';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppGridtable,
  AppNotificationSnackbar,
  AppSearchField,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { GridColSpec } from '../../modules/components/GridTable';
import { RiderDetailModal, RideHistoryModal } from './ui/components';
import { pxToRem } from '../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

export type RiderStatus = 'Active' | 'Inactive' | 'Suspended';

export type RiderRow = {
  id: string;
  client: string;
  email: string;
  phone: string;
  joined: string;
  trips: number;
  spent: string;
  frequency: string;
  tickets: string;
  status: RiderStatus;
};

// ─── Config ─────────────────────────────────────────────────────────────────

const statusColors: Record<RiderStatus, { color: string; bg: string }> = {
  Active: { color: '#059669', bg: '#ECFDF5' },
  Inactive: { color: '#6B7280', bg: '#F3F4F6' },
  Suspended: { color: '#EF4444', bg: '#FEF2F2' },
};

const statusFilters: RiderStatus[] = ['Active', 'Inactive', 'Suspended'];

// ─── Mock Data ──────────────────────────────────────────────────────────────

const ridersData: RiderRow[] = [
  {
    id: 'R-001',
    client: 'Helen Moore',
    email: 'helen.moore@email.com',
    phone: '+1 416 555 0123',
    joined: 'Jan 8, 2024',
    trips: 42,
    spent: '$1,890',
    frequency: '3–4×/week',
    tickets: '—',
    status: 'Active',
  },
  {
    id: 'R-002',
    client: 'Robert Garcia',
    email: 'r.garcia@email.com',
    phone: '+1 416 555 0123',
    joined: 'Feb 14, 2024',
    trips: 31,
    spent: '$1,240',
    frequency: '2×/week',
    tickets: '1',
    status: 'Active',
  },
  {
    id: 'R-003',
    client: 'Nancy White',
    email: 'nwhite@email.com',
    phone: '+1 416 555 0123',
    joined: 'Mar 3, 2024',
    trips: 28,
    spent: '$1,050',
    frequency: '1–2×/week',
    tickets: '—',
    status: 'Active',
  },
  {
    id: 'R-004',
    client: 'Maple Leaf Hospital',
    email: 'mapleleaf@email.com',
    phone: '+1 416 555 0123',
    joined: 'Apr 11, 2024',
    trips: 9,
    spent: '$360',
    frequency: 'Irregular',
    tickets: '3',
    status: 'Suspended',
  },
  {
    id: 'R-005',
    client: 'Patricia Clark',
    email: 'p.clark@email.com',
    phone: '+1 416 555 0123',
    joined: 'May 20, 2024',
    trips: 56,
    spent: '$2,460',
    frequency: 'Daily',
    tickets: '—',
    status: 'Active',
  },
  {
    id: 'R-006',
    client: 'Daniel Martinez',
    email: 'd.martinez@email.com',
    phone: '+1 416 555 0123',
    joined: 'Jun 5, 2024',
    trips: 87,
    spent: '$3,480',
    frequency: 'Daily',
    tickets: '—',
    status: 'Active',
  },
  {
    id: 'R-007',
    client: 'Lisa Anderson',
    email: 'l.anderson@email.com',
    phone: '+1 416 555 0123',
    joined: 'Jul 18, 2024',
    trips: 18,
    spent: '$720',
    frequency: 'Weekly',
    tickets: '—',
    status: 'Active',
  },
  {
    id: 'R-008',
    client: 'Sunnyvale Medical Center',
    email: 'j.porter@email.com',
    phone: '+1 416 555 0123',
    joined: 'Aug 22, 2024',
    trips: 4,
    spent: '$160',
    frequency: 'Inactive',
    tickets: '1',
    status: 'Inactive',
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const AllRidersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | RiderStatus>('All');
  const [selectedRider, setSelectedRider] = useState<RiderRow | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleViewRider = useCallback((rider: RiderRow) => {
    setSelectedRider(rider);
    setDetailOpen(true);
  }, []);

  const filteredRiders = useMemo(() => {
    let filtered = ridersData;

    if (activeFilter !== 'All') {
      filtered = filtered.filter((r) => r.status === activeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.client.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.phone.includes(q)
      );
    }

    return filtered;
  }, [searchQuery, activeFilter]);

  const statusCounts = useMemo(() => {
    return {
      total: ridersData.length,
      active: ridersData.filter((r) => r.status === 'Active').length,
      suspended: ridersData.filter((r) => r.status === 'Suspended').length,
      openTickets: ridersData.reduce((sum, r) => {
        const t = parseInt(r.tickets);
        return sum + (isNaN(t) ? 0 : t);
      }, 0),
    };
  }, []);

  const statCards = [
    {
      value: String(statusCounts.total),
      label: 'Total Riders',
      valueColor: '#2F6FED',
      icon: <PeopleOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />,
      iconBg: '#EBF2FF',
    },
    {
      value: String(statusCounts.active),
      label: 'Active',
      valueColor: '#10B981',
      icon: <CheckCircleOutlinedIcon sx={{ fontSize: 18, color: '#10B981' }} />,
      iconBg: '#ECFDF5',
    },
    {
      value: String(statusCounts.suspended),
      label: 'Suspended',
      valueColor: '#EF4444',
      icon: <BlockOutlinedIcon sx={{ fontSize: 18, color: '#EF4444' }} />,
      iconBg: '#FEF2F2',
    },
    {
      value: String(statusCounts.openTickets),
      label: 'Open Tickets',
      valueColor: '#D97706',
      icon: (
        <ConfirmationNumberOutlinedIcon
          sx={{ fontSize: 18, color: '#D97706' }}
        />
      ),
      iconBg: '#FFFBEB',
    },
  ];

  const columns: GridColSpec<RiderRow>[] = [
    {
      field: 'client',
      headerName: 'Client',
      flex: 1.3,
      minWidth: 180,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(13),
            color: '#111827',
          }}
        >
          {params.row.client}
        </Typography>
      ),
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1.3,
      minWidth: 180,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(13),
            color: '#6B7280',
          }}
        >
          {params.row.email}
        </Typography>
      ),
    },
    {
      field: 'phone',
      headerName: 'Phone',
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(13),
            color: '#374151',
          }}
        >
          {params.row.phone}
        </Typography>
      ),
    },
    {
      field: 'joined',
      headerName: 'Joined',
      flex: 0.8,
      minWidth: 110,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(13),
            color: '#374151',
          }}
        >
          {params.row.joined}
        </Typography>
      ),
    },
    {
      field: 'trips',
      headerName: 'Trips',
      flex: 0.5,
      minWidth: 60,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(13),
            color: '#111827',
          }}
        >
          {params.row.trips}
        </Typography>
      ),
    },
    {
      field: 'spent',
      headerName: 'Spent',
      flex: 0.6,
      minWidth: 80,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(13),
            color: '#059669',
          }}
        >
          {params.row.spent}
        </Typography>
      ),
    },
    {
      field: 'frequency',
      headerName: 'Frequency',
      flex: 0.7,
      minWidth: 90,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(13),
            color: '#374151',
          }}
        >
          {params.row.frequency}
        </Typography>
      ),
    },
    {
      field: 'tickets',
      headerName: 'Tickets',
      flex: 0.5,
      minWidth: 60,
      renderCell: (params) => {
        const val = params.row.tickets;
        const hasTickets = val !== '—';
        return (
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: hasTickets ? 600 : 400,
              fontSize: pxToRem(13),
              color: hasTickets ? '#D97706' : '#9CA3AF',
            }}
          >
            {val}
          </Typography>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.7,
      minWidth: 100,
      renderCell: (params) => {
        const config = statusColors[params.row.status];
        return (
          <RowStack spacing={'6px'}>
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: config.color,
              }}
            />
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 500,
                fontSize: pxToRem(12.5),
                color: config.color,
              }}
            >
              {params.row.status}
            </Typography>
          </RowStack>
        );
      },
    },
    {
      field: 'actions' as string,
      headerName: '',
      flex: 0.4,
      minWidth: 50,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleViewRider(params.row);
          }}
          sx={{
            background: alpha('#2F6FED', 0.1),
            color: '#2F6FED',
            '&:hover': { background: alpha('#2F6FED', 0.18) },
          }}
        >
          <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
        </IconButton>
      ),
    },
  ];

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <DashboardTitleAndDesc
          title="Facility & Client Management"
          desc="View and manage all rider accounts, ride history, and support issues"
        />

        {/* Stat Cards */}
        <Grid container spacing={'12px'}>
          {statCards.map((card, index) => (
            <Grid key={index} size={{ xs: 6, lg: 3 }}>
              <Stack
                sx={{
                  background: '#FFFFFF',
                  border: '0.67px solid #E8ECF0',
                  borderRadius: '14px',
                  padding: '16px 20px',
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '10px',
                    background: card.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px',
                  }}
                >
                  {card.icon}
                </Box>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 700,
                    fontSize: pxToRem(24),
                    lineHeight: '1.3em',
                    color: card.valueColor,
                  }}
                >
                  {card.value}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 500,
                    fontSize: pxToRem(12.5),
                    lineHeight: '1.5em',
                    color: '#6B7280',
                    marginTop: '2px',
                  }}
                >
                  {card.label}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>

        {/* Table */}
        <AppGridtable
          columns={columns}
          data={filteredRiders}
          initialPageSize={10}
          sx={{ height: 'auto', width: '100%' }}
        >
          <RowStack justifyContent={'space-between'} width={'100%'}>
            {/* Filter Tabs */}
            <RowStack spacing={'0px'}>
              {(['All', ...statusFilters] as const).map((filter) => (
                <Typography
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 600,
                    fontSize: pxToRem(12),
                    color: activeFilter === filter ? '#FFFFFF' : '#6B7280',
                    background:
                      activeFilter === filter ? '#2F6FED' : 'transparent',
                    border: `0.67px solid ${activeFilter === filter ? '#2F6FED' : '#E8ECF0'}`,
                    borderRadius: '20px',
                    padding: '6px 14px',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      background:
                        activeFilter === filter ? '#2F6FED' : '#F7F9FB',
                    },
                  }}
                >
                  {filter}
                </Typography>
              ))}
            </RowStack>

            {/* Search */}
            <AppSearchField
              name="search"
              placeholder="Search riders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              boxProps={{ sx: { width: '240px' } }}
            />
          </RowStack>
        </AppGridtable>
      </Stack>

      {/* Rider Detail Modal */}
      <RiderDetailModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        rider={selectedRider}
        onSuspend={(rider) => {
          setDetailOpen(false);
          setSnackbarMessage(`${rider.client} has been suspended`);
          setSnackbarOpen(true);
        }}
        onReinstate={(rider) => {
          setDetailOpen(false);
          setSnackbarMessage(`${rider.client} has been reinstated`);
          setSnackbarOpen(true);
        }}
        onViewHistory={() => {
          setDetailOpen(false);
          setHistoryOpen(true);
        }}
      />

      {/* Ride History Modal */}
      <RideHistoryModal
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onBack={() => {
          setHistoryOpen(false);
          setDetailOpen(true);
        }}
        rider={selectedRider}
      />
      {/* Snackbar */}
      <AppNotificationSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={() => setSnackbarOpen(false)}
      />
    </AppDashboardLayout>
  );
};
