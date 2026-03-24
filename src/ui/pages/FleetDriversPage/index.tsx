'use client';

import { useState, useMemo } from 'react';
import { Grid, IconButton, Stack, Typography } from '@mui/material';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppGridtable,
  AppSearchField,
  DashboardTitleAndDesc,
  RowStack,
  StyledImage,
} from '../../modules/components';
import { GridColSpec } from '../../modules/components/GridTable';
import { DispatchStatCard } from '../DispatchPage/ui/components/DispatchStatCard';
import {
  DriverNameCell,
  DriverStatusChip,
  DriverStatus,
} from './ui/components';
import { pxToRem } from '../../../common';

import totalFleetDriversIcon from './ui/assets/icons/total-fleet-drivers-icon.svg';
import activeDriversIcon from './ui/assets/icons/active-drivers-icon.svg';
import onTripIcon from './ui/assets/icons/on-trip-icon.svg';
import avgRatingIcon from './ui/assets/icons/avg-rating-icon.svg';
import filterIcon from '../BookingPage/ui/assets/icons/filter-Icon.svg';

// ─── Types ──────────────────────────────────────────────────────────────────

export type FleetDriverRow = {
  id: string;
  name: string;
  initials: string;
  color: string;
  fleetCompany: string;
  vehicle: string;
  status: DriverStatus;
  rating: number;
  trips: number;
  joined: string;
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

const driversData: FleetDriverRow[] = [
  {
    id: '1',
    name: 'Sarah Williams',
    initials: 'SW',
    color: '#7C3AED',
    fleetCompany: 'MedRide Express',
    vehicle: 'Honda Odyssey \u00b7 2021',
    status: 'Available',
    rating: 4.8,
    trips: 287,
    joined: 'Feb 2024',
  },
  {
    id: '2',
    name: 'Leon Price',
    initials: 'LP',
    color: '#2F6FED',
    fleetCompany: 'MedRide Express',
    vehicle: 'Toyota Camry \u00b7 2022',
    status: 'On Trip',
    rating: 4.7,
    trips: 198,
    joined: 'Mar 2024',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    initials: 'ER',
    color: '#D97706',
    fleetCompany: 'CareTransit Co.',
    vehicle: 'Chrysler Pacifica \u00b7 2020',
    status: 'On Trip',
    rating: 4.7,
    trips: 241,
    joined: 'Feb 2024',
  },
  {
    id: '4',
    name: 'Kevin Cho',
    initials: 'KC',
    color: '#059669',
    fleetCompany: 'CareTransit Co.',
    vehicle: 'Ford Escape \u00b7 2022',
    status: 'Available',
    rating: 4.6,
    trips: 176,
    joined: 'Apr 2024',
  },
  {
    id: '5',
    name: 'James Thompson',
    initials: 'JT',
    color: '#DC2626',
    fleetCompany: 'HealthHaul LLC',
    vehicle: 'Dodge Caravan \u00b7 2021',
    status: 'On Trip',
    rating: 4.7,
    trips: 218,
    joined: 'Mar 2024',
  },
  {
    id: '6',
    name: 'Aisha Patel',
    initials: 'AP',
    color: '#0891B2',
    fleetCompany: 'SafeRide Medical',
    vehicle: 'Toyota Sienna \u00b7 2022',
    status: 'Available',
    rating: 4.9,
    trips: 312,
    joined: 'Jan 2024',
  },
  {
    id: '7',
    name: 'Robert Nguyen',
    initials: 'RN',
    color: '#4F46E5',
    fleetCompany: 'MobiCare Transport',
    vehicle: 'Honda Odyssey EX \u00b7 2023',
    status: 'Off Duty',
    rating: 4.5,
    trips: 156,
    joined: 'May 2024',
  },
  {
    id: '8',
    name: 'Lisa Tremblay',
    initials: 'LT',
    color: '#BE185D',
    fleetCompany: 'HealthHaul LLC',
    vehicle: 'Chevrolet Traverse \u00b7 2022',
    status: 'Off Duty',
    rating: 4.6,
    trips: 189,
    joined: 'Apr 2024',
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const FleetDriversPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFleetFilter, setActiveFleetFilter] = useState('All');

  const filteredDrivers = useMemo(() => {
    let filtered = driversData;

    if (activeFleetFilter !== 'All') {
      filtered = filtered.filter((d) => d.fleetCompany === activeFleetFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(query) ||
          d.fleetCompany.toLowerCase().includes(query) ||
          d.vehicle.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, activeFleetFilter]);

  const statCards = [
    {
      icon: totalFleetDriversIcon,
      value: '8',
      label: 'Total Fleet Drivers',
      subtitle: 'Across all fleets',
      iconBg: '#EBF2FF',
    },
    {
      icon: activeDriversIcon,
      value: '3',
      label: 'Available',
      subtitle: 'Ready for dispatch',
      iconBg: '#ECFDF5',
    },
    {
      icon: onTripIcon,
      value: '3',
      label: 'On Trip',
      subtitle: 'Currently driving',
      iconBg: '#EEF2FF',
    },
    {
      icon: avgRatingIcon,
      value: '2',
      label: 'Off Duty',
      subtitle: 'Not available',
      iconBg: '#FFFBEB',
    },
  ];

  const columns: GridColSpec<FleetDriverRow>[] = [
    {
      field: 'name',
      headerName: 'Driver',
      flex: 1.3,
      minWidth: 170,
      renderCell: (params) => (
        <DriverNameCell
          name={params.row.name}
          initials={params.row.initials}
          color={params.row.color}
        />
      ),
    },
    {
      field: 'fleetCompany',
      headerName: 'Fleet Company',
      flex: 1.1,
      minWidth: 150,
    },
    {
      field: 'vehicle',
      headerName: 'Vehicle',
      flex: 1.2,
      minWidth: 170,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.7,
      minWidth: 100,
      renderCell: (params) => (
        <DriverStatusChip status={params.value as DriverStatus} />
      ),
    },
    {
      field: 'rating',
      headerName: 'Rating',
      flex: 0.5,
      minWidth: 70,
      renderCell: (params) => (
        <RowStack spacing={'4px'}>
          <StarOutlinedIcon sx={{ fontSize: 14, color: '#F59E0B' }} />
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(13),
              color: '#111827',
            }}
          >
            {params.value}
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
      field: 'joined',
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
          title="Fleet Drivers"
          desc="Manage and monitor all drivers associated with fleet partners"
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
          data={filteredDrivers}
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
            <RowStack spacing={1}>
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
          </RowStack>
        </AppGridtable>
      </Stack>
    </AppDashboardLayout>
  );
};
