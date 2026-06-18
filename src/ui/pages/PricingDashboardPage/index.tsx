'use client';

import { useMemo } from 'react';
import { Box, Grid, Stack, Typography } from '@mui/material';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppGridtable,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { GridColSpec } from '../../modules/components/GridTable';
import {
  pxToRem,
  useGetPricingDashboardKpis,
  useGetRouteComparison,
  useGetRecentPricingChanges,
  useGetPricingHealth,
  useResolvedApiQuery,
} from '../../../common';
import { EmptyState } from '../../modules/blocks';
import type {
  PricingDashboardKPIs,
  RouteComparisonItem,
} from '../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type RouteRow = {
  id: string;
  route: string;
  standard: string;
  wheelchair: string;
  stretcher: string;
};

type PriceChange = {
  id: string;
  title: string;
  category: string;
  categoryColor: string;
  categoryBg: string;
  iconBg: string;
  date: string;
  status: 'Active' | 'Pending';
  changedBy: string;
  oldPrice: string;
  newPrice: string;
};

type HealthItem = {
  id: string;
  text: string;
  type: 'ok' | 'warning';
};

const toNumber = (value: unknown): number => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === 'string') {
    const normalized = value.replace(/,/g, '').trim();
    const parsed = Number.parseFloat(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
};

const formatCurrency = (value: unknown) => {
  return `$${toNumber(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatCount = (value: unknown) => {
  const count = toNumber(value);
  return Number.isInteger(count)
    ? count.toLocaleString('en-US')
    : count.toLocaleString('en-US', { maximumFractionDigits: 2 });
};

const formatPercent = (value: unknown) => {
  const percent = toNumber(value);
  return `${percent.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}%`;
};

// ─── Component ──────────────────────────────────────────────────────────────

export const PricingDashboardPage = () => {
  // API Integration
  const { data: kpisData } = useResolvedApiQuery(
    useGetPricingDashboardKpis,
    null
  );
  const { data: routeComparisonData } = useResolvedApiQuery(
    useGetRouteComparison,
    null
  );
  const { data: recentChangesData } = useResolvedApiQuery(
    useGetRecentPricingChanges,
    null,
    { limit: 5 }
  );
  const { data: healthData } = useResolvedApiQuery(useGetPricingHealth, null);

  // Transform API data
  const statCards = useMemo(() => {
    const kpis: PricingDashboardKPIs = kpisData || {};
    return [
      {
        icon: (
          <AttachMoneyOutlinedIcon sx={{ fontSize: 22, color: '#2F6FED' }} />
        ),
        iconBg: '#EBF2FF',
        value: formatCurrency(kpis.monthly_revenue),
        label: 'Monthly Revenue',
        badge: 'This month',
      },
      {
        icon: (
          <TrendingUpOutlinedIcon sx={{ fontSize: 22, color: '#10B981' }} />
        ),
        iconBg: '#ECFDF5',
        value: formatCurrency(kpis.avg_trip_fare),
        label: 'Avg. Trip Fare',
        badge: 'Per ride',
      },
      {
        icon: <CategoryOutlinedIcon sx={{ fontSize: 22, color: '#6366F1' }} />,
        iconBg: '#EEF2FF',
        value: formatCount(kpis.active_service_types),
        label: 'Active Service Types',
        badge: 'Configured',
      },
      {
        icon: (
          <WorkspacePremiumOutlinedIcon
            sx={{ fontSize: 22, color: '#F59E0B' }}
          />
        ),
        iconBg: '#FFFBEB',
        value: formatPercent(kpis.premium_ride_percent),
        label: 'Premium Services',
        badge: 'Of total rides',
      },
    ];
  }, [kpisData]);

  const routeRows = useMemo(() => {
    const routes: RouteComparisonItem[] = routeComparisonData?.routes || [];
    return routes.map((route, index) => ({
      id: `${index + 1}`,
      route: route.route || '',
      standard: formatCurrency(route.standard),
      wheelchair: formatCurrency(route.wheelchair_wav),
      stretcher: formatCurrency(route.stretcher),
    }));
  }, [routeComparisonData]);

  const priceChanges = useMemo(() => {
    const changes = recentChangesData?.changes || [];
    const categoryColorMap: Record<string, { color: string; bg: string }> = {
      Standard: { color: '#2F6FED', bg: '#EBF2FF' },
      'Wheelchair (WAV)': { color: '#6366F1', bg: '#EEF2FF' },
      Stretcher: { color: '#EF4444', bg: '#FEF2F2' },
      Package: { color: '#10B981', bg: '#ECFDF5' },
    };

    return changes.map((change: any) => {
      const categoryStyle =
        categoryColorMap[change.category] || categoryColorMap.Standard;
      return {
        id: change.id,
        title: change.description || change.change_type || '',
        category: change.category || 'Standard',
        categoryColor: categoryStyle.color,
        categoryBg: categoryStyle.bg,
        iconBg: categoryStyle.bg,
        date: new Date(change.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        status: 'Active' as const,
        changedBy: change.admin_name || 'Admin',
        oldPrice: '',
        newPrice: '',
      };
    });
  }, [recentChangesData]);

  const healthItems = useMemo(() => {
    const items = healthData?.items || [];

    return items.map((item: any, index: number) => ({
      id: `${index}`,
      text: `${item.label} - ${item.detail}`,
      type: item.status === 'ok' ? ('ok' as const) : ('warning' as const),
    }));
  }, [healthData]);

  const columns: GridColSpec<RouteRow>[] = [
    {
      field: 'route',
      headerName: 'Route Destination',
      flex: 1.2,
      minWidth: 180,
      renderCell: (params) => (
        <RowStack spacing={'8px'}>
          <LocationOnOutlinedIcon sx={{ fontSize: 14, color: '#9CA3AF' }} />
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(13.5),
              color: '#111827',
            }}
          >
            {params.value}
          </Typography>
        </RowStack>
      ),
    },
    {
      field: 'standard',
      headerName: 'Standard',
      flex: 0.9,
      minWidth: 120,
      headerAlign: 'right',
      align: 'right',
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(14),
            color: '#111827',
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'wheelchair',
      headerName: 'Wheelchair (WAV)',
      flex: 1.2,
      minWidth: 150,
      headerAlign: 'right',
      align: 'right',
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(14),
            color: '#111827',
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'stretcher',
      headerName: 'Stretcher',
      flex: 0.9,
      minWidth: 120,
      headerAlign: 'right',
      align: 'right',
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(14),
            color: '#111827',
          }}
        >
          {params.value}
        </Typography>
      ),
    },
  ];

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <DashboardTitleAndDesc
          title="Pricing Management"
          desc="Manage fare zones, surcharges, packages, and pricing rules across all cities"
        />

        {/* Stat Cards */}
        <Grid container spacing={'20px'}>
          {statCards.map((card, index) => (
            <Grid key={index} size={{ xs: 6, lg: 3 }}>
              <Stack
                sx={{
                  background: '#FFFFFF',
                  border: '0.67px solid #F0F4F8',
                  borderRadius: '16px',
                  boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.08)',
                  padding: '24px',
                  height: '100%',
                }}
              >
                <RowStack justifyContent="space-between">
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '14px',
                      background: card.iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {card.icon}
                  </Box>
                  <RowStack
                    spacing={'6px'}
                    sx={{
                      background: '#F7F9FB',
                      border: '0.67px solid #E8ECF0',
                      borderRadius: '100px',
                      padding: '4px 10px',
                    }}
                  >
                    <TrendingUpIcon sx={{ fontSize: 12, color: '#10B981' }} />
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 700,
                        fontSize: pxToRem(12),
                        color: '#10B981',
                      }}
                    >
                      {card.badge}
                    </Typography>
                  </RowStack>
                </RowStack>

                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 800,
                    fontSize: pxToRem(32),
                    lineHeight: '1em',
                    letterSpacing: '-0.02em',
                    color: '#111827',
                    marginTop: '20px',
                  }}
                >
                  {card.value}
                </Typography>

                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 500,
                    fontSize: pxToRem(13.5),
                    color: '#6B7280',
                    marginTop: '14px',
                  }}
                >
                  {card.label}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>

        {/* Route Pricing Comparison Table */}
        <AppGridtable
          columns={columns}
          data={routeRows}
          initialPageSize={10}
          hidePagination
          disableRowClick
          emptyState={<EmptyState />}
          sx={{
            height: 'auto',
            width: '100%',
          }}
        >
          <Stack spacing={'3px'}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 700,
                fontSize: pxToRem(16),
                color: '#111827',
              }}
            >
              Route Pricing Comparison
            </Typography>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(13),
                color: '#6B7280',
              }}
            >
              Milton-area routes — estimated fare across service types
            </Typography>
          </Stack>
        </AppGridtable>

        {/* Bottom Grid: Recent Price Changes + Pricing Health */}
        <Stack direction="row" spacing={'20px'} sx={{ alignItems: 'stretch' }}>
          {/* Recent Pricing Changes */}
          <Stack
            sx={{
              flex: 2,
              background: '#FFFFFF',
              border: '0.67px solid #F0F4F8',
              borderRadius: '16px',
              boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.08)',
              overflow: 'hidden',
            }}
          >
            <Stack
              spacing={'3px'}
              sx={{
                padding: '20px 24px',
                borderBottom: '0.67px solid #F0F4F8',
                background: 'linear-gradient(180deg, #FAFBFC 0%, #FFFFFF 100%)',
              }}
            >
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(16),
                  color: '#111827',
                }}
              >
                Recent Pricing Changes
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(13),
                  color: '#6B7280',
                }}
              >
                Latest updates across all service types and fare zones
              </Typography>
            </Stack>

            <Stack spacing={'12px'} sx={{ padding: '24px' }}>
              {priceChanges.length > 0 ? (
                priceChanges.map((change) => (
                  <PriceChangeCard key={change.id} change={change} />
                ))
              ) : (
                <EmptyState />
              )}
            </Stack>
          </Stack>

          {/* Pricing Health */}
          <Stack
            sx={{
              flex: 1,
              background: '#FFFFFF',
              border: '0.67px solid #F0F4F8',
              borderRadius: '16px',
              boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.08)',
              overflow: 'hidden',
            }}
          >
            <Stack
              spacing={'8px'}
              sx={{
                padding: '20px 24px',
                borderBottom: '0.67px solid #F0F4F8',
                background: 'linear-gradient(180deg, #FAFBFC 0%, #FFFFFF 100%)',
              }}
            >
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(16),
                  color: '#111827',
                }}
              >
                Pricing Health
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(13),
                  color: '#6B7280',
                }}
              >
                Configuration checklist
              </Typography>
            </Stack>

            <Stack spacing={'10px'} sx={{ padding: '20px' }}>
              {healthItems.length > 0 ? (
                healthItems.map((item) => (
                  <HealthCheckItem key={item.id} item={item} />
                ))
              ) : (
                <EmptyState />
              )}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </AppDashboardLayout>
  );
};

// ─── Sub-Components ─────────────────────────────────────────────────────────

const PriceChangeCard = ({ change }: { change: PriceChange }) => (
  <Stack
    spacing={'12px'}
    sx={{
      background: '#FAFBFC',
      border: '0.67px solid #F0F4F8',
      borderRadius: '14px',
      padding: '16px',
    }}
  >
    {/* Top Row */}
    <RowStack justifyContent="space-between">
      {/* Left: Icon + Title + Category */}
      <RowStack spacing={'12px'}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            background: change.iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <AttachMoneyOutlinedIcon
            sx={{ fontSize: 16, color: change.categoryColor }}
          />
        </Box>
        <Stack>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 700,
              fontSize: pxToRem(14),
              color: '#111827',
              lineHeight: '1.5em',
            }}
          >
            {change.title}
          </Typography>
          <Box
            sx={{
              display: 'inline-flex',
              alignSelf: 'flex-start',
              padding: '2px 10px',
              borderRadius: '100px',
              background: change.categoryBg,
            }}
          >
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 700,
                fontSize: pxToRem(10.5),
                color: change.categoryColor,
              }}
            >
              {change.category}
            </Typography>
          </Box>
        </Stack>
      </RowStack>

      {/* Right: Date + Status */}
      <Stack alignItems="flex-end" spacing={'4px'}>
        <RowStack spacing={'6px'}>
          <AccessTimeOutlinedIcon sx={{ fontSize: 12, color: '#9CA3AF' }} />
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 500,
              fontSize: pxToRem(11.5),
              color: '#9CA3AF',
            }}
          >
            {change.date}
          </Typography>
        </RowStack>
        <Box
          sx={{
            padding: '2px 10px',
            borderRadius: '100px',
            background: '#ECFDF5',
          }}
        >
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 700,
              fontSize: pxToRem(10.5),
              color: '#059669',
            }}
          >
            {change.status}
          </Typography>
        </Box>
      </Stack>
    </RowStack>

    {/* Bottom Row */}
    <RowStack justifyContent="space-between">
      {/* Changed By */}
      <RowStack spacing={'8px'}>
        <PersonOutlineOutlinedIcon sx={{ fontSize: 13, color: '#9CA3AF' }} />
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 500,
            fontSize: pxToRem(12.5),
            color: '#6B7280',
          }}
        >
          {change.changedBy}
        </Typography>
      </RowStack>

      {/* Price Change */}
      <RowStack spacing={'12px'}>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 500,
            fontSize: pxToRem(13),
            color: '#9CA3AF',
          }}
        >
          {change.oldPrice}
        </Typography>
        <ArrowForwardIcon sx={{ fontSize: 14, color: '#10B981' }} />
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 800,
            fontSize: pxToRem(15),
            color: '#10B981',
          }}
        >
          {change.newPrice}
        </Typography>
      </RowStack>
    </RowStack>
  </Stack>
);

const HealthCheckItem = ({ item }: { item: HealthItem }) => {
  const isWarning = item.type === 'warning';
  return (
    <RowStack
      spacing={'12px'}
      sx={{
        background: isWarning ? '#FEF2F2' : 'rgba(232, 236, 240, 0.18)',
        border: `1.33px solid ${isWarning ? '#FECACA' : 'rgba(75, 85, 99, 0.05)'}`,
        borderRadius: '14px',
        padding: '14px 13px',
      }}
    >
      {isWarning ? (
        <ErrorOutlineIcon
          sx={{ fontSize: 15, color: '#EF4444', flexShrink: 0 }}
        />
      ) : (
        <CheckCircleOutlineIcon
          sx={{ fontSize: 15, color: '#374151', flexShrink: 0 }}
        />
      )}
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 500,
          fontSize: pxToRem(12),
          lineHeight: '1.5em',
          color: isWarning ? '#991B1B' : '#374151',
        }}
      >
        {item.text}
      </Typography>
    </RowStack>
  );
};
