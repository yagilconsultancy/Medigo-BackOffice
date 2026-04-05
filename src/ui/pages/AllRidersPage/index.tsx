'use client';

import { useState, useMemo, useCallback } from 'react';
import dayjs from 'dayjs';
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
import { EmptyState } from '../../modules/blocks';
import { GridColSpec } from '../../modules/components/GridTable';
import { RiderDetailModal, RideHistoryModal } from './ui/components';
import {
  pxToRem,
  useSearchRiders,
  useRidersApi,
  useResolvedApiQuery,
  type AdminRiderListItem,
  type AdminRiderListResponse,
} from '../../../common';

const DEFAULT_RIDERS: AdminRiderListResponse = {
  kpis: {
    total_riders: 0,
    active_count: 0,
    suspended_count: 0,
    open_tickets: 0,
  },
  riders: [],
  total: 0,
  page: 1,
  limit: 10,
  total_pages: 0,
};

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

const uiStatusToApi: Record<RiderStatus, string> = {
  Active: 'active',
  Inactive: 'inactive',
  Suspended: 'suspended',
};

const apiStatusToUi = (status?: string | null): RiderStatus => {
  const normalized = (status ?? '').toLowerCase();
  if (normalized === 'active') return 'Active';
  if (normalized === 'suspended') return 'Suspended';
  return 'Inactive';
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const mapRider = (item: AdminRiderListItem): RiderRow => ({
  id: item.user_id,
  client:
    `${item.first_name ?? ''} ${item.last_name ?? ''}`.trim() || 'Unknown',
  email: item.email ?? '—',
  phone: item.phone ?? '—',
  joined: item.joined_at ? dayjs(item.joined_at).format('MMM D, YYYY') : '—',
  trips: item.total_trips ?? 0,
  spent: formatCurrency(item.total_spent ?? 0),
  frequency: item.frequency || '—',
  tickets: item.open_tickets > 0 ? String(item.open_tickets) : '—',
  status: apiStatusToUi(item.status),
});

// ─── Component ──────────────────────────────────────────────────────────────

export const AllRidersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | RiderStatus>('All');
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [selectedRider, setSelectedRider] = useState<RiderRow | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const {
    data: ridersData,
    isFetching: isFetchingRiders,
    isLoading: isLoadingRiders,
  } = useResolvedApiQuery(useSearchRiders, DEFAULT_RIDERS, {
    search: searchQuery.trim() || undefined,
    status: activeFilter === 'All' ? undefined : uiStatusToApi[activeFilter],
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
  });

  const { suspendRider, reinstateRider } = useRidersApi();

  const riders = useMemo<RiderRow[]>(() => {
    return ridersData.riders.map(mapRider);
  }, [ridersData]);

  const kpis = ridersData.kpis;
  const totalCount = ridersData.total ?? 0;

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, []);

  const handleFilterChange = useCallback((filter: 'All' | RiderStatus) => {
    setActiveFilter(filter);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, []);

  const handleViewRider = useCallback((rider: RiderRow) => {
    setSelectedRider(rider);
    setDetailOpen(true);
  }, []);

  const handleSuspend = useCallback(
    async (rider: RiderRow) => {
      const success = await suspendRider({
        riderId: rider.id,
        reason: 'Administrative action',
      });
      if (success) {
        setDetailOpen(false);
        setSelectedRider({ ...rider, status: 'Suspended' });
        setSnackbarMessage(`${rider.client} has been suspended`);
        setSnackbarOpen(true);
      }
    },
    [suspendRider]
  );

  const handleReinstate = useCallback(
    async (rider: RiderRow) => {
      const success = await reinstateRider({ riderId: rider.id });
      if (success) {
        setDetailOpen(false);
        setSelectedRider({ ...rider, status: 'Active' });
        setSnackbarMessage(`${rider.client} has been reinstated`);
        setSnackbarOpen(true);
      }
    },
    [reinstateRider]
  );

  const statCards = [
    {
      value: String(kpis.total_riders),
      label: 'Total Riders',
      valueColor: '#2F6FED',
      icon: <PeopleOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />,
      iconBg: '#EBF2FF',
    },
    {
      value: String(kpis.active_count),
      label: 'Active',
      valueColor: '#10B981',
      icon: <CheckCircleOutlinedIcon sx={{ fontSize: 18, color: '#10B981' }} />,
      iconBg: '#ECFDF5',
    },
    {
      value: String(kpis.suspended_count),
      label: 'Suspended',
      valueColor: '#EF4444',
      icon: <BlockOutlinedIcon sx={{ fontSize: 18, color: '#EF4444' }} />,
      iconBg: '#FEF2F2',
    },
    {
      value: String(kpis.open_tickets),
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
          data={riders}
          initialPageSize={10}
          disableAutoPagination
          totalRows={totalCount}
          onPaginationModelChange={(model) =>
            setPaginationModel({ page: model.page, pageSize: model.pageSize })
          }
          emptyState={
            <Box sx={{ height: 400, width: '100%' }}>
              <EmptyState animationSrc="/empty.json" />
            </Box>
          }
          isFetchingData={isFetchingRiders || isLoadingRiders}
          sx={{ height: 'auto', width: '100%' }}
        >
          <RowStack justifyContent={'space-between'} width={'100%'}>
            {/* Filter Tabs */}
            <RowStack spacing={'0px'}>
              {(['All', ...statusFilters] as const).map((filter) => (
                <Typography
                  key={filter}
                  onClick={() => handleFilterChange(filter)}
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
              onChange={(e) => handleSearchChange(e.target.value)}
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
        onSuspend={handleSuspend}
        onReinstate={handleReinstate}
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
