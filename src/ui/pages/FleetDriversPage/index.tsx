'use client';

import { useState, useMemo, useCallback } from 'react';
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
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppGridtable,
  AppSearchField,
  AppNotificationSnackbar,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { GridColSpec } from '../../modules/components/GridTable';
import { DispatchStatCard } from '../DispatchPage/ui/components/DispatchStatCard';
import {
  FleetDriverProfileDrawer,
  FleetDriverRow,
  DriverStatus,
} from './ui/components';
import { pxToRem } from '../../../common';

import totalDriversIcon from './ui/assets/icons/total-drivers-icon.svg';
import availableDriversIcon from './ui/assets/icons/available-drivers-icon.svg';
import onTripIcon from './ui/assets/icons/on-trip-icon.svg';
import offDutyIcon from './ui/assets/icons/off-duty-icon.svg';

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
        sx={{ fontSize: 12, color: '#059669 !important' }}
      />
    ),
  },
  'On Trip': {
    color: '#D97706',
    bg: '#FFFBEB',
    icon: (
      <DirectionsCarOutlinedIcon
        sx={{ fontSize: 12, color: '#D97706 !important' }}
      />
    ),
  },
  'Off Duty': {
    color: '#6B7280',
    bg: '#F3F4F6',
    icon: (
      <AccessTimeIcon sx={{ fontSize: 12, color: '#6B7280 !important' }} />
    ),
  },
  Suspended: {
    color: '#EF4444',
    bg: '#FEF2F2',
    icon: (
      <AccessTimeIcon sx={{ fontSize: 12, color: '#EF4444 !important' }} />
    ),
  },
};

// ─── Fleet Filter Tabs ──────────────────────────────────────────────────────

const fleetFilters = [
  'All',
  'MedRide Express',
  'CareTransit Co.',
  'HealthHaul LLC',
  'SafeRide Medical',
  'MobiCare Transport',
];

// ─── Sample Data ────────────────────────────────────────────────────────────

const driversData: FleetDriverRow[] = [
  {
    id: '1',
    name: 'Sarah Williams',
    avatar: '',
    fleetCompany: 'MedRide Express',
    vehicle: 'Honda Odyssey · 2021',
    plate: 'DEF-5678',
    status: 'Available',
    rating: 4.8,
    trips: 287,
    joinedDate: 'Feb 2024',
    phone: '+1 (555) 202-4455',
    email: 's.williams@medride.com',
    license: 'DL-NY-559932',
  },
  {
    id: '2',
    name: 'Leon Price',
    avatar: '',
    fleetCompany: 'MedRide Express',
    vehicle: 'Toyota Camry · 2022',
    plate: 'GHI-9012',
    status: 'On Trip',
    rating: 4.7,
    trips: 198,
    joinedDate: 'Mar 2024',
    phone: '+1 (555) 303-5566',
    email: 'l.price@medride.com',
    license: 'DL-CA-448821',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    avatar: '',
    fleetCompany: 'CareTransit Co.',
    vehicle: 'Chrysler Pacifica · 2020',
    plate: 'JKL-3456',
    status: 'On Trip',
    rating: 4.7,
    trips: 241,
    joinedDate: 'Feb 2024',
    phone: '+1 (555) 404-7788',
    email: 'e.rodriguez@caretransit.ca',
    license: 'DL-BC-337710',
  },
  {
    id: '4',
    name: 'Kevin Cho',
    avatar: '',
    fleetCompany: 'CareTransit Co.',
    vehicle: 'Ford Escape · 2022',
    plate: 'MNO-7890',
    status: 'Available',
    rating: 4.6,
    trips: 176,
    joinedDate: 'Apr 2024',
    phone: '+1 (555) 505-9900',
    email: 'k.cho@caretransit.ca',
    license: 'DL-BC-226609',
  },
  {
    id: '5',
    name: 'James Thompson',
    avatar: '',
    fleetCompany: 'HealthHaul LLC',
    vehicle: 'Dodge Caravan · 2021',
    plate: 'PQR-1234',
    status: 'On Trip',
    rating: 4.7,
    trips: 218,
    joinedDate: 'Mar 2024',
    phone: '+1 (555) 606-1122',
    email: 'j.thompson@healthhaul.ca',
    license: 'DL-QC-115508',
  },
  {
    id: '6',
    name: 'Mia Patel',
    avatar: '',
    fleetCompany: 'HealthHaul LLC',
    vehicle: 'Kia Sedona · 2021',
    plate: 'STU-5678',
    status: 'Off Duty',
    rating: 4.5,
    trips: 142,
    joinedDate: 'May 2024',
    phone: '+1 (555) 707-3344',
    email: 'm.patel@healthhaul.ca',
    license: 'DL-QC-004407',
  },
  {
    id: '7',
    name: 'Tom Roberts',
    avatar: '',
    fleetCompany: 'SafeRide Medical',
    vehicle: 'Kia Sedona · 2020',
    plate: 'VWX-9012',
    status: 'Off Duty',
    rating: 4.5,
    trips: 178,
    joinedDate: 'Apr 2024',
    phone: '+1 (555) 808-5566',
    email: 't.roberts@saferidemd.ca',
    license: 'DL-AB-993306',
  },
  {
    id: '8',
    name: 'Grace Miller',
    avatar: '',
    fleetCompany: 'MobiCare Transport',
    vehicle: 'Buick Enclave · 2021',
    plate: 'YZA-3456',
    status: 'Available',
    rating: 4.4,
    trips: 156,
    joinedDate: 'Jun 2024',
    phone: '+1 (555) 909-7788',
    email: 'g.miller@mobicare.ca',
    license: 'DL-ON-882205',
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const FleetDriversPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFleetFilter, setActiveFleetFilter] = useState('All');
  const [selectedDriver, setSelectedDriver] = useState<FleetDriverRow | null>(
    null
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

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

  const statusCounts = useMemo(() => {
    return {
      total: driversData.length,
      available: driversData.filter((d) => d.status === 'Available').length,
      onTrip: driversData.filter((d) => d.status === 'On Trip').length,
      offDuty: driversData.filter((d) => d.status === 'Off Duty').length,
    };
  }, []);

  const statCards = [
    {
      icon: totalDriversIcon,
      value: String(statusCounts.total),
      label: 'Total Fleet Drivers',
      subtitle: '',
      iconBg: '#EBF2FF',
    },
    {
      icon: availableDriversIcon,
      value: String(statusCounts.available),
      label: 'Available',
      subtitle: '',
      iconBg: '#ECFDF5',
    },
    {
      icon: onTripIcon,
      value: String(statusCounts.onTrip),
      label: 'On Trip',
      subtitle: '',
      iconBg: '#FFFBEB',
    },
    {
      icon: offDutyIcon,
      value: String(statusCounts.offDuty),
      label: 'Off Duty',
      subtitle: '',
      iconBg: '#F3F4F6',
    },
  ];

  const handleRowClick = useCallback((row: FleetDriverRow) => {
    setSelectedDriver(row);
    setDrawerOpen(true);
  }, []);

  const handleStatusChange = useCallback(
    (driver: FleetDriverRow, newStatus: DriverStatus) => {
      setSnackbarMessage(
        `${driver.name} status updated to ${newStatus}`
      );
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
      field: 'fleetCompany',
      headerName: 'Fleet Company',
      flex: 1,
      minWidth: 150,
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
            icon={
              <StarIcon sx={{ fontSize: 14, color: '#FCD34D' }} />
            }
            emptyIcon={
              <StarIcon sx={{ fontSize: 14, color: '#E5E7EB' }} />
            }
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
        {/* Header */}
        <DashboardTitleAndDesc
          title="Fleet Drivers"
          desc="Drivers belonging to approved fleet partner companies"
        />

        {/* Stat Cards */}
        <Grid container spacing={'12px'}>
          {statCards.map((card, index) => (
            <Grid key={index} size={{ xs: 6, lg: 3 }}>
              <DispatchStatCard {...card} />
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
                color:
                  activeFleetFilter === filter ? '#FFFFFF' : '#6B7280',
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
          data={filteredDrivers}
          initialPageSize={8}
          onRowClick={(row) => handleRowClick(row)}
          sx={{
            height: 'auto',
            width: '100%',
          }}
        >
          <RowStack justifyContent={'space-between'} width={'100%'}>
            <RowStack spacing={'8px'}>
              <PeopleOutlineIcon sx={{ fontSize: 20, color: '#9CA3AF' }} />
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
