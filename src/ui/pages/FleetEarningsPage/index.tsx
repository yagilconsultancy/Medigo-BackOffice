'use client';

import { useState, useCallback } from 'react';
import {
  Box,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppGridtable,
  AppNotificationSnackbar,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { GridColSpec } from '../../modules/components/GridTable';
import {
  FleetRevenueChart,
  PayoutModal,
  EarningsRow,
} from './ui/components';
import { pxToRem } from '../../../common';

// ─── Sample Data ────────────────────────────────────────────────────────────

const earningsData: EarningsRow[] = [
  {
    id: '1',
    fleet: 'MedRide Express',
    initials: 'MR',
    color: '#2F6FED',
    drivers: 42,
    trips: '1,840',
    grossRevenue: '$82,800',
    commission: '−$20,700',
    netPayout: '$62,100',
    share: 88,
  },
  {
    id: '2',
    fleet: 'CareTransit Co.',
    initials: 'CT',
    color: '#10B981',
    drivers: 31,
    trips: '1,420',
    grossRevenue: '$63,900',
    commission: '−$15,975',
    netPayout: '$47,925',
    share: 68,
  },
  {
    id: '3',
    fleet: 'HealthHaul LLC',
    initials: 'HH',
    color: '#F59E0B',
    drivers: 24,
    trips: '1,090',
    grossRevenue: '$49,050',
    commission: '−$12,263',
    netPayout: '$36,788',
    share: 52,
  },
  {
    id: '4',
    fleet: 'SafeRide Medical',
    initials: 'SR',
    color: '#0EA5E9',
    drivers: 19,
    trips: '860',
    grossRevenue: '$38,700',
    commission: '−$9,675',
    netPayout: '$29,025',
    share: 41,
  },
  {
    id: '5',
    fleet: 'MobiCare Transport',
    initials: 'MC',
    color: '#8B5CF6',
    drivers: 27,
    trips: '1,210',
    grossRevenue: '$54,450',
    commission: '−$13,613',
    netPayout: '$40,838',
    share: 58,
  },
  {
    id: '6',
    fleet: 'Apex Medical Rides',
    initials: 'AM',
    color: '#6366F1',
    drivers: 21,
    trips: '940',
    grossRevenue: '$42,300',
    commission: '−$10,575',
    netPayout: '$31,725',
    share: 45,
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const FleetEarningsPage = () => {
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [selectedFleet, setSelectedFleet] = useState<EarningsRow | null>(
    null
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handlePayOut = useCallback((fleet: EarningsRow) => {
    setSelectedFleet(fleet);
    setPayoutModalOpen(true);
  }, []);

  const handleConfirmPayout = useCallback((fleet: EarningsRow) => {
    setPayoutModalOpen(false);
    setSnackbarMessage(
      `${fleet.netPayout} payout processed for ${fleet.fleet}`
    );
    setSnackbarOpen(true);
  }, []);

  const handleExport = useCallback(() => {
    setSnackbarMessage('Exported!');
    setSnackbarOpen(true);
  }, []);

  const statCards = [
    {
      value: '$331,200',
      label: 'Total Fleet Revenue',
      valueColor: '#2F6FED',
    },
    {
      value: '$248,401',
      label: 'Net Fleet Payouts',
      valueColor: '#10B981',
    },
    {
      value: '6',
      label: 'Pending Payouts',
      valueColor: '#D97706',
    },
    {
      value: '0',
      label: 'Paid Out',
      valueColor: '#6B7280',
    },
  ];

  const columns: GridColSpec<EarningsRow>[] = [
    {
      field: 'fleet',
      headerName: 'Fleet Partner',
      flex: 1.2,
      minWidth: 160,
      renderCell: (params) => (
        <RowStack spacing={'10px'}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              background: params.row.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 700,
                fontSize: pxToRem(10),
                color: '#FFFFFF',
              }}
            >
              {params.row.initials}
            </Typography>
          </Box>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(13),
              color: '#111827',
            }}
          >
            {params.row.fleet}
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
    },
    {
      field: 'commission',
      headerName: 'Commission (25%)',
      flex: 0.9,
      minWidth: 130,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 500,
            fontSize: pxToRem(13),
            color: '#EF4444',
          }}
        >
          {params.value as string}
        </Typography>
      ),
    },
    {
      field: 'netPayout',
      headerName: 'Net Payout',
      flex: 0.7,
      minWidth: 100,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(13),
            color: '#10B981',
          }}
        >
          {params.value as string}
        </Typography>
      ),
    },
    {
      field: 'share',
      headerName: 'Share',
      flex: 0.7,
      minWidth: 90,
      renderCell: (params) => (
        <RowStack spacing={'8px'} sx={{ width: '100%' }}>
          <LinearProgress
            variant="determinate"
            value={params.value as number}
            sx={{
              flex: 1,
              height: 6,
              borderRadius: '3px',
              background: '#F3F4F6',
              '& .MuiLinearProgress-bar': {
                borderRadius: '3px',
                background: '#2F6FED',
              },
            }}
          />
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 500,
              fontSize: pxToRem(12),
              color: '#6B7280',
              minWidth: '28px',
            }}
          >
            {params.value as number}%
          </Typography>
        </RowStack>
      ),
    },
    {
      field: 'actions' as string,
      headerName: 'Actions',
      flex: 0.6,
      minWidth: 90,
      sortable: false,
      renderCell: (params) => (
        <Box
          onClick={(e) => {
            e.stopPropagation();
            handlePayOut(params.row);
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '30px',
            padding: '0 14px',
            background: '#10B981',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'opacity 0.15s ease',
            '&:hover': { opacity: 0.9 },
          }}
        >
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(12),
              color: '#FFFFFF',
              whiteSpace: 'nowrap',
            }}
          >
            Pay Out
          </Typography>
        </Box>
      ),
    },
  ];

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <RowStack sx={{ justifyContent: 'space-between' }}>
          <DashboardTitleAndDesc
            title="Fleet Earnings"
            desc="Revenue reports and earnings breakdown for each fleet partner"
          />
          <Box
            onClick={handleExport}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              height: '36px',
              padding: '0 14px',
              background: '#FFFFFF',
              border: '0.67px solid #E8ECF0',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'opacity 0.15s ease',
              '&:hover': { opacity: 0.85 },
            }}
          >
            <FileDownloadOutlinedIcon
              sx={{ fontSize: 14, color: '#374151' }}
            />
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(12.5),
                color: '#374151',
              }}
            >
              Export Report
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

        {/* Revenue Trends Chart */}
        <FleetRevenueChart />

        {/* Earnings Breakdown Table */}
        <AppGridtable
          columns={columns}
          data={earningsData}
          initialPageSize={6}
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
                  fontWeight: 600,
                  fontSize: pxToRem(16),
                  color: '#111827',
                }}
              >
                Earnings Breakdown
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(13),
                  color: '#9CA3AF',
                }}
              >
                March 2026 (current month) · 6 pending payouts
              </Typography>
            </RowStack>
          </RowStack>
        </AppGridtable>
      </Stack>

      {/* Payout Modal */}
      <PayoutModal
        open={payoutModalOpen}
        onClose={() => setPayoutModalOpen(false)}
        fleet={selectedFleet}
        onConfirm={handleConfirmPayout}
      />

      {/* Notification Snackbar */}
      <AppNotificationSnackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        variant="dark"
      />
    </AppDashboardLayout>
  );
};
