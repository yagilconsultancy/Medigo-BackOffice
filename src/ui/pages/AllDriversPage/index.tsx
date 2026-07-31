'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  alpha,
  Avatar,
  Box,
  Chip,
  Grid,
  IconButton,
  Rating,
  Stack,
  Typography,
} from '@mui/material';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined';
import AddIcon from '@mui/icons-material/Add';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import dayjs from 'dayjs';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppGridtable,
  AppSearchField,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { EmptyState } from '../../modules/blocks';
import { GridColSpec } from '../../modules/components/GridTable';
import {
  DriverDetailDrawer,
  EditDriverDrawer,
  AddDriverDrawer,
} from './ui/components';
import {
  pxToRem,
  useSearchDrivers,
  useResolvedApiQuery,
  type AdminDriverListItem,
  type AdminDriverListResponse,
} from '../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

export type DriverStatus = 'Available' | 'On Trip' | 'Off Duty' | 'Suspended';

export type AllDriverRow = {
  id: string;
  driverId: string;
  name: string;
  avatar: string;
  fleet: string;
  vehicle: string;
  plate: string;
  status: DriverStatus;
  rating: number;
  trips: number;
  docs: 'Complete' | 'Pending';
  joinedDate: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  memberSince: string;
  license: string;
  bgCheck: string;
  licenseExpiry: string;
  docsStatus: string;
  capabilities: string[];
};

// ─── Status Config ──────────────────────────────────────────────────────────

const statusChipConfig: Record<
  DriverStatus,
  { color: string; bg: string; icon: React.ReactNode }
> = {
  Available: {
    color: '#059669',
    bg: '#ECFDF5',
    icon: (
      <CheckCircleOutlineIcon
        sx={{ fontSize: pxToRem(11), color: '#059669 !important' }}
      />
    ),
  },
  'On Trip': {
    color: '#3730A3',
    bg: '#EEF2FF',
    icon: (
      <NearMeOutlinedIcon
        sx={{ fontSize: pxToRem(11), color: '#3730A3 !important' }}
      />
    ),
  },
  'Off Duty': {
    color: '#6B7280',
    bg: '#F3F4F6',
    icon: (
      <AccessTimeIcon
        sx={{ fontSize: pxToRem(11), color: '#6B7280 !important' }}
      />
    ),
  },
  Suspended: {
    color: '#EF4444',
    bg: '#FEF2F2',
    icon: (
      <AccessTimeIcon
        sx={{ fontSize: pxToRem(11), color: '#EF4444 !important' }}
      />
    ),
  },
};

// ─── API Mapping ────────────────────────────────────────────────────────────

const DEFAULT_DRIVERS_RESPONSE: AdminDriverListResponse = {
  kpis: {
    total_drivers: 0,
    active_count: 0,
    suspended_count: 0,
    pending_count: 0,
    online_count: 0,
    available_now: 0,
    on_trip: 0,
    total_mileage: 0,
    approval_rate: 0,
  },
  drivers: [],
  total: 0,
  page: 1,
  limit: 10,
  total_pages: 0,
};

const buildVehicleLabel = (item: AdminDriverListItem): string => {
  const parts = [item.vehicle_make, item.vehicle_model].filter(Boolean);
  const label = parts.join(' ').trim();
  const withYear = item.vehicle_year
    ? `${label} · ${item.vehicle_year}`
    : label;
  return withYear.trim() || item.vehicle_type || '—';
};

/**
 * The roster shows an operational status, which the API splits across three
 * fields: account_status carries suspension, is_online carries duty state and
 * is_on_trip carries live ride engagement. account_status is never 'on_trip' —
 * it only ever holds pending/active/suspended/deactivated.
 */
const mapDriverStatus = (item: AdminDriverListItem): DriverStatus => {
  const accountStatus = (item.account_status || '').toLowerCase();
  if (accountStatus === 'suspended') return 'Suspended';
  if (item.is_on_trip) return 'On Trip';
  if (!item.is_online) return 'Off Duty';
  return 'Available';
};

const mapDocsStatus = (status?: string | null): 'Complete' | 'Pending' => {
  const normalized = (status || '').toLowerCase();
  return normalized === 'complete' || normalized === 'verified'
    ? 'Complete'
    : 'Pending';
};

const mapApiDriver = (item: AdminDriverListItem): AllDriverRow => {
  const fullName =
    `${item.first_name ?? ''} ${item.last_name ?? ''}`.trim() || 'Unknown';
  const joinedLabel = item.created_at
    ? dayjs(item.created_at).format('MMM YYYY')
    : '—';

  return {
    id: item.user_id,
    driverId: item.user_id,
    name: fullName,
    avatar: item.avatar_url ?? '',
    fleet: item.fleet_name ?? '—',
    vehicle: buildVehicleLabel(item),
    plate: item.vehicle_plate ?? '—',
    status: mapDriverStatus(item),
    rating: item.rating ?? 0,
    trips: item.total_trips ?? 0,
    docs: mapDocsStatus(item.document_status),
    joinedDate: joinedLabel,
    phone: item.phone ?? '—',
    email: item.email ?? '—',
    // Detail-only fields; the drawer refetches the full record by id.
    dateOfBirth: '—',
    memberSince: joinedLabel,
    license: '—',
    bgCheck: '—',
    licenseExpiry: '—',
    docsStatus: item.document_status ?? '—',
    capabilities: [],
  };
};

const formatMileage = (value: number): string =>
  `${new Intl.NumberFormat('en-US').format(value)} mi`;

// ─── Component ──────────────────────────────────────────────────────────────

export const AllDriversPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDriver, setSelectedDriver] = useState<AllDriverRow | null>(
    null
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [editDriver, setEditDriver] = useState<AllDriverRow | null>(null);
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const {
    data: driversResponse,
    isFetching: isFetchingDrivers,
    isLoading: isLoadingDrivers,
    refetch: refetchDrivers,
  } = useResolvedApiQuery(useSearchDrivers, DEFAULT_DRIVERS_RESPONSE, {
    search: searchQuery.trim() || undefined,
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    sort_by: 'created_at',
  });

  const drivers = useMemo<AllDriverRow[]>(
    () => driversResponse.drivers.map(mapApiDriver),
    [driversResponse]
  );

  const kpis = driversResponse.kpis;
  const totalDriverCount = driversResponse.total ?? 0;

  const statCards = [
    {
      value: String(kpis.total_drivers ?? 0),
      label: 'Total Drivers',
      valueColor: '#2F6FED',
      iconBg: '#EBF2FF',
      icon: <PeopleOutlineIcon sx={{ fontSize: 18, color: '#2F6FED' }} />,
    },
    {
      value: String(kpis.available_now ?? kpis.online_count ?? 0),
      label: 'Available Now',
      valueColor: '#10B981',
      iconBg: '#ECFDF5',
      icon: <CheckCircleOutlineIcon sx={{ fontSize: 18, color: '#10B981' }} />,
    },
    {
      value: String(kpis.on_trip ?? 0),
      label: 'On Trip',
      valueColor: '#D97706',
      iconBg: '#EEF2FF',
      icon: <NearMeOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />,
    },
    {
      value: formatMileage(kpis.total_mileage ?? 0),
      label: 'Total Mileage',
      valueColor: '#6B7280',
      iconBg: '#FFF7ED',
      icon: <SpeedOutlinedIcon sx={{ fontSize: 18, color: '#D97706' }} />,
    },
  ];

  const handleRowClick = useCallback((row: AllDriverRow) => {
    setSelectedDriver(row);
    setDrawerOpen(true);
  }, []);

  const handleEditClick = useCallback((row: AllDriverRow) => {
    setEditDriver(row);
    setEditDrawerOpen(true);
  }, []);

  const columns: GridColSpec<AllDriverRow>[] = [
    {
      field: 'name',
      headerName: 'Driver',
      flex: 1.2,
      minWidth: 200,
      renderCell: (params) => {
        const nameParts = params.row.name.split(' ');
        const initials =
          nameParts.length > 1
            ? `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`
            : nameParts[0].charAt(0);
        return (
          <RowStack spacing={'10px'}>
            <Avatar
              src={params.row.avatar || undefined}
              alt={params.row.name}
              sx={{
                width: 32,
                height: 32,
                fontSize: pxToRem(11),
                fontWeight: 600,
                background: '#EBF2FF',
                color: '#2F6FED',
              }}
            >
              {initials}
            </Avatar>
            <Stack spacing={0}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(13),
                  color: '#111827',
                  lineHeight: '1.4em',
                }}
              >
                {params.row.name}
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(11),
                  color: '#9CA3AF',
                  lineHeight: '1.4em',
                }}
              >
                {params.row.driverId}
              </Typography>
            </Stack>
          </RowStack>
        );
      },
    },
    {
      field: 'fleet',
      headerName: 'Fleet',
      flex: 1,
      minWidth: 140,
    },
    {
      field: 'vehicle',
      headerName: 'Vehicle',
      flex: 1.1,
      minWidth: 180,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(13),
            color: '#374151',
          }}
        >
          {params.row.vehicle}
        </Typography>
      ),
    },
    {
      field: 'plate',
      headerName: 'Plate',
      flex: 0.6,
      minWidth: 90,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.8,
      minWidth: 120,
      renderCell: (params) => {
        const config = statusChipConfig[params.value as DriverStatus];
        return (
          <Chip
            icon={config.icon as React.ReactElement}
            label={params.value}
            size="small"
            sx={{
              background: config.bg,
              color: config.color,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: pxToRem(11.5),
              height: '26px',
              borderRadius: '100px',
              '& .MuiChip-icon': { marginLeft: '6px' },
            }}
          />
        );
      },
    },
    {
      field: 'rating',
      headerName: 'Rating',
      flex: 0.6,
      minWidth: 90,
      renderCell: (params) => (
        <RowStack spacing={'4px'}>
          <Rating
            value={1}
            max={1}
            readOnly
            size="small"
            icon={<StarIcon sx={{ fontSize: 14, color: '#FCD34D' }} />}
            emptyIcon={<StarIcon sx={{ fontSize: 14, color: '#E5E7EB' }} />}
          />
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(13),
              color: '#111827',
            }}
          >
            {(params.value as number).toFixed(1)}
          </Typography>
        </RowStack>
      ),
    },
    {
      field: 'trips',
      headerName: 'Trips',
      flex: 0.5,
      minWidth: 70,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'docs',
      headerName: 'Docs',
      flex: 0.6,
      minWidth: 90,
      renderCell: (params) => {
        const isComplete = params.value === 'Complete';
        return (
          <Chip
            label={params.value as string}
            size="small"
            sx={{
              background: isComplete ? '#ECFDF5' : '#FFFBEB',
              color: isComplete ? '#059669' : '#D97706',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: pxToRem(11),
              height: '24px',
              borderRadius: '100px',
            }}
          />
        );
      },
    },
    {
      field: 'actions' as string,
      headerName: 'Actions',
      flex: 0.5,
      minWidth: 80,
      sortable: false,
      renderCell: (params) => (
        <RowStack spacing={'4px'}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleRowClick(params.row);
            }}
            sx={{
              width: 30,
              height: 30,
              color: '#9CA3AF',
              '&:hover': { color: '#2F6FED', background: '#EBF2FF' },
            }}
          >
            <VisibilityOutlinedIcon sx={{ fontSize: 17 }} />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(params.row);
            }}
            sx={{
              width: 30,
              height: 30,
              color: '#6B7280',
              '&:hover': {
                color: alpha('#6B7280', 0.9),
              },
            }}
          >
            <EditOutlinedIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </RowStack>
      ),
    },
  ];

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <RowStack justifyContent={'space-between'}>
          <DashboardTitleAndDesc
            title="Driver Management"
            desc="Manage your driver roster, documents, fleet assignments, and status"
          />
          <Box
            onClick={() => setAddDrawerOpen(true)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              height: '40px',
              padding: '0 20px',
              background: '#2F6FED',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'opacity 0.15s ease',
              '&:hover': { opacity: 0.9 },
            }}
          >
            <AddIcon sx={{ fontSize: 16, color: '#FFFFFF' }} />
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(13),
                color: '#FFFFFF',
                whiteSpace: 'nowrap',
              }}
            >
              Add New Driver
            </Typography>
          </Box>
        </RowStack>

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
                spacing={'12px'}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '12px',
                    background: card.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {card.icon}
                </Box>
                <Stack spacing={0}>
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
              </Stack>
            </Grid>
          ))}
        </Grid>

        {/* Table */}
        <AppGridtable
          columns={columns}
          data={drivers}
          initialPageSize={10}
          disableAutoPagination
          totalRows={totalDriverCount}
          onPaginationModelChange={(model) =>
            setPaginationModel({ page: model.page, pageSize: model.pageSize })
          }
          isFetchingData={isFetchingDrivers || isLoadingDrivers}
          emptyState={
            <Box sx={{ height: 400, width: '100%' }}>
              <EmptyState animationSrc="/empty.json" />
            </Box>
          }
          onRowClick={(row) => handleRowClick(row)}
          sx={{
            height: 'auto',
            width: '100%',
          }}
        >
          <RowStack justifyContent={'space-between'} width={'100%'}>
            <RowStack spacing={'8px'}>
              <PeopleOutlineIcon
                sx={{
                  fontSize: 20,
                  color: (theme) => theme.palette.primary.main,
                }}
              />
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(16),
                  color: '#111827',
                }}
              >
                Driver Roster
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(13),
                  color: '#9CA3AF',
                }}
              >
                {totalDriverCount} registered drivers — fleet association shown
              </Typography>
            </RowStack>
            <AppSearchField
              name="search"
              placeholder="Search drivers..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                // A narrower result set can be shorter than the current page.
                setPaginationModel((prev) => ({ ...prev, page: 0 }));
              }}
              boxProps={{
                sx: { width: '240px' },
              }}
            />
          </RowStack>
        </AppGridtable>
      </Stack>

      {/* Driver Detail Drawer */}
      <DriverDetailDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        driver={selectedDriver}
        onDriverChanged={() => void refetchDrivers()}
      />

      {/* Edit Driver Drawer */}
      <EditDriverDrawer
        open={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        driver={editDriver}
        onSaved={() => void refetchDrivers()}
      />

      {/* Add Driver Drawer */}
      <AddDriverDrawer
        open={addDrawerOpen}
        onClose={() => setAddDrawerOpen(false)}
        onCreated={() => void refetchDrivers()}
      />
    </AppDashboardLayout>
  );
};
