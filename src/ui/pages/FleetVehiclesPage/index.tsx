'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppGridtable,
  AppSearchField,
  AppNotificationSnackbar,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { GridColSpec } from '../../modules/components/GridTable';
import {
  VehicleStatusChip,
  VehicleStatus,
  DocValidityChip,
  DocValidity,
  FleetVehicleDrawer,
  ScheduleMaintenanceModal,
} from './ui/components';
import { pxToRem } from '../../../common';

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

// ─── Fleet Filter Options ───────────────────────────────────────────────────

const fleetFilters = [
  'All',
  'MedRide Express',
  'CareTransit Co.',
  'HealthHaul LLC',
  'SafeRide Medical',
  'MobiCare Transport',
];

// ─── Sample Data (from Figma) ───────────────────────────────────────────────

const vehiclesData: FleetVehicleRow[] = [
  {
    id: '1',
    vehicleId: 'VH-002',
    vehicle: '2022 Toyota Sienna',
    plate: 'DEF-5678',
    category: 'Standard Ride',
    fleet: 'MedRide Express',
    driver: 'Sophie Tremblay',
    status: 'Active',
    insurance: 'Valid',
    registration: 'Valid',
    mileage: '62,400 mi',
    vin: '5FNRL6H74MB049221',
  },
  {
    id: '2',
    vehicleId: 'VH-011',
    vehicle: '2022 Toyota Sienna',
    plate: 'EFG-2345',
    category: 'Wheelchair Accessible',
    fleet: 'MedRide Express',
    driver: 'Luc Boivin',
    status: 'Active',
    insurance: 'Valid',
    registration: 'Valid',
    mileage: '48,200 mi',
    vin: '4T1BF1FK5CU521234',
  },
  {
    id: '3',
    vehicleId: 'VH-004',
    vehicle: '2021 Dodge Grand Caravan',
    plate: 'JKL-3456',
    category: 'Wheelchair Accessible',
    fleet: 'CareTransit Co.',
    driver: 'Aisha Mensah',
    status: 'Maintenance',
    insurance: 'Valid',
    registration: 'Expiring',
    mileage: '85,100 mi',
    vin: '2C4RDGCG5LR198765',
  },
  {
    id: '4',
    vehicleId: 'VH-012',
    vehicle: '2022 Ford Transit',
    plate: 'NOP-6789',
    category: 'Assisted Ride',
    fleet: 'CareTransit Co.',
    driver: 'Kevin Park',
    status: 'Active',
    insurance: 'Valid',
    registration: 'Valid',
    mileage: '31,800 mi',
    vin: '1FTBW2CM3NKA43210',
  },
  {
    id: '5',
    vehicleId: 'VH-005',
    vehicle: '2021 Dodge Grand Caravan',
    plate: 'MNO-7890',
    category: 'Standard Ride',
    fleet: 'HealthHaul LLC',
    driver: 'Marc Lefebvre',
    status: 'Active',
    insurance: 'Valid',
    registration: 'Valid',
    mileage: '72,600 mi',
    vin: '2C4RDGCG1LR167890',
  },
  {
    id: '6',
    vehicleId: 'VH-013',
    vehicle: '2021 Mercedes Sprinter',
    plate: 'QRS-0123',
    category: 'Assisted Ride',
    fleet: 'HealthHaul LLC',
    driver: 'Priya Mehta',
    status: 'Active',
    insurance: 'Valid',
    registration: 'Valid',
    mileage: '55,300 mi',
    vin: 'WD3PE8CD2LP123456',
  },
  {
    id: '7',
    vehicleId: 'VH-007',
    vehicle: '2020 Ford Transit',
    plate: 'STU-5678',
    category: 'Standard Ride',
    fleet: 'SafeRide Medical',
    driver: "Ryan O'Brien",
    status: 'Inactive',
    insurance: 'Expired',
    registration: 'Valid',
    mileage: '98,200 mi',
    vin: '1FTBW2CM0LKB56789',
  },
  {
    id: '8',
    vehicleId: 'VH-008',
    vehicle: '2021 Chevrolet Express',
    plate: 'VWX-9012',
    category: 'Assisted Ride',
    fleet: 'MobiCare Transport',
    driver: 'Isabelle Roy',
    status: 'Active',
    insurance: 'Valid',
    registration: 'Valid',
    mileage: '44,700 mi',
    vin: '1GCWGAFG5M1234567',
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const FleetVehiclesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFleetFilter, setActiveFleetFilter] = useState('All');
  const [selectedVehicle, setSelectedVehicle] =
    useState<FleetVehicleRow | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const filteredVehicles = useMemo(() => {
    let filtered = vehiclesData;

    if (activeFleetFilter !== 'All') {
      filtered = filtered.filter((v) => v.fleet === activeFleetFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.vehicleId.toLowerCase().includes(query) ||
          v.vehicle.toLowerCase().includes(query) ||
          v.plate.toLowerCase().includes(query) ||
          v.fleet.toLowerCase().includes(query) ||
          v.driver.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, activeFleetFilter]);

  const statusCounts = useMemo(() => {
    return {
      total: vehiclesData.length,
      active: vehiclesData.filter((v) => v.status === 'Active').length,
      maintenance: vehiclesData.filter((v) => v.status === 'Maintenance')
        .length,
      inactive: vehiclesData.filter((v) => v.status === 'Inactive').length,
    };
  }, []);

  const statCards = [
    {
      value: String(statusCounts.total),
      label: 'Total Fleet Vehicles',
      valueColor: '#2F6FED',
    },
    {
      value: String(statusCounts.active),
      label: 'Active',
      valueColor: '#10B981',
    },
    {
      value: String(statusCounts.maintenance),
      label: 'Maintenance',
      valueColor: '#D97706',
    },
    {
      value: String(statusCounts.inactive),
      label: 'Inactive',
      valueColor: '#6B7280',
    },
  ];

  const handleRowClick = useCallback((row: FleetVehicleRow) => {
    setSelectedVehicle(row);
    setDrawerOpen(true);
  }, []);

  const handleStatusChange = useCallback(
    (vehicle: FleetVehicleRow, newStatus: VehicleStatus) => {
      setSnackbarMessage(`${vehicle.vehicle} status updated to ${newStatus}`);
      setSnackbarOpen(true);
      setSelectedVehicle({ ...vehicle, status: newStatus });
    },
    []
  );

  const handleScheduleMaintenance = useCallback(() => {
    setMaintenanceModalOpen(true);
  }, []);

  const handleConfirmSchedule = useCallback(
    (date: string, notes: string) => {
      setMaintenanceModalOpen(false);
      setSnackbarMessage(
        `Maintenance scheduled for ${selectedVehicle?.vehicle ?? 'vehicle'} on ${date}`
      );
      setSnackbarOpen(true);
    },
    [selectedVehicle]
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
        <RowStack spacing={'0px'}>
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
          sx={{
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
