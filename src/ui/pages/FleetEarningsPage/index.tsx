'use client';

import { useState } from 'react';
import { Box, Grid, LinearProgress, Stack, Typography } from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppButton,
  AppCardparent,
  AppGridtable,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { GridColSpec } from '../../modules/components/GridTable';
import { DispatchStatCard } from '../DispatchPage/ui/components/DispatchStatCard';
import { EarningsChart } from './ui/components';
import { pxToRem } from '../../../common';

import totalEarningsIcon from './ui/assets/icons/total-earnings-icon.svg';
import monthlyRevenueIcon from './ui/assets/icons/monthly-revenue-icon.svg';
import pendingPayoutsIcon from './ui/assets/icons/pending-payouts-icon.svg';
import avgPerTripIcon from './ui/assets/icons/avg-per-trip-icon.svg';

// ─── Types ──────────────────────────────────────────────────────────────────

export type FleetEarningsRow = {
  id: string;
  fleetPartner: string;
  drivers: number;
  trips: string;
  grossRevenue: string;
  commission: string;
  netPayout: string;
  share: number;
};

// ─── Fleet Filter Options ───────────────────────────────────────────────────

const fleetFilters = [
  'MedRide Express',
  'CareTransit Co.',
  'HealthHaul LLC',
  'SafeRide Medical',
  'MobiCare Transport',
  'Apex Medical Rides',
];

// ─── Sample Data (from Figma) ───────────────────────────────────────────────

const earningsData: FleetEarningsRow[] = [
  {
    id: '1',
    fleetPartner: 'MedRide Express',
    drivers: 42,
    trips: '1,840',
    grossRevenue: '$82,800',
    commission: '\u2212$20,700',
    netPayout: '$62,100',
    share: 88,
  },
  {
    id: '2',
    fleetPartner: 'CareTransit Co.',
    drivers: 31,
    trips: '1,420',
    grossRevenue: '$63,900',
    commission: '\u2212$15,975',
    netPayout: '$47,925',
    share: 82,
  },
  {
    id: '3',
    fleetPartner: 'HealthHaul LLC',
    drivers: 45,
    trips: '1,680',
    grossRevenue: '$75,600',
    commission: '\u2212$18,900',
    netPayout: '$56,700',
    share: 85,
  },
  {
    id: '4',
    fleetPartner: 'SafeRide Medical',
    drivers: 22,
    trips: '980',
    grossRevenue: '$44,100',
    commission: '\u2212$11,025',
    netPayout: '$33,075',
    share: 76,
  },
  {
    id: '5',
    fleetPartner: 'MobiCare Transport',
    drivers: 34,
    trips: '1,260',
    grossRevenue: '$56,700',
    commission: '\u2212$14,175',
    netPayout: '$42,525',
    share: 79,
  },
  {
    id: '6',
    fleetPartner: 'Apex Medical Rides',
    drivers: 26,
    trips: '820',
    grossRevenue: '$36,900',
    commission: '\u2212$9,225',
    netPayout: '$27,675',
    share: 72,
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const FleetEarningsPage = () => {
  const [activeFleetFilter, setActiveFleetFilter] = useState<string | null>(
    null
  );

  const statCards = [
    {
      icon: totalEarningsIcon,
      value: '$331,200',
      label: 'Total Fleet Revenue',
      subtitle: 'All time fleet revenue',
      iconBg: '#EBF2FF',
    },
    {
      icon: monthlyRevenueIcon,
      value: '$248,401',
      label: 'Net Fleet Payouts',
      subtitle: 'Total paid to fleets',
      iconBg: '#ECFDF5',
    },
    {
      icon: pendingPayoutsIcon,
      value: '6',
      label: 'Pending Payouts',
      subtitle: 'Awaiting processing',
      iconBg: '#FFFBEB',
    },
    {
      icon: avgPerTripIcon,
      value: '0',
      label: 'Paid Out',
      subtitle: 'This cycle',
      iconBg: '#EEF2FF',
    },
  ];

  const columns: GridColSpec<FleetEarningsRow>[] = [
    {
      field: 'fleetPartner',
      headerName: 'Fleet Partner',
      flex: 1.3,
      minWidth: 170,
      renderCell: (params) => (
        <RowStack spacing={'8px'}>
          <BusinessOutlinedIcon sx={{ fontSize: 14, color: '#6B7280' }} />
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 500,
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
      field: 'drivers',
      headerName: 'Drivers',
      flex: 0.5,
      minWidth: 70,
      headerAlign: 'center',
      align: 'center',
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
      field: 'grossRevenue',
      headerName: 'Gross Revenue',
      flex: 0.8,
      minWidth: 110,
      headerAlign: 'right',
      align: 'right',
    },
    {
      field: 'commission',
      headerName: 'Commission (25%)',
      flex: 0.9,
      minWidth: 120,
      headerAlign: 'right',
      align: 'right',
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(13),
            color: '#EF4444',
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'netPayout',
      headerName: 'Net Payout',
      flex: 0.7,
      minWidth: 100,
      headerAlign: 'right',
      align: 'right',
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(13),
            color: '#059669',
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'share',
      headerName: 'Share',
      flex: 0.7,
      minWidth: 90,
      renderCell: (params) => (
        <Stack spacing={'4px'} sx={{ width: '100%' }}>
          <LinearProgress
            variant="determinate"
            value={params.value as number}
            sx={{
              height: 4,
              borderRadius: 2,
              backgroundColor: '#F0F4F8',
              '& .MuiLinearProgress-bar': {
                borderRadius: 2,
                backgroundColor: '#2F6FED',
              },
            }}
          />
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 500,
              fontSize: pxToRem(11),
              color: '#6B7280',
            }}
          >
            {params.value}%
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'actions' as string,
      headerName: 'Actions',
      flex: 0.6,
      minWidth: 90,
      sortable: false,
      renderCell: () => (
        <AppButton
          sx={{
            background: '#2F6FED',
            color: '#FFFFFF',
            fontWeight: 600,
            fontSize: pxToRem(11),
            borderRadius: '8px',
            padding: '4px 12px',
            textTransform: 'none',
            minWidth: 'auto',
            '&:hover': { background: '#2558C9' },
          }}
        >
          Pay Out
        </AppButton>
      ),
    },
  ];

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <RowStack justifyContent="space-between">
          <DashboardTitleAndDesc
            title="Fleet Earnings"
            desc="Track revenue, commissions, and payouts for fleet partners"
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
            startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: 16 }} />}
          >
            Export Report
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

        {/* Revenue Trends Chart */}
        <AppCardparent>
          <Stack spacing={'16px'} sx={{ padding: '20px' }}>
            <RowStack justifyContent="space-between">
              <RowStack spacing={'8px'}>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 700,
                    fontSize: pxToRem(15),
                    color: '#111827',
                  }}
                >
                  Fleet Revenue Trends
                </Typography>
                <RowStack
                  spacing={'4px'}
                  sx={{
                    background: '#ECFDF5',
                    borderRadius: '8px',
                    padding: '3px 8px',
                  }}
                >
                  <TrendingUpOutlinedIcon
                    sx={{ fontSize: 12, color: '#059669' }}
                  />
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 600,
                      fontSize: pxToRem(11),
                      color: '#059669',
                    }}
                  >
                    +43.9% MoM
                  </Typography>
                </RowStack>
              </RowStack>
            </RowStack>

            {/* Fleet Filter Pills */}
            <RowStack spacing={'8px'} flexWrap="wrap">
              {fleetFilters.map((filter) => (
                <Typography
                  key={filter}
                  onClick={() =>
                    setActiveFleetFilter(
                      activeFleetFilter === filter ? null : filter
                    )
                  }
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 500,
                    fontSize: pxToRem(12),
                    color: activeFleetFilter === filter ? '#FFFFFF' : '#6B7280',
                    background:
                      activeFleetFilter === filter ? '#2F6FED' : '#F7F9FB',
                    border: `0.67px solid ${activeFleetFilter === filter ? '#2F6FED' : '#E8ECF0'}`,
                    borderRadius: '20px',
                    padding: '5px 14px',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      background:
                        activeFleetFilter === filter ? '#2F6FED' : '#EBF2FF',
                    },
                  }}
                >
                  {filter}
                </Typography>
              ))}
            </RowStack>

            {/* Revenue Summary Stats */}
            <RowStack spacing={'24px'}>
              <Stack spacing={'2px'}>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 800,
                    fontSize: pxToRem(20),
                    color: '#111827',
                  }}
                >
                  $1,432k
                </Typography>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(11),
                    color: '#9CA3AF',
                  }}
                >
                  7-Month Total
                </Typography>
              </Stack>
              <Stack spacing={'2px'}>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 800,
                    fontSize: pxToRem(20),
                    color: '#111827',
                  }}
                >
                  $205k
                </Typography>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(11),
                    color: '#9CA3AF',
                  }}
                >
                  Avg / Month
                </Typography>
              </Stack>
              <Stack spacing={'2px'}>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 800,
                    fontSize: pxToRem(20),
                    color: '#111827',
                  }}
                >
                  Mar &apos;26 &middot; $331k
                </Typography>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(11),
                    color: '#9CA3AF',
                  }}
                >
                  Best Month
                </Typography>
              </Stack>
            </RowStack>

            <EarningsChart />
          </Stack>
        </AppCardparent>

        {/* Earnings Breakdown Table */}
        <AppGridtable
          columns={columns}
          data={earningsData}
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
              Earnings Breakdown
            </Typography>
          </RowStack>
        </AppGridtable>
      </Stack>
    </AppDashboardLayout>
  );
};
