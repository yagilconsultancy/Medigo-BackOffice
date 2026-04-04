'use client';

import { useState, useMemo, useCallback } from 'react';
import dayjs from 'dayjs';
import { Grid, IconButton, Stack, Typography, alpha } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppButton,
  AppGridtable,
  AppSearchField,
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
import { EmptyState } from '../../modules/blocks';
import {
  pxToRem,
  useGetFleetCompaniesKpi,
  useGetFleetCompanies,
  useFleetCompaniesApi,
  useResolvedApiQuery,
} from '../../../common';

import totalFleetsIcon from './ui/assets/icons/total-fleets-icon.svg';
import activeFleetsIcon from './ui/assets/icons/active-fleets-icon.svg';
import fleetVehiclesIcon from './ui/assets/icons/fleet-vehicles-icon.svg';
import fleetDriversIcon from './ui/assets/icons/fleet-drivers-icon.svg';

const COLORS = [
  '#2F6FED',
  '#10B981',
  '#6366F1',
  '#F59E0B',
  '#EC4899',
  '#0EA5E9',
  '#8B5CF6',
  '#D97706',
];

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const formatRevenue = (amount?: number) =>
  amount != null
    ? `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0 })}`
    : '—';

// ─── Component ──────────────────────────────────────────────────────────────

export const FleetCompaniesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] =
    useState<FleetCompanyRow | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const { data: kpis } = useResolvedApiQuery(useGetFleetCompaniesKpi, null);

  const { data: companiesList } = useGetFleetCompanies({
    search: searchQuery || undefined,
  });

  const { addPartner, toggleCompanyStatus } = useFleetCompaniesApi();

  const companies = useMemo<FleetCompanyRow[]>(() => {
    if (!companiesList?.success || !companiesList?.data?.length) return [];
    return companiesList.data.map((item, index) => ({
      id: item.id,
      fleetId: `FL-${item.id.slice(-3).toUpperCase()}`,
      companyName: item.name,
      initials: getInitials(item.name),
      color: COLORS[index % COLORS.length],
      contactPerson: item.contact_person ?? '',
      contactEmail: item.email ?? '',
      city: [item.city, item.state].filter(Boolean).join(', '),
      vehicles: item.vehicle_count ?? 0,
      drivers: item.driver_count ?? 0,
      revenue: formatRevenue(item.revenue),
      status: (item.is_active ? 'Active' : 'Suspended') as FleetCompanyStatus,
      joinedDate: dayjs(item.created_at).format('MMM YYYY'),
    }));
  }, [companiesList]);

  const statCards = [
    {
      icon: totalFleetsIcon,
      value: String(kpis?.total_fleets ?? '--'),
      label: 'Total Fleets',
      subtitle: 'All fleet partners',
      iconBg: '#EBF2FF',
    },
    {
      icon: activeFleetsIcon,
      value: String(kpis?.active_fleets ?? '--'),
      label: 'Active Fleets',
      subtitle: 'Currently operating',
      iconBg: '#ECFDF5',
    },
    {
      icon: fleetVehiclesIcon,
      value: String(kpis?.total_fleet_vehicles ?? '--'),
      label: 'Total Fleet Vehicles',
      subtitle: 'Across all fleets',
      iconBg: '#EEF2FF',
    },
    {
      icon: fleetDriversIcon,
      value: String(kpis?.fleet_drivers ?? '--'),
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
    async (company: FleetCompanyRow, newStatus: FleetCompanyStatus) => {
      const isActive = newStatus === 'Active';
      const success = await toggleCompanyStatus({
        businessId: company.id,
        is_active: isActive,
      });

      if (success) {
        setSelectedCompany({ ...company, status: newStatus });
      }
    },
    [toggleCompanyStatus]
  );

  const handleAddPartner = useCallback(
    async (form: {
      companyName: string;
      contactPerson: string;
      email: string;
      city: string;
      vehicles: string;
      drivers: string;
    }) => {
      const [city, state] = form.city.split(',').map((s) => s.trim());

      await addPartner({
        name: form.companyName,
        contact_person: form.contactPerson,
        email: form.email,
        city: city || undefined,
        state: state || undefined,
        num_vehicles: form.vehicles ? Number(form.vehicles) : undefined,
        num_drivers: form.drivers ? Number(form.drivers) : undefined,
      });
    },
    [addPartner]
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
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleRowClick(params.row);
          }}
          sx={{
            background: alpha('#2F6FED', 0.1),
            color: '#2F6FED',
            '&:hover': { background: alpha('#2F6FED', 0.18) },
          }}
        >
          <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
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
          data={companies}
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
                {companies.length} registered fleet companies
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
      <AddFleetPartnerModal
        open={addModalOpen}
        setOpen={setAddModalOpen}
        onSubmit={handleAddPartner}
      />
    </AppDashboardLayout>
  );
};
