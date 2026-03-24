'use client';

import { useState, useMemo } from 'react';
import { Grid, IconButton, Stack, Typography } from '@mui/material';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppGridtable,
  AppSearchField,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { GridColSpec } from '../../modules/components/GridTable';
import { DispatchStatCard } from '../DispatchPage/ui/components/DispatchStatCard';
import {
  VehicleStatusChip,
  VehicleStatus,
  DocValidityChip,
  DocValidity,
} from './ui/components';
import { pxToRem } from '../../../common';

import totalVehiclesIcon from './ui/assets/icons/total-vehicles-icon.svg';
import inServiceIcon from './ui/assets/icons/in-service-icon.svg';
import maintenanceIcon from './ui/assets/icons/maintenance-icon.svg';
import wavVehiclesIcon from './ui/assets/icons/wav-vehicles-icon.svg';

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
  },
  {
    id: '5',
    vehicleId: 'VH-005',
    vehicle: '2023 Honda Odyssey',
    plate: 'QRS-1234',
    category: 'Standard Ride',
    fleet: 'HealthHaul LLC',
    driver: 'James Thompson',
    status: 'Active',
    insurance: 'Valid',
    registration: 'Valid',
  },
  {
    id: '6',
    vehicleId: 'VH-008',
    vehicle: '2022 Chrysler Pacifica',
    plate: 'TUV-5678',
    category: 'Wheelchair Accessible',
    fleet: 'SafeRide Medical',
    driver: 'Aisha Patel',
    status: 'Active',
    insurance: 'Expiring',
    registration: 'Valid',
  },
  {
    id: '7',
    vehicleId: 'VH-009',
    vehicle: '2021 Toyota Camry',
    plate: 'WXY-9012',
    category: 'Standard Ride',
    fleet: 'MobiCare Transport',
    driver: 'Robert Nguyen',
    status: 'Active',
    insurance: 'Valid',
    registration: 'Valid',
  },
  {
    id: '8',
    vehicleId: 'VH-010',
    vehicle: '2020 Ford Escape',
    plate: 'ABC-3456',
    category: 'Standard Ride',
    fleet: 'HealthHaul LLC',
    driver: 'Lisa Tremblay',
    status: 'Inactive',
    insurance: 'Expired',
    registration: 'Expired',
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const FleetVehiclesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFleetFilter, setActiveFleetFilter] = useState('All');

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

  const statCards = [
    {
      icon: totalVehiclesIcon,
      value: '8',
      label: 'Total Fleet Vehicles',
      subtitle: 'Across all fleets',
      iconBg: '#EBF2FF',
    },
    {
      icon: inServiceIcon,
      value: '6',
      label: 'Active',
      subtitle: 'Currently operating',
      iconBg: '#ECFDF5',
    },
    {
      icon: maintenanceIcon,
      value: '1',
      label: 'Maintenance',
      subtitle: 'Scheduled service',
      iconBg: '#FFFBEB',
    },
    {
      icon: wavVehiclesIcon,
      value: '1',
      label: 'Inactive',
      subtitle: 'Out of service',
      iconBg: '#EEF2FF',
    },
  ];

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
          <MoreVertOutlinedIcon sx={{ fontSize: 16 }} />
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
          desc="Track and manage all vehicles registered under fleet partners"
        />

        {/* Stat Cards */}
        <Grid container spacing={'12px'}>
          {statCards.map((card, index) => (
            <Grid key={index} size={{ xs: 6, lg: 3 }}>
              <DispatchStatCard {...card} />
            </Grid>
          ))}
        </Grid>

        {/* Fleet Filter Pills */}
        <RowStack spacing={'8px'} flexWrap="wrap">
          {fleetFilters.map((filter) => (
            <Typography
              key={filter}
              onClick={() => setActiveFleetFilter(filter)}
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(12.5),
                color: activeFleetFilter === filter ? '#FFFFFF' : '#6B7280',
                background:
                  activeFleetFilter === filter ? '#2F6FED' : '#FFFFFF',
                border: `0.67px solid ${activeFleetFilter === filter ? '#2F6FED' : '#E8ECF0'}`,
                borderRadius: '20px',
                padding: '7px 16px',
                cursor: 'pointer',
                userSelect: 'none',
                transition: 'all 0.15s ease',
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
          sx={{
            height: 'auto',
            width: '100%',
          }}
        >
          <RowStack justifyContent={'space-between'} width={'100%'}>
            <RowStack spacing={'8px'}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(15),
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
            <RowStack spacing={1}>
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
          </RowStack>
        </AppGridtable>
      </Stack>
    </AppDashboardLayout>
  );
};
