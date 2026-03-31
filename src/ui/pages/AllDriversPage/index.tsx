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
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppGridtable,
  AppSearchField,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { GridColSpec } from '../../modules/components/GridTable';
import {
  DriverDetailDrawer,
  EditDriverDrawer,
  AddDriverDrawer,
} from './ui/components';
import { pxToRem } from '../../../common';

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

// ─── Sample Data ────────────────────────────────────────────────────────────

const driversData: AllDriverRow[] = [
  {
    id: '1',
    driverId: 'DRV-001',
    name: 'Marcus Johnson',
    avatar: '',
    fleet: 'MediGo Direct',
    vehicle: 'Toyota Sienna · 2022',
    plate: 'ABC-1234',
    status: 'On Trip',
    rating: 4.9,
    trips: 312,
    docs: 'Complete',
    joinedDate: 'Jan 2023',
    phone: '+1 (555) 201-3344',
    email: 'marcus.j@medigo.com',
    dateOfBirth: '1988-03-14',
    memberSince: 'Jan 2023',
    license: 'DL-NY-448821',
    bgCheck: 'Verified',
    licenseExpiry: '2027-03-14',
    docsStatus: 'Complete',
    capabilities: ['Wheelchair Assistance', 'Senior Assistance'],
  },
  {
    id: '2',
    driverId: 'DRV-002',
    name: 'Sarah Williams',
    avatar: '',
    fleet: 'MedRide Express',
    vehicle: 'Honda Odyssey · 2021',
    plate: 'DEF-5678',
    status: 'Available',
    rating: 4.8,
    trips: 287,
    docs: 'Complete',
    joinedDate: 'Feb 2023',
    phone: '+1 (555) 202-4455',
    email: 's.williams@medride.com',
    dateOfBirth: '1990-07-22',
    memberSince: 'Feb 2023',
    license: 'DL-NY-559932',
    bgCheck: 'Verified',
    licenseExpiry: '2026-11-08',
    docsStatus: 'Complete',
    capabilities: ['Senior Assistance'],
  },
  {
    id: '3',
    driverId: 'DRV-003',
    name: 'David Chen',
    avatar: '',
    fleet: 'MediGo Direct',
    vehicle: 'Ford Escape · 2023',
    plate: 'GHI-9012',
    status: 'Available',
    rating: 4.8,
    trips: 264,
    docs: 'Complete',
    joinedDate: 'Mar 2023',
    phone: '+1 (555) 303-5566',
    email: 'd.chen@medigo.com',
    dateOfBirth: '1985-11-30',
    memberSince: 'Mar 2023',
    license: 'DL-CA-337710',
    bgCheck: 'Verified',
    licenseExpiry: '2027-05-20',
    docsStatus: 'Complete',
    capabilities: ['Wheelchair Assistance'],
  },
  {
    id: '4',
    driverId: 'DRV-004',
    name: 'Emily Rodriguez',
    avatar: '',
    fleet: 'CareTransit Co.',
    vehicle: 'Chrysler Pacifica · 2020',
    plate: 'JKL-3456',
    status: 'On Trip',
    rating: 4.7,
    trips: 241,
    docs: 'Pending',
    joinedDate: 'Apr 2023',
    phone: '+1 (555) 404-7788',
    email: 'e.rodriguez@caretransit.com',
    dateOfBirth: '1992-01-15',
    memberSince: 'Apr 2023',
    license: 'DL-TX-226609',
    bgCheck: 'Verified',
    licenseExpiry: '2026-09-12',
    docsStatus: 'Pending',
    capabilities: ['Senior Assistance'],
  },
  {
    id: '5',
    driverId: 'DRV-005',
    name: 'James Thompson',
    avatar: '',
    fleet: 'HealthHaul LLC',
    vehicle: 'Dodge Caravan · 2021',
    plate: 'MNO-7890',
    status: 'On Trip',
    rating: 4.7,
    trips: 218,
    docs: 'Complete',
    joinedDate: 'May 2023',
    phone: '+1 (555) 505-9900',
    email: 'j.thompson@healthhaul.com',
    dateOfBirth: '1987-06-08',
    memberSince: 'May 2023',
    license: 'DL-FL-115508',
    bgCheck: 'Verified',
    licenseExpiry: '2027-01-25',
    docsStatus: 'Complete',
    capabilities: ['Wheelchair Assistance', 'Senior Assistance'],
  },
  {
    id: '6',
    driverId: 'DRV-006',
    name: 'Anna Kim',
    avatar: '',
    fleet: 'MediGo Direct',
    vehicle: 'Toyota Camry · 2022',
    plate: 'PQR-1234',
    status: 'Available',
    rating: 4.6,
    trips: 195,
    docs: 'Complete',
    joinedDate: 'Jun 2023',
    phone: '+1 (555) 606-1122',
    email: 'a.kim@medigo.com',
    dateOfBirth: '1994-09-03',
    memberSince: 'Jun 2023',
    license: 'DL-WA-004407',
    bgCheck: 'Verified',
    licenseExpiry: '2027-08-15',
    docsStatus: 'Complete',
    capabilities: ['Senior Assistance'],
  },
  {
    id: '7',
    driverId: 'DRV-007',
    name: 'Tom Roberts',
    avatar: '',
    fleet: 'SafeRide Medical',
    vehicle: 'Kia Sedona · 2020',
    plate: 'STU-5678',
    status: 'Suspended',
    rating: 4.5,
    trips: 178,
    docs: 'Pending',
    joinedDate: 'Jul 2023',
    phone: '+1 (555) 707-3344',
    email: 't.roberts@saferidemd.com',
    dateOfBirth: '1991-12-20',
    memberSince: 'Jul 2023',
    license: 'DL-OH-993306',
    bgCheck: 'Pending',
    licenseExpiry: '2026-04-10',
    docsStatus: 'Pending',
    capabilities: [],
  },
  {
    id: '8',
    driverId: 'DRV-008',
    name: 'Grace Miller',
    avatar: '',
    fleet: 'MobiCare Transport',
    vehicle: 'Buick Enclave · 2021',
    plate: 'VWX-9012',
    status: 'Available',
    rating: 4.4,
    trips: 156,
    docs: 'Complete',
    joinedDate: 'Aug 2023',
    phone: '+1 (555) 808-5566',
    email: 'g.miller@mobicare.com',
    dateOfBirth: '1989-04-17',
    memberSince: 'Aug 2023',
    license: 'DL-PA-882205',
    bgCheck: 'Verified',
    licenseExpiry: '2027-02-28',
    docsStatus: 'Complete',
    capabilities: ['Wheelchair Assistance'],
  },
];

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

  const filteredDrivers = useMemo(() => {
    if (!searchQuery.trim()) return driversData;
    const query = searchQuery.toLowerCase();
    return driversData.filter(
      (d) =>
        d.name.toLowerCase().includes(query) ||
        d.fleet.toLowerCase().includes(query) ||
        d.vehicle.toLowerCase().includes(query)
    );
  }, [searchQuery]);

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
      value: '148',
      label: 'Total Drivers',
      valueColor: '#2F6FED',
      iconBg: '#EBF2FF',
      icon: <PeopleOutlineIcon sx={{ fontSize: 18, color: '#2F6FED' }} />,
    },
    {
      value: '32',
      label: 'Available Now',
      valueColor: '#10B981',
      iconBg: '#ECFDF5',
      icon: <CheckCircleOutlineIcon sx={{ fontSize: 18, color: '#10B981' }} />,
    },
    {
      value: '62',
      label: 'On Trip',
      valueColor: '#D97706',
      iconBg: '#EEF2FF',
      icon: <NearMeOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />,
    },
    {
      value: '84,320 mi',
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
                {filteredDrivers.length} registered drivers — fleet association
                shown
              </Typography>
            </RowStack>
            <AppSearchField
              name="search"
              placeholder="Search drivers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
      />

      {/* Edit Driver Drawer */}
      <EditDriverDrawer
        open={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        driver={editDriver}
      />

      {/* Add Driver Drawer */}
      <AddDriverDrawer
        open={addDrawerOpen}
        onClose={() => setAddDrawerOpen(false)}
      />
    </AppDashboardLayout>
  );
};
