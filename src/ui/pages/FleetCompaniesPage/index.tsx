'use client';

import { useState, useMemo, useCallback } from 'react';
import { Grid, IconButton, Stack, Typography } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppButton,
  AppGridtable,
  AppSearchField,
  AppNotificationSnackbar,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { GridColSpec } from '../../modules/components/GridTable';
import { DispatchStatCard } from '../DispatchPage/ui/components/DispatchStatCard';
import {
  CompanyNameCell,
  FleetStatusChip,
  FleetCompanyStatus,
  FleetCompanyDrawer,
  FleetCompanyRow,
  AddFleetPartnerModal,
} from './ui/components';
import { pxToRem } from '../../../common';

import totalFleetsIcon from './ui/assets/icons/total-fleets-icon.svg';
import activeFleetsIcon from './ui/assets/icons/active-fleets-icon.svg';
import fleetVehiclesIcon from './ui/assets/icons/fleet-vehicles-icon.svg';
import fleetDriversIcon from './ui/assets/icons/fleet-drivers-icon.svg';

// ─── Sample Data ────────────────────────────────────────────────────────────

const companiesData: FleetCompanyRow[] = [
  {
    id: '1',
    fleetId: 'FL-001',
    companyName: 'MedRide Express',
    initials: 'MR',
    color: '#2F6FED',
    contactPerson: 'Jean-Pierre Côté',
    contactEmail: 'jpcote@medride.ca',
    city: 'Toronto, ON',
    vehicles: 48,
    drivers: 42,
    revenue: '$128,400',
    status: 'Active',
    joinedDate: 'Jan 2024',
  },
  {
    id: '2',
    fleetId: 'FL-002',
    companyName: 'CareTransit Co.',
    initials: 'CT',
    color: '#10B981',
    contactPerson: 'Anya Singh',
    contactEmail: 'anya@caretransit.ca',
    city: 'Vancouver, BC',
    vehicles: 36,
    drivers: 31,
    revenue: '$94,200',
    status: 'Active',
    joinedDate: 'Feb 2024',
  },
  {
    id: '3',
    fleetId: 'FL-003',
    companyName: 'HealthHaul LLC',
    initials: 'HH',
    color: '#6366F1',
    contactPerson: 'David Kim',
    contactEmail: 'david@healthhaul.ca',
    city: 'Montreal, QC',
    vehicles: 29,
    drivers: 24,
    revenue: '$71,600',
    status: 'Active',
    joinedDate: 'Mar 2024',
  },
  {
    id: '4',
    fleetId: 'FL-004',
    companyName: 'SafeRide Medical',
    initials: 'SR',
    color: '#F59E0B',
    contactPerson: 'Tina Nguyen',
    contactEmail: 'tina@saferidemd.ca',
    city: 'Calgary, AB',
    vehicles: 22,
    drivers: 19,
    revenue: '$58,800',
    status: 'Active',
    joinedDate: 'Apr 2024',
  },
  {
    id: '5',
    fleetId: 'FL-005',
    companyName: 'PatientPath Inc.',
    initials: 'PP',
    color: '#EC4899',
    contactPerson: 'Marc Beausoleil',
    contactEmail: 'marc@patientpath.ca',
    city: 'Edmonton, AB',
    vehicles: 18,
    drivers: 16,
    revenue: '$32,100',
    status: 'Suspended',
    joinedDate: 'May 2024',
  },
  {
    id: '6',
    fleetId: 'FL-006',
    companyName: 'MobiCare Transport',
    initials: 'MC',
    color: '#0EA5E9',
    contactPerson: 'Sandra Lee',
    contactEmail: 'sandra@mobicare.ca',
    city: 'Ottawa, ON',
    vehicles: 31,
    drivers: 27,
    revenue: '$83,500',
    status: 'Active',
    joinedDate: 'Jun 2024',
  },
  {
    id: '7',
    fleetId: 'FL-007',
    companyName: 'Apex Medical Rides',
    initials: 'AM',
    color: '#8B5CF6',
    contactPerson: 'Robert Gallant',
    contactEmail: 'robert@apexmed.ca',
    city: 'Winnipeg, MB',
    vehicles: 25,
    drivers: 21,
    revenue: '$66,900',
    status: 'Active',
    joinedDate: 'Jul 2024',
  },
  {
    id: '8',
    fleetId: 'FL-008',
    companyName: 'QuickCare Mobility',
    initials: 'QC',
    color: '#D97706',
    contactPerson: 'Priya Sharma',
    contactEmail: 'priya@quickcare.ca',
    city: 'Halifax, NS',
    vehicles: 14,
    drivers: 12,
    revenue: '—',
    status: 'Pending',
    joinedDate: 'Jan 2025',
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const FleetCompaniesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] =
    useState<FleetCompanyRow | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const filteredCompanies = useMemo(() => {
    if (!searchQuery.trim()) return companiesData;
    const query = searchQuery.toLowerCase();
    return companiesData.filter(
      (c) =>
        c.companyName.toLowerCase().includes(query) ||
        c.fleetId.toLowerCase().includes(query) ||
        c.contactPerson.toLowerCase().includes(query) ||
        c.city.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const statCards = [
    {
      icon: totalFleetsIcon,
      value: '12',
      label: 'Total Fleets',
      subtitle: 'All fleet partners',
      iconBg: '#EBF2FF',
    },
    {
      icon: activeFleetsIcon,
      value: '9',
      label: 'Active Fleets',
      subtitle: 'Currently operating',
      iconBg: '#ECFDF5',
    },
    {
      icon: fleetVehiclesIcon,
      value: '284',
      label: 'Total Fleet Vehicles',
      subtitle: 'Across all fleets',
      iconBg: '#EEF2FF',
    },
    {
      icon: fleetDriversIcon,
      value: '231',
      label: 'Fleet Drivers',
      subtitle: 'Registered drivers',
      iconBg: '#FFFBEB',
    },
  ];

  const handleRowClick = useCallback((row: FleetCompanyRow) => {
    setSelectedCompany(row);
    setDrawerOpen(true);
  }, []);

  const handleStatusChange = useCallback(
    (company: FleetCompanyRow, newStatus: FleetCompanyStatus) => {
      setSnackbarMessage(`Status updated to ${newStatus}`);
      setSnackbarOpen(true);
      // Update the selected company status locally for drawer UI
      setSelectedCompany({ ...company, status: newStatus });
    },
    []
  );

  const columns: GridColSpec<FleetCompanyRow>[] = [
    {
      field: 'companyName',
      headerName: 'Fleet',
      flex: 1.4,
      minWidth: 200,
      renderCell: (params) => (
        <CompanyNameCell
          name={params.row.companyName}
          fleetId={params.row.fleetId}
          initials={params.row.initials}
          color={params.row.color}
        />
      ),
    },
    {
      field: 'contactPerson',
      headerName: 'Contact',
      flex: 1.2,
      minWidth: 160,
      renderCell: (params) => (
        <Stack spacing={'2px'}>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(13),
              color: '#374151',
            }}
          >
            {params.row.contactPerson}
          </Typography>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(11.5),
              color: '#9CA3AF',
            }}
          >
            {params.row.contactEmail}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'city',
      headerName: 'City',
      flex: 0.8,
      minWidth: 120,
    },
    {
      field: 'vehicles',
      headerName: 'Vehicles',
      flex: 0.5,
      minWidth: 80,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'drivers',
      headerName: 'Drivers',
      flex: 0.5,
      minWidth: 80,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'revenue',
      headerName: 'Revenue',
      flex: 0.7,
      minWidth: 100,
      renderCell: (params) => (
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
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.7,
      minWidth: 120,
      renderCell: (params) => (
        <FleetStatusChip status={params.value as FleetCompanyStatus} />
      ),
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
          <MoreVertOutlinedIcon sx={{ fontSize: 16 }} />
        </IconButton>
      ),
    },
  ];

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <RowStack justifyContent="space-between">
          <DashboardTitleAndDesc
            title="Fleet Companies"
            desc="All fleet partners operating on the MediGo network"
          />
          <AppButton
            variant="contained"
            onClick={() => setAddModalOpen(true)}
            sx={{
              background: '#2F6FED',
              borderRadius: '14px',
              padding: '8px 20px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: pxToRem(13),
              '&:hover': { background: '#2560D4' },
            }}
          >
            <AddOutlinedIcon sx={{ fontSize: 15, marginRight: '6px' }} />
            Add Fleet Partner
          </AppButton>
        </RowStack>

        {/* Stat Cards */}
        <Grid container spacing={'12px'}>
          {statCards.map((card, index) => (
            <Grid key={index} size={{ xs: 6, lg: 3 }}>
              <DispatchStatCard {...card} />
            </Grid>
          ))}
        </Grid>

        {/* Table */}
        <AppGridtable
          columns={columns}
          data={filteredCompanies}
          initialPageSize={8}
          onRowClick={(row) => handleRowClick(row)}
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
                  fontWeight: 500,
                  fontSize: pxToRem(18),
                  color: '#111827',
                }}
              >
                Fleet Partners
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(13),
                  color: '#6B7280',
                }}
              >
                {filteredCompanies.length} registered fleet companies
              </Typography>
            </RowStack>
            <AppSearchField
              name="search"
              placeholder="Search fleets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              boxProps={{
                sx: { width: '260px' },
              }}
            />
          </RowStack>
        </AppGridtable>
      </Stack>

      {/* View Company Drawer */}
      <FleetCompanyDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        company={selectedCompany}
        onStatusChange={handleStatusChange}
      />

      {/* Add Fleet Partner Modal */}
      <AddFleetPartnerModal open={addModalOpen} setOpen={setAddModalOpen} />

      {/* Notification Snackbar */}
      <AppNotificationSnackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </AppDashboardLayout>
  );
};
