'use client';

import { useState, useMemo } from 'react';
import { Box, Grid, IconButton, Stack, Typography } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppButton,
  AppGridtable,
  AppSearchField,
  DashboardTitleAndDesc,
  RowStack,
  StyledImage,
} from '../../modules/components';
import { GridColSpec } from '../../modules/components/GridTable';
import { DispatchStatCard } from '../DispatchPage/ui/components/DispatchStatCard';
import {
  CompanyNameCell,
  FleetStatusChip,
  FleetCompanyStatus,
} from './ui/components';
import { pxToRem } from '../../../common';

import totalFleetsIcon from './ui/assets/icons/total-fleets-icon.svg';
import activeFleetsIcon from './ui/assets/icons/active-fleets-icon.svg';
import fleetVehiclesIcon from './ui/assets/icons/fleet-vehicles-icon.svg';
import fleetDriversIcon from './ui/assets/icons/fleet-drivers-icon.svg';
import filterIcon from '../BookingPage/ui/assets/icons/filter-Icon.svg';

// ─── Types ──────────────────────────────────────────────────────────────────

export type FleetCompanyRow = {
  id: string;
  fleetId: string;
  companyName: string;
  contactPerson: string;
  contactEmail: string;
  city: string;
  vehicles: number;
  drivers: number;
  revenue: string;
  status: FleetCompanyStatus;
  joinedDate: string;
};

// ─── Sample Data (from Figma) ───────────────────────────────────────────────

const companiesData: FleetCompanyRow[] = [
  {
    id: '1',
    fleetId: 'FL-001',
    companyName: 'MedRide Express',
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
    contactPerson: 'David Kim',
    contactEmail: 'david@healthhaul.ca',
    city: 'Montréal, QC',
    vehicles: 52,
    drivers: 45,
    revenue: '$108,600',
    status: 'Active',
    joinedDate: 'Mar 2024',
  },
  {
    id: '4',
    fleetId: 'FL-004',
    companyName: 'SafeRide Medical',
    contactPerson: 'Lisa Tremblay',
    contactEmail: 'lisa@saferide.ca',
    city: 'Ottawa, ON',
    vehicles: 28,
    drivers: 22,
    revenue: '$62,300',
    status: 'Active',
    joinedDate: 'Apr 2024',
  },
  {
    id: '5',
    fleetId: 'FL-005',
    companyName: 'MobiCare Transport',
    contactPerson: 'Kevin Cho',
    contactEmail: 'kevin@mobicare.ca',
    city: 'Calgary, AB',
    vehicles: 40,
    drivers: 34,
    revenue: '$86,500',
    status: 'Active',
    joinedDate: 'May 2024',
  },
  {
    id: '6',
    fleetId: 'FL-006',
    companyName: 'Apex Medical Rides',
    contactPerson: 'Emma Dubois',
    contactEmail: 'emma@apexmedical.ca',
    city: 'Edmonton, AB',
    vehicles: 32,
    drivers: 26,
    revenue: '$71,200',
    status: 'Inactive',
    joinedDate: 'Jun 2024',
  },
  {
    id: '7',
    fleetId: 'FL-007',
    companyName: 'SwiftCare Mobility',
    contactPerson: 'Olivier Renaud',
    contactEmail: 'orenaud@swiftcare.ca',
    city: 'Winnipeg, MB',
    vehicles: 24,
    drivers: 18,
    revenue: '$52,400',
    status: 'Active',
    joinedDate: 'Jul 2024',
  },
  {
    id: '8',
    fleetId: 'FL-008',
    companyName: 'VitalMove Health',
    contactPerson: 'Robert Patel',
    contactEmail: 'rpatel@vitalmove.ca',
    city: 'Hamilton, ON',
    vehicles: 24,
    drivers: 13,
    revenue: '$38,600',
    status: 'Active',
    joinedDate: 'Aug 2024',
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const FleetCompaniesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

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
      subtitle: 'All registered fleets',
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
      subtitle: 'Active fleet drivers',
      iconBg: '#FFFBEB',
    },
  ];

  const columns: GridColSpec<FleetCompanyRow>[] = [
    {
      field: 'companyName',
      headerName: 'Fleet',
      flex: 1.4,
      minWidth: 180,
      renderCell: (params) => (
        <CompanyNameCell
          name={params.row.companyName}
          fleetId={params.row.fleetId}
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
              fontWeight: 500,
              fontSize: pxToRem(13),
              color: '#111827',
              lineHeight: '18px',
            }}
          >
            {params.row.contactPerson}
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
            {params.row.contactEmail}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'city',
      headerName: 'City',
      flex: 0.8,
      minWidth: 110,
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
      headerAlign: 'right',
      align: 'right',
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(13),
            color: '#059669',
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.6,
      minWidth: 90,
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
            sx={{
              background: '#2F6FED',
              borderRadius: '12px',
              padding: '10px 20px',
              textTransform: 'none',
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(13),
              '&:hover': { background: '#2558C9' },
            }}
            startIcon={<AddOutlinedIcon sx={{ fontSize: 16 }} />}
          >
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
          sx={{
            height: 'auto',
            width: '100%',
          }}
        >
          <RowStack justifyContent={'space-between'} width={'100%'}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 700,
                fontSize: pxToRem(15),
                color: '#111827',
              }}
            >
              All Fleet Partners
            </Typography>
            <RowStack spacing={1}>
              <AppSearchField
                name="search"
                placeholder="Search fleets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                boxProps={{
                  sx: { width: '240px' },
                }}
              />
              <RowStack
                spacing={1}
                sx={{
                  padding: '11.5px 16.07px',
                  borderRadius: '14px',
                  background: '#F7F9FB',
                  border: '0.67px solid #E8ECF0',
                  cursor: 'pointer',
                }}
              >
                <StyledImage
                  src={filterIcon}
                  alt="filter"
                  sx={{
                    width: '15px',
                    height: '15px',
                  }}
                />
                <Typography
                  sx={{
                    color: (theme) => theme.color.grey,
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 600,
                    fontSize: pxToRem(13),
                    lineHeight: '19.5px',
                  }}
                >
                  Filter
                </Typography>
              </RowStack>
            </RowStack>
          </RowStack>
        </AppGridtable>
      </Stack>
    </AppDashboardLayout>
  );
};
