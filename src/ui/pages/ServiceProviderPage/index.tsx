'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  alpha,
  Avatar,
  Box,
  Chip,
  Grid,
  IconButton,
  Rating,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined';
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined';
import AddIcon from '@mui/icons-material/Add';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppButton,
  AppGridtable,
  AppSearchField,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { AppDropdownMenu } from '../../modules/components/AppDropdownMenu';
import { GridColSpec } from '../../modules/components/GridTable';
import { pxToRem } from '../../../common';
import { DriverViewDrawer, DriverViewData, AddDriverDrawer, EditDriverDrawer, EditDriverData, DriverProfileCard, DriverProfileCardData, SuspendDriverModal, EditDriverModal } from './ui/components';

// ─── Types ──────────────────────────────────────────────────────────────────

type DriverStatus = 'Available' | 'On Trip' | 'Suspended';
type DocsStatus = 'Complete' | 'Pending';

type DriverRow = {
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
  docs: DocsStatus;
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

const statusConfig: Record<
  DriverStatus,
  { color: string; bg: string; border: string }
> = {
  Available: { color: '#166534', bg: '#EDFAF4', border: '#BBF7D0' },
  'On Trip': { color: '#3730A3', bg: '#EEF2FF', border: '#C7D2FE' },
  Suspended: { color: '#991B1B', bg: '#FEF2F2', border: '#FECACA' },
};

const docsConfig: Record<
  DocsStatus,
  { color: string; bg: string; border: string }
> = {
  Complete: { color: '#166534', bg: '#EDFAF4', border: '#BBF7D0' },
  Pending: { color: '#78350F', bg: '#FFFBEB', border: '#FDE68A' },
};

// ─── Reusable Stat Card ─────────────────────────────────────────────────────

type StatCardProps = {
  icon: React.ReactNode;
  iconBg: string;
  value: string;
  label: string;
};

const StatCard = ({ icon, iconBg, value, label }: StatCardProps) => (
  <Stack
    sx={{
      background: '#FFFFFF',
      border: '0.67px solid #F0F4F8',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.06)',
    }}
    spacing={'12px'}
  >
    <Box
      sx={{
        width: 44,
        height: 44,
        borderRadius: '12px',
        background: iconBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {icon}
    </Box>
    <Stack spacing={0}>
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 700,
          fontSize: pxToRem(28),
          lineHeight: '1.2em',
          color: '#111827',
        }}
      >
        {value}
      </Typography>
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 400,
          fontSize: pxToRem(13),
          color: '#6B7280',
          marginTop: '4px',
        }}
      >
        {label}
      </Typography>
    </Stack>
  </Stack>
);

// ─── Mock Data ──────────────────────────────────────────────────────────────

const statCardsData: StatCardProps[] = [
  {
    icon: <PeopleOutlineIcon sx={{ fontSize: 20, color: '#2F6FED' }} />,
    iconBg: '#EBF2FF',
    value: '148',
    label: 'Total Drivers',
  },
  {
    icon: <CheckCircleOutlineIcon sx={{ fontSize: 20, color: '#10B981' }} />,
    iconBg: '#ECFDF5',
    value: '32',
    label: 'Available Now',
  },
  {
    icon: <NearMeOutlinedIcon sx={{ fontSize: 20, color: '#6366F1' }} />,
    iconBg: '#EEF2FF',
    value: '62',
    label: 'On Trip',
  },
  {
    icon: <SpeedOutlinedIcon sx={{ fontSize: 20, color: '#F59E0B' }} />,
    iconBg: '#FFFBEB',
    value: '84,320 mi',
    label: 'Total Mileage',
  },
];

const driversData: DriverRow[] = [
  {
    id: '1', driverId: 'DRV-001', name: 'Marcus Johnson', avatar: '',
    fleet: 'MediGo Direct', vehicle: 'Toyota Sienna · 2022', plate: 'ABC-1234',
    status: 'On Trip', rating: 4.9, trips: 312, docs: 'Complete',
    joinedDate: 'Jan 2023', phone: '+1 (555) 201-3344', email: 'marcus.j@medigo.com',
    dateOfBirth: '1988-03-14', memberSince: 'Jan 2023', license: 'DL-NY-448821',
    bgCheck: 'Verified', licenseExpiry: '2027-03-14', docsStatus: 'Complete',
    capabilities: ['Wheelchair Assistance', 'Senior Assistance'],
  },
  {
    id: '2', driverId: 'DRV-002', name: 'Sarah Williams', avatar: '',
    fleet: 'MedRide Express', vehicle: 'Honda Odyssey · 2021', plate: 'DEF-5678',
    status: 'Available', rating: 4.8, trips: 287, docs: 'Complete',
    joinedDate: 'Feb 2023', phone: '+1 (555) 202-4455', email: 's.williams@medride.com',
    dateOfBirth: '1990-07-22', memberSince: 'Feb 2023', license: 'DL-NY-559932',
    bgCheck: 'Verified', licenseExpiry: '2026-11-08', docsStatus: 'Complete',
    capabilities: ['Senior Assistance'],
  },
  {
    id: '3', driverId: 'DRV-003', name: 'David Chen', avatar: '',
    fleet: 'MediGo Direct', vehicle: 'Ford Escape · 2023', plate: 'GHI-9012',
    status: 'Available', rating: 4.8, trips: 264, docs: 'Complete',
    joinedDate: 'Mar 2023', phone: '+1 (555) 303-5566', email: 'd.chen@medigo.com',
    dateOfBirth: '1985-11-30', memberSince: 'Mar 2023', license: 'DL-CA-337710',
    bgCheck: 'Verified', licenseExpiry: '2027-05-20', docsStatus: 'Complete',
    capabilities: ['Wheelchair Assistance'],
  },
  {
    id: '4', driverId: 'DRV-004', name: 'Emily Rodriguez', avatar: '',
    fleet: 'CareTransit Co.', vehicle: 'Chrysler Pacifica · 2020', plate: 'JKL-3456',
    status: 'On Trip', rating: 4.7, trips: 241, docs: 'Pending',
    joinedDate: 'Apr 2023', phone: '+1 (555) 404-7788', email: 'e.rodriguez@caretransit.com',
    dateOfBirth: '1992-01-15', memberSince: 'Apr 2023', license: 'DL-TX-226609',
    bgCheck: 'Verified', licenseExpiry: '2026-09-12', docsStatus: 'Pending',
    capabilities: ['Senior Assistance'],
  },
  {
    id: '5', driverId: 'DRV-005', name: 'James Thompson', avatar: '',
    fleet: 'HealthHaul LLC', vehicle: 'Dodge Caravan · 2021', plate: 'MNO-7890',
    status: 'On Trip', rating: 4.7, trips: 218, docs: 'Complete',
    joinedDate: 'May 2023', phone: '+1 (555) 505-9900', email: 'j.thompson@healthhaul.com',
    dateOfBirth: '1987-06-08', memberSince: 'May 2023', license: 'DL-FL-115508',
    bgCheck: 'Verified', licenseExpiry: '2027-01-25', docsStatus: 'Complete',
    capabilities: ['Wheelchair Assistance', 'Senior Assistance'],
  },
  {
    id: '6', driverId: 'DRV-006', name: 'Anna Kim', avatar: '',
    fleet: 'MediGo Direct', vehicle: 'Toyota Camry · 2022', plate: 'PQR-1234',
    status: 'Available', rating: 4.6, trips: 195, docs: 'Complete',
    joinedDate: 'Jun 2023', phone: '+1 (555) 606-1122', email: 'a.kim@medigo.com',
    dateOfBirth: '1994-09-03', memberSince: 'Jun 2023', license: 'DL-WA-004407',
    bgCheck: 'Verified', licenseExpiry: '2027-08-15', docsStatus: 'Complete',
    capabilities: ['Senior Assistance'],
  },
  {
    id: '7', driverId: 'DRV-007', name: 'Tom Roberts', avatar: '',
    fleet: 'SafeRide Medical', vehicle: 'Kia Sedona · 2020', plate: 'STU-5678',
    status: 'Suspended', rating: 4.5, trips: 178, docs: 'Pending',
    joinedDate: 'Jul 2023', phone: '+1 (555) 707-3344', email: 't.roberts@saferidemd.com',
    dateOfBirth: '1991-12-20', memberSince: 'Jul 2023', license: 'DL-OH-993306',
    bgCheck: 'Pending', licenseExpiry: '2026-04-10', docsStatus: 'Pending',
    capabilities: [],
  },
  {
    id: '8', driverId: 'DRV-008', name: 'Grace Miller', avatar: '',
    fleet: 'MobiCare Transport', vehicle: 'Buick Enclave · 2021', plate: 'VWX-9012',
    status: 'Available', rating: 4.4, trips: 156, docs: 'Complete',
    joinedDate: 'Aug 2023', phone: '+1 (555) 808-5566', email: 'g.miller@mobicare.com',
    dateOfBirth: '1989-04-17', memberSince: 'Aug 2023', license: 'DL-PA-882205',
    bgCheck: 'Verified', licenseExpiry: '2027-02-28', docsStatus: 'Complete',
    capabilities: ['Wheelchair Assistance'],
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const ServiceProviderPage = () => {
  const router = useRouter();

  // Dropdown state
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [providerType, setProviderType] = useState('Drivers');

  // Tab state
  const [activeTab, setActiveTab] = useState(0);

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<DriverRow | null>(null);
  const [addDriverOpen, setAddDriverOpen] = useState(false);
  const [editDriverOpen, setEditDriverOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<EditDriverData | null>(null);

  // Modal state
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [suspendDriver, setSuspendDriver] = useState<DriverProfileCardData | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editModalDriver, setEditModalDriver] = useState<DriverProfileCardData | null>(null);

  const filteredDrivers = useMemo(() => {
    if (!searchQuery.trim()) return driversData;
    const query = searchQuery.toLowerCase();
    return driversData.filter(
      (d) =>
        d.name.toLowerCase().includes(query) ||
        d.fleet.toLowerCase().includes(query) ||
        d.vehicle.toLowerCase().includes(query) ||
        d.driverId.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // ─── Table Columns ──────────────────────────────────────────────────────

  const columns: GridColSpec<DriverRow>[] = [
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
            color: '#6B7280',
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
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(12.5),
            color: '#9CA3AF',
          }}
        >
          {params.row.plate}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.8,
      minWidth: 120,
      renderCell: (params) => {
        const config = statusConfig[params.value as DriverStatus];
        return (
          <Chip
            label={params.value as string}
            size="small"
            sx={{
              background: config.bg,
              color: config.color,
              border: `0.67px solid ${config.border}`,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: pxToRem(11.5),
              height: '26px',
              borderRadius: '100px',
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
            icon={<StarIcon sx={{ fontSize: 14, color: '#F59E0B' }} />}
            emptyIcon={<StarIcon sx={{ fontSize: 14, color: '#E5E7EB' }} />}
          />
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(13),
              color: '#374151',
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
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 500,
            fontSize: pxToRem(13),
            color: '#374151',
          }}
        >
          {params.value as number}
        </Typography>
      ),
    },
    {
      field: 'docs',
      headerName: 'Docs',
      flex: 0.6,
      minWidth: 90,
      renderCell: (params) => {
        const config = docsConfig[params.value as DocsStatus];
        return (
          <Chip
            label={params.value as string}
            size="small"
            sx={{
              background: config.bg,
              color: config.color,
              border: `0.67px solid ${config.border}`,
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
            onClick={() => {
              setSelectedDriver(params.row);
              setDrawerOpen(true);
            }}
            sx={{
              width: 30,
              height: 30,
              color: '#2F6FED',
              background: alpha('#2F6FED', 0.1),
              '&:hover': { background: alpha('#2F6FED', 0.18) },
            }}
          >
            <VisibilityOutlinedIcon sx={{ fontSize: 17 }} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => {
              setEditingDriver(params.row);
              setEditDriverOpen(true);
            }}
            sx={{
              width: 30,
              height: 30,
              color: '#6B7280',
              '&:hover': { color: '#374151', background: '#F3F4F6' },
            }}
          >
            <EditOutlinedIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </RowStack>
      ),
    },
  ];

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header: Title + Dropdown */}
        <RowStack justifyContent={'space-between'}>
          <DashboardTitleAndDesc
            title="Service Provider"
            desc="Manage your driver roster, documents, fleet assignments, and status"
          />
          <Box>
            <Box
              onClick={(e: React.MouseEvent<HTMLDivElement>) =>
                setAnchorEl(e.currentTarget)
              }
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                background: '#FFFFFF',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                borderRadius: '10px',
                cursor: 'pointer',
                minWidth: '160px',
                transition: 'border-color 0.2s ease',
                '&:hover': { borderColor: 'rgba(0, 0, 0, 0.15)' },
              }}
            >
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontSize: pxToRem(18),
                  fontWeight: 400,
                  color: 'rgba(0, 0, 0, 0.6)',
                  flexGrow: 1,
                }}
              >
                {providerType}
              </Typography>
              <KeyboardArrowDownIcon
                sx={{ fontSize: 20, color: 'rgba(0, 0, 0, 0.4)' }}
              />
            </Box>
            <AppDropdownMenu
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={() => setAnchorEl(null)}
              options={['Drivers', 'Caregivers']}
              selectedOption={providerType}
              onOptionSelected={(option) => {
                setProviderType(option);
                setActiveTab(0);
                setAnchorEl(null);
              }}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            />
          </Box>
        </RowStack>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{
            minHeight: 'unset',
            '& .MuiTabs-indicator': { display: 'none' },
            '& .MuiTabs-flexContainer': { gap: '16px' },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontFamily: (theme) => theme.typography.fontFamily,
              fontSize: pxToRem(18),
              fontWeight: 400,
              color: 'rgba(0, 0, 0, 0.6)',
              minHeight: '44px',
              padding: '10px 24px',
              borderRadius: '10px',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              background: '#FFFFFF',
              transition: 'all 0.2s ease',
              '&.Mui-selected': {
                fontWeight: 500,
                color: '#FFFFFF',
                background: '#2F6FED',
                border: '1px solid #2F6FED',
              },
            },
          }}
        >
          <Tab label="All Drivers" />
          <Tab label="Driver Profile" />
        </Tabs>

        {/* Content */}
        {providerType === 'Drivers' ? (
          activeTab === 0 ? (
            <Stack spacing={'24px'}>
              {/* Sub-header: Title + Add Button */}
              <RowStack justifyContent={'space-between'}>
                <DashboardTitleAndDesc title="All Drivers" desc="" />
                <AppButton
                  startIcon={<AddIcon />}
                  onClick={() => setAddDriverOpen(true)}
                  sx={{
                    height: '40px',
                    borderRadius: '14px',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: pxToRem(13),
                    padding: '0 20px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Add New Driver
                </AppButton>
              </RowStack>

              {/* Stat Cards */}
              <Grid container spacing={'16px'}>
                {statCardsData.map((card, index) => (
                  <Grid key={index} size={{ xs: 6, lg: 3 }}>
                    <StatCard {...card} />
                  </Grid>
                ))}
              </Grid>

              {/* Driver Table */}
              <AppGridtable
                columns={columns}
                data={filteredDrivers}
                initialPageSize={8}
                sx={{ height: 'auto', width: '100%' }}
              >
                <RowStack justifyContent={'space-between'} width={'100%'}>
                  <Stack spacing={'2px'}>
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 500,
                        fontSize: pxToRem(18),
                        color: '#111827',
                        lineHeight: '1.5em',
                      }}
                    >
                      Driver Roster
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 400,
                        fontSize: pxToRem(13),
                        color: '#6B7280',
                        lineHeight: '1.5em',
                      }}
                    >
                      {filteredDrivers.length} registered drivers — fleet
                      association shown
                    </Typography>
                  </Stack>
                  <AppSearchField
                    name="search"
                    placeholder="Search drivers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    boxProps={{ sx: { width: '240px' } }}
                  />
                </RowStack>
              </AppGridtable>
            </Stack>
          ) : (
            // Driver Profile tab — card grid
            <Stack spacing={'24px'}>
              <DashboardTitleAndDesc title="Driver Profiles" desc="" />
              <Grid container spacing={'20px'}>
                {driversData.map((driver) => (
                  <Grid key={driver.id} size={{ xs: 12, md: 6 }}>
                    <DriverProfileCard
                      driver={driver}
                      onEdit={() => {
                        setEditModalDriver(driver);
                        setEditModalOpen(true);
                      }}
                      onDocuments={() => {
                        router.push('/drivers/documents');
                      }}
                      onSuspend={() => {
                        setSuspendDriver(driver);
                        setSuspendModalOpen(true);
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Stack>
          )
        ) : (
          // Caregivers — empty state
          <Stack
            alignItems={'center'}
            justifyContent={'center'}
            sx={{
              background: '#FFFFFF',
              border: '0.67px solid #F0F4F8',
              borderRadius: '16px',
              padding: '60px 20px',
              boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.06)',
            }}
          >
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 500,
                fontSize: pxToRem(16),
                color: '#9CA3AF',
              }}
            >
              Caregiver management coming soon
            </Typography>
          </Stack>
        )}
      </Stack>

      {/* Driver Detail Drawer */}
      <DriverViewDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        driver={selectedDriver}
      />

      {/* Add Driver Drawer */}
      <AddDriverDrawer
        open={addDriverOpen}
        onClose={() => setAddDriverOpen(false)}
      />

      {/* Edit Driver Drawer */}
      <EditDriverDrawer
        open={editDriverOpen}
        onClose={() => setEditDriverOpen(false)}
        driver={editingDriver}
      />

      {/* Suspend Driver Modal */}
      <SuspendDriverModal
        open={suspendModalOpen}
        setOpen={setSuspendModalOpen}
        driver={suspendDriver}
      />

      {/* Edit Driver Modal */}
      <EditDriverModal
        open={editModalOpen}
        setOpen={setEditModalOpen}
        driver={editModalDriver}
      />
    </AppDashboardLayout>
  );
};
