'use client';

import { useState, useMemo, useCallback } from 'react';
import dayjs from 'dayjs';
import { Grid, IconButton, Stack, Typography } from '@mui/material';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppGridtable,
  AppSearchField,
  AppNotificationSnackbar,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { EmptyState } from '../../modules/blocks';
import { GridColSpec } from '../../modules/components/GridTable';
import {
  VehicleStatusChip,
  VehicleStatus,
  DocValidityChip,
  DocValidity,
  FleetVehicleDrawer,
  ScheduleMaintenanceModal,
} from './ui/components';
import {
  pxToRem,
  useGetFleetVehicles,
  useGetFleetVehicleKpi,
  useGetAllFleetCompanies,
  useResolvedApiQuery,
  useFleetVehiclesApi,
} from '../../../common';
import type { VehicleResponse } from '../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

export type FleetVehicleRow = {
  id: string;
  vehicleId: string;
  vehicle: string;
  plate: string;
  category: string;
  fleet: string;
  driver: string;
  status: VehicleStatus;
  insurance: DocValidity;
  registration: DocValidity;
  mileage: string;
  vin: string;
};

// ─── Helpers ────────────────────────────────────────────────────────────────

const ALL_FLEETS = 'All';

const apiStatusToUi: Record<string, VehicleStatus> = {
  active: 'Active',
  maintenance: 'Maintenance',
  inactive: 'Inactive',
};

const uiStatusToApi: Record<VehicleStatus, string> = {
  Active: 'active',
  Maintenance: 'maintenance',
  Inactive: 'inactive',
};

const apiCategoryToUi = (category?: string | null) => {
  if (!category) return '—';
  return category
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
};

const resolveDocValidity = (expiry?: string | null): DocValidity => {
  if (!expiry) return 'Expired';
  const expiryDate = dayjs(expiry);
  if (!expiryDate.isValid()) return 'Expired';
  const now = dayjs();
  if (expiryDate.isBefore(now, 'day')) return 'Expired';
  if (expiryDate.diff(now, 'day') <= 30) return 'Expiring';
  return 'Valid';
};

const buildVehicleName = (v: VehicleResponse) => {
  const parts = [v.year, v.make, v.model].filter(Boolean);
  return parts.length ? parts.join(' ') : (v.vehicle_name ?? '—');
};

const formatMileage = (mileage?: number | null) =>
  mileage != null ? `${mileage.toLocaleString('en-US')} mi` : '—';

// ─── Component ──────────────────────────────────────────────────────────────

export const FleetVehiclesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFleetFilter, setActiveFleetFilter] = useState(ALL_FLEETS);
  const [selectedVehicle, setSelectedVehicle] =
    useState<FleetVehicleRow | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const { data: kpis } = useResolvedApiQuery(useGetFleetVehicleKpi, null);

  const {
    data: vehiclesList,
    isFetching: isFetchingVehicles,
    isLoading: isLoadingVehicles,
  } = useGetFleetVehicles({
    limit: 100,
    search: searchQuery.trim() || undefined,
  });

  const { data: companiesResponse } = useGetAllFleetCompanies();

  const { changeVehicleStatus, scheduleMaintenance } = useFleetVehiclesApi();

  const vehicles = useMemo<FleetVehicleRow[]>(() => {
    if (!vehiclesList?.success || !vehiclesList?.data?.length) return [];
    return vehiclesList.data.map((item) => ({
      id: item.id,
      vehicleId: `VH-${item.id.slice(-3).toUpperCase()}`,
      vehicle: buildVehicleName(item),
      plate: item.plate_number ?? '—',
      category: apiCategoryToUi(item.category),
      fleet: item.fleet_name ?? '—',
      driver: item.driver_name ?? '—',
      status: apiStatusToUi[item.status?.toLowerCase?.()] ?? 'Inactive',
      insurance: resolveDocValidity(item.insurance_expiry),
      registration: resolveDocValidity(item.registration_expiry),
      mileage: formatMileage(item.mileage),
      vin: item.vin ?? '—',
    }));
  }, [vehiclesList]);

  const fleetFilters = useMemo<string[]>(() => {
    if (!companiesResponse?.success || !companiesResponse?.data?.length)
      return [ALL_FLEETS];
    const names = companiesResponse.data.map((c) => c.name).filter(Boolean);
    return [ALL_FLEETS, ...names];
  }, [companiesResponse]);

  const filteredVehicles = useMemo(() => {
    if (activeFleetFilter === ALL_FLEETS) return vehicles;
    return vehicles.filter((v) => v.fleet === activeFleetFilter);
  }, [vehicles, activeFleetFilter]);

  const statCards = [
    {
      value: String(kpis?.total_vehicles ?? '--'),
      label: 'Total Fleet Vehicles',
      valueColor: '#2F6FED',
    },
    {
      value: String(kpis?.active ?? '--'),
      label: 'Active',
      valueColor: '#10B981',
    },
    {
      value: String(kpis?.maintenance ?? '--'),
      label: 'Maintenance',
      valueColor: '#D97706',
    },
    {
      value: String(kpis?.inactive ?? '--'),
      label: 'Inactive',
      valueColor: '#6B7280',
    },
  ];

  const handleRowClick = useCallback((row: FleetVehicleRow) => {
    setSelectedVehicle(row);
    setDrawerOpen(true);
  }, []);

  const handleStatusChange = useCallback(
    async (vehicle: FleetVehicleRow, newStatus: VehicleStatus) => {
      const success = await changeVehicleStatus({
        vehicleId: vehicle.id,
        status: uiStatusToApi[newStatus],
      });

      if (success) {
        setSelectedVehicle({ ...vehicle, status: newStatus });
      }
    },
    [changeVehicleStatus]
  );

  const handleScheduleMaintenance = useCallback(() => {
    setMaintenanceModalOpen(true);
  }, []);

  const handleConfirmSchedule = useCallback(
    async (date: string, notes: string) => {
      if (!selectedVehicle) return;

      const success = await scheduleMaintenance({
        vehicleId: selectedVehicle.id,
        scheduled_date: date,
        notes: notes.trim() || null,
      });

      if (success) {
        setMaintenanceModalOpen(false);
        setSnackbarMessage(
          `Maintenance scheduled for ${selectedVehicle.vehicle} on ${date}`
        );
        setSnackbarOpen(true);
      }
    },
    [selectedVehicle, scheduleMaintenance]
  );

  const columns: GridColSpec<FleetVehicleRow>[] = [
    {
      field: 'vehicle',
      headerName: 'Vehicle',
      flex: 1.4,
      minWidth: 190,
      renderCell: (params) => (
        <Stack spacing={'2px'}>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(13),
              color: '#111827',
              lineHeight: '18px',
            }}
          >
            {params.row.vehicle}
          </Typography>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(11),
              color: '#9CA3AF',
              lineHeight: '16px',
            }}
          >
            {params.row.vehicleId}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'plate',
      headerName: 'Plate',
      flex: 0.6,
      minWidth: 90,
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 1,
      minWidth: 140,
    },
    {
      field: 'fleet',
      headerName: 'Fleet',
      flex: 1,
      minWidth: 140,
    },
    {
      field: 'driver',
      headerName: 'Driver',
      flex: 0.9,
      minWidth: 130,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.7,
      minWidth: 100,
      renderCell: (params) => (
        <VehicleStatusChip status={params.value as VehicleStatus} />
      ),
    },
    {
      field: 'insurance',
      headerName: 'Insurance',
      flex: 0.6,
      minWidth: 80,
      renderCell: (params) => (
        <DocValidityChip validity={params.value as DocValidity} />
      ),
    },
    {
      field: 'registration',
      headerName: 'Registration',
      flex: 0.7,
      minWidth: 90,
      renderCell: (params) => (
        <DocValidityChip validity={params.value as DocValidity} />
      ),
    },
    {
      field: 'actions' as string,
      headerName: '',
      flex: 0.3,
      minWidth: 50,
      sortable: false,
      renderCell: () => (
        <IconButton size="small" sx={{ color: '#9CA3AF' }}>
          <DirectionsCarOutlinedIcon sx={{ fontSize: 16 }} />
        </IconButton>
      ),
    },
  ];

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <DashboardTitleAndDesc
          title="Fleet Vehicles"
          desc="Vehicles registered under fleet partner companies"
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

        {/* Fleet Filter Tabs */}
        <RowStack spacing={'8px'} sx={{ flexWrap: 'wrap', gap: '8px' }}>
          {fleetFilters.map((filter) => (
            <Typography
              key={filter}
              onClick={() => setActiveFleetFilter(filter)}
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(12),
                color: activeFleetFilter === filter ? '#FFFFFF' : '#6B7280',
                background:
                  activeFleetFilter === filter ? '#2F6FED' : 'transparent',
                border: `0.67px solid ${activeFleetFilter === filter ? '#2F6FED' : '#E8ECF0'}`,
                borderRadius: '20px',
                padding: '6px 14px',
                cursor: 'pointer',
                userSelect: 'none',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
                '&:hover': {
                  background:
                    activeFleetFilter === filter ? '#2F6FED' : '#F7F9FB',
                },
              }}
            >
              {filter}
            </Typography>
          ))}
        </RowStack>

        {/* Table */}
        <AppGridtable
          columns={columns}
          data={filteredVehicles}
          initialPageSize={8}
          onRowClick={(row) => handleRowClick(row)}
          emptyState={<EmptyState animationSrc="/empty.json" />}
          isFetchingData={isFetchingVehicles || isLoadingVehicles}
          sx={{
            minHeight: '500px',
            height: 'auto',
            width: '100%',
          }}
        >
          <RowStack justifyContent={'space-between'} width={'100%'}>
            <RowStack spacing={'8px'}>
              <DirectionsCarOutlinedIcon
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
                Fleet Vehicle Registry
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(13),
                  color: '#9CA3AF',
                }}
              >
                ({filteredVehicles.length} vehicles)
              </Typography>
            </RowStack>
            <AppSearchField
              name="search"
              placeholder="Search vehicles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              boxProps={{
                sx: { width: '240px' },
              }}
            />
          </RowStack>
        </AppGridtable>
      </Stack>

      {/* Vehicle Detail Drawer */}
      <FleetVehicleDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        vehicle={selectedVehicle}
        onStatusChange={handleStatusChange}
        onScheduleMaintenance={handleScheduleMaintenance}
      />

      {/* Schedule Maintenance Modal */}
      <ScheduleMaintenanceModal
        open={maintenanceModalOpen}
        onClose={() => setMaintenanceModalOpen(false)}
        vehicle={selectedVehicle}
        onConfirm={handleConfirmSchedule}
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
