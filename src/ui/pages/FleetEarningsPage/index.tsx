'use client';

import { useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  alpha,
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
  CustomBreadCrumbs,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { GridColSpec } from '../../modules/components/GridTable';
import { EmptyState } from '../../modules/blocks';
import { FleetRevenueChart, PayoutModal, EarningsRow } from './ui/components';
import {
  pxToRem,
  useResolvedApiQuery,
  useGetFleetEarningsKpi,
  useGetFleetEarningsTrend,
  useGetFleetEarningsBreakdown,
} from '../../../common';

// ─── Helpers ────────────────────────────────────────────────────────────────

const COLORS = [
  '#2F6FED',
  '#10B981',
  '#F59E0B',
  '#0EA5E9',
  '#8B5CF6',
  '#6366F1',
  '#EF4444',
  '#EC4899',
];

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};

// ─── Component ──────────────────────────────────────────────────────────────

export const FleetEarningsPage = () => {
  const searchParams = useSearchParams();
  const fleetId = searchParams.get('fleet_id') || '';

  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [selectedFleet, setSelectedFleet] = useState<EarningsRow | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const { data: kpis } = useResolvedApiQuery(useGetFleetEarningsKpi, null, {
    fleet_id: fleetId || undefined,
  });

  const { data: trendData } = useResolvedApiQuery(
    useGetFleetEarningsTrend,
    null,
    { fleet_id: fleetId || undefined }
  );

  const { data: breakdownData } = useGetFleetEarningsBreakdown({
    fleet_id: fleetId || undefined,
  });

  const earningsRows = useMemo<EarningsRow[]>(() => {
    if (!breakdownData?.success || !breakdownData?.data?.length) return [];
    const totalRevenue = breakdownData.data.reduce(
      (sum, row) => sum + row.revenue,
      0
    );
    return breakdownData.data.map((row, index) => ({
      id: row.fleet_id,
      fleet: row.fleet_name,
      initials: getInitials(row.fleet_name),
      color: COLORS[index % COLORS.length],
      drivers: 0,
      trips: formatNumber(row.trips),
      grossRevenue: formatCurrency(row.revenue),
      commission: `−${formatCurrency(row.commission)}`,
      netPayout: formatCurrency(row.net_earnings),
      share:
        totalRevenue > 0 ? Math.round((row.revenue / totalRevenue) * 100) : 0,
    }));
  }, [breakdownData]);

  const statCards = useMemo(
    () => [
      {
        value: kpis ? formatCurrency(kpis.total_revenue) : '--',
        label: 'Total Fleet Revenue',
        valueColor: '#2F6FED',
      },
      {
        value: kpis ? formatCurrency(kpis.total_payouts) : '--',
        label: 'Net Fleet Payouts',
        valueColor: '#10B981',
      },
      {
        value: kpis
          ? `${kpis.revenue_change_percent >= 0 ? '+' : ''}${kpis.revenue_change_percent.toFixed(1)}%`
          : '--',
        label: `Revenue Trend (${kpis?.revenue_trend ?? '--'})`,
        valueColor: '#D97706',
      },
      {
        value: kpis
          ? `${kpis.payout_change_percent >= 0 ? '+' : ''}${kpis.payout_change_percent.toFixed(1)}%`
          : '--',
        label: `Payout Trend (${kpis?.payout_trend ?? '--'})`,
        valueColor: '#6B7280',
      },
    ],
    [kpis]
  );

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
      headerName: 'Commission',
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
            background: alpha('#2F6FED', 0.1),
            border: '0.67px solid #2F6FED',
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
              color: '#2F6FED',
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
        {/* Breadcrumbs */}
        <CustomBreadCrumbs
          breadcrumbsData={[
            { href: '/fleet/companies', text: 'Fleet Companies' },
            { href: '/fleet/earnings', text: 'Fleet Earnings', active: true },
          ]}
        />

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
            <FileDownloadOutlinedIcon sx={{ fontSize: 14, color: '#374151' }} />
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
        <FleetRevenueChart trendData={trendData} />

        {/* Earnings Breakdown Table */}
        <AppGridtable
          columns={columns}
          data={earningsRows}
          initialPageSize={6}
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
                {earningsRows.length} fleet partner
                {earningsRows.length !== 1 ? 's' : ''}
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
