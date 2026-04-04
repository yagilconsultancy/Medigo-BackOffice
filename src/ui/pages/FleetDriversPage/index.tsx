'use client';

import { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Avatar,
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
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppGridtable,
  AppSearchField,
  AppNotificationSnackbar,
  CustomBreadCrumbs,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { GridColSpec } from '../../modules/components/GridTable';
import { EmptyState } from '../../modules/blocks';
import {
  FleetDriverProfileDrawer,
  FleetDriverRow,
  DriverStatus,
} from './ui/components';
import { pxToRem, useGetFleetCompanyDrivers } from '../../../common';

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
    color: '#6366F1',
    bg: '#EEF2FF',
    icon: (
      <NearMeOutlinedIcon
        sx={{ fontSize: pxToRem(11), color: '#6366F1 !important' }}
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

// ─── Helpers ────────────────────────────────────────────────────────────────

const mapApiStatusToDriverStatus = (
  isOnline: boolean,
  isApproved: boolean,
  bgStatus: string
): DriverStatus => {
  if (bgStatus === 'suspended') return 'Suspended';
  if (!isApproved) return 'Off Duty';
  if (isOnline) return 'Available';
  return 'Off Duty';
};

// ─── Component ──────────────────────────────────────────────────────────────

export const FleetDriversPage = () => {
  const searchParams = useSearchParams();
  const fleetId = searchParams.get('fleet_id') || '';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDriver, setSelectedDriver] = useState<FleetDriverRow | null>(
    null
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // ─── API Hook ─────────────────────────────────────────────────────────
  const { data: driversData } = useGetFleetCompanyDrivers({
    businessId: fleetId,
  });

  // ─── Derived State ────────────────────────────────────────────────────
  const driverRows = useMemo<FleetDriverRow[]>(() => {
    if (!driversData?.success || !driversData?.data?.length) return [];
    return driversData.data.map((driver) => ({
      id: driver.user_id,
      name: driver.user_id,
      avatar: '',
      fleetCompany: '--',
      vehicle:
        [driver.vehicle_make, driver.vehicle_model, driver.vehicle_year]
          .filter(Boolean)
          .join(' ') || '--',
      plate: driver.vehicle_plate ?? '--',
      status: mapApiStatusToDriverStatus(
        driver.is_online,
        driver.is_approved,
        driver.background_check_status
      ),
      rating: driver.rating,
      trips: driver.total_trips,
      joinedDate: '--',
      phone: '',
      email: '',
      license: driver.license_number ?? '--',
    }));
  }, [driversData]);

  const filteredDrivers = useMemo(() => {
    if (!searchQuery.trim()) return driverRows;
    const query = searchQuery.toLowerCase();
    return driverRows.filter(
      (d) =>
        d.name.toLowerCase().includes(query) ||
        d.fleetCompany.toLowerCase().includes(query) ||
        d.vehicle.toLowerCase().includes(query)
    );
  }, [searchQuery, driverRows]);

  const statusCounts = useMemo(() => {
    return {
      total: driverRows.length,
      available: driverRows.filter((d) => d.status === 'Available').length,
      onTrip: driverRows.filter((d) => d.status === 'On Trip').length,
      offDuty: driverRows.filter((d) => d.status === 'Off Duty').length,
    };
  }, [driverRows]);

  const statCards = [
    {
      value: String(statusCounts.total),
      label: 'Total Fleet Drivers',
      valueColor: '#2F6FED',
    },
    {
      value: String(statusCounts.available),
      label: 'Available',
      valueColor: '#10B981',
    },
    {
      value: String(statusCounts.onTrip),
      label: 'On Trip',
      valueColor: '#D97706',
    },
    {
      value: String(statusCounts.offDuty),
      label: 'Off Duty',
      valueColor: '#6B7280',
    },
  ];

  // ─── Handlers ─────────────────────────────────────────────────────────
  const handleRowClick = useCallback((row: FleetDriverRow) => {
    setSelectedDriver(row);
    setDrawerOpen(true);
  }, []);

  const handleStatusChange = useCallback(
    (driver: FleetDriverRow, newStatus: DriverStatus) => {
      setSnackbarMessage(`${driver.name} status updated to ${newStatus}`);
      setSnackbarOpen(true);
      setSelectedDriver({ ...driver, status: newStatus });
    },
    []
  );

  const columns: GridColSpec<FleetDriverRow>[] = [
    {
      field: 'name',
      headerName: 'Driver',
      flex: 1.2,
      minWidth: 180,
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
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(13),
                color: '#111827',
              }}
            >
              {params.row.name}
            </Typography>
          </RowStack>
        );
      },
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
      field: 'status',
      headerName: 'Status',
      flex: 0.8,
      minWidth: 130,
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
      flex: 0.7,
      minWidth: 100,
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
      field: 'joinedDate',
      headerName: 'Joined',
      flex: 0.6,
      minWidth: 90,
    },
    {
      field: 'actions' as string,
      headerName: '',
      flex: 0.3,
      minWidth: 50,
      sortable: false,
      renderCell: () => (
        <IconButton size="small" sx={{ color: '#9CA3AF' }}>
          <PeopleOutlineIcon sx={{ fontSize: 16 }} />
        </IconButton>
      ),
    },
  ];

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Breadcrumbs */}
        <CustomBreadCrumbs
          breadcrumbsData={[
            { href: '/fleet/companies', text: 'Fleet Companies' },
            { href: '/fleet/drivers', text: 'Fleet Drivers', active: true },
          ]}
        />

        {/* Header */}
        <DashboardTitleAndDesc
          title="Fleet Drivers"
          desc="Drivers belonging to approved fleet partner companies"
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
          data={filteredDrivers}
          initialPageSize={8}
          onRowClick={(row) => handleRowClick(row)}
          emptyState={<EmptyState animationSrc="/empty.json" />}
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
                Fleet Driver Roster
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(13),
                  color: '#9CA3AF',
                }}
              >
                ({filteredDrivers.length} drivers)
              </Typography>
            </RowStack>
            <AppSearchField
              name="search"
              placeholder="Search fleet drivers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              boxProps={{
                sx: { width: '240px' },
              }}
            />
          </RowStack>
        </AppGridtable>
      </Stack>

      {/* Driver Profile Drawer */}
      <FleetDriverProfileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        driver={selectedDriver}
        onStatusChange={handleStatusChange}
      />

      {/* Notification Snackbar */}
      <AppNotificationSnackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </AppDashboardLayout>
  );
};
